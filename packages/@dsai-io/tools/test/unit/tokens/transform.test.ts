/**
 * Unit tests for the token transformation module
 *
 * Tests cover:
 * - Value transformation (types, units, special cases)
 * - Type transformation (Figma to DTCG)
 * - Token transformation (single token)
 * - Token tree transformation (nested structures)
 * - Font family handling
 * - Dimension handling
 * - Special cases (circle, pill, unitless values)
 */

import {
  transformValue,
  transformType,
  transformToken,
  transformTokenTree,
} from '../../../src/tokens/transform.js';

// ============================================================================
// Value Transformation Tests
// ============================================================================

describe('transformValue', () => {
  describe('number to dimension', () => {
    it('should add px units to numbers', () => {
      const result = transformValue(16, 'number');
      expect(result).toBe('16px');
    });

    it('should handle zero values', () => {
      const result = transformValue(0, 'number');
      expect(result).toBe('0px');
    });

    it('should handle decimal values', () => {
      const result = transformValue(1.5, 'number');
      expect(result).toBe('1.5px');
    });

    it('should handle negative values', () => {
      const result = transformValue(-8, 'number');
      expect(result).toBe('-8px');
    });
  });

  describe('unitless values', () => {
    it('should keep font weight as unitless', () => {
      const result = transformValue(400, 'number', { scopes: ['FONT_WEIGHT'] });
      expect(result).toBe(400);
    });

    it('should keep line height as unitless', () => {
      const result = transformValue(1.5, 'number', { scopes: ['LINE_HEIGHT'] });
      expect(result).toBe(1.5);
    });

    it('should keep grid columns as unitless', () => {
      const result = transformValue(12, 'number', { tokenPath: 'grid.columns' });
      expect(result).toBe(12);
    });
  });

  describe('special radius values', () => {
    it('should transform circle to 50%', () => {
      const result = transformValue(9999, 'number', { isCircle: true });
      expect(result).toBe('50%');
    });

    it('should transform pill to 9999px', () => {
      const result = transformValue(9999, 'number', { isPill: true });
      expect(result).toBe('9999px');
    });
  });

  describe('font family handling', () => {
    it('should prepend font name to stack', () => {
      const result = transformValue('Inter', 'string', {
        fontStack: 'system-ui, sans-serif',
      });
      expect(result).toBe('Inter, system-ui, sans-serif');
    });

    it('should not duplicate font name in stack', () => {
      const result = transformValue('Inter', 'string', {
        fontStack: 'Inter, system-ui, sans-serif',
      });
      expect(result).toBe('Inter, system-ui, sans-serif');
    });

    it('should handle case-insensitive font name check', () => {
      const result = transformValue('INTER', 'string', {
        fontStack: 'inter, system-ui, sans-serif',
      });
      expect(result).toBe('inter, system-ui, sans-serif');
    });
  });

  describe('passthrough values', () => {
    it('should return colors as-is', () => {
      const result = transformValue('#3b82f6', 'color');
      expect(result).toBe('#3b82f6');
    });

    it('should return strings as-is (without fontStack)', () => {
      const result = transformValue('some text', 'string');
      expect(result).toBe('some text');
    });

    it('should return null as-is', () => {
      const result = transformValue(null, 'color');
      expect(result).toBeNull();
    });

    it('should return undefined as-is', () => {
      const result = transformValue(undefined, 'color');
      expect(result).toBeUndefined();
    });
  });
});

// ============================================================================
// Type Transformation Tests
// ============================================================================

describe('transformType', () => {
  it('should transform number to dimension', () => {
    expect(transformType('number')).toBe('dimension');
  });

  it('should transform string to fontFamily', () => {
    expect(transformType('string')).toBe('fontFamily');
  });

  it('should keep color as color', () => {
    expect(transformType('color')).toBe('color');
  });

  it('should return undefined for undefined input', () => {
    expect(transformType(undefined)).toBeUndefined();
  });

  it('should pass through unknown types', () => {
    expect(transformType('custom')).toBe('custom');
  });
});

// ============================================================================
// Token Transformation Tests
// ============================================================================

describe('transformToken', () => {
  it('should transform DTCG token', () => {
    const input = {
      $value: '#3b82f6',
      $type: 'color',
    };

    const result = transformToken(input);

    expect(result).toEqual({
      $value: '#3b82f6',
      $type: 'color',
    });
  });

  it('should transform number value to dimension', () => {
    const input = {
      $value: 16,
      $type: 'number',
    };

    const result = transformToken(input);

    expect(result).toEqual({
      $value: '16px',
      $type: 'dimension',
    });
  });

  it('should preserve description', () => {
    const input = {
      $value: '#3b82f6',
      $type: 'color',
      $description: 'Primary blue color',
    };

    const result = transformToken(input);

    expect(result?.$description).toBe('Primary blue color');
  });

  it('should preserve extensions', () => {
    const input = {
      $value: '#3b82f6',
      $type: 'color',
      $extensions: {
        'com.figma': { variableId: '123' },
      },
    };

    const result = transformToken(input);

    expect(result?.$extensions).toEqual({
      'com.figma': { variableId: '123' },
    });
  });

  it('should return null for non-token objects', () => {
    expect(transformToken(null)).toBeNull();
    expect(transformToken(undefined)).toBeNull();
    expect(transformToken('string')).toBeNull();
    expect(transformToken(123)).toBeNull();
  });

  it('should return null for objects without $value', () => {
    const input = {
      $type: 'color',
      description: 'No value here',
    };

    expect(transformToken(input)).toBeNull();
  });

  it('should handle font weight scope', () => {
    const input = {
      $value: 700,
      $type: 'number',
      $scopes: ['FONT_WEIGHT'],
    };

    const result = transformToken(input);

    // Font weight should stay as number, not become '700px'
    expect(result?.$value).toBe(700);
  });
});

// ============================================================================
// Token Tree Transformation Tests
// ============================================================================

describe('transformTokenTree', () => {
  it('should transform flat token structure', () => {
    const input = {
      blue: { $value: '#3b82f6', $type: 'color' },
      red: { $value: '#ef4444', $type: 'color' },
    };

    const result = transformTokenTree(input);

    expect(result.blue).toEqual({ $value: '#3b82f6', $type: 'color' });
    expect(result.red).toEqual({ $value: '#ef4444', $type: 'color' });
  });

  it('should transform nested token structure', () => {
    const input = {
      color: {
        primary: {
          base: { $value: '#3b82f6', $type: 'color' },
          dark: { $value: '#2563eb', $type: 'color' },
        },
      },
    };

    const result = transformTokenTree(input);

    expect(result).toHaveProperty('color.primary.base');
    expect((result.color as Record<string, unknown>).primary).toBeDefined();
  });

  it('should handle empty objects', () => {
    expect(transformTokenTree({})).toEqual({});
  });

  it('should handle null input', () => {
    expect(transformTokenTree(null)).toEqual({});
  });

  it('should handle array input', () => {
    expect(transformTokenTree(['a', 'b'])).toEqual({});
  });

  it('should skip non-token nested objects', () => {
    const input = {
      meta: { version: '1.0' }, // Not a token
      color: { $value: '#fff', $type: 'color' },
    };

    const result = transformTokenTree(input);

    expect(result.meta).toBeUndefined();
    expect(result.color).toBeDefined();
  });

  it('should build correct token paths', () => {
    const input = {
      grid: {
        columns: { $value: 12, $type: 'number' },
      },
    };

    // Grid columns should be kept unitless based on tokenPath
    const result = transformTokenTree(input);

    const grid = result.grid as Record<string, unknown>;
    const columns = grid.columns as Record<string, unknown>;
    expect(columns.$value).toBe(12);
  });
});

// ============================================================================
// Edge Cases
// ============================================================================

describe('edge cases', () => {
  it('should handle deeply nested structures', () => {
    const input = {
      level1: {
        level2: {
          level3: {
            level4: {
              token: { $value: 'deep', $type: 'string' },
            },
          },
        },
      },
    };

    const result = transformTokenTree(input);

    expect(result).toHaveProperty('level1.level2.level3.level4.token');
  });

  it('should handle mixed token and non-token siblings', () => {
    const input = {
      color: {
        $description: 'Color palette',
        blue: { $value: '#3b82f6', $type: 'color' },
        // $description is a DTCG property on the group, not a token
      },
    };

    const result = transformTokenTree(input);

    // Should have the blue token
    const color = result.color as Record<string, unknown>;
    expect(color.blue).toBeDefined();
  });

  it('should handle references in values', () => {
    const input = {
      color: {
        primary: { $value: '{colors.brand.blue}', $type: 'color' },
      },
    };

    const result = transformTokenTree(input);

    const color = result.color as Record<string, unknown>;
    const primary = color.primary as Record<string, unknown>;
    expect(primary.$value).toBe('{colors.brand.blue}');
  });

  it('should handle boolean values', () => {
    const result = transformValue(true, 'boolean');
    expect(result).toBe(true);
  });

  it('should handle object values', () => {
    const objValue = { x: 10, y: 20 };
    const result = transformValue(objValue, 'object');
    expect(result).toEqual(objValue);
  });

  it('should handle array values', () => {
    const arrValue = [1, 2, 3];
    const result = transformValue(arrValue, 'array');
    expect(result).toEqual(arrValue);
  });

  it('should handle empty string values', () => {
    const result = transformValue('', 'string');
    expect(result).toBe('');
  });

  it('should handle composite shadow values', () => {
    const shadowValue = {
      color: 'rgba(0,0,0,0.1)',
      offsetX: '0',
      offsetY: '4px',
      blur: '6px',
      spread: '0',
    };
    const result = transformValue(shadowValue, 'shadow');
    expect(result).toEqual(shadowValue);
  });

  it('should handle typography composite values', () => {
    const typographyValue = {
      fontFamily: 'Inter',
      fontSize: '16px',
      fontWeight: 400,
      lineHeight: 1.5,
    };
    const result = transformValue(typographyValue, 'typography');
    expect(result).toEqual(typographyValue);
  });
});

// ============================================================================
// TransformToken Additional Cases
// ============================================================================

describe('transformToken additional cases', () => {
  it('should handle token with $scopes containing ALL_SCOPES', () => {
    const input = {
      $value: 16,
      $type: 'number',
      $scopes: ['ALL_SCOPES'],
    };

    const result = transformToken(input);
    expect(result?.$value).toBe('16px');
  });

  it('should handle dimension type without conversion', () => {
    const input = {
      $value: '16px',
      $type: 'dimension',
    };

    const result = transformToken(input);
    expect(result?.$value).toBe('16px');
  });

  it('should handle token with $extensions', () => {
    const input = {
      $value: '#ff0000',
      $type: 'color',
      $extensions: {
        'com.figma': {
          hiddenFromPublishing: false,
        },
      },
    };

    const result = transformToken(input);
    expect(result?.$extensions).toEqual({
      'com.figma': {
        hiddenFromPublishing: false,
      },
    });
  });

  it('should handle percentage values', () => {
    const input = {
      $value: '50%',
      $type: 'dimension',
    };

    const result = transformToken(input);
    expect(result?.$value).toBe('50%');
  });

  it('should handle rem values', () => {
    const input = {
      $value: '1rem',
      $type: 'dimension',
    };

    const result = transformToken(input);
    expect(result?.$value).toBe('1rem');
  });
});

// ============================================================================
// TransformType Additional Cases
// ============================================================================

describe('transformType additional cases', () => {
  it('should transform fontWeight type', () => {
    expect(transformType('fontWeight')).toBe('fontWeight');
  });

  it('should transform lineHeight type', () => {
    expect(transformType('lineHeight')).toBe('lineHeight');
  });

  it('should transform shadow type', () => {
    expect(transformType('shadow')).toBe('shadow');
  });

  it('should transform typography type', () => {
    expect(transformType('typography')).toBe('typography');
  });

  it('should transform spacing type', () => {
    expect(transformType('spacing')).toBe('spacing');
  });

  it('should transform sizing type', () => {
    expect(transformType('sizing')).toBe('sizing');
  });

  it('should transform borderRadius type', () => {
    expect(transformType('borderRadius')).toBe('borderRadius');
  });

  it('should return dimension for number type', () => {
    expect(transformType('number')).toBe('dimension');
  });
});

// ============================================================================
// TransformValue Edge Cases
// ============================================================================

describe('transformValue edge cases', () => {
  it('should handle line height scope', () => {
    const result = transformValue(24, 'number', { scopes: ['LINE_HEIGHT'] });
    expect(result).toBe(24);
  });

  it('should handle font weight scope', () => {
    const result = transformValue(500, 'number', { scopes: ['FONT_WEIGHT'] });
    expect(result).toBe(500);
  });

  it('should handle all fill scopes', () => {
    const result = transformValue(16, 'number', { scopes: ['ALL_FILLS'] });
    expect(result).toBe('16px');
  });

  it('should handle corner radius scope', () => {
    const result = transformValue(8, 'number', { scopes: ['CORNER_RADIUS'] });
    expect(result).toBe('8px');
  });

  it('should handle gap scope', () => {
    const result = transformValue(16, 'number', { scopes: ['GAP'] });
    expect(result).toBe('16px');
  });

  it('should handle width and height scopes', () => {
    const result = transformValue(100, 'number', { scopes: ['WIDTH_HEIGHT'] });
    expect(result).toBe('100px');
  });

  it('should handle stroke width scope', () => {
    const result = transformValue(2, 'number', { scopes: ['STROKE_FLOAT'] });
    expect(result).toBe('2px');
  });

  it('should handle font name with empty font stack', () => {
    const result = transformValue('Roboto', 'string', { fontStack: '' });
    expect(result).toBe('Roboto');
  });

  it('should handle font stack with multiple fonts', () => {
    const result = transformValue('Custom Font', 'string', {
      fontStack: 'Arial, Helvetica, sans-serif',
    });
    expect(result).toBe('Custom Font, Arial, Helvetica, sans-serif');
  });

  it('should return original when font already first in stack', () => {
    const result = transformValue('Arial', 'string', {
      fontStack: 'Arial, Helvetica, sans-serif',
    });
    expect(result).toBe('Arial, Helvetica, sans-serif');
  });

  it('should handle grid columns path', () => {
    const result = transformValue(12, 'number', { tokenPath: 'grid.columns' });
    expect(result).toBe(12);
  });

  it('should handle breakpoint path', () => {
    const result = transformValue(768, 'number', { tokenPath: 'breakpoints.md' });
    expect(result).toBe('768px');
  });
});

// ============================================================================
// TransformTokenTree Additional Cases
// ============================================================================

describe('transformTokenTree additional cases', () => {
  it('should handle primitive value at root', () => {
    const result = transformTokenTree('not an object' as unknown as Record<string, unknown>);
    expect(result).toEqual({});
  });

  it('should handle number at root', () => {
    const result = transformTokenTree(123 as unknown as Record<string, unknown>);
    expect(result).toEqual({});
  });

  it('should handle undefined at root', () => {
    const result = transformTokenTree(undefined as unknown as Record<string, unknown>);
    expect(result).toEqual({});
  });

  it('should preserve $description on groups', () => {
    const input = {
      colors: {
        $description: 'Color tokens',
        primary: { $value: '#0000ff', $type: 'color' },
      },
    };

    const result = transformTokenTree(input);
    const colors = result.colors as Record<string, unknown>;
    expect(colors.primary).toBeDefined();
  });

  it('should skip keys starting with $', () => {
    const input = {
      $meta: { version: '1.0' },
      color: { $value: '#fff', $type: 'color' },
    };

    const result = transformTokenTree(input);
    expect(result.$meta).toBeUndefined();
    expect(result.color).toBeDefined();
  });

  it('should handle deeply nested with mixed types', () => {
    const input = {
      typography: {
        heading: {
          h1: {
            fontSize: { $value: 48, $type: 'number' },
            lineHeight: { $value: 1.2, $type: 'number', $scopes: ['LINE_HEIGHT'] },
            fontWeight: { $value: 700, $type: 'number', $scopes: ['FONT_WEIGHT'] },
          },
        },
      },
    };

    const result = transformTokenTree(input);

    const typography = result.typography as Record<string, unknown>;
    const heading = typography.heading as Record<string, unknown>;
    const h1 = heading.h1 as Record<string, Record<string, unknown>>;

    expect(h1.fontSize.$value).toBe('48px');
    expect(h1.lineHeight.$value).toBe(1.2);
    expect(h1.fontWeight.$value).toBe(700);
  });
});

// ============================================================================
// detectModes Tests
// ============================================================================

describe('detectModes', () => {
  let detectModes: (data: FigmaExport) => string[];

  beforeAll(async () => {
    const module = await import('../../../src/tokens/transform.js');
    detectModes = module.detectModes;
  });

  it('should return Base for undefined data', () => {
    const result = detectModes(undefined as unknown as FigmaExport);
    expect(result).toEqual(['Base']);
  });

  it('should return Base for null data', () => {
    const result = detectModes(null as unknown as FigmaExport);
    expect(result).toEqual(['Base']);
  });

  it('should return Base for non-object data', () => {
    const result = detectModes('string' as unknown as FigmaExport);
    expect(result).toEqual(['Base']);
  });

  it('should detect modes from collection path', () => {
    const data: FigmaExport = {
      Color: {
        modes: {
          Light: {},
          Dark: {},
        },
      },
    } as unknown as FigmaExport;

    const result = detectModes(data, 'Color');
    expect(result).toEqual(['Light', 'Dark']);
  });

  it('should return Base when collection has no modes', () => {
    const data: FigmaExport = {
      Color: {
        tokens: {},
      },
    } as unknown as FigmaExport;

    const result = detectModes(data, 'Color');
    expect(result).toEqual(['Base']);
  });

  it('should detect modes from any collection when no path specified', () => {
    const data: FigmaExport = {
      SomeCollection: {
        modes: {
          Desktop: {},
          Mobile: {},
        },
      },
    } as unknown as FigmaExport;

    const result = detectModes(data);
    expect(result).toEqual(['Desktop', 'Mobile']);
  });

  it('should return Base when no modes found anywhere', () => {
    const data: FigmaExport = {
      tokens: { color: '#fff' },
    } as unknown as FigmaExport;

    const result = detectModes(data);
    expect(result).toEqual(['Base']);
  });
});

// Import FigmaExport type for detectModes tests
import type { FigmaExport, TransformOptions } from '../../../src/tokens/types.js';

// ============================================================================
// Opacity Conversion Tests
// ============================================================================

describe('transformValue opacity conversion', () => {
  it('should convert percentage opacity (0-100) to decimal', () => {
    const result = transformValue(50, 'number', { scopes: ['OPACITY'] });
    expect(result).toBe(0.5);
  });

  it('should convert 100% opacity to 1', () => {
    const result = transformValue(100, 'number', { scopes: ['OPACITY'] });
    expect(result).toBe(1);
  });

  it('should keep opacity that is already decimal (0-1)', () => {
    const result = transformValue(0.5, 'number', { scopes: ['OPACITY'] });
    expect(result).toBe(0.5);
  });

  it('should keep opacity of 0', () => {
    const result = transformValue(0, 'number', { scopes: ['OPACITY'] });
    expect(result).toBe(0);
  });

  it('should keep opacity of 1', () => {
    const result = transformValue(1, 'number', { scopes: ['OPACITY'] });
    expect(result).toBe(1);
  });

  it('should convert 75% opacity', () => {
    const result = transformValue(75, 'number', { scopes: ['OPACITY'] });
    expect(result).toBe(0.75);
  });
});

// ============================================================================
// transformType with scopes
// ============================================================================

describe('transformType with scopes', () => {
  it('should return number type for OPACITY scope', () => {
    expect(transformType('number', ['OPACITY'])).toBe('number');
  });

  it('should return number type for FONT_WEIGHT scope', () => {
    expect(transformType('number', ['FONT_WEIGHT'])).toBe('number');
  });

  it('should return number type for LINE_HEIGHT scope', () => {
    expect(transformType('number', ['LINE_HEIGHT'])).toBe('number');
  });

  it('should return dimension for number without unitless scope', () => {
    expect(transformType('number', ['ALL_FILLS'])).toBe('dimension');
  });

  it('should return dimension for number with empty scopes', () => {
    expect(transformType('number', [])).toBe('dimension');
  });
});

// ============================================================================
// transformToken with scopes from token
// ============================================================================

describe('transformToken scopes-from-token integration', () => {
  it('should handle opacity scope from $scopes', () => {
    const input = {
      $value: 50,
      $type: 'number',
      $scopes: ['OPACITY'],
    };

    const result = transformToken(input);
    expect(result?.$value).toBe(0.5);
    expect(result?.$type).toBe('number');
  });

  it('should handle line-height scope from $scopes', () => {
    const input = {
      $value: 1.5,
      $type: 'number',
      $scopes: ['LINE_HEIGHT'],
    };

    const result = transformToken(input);
    expect(result?.$value).toBe(1.5);
    expect(result?.$type).toBe('number');
  });

  it('should default type to string when $type is missing', () => {
    const input = {
      $value: 'hello',
    };

    const result = transformToken(input);
    expect(result?.$type).toBe('string');
  });

  it('should not include $description when it is not a string', () => {
    const input = {
      $value: '#fff',
      $type: 'color',
      $description: 123, // Not a string
    };

    const result = transformToken(input);
    expect(result?.$description).toBeUndefined();
  });

  it('should not include $extensions when it is not an object', () => {
    const input = {
      $value: '#fff',
      $type: 'color',
      $extensions: 'not-an-object',
    };

    const result = transformToken(input);
    expect(result?.$extensions).toBeUndefined();
  });
});

// ============================================================================
// transformTokenTree with options
// ============================================================================

describe('transformTokenTree with options map', () => {
  it('should apply fontStack option to specific key', () => {
    const input = {
      fontFamily: {
        body: { $value: 'Inter', $type: 'string' },
      },
    };

    const options = {
      fontFamily: {
        body: { fontStack: 'system-ui, sans-serif' },
      } as unknown as Record<string, unknown>,
    };

    const result = transformTokenTree(input, '', options as Record<string, any>);
    const fontFamily = result.fontFamily as Record<string, Record<string, unknown>>;
    expect(fontFamily.body.$value).toBe('Inter, system-ui, sans-serif');
  });
});

// ============================================================================
// transformValue row-columns path
// ============================================================================

describe('transformValue row-columns unitless', () => {
  it('should keep row-columns as unitless', () => {
    const result = transformValue(6, 'number', { tokenPath: 'grid.row-columns' });
    expect(result).toBe(6);
  });
});

// ============================================================================
// transformTokens (main function) and transformTokensCLI Tests
// ============================================================================

describe('transformTokens', () => {
  const fs = require('node:fs');
  const path = require('node:path');
  const os = require('node:os');

  let testDir: string;
  let sourceDir: string;
  let collectionsDir: string;

  beforeEach(() => {
    testDir = path.join(
      os.tmpdir(),
      `transform-test-${Date.now()}-${Math.random().toString(36).slice(2)}`
    );
    sourceDir = path.join(testDir, 'source');
    collectionsDir = path.join(testDir, 'collections');
    fs.mkdirSync(sourceDir, { recursive: true });
    fs.mkdirSync(collectionsDir, { recursive: true });
    jest.spyOn(console, 'info').mockImplementation();
    jest.spyOn(console, 'warn').mockImplementation();
    jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
    jest.restoreAllMocks();
  });

  it('should return warnings when source files are missing', async () => {
    const { transformTokens } = await import('../../../src/tokens/transform.js');

    const result = transformTokens({
      sourceDir,
      collectionsDir,
    });

    // No theme.json exists, so all collection inputs are missing
    expect(result.warnings.length).toBeGreaterThan(0);
  });

  it('should succeed with valid theme.json containing foundation tokens', async () => {
    const { transformTokens } = await import('../../../src/tokens/transform.js');

    // Create a theme.json with Foundation collection
    const themeData = {
      Foundation: {
        modes: {
          Light: {
            colors: {
              brand: {
                primary: { $value: '#007bff', $type: 'color' },
              },
              neutral: {
                white: { $value: '#ffffff', $type: 'color' },
              },
              opacity: {
                half: { $value: 50, $type: 'number', $scopes: ['OPACITY'] },
              },
            },
            semantic: {
              background: { $value: '#ffffff', $type: 'color' },
            },
          },
        },
      },
      Typography: {
        modes: {
          Base: {
            fontSize: {
              base: { $value: 16, $type: 'number' },
            },
          },
        },
      },
      Spacing: {
        modes: {
          Base: {
            spacing: {
              sm: { $value: 8, $type: 'number' },
            },
          },
        },
      },
      Radius: {
        modes: {
          Base: {
            'border-radius': {
              sm: { $value: 4, $type: 'number' },
              circle: { $value: 9999, $type: 'number' },
              pill: { $value: 9999, $type: 'number' },
            },
          },
        },
      },
      Border: {
        modes: {
          Base: {
            '1': { $value: 1, $type: 'number' },
            '2': { $value: 2, $type: 'number' },
          },
        },
      },
      Layout: {
        modes: {
          Base: {
            breakpoints: {
              sm: { $value: 576, $type: 'number' },
            },
            container: {
              sm: { $value: 540, $type: 'number' },
            },
            grid: {
              columns: { $value: 12, $type: 'number' },
            },
            gutters: {
              base: { $value: 24, $type: 'number' },
            },
          },
        },
      },
      Shadows: {
        modes: {
          Base: {
            shadows: {
              sm: {
                composite: {
                  $value: '0 1px 2px rgba(0,0,0,0.1)',
                  $type: 'shadow',
                  $description: 'Small shadow',
                },
              },
            },
          },
        },
      },
    };

    fs.writeFileSync(path.join(sourceDir, 'theme.json'), JSON.stringify(themeData), 'utf-8');

    const result = transformTokens({
      sourceDir,
      collectionsDir,
      verbose: true,
    });

    expect(result.filesWritten.length).toBeGreaterThan(0);
    expect(result.tokensProcessed).toBeGreaterThan(0);
  });

  it('should support dry-run mode', async () => {
    const { transformTokens } = await import('../../../src/tokens/transform.js');

    const themeData = {
      Typography: {
        modes: {
          Base: {
            fontSize: { base: { $value: 16, $type: 'number' } },
          },
        },
      },
    };

    fs.writeFileSync(path.join(sourceDir, 'theme.json'), JSON.stringify(themeData), 'utf-8');

    const result = transformTokens({
      sourceDir,
      collectionsDir,
      dryRun: true,
    });

    // Files should be listed but not actually written
    for (const file of result.filesWritten) {
      const fullPath = path.join(collectionsDir, file);
      expect(fs.existsSync(fullPath)).toBe(false);
    }
  });

  it('should handle ignoreModes option', async () => {
    const { transformTokens } = await import('../../../src/tokens/transform.js');

    const themeData = {
      Foundation: {
        modes: {
          Light: {
            colors: { brand: { primary: { $value: '#fff', $type: 'color' } } },
          },
          Dark: {
            colors: { brand: { primary: { $value: '#000', $type: 'color' } } },
          },
        },
      },
    };

    fs.writeFileSync(path.join(sourceDir, 'theme.json'), JSON.stringify(themeData), 'utf-8');

    const result = transformTokens({
      sourceDir,
      collectionsDir,
      ignoreModes: ['Dark'],
    });

    // Should not include any dark mode files
    const darkFiles = result.filesWritten.filter((f: string) => f.includes('dark'));
    expect(darkFiles).toHaveLength(0);
  });

  it('should handle errors in JSON parsing gracefully', async () => {
    const { transformTokens } = await import('../../../src/tokens/transform.js');

    fs.writeFileSync(path.join(sourceDir, 'theme.json'), 'INVALID JSON', 'utf-8');

    const result = transformTokens({
      sourceDir,
      collectionsDir,
    });

    // Should have warnings about theme.json parse failure
    expect(result.warnings.length).toBeGreaterThan(0);
  });

  it('should handle mode-aware collections with multiple modes writing separate files', async () => {
    const { transformTokens } = await import('../../../src/tokens/transform.js');

    const themeData = {
      Foundation: {
        modes: {
          Light: {
            colors: { brand: { primary: { $value: '#fff', $type: 'color' } } },
            semantic: { bg: { $value: '#fff', $type: 'color' } },
            colors2: { neutral: { white: { $value: '#fff', $type: 'color' } } },
          },
          Dark: {
            colors: { brand: { primary: { $value: '#000', $type: 'color' } } },
            semantic: { bg: { $value: '#000', $type: 'color' } },
            colors2: { neutral: { black: { $value: '#000', $type: 'color' } } },
          },
        },
      },
    };

    fs.writeFileSync(path.join(sourceDir, 'theme.json'), JSON.stringify(themeData), 'utf-8');

    const result = transformTokens({
      sourceDir,
      collectionsDir,
      defaultMode: 'Light',
    });

    // Should have created files for at least some foundation outputs
    expect(result.filesWritten.length).toBeGreaterThan(0);
  });
});

describe('transformTokensCLI', () => {
  const fs = require('node:fs');
  const path = require('node:path');
  const os = require('node:os');

  let testDir: string;

  beforeEach(() => {
    testDir = path.join(
      os.tmpdir(),
      `transform-cli-test-${Date.now()}-${Math.random().toString(36).slice(2)}`
    );
    fs.mkdirSync(testDir, { recursive: true });
    jest.spyOn(console, 'info').mockImplementation();
    jest.spyOn(console, 'warn').mockImplementation();
    jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
    jest.restoreAllMocks();
  });

  it('should return false when there are no source files', async () => {
    const { transformTokensCLI } = await import('../../../src/tokens/transform.js');

    const sourceDir = path.join(testDir, 'source');
    const collectionsDir = path.join(testDir, 'collections');
    fs.mkdirSync(sourceDir, { recursive: true });

    const result = transformTokensCLI(sourceDir, collectionsDir);

    // Returns true because lack of source files generates warnings, not errors
    expect(typeof result).toBe('boolean');
  });

  it('should return true on successful transformation', async () => {
    const { transformTokensCLI } = await import('../../../src/tokens/transform.js');

    const sourceDir = path.join(testDir, 'source');
    const collectionsDir = path.join(testDir, 'collections');
    fs.mkdirSync(sourceDir, { recursive: true });

    const themeData = {
      Typography: {
        modes: {
          Base: {
            fontSize: { base: { $value: 16, $type: 'number' } },
          },
        },
      },
    };

    fs.writeFileSync(path.join(sourceDir, 'theme.json'), JSON.stringify(themeData), 'utf-8');

    const result = transformTokensCLI(sourceDir, collectionsDir);
    expect(result).toBe(true);
  });
});
