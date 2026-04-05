import React, {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';

import { useFocusTrap } from '../../hooks/useFocusTrap';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useScrollLock } from '../../hooks/useScrollLock';
import { cn, isBrowser, mergeRefs } from '../../utils';
import { isEscapeKey } from '../../utils/keyboard';
import { Heading } from '../Typography';

import { createInitialSheetFSMState, getSheetVisualState, sheetFSMReducer } from './Sheet.fsm';

import type {
  SheetBodyProps,
  SheetContextValue,
  SheetFooterProps,
  SheetHeaderProps,
  SheetPlacement,
  SheetProps,
  SheetTitleProps,
} from './Sheet.types';

// ============================================================================
// Sheet Context
// ============================================================================

const SheetContext = createContext<SheetContextValue | null>(null);

/**
 * Hook to access Sheet context
 * @throws Error if used outside of Sheet
 */
function useSheetContext(): SheetContextValue {
  const context = useContext(SheetContext);
  if (!context) {
    throw new Error('Sheet compound components must be used within a Sheet');
  }
  return context;
}

// ============================================================================
// Extracted helpers (reduce per-component complexity)
// ============================================================================

/**
 * Derive the CSS 'show' class state for the sheet.
 */
function deriveSheetShowClass(
  shouldAnimate: boolean,
  visibility: string,
  animatedShowClass: boolean,
): boolean {
  if (shouldAnimate) {
    const isClosingOrClosed = visibility === 'closing' || visibility === 'closed';
    return isClosingOrClosed ? false : animatedShowClass;
  }
  return visibility === 'opening' || visibility === 'open';
}

// ============================================================================
// Sheet.Title Component
// ============================================================================

const SheetTitle = React.memo(function SheetTitle({
  children,
  as: Component = 'h5',
  className = '',
  id,
}: SheetTitleProps): React.JSX.Element {
  const context = useSheetContext();
  const titleId = id ?? context.titleId;

  const classes = useMemo(() => cn('offcanvas-title', className), [className]);

  return (
    <Component id={titleId} className={classes}>
      {children}
    </Component>
  );
});

SheetTitle.displayName = 'Sheet.Title';

// ============================================================================
// Sheet.Header Component
// ============================================================================

const SheetHeader = React.memo(
  forwardRef<HTMLDivElement, SheetHeaderProps>(function SheetHeader(
    {
      children,
      closeButton = true,
      onClose,
      className = '',
      style,
      'data-testid': dataTestId,
      'data-test': dataTest,
    },
    ref
  ) {
    const context = useSheetContext();
    const handleClose = onClose ?? context.onClose;

    const classes = useMemo(() => cn('offcanvas-header', className), [className]);

    // Determine if children is a string (needs wrapping in Sheet.Title)
    const isStringChild = typeof children === 'string';

    return (
      <div
        ref={ref}
        className={classes}
        style={style}
        data-testid={dataTestId}
        data-test={dataTest}
      >
        {isStringChild ? (
          <Heading level={5} id={context.titleId} className="offcanvas-title">
            {children}
          </Heading>
        ) : (
          children
        )}
        {closeButton && (
          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            onClick={() => handleClose?.()}
          />
        )}
      </div>
    );
  })
);

SheetHeader.displayName = 'Sheet.Header';

// ============================================================================
// Sheet.Body Component
// ============================================================================

const SheetBody = React.memo(
  forwardRef<HTMLDivElement, SheetBodyProps>(function SheetBody(
    { children, className = '', style, 'data-testid': dataTestId, 'data-test': dataTest },
    ref
  ) {
    const context = useSheetContext();

    // flex-grow-1 ensures body takes remaining space, pushing footer to bottom
    const classes = useMemo(() => cn('offcanvas-body', 'flex-grow-1', className), [className]);

    return (
      <div
        ref={ref}
        id={context.bodyId}
        className={classes}
        style={style}
        data-testid={dataTestId}
        data-test={dataTest}
      >
        {children}
      </div>
    );
  })
);

SheetBody.displayName = 'Sheet.Body';

// ============================================================================
// Sheet.Footer Component
// ============================================================================

const SheetFooter = React.memo(
  forwardRef<HTMLDivElement, SheetFooterProps>(function SheetFooter(
    { children, className = '', style, 'data-testid': dataTestId, 'data-test': dataTest },
    ref
  ) {
    // Use modal-footer for styling + mt-auto to push footer to bottom of sheet
    // flex-shrink-0 prevents footer from shrinking when body has overflow
    // border-top adds visual separator, p-3 adds consistent padding
    // gap-3 adds 16px spacing between children, justify-content-between spreads them
    const classes = useMemo(
      () =>
        cn(
          'modal-footer',
          'mt-auto',
          'p-3',
          'gap-3',
          'flex-shrink-0',
          'border-top',
          'justify-content-between',
          className
        ),
      [className]
    );

    return (
      <div
        ref={ref}
        className={classes}
        style={style}
        data-testid={dataTestId}
        data-test={dataTest}
      >
        {children}
      </div>
    );
  })
);

SheetFooter.displayName = 'Sheet.Footer';

// ============================================================================
// Size Constants
// ============================================================================

/**
 * Size values in pixels for each size variant
 * Used for left/right (width) and top/bottom (height) placements
 */
const SIZE_VALUES = new Map<string, string>([
  ['sm', '320px'],
  ['md', '400px'],
  ['lg', '540px'],
  ['xl', '720px'],
  ['full', '100%'],
  ['auto', 'auto'],
]);

const DEFAULT_SIZE = '400px';

/**
 * Get CSS dimension value based on size and custom dimension
 */
function getDimensionValue(size: string, customDimension: string | number | undefined): string {
  if (customDimension !== undefined) {
    return typeof customDimension === 'number' ? `${customDimension}px` : customDimension;
  }
  return SIZE_VALUES.get(size) ?? DEFAULT_SIZE;
}

/**
 * Map placement to Bootstrap Offcanvas class suffix
 * Bootstrap uses RTL-aware naming: left→start, right→end
 */
function getPlacementClass(placement: SheetPlacement): string {
  switch (placement) {
    case 'left':
      return 'offcanvas-start';
    case 'right':
      return 'offcanvas-end';
    case 'top':
      return 'offcanvas-top';
    case 'bottom':
      return 'offcanvas-bottom';
    default:
      return 'offcanvas-end';
  }
}

// ============================================================================
// Sheet Component
// ============================================================================

/**
 * Sheet Component
 *
 * An accessible slide-out panel component for navigation, forms, and secondary content.
 * Supports all four placement positions (left, right, top, bottom) with smooth animations.
 *
 * SECURITY FEATURES:
 * - Prop whitelisting (no unrestricted prop spreading)
 * - Explicit event handlers only
 * - No dangerouslySetInnerHTML
 *
 * ACCESSIBILITY FEATURES (WCAG 2.2 AA):
 * - role="dialog" for screen readers
 * - aria-modal="true" to indicate modal context
 * - aria-labelledby pointing to header
 * - aria-describedby pointing to body
 * - Focus trap within sheet (Tab cycles within sheet)
 * - Focus first focusable element on open
 * - Restore focus to trigger on close
 * - ESC key to close
 * - Body scroll lock when open
 *
 * PERFORMANCE FEATURES:
 * - Memoized subcomponents
 * - Memoized class name construction
 * - FSM for predictable state management
 * - Portal rendering for z-index isolation
 * - GPU-accelerated transform animations
 *
 * @example
 * ```tsx
 * const [isOpen, setIsOpen] = useState(false);
 *
 * <Button onClick={() => setIsOpen(true)}>Open Sheet</Button>
 *
 * <Sheet isOpen={isOpen} onClose={() => setIsOpen(false)} placement="right">
 *   <Sheet.Header>Settings</Sheet.Header>
 *   <Sheet.Body>
 *     <p>Sheet content goes here.</p>
 *   </Sheet.Body>
 *   <Sheet.Footer>
 *     <Button variant="secondary" onClick={() => setIsOpen(false)}>
 *       Cancel
 *     </Button>
 *     <Button variant="primary" onClick={handleSave}>
 *       Save
 *     </Button>
 *   </Sheet.Footer>
 * </Sheet>
 * ```
 */
const SheetBase = forwardRef<HTMLDivElement, SheetProps>(
  (
    {
      children,
      isOpen,
      onClose,
      placement = 'right',
      size = 'md',
      surface = 'default',
      mode = 'modal',
      closeOnBackdropClick = true,
      closeOnEscape = true,
      backdrop = true,
      staticBackdrop = false,
      titleId: titleIdProp,
      bodyId: bodyIdProp,
      container,
      onOpened,
      onClosed,
      initialFocusRef,
      returnFocusRef,
      zIndex = 1055,
      animated = true,
      // API compatibility: `scrollable` is accepted but unused because Bootstrap's
      // offcanvas-body handles scrolling natively via overflow-y: auto.
      scrollable: _scrollable = true,
      width,
      height,
      className = '',
      style,
      id,
      'data-testid': dataTestId,
      'data-test': dataTest,
    },
    ref
  ) => {
    // Generate unique IDs for accessibility
    const generatedId = useId();
    const titleId = titleIdProp ?? `sheet-title-${generatedId}`;
    const bodyId = bodyIdProp ?? `sheet-body-${generatedId}`;

    // Internal ref for the offcanvas element (used for focus trap and animations)
    const sheetRef = useRef<HTMLDivElement>(null);

    // Determine if this is a modal sheet (needs scroll lock and focus trap)
    const isModalMode = mode === 'modal';

    // Respect user's reduced motion preference (WCAG 2.2 AA compliance)
    const prefersReducedMotion = useReducedMotion();
    const shouldAnimate = animated && !prefersReducedMotion;

    // Initialize FSM
    const [fsmState, dispatch] = useReducer(sheetFSMReducer, isOpen, createInitialSheetFSMState);

    // Local state to trigger CSS transition for animated sheets
    const [animatedShowClass, setAnimatedShowClass] = useState(() => isOpen && shouldAnimate);

    // For non-animated sheets, derive showClass directly from FSM state
    const showClass = deriveSheetShowClass(shouldAnimate, fsmState.visibility, animatedShowClass);

    // Handle adding 'show' class after repaint for CSS transitions
    useEffect(() => {
      if (!shouldAnimate) {
        return undefined;
      }

      if (fsmState.visibility === 'opening' && !animatedShowClass) {
        let innerFrameId: number | undefined;
        const frameId = requestAnimationFrame(() => {
          innerFrameId = requestAnimationFrame(() => {
            setAnimatedShowClass(true);
          });
        });
        return () => {
          cancelAnimationFrame(frameId);
          if (innerFrameId !== undefined) {
            cancelAnimationFrame(innerFrameId);
          }
        };
      }

      if (fsmState.visibility === 'closed' && animatedShowClass) {
        const timeoutId = setTimeout(() => {
          setAnimatedShowClass(false);
        }, 0);
        return () => clearTimeout(timeoutId);
      }

      return undefined;
    }, [shouldAnimate, fsmState.visibility, animatedShowClass]);

    // Sync FSM with isOpen prop
    useEffect(() => {
      if (isOpen && fsmState.visibility === 'closed') {
        dispatch({ type: 'OPEN' });
      } else if (!isOpen && (fsmState.visibility === 'open' || fsmState.visibility === 'opening')) {
        dispatch({ type: 'CLOSE' });
      }
    }, [isOpen, fsmState.visibility]);

    // Focus trap - only for modal mode
    useFocusTrap({
      enabled: isModalMode && fsmState.focusTrapActive,
      containerRef: sheetRef,
      initialFocusRef,
      finalFocusRef: returnFocusRef,
      initialFocusDelay: 50,
    });

    // Scroll lock - only for modal mode
    useScrollLock({ enabled: isModalMode && fsmState.scrollLockActive });

    // Handle ESC key
    useEffect(() => {
      if (!closeOnEscape || fsmState.visibility !== 'open') {
        return;
      }

      const handleKeyDown = (event: KeyboardEvent): void => {
        if (isEscapeKey(event)) {
          event.preventDefault();
          onClose();
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }, [closeOnEscape, fsmState.visibility, onClose]);

    // Handle backdrop click
    const handleBackdropClick = useCallback(() => {
      if (staticBackdrop) {
        // Bootstrap Modal uses 'modal-static' for the shake effect
        // Offcanvas doesn't have this built-in, but consuming apps can style it
        const STATIC_SHAKE_DURATION_MS = 300;
        sheetRef.current?.classList.add('offcanvas-static');
        setTimeout(() => {
          sheetRef.current?.classList.remove('offcanvas-static');
        }, STATIC_SHAKE_DURATION_MS);
        return;
      }

      if (closeOnBackdropClick && isModalMode) {
        onClose();
      }
    }, [closeOnBackdropClick, staticBackdrop, isModalMode, onClose]);

    // Handle animation end
    const handleTransitionEnd = useCallback(
      (event: React.TransitionEvent<HTMLDivElement>) => {
        // Only respond to transform transitions on the offcanvas element
        if (event.propertyName !== 'transform' || event.target !== sheetRef.current) {
          return;
        }

        dispatch({ type: 'ANIMATION_END' });

        if (fsmState.visibility === 'opening') {
          onOpened?.();
        } else if (fsmState.visibility === 'closing') {
          onClosed?.();
        }
      },
      [fsmState.visibility, onOpened, onClosed]
    );

    // For non-animated sheets, trigger animation end immediately
    const prevVisibilityRef = useRef(fsmState.visibility);
    useEffect(() => {
      const prevVisibility = prevVisibilityRef.current;
      const currentVisibility = fsmState.visibility;
      prevVisibilityRef.current = currentVisibility;

      if (shouldAnimate) {
        return undefined;
      }

      if (currentVisibility === 'opening') {
        dispatch({ type: 'ANIMATION_END' });
        return undefined;
      }

      if (currentVisibility === 'closing') {
        dispatch({ type: 'ANIMATION_END' });
        return undefined;
      }

      if (prevVisibility === 'opening' && currentVisibility === 'open') {
        const timeoutId = setTimeout(() => {
          onOpened?.();
        }, 0);
        return () => clearTimeout(timeoutId);
      }

      if (prevVisibility === 'closing' && currentVisibility === 'closed') {
        const timeoutId = setTimeout(() => {
          onClosed?.();
        }, 0);
        return () => clearTimeout(timeoutId);
      }

      return undefined;
    }, [shouldAnimate, fsmState.visibility, onOpened, onClosed]);

    // Handle initial open state
    const initialOpenHandled = useRef(false);
    useEffect(() => {
      if (!shouldAnimate && fsmState.visibility === 'open' && !initialOpenHandled.current) {
        initialOpenHandled.current = true;
        const timeoutId = setTimeout(() => {
          onOpened?.();
        }, 0);
        return () => clearTimeout(timeoutId);
      }
      return undefined;
    }, [shouldAnimate, fsmState.visibility, onOpened]);

    // Compute offcanvas classes using Bootstrap's native Offcanvas classes
    const offcanvasClasses = useMemo(
      () =>
        cn(
          'offcanvas',
          getPlacementClass(placement),
          // Bootstrap transition states
          fsmState.visibility === 'opening' && 'showing',
          fsmState.visibility === 'closing' && 'hiding',
          showClass && 'show',
          // DSAi extensions for surface variants (consuming apps style via SCSS)
          surface !== 'default' && `offcanvas-${surface}`,
          className
        ),
      [placement, fsmState.visibility, showClass, surface, className]
    );

    // Compute offcanvas styles - Bootstrap uses CSS custom properties
    const isHorizontal = placement === 'left' || placement === 'right';
    const dimension = isHorizontal
      ? getDimensionValue(size, width)
      : getDimensionValue(size, height);

    const offcanvasStyles = useMemo(
      () => ({
        // Bootstrap uses --bs-offcanvas-width and --bs-offcanvas-height CSS vars
        ...(isHorizontal
          ? { '--bs-offcanvas-width': dimension }
          : { '--bs-offcanvas-height': dimension }),
        visibility: fsmState.shouldRender ? 'visible' : 'hidden',
        zIndex,
        ...style,
      }),
      [isHorizontal, dimension, fsmState.shouldRender, zIndex, style]
    ) as React.CSSProperties;

    // Compute backdrop styles
    const backdropStyles = useMemo(
      () => ({
        zIndex: zIndex - 1,
      }),
      [zIndex]
    );

    // Context value for subcomponents
    const contextValue = useMemo<SheetContextValue>(
      () => ({
        onClose,
        titleId,
        bodyId,
        placement,
      }),
      [onClose, titleId, bodyId, placement]
    );

    // Don't render anything if not needed
    if (!fsmState.shouldRender) {
      return null;
    }

    // Get portal container
    const portalContainer = container ?? (isBrowser() ? document.body : null);

    if (!portalContainer) {
      return null;
    }

    const sheetContent = (
      <SheetContext.Provider value={contextValue}>
        {/* Backdrop - using <div> with aria-hidden (matches Modal pattern) */}
        {isModalMode && backdrop && (
          <div
            className={cn('offcanvas-backdrop', shouldAnimate && 'fade', showClass && 'show')}
            style={backdropStyles}
            aria-hidden="true"
            onClick={handleBackdropClick}
          />
        )}

        {/* Offcanvas - using Bootstrap's native structure */}
        <div
          ref={mergeRefs(sheetRef, ref)}
          className={offcanvasClasses}
          style={offcanvasStyles}
          id={id}
          role="dialog"
          aria-modal={isModalMode ? 'true' : undefined}
          aria-labelledby={titleId}
          aria-describedby={bodyId}
          tabIndex={-1}
          data-testid={dataTestId}
          data-test={dataTest}
          data-visual-state={getSheetVisualState(fsmState)}
          data-placement={placement}
          onTransitionEnd={shouldAnimate ? handleTransitionEnd : undefined}
        >
          {children}
        </div>
      </SheetContext.Provider>
    );

    return createPortal(sheetContent, portalContainer);
  }
);

SheetBase.displayName = 'Sheet';

// Create compound component
type SheetComponent = typeof SheetBase & {
  Header: typeof SheetHeader;
  Title: typeof SheetTitle;
  Body: typeof SheetBody;
  Footer: typeof SheetFooter;
};

export const Sheet = SheetBase as SheetComponent;
Sheet.Header = SheetHeader;
Sheet.Title = SheetTitle;
Sheet.Body = SheetBody;
Sheet.Footer = SheetFooter;
