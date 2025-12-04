/**
 * isEnterKey - Detects Enter keypress (KeyboardEvent.key based).
 */
export function isEnterKey(event: { key?: string; keyCode?: number }): boolean {
  return event.key === 'Enter' || event.keyCode === 13;
}

export default isEnterKey;
