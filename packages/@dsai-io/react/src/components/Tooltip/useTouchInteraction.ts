import { useCallback, useRef } from 'react';

const LONG_PRESS_MS = 700;
const AUTO_HIDE_MS = 1500;
const MOVE_THRESHOLD_PX = 10;

interface UseTouchInteractionOptions {
  enabled: boolean;
  onOpen: () => void;
  onClose: () => void;
}

interface TouchInteractionProps {
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: () => void;
}

/**
 * Internal hook for long-press touch interaction on tooltips.
 *
 * - Long-press (700ms) to show
 * - Auto-hide after 1500ms
 * - Cancel on scroll (>10px movement) or touch end before threshold
 */
export function useTouchInteraction({
  enabled,
  onOpen,
  onClose,
}: UseTouchInteractionOptions): TouchInteractionProps {
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoHideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startPosRef = useRef<{ x: number; y: number } | null>(null);

  const clearTimers = useCallback(() => {
    if (longPressTimerRef.current !== null) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    if (autoHideTimerRef.current !== null) {
      clearTimeout(autoHideTimerRef.current);
      autoHideTimerRef.current = null;
    }
  }, []);

  const onTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (!enabled) {return;}

      const touch = e.touches[0];
      if (!touch) {return;}

      startPosRef.current = { x: touch.clientX, y: touch.clientY };
      clearTimers();

      longPressTimerRef.current = setTimeout(() => {
        longPressTimerRef.current = null;
        onOpen();

        autoHideTimerRef.current = setTimeout(() => {
          autoHideTimerRef.current = null;
          onClose();
        }, AUTO_HIDE_MS);
      }, LONG_PRESS_MS);
    },
    [enabled, onOpen, onClose, clearTimers],
  );

  const onTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!startPosRef.current) {return;}

      const touch = e.touches[0];
      if (!touch) {return;}

      const dx = touch.clientX - startPosRef.current.x;
      const dy = touch.clientY - startPosRef.current.y;
      const distance = Math.hypot(dx, dy);

      if (distance > MOVE_THRESHOLD_PX) {
        clearTimers();
        startPosRef.current = null;
      }
    },
    [clearTimers],
  );

  const onTouchEnd = useCallback(() => {
    // If long-press timer is still active, user released early — cancel
    if (longPressTimerRef.current !== null) {
      clearTimers();
    }
    startPosRef.current = null;
  }, [clearTimers]);

  return { onTouchStart, onTouchMove, onTouchEnd };
}
