import {
  arrow,
  autoUpdate,
  flip,
  FloatingArrow,
  FloatingPortal,
  offset,
  shift,
  useClick,
  useClientPoint,
  useDelayGroup,
  useDelayGroupContext,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useMergeRefs,
  useRole,
  useTransitionStyles,
} from '@floating-ui/react';
import { cloneElement, forwardRef, useEffect, useId, useMemo, useReducer, useRef } from 'react';

import { cn } from '../../utils';
import { mapPlacement, normalizeTriggers } from '../../utils/misc';

import {
  createInitialTooltipFSMState,
  getTooltipVisualState,
  tooltipFSMReducer,
} from './Tooltip.fsm';

import type { TooltipProps } from './Tooltip.types';
import type { ReactElement } from 'react';

import { useTooltipContext } from './TooltipContext';
import { useTouchInteraction } from './useTouchInteraction';

const TOOLTIP_ARROW_GAP_PX = 6;
const TOOLTIP_ARROW_WIDTH_PX = 12;
const TOOLTIP_ARROW_HEIGHT_PX = 6;
const TOOLTIP_TRANSITION_MS = 150;

/**
 * Map DSAi placement to Floating UI placement
 */

/**
 * Normalize trigger prop to array
 */

/**
 * Tooltip Component
 *
 * A fully accessible tooltip component that provides contextual information
 * on hover, focus, or click. Uses Floating UI for intelligent positioning.
 *
 * ACCESSIBILITY FEATURES (WCAG 2.2 AA):
 * - role="tooltip" on the tooltip content
 * - aria-describedby linking trigger to tooltip
 * - Keyboard accessible (visible on focus)
 * - ESC key to dismiss (for click trigger)
 * - Proper focus management
 *
 * SECURITY FEATURES:
 * - Prop whitelisting (no unrestricted spread)
 * - No dangerouslySetInnerHTML
 * - Explicit event handlers only
 *
 * @exampleclear
 *
 * ```tsx
 * // Basic tooltip
 * <Tooltip content="Helpful information">
 *   <button>Hover me</button>
 * </Tooltip>
 *
 * // Tooltip with custom placement
 * <Tooltip content="Right side tooltip" placement="right">
 *   <span>Target element</span>
 * </Tooltip>
 *
 * // Click-triggered tooltip
 * <Tooltip content="Click to dismiss" trigger="click">
 *   <button>Click me</button>
 * </Tooltip>
 * ```
 */
export const Tooltip = forwardRef<HTMLElement, TooltipProps>(
  (
    {
      children,
      content,
      placement = 'top',
      trigger = ['hover', 'focus'],
      showDelay,
      hideDelay,
      describeChild,
      followCursor,
      touchEnabled,
      arrow: showArrow,
      offset: offsetValue = 8,
      maxWidth,
      isOpen: controlledIsOpen,
      onOpenChange,
      defaultOpen = false,
      disabled = false,
      portal = true,
      container,
      className = '',
      style,
      id,
      'data-testid': dataTestId,
      'data-test': dataTest,
      'aria-label': ariaLabel,
    },
    ref
  ) => {
    // Read provider defaults
    const ctx = useTooltipContext();

    // Resolve props: instance > provider > built-in defaults
    const resolvedShowDelay = showDelay ?? ctx.showDelay;
    const resolvedHideDelay = hideDelay ?? ctx.hideDelay;
    const resolvedArrow = showArrow ?? ctx.arrow;
    const resolvedDescribeChild = describeChild ?? ctx.describeChild;
    const resolvedTouchEnabled = touchEnabled ?? ctx.touchEnabled;

    // Follow-cursor suppresses arrow (moving tooltip + arrow is disorienting)
    const effectiveArrow = followCursor ? false : resolvedArrow;

    if (process.env.NODE_ENV !== 'production' && followCursor && showArrow === true) {
      console.warn('Tooltip: arrow is disabled when followCursor is active.');
    }

    // Determine if controlled
    const isControlled = controlledIsOpen !== undefined;

    // Generate unique ID for tooltip
    const generatedId = useId();
    const tooltipId = id ?? `tooltip-${generatedId}`;

    // Arrow ref for Floating UI
    const arrowRef = useRef<SVGSVGElement>(null);

    // FSM for state management
    const [fsmState, dispatch] = useReducer(
      tooltipFSMReducer,
      isControlled ? controlledIsOpen : defaultOpen,
      createInitialTooltipFSMState
    );

    // Compute isOpen from FSM
    const isOpen = fsmState.visibility === 'open' || fsmState.visibility === 'opening';

    // Normalize triggers
    const triggers = useMemo(() => normalizeTriggers(trigger), [trigger]);
    const hasHover = triggers.includes('hover');
    const hasFocus = triggers.includes('focus');
    const hasClick = triggers.includes('click');

    // Build middleware array
    // Note: arrow middleware needs to be included even if showArrow is false
    // to avoid React hooks ordering issues. FloatingArrow handles visibility.
    const middleware = useMemo(
      () => [
        offset(offsetValue + (effectiveArrow ? TOOLTIP_ARROW_GAP_PX : 0)),
        flip({ fallbackAxisSideDirection: 'start' }),
        shift({ padding: 5 }),
        // eslint-disable-next-line react-hooks/refs -- Floating UI documented pattern: arrow middleware requires ref object
        arrow({ element: arrowRef }),
      ],
      [offsetValue, effectiveArrow]
    );

    // Floating UI setup
    const { refs, floatingStyles, context, update } = useFloating({
      open: fsmState.shouldRender,
      onOpenChange: (openState) => {
        if (disabled) {
          return;
        }
        if (openState) {
          dispatch({ type: 'OPEN' });
          onOpenChange?.(true);
        } else {
          dispatch({ type: 'CLOSE' });
          onOpenChange?.(false);
        }
      },
      placement: mapPlacement(placement),
      middleware,
      whileElementsMounted: autoUpdate,
    });

    // Participate in delay groups (if wrapped in TooltipGroup)
    useDelayGroup(context, { id: tooltipId });

    // Read group context for skip-delay behavior
    const { delay: groupDelay } = useDelayGroupContext();

    // Interaction hooks
    const hover = useHover(context, {
      enabled: hasHover && !disabled,
      delay: groupDelay ?? {
        open: resolvedShowDelay,
        close: resolvedHideDelay,
      },
      move: false,
    });

    const focus = useFocus(context, {
      enabled: hasFocus && !disabled,
    });

    const click = useClick(context, {
      enabled: hasClick && !disabled,
      toggle: true,
    });

    const dismiss = useDismiss(context, {
      enabled: hasClick,
      escapeKey: true,
    });

    const role = useRole(context, {
      role: resolvedDescribeChild ? 'tooltip' : 'label',
    });

    const clientPoint = useClientPoint(context, {
      enabled: !!followCursor && !disabled,
      axis: followCursor === true ? 'both' : (followCursor || 'both'),
    });

    // Touch interaction (long-press)
    const touchInteraction = useTouchInteraction({
      enabled: resolvedTouchEnabled && !disabled,
      onOpen: () => {
        dispatch({ type: 'OPEN' });
        onOpenChange?.(true);
      },
      onClose: () => {
        dispatch({ type: 'CLOSE' });
        onOpenChange?.(false);
      },
    });

    const { getReferenceProps, getFloatingProps } = useInteractions([
      hover,
      focus,
      click,
      dismiss,
      role,
      clientPoint,
    ]);

    // Transition styles for animation
    const { isMounted, styles: transitionStyles } = useTransitionStyles(context, {
      duration: TOOLTIP_TRANSITION_MS,
      initial: {
        opacity: 0,
      },
      open: {
        opacity: 1,
      },
      close: {
        opacity: 0,
      },
    });

    // Sync controlled state with FSM
    useEffect(() => {
      if (!isControlled) {
        return;
      }

      if (controlledIsOpen && fsmState.visibility === 'closed') {
        dispatch({ type: 'OPEN' });
      } else if (
        !controlledIsOpen &&
        (fsmState.visibility === 'open' || fsmState.visibility === 'opening')
      ) {
        dispatch({ type: 'CLOSE' });
      }
    }, [isControlled, controlledIsOpen, fsmState.visibility]);

    // Handle animation end
    useEffect(() => {
      if (fsmState.visibility === 'opening') {
        const frameId = requestAnimationFrame(() => {
          dispatch({ type: 'ANIMATION_END' });
        });
        return () => cancelAnimationFrame(frameId);
      }

      if (fsmState.visibility === 'closing') {
        const timeoutId = setTimeout(() => {
          dispatch({ type: 'ANIMATION_END' });
        }, TOOLTIP_TRANSITION_MS); // Match transition duration
        return () => clearTimeout(timeoutId);
      }

      return undefined;
    }, [fsmState.visibility]);

    // Force a Floating UI re-measure right after paint whenever the tooltip should render.
    // Using requestAnimationFrame ensures the reference element has a layout box before measuring,
    // preventing the tooltip from briefly appearing at (0, 0).
    useEffect(() => {
      if (!fsmState.shouldRender) {
        return undefined;
      }

      const frameId = requestAnimationFrame(() => {
        update();
      });

      return () => cancelAnimationFrame(frameId);
    }, [fsmState.shouldRender, update]);

    const child = children as ReactElement<{ ref?: React.Ref<HTMLElement> }>;
    const childRef = child?.props?.ref;

    const mergedRef = useMergeRefs([ref, refs.setReference, childRef]);

    const triggerElement = useMemo(() => {
      if (!children) {
        return null;
      }

      const ariaProps: Record<string, string | undefined> = resolvedDescribeChild
        ? { 'aria-describedby': isOpen ? tooltipId : undefined }
        : { 'aria-labelledby': isOpen ? tooltipId : undefined };

      return cloneElement(
        child,
        getReferenceProps({
          ref: mergedRef,
          ...ariaProps,
          ...(resolvedTouchEnabled ? touchInteraction : {}),
        })
      );
    }, [
      children, child, getReferenceProps, mergedRef, isOpen, tooltipId,
      resolvedDescribeChild, resolvedTouchEnabled, touchInteraction,
    ]);

    // Compute tooltip styles
    const tooltipStyles = useMemo(() => {
      const { transform: floatingTransform, ...floatingRest } = floatingStyles;
      const { transform: transitionTransform, ...transitionRest } = transitionStyles;

      const combinedTransform = cn(floatingTransform, transitionTransform);

      const baseStyles: React.CSSProperties = {
        ...floatingRest,
        ...transitionRest,
        ...style,
        zIndex: 1080, // Bootstrap tooltip z-index
      };

      if (combinedTransform) {
        baseStyles.transform = combinedTransform;
      }

      if (maxWidth !== undefined) {
        baseStyles.maxWidth = typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth;
      }

      return baseStyles;
    }, [floatingStyles, transitionStyles, style, maxWidth]);

    // Compute tooltip class names
    const tooltipClassName = useMemo(() => {
      return cn('tooltip', 'bs-tooltip-auto', 'show', className);
    }, [className]);

    // Tooltip content
    const tooltipContent = isMounted ? (
      <div
        ref={refs.setFloating}
        {...getFloatingProps()}
        id={tooltipId}
        role="tooltip"
        className={tooltipClassName}
        style={tooltipStyles}
        aria-label={ariaLabel}
        data-visual-state={getTooltipVisualState(fsmState)}
        data-testid={dataTestId}
        data-test={dataTest}
      >
        {effectiveArrow && (
          <FloatingArrow
            ref={arrowRef}
            context={context}
            className="dsai-tooltip-arrow"
            width={TOOLTIP_ARROW_WIDTH_PX}
            height={TOOLTIP_ARROW_HEIGHT_PX}
            tipRadius={0}
            style={{
              fill: 'var(--bs-tooltip-bg, #212529)',
              pointerEvents: 'none',
            }}
          />
        )}
        <div className="tooltip-inner">{content}</div>
      </div>
    ) : null;

    return (
      <>
        {triggerElement}
        {portal ? (
          <FloatingPortal root={container}>{tooltipContent}</FloatingPortal>
        ) : (
          tooltipContent
        )}
      </>
    );
  }
);

Tooltip.displayName = 'Tooltip';

export type {
  TooltipContextValue,
  TooltipFSMEvent,
  TooltipFSMState,
  TooltipPlacement,
  TooltipProps,
  TooltipTrigger,
  TooltipVisualState,
} from './Tooltip.types';
