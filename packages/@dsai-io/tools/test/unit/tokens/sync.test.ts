/**
 * Unit tests for token sync functionality
 *
 * Tests cover:
 * - syncTokens function
 * - getDefaultSyncPaths
 * - Token verification
 */

import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { getDefaultSyncPaths, syncTokens } from '../../../src/tokens/sync.js';

// ============================================================================
// Test Helpers
// ============================================================================

function createTestDir(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  const testDir = join(tmpdir(), `dsai-sync-test-${timestamp}-${random}`);
  mkdirSync(testDir, { recursive: true });
  return testDir;
}

function cleanupTestDir(dir: string): void {
  if (existsSync(dir)) {
    rmSync(dir, { recursive: true, force: true });
  }
}

// Sample token content
const SAMPLE_TOKENS = `export const colorPrimary = "#007bff";
export const colorSecondary = "#6c757d";
export const fontFamilySans = "'Inter, -apple-system, sans-serif'";
export const spacingSm = "8px";
`;

const TOKENS_WITH_FONTS = `export const colorPrimary = "#007bff";
export const fontFamilySans = "'Inter, -apple-system, sans-serif'";
export const fontFamilyMono = "'Roboto Mono, monospace'";
`;

// ============================================================================
// getDefaultSyncPaths Tests
// ============================================================================

describe('getDefaultSyncPaths', () => {
  it('should return correct source and target paths', () => {
    const tokensDir = '/path/to/tokens';
    const paths = getDefaultSyncPaths(tokensDir);

    expect(paths.sourceFile).toBe('/path/to/tokens/dist/js/tokens.js');
    expect(paths.targetFile).toBe('/path/to/tokens/src/tokens-flat.ts');
  });

  it('should handle relative paths', () => {
    const paths = getDefaultSyncPaths('./packages/tokens');

    // Note: join() normalizes paths and removes the leading ./
    expect(paths.sourceFile).toBe('packages/tokens/dist/js/tokens.js');
    expect(paths.targetFile).toBe('packages/tokens/src/tokens-flat.ts');
  });
});

// ============================================================================
// syncTokens Tests
// ============================================================================

describe('syncTokens', () => {
  let testDir: string;
  let distDir: string;
  let srcDir: string;

  beforeEach(() => {
    testDir = createTestDir();
    distDir = join(testDir, 'dist', 'js');
    srcDir = join(testDir, 'src');
    mkdirSync(distDir, { recursive: true });
    mkdirSync(srcDir, { recursive: true });
  });

  afterEach(() => {
    cleanupTestDir(testDir);
  });

  describe('basic functionality', () => {
    it('should sync tokens from source to target', () => {
      const sourceFile = join(distDir, 'tokens.js');
      const targetFile = join(srcDir, 'tokens-flat.ts');
      writeFileSync(sourceFile, SAMPLE_TOKENS, 'utf8');

      const result = syncTokens({ sourceFile, targetFile });

      expect(result.success).toBe(true);
      expect(result.changed).toBe(true);
      expect(result.tokensCount).toBeGreaterThan(0);
      expect(existsSync(targetFile)).toBe(true);
    });

    it('should add TypeScript header', () => {
      const sourceFile = join(distDir, 'tokens.js');
      const targetFile = join(srcDir, 'tokens-flat.ts');
      writeFileSync(sourceFile, SAMPLE_TOKENS, 'utf8');

      syncTokens({ sourceFile, targetFile });

      const content = readFileSync(targetFile, 'utf8');
      expect(content).toContain('Do not edit directly');
      expect(content).toContain('auto-generated');
    });

    it('should count token exports', () => {
      const sourceFile = join(distDir, 'tokens.js');
      const targetFile = join(srcDir, 'tokens-flat.ts');
      writeFileSync(sourceFile, SAMPLE_TOKENS, 'utf8');

      const result = syncTokens({ sourceFile, targetFile });

      expect(result.tokensCount).toBe(4); // 4 exports in SAMPLE_TOKENS
    });
  });

  describe('dry run mode', () => {
    it('should not write files in dry run mode', () => {
      const sourceFile = join(distDir, 'tokens.js');
      const targetFile = join(srcDir, 'tokens-flat.ts');
      writeFileSync(sourceFile, SAMPLE_TOKENS, 'utf8');

      const result = syncTokens({ sourceFile, targetFile, dryRun: true });

      expect(result.success).toBe(true);
      expect(result.changed).toBe(true);
      expect(existsSync(targetFile)).toBe(false);
    });
  });

  describe('error handling', () => {
    it('should handle missing source file', () => {
      const sourceFile = join(distDir, 'nonexistent.js');
      const targetFile = join(srcDir, 'tokens-flat.ts');

      const result = syncTokens({ sourceFile, targetFile });

      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors?.[0]).toMatch(/not found/i);
    });
  });

  describe('change detection', () => {
    it('should detect when target is already up to date', () => {
      const sourceFile = join(distDir, 'tokens.js');
      const targetFile = join(srcDir, 'tokens-flat.ts');
      writeFileSync(sourceFile, SAMPLE_TOKENS, 'utf8');

      // First sync
      syncTokens({ sourceFile, targetFile });

      // Second sync should detect no changes
      const result = syncTokens({ sourceFile, targetFile });

      expect(result.success).toBe(true);
      expect(result.changed).toBe(false);
    });

    it('should detect changes in source', () => {
      const sourceFile = join(distDir, 'tokens.js');
      const targetFile = join(srcDir, 'tokens-flat.ts');
      writeFileSync(sourceFile, SAMPLE_TOKENS, 'utf8');

      // First sync
      syncTokens({ sourceFile, targetFile });

      // Modify source
      writeFileSync(sourceFile, `${SAMPLE_TOKENS}\nexport const newToken = "value";`, 'utf8');

      // Second sync should detect changes
      const result = syncTokens({ sourceFile, targetFile });

      expect(result.success).toBe(true);
      expect(result.changed).toBe(true);
    });
  });

  describe('font family verification', () => {
    it('should find expected font families', () => {
      const sourceFile = join(distDir, 'tokens.js');
      const targetFile = join(srcDir, 'tokens-flat.ts');
      writeFileSync(sourceFile, TOKENS_WITH_FONTS, 'utf8');

      const result = syncTokens({ sourceFile, targetFile });

      expect(result.success).toBe(true);
      // No errors about missing fonts
      expect(result.errors).toBeUndefined();
    });

    it('should warn about missing font families', () => {
      const sourceFile = join(distDir, 'tokens.js');
      const targetFile = join(srcDir, 'tokens-flat.ts');
      // Tokens without the expected fonts
      writeFileSync(sourceFile, 'export const color = "#fff";', 'utf8');

      const result = syncTokens({ sourceFile, targetFile });

      // Should still succeed but with warnings
      expect(result.success).toBe(true);
      expect(result.errors).toBeDefined();
      expect(result.errors?.some((e) => e.includes('Font family'))).toBe(true);
    });
  });

  describe('verbose mode', () => {
    let consoleSpy: {
      info: jest.SpyInstance;
      error: jest.SpyInstance;
      warn: jest.SpyInstance;
    };

    beforeEach(() => {
      consoleSpy = {
        info: jest.spyOn(console, 'info').mockImplementation(),
        error: jest.spyOn(console, 'error').mockImplementation(),
        warn: jest.spyOn(console, 'warn').mockImplementation(),
      };
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should log details in verbose mode', () => {
      const sourceFile = join(distDir, 'tokens.js');
      const targetFile = join(srcDir, 'tokens-flat.ts');
      writeFileSync(sourceFile, SAMPLE_TOKENS, 'utf8');

      syncTokens({ sourceFile, targetFile, verbose: true });

      expect(consoleSpy.info).toHaveBeenCalled();
    });
  });
});

// ============================================================================
// syncTokensCLI Tests
// ============================================================================

describe('syncTokensCLI', () => {
  let testDir: string;
  let distDir: string;
  let srcDir: string;
  let consoleSpy: {
    info: jest.SpyInstance;
    error: jest.SpyInstance;
    warn: jest.SpyInstance;
  };

  beforeEach(() => {
    testDir = createTestDir();
    distDir = join(testDir, 'dist', 'js');
    srcDir = join(testDir, 'src');
    mkdirSync(distDir, { recursive: true });
    mkdirSync(srcDir, { recursive: true });

    consoleSpy = {
      info: jest.spyOn(console, 'info').mockImplementation(),
      error: jest.spyOn(console, 'error').mockImplementation(),
      warn: jest.spyOn(console, 'warn').mockImplementation(),
    };
  });

  afterEach(() => {
    cleanupTestDir(testDir);
    jest.restoreAllMocks();
  });

  it('should sync using default paths from tokens directory', async () => {
    const { syncTokensCLI } = await import('../../../src/tokens/sync.js');

    // Create the source file in the expected location
    writeFileSync(join(distDir, 'tokens.js'), SAMPLE_TOKENS, 'utf8');

    const result = syncTokensCLI(testDir);

    expect(result).toBe(true);
    expect(existsSync(join(srcDir, 'tokens-flat.ts'))).toBe(true);
  });

  it('should return false when source file is missing', async () => {
    const { syncTokensCLI } = await import('../../../src/tokens/sync.js');

    // Don't create any source file
    const result = syncTokensCLI(testDir);

    expect(result).toBe(false);
    expect(consoleSpy.error).toHaveBeenCalled();
  });

  it('should warn about missing fonts but still succeed', async () => {
    const { syncTokensCLI } = await import('../../../src/tokens/sync.js');

    // Create source file without expected fonts
    writeFileSync(join(distDir, 'tokens.js'), 'export const color = "#fff";', 'utf8');

    const result = syncTokensCLI(testDir);

    expect(result).toBe(true);
    expect(consoleSpy.warn).toHaveBeenCalled();
  });

  it('should log success messages', async () => {
    const { syncTokensCLI } = await import('../../../src/tokens/sync.js');

    writeFileSync(join(distDir, 'tokens.js'), TOKENS_WITH_FONTS, 'utf8');

    const result = syncTokensCLI(testDir);

    expect(result).toBe(true);
    // Should log info about syncing
    expect(consoleSpy.info).toHaveBeenCalled();
  });
});
