/**
 * @file deepMerge - Deep merge objects utility
 * @module @dsai-io/react/utils/object
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

/**
 * Check if a key is a dangerous prototype key
 */
function isDangerousKey(key: string): boolean {
  return key === '__proto__' || key === 'constructor' || key === 'prototype';
}

/**
 * Merge two arrays using the specified strategy
 */
function mergeArrays(
  targetArr: unknown[],
  sourceArr: unknown[],
  strategy: string,
  allowMismatch: boolean
): unknown[] {
  if (!allowMismatch && targetArr.length !== sourceArr.length) {
    throw new Error(
      `deepMerge array length mismatch (target: ${targetArr.length}, source: ${sourceArr.length})`
    );
  }

  switch (strategy) {
    case 'replace':
      return [...sourceArr];

    case 'concat':
      return [...targetArr, ...sourceArr];

    case 'unique': {
      const combined = [...targetArr, ...sourceArr];
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
      return [...sourceArr];
  }
}

/**
 * Separate options from sources in deepMerge arguments
 */
function parseDeepMergeArgs<T>(sources: Array<Partial<T> | DeepMergeOptions>): {
  options: DeepMergeOptions;
  actualSources: Array<Partial<T>>;
} {
  const lastArg = sources.at(-1);
  const hasOptions =
    lastArg !== null &&
    typeof lastArg === 'object' &&
    !Array.isArray(lastArg) &&
    ('arrayMergeStrategy' in lastArg ||
      'maxDepth' in lastArg ||
      'allowArrayLengthMismatch' in lastArg);

  const options: DeepMergeOptions = hasOptions ? (sources.pop() as DeepMergeOptions) : {};
  return { options, actualSources: sources as Array<Partial<T>> };
}

/**
 * Merge properties from a single source object into the result
 */
function mergeSingleSource(
  result: Record<string, unknown>,
  source: Record<string, unknown>,
  mergeValueFn: (t: unknown, s: unknown, d: number) => unknown
): void {
  const hasOwn = Object.prototype.hasOwnProperty;
  for (const key in source) {
    if (!hasOwn.call(source, key)) {
      continue;
    }

    if (isDangerousKey(key)) {
      throw new Error(`deepMerge prototype pollution attempt detected: ${key}`);
    }

    const sourceValue = Reflect.get(source as object, key) as unknown;
    const targetValue = Reflect.get(result as object, key) as unknown;

    Reflect.set(result as object, key, mergeValueFn(targetValue, sourceValue, 0));
  }
}

export function deepMerge<T extends Record<string, unknown>>(
  target: T,
  ...sources: Array<Partial<T> | DeepMergeOptions>
): T {
  const { options, actualSources } = parseDeepMergeArgs<T>(sources);

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
  const visited = new WeakSet();

  function mergeValue(targetValue: unknown, sourceValue: unknown, currentDepth: number): unknown {
    if (currentDepth > maxDepth) {
      throw new Error(`deepMerge maximum depth (${maxDepth}) exceeded`);
    }

    if (sourceValue === null || sourceValue === undefined) {
      return targetValue;
    }

    if (typeof sourceValue !== 'object') {
      return sourceValue;
    }

    if (visited.has(sourceValue)) {
      throw new Error('deepMerge circular reference detected');
    }

    if (Array.isArray(sourceValue)) {
      if (!Array.isArray(targetValue)) {
        return [...sourceValue];
      }
      return mergeArrays(targetValue, sourceValue, arrayMergeStrategy, allowArrayLengthMismatch);
    }

    return mergeObjectValue(targetValue, sourceValue, currentDepth);
  }

  function mergeObjectValue(
    targetValue: unknown,
    sourceValue: object,
    currentDepth: number
  ): Record<string, unknown> {
    if (typeof targetValue !== 'object' || targetValue === null || Array.isArray(targetValue)) {
      targetValue = {};
    }

    visited.add(sourceValue);

    const merged = { ...(targetValue as Record<string, unknown>) };

    const hasOwn = Object.prototype.hasOwnProperty;
    for (const key in sourceValue) {
      if (!hasOwn.call(sourceValue, key)) {
        continue;
      }

      if (isDangerousKey(key)) {
        throw new Error(`deepMerge prototype pollution attempt detected: ${key}`);
      }

      const srcValue = Reflect.get(sourceValue, key);
      const tgtValue = Reflect.get(merged as object, key);

      Reflect.set(merged as object, key, mergeValue(tgtValue, srcValue, currentDepth + 1));
    }

    visited.delete(sourceValue);

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

    mergeSingleSource(result, source as Record<string, unknown>, mergeValue);
  }

  return result;
}
