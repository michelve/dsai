/**
 * useScrollLock Tests
 *
 * Comprehensive tests for the useScrollLock hook.
 * Tests cover scroll locking, scrollbar compensation, stacking, and SSR safety.
 */

import '@testing-library/jest-dom';
import { renderHook } from '@testing-library/react';

import { useScrollLock } from './useScrollLock';

import type { UseScrollLockOptions, UseScrollLockReturn } from './useScrollLock.types';

/**
 * Test helper to get computed styles
 */
function getBodyStyles() {
  return {
    overflow: document.body.style.overflow,
    paddingRight: document.body.style.paddingRight,
  };
}

/**
 * Test helper to reset body styles
 */
function resetBodyStyles() {
  document.body.style.overflow = '';
  document.body.style.paddingRight = '';
}

/**
 * Test helper to simulate scrollbar presence
 */
function simulateScrollbar(width: number) {
  // Store original values
  const originalInnerWidth = window.innerWidth;
  const originalClientWidth = document.documentElement.clientWidth;

  // Mock to create scrollbar width difference
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: 1024,
  });

  Object.defineProperty(document.documentElement, 'clientWidth', {
    writable: true,
    configurable: true,
    value: 1024 - width,
  });

  return () => {
    // Restore original values
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });

    Object.defineProperty(document.documentElement, 'clientWidth', {
      writable: true,
      configurable: true,
      value: originalClientWidth,
    });
  };
}

describe('useScrollLock', () => {
  beforeEach(() => {
    resetBodyStyles();
  });

  afterEach(() => {
    resetBodyStyles();
  });

  describe('Basic Functionality', () => {
    it('should lock scroll when enabled', () => {
      renderHook(() => useScrollLock({ enabled: true }));

      const styles = getBodyStyles();
      expect(styles.overflow).toBe('hidden');
    });

    it('should not lock scroll when disabled', () => {
      renderHook(() => useScrollLock({ enabled: false }));

      const styles = getBodyStyles();
      expect(styles.overflow).toBe('');
    });

    it('should unlock scroll on unmount', () => {
      const { unmount } = renderHook(() => useScrollLock({ enabled: true }));

      expect(getBodyStyles().overflow).toBe('hidden');

      unmount();

      expect(getBodyStyles().overflow).toBe('');
    });

    it('should update when enabled changes', () => {
      const { rerender } = renderHook<void, UseScrollLockOptions>(
        ({ enabled }) => useScrollLock({ enabled }),
        { initialProps: { enabled: false } }
      );

      expect(getBodyStyles().overflow).toBe('');

      rerender({ enabled: true });
      expect(getBodyStyles().overflow).toBe('hidden');

      rerender({ enabled: false });
      expect(getBodyStyles().overflow).toBe('');
    });
  });

  describe('Scrollbar Compensation', () => {
    it('should compensate for scrollbar width by default', () => {
      const restoreScrollbar = simulateScrollbar(17);

      renderHook(() => useScrollLock({ enabled: true }));

      const styles = getBodyStyles();
      expect(styles.overflow).toBe('hidden');
      expect(styles.paddingRight).toBe('17px');

      restoreScrollbar();
    });

    it('should not compensate when reserveScrollBarGap is false', () => {
      const restoreScrollbar = simulateScrollbar(17);

      renderHook(() => useScrollLock({ enabled: true, reserveScrollBarGap: false }));

      const styles = getBodyStyles();
      expect(styles.overflow).toBe('hidden');
      expect(styles.paddingRight).toBe('');

      restoreScrollbar();
    });

    it('should handle existing padding when compensating', () => {
      document.body.style.paddingRight = '20px';
      const restoreScrollbar = simulateScrollbar(15);

      renderHook(() => useScrollLock({ enabled: true }));

      const styles = getBodyStyles();
      expect(styles.paddingRight).toBe('35px'); // 20 + 15

      restoreScrollbar();
    });

    it('should not add padding when no scrollbar is present', () => {
      const restoreScrollbar = simulateScrollbar(0);

      renderHook(() => useScrollLock({ enabled: true }));

      const styles = getBodyStyles();
      expect(styles.overflow).toBe('hidden');
      expect(styles.paddingRight).toBe('');

      restoreScrollbar();
    });
  });

  describe('Multiple Overlays (Stacking)', () => {
    it('should support multiple locks', () => {
      const { unmount: unmount1 } = renderHook(() => useScrollLock({ enabled: true }));
      expect(getBodyStyles().overflow).toBe('hidden');

      const { unmount: unmount2 } = renderHook(() => useScrollLock({ enabled: true }));
      expect(getBodyStyles().overflow).toBe('hidden');

      // First unlock should not restore styles
      unmount1();
      expect(getBodyStyles().overflow).toBe('hidden');

      // Second unlock should restore styles
      unmount2();
      expect(getBodyStyles().overflow).toBe('');
    });

    it('should only restore styles when all locks are released', () => {
      const restoreScrollbar = simulateScrollbar(17);

      const { unmount: unmount1 } = renderHook(() => useScrollLock({ enabled: true }));
      const { unmount: unmount2 } = renderHook(() => useScrollLock({ enabled: true }));
      const { unmount: unmount3 } = renderHook(() => useScrollLock({ enabled: true }));

      expect(getBodyStyles().overflow).toBe('hidden');
      expect(getBodyStyles().paddingRight).toBe('17px');

      unmount1();
      expect(getBodyStyles().overflow).toBe('hidden');
      expect(getBodyStyles().paddingRight).toBe('17px');

      unmount2();
      expect(getBodyStyles().overflow).toBe('hidden');
      expect(getBodyStyles().paddingRight).toBe('17px');

      unmount3();
      expect(getBodyStyles().overflow).toBe('');
      expect(getBodyStyles().paddingRight).toBe('');

      restoreScrollbar();
    });

    it('should handle rapid enable/disable with multiple instances', () => {
      const { rerender: rerender1 } = renderHook<void, UseScrollLockOptions>(
        ({ enabled }) => useScrollLock({ enabled }),
        { initialProps: { enabled: true } }
      );

      const { rerender: rerender2 } = renderHook<void, UseScrollLockOptions>(
        ({ enabled }) => useScrollLock({ enabled }),
        { initialProps: { enabled: true } }
      );

      expect(getBodyStyles().overflow).toBe('hidden');

      // Disable first instance
      rerender1({ enabled: false });
      expect(getBodyStyles().overflow).toBe('hidden'); // Still locked by second

      // Disable second instance
      rerender2({ enabled: false });
      expect(getBodyStyles().overflow).toBe('');

      // Re-enable first instance
      rerender1({ enabled: true });
      expect(getBodyStyles().overflow).toBe('hidden');

      // Re-enable second instance
      rerender2({ enabled: true });
      expect(getBodyStyles().overflow).toBe('hidden');
    });
  });

  describe('Manual Control', () => {
    it('should provide lock method', () => {
      const { result } = renderHook<UseScrollLockReturn, UseScrollLockOptions>(
        (options) => useScrollLock(options),
        { initialProps: { enabled: false } }
      );

      expect(getBodyStyles().overflow).toBe('');

      result.current.lock();

      expect(getBodyStyles().overflow).toBe('hidden');
    });

    it('should provide unlock method', () => {
      const { result } = renderHook<UseScrollLockReturn, UseScrollLockOptions>(
        (options) => useScrollLock(options),
        { initialProps: { enabled: true } }
      );

      expect(getBodyStyles().overflow).toBe('hidden');

      result.current.unlock();

      expect(getBodyStyles().overflow).toBe('');
    });

    it('should track isLocked state', () => {
      const { result } = renderHook<UseScrollLockReturn, UseScrollLockOptions>(
        (options) => useScrollLock(options),
        { initialProps: { enabled: false } }
      );

      expect(result.current.isLocked).toBe(false);

      result.current.lock();
      expect(result.current.isLocked).toBe(true);

      result.current.unlock();
      expect(result.current.isLocked).toBe(false);
    });

    it('should prevent double lock', () => {
      const { result } = renderHook<UseScrollLockReturn, UseScrollLockOptions>(
        (options) => useScrollLock(options),
        { initialProps: { enabled: false } }
      );

      result.current.lock();
      expect(getBodyStyles().overflow).toBe('hidden');

      // Try to lock again
      result.current.lock();
      expect(getBodyStyles().overflow).toBe('hidden');

      // Should only need one unlock
      result.current.unlock();
      expect(getBodyStyles().overflow).toBe('');
    });

    it('should prevent double unlock', () => {
      const { result } = renderHook<UseScrollLockReturn, UseScrollLockOptions>(
        (options) => useScrollLock(options),
        { initialProps: { enabled: true } }
      );

      expect(getBodyStyles().overflow).toBe('hidden');

      result.current.unlock();
      expect(getBodyStyles().overflow).toBe('');

      // Try to unlock again - should be no-op
      result.current.unlock();
      expect(getBodyStyles().overflow).toBe('');
    });

    it('should work with enabled prop and manual control', () => {
      const { result, rerender } = renderHook<UseScrollLockReturn, UseScrollLockOptions>(
        (options) => useScrollLock(options),
        { initialProps: { enabled: false } }
      );

      // Manual lock
      result.current.lock();
      expect(getBodyStyles().overflow).toBe('hidden');

      // Enable via prop - should maintain lock
      rerender({ enabled: true });
      expect(getBodyStyles().overflow).toBe('hidden');

      // Manual unlock decrements lock count
      result.current.lock();
      expect(getBodyStyles().overflow).toBe('hidden');

      // Disable via prop
      rerender({ enabled: false });
      expect(getBodyStyles().overflow).toBe('');
    });
  });

  describe('Custom Target', () => {
    it('should lock custom element via ref', () => {
      const targetElement = document.createElement('div');
      targetElement.setAttribute('data-testid', 'target');
      document.body.appendChild(targetElement);

      const targetRef = { current: targetElement };

      renderHook(() => useScrollLock({ enabled: true, target: targetRef }));

      expect(targetElement.style.overflow).toBe('hidden');
      expect(document.body.style.overflow).toBe('');

      document.body.removeChild(targetElement);
    });

    it('should lock custom element via direct element', () => {
      const targetElement = document.createElement('div');
      document.body.appendChild(targetElement);

      renderHook(() => useScrollLock({ enabled: true, target: targetElement }));

      expect(targetElement.style.overflow).toBe('hidden');
      expect(document.body.style.overflow).toBe('');

      document.body.removeChild(targetElement);
    });

    it('should handle null target element gracefully', () => {
      // When target ref.current is null, getTarget returns null and lock is skipped
      const nonExistentElement = document.getElementById('does-not-exist');

      renderHook(() => useScrollLock({ enabled: true, target: nonExistentElement ?? undefined }));

      // Should lock body when target is undefined (falls back to body)
      expect(document.body.style.overflow).toBe('hidden');
    });
  });

  describe('SSR Safety', () => {
    it('should handle missing window gracefully', () => {
      const originalWindow = global.window;

      // @ts-expect-error Testing SSR scenario
      delete global.window;

      const { result } = renderHook(() => useScrollLock({ enabled: true }));

      expect(result.current.isLocked).toBe(true);
      expect(() => result.current.lock()).not.toThrow();
      expect(() => result.current.unlock()).not.toThrow();

      global.window = originalWindow;
    });

    it('should handle missing document gracefully', () => {
      const originalDocument = global.document;

      // @ts-expect-error Testing SSR scenario
      delete global.document;

      const { result } = renderHook(() => useScrollLock({ enabled: true }));

      expect(result.current.isLocked).toBe(true);
      expect(() => result.current.lock()).not.toThrow();
      expect(() => result.current.unlock()).not.toThrow();

      global.document = originalDocument;
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty options', () => {
      const { result } = renderHook(() => useScrollLock());

      expect(getBodyStyles().overflow).toBe('hidden');
      expect(result.current.isLocked).toBe(true);
    });

    it('should preserve original overflow style', () => {
      document.body.style.overflow = 'auto';

      const { unmount } = renderHook(() => useScrollLock({ enabled: true }));

      expect(getBodyStyles().overflow).toBe('hidden');

      unmount();

      expect(getBodyStyles().overflow).toBe('auto');
    });

    it('should preserve original padding-right style', () => {
      document.body.style.paddingRight = '25px';
      const restoreScrollbar = simulateScrollbar(10);

      const { unmount } = renderHook(() => useScrollLock({ enabled: true }));

      expect(getBodyStyles().paddingRight).toBe('35px');

      unmount();

      expect(getBodyStyles().paddingRight).toBe('25px');

      restoreScrollbar();
    });

    it('should handle cleanup when lock count is out of sync', () => {
      // This tests the Math.max safety in unlock
      const { result } = renderHook(() => useScrollLock({ enabled: false }));

      // Try to unlock without locking
      result.current.unlock();
      result.current.unlock();
      result.current.unlock();

      expect(getBodyStyles().overflow).toBe('');

      // Should still be able to lock normally
      result.current.lock();
      expect(getBodyStyles().overflow).toBe('hidden');
    });
  });
});
