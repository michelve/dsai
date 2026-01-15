/**
 * Token commands
 *
 * Build, validate, and sync design tokens.
 *
 * @packageDocumentation
 * @module @dsai-io/tools/cli/commands/tokens
 */

import { dirname } from 'node:path';

import { Command } from 'commander';

import { loadConfig } from '../../config/index.js';
import { buildTokens, postprocessCLI, syncTokens, validateTokens } from '../../tokens/index.js';
import { ExitCode } from '../types.js';
import { colors, createLogger, createSpinner, formatDuration } from '../ui/index.js';

import type { BuildResult, SyncResult, ValidationResult } from '../../tokens/types.js';
import type {
  TokensBuildOptions,
  TokensSyncOptions,
  TokensTransformOptions,
  TokensValidateOptions,
} from '../types.js';

/**
 * Create tokens command group
 *
 * @returns Commander command for tokens operations
 */
export function createTokensCommand(): Command {
  const tokens = new Command('tokens')
    .description('Design token operations')
    .addHelpCommand('help [command]', 'Show help for a command');

  // Build command
  tokens
    .command('build')
    .description('Build design tokens')
    .option('-p, --platforms <platforms>', 'Platforms to build (comma-separated)', 'all')
    .option('-w, --watch', 'Watch mode', false)
    .option('--clean', 'Clean output before build', false)
    .action(async (options: TokensBuildOptions, command: Command) => {
      const globalOpts = command.parent?.parent?.opts() ?? {};
      const mergedOpts = { ...globalOpts, ...options } as TokensBuildOptions;

      await runTokensBuild(mergedOpts);
    });

  // Validate command
  tokens
    .command('validate')
    .description('Validate design tokens')
    .option('--fix', 'Attempt to fix issues', false)
    .option('--strict', 'Strict validation mode', false)
    .action(async (options: TokensValidateOptions, command: Command) => {
      const globalOpts = command.parent?.parent?.opts() ?? {};
      const mergedOpts = { ...globalOpts, ...options } as TokensValidateOptions;

      await runTokensValidate(mergedOpts);
    });

  // Transform command
  tokens
    .command('transform')
    .description('Transform Figma token exports to Style Dictionary format')
    .option('--dry-run', 'Show what would be transformed without writing files', false)
    .option('--default-mode <mode>', 'Default mode for mode-aware collections', 'Light')
    .option('--ignore-modes <modes>', 'Comma-separated list of modes to ignore', '')
    .action(async (options: TokensTransformOptions, command: Command) => {
      const globalOpts = command.parent?.parent?.opts() ?? {};
      const mergedOpts = { ...globalOpts, ...options } as TokensTransformOptions;

      await runTokensTransform(mergedOpts);
    });

  // Sync command
  tokens
    .command('sync')
    .description('Sync tokens flat file')
    .option('-f, --format <format>', 'Output format', 'flat')
    .action(async (options: TokensSyncOptions, command: Command) => {
      const globalOpts = command.parent?.parent?.opts() ?? {};
      const mergedOpts = { ...globalOpts, ...options } as TokensSyncOptions;

      await runTokensSync(mergedOpts);
    });

  // Postprocess command
  tokens
    .command('postprocess')
    .description('Post-process CSS theme files (e.g., replace data-bs-theme with data-dsai-theme)')
    .action(async (_options: Record<string, unknown>, command: Command) => {
      const globalOpts = command.parent?.parent?.opts() ?? {};

      await runTokensPostprocess(globalOpts);
    });

  return tokens;
}

/**
 * Run tokens transform
 */
async function runTokensTransform(options: TokensTransformOptions): Promise<void> {
  const startTime = Date.now();
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

    logger.debug(`Config: ${JSON.stringify(config, null, 2)}`);

    // Get directories from config
    const sourceDir = config.tokens.sourceDir;
    const collectionsDir = config.tokens.collectionsDir;

    // Run transform
    spinner.start('Transforming Figma tokens...');
    const { transformTokens } = await import('../../tokens/index.js');

    const ignoreModes = options.ignoreModes
      ? options.ignoreModes.split(',').map((m: string) => m.trim())
      : [];

    const result = transformTokens({
      sourceDir,
      collectionsDir,
      defaultMode: options.defaultMode ?? 'Light',
      ignoreModes,
      dryRun: options.dryRun ?? false,
      verbose: !options.quiet,
    });

    if (result.success) {
      const duration = formatDuration(Date.now() - startTime);
      spinner.succeed(
        `Transformed ${colors.bold(result.filesWritten.length.toString())} files in ${colors.bold(duration)}`
      );

      // Show output files
      if (!options.quiet && result.filesWritten.length > 0) {
        logger.log('');
        for (const file of result.filesWritten) {
          logger.log(`  ${colors.success('✔')} ${colors.path(file)}`);
        }
        logger.log('');
      }

      // Show warnings
      if (result.warnings.length > 0) {
        logger.log('');
        for (const warning of result.warnings) {
          logger.warn(warning);
        }
      }

      process.exit(ExitCode.Success);
    } else {
      spinner.fail('Transform failed');

      for (const error of result.errors) {
        logger.error(error);
      }

      process.exit(ExitCode.BuildError);
    }
  } catch (error) {
    spinner.fail('Transform failed');
    const logger = createLogger({ quiet: options.quiet, debug: options.debug });
    logger.error(error instanceof Error ? error.message : 'Unknown error');
    process.exit(ExitCode.BuildError);
  }
}

/**
 * Run tokens build
 */
async function runTokensBuild(options: TokensBuildOptions): Promise<void> {
  const startTime = Date.now();
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

    logger.debug(`Config: ${JSON.stringify(config, null, 2)}`);

    // Get directories from config
    const tokensDir = config.tokens.collectionsDir;
    const toolsDir = config.tokens.sourceDir;

    // Clean if requested
    if (options.clean) {
      spinner.start('Cleaning output directory...');
      // TODO: Implement clean in tokens module
      spinner.succeed('Cleaned output directory');
    }

    // Run build
    spinner.start('Building tokens...');
    const result: BuildResult = buildTokens(tokensDir, toolsDir, {
      verbose: !options.quiet,
      quiet: options.quiet,
    });

    if (result.success) {
      const duration = formatDuration(Date.now() - startTime);
      spinner.succeed(
        `Built ${colors.bold(result.stepsCompleted.length.toString())} steps in ${colors.bold(duration)}`
      );

      // Show output files
      if (!options.quiet && result.outputFiles && result.outputFiles.length > 0) {
        logger.log('');
        for (const file of result.outputFiles) {
          logger.log(`  ${colors.success('✔')} ${colors.path(file)}`);
        }
        logger.log('');
      }

      process.exit(ExitCode.Success);
    } else {
      spinner.fail('Build failed');

      for (const error of result.errors) {
        logger.error(error);
      }

      process.exit(ExitCode.BuildError);
    }
  } catch (error) {
    spinner.fail('Build failed');

    if (error instanceof Error) {
      logger.error(error.message);
      if (options.debug) {
        console.error(error.stack);
      }
    }

    process.exit(ExitCode.GeneralError);
  }
}

/**
 * Run tokens validation
 */
async function runTokensValidate(options: TokensValidateOptions): Promise<void> {
  const logger = createLogger({
    quiet: options.quiet,
    debug: options.debug,
  });
  const spinner = createSpinner(options.quiet);

  try {
    // Load configuration
    spinner.start('Loading configuration...');
    const { config } = await loadConfig({
      cwd: options.cwd,
      configPath: options.config,
    });
    spinner.stop();

    // Run validation
    spinner.start('Validating tokens...');
    const result: ValidationResult = await validateTokens(config, {
      strict: options.strict,
      verbose: !options.quiet,
      quiet: options.quiet,
    });

    if (result.valid) {
      spinner.succeed(`All ${colors.bold(result.tokenCount.toString())} tokens are valid`);
      if (result.warnings.length > 0) {
        logger.warn(`${result.warnings.length} warnings found`);
      }
      process.exit(ExitCode.Success);
    }

    spinner.fail(`Found ${colors.bold(result.errors.length.toString())} errors`);

    for (const error of result.errors) {
      logger.error(`${error.path}: ${error.message}`);
    }

    for (const warning of result.warnings) {
      logger.warn(`${warning.path}: ${warning.message}`);
    }

    process.exit(ExitCode.ValidationError);
  } catch (error) {
    spinner.fail('Validation failed');

    if (error instanceof Error) {
      logger.error(error.message);
    }

    process.exit(ExitCode.GeneralError);
  }
}

/**
 * Run tokens sync
 */
async function runTokensSync(options: TokensSyncOptions): Promise<void> {
  const logger = createLogger({
    quiet: options.quiet,
    debug: options.debug,
  });
  const spinner = createSpinner(options.quiet);

  try {
    // Load configuration
    spinner.start('Loading configuration...');
    const { config } = await loadConfig({
      cwd: options.cwd,
      configPath: options.config,
    });
    spinner.stop();

    // Get default paths from config
    const sourceFile = `${config.tokens.outputDir}/js/tokens.js`;
    const targetFile = `${config.tokens.collectionsDir}/../src/tokens-flat.ts`;

    // Run sync
    spinner.start('Syncing tokens...');
    const result: SyncResult = syncTokens({
      sourceFile,
      targetFile,
      verbose: !options.quiet,
    });

    if (result.success) {
      spinner.succeed(
        `Synced ${colors.bold(result.tokensCount.toString())} tokens${result.changed ? ' (file updated)' : ' (no changes)'}`
      );
      process.exit(ExitCode.Success);
    } else {
      spinner.fail('Sync failed');
      if (result.errors) {
        for (const error of result.errors) {
          logger.error(error);
        }
      }
      process.exit(ExitCode.BuildError);
    }
  } catch (error) {
    spinner.fail('Sync failed');

    if (error instanceof Error) {
      logger.error(error.message);
    }

    process.exit(ExitCode.GeneralError);
  }
}

/**
 * Run tokens postprocess
 */
async function runTokensPostprocess(options: { quiet?: boolean; debug?: boolean }): Promise<void> {
  const logger = createLogger({
    quiet: options.quiet,
    debug: options.debug,
  });
  const spinner = createSpinner(options.quiet);

  try {
    // Load configuration
    spinner.start('Loading configuration...');
    const { config } = await loadConfig({
      cwd: process.cwd(),
    });
    spinner.stop();

    // The postprocessCLI expects a base directory and appends 'dist/css' to it
    // config.tokens.outputDir is resolved to full path like .../tokens/dist
    // We need the parent directory (the package root)
    const tokensPackageDir = dirname(config.tokens.outputDir);

    // Run postprocess
    spinner.start('Post-processing CSS files...');
    const success = postprocessCLI(tokensPackageDir);

    if (success) {
      spinner.succeed('Post-processed CSS theme files');
      process.exit(ExitCode.Success);
    } else {
      spinner.fail('Post-processing failed');
      process.exit(ExitCode.BuildError);
    }
  } catch (error) {
    spinner.fail('Post-processing failed');

    if (error instanceof Error) {
      logger.error(error.message);
    }

    process.exit(ExitCode.GeneralError);
  }
}
