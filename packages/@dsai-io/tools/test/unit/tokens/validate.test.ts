/**
 * Unit tests for the token validation module
 *
 * Tests cover:
 * - Color validation (hex, rgb, hsl, named)
 * - Dimension validation (px, rem, etc.)
 * - Font weight validation
 * - Token structure validation (DTCG compliance)
 * - Collection validation
 * - File validation
 * - Directory validation
 * - Error and warning generation
 */

import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { createResolvedConfig } from '../../../src/config/resolver.js';
import { validateTokens } from '../../../src/tokens/validate.js';

// ============================================================================
// Test Setup
// ============================================================================

const tempDir = join(__dirname, '../../.temp/validate-tests');
const validFixturesDir = join(__dirname, '../../fixtures/tokens/valid');

// Create temp directory
beforeAll(() => {
  if (!existsSync(tempDir)) {
    mkdirSync(tempDir, { recursive: true });
  }
});

// Cleanup temp directory
afterAll(() => {
  if (existsSync(tempDir)) {
    rmSync(tempDir, { recursive: true, force: true });
  }
});

// ============================================================================
// Helper Functions
// ============================================================================

function createTestConfig(collectionsDir: string) {
  return createResolvedConfig({
    tokens: {
      ...createResolvedConfig().tokens,
      collectionsDir,
    },
  });
}

function writeTokenFile(dir: string, filename: string, content: object): string {
  const filePath = join(dir, filename);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  writeFileSync(filePath, JSON.stringify(content, null, 2));
  return filePath;
}

// ============================================================================
// Test Suites
// ============================================================================

describe('validateTokens', () => {
  describe('directory validation', () => {
    it('should return error for non-existent directory', async () => {
      const config = createTestConfig('/nonexistent/path');
      const result = await validateTokens(config, { quiet: true });

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].message).toContain('does not exist');
    });

    it('should return valid for empty directory', async () => {
      const emptyDir = join(tempDir, 'empty');
      mkdirSync(emptyDir, { recursive: true });

      const config = createTestConfig(emptyDir);
      const result = await validateTokens(config, { quiet: true });

      expect(result.valid).toBe(true);
      expect(result.tokenCount).toBe(0);
      expect(result.fileCount).toBe(0);
    });
  });

  describe('valid tokens', () => {
    it('should validate color tokens', async () => {
      const testDir = join(tempDir, 'colors');
      writeTokenFile(testDir, 'colors.json', {
        color: {
          $type: 'color',
          blue: { $value: '#3b82f6' },
          red: { $value: 'rgb(255, 0, 0)' },
          green: { $value: 'hsl(120, 100%, 50%)' },
          transparent: { $value: 'transparent' },
        },
      });

      const config = createTestConfig(testDir);
      const result = await validateTokens(config, { quiet: true });

      expect(result.valid).toBe(true);
      expect(result.tokenCount).toBe(4);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate dimension tokens', async () => {
      const testDir = join(tempDir, 'dimensions');
      writeTokenFile(testDir, 'spacing.json', {
        spacing: {
          $type: 'dimension',
          xs: { $value: '4px' },
          sm: { $value: '8px' },
          md: { $value: '1rem' },
          lg: { $value: '2em' },
          zero: { $value: '0' },
        },
      });

      const config = createTestConfig(testDir);
      const result = await validateTokens(config, { quiet: true });

      expect(result.valid).toBe(true);
      expect(result.tokenCount).toBe(5);
    });

    it('should validate font weight tokens', async () => {
      const testDir = join(tempDir, 'fontweights');
      writeTokenFile(testDir, 'weights.json', {
        fontWeight: {
          $type: 'fontWeight',
          normal: { $value: '400' },
          bold: { $value: '700' },
          keyword: { $value: 'bold' },
        },
      });

      const config = createTestConfig(testDir);
      const result = await validateTokens(config, { quiet: true });

      expect(result.valid).toBe(true);
      expect(result.tokenCount).toBe(3);
    });

    it('should validate token references', async () => {
      const testDir = join(tempDir, 'references');
      writeTokenFile(testDir, 'semantic.json', {
        color: {
          $type: 'color',
          primary: { $value: '{color.blue.500}' },
        },
        spacing: {
          $type: 'dimension',
          component: { $value: '{spacing.md}' },
        },
      });

      const config = createTestConfig(testDir);
      const result = await validateTokens(config, { quiet: true });

      expect(result.valid).toBe(true);
    });
  });

  describe('invalid tokens', () => {
    it('should report error for invalid color', async () => {
      const testDir = join(tempDir, 'invalid-colors');
      writeTokenFile(testDir, 'bad.json', {
        color: {
          bad: { $value: 'not-a-color', $type: 'color' },
        },
      });

      const config = createTestConfig(testDir);
      const result = await validateTokens(config, { quiet: true });

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0].message).toContain('Invalid color');
    });

    it('should report error for invalid dimension', async () => {
      const testDir = join(tempDir, 'invalid-dimensions');
      writeTokenFile(testDir, 'bad.json', {
        spacing: {
          bad: { $value: 'abc', $type: 'dimension' },
        },
      });

      const config = createTestConfig(testDir);
      const result = await validateTokens(config, { quiet: true });

      expect(result.valid).toBe(false);
      expect(result.errors[0].message).toContain('Invalid dimension');
    });

    it('should report error for malformed JSON', async () => {
      const testDir = join(tempDir, 'malformed');
      const filePath = join(testDir, 'bad.json');
      mkdirSync(testDir, { recursive: true });
      writeFileSync(filePath, '{ invalid json }');

      const config = createTestConfig(testDir);
      const result = await validateTokens(config, { quiet: true });

      expect(result.valid).toBe(false);
      expect(result.errors[0].message).toContain('Failed to parse');
    });

    it('should report error for missing value (null)', async () => {
      const testDir = join(tempDir, 'missing-value');
      writeTokenFile(testDir, 'bad.json', {
        token: {
          // Token with null value - still considered a token due to $value key
          noValue: { $value: null, $type: 'color' },
        },
      });

      const config = createTestConfig(testDir);
      const result = await validateTokens(config, { quiet: true });

      expect(result.valid).toBe(false);
      expect(result.errors[0].message).toContain('no value');
    });
  });

  describe('warnings', () => {
    it('should warn for legacy token format', async () => {
      const testDir = join(tempDir, 'legacy');
      writeTokenFile(testDir, 'legacy.json', {
        color: {
          type: 'color',
          blue: { value: '#3b82f6' },
        },
      });

      const config = createTestConfig(testDir);
      const result = await validateTokens(config, { quiet: true });

      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.warnings[0].message).toContain('legacy format');
    });

    it('should warn for missing type', async () => {
      const testDir = join(tempDir, 'no-type');
      writeTokenFile(testDir, 'tokens.json', {
        color: {
          blue: { $value: '#3b82f6' },
        },
      });

      const config = createTestConfig(testDir);
      const result = await validateTokens(config, { quiet: true });

      expect(result.warnings.some((w) => w.message.includes('no type'))).toBe(true);
    });

    it('should warn for empty string value', async () => {
      const testDir = join(tempDir, 'empty-value');
      writeTokenFile(testDir, 'tokens.json', {
        empty: {
          token: { $value: '', $type: 'color' },
        },
      });

      const config = createTestConfig(testDir);
      const result = await validateTokens(config, { quiet: true });

      expect(result.warnings.some((w) => w.message.includes('empty string'))).toBe(true);
    });
  });

  describe('strict mode', () => {
    it('should fail validation with warnings in strict mode', async () => {
      const testDir = join(tempDir, 'strict-warnings');
      writeTokenFile(testDir, 'tokens.json', {
        color: {
          blue: { $value: '#3b82f6' }, // Valid but missing type
        },
      });

      const config = createTestConfig(testDir);
      const result = await validateTokens(config, { quiet: true, strict: true });

      expect(result.valid).toBe(false);
      expect(result.warnings.length).toBeGreaterThan(0);
    });

    it('should pass without warnings in strict mode', async () => {
      const testDir = join(tempDir, 'strict-valid');
      writeTokenFile(testDir, 'tokens.json', {
        color: {
          blue: { $value: '#3b82f6', $type: 'color' },
        },
      });

      const config = createTestConfig(testDir);
      const result = await validateTokens(config, { quiet: true, strict: true });

      expect(result.valid).toBe(true);
    });
  });

  describe('validation result', () => {
    it('should include file count', async () => {
      const testDir = join(tempDir, 'filecount');
      writeTokenFile(testDir, 'file1.json', { a: { $value: '1', $type: 'number' } });
      writeTokenFile(testDir, 'file2.json', { b: { $value: '2', $type: 'number' } });

      const config = createTestConfig(testDir);
      const result = await validateTokens(config, { quiet: true });

      expect(result.fileCount).toBe(2);
    });

    it('should include token count', async () => {
      const testDir = join(tempDir, 'tokencount');
      writeTokenFile(testDir, 'tokens.json', {
        $type: 'color',
        a: { $value: '#111' },
        b: { $value: '#222' },
        c: { $value: '#333' },
      });

      const config = createTestConfig(testDir);
      const result = await validateTokens(config, { quiet: true });

      expect(result.tokenCount).toBe(3);
    });

    it('should include duration', async () => {
      const config = createTestConfig(validFixturesDir);
      const result = await validateTokens(config, { quiet: true });

      expect(result.duration).toBeGreaterThanOrEqual(0);
    });
  });

  describe('recursive validation', () => {
    it('should validate nested directories', async () => {
      const testDir = join(tempDir, 'nested');
      const subDir = join(testDir, 'subdir');

      writeTokenFile(testDir, 'root.json', {
        $type: 'color',
        root: { $value: '#000' },
      });
      writeTokenFile(subDir, 'nested.json', {
        $type: 'color',
        nested: { $value: '#fff' },
      });

      const config = createTestConfig(testDir);
      const result = await validateTokens(config, { quiet: true });

      expect(result.valid).toBe(true);
      expect(result.fileCount).toBe(2);
      expect(result.tokenCount).toBe(2);
    });
  });

  describe('color validation', () => {
    it('should validate hex colors', async () => {
      const testDir = join(tempDir, 'hex-colors');
      writeTokenFile(testDir, 'colors.json', {
        $type: 'color',
        short: { $value: '#fff' },
        long: { $value: '#ffffff' },
        withAlpha: { $value: '#ffffff80' },
      });

      const config = createTestConfig(testDir);
      const result = await validateTokens(config, { quiet: true });

      expect(result.valid).toBe(true);
    });

    it('should validate rgb colors', async () => {
      const testDir = join(tempDir, 'rgb-colors');
      writeTokenFile(testDir, 'colors.json', {
        $type: 'color',
        rgb: { $value: 'rgb(255, 0, 0)' },
        rgba: { $value: 'rgba(255, 0, 0, 0.5)' },
      });

      const config = createTestConfig(testDir);
      const result = await validateTokens(config, { quiet: true });

      expect(result.valid).toBe(true);
    });

    it('should validate hsl colors', async () => {
      const testDir = join(tempDir, 'hsl-colors');
      writeTokenFile(testDir, 'colors.json', {
        $type: 'color',
        hsl: { $value: 'hsl(0, 100%, 50%)' },
        hsla: { $value: 'hsla(0, 100%, 50%, 0.5)' },
      });

      const config = createTestConfig(testDir);
      const result = await validateTokens(config, { quiet: true });

      expect(result.valid).toBe(true);
    });

    it('should validate named colors', async () => {
      const testDir = join(tempDir, 'named-colors');
      writeTokenFile(testDir, 'colors.json', {
        $type: 'color',
        named: { $value: 'red' },
        transparent: { $value: 'transparent' },
      });

      const config = createTestConfig(testDir);
      const result = await validateTokens(config, { quiet: true });

      expect(result.valid).toBe(true);
    });
  });

  describe('dimension validation', () => {
    it('should validate various dimension units', async () => {
      const testDir = join(tempDir, 'dimensions');
      writeTokenFile(testDir, 'dims.json', {
        $type: 'dimension',
        px: { $value: '16px' },
        rem: { $value: '1rem' },
        em: { $value: '1.5em' },
        percent: { $value: '50%' },
        vh: { $value: '100vh' },
        vw: { $value: '100vw' },
      });

      const config = createTestConfig(testDir);
      const result = await validateTokens(config, { quiet: true });

      expect(result.valid).toBe(true);
    });

    it('should validate zero without unit', async () => {
      const testDir = join(tempDir, 'zero-dim');
      writeTokenFile(testDir, 'dims.json', {
        $type: 'dimension',
        zero: { $value: '0' },
      });

      const config = createTestConfig(testDir);
      const result = await validateTokens(config, { quiet: true });

      expect(result.valid).toBe(true);
    });
  });

  describe('fontWeight validation', () => {
    it('should validate numeric font weights', async () => {
      const testDir = join(tempDir, 'font-weights-num');
      writeTokenFile(testDir, 'weights.json', {
        $type: 'fontWeight',
        light: { $value: '300' },
        regular: { $value: '400' },
        bold: { $value: '700' },
      });

      const config = createTestConfig(testDir);
      const result = await validateTokens(config, { quiet: true });

      expect(result.valid).toBe(true);
    });

    it('should validate keyword font weights', async () => {
      const testDir = join(tempDir, 'font-weights-kw');
      writeTokenFile(testDir, 'weights.json', {
        $type: 'fontWeight',
        normal: { $value: 'normal' },
        bold: { $value: 'bold' },
      });

      const config = createTestConfig(testDir);
      const result = await validateTokens(config, { quiet: true });

      expect(result.valid).toBe(true);
    });
  });

  describe('token validation warnings', () => {
    it('should warn for token with empty string value', async () => {
      const testDir = join(tempDir, 'empty-string-value');
      writeTokenFile(testDir, 'tokens.json', {
        $type: 'color',
        empty: { $value: '' },
      });

      const config = createTestConfig(testDir);
      const result = await validateTokens(config, { quiet: true });

      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.warnings.some((w) => w.message.includes('empty string'))).toBe(true);
    });

    it('should warn for token with no type specified', async () => {
      const testDir = join(tempDir, 'no-type');
      writeTokenFile(testDir, 'tokens.json', {
        // No $type at group or token level
        primary: { $value: '#ff0000' },
      });

      const config = createTestConfig(testDir);
      const result = await validateTokens(config, { quiet: true });

      expect(result.warnings.some((w) => w.message.includes('no type specified'))).toBe(true);
    });

    it('should warn for token with unknown type', async () => {
      const testDir = join(tempDir, 'unknown-type');
      writeTokenFile(testDir, 'tokens.json', {
        myToken: { $type: 'unknownCustomType', $value: 'something' },
      });

      const config = createTestConfig(testDir);
      const result = await validateTokens(config, { quiet: true });

      expect(result.warnings.some((w) => w.message.includes('Unknown token type'))).toBe(true);
    });
  });

  describe('type-specific validation errors', () => {
    it('should error on invalid dimension value', async () => {
      const testDir = join(tempDir, 'invalid-dimension');
      writeTokenFile(testDir, 'tokens.json', {
        invalid: { $type: 'dimension', $value: 'abc' },
      });

      const config = createTestConfig(testDir);
      const result = await validateTokens(config, { quiet: true });

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.message.includes('Invalid dimension'))).toBe(true);
    });

    it('should error on invalid fontWeight value', async () => {
      const testDir = join(tempDir, 'invalid-font-weight');
      writeTokenFile(testDir, 'tokens.json', {
        invalid: { $type: 'fontWeight', $value: 'extra-light-invalid' },
      });

      const config = createTestConfig(testDir);
      const result = await validateTokens(config, { quiet: true });

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.message.includes('Invalid fontWeight'))).toBe(true);
    });
  });

  describe('file parsing errors', () => {
    it('should error on invalid JSON file', async () => {
      const testDir = join(tempDir, 'invalid-json');
      if (!existsSync(testDir)) {
        mkdirSync(testDir, { recursive: true });
      }
      writeFileSync(join(testDir, 'broken.json'), '{ invalid json content }');

      const config = createTestConfig(testDir);
      const result = await validateTokens(config, { quiet: true });

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.message.includes('Failed to parse file'))).toBe(true);
    });
  });

  describe('verbose mode', () => {
    let consoleSpy: jest.SpyInstance;

    beforeEach(() => {
      consoleSpy = jest.spyOn(console, 'info').mockImplementation();
      jest.spyOn(console, 'warn').mockImplementation();
      jest.spyOn(console, 'error').mockImplementation();
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should log info in verbose mode', async () => {
      const testDir = join(tempDir, 'verbose-test');
      writeTokenFile(testDir, 'tokens.json', {
        $type: 'color',
        primary: { $value: '#fff' },
      });

      const config = createTestConfig(testDir);
      await validateTokens(config, { verbose: true });

      expect(consoleSpy).toHaveBeenCalled();
    });

    it('should log validation success with warnings', async () => {
      const testDir = join(tempDir, 'verbose-warn');
      writeTokenFile(testDir, 'tokens.json', {
        primary: { $value: '#fff' }, // Missing type
      });

      const config = createTestConfig(testDir);
      await validateTokens(config, { verbose: false, quiet: false });

      // Should log success with warnings
      expect(consoleSpy).toHaveBeenCalled();
    });

    it('should log error count on failed validation', async () => {
      const testDir = join(tempDir, 'verbose-error');
      writeTokenFile(testDir, 'tokens.json', {
        bad: { $type: 'color', $value: 'not-a-color' },
      });

      const config = createTestConfig(testDir);
      const errorSpy = jest.spyOn(console, 'error').mockImplementation();
      await validateTokens(config, { verbose: false, quiet: false });

      expect(errorSpy).toHaveBeenCalled();
    });
  });

  describe('dimension validation edge cases', () => {
    it('should validate negative dimensions', async () => {
      const testDir = join(tempDir, 'neg-dimensions');
      writeTokenFile(testDir, 'dims.json', {
        $type: 'dimension',
        neg: { $value: '-16px' },
      });

      const config = createTestConfig(testDir);
      const result = await validateTokens(config, { quiet: true });

      expect(result.valid).toBe(true);
    });

    it('should validate positive sign dimensions', async () => {
      const testDir = join(tempDir, 'pos-dimensions');
      writeTokenFile(testDir, 'dims.json', {
        $type: 'dimension',
        pos: { $value: '+16px' },
      });

      const config = createTestConfig(testDir);
      const result = await validateTokens(config, { quiet: true });

      expect(result.valid).toBe(true);
    });

    it('should validate decimal dimensions', async () => {
      const testDir = join(tempDir, 'decimal-dims');
      writeTokenFile(testDir, 'dims.json', {
        $type: 'dimension',
        half: { $value: '0.5rem' },
      });

      const config = createTestConfig(testDir);
      const result = await validateTokens(config, { quiet: true });

      expect(result.valid).toBe(true);
    });

    it('should reject empty string dimension', async () => {
      const testDir = join(tempDir, 'empty-dim');
      writeTokenFile(testDir, 'dims.json', {
        $type: 'dimension',
        empty: { $value: '' },
      });

      const config = createTestConfig(testDir);
      const result = await validateTokens(config, { quiet: true });

      // Empty is a warning, not a dimension error
      expect(result.warnings.some((w) => w.message.includes('empty string'))).toBe(true);
    });

    it('should reject dimension with invalid unit', async () => {
      const testDir = join(tempDir, 'bad-unit');
      writeTokenFile(testDir, 'dims.json', {
        bad: { $type: 'dimension', $value: '16xyz' },
      });

      const config = createTestConfig(testDir);
      const result = await validateTokens(config, { quiet: true });

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.message.includes('Invalid dimension'))).toBe(true);
    });

    it('should validate unitless number as dimension (e.g., line-height)', async () => {
      const testDir = join(tempDir, 'unitless-dim');
      writeTokenFile(testDir, 'dims.json', {
        lineHeight: { $type: 'dimension', $value: '1.5' },
      });

      const config = createTestConfig(testDir);
      const result = await validateTokens(config, { quiet: true });

      expect(result.valid).toBe(true);
    });

    it('should validate additional CSS units (pt, cm, mm, in, ch, ex, vmin, vmax)', async () => {
      const testDir = join(tempDir, 'extra-units');
      writeTokenFile(testDir, 'dims.json', {
        $type: 'dimension',
        pt: { $value: '12pt' },
        cm: { $value: '2cm' },
        mm: { $value: '10mm' },
        inch: { $value: '1in' },
        ch: { $value: '2ch' },
        ex: { $value: '1.5ex' },
        vmin: { $value: '50vmin' },
        vmax: { $value: '80vmax' },
      });

      const config = createTestConfig(testDir);
      const result = await validateTokens(config, { quiet: true });

      expect(result.valid).toBe(true);
    });
  });

  describe('font weight validation edge cases', () => {
    it('should validate font weight keyword "lighter"', async () => {
      const testDir = join(tempDir, 'fw-lighter');
      writeTokenFile(testDir, 'fw.json', {
        lighter: { $type: 'fontWeight', $value: 'lighter' },
      });

      const config = createTestConfig(testDir);
      const result = await validateTokens(config, { quiet: true });

      expect(result.valid).toBe(true);
    });

    it('should validate font weight keyword "bolder"', async () => {
      const testDir = join(tempDir, 'fw-bolder');
      writeTokenFile(testDir, 'fw.json', {
        bolder: { $type: 'fontWeight', $value: 'bolder' },
      });

      const config = createTestConfig(testDir);
      const result = await validateTokens(config, { quiet: true });

      expect(result.valid).toBe(true);
    });

    it('should validate font weight reference', async () => {
      const testDir = join(tempDir, 'fw-ref');
      writeTokenFile(testDir, 'fw.json', {
        ref: { $type: 'fontWeight', $value: '{fontWeight.regular}' },
      });

      const config = createTestConfig(testDir);
      const result = await validateTokens(config, { quiet: true });

      expect(result.valid).toBe(true);
    });

    it('should reject invalid font weight string', async () => {
      const testDir = join(tempDir, 'fw-invalid');
      writeTokenFile(testDir, 'fw.json', {
        bad: { $type: 'fontWeight', $value: 'super-heavy' },
      });

      const config = createTestConfig(testDir);
      const result = await validateTokens(config, { quiet: true });

      expect(result.valid).toBe(false);
    });

    it('should validate boundary font weights (1 and 1000)', async () => {
      const testDir = join(tempDir, 'fw-boundary');
      writeTokenFile(testDir, 'fw.json', {
        $type: 'fontWeight',
        min: { $value: '1' },
        max: { $value: '1000' },
      });

      const config = createTestConfig(testDir);
      const result = await validateTokens(config, { quiet: true });

      expect(result.valid).toBe(true);
    });
  });

  describe('color validation edge cases', () => {
    it('should validate named color "currentcolor"', async () => {
      const testDir = join(tempDir, 'named-current');
      writeTokenFile(testDir, 'colors.json', {
        $type: 'color',
        current: { $value: 'currentcolor' },
      });

      const config = createTestConfig(testDir);
      const result = await validateTokens(config, { quiet: true });

      expect(result.valid).toBe(true);
    });

    it('should validate named color "inherit"', async () => {
      const testDir = join(tempDir, 'named-inherit');
      writeTokenFile(testDir, 'colors.json', {
        $type: 'color',
        inherit: { $value: 'inherit' },
      });

      const config = createTestConfig(testDir);
      const result = await validateTokens(config, { quiet: true });

      expect(result.valid).toBe(true);
    });

    it('should validate color reference', async () => {
      const testDir = join(tempDir, 'color-ref');
      writeTokenFile(testDir, 'colors.json', {
        $type: 'color',
        ref: { $value: '{colors.primary}' },
      });

      const config = createTestConfig(testDir);
      const result = await validateTokens(config, { quiet: true });

      expect(result.valid).toBe(true);
    });
  });

  describe('nested collection validation', () => {
    it('should skip metadata keys starting with $', async () => {
      const testDir = join(tempDir, 'skip-meta');
      writeTokenFile(testDir, 'tokens.json', {
        $schema: 'https://example.com/schema',
        $description: 'Top-level description',
        color: {
          primary: { $value: '#fff', $type: 'color' },
        },
      });

      const config = createTestConfig(testDir);
      const result = await validateTokens(config, { quiet: true });

      expect(result.valid).toBe(true);
      expect(result.tokenCount).toBe(1); // Only the token, not $ metadata
    });
  });
});
