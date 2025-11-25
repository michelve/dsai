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
 * Safe HTML attributes for Badge component
 * Whitelists allowed HTML attributes to prevent unrestricted prop spreading
 * Blocks dangerous attributes like 'onclick', 'onchange', etc.
 */
export interface SafeBadgeHTMLAttributes {
  /**
   * Standard HTML attributes
   */
  id?: string;
  className?: string;
  style?: CSSProperties;
  title?: string;
  'data-testid'?: string;
  'data-test'?: string;

  /**
   * ARIA attributes
   */
  'aria-label'?: string;
  'aria-hidden'?: 'true' | 'false';
  'aria-atomic'?: boolean;
  role?: string;
}

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
export interface BadgeProps extends SafeBadgeHTMLAttributes {
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
   * NOTE: Requires aria-label when used without visible text
   * @default false
   */
  dot?: boolean;

  /**
   * Icon to display before badge text
   * Will be hidden from screen readers (aria-hidden="true")
   */
  icon?: ReactNode;

  /**
   * Element to render as
   * @default 'span'
   */
  as?: 'span' | 'div';
}
