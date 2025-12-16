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
  const getFieldState = useCallback(
    <K extends keyof T>(
      collection: { [P in keyof T]: FieldState<T[P]> },
      key: K
    ): FieldState<T[K]> => Reflect.get(collection, key) as FieldState<T[K]>,
    []
  );

  const setFieldState = useCallback(
    <K extends keyof T>(
      collection: { [P in keyof T]: FieldState<T[P]> },
      key: K,
      state: FieldState<T[K]>
    ): void => {
      Reflect.set(collection, key, state);
    },
    []
  );

  // Initialize field states
  const initialFieldStates = useMemo(() => {
    const entries = Object.entries(initialValues) as Array<[keyof T, T[keyof T]]>;

    return entries.reduce(
      (acc, [key, value]) => {
        setFieldState(acc, key, {
          value,
          touched: false,
          error: undefined,
          validating: false,
        });
        return acc;
      },
      {} as { [K in keyof T]: FieldState<T[K]> }
    );
  }, [initialValues, setFieldState]);

  const [fields, setFields] = useState<{ [K in keyof T]: FieldState<T[K]> }>(initialFieldStates);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Track initial values for dirty detection
  const initialValuesRef = useRef(initialValues);

  // Compute derived state
  const values = useMemo(() => {
    const vals = {} as T;
    (Object.keys(fields) as Array<keyof T>).forEach((key) => {
      const fieldState = getFieldState(fields, key);
      Reflect.set(vals, key, fieldState.value);
    });
    return vals;
  }, [fields, getFieldState]);

  const valid = useMemo(() => {
    return Object.values(fields).every((field) => !field.error);
  }, [fields]);

  const dirty = useMemo(() => {
    return (Object.keys(fields) as Array<keyof T>).some((key) => {
      const fieldState = getFieldState(fields, key);
      const initialValue = Reflect.get(initialValuesRef.current, key) as T[keyof T];
      return fieldState.value !== initialValue;
    });
  }, [fields, getFieldState]);

  // Validate a single field
  const validateField = useCallback(
    async <K extends keyof T>(name: K): Promise<boolean> => {
      const rules = Reflect.get(validationSchema, name) as (typeof validationSchema)[K];
      if (!rules || rules.length === 0) {
        return true;
      }

      // Set validating state
      setFields((prev) => {
        const updated = { ...prev };
        const current = getFieldState(prev, name);
        setFieldState(updated, name, { ...current, validating: true });
        return updated;
      });

      const value = getFieldState(fields, name)?.value;

      const runRules = async (): Promise<{ valid: boolean; error?: string }> => {
        for (const rule of rules) {
          try {
            const isValid = await rule.validate(value);
            if (!isValid) {
              return { valid: false, error: rule.message };
            }
          } catch {
            return { valid: false, error: rule.message };
          }
        }

        return { valid: true };
      };

      try {
        const result = await validateFieldUtil(value, rules);

        // Handle case where validation utility returns unexpected value
        const finalResult = !result || (!result.valid && !result.error) ? await runRules() : result;

        setFields((prev) => {
          const updated = { ...prev };
          const current = getFieldState(prev, name);
          setFieldState(updated, name, { ...current, error: finalResult.error, validating: false });
          return updated;
        });

        return finalResult.valid;
      } catch {
        const fallback = await runRules();

        setFields((prev) => {
          const updated = { ...prev };
          const current = getFieldState(prev, name);
          setFieldState(updated, name, {
            ...current,
            error: fallback.error ?? 'Validation error',
            validating: false,
          });
          return updated;
        });

        return fallback.valid;
      }
    },
    [fields, validationSchema, getFieldState, setFieldState]
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
      setFields((prev) => {
        const updated = { ...prev };
        const current = getFieldState(prev, name);
        setFieldState(updated, name, { ...current, value });
        return updated;
      });

      // Validate on change if enabled
      if (validateOnChange) {
        void validateField(name);
      }
    },
    [getFieldState, setFieldState, validateOnChange, validateField]
  );

  // Set field error
  const setFieldError = useCallback(
    <K extends keyof T>(name: K, error?: string) => {
      setFields((prev) => {
        const updated = { ...prev };
        const current = getFieldState(prev, name);
        setFieldState(updated, name, { ...current, error });
        return updated;
      });
    },
    [getFieldState, setFieldState]
  );

  // Set field touched
  const setFieldTouched = useCallback(
    <K extends keyof T>(name: K, touched = true) => {
      setFields((prev) => {
        const updated = { ...prev };
        const current = getFieldState(prev, name);
        setFieldState(updated, name, { ...current, touched });
        return updated;
      });

      // Validate on blur if enabled
      if (validateOnBlur && touched) {
        void validateField(name);
      }
    },
    [getFieldState, setFieldState, validateOnBlur, validateField]
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
        const current = getFieldState(updated, key);
        setFieldState(updated, key, { ...current, touched: true });
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
  }, [values, validateForm, onSubmit, getFieldState, setFieldState]);

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
      value: getFieldState(fields, name).value,
      onChange: (value: T[K]) => setFieldValue(name, value),
      onBlur: () => setFieldTouched(name, true),
      error: getFieldState(fields, name).error,
      touched: getFieldState(fields, name).touched,
    }),
    [fields, getFieldState, setFieldTouched, setFieldValue]
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
