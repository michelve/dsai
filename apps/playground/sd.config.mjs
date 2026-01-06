/**
 * Style Dictionary Configuration for Playground
 *
 * Transforms design tokens from DTCG format to multiple output formats.
 *
 * PREREQUISITE: Run `pnpm tokens:transform` first to convert Figma exports
 * from src/figma-exports/ to src/collections/
 *
 * WORKFLOW:
 * 1. Export tokens from Figma to: src/figma-exports/
 * 2. Run: pnpm tokens:transform  (converts to DTCG format)
 * 3. Run: pnpm tokens:build      (generates CSS/JS/TS/SCSS)
 * 4. Generated files appear in: src/generated/
 *
 * @see https://styledictionary.com/
 * @see https://www.designtokens.org/
 */

import { registerAll } from '@dsai/tools/tokens';
import { globSync } from 'glob';
import StyleDictionary from 'style-dictionary';

// Register DSAi custom transforms, formats, and preprocessors
registerAll(StyleDictionary);

// Dynamically find all JSON files in collections (transformed tokens)
const sourceFiles = globSync('src/collections/**/*.json');

export default {
  log: {
    verbosity: 'default',
    warnings: 'warn',
    errors: 'error',
  },

  // Preprocessing to fix reference paths
  preprocessors: ['fix-references'],

  // Source: transformed token files from collections directory
  source: sourceFiles.length > 0 ? sourceFiles : ['src/collections/**/*.json'],

  // Output platforms
  platforms: {
    // CSS Custom Properties
    css: {
      transformGroup: 'custom/css',
      buildPath: 'src/generated/',
      files: [
        {
          destination: 'tokens.css',
          format: 'css/variables-with-comments',
          options: {
            prefix: '--pg-',
            outputReferences: true,
          },
        },
      ],
    },

    // SCSS Variables (for Bootstrap theme integration)
    // No prefix to match @dsai/tokens naming convention (e.g., $color-blue-50)
    scss: {
      transformGroup: 'custom/scss',
      buildPath: 'src/generated/',
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

    // JavaScript/ES6
    js: {
      transformGroup: 'custom/js',
      buildPath: 'src/generated/',
      files: [
        {
          destination: 'tokens.js',
          format: 'javascript/es6',
          options: {
            prefix: 'pg',
          },
        },
      ],
    },

    // TypeScript
    ts: {
      transformGroup: 'custom/js',
      buildPath: 'src/generated/',
      files: [
        {
          destination: 'tokens.ts',
          format: 'typescript/es6-declarations',
          options: {
            prefix: 'pg',
          },
        },
      ],
    },

    // JSON (flat)
    json: {
      transformGroup: 'custom/js',
      buildPath: 'src/generated/',
      files: [
        {
          destination: 'tokens.json',
          format: 'json/flat',
        },
      ],
    },
  },
};
