import { isBrowser } from '../browser';

import type { CachedFunction } from './cache';

/**
 * Detects if the current document is in RTL (right-to-left) mode.
 *
 * Checks the document direction and html[dir] attribute.
 * This is cached for performance.
 *
 * **Key Features**:
 * - Checks document.dir
 * - Checks html[dir] attribute
 * - Computed style fallback
 * - SSR-safe
 * - Cached result
 *
 * @returns True if RTL, false if LTR (null in SSR)
 *
 * @example
 * ```tsx
 * function DirectionAwareIcon() {
 *   const rtl = isRTL();
 *
 *   return (
 *     <ChevronIcon
 *       style={{ transform: rtl ? 'scaleX(-1)' : undefined }}
 *     />
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // RTL-aware margin
 * function Card() {
 *   const rtl = isRTL();
 *
 *   return (
 *     <div
 *       style={{
 *         marginLeft: rtl ? undefined : '16px',
 *         marginRight: rtl ? '16px' : undefined,
 *       }}
 *     >
 *       Content
 *     </div>
 *   );
 * }
 * ```
 */
export function isRTL(): boolean | null {
  if (!isBrowser()) {
    return null;
  }

  // Cache the result
  const cached = (isRTL as CachedFunction<boolean | null>)._cached;
  if (typeof cached === 'boolean') {
    return cached;
  }

  // Check document.dir
  if (document.dir) {
    const result = document.dir.toLowerCase() === 'rtl';
    (isRTL as CachedFunction<boolean | null>)._cached = result;
    return result;
  }

  // Check html[dir] attribute
  const htmlDir = document.documentElement.getAttribute('dir');
  if (htmlDir) {
    const result = htmlDir.toLowerCase() === 'rtl';
    (isRTL as CachedFunction<boolean | null>)._cached = result;
    return result;
  }

  // Check computed style
  const direction = window.getComputedStyle(document.documentElement).direction;
  const result = direction === 'rtl';

  // Cache the result
  (isRTL as CachedFunction<boolean | null>)._cached = result;

  return result;
}
