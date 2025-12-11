/**
 * Convenience hooks for common breakpoint checks.
 *
 * These hooks provide named shortcuts for frequently-used media queries,
 * making component code more readable and maintainable.
 */

import { breakpointDown, breakpointUp } from './breakpoints';
import { useMediaQuery } from './useMediaQuery';

import type { UseMediaQueryOptions } from './useMediaQuery';

/**
 * Returns `true` if viewport is mobile (< 768px).
 *
 * This matches screens smaller than the "md" breakpoint,
 * typically phones in portrait and landscape modes.
 *
 * @example
 * ```tsx
 * function Header() {
 *   const isMobile = useIsMobile();
 *
 *   return (
 *     <header>
 *       {isMobile ? <MobileNav /> : <DesktopNav />}
 *     </header>
 *   );
 * }
 * ```
 *
 * @param options - Configuration options for SSR behavior
 * @returns `true` if viewport width is less than 768px
 */
export function useIsMobile(options?: UseMediaQueryOptions): boolean {
  return useMediaQuery(breakpointDown('md'), options);
}

/**
 * Returns `true` if viewport is tablet or larger (>= 768px).
 *
 * This matches screens at or above the "md" breakpoint,
 * including tablets and desktops.
 *
 * @example
 * ```tsx
 * function Sidebar() {
 *   const isTablet = useIsTablet();
 *
 *   if (!isTablet) return null;
 *
 *   return <aside>Tablet/Desktop sidebar</aside>;
 * }
 * ```
 *
 * @param options - Configuration options for SSR behavior
 * @returns `true` if viewport width is 768px or greater
 */
export function useIsTablet(options?: UseMediaQueryOptions): boolean {
  return useMediaQuery(breakpointUp('md'), options);
}

/**
 * Returns `true` if viewport is desktop or larger (>= 992px).
 *
 * This matches screens at or above the "lg" breakpoint,
 * typically desktop monitors and large tablets in landscape.
 *
 * @example
 * ```tsx
 * function ProductGrid() {
 *   const isDesktop = useIsDesktop();
 *   const columns = isDesktop ? 4 : 2;
 *
 *   return <Grid columns={columns} />;
 * }
 * ```
 *
 * @param options - Configuration options for SSR behavior
 * @returns `true` if viewport width is 992px or greater
 */
export function useIsDesktop(options?: UseMediaQueryOptions): boolean {
  return useMediaQuery(breakpointUp('lg'), options);
}

/**
 * Returns `true` if viewport is large desktop or larger (>= 1200px).
 *
 * This matches screens at or above the "xl" breakpoint,
 * typically large desktop monitors and wide screens.
 *
 * @example
 * ```tsx
 * function Dashboard() {
 *   const isLargeDesktop = useIsLargeDesktop();
 *
 *   return (
 *     <div>
 *       {isLargeDesktop && <DetailedAnalytics />}
 *       <MainContent />
 *     </div>
 *   );
 * }
 * ```
 *
 * @param options - Configuration options for SSR behavior
 * @returns `true` if viewport width is 1200px or greater
 */
export function useIsLargeDesktop(options?: UseMediaQueryOptions): boolean {
  return useMediaQuery(breakpointUp('xl'), options);
}
