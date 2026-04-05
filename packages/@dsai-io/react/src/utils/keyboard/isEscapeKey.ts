/**
 * isEscapeKey - Detects Escape keypress with IME composition safety.
 *
 * Checks the modern `code` property first, falls back to `key` (including
 * legacy 'Esc' variant), and supports legacy `keyCode`. Safe to use during
 * IME composition.
 *
 * @param event - Keyboard event or event-like object
 * @returns true if the event represents an Escape key press
 *
 * @example
 * ```tsx
 * <div onKeyDown={(e) => {
 *   if (isEscapeKey(e)) {
 *     closeModal();
 *   }
 * }} />
 * ```
 */
/** Legacy keyCode value for the Escape key */
const ESCAPE_KEY_CODE = 27;

export function isEscapeKey(event: {
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
  if (event.code === 'Escape') {
    return true;
  }

  // Fallback: event.key (including legacy 'Esc')
  if (event.key === 'Escape' || event.key === 'Esc') {
    return true;
  }

  // Legacy: keyCode
  return event.keyCode === ESCAPE_KEY_CODE;
}

export default isEscapeKey;
