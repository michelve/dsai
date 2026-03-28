/**
 * Add command — install DSAi components into your project.
 *
 * Usage:
 *   dsai add button modal tabs
 *   dsai add --all
 *   dsai add --list
 *   dsai add button --overwrite
 *   dsai add button --dry-run
 *
 * @module @dsai-io/tools/cli/commands/add
 */

import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

import { Command } from 'commander';

import { loadConfig } from '../../config/loader.js';
import { resolveTree } from '../../registry/resolver.js';
import { writeRegistryItems } from '../../registry/writer.js';
import { ExitCode } from '../types.js';
import { colors, createLogger, createSpinner } from '../ui/index.js';

import type { RegistryIndex } from '../../registry/types.js';

/**
 * Create the `add` command.
 */
export function createAddCommand(): Command {
  const cmd = new Command('add')
    .description('Add DSAi components to your project')
    .argument('[components...]', 'Component names to add (e.g., button modal tabs)')
    .option('--all', 'Add all available components', false)
    .option('--overwrite', 'Overwrite existing files', false)
    .option('--dry-run', 'Preview changes without writing files', false)
    .option('--registry <path>', 'Path to local registry directory')
    .option('--list', 'List all available components', false)
    .action(async (components: string[], opts, cmd) => {
      // Merge parent (global) and local options — Commander nests them separately
      // Local opts default to false; parent captures global flags like --dry-run.
      // Use OR logic: if either level has it set, respect it.
      const parentOpts = cmd.parent?.opts() ?? {};
      const allOpts = {
        ...parentOpts,
        ...opts,
        dryRun: opts.dryRun || parentOpts.dryRun,
        overwrite: opts.overwrite || parentOpts.overwrite,
      };
      const logger = createLogger(allOpts);

      try {
        const { config } = await loadConfig({
          cwd: allOpts.cwd ?? process.cwd(),
          configPath: allOpts.config,
        });

        const registryDir = allOpts.registry
          ? resolve(allOpts.registry)
          : join(config.configDir, 'node_modules', '@dsai-io', 'tools', 'registry');

        if (!existsSync(registryDir)) {
          logger.error(
            `Registry not found at: ${registryDir}\n` +
              `Run \`dsai registry build\` or use --registry <path>.`
          );
          process.exit(ExitCode.GeneralError);
        }

        // List mode
        if (allOpts.list) {
          const indexPath = join(registryDir, 'index.json');
          if (!existsSync(indexPath)) {
            logger.error('Registry index not found.');
            process.exit(ExitCode.GeneralError);
          }
          const index: RegistryIndex = JSON.parse(readFileSync(indexPath, 'utf-8'));

          console.log(`\n${colors.bold('Available components:')}\n`);
          const grouped: Record<string, typeof index.items> = {};
          for (const item of index.items) {
            const type = item.type.replace('registry:', '');
            if (!grouped[type]) grouped[type] = [];
            grouped[type].push(item);
          }
          for (const [type, items] of Object.entries(grouped)) {
            console.log(`  ${colors.cyan(type)}:`);
            for (const item of items.sort((a, b) => a.name.localeCompare(b.name))) {
              console.log(
                `    ${colors.bold(item.name.padEnd(24))} ${colors.muted(item.description)}`
              );
            }
            console.log();
          }
          console.log(`  ${colors.muted(`${index.count} items available`)}\n`);
          return;
        }

        // Validate input
        if (!allOpts.all && components.length === 0) {
          logger.error(
            'No components specified.\n' +
              `Usage: ${colors.command('dsai add <component...>')}\n` +
              `       ${colors.command('dsai add --all')}\n` +
              `       ${colors.command('dsai add --list')}`
          );
          process.exit(ExitCode.GeneralError);
        }

        // If --all, load all component names from index
        let componentNames = components;
        if (allOpts.all) {
          const indexPath = join(registryDir, 'index.json');
          const index: RegistryIndex = JSON.parse(readFileSync(indexPath, 'utf-8'));
          componentNames = index.items
            .filter((i) => i.type === 'registry:ui')
            .map((i) => i.name);
        }

        // Resolve dependency tree
        const spinner = createSpinner();
        spinner.start('Resolving dependencies...');

        let tree;
        try {
          tree = resolveTree(componentNames, registryDir);
        } catch (err) {
          spinner.fail('Failed to resolve dependencies');
          logger.error((err as Error).message);
          process.exit(ExitCode.GeneralError);
        }

        spinner.succeed(
          `Resolved ${tree.items.length} items ` +
            `(${componentNames.length} requested + ${tree.items.length - componentNames.length} dependencies)`
        );

        // Show what will be installed
        console.log(`\n${colors.bold('Items to install:')}`);
        for (const item of tree.items) {
          const type = item.type.replace('registry:', '');
          console.log(`  ${colors.cyan(type.padEnd(10))} ${item.name}`);
        }
        if (tree.dependencies.length > 0) {
          console.log(
            `\n${colors.bold('npm dependencies:')} ${tree.dependencies.join(', ')}`
          );
        }
        console.log();

        // Write files
        const writeLabel = allOpts.dryRun ? 'Previewing changes...' : 'Installing components...';
        const writeSpinner = createSpinner();
        writeSpinner.start(writeLabel);

        const result = writeRegistryItems(tree, {
          projectDir: config.global.cwd,
          aliases: config.aliases,
          components: config.components,
          overwrite: allOpts.overwrite,
          dryRun: allOpts.dryRun,
          log: (msg) => {
            writeSpinner.stop();
            console.log(msg);
            writeSpinner.start(writeLabel);
          },
        });

        writeSpinner.succeed(
          allOpts.dryRun ? 'Dry run complete' : `Installed ${result.written.length} files`
        );

        if (result.skipped.length > 0) {
          console.log(
            `\n${colors.warning(`${result.skipped.length} files skipped (already exist). Use --overwrite to replace.`)}`
          );
        }

        if (!allOpts.dryRun) {
          console.log(`\n${colors.success('Done!')} Components are ready to use.\n`);
          const firstName = componentNames[0] ?? 'button';
          const titleCase = firstName.charAt(0).toUpperCase() + firstName.slice(1);
          console.log(`${colors.muted('Import example:')}`);
          console.log(
            `  ${colors.cyan(`import { ${titleCase} } from '${config.aliases.importAlias}${config.aliases.ui}/${firstName}';`)}\n`
          );
        }
      } catch (err) {
        logger.error(`Unexpected error: ${(err as Error).message}`);
        process.exit(ExitCode.GeneralError);
      }
    });

  return cmd;
}
