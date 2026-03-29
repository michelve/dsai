/**
 * @file Theme Builder Module
 * @description Builds token outputs for a single theme using Style Dictionary
 *
 * This module orchestrates the build process for individual themes, generating
 * the appropriate Style Dictionary configuration based on the theme definition.
 *
 * Key responsibilities:
 * - Generate Style Dictionary config for a theme
 * - Use correct CSS format based on theme type (default vs non-default)
 * - Support all output formats (CSS, SCSS, JS, TS, JSON)
 * - Generate output file paths from theme definition
 *
 * @example
 * ```typescript
 * import { buildTheme, generateThemeBuildConfig } from '@dsai-io/tools';
 *
 * const result = await buildTheme({
 *   themeName: 'dark',
 *   themeDefinition: {
 *     isDefault: false,
 *     suffix: '-dark',
 *     selector: '[data-dsai-theme="dark"]',
 *     outputFiles: { css: 'tokens-dark.css' },
 *   },
 *   files: ['collections/color-dark.json', 'collections/semantic-dark.json'],
 *   outputDir: 'dist',
 *   config: resolvedConfig,
 * });
 * ```
 *
 * @module @dsai-io/tools/tokens/theme-builder
 */

import { existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

import type { OutputFormat, ResolvedThemeDefinition, ThemeDefinition } from '../config/types.js';
import type { StyleDictionaryInstance } from './style-dictionary/types.js';

// ============================================================================
// Types
// ============================================================================

/**
 * Minimal configuration required for theme building
 *
 * This interface only includes the properties actually used by the theme builder,
 * allowing callers to pass either a full ResolvedTokensConfig or a minimal object.
 */
export interface ThemeBuildConfig {
  /** Output formats to generate */
  formats: OutputFormat[];

  /** CSS custom property prefix (e.g., '--dsai-') */
  prefix?: string;

  /** Theme definitions (used by buildAllThemes to lookup theme metadata) */
  themes?: {
    definitions?: Record<string, ThemeDefinition | ResolvedThemeDefinition>;
  };
}

/**
 * Options for building a single theme
 */
export interface ThemeBuildOptions {
  /** Name of the theme (e.g., 'light', 'dark', 'pro') */
  themeName: string;

  /** Resolved theme definition with all required fields */
  themeDefinition: ResolvedThemeDefinition;

  /** Array of token file paths for this theme */
  files: string[];

  /** Output directory for generated files */
  outputDir: string;

  /** Build configuration (formats and optionally theme definitions) */
  config: ThemeBuildConfig;

  /** Enable verbose logging */
  verbose?: boolean;

  /** Skip cache lookup (force rebuild) */
  skipCache?: boolean;
}

/**
 * Result of building a single theme
 */
export interface ThemeBuildResult {
  /** Whether the build succeeded */
  success: boolean;

  /** Theme name that was built */
  themeName: string;

  /** Generated output files by format */
  outputs: Partial<Record<OutputFormat, string[]>>;

  /** Error message if build failed */
  error?: string;

  /** Duration in milliseconds */
  duration: number;

  /** Whether result was from cache */
  fromCache: boolean;
}

/**
 * Style Dictionary configuration for a theme
 */
export interface ThemeStyleDictionaryConfig {
  /** Source token files */
  source: string[];

  /** Platform configurations */
  platforms: Record<string, StyleDictionaryPlatformConfig>;

  /** Preprocessors to apply before building */
  preprocessors?: string[];

  /** Whether tokens use DTCG format ($value, $type, etc.) */
  usesDtcg?: boolean;

  /** Logging configuration */
  log?: {
    warnings?: 'warn' | 'error' | 'disabled';
    verbosity?: 'default' | 'silent' | 'verbose';
    errors?: {
      brokenReferences?: 'throw' | 'console';
    };
  };
}

/**
 * Style Dictionary platform configuration
 */
export interface StyleDictionaryPlatformConfig {
  /** Transform group to use */
  transformGroup?: string;

  /** Build path for outputs */
  buildPath: string;

  /** Output file configurations */
  files: StyleDictionaryFileConfig[];

  /** Custom options for formats */
  options?: Record<string, unknown>;
}

/**
 * Style Dictionary file configuration
 */
export interface StyleDictionaryFileConfig {
  /** Output file path (relative to buildPath) */
  destination: string;

  /** Format to use for output */
  format: string;

  /** Filter for tokens to include */
  filter?: Record<string, unknown>;

  /** Format-specific options */
  options?: Record<string, unknown>;
}

// ============================================================================
// Constants
// ============================================================================

/**
 * Format config type for mapping
 */
interface FormatConfig {
  default: string;
  themed: string;
}

/**
 * Mapping of OutputFormat to Style Dictionary format names
 * Using Map for safe access (avoids Object Injection Sink)
 */
const FORMAT_MAPPING = new Map<OutputFormat, FormatConfig>([
  ['css', { default: 'css/variables-with-comments', themed: 'css/variables-dark-mode' }],
  ['scss', { default: 'scss/variables', themed: 'scss/variables' }],
  ['js', { default: 'javascript/esm-safe', themed: 'javascript/esm-safe' }],
  ['ts', { default: 'typescript/declarations', themed: 'typescript/declarations' }],
  ['json', { default: 'json/nested', themed: 'json/nested' }],
  ['android', { default: 'android/resources', themed: 'android/resources' }],
  ['ios', { default: 'ios/macros', themed: 'ios/macros' }],
]);

/**
 * Default Style Dictionary transform groups by platform
 * Using Map for safe access (avoids Object Injection Sink)
 * Note: Style Dictionary built-in groups are: web, js, scss, css, less, html, android, compose, ios, ios-swift, assets, flutter, react-native
 *
 * We use 'js-custom' for JS/TS to ensure valid JavaScript identifiers with our custom name/js-identifier transform
 */
const TRANSFORM_GROUPS = new Map<OutputFormat, string>([
  ['css', 'custom/css'],
  ['scss', 'scss'],
  ['js', 'js-custom'], // Use custom transform group for valid JS identifiers
  ['ts', 'js-custom'], // TypeScript uses same transforms as JS
  ['json', 'web'], // JSON uses web transforms (no "json" transformGroup exists)
  ['android', 'android'],
  ['ios', 'ios'],
]);

// ============================================================================
// Configuration Generators
// ============================================================================

/**
 * Generate Style Dictionary configuration for a single theme
 *
 * @param options - Theme build options
 * @returns Style Dictionary configuration object
 *
 * @example
 * ```typescript
 * const sdConfig = generateThemeBuildConfig({
 *   themeName: 'dark',
 *   themeDefinition: { isDefault: false, selector: '[data-dsai-theme="dark"]' },
 *   files: ['collections/color-dark.json'],
 *   outputDir: 'dist',
 *   config: resolvedConfig,
 * });
 * // Returns Style Dictionary config with dark mode format
 * ```
 */
export function generateThemeBuildConfig(options: ThemeBuildOptions): ThemeStyleDictionaryConfig {
  const { themeDefinition, files, outputDir, config } = options;
  const isDefault = themeDefinition.isDefault;

  // Build platforms based on enabled formats using Map for safe access
  const platformsMap = new Map<string, StyleDictionaryPlatformConfig>();
  const enabledFormats = config.formats;

  for (const format of enabledFormats) {
    const platformConfig = generatePlatformConfig(
      format,
      themeDefinition,
      outputDir,
      isDefault,
      config.prefix
    );
    if (platformConfig) {
      platformsMap.set(format, platformConfig);
    }
  }

  // Convert Map to object for Style Dictionary compatibility
  const platforms: Record<string, StyleDictionaryPlatformConfig> = Object.fromEntries(platformsMap);

  return {
    source: files,
    platforms,
    preprocessors: ['fix-references'],
    // Enable DTCG format support (tokens with $value, $type, etc.)
    usesDtcg: true,
    // Configure logging to not throw on broken references (they'll be logged but build continues)
    log: {
      warnings: 'warn' as const,
      verbosity: 'default' as const,
      errors: {
        brokenReferences: 'console' as const,
      },
    },
  };
}

/**
 * Generate platform configuration for a specific output format
 *
 * @param format - Output format (css, scss, js, etc.)
 * @param themeDefinition - Theme definition
 * @param outputDir - Output directory
 * @param isDefault - Whether this is the default theme
 * @returns Style Dictionary platform configuration
 */
function generatePlatformConfig(
  format: OutputFormat,
  themeDefinition: ResolvedThemeDefinition,
  outputDir: string,
  isDefault: boolean,
  prefix?: string
): StyleDictionaryPlatformConfig | null {
  const formatConfig = FORMAT_MAPPING.get(format);
  if (!formatConfig) {
    console.warn(`Unknown format: ${format}`);
    return null;
  }

  const sdFormat = isDefault ? formatConfig.default : formatConfig.themed;

  // Use Map for safe access to outputFiles
  const outputFilesMap = new Map(Object.entries(themeDefinition.outputFiles));
  const outputFile = outputFilesMap.get(format) ?? `tokens.${format}`;

  // Determine subdirectory based on format
  const subDir = getFormatSubdirectory(format);
  const buildPath = subDir ? join(outputDir, subDir) + '/' : outputDir + '/';

  const fileConfig: StyleDictionaryFileConfig = {
    destination: outputFile,
    format: sdFormat,
  };

  // Add prefix option for CSS/SCSS formats
  if (prefix && (format === 'css' || format === 'scss')) {
    fileConfig.options = {
      ...fileConfig.options,
      prefix,
    };
  }

  // Add selector option for themed CSS
  if (format === 'css' && !isDefault) {
    fileConfig.options = {
      ...fileConfig.options,
      selector: themeDefinition.selector,
    };
  }

  // Add media query if defined
  if (themeDefinition.mediaQuery && format === 'css' && !isDefault) {
    const existingOptions = fileConfig.options ?? {};
    fileConfig.options = {
      ...existingOptions,
      mediaQuery: themeDefinition.mediaQuery,
    };
  }

  const transformGroup = TRANSFORM_GROUPS.get(format) ?? format;

  return {
    transformGroup,
    buildPath,
    files: [fileConfig],
  };
}

/**
 * Get subdirectory for a format (e.g., 'css' -> 'css', 'js' -> 'js')
 *
 * @param format - Output format
 * @returns Subdirectory name
 */
function getFormatSubdirectory(format: OutputFormat): string {
  switch (format) {
    case 'css':
      return 'css';
    case 'scss':
      return 'scss';
    case 'js':
      return 'js';
    case 'ts':
      return 'ts';
    case 'json':
      return 'json';
    case 'android':
      return 'android';
    case 'ios':
      return 'ios';
    default:
      return '';
  }
}

// ============================================================================
// Build Functions
// ============================================================================

/**
 * Build token outputs for a single theme
 *
 * This function generates Style Dictionary configuration from the theme
 * definition and runs the build process. For default themes, it uses
 * `css/variables-with-comments` format with `:root` selector. For
 * non-default themes, it uses `css/variables-dark-mode` with the
 * theme-specific selector.
 *
 * @param options - Theme build options
 * @returns Build result with success status and output files
 *
 * @example
 * ```typescript
 * const result = await buildTheme({
 *   themeName: 'dark',
 *   themeDefinition: resolvedThemeDef,
 *   files: ['collections/color-dark.json'],
 *   outputDir: 'dist',
 *   config: resolvedConfig,
 *   verbose: true,
 * });
 *
 * if (result.success) {
 *   console.log('Built files:', result.outputs);
 * }
 * ```
 */
export async function buildTheme(options: ThemeBuildOptions): Promise<ThemeBuildResult> {
  const startTime = Date.now();
  const { themeName, files, verbose } = options;

  // Validate inputs
  if (files.length === 0) {
    return {
      success: false,
      themeName,
      outputs: {},
      error: `No token files found for theme "${themeName}"`,
      duration: Date.now() - startTime,
      fromCache: false,
    };
  }

  // Validate files exist (resolve to absolute paths for checking)
  const missingFiles: string[] = [];
  for (const file of files) {
    const resolvedPath = resolve(file);
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    if (!existsSync(resolvedPath)) {
      missingFiles.push(file);
    }
  }
  if (missingFiles.length > 0) {
    return {
      success: false,
      themeName,
      outputs: {},
      error: `Missing token files for theme "${themeName}": ${missingFiles.join(', ')}`,
      duration: Date.now() - startTime,
      fromCache: false,
    };
  }

  if (verbose) {
    console.warn(`🎨 Building theme: ${themeName}`);
    console.warn(`   Files: ${files.length}`);
    console.warn(`   Default: ${options.themeDefinition.isDefault}`);
    console.warn(`   Selector: ${options.themeDefinition.selector}`);
  }

  try {
    // Generate Style Dictionary configuration
    const sdConfig = generateThemeBuildConfig(options);

    if (verbose) {
      console.warn(`   Platforms: ${Object.keys(sdConfig.platforms).join(', ')}`);
      console.warn(`   Enabled formats: ${options.config.formats.join(', ')}`);
      // Debug: show platform build paths
      for (const [platform, platformCfg] of Object.entries(sdConfig.platforms)) {
        console.warn(
          `   ${platform}: ${platformCfg.buildPath} -> ${platformCfg.files[0]?.destination}`
        );
      }
    }

    // Run Style Dictionary build
    const outputs = await runStyleDictionaryBuild(sdConfig, options);

    return {
      success: true,
      themeName,
      outputs,
      duration: Date.now() - startTime,
      fromCache: false,
    };
  } catch (error) {
    return {
      success: false,
      themeName,
      outputs: {},
      error: error instanceof Error ? error.message : 'Unknown build error',
      duration: Date.now() - startTime,
      fromCache: false,
    };
  }
}

/**
 * Run Style Dictionary build with generated configuration
 *
 * @param sdConfig - Style Dictionary configuration
 * @param options - Build options for context
 * @returns Map of format to output file paths
 */
async function runStyleDictionaryBuild(
  sdConfig: ThemeStyleDictionaryConfig,
  options: ThemeBuildOptions
): Promise<Partial<Record<OutputFormat, string[]>>> {
  // Dynamic import to avoid circular dependencies
  const StyleDictionaryModule = await import('style-dictionary');
  const StyleDictionary = StyleDictionaryModule.default;

  // Register custom formats using type assertion for compatibility
  const { registerFormats: registerCustomFormats } =
    await import('./style-dictionary/formats/index.js');
  registerCustomFormats(StyleDictionary as unknown as StyleDictionaryInstance);

  // Register custom transforms
  const { registerTransforms: registerCustomTransforms } =
    await import('./style-dictionary/transforms/index.js');
  registerCustomTransforms(StyleDictionary as unknown as StyleDictionaryInstance);

  // Register custom transform groups (including js-custom with name/js-identifier)
  const { registerTransformGroups } = await import('./style-dictionary/groups/index.js');
  registerTransformGroups(StyleDictionary as unknown as StyleDictionaryInstance);

  // Register custom preprocessors (fix-references for path mapping)
  const { registerPreprocessors } = await import('./style-dictionary/preprocessors/index.js');
  registerPreprocessors(StyleDictionary as unknown as StyleDictionaryInstance);

  // Debug: log platforms being built
  if (options.verbose) {
    console.warn(`   🔧 Style Dictionary platforms:`);
    for (const [platform, config] of Object.entries(sdConfig.platforms)) {
      console.warn(
        `      ${platform}: transformGroup="${config.transformGroup}", format="${config.files[0]?.format}"`
      );
    }
  }

  // Create and build Style Dictionary instance
  // Note: The built-in 'js' transform group includes 'name/pascal' which
  // generates valid JS identifiers like 'Spacing0', 'NeutralGray100', etc.
  const sd = new StyleDictionary(sdConfig);

  // Build all platforms and capture any errors
  try {
    await sd.buildAllPlatforms();
  } catch (error) {
    console.error(`❌ Style Dictionary build failed:`, error);
    throw error;
  }

  // Collect output files using Map for safe access
  const outputsMap = new Map<OutputFormat, string[]>();

  for (const [platformName, platformConfig] of Object.entries(sdConfig.platforms)) {
    const format = platformName as OutputFormat;
    const outputFiles = platformConfig.files.map((f) =>
      join(platformConfig.buildPath, f.destination)
    );
    outputsMap.set(format, outputFiles);
  }

  const outputs: Partial<Record<OutputFormat, string[]>> = Object.fromEntries(outputsMap);

  if (options.verbose) {
    const totalFiles = Object.values(outputs).flat().length;
    console.warn(`   ✅ Generated ${totalFiles} output files`);
    // Debug: check if files actually exist
    for (const [format, files] of Object.entries(outputs)) {
      for (const file of files) {
        // eslint-disable-next-line security/detect-non-literal-fs-filename
        const exists = existsSync(file);
        if (!exists) {
          console.warn(`   ⚠️  Missing: ${format} -> ${file}`);
        }
      }
    }
  }

  return outputs;
}

// ============================================================================
// Batch Build Functions
// ============================================================================

/**
 * Options for building multiple themes
 */
export interface MultiThemeBuildOptions {
  /** Build configuration with formats and theme definitions */
  config: ThemeBuildConfig;

  /** Map of theme name to file paths */
  themeFiles: Map<string, string[]>;

  /** Output directory for all themes */
  outputDir: string;

  /** Enable verbose logging */
  verbose?: boolean;

  /** Only build these specific themes (if not set, build all) */
  themes?: string[];

  /** Skip cache lookup */
  skipCache?: boolean;
}

/**
 * Result of building multiple themes
 */
export interface MultiThemeBuildResult {
  /** Overall success (true if all themes succeeded) */
  success: boolean;

  /** Individual theme results */
  results: ThemeBuildResult[];

  /** Total duration in milliseconds */
  duration: number;

  /** Number of themes built successfully */
  successCount: number;

  /** Number of themes that failed */
  failCount: number;
}

/**
 * Build multiple themes in sequence
 *
 * This function iterates through all configured themes and builds each one
 * using the appropriate Style Dictionary configuration. It collects results
 * and returns a summary of the build process.
 *
 * @param options - Multi-theme build options
 * @returns Aggregated build results
 *
 * @example
 * ```typescript
 * const result = await buildAllThemes({
 *   config: resolvedConfig,
 *   themeFiles: new Map([
 *     ['light', ['collections/color.json']],
 *     ['dark', ['collections/color-dark.json']],
 *   ]),
 *   outputDir: 'dist',
 *   verbose: true,
 * });
 *
 * console.log(`Built ${result.successCount}/${result.results.length} themes`);
 * ```
 */
export async function buildAllThemes(
  options: MultiThemeBuildOptions
): Promise<MultiThemeBuildResult> {
  const startTime = Date.now();
  const { config, themeFiles, outputDir, verbose, themes } = options;

  // Get theme definitions
  const definitions = config.themes?.definitions ?? {};
  const definitionsMap = new Map(Object.entries(definitions));

  // Determine which themes to build
  const themesToBuild = themes ?? Array.from(themeFiles.keys());
  const results: ThemeBuildResult[] = [];

  if (verbose) {
    console.warn(`\n🎨 Building ${themesToBuild.length} themes...`);
  }

  // Find the default theme's files (needed for non-default themes to resolve references)
  const defaultThemeName = Array.from(definitionsMap.entries()).find(
    ([_, def]) => def.isDefault
  )?.[0];
  const defaultThemeFiles = defaultThemeName ? (themeFiles.get(defaultThemeName) ?? []) : [];

  // Build each theme
  for (const themeName of themesToBuild) {
    const rawThemeDefinition = definitionsMap.get(themeName);
    const themeSpecificFiles = themeFiles.get(themeName);

    if (!rawThemeDefinition) {
      results.push({
        success: false,
        themeName,
        outputs: {},
        error: `No theme definition found for "${themeName}"`,
        duration: 0,
        fromCache: false,
      });
      continue;
    }

    if (!themeSpecificFiles || themeSpecificFiles.length === 0) {
      results.push({
        success: false,
        themeName,
        outputs: {},
        error: `No files found for theme "${themeName}"`,
        duration: 0,
        fromCache: false,
      });
      continue;
    }

    // For non-default themes, include default theme files first, then theme-specific files
    // This allows references to be resolved and theme-specific values to override defaults
    const isDefault = rawThemeDefinition.isDefault ?? false;
    let files: string[];
    if (isDefault) {
      files = themeSpecificFiles;
    } else {
      // Include default files first, then theme-specific files (which override)
      files = [...defaultThemeFiles, ...themeSpecificFiles];
    }

    // Resolve the theme definition to ensure all required fields are present
    const baseOutputFiles = rawThemeDefinition.outputFiles ?? {};
    const themeDefinition: ResolvedThemeDefinition = {
      isDefault,
      suffix: rawThemeDefinition.suffix ?? (isDefault ? null : `-${themeName}`),
      selector:
        rawThemeDefinition.selector ?? (isDefault ? ':root' : `[data-dsai-theme="${themeName}"]`),
      mediaQuery: rawThemeDefinition.mediaQuery,
      dataAttribute: rawThemeDefinition.dataAttribute ?? `data-dsai-theme="${themeName}"`,
      outputFiles: {
        css: baseOutputFiles.css ?? (isDefault ? 'tokens.css' : `tokens-${themeName}.css`),
        scss:
          baseOutputFiles.scss ?? (isDefault ? '_variables.scss' : `_variables-${themeName}.scss`),
        js: baseOutputFiles.js ?? (isDefault ? 'tokens.js' : `tokens-${themeName}.js`),
        ts: baseOutputFiles.ts ?? (isDefault ? 'tokens.d.ts' : `tokens-${themeName}.d.ts`),
        json: baseOutputFiles.json ?? (isDefault ? 'tokens.json' : `tokens-${themeName}.json`),
        android: baseOutputFiles.android ?? (isDefault ? 'tokens.xml' : `tokens-${themeName}.xml`),
        ios: baseOutputFiles.ios ?? (isDefault ? 'tokens.h' : `tokens-${themeName}.h`),
      },
    };

    const result = await buildTheme({
      themeName,
      themeDefinition,
      files,
      outputDir,
      config,
      verbose,
      skipCache: options.skipCache,
    });

    results.push(result);
  }

  // Calculate totals
  const successCount = results.filter((r) => r.success).length;
  const failCount = results.filter((r) => !r.success).length;

  if (verbose) {
    console.warn(`\n📊 Theme Build Summary`);
    console.warn(`   Total: ${results.length}`);
    console.warn(`   Success: ${successCount}`);
    console.warn(`   Failed: ${failCount}`);
    console.warn(`   Duration: ${Date.now() - startTime}ms`);

    // Log failed themes
    const failed = results.filter((r) => !r.success);
    if (failed.length > 0) {
      console.warn(`\n❌ Failed themes:`);
      for (const f of failed) {
        console.warn(`   - ${f.themeName}: ${f.error}`);
      }
    }
  }

  return {
    success: failCount === 0,
    results,
    duration: Date.now() - startTime,
    successCount,
    failCount,
  };
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Get the appropriate CSS format for a theme
 *
 * @param isDefault - Whether this is the default theme
 * @returns Style Dictionary format name
 */
export function getCssFormat(isDefault: boolean): string {
  return isDefault ? 'css/variables-with-comments' : 'css/variables-dark-mode';
}

/**
 * Get the CSS selector for a theme
 *
 * @param themeDefinition - Resolved theme definition
 * @returns CSS selector string
 */
export function getThemeSelector(themeDefinition: ResolvedThemeDefinition): string {
  return themeDefinition.isDefault ? ':root' : themeDefinition.selector;
}

/**
 * Validate theme definitions for conflicts
 *
 * Checks for:
 * - Multiple default themes
 * - Duplicate selectors
 * - Duplicate suffixes
 *
 * @param definitions - Map of theme name to definition
 * @returns Array of validation error messages
 */
export function validateThemeDefinitions(
  definitions: Map<string, ResolvedThemeDefinition>
): string[] {
  const errors: string[] = [];
  const selectors = new Map<string, string>();
  const suffixes = new Map<string, string>();
  let defaultCount = 0;
  let defaultTheme = '';

  for (const [name, def] of definitions) {
    // Check for multiple defaults
    if (def.isDefault) {
      defaultCount++;
      if (defaultCount > 1) {
        errors.push(`Multiple default themes defined: "${defaultTheme}" and "${name}"`);
      }
      defaultTheme = name;
    }

    // Check for duplicate selectors
    const existingSelector = selectors.get(def.selector);
    if (existingSelector) {
      errors.push(
        `Duplicate selector "${def.selector}" used by themes "${existingSelector}" and "${name}"`
      );
    } else {
      selectors.set(def.selector, name);
    }

    // Check for duplicate suffixes
    const suffix = def.suffix ?? '';
    const existingSuffix = suffixes.get(suffix);
    if (existingSuffix && suffix !== '') {
      errors.push(`Duplicate suffix "${suffix}" used by themes "${existingSuffix}" and "${name}"`);
    } else if (suffix !== '') {
      suffixes.set(suffix, name);
    }
  }

  // Ensure at least one default
  if (defaultCount === 0 && definitions.size > 0) {
    errors.push('No default theme defined. One theme must have isDefault: true');
  }

  return errors;
}
