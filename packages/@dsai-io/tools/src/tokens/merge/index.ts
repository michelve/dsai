/**
 * Style merge and bundle module
 *
 * @packageDocumentation
 */

// Types
export type {
  BundleConfig,
  BundleResult,
  MergeConfig,
  MergeContent,
  OutputConfig,
  PlaceholderValues,
  StyleScannedFile,
  StyleScannerOptions,
  StyleScannerResult,
  StyleMergeResult,
} from './types.js';

// Scanner
export {
  filterFiles,
  getDefaultIgnorePatterns,
  scanDirectories,
  sortFiles,
} from './scanner.js';

// Merger
export {
  addScssImportHeader,
  loadContent,
  mergeContent,
  processScssImportHeader,
} from './merger.js';

// Bundler
export { createBundle, createBundleFromFiles, createBundles } from './bundler.js';
