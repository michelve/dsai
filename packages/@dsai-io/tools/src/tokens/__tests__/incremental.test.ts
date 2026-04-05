/**
 * @fileoverview Tests for incremental build system
 */

import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { CacheService } from '../cache.js';
import {
  analyzeChanges,
  buildDependencyGraph,
  filterTransformForIncremental,
  generateIncrementalReport,
  getAffectedCollections,
  shouldProcessCollection,
  updateCacheAfterBuild,
  type IncrementalAnalysis,
} from '../incremental.js';

import type { TransformOptions } from '../types.js';

/** Number of files to modify in the change ratio test */
const MODIFIED_FILE_COUNT = 3;
/** Total collections count used in report generation tests */
const TOTAL_COLLECTIONS = 5;
/** Elapsed milliseconds for incremental build report test */
const ELAPSED_MS = 500;

// ============================================================================
// Test Setup
// ============================================================================

const TEST_DIR = join(__dirname, '../__test-output__/incremental');
const CACHE_DIR = join(TEST_DIR, '.cache');
const SOURCE_DIR = join(TEST_DIR, 'source');
const OUTPUT_DIR = join(TEST_DIR, 'output');

function setupTestDirs(): void {
  if (existsSync(TEST_DIR)) {
    rmSync(TEST_DIR, { recursive: true, force: true });
  }
  mkdirSync(SOURCE_DIR, { recursive: true });
  mkdirSync(OUTPUT_DIR, { recursive: true });
  mkdirSync(CACHE_DIR, { recursive: true });
}

function createTestFile(name: string, content: object): string {
  const filePath = join(SOURCE_DIR, name);
  writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf-8');
  return filePath;
}

// ============================================================================
// Test Suites
// ============================================================================

describe('Incremental Build System', () => {
  beforeEach(() => {
    setupTestDirs();
  });

  describe('analyzeChanges', () => {
    it('should detect no changes when cache matches', async () => {
      // Create cache service
      const cacheService = new CacheService({ cacheDir: CACHE_DIR });

      // Create test files
      const file1 = createTestFile('colors.json', { color: { blue: '#0000ff' } });

      // Build initial cache
      cacheService.updateCacheEntry(file1, SOURCE_DIR, ['output/colors.json']);

      // Analyze with no changes
      const analysis = await analyzeChanges(SOURCE_DIR, {
        enabled: true,
        cacheService,
        verbose: false,
      });

      expect(analysis.needsFullBuild).toBe(false);
      expect(analysis.changedFiles).toHaveLength(0);
      expect(analysis.unchangedFiles).toHaveLength(1);
    });

    it('should detect changed files', async () => {
      const cacheService = new CacheService({ cacheDir: CACHE_DIR });

      // Create and cache multiple files
      const file1 = createTestFile('colors.json', { color: { blue: '#0000ff' } });
      const file2 = createTestFile('spacing.json', { spacing: '8px' });
      const file3 = createTestFile('fonts.json', { font: 'Arial' });

      cacheService.updateCacheEntry(file1, SOURCE_DIR, []);
      cacheService.updateCacheEntry(file2, SOURCE_DIR, []);
      cacheService.updateCacheEntry(file3, SOURCE_DIR, []);

      // Wait a bit to ensure different mtime
      await new Promise((resolve) => setTimeout(resolve, 10));

      // Modify only one file (33% < 50%)
      writeFileSync(file1, JSON.stringify({ color: { blue: '#ff0000' } }, null, 2), 'utf-8');

      // Analyze changes
      const analysis = await analyzeChanges(SOURCE_DIR, {
        enabled: true,
        cacheService,
        verbose: false,
      });

      expect(analysis.needsFullBuild).toBe(false);
      expect(analysis.changedFiles).toHaveLength(1);
      expect(analysis.changedFiles[0]).toBe(file1);
      expect(analysis.unchangedFiles).toHaveLength(2);
    });

    it('should trigger full build when >50% files changed', async () => {
      const cacheService = new CacheService({ cacheDir: CACHE_DIR });

      // Create 4 files
      const files = [
        createTestFile('colors.json', { color: '#000' }),
        createTestFile('spacing.json', { spacing: '8px' }),
        createTestFile('fonts.json', { font: 'Arial' }),
        createTestFile('shadows.json', { shadow: '0 2px' }),
      ];

      // Cache all files
      for (const file of files) {
        cacheService.updateCacheEntry(file, SOURCE_DIR, []);
      }

      await new Promise((resolve) => setTimeout(resolve, 10));

      // Modify 3 out of 4 files (75%)
      for (let i = 0; i < MODIFIED_FILE_COUNT; i++) {
        writeFileSync(files[i], JSON.stringify({ changed: true }), 'utf-8');
      }

      const analysis = await analyzeChanges(SOURCE_DIR, {
        enabled: true,
        cacheService,
        verbose: false,
      });

      expect(analysis.needsFullBuild).toBe(true);
      expect(analysis.fullBuildReason).toContain('>50%');
    });

    it('should trigger full build when no cache exists', async () => {
      const cacheService = new CacheService({ cacheDir: CACHE_DIR });

      createTestFile('colors.json', { color: '#000' });

      const analysis = await analyzeChanges(SOURCE_DIR, {
        enabled: true,
        cacheService,
        verbose: false,
      });

      expect(analysis.needsFullBuild).toBe(true);
      expect(analysis.fullBuildReason).toBe('No cache available');
    });

    it('should trigger full build when force is true', async () => {
      const cacheService = new CacheService({ cacheDir: CACHE_DIR });

      const analysis = await analyzeChanges(SOURCE_DIR, {
        enabled: true,
        force: true,
        cacheService,
        verbose: false,
      });

      expect(analysis.needsFullBuild).toBe(true);
      expect(analysis.fullBuildReason).toBe('Force rebuild requested');
    });

    it('should trigger full build when not enabled', async () => {
      const analysis = await analyzeChanges(SOURCE_DIR, {
        enabled: false,
        verbose: false,
      });

      expect(analysis.needsFullBuild).toBe(true);
      expect(analysis.fullBuildReason).toBe('Incremental mode disabled');
    });

    it('should trigger full build when no cache service', async () => {
      const analysis = await analyzeChanges(SOURCE_DIR, {
        enabled: true,
        verbose: false,
      });

      expect(analysis.needsFullBuild).toBe(true);
      expect(analysis.fullBuildReason).toBe('No cache service available');
    });
  });

  describe('buildDependencyGraph', () => {
    it('should build graph with independent collections', () => {
      const collections = [
        {
          name: 'colors',
          inputFile: 'colors.json',
          outputFiles: ['output/colors-light.json', 'output/colors-dark.json'],
        },
        {
          name: 'spacing',
          inputFile: 'spacing.json',
          outputFiles: ['output/spacing.json'],
        },
      ];

      const graph = buildDependencyGraph(collections);

      expect(graph.collections.size).toBe(2);
      expect(graph.buildOrder).toEqual(['colors', 'spacing']);

      const colors = graph.collections.get('colors');
      expect(colors).toBeDefined();
      expect(colors?.dependencies).toHaveLength(0);
      expect(colors?.dependents).toHaveLength(0);
    });

    it('should handle empty collections', () => {
      const graph = buildDependencyGraph([]);

      expect(graph.collections.size).toBe(0);
      expect(graph.buildOrder).toHaveLength(0);
    });
  });

  describe('getAffectedCollections', () => {
    it('should identify directly affected collections', () => {
      const collections = [
        { name: 'colors', inputFile: join(SOURCE_DIR, 'colors.json') },
        { name: 'spacing', inputFile: join(SOURCE_DIR, 'spacing.json') },
      ];

      const graph = buildDependencyGraph(collections.map((c) => ({ ...c, outputFiles: [] })));

      const changedFiles = [join(SOURCE_DIR, 'colors.json')];
      const affected = getAffectedCollections(changedFiles, collections, graph);

      expect(affected).toEqual(['colors']);
    });

    it('should handle multiple changed files', () => {
      const collections = [
        { name: 'colors', inputFile: join(SOURCE_DIR, 'colors.json') },
        { name: 'spacing', inputFile: join(SOURCE_DIR, 'spacing.json') },
        { name: 'fonts', inputFile: join(SOURCE_DIR, 'fonts.json') },
      ];

      const graph = buildDependencyGraph(collections.map((c) => ({ ...c, outputFiles: [] })));

      const changedFiles = [join(SOURCE_DIR, 'colors.json'), join(SOURCE_DIR, 'fonts.json')];

      const affected = getAffectedCollections(changedFiles, collections, graph);

      expect(affected).toContain('colors');
      expect(affected).toContain('fonts');
      expect(affected).not.toContain('spacing');
    });

    it('should return empty array when no files match', () => {
      const collections = [{ name: 'colors', inputFile: join(SOURCE_DIR, 'colors.json') }];

      const graph = buildDependencyGraph(collections.map((c) => ({ ...c, outputFiles: [] })));

      const changedFiles = [join(SOURCE_DIR, 'unknown.json')];
      const affected = getAffectedCollections(changedFiles, collections, graph);

      expect(affected).toHaveLength(0);
    });
  });

  describe('filterTransformForIncremental', () => {
    const baseOptions: TransformOptions = {
      sourceDir: SOURCE_DIR,
      collectionsDir: OUTPUT_DIR,
      verbose: false,
    };

    const collections = [
      { name: 'colors', inputFile: join(SOURCE_DIR, 'colors.json') },
      { name: 'spacing', inputFile: join(SOURCE_DIR, 'spacing.json') },
    ];

    it('should return original options for full build', () => {
      const analysis: IncrementalAnalysis = {
        needsFullBuild: true,
        changedFiles: [],
        unchangedFiles: [],
        fullBuildReason: 'Test',
        totalFiles: 0,
      };

      const result = filterTransformForIncremental(baseOptions, analysis, collections);

      expect(result.options).toEqual(baseOptions);
      expect(result.affectedCollections).toEqual([]);
    });

    it('should return empty source dir when no changes', () => {
      const analysis: IncrementalAnalysis = {
        needsFullBuild: false,
        changedFiles: [],
        unchangedFiles: [join(SOURCE_DIR, 'colors.json')],
        totalFiles: 1,
      };

      const result = filterTransformForIncremental(baseOptions, analysis, collections);

      expect(result.options.sourceDir).toBe('');
      expect(result.affectedCollections).toEqual([]);
    });

    it('should return affected collections for incremental build', () => {
      const analysis: IncrementalAnalysis = {
        needsFullBuild: false,
        changedFiles: [join(SOURCE_DIR, 'colors.json')],
        unchangedFiles: [join(SOURCE_DIR, 'spacing.json')],
        totalFiles: 2,
      };

      const result = filterTransformForIncremental(baseOptions, analysis, collections);

      expect(result.options).toEqual(baseOptions);
      expect(result.affectedCollections).toContain('colors');
      expect(result.affectedCollections).not.toContain('spacing');
    });
  });

  describe('shouldProcessCollection', () => {
    it('should process all collections when no filter provided', () => {
      expect(shouldProcessCollection('colors')).toBe(true);
      expect(shouldProcessCollection('spacing')).toBe(true);
    });

    it('should process all collections when empty filter', () => {
      expect(shouldProcessCollection('colors', [])).toBe(true);
      expect(shouldProcessCollection('spacing', [])).toBe(true);
    });

    it('should only process affected collections', () => {
      const affected = ['colors'];

      expect(shouldProcessCollection('colors', affected)).toBe(true);
      expect(shouldProcessCollection('spacing', affected)).toBe(false);
    });
  });

  describe('updateCacheAfterBuild', () => {
    it('should update cache entries after successful build', async () => {
      const cacheService = new CacheService({ cacheDir: CACHE_DIR });

      const sourceFiles = [
        createTestFile('colors.json', { color: '#000' }),
        createTestFile('spacing.json', { spacing: '8px' }),
      ];

      const outputFiles = [
        join(OUTPUT_DIR, 'colors-light.json'),
        join(OUTPUT_DIR, 'colors-dark.json'),
        join(OUTPUT_DIR, 'spacing.json'),
      ];

      // Create output files
      for (const file of outputFiles) {
        writeFileSync(file, '{}', 'utf-8');
      }

      await updateCacheAfterBuild(
        cacheService,
        sourceFiles,
        outputFiles,
        SOURCE_DIR,
        OUTPUT_DIR,
        false
      );

      const cache = cacheService.loadCache();

      expect(Object.keys(cache.files)).toHaveLength(2);
      expect(cache.files['colors.json']).toBeDefined();
      expect(cache.files['spacing.json']).toBeDefined();
    });

    it('should handle empty file lists', async () => {
      const cacheService = new CacheService({ cacheDir: CACHE_DIR });

      await expect(
        updateCacheAfterBuild(cacheService, [], [], SOURCE_DIR, OUTPUT_DIR, false)
      ).resolves.not.toThrow();

      const cache = cacheService.loadCache();
      expect(Object.keys(cache.files)).toHaveLength(0);
    });
  });

  describe('generateIncrementalReport', () => {
    it('should generate report for full build', () => {
      const analysis: IncrementalAnalysis = {
        needsFullBuild: true,
        changedFiles: [],
        unchangedFiles: [],
        fullBuildReason: 'No cache available',
        totalFiles: 0,
      };

      const report = generateIncrementalReport(analysis, Date.now(), TOTAL_COLLECTIONS, TOTAL_COLLECTIONS);

      expect(report).toContain('Incremental Build Report');
      expect(report).toContain('No cache available');
    });

    it('should generate report for no changes', () => {
      const analysis: IncrementalAnalysis = {
        needsFullBuild: false,
        changedFiles: [],
        unchangedFiles: ['/test/file.json'],
        totalFiles: 1,
      };

      const report = generateIncrementalReport(analysis, Date.now() - 100, 0, TOTAL_COLLECTIONS);

      expect(report).toContain('No changes detected');
      expect(report).toContain('Time saved');
    });

    it('should generate report for incremental build', () => {
      const analysis: IncrementalAnalysis = {
        needsFullBuild: false,
        changedFiles: ['/test/colors.json'],
        unchangedFiles: ['/test/spacing.json', '/test/fonts.json'],
        totalFiles: 3,
      };

      const report = generateIncrementalReport(analysis, Date.now() - ELAPSED_MS, 1, TOTAL_COLLECTIONS);

      expect(report).toContain('Files analyzed: 3');
      expect(report).toContain('Files changed: 1');
      expect(report).toContain('Collections processed: 1/5');
      expect(report).toContain('Collections skipped: 4');
    });
  });
});
