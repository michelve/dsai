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
});
