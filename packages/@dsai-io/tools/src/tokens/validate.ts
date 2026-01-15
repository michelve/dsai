/**
 * Token validation module
 *
 * Validates design tokens for DTCG compliance and structural integrity.
 *
 * @packageDocumentation
 */

/* eslint-disable no-console, security/detect-non-literal-fs-filename */

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

import {
  getTokenType,
  getTokenValue,
  isDTCGToken,
  isToken,
  isTokenReference,
  isValidTokenType,
  VALID_TOKEN_TYPES,
} from './types.js';

import type {
  Token,
  TokenCollection,
  TokenType,
  ValidateOptions,
  ValidationIssue,
  ValidationResult,
} from './types.js';
import type { ResolvedConfig } from '../config/types.js';

// ============================================================================
// Color Validation
// ============================================================================

/** Hex color pattern */
const HEX_COLOR_PATTERN = /^#(?:[0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i;

/** RGB/RGBA pattern */
const RGB_PATTERN = /^rgba?\s*\(/i;

/** HSL/HSLA pattern */
const HSL_PATTERN = /^hsla?\s*\(/i;

/** Named colors (common subset) */
const NAMED_COLORS = new Set([
  'transparent',
  'currentcolor',
  'inherit',
  'initial',
  'unset',
  'black',
  'white',
  'red',
  'green',
  'blue',
  'yellow',
  'orange',
  'purple',
  'pink',
  'gray',
  'grey',
]);

/**
 * Check if a value is a valid color
 */
function isValidColor(value: string): boolean {
  // Hex colors
  if (HEX_COLOR_PATTERN.test(value)) {
    return true;
  }
  // RGB/RGBA
  if (RGB_PATTERN.test(value)) {
    return true;
  }
  // HSL/HSLA
  if (HSL_PATTERN.test(value)) {
    return true;
  }
  // Token references
  if (isTokenReference(value)) {
    return true;
  }
  // Named colors
  if (NAMED_COLORS.has(value.toLowerCase())) {
    return true;
  }
  return false;
}

// ============================================================================
// Dimension Validation
// ============================================================================

/** Valid dimension units */
const VALID_UNITS = new Set([
  'px',
  'rem',
  'em',
  '%',
  'vh',
  'vw',
  'vmin',
  'vmax',
  'pt',
  'cm',
  'mm',
  'in',
  'ch',
  'ex',
]);

/**
 * Check if a value is a valid dimension
 */
function isValidDimension(value: string): boolean {
  // Zero without unit
  if (value === '0') {
    return true;
  }
  // Token reference
  if (isTokenReference(value)) {
    return true;
  }
  // Parse numeric value and unit manually (safer than regex)
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return false;
  }
  // Find where the numeric part ends
  let i = 0;
  const firstChar = trimmed.charAt(0);
  if (firstChar === '-' || firstChar === '+') {
    i = 1;
  }
  let hasDigits = false;
  let hasDot = false;
  while (i < trimmed.length) {
    const char = trimmed.charAt(i);
    if (char >= '0' && char <= '9') {
      hasDigits = true;
      i++;
    } else if (char === '.' && !hasDot) {
      hasDot = true;
      i++;
    } else {
      break;
    }
  }
  if (!hasDigits) {
    return false;
  }
  // Extract unit part
  const unit = trimmed.slice(i).toLowerCase();
  // Pure number (for unitless values like line-height)
  if (unit === '') {
    return true;
  }
  // Check valid units
  return VALID_UNITS.has(unit);
}

// ============================================================================
// Token Validation
// ============================================================================

/**
 * Validate a single token
 */
function validateSingleToken(
  path: string,
  token: Token,
  errors: ValidationIssue[],
  warnings: ValidationIssue[]
): void {
  const value = getTokenValue(token);
  const type = getTokenType(token);
  const isDtcg = isDTCGToken(token);

  // Warn if not using DTCG format
  if (!isDtcg) {
    warnings.push({
      path,
      message: 'Token uses legacy format. Consider migrating to DTCG ($value, $type).',
      severity: 'warning',
      suggestion: 'Use $value instead of value, $type instead of type',
    });
  }

  // Check for missing value
  if (value === undefined || value === null) {
    errors.push({
      path,
      message: 'Token has no value',
      severity: 'error',
    });
    return;
  }

  // Check for empty string value
  if (value === '') {
    warnings.push({
      path,
      message: 'Token has empty string value',
      severity: 'warning',
      value,
    });
  }

  // Check for missing type
  if (!type) {
    warnings.push({
      path,
      message: 'Token has no type specified',
      severity: 'warning',
      suggestion: `Add $type property with one of: ${VALID_TOKEN_TYPES.slice(0, 5).join(', ')}...`,
    });
  } else if (!isValidTokenType(type)) {
    warnings.push({
      path,
      message: `Unknown token type: "${type}"`,
      severity: 'warning',
      value: type,
      suggestion: `Valid types: ${VALID_TOKEN_TYPES.join(', ')}`,
    });
  }

  // Type-specific validation
  if (type && typeof value === 'string') {
    validateTypedValue(path, value, type as TokenType, errors);
  }
}

/**
 * Validate a typed value
 */
function validateTypedValue(
  path: string,
  value: string,
  type: TokenType,
  errors: ValidationIssue[]
): void {
  switch (type) {
    case 'color':
      if (!isValidColor(value)) {
        errors.push({
          path,
          message: `Invalid color value: "${value}"`,
          severity: 'error',
          value,
          suggestion: 'Use hex (#fff), rgb(), hsl(), or token reference',
        });
      }
      break;

    case 'dimension':
      if (!isValidDimension(value)) {
        errors.push({
          path,
          message: `Invalid dimension value: "${value}"`,
          severity: 'error',
          value,
          suggestion: 'Use value with unit (16px, 1rem) or token reference',
        });
      }
      break;

    case 'fontWeight':
      if (!isValidFontWeight(value)) {
        errors.push({
          path,
          message: `Invalid fontWeight value: "${value}"`,
          severity: 'error',
          value,
          suggestion: 'Use numeric (100-900) or keyword (normal, bold)',
        });
      }
      break;

    // Add more type-specific validations as needed
    default:
      // Other types pass through
      break;
  }
}

/**
 * Check if a value is a valid font weight
 */
function isValidFontWeight(value: string): boolean {
  // Numeric weights
  const numeric = parseInt(value, 10);
  if (!Number.isNaN(numeric) && numeric >= 1 && numeric <= 1000) {
    return true;
  }
  // Keywords
  const keywords = ['normal', 'bold', 'lighter', 'bolder'];
  if (keywords.includes(value.toLowerCase())) {
    return true;
  }
  // Token reference
  if (isTokenReference(value)) {
    return true;
  }
  return false;
}

// ============================================================================
// Collection Validation
// ============================================================================

/**
 * Recursively validate a token collection
 */
function validateCollection(
  collection: TokenCollection,
  basePath: string,
  errors: ValidationIssue[],
  warnings: ValidationIssue[],
  tokenCount: { count: number }
): void {
  for (const [key, value] of Object.entries(collection)) {
    // Skip metadata keys
    if (key.startsWith('$')) {
      continue;
    }

    const path = basePath ? `${basePath}.${key}` : key;

    if (isToken(value)) {
      tokenCount.count += 1;
      validateSingleToken(path, value, errors, warnings);
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
  errors: ValidationIssue[],
  warnings: ValidationIssue[]
): number {
  try {
    const content = readFileSync(filePath, 'utf-8');
    const data = JSON.parse(content) as TokenCollection;
    const tokenCount = { count: 0 };

    validateCollection(data, '', errors, warnings, tokenCount);

    return tokenCount.count;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    errors.push({
      path: filePath,
      message: `Failed to parse file: ${errorMessage}`,
      severity: 'error',
    });
    return 0;
  }
}

/**
 * Find all JSON files recursively in a directory
 */
function findJsonFiles(dir: string, files: string[] = []): string[] {
  if (!existsSync(dir)) {
    return files;
  }

  const entries = readdirSync(dir);
  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      findJsonFiles(fullPath, files);
    } else if (entry.endsWith('.json')) {
      files.push(fullPath);
    }
  }

  return files;
}

// ============================================================================
// Main Validation Function
// ============================================================================

/**
 * Validate all tokens in a directory
 *
 * @param config - Resolved configuration
 * @param options - Validation options
 * @returns Validation result
 *
 * @example
 * ```typescript
 * import { validateTokens, loadConfig } from '@dsai-io/tools';
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
  options: ValidateOptions = {}
): Promise<ValidationResult> {
  const startTime = Date.now();
  const { verbose = false, quiet = false, strict = false } = options;

  const errors: ValidationIssue[] = [];
  const warnings: ValidationIssue[] = [];
  let totalTokens = 0;
  let fileCount = 0;

  // Use provided directory or config
  const collectionsDir = options.collectionsDir ?? config.tokens.collectionsDir;

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
      duration: Date.now() - startTime,
    };
  }

  // Find all JSON files
  const jsonFiles = findJsonFiles(collectionsDir);

  if (!quiet) {
    logInfo(`Validating ${jsonFiles.length} token files...`);
  }

  // Validate each file
  for (const file of jsonFiles) {
    fileCount += 1;
    const relativePath = relative(collectionsDir, file);

    if (verbose) {
      logDebug(`Validating: ${relativePath}`);
    }

    const tokenCount = validateFile(file, errors, warnings);
    totalTokens += tokenCount;
  }

  // Determine validity
  const valid = strict ? errors.length === 0 && warnings.length === 0 : errors.length === 0;

  // Report results
  if (!quiet) {
    if (valid) {
      logSuccess(`Validated ${totalTokens} tokens in ${fileCount} files`);
      if (warnings.length > 0) {
        logWarn(`${warnings.length} warnings found`);
      }
    } else {
      logError(`Validation failed with ${errors.length} errors`);
    }
  }

  return {
    valid,
    errors,
    warnings,
    tokenCount: totalTokens,
    fileCount,
    duration: Date.now() - startTime,
  };
}

/**
 * Validate tokens and exit with code (for CLI usage)
 *
 * @param config - Resolved configuration
 * @param options - Validation options
 */
export async function validateTokensCLI(
  config: ResolvedConfig,
  options: ValidateOptions = {}
): Promise<void> {
  const result = await validateTokens(config, { ...options, verbose: true });

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

// ============================================================================
// Simple Logging (will be replaced with proper logger in future)
// ============================================================================

function logInfo(message: string): void {
  console.info(`ℹ️  ${message}`);
}

function logDebug(message: string): void {
  console.info(`🔍 ${message}`);
}

function logSuccess(message: string): void {
  console.info(`✅ ${message}`);
}

function logWarn(message: string): void {
  console.warn(`⚠️  ${message}`);
}

function logError(message: string): void {
  console.error(`❌ ${message}`);
}
