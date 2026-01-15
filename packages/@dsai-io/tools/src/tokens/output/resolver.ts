/**
 * Output path resolver with placeholder support
 *
 * @packageDocumentation
 */

/* eslint-disable security/detect-non-literal-fs-filename */
/* eslint-disable security/detect-object-injection */

import * as fs from 'node:fs';
import * as path from 'node:path';

import type { OutputFormat } from '../../config/types.js';
import type { OutputConfig, PlaceholderValues } from '../merge/types.js';

// ============================================================================
// Constants
// ============================================================================

/**
 * Default file names per format
 */
export const DEFAULT_FILE_NAMES: Record<OutputFormat, string> = {
  css: 'tokens.css',
  scss: '_tokens.scss',
  js: 'tokens.js',
  ts: 'tokens.ts',
  json: 'tokens.json',
  android: 'tokens.xml',
  ios: 'Tokens.swift',
};

// ============================================================================
// Placeholder Functions
// ============================================================================

/**
 * Replace placeholders in a string
 *
 * @param template Template string with placeholders
 * @param values Values to replace
 * @returns String with placeholders replaced
 */
export function replacePlaceholders(template: string, values: PlaceholderValues): string {
  const now = new Date();

  const allValues: Record<string, string> = {
    theme: values.theme ?? 'default',
    name: values.name ?? 'tokens',
    format: values.format ?? '',
    date: values.date ?? now.toISOString().split('T')[0] ?? '',
    timestamp: values.timestamp ?? now.toISOString(),
  };

  let result = template;
  for (const [key, value] of Object.entries(allValues)) {
    result = result.replaceAll(`{${key}}`, value);
  }

  return result;
}

// ============================================================================
// Path Resolution
// ============================================================================

/**
 * Resolve output path for a specific format
 *
 * @param format Output format
 * @param config Output configuration
 * @param values Placeholder values
 * @returns Resolved output path
 *
 * @example
 * ```typescript
 * const outputPath = resolveOutputPath('css', {
 *   baseDir: 'dist',
 *   formatDirs: { css: 'dist/css' },
 *   fileNames: { css: 'design-tokens-{theme}.css' },
 * }, { theme: 'light' });
 *
 * // Returns: 'dist/css/design-tokens-light.css'
 * ```
 */
export function resolveOutputPath(
  format: OutputFormat,
  config: OutputConfig,
  values: PlaceholderValues = {}
): string {
  // Determine directory
  const dir = config.formatDirs[format] ?? config.baseDir;

  // Determine file name
  let fileName = config.fileNames[format] ?? DEFAULT_FILE_NAMES[format];

  // Replace placeholders
  fileName = replacePlaceholders(fileName, values);

  return path.join(dir, fileName);
}

/**
 * Resolve all output paths for all formats
 *
 * @param formats Formats to generate
 * @param config Output configuration
 * @param values Placeholder values
 * @returns Map of format to output path
 */
export function resolveAllOutputPaths(
  formats: OutputFormat[],
  config: OutputConfig,
  values: PlaceholderValues = {}
): Record<OutputFormat, string> {
  const result: Partial<Record<OutputFormat, string>> = {};

  for (const format of formats) {
    result[format] = resolveOutputPath(format, config, values);
  }

  return result as Record<OutputFormat, string>;
}

// ============================================================================
// Validation
// ============================================================================

/**
 * Validate output paths don't conflict
 *
 * @param paths Output paths to validate
 * @returns Validation result with any conflicts found
 */
export function validateOutputPaths(paths: Record<string, string>): {
  valid: boolean;
  conflicts: [string, string][];
} {
  const conflicts: [string, string][] = [];
  const pathToFormat: Record<string, string> = {};

  for (const [format, outputPath] of Object.entries(paths)) {
    const normalized = path.normalize(outputPath);
    const existingFormat = pathToFormat[normalized];

    if (existingFormat !== undefined) {
      conflicts.push([existingFormat, format]);
    } else {
      pathToFormat[normalized] = format;
    }
  }

  return {
    valid: conflicts.length === 0,
    conflicts,
  };
}

// ============================================================================
// Directory Management
// ============================================================================

/**
 * Ensure all output directories exist
 *
 * @param paths Output paths
 * @returns Created directories
 */
export async function ensureOutputDirs(paths: Record<string, string>): Promise<string[]> {
  const directories = new Set<string>();
  for (const outputPath of Object.values(paths)) {
    directories.add(path.dirname(outputPath));
  }

  const created: string[] = [];
  for (const dir of directories) {
    await fs.promises.mkdir(dir, { recursive: true });
    created.push(dir);
  }

  return created;
}

/**
 * Create output configuration from token config
 *
 * @param tokenConfig Token configuration
 * @returns Output configuration
 */
export function createOutputConfig(tokenConfig: {
  outputDir?: string;
  outputDirs?: Partial<Record<OutputFormat, string>>;
  outputFileNames?: Partial<Record<OutputFormat, string>>;
}): OutputConfig {
  return {
    baseDir: tokenConfig.outputDir ?? 'dist',
    formatDirs: tokenConfig.outputDirs ?? {},
    fileNames: tokenConfig.outputFileNames ?? {},
    createDirs: true,
  };
}
