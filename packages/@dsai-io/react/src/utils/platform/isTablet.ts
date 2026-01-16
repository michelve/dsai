import { isBrowser } from '../browser';

import type { CachedFunction } from './cache';

/**
 * Detects if the current device is a tablet.
 *
 * Uses user agent and screen width detection to determine if the device
 * is a tablet. This is cached for performance.
 *
 * **Key Features**:
 * - User agent detection for iPad, Android tablets
 * - Screen width fallback (768-1024px range)
 * - SSR-safe
 * - Cached result
 *
 * @returns True if device is tablet, false otherwise (null in SSR)
 *
 * @example
 * ```tsx
 * function TabletOptimizedView() {
 *   const isTabletDevice = isTablet();
 *
 *   if (isTabletDevice) {
 *     return <TwoColumnLayout />;
 *   }
 *
 *   return <SingleColumnLayout />;
 * }
 * ```
 */
export function isTablet(): boolean | null {
  if (!isBrowser()) {
    return null;
  }

  // Cache the result
  const cached = (isTablet as CachedFunction<boolean | null>)._cached;
  if (typeof cached === 'boolean') {
    return cached;
  }

  const userAgent = navigator.userAgent.toLowerCase();

  // Tablet patterns
  const tabletPatterns = [/ipad/i, /tablet/i, /playbook/i, /silk/i];

  const isTabletUA =
    tabletPatterns.some((pattern) => pattern.test(userAgent)) ||
    (userAgent.includes('android') && !userAgent.includes('mobile'));

  // Use screen width as fallback (tablet typically 768-1024px)
  const isTabletWidth = window.innerWidth >= 768 && window.innerWidth <= 1024;

  const result =
    isTabletUA ||
    (!navigator.userAgent.match(/android|iphone|ipod|blackberry|windows phone/i) && isTabletWidth);

  // Cache the result
  (isTablet as CachedFunction<boolean | null>)._cached = result;

  return result;
}
