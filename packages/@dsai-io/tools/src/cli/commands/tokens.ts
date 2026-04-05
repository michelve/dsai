/**
 * Token commands
 *
 * Build, validate, and sync design tokens.
 *
 * @packageDocumentation
 * @module @dsai-io/tools/cli/commands/tokens
 */

import { dirname, resolve } from 'node:path';

import { Command } from 'commander';

import { loadConfig } from '../../config/index.js';
import {
  buildTokens,
  cleanTokenOutputs,
  postprocessCLI,
  syncTokens,
  validateTokens,
} from '../../tokens/index.js';
import { SnapshotService } from '../../tokens/snapshot.js';
import { ExitCode } from '../types.js';
import { colors, createLogger, createSpinner, formatDuration } from '../ui/index.js';

const LOADING_CONFIGURATION_MSG = 'Loading configuration...';

import type { BuildResult, SyncResult, ValidationResult } from '../../tokens/types.js';
import type {
  TokensBuildOptions,
  TokensSyncOptions,
  TokensTransformOptions,
  TokensValidateOptions,
} from '../types.js';

/** Spinner message shown while loading configuration */
const LOADING_CONFIG_MSG = 'Loading configuration...';

/**
 * Create tokens command group
 *
 * @returns Commander command for tokens operations
 */
export function createTokensCommand(): Command {
  const tokens = new Command('tokens')
    .description('Design token operations')
    .helpCommand('help [command]', 'Show help for a command');

  // Build command
  tokens
    .command('build')
    .description('Build design tokens')
    .option('-p, --platforms <platforms>', 'Platforms to build (comma-separated)', 'all')
    .option('-w, --watch', 'Watch mode', false)
    .option('--clean', 'Clean output before build', false)
    .option('--theme <name>', 'Build only a specific theme (e.g., dark)')
    .option('--list-themes', 'List available themes from config')
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

  // Snapshot commands
  const snapshots = tokens.command('snapshots').description('Manage token collection snapshots');

  snapshots
    .command('list')
    .description('List all snapshots')
    .action(async (_options: Record<string, unknown>, command: Command) => {
      const globalOpts = command.parent?.parent?.parent?.opts() ?? {};
      await runSnapshotsList(globalOpts);
    });

  snapshots
    .command('info <snapshot-id>')
    .description('Show detailed information about a snapshot')
    .action(async (snapshotId: string, _options: Record<string, unknown>, command: Command) => {
      const globalOpts = command.parent?.parent?.parent?.opts() ?? {};
      await runSnapshotsInfo(snapshotId, globalOpts);
    });

  snapshots
    .command('rollback <snapshot-id>')
    .description('Rollback token collections to a snapshot')
    .option('--dry-run', 'Show what would be restored without writing files', false)
    .action(async (snapshotId: string, options: Record<string, unknown>, command: Command) => {
      const globalOpts = command.parent?.parent?.parent?.opts() ?? {};
      await runSnapshotsRollback(snapshotId, { ...globalOpts, ...options });
    });

  return tokens;
}

/** Log a list of messages with a prefix */
function logList(
  logger: ReturnType<typeof createLogger>,
  items: string[],
  method: 'log' | 'warn' | 'error',
  prefix?: string,
): void {
  if (items.length === 0) { return; }
  logger.log('');
  for (const item of items) {
    logger[method](prefix ? `${prefix} ${item}` : item);
  }
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
    spinner.start(LOADING_CONFIG_MSG);
    const { config, configPath } = await loadConfig({
      cwd: options.cwd,
      configPath: options.config,
    });
    spinner.succeed(`Loaded config from ${colors.path(configPath ?? 'defaults')}`);

    logger.debug(`Config: ${JSON.stringify(config, null, 2)}`);

    spinner.start('Transforming Figma tokens...');
    const { transformTokens } = await import('../../tokens/index.js');

    const ignoreModes = options.ignoreModes
      ? options.ignoreModes.split(',').map((m: string) => m.trim())
      : [];

    const result = transformTokens({
      sourceDir: config.tokens.sourceDir,
      collectionsDir: config.tokens.collectionsDir,
      defaultMode: options.defaultMode ?? 'Light',
      ignoreModes,
      dryRun: options.dryRun ?? false,
      verbose: !options.quiet,
    });

    if (!result.success) {
      spinner.fail('Transform failed');
      for (const error of result.errors) { logger.error(error); }
      process.exit(ExitCode.BuildError);
      return;
    }

    const duration = formatDuration(Date.now() - startTime);
    spinner.succeed(
      `Transformed ${colors.bold(result.filesWritten.length.toString())} files in ${colors.bold(duration)}`,
    );

    if (!options.quiet) {
      logList(logger, result.filesWritten.map((f) => `${colors.success('✔')} ${colors.path(f)}`), 'log');
    }
    logList(logger, result.warnings, 'warn');

    process.exit(ExitCode.Success);
  } catch (error) {
    spinner.fail('Transform failed');
    const fallbackLogger = createLogger({ quiet: options.quiet, debug: options.debug });
    fallbackLogger.error(error instanceof Error ? error.message : 'Unknown error');
    process.exit(ExitCode.BuildError);
  }
}

/**
 * Display available themes and exit
 */
function displayThemes(
  config: Awaited<ReturnType<typeof loadConfig>>['config'],
  logger: ReturnType<typeof createLogger>,
): void {
  const themes = config.tokens.themes?.definitions;
  if (!themes || Object.keys(themes).length === 0) {
    logger.log('No themes configured.');
    logger.log('Add themes to your dsai.config.mjs under tokens.themes.definitions');
    process.exit(ExitCode.Success);
  }

  logger.log('');
  logger.log(colors.bold('Available Themes:'));
  logger.log('');
  for (const [name, def] of Object.entries(themes)) {
    const isDefault = def.isDefault ? colors.success(' (default)') : '';
    const suffix = def.suffix ? colors.dim(` suffix: ${def.suffix}`) : '';
    logger.log(`  ${colors.bold(name)}${isDefault}${suffix}`);
    logger.log(`    Selector: ${colors.path(def.selector)}`);
    if (def.mediaQuery) {
      logger.log(`    Media Query: ${colors.dim(def.mediaQuery)}`);
    }
  }
  logger.log('');
  process.exit(ExitCode.Success);
}

/**
 * Clean output directory if requested
 */
function handleClean(
  options: TokensBuildOptions,
  configPath: string | undefined,
  config: Awaited<ReturnType<typeof loadConfig>>['config'],
  spinner: ReturnType<typeof createSpinner>,
  logger: ReturnType<typeof createLogger>,
): void {
  if (!options.clean) { return; }

  spinner.start('Cleaning output directory...');

  const cleanResult = cleanTokenOutputs({
    baseDir: dirname(configPath ?? process.cwd()),
    directories: config.tokens.outputDir ? [config.tokens.outputDir] : ['dist'],
    verbose: !options.quiet,
    dryRun: false,
  });

  if (cleanResult.success) {
    spinner.succeed(
      `Cleaned ${cleanResult.totalFilesRemoved} files from ${cleanResult.cleaned.length} directories`,
    );
  } else {
    spinner.warn('Clean completed with warnings');
    for (const error of cleanResult.errors) {
      logger.warn(error);
    }
  }
}

/**
 * Build the token build options from config
 */
function resolveBuildOptions(
  config: Awaited<ReturnType<typeof loadConfig>>['config'],
  configDir: string,
  options: TokensBuildOptions,
  sourceDir: string,
): Parameters<typeof buildTokens>[2] {
  const resolvedCssOutputDir = config.tokens.scss?.cssOutputDir
    ? resolve(configDir, config.tokens.scss.cssOutputDir)
    : undefined;
  const resolvedPostprocessCssDir = config.tokens.postprocess?.cssDir
    ? resolve(configDir, config.tokens.postprocess.cssDir)
    : undefined;

  return {
    verbose: !options.quiet,
    quiet: options.quiet,
    sourceDir,
    pipeline: config.tokens.pipeline,
    formats: config.tokens.formats,
    prefix: config.tokens.prefix,
    outputDir: config.tokens.outputDir
      ? resolve(configDir, config.tokens.outputDir)
      : resolve(configDir, 'dist'),
    themesConfig: config.tokens.themes
      ? {
          enabled: config.tokens.themes.enabled,
          definitions: config.tokens.themes.definitions,
        }
      : undefined,
    cssOutputDir: resolvedCssOutputDir,
    postprocessConfig: config.tokens.postprocess
      ? {
          ...config.tokens.postprocess,
          cssDir: resolvedPostprocessCssDir,
        }
      : undefined,
  };
}

/**
 * Run tokens build
 */
async function runTokensBuild(options: TokensBuildOptions): Promise<void> {
  const startTime = Date.now();
  const logger = createLogger({ quiet: options.quiet, debug: options.debug });
  const spinner = createSpinner(options.quiet);

  try {
    spinner.start(LOADING_CONFIG_MSG);
    const { config, configPath } = await loadConfig({
      cwd: options.cwd,
      configPath: options.config,
    });
    spinner.succeed(`Loaded config from ${colors.path(configPath ?? 'defaults')}`);
    logger.debug(`Config: ${JSON.stringify(config, null, 2)}`);

    if (options.listThemes) {
      displayThemes(config, logger);
      return;
    }

    const configDir = dirname(configPath ?? process.cwd());
    const tokensDir = resolve(configDir, config.tokens.collectionsDir);
    const toolsDir = resolve(configDir, config.tokens.sourceDir);

    handleClean(options, configPath, config, spinner, logger);

    spinner.start('Building tokens...');
    const buildOpts = resolveBuildOptions(config, configDir, options, sourceDir);
    const result: BuildResult = await buildTokens(tokensDir, toolsDir, buildOpts);

    if (result.success) {
      const duration = formatDuration(Date.now() - startTime);
      spinner.succeed(
        `Built ${colors.bold(result.stepsCompleted.length.toString())} steps in ${colors.bold(duration)}`,
      );

      if (!options.quiet && result.outputFiles && result.outputFiles.length > 0) {
        logger.log('');
        for (const file of result.outputFiles) {
          logger.log(`  ${colors.success('✔')} ${colors.path(file)}`);
        }
        logger.log('');
      }
      process.exit(ExitCode.Success);
    }

    spinner.fail('Build failed');
    if (result.errors && Array.isArray(result.errors)) {
      for (const error of result.errors) {
        logger.error(error);
      }
    }
    process.exit(ExitCode.BuildError);
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
    spinner.start(LOADING_CONFIG_MSG);
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
    spinner.start(LOADING_CONFIG_MSG);
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
    spinner.start(LOADING_CONFIG_MSG);
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

/**
 * Run snapshots list
 */
async function runSnapshotsList(options: { quiet?: boolean; debug?: boolean }): Promise<void> {
  const logger = createLogger({
    quiet: options.quiet,
    debug: options.debug,
  });
  const spinner = createSpinner(options.quiet);

  try {
    // Load configuration
    spinner.start(LOADING_CONFIG_MSG);
    const { config } = await loadConfig({
      cwd: process.cwd(),
    });
    spinner.stop();

    const tokensPackageDir = dirname(config.tokens.outputDir);
    const snapshotService = new SnapshotService({
      collectionsDir: config.tokens.collectionsDir,
      snapshotDir: `${tokensPackageDir}/.snapshots`,
    });

    // List snapshots
    const snapshots = snapshotService.listSnapshots();

    if (snapshots.length === 0) {
      logger.info('No snapshots found');
      process.exit(ExitCode.Success);
      return;
    }

    logger.info(`\nFound ${colors.bold(String(snapshots.length))} snapshot(s):\n`);

    for (const snapshot of snapshots) {
      const date = new Date(snapshot.timestamp).toLocaleString();
      logger.info(`  ${colors.bold(snapshot.id)}`);
      logger.info(`    Date: ${date}`);
      logger.info(`    Files: ${snapshot.files.length}`);
      if (snapshot.description) {
        logger.info(`    Description: ${snapshot.description}`);
      }
      logger.info('');
    }

    process.exit(ExitCode.Success);
  } catch (error) {
    spinner.fail('Failed to list snapshots');

    if (error instanceof Error) {
      logger.error(error.message);
    }

    process.exit(ExitCode.GeneralError);
  }
}

/**
 * Run snapshots info
 */
async function runSnapshotsInfo(
  snapshotId: string,
  options: { quiet?: boolean; debug?: boolean }
): Promise<void> {
  const logger = createLogger({
    quiet: options.quiet,
    debug: options.debug,
  });
  const spinner = createSpinner(options.quiet);

  try {
    // Load configuration
    spinner.start(LOADING_CONFIG_MSG);
    const { config } = await loadConfig({
      cwd: process.cwd(),
    });
    spinner.stop();

    const tokensPackageDir = dirname(config.tokens.outputDir);
    const snapshotService = new SnapshotService({
      collectionsDir: config.tokens.collectionsDir,
      snapshotDir: `${tokensPackageDir}/.snapshots`,
    });

    // Get snapshot
    const snapshot = snapshotService.getSnapshot(snapshotId);

    if (!snapshot) {
      logger.error(`Snapshot not found: ${snapshotId}`);
      process.exit(ExitCode.GeneralError);
      return;
    }

    // Display snapshot info
    const date = new Date(snapshot.timestamp).toLocaleString();
    logger.info(`\nSnapshot: ${colors.bold(snapshot.id)}`);
    logger.info(`Date: ${date}`);
    logger.info(`Files: ${snapshot.files.length}`);
    if (snapshot.description) {
      logger.info(`Description: ${snapshot.description}`);
    }

    logger.info(`\nFiles in snapshot:`);
    for (const file of snapshot.files) {
      const size = Buffer.byteLength(file.content, 'utf8');
      logger.info(`  ${file.path} (${size} bytes, checksum: ${file.checksum.substring(0, 8)}...)`);
    }

    process.exit(ExitCode.Success);
  } catch (error) {
    spinner.fail('Failed to get snapshot info');

    if (error instanceof Error) {
      logger.error(error.message);
    }

    process.exit(ExitCode.GeneralError);
  }
}

/**
 * Run snapshots rollback
 */
async function runSnapshotsRollback(
  snapshotId: string,
  options: { quiet?: boolean; debug?: boolean; dryRun?: boolean }
): Promise<void> {
  const logger = createLogger({
    quiet: options.quiet,
    debug: options.debug,
  });
  const spinner = createSpinner(options.quiet);

  try {
    // Load configuration
    spinner.start(LOADING_CONFIG_MSG);
    const { config } = await loadConfig({
      cwd: process.cwd(),
    });
    spinner.stop();

    const tokensPackageDir = dirname(config.tokens.outputDir);
    const snapshotService = new SnapshotService({
      collectionsDir: config.tokens.collectionsDir,
      snapshotDir: `${tokensPackageDir}/.snapshots`,
    });

    // Get snapshot for info
    const snapshot = snapshotService.getSnapshot(snapshotId);

    if (!snapshot) {
      logger.error(`Snapshot not found: ${snapshotId}`);
      process.exit(ExitCode.GeneralError);
      return;
    }

    if (options.dryRun) {
      logger.info(`\n${colors.bold('DRY RUN')} - Would restore snapshot: ${snapshotId}`);
      logger.info(`Date: ${new Date(snapshot.timestamp).toLocaleString()}`);
      logger.info(`Files to restore: ${snapshot.files.length}`);

      for (const file of snapshot.files) {
        logger.info(`  ${file.path}`);
      }

      process.exit(ExitCode.Success);
      return;
    }

    // Perform rollback
    spinner.start(`Rolling back to snapshot ${snapshotId}...`);
    snapshotService.rollback(snapshotId);
    spinner.succeed(`Rolled back to snapshot ${snapshotId}`);

    logger.info(`Restored ${snapshot.files.length} file(s)`);
    logger.info(`Snapshot date: ${new Date(snapshot.timestamp).toLocaleString()}`);

    process.exit(ExitCode.Success);
  } catch (error) {
    spinner.fail('Rollback failed');

    if (error instanceof Error) {
      logger.error(error.message);
    }

    process.exit(ExitCode.GeneralError);
  }
}
