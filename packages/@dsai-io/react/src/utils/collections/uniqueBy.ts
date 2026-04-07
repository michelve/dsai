/**
 * @file uniqueBy - Extract unique items from an array by key
 * @module @dsai-io/react/utils/collections
 *
 * Enterprise-grade utility for deduplicating arrays based on a key extractor.
 * Preserves the first occurrence of each unique key.
 *
 * Features:
 * - Type-safe key extractor
 * - Preserves original item order
 * - Does not mutate original array
 * - SSR-safe (no DOM dependencies)
 * - Handles edge cases (empty arrays, null values)
 */

import type { KeyExtractor } from '../types/shared';

/**
 * Options for uniqueBy
 */
export interface UniqueByOptions {
  /**
   * Strategy for handling key collisions
   * - 'first': Keep the first occurrence (default)
   * - 'last': Keep the last occurrence
   */
  keepStrategy?: 'first' | 'last';

  /**
   * Optional key serializer to control how keys are compared.
   * Default behavior coerces to string/number which can collide for non-primitive keys.
   */
  keySerializer?: (key: unknown) => string | number;
}

/**
 * Extracts unique items from an array based on a key extractor function.
 * By default, keeps the first occurrence of each unique key.
 *
 * @param array - The array to deduplicate (not mutated)
 * @param keyFn - Function to extract the key from each item
 * @param options - Options for deduplication behavior
 * @returns A new array with unique items
 *
 * @example
 * ```tsx
 * // Basic usage with objects
 * const users = [
 *   { id: 1, name: 'Alice' },
 *   { id: 2, name: 'Bob' },
 *   { id: 1, name: 'Alice Clone' }
 * ];
 *
 * const unique = uniqueBy(users, user => user.id);
 * // [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }]
 *
 * // Keep last occurrence instead
 * const uniqueLast = uniqueBy(users, user => user.id, { keepStrategy: 'last' });
 * // [{ id: 2, name: 'Bob' }, { id: 1, name: 'Alice Clone' }]
 *
 * // With primitive values
 * const numbers = [1, 2, 2, 3, 3, 3];
 * const uniqueNumbers = uniqueBy(numbers, n => n);
 * // [1, 2, 3]
 *
 * // Using computed keys
 * const items = ['Apple', 'apple', 'BANANA', 'banana'];
 * const uniqueLower = uniqueBy(items, s => s.toLowerCase());
 * // ['Apple', 'BANANA']
 * ```
 *
 * @throws {TypeError} If array is not an array
 * @throws {TypeError} If keyFn is not a function
 */
export function uniqueBy<T>(
  array: readonly T[],
  keyFn: KeyExtractor<T>,
  options: UniqueByOptions = {}
): T[] {
  // Validate input
  if (!Array.isArray(array)) {
    throw new TypeError('uniqueBy: Expected an array');
  }

  if (typeof keyFn !== 'function') {
    throw new TypeError('uniqueBy: Expected keyFn to be a function');
  }

  // Early return for empty arrays
  if (array.length === 0) {
    return [];
  }

  const { keepStrategy = 'first', keySerializer } = options;

  const serialize = (key: unknown): string | number => {
    if (keySerializer) {
      return keySerializer(key);
    }
    if (typeof key === 'string' || typeof key === 'number') {
      return key;
    }
    return String(key);
  };

  if (keepStrategy === 'last') {
    // For 'last' strategy, iterate from end and reverse at the end
    const seen = new Map<string | number, T>();

    // Iterate in reverse by creating a reversed copy
    const reversed = [...array].reverse();
    for (const item of reversed) {
      const key = serialize(keyFn(item));
      if (!seen.has(key)) {
        seen.set(key, item);
      }
    }

    // Reverse to maintain relative order of kept items
    return Array.from(seen.values()).reverse();
  }

  // Default 'first' strategy
  const seen = new Set<string | number>();
  const result: T[] = [];

  for (const item of array) {
    const key = serialize(keyFn(item));

    if (!seen.has(key)) {
      seen.add(key);
      result.push(item);
    }
  }

  return result;
}

/**
 * Convenience function to get unique items by a specific property key.
 *
 * @param array - The array to deduplicate
 * @param key - The property key to use for uniqueness
 * @param options - Options for deduplication behavior
 * @returns A new array with unique items
 *
 * @example
 * ```tsx
 * const users = [
 *   { id: 1, name: 'Alice' },
 *   { id: 2, name: 'Bob' },
 *   { id: 1, name: 'Alice Clone' }
 * ];
 *
 * const unique = uniqueByKey(users, 'id');
 * // [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }]
 * ```
 */
export function uniqueByKey<T extends Record<string, unknown>, K extends keyof T>(
  array: readonly T[],
  key: K,
  options: UniqueByOptions = {}
): T[] {
  return uniqueBy(
    array,
    (item) => {
      const value = Reflect.get(item, key) as unknown;
      if (typeof value === 'string' || typeof value === 'number') {
        return value;
      }
      return String(value);
    },
    options
  );
}

export type { KeyExtractor } from '../types/shared';
