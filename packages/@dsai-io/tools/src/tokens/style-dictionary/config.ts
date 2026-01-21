/**
 * Style Dictionary Configuration Generator
 *
 * Creates Style Dictionary configuration from DSAi config.
 *
 * @packageDocumentation
 * @module @dsai-io/tools/tokens/style-dictionary/config
 */

import { registerFormats } from './formats/index.js';
import { registerTransformGroups } from './groups/index.js';
import { registerPreprocessors } from './preprocessors/index.js';
import { registerTransforms } from './transforms/index.js';

import type {
  CreateSDConfigOptions,
  SDConfig,
  SDPlatformType,
  StyleDictionaryInstance,
} from './types.js';
import type { ResolvedConfig } from '../../config/types.js';

/**
 * Default source patterns for token files
 */
const DEFAULT_SOURCE_PATTERNS = [
  'collections/color/*.json',
  'collections/typography/*.json',
  'collections/spacing/*.json',
  'collections/border/*.json',
  'collections/shadow/*.json',
  'collections/layout/*.json',
];

/**
 * Default platforms to generate
 */
const DEFAULT_PLATFORMS: SDPlatformType[] = ['css', 'js', 'ts', 'scss', 'scss-dist', 'json'];

/**
 * Create Style Dictionary configuration from DSAi config
 *
 * Generates a complete Style Dictionary configuration based on
 * the resolved DSAi configuration, with sensible defaults.
 *
 * @param dsaiConfig - Resolved DSAi configuration
 * @param options - Additional options to override defaults
 * @returns Style Dictionary configuration object
 *
 * @example
 * ```typescript
 * import StyleDictionary from 'style-dictionary';
 * import { loadConfig } from '@dsai-io/tools/config';
 * import { createStyleDictionaryConfig, registerAll } from '@dsai-io/tools/tokens/style-dictionary';
 *
 * const { config } = await loadConfig();
 * const sdConfig = createStyleDictionaryConfig(config);
 *
 * registerAll(StyleDictionary);
 *
 * const sd = new StyleDictionary(sdConfig);
 * await sd.buildAllPlatforms();
 * ```
 */
export function createStyleDictionaryConfig(
  dsaiConfig: ResolvedConfig,
  options: Partial<CreateSDConfigOptions> = {}
): SDConfig {
  const {
    source = DEFAULT_SOURCE_PATTERNS,
    prefix = dsaiConfig.tokens.prefix,
    buildPath = dsaiConfig.tokens.outputDir,
    baseFontSize = dsaiConfig.tokens.baseFontSize ?? 16,
    outputReferences = dsaiConfig.tokens.outputReferences ?? true,
    platforms = DEFAULT_PLATFORMS,
    verbose = dsaiConfig.global.debug ?? false,
  } = options;

  const config: SDConfig = {
    log: {
      verbosity: verbose ? 'verbose' : 'default',
      warnings: 'warn',
      errors: 'error',
    },
    preprocessors: ['fix-references'],
    expand: {
      typesMap: {
        sizing: 'dimension',
        spacing: 'dimension',
        borderRadius: 'dimension',
        borderWidth: 'dimension',
      },
    },
    source,
    platforms: {},
  };

  // Ensure buildPath ends with /
  const normalizedBuildPath = buildPath.endsWith('/') ? buildPath : `${buildPath}/`;

  const platformConfigs = config.platforms ?? {};

  // CSS Platform
  if (platforms.includes('css')) {
    platformConfigs['css'] = {
      transformGroup: 'custom/css',
      buildPath: `${normalizedBuildPath}css/`,
      files: [
        {
          destination: 'variables.css',
          format: 'css/variables-with-comments',
          options: {
            prefix,
            // For CSS, we need resolved values, not references
            // CSS custom properties cannot reference other tokens using {token.path} syntax
            // They need actual values or var(--other-token) syntax
            outputReferences: false,
          },
        },
      ],
    };
  }

  // JavaScript Platform
  if (platforms.includes('js')) {
    platformConfigs['js'] = {
      transformGroup: 'js-custom',
      buildPath: `${normalizedBuildPath}js/`,
      files: [
        {
          destination: 'tokens.js',
          format: 'javascript/es6',
          options: { outputReferences },
        },
        {
          destination: 'tokens.cjs',
          format: 'javascript/module',
          options: { outputReferences },
        },
      ],
    };
  }

  // TypeScript Platform
  if (platforms.includes('ts')) {
    platformConfigs['ts'] = {
      transformGroup: 'js-custom',
      buildPath: `${normalizedBuildPath}ts/`,
      files: [
        {
          destination: 'tokens.ts',
          format: 'javascript/es6',
          options: { outputReferences },
        },
        {
          destination: 'tokens.d.ts',
          format: 'typescript/declarations',
        },
      ],
    };
  }

  // SCSS Platform (source - for Bootstrap & DSAi builds)
  if (platforms.includes('scss')) {
    platformConfigs['scss'] = {
      transformGroup: 'custom/scss',
      buildPath: 'src/scss/',
      files: [
        {
          destination: '_variables.scss',
          format: 'scss/variables',
          options: {
            outputReferences,
            basePxFontSize: baseFontSize,
          },
        },
      ],
    };
  }

  // SCSS Platform (dist - for npm package consumers)
  if (platforms.includes('scss-dist')) {
    platformConfigs['scss-dist'] = {
      transformGroup: 'custom/scss',
      buildPath: `${normalizedBuildPath}scss/`,
      files: [
        {
          destination: '_variables.scss',
          format: 'scss/variables',
          options: {
            outputReferences,
            basePxFontSize: baseFontSize,
          },
        },
      ],
    };
  }

  // JSON Platform (for documentation)
  if (platforms.includes('json')) {
    platformConfigs['json'] = {
      transformGroup: 'js',
      buildPath: `${normalizedBuildPath}json/`,
      files: [
        { destination: 'tokens.json', format: 'json/flat' },
        { destination: 'tokens-nested.json', format: 'json/nested' },
      ],
    };
  }

  config.platforms = platformConfigs;
  return config;
}

/**
 * Register all custom transforms, formats, preprocessors, and groups
 *
 * Must be called before creating a Style Dictionary instance with
 * a config generated by createStyleDictionaryConfig.
 *
 * @param sd - Style Dictionary instance (the imported module)
 * @param options - Custom extensions to register
 *
 * @example
 * ```typescript
 * import StyleDictionary from 'style-dictionary';
 * import { registerAll } from '@dsai-io/tools/tokens/style-dictionary';
 *
 * registerAll(StyleDictionary, {
 *   customTransforms: [myCustomTransform],
 *   customFormats: [myCustomFormat],
 * });
 * ```
 */
export function registerAll(
  sd: StyleDictionaryInstance,
  options: Partial<CreateSDConfigOptions> = {}
): void {
  const { customTransforms = [], customFormats = [], customPreprocessors = [] } = options;

  // Order matters: transforms first, then groups (which reference transforms)
  registerTransforms(sd, customTransforms);
  registerTransformGroups(sd);
  registerFormats(sd, customFormats);
  registerPreprocessors(sd, customPreprocessors);
}

/**
 * Create and register a complete Style Dictionary setup
 *
 * Convenience function that combines registerAll and createStyleDictionaryConfig.
 *
 * @param sd - Style Dictionary instance
 * @param dsaiConfig - Resolved DSAi configuration
 * @param options - Additional options
 * @returns Style Dictionary configuration
 *
 * @example
 * ```typescript
 * import StyleDictionary from 'style-dictionary';
 * import { loadConfig } from '@dsai-io/tools/config';
 * import { setupStyleDictionary } from '@dsai-io/tools/tokens/style-dictionary';
 *
 * const { config } = await loadConfig();
 * const sdConfig = setupStyleDictionary(StyleDictionary, config);
 *
 * const sd = new StyleDictionary(sdConfig);
 * await sd.buildAllPlatforms();
 * ```
 */
export function setupStyleDictionary(
  sd: StyleDictionaryInstance,
  dsaiConfig: ResolvedConfig,
  options: Partial<CreateSDConfigOptions> = {}
): SDConfig {
  registerAll(sd, options);
  return createStyleDictionaryConfig(dsaiConfig, options);
}
