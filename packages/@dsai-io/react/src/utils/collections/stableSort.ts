/**
 * @file stableSort - Stable sorting with comparator function
 * @module @dsai-io/react/utils/collections
 *
 * Enterprise-grade stable sort utility that preserves relative order
 * of equal elements (stability), unlike native Array.sort in some engines.
 *
 * Features:
 * - Guaranteed stability across all environments
 * - Type-safe comparator function
 * - Does not mutate original array
 * - SSR-safe (no DOM dependencies)
 * - Handles edge cases (empty arrays, single items)
 */

import type { Comparator } from '../types/shared';

/**
 * Options for stable sort
 */
export interface StableSortOptions<T> {
  /**
   * Comparator function for ordering elements.
   * Returns negative if a < b, positive if a > b, zero if equal.
   * @default Natural string comparison using localeCompare
   */
  comparator?: Comparator<T>;

  /**
   * Sort in descending order (reverse the comparator result)
   * @default false
   */
  descending?: boolean;
}

/**
 * Default comparator for natural ordering
 * Uses localeCompare for strings, numeric comparison for numbers
 */
function defaultComparator<T>(a: T, b: T): number {
  // Handle null/undefined
  if (a === null || a === undefined) {
    if (b === null || b === undefined) {
      return 0;
    }
    return -1;
  }
  if (b === null || b === undefined) {
    return 1;
  }

  // String comparison
  if (typeof a === 'string' && typeof b === 'string') {
    return a.localeCompare(b);
  }

  // Numeric comparison
  if (typeof a === 'number' && typeof b === 'number') {
    // Handle NaN
    if (Number.isNaN(a) && Number.isNaN(b)) {
      return 0;
    }
    if (Number.isNaN(a)) {
      return 1;
    }
    if (Number.isNaN(b)) {
      return -1;
    }
    return a - b;
  }

  // Date comparison
  if (a instanceof Date && b instanceof Date) {
    return a.getTime() - b.getTime();
  }

  // Boolean comparison (false < true)
  if (typeof a === 'boolean' && typeof b === 'boolean') {
    if (a === b) { return 0; }
    return a ? 1 : -1;
  }

  // Fallback: convert to string
  return String(a).localeCompare(String(b));
}

/**
 * Performs a stable sort on an array, preserving the relative order
 * of elements that compare equal.
 *
 * Unlike native Array.sort(), this implementation guarantees stability
 * across all JavaScript engines and environments.
 *
 * @param array - The array to sort (not mutated)
 * @param options - Sort options including comparator and direction
 * @returns A new sorted array
 *
 * @example
 * ```tsx
 * // Basic usage with default comparator
 * const numbers = [3, 1, 4, 1, 5, 9, 2, 6];
 * const sorted = stableSort(numbers);
 * // [1, 1, 2, 3, 4, 5, 6, 9]
 *
 * // Custom comparator for objects
 * const users = [
 *   { name: 'Alice', age: 30 },
 *   { name: 'Bob', age: 25 },
 *   { name: 'Charlie', age: 30 }
 * ];
 *
 * const byAge = stableSort(users, {
 *   comparator: (a, b) => a.age - b.age
 * });
 * // [{ name: 'Bob', age: 25 }, { name: 'Alice', age: 30 }, { name: 'Charlie', age: 30 }]
 * // Note: Alice comes before Charlie (stability preserved)
 *
 * // Descending order
 * const highToLow = stableSort(numbers, { descending: true });
 * // [9, 6, 5, 4, 3, 2, 1, 1]
 *
 * // Stable sort demonstration
 * const items = [
 *   { category: 'A', order: 1 },
 *   { category: 'B', order: 2 },
 *   { category: 'A', order: 3 }
 * ];
 * const byCategory = stableSort(items, {
 *   comparator: (a, b) => a.category.localeCompare(b.category)
 * });
 * // Both category 'A' items maintain their original relative order (1 before 3)
 * ```
 *
 * @throws {TypeError} If array is not an array
 */
export function stableSort<T>(array: readonly T[], options: StableSortOptions<T> = {}): T[] {
  // Validate input
  if (!Array.isArray(array)) {
    throw new TypeError('stableSort: Expected an array');
  }

  // Early return for empty or single-element arrays
  if (array.length <= 1) {
    return [...array];
  }

  const { comparator = defaultComparator, descending = false } = options;

  // Create indexed pairs to track original positions
  const indexed: Array<[T, number]> = array.map((item, index) => [item, index]);

  // Sort with stability: when comparator returns 0, use original index
  indexed.sort((a, b) => {
    const result = comparator(a[0], b[0]);

    // Apply descending modifier
    const adjustedResult = descending ? -result : result;

    // If equal, preserve original order (stability)
    if (adjustedResult === 0) {
      return a[1] - b[1];
    }

    return adjustedResult;
  });

  // Extract sorted items
  return indexed.map(([item]) => item);
}

/**
 * Creates a comparator function from a key extractor
 *
 * @param keyFn - Function to extract the comparison key from an item
 * @returns Comparator function
 *
 * @example
 * ```tsx
 * const users = [
 *   { name: 'Alice', age: 30 },
 *   { name: 'Bob', age: 25 }
 * ];
 *
 * const byAge = stableSort(users, {
 *   comparator: sortBy(user => user.age)
 * });
 * ```
 */
export function sortBy<T, K>(keyFn: (item: T) => K): Comparator<T> {
  return (a: T, b: T) => defaultComparator(keyFn(a), keyFn(b));
}

/**
 * Combines multiple comparators with priority order
 * (first comparator has highest priority)
 *
 * @param comparators - Array of comparator functions
 * @returns Combined comparator function
 *
 * @example
 * ```tsx
 * const users = [
 *   { name: 'Alice', age: 30 },
 *   { name: 'Bob', age: 30 },
 *   { name: 'Charlie', age: 25 }
 * ];
 *
 * const sortedUsers = stableSort(users, {
 *   comparator: composeComparators([
 *     sortBy(u => u.age),
 *     sortBy(u => u.name)
 *   ])
 * });
 * // Sorted by age first, then by name for equal ages
 * ```
 */
export function composeComparators<T>(comparators: readonly Comparator<T>[]): Comparator<T> {
  return (a: T, b: T) => {
    for (const comparator of comparators) {
      const result = comparator(a, b);
      if (result !== 0) {
        return result;
      }
    }
    return 0;
  };
}

export type { Comparator };
