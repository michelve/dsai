/**
 * @fileoverview Environment variable parsing for DSAI Tools configuration
 *
 * Reads configuration values from environment variables and converts
 * them to the appropriate types.
 *
 * @module @dsai/tools/config/env
 */

import { envArrayKeys, envBooleanKeys, envMappings, envNumberKeys } from './defaults.js';

import type { DsaiConfig } from './types.js';

// ============================================================================
// Types
// ============================================================================

/**
 * Options for parsing environment variables
 */
export interface EnvParseOptions {
  /** Environment object to read from (default: process.env) */
  env?: NodeJS.ProcessEnv;

  /** Prefix filter for environment variables */
  prefix?: string;
}

// ============================================================================
// Parsing Functions
// ============================================================================

/**
 * Parse a boolean from environment variable value
 *
 * @param value - Environment variable value
 * @returns Parsed boolean or undefined
 */
function parseBoolean(value: string | undefined): boolean | undefined {
  if (value === undefined) {
    return undefined;
  }

  const normalized = value.toLowerCase().trim();

  if (normalized === 'true' || normalized === '1' || normalized === 'yes') {
    return true;
  }

  if (normalized === 'false' || normalized === '0' || normalized === 'no') {
    return false;
  }

  return undefined;
}

/**
 * Parse a number from environment variable value
 *
 * @param value - Environment variable value
 * @returns Parsed number or undefined
 */
function parseNumber(value: string | undefined): number | undefined {
  if (value === undefined) {
    return undefined;
  }

  const num = Number(value);
  return Number.isNaN(num) ? undefined : num;
}

/**
 * Parse an array from environment variable value (comma-separated)
 *
 * @param value - Environment variable value
 * @returns Parsed array or undefined
 */
function parseArray(value: string | undefined): string[] | undefined {
  if (value === undefined || value.trim() === '') {
    return undefined;
  }

  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

/**
 * Set a nested value in an object using dot notation path
 *
 * @param obj - Object to modify
 * @param path - Dot notation path (e.g., 'global.logLevel')
 * @param value - Value to set
 */
function setNestedValue(obj: Record<string, unknown>, path: string, value: unknown): void {
  const parts = path.split('.');

  if (parts.length === 1) {
    const key = parts[0];
    if (key !== undefined) {
      Object.defineProperty(obj, key, {
        value,
        writable: true,
        enumerable: true,
        configurable: true,
      });
    }
    return;
  }

  if (parts.length === 2) {
    const [first, second] = parts;
    if (first !== undefined && second !== undefined) {
      if (!(first in obj)) {
        Object.defineProperty(obj, first, {
          value: {},
          writable: true,
          enumerable: true,
          configurable: true,
        });
      }
      const nested = obj[first] as Record<string, unknown>;
      Object.defineProperty(nested, second, {
        value,
        writable: true,
        enumerable: true,
        configurable: true,
      });
    }
    return;
  }

  if (parts.length === 3) {
    const [first, second, third] = parts;
    if (first !== undefined && second !== undefined && third !== undefined) {
      if (!(first in obj)) {
        Object.defineProperty(obj, first, {
          value: {},
          writable: true,
          enumerable: true,
          configurable: true,
        });
      }
      const nested1 = obj[first] as Record<string, unknown>;
      if (!(second in nested1)) {
        Object.defineProperty(nested1, second, {
          value: {},
          writable: true,
          enumerable: true,
          configurable: true,
        });
      }
      const nested2 = nested1[second] as Record<string, unknown>;
      Object.defineProperty(nested2, third, {
        value,
        writable: true,
        enumerable: true,
        configurable: true,
      });
    }
  }

  // For paths deeper than 3 levels, we don't support them in config
}

// ============================================================================
// Main Functions
// ============================================================================

/**
 * Read configuration values from environment variables
 *
 * Parses environment variables according to the mappings defined in defaults.ts.
 * Supports string, boolean, number, and array types.
 *
 * @param options - Parse options
 * @returns Partial configuration object from environment
 *
 * @example
 * ```typescript
 * // Read from process.env
 * const envConfig = getConfigFromEnv();
 *
 * // Read from custom env object
 * const envConfig = getConfigFromEnv({
 *   env: { DSAI_LOG_LEVEL: 'debug' }
 * });
 * ```
 */
export function getConfigFromEnv(options: EnvParseOptions = {}): Partial<DsaiConfig> {
  const env = options.env ?? process.env;
  const prefix = options.prefix ?? 'DSAI_';

  const config: Record<string, unknown> = {};

  for (const [envKey, configPath] of Object.entries(envMappings)) {
    // Check prefix filter
    if (!envKey.startsWith(prefix)) {
      continue;
    }

    const envValue = env[envKey];
    if (envValue === undefined) {
      continue;
    }

    let parsedValue: unknown;

    // Parse based on expected type
    if (envBooleanKeys.has(envKey)) {
      parsedValue = parseBoolean(envValue);
    } else if (envNumberKeys.has(envKey)) {
      parsedValue = parseNumber(envValue);
    } else if (envArrayKeys.has(envKey)) {
      parsedValue = parseArray(envValue);
    } else {
      // Default to string
      parsedValue = envValue;
    }

    // Only set if we got a valid value
    if (parsedValue !== undefined) {
      setNestedValue(config, configPath, parsedValue);
    }
  }

  return config as Partial<DsaiConfig>;
}

/**
 * Check if running in CI environment
 *
 * Checks common CI environment variables.
 *
 * @param env - Environment object to check
 * @returns True if CI environment detected
 */
export function isCI(env: NodeJS.ProcessEnv = process.env): boolean {
  return (
    env['CI'] === 'true' ||
    env['CONTINUOUS_INTEGRATION'] === 'true' ||
    env['GITHUB_ACTIONS'] === 'true' ||
    env['GITLAB_CI'] === 'true' ||
    env['CIRCLECI'] === 'true' ||
    env['TRAVIS'] === 'true' ||
    env['BUILDKITE'] === 'true' ||
    env['JENKINS_URL'] !== undefined ||
    env['TF_BUILD'] === 'True'
  );
}

/**
 * Check if colors should be disabled based on environment
 *
 * @param env - Environment object to check
 * @returns True if colors should be disabled
 */
export function shouldDisableColors(env: NodeJS.ProcessEnv = process.env): boolean {
  return env['NO_COLOR'] !== undefined || env['FORCE_COLOR'] === '0' || env['TERM'] === 'dumb';
}

/**
 * Get the effective log level from environment
 *
 * Checks DSAI_LOG_LEVEL, DEBUG, and VERBOSE env vars.
 *
 * @param env - Environment object to check
 * @returns Log level string or undefined
 */
export function getLogLevelFromEnv(env: NodeJS.ProcessEnv = process.env): string | undefined {
  const dsaiLogLevel = env['DSAI_LOG_LEVEL'];
  const dsaiDebug = env['DSAI_DEBUG'];
  const debug = env['DEBUG'];
  const verbose = env['VERBOSE'];

  // Explicit DSAI log level takes precedence
  if (dsaiLogLevel) {
    return dsaiLogLevel;
  }

  // Check for debug mode
  if (dsaiDebug === 'true' || debug?.includes('dsai')) {
    return 'debug';
  }

  // Check for verbose mode
  if (verbose === 'true') {
    return 'verbose';
  }

  return undefined;
}

/**
 * Get environment-based overrides for configuration
 *
 * This combines all environment-based settings into a single override object.
 *
 * @param env - Environment object to check
 * @returns Configuration overrides from environment
 */
export function getEnvOverrides(env: NodeJS.ProcessEnv = process.env): Partial<DsaiConfig> {
  const config = getConfigFromEnv({ env });

  // Apply CI detection
  if (isCI(env) && !config.global) {
    config.global = { debug: false };
  }

  // Apply log level from various sources
  const logLevel = getLogLevelFromEnv(env);
  if (logLevel) {
    config.global = {
      ...config.global,
      logLevel: logLevel as 'silent' | 'error' | 'warn' | 'info' | 'debug',
    };
  }

  return config;
}
