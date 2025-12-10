import type { RefObject } from 'react';

/**
 * Type definitions for useHover hook
 */

/**
 * Options for configuring hover behavior.
 */
export interface UseHoverOptions {
  /**
   * Delay in milliseconds before setting hover to true on mouse enter.
   * @default 0
   */
  delayEnter?: number;

  /**
   * Delay in milliseconds before setting hover to false on mouse leave.
   * @default 0
   */
  delayLeave?: number;

  /**
   * Alias for delayEnter (backwards compatibility).
   * @deprecated Use delayEnter instead
   */
  mouseEnterDelayMS?: number;

  /**
   * Alias for delayLeave (backwards compatibility).
   * @deprecated Use delayLeave instead
   */
  mouseLeaveDelayMS?: number;

  /**
   * Callback when hover state changes.
   */
  onHoverChange?: (isHovered: boolean) => void;
}

/**
 * Return type for useHover hook.
 *
 * @template T - The type of HTML element
 */
export type UseHoverReturn<T extends HTMLElement = HTMLElement> = [
  ref: RefObject<T | null>,
  isHovered: boolean,
];
