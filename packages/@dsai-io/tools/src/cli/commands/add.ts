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

/** Display order for item types in list output */
const TYPE_DISPLAY_ORDER = ['ui', 'hook', 'util', 'lib', 'type'];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Filter registry entries by type */
function filterByType(
  entries: RegistryIndexEntry[],
  typeFilter: string | undefined
): RegistryIndexEntry[] {
  if (!typeFilter) {return entries;}
  return entries.filter((i) => i.type === `registry:${typeFilter}`);
}

/** Display grouped list of available items */
function displayItemList(filtered: RegistryIndexEntry[]): void {
  console.log(`\n${colors.bold('Available items:')}\n`);

  const grouped: Record<string, RegistryIndexEntry[]> = {};
  for (const item of filtered) {
    const type = item.type.replace('registry:', '');
    if (!grouped[type]) {grouped[type] = [];}
    grouped[type].push(item);
  }

  for (const type of TYPE_DISPLAY_ORDER) {
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

  console.log(`  ${colors.muted(`${filtered.length} items available`)}\n`);
  console.log(`${colors.muted('Usage:')}`);
  console.log(`  ${colors.command('dsai add button modal')}         ${colors.muted('Add specific items')}`);
  console.log(`  ${colors.command('dsai add use-focus-trap cn')}    ${colors.muted('Add hooks and utils')}`);
  console.log(`  ${colors.command('dsai add --all')}                ${colors.muted('Add all UI components')}`);
  console.log(`  ${colors.command('dsai add --all --type hook')}    ${colors.muted('Add all hooks')}`);
  console.log(`  ${colors.command('dsai add --list --type util')}   ${colors.muted('List only utilities')}\n`);
}

/** Convert a kebab-case name to TitleCase */
function toTitleCase(name: string): string {
  return name
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join('');
}

/** Build and print an import example for the first installed item */
function printImportExample(
  firstItem: { type: string; name: string },
  aliases: { importAlias: string; ui: string; hooks: string; utils: string }
): void {
  const type = firstItem.type.replace('registry:', '');
  const name = firstItem.name;
  const titleCase = toTitleCase(name);

  console.log(`${colors.muted('Import example:')}`);

  let importStr: string | undefined;
  if (type === 'ui' || type === 'component') {
    const importPath = `${aliases.importAlias}${aliases.ui}/${name}`;
    importStr = `import { ${titleCase} } from '${importPath}';`;
  } else if (type === 'hook') {
    const hookName = titleCase.replace('Use', 'use');
    const importPath = `${aliases.importAlias}${aliases.hooks}/${hookName}`;
    importStr = `import { ${hookName} } from '${importPath}';`;
  } else if (type === 'util') {
    const importPath = `${aliases.importAlias}${aliases.utils}/${name}`;
    importStr = `import { ${name} } from '${importPath}';`;
  }

  if (importStr) {
    console.log(`  ${colors.cyan(importStr)}`);
  }
  console.log();
}

// ---------------------------------------------------------------------------
// Command
// ---------------------------------------------------------------------------

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
        await runAddAction(items, allOpts, logger);
      } catch (err) {
        logger.error(`Unexpected error: ${(err as Error).message}`);
        process.exit(ExitCode.GeneralError);
      }
    });

  return cmd;
}

/** Parsed add command options */
interface AddCommandOptions {
  cwd?: string;
  config?: string;
  registry?: string;
  type?: string;
  list?: boolean;
  all?: boolean;
  overwrite?: boolean;
  dryRun?: boolean;
}

/**
 * Core logic for the add command, extracted for reduced complexity.
 */
async function runAddAction(
  items: string[],
  allOpts: AddCommandOptions,
  logger: ReturnType<typeof createLogger>
): Promise<void> {
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
  const typeFilter = allOpts.type;
  if (typeFilter && !VALID_TYPES.includes(typeFilter as (typeof VALID_TYPES)[number])) {
    logger.error(`Invalid type "${typeFilter}". Valid types: ${VALID_TYPES.join(', ')}`);
    process.exit(ExitCode.GeneralError);
  }

  // List mode — early return
  if (allOpts.list) {
    const indexPath = join(registryDir, 'index.json');
    if (!existsSync(indexPath)) {
      logger.error('Registry index not found.');
      process.exit(ExitCode.GeneralError);
    }
    const index: RegistryIndex = JSON.parse(readFileSync(indexPath, 'utf-8'));
    displayItemList(filterByType(index.items, typeFilter));
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

  // Resolve item names (--all or explicit)
  const itemNames = allOpts.all
    ? resolveAllItemNames(registryDir, typeFilter, logger)
    : items;

  // Resolve dependency tree
  const tree = resolveItemTree(itemNames, registryDir, logger);

  // Show what will be installed
  logInstallPlan(tree, itemNames);

  // Write files
  writeItems(tree, config, allOpts);

  if (allOpts.dryRun) {return;}

  console.log(`\n${colors.success('Done!')} Items are ready to use.\n`);

  const firstItem = tree.items.find((i) => itemNames.includes(i.name)) ?? tree.items[0];
  if (firstItem) {
    printImportExample(firstItem, config.aliases);
  }
}

/** Load all item names for --all mode */
function resolveAllItemNames(
  registryDir: string,
  typeFilter: string | undefined,
  logger: ReturnType<typeof createLogger>
): string[] {
  const indexPath = join(registryDir, 'index.json');
  const index: RegistryIndex = JSON.parse(readFileSync(indexPath, 'utf-8'));
  const effectiveType = typeFilter ?? 'ui';
  const names = index.items
    .filter((i) => i.type === `registry:${effectiveType}`)
    .map((i) => i.name);

  if (names.length === 0) {
    logger.error(`No items found for type "${effectiveType}".`);
    process.exit(ExitCode.GeneralError);
  }
  return names;
}

/** Resolve dependency tree with spinner feedback */
function resolveItemTree(
  itemNames: string[],
  registryDir: string,
  logger: ReturnType<typeof createLogger>
): ReturnType<typeof resolveTree> {
  const spinner = createSpinner();
  spinner.start('Resolving dependencies...');

  try {
    const tree = resolveTree(itemNames, registryDir);
    spinner.succeed(
      `Resolved ${tree.items.length} items ` +
        `(${itemNames.length} requested + ${tree.items.length - itemNames.length} dependencies)`
    );
    return tree;
  } catch (err) {
    spinner.fail('Failed to resolve dependencies');
    logger.error((err as Error).message);
    process.exit(ExitCode.GeneralError);
  }
}

/** Log the items and dependencies that will be installed */
function logInstallPlan(
  tree: ReturnType<typeof resolveTree>,
  _itemNames: string[]
): void {
  console.log(`\n${colors.bold('Items to install:')}`);
  for (const item of tree.items) {
    const type = item.type.replace('registry:', '');
    console.log(`  ${colors.cyan(type.padEnd(10))} ${item.name}`);
  }
  if (tree.dependencies.length > 0) {
    console.log(`\n${colors.bold('npm dependencies:')} ${tree.dependencies.join(', ')}`);
  }
  console.log();
}

/** Write registry items and report results */
function writeItems(
  tree: ReturnType<typeof resolveTree>,
  config: Awaited<ReturnType<typeof loadConfig>>['config'],
  allOpts: AddCommandOptions
): ReturnType<typeof writeRegistryItems> {
  const writeLabel = allOpts.dryRun ? 'Previewing changes...' : 'Installing items...';
  const writeSpinner = createSpinner();
  writeSpinner.start(writeLabel);

  const result = writeRegistryItems(tree, {
    projectDir: config.global.cwd,
    aliases: config.aliases,
    components: config.components,
    overwrite: allOpts.overwrite ?? false,
    dryRun: allOpts.dryRun ?? false,
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

  return result;
}
