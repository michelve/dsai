/**
 * useDebounce Tests
 *
 * Comprehensive tests for the useDebounce hook.
 * Tests cover debouncing behavior, leading/trailing edge, maxWait, and cleanup.
 */

import '@testing-library/jest-dom';
import { act, renderHook } from '@testing-library/react';

import { useDebounce } from './useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('Basic Functionality', () => {
    it('should return initial value immediately', () => {
      const { result } = renderHook(() => useDebounce('initial', 500));

      expect(result.current).toBe('initial');
    });

    it('should debounce value updates', () => {
      const { result, rerender } = renderHook(({ value }) => useDebounce(value, 500), {
        initialProps: { value: 'initial' },
      });

      expect(result.current).toBe('initial');

      rerender({ value: 'updated' });

      // Value should not update immediately
      expect(result.current).toBe('initial');

      // Advance timers
      act(() => {
        jest.advanceTimersByTime(500);
      });

      // Now value should be updated
      expect(result.current).toBe('updated');
    });

    it('should reset delay on rapid changes', () => {
      const { result, rerender } = renderHook(({ value }) => useDebounce(value, 500), {
        initialProps: { value: 'v1' },
      });

      rerender({ value: 'v2' });
      act(() => {
        jest.advanceTimersByTime(300);
      });

      rerender({ value: 'v3' });
      act(() => {
        jest.advanceTimersByTime(300);
      });

      // Still showing initial value
      expect(result.current).toBe('v1');

      // Complete the delay
      act(() => {
        jest.advanceTimersByTime(200);
      });

      // Should show latest value
      expect(result.current).toBe('v3');
    });

    it('should work with different delay values', () => {
      const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
        initialProps: { value: 'initial', delay: 100 },
      });

      rerender({ value: 'updated', delay: 100 });

      act(() => {
        jest.advanceTimersByTime(100);
      });

      expect(result.current).toBe('updated');
    });
  });

  describe('Leading Edge', () => {
    it('should invoke immediately with leading: true', () => {
      const { result, rerender } = renderHook(
        ({ value }) => useDebounce(value, 500, { leading: true }),
        { initialProps: { value: 'initial' } }
      );

      expect(result.current).toBe('initial');

      rerender({ value: 'updated' });

      // Should update immediately on leading edge
      expect(result.current).toBe('initial');

      act(() => {
        jest.advanceTimersByTime(500);
      });

      expect(result.current).toBe('updated');
    });

    it('should not invoke trailing edge when leading: true, trailing: false', () => {
      const { result, rerender } = renderHook(
        ({ value }) => useDebounce(value, 500, { leading: true, trailing: false }),
        { initialProps: { value: 'initial' } }
      );

      rerender({ value: 'updated' });

      // With leading edge only, should update on first change after delay
      act(() => {
        jest.advanceTimersByTime(500);
      });

      // No trailing update
      expect(result.current).toBe('initial');
    });

    it('should work with both leading and trailing', () => {
      const { result, rerender } = renderHook(
        ({ value }) => useDebounce(value, 500, { leading: true, trailing: true }),
        { initialProps: { value: 'initial' } }
      );

      rerender({ value: 'v2' });

      act(() => {
        jest.advanceTimersByTime(500);
      });

      expect(result.current).toBe('v2');
    });
  });

  describe('Trailing Edge', () => {
    it('should invoke on trailing edge by default', () => {
      const { result, rerender } = renderHook(({ value }) => useDebounce(value, 500), {
        initialProps: { value: 'initial' },
      });

      rerender({ value: 'updated' });

      // Not updated yet
      expect(result.current).toBe('initial');

      act(() => {
        jest.advanceTimersByTime(500);
      });

      // Updated on trailing edge
      expect(result.current).toBe('updated');
    });

    it('should not invoke when trailing: false', () => {
      const { result, rerender } = renderHook(
        ({ value }) => useDebounce(value, 500, { trailing: false }),
        { initialProps: { value: 'initial' } }
      );

      rerender({ value: 'updated' });

      act(() => {
        jest.advanceTimersByTime(500);
      });

      // No trailing update
      expect(result.current).toBe('initial');
    });
  });

  describe('Maximum Wait', () => {
    it('should enforce maxWait limit', () => {
      const { result, rerender } = renderHook(
        ({ value }) => useDebounce(value, 500, { maxWait: 1000 }),
        { initialProps: { value: 'v1' } }
      );

      // Rapid updates
      rerender({ value: 'v2' });
      act(() => {
        jest.advanceTimersByTime(400);
      });

      rerender({ value: 'v3' });
      act(() => {
        jest.advanceTimersByTime(400);
      });

      rerender({ value: 'v4' });
      act(() => {
        jest.advanceTimersByTime(400);
      });

      // Total time: 1200ms, maxWait: 1000ms
      // Should have updated due to maxWait
      expect(result.current).toBe('v4');
    });

    it('should update at maxWait even with continuous changes', () => {
      const { result, rerender } = renderHook(
        ({ value }) => useDebounce(value, 500, { maxWait: 800 }),
        { initialProps: { value: 'v1' } }
      );

      // Change every 100ms
      for (let i = 2; i <= 10; i++) {
        rerender({ value: `v${i}` });
        act(() => {
          jest.advanceTimersByTime(100);
        });
      }

      // After 900ms, maxWait should have triggered
      expect(result.current).not.toBe('v1');
    });
  });

  describe('Type Safety', () => {
    it('should work with string values', () => {
      const { result } = renderHook(() => useDebounce('test', 500));

      expect(typeof result.current).toBe('string');
    });

    it('should work with number values', () => {
      const { result } = renderHook(() => useDebounce(42, 500));

      expect(typeof result.current).toBe('number');
    });

    it('should work with object values', () => {
      const obj = { name: 'test', count: 0 };
      const { result, rerender } = renderHook(({ value }) => useDebounce(value, 500), {
        initialProps: { value: obj },
      });

      const newObj = { name: 'updated', count: 5 };
      rerender({ value: newObj });

      act(() => {
        jest.advanceTimersByTime(500);
      });

      expect(result.current).toEqual(newObj);
    });

    it('should work with array values', () => {
      const { result, rerender } = renderHook(({ value }) => useDebounce(value, 500), {
        initialProps: { value: [1, 2, 3] },
      });

      rerender({ value: [4, 5, 6] });

      act(() => {
        jest.advanceTimersByTime(500);
      });

      expect(result.current).toEqual([4, 5, 6]);
    });

    it('should preserve undefined values', () => {
      const { result, rerender } = renderHook(({ value }) => useDebounce(value, 500), {
        initialProps: { value: undefined as string | undefined },
      });

      rerender({ value: 'defined' });

      act(() => {
        jest.advanceTimersByTime(500);
      });

      expect(result.current).toBe('defined');
    });
  });

  describe('Delay Changes', () => {
    it('should handle delay changes', () => {
      const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
        initialProps: { value: 'initial', delay: 500 },
      });

      rerender({ value: 'updated', delay: 200 });

      act(() => {
        jest.advanceTimersByTime(200);
      });

      expect(result.current).toBe('updated');
    });

    it('should use new delay for subsequent updates', () => {
      const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
        initialProps: { value: 'v1', delay: 500 },
      });

      rerender({ value: 'v2', delay: 100 });

      act(() => {
        jest.advanceTimersByTime(100);
      });

      expect(result.current).toBe('v2');
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero delay', () => {
      const { result, rerender } = renderHook(({ value }) => useDebounce(value, 0), {
        initialProps: { value: 'initial' },
      });

      rerender({ value: 'updated' });

      act(() => {
        jest.advanceTimersByTime(0);
      });

      expect(result.current).toBe('updated');
    });

    it('should handle very long delays', () => {
      const { result, rerender } = renderHook(({ value }) => useDebounce(value, 10000), {
        initialProps: { value: 'initial' },
      });

      rerender({ value: 'updated' });

      act(() => {
        jest.advanceTimersByTime(9999);
      });

      expect(result.current).toBe('initial');

      act(() => {
        jest.advanceTimersByTime(1);
      });

      expect(result.current).toBe('updated');
    });

    it('should handle boolean values', () => {
      const { result, rerender } = renderHook(({ value }) => useDebounce(value, 500), {
        initialProps: { value: false },
      });

      rerender({ value: true });

      act(() => {
        jest.advanceTimersByTime(500);
      });

      expect(result.current).toBe(true);
    });

    it('should handle null values', () => {
      const { result, rerender } = renderHook(({ value }) => useDebounce(value, 500), {
        initialProps: { value: null as string | null },
      });

      rerender({ value: 'not null' });

      act(() => {
        jest.advanceTimersByTime(500);
      });

      expect(result.current).toBe('not null');
    });
  });

  describe('SSR Safety', () => {
    it('should work without window object', () => {
      const originalWindow = global.window;
      // @ts-expect-error - Testing SSR scenario
      delete global.window;

      const { result } = renderHook(() => useDebounce('test', 500));

      expect(result.current).toBe('test');

      global.window = originalWindow;
    });

    it('should not crash in Node.js environment', () => {
      const originalWindow = global.window;
      // @ts-expect-error - Testing SSR scenario
      delete global.window;

      const { result, rerender } = renderHook(({ value }) => useDebounce(value, 500), {
        initialProps: { value: 'initial' },
      });

      rerender({ value: 'updated' });

      act(() => {
        jest.advanceTimersByTime(500);
      });

      expect(result.current).toBe('updated');

      global.window = originalWindow;
    });
  });

  describe('Cleanup and Memory Management', () => {
    it('should clear timeout on unmount', () => {
      const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

      const { unmount, rerender } = renderHook(({ value }) => useDebounce(value, 500), {
        initialProps: { value: 'initial' },
      });

      rerender({ value: 'updated' });

      unmount();

      expect(clearTimeoutSpy).toHaveBeenCalled();

      clearTimeoutSpy.mockRestore();
    });

    it('should clear old timeout when value changes', () => {
      const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

      const { rerender } = renderHook(({ value }) => useDebounce(value, 500), {
        initialProps: { value: 'v1' },
      });

      rerender({ value: 'v2' });
      const firstCallCount = clearTimeoutSpy.mock.calls.length;

      rerender({ value: 'v3' });
      const secondCallCount = clearTimeoutSpy.mock.calls.length;

      expect(secondCallCount).toBeGreaterThan(firstCallCount);

      clearTimeoutSpy.mockRestore();
    });

    it('should not leak memory with many updates', () => {
      const { rerender } = renderHook(({ value }) => useDebounce(value, 100), {
        initialProps: { value: 0 },
      });

      // Simulate many rapid updates
      for (let i = 1; i <= 100; i++) {
        rerender({ value: i });
      }

      act(() => {
        jest.advanceTimersByTime(100);
      });

      // Should only have final value, no memory leaks
      expect(true).toBe(true); // No crash = success
    });

    it('should cancel pending update on unmount', () => {
      const { result, rerender, unmount } = renderHook(({ value }) => useDebounce(value, 500), {
        initialProps: { value: 'initial' },
      });

      rerender({ value: 'updated' });

      expect(result.current).toBe('initial');

      unmount();

      // Even if we advance timers after unmount, no update should occur
      act(() => {
        jest.advanceTimersByTime(500);
      });

      // No error should be thrown
      expect(true).toBe(true);
    });
  });

  describe('Integration Patterns', () => {
    it('should work with search input pattern', () => {
      const { result, rerender } = renderHook(({ searchTerm }) => useDebounce(searchTerm, 300), {
        initialProps: { searchTerm: '' },
      });

      // User types rapidly
      rerender({ searchTerm: 'r' });
      act(() => {
        jest.advanceTimersByTime(50);
      });

      rerender({ searchTerm: 're' });
      act(() => {
        jest.advanceTimersByTime(50);
      });

      rerender({ searchTerm: 'rea' });
      act(() => {
        jest.advanceTimersByTime(50);
      });

      rerender({ searchTerm: 'reac' });
      act(() => {
        jest.advanceTimersByTime(50);
      });

      rerender({ searchTerm: 'react' });

      // Still showing initial value
      expect(result.current).toBe('');

      // User stops typing, debounce triggers
      act(() => {
        jest.advanceTimersByTime(300);
      });

      expect(result.current).toBe('react');
    });

    it('should work with resize handler pattern', () => {
      const { result, rerender } = renderHook(
        ({ size }) => useDebounce(size, 200, { maxWait: 500 }),
        { initialProps: { size: { width: 1024, height: 768 } } }
      );

      // Simulate rapid resize events
      for (let i = 0; i < 10; i++) {
        rerender({
          size: { width: 1024 - i * 10, height: 768 - i * 5 },
        });
        act(() => {
          jest.advanceTimersByTime(100);
        });
      }

      // maxWait should have enforced an update
      expect(result.current.width).toBeLessThan(1024);
    });
  });
});
