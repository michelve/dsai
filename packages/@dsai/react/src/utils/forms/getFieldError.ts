import type { FormValidationResult } from './types';

/**
 * Extracts the error message for a specific field from form validation result.
 *
 * Helper function for getting field errors from form validation results.
 * Returns undefined if no error exists for the field.
 *
 * **Key Features**:
 * - Type-safe field access
 * - Undefined if no error
 * - Simple API
 *
 * @param result - Form validation result
 * @param fieldName - Name of the field
 * @returns Error message or undefined
 *
 * @example
 * ```tsx
 * const result = await validateForm(data, schema);
 * // { valid: false, errors: { email: 'Email is required', password: 'Password too short' } }
 *
 * const emailError = getFieldError(result, 'email');
 * // 'Email is required'
 *
 * const nameError = getFieldError(result, 'name');
 * // undefined
 * ```
 *
 * @example
 * ```tsx
 * // In a React component
 * function LoginForm() {
 *   const [errors, setErrors] = useState<FormValidationResult | null>(null);
 *
 *   const handleSubmit = async (data: LoginFormData) => {
 *     const result = await validateForm(data, schema);
 *     if (!result.valid) {
 *       setErrors(result);
 *       return;
 *     }
 *     // Submit form...
 *   };
 *
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       <input name="email" />
 *       {errors && <span>{getFieldError(errors, 'email')}</span>}
 *     </form>
 *   );
 * }
 * ```
 */
export function getFieldError(result: FormValidationResult, fieldName: string): string | undefined {
  // eslint-disable-next-line security/detect-object-injection
  return result.errors[fieldName];
}
