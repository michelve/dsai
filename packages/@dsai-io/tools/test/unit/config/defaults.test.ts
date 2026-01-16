/**
 * Unit tests for config defaults
 *
 * Tests cover:
 * - getOutputFileName function
 * - getDefaultOutputDir function
 * - getDefaultExtension function
 * - Default config values
 */

import {
  getOutputFileName,
  getDefaultOutputDir,
  getDefaultExtension,
  defaultConfig,
  defaultTokensConfig,
  defaultIconsConfig,
  defaultGlobalConfig,
  defaultThemesConfig,
  envMappings,
  envBooleanKeys,
  envNumberKeys,
  envArrayKeys,
  DEFAULT_PREFIX,
  DEFAULT_SOURCE_DIR,
  DEFAULT_OUTPUT_DIR,
  defaultFormats,
  defaultOutputFileNames,
} from '../../../src/config/defaults.js';

// ============================================================================
// getOutputFileName
// ============================================================================

describe('getOutputFileName', () => {
  describe('without theme', () => {
    it('should return correct filename for css format', () => {
      expect(getOutputFileName('css')).toBe('tokens.css');
    });

    it('should return correct filename for scss format', () => {
      expect(getOutputFileName('scss')).toBe('_tokens.scss');
    });

    it('should return correct filename for js format', () => {
      expect(getOutputFileName('js')).toBe('tokens.js');
    });

    it('should return correct filename for ts format', () => {
      expect(getOutputFileName('ts')).toBe('tokens.ts');
    });

    it('should return correct filename for json format', () => {
      expect(getOutputFileName('json')).toBe('tokens.json');
    });

    it('should return correct filename for android format', () => {
      expect(getOutputFileName('android')).toBe('tokens.xml');
    });

    it('should return correct filename for ios format', () => {
      expect(getOutputFileName('ios')).toBe('tokens.h');
    });

    it('should return default filename for unknown format', () => {
      expect(getOutputFileName('unknown' as any)).toBe('tokens.txt');
    });
  });

  describe('with theme', () => {
    it('should insert theme before extension for css', () => {
      expect(getOutputFileName('css', 'Dark')).toBe('tokens-Dark.css');
    });

    it('should insert theme before extension for scss', () => {
      expect(getOutputFileName('scss', 'Light')).toBe('_tokens-Light.scss');
    });

    it('should insert theme before extension for js', () => {
      expect(getOutputFileName('js', 'HighContrast')).toBe('tokens-HighContrast.js');
    });

    it('should insert theme before extension for ts', () => {
      expect(getOutputFileName('ts', 'Dark')).toBe('tokens-Dark.ts');
    });

    it('should insert theme before extension for json', () => {
      expect(getOutputFileName('json', 'Custom')).toBe('tokens-Custom.json');
    });

    it('should insert theme before extension for android', () => {
      expect(getOutputFileName('android', 'Material')).toBe('tokens-Material.xml');
    });

    it('should insert theme before extension for ios', () => {
      expect(getOutputFileName('ios', 'Cupertino')).toBe('tokens-Cupertino.h');
    });
  });
});

// ============================================================================
// getDefaultOutputDir
// ============================================================================

describe('getDefaultOutputDir', () => {
  it('should return css subdirectory for css format', () => {
    const result = getDefaultOutputDir('css');
    expect(result).toContain('css');
    expect(result).toContain(DEFAULT_OUTPUT_DIR);
  });

  it('should return scss subdirectory for scss format', () => {
    const result = getDefaultOutputDir('scss');
    expect(result).toContain('scss');
    expect(result).toContain(DEFAULT_OUTPUT_DIR);
  });

  it('should return js subdirectory for js format', () => {
    const result = getDefaultOutputDir('js');
    expect(result).toContain('js');
    expect(result).toContain(DEFAULT_OUTPUT_DIR);
  });

  it('should return js subdirectory for ts format', () => {
    const result = getDefaultOutputDir('ts');
    expect(result).toContain('js');
    expect(result).toContain(DEFAULT_OUTPUT_DIR);
  });

  it('should return json subdirectory for json format', () => {
    const result = getDefaultOutputDir('json');
    expect(result).toContain('json');
    expect(result).toContain(DEFAULT_OUTPUT_DIR);
  });

  it('should return android subdirectory for android format', () => {
    const result = getDefaultOutputDir('android');
    expect(result).toContain('android');
    expect(result).toContain(DEFAULT_OUTPUT_DIR);
  });

  it('should return ios subdirectory for ios format', () => {
    const result = getDefaultOutputDir('ios');
    expect(result).toContain('ios');
    expect(result).toContain(DEFAULT_OUTPUT_DIR);
  });

  it('should return base output dir for unknown format', () => {
    const result = getDefaultOutputDir('unknown' as any);
    expect(result).toBe(DEFAULT_OUTPUT_DIR);
  });
});

// ============================================================================
// getDefaultExtension
// ============================================================================

describe('getDefaultExtension', () => {
  it('should return .css for css format', () => {
    expect(getDefaultExtension('css')).toBe('.css');
  });

  it('should return .scss for scss format', () => {
    expect(getDefaultExtension('scss')).toBe('.scss');
  });

  it('should return .js for js format', () => {
    expect(getDefaultExtension('js')).toBe('.js');
  });

  it('should return .ts for ts format', () => {
    expect(getDefaultExtension('ts')).toBe('.ts');
  });

  it('should return .json for json format', () => {
    expect(getDefaultExtension('json')).toBe('.json');
  });

  it('should return .xml for android format', () => {
    expect(getDefaultExtension('android')).toBe('.xml');
  });

  it('should return .h for ios format', () => {
    expect(getDefaultExtension('ios')).toBe('.h');
  });

  it('should return .txt for unknown format', () => {
    expect(getDefaultExtension('unknown' as any)).toBe('.txt');
  });
});

// ============================================================================
// Default Configurations
// ============================================================================

describe('Default Configurations', () => {
  describe('defaultTokensConfig', () => {
    it('should have required properties', () => {
      expect(defaultTokensConfig.sourceDir).toBeDefined();
      expect(defaultTokensConfig.outputDir).toBeDefined();
      expect(defaultTokensConfig.prefix).toBeDefined();
      expect(defaultTokensConfig.formats).toBeDefined();
    });

    it('should have valid default formats', () => {
      expect(Array.isArray(defaultTokensConfig.formats)).toBe(true);
      expect(defaultTokensConfig.formats.length).toBeGreaterThan(0);
    });

    it('should have default themes config', () => {
      expect(defaultTokensConfig.themes).toBeDefined();
      expect(defaultTokensConfig.themes.default).toBe('Light');
    });

    it('should have valid baseFontSize', () => {
      expect(defaultTokensConfig.baseFontSize).toBe(16);
    });
  });

  describe('defaultIconsConfig', () => {
    it('should have required properties', () => {
      expect(defaultIconsConfig.sourceDir).toBeDefined();
      expect(defaultIconsConfig.outputDir).toBeDefined();
      expect(defaultIconsConfig.framework).toBeDefined();
    });

    it('should default to react framework', () => {
      expect(defaultIconsConfig.framework).toBe('react');
    });

    it('should have typescript enabled by default', () => {
      expect(defaultIconsConfig.typescript).toBe(true);
    });

    it('should have optimize enabled by default', () => {
      expect(defaultIconsConfig.optimize).toBe(true);
    });
  });

  describe('defaultGlobalConfig', () => {
    it('should have required properties', () => {
      expect(defaultGlobalConfig.cwd).toBeDefined();
      expect(defaultGlobalConfig.logLevel).toBeDefined();
    });

    it('should have debug disabled by default', () => {
      expect(defaultGlobalConfig.debug).toBe(false);
    });
  });

  describe('defaultThemesConfig', () => {
    it('should have auto detection enabled', () => {
      expect(defaultThemesConfig.autoDetect).toBe(true);
    });

    it('should default to Light theme', () => {
      expect(defaultThemesConfig.default).toBe('Light');
    });

    it('should have empty ignoreModes', () => {
      expect(defaultThemesConfig.ignoreModes).toEqual([]);
    });
  });

  describe('defaultConfig', () => {
    it('should contain tokens config', () => {
      expect(defaultConfig.tokens).toBeDefined();
    });

    it('should contain icons config', () => {
      expect(defaultConfig.icons).toBeDefined();
    });

    it('should contain global config', () => {
      expect(defaultConfig.global).toBeDefined();
    });

    it('should have configDir set to cwd', () => {
      expect(defaultConfig.configDir).toBe(process.cwd());
    });
  });
});

// ============================================================================
// Environment Mappings
// ============================================================================

describe('Environment Mappings', () => {
  describe('envMappings', () => {
    it('should map DSAI_LOG_LEVEL to global.logLevel', () => {
      expect(envMappings.DSAI_LOG_LEVEL).toBe('global.logLevel');
    });

    it('should map DSAI_DEBUG to global.debug', () => {
      expect(envMappings.DSAI_DEBUG).toBe('global.debug');
    });

    it('should map DSAI_PREFIX to tokens.prefix', () => {
      expect(envMappings.DSAI_PREFIX).toBe('tokens.prefix');
    });

    it('should map DSAI_SOURCE_DIR to tokens.sourceDir', () => {
      expect(envMappings.DSAI_SOURCE_DIR).toBe('tokens.sourceDir');
    });

    it('should map DSAI_OUTPUT_DIR to tokens.outputDir', () => {
      expect(envMappings.DSAI_OUTPUT_DIR).toBe('tokens.outputDir');
    });

    it('should map icon settings correctly', () => {
      expect(envMappings.DSAI_ICONS_SOURCE_DIR).toBe('icons.sourceDir');
      expect(envMappings.DSAI_ICONS_OUTPUT_DIR).toBe('icons.outputDir');
      expect(envMappings.DSAI_ICONS_FRAMEWORK).toBe('icons.framework');
    });
  });

  describe('envBooleanKeys', () => {
    it('should contain DSAI_DEBUG', () => {
      expect(envBooleanKeys.has('DSAI_DEBUG')).toBe(true);
    });

    it('should contain DSAI_WATCH', () => {
      expect(envBooleanKeys.has('DSAI_WATCH')).toBe(true);
    });

    it('should contain DSAI_CREATE_BUNDLE', () => {
      expect(envBooleanKeys.has('DSAI_CREATE_BUNDLE')).toBe(true);
    });

    it('should contain icon boolean keys', () => {
      expect(envBooleanKeys.has('DSAI_ICONS_TYPESCRIPT')).toBe(true);
      expect(envBooleanKeys.has('DSAI_ICONS_OPTIMIZE')).toBe(true);
    });
  });

  describe('envNumberKeys', () => {
    it('should contain DSAI_BASE_FONT_SIZE', () => {
      expect(envNumberKeys.has('DSAI_BASE_FONT_SIZE')).toBe(true);
    });
  });

  describe('envArrayKeys', () => {
    it('should contain DSAI_FORMATS', () => {
      expect(envArrayKeys.has('DSAI_FORMATS')).toBe(true);
    });

    it('should contain DSAI_IGNORE_MODES', () => {
      expect(envArrayKeys.has('DSAI_IGNORE_MODES')).toBe(true);
    });
  });
});

// ============================================================================
// Default Values
// ============================================================================

describe('Default Values', () => {
  it('should export DEFAULT_PREFIX', () => {
    expect(DEFAULT_PREFIX).toBeDefined();
    expect(typeof DEFAULT_PREFIX).toBe('string');
  });

  it('should export DEFAULT_SOURCE_DIR', () => {
    expect(DEFAULT_SOURCE_DIR).toBeDefined();
    expect(typeof DEFAULT_SOURCE_DIR).toBe('string');
  });

  it('should export DEFAULT_OUTPUT_DIR', () => {
    expect(DEFAULT_OUTPUT_DIR).toBeDefined();
    expect(typeof DEFAULT_OUTPUT_DIR).toBe('string');
  });

  it('should export defaultFormats', () => {
    expect(defaultFormats).toBeDefined();
    expect(Array.isArray(defaultFormats)).toBe(true);
  });

  it('should export defaultOutputFileNames', () => {
    expect(defaultOutputFileNames).toBeDefined();
    expect(typeof defaultOutputFileNames).toBe('object');
  });
});
