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
});
