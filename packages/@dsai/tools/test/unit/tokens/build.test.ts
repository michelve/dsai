/**
 * Unit tests for token build functionality
 *
 * Tests cover:
 * - buildTokens function
 * - Build step creation
 * - Error handling
 */

import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { buildTokens } from '../../../src/tokens/build.js';

// ============================================================================
// Test Helpers
// ============================================================================

function createTestDir(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  const testDir = join(tmpdir(), `dsai-build-test-${timestamp}-${random}`);
  mkdirSync(testDir, { recursive: true });
  return testDir;
}

function cleanupTestDir(dir: string): void {
  if (existsSync(dir)) {
    rmSync(dir, { recursive: true, force: true });
  }
}

function createMinimalProject(baseDir: string): { tokensDir: string; toolsDir: string } {
  const tokensDir = join(baseDir, 'tokens');
  const toolsDir = join(baseDir, 'tools');
  const collectionsDir = join(tokensDir, 'collections');
  const srcDir = join(tokensDir, 'src');
  const distDir = join(tokensDir, 'dist', 'js');

  mkdirSync(collectionsDir, { recursive: true });
  mkdirSync(srcDir, { recursive: true });
  mkdirSync(distDir, { recursive: true });
  mkdirSync(toolsDir, { recursive: true });

  // Create minimal package.json
  writeFileSync(join(tokensDir, 'package.json'), '{"name": "test-tokens"}', 'utf8');

  return { tokensDir: collectionsDir, toolsDir };
}

// ============================================================================
// buildTokens Tests
// ============================================================================

describe('buildTokens', () => {
  let testDir: string;

  beforeEach(() => {
    testDir = createTestDir();
  });

  afterEach(() => {
    cleanupTestDir(testDir);
  });

  describe('directory validation', () => {
    it('should fail if tokens directory does not exist', () => {
      const result = buildTokens('/nonexistent/tokens', '/nonexistent/tools');

      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toMatch(/not found/i);
      expect(result.stepsFailed).toContain('Directory Check');
    });

    it('should fail if tools directory does not exist', () => {
      const { tokensDir } = createMinimalProject(testDir);

      const result = buildTokens(tokensDir, '/nonexistent/tools');

      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should pass validation with valid directories', () => {
      const { tokensDir, toolsDir } = createMinimalProject(testDir);

      // We expect this to fail on actual commands, but directory check should pass
      const result = buildTokens(tokensDir, toolsDir, { skipValidate: true, verbose: false });

      // Should not fail on directory check
      expect(result.stepsFailed).not.toContain('Directory Check');
    });
  });

  describe('build options', () => {
    it('should accept skipValidate option', () => {
      const { tokensDir, toolsDir } = createMinimalProject(testDir);

      // Calling buildTokens with skipValidate should skip the validation step
      const result = buildTokens(tokensDir, toolsDir, {
        skipValidate: true,
        verbose: false,
        quiet: true,
      });

      // Check that Validate Tokens step was not in completed or failed
      // (since we can't run full build, we just verify function accepts the option)
      expect(result).toBeDefined();
      expect(typeof result.duration).toBe('number');
    });

    it('should accept onlyTheme option', () => {
      const { tokensDir, toolsDir } = createMinimalProject(testDir);

      const result = buildTokens(tokensDir, toolsDir, {
        onlyTheme: true,
        verbose: false,
        quiet: true,
      });

      expect(result).toBeDefined();
      expect(result.duration).toBeGreaterThanOrEqual(0);
    });

    it('should accept verbose option', () => {
      const { tokensDir, toolsDir } = createMinimalProject(testDir);

      // Just verify it doesn't throw with verbose
      expect(() => {
        buildTokens(tokensDir, toolsDir, {
          skipValidate: true,
          verbose: true,
          quiet: true,
        });
      }).not.toThrow();
    });

    it('should accept quiet option', () => {
      const { tokensDir, toolsDir } = createMinimalProject(testDir);

      expect(() => {
        buildTokens(tokensDir, toolsDir, {
          skipValidate: true,
          quiet: true,
        });
      }).not.toThrow();
    });
  });

  describe('result structure', () => {
    it('should return proper BuildResult structure', () => {
      const { tokensDir, toolsDir } = createMinimalProject(testDir);

      const result = buildTokens(tokensDir, toolsDir, { verbose: false, quiet: true });

      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('stepsCompleted');
      expect(result).toHaveProperty('stepsFailed');
      expect(result).toHaveProperty('duration');
      expect(result).toHaveProperty('errors');
      expect(result).toHaveProperty('warnings');

      expect(typeof result.success).toBe('boolean');
      expect(Array.isArray(result.stepsCompleted)).toBe(true);
      expect(Array.isArray(result.stepsFailed)).toBe(true);
      expect(typeof result.duration).toBe('number');
      expect(Array.isArray(result.errors)).toBe(true);
      expect(Array.isArray(result.warnings)).toBe(true);
    });

    it('should track duration', () => {
      const { tokensDir, toolsDir } = createMinimalProject(testDir);

      const result = buildTokens(tokensDir, toolsDir, { verbose: false, quiet: true });

      expect(result.duration).toBeGreaterThanOrEqual(0);
    });
  });

  describe('step handling', () => {
    it('should handle multiple steps correctly', () => {
      const { tokensDir, toolsDir } = createMinimalProject(testDir);

      const result = buildTokens(tokensDir, toolsDir, {
        skipValidate: false,
        verbose: false,
        quiet: true,
      });

      // Should have attempted at least one step
      expect(result.stepsCompleted.length + result.stepsFailed.length).toBeGreaterThanOrEqual(1);
    });

    it('should report step names in results', () => {
      const { tokensDir, toolsDir } = createMinimalProject(testDir);

      const result = buildTokens(tokensDir, toolsDir, { verbose: false, quiet: true });

      // All step names should be strings
      for (const stepName of [...result.stepsCompleted, ...result.stepsFailed]) {
        expect(typeof stepName).toBe('string');
        expect(stepName.length).toBeGreaterThan(0);
      }
    });

    it('should handle directory check as first step', () => {
      const result = buildTokens('/invalid/path', '/also/invalid', {
        verbose: false,
        quiet: true,
      });

      expect(result.success).toBe(false);
      expect(result.stepsFailed).toContain('Directory Check');
    });
  });

  describe('error accumulation', () => {
    it('should accumulate errors from multiple sources', () => {
      const result = buildTokens('/nonexistent1', '/nonexistent2', {
        verbose: false,
        quiet: true,
      });

      expect(result.errors.length).toBeGreaterThan(0);
      // Each error should be a meaningful message
      for (const error of result.errors) {
        expect(typeof error).toBe('string');
      }
    });

    it('should distinguish between errors and warnings', () => {
      const { tokensDir, toolsDir } = createMinimalProject(testDir);

      const result = buildTokens(tokensDir, toolsDir, { verbose: false, quiet: true });

      // Both should be arrays (may or may not be empty)
      expect(Array.isArray(result.errors)).toBe(true);
      expect(Array.isArray(result.warnings)).toBe(true);
    });
  });

  describe('verbose and quiet modes', () => {
    it('should support both verbose and quiet being false', () => {
      const { tokensDir, toolsDir } = createMinimalProject(testDir);

      expect(() => {
        buildTokens(tokensDir, toolsDir, { verbose: false, quiet: false });
      }).not.toThrow();
    });

    it('should support verbose true and quiet true', () => {
      const { tokensDir, toolsDir } = createMinimalProject(testDir);

      // quiet should take precedence
      expect(() => {
        buildTokens(tokensDir, toolsDir, { verbose: true, quiet: true });
      }).not.toThrow();
    });
  });

  describe('step configuration', () => {
    it('should accept skipTransform option', () => {
      const { tokensDir, toolsDir } = createMinimalProject(testDir);

      const result = buildTokens(tokensDir, toolsDir, {
        skipTransform: true,
        verbose: false,
        quiet: true,
      });

      expect(result).toBeDefined();
      expect(result.duration).toBeGreaterThanOrEqual(0);
    });

    it('should accept watch option', () => {
      const { tokensDir, toolsDir } = createMinimalProject(testDir);

      // Watch mode won't actually watch in test, just verifies option accepted
      const result = buildTokens(tokensDir, toolsDir, {
        watch: false,
        verbose: false,
        quiet: true,
      });

      expect(result).toBeDefined();
    });

    it('should accept dryRun option', () => {
      const { tokensDir, toolsDir } = createMinimalProject(testDir);

      const result = buildTokens(tokensDir, toolsDir, {
        dryRun: true,
        verbose: false,
        quiet: true,
      });

      expect(result).toBeDefined();
    });
  });
});

// ============================================================================
// buildTokensCLI Tests
// ============================================================================

describe('buildTokensCLI', () => {
  let testDir: string;

  beforeEach(() => {
    testDir = createTestDir();
  });

  afterEach(() => {
    cleanupTestDir(testDir);
  });

  it('should parse --skip-validate argument', async () => {
    const { buildTokensCLI } = await import('../../../src/tokens/build.js');
    const { tokensDir, toolsDir } = createMinimalProject(testDir);

    // This will fail on commands but should parse args correctly
    const result = buildTokensCLI(tokensDir, toolsDir, ['--skip-validate', '--quiet']);

    // Result is boolean
    expect(typeof result).toBe('boolean');
  });

  it('should parse --skip-transform argument', async () => {
    const { buildTokensCLI } = await import('../../../src/tokens/build.js');
    const { tokensDir, toolsDir } = createMinimalProject(testDir);

    const result = buildTokensCLI(tokensDir, toolsDir, ['--skip-transform', '--quiet']);

    expect(typeof result).toBe('boolean');
  });

  it('should parse --only-theme argument', async () => {
    const { buildTokensCLI } = await import('../../../src/tokens/build.js');
    const { tokensDir, toolsDir } = createMinimalProject(testDir);

    const result = buildTokensCLI(tokensDir, toolsDir, ['--only-theme', '--quiet']);

    expect(typeof result).toBe('boolean');
  });

  it('should parse -q as quiet mode', async () => {
    const { buildTokensCLI } = await import('../../../src/tokens/build.js');
    const { tokensDir, toolsDir } = createMinimalProject(testDir);

    const result = buildTokensCLI(tokensDir, toolsDir, ['-q']);

    expect(typeof result).toBe('boolean');
  });

  it('should handle empty args array', async () => {
    const { buildTokensCLI } = await import('../../../src/tokens/build.js');
    const { tokensDir, toolsDir } = createMinimalProject(testDir);

    // Will fail but should not throw
    expect(() => {
      buildTokensCLI(tokensDir, toolsDir, []);
    }).not.toThrow();
  });

  it('should return false for missing directories', async () => {
    const { buildTokensCLI } = await import('../../../src/tokens/build.js');

    const result = buildTokensCLI('/nonexistent/tokens', '/nonexistent/tools', ['--quiet']);

    expect(result).toBe(false);
  });
});
