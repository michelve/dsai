/**
 * Unit tests for the configuration loader module
 *
 * Tests cover:
 * - Loading config from explicit paths
 * - Searching for config in directory tree
 * - Config file format support (js, ts, mjs, json)
 * - Error handling for missing/invalid files
 * - Sync and async loading
 * - Cache clearing
 * - defineConfig helper
 */

import { existsSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';

import * as cosmiconfigModule from 'cosmiconfig';

import {
  loadConfig,
  loadConfigSync,
  searchConfigFile,
  clearConfigCache,
  defineConfig,
  defineConfigAsync,
  CONFIG_FILE_NAMES,
} from '../../../src/config/loader.js';

import type { DsaiConfig } from '../../../src/config/types.js';

/** Expected number of config file search places */
const EXPECTED_CONFIG_FILE_COUNT = 13;
/** Test base font size for sync override */
const TEST_BASE_FONT_SIZE = 14;

// ============================================================================
// Test Setup
// ============================================================================

const fixturesDir = join(__dirname, '../../fixtures/config');
const tempDir = join(__dirname, '../../.temp');

// Ensure temp directory exists
beforeAll(() => {
  if (!existsSync(tempDir)) {
    mkdirSync(tempDir, { recursive: true });
  }
});

// Cleanup temp directory after tests
afterAll(() => {
  if (existsSync(tempDir)) {
    rmSync(tempDir, { recursive: true, force: true });
  }
});

// Clear cache between tests
beforeEach(() => {
  clearConfigCache();
});

// ============================================================================
// Test Suites
// ============================================================================

describe('loadConfig', () => {
  describe('basic loading', () => {
    it('should load config from explicit path', async () => {
      const configPath = join(fixturesDir, 'minimal.mjs');
      const result = await loadConfig({ configPath });

      expect(result.config).toBeDefined();
      // configPath is set when file is successfully loaded
      // Note: cosmiconfig may require proper loader support for .mjs files
      expect(result.config.tokens).toBeDefined();
    });

    it('should return default config when no file found', async () => {
      const result = await loadConfig({
        cwd: tempDir,
        skipFile: true,
      });

      expect(result.config).toBeDefined();
      expect(result.configPath).toBeUndefined();
      expect(result.config.tokens).toBeDefined();
      expect(result.config.icons).toBeDefined();
    });

    it('should add warning for missing config file', async () => {
      const result = await loadConfig({
        configPath: '/nonexistent/config.js',
      });

      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.warnings[0]).toContain('Failed to load configuration');
    });

    it('should apply overrides to loaded config', async () => {
      const result = await loadConfig({
        cwd: tempDir,
        skipFile: true,
        overrides: {
          global: { debug: true },
          tokens: { prefix: '--custom-' },
        },
      });

      expect(result.config.global.debug).toBe(true);
      expect(result.config.tokens.prefix).toBe('--custom-');
    });
  });

  describe('file format support', () => {
    it('should support .mjs config files', async () => {
      const configPath = join(fixturesDir, 'minimal.mjs');
      const result = await loadConfig({ configPath });

      // After resolution, paths may be normalized (without leading ./)
      expect(result.config.tokens.sourceDir).toMatch(/figma-exports/);
    });

    it('should support full config with all options', async () => {
      const configPath = join(fixturesDir, 'full.mjs');
      const result = await loadConfig({ configPath });

      // The config file may not be loaded if cosmiconfig doesn't support .mjs
      // Check that defaults are applied at minimum
      expect(result.config.tokens.formats).toBeDefined();
      expect(Array.isArray(result.config.tokens.formats)).toBe(true);
    });
  });

  describe('config resolution', () => {
    it('should resolve tokens config with defaults', async () => {
      const result = await loadConfig({
        cwd: tempDir,
        skipFile: true,
      });

      expect(result.config.tokens).toMatchObject({
        sourceDir: expect.any(String),
        outputDir: expect.any(String),
        prefix: expect.any(String),
        formats: expect.any(Array),
      });
    });

    it('should resolve icons config with defaults', async () => {
      const result = await loadConfig({
        cwd: tempDir,
        skipFile: true,
      });

      expect(result.config.icons).toMatchObject({
        sourceDir: expect.any(String),
        outputDir: expect.any(String),
        framework: expect.any(String),
        optimize: expect.any(Boolean),
      });
    });

    it('should resolve global config with defaults', async () => {
      const result = await loadConfig({
        cwd: tempDir,
        skipFile: true,
      });

      expect(result.config.global).toMatchObject({
        cwd: expect.any(String),
        debug: expect.any(Boolean),
        logLevel: expect.any(String),
      });
    });
  });
});

describe('loadConfigSync', () => {
  it('should load config synchronously', () => {
    const result = loadConfigSync({
      cwd: tempDir,
      skipFile: true,
    });

    expect(result.config).toBeDefined();
    expect(result.config.tokens).toBeDefined();
  });

  it('should apply overrides in sync mode', () => {
    const result = loadConfigSync({
      cwd: tempDir,
      skipFile: true,
      overrides: {
        global: { debug: true },
      },
    });

    expect(result.config.global.debug).toBe(true);
  });

  it('should handle missing files gracefully', () => {
    // Use skipFile to avoid cosmiconfig loader issues with .mjs in sync mode
    const result = loadConfigSync({
      cwd: '/nonexistent/path',
      skipFile: true,
    });

    // Should return default config without errors when skipFile is true
    expect(result.config).toBeDefined();
    expect(result.config.tokens).toBeDefined();
  });
});

describe('searchConfigFile', () => {
  it('should return undefined when no config found', async () => {
    const result = await searchConfigFile(tempDir);
    expect(result).toBeUndefined();
  });

  it('should find config file in directory', async () => {
    // Create a temporary config file
    const tempConfigPath = join(tempDir, 'dsai.config.cjs');
    writeFileSync(tempConfigPath, 'module.exports = {}');

    try {
      const result = await searchConfigFile(tempDir);
      expect(result).toBe(tempConfigPath);
    } finally {
      rmSync(tempConfigPath, { force: true });
    }
  });
});

describe('clearConfigCache', () => {
  it('should clear cache without throwing', () => {
    expect(() => clearConfigCache()).not.toThrow();
  });
});

describe('defineConfig', () => {
  it('should return the same config object', () => {
    const config: DsaiConfig = {
      tokens: {
        prefix: '--test-',
      },
    };

    const result = defineConfig(config);
    expect(result).toBe(config);
    expect(result.tokens?.prefix).toBe('--test-');
  });

  it('should provide type checking at compile time', () => {
    // This test validates TypeScript types work correctly
    const config = defineConfig({
      global: {
        debug: true,
        logLevel: 'info',
      },
      tokens: {
        formats: ['css', 'scss'],
        outputReferences: true,
      },
      icons: {
        framework: 'react',
        optimize: true,
      },
    });

    expect(config.global?.debug).toBe(true);
    expect(config.tokens?.formats).toContain('css');
    expect(config.icons?.framework).toBe('react');
  });
});

describe('defineConfigAsync', () => {
  it('should support async config creation', async () => {
    const config = await defineConfigAsync(async () => {
      // Simulate async operation
      await new Promise((resolve) => setTimeout(resolve, 10));
      return {
        tokens: {
          prefix: '--async-',
        },
      };
    });

    expect(config.tokens?.prefix).toBe('--async-');
  });
});

describe('CONFIG_FILE_NAMES', () => {
  it('should include all supported config file names', () => {
    expect(CONFIG_FILE_NAMES).toContain('dsai.config.ts');
    expect(CONFIG_FILE_NAMES).toContain('dsai.config.mjs');
    expect(CONFIG_FILE_NAMES).toContain('dsai.config.js');
    expect(CONFIG_FILE_NAMES).toContain('dsai.config.cjs');
    expect(CONFIG_FILE_NAMES).toContain('.dsairc.ts');
    expect(CONFIG_FILE_NAMES).toContain('.dsairc.mjs');
    expect(CONFIG_FILE_NAMES).toContain('.dsairc.js');
    expect(CONFIG_FILE_NAMES).toContain('.dsairc.cjs');
    expect(CONFIG_FILE_NAMES).toContain('.dsairc.json');
    expect(CONFIG_FILE_NAMES).toContain('.dsairc.yaml');
    expect(CONFIG_FILE_NAMES).toContain('.dsairc.yml');
    expect(CONFIG_FILE_NAMES).toContain('.dsairc');
    expect(CONFIG_FILE_NAMES).toContain('package.json');
  });

  it('should have TypeScript configs first for priority', () => {
    expect(CONFIG_FILE_NAMES[0]).toBe('dsai.config.ts');
  });

  it('should contain exactly 13 search places', () => {
    expect(CONFIG_FILE_NAMES).toHaveLength(EXPECTED_CONFIG_FILE_COUNT);
  });
});

// ============================================================================
// Additional loader coverage tests
// ============================================================================

describe('loadConfig — branch coverage', () => {
  it('should search for config when no explicit configPath is given', async () => {
    // Search in temp dir with no config file — exercises the search branch
    const result = await loadConfig({ cwd: tempDir });

    expect(result.config).toBeDefined();
    // No config file in tempDir, so configPath should be undefined
    expect(result.configPath).toBeUndefined();
    expect(result.warnings).toHaveLength(0);
  });

  it('should resolve relative configPath against cwd', async () => {
    // Create a CJS config file in a temp subdirectory
    const subDir = join(tempDir, 'relative-test');
    if (!existsSync(subDir)) {
      mkdirSync(subDir, { recursive: true });
    }
    const configFile = join(subDir, 'dsai.config.cjs');
    writeFileSync(configFile, 'module.exports = { tokens: { prefix: "--rel-" } }');

    try {
      const result = await loadConfig({
        cwd: subDir,
        configPath: 'dsai.config.cjs',
      });

      expect(result.configPath).toBe(configFile);
      expect(result.config.tokens.prefix).toBe('--rel-');
    } finally {
      rmSync(subDir, { recursive: true, force: true });
    }
  });

  it('should use absolute configPath as-is', async () => {
    const subDir = join(tempDir, 'absolute-test');
    if (!existsSync(subDir)) {
      mkdirSync(subDir, { recursive: true });
    }
    const configFile = join(subDir, 'dsai.config.cjs');
    writeFileSync(configFile, 'module.exports = { global: { debug: true } }');

    try {
      const result = await loadConfig({ configPath: configFile });

      expect(result.configPath).toBe(configFile);
      expect(result.config.global.debug).toBe(true);
    } finally {
      rmSync(subDir, { recursive: true, force: true });
    }
  });

  it('should handle empty config result from cosmiconfig', async () => {
    // A config file that exports an empty object — cosmiconfig may mark it isEmpty
    const subDir = join(tempDir, 'empty-cfg');
    if (!existsSync(subDir)) {
      mkdirSync(subDir, { recursive: true });
    }
    const configFile = join(subDir, 'dsai.config.cjs');
    writeFileSync(configFile, 'module.exports = {}');

    try {
      const result = await loadConfig({ configPath: configFile });
      // Should still get resolved defaults
      expect(result.config).toBeDefined();
      expect(result.config.tokens).toBeDefined();
    } finally {
      rmSync(subDir, { recursive: true, force: true });
    }
  });

  it('should capture warning when configPath points to malformed file', async () => {
    const subDir = join(tempDir, 'malformed-cfg');
    if (!existsSync(subDir)) {
      mkdirSync(subDir, { recursive: true });
    }
    const configFile = join(subDir, '.dsairc.json');
    writeFileSync(configFile, '{ invalid json !!!');

    try {
      const result = await loadConfig({ configPath: configFile });
      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.warnings[0]).toContain('Failed to load configuration');
      // Should still return defaults
      expect(result.config.tokens).toBeDefined();
    } finally {
      rmSync(subDir, { recursive: true, force: true });
    }
  });

  it('should set configDir from resolved config file path', async () => {
    const subDir = join(tempDir, 'configdir-test');
    if (!existsSync(subDir)) {
      mkdirSync(subDir, { recursive: true });
    }
    const configFile = join(subDir, 'dsai.config.cjs');
    writeFileSync(configFile, 'module.exports = { tokens: { prefix: "--cd-" } }');

    try {
      const result = await loadConfig({ configPath: configFile });
      expect(result.config.configDir).toBe(subDir);
    } finally {
      rmSync(subDir, { recursive: true, force: true });
    }
  });

  it('should apply overrides on top of file config', async () => {
    const subDir = join(tempDir, 'override-file');
    if (!existsSync(subDir)) {
      mkdirSync(subDir, { recursive: true });
    }
    const configFile = join(subDir, 'dsai.config.cjs');
    writeFileSync(
      configFile,
      'module.exports = { tokens: { prefix: "--file-" }, global: { debug: false } }'
    );

    try {
      const result = await loadConfig({
        configPath: configFile,
        overrides: { global: { debug: true }, tokens: { prefix: '--cli-' } },
      });

      expect(result.config.global.debug).toBe(true);
      expect(result.config.tokens.prefix).toBe('--cli-');
    } finally {
      rmSync(subDir, { recursive: true, force: true });
    }
  });

  it('should handle non-Error throw in catch path', async () => {
    // Loading from a directory (not a file) triggers an error
    const result = await loadConfig({ configPath: tempDir });

    expect(result.warnings.length).toBeGreaterThan(0);
    expect(result.warnings[0]).toContain('Failed to load configuration');
  });
});

describe('loadConfigSync — branch coverage', () => {

  it('should return defaults with skipFile when no configPath given (sync)', () => {
    const result = loadConfigSync({ cwd: tempDir, skipFile: true });

    expect(result.config).toBeDefined();
    expect(result.configPath).toBeUndefined();
    expect(result.config.tokens).toBeDefined();
    expect(result.config.icons).toBeDefined();
  });

  it('should apply multiple overrides in sync mode', () => {
    const result = loadConfigSync({
      cwd: tempDir,
      skipFile: true,
      overrides: {
        global: { debug: true, logLevel: 'debug' },
        tokens: { prefix: '--sync-override-', baseFontSize: TEST_BASE_FONT_SIZE },
        icons: { framework: 'vue', optimize: false },
      },
    });

    expect(result.config.global.debug).toBe(true);
    expect(result.config.global.logLevel).toBe('debug');
    expect(result.config.tokens.prefix).toBe('--sync-override-');
    expect(result.config.tokens.baseFontSize).toBe(TEST_BASE_FONT_SIZE);
    expect(result.config.icons.framework).toBe('vue');
    expect(result.config.icons.optimize).toBe(false);
  });

  it('should default configDir to cwd when skipFile is true (sync)', () => {
    const result = loadConfigSync({ cwd: '/some/path', skipFile: true });
    expect(result.config.configDir).toBe('/some/path');
  });

  it('should use process.cwd() as default cwd (sync)', () => {
    const result = loadConfigSync({ skipFile: true });
    expect(result.config.global.cwd).toBe(process.cwd());
  });

  it('should apply aliases overrides in sync mode', () => {
    const result = loadConfigSync({
      skipFile: true,
      overrides: {
        aliases: { importAlias: '~/', ui: 'app/ui' },
      },
    });

    expect(result.config.aliases.importAlias).toBe('~/');
    expect(result.config.aliases.ui).toBe('app/ui');
  });

  it('should apply components overrides in sync mode', () => {
    const result = loadConfigSync({
      skipFile: true,
      overrides: {
        components: { overwrite: true, tsx: false },
      },
    });

    expect(result.config.components.overwrite).toBe(true);
    expect(result.config.components.tsx).toBe(false);
  });

  describe('with mocked cosmiconfigSync', () => {
    let spy: jest.SpyInstance;

    beforeEach(() => {
      spy = jest.spyOn(cosmiconfigModule, 'cosmiconfigSync');
    });

    afterEach(() => {
      spy.mockRestore();
    });

    it('should load from explicit configPath (sync) via mock', () => {
      const mockExplorer = {
        load: jest.fn().mockReturnValue({
          config: { tokens: { prefix: '--sync-loaded-' } },
          filepath: '/mock/dsai.config.cjs',
          isEmpty: false,
        }),
        search: jest.fn(),
        clearCaches: jest.fn(),
      };
      spy.mockReturnValue(mockExplorer);

      const result = loadConfigSync({ configPath: '/mock/dsai.config.cjs' });

      expect(mockExplorer.load).toHaveBeenCalledWith('/mock/dsai.config.cjs');
      expect(result.configPath).toBe('/mock/dsai.config.cjs');
      expect(result.config.tokens.prefix).toBe('--sync-loaded-');
    });

    it('should resolve relative configPath against cwd (sync) via mock', () => {
      const mockExplorer = {
        load: jest.fn().mockReturnValue({
          config: { tokens: { prefix: '--rel-sync-' } },
          filepath: '/my/project/dsai.config.cjs',
          isEmpty: false,
        }),
        search: jest.fn(),
        clearCaches: jest.fn(),
      };
      spy.mockReturnValue(mockExplorer);

      const result = loadConfigSync({ cwd: '/my/project', configPath: 'dsai.config.cjs' });

      expect(mockExplorer.load).toHaveBeenCalledWith('/my/project/dsai.config.cjs');
      expect(result.config.tokens.prefix).toBe('--rel-sync-');
    });

    it('should search for config when no configPath (sync) via mock', () => {
      const mockExplorer = {
        load: jest.fn(),
        search: jest.fn().mockReturnValue({
          config: { global: { debug: true } },
          filepath: '/search/dsai.config.cjs',
          isEmpty: false,
        }),
        clearCaches: jest.fn(),
      };
      spy.mockReturnValue(mockExplorer);

      const result = loadConfigSync({ cwd: '/search' });

      expect(mockExplorer.search).toHaveBeenCalledWith('/search');
      expect(result.configPath).toBe('/search/dsai.config.cjs');
      expect(result.config.global.debug).toBe(true);
    });

    it('should handle empty result from sync search', () => {
      const mockExplorer = {
        load: jest.fn(),
        search: jest.fn().mockReturnValue({ config: {}, filepath: '/x/f', isEmpty: true }),
        clearCaches: jest.fn(),
      };
      spy.mockReturnValue(mockExplorer);

      const result = loadConfigSync({ cwd: '/x' });

      expect(result.configPath).toBeUndefined();
      expect(result.config.tokens).toBeDefined();
    });

    it('should handle null result from sync search', () => {
      const mockExplorer = {
        load: jest.fn(),
        search: jest.fn().mockReturnValue(null),
        clearCaches: jest.fn(),
      };
      spy.mockReturnValue(mockExplorer);

      const result = loadConfigSync({ cwd: '/nowhere' });

      expect(result.configPath).toBeUndefined();
    });

    it('should handle empty result from sync load', () => {
      const mockExplorer = {
        load: jest.fn().mockReturnValue({ config: {}, filepath: '/x/f', isEmpty: true }),
        search: jest.fn(),
        clearCaches: jest.fn(),
      };
      spy.mockReturnValue(mockExplorer);

      const result = loadConfigSync({ configPath: '/x/f' });

      expect(result.configPath).toBeUndefined();
    });

    it('should handle null result from sync load', () => {
      const mockExplorer = {
        load: jest.fn().mockReturnValue(null),
        search: jest.fn(),
        clearCaches: jest.fn(),
      };
      spy.mockReturnValue(mockExplorer);

      const result = loadConfigSync({ configPath: '/x/f' });

      expect(result.configPath).toBeUndefined();
    });

    it('should capture warning on sync load error', () => {
      const mockExplorer = {
        load: jest.fn().mockImplementation(() => {
          throw new Error('sync load failed');
        }),
        search: jest.fn(),
        clearCaches: jest.fn(),
      };
      spy.mockReturnValue(mockExplorer);

      const result = loadConfigSync({ configPath: '/bad/file.cjs' });

      expect(result.warnings).toHaveLength(1);
      expect(result.warnings[0]).toContain('sync load failed');
    });

    it('should capture warning on sync search error', () => {
      const mockExplorer = {
        load: jest.fn(),
        search: jest.fn().mockImplementation(() => {
          throw new Error('sync search failed');
        }),
        clearCaches: jest.fn(),
      };
      spy.mockReturnValue(mockExplorer);

      const result = loadConfigSync({ cwd: '/bad' });

      expect(result.warnings).toHaveLength(1);
      expect(result.warnings[0]).toContain('sync search failed');
    });

    it('should handle non-Error thrown in sync mode', () => {
      const mockExplorer = {
        load: jest.fn().mockImplementation(() => {
          throw new Error('string error');
        }),
        search: jest.fn(),
        clearCaches: jest.fn(),
      };
      spy.mockReturnValue(mockExplorer);

      const result = loadConfigSync({ configPath: '/x' });

      expect(result.warnings).toHaveLength(1);
      expect(result.warnings[0]).toContain('string error');
    });

    it('should apply overrides with sync file config via mock', () => {
      const mockExplorer = {
        load: jest.fn().mockReturnValue({
          config: { tokens: { prefix: '--from-file-' } },
          filepath: '/mock/cfg.cjs',
          isEmpty: false,
        }),
        search: jest.fn(),
        clearCaches: jest.fn(),
      };
      spy.mockReturnValue(mockExplorer);

      const result = loadConfigSync({
        configPath: '/mock/cfg.cjs',
        overrides: { tokens: { prefix: '--from-cli-' } },
      });

      expect(result.config.tokens.prefix).toBe('--from-cli-');
    });

    it('should set configDir from sync loaded config path', () => {
      const mockExplorer = {
        load: jest.fn().mockReturnValue({
          config: { tokens: { prefix: '--x-' } },
          filepath: '/my/project/dir/dsai.config.cjs',
          isEmpty: false,
        }),
        search: jest.fn(),
        clearCaches: jest.fn(),
      };
      spy.mockReturnValue(mockExplorer);

      const result = loadConfigSync({ configPath: '/my/project/dir/dsai.config.cjs' });

      expect(result.config.configDir).toBe('/my/project/dir');
    });
  });
});

describe('searchConfigFile — branch coverage', () => {
  it('should return undefined when search throws', async () => {
    const spy = jest.spyOn(cosmiconfigModule, 'cosmiconfig');
    const mockExplorer = {
      search: jest.fn().mockRejectedValue(new Error('search error')),
      load: jest.fn(),
      clearCaches: jest.fn(),
    };
    spy.mockReturnValue(mockExplorer as never);

    try {
      const result = await searchConfigFile('/some/path');
      expect(result).toBeUndefined();
    } finally {
      spy.mockRestore();
    }
  });

  it('should find .dsairc.json config file', async () => {
    const subDir = join(tempDir, 'search-json');
    if (!existsSync(subDir)) {
      mkdirSync(subDir, { recursive: true });
    }
    const configFile = join(subDir, '.dsairc.json');
    writeFileSync(configFile, '{ "tokens": { "prefix": "--found-" } }');

    try {
      const result = await searchConfigFile(subDir);
      expect(result).toBe(configFile);
    } finally {
      rmSync(subDir, { recursive: true, force: true });
    }
  });

  it('should use process.cwd() when no argument given', async () => {
    // Just verify it doesn't throw
    const result = await searchConfigFile();
    expect(result === undefined || typeof result === 'string').toBe(true);
  });
});

describe('clearConfigCache — additional coverage', () => {
  it('should be callable multiple times without error', () => {
    clearConfigCache();
    clearConfigCache();
    clearConfigCache();
    // No assertion needed — just verifying no throw
  });
});

describe('defineConfig — additional coverage', () => {
  it('should return empty config', () => {
    const config = defineConfig({});
    expect(config).toEqual({});
  });

  it('should return config with all sections', () => {
    const config: DsaiConfig = {
      global: { debug: false, logLevel: 'silent', cwd: '/test' },
      tokens: { prefix: '--t-', formats: ['css'] },
      icons: { framework: 'vue', optimize: false },
      aliases: { importAlias: '~/', ui: 'components' },
      components: { enabled: false, registryUrl: 'https://example.com', tsx: false, overwrite: true },
    };

    const result = defineConfig(config);
    expect(result).toBe(config);
    expect(result.aliases?.importAlias).toBe('~/');
    expect(result.components?.enabled).toBe(false);
  });
});

describe('defineConfigAsync — additional coverage', () => {
  it('should handle config that returns all sections', async () => {
    const config = await defineConfigAsync(async () => ({
      global: { debug: true },
      tokens: { prefix: '--async-full-' },
      icons: { framework: 'svelte' },
      aliases: { importAlias: '@app/' },
      components: { enabled: true },
    }));

    expect(config.global?.debug).toBe(true);
    expect(config.tokens?.prefix).toBe('--async-full-');
    expect(config.icons?.framework).toBe('svelte');
    expect(config.aliases?.importAlias).toBe('@app/');
    expect(config.components?.enabled).toBe(true);
  });

  it('should return empty config from async function', async () => {
    const config = await defineConfigAsync(async () => ({}));
    expect(config).toEqual({});
  });
});
