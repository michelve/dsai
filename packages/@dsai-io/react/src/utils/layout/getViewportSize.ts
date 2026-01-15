/**
 * @file getViewportSize - Get viewport dimensions
 * @module @dsai/react/utils/layout
 *
 * Retrieves viewport dimensions with SSR safety and multiple
 * measurement strategies for different use cases.
 *
 * Features:
 * - SSR-safe (returns default dimensions when DOM unavailable)
 * - Multiple measurement strategies (innerWidth/clientWidth)
 * - Excludes scrollbar width when needed
 * - Provides aspect ratio calculation
 * - TypeScript-friendly with strict types
 */

import { isBrowser } from '../browser/isBrowser';

/**
 * Viewport size measurements
 */
export interface ViewportSize {
  /** Viewport width including scrollbar */
  readonly width: number;
  /** Viewport height including scrollbar */
  readonly height: number;
  /** Viewport width excluding scrollbar */
  readonly clientWidth: number;
  /** Viewport height excluding scrollbar */
  readonly clientHeight: number;
  /** Aspect ratio (width / height) */
  readonly aspectRatio: number;
  /** True if viewport is in portrait orientation */
  readonly isPortrait: boolean;
  /** True if viewport is in landscape orientation */
  readonly isLandscape: boolean;
}

/**
 * Options for getViewportSize
 */
export interface GetViewportSizeOptions {
  /**
   * Default width to return in SSR environment.
   * @default 0
   */
  defaultWidth?: number;

  /**
   * Default height to return in SSR environment.
   * @default 0
   */
  defaultHeight?: number;
}

/**
 * Gets the current viewport dimensions.
 *
 * @param options - Optional configuration
 * @returns Viewport size measurements
 *
 * @example
 * ```tsx
 * const viewport = getViewportSize();
 * console.log(`Viewport: ${viewport.width}x${viewport.height}`);
 * console.log(`Aspect ratio: ${viewport.aspectRatio.toFixed(2)}`);
 *
 * if (viewport.isPortrait) {
 *   console.log('Mobile layout');
 * }
 *
 * // SSR with defaults
 * const ssrViewport = getViewportSize({ defaultWidth: 1920, defaultHeight: 1080 });
 * ```
 */
export function getViewportSize(options: GetViewportSizeOptions = {}): ViewportSize {
  const { defaultWidth = 0, defaultHeight = 0 } = options;

  // SSR safety check
  if (!isBrowser()) {
    const aspectRatio = defaultHeight > 0 ? defaultWidth / defaultHeight : 1;
    return {
      width: defaultWidth,
      height: defaultHeight,
      clientWidth: defaultWidth,
      clientHeight: defaultHeight,
      aspectRatio,
      isPortrait: defaultHeight > defaultWidth,
      isLandscape: defaultWidth > defaultHeight,
    };
  }

  // innerWidth/innerHeight include scrollbars
  const width = window.innerWidth;
  const height = window.innerHeight;

  // clientWidth/clientHeight exclude scrollbars
  const documentElement = document.documentElement;
  const clientWidth = documentElement.clientWidth;
  const clientHeight = documentElement.clientHeight;

  const aspectRatio = height > 0 ? width / height : 1;

  return {
    width,
    height,
    clientWidth,
    clientHeight,
    aspectRatio,
    isPortrait: height > width,
    isLandscape: width > height,
  };
}

/**
 * Gets the document scroll dimensions.
 *
 * @returns Document scroll dimensions or null in SSR
 *
 * @example
 * ```tsx
 * const scroll = getDocumentSize();
 * if (scroll) {
 *   console.log(`Document is ${scroll.height}px tall`);
 *   console.log(`Scroll progress: ${(scroll.scrollTop / scroll.maxScrollY * 100).toFixed(0)}%`);
 * }
 * ```
 */
export interface DocumentSize {
  /** Full document width */
  readonly width: number;
  /** Full document height */
  readonly height: number;
  /** Current horizontal scroll position */
  readonly scrollLeft: number;
  /** Current vertical scroll position */
  readonly scrollTop: number;
  /** Maximum horizontal scroll */
  readonly maxScrollX: number;
  /** Maximum vertical scroll */
  readonly maxScrollY: number;
}

/**
 * Gets the document scroll dimensions and position.
 *
 * @returns Document size or null in SSR
 */
export function getDocumentSize(): DocumentSize | null {
  if (!isBrowser()) {
    return null;
  }

  const documentElement = document.documentElement;
  const body = document.body;

  // Get the maximum of documentElement and body to handle quirks mode
  const width = Math.max(
    documentElement.scrollWidth,
    body.scrollWidth,
    documentElement.offsetWidth,
    body.offsetWidth,
    documentElement.clientWidth
  );

  const height = Math.max(
    documentElement.scrollHeight,
    body.scrollHeight,
    documentElement.offsetHeight,
    body.offsetHeight,
    documentElement.clientHeight
  );

  const scrollLeft = window.scrollX;
  const scrollTop = window.scrollY;

  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  return {
    width,
    height,
    scrollLeft,
    scrollTop,
    maxScrollX: Math.max(0, width - viewportWidth),
    maxScrollY: Math.max(0, height - viewportHeight),
  };
}

/**
 * Gets the scroll percentage of the document.
 *
 * @returns Scroll percentage (0-1) or 0 in SSR
 *
 * @example
 * ```tsx
 * const progress = getScrollProgress();
 * progressBar.style.width = `${progress * 100}%`;
 * ```
 */
export function getScrollProgress(): number {
  const docSize = getDocumentSize();
  if (!docSize || docSize.maxScrollY === 0) {
    return 0;
  }
  return Math.min(1, Math.max(0, docSize.scrollTop / docSize.maxScrollY));
}
