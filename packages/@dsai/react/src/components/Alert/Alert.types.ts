import type { CSSProperties, ReactNode } from 'react';

/**
 * Alert component variants
 * Maps to Bootstrap 5 alert contextual classes
 *
 * @see https://getbootstrap.com/docs/5.3/components/alerts/
 */
export type AlertVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'light'
  | 'dark';

/**
 * Whitelisted HTML attributes for safe prop spreading in Alert component
 * SECURITY: Restricts arbitrary props to prevent injection attacks
 */
export interface SafeAlertHTMLAttributes {
  /**
   * Additional CSS class names (sanitized)
   */
  className?: string;

  /**
   * Inline styles
   */
  style?: CSSProperties;

  /**
   * ID attribute
   */
  id?: string;

  /**
   * Data attributes for testing (sanitized)
   */
  'data-testid'?: string;
  'data-test'?: string;

  /**
   * Title attribute for tooltips
   */
  title?: string;
}

/**
 * Whitelisted HTML attributes for safe prop spreading in AlertLink component
 * SECURITY: Only allows safe anchor attributes, prevents href injection
 */
export interface SafeAlertLinkHTMLAttributes {
  /**
   * Additional CSS class names (sanitized)
   */
  className?: string;

  /**
   * Data attributes for testing (sanitized)
   */
  'data-testid'?: string;
  'data-test'?: string;

  /**
   * Title attribute for tooltips
   */
  title?: string;
}

/**
 * Alert component props
 *
 * @example
 * ```tsx
 * // Basic alert
 * <Alert variant="info">This is an informational message.</Alert>
 *
 * // Alert with title
 * <Alert variant="success" title="Success!">
 *   Your changes have been saved.
 * </Alert>
 *
 * // Dismissible alert
 * <Alert variant="warning" dismissible onClose={() => setShow(false)}>
 *   This alert can be dismissed.
 * </Alert>
 *
 * // Alert with custom icon
 * <Alert variant="danger" icon={<CustomIcon />}>
 *   Something went wrong.
 * </Alert>
 * ```
 */
export interface AlertProps extends SafeAlertHTMLAttributes {
  /**
   * Alert content
   */
  children: ReactNode;

  /**
   * Alert color variant
   * @default 'primary'
   */
  variant?: AlertVariant;

  /**
   * Optional alert title (rendered as heading)
   */
  title?: string;

  /**
   * Whether the alert can be dismissed
   * @default false
   */
  dismissible?: boolean;

  /**
   * Callback when the alert is closed
   * Required when dismissible is true
   */
  onClose?: () => void;

  /**
   * Custom icon to display
   * If not provided, no icon is shown (Bootstrap default)
   */
  icon?: ReactNode;

  /**
   * Whether to show the alert
   * Useful for controlled visibility
   * @default true
   */
  show?: boolean;

  /**
   * Element to render as
   * @default 'div'
   */
  as?: 'div' | 'section';

  /**
   * Aria-atomic attribute for complete announcements
   * @default true for alerts with aria-live
   */
  'aria-atomic'?: boolean;
}

/**
 * Alert.Link component props
 * SECURITY: Href is validated to prevent javascript: and data: attacks
 */
export interface AlertLinkProps extends SafeAlertLinkHTMLAttributes {
  /**
   * Link content
   */
  children: ReactNode;

  /**
   * Link URL (SECURITY: validated against XSS patterns)
   * Safe protocols: http, https, mailto, tel, /
   * Blocked: javascript:, data:, text/html
   */
  href: string;

  /**
   * Click handler
   */
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;

  /**
   * Link target
   * External links should use '_blank' with rel="noopener noreferrer"
   * @default '_self'
   */
  target?: '_blank' | '_self' | '_parent' | '_top';

  /**
   * Relationship attribute for external links
   * Auto-added for target="_blank" to prevent window.opener attacks
   */
  rel?: string;
}

/**
 * Alert.Heading component props
 */
export interface AlertHeadingProps {
  /**
   * Heading content
   */
  children: ReactNode;

  /**
   * Heading level
   * @default 'h4'
   */
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

  /**
   * Additional CSS class names
   */
  className?: string;
}
