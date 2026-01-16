/**
 * Start a performance timing session
 *
 * Returns an object that can be used to end the timing and get duration.
 * Useful for measuring operations that span multiple function calls.
 *
 * @module utils/telemetry
 */

import { isBrowser } from '../browser/isBrowser';

/**
 * Active timing session
 */
export interface TimingSession {
  /**
   * Session name/label
   */
  readonly name: string;

  /**
   * Start timestamp (milliseconds)
   */
  readonly startTime: number;

  /**
   * End the timing session and get duration
   *
   * @returns Duration in milliseconds
   */
  end(): number;

  /**
   * Get elapsed time without ending the session
   *
   * @returns Elapsed time in milliseconds
   */
  elapsed(): number;
}

/**
 * Get current timestamp with best available precision
 *
 * @returns Milliseconds
 * @internal
 */
function now(): number {
  if (isBrowser() && typeof performance !== 'undefined' && performance.now) {
    return performance.now();
  }
  return Date.now();
}

/**
 * Start a performance timing session
 *
 * @example
 * ```ts
 * const timer = startTiming('data-processing');
 *
 * // ... do some work ...
 * console.log(`Elapsed: ${timer.elapsed()}ms`);
 *
 * // ... do more work ...
 * const duration = timer.end();
 * console.log(`Total: ${duration}ms`);
 * ```
 *
 * @example With Performance API marks
 * ```ts
 * const timer = startTiming('render');
 * renderComponent();
 * const duration = timer.end();
 * // Automatically creates performance marks/measures
 * ```
 *
 * @param name - Session name/label
 * @returns Timing session object
 */
export function startTiming(name: string): TimingSession {
  const startTime = now();
  let ended = false;
  let cachedDuration: number | null = null;

  const hasPerformance = isBrowser() && typeof performance !== 'undefined';
  const canUseMarks =
    hasPerformance &&
    typeof performance.mark === 'function' &&
    typeof performance.measure === 'function';

  // Create start mark
  if (canUseMarks) {
    try {
      performance.mark(`${name}-start`);
    } catch {
      // Ignore mark errors
    }
  }

  return {
    name,
    startTime,

    elapsed(): number {
      return now() - startTime;
    },

    end(): number {
      if (ended && cachedDuration !== null) {
        // Already ended, return cached duration (idempotent)
        return cachedDuration;
      }

      ended = true;
      const endTime = now();
      const duration = endTime - startTime;
      cachedDuration = duration;

      // Create end mark and measure
      if (canUseMarks) {
        try {
          performance.mark(`${name}-end`);
          performance.measure(name, `${name}-start`, `${name}-end`);

          // Clean up marks to avoid memory leaks
          performance.clearMarks(`${name}-start`);
          performance.clearMarks(`${name}-end`);
          performance.clearMeasures(name);
        } catch {
          // Ignore measure errors
        }
      }

      return duration;
    },
  };
}
