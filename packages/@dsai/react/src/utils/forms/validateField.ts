import type { FieldValidationResult, ValidationRule } from './types';

/**
 * Validates a single form field against validation rules.
 *
 * Runs all validation rules and returns the first error encountered.
 * Supports both synchronous and asynchronous validators.
 *
 * **Key Features**:
 * - Multiple validation rules per field
 * - Async validation support
 * - Short-circuit on first error
 * - Type-safe validators
 *
 * @param value - Field value to validate
 * @param rules - Array of validation rules
 * @returns Validation result with error message if invalid
 *
 * @example
 * ```tsx
 * const emailRules: ValidationRule<string>[] = [
 *   {
 *     validate: (v) => v.length > 0,
 *     message: 'Email is required'
 *   },
 *   {
 *     validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
 *     message: 'Email is invalid'
 *   }
 * ];
 *
 * const result = await validateField('john@example.com', emailRules);
 * // { valid: true }
 *
 * const result2 = await validateField('invalid', emailRules);
 * // { valid: false, error: 'Email is invalid' }
 * ```
 *
 * @example
 * ```tsx
 * // With async validation
 * const usernameRules: ValidationRule<string>[] = [
 *   {
 *     validate: (v) => v.length >= 3,
 *     message: 'Username must be at least 3 characters'
 *   },
 *   {
 *     validate: async (v) => {
 *       const available = await checkUsernameAvailable(v);
 *       return available;
 *     },
 *     message: 'Username is already taken'
 *   }
 * ];
 *
 * const result = await validateField('john', usernameRules);
 * ```
 */
export async function validateField<T = unknown>(
  value: T,
  rules: ValidationRule<T>[]
): Promise<FieldValidationResult> {
  for (const rule of rules) {
    const isValid = await rule.validate(value);
    if (!isValid) {
      return {
        valid: false,
        error: rule.message,
      };
    }
  }

  return { valid: true };
}
