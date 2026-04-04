/**
 * @file Token Collections Merge Module
 * @description Merge multiple Figma Tokens Studio collection files into one unified collection
 *
 * Features:
 * - Intelligently merges nested token structures
 * - Preserves all metadata ($codeSyntax, $scopes, $type, etc.)
 * - Maintains token references and aliases
 * - Handles mode-based tokens (Light Mode, Dark Mode)
 * - Deep merges sections without overwriting
 * - Normalizes reference format to lowercase {colors.path}
 * - Adds $libraryName and $collectionName to aliased tokens
 * - Sorts properties alphabetically for consistency
 * - Removes duplicate sections (like "hue" that duplicates "brand")
 *
 * @module @dsai-io/tools/tokens/merge
 */

/* eslint-disable no-console */
/* eslint-disable security/detect-non-literal-fs-filename */
/* eslint-disable security/detect-object-injection */

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

import type { MergeOptions, MergeResult } from './types';

// ============================================================================
// Type Definitions
// ============================================================================

type TokenValue = string | number | boolean | null | TokenObject | TokenValue[];

interface TokenObject {
  [key: string]: TokenValue;
}

type CollectionData = TokenObject[];

// ============================================================================
// Token Detection
// ============================================================================

/**
 * Check if an object is a token (has $type or $value)
 */
function isToken(obj: unknown): boolean {
  if (!obj || typeof obj !== 'object') {
    return false;
  }
  const record = obj as Record<string, unknown>;
  return '$type' in record || '$value' in record;
}

/**
 * Check if an object has child tokens
 */
function hasChildTokens(obj: unknown): boolean {
  if (!obj || typeof obj !== 'object') {
    return false;
  }
  const record = obj as Record<string, unknown>;
  for (const key of Object.keys(record)) {
    if (!key.startsWith('$') && typeof record[key] === 'object') {
      return true;
    }
  }
  return false;
}

// ============================================================================
// Deep Merge
// ============================================================================

/**
 * Deep merge two objects, preserving all properties
 * Special handling: If target has child tokens and source is a token,
 * or vice versa, prioritize the structure with children
 */
function deepMerge(
  target: TokenObject | undefined,
  source: TokenObject,
  verbose = false
): TokenObject {
  const result: TokenObject = target ? { ...target } : {};

  // Check for conflict: one is a token, the other has child tokens
  const targetIsToken = isToken(target);
  const sourceIsToken = isToken(source);
  const targetHasChildren = hasChildTokens(target);
  const sourceHasChildren = hasChildTokens(source);

  if (targetHasChildren && sourceIsToken) {
    if (verbose) {
      console.info('  ⚠️  Skipping single token in favor of children structure');
    }
    return result;
  }

  if (sourceHasChildren && targetIsToken) {
    if (verbose) {
      console.info('  ⚠️  Replacing single token with children structure');
    }
    return { ...source };
  }

  for (const key of Object.keys(source)) {
    const sourceValue = source[key];
    const targetValue = result[key];

    if (sourceValue && typeof sourceValue === 'object' && !Array.isArray(sourceValue)) {
      // Recursively merge nested objects
      result[key] = deepMerge(
        targetValue as TokenObject | undefined,
        sourceValue as TokenObject,
        verbose
      );
    } else if (Array.isArray(sourceValue)) {
      // Concatenate arrays
      const existingArray = Array.isArray(targetValue) ? targetValue : [];
      result[key] = [...existingArray, ...sourceValue];
    } else if (sourceValue !== undefined) {
      // Overwrite primitive values (source takes precedence)
      result[key] = sourceValue;
    }
  }

  return result;
}

// ============================================================================
// Token Counting
// ============================================================================

/**
 * Count tokens recursively in a nested structure
 */
function countTokens(obj: unknown): number {
  if (!obj || typeof obj !== 'object') {
    return 0;
  }

  let count = 0;
  const record = obj as Record<string, unknown>;

  for (const key of Object.keys(record)) {
    const value = record[key];

    if (value && typeof value === 'object' && !Array.isArray(value)) {
      const valueRecord = value as Record<string, unknown>;
      // Check if this is a token
      if ('$type' in valueRecord || '$value' in valueRecord) {
        count++;
      } else {
        // Recursively count nested tokens
        count += countTokens(value);
      }
    }
  }

  return count;
}

// ============================================================================
// Reference Normalization
// ============================================================================

/**
 * Update token references to match new collection name
 * Normalizes to lowercase format: {colors.path} instead of {Colors.path}
 */
function updateReferences(
  obj: TokenObject,
  oldName: string,
  newName: string,
  collectionName: string
): void {
  const normalizedOld = oldName.toLowerCase().replaceAll(/\s+/g, '');
  const normalizedNew = newName.toLowerCase().replaceAll(/\s+/g, '');

  // Build patterns to match (case-insensitive)
  const patternsLower = [`{${oldName.toLowerCase()}.`, `{${normalizedOld}.`];

  for (const key of Object.keys(obj)) {
    const value = obj[key];

    if (typeof value === 'string' && value.startsWith('{') && value.endsWith('}')) {
      // This is a token reference - normalize to lowercase
      let newValue = value;
      const valueLower = value.toLowerCase();

      for (const pattern of patternsLower) {
        if (valueLower.startsWith(pattern)) {
          // Replace the prefix with the normalized version
          const suffix = value.slice(pattern.length);
          newValue = `{${normalizedNew}.${suffix}`;
          break;
        }
      }
      obj[key] = newValue;

      // Add metadata for aliased tokens
      if ((obj[key] as string).startsWith('{')) {
        if (!('$libraryName' in obj)) {
          obj['$libraryName'] = '';
        }
        if (!('$collectionName' in obj)) {
          obj['$collectionName'] = collectionName;
        }
      }
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      updateReferences(value as TokenObject, oldName, newName, collectionName);
    }
  }
}

// ============================================================================
// Property Sorting
// ============================================================================

/**
 * Sort object properties alphabetically, with $ properties first
 */
function sortProperties(obj: unknown): unknown {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
    return obj;
  }

  const record = obj as Record<string, unknown>;
  const sorted: Record<string, unknown> = {};
  const keys = Object.keys(record).sort((a, b) => {
    // $ properties first, then alphabetically
    const aIsMeta = a.startsWith('$');
    const bIsMeta = b.startsWith('$');
    if (aIsMeta && !bIsMeta) {
      return -1;
    }
    if (!aIsMeta && bIsMeta) {
      return 1;
    }
    return a.localeCompare(b);
  });

  for (const key of keys) {
    sorted[key] = sortProperties(record[key]);
  }

  return sorted;
}

// ============================================================================
// Duplicate Detection
// ============================================================================

/**
 * Check if a section is a duplicate/alias section
 * (e.g., "hue" that just references "brand")
 */
function isDuplicateSection(obj: unknown): boolean {
  if (!obj || typeof obj !== 'object') {
    return false;
  }

  let hasOnlyReferences = true;
  let referenceCount = 0;

  function checkReferences(item: Record<string, unknown>): void {
    for (const key of Object.keys(item)) {
      if (key.startsWith('$')) {
        continue;
      }

      const value = item[key];
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        const valueRecord = value as Record<string, unknown>;
        if ('$value' in valueRecord) {
          referenceCount++;
          if (
            typeof valueRecord['$value'] === 'string' &&
            (valueRecord['$value'] as string).startsWith('{')
          ) {
            continue;
          } else {
            hasOnlyReferences = false;
            return;
          }
        }
        checkReferences(valueRecord);
      }
    }
  }

  checkReferences(obj as Record<string, unknown>);
  return hasOnlyReferences && referenceCount > 10;
}

/**
 * Get collection name from file structure
 */
function getCollectionName(data: CollectionData): string | null {
  if (Array.isArray(data) && data[0]) {
    const keys = Object.keys(data[0]);
    return keys[0] ?? null;
  }
  return null;
}

// ============================================================================
// Main Functions
// ============================================================================

/**
 * Load and parse JSON file
 */
function loadJSON(filePath: string, verbose: boolean): CollectionData | null {
  try {
    const fullPath = resolve(filePath);
    if (verbose) {
      console.info(`📖 Reading: ${fullPath}`);
    }
    const content = readFileSync(fullPath, 'utf-8');
    return JSON.parse(content) as CollectionData;
  } catch {
    return null;
  }
}

/**
 * Save JSON to file with pretty formatting
 */
function saveJSON(filePath: string, data: unknown, verbose: boolean): boolean {
  try {
    const fullPath = resolve(filePath);
    const content = JSON.stringify(data, null, 2);
    writeFileSync(fullPath, content, 'utf-8');
    if (verbose) {
      console.info(`✅ Saved: ${fullPath}`);
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Merge multiple collection files into one
 *
 * @example
 * ```typescript
 * const result = mergeCollections({
 *   sourceFiles: ['colors-scales.json', 'colors.json'],
 *   outputFile: 'merged-colors.json',
 * });
 * ```
 */
export function mergeCollections(options: MergeOptions): MergeResult {
  const { sourceFiles, outputFile, strategy = 'last', dryRun = false, verbose = false } = options;

  const errors: string[] = [];
  const conflicts: string[] = [];

  if (sourceFiles.length < 2) {
    return {
      success: false,
      collectionsCount: 0,
      tokensCount: 0,
      outputFile,
      errors: ['At least two source files are required'],
    };
  }

  // Validate files exist
  for (const file of sourceFiles) {
    if (!existsSync(file)) {
      errors.push(`Source file not found: ${file}`);
    }
  }

  if (errors.length > 0) {
    return {
      success: false,
      collectionsCount: 0,
      tokensCount: 0,
      outputFile,
      errors,
    };
  }

  if (verbose) {
    console.info('🔄 Starting merge process...\n');
  }

  // Load all source files
  const collections: { name: string | null; data: TokenObject; tokenCount: number }[] = [];

  for (const file of sourceFiles) {
    const data = loadJSON(file, verbose);
    if (!data || !Array.isArray(data) || !data[0]) {
      errors.push(`Invalid collection structure in: ${file}`);
      continue;
    }

    const name = getCollectionName(data);
    const collectionData = name
      ? (data[0][name] as TokenObject)
      : (data[0] as unknown as TokenObject);
    const tokenCount = countTokens(collectionData);

    if (verbose) {
      console.info(`📦 Collection: "${name ?? 'unknown'}" (${tokenCount} tokens)`);
    }

    collections.push({ name, data: collectionData, tokenCount });
  }

  if (collections.length < 2) {
    return {
      success: false,
      collectionsCount: collections.length,
      tokensCount: 0,
      outputFile,
      errors: errors.length > 0 ? errors : ['Not enough valid collections to merge'],
    };
  }

  // Determine unified collection name
  const collectionNames = collections.map((c) => c.name).filter((n): n is string => n !== null);
  const defaultName = collectionNames[0] ?? 'Tokens';
  const unifiedName = collectionNames.includes('Colors')
    ? 'Colors'
    : collectionNames.reduce((a, b) => (a.length <= b.length ? a : b), defaultName);

  if (verbose) {
    console.info(`\n🎯 Unified collection name: "${unifiedName}"`);
    console.info('\n🔀 Merging structures...');
  }

  // Merge collections based on strategy
  const firstCollection = collections[0];
  if (!firstCollection) {
    return {
      success: false,
      collectionsCount: 0,
      tokensCount: 0,
      outputFile,
      errors: ['No collections to merge'],
    };
  }

  let merged: TokenObject = firstCollection.data;
  for (let i = 1; i < collections.length; i++) {
    const source = collections[i];
    if (!source) {
      continue;
    }
    if (strategy === 'first') {
      // First wins - merge source into target but target takes precedence
      merged = deepMerge(source.data, merged, verbose);
    } else {
      // Last wins (default) - source overwrites target
      merged = deepMerge(merged, source.data, verbose);
    }
  }

  // Remove duplicate sections
  if (verbose) {
    console.info('🗑️  Checking for duplicate sections...');
  }
  const modes = merged['modes'] as TokenObject | undefined;
  if (modes) {
    for (const modeName of Object.keys(modes)) {
      const mode = modes[modeName] as TokenObject | undefined;
      const colors = mode?.['colors'] as TokenObject | undefined;

      if (colors) {
        for (const sectionName of Object.keys(colors)) {
          if (isDuplicateSection(colors[sectionName])) {
            if (verbose) {
              console.info(`  ⚠️  Removing duplicate section: ${sectionName}`);
            }
            delete colors[sectionName];
          }
        }
      }
    }
  }

  // Normalize references
  if (verbose) {
    const normalized = unifiedName.toLowerCase().replaceAll(/\s+/g, '');
    console.info(`🔗 Normalizing references to lowercase "{${normalized}." format...`);
  }
  for (const coll of collections) {
    if (coll.name) {
      updateReferences(merged, coll.name, unifiedName, unifiedName);
    }
  }

  // Sort properties
  if (verbose) {
    console.info('📋 Sorting properties alphabetically...');
  }
  const sorted = sortProperties(merged) as TokenObject;

  // Count final tokens
  const tokensCount = countTokens(sorted);

  if (verbose) {
    console.info(`✨ Merged collection: ${tokensCount} tokens\n`);
  }

  // Create output structure
  const output = [{ [unifiedName]: sorted }];

  // Save if not dry run
  if (!dryRun) {
    if (!saveJSON(outputFile, output, verbose)) {
      errors.push(`Failed to write output file: ${outputFile}`);
      return {
        success: false,
        collectionsCount: collections.length,
        tokensCount,
        outputFile,
        errors,
        conflicts: conflicts.length > 0 ? conflicts : undefined,
      };
    }
  }

  if (verbose) {
    console.info('\n✅ Merge complete!');
    console.info('📊 Summary:');
    for (const coll of collections) {
      console.info(`   Source: ${coll.tokenCount} tokens`);
    }
    console.info(`   Merged:   ${tokensCount} tokens`);
  }

  return {
    success: true,
    collectionsCount: collections.length,
    tokensCount,
    outputFile,
    conflicts: conflicts.length > 0 ? conflicts : undefined,
    errors: errors.length > 0 ? errors : undefined,
  };
}

/**
 * CLI entry point for merging collections
 */
export function mergeCollectionsCLI(source1: string, source2: string, output: string): boolean {
  const result = mergeCollections({
    sourceFiles: [source1, source2],
    outputFile: output,
    verbose: true,
  });

  if (result.errors) {
    for (const error of result.errors) {
      console.error(`❌ ${error}`);
    }
  }

  return result.success;
}
