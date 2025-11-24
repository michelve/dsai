import type { CSSProperties, HTMLAttributes } from 'react';

/**
 * Spinner animation type
 * Maps to Bootstrap 5 spinner types
 */
export type SpinnerAnimation = 'border' | 'grow';

/**
 * Spinner size
 * Maps to Bootstrap 5 spinner sizes
 */
export type SpinnerSize = 'sm' | 'md';

/**
 * Spinner variant (color)
 * Maps to Bootstrap 5 text color utilities
 */
export type SpinnerVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'light'
  | 'dark';

/**
 * Spinner component props
 *
 * @see https://getbootstrap.com/docs/5.3/components/spinners/
 *
 * @example
 * ```tsx
 * // Border spinner (default)
 * <Spinner />
 *
 * // Growing spinner
 * <Spinner animation="grow" />
 *
 * // Small spinner
 * <Spinner size="sm" />
 *
 * // Colored spinner
 * <Spinner variant="primary" />
 * ```
 */
export interface SpinnerProps extends HTMLAttributes<HTMLElement> {
  /**
   * Spinner animation type
   * - `border`: Rotating border spinner (default)
   * - `grow`: Growing/pulsing spinner
   * @default 'border'
   */
  animation?: SpinnerAnimation;

  /**
   * Spinner size
   * - `sm`: Small spinner (1rem)
   * - `md`: Medium spinner (2rem) - default
   * @default 'md'
   */
  size?: SpinnerSize;

  /**
   * Spinner color variant
   * Uses Bootstrap text color utilities
   * @default undefined (inherits color)
   */
  variant?: SpinnerVariant;

  /**
   * Additional CSS class names
   */
  className?: string;

  /**
   * Inline styles
   */
  style?: CSSProperties;

  /**
   * Accessible label for screen readers
   * @default 'Loading...'
   */
  label?: string;

  /**
   * Element to render as (for inline spinners in buttons)
   * @default 'div'
   */
  as?: 'div' | 'span';
}
