# Task: Token Scripts Migration

**Task ID:** TASK-103
**Title:** Migrate Token Build Scripts to @DSAi/tools Package
**Priority:** High
**Status:** ⚪ Not Started
**Assigned To:** Unassigned
**Blocked by Task:** TASK-101, TASK-102
**Created:** 2024-12-23
**Updated:** 2024-12-23

---

## 📋 Task Description

### Goal

Migrate all token-related scripts from `tools/scripts/tokens/` to the `@dsai/tools` package as proper TypeScript modules. These scripts must be refactored to use the new configuration system and be callable both programmatically and via CLI.

### Problem/Issue

Current token scripts have several issues:

1. **CommonJS Format**: Uses `.cjs` extension and `require()` syntax
2. **Hardcoded Paths**: Uses `path.join(__dirname, '../../../packages/@dsai/tokens')`
3. **No Configuration**: Doesn't read from config files
4. **Not Importable**: Can't be used as library functions
5. **No Error Handling**: Basic error handling with process.exit()
6. **No TypeScript**: No type safety or IDE support
7. **Duplicate Logic**: Validation logic spread across multiple files

### Expected Outcome

Fully refactored token tooling that:

1. Uses TypeScript with proper type definitions
2. Reads configuration from config system
3. Exports both programmatic API and CLI-callable functions
4. Has comprehensive error handling and logging
5. Is testable with unit tests
6. Supports all existing functionality
7. Adds new capabilities (dry-run, watch, verbose)

---

## 🎯 Acceptance Criteria

### Script Migration

- [ ] `validate-tokens.cjs` → `src/tokens/validate.ts`
- [ ] `transform-figma-tokens.cjs` → `src/tokens/transform.ts`
- [ ] `sync-tokens-flat.js` → `src/tokens/sync.ts`
- [ ] `build-all.cjs` → `src/tokens/build.ts`
- [ ] `postprocess-theme-css.cjs` → `src/tokens/postprocess.ts`
- [ ] `merge-collections.cjs` → `src/tokens/merge.ts`
- [ ] `validate-figma-tokens.cjs` → `src/tokens/validate-figma.ts`

### Programmatic API

- [ ] All functions exported from `@dsai/tools/tokens`
- [ ] Functions accept options object with config overrides
- [ ] Functions return typed results (not just exit codes)
- [ ] Async functions use Promise-based API
- [ ] Error handling with custom error types

### Configuration Integration

- [ ] All functions read from resolved config
- [ ] CLI flags override config values
- [ ] Paths resolved relative to config location
- [ ] Prefix, output paths, selectors configurable

### New Features

- [ ] `--dry-run` flag shows what would happen
- [ ] `--verbose` flag enables detailed logging
- [ ] `--watch` flag for continuous building
- [ ] `--quiet` flag suppresses output
- [ ] Progress indicators for long operations
- [ ] Colored console output

### Backward Compatibility

- [ ] Existing `pnpm tokens:build` works unchanged
- [ ] Legacy scripts can be replaced with CLI calls
- [ ] Same output format and structure

---

## 📂 Files to Create/Modify

### New Files in @DSAi/tools

```
packages/@dsai/tools/src/tokens/
├── index.ts              # Public exports
├── types.ts              # Token-specific types
├── validate.ts           # Token validation
├── validate-figma.ts     # Figma export validation
├── transform.ts          # Figma → DTCG transformation
├── sync.ts               # Sync tokens-flat
├── build.ts              # Build orchestration
├── postprocess.ts        # CSS post-processing
├── merge.ts              # Collection merging
├── extractors/           # Token extractors (from transform)
│   ├── index.ts
│   ├── colors.ts
│   ├── typography.ts
│   ├── spacing.ts
│   ├── borders.ts
│   ├── shadows.ts
│   └── layout.ts
└── utils/
    ├── index.ts
    ├── paths.ts          # Token path utilities
    ├── references.ts     # Reference resolution
    └── dtcg.ts           # DTCG format utilities
```

### Files to Update

```
packages/@dsai/tokens/package.json  # Update script paths
tools/scripts/tokens/*.cjs          # Add deprecation notices
```

---

## 🔗 Dependencies

### Prerequisites

- [ ] TASK-101: Package Scaffolding (base structure)
- [ ] TASK-102: Configuration System (config loading)

### Blocks

- TASK-104: Style Dictionary Integration (uses token modules)
- TASK-105: CLI Implementation (exposes as commands)
- TASK-107: Tokens Package Update (uses new imports)

---

## 🧪 Testing Requirements

### Unit Tests

- [ ] Validation detects all error types
- [ ] Transform preserves all token values
- [ ] Sync generates correct TypeScript
- [ ] Build runs all steps in order
- [ ] Path resolution works correctly

### Integration Tests

- [ ] Full build pipeline produces correct output
- [ ] Config overrides apply correctly
- [ ] Watch mode detects changes
- [ ] Error messages are helpful

### Regression Tests

- [ ] Output matches current build output
- [ ] All token types handled correctly
- [ ] References resolve correctly
- [ ] Theme modes processed correctly

---

## 📖 Documentation Requirements

- [ ] JSDoc on all public functions
- [ ] API documentation with examples
- [ ] Migration guide from legacy scripts
- [ ] Troubleshooting guide

---

## 🔄 Implementation Steps

### Step 1: Define Token Types

**src/tokens/types.ts:**

```typescript
/**
 * Token-specific type definitions
 *
 * @packageDocumentation
 */

// ============================================================================
// DTCG Token Types
// ============================================================================

/**
 * DTCG-compliant token value
 */
export interface DTCGToken {
  $value: unknown;
  $type?: string;
  $description?: string;
  $extensions?: Record<string, unknown>;
}

/**
 * Legacy Style Dictionary token
 */
export interface LegacyToken {
  value: unknown;
  type?: string;
  description?: string;
  comment?: string;
}

/**
 * Combined token type supporting both formats
 */
export type Token = DTCGToken | LegacyToken;

/**
 * Token collection (nested structure)
 */
export type TokenCollection = {
  [key: string]: Token | TokenCollection;
};

/**
 * Figma export format (from Tokens Studio)
 */
export interface FigmaExport {
  [collectionName: string]: {
    modes?: {
      [modeName: string]: TokenCollection;
    };
    [key: string]: unknown;
  };
}

// ============================================================================
// Validation Types
// ============================================================================

/**
 * Valid token types per DTCG spec
 */
export const VALID_TOKEN_TYPES = [
  'color',
  'dimension',
  'fontFamily',
  'fontWeight',
  'shadow',
  'number',
  'string',
  'duration',
  'cubicBezier',
  'strokeStyle',
  'border',
  'transition',
  'gradient',
  'typography',
] as const;

export type TokenType = (typeof VALID_TOKEN_TYPES)[number];

/**
 * Validation error
 */
export interface ValidationError {
  path: string;
  message: string;
  severity: 'error' | 'warning';
  value?: unknown;
}

/**
 * Validation result
 */
export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
  tokenCount: number;
  fileCount: number;
}

// ============================================================================
// Transform Types
// ============================================================================

/**
 * Transform options
 */
export interface TransformOptions {
  /** Source directory with Figma exports */
  sourceDir: string;

  /** Output directory for collections */
  collectionsDir: string;

  /**
   * Glob patterns for finding source files
   * @example ['theme.json', '*.tokens.json', 'figma-variables-*.json']
   */
  sourcePatterns?: string[];

  /**
   * Map of collection names to specific file paths
   * @example { 'primitives': './colors.json', 'semantic': './semantic.json' }
   */
  collectionMapping?: Record<string, string>;

  /** Preserve $codeSyntax references */
  preserveCodeSyntax?: boolean;

  /** Modes to ignore */
  ignoreModes?: string[];

  /** Default mode name */
  defaultMode?: string;

  /** Dry run (don't write files) */
  dryRun?: boolean;

  /** Verbose logging */
  verbose?: boolean;
}

/**
 * Transform result
 */
export interface TransformResult {
  success: boolean;
  filesWritten: string[];
  tokensProcessed: number;
  modesDetected: string[];
  errors: string[];
  warnings: string[];
}

// ============================================================================
// Build Types
// ============================================================================

/**
 * Build step definition
 */
export interface BuildStep {
  name: string;
  command?: string;
  fn?: () => Promise<void>;
  skip?: boolean;
  cwd?: string;
}

/**
 * Build options
 */
export interface BuildOptions {
  /** Skip validation step */
  skipValidate?: boolean;

  /** Only build theme CSS */
  onlyTheme?: boolean;

  /** Watch mode */
  watch?: boolean;

  /** Dry run */
  dryRun?: boolean;

  /** Verbose output */
  verbose?: boolean;

  /** Quiet mode */
  quiet?: boolean;

  // --- Output Configuration ---

  /**
   * Output directory for all formats (can be overridden per-format)
   */
  outputDir?: string;

  /**
   * Per-format output directories
   * @example { css: 'dist/css', scss: 'src/styles/tokens', js: 'dist/js' }
   */
  outputDirs?: Partial<Record<string, string>>;

  /**
   * Per-format output file names
   * @example { css: 'design-tokens.css', scss: '_design-tokens.scss' }
   */
  outputFileNames?: Partial<Record<string, string>>;

  // --- Style Merge Configuration ---

  /**
   * Additional SCSS directories to merge with token output
   * @example ['src/styles/overrides', 'src/styles/mixins']
   */
  additionalScssDirectories?: string[];

  /**
   * Additional CSS directories to merge with token output
   * @example ['src/styles/base', 'src/styles/utilities']
   */
  additionalCssDirectories?: string[];

  /**
   * Order in which to merge additional stylesheets
   * - 'before': User styles before generated tokens
   * - 'after': User styles after generated tokens
   * @default 'after'
   */
  mergeOrder?: 'before' | 'after';

  /**
   * Create combined bundle files
   * When true, creates tokens-bundle.css and _tokens-bundle.scss
   */
  createBundle?: boolean;

  /**
   * Custom SCSS file to import at top of generated SCSS
   * @example '_variables.scss' or 'path/to/custom-base.scss'
   */
  scssImportHeader?: string;

  /**
   * Additional directories to watch for changes (watch mode)
   */
  watchDirectories?: string[];
}

/**
 * Build result
 */
export interface BuildResult {
  success: boolean;
  stepsCompleted: string[];
  stepsFailed: string[];
  duration: number;
  errors: string[];
}

// ============================================================================
// Sync Types
// ============================================================================

/**
 * Sync options
 */
export interface SyncOptions {
  /** Source file (Style Dictionary output) */
  sourceFile: string;

  /** Target file (TypeScript source) */
  targetFile: string;

  /** Dry run */
  dryRun?: boolean;
}

/**
 * Sync result
 */
export interface SyncResult {
  success: boolean;
  tokensCount: number;
  changes: boolean;
}

// ============================================================================
// Postprocess Types
// ============================================================================

/**
 * Postprocess options
 */
export interface PostprocessOptions {
  /** Input CSS file */
  inputFile: string;

  /** Output CSS file (defaults to input) */
  outputFile?: string;

  /** Replacements to make */
  replacements?: Array<{
    from: string | RegExp;
    to: string;
  }>;

  /** Dry run */
  dryRun?: boolean;
}

/**
 * Postprocess result
 */
export interface PostprocessResult {
  success: boolean;
  replacementsMade: number;
  outputFile: string;
}
```

### Step 2: Implement Validation Module

**src/tokens/validate.ts:**

````typescript
/**
 * Token validation module
 *
 * Validates design tokens for DTCG compliance and structural integrity.
 *
 * @packageDocumentation
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import type { ResolvedConfig } from '../config/types.js';
import type {
  Token,
  TokenCollection,
  ValidationResult,
  ValidationError,
  VALID_TOKEN_TYPES,
} from './types.js';
import { logger } from '../utils/index.js';

// ============================================================================
// Token Detection
// ============================================================================

/**
 * Check if object is a token (has $value or value)
 */
function isToken(obj: unknown): obj is Token {
  if (typeof obj !== 'object' || obj === null) return false;
  return '$value' in obj || 'value' in obj;
}

/**
 * Check if token uses DTCG format
 */
function isDTCG(token: Token): boolean {
  return '$value' in token;
}

/**
 * Get token value regardless of format
 */
function getTokenValue(token: Token): unknown {
  return '$value' in token ? token.$value : token.value;
}

/**
 * Get token type regardless of format
 */
function getTokenType(token: Token): string | undefined {
  return '$type' in token ? token.$type : (token as any).type;
}

// ============================================================================
// Validation Functions
// ============================================================================

/**
 * Validate a single token
 */
function validateToken(
  path: string,
  token: Token,
  errors: ValidationError[],
  warnings: ValidationError[]
): void {
  const value = getTokenValue(token);
  const type = getTokenType(token);

  // Check for missing value
  if (value === undefined || value === null) {
    errors.push({
      path,
      message: 'Token has no value',
      severity: 'error',
    });
    return;
  }

  // Check for empty string value (warning)
  if (value === '') {
    warnings.push({
      path,
      message: 'Token has empty string value',
      severity: 'warning',
      value,
    });
  }

  // Check for type
  if (!type) {
    warnings.push({
      path,
      message: 'Token has no type specified',
      severity: 'warning',
    });
  } else if (!VALID_TOKEN_TYPES.includes(type as any)) {
    warnings.push({
      path,
      message: `Unknown token type: ${type}`,
      severity: 'warning',
    });
  }

  // Type-specific validation
  if (type === 'color' && typeof value === 'string') {
    if (!isValidColor(value)) {
      errors.push({
        path,
        message: `Invalid color value: ${value}`,
        severity: 'error',
        value,
      });
    }
  }

  if (type === 'dimension' && typeof value === 'string') {
    if (!isValidDimension(value) && !isReference(value)) {
      errors.push({
        path,
        message: `Invalid dimension value: ${value}`,
        severity: 'error',
        value,
      });
    }
  }
}

/**
 * Check if string is a valid color
 */
function isValidColor(value: string): boolean {
  // Hex colors
  if (/^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(value)) return true;
  // RGB/RGBA
  if (/^rgba?\(.*\)$/i.test(value)) return true;
  // HSL/HSLA
  if (/^hsla?\(.*\)$/i.test(value)) return true;
  // References
  if (isReference(value)) return true;
  // Named colors (basic check)
  if (/^[a-z]+$/i.test(value)) return true;
  return false;
}

/**
 * Check if string is a valid dimension
 */
function isValidDimension(value: string): boolean {
  // Number with unit
  if (/^-?\d+(\.\d+)?(px|rem|em|%|vh|vw|pt|cm|mm|in)$/i.test(value)) return true;
  // Zero without unit
  if (value === '0') return true;
  // Pure number (for line-height, etc.)
  if (/^-?\d+(\.\d+)?$/.test(value)) return true;
  return false;
}

/**
 * Check if string is a reference
 */
function isReference(value: string): boolean {
  return value.startsWith('{') && value.endsWith('}');
}

/**
 * Recursively validate a token collection
 */
function validateCollection(
  collection: TokenCollection,
  basePath: string,
  errors: ValidationError[],
  warnings: ValidationError[],
  tokenCount: { count: number }
): void {
  for (const [key, value] of Object.entries(collection)) {
    const path = basePath ? `${basePath}.${key}` : key;

    if (isToken(value)) {
      tokenCount.count++;
      validateToken(path, value, errors, warnings);
    } else if (typeof value === 'object' && value !== null) {
      validateCollection(value as TokenCollection, path, errors, warnings, tokenCount);
    }
  }
}

/**
 * Validate a JSON token file
 */
function validateFile(
  filePath: string,
  errors: ValidationError[],
  warnings: ValidationError[]
): number {
  try {
    const content = readFileSync(filePath, 'utf-8');
    const data = JSON.parse(content) as TokenCollection;
    const tokenCount = { count: 0 };

    validateCollection(data, '', errors, warnings, tokenCount);

    return tokenCount.count;
  } catch (error) {
    errors.push({
      path: filePath,
      message: `Failed to parse file: ${(error as Error).message}`,
      severity: 'error',
    });
    return 0;
  }
}

// ============================================================================
// Main Validation Function
// ============================================================================

/**
 * Validate all tokens in a directory
 *
 * @param config - Resolved configuration
 * @param options - Additional options
 * @returns Validation result
 *
 * @example
 * ```typescript
 * import { validateTokens, loadConfig } from '@dsai/tools';
 *
 * const { config } = await loadConfig();
 * const result = await validateTokens(config);
 *
 * if (!result.valid) {
 *   console.error('Validation failed:', result.errors);
 * }
 * ```
 */
export async function validateTokens(
  config: ResolvedConfig,
  options: { verbose?: boolean; quiet?: boolean } = {}
): Promise<ValidationResult> {
  const { verbose, quiet } = options;
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];
  let totalTokens = 0;
  let fileCount = 0;

  const collectionsDir = config.tokens.collectionsDir;

  if (!existsSync(collectionsDir)) {
    return {
      valid: false,
      errors: [
        {
          path: collectionsDir,
          message: 'Collections directory does not exist',
          severity: 'error',
        },
      ],
      warnings: [],
      tokenCount: 0,
      fileCount: 0,
    };
  }

  // Find all JSON files recursively
  const jsonFiles: string[] = [];

  function findJsonFiles(dir: string): void {
    const entries = readdirSync(dir);
    for (const entry of entries) {
      const fullPath = join(dir, entry);
      const stat = statSync(fullPath);
      if (stat.isDirectory()) {
        findJsonFiles(fullPath);
      } else if (entry.endsWith('.json')) {
        jsonFiles.push(fullPath);
      }
    }
  }

  findJsonFiles(collectionsDir);

  if (!quiet) {
    logger.info(`Validating ${jsonFiles.length} token files...`);
  }

  // Validate each file
  for (const file of jsonFiles) {
    fileCount++;
    const relativePath = relative(collectionsDir, file);

    if (verbose) {
      logger.debug(`Validating: ${relativePath}`);
    }

    const tokenCount = validateFile(file, errors, warnings);
    totalTokens += tokenCount;
  }

  // Report results
  const valid = errors.length === 0;

  if (!quiet) {
    if (valid) {
      logger.success(`Validated ${totalTokens} tokens in ${fileCount} files`);
      if (warnings.length > 0) {
        logger.warn(`${warnings.length} warnings found`);
      }
    } else {
      logger.error(`Validation failed with ${errors.length} errors`);
    }
  }

  return {
    valid,
    errors,
    warnings,
    tokenCount: totalTokens,
    fileCount,
  };
}

/**
 * Validate tokens and exit with code (for CLI)
 */
export async function validateTokensCLI(config: ResolvedConfig): Promise<void> {
  const result = await validateTokens(config, { verbose: true });

  if (!result.valid) {
    for (const error of result.errors) {
      console.error(`❌ ${error.path}: ${error.message}`);
    }
    process.exit(1);
  }

  for (const warning of result.warnings) {
    console.warn(`⚠️  ${warning.path}: ${warning.message}`);
  }
}
````

### Step 3: Implement Transform Module

**src/tokens/transform.ts:**

````typescript
/**
 * Figma token transformation module
 *
 * Transforms Figma Token Studio exports to DTCG-compliant Style Dictionary format.
 *
 * @packageDocumentation
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import type { ResolvedConfig } from '../config/types.js';
import type { FigmaExport, TokenCollection, TransformOptions, TransformResult } from './types.js';
import { logger } from '../utils/index.js';
import {
  extractBrandColors,
  extractNeutralColors,
  extractTypography,
  extractSpacing,
  extractBorderRadius,
  extractShadows,
  extractLayout,
} from './extractors/index.js';

// ============================================================================
// Configuration
// ============================================================================

/**
 * Collection configuration
 */
interface CollectionConfig {
  input: string;
  modeAware: boolean;
  outputs: Array<{
    file: string;
    extractor: (data: TokenCollection, mode?: string) => TokenCollection;
  }>;
}

/**
 * Default collection mappings
 */
const COLLECTIONS: Record<string, CollectionConfig> = {
  foundation: {
    input: 'foundation.json',
    modeAware: true,
    outputs: [
      { file: 'collections/color/primitive.json', extractor: extractBrandColors },
      { file: 'collections/color/neutral.json', extractor: extractNeutralColors },
    ],
  },
  typography: {
    input: 'typography.json',
    modeAware: false,
    outputs: [{ file: 'collections/typography/base.json', extractor: extractTypography }],
  },
  spacing: {
    input: 'spacing.json',
    modeAware: false,
    outputs: [{ file: 'collections/spacing/base.json', extractor: extractSpacing }],
  },
  radius: {
    input: 'radius.json',
    modeAware: false,
    outputs: [{ file: 'collections/border/radius.json', extractor: extractBorderRadius }],
  },
  shadows: {
    input: 'shadows.json',
    modeAware: false,
    outputs: [{ file: 'collections/shadow/base.json', extractor: extractShadows }],
  },
  layout: {
    input: 'layout.json',
    modeAware: false,
    outputs: [{ file: 'collections/layout/breakpoints.json', extractor: extractLayout }],
  },
};

// ============================================================================
// Transformation Functions
// ============================================================================

/**
 * Detect available modes in Figma export
 */
function detectModes(data: FigmaExport, collectionPath: string): string[] {
  const collection = data[collectionPath];
  if (!collection?.modes) {
    return ['Base'];
  }
  return Object.keys(collection.modes);
}

/**
 * Write JSON file with directory creation
 */
function writeJsonFile(filePath: string, data: unknown, dryRun: boolean): void {
  if (dryRun) {
    logger.debug(`[DRY RUN] Would write: ${filePath}`);
    return;
  }

  const dir = dirname(filePath);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
}

/**
 * Transform Figma tokens to Style Dictionary format
 *
 * @param config - Resolved configuration
 * @param options - Transform options
 * @returns Transform result
 *
 * @example
 * ```typescript
 * import { transformTokens, loadConfig } from '@dsai/tools';
 *
 * const { config } = await loadConfig();
 * const result = await transformTokens(config);
 *
 * console.log(`Transformed ${result.tokensProcessed} tokens`);
 * ```
 */
export async function transformTokens(
  config: ResolvedConfig,
  options: Partial<TransformOptions> = {}
): Promise<TransformResult> {
  const { dryRun = false, verbose = false } = options;

  const sourceDir = config.tokens.sourceDir;
  const collectionsDir = config.tokens.collectionsDir;
  const ignoreModes = config.tokens.themes.ignoreModes;

  const result: TransformResult = {
    success: true,
    filesWritten: [],
    tokensProcessed: 0,
    modesDetected: [],
    errors: [],
    warnings: [],
  };

  if (!existsSync(sourceDir)) {
    result.success = false;
    result.errors.push(`Source directory not found: ${sourceDir}`);
    return result;
  }

  logger.info(`Transforming tokens from ${sourceDir}...`);

  // Process each collection
  for (const [name, collectionConfig] of Object.entries(COLLECTIONS)) {
    const inputPath = join(sourceDir, collectionConfig.input);

    if (!existsSync(inputPath)) {
      if (verbose) {
        logger.debug(`Skipping ${name}: ${collectionConfig.input} not found`);
      }
      continue;
    }

    try {
      const data = JSON.parse(readFileSync(inputPath, 'utf-8')) as FigmaExport;

      // Detect modes for mode-aware collections
      if (collectionConfig.modeAware) {
        const modes = detectModes(data, Object.keys(data)[0]);
        result.modesDetected.push(...modes.filter((m) => !result.modesDetected.includes(m)));

        // Filter out ignored modes
        const activeModes = modes.filter((m) => !ignoreModes.includes(m));

        for (const mode of activeModes) {
          for (const output of collectionConfig.outputs) {
            const modeData = extractModeData(data, mode);
            const extracted = output.extractor(modeData, mode);
            const outputPath = join(
              collectionsDir,
              output.file.replace('.json', `-${mode.toLowerCase()}.json`)
            );

            writeJsonFile(outputPath, extracted, dryRun);
            result.filesWritten.push(outputPath);
            result.tokensProcessed += countTokens(extracted);
          }
        }
      } else {
        // Non-mode-aware collections
        for (const output of collectionConfig.outputs) {
          const extracted = output.extractor(data as unknown as TokenCollection);
          const outputPath = join(collectionsDir, output.file);

          writeJsonFile(outputPath, extracted, dryRun);
          result.filesWritten.push(outputPath);
          result.tokensProcessed += countTokens(extracted);
        }
      }

      if (verbose) {
        logger.debug(`Processed: ${name}`);
      }
    } catch (error) {
      result.errors.push(`Failed to process ${name}: ${(error as Error).message}`);
      result.success = false;
    }
  }

  if (result.success) {
    logger.success(
      `Transformed ${result.tokensProcessed} tokens to ${result.filesWritten.length} files`
    );
  } else {
    logger.error(`Transform failed with ${result.errors.length} errors`);
  }

  return result;
}

/**
 * Extract mode-specific data from Figma export
 */
function extractModeData(data: FigmaExport, mode: string): TokenCollection {
  const result: TokenCollection = {};

  for (const [collectionName, collection] of Object.entries(data)) {
    if (collection.modes && collection.modes[mode]) {
      result[collectionName] = collection.modes[mode];
    }
  }

  return result;
}

/**
 * Count tokens in a collection
 */
function countTokens(collection: TokenCollection): number {
  let count = 0;

  for (const value of Object.values(collection)) {
    if (typeof value === 'object' && value !== null) {
      if ('$value' in value || 'value' in value) {
        count++;
      } else {
        count += countTokens(value as TokenCollection);
      }
    }
  }

  return count;
}
````

### Step 4: Implement Build Orchestration

**src/tokens/build.ts:**

````typescript
/**
 * Token build orchestration module
 *
 * Coordinates the complete token build pipeline.
 *
 * @packageDocumentation
 */

import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import type { ResolvedConfig } from '../config/types.js';
import type { BuildOptions, BuildResult, BuildStep } from './types.js';
import { validateTokens } from './validate.js';
import { transformTokens } from './transform.js';
import { syncTokens } from './sync.js';
import { postprocessThemeCSS } from './postprocess.js';
import { logger } from '../utils/index.js';

// ============================================================================
// Build Pipeline
// ============================================================================

/**
 * Create build steps based on configuration
 */
function createBuildSteps(config: ResolvedConfig, options: BuildOptions): BuildStep[] {
  const { skipValidate, onlyTheme, dryRun, verbose } = options;
  const tokensDir = config.configDir;

  return [
    {
      name: 'Validate Tokens',
      fn: async () => {
        const result = await validateTokens(config, { verbose, quiet: !verbose });
        if (!result.valid) {
          throw new Error('Token validation failed');
        }
      },
      skip: skipValidate,
    },
    {
      name: 'Transform Figma Tokens',
      fn: async () => {
        const result = await transformTokens(config, { dryRun, verbose });
        if (!result.success) {
          throw new Error('Token transformation failed');
        }
      },
      skip: onlyTheme,
    },
    {
      name: 'Build Style Dictionary',
      command: 'style-dictionary build --config sd.config.mjs',
      cwd: tokensDir,
      skip: onlyTheme,
    },
    {
      name: 'Sync tokens-flat.ts',
      fn: async () => {
        await syncTokens(config, { dryRun });
      },
      skip: onlyTheme,
    },
    {
      name: 'Compile Bootstrap Theme (unminified)',
      command:
        'sass --quiet-deps --silence-deprecation=import --silence-deprecation=global-builtin --silence-deprecation=color-functions src/scss/dsai-theme-bs.scss dist/css/dsai-theme-bs.css',
      cwd: tokensDir,
    },
    {
      name: 'Compile Bootstrap Theme (minified)',
      command:
        'sass --quiet-deps --silence-deprecation=import --silence-deprecation=global-builtin --silence-deprecation=color-functions src/scss/dsai-theme-bs.scss dist/css/dsai-theme-bs.min.css --style=compressed',
      cwd: tokensDir,
    },
    {
      name: 'Post-process Theme CSS',
      fn: async () => {
        await postprocessThemeCSS(config, { dryRun });
      },
    },
    {
      name: 'Compile DSAi Utilities (unminified)',
      command:
        'sass --quiet-deps --silence-deprecation=import src/scss/dsai-utilities.scss dist/css/dsai.css',
      cwd: tokensDir,
      skip: onlyTheme,
    },
    {
      name: 'Compile DSAi Utilities (minified)',
      command:
        'sass --quiet-deps --silence-deprecation=import src/scss/dsai-utilities.scss dist/css/dsai.min.css --style=compressed',
      cwd: tokensDir,
      skip: onlyTheme,
    },
    {
      name: 'Bundle with tsup',
      command: 'tsup',
      cwd: tokensDir,
      skip: onlyTheme,
    },
  ];
}

/**
 * Run a single build step
 */
async function runStep(
  step: BuildStep,
  index: number,
  total: number,
  options: BuildOptions
): Promise<boolean> {
  const { dryRun, verbose, quiet } = options;
  const stepNum = `[${index + 1}/${total}]`;

  if (step.skip) {
    if (!quiet) {
      logger.info(`${stepNum} ⏭️  ${step.name} (skipped)`);
    }
    return true;
  }

  if (!quiet) {
    logger.info(`${stepNum} 🔧 ${step.name}`);
  }

  try {
    if (step.fn) {
      // Run function
      if (dryRun) {
        if (verbose) {
          logger.debug(`[DRY RUN] Would execute: ${step.name}`);
        }
      } else {
        await step.fn();
      }
    } else if (step.command) {
      // Run shell command
      if (dryRun) {
        if (verbose) {
          logger.debug(`[DRY RUN] Would run: ${step.command}`);
        }
      } else {
        execSync(step.command, {
          cwd: step.cwd,
          stdio: verbose ? 'inherit' : 'pipe',
        });
      }
    }

    return true;
  } catch (error) {
    logger.error(`Failed: ${step.name}`);
    if (verbose) {
      console.error(error);
    }
    return false;
  }
}

// ============================================================================
// Main Build Function
// ============================================================================

/**
 * Build all tokens
 *
 * @param config - Resolved configuration
 * @param options - Build options
 * @returns Build result
 *
 * @example
 * ```typescript
 * import { buildTokens, loadConfig } from '@dsai/tools';
 *
 * const { config } = await loadConfig();
 * const result = await buildTokens(config);
 *
 * if (result.success) {
 *   console.log('Build completed in', result.duration, 'ms');
 * }
 * ```
 */
export async function buildTokens(
  config: ResolvedConfig,
  options: BuildOptions = {}
): Promise<BuildResult> {
  const startTime = Date.now();
  const { quiet } = options;

  if (!quiet) {
    logger.info('🚀 Starting token build...');
  }

  const steps = createBuildSteps(config, options);
  const activeSteps = steps.filter((s) => !s.skip);

  const result: BuildResult = {
    success: true,
    stepsCompleted: [],
    stepsFailed: [],
    duration: 0,
    errors: [],
  };

  let stepIndex = 0;
  for (const step of steps) {
    if (!step.skip) {
      stepIndex++;
    }

    const success = await runStep(step, stepIndex, activeSteps.length, options);

    if (success) {
      if (!step.skip) {
        result.stepsCompleted.push(step.name);
      }
    } else {
      result.stepsFailed.push(step.name);
      result.success = false;
      result.errors.push(`Step failed: ${step.name}`);
      break; // Stop on first failure
    }
  }

  result.duration = Date.now() - startTime;

  if (!quiet) {
    if (result.success) {
      logger.success(`✨ Build completed in ${result.duration}ms`);
    } else {
      logger.error(`Build failed after ${result.duration}ms`);
    }
  }

  return result;
}

/**
 * Build tokens in watch mode
 */
export async function buildTokensWatch(
  config: ResolvedConfig,
  options: BuildOptions = {}
): Promise<void> {
  logger.info('👀 Starting watch mode...');

  // Initial build
  await buildTokens(config, options);

  // Watch for changes
  const chokidar = await import('chokidar');
  const watcher = chokidar.watch([config.tokens.sourceDir, join(config.configDir, 'collections')], {
    ignoreInitial: true,
  });

  watcher.on('change', async (path) => {
    logger.info(`📝 File changed: ${path}`);
    await buildTokens(config, options);
  });

  watcher.on('add', async (path) => {
    logger.info(`➕ File added: ${path}`);
    await buildTokens(config, options);
  });

  logger.info('Watching for changes... (Ctrl+C to stop)');
}
````

### Step 5: Implement Sync Module

**src/tokens/sync.ts:**

```typescript
/**
 * Token sync module
 *
 * Synchronizes Style Dictionary output to TypeScript source files.
 *
 * @packageDocumentation
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import type { ResolvedConfig } from '../config/types.js';
import type { SyncOptions, SyncResult } from './types.js';
import { logger } from '../utils/index.js';

/**
 * Sync tokens from Style Dictionary output to TypeScript source
 *
 * @param config - Resolved configuration
 * @param options - Sync options
 * @returns Sync result
 */
export async function syncTokens(
  config: ResolvedConfig,
  options: Partial<SyncOptions> = {}
): Promise<SyncResult> {
  const { dryRun = false } = options;
  const tokensDir = config.configDir;

  const sourceFile = options.sourceFile ?? join(tokensDir, 'dist/js/tokens.js');
  const targetFile = options.targetFile ?? join(tokensDir, 'src/tokens-flat.ts');

  if (!existsSync(sourceFile)) {
    logger.error(`Source file not found: ${sourceFile}`);
    return { success: false, tokensCount: 0, changes: false };
  }

  logger.info('Syncing tokens-flat.ts from Style Dictionary output...');

  try {
    const sourceContent = readFileSync(sourceFile, 'utf-8');

    // Count exports for reporting
    const exportMatches = sourceContent.match(/export const/g);
    const tokensCount = exportMatches?.length ?? 0;

    // Add TypeScript header
    const tsContent = `/**
 * Do not edit directly, this file was auto-generated.
 * Generated from Style Dictionary output (dist/js/tokens.js)
 *
 * To update: run \`dsai-tools tokens build\` which will:
 * 1. Transform Figma tokens
 * 2. Build with Style Dictionary
 * 3. Sync this file automatically
 */

${sourceContent}`;

    // Check if content changed
    let changes = true;
    if (existsSync(targetFile)) {
      const currentContent = readFileSync(targetFile, 'utf-8');
      changes = currentContent !== tsContent;
    }

    if (dryRun) {
      logger.debug(`[DRY RUN] Would write ${tokensCount} tokens to ${targetFile}`);
    } else if (changes) {
      writeFileSync(targetFile, tsContent);
      logger.success(`Synced ${tokensCount} tokens to tokens-flat.ts`);
    } else {
      logger.info('No changes detected, skipping sync');
    }

    // Verify font families
    if (sourceContent.includes("'Inter,")) {
      logger.debug('✓ Font family includes Inter');
    } else {
      logger.warn('Font family may be missing Inter!');
    }

    return { success: true, tokensCount, changes };
  } catch (error) {
    logger.error(`Sync failed: ${(error as Error).message}`);
    return { success: false, tokensCount: 0, changes: false };
  }
}
```

### Step 6: Update Index Exports

**src/tokens/index.ts:**

```typescript
/**
 * Token tooling module for @dsai/tools
 *
 * @packageDocumentation
 */

// Types
export type {
  Token,
  DTCGToken,
  LegacyToken,
  TokenCollection,
  FigmaExport,
  TokenType,
  ValidationResult,
  ValidationError,
  TransformOptions,
  TransformResult,
  BuildOptions,
  BuildResult,
  SyncOptions,
  SyncResult,
  PostprocessOptions,
  PostprocessResult,
} from './types.js';

// Validation
export { validateTokens, validateTokensCLI } from './validate.js';

// Transform
export { transformTokens } from './transform.js';

// Sync
export { syncTokens } from './sync.js';

// Build
export { buildTokens, buildTokensWatch } from './build.js';

// Postprocess
export { postprocessThemeCSS } from './postprocess.js';
```

---

## 📝 Notes

### Migration Strategy

1. Create new modules in @dsai/tools
2. Test against existing token output
3. Update @dsai/tokens to use new modules
4. Deprecate old scripts with warnings
5. Remove old scripts after migration period

### Backward Compatibility

- All output formats identical to current
- Same file paths and names
- Same token structure
- Same CSS variable naming

### Performance Considerations

- Parallel file processing where possible
- Lazy loading of heavy dependencies
- Caching for watch mode

---

## ✅ Definition of Done

- [ ] All scripts migrated to TypeScript
- [ ] Programmatic API works
- [ ] CLI commands work
- [ ] Output matches current build
- [ ] All tests pass
- [ ] Documentation complete
- [ ] @dsai/tokens can use new modules
