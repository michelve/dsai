/**
 * Init Templates Module
 *
 * Provides template content for different project configurations.
 * Templates are generated dynamically based on project detection and user choices.
 *
 * @packageDocumentation
 * @module @dsai-io/tools/cli/init/templates
 *
 * @remarks
 * Currently supports React framework templates.
 */

import type { Framework, MetaFramework, ProjectInfo } from './detector.js';

// ============================================================================
// Types
// ============================================================================

/**
 * Template generation options
 */
export interface TemplateOptions {
  /** Project info from detection */
  projectInfo: ProjectInfo;
  /** CSS custom property prefix */
  prefix: string;
  /** Output directory for tokens */
  outputDir: string;
  /** Source directory for Figma exports */
  sourceDir: string;
  /** Output formats to generate */
  formats: string[];
  /** Template complexity level */
  template: 'minimal' | 'full' | 'enterprise';
  /** Config file format */
  configFormat: 'mjs' | 'js' | 'ts';
}

/**
 * Generated template result
 */
export interface GeneratedTemplate {
  /** Config file name */
  configFileName: string;
  /** Config file content */
  configContent: string;
  /** Additional files to create */
  additionalFiles: Array<{
    path: string;
    content: string;
  }>;
  /** Directories to create */
  directories: string[];
}

// ============================================================================
// Template Helpers
// ============================================================================

/**
 * Format array for config output
 */
function formatArray(items: string[]): string {
  return items.map((item) => `'${item}'`).join(', ');
}

/**
 * Get framework-specific theme selector pattern
 */
function getThemeSelectorPattern(
  framework: Framework,
  metaFramework: MetaFramework
): { default: string; others: string } {
  // React/Next.js typically use data attributes
  if (framework === 'react' || metaFramework === 'next') {
    return {
      default: ':root',
      others: '[data-theme="{mode}"]',
    };
  }
  // Default pattern
  return {
    default: ':root',
    others: '[data-dsai-theme="{mode}"]',
  };
}

/**
 * Get framework-specific output directory suggestion
 */
export function getFrameworkOutputDir(
  framework: Framework,
  metaFramework: MetaFramework,
  sourceDir?: string
): string {
  // Next.js App Router
  if (metaFramework === 'next') {
    return 'src/styles/tokens';
  }

  // Vite + React
  if (metaFramework === 'vite' && framework === 'react') {
    return 'src/tokens';
  }
  // Default based on source directory
  if (sourceDir) {
    return `${sourceDir}/tokens`;
  }

  return 'dist/tokens';
}

// ============================================================================
// React Templates
// ============================================================================

/**
 * Generate minimal React configuration
 */
function generateReactMinimalConfig(opts: TemplateOptions): string {
  const { prefix, outputDir, sourceDir, formats } = opts;

  return `/**
 * DSAI Tools Configuration
 * React Project - Minimal Setup
 * @see https://github.com/michelve/dsai
 */
import { defineConfig } from '@dsai-io/tools';

export default defineConfig({
  tokens: {
    sourceDir: '${sourceDir}',
    outputDir: '${outputDir}',
    prefix: '${prefix}',
    formats: [${formatArray(formats)}],
  },
});
`;
}

/**
 * Generate full React configuration
 */
function generateReactFullConfig(opts: TemplateOptions): string {
  const { prefix, outputDir, sourceDir, formats, projectInfo } = opts;
  const selectorPattern = getThemeSelectorPattern(projectInfo.framework, projectInfo.metaFramework);

  return `/**
 * DSAI Tools Configuration
 * React Project - Full Setup
 *
 * This configuration includes commonly used options.
 * For all available options, use the 'enterprise' template.
 *
 * @see https://github.com/michelve/dsai
 */
import { defineConfig } from '@dsai-io/tools';

export default defineConfig({
  // Global settings
  global: {
    logLevel: 'info',
    framework: 'react',
  },

  // Token configuration
  tokens: {
    // Enable token processing
    enabled: true,

    // Source type - 'theme' uses theme.json, 'collections' uses individual files
    source: 'theme',

    // Directory for raw Figma exports
    sourceDir: '${sourceDir}',

    // Output directory for generated files
    outputDir: '${outputDir}',

    // CSS variable prefix
    prefix: '${prefix}',

    // Output formats: 'css' | 'scss' | 'less' | 'json' | 'js' | 'ts'
    formats: [${formatArray(formats)}],

    // Base font size for rem calculations
    baseFontSize: 16,

    // Output references in generated files (uses CSS var() functions)
    outputReferences: true,

    // Generate separate files per theme
    separateThemeFiles: false,

    // Create bundled output file
    createBundle: true,
    bundleFileName: 'tokens',

    // Cache configuration
    cache: {
      enabled: true,
      directory: '.cache',
    },
  },

  // Theme configuration
  themes: {
    enabled: true,
    defaultMode: 'light',
    modes: {
      light: {
        selector: '${selectorPattern.default}',
        cssVariables: true,
      },
      dark: {
        selector: '${selectorPattern.others.replace('{mode}', 'dark')}',
        cssVariables: true,
      },
    },
  },

  // Icon configuration (optional - uncomment to enable)
  // icons: {
  //   enabled: true,
  //   sourceDir: 'assets/icons',
  //   outputDir: 'src/components/icons',
  //   formats: ['react', 'svg'],
  //   generateIndex: true,
  //   generateTypes: ${opts.projectInfo.typescript},
  // },
});
`;
}

/**
 * Generate enterprise React configuration
 */
function generateReactEnterpriseConfig(opts: TemplateOptions): string {
  const { prefix, outputDir, sourceDir, formats, projectInfo } = opts;
  const selectorPattern = getThemeSelectorPattern(projectInfo.framework, projectInfo.metaFramework);

  return `/**
 * DSAI Tools Configuration
 * React Project - Enterprise Setup
 *
 * This configuration includes ALL available options for reference.
 * Uncomment and modify options as needed for your project.
 *
 * @see https://github.com/michelve/dsai
 */
import { defineConfig } from '@dsai-io/tools';

export default defineConfig({
  // =========================================================================
  // Global Configuration
  // =========================================================================
  global: {
    // Logging level: 'silent' | 'error' | 'warn' | 'info' | 'debug' | 'verbose'
    logLevel: 'info',

    // Enable colored output
    colors: true,

    // CI mode (disables interactive features)
    ci: false,

    // Dry run mode (no file writes)
    dryRun: false,

    // Framework: 'react' | 'vue' | 'angular' | 'svelte' | 'vanilla'
    framework: 'react',

    // Build configuration
    build: {
      outDir: 'dist',
      clean: true,
      sourcemap: false,
      minify: true,
      parallel: true,
      maxConcurrency: 4,
    },
  },

  // =========================================================================
  // Token Configuration
  // =========================================================================
  tokens: {
    // Enable token processing
    enabled: true,

    // Source type - 'theme' uses theme.json, 'collections' uses individual files
    source: 'theme',

    // Directory for raw Figma exports (theme.json or foundation.json, etc.)
    sourceDir: '${sourceDir}',

    // Base directory for processed collections
    collectionsDir: 'collections',

    // Output directory for generated files
    outputDir: '${outputDir}',

    // CSS variable prefix (e.g., ${prefix}color-blue-500)
    prefix: '${prefix}',

    // Output formats to generate: 'css' | 'scss' | 'less' | 'json' | 'js' | 'ts' | 'esm' | 'cjs'
    formats: [${formatArray(formats)}],

    // Base font size for rem calculations
    baseFontSize: 16,

    // Output references in generated files (uses CSS var() functions)
    outputReferences: true,

    // Generate separate files per theme
    separateThemeFiles: true,

    // Create bundled output file
    createBundle: true,
    bundleFileName: 'bundle',

    // Merge order for token layers
    mergeOrder: ['base', 'semantic', 'component'],

    // Additional SCSS directories to process
    additionalScssDirectories: [],

    // Output directory structure per format
    // outputDirsByFormat: {
    //   css: 'dist/css',
    //   scss: 'dist/scss',
    //   less: 'dist/less',
    //   js: 'dist/js',
    //   ts: 'dist/ts',
    //   json: 'dist/json',
    // },

    // SCSS file names
    // scssFileNames: {
    //   variables: 'variables',
    //   utilities: 'utilities',
    //   mixins: 'mixins',
    //   tokens: 'tokens',
    // },

    // Custom transforms
    // transforms: [],
    // customTransforms: [
    //   {
    //     name: 'custom-transform',
    //     type: 'value',
    //     transformer: (token) => token.value,
    //   },
    // ],

    // Custom formats
    // customFormats: [
    //   {
    //     name: 'custom-format',
    //     extension: '.custom',
    //     formatter: (dictionary) => '/* custom output */',
    //   },
    // ],

    // Cache configuration
    cache: {
      enabled: true,
      directory: '.cache',
      maxAge: 86400000, // 24 hours
    },

    // Watch mode configuration
    watch: {
      enabled: false,
      debounce: 300,
      clearScreen: true,
      ignorePatterns: ['node_modules/**', 'dist/**'],
    },

    // Verbose output
    verbose: false,
  },

  // =========================================================================
  // Theme Configuration
  // =========================================================================
  themes: {
    enabled: true,
    defaultMode: 'light',
    outputFileName: 'themes',

    // Theme mode definitions
    modes: {
      light: {
        selector: '${selectorPattern.default}',
        cssVariables: true,
        generateSeparateFiles: false,
      },
      dark: {
        selector: '${selectorPattern.others.replace('{mode}', 'dark')}',
        // Optional: use media query instead of/in addition to selector
        // mediaQuery: '(prefers-color-scheme: dark)',
        cssVariables: true,
        generateSeparateFiles: false,
      },
    },

    // Default fallback colors (optional)
    // defaultColors: {
    //   light: '#ffffff',
    //   dark: '#1a1a1a',
    // },
  },

  // =========================================================================
  // Icon Configuration
  // =========================================================================
  icons: {
    enabled: true,

    // Source directory for SVG icons
    sourceDir: 'assets/icons',

    // Output directory for generated icons
    outputDir: 'src/components/icons',

    // Output formats: 'svg' | 'react' | 'vue' | 'sprite' | 'font'
    formats: ['react', 'svg'],

    // React component naming
    componentPrefix: 'Icon',
    componentSuffix: '',

    // Generate index file for imports
    generateIndex: true,

    // Generate TypeScript types
    generateTypes: ${opts.projectInfo.typescript},

    // SVG optimization
    optimization: {
      enabled: true,
      removeComments: true,
      removeDimensions: false,
      removeViewBox: false,
      removeXMLNS: true,
      cleanupIds: true,
      minify: true,
    },

    // Sprite generation
    sprite: {
      enabled: true,
      fileName: 'icons',
      format: 'symbol',
      prefix: 'icon-',
    },
  },
});
`;
}

// ============================================================================
// Next.js Templates
// ============================================================================

/**
 * Generate Next.js specific configuration
 */
function generateNextJsConfig(opts: TemplateOptions): string {
  const { prefix, outputDir, sourceDir, formats, template } = opts;

  if (template === 'minimal') {
    return `/**
 * DSAI Tools Configuration
 * Next.js Project - Minimal Setup
 * @see https://github.com/michelve/dsai
 */
import { defineConfig } from '@dsai-io/tools';

export default defineConfig({
  tokens: {
    sourceDir: '${sourceDir}',
    outputDir: '${outputDir}',
    prefix: '${prefix}',
    formats: [${formatArray(formats)}],
  },
});
`;
  }

  return `/**
 * DSAI Tools Configuration
 * Next.js Project
 * @see https://github.com/michelve/dsai
 */
import { defineConfig } from '@dsai-io/tools';

export default defineConfig({
  tokens: {
    // Source configuration
    source: 'theme',
    sourceDir: '${sourceDir}',

    // Output configuration - Next.js App Router structure
    outputDir: '${outputDir}',
    prefix: '${prefix}',
    formats: [${formatArray(formats)}],

    // Build options
    baseFontSize: 16,
    outputReferences: true,
    separateThemeFiles: false,

    // Theme configuration for Next.js
    themes: {
      autoDetect: true,
      default: 'Light',
      selectorPattern: {
        // Works with next-themes or custom theme providers
        default: ':root',
        others: '[data-theme="{mode}"]',
      },
    },
  },

  icons: {
    sourceDir: 'icons',
    outputDir: 'src/components/icons',
    framework: 'react',
    typescript: true,
    optimize: true,
    prefix: 'Icon',
    exportIndex: true,
  },
});
`;
}

// ============================================================================
// Vanilla/Generic Templates
// ============================================================================

/**
 * Generate vanilla/generic configuration
 */
function generateVanillaConfig(opts: TemplateOptions): string {
  const { prefix, outputDir, sourceDir, formats, template } = opts;

  if (template === 'minimal') {
    return `/**
 * DSAI Tools Configuration
 * @see https://github.com/michelve/dsai
 */
import { defineConfig } from '@dsai-io/tools';

export default defineConfig({
  tokens: {
    sourceDir: '${sourceDir}',
    outputDir: '${outputDir}',
    prefix: '${prefix}',
    formats: [${formatArray(formats)}],
  },
});
`;
  }

  return `/**
 * DSAI Tools Configuration
 * @see https://github.com/michelve/dsai
 */
import { defineConfig } from '@dsai-io/tools';

export default defineConfig({
  tokens: {
    // Source configuration
    source: 'theme',
    sourceDir: '${sourceDir}',

    // Output configuration
    outputDir: '${outputDir}',
    prefix: '${prefix}',
    formats: [${formatArray(formats)}],

    // Build options
    baseFontSize: 16,
    outputReferences: true,
    separateThemeFiles: false,

    // Theme configuration
    themes: {
      autoDetect: true,
      default: 'Light',
      selectorPattern: {
        default: ':root',
        others: '[data-dsai-theme="{mode}"]',
      },
    },
  },
});
`;
}

// ============================================================================
// Additional Files
// ============================================================================

// ============================================================================
// Figma Configuration Templates
// ============================================================================

/**
 * Generate Figma configuration file content
 *
 * This creates a figma.config.mjs file for users who want Figma API integration.
 * Requires @dsai-io/figma-tokens package.
 */
export function generateFigmaConfig(options: {
  outputDir: string;
  tokensDir: string;
  format: 'dtcg' | 'tokens-studio' | 'style-dictionary';
}): string {
  const { outputDir, tokensDir, format } = options;

  return `/**
 * Figma Integration Configuration
 *
 * This configuration enables direct token export from Figma API.
 *
 * PREREQUISITES:
 * 1. Create a Figma Personal Access Token at:
 *    https://www.figma.com/developers/api#access-tokens
 * 2. Set your token as an environment variable:
 *    export FIGMA_TOKEN="your-figma-token-here"
 *
 * USAGE:
 *   node figma.config.mjs export    # Export tokens from Figma
 *   node figma.config.mjs sync      # Sync tokens with Figma
 *   node figma.config.mjs info      # Show Figma file info
 *
 * @see https://github.com/michelve/dsai/tree/main/packages/@dsai-io/figma-tokens
 */

import {
  createFigmaClientFromEnv,
  transformTokens,
  validateFigmaExports,
  buildTokens,
} from '@dsai-io/figma-tokens';

// =============================================================================
// Configuration
// =============================================================================

/**
 * Figma file configuration
 *
 * To find your file key, open your Figma file and look at the URL:
 * https://www.figma.com/file/ABC123xyz/My-Design-System
 *                            ^^^^^^^^^^^
 *                            This is your file key
 */
const FIGMA_CONFIG = {
  // Your Figma file key (from the URL)
  fileKey: process.env['FIGMA_FILE_KEY'] ?? 'YOUR_FIGMA_FILE_KEY_HERE',

  // Output directory for exported tokens
  outputDir: '${outputDir}',

  // Tokens package directory (for sync operations)
  tokensDir: '${tokensDir}',

  // Export options
  exportOptions: {
    // Output format: 'dtcg' (W3C standard), 'tokens-studio', or 'style-dictionary'
    format: '${format}',

    // Include token descriptions from Figma
    includeDescriptions: true,

    // Resolve aliases to actual values (false keeps references like {colors.primary})
    resolveAliases: false,

    // Group output files by collection
    groupByCollection: true,

    // Output structure:
    // - 'separate': One file per mode
    // - 'combined': Single file with all modes
    outputStructure: 'combined',

    // Filter specific collections (empty = all)
    collections: [],

    // Filter specific modes (empty = all)
    modes: [],
  },
};

// =============================================================================
// Logger Utility
// =============================================================================

/**
 * Log levels for CLI output
 */
const LOG_LEVELS = Object.freeze({
  info: '[INFO]',
  warn: '[WARN]',
  error: '[ERROR]',
  success: '[SUCCESS]',
});

/**
 * Format elapsed time for display
 */
function formatElapsed(startTime) {
  const elapsed = Date.now() - startTime;
  if (elapsed < 1000) {
    return \`\${elapsed}ms\`;
  }
  return \`\${(elapsed / 1000).toFixed(2)}s\`;
}

/**
 * Get the log prefix for a given level
 */
function getLogPrefix(level) {
  switch (level) {
    case 'warn':
      return LOG_LEVELS.warn;
    case 'error':
      return LOG_LEVELS.error;
    case 'success':
      return LOG_LEVELS.success;
    default:
      return LOG_LEVELS.info;
  }
}

/**
 * Logger for CLI output
 */
function log(message, level = 'info') {
  const timestamp = new Date().toISOString();
  const prefix = getLogPrefix(level);
  console.log(\`\${timestamp} \${prefix} \${message}\`);
}

/**
 * Print plain text output
 */
function print(text) {
  console.log(text);
}

// =============================================================================
// Commands
// =============================================================================

const command = process.argv[2];

/**
 * Validate environment configuration
 */
function validateEnvironment() {
  const errors = [];

  if (!process.env['FIGMA_TOKEN']) {
    errors.push('FIGMA_TOKEN environment variable is required');
  }

  if (FIGMA_CONFIG.fileKey === 'YOUR_FIGMA_FILE_KEY_HERE' || !FIGMA_CONFIG.fileKey) {
    errors.push('FIGMA_FILE_KEY environment variable or config fileKey must be set');
  }

  if (errors.length > 0) {
    log('Configuration validation failed:', 'error');
    for (const error of errors) {
      print(\`  - \${error}\`);
    }
    print('\\nTo configure Figma integration:');
    print('  1. Create a Figma Personal Access Token at:');
    print('     https://www.figma.com/developers/api#access-tokens');
    print('  2. Set environment variables in .env:');
    print('     FIGMA_TOKEN=your-token-here');
    print('     FIGMA_FILE_KEY=your-file-key-here');
    process.exit(1);
  }
}

/**
 * Display usage information
 */
function showUsage() {
  print('Usage: node figma.config.mjs <command>');
  print('');
  print('Commands:');
  print('  export    Export design tokens from Figma');
  print('  sync      Sync tokens between Figma and local files');
  print('  info      Display Figma file information');
  print('');
  print('Environment Variables:');
  print('  FIGMA_TOKEN      Your Figma Personal Access Token');
  print('  FIGMA_FILE_KEY   The Figma file key (from URL)');
}

/**
 * Main entry point
 */
async function main() {
  print('\\nDSAI Figma Integration\\n');

  switch (command) {
    case 'export':
      await exportTokens();
      break;
    case 'sync':
      await syncTokens();
      break;
    case 'info':
      await showInfo();
      break;
    default:
      showUsage();
      process.exit(0);
  }
}

/**
 * Export design tokens from Figma
 */
async function exportTokens() {
  validateEnvironment();

  const startTime = Date.now();
  log('Starting token export from Figma');
  log(\`File Key: \${FIGMA_CONFIG.fileKey}\`);
  log(\`Output Directory: \${FIGMA_CONFIG.outputDir}\`);
  log(\`Format: \${FIGMA_CONFIG.exportOptions.format}\`);

  try {
    const client = createFigmaClientFromEnv();

    log('Fetching variables from Figma API...');
    const variables = await client.getLocalVariables(FIGMA_CONFIG.fileKey);

    log(\`Retrieved \${Object.keys(variables.meta.variables).length} variables\`);
    log(\`Collections: \${Object.keys(variables.meta.variableCollections).length}\`);

    log('Transforming tokens...');
    const tokens = await transformTokens(variables, {
      format: FIGMA_CONFIG.exportOptions.format,
      includeDescriptions: FIGMA_CONFIG.exportOptions.includeDescriptions,
      resolveAliases: FIGMA_CONFIG.exportOptions.resolveAliases,
      groupByCollection: FIGMA_CONFIG.exportOptions.groupByCollection,
      collections: FIGMA_CONFIG.exportOptions.collections,
      modes: FIGMA_CONFIG.exportOptions.modes,
    });

    log('Validating token structure...');
    const validationResult = validateFigmaExports(tokens);

    if (!validationResult.valid) {
      log('Validation warnings found:', 'warn');
      for (const error of validationResult.errors) {
        print(\`  - \${error}\`);
      }
    }

    log('Building output files...');
    await buildTokens({
      tokens,
      outputDir: FIGMA_CONFIG.outputDir,
      outputStructure: FIGMA_CONFIG.exportOptions.outputStructure,
      groupByCollection: FIGMA_CONFIG.exportOptions.groupByCollection,
    });

    log(\`Export completed in \${formatElapsed(startTime)}\`, 'success');
    log(\`Output written to: \${FIGMA_CONFIG.outputDir}\`);
  } catch (error) {
    log(\`Export failed: \${error.message}\`, 'error');
    if (error.response?.status === 403) {
      log('Access denied. Check your FIGMA_TOKEN has the required permissions.', 'error');
    } else if (error.response?.status === 404) {
      log('File not found. Check your FIGMA_FILE_KEY is correct.', 'error');
    }
    process.exit(1);
  }
}

/**
 * Sync tokens between Figma and local files
 */
async function syncTokens() {
  validateEnvironment();

  const startTime = Date.now();
  log('Starting token sync');
  log(\`Tokens Directory: \${FIGMA_CONFIG.tokensDir}\`);

  try {
    const client = createFigmaClientFromEnv();

    log('Fetching current Figma variables...');
    const remoteVariables = await client.getLocalVariables(FIGMA_CONFIG.fileKey);

    log('Comparing with local tokens...');
    const localTokens = await transformTokens(remoteVariables, {
      format: FIGMA_CONFIG.exportOptions.format,
    });

    await buildTokens({
      tokens: localTokens,
      outputDir: FIGMA_CONFIG.tokensDir,
      outputStructure: 'combined',
    });

    log(\`Sync completed in \${formatElapsed(startTime)}\`, 'success');
  } catch (error) {
    log(\`Sync failed: \${error.message}\`, 'error');
    process.exit(1);
  }
}

/**
 * Display Figma file information
 */
async function showInfo() {
  validateEnvironment();

  log('Fetching Figma file information...');

  try {
    const client = createFigmaClientFromEnv();

    const file = await client.getFile(FIGMA_CONFIG.fileKey);
    const variables = await client.getLocalVariables(FIGMA_CONFIG.fileKey);

    print('\\nFigma File Information');
    print('='.repeat(50));
    print(\`Name: \${file.name}\`);
    print(\`Last Modified: \${file.lastModified}\`);
    print(\`Version: \${file.version}\`);

    print('\\nVariable Collections');
    print('-'.repeat(50));

    const collections = Object.values(variables.meta.variableCollections);
    for (const collection of collections) {
      const variableCount = collection.variableIds.length;
      const modeCount = collection.modes.length;
      print(\`\${collection.name}: \${variableCount} variables, \${modeCount} modes\`);
      for (const mode of collection.modes) {
        print(\`  - \${mode.name}\`);
      }
    }

    print('\\nSummary');
    print('-'.repeat(50));
    print(\`Total Collections: \${collections.length}\`);
    print(\`Total Variables: \${Object.keys(variables.meta.variables).length}\`);

    let totalModes = 0;
    for (const c of collections) {
      totalModes += c.modes.length;
    }
    print(\`Total Modes: \${totalModes}\`);

  } catch (error) {
    log(\`Failed to fetch file info: \${error.message}\`, 'error');
    process.exit(1);
  }
}

main().catch((error) => {
  log(\`Unexpected error: \${error.message}\`, 'error');
  process.exit(1);
});
`;
}

// ============================================================================
// Style Dictionary Config Template
// ============================================================================

/**
 * Generate Style Dictionary configuration file
 *
 * For projects that want to use Style Dictionary directly for advanced builds.
 */
export function generateStyleDictionaryConfig(options: {
  sourceDir: string;
  outputDir: string;
  prefix: string;
  outputReferences: boolean;
}): string {
  const { sourceDir, outputDir, prefix, outputReferences } = options;

  return `/**
 * Style Dictionary Configuration
 *
 * Advanced token build configuration using Style Dictionary.
 *
 * WORKFLOW:
 * 1. Export tokens from Figma to: ${sourceDir}/
 * 2. Run: pnpm tokens:transform  (converts to DTCG format)
 * 3. Run: pnpm tokens:build      (this config)
 * 4. Generated files appear in: ${outputDir}/
 *
 * @see https://styledictionary.com/
 */

import { registerAll } from '@dsai-io/tools/tokens';
import { globSync } from 'glob';
import StyleDictionary from 'style-dictionary';

// Register DSAi custom transforms, formats, and preprocessors
registerAll(StyleDictionary);

// Find all token files
const sourceFiles = globSync('${sourceDir}/**/*.json');

export default {
  log: {
    verbosity: 'default',
    warnings: 'warn',
    errors: 'error',
  },

  // Preprocessing to fix reference paths
  preprocessors: ['fix-references'],

  // Source token files
  source: sourceFiles.length > 0 ? sourceFiles : ['${sourceDir}/**/*.json'],

  // Output platforms
  platforms: {
    // CSS Custom Properties
    css: {
      transformGroup: 'custom/css',
      buildPath: '${outputDir}/',
      files: [
        {
          destination: 'tokens.css',
          format: 'css/variables-with-comments',
          options: {
            prefix: '${prefix}',
            outputReferences: ${outputReferences},
          },
        },
      ],
    },

    // SCSS Variables
    scss: {
      transformGroup: 'custom/scss',
      buildPath: '${outputDir}/',
      files: [
        {
          destination: '_variables.scss',
          format: 'scss/variables',
          options: {
            outputReferences: ${outputReferences},
            basePxFontSize: 16,
          },
        },
      ],
    },

    // JavaScript/ES6
    js: {
      transformGroup: 'js-custom',
      buildPath: '${outputDir}/',
      files: [
        {
          destination: 'tokens.js',
          format: 'javascript/es6',
        },
      ],
    },

    // TypeScript
    ts: {
      transformGroup: 'js-custom',
      buildPath: '${outputDir}/',
      files: [
        {
          destination: 'tokens.d.ts',
          format: 'typescript/es6-declarations',
        },
      ],
    },

    // JSON (for design tool integration)
    json: {
      transformGroup: 'custom/css',
      buildPath: '${outputDir}/',
      files: [
        {
          destination: 'tokens.json',
          format: 'json/nested',
        },
      ],
    },
  },
};
`;
}

// ============================================================================
// Build Script Template
// ============================================================================

/**
 * Generate build-tokens.mjs script for multi-theme support
 */
export function generateBuildTokensScript(options: {
  sourceDir: string;
  outputDir: string;
  prefix: string;
  themes: string[];
}): string {
  const { sourceDir, outputDir, prefix, themes } = options;
  const themeList = themes.length > 0 ? themes : ['light', 'dark'];

  return `/**
 * Style Dictionary Build Script
 *
 * Builds design tokens with multi-theme support.
 *
 * SUPPORTED THEMES:
${themeList.map((t) => ` * - ${t}${t === 'light' ? ' (default, applied to :root)' : ''}`).join('\n')}
 *
 * @see https://styledictionary.com/
 */

import { registerAll } from '@dsai-io/tools/tokens';
import { globSync } from 'glob';
import StyleDictionary from 'style-dictionary';

// Register DSAi custom transforms
registerAll(StyleDictionary);

/**
 * Theme configuration
 */
const THEMES = {
  light: {
    suffix: null,
    selector: ':root',
    cssFile: 'tokens.css',
    scssFile: '_variables.scss',
    isDefault: true,
  },
  dark: {
    suffix: '-dark',
    selector: '[data-dsai-theme="dark"]',
    cssFile: 'tokens-dark.css',
    scssFile: '_variables-dark.scss',
    isDefault: false,
  },
};

/**
 * Get token files for a theme
 */
function getThemeFiles(theme) {
  const config = THEMES[theme];
  if (!config) throw new Error(\`Unknown theme: \${theme}\`);

  if (config.isDefault) {
    const themeSuffixes = Object.values(THEMES)
      .filter((t) => t.suffix)
      .map((t) => \`**/*\${t.suffix}.json\`);
    return globSync('${sourceDir}/**/*.json', {
      ignore: themeSuffixes.map((s) => \`${sourceDir}/\${s}\`),
    });
  }

  return globSync(\`${sourceDir}/**/*\${config.suffix}.json\`);
}

/**
 * Build theme
 */
async function buildTheme(theme) {
  const config = THEMES[theme];
  const files = getThemeFiles(theme);

  if (files.length === 0) {
    console.log(\`\\n⏭️  No \${theme} theme tokens found\`);
    return;
  }

  console.log(\`\\n🎨 Building \${theme} theme (\${files.length} files)...\`);

  const sd = new StyleDictionary({
    preprocessors: ['fix-references'],
    source: files,
    platforms: {
      css: {
        transformGroup: 'custom/css',
        buildPath: '${outputDir}/',
        files: [
          {
            destination: config.cssFile,
            format: 'css/variables-with-comments',
            options: {
              prefix: '${prefix}',
              outputReferences: true,
              selector: config.selector,
            },
          },
        ],
      },
      scss: {
        transformGroup: 'custom/scss',
        buildPath: '${outputDir}/',
        files: [
          {
            destination: config.scssFile,
            format: 'scss/variables',
            options: { outputReferences: true },
          },
        ],
      },
    },
  });

  await sd.buildAllPlatforms();
  console.log(\`✅ \${theme} theme complete\`);
}

/**
 * Main build
 */
async function build() {
  console.log('\\n🔨 Building design tokens...\\n');

  for (const theme of Object.keys(THEMES)) {
    await buildTheme(theme);
  }

  console.log('\\n✨ All themes built successfully!\\n');
}

build().catch(console.error);
`;
}

// ============================================================================
// Additional Files
// ============================================================================

/**
 * Generate README for the tokens source directory
 */
export function generateSourceReadme(packageManager: string, framework: Framework): string {
  const runCmd = packageManager === 'npm' ? 'npm run' : packageManager;

  return `# Design Tokens

Place your Figma export files here.

## Expected Structure

After exporting from Figma, you should have a \`theme.json\` file with your design tokens.

\`\`\`
${framework === 'react' ? 'figma-exports' : 'tokens'}/
├── theme.json          # Main token file from Figma
├── collections/        # Optional: Individual collection files
│   ├── colors.json
│   ├── typography.json
│   └── spacing.json
└── README.md           # This file
\`\`\`

## Usage

\`\`\`bash
# Build tokens
${runCmd} tokens:build

# Validate tokens
${runCmd} tokens:validate

# Watch for changes
${runCmd} tokens:watch
\`\`\`

## Integration with React

Import the generated tokens in your app:

\`\`\`tsx
// In your main App.tsx or layout file
import './tokens/tokens.css';

// Or use TypeScript tokens for type-safe access
import { tokens } from './tokens/tokens';
\`\`\`

## Theme Switching

Use data attributes to switch themes:

\`\`\`tsx
// Set theme on document root
document.documentElement.dataset.theme = 'dark';

// Or use a React context/provider
<ThemeProvider theme="dark">
  <App />
</ThemeProvider>
\`\`\`

## Documentation

For more information, visit https://github.com/michelve/dsai
`;
}

/**
 * Generate TypeScript declaration file for tokens
 */
export function generateTokenTypesStub(): string {
  return `/**
 * Design Token Types
 *
 * This file will be auto-generated when you run \`dsai tokens build\`.
 * It provides TypeScript types for your design tokens.
 *
 * @packageDocumentation
 */

// This is a placeholder - actual types will be generated from your tokens
export interface DesignTokens {
  // Your token structure will appear here after build
}

export declare const tokens: DesignTokens;
`;
}

// ============================================================================
// Main Template Generator
// ============================================================================

/**
 * Generate complete template for a project
 *
 * @param options - Template generation options
 * @returns Generated template with config and additional files
 */
export function generateTemplate(options: TemplateOptions): GeneratedTemplate {
  const { projectInfo, template, configFormat, sourceDir, outputDir } = options;
  const { framework, metaFramework, packageManager } = projectInfo;

  // Determine config file name
  const configFileName = `dsai.config.${configFormat}`;

  // Generate config content based on framework
  let configContent: string;

  // Next.js gets special handling
  if (metaFramework === 'next') {
    configContent = generateNextJsConfig(options);
  }
  // React framework
  else if (framework === 'react') {
    switch (template) {
      case 'minimal':
        configContent = generateReactMinimalConfig(options);
        break;
      case 'enterprise':
        configContent = generateReactEnterpriseConfig(options);
        break;
      default:
        configContent = generateReactFullConfig(options);
    }
  } else {
    // Vanilla/unknown frameworks
    configContent = generateVanillaConfig(options);
  }

  // Prepare additional files
  const additionalFiles: GeneratedTemplate['additionalFiles'] = [
    {
      path: `${sourceDir}/README.md`,
      content: generateSourceReadme(packageManager, framework),
    },
  ];

  // Add TypeScript types stub for TS projects
  if (projectInfo.typescript) {
    additionalFiles.push({
      path: `${outputDir}/tokens.d.ts`,
      content: generateTokenTypesStub(),
    });
  }

  // Prepare directories to create
  const directories = [sourceDir, outputDir];

  // Enterprise template gets additional directories
  if (template === 'enterprise') {
    directories.push('collections', 'assets/icons');
  }

  return {
    configFileName,
    configContent,
    additionalFiles,
    directories,
  };
}

/**
 * Check if a framework is fully supported
 */
export function isFrameworkSupported(framework: Framework): boolean {
  return framework === 'react' || framework === 'vanilla' || framework === 'unknown';
}

/**
 * Get framework support message
 */
export function getFrameworkSupportMessage(framework: Framework): string | undefined {
  const comingSoon: Framework[] = ['vue', 'angular', 'svelte', 'solid', 'preact', 'lit'];

  if (comingSoon.includes(framework)) {
    return `Note: ${framework} support is coming soon. Using generic configuration for now.`;
  }

  return undefined;
}
