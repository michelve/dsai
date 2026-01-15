/**
 * @file chunk - Split an array into chunks of a specified size
 * @module @dsai/react/utils/collections
 *
 * Enterprise-grade utility for splitting arrays into fixed-size chunks.
 * Useful for pagination, batch processing, and grid layouts.
 *
 * Features:
 * - Type-safe with preserved item types
 * - Does not mutate original array
 * - Handles remainders gracefully
 * - SSR-safe (no DOM dependencies)
 * - Supports various chunk configurations
 */

/**
 * Options for chunk utility
 */
export interface ChunkOptions {
  /**
   * Whether to pad the last chunk with undefined values
   * to match the chunk size.
   * @default false
   */
  padLastChunk?: boolean;

  /**
   * Value to use for padding if padLastChunk is true.
   * @default undefined
   */
  padValue?: unknown;
}

/**
 * Splits an array into chunks of a specified size.
 * The last chunk may be smaller than the specified size
 * unless padding is enabled.
 *
 * @param array - The array to split into chunks (not mutated)
 * @param size - The size of each chunk (must be positive integer)
 * @param options - Options for chunking behavior
 * @returns An array of chunks
 *
 * @example
 * ```tsx
 * // Basic usage
 * const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
 *
 * chunk(numbers, 3);
 * // [[1, 2, 3], [4, 5, 6], [7, 8, 9], [10]]
 *
 * chunk(numbers, 5);
 * // [[1, 2, 3, 4, 5], [6, 7, 8, 9, 10]]
 *
 * // With padding
 * chunk(numbers, 4, { padLastChunk: true });
 * // [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, undefined, undefined]]
 *
 * // With custom pad value
 * chunk(numbers, 4, { padLastChunk: true, padValue: 0 });
 * // [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 0, 0]]
 *
 * // Grid layout example
 * const items = ['A', 'B', 'C', 'D', 'E'];
 * const rows = chunk(items, 2);
 * // [['A', 'B'], ['C', 'D'], ['E']]
 *
 * // Batch processing
 * const records = getData(); // 1000 records
 * const batches = chunk(records, 100);
 * for (const batch of batches) {
 *   await processBatch(batch);
 * }
 * ```
 *
 * @throws {TypeError} If array is not an array
 * @throws {RangeError} If size is not a positive integer
 */
export function chunk<T>(array: readonly T[], size: number, options: ChunkOptions = {}): T[][] {
  // Validate input
  if (!Array.isArray(array)) {
    throw new TypeError('chunk: Expected an array');
  }

  if (!Number.isInteger(size) || size <= 0) {
    throw new RangeError('chunk: Size must be a positive integer');
  }

  // Early return for empty arrays
  if (array.length === 0) {
    return [];
  }

  const { padLastChunk = false, padValue } = options;

  const result: T[][] = [];
  const totalChunks = Math.ceil(array.length / size);

  for (let i = 0; i < totalChunks; i++) {
    const start = i * size;
    const end = Math.min(start + size, array.length);
    const currentChunk = array.slice(start, end);

    // Pad the last chunk if needed
    if (padLastChunk && i === totalChunks - 1 && currentChunk.length < size) {
      const paddingNeeded = size - currentChunk.length;
      for (let j = 0; j < paddingNeeded; j++) {
        currentChunk.push(padValue as T);
      }
    }

    result.push(currentChunk);
  }

  return result;
}

/**
 * Splits an array into a specified number of chunks.
 * Distributes items as evenly as possible.
 *
 * @param array - The array to split (not mutated)
 * @param count - The number of chunks to create
 * @returns An array of chunks
 *
 * @example
 * ```tsx
 * const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
 *
 * chunkInto(numbers, 3);
 * // [[1, 2, 3, 4], [5, 6, 7], [8, 9, 10]]
 * // Note: First chunk gets extra item when not evenly divisible
 *
 * chunkInto(numbers, 2);
 * // [[1, 2, 3, 4, 5], [6, 7, 8, 9, 10]]
 * ```
 *
 * @throws {TypeError} If array is not an array
 * @throws {RangeError} If count is not a positive integer
 */
export function chunkInto<T>(array: readonly T[], count: number): T[][] {
  // Validate input
  if (!Array.isArray(array)) {
    throw new TypeError('chunkInto: Expected an array');
  }

  if (!Number.isInteger(count) || count <= 0) {
    throw new RangeError('chunkInto: Count must be a positive integer');
  }

  // Early return for empty arrays
  if (array.length === 0) {
    return [];
  }

  // If count >= array length, each item gets its own chunk
  if (count >= array.length) {
    return array.map((item) => [item]);
  }

  const result: T[][] = [];
  const baseSize = Math.floor(array.length / count);
  const remainder = array.length % count;

  let index = 0;

  for (let i = 0; i < count; i++) {
    // First 'remainder' chunks get one extra item
    const currentSize = baseSize + (i < remainder ? 1 : 0);
    result.push(array.slice(index, index + currentSize));
    index += currentSize;
  }

  return result;
}
