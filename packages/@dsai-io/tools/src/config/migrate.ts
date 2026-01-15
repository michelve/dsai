/**
 * Legacy configuration migration utilities
 *
 * Provides migration support for older config formats and helps users
 * upgrade to the latest configuration schema.
 *
 * @packageDocumentation
 */

import type { DsaiConfig, TokensConfig } from './types.js';

// ============================================================================
// Types
// ============================================================================

/**
 * Legacy tokens.config.json format (v0.x)
 */
interface LegacyTokensConfig {
  /** Source directory for tokens */
  source?: string;
  /** Output directory */
  output?: string;
  /** CSS prefix */
  prefix?: string;
  /** Output formats */
  formats?: string[];
  /** Theme configuration */
  themes?: {
    default?: string;
    modes?: string[];
  };
}

/**
 * Result of migration check
 */
export interface MigrationCheck {
  /** Whether migration is needed */
  needsMigration: boolean;
  /** Detected config version or format */
  detectedFormat: ConfigFormat;
  /** Warnings about deprecated options */
  warnings: string[];
  /** Suggested migration steps */
  suggestions: string[];
}

/**
 * Supported configuration formats
 */
export type ConfigFormat =
  | 'current' // dsai.config.mjs/js/ts
  | 'legacy-tokens' // tokens.config.json (v0.x)
  | 'unknown';

// ============================================================================
// Migration Detection
// ============================================================================

/**
 * Check if a configuration needs migration
 *
 * @param config - Raw configuration object
 * @param filename - Optional filename for format detection
 * @returns Migration check result
 *
 * @example
 * ```typescript
 * const check = checkMigrationNeeded(oldConfig, 'tokens.config.json');
 * if (check.needsMigration) {
 *   console.log('Migration needed:', check.suggestions);
 * }
 * ```
 */
export function checkMigrationNeeded(config: unknown, filename?: string): MigrationCheck {
  const warnings: string[] = [];
  const suggestions: string[] = [];

  // Check filename for legacy format
  if (filename?.includes('tokens.config.json')) {
    warnings.push('tokens.config.json is deprecated. Please migrate to dsai.config.mjs.');
    suggestions.push('Run: npx @dsai-io/tools migrate to automatically migrate your config.');

    return {
      needsMigration: true,
      detectedFormat: 'legacy-tokens',
      warnings,
      suggestions,
    };
  }

  // Check for legacy structure
  if (isLegacyTokensConfig(config)) {
    warnings.push('Legacy configuration format detected. Some options may be deprecated.');
    suggestions.push('Consider updating to the new configuration format.');

    return {
      needsMigration: true,
      detectedFormat: 'legacy-tokens',
      warnings,
      suggestions,
    };
  }

  return {
    needsMigration: false,
    detectedFormat: 'current',
    warnings,
    suggestions,
  };
}

/**
 * Type guard for legacy tokens config
 */
function isLegacyTokensConfig(config: unknown): config is LegacyTokensConfig {
  if (typeof config !== 'object' || config === null) {
    return false;
  }

  const obj = config as Record<string, unknown>;

  // Legacy format has 'output' instead of 'outputDir'
  // and 'source' as a string path instead of structured source config
  return (
    typeof obj['output'] === 'string' ||
    (typeof obj['source'] === 'string' && !('sourceDir' in obj))
  );
}

// ============================================================================
// Migration Functions
// ============================================================================

/**
 * Migrate legacy tokens.config.json to new format
 *
 * @param legacy - Legacy configuration object
 * @returns Migrated configuration
 *
 * @example
 * ```typescript
 * const oldConfig = require('./tokens.config.json');
 * const newConfig = migrateLegacyTokensConfig(oldConfig);
 * ```
 */
export function migrateLegacyTokensConfig(legacy: LegacyTokensConfig): DsaiConfig {
  const tokens: TokensConfig = {};

  // Migrate source → sourceDir
  if (legacy.source !== undefined && legacy.source !== null) {
    tokens.sourceDir = legacy.source;
  }

  // Migrate output → outputDir
  if (legacy.output !== undefined && legacy.output !== null) {
    tokens.outputDir = legacy.output;
  }

  // Direct migrations
  if (legacy.prefix !== undefined && legacy.prefix !== null) {
    tokens.prefix = legacy.prefix;
  }

  if (Array.isArray(legacy.formats)) {
    // Filter to only valid formats
    const validFormats = ['css', 'scss', 'js', 'ts', 'json', 'android', 'ios'] as const;
    tokens.formats = legacy.formats.filter((f): f is (typeof validFormats)[number] =>
      validFormats.includes(f as (typeof validFormats)[number])
    );
  }

  // Migrate themes
  if (legacy.themes !== undefined && legacy.themes !== null) {
    tokens.themes = {
      default: legacy.themes.default ?? 'Light',
      // ignoreModes can be derived from modes if needed
    };
  }

  return { tokens };
}

/**
 * Migrate any legacy configuration to current format
 *
 * @param config - Raw configuration (any format)
 * @param filename - Optional filename for format detection
 * @returns Migrated configuration and warnings
 *
 * @example
 * ```typescript
 * const { config, warnings } = migrateConfig(rawConfig, 'tokens.config.json');
 * if (warnings.length > 0) {
 *   warnings.forEach(w => console.warn(w));
 * }
 * ```
 */
export function migrateConfig(
  config: unknown,
  filename?: string
): { config: DsaiConfig; warnings: string[] } {
  const check = checkMigrationNeeded(config, filename);

  if (!check.needsMigration) {
    return {
      config: config as DsaiConfig,
      warnings: check.warnings,
    };
  }

  switch (check.detectedFormat) {
    case 'legacy-tokens':
      return {
        config: migrateLegacyTokensConfig(config as LegacyTokensConfig),
        warnings: check.warnings,
      };

    default:
      return {
        config: config as DsaiConfig,
        warnings: [...check.warnings, 'Unknown config format - using as-is.'],
      };
  }
}

// ============================================================================
// Deprecation Warnings
// ============================================================================

/**
 * Check for deprecated options in a configuration
 *
 * @param config - Configuration to check
 * @returns Array of deprecation warnings
 */
export function checkDeprecatedOptions(config: DsaiConfig): string[] {
  const warnings: string[] = [];

  // Check tokens.output (legacy)
  const configAny = config as Record<string, unknown>;
  const tokens = configAny['tokens'] as Record<string, unknown> | undefined;

  if (tokens !== undefined) {
    if ('output' in tokens) {
      warnings.push(
        `Deprecated: Use 'tokens.outputDir' instead of 'tokens.output' (tokens.outputDir)`
      );
    }
    if ('source' in tokens && typeof tokens['source'] === 'string') {
      warnings.push(
        `Deprecated: Use 'tokens.sourceDir' instead of 'tokens.source' for directory paths (tokens.sourceDir)`
      );
    }
  }

  return warnings;
}

/**
 * Generate migration script content
 *
 * @param _oldConfig - Old configuration (unused, reserved for future use)
 * @param newConfig - Migrated configuration
 * @returns String content for new config file
 */
export function generateMigrationScript(_oldConfig: unknown, newConfig: DsaiConfig): string {
  const configJson = JSON.stringify(newConfig, null, '\t');

  return `// @ts-check
/**
 * DSAI Configuration
 *
 * Migrated from legacy format.
 * Please review and adjust as needed.
 *
 * @type {import('@dsai-io/tools').DsaiConfig}
 */
import { defineConfig } from '@dsai-io/tools';

export default defineConfig(${configJson.replace(/"([^"]+)":/g, '$1:')});
`;
}
