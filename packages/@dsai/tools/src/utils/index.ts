/**
 * Utility functions for @dsai/tools
 *
 * Common utilities used across the tools package.
 */

import { existsSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import pc from 'picocolors';

/**
 * Get the root directory of the @dsai/tools package
 *
 * @returns Absolute path to package root
 */
export function getPackageRoot(): string {
  const currentFile = fileURLToPath(import.meta.url);
  return resolve(dirname(currentFile), '..');
}

/**
 * Resolve a path relative to the current working directory
 *
 * @param segments - Path segments to join
 * @returns Absolute path
 */
export function resolvePath(...segments: string[]): string {
  return resolve(process.cwd(), ...segments);
}

/**
 * Check if a file or directory exists
 *
 * @param path - Path to check
 * @returns True if the path exists
 */
export function fileExists(targetPath: string): boolean {
  try {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    return existsSync(targetPath);
  } catch {
    return false;
  }
}

/**
 * Check if a path is a directory
 *
 * @param path - Path to check
 * @returns True if the path is a directory
 */
export function isDirectory(targetPath: string): boolean {
  try {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    if (!existsSync(targetPath)) {
      return false;
    }
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    return statSync(targetPath).isDirectory();
  } catch {
    return false;
  }
}

/**
 * Check if a path is a file
 *
 * @param path - Path to check
 * @returns True if the path is a file
 */
export function isFile(targetPath: string): boolean {
  try {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    if (!existsSync(targetPath)) {
      return false;
    }
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    return statSync(targetPath).isFile();
  } catch {
    return false;
  }
}

/**
 * Find package.json by traversing up from a starting directory
 *
 * @param startFrom - Directory to start searching from
 * @returns Path to package.json or null if not found
 */
export function findPackageJson(startFrom: string = process.cwd()): string | null {
  let current = resolve(startFrom);
  const root = dirname(current);

  while (current !== root) {
    const packagePath = join(current, 'package.json');
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    if (existsSync(packagePath)) {
      return packagePath;
    }
    current = dirname(current);
  }

  return null;
}

/**
 * Logger utility with colored output
 */
export const logger = {
  /**
   * Log an info message
   */
  info(message: string): void {
    // eslint-disable-next-line no-console
    console.info(pc.blue('ℹ'), message);
  },

  /**
   * Log a success message
   */
  success(message: string): void {
    // eslint-disable-next-line no-console
    console.info(pc.green('✔'), message);
  },

  /**
   * Log a warning message
   */
  warn(message: string): void {
    console.warn(pc.yellow('⚠'), message);
  },

  /**
   * Log an error message
   */
  error(message: string): void {
    console.error(pc.red('✖'), message);
  },

  /**
   * Log a debug message (only in verbose mode)
   */
  debug(message: string, verbose = false): void {
    if (verbose) {
      // eslint-disable-next-line no-console
      console.debug(pc.gray('⋯'), message);
    }
  },
};

/**
 * Format milliseconds to human-readable duration
 *
 * @param ms - Duration in milliseconds
 * @returns Formatted duration string
 */
export function formatDuration(ms: number): string {
  if (ms < 1000) {
    return `${ms}ms`;
  }
  if (ms < 60000) {
    return `${(ms / 1000).toFixed(2)}s`;
  }
  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(0);
  return `${minutes}m ${seconds}s`;
}

/**
 * Deep merge two objects
 *
 * @param target - Target object
 * @param source - Source object to merge
 * @returns Merged object
 */
export function deepMerge<T extends Record<string, unknown>>(target: T, source: Partial<T>): T {
  const output = { ...target };
  const keys = Object.keys(source) as Array<keyof T>;

  for (const key of keys) {
    // eslint-disable-next-line security/detect-object-injection -- Safe: iterating over Object.keys
    const sourceValue = source[key];
    // eslint-disable-next-line security/detect-object-injection -- Safe: iterating over Object.keys
    const targetValue = target[key];

    if (
      sourceValue &&
      typeof sourceValue === 'object' &&
      !Array.isArray(sourceValue) &&
      targetValue &&
      typeof targetValue === 'object' &&
      !Array.isArray(targetValue)
    ) {
      // eslint-disable-next-line security/detect-object-injection -- Safe: key from Object.keys
      output[key] = deepMerge(
        targetValue as Record<string, unknown>,
        sourceValue as Record<string, unknown>
      ) as T[keyof T];
    } else if (sourceValue !== undefined) {
      // eslint-disable-next-line security/detect-object-injection -- Safe: key from Object.keys
      output[key] = sourceValue as T[keyof T];
    }
  }

  return output;
}
