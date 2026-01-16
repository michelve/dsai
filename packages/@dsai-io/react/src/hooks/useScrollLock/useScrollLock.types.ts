/**
 * useScrollLock Types
 *
 * TypeScript interfaces for the useScrollLock hook.
 */

import type React from 'react';

/**
 * Options for configuring the scroll lock hook
 */
export interface UseScrollLockOptions {
  /**
   * Whether the scroll lock is enabled
   * @default true
   */
  enabled?: boolean;

  /**
   * Reserve space for scrollbar to prevent layout shift
   * When true, adds padding-right equal to scrollbar width
   * @default true
   */
  reserveScrollBarGap?: boolean;

  /**
   * Target element to lock scroll on
   * @default document.body
   */
  target?: React.RefObject<HTMLElement> | HTMLElement;
}

/**
 * Return value from useScrollLock hook
 */
export interface UseScrollLockReturn {
  /**
   * Manually lock scrolling
   * Useful for programmatic control
   */
  lock: () => void;

  /**
   * Manually unlock scrolling
   * Useful for programmatic control
   */
  unlock: () => void;

  /**
   * Whether scrolling is currently locked
   */
  isLocked: boolean;
}
