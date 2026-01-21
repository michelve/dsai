/**
 * Configuration type definitions for @dsai-io/tools
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

  /**
   * SCSS/CSS output style options
   */
  scss?: ScssOutputConfig;

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

  /**
   * Build pipeline configuration
   * Controls which steps run and their paths
   */
  pipeline?: TokensBuildPipeline;

  /**
   * Postprocess configuration for CSS file transformations
   * Applied after SASS compilation
   */
  postprocess?: PostprocessConfig;
}

/**
 * Postprocess configuration for CSS file transformations
 */
export interface PostprocessConfig {
  /** Whether postprocessing is enabled */
  enabled?: boolean;
  /** Directory containing CSS files to process */
  cssDir?: string;
  /** File names to process */
  files?: string[];
  /** Replacement rules to apply */
  replacements?: Array<{
    description?: string;
    from: string | RegExp;
    to: string;
  }>;
}

/**
 * Build pipeline step names
 */
export type BuildPipelineStep =
  | 'validate'
  | 'snapshot'
  | 'preprocess'
  | 'transform'
  | 'style-dictionary'
  | 'multi-theme'
  | 'sync'
  | 'sass-theme'
  | 'sass-theme-minified'
  | 'postprocess'
  | 'sass-utilities'
  | 'sass-utilities-minified'
  | 'bundle';

/**
 * Build pipeline paths configuration
 */
export interface BuildPipelinePaths {
  /** Source file for sync step (Style Dictionary JS output) */
  syncSource?: string;
  /** Target file for sync step */
  syncTarget?: string;
  /** SCSS theme input file */
  sassThemeInput?: string;
  /** CSS theme output file */
  sassThemeOutput?: string;
  /** CSS theme minified output file */
  sassThemeMinifiedOutput?: string;
  /** SCSS utilities input file */
  sassUtilitiesInput?: string;
  /** CSS utilities output file */
  sassUtilitiesOutput?: string;
  /** CSS utilities minified output file */
  sassUtilitiesMinifiedOutput?: string;
}

/**
 * Build pipeline configuration
 */
export interface TokensBuildPipeline {
  /**
   * Steps to include in the build.
   * Order matters - steps run in sequence.
   * Default includes all steps for full @dsai-io/tokens build.
   * Simpler packages can use subset like ['validate', 'transform', 'style-dictionary']
   */
  steps?: BuildPipelineStep[];

  /**
   * Paths configuration for build steps
   */
  paths?: BuildPipelinePaths;

  /**
   * Style Dictionary config file name
   * @default 'sd.config.mjs'
   */
  styleDictionaryConfig?: string;
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

// ============================================================================
// SCSS Output Configuration
// ============================================================================

/**
 * CSS/SCSS output style options
 * Controls whether to generate expanded, compressed, or both formats
 */
export interface ScssOutputConfig {
  /**
   * Output format styles to generate
   * - 'expanded': Human-readable, formatted CSS
   * - 'compressed': Minified CSS for production
   * @default ['expanded']
   */
  outputStyles?: ('expanded' | 'compressed')[];

  /**
   * Generate source maps for debugging
   * @default false
   */
  generateSourceMaps?: boolean;

  /**
   * Suffix for minified/compressed output files
   * @default '.min'
   * @example '.min' produces 'theme.min.css' alongside 'theme.css'
   */
  minifiedSuffix?: string;

  /**
   * Entry SCSS file for theme compilation
   * Relative to config file location
   * @example 'src/scss/dsai-theme-bs.scss'
   */
  themeEntry?: string;

  /**
   * Entry SCSS file for utilities compilation
   * Relative to config file location
   * @example 'src/scss/dsai-utilities.scss'
   */
  utilitiesEntry?: string;

  /**
   * Output directory for compiled CSS files
   * Relative to config file location
   * @default 'src/generated'
   */
  cssOutputDir?: string;

  /**
   * Additional Sass load paths for @use and @import resolution
   * @default ['node_modules']
   */
  loadPaths?: string[];

  /**
   * Target CSS framework for variable naming conventions
   * Controls how token names are mapped to framework-specific names
   * @default 'bootstrap'
   */
  framework?: FrameworkTarget;

  /**
   * Custom name mappings for token → framework variable names
   * Merged with framework defaults (custom mappings take precedence)
   * @example { 'typography-text-base': 'font-size-base', 'typography-heading-h1': 'h1-font-size' }
   */
  nameMapping?: Record<string, string>;

  /**
   * Output path for generated SCSS variables file
   * Relative to config file location
   * @default 'src/scss/_variables.scss'
   */
  variablesOutput?: string;
}

// ============================================================================
// Framework Target Configuration
// ============================================================================

/**
 * Supported CSS framework targets
 * Each framework has its own naming conventions for variables
 */
export type FrameworkTarget =
  | 'bootstrap' // Bootstrap 5.x naming ($primary, $font-size-base, etc.)
  | 'shadcn' // shadcn/ui CSS variables (--primary, --radius, etc.)
  | 'tailwind' // Tailwind CSS config format
  | 'mui' // Material UI theme format
  | 'custom'; // Custom naming via nameMapping only

/**
 * Framework mapping configuration
 * Defines how Figma token names map to framework-specific variable names
 */
export interface FrameworkMappingConfig {
  /**
   * Framework identifier
   */
  framework: FrameworkTarget;

  /**
   * Token name → framework variable name mappings
   * Keys are Figma/DTCG token names, values are framework variable names
   */
  mappings: Record<string, string>;

  /**
   * Pattern-based mappings using regex
   * Applied after explicit mappings
   * @example [{ pattern: /^typography-heading-(.+)$/, replacement: 'h$1-font-size' }]
   */
  patterns?: FrameworkMappingPattern[];

  /**
   * Variable prefix for this framework
   * @example '$' for SCSS, '--' for CSS custom properties
   */
  variablePrefix?: string;

  /**
   * File header comment
   */
  header?: string;
}

/**
 * Pattern-based name mapping rule
 */
export interface FrameworkMappingPattern {
  /**
   * Regex pattern to match token names
   */
  pattern: RegExp | string;

  /**
   * Replacement string (supports $1, $2, etc. for capture groups)
   */
  replacement: string;

  /**
   * Optional description for documentation
   */
  description?: string;
}

/**
 * Individual theme definition
 * Specifies how a theme is discovered and built
 */
export interface ThemeDefinition {
  /**
   * Whether this is the default theme (uses :root selector)
   * Only one theme can be default
   * @default false
   */
  isDefault?: boolean;

  /**
   * File suffix pattern for this theme
   * null means files without any theme suffix (default theme)
   * e.g., '-dark' matches files like 'foundation-dark.json'
   * @default null for default theme, '-{themeName}' for others
   */
  suffix?: string | null;

  /**
   * CSS selector for this theme
   * @example ':root' for default, '[data-dsai-theme="dark"]' for dark
   */
  selector: string;

  /**
   * Optional media query for automatic switching
   * @example '(prefers-color-scheme: dark)'
   */
  mediaQuery?: string;

  /**
   * Optional data attribute (derived from selector if not specified)
   */
  dataAttribute?: string;

  /**
   * Custom output file names per format
   * If not specified, uses default naming pattern with theme suffix
   */
  outputFiles?: Partial<Record<OutputFormat, string>>;
}

/**
 * Theme configuration
 */
export interface ThemesConfig {
  /**
   * Enable/disable theme processing
   * @default true
   */
  enabled?: boolean;

  /**
   * Auto-detect available modes from Figma export
   * When true, scans for files with theme suffixes
   * When false, only builds themes explicitly defined in definitions
   * @default true
   */
  autoDetect?: boolean;

  /**
   * Default theme mode (uses :root selector)
   * @default 'light'
   * @deprecated Use definitions with isDefault: true instead
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

  /**
   * Explicit theme definitions
   * Key is theme name, value is theme configuration
   * When specified, provides explicit control over theme builds
   */
  definitions?: Record<string, ThemeDefinition>;
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
 * Resolved theme definition with all required fields
 */
export interface ResolvedThemeDefinition {
  /** Whether this is the default theme */
  isDefault: boolean;
  /** File suffix pattern (null for default theme) */
  suffix: string | null;
  /** CSS selector */
  selector: string;
  /** Optional media query */
  mediaQuery?: string;
  /** Optional data attribute */
  dataAttribute?: string;
  /** Output file names per format */
  outputFiles: Record<OutputFormat, string>;
}

/**
 * Resolved themes config with all defaults applied
 */
export interface ResolvedThemesConfig {
  /** Whether themes are enabled */
  enabled: boolean;
  /** Auto-detect themes from files */
  autoDetect: boolean;
  /** Default theme name (for backward compat) */
  default: string;
  /** Modes to ignore */
  ignoreModes: string[];
  /** Selector patterns */
  selectorPattern: Required<ThemeSelectorPattern>;
  /** Resolved theme definitions */
  definitions: Record<string, ResolvedThemeDefinition>;
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
  pipeline?: TokensBuildPipeline;
  scss?: {
    cssOutputDir?: string;
  };
  postprocess?: {
    enabled?: boolean;
    cssDir?: string;
    files?: string[];
    replacements?: Array<{
      description?: string;
      from: string | RegExp;
      to: string;
    }>;
  };
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
