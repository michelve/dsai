/**
 * Line Height Transform
 *
 * Keeps line-height values as unitless ratios (1, 1.5, 2, etc.)
 * CSS line-height should be unitless for proper inheritance.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/line-height
 * @packageDocumentation
 * @module @dsai/tools/tokens/style-dictionary/transforms/line-height
 */

import type { SDToken, TransformDefinition } from '../types.js';

/** Default base font size for conversion */
const DEFAULT_BASE_FONT_SIZE = 16;

/**
 * Check if token is a line height
 */
function isLineHeight(token: SDToken): boolean {
  const tokenType = token.$type ?? token.type;

  // Direct type match
  if (tokenType === 'lineHeight') {
    return true;
  }

  // Path-based detection
  const pathHasLineHeight = token.path?.some((part) => {
    const lower = String(part).toLowerCase();
    return lower === 'lineheight' || lower.includes('line-height') || lower.includes('lineheight');
  });

  // Scope-based detection (from Figma Variables)
  const scopeHasLineHeight = token.$scopes?.includes('LINE_HEIGHT');

  return (pathHasLineHeight ?? false) || (scopeHasLineHeight ?? false);
}

/**
 * lineHeight/unitless transform
 *
 * Converts line-height values to unitless ratios.
 * Handles numbers, percentages, and pixel values.
 *
 * @example
 * // Percentage input
 * Input: { $value: "150%", $type: "lineHeight" }
 * Output: 1.5
 *
 * @example
 * // Already unitless
 * Input: { $value: 1.5, $type: "lineHeight" }
 * Output: 1.5
 *
 * @example
 * // Pixel value from Figma
 * Input: { $value: 24, $type: "lineHeight" }
 * Output: 1.5 (assuming 16px base)
 */
export const lineHeightUnitless: TransformDefinition = {
  name: 'lineHeight/unitless',
  type: 'value',
  filter: isLineHeight,
  transform: (token) => {
    const value = token.$value ?? token.value;

    // Already a number
    if (typeof value === 'number') {
      // If <= 3, already a multiplier (1, 1.5, 2)
      if (value <= 3) {
        return value;
      }
      // If > 3, likely px from Figma - convert to unitless
      return value / DEFAULT_BASE_FONT_SIZE;
    }

    // Handle percentage strings (e.g., "150%" -> 1.5)
    if (typeof value === 'string' && value.endsWith('%')) {
      return Number.parseFloat(value) / 100;
    }

    // Handle strings with units
    if (typeof value === 'string') {
      const numValue = Number.parseFloat(value);
      if (!Number.isNaN(numValue)) {
        if (numValue <= 3) {
          return numValue;
        }
        return numValue / DEFAULT_BASE_FONT_SIZE;
      }
    }

    // Fallback - return as-is
    return value;
  },
};
