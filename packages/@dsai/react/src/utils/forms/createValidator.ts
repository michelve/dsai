import { validateField } from './validateField';

import type { FieldValidationResult, ValidationRule, Validator } from './types';

/**
 * Creates a reusable validator function from validation rules.
 *
 * This is useful for creating named validators that can be reused
 * across multiple forms or fields.
 *
 * **Key Features**:
 * - Reusable validator functions
 * - Type-safe
 * - Async support
 * - Composable validators
 *
 * @param rules - Array of validation rules
 * @returns Validator function
 *
 * @example
 * ```tsx
 * // Create reusable email validator
 * const validateEmail = createValidator<string>([
 *   {
 *     validate: (v) => v.length > 0,
 *     message: 'Email is required'
 *   },
 *   {
 *     validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
 *     message: 'Email is invalid'
 *   }
 * ]);
 *
 * // Use in multiple places
 * const result1 = await validateEmail('john@example.com');
 * const result2 = await validateEmail('invalid');
 * ```
 *
 * @example
 * ```tsx
 * // Create password validator
 * const validatePassword = createValidator<string>([
 *   {
 *     validate: (v) => v.length >= 8,
 *     message: 'Password must be at least 8 characters'
 *   },
 *   {
 *     validate: (v) => /[A-Z]/.test(v),
 *     message: 'Password must contain uppercase letter'
 *   },
 *   {
 *     validate: (v) => /[0-9]/.test(v),
 *     message: 'Password must contain number'
 *   }
 * ]);
 *
 * const result = await validatePassword('Secure123');
 * // { valid: true }
 * ```
 */
export function createValidator<T = unknown>(rules: ValidationRule<T>[]): Validator<T> {
  return async (value: T): Promise<FieldValidationResult> => {
    return validateField(value, rules);
  };
}
