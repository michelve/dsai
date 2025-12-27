/**
 * Font Weight Transform
 *
 * Keeps font-weight values as unitless numbers (300, 400, 700, etc.)
 * CSS font-weight must be unitless for proper inheritance.
 *
 * @packageDocumentation
 * @module @dsai/tools/tokens/style-dictionary/transforms/font-weight
 */

import type { SDToken, TransformDefinition } from '../types.js';

/**
 * Named font weight values mapped to numeric values
 */
const NAMED_WEIGHTS: Record<string, number> = {
  thin: 100,
  hairline: 100,
  extralight: 200,
  ultralight: 200,
  light: 300,
  normal: 400,
  regular: 400,
  medium: 500,
  semibold: 600,
  demibold: 600,
  bold: 700,
  extrabold: 800,
  ultrabold: 800,
  black: 900,
  heavy: 900,
};

/**
 * Check if token is a font weight
 */
function isFontWeight(token: SDToken): boolean {
  const tokenType = token.$type ?? token.type;

  // Direct type match
  if (tokenType === 'fontWeight' || tokenType === 'number') {
    return true;
  }

  // Path-based detection
  const pathHasFontWeight = token.path?.some((part) => {
    const lower = String(part).toLowerCase();
    return lower === 'fontweight' || lower.includes('font-weight') || lower.includes('fontweight');
  });

  return pathHasFontWeight ?? false;
}

/**
 * fontWeight/unitless transform
 *
 * Ensures font-weight values are unitless numbers.
 * Handles numeric values, string values, and named weights.
 *
 * @example
 * // Numeric input
 * Input: { $value: 700, $type: "fontWeight" }
 * Output: 700
 *
 * @example
 * // String input
 * Input: { $value: "700", $type: "fontWeight" }
 * Output: 700
 *
 * @example
 * // Named weight
 * Input: { $value: "bold", $type: "fontWeight" }
 * Output: 700
 */
export const fontWeightUnitless: TransformDefinition = {
  name: 'fontWeight/unitless',
  type: 'value',
  filter: isFontWeight,
  transform: (token) => {
    const value = token.$value ?? token.value;

    // Already a number - return as-is
    if (typeof value === 'number') {
      return value;
    }

    // String value
    if (typeof value === 'string') {
      // Try to parse as number
      const parsed = Number.parseInt(value, 10);
      if (!Number.isNaN(parsed)) {
        return parsed;
      }

      // Handle named weights
      const normalized = value.toLowerCase().replace(/[^a-z]/g, '');
      if (Object.hasOwn(NAMED_WEIGHTS, normalized)) {
        // eslint-disable-next-line security/detect-object-injection
        const namedWeight = NAMED_WEIGHTS[normalized];
        if (namedWeight !== undefined) {
          return namedWeight;
        }
      }
    }

    // Fallback - return as-is
    return value;
  },
};
