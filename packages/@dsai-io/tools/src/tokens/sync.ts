/**
 * @file Token Sync Module
 * @description Synchronizes generated tokens from Style Dictionary output to TypeScript source
 *
 * This module handles syncing the generated tokens from dist/js/tokens.js
 * to src/tokens-flat.ts so that tsup can bundle them correctly.
 *
 * This ensures that when font families or other tokens change in Figma,
 * the changes automatically propagate to the TypeScript source.
 *
 * @module @dsai-io/tools/tokens/sync
 */

/* eslint-disable no-console */
/* eslint-disable security/detect-non-literal-fs-filename */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

import type { SyncOptions, SyncResult } from './types';

// ============================================================================
// Constants
// ============================================================================

/** Default source file relative path from tokens package */
const DEFAULT_SOURCE_RELATIVE = 'dist/js/tokens.js';

/** Default target file relative path from tokens package */
const DEFAULT_TARGET_RELATIVE = 'src/tokens-flat.ts';

/** TypeScript header template for generated file */
const TS_HEADER = `/**
 * Do not edit directly, this file was auto-generated.
 * Generated from Style Dictionary output (dist/js/tokens.js)
 *
 * To update: run \`pnpm tokens:build\` which will:
 * 1. Transform Figma tokens
 * 2. Build with Style Dictionary
 * 3. Sync this file automatically
 */

`;

/** Font families to verify in output */
const EXPECTED_FONTS = ['Inter', 'Roboto Mono'] as const;

// ============================================================================
// Helpers
// ============================================================================

/**
 * Verify that expected font families are present in the content
 */
function verifyFontFamilies(content: string): { found: string[]; missing: string[] } {
  const found: string[] = [];
  const missing: string[] = [];

  for (const font of EXPECTED_FONTS) {
    // Check for font in various formats: "'Inter," or "Inter,"
    const pattern = `'${font},`;
    if (content.includes(pattern) || content.includes(`"${font},`)) {
      found.push(font);
    } else {
      missing.push(font);
    }
  }

  return { found, missing };
}

/**
 * Count token exports in content
 */
function countTokenExports(content: string): number {
  // Count export const declarations
  const exportPattern = /export\s+const\s+\w+/g;
  const matches = content.match(exportPattern);
  return matches ? matches.length : 0;
}

/**
 * Compute default file paths from tokens directory
 */
export function getDefaultSyncPaths(tokensDir: string): { sourceFile: string; targetFile: string } {
  return {
    sourceFile: join(tokensDir, DEFAULT_SOURCE_RELATIVE),
    targetFile: join(tokensDir, DEFAULT_TARGET_RELATIVE),
  };
}

// ============================================================================
// Sync Helpers
// ============================================================================

function logSyncStart(sourceFile: string, targetFile: string, dryRun: boolean): void {
  console.info('🔄 Syncing tokens from Style Dictionary output...');
  console.info(`   Source: ${sourceFile}`);
  console.info(`   Target: ${targetFile}`);
  if (dryRun) {
    console.info('   DRY RUN - no files will be written');
  }
}

function failResult(error: string, tokensCount = 0): SyncResult {
  return { success: false, tokensCount, changed: false, errors: [error] };
}

function readSource(sourceFile: string): string | SyncResult {
  if (!existsSync(sourceFile)) {
    return failResult(`Source file not found: ${sourceFile}`);
  }

  try {
    return readFileSync(sourceFile, 'utf-8');
  } catch (err) {
    return failResult(
      `Failed to read source file: ${err instanceof Error ? err.message : 'Unknown error'}`
    );
  }
}

function hasTargetChanged(targetFile: string, tsContent: string): boolean {
  if (!existsSync(targetFile)) {
    return true;
  }

  try {
    return readFileSync(targetFile, 'utf-8') !== tsContent;
  } catch {
    return true;
  }
}

function writeTarget(targetFile: string, tsContent: string): string | null {
  try {
    const targetDir = dirname(targetFile);
    if (!existsSync(targetDir)) {
      mkdirSync(targetDir, { recursive: true });
    }
    writeFileSync(targetFile, tsContent, 'utf-8');
    return null;
  } catch (err) {
    return `Failed to write target file: ${err instanceof Error ? err.message : 'Unknown error'}`;
  }
}

function logSyncSummary(
  changed: boolean,
  tokensCount: number,
  fontFamilies: { found: string[]; missing: string[] }
): void {
  if (changed) {
    console.info('✅ Successfully synced tokens');
  }
  console.info(`   Tokens exported: ${tokensCount}`);
  if (fontFamilies.found.length > 0) {
    console.info(`   Font families found: ${fontFamilies.found.join(', ')}`);
  }
  if (fontFamilies.missing.length > 0) {
    console.warn(`   ⚠️  Missing fonts: ${fontFamilies.missing.join(', ')}`);
  }
}

function collectFontErrors(fontFamilies: { missing: string[] }): string[] {
  return fontFamilies.missing.map((font) => `Font family may be missing: ${font}`);
}

function areAllErrorsFontWarnings(errors: string[]): boolean {
  if (errors.length === 0) {
    return true;
  }
  return errors.every((e) => e.includes('Font family'));
}

// ============================================================================
// Main Functions
// ============================================================================

/**
 * Sync tokens from Style Dictionary output to TypeScript source
 *
 * @example
 * ```typescript
 * // Sync with explicit paths
 * const result = syncTokens({
 *   sourceFile: './packages/@dsai-io/tokens/dist/js/tokens.js',
 *   targetFile: './packages/@dsai-io/tokens/src/tokens-flat.ts',
 * });
 *
 * // Sync with paths computed from tokens directory
 * const paths = getDefaultSyncPaths('./packages/@dsai-io/tokens');
 * const result = syncTokens(paths);
 * ```
 */
export function syncTokens(options: SyncOptions): SyncResult {
  const { sourceFile, targetFile, dryRun = false, verbose = false } = options;

  if (verbose) {
    logSyncStart(sourceFile, targetFile, dryRun);
  }

  const sourceResult = readSource(sourceFile);
  if (typeof sourceResult !== 'string') {
    if (verbose) {
      console.error(`❌ ${sourceResult.errors?.[0]}`);
    }
    return sourceResult;
  }

  const sourceContent = sourceResult;
  const tsContent = `${TS_HEADER}${sourceContent}`;
  const fontFamilies = verifyFontFamilies(sourceContent);
  const errors = collectFontErrors(fontFamilies);
  const tokensCount = countTokenExports(sourceContent);
  const changed = hasTargetChanged(targetFile, tsContent);

  if (!changed && verbose) {
    console.info('✅ Target file is already up to date');
  }

  if (changed && !dryRun) {
    const writeError = writeTarget(targetFile, tsContent);
    if (writeError) {
      if (verbose) {
        console.error(`❌ ${writeError}`);
      }
      return failResult(writeError, tokensCount);
    }
  }

  if (verbose) {
    logSyncSummary(changed, tokensCount, fontFamilies);
  }

  return {
    success: areAllErrorsFontWarnings(errors),
    tokensCount,
    changed,
    errors: errors.length > 0 ? errors : undefined,
  };
}

/**
 * CLI entry point for token sync
 * @param tokensDir - The tokens package directory
 * @param customPaths - Optional custom paths for source and target files
 */
export function syncTokensCLI(
  tokensDir: string,
  customPaths?: { syncSource?: string; syncTarget?: string }
): boolean {
  // Use custom paths if provided, otherwise use defaults
  const sourceFile = customPaths?.syncSource
    ? join(tokensDir, customPaths.syncSource)
    : join(tokensDir, DEFAULT_SOURCE_RELATIVE);
  const targetFile = customPaths?.syncTarget
    ? join(tokensDir, customPaths.syncTarget)
    : join(tokensDir, DEFAULT_TARGET_RELATIVE);

  const result = syncTokens({
    sourceFile,
    targetFile,
    verbose: true,
  });

  // Report errors (non-critical ones like missing fonts)
  if (result.errors) {
    for (const error of result.errors) {
      if (error.includes('Font family')) {
        console.warn(`⚠️  ${error}`);
      } else {
        console.error(`❌ ${error}`);
      }
    }
  }

  return result.success;
}
