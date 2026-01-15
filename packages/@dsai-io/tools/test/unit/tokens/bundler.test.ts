/**
 * @file Unit tests for bundler module
 * @description Tests for CSS/SCSS bundle creation
 */
import * as fs from 'node:fs';
import { tmpdir } from 'node:os';
import * as path from 'node:path';

import {
  createBundle,
  createBundles,
  createBundleFromFiles,
} from '../../../src/tokens/merge/bundler.js';

import type {
  StyleMergeResult,
  StyleScannedFile,
  BundleConfig,
} from '../../../src/tokens/merge/types.js';

describe('bundler', () => {
  const testDir = path.join(tmpdir(), `bundler-test-${Date.now()}`);

  beforeAll(() => {
    fs.mkdirSync(testDir, { recursive: true });
  });

  afterAll(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  describe('createBundle', () => {
    it('should create a basic CSS bundle', async () => {
      const outputDir = path.join(testDir, 'basic-css');
      const mergeResult: StyleMergeResult = {
        content: '.test { color: red; }',
        sources: ['test.css'],
        warnings: [],
      };
      const config: BundleConfig = {
        name: 'test-bundle',
        outputDir,
        includeSourceComments: true,
        sourcemaps: false,
        minify: false,
      };

      const result = await createBundle(mergeResult, config);

      expect(result.outputPath).toContain('test-bundle.css');
      expect(result.content).toBe('.test { color: red; }');
      expect(result.files).toEqual(['test.css']);
      expect(result.size).toBeGreaterThan(0);
      expect(fs.existsSync(result.outputPath)).toBe(true);
    });

    it('should create an SCSS bundle with SCSS features', async () => {
      const outputDir = path.join(testDir, 'scss-features');
      const mergeResult: StyleMergeResult = {
        content: '$primary: blue;\n@mixin button { color: $primary; }',
        sources: ['vars.scss'],
        warnings: [],
      };
      const config: BundleConfig = {
        name: '_tokens',
        outputDir,
        includeSourceComments: false,
        sourcemaps: false,
        minify: false,
      };

      const result = await createBundle(mergeResult, config);

      expect(result.outputPath).toContain('_tokens.scss');
      expect(fs.existsSync(result.outputPath)).toBe(true);
    });

    it('should remove source comments when includeSourceComments is false', async () => {
      const outputDir = path.join(testDir, 'no-source-comments');
      const mergeResult: StyleMergeResult = {
        content: '/* ========== Source: file.css ========== */\n.test { color: blue; }',
        sources: ['file.css'],
        warnings: [],
      };
      const config: BundleConfig = {
        name: 'no-comments',
        outputDir,
        includeSourceComments: false,
        sourcemaps: false,
        minify: false,
      };

      const result = await createBundle(mergeResult, config);

      expect(result.content).not.toContain('Source: file.css');
      expect(result.content).toBe('.test { color: blue; }');
    });

    it('should minify content when minify is true', async () => {
      const outputDir = path.join(testDir, 'minified');
      const mergeResult: StyleMergeResult = {
        content: '.test {\n  color: red;\n  background: blue;\n}',
        sources: ['test.css'],
        warnings: [],
      };
      const config: BundleConfig = {
        name: 'minified',
        outputDir,
        includeSourceComments: false,
        sourcemaps: false,
        minify: true,
      };

      const result = await createBundle(mergeResult, config);

      expect(result.content).not.toContain('\n');
      expect(result.minifiedSize).toBeDefined();
      expect(result.minifiedSize).toBeLessThan(Buffer.byteLength(mergeResult.content, 'utf-8'));
    });

    it('should generate sourcemaps when sourcemaps is true', async () => {
      const outputDir = path.join(testDir, 'with-sourcemaps');
      const mergeResult: StyleMergeResult = {
        content: '.test { color: green; }',
        sources: ['a.css', 'b.css'],
        warnings: [],
      };
      const config: BundleConfig = {
        name: 'with-maps',
        outputDir,
        includeSourceComments: true,
        sourcemaps: true,
        minify: false,
      };

      const result = await createBundle(mergeResult, config);

      expect(result.sourcemap).toBeDefined();
      expect(result.content).toContain('sourceMappingURL');
      expect(fs.existsSync(`${result.outputPath}.map`)).toBe(true);

      if (result.sourcemap) {
        const mapContent = JSON.parse(result.sourcemap);
        expect(mapContent.version).toBe(3);
        expect(mapContent.sources).toEqual(['a.css', 'b.css']);
      }
    });

    it('should handle empty content', async () => {
      const outputDir = path.join(testDir, 'empty-content');
      const mergeResult: StyleMergeResult = {
        content: '',
        sources: [],
        warnings: [],
      };
      const config: BundleConfig = {
        name: 'empty',
        outputDir,
        includeSourceComments: false,
        sourcemaps: false,
        minify: false,
      };

      const result = await createBundle(mergeResult, config);

      expect(result.content).toBe('');
      expect(result.size).toBe(0);
    });
  });

  describe('createBundles', () => {
    const cssFilesDir = path.join(testDir, 'css-files');
    const scssFilesDir = path.join(testDir, 'scss-files');

    beforeAll(() => {
      fs.mkdirSync(cssFilesDir, { recursive: true });
      fs.mkdirSync(scssFilesDir, { recursive: true });
      fs.writeFileSync(path.join(cssFilesDir, 'user.css'), '.user { display: block; }');
      fs.writeFileSync(path.join(scssFilesDir, '_user.scss'), '$user-var: 1px;');
    });

    it('should create both CSS and SCSS bundles', async () => {
      const outputDir = path.join(testDir, 'both-bundles');
      const cssFiles: StyleScannedFile[] = [
        {
          relativePath: 'user.css',
          absolutePath: path.join(cssFilesDir, 'user.css'),
          name: 'user',
          extension: 'css',
          size: 24,
          mtime: new Date(),
          depth: 0,
        },
      ];
      const scssFiles: StyleScannedFile[] = [
        {
          relativePath: '_user.scss',
          absolutePath: path.join(scssFilesDir, '_user.scss'),
          name: '_user',
          extension: 'scss',
          size: 16,
          mtime: new Date(),
          depth: 0,
        },
      ];

      const results = await createBundles(
        ':root { --token: 1px; }',
        '$token: 1px;',
        cssFiles,
        scssFiles,
        {
          baseName: 'combined',
          outputDir,
          includeSourceComments: false,
          sourcemaps: false,
          minify: false,
        }
      );

      expect(results.css).toBeDefined();
      expect(results.scss).toBeDefined();
      if (results.css) {
        expect(results.css.outputPath).toContain('combined.css');
      }
      if (results.scss) {
        expect(results.scss.outputPath).toContain('_combined.scss');
      }
    });

    it('should handle only CSS content', async () => {
      const outputDir = path.join(testDir, 'css-only-bundles');

      const results = await createBundles('.tokens { color: red; }', '', [], [], {
        baseName: 'css-only',
        outputDir,
        includeSourceComments: false,
        sourcemaps: false,
        minify: false,
      });

      expect(results.css).toBeDefined();
      expect(results.scss).toBeUndefined();
    });

    it('should handle only SCSS content', async () => {
      const outputDir = path.join(testDir, 'scss-only-bundles');

      const results = await createBundles('', '$var: 1px;', [], [], {
        baseName: 'scss-only',
        outputDir,
        includeSourceComments: false,
        sourcemaps: false,
        minify: false,
      });

      expect(results.css).toBeUndefined();
      expect(results.scss).toBeDefined();
    });

    it('should use default base name', async () => {
      const outputDir = path.join(testDir, 'default-name');

      const results = await createBundles('.test { }', '', [], [], {
        outputDir,
        includeSourceComments: false,
        sourcemaps: false,
        minify: false,
      });

      if (results.css) {
        expect(results.css.outputPath).toContain('tokens-bundle.css');
      }
    });
  });

  describe('createBundleFromFiles', () => {
    const filesDir = path.join(testDir, 'bundle-from-files');

    beforeAll(() => {
      fs.mkdirSync(filesDir, { recursive: true });
      fs.writeFileSync(path.join(filesDir, 'base.css'), '.base { display: flex; }');
      fs.writeFileSync(path.join(filesDir, 'theme.css'), '.theme { color: blue; }');
    });

    it('should create bundle from scanned files', async () => {
      const outputDir = path.join(testDir, 'from-files-output');
      const files: StyleScannedFile[] = [
        {
          relativePath: 'base.css',
          absolutePath: path.join(filesDir, 'base.css'),
          name: 'base',
          extension: 'css',
          size: 26,
          mtime: new Date(),
          depth: 0,
        },
        {
          relativePath: 'theme.css',
          absolutePath: path.join(filesDir, 'theme.css'),
          name: 'theme',
          extension: 'css',
          size: 26,
          mtime: new Date(),
          depth: 0,
        },
      ];

      const result = await createBundleFromFiles(files, 'css', {
        name: 'from-files',
        outputDir,
        includeSourceComments: true,
        sourcemaps: false,
        minify: false,
      });

      expect(result.content).toContain('.base');
      expect(result.content).toContain('.theme');
      expect(result.files.length).toBeGreaterThan(0);
    });

    it('should handle empty file list', async () => {
      const outputDir = path.join(testDir, 'empty-files-output');

      const result = await createBundleFromFiles([], 'css', {
        name: 'empty-files',
        outputDir,
        includeSourceComments: false,
        sourcemaps: false,
        minify: false,
      });

      // Even with empty files, bundle adds a header
      expect(result.content).toContain('DSAi Design Tokens');
      // Sources list includes the generated tokens placeholder
      expect(result.files).toEqual(['<generated-tokens>']);
    });
  });
});
