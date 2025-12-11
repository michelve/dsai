// Counter for deterministic, SSR-safe ID generation
let counter = 0;

/**
 * generateId - SSR-safe, deterministic ID generator with prefix support.
 *
 * Uses an incrementing counter to ensure consistent IDs across SSR and client.
 * This is the canonical implementation used throughout the design system.
 *
 * @param prefix - Optional prefix for the ID (default: 'id')
 * @returns A unique ID string in the format `${prefix}-${counter}`
 *
 * @example
 * const id = generateId('input'); // => 'input-1'
 * const id2 = generateId('button'); // => 'button-2'
 */
export function generateId(prefix = 'id'): string {
  counter += 1;
  return `${prefix}-${counter}`;
}

export default generateId;
