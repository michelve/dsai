/**
 * Wrap a function with telemetry hooks
 *
 * Automatically measures execution time and captures errors.
 * Preserves function signature and return type.
 *
 * @module utils/telemetry
 */

import type { PerformanceMeasurement } from './measurePerformance';

/**
 * Telemetry hooks for wrapped functions
 */
export interface TelemetryHooks {
  /**
   * Called before function execution
   * @param name - Function name
   * @param args - Function arguments
   */
  readonly onStart?: (name: string, args: unknown[]) => void;

  /**
   * Called after successful execution
   * @param measurement - Performance measurement
   */
  readonly onSuccess?: (measurement: PerformanceMeasurement) => void;

  /**
   * Called when function throws error
   * @param error - Error thrown
   * @param duration - Time before error (milliseconds)
   */
  readonly onError?: (error: Error, duration: number) => void;

  /**
   * Called after execution (success or error)
   * @param duration - Total execution time
   */
  readonly onComplete?: (duration: number) => void;
}

/**
 * Options for wrapping function with telemetry
 */
export interface WrapTelemetryOptions extends TelemetryHooks {
  /**
   * Function name for identification
   * @default fn.name || 'anonymous'
   */
  readonly name?: string;

  /**
   * Whether to re-throw errors after capturing
   * @default true
   */
  readonly rethrow?: boolean;
}

/**
 * Get current timestamp (milliseconds)
 * @internal
 */
function now(): number {
  return typeof performance !== 'undefined' && performance.now ? performance.now() : Date.now();
}

/**
 * Wrap a synchronous function with telemetry
 *
 * @example
 * ```ts
 * const processData = wrapWithTelemetry(
 *   (data: string[]) => data.map(x => x.toUpperCase()),
 *   {
 *     name: 'processData',
 *     onSuccess: ({ duration }) => console.log(`Took ${duration}ms`),
 *     onError: (error) => console.error('Failed:', error.message)
 *   }
 * );
 *
 * const result = processData(['hello', 'world']);
 * ```
 *
 * @example With analytics integration
 * ```ts
 * const fetchUser = wrapWithTelemetry(
 *   getUserById,
 *   {
 *     name: 'fetchUser',
 *     onSuccess: ({ duration, result }) => {
 *       analytics.track('function_success', {
 *         function: 'fetchUser',
 *         duration,
 *         userId: result.id
 *       });
 *     }
 *   }
 * );
 * ```
 *
 * @param fn - Function to wrap
 * @param options - Telemetry options
 * @returns Wrapped function with same signature
 */
export function wrapWithTelemetry<TArgs extends unknown[], TReturn>(
  fn: (...args: TArgs) => TReturn,
  options: WrapTelemetryOptions = {}
): (...args: TArgs) => TReturn {
  const {
    name = fn.name || 'anonymous',
    onStart,
    onSuccess,
    onError,
    onComplete,
    rethrow = true,
  } = options;

  return function wrappedFunction(...args: TArgs): TReturn {
    const startTime = now();

    // Invoke onStart hook
    if (onStart) {
      try {
        onStart(name, args);
      } catch {
        // Never throw from telemetry hooks
      }
    }

    try {
      const result = fn(...args);
      const endTime = now();
      const duration = endTime - startTime;

      // Invoke onSuccess hook
      if (onSuccess) {
        try {
          onSuccess({
            duration,
            result,
            name,
            startTime,
            endTime,
          });
        } catch {
          // Never throw from hooks
        }
      }

      // Invoke onComplete hook
      if (onComplete) {
        try {
          onComplete(duration);
        } catch {
          // Never throw
        }
      }

      return result;
    } catch (error) {
      const endTime = now();
      const duration = endTime - startTime;

      // Invoke onError hook
      if (onError && error instanceof Error) {
        try {
          onError(error, duration);
        } catch {
          // Never throw from hooks
        }
      }

      // Invoke onComplete hook
      if (onComplete) {
        try {
          onComplete(duration);
        } catch {
          // Never throw
        }
      }

      // Re-throw error if configured
      if (rethrow) {
        throw error;
      }

      // Return undefined if not rethrowing (type system can't express this)
      return undefined as TReturn;
    }
  };
}

/**
 * Wrap an async function with telemetry
 *
 * @example
 * ```ts
 * const fetchData = wrapWithTelemetryAsync(
 *   async (url: string) => {
 *     const res = await fetch(url);
 *     return res.json();
 *   },
 *   {
 *     name: 'api-call',
 *     onSuccess: ({ duration }) => console.log(`API took ${duration}ms`),
 *     onError: (error) => logger.error('API failed', error)
 *   }
 * );
 *
 * const data = await fetchData('/api/users');
 * ```
 *
 * @param fn - Async function to wrap
 * @param options - Telemetry options
 * @returns Wrapped async function with same signature
 */
export function wrapWithTelemetryAsync<TArgs extends unknown[], TReturn>(
  fn: (...args: TArgs) => Promise<TReturn>,
  options: WrapTelemetryOptions = {}
): (...args: TArgs) => Promise<TReturn> {
  const {
    name = fn.name || 'anonymous',
    onStart,
    onSuccess,
    onError,
    onComplete,
    rethrow = true,
  } = options;

  return async function wrappedAsyncFunction(...args: TArgs): Promise<TReturn> {
    const startTime = now();

    if (onStart) {
      try {
        onStart(name, args);
      } catch {
        // Never throw
      }
    }

    try {
      const result = await fn(...args);
      const endTime = now();
      const duration = endTime - startTime;

      if (onSuccess) {
        try {
          onSuccess({
            duration,
            result,
            name,
            startTime,
            endTime,
          });
        } catch {
          // Never throw
        }
      }

      if (onComplete) {
        try {
          onComplete(duration);
        } catch {
          // Never throw
        }
      }

      return result;
    } catch (error) {
      const endTime = now();
      const duration = endTime - startTime;

      if (onError && error instanceof Error) {
        try {
          onError(error, duration);
        } catch {
          // Never throw
        }
      }

      if (onComplete) {
        try {
          onComplete(duration);
        } catch {
          // Never throw
        }
      }

      if (rethrow) {
        throw error;
      }

      return undefined as TReturn;
    }
  };
}
