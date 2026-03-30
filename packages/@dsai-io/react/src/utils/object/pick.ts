/**
 * @file pick - Pick object properties utility
 * @module @dsai-io/react/utils/object
 *
 * Enterprise-grade object property picking with:
 * - Type-safe key inference
 * - Readonly preservation
 * - Prototype pollution prevention
 * - Pure function (no mutations)
 * - Handles undefined/null gracefully
 */

/**
 * Pick subset of object properties by keys
 *
 * @param obj - Source object
 * @param keys - Keys to pick from object
 * @returns New object with only specified keys
 *
 * @throws {TypeError} If obj is not an object
 * @throws {Error} If prototype pollution attempted
 *
 * @example
 * ```tsx
 * // Basic pick
 * const user = { id: 1, name: 'Alice', email: 'alice@example.com', role: 'admin' };
 * const publicUser = pick(user, ['id', 'name']);
 * // => { id: 1, name: 'Alice' }
 *
 * // Type inference
 * const picked = pick({ a: 1, b: '2', c: true }, ['a', 'c']);
 * // Type: { a: number; c: boolean }
 *
 * // Readonly preservation
 * const readonly = { a: 1, b: 2 } as const;
 * const result = pick(readonly, ['a']);
 * // Type: { readonly a: 1 }
 *
 * // Handles missing keys gracefully
 * pick({ a: 1 }, ['a', 'b' as never]);
 * // => { a: 1 } (b is not in result)
 *
 * // Prevents prototype pollution
 * pick({}, ['__proto__' as never]);
 * // Throws Error: Prototype pollution attempt detected
 * ```
 */
export function pick<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: readonly K[]
): Pick<T, K> {
  // Validate input
  if (obj === null || typeof obj !== 'object' || Array.isArray(obj)) {
    throw new TypeError('pick expects a non-null object as first argument');
  }

  if (!Array.isArray(keys)) {
    throw new TypeError('pick expects an array of keys as second argument');
  }

  // Create result object
  const result = {} as Pick<T, K>;

  // Dangerous keys that could cause prototype pollution
  const dangerousKeys = new Set(['__proto__', 'constructor', 'prototype']);

  // Pick specified keys
  for (const key of keys) {
    // Prevent prototype pollution
    if (dangerousKeys.has(String(key))) {
      throw new Error(`pick prototype pollution attempt detected: ${String(key)}`);
    }

    const hasOwn = Object.prototype.hasOwnProperty;
    // Only copy if key exists in source object (own property)
    if (hasOwn.call(obj, key)) {
      Reflect.set(result, key as string, Reflect.get(obj, key as string));
    }
  }

  return result;
}
