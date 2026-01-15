/**
 * Style Dictionary Integration Module
 *
 * Provides reusable transforms, formats, preprocessors, and configuration
 * generation for Style Dictionary token builds.
 *
 * @packageDocumentation
 * @module @dsai/tools/tokens/style-dictionary
 *
 * @example
 * ```typescript
 * import StyleDictionary from 'style-dictionary';
 * import { loadConfig } from '@dsai/tools/config';
 * import {
 *   setupStyleDictionary,
 *   registerAll,
 *   createStyleDictionaryConfig,
 * } from '@dsai/tools/tokens/style-dictionary';
 *
 * // Option 1: All-in-one setup
 * const { config } = await loadConfig();
 * const sdConfig = setupStyleDictionary(StyleDictionary, config);
 * const sd = new StyleDictionary(sdConfig);
 * await sd.buildAllPlatforms();
 *
 * // Option 2: Manual registration
 * registerAll(StyleDictionary);
 * const sdConfig = createStyleDictionaryConfig(config);
 * const sd = new StyleDictionary(sdConfig);
 * await sd.buildAllPlatforms();
 * ```
 */

// ============================================================================
// Type Exports
// ============================================================================

export type {
  // Token types
  SDToken,
  SDDictionary,
  // Transform types
  TransformType,
  SDTransformOptions,
  TransformDefinition,
  TransformGroupDefinition,
  // Format types
  SDPlatform,
  SDFile,
  SDFormatArgs,
  FormatDefinition,
  // Preprocessor types
  PreprocessorDefinition,
  // Config types
  SDLogConfig,
  SDConfig,
  CreateSDConfigOptions,
  SDPlatformType,
  // Registration types
  StyleDictionaryInstance,
} from './types.js';

// Type guards
export { isSDToken, hasDTCGValue, getSDTokenValue, getSDTokenType } from './types.js';

// ============================================================================
// Config Generation
// ============================================================================

export { createStyleDictionaryConfig, registerAll, setupStyleDictionary } from './config.js';

// ============================================================================
// Transforms
// ============================================================================

export {
  // Collections
  builtInTransforms,
  // Registration
  registerTransforms,
  // Individual transforms
  fontWeightUnitless,
  lineHeightUnitless,
  dimensionRem,
  nameKebab,
} from './transforms/index.js';

// ============================================================================
// Formats
// ============================================================================

export {
  // Collections
  builtInFormats,
  // Registration
  registerFormats,
  // Individual formats
  cssVariablesWithComments,
  typescriptDeclarations,
} from './formats/index.js';

// ============================================================================
// Preprocessors
// ============================================================================

export {
  // Collections
  builtInPreprocessors,
  // Registration
  registerPreprocessors,
  // Individual preprocessors
  fixReferences,
  createFixReferencesPreprocessor,
} from './preprocessors/index.js';

// ============================================================================
// Transform Groups
// ============================================================================

export {
  // Collections
  transformGroups,
  // Registration
  registerTransformGroups,
  // Individual groups
  cssTransformGroup,
  jsTransformGroup,
  scssTransformGroup,
} from './groups/index.js';
