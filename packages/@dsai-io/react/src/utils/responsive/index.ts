/**
 * Responsive Utilities
 *
 * Runtime utilities for working with responsive values.
 * These functions help extract values from responsive objects at runtime.
 *
 * @module @dsai-io/react/utils/responsive
 */

import type { Breakpoint, ResponsiveValue } from '../../types';

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
 * getResponsiveValue(columns, 'md');  // 2
 * getResponsiveValue(columns, 'sm');  // 1 (falls back to xs)
 * getResponsiveValue(2, 'lg');        // 2 (single value)
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

  const responsiveObj = value as { xs?: T; sm?: T; md?: T; lg?: T; xl?: T; xxl?: T };

  const breakpointValue = Reflect.get(responsiveObj, breakpoint) as T | undefined;
  return breakpointValue ?? responsiveObj.xs;
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
