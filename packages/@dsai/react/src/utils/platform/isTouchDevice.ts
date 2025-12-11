import { isBrowser } from '../browser';

import type { CachedFunction } from './cache';

interface NavigatorWithMS extends Navigator {
  msMaxTouchPoints?: number;
}

/**
 * Detects if the current device has touch capability.
 *
 * Checks for touch event support and pointer type. Note that some devices
 * support both touch and mouse (e.g., Surface with touch screen).
 *
 * **Key Features**:
 * - Touch event API detection
 * - Pointer type detection
 * - Max touch points check
 * - SSR-safe
 * - Cached result
 *
 * @returns True if device supports touch, false otherwise (null in SSR)
 *
 * @example
 * ```tsx
 * function InteractiveElement() {
 *   const hasTouch = isTouchDevice();
 *
 *   return (
 *     <button
 *       // Larger touch target for touch devices
 *       style={{ minHeight: hasTouch ? '44px' : '32px' }}
 *     >
 *       Click me
 *     </button>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Conditional gesture handling
 * function DraggableItem() {
 *   const hasTouch = isTouchDevice();
 *
 *   return (
 *     <div
 *       onTouchStart={hasTouch ? handleTouchStart : undefined}
 *       onMouseDown={!hasTouch ? handleMouseDown : undefined}
 *     >
 *       Drag me
 *     </div>
 *   );
 * }
 * ```
 */
export function isTouchDevice(): boolean | null {
  if (!isBrowser()) {
    return null;
  }

  // Cache the result
  const cached = (isTouchDevice as CachedFunction<boolean | null>)._cached;
  if (typeof cached === 'boolean') {
    return cached;
  }

  const hasTouchEvents =
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    ((navigator as NavigatorWithMS).msMaxTouchPoints ?? 0) > 0;

  const hasCoarsePointer = window.matchMedia?.('(pointer: coarse)').matches;

  const result = hasTouchEvents || hasCoarsePointer;

  // Cache the result
  (isTouchDevice as CachedFunction<boolean | null>)._cached = result;

  return result;
}
