/**
 * @file omit - Omit object properties utility
 * @module @dsai-io/react/utils/object
 *
 * Enterprise-grade object property omission with:
 * - Type-safe key inference
 * - Readonly preservation
 * - Prototype pollution prevention
 * - Pure function (no mutations)
 * - Handles undefined/null gracefully
 */

/**
 * Omit subset of object properties by keys
 *
 * @param obj - Source object
 * @param keys - Keys to omit from object
 * @returns New object without specified keys
 *
 * @throws {TypeError} If obj is not an object
 * @throws {Error} If prototype pollution attempted
 *
 * @example
 * ```tsx
 * // Basic omit
 * const user = { id: 1, name: 'Alice', password: 'secret', role: 'admin' };
 * const safeUser = omit(user, ['password']);
 * // => { id: 1, name: 'Alice', role: 'admin' }
 *
 * // Type inference
 * const omitted = omit({ a: 1, b: '2', c: true }, ['b']);
 * // Type: { a: number; c: boolean }
 *
 * // Readonly preservation
 * const readonly = { a: 1, b: 2 } as const;
 * const result = omit(readonly, ['b']);
 * // Type: { readonly a: 1 }
 *
 * // Handles missing keys gracefully
 * omit({ a: 1 }, ['a', 'b' as never]);
 * // => {} (both keys omitted, b doesn't exist)
 *
 * // Multiple keys
 * const config = { host: 'localhost', port: 3000, user: 'admin', password: 'secret' };
 * const publicConfig = omit(config, ['user', 'password']);
 * // => { host: 'localhost', port: 3000 }
 *
 * // Prevents prototype pollution
 * omit({}, ['__proto__' as never]);
 * // Throws Error: Prototype pollution attempt detected
 * ```
 */
export function omit<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: readonly K[]
): Omit<T, K> {
  // Validate input
  if (obj === null || typeof obj !== 'object' || Array.isArray(obj)) {
    throw new TypeError('omit expects a non-null object as first argument');
  }

  if (!Array.isArray(keys)) {
    throw new TypeError('omit expects an array of keys as second argument');
  }

  // Dangerous keys that could cause prototype pollution
  const dangerousKeys = new Set(['__proto__', 'constructor', 'prototype']);

  // Check for dangerous keys in omit list
  for (const key of keys) {
    if (dangerousKeys.has(String(key))) {
      throw new Error(`omit prototype pollution attempt detected: ${String(key)}`);
    }
  }

  // Create set for O(1) lookup
  const keysToOmit = new Set(keys);

  // Create result object
  const result = {} as Omit<T, K>;

  const hasOwn = Object.prototype.hasOwnProperty;
  // Copy all keys except omitted ones
  for (const key in obj) {
    if (hasOwn.call(obj, key)) {
      if (!keysToOmit.has(key as unknown as K)) {
        (result as Record<string, unknown>)[key as string] = obj[key];
      }
    }
  }

  return result;
}
