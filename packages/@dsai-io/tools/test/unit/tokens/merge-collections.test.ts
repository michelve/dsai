/**
 * Unit tests for token collection merge functionality
 *
 * Tests cover:
 * - mergeCollections function
 * - mergeCollectionsCLI function
 * - Deep merge behavior
 * - Token counting
 * - Reference normalization
 * - Property sorting
 * - Duplicate detection
 * - Conflict handling
 */

import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { mergeCollections, mergeCollectionsCLI } from '../../../src/tokens/merge.js';

// ============================================================================
// Test Setup
// ============================================================================

describe('tokens/merge', () => {
  let testDir: string;

  beforeEach(() => {
    testDir = join(tmpdir(), `merge-test-${Date.now()}-${Math.random().toString(36).slice(2)}`);
    mkdirSync(testDir, { recursive: true });
    jest.spyOn(console, 'info').mockImplementation();
    jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    if (testDir && existsSync(testDir)) {
      rmSync(testDir, { recursive: true, force: true });
    }
    jest.restoreAllMocks();
  });

  // Helper to create test collection files
  const createCollectionFile = (filename: string, collectionName: string, tokens: unknown) => {
    const filePath = join(testDir, filename);
    const data = [{ [collectionName]: tokens }];
    writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return filePath;
  };

  // ==========================================================================
  // mergeCollections - Basic Functionality
  // ==========================================================================

  describe('mergeCollections', () => {
    it('should merge two collection files', () => {
      const file1 = createCollectionFile('colors1.json', 'Colors', {
        modes: {
          Light: {
            primary: { $type: 'color', $value: '#007bff' },
          },
        },
      });

      const file2 = createCollectionFile('colors2.json', 'Colors', {
        modes: {
          Light: {
            secondary: { $type: 'color', $value: '#6c757d' },
          },
        },
      });

      const outputFile = join(testDir, 'merged.json');

      const result = mergeCollections({
        sourceFiles: [file1, file2],
        outputFile,
      });

      expect(result.success).toBe(true);
      expect(result.collectionsCount).toBe(2);
      expect(result.tokensCount).toBe(2);
      expect(existsSync(outputFile)).toBe(true);

      // Verify merged content
      const content = JSON.parse(readFileSync(outputFile, 'utf8')) as unknown[];
      const colors = (content[0] as Record<string, unknown>).Colors as Record<string, unknown>;
      const modes = colors.modes as Record<string, unknown>;
      const light = modes.Light as Record<string, unknown>;

      expect(light.primary).toBeDefined();
      expect(light.secondary).toBeDefined();
    });

    it('should require at least two source files', () => {
      const file1 = createCollectionFile('single.json', 'Colors', {});

      const result = mergeCollections({
        sourceFiles: [file1],
        outputFile: join(testDir, 'output.json'),
      });

      expect(result.success).toBe(false);
      expect(result.errors).toContain('At least two source files are required');
    });

    it('should fail if source file does not exist', () => {
      const file1 = createCollectionFile('exists.json', 'Colors', {});
      const file2 = join(testDir, 'nonexistent.json');

      const result = mergeCollections({
        sourceFiles: [file1, file2],
        outputFile: join(testDir, 'output.json'),
      });

      expect(result.success).toBe(false);
      expect(result.errors?.some((e) => e.includes('not found'))).toBe(true);
    });

    it('should support dry run mode', () => {
      const file1 = createCollectionFile('a.json', 'Colors', {
        primary: { $type: 'color', $value: '#fff' },
      });
      const file2 = createCollectionFile('b.json', 'Colors', {
        secondary: { $type: 'color', $value: '#000' },
      });

      const outputFile = join(testDir, 'output.json');

      const result = mergeCollections({
        sourceFiles: [file1, file2],
        outputFile,
        dryRun: true,
      });

      expect(result.success).toBe(true);
      expect(existsSync(outputFile)).toBe(false); // File should not be created
    });

    it('should support verbose mode', () => {
      const file1 = createCollectionFile('a.json', 'Colors', {
        primary: { $type: 'color', $value: '#fff' },
      });
      const file2 = createCollectionFile('b.json', 'Colors', {
        secondary: { $type: 'color', $value: '#000' },
      });

      const result = mergeCollections({
        sourceFiles: [file1, file2],
        outputFile: join(testDir, 'output.json'),
        verbose: true,
      });

      expect(result.success).toBe(true);
      // Verbose mode should have logged something (we mocked console.info)
    });
  });

  // ==========================================================================
  // Merge Strategy
  // ==========================================================================

  describe('Merge Strategy', () => {
    it('should use "last" strategy by default (later overwrites earlier)', () => {
      const file1 = createCollectionFile('first.json', 'Colors', {
        color: { $type: 'color', $value: '#first' },
      });
      const file2 = createCollectionFile('second.json', 'Colors', {
        color: { $type: 'color', $value: '#second' },
      });

      const outputFile = join(testDir, 'output.json');

      mergeCollections({
        sourceFiles: [file1, file2],
        outputFile,
      });

      const content = JSON.parse(readFileSync(outputFile, 'utf8')) as unknown[];
      const colors = (content[0] as Record<string, unknown>).Colors as Record<string, unknown>;
      const color = colors.color as Record<string, string>;

      expect(color.$value).toBe('#second');
    });

    it('should support "first" strategy (earlier takes precedence)', () => {
      const file1 = createCollectionFile('first.json', 'Colors', {
        color: { $type: 'color', $value: '#first' },
      });
      const file2 = createCollectionFile('second.json', 'Colors', {
        color: { $type: 'color', $value: '#second' },
      });

      const outputFile = join(testDir, 'output.json');

      mergeCollections({
        sourceFiles: [file1, file2],
        outputFile,
        strategy: 'first',
      });

      const content = JSON.parse(readFileSync(outputFile, 'utf8')) as unknown[];
      const colors = (content[0] as Record<string, unknown>).Colors as Record<string, unknown>;
      const color = colors.color as Record<string, string>;

      expect(color.$value).toBe('#first');
    });
  });

  // ==========================================================================
  // Deep Merge Behavior
  // ==========================================================================

  describe('Deep Merge Behavior', () => {
    it('should deep merge nested structures', () => {
      const file1 = createCollectionFile('a.json', 'Colors', {
        brand: {
          primary: { $type: 'color', $value: '#007bff' },
        },
      });
      const file2 = createCollectionFile('b.json', 'Colors', {
        brand: {
          secondary: { $type: 'color', $value: '#6c757d' },
        },
      });

      const outputFile = join(testDir, 'output.json');

      mergeCollections({
        sourceFiles: [file1, file2],
        outputFile,
      });

      const content = JSON.parse(readFileSync(outputFile, 'utf8')) as unknown[];
      const colors = (content[0] as Record<string, unknown>).Colors as Record<string, unknown>;
      const brand = colors.brand as Record<string, unknown>;

      expect(brand.primary).toBeDefined();
      expect(brand.secondary).toBeDefined();
    });

    it('should concatenate arrays', () => {
      const file1 = createCollectionFile('a.json', 'Colors', {
        $extensions: ['ext1'],
      });
      const file2 = createCollectionFile('b.json', 'Colors', {
        $extensions: ['ext2'],
      });

      const outputFile = join(testDir, 'output.json');

      mergeCollections({
        sourceFiles: [file1, file2],
        outputFile,
      });

      const content = JSON.parse(readFileSync(outputFile, 'utf8')) as unknown[];
      const colors = (content[0] as Record<string, unknown>).Colors as Record<string, unknown>;
      const extensions = colors.$extensions as string[];

      expect(extensions).toContain('ext1');
      expect(extensions).toContain('ext2');
    });
  });

  // ==========================================================================
  // Token Counting
  // ==========================================================================

  describe('Token Counting', () => {
    it('should count tokens correctly', () => {
      const file1 = createCollectionFile('a.json', 'Colors', {
        primary: { $type: 'color', $value: '#007bff' },
        secondary: { $type: 'color', $value: '#6c757d' },
      });
      const file2 = createCollectionFile('b.json', 'Colors', {
        success: { $type: 'color', $value: '#28a745' },
      });

      const result = mergeCollections({
        sourceFiles: [file1, file2],
        outputFile: join(testDir, 'output.json'),
      });

      expect(result.tokensCount).toBe(3);
    });

    it('should count nested tokens', () => {
      const file1 = createCollectionFile('a.json', 'Colors', {
        brand: {
          primary: { $type: 'color', $value: '#007bff' },
          nested: {
            deep: { $type: 'color', $value: '#fff' },
          },
        },
      });
      const file2 = createCollectionFile('b.json', 'Colors', {
        status: {
          success: { $type: 'color', $value: '#28a745' },
        },
      });

      const result = mergeCollections({
        sourceFiles: [file1, file2],
        outputFile: join(testDir, 'output.json'),
      });

      expect(result.tokensCount).toBe(3);
    });
  });

  // ==========================================================================
  // Property Sorting
  // ==========================================================================

  describe('Property Sorting', () => {
    it('should sort $ properties first, then alphabetically', () => {
      const file1 = createCollectionFile('a.json', 'Colors', {
        zebra: { $type: 'color', $value: '#000' },
        $description: 'Test description',
        apple: { $type: 'color', $value: '#fff' },
      });
      const file2 = createCollectionFile('b.json', 'Colors', {
        banana: { $type: 'color', $value: '#ff0' },
      });

      const outputFile = join(testDir, 'output.json');

      mergeCollections({
        sourceFiles: [file1, file2],
        outputFile,
      });

      const content = readFileSync(outputFile, 'utf8');
      const parsed = JSON.parse(content) as unknown[];
      const colors = (parsed[0] as Record<string, unknown>).Colors as Record<string, unknown>;
      const keys = Object.keys(colors);

      // $ properties should come first
      const descIndex = keys.indexOf('$description');
      const appleIndex = keys.indexOf('apple');
      const bananaIndex = keys.indexOf('banana');
      const zebraIndex = keys.indexOf('zebra');

      expect(descIndex).toBeLessThan(appleIndex);
      expect(appleIndex).toBeLessThan(bananaIndex);
      expect(bananaIndex).toBeLessThan(zebraIndex);
    });
  });

  // ==========================================================================
  // Invalid Files
  // ==========================================================================

  describe('Invalid Files', () => {
    it('should handle invalid JSON', () => {
      const file1 = join(testDir, 'invalid.json');
      writeFileSync(file1, 'not valid json', 'utf8');

      const file2 = createCollectionFile('valid.json', 'Colors', {
        primary: { $type: 'color', $value: '#fff' },
      });

      const result = mergeCollections({
        sourceFiles: [file1, file2],
        outputFile: join(testDir, 'output.json'),
      });

      expect(result.success).toBe(false);
    });

    it('should handle non-array collection structure', () => {
      const file1 = join(testDir, 'object.json');
      writeFileSync(file1, JSON.stringify({ Colors: {} }), 'utf8');

      const file2 = createCollectionFile('valid.json', 'Colors', {
        primary: { $type: 'color', $value: '#fff' },
      });

      const result = mergeCollections({
        sourceFiles: [file1, file2],
        outputFile: join(testDir, 'output.json'),
      });

      // Should report invalid structure
      expect(result.errors?.some((e) => e.includes('Invalid collection structure'))).toBe(true);
    });
  });

  // ==========================================================================
  // mergeCollectionsCLI
  // ==========================================================================

  describe('mergeCollectionsCLI', () => {
    it('should merge files and return success', () => {
      const file1 = createCollectionFile('a.json', 'Colors', {
        primary: { $type: 'color', $value: '#007bff' },
      });
      const file2 = createCollectionFile('b.json', 'Colors', {
        secondary: { $type: 'color', $value: '#6c757d' },
      });

      const outputFile = join(testDir, 'output.json');

      const success = mergeCollectionsCLI(file1, file2, outputFile);

      expect(success).toBe(true);
      expect(existsSync(outputFile)).toBe(true);
    });

    it('should return false on failure', () => {
      const file1 = join(testDir, 'nonexistent1.json');
      const file2 = join(testDir, 'nonexistent2.json');

      const success = mergeCollectionsCLI(file1, file2, join(testDir, 'output.json'));

      expect(success).toBe(false);
      expect(console.error).toHaveBeenCalled();
    });
  });

  // ==========================================================================
  // Collection Naming
  // ==========================================================================

  describe('Collection Naming', () => {
    it('should prefer "Colors" as unified name when present', () => {
      const file1 = createCollectionFile('scales.json', 'ColorScales', {
        primary: { $type: 'color', $value: '#007bff' },
      });
      const file2 = createCollectionFile('colors.json', 'Colors', {
        secondary: { $type: 'color', $value: '#6c757d' },
      });

      const outputFile = join(testDir, 'output.json');

      mergeCollections({
        sourceFiles: [file1, file2],
        outputFile,
      });

      const content = JSON.parse(readFileSync(outputFile, 'utf8')) as unknown[];
      const firstEntry = content[0] as Record<string, unknown>;

      expect('Colors' in firstEntry).toBe(true);
    });

    it('should use shortest name when Colors not present', () => {
      const file1 = createCollectionFile('a.json', 'DesignTokensA', {
        primary: { $type: 'color', $value: '#007bff' },
      });
      const file2 = createCollectionFile('b.json', 'Tokens', {
        secondary: { $type: 'color', $value: '#6c757d' },
      });

      const outputFile = join(testDir, 'output.json');

      mergeCollections({
        sourceFiles: [file1, file2],
        outputFile,
      });

      const content = JSON.parse(readFileSync(outputFile, 'utf8')) as unknown[];
      const firstEntry = content[0] as Record<string, unknown>;

      // Should use "Tokens" as it's shorter
      expect('Tokens' in firstEntry).toBe(true);
    });
  });

  // ==========================================================================
  // Modes Handling
  // ==========================================================================

  describe('Modes Handling', () => {
    it('should merge tokens within modes', () => {
      const file1 = createCollectionFile('a.json', 'Colors', {
        modes: {
          Light: { bg: { $type: 'color', $value: '#fff' } },
          Dark: { bg: { $type: 'color', $value: '#000' } },
        },
      });
      const file2 = createCollectionFile('b.json', 'Colors', {
        modes: {
          Light: { fg: { $type: 'color', $value: '#000' } },
          Dark: { fg: { $type: 'color', $value: '#fff' } },
        },
      });

      const outputFile = join(testDir, 'output.json');

      mergeCollections({
        sourceFiles: [file1, file2],
        outputFile,
      });

      const content = JSON.parse(readFileSync(outputFile, 'utf8')) as unknown[];
      const colors = (content[0] as Record<string, unknown>).Colors as Record<string, unknown>;
      const modes = colors.modes as Record<string, Record<string, unknown>>;

      expect(modes.Light?.bg).toBeDefined();
      expect(modes.Light?.fg).toBeDefined();
      expect(modes.Dark?.bg).toBeDefined();
      expect(modes.Dark?.fg).toBeDefined();
    });
  });

  // ==========================================================================
  // Reference Normalization
  // ==========================================================================

  describe('Reference Normalization', () => {
    it('should normalize token references to lowercase', () => {
      const file1 = createCollectionFile('a.json', 'Colors', {
        modes: {
          Light: {
            colors: {
              brand: {
                primary: { $type: 'color', $value: '#007bff' },
              },
            },
          },
        },
      });
      const file2 = createCollectionFile('b.json', 'Colors', {
        modes: {
          Light: {
            semantic: {
              bg: { $type: 'color', $value: '{Colors.colors.brand.primary}' },
            },
          },
        },
      });

      const outputFile = join(testDir, 'output.json');

      mergeCollections({
        sourceFiles: [file1, file2],
        outputFile,
      });

      const content = JSON.parse(readFileSync(outputFile, 'utf8')) as unknown[];
      const colors = (content[0] as Record<string, unknown>).Colors as Record<string, unknown>;
      const modes = colors.modes as Record<string, Record<string, unknown>>;
      const semantic = modes.Light?.semantic as Record<string, Record<string, unknown>>;

      // Reference should be normalized to lowercase
      expect(typeof semantic?.bg?.$value).toBe('string');
      const refValue = semantic?.bg?.$value as string;
      expect(refValue.startsWith('{colors.')).toBe(true);
    });

    it('should add $collectionName to aliased tokens', () => {
      const file1 = createCollectionFile('a.json', 'Colors', {
        primary: { $type: 'color', $value: '#007bff' },
      });
      const file2 = createCollectionFile('b.json', 'Colors', {
        alias: { $type: 'color', $value: '{Colors.primary}' },
      });

      const outputFile = join(testDir, 'output.json');

      mergeCollections({
        sourceFiles: [file1, file2],
        outputFile,
      });

      const content = JSON.parse(readFileSync(outputFile, 'utf8')) as unknown[];
      const colors = (content[0] as Record<string, unknown>).Colors as Record<string, unknown>;
      const alias = colors.alias as Record<string, unknown>;

      expect(alias.$collectionName).toBeDefined();
    });
  });

  // ==========================================================================
  // Deep Merge - Conflict Resolution
  // ==========================================================================

  describe('Deep Merge - Conflict Resolution', () => {
    it('should prefer children structure over single token when target has children', () => {
      const file1 = createCollectionFile('a.json', 'Colors', {
        brand: {
          primary: { $type: 'color', $value: '#007bff' },
          secondary: { $type: 'color', $value: '#6c757d' },
        },
      });
      const file2 = createCollectionFile('b.json', 'Colors', {
        brand: { $type: 'color', $value: '#single' },
      });

      const outputFile = join(testDir, 'output.json');

      mergeCollections({
        sourceFiles: [file1, file2],
        outputFile,
        verbose: true,
      });

      const content = JSON.parse(readFileSync(outputFile, 'utf8')) as unknown[];
      const colors = (content[0] as Record<string, unknown>).Colors as Record<string, unknown>;
      const brand = colors.brand as Record<string, unknown>;

      // Should keep children structure from file1, not single token from file2
      expect(brand.primary).toBeDefined();
    });

    it('should replace single token with children structure', () => {
      const file1 = createCollectionFile('a.json', 'Colors', {
        brand: { $type: 'color', $value: '#single' },
      });
      const file2 = createCollectionFile('b.json', 'Colors', {
        brand: {
          primary: { $type: 'color', $value: '#007bff' },
          secondary: { $type: 'color', $value: '#6c757d' },
        },
      });

      const outputFile = join(testDir, 'output.json');

      mergeCollections({
        sourceFiles: [file1, file2],
        outputFile,
        verbose: true,
      });

      const content = JSON.parse(readFileSync(outputFile, 'utf8')) as unknown[];
      const colors = (content[0] as Record<string, unknown>).Colors as Record<string, unknown>;
      const brand = colors.brand as Record<string, unknown>;

      // Should have children from file2
      expect(brand.primary).toBeDefined();
      expect(brand.secondary).toBeDefined();
    });
  });

  // ==========================================================================
  // Duplicate Section Removal
  // ==========================================================================

  describe('Duplicate Section Removal', () => {
    it('should remove sections that are purely reference aliases', () => {
      // Create a section with > 10 references (threshold for duplicate detection)
      const aliasSection: Record<string, unknown> = {};
      for (let i = 0; i < 12; i++) {
        aliasSection[`color${i}`] = { $value: `{colors.brand.color${i}}`, $type: 'color' };
      }

      const file1 = createCollectionFile('a.json', 'Colors', {
        modes: {
          Light: {
            colors: {
              brand: {
                color0: { $value: '#000', $type: 'color' },
                color1: { $value: '#111', $type: 'color' },
              },
              hue: aliasSection, // This is a duplicate section (all references)
            },
          },
        },
      });
      const file2 = createCollectionFile('b.json', 'Colors', {
        modes: {
          Light: {
            colors: {
              extra: { $value: '#fff', $type: 'color' },
            },
          },
        },
      });

      const outputFile = join(testDir, 'output.json');

      mergeCollections({
        sourceFiles: [file1, file2],
        outputFile,
        verbose: true,
      });

      const content = JSON.parse(readFileSync(outputFile, 'utf8')) as unknown[];
      const colors = (content[0] as Record<string, unknown>).Colors as Record<string, unknown>;
      const modes = colors.modes as Record<string, Record<string, unknown>>;
      const light = modes.Light as Record<string, unknown>;
      const lightColors = light.colors as Record<string, unknown>;

      // The "hue" section should have been removed as duplicate
      expect(lightColors.hue).toBeUndefined();
    });
  });

  // ==========================================================================
  // Edge Cases
  // ==========================================================================

  describe('Edge Cases', () => {
    it('should handle empty array collection file', () => {
      const file1 = join(testDir, 'empty-array.json');
      writeFileSync(file1, JSON.stringify([]), 'utf8');

      const file2 = createCollectionFile('b.json', 'Colors', {
        primary: { $type: 'color', $value: '#fff' },
      });

      const result = mergeCollections({
        sourceFiles: [file1, file2],
        outputFile: join(testDir, 'output.json'),
      });

      // Empty array has no first element, so invalid structure
      expect(result.success).toBe(false);
      expect(result.errors?.some((e) => e.includes('Invalid collection structure'))).toBe(true);
    });

    it('should handle undefined source values in deep merge', () => {
      const file1 = createCollectionFile('a.json', 'Colors', {
        primary: { $type: 'color', $value: '#fff' },
      });
      const file2 = createCollectionFile('b.json', 'Colors', {
        primary: { $type: 'color', $value: '#000' },
        extra: null,
      });

      const outputFile = join(testDir, 'output.json');

      const result = mergeCollections({
        sourceFiles: [file1, file2],
        outputFile,
      });

      expect(result.success).toBe(true);
    });
  });
});
