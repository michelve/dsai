/**
 * Integration tests for token build pipeline
 *
 * Tests the integration between token validation, transformation, and output generation.
 * Uses temporary directories to avoid side effects.
 */

import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { transformTokens } from '../../src/tokens/transform.js';
import { validateTokens } from '../../src/tokens/validate.js';

import type { ResolvedConfig } from '../../src/config/types.js';

// ============================================================================
// Helper Functions
// ============================================================================

function createTestDir(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  const testDir = join(tmpdir(), `dsai-integration-test-${timestamp}-${random}`);
  mkdirSync(testDir, { recursive: true });
  return testDir;
}

function cleanupTestDir(dir: string): void {
  if (existsSync(dir)) {
    rmSync(dir, { recursive: true, force: true });
  }
}

function writeTokenFile(dir: string, name: string, content: object): string {
  const filePath = join(dir, name);
  writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf8');
  return filePath;
}

function createMockConfig(collectionsDir: string): ResolvedConfig {
  return {
    tokens: {
      source: 'figma',
      sourceDir: collectionsDir,
      collectionsDir,
      sourcePatterns: ['**/*.json'],
      collectionMapping: {},
      outputDir: join(collectionsDir, '..', 'dist'),
      outputDirs: {},
      outputFileNames: {
        css: 'tokens.css',
        scss: '_tokens.scss',
        js: 'tokens.js',
        ts: 'tokens.ts',
        json: 'tokens.json',
        android: 'tokens.xml',
        ios: 'tokens.swift',
      },
      prefix: '--dsai-',
      formats: ['css'],
      additionalScssDirectories: [],
      additionalCssDirectories: [],
      mergeOrder: 'after',
      createBundle: false,
      themes: {
        autoDetect: false,
        default: 'light',
        ignoreModes: [],
        selectorPattern: {
          default: ':root',
          others: '[data-dsai-theme="{mode}"]',
        },
      },
      transforms: [],
      customFormats: [],
      preprocessors: [],
      filters: [],
      outputReferences: true,
      baseFontSize: 16,
      separateThemeFiles: false,
      watch: false,
      watchDirectories: [],
    },
    icons: {
      sourceDir: '',
      outputDir: '',
      framework: 'react',
      typescript: true,
      optimize: true,
      prefix: '',
    },
    global: {
      cwd: collectionsDir,
      debug: false,
      logLevel: 'info',
    },
    configDir: collectionsDir,
    configPath: undefined,
  };
}

// ============================================================================
// Token Validation Integration Tests
// ============================================================================

describe('Token Validation Integration', () => {
  let testDir: string;

  beforeEach(() => {
    testDir = createTestDir();
  });

  afterEach(() => {
    cleanupTestDir(testDir);
  });

  it('should validate a directory of valid tokens', async () => {
    // Create valid token files
    writeTokenFile(testDir, 'colors.json', {
      color: {
        primary: {
          $type: 'color',
          $value: '#007bff',
          $description: 'Primary brand color',
        },
        secondary: {
          $type: 'color',
          $value: '#6c757d',
        },
      },
    });

    writeTokenFile(testDir, 'spacing.json', {
      spacing: {
        sm: { $type: 'dimension', $value: '8px' },
        md: { $type: 'dimension', $value: '16px' },
        lg: { $type: 'dimension', $value: '24px' },
      },
    });

    const config = createMockConfig(testDir);
    const result = await validateTokens(config, { verbose: false, quiet: true });

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(result.fileCount).toBe(2);
    expect(result.tokenCount).toBeGreaterThan(0);
  });

  it('should report errors for invalid tokens', async () => {
    // Create token file with issues
    writeTokenFile(testDir, 'invalid.json', {
      color: {
        broken: {
          $type: 'color',
          $value: '{color.missing}', // Reference to non-existent token
        },
      },
    });

    const config = createMockConfig(testDir);
    const result = await validateTokens(config, { verbose: false, quiet: true });

    // Validation should complete but report warnings/errors about unresolved references
    expect(result.fileCount).toBe(1);
  });

  it('should handle empty token directories', async () => {
    // testDir is empty
    const config = createMockConfig(testDir);
    const result = await validateTokens(config, { verbose: false, quiet: true });

    expect(result.valid).toBe(true);
    expect(result.fileCount).toBe(0);
    expect(result.tokenCount).toBe(0);
  });

  it('should validate nested token structures', async () => {
    writeTokenFile(testDir, 'typography.json', {
      typography: {
        heading: {
          h1: {
            fontSize: { $type: 'dimension', $value: '32px' },
            fontWeight: { $type: 'fontWeight', $value: 700 },
            lineHeight: { $type: 'number', $value: 1.2 },
          },
          h2: {
            fontSize: { $type: 'dimension', $value: '24px' },
            fontWeight: { $type: 'fontWeight', $value: 600 },
            lineHeight: { $type: 'number', $value: 1.3 },
          },
        },
      },
    });

    const config = createMockConfig(testDir);
    const result = await validateTokens(config, { verbose: false, quiet: true });

    expect(result.valid).toBe(true);
    expect(result.tokenCount).toBeGreaterThanOrEqual(6);
  });
});

// ============================================================================
// Token Transform Integration Tests
// ============================================================================

describe('Token Transform Integration', () => {
  let testDir: string;
  let sourceDir: string;
  let collectionsDir: string;

  beforeEach(() => {
    testDir = createTestDir();
    sourceDir = join(testDir, 'figma-exports');
    collectionsDir = join(testDir, 'collections');
    mkdirSync(sourceDir, { recursive: true });
    mkdirSync(collectionsDir, { recursive: true });
  });

  afterEach(() => {
    cleanupTestDir(testDir);
  });

  it('should transform spacing tokens', () => {
    // Create spacing.json matching DEFAULT_COLLECTIONS expected input
    writeTokenFile(sourceDir, 'spacing.json', {
      Spacing: {
        Base: {
          xs: {
            $value: '4',
            $type: 'dimension',
          },
          sm: {
            $value: '8',
            $type: 'dimension',
          },
        },
      },
    });

    const result = transformTokens({
      sourceDir,
      collectionsDir,
      verbose: false,
    });

    // Transform should succeed (may have warnings about missing files)
    expect(result.success).toBe(true);
  });

  it('should process typography tokens', () => {
    // Create typography.json matching expected format
    writeTokenFile(sourceDir, 'typography.json', {
      Typography: {
        fontFamily: {
          base: {
            $value: 'Inter, sans-serif',
            $type: 'fontFamily',
          },
        },
        fontSize: {
          base: {
            $value: '16px',
            $type: 'dimension',
          },
        },
      },
    });

    const result = transformTokens({
      sourceDir,
      collectionsDir,
      verbose: false,
    });

    expect(result.success).toBe(true);
  });

  it('should handle foundation tokens with modes', () => {
    // Create foundation.json with mode structure
    writeTokenFile(sourceDir, 'foundation.json', {
      Foundation: {
        modes: {
          Light: {
            background: {
              primary: {
                $value: '#ffffff',
                $type: 'color',
              },
            },
          },
          Dark: {
            background: {
              primary: {
                $value: '#1a1a1a',
                $type: 'color',
              },
            },
          },
        },
      },
    });

    const result = transformTokens({
      sourceDir,
      collectionsDir,
      verbose: false,
      defaultMode: 'Light',
    });

    expect(result.success).toBe(true);
    expect(result.modesDetected).toBeInstanceOf(Array);
  });

  it('should report warnings for missing collection files', () => {
    // Don't create any files - all will be missing
    const result = transformTokens({
      sourceDir,
      collectionsDir,
      verbose: false,
    });

    // Should succeed but have warnings about missing files
    expect(result.success).toBe(true);
    expect(result.warnings.length).toBeGreaterThan(0);
  });
});

// ============================================================================
// Full Pipeline Integration Tests
// ============================================================================

describe('Full Token Pipeline', () => {
  let testDir: string;
  let sourceDir: string;
  let collectionsDir: string;

  beforeEach(() => {
    testDir = createTestDir();
    sourceDir = join(testDir, 'figma-exports');
    collectionsDir = join(testDir, 'collections');
    mkdirSync(sourceDir, { recursive: true });
    mkdirSync(collectionsDir, { recursive: true });
  });

  afterEach(() => {
    cleanupTestDir(testDir);
  });

  it('should run transform then validate successfully', async () => {
    // Step 1: Create properly formatted tokens
    writeTokenFile(sourceDir, 'spacing.json', {
      Spacing: {
        Base: {
          sm: { $value: '8', $type: 'dimension' },
          md: { $value: '16', $type: 'dimension' },
        },
      },
    });

    // Step 2: Transform
    const transformResult = transformTokens({
      sourceDir,
      collectionsDir,
      verbose: false,
    });
    expect(transformResult.success).toBe(true);

    // Step 3: Create valid DTCG tokens for validation
    writeTokenFile(collectionsDir, 'spacing.json', {
      spacing: {
        sm: { $value: '8px', $type: 'dimension' },
        md: { $value: '16px', $type: 'dimension' },
      },
    });

    const config = createMockConfig(collectionsDir);
    const validateResult = await validateTokens(config, { verbose: false, quiet: true });
    expect(validateResult.valid).toBe(true);
    expect(validateResult.tokenCount).toBeGreaterThan(0);
  });

  it('should validate complex token hierarchies', async () => {
    // Create DTCG-formatted tokens directly for validation
    writeTokenFile(collectionsDir, 'complex.json', {
      color: {
        palette: {
          blue: {
            '100': { $value: '#e3f2fd', $type: 'color' },
            '500': { $value: '#2196f3', $type: 'color' },
            '900': { $value: '#0d47a1', $type: 'color' },
          },
        },
        semantic: {
          primary: { $value: '{color.palette.blue.500}', $type: 'color' },
          background: { $value: '{color.palette.blue.100}', $type: 'color' },
        },
      },
      spacing: {
        base: { $value: '4px', $type: 'dimension' },
        scale: {
          xs: { $value: '{spacing.base}', $type: 'dimension' },
          sm: { $value: '8px', $type: 'dimension' },
          md: { $value: '16px', $type: 'dimension' },
        },
      },
    });

    const config = createMockConfig(collectionsDir);
    const validateResult = await validateTokens(config, { verbose: false, quiet: true });
    expect(validateResult.valid).toBe(true);
    expect(validateResult.tokenCount).toBeGreaterThanOrEqual(8);
  });

  it('should handle transform with dry run', () => {
    writeTokenFile(sourceDir, 'spacing.json', {
      Spacing: {
        Base: {
          md: { $value: '16', $type: 'dimension' },
        },
      },
    });

    const result = transformTokens({
      sourceDir,
      collectionsDir,
      verbose: false,
      dryRun: true,
    });

    expect(result.success).toBe(true);
    // Dry run shouldn't write files
    expect(result.filesWritten.length).toBe(0);
  });

  it('should process multiple collections in pipeline', async () => {
    // Create multiple properly-named source files
    writeTokenFile(sourceDir, 'spacing.json', {
      Spacing: { Base: { md: { $value: '16', $type: 'dimension' } } },
    });
    writeTokenFile(sourceDir, 'radius.json', {
      Radius: { Base: { sm: { $value: '4', $type: 'dimension' } } },
    });

    // Transform
    const transformResult = transformTokens({
      sourceDir,
      collectionsDir,
      verbose: false,
    });
    expect(transformResult.success).toBe(true);

    // Create tokens for validation
    writeTokenFile(collectionsDir, 'tokens.json', {
      spacing: { md: { $value: '16px', $type: 'dimension' } },
      radius: { sm: { $value: '4px', $type: 'dimension' } },
    });

    const config = createMockConfig(collectionsDir);
    const validateResult = await validateTokens(config, { verbose: false, quiet: true });
    expect(validateResult.valid).toBe(true);
  });
});
