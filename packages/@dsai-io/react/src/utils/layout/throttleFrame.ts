/**
 * @file throttleFrame - Throttle function to animation frame
 * @module @dsai-io/react/utils/layout
 *
 * Throttles function execution to animation frames, ensuring smooth
 * animations and preventing excessive callback execution.
 *
 * Features:
 * - Limits execution to once per animation frame
 * - SSR-safe (uses setTimeout fallback)
 * - Preserves function signature
 * - Provides cancel and flush methods
 * - TypeScript-friendly with generic types
 */

import { isBrowser } from '../browser/isBrowser';

/**
 * Throttled function interface with control methods
 */
export interface ThrottledFrameFunction<T extends (...args: unknown[]) => unknown> {
  /** Call the throttled function */
  (...args: Parameters<T>): void;
  /** Cancel any pending frame */
  cancel(): void;
  /** Execute immediately if pending */
  flush(): void;
  /** Check if a call is pending */
  readonly pending: boolean;
}

/**
 * Options for throttleFrame
 */
export interface ThrottleFrameOptions {
  /**
   * Execute on leading edge (immediate first call).
   * @default true
   */
  leading?: boolean;

  /**
   * Execute on trailing edge (after last call).
   * @default true
   */
  trailing?: boolean;
}

/**
 * Throttles a function to execute at most once per animation frame.
 *
 * @param fn - Function to throttle
 * @param options - Optional configuration
 * @returns Throttled function with cancel/flush methods
 *
 * @example
 * ```tsx
 * // Throttle scroll handler
 * const handleScroll = throttleFrame((event: Event) => {
 *   updateScrollPosition();
 * });
 *
 * window.addEventListener('scroll', handleScroll);
 *
 * // Cleanup
 * window.removeEventListener('scroll', handleScroll);
 * handleScroll.cancel();
 *
 * // Check if pending
 * if (handleScroll.pending) {
 *   handleScroll.flush(); // Execute immediately
 * }
 *
 * // With options
 * const handleResize = throttleFrame(updateLayout, {
 *   leading: false,  // Don't execute on first call
 *   trailing: true,  // Execute after last call
 * });
 * ```
 */
export function throttleFrame<T extends (...args: unknown[]) => unknown>(
  fn: T,
  options: ThrottleFrameOptions = {}
): ThrottledFrameFunction<T> {
  const { leading = true, trailing = true } = options;

  let frameId: number | ReturnType<typeof setTimeout> | null = null;
  let lastArgs: Parameters<T> | null = null;
  let isPending = false;
  let hasLeadingCall = false;

  const cancelFrame = (): void => {
    if (frameId !== null) {
      const caf = globalThis.window === undefined ? undefined : globalThis.cancelAnimationFrame;
      if (isBrowser() && typeof caf === 'function' && typeof frameId === 'number') {
        caf(frameId);
      } else if (
        isBrowser() &&
        typeof cancelAnimationFrame === 'function' &&
        typeof frameId === 'number'
      ) {
        cancelAnimationFrame(frameId);
      } else if (typeof frameId !== 'number') {
        clearTimeout(frameId);
      }
      frameId = null;
    }
  };

  const scheduleFrame = (callback: () => void): void => {
    if (!isBrowser()) {
      // SSR - execute synchronously
      callback();
      return;
    }

    const raf = globalThis.window === undefined ? undefined : globalThis.requestAnimationFrame;
    if (typeof raf === 'function') {
      frameId = raf(callback);
    } else if (typeof requestAnimationFrame === 'function') {
      frameId = requestAnimationFrame(callback);
    } else {
      frameId = setTimeout(callback, 16);
    }
  };

  const execute = (): void => {
    isPending = false;
    frameId = null;
    hasLeadingCall = false;

    if (lastArgs !== null) {
      const args = lastArgs;
      lastArgs = null;
      fn(...args);
    }
  };

  const throttled = ((...args: Parameters<T>): void => {
    lastArgs = args;

    // Leading edge execution
    if (leading && !hasLeadingCall && !isPending) {
      hasLeadingCall = true;
      fn(...args);
      // Clear lastArgs after leading call - we only want trailing if NEW calls come in
      lastArgs = null;

      // Schedule frame to reset leading flag
      if (trailing) {
        isPending = true;
        scheduleFrame(() => {
          isPending = false;
          hasLeadingCall = false;

          // Execute trailing if there were calls during the frame
          if (lastArgs !== null && trailing) {
            const trailingArgs = lastArgs;
            lastArgs = null;
            fn(...trailingArgs);
          }
        });
      } else {
        // Just reset after frame
        scheduleFrame(() => {
          hasLeadingCall = false;
        });
      }
      return;
    }

    // Already pending - just update args for trailing execution
    if (isPending) {
      return;
    }

    // Schedule trailing execution
    if (trailing) {
      isPending = true;
      scheduleFrame(execute);
    }
  }) as ThrottledFrameFunction<T>;

  throttled.cancel = (): void => {
    cancelFrame();
    lastArgs = null;
    isPending = false;
    hasLeadingCall = false;
  };

  throttled.flush = (): void => {
    if (isPending && lastArgs !== null) {
      cancelFrame();
      const args = lastArgs;
      lastArgs = null;
      isPending = false;
      hasLeadingCall = false;
      fn(...args);
    }
  };

  Object.defineProperty(throttled, 'pending', {
    get: () => isPending,
    enumerable: true,
  });

  return throttled;
}

/**
 * Creates a throttled callback that only runs once per animation frame.
 * Simpler API than throttleFrame when you don't need options.
 *
 * @param fn - Function to throttle
 * @returns Throttled function
 *
 * @example
 * ```tsx
 * const updatePosition = rafThrottle((x: number, y: number) => {
 *   element.style.transform = `translate(${x}px, ${y}px)`;
 * });
 *
 * document.addEventListener('mousemove', (e) => {
 *   updatePosition(e.clientX, e.clientY);
 * });
 * ```
 */
export function rafThrottle<T extends (...args: unknown[]) => unknown>(
  fn: T
): (...args: Parameters<T>) => void {
  let frameId: number | null = null;
  let lastArgs: Parameters<T> | null = null;

  return (...args: Parameters<T>): void => {
    lastArgs = args;

    if (frameId !== null) {
      return;
    }

    const raf = globalThis.window === undefined ? undefined : globalThis.requestAnimationFrame;
    if (
      !isBrowser() ||
      (typeof raf !== 'function' && typeof requestAnimationFrame !== 'function')
    ) {
      fn(...args);
      return;
    }

    const rafFn = typeof raf === 'function' ? raf : requestAnimationFrame;
    frameId = rafFn(() => {
      frameId = null;
      if (lastArgs !== null) {
        fn(...lastArgs);
        lastArgs = null;
      }
    });
  };
}
