/**
 * Config command
 *
 * Display resolved configuration.
 *
 * @packageDocumentation
 * @module @dsai-io/tools/cli/commands/config
 */

import { Command } from 'commander';

import { loadConfig } from '../../config/index.js';
import { ExitCode } from '../types.js';
import { colors, createLogger, createSpinner } from '../ui/index.js';

import type { ConfigOptions } from '../types.js';

/**
 * Create config command
 *
 * @returns Commander command for config display
 */
export function createConfigCommand(): Command {
  return new Command('config')
    .description('Display resolved configuration')
    .option('--json', 'Output as JSON', false)
    .action(async (options: ConfigOptions, command: Command) => {
      const globalOpts = command.parent?.opts() ?? {};
      const mergedOpts = { ...globalOpts, ...options } as ConfigOptions;

      await runConfig(mergedOpts);
    });
}

/**
 * Run config display
 */
async function runConfig(options: ConfigOptions): Promise<void> {
  const logger = createLogger({
    quiet: options.quiet,
    debug: options.debug,
  });
  const spinner = createSpinner(options.quiet);

  try {
    spinner.start('Loading configuration...');
    const { config, configPath } = await loadConfig({
      cwd: options.cwd,
      configPath: options.config,
    });
    spinner.stop();

    if (options.json) {
      // Output as JSON for machine consumption
      // eslint-disable-next-line no-console
      console.log(JSON.stringify(config, null, 2));
    } else {
      // Human-readable output
      // eslint-disable-next-line no-console
      console.log();
      // eslint-disable-next-line no-console
      console.log(colors.bold('DSAI Configuration'));
       
      const SEPARATOR_WIDTH = 50;
      console.log(colors.muted('─'.repeat(SEPARATOR_WIDTH)));
      // eslint-disable-next-line no-console
      console.log();

      // Config file location
      // eslint-disable-next-line no-console
      console.log(`${colors.label('Config file:')} ${colors.path(configPath ?? 'defaults')}`);
      // eslint-disable-next-line no-console
      console.log();

      // Global settings
      // eslint-disable-next-line no-console
      console.log(colors.bold('Global'));
      // eslint-disable-next-line no-console
      console.log(`  ${colors.muted('Debug:')} ${config.global.debug}`);
      // eslint-disable-next-line no-console
      console.log(`  ${colors.muted('Log level:')} ${config.global.logLevel}`);
      // eslint-disable-next-line no-console
      console.log();

      // Token settings
      // eslint-disable-next-line no-console
      console.log(colors.bold('Tokens'));
      // eslint-disable-next-line no-console
      console.log(`  ${colors.muted('Source:')} ${colors.path(config.tokens.sourceDir)}`);
      // eslint-disable-next-line no-console
      console.log(`  ${colors.muted('Output:')} ${colors.path(config.tokens.outputDir)}`);
      // eslint-disable-next-line no-console
      console.log(`  ${colors.muted('Prefix:')} ${config.tokens.prefix}`);
      // eslint-disable-next-line no-console
      console.log(`  ${colors.muted('Base font size:')} ${config.tokens.baseFontSize}px`);
      // eslint-disable-next-line no-console
      console.log(`  ${colors.muted('Output references:')} ${config.tokens.outputReferences}`);
      // eslint-disable-next-line no-console
      console.log();

      // Icons settings
      // eslint-disable-next-line no-console
      console.log(colors.bold('Icons'));
      // eslint-disable-next-line no-console
      console.log(`  ${colors.muted('Source:')} ${colors.path(config.icons.sourceDir)}`);
      // eslint-disable-next-line no-console
      console.log(`  ${colors.muted('Output:')} ${colors.path(config.icons.outputDir)}`);
      // eslint-disable-next-line no-console
      console.log(`  ${colors.muted('Optimize:')} ${config.icons.optimize}`);
      // eslint-disable-next-line no-console
      console.log();
    }

    process.exit(ExitCode.Success);
  } catch (error) {
    spinner.fail('Failed to load configuration');

    if (error instanceof Error) {
      logger.error(error.message);
    }

    process.exit(ExitCode.ConfigError);
  }
}
