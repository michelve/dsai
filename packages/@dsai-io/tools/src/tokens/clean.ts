/**
 * @file Token Clean Module
 * @description Provides functionality to clean token output directories before builds.
 *
 * This module supports:
 * - Cleaning individual output directories (dist/css, dist/js, etc.)
 * - Cleaning all build outputs
 * - Dry-run mode to preview what would be deleted
 * - Safe deletion with directory validation
 *
 * @module @dsai-io/tools/tokens/clean
 */

/* eslint-disable no-console */
/* eslint-disable security/detect-non-literal-fs-filename */

import { existsSync, readdirSync, rmSync } from 'node:fs';
import { basename, join, resolve } from 'node:path';

// ============================================================================
// Types
// ============================================================================

/**
 * Clean operation options
 */
export interface CleanOptions {
  /**
   * Base directory for cleaning (typically the package root)
   * @default process.cwd()
   */
  baseDir?: string;

  /**
   * Directories to clean relative to baseDir
   * @default ['dist']
   */
  directories?: string[];

  /**
   * Show what would be deleted without actually deleting
   * @default false
   */
  dryRun?: boolean;

  /**
   * Enable verbose logging
   * @default false
   */
  verbose?: boolean;

  /**
   * File patterns to preserve (glob patterns)
   * Files matching these patterns will not be deleted
   * @example ['.gitkeep', 'README.md']
   */
  preserve?: string[];
}

/**
 * Information about a cleaned directory
 */
export interface CleanedDirectory {
  /** Path to the cleaned directory */
  path: string;

  /** Number of files removed */
  filesRemoved: number;

  /** Number of directories removed */
  directoriesRemoved: number;

  /** Whether the directory existed before cleaning */
  existed: boolean;
}

/**
 * Result of a clean operation
 */
export interface CleanResult {
  /** Whether the clean operation completed successfully */
  success: boolean;

  /** List of cleaned directories with details */
  cleaned: CleanedDirectory[];

  /** Total number of files removed */
  totalFilesRemoved: number;

  /** Total number of directories removed */
  totalDirectoriesRemoved: number;

  /** Any errors encountered */
  errors: string[];

  /** Any warnings (non-blocking issues) */
  warnings: string[];

  /** Whether this was a dry run */
  dryRun: boolean;

  /** Duration of the operation in milliseconds */
  duration: number;
}

// ============================================================================
// Constants
// ============================================================================

/**
 * Default directories to clean for token builds
 */
export const DEFAULT_CLEAN_DIRECTORIES = ['dist'] as const;

/**
 * Files to always preserve
 */
const ALWAYS_PRESERVE = ['.gitkeep', '.gitignore'] as const;

/**
 * Directories that should never be cleaned (safety check)
 */
const PROTECTED_DIRECTORIES = [
  'src',
  'node_modules',
  '.git',
  '.github',
  'test',
  'tests',
  '__tests__',
  'docs',
  'config',
] as const;

// ============================================================================
// Validation
// ============================================================================

/**
 * Validate that a directory is safe to clean
 *
 * @param dirPath - Absolute path to the directory
 * @param baseDir - Base directory for relative validation
 * @returns Validation result with error message if invalid
 */
function validateCleanTarget(dirPath: string, baseDir: string): { valid: boolean; error?: string } {
  // Ensure path is within baseDir (prevent directory traversal)
  const resolvedDir = resolve(dirPath);
  const resolvedBase = resolve(baseDir);

  if (!resolvedDir.startsWith(resolvedBase)) {
    return {
      valid: false,
      error: `Directory "${dirPath}" is outside base directory "${baseDir}"`,
    };
  }

  // Check for protected directories
  const dirName = basename(resolvedDir);
  if (PROTECTED_DIRECTORIES.includes(dirName as (typeof PROTECTED_DIRECTORIES)[number])) {
    return {
      valid: false,
      error: `Directory "${dirName}" is protected and cannot be cleaned`,
    };
  }

  // Don't allow cleaning the base directory itself
  if (resolvedDir === resolvedBase) {
    return {
      valid: false,
      error: 'Cannot clean the base directory itself',
    };
  }

  return { valid: true };
}

/**
 * Match a string against a glob pattern using dynamic programming
 * Safely handles * (any chars) and ? (single char) without regex
 *
 * @param str - String to match
 * @param pattern - Glob pattern
 * @returns Whether the string matches the pattern
 */
function matchGlobDP(str: string, pattern: string): boolean {
  const m = str.length;
  const n = pattern.length;

  // Use a Map for type-safe access instead of 2D array
  const dp = new Map<string, boolean>();
  const key = (i: number, j: number): string => `${i},${j}`;
  const get = (i: number, j: number): boolean => dp.get(key(i, j)) ?? false;
  const set = (i: number, j: number, val: boolean): void => {
    dp.set(key(i, j), val);
  };

  // Initialize all to false (Map returns undefined -> false via get helper)
  // Empty pattern matches empty string
  set(0, 0, true);

  // Handle patterns starting with *
  for (let j = 1; j <= n; j++) {
    if (pattern[j - 1] === '*') {
      set(0, j, get(0, j - 1));
    }
  }

  // Fill the DP table
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const pChar = pattern[j - 1];

      if (pChar === '*') {
        // * can match zero chars (dp[i][j-1]) or one+ chars (dp[i-1][j])
        set(i, j, get(i, j - 1) || get(i - 1, j));
      } else if (pChar === '?' || pChar === str[i - 1]) {
        // ? matches any single char, or exact character match
        set(i, j, get(i - 1, j - 1));
      }
      // else remains false (not set in Map)
    }
  }

  return get(m, n);
}

/**
 * Match a filename against a glob pattern safely
 * Uses optimized string methods for simple patterns, DP algorithm for complex ones
 *
 * @param fileName - Name of the file to match
 * @param pattern - Glob pattern (supports * and ? wildcards)
 * @returns Whether the filename matches the pattern
 */
function matchGlobPattern(fileName: string, pattern: string): boolean {
  // For patterns without wildcards, use exact match
  if (!pattern.includes('*') && !pattern.includes('?')) {
    return fileName === pattern;
  }

  // For simple extension patterns like "*.json", use endsWith for safety
  if (pattern.startsWith('*.') && !pattern.slice(2).includes('*') && !pattern.includes('?')) {
    const extension = pattern.slice(1); // ".json"
    return fileName.endsWith(extension);
  }

  // For simple prefix patterns like "file*", use startsWith for safety
  if (pattern.endsWith('*') && !pattern.slice(0, -1).includes('*') && !pattern.includes('?')) {
    const prefix = pattern.slice(0, -1);
    return fileName.startsWith(prefix);
  }

  // For complex patterns, use safe DP-based glob matching (no regex)
  return matchGlobDP(fileName, pattern);
}

/**
 * Check if a file should be preserved
 *
 * @param fileName - Name of the file
 * @param preservePatterns - Additional patterns to preserve
 * @returns Whether the file should be preserved
 */
function shouldPreserve(fileName: string, preservePatterns: string[]): boolean {
  const allPatterns = [...ALWAYS_PRESERVE, ...preservePatterns];
  return allPatterns.some((pattern) => matchGlobPattern(fileName, pattern));
}

// ============================================================================
// Directory Cleaning
// ============================================================================

/**
 * Count files and directories in a path recursively
 *
 * @param dirPath - Path to count
 * @returns Object with file and directory counts
 */
function countContents(dirPath: string): { files: number; dirs: number } {
  if (!existsSync(dirPath)) {
    return { files: 0, dirs: 0 };
  }

  let files = 0;
  let dirs = 0;

  const entries = readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      dirs++;
      const subCounts = countContents(join(dirPath, entry.name));
      files += subCounts.files;
      dirs += subCounts.dirs;
    } else {
      files++;
    }
  }

  return { files, dirs };
}

/**
 * Clean a single directory
 *
 * @param dirPath - Absolute path to the directory to clean
 * @param options - Clean options
 * @returns Cleaned directory info
 */
/**
 * Remove directory contents while preserving specified files
 */
function removeWithPreservation(
  dirPath: string,
  preservePatterns: string[],
  verbose: boolean
): void {
  const entries = readdirSync(dirPath, { withFileTypes: true });
  const hasPreserved = entries.some((e) => shouldPreserve(e.name, preservePatterns));

  if (!hasPreserved) {
    rmSync(dirPath, { recursive: true, force: true });
    return;
  }

  for (const entry of entries) {
    if (shouldPreserve(entry.name, preservePatterns)) {
      if (verbose) {
        console.info(`  📌 Preserving: ${entry.name}`);
      }
      continue;
    }

    const entryPath = join(dirPath, entry.name);
    rmSync(entryPath, { recursive: true, force: true });
  }
}

/**
 * Clean a single directory
 */
function cleanDirectory(
  dirPath: string,
  options: Required<Pick<CleanOptions, 'dryRun' | 'verbose' | 'preserve'>>
): CleanedDirectory {
  const existed = existsSync(dirPath);

  if (!existed) {
    if (options.verbose) {
      console.info(`  ℹ️  Directory does not exist: ${dirPath}`);
    }
    return { path: dirPath, filesRemoved: 0, directoriesRemoved: 0, existed: false };
  }

  const counts = countContents(dirPath);

  if (options.dryRun) {
    if (options.verbose) {
      console.info(
        `  🔍 Would remove: ${dirPath} (${counts.files} files, ${counts.dirs} directories)`
      );
    }
    return { path: dirPath, filesRemoved: counts.files, directoriesRemoved: counts.dirs, existed: true };
  }

  removeWithPreservation(dirPath, options.preserve, options.verbose);

  if (options.verbose) {
    console.info(`  ✅ Cleaned: ${dirPath} (${counts.files} files, ${counts.dirs} directories)`);
  }

  return { path: dirPath, filesRemoved: counts.files, directoriesRemoved: counts.dirs, existed: true };
}

// ============================================================================
// Public API
// ============================================================================

/**
 * Clean token output directories
 *
 * Removes build artifacts from output directories to ensure a fresh build.
 * Supports dry-run mode, preserve patterns, and safety validation.
 *
 * @param options - Clean operation options
 * @returns Clean operation result
 *
 * @example
 * // Clean default dist directory
 * const result = cleanTokenOutputs();
 *
 * @example
 * // Clean specific directories with dry-run
 * const result = cleanTokenOutputs({
 *   directories: ['dist/css', 'dist/js'],
 *   dryRun: true,
 *   verbose: true,
 * });
 *
 * @example
 * // Clean with preserved files
 * const result = cleanTokenOutputs({
 *   preserve: ['README.md', '*.d.ts'],
 * });
 */
/**
 * Validate and clean a single directory, updating the result
 */
function validateAndCleanDirectory(
  dir: string,
  baseDir: string,
  cleanOpts: Required<Pick<CleanOptions, 'dryRun' | 'verbose' | 'preserve'>>,
  result: CleanResult
): void {
  const absolutePath = resolve(baseDir, dir);

  const validation = validateCleanTarget(absolutePath, baseDir);
  if (!validation.valid && validation.error) {
    result.errors.push(validation.error);
    result.success = false;
    return;
  }

  try {
    const cleaned = cleanDirectory(absolutePath, cleanOpts);
    result.cleaned.push(cleaned);
    result.totalFilesRemoved += cleaned.filesRemoved;
    result.totalDirectoriesRemoved += cleaned.directoriesRemoved;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    result.errors.push(`Failed to clean "${dir}": ${errorMessage}`);
    result.success = false;
  }
}

/**
 * Log the clean operation summary
 */
function logCleanSummary(result: CleanResult, dryRun: boolean): void {
  console.info('');
  if (result.success) {
    const actionStr = dryRun ? 'Would remove' : 'Removed';
    console.info(
      `✅ ${actionStr} ${result.totalFilesRemoved} files, ` +
        `${result.totalDirectoriesRemoved} directories in ${result.duration}ms`
    );
  } else {
    console.error('❌ Clean failed with errors:');
    for (const error of result.errors) {
      console.error(`   - ${error}`);
    }
  }
}

export function cleanTokenOutputs(options: CleanOptions = {}): CleanResult {
  const startTime = Date.now();

  const normalizedOptions = {
    baseDir: options.baseDir ?? process.cwd(),
    directories: options.directories ?? [...DEFAULT_CLEAN_DIRECTORIES],
    dryRun: options.dryRun ?? false,
    verbose: options.verbose ?? false,
    preserve: options.preserve ?? [],
  };

  const result: CleanResult = {
    success: true,
    cleaned: [],
    totalFilesRemoved: 0,
    totalDirectoriesRemoved: 0,
    errors: [],
    warnings: [],
    dryRun: normalizedOptions.dryRun,
    duration: 0,
  };

  if (normalizedOptions.verbose) {
    const modeStr = normalizedOptions.dryRun ? '(dry-run)' : '';
    console.info(`\n🧹 Cleaning token outputs ${modeStr}`);
    console.info(`   Base: ${normalizedOptions.baseDir}`);
  }

  const cleanOpts = {
    dryRun: normalizedOptions.dryRun,
    verbose: normalizedOptions.verbose,
    preserve: normalizedOptions.preserve,
  };

  for (const dir of normalizedOptions.directories) {
    validateAndCleanDirectory(dir, normalizedOptions.baseDir, cleanOpts, result);
  }

  result.duration = Date.now() - startTime;

  if (normalizedOptions.verbose) {
    logCleanSummary(result, normalizedOptions.dryRun);
  }

  return result;
}

/**
 * CLI wrapper for cleanTokenOutputs
 *
 * Provides formatted output suitable for CLI usage.
 *
 * @param baseDir - Base directory for the clean operation
 * @param options - Clean options
 * @returns Whether the clean was successful
 */
export function cleanTokensCLI(
  baseDir: string,
  options: Omit<CleanOptions, 'baseDir'> = {}
): boolean {
  const result = cleanTokenOutputs({
    ...options,
    baseDir,
    verbose: options.verbose ?? true,
  });

  return result.success;
}
