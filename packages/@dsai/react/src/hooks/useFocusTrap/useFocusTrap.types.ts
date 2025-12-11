/**
 * useFocusTrap Types
 *
 * TypeScript interfaces for the useFocusTrap hook.
 *
 * @packageDocumentation
 */

import type { RefObject } from 'react';

/**
 * Options for the useFocusTrap hook.
 *
 * @example
 * ```tsx
 * const focusTrap = useFocusTrap({
 *   enabled: isOpen,
 *   autoFocus: true,
 *   restoreFocus: true,
 *   onEscape: handleClose,
 * });
 * ```
 */
export interface UseFocusTrapOptions<T extends HTMLElement = HTMLElement> {
  /**
   * Whether the focus trap is enabled.
   * When false, no focus trapping occurs.
   * @default true
   */
  enabled?: boolean;

  /**
   * Auto-focus first focusable element when trap activates.
   * @default true
   */
  autoFocus?: boolean;

  /**
   * Restore focus to previously focused element when trap deactivates.
   * @default true
   */
  restoreFocus?: boolean;

  /**
   * Ref to element that should receive initial focus.
   * Takes precedence over autoFocus finding the first focusable element.
   */
  initialFocusRef?: RefObject<HTMLElement | null>;

  /**
   * Ref to element that should receive focus when trap deactivates.
   * Takes precedence over restoreFocus returning to the previously focused element.
   */
  finalFocusRef?: RefObject<HTMLElement | null>;

  /**
   * Callback when Escape key is pressed.
   * Useful for closing modals/dialogs.
   */
  onEscape?: () => void;

  /**
   * Delay in milliseconds before setting initial focus.
   * Useful when the container needs time to render.
   * @default 0
   */
  initialFocusDelay?: number;

  /**
   * External container ref to use instead of creating a new one.
   * Useful when the parent component already manages its own ref.
   */
  containerRef?: RefObject<T | null>;
}

/**
 * Return value of the useFocusTrap hook.
 *
 * @example
 * ```tsx
 * const { containerRef, activate, deactivate, isActive } = useFocusTrap(options);
 *
 * return (
 *   <div ref={containerRef}>
 *     <button onClick={deactivate}>Close</button>
 *   </div>
 * );
 * ```
 */
export interface UseFocusTrapReturn<T extends HTMLElement = HTMLElement> {
  /**
   * Ref to attach to the container element that should trap focus.
   */
  containerRef: RefObject<T | null>;

  /**
   * Manually activate the focus trap.
   * Useful when you need programmatic control.
   */
  activate: () => void;

  /**
   * Manually deactivate the focus trap.
   * Useful when you need programmatic control.
   */
  deactivate: () => void;

  /**
   * Whether the focus trap is currently active.
   * Reflects the internal state, useful for UI feedback.
   */
  isActive: boolean;
}
