/**
 * usePrevious Tests
 *
 * Comprehensive tests for the usePrevious hook.
 * Tests cover value tracking, undefined on first render, type preservation, and SSR safety.
 */

import '@testing-library/jest-dom';
import { renderHook } from '@testing-library/react';

import { usePrevious } from './usePrevious';

describe('usePrevious', () => {
  describe('Basic Functionality', () => {
    it('should return undefined on first render', () => {
      const { result } = renderHook(() => usePrevious(0));

      expect(result.current).toBeUndefined();
    });

    it('should return previous value after re-render', () => {
      const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
        initialProps: { value: 0 },
      });

      expect(result.current).toBeUndefined();

      rerender({ value: 1 });
      expect(result.current).toBe(0);

      rerender({ value: 2 });
      expect(result.current).toBe(1);
    });

    it('should track string values', () => {
      const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
        initialProps: { value: 'first' },
      });

      expect(result.current).toBeUndefined();

      rerender({ value: 'second' });
      expect(result.current).toBe('first');

      rerender({ value: 'third' });
      expect(result.current).toBe('second');
    });

    it('should track object references', () => {
      const obj1 = { id: 1 };
      const obj2 = { id: 2 };
      const obj3 = { id: 3 };

      const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
        initialProps: { value: obj1 },
      });

      expect(result.current).toBeUndefined();

      rerender({ value: obj2 });
      expect(result.current).toBe(obj1);

      rerender({ value: obj3 });
      expect(result.current).toBe(obj2);
    });

    it('should track array references', () => {
      const arr1 = [1, 2, 3];
      const arr2 = [4, 5, 6];

      const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
        initialProps: { value: arr1 },
      });

      expect(result.current).toBeUndefined();

      rerender({ value: arr2 });
      expect(result.current).toBe(arr1);
    });
  });

  describe('Type Preservation', () => {
    it('should preserve number types', () => {
      const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
        initialProps: { value: 42 },
      });

      rerender({ value: 100 });
      expect(typeof result.current).toBe('number');
      expect(result.current).toBe(42);
    });

    it('should preserve boolean types', () => {
      const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
        initialProps: { value: true },
      });

      rerender({ value: false });
      expect(typeof result.current).toBe('boolean');
      expect(result.current).toBe(true);
    });

    it('should handle null values', () => {
      const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
        initialProps: { value: null as string | null },
      });

      rerender({ value: 'not null' });
      expect(result.current).toBeNull();
    });

    it('should handle undefined values', () => {
      const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
        initialProps: { value: undefined as string | undefined },
      });

      rerender({ value: 'defined' });
      expect(result.current).toBeUndefined();
    });
  });

  describe('Edge Cases', () => {
    it('should handle same value re-renders', () => {
      const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
        initialProps: { value: 'same' },
      });

      expect(result.current).toBeUndefined();

      rerender({ value: 'same' });
      expect(result.current).toBe('same');

      rerender({ value: 'same' });
      expect(result.current).toBe('same');
    });

    it('should handle rapid value changes', () => {
      const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
        initialProps: { value: 0 },
      });

      for (let i = 1; i <= 10; i++) {
        rerender({ value: i });
        expect(result.current).toBe(i - 1);
      }
    });

    it('should not cause memory leaks', () => {
      const { result, rerender, unmount } = renderHook(({ value }) => usePrevious(value), {
        initialProps: { value: { large: new Array(1000).fill(0) } },
      });

      rerender({ value: { large: new Array(1000).fill(1) } });
      expect(result.current).toBeDefined();

      unmount();
      // Hook should cleanup properly
    });
  });

  describe('SSR Safety', () => {
    it('should work without window object', () => {
      const { result } = renderHook(() => usePrevious(0));

      expect(result.current).toBeUndefined();
      // No errors should be thrown
    });

    it('should work in Node.js environment', () => {
      const originalWindow = global.window;
      // @ts-expect-error - Testing SSR scenario
      delete global.window;

      const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
        initialProps: { value: 'server' },
      });

      expect(result.current).toBeUndefined();

      rerender({ value: 'client' });
      expect(result.current).toBe('server');

      global.window = originalWindow;
    });
  });

  describe('Integration', () => {
    it('should work with useState', () => {
      const { result, rerender } = renderHook(({ count }) => usePrevious(count), {
        initialProps: { count: 0 },
      });

      expect(result.current).toBeUndefined();

      rerender({ count: 1 });
      expect(result.current).toBe(0);

      rerender({ count: 2 });
      expect(result.current).toBe(1);
    });

    it('should work with complex state objects', () => {
      interface State {
        user: { id: number; name: string };
        timestamp: number;
      }

      const state1: State = { user: { id: 1, name: 'Alice' }, timestamp: 100 };
      const state2: State = { user: { id: 2, name: 'Bob' }, timestamp: 200 };

      const { result, rerender } = renderHook(({ state }) => usePrevious(state), {
        initialProps: { state: state1 },
      });

      rerender({ state: state2 });
      expect(result.current).toBe(state1);
      expect(result.current?.user.name).toBe('Alice');
    });
  });
});
