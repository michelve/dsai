# Task: CLI Implementation

**Task ID:** TASK-105
**Title:** Command Line Interface for @dsai/tools
**Priority:** High
**Status:** ✅ Completed
**Assigned To:** Unassigned
**Blocked by Task:** TASK-101, TASK-102, TASK-103, TASK-104
**Created:** 2024-12-23
**Updated:** 2025-01-15

---

## 📋 Task Description

### Goal

Create a comprehensive command-line interface for `@dsai/tools` using Commander.js that enables external teams to run token builds, icon generation, validation, and initialization without needing to understand the internal implementation.

### Problem/Issue

Current CLI limitations:

1. **No CLI Exists**: Teams must use npm scripts with hardcoded paths
2. **Not Discoverable**: No `--help` or command documentation
3. **Not Configurable**: Can't pass options via command line
4. **No Init Command**: No way to bootstrap configuration
5. **No Progress Feedback**: Silent execution with no visual feedback
6. **No Error Formatting**: Raw errors, no helpful messages

### Expected Outcome

A full-featured CLI that:

1. Provides all major operations as commands
2. Has intuitive help and documentation
3. Supports configuration via flags and config files
4. Has beautiful output with spinners and colors
5. Provides helpful error messages with fix suggestions
6. Includes an init wizard for bootstrapping

---

## 🎯 Acceptance Criteria

### CLI Binary

- [x] `dsai` or `dsai-tools` binary registered in package.json
- [x] Works when installed globally
- [x] Works when run via npx
- [x] Works when run via pnpm exec

### Core Commands

- [x] `dsai tokens build` - Build tokens
- [x] `dsai tokens validate` - Validate tokens
- [x] `dsai tokens sync` - Sync tokens flat file
- [x] `dsai icons build` - Generate icon components (placeholder)
- [x] `dsai init` - Initialize configuration
- [x] `dsai config` - Show resolved configuration

### Global Options

- [x] `--config, -c` - Custom config file path
- [x] `--cwd` - Working directory
- [x] `--debug` - Debug mode
- [x] `--quiet, -q` - Quiet mode (no spinners)
- [x] `--help, -h` - Show help
- [x] `--version, -v` - Show version

### Output Quality

- [x] Spinners for long operations
- [x] Colored output (respects NO_COLOR)
- [x] Clear success/error messages
- [ ] Progress bars for multi-file ops (deferred to future enhancement)
- [x] Timing information

### Error Handling

- [x] Helpful error messages
- [x] Exit codes for CI
- [x] Stack traces in debug mode
- [x] Suggestions for common errors

---

## 📂 Files to Create/Modify

### New Files

```
packages/@dsai/tools/src/cli/
├── index.ts                    # CLI entry point
├── create-program.ts           # Commander setup
├── commands/
│   ├── index.ts               # Command exports
│   ├── tokens.ts              # Token commands
│   ├── icons.ts               # Icon commands
│   ├── init.ts                # Init wizard
│   └── config.ts              # Config display
├── ui/
│   ├── index.ts               # UI exports
│   ├── spinner.ts             # Ora wrapper
│   ├── colors.ts              # Picocolors wrapper
│   ├── logger.ts              # Logging utilities
│   └── prompts.ts             # Interactive prompts
└── utils/
    ├── index.ts               # Utility exports
    ├── exit.ts                # Exit code handling
    └── context.ts             # CLI context
```

### Update Files

```
packages/@dsai/tools/package.json  # Add bin field
```

---

## 🔗 Dependencies

### Prerequisites

- [ ] TASK-101: Package Scaffolding (package structure)
- [ ] TASK-102: Configuration System (config loading)
- [ ] TASK-103: Token Scripts (token operations)
- [ ] TASK-104: Style Dictionary (SD integration)

### Blocks

- TASK-107: Tokens Package Update (uses CLI)
- TASK-108: Enterprise Documentation (documents CLI)

### New Dependencies

```json
{
  "dependencies": {
    "commander": "^13.0.0",
    "picocolors": "^1.0.0",
    "ora": "^8.0.0",
    "@clack/prompts": "^0.7.0"
  }
}
```

---

## 🧪 Testing Requirements

### Unit Tests

- [ ] Each command parses options correctly
- [ ] Help text includes all options
- [ ] Version command shows correct version
- [ ] Exit codes are correct

### Integration Tests

- [ ] `dsai init` creates config file
- [ ] `dsai tokens build` produces output
- [ ] `dsai config` shows resolved config
- [ ] Commands respect --quiet flag

### E2E Tests

- [ ] Full workflow from init to build
- [ ] Works in fresh directory
- [ ] Works with custom config path

---

## 📖 Documentation Requirements

- [ ] README with all commands
- [ ] Usage examples for each command
- [ ] Configuration flag reference
- [ ] Exit code documentation
- [ ] Troubleshooting guide

---

## 🔄 Implementation Steps

### Step 1: Define CLI Types

**src/cli/types.ts:**

```typescript
/**
 * CLI type definitions
 *
 * @packageDocumentation
 */

/**
 * Global CLI options available to all commands
 */
export interface GlobalOptions {
  /** Custom config file path */
  config?: string;

  /** Working directory */
  cwd?: string;

  /** Enable debug mode */
  debug?: boolean;

  /** Quiet mode - no spinners or colors */
  quiet?: boolean;

  /** Dry run - don't write files */
  dryRun?: boolean;
}

/**
 * Token build command options
 */
export interface TokensBuildOptions extends GlobalOptions {
  /** Platforms to build (default: all) */
  platforms?: string[];

  /** Watch mode */
  watch?: boolean;

  /** Clean output before build */
  clean?: boolean;
}

/**
 * Token validate command options
 */
export interface TokensValidateOptions extends GlobalOptions {
  /** Fix issues automatically */
  fix?: boolean;

  /** Validation strictness */
  strict?: boolean;
}

/**
 * Token sync command options
 */
export interface TokensSyncOptions extends GlobalOptions {
  /** Sync format */
  format?: 'flat' | 'nested';
}

/**
 * Icons build command options
 */
export interface IconsBuildOptions extends GlobalOptions {
  /** Icon format */
  format?: 'svg' | 'react' | 'vue';

  /** Optimize SVGs */
  optimize?: boolean;
}

/**
 * Init command options
 */
export interface InitOptions extends GlobalOptions {
  /** Skip prompts, use defaults */
  yes?: boolean;

  /** Template to use */
  template?: 'minimal' | 'full' | 'enterprise';
}

/**
 * CLI context passed to commands
 */
export interface CLIContext {
  /** Resolved working directory */
  cwd: string;

  /** Package version */
  version: string;

  /** Debug mode enabled */
  debug: boolean;

  /** Quiet mode enabled */
  quiet: boolean;

  /** Logger instance */
  logger: Logger;

  /** Spinner instance */
  spinner: Spinner;
}

/**
 * Logger interface
 */
export interface Logger {
  info(message: string): void;
  success(message: string): void;
  warn(message: string): void;
  error(message: string): void;
  debug(message: string): void;
  log(message: string): void;
}

/**
 * Spinner interface
 */
export interface Spinner {
  start(text: string): void;
  stop(text?: string): void;
  succeed(text?: string): void;
  fail(text?: string): void;
  warn(text?: string): void;
  info(text?: string): void;
}

/**
 * Exit codes
 */
export const ExitCode = {
  Success: 0,
  GeneralError: 1,
  ConfigError: 2,
  ValidationError: 3,
  BuildError: 4,
  IOError: 5,
} as const;

export type ExitCode = (typeof ExitCode)[keyof typeof ExitCode];
```

### Step 2: Implement UI Utilities

**src/cli/ui/colors.ts:**

```typescript
/**
 * Color utilities
 *
 * Wraps picocolors with NO_COLOR support
 *
 * @packageDocumentation
 */

import pc from 'picocolors';

/**
 * Check if colors are disabled
 */
function colorsDisabled(): boolean {
  return (
    process.env.NO_COLOR !== undefined || process.env.FORCE_COLOR === '0' || !process.stdout.isTTY
  );
}

/**
 * Conditionally apply color
 */
function maybeColor(fn: (s: string) => string, text: string): string {
  return colorsDisabled() ? text : fn(text);
}

/**
 * Color utilities
 */
export const colors = {
  // Text colors
  red: (text: string) => maybeColor(pc.red, text),
  green: (text: string) => maybeColor(pc.green, text),
  yellow: (text: string) => maybeColor(pc.yellow, text),
  blue: (text: string) => maybeColor(pc.blue, text),
  magenta: (text: string) => maybeColor(pc.magenta, text),
  cyan: (text: string) => maybeColor(pc.cyan, text),
  gray: (text: string) => maybeColor(pc.gray, text),
  white: (text: string) => maybeColor(pc.white, text),

  // Modifiers
  bold: (text: string) => maybeColor(pc.bold, text),
  dim: (text: string) => maybeColor(pc.dim, text),
  italic: (text: string) => maybeColor(pc.italic, text),
  underline: (text: string) => maybeColor(pc.underline, text),

  // Background colors
  bgRed: (text: string) => maybeColor(pc.bgRed, text),
  bgGreen: (text: string) => maybeColor(pc.bgGreen, text),
  bgYellow: (text: string) => maybeColor(pc.bgYellow, text),
  bgBlue: (text: string) => maybeColor(pc.bgBlue, text),

  // Semantic colors
  error: (text: string) => maybeColor(pc.red, text),
  success: (text: string) => maybeColor(pc.green, text),
  warning: (text: string) => maybeColor(pc.yellow, text),
  info: (text: string) => maybeColor(pc.blue, text),
  muted: (text: string) => maybeColor(pc.gray, text),

  // Combined styles
  label: (text: string) => maybeColor(pc.bold, maybeColor(pc.cyan, text)),
  value: (text: string) => maybeColor(pc.yellow, text),
  path: (text: string) => maybeColor(pc.underline, maybeColor(pc.cyan, text)),
  command: (text: string) => maybeColor(pc.bold, maybeColor(pc.green, text)),
};

export default colors;
```

**src/cli/ui/spinner.ts:**

```typescript
/**
 * Spinner utilities
 *
 * @packageDocumentation
 */

import ora, { type Ora } from 'ora';
import type { Spinner } from '../types.js';

/**
 * Create a spinner instance
 *
 * @param quiet - If true, spinner is disabled
 */
export function createSpinner(quiet = false): Spinner {
  if (quiet) {
    return {
      start: () => {},
      stop: () => {},
      succeed: () => {},
      fail: () => {},
      warn: () => {},
      info: () => {},
    };
  }

  let instance: Ora | null = null;

  return {
    start(text: string): void {
      instance = ora(text).start();
    },

    stop(text?: string): void {
      if (instance) {
        if (text) instance.text = text;
        instance.stop();
        instance = null;
      }
    },

    succeed(text?: string): void {
      if (instance) {
        instance.succeed(text);
        instance = null;
      }
    },

    fail(text?: string): void {
      if (instance) {
        instance.fail(text);
        instance = null;
      }
    },

    warn(text?: string): void {
      if (instance) {
        instance.warn(text);
        instance = null;
      }
    },

    info(text?: string): void {
      if (instance) {
        instance.info(text);
        instance = null;
      }
    },
  };
}
```

**src/cli/ui/logger.ts:**

```typescript
/**
 * Logger utilities
 *
 * @packageDocumentation
 */

import type { Logger } from '../types.js';
import colors from './colors.js';

/**
 * Logger options
 */
export interface LoggerOptions {
  /** Quiet mode - minimal output */
  quiet?: boolean;

  /** Debug mode - verbose output */
  debug?: boolean;

  /** Custom prefix */
  prefix?: string;
}

/**
 * Create a logger instance
 */
export function createLogger(options: LoggerOptions = {}): Logger {
  const { quiet = false, debug = false, prefix = '' } = options;

  const prefixStr = prefix ? `${colors.muted(`[${prefix}]`)} ` : '';

  return {
    log(message: string): void {
      if (!quiet) {
        console.log(`${prefixStr}${message}`);
      }
    },

    info(message: string): void {
      if (!quiet) {
        console.log(`${prefixStr}${colors.info('ℹ')} ${message}`);
      }
    },

    success(message: string): void {
      console.log(`${prefixStr}${colors.success('✔')} ${message}`);
    },

    warn(message: string): void {
      console.warn(`${prefixStr}${colors.warning('⚠')} ${message}`);
    },

    error(message: string): void {
      console.error(`${prefixStr}${colors.error('✖')} ${message}`);
    },

    debug(message: string): void {
      if (debug) {
        console.log(`${prefixStr}${colors.muted('DEBUG')} ${colors.dim(message)}`);
      }
    },
  };
}

/**
 * Format a duration in milliseconds
 */
export function formatDuration(ms: number): string {
  if (ms < 1000) {
    return `${ms}ms`;
  }
  if (ms < 60000) {
    return `${(ms / 1000).toFixed(2)}s`;
  }
  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(0);
  return `${minutes}m ${seconds}s`;
}

/**
 * Format bytes to human readable
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}
```

### Step 3: Create Program Entry Point

**src/cli/create-program.ts:**

```typescript
/**
 * CLI program creation
 *
 * @packageDocumentation
 */

import { Command } from 'commander';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import colors from './ui/colors.js';

/**
 * Get package version
 */
function getVersion(): string {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const packagePath = join(__dirname, '../../package.json');

  try {
    const pkg = JSON.parse(readFileSync(packagePath, 'utf-8'));
    return pkg.version || '0.0.0';
  } catch {
    return '0.0.0';
  }
}

/**
 * Create the main CLI program
 */
export function createProgram(): Command {
  const version = getVersion();

  const program = new Command()
    .name('dsai')
    .description(
      `${colors.bold('DSAI Tools')} - Design System AI Toolkit\n\n` +
        `Build, validate, and manage design tokens and icons.`
    )
    .version(version, '-v, --version', 'Show version number')
    .helpOption('-h, --help', 'Show help')
    .configureHelp({
      sortSubcommands: true,
      sortOptions: true,
    });

  // Global options
  program
    .option('-c, --config <path>', 'Path to config file')
    .option('--cwd <dir>', 'Working directory', process.cwd())
    .option('--debug', 'Enable debug mode', false)
    .option('-q, --quiet', 'Quiet mode - minimal output', false)
    .option('--dry-run', "Dry run - don't write files", false);

  // Custom help formatting
  program.addHelpText(
    'after',
    `
${colors.bold('Examples:')}
  ${colors.muted('# Initialize configuration')}
  $ dsai init

  ${colors.muted('# Build all tokens')}
  $ dsai tokens build

  ${colors.muted('# Validate tokens with fixes')}
  $ dsai tokens validate --fix

  ${colors.muted('# Build icons as React components')}
  $ dsai icons build --format react

${colors.bold('Documentation:')}
  ${colors.cyan('https://github.com/michelve/dsai')}
`
  );

  return program;
}

/**
 * Setup error handling for the program
 */
export function setupErrorHandling(program: Command): void {
  // Handle unknown commands
  program.on('command:*', ([cmd]) => {
    console.error(`${colors.error('Error:')} Unknown command '${cmd}'.\n`);
    console.log(`Run ${colors.command('dsai --help')} for available commands.\n`);
    process.exit(1);
  });

  // Handle missing arguments
  program.showSuggestionAfterError(true);
  program.showHelpAfterError(true);
}
```

### Step 4: Implement Token Commands

**src/cli/commands/tokens.ts:**

```typescript
/**
 * Token commands
 *
 * @packageDocumentation
 */

import { Command } from 'commander';
import type { TokensBuildOptions, TokensValidateOptions, TokensSyncOptions } from '../types.js';
import { loadConfig } from '../../config/index.js';
import { buildTokens, validateTokens, syncTokens } from '../../tokens/index.js';
import { createLogger, createSpinner, formatDuration, colors } from '../ui/index.js';
import { ExitCode } from '../types.js';

/**
 * Create tokens command group
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
      const mergedOpts = { ...globalOpts, ...options };

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
      const mergedOpts = { ...globalOpts, ...options };

      await runTokensValidate(mergedOpts);
    });

  // Sync command
  tokens
    .command('sync')
    .description('Sync tokens flat file')
    .option('-f, --format <format>', 'Output format', 'flat')
    .action(async (options: TokensSyncOptions, command: Command) => {
      const globalOpts = command.parent?.parent?.opts() ?? {};
      const mergedOpts = { ...globalOpts, ...options };

      await runTokensSync(mergedOpts);
    });

  return tokens;
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
    spinner.succeed(`Loaded config from ${colors.path(configPath || 'defaults')}`);

    logger.debug(`Config: ${JSON.stringify(config, null, 2)}`);

    // Parse platforms
    const platforms = options.platforms === 'all' ? undefined : options.platforms?.split(',');

    // Clean if requested
    if (options.clean) {
      spinner.start('Cleaning output directory...');
      // TODO: Implement clean
      spinner.succeed('Cleaned output directory');
    }

    // Run build
    spinner.start('Building tokens...');
    const result = await buildTokens(config, {
      platforms,
      dryRun: options.dryRun,
    });

    if (result.success) {
      const duration = formatDuration(Date.now() - startTime);
      spinner.succeed(
        `Built ${colors.bold(result.filesWritten.toString())} files in ${colors.bold(duration)}`
      );

      // Show file list
      if (!options.quiet && result.files) {
        logger.log('');
        for (const file of result.files) {
          logger.log(`  ${colors.success('✔')} ${colors.path(file.path)}`);
        }
        logger.log('');
      }

      process.exit(ExitCode.Success);
    } else {
      spinner.fail('Build failed');

      for (const error of result.errors ?? []) {
        logger.error(error.message);
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
    const result = await validateTokens(config, {
      fix: options.fix,
      strict: options.strict,
    });

    const { errors, warnings, fixed } = result;

    if (errors.length === 0 && warnings.length === 0) {
      spinner.succeed(`All ${colors.bold(result.totalTokens.toString())} tokens are valid`);
      process.exit(ExitCode.Success);
    }

    if (errors.length > 0) {
      spinner.fail(`Found ${colors.bold(errors.length.toString())} errors`);

      for (const error of errors) {
        logger.error(`${error.path}: ${error.message}`);
      }
    } else {
      spinner.warn(`Found ${colors.bold(warnings.length.toString())} warnings`);
    }

    for (const warning of warnings) {
      logger.warn(`${warning.path}: ${warning.message}`);
    }

    if (fixed.length > 0) {
      logger.success(`Fixed ${colors.bold(fixed.length.toString())} issues`);
    }

    process.exit(errors.length > 0 ? ExitCode.ValidationError : ExitCode.Success);
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

    // Run sync
    spinner.start('Syncing tokens...');
    const result = await syncTokens(config, {
      format: options.format,
      dryRun: options.dryRun,
    });

    if (result.success) {
      spinner.succeed(
        `Synced ${colors.bold(result.tokenCount.toString())} tokens to ${colors.path(result.outputPath)}`
      );
      process.exit(ExitCode.Success);
    } else {
      spinner.fail('Sync failed');
      logger.error(result.error ?? 'Unknown error');
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
```

### Step 5: Implement Init Command

**src/cli/commands/init.ts:**

```typescript
/**
 * Init command
 *
 * @packageDocumentation
 */

import { Command } from 'commander';
import { existsSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import * as p from '@clack/prompts';
import type { InitOptions } from '../types.js';
import { createLogger, colors } from '../ui/index.js';
import { ExitCode } from '../types.js';
import { MINIMAL_CONFIG, FULL_CONFIG, ENTERPRISE_CONFIG } from '../../config/templates.js';

/**
 * Create init command
 */
export function createInitCommand(): Command {
  return new Command('init')
    .description('Initialize DSAI configuration')
    .option('-y, --yes', 'Skip prompts, use defaults', false)
    .option('-t, --template <template>', 'Config template (minimal|full|enterprise)', 'full')
    .action(async (options: InitOptions, command: Command) => {
      const globalOpts = command.parent?.opts() ?? {};
      const mergedOpts = { ...globalOpts, ...options };

      await runInit(mergedOpts);
    });
}

/**
 * Run init
 */
async function runInit(options: InitOptions): Promise<void> {
  const logger = createLogger({
    quiet: options.quiet,
    debug: options.debug,
  });
  const cwd = options.cwd ?? process.cwd();

  console.log();
  p.intro(colors.bold('DSAI Tools Setup'));

  // Check for existing config
  const configFiles = [
    'dsai.config.mjs',
    'dsai.config.js',
    'dsai.config.json',
    '.dsairc.json',
    '.dsairc',
  ];

  const existingConfig = configFiles.find((f) => existsSync(join(cwd, f)));

  if (existingConfig) {
    const overwrite = await p.confirm({
      message: `Config file ${colors.path(existingConfig)} already exists. Overwrite?`,
      initialValue: false,
    });

    if (p.isCancel(overwrite) || !overwrite) {
      p.cancel('Setup cancelled');
      process.exit(ExitCode.Success);
    }
  }

  let template = options.template ?? 'full';
  let prefix = '--dsai-';
  let outputDir = 'dist/tokens';

  // Interactive mode
  if (!options.yes) {
    const answers = await p.group(
      {
        template: () =>
          p.select({
            message: 'Which template would you like to use?',
            options: [
              { value: 'minimal', label: 'Minimal', hint: 'Basic configuration' },
              { value: 'full', label: 'Full', hint: 'All features enabled' },
              { value: 'enterprise', label: 'Enterprise', hint: 'Advanced features + hooks' },
            ],
            initialValue: 'full',
          }),

        prefix: () =>
          p.text({
            message: 'CSS variable prefix:',
            placeholder: '--dsai-',
            initialValue: '--dsai-',
          }),

        outputDir: () =>
          p.text({
            message: 'Token output directory:',
            placeholder: 'dist/tokens',
            initialValue: 'dist/tokens',
          }),
      },
      {
        onCancel: () => {
          p.cancel('Setup cancelled');
          process.exit(ExitCode.Success);
        },
      }
    );

    template = answers.template as string;
    prefix = answers.prefix as string;
    outputDir = answers.outputDir as string;
  }

  // Get template content
  let content: string;
  switch (template) {
    case 'minimal':
      content = MINIMAL_CONFIG.replace('--dsai-', prefix).replace('dist/tokens', outputDir);
      break;
    case 'enterprise':
      content = ENTERPRISE_CONFIG.replace('--dsai-', prefix).replace('dist/tokens', outputDir);
      break;
    case 'full':
    default:
      content = FULL_CONFIG.replace('--dsai-', prefix).replace('dist/tokens', outputDir);
  }

  // Write config file
  const configPath = join(cwd, 'dsai.config.mjs');

  if (!options.dryRun) {
    writeFileSync(configPath, content, 'utf-8');
    logger.debug(`Wrote config to ${configPath}`);
  } else {
    logger.log(colors.dim('Dry run - would write:'));
    logger.log(colors.dim(configPath));
  }

  // Create output directory
  const fullOutputDir = join(cwd, outputDir);
  if (!existsSync(fullOutputDir) && !options.dryRun) {
    mkdirSync(fullOutputDir, { recursive: true });
    logger.debug(`Created directory ${fullOutputDir}`);
  }

  // Show next steps
  console.log();
  p.note(
    `${colors.muted('1.')} Edit ${colors.path('dsai.config.mjs')} to customize settings\n` +
      `${colors.muted('2.')} Add your tokens to ${colors.path('collections/')}\n` +
      `${colors.muted('3.')} Run ${colors.command('dsai tokens build')} to generate output`,
    'Next steps'
  );

  p.outro(colors.success('Setup complete!'));

  process.exit(ExitCode.Success);
}
```

### Step 6: Implement Config Command

**src/cli/commands/config.ts:**

```typescript
/**
 * Config command
 *
 * @packageDocumentation
 */

import { Command } from 'commander';
import type { GlobalOptions } from '../types.js';
import { loadConfig, resolveConfig } from '../../config/index.js';
import { createLogger, createSpinner, colors } from '../ui/index.js';
import { ExitCode } from '../types.js';

/**
 * Create config command
 */
export function createConfigCommand(): Command {
  return new Command('config')
    .description('Display resolved configuration')
    .option('--json', 'Output as JSON', false)
    .action(async (options: GlobalOptions & { json?: boolean }, command: Command) => {
      const globalOpts = command.parent?.opts() ?? {};
      const mergedOpts = { ...globalOpts, ...options };

      await runConfig(mergedOpts);
    });
}

/**
 * Run config display
 */
async function runConfig(options: GlobalOptions & { json?: boolean }): Promise<void> {
  const logger = createLogger({
    quiet: options.quiet,
    debug: options.debug,
  });
  const spinner = createSpinner(options.quiet);

  try {
    spinner.start('Loading configuration...');
    const { config, configPath } = await loadConfig({
      cwd: options.cwd,
      configPath: options.config,
    });
    spinner.stop();

    if (options.json) {
      console.log(JSON.stringify(config, null, 2));
    } else {
      console.log();
      console.log(colors.bold('DSAI Configuration'));
      console.log(colors.muted('─'.repeat(50)));
      console.log();

      // Config file location
      console.log(`${colors.label('Config file:')} ${colors.path(configPath || 'defaults')}`);
      console.log();

      // Global settings
      console.log(colors.bold('Global'));
      console.log(`  ${colors.muted('Debug:')} ${config.global.debug}`);
      console.log(`  ${colors.muted('Verbose:')} ${config.global.verbose}`);
      console.log();

      // Token settings
      console.log(colors.bold('Tokens'));
      console.log(`  ${colors.muted('Source:')} ${colors.path(config.tokens.sourceDir)}`);
      console.log(`  ${colors.muted('Output:')} ${colors.path(config.tokens.outputDir)}`);
      console.log(`  ${colors.muted('Prefix:')} ${config.tokens.prefix}`);
      console.log(`  ${colors.muted('Base font size:')} ${config.tokens.baseFontSize}px`);
      console.log(`  ${colors.muted('Output references:')} ${config.tokens.outputReferences}`);
      console.log();

      // Icons settings
      console.log(colors.bold('Icons'));
      console.log(`  ${colors.muted('Source:')} ${colors.path(config.icons.sourceDir)}`);
      console.log(`  ${colors.muted('Output:')} ${colors.path(config.icons.outputDir)}`);
      console.log(`  ${colors.muted('Format:')} ${config.icons.format}`);
      console.log(`  ${colors.muted('Optimize:')} ${config.icons.optimize}`);
      console.log();
    }

    process.exit(ExitCode.Success);
  } catch (error) {
    spinner.fail('Failed to load configuration');

    if (error instanceof Error) {
      logger.error(error.message);
    }

    process.exit(ExitCode.ConfigError);
  }
}
```

### Step 7: Main CLI Entry Point

**src/cli/index.ts:**

```typescript
#!/usr/bin/env node

/**
 * DSAI Tools CLI
 *
 * @packageDocumentation
 */

import { createProgram, setupErrorHandling } from './create-program.js';
import { createTokensCommand } from './commands/tokens.js';
import { createIconsCommand } from './commands/icons.js';
import { createInitCommand } from './commands/init.js';
import { createConfigCommand } from './commands/config.js';
import colors from './ui/colors.js';
import { ExitCode } from './types.js';

/**
 * Main CLI entry point
 */
async function main(): Promise<void> {
  const program = createProgram();

  // Register commands
  program.addCommand(createTokensCommand());
  program.addCommand(createIconsCommand());
  program.addCommand(createInitCommand());
  program.addCommand(createConfigCommand());

  // Setup error handling
  setupErrorHandling(program);

  // Parse arguments
  try {
    await program.parseAsync(process.argv);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`${colors.error('Error:')} ${error.message}`);
      if (process.env.DEBUG) {
        console.error(error.stack);
      }
    }
    process.exit(ExitCode.GeneralError);
  }
}

// Run
main().catch((error) => {
  console.error(error);
  process.exit(ExitCode.GeneralError);
});
```

### Step 8: Update Package.json

**Add to packages/@dsai/tools/package.json:**

```json
{
  "bin": {
    "dsai": "./dist/cli/index.js",
    "dsai-tools": "./dist/cli/index.js"
  },
  "scripts": {
    "dev": "tsup --watch",
    "build": "tsup"
  }
}
```

---

## 📝 Notes

### CLI Usage Examples

```bash
# Global installation
npm install -g @dsai/tools
dsai init
dsai tokens build

# Local usage with npx
npx @dsai/tools init
npx @dsai/tools tokens build

# Workspace usage
pnpm exec dsai tokens build --platforms css,js
pnpm exec dsai tokens validate --fix

# CI usage (quiet mode, explicit exit codes)
dsai tokens build --quiet && dsai tokens validate --strict

# Custom config
dsai tokens build --config ./my-config.mjs --cwd ./packages/design-tokens

# Debug mode
dsai tokens build --debug 2>&1 | tee build.log
```

### Compatibility Notes

- Uses ESM throughout
- Requires Node.js 18+
- Respects NO_COLOR environment variable
- Exit codes follow conventions (0 success, non-zero failure)

---

## ✅ Definition of Done

- [ ] CLI binary works globally and via npx
- [ ] All commands implemented with options
- [ ] Help text clear and complete
- [ ] Spinners and colors work (with NO_COLOR support)
- [ ] Exit codes correct for CI
- [ ] Init wizard creates valid config
- [ ] All tests pass
- [ ] Documentation complete
