/**
 * Unit tests for CSS postprocessing
 *
 * Tests cover:
 * - postprocessCss function
 * - postprocessCssFiles function
 * - Default transformations
 * - Custom replacements
 */

import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
  getDefaultCssDir,
  getDefaultFiles,
  getDefaultTransformations,
  postprocessCss,
  postprocessCssFiles,
} from '../../../src/tokens/postprocess.js';

// ============================================================================
// Test Helpers
// ============================================================================

function createTestDir(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  const testDir = join(tmpdir(), `dsai-postprocess-test-${timestamp}-${random}`);
  mkdirSync(testDir, { recursive: true });
  return testDir;
}

function cleanupTestDir(dir: string): void {
  if (existsSync(dir)) {
    rmSync(dir, { recursive: true, force: true });
  }
}

// Sample CSS content
const SAMPLE_CSS = `:root {
  --primary: #007bff;
}

[data-bs-theme="light"] {
  --bg: white;
}

[data-bs-theme="dark"] {
  --bg: #1a1a1a;
}
`;

const EXPECTED_CSS = `:root {
  --primary: #007bff;
}

[data-dsai-theme="light"] {
  --bg: white;
}

[data-dsai-theme="dark"] {
  --bg: #1a1a1a;
}
`;

// ============================================================================
// Helper Function Tests
// ============================================================================

describe('getDefaultCssDir', () => {
  it('should return correct CSS directory path', () => {
    const result = getDefaultCssDir('/path/to/tokens');
    expect(result).toBe(join('/path/to/tokens', 'dist', 'css'));
  });
});

describe('getDefaultFiles', () => {
  it('should return default file list', () => {
    const files = getDefaultFiles();
    expect(Array.isArray(files)).toBe(true);
    expect(files.length).toBeGreaterThan(0);
    expect(files).toContain('dsai-theme-bs.css');
  });
});

describe('getDefaultTransformations', () => {
  it('should return default transformations', () => {
    const transforms = getDefaultTransformations();
    expect(Array.isArray(transforms)).toBe(true);
    expect(transforms.length).toBeGreaterThan(0);
    // Should include the theme attribute transformation
    const hasThemeTransform = transforms.some(
      (t) => t.to === 'data-dsai-theme' || String(t.from).includes('data-bs-theme')
    );
    expect(hasThemeTransform).toBe(true);
  });
});

// ============================================================================
// postprocessCss Tests
// ============================================================================

describe('postprocessCss', () => {
  let testDir: string;

  beforeEach(() => {
    testDir = createTestDir();
  });

  afterEach(() => {
    cleanupTestDir(testDir);
  });

  describe('basic functionality', () => {
    it('should replace data-bs-theme with data-dsai-theme', () => {
      const inputFile = join(testDir, 'theme.css');
      writeFileSync(inputFile, SAMPLE_CSS, 'utf8');

      const result = postprocessCss({ inputFile });

      expect(result.success).toBe(true);
      expect(result.replacementsMade).toBe(2); // Two occurrences

      const content = readFileSync(inputFile, 'utf8');
      expect(content).toBe(EXPECTED_CSS);
    });

    it('should return count of replacements', () => {
      const inputFile = join(testDir, 'theme.css');
      writeFileSync(inputFile, SAMPLE_CSS, 'utf8');

      const result = postprocessCss({ inputFile });

      expect(result.replacementsMade).toBe(2);
    });

    it('should handle files with no matches', () => {
      const inputFile = join(testDir, 'clean.css');
      writeFileSync(inputFile, ':root { color: red; }', 'utf8');

      const result = postprocessCss({ inputFile });

      expect(result.success).toBe(true);
      expect(result.replacementsMade).toBe(0);
    });
  });

  describe('output file', () => {
    it('should write to different output file when specified', () => {
      const inputFile = join(testDir, 'input.css');
      const outputFile = join(testDir, 'output.css');
      writeFileSync(inputFile, SAMPLE_CSS, 'utf8');

      const result = postprocessCss({ inputFile, outputFile });

      expect(result.success).toBe(true);
      expect(existsSync(outputFile)).toBe(true);
      expect(result.outputFile).toBe(outputFile);
    });

    it('should default output to input file', () => {
      const inputFile = join(testDir, 'theme.css');
      writeFileSync(inputFile, SAMPLE_CSS, 'utf8');

      const result = postprocessCss({ inputFile });

      expect(result.outputFile).toBe(inputFile);
    });
  });

  describe('dry run mode', () => {
    it('should not modify files in dry run mode', () => {
      const inputFile = join(testDir, 'theme.css');
      writeFileSync(inputFile, SAMPLE_CSS, 'utf8');

      const result = postprocessCss({ inputFile, dryRun: true });

      expect(result.success).toBe(true);
      expect(result.replacementsMade).toBe(2);

      // File should be unchanged
      const content = readFileSync(inputFile, 'utf8');
      expect(content).toBe(SAMPLE_CSS);
    });
  });

  describe('custom replacements', () => {
    it('should apply custom string replacements', () => {
      const inputFile = join(testDir, 'custom.css');
      writeFileSync(inputFile, '.old-class { color: red; }', 'utf8');

      const result = postprocessCss({
        inputFile,
        replacements: [{ from: 'old-class', to: 'new-class', description: 'Rename class' }],
      });

      expect(result.success).toBe(true);
      const content = readFileSync(inputFile, 'utf8');
      expect(content).toContain('new-class');
      expect(content).not.toContain('old-class');
    });

    it('should apply custom regex replacements', () => {
      const inputFile = join(testDir, 'regex.css');
      writeFileSync(inputFile, '.btn-primary { } .btn-secondary { }', 'utf8');

      const result = postprocessCss({
        inputFile,
        replacements: [{ from: /btn-/g, to: 'dsai-btn-', description: 'Prefix buttons' }],
      });

      expect(result.success).toBe(true);
      const content = readFileSync(inputFile, 'utf8');
      expect(content).toContain('dsai-btn-primary');
      expect(content).toContain('dsai-btn-secondary');
    });
  });

  describe('error handling', () => {
    it('should handle missing file', () => {
      const result = postprocessCss({ inputFile: join(testDir, 'nonexistent.css') });

      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors?.[0]).toMatch(/not found/i);
    });
  });
});

// ============================================================================
// postprocessCssFiles Tests
// ============================================================================

describe('postprocessCssFiles', () => {
  let testDir: string;
  let cssDir: string;

  beforeEach(() => {
    testDir = createTestDir();
    cssDir = join(testDir, 'dist', 'css');
    mkdirSync(cssDir, { recursive: true });
  });

  afterEach(() => {
    cleanupTestDir(testDir);
  });

  it('should process multiple files', () => {
    writeFileSync(join(cssDir, 'file1.css'), SAMPLE_CSS, 'utf8');
    writeFileSync(join(cssDir, 'file2.css'), SAMPLE_CSS, 'utf8');

    const result = postprocessCssFiles({
      cssDir,
      files: ['file1.css', 'file2.css'],
    });

    expect(result.success).toBe(true);
    expect(result.filesModified).toBe(2);
    expect(result.totalReplacements).toBe(4); // 2 per file
  });

  it('should handle missing files gracefully', () => {
    writeFileSync(join(cssDir, 'file1.css'), SAMPLE_CSS, 'utf8');

    const result = postprocessCssFiles({
      cssDir,
      files: ['file1.css', 'missing.css'],
    });

    // Should still process the existing file
    expect(result.filesModified).toBe(1);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('should skip files with no changes', () => {
    writeFileSync(join(cssDir, 'clean.css'), ':root { }', 'utf8');

    const result = postprocessCssFiles({
      cssDir,
      files: ['clean.css'],
    });

    expect(result.filesModified).toBe(0);
    expect(result.totalReplacements).toBe(0);
  });

  it('should support dry run mode', () => {
    writeFileSync(join(cssDir, 'file.css'), SAMPLE_CSS, 'utf8');

    const result = postprocessCssFiles({
      cssDir,
      files: ['file.css'],
      dryRun: true,
    });

    expect(result.totalReplacements).toBe(2);
    // File should be unchanged
    const content = readFileSync(join(cssDir, 'file.css'), 'utf8');
    expect(content).toBe(SAMPLE_CSS);
  });
});

// ============================================================================
// postprocessCLI Tests
// ============================================================================

describe('postprocessCLI', () => {
  let testDir: string;
  let cssDir: string;
  let consoleSpy: {
    info: jest.SpyInstance;
    warn: jest.SpyInstance;
  };

  beforeEach(() => {
    testDir = createTestDir();
    cssDir = join(testDir, 'dist', 'css');
    mkdirSync(cssDir, { recursive: true });

    consoleSpy = {
      info: jest.spyOn(console, 'info').mockImplementation(),
      warn: jest.spyOn(console, 'warn').mockImplementation(),
    };
  });

  afterEach(() => {
    cleanupTestDir(testDir);
    jest.restoreAllMocks();
  });

  it('should process files using default paths', async () => {
    const { postprocessCLI } = await import('../../../src/tokens/postprocess.js');

    // Create default files
    writeFileSync(join(cssDir, 'dsai-theme-bs.css'), SAMPLE_CSS, 'utf8');
    writeFileSync(join(cssDir, 'dsai-theme-bs.min.css'), SAMPLE_CSS, 'utf8');

    const result = postprocessCLI(testDir);

    expect(result).toBe(true);

    // Verify files were processed
    const content = readFileSync(join(cssDir, 'dsai-theme-bs.css'), 'utf8');
    expect(content).toContain('data-dsai-theme');
  });

  it('should return false when files are missing', async () => {
    const { postprocessCLI } = await import('../../../src/tokens/postprocess.js');

    // Don't create any files
    const result = postprocessCLI(testDir);

    expect(result).toBe(false);
    expect(consoleSpy.warn).toHaveBeenCalled();
  });

  it('should log progress in verbose mode', async () => {
    const { postprocessCLI } = await import('../../../src/tokens/postprocess.js');

    writeFileSync(join(cssDir, 'dsai-theme-bs.css'), SAMPLE_CSS, 'utf8');
    writeFileSync(join(cssDir, 'dsai-theme-bs.min.css'), SAMPLE_CSS, 'utf8');

    postprocessCLI(testDir);

    expect(consoleSpy.info).toHaveBeenCalled();
  });
});
