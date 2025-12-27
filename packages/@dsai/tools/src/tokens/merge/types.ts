/**
 * Style merge and bundle type definitions
 *
 * @packageDocumentation
 */

import type { OutputFormat } from '../../config/types.js';

// ============================================================================
// Merge Configuration
// ============================================================================

/**
 * Configuration for merging additional stylesheets
 */
export interface MergeConfig {
  /**
   * Additional SCSS directories to scan
   * Relative to config file location
   */
  scssDirectories: string[];

  /**
   * Additional CSS directories to scan
   * Relative to config file location
   */
  cssDirectories: string[];

  /**
   * Order of merging
   * - 'before': User styles before token styles
   * - 'after': User styles after token styles
   */
  mergeOrder: 'before' | 'after';

  /**
   * Create combined bundle files
   */
  createBundle: boolean;

  /**
   * SCSS file to import at top of generated files
   */
  scssImportHeader?: string | string[];

  /**
   * File patterns to ignore when scanning
   * @default ['_index.scss', '*.test.scss']
   */
  ignorePatterns?: string[];

  /**
   * Sort order for collected files
   * - 'alphabetical': Sort A-Z by filename
   * - 'directory-first': Group by directory, then alphabetical
   * - 'explicit': Use order from config
   */
  sortOrder?: 'alphabetical' | 'directory-first' | 'explicit';
}

// ============================================================================
// Output Configuration
// ============================================================================

/**
 * Configuration for output file locations
 */
export interface OutputConfig {
  /**
   * Default output directory (applies to all formats)
   */
  baseDir: string;

  /**
   * Per-format output directories
   * Overrides baseDir for specific formats
   */
  formatDirs: Partial<Record<OutputFormat, string>>;

  /**
   * Per-format file names with placeholder support
   * Placeholders: {theme}, {name}, {format}, {date}
   */
  fileNames: Partial<Record<OutputFormat, string>>;

  /**
   * Create directories if they don't exist
   * @default true
   */
  createDirs?: boolean;
}

// ============================================================================
// Scanner Types
// ============================================================================

/**
 * Scanned stylesheet file information
 */
export interface StyleScannedFile {
  /** Absolute path to file */
  absolutePath: string;

  /** Relative path from source directory */
  relativePath: string;

  /** File name without extension */
  name: string;

  /** File extension (scss, css) */
  extension: 'scss' | 'css';

  /** File size in bytes */
  size: number;

  /** Last modified timestamp */
  mtime: Date;

  /** Directory depth from source root */
  depth: number;
}

/**
 * Style scanner options
 */
export interface StyleScannerOptions {
  /** Directories to scan */
  directories: string[];

  /** File extension to look for */
  extension: 'scss' | 'css';

  /** Patterns to ignore */
  ignorePatterns?: string[];

  /** Follow symlinks */
  followSymlinks?: boolean;

  /** Max directory depth */
  maxDepth?: number;
}

/**
 * Style scanner result
 */
export interface StyleScannerResult {
  /** Scanned files */
  files: StyleScannedFile[];

  /** Directories that were scanned */
  directories: string[];

  /** Directories that were missing */
  missingDirectories: string[];

  /** Total file count */
  totalFiles: number;

  /** Total size in bytes */
  totalSize: number;
}

// ============================================================================
// Merge Types
// ============================================================================

/**
 * Content to merge
 */
export interface MergeContent {
  /** Source file path */
  source: string;

  /** File content */
  content: string;

  /** Content type */
  type: 'token' | 'user';

  /** Format */
  format: 'scss' | 'css';

  /** Theme name (if applicable) */
  theme?: string;
}

/**
 * Merge result
 */
export interface StyleMergeResult {
  /** Merged content */
  content: string;

  /** Source map (if generated) */
  sourceMap?: string;

  /** Files included in merge */
  sources: string[];

  /** Warnings during merge */
  warnings: string[];
}

// ============================================================================
// Bundle Types
// ============================================================================

/**
 * Bundle configuration
 */
export interface BundleConfig {
  /** Bundle name (without extension) */
  name: string;

  /** Include source comments */
  includeSourceComments: boolean;

  /** Generate sourcemaps */
  sourcemaps: boolean;

  /** Minify output */
  minify: boolean;

  /** Output directory */
  outputDir: string;
}

/**
 * Bundle result
 */
export interface BundleResult {
  /** Bundle content */
  content: string;

  /** Sourcemap content (if generated) */
  sourcemap?: string;

  /** Output file path */
  outputPath: string;

  /** Files included in bundle */
  files: string[];

  /** Bundle size in bytes */
  size: number;

  /** Minified size (if minified) */
  minifiedSize?: number;
}

// ============================================================================
// Placeholder Types
// ============================================================================

/**
 * Placeholder values for file naming
 */
export interface PlaceholderValues {
  /** Theme name (e.g., 'light', 'dark') */
  theme?: string;

  /** Token name or identifier */
  name?: string;

  /** Output format */
  format?: OutputFormat;

  /** Current date in ISO format */
  date?: string;

  /** Timestamp */
  timestamp?: string;
}
