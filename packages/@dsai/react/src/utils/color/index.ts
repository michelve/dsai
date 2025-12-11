/**
 * @file Color & Theming utilities
 * @module @dsai/react/utils/color
 *
 * Enterprise-grade color manipulation and WCAG compliance utilities including:
 * - WCAG contrast checking (getContrastRatio, meetsWCAG, getRelativeLuminance)
 * - Color space conversions (hexToRgb, rgbToHsl, hslToHex)
 * - Shade generation (getLighterShade, getDarkerShade)
 * - Design token conversion (tokenToCssVar)
 */

// WCAG Compliance
export { getContrastRatio } from './getContrastRatio';
export { getRelativeLuminance } from './getRelativeLuminance';
export { meetsWCAG } from './meetsWCAG';
export type { TextSize, WCAGLevel, WCAGOptions } from './meetsWCAG';

// Color Space Conversions
export { hexToRgb } from './hexToRgb';
export { hslToHex } from './hslToHex';
export { rgbToHsl } from './rgbToHsl';

// Shade Generation
export { getDarkerShade } from './getDarkerShade';
export { getLighterShade } from './getLighterShade';

// Design Tokens
export { tokenToCssVar } from './tokenToCssVar';
export type { TokenToCssVarOptions } from './tokenToCssVar';
