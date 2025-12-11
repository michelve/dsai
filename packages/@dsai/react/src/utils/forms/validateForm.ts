import { validateField } from './validateField';

import type { FormValidationResult, ValidationRule } from './types';

/**
 * Schema for form validation.
 */
export type ValidationSchema<T extends Record<string, unknown>> = {
  [K in keyof T]?: ValidationRule<T[K]>[];
};

/**
 * Validates an entire form against a validation schema.
 *
 * Runs all field validators and collects errors.
 * Supports nested objects and async validators.
 *
 * **Key Features**:
 * - Schema-based validation
 * - Async validation support
 * - Nested object validation
 * - Collects all errors (not short-circuit)
 * - Type-safe schema
 *
 * @param data - Form data to validate
 * @param schema - Validation schema mapping field names to rules
 * @returns Validation result with all field errors
 *
 * @example
 * ```tsx
 * interface LoginForm {
 *   email: string;
 *   password: string;
 * }
 *
 * const schema: ValidationSchema<LoginForm> = {
 *   email: [
 *     { validate: (v) => v.length > 0, message: 'Email required' },
 *     { validate: (v) => v.includes('@'), message: 'Email invalid' }
 *   ],
 *   password: [
 *     { validate: (v) => v.length >= 8, message: 'Password must be 8+ chars' }
 *   ]
 * };
 *
 * const result = await validateForm(
 *   { email: 'john@example.com', password: 'short' },
 *   schema
 * );
 * // {
 * //   valid: false,
 * //   errors: { password: 'Password must be 8+ chars' }
 * // }
 * ```
 *
 * @example
 * ```tsx
 * // All fields valid
 * const result = await validateForm(
 *   { email: 'john@example.com', password: 'secure123' },
 *   schema
 * );
 * // { valid: true, errors: {} }
 * ```
 */
export async function validateForm<T extends Record<string, unknown>>(
  data: T,
  schema: ValidationSchema<T>
): Promise<FormValidationResult> {
  const errors: Record<string, string> = {};

  // Validate all fields in parallel
  const validations = Object.entries(schema).map(async ([field, rules]) => {
    if (!rules) {
      return;
    }

    // eslint-disable-next-line security/detect-object-injection
    const value = data[field];
    const result = await validateField(value, rules);

    if (!result.valid && result.error) {
      // eslint-disable-next-line security/detect-object-injection
      errors[field] = result.error;
    }
  });

  await Promise.all(validations);

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
