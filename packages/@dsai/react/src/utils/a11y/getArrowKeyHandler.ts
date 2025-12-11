/**
 * @file getArrowKeyHandler - Arrow key navigation handler
 * @module @dsai/react/utils/a11y
 *
 * Enterprise-grade arrow key handler with:
 * - Maps arrow keys to actions
 * - Prevents default behavior
 * - Type-safe handler map
 * - Supports all arrow directions
 */

import type { ArrowKey, ArrowKeyHandlers } from '../types/shared';

/**
 * Create a keyboard event handler for arrow key navigation
 *
 * @param handlers - Map of arrow keys to handler functions
 * @returns Keyboard event handler function
 *
 * @example
 * ```tsx
 * // Basic usage
 * const handleKeyDown = getArrowKeyHandler({
 *   ArrowUp: (e) => {
 *     e.preventDefault();
 *     focusPreviousItem();
 *   },
 *   ArrowDown: (e) => {
 *     e.preventDefault();
 *     focusNextItem();
 *   }
 * });
 *
 * element.addEventListener('keydown', handleKeyDown);
 *
 * // Horizontal navigation
 * const handleHorizontal = getArrowKeyHandler({
 *   ArrowLeft: (e) => {
 *     e.preventDefault();
 *     selectPrevious();
 *   },
 *   ArrowRight: (e) => {
 *     e.preventDefault();
 *     selectNext();
 *   }
 * });
 *
 * // All directions
 * const handleGrid = getArrowKeyHandler({
 *   ArrowUp: (e) => navigateUp(e),
 *   ArrowDown: (e) => navigateDown(e),
 *   ArrowLeft: (e) => navigateLeft(e),
 *   ArrowRight: (e) => navigateRight(e)
 * });
 *
 * // With React
 * <div onKeyDown={getArrowKeyHandler({
 *   ArrowUp: () => setIndex(i => Math.max(0, i - 1)),
 *   ArrowDown: () => setIndex(i => Math.min(max, i + 1))
 * })} />
 * ```
 */
export function getArrowKeyHandler(handlers: ArrowKeyHandlers): (event: KeyboardEvent) => void {
  return (event: KeyboardEvent): void => {
    const key = event.key as ArrowKey;

    // Safe: key is typed as ArrowKey and checked against handlers
    if (key in handlers && Object.hasOwn(handlers, key)) {
      const handler = handlers[key];
      if (handler) {
        handler(event);
      }
    }
  };
}
