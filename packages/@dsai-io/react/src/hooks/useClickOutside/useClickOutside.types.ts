/**
 * useClickOutside Types
 *
 * Type definitions for the useClickOutside hook.
 */

import type { RefObject } from 'react';

/**
 * Configuration options for useClickOutside hook
 */
export interface UseClickOutsideOptions {
  /**
   * Whether the click-outside listener is enabled.
   * When false, no event listeners are attached.
   *
   * @default true
   */
  enabled?: boolean;

  /**
   * Use capture phase for event listeners.
   * Capture phase runs before bubble phase and before stopPropagation() can prevent it.
   *
   * @default true
   */
  capture?: boolean;

  /**
   * Event types to listen for.
   * Use mousedown/touchstart to detect interaction before potential blur events.
   *
   * @default ['mousedown', 'touchstart']
   */
  events?: Array<'mousedown' | 'touchstart' | 'pointerdown'>;
}

/**
 * Ref or array of refs to exclude from click-outside detection
 */
export type UseClickOutsideRefs =
  | RefObject<HTMLElement | null>
  | Array<RefObject<HTMLElement | null>>;

/**
 * Callback function called when click is detected outside the specified element(s)
 */
export type UseClickOutsideCallback = (event: MouseEvent | TouchEvent) => void;
