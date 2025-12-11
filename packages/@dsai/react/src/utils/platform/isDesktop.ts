import { isBrowser } from '../browser';

import { isMobile } from './isMobile';
import { isTablet } from './isTablet';

import type { CachedFunction } from './cache';

/**
 * Detects if the current device is a desktop.
 *
 * Returns true if the device is not mobile and not tablet.
 * This is cached for performance.
 *
 * **Key Features**:
 * - Inverse of mobile/tablet detection
 * - SSR-safe
 * - Cached result
 *
 * @returns True if device is desktop, false otherwise (null in SSR)
 *
 * @example
 * ```tsx
 * function DesktopOnlyFeature() {
 *   const isDesktopDevice = isDesktop();
 *
 *   if (!isDesktopDevice) {
 *     return null;
 *   }
 *
 *   return <AdvancedDataGrid />;
 * }
 * ```
 */
export function isDesktop(): boolean | null {
  if (!isBrowser()) {
    return null;
  }

  // Cache the result
  const cached = (isDesktop as CachedFunction<boolean | null>)._cached;
  if (typeof cached === 'boolean') {
    return cached;
  }

  const mobile = isMobile();
  const tablet = isTablet();

  // If either detection returns null (shouldn't happen since we checked isBrowser),
  // default to desktop
  if (mobile === null || tablet === null) {
    return true;
  }

  const result = !mobile && !tablet;

  // Cache the result
  (isDesktop as CachedFunction<boolean | null>)._cached = result;

  return result;
}
