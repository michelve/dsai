/**
 * Figma Export Validation module
 *
 * Validates Figma token exports before transformation to ensure
 * they meet the expected structure and format requirements.
 *
 * @packageDocumentation
 */

/* eslint-disable no-console, security/detect-non-literal-fs-filename */

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { basename, extname, join } from 'node:path';

import { isDTCGToken, isLegacyToken, isToken, isValidTokenType } from './types.js';

import type { FigmaCollection, FigmaExport, ValidationIssue, ValidationResult } from './types.js';
import type { ResolvedConfig } from '../config/types.js';

// ============================================================================
// Types
// ============================================================================

/**
 * Expected structure for a Figma collection
 */
interface ExpectedCollection {
  /** File name for this collection */
  input: string;
  /** Whether the collection has mode variants (Light/Dark) */
  modeAware: boolean;
  /** Expected mode names */
  modes?: string[];
}

/**
 * Expected collections configuration
 */
interface ExpectedCollections {
  [key: string]: ExpectedCollection;
}

/**
 * Figma validation options
 */
export interface ValidateFigmaOptions {
  /** Path to the figma-exports directory */
  exportsDir?: string;
  /** Expected collection definitions */
  collections?: ExpectedCollections;
  /** Strict mode - treat warnings as errors */
  strict?: boolean;
  /** Skip missing files */
  skipMissing?: boolean;
  /** Configuration object */
  config?: ResolvedConfig;
}

/**
 * Figma validation result
 */
export interface ValidateFigmaResult extends ValidationResult {
  /** Per-file validation results */
  files: Map<string, ValidationResult>;
  /** Detected modes across all files */
  detectedModes: Set<string>;
  /** Missing expected files */
  missingFiles: string[];
}

// ============================================================================
// Constants
// ============================================================================

/**
 * Default expected collections configuration
 */
const DEFAULT_COLLECTIONS: ExpectedCollections = {
  foundation: {
    input: 'foundation.json',
    modeAware: true,
    modes: ['Light', 'Dark'],
  },
  typography: {
    input: 'typography.json',
    modeAware: false,
    modes: ['Base'],
  },
  spacing: {
    input: 'spacing.json',
    modeAware: false,
    modes: ['Base'],
  },
  radius: {
    input: 'radius.json',
    modeAware: false,
    modes: ['Base'],
  },
  layout: {
    input: 'layout.json',
    modeAware: false,
    modes: ['Base'],
  },
  shadows: {
    input: 'shadows.json',
    modeAware: false,
    modes: ['Base'],
  },
};

// ============================================================================
// Validation Helpers
// ============================================================================

/**
 * Validate a single token from Figma export
 */
function validateFigmaToken(
  path: string,
  token: unknown,
  errors: ValidationIssue[],
  warnings: ValidationIssue[]
): void {
  if (!isToken(token)) {
    // Not a token object, might be a nested group
    return;
  }

  // Check for required $value
  if (isDTCGToken(token)) {
    if (token.$value === undefined || token.$value === null) {
      errors.push({
        path,
        message: 'Token has $value property but value is undefined or null',
        severity: 'error',
      });
    }

    // Validate token type if present
    if (token.$type !== undefined) {
      if (!isValidTokenType(token.$type)) {
        warnings.push({
          path,
          message: `Unknown token type: ${token.$type}`,
          severity: 'warning',
        });
      }
    }
  } else if (isLegacyToken(token)) {
    if (token.value === undefined || token.value === null) {
      errors.push({
        path,
        message: 'Token has value property but value is undefined or null',
        severity: 'error',
      });
    }

    // Suggest migrating to DTCG format
    warnings.push({
      path,
      message: 'Token uses legacy format (value instead of $value), consider migrating to DTCG',
      severity: 'warning',
    });
  }
}

/**
 * Recursively validate a token tree
 */
function validateTokenTree(
  obj: unknown,
  basePath: string,
  errors: ValidationIssue[],
  warnings: ValidationIssue[]
): void {
  if (obj === null || typeof obj !== 'object') {
    return;
  }

  for (const [key, value] of Object.entries(obj)) {
    const path = basePath ? `${basePath}.${key}` : key;

    // Check if this is a token
    if (isToken(value)) {
      validateFigmaToken(path, value, errors, warnings);
    } else if (typeof value === 'object' && value !== null) {
      // Recursively validate nested objects
      validateTokenTree(value, path, errors, warnings);
    }
  }
}

/**
 * Validate a Figma collection structure
 */
function validateCollectionStructure(
  data: FigmaExport,
  collectionName: string,
  expectedCollection: ExpectedCollection,
  errors: ValidationIssue[],
  warnings: ValidationIssue[]
): Set<string> {
  const detectedModes = new Set<string>();

  // Find the collection in the data
  const collection = Object.entries(data).find(
    ([key]) => key.toLowerCase() === collectionName.toLowerCase()
  )?.[1] as FigmaCollection | undefined;

  if (!collection) {
    errors.push({
      path: collectionName,
      message: `Expected collection "${collectionName}" not found in export`,
      severity: 'error',
    });
    return detectedModes;
  }

  // Validate modes structure
  if (collection.modes) {
    const modes = Object.keys(collection.modes);

    for (const mode of modes) {
      detectedModes.add(mode);
    }

    // Check if expected modes are present
    if (expectedCollection.modeAware && expectedCollection.modes) {
      for (const expectedMode of expectedCollection.modes) {
        if (!modes.includes(expectedMode)) {
          warnings.push({
            path: `${collectionName}.modes`,
            message: `Expected mode "${expectedMode}" not found, available modes: ${modes.join(', ')}`,
            severity: 'warning',
          });
        }
      }
    }

    // Validate tokens in each mode
    for (const [modeName, modeData] of Object.entries(collection.modes)) {
      if (modeData && typeof modeData === 'object') {
        validateTokenTree(modeData, `${collectionName}.modes.${modeName}`, errors, warnings);
      }
    }
  } else {
    // No modes structure, validate at collection level
    validateTokenTree(collection, collectionName, errors, warnings);
  }

  return detectedModes;
}

// ============================================================================
// Main Validation Functions
// ============================================================================

/**
 * Validate a single Figma export file
 */
export function validateFigmaFile(
  filePath: string,
  expectedCollection?: ExpectedCollection
): ValidationResult & { detectedModes: Set<string> } {
  const errors: ValidationIssue[] = [];
  const warnings: ValidationIssue[] = [];
  const detectedModes = new Set<string>();
  let tokenCount = 0;

  // Check file exists
  if (!existsSync(filePath)) {
    errors.push({
      path: filePath,
      message: 'File not found',
      severity: 'error',
    });
    return { valid: false, errors, warnings, detectedModes, tokenCount: 0, fileCount: 0 };
  }

  // Parse JSON
  let data: FigmaExport;
  try {
    const content = readFileSync(filePath, 'utf-8');
    data = JSON.parse(content) as FigmaExport;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    errors.push({
      path: filePath,
      message: `Failed to parse JSON: ${message}`,
      severity: 'error',
    });
    return { valid: false, errors, warnings, detectedModes, tokenCount: 0, fileCount: 1 };
  }

  // Validate basic structure
  if (data === null || typeof data !== 'object' || Array.isArray(data)) {
    errors.push({
      path: filePath,
      message: 'Figma export must be a JSON object',
      severity: 'error',
    });
    return { valid: false, errors, warnings, detectedModes, tokenCount: 0, fileCount: 1 };
  }

  // Get collection name from filename
  const fileName = basename(filePath, extname(filePath));
  const collectionName = fileName.charAt(0).toUpperCase() + fileName.slice(1);

  // Count tokens helper
  const countTokens = (obj: unknown): number => {
    if (obj === null || typeof obj !== 'object') {
      return 0;
    }
    if (isToken(obj)) {
      return 1;
    }
    let count = 0;
    for (const value of Object.values(obj)) {
      count += countTokens(value);
    }
    return count;
  };

  // Validate collection structure if expected collection provided
  if (expectedCollection) {
    const modes = validateCollectionStructure(
      data,
      collectionName,
      expectedCollection,
      errors,
      warnings
    );
    for (const mode of modes) {
      detectedModes.add(mode);
    }
  } else {
    // General validation without expected structure
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'object' && value !== null) {
        const collection = value as FigmaCollection;
        if (collection.modes) {
          for (const mode of Object.keys(collection.modes)) {
            detectedModes.add(mode);
          }
        }
        validateTokenTree(value, key, errors, warnings);
      }
    }
  }

  tokenCount = countTokens(data);

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    detectedModes,
    tokenCount,
    fileCount: 1,
  };
}

/**
 * Validate all Figma exports in a directory
 */
export function validateFigmaExports(options: ValidateFigmaOptions = {}): ValidateFigmaResult {
  const {
    exportsDir,
    collections = DEFAULT_COLLECTIONS,
    strict = false,
    skipMissing = false,
  } = options;

  const errors: ValidationIssue[] = [];
  const warnings: ValidationIssue[] = [];
  const files = new Map<string, ValidationResult>();
  const detectedModes = new Set<string>();
  const missingFiles: string[] = [];
  let totalTokenCount = 0;
  let totalFileCount = 0;

  // Resolve exports directory
  const targetDir = exportsDir ?? options.config?.tokens.sourceDir;

  if (!targetDir) {
    errors.push({
      path: 'config',
      message: 'Figma exports directory not specified',
      severity: 'error',
    });
    return {
      valid: false,
      errors,
      warnings,
      files,
      detectedModes,
      missingFiles,
      tokenCount: 0,
      fileCount: 0,
    };
  }

  // Check directory exists
  if (!existsSync(targetDir)) {
    errors.push({
      path: targetDir,
      message: 'Figma exports directory not found',
      severity: 'error',
    });
    return {
      valid: false,
      errors,
      warnings,
      files,
      detectedModes,
      missingFiles,
      tokenCount: 0,
      fileCount: 0,
    };
  }

  // Validate each expected collection
  for (const [_name, expectedCollection] of Object.entries(collections)) {
    const filePath = join(targetDir, expectedCollection.input);

    if (!existsSync(filePath)) {
      missingFiles.push(expectedCollection.input);
      if (!skipMissing) {
        errors.push({
          path: filePath,
          message: `Expected Figma export "${expectedCollection.input}" not found`,
          severity: 'error',
        });
      }
      continue;
    }

    const result = validateFigmaFile(filePath, expectedCollection);
    files.set(expectedCollection.input, {
      valid: result.valid,
      errors: result.errors,
      warnings: result.warnings,
      tokenCount: result.tokenCount,
      fileCount: result.fileCount,
    });

    // Aggregate results
    errors.push(...result.errors);
    warnings.push(...result.warnings);
    totalTokenCount += result.tokenCount;
    totalFileCount += result.fileCount;
    for (const mode of result.detectedModes) {
      detectedModes.add(mode);
    }
  }

  // Check for unexpected files in the exports directory
  try {
    const existingFiles = readdirSync(targetDir).filter(
      (f) => f.endsWith('.json') && statSync(join(targetDir, f)).isFile()
    );
    const expectedFiles = new Set(Object.values(collections).map((c) => c.input));

    for (const file of existingFiles) {
      if (!expectedFiles.has(file)) {
        warnings.push({
          path: join(targetDir, file),
          message: `Unexpected file in exports directory: ${file}`,
          severity: 'warning',
        });
      }
    }
  } catch {
    // Ignore read errors
  }

  // In strict mode, treat warnings as errors
  const effectiveErrors = strict ? [...errors, ...warnings] : errors;

  return {
    valid: effectiveErrors.length === 0,
    errors,
    warnings,
    files,
    detectedModes,
    missingFiles,
    tokenCount: totalTokenCount,
    fileCount: totalFileCount,
  };
}

/**
 * Detect modes from Figma export data
 */
export function detectModes(data: FigmaExport, collectionName?: string): string[] {
  if (!data || typeof data !== 'object') {
    return ['Base'];
  }

  // If collection name is specified, look for that collection
  if (collectionName) {
    const collection = Object.entries(data).find(
      ([key]) => key.toLowerCase() === collectionName.toLowerCase()
    )?.[1] as FigmaCollection | undefined;

    if (collection?.modes) {
      return Object.keys(collection.modes);
    }
    return ['Base'];
  }

  // Otherwise, look for modes in any collection
  for (const [, value] of Object.entries(data)) {
    if (typeof value === 'object' && value !== null) {
      const collection = value as FigmaCollection;
      if (collection.modes) {
        return Object.keys(collection.modes);
      }
    }
  }

  return ['Base'];
}

// ============================================================================
// CLI Support
// ============================================================================

/**
 * CLI entry point for Figma validation
 */
export function validateFigmaCLI(
  exportsDir: string,
  options: Omit<ValidateFigmaOptions, 'exportsDir'> = {}
): boolean {
  console.info(`\n🔍 Validating Figma exports in: ${exportsDir}\n`);

  const result = validateFigmaExports({ ...options, exportsDir });

  // Report results per file
  for (const [file, fileResult] of result.files) {
    if (fileResult.errors.length === 0 && fileResult.warnings.length === 0) {
      console.info(`✅ ${file}`);
    } else {
      console.info(`\n📄 ${file}`);
      for (const error of fileResult.errors) {
        console.error(`   ❌ ${error.path}: ${error.message}`);
      }
      for (const warning of fileResult.warnings) {
        console.warn(`   ⚠️  ${warning.path}: ${warning.message}`);
      }
    }
  }

  // Report missing files
  if (result.missingFiles.length > 0) {
    console.warn(`\n⚠️  Missing files: ${result.missingFiles.join(', ')}`);
  }

  // Report detected modes
  if (result.detectedModes.size > 0) {
    console.info(`\n📊 Detected modes: ${[...result.detectedModes].join(', ')}`);
  }

  // Summary
  console.info(`\n${'─'.repeat(50)}`);
  if (result.valid) {
    console.info('✅ All Figma exports are valid');
  } else {
    console.error(
      `❌ Validation failed: ${result.errors.length} error(s), ${result.warnings.length} warning(s)`
    );
  }

  return result.valid;
}
