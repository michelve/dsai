/**
 * @file getArrowKeyHandler - Arrow key navigation handler
 * @module @dsai-io/react/utils/a11y
 *
 * Enterprise-grade arrow key handler with:
 * - Maps arrow keys to actions
 * - Prevents default behavior
 * - Type-safe handler map
 * - Supports all arrow directions
 */

import type { ArrowKey, ArrowKeyHandlers } from '../types/shared';

/**
 * Static allowlist of valid arrow keys to prevent dynamic property access attacks.
 * This is a compile-time constant that ensures only these specific keys can be used.
 */
const ARROW_KEYS: ReadonlySet<ArrowKey> = new Set([
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
] as const);

/**
 * Type guard to check if a string is a valid arrow key
 */
function isArrowKey(key: string): key is ArrowKey {
  return ARROW_KEYS.has(key as ArrowKey);
}

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
    const key = event.key;

    // Security: validate key against static allowlist before property access
    if (!isArrowKey(key)) {
      return;
    }

    // Safe: key is now validated as one of the four arrow key literals
    // Use explicit switch statement instead of dynamic property access
    switch (key) {
      case 'ArrowUp':
        handlers.ArrowUp?.(event);
        break;
      case 'ArrowDown':
        handlers.ArrowDown?.(event);
        break;
      case 'ArrowLeft':
        handlers.ArrowLeft?.(event);
        break;
      case 'ArrowRight':
        handlers.ArrowRight?.(event);
        break;
    }
  };
}
