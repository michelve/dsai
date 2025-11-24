import type { CSSProperties, ReactNode } from 'react';

/**
 * Badge component variants
 * Maps to Bootstrap 5 badge background utilities (text-bg-*)
 */
export type BadgeVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'light'
  | 'dark';

/**
 * Badge component props
 *
 * @see https://getbootstrap.com/docs/5.3/components/badge/
 *
 * @example
 * ```tsx
 * // Basic badge
 * <Badge variant="primary">New</Badge>
 *
 * // Pill badge
 * <Badge variant="success" pill>Active</Badge>
 *
 * // Badge with dot indicator
 * <Badge variant="danger" dot>Alerts</Badge>
 *
 * // Positioned badge (e.g., notification count)
 * <Button className="position-relative">
 *   Inbox
 *   <Badge variant="danger" pill className="position-absolute top-0 start-100 translate-middle">
 *     99+
 *   </Badge>
 * </Button>
 * ```
 */
export interface BadgeProps {
  /**
   * Badge content
   */
  children?: ReactNode;

  /**
   * Badge color variant
   * @default 'primary'
   */
  variant?: BadgeVariant;

  /**
   * Pill shape (fully rounded)
   * @default false
   */
  pill?: boolean;

  /**
   * Show dot indicator instead of/before content
   * Useful for status indicators
   * @default false
   */
  dot?: boolean;

  /**
   * Icon to display before badge text
   */
  icon?: ReactNode;

  /**
   * Additional CSS class names
   */
  className?: string;

  /**
   * Inline styles
   */
  style?: CSSProperties;

  /**
   * ARIA label for accessibility
   * Required when badge has no visible text (e.g., dot-only badges)
   */
  'aria-label'?: string;

  /**
   * ID attribute
   */
  id?: string;

  /**
   * Element to render as
   * @default 'span'
   */
  as?: 'span' | 'div';
}
