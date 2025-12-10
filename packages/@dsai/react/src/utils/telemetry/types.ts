/**
 * Telemetry type definitions
 *
 * Structured types for better type safety and PII protection.
 *
 * @module utils/telemetry/types
 */

/**
 * Structured telemetry context
 *
 * Separates string tags (safe for indexing) from arbitrary data (may contain PII).
 * This helps prevent accidental PII leaks in telemetry systems.
 *
 * @example
 * ```ts
 * const context: TelemetryContext = {
 *   tags: {
 *     environment: 'production',
 *     version: '1.2.3',
 *     userId: 'user-123'
 *   },
 *   data: {
 *     requestBody: { ... }, // Complex data
 *     responseTime: 123
 *   }
 * };
 * ```
 */
export interface TelemetryContext {
  /**
   * String key-value pairs for filtering/grouping
   *
   * Tags are typically indexed in telemetry systems.
   * Should only contain non-PII strings.
   *
   * Examples: environment, version, feature flags, user segments
   */
  readonly tags?: Record<string, string>;

  /**
   * Arbitrary data for context
   *
   * Can contain complex objects, numbers, booleans.
   * Should be redacted for sensitive information.
   *
   * Examples: request/response bodies, computed metrics, debug info
   */
  readonly data?: Record<string, unknown>;
}

/**
 * Flexible context type (backward compatible)
 *
 * Accepts either structured TelemetryContext or loose Record.
 * Use TelemetryContext for better type safety and PII protection.
 */
export type FlexibleContext = TelemetryContext | Record<string, unknown>;

/**
 * Type guard for structured TelemetryContext
 *
 * @param context - Context to check
 * @returns True if context has tags/data structure
 *
 * @example
 * ```ts
 * if (isTelemetryContext(context)) {
 *   console.log('Structured context with tags:', context.tags);
 * } else {
 *   console.log('Loose context:', context);
 * }
 * ```
 */
export function isTelemetryContext(context: FlexibleContext): context is TelemetryContext {
  return (
    typeof context === 'object' &&
    context !== null &&
    ('tags' in context || 'data' in context) &&
    !('length' in context) && // Not an array
    Object.keys(context).every((key) => key === 'tags' || key === 'data')
  );
}

/**
 * Normalize flexible context to structured format
 *
 * @param context - Flexible context (structured or loose)
 * @returns Normalized TelemetryContext
 *
 * @example
 * ```ts
 * // Loose context becomes data
 * const normalized = normalizeTelemetryContext({ foo: 'bar', count: 123 });
 * // { tags: {}, data: { foo: 'bar', count: 123 } }
 *
 * // Structured context passes through
 * const normalized = normalizeTelemetryContext({
 *   tags: { env: 'prod' },
 *   data: { count: 123 }
 * });
 * // { tags: { env: 'prod' }, data: { count: 123 } }
 * ```
 */
export function normalizeTelemetryContext(context?: FlexibleContext): TelemetryContext {
  if (!context) {
    return { tags: {}, data: {} };
  }

  if (isTelemetryContext(context)) {
    return {
      tags: context.tags ?? {},
      data: context.data ?? {},
    };
  }

  // Loose context becomes data
  return {
    tags: {},
    data: context,
  };
}
