/**
 * CSS Transform Group
 *
 * Transform group for generating CSS output.
 *
 * @packageDocumentation
 * @module @dsai/tools/tokens/style-dictionary/groups/css
 */

import type { TransformGroupDefinition } from '../types.js';

/**
 * custom/css transform group
 *
 * Transforms for generating CSS custom properties:
 * - attribute/cti: Add CTI attributes
 * - name/kebab: kebab-case names
 * - time/seconds: Convert time to seconds
 * - fontWeight/unitless: Keep font weights unitless
 * - lineHeight/unitless: Keep line heights unitless
 * - dimension/rem: Convert dimensions to rem
 * - color/css: Convert colors to CSS format
 */
export const cssTransformGroup: TransformGroupDefinition = {
  name: 'custom/css',
  transforms: [
    'attribute/cti',
    'name/kebab',
    'time/seconds',
    'fontWeight/unitless', // Must run before dimension/rem
    'lineHeight/unitless', // Must run before dimension/rem
    'dimension/rem',
    'color/css',
  ],
};
