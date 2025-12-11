/**
 * @file getLighterShade - Generate lighter color shade
 * @module @dsai/react/utils/color
 *
 * Enterprise-grade color lightening with:
 * - HSL color space manipulation
 * - Percentage-based lightening
 * - Boundary protection
 * - Hex input/output
 */

import { hexToRgb } from './hexToRgb';
import { hslToHex } from './hslToHex';
import { rgbToHsl } from './rgbToHsl';

/**
 * Generate a lighter shade of a color
 *
 * @param hex - Base color in hex format
 * @param percent - Percentage to lighten (0-100)
 * @returns Lighter hex color or original if invalid
 *
 * @example
 * ```tsx
 * // Lighten blue by 20%
 * getLighterShade('#3B82F6', 20); // '#6BA4F8'
 *
 * // Lighten dark gray by 30%
 * getLighterShade('#333333', 30); // '#666666'
 *
 * // Already very light - minimal change
 * getLighterShade('#EEEEEE', 10); // '#F5F5F5'
 *
 * // Component usage - hover state
 * const buttonBg = '#3B82F6';
 * const buttonHover = getLighterShade(buttonBg, 10);
 *
 * <button
 *   style={{
 *     backgroundColor: buttonBg,
 *     ':hover': { backgroundColor: buttonHover }
 *   }}
 * >
 *   Click me
 * </button>
 *
 * // Generate palette
 * const base = '#10B981'; // green-500
 * const palette = [10, 20, 30, 40].map(p =>
 *   getLighterShade(base, p)
 * );
 * ```
 */
export function getLighterShade(hex: string, percent: number): string {
  // Validate percent
  if (percent < 0 || percent > 100) {
    console.warn('[getLighterShade] Percent must be in range 0-100');
    percent = Math.max(0, Math.min(100, percent));
  }

  // Convert hex to RGB
  const rgb = hexToRgb(hex);
  if (!rgb) {
    console.warn('[getLighterShade] Invalid hex color, returning original:', hex);
    return hex;
  }

  // Convert RGB to HSL
  const [h, s, l] = rgbToHsl(rgb[0], rgb[1], rgb[2]);

  // Calculate new lightness
  // Increase lightness by percentage of remaining space to white
  const remainingSpace = 100 - l;
  const increase = (remainingSpace * percent) / 100;
  const newL = Math.min(100, l + increase);

  // Convert back to hex
  return hslToHex(h, s, newL);
}
