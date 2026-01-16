/**
 * @file scheduleFrame - requestAnimationFrame wrapper with cleanup
 * @module @dsai-io/react/utils/layout
 *
 * A wrapper around requestAnimationFrame that provides automatic cleanup,
 * SSR safety, and convenient scheduling patterns.
 *
 * Features:
 * - SSR-safe (uses setTimeout fallback when rAF unavailable)
 * - Automatic cleanup function returned
 * - Loop scheduling for continuous animations
 * - Delta time calculation
 * - TypeScript-friendly with strict types
 */

import { isBrowser } from '../browser/isBrowser';

/**
 * Frame callback with timing information
 */
export interface FrameInfo {
  /** Current timestamp (performance.now() or Date.now()) */
  readonly timestamp: number;
  /** Time since last frame in milliseconds */
  readonly deltaTime: number;
  /** Total elapsed time since start in milliseconds */
  readonly elapsedTime: number;
  /** Frame count since start */
  readonly frameCount: number;
}

/**
 * Frame callback function
 */
export type FrameCallback = (info: FrameInfo) => void;

/**
 * Loop callback function - return false to stop the loop
 */
export type LoopCallback = (info: FrameInfo) => boolean | undefined;

/**
 * Cleanup function to cancel scheduled frame
 */
export type FrameCleanup = () => void;

/**
 * Schedules a single frame callback.
 *
 * @param callback - Function to call on next animation frame
 * @returns Cleanup function to cancel the scheduled frame
 *
 * @example
 * ```tsx
 * // Schedule a single frame
 * const cancel = scheduleFrame((info) => {
 *   console.log(`Frame at ${info.timestamp}ms`);
 * });
 *
 * // Cancel if needed
 * cancel();
 *
 * // In React useEffect
 * useEffect(() => {
 *   const cancel = scheduleFrame(() => {
 *     element.style.transform = 'translateX(100px)';
 *   });
 *   return cancel;
 * }, []);
 * ```
 */
export function scheduleFrame(callback: FrameCallback): FrameCleanup {
  const startTime = getTimestamp();
  let cancelled = false;
  let frameId: number | ReturnType<typeof setTimeout> | null = null;

  const wrappedCallback = (timestamp: number): void => {
    if (cancelled) {
      return;
    }

    const info: FrameInfo = {
      timestamp,
      deltaTime: 0, // No previous frame for single schedule
      elapsedTime: timestamp - startTime,
      frameCount: 1,
    };

    callback(info);
  };

  // SSR safety check
  if (!isBrowser()) {
    return () => {
      cancelled = true;
    };
  }

  // Use rAF if available, otherwise setTimeout
  // Access through window to ensure testability with mocks
  const raf = typeof window !== 'undefined' ? window.requestAnimationFrame : undefined;
  if (typeof raf === 'function') {
    frameId = raf(wrappedCallback);
  } else if (typeof requestAnimationFrame === 'function') {
    frameId = requestAnimationFrame(wrappedCallback);
  } else {
    frameId = setTimeout(() => {
      wrappedCallback(getTimestamp());
    }, 16); // ~60fps fallback
  }

  return () => {
    cancelled = true;
    if (frameId !== null) {
      // Access through window to ensure testability with mocks
      const caf = typeof window !== 'undefined' ? window.cancelAnimationFrame : undefined;
      if (typeof caf === 'function' && typeof frameId === 'number') {
        caf(frameId);
      } else if (typeof cancelAnimationFrame === 'function' && typeof frameId === 'number') {
        cancelAnimationFrame(frameId);
      } else if (typeof frameId !== 'number') {
        clearTimeout(frameId);
      }
    }
  };
}

/**
 * Schedules multiple frames to run after a delay.
 *
 * @param callback - Function to call on each frame
 * @param delayFrames - Number of frames to wait before calling
 * @returns Cleanup function to cancel
 *
 * @example
 * ```tsx
 * // Wait 3 frames before running
 * const cancel = scheduleFrameAfter(() => {
 *   doSomething();
 * }, 3);
 * ```
 */
export function scheduleFrameAfter(callback: FrameCallback, delayFrames: number): FrameCleanup {
  if (delayFrames <= 0) {
    return scheduleFrame(callback);
  }

  let framesRemaining = delayFrames;
  let cancelled = false;
  let currentCancel: FrameCleanup | null = null;

  const tick = (): void => {
    if (cancelled) {
      return;
    }

    framesRemaining--;

    if (framesRemaining <= 0) {
      currentCancel = scheduleFrame(callback);
    } else {
      currentCancel = scheduleFrame(tick as unknown as FrameCallback);
    }
  };

  currentCancel = scheduleFrame(tick as unknown as FrameCallback);

  return () => {
    cancelled = true;
    if (currentCancel !== null) {
      currentCancel();
    }
  };
}

/**
 * Starts an animation loop that runs on each frame.
 *
 * @param callback - Function called on each frame. Return false to stop the loop.
 * @returns Cleanup function to stop the loop
 *
 * @example
 * ```tsx
 * // Continuous animation loop
 * const stop = startLoop((info) => {
 *   element.style.transform = `translateX(${Math.sin(info.elapsedTime / 1000) * 100}px)`;
 *
 *   // Stop after 5 seconds
 *   if (info.elapsedTime > 5000) {
 *     return false;
 *   }
 * });
 *
 * // Or stop manually
 * stop();
 * ```
 */
export function startLoop(callback: LoopCallback): FrameCleanup {
  const startTime = getTimestamp();
  let lastTime = startTime;
  let frameCount = 0;
  let cancelled = false;
  let frameId: number | ReturnType<typeof setTimeout> | null = null;

  const tick = (timestamp: number): void => {
    if (cancelled) {
      return;
    }

    frameCount++;
    const deltaTime = timestamp - lastTime;
    const elapsedTime = timestamp - startTime;
    lastTime = timestamp;

    const info: FrameInfo = {
      timestamp,
      deltaTime,
      elapsedTime,
      frameCount,
    };

    const shouldContinue = callback(info);

    // Continue loop unless explicitly stopped
    if (shouldContinue !== false && !cancelled) {
      scheduleNextFrame();
    }
  };

  const scheduleNextFrame = (): void => {
    if (!isBrowser()) {
      return;
    }

    // Access through window to ensure testability with mocks
    const raf = typeof window !== 'undefined' ? window.requestAnimationFrame : undefined;
    if (typeof raf === 'function') {
      frameId = raf(tick);
    } else if (typeof requestAnimationFrame === 'function') {
      frameId = requestAnimationFrame(tick);
    } else {
      frameId = setTimeout(() => {
        tick(getTimestamp());
      }, 16);
    }
  };

  // Start the loop
  scheduleNextFrame();

  return () => {
    cancelled = true;
    if (frameId !== null) {
      // Access through window to ensure testability with mocks
      const caf = typeof window !== 'undefined' ? window.cancelAnimationFrame : undefined;
      if (typeof caf === 'function' && typeof frameId === 'number') {
        caf(frameId);
      } else if (typeof cancelAnimationFrame === 'function' && typeof frameId === 'number') {
        cancelAnimationFrame(frameId);
      } else if (typeof frameId !== 'number') {
        clearTimeout(frameId);
      }
    }
  };
}

/**
 * Gets the current timestamp using performance.now() or Date.now() fallback.
 */
function getTimestamp(): number {
  if (isBrowser() && typeof performance !== 'undefined' && typeof performance.now === 'function') {
    return performance.now();
  }
  return Date.now();
}
