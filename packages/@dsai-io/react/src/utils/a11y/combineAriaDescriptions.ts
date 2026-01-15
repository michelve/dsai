/**
 * @file combineAriaDescriptions - Merge multiple aria-describedby IDs
 * @module @dsai-io/react/utils/a11y
 *
 * Enterprise-grade aria-describedby combiner with:
 * - Merges multiple ID references
 * - Removes duplicates
 * - Validates and sanitizes IDs
 * - Preserves order
 */

/**
 * Combine multiple aria-describedby ID references into a single space-separated string
 *
 * @param ids - Array of ID strings or single ID
 * @returns Space-separated string of unique IDs
 *
 * @example
 * ```tsx
 * // Single ID
 * combineAriaDescriptions('help-text');
 * // => 'help-text'
 *
 * // Multiple IDs
 * combineAriaDescriptions(['help-text', 'error-message']);
 * // => 'help-text error-message'
 *
 * // Remove duplicates
 * combineAriaDescriptions(['help-text', 'help-text', 'error']);
 * // => 'help-text error'
 *
 * // Filter empty strings
 * combineAriaDescriptions(['help-text', '', null, 'error']);
 * // => 'help-text error'
 *
 * // Mixed input
 * combineAriaDescriptions(['id1', 'id2', undefined, 'id3', 'id1']);
 * // => 'id1 id2 id3'
 * ```
 */
export function combineAriaDescriptions(
  ...ids: Array<string | readonly string[] | null | undefined>
): string {
  // Flatten all inputs
  const allIds: string[] = [];

  for (const id of ids) {
    if (id === null || id === undefined) {
      continue;
    }

    if (Array.isArray(id)) {
      allIds.push(...id);
    } else if (typeof id === 'string') {
      allIds.push(id);
    }
  }

  // Filter, trim, and deduplicate
  const seen = new Set<string>();
  const uniqueIds: string[] = [];

  for (const id of allIds) {
    if (typeof id !== 'string') {
      continue;
    }

    const trimmed = id.trim();
    if (trimmed.length > 0 && !seen.has(trimmed)) {
      seen.add(trimmed);
      uniqueIds.push(trimmed);
    }
  }

  return uniqueIds.join(' ');
}
