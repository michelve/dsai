/**
 * Configuration module for @dsai-io/tools
 *
 * Provides type-safe configuration loading, validation, and resolution
 * using cosmiconfig and zod.
 *
 * @module @dsai-io/tools/config
 *
 * @example
 * ```typescript
 * import { loadConfig, defineConfig } from '@dsai-io/tools/config';
 *
 * // In your dsai.config.ts
 * export default defineConfig({
 *   tokens: {
 *     prefix: '--myapp-',
 *     formats: ['css', 'scss', 'ts'],
 *   },
 * });
 *
 * // Loading configuration
 * const { config, warnings } = await loadConfig();
 * ```
 */

// ============================================================================
// Type Exports
// ============================================================================

export type {
  // Core types
  DsaiConfig,
  GlobalConfig,
  TokensConfig,
  IconsConfig,
  ThemesConfig,
  ThemeSelectorPattern,
  // Resolved types
  ResolvedConfig,
  ResolvedGlobalConfig,
  ResolvedTokensConfig,
  ResolvedIconsConfig,
  ResolvedThemesConfig,
  // Extensibility types
  CustomTransform,
  CustomFormat,
  CustomPreprocessor,
  CustomFilter,
  // Token types
  TokenData,
  TransformOptions,
  FormatArgs,
  Dictionary,
  Platform,
  FileConfig,
  BuildSummary,
  // Config loading types
  LoadConfigOptions,
  LoadConfigResult,
  // Enum types
  LogLevel,
  OutputFormat,
  IconFramework,
} from './types.js';

// ============================================================================
// Schema Exports
// ============================================================================

export {
  // Primitive schemas
  logLevelSchema,
  outputFormatSchema,
  frameworkSchema,
  hashTypeSchema,
  globPatternSchema,
  filePathSchema,
  versionSchema,
  // Transform schemas
  customTransformSchema,
  customFormatSchema,
  // Config section schemas
  themeModeSchema,
  themesConfigSchema,
  iconOptimizationSchema,
  iconSpriteSchema,
  iconsConfigSchema,
  tokenBuildConfigSchema,
  tokenCacheConfigSchema,
  tokenWatchConfigSchema,
  tokensHooksSchema,
  tokensConfigSchema,
  buildConfigSchema,
  globalConfigSchema,
  // Root schema
  dsaiConfigSchema,
  // Schema-inferred types
  type LogLevelFromSchema,
  type OutputFormatFromSchema,
  type FrameworkFromSchema,
  type DsaiConfigFromSchema,
  type TokensConfigFromSchema,
  type ThemesConfigFromSchema,
  type IconsConfigFromSchema,
  type GlobalConfigFromSchema,
  // Validation types
  type ValidationResult,
  type ValidationError,
  // Validation functions
  validateConfig,
  validateConfigOrThrow,
  validateConfigSection,
  formatValidationErrors,
  formatErrorMessage,
} from './schema.js';

// ============================================================================
// Default Exports
// ============================================================================

export {
  // Constants
  DEFAULT_PREFIX,
  DEFAULT_LOG_LEVEL,
  DEFAULT_OUTPUT_DIR,
  DEFAULT_SOURCE_DIR,
  DEFAULT_COLLECTIONS_DIR,
  DEFAULT_ICONS_SOURCE_DIR,
  DEFAULT_ICONS_OUTPUT_DIR,
  // Default values
  defaultSourcePatterns,
  defaultFormats,
  defaultOutputFileNames,
  defaultSelectorPattern,
  defaultThemesConfig,
  defaultIconFramework,
  defaultIconsConfig,
  defaultTokensConfig,
  defaultGlobalConfig,
  defaultConfig,
  // Environment mappings
  envMappings,
  envBooleanKeys,
  envNumberKeys,
  envArrayKeys,
  // Helper functions
  getOutputFileName,
  getDefaultOutputDir,
  getDefaultExtension,
} from './defaults.js';

// ============================================================================
// Loader Exports
// ============================================================================

export {
  // Loading functions
  loadConfig,
  loadConfigSync,
  searchConfigFile,
  clearConfigCache,
  // Config helpers
  defineConfig,
  defineConfigAsync,
  // Constants
  CONFIG_FILE_NAMES,
} from './loader.js';

// ============================================================================
// Resolver Exports
// ============================================================================

export {
  // Resolver functions
  resolveConfig,
  mergeConfigs,
  createResolvedConfig,
  // Types
  type ResolveOptions,
} from './resolver.js';

// ============================================================================
// Environment Exports
// ============================================================================

export {
  // Parse functions
  getConfigFromEnv,
  getLogLevelFromEnv,
  getEnvOverrides,
  // Detection functions
  isCI,
  shouldDisableColors,
  // Types
  type EnvParseOptions,
} from './env.js';

// ============================================================================
// Migration Exports
// ============================================================================

export {
  // Migration functions
  checkMigrationNeeded,
  migrateConfig,
  migrateLegacyTokensConfig,
  checkDeprecatedOptions,
  generateMigrationScript,
  // Types
  type MigrationCheck,
  type ConfigFormat,
} from './migrate.js';
