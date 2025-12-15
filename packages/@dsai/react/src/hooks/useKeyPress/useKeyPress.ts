import { useEffect, useState } from 'react';

import { isBrowser } from '../../utils/browser/isBrowser';

import type { UseKeyPressOptions, UseKeyPressReturn } from './useKeyPress.types';

/**
 * Detects keyboard shortcut presses with support for modifiers and form tag filtering.
 *
 * This hook provides a declarative API for keyboard shortcuts, handling edge cases
 * like form element focus, modifier keys, and cleanup automatically. It's essential
 * for implementing keyboard navigation, command palettes, and accessibility features.
 *
 * **Key Features**:
 * - Single key or array of keys support
 * - Modifier keys (Ctrl, Cmd, Alt, Shift)
 * - Form tag filtering (prevent shortcuts in inputs)
 * - Custom target element support
 * - Returns current pressed state
 * - SSR-safe
 * - Automatic cleanup
 *
 * **Supported Key Formats**:
 * - Single keys: 'a', 'Enter', 'Escape', 'ArrowUp'
 * - Modifiers: 'Control', 'Meta', 'Alt', 'Shift'
 * - Case-insensitive matching
 *
 * @param keys - Single key or array of keys to detect
 * @param callback - Function to call when key is pressed
 * @param options - Configuration options
 * @returns True when the key is currently pressed
 *
 * @example
 * ```tsx
 * function SearchModal() {
 *   const [isOpen, setIsOpen] = useState(false);
 *
 *   // Cmd+K or Ctrl+K to open search
 *   useKeyPress(['k'], (e) => {
 *     if (e.metaKey || e.ctrlKey) {
 *       e.preventDefault();
 *       setIsOpen(true);
 *     }
 *   });
 *
 *   // Escape to close
 *   useKeyPress(['Escape'], () => setIsOpen(false));
 *
 *   return isOpen ? <SearchDialog onClose={() => setIsOpen(false)} /> : null;
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Get current pressed state
 * function KeyIndicator() {
 *   const isShiftPressed = useKeyPress(['Shift']);
 *   const isCtrlPressed = useKeyPress(['Control']);
 *
 *   return (
 *     <div>
 *       Shift: {isShiftPressed ? '✓' : '✗'}
 *       <br />
 *       Ctrl: {isCtrlPressed ? '✓' : '✗'}
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Disable shortcuts in form fields
 * function TodoList() {
 *   const inputRef = useRef<HTMLInputElement>(null);
 *
 *   // Shortcuts disabled when typing in input
 *   useKeyPress(['n'], () => {
 *     addNewTodo();
 *   }, { enableOnFormTags: false }); // default behavior
 *
 *   // Shortcuts work even in form fields
 *   useKeyPress(['Escape'], () => {
 *     inputRef.current?.blur();
 *   }, { enableOnFormTags: true });
 *
 *   return <input ref={inputRef} />;
 * }
 * ```
 */
export function useKeyPress(
  keys: string | string[],
  callback: (event: KeyboardEvent) => void,
  options: UseKeyPressOptions = {}
): UseKeyPressReturn {
  const {
    event = 'keydown',
    target,
    enableOnFormTags = false,
    eventOptions = { passive: true },
  } = options;

  const [keyPressed, setKeyPressed] = useState<boolean>(false);

  useEffect(() => {
    if (!isBrowser()) {
      return;
    }

    const keysArray = Array.isArray(keys) ? keys : [keys];
    const keysLower = keysArray
      .map((key) => key?.toLowerCase?.())
      .filter((key): key is string => Boolean(key));

    if (keysLower.length === 0) {
      return;
    }

    const handleKeyEvent = (e: KeyboardEvent): void => {
      const keyLower = e.key?.toLowerCase?.();
      if (!keyLower) {
        return;
      }

      // Check if pressed key matches any of the target keys
      if (!keysLower.includes(keyLower)) {
        return;
      }

      // Filter form tags unless explicitly enabled
      if (!enableOnFormTags) {
        const targetElement = e.target as HTMLElement | null;
        const tagName = targetElement?.tagName?.toLowerCase();
        if (tagName && ['input', 'textarea', 'select'].includes(tagName)) {
          return;
        }
      }

      // Update pressed state
      if (event === 'keydown') {
        setKeyPressed(true);
      }

      // Call callback
      callback(e);
    };

    const handleKeyUp = (e: KeyboardEvent): void => {
      const keyLower = e.key.toLowerCase();
      if (keysLower.includes(keyLower)) {
        setKeyPressed(false);
      }
    };

    // Determine target element
    let targetElement: Document | Window | HTMLElement | null = window;
    if (target) {
      if ('current' in target) {
        targetElement = target.current;
      } else {
        targetElement = target as Document | Window;
      }
    }

    if (!targetElement) {
      return;
    }

    // Add event listeners
    targetElement.addEventListener(event, handleKeyEvent as EventListener, eventOptions);

    // Always listen for keyup to reset pressed state
    if (event === 'keydown') {
      targetElement.addEventListener('keyup', handleKeyUp as EventListener, eventOptions);
    }

    // Cleanup
    return () => {
      targetElement?.removeEventListener(event, handleKeyEvent as EventListener, eventOptions);
      if (event === 'keydown') {
        targetElement?.removeEventListener('keyup', handleKeyUp as EventListener, eventOptions);
      }
    };
  }, [keys, callback, event, target, enableOnFormTags, eventOptions]);

  return keyPressed;
}
