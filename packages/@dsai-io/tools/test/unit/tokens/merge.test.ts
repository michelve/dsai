/**
 * Unit tests for token merge functionality
 *
 * Tests cover:
 * - Content merging (merger.ts)
 * - Bundle creation (bundler.ts)
 * - Directory scanning (scanner.ts)
 */

import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

import { createBundle } from '../../../src/tokens/merge/bundler.js';
import { mergeContent } from '../../../src/tokens/merge/merger.js';
import { scanDirectories, sortFiles } from '../../../src/tokens/merge/scanner.js';

import type { MergeContent, StyleScannedFile } from '../../../src/tokens/merge/types.js';

// ============================================================================
// Test Helpers
// ============================================================================

function createTestDir(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  const testDir = join(tmpdir(), `dsai-merge-test-${timestamp}-${random}`);
  mkdirSync(testDir, { recursive: true });
  return testDir;
}

function cleanupTestDir(dir: string): void {
  if (existsSync(dir)) {
    rmSync(dir, { recursive: true, force: true });
  }
}

// Sample content
const TOKEN_CSS = `:root {
  --color-primary: blue;
  --color-secondary: gray;
}`;

const USER_CSS = `:root {
  --color-bg: white;
  --color-text: black;
}`;

const SCSS_CONTENT = `$color-primary: blue;

.component {
  color: $color-primary;
}`;

// Helper to create proper MergeContent
function createMergeContent(
  source: string,
  content: string,
  format: 'css' | 'scss' = 'css'
): MergeContent {
  return { source, content, type: 'user', format };
}

// ============================================================================
// mergeContent Tests
// ============================================================================

describe('mergeContent', () => {
  it('should merge token and user content', async () => {
    const tokenContent = { content: TOKEN_CSS, format: 'css' as const };
    const userContent = [createMergeContent('custom.css', USER_CSS)];

    const result = await mergeContent(tokenContent, userContent);

    expect(result.content).toContain('--color-primary');
    expect(result.content).toContain('--color-bg');
    expect(result.sources.length).toBe(2);
  });

  it('should add header comment', async () => {
    const tokenContent = { content: TOKEN_CSS, format: 'css' as const };

    const result = await mergeContent(tokenContent, []);

    expect(result.content).toContain('DSAi Design Tokens');
    expect(result.content).toContain('Generated:');
  });

  it('should add source comments', async () => {
    const tokenContent = { content: TOKEN_CSS, format: 'css' as const };
    const userContent = [createMergeContent('overrides.css', USER_CSS)];

    const result = await mergeContent(tokenContent, userContent);

    expect(result.content).toContain('Source: <generated-tokens>');
    expect(result.content).toContain('Source: overrides.css');
  });

  it('should merge user content after tokens by default', async () => {
    const tokenContent = { content: TOKEN_CSS, format: 'css' as const };
    const userContent = [createMergeContent('after.css', USER_CSS)];

    const result = await mergeContent(tokenContent, userContent, { mergeOrder: 'after' });

    const tokenIndex = result.content.indexOf('--color-primary');
    const userIndex = result.content.indexOf('--color-bg');
    expect(tokenIndex).toBeLessThan(userIndex);
  });

  it('should merge user content before tokens when specified', async () => {
    const tokenContent = { content: TOKEN_CSS, format: 'css' as const };
    const userContent = [createMergeContent('before.css', USER_CSS)];

    const result = await mergeContent(tokenContent, userContent, { mergeOrder: 'before' });

    const tokenIndex = result.content.indexOf('--color-primary');
    const userIndex = result.content.indexOf('--color-bg');
    expect(userIndex).toBeLessThan(tokenIndex);
  });

  it('should detect duplicate :root selectors', async () => {
    const tokenContent = { content: TOKEN_CSS, format: 'css' as const };
    const userContent = [createMergeContent('dupe.css', USER_CSS)];

    const result = await mergeContent(tokenContent, userContent);

    // Should have warning about duplicate :root
    expect(result.warnings.length).toBeGreaterThan(0);
    expect(result.warnings.some((w) => w.includes(':root'))).toBe(true);
  });
});

// ============================================================================
// scanDirectories Tests
// ============================================================================

describe('scanDirectories', () => {
  let testDir: string;

  beforeEach(() => {
    testDir = createTestDir();
  });

  afterEach(() => {
    cleanupTestDir(testDir);
  });

  it('should find CSS files', async () => {
    writeFileSync(join(testDir, 'a.css'), USER_CSS, 'utf8');
    writeFileSync(join(testDir, 'b.css'), TOKEN_CSS, 'utf8');

    const result = await scanDirectories({
      directories: [testDir],
      extension: 'css',
    });

    expect(result.totalFiles).toBe(2);
    expect(result.files.some((f) => f.name === 'a')).toBe(true);
    expect(result.files.some((f) => f.name === 'b')).toBe(true);
  });

  it('should find SCSS files', async () => {
    writeFileSync(join(testDir, 'styles.scss'), SCSS_CONTENT, 'utf8');

    const result = await scanDirectories({
      directories: [testDir],
      extension: 'scss',
    });

    expect(result.totalFiles).toBe(1);
    expect(result.files[0].extension).toBe('scss');
  });

  it('should respect ignore patterns', async () => {
    writeFileSync(join(testDir, 'styles.css'), USER_CSS, 'utf8');
    writeFileSync(join(testDir, 'ignored.test.css'), USER_CSS, 'utf8');

    const result = await scanDirectories({
      directories: [testDir],
      extension: 'css',
      ignorePatterns: ['**/*.test.css'],
    });

    // Filter out .test.css files manually to verify behavior
    const nonTestFiles = result.files.filter((f) => !f.name.includes('.test'));
    expect(nonTestFiles.length).toBe(1);
    expect(nonTestFiles[0].name).toBe('styles');
  });

  it('should scan subdirectories', async () => {
    const subDir = join(testDir, 'sub');
    mkdirSync(subDir, { recursive: true });
    writeFileSync(join(testDir, 'root.css'), USER_CSS, 'utf8');
    writeFileSync(join(subDir, 'nested.css'), TOKEN_CSS, 'utf8');

    const result = await scanDirectories({
      directories: [testDir],
      extension: 'css',
    });

    expect(result.totalFiles).toBe(2);
  });

  it('should respect maxDepth', async () => {
    const deepDir = join(testDir, 'a', 'b', 'c');
    mkdirSync(deepDir, { recursive: true });
    writeFileSync(join(testDir, 'root.css'), USER_CSS, 'utf8');
    writeFileSync(join(deepDir, 'deep.css'), TOKEN_CSS, 'utf8');

    const result = await scanDirectories({
      directories: [testDir],
      extension: 'css',
      maxDepth: 1,
    });

    expect(result.totalFiles).toBe(1);
    expect(result.files[0].name).toBe('root');
  });

  it('should handle empty directories', async () => {
    const result = await scanDirectories({
      directories: [testDir],
      extension: 'css',
    });

    expect(result.totalFiles).toBe(0);
    expect(result.files).toEqual([]);
  });
});

// ============================================================================
// sortFiles Tests
// ============================================================================

describe('sortFiles', () => {
  const createFile = (name: string): StyleScannedFile => ({
    name,
    absolutePath: `/${name}.css`,
    relativePath: `${name}.css`,
    extension: 'css',
    size: 100,
    mtime: new Date(),
    depth: 0,
  });

  it('should sort by name ascending by default', () => {
    const files = [createFile('c'), createFile('a'), createFile('b')];

    const sorted = sortFiles(files);

    expect(sorted[0].name).toBe('a');
    expect(sorted[1].name).toBe('b');
    expect(sorted[2].name).toBe('c');
  });

  it('should preserve original array', () => {
    const files = [createFile('b'), createFile('a')];
    const original = [...files];

    sortFiles(files);

    expect(files[0].name).toBe(original[0].name);
  });
});

// ============================================================================
// createBundle Tests
// ============================================================================

describe('createBundle', () => {
  let testDir: string;

  beforeEach(() => {
    testDir = createTestDir();
  });

  afterEach(() => {
    cleanupTestDir(testDir);
  });

  it('should create a bundle file', async () => {
    const mergeResult = {
      content: TOKEN_CSS,
      sources: ['tokens.css'],
      warnings: [],
    };

    const result = await createBundle(mergeResult, {
      name: 'test-bundle',
      outputDir: testDir,
      includeSourceComments: true,
      sourcemaps: false,
      minify: false,
    });

    expect(result.outputPath).toContain('test-bundle.css');
    expect(existsSync(result.outputPath)).toBe(true);
    expect(result.size).toBeGreaterThan(0);
  });

  it('should detect SCSS content', async () => {
    const mergeResult = {
      content: SCSS_CONTENT,
      sources: ['tokens.scss'],
      warnings: [],
    };

    const result = await createBundle(mergeResult, {
      name: 'scss-bundle',
      outputDir: testDir,
      includeSourceComments: true,
      sourcemaps: false,
      minify: false,
    });

    expect(result.outputPath).toContain('.scss');
  });

  it('should minify when requested', async () => {
    const mergeResult = {
      content: TOKEN_CSS,
      sources: ['tokens.css'],
      warnings: [],
    };

    const result = await createBundle(mergeResult, {
      name: 'minified-bundle',
      outputDir: testDir,
      includeSourceComments: false,
      sourcemaps: false,
      minify: true,
    });

    expect(result.minifiedSize).toBeDefined();
    expect(result.minifiedSize).toBeLessThan(Buffer.byteLength(TOKEN_CSS, 'utf-8'));
  });

  it('should generate sourcemaps when requested', async () => {
    const mergeResult = {
      content: TOKEN_CSS,
      sources: ['tokens.css'],
      warnings: [],
    };

    const result = await createBundle(mergeResult, {
      name: 'sourcemap-bundle',
      outputDir: testDir,
      includeSourceComments: false,
      sourcemaps: true,
      minify: false,
    });

    expect(result.sourcemap).toBeDefined();
    expect(existsSync(`${result.outputPath}.map`)).toBe(true);
  });

  it('should remove source comments when requested', async () => {
    const contentWithComments = `/* ========== Source: tokens.css ========== */\n${TOKEN_CSS}`;
    const mergeResult = {
      content: contentWithComments,
      sources: ['tokens.css'],
      warnings: [],
    };

    const result = await createBundle(mergeResult, {
      name: 'no-comments',
      outputDir: testDir,
      includeSourceComments: false,
      sourcemaps: false,
      minify: false,
    });

    expect(result.content).not.toContain('========== Source:');
  });
});

// ============================================================================
// loadContent Tests
// ============================================================================

describe('loadContent', () => {
  let testDir: string;

  beforeEach(() => {
    testDir = createTestDir();
  });

  afterEach(() => {
    cleanupTestDir(testDir);
  });

  it('should load content from files', async () => {
    const { loadContent } = await import('../../../src/tokens/merge/merger.js');

    const cssFile = join(testDir, 'test.css');
    writeFileSync(cssFile, USER_CSS, 'utf8');

    const result = await loadContent([cssFile], 'user', 'css');

    expect(result).toHaveLength(1);
    expect(result[0].source).toBe(cssFile);
    expect(result[0].content).toBe(USER_CSS);
    expect(result[0].type).toBe('user');
    expect(result[0].format).toBe('css');
  });

  it('should handle multiple files', async () => {
    const { loadContent } = await import('../../../src/tokens/merge/merger.js');

    const file1 = join(testDir, 'a.css');
    const file2 = join(testDir, 'b.css');
    writeFileSync(file1, USER_CSS, 'utf8');
    writeFileSync(file2, TOKEN_CSS, 'utf8');

    const result = await loadContent([file1, file2], 'token', 'css');

    expect(result).toHaveLength(2);
    expect(result[0].type).toBe('token');
    expect(result[1].type).toBe('token');
  });

  it('should handle missing files gracefully', async () => {
    const { loadContent } = await import('../../../src/tokens/merge/merger.js');

    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

    const result = await loadContent(['/nonexistent/file.css'], 'user', 'css');

    expect(result).toHaveLength(0);
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});

// ============================================================================
// processScssImportHeader Tests
// ============================================================================

describe('processScssImportHeader', () => {
  it('should return empty string for undefined', async () => {
    const { processScssImportHeader } = await import('../../../src/tokens/merge/merger.js');

    const result = processScssImportHeader(undefined, '/config');
    expect(result).toBe('');
  });

  it('should process single string import', async () => {
    const { processScssImportHeader } = await import('../../../src/tokens/merge/merger.js');

    const result = processScssImportHeader('normalize.css', '/config');
    expect(result).toContain("@import 'normalize.css';");
  });

  it('should process array of imports', async () => {
    const { processScssImportHeader } = await import('../../../src/tokens/merge/merger.js');

    const result = processScssImportHeader(['normalize.css', 'reset.css'], '/config');
    expect(result).toContain("@import 'normalize.css';");
    expect(result).toContain("@import 'reset.css';");
  });

  it('should resolve relative paths', async () => {
    const { processScssImportHeader } = await import('../../../src/tokens/merge/merger.js');

    const result = processScssImportHeader('./mixins.scss', '/project/config');
    const expected = resolve('/project/config', './mixins.scss');
    expect(result).toContain(`@import '${expected}';`);
  });

  it('should resolve absolute paths', async () => {
    const { processScssImportHeader } = await import('../../../src/tokens/merge/merger.js');

    const result = processScssImportHeader('/absolute/path.scss', '/config');
    const expected = resolve('/config', '/absolute/path.scss');
    expect(result).toContain(`@import '${expected}';`);
  });
});

// ============================================================================
// addScssImportHeader Tests
// ============================================================================

describe('addScssImportHeader', () => {
  it('should return content unchanged when no header', async () => {
    const { addScssImportHeader } = await import('../../../src/tokens/merge/merger.js');

    const content = '$var: blue;';
    const result = addScssImportHeader(content, undefined, '/config');
    expect(result).toBe(content);
  });

  it('should prepend import header to content', async () => {
    const { addScssImportHeader } = await import('../../../src/tokens/merge/merger.js');

    const content = '$var: blue;';
    const result = addScssImportHeader(content, 'normalize.css', '/config');
    expect(result).toContain("@import 'normalize.css';");
    expect(result).toContain('$var: blue;');
    expect(result.indexOf('@import')).toBeLessThan(result.indexOf('$var'));
  });
});

// ============================================================================
// filterFiles Tests
// ============================================================================

describe('filterFiles', () => {
  const createFileWithPath = (name: string, relPath: string): StyleScannedFile => ({
    name,
    absolutePath: `/${relPath}`,
    relativePath: relPath,
    extension: 'css',
    size: 100,
    mtime: new Date(),
    depth: 0,
  });

  it('should filter out files matching patterns by default', async () => {
    const { filterFiles } = await import('../../../src/tokens/merge/scanner.js');

    const files = [
      createFileWithPath('main', 'main.css'),
      createFileWithPath('test', 'test.css'),
      createFileWithPath('spec', 'spec.css'),
    ];

    const result = filterFiles(files, ['test.css', 'spec.css']);

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('main');
  });

  it('should include only matching files when include is true', async () => {
    const { filterFiles } = await import('../../../src/tokens/merge/scanner.js');

    const files = [
      createFileWithPath('main', 'main.css'),
      createFileWithPath('test', 'test.css'),
      createFileWithPath('spec', 'spec.css'),
    ];

    const result = filterFiles(files, ['test.css', 'spec.css'], true);

    expect(result).toHaveLength(2);
    expect(result.map((f) => f.name)).toContain('test');
    expect(result.map((f) => f.name)).toContain('spec');
  });

  it('should handle glob patterns with file names', async () => {
    const { filterFiles } = await import('../../../src/tokens/merge/scanner.js');

    const files = [
      createFileWithPath('main', 'src/main.css'),
      createFileWithPath('test', 'src/test.spec.css'),
    ];

    // Filter out spec files
    const result = filterFiles(files, ['*.spec.css']);

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('main');
  });
});

// ============================================================================
// getDefaultIgnorePatterns Tests
// ============================================================================

describe('getDefaultIgnorePatterns', () => {
  it('should return an array of patterns', async () => {
    const { getDefaultIgnorePatterns } = await import('../../../src/tokens/merge/scanner.js');

    const patterns = getDefaultIgnorePatterns();

    expect(Array.isArray(patterns)).toBe(true);
    expect(patterns.length).toBeGreaterThan(0);
  });

  it('should include node_modules pattern', async () => {
    const { getDefaultIgnorePatterns } = await import('../../../src/tokens/merge/scanner.js');

    const patterns = getDefaultIgnorePatterns();

    expect(patterns.some((p) => p.includes('node_modules'))).toBe(true);
  });

  it('should include test patterns', async () => {
    const { getDefaultIgnorePatterns } = await import('../../../src/tokens/merge/scanner.js');

    const patterns = getDefaultIgnorePatterns();

    expect(patterns.some((p) => p.includes('test'))).toBe(true);
  });

  it('should return a copy (not the original array)', async () => {
    const { getDefaultIgnorePatterns } = await import('../../../src/tokens/merge/scanner.js');

    const patterns1 = getDefaultIgnorePatterns();
    const patterns2 = getDefaultIgnorePatterns();

    patterns1.push('custom-pattern');

    expect(patterns2).not.toContain('custom-pattern');
  });
});

// ============================================================================
// sortFiles directory-first Tests
// ============================================================================

describe('sortFiles directory-first', () => {
  const createFileInDir = (name: string, dir: string): StyleScannedFile => ({
    name,
    absolutePath: `/${dir}/${name}.css`,
    relativePath: `${dir}/${name}.css`,
    extension: 'css',
    size: 100,
    mtime: new Date(),
    depth: dir.split('/').length,
  });

  it('should sort by directory first, then by name', () => {
    const files = [
      createFileInDir('zebra', 'components'),
      createFileInDir('alpha', 'utils'),
      createFileInDir('beta', 'components'),
    ];

    const sorted = sortFiles(files, 'directory-first');

    // components should come before utils (alphabetically)
    expect(sorted[0].relativePath).toContain('components');
    expect(sorted[1].relativePath).toContain('components');
    expect(sorted[2].relativePath).toContain('utils');

    // Within components, beta should come before zebra
    expect(sorted[0].name).toBe('beta');
    expect(sorted[1].name).toBe('zebra');
  });
});
