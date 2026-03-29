/**
 * Info command
 *
 * Display full tool inventory for humans and AI agents.
 *
 * @packageDocumentation
 * @module @dsai-io/tools/cli/commands/info
 */

import { Command } from 'commander';

import { version } from '../../version.js';
import { colors } from '../ui/index.js';

/**
 * Static registry of all dsai CLI capabilities
 */
const registry = {
  package: '@dsai-io/tools',
  version,
  description: 'Design System AI Toolkit — build, validate, and manage design tokens and icons.',
  documentation: 'https://github.com/michelve/dsai',
  cli: {
    binary: 'dsai',
    globalOptions: [
      { flag: '-c, --config <path>', description: 'Path to config file' },
      { flag: '--cwd <dir>', description: 'Working directory' },
      { flag: '--debug', description: 'Enable debug mode' },
      { flag: '-q, --quiet', description: 'Quiet mode — minimal output' },
      { flag: '--dry-run', description: "Dry run — don't write files" },
      { flag: '-v, --version', description: 'Show version number' },
      { flag: '-h, --help', description: 'Show help' },
    ],
    commands: [
      {
        name: 'add [items...]',
        description: 'Add DSAi items (components, hooks, utils) to your project',
        options: ['--all', '--type <type>', '--overwrite', '--dry-run', '--list'],
      },
      {
        name: 'tokens build',
        description: 'Build design tokens from source collections',
        options: ['--platforms <list>', '--watch', '--clean', '--theme <name>', '--list-themes'],
      },
      {
        name: 'tokens validate',
        description: 'Validate design token files',
        options: ['--fix', '--strict'],
      },
      {
        name: 'tokens transform',
        description: 'Transform Figma exports to Style Dictionary format',
        options: ['--dry-run', '--default-mode <mode>', '--ignore-modes <list>'],
      },
      {
        name: 'tokens sync',
        description: 'Sync tokens flat file',
        options: ['--format <format>'],
      },
      {
        name: 'tokens postprocess',
        description: 'Post-process CSS theme files',
        options: [],
      },
      {
        name: 'tokens snapshots list',
        description: 'List all token collection snapshots',
        options: [],
      },
      {
        name: 'tokens snapshots info <id>',
        description: 'Show snapshot details',
        options: [],
      },
      {
        name: 'tokens snapshots rollback <id>',
        description: 'Rollback to a snapshot',
        options: ['--dry-run'],
      },
      {
        name: 'icons build',
        description: 'Generate icon components from SVG files',
        options: ['--format <format>', '--no-optimize', '--dry-run'],
      },
      {
        name: 'init',
        description: 'Initialize DSAi configuration with interactive prompts',
        options: ['--yes', '--template <template>', '--force'],
      },
      {
        name: 'config',
        description: 'Display resolved configuration',
        options: ['--json'],
      },
      {
        name: 'registry build',
        description: 'Build component registry JSON from source',
        options: ['--src <path>', '--out <path>', '--verbose'],
      },
      {
        name: 'info',
        description: 'Show tool inventory and capabilities',
        options: ['--json'],
      },
    ],
  },
};

/**
 * Print human-readable info output
 */
function printInfo(): void {
  const log = (msg: string): void => {
    // eslint-disable-next-line no-console
    console.log(msg);
  };

  log('');
  log(colors.bold(`${registry.package} v${registry.version}`));
  log(colors.muted(registry.description));
  log(colors.muted('\u2500'.repeat(60)));
  log('');

  // CLI Commands
  log(colors.bold('CLI Commands'));
  log('');
  for (const cmd of registry.cli.commands) {
    const opts = cmd.options.length > 0 ? colors.muted(` [${cmd.options.join(', ')}]`) : '';
    log(`  ${colors.command(`dsai ${cmd.name}`)}${opts}`);
    log(`    ${colors.muted(cmd.description)}`);
  }

  // Global Options
  log('');
  log(colors.bold('Global Options'));
  log('');
  for (const opt of registry.cli.globalOptions) {
    log(`  ${colors.cyan(opt.flag)}  ${colors.muted(opt.description)}`);
  }

  // Links
  log('');
  log(colors.bold('Documentation'));
  log(`  ${colors.path(registry.documentation)}`);
  log('');
}

/**
 * Create info command
 */
export function createInfoCommand(): Command {
  return new Command('info')
    .description('Show tool inventory and capabilities')
    .option('--json', 'Output as JSON for agent consumption', false)
    .action((options: { json: boolean }) => {
      if (options.json) {
        // eslint-disable-next-line no-console
        console.log(JSON.stringify(registry, null, 2));
      } else {
        printInfo();
      }
    });
}
