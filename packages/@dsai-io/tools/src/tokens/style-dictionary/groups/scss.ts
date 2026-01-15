/**
 * SCSS Transform Group
 *
 * Transform group for generating SCSS output.
 *
 * @packageDocumentation
 * @module @dsai/tools/tokens/style-dictionary/groups/scss
 */

import type { TransformGroupDefinition } from '../types.js';

/**
 * custom/scss transform group
 *
 * Transforms for generating SCSS variables:
 * - attribute/cti: Add CTI attributes
 * - name/kebab: kebab-case names
 * - time/seconds: Convert time to seconds
 * - fontWeight/unitless: Keep font weights unitless
 * - lineHeight/unitless: Keep line heights unitless
 * - dimension/rem: Convert dimensions to rem
 * - color/css: Convert colors to CSS format
 *
 * This follows Style Dictionary v5 best practices:
 * - Source tokens are raw numbers
 * - Transforms add appropriate units (or keep unitless for font-weight/line-height)
 */
export const scssTransformGroup: TransformGroupDefinition = {
  name: 'custom/scss',
  transforms: [
    'attribute/cti', // Add CTI attributes
    'name/kebab', // kebab-case names
    'time/seconds', // Convert time to seconds
    'fontWeight/unitless', // Font weights stay unitless (MUST run before dimension/rem)
    'lineHeight/unitless', // Line heights stay unitless (MUST run before dimension/rem)
    'dimension/rem', // Convert dimensions to rem
    'color/css', // Convert colors to CSS format
  ],
};
