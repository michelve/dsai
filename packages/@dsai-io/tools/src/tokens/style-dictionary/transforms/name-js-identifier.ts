/**
 * Name transform for JavaScript/TypeScript that ensures valid identifiers
 *
 * Converts token paths to PascalCase, prefixing numeric-only segments
 * to ensure valid JavaScript identifiers.
 *
 * @packageDocumentation
 * @module @dsai-io/tools/tokens/style-dictionary/transforms/name-js-identifier
 */

import type { TransformDefinition } from '../types.js';

/**
 * Convert a path segment to PascalCase, handling numeric segments
 */
function toPascalCaseSegment(segment: string): string {
  const needsNumericPrefix = /^\d/.test(segment);

  // Convert to PascalCase: split by non-alphanumeric, capitalize each part
  const pascal = segment
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join('');

  // Preserve underscore prefix for numeric identifiers so they stay valid
  return needsNumericPrefix ? `_${pascal}` : pascal;
}

/**
 * name/js-identifier transform
 *
 * Converts token path to a valid JavaScript identifier in PascalCase.
 * Handles numeric segments by prefixing with underscore.
 *
 * @example
 * ```
 * colors.neutral.gray.100  → ColorsNeutralGray_100
 * spacing.0                → Spacing_0
 * typography.fontSize.base → TypographyFontSizeBase
 * ```
 */
export const nameJsIdentifier: TransformDefinition = {
  name: 'name/js-identifier',
  type: 'name',
  transform: ({ path }) => {
    return path.map(toPascalCaseSegment).join('');
  },
};
