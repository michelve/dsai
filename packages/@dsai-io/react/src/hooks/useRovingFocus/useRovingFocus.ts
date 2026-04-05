import { useCallback, useState, type KeyboardEvent } from 'react';

import type {
  UseRovingFocusOptions,
  UseRovingFocusReturn,
} from './useRovingFocus.types';

/** Returns the previous/next arrow keys for the given orientation */
function getDirectionKeys(orientation: 'vertical' | 'horizontal' | 'both'): {
  prevKeys: string[];
  nextKeys: string[];
} {
  if (orientation === 'both') {
    return { prevKeys: ['ArrowUp', 'ArrowLeft'], nextKeys: ['ArrowDown', 'ArrowRight'] };
  }
  if (orientation === 'horizontal') {
    return { prevKeys: ['ArrowLeft'], nextKeys: ['ArrowRight'] };
  }
  return { prevKeys: ['ArrowUp'], nextKeys: ['ArrowDown'] };
}

/**
 * Manages roving tabindex focus within a container of interactive items.
 *
 * Implements the WAI-ARIA roving tabindex pattern: only the currently focused
 * item has `tabindex="0"`, all others have `tabindex="-1"`. Supports vertical,
 * horizontal, and both orientations with optional wrapping and Home/End keys.
 *
 * @param options - Configuration for the roving focus behavior.
 * @returns An object containing container props, the focused index, and a setter.
 *
 * @example
 * ```tsx
 * function Listbox() {
 *   const ref = useRef<HTMLUListElement>(null);
 *   const { containerProps } = useRovingFocus({
 *     containerRef: ref,
 *     itemSelector: '[role="option"]',
 *   });
 *
 *   return (
 *     <ul ref={ref} role="listbox" {...containerProps}>
 *       <li role="option" tabIndex={0}>Item 1</li>
 *       <li role="option" tabIndex={-1}>Item 2</li>
 *     </ul>
 *   );
 * }
 * ```
 */
export function useRovingFocus({
  containerRef,
  orientation = 'vertical',
  wrap = true,
  homeEnd = true,
  itemSelector = '[role="option"]',
  disabledSelector = '[aria-disabled="true"]',
  enabled = true,
}: UseRovingFocusOptions): UseRovingFocusReturn {
  const [focusedIndex, setFocusedIndexState] = useState(0);

  const getFocusableItems = useCallback((): HTMLElement[] => {
    if (!containerRef.current) {
      return [];
    }
    try {
      return Array.from(
        containerRef.current.querySelectorAll<HTMLElement>(itemSelector),
      );
    } catch {
      return [];
    }
  }, [containerRef, itemSelector]);

  const isDisabled = useCallback(
    (el: HTMLElement): boolean => {
      if (!disabledSelector) {
        return false;
      }
      try {
        return el.matches(disabledSelector);
      } catch {
        return false;
      }
    },
    [disabledSelector],
  );

  const focusItem = useCallback(
    (items: HTMLElement[], index: number) => {
      const item = Reflect.get(items, index) as HTMLElement | undefined;
      if (!item) {
        return;
      }

      // Update tabIndex on all items
      for (const el of items) {
        el.setAttribute('tabindex', '-1');
      }
      item.setAttribute('tabindex', '0');
      item.focus();

      setFocusedIndexState(index);
    },
    [setFocusedIndexState],
  );

  const findNextIndex = useCallback(
    (items: HTMLElement[], current: number, direction: 1 | -1): number => {
      const len = items.length;
      let next = current + direction;

      for (let i = 0; i < len; i++) {
        if (wrap) {
          next = ((next % len) + len) % len;
        } else if (next < 0 || next >= len) {
          return current;
        }

        const item = Reflect.get(items, next) as HTMLElement | undefined;
        if (item && !isDisabled(item)) {
          return next;
        }
        next += direction;
      }

      return current;
    },
    [wrap, isDisabled],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      if (!enabled || typeof document === 'undefined') {
        return;
      }

      const items = getFocusableItems();
      if (items.length === 0) {
        return;
      }

      // Find current focused index from DOM
      const currentIndex = items.findIndex(
        (el) =>
          el === document.activeElement ||
          el.contains(document.activeElement),
      );
      if (currentIndex === -1) {
        return;
      }

      const { prevKeys, nextKeys } = getDirectionKeys(orientation);

      if (nextKeys.includes(event.key)) {
        event.preventDefault();
        const next = findNextIndex(items, currentIndex, 1);
        focusItem(items, next);
      } else if (prevKeys.includes(event.key)) {
        event.preventDefault();
        const next = findNextIndex(items, currentIndex, -1);
        focusItem(items, next);
      } else if (homeEnd && event.key === 'Home') {
        event.preventDefault();
        const first = findNextIndex(items, -1, 1);
        focusItem(items, first);
      } else if (homeEnd && event.key === 'End') {
        event.preventDefault();
        const last = findNextIndex(items, items.length, -1);
        focusItem(items, last);
      }
    },
    [enabled, getFocusableItems, orientation, findNextIndex, focusItem, homeEnd],
  );

  const setFocusedIndex = useCallback(
    (index: number) => {
      const items = getFocusableItems();
      if (index >= 0 && index < items.length) {
        focusItem(items, index);
      }
    },
    [getFocusableItems, focusItem],
  );

  return {
    containerProps: { onKeyDown: handleKeyDown },
    focusedIndex,
    setFocusedIndex,
  };
}
