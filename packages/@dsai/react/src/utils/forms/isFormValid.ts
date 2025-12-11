import type { FormValidationResult } from './types';

/**
 * Checks if a form validation result indicates a valid form.
 *
 * Simple helper to check if form has no validation errors.
 * Useful for enabling/disabling submit buttons.
 *
 * **Key Features**:
 * - Simple boolean check
 * - Type-safe
 * - Convenient API
 *
 * @param result - Form validation result
 * @returns True if form is valid (no errors)
 *
 * @example
 * ```tsx
 * const result = await validateForm(data, schema);
 *
 * if (isFormValid(result)) {
 *   // Submit form
 *   await submitForm(data);
 * } else {
 *   // Show errors
 *   setErrors(result.errors);
 * }
 * ```
 *
 * @example
 * ```tsx
 * // In a React component
 * function LoginForm() {
 *   const [validationResult, setValidationResult] = useState<FormValidationResult | null>(null);
 *
 *   const handleSubmit = async (data: LoginFormData) => {
 *     const result = await validateForm(data, schema);
 *     setValidationResult(result);
 *
 *     if (isFormValid(result)) {
 *       await api.login(data);
 *     }
 *   };
 *
 *   return (
 *     // Form with submit button disabled based on validation
 *     // Button is disabled if validation failed
 *   );
 * }
 * ```
 */
export function isFormValid(result: FormValidationResult): boolean {
  return result.valid;
}
