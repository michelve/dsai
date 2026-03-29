/**
 * CLI module for @dsai-io/tools
 *
 * Provides the command-line interface for the dsai-tools package.
 * Uses Commander.js for command parsing, with spinners and colored output.
 *
 * Commands:
 * - tokens: Build, validate, and sync design tokens
 * - icons: Generate icon components from SVG files
 * - init: Initialize configuration in a project
 * - config: Display resolved configuration
 *
 * @example
 * ```bash
 * # Build tokens
 * dsai tokens build
 *
 * # Validate tokens
 * dsai tokens validate
 *
 * # Initialize a new project
 * dsai init --template full
 *
 * # Show configuration
 * dsai config --json
 * ```
 */

import { fileURLToPath } from 'node:url';

import {
  createAddCommand,
  createConfigCommand,
  createIconsCommand,
  createInfoCommand,
  createInitCommand,
  createRegistryCommand,
  createTokensCommand,
} from './commands/index.js';
import { createProgram, setupErrorHandling } from './create-program.js';

import type { Command } from 'commander';

/**
 * CLI program instance - exposed for testing
 */
let program: Command;

/**
 * Configure and run the CLI
 *
 * Sets up the Commander program with all commands and parses arguments.
 *
 * @param args - Command line arguments (defaults to process.argv)
 */
export async function run(args: string[] = process.argv): Promise<void> {
  program = createProgram();

  // Add commands
  program.addCommand(createAddCommand());
  program.addCommand(createTokensCommand());
  program.addCommand(createIconsCommand());
  program.addCommand(createInitCommand());
  program.addCommand(createConfigCommand());
  program.addCommand(createRegistryCommand());
  program.addCommand(createInfoCommand());

  // Set up error handling for unknown commands
  setupErrorHandling(program);

  // Parse and execute
  await program.parseAsync(args);
}

/**
 * Get the CLI program instance
 *
 * Used for testing to access the configured Commander program.
 *
 * @returns The Commander program instance
 */
export function getProgram(): Command {
  return program;
}

/**
 * Re-export types for consumers
 */
export type {
  BuildResult,
  CLIContext,
  CommandHandler,
  GlobalOptions,
  IconsBuildOptions,
  InitOptions,
  Logger,
  Spinner,
  SyncResult,
  TokensBuildOptions,
  TokensSyncOptions,
  TokensValidateOptions,
  ValidationResult,
} from './types.js';

export { ExitCode } from './types.js';

/**
 * Re-export UI utilities
 */
export {
  colors,
  createLogger,
  createSpinner,
  formatBytes,
  formatCount,
  formatDuration,
} from './ui/index.js';

// Auto-run when executed directly (e.g., via tsx)
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  run().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}
