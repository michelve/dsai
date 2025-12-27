/**
 * Unit tests for preprocessors index (registration)
 *
 * Tests cover:
 * - builtInPreprocessors array
 * - registerPreprocessors function
 */

import {
  builtInPreprocessors,
  fixReferences,
  registerPreprocessors,
} from '../../../../src/tokens/style-dictionary/preprocessors/index.js';

// ============================================================================
// Tests
// ============================================================================

describe('preprocessors/index', () => {
  describe('builtInPreprocessors', () => {
    it('should include fixReferences preprocessor', () => {
      expect(builtInPreprocessors).toContain(fixReferences);
    });

    it('should be a non-empty array', () => {
      expect(Array.isArray(builtInPreprocessors)).toBe(true);
      expect(builtInPreprocessors.length).toBeGreaterThan(0);
    });

    it('should have valid preprocessor definitions', () => {
      for (const preprocessor of builtInPreprocessors) {
        expect(typeof preprocessor.name).toBe('string');
        expect(typeof preprocessor.preprocessor).toBe('function');
      }
    });
  });

  describe('registerPreprocessors', () => {
    let mockStyleDictionary: {
      registerPreprocessor: jest.Mock;
      registerTransform: jest.Mock;
      registerTransformGroup: jest.Mock;
      registerFormat: jest.Mock;
    };

    beforeEach(() => {
      mockStyleDictionary = {
        registerPreprocessor: jest.fn(),
        registerTransform: jest.fn(),
        registerTransformGroup: jest.fn(),
        registerFormat: jest.fn(),
      };
    });

    it('should register all built-in preprocessors', () => {
      registerPreprocessors(mockStyleDictionary);

      expect(mockStyleDictionary.registerPreprocessor).toHaveBeenCalledTimes(
        builtInPreprocessors.length
      );
    });

    it('should register each preprocessor with name and function', () => {
      registerPreprocessors(mockStyleDictionary);

      for (const preprocessor of builtInPreprocessors) {
        expect(mockStyleDictionary.registerPreprocessor).toHaveBeenCalledWith({
          name: preprocessor.name,
          preprocessor: preprocessor.preprocessor,
        });
      }
    });

    it('should register custom preprocessors', () => {
      const customPreprocessor = {
        name: 'custom-preprocessor',
        preprocessor: jest.fn((dict) => dict),
      };

      registerPreprocessors(mockStyleDictionary, [customPreprocessor]);

      expect(mockStyleDictionary.registerPreprocessor).toHaveBeenCalledWith({
        name: 'custom-preprocessor',
        preprocessor: customPreprocessor.preprocessor,
      });
    });

    it('should register built-in and custom preprocessors together', () => {
      const customPreprocessor = {
        name: 'custom',
        preprocessor: jest.fn((dict) => dict),
      };

      registerPreprocessors(mockStyleDictionary, [customPreprocessor]);

      // Should register built-in + custom
      expect(mockStyleDictionary.registerPreprocessor).toHaveBeenCalledTimes(
        builtInPreprocessors.length + 1
      );
    });

    it('should work with empty custom preprocessors array', () => {
      registerPreprocessors(mockStyleDictionary, []);

      expect(mockStyleDictionary.registerPreprocessor).toHaveBeenCalledTimes(
        builtInPreprocessors.length
      );
    });
  });
});
