/**
 * useTouchInteraction Coverage Tests
 *
 * Tests touch event branches: enabled/disabled, long-press,
 * auto-hide, scroll cancellation, early release.
 */

import { act, renderHook } from '@testing-library/react';

import { useTouchInteraction } from './useTouchInteraction';

jest.useFakeTimers();

function createTouchEvent(clientX: number, clientY: number): React.TouchEvent {
  return {
    touches: [{ clientX, clientY }],
    changedTouches: [{ clientX, clientY }],
    preventDefault: jest.fn(),
    stopPropagation: jest.fn(),
  } as unknown as React.TouchEvent;
}

function createEmptyTouchEvent(): React.TouchEvent {
  return {
    touches: [],
    changedTouches: [],
    preventDefault: jest.fn(),
    stopPropagation: jest.fn(),
  } as unknown as React.TouchEvent;
}

describe('useTouchInteraction', () => {
  afterEach(() => {
    jest.clearAllTimers();
  });

  describe('When disabled', () => {
    it('onTouchStart does nothing when not enabled', () => {
      const onOpen = jest.fn();
      const onClose = jest.fn();
      const { result } = renderHook(() =>
        useTouchInteraction({ enabled: false, onOpen, onClose })
      );

      act(() => {
        result.current.onTouchStart(createTouchEvent(100, 100));
      });

      jest.advanceTimersByTime(1000);
      expect(onOpen).not.toHaveBeenCalled();
    });
  });

  describe('When enabled', () => {
    it('opens after long-press (700ms)', () => {
      const onOpen = jest.fn();
      const onClose = jest.fn();
      const { result } = renderHook(() =>
        useTouchInteraction({ enabled: true, onOpen, onClose })
      );

      act(() => {
        result.current.onTouchStart(createTouchEvent(100, 100));
      });

      expect(onOpen).not.toHaveBeenCalled();

      act(() => {
        jest.advanceTimersByTime(700);
      });

      expect(onOpen).toHaveBeenCalledTimes(1);
    });

    it('auto-hides after 1500ms', () => {
      const onOpen = jest.fn();
      const onClose = jest.fn();
      const { result } = renderHook(() =>
        useTouchInteraction({ enabled: true, onOpen, onClose })
      );

      act(() => {
        result.current.onTouchStart(createTouchEvent(100, 100));
      });

      act(() => {
        jest.advanceTimersByTime(700); // open
      });

      expect(onOpen).toHaveBeenCalledTimes(1);
      expect(onClose).not.toHaveBeenCalled();

      act(() => {
        jest.advanceTimersByTime(1500); // auto-hide
      });

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('cancels on early touch end (before long-press)', () => {
      const onOpen = jest.fn();
      const onClose = jest.fn();
      const { result } = renderHook(() =>
        useTouchInteraction({ enabled: true, onOpen, onClose })
      );

      act(() => {
        result.current.onTouchStart(createTouchEvent(100, 100));
      });

      act(() => {
        jest.advanceTimersByTime(300); // not yet 700ms
      });

      act(() => {
        result.current.onTouchEnd();
      });

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(onOpen).not.toHaveBeenCalled();
    });

    it('cancels on scroll movement beyond threshold (>10px)', () => {
      const onOpen = jest.fn();
      const onClose = jest.fn();
      const { result } = renderHook(() =>
        useTouchInteraction({ enabled: true, onOpen, onClose })
      );

      act(() => {
        result.current.onTouchStart(createTouchEvent(100, 100));
      });

      // Move more than 10px
      act(() => {
        result.current.onTouchMove(createTouchEvent(115, 100));
      });

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(onOpen).not.toHaveBeenCalled();
    });

    it('does not cancel on small movement (<=10px)', () => {
      const onOpen = jest.fn();
      const onClose = jest.fn();
      const { result } = renderHook(() =>
        useTouchInteraction({ enabled: true, onOpen, onClose })
      );

      act(() => {
        result.current.onTouchStart(createTouchEvent(100, 100));
      });

      // Move within threshold
      act(() => {
        result.current.onTouchMove(createTouchEvent(105, 103));
      });

      act(() => {
        jest.advanceTimersByTime(700);
      });

      expect(onOpen).toHaveBeenCalledTimes(1);
    });

    it('handles touch start with no touches array', () => {
      const onOpen = jest.fn();
      const onClose = jest.fn();
      const { result } = renderHook(() =>
        useTouchInteraction({ enabled: true, onOpen, onClose })
      );

      act(() => {
        result.current.onTouchStart(createEmptyTouchEvent());
      });

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(onOpen).not.toHaveBeenCalled();
    });

    it('handles touch move with no touches array', () => {
      const onOpen = jest.fn();
      const onClose = jest.fn();
      const { result } = renderHook(() =>
        useTouchInteraction({ enabled: true, onOpen, onClose })
      );

      act(() => {
        result.current.onTouchStart(createTouchEvent(100, 100));
      });

      // Move with empty touches
      act(() => {
        result.current.onTouchMove(createEmptyTouchEvent());
      });

      // Should still fire since move did not cancel
      act(() => {
        jest.advanceTimersByTime(700);
      });

      expect(onOpen).toHaveBeenCalledTimes(1);
    });

    it('handles onTouchMove when startPos is null', () => {
      const onOpen = jest.fn();
      const onClose = jest.fn();
      const { result } = renderHook(() =>
        useTouchInteraction({ enabled: true, onOpen, onClose })
      );

      // Move without a prior touchStart - startPos is null
      act(() => {
        result.current.onTouchMove(createTouchEvent(200, 200));
      });

      // Should not throw
      expect(onOpen).not.toHaveBeenCalled();
    });

    it('onTouchEnd after long-press does not cancel auto-hide', () => {
      const onOpen = jest.fn();
      const onClose = jest.fn();
      const { result } = renderHook(() =>
        useTouchInteraction({ enabled: true, onOpen, onClose })
      );

      act(() => {
        result.current.onTouchStart(createTouchEvent(100, 100));
      });

      act(() => {
        jest.advanceTimersByTime(700); // long-press fires
      });

      expect(onOpen).toHaveBeenCalledTimes(1);

      // Touch end after long-press has already cleared longPressTimer
      act(() => {
        result.current.onTouchEnd();
      });

      // Auto-hide should still fire
      act(() => {
        jest.advanceTimersByTime(1500);
      });

      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });
});
