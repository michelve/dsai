import { useCallback, useMemo, useRef, useState } from 'react';

import { validateField as validateFieldUtil } from '../../utils/forms/validateField';

import type {
  FieldState,
  FormActions,
  FormState,
  UseFormOptions,
  UseFormReturn,
} from './useForm.types';

/**
 * Comprehensive form state management hook with validation.
 *
 * Manages form state, validation, submission, and provides helpers for
 * field-level state management. Supports async validation, touched state,
 * dirty tracking, and comprehensive error handling.
 *
 * **Key Features**:
 * - Field-level state management (value, touched, error, validating)
 * - Schema-based validation with async support
 * - Dirty tracking and form-level validation
 * - Submission state management
 * - Type-safe field accessors
 * - Configurable validation timing (onChange, onBlur)
 * - Helper methods for common form operations
 *
 * @template T - Form values type (object with field names as keys)
 * @param options - Form configuration options
 * @returns Form state, actions, and field helpers
 *
 * @example
 * ```tsx
 * interface LoginForm {
 *   email: string;
 *   password: string;
 * }
 *
 * function LoginComponent() {
 *   const { state, actions, getFieldProps } = useForm<LoginForm>({
 *     initialValues: { email: '', password: '' },
 *     validationSchema: {
 *       email: [
 *         { validate: (v) => v.length > 0, message: 'Email required' },
 *         { validate: (v) => v.includes('@'), message: 'Invalid email' }
 *       ],
 *       password: [
 *         { validate: (v) => v.length >= 8, message: 'Min 8 characters' }
 *       ]
 *     },
 *     onSubmit: async (values) => {
 *       await login(values);
 *     }
 *   });
 *
 *   return (
 *     <form onSubmit={(e) => { e.preventDefault(); actions.submitForm(); }}>
 *       <input {...getFieldProps('email')} type="email" />
 *       <input {...getFieldProps('password')} type="password" />
 *       <button disabled={state.submitting || !state.valid}>
 *         {state.submitting ? 'Submitting...' : 'Login'}
 *       </button>
 *     </form>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Manual field control
 * function SignupForm() {
 *   const { state, actions } = useForm({
 *     initialValues: { username: '', email: '', terms: false },
 *     validationSchema: {
 *       username: [{ validate: (v) => v.length >= 3, message: 'Too short' }],
 *       terms: [{ validate: (v) => v === true, message: 'Must accept terms' }]
 *     }
 *   });
 *
 *   return (
 *     <div>
 *       <input
 *         value={state.values.username}
 *         onChange={(e) => actions.setFieldValue('username', e.target.value)}
 *         onBlur={() => actions.setFieldTouched('username', true)}
 *       />
 *       {state.fields.username.touched && state.fields.username.error && (
 *         <span>{state.fields.username.error}</span>
 *       )}
 *       <button onClick={() => actions.resetForm()}>Reset</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useForm<T extends Record<string, unknown>>({
  initialValues,
  validationSchema = {},
  validateOnChange = true,
  validateOnBlur = true,
  onSubmit,
}: UseFormOptions<T>): UseFormReturn<T> {
  // Initialize field states
  const initialFieldStates = useMemo(() => {
    const fields = {} as { [K in keyof T]: FieldState<T[K]> };
    (Object.keys(initialValues) as Array<keyof T>).forEach((key) => {
      fields[key] = {
        value: initialValues[key],
        touched: false,
        error: undefined,
        validating: false,
      };
    });
    return fields;
  }, [initialValues]);

  const [fields, setFields] = useState<{ [K in keyof T]: FieldState<T[K]> }>(initialFieldStates);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Track initial values for dirty detection
  const initialValuesRef = useRef(initialValues);

  // Compute derived state
  const values = useMemo(() => {
    const vals = {} as T;
    (Object.keys(fields) as Array<keyof T>).forEach((key) => {
      vals[key] = fields[key].value;
    });
    return vals;
  }, [fields]);

  const valid = useMemo(() => {
    return Object.values(fields).every((field) => !field.error);
  }, [fields]);

  const dirty = useMemo(() => {
    return (Object.keys(fields) as Array<keyof T>).some((key) => {
      return fields[key].value !== initialValuesRef.current[key];
    });
  }, [fields]);

  // Validate a single field
  const validateField = useCallback(
    async <K extends keyof T>(name: K): Promise<boolean> => {
      const rules = validationSchema[name];
      if (!rules || rules.length === 0) {
        return true;
      }

      // Set validating state
      setFields((prev) => ({
        ...prev,
        [name]: { ...prev[name], validating: true },
      }));

      try {
        const result = await validateFieldUtil(fields[name].value, rules);

        setFields((prev) => ({
          ...prev,
          [name]: {
            ...prev[name],
            error: result.error,
            validating: false,
          },
        }));

        return result.valid;
      } catch {
        // Handle validation errors
        setFields((prev) => ({
          ...prev,
          [name]: {
            ...prev[name],
            error: 'Validation error',
            validating: false,
          },
        }));
        return false;
      }
    },
    [fields, validationSchema]
  );

  // Validate entire form
  const validateForm = useCallback(async (): Promise<boolean> => {
    const validationPromises = Object.keys(fields).map((key) => validateField(key as keyof T));

    const results = await Promise.all(validationPromises);
    return results.every((result) => result);
  }, [fields, validateField]);

  // Set field value
  const setFieldValue = useCallback(
    <K extends keyof T>(name: K, value: T[K]) => {
      setFields((prev) => ({
        ...prev,
        [name]: { ...prev[name], value },
      }));

      // Validate on change if enabled
      if (validateOnChange) {
        void validateField(name);
      }
    },
    [validateOnChange, validateField]
  );

  // Set field error
  const setFieldError = useCallback(<K extends keyof T>(name: K, error?: string) => {
    setFields((prev) => ({
      ...prev,
      [name]: { ...prev[name], error },
    }));
  }, []);

  // Set field touched
  const setFieldTouched = useCallback(
    <K extends keyof T>(name: K, touched = true) => {
      setFields((prev) => ({
        ...prev,
        [name]: { ...prev[name], touched },
      }));

      // Validate on blur if enabled
      if (validateOnBlur && touched) {
        void validateField(name);
      }
    },
    [validateOnBlur, validateField]
  );

  // Reset form
  const resetForm = useCallback(() => {
    setFields(initialFieldStates);
    setSubmitting(false);
    setSubmitted(false);
  }, [initialFieldStates]);

  // Submit form
  const submitForm = useCallback(async () => {
    setSubmitted(true);

    // Mark all fields as touched
    setFields((prev) => {
      const updated = { ...prev };
      (Object.keys(updated) as Array<keyof T>).forEach((key) => {
        updated[key] = { ...updated[key], touched: true };
      });
      return updated;
    });

    // Validate form
    const isValid = await validateForm();
    if (!isValid || !onSubmit) {
      return;
    }

    // Submit
    setSubmitting(true);
    try {
      await onSubmit(values);
    } catch (error) {
      // Handle submission errors
      console.error('Form submission error:', error);
    } finally {
      setSubmitting(false);
    }
  }, [values, validateForm, onSubmit]);

  // Get field handlers
  const getFieldHandlers = useCallback(
    <K extends keyof T>(name: K) => ({
      onChange: (value: T[K]) => setFieldValue(name, value),
      onBlur: () => setFieldTouched(name, true),
    }),
    [setFieldValue, setFieldTouched]
  );

  // Get field props helper
  const getFieldProps = useCallback(
    <K extends keyof T>(name: K) => ({
      value: fields[name].value,
      onChange: (value: T[K]) => setFieldValue(name, value),
      onBlur: () => setFieldTouched(name, true),
      error: fields[name].error,
      touched: fields[name].touched,
    }),
    [fields, setFieldValue, setFieldTouched]
  );

  // Construct state object
  const state: FormState<T> = {
    values,
    fields,
    submitting,
    submitted,
    valid,
    dirty,
  };

  // Construct actions object
  const actions: FormActions<T> = {
    setFieldValue,
    setFieldError,
    setFieldTouched,
    validateField,
    validateForm,
    resetForm,
    submitForm,
    getFieldHandlers,
  };

  return {
    state,
    actions,
    getFieldProps,
  };
}
