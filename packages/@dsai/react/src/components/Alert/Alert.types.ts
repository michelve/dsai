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
export interface AlertProps {
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
   * Additional CSS class names
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
   * Element to render as
   * @default 'div'
   */
  as?: 'div' | 'section';
}

/**
 * Alert.Link component props
 */
export interface AlertLinkProps {
  /**
   * Link content
   */
  children: ReactNode;

  /**
   * Link URL
   */
  href?: string;

  /**
   * Click handler
   */
  onClick?: () => void;

  /**
   * Additional CSS class names
   */
  className?: string;
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
