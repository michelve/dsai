/**
 * useHover Tests
 *
 * Comprehensive tests for the useHover hook.
 * Tests cover mouse events, delays, callbacks, and cleanup.
 */

import '@testing-library/jest-dom';
import { act, renderHook } from '@testing-library/react';

import { useHover } from './useHover';

describe('useHover', () => {
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
    it('should return ref and isHovered state', () => {
      const { result } = renderHook(() => useHover());

      expect(result.current).toHaveLength(2);
      expect(result.current[0]).toHaveProperty('current');
      expect(typeof result.current[1]).toBe('boolean');
    });

    it('should start with isHovered as false', () => {
      const { result } = renderHook(() => useHover());

      const [, isHovered] = result.current;

      expect(isHovered).toBe(false);
    });

    it('should set isHovered to true on mouseenter', () => {
      const { result } = renderHook(() => useHover<HTMLDivElement>());

      const element = document.createElement('div');
      act(() => {
        result.current[0].current = element;
      });

      const { result: result2 } = renderHook(() => useHover<HTMLDivElement>());
      result2.current[0].current = element;

      act(() => {
        element.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      });

      expect(result2.current[1]).toBe(true);
    });

    it('should set isHovered to false on mouseleave', () => {
      const { result } = renderHook(() => useHover<HTMLDivElement>());

      const element = document.createElement('div');
      act(() => {
        result.current[0].current = element;
      });

      const { result: result2 } = renderHook(() => useHover<HTMLDivElement>());
      result2.current[0].current = element;

      act(() => {
        element.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      });

      expect(result2.current[1]).toBe(true);

      act(() => {
        element.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
      });

      expect(result2.current[1]).toBe(false);
    });
  });

  describe('Delay Enter', () => {
    it('should delay setting isHovered to true', () => {
      const { result } = renderHook(() => useHover<HTMLDivElement>({ delayEnter: 500 }));

      const element = document.createElement('div');
      result.current[0].current = element;

      const { result: result2 } = renderHook(() => useHover<HTMLDivElement>({ delayEnter: 500 }));
      result2.current[0].current = element;

      act(() => {
        element.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      });

      expect(result2.current[1]).toBe(false);

      act(() => {
        jest.advanceTimersByTime(500);
      });

      expect(result2.current[1]).toBe(true);
    });

    it('should support deprecated mouseEnterDelayMS option', () => {
      const { result } = renderHook(() => useHover<HTMLDivElement>({ mouseEnterDelayMS: 300 }));

      const element = document.createElement('div');
      result.current[0].current = element;

      const { result: result2 } = renderHook(() =>
        useHover<HTMLDivElement>({ mouseEnterDelayMS: 300 })
      );
      result2.current[0].current = element;

      act(() => {
        element.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      });

      expect(result2.current[1]).toBe(false);

      act(() => {
        jest.advanceTimersByTime(300);
      });

      expect(result2.current[1]).toBe(true);
    });

    it('should cancel enter delay on mouseleave', () => {
      const { result } = renderHook(() => useHover<HTMLDivElement>({ delayEnter: 500 }));

      const element = document.createElement('div');
      result.current[0].current = element;

      const { result: result2 } = renderHook(() => useHover<HTMLDivElement>({ delayEnter: 500 }));
      result2.current[0].current = element;

      act(() => {
        element.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      });

      act(() => {
        jest.advanceTimersByTime(200);
      });

      act(() => {
        element.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
      });

      act(() => {
        jest.advanceTimersByTime(300);
      });

      expect(result2.current[1]).toBe(false);
    });
  });

  describe('Delay Leave', () => {
    it('should delay setting isHovered to false', () => {
      const { result } = renderHook(() => useHover<HTMLDivElement>({ delayLeave: 500 }));

      const element = document.createElement('div');
      result.current[0].current = element;

      const { result: result2 } = renderHook(() => useHover<HTMLDivElement>({ delayLeave: 500 }));
      result2.current[0].current = element;

      act(() => {
        element.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      });

      expect(result2.current[1]).toBe(true);

      act(() => {
        element.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
      });

      expect(result2.current[1]).toBe(true);

      act(() => {
        jest.advanceTimersByTime(500);
      });

      expect(result2.current[1]).toBe(false);
    });

    it('should support deprecated mouseLeaveDelayMS option', () => {
      const { result } = renderHook(() => useHover<HTMLDivElement>({ mouseLeaveDelayMS: 300 }));

      const element = document.createElement('div');
      result.current[0].current = element;

      const { result: result2 } = renderHook(() =>
        useHover<HTMLDivElement>({ mouseLeaveDelayMS: 300 })
      );
      result2.current[0].current = element;

      act(() => {
        element.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      });

      act(() => {
        element.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
      });

      expect(result2.current[1]).toBe(true);

      act(() => {
        jest.advanceTimersByTime(300);
      });

      expect(result2.current[1]).toBe(false);
    });

    it('should cancel leave delay on mouseenter', () => {
      const { result } = renderHook(() => useHover<HTMLDivElement>({ delayLeave: 500 }));

      const element = document.createElement('div');
      result.current[0].current = element;

      const { result: result2 } = renderHook(() => useHover<HTMLDivElement>({ delayLeave: 500 }));
      result2.current[0].current = element;

      act(() => {
        element.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      });

      act(() => {
        element.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
      });

      act(() => {
        jest.advanceTimersByTime(200);
      });

      act(() => {
        element.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      });

      act(() => {
        jest.advanceTimersByTime(300);
      });

      expect(result2.current[1]).toBe(true);
    });
  });

  describe('Hover Change Callback', () => {
    it('should call onHoverChange when hover state changes', () => {
      const onHoverChange = jest.fn();
      const { result } = renderHook(() => useHover<HTMLDivElement>({ onHoverChange }));

      const element = document.createElement('div');
      result.current[0].current = element;

      const { result: result2 } = renderHook(() => useHover<HTMLDivElement>({ onHoverChange }));
      result2.current[0].current = element;

      act(() => {
        element.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      });

      expect(onHoverChange).toHaveBeenCalledWith(true);

      act(() => {
        element.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
      });

      expect(onHoverChange).toHaveBeenCalledWith(false);
    });

    it('should call onHoverChange after delay', () => {
      const onHoverChange = jest.fn();
      const { result } = renderHook(() =>
        useHover<HTMLDivElement>({ delayEnter: 300, onHoverChange })
      );

      const element = document.createElement('div');
      result.current[0].current = element;

      const { result: result2 } = renderHook(() =>
        useHover<HTMLDivElement>({ delayEnter: 300, onHoverChange })
      );
      result2.current[0].current = element;

      act(() => {
        element.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      });

      expect(onHoverChange).not.toHaveBeenCalled();

      act(() => {
        jest.advanceTimersByTime(300);
      });

      expect(onHoverChange).toHaveBeenCalledWith(true);
    });
  });

  describe('SSR Safety', () => {
    it('should not crash without window object', () => {
      const originalWindow = global.window;
      // @ts-expect-error - Testing SSR scenario
      delete global.window;

      const { result } = renderHook(() => useHover());

      expect(result.current[1]).toBe(false);

      global.window = originalWindow;
    });

    it('should handle null ref in SSR', () => {
      const originalWindow = global.window;
      // @ts-expect-error - Testing SSR scenario
      delete global.window;

      const { result } = renderHook(() => useHover<HTMLDivElement>());

      expect(result.current[0].current).toBeNull();

      global.window = originalWindow;
    });
  });

  describe('Cleanup', () => {
    it('should remove event listeners on unmount', () => {
      const { result, unmount } = renderHook(() => useHover<HTMLDivElement>());

      const element = document.createElement('div');
      const removeEventListenerSpy = jest.spyOn(element, 'removeEventListener');

      result.current[0].current = element;

      const { result: result2, unmount: unmount2 } = renderHook(() => useHover<HTMLDivElement>());
      result2.current[0].current = element;

      unmount2();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('mouseenter', expect.any(Function));
      expect(removeEventListenerSpy).toHaveBeenCalledWith('mouseleave', expect.any(Function));

      removeEventListenerSpy.mockRestore();
      unmount();
    });

    it('should clear pending timeouts on unmount', () => {
      const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

      const { result, unmount } = renderHook(() => useHover<HTMLDivElement>({ delayEnter: 500 }));

      const element = document.createElement('div');
      result.current[0].current = element;

      const { result: result2, unmount: unmount2 } = renderHook(() =>
        useHover<HTMLDivElement>({ delayEnter: 500 })
      );
      result2.current[0].current = element;

      act(() => {
        element.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      });

      unmount2();

      expect(clearTimeoutSpy).toHaveBeenCalled();

      clearTimeoutSpy.mockRestore();
      unmount();
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero delays', () => {
      const { result } = renderHook(() =>
        useHover<HTMLDivElement>({ delayEnter: 0, delayLeave: 0 })
      );

      const element = document.createElement('div');
      result.current[0].current = element;

      const { result: result2 } = renderHook(() =>
        useHover<HTMLDivElement>({ delayEnter: 0, delayLeave: 0 })
      );
      result2.current[0].current = element;

      act(() => {
        element.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      });

      expect(result2.current[1]).toBe(true);

      act(() => {
        element.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
      });

      expect(result2.current[1]).toBe(false);
    });

    it('should handle rapid hover events', () => {
      const { result } = renderHook(() =>
        useHover<HTMLDivElement>({ delayEnter: 100, delayLeave: 100 })
      );

      const element = document.createElement('div');
      result.current[0].current = element;

      const { result: result2 } = renderHook(() =>
        useHover<HTMLDivElement>({ delayEnter: 100, delayLeave: 100 })
      );
      result2.current[0].current = element;

      act(() => {
        element.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
        element.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
        element.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      });

      act(() => {
        jest.advanceTimersByTime(100);
      });

      expect(result2.current[1]).toBe(true);
    });

    it('should handle null ref', () => {
      const { result } = renderHook(() => useHover<HTMLDivElement>());

      expect(result.current[0].current).toBeNull();
      expect(result.current[1]).toBe(false);
    });
  });

  describe('Type Safety', () => {
    it('should work with HTMLDivElement', () => {
      const { result } = renderHook(() => useHover<HTMLDivElement>());

      const element = document.createElement('div');
      result.current[0].current = element;

      expect(result.current[0].current).toBeInstanceOf(HTMLDivElement);
    });

    it('should work with HTMLButtonElement', () => {
      const { result } = renderHook(() => useHover<HTMLButtonElement>());

      const element = document.createElement('button');
      result.current[0].current = element;

      expect(result.current[0].current).toBeInstanceOf(HTMLButtonElement);
    });
  });
});
