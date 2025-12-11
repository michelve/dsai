import { validateForm, type ValidationSchema } from './validateForm';

import type { FormValidationResult } from './types';

/**
 * Options for form submission.
 */
export interface SubmitFormOptions<T extends Record<string, unknown>> {
  /** Validation schema (optional) */
  schema?: ValidationSchema<T>;
  /** Callback for successful submission */
  onSuccess?: (data: T) => void | Promise<void>;
  /** Callback for validation errors */
  onError?: (result: FormValidationResult) => void;
  /** Transform data before submission */
  transform?: (data: T) => T | Promise<T>;
}

/**
 * Result of form submission.
 */
export interface SubmitFormResult {
  /** Whether submission was successful */
  success: boolean;
  /** Validation result if validation failed */
  validation?: FormValidationResult;
  /** Error if submission callback threw */
  error?: Error;
}

/**
 * Validates and submits form data.
 *
 * Handles the complete form submission flow:
 * 1. Validate data (if schema provided)
 * 2. Transform data (if transform provided)
 * 3. Call success callback
 * 4. Handle errors
 *
 * **Key Features**:
 * - Integrated validation
 * - Data transformation
 * - Success/error callbacks
 * - Type-safe
 * - Async support
 *
 * @param data - Form data to submit
 * @param options - Submission options
 * @returns Submission result
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
 *     { validate: (v) => v.length >= 8, message: 'Password too short' }
 *   ]
 * };
 *
 * const result = await submitForm(formData, {
 *   schema,
 *   onSuccess: async (data) => {
 *     await api.login(data);
 *     navigate('/dashboard');
 *   },
 *   onError: (validation) => {
 *     setErrors(validation.errors);
 *   }
 * });
 *
 * if (result.success) {
 *   console.log('Login successful!');
 * }
 * ```
 *
 * @example
 * ```tsx
 * // With data transformation
 * const result = await submitForm(formData, {
 *   schema,
 *   transform: (data) => ({
 *     ...data,
 *     email: data.email.toLowerCase().trim()
 *   }),
 *   onSuccess: async (data) => {
 *     await api.createUser(data);
 *   }
 * });
 * ```
 */
export async function submitForm<T extends Record<string, unknown>>(
  data: T,
  options: SubmitFormOptions<T> = {}
): Promise<SubmitFormResult> {
  const { schema, onSuccess, onError, transform } = options;

  try {
    // Validate if schema provided
    if (schema) {
      const validation = await validateForm(data, schema);

      if (!validation.valid) {
        if (onError) {
          onError(validation);
        }
        return {
          success: false,
          validation,
        };
      }
    }

    // Transform data if transform provided
    let finalData = data;
    if (transform) {
      finalData = await transform(data);
    }

    // Call success callback
    if (onSuccess) {
      await onSuccess(finalData);
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
}
