/**
 * Dimension Transform
 *
 * Converts dimension values to rem units.
 * Handles raw numbers and pixel strings.
 *
 * @packageDocumentation
 * @module @dsai/tools/tokens/style-dictionary/transforms/dimension
 */

import type { SDToken, SDTransformOptions, TransformDefinition } from '../types.js';

/** Default base font size for rem conversion */
const DEFAULT_BASE_FONT_SIZE = 16;

/**
 * Check if token is a dimension (but not font-weight or line-height)
 */
function isDimension(token: SDToken): boolean {
  const tokenType = token.$type ?? token.type;

  // Exclude font-weights
  if (tokenType === 'fontWeight') {
    return false;
  }
  const pathHasFontWeight = token.path?.some((part) => {
    const lower = String(part).toLowerCase();
    return lower.includes('fontweight') || lower.includes('font-weight');
  });
  if (pathHasFontWeight) {
    return false;
  }

  // Exclude line-heights
  if (tokenType === 'lineHeight') {
    return false;
  }
  const pathHasLineHeight = token.path?.some((part) => {
    const lower = String(part).toLowerCase();
    return lower.includes('lineheight') || lower.includes('line-height');
  });
  if (pathHasLineHeight) {
    return false;
  }
  const scopeHasLineHeight = token.$scopes?.includes('LINE_HEIGHT');
  if (scopeHasLineHeight) {
    return false;
  }

  // Exclude grid config (unitless counts)
  const pathHasGridConfig = token.path?.some((part) => {
    const lower = String(part).toLowerCase();
    return lower === 'columns' || lower === 'row-columns';
  });
  if (pathHasGridConfig) {
    return false;
  }

  // Include dimension, spacing, sizing types
  return tokenType === 'dimension' || tokenType === 'spacing' || tokenType === 'sizing';
}

/**
 * dimension/rem transform
 *
 * Converts dimension values to rem.
 * Uses basePxFontSize from options (default: 16).
 *
 * @example
 * // Numeric input
 * Input: { $value: 16, $type: "dimension" }
 * Output: "1rem"
 *
 * @example
 * // Pixel string
 * Input: { $value: "24px", $type: "dimension" }
 * Output: "1.5rem"
 *
 * @example
 * // Zero value
 * Input: { $value: 0, $type: "dimension" }
 * Output: "0"
 */
export const dimensionRem: TransformDefinition = {
  name: 'dimension/rem',
  type: 'value',
  filter: isDimension,
  transform: (token, options?: SDTransformOptions) => {
    const value = token.$value ?? token.value;
    const baseFontSize = options?.basePxFontSize ?? DEFAULT_BASE_FONT_SIZE;

    // Handle raw numbers
    if (typeof value === 'number') {
      if (value === 0) {
        return '0';
      }
      return `${value / baseFontSize}rem`;
    }

    // Handle px strings
    if (typeof value === 'string' && value.endsWith('px')) {
      const numValue = Number.parseFloat(value);
      if (numValue === 0) {
        return '0';
      }
      return `${numValue / baseFontSize}rem`;
    }

    // Return as-is if not convertible
    return value;
  },
};
