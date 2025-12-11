/**
 * useScrollLock Hook
 *
 * A React hook for preventing body/element scrolling.
 * Essential for modal dialogs, sheets, drawers, and other overlay components.
 *
 * Features:
 * - Locks scrolling on body or custom element
 * - Compensates for scrollbar width to prevent layout shift
 * - Handles overlay stacking with reference counting
 * - Preserves original scroll position
 * - Manual lock/unlock control
 * - SSR-safe with isBrowser checks
 *
 * @example
 * ```tsx
 * function Modal({ isOpen, children }) {
 *   useScrollLock({ enabled: isOpen });
 *
 *   if (!isOpen) return null;
 *
 *   return (
 *     <div role="dialog" aria-modal="true">
 *       {children}
 *     </div>
 *   );
 * }
 * ```
 *
 * @packageDocumentation
 */

import { useCallback, useEffect, useRef } from 'react';

import { isBrowser } from '../../utils/browser/isBrowser';

import type { UseScrollLockOptions, UseScrollLockReturn } from './useScrollLock.types';

/**
 * Reference counter for tracking multiple scroll locks
 * Allows multiple overlays to lock scrolling without conflicts
 */
let lockCount = 0;

/**
 * Store original styles to restore later
 */
let originalOverflow = '';
let originalPaddingRight = '';

/**
 * useScrollLock - Prevents scrolling on body or custom element
 *
 * This hook is essential for overlay components (modals, sheets, drawers)
 * that need to prevent background scrolling while open.
 *
 * @param options - Configuration options for the scroll lock
 * @returns Object with lock/unlock methods and isLocked state
 *
 * @example Basic usage
 * ```tsx
 * function Modal({ isOpen, onClose, children }) {
 *   useScrollLock({ enabled: isOpen });
 *
 *   if (!isOpen) return null;
 *
 *   return (
 *     <div role="dialog">
 *       {children}
 *     </div>
 *   );
 * }
 * ```
 *
 * @example With scrollbar gap compensation
 * ```tsx
 * function Sheet({ isOpen }) {
 *   useScrollLock({
 *     enabled: isOpen,
 *     reserveScrollBarGap: true, // Prevents layout shift
 *   });
 *
 *   return <div>{// content}</div>;
 * }
 * ```
 *
 * @example Manual control
 * ```tsx
 * function CustomOverlay() {
 *   const { lock, unlock, isLocked } = useScrollLock({
 *     enabled: false, // Start unlocked
 *   });
 *
 *   return (
 *     <div>
 *       <button onClick={lock}>Lock Scroll</button>
 *       <button onClick={unlock}>Unlock Scroll</button>
 *       <p>Scroll is {isLocked ? 'locked' : 'unlocked'}</p>
 *     </div>
 *   );
 * }
 * ```
 *
 * @example Custom target element
 * ```tsx
 * function CustomScrollLock() {
 *   const containerRef = useRef<HTMLDivElement>(null);
 *
 *   useScrollLock({
 *     enabled: true,
 *     target: containerRef,
 *   });
 *
 *   return <div ref={containerRef}>{// content}</div>;
 * }
 * ```
 */
export function useScrollLock(options: UseScrollLockOptions = {}): UseScrollLockReturn {
  const { enabled = true, reserveScrollBarGap = true, target } = options;

  const isLockedRef = useRef(enabled);
  const hasLockedRef = useRef(false);

  /**
   * Get the target element for scroll locking
   */
  const getTarget = useCallback((): HTMLElement | null => {
    if (!isBrowser()) {
      return null;
    }

    if (!target) {
      return document.body;
    }

    if ('current' in target) {
      return target.current;
    }

    return target;
  }, [target]);

  /**
   * Manually lock scrolling
   */
  const lock = useCallback(() => {
    if (!isBrowser()) {
      return;
    }

    const targetElement = getTarget();
    if (!targetElement || hasLockedRef.current) {
      return;
    }

    // Increment lock count for stacking support
    lockCount += 1;
    hasLockedRef.current = true;
    isLockedRef.current = true;

    // Only apply styles on first lock
    if (lockCount === 1) {
      const computedStyle = window.getComputedStyle(targetElement);
      originalOverflow = computedStyle.overflow;
      originalPaddingRight = computedStyle.paddingRight;

      // Lock overflow
      targetElement.style.overflow = 'hidden';

      // Compensate for scrollbar width if enabled
      if (reserveScrollBarGap) {
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        if (scrollbarWidth > 0) {
          const currentPadding = Number.parseInt(originalPaddingRight, 10) || 0;
          targetElement.style.paddingRight = `${currentPadding + scrollbarWidth}px`;
        }
      }
    }
  }, [getTarget, reserveScrollBarGap]);

  /**
   * Manually unlock scrolling
   */
  const unlock = useCallback(() => {
    if (!isBrowser()) {
      return;
    }

    const targetElement = getTarget();
    if (!targetElement || !hasLockedRef.current) {
      return;
    }

    // Decrement lock count
    lockCount = Math.max(lockCount - 1, 0);
    hasLockedRef.current = false;
    isLockedRef.current = lockCount > 0;

    // Only restore styles when all locks are released
    if (lockCount === 0) {
      targetElement.style.overflow = originalOverflow;
      targetElement.style.paddingRight = originalPaddingRight;
    }
  }, [getTarget]);

  // Sync with enabled prop
  useEffect(() => {
    if (enabled && !hasLockedRef.current) {
      lock();
    } else if (!enabled && hasLockedRef.current) {
      unlock();
    }

    return () => {
      // Cleanup on unmount
      if (hasLockedRef.current) {
        unlock();
      }
    };
  }, [enabled, lock, unlock]);

  return {
    lock,
    unlock,
    get isLocked() {
      return isLockedRef.current;
    },
  };
}

export default useScrollLock;
