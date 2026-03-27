/**
 * Style Dictionary Transforms
 *
 * Exports all built-in transforms and registration utilities.
 *
 * @packageDocumentation
 * @module @dsai-io/tools/tokens/style-dictionary/transforms
 */

import { dimensionRem } from './dimension.js';
import { fontWeightUnitless } from './font-weight.js';
import { lineHeightUnitless } from './line-height.js';
import { nameJsIdentifier } from './name-js-identifier.js';
import { nameKebab } from './name.js';

import type { StyleDictionaryInstance, TransformDefinition } from '../types.js';

/**
 * All built-in transforms
 */
export const builtInTransforms: TransformDefinition[] = [
  fontWeightUnitless,
  lineHeightUnitless,
  dimensionRem,
  nameKebab,
  nameJsIdentifier,
];

/**
 * Register all transforms with Style Dictionary
 *
 * @param sd - Style Dictionary instance
 * @param customTransforms - Additional custom transforms to register
 *
 * @example
 * ```typescript
 * import StyleDictionary from 'style-dictionary';
 * import { registerTransforms } from '@dsai-io/tools/tokens/style-dictionary';
 *
 * registerTransforms(StyleDictionary);
 * ```
 */
export function registerTransforms(
  sd: StyleDictionaryInstance,
  customTransforms: TransformDefinition[] = []
): void {
  const allTransforms = [...builtInTransforms, ...customTransforms];

  for (const transform of allTransforms) {
    sd.registerTransform({
      name: transform.name,
      type: transform.type,
      filter: transform.filter,
      transform: transform.transform,
    });
  }
}

// Re-export individual transforms
export { fontWeightUnitless } from './font-weight.js';
export { lineHeightUnitless } from './line-height.js';
export { dimensionRem } from './dimension.js';
export { nameKebab } from './name.js';
export { nameJsIdentifier } from './name-js-identifier.js';
