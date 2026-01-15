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
export function getRelativeLuminance(r: number, g: number, b: number): number {
  // Validate inputs
  if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) {
    console.warn('[getRelativeLuminance] RGB values must be in range 0-255');
    // Clamp values
    r = Math.max(0, Math.min(255, r));
    g = Math.max(0, Math.min(255, g));
    b = Math.max(0, Math.min(255, b));
  }

  // Convert to 0-1 range
  const rsRGB = r / 255;
  const gsRGB = g / 255;
  const bsRGB = b / 255;

  // Linearize sRGB values (gamma correction)
  const rLinear = linearize(rsRGB);
  const gLinear = linearize(gsRGB);
  const bLinear = linearize(bsRGB);

  // Calculate relative luminance using WCAG coefficients
  return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
}

/**
 * Linearize sRGB channel value (inverse gamma correction)
 *
 * @param channel - sRGB channel value (0-1)
 * @returns Linearized value (0-1)
 */
function linearize(channel: number): number {
  // WCAG formula for linearization
  if (channel <= 0.03928) {
    return channel / 12.92;
  }
  return ((channel + 0.055) / 1.055) ** 2.4;
}
