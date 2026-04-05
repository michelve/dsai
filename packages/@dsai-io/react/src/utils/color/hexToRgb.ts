/**
 * @file hexToRgb - Convert hex color to RGB
 * @module @dsai-io/react/utils/color
 *
 * Enterprise-grade hex to RGB converter with:
 * - 3-digit and 6-digit hex support
 * - Hash prefix handling
 * - Input validation
 * - Type-safe output
 */

/**
 * Convert hex color string to RGB tuple
 *
 * @param hex - Hex color (#RGB or #RRGGBB)
 * @returns RGB tuple [r, g, b] or null if invalid
 *
 * @example
 * ```tsx
 * // 6-digit hex
 * hexToRgb('#FF5733'); // [255, 87, 51]
 *
 * // 3-digit hex (shorthand)
 * hexToRgb('#F00'); // [255, 0, 0]
 *
 * // Without hash
 * hexToRgb('00FF00'); // [0, 255, 0]
 *
 * // Invalid input
 * hexToRgb('#GGG'); // null
 * hexToRgb('invalid'); // null
 *
 * // Component usage
 * const colorHex = '#3B82F6'; // blue-500
 * const rgb = hexToRgb(colorHex);
 * if (rgb) {
 *   const [r, g, b] = rgb;
 *   console.log(`RGB: ${r}, ${g}, ${b}`);
 * }
 * ```
 */

/** Length of a shorthand hex color (e.g., "F00") */
const HEX_SHORT_LENGTH = 3;

/** Length of a full hex color (e.g., "FF5733") */
const HEX_FULL_LENGTH = 6;

export function hexToRgb(hex: string): readonly [number, number, number] | null {
  // Validate input
  if (typeof hex !== 'string' || hex.trim() === '') {
    console.warn('[hexToRgb] Invalid hex color: must be non-empty string');
    return null;
  }

  // Remove hash if present
  let cleanHex = hex.trim();
  if (cleanHex.startsWith('#')) {
    cleanHex = cleanHex.slice(1);
  }

  // Validate hex format
  if (!/^[0-9A-Fa-f]{3}$|^[0-9A-Fa-f]{6}$/.test(cleanHex)) {
    console.warn('[hexToRgb] Invalid hex color format:', hex);
    return null;
  }

  // Expand 3-digit hex to 6-digit
  if (cleanHex.length === HEX_SHORT_LENGTH) {
    cleanHex = cleanHex
      .split('')
      .map((char) => char + char)
      .join('');
  }

  // Parse RGB values
  const r = Number.parseInt(cleanHex.slice(0, 2), 16);
  const g = Number.parseInt(cleanHex.slice(2, 4), 16);
  const b = Number.parseInt(cleanHex.slice(4, HEX_FULL_LENGTH), 16);

  // Validate parsed values (should always be valid if regex passed)
  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) {
    console.warn('[hexToRgb] Failed to parse hex color:', hex);
    return null;
  }

  return [r, g, b] as const;
}
