import type { ValidationRule } from '../../utils/forms/types';

/**
 * Options for useField hook.
 */
export interface UseFieldOptions<T = unknown> {
  /** Field name (for debugging/tracking) */
  name?: string;
  /** Initial field value */
  initialValue?: T;
  /** Validation rules for the field */
  validationRules?: ValidationRule<T>[];
  /** Whether to validate on change (default: true) */
  validateOnChange?: boolean;
  /** Whether to validate on blur (default: true) */
  validateOnBlur?: boolean;
  /** Callback when field value changes */
  onChange?: (value: T) => void;
  /** Callback when field is blurred */
  onBlur?: () => void;
}

/**
 * Field state returned by useField.
 */
export interface UseFieldState<T = unknown> {
  /** Current field value */
  value: T;
  /** Whether the field has been touched (blurred) */
  touched: boolean;
  /** Current validation error message */
  error?: string;
  /** Whether the field is currently being validated */
  validating: boolean;
  /** Whether the field has been modified from initial value */
  dirty: boolean;
}

/**
 * Field actions returned by useField.
 */
export interface UseFieldActions<T = unknown> {
  /** Set the field value */
  setValue: (value: T | ((prev: T) => T)) => void;
  /** Set the field error */
  setError: (error?: string) => void;
  /** Mark the field as touched */
  setTouched: (touched?: boolean) => void;
  /** Validate the field */
  validate: () => Promise<boolean>;
  /** Reset the field to initial value */
  reset: () => void;
  /** Handle input change (calls setValue and validates if configured) */
  handleChange: (value: T) => void;
  /** Handle input blur (marks as touched and validates if configured) */
  handleBlur: () => void;
}

/**
 * Return type of useField hook.
 */
export interface UseFieldReturn<T = unknown> {
  /** Field state */
  state: UseFieldState<T>;
  /** Field actions */
  actions: UseFieldActions<T>;
  /** Helper to get input props */
  getInputProps: () => {
    value: T;
    onChange: (value: T) => void;
    onBlur: () => void;
  };
}
