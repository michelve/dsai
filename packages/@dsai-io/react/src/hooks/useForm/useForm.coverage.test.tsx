/**
 * useForm Coverage Tests
 *
 * Tests validation edge cases: validateField with no rules,
 * validation error fallback, form submission with validation failure,
 * onSubmit error handling, and field handlers.
 */

import { act, renderHook } from '@testing-library/react';

import { useForm } from './useForm';

// Mock validateField to test edge cases
const mockValidateField = jest.fn();
jest.mock('../../utils/forms/validateField', () => ({
  validateField: (...args: unknown[]) => mockValidateField(...args),
}));

interface TestForm extends Record<string, unknown> {
  name: string;
  email: string;
}

describe('useForm - Coverage', () => {
  beforeEach(() => {
    mockValidateField.mockReset();
    // Default: return valid
    mockValidateField.mockResolvedValue({ valid: true, error: undefined });
  });

  describe('validateField with no rules', () => {
    it('returns true when field has no validation rules', async () => {
      const { result } = renderHook(() =>
        useForm<TestForm>({
          initialValues: { name: '', email: '' },
          validationSchema: {},
        })
      );

      let isValid: boolean = false;
      await act(async () => {
        isValid = await result.current.actions.validateField('name');
      });

      expect(isValid).toBe(true);
    });
  });

  describe('validateField utility error fallback', () => {
    it('falls back to internal runRules when validateField utility throws', async () => {
      mockValidateField.mockRejectedValue(new Error('utility error'));

      const { result } = renderHook(() =>
        useForm<TestForm>({
          initialValues: { name: '', email: '' },
          validationSchema: {
            name: [
              {
                validate: (v: unknown) => typeof v === 'string' && v.length > 0,
                message: 'Name required',
              },
            ],
          },
        })
      );

      let isValid: boolean = true;
      await act(async () => {
        isValid = await result.current.actions.validateField('name');
      });

      expect(isValid).toBe(false);
      expect(result.current.state.fields.name.error).toBe('Name required');
    });

    it('handles validateField returning null/undefined result', async () => {
      mockValidateField.mockResolvedValue(null);

      const { result } = renderHook(() =>
        useForm<TestForm>({
          initialValues: { name: '', email: '' },
          validationSchema: {
            name: [
              {
                validate: (v: unknown) => typeof v === 'string' && v.length > 0,
                message: 'Name required',
              },
            ],
          },
        })
      );

      let isValid: boolean = true;
      await act(async () => {
        isValid = await result.current.actions.validateField('name');
      });

      // Should fall back to runRules
      expect(isValid).toBe(false);
    });

    it('handles validateField returning { valid: false } with no error', async () => {
      mockValidateField.mockResolvedValue({ valid: false });

      const { result } = renderHook(() =>
        useForm<TestForm>({
          initialValues: { name: '', email: '' },
          validationSchema: {
            name: [
              {
                validate: (v: unknown) => typeof v === 'string' && v.length > 0,
                message: 'Name required',
              },
            ],
          },
        })
      );

      let isValid: boolean = true;
      await act(async () => {
        isValid = await result.current.actions.validateField('name');
      });

      // Falls back to runRules because result is { valid: false } with no error
      expect(isValid).toBe(false);
    });
  });

  describe('Form submission', () => {
    it('does not call onSubmit when validation fails', async () => {
      mockValidateField.mockResolvedValue({ valid: false, error: 'Required' });
      const onSubmit = jest.fn();

      const { result } = renderHook(() =>
        useForm<TestForm>({
          initialValues: { name: '', email: '' },
          validationSchema: {
            name: [
              {
                validate: (v: unknown) => typeof v === 'string' && v.length > 0,
                message: 'Name required',
              },
            ],
          },
          onSubmit,
        })
      );

      await act(async () => {
        await result.current.actions.submitForm();
      });

      expect(onSubmit).not.toHaveBeenCalled();
      expect(result.current.state.submitted).toBe(true);
    });

    it('handles onSubmit throwing an error gracefully', async () => {
      mockValidateField.mockResolvedValue({ valid: true, error: undefined });
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const onSubmit = jest.fn().mockRejectedValue(new Error('submit failed'));

      const { result } = renderHook(() =>
        useForm<TestForm>({
          initialValues: { name: 'test', email: 'test@test.com' },
          validationSchema: {},
          onSubmit,
        })
      );

      await act(async () => {
        await result.current.actions.submitForm();
      });

      expect(onSubmit).toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalled();
      expect(result.current.state.submitting).toBe(false);

      consoleSpy.mockRestore();
    });

    it('submits without onSubmit (no-op)', async () => {
      const { result } = renderHook(() =>
        useForm<TestForm>({
          initialValues: { name: 'test', email: 'test@test.com' },
          validationSchema: {},
        })
      );

      await act(async () => {
        await result.current.actions.submitForm();
      });

      expect(result.current.state.submitted).toBe(true);
    });
  });

  describe('setFieldError', () => {
    it('sets a custom error on a field', () => {
      const { result } = renderHook(() =>
        useForm<TestForm>({
          initialValues: { name: '', email: '' },
        })
      );

      act(() => {
        result.current.actions.setFieldError('name', 'Custom error');
      });

      expect(result.current.state.fields.name.error).toBe('Custom error');
    });

    it('clears error when set to undefined', () => {
      const { result } = renderHook(() =>
        useForm<TestForm>({
          initialValues: { name: '', email: '' },
        })
      );

      act(() => {
        result.current.actions.setFieldError('name', 'Error');
      });
      expect(result.current.state.fields.name.error).toBe('Error');

      act(() => {
        result.current.actions.setFieldError('name', undefined);
      });
      expect(result.current.state.fields.name.error).toBeUndefined();
    });
  });

  describe('getFieldHandlers', () => {
    it('returns onChange and onBlur handlers', () => {
      const { result } = renderHook(() =>
        useForm<TestForm>({
          initialValues: { name: '', email: '' },
        })
      );

      const handlers = result.current.actions.getFieldHandlers('name');
      expect(typeof handlers.onChange).toBe('function');
      expect(typeof handlers.onBlur).toBe('function');
    });
  });

  describe('validateOnBlur', () => {
    it('validates on blur when enabled', async () => {
      mockValidateField.mockResolvedValue({ valid: true, error: undefined });

      const { result } = renderHook(() =>
        useForm<TestForm>({
          initialValues: { name: '', email: '' },
          validationSchema: {
            name: [
              {
                validate: (v: unknown) => typeof v === 'string' && v.length > 0,
                message: 'Required',
              },
            ],
          },
          validateOnBlur: true,
        })
      );

      await act(async () => {
        result.current.actions.setFieldTouched('name', true);
      });

      // validateField should have been called
      expect(mockValidateField).toHaveBeenCalled();
    });

    it('does not validate on blur when touched is false', async () => {
      mockValidateField.mockResolvedValue({ valid: true, error: undefined });

      const { result } = renderHook(() =>
        useForm<TestForm>({
          initialValues: { name: '', email: '' },
          validationSchema: {
            name: [
              {
                validate: (v: unknown) => typeof v === 'string' && v.length > 0,
                message: 'Required',
              },
            ],
          },
          validateOnBlur: true,
        })
      );

      await act(async () => {
        result.current.actions.setFieldTouched('name', false);
      });

      // validateField should not have been called (touched is false)
      expect(mockValidateField).not.toHaveBeenCalled();
    });
  });

  describe('Dirty tracking', () => {
    it('is not dirty initially', () => {
      const { result } = renderHook(() =>
        useForm<TestForm>({
          initialValues: { name: 'initial', email: '' },
        })
      );

      expect(result.current.state.dirty).toBe(false);
    });

    it('becomes dirty when value changes', () => {
      mockValidateField.mockResolvedValue({ valid: true, error: undefined });

      const { result } = renderHook(() =>
        useForm<TestForm>({
          initialValues: { name: '', email: '' },
          validateOnChange: false,
        })
      );

      act(() => {
        result.current.actions.setFieldValue('name', 'changed');
      });

      expect(result.current.state.dirty).toBe(true);
    });
  });

  describe('Reset form', () => {
    it('resets to initial values', () => {
      mockValidateField.mockResolvedValue({ valid: true, error: undefined });

      const { result } = renderHook(() =>
        useForm<TestForm>({
          initialValues: { name: '', email: '' },
          validateOnChange: false,
        })
      );

      act(() => {
        result.current.actions.setFieldValue('name', 'changed');
      });

      expect(result.current.state.dirty).toBe(true);

      act(() => {
        result.current.actions.resetForm();
      });

      expect(result.current.state.values.name).toBe('');
      expect(result.current.state.dirty).toBe(false);
      expect(result.current.state.submitting).toBe(false);
      expect(result.current.state.submitted).toBe(false);
    });
  });
});
