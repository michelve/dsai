/**
 * Temporary directory utilities for tests
 */

import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';

/**
 * Create a temporary directory for testing
 *
 * @param prefix - Prefix for the temp directory name
 * @returns Absolute path to the created directory
 */
export function createTempDir(prefix = 'dsai-tools-test-'): string {
  return mkdtempSync(join(tmpdir(), prefix));
}

/**
 * Remove a directory and all its contents
 *
 * @param dir - Directory path to remove
 */
export function removeTempDir(dir: string): void {
  try {
    rmSync(dir, { recursive: true, force: true });
  } catch {
    // Ignore errors during cleanup
  }
}

/**
 * Execute a function with a temporary directory that is automatically cleaned up
 *
 * @param fn - Function to execute with the temp directory path
 * @returns Result of the function
 */
export async function withTempDir<T>(fn: (dir: string) => Promise<T> | T): Promise<T> {
  const dir = createTempDir();
  try {
    return await fn(dir);
  } finally {
    removeTempDir(dir);
  }
}

/**
 * Create a mock project structure with files
 *
 * @param baseDir - Base directory for the project
 * @param files - Object mapping relative file paths to content
 */
export function createMockProject(baseDir: string, files: Record<string, string>): void {
  for (const [relativePath, content] of Object.entries(files)) {
    const fullPath = join(baseDir, relativePath);
    const dir = dirname(fullPath);

    // Create parent directories
    mkdirSync(dir, { recursive: true });

    // Write the file
    writeFileSync(fullPath, content, 'utf-8');
  }
}

/**
 * Create a minimal token project structure
 *
 * @param dir - Base directory
 * @param tokens - Token JSON object
 */
export function createTokenProject(dir: string, tokens: Record<string, unknown> = {}): void {
  const defaultTokens = {
    color: {
      primary: { $value: '#3b82f6', $type: 'color' },
      secondary: { $value: '#6b7280', $type: 'color' },
    },
  };

  createMockProject(dir, {
    'collections/tokens.json': JSON.stringify(tokens ?? defaultTokens, null, 2),
  });
}
