/**
 * useTouchInteraction Coverage Tests
 *
 * Tests touch event branches: enabled/disabled, long-press,
 * auto-hide, scroll cancellation, early release.
 */

import { act, renderHook } from '@testing-library/react';

import { useTouchInteraction } from './useTouchInteraction';

// -- Named constants for magic numbers (SonarQube S109) --
const LONG_PRESS_DELAY_MS = 700;
const AUTO_HIDE_DELAY_MS = 1500;
const EARLY_RELEASE_MS = 300;
const TOUCH_START_X = 100;
const TOUCH_START_Y = 100;
const TOUCH_MOVE_BEYOND_X = 115;
const TOUCH_MOVE_WITHIN_X = 105;
const TOUCH_MOVE_WITHIN_Y = 103;
const TOUCH_MOVE_NULL_X = 200;
const TOUCH_MOVE_NULL_Y = 200;
const ADVANCE_AFTER_CANCEL_MS = 1000;

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
        result.current.onTouchStart(createTouchEvent(TOUCH_START_X, TOUCH_START_Y));
      });

      jest.advanceTimersByTime(ADVANCE_AFTER_CANCEL_MS);
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
        result.current.onTouchStart(createTouchEvent(TOUCH_START_X, TOUCH_START_Y));
      });

      expect(onOpen).not.toHaveBeenCalled();

      act(() => {
        jest.advanceTimersByTime(LONG_PRESS_DELAY_MS);
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
        result.current.onTouchStart(createTouchEvent(TOUCH_START_X, TOUCH_START_Y));
      });

      act(() => {
        jest.advanceTimersByTime(LONG_PRESS_DELAY_MS); // open
      });

      expect(onOpen).toHaveBeenCalledTimes(1);
      expect(onClose).not.toHaveBeenCalled();

      act(() => {
        jest.advanceTimersByTime(AUTO_HIDE_DELAY_MS); // auto-hide
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
        result.current.onTouchStart(createTouchEvent(TOUCH_START_X, TOUCH_START_Y));
      });

      act(() => {
        jest.advanceTimersByTime(EARLY_RELEASE_MS); // not yet 700ms
      });

      act(() => {
        result.current.onTouchEnd();
      });

      act(() => {
        jest.advanceTimersByTime(ADVANCE_AFTER_CANCEL_MS);
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
        result.current.onTouchStart(createTouchEvent(TOUCH_START_X, TOUCH_START_Y));
      });

      // Move more than 10px
      act(() => {
        result.current.onTouchMove(createTouchEvent(TOUCH_MOVE_BEYOND_X, TOUCH_START_Y));
      });

      act(() => {
        jest.advanceTimersByTime(ADVANCE_AFTER_CANCEL_MS);
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
        result.current.onTouchStart(createTouchEvent(TOUCH_START_X, TOUCH_START_Y));
      });

      // Move within threshold
      act(() => {
        result.current.onTouchMove(createTouchEvent(TOUCH_MOVE_WITHIN_X, TOUCH_MOVE_WITHIN_Y));
      });

      act(() => {
        jest.advanceTimersByTime(LONG_PRESS_DELAY_MS);
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
        jest.advanceTimersByTime(ADVANCE_AFTER_CANCEL_MS);
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
        result.current.onTouchStart(createTouchEvent(TOUCH_START_X, TOUCH_START_Y));
      });

      // Move with empty touches
      act(() => {
        result.current.onTouchMove(createEmptyTouchEvent());
      });

      // Should still fire since move did not cancel
      act(() => {
        jest.advanceTimersByTime(LONG_PRESS_DELAY_MS);
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
        result.current.onTouchMove(createTouchEvent(TOUCH_MOVE_NULL_X, TOUCH_MOVE_NULL_Y));
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
        result.current.onTouchStart(createTouchEvent(TOUCH_START_X, TOUCH_START_Y));
      });

      act(() => {
        jest.advanceTimersByTime(LONG_PRESS_DELAY_MS); // long-press fires
      });

      expect(onOpen).toHaveBeenCalledTimes(1);

      // Touch end after long-press has already cleared longPressTimer
      act(() => {
        result.current.onTouchEnd();
      });

      // Auto-hide should still fire
      act(() => {
        jest.advanceTimersByTime(AUTO_HIDE_DELAY_MS);
      });

      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });
});
