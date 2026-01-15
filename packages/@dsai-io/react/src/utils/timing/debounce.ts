/**
 * @file debounce - Function debouncing utility
 * @module @dsai/react/utils/timing
 *
 * Enterprise-grade debouncing with:
 * - Leading and trailing edge execution
 * - Maximum wait time enforcement
 * - Cleanup/cancellation support
 * - Proper TypeScript typing with generics
 * - Memory leak prevention
 * - Comprehensive error handling
 */

import type { DebounceOptions, DebouncedFunction } from '../types/shared';

/**
 * Create a debounced function that delays invoking func until after wait milliseconds
 * have elapsed since the last time the debounced function was invoked.
 *
 * @param func - Function to debounce
 * @param wait - Milliseconds to delay (default: 300ms)
 * @param options - Debounce options (leading, trailing, maxWait)
 * @returns Debounced function with cancel() and flush() methods
 *
 * @throws {TypeError} If func is not a function
 * @throws {RangeError} If wait is negative
 *
 * @example
 * ```tsx
 * // Basic debounce
 * const handleSearch = debounce((query: string) => {
 *   console.log('Searching for:', query);
 * }, 300);
 *
 * // Leading edge (immediate execution, then debounce)
 * const handleClick = debounce(() => {
 *   console.log('Clicked!');
 * }, 300, { leading: true, trailing: false });
 *
 * // Maximum wait (ensure execution within maxWait)
 * const handleScroll = debounce(() => {
 *   console.log('Scrolled!');
 * }, 300, { maxWait: 1000 });
 *
 * // Cancel pending execution
 * const debouncedFn = debounce(() => console.log('Execute'), 1000);
 * debouncedFn();
 * debouncedFn.cancel(); // Prevents execution
 *
 * // Flush (execute immediately)
 * const debouncedFn2 = debounce(() => console.log('Execute'), 1000);
 * debouncedFn2();
 * debouncedFn2.flush(); // Executes immediately
 *
 * // Cleanup in React
 * useEffect(() => {
 *   const debouncedResize = debounce(handleResize, 200);
 *   window.addEventListener('resize', debouncedResize);
 *   return () => {
 *     window.removeEventListener('resize', debouncedResize);
 *     debouncedResize.cancel(); // Clean up pending timers
 *   };
 * }, []);
 * ```
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait = 300,
  options: DebounceOptions = {}
): DebouncedFunction<T> {
  // Validate inputs
  if (typeof func !== 'function') {
    throw new TypeError(`debounce expects a function, received ${typeof func}`);
  }

  if (wait < 0) {
    throw new RangeError('debounce wait time must be non-negative');
  }

  // Extract options with defaults
  const { leading = false, trailing = true, maxWait } = options;

  // Validate maxWait
  if (maxWait !== undefined && maxWait < wait) {
    throw new RangeError('debounce maxWait must be greater than or equal to wait');
  }

  // Internal state
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  let maxWaitTimeoutId: ReturnType<typeof setTimeout> | undefined;
  let lastCallTime: number | undefined;
  let lastInvokeTime: number | undefined;
  let pendingCall: { thisArg: unknown; args: unknown[] } | undefined;
  let result: unknown;

  /**
   * Invoke the function
   */
  function invokeFunc(time: number): unknown {
    const call = pendingCall;
    pendingCall = undefined;
    lastInvokeTime = time;
    if (call) {
      result = func.apply(call.thisArg as ThisParameterType<T>, call.args as Parameters<T>);
    }
    return result;
  }

  /**
   * Check if we should invoke on the leading edge
   */
  function shouldInvokeLeading(time: number): boolean {
    const timeSinceLastCall = time - (lastCallTime ?? 0);
    const timeSinceLastInvoke = time - (lastInvokeTime ?? time);

    // First call or wait time has passed
    return (
      lastCallTime === undefined ||
      timeSinceLastCall >= wait ||
      timeSinceLastCall < 0 || // Handle clock drift
      (maxWait !== undefined && timeSinceLastInvoke >= maxWait)
    );
  }

  /**
   * Start the timer for trailing edge
   */
  function startTimer(pendingFunc: () => unknown, wait: number): ReturnType<typeof setTimeout> {
    return setTimeout(pendingFunc, wait);
  }

  /**
   * Cancel all timers
   */
  function cancelTimers(): void {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
      timeoutId = undefined;
    }
    if (maxWaitTimeoutId !== undefined) {
      clearTimeout(maxWaitTimeoutId);
      maxWaitTimeoutId = undefined;
    }
  }

  /**
   * Cancel only the trailing timer
   */
  function cancelTrailingTimer(): void {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
      timeoutId = undefined;
    }
  }

  /**
   * Timer expired - trailing edge
   */
  function timerExpired(): unknown {
    const time = Date.now();

    // Clear timer IDs
    timeoutId = undefined;
    if (maxWaitTimeoutId !== undefined) {
      clearTimeout(maxWaitTimeoutId);
      maxWaitTimeoutId = undefined;
    }

    // Only invoke if we have pending call (maxWait might have already cleared it)
    if (trailing && pendingCall !== undefined) {
      return invokeFunc(time);
    }

    // Clean up
    pendingCall = undefined;
    return result;
  }

  /**
   * Max wait timer expired
   */
  function maxWaitExpired(): unknown {
    const time = Date.now();

    // Clear timer IDs
    maxWaitTimeoutId = undefined;
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
      timeoutId = undefined;
    }

    // Only invoke if we have pending call
    if (pendingCall !== undefined) {
      return invokeFunc(time);
    }

    return result;
  }

  /**
   * Remaining wait time
   */
  function remainingWait(time: number): number {
    const timeSinceLastCall = time - (lastCallTime ?? 0);
    const timeSinceLastInvoke = time - (lastInvokeTime ?? time);
    const timeWaiting = wait - timeSinceLastCall;

    if (maxWait === undefined) {
      return timeWaiting;
    }

    return Math.min(timeWaiting, maxWait - timeSinceLastInvoke);
  }

  /**
   * Debounced function
   */
  function debounced(this: unknown, ...args: unknown[]): unknown {
    const time = Date.now();
    const isInvoking = shouldInvokeLeading(time);

    pendingCall = { thisArg: this, args };
    lastCallTime = time;

    // Leading edge
    if (isInvoking && leading) {
      if (timeoutId === undefined) {
        lastInvokeTime = time;
        result = func.apply(this as ThisParameterType<T>, args as Parameters<T>);
      }
    }

    // Cancel only the trailing timer (keep maxWait timer running)
    cancelTrailingTimer();

    // Start new timer for trailing edge (but avoid colliding with maxWait)
    const timeToWait = remainingWait(time);
    const maxWaitRemaining =
      maxWait !== undefined ? maxWait - (time - (lastInvokeTime ?? time)) : undefined;

    const shouldScheduleTrailing =
      maxWaitRemaining === undefined || maxWaitRemaining <= 0 || timeToWait < maxWaitRemaining;

    if (shouldScheduleTrailing) {
      timeoutId = startTimer(timerExpired, Math.max(0, timeToWait));
    }

    // Start maxWait timer if configured (only on first call or after invoke)
    if (maxWait !== undefined && maxWaitTimeoutId === undefined) {
      const timeSinceLastInvoke = time - (lastInvokeTime ?? time);
      const maxTimeToWait = maxWait - timeSinceLastInvoke;
      if (maxTimeToWait > 0) {
        maxWaitTimeoutId = startTimer(maxWaitExpired, maxTimeToWait);
      }
    }

    return result;
  }

  /**
   * Cancel pending function invocations
   */
  debounced.cancel = (): void => {
    cancelTimers();
    lastInvokeTime = undefined;
    pendingCall = undefined;
    lastCallTime = undefined;
  };

  /**
   * Immediately invoke pending function
   */
  debounced.flush = (): unknown => {
    if (timeoutId === undefined && maxWaitTimeoutId === undefined) {
      return result;
    }

    const time = Date.now();
    cancelTimers();

    if (pendingCall !== undefined) {
      return invokeFunc(time);
    }

    return result;
  };

  /**
   * Check if there are pending invocations
   */
  debounced.pending = (): boolean => {
    return timeoutId !== undefined || maxWaitTimeoutId !== undefined;
  };

  return debounced as DebouncedFunction<T>;
}
