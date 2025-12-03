import {
  arrow,
  autoUpdate,
  flip,
  FloatingArrow,
  FloatingPortal,
  offset,
  shift,
  useClick,
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

import {
  createInitialTooltipFSMState,
  getTooltipVisualState,
  tooltipFSMReducer,
} from './Tooltip.fsm';

import type { TooltipPlacement, TooltipProps, TooltipTrigger } from './Tooltip.types';
import type { Placement } from '@floating-ui/react';
import type { ReactElement } from 'react';

const TOOLTIP_ARROW_GAP_PX = 6;
const TOOLTIP_ARROW_WIDTH_PX = 12;
const TOOLTIP_ARROW_HEIGHT_PX = 6;
const TOOLTIP_TRANSITION_MS = 150;

/**
 * Map DSAi placement to Floating UI placement
 */
function mapPlacement(placement: TooltipPlacement): Placement {
  return placement as Placement;
}

/**
 * Normalize trigger prop to array
 */
function normalizeTriggers(trigger: TooltipTrigger | TooltipTrigger[]): TooltipTrigger[] {
  return Array.isArray(trigger) ? trigger : [trigger];
}

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
      showDelay = 0,
      hideDelay = 0,
      arrow: showArrow = true,
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
        offset(offsetValue + (showArrow ? TOOLTIP_ARROW_GAP_PX : 0)),
        flip({ fallbackAxisSideDirection: 'start' }),
        shift({ padding: 5 }),
        // eslint-disable-next-line react-hooks/refs -- Floating UI documented pattern: arrow middleware requires ref object
        arrow({ element: arrowRef }),
      ],
      [offsetValue, showArrow]
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

    // Interaction hooks
    const hover = useHover(context, {
      enabled: hasHover && !disabled,
      delay: {
        open: showDelay,
        close: hideDelay,
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

    const role = useRole(context, { role: 'tooltip' });

    const { getReferenceProps, getFloatingProps } = useInteractions([
      hover,
      focus,
      click,
      dismiss,
      role,
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

      return cloneElement(
        child,
        getReferenceProps({
          ref: mergedRef,
          'aria-describedby': isOpen ? tooltipId : undefined,
        })
      );
    }, [children, child, getReferenceProps, mergedRef, isOpen, tooltipId]);

    // Compute tooltip styles
    const tooltipStyles = useMemo(() => {
      const { transform: floatingTransform, ...floatingRest } = floatingStyles;
      const { transform: transitionTransform, ...transitionRest } = transitionStyles;

      const combinedTransform = [floatingTransform, transitionTransform].filter(Boolean).join(' ');

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
      const classes = ['tooltip', 'bs-tooltip-auto', 'show'];
      if (className) {
        classes.push(className);
      }
      return classes.join(' ');
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
        {showArrow && (
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
