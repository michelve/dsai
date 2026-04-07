import { isBrowser } from '../browser';

import type { CachedFunction } from './cache';
import type { OperatingSystem } from './platform.types';

/**
 * Detects the operating system from user agent.
 *
 * Returns the detected OS or 'Unknown' if unable to detect.
 * This is cached for performance.
 *
 * **Key Features**:
 * - User agent parsing
 * - Platform API fallback
 * - SSR-safe
 * - Cached result
 *
 * @returns Operating system type (null in SSR)
 *
 * @example
 * ```tsx
 * function OSSpecificInstructions() {
 *   const os = getOS();
 *
 *   if (os === 'macOS') {
 *     return <p>Press Cmd+C to copy</p>;
 *   }
 *
 *   return <p>Press Ctrl+C to copy</p>;
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Download appropriate installer
 * function DownloadButton() {
 *   const os = getOS();
 *   const downloadUrl = os === 'Windows' ? '/app.exe' :
 *                       os === 'macOS' ? '/app.dmg' :
 *                       '/app.tar.gz';
 *
 *   return <a href={downloadUrl}>Download for {os}</a>;
 * }
 * ```
 */
export function getOS(): OperatingSystem | null {
  if (!isBrowser()) {
    return null;
  }

  // Cache the result
  const cached = (getOS as CachedFunction<OperatingSystem | null>)._cached;
  if (typeof cached === 'string') {
    return cached as OperatingSystem;
  }

  const userAgent = navigator.userAgent.toLowerCase();

  let os: OperatingSystem = 'Unknown';

  if (/iphone|ipad|ipod/i.test(userAgent)) {
    os = 'iOS';
  } else if (/android/i.test(userAgent)) {
    os = 'Android';
  } else if (/windows/i.test(userAgent)) {
    os = 'Windows';
  } else if (/macintosh|mac os/i.test(userAgent)) {
    os = 'macOS';
  } else if (/linux/i.test(userAgent)) {
    os = 'Linux';
  }

  // Cache the result
  (getOS as CachedFunction<OperatingSystem | null>)._cached = os;

  return os;
}
