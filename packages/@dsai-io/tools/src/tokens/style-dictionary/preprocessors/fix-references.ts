/**
 * Fix References Preprocessor
 *
 * Fixes token reference paths that may be mismatched between
 * Figma exports and the actual token structure.
 *
 * @packageDocumentation
 * @module @dsai-io/tools/tokens/style-dictionary/preprocessors/fix-references
 */

import type { PreprocessorDefinition } from '../types.js';

/**
 * Default reference path mappings
 * Maps incorrect reference paths to correct paths
 */
const DEFAULT_PATH_MAPPINGS: Array<[string, string]> = [
  ['{colors.brand.', '{color.'],
  ['{colors.neutral.', '{neutral.'],
  ['{borders.width.', '{border.width.'],
];

/**
 * Fix a single value's reference path
 */
function fixValue(value: unknown, mappings: Array<[string, string]>): unknown {
  if (typeof value !== 'string' || !value.startsWith('{')) {
    return value;
  }

  let result = value;
  for (const mapping of mappings) {
    result = result.split(mapping[0]).join(mapping[1]);
  }
  return result;
}

/**
 * Process tokens recursively to fix reference paths
 */
function processTokens(obj: Record<string, unknown>, mappings: Array<[string, string]>): void {
  for (const key of Object.keys(obj)) {
    // eslint-disable-next-line security/detect-object-injection
    const value = obj[key];

    if (value && typeof value === 'object') {
      const typedValue = value as Record<string, unknown>;

      // DTCG format - fix $value
      if ('$value' in typedValue) {
        typedValue['$value'] = fixValue(typedValue['$value'], mappings);
      }
      // Legacy format - fix value
      else if ('value' in typedValue) {
        typedValue['value'] = fixValue(typedValue['value'], mappings);
      }
      // Recurse into nested objects
      else {
        processTokens(typedValue, mappings);
      }
    }
  }
}

/**
 * fix-references preprocessor
 *
 * Fixes token reference paths that may be mismatched.
 * Our tokens use "color.blue.500" but Figma exports may reference
 * "{colors.brand.blue.500}" - this preprocessor fixes the mismatch.
 *
 * @example
 * Before: { $value: "{colors.brand.primary}" }
 * After:  { $value: "{color.primary}" }
 */
export const fixReferences: PreprocessorDefinition = {
  name: 'fix-references',
  preprocessor: (dictionary) => {
    processTokens(dictionary, DEFAULT_PATH_MAPPINGS);
    return dictionary;
  },
};

/**
 * Create a custom fix-references preprocessor with custom mappings
 *
 * @param mappings - Array of [from, to] path mapping pairs
 * @returns Custom preprocessor definition
 *
 * @example
 * ```typescript
 * const customFixReferences = createFixReferencesPreprocessor([
 *   ['{colors.brand.', '{color.'],
 *   ['{acme.', '{brand.'],
 * ]);
 * ```
 */
export function createFixReferencesPreprocessor(
  mappings: Array<[string, string]>
): PreprocessorDefinition {
  return {
    name: 'fix-references-custom',
    preprocessor: (dictionary) => {
      processTokens(dictionary, mappings);
      return dictionary;
    },
  };
}
