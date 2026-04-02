/**
 * Unit tests for Figma export validation
 *
 * Tests cover:
 * - validateFigmaFile function
 * - validateFigmaExports function
 * - Token validation (DTCG and legacy formats)
 * - Collection structure validation
 * - Mode detection
 * - Error handling
 */

import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { validateFigmaExports, validateFigmaFile } from '../../../src/tokens/validate-figma.js';

import type { ValidateFigmaOptions } from '../../../src/tokens/validate-figma.js';

// ============================================================================
// Test Setup
// ============================================================================

describe('validate-figma', () => {
  let testDir: string;

  beforeEach(() => {
    testDir = join(
      tmpdir(),
      `validate-figma-test-${Date.now()}-${Math.random().toString(36).slice(2)}`
    );
    mkdirSync(testDir, { recursive: true });
  });

  afterEach(() => {
    if (testDir && existsSync(testDir)) {
      rmSync(testDir, { recursive: true, force: true });
    }
  });

  // ==========================================================================
  // validateFigmaFile
  // ==========================================================================

  describe('validateFigmaFile', () => {
    it('should validate a valid token file', () => {
      const filePath = join(testDir, 'foundation.json');
      const validTokens = {
        Foundation: {
          modes: {
            Light: {
              colors: {
                primary: {
                  $type: 'color',
                  $value: '#007bff',
                },
              },
            },
          },
        },
      };
      writeFileSync(filePath, JSON.stringify(validTokens), 'utf8');

      const result = validateFigmaFile(filePath);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.tokenCount).toBe(1);
    });

    it('should detect missing file', () => {
      const result = validateFigmaFile(join(testDir, 'nonexistent.json'));

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]?.message).toContain('not found');
    });

    it('should detect invalid JSON', () => {
      const filePath = join(testDir, 'invalid.json');
      writeFileSync(filePath, 'not valid json {', 'utf8');

      const result = validateFigmaFile(filePath);

      expect(result.valid).toBe(false);
      expect(result.errors[0]?.message).toContain('Failed to parse JSON');
    });

    it('should detect non-object JSON', () => {
      const filePath = join(testDir, 'array.json');
      writeFileSync(filePath, '[]', 'utf8');

      const result = validateFigmaFile(filePath);

      expect(result.valid).toBe(false);
      expect(result.errors[0]?.message).toContain('must be a JSON object');
    });

    it('should detect modes in token structure', () => {
      const filePath = join(testDir, 'foundation.json');
      const tokens = {
        Foundation: {
          modes: {
            Light: { colors: { primary: { $type: 'color', $value: '#fff' } } },
            Dark: { colors: { primary: { $type: 'color', $value: '#000' } } },
          },
        },
      };
      writeFileSync(filePath, JSON.stringify(tokens), 'utf8');

      const result = validateFigmaFile(filePath);

      expect(result.detectedModes.has('Light')).toBe(true);
      expect(result.detectedModes.has('Dark')).toBe(true);
    });

    it('should count tokens correctly', () => {
      const filePath = join(testDir, 'tokens.json');
      const tokens = {
        Colors: {
          modes: {
            Base: {
              primary: { $type: 'color', $value: '#007bff' },
              secondary: { $type: 'color', $value: '#6c757d' },
              nested: {
                deep: { $type: 'color', $value: '#28a745' },
              },
            },
          },
        },
      };
      writeFileSync(filePath, JSON.stringify(tokens), 'utf8');

      const result = validateFigmaFile(filePath);

      expect(result.tokenCount).toBe(3);
    });

    it('should warn for legacy token format', () => {
      const filePath = join(testDir, 'legacy.json');
      const tokens = {
        Legacy: {
          colors: {
            primary: {
              value: '#007bff', // Legacy format (no $)
              type: 'color',
            },
          },
        },
      };
      writeFileSync(filePath, JSON.stringify(tokens), 'utf8');

      const result = validateFigmaFile(filePath);

      expect(result.warnings.length).toBeGreaterThan(0);
      const legacyWarning = result.warnings.find((w) => w.message.includes('legacy'));
      expect(legacyWarning).toBeDefined();
    });

    it('should error for tokens with undefined $value', () => {
      const filePath = join(testDir, 'invalid-token.json');
      const tokens = {
        Invalid: {
          broken: {
            $type: 'color',
            $value: null,
          },
        },
      };
      writeFileSync(filePath, JSON.stringify(tokens), 'utf8');

      const result = validateFigmaFile(filePath);

      expect(result.errors.length).toBeGreaterThan(0);
      const valueError = result.errors.find((e) => e.message.includes('undefined or null'));
      expect(valueError).toBeDefined();
    });

    it('should validate with expected collection structure', () => {
      const filePath = join(testDir, 'foundation.json');
      const tokens = {
        Foundation: {
          modes: {
            Light: { colors: { primary: { $type: 'color', $value: '#fff' } } },
          },
        },
      };
      writeFileSync(filePath, JSON.stringify(tokens), 'utf8');

      const expectedCollection = {
        input: 'foundation.json',
        modeAware: true,
        modes: ['Light', 'Dark'],
      };

      const result = validateFigmaFile(filePath, expectedCollection);

      // Should warn about missing Dark mode
      const modeWarning = result.warnings.find((w) => w.message.includes('Dark'));
      expect(modeWarning).toBeDefined();
    });
  });

  // ==========================================================================
  // validateFigmaExports
  // ==========================================================================

  describe('validateFigmaExports', () => {
    it('should require exports directory', () => {
      const result = validateFigmaExports({});

      expect(result.valid).toBe(false);
      expect(result.errors[0]?.message).toContain('not specified');
    });

    it('should detect missing exports directory', () => {
      const result = validateFigmaExports({
        exportsDir: join(testDir, 'nonexistent'),
      });

      expect(result.valid).toBe(false);
      expect(result.errors[0]?.message).toContain('not found');
    });

    it('should validate all files in directory', () => {
      const exportsDir = join(testDir, 'exports');
      mkdirSync(exportsDir, { recursive: true });

      // Create foundation.json
      writeFileSync(
        join(exportsDir, 'foundation.json'),
        JSON.stringify({
          Foundation: {
            modes: {
              Light: { colors: { primary: { $type: 'color', $value: '#fff' } } },
            },
          },
        }),
        'utf8'
      );

      const result = validateFigmaExports({
        exportsDir,
        collections: {
          foundation: {
            input: 'foundation.json',
            modeAware: false,
          },
        },
      });

      expect(result.files.has('foundation.json')).toBe(true);
      expect(result.tokenCount).toBeGreaterThan(0);
    });

    it('should report missing expected files', () => {
      const exportsDir = join(testDir, 'exports');
      mkdirSync(exportsDir, { recursive: true });

      const result = validateFigmaExports({
        exportsDir,
        collections: {
          missing: {
            input: 'missing.json',
            modeAware: false,
          },
        },
      });

      expect(result.valid).toBe(false);
      expect(result.missingFiles).toContain('missing.json');
    });

    it('should skip missing files when skipMissing is true', () => {
      const exportsDir = join(testDir, 'exports');
      mkdirSync(exportsDir, { recursive: true });

      const result = validateFigmaExports({
        exportsDir,
        collections: {
          missing: {
            input: 'missing.json',
            modeAware: false,
          },
        },
        skipMissing: true,
      });

      // Should not have errors for missing files
      const missingError = result.errors.find((e) => e.message.includes('not found'));
      expect(missingError).toBeUndefined();
      expect(result.missingFiles).toContain('missing.json');
    });

    it('should aggregate modes from all files', () => {
      const exportsDir = join(testDir, 'exports');
      mkdirSync(exportsDir, { recursive: true });

      writeFileSync(
        join(exportsDir, 'colors.json'),
        JSON.stringify({
          Colors: {
            modes: {
              Light: { primary: { $type: 'color', $value: '#fff' } },
              Dark: { primary: { $type: 'color', $value: '#000' } },
            },
          },
        }),
        'utf8'
      );

      writeFileSync(
        join(exportsDir, 'typography.json'),
        JSON.stringify({
          Typography: {
            modes: {
              Base: { fontSize: { $type: 'dimension', $value: '16px' } },
            },
          },
        }),
        'utf8'
      );

      const result = validateFigmaExports({
        exportsDir,
        collections: {
          colors: { input: 'colors.json', modeAware: true },
          typography: { input: 'typography.json', modeAware: false },
        },
      });

      expect(result.detectedModes.has('Light')).toBe(true);
      expect(result.detectedModes.has('Dark')).toBe(true);
      expect(result.detectedModes.has('Base')).toBe(true);
    });

    it('should use config sourceDir when exportsDir not provided', () => {
      const sourceDir = join(testDir, 'src-tokens');
      mkdirSync(sourceDir, { recursive: true });

      writeFileSync(
        join(sourceDir, 'test.json'),
        JSON.stringify({
          Test: { token: { $type: 'color', $value: '#fff' } },
        }),
        'utf8'
      );

      const options: ValidateFigmaOptions = {
        config: {
          tokens: { sourceDir },
        } as ValidateFigmaOptions['config'],
        collections: {
          test: { input: 'test.json', modeAware: false },
        },
      };

      const result = validateFigmaExports(options);

      expect(result.files.has('test.json')).toBe(true);
    });

    it('should count total tokens across all files', () => {
      const exportsDir = join(testDir, 'exports');
      mkdirSync(exportsDir, { recursive: true });

      writeFileSync(
        join(exportsDir, 'a.json'),
        JSON.stringify({
          A: {
            token1: { $type: 'color', $value: '#fff' },
            token2: { $type: 'color', $value: '#000' },
          },
        }),
        'utf8'
      );

      writeFileSync(
        join(exportsDir, 'b.json'),
        JSON.stringify({
          B: {
            token3: { $type: 'dimension', $value: '16px' },
          },
        }),
        'utf8'
      );

      const result = validateFigmaExports({
        exportsDir,
        collections: {
          a: { input: 'a.json', modeAware: false },
          b: { input: 'b.json', modeAware: false },
        },
      });

      expect(result.tokenCount).toBe(3);
      expect(result.fileCount).toBe(2);
    });
  });

  // ==========================================================================
  // Token Type Validation
  // ==========================================================================

  describe('Token Type Validation', () => {
    it('should accept valid token types', () => {
      const filePath = join(testDir, 'valid-types.json');
      const tokens = {
        Valid: {
          color: { $type: 'color', $value: '#007bff' },
          dimension: { $type: 'dimension', $value: '16px' },
          fontFamily: { $type: 'fontFamily', $value: 'Arial' },
          fontWeight: { $type: 'fontWeight', $value: '400' },
          duration: { $type: 'duration', $value: '200ms' },
          cubicBezier: { $type: 'cubicBezier', $value: [0.4, 0, 0.2, 1] },
        },
      };
      writeFileSync(filePath, JSON.stringify(tokens), 'utf8');

      const result = validateFigmaFile(filePath);

      expect(result.errors).toHaveLength(0);
    });

    it('should warn for unknown token types', () => {
      const filePath = join(testDir, 'unknown-type.json');
      const tokens = {
        Unknown: {
          weird: { $type: 'weirdUnknownType', $value: 'something' },
        },
      };
      writeFileSync(filePath, JSON.stringify(tokens), 'utf8');

      const result = validateFigmaFile(filePath);

      const typeWarning = result.warnings.find((w) => w.message.includes('Unknown token type'));
      expect(typeWarning).toBeDefined();
    });
  });

  // ==========================================================================
  // Edge Cases
  // ==========================================================================

  describe('Edge Cases', () => {
    it('should handle empty collection', () => {
      const filePath = join(testDir, 'empty.json');
      writeFileSync(filePath, '{}', 'utf8');

      const result = validateFigmaFile(filePath);

      expect(result.valid).toBe(true);
      expect(result.tokenCount).toBe(0);
    });

    it('should handle deeply nested tokens', () => {
      const filePath = join(testDir, 'deep.json');
      const tokens = {
        Deep: {
          level1: {
            level2: {
              level3: {
                level4: {
                  token: { $type: 'color', $value: '#fff' },
                },
              },
            },
          },
        },
      };
      writeFileSync(filePath, JSON.stringify(tokens), 'utf8');

      const result = validateFigmaFile(filePath);

      expect(result.tokenCount).toBe(1);
      expect(result.errors).toHaveLength(0);
    });

    it('should handle mixed token and group structures', () => {
      const filePath = join(testDir, 'mixed.json');
      const tokens = {
        Mixed: {
          colors: {
            primary: { $type: 'color', $value: '#007bff' },
            nested: {
              secondary: { $type: 'color', $value: '#6c757d' },
            },
          },
        },
      };
      writeFileSync(filePath, JSON.stringify(tokens), 'utf8');

      const result = validateFigmaFile(filePath);

      expect(result.tokenCount).toBe(2);
      expect(result.errors).toHaveLength(0);
    });

    it('should handle null values in token tree', () => {
      const filePath = join(testDir, 'nulls.json');
      const tokens = {
        Nulls: {
          valid: { $type: 'color', $value: '#fff' },
          nullValue: null,
        },
      };
      writeFileSync(filePath, JSON.stringify(tokens), 'utf8');

      const result = validateFigmaFile(filePath);

      // Should still find the valid token
      expect(result.tokenCount).toBe(1);
    });

    it('should handle collection without modes (general validation)', () => {
      const filePath = join(testDir, 'no-modes.json');
      const tokens = {
        Simple: {
          token: { $type: 'color', $value: '#ff0' },
        },
      };
      writeFileSync(filePath, JSON.stringify(tokens), 'utf8');

      const result = validateFigmaFile(filePath);

      expect(result.valid).toBe(true);
      expect(result.tokenCount).toBe(1);
    });

    it('should detect modes from general validation without expected collection', () => {
      const filePath = join(testDir, 'auto-modes.json');
      const tokens = {
        Collection: {
          modes: {
            ModeA: { token: { $type: 'color', $value: '#aaa' } },
            ModeB: { token: { $type: 'color', $value: '#bbb' } },
          },
        },
      };
      writeFileSync(filePath, JSON.stringify(tokens), 'utf8');

      const result = validateFigmaFile(filePath);

      expect(result.detectedModes.has('ModeA')).toBe(true);
      expect(result.detectedModes.has('ModeB')).toBe(true);
    });

    it('should error when expected collection not found in data', () => {
      const filePath = join(testDir, 'wrong-collection.json');
      writeFileSync(
        filePath,
        JSON.stringify({ WrongName: { modes: { Base: {} } } }),
        'utf8'
      );

      const result = validateFigmaFile(filePath, {
        input: 'wrong-collection.json',
        modeAware: true,
        modes: ['Base'],
      });

      // The expected collection name derived from filename is "Wrong-collection"
      // which won't match "WrongName"
      expect(result.errors.some((e) => e.message.includes('not found in export'))).toBe(true);
    });

    it('should validate tokens within modes of expected collection', () => {
      const filePath = join(testDir, 'foundation.json');
      const tokens = {
        Foundation: {
          modes: {
            Light: {
              primary: { $type: 'color', $value: '#fff' },
              nullToken: { $type: 'color', $value: null },
            },
          },
        },
      };
      writeFileSync(filePath, JSON.stringify(tokens), 'utf8');

      const result = validateFigmaFile(filePath, {
        input: 'foundation.json',
        modeAware: true,
        modes: ['Light'],
      });

      expect(result.errors.some((e) => e.message.includes('undefined or null'))).toBe(true);
    });

    it('should validate collection without modes structure when expected', () => {
      const filePath = join(testDir, 'flat.json');
      const tokens = {
        Flat: {
          token: { $type: 'color', $value: '#000' },
        },
      };
      writeFileSync(filePath, JSON.stringify(tokens), 'utf8');

      const result = validateFigmaFile(filePath, {
        input: 'flat.json',
        modeAware: false,
      });

      // Should validate tokens at collection level
      expect(result.tokenCount).toBeGreaterThan(0);
    });

    it('should handle legacy tokens with null value', () => {
      const filePath = join(testDir, 'legacy-null.json');
      const tokens = {
        Legacy: {
          broken: {
            value: null,
            type: 'color',
          },
        },
      };
      writeFileSync(filePath, JSON.stringify(tokens), 'utf8');

      const result = validateFigmaFile(filePath);

      expect(result.errors.some((e) => e.message.includes('undefined or null'))).toBe(true);
    });
  });

  // ==========================================================================
  // detectModes
  // ==========================================================================

  describe('detectModes', () => {
    let detectModesFn: typeof import('../../../src/tokens/validate-figma.js').detectModes;

    beforeAll(async () => {
      const mod = await import('../../../src/tokens/validate-figma.js');
      detectModesFn = mod.detectModes;
    });

    it('should return Base for null data', () => {
      expect(detectModesFn(null as any)).toEqual(['Base']);
    });

    it('should return Base for non-object data', () => {
      expect(detectModesFn('string' as any)).toEqual(['Base']);
    });

    it('should detect modes from collection name (case-insensitive)', () => {
      const data = {
        Foundation: {
          modes: { Light: {}, Dark: {} },
        },
      };
      expect(detectModesFn(data as any, 'foundation')).toEqual(['Light', 'Dark']);
    });

    it('should return Base when named collection has no modes', () => {
      const data = {
        Simple: { tokens: {} },
      };
      expect(detectModesFn(data as any, 'simple')).toEqual(['Base']);
    });

    it('should detect modes from any collection when no name specified', () => {
      const data = {
        AnyCollection: {
          modes: { Desktop: {}, Mobile: {} },
        },
      };
      expect(detectModesFn(data as any)).toEqual(['Desktop', 'Mobile']);
    });

    it('should return Base when no modes found in any collection', () => {
      const data = {
        Flat: { token: { $value: '#fff' } },
      };
      expect(detectModesFn(data as any)).toEqual(['Base']);
    });
  });

  // ==========================================================================
  // validateFigmaExports - additional coverage
  // ==========================================================================

  describe('validateFigmaExports - strict mode', () => {
    it('should treat warnings as errors in strict mode', () => {
      const exportsDir = join(testDir, 'exports');
      mkdirSync(exportsDir, { recursive: true });

      writeFileSync(
        join(exportsDir, 'colors.json'),
        JSON.stringify({
          Colors: {
            modes: {
              Light: {
                primary: { value: '#fff', type: 'color' }, // Legacy format
              },
            },
          },
        }),
        'utf8'
      );

      const result = validateFigmaExports({
        exportsDir,
        collections: {
          colors: { input: 'colors.json', modeAware: true, modes: ['Light'] },
        },
        strict: true,
      });

      // Legacy format warnings should cause strict mode to fail
      expect(result.valid).toBe(false);
    });
  });

  describe('validateFigmaExports - unexpected files warning', () => {
    it('should warn about unexpected JSON files in exports directory', () => {
      const exportsDir = join(testDir, 'exports');
      mkdirSync(exportsDir, { recursive: true });

      writeFileSync(
        join(exportsDir, 'expected.json'),
        JSON.stringify({ Expected: { token: { $type: 'color', $value: '#fff' } } }),
        'utf8'
      );
      writeFileSync(
        join(exportsDir, 'unexpected.json'),
        JSON.stringify({ Unexpected: {} }),
        'utf8'
      );

      const result = validateFigmaExports({
        exportsDir,
        collections: {
          expected: { input: 'expected.json', modeAware: false },
        },
      });

      expect(result.warnings.some((w) => w.message.includes('Unexpected file'))).toBe(true);
    });
  });

  // ==========================================================================
  // validateFigmaCLI
  // ==========================================================================

  describe('validateFigmaCLI', () => {
    let consoleSpy: jest.SpyInstance;
    let warnSpy: jest.SpyInstance;
    let errorSpy: jest.SpyInstance;
    let validateFigmaCLIFn: typeof import('../../../src/tokens/validate-figma.js').validateFigmaCLI;

    beforeAll(async () => {
      const mod = await import('../../../src/tokens/validate-figma.js');
      validateFigmaCLIFn = mod.validateFigmaCLI;
    });

    beforeEach(() => {
      consoleSpy = jest.spyOn(console, 'info').mockImplementation();
      warnSpy = jest.spyOn(console, 'warn').mockImplementation();
      errorSpy = jest.spyOn(console, 'error').mockImplementation();
    });

    afterEach(() => {
      consoleSpy.mockRestore();
      warnSpy.mockRestore();
      errorSpy.mockRestore();
    });

    it('should return true for valid exports', () => {
      const exportsDir = join(testDir, 'cli-exports');
      mkdirSync(exportsDir, { recursive: true });

      writeFileSync(
        join(exportsDir, 'test.json'),
        JSON.stringify({ Test: { token: { $type: 'color', $value: '#fff' } } }),
        'utf8'
      );

      const success = validateFigmaCLIFn(exportsDir, {
        collections: {
          test: { input: 'test.json', modeAware: false },
        },
      });

      expect(success).toBe(true);
      expect(consoleSpy).toHaveBeenCalled();
    });

    it('should return false for missing directory', () => {
      const success = validateFigmaCLIFn(join(testDir, 'nonexistent'), {});
      expect(success).toBe(false);
    });

    it('should report missing files', () => {
      const exportsDir = join(testDir, 'cli-exports-missing');
      mkdirSync(exportsDir, { recursive: true });

      validateFigmaCLIFn(exportsDir, {
        collections: {
          missing: { input: 'missing.json', modeAware: false },
        },
      });

      expect(warnSpy).toHaveBeenCalled();
    });
  });
});
