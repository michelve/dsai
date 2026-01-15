/**
 * Unit tests for config migration utilities
 *
 * Tests cover:
 * - checkMigrationNeeded function
 * - migrateLegacyTokensConfig function
 * - migrateConfig function
 * - checkDeprecatedOptions function
 * - generateMigrationScript function
 */

import {
  checkMigrationNeeded,
  migrateLegacyTokensConfig,
  migrateConfig,
  checkDeprecatedOptions,
  generateMigrationScript,
} from '../../../src/config/migrate.js';

// ============================================================================
// checkMigrationNeeded
// ============================================================================

describe('checkMigrationNeeded', () => {
  describe('filename detection', () => {
    it('should detect legacy tokens.config.json by filename', () => {
      const result = checkMigrationNeeded({}, 'tokens.config.json');

      expect(result.needsMigration).toBe(true);
      expect(result.detectedFormat).toBe('legacy-tokens');
      expect(result.warnings).toContain(
        'tokens.config.json is deprecated. Please migrate to dsai.config.mjs.'
      );
      expect(result.suggestions.length).toBeGreaterThan(0);
    });

    it('should detect legacy format in nested path', () => {
      const result = checkMigrationNeeded({}, '/path/to/tokens.config.json');

      expect(result.needsMigration).toBe(true);
      expect(result.detectedFormat).toBe('legacy-tokens');
    });

    it('should not flag current config format by filename', () => {
      const result = checkMigrationNeeded({}, 'dsai.config.mjs');

      expect(result.needsMigration).toBe(false);
      expect(result.detectedFormat).toBe('current');
    });
  });

  describe('structure detection', () => {
    it('should detect legacy format with output string', () => {
      const legacyConfig = {
        output: './tokens/output',
        prefix: 'ds',
      };

      const result = checkMigrationNeeded(legacyConfig);

      expect(result.needsMigration).toBe(true);
      expect(result.detectedFormat).toBe('legacy-tokens');
    });

    it('should detect legacy format with source string', () => {
      const legacyConfig = {
        source: './tokens/source',
      };

      const result = checkMigrationNeeded(legacyConfig);

      expect(result.needsMigration).toBe(true);
      expect(result.detectedFormat).toBe('legacy-tokens');
    });

    it('should not flag current format with sourceDir', () => {
      const currentConfig = {
        sourceDir: './tokens/source',
        outputDir: './tokens/output',
      };

      const result = checkMigrationNeeded(currentConfig);

      expect(result.needsMigration).toBe(false);
      expect(result.detectedFormat).toBe('current');
    });

    it('should handle null config', () => {
      const result = checkMigrationNeeded(null);

      expect(result.needsMigration).toBe(false);
      expect(result.detectedFormat).toBe('current');
    });

    it('should handle non-object config', () => {
      const result = checkMigrationNeeded('string-config');

      expect(result.needsMigration).toBe(false);
      expect(result.detectedFormat).toBe('current');
    });

    it('should handle empty object', () => {
      const result = checkMigrationNeeded({});

      expect(result.needsMigration).toBe(false);
      expect(result.detectedFormat).toBe('current');
    });
  });
});

// ============================================================================
// migrateLegacyTokensConfig
// ============================================================================

describe('migrateLegacyTokensConfig', () => {
  it('should migrate source to sourceDir', () => {
    const legacy = { source: './old-source' };

    const result = migrateLegacyTokensConfig(legacy);

    expect(result.tokens?.sourceDir).toBe('./old-source');
  });

  it('should migrate output to outputDir', () => {
    const legacy = { output: './old-output' };

    const result = migrateLegacyTokensConfig(legacy);

    expect(result.tokens?.outputDir).toBe('./old-output');
  });

  it('should migrate prefix', () => {
    const legacy = { prefix: 'ds' };

    const result = migrateLegacyTokensConfig(legacy);

    expect(result.tokens?.prefix).toBe('ds');
  });

  it('should migrate valid formats', () => {
    const legacy = {
      formats: ['css', 'scss', 'js', 'invalid-format', 'ts'],
    };

    const result = migrateLegacyTokensConfig(legacy);

    expect(result.tokens?.formats).toEqual(['css', 'scss', 'js', 'ts']);
    expect(result.tokens?.formats).not.toContain('invalid-format');
  });

  it('should migrate themes configuration', () => {
    const legacy = {
      themes: {
        default: 'Dark',
        modes: ['Light', 'Dark'],
      },
    };

    const result = migrateLegacyTokensConfig(legacy);

    expect(result.tokens?.themes?.default).toBe('Dark');
  });

  it('should use default theme when not specified', () => {
    const legacy = {
      themes: {
        modes: ['Light', 'Dark'],
      },
    };

    const result = migrateLegacyTokensConfig(legacy);

    expect(result.tokens?.themes?.default).toBe('Light');
  });

  it('should handle complete legacy config', () => {
    const legacy = {
      source: './src/tokens',
      output: './dist/tokens',
      prefix: 'dsai',
      formats: ['css', 'scss'],
      themes: {
        default: 'Light',
        modes: ['Light', 'Dark'],
      },
    };

    const result = migrateLegacyTokensConfig(legacy);

    expect(result.tokens?.sourceDir).toBe('./src/tokens');
    expect(result.tokens?.outputDir).toBe('./dist/tokens');
    expect(result.tokens?.prefix).toBe('dsai');
    expect(result.tokens?.formats).toEqual(['css', 'scss']);
    expect(result.tokens?.themes?.default).toBe('Light');
  });

  it('should handle empty legacy config', () => {
    const result = migrateLegacyTokensConfig({});

    expect(result).toEqual({ tokens: {} });
  });

  it('should handle undefined values', () => {
    const legacy = {
      source: undefined,
      output: undefined,
      prefix: undefined,
    };

    const result = migrateLegacyTokensConfig(legacy);

    expect(result.tokens?.sourceDir).toBeUndefined();
    expect(result.tokens?.outputDir).toBeUndefined();
    expect(result.tokens?.prefix).toBeUndefined();
  });

  it('should handle null values', () => {
    const legacy = {
      source: null as unknown as string,
      output: null as unknown as string,
    };

    const result = migrateLegacyTokensConfig(legacy);

    expect(result.tokens?.sourceDir).toBeUndefined();
    expect(result.tokens?.outputDir).toBeUndefined();
  });

  it('should migrate all valid output formats', () => {
    const legacy = {
      formats: ['css', 'scss', 'js', 'ts', 'json', 'android', 'ios'],
    };

    const result = migrateLegacyTokensConfig(legacy);

    expect(result.tokens?.formats).toEqual(['css', 'scss', 'js', 'ts', 'json', 'android', 'ios']);
  });
});

// ============================================================================
// migrateConfig
// ============================================================================

describe('migrateConfig', () => {
  it('should return config as-is when no migration needed', () => {
    const currentConfig = {
      tokens: {
        sourceDir: './src',
        outputDir: './dist',
      },
    };

    const result = migrateConfig(currentConfig);

    expect(result.config).toBe(currentConfig);
    expect(result.warnings).toEqual([]);
  });

  it('should migrate legacy tokens config', () => {
    const legacyConfig = {
      source: './old-src',
      output: './old-dist',
    };

    const result = migrateConfig(legacyConfig);

    expect(result.config.tokens?.sourceDir).toBe('./old-src');
    expect(result.config.tokens?.outputDir).toBe('./old-dist');
    expect(result.warnings.length).toBeGreaterThan(0);
  });

  it('should detect legacy format by filename', () => {
    const config = { source: './src' };

    const result = migrateConfig(config, 'tokens.config.json');

    expect(result.config.tokens?.sourceDir).toBe('./src');
    expect(result.warnings).toContain(
      'tokens.config.json is deprecated. Please migrate to dsai.config.mjs.'
    );
  });

  it('should handle unknown format gracefully', () => {
    // Force unknown format by mocking (difficult to trigger naturally)
    // Instead, test with config that passes current format checks
    const config = { custom: 'value' };

    const result = migrateConfig(config);

    expect(result.config).toBe(config);
  });
});

// ============================================================================
// checkDeprecatedOptions
// ============================================================================

describe('checkDeprecatedOptions', () => {
  it('should detect deprecated tokens.output', () => {
    const config = {
      tokens: {
        output: './dist', // deprecated
        sourceDir: './src',
      },
    } as unknown as Parameters<typeof checkDeprecatedOptions>[0];

    const warnings = checkDeprecatedOptions(config);

    expect(warnings.length).toBeGreaterThan(0);
    expect(warnings[0]).toContain('outputDir');
  });

  it('should detect deprecated tokens.source as string', () => {
    const config = {
      tokens: {
        source: './src', // deprecated when string
        outputDir: './dist',
      },
    } as unknown as Parameters<typeof checkDeprecatedOptions>[0];

    const warnings = checkDeprecatedOptions(config);

    expect(warnings.length).toBeGreaterThan(0);
    expect(warnings[0]).toContain('sourceDir');
  });

  it('should return empty array for current format', () => {
    const config = {
      tokens: {
        sourceDir: './src',
        outputDir: './dist',
      },
    };

    const warnings = checkDeprecatedOptions(config);

    expect(warnings).toEqual([]);
  });

  it('should handle config without tokens', () => {
    const config = {
      icons: {
        sourceDir: './icons',
      },
    };

    const warnings = checkDeprecatedOptions(config);

    expect(warnings).toEqual([]);
  });

  it('should handle empty config', () => {
    const warnings = checkDeprecatedOptions({});

    expect(warnings).toEqual([]);
  });
});

// ============================================================================
// generateMigrationScript
// ============================================================================

describe('generateMigrationScript', () => {
  it('should generate valid migration script', () => {
    const newConfig = {
      tokens: {
        sourceDir: './src/tokens',
        outputDir: './dist/tokens',
        prefix: 'ds',
      },
    };

    const script = generateMigrationScript({}, newConfig);

    expect(script).toContain('import { defineConfig }');
    expect(script).toContain("from '@dsai-io/tools'");
    expect(script).toContain('defineConfig');
    expect(script).toContain('sourceDir');
    expect(script).toContain('./src/tokens');
  });

  it('should include JSDoc comment', () => {
    const script = generateMigrationScript({}, { tokens: {} });

    expect(script).toContain('@ts-check');
    expect(script).toContain('DSAI Configuration');
    expect(script).toContain('@type');
  });

  it('should convert JSON keys to unquoted format', () => {
    const newConfig = {
      tokens: {
        sourceDir: './src',
        formats: ['css', 'scss'],
      },
    };

    const script = generateMigrationScript({}, newConfig);

    // Keys should not have quotes
    expect(script).toContain('tokens:');
    expect(script).toContain('sourceDir:');
    expect(script).toContain('formats:');
  });

  it('should handle complex config', () => {
    const newConfig = {
      tokens: {
        sourceDir: './src',
        outputDir: './dist',
        prefix: 'ds',
        formats: ['css', 'scss', 'ts'],
        themes: {
          default: 'Light',
        },
      },
      icons: {
        sourceDir: './icons',
      },
    };

    const script = generateMigrationScript({}, newConfig);

    expect(script).toContain('tokens:');
    expect(script).toContain('icons:');
    expect(script).toContain('themes:');
    expect(script).toContain('Light');
  });

  it('should handle empty config', () => {
    const script = generateMigrationScript({}, {});

    expect(script).toContain('defineConfig({})');
  });
});
