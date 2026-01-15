/**
 * Style Dictionary Transform Groups
 *
 * Exports all built-in transform groups and registration utilities.
 *
 * @packageDocumentation
 * @module @dsai/tools/tokens/style-dictionary/groups
 */

import { cssTransformGroup } from './css.js';
import { jsTransformGroup } from './js.js';
import { scssTransformGroup } from './scss.js';

import type { StyleDictionaryInstance, TransformGroupDefinition } from '../types.js';

/**
 * All built-in transform groups
 */
export const transformGroups: TransformGroupDefinition[] = [
  cssTransformGroup,
  jsTransformGroup,
  scssTransformGroup,
];

/**
 * Register all transform groups with Style Dictionary
 *
 * @param sd - Style Dictionary instance
 * @param customGroups - Additional custom transform groups to register
 *
 * @example
 * ```typescript
 * import StyleDictionary from 'style-dictionary';
 * import { registerTransformGroups } from '@dsai/tools/tokens/style-dictionary';
 *
 * registerTransformGroups(StyleDictionary);
 * ```
 */
export function registerTransformGroups(
  sd: StyleDictionaryInstance,
  customGroups: TransformGroupDefinition[] = []
): void {
  const allGroups = [...transformGroups, ...customGroups];

  for (const group of allGroups) {
    sd.registerTransformGroup({
      name: group.name,
      transforms: group.transforms,
    });
  }
}

// Re-export individual transform groups
export { cssTransformGroup } from './css.js';
export { jsTransformGroup } from './js.js';
export { scssTransformGroup } from './scss.js';
