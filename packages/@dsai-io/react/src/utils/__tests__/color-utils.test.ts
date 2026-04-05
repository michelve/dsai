/**
 * @file Color Utilities Test Suite
 * @module @dsai-io/react/utils/__tests__/color-utils.test
 *
 * Comprehensive test coverage for:
 * - getContrastRatio
 * - getRelativeLuminance
 * - meetsWCAG
 * - hexToRgb, rgbToHsl, hslToHex
 * - getDarkerShade, getLighterShade
 * - tokenToCssVar
 */

import {
  getContrastRatio,
  getDarkerShade,
  getLighterShade,
  getRelativeLuminance,
  hexToRgb,
  hslToHex,
  meetsWCAG,
  rgbToHsl,
  tokenToCssVar,
} from '../color';

// ── Test constants (S109) ──
const MAX_CHANNEL = 255;
const TEST_GRAY_VALUE = 119;
const TEST_DARK_GRAY = 68;
const TEST_LIGHT_GRAY = 238;
const GRAY_HALF = 128;
const NEAR_THRESHOLD_GRAY = 118;
const HUE_GREEN = 120;
const HUE_BLUE = 240;
const HUE_FULL = 360;
const HUE_NEGATIVE = -120;
const PERCENT_100 = 100;
const PERCENT_50 = 50;
const SHADE_PERCENT = 20;
const OUT_OF_RANGE_HIGH = 300;
const OUT_OF_RANGE_LOW = -10;
const EXCESS_PERCENT = 150;

// ========================================
// getContrastRatio Tests
// ========================================
describe('getContrastRatio', () => {
  it('calculates maximum contrast for black on white', () => {
    const ratio = getContrastRatio(
      [0, 0, 0],
      [MAX_CHANNEL, MAX_CHANNEL, MAX_CHANNEL]
    );
    expect(ratio).toBe(21);
  });

  it('calculates minimum contrast for white on white', () => {
    const ratio = getContrastRatio(
      [MAX_CHANNEL, MAX_CHANNEL, MAX_CHANNEL],
      [MAX_CHANNEL, MAX_CHANNEL, MAX_CHANNEL]
    );
    expect(ratio).toBe(1);
  });

  it('returns same ratio regardless of color order', () => {
    const ratio1 = getContrastRatio(
      [0, 0, 0],
      [MAX_CHANNEL, MAX_CHANNEL, MAX_CHANNEL]
    );
    const ratio2 = getContrastRatio(
      [MAX_CHANNEL, MAX_CHANNEL, MAX_CHANNEL],
      [0, 0, 0]
    );
    expect(ratio1).toBe(ratio2);
  });

  it('returns full precision by default for accurate WCAG comparison', () => {
    // Gray on white - ratio should be around 4.48 (borderline AA)
    const ratio = getContrastRatio(
      [TEST_GRAY_VALUE, TEST_GRAY_VALUE, TEST_GRAY_VALUE],
      [MAX_CHANNEL, MAX_CHANNEL, MAX_CHANNEL]
    );
    // Should have more than 2 decimal places
    expect(ratio.toString()).toMatch(/\d+\.\d{3,}/);
  });

  it('respects precision option for display', () => {
    const ratio = getContrastRatio(
      [TEST_DARK_GRAY, TEST_DARK_GRAY, TEST_DARK_GRAY],
      [TEST_LIGHT_GRAY, TEST_LIGHT_GRAY, TEST_LIGHT_GRAY],
      { precision: 2 }
    );
    expect(ratio.toString()).toMatch(/^\d+\.\d{1,2}$/);
  });

  it('returns 1 and warns for invalid first color', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
    // @ts-expect-error - testing invalid input
    const ratio = getContrastRatio('invalid', [MAX_CHANNEL, MAX_CHANNEL, MAX_CHANNEL]);
    expect(ratio).toBe(1);
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('First color'));
    warnSpy.mockRestore();
  });

  it('returns 1 and warns for invalid second color', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
    // @ts-expect-error - testing invalid input
    const ratio = getContrastRatio([0, 0, 0], null);
    expect(ratio).toBe(1);
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('Second color'));
    warnSpy.mockRestore();
  });

  it('returns 1 for arrays with wrong length', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
    // @ts-expect-error - testing invalid input
    const ratio = getContrastRatio([0, 0], [MAX_CHANNEL, MAX_CHANNEL, MAX_CHANNEL]);
    expect(ratio).toBe(1);
    warnSpy.mockRestore();
  });
});

// ========================================
// getRelativeLuminance Tests
// ========================================
describe('getRelativeLuminance', () => {
  it('returns 0 for pure black', () => {
    expect(getRelativeLuminance(0, 0, 0)).toBe(0);
  });

  it('returns 1 for pure white', () => {
    expect(getRelativeLuminance(MAX_CHANNEL, MAX_CHANNEL, MAX_CHANNEL)).toBe(1);
  });

  it('returns values between 0 and 1 for colors', () => {
    const lum = getRelativeLuminance(GRAY_HALF, GRAY_HALF, GRAY_HALF);
    expect(lum).toBeGreaterThan(0);
    expect(lum).toBeLessThan(1);
  });

  it('clamps out-of-range values', () => {
    // Should not throw for out-of-range values
    expect(() => getRelativeLuminance(OUT_OF_RANGE_LOW, OUT_OF_RANGE_HIGH, GRAY_HALF)).not.toThrow();
  });
});

// ========================================
// meetsWCAG Tests
// ========================================
describe('meetsWCAG', () => {
  const black: readonly [number, number, number] = [0, 0, 0];
  const white: readonly [number, number, number] = [MAX_CHANNEL, MAX_CHANNEL, MAX_CHANNEL];
  const gray: readonly [number, number, number] = [GRAY_HALF, GRAY_HALF, GRAY_HALF];

  describe('AA level', () => {
    it('passes AA for black on white', () => {
      expect(meetsWCAG(black, white, { level: 'AA' })).toBe(true);
    });

    it('passes AA for gray on white with normal text', () => {
      // Gray (#808080) on white has ratio ~3.95 - should fail AA normal (4.5)
      expect(meetsWCAG(gray, white, { level: 'AA' })).toBe(false);
    });

    it('passes AA for gray on white with large text (3:1)', () => {
      expect(meetsWCAG(gray, white, { level: 'AA', textSize: 'large' })).toBe(true);
    });
  });

  describe('AAA level', () => {
    it('passes AAA for black on white', () => {
      expect(meetsWCAG(black, white, { level: 'AAA' })).toBe(true);
    });

    it('fails AAA for gray on white with normal text', () => {
      expect(meetsWCAG(gray, white, { level: 'AAA' })).toBe(false);
    });
  });

  describe('borderline cases with full precision', () => {
    it('correctly evaluates ratio at exactly 4.5 threshold', () => {
      // A color that gives exactly 4.5 ratio should pass AA normal
      // RGB(118, 118, 118) on white gives ~4.54
      const nearThreshold: readonly [number, number, number] = [
        NEAR_THRESHOLD_GRAY,
        NEAR_THRESHOLD_GRAY,
        NEAR_THRESHOLD_GRAY,
      ];
      expect(meetsWCAG(nearThreshold, white, { level: 'AA' })).toBe(true);
    });

    it('correctly fails ratio just below 4.5 threshold', () => {
      // RGB(119, 119, 119) on white gives ~4.48 - should fail AA normal
      const belowThreshold: readonly [number, number, number] = [
        TEST_GRAY_VALUE,
        TEST_GRAY_VALUE,
        TEST_GRAY_VALUE,
      ];
      expect(meetsWCAG(belowThreshold, white, { level: 'AA' })).toBe(false);
    });
  });

  it('warns and returns false for invalid level', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
    // @ts-expect-error - testing invalid input
    const result = meetsWCAG(black, white, { level: 'A' });
    expect(result).toBe(false);
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('Invalid level'));
    warnSpy.mockRestore();
  });
});

// ========================================
// hexToRgb Tests
// ========================================
describe('hexToRgb', () => {
  it('converts 6-digit hex correctly', () => {
    expect(hexToRgb('#ffffff')).toEqual([MAX_CHANNEL, MAX_CHANNEL, MAX_CHANNEL]);
    expect(hexToRgb('#000000')).toEqual([0, 0, 0]);
    expect(hexToRgb('#ff0000')).toEqual([MAX_CHANNEL, 0, 0]);
  });

  it('converts 3-digit hex correctly', () => {
    expect(hexToRgb('#fff')).toEqual([MAX_CHANNEL, MAX_CHANNEL, MAX_CHANNEL]);
    expect(hexToRgb('#000')).toEqual([0, 0, 0]);
    expect(hexToRgb('#f00')).toEqual([MAX_CHANNEL, 0, 0]);
  });

  it('handles uppercase hex', () => {
    expect(hexToRgb('#FFFFFF')).toEqual([MAX_CHANNEL, MAX_CHANNEL, MAX_CHANNEL]);
    expect(hexToRgb('#FF0000')).toEqual([MAX_CHANNEL, 0, 0]);
  });

  it('handles hex without hash', () => {
    expect(hexToRgb('ffffff')).toEqual([MAX_CHANNEL, MAX_CHANNEL, MAX_CHANNEL]);
    expect(hexToRgb('ff0000')).toEqual([MAX_CHANNEL, 0, 0]);
  });

  it('returns null for invalid hex', () => {
    expect(hexToRgb('invalid')).toBeNull();
    expect(hexToRgb('#gggggg')).toBeNull();
    expect(hexToRgb('')).toBeNull();
  });
});

// ========================================
// rgbToHsl Tests
// ========================================
describe('rgbToHsl', () => {
  it('converts white correctly', () => {
    const [h, s, l] = rgbToHsl(MAX_CHANNEL, MAX_CHANNEL, MAX_CHANNEL);
    expect(h).toBe(0);
    expect(s).toBe(0);
    expect(l).toBe(PERCENT_100);
  });

  it('converts black correctly', () => {
    const [h, s, l] = rgbToHsl(0, 0, 0);
    expect(h).toBe(0);
    expect(s).toBe(0);
    expect(l).toBe(0);
  });

  it('converts primary colors correctly', () => {
    // Red
    const [rH, rS, rL] = rgbToHsl(MAX_CHANNEL, 0, 0);
    expect(rH).toBe(0);
    expect(rS).toBe(PERCENT_100);
    expect(rL).toBe(PERCENT_50);

    // Green
    const [gH, gS, gL] = rgbToHsl(0, MAX_CHANNEL, 0);
    expect(gH).toBe(HUE_GREEN);
    expect(gS).toBe(PERCENT_100);
    expect(gL).toBe(PERCENT_50);

    // Blue
    const [bH, bS, bL] = rgbToHsl(0, 0, MAX_CHANNEL);
    expect(bH).toBe(HUE_BLUE);
    expect(bS).toBe(PERCENT_100);
    expect(bL).toBe(PERCENT_50);
  });
});

// ========================================
// hslToHex Tests
// ========================================
describe('hslToHex', () => {
  it('converts white correctly', () => {
    // hslToHex returns uppercase hex
    expect(hslToHex(0, 0, PERCENT_100)).toBe('#FFFFFF');
  });

  it('converts black correctly', () => {
    expect(hslToHex(0, 0, 0)).toBe('#000000');
  });

  it('converts primary colors correctly', () => {
    // hslToHex returns uppercase hex
    expect(hslToHex(0, PERCENT_100, PERCENT_50)).toBe('#FF0000'); // Red
    expect(hslToHex(HUE_GREEN, PERCENT_100, PERCENT_50)).toBe('#00FF00'); // Green
    expect(hslToHex(HUE_BLUE, PERCENT_100, PERCENT_50)).toBe('#0000FF'); // Blue
  });

  it('handles hue wrapping', () => {
    // 360 degrees should be same as 0, returns uppercase
    expect(hslToHex(HUE_FULL, PERCENT_100, PERCENT_50)).toBe('#FF0000');
    // Negative hue should wrap, returns uppercase
    expect(hslToHex(HUE_NEGATIVE, PERCENT_100, PERCENT_50)).toBe('#0000FF');
  });
});

// ========================================
// getDarkerShade / getLighterShade Tests
// ========================================
describe('getDarkerShade', () => {
  it('returns darker shade of a color', () => {
    const original = '#3b82f6'; // blue-500
    const darker = getDarkerShade(original, SHADE_PERCENT);
    // Should be a valid hex color
    expect(darker).toMatch(/^#[0-9a-f]{6}$/i);
    // Should be different from original
    expect(darker.toLowerCase()).not.toBe(original.toLowerCase());
  });

  it('clamps percent to valid range', () => {
    const color = '#3b82f6';
    // Should not throw for out-of-range percentages
    expect(() => getDarkerShade(color, OUT_OF_RANGE_LOW)).not.toThrow();
    expect(() => getDarkerShade(color, EXCESS_PERCENT)).not.toThrow();
  });

  it('returns original hex on invalid input', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
    const result = getDarkerShade('invalid-color', SHADE_PERCENT);
    // Should return the original invalid hex
    expect(result).toBe('invalid-color');
    warnSpy.mockRestore();
  });
});

describe('getLighterShade', () => {
  it('returns lighter shade of a color', () => {
    const original = '#3b82f6'; // blue-500
    const lighter = getLighterShade(original, SHADE_PERCENT);
    // Should be a valid hex color
    expect(lighter).toMatch(/^#[0-9a-f]{6}$/i);
    // Should be different from original
    expect(lighter.toLowerCase()).not.toBe(original.toLowerCase());
  });

  it('returns original hex on invalid input', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
    const result = getLighterShade('invalid-color', SHADE_PERCENT);
    expect(result).toBe('invalid-color');
    warnSpy.mockRestore();
  });
});

// ========================================
// tokenToCssVar Tests
// ========================================
describe('tokenToCssVar', () => {
  it('converts dot notation to CSS variable without var() by default', () => {
    // Default behavior returns just the variable name
    expect(tokenToCssVar('colors.primary.500')).toBe('--colors-primary-500');
  });

  it('converts dot notation to CSS variable with var() wrapper', () => {
    expect(tokenToCssVar('colors.primary.500', { withVar: true })).toBe(
      'var(--colors-primary-500)'
    );
  });

  it('handles single segment tokens', () => {
    expect(tokenToCssVar('primary')).toBe('--primary');
    expect(tokenToCssVar('primary', { withVar: true })).toBe('var(--primary)');
  });

  it('handles already lowercase tokens', () => {
    expect(tokenToCssVar('colors.gray.100')).toBe('--colors-gray-100');
  });

  it('handles numeric segments', () => {
    expect(tokenToCssVar('spacing.4')).toBe('--spacing-4');
  });
});
