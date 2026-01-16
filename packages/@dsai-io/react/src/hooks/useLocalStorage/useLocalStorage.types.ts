/**
 * Options for storage hooks (localStorage/sessionStorage)
 */
export interface UseStorageOptions<T> {
  /**
   * Custom serializer function to convert value to string.
   * Defaults to JSON.stringify.
   */
  serializer?: (value: T) => string;

  /**
   * Custom deserializer function to convert string back to value.
   * Defaults to JSON.parse.
   */
  deserializer?: (value: string) => T;

  /**
   * Whether to initialize the hook with the stored value immediately.
   * If false, returns defaultValue until first render completes (useful for SSR).
   * @default true
   */
  initializeWithValue?: boolean;
}

/**
 * Return type for storage hooks
 */
export type UseStorageReturn<T> = [
  value: T,
  setValue: (value: T | ((prev: T) => T)) => void,
  remove: () => void,
];
