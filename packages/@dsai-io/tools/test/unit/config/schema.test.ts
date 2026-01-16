/**
 * Unit tests for the configuration schema validation module
 *
 * Tests cover:
 * - Root schema validation
 * - Section-level validation (tokens, icons, global, themes)
 * - Primitive schemas (logLevel, outputFormat, framework)
 * - Custom transform and format schemas
 * - Error formatting
 * - validateConfig and validateConfigOrThrow functions
 */

import {
  validateConfig,
  validateConfigOrThrow,
  validateConfigSection,
  formatValidationErrors,
  formatErrorMessage,
  dsaiConfigSchema,
  logLevelSchema,
  outputFormatSchema,
  frameworkSchema,
  tokensConfigSchema,
  iconsConfigSchema,
  globalConfigSchema,
  themesConfigSchema,
  customTransformSchema,
  customFormatSchema,
  versionSchema,
} from '../../../src/config/schema.js';

// ============================================================================
// Primitive Schema Tests
// ============================================================================

describe('logLevelSchema', () => {
  it.each([
    'silent',
    'error',
    'warn',
    'info',
    'debug',
    'verbose',
  ])('should accept valid log level: %s', (level) => {
    const result = logLevelSchema.safeParse(level);
    expect(result.success).toBe(true);
  });

  it('should reject invalid log level', () => {
    const result = logLevelSchema.safeParse('invalid');
    expect(result.success).toBe(false);
  });
});

describe('outputFormatSchema', () => {
  it.each([
    'css',
    'scss',
    'less',
    'json',
    'js',
    'ts',
    'esm',
    'cjs',
  ])('should accept valid format: %s', (format) => {
    const result = outputFormatSchema.safeParse(format);
    expect(result.success).toBe(true);
  });

  it('should reject invalid format', () => {
    const result = outputFormatSchema.safeParse('html');
    expect(result.success).toBe(false);
  });
});

describe('frameworkSchema', () => {
  it.each([
    'react',
    'vue',
    'angular',
    'svelte',
    'vanilla',
  ])('should accept valid framework: %s', (framework) => {
    const result = frameworkSchema.safeParse(framework);
    expect(result.success).toBe(true);
  });

  it('should reject invalid framework', () => {
    const result = frameworkSchema.safeParse('backbone');
    expect(result.success).toBe(false);
  });
});

describe('versionSchema', () => {
  it.each([
    '1.0.0',
    '0.0.1',
    '10.20.30',
    '1.0.0-alpha',
    '2.3.4-beta.1',
  ])('should accept valid version: %s', (version) => {
    const result = versionSchema.safeParse(version);
    expect(result.success).toBe(true);
  });

  it.each([
    '1.0',
    '1',
    'v1.0.0',
    '1.0.0.0',
    '1.0.0-',
    'invalid',
  ])('should reject invalid version: %s', (version) => {
    const result = versionSchema.safeParse(version);
    expect(result.success).toBe(false);
  });
});

// ============================================================================
// Transform and Format Schema Tests
// ============================================================================

describe('customTransformSchema', () => {
  it('should accept valid transform config', () => {
    const result = customTransformSchema.safeParse({
      name: 'my-transform',
      description: 'Custom transform',
      type: 'value',
    });
    expect(result.success).toBe(true);
  });

  it('should require name field', () => {
    const result = customTransformSchema.safeParse({
      description: 'No name field',
    });
    expect(result.success).toBe(false);
  });

  it('should default type to value', () => {
    const result = customTransformSchema.safeParse({
      name: 'my-transform',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.type).toBe('value');
    }
  });
});

describe('customFormatSchema', () => {
  it('should accept valid format config', () => {
    const result = customFormatSchema.safeParse({
      name: 'my-format',
      description: 'Custom format',
      extension: '.custom',
    });
    expect(result.success).toBe(true);
  });

  it('should require name field', () => {
    const result = customFormatSchema.safeParse({
      extension: '.custom',
    });
    expect(result.success).toBe(false);
  });
});

// ============================================================================
// Section Config Schema Tests
// ============================================================================

describe('tokensConfigSchema', () => {
  it('should accept minimal tokens config', () => {
    const result = tokensConfigSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it('should apply defaults', () => {
    const result = tokensConfigSchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.enabled).toBe(true);
      expect(result.data.prefix).toBe('dsai');
      expect(result.data.createBundle).toBe(true);
    }
  });

  it('should accept full tokens config', () => {
    const result = tokensConfigSchema.safeParse({
      enabled: true,
      sourcePatterns: ['tokens/**/*.json'],
      prefix: 'custom',
      formats: ['css', 'scss', 'json'],
      createBundle: false,
      verbose: true,
    });
    expect(result.success).toBe(true);
  });
});

describe('iconsConfigSchema', () => {
  it('should accept minimal icons config', () => {
    const result = iconsConfigSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it('should apply defaults', () => {
    const result = iconsConfigSchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.enabled).toBe(true);
      expect(result.data.componentPrefix).toBe('Icon');
      expect(result.data.generateIndex).toBe(true);
    }
  });

  it('should accept formats array', () => {
    const result = iconsConfigSchema.safeParse({
      formats: ['svg', 'react', 'sprite'],
    });
    expect(result.success).toBe(true);
  });
});

describe('globalConfigSchema', () => {
  it('should accept minimal global config', () => {
    const result = globalConfigSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it('should apply defaults', () => {
    const result = globalConfigSchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.logLevel).toBe('info');
      expect(result.data.colors).toBe(true);
      expect(result.data.ci).toBe(false);
    }
  });
});

describe('themesConfigSchema', () => {
  it('should accept minimal themes config', () => {
    const result = themesConfigSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it('should apply default modes', () => {
    const result = themesConfigSchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.defaultMode).toBe('light');
      expect(result.data.modes).toBeDefined();
      expect(result.data.modes.light).toBeDefined();
      expect(result.data.modes.dark).toBeDefined();
    }
  });
});

// ============================================================================
// Root Config Schema Tests
// ============================================================================

describe('dsaiConfigSchema', () => {
  it('should accept empty config', () => {
    const result = dsaiConfigSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it('should accept full config', () => {
    const result = dsaiConfigSchema.safeParse({
      global: { logLevel: 'debug' },
      tokens: { enabled: true },
      icons: { enabled: true },
      themes: { defaultMode: 'dark' },
    });
    expect(result.success).toBe(true);
  });

  it('should accept $schema field', () => {
    const result = dsaiConfigSchema.safeParse({
      $schema: 'https://example.com/schema.json',
    });
    expect(result.success).toBe(true);
  });

  it('should accept extends field as string', () => {
    const result = dsaiConfigSchema.safeParse({
      extends: './base-config.js',
    });
    expect(result.success).toBe(true);
  });

  it('should accept extends field as array', () => {
    const result = dsaiConfigSchema.safeParse({
      extends: ['./base-config.js', './override.js'],
    });
    expect(result.success).toBe(true);
  });
});

// ============================================================================
// Validation Function Tests
// ============================================================================

describe('validateConfig', () => {
  it('should return success for valid config', () => {
    const result = validateConfig({
      global: { logLevel: 'info' },
      tokens: { prefix: 'custom' },
    });

    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
    expect(result.errors).toBeUndefined();
  });

  it('should return errors for invalid config', () => {
    const result = validateConfig({
      global: { logLevel: 'not-a-level' },
    });

    expect(result.success).toBe(false);
    expect(result.errors).toBeDefined();
    expect(result.errors?.length).toBeGreaterThan(0);
  });

  it('should handle non-object input', () => {
    const result = validateConfig('not-an-object');
    expect(result.success).toBe(false);
  });
});

describe('validateConfigOrThrow', () => {
  it('should return valid config', () => {
    const config = { tokens: { prefix: 'test' } };
    const result = validateConfigOrThrow(config);

    expect(result).toBeDefined();
    expect(result.tokens?.prefix).toBe('test');
  });

  it('should throw for invalid config', () => {
    expect(() => {
      validateConfigOrThrow({ global: { logLevel: 'invalid' } });
    }).toThrow('Configuration validation failed');
  });
});

describe('validateConfigSection', () => {
  it('should validate tokens section', () => {
    const result = validateConfigSection('tokens', {
      prefix: 'custom',
      formats: ['css'],
    });

    expect(result.success).toBe(true);
  });

  it('should validate icons section', () => {
    const result = validateConfigSection('icons', {
      formats: ['react'],
    });

    expect(result.success).toBe(true);
  });

  it('should validate global section', () => {
    const result = validateConfigSection('global', {
      logLevel: 'debug',
    });

    expect(result.success).toBe(true);
  });

  it('should return error for unknown section', () => {
    const result = validateConfigSection('unknown' as 'global', {});

    expect(result.success).toBe(false);
    expect(result.errors?.[0].code).toBe('unknown_section');
  });
});

// ============================================================================
// Error Formatting Tests
// ============================================================================

describe('formatValidationErrors', () => {
  it('should format Zod errors', () => {
    const result = dsaiConfigSchema.safeParse({
      global: { logLevel: 'invalid' },
    });

    if (!result.success) {
      const errors = formatValidationErrors(result.error);

      expect(errors).toBeInstanceOf(Array);
      expect(errors[0]).toHaveProperty('path');
      expect(errors[0]).toHaveProperty('message');
      expect(errors[0]).toHaveProperty('code');
    }
  });
});

describe('formatErrorMessage', () => {
  it('should create readable error message', () => {
    const errors = [
      {
        path: 'global.logLevel',
        message: 'Invalid enum value',
        code: 'invalid_enum_value',
        expected: 'info',
        received: 'invalid',
      },
    ];

    const message = formatErrorMessage(errors);

    expect(message).toContain('Configuration validation failed');
    expect(message).toContain('global.logLevel');
    expect(message).toContain('Invalid enum value');
    expect(message).toContain('Expected: info');
    expect(message).toContain('Received: invalid');
  });

  it('should handle errors without expected/received', () => {
    const errors = [
      {
        path: 'tokens',
        message: 'Required',
        code: 'invalid_type',
      },
    ];

    const message = formatErrorMessage(errors);

    expect(message).toContain('tokens');
    expect(message).toContain('Required');
  });
});
