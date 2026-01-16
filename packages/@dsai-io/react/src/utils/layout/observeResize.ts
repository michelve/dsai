/**
 * @file observeResize - ResizeObserver wrapper with cleanup
 * @module @dsai-io/react/utils/layout
 *
 * A wrapper around ResizeObserver that provides automatic cleanup,
 * debouncing, and SSR safety.
 *
 * Features:
 * - SSR-safe (no-op when ResizeObserver unavailable)
 * - Automatic cleanup function returned
 * - Optional debouncing to prevent excessive callbacks
 * - Simplified callback signature
 * - Box model options (content-box, border-box, device-pixel-content-box)
 * - TypeScript-friendly with strict types
 */

import { isBrowser } from '../browser/isBrowser';

/**
 * Resize entry with simplified measurements
 */
export interface ResizeEntry {
  /** The observed element */
  readonly target: Element;
  /** Element width */
  readonly width: number;
  /** Element height */
  readonly height: number;
  /** Content rect (for detailed measurements) */
  readonly contentRect: DOMRectReadOnly;
  /** Border box size (if available) */
  readonly borderBoxSize?: readonly ResizeObserverSize[];
  /** Content box size (if available) */
  readonly contentBoxSize?: readonly ResizeObserverSize[];
}

/**
 * Callback for resize observations
 */
export type ResizeCallback = (entry: ResizeEntry) => void;

/**
 * Options for observeResize
 */
export interface ObserveResizeOptions {
  /**
   * Which box model to observe.
   * @default 'content-box'
   */
  box?: ResizeObserverBoxOptions;

  /**
   * Debounce delay in milliseconds.
   * Set to 0 to disable debouncing.
   * @default 0
   */
  debounce?: number;
}

/**
 * Cleanup function to stop observing
 */
export type ResizeCleanup = () => void;

/**
 * Observes an element for size changes.
 *
 * @param element - Element to observe
 * @param callback - Function called on resize
 * @param options - Optional configuration
 * @returns Cleanup function to stop observing
 *
 * @example
 * ```tsx
 * // Basic usage
 * const cleanup = observeResize(myElement, (entry) => {
 *   console.log(`New size: ${entry.width}x${entry.height}`);
 * });
 *
 * // Cleanup when done
 * cleanup();
 *
 * // With debouncing
 * const cleanup = observeResize(
 *   myElement,
 *   (entry) => handleResize(entry),
 *   { debounce: 100 }
 * );
 *
 * // In React useEffect
 * useEffect(() => {
 *   const cleanup = observeResize(ref.current, handleResize);
 *   return cleanup;
 * }, []);
 * ```
 */
export function observeResize(
  element: Element | null | undefined,
  callback: ResizeCallback,
  options: ObserveResizeOptions = {}
): ResizeCleanup {
  // SSR safety check
  if (!isBrowser()) {
    return () => {
      // No-op cleanup
    };
  }

  // Check for ResizeObserver support
  if (typeof ResizeObserver === 'undefined') {
    return () => {
      // No-op cleanup
    };
  }

  // Null/undefined element check
  if (element === null || element === undefined) {
    return () => {
      // No-op cleanup
    };
  }

  const { box = 'content-box', debounce: debounceMs = 0 } = options;

  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let lastEntry: ResizeEntry | null = null;

  const debouncedCallback = (entry: ResizeEntry): void => {
    if (debounceMs <= 0) {
      callback(entry);
      return;
    }

    lastEntry = entry;

    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      if (lastEntry !== null) {
        callback(lastEntry);
        lastEntry = null;
      }
      timeoutId = null;
    }, debounceMs);
  };

  const observer = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const resizeEntry: ResizeEntry = {
        target: entry.target,
        width: entry.contentRect.width,
        height: entry.contentRect.height,
        contentRect: entry.contentRect,
        borderBoxSize: entry.borderBoxSize,
        contentBoxSize: entry.contentBoxSize,
      };
      debouncedCallback(resizeEntry);
    }
  });

  try {
    observer.observe(element, { box });
  } catch {
    // Some browsers may not support all box options
    try {
      observer.observe(element);
    } catch {
      // If observation fails entirely, return no-op
      return () => {
        // No-op cleanup
      };
    }
  }

  return () => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
    observer.disconnect();
  };
}

/**
 * Observes multiple elements for size changes.
 *
 * @param elements - Elements to observe
 * @param callback - Function called on resize (includes target element)
 * @param options - Optional configuration
 * @returns Cleanup function to stop observing all elements
 *
 * @example
 * ```tsx
 * const cleanup = observeResizeMany(
 *   [element1, element2, element3],
 *   (entry) => {
 *     console.log(`${entry.target.id} resized to ${entry.width}x${entry.height}`);
 *   }
 * );
 *
 * // Cleanup all observations
 * cleanup();
 * ```
 */
export function observeResizeMany(
  elements: readonly (Element | null | undefined)[],
  callback: ResizeCallback,
  options: ObserveResizeOptions = {}
): ResizeCleanup {
  const cleanups: ResizeCleanup[] = [];

  for (const element of elements) {
    if (element !== null && element !== undefined) {
      cleanups.push(observeResize(element, callback, options));
    }
  }

  return () => {
    for (const cleanup of cleanups) {
      cleanup();
    }
  };
}
