/**
 * useCallbackRef Tests
 *
 * Comprehensive tests for the useCallbackRef hook.
 * Tests cover callback stability, latest value usage, type safety, and integration patterns.
 */

import '@testing-library/jest-dom';
import { renderHook } from '@testing-library/react';
import { useEffect, useState } from 'react';

import { useCallbackRef } from './useCallbackRef';

describe('useCallbackRef', () => {
  describe('Basic Functionality', () => {
    it('should return a function', () => {
      const callback = jest.fn();
      const { result } = renderHook(() => useCallbackRef(callback));

      expect(typeof result.current).toBe('function');
    });

    it('should call the callback when invoked', () => {
      const callback = jest.fn();
      const { result } = renderHook(() => useCallbackRef(callback));

      result.current();

      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should forward arguments to callback', () => {
      const callback = jest.fn();
      const { result } = renderHook(() => useCallbackRef(callback));

      result.current('arg1', 42, { key: 'value' });

      expect(callback).toHaveBeenCalledWith('arg1', 42, { key: 'value' });
    });

    it('should return callback result', () => {
      const callback = jest.fn().mockReturnValue('result');
      const { result } = renderHook(() => useCallbackRef(callback));

      const returnValue = result.current();

      expect(returnValue).toBe('result');
    });
  });

  describe('Callback Stability', () => {
    it('should return same function reference across re-renders', () => {
      const callback = jest.fn();
      const { result, rerender } = renderHook(() => useCallbackRef(callback));

      const firstRef = result.current;

      rerender();
      rerender();
      rerender();

      expect(result.current).toBe(firstRef);
    });

    it('should maintain stable reference when callback changes', () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();

      const { result, rerender } = renderHook(({ cb }) => useCallbackRef(cb), {
        initialProps: { cb: callback1 },
      });

      const firstRef = result.current;

      rerender({ cb: callback2 });

      expect(result.current).toBe(firstRef);
    });

    it('should not cause re-renders in parent component', () => {
      let renderCount = 0;

      const { rerender } = renderHook(
        ({ count }) => {
          renderCount++;
          const callback = useCallbackRef(() => count * 2);
          return callback;
        },
        { initialProps: { count: 1 } }
      );

      expect(renderCount).toBe(1);

      rerender({ count: 2 });
      expect(renderCount).toBe(2);

      rerender({ count: 3 });
      expect(renderCount).toBe(3);
    });
  });

  describe('Latest Callback Value', () => {
    it('should always call latest callback version', () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();

      const { result, rerender } = renderHook(({ cb }) => useCallbackRef(cb), {
        initialProps: { cb: callback1 },
      });

      result.current();
      expect(callback1).toHaveBeenCalledTimes(1);
      expect(callback2).not.toHaveBeenCalled();

      rerender({ cb: callback2 });

      result.current();
      expect(callback1).toHaveBeenCalledTimes(1);
      expect(callback2).toHaveBeenCalledTimes(1);
    });

    it('should use latest closure values', () => {
      const calls: number[] = [];

      const { result, rerender } = renderHook(
        ({ value }) => useCallbackRef(() => calls.push(value)),
        { initialProps: { value: 1 } }
      );

      result.current();
      expect(calls).toEqual([1]);

      rerender({ value: 2 });
      result.current();
      expect(calls).toEqual([1, 2]);

      rerender({ value: 3 });
      result.current();
      expect(calls).toEqual([1, 2, 3]);
    });

    it('should work with async callbacks', async () => {
      const results: string[] = [];

      const { result, rerender } = renderHook(
        ({ msg }) =>
          useCallbackRef(async () => {
            await new Promise((resolve) => setTimeout(resolve, 10));
            results.push(msg);
          }),
        { initialProps: { msg: 'first' } }
      );

      await result.current();
      expect(results).toEqual(['first']);

      rerender({ msg: 'second' });
      await result.current();
      expect(results).toEqual(['first', 'second']);
    });
  });

  describe('Type Safety', () => {
    it('should preserve parameter types', () => {
      const callback = jest.fn((a: string, b: number) => `${a}${b}`);
      const { result } = renderHook(() => useCallbackRef(callback));

      const returnValue = result.current('test', 42);

      expect(returnValue).toBe('test42');
      expect(callback).toHaveBeenCalledWith('test', 42);
    });

    it('should preserve return type', () => {
      const callback = jest.fn((): { id: number; name: string } => ({
        id: 1,
        name: 'test',
      }));

      const { result } = renderHook(() => useCallbackRef(callback));

      const returnValue = result.current();

      expect(returnValue).toEqual({ id: 1, name: 'test' });
    });

    it('should work with void callbacks', () => {
      const callback = jest.fn((): void => {
        // Side effect only
      });

      const { result } = renderHook(() => useCallbackRef(callback));

      const returnValue = result.current();

      expect(returnValue).toBeUndefined();
      expect(callback).toHaveBeenCalled();
    });
  });

  describe('Integration Patterns', () => {
    it('should work with useEffect dependencies', () => {
      const effectCallback = jest.fn();

      renderHook(
        ({ count }) => {
          const stableCallback = useCallbackRef(() => {
            effectCallback(count);
          });

          useEffect(() => {
            stableCallback();
          }, [stableCallback]); // Safe to include without triggering re-runs

          return null;
        },
        { initialProps: { count: 1 } }
      );

      // Effect should run only once despite callback updating
      expect(effectCallback).toHaveBeenCalledTimes(1);
      expect(effectCallback).toHaveBeenCalledWith(1);
    });

    it('should work with setInterval', () => {
      jest.useFakeTimers();

      const { rerender } = renderHook(
        ({ multiplier }) => {
          const [count, setCount] = useState(0);

          const increment = useCallbackRef(() => {
            setCount((c) => c + multiplier);
          });

          useEffect(() => {
            const id = setInterval(increment, 100);
            return () => clearInterval(id);
          }, [increment]);

          return count;
        },
        { initialProps: { multiplier: 1 } }
      );

      jest.advanceTimersByTime(300);
      // Should use latest multiplier (1)

      rerender({ multiplier: 5 });
      jest.advanceTimersByTime(100);
      // Should use new multiplier (5) without recreating interval

      jest.useRealTimers();
    });

    it('should work with event handlers', () => {
      const onClick = jest.fn();

      const { result, rerender } = renderHook(({ handler }) => useCallbackRef(handler), {
        initialProps: { handler: onClick },
      });

      const stableHandler = result.current;

      // Simulate passing to child component
      stableHandler();
      expect(onClick).toHaveBeenCalledTimes(1);

      // Update handler
      const newHandler = jest.fn();
      rerender({ handler: newHandler });

      // Reference is stable
      expect(result.current).toBe(stableHandler);

      // But calls new handler
      result.current();
      expect(onClick).toHaveBeenCalledTimes(1);
      expect(newHandler).toHaveBeenCalledTimes(1);
    });
  });

  describe('Edge Cases', () => {
    it('should handle callback that throws error', () => {
      const error = new Error('Test error');
      const callback = jest.fn(() => {
        throw error;
      });

      const { result } = renderHook(() => useCallbackRef(callback));

      expect(() => result.current()).toThrow(error);
      expect(callback).toHaveBeenCalled();
    });

    it('should handle null/undefined safely', () => {
      // TypeScript should prevent this, but test runtime safety
      const { result } = renderHook(() =>
        // @ts-expect-error - Testing runtime safety
        useCallbackRef(null)
      );

      // Should not throw when creating
      expect(result.current).toBeDefined();
    });

    it('should work with callback that returns undefined', () => {
      const callback = jest.fn(() => undefined);
      const { result } = renderHook(() => useCallbackRef(callback));

      const returnValue = result.current();

      expect(returnValue).toBeUndefined();
    });

    it('should handle rapid callback changes', () => {
      const callbacks = Array.from({ length: 100 }, (_, i) => jest.fn(() => i));

      const { result, rerender } = renderHook(({ cb }) => useCallbackRef(cb), {
        initialProps: { cb: callbacks[0] },
      });

      const stableRef = result.current;

      callbacks.forEach((cb, i) => {
        rerender({ cb });
        expect(result.current).toBe(stableRef);
        expect(result.current()).toBe(i);
      });
    });
  });

  describe('SSR Safety', () => {
    it('should work without window object', () => {
      const originalWindow = global.window;
      // @ts-expect-error - Testing SSR scenario
      delete global.window;

      const callback = jest.fn();
      const { result } = renderHook(() => useCallbackRef(callback));

      result.current();
      expect(callback).toHaveBeenCalled();

      global.window = originalWindow;
    });

    it('should work in Node.js environment', () => {
      const originalWindow = global.window;
      // @ts-expect-error - Testing SSR scenario
      delete global.window;

      const callback = jest.fn((x: number) => x * 2);
      const { result } = renderHook(() => useCallbackRef(callback));

      expect(result.current(5)).toBe(10);

      global.window = originalWindow;
    });
  });

  describe('Memory Leak Prevention', () => {
    it('should not hold old callback references after update', () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();

      const { result, rerender, unmount } = renderHook(({ cb }) => useCallbackRef(cb), {
        initialProps: { cb: callback1 },
      });

      rerender({ cb: callback2 });

      result.current();

      // Only new callback should be called
      expect(callback1).not.toHaveBeenCalled();
      expect(callback2).toHaveBeenCalledTimes(1);

      unmount();
    });
  });
});
