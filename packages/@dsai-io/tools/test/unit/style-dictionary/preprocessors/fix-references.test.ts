/**
 * Unit tests for fix-references preprocessor
 *
 * Tests cover:
 * - fixReferences preprocessor
 * - createFixReferencesPreprocessor factory
 * - Default path mappings
 * - DTCG and legacy format handling
 * - Nested token structures
 */

import {
  createFixReferencesPreprocessor,
  fixReferences,
} from '../../../../src/tokens/style-dictionary/preprocessors/fix-references.js';

// ============================================================================
// Tests
// ============================================================================

describe('fix-references preprocessor', () => {
  // ==========================================================================
  // fixReferences preprocessor
  // ==========================================================================

  describe('fixReferences', () => {
    it('should have correct name', () => {
      expect(fixReferences.name).toBe('fix-references');
    });

    it('should fix colors.brand references to color', () => {
      const dictionary: Record<string, unknown> = {
        token: {
          $value: '{colors.brand.primary}',
          $type: 'color',
        },
      };

      const result = fixReferences.preprocessor(dictionary);

      expect((result.token as Record<string, string>).$value).toBe('{color.primary}');
    });

    it('should fix colors.neutral references to neutral', () => {
      const dictionary: Record<string, unknown> = {
        token: {
          $value: '{colors.neutral.500}',
          $type: 'color',
        },
      };

      const result = fixReferences.preprocessor(dictionary);

      expect((result.token as Record<string, string>).$value).toBe('{neutral.500}');
    });

    it('should fix borders.width references to border.width', () => {
      const dictionary: Record<string, unknown> = {
        token: {
          $value: '{borders.width.thin}',
          $type: 'dimension',
        },
      };

      const result = fixReferences.preprocessor(dictionary);

      expect((result.token as Record<string, string>).$value).toBe('{border.width.thin}');
    });

    it('should handle legacy format (value instead of $value)', () => {
      const dictionary: Record<string, unknown> = {
        token: {
          value: '{colors.brand.primary}',
          type: 'color',
        },
      };

      const result = fixReferences.preprocessor(dictionary);

      expect((result.token as Record<string, string>).value).toBe('{color.primary}');
    });

    it('should process nested token structures', () => {
      const dictionary: Record<string, unknown> = {
        colors: {
          background: {
            primary: {
              $value: '{colors.brand.blue.500}',
              $type: 'color',
            },
            secondary: {
              $value: '{colors.neutral.100}',
              $type: 'color',
            },
          },
        },
      };

      const result = fixReferences.preprocessor(dictionary);

      const colors = result.colors as Record<string, unknown>;
      const background = colors.background as Record<string, unknown>;
      const primary = background.primary as Record<string, string>;
      const secondary = background.secondary as Record<string, string>;

      expect(primary.$value).toBe('{color.blue.500}');
      expect(secondary.$value).toBe('{neutral.100}');
    });

    it('should not modify non-reference values', () => {
      const dictionary: Record<string, unknown> = {
        token: {
          $value: '#007bff',
          $type: 'color',
        },
      };

      const result = fixReferences.preprocessor(dictionary);

      expect((result.token as Record<string, string>).$value).toBe('#007bff');
    });

    it('should not modify references without known prefixes', () => {
      const dictionary: Record<string, unknown> = {
        token: {
          $value: '{spacing.medium}',
          $type: 'dimension',
        },
      };

      const result = fixReferences.preprocessor(dictionary);

      expect((result.token as Record<string, string>).$value).toBe('{spacing.medium}');
    });

    it('should handle multiple mappings in single value', () => {
      const dictionary: Record<string, unknown> = {
        token: {
          $value: '{colors.brand.primary}',
          $type: 'color',
        },
        other: {
          $value: '{colors.neutral.gray}',
          $type: 'color',
        },
      };

      const result = fixReferences.preprocessor(dictionary);

      expect((result.token as Record<string, string>).$value).toBe('{color.primary}');
      expect((result.other as Record<string, string>).$value).toBe('{neutral.gray}');
    });

    it('should preserve non-string values', () => {
      const dictionary: Record<string, unknown> = {
        token: {
          $value: 16,
          $type: 'dimension',
        },
      };

      const result = fixReferences.preprocessor(dictionary);

      expect((result.token as Record<string, unknown>).$value).toBe(16);
    });
  });

  // ==========================================================================
  // createFixReferencesPreprocessor
  // ==========================================================================

  describe('createFixReferencesPreprocessor', () => {
    it('should create a custom preprocessor', () => {
      const customPreprocessor = createFixReferencesPreprocessor([['{old.path.', '{new.path.']]);

      expect(customPreprocessor.name).toBe('fix-references-custom');
      expect(typeof customPreprocessor.preprocessor).toBe('function');
    });

    it('should apply custom mappings', () => {
      const customPreprocessor = createFixReferencesPreprocessor([['{brand.', '{acme.']]);

      const dictionary: Record<string, unknown> = {
        token: {
          $value: '{brand.primary}',
          $type: 'color',
        },
      };

      const result = customPreprocessor.preprocessor(dictionary);

      expect((result.token as Record<string, string>).$value).toBe('{acme.primary}');
    });

    it('should support multiple custom mappings', () => {
      const customPreprocessor = createFixReferencesPreprocessor([
        ['{old1.', '{new1.'],
        ['{old2.', '{new2.'],
      ]);

      const dictionary: Record<string, unknown> = {
        token1: {
          $value: '{old1.value}',
          $type: 'color',
        },
        token2: {
          $value: '{old2.value}',
          $type: 'color',
        },
      };

      const result = customPreprocessor.preprocessor(dictionary);

      expect((result.token1 as Record<string, string>).$value).toBe('{new1.value}');
      expect((result.token2 as Record<string, string>).$value).toBe('{new2.value}');
    });

    it('should work with empty mappings array', () => {
      const customPreprocessor = createFixReferencesPreprocessor([]);

      const dictionary: Record<string, unknown> = {
        token: {
          $value: '{any.reference}',
          $type: 'color',
        },
      };

      const result = customPreprocessor.preprocessor(dictionary);

      // Should be unchanged when no mappings
      expect((result.token as Record<string, string>).$value).toBe('{any.reference}');
    });
  });

  // ==========================================================================
  // Edge Cases
  // ==========================================================================

  describe('Edge Cases', () => {
    it('should handle empty dictionary', () => {
      const dictionary: Record<string, unknown> = {};

      const result = fixReferences.preprocessor(dictionary);

      expect(result).toEqual({});
    });

    it('should handle null values in dictionary', () => {
      const dictionary: Record<string, unknown> = {
        token: null,
      };

      // Should not throw
      const result = fixReferences.preprocessor(dictionary);

      expect(result.token).toBeNull();
    });

    it('should handle arrays in dictionary', () => {
      const dictionary: Record<string, unknown> = {
        tokens: [{ $value: '{colors.brand.primary}', $type: 'color' }],
      };

      // Arrays are objects, should not break
      const result = fixReferences.preprocessor(dictionary);
      expect(result.tokens).toBeDefined();
    });

    it('should handle deeply nested structures', () => {
      const dictionary: Record<string, unknown> = {
        level1: {
          level2: {
            level3: {
              level4: {
                token: {
                  $value: '{colors.brand.deep}',
                  $type: 'color',
                },
              },
            },
          },
        },
      };

      const result = fixReferences.preprocessor(dictionary);

      const level1 = result.level1 as Record<string, unknown>;
      const level2 = level1.level2 as Record<string, unknown>;
      const level3 = level2.level3 as Record<string, unknown>;
      const level4 = level3.level4 as Record<string, unknown>;
      const token = level4.token as Record<string, string>;

      expect(token.$value).toBe('{color.deep}');
    });
  });
});
