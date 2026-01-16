import type { RefObject } from 'react';

/**
 * Type definitions for useKeyPress hook
 */

/**
 * Options for configuring keyboard event handling.
 */
export interface UseKeyPressOptions {
  /**
   * The keyboard event to listen for.
   * @default 'keydown'
   */
  event?: 'keydown' | 'keyup';

  /**
   * The target element to attach the listener to.
   * Can be a React ref, Document, or Window.
   * @default window
   */
  target?: RefObject<HTMLElement> | Document | Window;

  /**
   * Whether to enable keyboard shortcuts on form elements.
   * When false, shortcuts are disabled when focus is on input, textarea, or select.
   * @default false
   */
  enableOnFormTags?: boolean;

  /**
   * Event options for addEventListener.
   * @default { passive: true }
   */
  eventOptions?: boolean | AddEventListenerOptions;
}

/**
 * Return type for useKeyPress hook - true when key is currently pressed.
 */
export type UseKeyPressReturn = boolean;
