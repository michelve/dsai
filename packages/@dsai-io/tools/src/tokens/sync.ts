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
 * @module @dsai/tools/tokens/sync
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
// Main Functions
// ============================================================================

/**
 * Sync tokens from Style Dictionary output to TypeScript source
 *
 * @example
 * ```typescript
 * // Sync with explicit paths
 * const result = syncTokens({
 *   sourceFile: './packages/@dsai/tokens/dist/js/tokens.js',
 *   targetFile: './packages/@dsai/tokens/src/tokens-flat.ts',
 * });
 *
 * // Sync with paths computed from tokens directory
 * const paths = getDefaultSyncPaths('./packages/@dsai/tokens');
 * const result = syncTokens(paths);
 * ```
 */
export function syncTokens(options: SyncOptions): SyncResult {
  const { sourceFile, targetFile, dryRun = false, verbose = false } = options;

  const errors: string[] = [];

  if (verbose) {
    console.info('🔄 Syncing tokens from Style Dictionary output...');
    console.info(`   Source: ${sourceFile}`);
    console.info(`   Target: ${targetFile}`);
    if (dryRun) {
      console.info('   DRY RUN - no files will be written');
    }
  }

  // Check if source file exists
  if (!existsSync(sourceFile)) {
    const error = `Source file not found: ${sourceFile}`;
    if (verbose) {
      console.error(`❌ ${error}`);
    }
    return {
      success: false,
      tokensCount: 0,
      changed: false,
      errors: [error],
    };
  }

  // Read source content
  let sourceContent: string;
  try {
    sourceContent = readFileSync(sourceFile, 'utf-8');
  } catch (err) {
    const error = `Failed to read source file: ${err instanceof Error ? err.message : 'Unknown error'}`;
    if (verbose) {
      console.error(`❌ ${error}`);
    }
    return {
      success: false,
      tokensCount: 0,
      changed: false,
      errors: [error],
    };
  }

  // Generate TypeScript content
  const tsContent = `${TS_HEADER}${sourceContent}`;

  // Verify font families
  const fontFamilies = verifyFontFamilies(sourceContent);
  if (fontFamilies.missing.length > 0) {
    for (const font of fontFamilies.missing) {
      errors.push(`Font family may be missing: ${font}`);
    }
  }

  // Count tokens
  const tokensCount = countTokenExports(sourceContent);

  // Check if target already exists and has same content
  let changed = true;
  if (existsSync(targetFile)) {
    try {
      const existingContent = readFileSync(targetFile, 'utf-8');
      if (existingContent === tsContent) {
        changed = false;
        if (verbose) {
          console.info('✅ Target file is already up to date');
        }
      }
    } catch {
      // Ignore read errors, will overwrite
    }
  }

  // Write target file if changed
  if (changed && !dryRun) {
    try {
      // Ensure target directory exists
      const targetDir = dirname(targetFile);
      if (!existsSync(targetDir)) {
        mkdirSync(targetDir, { recursive: true });
      }

      writeFileSync(targetFile, tsContent, 'utf-8');
    } catch (err) {
      const error = `Failed to write target file: ${err instanceof Error ? err.message : 'Unknown error'}`;
      if (verbose) {
        console.error(`❌ ${error}`);
      }
      return {
        success: false,
        tokensCount,
        changed: false,
        errors: [error],
      };
    }
  }

  if (verbose) {
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

  return {
    success: errors.length === 0 || errors.every((e) => e.includes('Font family')),
    tokensCount,
    changed,
    errors: errors.length > 0 ? errors : undefined,
  };
}

/**
 * CLI entry point for token sync
 */
export function syncTokensCLI(tokensDir: string): boolean {
  const paths = getDefaultSyncPaths(tokensDir);
  const result = syncTokens({
    ...paths,
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
