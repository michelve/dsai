/**
 * Unit tests for output path resolver
 *
 * Tests cover:
 * - Placeholder replacement in templates
 * - Output path resolution per format
 * - Resolving all output paths
 * - Validating output paths for conflicts
 * - Ensuring output directories exist
 * - Creating output configuration
 */

import { existsSync, mkdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
  createOutputConfig,
  DEFAULT_FILE_NAMES,
  ensureOutputDirs,
  replacePlaceholders,
  resolveAllOutputPaths,
  resolveOutputPath,
  validateOutputPaths,
} from '../../../../src/tokens/output/resolver.js';

import type { OutputFormat } from '../../../../src/config/types.js';
import type { OutputConfig } from '../../../../src/tokens/merge/types.js';

// ============================================================================
// Test Setup
// ============================================================================

describe('output/resolver', () => {
  let testDir: string;

  beforeEach(() => {
    testDir = join(tmpdir(), `resolver-test-${Date.now()}-${Math.random().toString(36).slice(2)}`);
    mkdirSync(testDir, { recursive: true });
  });

  afterEach(() => {
    if (testDir && existsSync(testDir)) {
      rmSync(testDir, { recursive: true, force: true });
    }
  });

  // ==========================================================================
  // DEFAULT_FILE_NAMES
  // ==========================================================================

  describe('DEFAULT_FILE_NAMES', () => {
    it('should have default file names for all formats', () => {
      expect(DEFAULT_FILE_NAMES.css).toBe('tokens.css');
      expect(DEFAULT_FILE_NAMES.scss).toBe('_tokens.scss');
      expect(DEFAULT_FILE_NAMES.js).toBe('tokens.js');
      expect(DEFAULT_FILE_NAMES.ts).toBe('tokens.ts');
      expect(DEFAULT_FILE_NAMES.json).toBe('tokens.json');
      expect(DEFAULT_FILE_NAMES.android).toBe('tokens.xml');
      expect(DEFAULT_FILE_NAMES.ios).toBe('Tokens.swift');
    });
  });

  // ==========================================================================
  // replacePlaceholders
  // ==========================================================================

  describe('replacePlaceholders', () => {
    it('should replace theme placeholder', () => {
      const result = replacePlaceholders('tokens-{theme}.css', { theme: 'light' });
      expect(result).toBe('tokens-light.css');
    });

    it('should replace name placeholder', () => {
      const result = replacePlaceholders('{name}.css', { name: 'design-tokens' });
      expect(result).toBe('design-tokens.css');
    });

    it('should replace format placeholder', () => {
      const result = replacePlaceholders('tokens.{format}', { format: 'css' });
      expect(result).toBe('tokens.css');
    });

    it('should replace date placeholder', () => {
      const result = replacePlaceholders('tokens-{date}.css', { date: '2024-01-15' });
      expect(result).toBe('tokens-2024-01-15.css');
    });

    it('should replace timestamp placeholder', () => {
      const result = replacePlaceholders('tokens-{timestamp}.css', {
        timestamp: '2024-01-15T10:30:00.000Z',
      });
      expect(result).toBe('tokens-2024-01-15T10:30:00.000Z.css');
    });

    it('should replace multiple placeholders', () => {
      const result = replacePlaceholders('{name}-{theme}.{format}', {
        name: 'design',
        theme: 'dark',
        format: 'css',
      });
      expect(result).toBe('design-dark.css');
    });

    it('should use defaults for missing values', () => {
      const result = replacePlaceholders('{theme}-{name}.css', {});
      expect(result).toBe('default-tokens.css');
    });

    it('should generate date automatically when not provided', () => {
      const result = replacePlaceholders('{date}', {});
      // Should be in YYYY-MM-DD format
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('should generate timestamp automatically when not provided', () => {
      const result = replacePlaceholders('{timestamp}', {});
      // Should be in ISO format
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });
  });

  // ==========================================================================
  // resolveOutputPath
  // ==========================================================================

  describe('resolveOutputPath', () => {
    const baseConfig: OutputConfig = {
      baseDir: 'dist',
      formatDirs: {},
      fileNames: {},
      createDirs: true,
    };

    it('should use default file name when not specified', () => {
      const result = resolveOutputPath('css', baseConfig);
      expect(result).toBe(join('dist', 'tokens.css'));
    });

    it('should use custom file name from config', () => {
      const config: OutputConfig = {
        ...baseConfig,
        fileNames: { css: 'custom.css' },
      };
      const result = resolveOutputPath('css', config);
      expect(result).toBe(join('dist', 'custom.css'));
    });

    it('should use format-specific directory', () => {
      const config: OutputConfig = {
        ...baseConfig,
        formatDirs: { css: 'dist/css' },
      };
      const result = resolveOutputPath('css', config);
      expect(result).toBe(join('dist/css', 'tokens.css'));
    });

    it('should replace placeholders in file name', () => {
      const config: OutputConfig = {
        ...baseConfig,
        fileNames: { css: 'tokens-{theme}.css' },
      };
      const result = resolveOutputPath('css', config, { theme: 'light' });
      expect(result).toBe(join('dist', 'tokens-light.css'));
    });

    it('should handle all output formats', () => {
      const formats: OutputFormat[] = ['css', 'scss', 'js', 'ts', 'json', 'android', 'ios'];
      for (const format of formats) {
        const result = resolveOutputPath(format, baseConfig);
        expect(result).toBe(join('dist', DEFAULT_FILE_NAMES[format]));
      }
    });
  });

  // ==========================================================================
  // resolveAllOutputPaths
  // ==========================================================================

  describe('resolveAllOutputPaths', () => {
    const baseConfig: OutputConfig = {
      baseDir: 'dist',
      formatDirs: {},
      fileNames: {},
      createDirs: true,
    };

    it('should resolve paths for multiple formats', () => {
      const formats: OutputFormat[] = ['css', 'scss', 'js'];
      const result = resolveAllOutputPaths(formats, baseConfig);

      expect(result.css).toBe(join('dist', 'tokens.css'));
      expect(result.scss).toBe(join('dist', '_tokens.scss'));
      expect(result.js).toBe(join('dist', 'tokens.js'));
    });

    it('should apply placeholder values to all paths', () => {
      const config: OutputConfig = {
        ...baseConfig,
        fileNames: {
          css: 'tokens-{theme}.css',
          scss: '_tokens-{theme}.scss',
        },
      };
      const formats: OutputFormat[] = ['css', 'scss'];
      const result = resolveAllOutputPaths(formats, config, { theme: 'dark' });

      expect(result.css).toBe(join('dist', 'tokens-dark.css'));
      expect(result.scss).toBe(join('dist', '_tokens-dark.scss'));
    });

    it('should handle empty formats array', () => {
      const result = resolveAllOutputPaths([], baseConfig);
      expect(Object.keys(result)).toHaveLength(0);
    });

    it('should use format-specific directories when configured', () => {
      const config: OutputConfig = {
        ...baseConfig,
        formatDirs: {
          css: 'dist/css',
          js: 'dist/js',
        },
      };
      const formats: OutputFormat[] = ['css', 'js', 'json'];
      const result = resolveAllOutputPaths(formats, config);

      expect(result.css).toBe(join('dist/css', 'tokens.css'));
      expect(result.js).toBe(join('dist/js', 'tokens.js'));
      expect(result.json).toBe(join('dist', 'tokens.json'));
    });
  });

  // ==========================================================================
  // validateOutputPaths
  // ==========================================================================

  describe('validateOutputPaths', () => {
    it('should return valid when no conflicts', () => {
      const paths = {
        css: 'dist/css/tokens.css',
        scss: 'dist/scss/_tokens.scss',
        js: 'dist/js/tokens.js',
      };
      const result = validateOutputPaths(paths);

      expect(result.valid).toBe(true);
      expect(result.conflicts).toHaveLength(0);
    });

    it('should detect path conflicts', () => {
      const paths = {
        css: 'dist/tokens.css',
        scss: 'dist/tokens.css', // Same path as css
      };
      const result = validateOutputPaths(paths);

      expect(result.valid).toBe(false);
      expect(result.conflicts).toHaveLength(1);
      expect(result.conflicts[0]).toContain('css');
      expect(result.conflicts[0]).toContain('scss');
    });

    it('should normalize paths for comparison', () => {
      const paths = {
        css: 'dist/./css/../tokens.css',
        scss: 'dist/tokens.css', // Same after normalization
      };
      const result = validateOutputPaths(paths);

      expect(result.valid).toBe(false);
      expect(result.conflicts).toHaveLength(1);
    });

    it('should handle multiple conflicts', () => {
      const paths = {
        css: 'dist/tokens.out',
        scss: 'dist/tokens.out', // Conflicts with css
        js: 'dist/other.out',
        ts: 'dist/other.out', // Conflicts with js
      };
      const result = validateOutputPaths(paths);

      expect(result.valid).toBe(false);
      expect(result.conflicts).toHaveLength(2);
    });

    it('should return valid for empty paths', () => {
      const result = validateOutputPaths({});
      expect(result.valid).toBe(true);
      expect(result.conflicts).toHaveLength(0);
    });
  });

  // ==========================================================================
  // ensureOutputDirs
  // ==========================================================================

  describe('ensureOutputDirs', () => {
    it('should create directories for output paths', async () => {
      const cssDir = join(testDir, 'dist', 'css');
      const jsDir = join(testDir, 'dist', 'js');

      const paths = {
        css: join(cssDir, 'tokens.css'),
        js: join(jsDir, 'tokens.js'),
      };

      const created = await ensureOutputDirs(paths);

      expect(existsSync(cssDir)).toBe(true);
      expect(existsSync(jsDir)).toBe(true);
      expect(created).toContain(cssDir);
      expect(created).toContain(jsDir);
    });

    it('should handle already existing directories', async () => {
      const existingDir = join(testDir, 'existing');
      mkdirSync(existingDir, { recursive: true });

      const paths = {
        css: join(existingDir, 'tokens.css'),
      };

      // Should not throw
      const created = await ensureOutputDirs(paths);
      expect(existsSync(existingDir)).toBe(true);
      expect(created).toContain(existingDir);
    });

    it('should deduplicate directories', async () => {
      const sameDir = join(testDir, 'dist');

      const paths = {
        css: join(sameDir, 'tokens.css'),
        scss: join(sameDir, '_tokens.scss'),
      };

      const created = await ensureOutputDirs(paths);
      expect(existsSync(sameDir)).toBe(true);
      // Should only create the directory once
      expect(created).toHaveLength(1);
    });

    it('should create nested directories', async () => {
      const nestedDir = join(testDir, 'dist', 'deep', 'nested', 'dir');

      const paths = {
        css: join(nestedDir, 'tokens.css'),
      };

      await ensureOutputDirs(paths);
      expect(existsSync(nestedDir)).toBe(true);
    });
  });

  // ==========================================================================
  // createOutputConfig
  // ==========================================================================

  describe('createOutputConfig', () => {
    it('should use defaults when no options provided', () => {
      const config = createOutputConfig({});

      expect(config.baseDir).toBe('dist');
      expect(config.formatDirs).toEqual({});
      expect(config.fileNames).toEqual({});
      expect(config.createDirs).toBe(true);
    });

    it('should use custom output directory', () => {
      const config = createOutputConfig({
        outputDir: 'build/tokens',
      });

      expect(config.baseDir).toBe('build/tokens');
    });

    it('should use custom output directories per format', () => {
      const outputDirs = {
        css: 'dist/css',
        js: 'dist/js',
      };
      const config = createOutputConfig({
        outputDirs,
      });

      expect(config.formatDirs).toEqual(outputDirs);
    });

    it('should use custom file names per format', () => {
      const fileNames = {
        css: 'design-tokens.css',
        js: 'design-tokens.js',
      };
      const config = createOutputConfig({
        outputFileNames: fileNames,
      });

      expect(config.fileNames).toEqual(fileNames);
    });

    it('should combine all options', () => {
      const config = createOutputConfig({
        outputDir: 'build',
        outputDirs: { css: 'build/styles' },
        outputFileNames: { css: 'app-tokens.css' },
      });

      expect(config.baseDir).toBe('build');
      expect(config.formatDirs).toEqual({ css: 'build/styles' });
      expect(config.fileNames).toEqual({ css: 'app-tokens.css' });
    });
  });
});
