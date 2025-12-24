# Task: Configuration System Implementation

**Task ID:** TASK-102
**Title:** Extensible Configuration System with Schema Validation
**Priority:** High
**Status:** ✅ Complete
**Assigned To:** AI Assistant
**Blocked by Task:** TASK-101
**Created:** 2024-12-23
**Updated:** 2025-01-15

---

## 📋 Task Description

### Goal

Implement a robust, extensible configuration system that allows enterprise teams to customize every aspect of the DSAi tooling without modifying source code. The system should support multiple config formats, layered resolution, schema validation, and sensible defaults.

### Problem/Issue

Current configuration limitations:

1. **Single Config File**: Only `tokens.config.json` in package root
2. **No Override Mechanism**: Can't provide project-level overrides
3. **No Environment Support**: Can't use env vars for CI/CD
4. **No Validation**: Invalid configs fail at runtime with unclear errors
5. **No TypeScript Support**: JSON config has no autocomplete
6. **Hardcoded Values**: Prefix, paths, selectors are hardcoded in sd.config.mjs

### Expected Outcome

A configuration system that:

1. Resolves configs from multiple sources (CLI → env → file → defaults)
2. Supports multiple formats (`.mjs`, `.js`, `.json`, `.yaml`)
3. Validates configs with Zod schemas and helpful error messages
4. Provides `defineConfig()` helper for TypeScript autocomplete
5. Exports all configuration types for consumers
6. Merges partial configs with smart defaults

---

## 🎯 Acceptance Criteria

### Config Resolution

- [ ] Searches for config in order: CLI arg → `dsai.config.mjs` → `dsai.config.js` → `.dsairc.json` → `tokens.config.json` (legacy)
- [ ] Resolves paths relative to config file location
- [ ] Supports `--config <path>` CLI override
- [ ] Supports `DSAI_CONFIG` environment variable
- [ ] Works from any subdirectory (walks up to find config)

### Config Formats

- [ ] `dsai.config.mjs` (ESM JavaScript - primary)
- [ ] `dsai.config.js` (CommonJS JavaScript)
- [ ] `dsai.config.ts` (TypeScript - with tsx/ts-node)
- [ ] `.dsairc.json` (JSON)
- [ ] `.dsairc.yaml` (YAML - optional)
- [ ] `tokens.config.json` (legacy support with deprecation warning)

### Schema Validation

- [ ] Zod schema for all config options
- [ ] Helpful error messages with field paths
- [ ] Type coercion where sensible
- [ ] Unknown field warnings (not errors)
- [ ] JSON Schema export for IDE support

### TypeScript Support

- [ ] `defineConfig()` function with full types
- [ ] All interfaces exported
- [ ] Autocomplete in config files
- [ ] Type-safe config access in code

### Environment Variables

- [ ] `DSAI_PREFIX` → tokens.prefix
- [ ] `DSAI_OUTPUT_DIR` → tokens.outputDir
- [ ] `DSAI_SOURCE_DIR` → tokens.sourceDir
- [ ] `DSAI_THEME_DEFAULT` → tokens.themes.default
- [ ] `DSAI_DEBUG` → enables verbose logging
- [ ] `DSAI_ADDITIONAL_SCSS_DIRS` → tokens.additionalScssDirectories (comma-separated)
- [ ] `DSAI_ADDITIONAL_CSS_DIRS` → tokens.additionalCssDirectories (comma-separated)
- [ ] `DSAI_CREATE_BUNDLE` → tokens.createBundle

### Source Configuration (Figma Integration)

- [ ] `sourcePatterns` - glob patterns for finding Figma export files
- [ ] `collectionMapping` - map collection names to specific file paths
- [ ] Support multiple naming conventions (theme.json, tokens.json, \*.tokens.json)
- [ ] Auto-detection of Figma Variables export format

### Output Configuration (Per-Format)

- [ ] `outputDirs` - separate output directories per format (CSS, SCSS, JS, etc.)
- [ ] `outputFileNames` - customizable file names with `{theme}`, `{name}` placeholders
- [ ] Validate output paths don't overlap

### Style Merge/Bundle Configuration

- [ ] `additionalScssDirectories` - extra SCSS directories to merge
- [ ] `additionalCssDirectories` - extra CSS directories to merge
- [ ] `mergeOrder` - control whether user styles come before/after tokens
- [ ] `createBundle` - generate combined bundle files
- [ ] `scssImportHeader` - custom SCSS import at top of generated files

### Build Hooks

- [ ] `onBuildStart` - hook before build begins
- [ ] `onFormatComplete` - hook after each format generates
- [ ] `onAllFormatsComplete` - hook after all formats complete
- [ ] `onBuildComplete` - hook with full build summary

### Default Values

- [ ] All options have sensible defaults
- [ ] Partial configs merged correctly
- [ ] Nested object merging (not replace)
- [ ] Array handling configurable (replace vs merge)

---

## 📂 Files to Create/Modify

### New Files

```
packages/@dsai/tools/src/config/
├── index.ts              # Public exports
├── types.ts              # TypeScript interfaces
├── schema.ts             # Zod schemas
├── defaults.ts           # Default configuration
├── resolver.ts           # Config resolution logic
├── loader.ts             # File loading utilities
├── validator.ts          # Validation utilities
├── env.ts                # Environment variable parsing
└── migrate.ts            # Legacy config migration
```

### Template Files

```
packages/@dsai/tools/templates/
├── dsai.config.mjs       # ESM template
├── dsai.config.js        # CJS template
├── .dsairc.json          # JSON template
└── dsai.config.schema.json  # JSON Schema for IDE
```

---

## 🔗 Dependencies

### Prerequisites

- [ ] TASK-101: Package Scaffolding (provides base structure)

### Blocks

- TASK-103: Token Scripts (needs config loading)
- TASK-104: Style Dictionary (needs config for SD)
- TASK-105: CLI (needs config commands)

### New Dependencies

```json
{
  "dependencies": {
    "cosmiconfig": "^9.0.0",
    "zod": "^3.23.0",
    "zod-to-json-schema": "^3.22.0",
    "deepmerge": "^4.3.1"
  }
}
```

---

## 🧪 Testing Requirements

### Unit Tests

- [ ] Schema validation tests (valid/invalid configs)
- [ ] Config resolution order tests
- [ ] Default merging tests
- [ ] Environment variable parsing tests
- [ ] Legacy config migration tests

### Integration Tests

- [ ] Load config from different formats
- [ ] Config file discovery from subdirectory
- [ ] CLI config override
- [ ] Missing config (uses defaults)

### Edge Cases

- [ ] Empty config file
- [ ] Config with only partial values
- [ ] Config with unknown fields
- [ ] Circular references in config
- [ ] Config file syntax errors

---

## 📖 Documentation Requirements

- [ ] JSDoc on all public functions
- [ ] README section on configuration
- [ ] All options documented with examples
- [ ] Migration guide from legacy config
- [ ] Environment variables reference

---

## 🔄 Implementation Steps

### Step 1: Define Type Interfaces

**src/config/types.ts:**

```typescript
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
  logLevel?: 'silent' | 'error' | 'warn' | 'info' | 'debug';
}

// ============================================================================
// Token Configuration
// ============================================================================

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
   * @returns Modified config or void
   */
  onBuildStart?: (config: ResolvedConfig) => Promise<void | Partial<TokensConfig>>;

  /**
   * Hook called after each format is generated
   * @param format The format just generated
   * @param outputPath Path to the generated file
   * @param content The generated content
   * @returns Modified content or void
   */
  onFormatComplete?: (
    format: OutputFormat,
    outputPath: string,
    content: string
  ) => Promise<void | string>;

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
 * Output format types
 */
export type OutputFormat = 'css' | 'scss' | 'js' | 'ts' | 'json' | 'android' | 'ios';

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
  selectorPattern?: {
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
  };
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
  framework?: 'react' | 'vue' | 'svelte' | 'web-components';

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
 * Fully resolved configuration with all defaults applied
 */
export interface ResolvedConfig {
  tokens: Required<
    Omit<TokensConfig, 'transforms' | 'customFormats' | 'preprocessors' | 'filters'>
  > & {
    themes: Required<ThemesConfig> & {
      selectorPattern: Required<NonNullable<ThemesConfig['selectorPattern']>>;
    };
    transforms: CustomTransform[];
    customFormats: CustomFormat[];
    preprocessors: CustomPreprocessor[];
    filters: CustomFilter[];
  };
  icons: Required<IconsConfig>;
  global: Required<GlobalConfig>;

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
```

### Step 2: Define Zod Schemas

**src/config/schema.ts:**

```typescript
/**
 * Zod schemas for configuration validation
 *
 * @packageDocumentation
 */

import { z } from 'zod';

// ============================================================================
// Primitive Schemas
// ============================================================================

const outputFormatSchema = z.enum(['css', 'scss', 'js', 'ts', 'json', 'android', 'ios']);

const logLevelSchema = z.enum(['silent', 'error', 'warn', 'info', 'debug']);

const frameworkSchema = z.enum(['react', 'vue', 'svelte', 'web-components']);

// ============================================================================
// Theme Schemas
// ============================================================================

const selectorPatternSchema = z
  .object({
    default: z.string().default(':root'),
    others: z.string().default('[data-dsai-theme="{mode}"]'),
  })
  .default({});

const themesConfigSchema = z
  .object({
    autoDetect: z.boolean().default(true),
    default: z.string().default('Light'),
    ignoreModes: z.array(z.string()).default([]),
    selectorPattern: selectorPatternSchema,
  })
  .default({});

// ============================================================================
// Extensibility Schemas
// ============================================================================

const customTransformSchema = z.object({
  name: z.string(),
  type: z.enum(['name', 'value', 'attribute']),
  filter: z.function().optional(),
  transform: z.function(),
});

const customFormatSchema = z.object({
  name: z.string(),
  format: z.function(),
});

const customPreprocessorSchema = z.object({
  name: z.string(),
  preprocessor: z.function(),
});

const customFilterSchema = z.object({
  name: z.string(),
  filter: z.function(),
});

// ============================================================================
// Token Config Schema
// ============================================================================

// Per-format output directories schema
const outputDirsSchema = z
  .object({
    css: z.string().optional(),
    scss: z.string().optional(),
    js: z.string().optional(),
    ts: z.string().optional(),
    json: z.string().optional(),
    android: z.string().optional(),
    ios: z.string().optional(),
  })
  .optional();

// Per-format output file names schema
const outputFileNamesSchema = z
  .object({
    css: z.string().optional(),
    scss: z.string().optional(),
    js: z.string().optional(),
    ts: z.string().optional(),
    json: z.string().optional(),
    android: z.string().optional(),
    ios: z.string().optional(),
  })
  .optional();

export const tokensConfigSchema = z
  .object({
    // Source configuration
    source: z.union([z.literal('theme'), z.literal('collections'), z.string()]).default('theme'),
    sourceDir: z.string().default('figma-exports'),
    collectionsDir: z.string().default('collections'),
    sourcePatterns: z.array(z.string()).default(['theme.json', 'tokens.json', '*.tokens.json']),
    collectionMapping: z.record(z.string(), z.string()).optional(),

    // Output configuration
    outputDir: z.string().default('dist'),
    outputDirs: outputDirsSchema,
    outputFileNames: outputFileNamesSchema,
    prefix: z.string().default('--dsai-'),
    formats: z.array(outputFormatSchema).default(['css', 'scss', 'js', 'ts', 'json']),

    // Style merge/combine configuration
    additionalScssDirectories: z.array(z.string()).default([]),
    additionalCssDirectories: z.array(z.string()).default([]),
    mergeOrder: z.enum(['before', 'after']).default('after'),
    createBundle: z.boolean().default(false),
    scssImportHeader: z.string().optional(),

    // Themes
    themes: themesConfigSchema,

    // Extensibility
    transforms: z.array(customTransformSchema).default([]),
    customFormats: z.array(customFormatSchema).default([]),
    preprocessors: z.array(customPreprocessorSchema).default([]),
    filters: z.array(customFilterSchema).default([]),

    // Build hooks (runtime functions, not validated by Zod)
    onBuildStart: z.function().optional(),
    onFormatComplete: z.function().optional(),
    onAllFormatsComplete: z.function().optional(),
    onBuildComplete: z.function().optional(),

    // Build options
    outputReferences: z.boolean().default(true),
    baseFontSize: z.number().default(16),
    separateThemeFiles: z.boolean().default(false),
    watch: z.boolean().default(false),
    watchDirectories: z.array(z.string()).default([]),
  })
  .default({});

// ============================================================================
// Icon Config Schema
// ============================================================================

export const iconsConfigSchema = z
  .object({
    sourceDir: z.string().default('icons'),
    outputDir: z.string().default('dist/icons'),
    framework: frameworkSchema.default('react'),
    typescript: z.boolean().default(true),
    optimize: z.boolean().default(true),
    prefix: z.string().default('Icon'),
  })
  .default({});

// ============================================================================
// Global Config Schema
// ============================================================================

export const globalConfigSchema = z
  .object({
    cwd: z.string().optional(),
    debug: z.boolean().default(false),
    logLevel: logLevelSchema.default('info'),
  })
  .default({});

// ============================================================================
// Root Config Schema
// ============================================================================

export const dsaiConfigSchema = z.object({
  tokens: tokensConfigSchema,
  icons: iconsConfigSchema,
  global: globalConfigSchema,
});

// ============================================================================
// Schema Types
// ============================================================================

export type TokensConfigInput = z.input<typeof tokensConfigSchema>;
export type TokensConfigOutput = z.output<typeof tokensConfigSchema>;

export type IconsConfigInput = z.input<typeof iconsConfigSchema>;
export type IconsConfigOutput = z.output<typeof iconsConfigSchema>;

export type DsaiConfigInput = z.input<typeof dsaiConfigSchema>;
export type DsaiConfigOutput = z.output<typeof dsaiConfigSchema>;

// ============================================================================
// Validation Functions
// ============================================================================

/**
 * Validate a configuration object
 */
export function validateConfig(config: unknown): {
  success: boolean;
  data?: DsaiConfigOutput;
  errors?: z.ZodError;
} {
  const result = dsaiConfigSchema.safeParse(config);

  if (result.success) {
    return { success: true, data: result.data };
  }

  return { success: false, errors: result.error };
}

/**
 * Format Zod errors for display
 */
export function formatValidationErrors(errors: z.ZodError): string[] {
  return errors.issues.map((issue) => {
    const path = issue.path.join('.');
    return `${path}: ${issue.message}`;
  });
}
```

### Step 3: Define Defaults

**src/config/defaults.ts:**

```typescript
/**
 * Default configuration values
 *
 * @packageDocumentation
 */

import type { ResolvedConfig, OutputFormat } from './types.js';

/**
 * Default output file names per format
 */
export const defaultOutputFileNames: Record<OutputFormat, string> = {
  css: 'tokens.css',
  scss: '_tokens.scss',
  js: 'tokens.js',
  ts: 'tokens.ts',
  json: 'tokens.json',
  android: 'tokens.xml',
  ios: 'tokens.swift',
};

/**
 * Default configuration with all values set
 */
export const defaultConfig: ResolvedConfig = {
  tokens: {
    source: 'theme',
    sourceDir: 'figma-exports',
    collectionsDir: 'collections',
    sourcePatterns: ['theme.json', 'tokens.json', '*.tokens.json'],
    collectionMapping: {},
    outputDir: 'dist',
    outputDirs: {},
    outputFileNames: defaultOutputFileNames,
    prefix: '--dsai-',
    formats: ['css', 'scss', 'js', 'ts', 'json'],
    // Style merge configuration
    additionalScssDirectories: [],
    additionalCssDirectories: [],
    mergeOrder: 'after',
    createBundle: false,
    scssImportHeader: undefined,
    // Themes
    themes: {
      autoDetect: true,
      default: 'Light',
      ignoreModes: [],
      selectorPattern: {
        default: ':root',
        others: '[data-dsai-theme="{mode}"]',
      },
    },
    transforms: [],
    customFormats: [],
    preprocessors: [],
    filters: [],
    // Build hooks
    onBuildStart: undefined,
    onFormatComplete: undefined,
    onAllFormatsComplete: undefined,
    onBuildComplete: undefined,
    // Build options
    outputReferences: true,
    baseFontSize: 16,
    separateThemeFiles: false,
    watch: false,
    watchDirectories: [],
  },
  icons: {
    sourceDir: 'icons',
    outputDir: 'dist/icons',
    framework: 'react',
    typescript: true,
    optimize: true,
    prefix: 'Icon',
  },
  global: {
    cwd: process.cwd(),
    debug: false,
    logLevel: 'info',
  },
  configDir: process.cwd(),
};

/**
 * Environment variable mappings
 */
export const envMappings: Record<string, string> = {
  DSAI_PREFIX: 'tokens.prefix',
  DSAI_OUTPUT_DIR: 'tokens.outputDir',
  DSAI_SOURCE_DIR: 'tokens.sourceDir',
  DSAI_THEME_DEFAULT: 'tokens.themes.default',
  DSAI_DEBUG: 'global.debug',
  DSAI_LOG_LEVEL: 'global.logLevel',
  DSAI_CONFIG: '__configPath',
  // New environment variables for enterprise integration
  DSAI_ADDITIONAL_SCSS_DIRS: 'tokens.additionalScssDirectories',
  DSAI_ADDITIONAL_CSS_DIRS: 'tokens.additionalCssDirectories',
  DSAI_CREATE_BUNDLE: 'tokens.createBundle',
};
```

### Step 4: Implement Config Loader

**src/config/loader.ts:**

```typescript
/**
 * Configuration file loading utilities
 *
 * @packageDocumentation
 */

import { cosmiconfig } from 'cosmiconfig';
import { resolve, dirname } from 'node:path';
import type { DsaiConfig, LoadConfigOptions, LoadConfigResult } from './types.js';
import { validateConfig, formatValidationErrors } from './schema.js';
import { defaultConfig, envMappings } from './defaults.js';
import { deepMerge } from './utils.js';

/**
 * Config file search locations
 */
const CONFIG_NAMES = [
  'dsai.config',
  '.dsairc',
  'tokens.config', // Legacy support
];

const CONFIG_EXTENSIONS = ['.mjs', '.js', '.ts', '.json', '.yaml', '.yml'];

/**
 * Create cosmiconfig explorer
 */
function createExplorer() {
  return cosmiconfig('dsai', {
    searchPlaces: [
      'package.json',
      ...CONFIG_NAMES.flatMap((name) => CONFIG_EXTENSIONS.map((ext) => name + ext)),
    ],
    loaders: {
      '.mjs': async (filepath: string) => {
        const module = await import(filepath);
        return module.default ?? module;
      },
      '.ts': async (filepath: string) => {
        // Use tsx or ts-node if available
        try {
          const module = await import(filepath);
          return module.default ?? module;
        } catch {
          throw new Error(
            `TypeScript config files require tsx or ts-node. ` + `Install with: pnpm add -D tsx`
          );
        }
      },
    },
  });
}

/**
 * Parse environment variables into config object
 */
function parseEnvConfig(): Partial<DsaiConfig> {
  const config: Record<string, unknown> = {};

  for (const [envKey, configPath] of Object.entries(envMappings)) {
    const value = process.env[envKey];
    if (value === undefined) continue;

    // Skip special keys
    if (configPath.startsWith('__')) continue;

    // Parse boolean values
    let parsedValue: unknown = value;
    if (value.toLowerCase() === 'true') parsedValue = true;
    if (value.toLowerCase() === 'false') parsedValue = false;

    // Set nested path
    const parts = configPath.split('.');
    let current = config;
    for (let i = 0; i < parts.length - 1; i++) {
      current[parts[i]] = current[parts[i]] ?? {};
      current = current[parts[i]] as Record<string, unknown>;
    }
    current[parts[parts.length - 1]] = parsedValue;
  }

  return config as Partial<DsaiConfig>;
}

/**
 * Load configuration from file and merge with defaults
 */
export async function loadConfig(options: LoadConfigOptions = {}): Promise<LoadConfigResult> {
  const warnings: string[] = [];
  const cwd = options.cwd ?? process.cwd();

  let fileConfig: DsaiConfig = {};
  let configPath: string | undefined;

  // Skip file loading if requested
  if (!options.skipFile) {
    // Load from explicit path or search
    if (options.configPath) {
      configPath = resolve(cwd, options.configPath);
      const explorer = createExplorer();
      const result = await explorer.load(configPath);
      if (result) {
        fileConfig = result.config;
      }
    } else {
      const explorer = createExplorer();
      const result = await explorer.search(cwd);
      if (result) {
        fileConfig = result.config;
        configPath = result.filepath;

        // Warn about legacy config
        if (result.filepath.includes('tokens.config')) {
          warnings.push(
            'Using legacy tokens.config.json. ' +
              'Consider migrating to dsai.config.mjs for better TypeScript support.'
          );
        }
      }
    }
  }

  // Parse environment variables
  const envConfig = parseEnvConfig();

  // Merge configs: defaults < file < env < overrides
  const merged = deepMerge(defaultConfig, fileConfig, envConfig, options.overrides ?? {});

  // Set config directory
  const configDir = configPath ? dirname(configPath) : cwd;
  merged.configDir = configDir;
  merged.configPath = configPath;

  // Resolve relative paths
  merged.tokens.sourceDir = resolve(configDir, merged.tokens.sourceDir);
  merged.tokens.collectionsDir = resolve(configDir, merged.tokens.collectionsDir);
  merged.tokens.outputDir = resolve(configDir, merged.tokens.outputDir);
  merged.icons.sourceDir = resolve(configDir, merged.icons.sourceDir);
  merged.icons.outputDir = resolve(configDir, merged.icons.outputDir);

  // Validate merged config
  const validation = validateConfig(merged);
  if (!validation.success && validation.errors) {
    const errorMessages = formatValidationErrors(validation.errors);
    throw new Error(`Invalid configuration:\n${errorMessages.map((e) => `  - ${e}`).join('\n')}`);
  }

  return {
    config: validation.data!,
    configPath,
    warnings,
  };
}

/**
 * Deep merge utility for configs
 */
export function deepMerge<T extends Record<string, unknown>>(...objects: Partial<T>[]): T {
  const result: Record<string, unknown> = {};

  for (const obj of objects) {
    for (const key in obj) {
      const value = obj[key];
      if (value === undefined) continue;

      if (
        typeof value === 'object' &&
        value !== null &&
        !Array.isArray(value) &&
        typeof result[key] === 'object' &&
        result[key] !== null &&
        !Array.isArray(result[key])
      ) {
        result[key] = deepMerge(
          result[key] as Record<string, unknown>,
          value as Record<string, unknown>
        );
      } else {
        result[key] = value;
      }
    }
  }

  return result as T;
}
```

### Step 5: Implement Resolver

**src/config/resolver.ts:**

```typescript
/**
 * Configuration resolution and merging
 *
 * @packageDocumentation
 */

import { resolve } from 'node:path';
import type { DsaiConfig, ResolvedConfig, TokensConfig, ThemesConfig } from './types.js';
import { defaultConfig } from './defaults.js';
import { deepMerge } from './loader.js';

/**
 * Resolve a partial config to a full ResolvedConfig
 */
export function resolveConfig(
  partial: Partial<DsaiConfig>,
  configDir: string = process.cwd()
): ResolvedConfig {
  // Merge with defaults
  const merged = deepMerge(defaultConfig, partial);

  // Resolve paths relative to config directory
  if (partial.tokens?.sourceDir) {
    merged.tokens.sourceDir = resolve(configDir, partial.tokens.sourceDir);
  }
  if (partial.tokens?.collectionsDir) {
    merged.tokens.collectionsDir = resolve(configDir, partial.tokens.collectionsDir);
  }
  if (partial.tokens?.outputDir) {
    merged.tokens.outputDir = resolve(configDir, partial.tokens.outputDir);
  }
  if (partial.icons?.sourceDir) {
    merged.icons.sourceDir = resolve(configDir, partial.icons.sourceDir);
  }
  if (partial.icons?.outputDir) {
    merged.icons.outputDir = resolve(configDir, partial.icons.outputDir);
  }

  merged.configDir = configDir;

  return merged as ResolvedConfig;
}

/**
 * Create a config override for CLI usage
 */
export function createCliOverrides(options: {
  config?: string;
  prefix?: string;
  outputDir?: string;
  sourceDir?: string;
  debug?: boolean;
}): Partial<DsaiConfig> {
  const overrides: Partial<DsaiConfig> = {};

  if (options.prefix) {
    overrides.tokens = { ...overrides.tokens, prefix: options.prefix };
  }
  if (options.outputDir) {
    overrides.tokens = { ...overrides.tokens, outputDir: options.outputDir };
  }
  if (options.sourceDir) {
    overrides.tokens = { ...overrides.tokens, sourceDir: options.sourceDir };
  }
  if (options.debug) {
    overrides.global = { ...overrides.global, debug: true };
  }

  return overrides;
}
```

### Step 6: Update Main Exports

**src/config/index.ts:**

````typescript
/**
 * Configuration module for @dsai/tools
 *
 * @packageDocumentation
 */

// Types
export type {
  DsaiConfig,
  TokensConfig,
  ThemesConfig,
  IconsConfig,
  GlobalConfig,
  ResolvedConfig,
  LoadConfigOptions,
  LoadConfigResult,
  CustomTransform,
  CustomFormat,
  CustomPreprocessor,
  CustomFilter,
  TokenData,
  OutputFormat,
} from './types.js';

// Schema
export {
  dsaiConfigSchema,
  tokensConfigSchema,
  iconsConfigSchema,
  globalConfigSchema,
  validateConfig,
  formatValidationErrors,
} from './schema.js';

// Defaults
export { defaultConfig, envMappings } from './defaults.js';

// Loader
export { loadConfig, deepMerge } from './loader.js';

// Resolver
export { resolveConfig, createCliOverrides } from './resolver.js';

/**
 * Define DSAi configuration with TypeScript support
 *
 * @example
 * ```typescript
 * // dsai.config.mjs
 * import { defineConfig } from '@dsai/tools';
 *
 * export default defineConfig({
 *   tokens: {
 *     prefix: '--acme-',
 *     outputDir: './design-tokens/dist',
 *   }
 * });
 * ```
 */
export function defineConfig(config: DsaiConfig): DsaiConfig {
  return config;
}
````

### Step 7: Create Config Templates

**templates/dsai.config.mjs:**

```javascript
/**
 * DSAi Tools Configuration
 *
 * @see https://dsai.design/tools/configuration
 */
import { defineConfig } from '@dsai/tools';

export default defineConfig({
  tokens: {
    // Source configuration
    source: 'theme',
    sourceDir: './figma-exports',
    collectionsDir: './collections',

    // Output configuration
    outputDir: './dist',
    prefix: '--dsai-',
    formats: ['css', 'scss', 'js', 'ts', 'json'],

    // Theme configuration
    themes: {
      autoDetect: true,
      default: 'Light',
      ignoreModes: [],
      selectorPattern: {
        default: ':root',
        others: '[data-dsai-theme="{mode}"]',
      },
    },

    // Build options
    outputReferences: true,
    baseFontSize: 16,
    separateThemeFiles: false,

    // Custom transforms (optional)
    transforms: [],
    customFormats: [],
    preprocessors: [],
  },

  icons: {
    sourceDir: './icons',
    outputDir: './dist/icons',
    framework: 'react',
    typescript: true,
    optimize: true,
    prefix: 'Icon',
  },

  global: {
    debug: false,
    logLevel: 'info',
  },
});
```

### Step 8: Create JSON Schema

**templates/dsai.config.schema.json:**

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://dsai.design/schemas/dsai.config.schema.json",
  "title": "DSAi Tools Configuration",
  "description": "Configuration for @dsai/tools build tooling",
  "type": "object",
  "properties": {
    "tokens": {
      "type": "object",
      "description": "Token build configuration",
      "properties": {
        "source": {
          "type": "string",
          "description": "Token source type",
          "enum": ["theme", "collections"],
          "default": "theme"
        },
        "sourceDir": {
          "type": "string",
          "description": "Directory containing Figma export files",
          "default": "figma-exports"
        },
        "collectionsDir": {
          "type": "string",
          "description": "Directory containing token collection files",
          "default": "collections"
        },
        "outputDir": {
          "type": "string",
          "description": "Output directory for built tokens",
          "default": "dist"
        },
        "prefix": {
          "type": "string",
          "description": "CSS custom property prefix",
          "default": "--dsai-"
        },
        "formats": {
          "type": "array",
          "description": "Output formats to generate",
          "items": {
            "type": "string",
            "enum": ["css", "scss", "js", "ts", "json", "android", "ios"]
          },
          "default": ["css", "scss", "js", "ts", "json"]
        },
        "themes": {
          "type": "object",
          "properties": {
            "autoDetect": {
              "type": "boolean",
              "default": true
            },
            "default": {
              "type": "string",
              "default": "Light"
            },
            "ignoreModes": {
              "type": "array",
              "items": { "type": "string" },
              "default": []
            },
            "selectorPattern": {
              "type": "object",
              "properties": {
                "default": {
                  "type": "string",
                  "default": ":root"
                },
                "others": {
                  "type": "string",
                  "default": "[data-dsai-theme=\"{mode}\"]"
                }
              }
            }
          }
        },
        "outputReferences": {
          "type": "boolean",
          "default": true
        },
        "baseFontSize": {
          "type": "number",
          "default": 16
        },
        "separateThemeFiles": {
          "type": "boolean",
          "default": false
        }
      }
    },
    "icons": {
      "type": "object",
      "description": "Icon generation configuration",
      "properties": {
        "sourceDir": {
          "type": "string",
          "default": "icons"
        },
        "outputDir": {
          "type": "string",
          "default": "dist/icons"
        },
        "framework": {
          "type": "string",
          "enum": ["react", "vue", "svelte", "web-components"],
          "default": "react"
        },
        "typescript": {
          "type": "boolean",
          "default": true
        },
        "optimize": {
          "type": "boolean",
          "default": true
        },
        "prefix": {
          "type": "string",
          "default": "Icon"
        }
      }
    },
    "global": {
      "type": "object",
      "properties": {
        "debug": {
          "type": "boolean",
          "default": false
        },
        "logLevel": {
          "type": "string",
          "enum": ["silent", "error", "warn", "info", "debug"],
          "default": "info"
        }
      }
    }
  }
}
```

### Step 9: Write Tests

**tests/config.test.ts:**

```typescript
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { loadConfig, resolveConfig, validateConfig, defineConfig } from '../src/config/index.js';
import { defaultConfig } from '../src/config/defaults.js';

describe('Configuration System', () => {
  describe('validateConfig', () => {
    it('validates empty config with defaults', () => {
      const result = validateConfig({});
      expect(result.success).toBe(true);
    });

    it('validates full config', () => {
      const config = defineConfig({
        tokens: {
          prefix: '--custom-',
          outputDir: './output',
        },
      });
      const result = validateConfig(config);
      expect(result.success).toBe(true);
    });

    it('rejects invalid prefix format', () => {
      const result = validateConfig({
        tokens: { prefix: 123 },
      });
      expect(result.success).toBe(false);
    });
  });

  describe('resolveConfig', () => {
    it('merges with defaults', () => {
      const partial = { tokens: { prefix: '--test-' } };
      const resolved = resolveConfig(partial);
      expect(resolved.tokens.prefix).toBe('--test-');
      expect(resolved.tokens.outputDir).toContain('dist');
    });

    it('preserves nested objects', () => {
      const partial = {
        tokens: {
          themes: { default: 'Dark' },
        },
      };
      const resolved = resolveConfig(partial);
      expect(resolved.tokens.themes.default).toBe('Dark');
      expect(resolved.tokens.themes.autoDetect).toBe(true);
    });
  });

  describe('defineConfig', () => {
    it('returns config as-is', () => {
      const config = { tokens: { prefix: '--x-' } };
      expect(defineConfig(config)).toBe(config);
    });
  });
});
```

---

## 📝 Notes

### Design Decisions

1. **Zod for Validation**: Runtime type checking with great error messages
2. **Cosmiconfig for Loading**: Industry standard for config file discovery
3. **ESM Priority**: `.mjs` files searched before `.js`
4. **Deep Merge**: Nested objects merged, arrays replaced
5. **Relative Paths**: Resolved relative to config file, not cwd

### Environment Variable Priority

Environment variables override file config but not CLI args:

```
CLI args > Environment vars > Config file > Defaults
```

### Backward Compatibility

- `tokens.config.json` still works with deprecation warning
- All existing config keys are supported
- New keys have sensible defaults

---

## ✅ Definition of Done

- [ ] All config types exported
- [ ] Zod schemas validate all options
- [ ] Config loads from all supported formats
- [ ] Environment variables work
- [ ] Paths resolve relative to config
- [ ] defineConfig provides autocomplete
- [ ] JSON Schema generated for IDE support
- [ ] All tests pass
- [ ] Documentation complete
