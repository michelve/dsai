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

function hueSectorToRgb(h: number, c: number, x: number): [number, number, number] {
  if (h < HUE_SECTOR_1) {
    return [c, x, 0];
  }
  if (h < HUE_SECTOR_2) {
    return [x, c, 0];
  }
  if (h < HUE_SECTOR_3) {
    return [0, c, x];
  }
  if (h < HUE_SECTOR_4) {
    return [0, x, c];
  }
  if (h < HUE_SECTOR_5) {
    return [x, 0, c];
  }
  return [c, 0, x];
}

function clampAndWarn(label: string, value: number, min: number, max: number): number {
  if (value < min || value > max) {
    console.warn(`[hslToHex] ${label} must be in range ${min}-${max}`);
    return Math.max(min, Math.min(max, value));
  }
  return value;
}

export function hslToHex(h: number, s: number, l: number): string {
  // Validate and clamp inputs
  if (h < 0 || h > DEGREES_FULL_CIRCLE) {
    console.warn('[hslToHex] Hue must be in range 0-360');
    h = ((h % DEGREES_FULL_CIRCLE) + DEGREES_FULL_CIRCLE) % DEGREES_FULL_CIRCLE; // Wrap around
  }

  s = clampAndWarn('Saturation', s, 0, 100);
  l = clampAndWarn('Lightness', l, 0, 100);

  // Convert to 0-1 range
  const sNorm = s / 100;
  const lNorm = l / 100;

  // Calculate chroma
  const c = (1 - Math.abs(2 * lNorm - 1)) * sNorm;
  const x = c * (1 - Math.abs(((h / HUE_SECTOR_1) % 2) - 1));
  const m = lNorm - c / 2;

  // Determine RGB based on hue
  const [r, g, b] = hueSectorToRgb(h, c, x);

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
