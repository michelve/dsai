/**
 * Responsive Value Types
 *
 * Type definitions for responsive values that support breakpoint-specific values.
 * Allows components to adapt to different screen sizes.
 *
 * @module @dsai/react/types/responsive
 */

/**
 * Breakpoint identifiers
 *
 * Matches Bootstrap 5 breakpoints (aligned with DSAi design tokens):
 * - xs: 0px (extra small, mobile)
 * - sm: >= 576px (small, large mobile)
 * - md: >= 768px (medium, tablets)
 * - lg: >= 992px (large, desktops)
 * - xl: >= 1200px (extra large, large desktops)
 * - xxl: >= 1400px (extra extra large, wide screens)
 *
 * @see {@link https://getbootstrap.com/docs/5.3/layout/breakpoints/}
 */
export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

/**
 * Responsive value that supports breakpoint-specific values
 *
 * Allows a value to be either:
 * 1. A single value (applied at all breakpoints)
 * 2. An object with breakpoint-specific values
 *
 * @template T - Value type
 *
 * @example
 * ```typescript
 * interface CardProps {
 *   columns?: ResponsiveValue<1 | 2 | 3 | 4>;
 *   gap?: ResponsiveValue<number>;
 * }
 *
 * // Single value (non-responsive)
 * <Card columns={2} />
 *
 * // Responsive values (Bootstrap 5 breakpoints)
 * <Card columns={{ xs: 1, md: 2, lg: 3 }} />
 * <Card gap={{ xs: 8, md: 16, xl: 24 }} />
 * ```
 */
export type ResponsiveValue<T> =
  | T
  | {
      xs?: T;
      sm?: T;
      md?: T;
      lg?: T;
      xl?: T;
      xxl?: T;
    };

/**
 * Responsive prop helper type
 *
 * Shorthand for making a prop responsive.
 *
 * @template T - Value type
 *
 * @example
 * ```typescript
 * interface GridProps {
 *   columns: ResponsiveProp<number>;
 *   gap: ResponsiveProp<string>;
 * }
 * ```
 */
export type ResponsiveProp<T> = ResponsiveValue<T>;

// =============================================================================
// Runtime Utilities (re-exported from utils/responsive for backward compatibility)
// =============================================================================

/**
 * Runtime utilities for responsive values
 *
 * These functions are implemented in utils/responsive and re-exported here
 * for backward compatibility. New code should import from utils/responsive.
 *
 * @see {@link module:@dsai/react/utils/responsive}
 * @deprecated Import from `@dsai/react/utils/responsive` to keep type modules type-only.
 */
export { getResponsiveValue, isResponsiveValue } from '../utils/responsive';
