/**
 * isEnterKey - Detects Enter keypress with IME composition safety.
 *
 * Checks the modern `code` property first, falls back to `key`, and
 * supports legacy `keyCode`. Safe to use during IME composition.
 *
 * @param event - Keyboard event or event-like object
 * @returns true if the event represents an Enter key press
 *
 * @example
 * ```tsx
 * <input onKeyDown={(e) => {
 *   if (isEnterKey(e)) {
 *     handleSubmit();
 *   }
 * }} />
 * ```
 */
export function isEnterKey(event: {
  code?: string;
  key?: string;
  keyCode?: number;
  isComposing?: boolean;
}): boolean {
  // Ignore events during IME composition
  if (event.isComposing) {
    return false;
  }

  // Modern standard: event.code
  if (event.code === 'Enter' || event.code === 'NumpadEnter') {
    return true;
  }

  // Fallback: event.key
  if (event.key === 'Enter') {
    return true;
  }

  // Legacy: keyCode
  return event.keyCode === 13;
}

export default isEnterKey;
