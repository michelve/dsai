/**
 * @file hslToHex - Convert HSL to hex color
 * @module @dsai-io/react/utils/color
 *
 * Enterprise-grade HSL to hex converter with:
 * - Accurate color space conversion
 * - Hue, saturation, lightness handling
 * - Input validation and clamping
 * - Uppercase hex output
 */

/**
 * Convert HSL color to hex string
 *
 * @param h - Hue (0-360 degrees)
 * @param s - Saturation (0-100 percent)
 * @param l - Lightness (0-100 percent)
 * @returns Hex color string (#RRGGBB)
 *
 * @example
 * ```tsx
 * // Pure red
 * hslToHex(0, 100, 50); // '#FF0000'
 *
 * // Pure green
 * hslToHex(120, 100, 50); // '#00FF00'
 *
 * // Pure blue
 * hslToHex(240, 100, 50); // '#0000FF'
 *
 * // Gray
 * hslToHex(0, 0, 50); // '#808080'
 *
 * // Component usage - generate color palette
 * const baseHue = 210; // blue
 * const colors = [30, 50, 70].map(lightness =>
 *   hslToHex(baseHue, 80, lightness)
 * );
 * // ['#266ACC', '#66A3E6', '#99C2F0']
 * ```
 */

/** Maximum value for an 8-bit RGB channel */
const MAX_RGB_VALUE = 255;

/** Full circle in degrees */
const DEGREES_FULL_CIRCLE = 360;

/** Hue boundary: red-to-yellow transition */
const HUE_SECTOR_1 = 60;

/** Hue boundary: yellow-to-green transition */
const HUE_SECTOR_2 = 120;

/** Hue boundary: green-to-cyan transition */
const HUE_SECTOR_3 = 180;

/** Hue boundary: cyan-to-blue transition */
const HUE_SECTOR_4 = 240;

/** Hue boundary: blue-to-magenta transition */
const HUE_SECTOR_5 = 300;

export function hslToHex(h: number, s: number, l: number): string {
  // Validate and clamp inputs
  if (h < 0 || h > DEGREES_FULL_CIRCLE) {
    console.warn('[hslToHex] Hue must be in range 0-360');
    h = ((h % DEGREES_FULL_CIRCLE) + DEGREES_FULL_CIRCLE) % DEGREES_FULL_CIRCLE; // Wrap around
  }

  if (s < 0 || s > 100) {
    console.warn('[hslToHex] Saturation must be in range 0-100');
    s = Math.max(0, Math.min(100, s));
  }

  if (l < 0 || l > 100) {
    console.warn('[hslToHex] Lightness must be in range 0-100');
    l = Math.max(0, Math.min(100, l));
  }

  // Convert to 0-1 range
  const sNorm = s / 100;
  const lNorm = l / 100;

  // Calculate chroma
  const c = (1 - Math.abs(2 * lNorm - 1)) * sNorm;
  const x = c * (1 - Math.abs(((h / HUE_SECTOR_1) % 2) - 1));
  const m = lNorm - c / 2;

  // Determine RGB based on hue
  let r = 0;
  let g = 0;
  let b = 0;

  if (h >= 0 && h < HUE_SECTOR_1) {
    [r, g, b] = [c, x, 0];
  } else if (h >= HUE_SECTOR_1 && h < HUE_SECTOR_2) {
    [r, g, b] = [x, c, 0];
  } else if (h >= HUE_SECTOR_2 && h < HUE_SECTOR_3) {
    [r, g, b] = [0, c, x];
  } else if (h >= HUE_SECTOR_3 && h < HUE_SECTOR_4) {
    [r, g, b] = [0, x, c];
  } else if (h >= HUE_SECTOR_4 && h < HUE_SECTOR_5) {
    [r, g, b] = [x, 0, c];
  } else {
    [r, g, b] = [c, 0, x];
  }

  // Convert to 0-255 range
  const r255 = Math.round((r + m) * MAX_RGB_VALUE);
  const g255 = Math.round((g + m) * MAX_RGB_VALUE);
  const b255 = Math.round((b + m) * MAX_RGB_VALUE);

  // Convert to hex
  const rHex = r255.toString(16).padStart(2, '0').toUpperCase();
  const gHex = g255.toString(16).padStart(2, '0').toUpperCase();
  const bHex = b255.toString(16).padStart(2, '0').toUpperCase();

  return `#${rHex}${gHex}${bHex}`;
}
