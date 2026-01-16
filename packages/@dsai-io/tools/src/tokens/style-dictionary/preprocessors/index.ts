/**
 * Style Dictionary Preprocessors
 *
 * Exports all built-in preprocessors and registration utilities.
 *
 * @packageDocumentation
 * @module @dsai-io/tools/tokens/style-dictionary/preprocessors
 */

import { fixReferences } from './fix-references.js';

import type { PreprocessorDefinition, StyleDictionaryInstance } from '../types.js';

/**
 * All built-in preprocessors
 */
export const builtInPreprocessors: PreprocessorDefinition[] = [fixReferences];

/**
 * Register all preprocessors with Style Dictionary
 *
 * @param sd - Style Dictionary instance
 * @param customPreprocessors - Additional custom preprocessors to register
 *
 * @example
 * ```typescript
 * import StyleDictionary from 'style-dictionary';
 * import { registerPreprocessors } from '@dsai-io/tools/tokens/style-dictionary';
 *
 * registerPreprocessors(StyleDictionary);
 * ```
 */
export function registerPreprocessors(
  sd: StyleDictionaryInstance,
  customPreprocessors: PreprocessorDefinition[] = []
): void {
  const allPreprocessors = [...builtInPreprocessors, ...customPreprocessors];

  for (const preprocessor of allPreprocessors) {
    sd.registerPreprocessor({
      name: preprocessor.name,
      preprocessor: preprocessor.preprocessor,
    });
  }
}

// Re-export individual preprocessors
export { fixReferences, createFixReferencesPreprocessor } from './fix-references.js';
