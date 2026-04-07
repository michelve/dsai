import React, {
  cloneElement,
  forwardRef,
  isValidElement,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react';

import { useReducedMotion } from '../../hooks/useReducedMotion/useReducedMotion';
import { cn } from '../../utils';
import { isEscapeKey } from '../../utils/keyboard';
import { isSafeHref } from '../../utils/validation';

import { alertFSMReducer, createInitialAlertFSMState } from './Alert.fsm';

/** Safety timeout (ms) for dismiss animation in case transitionend does not fire */
const DISMISS_ANIMATION_SAFETY_TIMEOUT_MS = 300;

import type { AlertHeadingProps, AlertLinkProps, AlertProps } from './Alert.types';

/**
 * Alert Link - styled link for use within alerts
 * SECURITY: Validates href, prevents XSS, adds external link protection
 *
 * @example
 * ```tsx
 * <Alert variant="info">
 *   Check out the <Alert.Link href="/docs">documentation</Alert.Link>.
 * </Alert>
 *
 * // External link with target="_blank" automatically gets rel="noopener noreferrer"
 * <Alert variant="warning">
 *   <Alert.Link href="https://example.com" target="_blank">
 *     External site
 *   </Alert.Link>
 * </Alert>
 * ```
 */
const AlertLink = React.memo(
  forwardRef<HTMLAnchorElement, AlertLinkProps>(function AlertLink(
    {
      children,
      href = '#',
      onClick,
      className = '',
      target,
      rel,
      'data-testid': dataTestId,
      'data-test': dataTest,
      title,
    },
    ref
  ) {
    // Validate href against XSS patterns
    const safeHref = isSafeHref(href, { undefinedBehavior: 'unsafe' }) ? href : '#';

    // External link protection: target="_blank" requires rel="noopener noreferrer"
    // This prevents the opened page from accessing window.opener — merge with user-provided rel
    const isExternal = target === '_blank';
    const safeRel = isExternal
      ? [...new Set([...(rel ? rel.split(/\s+/) : []), 'noopener', 'noreferrer'])].join(' ')
      : rel;

    const computedClassName = cn('alert-link', className);

    return (
      <a
        ref={ref}
        href={safeHref}
        className={computedClassName}
        onClick={onClick}
        target={target}
        rel={safeRel}
        data-testid={dataTestId}
        data-test={dataTest}
        title={title}
      >
        {children}
      </a>
    );
  })
);

AlertLink.displayName = 'Alert.Link';

/**
 * Alert Heading - styled heading for use within alerts
 *
 * @example
 * ```tsx
 * <Alert variant="success">
 *   <Alert.Heading>Well done!</Alert.Heading>
 *   <p>You successfully completed the task.</p>
 * </Alert>
 * ```
 */
const AlertHeading = React.memo(
  forwardRef<HTMLHeadingElement, AlertHeadingProps>(function AlertHeading(
    { children, as: Component = 'h4', className = '' },
    ref
  ) {
    const classes = cn('alert-heading', className);

    return (
      <Component ref={ref} className={classes}>
        {children}
      </Component>
    );
  })
);

AlertHeading.displayName = 'Alert.Heading';

/**
 * Alert Component
 *
 * A Bootstrap 5 alert component for displaying important messages to users.
 * Supports multiple variants, dismissible functionality, and accessibility features.
 *
 * SECURITY FEATURES:
 * - Prop whitelisting for Alert and Alert.Link
 * - href validation to prevent XSS attacks
 * - External link protection (rel="noopener noreferrer" for target="_blank")
 *
 * ACCESSIBILITY FEATURES (WCAG 2.2 AA):
 * - Proper ARIA roles (alert vs status) based on severity
 * - aria-live announcements with aria-atomic for complete announcements
 * - Keyboard support (Escape to dismiss)
 * - Decorative icons hidden with aria-hidden
 *
 * PERFORMANCE FEATURES:
 * - Memoized class name construction
 * - Memoized subcomponents (AlertLink, AlertHeading)
 *
 * @see https://getbootstrap.com/docs/5.3/components/alerts/
 *
 * @example
 * ```tsx
 * // Basic alert
 * <Alert variant="info">This is an informational message.</Alert>
 *
 * // Alert with title
 * <Alert variant="success">
 *   <Alert.Heading>Success!</Alert.Heading>
 *   <p>Your changes have been saved successfully.</p>
 * </Alert>
 *
 * // Dismissible alert with Escape key support
 * const [show, setShow] = useState(true);
 * {show && (
 *   <Alert variant="warning" dismissible onClose={() => setShow(false)}>
 *     This alert can be dismissed.
 *   </Alert>
 * )}
 *
 * // Alert with secure external link
 * <Alert variant="danger">
 *   An error occurred. <Alert.Link href="https://example.com" target="_blank">Get help</Alert.Link>.
 * </Alert>
 *
 * // Alert with validated href (XSS prevention)
 * <Alert variant="info">
 *   Visit our <Alert.Link href="/docs">documentation</Alert.Link>.
 * </Alert>
 * ```
 */
const AlertBase = memo(
  forwardRef<HTMLDivElement, AlertProps>(
    (
      {
        children,
        variant = 'primary',
        title,
        dismissible = false,
        onClose,
        icon,
        show = true,
        className = '',
        style,
        id,
        as: Component = 'div',
        'aria-atomic': ariaAtomic = true,
        'data-testid': dataTestId,
        'data-test': dataTest,
        iconLabel,
        autoDismiss,
        transition = true,
      },
      ref
    ) => {
      // Initialize FSM state from show prop
      const [fsmState, dispatch] = useReducer(alertFSMReducer, show, createInitialAlertFSMState);

      const alertRef = useRef<HTMLDivElement | null>(null);
      const prefersReducedMotion = useReducedMotion();
      const shouldAnimate = transition && !prefersReducedMotion;

      // Synchronize external show prop with FSM
      useEffect(() => {
        dispatch({ type: show ? 'SHOW' : 'HIDE' });
      }, [show]);

      // Determine ARIA role based on variant
      // danger/warning are assertive (role="alert"), others are polite (role="status")
      const role = variant === 'danger' || variant === 'warning' ? 'alert' : 'status';

      // Handle close button click - dispatch FSM event and call onClose
      const handleClose = useCallback(() => {
        dispatch({ type: 'DISMISS_CLICK' });
        if (!shouldAnimate) {
          dispatch({ type: 'ANIMATION_END' });
        }
        onClose?.('click');
      }, [onClose, shouldAnimate]);

      // Handle Escape key to dismiss - dispatch FSM event and call onClose
      const handleKeyDown = useCallback(
        (event: KeyboardEvent) => {
          if (
            dismissible &&
            onClose &&
            isEscapeKey(event) &&
            alertRef.current?.contains(document.activeElement)
          ) {
            dispatch({ type: 'DISMISS_ESCAPE' });
            if (!shouldAnimate) {
              dispatch({ type: 'ANIMATION_END' });
            }
            onClose('escape');
          }
        },
        [dismissible, onClose, shouldAnimate]
      );

      useEffect(() => {
        if (dismissible && onClose) {
          document.addEventListener('keydown', handleKeyDown);
          return () => {
            document.removeEventListener('keydown', handleKeyDown);
          };
        }
        return undefined;
      }, [dismissible, onClose, handleKeyDown]);

      // Auto-dismiss timer
      useEffect(() => {
        if (!autoDismiss || autoDismiss <= 0 || fsmState.visibility !== 'visible') {
          return undefined;
        }

        const timerId = setTimeout(() => {
          dispatch({ type: 'AUTO_DISMISS_TIMEOUT' });
          if (!shouldAnimate) {
            dispatch({ type: 'ANIMATION_END' });
          }
          onClose?.('timeout');
        }, autoDismiss);

        return () => {
          clearTimeout(timerId);
        };
      }, [autoDismiss, fsmState.visibility, onClose, shouldAnimate]);

      // Handle dismiss animation end via CSS transitionend
      useEffect(() => {
        if (fsmState.visibility !== 'dismissing' || !shouldAnimate) {
          return undefined;
        }

        const element = alertRef.current;
        if (!element) {
          dispatch({ type: 'ANIMATION_END' });
          return undefined;
        }

        const handleTransitionEnd = (event: TransitionEvent): void => {
          // Only react to opacity transitions on this element
          if (event.target === element && event.propertyName === 'opacity') {
            dispatch({ type: 'ANIMATION_END' });
          }
        };

        element.addEventListener('transitionend', handleTransitionEnd);

        // Safety timeout in case transitionend doesn't fire (e.g., display: none)
        const safetyTimer = setTimeout(() => {
          dispatch({ type: 'ANIMATION_END' });
        }, DISMISS_ANIMATION_SAFETY_TIMEOUT_MS);

        return () => {
          element.removeEventListener('transitionend', handleTransitionEnd);
          clearTimeout(safetyTimer);
        };
      }, [fsmState.visibility, shouldAnimate]);

      // Memoize Bootstrap class names construction (must be before visibility check for hook ordering)
      const bootstrapClasses = useMemo(
        () =>
          cn(
            'alert', // Base Bootstrap alert class
            `alert-${variant}`, // Variant: alert-primary, alert-success, etc.
            dismissible && 'alert-dismissible', // Dismissible styling
            'fade', // Always include fade for transition support
            fsmState.visibility === 'visible' && 'show', // Show class for visible state
            className // Allow additional custom classes
          ),
        [variant, dismissible, className, fsmState.visibility]
      );

      const iconClasses = 'd-inline-flex align-items-center flex-shrink-0 me-2';

      const renderedIcon = useMemo(() => {
        if (!icon) {
          return null;
        }

        if (
          isValidElement<{
            className?: string;
            'aria-label'?: string;
            'aria-hidden'?: boolean;
            role?: string;
            children?: React.ReactNode;
          }>(icon)
        ) {
          const iconElement = icon;
          const existingClassName = iconElement.props.className;
          const existingAriaLabel = iconElement.props['aria-label'];
          const existingAriaHidden = iconElement.props['aria-hidden'];
          const ariaLabel = iconLabel ?? existingAriaLabel;
          const ariaHidden = iconLabel ? undefined : (existingAriaHidden ?? true);

          return cloneElement(iconElement, {
            className: cn(iconClasses, existingClassName),
            'aria-label': ariaLabel,
            'aria-hidden': ariaHidden,
            role: ariaLabel ? 'img' : iconElement.props.role,
          });
        }

        return (
          <span className={iconClasses} aria-hidden="true">
            {icon}
          </span>
        );
      }, [icon, iconLabel]);

      // Don't render if FSM state is hidden
      if (fsmState.visibility === 'hidden') {
        return null;
      }

      // Merge forwarded ref with internal alertRef
      const mergeRefs = (node: HTMLDivElement | null): void => {
        alertRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          (ref as React.RefObject<HTMLDivElement | null>).current = node;
        }
      };

      return (
        <Component
          ref={mergeRefs}
          className={bootstrapClasses}
          role={role}
          style={style}
          id={id}
          aria-live={variant === 'danger' || variant === 'warning' ? 'assertive' : 'polite'}
          aria-atomic={ariaAtomic}
          data-testid={dataTestId}
          data-test={dataTest}
          data-visual-state={fsmState.visibility}
        >
          {/* Optional icon */}
          {renderedIcon}

          {/* Optional title using Alert.Heading */}
          {title && <AlertHeading>{title}</AlertHeading>}

          {/* Alert content */}
          {children}

          {/* Dismiss button */}
          {dismissible && onClose && (
            <button type="button" className="btn-close" aria-label="Close" onClick={handleClose} />
          )}
        </Component>
      );
    }
  )
);

AlertBase.displayName = 'Alert';

// Create compound component
type AlertComponent = typeof AlertBase & {
  Link: typeof AlertLink;
  Heading: typeof AlertHeading;
};

export const Alert = AlertBase as AlertComponent;
Alert.Link = AlertLink;
Alert.Heading = AlertHeading;
