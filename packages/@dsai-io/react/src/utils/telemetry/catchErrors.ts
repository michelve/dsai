/**
 * Error boundary-friendly error catcher
 *
 * Wraps functions to catch and handle errors gracefully.
 * Useful for preventing component crashes and logging errors.
 *
 * @module utils/telemetry
 */

import { getMergedRedactKeys, getTelemetryClient } from './config';

/**
 * Error handler callback
 */
export type ErrorHandler = (error: Error, context?: Record<string, unknown>) => void;

/**
 * Options for error catching
 */
export interface CatchErrorsOptions {
  /**
   * Error handler callback
   * Called when wrapped function throws
   */
  readonly onError?: ErrorHandler;

  /**
   * Fallback value to return when error occurs
   * @default undefined
   */
  readonly fallback?: unknown;

  /**
   * Whether to re-throw error after handling
   * @default false (errors are swallowed)
   */
  readonly rethrow?: boolean;

  /**
   * Function name for error context
   * @default fn.name || 'anonymous'
   */
  readonly name?: string;

  /**
   * Additional context to include in error handler
   */
  readonly context?: Record<string, unknown>;

  /**
   * Sensitive keys to redact from context
   *
   * Merged with global defaultRedactKeys unless
   * allowAdditionalRedactKeys is false.
   *
   * @default [] (uses only global defaultRedactKeys)
   */
  readonly redactKeys?: string[];
}

/**
 * Redact sensitive values from context
 *
 * @param context - Context object to redact
 * @param redactKeys - Keys to redact
 * @returns Redacted context
 * @internal
 */
function redactContext(
  context: Record<string, unknown>,
  redactKeys: string[]
): Record<string, unknown> {
  const redacted: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(context)) {
    const lowerKey = key.toLowerCase();
    const shouldRedact = redactKeys.some((redactKey) => lowerKey.includes(redactKey.toLowerCase()));

    // Use Object.assign to avoid Generic Object Injection Sink warning
    Object.assign(redacted, { [key]: shouldRedact ? '[REDACTED]' : value });
  }

  return redacted;
}

/**
 * Wrap a synchronous function with error catching
 *
 * @example
 * ```ts
 * const safeParseJSON = catchErrors(
 *   (json: string) => JSON.parse(json),
 *   {
 *     fallback: null,
 *     onError: (error) => console.error('Parse failed:', error.message)
 *   }
 * );
 *
 * const data = safeParseJSON('invalid json'); // Returns null, doesn't throw
 * ```
 *
 * @example With sensitive data redaction
 * ```ts
 * const processUser = catchErrors(
 *   (user: User) => validateUser(user),
 *   {
 *     name: 'processUser',
 *     context: { userId: user.id, email: user.email },
 *     redactKeys: ['email', 'password'],
 *     onError: (error, context) => {
 *       // context.email is redacted
 *       logger.error('User validation failed', { error, ...context });
 *     }
 *   }
 * );
 * ```
 *
 * @param fn - Function to wrap
 * @param options - Error catching options
 * @returns Wrapped function that catches errors
 */
export function catchErrors<TArgs extends unknown[], TReturn>(
  fn: (...args: TArgs) => TReturn,
  options: CatchErrorsOptions = {}
): (...args: TArgs) => TReturn | undefined {
  const {
    onError,
    fallback,
    rethrow = false,
    name = fn.name || 'anonymous',
    context = {},
    redactKeys = [],
  } = options;

  return function wrappedFunction(...args: TArgs): TReturn | undefined {
    try {
      return fn(...args);
    } catch (error) {
      // Ensure error is Error instance
      const err = error instanceof Error ? error : new Error(String(error));

      // Merge global and per-call redact keys
      const mergedRedactKeys = getMergedRedactKeys(redactKeys);

      // Redact sensitive context
      const safeContext = redactContext({ ...context, function: name }, mergedRedactKeys);

      // Invoke error handler
      if (onError) {
        try {
          onError(err, safeContext);
        } catch {
          // Never throw from error handler
        }
      }

      // Send to global telemetry client if configured
      const client = getTelemetryClient();
      if (client) {
        try {
          client.trackError(err, safeContext);
        } catch {
          // Never throw from telemetry client
        }
      }

      // Re-throw if configured
      if (rethrow) {
        throw err;
      }

      // Return fallback value
      return fallback as TReturn | undefined;
    }
  };
}

/**
 * Wrap an async function with error catching
 *
 * @example
 * ```ts
 * const safeFetch = catchErrorsAsync(
 *   async (url: string) => {
 *     const res = await fetch(url);
 *     return res.json();
 *   },
 *   {
 *     fallback: { error: 'Failed to fetch' },
 *     onError: (error) => console.error('Fetch failed:', error)
 *   }
 * );
 *
 * const data = await safeFetch('/api/data');
 * // Returns fallback if fetch fails
 * ```
 *
 * @example With React error boundary
 * ```ts
 * const fetchUserData = catchErrorsAsync(
 *   loadUserData,
 *   {
 *     name: 'fetchUserData',
 *     onError: (error, context) => {
 *       // Log to external service
 *       errorTracking.captureException(error, context);
 *     },
 *     rethrow: true // Re-throw to trigger error boundary
 *   }
 * );
 * ```
 *
 * @param fn - Async function to wrap
 * @param options - Error catching options
 * @returns Wrapped async function that catches errors
 */
export function catchErrorsAsync<TArgs extends unknown[], TReturn>(
  fn: (...args: TArgs) => Promise<TReturn>,
  options: CatchErrorsOptions = {}
): (...args: TArgs) => Promise<TReturn | undefined> {
  const {
    onError,
    fallback,
    rethrow = false,
    name = fn.name || 'anonymous',
    context = {},
    redactKeys = [],
  } = options;

  return async function wrappedAsyncFunction(...args: TArgs): Promise<TReturn | undefined> {
    try {
      return await fn(...args);
    } catch (error) {
      // Ensure error is Error instance
      const err = error instanceof Error ? error : new Error(String(error));

      // Merge global and per-call redact keys
      const mergedRedactKeys = getMergedRedactKeys(redactKeys);

      // Redact sensitive context
      const safeContext = redactContext({ ...context, function: name }, mergedRedactKeys);

      // Invoke error handler
      if (onError) {
        try {
          onError(err, safeContext);
        } catch {
          // Never throw from error handler
        }
      }

      // Send to global telemetry client if configured
      const client = getTelemetryClient();
      if (client) {
        try {
          client.trackError(err, safeContext);
        } catch {
          // Never throw from telemetry client
        }
      }

      // Re-throw if configured
      if (rethrow) {
        throw err;
      }

      // Return fallback value
      return fallback as TReturn | undefined;
    }
  };
}
