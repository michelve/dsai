/**
 * Type definitions for useDebounce hook
 */

/**
 * Options for configuring debounce behavior.
 *
 * @template T - The type of value being debounced
 */
export interface UseDebounceOptions {
  /**
   * Whether to invoke the debounced function on the leading edge.
   * @default false
   */
  leading?: boolean;

  /**
   * Whether to invoke the debounced function on the trailing edge.
   * @default true
   */
  trailing?: boolean;

  /**
   * The maximum time the function is allowed to be delayed before it's invoked.
   * Useful for ensuring the function is called at least once within a time window.
   * @default undefined
   */
  maxWait?: number;
}

/**
 * Return type for useDebounce hook.
 *
 * @template T - The type of value being debounced
 */
export type UseDebouncedValue<T> = T;
