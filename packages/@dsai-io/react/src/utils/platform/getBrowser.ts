import { isBrowser } from '../browser';

import type { CachedFunction } from './cache';
import type { Browser } from './platform.types';

/**
 * Detects the browser from user agent.
 *
 * Returns the detected browser or 'Unknown' if unable to detect.
 * This is cached for performance.
 *
 * **Key Features**:
 * - User agent parsing
 * - Detects major browsers
 * - SSR-safe
 * - Cached result
 *
 * @returns Browser type (null in SSR)
 *
 * @example
 * ```tsx
 * function BrowserWarning() {
 *   const browser = getBrowser();
 *
 *   if (browser === 'Safari' && parseInt(navigator.userAgent.match(/Version\/(\d+)/)?.[1] || '0') < 14) {
 *     return <div>Please update Safari for the best experience</div>;
 *   }
 *
 *   return null;
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Browser-specific CSS class
 * function App() {
 *   const browser = getBrowser();
 *
 *   return (
 *     <div className={`app browser-${browser?.toLowerCase()}`}>
 *       <Content />
 *     </div>
 *   );
 * }
 * ```
 */
export function getBrowser(): Browser | null {
  if (!isBrowser()) {
    return null;
  }

  // Cache the result
  const cached = (getBrowser as CachedFunction<Browser | null>)._cached;
  if (typeof cached === 'string') {
    return cached as Browser;
  }

  const userAgent = navigator.userAgent.toLowerCase();

  let browser: Browser = 'Unknown';

  // Order matters: check for more specific browsers first
  if (userAgent.includes('edg')) {
    browser = 'Edge';
  } else if (userAgent.includes('opr') || userAgent.includes('opera')) {
    browser = 'Opera';
  } else if (userAgent.includes('samsungbrowser')) {
    browser = 'Samsung';
  } else if (userAgent.includes('chrome')) {
    browser = 'Chrome';
  } else if (userAgent.includes('safari')) {
    browser = 'Safari';
  } else if (userAgent.includes('firefox')) {
    browser = 'Firefox';
  }

  // Cache the result
  (getBrowser as CachedFunction<Browser | null>)._cached = browser;

  return browser;
}
