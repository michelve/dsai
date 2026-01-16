/**
 * useMediaQuery Hook
 *
 * React hooks for responsive design and media query tracking.
 * Provides reactive updates when viewport or media features change.
 */

export { useMediaQuery } from './useMediaQuery';
export type { UseMediaQueryOptions } from './useMediaQuery';

export { useIsDesktop, useIsLargeDesktop, useIsMobile, useIsTablet } from './useMediaQuery.helpers';

export {
  BREAKPOINTS,
  breakpointBetween,
  breakpointDown,
  breakpointUp,
  getBreakpointValue,
} from './breakpoints';
export type { Breakpoint } from './breakpoints';
