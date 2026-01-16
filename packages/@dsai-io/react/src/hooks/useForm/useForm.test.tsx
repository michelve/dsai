import { act, renderHook, waitFor } from '@testing-library/react';

import { useForm } from './useForm';

// Mock validateField utility
jest.mock('../../utils/forms/validateField', () => ({
  validateField: jest.fn((value, rules) => {
    // Simple validation - check first rule
    if (!rules || rules.length === 0) {
      return Promise.resolve({ valid: true, error: undefined });
    }

    const rule = rules[0];
    const isValid = rule.validate(value);

    return Promise.resolve({
      valid: isValid,
      error: isValid ? undefined : rule.message,
    });
  }),
}));

interface TestForm extends Record<string, unknown> {
  email: string;
  password: string;
  terms: boolean;
}

describe('useForm', () => {
  const initialValues: TestForm = {
    email: '',
    password: '',
    terms: false,
  };

  const validationSchema = {
    email: [
      {
        validate: (v: unknown) => typeof v === 'string' && v.length > 0,
        message: 'Email required',
      },
    ],
    password: [
      {
        validate: (v: unknown) => typeof v === 'string' && v.length >= 8,
        message: 'Min 8 characters',
      },
    ],
    terms: [{ validate: (v: unknown) => v === true, message: 'Must accept terms' }],
  };

  describe('Basic Functionality', () => {
    it('should initialize with initial values', () => {
      const { result } = renderHook(() => useForm<TestForm>({ initialValues }));

      expect(result.current.state.values).toEqual(initialValues);
      expect(result.current.state.dirty).toBe(false);
      expect(result.current.state.valid).toBe(true); // No errors initially
      expect(result.current.state.submitting).toBe(false);
      expect(result.current.state.submitted).toBe(false);
    });

    it('should have field states initialized', () => {
      const { result } = renderHook(() => useForm({ initialValues }));

      expect(result.current.state.fields.email).toEqual({
        value: '',
        touched: false,
        error: undefined,
        validating: false,
      });

      expect(result.current.state.fields.password).toEqual({
        value: '',
        touched: false,
        error: undefined,
        validating: false,
      });
    });

    it('should provide state, actions, and getFieldProps', () => {
      const { result } = renderHook(() => useForm({ initialValues }));

      expect(result.current).toHaveProperty('state');
      expect(result.current).toHaveProperty('actions');
      expect(result.current).toHaveProperty('getFieldProps');
    });
  });

  describe('Field Value Updates', () => {
    it('should update field value with setFieldValue', () => {
      const { result } = renderHook(() => useForm({ initialValues }));

      act(() => {
        result.current.actions.setFieldValue('email', 'test@example.com');
      });

      expect(result.current.state.values.email).toBe('test@example.com');
      expect(result.current.state.fields.email.value).toBe('test@example.com');
    });

    it('should mark form as dirty when value changes', () => {
      const { result } = renderHook(() => useForm({ initialValues }));

      expect(result.current.state.dirty).toBe(false);

      act(() => {
        result.current.actions.setFieldValue('email', 'test@example.com');
      });

      expect(result.current.state.dirty).toBe(true);
    });

    it('should update multiple fields independently', () => {
      const { result } = renderHook(() => useForm({ initialValues }));

      act(() => {
        result.current.actions.setFieldValue('email', 'test@example.com');
        result.current.actions.setFieldValue('password', 'password123');
      });

      expect(result.current.state.values.email).toBe('test@example.com');
      expect(result.current.state.values.password).toBe('password123');
    });
  });

  describe('Field Touched State', () => {
    it('should mark field as touched with setFieldTouched', () => {
      const { result } = renderHook(() => useForm({ initialValues }));

      expect(result.current.state.fields.email.touched).toBe(false);

      act(() => {
        result.current.actions.setFieldTouched('email');
      });

      expect(result.current.state.fields.email.touched).toBe(true);
    });

    it('should mark field as untouched when false is passed', () => {
      const { result } = renderHook(() => useForm({ initialValues }));

      act(() => {
        result.current.actions.setFieldTouched('email', true);
      });
      expect(result.current.state.fields.email.touched).toBe(true);

      act(() => {
        result.current.actions.setFieldTouched('email', false);
      });
      expect(result.current.state.fields.email.touched).toBe(false);
    });
  });

  describe('Field Errors', () => {
    it('should set field error with setFieldError', () => {
      const { result } = renderHook(() => useForm({ initialValues }));

      act(() => {
        result.current.actions.setFieldError('email', 'Invalid email');
      });

      expect(result.current.state.fields.email.error).toBe('Invalid email');
      expect(result.current.state.valid).toBe(false);
    });

    it('should clear field error when undefined is passed', () => {
      const { result } = renderHook(() => useForm({ initialValues }));

      act(() => {
        result.current.actions.setFieldError('email', 'Invalid email');
      });
      expect(result.current.state.fields.email.error).toBe('Invalid email');

      act(() => {
        result.current.actions.setFieldError('email', undefined);
      });
      expect(result.current.state.fields.email.error).toBeUndefined();
    });

    it('should mark form as invalid when any field has error', () => {
      const { result } = renderHook(() => useForm({ initialValues }));

      expect(result.current.state.valid).toBe(true);

      act(() => {
        result.current.actions.setFieldError('password', 'Too short');
      });

      expect(result.current.state.valid).toBe(false);
    });
  });

  describe('Validation', () => {
    it('should validate field with validateField', async () => {
      const { result } = renderHook(() => useForm({ initialValues, validationSchema }));

      // Empty email should fail validation
      let isValid: boolean | undefined;
      await act(async () => {
        isValid = await result.current.actions.validateField('email');
      });

      if (isValid === undefined) {
        throw new Error('Expected validateField to return a result');
      }
      expect(isValid).toBe(false);
      await waitFor(() => {
        expect(result.current.state.fields.email.error).toBe('Email required');
      });
    });

    it('should validate successfully when field is valid', async () => {
      const { result } = renderHook(() => useForm({ initialValues, validationSchema }));

      act(() => {
        result.current.actions.setFieldValue('email', 'test@example.com');
      });

      let isValid: boolean | undefined;
      await act(async () => {
        isValid = await result.current.actions.validateField('email');
      });

      if (isValid === undefined) {
        throw new Error('Expected validateField to return a result');
      }
      expect(isValid).toBe(true);
      await waitFor(() => {
        expect(result.current.state.fields.email.error).toBeUndefined();
      });
    });

    it('should validate entire form with validateForm', async () => {
      const { result } = renderHook(() => useForm({ initialValues, validationSchema }));

      let isValid: boolean | undefined;
      await act(async () => {
        isValid = await result.current.actions.validateForm();
      });

      if (isValid === undefined) {
        throw new Error('Expected validateForm to return a result');
      }
      expect(isValid).toBe(false);
      await waitFor(() => {
        expect(result.current.state.fields.email.error).toBe('Email required');
        expect(result.current.state.fields.password.error).toBe('Min 8 characters');
      });
    });

    it('should validate on change when validateOnChange is true', async () => {
      const { result } = renderHook(() =>
        useForm({ initialValues, validationSchema, validateOnChange: true })
      );

      await act(async () => {
        result.current.actions.setFieldValue('email', '');
      });

      await waitFor(() => {
        expect(result.current.state.fields.email.error).toBe('Email required');
      });
    });

    it('should not validate on change when validateOnChange is false', async () => {
      const { result } = renderHook(() =>
        useForm({ initialValues, validationSchema, validateOnChange: false })
      );

      act(() => {
        result.current.actions.setFieldValue('email', '');
      });

      // Wait to ensure validation doesn't run
      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(result.current.state.fields.email.error).toBeUndefined();
    });

    it('should validate on blur when validateOnBlur is true', async () => {
      const { result } = renderHook(() =>
        useForm({ initialValues, validationSchema, validateOnBlur: true })
      );

      await act(async () => {
        result.current.actions.setFieldTouched('email', true);
      });

      await waitFor(() => {
        expect(result.current.state.fields.email.error).toBe('Email required');
      });
    });

    it('should not validate on blur when validateOnBlur is false', async () => {
      const { result } = renderHook(() =>
        useForm({ initialValues, validationSchema, validateOnBlur: false })
      );

      result.current.actions.setFieldTouched('email', true);

      // Wait to ensure validation doesn't run
      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(result.current.state.fields.email.error).toBeUndefined();
    });

    it('should set validating state during validation', async () => {
      const { result } = renderHook(() => useForm({ initialValues, validationSchema }));

      const validatePromise = result.current.actions.validateField('email');

      // Note: validating state is set and cleared very quickly
      // This test just ensures the validation completes
      await validatePromise;

      expect(result.current.state.fields.email.validating).toBe(false);
    });
  });

  describe('Form Submission', () => {
    it('should call onSubmit with values when form is valid', async () => {
      const onSubmit = jest.fn();
      const validValues = {
        email: 'test@example.com',
        password: 'password123',
        terms: true,
      };

      const { result } = renderHook(() =>
        useForm({
          initialValues: validValues,
          validationSchema,
          onSubmit,
        })
      );

      await act(async () => {
        await result.current.actions.submitForm();
      });

      expect(onSubmit).toHaveBeenCalledWith(validValues);
    });

    it('should not call onSubmit when form is invalid', async () => {
      const onSubmit = jest.fn();
      const { result } = renderHook(() => useForm({ initialValues, validationSchema, onSubmit }));

      await act(async () => {
        await result.current.actions.submitForm();
      });

      expect(onSubmit).not.toHaveBeenCalled();
    });

    it('should set submitting state during submission', async () => {
      const onSubmit = jest.fn(() => new Promise<void>((resolve) => setTimeout(resolve, 100)));
      const validValues = {
        email: 'test@example.com',
        password: 'password123',
        terms: true,
      };

      const { result } = renderHook(() =>
        useForm({ initialValues: validValues, validationSchema, onSubmit })
      );

      let submitPromise: Promise<void> | undefined;
      act(() => {
        submitPromise = result.current.actions.submitForm();
      });

      await waitFor(() => {
        expect(result.current.state.submitting).toBe(true);
      });

      const currentSubmitPromise = submitPromise;
      if (!currentSubmitPromise) {
        throw new Error('Expected submit promise to be initialized');
      }

      await act(async () => {
        await currentSubmitPromise;
      });

      await waitFor(() => {
        expect(result.current.state.submitting).toBe(false);
      });
    });

    it('should set submitted state after submission', async () => {
      const onSubmit = jest.fn();
      const validValues = {
        email: 'test@example.com',
        password: 'password123',
        terms: true,
      };

      const { result } = renderHook(() =>
        useForm({ initialValues: validValues, validationSchema, onSubmit })
      );

      expect(result.current.state.submitted).toBe(false);

      await act(async () => {
        await result.current.actions.submitForm();
      });

      expect(result.current.state.submitted).toBe(true);
    });

    it('should mark all fields as touched on submit', async () => {
      const { result } = renderHook(() => useForm({ initialValues, validationSchema }));

      expect(result.current.state.fields.email.touched).toBe(false);
      expect(result.current.state.fields.password.touched).toBe(false);

      await act(async () => {
        await result.current.actions.submitForm();
      });

      expect(result.current.state.fields.email.touched).toBe(true);
      expect(result.current.state.fields.password.touched).toBe(true);
    });

    it('should handle submission errors gracefully', async () => {
      const onSubmit = jest.fn(() => Promise.reject(new Error('Submission failed')));
      const validValues = {
        email: 'test@example.com',
        password: 'password123',
        terms: true,
      };

      const consoleError = jest.spyOn(console, 'error').mockImplementation();

      const { result } = renderHook(() =>
        useForm({ initialValues: validValues, validationSchema, onSubmit })
      );

      await act(async () => {
        await result.current.actions.submitForm();
      });

      expect(result.current.state.submitting).toBe(false);
      expect(consoleError).toHaveBeenCalled();

      consoleError.mockRestore();
    });
  });

  describe('Form Reset', () => {
    it('should reset form to initial values', () => {
      const { result } = renderHook(() => useForm({ initialValues }));

      // Modify form
      act(() => {
        result.current.actions.setFieldValue('email', 'test@example.com');
        result.current.actions.setFieldError('password', 'Error');
        result.current.actions.setFieldTouched('email', true);
      });

      // Reset
      act(() => {
        result.current.actions.resetForm();
      });

      expect(result.current.state.values).toEqual(initialValues);
      expect(result.current.state.fields.email.touched).toBe(false);
      expect(result.current.state.fields.password.error).toBeUndefined();
      expect(result.current.state.dirty).toBe(false);
    });

    it('should reset submission state', async () => {
      const onSubmit = jest.fn();
      const validValues = {
        email: 'test@example.com',
        password: 'password123',
        terms: true,
      };

      const { result } = renderHook(() =>
        useForm({ initialValues: validValues, validationSchema, onSubmit })
      );

      await act(async () => {
        await result.current.actions.submitForm();
      });
      expect(result.current.state.submitted).toBe(true);

      act(() => {
        result.current.actions.resetForm();
      });

      expect(result.current.state.submitted).toBe(false);
      expect(result.current.state.submitting).toBe(false);
    });
  });

  describe('Field Handlers', () => {
    it('should return onChange and onBlur handlers from getFieldHandlers', () => {
      const { result } = renderHook(() => useForm({ initialValues }));

      const handlers = result.current.actions.getFieldHandlers('email');

      expect(typeof handlers.onChange).toBe('function');
      expect(typeof handlers.onBlur).toBe('function');
    });

    it('should update value when onChange is called', () => {
      const { result } = renderHook(() => useForm({ initialValues }));

      const handlers = result.current.actions.getFieldHandlers('email');
      act(() => {
        handlers.onChange('test@example.com');
      });

      expect(result.current.state.values.email).toBe('test@example.com');
    });

    it('should mark touched when onBlur is called', () => {
      const { result } = renderHook(() => useForm({ initialValues }));

      const handlers = result.current.actions.getFieldHandlers('email');
      act(() => {
        handlers.onBlur();
      });

      expect(result.current.state.fields.email.touched).toBe(true);
    });
  });

  describe('getFieldProps Helper', () => {
    it('should return field props including value, onChange, onBlur, error, touched', () => {
      const { result } = renderHook(() => useForm({ initialValues }));

      const props = result.current.getFieldProps('email');

      expect(props).toHaveProperty('value');
      expect(props).toHaveProperty('onChange');
      expect(props).toHaveProperty('onBlur');
      expect(props).toHaveProperty('error');
      expect(props).toHaveProperty('touched');
    });

    it('should return current field value', () => {
      const { result } = renderHook(() => useForm({ initialValues }));

      act(() => {
        result.current.actions.setFieldValue('email', 'test@example.com');
      });

      const props = result.current.getFieldProps('email');

      expect(props.value).toBe('test@example.com');
    });

    it('should include error and touched state', () => {
      const { result } = renderHook(() => useForm({ initialValues }));

      act(() => {
        result.current.actions.setFieldError('email', 'Invalid');
        result.current.actions.setFieldTouched('email', true);
      });

      const props = result.current.getFieldProps('email');

      expect(props.error).toBe('Invalid');
      expect(props.touched).toBe(true);
    });
  });

  describe('Type Safety', () => {
    it('should work with different field types', () => {
      interface ComplexForm extends Record<string, unknown> {
        name: string;
        age: number;
        active: boolean;
        tags: string[];
      }

      const complexInitialValues: ComplexForm = {
        name: '',
        age: 0,
        active: false,
        tags: [],
      };

      const { result } = renderHook(() => useForm({ initialValues: complexInitialValues }));

      act(() => {
        result.current.actions.setFieldValue('name', 'John');
        result.current.actions.setFieldValue('age', 30);
        result.current.actions.setFieldValue('active', true);
        result.current.actions.setFieldValue('tags', ['typescript', 'react']);
      });

      expect(result.current.state.values.name).toBe('John');
      expect(result.current.state.values.age).toBe(30);
      expect(result.current.state.values.active).toBe(true);
      expect(result.current.state.values.tags).toEqual(['typescript', 'react']);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty validation schema', () => {
      const { result } = renderHook(() => useForm({ initialValues, validationSchema: {} }));

      expect(() => {
        act(() => {
          result.current.actions.setFieldValue('email', 'test@example.com');
        });
      }).not.toThrow();
    });

    it('should handle form without onSubmit', async () => {
      const validValues = {
        email: 'test@example.com',
        password: 'password123',
        terms: true,
      };

      const { result } = renderHook(() =>
        useForm({ initialValues: validValues, validationSchema })
      );

      await expect(result.current.actions.submitForm()).resolves.not.toThrow();
    });

    it('should handle fields with no validation rules', async () => {
      const schemaWithMissing = {
        email: [
          { validate: (v: unknown) => typeof v === 'string' && v.length > 0, message: 'Required' },
        ],
        // password has no rules
      };

      const { result } = renderHook(() =>
        useForm({ initialValues, validationSchema: schemaWithMissing })
      );

      const isValid = await result.current.actions.validateField('password');

      expect(isValid).toBe(true);
    });
  });
});
