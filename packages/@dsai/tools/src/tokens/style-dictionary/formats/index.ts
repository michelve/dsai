/**
 * Style Dictionary Formats
 *
 * Exports all built-in formats and registration utilities.
 *
 * @packageDocumentation
 * @module @dsai/tools/tokens/style-dictionary/formats
 */

import { cssVariablesWithComments } from './css-variables.js';
import { typescriptDeclarations } from './typescript.js';

import type { FormatDefinition, StyleDictionaryInstance } from '../types.js';

/**
 * All built-in formats
 */
export const builtInFormats: FormatDefinition[] = [
  cssVariablesWithComments,
  typescriptDeclarations,
];

/**
 * Register all formats with Style Dictionary
 *
 * @param sd - Style Dictionary instance
 * @param customFormats - Additional custom formats to register
 *
 * @example
 * ```typescript
 * import StyleDictionary from 'style-dictionary';
 * import { registerFormats } from '@dsai/tools/tokens/style-dictionary';
 *
 * registerFormats(StyleDictionary);
 * ```
 */
export function registerFormats(
  sd: StyleDictionaryInstance,
  customFormats: FormatDefinition[] = []
): void {
  const allFormats = [...builtInFormats, ...customFormats];

  for (const format of allFormats) {
    sd.registerFormat({
      name: format.name,
      format: format.format,
    });
  }
}

// Re-export individual formats
export { cssVariablesWithComments } from './css-variables.js';
export { typescriptDeclarations } from './typescript.js';
