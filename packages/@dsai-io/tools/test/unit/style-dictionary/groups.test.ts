/**
 * @file Unit tests for Style Dictionary transform groups
 * @description Tests for CSS, JS, and SCSS transform groups
 */

import {
  transformGroups,
  registerTransformGroups,
  cssTransformGroup,
  jsTransformGroup,
  scssTransformGroup,
} from '../../../src/tokens/style-dictionary/groups/index.js';

import type {
  StyleDictionaryInstance,
  TransformGroupDefinition,
} from '../../../src/tokens/style-dictionary/types.js';

// Mock Style Dictionary instance
function createMockSD(): StyleDictionaryInstance {
  return {
    registerTransformGroup: jest.fn(),
    registerTransform: jest.fn(),
    registerFormat: jest.fn(),
    registerFileHeader: jest.fn(),
    registerPreprocessor: jest.fn(),
    registerAction: jest.fn(),
  } as unknown as StyleDictionaryInstance;
}

describe('transformGroups', () => {
  describe('exports', () => {
    it('should export transformGroups array', () => {
      expect(Array.isArray(transformGroups)).toBe(true);
      expect(transformGroups.length).toBe(3);
    });

    it('should include cssTransformGroup', () => {
      expect(cssTransformGroup).toBeDefined();
      expect(cssTransformGroup.name).toBe('custom/css');
    });

    it('should include jsTransformGroup', () => {
      expect(jsTransformGroup).toBeDefined();
      expect(jsTransformGroup.name).toBe('js-custom');
    });

    it('should include scssTransformGroup', () => {
      expect(scssTransformGroup).toBeDefined();
      expect(scssTransformGroup.name).toBe('custom/scss');
    });
  });

  describe('cssTransformGroup', () => {
    it('should have correct name', () => {
      expect(cssTransformGroup.name).toBe('custom/css');
    });

    it('should have transforms array', () => {
      expect(Array.isArray(cssTransformGroup.transforms)).toBe(true);
      expect(cssTransformGroup.transforms.length).toBeGreaterThan(0);
    });

    it('should include name/kebab transform', () => {
      expect(cssTransformGroup.transforms).toContain('name/kebab');
    });
  });

  describe('jsTransformGroup', () => {
    it('should have correct name', () => {
      expect(jsTransformGroup.name).toBe('js-custom');
    });

    it('should have transforms array', () => {
      expect(Array.isArray(jsTransformGroup.transforms)).toBe(true);
    });
  });

  describe('scssTransformGroup', () => {
    it('should have correct name', () => {
      expect(scssTransformGroup.name).toBe('custom/scss');
    });

    it('should have transforms array', () => {
      expect(Array.isArray(scssTransformGroup.transforms)).toBe(true);
    });

    it('should include name/kebab transform', () => {
      expect(scssTransformGroup.transforms).toContain('name/kebab');
    });
  });

  describe('registerTransformGroups', () => {
    it('should register all built-in groups', () => {
      const mockSD = createMockSD();
      registerTransformGroups(mockSD);

      expect(mockSD.registerTransformGroup).toHaveBeenCalledTimes(3);
    });

    it('should register CSS transform group', () => {
      const mockSD = createMockSD();
      registerTransformGroups(mockSD);

      expect(mockSD.registerTransformGroup).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'custom/css',
        })
      );
    });

    it('should register JS transform group', () => {
      const mockSD = createMockSD();
      registerTransformGroups(mockSD);

      expect(mockSD.registerTransformGroup).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'js-custom',
        })
      );
    });

    it('should register SCSS transform group', () => {
      const mockSD = createMockSD();
      registerTransformGroups(mockSD);

      expect(mockSD.registerTransformGroup).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'custom/scss',
        })
      );
    });

    it('should register custom transform groups', () => {
      const mockSD = createMockSD();
      const customGroup: TransformGroupDefinition = {
        name: 'custom/group',
        transforms: ['transform/one', 'transform/two'],
      };

      registerTransformGroups(mockSD, [customGroup]);

      expect(mockSD.registerTransformGroup).toHaveBeenCalledTimes(4);
      expect(mockSD.registerTransformGroup).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'custom/group',
          transforms: ['transform/one', 'transform/two'],
        })
      );
    });

    it('should handle empty custom groups array', () => {
      const mockSD = createMockSD();
      registerTransformGroups(mockSD, []);

      expect(mockSD.registerTransformGroup).toHaveBeenCalledTimes(3);
    });
  });
});
