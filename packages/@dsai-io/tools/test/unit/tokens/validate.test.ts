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
});
