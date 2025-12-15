import { useCallback, useMemo, useState } from 'react';

import { validateField as validateFieldUtil } from '../../utils/forms/validateField';

import type {
  UseFieldActions,
  UseFieldOptions,
  UseFieldReturn,
  UseFieldState,
} from './useField.types';

/**
 * Manages state for a single form field with validation.
 *
 * Provides granular field-level state management with validation, touched state,
 * dirty tracking, and error handling. Can be used standalone or in combination
 * with useForm for fine-grained control.
 *
 * **Key Features**:
 * - Field value state management
 * - Validation with async support
 * - Touched and dirty state tracking
 * - Configurable validation timing (onChange, onBlur)
 * - Type-safe field values
 * - Helper methods for common field operations
 * - Standalone or composable with useForm
 *
 * @template T - Field value type
 * @param options - Field configuration options
 * @returns Field state, actions, and input helpers
 *
 * @example
 * ```tsx
 * // Basic usage with validation
 * function EmailInput() {
 *   const { state, actions, getInputProps } = useField<string>({
 *     initialValue: '',
 *     validationRules: [
 *       { validate: (v) => v.length > 0, message: 'Email required' },
 *       { validate: (v) => v.includes('@'), message: 'Invalid email' }
 *     ]
 *   });
 *
 *   return (
 *     <div>
 *       <input {...getInputProps()} type="email" />
 *       {state.touched && state.error && <span>{state.error}</span>}
 *       {state.validating && <span>Validating...</span>}
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // With async validation
 * function UsernameInput() {
 *   const { state, actions } = useField<string>({
 *     initialValue: '',
 *     validationRules: [
 *       { validate: (v) => v.length >= 3, message: 'Min 3 characters' },
 *       {
 *         validate: async (v) => {
 *           const available = await checkUsernameAvailability(v);
 *           return available;
 *         },
 *         message: 'Username taken'
 *       }
 *     ],
 *     validateOnChange: true
 *   });
 *
 *   return (
 *     <div>
 *       <input
 *         value={state.value}
 *         onChange={(e) => actions.handleChange(e.target.value)}
 *         onBlur={actions.handleBlur}
 *       />
 *       {state.validating && <Spinner />}
 *       {state.error && <Error>{state.error}</Error>}
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Manual control
 * function PasswordInput() {
 *   const { state, actions } = useField<string>({
 *     initialValue: '',
 *     validationRules: [
 *       { validate: (v) => v.length >= 8, message: 'Min 8 characters' },
 *       { validate: (v) => /[A-Z]/.test(v), message: 'Need uppercase' },
 *       { validate: (v) => /[0-9]/.test(v), message: 'Need number' }
 *     ]
 *   });
 *
 *   const handleSubmit = async () => {
 *     const isValid = await actions.validate();
 *     if (isValid) {
 *       await submitPassword(state.value);
 *       actions.reset();
 *     }
 *   };
 *
 *   return (
 *     <div>
 *       <input
 *         type="password"
 *         value={state.value}
 *         onChange={(e) => actions.setValue(e.target.value)}
 *       />
 *       <button onClick={handleSubmit}>Submit</button>
 *       {state.dirty && <span>*</span>}
 *     </div>
 *   );
 * }
 * ```
 */
export function useField<T = unknown>({
  initialValue,
  validationRules = [],
  validateOnChange = true,
  validateOnBlur = true,
  onChange,
  onBlur,
}: UseFieldOptions<T> = {}): UseFieldReturn<T> {
  const [value, setValue] = useState<T>(initialValue as T);
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [validating, setValidating] = useState(false);

  // Track initial value for dirty detection (stored in state, not ref)
  const [storedInitialValue] = useState<T>(initialValue as T);

  // Compute dirty state
  const dirty = useMemo(() => {
    return value !== storedInitialValue;
  }, [value, storedInitialValue]);

  // Validate field
  const validate = useCallback(async (): Promise<boolean> => {
    if (validationRules.length === 0) {
      return true;
    }

    setValidating(true);
    let result: { valid: boolean; error?: string } = { valid: true, error: undefined };

    const runRules = async (): Promise<{ valid: boolean; error?: string }> => {
      for (const rule of validationRules) {
        try {
          const isValidRule = await rule.validate(value);
          if (!isValidRule) {
            return { valid: false, error: rule.message };
          }
        } catch {
          return { valid: false, error: rule.message ?? 'Validation error' };
        }
      }
      return { valid: true };
    };

    try {
      // Primary validation path with full async support
      result = await runRules();

      // If the shared validator returns an explicit error, prefer it
      try {
        const utilResult = await validateFieldUtil(value, validationRules);
        if (utilResult && (!utilResult.valid || utilResult.error)) {
          result = utilResult;
        }
      } catch {
        // Ignore util failures and keep the primary result
      }
    } catch {
      result = { valid: false, error: 'Validation error' };
    } finally {
      setError(result.error);
      setValidating(false);
    }

    return result.valid;
  }, [value, validationRules]);

  // Handle change
  const handleChange = useCallback(
    (newValue: T) => {
      setValue(newValue);
      onChange?.(newValue);

      // Validate on change if enabled
      if (validateOnChange && validationRules.length > 0) {
        void validate();
      }
    },
    [onChange, validateOnChange, validationRules.length, validate]
  );

  // Handle blur
  const handleBlur = useCallback(() => {
    setTouched(true);
    onBlur?.();

    // Validate on blur if enabled
    if (validateOnBlur && validationRules.length > 0) {
      void validate();
    }
  }, [onBlur, validateOnBlur, validationRules.length, validate]);

  // Reset field
  const reset = useCallback(() => {
    setValue(storedInitialValue);
    setTouched(false);
    setError(undefined);
    setValidating(false);
  }, [storedInitialValue]);

  // Set touched state
  const setTouchedState = useCallback((isTouched = true) => {
    setTouched(isTouched);
  }, []);

  // Get input props helper
  const getInputProps = useCallback(
    () => ({
      value,
      onChange: handleChange,
      onBlur: handleBlur,
    }),
    [value, handleChange, handleBlur]
  );

  // Construct state object
  const state: UseFieldState<T> = {
    value,
    touched,
    error,
    validating,
    dirty,
  };

  // Construct actions object
  const actions: UseFieldActions<T> = {
    setValue,
    setError,
    setTouched: setTouchedState,
    validate,
    reset,
    handleChange,
    handleBlur,
  };

  return {
    state,
    actions,
    getInputProps,
  };
}
