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
 * Options for retry with backoff
 */
export interface RetryWithBackoffOptions extends ExponentialBackoffOptions {
  /** Maximum number of attempts (default: 3) */
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
  /** Total number of attempts made */
  attempts: number;
  /** Total time spent in milliseconds */
  totalTime: number;
}

/**
 * Retry a promise-returning function with exponential backoff
 *
 * @param fn - Async function to retry
 * @param options - Retry configuration options
 * @returns Promise resolving to retry result
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
  const { maxAttempts = 3, shouldRetry = () => true, onRetry, signal, ...backoffOptions } = options;

  const startTime = Date.now();
  let lastError: unknown;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    // Check for abort
    if (signal?.aborted) {
      return {
        success: false,
        error: new DOMException('Retry aborted', 'AbortError'),
        attempts: attempt,
        totalTime: Date.now() - startTime,
      };
    }

    try {
      const data = await fn();
      return {
        success: true,
        data,
        attempts: attempt + 1,
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

      // Wait with abort support
      await new Promise<void>((resolve, reject) => {
        const timeoutId = setTimeout(resolve, delay);

        if (signal) {
          const abortHandler = (): void => {
            clearTimeout(timeoutId);
            reject(new DOMException('Retry aborted', 'AbortError'));
          };

          signal.addEventListener('abort', abortHandler, { once: true });

          // Clean up abort listener after timeout
          setTimeout(() => {
            signal.removeEventListener('abort', abortHandler);
          }, delay);
        }
      });
    }
  }

  return {
    success: false,
    error: lastError,
    attempts: maxAttempts,
    totalTime: Date.now() - startTime,
  };
}
