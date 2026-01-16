# Task: Testing Suite

**Task ID:** TASK-109
**Title:** Comprehensive Testing Suite for @dsai-io/tools
**Priority:** High
**Status:** ⚪ Not Started
**Assigned To:** Unassigned
**Blocked by Task:** TASK-101, TASK-102, TASK-103, TASK-104, TASK-105, TASK-106
**Created:** 2024-12-23
**Updated:** 2024-12-23

---

## 📋 Task Description

### Goal

Create a comprehensive testing suite for `@dsai-io/tools` that covers unit tests, integration tests, and end-to-end tests for all modules. Ensure high code coverage and reliable test automation.

### Problem/Issue

Current testing gaps:

1. **No Unit Tests**: Core modules untested
2. **No Integration Tests**: Module interactions untested
3. **No E2E Tests**: Full workflows untested
4. **No Snapshot Tests**: Output consistency untested
5. **No Coverage Tracking**: No visibility into test coverage
6. **No CI Integration**: No automated test runs

### Expected Outcome

A testing infrastructure that:

1. Achieves 90%+ code coverage
2. Tests all public APIs
3. Tests CLI commands
4. Tests configuration loading
5. Tests build outputs
6. Runs in CI/CD pipeline

---

## 🎯 Acceptance Criteria

### Test Coverage

- [ ] 90%+ overall coverage
- [ ] 90%+ coverage on core modules
- [ ] All public APIs tested
- [ ] All CLI commands tested

### Test Types

- [ ] Unit tests for all modules
- [ ] Integration tests for workflows
- [ ] E2E tests for CLI
- [ ] Snapshot tests for outputs
- [ ] Error case tests

### Infrastructure

- [ ] Jest configuration
- [ ] Coverage reporting
- [ ] CI/CD integration
- [ ] Test fixtures
- [ ] Mock utilities

---

## 📂 Files to Create/Modify

### New Files

```
packages/@dsai-io/tools/
├── jest.config.ts                  # Jest configuration
├── tsconfig.test.json              # TypeScript config for tests
├── test/
│   ├── setup.ts                    # Test setup
│   ├── utils/
│   │   ├── index.ts               # Test utilities
│   │   ├── fixtures.ts            # Fixture helpers
│   │   ├── mocks.ts               # Mock helpers
│   │   └── temp-dir.ts            # Temp directory helpers
│   ├── fixtures/
│   │   ├── tokens/                # Token fixtures
│   │   │   ├── valid/            # Valid token files
│   │   │   ├── invalid/          # Invalid token files
│   │   │   └── dtcg/             # DTCG format tokens
│   │   ├── icons/                 # Icon fixtures
│   │   │   └── svg/              # SVG files
│   │   └── config/               # Config fixtures
│   │       ├── minimal.mjs       # Minimal config
│   │       ├── full.mjs          # Full config
│   │       └── invalid.mjs       # Invalid config
│   ├── unit/
│   │   ├── config/
│   │   │   ├── loader.test.ts    # Config loader tests
│   │   │   ├── schema.test.ts    # Schema validation tests
│   │   │   └── resolver.test.ts  # Config resolver tests
│   │   ├── tokens/
│   │   │   ├── validate.test.ts  # Token validation tests
│   │   │   ├── transform.test.ts # Token transform tests
│   │   │   ├── build.test.ts     # Token build tests
│   │   │   └── sync.test.ts      # Token sync tests
│   │   ├── style-dictionary/
│   │   │   ├── transforms.test.ts # SD transform tests
│   │   │   ├── formats.test.ts   # SD format tests
│   │   │   └── config.test.ts    # SD config tests
│   │   └── icons/
│   │       ├── scanner.test.ts   # Icon scanner tests
│   │       ├── parser.test.ts    # Icon parser tests
│   │       ├── optimizer.test.ts # Icon optimizer tests
│   │       └── generators.test.ts # Icon generator tests
│   ├── integration/
│   │   ├── token-build.test.ts   # Full token build
│   │   ├── icon-build.test.ts    # Full icon build
│   │   └── config-loading.test.ts # Config loading
│   ├── e2e/
│   │   ├── cli-init.test.ts      # CLI init command
│   │   ├── cli-tokens.test.ts    # CLI tokens commands
│   │   ├── cli-icons.test.ts     # CLI icons commands
│   │   └── cli-config.test.ts    # CLI config command
│   └── snapshots/
│       ├── css-output.test.ts    # CSS output snapshots
│       ├── js-output.test.ts     # JS output snapshots
│       ├── react-icons.test.ts   # React icon snapshots
│       └── vue-icons.test.ts     # Vue icon snapshots
└── coverage/                       # Coverage reports (gitignored)
```

---

## 🔗 Dependencies

### Prerequisites

- [ ] TASK-101 through TASK-106 completed

### Testing Dependencies

```json
{
  "devDependencies": {
    "jest": "^29.7.0",
    "@types/jest": "^29.5.12",
    "ts-jest": "^29.1.2",
    "jest-snapshot": "^29.7.0",
    "execa": "^8.0.0"
  }
}
```

---

## 🔄 Implementation Steps

### Step 1: Jest Configuration

**packages/@dsai-io/tools/jest.config.ts:**

```typescript
import type { Config } from 'jest';

const config: Config = {
  displayName: '@dsai-io/tools',
  preset: '../../jest.preset.cjs',

  // Test environment
  testEnvironment: 'node',

  // Transform TypeScript
  transform: {
    '^.+\\.[tj]sx?$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.test.json',
        useESM: true,
      },
    ],
  },

  // ESM support
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },

  // Test patterns
  testMatch: ['<rootDir>/test/**/*.test.ts'],

  // Setup files
  setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],

  // Coverage configuration
  collectCoverageFrom: ['src/**/*.ts', '!src/**/*.d.ts', '!src/**/types.ts', '!src/**/index.ts'],
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['text', 'lcov', 'json-summary'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },

  // Timeout for async tests
  testTimeout: 30000,

  // Clear mocks between tests
  clearMocks: true,
  restoreMocks: true,
};

export default config;
```

### Step 2: Test Setup

**packages/@dsai-io/tools/test/setup.ts:**

```typescript
/**
 * Jest test setup
 */

import { jest } from '@jest/globals';

// Extend expect with custom matchers
expect.extend({
  toBeValidCSSVariable(received: string) {
    const pass = /^--[\w-]+$/.test(received);
    return {
      pass,
      message: () =>
        pass
          ? `expected ${received} not to be a valid CSS variable`
          : `expected ${received} to be a valid CSS variable`,
    };
  },

  toContainValidCSS(received: string) {
    const hasRoot = received.includes(':root');
    const hasVariables = /--[\w-]+:\s*[^;]+;/.test(received);
    const pass = hasRoot && hasVariables;
    return {
      pass,
      message: () =>
        pass ? `expected CSS not to be valid` : `expected CSS to contain :root and CSS variables`,
    };
  },
});

// Global test timeout
jest.setTimeout(30000);

// Suppress console during tests (optional)
if (process.env.SUPPRESS_CONSOLE) {
  global.console = {
    ...console,
    log: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
  };
}

// Clean up after all tests
afterAll(async () => {
  // Any global cleanup
});

// Declare custom matchers
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeValidCSSVariable(): R;
      toContainValidCSS(): R;
    }
  }
}
```

### Step 3: Test Utilities

**packages/@dsai-io/tools/test/utils/index.ts:**

```typescript
/**
 * Test utilities
 */

export * from './fixtures.js';
export * from './mocks.js';
export * from './temp-dir.js';
```

**packages/@dsai-io/tools/test/utils/fixtures.ts:**

```typescript
/**
 * Fixture utilities
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const fixturesDir = join(__dirname, '../fixtures');

/**
 * Get path to a fixture file
 */
export function getFixturePath(...paths: string[]): string {
  return join(fixturesDir, ...paths);
}

/**
 * Read a fixture file
 */
export function readFixture(...paths: string[]): string {
  return readFileSync(getFixturePath(...paths), 'utf-8');
}

/**
 * Read a JSON fixture
 */
export function readJSONFixture<T>(...paths: string[]): T {
  return JSON.parse(readFixture(...paths)) as T;
}

/**
 * Get all fixture files in a directory
 */
export function getFixtureFiles(dir: string): string[] {
  const { readdirSync } = require('fs');
  return readdirSync(getFixturePath(dir));
}
```

**packages/@dsai-io/tools/test/utils/temp-dir.ts:**

```typescript
/**
 * Temporary directory utilities
 */

import { mkdtempSync, rmSync, mkdirSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

/**
 * Create a temporary directory for testing
 */
export function createTempDir(prefix = 'dsai-test-'): string {
  return mkdtempSync(join(tmpdir(), prefix));
}

/**
 * Remove a temporary directory
 */
export function removeTempDir(dir: string): void {
  rmSync(dir, { recursive: true, force: true });
}

/**
 * Context manager for temporary directories
 */
export async function withTempDir<T>(fn: (dir: string) => Promise<T> | T): Promise<T> {
  const dir = createTempDir();
  try {
    return await fn(dir);
  } finally {
    removeTempDir(dir);
  }
}

/**
 * Create a mock project structure
 */
export function createMockProject(dir: string, files: Record<string, string>): void {
  for (const [path, content] of Object.entries(files)) {
    const fullPath = join(dir, path);
    const dirPath = join(fullPath, '..');
    mkdirSync(dirPath, { recursive: true });
    writeFileSync(fullPath, content, 'utf-8');
  }
}
```

**packages/@dsai-io/tools/test/utils/mocks.ts:**

```typescript
/**
 * Mock utilities
 */

import { jest } from '@jest/globals';

/**
 * Create a mock token
 */
export function createMockToken(overrides: Partial<any> = {}) {
  return {
    name: 'color-blue-500',
    path: ['color', 'blue', '500'],
    value: '#3b82f6',
    original: { value: '#3b82f6' },
    $value: '#3b82f6',
    $type: 'color',
    ...overrides,
  };
}

/**
 * Create a mock config
 */
export function createMockConfig(overrides: Partial<any> = {}) {
  return {
    global: {
      debug: false,
      verbose: false,
      dryRun: false,
    },
    tokens: {
      sourceDir: './collections',
      outputDir: './dist',
      prefix: '--dsai-',
      baseFontSize: 16,
      outputReferences: true,
      platforms: ['css', 'js'],
    },
    icons: {
      sourceDir: './icons',
      outputDir: './dist/icons',
      format: 'react',
      optimize: true,
    },
    hooks: {},
    ...overrides,
  };
}

/**
 * Create a mock logger
 */
export function createMockLogger() {
  return {
    log: jest.fn(),
    info: jest.fn(),
    success: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
  };
}

/**
 * Create a mock spinner
 */
export function createMockSpinner() {
  return {
    start: jest.fn(),
    stop: jest.fn(),
    succeed: jest.fn(),
    fail: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
  };
}
```

### Step 4: Unit Tests - Config

**packages/@dsai-io/tools/test/unit/config/loader.test.ts:**

```typescript
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { loadConfig } from '../../../src/config/loader.js';
import { withTempDir, createMockProject } from '../../utils/index.js';

describe('Config Loader', () => {
  describe('loadConfig', () => {
    it('should load default config when no file exists', async () => {
      await withTempDir(async (dir) => {
        const { config, configPath } = await loadConfig({ cwd: dir });

        expect(config).toBeDefined();
        expect(config.tokens.prefix).toBe('--dsai-');
        expect(configPath).toBeUndefined();
      });
    });

    it('should load config from dsai.config.mjs', async () => {
      await withTempDir(async (dir) => {
        createMockProject(dir, {
          'dsai.config.mjs': `
            export default {
              tokens: {
                prefix: '--test-',
              },
            };
          `,
        });

        const { config, configPath } = await loadConfig({ cwd: dir });

        expect(config.tokens.prefix).toBe('--test-');
        expect(configPath).toContain('dsai.config.mjs');
      });
    });

    it('should load config from .dsairc.json', async () => {
      await withTempDir(async (dir) => {
        createMockProject(dir, {
          '.dsairc.json': JSON.stringify({
            tokens: {
              prefix: '--json-',
            },
          }),
        });

        const { config } = await loadConfig({ cwd: dir });

        expect(config.tokens.prefix).toBe('--json-');
      });
    });

    it('should respect configPath option', async () => {
      await withTempDir(async (dir) => {
        createMockProject(dir, {
          'custom/my-config.json': JSON.stringify({
            tokens: {
              prefix: '--custom-',
            },
          }),
        });

        const { config } = await loadConfig({
          cwd: dir,
          configPath: 'custom/my-config.json',
        });

        expect(config.tokens.prefix).toBe('--custom-');
      });
    });

    it('should throw on invalid config', async () => {
      await withTempDir(async (dir) => {
        createMockProject(dir, {
          'dsai.config.mjs': `
            export default {
              tokens: {
                baseFontSize: 'invalid', // Should be number
              },
            };
          `,
        });

        await expect(loadConfig({ cwd: dir })).rejects.toThrow();
      });
    });
  });
});
```

### Step 5: Unit Tests - Transforms

**packages/@dsai-io/tools/test/unit/style-dictionary/transforms.test.ts:**

```typescript
import { describe, it, expect } from '@jest/globals';
import {
  fontWeightUnitless,
  lineHeightUnitless,
  dimensionRem,
  nameKebab,
} from '../../../src/tokens/style-dictionary/transforms/index.js';
import { createMockToken } from '../../utils/index.js';

describe('Style Dictionary Transforms', () => {
  describe('fontWeight/unitless', () => {
    it('should keep numeric font weights', () => {
      const token = createMockToken({
        $value: 700,
        $type: 'fontWeight',
      });

      const result = fontWeightUnitless.transform(token);

      expect(result).toBe(700);
    });

    it('should parse string font weights', () => {
      const token = createMockToken({
        $value: '700',
        $type: 'fontWeight',
      });

      const result = fontWeightUnitless.transform(token);

      expect(result).toBe(700);
    });

    it('should convert named weights', () => {
      const testCases = [
        ['bold', 700],
        ['normal', 400],
        ['light', 300],
        ['thin', 100],
        ['black', 900],
      ];

      for (const [input, expected] of testCases) {
        const token = createMockToken({
          $value: input,
          $type: 'fontWeight',
        });

        const result = fontWeightUnitless.transform(token);

        expect(result).toBe(expected);
      }
    });

    it('should filter correctly', () => {
      const fontWeight = createMockToken({ $type: 'fontWeight' });
      const color = createMockToken({ $type: 'color' });

      expect(fontWeightUnitless.filter!(fontWeight)).toBe(true);
      expect(fontWeightUnitless.filter!(color)).toBe(false);
    });
  });

  describe('lineHeight/unitless', () => {
    it('should keep small numbers as-is', () => {
      const token = createMockToken({
        $value: 1.5,
        $type: 'lineHeight',
      });

      const result = lineHeightUnitless.transform(token);

      expect(result).toBe(1.5);
    });

    it('should convert percentages', () => {
      const token = createMockToken({
        $value: '150%',
        $type: 'lineHeight',
      });

      const result = lineHeightUnitless.transform(token);

      expect(result).toBe(1.5);
    });

    it('should convert large px values', () => {
      const token = createMockToken({
        $value: 24, // 24px
        $type: 'lineHeight',
      });

      const result = lineHeightUnitless.transform(token);

      expect(result).toBe(1.5); // 24 / 16
    });
  });

  describe('dimension/rem', () => {
    it('should convert pixels to rem', () => {
      const token = createMockToken({
        $value: 16,
        $type: 'dimension',
      });

      const result = dimensionRem.transform(token);

      expect(result).toBe('1rem');
    });

    it('should handle px strings', () => {
      const token = createMockToken({
        $value: '24px',
        $type: 'dimension',
      });

      const result = dimensionRem.transform(token);

      expect(result).toBe('1.5rem');
    });

    it('should handle zero', () => {
      const token = createMockToken({
        $value: 0,
        $type: 'dimension',
      });

      const result = dimensionRem.transform(token);

      expect(result).toBe('0');
    });

    it('should use custom base font size', () => {
      const token = createMockToken({
        $value: 20,
        $type: 'dimension',
      });

      const result = dimensionRem.transform(token, { basePxFontSize: 10 });

      expect(result).toBe('2rem');
    });
  });

  describe('name/kebab', () => {
    it('should convert path to kebab-case', () => {
      const token = createMockToken({
        path: ['color', 'blue', '500'],
      });

      const result = nameKebab.transform(token);

      expect(result).toBe('color-blue-500');
    });

    it('should handle underscores', () => {
      const token = createMockToken({
        path: ['font_size', 'large'],
      });

      const result = nameKebab.transform(token);

      expect(result).toBe('font-size-large');
    });
  });
});
```

### Step 6: Integration Tests

**packages/@dsai-io/tools/test/integration/token-build.test.ts:**

```typescript
import { describe, it, expect } from '@jest/globals';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { loadConfig } from '../../src/config/index.js';
import { buildTokens } from '../../src/tokens/index.js';
import { withTempDir, createMockProject, getFixturePath } from '../utils/index.js';

describe('Token Build Integration', () => {
  it('should build tokens from source files', async () => {
    await withTempDir(async (dir) => {
      // Create mock project
      createMockProject(dir, {
        'dsai.config.mjs': `
          export default {
            tokens: {
              sourceDir: './collections',
              outputDir: './dist',
              prefix: '--test-',
              platforms: ['css', 'js'],
            },
          };
        `,
        'collections/color.json': JSON.stringify({
          color: {
            blue: {
              500: {
                $value: '#3b82f6',
                $type: 'color',
              },
            },
          },
        }),
      });

      // Load config
      const { config } = await loadConfig({ cwd: dir });

      // Build tokens
      const result = await buildTokens(config);

      // Verify result
      expect(result.success).toBe(true);
      expect(result.filesWritten).toBeGreaterThan(0);

      // Check CSS output
      const cssPath = join(dir, 'dist/css/variables.css');
      expect(existsSync(cssPath)).toBe(true);

      const css = readFileSync(cssPath, 'utf-8');
      expect(css).toContain('--test-color-blue-500');
      expect(css).toContain('#3b82f6');

      // Check JS output
      const jsPath = join(dir, 'dist/js/tokens.js');
      expect(existsSync(jsPath)).toBe(true);
    });
  });

  it('should handle validation errors', async () => {
    await withTempDir(async (dir) => {
      createMockProject(dir, {
        'collections/invalid.json': '{ invalid json }',
      });

      const { config } = await loadConfig({ cwd: dir });
      const result = await buildTokens(config);

      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  it('should respect platform selection', async () => {
    await withTempDir(async (dir) => {
      createMockProject(dir, {
        'dsai.config.mjs': `
          export default {
            tokens: {
              platforms: ['css'], // Only CSS
            },
          };
        `,
        'collections/color.json': JSON.stringify({
          color: { blue: { 500: { $value: '#3b82f6', $type: 'color' } } },
        }),
      });

      const { config } = await loadConfig({ cwd: dir });
      await buildTokens(config);

      // CSS should exist
      expect(existsSync(join(dir, 'dist/css/variables.css'))).toBe(true);

      // JS should NOT exist
      expect(existsSync(join(dir, 'dist/js/tokens.js'))).toBe(false);
    });
  });
});
```

### Step 7: E2E Tests - CLI

**packages/@dsai-io/tools/test/e2e/cli-tokens.test.ts:**

```typescript
import { describe, it, expect } from '@jest/globals';
import { execa } from 'execa';
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { withTempDir, createMockProject } from '../utils/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CLI_PATH = join(__dirname, '../../dist/cli/index.js');

describe('CLI: tokens commands', () => {
  describe('dsai tokens build', () => {
    it('should build tokens successfully', async () => {
      await withTempDir(async (dir) => {
        createMockProject(dir, {
          'dsai.config.mjs': `
            export default {
              tokens: {
                sourceDir: './collections',
                outputDir: './dist',
              },
            };
          `,
          'collections/color.json': JSON.stringify({
            color: {
              primary: { $value: '#3b82f6', $type: 'color' },
            },
          }),
        });

        const result = await execa('node', [CLI_PATH, 'tokens', 'build'], {
          cwd: dir,
        });

        expect(result.exitCode).toBe(0);
        expect(existsSync(join(dir, 'dist/css/variables.css'))).toBe(true);
      });
    });

    it('should exit with error on failure', async () => {
      await withTempDir(async (dir) => {
        createMockProject(dir, {
          'collections/invalid.json': '{ not valid json }',
        });

        try {
          await execa('node', [CLI_PATH, 'tokens', 'build'], {
            cwd: dir,
          });
          expect.fail('Should have thrown');
        } catch (error: any) {
          expect(error.exitCode).not.toBe(0);
        }
      });
    });

    it('should respect --quiet flag', async () => {
      await withTempDir(async (dir) => {
        createMockProject(dir, {
          'collections/color.json': JSON.stringify({
            color: { primary: { $value: '#3b82f6', $type: 'color' } },
          }),
        });

        const result = await execa('node', [CLI_PATH, 'tokens', 'build', '--quiet'], {
          cwd: dir,
        });

        expect(result.stdout).toBe('');
        expect(result.exitCode).toBe(0);
      });
    });
  });

  describe('dsai tokens validate', () => {
    it('should validate valid tokens', async () => {
      await withTempDir(async (dir) => {
        createMockProject(dir, {
          'collections/color.json': JSON.stringify({
            color: { primary: { $value: '#3b82f6', $type: 'color' } },
          }),
        });

        const result = await execa('node', [CLI_PATH, 'tokens', 'validate'], {
          cwd: dir,
        });

        expect(result.exitCode).toBe(0);
      });
    });

    it('should report validation errors', async () => {
      await withTempDir(async (dir) => {
        createMockProject(dir, {
          'collections/invalid.json': JSON.stringify({
            color: { primary: { value: '#3b82f6' } }, // Missing $value
          }),
        });

        try {
          await execa('node', [CLI_PATH, 'tokens', 'validate', '--strict'], {
            cwd: dir,
          });
        } catch (error: any) {
          expect(error.stdout).toContain('error');
        }
      });
    });
  });
});
```

### Step 8: Snapshot Tests

**packages/@dsai-io/tools/test/snapshots/css-output.test.ts:**

```typescript
import { describe, it, expect } from '@jest/globals';
import { buildTokens } from '../../src/tokens/index.js';
import { loadConfig } from '../../src/config/index.js';
import { withTempDir, createMockProject } from '../utils/index.js';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('CSS Output Snapshots', () => {
  it('should match CSS output snapshot', async () => {
    await withTempDir(async (dir) => {
      createMockProject(dir, {
        'dsai.config.mjs': `
          export default {
            tokens: {
              prefix: '--dsai-',
              platforms: ['css'],
            },
          };
        `,
        'collections/color.json': JSON.stringify({
          color: {
            blue: {
              100: { $value: '#dbeafe', $type: 'color' },
              500: { $value: '#3b82f6', $type: 'color' },
              900: { $value: '#1e3a8a', $type: 'color' },
            },
          },
        }),
        'collections/spacing.json': JSON.stringify({
          spacing: {
            1: { $value: 4, $type: 'dimension' },
            2: { $value: 8, $type: 'dimension' },
            4: { $value: 16, $type: 'dimension' },
          },
        }),
      });

      const { config } = await loadConfig({ cwd: dir });
      await buildTokens(config);

      const css = readFileSync(join(dir, 'dist/css/variables.css'), 'utf-8');

      expect(css).toMatchSnapshot();
    });
  });

  it('should match CSS output with custom prefix', async () => {
    await withTempDir(async (dir) => {
      createMockProject(dir, {
        'dsai.config.mjs': `
          export default {
            tokens: {
              prefix: '--acme-',
              platforms: ['css'],
            },
          };
        `,
        'collections/color.json': JSON.stringify({
          color: {
            primary: { $value: '#ff0000', $type: 'color' },
          },
        }),
      });

      const { config } = await loadConfig({ cwd: dir });
      await buildTokens(config);

      const css = readFileSync(join(dir, 'dist/css/variables.css'), 'utf-8');

      expect(css).toContain('--acme-color-primary');
      expect(css).toMatchSnapshot();
    });
  });
});
```

---

## 📝 Notes

### Testing Principles

1. **Isolation**: Each test should be independent
2. **Repeatability**: Tests should produce same results every time
3. **Speed**: Unit tests should be fast (<100ms each)
4. **Coverage**: Aim for meaningful coverage, not just lines

### Running Tests

```bash
# Run all tests
pnpm test

# Run with coverage
pnpm test --coverage

# Run specific test file
pnpm test path/to/test.ts

# Run in watch mode
pnpm test --watch

# Update snapshots
pnpm test --updateSnapshot
```

---

## ✅ Definition of Done

- [ ] Jest configured and working
- [ ] All unit tests written and passing
- [ ] All integration tests written and passing
- [ ] All E2E tests written and passing
- [ ] Snapshot tests for outputs
- [ ] 80%+ code coverage achieved
- [ ] Coverage report generated
- [ ] CI/CD pipeline includes tests
- [ ] Test fixtures comprehensive
- [ ] Mock utilities complete
- [ ] Documentation for running tests
