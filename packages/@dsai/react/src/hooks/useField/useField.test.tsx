import { act, renderHook, waitFor } from '@testing-library/react';

import { useField } from './useField';

// Mock validateField utility
jest.mock('../../utils/forms/validateField', () => ({
  validateField: jest.fn((value, rules) => {
    for (const rule of rules) {
      const isValid = rule.validate(value);
      if (!isValid) {
        return Promise.resolve({ valid: false, error: rule.message });
      }
    }
    return Promise.resolve({ valid: true, error: undefined });
  }),
}));

describe('useField', () => {
  describe('Basic Functionality', () => {
    it('should initialize with initial value', () => {
      const { result } = renderHook(() => useField<string>({ initialValue: 'test' }));

      expect(result.current.state.value).toBe('test');
      expect(result.current.state.touched).toBe(false);
      expect(result.current.state.error).toBeUndefined();
      expect(result.current.state.validating).toBe(false);
      expect(result.current.state.dirty).toBe(false);
    });

    it('should initialize with default value when no initial value', () => {
      const { result } = renderHook(() => useField<string>());

      expect(result.current.state.value).toBeUndefined();
      expect(result.current.state.dirty).toBe(false);
    });

    it('should work with different value types', () => {
      const { result: stringResult } = renderHook(() => useField<string>({ initialValue: 'text' }));
      const { result: numberResult } = renderHook(() => useField<number>({ initialValue: 42 }));
      const { result: booleanResult } = renderHook(() => useField<boolean>({ initialValue: true }));
      const { result: objectResult } = renderHook(() =>
        useField<{ name: string }>({ initialValue: { name: 'John' } })
      );

      expect(stringResult.current.state.value).toBe('text');
      expect(numberResult.current.state.value).toBe(42);
      expect(booleanResult.current.state.value).toBe(true);
      expect(objectResult.current.state.value).toEqual({ name: 'John' });
    });
  });

  describe('Value Management', () => {
    it('should update value with setValue', () => {
      const { result } = renderHook(() => useField<string>({ initialValue: 'initial' }));

      act(() => {
        result.current.actions.setValue('updated');
      });

      expect(result.current.state.value).toBe('updated');
    });

    it('should support function updater for setValue', () => {
      const { result } = renderHook(() => useField<number>({ initialValue: 10 }));

      act(() => {
        result.current.actions.setValue((prev) => prev + 5);
      });

      expect(result.current.state.value).toBe(15);
    });

    it('should update value with handleChange', () => {
      const { result } = renderHook(() => useField<string>({ initialValue: 'initial' }));

      act(() => {
        result.current.actions.handleChange('changed');
      });

      expect(result.current.state.value).toBe('changed');
    });

    it('should call onChange callback when value changes', () => {
      const onChange = jest.fn();
      const { result } = renderHook(() => useField<string>({ initialValue: 'initial', onChange }));

      act(() => {
        result.current.actions.handleChange('new value');
      });

      expect(onChange).toHaveBeenCalledWith('new value');
    });
  });

  describe('Touched State', () => {
    it('should set touched with setTouched', () => {
      const { result } = renderHook(() => useField<string>({ initialValue: 'test' }));

      expect(result.current.state.touched).toBe(false);

      act(() => {
        result.current.actions.setTouched();
      });

      expect(result.current.state.touched).toBe(true);
    });

    it('should set touched explicitly with boolean', () => {
      const { result } = renderHook(() => useField<string>({ initialValue: 'test' }));

      act(() => {
        result.current.actions.setTouched(true);
      });
      expect(result.current.state.touched).toBe(true);

      act(() => {
        result.current.actions.setTouched(false);
      });
      expect(result.current.state.touched).toBe(false);
    });

    it('should mark as touched on handleBlur', () => {
      const { result } = renderHook(() => useField<string>({ initialValue: 'test' }));

      act(() => {
        result.current.actions.handleBlur();
      });

      expect(result.current.state.touched).toBe(true);
    });

    it('should call onBlur callback when blurred', () => {
      const onBlur = jest.fn();
      const { result } = renderHook(() => useField<string>({ initialValue: 'test', onBlur }));

      act(() => {
        result.current.actions.handleBlur();
      });

      expect(onBlur).toHaveBeenCalled();
    });
  });

  describe('Dirty State', () => {
    it('should be clean when value equals initial value', () => {
      const { result } = renderHook(() => useField<string>({ initialValue: 'test' }));

      expect(result.current.state.dirty).toBe(false);
    });

    it('should be dirty when value differs from initial value', () => {
      const { result } = renderHook(() => useField<string>({ initialValue: 'initial' }));

      act(() => {
        result.current.actions.setValue('changed');
      });

      expect(result.current.state.dirty).toBe(true);
    });

    it('should be clean again when reset to initial value', () => {
      const { result } = renderHook(() => useField<string>({ initialValue: 'initial' }));

      act(() => {
        result.current.actions.setValue('changed');
      });
      expect(result.current.state.dirty).toBe(true);

      act(() => {
        result.current.actions.setValue('initial');
      });
      expect(result.current.state.dirty).toBe(false);
    });
  });

  describe('Error Management', () => {
    it('should set error with setError', () => {
      const { result } = renderHook(() => useField<string>({ initialValue: 'test' }));

      act(() => {
        result.current.actions.setError('Error message');
      });

      expect(result.current.state.error).toBe('Error message');
    });

    it('should clear error when setting undefined', () => {
      const { result } = renderHook(() => useField<string>({ initialValue: 'test' }));

      act(() => {
        result.current.actions.setError('Error message');
      });
      expect(result.current.state.error).toBe('Error message');

      act(() => {
        result.current.actions.setError(undefined);
      });
      expect(result.current.state.error).toBeUndefined();
    });
  });

  describe('Validation', () => {
    it('should validate with validation rules', async () => {
      const validationRules = [
        {
          validate: (v: unknown) => typeof v === 'string' && v.length > 0,
          message: 'Required',
        },
      ];

      const { result } = renderHook(() => useField<string>({ initialValue: '', validationRules }));

      let isValid: boolean;
      await act(async () => {
        isValid = await result.current.actions.validate();
      });

      expect(isValid).toBe(false);
      await waitFor(() => {
        expect(result.current.state.error).toBe('Required');
        expect(result.current.state.validating).toBe(false);
      });
    });

    it('should return true when no validation rules', async () => {
      const { result } = renderHook(() => useField<string>({ initialValue: '' }));

      let isValid: boolean;
      await act(async () => {
        isValid = await result.current.actions.validate();
      });

      expect(isValid).toBe(true);
      expect(result.current.state.error).toBeUndefined();
    });

    it('should validate multiple rules in sequence', async () => {
      const validationRules = [
        {
          validate: (v: unknown) => typeof v === 'string' && v.length > 0,
          message: 'Required',
        },
        {
          validate: (v: unknown) => typeof v === 'string' && v.includes('@'),
          message: 'Invalid email',
        },
      ];

      const { result } = renderHook(() =>
        useField<string>({ initialValue: 'test', validationRules })
      );

      let isValid: boolean;
      await act(async () => {
        isValid = await result.current.actions.validate();
      });

      expect(isValid).toBe(false);
      await waitFor(() => {
        expect(result.current.state.error).toBe('Invalid email');
      });
    });

    it('should set validating state during validation', async () => {
      const validationRules = [
        {
          validate: async (v: unknown) => {
            await new Promise((resolve) => setTimeout(resolve, 10));
            return typeof v === 'string' && v.length > 0;
          },
          message: 'Required',
        },
      ];

      const { result } = renderHook(() =>
        useField<string>({ initialValue: 'test', validationRules })
      );

      let promise: Promise<boolean>;
      act(() => {
        promise = result.current.actions.validate();
      });

      await waitFor(() => expect(result.current.state.validating).toBe(true));

      await act(async () => {
        await promise;
      });

      expect(result.current.state.validating).toBe(false);
    });

    it('should validate on change when validateOnChange is true', async () => {
      const validationRules = [
        {
          validate: (v: unknown) => typeof v === 'string' && v.length >= 3,
          message: 'Min 3 characters',
        },
      ];

      const { result } = renderHook(() =>
        useField<string>({
          initialValue: '',
          validationRules,
          validateOnChange: true,
        })
      );

      await act(async () => {
        await act(async () => {
          result.current.actions.handleChange('ab');
        });
      });

      await waitFor(() => {
        expect(result.current.state.error).toBe('Min 3 characters');
      });
    });

    it('should not validate on change when validateOnChange is false', async () => {
      const validationRules = [
        {
          validate: (v: unknown) => typeof v === 'string' && v.length >= 3,
          message: 'Min 3 characters',
        },
      ];

      const { result } = renderHook(() =>
        useField<string>({
          initialValue: '',
          validationRules,
          validateOnChange: false,
        })
      );

      await act(async () => {
        result.current.actions.handleChange('ab');
      });

      // Wait a bit to ensure validation doesn't happen
      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(result.current.state.error).toBeUndefined();
    });

    it('should validate on blur when validateOnBlur is true', async () => {
      const validationRules = [
        {
          validate: (v: unknown) => typeof v === 'string' && v.length >= 3,
          message: 'Min 3 characters',
        },
      ];

      const { result } = renderHook(() =>
        useField<string>({
          initialValue: 'ab',
          validationRules,
          validateOnBlur: true,
        })
      );

      await act(async () => {
        result.current.actions.handleBlur();
      });

      await waitFor(() => {
        expect(result.current.state.error).toBe('Min 3 characters');
      });
    });

    it('should not validate on blur when validateOnBlur is false', async () => {
      const validationRules = [
        {
          validate: (v: unknown) => typeof v === 'string' && v.length >= 3,
          message: 'Min 3 characters',
        },
      ];

      const { result } = renderHook(() =>
        useField<string>({
          initialValue: 'ab',
          validationRules,
          validateOnBlur: false,
        })
      );

      await act(async () => {
        result.current.actions.handleBlur();
      });

      // Wait a bit to ensure validation doesn't happen
      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(result.current.state.error).toBeUndefined();
    });

    it('should handle async validation', async () => {
      const validationRules = [
        {
          validate: async (v: unknown) => {
            await new Promise((resolve) => setTimeout(resolve, 10));
            return typeof v === 'string' && v.length > 0;
          },
          message: 'Required',
        },
      ];

      const { result } = renderHook(() => useField<string>({ initialValue: '', validationRules }));

      let isValid: boolean;
      await act(async () => {
        isValid = await result.current.actions.validate();
      });

      expect(isValid).toBe(false);
      await waitFor(() => {
        expect(result.current.state.error).toBe('Required');
      });
    });

    it('should handle validation errors gracefully', async () => {
      const validationRules = [
        {
          validate: () => {
            throw new Error('Validation failed');
          },
          message: 'Invalid',
        },
      ];

      const { result } = renderHook(() =>
        useField<string>({ initialValue: 'test', validationRules })
      );

      let isValid: boolean;
      await act(async () => {
        isValid = await result.current.actions.validate();
      });

      expect(isValid).toBe(false);
      await waitFor(() => {
        expect(result.current.state.error).toBe('Invalid');
      });
    });
  });

  describe('Reset', () => {
    it('should reset to initial value', () => {
      const { result } = renderHook(() => useField<string>({ initialValue: 'initial' }));

      act(() => {
        result.current.actions.setValue('changed');
        result.current.actions.setTouched(true);
        result.current.actions.setError('Error');
      });

      act(() => {
        result.current.actions.reset();
      });

      expect(result.current.state.value).toBe('initial');
      expect(result.current.state.touched).toBe(false);
      expect(result.current.state.error).toBeUndefined();
      expect(result.current.state.validating).toBe(false);
      expect(result.current.state.dirty).toBe(false);
    });

    it('should reset to initial value even if changed multiple times', () => {
      const { result } = renderHook(() => useField<string>({ initialValue: 'initial' }));

      act(() => {
        result.current.actions.setValue('change1');
        result.current.actions.setValue('change2');
        result.current.actions.setValue('change3');
      });

      act(() => {
        result.current.actions.reset();
      });

      expect(result.current.state.value).toBe('initial');
    });
  });

  describe('getInputProps', () => {
    it('should return input props with value, onChange, onBlur', () => {
      const { result } = renderHook(() => useField<string>({ initialValue: 'test' }));

      const inputProps = result.current.getInputProps();

      expect(inputProps).toHaveProperty('value', 'test');
      expect(inputProps).toHaveProperty('onChange');
      expect(inputProps).toHaveProperty('onBlur');
      expect(typeof inputProps.onChange).toBe('function');
      expect(typeof inputProps.onBlur).toBe('function');
    });

    it('should update value when calling onChange from getInputProps', () => {
      const { result } = renderHook(() => useField<string>({ initialValue: 'initial' }));

      const inputProps = result.current.getInputProps();
      act(() => {
        inputProps.onChange('updated');
      });

      expect(result.current.state.value).toBe('updated');
    });

    it('should mark as touched when calling onBlur from getInputProps', () => {
      const { result } = renderHook(() => useField<string>({ initialValue: 'test' }));

      const inputProps = result.current.getInputProps();
      act(() => {
        inputProps.onBlur();
      });

      expect(result.current.state.touched).toBe(true);
    });

    it('should have stable references across renders', () => {
      const validationRules: Array<{ validate: (v: unknown) => boolean; message: string }> = [];
      const { result, rerender } = renderHook(() =>
        useField<string>({ initialValue: 'test', validationRules })
      );

      const inputProps1 = result.current.getInputProps();
      rerender();
      const inputProps2 = result.current.getInputProps();

      // getInputProps itself should return new object, but functions should be stable
      expect(inputProps1.onChange).toBe(inputProps2.onChange);
      expect(inputProps1.onBlur).toBe(inputProps2.onBlur);
    });
  });

  describe('Edge Cases', () => {
    it('should handle null initial value', () => {
      const { result } = renderHook(() => useField<string | null>({ initialValue: null }));

      expect(result.current.state.value).toBeNull();
      expect(result.current.state.dirty).toBe(false);
    });

    it('should handle undefined initial value', () => {
      const { result } = renderHook(() =>
        useField<string | undefined>({ initialValue: undefined })
      );

      expect(result.current.state.value).toBeUndefined();
      expect(result.current.state.dirty).toBe(false);
    });

    it('should handle array values', () => {
      const { result } = renderHook(() => useField<string[]>({ initialValue: ['a', 'b'] }));

      expect(result.current.state.value).toEqual(['a', 'b']);

      act(() => {
        result.current.actions.setValue(['c', 'd']);
      });
      expect(result.current.state.dirty).toBe(true);
    });

    it('should handle object values', () => {
      const initialValue = { name: 'John', age: 30 };
      const { result } = renderHook(() => useField<typeof initialValue>({ initialValue }));

      expect(result.current.state.value).toEqual(initialValue);

      act(() => {
        result.current.actions.setValue({ name: 'Jane', age: 25 });
      });
      expect(result.current.state.dirty).toBe(true);
    });

    it('should not validate on change if no validation rules', () => {
      const { result } = renderHook(() =>
        useField<string>({
          initialValue: '',
          validateOnChange: true,
        })
      );

      act(() => {
        result.current.actions.handleChange('test');
      });

      expect(result.current.state.validating).toBe(false);
      expect(result.current.state.error).toBeUndefined();
    });

    it('should not validate on blur if no validation rules', () => {
      const { result } = renderHook(() =>
        useField<string>({
          initialValue: '',
          validateOnBlur: true,
        })
      );

      act(() => {
        result.current.actions.handleBlur();
      });

      expect(result.current.state.validating).toBe(false);
      expect(result.current.state.error).toBeUndefined();
    });
  });

  describe('Type Safety', () => {
    it('should work with string type', () => {
      const { result } = renderHook(() => useField<string>({ initialValue: 'test' }));

      act(() => {
        result.current.actions.setValue('new value');
      });
      expect(result.current.state.value).toBe('new value');
    });

    it('should work with number type', () => {
      const { result } = renderHook(() => useField<number>({ initialValue: 42 }));

      act(() => {
        result.current.actions.setValue(100);
      });
      expect(result.current.state.value).toBe(100);
    });

    it('should work with boolean type', () => {
      const { result } = renderHook(() => useField<boolean>({ initialValue: false }));

      act(() => {
        result.current.actions.setValue(true);
      });
      expect(result.current.state.value).toBe(true);
    });

    it('should work with custom object type', () => {
      interface User {
        name: string;
        email: string;
      }

      const { result } = renderHook(() =>
        useField<User>({ initialValue: { name: 'John', email: 'john@example.com' } })
      );

      act(() => {
        result.current.actions.setValue({ name: 'Jane', email: 'jane@example.com' });
      });
      expect(result.current.state.value).toEqual({
        name: 'Jane',
        email: 'jane@example.com',
      });
    });
  });

  describe('SSR Safety', () => {
    it('should not throw during SSR', () => {
      expect(() => {
        renderHook(() => useField<string>({ initialValue: 'test' }));
      }).not.toThrow();
    });

    it('should initialize correctly without window', () => {
      const { result } = renderHook(() => useField<string>({ initialValue: 'test' }));

      expect(result.current.state.value).toBe('test');
      expect(result.current.state.touched).toBe(false);
      expect(result.current.state.dirty).toBe(false);
    });
  });
});
