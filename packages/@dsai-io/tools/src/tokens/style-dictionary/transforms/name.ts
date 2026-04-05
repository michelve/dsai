/**
 * Name Transform
 *
 * Converts token paths to kebab-case names.
 *
 * @packageDocumentation
 * @module @dsai-io/tools/tokens/style-dictionary/transforms/name
 */

import type { TransformDefinition } from '../types.js';

/**
 * name/kebab transform
 *
 * Converts token path to kebab-case CSS variable name.
 * Replaces underscores with hyphens and lowercases.
 *
 * @example
 * Input: path = ['color', 'blue', '500']
 * Output: "color-blue-500"
 *
 * @example
 * Input: path = ['typography', 'fontWeight', 'bold']
 * Output: "typography-fontweight-bold"
 */
export const nameKebab: TransformDefinition = {
  name: 'name/kebab',
  type: 'name',
  transform: (token) => {
    return token.path.join('-').replaceAll('_', '-').toLowerCase();
  },
};
