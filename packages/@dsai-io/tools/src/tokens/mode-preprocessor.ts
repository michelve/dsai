/**
 * Mode Preprocessor Module
 *
 * Preprocesses token files by extracting mode-specific tokens into separate files.
 * This allows theme builders to work with mode-specific token sets.
 *
 * @packageDocumentation
 * @module @dsai-io/tools/tokens/mode-preprocessor
 */

/* eslint-disable security/detect-object-injection */

import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join, parse } from 'node:path';

import { detectModes, extractMode } from './mode-extractor.js';

// ============================================================================
// Types
// ============================================================================

/**
 * Preprocessor configuration
 */
export interface PreprocessorConfig {
  /** Source directory containing original token files */
  sourceDir: string;
  /** Output directory for preprocessed files */
  outputDir: string;
  /** Files to preprocess (glob patterns or file paths) */
  files: string[];
  /** Mode names to extract (auto-detected if not provided) */
  modes?: string[];
  /** Path to modes in token structure */
  modesPath?: string[];
  /** Whether to preserve original files */
  preserveOriginals?: boolean;
  /** Whether to clean output directory before processing */
  clean?: boolean;
  /** Enable verbose logging */
  verbose?: boolean;
}

/**
 * Preprocessing result for a single file
 */
export interface FilePreprocessingResult {
  /** Original file path */
  sourceFile: string;
  /** Detected or configured modes */
  modes: string[];
  /** Generated output files by mode */
  outputFiles: Map<string, string>;
  /** Whether preprocessing succeeded */
  success: boolean;
  /** Error message if failed */
  error?: string;
}

/**
 * Overall preprocessing result
 */
export interface PreprocessingResult {
  /** Results for each processed file */
  files: FilePreprocessingResult[];
  /** Total files processed */
  totalFiles: number;
  /** Number of successful preprocessings */
  successCount: number;
  /** Number of failed preprocessings */
  failureCount: number;
  /** Output directory used */
  outputDir: string;
  /** Cleanup function to remove preprocessed files */
  cleanup: () => void;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Generate output filename for a mode
 */
function generateModeFilename(
  originalFilename: string,
  modeName: string,
  isDefault: boolean
): string {
  const parsed = parse(originalFilename);

  // Default mode keeps original name, others get suffix
  if (isDefault) {
    return originalFilename;
  }

  const suffix = modeName.toLowerCase();
  return `${parsed.name}-${suffix}${parsed.ext}`;
}

/**
 * Read and parse JSON file
 */
function readJsonFile(filePath: string): Record<string, unknown> | null {
  try {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const content = readFileSync(filePath, 'utf-8');
    return JSON.parse(content) as Record<string, unknown>;
  } catch (error) {
    console.error(`Failed to read ${filePath}:`, error);
    return null;
  }
}

/**
 * Write JSON file with formatting
 */
function writeJsonFile(filePath: string, data: Record<string, unknown>): boolean {
  try {
    const content = JSON.stringify(data, null, 2);
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    writeFileSync(filePath, content, 'utf-8');
    return true;
  } catch (error) {
    console.error(`Failed to write ${filePath}:`, error);
    return false;
  }
}

// ============================================================================
// Main Preprocessing Functions
// ============================================================================

/**
 * Preprocess a single token file
 *
 * @param filePath - Path to the token file
 * @param config - Preprocessor configuration
 * @returns Preprocessing result
 */
/**
 * Extract and write a single mode from tokens
 *
 * @returns true if the mode was successfully extracted and written
 */
function extractAndWriteMode(
  tokens: Record<string, unknown>,
  modeName: string,
  modesPath: string[] | undefined,
  filename: string,
  outputDir: string,
  isDefault: boolean,
  verbose: boolean,
  result: FilePreprocessingResult
): boolean {
  const extracted = extractMode(tokens, {
    modeName,
    modesPath,
    preserveNonModeTokens: true,
  });

  if (!extracted.hasTokens) {
    if (verbose) {
      console.warn(`  ⚠️  No tokens found for mode "${modeName}" in ${filename}`);
    }
    return false;
  }

  const outputFilename = generateModeFilename(filename, modeName, isDefault);
  const outputPath = join(outputDir, outputFilename);

  if (!writeJsonFile(outputPath, extracted.tokens)) {
    if (verbose) {
      console.error(`  ❌ Failed to write "${modeName}" → ${outputFilename}`);
    }
    return false;
  }

  result.outputFiles.set(modeName, outputPath);
  if (verbose) {
    console.warn(`  ✅ Extracted "${modeName}" → ${outputFilename}`);
  }
  return true;
}

export function preprocessFile(
  filePath: string,
  config: PreprocessorConfig
): FilePreprocessingResult {
  const { outputDir, modes: configuredModes, modesPath, verbose } = config;

  const result: FilePreprocessingResult = {
    sourceFile: filePath,
    modes: [],
    outputFiles: new Map(),
    success: false,
  };

  const tokens = readJsonFile(filePath);
  if (!tokens) {
    result.error = 'Failed to read source file';
    return result;
  }

  const modes = configuredModes ?? detectModes(tokens, modesPath);
  result.modes = modes;

  if (modes.length === 0) {
    if (verbose) {
      console.warn(`  ⚠️  No modes detected in ${filePath}`);
    }
    result.error = 'No modes detected';
    return result;
  }

  const filename = parse(filePath).base;
  let successCount = 0;

  for (let i = 0; i < modes.length; i++) {
    const modeName = modes[i];
    if (!modeName) {
      continue;
    }

    const isDefault = i === 0;
    if (extractAndWriteMode(tokens, modeName, modesPath, filename, outputDir, isDefault, verbose ?? false, result)) {
      successCount++;
    }
  }

  result.success = successCount > 0;
  return result;
}

/**
 * Preprocess all token files
 *
 * @param config - Preprocessor configuration
 * @returns Overall preprocessing result
 *
 * @example
 * ```typescript
 * const result = preprocessTokenFiles({
 *   sourceDir: './src/figma-exports',
 *   outputDir: './src/.preprocessed',
 *   files: ['foundation.json', 'semantic.json'],
 *   modes: ['Light', 'Dark'],
 *   clean: true,
 * });
 *
 * // Build tokens using preprocessed files...
 *
 * // Cleanup when done
 * result.cleanup();
 * ```
 */
/**
 * Process a single token file, returning a missing-file result if not found
 */
function processTokenFile(
  file: string,
  sourceDir: string,
  verbose: boolean,
  config: PreprocessorConfig
): FilePreprocessingResult {
  const filePath = join(sourceDir, file);

  // eslint-disable-next-line security/detect-non-literal-fs-filename
  if (!existsSync(filePath)) {
    if (verbose) {
      console.warn(`  ⚠️  File not found: ${file}`);
    }
    return {
      sourceFile: filePath,
      modes: [],
      outputFiles: new Map(),
      success: false,
      error: 'File not found',
    };
  }

  if (verbose) {
    console.warn(`\n  📄 Processing ${file}...`);
  }

  return preprocessFile(filePath, config);
}

export function preprocessTokenFiles(config: PreprocessorConfig): PreprocessingResult {
  const { sourceDir, outputDir, files, clean = true, verbose = false } = config;

  if (verbose) {
    console.warn(`\n🔧 Preprocessing token files...`);
    console.warn(`   Source: ${sourceDir}`);
    console.warn(`   Output: ${outputDir}`);
  }

  // Clean output directory if requested
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  if (clean && existsSync(outputDir)) {
    rmSync(outputDir, { recursive: true, force: true });
    if (verbose) {
      console.warn(`   🧹 Cleaned output directory`);
    }
  }

  // Create output directory
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  if (!existsSync(outputDir)) {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    mkdirSync(outputDir, { recursive: true });
  }

  // Process each file
  const results: FilePreprocessingResult[] = [];
  let successCount = 0;
  let failureCount = 0;

  for (const file of files) {
    const fileResult = processTokenFile(file, sourceDir, verbose, config);
    results.push(fileResult);

    if (fileResult.success) {
      successCount++;
    } else {
      failureCount++;
    }
  }

  // Summary
  if (verbose) {
    console.warn(`\n📊 Preprocessing Summary:`);
    console.warn(`   Total: ${files.length}`);
    console.warn(`   Success: ${successCount}`);
    console.warn(`   Failed: ${failureCount}`);
  }

  // Create cleanup function
  const cleanup = (): void => {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    if (existsSync(outputDir)) {
      rmSync(outputDir, { recursive: true, force: true });
      if (verbose) {
        console.warn(`\n🧹 Cleaned up preprocessed files from ${outputDir}`);
      }
    }
  };

  return {
    files: results,
    totalFiles: files.length,
    successCount,
    failureCount,
    outputDir,
    cleanup,
  };
}

/**
 * Get list of preprocessed files for a specific mode
 *
 * @param result - Preprocessing result
 * @param modeName - Mode to get files for
 * @returns Array of file paths for the mode
 */
export function getPreprocessedFilesForMode(
  result: PreprocessingResult,
  modeName: string
): string[] {
  const files: string[] = [];

  for (const fileResult of result.files) {
    const outputPath = fileResult.outputFiles.get(modeName);
    if (fileResult.success && outputPath) {
      files.push(outputPath);
    }
  }

  return files;
}
