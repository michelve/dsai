/**
 * Style Dictionary Build Script for Storybook
 *
 * Builds design tokens with Bootstrap-compatible light/dark mode support.
 * Uses Bootstrap 5.3+ data-bs-theme attribute for color mode switching.
 *
 * WORKFLOW:
 * 1. Export tokens from Figma to: src/figma-exports/
 * 2. Run: pnpm tokens:transform  (converts to DTCG format)
 * 3. Run: pnpm tokens:build      (this script - generates CSS/JS/TS/SCSS)
 * 4. Generated files appear in: src/generated/
 *
 * @see https://getbootstrap.com/docs/5.3/customize/color-modes/
 * @see https://styledictionary.com/
 */

import { registerAll } from '@dsai-io/tools/tokens';
import { globSync } from 'glob';
import StyleDictionary from 'style-dictionary';

// Register DSAi custom transforms, formats, and preprocessors
registerAll(StyleDictionary);

// Light mode files (default theme in :root)
const lightModeFiles = globSync('src/collections/**/*.json', {
  ignore: ['src/collections/**/*-dark.json'],
});

// Dark mode files (for [data-bs-theme="dark"] overrides)
const darkModeFiles = globSync('src/collections/**/*-dark.json');

/**
 * Build light mode tokens (base theme in :root)
 */
async function buildLightMode() {
  console.log('\n🌞 Building light mode tokens...');

  const sd = new StyleDictionary({
    log: {
      verbosity: 'default',
      warnings: 'warn',
      errors: 'error',
    },
    preprocessors: ['fix-references'],
    source: lightModeFiles,
    platforms: {
      // CSS Custom Properties in :root
      css: {
        transformGroup: 'custom/css',
        buildPath: 'src/generated/',
        files: [
          {
            destination: 'tokens.css',
            format: 'css/variables-with-comments',
            options: {
              prefix: '--sb-',
              outputReferences: true,
            },
          },
        ],
      },

      // SCSS Variables (for Bootstrap theme integration)
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
              prefix: 'sb',
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
              prefix: 'sb',
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
  });

  await sd.buildAllPlatforms();
  console.log('   ✔︎ Light mode tokens built');
}

/**
 * Build dark mode tokens (scoped to [data-bs-theme="dark"])
 */
async function buildDarkMode() {
  if (darkModeFiles.length === 0) {
    console.log('\n🌙 No dark mode tokens found, skipping...');
    return;
  }

  console.log('\n🌙 Building dark mode tokens...');

  const sd = new StyleDictionary({
    log: {
      verbosity: 'default',
      warnings: 'warn',
      errors: 'error',
    },
    preprocessors: ['fix-references'],
    source: darkModeFiles,
    platforms: {
      // CSS Custom Properties in [data-bs-theme="dark"]
      css: {
        transformGroup: 'custom/css',
        buildPath: 'src/generated/',
        files: [
          {
            destination: 'tokens-dark.css',
            format: 'css/variables-dark-mode',
            options: {
              prefix: '--sb-',
              selector: '[data-bs-theme="dark"]',
              outputReferences: true,
            },
          },
        ],
      },

      // SCSS Variables for dark mode (with -dark suffix)
      scss: {
        transformGroup: 'custom/scss',
        buildPath: 'src/generated/',
        files: [
          {
            destination: '_variables-dark.scss',
            format: 'scss/variables',
            options: {
              outputReferences: true,
              basePxFontSize: 16,
            },
          },
        ],
      },
    },
  });

  await sd.buildAllPlatforms();
  console.log('   ✔︎ Dark mode tokens built');
}

/**
 * Main build function
 */
async function build() {
  console.log('🎨 Building design tokens with Bootstrap color mode support...\n');
  console.log(`   Light mode files: ${lightModeFiles.length}`);
  console.log(`   Dark mode files: ${darkModeFiles.length}`);

  await buildLightMode();
  await buildDarkMode();

  console.log('\n✨ Token build complete!\n');
}

build().catch((error) => {
  console.error('❌ Build failed:', error);
  process.exit(1);
});
