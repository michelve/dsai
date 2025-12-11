/**
 * @file throttle - Function throttling utility
 * @module @dsai/react/utils/timing
 *
 * Enterprise-grade throttling with:
 * - Leading and trailing edge execution
 * - Cleanup/cancellation support
 * - Proper TypeScript typing with generics
 * - Memory leak prevention
 * - Comprehensive error handling
 */

import type { ThrottleOptions, ThrottledFunction } from '../types/shared';

/**
 * Create a throttled function that only invokes func at most once per every wait milliseconds.
 *
 * @param func - Function to throttle
 * @param wait - Milliseconds to throttle (default: 300ms)
 * @param options - Throttle options (leading, trailing)
 * @returns Throttled function with cancel() and flush() methods
 *
 * @throws {TypeError} If func is not a function
 * @throws {RangeError} If wait is negative
 *
 * @example
 * ```tsx
 * // Basic throttle
 * const handleScroll = throttle(() => {
 *   console.log('Scroll event');
 * }, 200);
 *
 * // Leading edge only (execute immediately, ignore subsequent calls)
 * const handleClick = throttle(() => {
 *   console.log('Click event');
 * }, 300, { leading: true, trailing: false });
 *
 * // Trailing edge only (execute after wait time)
 * const handleInput = throttle((value: string) => {
 *   console.log('Input:', value);
 * }, 300, { leading: false, trailing: true });
 *
 * // Both edges (default: leading + trailing)
 * const handleResize = throttle(() => {
 *   console.log('Resize event');
 * }, 200);
 *
 * // Cancel pending execution
 * const throttledFn = throttle(() => console.log('Execute'), 1000);
 * throttledFn();
 * throttledFn.cancel(); // Prevents trailing execution
 *
 * // Flush (execute immediately if pending)
 * const throttledFn2 = throttle(() => console.log('Execute'), 1000);
 * throttledFn2();
 * throttledFn2.flush(); // Executes trailing edge immediately
 *
 * // Cleanup in React
 * useEffect(() => {
 *   const throttledScroll = throttle(handleScroll, 200);
 *   window.addEventListener('scroll', throttledScroll);
 *   return () => {
 *     window.removeEventListener('scroll', throttledScroll);
 *     throttledScroll.cancel(); // Clean up pending timers
 *   };
 * }, []);
 * ```
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait = 300,
  options: ThrottleOptions = {}
): ThrottledFunction<T> {
  // Validate inputs
  if (typeof func !== 'function') {
    throw new TypeError(`throttle expects a function, received ${typeof func}`);
  }

  if (wait < 0) {
    throw new RangeError('throttle wait time must be non-negative');
  }

  // Extract options with defaults
  const { leading = true, trailing = true } = options;

  // Internal state
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  let lastCallTime: number | undefined;
  let lastInvokeTime = 0;
  let lastArgs: unknown[] | undefined;
  let lastThis: unknown;
  let result: unknown;

  /**
   * Invoke the function
   */
  function invokeFunc(time: number): unknown {
    const args = lastArgs;
    const thisArg = lastThis;

    lastArgs = undefined;
    lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg as ThisParameterType<T>, args as Parameters<T>);
    return result;
  }

  /**
   * Check if we should invoke
   */
  function shouldInvoke(time: number): boolean {
    const timeSinceLastCall = time - (lastCallTime ?? 0);
    const timeSinceLastInvoke = time - lastInvokeTime;

    // First call or wait time has passed
    return (
      lastCallTime === undefined || timeSinceLastInvoke >= wait || timeSinceLastCall < 0 // Handle clock drift
    );
  }

  /**
   * Timer expired - trailing edge
   */
  function timerExpired(): unknown {
    const time = Date.now();
    timeoutId = undefined;

    // If we should invoke on trailing edge and we have pending args
    if (trailing && lastArgs !== undefined) {
      return invokeFunc(time);
    }

    // Clean up
    lastArgs = undefined;
    lastThis = undefined;
    return result;
  }

  /**
   * Cancel the timer
   */
  function cancelTimer(): void {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
      timeoutId = undefined;
    }
  }

  /**
   * Remaining wait time
   */
  function remainingWait(time: number): number {
    const timeSinceLastInvoke = time - lastInvokeTime;
    return wait - timeSinceLastInvoke;
  }

  /**
   * Throttled function
   */
  function throttled(this: unknown, ...args: unknown[]): unknown {
    const time = Date.now();
    const isInvoking = shouldInvoke(time);

    lastArgs = args;
    lastThis = this;
    lastCallTime = time;

    // Leading edge
    if (isInvoking) {
      // Cancel existing timer
      cancelTimer();

      // Invoke if leading edge is enabled
      if (leading) {
        result = invokeFunc(time);
      }

      // Start timer for trailing edge
      if (trailing) {
        const timeToWait = remainingWait(time);
        timeoutId = setTimeout(timerExpired, Math.max(timeToWait, 0));
      }
    } else if (trailing && timeoutId === undefined) {
      // Not invoking but trailing is enabled and no timer is set
      const timeToWait = remainingWait(time);
      timeoutId = setTimeout(timerExpired, Math.max(timeToWait, 0));
    }

    return result;
  }

  /**
   * Cancel pending function invocations
   */
  throttled.cancel = (): void => {
    cancelTimer();
    lastInvokeTime = 0;
    lastArgs = undefined;
    lastThis = undefined;
    lastCallTime = undefined;
  };

  /**
   * Immediately invoke pending function
   */
  throttled.flush = (): unknown => {
    if (timeoutId === undefined) {
      return result;
    }

    const time = Date.now();
    cancelTimer();

    if (lastArgs !== undefined) {
      return invokeFunc(time);
    }

    return result;
  };

  /**
   * Check if there are pending invocations
   */
  throttled.pending = (): boolean => {
    return timeoutId !== undefined;
  };

  return throttled as ThrottledFunction<T>;
}
