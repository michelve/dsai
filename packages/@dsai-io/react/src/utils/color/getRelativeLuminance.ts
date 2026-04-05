/**
 * @file getRelativeLuminance - Calculate relative luminance per WCAG
 * @module @dsai-io/react/utils/color
 *
 * Enterprise-grade relative luminance calculator with:
 * - WCAG 2.1 compliant formula
 * - RGB color space conversion
 * - Linearization with gamma correction
 * - Input validation
 */

/**
 * Calculate relative luminance of an RGB color per WCAG 2.1
 * Formula: L = 0.2126 * R + 0.7152 * G + 0.0722 * B
 * Where R, G, B are linearized sRGB values
 *
 * @param r - Red channel (0-255)
 * @param g - Green channel (0-255)
 * @param b - Blue channel (0-255)
 * @returns Relative luminance (0-1)
 *
 * @example
 * ```tsx
 * // Pure white
 * getRelativeLuminance(255, 255, 255); // 1.0
 *
 * // Pure black
 * getRelativeLuminance(0, 0, 0); // 0.0
 *
 * // Medium gray
 * getRelativeLuminance(128, 128, 128); // ~0.215
 *
 * // Blue
 * getRelativeLuminance(0, 0, 255); // ~0.0722
 * ```
 */

/** Maximum value for an 8-bit RGB channel (0-255) */
const MAX_RGB_VALUE = 255;

/** WCAG sRGB red coefficient for relative luminance */
const SRGB_RED_COEFFICIENT = 0.2126;

/** WCAG sRGB green coefficient for relative luminance */
const SRGB_GREEN_COEFFICIENT = 0.7152;

/** WCAG sRGB blue coefficient for relative luminance */
const SRGB_BLUE_COEFFICIENT = 0.0722;

/** sRGB linearization threshold (below this, use linear mapping) */
const SRGB_LINEAR_THRESHOLD = 0.03928;

/** sRGB linear divisor for values below the linearization threshold */
const SRGB_LINEAR_DIVISOR = 12.92;

/** sRGB gamma exponent for values above the linearization threshold */
const SRGB_GAMMA_EXPONENT = 2.4;

/** sRGB offset added before gamma correction */
const SRGB_GAMMA_OFFSET = 0.055;

/** sRGB divisor used in gamma correction formula */
const SRGB_GAMMA_DIVISOR = 1.055;

export function getRelativeLuminance(r: number, g: number, b: number): number {
  // Validate inputs
  if (r < 0 || r > MAX_RGB_VALUE || g < 0 || g > MAX_RGB_VALUE || b < 0 || b > MAX_RGB_VALUE) {
    console.warn('[getRelativeLuminance] RGB values must be in range 0-255');
    // Clamp values
    r = Math.max(0, Math.min(MAX_RGB_VALUE, r));
    g = Math.max(0, Math.min(MAX_RGB_VALUE, g));
    b = Math.max(0, Math.min(MAX_RGB_VALUE, b));
  }

  // Convert to 0-1 range
  const rsRGB = r / MAX_RGB_VALUE;
  const gsRGB = g / MAX_RGB_VALUE;
  const bsRGB = b / MAX_RGB_VALUE;

  // Linearize sRGB values (gamma correction)
  const rLinear = linearize(rsRGB);
  const gLinear = linearize(gsRGB);
  const bLinear = linearize(bsRGB);

  // Calculate relative luminance using WCAG coefficients
  return SRGB_RED_COEFFICIENT * rLinear + SRGB_GREEN_COEFFICIENT * gLinear + SRGB_BLUE_COEFFICIENT * bLinear;
}

/**
 * Linearize sRGB channel value (inverse gamma correction)
 *
 * @param channel - sRGB channel value (0-1)
 * @returns Linearized value (0-1)
 */
function linearize(channel: number): number {
  // WCAG formula for linearization
  if (channel <= SRGB_LINEAR_THRESHOLD) {
    return channel / SRGB_LINEAR_DIVISOR;
  }
  return ((channel + SRGB_GAMMA_OFFSET) / SRGB_GAMMA_DIVISOR) ** SRGB_GAMMA_EXPONENT;
}
