/**
 * Type definitions for useSessionStorage hook
 */

/**
 * Options for configuring sessionStorage behavior.
 *
 * @template T - The type of value being stored
 */
export interface UseStorageOptions<T> {
  /**
   * Custom function to serialize the value before storing.
   * Defaults to JSON.stringify.
   */
  serializer?: (value: T) => string;

  /**
   * Custom function to deserialize the stored value.
   * Defaults to JSON.parse.
   */
  deserializer?: (value: string) => T;

  /**
   * Whether to initialize with the value from storage on mount.
   * Set to false for SSR to avoid hydration mismatches.
   * @default true
   */
  initializeWithValue?: boolean;
}

/**
 * Return type for useSessionStorage hook.
 *
 * @template T - The type of value being stored
 */
export type UseStorageReturn<T> = [
  value: T,
  setValue: (value: T | ((prev: T) => T)) => void,
  remove: () => void,
];
