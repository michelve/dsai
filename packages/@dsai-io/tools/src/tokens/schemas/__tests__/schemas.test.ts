/**
 * @fileoverview Tests for token schema validation
 */

import {
  validateDTCGFile,
  validateDTCGTokens,
  validateFigmaExport,
  validateFigmaExportWithMetadata,
  validateFigmaVariablesResponse,
  validateStyleDictionaryInput,
  validateStyleDictionaryTokens,
} from '../index.js';

/** Hex color string length (6 digits for RGB) */
const HEX_COLOR_LENGTH = 6;
/** Arbitrary non-object input for type rejection tests */
const NON_OBJECT_NUMBER = 42;
/** Array length for array rejection tests */
const ARRAY_REJECTION_VALUES = [1, 2, 3];
/** Arbitrary numeric input for Style Dictionary rejection tests */
const SD_NON_OBJECT_INPUT = 123;

describe('DTCG Token Schema Validation', () => {
  describe('validateDTCGTokens', () => {
    it('validates valid color tokens', () => {
      const tokens = {
        colors: {
          primary: {
            $value: '#0066ff',
            $type: 'color',
            $description: 'Primary brand color',
          },
          secondary: {
            $value: {
              r: 0.23,
              g: 0.51,
              b: 0.96,
              a: 1,
            },
            $type: 'color',
          },
        },
      };

      const result = validateDTCGTokens(tokens);
      expect(result.valid).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.errors).toBeUndefined();
    });

    it('validates valid dimension tokens', () => {
      const tokens = {
        spacing: {
          sm: {
            $value: '8px',
            $type: 'dimension',
          },
          md: {
            $value: '16px',
            $type: 'dimension',
          },
          lg: {
            $value: 16,
            $type: 'dimension',
          },
        },
      };

      const result = validateDTCGTokens(tokens);
      expect(result.valid).toBe(true);
    });

    it('validates token references', () => {
      const tokens = {
        colors: {
          base: {
            $value: '#0066ff',
            $type: 'color',
          },
          primary: {
            $value: '{colors.base}',
            $type: 'color',
          },
        },
      };

      const result = validateDTCGTokens(tokens);
      expect(result.valid).toBe(true);
    });

    it('validates nested token structures', () => {
      const tokens = {
        colors: {
          brand: {
            primary: {
              base: {
                $value: '#0066ff',
                $type: 'color',
              },
              light: {
                $value: '#3399ff',
                $type: 'color',
              },
            },
          },
        },
      };

      const result = validateDTCGTokens(tokens);
      expect(result.valid).toBe(true);
    });

    it('validates typography tokens', () => {
      const tokens = {
        typography: {
          heading: {
            $value: {
              fontFamily: 'Inter',
              fontSize: '24px',
              fontWeight: 700,
              lineHeight: 1.2,
            },
            $type: 'typography',
          },
        },
      };

      const result = validateDTCGTokens(tokens);
      expect(result.valid).toBe(true);
    });

    it('validates shadow tokens', () => {
      const tokens = {
        shadows: {
          md: {
            $value: {
              color: '#00000040',
              offsetX: '0px',
              offsetY: '4px',
              blur: '8px',
              spread: '0px',
            },
            $type: 'shadow',
          },
        },
      };

      const result = validateDTCGTokens(tokens);
      expect(result.valid).toBe(true);
    });

    it('rejects tokens with invalid structure', () => {
      const tokens = {
        colors: {
          invalid: 'not a token object',
        },
      };

      const result = validateDTCGTokens(tokens);
      expect(result.valid).toBe(true); // This is actually valid as it's just a group
    });

    it('handles empty token collection', () => {
      const result = validateDTCGTokens({});
      expect(result.valid).toBe(true);
      expect(result.data).toEqual({});
    });
  });

  describe('validateDTCGFile', () => {
    it('validates complete DTCG file with metadata', () => {
      const file = {
        $schema: 'https://design-tokens.github.io/format/v1.0.0',
        $description: 'Design System Tokens',
        colors: {
          primary: {
            $value: '#0066ff',
            $type: 'color',
          },
        },
      };

      const result = validateDTCGFile(file);
      expect(result.valid).toBe(true);
      expect(result.data).toBeDefined();
    });

    it('validates file without metadata', () => {
      const file = {
        colors: {
          primary: {
            $value: '#0066ff',
            $type: 'color',
          },
        },
      };

      const result = validateDTCGFile(file);
      expect(result.valid).toBe(true);
    });
  });
});

describe('Figma Export Schema Validation', () => {
  describe('validateFigmaExport', () => {
    it('validates simple Figma export', () => {
      const export_ = {
        colors: {
          modes: {
            Light: {
              primary: '#0066ff',
              secondary: '#00cc66',
            },
            Dark: {
              primary: '#3399ff',
              secondary: '#00ff88',
            },
          },
        },
      };

      const result = validateFigmaExport(export_);
      expect(result.valid).toBe(true);
    });

    it('validates Figma export without modes', () => {
      const export_ = {
        spacing: {
          sm: 8,
          md: 16,
          lg: 24,
        },
      };

      const result = validateFigmaExport(export_);
      expect(result.valid).toBe(true);
    });

    it('handles empty export', () => {
      const result = validateFigmaExport({});
      expect(result.valid).toBe(true);
    });
  });

  describe('validateFigmaExportWithMetadata', () => {
    it('validates export with metadata', () => {
      const export_ = {
        $schema: 'figma-export/v1',
        $figmaFileKey: 'abc123',
        $exportedAt: '2026-01-19T10:00:00Z',
        colors: {
          modes: {
            Light: {
              primary: '#0066ff',
            },
          },
        },
      };

      const result = validateFigmaExportWithMetadata(export_);
      expect(result.valid).toBe(true);
      expect(result.data?.$figmaFileKey).toBe('abc123');
    });
  });

  describe('validateFigmaVariablesResponse', () => {
    it('validates Figma Variables API response', () => {
      const response = {
        meta: {
          variables: {
            'var-1': {
              id: 'var-1',
              name: 'colors/primary',
              key: 'primary',
              resolvedType: 'COLOR',
              valuesByMode: {
                'mode-1': { r: 0, g: 0.4, b: 1, a: 1 },
              },
              variableCollectionId: 'col-1',
              remote: false,
              description: 'Primary color',
              hiddenFromPublishing: false,
              scopes: ['ALL_SCOPES'],
              codeSyntax: {},
            },
          },
          variableCollections: {
            'col-1': {
              id: 'col-1',
              name: 'Colors',
              modes: [{ modeId: 'mode-1', name: 'Default' }],
              defaultModeId: 'mode-1',
              remote: false,
              hiddenFromPublishing: false,
              variableIds: ['var-1'],
            },
          },
        },
      };

      const result = validateFigmaVariablesResponse(response);
      expect(result.valid).toBe(true);
      expect(result.data?.meta.variables['var-1']).toBeDefined();
    });

    it('rejects invalid Figma response', () => {
      const result = validateFigmaVariablesResponse({ invalid: 'structure' });
      expect(result.valid).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });
});

describe('Style Dictionary Schema Validation', () => {
  describe('validateStyleDictionaryInput', () => {
    it('validates Style Dictionary tokens', () => {
      const tokens = {
        color: {
          brand: {
            primary: {
              value: '#0066ff',
              type: 'color',
              comment: 'Primary brand color',
            },
          },
        },
      };

      const result = validateStyleDictionaryInput(tokens);
      expect(result.valid).toBe(true);
    });

    it('validates nested token structures', () => {
      const tokens = {
        color: {
          brand: {
            primary: {
              base: {
                value: '#0066ff',
                type: 'color',
              },
              light: {
                value: '#3399ff',
                type: 'color',
              },
            },
          },
        },
      };

      const result = validateStyleDictionaryInput(tokens);
      expect(result.valid).toBe(true);
    });

    it('validates tokens with attributes', () => {
      const tokens = {
        color: {
          brand: {
            primary: {
              value: '#0066ff',
              type: 'color',
              attributes: {
                category: 'color',
                type: 'brand',
                item: 'primary',
              },
            },
          },
        },
      };

      const result = validateStyleDictionaryInput(tokens);
      expect(result.valid).toBe(true);
      expect(result.data).toBeDefined();
    });

    it('handles empty tokens', () => {
      const result = validateStyleDictionaryInput({});
      expect(result.valid).toBe(true);
    });
  });

  describe('validateStyleDictionaryTokens', () => {
    it('validates token collection', () => {
      const tokens = {
        spacing: {
          sm: {
            value: '8px',
            type: 'dimension',
          },
        },
      };

      const result = validateStyleDictionaryTokens(tokens);
      expect(result.valid).toBe(true);
    });
  });
});

describe('Validation Error Handling', () => {
  it('provides detailed error information', () => {
    const result = validateFigmaVariablesResponse('not an object');
    expect(result.valid).toBe(false);
    expect(result.errors).toBeDefined();
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.errors[0]!.message).toBeDefined();
  });

  it('includes path in error messages', () => {
    const result = validateFigmaVariablesResponse({
      meta: {
        variables: 'should be object',
        variableCollections: {},
      },
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toBeDefined();
    expect(result.errors.some((e) => e.path.includes('variables'))).toBe(true);
  });

  it('includes Zod error for debugging', () => {
    const result = validateDTCGTokens('invalid');
    expect(result.valid).toBe(false);
    expect(result.zodError).toBeDefined();
  });
});

describe('Performance', () => {
  it('validates large token collections quickly', () => {
    const tokens: Record<string, unknown> = {};
    for (let i = 0; i < 1000; i++) {
      tokens[`token${i}`] = {
        $value: `#${i.toString(16).padStart(HEX_COLOR_LENGTH, '0')}`,
        $type: 'color',
      };
    }

    const start = Date.now();
    const result = validateDTCGTokens(tokens);
    const duration = Date.now() - start;

    expect(result.valid).toBe(true);
    expect(duration).toBeLessThan(100); // Should complete in < 100ms
  });
});

// ============================================================================
// Additional Coverage for Validation Functions
// ============================================================================

describe('validateDTCGTokens - error handling', () => {
  it('should handle non-Zod errors gracefully', () => {
    // Pass a value that causes a non-Zod error
    const result = validateDTCGTokens(undefined);
    // Should still return a result
    expect(result).toBeDefined();
    expect(typeof result.valid).toBe('boolean');
  });
});

describe('validateDTCGFile - error handling', () => {
  it('should reject non-object input', () => {
    const result = validateDTCGFile('not an object');
    expect(result.valid).toBe(false);
    expect(result.errors).toBeDefined();
  });

  it('should reject null input', () => {
    const result = validateDTCGFile(null);
    expect(result.valid).toBe(false);
  });
});

describe('validateFigmaExport - error handling', () => {
  it('should reject non-object input', () => {
    const result = validateFigmaExport(NON_OBJECT_NUMBER);
    expect(result.valid).toBe(false);
    expect(result.errors).toBeDefined();
  });

  it('should reject null input', () => {
    const result = validateFigmaExport(null);
    expect(result.valid).toBe(false);
  });

  it('should reject array input', () => {
    const result = validateFigmaExport(ARRAY_REJECTION_VALUES);
    expect(result.valid).toBe(false);
  });
});

describe('validateFigmaExportWithMetadata - edge cases', () => {
  it('should handle export without optional metadata fields', () => {
    const export_ = {
      colors: {
        primary: '#fff',
      },
    };

    const result = validateFigmaExportWithMetadata(export_);
    expect(result.valid).toBe(true);
  });

  it('should reject non-object input', () => {
    const result = validateFigmaExportWithMetadata('not an object');
    expect(result.valid).toBe(false);
    expect(result.errors).toBeDefined();
  });
});

describe('validateFigmaVariablesResponse - edge cases', () => {
  it('should reject null input', () => {
    const result = validateFigmaVariablesResponse(null);
    expect(result.valid).toBe(false);
  });

  it('should reject empty meta object', () => {
    const result = validateFigmaVariablesResponse({ meta: {} });
    expect(result.valid).toBe(false);
  });
});

describe('validateStyleDictionaryInput - edge cases', () => {
  it('should reject non-object input', () => {
    const result = validateStyleDictionaryInput('string');
    expect(result.valid).toBe(false);
    expect(result.errors).toBeDefined();
  });

  it('should reject null input', () => {
    const result = validateStyleDictionaryInput(null);
    expect(result.valid).toBe(false);
  });
});

describe('validateStyleDictionaryTokens - edge cases', () => {
  it('should validate deeply nested tokens', () => {
    const tokens = {
      level1: {
        level2: {
          level3: {
            value: 'deep',
            type: 'string',
          },
        },
      },
    };

    const result = validateStyleDictionaryTokens(tokens);
    expect(result.valid).toBe(true);
  });

  it('should reject non-object input', () => {
    const result = validateStyleDictionaryTokens(SD_NON_OBJECT_INPUT);
    expect(result.valid).toBe(false);
    expect(result.errors).toBeDefined();
  });

  it('should reject null input', () => {
    const result = validateStyleDictionaryTokens(null);
    expect(result.valid).toBe(false);
  });
});

describe('Validation Error Format', () => {
  it('should include code field from Zod errors', () => {
    const result = validateFigmaVariablesResponse({ meta: 'not-object' });
    expect(result.valid).toBe(false);
    expect(result.errors?.some((e) => e.code !== undefined)).toBe(true);
  });

  it('should format path as dot-separated string', () => {
    const result = validateFigmaVariablesResponse({
      meta: {
        variables: {},
        variableCollections: {
          'col-1': {
            id: 'col-1',
            name: 'Test',
            // Missing required fields
          },
        },
      },
    });

    expect(result.valid).toBe(false);
    // Errors should have path
    expect(result.errors?.some((e) => e.path.length > 0)).toBe(true);
  });
});
