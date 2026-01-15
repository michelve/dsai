/**
 * @file Token Tooling Module
 * @description Provides utilities for token validation, transformation,
 * and build orchestration using Style Dictionary.
 *
 * @module @dsai-io/tools/tokens
 */

// ============================================================================
// Type Exports
// ============================================================================

export type {
  // Core token types
  DTCGToken,
  LegacyToken,
  Token,
  TokenType,
  TokenCollection,
  // Figma types
  FigmaCollection,
  FigmaExport,
  // Validation types
  ValidationSeverity,
  ValidationIssue,
  ValidateOptions,
  // Build types
  BuildOptions,
  BuildResult,
  BuildStep,
  // Sync types
  SyncOptions,
  SyncResult,
  // Postprocess types
  PostprocessOptions,
  PostprocessResult,
  ReplacementRule,
  // Merge types
  MergeOptions,
  MergeResult,
} from './types.js';

// Re-export with prefixed names to avoid conflicts with config module
export type {
  ValidationResult as TokenValidationResult,
  TransformOptions as TokenTransformOptions,
  TransformResult as TokenTransformResult,
} from './types.js';

// ============================================================================
// Type Guards and Utility Functions
// ============================================================================

export {
  // Type guards
  isDTCGToken,
  isLegacyToken,
  isToken,
  isValidTokenType,
  isTokenReference,
  // Token utilities
  getTokenValue,
  getTokenType,
  getTokenDescription,
  toDTCGToken,
  parseTokenReference,
  // Constants
  VALID_TOKEN_TYPES,
} from './types.js';

// ============================================================================
// Validation Module
// ============================================================================

export { validateTokens, validateTokensCLI } from './validate.js';

// ============================================================================
// Figma Validation Module
// ============================================================================

export {
  validateFigmaExports,
  validateFigmaFile,
  validateFigmaCLI,
  detectModes as detectFigmaModes,
} from './validate-figma.js';

// ============================================================================
// Transform Module
// ============================================================================

export {
  transformTokens,
  transformTokensCLI,
  transformToken,
  transformTokenTree,
  transformType,
  transformValue,
  detectModes as detectTransformModes,
} from './transform.js';

// ============================================================================
// Sync Module
// ============================================================================

export { syncTokens, syncTokensCLI, getDefaultSyncPaths } from './sync.js';

// ============================================================================
// Build Module
// ============================================================================

export { buildTokens, buildTokensCLI, runBuildCLI } from './build.js';

// ============================================================================
// Postprocess Module
// ============================================================================

export {
  postprocessCss,
  postprocessCssFiles,
  postprocessCLI,
  getDefaultCssDir,
  getDefaultFiles,
  getDefaultTransformations,
} from './postprocess.js';

// ============================================================================
// Merge Module (Token Collections)
// ============================================================================

export { mergeCollections, mergeCollectionsCLI } from './merge.js';

// ============================================================================
// Style Merge Module (CSS/SCSS Bundling)
// ============================================================================

export * from './merge/index.js';

// ============================================================================
// Output Path Resolution
// ============================================================================

export * from './output/index.js';

// ============================================================================
// Style Dictionary Integration
// ============================================================================

// Re-export all Style Dictionary types and utilities
export * from './style-dictionary/index.js';
