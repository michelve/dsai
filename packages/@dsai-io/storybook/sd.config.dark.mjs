/**
 * Style Dictionary Configuration for Dark Mode Tokens
 *
 * Generates CSS custom properties scoped to dark mode selectors.
 * These tokens override the light mode tokens when dark theme is active.
 *
 * @see https://styledictionary.com/
 */

import { registerAll } from '@dsai-io/tools/tokens';
import { globSync } from 'glob';
import StyleDictionary from 'style-dictionary';

// Register DSAi custom transforms, formats, and preprocessors
registerAll(StyleDictionary);

// Dark mode token files
const darkModeFiles = globSync('src/collections/**/*-dark.json').map((f) => f.replace(/\\/g, '/'));

export default {
  log: {
    verbosity: 'default',
    warnings: 'warn',
    errors: 'error',
  },

  preprocessors: ['fix-references'],

  // Source: dark mode token files only
  source: darkModeFiles,

  platforms: {
    // CSS Custom Properties for dark mode (scoped to dark theme selectors)
    css: {
      transformGroup: 'custom/css',
      buildPath: 'src/generated/',
      files: [
        {
          destination: 'tokens-dark.css',
          format: 'css/variables',
          options: {
            prefix: '--sb-',
            outputReferences: true,
            // Wrap in dark mode selector
            selector: '[data-bs-theme="dark"], [data-dsai-theme="dark"]',
          },
        },
      ],
    },
  },
};
