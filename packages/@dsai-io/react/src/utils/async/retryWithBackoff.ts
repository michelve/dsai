/**
 * @file retryWithBackoff - Retry failed promises with exponential backoff
 * @module @dsai/react/utils/async
 *
 * Enterprise-grade retry utility with:
 * - Configurable max attempts
 * - Exponential backoff between retries
 * - Custom retry condition
 * - Abort support
 * - Detailed error tracking
 */

import { exponentialBackoff, type ExponentialBackoffOptions } from './exponentialBackoff';

/**
 * Creates a portable abort error that works in both browser and Node.js environments.
 * Falls back to a standard Error with 'AbortError' name when DOMException is unavailable.
 */
function createAbortError(message: string = 'Retry aborted'): Error {
  // Check if DOMException is available (browser or Node 17+)
  if (typeof DOMException !== 'undefined') {
    return new DOMException(message, 'AbortError');
  }
  // Fallback for older Node.js environments
  const error = new Error(message);
  error.name = 'AbortError';
  return error;
}

/**
 * Options for retry with backoff
 */
export interface RetryWithBackoffOptions extends ExponentialBackoffOptions {
  /**
   * Maximum number of attempts (default: 3).
   * Must be at least 1. Values less than 1 will be clamped to 1.
   */
  maxAttempts?: number;
  /** Custom function to determine if error is retryable (default: all errors) */
  shouldRetry?: (error: unknown, attempt: number) => boolean;
  /** Callback called before each retry attempt */
  onRetry?: (error: unknown, attempt: number, delay: number) => void;
  /** AbortSignal to cancel retries */
  signal?: AbortSignal;
}

/**
 * Result of retry operation
 */
export interface RetryResult<T> {
  /** Whether the operation succeeded */
  success: boolean;
  /** The result value if successful */
  data?: T;
  /** The last error if failed */
  error?: unknown;
  /**
   * Total number of attempts actually made.
   * For success: the attempt number that succeeded (1-indexed).
   * For failure: the number of attempts before giving up or being aborted.
   */
  attempts: number;
  /** Total time spent in milliseconds */
  totalTime: number;
  /**
   * Whether the operation was aborted via AbortSignal.
   * When true, the error will be an AbortError.
   */
  aborted?: boolean;
}

/**
 * Retry a promise-returning function with exponential backoff
 *
 * @param fn - Async function to retry
 * @param options - Retry configuration options
 * @returns Promise resolving to retry result (never rejects)
 *
 * @remarks
 * - The function always returns a structured `RetryResult`, even on abort.
 * - When aborted, `result.aborted` is `true` and `result.error` is an `AbortError`.
 * - The `attempts` field reflects actual attempts made, not the configured maximum.
 * - `maxAttempts` is clamped to at least 1 to prevent misconfiguration.
 *
 * @example
 * ```tsx
 * // Basic usage
 * const result = await retryWithBackoff(
 *   () => fetch('/api/data').then(r => r.json())
 * );
 *
 * if (result.success) {
 *   console.log('Data:', result.data);
 * } else {
 *   console.error('Failed after', result.attempts, 'attempts');
 * }
 *
 * // With custom options
 * const result = await retryWithBackoff(
 *   () => unstableApiCall(),
 *   {
 *     maxAttempts: 5,
 *     baseDelay: 500,
 *     shouldRetry: (error) => error instanceof NetworkError,
 *     onRetry: (error, attempt, delay) => {
 *       console.log(`Retry ${attempt} in ${delay}ms...`);
 *     }
 *   }
 * );
 *
 * // With abort support
 * const controller = new AbortController();
 * const result = await retryWithBackoff(
 *   () => longRunningOperation(),
 *   { signal: controller.signal }
 * );
 *
 * // Cancel after 5 seconds
 * setTimeout(() => controller.abort(), 5000);
 *
 * // Check if aborted
 * if (result.aborted) {
 *   console.log('Operation was cancelled');
 * }
 *
 * // Component usage with cleanup
 * useEffect(() => {
 *   const controller = new AbortController();
 *
 *   retryWithBackoff(
 *     () => fetchData(),
 *     { signal: controller.signal }
 *   ).then(result => {
 *     if (result.success) setData(result.data);
 *   });
 *
 *   return () => controller.abort();
 * }, []);
 * ```
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: RetryWithBackoffOptions = {}
): Promise<RetryResult<T>> {
  const {
    maxAttempts: rawMaxAttempts = 3,
    shouldRetry = () => true,
    onRetry,
    signal,
    ...backoffOptions
  } = options;

  // Clamp maxAttempts to at least 1 to prevent misconfiguration
  const maxAttempts = Math.max(1, rawMaxAttempts);

  const startTime = Date.now();
  let lastError: unknown;
  let attemptsMade = 0;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    // Check for abort before attempt
    if (signal?.aborted) {
      return {
        success: false,
        error: createAbortError(),
        attempts: attemptsMade,
        totalTime: Date.now() - startTime,
        aborted: true,
      };
    }

    attemptsMade++;

    try {
      const data = await fn();
      return {
        success: true,
        data,
        attempts: attemptsMade,
        totalTime: Date.now() - startTime,
      };
    } catch (error) {
      lastError = error;

      // Check if we should retry
      const isLastAttempt = attempt >= maxAttempts - 1;
      if (isLastAttempt || !shouldRetry(error, attempt)) {
        break;
      }

      // Calculate delay and wait
      const delay = exponentialBackoff(attempt, backoffOptions);

      // Notify about retry
      onRetry?.(error, attempt + 1, delay);

      // Wait with abort support - returns structured result on abort instead of rejecting
      const aborted = await waitWithAbort(delay, signal);
      if (aborted) {
        return {
          success: false,
          error: createAbortError(),
          attempts: attemptsMade,
          totalTime: Date.now() - startTime,
          aborted: true,
        };
      }
    }
  }

  return {
    success: false,
    error: lastError,
    attempts: attemptsMade,
    totalTime: Date.now() - startTime,
  };
}

/**
 * Wait for a specified delay with abort support.
 * Returns true if aborted, false if completed normally.
 */
async function waitWithAbort(delayMs: number, signal?: AbortSignal): Promise<boolean> {
  return new Promise<boolean>((resolve) => {
    // If already aborted, resolve immediately
    if (signal?.aborted) {
      resolve(true);
      return;
    }

    const timeoutId = setTimeout(() => {
      if (signal) {
        signal.removeEventListener('abort', abortHandler);
      }
      resolve(false);
    }, delayMs);

    const abortHandler = (): void => {
      clearTimeout(timeoutId);
      resolve(true);
    };

    if (signal) {
      signal.addEventListener('abort', abortHandler, { once: true });
    }
  });
}
