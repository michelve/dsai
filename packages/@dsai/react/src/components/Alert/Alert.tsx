import { useCallback, useEffect, forwardRef } from 'react';

import type { AlertHeadingProps, AlertLinkProps, AlertProps } from './Alert.types';

/**
 * Alert Link - styled link for use within alerts
 *
 * @example
 * ```tsx
 * <Alert variant="info">
 *   Check out the <Alert.Link href="/docs">documentation</Alert.Link>.
 * </Alert>
 * ```
 */
function AlertLink({ children, href, onClick, className = '' }: AlertLinkProps): JSX.Element {
  const classes = ['alert-link', className].filter(Boolean).join(' ');

  return (
    <a href={href} onClick={onClick} className={classes}>
      {children}
    </a>
  );
}

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
function AlertHeading({
  children,
  as: Component = 'h4',
  className = '',
}: AlertHeadingProps): JSX.Element {
  const classes = ['alert-heading', className].filter(Boolean).join(' ');

  return <Component className={classes}>{children}</Component>;
}

AlertHeading.displayName = 'Alert.Heading';

/**
 * Alert Component
 *
 * A Bootstrap 5 alert component for displaying important messages to users.
 * Supports multiple variants, dismissible functionality, and accessibility features.
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
 * // Dismissible alert
 * const [show, setShow] = useState(true);
 * {show && (
 *   <Alert variant="warning" dismissible onClose={() => setShow(false)}>
 *     This alert can be dismissed.
 *   </Alert>
 * )}
 *
 * // Alert with link
 * <Alert variant="danger">
 *   An error occurred. <Alert.Link href="/help">Get help</Alert.Link>.
 * </Alert>
 * ```
 *
 * Accessibility Features (WCAG 2.2 AA):
 * - Uses `role="alert"` for danger/warning variants (assertive)
 * - Uses `role="status"` for info/success variants (polite)
 * - Dismiss button has `aria-label="Close"`
 * - Keyboard accessible (Escape key to dismiss when dismissible)
 * - Proper focus management
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
    },
    ref
  ) => {
    // Determine ARIA role based on variant
    // danger/warning are assertive (role="alert"), others are polite (role="status")
    const role = variant === 'danger' || variant === 'warning' ? 'alert' : 'status';

    // Handle Escape key to dismiss
    const handleKeyDown = useCallback(
      (event: KeyboardEvent) => {
        if (dismissible && onClose && event.key === 'Escape') {
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

    // Don't render if not shown
    if (!show) {
      return null;
    }

    // Build Bootstrap class names
    const bootstrapClasses = [
      'alert', // Base Bootstrap alert class
      `alert-${variant}`, // Variant: alert-primary, alert-success, etc.
      dismissible && 'alert-dismissible', // Dismissible styling
      dismissible && 'fade show', // Animation classes for dismissible
      className, // Allow additional custom classes
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <Component
        ref={ref}
        className={bootstrapClasses}
        role={role}
        style={style}
        id={id}
        aria-live={variant === 'danger' ? 'assertive' : 'polite'}
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
          <button type="button" className="btn-close" aria-label="Close" onClick={onClose} />
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
