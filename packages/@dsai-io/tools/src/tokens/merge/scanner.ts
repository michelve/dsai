/**
 * Scanner for finding stylesheet files in directories
 *
 * @packageDocumentation
 */

/* eslint-disable security/detect-non-literal-regexp */
/* eslint-disable security/detect-non-literal-fs-filename */

import * as fs from 'node:fs';
import * as path from 'node:path';

import type { StyleScannerOptions, StyleScannerResult, StyleScannedFile } from './types.js';

// ============================================================================
// Constants
// ============================================================================

/**
 * Default ignore patterns
 */
const DEFAULT_IGNORE_PATTERNS = [
  '**/node_modules/**',
  '**/.git/**',
  '**/_index.scss',
  '**/*.test.scss',
  '**/*.spec.scss',
  '**/test/**',
  '**/tests/**',
];

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Convert a glob pattern to a regular expression
 */
function globToRegex(pattern: string): RegExp {
  const regex = pattern
    .replaceAll(/[.+^${}()|[\]\\]/g, '\\$&') // Escape special regex chars (except * and ?)
    .replaceAll('**', '<<<GLOBSTAR>>>') // Temporarily replace **
    .replaceAll('*', '[^/]*') // * matches anything except /
    .replaceAll('?', '.') // ? matches single char
    .replaceAll('<<<GLOBSTAR>>>', '.*'); // ** matches anything including /
  return new RegExp(`^${regex}$`);
}

/**
 * Check if a path matches any of the ignore patterns
 */
function matchesIgnorePattern(relativePath: string, patterns: string[]): boolean {
  for (const pattern of patterns) {
    const regex = globToRegex(pattern);
    if (regex.test(relativePath)) {
      return true;
    }
    // Also check just the filename
    const fileName = path.basename(relativePath);
    if (regex.test(fileName)) {
      return true;
    }
  }
  return false;
}

/**
 * Recursively scan a directory for files
 */
async function scanDirectory(
  dir: string,
  rootDir: string,
  extension: string,
  ignorePatterns: string[],
  maxDepth: number,
  currentDepth: number,
  followSymlinks: boolean
): Promise<StyleScannedFile[]> {
  const files: StyleScannedFile[] = [];

  if (currentDepth > maxDepth) {
    return files;
  }

  try {
    const entries = await fs.promises.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const entryPath = path.join(dir, entry.name);
      const relativePath = path.relative(rootDir, entryPath);

      // Check ignore patterns
      if (matchesIgnorePattern(relativePath, ignorePatterns)) {
        continue;
      }

      if (entry.isDirectory() || (followSymlinks && entry.isSymbolicLink())) {
        // Recurse into directory
        const subFiles = await scanDirectory(
          entryPath,
          rootDir,
          extension,
          ignorePatterns,
          maxDepth,
          currentDepth + 1,
          followSymlinks
        );
        files.push(...subFiles);
      } else if (entry.isFile() && entry.name.endsWith(`.${extension}`)) {
        // Add file
        const stat = await fs.promises.stat(entryPath);
        files.push({
          absolutePath: entryPath,
          relativePath,
          name: path.basename(entry.name, `.${extension}`),
          extension: extension as 'scss' | 'css',
          size: stat.size,
          mtime: stat.mtime,
          depth: currentDepth,
        });
      }
    }
  } catch (error) {
    // Directory read error - skip silently
    console.warn(`Warning: Could not read directory ${dir}: ${(error as Error).message}`);
  }

  return files;
}

// ============================================================================
// Main Functions
// ============================================================================

/**
 * Scan directories for stylesheet files
 *
 * @param options Scanner options
 * @returns Scanner result with found files
 *
 * @example
 * ```typescript
 * const result = await scanDirectories({
 *   directories: ['src/styles/overrides', 'src/styles/custom'],
 *   extension: 'scss',
 * });
 *
 * console.log(`Found ${result.totalFiles} files`);
 * ```
 */
export async function scanDirectories(options: StyleScannerOptions): Promise<StyleScannerResult> {
  const {
    directories,
    extension,
    ignorePatterns = DEFAULT_IGNORE_PATTERNS,
    followSymlinks = false,
    maxDepth = 10,
  } = options;

  const files: StyleScannedFile[] = [];
  const scannedDirs: string[] = [];
  const missingDirs: string[] = [];

  for (const dir of directories) {
    const absoluteDir = path.resolve(dir);

    // Check if directory exists
    try {
      const stat = await fs.promises.stat(absoluteDir);
      if (!stat.isDirectory()) {
        missingDirs.push(absoluteDir);
        continue;
      }
    } catch {
      missingDirs.push(absoluteDir);
      continue;
    }

    scannedDirs.push(absoluteDir);

    // Scan directory recursively
    const foundFiles = await scanDirectory(
      absoluteDir,
      absoluteDir,
      extension,
      ignorePatterns,
      maxDepth,
      0,
      followSymlinks
    );

    files.push(...foundFiles);
  }

  // Calculate totals
  const totalSize = files.reduce((sum, file) => sum + file.size, 0);

  return {
    files,
    directories: scannedDirs,
    missingDirectories: missingDirs,
    totalFiles: files.length,
    totalSize,
  };
}

/**
 * Sort scanned files according to specified order
 *
 * @param files Files to sort
 * @param order Sort order
 * @returns Sorted files
 */
export function sortFiles(
  files: StyleScannedFile[],
  order: 'alphabetical' | 'directory-first' = 'alphabetical'
): StyleScannedFile[] {
  const sorted = [...files];

  if (order === 'alphabetical') {
    sorted.sort((a, b) => a.name.localeCompare(b.name));
  } else if (order === 'directory-first') {
    sorted.sort((a, b) => {
      // First by directory
      const dirA = path.dirname(a.relativePath);
      const dirB = path.dirname(b.relativePath);
      if (dirA !== dirB) {
        return dirA.localeCompare(dirB);
      }
      // Then by name
      return a.name.localeCompare(b.name);
    });
  }

  return sorted;
}

/**
 * Filter files matching patterns
 *
 * @param files Files to filter
 * @param patterns Glob patterns to match
 * @param include If true, keep matching files; if false, exclude matching
 * @returns Filtered files
 */
export function filterFiles(
  files: StyleScannedFile[],
  patterns: string[],
  include = false
): StyleScannedFile[] {
  return files.filter((file) => {
    const matches = matchesIgnorePattern(file.relativePath, patterns);
    return include ? matches : !matches;
  });
}

/**
 * Get default ignore patterns
 */
export function getDefaultIgnorePatterns(): string[] {
  return [...DEFAULT_IGNORE_PATTERNS];
}
