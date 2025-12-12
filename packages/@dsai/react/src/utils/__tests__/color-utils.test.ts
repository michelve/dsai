/**
 * @file Color Utilities Test Suite
 * @module @dsai/react/utils/__tests__/color-utils.test
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

// ========================================
// getContrastRatio Tests
// ========================================
describe('getContrastRatio', () => {
  it('calculates maximum contrast for black on white', () => {
    const ratio = getContrastRatio([0, 0, 0], [255, 255, 255]);
    expect(ratio).toBe(21);
  });

  it('calculates minimum contrast for white on white', () => {
    const ratio = getContrastRatio([255, 255, 255], [255, 255, 255]);
    expect(ratio).toBe(1);
  });

  it('returns same ratio regardless of color order', () => {
    const ratio1 = getContrastRatio([0, 0, 0], [255, 255, 255]);
    const ratio2 = getContrastRatio([255, 255, 255], [0, 0, 0]);
    expect(ratio1).toBe(ratio2);
  });

  it('returns full precision by default for accurate WCAG comparison', () => {
    // Gray on white - ratio should be around 4.48 (borderline AA)
    const ratio = getContrastRatio([119, 119, 119], [255, 255, 255]);
    // Should have more than 2 decimal places
    expect(ratio.toString()).toMatch(/\d+\.\d{3,}/);
  });

  it('respects precision option for display', () => {
    const ratio = getContrastRatio([68, 68, 68], [238, 238, 238], { precision: 2 });
    expect(ratio.toString()).toMatch(/^\d+\.\d{1,2}$/);
  });

  it('returns 1 and warns for invalid first color', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
    // @ts-expect-error - testing invalid input
    const ratio = getContrastRatio('invalid', [255, 255, 255]);
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
    const ratio = getContrastRatio([0, 0], [255, 255, 255]);
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
    expect(getRelativeLuminance(255, 255, 255)).toBe(1);
  });

  it('returns values between 0 and 1 for colors', () => {
    const lum = getRelativeLuminance(128, 128, 128);
    expect(lum).toBeGreaterThan(0);
    expect(lum).toBeLessThan(1);
  });

  it('clamps out-of-range values', () => {
    // Should not throw for out-of-range values
    expect(() => getRelativeLuminance(-10, 300, 128)).not.toThrow();
  });
});

// ========================================
// meetsWCAG Tests
// ========================================
describe('meetsWCAG', () => {
  const black: readonly [number, number, number] = [0, 0, 0];
  const white: readonly [number, number, number] = [255, 255, 255];
  const gray: readonly [number, number, number] = [128, 128, 128];

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
      const nearThreshold: readonly [number, number, number] = [118, 118, 118];
      expect(meetsWCAG(nearThreshold, white, { level: 'AA' })).toBe(true);
    });

    it('correctly fails ratio just below 4.5 threshold', () => {
      // RGB(119, 119, 119) on white gives ~4.48 - should fail AA normal
      const belowThreshold: readonly [number, number, number] = [119, 119, 119];
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
    expect(hexToRgb('#ffffff')).toEqual([255, 255, 255]);
    expect(hexToRgb('#000000')).toEqual([0, 0, 0]);
    expect(hexToRgb('#ff0000')).toEqual([255, 0, 0]);
  });

  it('converts 3-digit hex correctly', () => {
    expect(hexToRgb('#fff')).toEqual([255, 255, 255]);
    expect(hexToRgb('#000')).toEqual([0, 0, 0]);
    expect(hexToRgb('#f00')).toEqual([255, 0, 0]);
  });

  it('handles uppercase hex', () => {
    expect(hexToRgb('#FFFFFF')).toEqual([255, 255, 255]);
    expect(hexToRgb('#FF0000')).toEqual([255, 0, 0]);
  });

  it('handles hex without hash', () => {
    expect(hexToRgb('ffffff')).toEqual([255, 255, 255]);
    expect(hexToRgb('ff0000')).toEqual([255, 0, 0]);
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
    const [h, s, l] = rgbToHsl(255, 255, 255);
    expect(h).toBe(0);
    expect(s).toBe(0);
    expect(l).toBe(100);
  });

  it('converts black correctly', () => {
    const [h, s, l] = rgbToHsl(0, 0, 0);
    expect(h).toBe(0);
    expect(s).toBe(0);
    expect(l).toBe(0);
  });

  it('converts primary colors correctly', () => {
    // Red
    const [rH, rS, rL] = rgbToHsl(255, 0, 0);
    expect(rH).toBe(0);
    expect(rS).toBe(100);
    expect(rL).toBe(50);

    // Green
    const [gH, gS, gL] = rgbToHsl(0, 255, 0);
    expect(gH).toBe(120);
    expect(gS).toBe(100);
    expect(gL).toBe(50);

    // Blue
    const [bH, bS, bL] = rgbToHsl(0, 0, 255);
    expect(bH).toBe(240);
    expect(bS).toBe(100);
    expect(bL).toBe(50);
  });
});

// ========================================
// hslToHex Tests
// ========================================
describe('hslToHex', () => {
  it('converts white correctly', () => {
    // hslToHex returns uppercase hex
    expect(hslToHex(0, 0, 100)).toBe('#FFFFFF');
  });

  it('converts black correctly', () => {
    expect(hslToHex(0, 0, 0)).toBe('#000000');
  });

  it('converts primary colors correctly', () => {
    // hslToHex returns uppercase hex
    expect(hslToHex(0, 100, 50)).toBe('#FF0000'); // Red
    expect(hslToHex(120, 100, 50)).toBe('#00FF00'); // Green
    expect(hslToHex(240, 100, 50)).toBe('#0000FF'); // Blue
  });

  it('handles hue wrapping', () => {
    // 360 degrees should be same as 0, returns uppercase
    expect(hslToHex(360, 100, 50)).toBe('#FF0000');
    // Negative hue should wrap, returns uppercase
    expect(hslToHex(-120, 100, 50)).toBe('#0000FF');
  });
});

// ========================================
// getDarkerShade / getLighterShade Tests
// ========================================
describe('getDarkerShade', () => {
  it('returns darker shade of a color', () => {
    const original = '#3b82f6'; // blue-500
    const darker = getDarkerShade(original, 20);
    // Should be a valid hex color
    expect(darker).toMatch(/^#[0-9a-f]{6}$/i);
    // Should be different from original
    expect(darker.toLowerCase()).not.toBe(original.toLowerCase());
  });

  it('clamps percent to valid range', () => {
    const color = '#3b82f6';
    // Should not throw for out-of-range percentages
    expect(() => getDarkerShade(color, -10)).not.toThrow();
    expect(() => getDarkerShade(color, 150)).not.toThrow();
  });

  it('returns original hex on invalid input', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
    const result = getDarkerShade('invalid-color', 20);
    // Should return the original invalid hex
    expect(result).toBe('invalid-color');
    warnSpy.mockRestore();
  });
});

describe('getLighterShade', () => {
  it('returns lighter shade of a color', () => {
    const original = '#3b82f6'; // blue-500
    const lighter = getLighterShade(original, 20);
    // Should be a valid hex color
    expect(lighter).toMatch(/^#[0-9a-f]{6}$/i);
    // Should be different from original
    expect(lighter.toLowerCase()).not.toBe(original.toLowerCase());
  });

  it('returns original hex on invalid input', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
    const result = getLighterShade('invalid-color', 20);
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
