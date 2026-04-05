/**
 * Add command — install DSAi items (components, hooks, utils) into your project.
 *
 * Usage:
 *   dsai add button modal tabs          # Add UI components
 *   dsai add use-focus-trap use-debounce # Add hooks
 *   dsai add keyboard cn                # Add utilities
 *   dsai add --all                      # Add all UI components
 *   dsai add --all --type hook          # Add all hooks
 *   dsai add --all --type util          # Add all utilities
 *   dsai add --list                     # List everything available
 *   dsai add --list --type hook         # List only hooks
 *   dsai add button --overwrite         # Overwrite existing files
 *   dsai add button --dry-run           # Preview without writing
 *
 * @module @dsai-io/tools/cli/commands/add
 */

/* eslint-disable security/detect-non-literal-fs-filename, no-console, security/detect-object-injection */

import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

import { Command } from 'commander';

import { loadConfig } from '../../config/loader.js';
import { resolveTree } from '../../registry/resolver.js';
import { writeRegistryItems } from '../../registry/writer.js';
import { ExitCode } from '../types.js';
import { colors, createLogger, createSpinner } from '../ui/index.js';

import type { RegistryIndex, RegistryIndexEntry } from '../../registry/types.js';

/** Valid type filter values */
const VALID_TYPES = ['ui', 'hook', 'util', 'lib', 'type'] as const;

/** Column width for item name padding in list output */
const ITEM_NAME_COLUMN_WIDTH = 28;

/**
 * Create the `add` command.
 */
export function createAddCommand(): Command {
  const cmd = new Command('add')
    .description('Add DSAi items (components, hooks, utils) to your project')
    .argument('[items...]', 'Item names to add (e.g., button use-focus-trap cn)')
    .option('--all', 'Add all items of the specified type (default: ui)', false)
    .option('--type <type>', 'Filter by type: ui, hook, util, type')
    .option('--overwrite', 'Overwrite existing files', false)
    .option('--dry-run', 'Preview changes without writing files', false)
    .option('--registry <path>', 'Path to local registry directory')
    .option('--list', 'List all available items', false)
    .action(async (items: string[], opts, cmdObj) => {
      const parentOpts = cmdObj.parent?.opts() ?? {};
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

        // Validate --type if provided
        const typeFilter = allOpts.type as string | undefined;
        if (typeFilter && !VALID_TYPES.includes(typeFilter as (typeof VALID_TYPES)[number])) {
          logger.error(
            `Invalid type "${typeFilter}". Valid types: ${VALID_TYPES.join(', ')}`
          );
          process.exit(ExitCode.GeneralError);
        }

        // Helper: filter items by type
        const filterByType = (entries: RegistryIndexEntry[]): RegistryIndexEntry[] => {
          if (!typeFilter) {return entries;}
          return entries.filter((i) => i.type === `registry:${typeFilter}`);
        };

        // List mode
        if (allOpts.list) {
          const indexPath = join(registryDir, 'index.json');
          if (!existsSync(indexPath)) {
            logger.error('Registry index not found.');
            process.exit(ExitCode.GeneralError);
          }
          const index: RegistryIndex = JSON.parse(readFileSync(indexPath, 'utf-8'));
          const filtered = filterByType(index.items);

          console.log(`\n${colors.bold('Available items:')}\n`);
          const grouped: Record<string, typeof filtered> = {};
          for (const item of filtered) {
            const type = item.type.replace('registry:', '');
            if (!grouped[type]) {grouped[type] = [];}
            grouped[type].push(item);
          }

          // Display order: ui first, then hook, util, lib, type
          const displayOrder = ['ui', 'hook', 'util', 'lib', 'type'];
          for (const type of displayOrder) {
            const typeItems = grouped[type];
            if (!typeItems || typeItems.length === 0) {continue;}
            console.log(`  ${colors.cyan(type)} (${typeItems.length}):`);
            for (const item of typeItems.toSorted((a, b) => a.name.localeCompare(b.name))) {
              console.log(
                `    ${colors.bold(item.name.padEnd(ITEM_NAME_COLUMN_WIDTH))} ${colors.muted(item.description)}`
              );
            }
            console.log();
          }
          const itemCountMsg = `${filtered.length} items available`;
          console.log(`  ${colors.muted(itemCountMsg)}\n`);

          // Show usage hints
          console.log(`${colors.muted('Usage:')}`);
          console.log(`  ${colors.command('dsai add button modal')}         ${colors.muted('Add specific items')}`);
          console.log(`  ${colors.command('dsai add use-focus-trap cn')}    ${colors.muted('Add hooks and utils')}`);
          console.log(`  ${colors.command('dsai add --all')}                ${colors.muted('Add all UI components')}`);
          console.log(`  ${colors.command('dsai add --all --type hook')}    ${colors.muted('Add all hooks')}`);
          console.log(`  ${colors.command('dsai add --list --type util')}   ${colors.muted('List only utilities')}\n`);
          return;
        }

        // Validate input
        if (!allOpts.all && items.length === 0) {
          logger.error(
            'No items specified.\n' +
              `Usage: ${colors.command('dsai add <item...>')}\n` +
              `       ${colors.command('dsai add --all [--type hook|util]')}\n` +
              `       ${colors.command('dsai add --list')}`
          );
          process.exit(ExitCode.GeneralError);
        }

        // If --all, load names from index filtered by type
        let itemNames = items;
        if (allOpts.all) {
          const indexPath = join(registryDir, 'index.json');
          const index: RegistryIndex = JSON.parse(readFileSync(indexPath, 'utf-8'));

          // Default to UI components if no type specified
          const effectiveType = typeFilter ?? 'ui';
          itemNames = index.items
            .filter((i) => i.type === `registry:${effectiveType}`)
            .map((i) => i.name);

          if (itemNames.length === 0) {
            logger.error(`No items found for type "${effectiveType}".`);
            process.exit(ExitCode.GeneralError);
          }
        }

        // Resolve dependency tree
        const spinner = createSpinner();
        spinner.start('Resolving dependencies...');

        let tree;
        try {
          tree = resolveTree(itemNames, registryDir);
        } catch (err) {
          spinner.fail('Failed to resolve dependencies');
          logger.error((err as Error).message);
          process.exit(ExitCode.GeneralError);
        }

        spinner.succeed(
          `Resolved ${tree.items.length} items ` +
            `(${itemNames.length} requested + ${tree.items.length - itemNames.length} dependencies)`
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
        const writeLabel = allOpts.dryRun ? 'Previewing changes...' : 'Installing items...';
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
          const skippedMsg = colors.warning(
            `${result.skipped.length} files skipped (already exist). Use --overwrite to replace.`
          );
          console.log(`\n${skippedMsg}`);
        }

        if (!allOpts.dryRun) {
          console.log(`\n${colors.success('Done!')} Items are ready to use.\n`);

          // Show contextual import example based on what was installed
          const firstItem = tree.items.find((i) => itemNames.includes(i.name)) ?? tree.items[0];
          if (firstItem) {
            const type = firstItem.type.replace('registry:', '');
            const name = firstItem.name;
            const titleCase = name
              .split('-')
              .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
              .join('');

            console.log(`${colors.muted('Import example:')}`);
            if (type === 'ui' || type === 'component') {
              const importPath = `${config.aliases.importAlias}${config.aliases.ui}/${name}`;
              const importStr = `import { ${titleCase} } from '${importPath}';`;
              console.log(`  ${colors.cyan(importStr)}`);
            } else if (type === 'hook') {
              const hookName = titleCase.replace('Use', 'use');
              const importPath = `${config.aliases.importAlias}${config.aliases.hooks}/${hookName}`;
              const importStr = `import { ${hookName} } from '${importPath}';`;
              console.log(`  ${colors.cyan(importStr)}`);
            } else if (type === 'util') {
              const importPath = `${config.aliases.importAlias}${config.aliases.utils}/${name}`;
              const importStr = `import { ${name} } from '${importPath}';`;
              console.log(`  ${colors.cyan(importStr)}`);
            }
            console.log();
          }
        }
      } catch (err) {
        logger.error(`Unexpected error: ${(err as Error).message}`);
        process.exit(ExitCode.GeneralError);
      }
    });

  return cmd;
}
