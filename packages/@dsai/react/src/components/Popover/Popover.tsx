import {
  arrow,
  autoUpdate,
  FloatingArrow,
  FloatingFocusManager,
  FloatingPortal,
  flip,
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
import {
  cloneElement,
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useReducer,
  useRef,
} from 'react';

import { mapPlacement, normalizeTriggers } from '../../utils/misc';

import {
  createInitialPopoverFSMState,
  getPopoverVisualState,
  popoverFSMReducer,
} from './Popover.fsm';
import { PopoverBody } from './PopoverBody';
import { PopoverCloseButton } from './PopoverCloseButton';
import { PopoverHeader } from './PopoverHeader';

import type { PopoverProps } from './Popover.types';
import type { ReactElement } from 'react';

const POPOVER_ARROW_GAP_PX = 8;
const POPOVER_ARROW_WIDTH_PX = 16;
const POPOVER_ARROW_HEIGHT_PX = 8;
const POPOVER_TRANSITION_MS = 150;
const DEFAULT_MAX_WIDTH = 276; // Bootstrap default

/**
 * Map DSAi placement to Floating UI placement
 */

/**
 * Normalize trigger prop to array
 */

/**
 * Popover Component
 *
 * A fully accessible popover component that provides richer interactive content
 * compared to tooltips. Uses Floating UI for intelligent positioning.
 *
 * ACCESSIBILITY FEATURES (WCAG 2.2 AA):
 * - role="dialog" on the popover content
 * - aria-labelledby linking to popover header
 * - aria-haspopup="dialog" on trigger
 * - aria-expanded on trigger
 * - ESC key to dismiss
 * - Click outside to dismiss
 * - Optional focus trap for complex content
 *
 * SECURITY FEATURES:
 * - Prop whitelisting (no unrestricted spread)
 * - No dangerouslySetInnerHTML
 * - Explicit event handlers only
 *
 * @example
 * ```tsx
 * // Basic popover
 * <Popover header="Settings" content="Configure your preferences here.">
 *   <button>Open Settings</button>
 * </Popover>
 *
 * // Popover with close button
 * <Popover header="Notification" content="You have new messages" showCloseButton>
 *   <button>Notifications</button>
 * </Popover>
 *
 * // Controlled popover
 * <Popover
 *   header="Info"
 *   content="Detailed information"
 *   isOpen={isOpen}
 *   onOpenChange={setIsOpen}
 * >
 *   <button>Toggle</button>
 * </Popover>
 * ```
 *
 * @see https://getbootstrap.com/docs/5.3/components/popovers/
 */
export const Popover = forwardRef<HTMLElement, PopoverProps>(
  (
    {
      children,
      content,
      header,
      placement = 'top',
      trigger = 'click',
      showCloseButton = false,
      closeButtonLabel = 'Close popover',
      arrow: showArrow = true,
      offset: offsetValue = 8,
      maxWidth = DEFAULT_MAX_WIDTH,
      isOpen: controlledIsOpen,
      onOpenChange,
      defaultOpen = false,
      disabled = false,
      portal = true,
      container,
      trapFocus = false,
      showDelay = 0,
      hideDelay = 0,
      closeOnClickOutside = true,
      closeOnEscape = true,
      className = '',
      style,
      id,
      'aria-label': ariaLabel,
      'data-testid': dataTestId,
      'data-test': dataTest,
    },
    ref
  ) => {
    // Generate unique IDs
    const generatedId = useId();
    const popoverId = id ?? `popover-${generatedId}`;
    const headerId = `${popoverId}-header`;
    const bodyId = `${popoverId}-body`;

    // Determine if controlled
    const isControlled = controlledIsOpen !== undefined;

    // FSM state for transitions
    const [fsmState, dispatch] = useReducer(popoverFSMReducer, undefined, () =>
      createInitialPopoverFSMState(isControlled ? controlledIsOpen : defaultOpen)
    );

    // Arrow ref
    const arrowRef = useRef<SVGSVGElement>(null);

    // Normalize triggers
    const triggers = useMemo(() => normalizeTriggers(trigger), [trigger]);
    const hasHover = triggers.includes('hover');
    const hasFocus = triggers.includes('focus');
    const hasClick = triggers.includes('click');

    // Compute isOpen from FSM (for aria attributes on trigger)
    const isOpen = fsmState.visibility === 'open' || fsmState.visibility === 'opening';

    // Build middleware array
    // Note: arrow middleware needs to be included even if showArrow is false
    // to avoid React hooks ordering issues. FloatingArrow handles visibility.
    const middleware = useMemo(
      () => [
        offset(offsetValue + (showArrow ? POPOVER_ARROW_GAP_PX : 0)),
        flip({ fallbackAxisSideDirection: 'start', padding: 8 }),
        shift({ padding: 8 }),
        // eslint-disable-next-line react-hooks/refs -- Floating UI documented pattern: arrow middleware requires ref object
        arrow({ element: arrowRef, padding: 8 }),
      ],
      [offsetValue, showArrow]
    );

    // Floating UI setup
    const { refs, floatingStyles, context, update } = useFloating({
      open: fsmState.shouldRender,
      onOpenChange: (open) => {
        if (disabled) {
          return;
        }

        if (open) {
          dispatch({ type: 'OPEN' });
        } else {
          dispatch({ type: 'CLOSE' });
        }

        onOpenChange?.(open);
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
      move: false, // Don't reposition on mouse move within trigger
    });

    const focus = useFocus(context, {
      enabled: hasFocus && !disabled,
    });

    const click = useClick(context, {
      enabled: hasClick && !disabled,
      toggle: true, // Allow clicking again to close
    });

    const dismiss = useDismiss(context, {
      enabled: closeOnClickOutside || closeOnEscape,
      outsidePressEvent: 'mousedown',
      escapeKey: closeOnEscape,
      outsidePress: closeOnClickOutside,
    });

    const role = useRole(context, {
      role: 'dialog',
    });

    // Combine all interactions
    const { getReferenceProps, getFloatingProps } = useInteractions([
      hover,
      focus,
      click,
      dismiss,
      role,
    ]);

    // Transition styles - use opacity only like Tooltip to avoid positioning issues
    const { isMounted, styles: transitionStyles } = useTransitionStyles(context, {
      duration: POPOVER_TRANSITION_MS,
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

    // Handle animation end for FSM
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
        }, POPOVER_TRANSITION_MS);
        return () => clearTimeout(timeoutId);
      }

      return undefined;
    }, [fsmState.visibility]);

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

    // Force a Floating UI re-measure right after paint whenever the popover should render.
    // Using requestAnimationFrame ensures the reference element has a layout box before measuring,
    // preventing the popover from briefly appearing at (0, 0).
    useEffect(() => {
      if (!fsmState.shouldRender) {
        return undefined;
      }

      const frameId = requestAnimationFrame(() => {
        update();
      });

      return () => cancelAnimationFrame(frameId);
    }, [fsmState.shouldRender, update]);

    // Close handler for close button
    const handleClose = useCallback((): void => {
      dispatch({ type: 'CLOSE' });
      onOpenChange?.(false);
    }, [onOpenChange]);

    // Extract child element and its ref for proper merging
    const child = children as ReactElement<{ ref?: React.Ref<HTMLElement> }>;
    const childRef = child?.props?.ref;

    // Merge refs for trigger element
    const triggerRef = useMergeRefs([ref, refs.setReference, childRef]);

    // Memoize popover class names
    const popoverClassName = useMemo(() => {
      const classes = ['popover', `bs-popover-auto`, 'show'];
      if (className) {
        classes.push(className);
      }
      return classes.join(' ');
    }, [className]);

    // Compute popover styles - properly combine transforms from floating and transition styles
    const popoverStyles = useMemo(() => {
      const { transform: floatingTransform, ...floatingRest } = floatingStyles;
      const { transform: transitionTransform, ...transitionRest } = transitionStyles;

      const combinedTransform = [floatingTransform, transitionTransform].filter(Boolean).join(' ');

      const baseStyles: React.CSSProperties = {
        ...floatingRest,
        ...transitionRest,
        ...style,
        zIndex: 1070, // Bootstrap popover z-index
      };

      if (combinedTransform) {
        baseStyles.transform = combinedTransform;
      }

      if (maxWidth !== undefined) {
        baseStyles.maxWidth = typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth;
      }

      return baseStyles;
    }, [floatingStyles, transitionStyles, style, maxWidth]);

    // Clone trigger element with ref and props
    const triggerElement = useMemo(() => {
      if (!children) {
        return null;
      }

      return cloneElement(
        child,
        getReferenceProps({
          ref: triggerRef,
          'aria-haspopup': 'dialog',
          'aria-expanded': isOpen,
          'aria-controls': isOpen ? popoverId : undefined,
        })
      );
    }, [children, child, triggerRef, getReferenceProps, isOpen, popoverId]);

    // Render popover content
    const popoverContent = useMemo(() => {
      if (!isMounted) {
        return null;
      }

      const content_element = (
        <div
          ref={refs.setFloating}
          {...getFloatingProps()}
          id={popoverId}
          className={popoverClassName}
          style={popoverStyles}
          role="dialog"
          aria-modal={trapFocus ? 'true' : undefined}
          aria-labelledby={header ? headerId : undefined}
          aria-label={!header ? ariaLabel : undefined}
          aria-describedby={bodyId}
          data-visual-state={getPopoverVisualState(fsmState)}
          data-testid={dataTestId}
          data-test={dataTest}
        >
          {/* Arrow */}
          {showArrow && (
            <FloatingArrow
              ref={arrowRef}
              context={context}
              width={POPOVER_ARROW_WIDTH_PX}
              height={POPOVER_ARROW_HEIGHT_PX}
              className="popover-arrow"
              fill="var(--bs-popover-bg, #fff)"
              stroke="var(--bs-popover-border-color, rgba(0, 0, 0, 0.175))"
              strokeWidth={1}
            />
          )}

          {/* Close button */}
          {showCloseButton && (
            <PopoverCloseButton onClick={handleClose} aria-label={closeButtonLabel} />
          )}

          {/* Header */}
          {header && <PopoverHeader id={headerId}>{header}</PopoverHeader>}

          {/* Body */}
          <PopoverBody id={bodyId}>{content}</PopoverBody>
        </div>
      );

      // Wrap in focus manager if focus trap is enabled
      if (trapFocus) {
        return (
          <FloatingFocusManager context={context} modal>
            {content_element}
          </FloatingFocusManager>
        );
      }

      return content_element;
    }, [
      isMounted,
      refs.setFloating,
      popoverId,
      popoverClassName,
      popoverStyles,
      trapFocus,
      header,
      headerId,
      ariaLabel,
      bodyId,
      fsmState,
      dataTestId,
      dataTest,
      getFloatingProps,
      showArrow,
      context,
      showCloseButton,
      handleClose,
      closeButtonLabel,
      content,
    ]);

    return (
      <>
        {triggerElement}
        {portal ? (
          <FloatingPortal root={container}>{popoverContent}</FloatingPortal>
        ) : (
          popoverContent
        )}
      </>
    );
  }
);

Popover.displayName = 'Popover';
