/**
 * @dsai-io/tools Configuration Template
 *
 * This file provides a starting point for configuring the DSAI tools.
 * Copy this file to your project root and customize as needed.
 *
 * Supported config file names:
 * - dsai.config.mjs (ESM, recommended)
 * - dsai.config.js (CommonJS)
 * - dsai.config.ts (TypeScript)
 * - .dsairc (JSON or YAML)
 * - .dsairc.json
 * - .dsairc.yaml
 * - package.json (under "dsai" key)
 *
 * @type {import('@dsai-io/tools').DsaiConfig}
 */
import { defineConfig } from '@dsai-io/tools';

export default defineConfig({
  // =========================================================================
  // Token Build Configuration
  // =========================================================================
  tokens: {
    // --- Source Configuration ---

    /**
     * Token source type:
     * - 'theme': Use combined theme.json from Figma
     * - 'collections': Use individual collection files
     * - Or provide a custom path to token files
     */
    source: 'theme',

    /**
     * Directory containing Figma export files (relative to this config file)
     */
    sourceDir: 'figma-exports',

    /**
     * Input file patterns for finding token files
     * Customize based on your Figma export naming conventions
     */
    sourcePatterns: ['theme.json', 'tokens.json', '*.tokens.json'],

    // --- Output Configuration ---

    /**
     * Output directory for built tokens (relative to this config file)
     */
    outputDir: 'dist',

    /**
     * Output formats to generate
     * Available: 'css', 'scss', 'js', 'ts', 'json', 'android', 'ios'
     */
    formats: ['css', 'scss', 'js', 'ts', 'json'],

    /**
     * CSS custom property prefix
     */
    prefix: '--dsai-',

    // --- Theme Configuration ---
    themes: {
      /**
       * Auto-detect available modes from Figma export
       */
      autoDetect: true,

      /**
       * Default theme mode (uses :root selector)
       */
      default: 'Light',

      /**
       * Theme selector patterns
       */
      selectorPattern: {
        default: ':root',
        others: '[data-dsai-theme="{mode}"]',
      },
    },

    // --- Build Options ---

    /**
     * Include token references in output (for debugging)
     */
    outputReferences: true,

    /**
     * Base font size for px to rem conversion
     */
    baseFontSize: 16,

    /**
     * Generate separate files per theme
     */
    separateThemeFiles: false,

    /**
     * Watch source files for changes
     */
    watch: false,

    // --- Style Bundling (Optional) ---

    /**
     * Additional SCSS directories to merge with token output
     */
    // additionalScssDirectories: ['src/styles/overrides'],

    /**
     * Additional CSS directories to merge with token output
     */
    // additionalCssDirectories: ['src/styles/base'],

    /**
     * Whether to create combined bundle files
     */
    // createBundle: false,

    // --- Build Hooks (Advanced) ---

    /**
     * Hook called before token build starts
     */
    // onBuildStart: async (config) => {
    // 	console.log('Starting build with config:', config);
    // 	return undefined; // Return modified config or undefined
    // },

    /**
     * Hook called after each format is generated
     */
    // onFormatComplete: async (format, outputPath, content) => {
    // 	console.log(`Generated ${format} at ${outputPath}`);
    // 	return undefined; // Return modified content or undefined
    // },

    /**
     * Hook called after build completes
     */
    // onBuildComplete: async (summary) => {
    // 	console.log(`Build completed in ${summary.duration}ms`);
    // 	console.log(`Generated ${summary.stats.totalTokens} tokens`);
    // },
  },

  // =========================================================================
  // Icon Generation Configuration
  // =========================================================================
  icons: {
    /**
     * Source directory containing SVG icons
     */
    sourceDir: 'icons',

    /**
     * Output directory for generated icon components
     */
    outputDir: 'src/components/icons',

    /**
     * Target framework for icon components
     * Available: 'react', 'vue', 'svelte', 'angular', 'webcomponent', 'svg'
     */
    framework: 'react',

    /**
     * TypeScript support
     */
    typescript: true,

    /**
     * Optimize SVGs with SVGO before generating components
     */
    optimize: true,

    /**
     * Icon component prefix (e.g., 'Icon' => IconHome)
     */
    prefix: 'Icon',

    /**
     * Icon component suffix (e.g., 'Icon' => HomeIcon)
     */
    // suffix: 'Icon',

    /**
     * Include tree-shakeable index file
     */
    exportIndex: true,

    /**
     * Generate sprite sheet in addition to individual components
     */
    generateSprite: false,
  },

  // =========================================================================
  // Path Aliases Configuration
  // =========================================================================
  aliases: {
    /**
     * Import alias prefix used in tsconfig paths (e.g., "@/", "~/", "@dsai/")
     */
    importAlias: '@/',

    /**
     * Where UI components are installed by `dsai add`
     */
    ui: 'src/components/ui',

    /**
     * Where shared hooks are installed
     */
    hooks: 'src/hooks',

    /**
     * Where utility functions are installed
     */
    utils: 'src/lib/utils',

    /**
     * Where higher-level composed components go
     */
    components: 'src/components',

    /**
     * Where lib files go
     */
    lib: 'src/lib',
  },

  // =========================================================================
  // Component Distribution Configuration
  // =========================================================================
  components: {
    /**
     * Enable component distribution features (shadcn-style `dsai add`)
     */
    enabled: true,

    /**
     * Registry URL or local path for component resolution
     */
    registryUrl: 'https://registry.dsai.dev',

    /**
     * Whether to use TypeScript (.tsx) or JavaScript (.jsx)
     */
    tsx: true,

    /**
     * Overwrite existing files when adding components
     */
    overwrite: false,
  },

  // =========================================================================
  // Global Settings
  // =========================================================================
  global: {
    /**
     * Working directory (defaults to process.cwd())
     */
    // cwd: process.cwd(),

    /**
     * Enable debug logging
     */
    debug: false,

    /**
     * Log level: 'silent', 'error', 'warn', 'info', 'debug'
     */
    logLevel: 'info',
  },
});
