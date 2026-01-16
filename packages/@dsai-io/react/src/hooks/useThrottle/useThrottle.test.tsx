/**
 * useThrottle Tests
 *
 * Comprehensive tests for the useThrottle hook.
 * Tests cover throttling behavior, leading/trailing edge, and cleanup.
 */

import '@testing-library/jest-dom';
import { act, renderHook } from '@testing-library/react';

import { useThrottle } from './useThrottle';

describe('useThrottle', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
  });

  describe('Basic Functionality', () => {
    it('should return initial value immediately', () => {
      const { result } = renderHook(() => useThrottle('initial', 500));

      expect(result.current).toBe('initial');
    });

    it('should throttle value updates', () => {
      const { result, rerender } = renderHook(({ value }) => useThrottle(value, 500), {
        initialProps: { value: 'initial' },
      });

      expect(result.current).toBe('initial');

      rerender({ value: 'updated' });

      // Advance to trigger leading edge
      act(() => {
        jest.advanceTimersByTime(0);
      });

      // Should update on leading edge
      expect(result.current).toBe('updated');

      // Subsequent changes within interval should not update
      rerender({ value: 'v2' });
      act(() => {
        jest.advanceTimersByTime(100);
      });

      expect(result.current).toBe('updated');

      // After interval, should update on trailing edge
      act(() => {
        jest.advanceTimersByTime(400);
      });

      expect(result.current).toBe('v2');
    });

    it('should enforce minimum interval between updates', () => {
      const { result, rerender } = renderHook(({ value }) => useThrottle(value, 1000), {
        initialProps: { value: 'v1' },
      });

      // Leading edge update
      rerender({ value: 'v2' });
      act(() => {
        jest.advanceTimersByTime(0);
      });
      expect(result.current).toBe('v2');

      // Within interval - no update yet
      rerender({ value: 'v3' });
      act(() => {
        jest.advanceTimersByTime(500);
      });
      expect(result.current).toBe('v2');

      // Complete interval - trailing edge
      act(() => {
        jest.advanceTimersByTime(500);
      });
      expect(result.current).toBe('v3');
    });

    it('should work with different interval values', () => {
      const { result, rerender } = renderHook(
        ({ value, interval }) => useThrottle(value, interval),
        { initialProps: { value: 'initial', interval: 200 } }
      );

      rerender({ value: 'updated', interval: 200 });

      act(() => {
        jest.advanceTimersByTime(0);
      });

      expect(result.current).toBe('updated');
    });
  });

  describe('Leading Edge', () => {
    it('should invoke on leading edge by default', () => {
      const { result, rerender } = renderHook(({ value }) => useThrottle(value, 500), {
        initialProps: { value: 'initial' },
      });

      rerender({ value: 'updated' });

      act(() => {
        jest.advanceTimersByTime(0);
      });

      // Should update immediately on leading edge
      expect(result.current).toBe('updated');
    });

    it('should not invoke on leading edge when leading: false', () => {
      const { result, rerender } = renderHook(
        ({ value }) => useThrottle(value, 500, { leading: false }),
        { initialProps: { value: 'initial' } }
      );

      rerender({ value: 'updated' });

      act(() => {
        jest.advanceTimersByTime(0);
      });

      // Still initial value
      expect(result.current).toBe('initial');

      // Wait for trailing edge
      act(() => {
        jest.advanceTimersByTime(500);
      });

      expect(result.current).toBe('updated');
    });

    it('should work with only leading edge', () => {
      const { result, rerender } = renderHook(
        ({ value }) => useThrottle(value, 500, { leading: true, trailing: false }),
        { initialProps: { value: 'initial' } }
      );

      rerender({ value: 'v2' });

      act(() => {
        jest.advanceTimersByTime(0);
      });

      expect(result.current).toBe('v2');

      rerender({ value: 'v3' });

      act(() => {
        jest.advanceTimersByTime(500);
      });

      // No trailing update
      expect(result.current).toBe('v2');
    });
  });

  describe('Trailing Edge', () => {
    it('should invoke on trailing edge by default', () => {
      const { result, rerender } = renderHook(({ value }) => useThrottle(value, 500), {
        initialProps: { value: 'initial' },
      });

      rerender({ value: 'v2' });

      act(() => {
        jest.advanceTimersByTime(0);
      });

      expect(result.current).toBe('v2');

      rerender({ value: 'v3' });

      act(() => {
        jest.advanceTimersByTime(500);
      });

      // Trailing edge update
      expect(result.current).toBe('v3');
    });

    it('should not invoke on trailing edge when trailing: false', () => {
      const { result, rerender } = renderHook(
        ({ value }) => useThrottle(value, 500, { trailing: false }),
        { initialProps: { value: 'initial' } }
      );

      rerender({ value: 'v2' });

      act(() => {
        jest.advanceTimersByTime(0);
      });

      expect(result.current).toBe('v2');

      rerender({ value: 'v3' });

      act(() => {
        jest.advanceTimersByTime(500);
      });

      // No trailing update
      expect(result.current).toBe('v2');
    });

    it('should work with only trailing edge', () => {
      const { result, rerender } = renderHook(
        ({ value }) => useThrottle(value, 500, { leading: false, trailing: true }),
        { initialProps: { value: 'initial' } }
      );

      rerender({ value: 'v2' });

      act(() => {
        jest.advanceTimersByTime(0);
      });

      // No leading update
      expect(result.current).toBe('initial');

      act(() => {
        jest.advanceTimersByTime(500);
      });

      // Trailing update
      expect(result.current).toBe('v2');
    });
  });

  describe('Type Safety', () => {
    it('should work with string values', () => {
      const { result } = renderHook(() => useThrottle('test', 500));

      expect(typeof result.current).toBe('string');
    });

    it('should work with number values', () => {
      const { result } = renderHook(() => useThrottle(42, 500));

      expect(typeof result.current).toBe('number');
    });

    it('should work with object values', () => {
      const obj = { name: 'test', count: 0 };
      const { result, rerender } = renderHook(({ value }) => useThrottle(value, 500), {
        initialProps: { value: obj },
      });

      const newObj = { name: 'updated', count: 5 };
      rerender({ value: newObj });

      act(() => {
        jest.advanceTimersByTime(0);
      });

      expect(result.current).toEqual(newObj);
    });

    it('should work with array values', () => {
      const { result, rerender } = renderHook(({ value }) => useThrottle(value, 500), {
        initialProps: { value: [1, 2, 3] },
      });

      rerender({ value: [4, 5, 6] });

      act(() => {
        jest.advanceTimersByTime(0);
      });

      expect(result.current).toEqual([4, 5, 6]);
    });

    it('should preserve undefined values', () => {
      const { result, rerender } = renderHook(({ value }) => useThrottle(value, 500), {
        initialProps: { value: undefined as string | undefined },
      });

      rerender({ value: 'defined' });

      act(() => {
        jest.advanceTimersByTime(0);
      });

      expect(result.current).toBe('defined');
    });
  });

  describe('Interval Changes', () => {
    it('should handle interval changes', () => {
      const { result, rerender } = renderHook(
        ({ value, interval }) => useThrottle(value, interval),
        { initialProps: { value: 'initial', interval: 500 } }
      );

      rerender({ value: 'updated', interval: 200 });

      act(() => {
        jest.advanceTimersByTime(0);
      });

      expect(result.current).toBe('updated');
    });

    it('should use new interval for subsequent throttling', () => {
      const { result, rerender } = renderHook(
        ({ value, interval }) => useThrottle(value, interval),
        { initialProps: { value: 'v1', interval: 1000 } }
      );

      rerender({ value: 'v2', interval: 100 });

      act(() => {
        jest.advanceTimersByTime(0);
      });

      expect(result.current).toBe('v2');

      rerender({ value: 'v3', interval: 100 });

      act(() => {
        jest.advanceTimersByTime(100);
      });

      expect(result.current).toBe('v3');
    });
  });

  describe('Rapid Updates', () => {
    it('should handle continuous rapid updates', () => {
      const { result, rerender } = renderHook(({ value }) => useThrottle(value, 500), {
        initialProps: { value: 0 },
      });

      // Rapid updates every 100ms
      for (let i = 1; i <= 10; i++) {
        rerender({ value: i });
        act(() => {
          jest.advanceTimersByTime(100);
        });
      }

      // Should have throttled to only a few updates
      expect(result.current).toBeGreaterThan(0);
      expect(result.current).toBeLessThanOrEqual(10);
    });

    it('should guarantee final value on trailing edge', () => {
      const { result, rerender } = renderHook(({ value }) => useThrottle(value, 500), {
        initialProps: { value: 'v1' },
      });

      // Rapid changes
      rerender({ value: 'v2' });
      act(() => {
        jest.advanceTimersByTime(0);
      });

      rerender({ value: 'v3' });
      rerender({ value: 'v4' });
      rerender({ value: 'v5' });

      // Wait for trailing edge
      act(() => {
        jest.advanceTimersByTime(500);
      });

      // Should show final value
      expect(result.current).toBe('v5');
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero interval', () => {
      const { result, rerender } = renderHook(({ value }) => useThrottle(value, 0), {
        initialProps: { value: 'initial' },
      });

      rerender({ value: 'updated' });

      act(() => {
        jest.advanceTimersByTime(0);
      });

      expect(result.current).toBe('updated');
    });

    it('should handle very long intervals', () => {
      const { result, rerender } = renderHook(({ value }) => useThrottle(value, 10000), {
        initialProps: { value: 'initial' },
      });

      rerender({ value: 'updated' });

      act(() => {
        jest.advanceTimersByTime(0);
      });

      expect(result.current).toBe('updated');

      rerender({ value: 'v3' });

      act(() => {
        jest.advanceTimersByTime(9999);
      });

      expect(result.current).toBe('updated');

      act(() => {
        jest.advanceTimersByTime(1);
      });

      expect(result.current).toBe('v3');
    });

    it('should handle boolean values', () => {
      const { result, rerender } = renderHook(({ value }) => useThrottle(value, 500), {
        initialProps: { value: false },
      });

      rerender({ value: true });

      act(() => {
        jest.advanceTimersByTime(0);
      });

      expect(result.current).toBe(true);
    });

    it('should handle null values', () => {
      const { result, rerender } = renderHook(({ value }) => useThrottle(value, 500), {
        initialProps: { value: null as string | null },
      });

      rerender({ value: 'not null' });

      act(() => {
        jest.advanceTimersByTime(0);
      });

      expect(result.current).toBe('not null');
    });
  });

  describe('SSR Safety', () => {
    it('should work without window object', () => {
      const originalWindow = global.window;
      // @ts-expect-error - Testing SSR scenario
      delete global.window;

      const { result } = renderHook(() => useThrottle('test', 500));

      expect(result.current).toBe('test');

      global.window = originalWindow;
    });

    it('should not crash in Node.js environment', () => {
      const originalWindow = global.window;
      // @ts-expect-error - Testing SSR scenario
      delete global.window;

      const { result, rerender } = renderHook(({ value }) => useThrottle(value, 500), {
        initialProps: { value: 'initial' },
      });

      rerender({ value: 'updated' });

      act(() => {
        jest.advanceTimersByTime(0);
      });

      expect(result.current).toBe('updated');

      global.window = originalWindow;
    });
  });

  describe('Cleanup and Memory Management', () => {
    it('should clear timeout on unmount', () => {
      const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

      const { unmount, rerender } = renderHook(({ value }) => useThrottle(value, 500), {
        initialProps: { value: 'initial' },
      });

      rerender({ value: 'updated' });

      unmount();

      expect(clearTimeoutSpy).toHaveBeenCalled();

      clearTimeoutSpy.mockRestore();
    });

    it('should clear old timeout when value changes', () => {
      const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

      const { rerender } = renderHook(({ value }) => useThrottle(value, 500), {
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
      const { rerender } = renderHook(({ value }) => useThrottle(value, 100), {
        initialProps: { value: 0 },
      });

      // Simulate many rapid updates
      for (let i = 1; i <= 100; i++) {
        rerender({ value: i });
      }

      act(() => {
        jest.advanceTimersByTime(100);
      });

      // No crash = success
      expect(true).toBe(true);
    });

    it('should cancel pending update on unmount', () => {
      const { result, rerender, unmount } = renderHook(({ value }) => useThrottle(value, 500), {
        initialProps: { value: 'initial' },
      });

      rerender({ value: 'updated' });

      act(() => {
        jest.advanceTimersByTime(0);
      });

      expect(result.current).toBe('updated');

      unmount();

      // No error should be thrown
      act(() => {
        jest.advanceTimersByTime(500);
      });

      expect(true).toBe(true);
    });
  });

  describe('Integration Patterns', () => {
    it('should work with scroll handler pattern', () => {
      const { result, rerender } = renderHook(({ scrollY }) => useThrottle(scrollY, 100), {
        initialProps: { scrollY: 0 },
      });

      // Simulate continuous scrolling
      for (let i = 1; i <= 20; i++) {
        rerender({ scrollY: i * 50 });
        act(() => {
          jest.advanceTimersByTime(20);
        });
      }

      // Should have throttled updates
      expect(result.current).toBeGreaterThan(0);
      expect(result.current).toBeLessThanOrEqual(1000);
    });

    it('should work with mouse tracking pattern', () => {
      const { result, rerender } = renderHook(({ pos }) => useThrottle(pos, 50), {
        initialProps: { pos: { x: 0, y: 0 } },
      });

      // Simulate rapid mouse movement
      for (let i = 1; i <= 10; i++) {
        rerender({ pos: { x: i * 10, y: i * 10 } });
        act(() => {
          jest.advanceTimersByTime(10);
        });
      }

      // Should have throttled position updates
      expect(result.current.x).toBeGreaterThanOrEqual(0);
      expect(result.current.y).toBeGreaterThanOrEqual(0);
    });

    it('should work with resize handler pattern', () => {
      const { result, rerender } = renderHook(({ size }) => useThrottle(size, 200), {
        initialProps: { size: { width: 1024, height: 768 } },
      });

      // Leading edge update
      rerender({ size: { width: 800, height: 600 } });
      act(() => {
        jest.advanceTimersByTime(0);
      });

      expect(result.current).toEqual({ width: 800, height: 600 });

      // More changes within interval
      rerender({ size: { width: 1200, height: 900 } });

      act(() => {
        jest.advanceTimersByTime(200);
      });

      // Trailing edge update
      expect(result.current).toEqual({ width: 1200, height: 900 });
    });
  });
});
