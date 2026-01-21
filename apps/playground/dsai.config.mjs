/**
 * DSAI Configuration for Playground App
 *
 * ══════════════════════════════════════════════════════════════════════════════
 * COMPREHENSIVE DEMO CONFIG - Shows ALL available configuration options
 * ══════════════════════════════════════════════════════════════════════════════
 *
 * This configuration demonstrates every available option in @dsai-io/tools.
 * Use this as a reference when setting up your own project.
 *
 * @see https://github.com/michelve/dsai/tree/main/packages/@dsai-io/tools
 */

import { defineConfig } from '@dsai-io/tools';

export default defineConfig({
  // ═══════════════════════════════════════════════════════════════════════════
  // $schema - JSON Schema for IDE support (intellisense, validation)
  // ═══════════════════════════════════════════════════════════════════════════
  // $schema: './node_modules/@dsai-io/tools/schema.json',

  // ═══════════════════════════════════════════════════════════════════════════
  // extends - Extend from other config files (for monorepos, shared configs)
  // ═══════════════════════════════════════════════════════════════════════════
  // extends: ['./base.config.mjs', '@dsai-io/config-preset'],

  // ═══════════════════════════════════════════════════════════════════════════
  // GLOBAL CONFIGURATION
  // Settings that apply across all features
  // ═══════════════════════════════════════════════════════════════════════════
  global: {
    // Working directory (defaults to process.cwd())
    cwd: process.cwd(),

    // Enable debug logging for troubleshooting
    debug: process.env['DEBUG'] === 'true',

    // Log verbosity: 'silent' | 'error' | 'warn' | 'info' | 'debug' | 'verbose'
    logLevel: process.env['LOG_LEVEL'] ?? 'info',

    // Enable colored output in terminal (auto-detected in CI)
    colors: true,

    // CI mode - auto-detected from environment (CI, GITHUB_ACTIONS, etc.)
    ci: false,

    // Dry run mode - don't write any files, just show what would happen
    dryRun: false,

    // Explicit config file path (optional)
    // configPath: './custom.config.mjs',

    // Frontend framework hint for generated code
    // Options: 'react' | 'vue' | 'angular' | 'svelte' | 'vanilla'
    framework: 'react',

    // Global build configuration
    build: {
      outDir: 'dist', // Default output directory
      clean: true, // Clean output directory before build
      sourcemap: false, // Generate source maps
      minify: true, // Minify output files
      parallel: true, // Run builds in parallel
      maxConcurrency: 4, // Max parallel builds
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // TOKEN CONFIGURATION
  // Design token processing, transformation, and output
  // ═══════════════════════════════════════════════════════════════════════════
  tokens: {
    // ─────────────────────────────────────────────────────────────────────────
    // Source Configuration
    // ─────────────────────────────────────────────────────────────────────────

    // Source type - 'theme' uses theme.json, 'collections' uses individual files
    source: 'theme',

    // Directory for raw Figma exports (theme.json or foundation.json, etc.)
    sourceDir: './src/figma-exports',

    // Base directory for processed collections (transform outputs to ./collections/ subdirs)
    collectionsDir: './src',

    // File patterns for finding token files
    sourcePatterns: ['theme.json', 'tokens.json', '*.tokens.json'],

    // Map collection names to specific file paths (for custom structures)
    collectionMapping: {
      // colors: './src/tokens/colors.json',
      // typography: './src/tokens/typography.json',
    },

    // ─────────────────────────────────────────────────────────────────────────
    // Output Configuration
    // ─────────────────────────────────────────────────────────────────────────

    // Output directory for generated files (CSS, SCSS, JS, TS)
    outputDir: './src/generated',

    // Per-format output directories (overrides outputDir for specific formats)
    outputDirs: {
      css: './src/generated/css',
      scss: './src/generated/scss',
      js: './src/generated/js',
      ts: './src/generated/ts',
      json: './src/generated/json',
      // android: './src/generated/android',
      // ios: './src/generated/ios',
    },

    // Per-format output file names
    outputFileNames: {
      css: 'tokens.css',
      scss: '_tokens.scss',
      js: 'tokens.js',
      ts: 'tokens.ts',
      json: 'tokens.json',
      android: 'tokens.xml',
      ios: 'tokens.h',
    },

    // CSS variable prefix (e.g., --dsai-color-blue-500)
    prefix: '--dsai-',

    // Output formats to generate
    // Options: 'css' | 'scss' | 'less' | 'json' | 'js' | 'ts' | 'esm' | 'cjs'
    formats: ['css', 'scss', 'js', 'ts', 'json'],

    // ─────────────────────────────────────────────────────────────────────────
    // Build Options
    // ─────────────────────────────────────────────────────────────────────────

    // Base font size for rem calculations
    baseFontSize: 16,

    // Output references in generated files (uses CSS var() functions)
    outputReferences: true,

    // Generate separate files per theme (tokens.css, tokens-dark.css, etc.)
    separateThemeFiles: true,

    // Enable watch mode for development
    watch: false,

    // Additional directories to watch (beyond sourceDir)
    watchDirectories: [],

    // Verbose logging during build
    verbose: true,

    // ─────────────────────────────────────────────────────────────────────────
    // Cache Configuration (TASK-122: Incremental Builds)
    // SHA-256 content hashing for 10-100x faster incremental builds
    // ─────────────────────────────────────────────────────────────────────────
    cache: {
      enabled: true, // Enable incremental builds with SHA-256 caching
      directory: '.dsai-cache', // Cache directory (relative to config file)
      hashType: 'content', // Hash strategy: 'content' | 'timestamp' | 'version' | 'none'
      maxAge: 86400000, // Cache expiration (24 hours in milliseconds)
    },

    // ─────────────────────────────────────────────────────────────────────────
    // Snapshot Configuration (TASK-119: Error Recovery)
    // Automatic snapshots for version rollback
    // ─────────────────────────────────────────────────────────────────────────
    snapshot: {
      enabled: true, // Enable automatic snapshots before builds
      directory: '.snapshots', // Snapshot directory
      maxSnapshots: 10, // Keep last 10 snapshots
      include: ['**/*.json'], // File patterns to snapshot
      exclude: ['node_modules/**', '.git/**'], // Patterns to exclude
    },

    // ─────────────────────────────────────────────────────────────────────────
    // Circuit Breaker Configuration
    // API resilience for external services (Figma API, etc.)
    // ─────────────────────────────────────────────────────────────────────────
    circuitBreaker: {
      enabled: true, // Enable circuit breaker for external APIs
      threshold: 5, // Open circuit after 5 consecutive failures
      timeout: 30000, // Request timeout (30 seconds)
      resetTimeout: 60000, // Time to wait before retry (60 seconds)
    },

    // ─────────────────────────────────────────────────────────────────────────
    // Rate Limiter Configuration
    // API protection for external services
    // ─────────────────────────────────────────────────────────────────────────
    rateLimiter: {
      enabled: true, // Enable rate limiting
      maxRequests: 10, // Max requests per window
      windowMs: 60000, // Time window (60 seconds)
    },

    // ─────────────────────────────────────────────────────────────────────────
    // Style Merge Configuration
    // Merge token outputs with custom styles
    // ─────────────────────────────────────────────────────────────────────────

    // Additional SCSS directories to include in the build
    // These will be compiled alongside token-generated SCSS
    additionalScssDirectories: ['./src/scss/custom'],

    // Whether to create bundle files that merge tokens + custom styles
    createBundle: true,

    // ─────────────────────────────────────────────────────────────────────────
    // SCSS/CSS Output Configuration
    // ─────────────────────────────────────────────────────────────────────────
    scss: {
      // Generate both expanded (readable) and compressed (minified) output
      outputStyles: ['expanded', 'compressed'],
      // Generate source maps for SCSS compilation
      generateSourceMaps: false,
      // Suffix for minified files (e.g., dsai-theme-bs.min.css)
      minifiedSuffix: '.min',
      // Theme entry point
      themeEntry: 'src/scss/dsai-theme-bs.scss',
      // Utilities entry point
      utilitiesEntry: 'src/scss/dsai-utilities.scss',
      // Output directory for compiled CSS
      cssOutputDir: 'src/generated/css',
      // Additional Sass load paths
      loadPaths: ['node_modules'],
      // Target CSS framework for variable name mapping
      // Options: 'bootstrap' | 'tailwind' | 'material' | 'custom'
      framework: 'bootstrap',
      // Custom token→variable name mappings
      nameMapping: {
        // 'color.primary': 'primary',
        // 'spacing.md': 'spacer',
      },
      // Output path for Bootstrap-compatible SCSS variables
      variablesOutput: 'src/scss/_variables.scss',
    },

    // ─────────────────────────────────────────────────────────────────────────
    // Postprocess Configuration
    // CSS transformations applied after SASS compilation
    // ─────────────────────────────────────────────────────────────────────────
    postprocess: {
      enabled: true,
      // Directory containing CSS files to process (defaults to cssOutputDir)
      cssDir: 'src/generated/css',
      // Files to process (defaults to Bootstrap theme files)
      files: ['dsai-theme-bs.css', 'dsai-theme-bs.min.css'],
      // Text replacements to apply
      replacements: [
        {
          description: 'Theme attribute',
          from: /data-bs-theme/g,
          to: 'data-dsai-theme',
        },
        // Add more replacements as needed:
        // {
        //   description: 'Prefix replacement',
        //   from: /--bs-/g,
        //   to: '--dsai-',
        // },
      ],
    },

    // ─────────────────────────────────────────────────────────────────────────
    // Build Pipeline Configuration
    // Control which steps run and in what order
    // ─────────────────────────────────────────────────────────────────────────
    pipeline: {
      // Pipeline steps to execute (order matters)
      // Available: 'validate' | 'snapshot' | 'preprocess' | 'transform' | 'style-dictionary' |
      //           'multi-theme' | 'sync' | 'sass-theme' | 'sass-theme-minified' |
      //           'sass-utilities' | 'sass-utilities-minified' | 'postprocess' | 'bundle'
      steps: [
        'validate',
        'snapshot',
        'preprocess',
        'transform',
        'multi-theme',
        'sync',
        'sass-theme',
        'sass-theme-minified',
        'postprocess',
      ],

      // Path configuration for build steps
      paths: {
        // Sync step: copy JS tokens to TypeScript
        syncSource: 'src/generated/js/tokens.js',
        syncTarget: 'src/tokens-flat.ts',
        // SCSS theme compilation
        sassThemeInput: 'src/scss/dsai-theme-bs.scss',
        sassThemeOutput: 'src/generated/css/dsai-theme-bs.css',
        sassThemeMinifiedOutput: 'src/generated/css/dsai-theme-bs.min.css',
        // SCSS utilities compilation
        sassUtilitiesInput: 'src/scss/dsai-utilities.scss',
        sassUtilitiesOutput: 'src/generated/css/dsai.css',
        sassUtilitiesMinifiedOutput: 'src/generated/css/dsai.min.css',
      },
    },

    // ─────────────────────────────────────────────────────────────────────────
    // Multi-Theme Configuration (TASK-126: Config-Driven Theme Builds)
    // ─────────────────────────────────────────────────────────────────────────
    themes: {
      enabled: true,
      default: 'light',
      autoDetect: true,
      selectorPattern: {
        default: ':root',
        others: '[data-dsai-theme="{mode}"]',
      },
      // Theme definitions
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
          // Auto-switch via media query (respects user OS preference)
          mediaQuery: '(prefers-color-scheme: dark)',
          // Data attribute for manual switching
          dataAttribute: 'data-dsai-theme',
          outputFiles: {
            css: 'tokens-dark.css',
            scss: '_variables-dark.scss',
          },
        },
        // Add more themes as needed:
        // highContrast: {
        //   isDefault: false,
        //   suffix: '-high-contrast',
        //   selector: '[data-dsai-theme="high-contrast"]',
        //   mediaQuery: '(prefers-contrast: high)',
        // },
      },
    },

    // ─────────────────────────────────────────────────────────────────────────
    // Custom Transforms
    // Extend Style Dictionary with custom value transformations
    // ─────────────────────────────────────────────────────────────────────────
    transforms: [],
    customTransforms: [
      // Example: Custom transform for color opacity
      // {
      //   name: 'color/opacity',
      //   type: 'value',
      //   filter: (token) => token.type === 'color',
      //   transform: (token) => token.value,
      // },
    ],

    // ─────────────────────────────────────────────────────────────────────────
    // Custom Formats
    // Define custom output formats
    // ─────────────────────────────────────────────────────────────────────────
    customFormats: [
      // Example: Custom format for CSS-in-JS libraries
      // {
      //   name: 'css-in-js',
      //   formatter: ({ dictionary }) => {
      //     return `export const tokens = ${JSON.stringify(dictionary.tokens, null, 2)};`;
      //   },
      // },
    ],

    // ─────────────────────────────────────────────────────────────────────────
    // Preprocessors - Transform token data before processing
    // ─────────────────────────────────────────────────────────────────────────
    preprocessors: [],

    // ─────────────────────────────────────────────────────────────────────────
    // Filters - Filter which tokens are included in output
    // ─────────────────────────────────────────────────────────────────────────
    filters: [],

    // ─────────────────────────────────────────────────────────────────────────
    // Build Hooks - Lifecycle hooks for custom processing
    // ─────────────────────────────────────────────────────────────────────────
    hooks: {
      // onBuildStart: async (config) => { console.log('Build starting...'); return {}; },
      // onFormatComplete: async (format, outputPath, content) => content,
      // onAllFormatsComplete: async (outputs) => {},
      // onBuildComplete: async (summary) => { console.log(`Done in ${summary.duration}ms`); },
      // onError: async (error) => { console.error('Build failed:', error.message); },
    },

    // ─────────────────────────────────────────────────────────────────────────
    // Platform Configuration - Platform-specific build configurations
    // ─────────────────────────────────────────────────────────────────────────
    platforms: {
      // web: { format: 'css', outputDir: 'dist/web', prefix: '--app-', selector: ':root' },
      // ios: { format: 'ios', outputDir: 'dist/ios' },
      // android: { format: 'android', outputDir: 'dist/android' },
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ICONS CONFIGURATION
  // SVG icon processing, optimization, and component generation
  // ═══════════════════════════════════════════════════════════════════════════
  icons: {
    // Enable icon processing
    enabled: true,

    // Source directory for SVG files
    sourceDir: 'assets/icons',

    // Output directory for processed icons
    outputDir: 'dist/icons',

    // Output formats: 'svg' | 'react' | 'vue' | 'sprite' | 'font'
    formats: ['svg', 'react', 'sprite'],

    // Component prefix (e.g., IconHome, IconSettings)
    componentPrefix: 'Icon',

    // Component suffix (e.g., HomeIcon, SettingsIcon with suffix: 'Icon')
    componentSuffix: '',

    // Generate index.ts barrel file
    generateIndex: true,

    // Generate TypeScript type definitions
    generateTypes: true,

    // SVGO optimization settings
    optimization: {
      enabled: true,
      removeComments: true,
      removeDimensions: false, // Keep width/height for sizing
      removeViewBox: false, // Required for scaling
      removeXMLNS: true,
      cleanupIds: true,
      minify: true,
    },

    // SVG sprite generation
    sprite: {
      enabled: true,
      fileName: 'icons', // Output: icons.svg
      format: 'symbol', // 'symbol' | 'stack' | 'css'
      prefix: 'icon-', // Symbol ID prefix
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CHANGELOG CONFIGURATION (TASK-124)
  // Automatic changelog generation from token changes
  // ═══════════════════════════════════════════════════════════════════════════
  changelog: {
    enabled: true, // Enable automatic changelog generation
    outputPath: 'TOKENS-CHANGELOG.md', // Where to write the changelog
    includeDescriptions: true, // Include token descriptions in changelog
    includeValues: true, // Show before/after values
    maxValueLength: 50, // Maximum length for displayed values
    groupByType: true, // Group changes by token type (color, spacing, etc.)
  },
});
