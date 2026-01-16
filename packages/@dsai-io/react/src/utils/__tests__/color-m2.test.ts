/**
 * @file M2.2 Color & Theming Utilities Test Suite
 * @module @dsai-io/react/utils/__tests__/color-m2.test
 *
 * Comprehensive test coverage for:
 * - WCAG compliance (getRelativeLuminance, getContrastRatio, meetsWCAG)
 * - Color space conversions (hexToRgb, rgbToHsl, hslToHex)
 * - Shade generation (getLighterShade, getDarkerShade)
 * - Design tokens (tokenToCssVar)
 *
 * Target: 100% code coverage
 */

import {
  getContrastRatio,
  getDarkerShade,
  // Shade Generation
  getLighterShade,
  // WCAG Compliance
  getRelativeLuminance,
  // Color Space Conversions
  hexToRgb,
  hslToHex,
  meetsWCAG,
  rgbToHsl,
  // Design Tokens
  tokenToCssVar,
} from '../color';

describe('M2.2 Color & Theming Utilities', () => {
  // ========================================
  // WCAG Compliance Tests
  // ========================================

  describe('getRelativeLuminance', () => {
    it('should calculate luminance for black', () => {
      expect(getRelativeLuminance(0, 0, 0)).toBe(0);
    });

    it('should calculate luminance for white', () => {
      expect(getRelativeLuminance(255, 255, 255)).toBe(1);
    });

    it('should calculate luminance for red', () => {
      const luminance = getRelativeLuminance(255, 0, 0);
      expect(luminance).toBeCloseTo(0.2126, 4);
    });

    it('should calculate luminance for green', () => {
      const luminance = getRelativeLuminance(0, 255, 0);
      expect(luminance).toBeCloseTo(0.7152, 4);
    });

    it('should calculate luminance for blue', () => {
      const luminance = getRelativeLuminance(0, 0, 255);
      expect(luminance).toBeCloseTo(0.0722, 4);
    });

    it('should calculate luminance for gray', () => {
      const luminance = getRelativeLuminance(128, 128, 128);
      expect(luminance).toBeGreaterThan(0);
      expect(luminance).toBeLessThan(1);
    });

    it('should handle edge case values', () => {
      expect(getRelativeLuminance(1, 1, 1)).toBeGreaterThan(0);
      expect(getRelativeLuminance(254, 254, 254)).toBeLessThan(1);
    });

    it('should clamp values below 0', () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      getRelativeLuminance(-10, 128, 128);
      expect(consoleWarnSpy).toHaveBeenCalled();
      consoleWarnSpy.mockRestore();
    });

    it('should clamp values above 255', () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      getRelativeLuminance(300, 128, 128);
      expect(consoleWarnSpy).toHaveBeenCalled();
      consoleWarnSpy.mockRestore();
    });

    it('should apply gamma correction correctly', () => {
      // For low values (≤ 0.03928), should use linear division
      const lowValue = getRelativeLuminance(10, 10, 10);
      expect(lowValue).toBeGreaterThan(0);

      // For high values (> 0.03928), should use power function
      const highValue = getRelativeLuminance(200, 200, 200);
      expect(highValue).toBeGreaterThan(lowValue);
    });
  });

  describe('getContrastRatio', () => {
    it('should return 21:1 for black and white', () => {
      const ratio = getContrastRatio([0, 0, 0], [255, 255, 255]);
      expect(ratio).toBeCloseTo(21, 1);
    });

    it('should return 1:1 for identical colors', () => {
      expect(getContrastRatio([128, 128, 128], [128, 128, 128])).toBe(1);
      expect(getContrastRatio([255, 0, 0], [255, 0, 0])).toBe(1);
    });

    it('should work regardless of parameter order', () => {
      const ratio1 = getContrastRatio([0, 0, 0], [255, 255, 255]);
      const ratio2 = getContrastRatio([255, 255, 255], [0, 0, 0]);
      expect(ratio1).toBe(ratio2);
    });

    it('should calculate correct ratio for common color pairs', () => {
      // Black text on white background
      const blackOnWhite = getContrastRatio([0, 0, 0], [255, 255, 255]);
      expect(blackOnWhite).toBeGreaterThan(7); // AAA compliant

      // Dark gray on light gray
      const darkGrayOnLightGray = getContrastRatio([80, 80, 80], [200, 200, 200]);
      expect(darkGrayOnLightGray).toBeGreaterThan(3); // Should pass AA large text
    });

    it('should return full precision by default for accurate WCAG comparison', () => {
      // Full precision is returned by default to enable accurate WCAG threshold comparison
      const ratio = getContrastRatio([100, 100, 100], [150, 150, 150]);
      expect(typeof ratio).toBe('number');
      // When precision: 2 is specified, it rounds to 2 decimal places
      const rounded = getContrastRatio([100, 100, 100], [150, 150, 150], { precision: 2 });
      const decimalPlaces = rounded.toString().split('.')[1]?.length || 0;
      expect(decimalPlaces).toBeLessThanOrEqual(2);
    });

    it('should handle edge cases', () => {
      expect(getContrastRatio([0, 0, 0], [0, 0, 0])).toBe(1);
      expect(getContrastRatio([255, 255, 255], [255, 255, 255])).toBe(1);
    });
  });

  describe('meetsWCAG', () => {
    describe('AA compliance', () => {
      it('should pass AA for black on white (normal text)', () => {
        expect(meetsWCAG([0, 0, 0], [255, 255, 255], { level: 'AA' })).toBe(true);
      });

      it('should pass AA for black on white (large text)', () => {
        expect(meetsWCAG([0, 0, 0], [255, 255, 255], { level: 'AA', textSize: 'large' })).toBe(
          true
        );
      });

      it('should fail AA for insufficient contrast (normal text)', () => {
        expect(meetsWCAG([200, 200, 200], [255, 255, 255], { level: 'AA' })).toBe(false);
      });

      it('should pass AA for sufficient contrast (large text)', () => {
        // [145, 145, 145] gives approximately 3.15:1 ratio with white
        expect(
          meetsWCAG([145, 145, 145], [255, 255, 255], { level: 'AA', textSize: 'large' })
        ).toBe(true);
      });
    });

    describe('AAA compliance', () => {
      it('should pass AAA for black on white (normal text)', () => {
        expect(meetsWCAG([0, 0, 0], [255, 255, 255], { level: 'AAA' })).toBe(true);
      });

      it('should pass AAA for black on white (large text)', () => {
        expect(meetsWCAG([0, 0, 0], [255, 255, 255], { level: 'AAA', textSize: 'large' })).toBe(
          true
        );
      });

      it('should fail AAA for borderline AA contrast (normal text)', () => {
        // A ratio around 4.5:1 passes AA but fails AAA (needs 7:1)
        expect(meetsWCAG([118, 118, 118], [255, 255, 255], { level: 'AAA' })).toBe(false);
      });

      it('should pass AAA for sufficient contrast (large text)', () => {
        expect(
          meetsWCAG([100, 100, 100], [255, 255, 255], { level: 'AAA', textSize: 'large' })
        ).toBe(true);
      });
    });

    describe('default behavior', () => {
      it('should default to normal text size', () => {
        // Without specifying textSize, should use normal
        const result = meetsWCAG([0, 0, 0], [255, 255, 255], { level: 'AA' });
        expect(result).toBe(true);
      });

      it('should default to normal text size', () => {
        // Borderline contrast that passes large but fails normal
        const result = meetsWCAG([150, 150, 150], [255, 255, 255], { level: 'AA' });
        expect(result).toBe(false); // Fails because normal text needs 4.5:1
      });
    });

    describe('contrast ratio thresholds', () => {
      it('should require 4.5:1 for AA normal text', () => {
        // Exactly 4.5:1 should pass
        const foreground: readonly [number, number, number] = [118, 118, 118]; // This gives approximately 4.5:1 with white
        expect(meetsWCAG(foreground, [255, 255, 255], { level: 'AA' })).toBe(true);
      });

      it('should require 3:1 for AA large text', () => {
        // [145, 145, 145] gives approximately 3.15:1 with white (meets 3:1 threshold)
        const foreground: readonly [number, number, number] = [145, 145, 145];
        expect(meetsWCAG(foreground, [255, 255, 255], { level: 'AA', textSize: 'large' })).toBe(
          true
        );
      });

      it('should require 7:1 for AAA normal text', () => {
        // [85, 85, 85] gives approximately 7.2:1 with white (meets 7:1 threshold)
        const foreground: readonly [number, number, number] = [85, 85, 85];
        expect(meetsWCAG(foreground, [255, 255, 255], { level: 'AAA' })).toBe(true);
      });

      it('should require 4.5:1 for AAA large text', () => {
        const foreground: readonly [number, number, number] = [118, 118, 118]; // This gives approximately 4.5:1 with white
        expect(meetsWCAG(foreground, [255, 255, 255], { level: 'AAA', textSize: 'large' })).toBe(
          true
        );
      });
    });
  });

  // ========================================
  // Color Space Conversion Tests
  // ========================================

  describe('hexToRgb', () => {
    describe('6-digit hex codes', () => {
      it('should convert black', () => {
        expect(hexToRgb('#000000')).toEqual([0, 0, 0]);
      });

      it('should convert white', () => {
        expect(hexToRgb('#FFFFFF')).toEqual([255, 255, 255]);
      });

      it('should convert red', () => {
        expect(hexToRgb('#FF0000')).toEqual([255, 0, 0]);
      });

      it('should convert green', () => {
        expect(hexToRgb('#00FF00')).toEqual([0, 255, 0]);
      });

      it('should convert blue', () => {
        expect(hexToRgb('#0000FF')).toEqual([0, 0, 255]);
      });

      it('should handle lowercase', () => {
        expect(hexToRgb('#ff5733')).toEqual([255, 87, 51]);
      });

      it('should handle uppercase', () => {
        expect(hexToRgb('#FF5733')).toEqual([255, 87, 51]);
      });

      it('should handle mixed case', () => {
        expect(hexToRgb('#Ff5733')).toEqual([255, 87, 51]);
      });
    });

    describe('3-digit hex codes', () => {
      it('should convert #FFF to white', () => {
        expect(hexToRgb('#FFF')).toEqual([255, 255, 255]);
      });

      it('should convert #000 to black', () => {
        expect(hexToRgb('#000')).toEqual([0, 0, 0]);
      });

      it('should convert #F00 to red', () => {
        expect(hexToRgb('#F00')).toEqual([255, 0, 0]);
      });

      it('should expand digits correctly', () => {
        expect(hexToRgb('#ABC')).toEqual([170, 187, 204]);
      });
    });

    describe('hash prefix handling', () => {
      it('should work with hash prefix', () => {
        expect(hexToRgb('#FF5733')).toEqual([255, 87, 51]);
      });

      it('should work without hash prefix', () => {
        expect(hexToRgb('FF5733')).toEqual([255, 87, 51]);
      });
    });

    describe('invalid input handling', () => {
      it('should return null for invalid format', () => {
        const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
        expect(hexToRgb('invalid')).toBeNull();
        expect(consoleWarnSpy).toHaveBeenCalled();
        consoleWarnSpy.mockRestore();
      });

      it('should return null for wrong length', () => {
        const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
        expect(hexToRgb('#FF')).toBeNull();
        expect(consoleWarnSpy).toHaveBeenCalled();
        consoleWarnSpy.mockRestore();
      });

      it('should return null for invalid characters', () => {
        const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
        expect(hexToRgb('#GGGGGG')).toBeNull();
        expect(consoleWarnSpy).toHaveBeenCalled();
        consoleWarnSpy.mockRestore();
      });

      it('should return null for empty string', () => {
        const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
        expect(hexToRgb('')).toBeNull();
        expect(consoleWarnSpy).toHaveBeenCalled();
        consoleWarnSpy.mockRestore();
      });
    });
  });

  describe('rgbToHsl', () => {
    describe('achromatic colors (no saturation)', () => {
      it('should convert black', () => {
        const [_h, s, l] = rgbToHsl(0, 0, 0);
        expect(s).toBe(0);
        expect(l).toBe(0);
      });

      it('should convert white', () => {
        const [_h, s, l] = rgbToHsl(255, 255, 255);
        expect(s).toBe(0);
        expect(l).toBe(100);
      });

      it('should convert gray', () => {
        const [_h, s, l] = rgbToHsl(128, 128, 128);
        expect(s).toBe(0);
        // 128/255 = 0.50196... which is approximately 50.2%
        expect(l).toBeCloseTo(50.2, 0);
      });
    });

    describe('chromatic colors', () => {
      it('should convert pure red', () => {
        const [h, s, l] = rgbToHsl(255, 0, 0);
        expect(h).toBe(0);
        expect(s).toBe(100);
        expect(l).toBe(50);
      });

      it('should convert pure green', () => {
        const [h, s, l] = rgbToHsl(0, 255, 0);
        expect(h).toBe(120);
        expect(s).toBe(100);
        expect(l).toBe(50);
      });

      it('should convert pure blue', () => {
        const [h, s, l] = rgbToHsl(0, 0, 255);
        expect(h).toBe(240);
        expect(s).toBe(100);
        expect(l).toBe(50);
      });

      it('should convert cyan', () => {
        const [h, s, l] = rgbToHsl(0, 255, 255);
        expect(h).toBe(180);
        expect(s).toBe(100);
        expect(l).toBe(50);
      });

      it('should convert magenta', () => {
        const [h, s, l] = rgbToHsl(255, 0, 255);
        expect(h).toBe(300);
        expect(s).toBe(100);
        expect(l).toBe(50);
      });

      it('should convert yellow', () => {
        const [h, s, l] = rgbToHsl(255, 255, 0);
        expect(h).toBe(60);
        expect(s).toBe(100);
        expect(l).toBe(50);
      });
    });

    describe('hue calculation', () => {
      it('should calculate correct hue when red is max', () => {
        const [h] = rgbToHsl(255, 128, 0); // Orange
        expect(h).toBeCloseTo(30.1, 0);
      });

      it('should calculate correct hue when green is max', () => {
        const [h] = rgbToHsl(128, 255, 0); // Yellow-green
        expect(h).toBeCloseTo(89.9, 0);
      });

      it('should calculate correct hue when blue is max', () => {
        const [h] = rgbToHsl(0, 128, 255); // Sky blue
        expect(h).toBeCloseTo(210, 0);
      });
    });

    describe('input validation', () => {
      it('should clamp values below 0', () => {
        const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
        rgbToHsl(-10, 128, 128);
        expect(consoleWarnSpy).toHaveBeenCalled();
        consoleWarnSpy.mockRestore();
      });

      it('should clamp values above 255', () => {
        const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
        rgbToHsl(300, 128, 128);
        expect(consoleWarnSpy).toHaveBeenCalled();
        consoleWarnSpy.mockRestore();
      });
    });
  });

  describe('hslToHex', () => {
    describe('achromatic colors', () => {
      it('should convert black (L=0)', () => {
        expect(hslToHex(0, 0, 0)).toBe('#000000');
      });

      it('should convert white (L=100)', () => {
        expect(hslToHex(0, 0, 100)).toBe('#FFFFFF');
      });

      it('should convert gray (S=0)', () => {
        const hex = hslToHex(0, 0, 50);
        expect(hex).toMatch(/^#[0-9A-F]{6}$/);
      });
    });

    describe('chromatic colors', () => {
      it('should convert red', () => {
        expect(hslToHex(0, 100, 50)).toBe('#FF0000');
      });

      it('should convert green', () => {
        expect(hslToHex(120, 100, 50)).toBe('#00FF00');
      });

      it('should convert blue', () => {
        expect(hslToHex(240, 100, 50)).toBe('#0000FF');
      });

      it('should convert cyan', () => {
        expect(hslToHex(180, 100, 50)).toBe('#00FFFF');
      });

      it('should convert magenta', () => {
        expect(hslToHex(300, 100, 50)).toBe('#FF00FF');
      });

      it('should convert yellow', () => {
        expect(hslToHex(60, 100, 50)).toBe('#FFFF00');
      });
    });

    describe('hue wrapping', () => {
      it('should wrap hue >= 360', () => {
        expect(hslToHex(360, 100, 50)).toBe(hslToHex(0, 100, 50));
        expect(hslToHex(480, 100, 50)).toBe(hslToHex(120, 100, 50));
      });

      it('should wrap negative hue', () => {
        expect(hslToHex(-60, 100, 50)).toBe(hslToHex(300, 100, 50));
      });
    });

    describe('input clamping', () => {
      it('should clamp saturation below 0', () => {
        const result = hslToHex(0, -10, 50);
        expect(result).toBe(hslToHex(0, 0, 50));
      });

      it('should clamp saturation above 100', () => {
        const result = hslToHex(0, 150, 50);
        expect(result).toBe(hslToHex(0, 100, 50));
      });

      it('should clamp lightness below 0', () => {
        expect(hslToHex(0, 100, -10)).toBe('#000000');
      });

      it('should clamp lightness above 100', () => {
        expect(hslToHex(0, 100, 150)).toBe('#FFFFFF');
      });
    });

    describe('output format', () => {
      it('should return uppercase hex', () => {
        const hex = hslToHex(180, 50, 50);
        expect(hex).toMatch(/^#[0-9A-F]{6}$/);
        expect(hex).not.toMatch(/[a-f]/);
      });

      it('should pad single digits', () => {
        const hex = hslToHex(0, 100, 2);
        expect(hex).toHaveLength(7); // # + 6 characters
      });
    });
  });

  // ========================================
  // Shade Generation Tests
  // ========================================

  describe('getLighterShade', () => {
    it('should make color lighter', () => {
      const original = '#808080'; // Gray
      const lighter = getLighterShade(original, 20);
      const originalRgb = hexToRgb(original);
      const lighterRgb = hexToRgb(lighter);

      expect(lighterRgb).not.toBeNull();
      if (originalRgb && lighterRgb) {
        // Lighter shade should have higher RGB values
        expect(lighterRgb[0]).toBeGreaterThanOrEqual(originalRgb[0]);
        expect(lighterRgb[1]).toBeGreaterThanOrEqual(originalRgb[1]);
        expect(lighterRgb[2]).toBeGreaterThanOrEqual(originalRgb[2]);
      }
    });

    it('should handle 0% lighter (no change)', () => {
      // Use a pure color that doesn't have rounding issues in HSL conversion
      const original = '#FF0000';
      const lighter = getLighterShade(original, 0);
      expect(lighter).toBe(original);
    });

    it('should handle 100% lighter (approach white)', () => {
      const lighter = getLighterShade('#808080', 100);
      expect(lighter).toBe('#FFFFFF');
    });

    it('should handle invalid hex gracefully', () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      const result = getLighterShade('invalid', 20);
      expect(result).toBe('invalid');
      expect(consoleWarnSpy).toHaveBeenCalled();
      consoleWarnSpy.mockRestore();
    });

    it('should clamp percentage below 0', () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      getLighterShade('#FF5733', -10);
      expect(consoleWarnSpy).toHaveBeenCalled();
      consoleWarnSpy.mockRestore();
    });

    it('should clamp percentage above 100', () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      getLighterShade('#FF5733', 150);
      expect(consoleWarnSpy).toHaveBeenCalled();
      consoleWarnSpy.mockRestore();
    });

    it('should work with already light colors', () => {
      const lighter = getLighterShade('#F0F0F0', 50);
      expect(lighter).toMatch(/^#[0-9A-F]{6}$/);
    });

    it('should create visible difference for UI states', () => {
      const original = '#3498db'; // Blue
      const lighter = getLighterShade(original, 20);
      expect(lighter).not.toBe(original);

      // Should have sufficient contrast for hover state
      const originalRgb = hexToRgb(original);
      const lighterRgb = hexToRgb(lighter);
      expect(originalRgb).not.toBeNull();
      expect(lighterRgb).not.toBeNull();
      if (originalRgb && lighterRgb) {
        const ratio = getContrastRatio(originalRgb, lighterRgb);
        expect(ratio).toBeGreaterThan(1);
      }
    });
  });

  describe('getDarkerShade', () => {
    it('should make color darker', () => {
      const original = '#808080'; // Gray
      const darker = getDarkerShade(original, 20);
      const originalRgb = hexToRgb(original);
      const darkerRgb = hexToRgb(darker);

      expect(darkerRgb).not.toBeNull();
      if (originalRgb && darkerRgb) {
        // Darker shade should have lower RGB values
        expect(darkerRgb[0]).toBeLessThanOrEqual(originalRgb[0]);
        expect(darkerRgb[1]).toBeLessThanOrEqual(originalRgb[1]);
        expect(darkerRgb[2]).toBeLessThanOrEqual(originalRgb[2]);
      }
    });

    it('should handle 0% darker (no change)', () => {
      // Use a pure color that doesn't have rounding issues in HSL conversion
      const original = '#FF0000';
      const darker = getDarkerShade(original, 0);
      expect(darker).toBe(original);
    });

    it('should handle 100% darker (approach black)', () => {
      const darker = getDarkerShade('#808080', 100);
      expect(darker).toBe('#000000');
    });

    it('should handle invalid hex gracefully', () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      const result = getDarkerShade('invalid', 20);
      expect(result).toBe('invalid');
      expect(consoleWarnSpy).toHaveBeenCalled();
      consoleWarnSpy.mockRestore();
    });

    it('should clamp percentage below 0', () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      getDarkerShade('#FF5733', -10);
      expect(consoleWarnSpy).toHaveBeenCalled();
      consoleWarnSpy.mockRestore();
    });

    it('should clamp percentage above 100', () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      getDarkerShade('#FF5733', 150);
      expect(consoleWarnSpy).toHaveBeenCalled();
      consoleWarnSpy.mockRestore();
    });

    it('should work with already dark colors', () => {
      const darker = getDarkerShade('#101010', 50);
      expect(darker).toMatch(/^#[0-9A-F]{6}$/);
    });

    it('should create visible difference for UI states', () => {
      const original = '#3498db'; // Blue
      const darker = getDarkerShade(original, 20);
      expect(darker).not.toBe(original);

      // Should have sufficient contrast for active state
      const originalRgb = hexToRgb(original);
      const darkerRgb = hexToRgb(darker);
      expect(originalRgb).not.toBeNull();
      expect(darkerRgb).not.toBeNull();
      if (originalRgb && darkerRgb) {
        const ratio = getContrastRatio(originalRgb, darkerRgb);
        expect(ratio).toBeGreaterThan(1);
      }
    });
  });

  describe('shade generation roundtrip', () => {
    it('should be able to lighten then darken back', () => {
      const original = '#808080';
      const lighter = getLighterShade(original, 20);
      const backToDark = getDarkerShade(lighter, 20);

      // Due to rounding, might not be exactly the same, but should be close
      const originalRgb = hexToRgb(original);
      const backRgb = hexToRgb(backToDark);
      expect(originalRgb).not.toBeNull();
      expect(backRgb).not.toBeNull();

      if (originalRgb && backRgb) {
        expect(Math.abs(originalRgb[0] - backRgb[0])).toBeLessThan(10);
        expect(Math.abs(originalRgb[1] - backRgb[1])).toBeLessThan(10);
        expect(Math.abs(originalRgb[2] - backRgb[2])).toBeLessThan(10);
      }
    });
  });

  // ========================================
  // Design Token Tests
  // ========================================

  describe('tokenToCssVar', () => {
    describe('basic conversion', () => {
      it('should convert single token', () => {
        expect(tokenToCssVar('primary')).toBe('--primary');
      });

      it('should convert dot notation', () => {
        expect(tokenToCssVar('colors.primary.500')).toBe('--colors-primary-500');
      });

      it('should convert to lowercase', () => {
        expect(tokenToCssVar('Colors.PRIMARY.500')).toBe('--colors-primary-500');
      });
    });

    describe('prefix support', () => {
      it('should add prefix', () => {
        expect(tokenToCssVar('primary.500', { prefix: 'color' })).toBe('--color-primary-500');
      });

      it('should lowercase prefix', () => {
        expect(tokenToCssVar('primary', { prefix: 'COLOR' })).toBe('--color-primary');
      });
    });

    describe('var() wrapper', () => {
      it('should wrap in var()', () => {
        expect(tokenToCssVar('primary', { withVar: true })).toBe('var(--primary)');
      });

      it('should wrap with prefix and var()', () => {
        expect(tokenToCssVar('blue.500', { prefix: 'color', withVar: true })).toBe(
          'var(--color-blue-500)'
        );
      });
    });

    describe('input validation', () => {
      it('should handle empty string', () => {
        const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
        expect(tokenToCssVar('')).toBe('');
        expect(consoleWarnSpy).toHaveBeenCalled();
        consoleWarnSpy.mockRestore();
      });

      it('should handle whitespace-only string', () => {
        const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
        expect(tokenToCssVar('   ')).toBe('');
        expect(consoleWarnSpy).toHaveBeenCalled();
        consoleWarnSpy.mockRestore();
      });

      it('should trim whitespace', () => {
        expect(tokenToCssVar('  colors.primary  ')).toBe('--colors-primary');
      });
    });

    describe('real-world examples', () => {
      it('should convert spacing tokens', () => {
        expect(tokenToCssVar('spacing.xl')).toBe('--spacing-xl');
        expect(tokenToCssVar('spacing.xl', { withVar: true })).toBe('var(--spacing-xl)');
      });

      it('should convert typography tokens', () => {
        expect(tokenToCssVar('font.size.lg')).toBe('--font-size-lg');
        expect(tokenToCssVar('font.size.lg', { prefix: 'typography' })).toBe(
          '--typography-font-size-lg'
        );
      });

      it('should convert color tokens', () => {
        expect(tokenToCssVar('colors.brand.primary.500')).toBe('--colors-brand-primary-500');
        expect(tokenToCssVar('brand.primary.500', { prefix: 'color', withVar: true })).toBe(
          'var(--color-brand-primary-500)'
        );
      });

      it('should convert shadow tokens', () => {
        expect(tokenToCssVar('shadow.elevation.3')).toBe('--shadow-elevation-3');
      });
    });
  });

  // ========================================
  // Integration Tests
  // ========================================

  describe('color conversion roundtrip', () => {
    it('should convert hex -> rgb -> hsl -> hex', () => {
      // Test with pure colors that have exact roundtrip conversion
      const pureColors = ['#FF0000', '#00FF00', '#0000FF', '#FFFFFF', '#000000'];

      pureColors.forEach((original) => {
        const rgb = hexToRgb(original);
        expect(rgb).not.toBeNull();

        if (rgb) {
          const hsl = rgbToHsl(...rgb);
          const backToHex = hslToHex(...hsl);
          expect(backToHex).toBe(original);
        }
      });
    });

    it('should have minimal color difference after roundtrip for mixed colors', () => {
      const original = '#FF5733';
      const rgb = hexToRgb(original);
      expect(rgb).not.toBeNull();

      if (rgb) {
        const hsl = rgbToHsl(...rgb);
        const backToHex = hslToHex(...hsl);
        const backRgb = hexToRgb(backToHex);

        expect(backRgb).not.toBeNull();
        if (backRgb) {
          // Allow for minor rounding differences (±1 per channel)
          expect(Math.abs(rgb[0] - backRgb[0])).toBeLessThanOrEqual(1);
          expect(Math.abs(rgb[1] - backRgb[1])).toBeLessThanOrEqual(1);
          expect(Math.abs(rgb[2] - backRgb[2])).toBeLessThanOrEqual(1);
        }
      }
    });

    it('should maintain color through multiple conversions', () => {
      const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFFFF', '#000000'];

      colors.forEach((color) => {
        const rgb = hexToRgb(color);
        if (rgb) {
          const hsl = rgbToHsl(...rgb);
          const backToHex = hslToHex(...hsl);
          expect(backToHex).toBe(color);
        }
      });
    });
  });

  describe('WCAG integration with color conversions', () => {
    it('should work with hex colors converted to RGB', () => {
      const black = hexToRgb('#000000');
      const white = hexToRgb('#FFFFFF');

      expect(black).not.toBeNull();
      expect(white).not.toBeNull();

      if (black && white) {
        expect(meetsWCAG(black, white, { level: 'AAA' })).toBe(true);
      }
    });

    it('should validate lighter/darker shades for accessibility', () => {
      const primary = '#3498db';
      const lighter = getLighterShade(primary, 40);

      const primaryRgb = hexToRgb(primary);
      const lighterRgb = hexToRgb(lighter);

      expect(primaryRgb).not.toBeNull();
      expect(lighterRgb).not.toBeNull();

      if (primaryRgb && lighterRgb) {
        const ratio = getContrastRatio(primaryRgb, lighterRgb);
        expect(ratio).toBeGreaterThan(1);
      }
    });
  });
});
