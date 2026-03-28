/**
 * CLI program creation
 *
 * Sets up the main Commander program with global options and help formatting.
 *
 * @packageDocumentation
 * @module @dsai-io/tools/cli/create-program
 */

import { Command } from 'commander';

import { version } from '../version.js';

import { colors } from './ui/index.js';

/**
 * Create the main CLI program
 *
 * @returns Configured Commander program
 */
export function createProgram(): Command {
  const program = new Command()
    .name('dsai')
    .description(
      `${colors.bold('DSAI Tools')} - Design System AI Toolkit\n\n` +
        'Build, validate, and manage design tokens and icons.'
    )
    .version(version, '-v, --version', 'Show version number')
    .helpOption('-h, --help', 'Show help')
    .configureHelp({
      sortSubcommands: true,
      sortOptions: true,
    });

  // Global options available to all commands
  program
    .option('-c, --config <path>', 'Path to config file')
    .option('--cwd <dir>', 'Working directory', process.cwd())
    .option('--debug', 'Enable debug mode', false)
    .option('-q, --quiet', 'Quiet mode - minimal output', false)
    .option('--dry-run', "Dry run - don't write files", false);

  // Custom help formatting with examples
  program.addHelpText(
    'after',
    `
${colors.bold('Examples:')}
  ${colors.muted('# Add components to your project')}
  $ dsai add button modal tabs

  ${colors.muted('# List available components')}
  $ dsai add --list

  ${colors.muted('# Initialize configuration')}
  $ dsai init

  ${colors.muted('# Build all tokens')}
  $ dsai tokens build

  ${colors.muted('# Validate tokens with fixes')}
  $ dsai tokens validate --fix

  ${colors.muted('# Build icons as React components')}
  $ dsai icons build --format react

  ${colors.muted('# Show resolved configuration')}
  $ dsai config

${colors.bold('Documentation:')}
  ${colors.cyan('https://github.com/michelve/dsai')}
`
  );

  return program;
}

/**
 * Setup error handling for the program
 *
 * @param program - Commander program instance
 */
export function setupErrorHandling(program: Command): void {
  // Handle unknown commands
  program.on('command:*', ([cmd]) => {
    console.error(`${colors.error('Error:')} Unknown command '${cmd}'.\n`);
    console.error(`Run ${colors.command('dsai --help')} for available commands.\n`);
    process.exit(1);
  });

  // Show suggestions for misspelled commands
  program.showSuggestionAfterError(true);

  // Show help after errors
  program.showHelpAfterError(true);
}
