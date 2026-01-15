import { isBrowser } from '../browser';

import type { CachedFunction } from './cache';

/**
 * Detects if the current device is a mobile phone.
 *
 * Uses screen width and user agent detection to determine if the device
 * is a mobile phone. This is cached for performance.
 *
 * **Key Features**:
 * - User agent detection
 * - Screen width fallback
 * - SSR-safe
 * - Cached result
 *
 * @returns True if device is mobile, false otherwise (null in SSR)
 *
 * @example
 * ```tsx
 * function MobileMenu() {
 *   const isMobileDevice = isMobile();
 *
 *   if (isMobileDevice) {
 *     return <HamburgerMenu />;
 *   }
 *
 *   return <DesktopNav />;
 * }
 * ```
 *
 * @example
 * ```tsx
 * // With fallback rendering
 * function ResponsiveLayout() {
 *   const isMobileDevice = isMobile();
 *
 *   // During SSR, show desktop layout
 *   if (isMobileDevice === null) {
 *     return <DesktopLayout />;
 *   }
 *
 *   return isMobileDevice ? <MobileLayout /> : <DesktopLayout />;
 * }
 * ```
 */
export function isMobile(): boolean | null {
  if (!isBrowser()) {
    return null;
  }

  // Cache the result
  const cached = (isMobile as CachedFunction<boolean | null>)._cached;
  if (typeof cached === 'boolean') {
    return cached;
  }

  const userAgent = navigator.userAgent.toLowerCase();

  // Mobile patterns
  const mobilePatterns = [
    /android/i,
    /webos/i,
    /iphone/i,
    /ipod/i,
    /blackberry/i,
    /windows phone/i,
  ];

  const isMobileUA = mobilePatterns.some((pattern) => pattern.test(userAgent));

  // Check for tablet patterns (exclude from mobile)
  const isTabletUA =
    /ipad|tablet|playbook|silk/i.test(userAgent) ||
    (userAgent.includes('android') && !userAgent.includes('mobile'));

  // Use screen width as fallback (mobile typically < 768px)
  const isMobileWidth = window.innerWidth < 768;

  const result = !isTabletUA && (isMobileUA || isMobileWidth);

  // Cache the result
  (isMobile as CachedFunction<boolean | null>)._cached = result;

  return result;
}
