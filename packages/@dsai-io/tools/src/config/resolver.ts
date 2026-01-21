/**
 * @fileoverview Configuration resolver for DSAI Tools
 *
 * Merges user configuration with defaults and resolves relative paths.
 * Handles configuration inheritance and validation.
 *
 * @module @dsai-io/tools/config/resolver
 */

import path from 'node:path';

import {
  defaultConfig,
  defaultGlobalConfig,
  defaultIconsConfig,
  defaultOutputFileNames,
  defaultThemeDefinitions,
  defaultThemesConfig,
  defaultTokensConfig,
} from './defaults.js';

import type {
  DsaiConfig,
  GlobalConfig,
  IconsConfig,
  OutputFormat,
  ResolvedConfig,
  ResolvedGlobalConfig,
  ResolvedIconsConfig,
  ResolvedThemeDefinition,
  ResolvedThemesConfig,
  ResolvedTokensConfig,
  ThemeDefinition,
  ThemesConfig,
  TokensConfig,
} from './types.js';

// ============================================================================
// Types
// ============================================================================

/**
 * Options for resolving configuration
 */
export interface ResolveOptions {
  /** Working directory */
  cwd?: string;

  /** Directory containing config file (for relative path resolution) */
  configDir?: string;

  /** Override values (highest priority) */
  overrides?: Partial<DsaiConfig>;
}

// ============================================================================
// Section Resolvers
// ============================================================================

/**
 * Resolve global configuration section
 */
function resolveGlobalConfig(
  config: GlobalConfig | undefined,
  options: ResolveOptions
): ResolvedGlobalConfig {
  const base = defaultGlobalConfig;
  const cwd = options.cwd ?? process.cwd();

  return {
    cwd: config?.cwd ? path.resolve(cwd, config.cwd) : cwd,
    debug: config?.debug ?? base.debug,
    logLevel: config?.logLevel ?? base.logLevel,
  };
}

/**
 * Resolve a single theme definition
 */
function resolveThemeDefinition(
  themeName: string,
  definition: ThemeDefinition | undefined,
  selectorPattern: { default: string; others: string },
  _outputFileNames: Record<OutputFormat, string>,
  isDefaultTheme: boolean
): ResolvedThemeDefinition {
  // Generate default output files based on theme name
  const generateOutputFiles = (): Record<OutputFormat, string> => {
    const suffix = isDefaultTheme ? '' : `-${themeName}`;
    return {
      css: `tokens${suffix}.css`,
      scss: `_tokens${suffix}.scss`,
      js: `tokens${suffix}.js`,
      ts: `tokens${suffix}.ts`,
      json: `tokens${suffix}.json`,
      android: `tokens${suffix}.xml`,
      ios: `tokens${suffix}.h`,
    };
  };

  // Generate default selector based on pattern
  const generateSelector = (): string => {
    if (isDefaultTheme) {
      return selectorPattern.default;
    }
    return selectorPattern.others.replace('{mode}', themeName);
  };

  const defaultOutputFiles = generateOutputFiles();

  return {
    isDefault: definition?.isDefault ?? isDefaultTheme,
    suffix: definition?.suffix ?? (isDefaultTheme ? null : `-${themeName}`),
    selector: definition?.selector ?? generateSelector(),
    mediaQuery: definition?.mediaQuery,
    dataAttribute: definition?.dataAttribute,
    outputFiles: {
      ...defaultOutputFiles,
      ...definition?.outputFiles,
    },
  };
}

/**
 * Resolve themes configuration section
 */
function resolveThemesConfig(config: ThemesConfig | undefined): ResolvedThemesConfig {
  const base = defaultThemesConfig;

  const selectorPattern = {
    default: config?.selectorPattern?.default ?? base.selectorPattern.default,
    others: config?.selectorPattern?.others ?? base.selectorPattern.others,
  };

  // Determine the default theme name
  const defaultThemeName = config?.default?.toLowerCase() ?? base.default;

  // Resolve definitions
  let definitions: Record<string, ResolvedThemeDefinition>;

  if (config?.definitions && Object.keys(config.definitions).length > 0) {
    // User provided explicit definitions
    definitions = {};
    for (const [themeName, definition] of Object.entries(config.definitions)) {
      const normalizedName = themeName.toLowerCase();
      const isDefaultTheme = definition.isDefault ?? normalizedName === defaultThemeName;
      const resolvedDef = resolveThemeDefinition(
        normalizedName,
        definition,
        selectorPattern,
        defaultOutputFileNames,
        isDefaultTheme
      );
      Object.defineProperty(definitions, normalizedName, {
        value: resolvedDef,
        writable: true,
        enumerable: true,
        configurable: true,
      });
    }
  } else {
    // Use default definitions (light & dark)
    definitions = { ...defaultThemeDefinitions };
  }

  return {
    enabled: config?.enabled ?? base.enabled,
    autoDetect: config?.autoDetect ?? base.autoDetect,
    default: defaultThemeName,
    ignoreModes: config?.ignoreModes ?? [...base.ignoreModes],
    selectorPattern,
    definitions,
  };
}

/**
 * Resolve icons configuration section
 */
function resolveIconsConfig(
  config: IconsConfig | undefined,
  options: ResolveOptions
): ResolvedIconsConfig {
  const base = defaultIconsConfig;
  const configDir = options.configDir ?? options.cwd ?? process.cwd();

  return {
    sourceDir: config?.sourceDir ? path.resolve(configDir, config.sourceDir) : base.sourceDir,
    outputDir: config?.outputDir ? path.resolve(configDir, config.outputDir) : base.outputDir,
    framework: config?.framework ?? base.framework,
    typescript: config?.typescript ?? base.typescript,
    optimize: config?.optimize ?? base.optimize,
    prefix: config?.prefix ?? base.prefix,
  };
}

/**
 * Resolve tokens configuration section
 */
function resolveTokensConfig(
  config: TokensConfig | undefined,
  options: ResolveOptions
): ResolvedTokensConfig {
  const base = defaultTokensConfig;
  const configDir = options.configDir ?? options.cwd ?? process.cwd();

  // Resolve paths relative to config directory
  const resolveDir = (dir: string): string => path.resolve(configDir, dir);

  // Resolve output directories using Map to avoid object injection
  const outputDirsMap = new Map(Object.entries(base.outputDirs));
  if (config?.outputDirs) {
    for (const [format, dir] of Object.entries(config.outputDirs)) {
      if (dir !== undefined) {
        outputDirsMap.set(format, resolveDir(dir));
      }
    }
  }
  const outputDirs = Object.fromEntries(outputDirsMap) as ResolvedTokensConfig['outputDirs'];

  // Merge collection mapping with resolved paths using Map
  const collectionMappingMap = new Map<string, string>();
  if (config?.collectionMapping) {
    for (const [name, filePath] of Object.entries(config.collectionMapping)) {
      collectionMappingMap.set(name, resolveDir(filePath));
    }
  }
  const collectionMapping = Object.fromEntries(collectionMappingMap);

  // Resolve additional directories
  const additionalScssDirectories = (config?.additionalScssDirectories ?? []).map(resolveDir);
  const additionalCssDirectories = (config?.additionalCssDirectories ?? []).map(resolveDir);
  const watchDirectories = (config?.watchDirectories ?? []).map(resolveDir);

  return {
    source: config?.source ?? base.source,
    sourceDir: config?.sourceDir ? resolveDir(config.sourceDir) : base.sourceDir,
    collectionsDir: config?.collectionsDir
      ? resolveDir(config.collectionsDir)
      : base.collectionsDir,
    sourcePatterns: config?.sourcePatterns ?? [...base.sourcePatterns],
    collectionMapping,
    outputDir: config?.outputDir ? resolveDir(config.outputDir) : base.outputDir,
    outputDirs,
    outputFileNames: { ...base.outputFileNames, ...config?.outputFileNames },
    prefix: config?.prefix ?? base.prefix,
    formats: config?.formats ?? [...base.formats],
    additionalScssDirectories,
    additionalCssDirectories,
    mergeOrder: config?.mergeOrder ?? base.mergeOrder,
    createBundle: config?.createBundle ?? base.createBundle,
    scssImportHeader: config?.scssImportHeader,
    themes: resolveThemesConfig(config?.themes),
    transforms: config?.transforms ?? [],
    customFormats: config?.customFormats ?? [],
    preprocessors: config?.preprocessors ?? [],
    filters: config?.filters ?? [],
    onBuildStart: config?.onBuildStart,
    onFormatComplete: config?.onFormatComplete,
    onAllFormatsComplete: config?.onAllFormatsComplete,
    onBuildComplete: config?.onBuildComplete,
    outputReferences: config?.outputReferences ?? base.outputReferences,
    baseFontSize: config?.baseFontSize ?? base.baseFontSize,
    separateThemeFiles: config?.separateThemeFiles ?? base.separateThemeFiles,
    watch: config?.watch ?? base.watch,
    watchDirectories,
    pipeline: config?.pipeline,
    scss: config?.scss,
    postprocess: config?.postprocess,
  };
}

// ============================================================================
// Main Resolver
// ============================================================================

/**
 * Merge config with overrides (simple shallow merge for top-level)
 */
function applyOverrides(config: DsaiConfig, overrides: Partial<DsaiConfig>): DsaiConfig {
  return {
    tokens: overrides.tokens ? { ...config.tokens, ...overrides.tokens } : config.tokens,
    icons: overrides.icons ? { ...config.icons, ...overrides.icons } : config.icons,
    global: overrides.global ? { ...config.global, ...overrides.global } : config.global,
  };
}

/**
 * Resolve user configuration with defaults
 *
 * Merges user configuration with defaults, resolves relative paths,
 * and applies overrides.
 *
 * Resolution order (later overrides earlier):
 * 1. Default configuration
 * 2. User configuration (from file)
 * 3. Override configuration (from CLI or programmatic)
 *
 * @param config - User configuration object
 * @param options - Resolution options
 * @returns Fully resolved configuration
 *
 * @example
 * ```typescript
 * const resolved = resolveConfig(
 *   { tokens: { prefix: '--custom-' } },
 *   { cwd: '/path/to/project' }
 * );
 * ```
 */
export function resolveConfig(
  config: DsaiConfig = {},
  options: ResolveOptions = {}
): ResolvedConfig {
  // Merge overrides into config
  const mergedConfig = options.overrides ? applyOverrides(config, options.overrides) : config;

  const configDir = options.configDir ?? options.cwd ?? process.cwd();

  return {
    global: resolveGlobalConfig(mergedConfig.global, options),
    tokens: resolveTokensConfig(mergedConfig.tokens, options),
    icons: resolveIconsConfig(mergedConfig.icons, options),
    configDir,
  };
}

/**
 * Merge multiple configurations
 *
 * Useful for extending base configurations.
 *
 * @param configs - Array of configurations to merge (later overrides earlier)
 * @returns Merged configuration
 *
 * @example
 * ```typescript
 * const merged = mergeConfigs(
 *   baseConfig,
 *   teamConfig,
 *   projectConfig
 * );
 * ```
 */
export function mergeConfigs(...configs: DsaiConfig[]): DsaiConfig {
  let result: DsaiConfig = {};

  for (const config of configs) {
    result = applyOverrides(result, config);
  }

  return result;
}

/**
 * Create a partial resolved config for testing
 *
 * @param partial - Partial configuration to fill
 * @returns Full resolved configuration with defaults
 */
export function createResolvedConfig(partial: Partial<ResolvedConfig> = {}): ResolvedConfig {
  return {
    global: partial.global ?? defaultConfig.global,
    tokens: partial.tokens ?? defaultConfig.tokens,
    icons: partial.icons ?? defaultConfig.icons,
    configDir: partial.configDir ?? process.cwd(),
    configPath: partial.configPath,
  };
}
