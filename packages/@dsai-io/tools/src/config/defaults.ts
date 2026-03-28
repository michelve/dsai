/**
 * @fileoverview Default configuration values for DSAI Tools
 *
 * Provides comprehensive default values for all configuration options.
 * These defaults are merged with user configuration during resolution.
 *
 * @module @dsai-io/tools/config/defaults
 */

import type {
  IconFramework,
  LogLevel,
  OutputFormat,
  ResolvedAliasesConfig,
  ResolvedComponentsConfig,
  ResolvedConfig,
  ResolvedGlobalConfig,
  ResolvedIconsConfig,
  ResolvedThemeDefinition,
  ResolvedThemesConfig,
  ResolvedTokensConfig,
  ThemeSelectorPattern,
} from './types.js';

// ============================================================================
// Constants
// ============================================================================

/**
 * Default prefix for CSS custom properties
 */
export const DEFAULT_PREFIX = '--dsai-';

/**
 * Default log level for CLI output
 */
export const DEFAULT_LOG_LEVEL: LogLevel = 'info';

/**
 * Default output directory
 */
export const DEFAULT_OUTPUT_DIR = 'dist';

/**
 * Default source directory for tokens (Figma exports)
 */
export const DEFAULT_SOURCE_DIR = 'figma-exports';

/**
 * Default collections directory
 */
export const DEFAULT_COLLECTIONS_DIR = 'collections';

/**
 * Default icons source directory
 */
export const DEFAULT_ICONS_SOURCE_DIR = 'icons';

/**
 * Default icons output directory
 */
export const DEFAULT_ICONS_OUTPUT_DIR = 'dist/icons';

// ============================================================================
// Default Output Configuration
// ============================================================================

/**
 * Default source patterns for finding Figma exports
 */
export const defaultSourcePatterns = ['theme.json', 'tokens.json', '*.tokens.json'];

/**
 * Default output formats for tokens
 */
export const defaultFormats: OutputFormat[] = ['css', 'scss', 'js', 'ts', 'json'];

/**
 * Default output file names for each format
 */
export const defaultOutputFileNames: Record<OutputFormat, string> = {
  css: 'tokens.css',
  scss: '_tokens.scss',
  js: 'tokens.js',
  ts: 'tokens.ts',
  json: 'tokens.json',
  android: 'tokens.xml',
  ios: 'tokens.h',
};

// ============================================================================
// Theme Defaults
// ============================================================================

/**
 * Default theme selector pattern
 */
export const defaultSelectorPattern: Required<ThemeSelectorPattern> = {
  default: ':root',
  others: '[data-dsai-theme="{mode}"]',
};

/**
 * Default theme definitions
 * Provides light and dark themes out of the box
 */
export const defaultThemeDefinitions: Record<string, ResolvedThemeDefinition> = {
  light: {
    isDefault: true,
    suffix: null,
    selector: ':root',
    outputFiles: {
      css: 'tokens.css',
      scss: '_tokens.scss',
      js: 'tokens.js',
      ts: 'tokens.ts',
      json: 'tokens.json',
      android: 'tokens.xml',
      ios: 'tokens.h',
    },
  },
  dark: {
    isDefault: false,
    suffix: '-dark',
    selector: '[data-dsai-theme="dark"]',
    mediaQuery: '(prefers-color-scheme: dark)',
    outputFiles: {
      css: 'tokens-dark.css',
      scss: '_tokens-dark.scss',
      js: 'tokens-dark.js',
      ts: 'tokens-dark.ts',
      json: 'tokens-dark.json',
      android: 'tokens-dark.xml',
      ios: 'tokens-dark.h',
    },
  },
};

/**
 * Default resolved themes configuration
 */
export const defaultThemesConfig: ResolvedThemesConfig = {
  enabled: true,
  autoDetect: true,
  default: 'light',
  ignoreModes: [],
  selectorPattern: defaultSelectorPattern,
  definitions: defaultThemeDefinitions,
};

// ============================================================================
// Icon Defaults
// ============================================================================

/**
 * Default icon framework
 */
export const defaultIconFramework: IconFramework = 'react';

/**
 * Default resolved icons configuration
 */
export const defaultIconsConfig: ResolvedIconsConfig = {
  sourceDir: DEFAULT_ICONS_SOURCE_DIR,
  outputDir: DEFAULT_ICONS_OUTPUT_DIR,
  framework: defaultIconFramework,
  typescript: true,
  optimize: true,
  prefix: 'Icon',
};

// ============================================================================
// Aliases Defaults
// ============================================================================

/**
 * Default resolved aliases configuration
 */
export const defaultAliasesConfig: ResolvedAliasesConfig = {
  importAlias: '@/',
  ui: 'src/components/ui',
  hooks: 'src/hooks',
  utils: 'src/lib/utils',
  components: 'src/components',
  lib: 'src/lib',
};

// ============================================================================
// Components Defaults
// ============================================================================

/**
 * Default resolved components configuration
 */
export const defaultComponentsConfig: ResolvedComponentsConfig = {
  enabled: true,
  registryUrl: 'https://registry.dsai.dev',
  tsx: true,
  overwrite: false,
};

// ============================================================================
// Token Defaults
// ============================================================================

/**
 * Default resolved tokens configuration
 */
export const defaultTokensConfig: ResolvedTokensConfig = {
  source: 'theme',
  sourceDir: DEFAULT_SOURCE_DIR,
  collectionsDir: DEFAULT_COLLECTIONS_DIR,
  sourcePatterns: defaultSourcePatterns,
  collectionMapping: {},
  outputDir: DEFAULT_OUTPUT_DIR,
  outputDirs: {},
  outputFileNames: defaultOutputFileNames,
  prefix: DEFAULT_PREFIX,
  formats: defaultFormats,
  additionalScssDirectories: [],
  additionalCssDirectories: [],
  mergeOrder: 'after',
  createBundle: false,
  themes: defaultThemesConfig,
  transforms: [],
  customFormats: [],
  preprocessors: [],
  filters: [],
  outputReferences: true,
  baseFontSize: 16,
  separateThemeFiles: false,
  watch: false,
  watchDirectories: [],
};

// ============================================================================
// Global Defaults
// ============================================================================

/**
 * Default resolved global configuration
 */
export const defaultGlobalConfig: ResolvedGlobalConfig = {
  cwd: process.cwd(),
  debug: false,
  logLevel: DEFAULT_LOG_LEVEL,
};

// ============================================================================
// Complete Default Configuration
// ============================================================================

/**
 * Complete default resolved configuration
 *
 * This is used as the base for merging user configurations.
 * All values have sensible defaults that work for most projects.
 */
export const defaultConfig: ResolvedConfig = {
  tokens: defaultTokensConfig,
  icons: defaultIconsConfig,
  aliases: defaultAliasesConfig,
  components: defaultComponentsConfig,
  global: defaultGlobalConfig,
  configDir: process.cwd(),
};

// ============================================================================
// Environment Variable Mappings
// ============================================================================

/**
 * Mapping of environment variables to configuration paths
 *
 * Format: { ENV_VAR_NAME: 'config.path.to.value' }
 *
 * @example
 * DSAI_LOG_LEVEL=debug → { global: { logLevel: 'debug' } }
 * DSAI_PREFIX=myapp → { tokens: { prefix: 'myapp' } }
 */
export const envMappings: Record<string, string> = {
  // Global settings
  DSAI_LOG_LEVEL: 'global.logLevel',
  DSAI_DEBUG: 'global.debug',
  DSAI_CWD: 'global.cwd',

  // Token settings
  DSAI_PREFIX: 'tokens.prefix',
  DSAI_SOURCE_DIR: 'tokens.sourceDir',
  DSAI_OUTPUT_DIR: 'tokens.outputDir',
  DSAI_WATCH: 'tokens.watch',
  DSAI_CREATE_BUNDLE: 'tokens.createBundle',
  DSAI_BASE_FONT_SIZE: 'tokens.baseFontSize',

  // Theme settings
  DSAI_DEFAULT_THEME: 'tokens.themes.default',
  DSAI_AUTO_DETECT_THEMES: 'tokens.themes.autoDetect',

  // Icon settings
  DSAI_ICONS_SOURCE_DIR: 'icons.sourceDir',
  DSAI_ICONS_OUTPUT_DIR: 'icons.outputDir',
  DSAI_ICONS_FRAMEWORK: 'icons.framework',
  DSAI_ICONS_TYPESCRIPT: 'icons.typescript',
  DSAI_ICONS_OPTIMIZE: 'icons.optimize',
  DSAI_ICONS_PREFIX: 'icons.prefix',
};

/**
 * Environment variables that should be parsed as booleans
 */
export const envBooleanKeys: Set<string> = new Set([
  'DSAI_DEBUG',
  'DSAI_WATCH',
  'DSAI_CREATE_BUNDLE',
  'DSAI_AUTO_DETECT_THEMES',
  'DSAI_ICONS_TYPESCRIPT',
  'DSAI_ICONS_OPTIMIZE',
]);

/**
 * Environment variables that should be parsed as numbers
 */
export const envNumberKeys: Set<string> = new Set(['DSAI_BASE_FONT_SIZE']);

/**
 * Environment variables that should be parsed as arrays (comma-separated)
 */
export const envArrayKeys: Set<string> = new Set(['DSAI_FORMATS', 'DSAI_IGNORE_MODES']);

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get the output file name for a format with optional theme
 *
 * @param format - Output format
 * @param theme - Optional theme name
 * @returns Output file name
 */
export function getOutputFileName(format: OutputFormat, theme?: string): string {
  let baseName: string;

  switch (format) {
    case 'css':
      baseName = 'tokens.css';
      break;
    case 'scss':
      baseName = '_tokens.scss';
      break;
    case 'js':
      baseName = 'tokens.js';
      break;
    case 'ts':
      baseName = 'tokens.ts';
      break;
    case 'json':
      baseName = 'tokens.json';
      break;
    case 'android':
      baseName = 'tokens.xml';
      break;
    case 'ios':
      baseName = 'tokens.h';
      break;
    default:
      baseName = 'tokens.txt';
  }

  if (!theme) {
    return baseName;
  }

  // Insert theme before extension
  const dotIndex = baseName.lastIndexOf('.');
  if (dotIndex === -1) {
    return `${baseName}-${theme}`;
  }

  const name = baseName.slice(0, dotIndex);
  const ext = baseName.slice(dotIndex);
  return `${name}-${theme}${ext}`;
}

/**
 * Get the default output directory for a format
 *
 * @param format - Output format
 * @returns Output directory path
 */
export function getDefaultOutputDir(format: OutputFormat): string {
  switch (format) {
    case 'css':
      return `${DEFAULT_OUTPUT_DIR}/css`;
    case 'scss':
      return `${DEFAULT_OUTPUT_DIR}/scss`;
    case 'js':
    case 'ts':
      return `${DEFAULT_OUTPUT_DIR}/js`;
    case 'json':
      return `${DEFAULT_OUTPUT_DIR}/json`;
    case 'android':
      return `${DEFAULT_OUTPUT_DIR}/android`;
    case 'ios':
      return `${DEFAULT_OUTPUT_DIR}/ios`;
    default:
      return DEFAULT_OUTPUT_DIR;
  }
}

/**
 * Get default extension for a format
 *
 * @param format - Output format
 * @returns File extension including the dot
 */
export function getDefaultExtension(format: OutputFormat): string {
  switch (format) {
    case 'css':
      return '.css';
    case 'scss':
      return '.scss';
    case 'js':
      return '.js';
    case 'ts':
      return '.ts';
    case 'json':
      return '.json';
    case 'android':
      return '.xml';
    case 'ios':
      return '.h';
    default:
      return '.txt';
  }
}
