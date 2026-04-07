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

/** Maximum value for an 8-bit RGB channel */
const MAX_RGB_VALUE = 255;

/** Number of hue sectors in the HSL color wheel */
const HUE_SECTORS = 6;

/** Full circle in degrees */
const DEGREES_FULL_CIRCLE = 360;

/** Degrees per hue sector (360 / 6 = 60) */
const DEGREES_PER_SECTOR = 60;

function clampRgbChannel(value: number): number {
  return Math.max(0, Math.min(MAX_RGB_VALUE, value));
}

function isOutOfRange(r: number, g: number, b: number): boolean {
  return r < 0 || r > MAX_RGB_VALUE || g < 0 || g > MAX_RGB_VALUE || b < 0 || b > MAX_RGB_VALUE;
}

function calculateHue(
  rNorm: number,
  gNorm: number,
  bNorm: number,
  max: number,
  delta: number
): number {
  if (delta === 0) {
    return 0;
  }
  let h: number;
  if (max === rNorm) {
    h = ((gNorm - bNorm) / delta) % HUE_SECTORS;
  } else if (max === gNorm) {
    h = (bNorm - rNorm) / delta + 2;
  } else {
    h = (rNorm - gNorm) / delta + 4;
  }
  h = h * DEGREES_PER_SECTOR;
  if (h < 0) {
    h += DEGREES_FULL_CIRCLE;
  }
  return h;
}

export function rgbToHsl(r: number, g: number, b: number): HSL {
  // Validate and clamp inputs
  if (isOutOfRange(r, g, b)) {
    console.warn('[rgbToHsl] RGB values must be in range 0-255');
    r = clampRgbChannel(r);
    g = clampRgbChannel(g);
    b = clampRgbChannel(b);
  }

  // Convert to 0-1 range
  const rNorm = r / MAX_RGB_VALUE;
  const gNorm = g / MAX_RGB_VALUE;
  const bNorm = b / MAX_RGB_VALUE;

  // Find min and max channel values
  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  const delta = max - min;

  // Calculate lightness (0-1 range)
  const l = (max + min) / 2;

  // Calculate saturation
  const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  // Calculate hue in degrees
  const h = calculateHue(rNorm, gNorm, bNorm, max, delta);

  // Return full precision values for accurate roundtrip conversions
  return [h, s * 100, l * 100] as const;
}
