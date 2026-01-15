/**
 * Configuration type definitions for @dsai/tools
 *
 * @packageDocumentation
 */

// ============================================================================
// Core Configuration
// ============================================================================

/**
 * Root configuration object
 */
export interface DsaiConfig {
  /** Token build configuration */
  tokens?: TokensConfig;

  /** Icon generation configuration */
  icons?: IconsConfig;

  /** Global settings */
  global?: GlobalConfig;
}

/**
 * Global settings applied across all modules
 */
export interface GlobalConfig {
  /** Working directory (default: process.cwd()) */
  cwd?: string;

  /** Enable debug logging */
  debug?: boolean;

  /** Log level: 'silent' | 'error' | 'warn' | 'info' | 'debug' */
  logLevel?: LogLevel;
}

/**
 * Log level options
 */
export type LogLevel = 'silent' | 'error' | 'warn' | 'info' | 'debug';

// ============================================================================
// Token Configuration
// ============================================================================

/**
 * Output format types
 */
export type OutputFormat = 'css' | 'scss' | 'js' | 'ts' | 'json' | 'android' | 'ios';

/**
 * Token build configuration
 */
export interface TokensConfig {
  // --- Source Configuration ---

  /**
   * Token source type
   * - 'theme': Use combined theme.json from Figma
   * - 'collections': Use individual collection files
   * - Custom path: Direct path to token files
   * @default 'theme'
   */
  source?: 'theme' | 'collections' | string;

  /**
   * Directory containing Figma export files
   * Relative to config file location
   * @default 'figma-exports'
   */
  sourceDir?: string;

  /**
   * Directory containing token collection files
   * Relative to config file location
   * @default 'collections'
   */
  collectionsDir?: string;

  /**
   * Input file patterns/globs for finding Figma exports
   * Allows enterprises to use their own naming conventions
   * @example ['theme.json', '*-tokens.json', 'figma-variables-*.json']
   * @default ['theme.json', 'tokens.json', '*.tokens.json']
   */
  sourcePatterns?: string[];

  /**
   * Mapping of Figma collection names to local file paths
   * Useful when teams export collections separately
   * @example { 'primitives': './tokens/colors.json', 'semantic': './tokens/semantic.json' }
   */
  collectionMapping?: Record<string, string>;

  // --- Output Configuration ---

  /**
   * Output directory for built tokens (applies to all formats by default)
   * Relative to config file location
   * @default 'dist'
   */
  outputDir?: string;

  /**
   * Per-format output directories (overrides outputDir for specific formats)
   * Allows CSS to go one place, SCSS another, JS another
   * @example { css: 'dist/css', scss: 'src/styles/tokens', js: 'dist/js', ts: 'src/tokens' }
   */
  outputDirs?: Partial<Record<OutputFormat, string>>;

  /**
   * Output file naming pattern per format
   * Use {name}, {theme}, {format} placeholders
   * @example { css: 'tokens-{theme}.css', scss: '_tokens-{theme}.scss' }
   * @default { css: 'tokens.css', scss: '_tokens.scss', js: 'tokens.js', ts: 'tokens.ts' }
   */
  outputFileNames?: Partial<Record<OutputFormat, string>>;

  /**
   * CSS custom property prefix
   * @default '--dsai-'
   */
  prefix?: string;

  /**
   * Output formats to generate
   * @default ['css', 'scss', 'js', 'ts', 'json']
   */
  formats?: OutputFormat[];

  // --- Style Merge/Combine Configuration ---

  /**
   * Additional SCSS directories to include/merge with token SCSS output
   * These stylesheets will be combined with the generated token files
   * @example ['src/styles/overrides', 'src/styles/custom-mixins']
   */
  additionalScssDirectories?: string[];

  /**
   * Additional CSS directories to include/merge with token CSS output
   * These stylesheets will be combined with the generated token files
   * @example ['src/styles/base', 'src/styles/utilities']
   */
  additionalCssDirectories?: string[];

  /**
   * Order in which to merge additional stylesheets
   * - 'before': User styles come before generated tokens
   * - 'after': User styles come after generated tokens (default)
   * @default 'after'
   */
  mergeOrder?: 'before' | 'after';

  /**
   * Whether to create combined bundle files
   * When true, creates tokens-bundle.css and _tokens-bundle.scss
   * @default false
   */
  createBundle?: boolean;

  /**
   * Custom file to import at the top of generated SCSS files
   * Useful for SCSS variables, mixins, or functions needed by tokens
   * @example '_variables.scss' or 'path/to/custom-base.scss'
   */
  scssImportHeader?: string;

  // --- Theme Configuration ---

  /** Theme mode settings */
  themes?: ThemesConfig;

  // --- Extensibility ---

  /** Custom Style Dictionary transforms */
  transforms?: CustomTransform[];

  /** Custom Style Dictionary formats */
  customFormats?: CustomFormat[];

  /** Custom Style Dictionary preprocessors */
  preprocessors?: CustomPreprocessor[];

  /** Custom Style Dictionary filters */
  filters?: CustomFilter[];

  // --- Build Hooks ---

  /**
   * Hook called before token build starts
   * @param config Resolved configuration
   * @returns Modified config or undefined
   */
  onBuildStart?: (config: ResolvedConfig) => Promise<Partial<TokensConfig> | undefined>;

  /**
   * Hook called after each format is generated
   * @param format The format just generated
   * @param outputPath Path to the generated file
   * @param content The generated content
   * @returns Modified content or undefined
   */
  onFormatComplete?: (
    format: OutputFormat,
    outputPath: string,
    content: string
  ) => Promise<string | undefined>;

  /**
   * Hook called after all formats are generated, before bundling
   * @param outputs Map of format to file paths
   */
  onAllFormatsComplete?: (outputs: Map<OutputFormat, string[]>) => Promise<void>;

  /**
   * Hook called after build completes (including bundling)
   * @param summary Build summary with all output paths
   */
  onBuildComplete?: (summary: BuildSummary) => Promise<void>;

  // --- Build Options ---

  /**
   * Include token references in output
   * @default true
   */
  outputReferences?: boolean;

  /**
   * Base font size for px to rem conversion
   * @default 16
   */
  baseFontSize?: number;

  /**
   * Generate separate files per theme
   * @default false
   */
  separateThemeFiles?: boolean;

  /**
   * Watch source files for changes and rebuild automatically
   * @default false
   */
  watch?: boolean;

  /**
   * Directories to watch in addition to sourceDir (for watch mode)
   * @example ['src/styles', 'design-tokens']
   */
  watchDirectories?: string[];
}

/**
 * Build summary returned after build completes
 */
export interface BuildSummary {
  /** Total build duration in ms */
  duration: number;

  /** Map of format to generated file paths */
  outputs: Record<OutputFormat, string[]>;

  /** Bundle file paths (if createBundle is true) */
  bundles?: {
    css?: string;
    scss?: string;
  };

  /** Warnings generated during build */
  warnings: string[];

  /** Token statistics */
  stats: {
    totalTokens: number;
    tokensByType: Record<string, number>;
    themes: string[];
  };
}

/**
 * Theme configuration
 */
export interface ThemesConfig {
  /**
   * Auto-detect available modes from Figma export
   * @default true
   */
  autoDetect?: boolean;

  /**
   * Default theme mode (uses :root selector)
   * @default 'Light'
   */
  default?: string;

  /**
   * Modes to ignore during build
   * @default []
   */
  ignoreModes?: string[];

  /**
   * CSS selector patterns for themes
   */
  selectorPattern?: ThemeSelectorPattern;
}

/**
 * Theme selector pattern configuration
 */
export interface ThemeSelectorPattern {
  /**
   * Selector for default theme
   * @default ':root'
   */
  default?: string;

  /**
   * Selector pattern for other themes
   * Use {mode} as placeholder for mode name
   * @default '[data-dsai-theme="{mode}"]'
   */
  others?: string;
}

// ============================================================================
// Extensibility Types
// ============================================================================

/**
 * Custom Style Dictionary transform
 */
export interface CustomTransform {
  /** Unique transform name */
  name: string;

  /** Transform type: 'name' | 'value' | 'attribute' */
  type: 'name' | 'value' | 'attribute';

  /** Filter function to determine which tokens to transform */
  filter?: (token: TokenData) => boolean;

  /** Transform function */
  transform: (token: TokenData, options?: TransformOptions) => unknown;
}

/**
 * Custom Style Dictionary format
 */
export interface CustomFormat {
  /** Unique format name */
  name: string;

  /** Format function */
  format: (args: FormatArgs) => string;
}

/**
 * Custom Style Dictionary preprocessor
 */
export interface CustomPreprocessor {
  /** Unique preprocessor name */
  name: string;

  /** Preprocessor function */
  preprocessor: (dictionary: Dictionary) => Dictionary;
}

/**
 * Custom Style Dictionary filter
 */
export interface CustomFilter {
  /** Unique filter name */
  name: string;

  /** Filter function */
  filter: (token: TokenData) => boolean;
}

/**
 * Token data structure (Style Dictionary compatible)
 */
export interface TokenData {
  name: string;
  value: unknown;
  $value?: unknown;
  type?: string;
  $type?: string;
  path: string[];
  original: unknown;
  comment?: string;
  description?: string;
  $description?: string;
  $extensions?: Record<string, unknown>;
  $scopes?: string[];
  attributes?: Record<string, unknown>;
}

/**
 * Transform options
 */
export interface TransformOptions {
  basePxFontSize?: number;
  prefix?: string;
}

/**
 * Format function arguments
 */
export interface FormatArgs {
  dictionary: Dictionary;
  options: Record<string, unknown>;
  platform: Platform;
  file: FileConfig;
}

/**
 * Dictionary type
 */
export interface Dictionary {
  allTokens: TokenData[];
  tokens: Record<string, unknown>;
  unfilteredTokens: Record<string, unknown>;
}

/**
 * Platform configuration
 */
export interface Platform {
  transformGroup?: string;
  transforms?: string[];
  buildPath?: string;
  files?: FileConfig[];
  options?: Record<string, unknown>;
}

/**
 * File configuration
 */
export interface FileConfig {
  destination: string;
  format: string;
  filter?: string | ((token: TokenData) => boolean);
  options?: Record<string, unknown>;
}

// ============================================================================
// Icon Configuration
// ============================================================================

/**
 * Icon framework options
 */
export type IconFramework = 'react' | 'vue' | 'svelte' | 'web-components';

/**
 * Icon generation configuration
 */
export interface IconsConfig {
  /**
   * Source directory containing SVG icons
   * @default 'icons'
   */
  sourceDir?: string;

  /**
   * Output directory for generated components
   * @default 'dist/icons'
   */
  outputDir?: string;

  /**
   * Framework for generated components
   * @default 'react'
   */
  framework?: IconFramework;

  /**
   * Generate TypeScript files
   * @default true
   */
  typescript?: boolean;

  /**
   * Optimize SVGs with SVGO
   * @default true
   */
  optimize?: boolean;

  /**
   * Icon component prefix
   * @default 'Icon'
   */
  prefix?: string;
}

// ============================================================================
// Resolved Configuration (with all defaults applied)
// ============================================================================

/**
 * Resolved themes config with all defaults applied
 */
export interface ResolvedThemesConfig {
  autoDetect: boolean;
  default: string;
  ignoreModes: string[];
  selectorPattern: Required<ThemeSelectorPattern>;
}

/**
 * Resolved tokens config with all defaults applied
 */
export interface ResolvedTokensConfig {
  source: string;
  sourceDir: string;
  collectionsDir: string;
  sourcePatterns: string[];
  collectionMapping: Record<string, string>;
  outputDir: string;
  outputDirs: Partial<Record<OutputFormat, string>>;
  outputFileNames: Record<OutputFormat, string>;
  prefix: string;
  formats: OutputFormat[];
  additionalScssDirectories: string[];
  additionalCssDirectories: string[];
  mergeOrder: 'before' | 'after';
  createBundle: boolean;
  scssImportHeader?: string;
  themes: ResolvedThemesConfig;
  transforms: CustomTransform[];
  customFormats: CustomFormat[];
  preprocessors: CustomPreprocessor[];
  filters: CustomFilter[];
  onBuildStart?: TokensConfig['onBuildStart'];
  onFormatComplete?: TokensConfig['onFormatComplete'];
  onAllFormatsComplete?: TokensConfig['onAllFormatsComplete'];
  onBuildComplete?: TokensConfig['onBuildComplete'];
  outputReferences: boolean;
  baseFontSize: number;
  separateThemeFiles: boolean;
  watch: boolean;
  watchDirectories: string[];
}

/**
 * Resolved icons config with all defaults applied
 */
export interface ResolvedIconsConfig {
  sourceDir: string;
  outputDir: string;
  framework: IconFramework;
  typescript: boolean;
  optimize: boolean;
  prefix: string;
}

/**
 * Resolved global config with all defaults applied
 */
export interface ResolvedGlobalConfig {
  cwd: string;
  debug: boolean;
  logLevel: LogLevel;
}

/**
 * Fully resolved configuration with all defaults applied
 */
export interface ResolvedConfig {
  tokens: ResolvedTokensConfig;
  icons: ResolvedIconsConfig;
  global: ResolvedGlobalConfig;

  /** Absolute path to config file (if loaded from file) */
  configPath?: string;

  /** Absolute path to config directory */
  configDir: string;
}

// ============================================================================
// Config Loading Types
// ============================================================================

/**
 * Options for loading configuration
 */
export interface LoadConfigOptions {
  /** Working directory to search from */
  cwd?: string;

  /** Explicit config file path */
  configPath?: string;

  /** Override values (highest priority) */
  overrides?: Partial<DsaiConfig>;

  /** Skip config file loading (use defaults + overrides only) */
  skipFile?: boolean;
}

/**
 * Config loading result
 */
export interface LoadConfigResult {
  /** Resolved configuration */
  config: ResolvedConfig;

  /** Path to loaded config file (if any) */
  configPath?: string;

  /** Warnings during loading */
  warnings: string[];
}
