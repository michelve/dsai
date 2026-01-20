/**
 * @fileoverview Zod schemas for DSAI Tools configuration validation
 *
 * Provides comprehensive runtime validation for all configuration options.
 * Schemas mirror the TypeScript types in types.ts for type safety.
 *
 * @module @dsai-io/tools/config/schema
 * @see {@link ./types.ts} for TypeScript type definitions
 */

import { z } from 'zod';

// ============================================================================
// Primitive Schemas
// ============================================================================

/**
 * Log level for CLI output verbosity
 */
export const logLevelSchema = z.enum(['silent', 'error', 'warn', 'info', 'debug', 'verbose']);

/**
 * Output format for token/build outputs
 */
export const outputFormatSchema = z.enum(['css', 'scss', 'less', 'json', 'js', 'ts', 'esm', 'cjs']);

/**
 * Supported frontend frameworks for generated code
 */
export const frameworkSchema = z.enum(['react', 'vue', 'angular', 'svelte', 'vanilla']);

/**
 * File hash type for cache busting
 */
export const hashTypeSchema = z.enum(['content', 'timestamp', 'version', 'none']);

// ============================================================================
// Utility Schemas
// ============================================================================

/**
 * Glob pattern for file matching
 * Must be a non-empty string
 */
export const globPatternSchema = z.string().min(1, 'Glob pattern cannot be empty');

/**
 * File path validation
 * Allows relative or absolute paths
 */
export const filePathSchema = z.string().min(1, 'File path cannot be empty');

/**
 * Semantic version validation (loose)
 * Matches x.y.z format with optional pre-release
 */
export const versionSchema = z.string().refine(
  (val) => {
    const parts = val.split('-');
    const version = parts[0] ?? '';
    const preRelease = parts[1];
    const versionParts = version.split('.');
    if (versionParts.length !== 3) {
      return false;
    }
    for (const part of versionParts) {
      const num = Number(part);
      if (!Number.isInteger(num) || num < 0) {
        return false;
      }
    }
    if (preRelease !== undefined && preRelease.length === 0) {
      return false;
    }
    return true;
  },
  { message: 'Invalid semantic version format' }
);

// ============================================================================
// Transform and Format Schemas
// ============================================================================

/**
 * Custom transform function schema
 * For token value transformations
 */
export const customTransformSchema = z.object({
  name: z.string().min(1, 'Transform name is required'),
  description: z.string().optional(),
  type: z.enum(['value', 'attribute', 'name']).optional().default('value'),
  transform: z.function().args(z.any(), z.any()).returns(z.any()).optional(),
  filter: z.function().args(z.any()).returns(z.boolean()).optional(),
  matcher: z.function().args(z.any()).returns(z.boolean()).optional(),
});

/**
 * Custom format schema for output generation
 */
export const customFormatSchema = z.object({
  name: z.string().min(1, 'Format name is required'),
  description: z.string().optional(),
  formatter: z.function().args(z.any()).returns(z.string()).optional(),
  extension: z.string().min(1).optional(),
});

// ============================================================================
// Theme Configuration Schemas
// ============================================================================

/**
 * Output format enum for validation
 */
const outputFormatEnum = z.enum(['css', 'scss', 'js', 'ts', 'json', 'android', 'ios']);

/**
 * Theme definition schema
 * Defines how a single theme is discovered and built
 */
export const themeDefinitionSchema = z.object({
  isDefault: z.boolean().optional().default(false),
  suffix: z.string().nullable().optional(),
  selector: z.string().min(1, 'Theme selector is required'),
  mediaQuery: z.string().optional(),
  dataAttribute: z.string().optional(),
  outputFiles: z.record(outputFormatEnum, z.string()).optional(),
});

/**
 * Theme selector pattern schema
 */
export const themeSelectorPatternSchema = z.object({
  default: z.string().optional().default(':root'),
  others: z.string().optional().default('[data-dsai-theme="{mode}"]'),
});

/**
 * Themes configuration section
 * Supports both legacy mode-based config and new definitions-based config
 */
export const themesConfigSchema = z.object({
  enabled: z.boolean().optional().default(true),
  autoDetect: z.boolean().optional().default(true),
  default: z.string().optional().default('light'),
  ignoreModes: z.array(z.string()).optional().default([]),
  selectorPattern: themeSelectorPatternSchema.optional(),
  definitions: z.record(z.string(), themeDefinitionSchema).optional(),

  // Legacy fields (for backward compatibility)
  defaultMode: z.enum(['light', 'dark', 'system']).optional(),
  modes: z
    .record(
      z.string(),
      z.object({
        selector: z.string().min(1),
        mediaQuery: z.string().optional(),
        dataAttribute: z.string().optional(),
        cssVariables: z.boolean().optional(),
        generateSeparateFiles: z.boolean().optional(),
        prefix: z.string().optional(),
      })
    )
    .optional(),
  outputFileName: z.string().optional(),
  colorScheme: z
    .object({
      light: z.string().optional(),
      dark: z.string().optional(),
    })
    .optional(),
});

// ============================================================================
// Icon Configuration Schemas
// ============================================================================

/**
 * Icon optimization settings
 */
export const iconOptimizationSchema = z.object({
  enabled: z.boolean().optional().default(true),
  removeComments: z.boolean().optional().default(true),
  removeDimensions: z.boolean().optional().default(false),
  removeViewBox: z.boolean().optional().default(false),
  removeXMLNS: z.boolean().optional().default(true),
  cleanupIds: z.boolean().optional().default(true),
  minify: z.boolean().optional().default(true),
});

/**
 * Icon sprite generation settings
 */
export const iconSpriteSchema = z.object({
  enabled: z.boolean().optional().default(true),
  fileName: z.string().optional().default('icons'),
  format: z.enum(['symbol', 'stack', 'css']).optional().default('symbol'),
  prefix: z.string().optional().default('icon-'),
});

/**
 * Icons configuration section
 */
export const iconsConfigSchema = z.object({
  enabled: z.boolean().optional().default(true),
  sourceDir: z.string().optional().default('assets/icons'),
  outputDir: z.string().optional().default('dist/icons'),
  formats: z
    .array(z.enum(['svg', 'react', 'vue', 'sprite', 'font']))
    .optional()
    .default(['svg']),
  optimization: iconOptimizationSchema.optional(),
  sprite: iconSpriteSchema.optional(),
  componentPrefix: z.string().optional().default('Icon'),
  componentSuffix: z.string().optional().default(''),
  generateIndex: z.boolean().optional().default(true),
  generateTypes: z.boolean().optional().default(true),
});

// ============================================================================
// Token Configuration Schemas
// ============================================================================

/**
 * Token build configuration schema
 */
export const tokenBuildConfigSchema = z.object({
  format: outputFormatSchema,
  outputDir: z.string().optional(),
  outputFileName: z.string().optional(),
  fileExtension: z.string().optional(),
  prefix: z.string().optional(),
  useVariables: z.boolean().optional(),
  selector: z.string().optional(),
  transforms: z.array(z.string()).optional(),
  customTransforms: z.array(customTransformSchema).optional(),
  filter: z
    .function()
    .args(z.any())
    .returns(z.union([z.boolean(), z.promise(z.boolean())]))
    .optional(),
  header: z.string().optional(),
  footer: z.string().optional(),
});

/**
 * Token cache configuration
 */
export const tokenCacheConfigSchema = z.object({
  enabled: z.boolean().optional().default(true),
  directory: z.string().optional().default('.cache'),
  hashType: hashTypeSchema.optional().default('content'),
  maxAge: z.number().optional().default(86400000),
});

/**
 * Token watch mode configuration
 */
export const tokenWatchConfigSchema = z.object({
  enabled: z.boolean().optional().default(false),
  debounce: z.number().optional().default(300),
  clearScreen: z.boolean().optional().default(true),
  ignorePatterns: z.array(z.string()).optional().default([]),
});

/**
 * Token processing hooks
 */
export const tokensHooksSchema = z.object({
  onBuildStart: z
    .function()
    .args(z.any())
    .returns(z.union([z.void(), z.promise(z.void())]))
    .optional(),
  onFormatComplete: z
    .function()
    .args(z.any())
    .returns(z.union([z.void(), z.promise(z.void())]))
    .optional(),
  onAllFormatsComplete: z
    .function()
    .args(z.any())
    .returns(z.union([z.void(), z.promise(z.void())]))
    .optional(),
  onBuildComplete: z
    .function()
    .args(z.any())
    .returns(z.union([z.void(), z.promise(z.void())]))
    .optional(),
  onError: z
    .function()
    .args(z.any())
    .returns(z.union([z.void(), z.promise(z.void())]))
    .optional(),
});

/**
 * Build pipeline step names
 */
export const buildPipelineStepSchema = z.enum([
  'validate',
  'transform',
  'style-dictionary',
  'sync',
  'sass-theme',
  'sass-theme-minified',
  'postprocess',
  'sass-utilities',
  'sass-utilities-minified',
  'bundle',
]);

/**
 * Build pipeline configuration
 * Controls which steps run and their paths
 */
export const tokensBuildPipelineSchema = z.object({
  /**
   * Steps to include in the build.
   * Order matters - steps run in sequence.
   * Default includes all steps for full @dsai-io/tokens build.
   * Simpler packages can use subset like ['validate', 'transform', 'style-dictionary']
   */
  steps: z
    .array(buildPipelineStepSchema)
    .optional()
    .default([
      'validate',
      'transform',
      'style-dictionary',
      'sync',
      'sass-theme',
      'sass-theme-minified',
      'postprocess',
      'sass-utilities',
      'sass-utilities-minified',
      'bundle',
    ]),

  /**
   * Paths configuration for build steps
   */
  paths: z
    .object({
      /** Source file for sync step (Style Dictionary JS output) */
      syncSource: z.string().optional().default('dist/js/tokens.js'),
      /** Target file for sync step */
      syncTarget: z.string().optional().default('src/tokens-flat.ts'),
      /** SCSS theme input file */
      sassThemeInput: z.string().optional().default('src/scss/dsai-theme-bs.scss'),
      /** CSS theme output file */
      sassThemeOutput: z.string().optional().default('dist/css/dsai-theme-bs.css'),
      /** CSS theme minified output file */
      sassThemeMinifiedOutput: z.string().optional().default('dist/css/dsai-theme-bs.min.css'),
      /** SCSS utilities input file */
      sassUtilitiesInput: z.string().optional().default('src/scss/dsai-utilities.scss'),
      /** CSS utilities output file */
      sassUtilitiesOutput: z.string().optional().default('dist/css/dsai.css'),
      /** CSS utilities minified output file */
      sassUtilitiesMinifiedOutput: z.string().optional().default('dist/css/dsai.min.css'),
    })
    .optional(),

  /** Style Dictionary config file name */
  styleDictionaryConfig: z.string().optional().default('sd.config.mjs'),
});

/**
 * Tokens configuration section
 */
export const tokensConfigSchema = z.object({
  enabled: z.boolean().optional().default(true),
  sourcePatterns: z
    .array(z.string())
    .optional()
    .default(['src/tokens/**/*.json', 'src/tokens/**/*.yaml']),
  outputDirs: z
    .object({
      css: z.string().optional().default('dist/css'),
      scss: z.string().optional().default('dist/scss'),
      less: z.string().optional().default('dist/less'),
      js: z.string().optional().default('dist/js'),
      ts: z.string().optional().default('dist/ts'),
      json: z.string().optional().default('dist/json'),
    })
    .optional(),
  additionalScssDirectories: z.array(z.string()).optional().default([]),
  outputFileNames: z
    .object({
      variables: z.string().optional().default('variables'),
      utilities: z.string().optional().default('utilities'),
      mixins: z.string().optional().default('mixins'),
      tokens: z.string().optional().default('tokens'),
    })
    .optional(),
  prefix: z.string().optional().default('dsai'),
  mergeOrder: z.array(z.string()).optional().default(['base', 'semantic', 'component']),
  createBundle: z.boolean().optional().default(true),
  bundleFileName: z.string().optional().default('bundle'),
  formats: z.array(outputFormatSchema).optional().default(['css', 'scss', 'json']),
  platforms: z.record(z.string(), tokenBuildConfigSchema).optional(),
  transforms: z.array(z.string()).optional().default([]),
  customTransforms: z.array(customTransformSchema).optional().default([]),
  customFormats: z.array(customFormatSchema).optional().default([]),
  hooks: tokensHooksSchema.optional(),
  cache: tokenCacheConfigSchema.optional(),
  watch: tokenWatchConfigSchema.optional(),
  verbose: z.boolean().optional().default(false),
  /** Build pipeline configuration */
  pipeline: tokensBuildPipelineSchema.optional(),
});

// ============================================================================
// Global Configuration Schemas
// ============================================================================

/**
 * Global build configuration
 */
export const buildConfigSchema = z.object({
  outDir: z.string().optional().default('dist'),
  clean: z.boolean().optional().default(true),
  sourcemap: z.boolean().optional().default(false),
  minify: z.boolean().optional().default(true),
  parallel: z.boolean().optional().default(true),
  maxConcurrency: z.number().optional().default(4),
});

/**
 * Global configuration section
 */
export const globalConfigSchema = z.object({
  logLevel: logLevelSchema.optional().default('info'),
  colors: z.boolean().optional().default(true),
  ci: z.boolean().optional().default(false),
  dryRun: z.boolean().optional().default(false),
  cwd: z.string().optional(),
  configPath: z.string().optional(),
  framework: frameworkSchema.optional(),
  build: buildConfigSchema.optional(),
});

// ============================================================================
// Root Configuration Schema
// ============================================================================

/**
 * DSAI Tools configuration root schema
 *
 * This is the primary schema used for validating configuration files.
 * It combines all section schemas into a complete configuration object.
 */
export const dsaiConfigSchema = z.object({
  $schema: z.string().optional(),
  extends: z.union([z.string(), z.array(z.string())]).optional(),
  global: globalConfigSchema.optional(),
  tokens: tokensConfigSchema.optional(),
  themes: themesConfigSchema.optional(),
  icons: iconsConfigSchema.optional(),
});

// ============================================================================
// Inferred Types from Schemas
// ============================================================================

/** Inferred LogLevel type from schema */
export type LogLevelFromSchema = z.infer<typeof logLevelSchema>;

/** Inferred OutputFormat type from schema */
export type OutputFormatFromSchema = z.infer<typeof outputFormatSchema>;

/** Inferred Framework type from schema */
export type FrameworkFromSchema = z.infer<typeof frameworkSchema>;

/** Inferred DsaiConfig type from schema */
export type DsaiConfigFromSchema = z.infer<typeof dsaiConfigSchema>;

/** Inferred TokensConfig type from schema */
export type TokensConfigFromSchema = z.infer<typeof tokensConfigSchema>;

/** Inferred ThemesConfig type from schema */
export type ThemesConfigFromSchema = z.infer<typeof themesConfigSchema>;

/** Inferred IconsConfig type from schema */
export type IconsConfigFromSchema = z.infer<typeof iconsConfigSchema>;

/** Inferred GlobalConfig type from schema */
export type GlobalConfigFromSchema = z.infer<typeof globalConfigSchema>;

// ============================================================================
// Validation Functions
// ============================================================================

/**
 * Validation result with typed data
 */
export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: ValidationError[];
}

/**
 * Structured validation error
 */
export interface ValidationError {
  path: string;
  message: string;
  code: string;
  expected?: string;
  received?: string;
}

/**
 * Format Zod errors into user-friendly validation errors
 *
 * @param zodError - Zod error object
 * @returns Array of formatted validation errors
 */
export function formatValidationErrors(zodError: z.ZodError): ValidationError[] {
  return zodError.errors.map((err) => ({
    path: err.path.join('.') || 'root',
    message: err.message,
    code: err.code,
    expected: 'expected' in err ? String(err.expected) : undefined,
    received: 'received' in err ? String(err.received) : undefined,
  }));
}

/**
 * Validate configuration object against schema
 *
 * @param config - Configuration object to validate
 * @returns Validation result with typed data or errors
 *
 * @example
 * ```typescript
 * const result = validateConfig({
 *   tokens: { enabled: true },
 *   themes: { defaultMode: 'dark' }
 * });
 *
 * if (result.success) {
 *   console.log(result.data);
 * } else {
 *   result.errors?.forEach(err => console.error(err.message));
 * }
 * ```
 */
export function validateConfig(config: unknown): ValidationResult<DsaiConfigFromSchema> {
  const result = dsaiConfigSchema.safeParse(config);

  if (result.success) {
    return {
      success: true,
      data: result.data,
    };
  }

  return {
    success: false,
    errors: formatValidationErrors(result.error),
  };
}

/**
 * Validate configuration and throw on errors
 *
 * @param config - Configuration object to validate
 * @returns Validated configuration
 * @throws {Error} If validation fails
 *
 * @example
 * ```typescript
 * try {
 *   const validConfig = validateConfigOrThrow(rawConfig);
 *   // Use validConfig safely
 * } catch (error) {
 *   console.error('Invalid configuration:', error.message);
 * }
 * ```
 */
export function validateConfigOrThrow(config: unknown): DsaiConfigFromSchema {
  const result = validateConfig(config);

  if (!result.success) {
    const errorMessages = result.errors?.map((e) => `  - ${e.path}: ${e.message}`).join('\n');
    throw new Error(`Configuration validation failed:\n${errorMessages}`);
  }

  return result.data as DsaiConfigFromSchema;
}

/**
 * Validate a specific section of the configuration
 *
 * @param section - Section name to validate
 * @param config - Section configuration object
 * @returns Validation result for the section
 */
export function validateConfigSection<T extends keyof DsaiConfigFromSchema>(
  section: T,
  config: unknown
): ValidationResult<NonNullable<DsaiConfigFromSchema[T]>> {
  const sectionSchemas = {
    global: globalConfigSchema,
    tokens: tokensConfigSchema,
    themes: themesConfigSchema,
    icons: iconsConfigSchema,
  } as const;

  const schema = sectionSchemas[section as keyof typeof sectionSchemas];

  if (!schema) {
    return {
      success: false,
      errors: [
        {
          path: section,
          message: `Unknown configuration section: ${section}`,
          code: 'unknown_section',
        },
      ],
    };
  }

  const result = schema.safeParse(config);

  if (result.success) {
    return {
      success: true,
      data: result.data as NonNullable<DsaiConfigFromSchema[T]>,
    };
  }

  return {
    success: false,
    errors: formatValidationErrors(result.error),
  };
}

/**
 * Create a pretty-printed error message from validation errors
 *
 * @param errors - Array of validation errors
 * @returns Formatted error message string
 */
export function formatErrorMessage(errors: ValidationError[]): string {
  const lines = ['Configuration validation failed:', ''];

  for (const error of errors) {
    lines.push(`  ✗ ${error.path}`);
    lines.push(`    ${error.message}`);

    if (error.expected && error.received) {
      lines.push(`    Expected: ${error.expected}`);
      lines.push(`    Received: ${error.received}`);
    }

    lines.push('');
  }

  return lines.join('\n');
}
