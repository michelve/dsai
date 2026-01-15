/**
 * @file getDarkerShade - Generate darker color shade
 * @module @dsai/react/utils/color
 *
 * Enterprise-grade color darkening with:
 * - HSL color space manipulation
 * - Percentage-based darkening
 * - Boundary protection
 * - Hex input/output
 */

import { hexToRgb } from './hexToRgb';
import { hslToHex } from './hslToHex';
import { rgbToHsl } from './rgbToHsl';

/**
 * Generate a darker shade of a color
 *
 * @param hex - Base color in hex format
 * @param percent - Percentage to darken (0-100)
 * @returns Darker hex color or original if invalid
 *
 * @example
 * ```tsx
 * // Darken blue by 20%
 * getDarkerShade('#3B82F6', 20); // '#2563EB'
 *
 * // Darken light gray by 30%
 * getDarkerShade('#CCCCCC', 30); // '#8A8A8A'
 *
 * // Already very dark - minimal change
 * getDarkerShade('#111111', 10); // '#0A0A0A'
 *
 * // Component usage - active state
 * const buttonBg = '#3B82F6';
 * const buttonActive = getDarkerShade(buttonBg, 15);
 *
 * <button
 *   style={{
 *     backgroundColor: buttonBg,
 *     ':active': { backgroundColor: buttonActive }
 *   }}
 * >
 *   Click me
 * </button>
 *
 * // Generate palette (dark to light)
 * const base = '#10B981'; // green-500
 * const palette = [40, 30, 20, 10, 0].map(p =>
 *   p > 0 ? getDarkerShade(base, p) : base
 * );
 * ```
 */
export function getDarkerShade(hex: string, percent: number): string {
  // Validate percent
  if (percent < 0 || percent > 100) {
    console.warn('[getDarkerShade] Percent must be in range 0-100');
    percent = Math.max(0, Math.min(100, percent));
  }

  // Convert hex to RGB
  const rgb = hexToRgb(hex);
  if (!rgb) {
    console.warn('[getDarkerShade] Invalid hex color, returning original:', hex);
    return hex;
  }

  // Convert RGB to HSL
  const [h, s, l] = rgbToHsl(rgb[0], rgb[1], rgb[2]);

  // Calculate new lightness
  // Decrease lightness by percentage of space to black
  const decrease = (l * percent) / 100;
  const newL = Math.max(0, l - decrease);

  // Convert back to hex
  return hslToHex(h, s, newL);
}
