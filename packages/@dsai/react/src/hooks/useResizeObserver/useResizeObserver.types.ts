import type { RefObject } from 'react';

/**
 * Type definitions for useResizeObserver hook
 */

/**
 * Options for configuring resize observer behavior.
 */
export interface UseResizeObserverOptions {
  /**
   * Which box model to observe.
   * @default 'content-box'
   */
  box?: ResizeObserverBoxOptions;

  /**
   * Callback when element is resized.
   */
  onResize?: (entry: ResizeObserverEntry) => void;

  /**
   * Whether to enable the observer.
   * @default true
   */
  enabled?: boolean;
}

/**
 * Return type for useResizeObserver hook.
 *
 * @template T - The type of HTML element
 */
export interface UseResizeObserverReturn<T extends HTMLElement = HTMLElement> {
  /**
   * Ref to attach to the element to observe.
   */
  ref: RefObject<T | null>;

  /**
   * The current width of the element.
   */
  width: number | undefined;

  /**
   * The current height of the element.
   */
  height: number | undefined;

  /**
   * The current resize observer entry.
   */
  entry: ResizeObserverEntry | undefined;
}
