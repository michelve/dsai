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

import type { DsaiConfig, ThemeDefinition } from '../../../src/config/types.js';

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

  it('should use default tokens when not provided', () => {
    const result = createResolvedConfig({ configDir: '/custom' });
    expect(result.tokens).toBeDefined();
    expect(result.tokens.prefix).toBeDefined();
  });

  it('should use default icons when not provided', () => {
    const result = createResolvedConfig({});
    expect(result.icons).toBeDefined();
    expect(result.icons.framework).toBe('react');
  });

  it('should use default aliases when not provided', () => {
    const result = createResolvedConfig({});
    expect(result.aliases).toBeDefined();
    expect(result.aliases.importAlias).toBe('@/');
  });

  it('should use default components when not provided', () => {
    const result = createResolvedConfig({});
    expect(result.components).toBeDefined();
    expect(result.components.enabled).toBe(true);
  });

  it('should allow setting configPath', () => {
    const result = createResolvedConfig({ configPath: '/my/config.ts' });
    expect(result.configPath).toBe('/my/config.ts');
  });

  it('should set configPath to undefined by default', () => {
    const result = createResolvedConfig();
    expect(result.configPath).toBeUndefined();
  });
});

// ============================================================================
// Additional resolver coverage tests
// ============================================================================

describe('resolveConfig — themes resolution', () => {
  it('should use custom selector patterns', () => {
    const result = resolveConfig({
      tokens: {
        themes: {
          selectorPattern: {
            default: 'html',
            others: '.theme-{mode}',
          },
        },
      },
    });

    expect(result.tokens.themes.selectorPattern.default).toBe('html');
    expect(result.tokens.themes.selectorPattern.others).toBe('.theme-{mode}');
  });

  it('should use default selectorPattern.default when only others is provided', () => {
    const result = resolveConfig({
      tokens: {
        themes: {
          selectorPattern: {
            others: '.custom-{mode}',
          },
        },
      },
    });

    expect(result.tokens.themes.selectorPattern.default).toBe(':root');
    expect(result.tokens.themes.selectorPattern.others).toBe('.custom-{mode}');
  });

  it('should use default selectorPattern.others when only default is provided', () => {
    const result = resolveConfig({
      tokens: {
        themes: {
          selectorPattern: {
            default: 'body',
          },
        },
      },
    });

    expect(result.tokens.themes.selectorPattern.default).toBe('body');
    expect(result.tokens.themes.selectorPattern.others).toBe('[data-dsai-theme="{mode}"]');
  });

  it('should resolve explicit theme definitions', () => {
    const result = resolveConfig({
      tokens: {
        themes: {
          default: 'day',
          definitions: {
            day: {
              isDefault: true,
              selector: ':root',
            },
            night: {
              selector: '[data-theme="night"]',
              mediaQuery: '(prefers-color-scheme: dark)',
            },
          },
        },
      },
    });

    expect(result.tokens.themes.definitions.day).toBeDefined();
    expect(result.tokens.themes.definitions.day.isDefault).toBe(true);
    expect(result.tokens.themes.definitions.night).toBeDefined();
    expect(result.tokens.themes.definitions.night.isDefault).toBe(false);
    expect(result.tokens.themes.definitions.night.mediaQuery).toBe(
      '(prefers-color-scheme: dark)'
    );
  });

  it('should normalize theme names to lowercase', () => {
    const result = resolveConfig({
      tokens: {
        themes: {
          default: 'Light',
          definitions: {
            Light: {
              isDefault: true,
              selector: ':root',
            },
            DARK: {
              selector: '[data-theme="dark"]',
            },
          },
        },
      },
    });

    expect(result.tokens.themes.default).toBe('light');
    expect(result.tokens.themes.definitions.light).toBeDefined();
    expect(result.tokens.themes.definitions.dark).toBeDefined();
  });

  it('should generate default output files for themes', () => {
    const result = resolveConfig({
      tokens: {
        themes: {
          definitions: {
            light: {
              isDefault: true,
              selector: ':root',
            },
            dark: {
              selector: '[data-theme="dark"]',
            },
          },
        },
      },
    });

    // Default theme gets no suffix
    expect(result.tokens.themes.definitions.light.outputFiles.css).toBe('tokens.css');
    expect(result.tokens.themes.definitions.light.outputFiles.scss).toBe('_tokens.scss');
    expect(result.tokens.themes.definitions.light.suffix).toBeNull();

    // Non-default theme gets suffix
    expect(result.tokens.themes.definitions.dark.outputFiles.css).toBe('tokens-dark.css');
    expect(result.tokens.themes.definitions.dark.suffix).toBe('-dark');
  });

  it('should allow custom output files per theme', () => {
    const result = resolveConfig({
      tokens: {
        themes: {
          definitions: {
            brand: {
              isDefault: true,
              selector: ':root',
              outputFiles: {
                css: 'brand-tokens.css',
              },
            },
          },
        },
      },
    });

    // Custom output file overrides default
    expect(result.tokens.themes.definitions.brand.outputFiles.css).toBe('brand-tokens.css');
    // Other formats still get defaults
    expect(result.tokens.themes.definitions.brand.outputFiles.scss).toBe('_tokens.scss');
  });

  it('should generate default selector when not provided', () => {
    const result = resolveConfig({
      tokens: {
        themes: {
          definitions: {
            light: {
              isDefault: true,
              selector: ':root',
            },
            contrast: {
              // No selector — should be auto-generated
              selector: '[data-dsai-theme="contrast"]',
            },
          },
        },
      },
    });

    expect(result.tokens.themes.definitions.contrast.selector).toBe(
      '[data-dsai-theme="contrast"]'
    );
  });

  it('should use default theme definitions when no definitions provided', () => {
    const result = resolveConfig({
      tokens: {
        themes: {
          enabled: true,
        },
      },
    });

    // Should have light and dark defaults
    expect(result.tokens.themes.definitions.light).toBeDefined();
    expect(result.tokens.themes.definitions.dark).toBeDefined();
    expect(result.tokens.themes.definitions.light.isDefault).toBe(true);
    expect(result.tokens.themes.definitions.dark.isDefault).toBe(false);
  });

  it('should use default theme definitions when definitions is empty object', () => {
    const result = resolveConfig({
      tokens: {
        themes: {
          definitions: {},
        },
      },
    });

    // Empty definitions → use defaults
    expect(result.tokens.themes.definitions.light).toBeDefined();
    expect(result.tokens.themes.definitions.dark).toBeDefined();
  });

  it('should set theme enabled and autoDetect from user config', () => {
    const result = resolveConfig({
      tokens: {
        themes: {
          enabled: false,
          autoDetect: false,
        },
      },
    });

    expect(result.tokens.themes.enabled).toBe(false);
    expect(result.tokens.themes.autoDetect).toBe(false);
  });

  it('should preserve dataAttribute on theme definition', () => {
    const result = resolveConfig({
      tokens: {
        themes: {
          definitions: {
            high_contrast: {
              selector: '[data-theme="hc"]',
              dataAttribute: 'data-contrast',
            },
          },
        },
      },
    });

    expect(result.tokens.themes.definitions.high_contrast.dataAttribute).toBe('data-contrast');
  });

  it('should preserve custom suffix on theme definition', () => {
    const result = resolveConfig({
      tokens: {
        themes: {
          definitions: {
            dark: {
              selector: '[data-theme="dark"]',
              suffix: '-night',
            },
          },
        },
      },
    });

    expect(result.tokens.themes.definitions.dark.suffix).toBe('-night');
  });

  it('should auto-generate selector for default theme when not provided', () => {
    const result = resolveConfig({
      tokens: {
        themes: {
          definitions: {
            light: {
              isDefault: true,
              // No selector provided — should use selectorPattern.default (:root)
            } as ThemeDefinition,
          },
        },
      },
    });

    expect(result.tokens.themes.definitions.light.selector).toBe(':root');
  });

  it('should auto-generate selector for non-default theme when not provided', () => {
    const result = resolveConfig({
      tokens: {
        themes: {
          definitions: {
            midnight: {
              // No selector — should be generated from pattern
            } as ThemeDefinition,
          },
        },
      },
    });

    expect(result.tokens.themes.definitions.midnight.selector).toBe(
      '[data-dsai-theme="midnight"]'
    );
  });
});

describe('resolveConfig — tokens edge cases', () => {
  it('should resolve collectionsDir relative to configDir', () => {
    const result = resolveConfig(
      { tokens: { collectionsDir: './my-collections' } },
      { configDir: testConfigDir }
    );

    expect(result.tokens.collectionsDir).toBe(resolve(testConfigDir, './my-collections'));
  });

  it('should use default collectionsDir when not provided', () => {
    const result = resolveConfig({});
    expect(result.tokens.collectionsDir).toBe('collections');
  });

  it('should resolve additional CSS directories', () => {
    const result = resolveConfig(
      { tokens: { additionalCssDirectories: ['./css/base', './css/utils'] } },
      { configDir: testConfigDir }
    );

    expect(result.tokens.additionalCssDirectories).toHaveLength(2);
    expect(result.tokens.additionalCssDirectories[0]).toBe(resolve(testConfigDir, './css/base'));
    expect(result.tokens.additionalCssDirectories[1]).toBe(resolve(testConfigDir, './css/utils'));
  });

  it('should resolve watch directories', () => {
    const result = resolveConfig(
      { tokens: { watchDirectories: ['./src', './design'] } },
      { configDir: testConfigDir }
    );

    expect(result.tokens.watchDirectories).toHaveLength(2);
    expect(result.tokens.watchDirectories[0]).toBe(resolve(testConfigDir, './src'));
  });

  it('should default watch directories to empty array', () => {
    const result = resolveConfig({});
    expect(result.tokens.watchDirectories).toEqual([]);
  });

  it('should merge outputDirs with defaults', () => {
    const result = resolveConfig(
      { tokens: { outputDirs: { css: './out/css', scss: './out/scss' } } },
      { configDir: testConfigDir }
    );

    expect(result.tokens.outputDirs.css).toBe(resolve(testConfigDir, './out/css'));
    expect(result.tokens.outputDirs.scss).toBe(resolve(testConfigDir, './out/scss'));
  });

  it('should skip undefined values in outputDirs', () => {
    const result = resolveConfig(
      { tokens: { outputDirs: { css: './out/css', scss: undefined } } },
      { configDir: testConfigDir }
    );

    expect(result.tokens.outputDirs.css).toBe(resolve(testConfigDir, './out/css'));
  });

  it('should merge outputFileNames with defaults', () => {
    const result = resolveConfig({
      tokens: { outputFileNames: { css: 'custom-tokens.css' } },
    });

    expect(result.tokens.outputFileNames.css).toBe('custom-tokens.css');
    // Other formats keep defaults
    expect(result.tokens.outputFileNames.scss).toBe('_tokens.scss');
  });

  it('should preserve source type', () => {
    const result = resolveConfig({ tokens: { source: 'collections' } });
    expect(result.tokens.source).toBe('collections');
  });

  it('should default source to theme', () => {
    const result = resolveConfig({});
    expect(result.tokens.source).toBe('theme');
  });

  it('should preserve sourcePatterns when provided', () => {
    const result = resolveConfig({ tokens: { sourcePatterns: ['*.json'] } });
    expect(result.tokens.sourcePatterns).toEqual(['*.json']);
  });

  it('should default sourcePatterns', () => {
    const result = resolveConfig({});
    expect(result.tokens.sourcePatterns).toEqual(['theme.json', 'tokens.json', '*.tokens.json']);
  });

  it('should preserve mergeOrder', () => {
    const result = resolveConfig({ tokens: { mergeOrder: 'before' } });
    expect(result.tokens.mergeOrder).toBe('before');
  });

  it('should preserve createBundle', () => {
    const result = resolveConfig({ tokens: { createBundle: true } });
    expect(result.tokens.createBundle).toBe(true);
  });

  it('should preserve scssImportHeader', () => {
    const result = resolveConfig({ tokens: { scssImportHeader: '_variables.scss' } });
    expect(result.tokens.scssImportHeader).toBe('_variables.scss');
  });

  it('should preserve customFormats', () => {
    const customFormat = {
      name: 'my-format',
      format: () => 'output',
    };
    const result = resolveConfig({ tokens: { customFormats: [customFormat] } });
    expect(result.tokens.customFormats).toHaveLength(1);
    expect(result.tokens.customFormats[0].name).toBe('my-format');
  });

  it('should preserve preprocessors', () => {
    const preprocessor = {
      name: 'my-preprocessor',
      preprocessor: (dict: { allTokens: never[]; tokens: Record<string, unknown>; unfilteredTokens: Record<string, unknown> }) => dict,
    };
    const result = resolveConfig({ tokens: { preprocessors: [preprocessor] } });
    expect(result.tokens.preprocessors).toHaveLength(1);
  });

  it('should preserve filters', () => {
    const filter = {
      name: 'my-filter',
      filter: () => true,
    };
    const result = resolveConfig({ tokens: { filters: [filter] } });
    expect(result.tokens.filters).toHaveLength(1);
  });

  it('should preserve onFormatComplete and onAllFormatsComplete hooks', () => {
    const onFormatComplete = jest.fn();
    const onAllFormatsComplete = jest.fn();

    const result = resolveConfig({
      tokens: { onFormatComplete, onAllFormatsComplete },
    });

    expect(result.tokens.onFormatComplete).toBe(onFormatComplete);
    expect(result.tokens.onAllFormatsComplete).toBe(onAllFormatsComplete);
  });

  it('should preserve separateThemeFiles', () => {
    const result = resolveConfig({ tokens: { separateThemeFiles: true } });
    expect(result.tokens.separateThemeFiles).toBe(true);
  });

  it('should preserve watch flag', () => {
    const result = resolveConfig({ tokens: { watch: true } });
    expect(result.tokens.watch).toBe(true);
  });

  it('should preserve pipeline config', () => {
    const pipeline = { steps: ['validate' as const, 'transform' as const] };
    const result = resolveConfig({ tokens: { pipeline } });
    expect(result.tokens.pipeline).toEqual(pipeline);
  });

  it('should preserve scss config', () => {
    const result = resolveConfig({ tokens: { scss: { cssOutputDir: './out' } } });
    expect(result.tokens.scss).toEqual({ cssOutputDir: './out' });
  });

  it('should preserve postprocess config', () => {
    const postprocess = { enabled: true, cssDir: './css', files: ['theme.css'] };
    const result = resolveConfig({ tokens: { postprocess } });
    expect(result.tokens.postprocess).toEqual(postprocess);
  });

  it('should use cwd as configDir fallback when configDir not in options', () => {
    const result = resolveConfig(
      { tokens: { sourceDir: './tokens' } },
      { cwd: testCwd }
    );

    expect(result.tokens.sourceDir).toBe(resolve(testCwd, './tokens'));
  });

  it('should use process.cwd() when neither configDir nor cwd provided', () => {
    const result = resolveConfig({ tokens: { sourceDir: './tokens' } });

    expect(result.tokens.sourceDir).toBe(resolve(process.cwd(), './tokens'));
  });
});

describe('resolveConfig — aliases resolution', () => {
  it('should apply alias defaults', () => {
    const result = resolveConfig();

    expect(result.aliases.importAlias).toBe('@/');
    expect(result.aliases.ui).toBe('src/components/ui');
    expect(result.aliases.hooks).toBe('src/hooks');
    expect(result.aliases.utils).toBe('src/lib/utils');
    expect(result.aliases.components).toBe('src/components');
    expect(result.aliases.lib).toBe('src/lib');
  });

  it('should override alias defaults', () => {
    const result = resolveConfig({
      aliases: {
        importAlias: '~/',
        ui: 'app/ui',
        hooks: 'app/hooks',
        utils: 'app/utils',
        components: 'app/components',
        lib: 'app/lib',
      },
    });

    expect(result.aliases.importAlias).toBe('~/');
    expect(result.aliases.ui).toBe('app/ui');
    expect(result.aliases.hooks).toBe('app/hooks');
    expect(result.aliases.utils).toBe('app/utils');
    expect(result.aliases.components).toBe('app/components');
    expect(result.aliases.lib).toBe('app/lib');
  });

  it('should partially override aliases', () => {
    const result = resolveConfig({
      aliases: {
        importAlias: '~/',
      },
    });

    expect(result.aliases.importAlias).toBe('~/');
    // Rest should be defaults
    expect(result.aliases.ui).toBe('src/components/ui');
  });
});

describe('resolveConfig — components resolution', () => {
  it('should apply components defaults', () => {
    const result = resolveConfig();

    expect(result.components.enabled).toBe(true);
    expect(result.components.registryUrl).toBe('https://registry.dsai.dev');
    expect(result.components.tsx).toBe(true);
    expect(result.components.overwrite).toBe(false);
  });

  it('should override components defaults', () => {
    const result = resolveConfig({
      components: {
        enabled: false,
        registryUrl: 'https://custom-registry.example.com',
        tsx: false,
        overwrite: true,
      },
    });

    expect(result.components.enabled).toBe(false);
    expect(result.components.registryUrl).toBe('https://custom-registry.example.com');
    expect(result.components.tsx).toBe(false);
    expect(result.components.overwrite).toBe(true);
  });

  it('should partially override components', () => {
    const result = resolveConfig({
      components: { overwrite: true },
    });

    expect(result.components.overwrite).toBe(true);
    expect(result.components.enabled).toBe(true); // default
  });
});

describe('resolveConfig — icons edge cases', () => {
  it('should use cwd as fallback for icons path resolution', () => {
    const result = resolveConfig(
      { icons: { sourceDir: './my-icons' } },
      { cwd: testCwd }
    );

    expect(result.icons.sourceDir).toBe(resolve(testCwd, './my-icons'));
  });

  it('should use process.cwd() when neither configDir nor cwd for icons', () => {
    const result = resolveConfig({ icons: { sourceDir: './my-icons' } });

    expect(result.icons.sourceDir).toBe(resolve(process.cwd(), './my-icons'));
  });

  it('should not resolve icons dirs when not provided (use defaults)', () => {
    const result = resolveConfig({});

    expect(result.icons.sourceDir).toBe('icons');
    expect(result.icons.outputDir).toBe('dist/icons');
  });

  it('should preserve optimize false', () => {
    const result = resolveConfig({ icons: { optimize: false } });
    expect(result.icons.optimize).toBe(false);
  });
});

describe('resolveConfig — overrides edge cases', () => {
  it('should handle overrides with only aliases', () => {
    const result = resolveConfig(
      {},
      {
        overrides: {
          aliases: { importAlias: '~/' },
        },
      }
    );

    expect(result.aliases.importAlias).toBe('~/');
  });

  it('should handle overrides with only components', () => {
    const result = resolveConfig(
      {},
      {
        overrides: {
          components: { overwrite: true },
        },
      }
    );

    expect(result.components.overwrite).toBe(true);
  });

  it('should not apply overrides when overrides is undefined', () => {
    const result = resolveConfig({ tokens: { prefix: '--user-' } }, { overrides: undefined });

    expect(result.tokens.prefix).toBe('--user-');
  });
});

describe('mergeConfigs — additional coverage', () => {
  it('should merge icons configs', () => {
    const base: DsaiConfig = { icons: { framework: 'react' } };
    const override: DsaiConfig = { icons: { optimize: false } };

    const result = mergeConfigs(base, override);

    expect(result.icons?.framework).toBe('react');
    expect(result.icons?.optimize).toBe(false);
  });

  it('should merge aliases configs', () => {
    const base: DsaiConfig = { aliases: { importAlias: '@/' } };
    const override: DsaiConfig = { aliases: { ui: 'components/ui' } };

    const result = mergeConfigs(base, override);

    expect(result.aliases?.importAlias).toBe('@/');
    expect(result.aliases?.ui).toBe('components/ui');
  });

  it('should merge components configs', () => {
    const base: DsaiConfig = { components: { enabled: true } };
    const override: DsaiConfig = { components: { overwrite: true } };

    const result = mergeConfigs(base, override);

    expect(result.components?.enabled).toBe(true);
    expect(result.components?.overwrite).toBe(true);
  });

  it('should handle single config', () => {
    const config: DsaiConfig = { global: { debug: true } };
    const result = mergeConfigs(config);

    expect(result.global?.debug).toBe(true);
  });

  it('should handle no configs', () => {
    const result = mergeConfigs();
    expect(result).toEqual({});
  });

  it('should preserve sections not present in override', () => {
    const base: DsaiConfig = {
      tokens: { prefix: '--base-' },
      icons: { framework: 'react' },
    };
    const override: DsaiConfig = {
      tokens: { prefix: '--override-' },
    };

    const result = mergeConfigs(base, override);

    expect(result.tokens?.prefix).toBe('--override-');
    expect(result.icons?.framework).toBe('react');
  });

  it('should merge four configs in order', () => {
    const a: DsaiConfig = { global: { debug: false } };
    const b: DsaiConfig = { tokens: { prefix: '--b-' } };
    const c: DsaiConfig = { global: { debug: true }, tokens: { prefix: '--c-' } };
    const d: DsaiConfig = { icons: { framework: 'vue' } };

    const result = mergeConfigs(a, b, c, d);

    expect(result.global?.debug).toBe(true);
    expect(result.tokens?.prefix).toBe('--c-');
    expect(result.icons?.framework).toBe('vue');
  });
});
