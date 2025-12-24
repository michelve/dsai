/**
 * Style Dictionary Configuration (DTCG-Compliant)
 *
 * This file is a thin wrapper around @dsai/tools Style Dictionary integration.
 * It delegates all transforms, formats, and preprocessors to @dsai/tools.
 *
 * Transforms design tokens from DTCG format to multiple output formats:
 * - CSS Variables
 * - JavaScript/ES6
 * - TypeScript
 * - SCSS Variables
 * - JSON (flattened)
 *
 * @see https://styledictionary.com/
 * @see https://www.designtokens.org/
 */

import { registerAll } from '@dsai/tools/tokens';
import StyleDictionary from 'style-dictionary';

// ============================================================================
// Register All Custom Transforms, Formats, Preprocessors
// ============================================================================

registerAll(StyleDictionary);

// ============================================================================
// Configuration
// ============================================================================

export default {
  // Logging
  log: {
    verbosity: 'default',
    warnings: 'warn',
    errors: 'error',
  },

  // Preprocessing to fix reference paths
  preprocessors: ['fix-references'],

  // Source token files - include all token categories
  source: [
    'collections/color/primitive.json',
    'collections/color/neutral.json',
    'collections/color/background.json',
    'collections/color/opacity.json',
    'collections/color/semantic.json',
    'collections/color/component.json',
    'collections/typography/base.json',
    'collections/spacing/base.json',
    'collections/border/color.json',
    'collections/border/radius.json',
    'collections/border/width.json',
    'collections/shadow/base.json',
    'collections/layout/breakpoints.json',
    'collections/layout/containers.json',
    'collections/layout/grid.json',
  ],

  // Output platforms
  platforms: {
    // CSS Custom Properties
    css: {
      transformGroup: 'custom/css',
      buildPath: 'dist/css/',
      files: [
        {
          destination: 'variables.css',
          format: 'css/variables-with-comments',
          options: {
            prefix: '--dsai-',
            outputReferences: true,
          },
        },
      ],
    },

    // JavaScript/ES6
    js: {
      transformGroup: 'custom/js',
      buildPath: 'dist/js/',
      files: [
        {
          destination: 'tokens.js',
          format: 'javascript/es6',
          options: {
            outputReferences: true,
          },
        },
        {
          destination: 'tokens.cjs',
          format: 'javascript/module',
          options: {
            outputReferences: true,
          },
        },
      ],
    },

    // TypeScript
    ts: {
      transformGroup: 'custom/js',
      buildPath: 'dist/ts/',
      files: [
        {
          destination: 'tokens.ts',
          format: 'javascript/es6',
          options: {
            outputReferences: true,
          },
        },
        {
          destination: 'tokens.d.ts',
          format: 'typescript/declarations',
        },
      ],
    },

    // SCSS Variables (source - for Bootstrap & DSAi builds)
    scss: {
      transformGroup: 'custom/scss',
      buildPath: 'src/scss/',
      files: [
        {
          destination: '_variables.scss',
          format: 'scss/variables',
          options: {
            outputReferences: true,
            basePxFontSize: 16,
          },
        },
      ],
    },

    // SCSS Variables (dist - for npm package consumers)
    'scss-dist': {
      transformGroup: 'custom/scss',
      buildPath: 'dist/scss/',
      files: [
        {
          destination: '_variables.scss',
          format: 'scss/variables',
          options: {
            outputReferences: true,
            basePxFontSize: 16,
          },
        },
      ],
    },

    // JSON (flattened for documentation)
    json: {
      transformGroup: 'js',
      buildPath: 'dist/json/',
      files: [
        {
          destination: 'tokens.json',
          format: 'json/flat',
        },
        {
          destination: 'tokens-nested.json',
          format: 'json/nested',
        },
      ],
    },
  },
};
