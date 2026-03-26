/**
 * useRovingFocus Types
 *
 * TypeScript interfaces for the useRovingFocus hook.
 *
 * @packageDocumentation
 */

import type { KeyboardEvent, RefObject } from 'react';

/**
 * Options for the useRovingFocus hook.
 *
 * @example
 * ```tsx
 * const { containerProps } = useRovingFocus({
 *   containerRef: ref,
 *   orientation: 'vertical',
 *   wrap: true,
 *   itemSelector: '[role="option"]',
 *   enabled: true,
 * });
 * ```
 */
export interface UseRovingFocusOptions {
  /**
   * Ref to the container element that holds the focusable items.
   */
  containerRef: RefObject<HTMLElement | null>;

  /**
   * The orientation of the roving focus navigation.
   * Determines which arrow keys are used for navigation.
   * @default 'vertical'
   */
  orientation?: 'vertical' | 'horizontal' | 'both';

  /**
   * Whether focus should wrap around when reaching the boundaries.
   * @default true
   */
  wrap?: boolean;

  /**
   * Whether Home and End keys navigate to first/last items.
   * @default true
   */
  homeEnd?: boolean;

  /**
   * CSS selector used to identify focusable items within the container.
   * @default '[role="option"]'
   */
  itemSelector?: string;

  /**
   * CSS selector used to identify disabled items that should be skipped.
   * @default '[aria-disabled="true"]'
   */
  disabledSelector?: string;

  /**
   * Whether the roving focus behavior is enabled.
   * When false, no keyboard navigation occurs.
   * @default true
   */
  enabled?: boolean;
}

/**
 * Return value of the useRovingFocus hook.
 *
 * @example
 * ```tsx
 * const { containerProps, focusedIndex, setFocusedIndex } = useRovingFocus(options);
 *
 * return (
 *   <ul ref={ref} {...containerProps}>
 *     {items.map((item, i) => (
 *       <li key={i} tabIndex={i === focusedIndex ? 0 : -1}>{item}</li>
 *     ))}
 *   </ul>
 * );
 * ```
 */
export interface UseRovingFocusReturn {
  /**
   * Props to spread onto the container element.
   * Includes the onKeyDown handler for keyboard navigation.
   */
  containerProps: {
    onKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
  };

  /**
   * The index of the currently focused item.
   */
  focusedIndex: number;

  /**
   * Programmatically set the focused item by index.
   * Moves focus and updates tabIndex attributes accordingly.
   */
  setFocusedIndex: (index: number) => void;
}
