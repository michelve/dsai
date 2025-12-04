/**
 * DSAi Utils
 *
 * Utility functions for common operations.
 * These are pure functions with no side effects.
 *
 * @example
 * ```tsx
 * import { cn, formatDate, generateId } from '@dsai/react';
 * ```
 */

/**
 * Combines class names conditionally (similar to clsx/classnames)
 *
 * @example
 * ```tsx
 * cn('btn', isActive && 'btn-active', size === 'lg' && 'btn-lg')
 * // => 'btn btn-active btn-lg' or 'btn' depending on conditions
 * ```
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Generates a unique ID for accessibility attributes
 *
 * @example
 * ```tsx
 * const id = generateId('button');
 * // => 'dsai-button-abc123'
 * ```
 */
export function generateId(prefix = 'dsai'): string {
  return `${prefix}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Checks if code is running in a browser environment
 */
export function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

/**
 * Checks if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (!isBrowser()) {
    return false;
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Clamps a number between min and max values
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Merges refs (useful for forwarding refs)
 */
export function mergeRefs<T>(...refs: (React.Ref<T> | undefined)[]): React.RefCallback<T> {
  return (value) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(value);
      } else if (ref !== null) {
        (ref as React.MutableRefObject<T | null>).current = value;
      }
    });
  };
}

// Future utils (uncomment as implemented):
// export { formatDate, formatRelativeTime } from './date';
// export { formatCurrency, formatNumber } from './number';
// export { truncate, capitalize, slugify } from './string';
// export { debounce, throttle } from './timing';
// export { deepMerge, pick, omit } from './object';
