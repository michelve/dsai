/* eslint-disable security/detect-non-literal-fs-filename */
/**
 * SVG file scanner
 *
 * Scans directories for SVG files and reads their contents.
 *
 * @packageDocumentation
 */

import { readFileSync, statSync } from 'node:fs';
import { basename } from 'node:path';

import type { RawSVGData, ScannerOptions } from '../types.js';

/**
 * Scan directory for SVG files
 *
 * Uses fast-glob to find SVG files matching the specified patterns.
 *
 * @param options - Scanner options
 * @returns Array of raw SVG data
 *
 * @example
 * ```typescript
 * const files = await scanSVGFiles({
 *   sourceDir: './icons',
 *   include: ['**\/*.svg'],
 *   exclude: ['**\/node_modules\/**'],
 * });
 * ```
 */
export async function scanSVGFiles(options: ScannerOptions): Promise<RawSVGData[]> {
  const {
    sourceDir,
    include = ['**/*.svg'],
    exclude = ['**/node_modules/**', '**/dist/**'],
  } = options;

  // Dynamic import of fast-glob (ESM module)
  const { default: fg } = await import('fast-glob');

  // Find all SVG files
  const files = await fg(include, {
    cwd: sourceDir,
    ignore: exclude,
    absolute: true,
    onlyFiles: true,
  });

  // Read each file
  const svgFiles: RawSVGData[] = [];

  for (const filePath of files) {
    try {
      const content = readFileSync(filePath, 'utf-8');
      const stats = statSync(filePath);

      // Extract file name without extension
      const fileName = basename(filePath).replace(/\.svg$/i, '');

      svgFiles.push({
        filePath,
        fileName,
        content,
        originalSize: stats.size,
      });
    } catch {
      console.warn(`Warning: Failed to read ${filePath}`);
    }
  }

  // Sort by name for consistent output
  svgFiles.sort((a, b) => a.fileName.localeCompare(b.fileName));

  return svgFiles;
}

/**
 * Read a single SVG file
 *
 * @param filePath - Path to SVG file
 * @returns Raw SVG data or null if failed
 */
export function readSVGFile(filePath: string): RawSVGData | null {
  try {
    const content = readFileSync(filePath, 'utf-8');
    const stats = statSync(filePath);
    const fileName = basename(filePath).replace(/\.svg$/i, '');

    return {
      filePath,
      fileName,
      content,
      originalSize: stats.size,
    };
  } catch {
    return null;
  }
}
