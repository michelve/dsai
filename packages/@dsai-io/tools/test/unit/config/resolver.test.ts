/**
 * Unit tests for the configuration resolver module
 *
 * Tests cover:
 * - Resolving full config with defaults
 * - Section-specific resolution (global, tokens, icons, themes)
 * - Path resolution relative to configDir
 * - Override application
 * - Config merging
 * - createResolvedConfig helper
 */

import { resolve } from 'node:path';

import { resolveConfig, mergeConfigs, createResolvedConfig } from '../../../src/config/resolver.js';

import type { DsaiConfig } from '../../../src/config/types.js';

// ============================================================================
// Test Data
// ============================================================================

const testCwd = '/test/project';
const testConfigDir = '/test/project/config';

// ============================================================================
// Test Suites
// ============================================================================

describe('resolveConfig', () => {
  describe('basic resolution', () => {
    it('should return resolved config with empty input', () => {
      const result = resolveConfig();

      expect(result).toBeDefined();
      expect(result.global).toBeDefined();
      expect(result.tokens).toBeDefined();
      expect(result.icons).toBeDefined();
    });

    it('should set configDir from options', () => {
      const result = resolveConfig({}, { configDir: testConfigDir });

      expect(result.configDir).toBe(testConfigDir);
    });

    it('should use cwd when configDir not provided', () => {
      const result = resolveConfig({}, { cwd: testCwd });

      expect(result.configDir).toBe(testCwd);
    });

    it('should default to process.cwd()', () => {
      const result = resolveConfig();

      expect(result.configDir).toBe(process.cwd());
    });
  });

  describe('global config resolution', () => {
    it('should apply global defaults', () => {
      const result = resolveConfig();

      expect(result.global.debug).toBe(false);
      expect(result.global.logLevel).toBe('info');
      expect(result.global.cwd).toBe(process.cwd());
    });

    it('should override global defaults', () => {
      const result = resolveConfig({
        global: {
          debug: true,
          logLevel: 'debug',
        },
      });

      expect(result.global.debug).toBe(true);
      expect(result.global.logLevel).toBe('debug');
    });

    it('should resolve cwd relative to options.cwd', () => {
      const result = resolveConfig({ global: { cwd: './subdir' } }, { cwd: testCwd });

      expect(result.global.cwd).toBe(resolve(testCwd, './subdir'));
    });
  });

  describe('tokens config resolution', () => {
    it('should apply tokens defaults', () => {
      const result = resolveConfig();

      expect(result.tokens.prefix).toBeDefined();
      expect(result.tokens.baseFontSize).toBe(16);
      expect(result.tokens.outputReferences).toBe(true);
    });

    it('should override tokens defaults', () => {
      const result = resolveConfig({
        tokens: {
          prefix: '--custom-',
          baseFontSize: 14,
        },
      });

      expect(result.tokens.prefix).toBe('--custom-');
      expect(result.tokens.baseFontSize).toBe(14);
    });

    it('should resolve sourceDir relative to configDir', () => {
      const result = resolveConfig(
        { tokens: { sourceDir: './tokens' } },
        { configDir: testConfigDir }
      );

      expect(result.tokens.sourceDir).toBe(resolve(testConfigDir, './tokens'));
    });

    it('should resolve outputDir relative to configDir', () => {
      const result = resolveConfig(
        { tokens: { outputDir: './dist' } },
        { configDir: testConfigDir }
      );

      expect(result.tokens.outputDir).toBe(resolve(testConfigDir, './dist'));
    });

    it('should resolve additional SCSS directories', () => {
      const result = resolveConfig(
        { tokens: { additionalScssDirectories: ['./styles', './themes'] } },
        { configDir: testConfigDir }
      );

      expect(result.tokens.additionalScssDirectories).toHaveLength(2);
      expect(result.tokens.additionalScssDirectories[0]).toBe(resolve(testConfigDir, './styles'));
    });

    it('should resolve collection mapping paths', () => {
      const result = resolveConfig(
        {
          tokens: {
            collectionMapping: {
              colors: './collections/colors.json',
              spacing: './collections/spacing.json',
            },
          },
        },
        { configDir: testConfigDir }
      );

      expect(result.tokens.collectionMapping.colors).toBe(
        resolve(testConfigDir, './collections/colors.json')
      );
    });

    it('should preserve custom transforms', () => {
      const customTransform = {
        name: 'custom',
        type: 'value' as const,
        transform: () => 'transformed',
      };

      const result = resolveConfig({
        tokens: {
          transforms: [customTransform],
        },
      });

      expect(result.tokens.transforms).toHaveLength(1);
      expect(result.tokens.transforms[0].name).toBe('custom');
    });

    it('should preserve lifecycle hooks', () => {
      const onBuildStart = jest.fn();
      const onBuildComplete = jest.fn();

      const result = resolveConfig({
        tokens: {
          onBuildStart,
          onBuildComplete,
        },
      });

      expect(result.tokens.onBuildStart).toBe(onBuildStart);
      expect(result.tokens.onBuildComplete).toBe(onBuildComplete);
    });
  });

  describe('icons config resolution', () => {
    it('should apply icons defaults', () => {
      const result = resolveConfig();

      expect(result.icons.framework).toBe('react');
      expect(result.icons.typescript).toBe(true);
      expect(result.icons.optimize).toBe(true);
      expect(result.icons.prefix).toBe('Icon');
    });

    it('should override icons defaults', () => {
      const result = resolveConfig({
        icons: {
          framework: 'vue',
          typescript: false,
          prefix: 'AppIcon',
        },
      });

      expect(result.icons.framework).toBe('vue');
      expect(result.icons.typescript).toBe(false);
      expect(result.icons.prefix).toBe('AppIcon');
    });

    it('should resolve icons directories relative to configDir', () => {
      const result = resolveConfig(
        {
          icons: {
            sourceDir: './assets/icons',
            outputDir: './dist/icons',
          },
        },
        { configDir: testConfigDir }
      );

      expect(result.icons.sourceDir).toBe(resolve(testConfigDir, './assets/icons'));
      expect(result.icons.outputDir).toBe(resolve(testConfigDir, './dist/icons'));
    });
  });

  describe('themes config resolution', () => {
    it('should apply themes defaults', () => {
      const result = resolveConfig();

      expect(result.tokens.themes).toBeDefined();
      expect(result.tokens.themes.default).toBe('light');
      expect(result.tokens.themes.autoDetect).toBe(true);
    });

    it('should override themes defaults', () => {
      const result = resolveConfig({
        tokens: {
          themes: {
            default: 'dark',
            autoDetect: false,
            ignoreModes: ['internal', 'deprecated'],
          },
        },
      });

      expect(result.tokens.themes.default).toBe('dark');
      expect(result.tokens.themes.autoDetect).toBe(false);
      expect(result.tokens.themes.ignoreModes).toContain('internal');
    });
  });

  describe('overrides', () => {
    it('should apply overrides on top of user config', () => {
      const result = resolveConfig(
        {
          global: { debug: false },
          tokens: { prefix: '--user-' },
        },
        {
          overrides: {
            global: { debug: true },
            tokens: { prefix: '--override-' },
          },
        }
      );

      expect(result.global.debug).toBe(true);
      expect(result.tokens.prefix).toBe('--override-');
    });

    it('should only override provided fields', () => {
      const result = resolveConfig(
        {
          tokens: {
            prefix: '--user-',
            baseFontSize: 18,
          },
        },
        {
          overrides: {
            tokens: { prefix: '--override-' },
          },
        }
      );

      expect(result.tokens.prefix).toBe('--override-');
      expect(result.tokens.baseFontSize).toBe(18);
    });
  });
});

describe('mergeConfigs', () => {
  it('should merge empty configs', () => {
    const result = mergeConfigs({}, {});
    expect(result).toEqual({});
  });

  it('should merge tokens config', () => {
    const base: DsaiConfig = {
      tokens: { prefix: '--base-' },
    };
    const override: DsaiConfig = {
      tokens: { prefix: '--override-', baseFontSize: 18 },
    };

    const result = mergeConfigs(base, override);

    expect(result.tokens?.prefix).toBe('--override-');
    expect(result.tokens?.baseFontSize).toBe(18);
  });

  it('should merge multiple configs in order', () => {
    const first: DsaiConfig = { global: { debug: false } };
    const second: DsaiConfig = { global: { debug: true } };
    const third: DsaiConfig = { global: { logLevel: 'debug' } };

    const result = mergeConfigs(first, second, third);

    expect(result.global?.debug).toBe(true);
    expect(result.global?.logLevel).toBe('debug');
  });

  it('should not mutate input configs', () => {
    const base: DsaiConfig = { tokens: { prefix: '--base-' } };
    const override: DsaiConfig = { tokens: { prefix: '--override-' } };

    mergeConfigs(base, override);

    expect(base.tokens?.prefix).toBe('--base-');
  });
});

describe('createResolvedConfig', () => {
  it('should create full resolved config with defaults', () => {
    const result = createResolvedConfig();

    expect(result.global).toBeDefined();
    expect(result.tokens).toBeDefined();
    expect(result.icons).toBeDefined();
    expect(result.configDir).toBe(process.cwd());
  });

  it('should apply partial overrides', () => {
    const result = createResolvedConfig({
      configDir: testConfigDir,
      configPath: '/test/dsai.config.ts',
    });

    expect(result.configDir).toBe(testConfigDir);
    expect(result.configPath).toBe('/test/dsai.config.ts');
  });

  it('should allow partial global config', () => {
    const customGlobal = {
      cwd: testCwd,
      debug: true,
      logLevel: 'debug' as const,
    };

    const result = createResolvedConfig({ global: customGlobal });

    expect(result.global.debug).toBe(true);
    expect(result.global.cwd).toBe(testCwd);
  });
});
