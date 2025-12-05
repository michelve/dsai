let counter = 0;

/**
 * generateId - SSR-safe, deterministic-ish ID generator with prefix support.
 *
 * Uses an incrementing counter; in non-browser environments, falls back to
 * a monotonic counter only (no access to window).
 *
 * @example
 * const id = generateId('input'); // input-1
 */
export function generateId(prefix = 'id'): string {
  counter += 1;
  return `${prefix}-${counter}`;
}

export default generateId;
