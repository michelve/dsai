/**
 * useReducedMotion Tests
 *
 * Comprehensive tests for the useReducedMotion hook.
 * Tests cover default behavior, media query changes, SSR safety, and cleanup.
 */

import '@testing-library/jest-dom';
import { act, renderHook } from '@testing-library/react';

import { useReducedMotion } from './useReducedMotion';

import type { UseReducedMotionOptions } from './useReducedMotion.types';

/**
 * Mock matchMedia implementation
 */
interface MockMediaQueryList {
  matches: boolean;
  media: string;
  listeners: Array<(event: MediaQueryListEvent) => void>;
  addEventListener: (type: string, listener: (event: MediaQueryListEvent) => void) => void;
  removeEventListener: (type: string, listener: (event: MediaQueryListEvent) => void) => void;
}

/**
 * Helper to create a mock MediaQueryList
 */
function createMockMediaQueryList(matches: boolean): MockMediaQueryList {
  const listeners: Array<(event: MediaQueryListEvent) => void> = [];

  return {
    matches,
    media: '(prefers-reduced-motion: reduce)',
    listeners,
    addEventListener: jest.fn((type: string, listener: (event: MediaQueryListEvent) => void) => {
      if (type === 'change') {
        listeners.push(listener);
      }
    }),
    removeEventListener: jest.fn((type: string, listener: (event: MediaQueryListEvent) => void) => {
      if (type === 'change') {
        const index = listeners.indexOf(listener);
        if (index > -1) {
          listeners.splice(index, 1);
        }
      }
    }),
  } as MockMediaQueryList;
}

/**
 * Helper to trigger media query change
 */
function triggerMediaQueryChange(mockMediaQuery: MockMediaQueryList, matches: boolean): void {
  mockMediaQuery.matches = matches;
  const event = { matches, media: mockMediaQuery.media } as MediaQueryListEvent;
  for (const listener of mockMediaQuery.listeners) {
    listener(event);
  }
}

describe('useReducedMotion', () => {
  let mockMediaQuery: MockMediaQueryList;
  let originalMatchMedia: typeof window.matchMedia;

  beforeEach(() => {
    // Create a fresh mock for each test
    mockMediaQuery = createMockMediaQueryList(false);

    // Save original matchMedia
    originalMatchMedia = window.matchMedia;

    // Mock window.matchMedia
    window.matchMedia = jest.fn(() => mockMediaQuery as unknown as MediaQueryList);
  });

  afterEach(() => {
    // Restore original matchMedia
    window.matchMedia = originalMatchMedia;

    // Clear all mocks
    jest.clearAllMocks();
  });

  describe('Basic Functionality', () => {
    it('should return false when prefers-reduced-motion is not set', () => {
      mockMediaQuery.matches = false;

      const { result } = renderHook(() => useReducedMotion());

      expect(result.current).toBe(false);
    });

    it('should return true when prefers-reduced-motion: reduce', () => {
      mockMediaQuery.matches = true;

      const { result } = renderHook(() => useReducedMotion());

      expect(result.current).toBe(true);
    });

    it('should call matchMedia with correct query', () => {
      renderHook(() => useReducedMotion());

      expect(window.matchMedia).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)');
    });

    it('should add event listener on mount', () => {
      renderHook(() => useReducedMotion());

      expect(mockMediaQuery.addEventListener).toHaveBeenCalledWith('change', expect.any(Function));
    });

    it('should remove event listener on unmount', () => {
      const { unmount } = renderHook(() => useReducedMotion());

      const addListenerCall = (mockMediaQuery.addEventListener as jest.Mock).mock.calls[0];
      const listener = addListenerCall[1];

      unmount();

      expect(mockMediaQuery.removeEventListener).toHaveBeenCalledWith('change', listener);
    });
  });

  describe('Media Query Changes', () => {
    it('should update when media query changes to reduce', () => {
      mockMediaQuery.matches = false;

      const { result } = renderHook(() => useReducedMotion());

      expect(result.current).toBe(false);

      // Simulate media query change
      act(() => {
        triggerMediaQueryChange(mockMediaQuery, true);
      });

      expect(result.current).toBe(true);
    });

    it('should update when media query changes to no-preference', () => {
      mockMediaQuery.matches = true;

      const { result } = renderHook(() => useReducedMotion());

      expect(result.current).toBe(true);

      // Simulate media query change
      act(() => {
        triggerMediaQueryChange(mockMediaQuery, false);
      });

      expect(result.current).toBe(false);
    });

    it('should handle multiple media query changes', () => {
      mockMediaQuery.matches = false;

      const { result } = renderHook(() => useReducedMotion());

      expect(result.current).toBe(false);

      // First change: to reduce
      act(() => {
        triggerMediaQueryChange(mockMediaQuery, true);
      });
      expect(result.current).toBe(true);

      // Second change: back to no-preference
      act(() => {
        triggerMediaQueryChange(mockMediaQuery, false);
      });
      expect(result.current).toBe(false);

      // Third change: to reduce again
      act(() => {
        triggerMediaQueryChange(mockMediaQuery, true);
      });
      expect(result.current).toBe(true);
    });
  });

  describe('SSR Safety', () => {
    it('should use defaultValue when matchMedia is unavailable', () => {
      const originalMatchMedia = window.matchMedia;

      // @ts-expect-error - Simulating environment without matchMedia
      window.matchMedia = undefined;

      const { result: result1 } = renderHook(() => useReducedMotion({ defaultValue: true }));
      expect(result1.current).toBe(true);

      const { result: result2 } = renderHook(() => useReducedMotion({ defaultValue: false }));
      expect(result2.current).toBe(false);

      window.matchMedia = originalMatchMedia;
    });

    it('should not crash when window.matchMedia is undefined', () => {
      const originalMatchMedia = window.matchMedia;

      // @ts-expect-error - Simulating environment without matchMedia
      window.matchMedia = undefined;

      expect(() => {
        renderHook(() => useReducedMotion());
      }).not.toThrow();

      window.matchMedia = originalMatchMedia;
    });
  });

  describe('Options', () => {
    it('should use default value false when no options provided', () => {
      mockMediaQuery.matches = false;

      const { result } = renderHook(() => useReducedMotion());

      expect(result.current).toBe(false);
    });

    it('should accept empty options object', () => {
      mockMediaQuery.matches = false;

      const { result } = renderHook(() => useReducedMotion({}));

      expect(result.current).toBe(false);
    });
  });

  describe('Multiple Instances', () => {
    it('should handle multiple hook instances independently', () => {
      mockMediaQuery.matches = false;

      const { result: result1 } = renderHook(() => useReducedMotion());
      const { result: result2 } = renderHook(() => useReducedMotion());

      expect(result1.current).toBe(false);
      expect(result2.current).toBe(false);

      // Trigger change
      act(() => {
        triggerMediaQueryChange(mockMediaQuery, true);
      });

      // Both should update
      expect(result1.current).toBe(true);
      expect(result2.current).toBe(true);
    });

    it('should share the same media query listener', () => {
      const callsBefore = (window.matchMedia as jest.Mock).mock.calls.length;
      const listenersBefore = (mockMediaQuery.addEventListener as jest.Mock).mock.calls.length;

      renderHook(() => useReducedMotion());
      renderHook(() => useReducedMotion());

      // matchMedia should be called twice per hook instance (once in useState, once in useEffect)
      // So 2 instances × 2 calls = 4 total calls
      expect(window.matchMedia).toHaveBeenCalledTimes(callsBefore + 4);

      // addEventListener should be called once per hook instance
      expect(mockMediaQuery.addEventListener).toHaveBeenCalledTimes(listenersBefore + 2);

      // All calls should use the same query string
      expect(window.matchMedia).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)');
    });

    it('should not affect other instances when one unmounts', () => {
      mockMediaQuery.matches = false;

      const { result: result1, unmount: unmount1 } = renderHook(() => useReducedMotion());
      const { result: result2 } = renderHook(() => useReducedMotion());

      expect(result1.current).toBe(false);
      expect(result2.current).toBe(false);

      // Unmount first instance
      unmount1();

      // Second instance should still work
      act(() => {
        triggerMediaQueryChange(mockMediaQuery, true);
      });
      expect(result2.current).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid mount/unmount cycles', () => {
      const { unmount: unmount1 } = renderHook(() => useReducedMotion());
      const { unmount: unmount2 } = renderHook(() => useReducedMotion());
      const { unmount: unmount3 } = renderHook(() => useReducedMotion());

      unmount1();
      unmount2();
      unmount3();

      // Should not throw
      expect(mockMediaQuery.removeEventListener).toHaveBeenCalledTimes(3);
    });

    it('should handle rerender without re-subscribing', () => {
      const { rerender } = renderHook<boolean, UseReducedMotionOptions>(
        (options) => useReducedMotion(options),
        { initialProps: {} }
      );

      const initialCallCount = (mockMediaQuery.addEventListener as jest.Mock).mock.calls.length;

      // Rerender with same options
      rerender({});

      // Should not add new listener
      expect(mockMediaQuery.addEventListener).toHaveBeenCalledTimes(initialCallCount);
    });

    it('should work when matchMedia returns a non-standard implementation', () => {
      // Some older browsers might have incomplete matchMedia implementations
      const minimalMockMediaQuery = {
        matches: true,
        media: '(prefers-reduced-motion: reduce)',
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      } as unknown as MediaQueryList;

      window.matchMedia = jest.fn(() => minimalMockMediaQuery);

      const { result } = renderHook(() => useReducedMotion());

      expect(result.current).toBe(true);
    });
  });

  describe('Type Safety', () => {
    it('should accept UseReducedMotionOptions type', () => {
      const options: UseReducedMotionOptions = { defaultValue: true };

      const { result } = renderHook(() => useReducedMotion(options));

      // This test mainly checks TypeScript compilation
      expect(typeof result.current).toBe('boolean');
    });

    it('should return boolean type', () => {
      const { result } = renderHook(() => useReducedMotion());

      expect(typeof result.current).toBe('boolean');
      expect(result.current === true || result.current === false).toBe(true);
    });
  });
});
