/**
 * DSAI Configuration for @dsai/tokens
 *
 * This file configures the @dsai/tools build pipeline.
 * Enterprise teams can copy and customize this file.
 *
 * @see https://github.com/michelve/dsai/tree/main/packages/@dsai/tools
 */

import { defineConfig } from '@dsai/tools';

export default defineConfig({
  // Global settings
  global: {
    debug: process.env.DEBUG === 'true',
    verbose: process.env.VERBOSE === 'true',
    logLevel: process.env.LOG_LEVEL ?? 'info',
  },

  // Token configuration
  tokens: {
    // Source directory for token files
    sourceDir: './collections',

    // Output directory for generated files
    outputDir: './dist',

    // CSS variable prefix (e.g., --dsai-color-blue-500)
    prefix: '--dsai-',

    // Base font size for rem calculations
    baseFontSize: 16,

    // Output references in generated files (uses CSS var() functions)
    outputReferences: true,

    // Platforms to build
    formats: ['css', 'js', 'ts', 'scss', 'scss-dist', 'json'],

    // Build configuration
    build: {
      // Clean output directory before build
      clean: true,

      // Enable multipass optimization
      multipass: true,
    },

    // Watch configuration
    watch: {
      // Patterns to watch for changes
      patterns: ['collections/**/*.json'],
    },
  },

  // Theme configuration (for Bootstrap theme generation)
  themes: {
    // Enable theme generation
    enabled: true,

    // Default theme mode
    defaultMode: 'light',

    // Available modes
    modes: ['light', 'dark'],
  },
});
