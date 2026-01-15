/**
 * JavaScript Transform Group
 *
 * Transform group for generating JavaScript output.
 *
 * @packageDocumentation
 * @module @dsai-io/tools/tokens/style-dictionary/groups/js
 */

import type { TransformGroupDefinition } from '../types.js';

/**
 * custom/js transform group
 *
 * Transforms for generating JavaScript/TypeScript exports:
 * - attribute/cti: Add CTI attributes
 * - name/camel: camelCase names
 * - fontWeight/unitless: Keep font weights unitless
 * - lineHeight/unitless: Keep line heights unitless
 * - dimension/rem: Convert dimensions to rem
 * - color/css: Convert colors to CSS format
 */
export const jsTransformGroup: TransformGroupDefinition = {
  name: 'custom/js',
  transforms: [
    'attribute/cti',
    'name/camel',
    'fontWeight/unitless', // Must run before dimension/rem
    'lineHeight/unitless', // Must run before dimension/rem
    'dimension/rem',
    'color/css',
  ],
};
