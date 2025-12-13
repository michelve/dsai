/**
 * Options for useControllableState hook
 */
export interface UseControllableStateOptions<T> {
  /**
   * Controlled value from parent component.
   * When provided, the component operates in controlled mode.
   */
  value?: T;

  /**
   * Default value for uncontrolled mode.
   * Only used when `value` is undefined.
   */
  defaultValue?: T;

  /**
   * Callback invoked when the value changes.
   * Called in both controlled and uncontrolled modes.
   */
  onChange?: (value: T, event?: unknown) => void;
}

/**
 * Return type for useControllableState hook
 */
export type UseControllableStateReturn<T> = [
  value: T,
  setValue: (value: T | ((prev: T) => T), event?: unknown) => void,
];
