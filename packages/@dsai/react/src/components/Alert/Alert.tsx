import React, { forwardRef, useCallback, useEffect, useMemo, useReducer } from 'react';

import { alertFSMReducer, createInitialAlertFSMState } from './Alert.fsm';
import type { AlertHeadingProps, AlertLinkProps, AlertProps } from './Alert.types';

/**
 * Validates href to prevent XSS and dangerous protocols
 * SECURITY: Blocks javascript:, data:, text/html and other dangerous schemes
 *
 * @param href - URL to validate
 * @returns true if href is safe, false otherwise
 */
function isSafeHref(href: string | undefined): boolean {
  if (!href || typeof href !== 'string') {
    return false;
  }

  const trimmedHref = href.trim().toLowerCase();

  // Blocked protocols: javascript:, data:, text/html, vbscript:, file:
  const unsafePatterns = /^(javascript:|data:|text\/html|vbscript:|file:|about:blank)/i;

  return !unsafePatterns.test(trimmedHref);
}

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
    const safeHref = isSafeHref(href) ? href : '#';

    // External link protection: target="_blank" requires rel="noopener noreferrer"
    // This prevents the opened page from accessing window.opener
    const isExternal = target === '_blank';
    const safeRel = isExternal ? 'noopener noreferrer' : rel;

    // Memoize className construction
    const computedClassName = useMemo(
      () => ['alert-link', className].filter(Boolean).join(' '),
      [className]
    );

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
const AlertHeading = React.memo(function AlertHeading({
  children,
  as: Component = 'h4',
  className = '',
}: AlertHeadingProps): React.JSX.Element {
  const classes = useMemo(
    () => ['alert-heading', className].filter(Boolean).join(' '),
    [className]
  );

  return <Component className={classes}>{children}</Component>;
});

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
const AlertBase = forwardRef<HTMLDivElement, AlertProps>(
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
      title: titleAttr,
    },
    ref
  ) => {
    // Initialize FSM state from show prop
    const [fsmState, dispatch] = useReducer(alertFSMReducer, show, createInitialAlertFSMState);

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
      onClose?.();
    }, [onClose]);

    // Handle Escape key to dismiss - dispatch FSM event and call onClose
    const handleKeyDown = useCallback(
      (event: KeyboardEvent) => {
        if (dismissible && onClose && event.key === 'Escape') {
          dispatch({ type: 'DISMISS_ESCAPE' });
          onClose();
        }
      },
      [dismissible, onClose]
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

    // Memoize Bootstrap class names construction (must be before visibility check for hook ordering)
    const bootstrapClasses = useMemo(
      () =>
        [
          'alert', // Base Bootstrap alert class
          `alert-${variant}`, // Variant: alert-primary, alert-success, etc.
          dismissible && 'alert-dismissible', // Dismissible styling
          dismissible && 'fade show', // Animation classes for dismissible
          className, // Allow additional custom classes
        ]
          .filter(Boolean)
          .join(' '),
      [variant, dismissible, className]
    );

    // Don't render if FSM state is hidden
    if (fsmState.visibility === 'hidden') {
      return null;
    }

    return (
      <Component
        ref={ref}
        className={bootstrapClasses}
        role={role}
        style={style}
        id={id}
        aria-live={variant === 'danger' ? 'assertive' : 'polite'}
        aria-atomic={ariaAtomic}
        data-testid={dataTestId}
        data-test={dataTest}
        title={titleAttr}
        data-visual-state={fsmState.visibility}
      >
        {/* Optional icon */}
        {icon && (
          <span className="me-2 d-inline-flex align-items-center" aria-hidden="true">
            {icon}
          </span>
        )}

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
