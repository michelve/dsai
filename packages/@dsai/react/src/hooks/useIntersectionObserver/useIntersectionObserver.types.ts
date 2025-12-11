import type { RefObject } from 'react';

/**
 * Type definitions for useIntersectionObserver hook
 */

/**
 * Options for configuring intersection observer behavior.
 */
export interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  /**
   * Whether to freeze the intersection state once the element becomes visible.
   * Useful for lazy loading that should only trigger once.
   * @default false
   */
  freezeOnceVisible?: boolean;

  /**
   * Callback when intersection state changes.
   */
  onChange?: (entry: IntersectionObserverEntry) => void;

  /**
   * Whether to enable the observer.
   * @default true
   */
  enabled?: boolean;
}

/**
 * Return type for useIntersectionObserver hook.
 */
export interface UseIntersectionObserverReturn {
  /**
   * Ref to attach to the element to observe.
   */
  ref: RefObject<Element | null>;

  /**
   * The current intersection observer entry.
   */
  entry: IntersectionObserverEntry | undefined;

  /**
   * Whether the element is currently intersecting.
   */
  isIntersecting: boolean;
}
