/**
 * Type definitions for useThrottle hook
 */

/**
 * Options for configuring throttle behavior.
 */
export interface UseThrottleOptions {
  /**
   * Whether to invoke the throttled function on the leading edge.
   * @default true
   */
  leading?: boolean;

  /**
   * Whether to invoke the throttled function on the trailing edge.
   * @default true
   */
  trailing?: boolean;
}

/**
 * Return type for useThrottle hook.
 *
 * @template T - The type of value being throttled
 */
export type UseThrottledValue<T> = T;
