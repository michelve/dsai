/**
 * @file DSAi Figma Integration
 * @description Figma integration utilities, token synchronization, and API client for DSAi.
 *
 * This package provides:
 * - Re-exports of Figma-related utilities from @dsai/tools
 * - Figma REST API client for design file access
 * - Token synchronization between Figma and the design system
 * - Validation utilities for Figma token exports
 *
 * @packageDocumentation
 *
 * @example Validate Figma exports
 * ```ts
 * import { validateFigmaExports } from '@dsai/figma-tokens';
 *
 * const result = await validateFigmaExports({
 *   exportsDir: './figma-exports',
 *   strict: true,
 * });
 *
 * if (!result.valid) {
 *   console.error('Validation failed:', result.errors);
 * }
 * ```
 *
 * @example Transform Figma tokens
 * ```ts
 * import { transformTokens } from '@dsai/figma-tokens';
 *
 * await transformTokens({
 *   sourceDir: './figma-exports',
 *   outputDir: './tokens/collections',
 * });
 * ```
 *
 * @example Sync tokens to TypeScript
 * ```ts
 * import { syncTokens } from '@dsai/figma-tokens';
 *
 * await syncTokens({
 *   tokensDir: './packages/@dsai/tokens',
 * });
 * ```
 *
 * @example Use Figma API client (future)
 * ```ts
 * import { FigmaClient } from '@dsai/figma-tokens/client';
 *
 * const client = new FigmaClient({ accessToken: process.env.FIGMA_TOKEN });
 * const file = await client.getFile('file-key');
 * ```
 */

// ============================================================================
// Re-exports from @dsai/tools/tokens
// ============================================================================

// Types
export type {
  // Core token types
  DTCGToken,
  LegacyToken,
  Token,
  TokenType,
  TokenCollection,
  // Figma-specific types
  FigmaCollection,
  FigmaExport,
  // Validation types
  ValidationSeverity,
  ValidationIssue,
  ValidateOptions,
  TokenValidationResult as ValidationResult,
  // Build types
  BuildOptions,
  BuildResult,
  BuildStep,
  // Sync types
  SyncOptions,
  SyncResult,
  // Transform types
  TokenTransformOptions as TransformOptions,
  TokenTransformResult as TransformResult,
  // Merge types
  MergeOptions,
  MergeResult,
  // Postprocess types
  PostprocessOptions,
  PostprocessResult,
  ReplacementRule,
} from '@dsai/tools/tokens';

// Type guards and utilities
export {
  isDTCGToken,
  isLegacyToken,
  isToken,
  isValidTokenType,
  isTokenReference,
  getTokenValue,
  getTokenType,
  getTokenDescription,
  toDTCGToken,
  parseTokenReference,
  VALID_TOKEN_TYPES,
} from '@dsai/tools/tokens';

// Figma validation
export {
  validateFigmaExports,
  validateFigmaFile,
  validateFigmaCLI,
  detectFigmaModes,
} from '@dsai/tools/tokens';

// Token transformation
export {
  transformTokens,
  transformTokensCLI,
  transformToken,
  transformTokenTree,
  transformType,
  transformValue,
  detectTransformModes,
} from '@dsai/tools/tokens';

// Token sync
export { syncTokens, syncTokensCLI, getDefaultSyncPaths } from '@dsai/tools/tokens';

// Token build
export { buildTokens, buildTokensCLI, runBuildCLI } from '@dsai/tools/tokens';

// Token merge
export { mergeCollections, mergeCollectionsCLI } from '@dsai/tools/tokens';

// CSS postprocessing
export {
  postprocessCss,
  postprocessCssFiles,
  postprocessCLI,
  getDefaultCssDir,
  getDefaultFiles,
  getDefaultTransformations,
} from '@dsai/tools/tokens';

// General token validation
export { validateTokens, validateTokensCLI } from '@dsai/tools/tokens';

// ============================================================================
// Figma-specific Types (from this package)
// ============================================================================

export type {
  FigmaClientConfig,
  FigmaFile,
  FigmaNode,
  FigmaComponent,
  FigmaStyle,
  FigmaVariable,
  FigmaVariableCollection,
  FigmaVariableMode,
  FigmaApiError,
  ExportTokensOptions,
  ExportTokensResult,
  SyncFigmaOptions,
  SyncFigmaResult,
} from './types.js';

// ============================================================================
// Figma Client (stub for future implementation)
// ============================================================================

export { FigmaClient, createFigmaClient, createFigmaClientFromEnv } from './client.js';

// ============================================================================
// Version
// ============================================================================

/**
 * Package version
 */
export const VERSION = '1.0.2';

/**
 * Package name
 */
export const PACKAGE_NAME = '@dsai/figma-tokens';
