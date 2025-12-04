/**
 * isEscapeKey - Detects Escape keypress (KeyboardEvent.key based).
 */
export function isEscapeKey(event: { key?: string; keyCode?: number }): boolean {
  return event.key === 'Escape' || event.key === 'Esc' || event.keyCode === 27;
}

export default isEscapeKey;
