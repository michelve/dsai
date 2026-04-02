/**
 * Unit tests for Style Dictionary config generation
 *
 * Tests cover:
 * - Config creation
 * - Platform configuration
 * - File generation
 */

import { resolveConfig } from '../../../src/config/resolver.js';
import { createStyleDictionaryConfig } from '../../../src/tokens/style-dictionary/config.js';

// ============================================================================
// createStyleDictionaryConfig Tests
// ============================================================================

describe('createStyleDictionaryConfig', () => {
  // Get a valid default config for testing
  const getTestConfig = () => {
    const result = resolveConfig({});
    return result;
  };

  describe('config structure', () => {
    it('should create a valid config object', () => {
      const dsaiConfig = getTestConfig();
      const config = createStyleDictionaryConfig(dsaiConfig);

      expect(config).toBeDefined();
      expect(config).toHaveProperty('source');
      expect(config).toHaveProperty('platforms');
    });

    it('should include source pattern', () => {
      const dsaiConfig = getTestConfig();
      const config = createStyleDictionaryConfig(dsaiConfig);

      expect(config.source).toBeDefined();
      expect(Array.isArray(config.source)).toBe(true);
      expect(config.source?.length).toBeGreaterThan(0);
    });

    it('should have log configuration', () => {
      const dsaiConfig = getTestConfig();
      const config = createStyleDictionaryConfig(dsaiConfig);

      expect(config).toHaveProperty('log');
    });
  });

  describe('platform configuration', () => {
    it('should include CSS platform', () => {
      const dsaiConfig = getTestConfig();
      const config = createStyleDictionaryConfig(dsaiConfig);

      expect(config.platforms).toHaveProperty('css');
      expect(config.platforms?.css).toHaveProperty('transformGroup');
      expect(config.platforms?.css).toHaveProperty('buildPath');
      expect(config.platforms?.css).toHaveProperty('files');
    });

    it('should include JS platform', () => {
      const dsaiConfig = getTestConfig();
      const config = createStyleDictionaryConfig(dsaiConfig);

      expect(config.platforms).toHaveProperty('js');
    });

    it('should include TypeScript platform', () => {
      const dsaiConfig = getTestConfig();
      const config = createStyleDictionaryConfig(dsaiConfig);

      expect(config.platforms).toHaveProperty('ts');
    });

    it('should include SCSS platform', () => {
      const dsaiConfig = getTestConfig();
      const config = createStyleDictionaryConfig(dsaiConfig);

      expect(config.platforms).toHaveProperty('scss');
    });

    it('should include JSON platform', () => {
      const dsaiConfig = getTestConfig();
      const config = createStyleDictionaryConfig(dsaiConfig);

      expect(config.platforms).toHaveProperty('json');
    });
  });

  describe('options handling', () => {
    it('should accept custom source patterns', () => {
      const dsaiConfig = getTestConfig();
      const customSource = ['custom/**/*.json'];

      const config = createStyleDictionaryConfig(dsaiConfig, {
        source: customSource,
      });

      expect(config.source).toEqual(customSource);
    });

    it('should accept custom platforms list', () => {
      const dsaiConfig = getTestConfig();

      const config = createStyleDictionaryConfig(dsaiConfig, {
        platforms: ['css', 'js'],
      });

      expect(config.platforms).toHaveProperty('css');
      expect(config.platforms).toHaveProperty('js');
      // Other platforms should not be included
      expect(config.platforms).not.toHaveProperty('scss');
    });

    it('should accept custom prefix', () => {
      const dsaiConfig = getTestConfig();

      const config = createStyleDictionaryConfig(dsaiConfig, {
        prefix: 'custom',
      });

      expect(config).toBeDefined();
    });

    it('should accept custom buildPath', () => {
      const dsaiConfig = getTestConfig();

      const config = createStyleDictionaryConfig(dsaiConfig, {
        buildPath: './custom-dist/',
      });

      expect(config.platforms?.css?.buildPath).toContain('custom-dist');
    });
  });

  describe('file output configuration', () => {
    it('should generate CSS files configuration', () => {
      const dsaiConfig = getTestConfig();
      const config = createStyleDictionaryConfig(dsaiConfig);

      const cssFiles = config.platforms?.css?.files;
      expect(Array.isArray(cssFiles)).toBe(true);
      expect(cssFiles?.length).toBeGreaterThan(0);

      // Each file should have destination and format
      if (cssFiles) {
        for (const file of cssFiles) {
          expect(file).toHaveProperty('destination');
          expect(file).toHaveProperty('format');
        }
      }
    });

    it('should generate JS files configuration', () => {
      const dsaiConfig = getTestConfig();
      const config = createStyleDictionaryConfig(dsaiConfig);

      const jsFiles = config.platforms?.js?.files;
      expect(Array.isArray(jsFiles)).toBe(true);

      if (jsFiles) {
        for (const file of jsFiles) {
          expect(file).toHaveProperty('destination');
        }
      }
    });
  });

  describe('registerAll', () => {
    it('should register transforms on a mock SD instance', async () => {
      const { registerAll } = await import('../../../src/tokens/style-dictionary/config.js');

      const mockSD: any = {
        registerTransform: jest.fn(),
        registerTransformGroup: jest.fn(),
        registerFormat: jest.fn(),
        registerPreprocessor: jest.fn(),
      };

      registerAll(mockSD);

      expect(mockSD.registerTransform).toHaveBeenCalled();
      expect(mockSD.registerTransformGroup).toHaveBeenCalled();
      expect(mockSD.registerFormat).toHaveBeenCalled();
      expect(mockSD.registerPreprocessor).toHaveBeenCalled();
    });

    it('should register custom transforms, formats, and preprocessors', async () => {
      const { registerAll } = await import('../../../src/tokens/style-dictionary/config.js');

      const mockSD: any = {
        registerTransform: jest.fn(),
        registerTransformGroup: jest.fn(),
        registerFormat: jest.fn(),
        registerPreprocessor: jest.fn(),
      };

      const customTransform = { name: 'custom/transform', type: 'value', transform: () => '' };
      const customFormat = { name: 'custom/format', format: () => '' };
      const customPreprocessor = { name: 'custom/preprocess', preprocessor: (dict: any) => dict };

      registerAll(mockSD, {
        customTransforms: [customTransform],
        customFormats: [customFormat],
        customPreprocessors: [customPreprocessor],
      });

      // Should have been called with custom ones included
      expect(mockSD.registerTransform).toHaveBeenCalled();
      expect(mockSD.registerFormat).toHaveBeenCalled();
    });
  });

  describe('setupStyleDictionary', () => {
    it('should register and create config in one step', async () => {
      const { setupStyleDictionary } = await import(
        '../../../src/tokens/style-dictionary/config.js'
      );

      const mockSD: any = {
        registerTransform: jest.fn(),
        registerTransformGroup: jest.fn(),
        registerFormat: jest.fn(),
        registerPreprocessor: jest.fn(),
      };

      const dsaiConfig = getTestConfig();
      const config = setupStyleDictionary(mockSD, dsaiConfig);

      expect(config).toBeDefined();
      expect(config.source).toBeDefined();
      expect(config.platforms).toBeDefined();
      expect(mockSD.registerTransform).toHaveBeenCalled();
    });
  });

  describe('verbose and buildPath options', () => {
    it('should set verbose log when verbose is true', () => {
      const dsaiConfig = getTestConfig();
      const config = createStyleDictionaryConfig(dsaiConfig, { verbose: true });

      expect(config.log?.verbosity).toBe('verbose');
    });

    it('should set default log when verbose is false', () => {
      const dsaiConfig = getTestConfig();
      const config = createStyleDictionaryConfig(dsaiConfig, { verbose: false });

      expect(config.log?.verbosity).toBe('default');
    });

    it('should normalize buildPath without trailing slash', () => {
      const dsaiConfig = getTestConfig();
      const config = createStyleDictionaryConfig(dsaiConfig, { buildPath: 'my-output' });

      // All platform build paths should include the normalized path
      expect(config.platforms?.css?.buildPath).toContain('my-output/');
    });

    it('should handle buildPath that already has trailing slash', () => {
      const dsaiConfig = getTestConfig();
      const config = createStyleDictionaryConfig(dsaiConfig, { buildPath: 'my-output/' });

      // Should not double the slash
      expect(config.platforms?.css?.buildPath).not.toContain('my-output//');
    });

    it('should include scss-dist platform', () => {
      const dsaiConfig = getTestConfig();
      const config = createStyleDictionaryConfig(dsaiConfig);

      expect(config.platforms).toHaveProperty('scss-dist');
    });

    it('should include preprocessors', () => {
      const dsaiConfig = getTestConfig();
      const config = createStyleDictionaryConfig(dsaiConfig);

      expect(config.preprocessors).toBeDefined();
      expect(Array.isArray(config.preprocessors)).toBe(true);
    });
  });
});
