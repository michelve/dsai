import type { ValidationRule } from '../../utils/forms/types';

/**
 * Form field state.
 */
export interface FieldState<T = unknown> {
  /** Current field value */
  value: T;
  /** Whether the field has been touched (blurred) */
  touched: boolean;
  /** Current validation error message */
  error?: string;
  /** Whether the field is currently being validated */
  validating: boolean;
}

/**
 * Form state.
 */
export interface FormState<T extends Record<string, unknown>> {
  /** Current form values */
  values: T;
  /** Map of field names to their state */
  fields: {
    [K in keyof T]: FieldState<T[K]>;
  };
  /** Whether the form is currently submitting */
  submitting: boolean;
  /** Whether the form has been submitted at least once */
  submitted: boolean;
  /** Whether the form is valid */
  valid: boolean;
  /** Whether the form has been modified */
  dirty: boolean;
}

/**
 * Form field handlers.
 */
export interface FieldHandlers<T = unknown> {
  /** Handle field value change */
  onChange: (value: T) => void;
  /** Handle field blur (touch) */
  onBlur: () => void;
}

/**
 * Form actions.
 */
export interface FormActions<T extends Record<string, unknown>> {
  /** Set a field value */
  setFieldValue: <K extends keyof T>(name: K, value: T[K]) => void;
  /** Set a field error */
  setFieldError: <K extends keyof T>(name: K, error?: string) => void;
  /** Mark a field as touched */
  setFieldTouched: <K extends keyof T>(name: K, touched?: boolean) => void;
  /** Validate a specific field */
  validateField: <K extends keyof T>(name: K) => Promise<boolean>;
  /** Validate the entire form */
  validateForm: () => Promise<boolean>;
  /** Reset the form to initial values */
  resetForm: () => void;
  /** Submit the form */
  submitForm: () => Promise<void>;
  /** Get field handlers for a specific field */
  getFieldHandlers: <K extends keyof T>(name: K) => FieldHandlers<T[K]>;
}

/**
 * Validation schema for a form.
 */
export type FormValidationSchema<T extends Record<string, unknown>> = {
  [K in keyof T]?: ValidationRule<T[K]>[];
};

/**
 * Options for useForm hook.
 */
export interface UseFormOptions<T extends Record<string, unknown>> {
  /** Initial form values */
  initialValues: T;
  /** Validation schema */
  validationSchema?: FormValidationSchema<T>;
  /** Whether to validate on change (default: true) */
  validateOnChange?: boolean;
  /** Whether to validate on blur (default: true) */
  validateOnBlur?: boolean;
  /** Submit handler */
  onSubmit?: (values: T) => void | Promise<void>;
}

/**
 * Return type of useForm hook.
 */
export interface UseFormReturn<T extends Record<string, unknown>> {
  /** Current form state */
  state: FormState<T>;
  /** Form actions */
  actions: FormActions<T>;
  /** Helper to get field props */
  getFieldProps: <K extends keyof T>(
    name: K
  ) => {
    value: T[K];
    onChange: (value: T[K]) => void;
    onBlur: () => void;
    error: string | undefined;
    touched: boolean;
  };
}
