import { forwardRef, useCallback, useEffect, useId, useMemo, useReducer, useRef } from 'react';

import { cn } from '../../utils';
import { isEnterKey } from '../../utils/keyboard';
import { getVariantClass } from '../../utils/string';
import {
  CheckCircleFillIcon,
  ExclamationTriangleFillIcon,
  InfoCircleFillIcon,
  XCircleFillIcon,
} from '../Icon';

import { createInitialToastFSMState, getToastVisualState, toastFSMReducer } from './Toast.fsm';

import type { ToastProps, ToastVariant } from './Toast.types';
import type { ReactNode } from 'react';

/**
 * Default animation duration in milliseconds
 */
const DEFAULT_ANIMATION_MS = 150;

/**
 * Default auto-dismiss duration in milliseconds
 */
const DEFAULT_DURATION_MS = 5000;

/**
 * Get the appropriate ARIA role based on toast variant
 *
 * Error/warning toasts use role="alert" for immediate announcement
 * Success/info/default toasts use role="status" for polite announcement
 *
 * @param variant - Toast variant
 * @returns ARIA role
 */
function getAriaRole(variant: ToastVariant): 'alert' | 'status' {
  return variant === 'error' || variant === 'warning' ? 'alert' : 'status';
}

/**
 * Get the appropriate aria-live value based on toast variant
 *
 * Error/warning toasts use "assertive" for immediate announcement
 * Success/info/default toasts use "polite" to wait for user pause
 *
 * @param variant - Toast variant
 * @returns aria-live value
 */
function getAriaLive(variant: ToastVariant): 'assertive' | 'polite' {
  return variant === 'error' || variant === 'warning' ? 'assertive' : 'polite';
}

/**
 * Get Bootstrap background class based on variant
 *
 * @param variant - Toast variant
 * @returns Bootstrap text-bg-* class or empty string for default
 */

/**
 * Get default icon for variant
 *
 * @param variant - Toast variant
 * @returns Icon element or null
 */
function getDefaultIcon(variant: ToastVariant): ReactNode {
  switch (variant) {
    case 'success':
      return <CheckCircleFillIcon aria-hidden size="sm" />;
    case 'error':
      return <XCircleFillIcon aria-hidden size="sm" />;
    case 'warning':
      return <ExclamationTriangleFillIcon aria-hidden size="sm" />;
    case 'info':
      return <InfoCircleFillIcon aria-hidden size="sm" />;
    default:
      return null;
  }
}

/**
 * Toast Component
 *
 * A lightweight, accessible notification component that mimics push notifications.
 * Uses Bootstrap 5 toast styling with FSM-based visibility transitions.
 *
 * ACCESSIBILITY FEATURES (WCAG 2.2 AA):
 * - role="alert" for error/warning toasts (assertive)
 * - role="status" for success/info/default toasts (polite)
 * - aria-live regions for screen reader announcements
 * - aria-atomic="true" for complete announcements
 * - Accessible close button with aria-label
 * - Supports prefers-reduced-motion
 *
 * SECURITY FEATURES:
 * - No prop spreading (explicit whitelist only)
 * - No dangerouslySetInnerHTML
 * - Explicit event handlers only
 *
 * @example
 * ```tsx
 * // Success toast
 * <Toast message="File saved!" variant="success" />
 *
 * // Error toast with title
 * <Toast
 *   title="Error"
 *   message="Failed to save changes"
 *   variant="error"
 * />
 *
 * // Auto-dismissing toast
 * <Toast
 *   message="Operation complete"
 *   variant="success"
 *   duration={3000}
 *   onClose={() => setShow(false)}
 * />
 * ```
 *
 * @see https://getbootstrap.com/docs/5.3/components/toasts/
 */
export const Toast = forwardRef<HTMLDivElement, ToastProps>(
  (
    {
      message,
      title,
      variant = 'default',
      show = true,
      dismissible = true,
      duration = DEFAULT_DURATION_MS,
      showProgress = false,
      icon,
      onClose,
      onOpen,
      closeButtonLabel = 'Close notification',
      animationDuration = DEFAULT_ANIMATION_MS,
      pauseOnFocusLoss = false,
      className,
      style,
      id,
      'data-testid': dataTestId,
      'data-test': dataTest,
      'aria-label': ariaLabel,
    },
    ref
  ) => {
    // Generate unique ID
    const generatedId = useId();
    const toastId = id ?? `toast-${generatedId}`;
    const titleId = `${toastId}-title`;
    const bodyId = `${toastId}-body`;

    // Timer ref for auto-dismiss
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const progressRef = useRef<HTMLDivElement | null>(null);
    const startTimeRef = useRef<number | null>(null);
    const remainingRef = useRef<number | null>(null);

    // FSM state
    const [fsmState, dispatch] = useReducer(toastFSMReducer, show, createInitialToastFSMState);

    // Determine effective duration (0 or false means no auto-dismiss)
    const effectiveDuration = duration === false || duration === 0 ? null : duration;

    // Clear auto-dismiss timer
    const clearTimer = useCallback((): void => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    }, []);

    // Handle dismiss action
    const handleDismiss = useCallback((): void => {
      clearTimer();
      dispatch({ type: 'DISMISS' });
    }, [clearTimer]);

    // Handle close button click
    const handleCloseClick = useCallback((): void => {
      handleDismiss();
    }, [handleDismiss]);

    // Handle keyboard events on close button
    const handleCloseKeyDown = useCallback(
      (event: React.KeyboardEvent<HTMLButtonElement>): void => {
        if (isEnterKey(event) || event.key === ' ') {
          event.preventDefault();
          handleDismiss();
        }
      },
      [handleDismiss]
    );

    // Sync show prop with FSM
    useEffect(() => {
      if (show && fsmState.visibility === 'hidden') {
        dispatch({ type: 'SHOW' });
      } else if (
        !show &&
        (fsmState.visibility === 'visible' || fsmState.visibility === 'entering')
      ) {
        dispatch({ type: 'HIDE' });
      }
    }, [show, fsmState.visibility]);

    // Handle animation end
    useEffect(() => {
      if (fsmState.visibility === 'entering') {
        const timeoutId = setTimeout(() => {
          dispatch({ type: 'ANIMATION_END' });
        }, animationDuration);
        return () => clearTimeout(timeoutId);
      }

      if (fsmState.visibility === 'exiting') {
        const timeoutId = setTimeout(() => {
          dispatch({ type: 'ANIMATION_END' });
          onClose?.();
        }, animationDuration);
        return () => clearTimeout(timeoutId);
      }

      return undefined;
    }, [fsmState.visibility, animationDuration, onClose]);

    // Handle visibility change callbacks
    useEffect(() => {
      if (fsmState.visibility === 'visible') {
        onOpen?.();
      }
    }, [fsmState.visibility, onOpen]);

    // Auto-dismiss timer
    useEffect(() => {
      if (fsmState.visibility === 'visible' && effectiveDuration !== null) {
        startTimeRef.current = Date.now();
        timerRef.current = setTimeout(() => {
          handleDismiss();
        }, effectiveDuration);

        return () => {
          clearTimer();
        };
      }
      return undefined;
    }, [fsmState.visibility, effectiveDuration, handleDismiss, clearTimer]);

    // Progress bar animation
    useEffect(() => {
      if (
        !showProgress ||
        !progressRef.current ||
        fsmState.visibility !== 'visible' ||
        effectiveDuration === null
      ) {
        return undefined;
      }

      const progressEl = progressRef.current;
      progressEl.style.transition = `width ${effectiveDuration}ms linear`;
      progressEl.style.width = '0%';

      // Trigger reflow to ensure transition starts
      void progressEl.offsetWidth;

      return () => {
        progressEl.style.transition = '';
        progressEl.style.width = '100%';
      };
    }, [showProgress, fsmState.visibility, effectiveDuration]);

    // Pause on focus loss (document visibility)
    useEffect(() => {
      if (!pauseOnFocusLoss || effectiveDuration === null) return undefined;

      const handleVisibilityChange = (): void => {
        if (document.hidden) {
          // Pause — clear timer and record remaining time
          clearTimer();
          if (startTimeRef.current !== null) {
            const elapsed = Date.now() - startTimeRef.current;
            remainingRef.current = Math.max(
              0,
              (remainingRef.current ?? effectiveDuration) - elapsed
            );
          }
          if (progressRef.current) {
            const computedWidth = getComputedStyle(progressRef.current).width;
            progressRef.current.style.transition = 'none';
            progressRef.current.style.width = computedWidth;
          }
        } else if (fsmState.visibility === 'visible') {
          // Resume — restart timer with remaining time
          const remaining = remainingRef.current ?? effectiveDuration;
          if (remaining <= 0) {
            handleDismiss();
            return;
          }
          startTimeRef.current = Date.now();
          timerRef.current = setTimeout(() => {
            handleDismiss();
          }, remaining);
          if (progressRef.current) {
            progressRef.current.style.transition = `width ${remaining}ms linear`;
            progressRef.current.style.width = '0%';
          }
        }
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);
      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }, [pauseOnFocusLoss, effectiveDuration, fsmState.visibility, clearTimer, handleDismiss]);

    // Memoize class names
    const toastClassName = useMemo(() => {
      const variantClass =
        variant !== 'default'
          ? getVariantClass(variant, {
              prefix: 'text-bg',
              map: { error: 'danger' },
            })
          : null;
      return cn('toast', 'show', variantClass, variantClass && 'border-0', className);
    }, [variant, className]);

    // Memoize styles with animation
    const toastStyles = useMemo(() => {
      const baseStyles = {
        ...style,
        '--dsai-toast-animation-duration': `${animationDuration}ms`,
        transition: `opacity var(--dsai-toast-animation-duration) ease-in-out`,
      } as React.CSSProperties;

      if (fsmState.visibility === 'entering' || fsmState.visibility === 'exiting') {
        baseStyles.opacity = fsmState.visibility === 'entering' ? 1 : 0;
      } else if (fsmState.visibility === 'visible') {
        baseStyles.opacity = 1;
      } else {
        baseStyles.opacity = 0;
      }

      return baseStyles;
    }, [style, animationDuration, fsmState.visibility]);

    // Determine close button class
    const closeButtonClass = useMemo(() => {
      return cn(
        'btn-close',
        (variant === 'success' || variant === 'error' || variant === 'info') && 'btn-close-white'
      );
    }, [variant]);

    // Get the icon to display
    const displayIcon = icon ?? getDefaultIcon(variant);

    // Don't render if not needed
    if (!fsmState.shouldRender) {
      return null;
    }

    const labelingProps =
      title && titleId
        ? { 'aria-labelledby': titleId }
        : ariaLabel
          ? { 'aria-label': ariaLabel }
          : {};

    // Render toast with header if title exists
    if (title) {
      return (
        <div
          ref={ref}
          id={toastId}
          className={toastClassName}
          style={toastStyles}
          role={getAriaRole(variant)}
          aria-live={getAriaLive(variant)}
          aria-atomic="true"
          data-visual-state={getToastVisualState(fsmState)}
          data-testid={dataTestId}
          data-test={dataTest}
          {...labelingProps}
        >
          <div className="toast-header">
            {displayIcon && (
              <span className="me-2" aria-hidden="true">
                {displayIcon}
              </span>
            )}
            <strong className="me-auto" id={titleId}>
              {title}
            </strong>
            {dismissible && (
              <button
                type="button"
                className={closeButtonClass}
                onClick={handleCloseClick}
                onKeyDown={handleCloseKeyDown}
                aria-label={closeButtonLabel}
              />
            )}
          </div>
          <div className="toast-body" id={bodyId}>
            {message}
          </div>
          {showProgress && effectiveDuration !== null && (
            <div className="progress" style={{ '--dsai-toast-progress-height': '3px', height: 'var(--dsai-toast-progress-height)', borderRadius: 0 } as React.CSSProperties}>
              <div
                ref={progressRef}
                className="progress-bar"
                role="progressbar"
                aria-label="Time remaining"
                aria-valuenow={100}
                aria-valuemin={0}
                aria-valuemax={100}
                style={{ width: '100%' }}
              />
            </div>
          )}
        </div>
      );
    }

    // Render simple toast without header
    return (
      <div
        ref={ref}
        id={toastId}
        className={`${toastClassName} align-items-center`}
        style={toastStyles}
        role={getAriaRole(variant)}
        aria-live={getAriaLive(variant)}
        aria-atomic="true"
        data-visual-state={getToastVisualState(fsmState)}
        data-testid={dataTestId}
        data-test={dataTest}
        {...labelingProps}
      >
        <div className="d-flex">
          {displayIcon && (
            <span className="me-2 ms-2 d-flex align-items-center" aria-hidden="true">
              {displayIcon}
            </span>
          )}
          <div className="toast-body" id={bodyId}>
            {message}
          </div>
          {dismissible && (
            <button
              type="button"
              className={`${closeButtonClass} me-2 ms-auto`}
              onClick={handleCloseClick}
              onKeyDown={handleCloseKeyDown}
              aria-label={closeButtonLabel}
            />
          )}
        </div>
        {showProgress && effectiveDuration !== null && (
          <div className="progress" style={{ '--dsai-toast-progress-height': '3px', height: 'var(--dsai-toast-progress-height)', borderRadius: 0 } as React.CSSProperties}>
            <div
              ref={progressRef}
              className="progress-bar"
              role="progressbar"
              aria-label="Time remaining"
              aria-valuenow={100}
              aria-valuemin={0}
              aria-valuemax={100}
              style={{ width: '100%' }}
            />
          </div>
        )}
      </div>
    );
  }
);

Toast.displayName = 'Toast';
