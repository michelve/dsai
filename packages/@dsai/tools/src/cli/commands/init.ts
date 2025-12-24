/**
 * Init command
 *
 * Initialize DSAI configuration.
 *
 * @packageDocumentation
 * @module @dsai/tools/cli/commands/init
 */

/* eslint-disable no-console */
/* eslint-disable security/detect-non-literal-fs-filename */

import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { Command } from 'commander';

import { ExitCode } from '../types.js';
import { colors, createLogger } from '../ui/index.js';

import type { InitOptions } from '../types.js';

// ============================================================================
// Config Templates
// ============================================================================

/**
 * Minimal configuration template
 */
const MINIMAL_CONFIG = `/**
 * DSAI Tools Configuration
 * @see https://github.com/michelve/dsai
 */
import { defineConfig } from '@dsai/tools';

export default defineConfig({
  tokens: {
    prefix: '{{PREFIX}}',
    outputDir: '{{OUTPUT_DIR}}',
  },
});
`;

/**
 * Full configuration template
 */
const FULL_CONFIG = `/**
 * DSAI Tools Configuration
 * @see https://github.com/michelve/dsai
 */
import { defineConfig } from '@dsai/tools';

export default defineConfig({
  tokens: {
    // Source configuration
    source: 'theme',
    sourceDir: 'figma-exports',

    // Output configuration
    outputDir: '{{OUTPUT_DIR}}',
    prefix: '{{PREFIX}}',

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

  icons: {
    sourceDir: 'icons',
    outputDir: 'dist/icons',
    optimize: true,
  },
});
`;

/**
 * Enterprise configuration template
 */
const ENTERPRISE_CONFIG = `/**
 * DSAI Tools Configuration - Enterprise
 * @see https://github.com/michelve/dsai
 */
import { defineConfig } from '@dsai/tools';

export default defineConfig({
  tokens: {
    // Source configuration
    source: 'theme',
    sourceDir: 'figma-exports',
    collectionsDir: 'collections',

    // Output configuration
    outputDir: '{{OUTPUT_DIR}}',
    prefix: '{{PREFIX}}',

    // Build options
    baseFontSize: 16,
    outputReferences: true,
    separateThemeFiles: true,

    // Theme configuration
    themes: {
      autoDetect: true,
      default: 'Light',
      ignoreModes: ['WIP', 'Draft'],
      selectorPattern: {
        default: ':root',
        others: '[data-theme="{mode}"]',
      },
    },

    // Extensibility hooks
    transforms: [
      // Add custom transforms here
    ],
    formats: [
      // Add custom formats here
    ],
    preprocessors: [
      // Add custom preprocessors here
    ],
  },

  icons: {
    sourceDir: 'icons',
    outputDir: 'dist/icons',
    optimize: true,
  },

  global: {
    debug: false,
    logLevel: 'info',
  },
});
`;

// ============================================================================
// Command
// ============================================================================

/**
 * Create init command
 *
 * @returns Commander command for initialization
 */
export function createInitCommand(): Command {
  return new Command('init')
    .description('Initialize DSAI configuration')
    .option('-y, --yes', 'Skip prompts, use defaults', false)
    .option('-t, --template <template>', 'Config template (minimal|full|enterprise)', 'full')
    .action(async (options: InitOptions, command: Command) => {
      const globalOpts = command.parent?.opts() ?? {};
      const mergedOpts = { ...globalOpts, ...options } as InitOptions;

      await runInit(mergedOpts);
    });
}

/**
 * Run init
 */
async function runInit(options: InitOptions): Promise<void> {
  const logger = createLogger({
    quiet: options.quiet,
    debug: options.debug,
  });
  const cwd = options.cwd ?? process.cwd();

  console.log();
  console.log(colors.bold('DSAI Tools Setup'));
  console.log(colors.muted('─'.repeat(30)));
  console.log();

  // Check for existing config
  const configFiles = [
    'dsai.config.mjs',
    'dsai.config.js',
    'dsai.config.json',
    '.dsairc.json',
    '.dsairc',
  ];

  const existingConfig = configFiles.find((f) => existsSync(join(cwd, f)));

  if (existingConfig && !options.yes) {
    console.log(
      `${colors.warning('⚠')} Config file ${colors.path(existingConfig)} already exists.`
    );
    console.log(`  Use ${colors.command('--yes')} to overwrite.`);
    console.log();
    process.exit(ExitCode.Success);
  }

  // Use default values (prompts would require @clack/prompts)
  const template = options.template ?? 'full';
  const prefix = '--dsai-';
  const outputDir = 'dist/tokens';

  // Get template content
  let content: string;
  switch (template) {
    case 'minimal':
      content = MINIMAL_CONFIG;
      break;
    case 'enterprise':
      content = ENTERPRISE_CONFIG;
      break;
    case 'full':
    default:
      content = FULL_CONFIG;
  }

  // Apply substitutions
  content = content.replace(/\{\{PREFIX\}\}/g, prefix).replace(/\{\{OUTPUT_DIR\}\}/g, outputDir);

  // Write config file
  const configPath = join(cwd, 'dsai.config.mjs');

  if (!options.dryRun) {
    try {
      writeFileSync(configPath, content, 'utf-8');
      logger.success(`Created ${colors.path('dsai.config.mjs')}`);
    } catch (error) {
      logger.error(
        `Failed to write config file: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
      process.exit(ExitCode.IOError);
    }
  } else {
    logger.info(`Would create ${colors.path('dsai.config.mjs')} (dry run)`);
  }

  // Create output directory
  const fullOutputDir = join(cwd, outputDir);
  if (!existsSync(fullOutputDir) && !options.dryRun) {
    try {
      mkdirSync(fullOutputDir, { recursive: true });
      logger.success(`Created ${colors.path(outputDir)}/`);
    } catch {
      // Ignore - directory might exist
    }
  }

  // Show next steps
  console.log();
  console.log(colors.bold('Next steps:'));
  console.log();
  console.log(
    `  ${colors.muted('1.')} Edit ${colors.path('dsai.config.mjs')} to customize settings`
  );
  console.log(`  ${colors.muted('2.')} Add your tokens to ${colors.path('collections/')}`);
  console.log(
    `  ${colors.muted('3.')} Run ${colors.command('dsai tokens build')} to generate output`
  );
  console.log();

  logger.success('Setup complete!');

  process.exit(ExitCode.Success);
}
