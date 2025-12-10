/**
 * Validation rule for a form field.
 */
export interface ValidationRule<T = unknown> {
  /** Validation function that returns true if valid */
  validate: (value: T) => boolean | Promise<boolean>;
  /** Error message to display when validation fails */
  message: string;
}

/**
 * Validation result for a field.
 */
export interface FieldValidationResult {
  /** Whether the field is valid */
  valid: boolean;
  /** Error message if invalid */
  error?: string;
}

/**
 * Validation result for an entire form.
 */
export interface FormValidationResult {
  /** Whether the form is valid */
  valid: boolean;
  /** Map of field names to error messages */
  errors: Record<string, string>;
}

/**
 * Validator function type.
 */
export type Validator<T = unknown> = (
  value: T
) => FieldValidationResult | Promise<FieldValidationResult>;

/**
 * Form field value type.
 */
export type FormFieldValue = string | number | boolean | File | null | undefined;

/**
 * Form data type (nested objects and arrays supported).
 */
export type FormData = Record<string, FormFieldValue | FormFieldValue[] | FormData>;
