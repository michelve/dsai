/**
 * @file getContrastRatio - Calculate WCAG contrast ratio
 * @module @dsai/react/utils/color
 *
 * Enterprise-grade contrast ratio calculator with:
 * - WCAG 2.1 compliant formula
 * - RGB color support
 * - Range validation
 * - Optional precision control for display vs computation
 */

import { getRelativeLuminance } from './getRelativeLuminance';

/**
 * Options for contrast ratio calculation
 */
export interface ContrastRatioOptions {
  /**
   * Number of decimal places to round the result to.
   * Use `null` or `undefined` for full precision (recommended for WCAG comparison).
   * Use `2` for display purposes.
   * @default undefined (full precision)
   */
  precision?: number | null;
}

/**
 * Calculate contrast ratio between two RGB colors per WCAG 2.1
 * Formula: (L1 + 0.05) / (L2 + 0.05)
 * Where L1 is lighter color, L2 is darker color
 *
 * @param rgb1 - First color [r, g, b] (0-255 each)
 * @param rgb2 - Second color [r, g, b] (0-255 each)
 * @param options - Optional configuration
 * @returns Contrast ratio (1-21)
 *
 * @remarks
 * By default, returns full precision for accurate WCAG compliance checking.
 * Use `{ precision: 2 }` when displaying to users for readability.
 *
 * @example
 * ```tsx
 * // Black on white
 * getContrastRatio([0, 0, 0], [255, 255, 255]); // 21
 *
 * // White on white
 * getContrastRatio([255, 255, 255], [255, 255, 255]); // 1
 *
 * // Dark gray on light gray
 * getContrastRatio([68, 68, 68], [238, 238, 238]); // ~12.6
 *
 * // For display (rounded)
 * getContrastRatio([0, 0, 255], [255, 255, 255], { precision: 2 }); // 8.59
 * ```
 */
export function getContrastRatio(
  rgb1: readonly [number, number, number],
  rgb2: readonly [number, number, number],
  options: ContrastRatioOptions = {}
): number {
  const { precision } = options;

  // Validate inputs
  if (!Array.isArray(rgb1) || rgb1.length !== 3) {
    console.warn('[getContrastRatio] First color must be [r, g, b] array');
    return 1;
  }

  if (!Array.isArray(rgb2) || rgb2.length !== 3) {
    console.warn('[getContrastRatio] Second color must be [r, g, b] array');
    return 1;
  }

  // Calculate relative luminance for both colors
  const l1 = getRelativeLuminance(rgb1[0], rgb1[1], rgb1[2]);
  const l2 = getRelativeLuminance(rgb2[0], rgb2[1], rgb2[2]);

  // Determine lighter and darker
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  // Calculate contrast ratio
  const ratio = (lighter + 0.05) / (darker + 0.05);

  // Apply precision if specified
  if (typeof precision === 'number' && precision >= 0) {
    const factor = 10 ** precision;
    return Math.round(ratio * factor) / factor;
  }

  // Return full precision for accurate WCAG comparison
  return ratio;
}
