/**
 * @file CSS Post-processing Module
 * @description Post-processes CSS files after SASS compilation
 *
 * This module applies DSAi-specific transformations to compiled CSS:
 * - Replaces `data-bs-theme` with `data-dsai-theme` for custom theme attribute
 * - Applies configurable text replacements
 *
 * @module @dsai/tools/tokens/postprocess
 */

/* eslint-disable no-console */
/* eslint-disable security/detect-non-literal-fs-filename */

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import type { PostprocessOptions, PostprocessResult, ReplacementRule } from './types';

// ============================================================================
// Constants
// ============================================================================

/** Default CSS distribution directory relative to tokens package */
const DEFAULT_CSS_DIR = 'dist/css';

/** Default files to process */
const DEFAULT_FILES = ['dsai-theme-bs.css', 'dsai-theme-bs.min.css'];

/** Default transformations to apply */
const DEFAULT_TRANSFORMATIONS: ReplacementRule[] = [
  {
    description: 'Theme attribute',
    from: /data-bs-theme/g,
    to: 'data-dsai-theme',
  },
];

// ============================================================================
// Core Functions
// ============================================================================

/**
 * Apply all replacements to content
 */
function applyReplacements(
  content: string,
  replacements: ReplacementRule[],
  verbose: boolean
): { result: string; count: number } {
  let result = content;
  let totalCount = 0;

  for (const rule of replacements) {
    // Count matches first
    let matchCount = 0;

    if (typeof rule.from === 'string') {
      // For string patterns, count occurrences manually
      let pos = 0;
      const searchStr = rule.from;
      while (pos < result.length) {
        const idx = result.indexOf(searchStr, pos);
        if (idx === -1) {
          break;
        }
        matchCount++;
        pos = idx + 1;
      }
      // Replace all occurrences using split/join (safe, no regex)
      if (matchCount > 0) {
        result = result.split(rule.from).join(rule.to);
      }
    } else {
      // For regex patterns, use as-is
      const matches = result.match(rule.from);
      matchCount = matches ? matches.length : 0;
      if (matchCount > 0) {
        result = result.replace(rule.from, rule.to);
      }
    }

    if (matchCount > 0) {
      totalCount += matchCount;
      if (verbose) {
        const desc =
          rule.description ?? (typeof rule.from === 'string' ? rule.from : String(rule.from));
        console.info(`   ✓ ${desc}: ${matchCount} replacement(s)`);
      }
    }
  }

  return { result, count: totalCount };
}

// ============================================================================
// Main Functions
// ============================================================================

/**
 * Post-process a single CSS file
 *
 * @example
 * ```typescript
 * const result = postprocessCss({
 *   inputFile: './dist/css/theme.css',
 *   replacements: [
 *     { from: /data-bs-theme/g, to: 'data-dsai-theme', description: 'Theme attribute' }
 *   ],
 * });
 * ```
 */
export function postprocessCss(options: PostprocessOptions): PostprocessResult {
  const {
    inputFile,
    outputFile = inputFile,
    replacements = DEFAULT_TRANSFORMATIONS,
    dryRun = false,
    verbose = false,
  } = options;

  // Check if input file exists
  if (!existsSync(inputFile)) {
    return {
      success: false,
      replacementsMade: 0,
      outputFile,
      errors: [`File not found: ${inputFile}`],
    };
  }

  // Read input content
  let content: string;
  try {
    content = readFileSync(inputFile, 'utf-8');
  } catch (err) {
    return {
      success: false,
      replacementsMade: 0,
      outputFile,
      errors: [`Failed to read file: ${err instanceof Error ? err.message : 'Unknown error'}`],
    };
  }

  // Apply replacements
  const { result, count } = applyReplacements(content, replacements, verbose);

  // Write output if changed and not dry run
  if (count > 0 && !dryRun) {
    try {
      writeFileSync(outputFile, result, 'utf-8');
    } catch (err) {
      return {
        success: false,
        replacementsMade: count,
        outputFile,
        errors: [`Failed to write file: ${err instanceof Error ? err.message : 'Unknown error'}`],
      };
    }
  }

  return {
    success: true,
    replacementsMade: count,
    outputFile,
  };
}

/**
 * Post-process multiple CSS files in a directory
 *
 * @example
 * ```typescript
 * const results = postprocessCssFiles({
 *   cssDir: './packages/@dsai/tokens/dist/css',
 *   files: ['dsai-theme-bs.css', 'dsai-theme-bs.min.css'],
 * });
 * ```
 */
export function postprocessCssFiles(options: {
  cssDir: string;
  files?: string[];
  replacements?: ReplacementRule[];
  dryRun?: boolean;
  verbose?: boolean;
}): { success: boolean; filesModified: number; totalReplacements: number; errors: string[] } {
  const {
    cssDir,
    files = DEFAULT_FILES,
    replacements = DEFAULT_TRANSFORMATIONS,
    dryRun = false,
    verbose = false,
  } = options;

  let filesModified = 0;
  let totalReplacements = 0;
  const errors: string[] = [];

  if (verbose) {
    console.info('🔧 Post-processing CSS files...\n');
  }

  for (const fileName of files) {
    const filePath = join(cssDir, fileName);

    if (verbose) {
      console.info(`📄 ${fileName}`);
    }

    const result = postprocessCss({
      inputFile: filePath,
      replacements,
      dryRun,
      verbose,
    });

    if (result.success) {
      if (result.replacementsMade > 0) {
        filesModified++;
        totalReplacements += result.replacementsMade;
      } else if (verbose) {
        console.info('   (no changes needed)');
      }
    } else if (result.errors) {
      errors.push(...result.errors);
      if (verbose) {
        for (const err of result.errors) {
          console.warn(`   ⚠️  ${err}`);
        }
      }
    }
  }

  if (verbose) {
    console.info(`\n✅ Post-processing complete. ${filesModified} file(s) modified.`);
    if (totalReplacements > 0) {
      console.info(`   Total replacements: ${totalReplacements}`);
    }
  }

  return {
    success: errors.length === 0,
    filesModified,
    totalReplacements,
    errors,
  };
}

/**
 * CLI entry point for CSS post-processing
 */
export function postprocessCLI(tokensDir: string): boolean {
  const cssDir = join(tokensDir, DEFAULT_CSS_DIR);

  const result = postprocessCssFiles({
    cssDir,
    verbose: true,
  });

  return result.success;
}

/**
 * Get the default CSS distribution directory path
 */
export function getDefaultCssDir(tokensDir: string): string {
  return join(tokensDir, DEFAULT_CSS_DIR);
}

/**
 * Get the default files to process
 */
export function getDefaultFiles(): string[] {
  return [...DEFAULT_FILES];
}

/**
 * Get the default transformation rules
 */
export function getDefaultTransformations(): ReplacementRule[] {
  return [...DEFAULT_TRANSFORMATIONS];
}
