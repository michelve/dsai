#!/usr/bin/env node
/**
 * @dsai-io/figma-tokens CLI
 *
 * Fetch design tokens from Figma and export to local files.
 *
 * Usage:
 *   dsai-figma fetch [options]    Fetch variables from Figma
 *   dsai-figma sync [options]     Sync tokens between Figma and local
 *   dsai-figma validate [options] Validate exported tokens
 *
 * Environment:
 *   FIGMA_TOKEN                     Figma personal access token (required)
 *   FIGMA_FILE_KEY                  Default Figma file key
 *
 * Configuration:
 *   Uses figma.config.mjs or figma section in dsai.config.mjs
 */

import { existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ANSI colors
const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

/**
 * Write to stdout
 * @param {string} message
 * @param {string} color
 * @returns {void}
 */
function log(message, color = '') {
  process.stdout.write(`${color}${message}${colors.reset}\n`);
}

/**
 * Write error to stderr
 * @param {string} message
 * @returns {void}
 */
function logError(message) {
  process.stderr.write(`${colors.red}✖ ${message}${colors.reset}\n`);
}

/**
 * Write success message to stdout
 * @param {string} message
 * @returns {void}
 */
function logSuccess(message) {
  process.stdout.write(`${colors.green}✔ ${message}${colors.reset}\n`);
}

/**
 * Write info message to stdout
 * @param {string} message
 * @returns {void}
 */
function logInfo(message) {
  process.stdout.write(`${colors.cyan}ℹ ${message}${colors.reset}\n`);
}

/**
 * Write warning message to stderr
 * @param {string} message
 * @returns {void}
 */
function logWarning(message) {
  process.stderr.write(`${colors.yellow}⚠ ${message}${colors.reset}\n`);
}

// Allowed config filenames for security
const ALLOWED_CONFIG_FILES = ['figma.config.mjs', 'dsai.config.mjs'];

/**
 * Safely check if a config file exists
 * @param {string} basePath - The base directory
 * @param {string} filename - The config filename
 * @returns {string|null} - The full path if file exists, null otherwise
 */
function findConfigFile(basePath, filename) {
  if (!ALLOWED_CONFIG_FILES.includes(filename)) {
    return null;
  }
  const fullPath = resolve(basePath, filename);
  return existsSync(fullPath) ? fullPath : null;
}

/**
 * Load configuration from figma.config.mjs or dsai.config.mjs
 * @param {string} cwd - Current working directory
 * @returns {Promise<Record<string, unknown>>}
 */
async function loadConfig(cwd) {
  // Try figma.config.mjs first
  const figmaConfigPath = findConfigFile(cwd, 'figma.config.mjs');
  if (figmaConfigPath) {
    const config = await import(figmaConfigPath);
    return config.default || config;
  }

  // Fall back to dsai.config.mjs
  const dsaiConfigPath = findConfigFile(cwd, 'dsai.config.mjs');
  if (dsaiConfigPath) {
    const config = await import(dsaiConfigPath);
    const fullConfig = config.default || config;
    return fullConfig.figma || {};
  }

  return {};
}

/**
 * Allowed CLI option keys for security
 */
const ALLOWED_OPTIONS = new Set([
  'file-key',
  'output',
  'format',
  'collections',
  'modes',
  'resolve-aliases',
  'dry-run',
  'verbose',
  'help',
  'h',
  'tokens-dir',
  'direction',
  'backup',
]);

/**
 * Check if an argument is a value (not a flag)
 * @param {string | undefined} arg
 * @returns {boolean}
 */
function isArgValue(arg) {
  return Boolean(arg) && !arg.startsWith('--') && !arg.startsWith('-');
}

/**
 * Parse a long option (--key or --key value)
 * @param {string[]} args
 * @param {number} index
 * @param {Map<string, string | boolean>} options
 * @returns {number} Number of extra args consumed
 */
function parseLongOption(args, index, options) {
  const key = args[index].slice(2);
  if (!ALLOWED_OPTIONS.has(key)) {
    return 0;
  }
  const nextArg = args[index + 1];
  if (isArgValue(nextArg)) {
    options.set(key, nextArg);
    return 1;
  }
  options.set(key, true);
  return 0;
}

/**
 * Parse a short option (-k)
 * @param {string} arg
 * @param {Map<string, string | boolean>} options
 */
function parseShortOption(arg, options) {
  const key = arg.slice(1);
  if (ALLOWED_OPTIONS.has(key)) {
    options.set(key, true);
  }
}

/**
 * Parse command line arguments safely
 * @param {string[]} args
 * @returns {{ command: string, options: Map<string, string | boolean> }}
 */
function parseArgs(args) {
  const result = {
    command: args[0] || 'fetch',
    options: new Map(),
  };

  for (let i = 1; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith('--')) {
      i += parseLongOption(args, i, result.options);
    } else if (arg.startsWith('-')) {
      parseShortOption(arg, result.options);
    }
  }

  return result;
}

/**
 * Show help
 * @returns {void}
 */
function showHelp() {
  process.stdout.write(`
${colors.bold}@dsai-io/figma-tokens${colors.reset} - Fetch design tokens from Figma

${colors.bold}Usage:${colors.reset}
  dsai-figma <command> [options]

${colors.bold}Commands:${colors.reset}
  fetch       Fetch variables from Figma and save to figma-exports/
  sync        Sync tokens between Figma and local files
  validate    Validate exported token files
  info        Show tool inventory, API methods, and endpoint coverage
  help        Show this help message

${colors.bold}Options:${colors.reset}
  --file-key <key>      Figma file key (from URL)
  --output <dir>        Output directory (default: ./figma-exports)
  --format <format>     Output format: dtcg, tokens-studio, style-dictionary
  --collections <list>  Comma-separated collection names to include
  --modes <list>        Comma-separated mode names to include
  --resolve-aliases     Resolve alias references to actual values
  --dry-run             Show what would be done without making changes
  --verbose             Show detailed output
  --help, -h            Show this help message

${colors.bold}Environment Variables:${colors.reset}
  FIGMA_TOKEN           Figma personal access token (required)
  FIGMA_FILE_KEY        Default Figma file key

${colors.bold}Configuration:${colors.reset}
  Create figma.config.mjs or add figma section to dsai.config.mjs:

  ${colors.dim}// figma.config.mjs${colors.reset}
  export default {
    fileKey: 'your-figma-file-key',
    outputDir: './src/figma-exports',
    format: 'dtcg',
    collections: ['Colors', 'Typography', 'Spacing'],
  };

${colors.bold}Examples:${colors.reset}
  ${colors.dim}# Fetch all tokens${colors.reset}
  dsai-figma fetch --file-key abc123xyz

  ${colors.dim}# Fetch specific collections${colors.reset}
  dsai-figma fetch --collections "Colors,Spacing"

  ${colors.dim}# Dry run to see what would be exported${colors.reset}
  dsai-figma fetch --dry-run --verbose
`);
}

/**
 * Static registry of dsai-figma capabilities
 */
const infoRegistry = {
  package: '@dsai-io/figma-tokens',
  version: '1.1.0',
  description: 'Figma REST API client and design token synchronization for DSAi.',
  documentation: 'https://github.com/michelve/dsai/tree/main/packages/@dsai-io/figma-tokens',
  cli: {
    binary: 'dsai-figma',
    commands: [
      {
        name: 'fetch',
        description: 'Fetch variables from Figma and save to local files',
        options: ['--file-key <key>', '--output <dir>', '--format <format>', '--collections <list>', '--modes <list>', '--resolve-aliases', '--dry-run', '--verbose'],
      },
      {
        name: 'sync',
        description: 'Sync tokens between Figma and local files',
        options: ['--file-key <key>', '--tokens-dir <dir>', '--direction <dir>', '--backup', '--dry-run'],
      },
      {
        name: 'validate',
        description: 'Validate exported token files',
        options: ['--output <dir>', '--verbose'],
      },
      {
        name: 'info',
        description: 'Show tool inventory, API methods, and endpoint coverage',
        options: ['--json'],
      },
    ],
    environment: [
      { name: 'FIGMA_TOKEN', description: 'Figma personal access token (required)', required: true },
      { name: 'FIGMA_FILE_KEY', description: 'Default Figma file key', required: false },
    ],
  },
  api: {
    client: 'FigmaClient',
    factory: "createFigmaClient({ accessToken })",
    methods: [
      { name: 'getFile', description: 'Get file metadata, components, and styles', endpoint: 'GET /v1/files/:key' },
      { name: 'getFileNodes', description: 'Get specific nodes by ID', endpoint: 'GET /v1/files/:key/nodes' },
      { name: 'getFileMetadata', description: 'Get lightweight file metadata', endpoint: 'GET /v1/files/:key/meta' },
      { name: 'getVersionHistory', description: 'Get file version history', endpoint: 'GET /v1/files/:key/versions' },
      { name: 'getVariables', description: 'Get local variables and collections', endpoint: 'GET /v1/files/:key/variables/local' },
      { name: 'getPublishedVariables', description: 'Get published variables', endpoint: 'GET /v1/files/:key/variables/published' },
      { name: 'postVariables', description: 'Create, update, delete variables (atomic)', endpoint: 'POST /v1/files/:key/variables' },
      { name: 'getPublishedComponents', description: 'Get published components from library', endpoint: 'GET /v1/files/:key/components' },
      { name: 'getPublishedComponentSets', description: 'Get published component sets (variants)', endpoint: 'GET /v1/files/:key/component_sets' },
      { name: 'getPublishedStyles', description: 'Get published styles from library', endpoint: 'GET /v1/files/:key/styles' },
      { name: 'getComponent', description: 'Get single component by key', endpoint: 'GET /v1/components/:key' },
      { name: 'getComponentSet', description: 'Get single component set by key', endpoint: 'GET /v1/component_sets/:key' },
      { name: 'getStyle', description: 'Get single style by key', endpoint: 'GET /v1/styles/:key' },
      { name: 'getComponentActions', description: 'Component insertion/detachment analytics', endpoint: 'GET /v1/analytics/libraries/:key/component/actions' },
      { name: 'getComponentUsages', description: 'Component usage counts', endpoint: 'GET /v1/analytics/libraries/:key/component/usages' },
      { name: 'getStyleActions', description: 'Style insertion/detachment analytics', endpoint: 'GET /v1/analytics/libraries/:key/style/actions' },
      { name: 'getStyleUsages', description: 'Style usage counts', endpoint: 'GET /v1/analytics/libraries/:key/style/usages' },
      { name: 'getVariableActions', description: 'Variable insertion/detachment analytics', endpoint: 'GET /v1/analytics/libraries/:key/variable/actions' },
      { name: 'getVariableUsages', description: 'Variable usage counts', endpoint: 'GET /v1/analytics/libraries/:key/variable/usages' },
      { name: 'getMe', description: 'Get authenticated user info', endpoint: 'GET /v1/me' },
      { name: 'exportTokens', description: 'Export tokens to files (DTCG/TokensStudio/SD)', endpoint: 'Composite' },
      { name: 'syncTokens', description: 'Bidirectional token sync with conflict resolution', endpoint: 'Composite' },
    ],
  },
  coverage: {
    files: ['GET file', 'GET nodes', 'GET metadata', 'GET versions'],
    variables: ['GET local', 'GET published', 'POST create/update/delete'],
    library: ['GET components', 'GET component_sets', 'GET styles', 'GET component by key', 'GET component_set by key', 'GET style by key'],
    analytics: ['GET component actions', 'GET component usages', 'GET style actions', 'GET style usages', 'GET variable actions', 'GET variable usages'],
    user: ['GET me'],
  },
};

/**
 * Print a line to stdout
 * @param {string} msg
 */
function line(msg) {
  process.stdout.write(msg + '\n');
}

/**
 * Print CLI commands section
 */
function printCliCommands() {
  const c = colors;
  line('');
  line(`${c.bold}CLI Commands${c.reset}`);
  line('');
  for (const cmd of infoRegistry.cli.commands) {
    const opts = cmd.options.length > 0 ? `${c.dim} [${cmd.options.join(', ')}]${c.reset}` : '';
    line(`  ${c.green}${c.bold}dsai-figma ${cmd.name}${c.reset}${opts}`);
    line(`    ${c.dim}${cmd.description}${c.reset}`);
  }
}

/**
 * Print environment variables section
 */
function printEnvironment() {
  const c = colors;
  line('');
  line(`${c.bold}Environment Variables${c.reset}`);
  line('');
  for (const env of infoRegistry.cli.environment) {
    const req = env.required ? `${c.red}(required)${c.reset}` : `${c.dim}(optional)${c.reset}`;
    line(`  ${c.cyan}${env.name}${c.reset}  ${env.description} ${req}`);
  }
}

/**
 * Print API methods section
 */
function printApiMethods() {
  const c = colors;
  line('');
  line(`${c.bold}API Client: ${c.cyan}FigmaClient${c.reset}`);
  line(`${c.dim}Import: import { createFigmaClient } from '@dsai-io/figma-tokens'${c.reset}`);
  line('');
  for (const method of infoRegistry.api.methods) {
    line(`  ${c.green}${method.name}()${c.reset}  ${c.dim}${method.description}${c.reset}`);
    line(`    ${c.cyan}${method.endpoint}${c.reset}`);
  }
}

/**
 * Print coverage and documentation sections
 */
function printCoverageAndDocs() {
  const c = colors;
  line('');
  line(`${c.bold}Figma REST API Coverage${c.reset}`);
  line('');
  for (const [category, endpoints] of Object.entries(infoRegistry.coverage)) {
    line(`  ${c.yellow}${category}${c.reset}: ${endpoints.join(', ')}`);
  }

  line('');
  line(`${c.bold}Documentation${c.reset}`);
  line(`  ${c.cyan}${c.bold}${infoRegistry.documentation}${c.reset}`);
  line('');
}

/**
 * Show info output
 * @param {boolean} asJson
 * @returns {void}
 */
function showInfo(asJson) {
  if (asJson) {
    process.stdout.write(JSON.stringify(infoRegistry, null, 2) + '\n');
    return;
  }

  const c = colors;
  line('');
  line(`${c.bold}${infoRegistry.package}${c.reset} v${infoRegistry.version}`);
  line(`${c.dim}${infoRegistry.description}${c.reset}`);
  line(`${c.dim}${'\u2500'.repeat(70)}${c.reset}`);

  printCliCommands();
  printEnvironment();
  printApiMethods();
  printCoverageAndDocs();
}

/**
 * Handle early exit commands (help, info)
 * @param {string[]} args
 * @returns {boolean} True if handled and should exit
 */
function handleEarlyCommands(args) {
  if (args.includes('--help') || args.includes('-h') || args[0] === 'help') {
    showHelp();
    process.exit(0);
  }

  if (args[0] === 'info') {
    showInfo(args.includes('--json'));
    process.exit(0);
  }

  return false;
}

/**
 * Resolve required environment and config values
 * @param {Map<string, string | boolean>} options
 * @param {Record<string, unknown>} config
 * @param {string} command
 * @returns {{ figmaToken: string, fileKey: string }}
 */
function resolveRequiredValues(options, config, command) {
  const figmaToken = process.env.FIGMA_TOKEN;
  if (!figmaToken) {
    logError('FIGMA_TOKEN environment variable is required');
    logInfo('Get your token at: https://www.figma.com/developers/api#access-tokens');
    process.exit(1);
  }

  const rawFileKey = options.get('file-key') || process.env.FIGMA_FILE_KEY || config.fileKey;
  if (!rawFileKey && command !== 'help') {
    logError('Figma file key is required');
    logInfo('Provide via --file-key, FIGMA_FILE_KEY env var, or config file');
    process.exit(1);
  }

  const fileKey = typeof rawFileKey === 'string' ? rawFileKey : String(rawFileKey ?? '');
  return { figmaToken, fileKey };
}

/**
 * Dispatch command to handler
 * @param {string} command
 * @param {object} client
 * @param {Record<string, unknown>} mergedOpts
 * @returns {Promise<void>}
 */
async function dispatchCommand(command, client, mergedOpts) {
  switch (command) {
    case 'fetch':
      return handleFetch(client, mergedOpts);
    case 'sync':
      return handleSync(client, mergedOpts);
    case 'validate':
      return handleValidate(mergedOpts);
    default:
      logError(`Unknown command: ${command}`);
      showHelp();
      process.exit(1);
  }
}

/**
 * Main CLI entry point
 * @returns {Promise<void>}
 */
async function main() {
  const args = process.argv.slice(2);
  handleEarlyCommands(args);

  const { command, options } = parseArgs(args);
  const cwd = process.cwd();
  const config = await loadConfig(cwd);
  const verbose = options.get('verbose') || config.verbose || false;

  if (verbose) {
    logInfo(`Working directory: ${cwd}`);
    logInfo(`Command: ${command}`);
  }

  const { figmaToken, fileKey } = resolveRequiredValues(options, config, command);

  const { FigmaClient } = await import('../dist/client.js');
  const client = new FigmaClient({ accessToken: figmaToken });
  const opts = Object.fromEntries(options);

  await dispatchCommand(command, client, { ...config, ...opts, fileKey, verbose, cwd });
}

/**
 * Log verbose collection details
 * @param {object} variablesResponse
 */
function logCollections(variablesResponse) {
  log('\nCollections:', colors.dim);
  for (const collection of Object.values(variablesResponse.variableCollections)) {
    const modeNames = collection.modes.map((m) => m.name).join(', ');
    log(`  • ${collection.name} (modes: ${modeNames})`, colors.dim);
  }
}

/**
 * Log export result details
 * @param {object} result
 * @param {boolean} verbose
 */
function logExportResult(result, verbose) {
  if (!result.success) {
    logError('Export failed');
    for (const error of result.errors) {
      logError(error);
    }
    process.exit(1);
  }

  log(`\n${colors.green}${colors.bold}Export complete!${colors.reset}\n`);
  logSuccess(`Exported ${result.tokenCount} tokens to ${result.files.length} files`);

  if (verbose && result.files.length > 0) {
    log('\nExported files:', colors.dim);
    for (const file of result.files) {
      log(`  • ${file.path} (${file.tokenCount} tokens)`, colors.dim);
    }
  }

  if (result.warnings.length > 0) {
    log('\nWarnings:', colors.yellow);
    for (const warning of result.warnings) {
      logWarning(warning);
    }
  }
}

/**
 * Parse a comma-separated string into a trimmed array
 * @param {string | undefined} value
 * @returns {string[] | undefined}
 */
function parseCommaSeparated(value) {
  return value ? value.split(',').map((s) => s.trim()) : undefined;
}

/**
 * Handle fetch command
 * @param {object} client - FigmaClient instance
 * @param {Record<string, unknown>} options - Command options
 * @returns {Promise<void>}
 */
async function handleFetch(client, options) {
  const { collections, modes, verbose, cwd } = options;
  const fileKey = typeof options.fileKey === 'string' ? options.fileKey : '';
  const format = options.format || 'dtcg';
  const resolveAliases = options['resolve-aliases'];
  const dryRun = options['dry-run'];
  const targetDir = resolve(cwd, options.output || options.outputDir || './figma-exports');

  log(`\n${colors.bold}Fetching tokens from Figma...${colors.reset}\n`);

  if (verbose) {
    logInfo(`File key: ${fileKey}`);
    logInfo(`Output directory: ${targetDir}`);
    logInfo(`Format: ${format}`);
  }

  if (dryRun) {
    logWarning('Dry run mode - no files will be written');
  }

  try {
    const fileInfo = await client.getFile(fileKey, { depth: 1 });
    logSuccess(`Connected to: ${fileInfo.name}`);

    const variablesResponse = await client.getVariables(fileKey);
    const collectionCount = Object.keys(variablesResponse.variableCollections).length;
    const variableCount = Object.keys(variablesResponse.variables).length;

    logInfo(`Found ${collectionCount} collections with ${variableCount} variables`);

    if (verbose) {
      logCollections(variablesResponse);
    }

    if (dryRun) {
      log(`\n${colors.yellow}Dry run complete. Run without --dry-run to export files.${colors.reset}`);
      return;
    }

    const result = await client.exportTokens({
      fileKey,
      outputDir: targetDir,
      format,
      collections: parseCommaSeparated(collections),
      modes: parseCommaSeparated(modes),
      resolveAliases: resolveAliases || false,
      includeDescriptions: true,
    });

    logExportResult(result, verbose);
  } catch (err) {
    logError(`Failed to fetch tokens: ${err.message}`);
    if (verbose && err.stack) {
      process.stderr.write(`${err.stack}\n`);
    }
    process.exit(1);
  }
}

/**
 * Log sync result details
 * @param {object} result
 */
function logSyncResult(result) {
  if (!result.success) {
    logError('Sync failed');
    for (const error of result.errors) {
      logError(error);
    }
    process.exit(1);
  }

  log(`\n${colors.green}${colors.bold}Sync complete!${colors.reset}\n`);

  if (result.added.length > 0) {
    logSuccess(`Added: ${result.added.length} tokens`);
  }
  if (result.updated.length > 0) {
    logSuccess(`Updated: ${result.updated.length} tokens`);
  }
  if (result.removed.length > 0) {
    logWarning(`Removed: ${result.removed.length} tokens`);
  }

  if (result.conflicts.length > 0) {
    log('\nConflicts:', colors.yellow);
    for (const conflict of result.conflicts) {
      logWarning(`${conflict.path}: ${conflict.reason}`);
    }
  }
}

/**
 * Handle sync command
 * @param {object} client - FigmaClient instance
 * @param {Record<string, unknown>} options - Command options
 * @returns {Promise<void>}
 */
async function handleSync(client, options) {
  const { verbose, cwd } = options;
  const fileKey = typeof options.fileKey === 'string' ? options.fileKey : '';
  const tokensDir = options.tokensDir || options['tokens-dir'];
  const direction = options.direction || 'pull';
  const dryRun = options['dry-run'];
  const backup = options.backup !== false;
  const targetDir = resolve(cwd, tokensDir || './src/collections');

  log(`\n${colors.bold}Syncing tokens with Figma...${colors.reset}\n`);

  if (verbose) {
    logInfo(`File key: ${fileKey}`);
    logInfo(`Tokens directory: ${targetDir}`);
    logInfo(`Direction: ${direction}`);
  }

  if (dryRun) {
    logWarning('Dry run mode - no files will be modified');
  }

  try {
    const result = await client.syncTokens({
      fileKey,
      tokensDir: targetDir,
      direction,
      dryRun,
      backup,
    });

    logSyncResult(result);
  } catch (err) {
    logError(`Failed to sync tokens: ${err.message}`);
    if (verbose && err.stack) {
      process.stderr.write(`${err.stack}\n`);
    }
    process.exit(1);
  }
}

/**
 * Log a validation issue with appropriate severity
 * @param {{ severity: string, path: string, message: string }} issue
 */
function logValidationIssue(issue) {
  const logFn = issue.severity === 'error' ? logError : logWarning;
  logFn(`${issue.path}: ${issue.message}`);
}

/**
 * Handle validate command
 * @param {Record<string, unknown>} options - Command options
 * @returns {Promise<void>}
 */
async function handleValidate(options) {
  const { verbose, cwd } = options;
  const targetDir = resolve(cwd, options.output || options.outputDir || './figma-exports');

  log(`\n${colors.bold}Validating token exports...${colors.reset}\n`);

  if (verbose) {
    logInfo(`Directory: ${targetDir}`);
  }

  try {
    const { validateTokens } = await import('@dsai-io/tools/tokens');

    const result = await validateTokens({
      sourceDir: targetDir,
      strict: true,
    });

    if (result.valid) {
      logSuccess('All tokens are valid!');
      logInfo(`Validated ${result.tokenCount} tokens in ${result.fileCount} files`);
      return;
    }

    logError('Validation failed');
    for (const issue of result.issues) {
      logValidationIssue(issue);
    }
    process.exit(1);
  } catch (err) {
    logError(`Validation failed: ${err.message}`);
    if (verbose && err.stack) {
      process.stderr.write(`${err.stack}\n`);
    }
    process.exit(1);
  }
}

// Run CLI
try {
  await main();
} catch (err) {
  logError(`Unexpected error: ${err.message}`);
  process.exit(1);
}
