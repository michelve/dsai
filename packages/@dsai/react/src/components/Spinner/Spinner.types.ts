import type { CSSProperties, HTMLAttributes } from 'react';

/**
 * Spinner animation type
 * Maps to Bootstrap 5 spinner types
 */
export type SpinnerAnimation = 'border' | 'grow';

/**
 * Spinner size
 * - `xs`: Extra small (0.75rem)
 * - `sm`: Small (1rem) - Bootstrap native
 * - `md`: Medium (2rem) - Bootstrap default
 * - `lg`: Large (3rem)
 * - `xl`: Extra large (4rem)
 */
export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

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
   * - `xs`: Extra small (0.75rem)
   * - `sm`: Small (1rem)
   * - `md`: Medium (2rem) - default
   * - `lg`: Large (3rem)
   * - `xl`: Extra large (4rem)
   * @default 'md'
   */
  size?: SpinnerSize;

  /**
   * Center the spinner in its container
   * Wraps spinner in a flex container with centering
   * @default false
   */
  centered?: boolean;

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
