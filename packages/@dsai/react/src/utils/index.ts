/**
 * DSAi Utils
 *
 * Utility functions for common operations.
 * These are pure functions with no side effects.
 *
 * @example
 * ```tsx
 * import { cn, generateId, isBrowser } from '@dsai/react';
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

// Export category-specific utilities
// These provide specialized implementations organized by domain
export * from './a11y';
export * from './async';
export * from './browser';
export * from './color';
export * from './date';
export * from './dom';
export * from './dx';
export * from './forms';
export * from './keyboard';
export * from './misc';
export * from './motion';
export * from './number';
export * from './object';
export * from './platform';
export * from './responsive';
export * from './safety';
export * from './string';
export * from './telemetry';
export * from './timing';
export * from './types';
export * from './validation';
