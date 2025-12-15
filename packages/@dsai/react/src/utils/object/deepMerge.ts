/**
 * @file deepMerge - Deep merge objects utility
 * @module @dsai/react/utils/object
 *
 * Enterprise-grade deep object merging with:
 * - Circular reference detection
 * - Maximum depth limits (prevent stack overflow)
 * - Array merge strategies (replace/concat/unique)
 * - Prototype pollution prevention
 * - Pure function (no mutations)
 * - Type-safe with strong inference
 */

import type { DeepMergeOptions } from '../types/shared';

/**
 * Deeply merge two or more objects
 *
 * @param target - Target object
 * @param sources - Source objects to merge into target
 * @param options - Merge options (array strategy, max depth)
 * @returns New merged object (does not mutate inputs)
 *
 * @throws {TypeError} If target or sources contain non-objects
 * @throws {Error} If circular reference detected
 * @throws {Error} If max depth exceeded
 * @throws {Error} If prototype pollution attempted
 *
 * @example
 * ```tsx
 * // Basic merge
 * const result = deepMerge(
 *   { a: 1, b: { c: 2 } },
 *   { b: { d: 3 }, e: 4 }
 * );
 * // => { a: 1, b: { c: 2, d: 3 }, e: 4 }
 *
 * // Array merge strategies
 * deepMerge(
 *   { tags: ['a', 'b'] },
 *   { tags: ['b', 'c'] },
 *   { arrayMergeStrategy: 'replace' }
 * ); // => { tags: ['b', 'c'] }
 *
 * deepMerge(
 *   { tags: ['a', 'b'] },
 *   { tags: ['b', 'c'] },
 *   { arrayMergeStrategy: 'concat' }
 * ); // => { tags: ['a', 'b', 'b', 'c'] }
 *
 * deepMerge(
 *   { tags: ['a', 'b'] },
 *   { tags: ['b', 'c'] },
 *   { arrayMergeStrategy: 'unique' }
 * ); // => { tags: ['a', 'b', 'c'] }
 *
 * // Max depth protection
 * deepMerge(
 *   { a: { b: { c: { d: 1 } } } },
 *   { a: { b: { c: { d: { e: 2 } } } } },
 *   { maxDepth: 3 }
 * ); // Throws Error: Maximum depth exceeded
 *
 * // Prototype pollution prevention
 * deepMerge(
 *   {},
 *   JSON.parse('{"__proto__": {"polluted": true}}')
 * ); // Throws Error: Prototype pollution attempt detected
 * ```
 */
export function deepMerge<T extends Record<string, unknown>>(
  target: T,
  ...sources: Array<Partial<T> | DeepMergeOptions>
): T {
  // Separate options from sources
  const lastArg = sources[sources.length - 1];
  const hasOptions =
    lastArg !== null &&
    typeof lastArg === 'object' &&
    !Array.isArray(lastArg) &&
    ('arrayMergeStrategy' in lastArg ||
      'maxDepth' in lastArg ||
      'allowArrayLengthMismatch' in lastArg);

  const options: DeepMergeOptions = hasOptions ? (sources.pop() as DeepMergeOptions) : {};

  const actualSources = sources as Array<Partial<T>>;

  // Extract options with defaults
  const {
    arrayMergeStrategy = 'replace',
    maxDepth = 10,
    allowArrayLengthMismatch = true,
  } = options;

  // Validate target
  if (target === null || typeof target !== 'object' || Array.isArray(target)) {
    throw new TypeError('deepMerge target must be a non-null object');
  }

  // Clone target to avoid mutation
  const result = { ...target };

  // Track visited objects for circular reference detection
  const visited = new WeakSet<object>();

  /**
   * Check if a key is a dangerous prototype key
   */
  function isDangerousKey(key: string): boolean {
    return key === '__proto__' || key === 'constructor' || key === 'prototype';
  }

  /**
   * Merge value into target at key
   */
  function mergeValue(targetValue: unknown, sourceValue: unknown, currentDepth: number): unknown {
    // Check depth limit
    if (currentDepth > maxDepth) {
      throw new Error(`deepMerge maximum depth (${maxDepth}) exceeded`);
    }

    // Handle null/undefined
    if (sourceValue === null || sourceValue === undefined) {
      return targetValue;
    }

    // Handle primitives
    if (typeof sourceValue !== 'object') {
      return sourceValue;
    }

    // Handle circular references
    if (visited.has(sourceValue as object)) {
      throw new Error('deepMerge circular reference detected');
    }

    // Handle arrays
    if (Array.isArray(sourceValue)) {
      if (!Array.isArray(targetValue)) {
        return [...sourceValue];
      }

      // Check array length mismatch
      if (!allowArrayLengthMismatch && targetValue.length !== sourceValue.length) {
        throw new Error(
          `deepMerge array length mismatch (target: ${targetValue.length}, source: ${sourceValue.length})`
        );
      }

      // Apply array merge strategy
      switch (arrayMergeStrategy) {
        case 'replace':
          return [...sourceValue];

        case 'concat':
          return [...targetValue, ...sourceValue];

        case 'unique': {
          const combined = [...targetValue, ...sourceValue];
          const seen = new Set<string>();
          return combined.filter((item) => {
            const key = JSON.stringify(item);
            if (seen.has(key)) {
              return false;
            }
            seen.add(key);
            return true;
          });
        }

        default:
          return sourceValue;
      }
    }

    // Handle objects
    if (typeof targetValue !== 'object' || targetValue === null || Array.isArray(targetValue)) {
      targetValue = {};
    }

    // Mark as visited
    visited.add(sourceValue as object);

    // Merge object properties
    const merged = { ...(targetValue as Record<string, unknown>) };

    for (const key in sourceValue) {
      if (Object.prototype.hasOwnProperty.call(sourceValue, key)) {
        // Prevent prototype pollution
        if (isDangerousKey(key)) {
          throw new Error(`deepMerge prototype pollution attempt detected: ${key}`);
        }

        const srcValue = (sourceValue as Record<string, unknown>)[key];
        const tgtValue = merged[key as keyof typeof merged];

        (merged as Record<string, unknown>)[key] = mergeValue(tgtValue, srcValue, currentDepth + 1);
      }
    }

    // Unmark after processing
    visited.delete(sourceValue as object);

    return merged;
  }

  // Merge all sources
  for (const source of actualSources) {
    if (source === null || source === undefined) {
      continue;
    }

    if (typeof source !== 'object' || Array.isArray(source)) {
      throw new TypeError('deepMerge sources must be non-null objects');
    }

    for (const key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        // Prevent prototype pollution
        if (isDangerousKey(key)) {
          throw new Error(`deepMerge prototype pollution attempt detected: ${key}`);
        }

        const sourceValue = source[key as keyof typeof source];
        const targetValue = result[key as keyof T];

        (result as Record<string, unknown>)[key] = mergeValue(
          targetValue,
          sourceValue,
          0
        ) as T[keyof T];
      }
    }
  }

  return result as T;
}
