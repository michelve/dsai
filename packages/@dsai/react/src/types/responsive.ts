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
 * Matches Bootstrap 5 breakpoints (aligned with @dsai/tokens):
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

/**
 * Extract base value from responsive value
 *
 * Utility function to get the value for a specific breakpoint.
 * Falls back to 'xs' value if specific breakpoint not defined.
 *
 * @template T - Value type
 * @param value - Responsive value or single value
 * @param breakpoint - Breakpoint to get value for (default: 'xs')
 * @returns Value for the specified breakpoint, or undefined
 *
 * @example
 * ```typescript
 * const columns = { xs: 1, md: 2, lg: 3 };
 *
 * getResponsiveValue(columns, 'xs');  // 1
 * getResponsiveValue(columns, 'md');    // 2
 * getResponsiveValue(columns, 'sm');    // 1 (falls back to xs)
 * getResponsiveValue(2, 'lg');          // 2 (single value)
 * ```
 */
export function getResponsiveValue<T>(
  value: ResponsiveValue<T>,
  breakpoint: Breakpoint = 'xs'
): T | undefined {
  // If value is not an object, it's a single value
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return value as T;
  }

  // Type assertion - we've verified it's an object with optional breakpoint properties
  const responsiveObj = value as { xs?: T; sm?: T; md?: T; lg?: T; xl?: T; xxl?: T };

  // Get value for specific breakpoint with explicit access, fall back to xs
  // Using explicit checks instead of dynamic property access for security
  switch (breakpoint) {
    case 'xs':
      return responsiveObj.xs;
    case 'sm':
      return responsiveObj.sm ?? responsiveObj.xs;
    case 'md':
      return responsiveObj.md ?? responsiveObj.xs;
    case 'lg':
      return responsiveObj.lg ?? responsiveObj.xs;
    case 'xl':
      return responsiveObj.xl ?? responsiveObj.xs;
    case 'xxl':
      return responsiveObj.xxl ?? responsiveObj.xs;
    default:
      return responsiveObj.xs;
  }
}

/**
 * Check if a value is responsive
 *
 * Type guard to check if a value is a responsive value object.
 *
 * @template T - Value type
 * @param value - Value to check
 * @returns True if value is a responsive object
 *
 * @example
 * ```typescript
 * if (isResponsiveValue(columns)) {
 *   // columns is { xs?: number, md?: number, ... }
 * } else {
 *   // columns is number
 * }
 * ```
 */
export function isResponsiveValue<T>(
  value: ResponsiveValue<T>
): value is Exclude<ResponsiveValue<T>, T> {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    ('xs' in value ||
      'sm' in value ||
      'md' in value ||
      'lg' in value ||
      'xl' in value ||
      'xxl' in value)
  );
}
