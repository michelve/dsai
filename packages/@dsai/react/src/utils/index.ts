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
  const cryptoObj =
    typeof globalThis !== 'undefined' && 'crypto' in globalThis
      ? (globalThis as typeof globalThis & { crypto?: Crypto }).crypto
      : undefined;

  const secureRandomString = (length: number): string | undefined => {
    if (cryptoObj?.randomUUID) {
      return cryptoObj.randomUUID().replace(/-/g, '').slice(0, length);
    }

    if (cryptoObj?.getRandomValues) {
      const bytes = new Uint8Array(length);
      cryptoObj.getRandomValues(bytes);
      return Array.from(bytes, (b) => b.toString(36).padStart(2, '0'))
        .join('')
        .slice(0, length);
    }

    return undefined;
  };

  const fallbackSequence = (() => {
    let counter = 0;
    return (length: number): string => {
      counter = (counter + 1) % Number.MAX_SAFE_INTEGER;
      const timePart = Date.now().toString(36);
      const counterPart = counter.toString(36).padStart(6, '0');
      const combined = `${timePart}${counterPart}`;
      return combined.slice(-length).padStart(length, '0');
    };
  })();

  const randomPart = secureRandomString(12) ?? fallbackSequence(12);

  return `${prefix}-${randomPart}`;
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
  try {
    const query =
      typeof window.matchMedia === 'function'
        ? window.matchMedia('(prefers-reduced-motion: reduce)')
        : undefined;
    return Boolean(query?.matches);
  } catch {
    return false;
  }
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
