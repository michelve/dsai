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

import { cn, isBrowser, mergeRefs } from '../../utils';
import { focusableSelectorString, focusableSelectors } from '../../utils/a11y/focusableSelectors';
import { trapFocus } from '../../utils/a11y/trapFocus';
import { isEscapeKey } from '../../utils/keyboard';

import { createInitialModalFSMState, getModalVisualState, modalFSMReducer } from './Modal.fsm';

import type {
  ModalBodyProps,
  ModalContextValue,
  ModalFooterProps,
  ModalHeaderProps,
  ModalProps,
  ModalTitleProps,
} from './Modal.types';

// ============================================================================
// Modal Context
// ============================================================================

const ModalContext = createContext<ModalContextValue | null>(null);

/**
 * Hook to access Modal context
 * @throws Error if used outside of Modal
 */
function useModalContext(): ModalContextValue {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('Modal compound components must be used within a Modal');
  }
  return context;
}

// ============================================================================
// Focus Trap Utilities
// ============================================================================

/**
 * Get all focusable elements within a container
 */
function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const elements = container.querySelectorAll<HTMLElement>(focusableSelectorString);
  return Array.from(elements).filter(
    (el) => el.offsetParent !== null && getComputedStyle(el).visibility !== 'hidden'
  );
}

/**
 * Focus trap hook for modal accessibility
 */
function useFocusTrap(
  isActive: boolean,
  containerRef: React.RefObject<HTMLElement | null>,
  initialFocusRef?: React.RefObject<HTMLElement>,
  returnFocusRef?: React.RefObject<HTMLElement>
): void {
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Store the previously focused element when trap activates
  useEffect(() => {
    if (isActive && isBrowser()) {
      previousActiveElement.current = document.activeElement as HTMLElement;
    }
  }, [isActive]);

  // Set initial focus when trap activates
  useEffect(() => {
    if (!isActive || !isBrowser()) {
      return;
    }

    const container = containerRef.current;
    if (!container) {
      return;
    }

    const cleanupTrap = trapFocus(container, { focusableSelectors: [...focusableSelectors] });

    // Use a small delay to ensure the modal is fully rendered and ref is set
    const timeoutId = window.setTimeout(() => {
      if (initialFocusRef?.current) {
        initialFocusRef.current.focus();
        return;
      }

      const focusableElements = getFocusableElements(container);
      const firstFocusable = focusableElements[0];

      if (firstFocusable) {
        firstFocusable.focus();
      } else {
        // If no focusable elements, focus the container itself
        container.focus();
      }
    }, 50);

    return () => {
      cleanupTrap();
      clearTimeout(timeoutId);
    };
  }, [isActive, containerRef, initialFocusRef]);

  // Return focus when trap deactivates
  useEffect(() => {
    if (isActive || !isBrowser()) {
      return;
    }

    // Return focus to the specified element or previous element
    const elementToFocus = returnFocusRef?.current || previousActiveElement.current;
    if (elementToFocus && typeof elementToFocus.focus === 'function') {
      elementToFocus.focus();
    }
  }, [isActive, returnFocusRef]);
}

/**
 * Scroll lock hook to prevent body scrolling when modal is open
 */
function useScrollLock(isActive: boolean): void {
  useEffect(() => {
    if (!isActive || !isBrowser()) {
      return;
    }

    const originalStyle = window.getComputedStyle(document.body).overflow;
    const originalPaddingRight = window.getComputedStyle(document.body).paddingRight;

    // Calculate scrollbar width to prevent layout shift
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = originalStyle;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [isActive]);
}

// ============================================================================
// Modal.Title Component
// ============================================================================

const ModalTitle = React.memo(function ModalTitle({
  children,
  as: Component = 'h5',
  className = '',
  id,
}: ModalTitleProps): React.JSX.Element {
  const context = useModalContext();
  const titleId = id || context.titleId;

  const classes = useMemo(() => cn('modal-title', className), [className]);

  return (
    <Component id={titleId} className={classes}>
      {children}
    </Component>
  );
});

ModalTitle.displayName = 'Modal.Title';

// ============================================================================
// Modal.Header Component
// ============================================================================

const ModalHeader = React.memo(
  forwardRef<HTMLDivElement, ModalHeaderProps>(function ModalHeader(
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
    const context = useModalContext();
    const handleClose = onClose || context.onClose;

    const classes = useMemo(() => cn('modal-header', className), [className]);

    // Determine if children is a string (needs wrapping in Modal.Title)
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
          <h5 id={context.titleId} className="modal-title">
            {children}
          </h5>
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

ModalHeader.displayName = 'Modal.Header';

// ============================================================================
// Modal.Body Component
// ============================================================================

const ModalBody = React.memo(
  forwardRef<HTMLDivElement, ModalBodyProps>(function ModalBody(
    { children, className = '', style, 'data-testid': dataTestId, 'data-test': dataTest },
    ref
  ) {
    const context = useModalContext();

    const classes = useMemo(() => cn('modal-body', className), [className]);

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

ModalBody.displayName = 'Modal.Body';

// ============================================================================
// Modal.Footer Component
// ============================================================================

const ModalFooter = React.memo(
  forwardRef<HTMLDivElement, ModalFooterProps>(function ModalFooter(
    { children, className = '', style, 'data-testid': dataTestId, 'data-test': dataTest },
    ref
  ) {
    const classes = useMemo(() => cn('modal-footer', className), [className]);

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

ModalFooter.displayName = 'Modal.Footer';

// ============================================================================
// Modal Component
// ============================================================================

/**
 * Modal Component
 *
 * An accessible modal dialog component using Bootstrap 5 native classes
 * with portal rendering, focus management, scroll locking, and animations.
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
 * - Focus trap within modal (Tab cycles within modal)
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
 *
 * @see https://getbootstrap.com/docs/5.3/components/modal/
 *
 * @example
 * ```tsx
 * const [isOpen, setIsOpen] = useState(false);
 *
 * <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
 *
 * <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
 *   <Modal.Header>Modal Title</Modal.Header>
 *   <Modal.Body>
 *     <p>Modal content goes here.</p>
 *   </Modal.Body>
 *   <Modal.Footer>
 *     <Button variant="secondary" onClick={() => setIsOpen(false)}>
 *       Cancel
 *     </Button>
 *     <Button variant="primary" onClick={handleSave}>
 *       Save
 *     </Button>
 *   </Modal.Footer>
 * </Modal>
 * ```
 */
const ModalBase = forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      children,
      isOpen,
      onClose,
      size = 'md',
      fullscreenBreakpoint = 'always',
      centered = false,
      scrollable = false,
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
    const titleId = titleIdProp || `modal-title-${generatedId}`;
    const bodyId = bodyIdProp || `modal-body-${generatedId}`;

    // Internal refs
    const modalRef = useRef<HTMLDivElement>(null);
    const dialogRef = useRef<HTMLDivElement>(null);

    // Initialize FSM
    const [fsmState, dispatch] = useReducer(modalFSMReducer, isOpen, createInitialModalFSMState);

    // Local state to trigger CSS transition for animated modals
    // For CSS transitions to work with Bootstrap's fade class, we need to:
    // 1. First render modal with 'fade' class (opacity: 0)
    // 2. Force a browser repaint
    // 3. Add 'show' class to trigger transition to opacity: 1
    // Fix: If isOpen is true on initial mount with animated, start with show class
    // to avoid the "logically open but visually hidden" bug
    const [animatedShowClass, setAnimatedShowClass] = useState(() => isOpen && animated);

    // For non-animated modals, derive showClass directly from FSM state
    // For animated modals, use the delayed state that triggers CSS transitions
    // When closing/closed, always false to trigger fade-out
    const showClass = animated
      ? fsmState.visibility === 'closing' || fsmState.visibility === 'closed'
        ? false
        : animatedShowClass
      : fsmState.visibility === 'opening' || fsmState.visibility === 'open';

    // Handle adding 'show' class after repaint for CSS transitions (animated modals only)
    useEffect(() => {
      if (!animated) {
        // Non-animated modals derive showClass from FSM state, no effect needed
        return undefined;
      }

      if (fsmState.visibility === 'opening' && !animatedShowClass) {
        // Wait for browser to paint modal in initial state (opacity: 0)
        // Then add 'show' class to trigger CSS transition
        let innerFrameId: number | undefined;
        const frameId = requestAnimationFrame(() => {
          // Double rAF ensures browser has painted before we add 'show'
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

      // Reset animatedShowClass when fully closed (via setTimeout to avoid sync setState)
      if (fsmState.visibility === 'closed' && animatedShowClass) {
        const timeoutId = setTimeout(() => {
          setAnimatedShowClass(false);
        }, 0);
        return () => clearTimeout(timeoutId);
      }

      return undefined;
    }, [animated, fsmState.visibility, animatedShowClass]);

    // Sync FSM with isOpen prop
    useEffect(() => {
      if (isOpen && fsmState.visibility === 'closed') {
        dispatch({ type: 'OPEN' });
      } else if (!isOpen && (fsmState.visibility === 'open' || fsmState.visibility === 'opening')) {
        dispatch({ type: 'CLOSE' });
      }
    }, [isOpen, fsmState.visibility]);

    // Focus trap
    useFocusTrap(fsmState.focusTrapActive, dialogRef, initialFocusRef, returnFocusRef);

    // Scroll lock
    useScrollLock(fsmState.scrollLockActive);

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
    const handleBackdropClick = useCallback(
      (event: React.MouseEvent<HTMLDivElement>) => {
        // Only close if clicking directly on the backdrop (modal container), not the dialog
        if (event.target !== modalRef.current) {
          return;
        }

        if (staticBackdrop) {
          // Highlight the modal (Bootstrap uses a pulse animation)
          dialogRef.current?.classList.add('modal-static');
          setTimeout(() => {
            dialogRef.current?.classList.remove('modal-static');
          }, 300);
          return;
        }

        if (closeOnBackdropClick) {
          onClose();
        }
      },
      [closeOnBackdropClick, staticBackdrop, onClose]
    );

    // Handle keyboard events on the modal element (for accessibility compliance)
    const handleModalKeyDown = useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        // ESC key is handled via document listener, but we need a keyboard handler
        // to pair with onClick for accessibility compliance
        if (isEscapeKey(event) && closeOnEscape && fsmState.visibility === 'open') {
          event.preventDefault();
          onClose();
        }
      },
      [closeOnEscape, fsmState.visibility, onClose]
    );

    // Handle animation end
    const handleTransitionEnd = useCallback(
      (event: React.TransitionEvent<HTMLDivElement>) => {
        // Only respond to opacity transitions on the modal element
        if (event.propertyName !== 'opacity' || event.target !== modalRef.current) {
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

    // For non-animated modals, trigger animation end immediately and call callbacks
    const prevVisibilityRef = useRef(fsmState.visibility);
    useEffect(() => {
      const prevVisibility = prevVisibilityRef.current;
      const currentVisibility = fsmState.visibility;
      prevVisibilityRef.current = currentVisibility;

      if (animated) {
        return undefined;
      }

      // Handle opening transition for non-animated
      if (currentVisibility === 'opening') {
        dispatch({ type: 'ANIMATION_END' });
        return undefined;
      }

      // Handle closing transition for non-animated
      if (currentVisibility === 'closing') {
        dispatch({ type: 'ANIMATION_END' });
        return undefined;
      }

      // Trigger callbacks when transition completes
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
    }, [animated, fsmState.visibility, onOpened, onClosed]);

    // Handle initial open state (modal started as open)
    // For non-animated modals, call onOpened immediately when modal starts open
    const initialOpenHandled = useRef(false);
    useEffect(() => {
      if (!animated && fsmState.visibility === 'open' && !initialOpenHandled.current) {
        initialOpenHandled.current = true;
        const timeoutId = setTimeout(() => {
          onOpened?.();
        }, 0);
        return () => clearTimeout(timeoutId);
      }
      return undefined;
    }, [animated, fsmState.visibility, onOpened]);

    // Compute modal classes
    const modalClasses = useMemo(
      () => cn('modal', animated && 'fade', showClass && 'show', className),
      [animated, showClass, className]
    );

    // Compute dialog classes
    const dialogClasses = useMemo(() => {
      const sizeClass =
        size === 'fullscreen'
          ? fullscreenBreakpoint === 'always'
            ? 'modal-fullscreen'
            : `modal-fullscreen-${fullscreenBreakpoint}`
          : size !== 'md'
            ? `modal-${size}`
            : '';

      return cn(
        'modal-dialog',
        sizeClass,
        centered && 'modal-dialog-centered',
        scrollable && 'modal-dialog-scrollable'
      );
    }, [size, fullscreenBreakpoint, centered, scrollable]);

    // Compute modal styles
    const modalStyles = useMemo(
      () => ({
        display: fsmState.shouldRender ? 'block' : 'none',
        zIndex,
        ...style,
      }),
      [fsmState.shouldRender, zIndex, style]
    );

    // Compute backdrop styles
    const backdropStyles = useMemo(
      () => ({
        zIndex: zIndex - 1,
      }),
      [zIndex]
    );

    // Context value for subcomponents
    const contextValue = useMemo<ModalContextValue>(
      () => ({
        onClose,
        titleId,
        bodyId,
        scrollable,
      }),
      [onClose, titleId, bodyId, scrollable]
    );

    // Don't render anything if not needed
    if (!fsmState.shouldRender) {
      return null;
    }

    // Get portal container
    const portalContainer = container || (isBrowser() ? document.body : null);

    if (!portalContainer) {
      return null;
    }

    const modalContent = (
      <ModalContext.Provider value={contextValue}>
        {/* Backdrop */}
        {backdrop && (
          <div
            className={`modal-backdrop fade ${showClass ? 'show' : ''}`}
            style={backdropStyles}
            aria-hidden="true"
          />
        )}

        {/* Modal */}
        {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- Dialog backdrop click is a standard modal pattern per Bootstrap 5 and ARIA APG */}
        <div
          ref={mergeRefs(modalRef, ref)}
          className={modalClasses}
          style={modalStyles}
          id={id}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={bodyId}
          tabIndex={-1}
          onClick={handleBackdropClick}
          onKeyDown={handleModalKeyDown}
          onTransitionEnd={animated ? handleTransitionEnd : undefined}
          data-testid={dataTestId}
          data-test={dataTest}
          data-visual-state={getModalVisualState(fsmState)}
        >
          <div ref={dialogRef} className={dialogClasses}>
            <div className="modal-content">{children}</div>
          </div>
        </div>
      </ModalContext.Provider>
    );

    return createPortal(modalContent, portalContainer);
  }
);

ModalBase.displayName = 'Modal';

// Create compound component
type ModalComponent = typeof ModalBase & {
  Header: typeof ModalHeader;
  Title: typeof ModalTitle;
  Body: typeof ModalBody;
  Footer: typeof ModalFooter;
};

export const Modal = ModalBase as ModalComponent;
Modal.Header = ModalHeader;
Modal.Title = ModalTitle;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;
