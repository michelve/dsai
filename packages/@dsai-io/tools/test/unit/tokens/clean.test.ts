/**
 * Unit tests for token clean functionality
 *
 * Tests cover:
 * - cleanTokenOutputs function
 * - cleanTokensCLI function
 * - Directory validation and safety checks
 * - Preserve patterns
 * - Dry-run mode
 */

import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
  cleanTokenOutputs,
  cleanTokensCLI,
  DEFAULT_CLEAN_DIRECTORIES,
} from '../../../src/tokens/clean.js';

// ============================================================================
// Test Helpers
// ============================================================================

function createTestDir(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  const testDir = join(tmpdir(), `dsai-clean-test-${timestamp}-${random}`);
  mkdirSync(testDir, { recursive: true });
  return testDir;
}

function cleanupTestDir(dir: string): void {
  if (existsSync(dir)) {
    rmSync(dir, { recursive: true, force: true });
  }
}

function createFileStructure(baseDir: string, structure: Record<string, string>): void {
  for (const [path, content] of Object.entries(structure)) {
    const fullPath = join(baseDir, path);
    const dirPath = join(fullPath, '..');
    mkdirSync(dirPath, { recursive: true });
    writeFileSync(fullPath, content, 'utf8');
  }
}

// ============================================================================
// DEFAULT_CLEAN_DIRECTORIES Tests
// ============================================================================

describe('DEFAULT_CLEAN_DIRECTORIES', () => {
  it('should include dist directory', () => {
    expect(DEFAULT_CLEAN_DIRECTORIES).toContain('dist');
  });

  it('should be an array', () => {
    expect(Array.isArray(DEFAULT_CLEAN_DIRECTORIES)).toBe(true);
  });
});

// ============================================================================
// cleanTokenOutputs Tests
// ============================================================================

describe('cleanTokenOutputs', () => {
  let testDir: string;

  beforeEach(() => {
    testDir = createTestDir();
  });

  afterEach(() => {
    cleanupTestDir(testDir);
  });

  describe('basic functionality', () => {
    it('should clean an existing directory', () => {
      // Create dist directory with files
      createFileStructure(testDir, {
        'dist/css/tokens.css': ':root { --color: red; }',
        'dist/js/tokens.js': 'export const color = "red";',
        'dist/json/tokens.json': '{ "color": "red" }',
      });

      const result = cleanTokenOutputs({
        baseDir: testDir,
        directories: ['dist'],
        verbose: false,
      });

      expect(result.success).toBe(true);
      expect(result.totalFilesRemoved).toBe(3);
      expect(result.cleaned).toHaveLength(1);
      expect(result.cleaned[0]?.existed).toBe(true);
      expect(existsSync(join(testDir, 'dist'))).toBe(false);
    });

    it('should handle non-existent directory gracefully', () => {
      const result = cleanTokenOutputs({
        baseDir: testDir,
        directories: ['nonexistent'],
        verbose: false,
      });

      expect(result.success).toBe(true);
      expect(result.totalFilesRemoved).toBe(0);
      expect(result.cleaned[0]?.existed).toBe(false);
    });

    it('should clean multiple directories', () => {
      createFileStructure(testDir, {
        'dist/css/tokens.css': 'css',
        'build/output.js': 'js',
        'generated/tokens.ts': 'ts',
      });

      const result = cleanTokenOutputs({
        baseDir: testDir,
        directories: ['dist', 'build', 'generated'],
        verbose: false,
      });

      expect(result.success).toBe(true);
      expect(result.cleaned).toHaveLength(3);
      expect(existsSync(join(testDir, 'dist'))).toBe(false);
      expect(existsSync(join(testDir, 'build'))).toBe(false);
      expect(existsSync(join(testDir, 'generated'))).toBe(false);
    });

    it('should use default directories when none specified', () => {
      createFileStructure(testDir, {
        'dist/tokens.css': 'css',
      });

      const result = cleanTokenOutputs({
        baseDir: testDir,
        verbose: false,
      });

      expect(result.success).toBe(true);
      expect(existsSync(join(testDir, 'dist'))).toBe(false);
    });
  });

  describe('dry-run mode', () => {
    it('should not delete files in dry-run mode', () => {
      createFileStructure(testDir, {
        'dist/css/tokens.css': ':root { --color: red; }',
        'dist/js/tokens.js': 'export const color = "red";',
      });

      const result = cleanTokenOutputs({
        baseDir: testDir,
        directories: ['dist'],
        dryRun: true,
        verbose: false,
      });

      expect(result.success).toBe(true);
      expect(result.dryRun).toBe(true);
      expect(result.totalFilesRemoved).toBe(2);
      // Files should still exist
      expect(existsSync(join(testDir, 'dist/css/tokens.css'))).toBe(true);
      expect(existsSync(join(testDir, 'dist/js/tokens.js'))).toBe(true);
    });

    it('should report what would be deleted', () => {
      createFileStructure(testDir, {
        'dist/tokens.css': 'css',
        'dist/subdir/tokens.js': 'js',
        'dist/subdir/nested/tokens.json': 'json',
      });

      const result = cleanTokenOutputs({
        baseDir: testDir,
        directories: ['dist'],
        dryRun: true,
        verbose: false,
      });

      expect(result.cleaned[0]?.filesRemoved).toBe(3);
      expect(result.cleaned[0]?.directoriesRemoved).toBeGreaterThan(0);
    });
  });

  describe('preserve patterns', () => {
    it('should preserve .gitkeep files by default', () => {
      createFileStructure(testDir, {
        'dist/.gitkeep': '',
        'dist/tokens.css': 'css',
      });

      const result = cleanTokenOutputs({
        baseDir: testDir,
        directories: ['dist'],
        verbose: false,
      });

      expect(result.success).toBe(true);
      expect(existsSync(join(testDir, 'dist/.gitkeep'))).toBe(true);
      expect(existsSync(join(testDir, 'dist/tokens.css'))).toBe(false);
    });

    it('should preserve .gitignore files by default', () => {
      createFileStructure(testDir, {
        'dist/.gitignore': '*\n!.gitignore',
        'dist/tokens.css': 'css',
      });

      const result = cleanTokenOutputs({
        baseDir: testDir,
        directories: ['dist'],
        verbose: false,
      });

      expect(result.success).toBe(true);
      expect(existsSync(join(testDir, 'dist/.gitignore'))).toBe(true);
    });

    it('should preserve custom patterns', () => {
      createFileStructure(testDir, {
        'dist/README.md': '# Readme',
        'dist/tokens.css': 'css',
        'dist/tokens.js': 'js',
      });

      const result = cleanTokenOutputs({
        baseDir: testDir,
        directories: ['dist'],
        preserve: ['README.md'],
        verbose: false,
      });

      expect(result.success).toBe(true);
      expect(existsSync(join(testDir, 'dist/README.md'))).toBe(true);
      expect(existsSync(join(testDir, 'dist/tokens.css'))).toBe(false);
    });

    it('should support glob patterns in preserve', () => {
      createFileStructure(testDir, {
        'dist/types.d.ts': 'declare module',
        'dist/tokens.d.ts': 'declare const',
        'dist/tokens.js': 'export const',
      });

      const result = cleanTokenOutputs({
        baseDir: testDir,
        directories: ['dist'],
        preserve: ['*.d.ts'],
        verbose: false,
      });

      expect(result.success).toBe(true);
      expect(existsSync(join(testDir, 'dist/types.d.ts'))).toBe(true);
      expect(existsSync(join(testDir, 'dist/tokens.d.ts'))).toBe(true);
      expect(existsSync(join(testDir, 'dist/tokens.js'))).toBe(false);
    });
  });

  describe('safety validation', () => {
    it('should prevent cleaning protected directories', () => {
      mkdirSync(join(testDir, 'src'), { recursive: true });
      writeFileSync(join(testDir, 'src/index.ts'), 'export {}', 'utf8');

      const result = cleanTokenOutputs({
        baseDir: testDir,
        directories: ['src'],
        verbose: false,
      });

      expect(result.success).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toContain('protected');
      // Source file should still exist
      expect(existsSync(join(testDir, 'src/index.ts'))).toBe(true);
    });

    it('should prevent cleaning node_modules', () => {
      mkdirSync(join(testDir, 'node_modules'), { recursive: true });

      const result = cleanTokenOutputs({
        baseDir: testDir,
        directories: ['node_modules'],
        verbose: false,
      });

      expect(result.success).toBe(false);
      expect(result.errors[0]).toContain('protected');
    });

    it('should prevent cleaning .git directory', () => {
      mkdirSync(join(testDir, '.git'), { recursive: true });

      const result = cleanTokenOutputs({
        baseDir: testDir,
        directories: ['.git'],
        verbose: false,
      });

      expect(result.success).toBe(false);
      expect(result.errors[0]).toContain('protected');
    });

    it('should prevent cleaning base directory itself', () => {
      const result = cleanTokenOutputs({
        baseDir: testDir,
        directories: ['.'],
        verbose: false,
      });

      expect(result.success).toBe(false);
      expect(result.errors[0]).toContain('base directory');
    });

    it('should prevent directory traversal attacks', () => {
      const result = cleanTokenOutputs({
        baseDir: testDir,
        directories: ['../other-dir'],
        verbose: false,
      });

      expect(result.success).toBe(false);
      expect(result.errors[0]).toContain('outside');
    });
  });

  describe('result structure', () => {
    it('should return complete result object', () => {
      createFileStructure(testDir, {
        'dist/tokens.css': 'css',
      });

      const result = cleanTokenOutputs({
        baseDir: testDir,
        directories: ['dist'],
        verbose: false,
      });

      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('cleaned');
      expect(result).toHaveProperty('totalFilesRemoved');
      expect(result).toHaveProperty('totalDirectoriesRemoved');
      expect(result).toHaveProperty('errors');
      expect(result).toHaveProperty('warnings');
      expect(result).toHaveProperty('dryRun');
      expect(result).toHaveProperty('duration');
    });

    it('should track duration', () => {
      const result = cleanTokenOutputs({
        baseDir: testDir,
        directories: ['dist'],
        verbose: false,
      });

      expect(typeof result.duration).toBe('number');
      expect(result.duration).toBeGreaterThanOrEqual(0);
    });

    it('should provide cleaned directory details', () => {
      createFileStructure(testDir, {
        'dist/css/tokens.css': 'css',
        'dist/js/tokens.js': 'js',
      });

      const result = cleanTokenOutputs({
        baseDir: testDir,
        directories: ['dist'],
        verbose: false,
      });

      expect(result.cleaned).toHaveLength(1);
      expect(result.cleaned[0]).toHaveProperty('path');
      expect(result.cleaned[0]).toHaveProperty('filesRemoved');
      expect(result.cleaned[0]).toHaveProperty('directoriesRemoved');
      expect(result.cleaned[0]).toHaveProperty('existed');
    });
  });

  describe('edge cases', () => {
    it('should handle empty directories', () => {
      mkdirSync(join(testDir, 'dist'), { recursive: true });

      const result = cleanTokenOutputs({
        baseDir: testDir,
        directories: ['dist'],
        verbose: false,
      });

      expect(result.success).toBe(true);
      expect(result.totalFilesRemoved).toBe(0);
      expect(existsSync(join(testDir, 'dist'))).toBe(false);
    });

    it('should handle deeply nested structures', () => {
      createFileStructure(testDir, {
        'dist/a/b/c/d/e/f/file.txt': 'deep',
      });

      const result = cleanTokenOutputs({
        baseDir: testDir,
        directories: ['dist'],
        verbose: false,
      });

      expect(result.success).toBe(true);
      expect(result.totalFilesRemoved).toBe(1);
      expect(result.totalDirectoriesRemoved).toBeGreaterThanOrEqual(6);
    });

    it('should handle mixed success/failure', () => {
      createFileStructure(testDir, {
        'dist/tokens.css': 'css',
      });
      mkdirSync(join(testDir, 'src'), { recursive: true });

      const result = cleanTokenOutputs({
        baseDir: testDir,
        directories: ['dist', 'src'], // dist will succeed, src is protected
        verbose: false,
      });

      expect(result.success).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.cleaned.find((c) => c.path.endsWith('dist'))).toBeDefined();
    });
  });
});

// ============================================================================
// cleanTokensCLI Tests
// ============================================================================

describe('cleanTokensCLI', () => {
  let testDir: string;
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    testDir = createTestDir();
    consoleSpy = jest.spyOn(console, 'info').mockImplementation();
  });

  afterEach(() => {
    cleanupTestDir(testDir);
    consoleSpy.mockRestore();
  });

  it('should return true on successful clean', () => {
    createFileStructure(testDir, {
      'dist/tokens.css': 'css',
    });

    const result = cleanTokensCLI(testDir, {
      directories: ['dist'],
      verbose: false,
    });

    expect(result).toBe(true);
  });

  it('should return false on failed clean', () => {
    mkdirSync(join(testDir, 'src'), { recursive: true });

    const result = cleanTokensCLI(testDir, {
      directories: ['src'],
      verbose: false,
    });

    expect(result).toBe(false);
  });

  it('should enable verbose logging by default', () => {
    createFileStructure(testDir, {
      'dist/tokens.css': 'css',
    });

    cleanTokensCLI(testDir, {
      directories: ['dist'],
    });

    expect(consoleSpy).toHaveBeenCalled();
  });
});

// ============================================================================
// Additional Coverage Tests
// ============================================================================

describe('cleanTokenOutputs - verbose output', () => {
  let testDir: string;
  let consoleSpy: jest.SpyInstance;
  let errorSpy: jest.SpyInstance;

  beforeEach(() => {
    testDir = createTestDir();
    consoleSpy = jest.spyOn(console, 'info').mockImplementation();
    errorSpy = jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    cleanupTestDir(testDir);
    consoleSpy.mockRestore();
    errorSpy.mockRestore();
  });

  it('should log verbose output when cleaning existing directory', () => {
    createFileStructure(testDir, {
      'dist/tokens.css': 'css',
    });

    cleanTokenOutputs({
      baseDir: testDir,
      directories: ['dist'],
      verbose: true,
    });

    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should log verbose output for non-existent directory', () => {
    cleanTokenOutputs({
      baseDir: testDir,
      directories: ['nonexistent'],
      verbose: true,
    });

    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should log verbose dry-run output', () => {
    createFileStructure(testDir, {
      'dist/tokens.css': 'css',
      'dist/subdir/more.css': 'more',
    });

    cleanTokenOutputs({
      baseDir: testDir,
      directories: ['dist'],
      verbose: true,
      dryRun: true,
    });

    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should log verbose error output for protected directories', () => {
    mkdirSync(join(testDir, 'src'), { recursive: true });

    cleanTokenOutputs({
      baseDir: testDir,
      directories: ['src'],
      verbose: true,
    });

    expect(errorSpy).toHaveBeenCalled();
  });

  it('should log preserved file info in verbose mode', () => {
    createFileStructure(testDir, {
      'dist/.gitkeep': '',
      'dist/tokens.css': 'css',
    });

    cleanTokenOutputs({
      baseDir: testDir,
      directories: ['dist'],
      verbose: true,
      preserve: [],
    });

    // Should log about preserving .gitkeep
    const calls = consoleSpy.mock.calls.flat().join(' ');
    expect(calls).toContain('Preserving');
  });
});

describe('cleanTokenOutputs - glob pattern matching', () => {
  let testDir: string;

  beforeEach(() => {
    testDir = createTestDir();
  });

  afterEach(() => {
    cleanupTestDir(testDir);
  });

  it('should match prefix patterns (e.g., "file*")', () => {
    createFileStructure(testDir, {
      'dist/file-a.css': 'a',
      'dist/file-b.css': 'b',
      'dist/other.css': 'other',
    });

    const result = cleanTokenOutputs({
      baseDir: testDir,
      directories: ['dist'],
      preserve: ['file*'],
      verbose: false,
    });

    expect(result.success).toBe(true);
    expect(existsSync(join(testDir, 'dist/file-a.css'))).toBe(true);
    expect(existsSync(join(testDir, 'dist/file-b.css'))).toBe(true);
    expect(existsSync(join(testDir, 'dist/other.css'))).toBe(false);
  });

  it('should match complex glob with ? wildcard', () => {
    createFileStructure(testDir, {
      'dist/file1.css': 'a',
      'dist/file2.css': 'b',
      'dist/file10.css': 'c',
    });

    const result = cleanTokenOutputs({
      baseDir: testDir,
      directories: ['dist'],
      preserve: ['file?.css'],
      verbose: false,
    });

    expect(result.success).toBe(true);
    // file1 and file2 match file?.css
    expect(existsSync(join(testDir, 'dist/file1.css'))).toBe(true);
    expect(existsSync(join(testDir, 'dist/file2.css'))).toBe(true);
    // file10 does NOT match file?.css (? matches single char)
    expect(existsSync(join(testDir, 'dist/file10.css'))).toBe(false);
  });

  it('should match exact pattern without wildcards', () => {
    createFileStructure(testDir, {
      'dist/keep-me.txt': 'keep',
      'dist/remove-me.txt': 'remove',
    });

    const result = cleanTokenOutputs({
      baseDir: testDir,
      directories: ['dist'],
      preserve: ['keep-me.txt'],
      verbose: false,
    });

    expect(result.success).toBe(true);
    expect(existsSync(join(testDir, 'dist/keep-me.txt'))).toBe(true);
    expect(existsSync(join(testDir, 'dist/remove-me.txt'))).toBe(false);
  });
});

describe('cleanTokenOutputs - protected directories', () => {
  let testDir: string;

  beforeEach(() => {
    testDir = createTestDir();
  });

  afterEach(() => {
    cleanupTestDir(testDir);
  });

  it('should prevent cleaning test directory', () => {
    mkdirSync(join(testDir, 'test'), { recursive: true });

    const result = cleanTokenOutputs({
      baseDir: testDir,
      directories: ['test'],
      verbose: false,
    });

    expect(result.success).toBe(false);
    expect(result.errors[0]).toContain('protected');
  });

  it('should prevent cleaning tests directory', () => {
    mkdirSync(join(testDir, 'tests'), { recursive: true });

    const result = cleanTokenOutputs({
      baseDir: testDir,
      directories: ['tests'],
      verbose: false,
    });

    expect(result.success).toBe(false);
    expect(result.errors[0]).toContain('protected');
  });

  it('should prevent cleaning __tests__ directory', () => {
    mkdirSync(join(testDir, '__tests__'), { recursive: true });

    const result = cleanTokenOutputs({
      baseDir: testDir,
      directories: ['__tests__'],
      verbose: false,
    });

    expect(result.success).toBe(false);
    expect(result.errors[0]).toContain('protected');
  });

  it('should prevent cleaning docs directory', () => {
    mkdirSync(join(testDir, 'docs'), { recursive: true });

    const result = cleanTokenOutputs({
      baseDir: testDir,
      directories: ['docs'],
      verbose: false,
    });

    expect(result.success).toBe(false);
    expect(result.errors[0]).toContain('protected');
  });

  it('should prevent cleaning config directory', () => {
    mkdirSync(join(testDir, 'config'), { recursive: true });

    const result = cleanTokenOutputs({
      baseDir: testDir,
      directories: ['config'],
      verbose: false,
    });

    expect(result.success).toBe(false);
    expect(result.errors[0]).toContain('protected');
  });

  it('should prevent cleaning .github directory', () => {
    mkdirSync(join(testDir, '.github'), { recursive: true });

    const result = cleanTokenOutputs({
      baseDir: testDir,
      directories: ['.github'],
      verbose: false,
    });

    expect(result.success).toBe(false);
    expect(result.errors[0]).toContain('protected');
  });
});
