/**
 * DSAI Configuration for Playground App
 *
 * This configuration tells @dsai-io/tools where to find your Figma token exports
 * and where to output the generated style files.
 *
 * @see https://github.com/michelve/dsai/tree/main/packages/@dsai-io/tools
 * @see https://github.com/michelve/dsai/blob/main/docs/INCREMENTAL-BUILD.md
 * @see https://github.com/michelve/dsai/blob/main/docs/CHANGELOG-GENERATION.md
 * @see https://github.com/michelve/dsai/blob/main/docs/TOKEN-RECOVERY.md
 */

import { defineConfig } from '@dsai-io/tools';

export default defineConfig({
  // Global settings
  global: {
    debug: process.env['DEBUG'] === 'true',
    logLevel: process.env['LOG_LEVEL'] ?? 'info',
  },

  // Token configuration
  tokens: {
    // Source type - 'theme' uses theme.json, 'collections' uses individual files
    source: 'theme',

    // Directory for raw Figma exports (theme.json or foundation.json, etc.)
    sourceDir: './src/figma-exports',

    // Base directory for processed collections (transform outputs to ./collections/ subdirs)
    collectionsDir: './src',

    // Output directory for generated files (CSS, SCSS, JS, TS)
    outputDir: './src/generated',

    // CSS variable prefix (e.g., --dsai-color-blue-500)
    prefix: '--dsai-',

    // Base font size for rem calculations
    baseFontSize: 16,

    // Output references in generated files (uses CSS var() functions)
    outputReferences: true,

    // Output formats to generate
    formats: ['css', 'js', 'ts', 'scss', 'json'],

    // =========================================================================
    // NEW: Incremental Build Configuration (TASK-122)
    // =========================================================================
    // Cache configuration for 10-100x faster incremental builds
    cache: {
      enabled: true, // Enable incremental builds with SHA-256 caching
      directory: '.dsai-cache', // Cache directory (relative to config file)
      hashType: 'content', // Hash strategy: 'content' | 'timestamp'
      maxAge: 86400000, // Cache expiration (24 hours in milliseconds)
    },

    // =========================================================================
    // NEW: Error Recovery Configuration (TASK-119)
    // =========================================================================
    // Snapshot configuration for version rollback
    snapshot: {
      enabled: true, // Enable automatic snapshots before builds
      directory: '.snapshots', // Snapshot directory
      maxSnapshots: 10, // Keep last 10 snapshots
      include: ['**/*.json'], // File patterns to snapshot
      exclude: ['node_modules/**', '.git/**'], // Patterns to exclude
    },

    // Circuit breaker for API resilience
    circuitBreaker: {
      enabled: true, // Enable circuit breaker for external APIs
      threshold: 5, // Open circuit after 5 consecutive failures
      timeout: 30000, // Timeout per request (30 seconds)
      resetTimeout: 60000, // Time to wait before retry (60 seconds)
    },

    // Rate limiter for API protection (Figma, etc.)
    rateLimiter: {
      enabled: true, // Enable rate limiting
      maxRequests: 10, // Max requests per window
      windowMs: 60000, // Time window (60 seconds)
    },

    // Additional SCSS directories to include in the build
    // These will be compiled alongside token-generated SCSS
    additionalScssDirectories: ['./src/scss/custom'],

    // Whether to create bundle files that merge tokens + custom styles
    createBundle: true,

    // SCSS/CSS output configuration
    scss: {
      // Generate both expanded (readable) and compressed (minified) output
      outputStyles: ['expanded', 'compressed'],
      // Suffix for minified files (e.g., dsai-theme-bs.min.css)
      minifiedSuffix: '.min',
      // Theme entry point
      themeEntry: 'src/scss/dsai-theme-bs.scss',
      // Utilities entry point
      utilitiesEntry: 'src/scss/dsai-utilities.scss',
      // Output directory for compiled CSS
      cssOutputDir: 'src/generated',
      // Additional Sass load paths
      loadPaths: ['node_modules'],
      // Target CSS framework for variable name mapping
      // Maps token names to Bootstrap-compatible variable names
      framework: 'bootstrap',
      // Output path for Bootstrap-compatible SCSS variables
      // This file contains ALL variables from ALL collections (color, typography, spacing, etc.)
      variablesOutput: 'src/scss/_variables.scss',
    },

    // Build pipeline configuration
    pipeline: {
      // Pipeline steps to execute
      // Available: 'validate', 'snapshot', 'transform', 'style-dictionary', 'multi-theme',
      //           'sync', 'sass-theme', 'sass-theme-minified', 'postprocess'
      // Use 'multi-theme' for config-driven theme builds instead of 'style-dictionary'
      steps: ['validate', 'snapshot', 'transform', 'multi-theme', 'sync'],

      // Sync paths (match sd.config.mjs output paths)
      paths: {
        syncSource: 'src/generated/tokens.js',
        syncTarget: 'src/tokens-flat.ts',
      },
    },

    // =========================================================================
    // NEW: Multi-Theme Configuration (TASK-126)
    // =========================================================================
    // Config-driven theme definitions for multi-theme token builds
    themes: {
      enabled: true,
      default: 'light',
      autoDetect: true,
      ignoreModes: [],
      selectorPattern: {
        default: ':root',
        others: '[data-dsai-theme="{mode}"]',
      },
      // Theme definitions - replaces hardcoded THEMES in build-tokens.mjs
      definitions: {
        light: {
          isDefault: true,
          suffix: null,
          selector: ':root',
          outputFiles: {
            css: 'tokens.css',
            scss: '_variables.scss',
            js: 'tokens.js',
            ts: 'tokens.d.ts',
            json: 'tokens.json',
          },
        },
        dark: {
          isDefault: false,
          suffix: '-dark',
          selector: '[data-dsai-theme="dark"]',
          mediaQuery: '(prefers-color-scheme: dark)',
          outputFiles: {
            css: 'tokens-dark.css',
            scss: '_variables-dark.scss',
          },
        },
      },
    },
  },

  // =========================================================================
  // NEW: Changelog Configuration (TASK-124)
  // =========================================================================
  // Configure automatic changelog generation from token changes
  changelog: {
    enabled: true, // Enable automatic changelog generation
    outputPath: 'TOKENS-CHANGELOG.md', // Where to write the changelog
    includeDescriptions: true, // Include token descriptions in changelog
    includeValues: true, // Show before/after values
    groupByType: true, // Group changes by token type (color, spacing, etc.)
  },
});
