/**
 * @file meetsWCAG - Check WCAG contrast compliance
 * @module @dsai/react/utils/color
 *
 * Enterprise-grade WCAG compliance checker with:
 * - AA and AAA level support
 * - Normal and large text modes
 * - Type-safe level checking
 */

import { getContrastRatio } from './getContrastRatio';

/**
 * WCAG conformance levels
 */
export type WCAGLevel = 'AA' | 'AAA';

/**
 * Text size for WCAG calculations
 */
export type TextSize = 'normal' | 'large';

/**
 * Options for WCAG compliance checking
 */
export interface WCAGOptions {
  /** WCAG level to check (AA or AAA) */
  level: WCAGLevel;
  /** Text size (normal: <18pt, large: >=18pt or >=14pt bold) */
  textSize?: TextSize;
}

/**
 * Check if contrast ratio meets WCAG requirements
 *
 * WCAG 2.1 Requirements:
 * - AA Normal: 4.5:1
 * - AA Large: 3:1
 * - AAA Normal: 7:1
 * - AAA Large: 4.5:1
 *
 * @param rgb1 - First color [r, g, b]
 * @param rgb2 - Second color [r, g, b]
 * @param options - WCAG checking options
 * @returns True if meets requirement
 *
 * @example
 * ```tsx
 * const black = [0, 0, 0] as const;
 * const white = [255, 255, 255] as const;
 * const gray = [128, 128, 128] as const;
 *
 * // Black on white - excellent contrast
 * meetsWCAG(black, white, { level: 'AAA' }); // true
 *
 * // Gray on white - may fail AAA for normal text
 * meetsWCAG(gray, white, { level: 'AAA' }); // false
 * meetsWCAG(gray, white, { level: 'AA' }); // true
 *
 * // Large text has lower requirements
 * meetsWCAG(gray, white, { level: 'AAA', textSize: 'large' }); // true
 *
 * // Component usage
 * const buttonBg = [59, 130, 246] as const; // blue-500
 * const buttonText = [255, 255, 255] as const; // white
 *
 * if (!meetsWCAG(buttonText, buttonBg, { level: 'AA' })) {
 *   console.warn('Button text contrast is too low');
 * }
 * ```
 */
export function meetsWCAG(
  rgb1: readonly [number, number, number],
  rgb2: readonly [number, number, number],
  options: WCAGOptions
): boolean {
  const { level, textSize = 'normal' } = options;

  // Validate level
  if (level !== 'AA' && level !== 'AAA') {
    console.warn('[meetsWCAG] Invalid level, must be AA or AAA');
    return false;
  }

  // Calculate contrast ratio
  const ratio = getContrastRatio(rgb1, rgb2);

  // Determine required ratio based on level and text size
  const requiredRatio = getRequiredRatio(level, textSize);

  return ratio >= requiredRatio;
}

/**
 * Get required contrast ratio for WCAG level and text size
 *
 * @param level - WCAG level
 * @param textSize - Text size
 * @returns Required contrast ratio
 */
function getRequiredRatio(level: WCAGLevel, textSize: TextSize): number {
  if (level === 'AAA') {
    return textSize === 'large' ? 4.5 : 7;
  }
  // AA
  return textSize === 'large' ? 3 : 4.5;
}
