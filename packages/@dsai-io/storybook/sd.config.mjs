/**
 * Style Dictionary Configuration for Storybook
 *
 * Transforms design tokens from DTCG format to multiple output formats.
 * Generates both light mode tokens (main) and dark mode CSS overrides.
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

import { registerAll } from '@dsai-io/tools/tokens';
import { globSync } from 'glob';
import StyleDictionary from 'style-dictionary';

// Register DSAi custom transforms, formats, and preprocessors
registerAll(StyleDictionary);

// Dynamically find token files, separating light and dark mode
// Exclude dark mode files from light mode build to prevent value collisions
const lightModeFiles = globSync('src/collections/**/*.json', {
  ignore: ['src/collections/**/*-dark.json'],
});

export default {
  log: {
    verbosity: 'default',
    warnings: 'warn',
    errors: 'error',
  },

  // Preprocessing to fix reference paths
  preprocessors: ['fix-references'],

  // Source: light mode token files only (exclude *-dark.json)
  source: lightModeFiles,

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
            prefix: '--dsai-',
            outputReferences: true,
          },
        },
      ],
    },

    // SCSS Variables (for Bootstrap theme integration)
    // No prefix to match @dsai-io/tokens naming convention (e.g., $color-blue-50)
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
      transformGroup: 'js-custom',
      buildPath: 'src/generated/',
      files: [
        {
          destination: 'tokens.js',
          format: 'javascript/es6',
          options: {
            prefix: 'sb',
          },
        },
      ],
    },

    // TypeScript
    ts: {
      transformGroup: 'js-custom',
      buildPath: 'src/generated/',
      files: [
        {
          destination: 'tokens.d.ts',
          format: 'typescript/es6-declarations',
          options: {
            prefix: 'sb',
          },
        },
      ],
    },

    // JSON (flat)
    json: {
      transformGroup: 'js-custom',
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
