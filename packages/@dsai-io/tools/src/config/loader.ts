/**
 * @fileoverview Configuration file loader for DSAI Tools
 *
 * Uses cosmiconfig to load configuration from multiple file formats
 * and locations following standard conventions.
 *
 * @module @dsai-io/tools/config/loader
 */

import path from 'node:path';

import { cosmiconfig, cosmiconfigSync } from 'cosmiconfig';

import { resolveConfig } from './resolver.js';

import type { DsaiConfig, LoadConfigOptions, LoadConfigResult } from './types.js';
import type { CosmiconfigResult, PublicExplorer, PublicExplorerSync } from 'cosmiconfig';

// ============================================================================
// Constants
// ============================================================================

/**
 * Module name for cosmiconfig search
 * This determines the config file naming conventions:
 * - dsai.config.{js,mjs,cjs,ts}
 * - .dsairc
 * - .dsairc.{json,yaml,yml,js,mjs,cjs}
 * - package.json "dsai" key
 */
const MODULE_NAME = 'dsai';

/**
 * Supported configuration file names (in search order)
 */
export const CONFIG_FILE_NAMES = [
  'dsai.config.ts',
  'dsai.config.mjs',
  'dsai.config.js',
  'dsai.config.cjs',
  '.dsairc.ts',
  '.dsairc.mjs',
  '.dsairc.js',
  '.dsairc.cjs',
  '.dsairc.json',
  '.dsairc.yaml',
  '.dsairc.yml',
  '.dsairc',
  'package.json',
];

// ============================================================================
// Loader Instance
// ============================================================================

/**
 * Create a cosmiconfig explorer instance
 *
 * @param options - Optional loader options
 * @returns Cosmiconfig explorer
 */
function createExplorer(options?: { stopDir?: string }): PublicExplorer {
  return cosmiconfig(MODULE_NAME, {
    searchPlaces: CONFIG_FILE_NAMES,
    stopDir: options?.stopDir,
    packageProp: MODULE_NAME,
  });
}

/**
 * Create a synchronous cosmiconfig explorer instance
 *
 * @param options - Optional loader options
 * @returns Cosmiconfig sync explorer
 */
function createExplorerSync(options?: { stopDir?: string }): PublicExplorerSync {
  return cosmiconfigSync(MODULE_NAME, {
    searchPlaces: CONFIG_FILE_NAMES,
    stopDir: options?.stopDir,
    packageProp: MODULE_NAME,
  });
}

// ============================================================================
// Internal Helpers
// ============================================================================

interface FileLoadResult {
  fileConfig: DsaiConfig;
  resolvedConfigPath: string | undefined;
  warnings: string[];
}

function extractConfigFromResult(cosmicResult: CosmiconfigResult): {
  config: DsaiConfig;
  filepath: string | undefined;
} {
  if (cosmicResult && !cosmicResult.isEmpty) {
    return { config: cosmicResult.config as DsaiConfig, filepath: cosmicResult.filepath };
  }
  return { config: {}, filepath: undefined };
}

function resolveAbsolutePath(configPath: string, cwd: string): string {
  return path.isAbsolute(configPath) ? configPath : path.resolve(cwd, configPath);
}

async function loadFileConfig(
  cwd: string,
  configPath: string | undefined
): Promise<FileLoadResult> {
  const explorer = createExplorer({ stopDir: path.dirname(cwd) });
  const warnings: string[] = [];

  try {
    const cosmicResult = configPath
      ? await explorer.load(resolveAbsolutePath(configPath, cwd))
      : await explorer.search(cwd);
    const { config, filepath } = extractConfigFromResult(cosmicResult);
    return { fileConfig: config, resolvedConfigPath: filepath, warnings };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    warnings.push(`Failed to load configuration: ${message}`);
    return { fileConfig: {}, resolvedConfigPath: undefined, warnings };
  }
}

function loadFileConfigSync(
  cwd: string,
  configPath: string | undefined
): FileLoadResult {
  const explorer = createExplorerSync({ stopDir: path.dirname(cwd) });
  const warnings: string[] = [];

  try {
    const cosmicResult = configPath
      ? explorer.load(resolveAbsolutePath(configPath, cwd))
      : explorer.search(cwd);
    const { config, filepath } = extractConfigFromResult(cosmicResult);
    return { fileConfig: config, resolvedConfigPath: filepath, warnings };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    warnings.push(`Failed to load configuration: ${message}`);
    return { fileConfig: {}, resolvedConfigPath: undefined, warnings };
  }
}

function buildConfigResult(
  fileConfig: DsaiConfig,
  resolvedConfigPath: string | undefined,
  warnings: string[],
  cwd: string,
  overrides: LoadConfigOptions['overrides']
): LoadConfigResult {
  const configDir = resolvedConfigPath ? path.dirname(resolvedConfigPath) : cwd;

  const resolvedConfig = resolveConfig(fileConfig, {
    cwd,
    configDir,
    overrides,
  });

  return {
    config: resolvedConfig,
    configPath: resolvedConfigPath,
    warnings,
  };
}

// ============================================================================
// Loading Functions
// ============================================================================

/**
 * Load configuration from file and merge with defaults
 *
 * This is the main entry point for loading configuration.
 * It searches for config files, loads them, validates,
 * and resolves with defaults.
 *
 * @param options - Load options
 * @returns Resolved configuration with metadata
 *
 * @example
 * ```typescript
 * // Load from current directory
 * const result = await loadConfig();
 *
 * // Load from specific path
 * const result = await loadConfig({
 *   configPath: './my-config.js'
 * });
 *
 * // Load with overrides
 * const result = await loadConfig({
 *   overrides: { global: { debug: true } }
 * });
 * ```
 */
export async function loadConfig(options: LoadConfigOptions = {}): Promise<LoadConfigResult> {
  const { cwd = process.cwd(), configPath, overrides, skipFile = false } = options;

  const { fileConfig, resolvedConfigPath, warnings } = skipFile
    ? { fileConfig: {} as DsaiConfig, resolvedConfigPath: undefined, warnings: [] as string[] }
    : await loadFileConfig(cwd, configPath);

  return buildConfigResult(fileConfig, resolvedConfigPath, warnings, cwd, overrides);
}

/**
 * Search for configuration file without loading
 *
 * Useful for checking if a config file exists before operations.
 *
 * @param cwd - Directory to search from
 * @returns Path to config file if found, undefined otherwise
 */
export async function searchConfigFile(cwd: string = process.cwd()): Promise<string | undefined> {
  const explorer = createExplorer();

  try {
    const result = await explorer.search(cwd);
    return result?.filepath;
  } catch {
    return undefined;
  }
}

/**
 * Clear the configuration cache
 *
 * Useful when files have changed and need to be reloaded.
 */
export function clearConfigCache(): void {
  const explorer = createExplorer();
  explorer.clearCaches();
}

/**
 * Load configuration synchronously (limited format support)
 *
 * Note: This only works with JSON and synchronous JS/CJS configs.
 * For full format support including ESM and TypeScript, use loadConfig().
 *
 * @param options - Load options
 * @returns Resolved configuration with metadata
 */
export function loadConfigSync(options: LoadConfigOptions = {}): LoadConfigResult {
  const { cwd = process.cwd(), configPath, overrides, skipFile = false } = options;

  const { fileConfig, resolvedConfigPath, warnings } = skipFile
    ? { fileConfig: {} as DsaiConfig, resolvedConfigPath: undefined, warnings: [] as string[] }
    : loadFileConfigSync(cwd, configPath);

  return buildConfigResult(fileConfig, resolvedConfigPath, warnings, cwd, overrides);
}

// ============================================================================
// Config Helper
// ============================================================================

/**
 * Define configuration with type checking
 *
 * A helper function that provides TypeScript type checking for config files.
 * Use this in your dsai.config.ts or dsai.config.mjs files.
 *
 * @param config - Configuration object
 * @returns The same configuration object with type checking applied
 *
 * @example
 * ```typescript
 * // dsai.config.ts
 * import { defineConfig } from '@dsai-io/tools';
 *
 * export default defineConfig({
 *   tokens: {
 *     prefix: '--myapp-',
 *     formats: ['css', 'scss', 'ts'],
 *   },
 *   icons: {
 *     framework: 'react',
 *   },
 * });
 * ```
 */
export function defineConfig(config: DsaiConfig): DsaiConfig {
  return config;
}

/**
 * Define configuration with async function
 *
 * Allows async operations during configuration creation.
 *
 * @param configFn - Async function returning configuration
 * @returns Promise resolving to the configuration
 *
 * @example
 * ```typescript
 * // dsai.config.ts
 * import { defineConfigAsync } from '@dsai-io/tools';
 *
 * export default defineConfigAsync(async () => {
 *   const baseConfig = await loadExternalConfig();
 *   return {
 *     ...baseConfig,
 *     tokens: {
 *       prefix: '--custom-',
 *     },
 *   };
 * });
 * ```
 */
export function defineConfigAsync(configFn: () => Promise<DsaiConfig>): Promise<DsaiConfig> {
  return configFn();
}
