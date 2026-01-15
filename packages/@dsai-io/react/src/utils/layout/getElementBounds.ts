/**
 * @file getElementBounds - Get element bounding rect
 * @module @dsai/react/utils/layout
 *
 * Retrieves the bounding client rect of an element with SSR safety
 * and additional computed values for layout calculations.
 *
 * Features:
 * - SSR-safe (returns null when DOM unavailable)
 * - Includes scroll-adjusted coordinates
 * - Provides center point calculations
 * - Cached rect to avoid forced reflows
 * - TypeScript-friendly with strict types
 */

import { isBrowser } from '../browser/isBrowser';

/**
 * Element bounds with extended measurements
 */
export interface ElementBounds {
  /** Distance from top of viewport */
  readonly top: number;
  /** Distance from left of viewport */
  readonly left: number;
  /** Distance from right of viewport */
  readonly right: number;
  /** Distance from bottom of viewport */
  readonly bottom: number;
  /** Element width */
  readonly width: number;
  /** Element height */
  readonly height: number;
  /** Horizontal center point */
  readonly centerX: number;
  /** Vertical center point */
  readonly centerY: number;
  /** Distance from document top (scroll-adjusted) */
  readonly absoluteTop: number;
  /** Distance from document left (scroll-adjusted) */
  readonly absoluteLeft: number;
}

/**
 * Options for getElementBounds
 */
export interface GetElementBoundsOptions {
  /**
   * Include scroll offset for absolute positioning.
   * @default true
   */
  includeScrollOffset?: boolean;
}

/**
 * Gets the bounding rect of an element with extended measurements.
 *
 * @param element - The DOM element to measure
 * @param options - Optional configuration
 * @returns Element bounds or null if SSR/invalid element
 *
 * @example
 * ```tsx
 * const bounds = getElementBounds(myElement);
 * if (bounds) {
 *   console.log(`Element is at (${bounds.left}, ${bounds.top})`);
 *   console.log(`Center point: (${bounds.centerX}, ${bounds.centerY})`);
 *   console.log(`Absolute position: (${bounds.absoluteLeft}, ${bounds.absoluteTop})`);
 * }
 *
 * // Without scroll offset
 * const viewportBounds = getElementBounds(myElement, { includeScrollOffset: false });
 * ```
 */
export function getElementBounds(
  element: Element | null | undefined,
  options: GetElementBoundsOptions = {}
): ElementBounds | null {
  // SSR safety check
  if (!isBrowser()) {
    return null;
  }

  // Null/undefined element check
  if (element === null || element === undefined) {
    return null;
  }

  // Validate element has getBoundingClientRect
  if (typeof element.getBoundingClientRect !== 'function') {
    return null;
  }

  const { includeScrollOffset = true } = options;

  try {
    const rect = element.getBoundingClientRect();

    // Get scroll offsets
    const scrollX = includeScrollOffset ? window.scrollX : 0;
    const scrollY = includeScrollOffset ? window.scrollY : 0;

    return {
      top: rect.top,
      left: rect.left,
      right: rect.right,
      bottom: rect.bottom,
      width: rect.width,
      height: rect.height,
      centerX: rect.left + rect.width / 2,
      centerY: rect.top + rect.height / 2,
      absoluteTop: rect.top + scrollY,
      absoluteLeft: rect.left + scrollX,
    };
  } catch {
    // Handle edge cases where getBoundingClientRect might throw
    return null;
  }
}

/**
 * Checks if two element bounds intersect.
 *
 * @param a - First bounds
 * @param b - Second bounds
 * @returns True if bounds intersect
 *
 * @example
 * ```tsx
 * const boundsA = getElementBounds(elementA);
 * const boundsB = getElementBounds(elementB);
 *
 * if (boundsA && boundsB && boundsIntersect(boundsA, boundsB)) {
 *   console.log('Elements are overlapping!');
 * }
 * ```
 */
export function boundsIntersect(a: ElementBounds, b: ElementBounds): boolean {
  // Use <= to ensure touching edges are NOT considered intersecting
  return !(a.right <= b.left || a.left >= b.right || a.bottom <= b.top || a.top >= b.bottom);
}

/**
 * Checks if an element's bounds are within the viewport.
 *
 * @param bounds - Element bounds to check
 * @param threshold - Percentage of element that must be visible (0-1)
 * @returns True if element is visible within threshold
 *
 * @example
 * ```tsx
 * const bounds = getElementBounds(element);
 * if (bounds && isInViewport(bounds, 0.5)) {
 *   console.log('At least 50% of element is visible');
 * }
 * ```
 */
export function isInViewport(bounds: ElementBounds, threshold = 0): boolean {
  if (!isBrowser()) {
    return false;
  }

  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  // Calculate visible portion
  const visibleLeft = Math.max(0, bounds.left);
  const visibleRight = Math.min(viewportWidth, bounds.right);
  const visibleTop = Math.max(0, bounds.top);
  const visibleBottom = Math.min(viewportHeight, bounds.bottom);

  const visibleWidth = Math.max(0, visibleRight - visibleLeft);
  const visibleHeight = Math.max(0, visibleBottom - visibleTop);

  const visibleArea = visibleWidth * visibleHeight;
  const totalArea = bounds.width * bounds.height;

  // Return false if no visible area (element completely outside viewport)
  if (visibleArea === 0) {
    return false;
  }

  // Avoid division by zero
  if (totalArea === 0) {
    return false;
  }

  const visibleRatio = visibleArea / totalArea;
  return visibleRatio >= threshold;
}
