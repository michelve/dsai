/**
 * useMediaQuery Hook
 *
 * Tracks whether a CSS media query matches the current viewport/environment.
 * Provides reactive updates when media query state changes.
 */

import { useSyncExternalStore } from 'react';

import { isBrowser } from '../../utils';

export interface UseMediaQueryOptions {
  /**
   * Default value to return during SSR or when browser APIs are unavailable.
   * @default false
   */
  defaultValue?: boolean;
}

/**
 * Tracks whether a CSS media query matches the current viewport.
 *
 * This hook listens to the window.matchMedia API and updates reactively when
 * the media query match status changes. It's SSR-safe and handles hydration properly.
 *
 * Features:
 * - Accepts any valid CSS media query string
 * - Updates reactively when viewport changes
 * - SSR-safe with configurable default values
 * - Handles hydration mismatch gracefully
 * - Proper cleanup of event listeners
 *
 * @example
 * ```tsx
 * // Basic usage
 * function ResponsiveComponent() {
 *   const isMobile = useMediaQuery('(max-width: 767.98px)');
 *
 *   return (
 *     <div>
 *       {isMobile ? <MobileLayout /> : <DesktopLayout />}
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // With custom SSR default
 * function Header() {
 *   const prefersLight = useMediaQuery(
 *     '(prefers-color-scheme: light)',
 *     { defaultValue: true }
 *   );
 *
 *   return <header className={prefersLight ? 'light' : 'dark'} />;
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Using breakpoint helpers
 * import { breakpointUp } from './breakpoints';
 *
 * function Grid() {
 *   const isDesktop = useMediaQuery(breakpointUp('lg'));
 *   const columns = isDesktop ? 3 : 1;
 *
 *   return <div style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }} />;
 * }
 * ```
 *
 * @param query - CSS media query string (e.g., "(max-width: 768px)")
 * @param options - Configuration options for SSR behavior
 * @returns `true` if the media query matches, `false` otherwise
 */
export function useMediaQuery(query: string, options: UseMediaQueryOptions = {}): boolean {
  const { defaultValue = false } = options;
  const canUseMatchMedia = (): boolean => {
    return isBrowser() && typeof globalThis.matchMedia === 'function';
  };
  const supportsMatchMedia = canUseMatchMedia();

  const subscribe = (callback: () => void): (() => void) => {
    if (!supportsMatchMedia) {
      return () => {};
    }

    const mediaQueryList = globalThis.matchMedia(query);

    // Modern browsers use addEventListener
    mediaQueryList.addEventListener('change', callback);

    return () => {
      mediaQueryList.removeEventListener('change', callback);
    };
  };

  const getSnapshot = (): boolean => {
    if (!supportsMatchMedia) {
      return defaultValue;
    }
    return globalThis.matchMedia(query).matches;
  };

  const getServerSnapshot = (): boolean => {
    return defaultValue;
  };

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
