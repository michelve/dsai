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

function findCollection(
  data: FigmaExport,
  collectionName: string
): FigmaCollection | undefined {
  return Object.entries(data).find(
    ([key]) => key.toLowerCase() === collectionName.toLowerCase()
  )?.[1];
}

function validateExpectedModes(
  collectionName: string,
  expectedCollection: ExpectedCollection,
  modes: string[],
  warnings: ValidationIssue[]
): void {
  if (!expectedCollection.modeAware || !expectedCollection.modes) {
    return;
  }
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

function validateCollectionModes(
  collection: FigmaCollection,
  collectionName: string,
  expectedCollection: ExpectedCollection,
  errors: ValidationIssue[],
  warnings: ValidationIssue[],
  detectedModes: Set<string>
): void {
  if (!collection.modes) {
    validateTokenTree(collection, collectionName, errors, warnings);
    return;
  }

  const modes = Object.keys(collection.modes);
  for (const mode of modes) {
    detectedModes.add(mode);
  }

  validateExpectedModes(collectionName, expectedCollection, modes, warnings);

  for (const [modeName, modeData] of Object.entries(collection.modes)) {
    if (modeData && typeof modeData === 'object') {
      validateTokenTree(modeData, `${collectionName}.modes.${modeName}`, errors, warnings);
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

  const collection = findCollection(data, collectionName);

  if (!collection) {
    errors.push({
      path: collectionName,
      message: `Expected collection "${collectionName}" not found in export`,
      severity: 'error',
    });
    return detectedModes;
  }

  validateCollectionModes(collection, collectionName, expectedCollection, errors, warnings, detectedModes);

  return detectedModes;
}

// ============================================================================
// Main Validation Functions
// ============================================================================

function countTokens(obj: unknown): number {
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
}

function parsedIsFigmaExport(
  result: FigmaExport | ValidationIssue
): result is FigmaExport {
  return !('severity' in result);
}

function parseFigmaExport(filePath: string): FigmaExport | ValidationIssue {
  try {
    const content = readFileSync(filePath, 'utf-8');
    return JSON.parse(content) as FigmaExport;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return {
      path: filePath,
      message: `Failed to parse JSON: ${message}`,
      severity: 'error',
    };
  }
}

function collectModesFromEntries(
  data: FigmaExport,
  errors: ValidationIssue[],
  warnings: ValidationIssue[],
  detectedModes: Set<string>
): void {
  for (const [key, collection] of Object.entries(data)) {
    if (typeof collection !== 'object' || collection === null) {
      continue;
    }
    if (collection.modes) {
      for (const mode of Object.keys(collection.modes)) {
        detectedModes.add(mode);
      }
    }
    validateTokenTree(collection, key, errors, warnings);
  }
}

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

  if (!existsSync(filePath)) {
    errors.push({
      path: filePath,
      message: 'File not found',
      severity: 'error',
    });
    return { valid: false, errors, warnings, detectedModes, tokenCount: 0, fileCount: 0 };
  }

  const parseResult = parseFigmaExport(filePath);
  if (!parsedIsFigmaExport(parseResult)) {
    errors.push(parseResult);
    return { valid: false, errors, warnings, detectedModes, tokenCount: 0, fileCount: 1 };
  }

  const data = parseResult;

  if (data === null || typeof data !== 'object' || Array.isArray(data)) {
    errors.push({
      path: filePath,
      message: 'Figma export must be a JSON object',
      severity: 'error',
    });
    return { valid: false, errors, warnings, detectedModes, tokenCount: 0, fileCount: 1 };
  }

  const fileName = basename(filePath, extname(filePath));
  const collectionName = fileName.charAt(0).toUpperCase() + fileName.slice(1);

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
    collectModesFromEntries(data, errors, warnings, detectedModes);
  }

  const tokenCount = countTokens(data);

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    detectedModes,
    tokenCount,
    fileCount: 1,
  };
}

function validateExpectedCollections(
  targetDir: string,
  collections: ExpectedCollections,
  skipMissing: boolean,
  errors: ValidationIssue[],
  warnings: ValidationIssue[],
  files: Map<string, ValidationResult>,
  detectedModes: Set<string>,
  missingFiles: string[],
  totals: { tokenCount: number; fileCount: number }
): void {
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

    errors.push(...result.errors);
    warnings.push(...result.warnings);
    totals.tokenCount += result.tokenCount;
    totals.fileCount += result.fileCount;
    for (const mode of result.detectedModes) {
      detectedModes.add(mode);
    }
  }
}

function warnUnexpectedFiles(
  targetDir: string,
  collections: ExpectedCollections,
  warnings: ValidationIssue[]
): void {
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
  const totals = { tokenCount: 0, fileCount: 0 };

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

  validateExpectedCollections(
    targetDir, collections, skipMissing, errors, warnings,
    files, detectedModes, missingFiles, totals
  );

  warnUnexpectedFiles(targetDir, collections, warnings);

  // In strict mode, treat warnings as errors
  const effectiveErrors = strict ? [...errors, ...warnings] : errors;

  return {
    valid: effectiveErrors.length === 0,
    errors,
    warnings,
    files,
    detectedModes,
    missingFiles,
    tokenCount: totals.tokenCount,
    fileCount: totals.fileCount,
  };
}

/**
 * Detect modes from Figma export data
 */
export function detectModes(data: FigmaExport, collectionName?: string): string[] {
  if (!data || typeof data !== 'object') {
    return ['Base'];
  }

  if (collectionName) {
    const collection = findCollection(data, collectionName);

    if (collection?.modes) {
      return Object.keys(collection.modes);
    }
    return ['Base'];
  }

  for (const [, collection] of Object.entries(data)) {
    if (collection?.modes) {
      return Object.keys(collection.modes);
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
  const SEPARATOR_WIDTH = 50;
  console.info(`\n${'─'.repeat(SEPARATOR_WIDTH)}`);
  if (result.valid) {
    console.info('✅ All Figma exports are valid');
  } else {
    console.error(
      `❌ Validation failed: ${result.errors.length} error(s), ${result.warnings.length} warning(s)`
    );
  }

  return result.valid;
}
