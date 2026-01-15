/**
 * Style Dictionary Build Script for Playground
 *
 * Builds design tokens with multi-theme support.
 * Uses data-dsai-theme attribute for color mode switching.
 *
 * SUPPORTED THEMES:
 * - light (default, applied to :root)
 * - dark
 * - pro (future)
 * - enterprise (future)
 * - moonlight (future)
 *
 * FILE NAMING CONVENTION:
 * - light mode: filename.json (no suffix)
 * - other themes: filename-{theme}.json (e.g., foundation-dark.json)
 *
 * WORKFLOW:
 * 1. Export tokens from Figma to: src/figma-exports/
 * 2. Run: pnpm tokens:transform  (converts to DTCG format)
 * 3. Run: pnpm tokens:build      (this script - generates CSS/JS/TS/SCSS)
 * 4. Generated files appear in: src/generated/
 *
 * @see https://styledictionary.com/
 */

import { registerAll } from '@dsai-io/tools/tokens';
import { globSync } from 'glob';
import StyleDictionary from 'style-dictionary';

// Register DSAi custom transforms, formats, and preprocessors
registerAll(StyleDictionary);

/**
 * Theme configuration
 * Add new themes here as they become available
 */
const THEMES = {
  // Light mode is the default (applied to :root, no attribute needed)
  light: {
    suffix: null, // No suffix for light mode files
    selector: ':root',
    cssFile: 'tokens.css',
    scssFile: '_variables.scss',
    isDefault: true,
  },
  // Dark mode
  dark: {
    suffix: '-dark',
    selector: '[data-dsai-theme="dark"]',
    cssFile: 'tokens-dark.css',
    scssFile: '_variables-dark.scss',
    isDefault: false,
  },
  // Pro theme (for premium features)
  pro: {
    suffix: '-pro',
    selector: '[data-dsai-theme="pro"]',
    cssFile: 'tokens-pro.css',
    scssFile: '_variables-pro.scss',
    isDefault: false,
  },
  // Enterprise theme
  enterprise: {
    suffix: '-enterprise',
    selector: '[data-dsai-theme="enterprise"]',
    cssFile: 'tokens-enterprise.css',
    scssFile: '_variables-enterprise.scss',
    isDefault: false,
  },
  // Moonlight theme (dark variant)
  moonlight: {
    suffix: '-moonlight',
    selector: '[data-dsai-theme="moonlight"]',
    cssFile: 'tokens-moonlight.css',
    scssFile: '_variables-moonlight.scss',
    isDefault: false,
  },
};

/**
 * Get token files for a specific theme
 */
function getThemeFiles(theme) {
  const config = THEMES[theme];
  if (!config) {
    throw new Error(`Unknown theme: ${theme}`);
  }

  if (config.isDefault) {
    // Light mode: all files EXCEPT those with theme suffixes
    const themeSuffixes = Object.values(THEMES)
      .filter((t) => t.suffix)
      .map((t) => `**/*${t.suffix}.json`);
    return globSync('src/collections/**/*.json', {
      ignore: themeSuffixes.map((s) => `src/collections/${s}`),
    });
  }

  // Other themes: files with their specific suffix
  return globSync(`src/collections/**/*${config.suffix}.json`);
}

/**
 * Build light mode tokens (base theme in :root)
 */
async function buildDefaultTheme() {
  const theme = 'light';
  const config = THEMES[theme];
  const files = getThemeFiles(theme);

  if (files.length === 0) {
    console.log(`\n No ${theme} theme tokens found`);
    return;
  }

  console.log(`\n🌞 Building ${theme} theme tokens (${files.length} files)...`);

  const sd = new StyleDictionary({
    log: {
      verbosity: 'default',
      warnings: 'warn',
      errors: 'error',
    },
    preprocessors: ['fix-references'],
    source: files,
    platforms: {
      // CSS Custom Properties in :root
      css: {
        transformGroup: 'custom/css',
        buildPath: 'src/generated/',
        files: [
          {
            destination: config.cssFile,
            format: 'css/variables-with-comments',
            options: {
              prefix: '--pg-',
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
            destination: config.scssFile,
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
  });

  await sd.buildAllPlatforms();
  console.log(`   ✔︎ ${theme} theme tokens built`);
}

/**
 * Build tokens for a specific theme (non-default)
 * Uses [data-dsai-theme="{theme}"] selector
 */
async function buildTheme(themeName) {
  const config = THEMES[themeName];
  if (!config) {
    console.log(`\n⚠️  Unknown theme: ${themeName}`);
    return;
  }

  const files = getThemeFiles(themeName);
  if (files.length === 0) {
    // Silently skip themes with no files (they may be added later)
    return;
  }

  console.log(`\n🎨 Building ${themeName} theme tokens (${files.length} files)...`);

  const sd = new StyleDictionary({
    log: {
      verbosity: 'default',
      warnings: 'warn',
      errors: 'error',
    },
    preprocessors: ['fix-references'],
    source: files,
    platforms: {
      // CSS Custom Properties with theme selector
      css: {
        transformGroup: 'custom/css',
        buildPath: 'src/generated/',
        files: [
          {
            destination: config.cssFile,
            format: 'css/variables-dark-mode',
            options: {
              prefix: '--pg-',
              selector: config.selector,
              outputReferences: true,
            },
          },
        ],
      },

      // SCSS Variables for this theme
      scss: {
        transformGroup: 'custom/scss',
        buildPath: 'src/generated/',
        files: [
          {
            destination: config.scssFile,
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
  console.log(`   ✔︎ ${themeName} theme tokens built`);
}

/**
 * Main build function - builds all available themes
 */
async function build() {
  console.log('🎨 Building design tokens with multi-theme support...\n');
  console.log('   Supported themes:', Object.keys(THEMES).join(', '));

  // Build default (light) theme first
  await buildDefaultTheme();

  // Build all non-default themes
  for (const themeName of Object.keys(THEMES)) {
    if (!THEMES[themeName].isDefault) {
      await buildTheme(themeName);
    }
  }

  console.log('\n✨ Token build complete!\n');
}

build().catch(console.error);
