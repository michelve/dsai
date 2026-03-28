/**
 * Registry command — build and manage the component registry.
 *
 * Usage:
 *   dsai registry build
 *   dsai registry build --verbose
 *
 * @module @dsai-io/tools/cli/commands/registry
 */

import { resolve } from 'node:path';

import { Command } from 'commander';

import { buildRegistry } from '../../registry/builder.js';
import { ExitCode } from '../types.js';
import { colors, createLogger, createSpinner } from '../ui/index.js';

/**
 * Create the `registry` command group.
 */
export function createRegistryCommand(): Command {
  const cmd = new Command('registry').description('Manage the component registry');

  cmd
    .command('build')
    .description('Build registry JSON from @dsai-io/react source')
    .option('--src <path>', 'Path to @dsai-io/react/src directory')
    .option('--out <path>', 'Output directory for registry JSON', 'registry')
    .option('--verbose', 'Show detailed logging', false)
    .action(async (opts) => {
      const logger = createLogger(opts);
      const spinner = createSpinner();
      spinner.start('Building component registry...');

      try {
        const reactSrcDir = opts.src
          ? resolve(opts.src)
          : resolve(process.cwd(), 'packages', '@dsai-io', 'react', 'src');

        const outputDir = resolve(
          process.cwd(),
          'packages',
          '@dsai-io',
          'tools',
          opts.out
        );

        const index = buildRegistry({
          reactSrcDir,
          outputDir,
          verbose: opts.verbose,
        });

        spinner.succeed(
          `Registry built: ${colors.bold(String(index.count))} items ` +
            `(${index.items.filter((i) => i.type === 'registry:ui').length} components, ` +
            `${index.items.filter((i) => i.type === 'registry:hook').length} hooks, ` +
            `${index.items.filter((i) => i.type === 'registry:util').length} utils)`
        );

        console.log(`\n  Output: ${colors.cyan(outputDir)}\n`);
      } catch (err) {
        spinner.fail('Failed to build registry');
        logger.error((err as Error).message);
        process.exit(ExitCode.GeneralError);
      }
    });

  return cmd;
}
