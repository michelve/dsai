/**
 * @file createRovingTabindex - Roving tabindex manager
 * @module @dsai-io/react/utils/a11y
 *
 * Enterprise-grade roving tabindex with:
 * - Manages tabindex across focusable items
 * - Keyboard navigation (arrows, home, end)
 * - Looping/wrapping support
 * - Orientation-aware (horizontal/vertical/both)
 * - Clean cleanup
 */

import type { RovingTabindexManager, RovingTabindexOptions } from '../types/shared';

/**
 * Create a roving tabindex manager for keyboard navigation
 *
 * @param container - Container element with focusable children
 * @param options - Roving tabindex options
 * @returns Manager with focus control methods
 *
 * @throws {TypeError} If container is not an Element
 *
 * @example
 * ```tsx
 * // Basic horizontal toolbar
 * const toolbar = document.getElementById('toolbar');
 * const manager = createRovingTabindex(toolbar, {
 *   itemSelector: 'button',
 *   orientation: 'horizontal'
 * });
 *
 * // Focus first item
 * manager.focusFirst();
 *
 * // Cleanup when done
 * manager.destroy();
 *
 * // Vertical list with looping
 * const list = document.getElementById('menu');
 * const menuManager = createRovingTabindex(list, {
 *   itemSelector: '[role="menuitem"]',
 *   orientation: 'vertical',
 *   loop: true
 * });
 *
 * // React usage
 * useEffect(() => {
 *   const manager = createRovingTabindex(ref.current, {
 *     itemSelector: '.tab',
 *     orientation: 'horizontal'
 *   });
 *
 *   return () => manager.destroy();
 * }, []);
 * ```
 */
const DEFAULT_ROVING_OPTIONS: RovingTabindexOptions = { itemSelector: '[data-roving-item]' };

export function createRovingTabindex(
  target: Element | Element[],
  options: RovingTabindexOptions = DEFAULT_ROVING_OPTIONS
): RovingTabindexManager {
  const isElementArray = Array.isArray(target);
  const container = isElementArray ? (target[0]?.parentElement ?? document.body) : target;

  // Validate container
  if (!(container instanceof Element)) {
    throw new TypeError('createRovingTabindex expects an Element as container');
  }

  const { itemSelector, enableKeyboard = true, loop = true, orientation = 'horizontal' } = options;

  let currentIndex = 0;
  let items: Element[] = [];

  /**
   * Get all focusable items
   */
  function getItems(): Element[] {
    if (isElementArray) {
      return [...(target as Element[])];
    }

    if (!itemSelector) {
      throw new TypeError('createRovingTabindex requires itemSelector when container is used');
    }

    return Array.from(container.querySelectorAll(itemSelector));
  }

  /**
   * Update items and tabindex attributes
   */
  function updateItems(): void {
    items = getItems();

    items.forEach((item, index) => {
      if (index === currentIndex) {
        item.setAttribute('tabindex', '0');
      } else {
        item.setAttribute('tabindex', '-1');
      }
    });
  }

  /**
   * Focus item at index
   */
  function focusAt(index: number): void {
    if (index < 0 || index >= items.length) {
      return;
    }

    currentIndex = index;
    updateItems();

    const item = Reflect.get(items, index) as Element | undefined;
    if (item instanceof HTMLElement) {
      item.focus();
    }
  }

  /**
   * Focus first item
   */
  function focusFirst(): void {
    focusAt(0);
  }

  /**
   * Focus last item
   */
  function focusLast(): void {
    focusAt(items.length - 1);
  }

  /**
   * Focus next item
   */
  function focusNext(): void {
    let nextIndex = currentIndex + 1;

    if (nextIndex >= items.length) {
      nextIndex = loop ? 0 : items.length - 1;
    }

    focusAt(nextIndex);
  }

  /**
   * Focus previous item
   */
  function focusPrevious(): void {
    let prevIndex = currentIndex - 1;

    if (prevIndex < 0) {
      prevIndex = loop ? items.length - 1 : 0;
    }

    focusAt(prevIndex);
  }

  /**
   * Get current focused index
   */
  function getCurrentIndex(): number {
    return currentIndex;
  }

  /**
   * Resolve navigation direction from arrow key.
   * Returns 'prev', 'next', or null if the key is unrelated.
   */
  function resolveArrowDirection(key: string): 'prev' | 'next' | null {
    const isHorizontal = orientation === 'horizontal' || orientation === 'both';
    const isVertical = orientation === 'vertical' || orientation === 'both';

    if ((isHorizontal && key === 'ArrowLeft') || (isVertical && key === 'ArrowUp')) {
      return 'prev';
    }
    if ((isHorizontal && key === 'ArrowRight') || (isVertical && key === 'ArrowDown')) {
      return 'next';
    }
    return null;
  }

  /**
   * Handle keyboard events
   */
  function handleKeyDown(event: KeyboardEvent): void {
    const { key } = event;

    if (key === 'Home') {
      event.preventDefault();
      focusFirst();
      return;
    }

    if (key === 'End') {
      event.preventDefault();
      focusLast();
      return;
    }

    const direction = resolveArrowDirection(key);
    if (direction) {
      event.preventDefault();
      if (direction === 'prev') {
        focusPrevious();
      } else {
        focusNext();
      }
    }
  }

  // Initialize
  updateItems();

  // Add keyboard listener if enabled
  if (enableKeyboard) {
    container.addEventListener('keydown', handleKeyDown as EventListener);
  }

  // Return manager interface
  return {
    getCurrentIndex,
    focusAt,
    focusFirst,
    focusLast,
    focusNext,
    focusPrevious,
    destroy: (): void => {
      if (enableKeyboard) {
        container.removeEventListener('keydown', handleKeyDown as EventListener);
      }
      items = [];
    },
  };
}
