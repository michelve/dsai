/**
 * useControllableState Tests
 *
 * Comprehensive tests for the useControllableState hook.
 * Tests cover controlled/uncontrolled modes, mode switching warnings, and state management.
 */

import '@testing-library/jest-dom';
import { act, renderHook } from '@testing-library/react';

import { useControllableState } from './useControllableState';

describe('useControllableState', () => {
  describe('Uncontrolled Mode', () => {
    it('should use defaultValue when value is undefined', () => {
      const { result } = renderHook(() => useControllableState({ defaultValue: 5 }));

      const [value] = result.current;

      expect(value).toBe(5);
    });

    it('should manage internal state when uncontrolled', () => {
      const { result } = renderHook(() => useControllableState({ defaultValue: 0 }));

      act(() => {
        const [, setValue] = result.current;
        setValue(10);
      });

      const [value] = result.current;
      expect(value).toBe(10);
    });

    it('should support updater function in uncontrolled mode', () => {
      const { result } = renderHook(() => useControllableState({ defaultValue: 5 }));

      act(() => {
        const [, setValue] = result.current;
        setValue((prev) => prev + 3);
      });

      const [value] = result.current;
      expect(value).toBe(8);
    });

    it('should call onChange when value changes in uncontrolled mode', () => {
      const onChange = jest.fn();
      const { result } = renderHook(() => useControllableState({ defaultValue: 0, onChange }));

      act(() => {
        const [, setValue] = result.current;
        setValue(5);
      });

      expect(onChange).toHaveBeenCalledWith(5);
      expect(onChange).toHaveBeenCalledTimes(1);
    });

    it('should work without onChange callback', () => {
      const { result } = renderHook(() => useControllableState({ defaultValue: 0 }));

      act(() => {
        const [, setValue] = result.current;
        setValue(5);
      });

      const [value] = result.current;
      expect(value).toBe(5);
    });
  });

  describe('Controlled Mode', () => {
    it('should use provided value when controlled', () => {
      const { result } = renderHook(() => useControllableState({ value: 10 }));

      const [value] = result.current;

      expect(value).toBe(10);
    });

    it('should not change value in controlled mode when setValue is called', () => {
      const onChange = jest.fn();
      const { result } = renderHook(() => useControllableState({ value: 10, onChange }));

      act(() => {
        const [, setValue] = result.current;
        setValue(20);
      });

      const [value] = result.current;
      expect(value).toBe(10); // Still controlled value
      expect(onChange).toHaveBeenCalledWith(20); // But onChange called
    });

    it('should update when controlled value changes', () => {
      const { result, rerender } = renderHook(({ val }) => useControllableState({ value: val }), {
        initialProps: { val: 10 },
      });

      expect(result.current[0]).toBe(10);

      rerender({ val: 20 });

      expect(result.current[0]).toBe(20);
    });

    it('should call onChange when setValue is called in controlled mode', () => {
      const onChange = jest.fn();
      const { result } = renderHook(() => useControllableState({ value: 10, onChange }));

      act(() => {
        const [, setValue] = result.current;
        setValue(15);
      });

      expect(onChange).toHaveBeenCalledWith(15);
    });

    it('should support updater function in controlled mode', () => {
      const onChange = jest.fn();
      const { result } = renderHook(() => useControllableState({ value: 10, onChange }));

      act(() => {
        const [, setValue] = result.current;
        setValue((prev) => prev + 5);
      });

      expect(onChange).toHaveBeenCalledWith(15);
    });

    it('should ignore defaultValue when value is provided', () => {
      const { result } = renderHook(() => useControllableState({ value: 10, defaultValue: 5 }));

      const [value] = result.current;

      expect(value).toBe(10); // Uses value, not defaultValue
    });
  });

  describe('Mode Detection', () => {
    it('should detect controlled mode when value is defined', () => {
      const onChange = jest.fn();
      const { result } = renderHook(() => useControllableState({ value: 0, onChange }));

      act(() => {
        const [, setValue] = result.current;
        setValue(5);
      });

      // In controlled mode, internal state doesn't change
      expect(result.current[0]).toBe(0);
      expect(onChange).toHaveBeenCalledWith(5);
    });

    it('should detect uncontrolled mode when value is undefined', () => {
      const { result } = renderHook(() => useControllableState({ defaultValue: 0 }));

      act(() => {
        const [, setValue] = result.current;
        setValue(5);
      });

      // In uncontrolled mode, internal state changes
      expect(result.current[0]).toBe(5);
    });

    it('should treat null value as controlled', () => {
      const onChange = jest.fn();
      const { result } = renderHook(() =>
        useControllableState({ value: null as unknown as number, onChange })
      );

      expect(result.current[0]).toBe(null);

      act(() => {
        const [, setValue] = result.current;
        setValue(5);
      });

      expect(result.current[0]).toBe(null); // Still null (controlled)
      expect(onChange).toHaveBeenCalledWith(5);
    });
  });

  describe('Mode Switching Warnings', () => {
    const originalEnv = process.env.NODE_ENV;
    let consoleWarnSpy: jest.SpyInstance;

    beforeEach(() => {
      process.env.NODE_ENV = 'development';
      consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    });

    afterEach(() => {
      process.env.NODE_ENV = originalEnv;
      consoleWarnSpy.mockRestore();
    });

    it('should warn when switching from uncontrolled to controlled', () => {
      const { rerender } = renderHook(({ val }) => useControllableState({ value: val }), {
        initialProps: { val: undefined as number | undefined },
      });

      rerender({ val: 10 });

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('changed from uncontrolled to controlled')
      );
    });

    it('should warn when switching from controlled to uncontrolled', () => {
      const { rerender } = renderHook(({ val }) => useControllableState({ value: val }), {
        initialProps: { val: 10 as number | undefined },
      });

      rerender({ val: undefined });

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('changed from controlled to uncontrolled')
      );
    });

    it('should not warn when staying in controlled mode', () => {
      const { rerender } = renderHook(({ val }) => useControllableState({ value: val }), {
        initialProps: { val: 10 },
      });

      rerender({ val: 20 });
      rerender({ val: 30 });

      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it('should not warn when staying in uncontrolled mode', () => {
      const { rerender } = renderHook(() => useControllableState({ defaultValue: 0 }));

      rerender();
      rerender();

      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it('should not warn in production', () => {
      process.env.NODE_ENV = 'production';

      const { rerender } = renderHook(({ val }) => useControllableState({ value: val }), {
        initialProps: { val: undefined as number | undefined },
      });

      rerender({ val: 10 });

      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });
  });

  describe('Type Safety', () => {
    it('should work with string values', () => {
      const { result } = renderHook(() => useControllableState({ defaultValue: 'hello' }));

      act(() => {
        const [, setValue] = result.current;
        setValue('world');
      });

      expect(result.current[0]).toBe('world');
    });

    it('should work with object values', () => {
      const initialValue = { count: 0, name: 'test' };
      const { result } = renderHook(() => useControllableState({ defaultValue: initialValue }));

      act(() => {
        const [, setValue] = result.current;
        setValue({ count: 5, name: 'updated' });
      });

      expect(result.current[0]).toEqual({ count: 5, name: 'updated' });
    });

    it('should work with array values', () => {
      const { result } = renderHook(() => useControllableState({ defaultValue: [1, 2, 3] }));

      act(() => {
        const [, setValue] = result.current;
        setValue((prev) => [...prev, 4]);
      });

      expect(result.current[0]).toEqual([1, 2, 3, 4]);
    });

    it('should preserve undefined in updater function', () => {
      const onChange = jest.fn();
      const { result } = renderHook(() =>
        useControllableState<number | undefined>({
          defaultValue: undefined,
          onChange,
        })
      );

      act(() => {
        const [, setValue] = result.current;
        setValue((prev) => prev ?? 10);
      });

      expect(result.current[0]).toBe(10);
      expect(onChange).toHaveBeenCalledWith(10);
    });
  });

  describe('setValue Stability', () => {
    it('should maintain stable setValue reference', () => {
      const { result, rerender } = renderHook(() => useControllableState({ defaultValue: 0 }));

      const firstSetValue = result.current[1];

      rerender();
      rerender();

      expect(result.current[1]).toBe(firstSetValue);
    });

    it('should update setValue when onChange changes', () => {
      const onChange1 = jest.fn();
      const onChange2 = jest.fn();

      const { result, rerender } = renderHook(
        ({ cb }) => useControllableState({ defaultValue: 0, onChange: cb }),
        { initialProps: { cb: onChange1 } }
      );

      const firstSetValue = result.current[1];

      rerender({ cb: onChange2 });

      // setValue should be a new reference when onChange changes
      expect(result.current[1]).not.toBe(firstSetValue);
    });

    it('should update setValue when switching between controlled and uncontrolled', () => {
      const { result, rerender } = renderHook(
        ({ val }) => useControllableState({ value: val, defaultValue: 0 }),
        { initialProps: { val: undefined as number | undefined } }
      );

      const firstSetValue = result.current[1];

      rerender({ val: 10 });

      // setValue should be a new reference when mode changes
      expect(result.current[1]).not.toBe(firstSetValue);
    });
  });

  describe('Edge Cases', () => {
    it('should handle boolean values', () => {
      const { result } = renderHook(() => useControllableState({ defaultValue: false }));

      act(() => {
        const [, setValue] = result.current;
        setValue(true);
      });

      expect(result.current[0]).toBe(true);
    });

    it('should handle 0 as valid value', () => {
      const { result } = renderHook(() => useControllableState({ value: 0 }));

      expect(result.current[0]).toBe(0);
    });

    it('should handle empty string as valid value', () => {
      const { result } = renderHook(() => useControllableState({ value: '' }));

      expect(result.current[0]).toBe('');
    });

    it('should handle rapid setValue calls', () => {
      const onChange = jest.fn();
      const { result } = renderHook(() => useControllableState({ defaultValue: 0, onChange }));

      act(() => {
        const [, setValue] = result.current;
        setValue(1);
        setValue(2);
        setValue(3);
        setValue(4);
        setValue(5);
      });

      expect(result.current[0]).toBe(5);
      expect(onChange).toHaveBeenCalledTimes(5);
    });

    it('should handle complex updater functions', () => {
      const { result } = renderHook(() =>
        useControllableState({ defaultValue: { count: 0, items: [] as number[] } })
      );

      act(() => {
        const [, setValue] = result.current;
        setValue((prev) => ({
          count: prev.count + 1,
          items: [...prev.items, prev.count],
        }));
      });

      expect(result.current[0]).toEqual({ count: 1, items: [0] });
    });
  });

  describe('SSR Safety', () => {
    it('should work without window object', () => {
      const originalWindow = global.window;
      // @ts-expect-error - Testing SSR scenario
      delete global.window;

      const { result } = renderHook(() => useControllableState({ defaultValue: 5 }));

      expect(result.current[0]).toBe(5);

      global.window = originalWindow;
    });

    it('should initialize correctly in SSR', () => {
      const originalWindow = global.window;
      // @ts-expect-error - Testing SSR scenario
      delete global.window;

      const onChange = jest.fn();
      const { result } = renderHook(() => useControllableState({ value: 10, onChange }));

      expect(result.current[0]).toBe(10);

      act(() => {
        const [, setValue] = result.current;
        setValue(20);
      });

      expect(onChange).toHaveBeenCalledWith(20);

      global.window = originalWindow;
    });
  });

  describe('Integration Patterns', () => {
    it('should work in a form field component pattern', () => {
      const onChange = jest.fn();

      const { result, rerender } = renderHook(
        ({ value: valueProp }) =>
          useControllableState({
            value: valueProp,
            defaultValue: '',
            onChange,
          }),
        { initialProps: { value: undefined as string | undefined } }
      );

      // Uncontrolled: type in field
      act(() => {
        const [, setValue] = result.current;
        setValue('user input');
      });

      expect(result.current[0]).toBe('user input');
      expect(onChange).toHaveBeenCalledWith('user input');

      // Switch to controlled
      rerender({ value: 'controlled value' });

      expect(result.current[0]).toBe('controlled value');
    });

    it('should work with toggle component pattern', () => {
      const onChange = jest.fn();

      const { result } = renderHook(() => useControllableState({ defaultValue: false, onChange }));

      act(() => {
        const [value, setValue] = result.current;
        setValue(!value);
      });

      expect(result.current[0]).toBe(true);
      expect(onChange).toHaveBeenCalledWith(true);

      act(() => {
        const [value, setValue] = result.current;
        setValue(!value);
      });

      expect(result.current[0]).toBe(false);
      expect(onChange).toHaveBeenCalledWith(false);
    });
  });

  describe('Memory Leak Prevention', () => {
    it('should clean up properly on unmount', () => {
      const onChange = jest.fn();
      const { unmount, result } = renderHook(() =>
        useControllableState({ defaultValue: 0, onChange })
      );

      act(() => {
        const [, setValue] = result.current;
        setValue(5);
      });

      unmount();

      // No assertion needed - just ensuring no errors on cleanup
    });
  });
});
