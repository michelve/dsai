/**
 * Icon commands
 *
 * Build and manage icon components.
 *
 * @packageDocumentation
 * @module @dsai/tools/cli/commands/icons
 */

import { Command } from 'commander';

import { loadConfig } from '../../config/index.js';
import { buildIcons } from '../../icons/index.js';
import { ExitCode } from '../types.js';
import { colors, createLogger, createSpinner, formatDuration } from '../ui/index.js';

import type { IconsBuildOptions } from '../types.js';
import type { IconFormat } from '../../icons/types.js';

/**
 * Create icons command group
 *
 * @returns Commander command for icon operations
 */
export function createIconsCommand(): Command {
  const icons = new Command('icons')
    .description('Icon generation operations')
    .addHelpCommand('help [command]', 'Show help for a command');

  // Build command
  icons
    .command('build')
    .description('Generate icon components')
    .option('-f, --format <format>', 'Output format (react|svg|svg-sprite)', 'react')
    .option('--no-optimize', 'Skip SVG optimization')
    .option('-n, --dry-run', 'Preview changes without writing files')
    .action(async (options: IconsBuildOptions & { optimize?: boolean }, command: Command) => {
      const globalOpts = command.parent?.parent?.opts() ?? {};
      const mergedOpts = { ...globalOpts, ...options } as IconsBuildOptions & {
        optimize?: boolean;
      };

      await runIconsBuild(mergedOpts);
    });

  return icons;
}

/**
 * Run icons build
 */
async function runIconsBuild(options: IconsBuildOptions & { optimize?: boolean }): Promise<void> {
  const logger = createLogger({
    quiet: options.quiet,
    debug: options.debug,
  });
  const spinner = createSpinner(options.quiet);

  try {
    // Load configuration
    spinner.start('Loading configuration...');
    const { config, configPath } = await loadConfig({
      cwd: options.cwd,
      configPath: options.config,
    });
    spinner.succeed(`Loaded config from ${colors.path(configPath ?? 'defaults')}`);

    logger.debug(`Icons config: ${JSON.stringify(config.icons, null, 2)}`);

    // Build icons
    const format = (options.format ?? 'react') as IconFormat;
    spinner.start(`Generating ${format} icons...`);

    const result = await buildIcons(config, {
      formats: [format],
      dryRun: options.dryRun,
    });

    if (!result.success) {
      spinner.fail('Icon generation failed');
      for (const error of result.errors) {
        logger.error(`${error.icon}: ${error.message}`);
      }
      process.exit(ExitCode.BuildError);
    }

    // Report warnings
    for (const warning of result.warnings) {
      logger.warn(`${warning.icon}: ${warning.message}`);
    }

    if (result.totalIcons === 0) {
      spinner.warn('No icons found to generate');
      logger.info(`Source: ${colors.path(config.icons.sourceDir)}`);
      process.exit(ExitCode.Success);
    }

    const prefix = options.dryRun ? '[DRY RUN] ' : '';
    spinner.succeed(
      `${prefix}Generated ${colors.value(String(result.totalIcons))} icons in ${colors.value(formatDuration(result.duration))}`
    );

    logger.info(`  Source: ${colors.path(config.icons.sourceDir)}`);
    logger.info(`  Output: ${colors.path(config.icons.outputDir)}`);
    logger.info(`  Format: ${colors.value(format)}`);
    logger.info(`  Files:  ${colors.value(String(result.filesWritten))}`);

    if (result.totalSizeReduction > 0) {
      logger.info(`  Size reduction: ${colors.value(`${result.totalSizeReduction.toFixed(1)}%`)}`);
    }

    process.exit(ExitCode.Success);
  } catch (error) {
    spinner.fail('Icon generation failed');

    if (error instanceof Error) {
      logger.error(error.message);
      if (options.debug) {
        // eslint-disable-next-line no-console
        console.error(error.stack);
      }
    }

    process.exit(ExitCode.GeneralError);
  }
}
