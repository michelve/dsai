/**
 * @file rgbToHsl - Convert RGB to HSL color space
 * @module @dsai-io/react/utils/color
 *
 * Enterprise-grade RGB to HSL converter with:
 * - Accurate color space conversion
 * - Hue calculation in degrees
 * - Saturation and lightness as percentages
 * - Input validation
 */

/**
 * HSL color tuple
 */
export type HSL = readonly [number, number, number];

/**
 * Convert RGB color to HSL color space
 *
 * @param r - Red channel (0-255)
 * @param g - Green channel (0-255)
 * @param b - Blue channel (0-255)
 * @returns HSL tuple [h (0-360), s (0-100), l (0-100)]
 *
 * @example
 * ```tsx
 * // Pure red
 * rgbToHsl(255, 0, 0); // [0, 100, 50]
 *
 * // Pure green
 * rgbToHsl(0, 255, 0); // [120, 100, 50]
 *
 * // Pure blue
 * rgbToHsl(0, 0, 255); // [240, 100, 50]
 *
 * // Gray (no saturation)
 * rgbToHsl(128, 128, 128); // [0, 0, 50]
 *
 * // Component usage - adjust lightness
 * const [r, g, b] = [59, 130, 246]; // blue-500
 * const [h, s, l] = rgbToHsl(r, g, b);
 * const lighterL = Math.min(l + 10, 100);
 * console.log(`Lighter: hsl(${h}, ${s}%, ${lighterL}%)`);
 * ```
 */
export function rgbToHsl(r: number, g: number, b: number): HSL {
  // Validate and clamp inputs
  if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) {
    console.warn('[rgbToHsl] RGB values must be in range 0-255');
    r = Math.max(0, Math.min(255, r));
    g = Math.max(0, Math.min(255, g));
    b = Math.max(0, Math.min(255, b));
  }

  // Convert to 0-1 range
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  // Find min and max channel values
  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  const delta = max - min;

  // Calculate lightness (0-1 range)
  const l = (max + min) / 2;

  // Calculate saturation
  let s = 0;
  if (delta !== 0) {
    s = delta / (1 - Math.abs(2 * l - 1));
  }

  // Calculate hue in degrees
  let h = 0;
  if (delta !== 0) {
    if (max === rNorm) {
      h = ((gNorm - bNorm) / delta) % 6;
    } else if (max === gNorm) {
      h = (bNorm - rNorm) / delta + 2;
    } else {
      h = (rNorm - gNorm) / delta + 4;
    }
    h = h * 60;
  }

  // Normalize hue to 0-360
  if (h < 0) {
    h += 360;
  }

  // Return full precision values for accurate roundtrip conversions
  return [h, s * 100, l * 100] as const;
}
