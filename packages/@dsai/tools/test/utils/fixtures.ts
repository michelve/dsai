/**
 * Fixture utilities for loading test data
 *
 * These utilities provide type-safe access to test fixtures.
 * The fs operations use validated paths that are joined from a known base directory.
 */

import * as fs from 'node:fs';
import { dirname, normalize, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const currentDir = dirname(fileURLToPath(import.meta.url));
const fixturesDir = resolve(currentDir, '../fixtures');

/**
 * Validates that a path is within the fixtures directory to prevent path traversal.
 * This is a security measure to ensure we only operate on known safe paths.
 *
 * @param targetPath - Path to validate
 * @returns True if path is within fixtures directory
 */
function isWithinFixturesDir(targetPath: string): boolean {
  const normalizedTarget = normalize(targetPath);
  const relativePath = relative(fixturesDir, normalizedTarget);
  return !relativePath.startsWith('..') && !relativePath.startsWith('/');
}

/**
 * Get the absolute path to a fixture file with path traversal protection
 *
 * @param paths - Path segments relative to fixtures directory
 * @returns Absolute path to the fixture
 * @throws Error if path would escape fixtures directory
 */
export function getFixturePath(...paths: string[]): string {
  const targetPath = resolve(fixturesDir, ...paths);

  if (!isWithinFixturesDir(targetPath)) {
    throw new Error(`Path traversal detected: ${paths.join('/')}`);
  }

  return targetPath;
}

/**
 * Safe file read wrapper that validates path before reading.
 * Creates a read operation within the fixtures sandbox.
 *
 * @param absolutePath - Validated absolute path to read
 * @returns File contents as string
 */
function safeReadFile(absolutePath: string): string {
  // Use fs.readFileSync with a resolved path
  // Path has already been validated by getFixturePath
  return fs.readFileSync(absolutePath, 'utf-8');
}

/**
 * Read a fixture file as a string
 *
 * @param paths - Path segments relative to fixtures directory
 * @returns File contents as string
 */
export function readFixture(...paths: string[]): string {
  const filePath = getFixturePath(...paths);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Fixture not found: ${filePath}`);
  }

  return safeReadFile(filePath);
}

/**
 * Read and parse a JSON fixture file
 *
 * @param paths - Path segments relative to fixtures directory
 * @returns Parsed JSON content
 */
export function readJSONFixture<T = unknown>(...paths: string[]): T {
  const content = readFixture(...paths);
  return JSON.parse(content) as T;
}

/**
 * List all files in a fixture directory
 *
 * @param dir - Directory path relative to fixtures
 * @returns Array of filenames
 */
export function listFixtureFiles(dir: string): string[] {
  const dirPath = getFixturePath(dir);

  if (!fs.existsSync(dirPath)) {
    return [];
  }

  return fs.readdirSync(dirPath);
}

/**
 * Check if a fixture exists
 *
 * @param paths - Path segments relative to fixtures directory
 * @returns True if fixture exists
 */
export function fixtureExists(...paths: string[]): boolean {
  const filePath = getFixturePath(...paths);
  return fs.existsSync(filePath);
}
