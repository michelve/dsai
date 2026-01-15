/**
 * @file withTimeout - Add timeout to promise
 * @module @dsai-io/react/utils/async
 *
 * Enterprise-grade timeout wrapper with:
 * - Configurable timeout duration
 * - Custom error message
 * - AbortController integration
 * - Cleanup on timeout
 */

/**
 * Options for timeout wrapper
 */
export interface WithTimeoutOptions {
  /** Custom error message for timeout */
  message?: string;
  /** AbortController to signal cancellation to the wrapped promise */
  controller?: AbortController;
}

/**
 * Error thrown when a promise times out
 */
export class TimeoutError extends Error {
  override readonly name = 'TimeoutError';
  readonly timeout: number;

  constructor(message: string, timeout: number) {
    super(message);
    this.timeout = timeout;
    // Maintains proper prototype chain for instanceof checks
    Object.setPrototypeOf(this, TimeoutError.prototype);
  }
}

/**
 * Wrap a promise with a timeout
 *
 * If the promise doesn't resolve within the specified time,
 * it rejects with a TimeoutError.
 *
 * @param promise - Promise to wrap
 * @param timeoutMs - Timeout in milliseconds
 * @param options - Timeout options
 * @returns Promise that rejects if timeout is exceeded
 *
 * @example
 * ```tsx
 * // Basic usage
 * try {
 *   const data = await withTimeout(
 *     fetch('/api/data'),
 *     5000
 *   );
 * } catch (error) {
 *   if (error instanceof TimeoutError) {
 *     console.log('Request timed out after', error.timeout, 'ms');
 *   }
 * }
 *
 * // With custom message
 * const result = await withTimeout(
 *   slowOperation(),
 *   10000,
 *   { message: 'Operation took too long' }
 * );
 *
 * // With AbortController for cleanup
 * const controller = new AbortController();
 * try {
 *   const data = await withTimeout(
 *     fetch('/api/data', { signal: controller.signal }),
 *     5000,
 *     { controller }
 *   );
 * } catch (error) {
 *   // Controller is automatically aborted on timeout
 *   console.log('Aborted:', controller.signal.aborted);
 * }
 *
 * // In React component
 * useEffect(() => {
 *   const controller = new AbortController();
 *
 *   withTimeout(
 *     fetchData({ signal: controller.signal }),
 *     5000,
 *     { controller }
 *   )
 *     .then(setData)
 *     .catch(error => {
 *       if (error.name !== 'AbortError') {
 *         setError(error);
 *       }
 *     });
 *
 *   return () => controller.abort();
 * }, []);
 * ```
 */
export async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  options: WithTimeoutOptions = {}
): Promise<T> {
  const { message, controller } = options;

  if (timeoutMs <= 0) {
    console.warn('[withTimeout] Timeout must be > 0, using 1000ms');
    timeoutMs = 1000;
  }

  return new Promise<T>((resolve, reject) => {
    let settled = false;

    const timeoutId = setTimeout(() => {
      if (!settled) {
        settled = true;

        // Abort the controller if provided
        controller?.abort();

        const errorMessage = message ?? `Operation timed out after ${timeoutMs}ms`;
        reject(new TimeoutError(errorMessage, timeoutMs));
      }
    }, timeoutMs);

    promise
      .then((value) => {
        if (!settled) {
          settled = true;
          clearTimeout(timeoutId);
          resolve(value);
        }
      })
      .catch((error) => {
        if (!settled) {
          settled = true;
          clearTimeout(timeoutId);
          reject(error);
        }
      });
  });
}
