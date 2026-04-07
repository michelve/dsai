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
  BuildFormat,
  BuildOptions,
  BuildResult,
  BuildStep,
  PipelineStep,
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

// Mode extraction and preprocessing types
export type {
  ModeExtractionOptions,
  ModeExtractionResult,
} from './mode-extractor.js';

export type {
  PreprocessorConfig,
  FilePreprocessingResult,
  PreprocessingResult,
} from './mode-preprocessor.js';

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
// Schema Validation Module
// ============================================================================

export {
  // DTCG schemas
  dtcgFileSchema,
  dtcgTokenCollectionSchema,
  dtcgTokenSchema,
  // Figma schemas
  figmaExportSchema,
  figmaExportWithMetadataSchema,
  figmaVariablesResponseSchema,
  // Style Dictionary schemas
  styleDictionaryInputSchema,
  styleDictionaryTokenSchema,
  // Validation functions
  validateDTCGFile,
  validateDTCGTokens,
  validateFigmaExport,
  validateFigmaExportWithMetadata,
  validateFigmaVariablesResponse,
  validateStyleDictionaryInput,
  validateStyleDictionaryTokens,
} from './schemas/index.js';

export type {
  // Schema types
  DTCGFile,
  DTCGTokenCollection,
  FigmaExportWithMetadata,
  FigmaVariablesResponse,
  // Validation types
  ValidationError as SchemaValidationError,
  ValidationOptions as SchemaValidationOptions,
  ValidationResult as SchemaValidationResult,
} from './schemas/index.js';

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
// Theme Discovery Module
// ============================================================================

export {
  discoverThemeFiles,
  getThemeFiles,
  autoDetectThemes,
} from './theme-discovery.js';

export type {
  ThemeFilesResult,
  DiscoveryResult,
  DiscoveryOptions,
} from './theme-discovery.js';

// ============================================================================
// Mode Extraction and Preprocessing Module
// ============================================================================

export {
  extractMode,
  extractModes,
  detectModes,
  flattenModeStructure,
} from './mode-extractor.js';

export {
  preprocessFile,
  preprocessTokenFiles,
  getPreprocessedFilesForMode,
} from './mode-preprocessor.js';

// ============================================================================
// Theme Builder Module
// ============================================================================

export {
  buildTheme,
  buildAllThemes,
  generateThemeBuildConfig,
  getCssFormat,
  getThemeSelector,
  validateThemeDefinitions,
} from './theme-builder.js';

export type {
  ThemeBuildConfig,
  ThemeBuildOptions,
  ThemeBuildResult,
  MultiThemeBuildOptions,
  MultiThemeBuildResult,
  ThemeStyleDictionaryConfig,
  StyleDictionaryPlatformConfig,
  StyleDictionaryFileConfig,
} from './theme-builder.js';

// ============================================================================
// Clean Module
// ============================================================================

export {
  cleanTokenOutputs,
  cleanTokensCLI,
  DEFAULT_CLEAN_DIRECTORIES,
} from './clean.js';

export type {
  CleanOptions,
  CleanResult,
  CleanedDirectory,
} from './clean.js';

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

// ============================================================================
// Framework Mappers
// ============================================================================

// Re-export framework mapping utilities
export * from './framework-mappers/index.js';

// ============================================================================
// Changelog Generation
// ============================================================================

export {
  generateChangelog,
  writeChangelog,
  generateAndWriteChangelog,
  generateChangelogCLI,
} from './changelog.js';

export type {
  ChangelogOptions,
  ChangelogResult,
} from './changelog.js';

export {
  diffTokens,
  summarizeDiff,
  filterDiff,
  getBreakingChanges,
} from './diff.js';

export type {
  TokenChangeType,
  TokenValueChange,
  TokenChange,
  TokenDiff,
} from './diff.js';
