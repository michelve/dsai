/**
 * Unit tests for Style Dictionary transforms
 *
 * Tests cover:
 * - dimension/rem transform
 * - fontWeight/unitless transform
 * - lineHeight/unitless transform
 * - name/kebab transform
 * - Transform registration
 * - Filter functions
 */

import {
  builtInTransforms,
  registerTransforms,
  dimensionRem,
  fontWeightUnitless,
  lineHeightUnitless,
  nameKebab,
  nameJsIdentifier,
} from '../../../src/tokens/style-dictionary/transforms/index.js';

import type {
  SDToken,
  StyleDictionaryInstance,
} from '../../../src/tokens/style-dictionary/types.js';

// ============================================================================
// Helper Functions
// ============================================================================

function createToken(overrides: Partial<SDToken> = {}): SDToken {
  return {
    name: 'test-token',
    value: '#000',
    path: ['test'],
    $value: '#000',
    $type: 'color',
    original: { value: '#000', $value: '#000' },
    isSource: true,
    ...overrides,
  };
}

function assertFilter(
  filter: ((token: SDToken) => boolean) | undefined
): asserts filter is (token: SDToken) => boolean {
  if (filter === undefined) {
    throw new Error('Expected filter to be defined');
  }
}

// ============================================================================
// Built-in Transforms
// ============================================================================

describe('builtInTransforms', () => {
  it('should include all standard transforms', () => {
    expect(builtInTransforms).toHaveLength(5);

    const names = builtInTransforms.map((t) => t.name);
    expect(names).toContain('dimension/rem');
    expect(names).toContain('fontWeight/unitless');
    expect(names).toContain('lineHeight/unitless');
    expect(names).toContain('name/kebab');
    expect(names).toContain('name/js-identifier');
  });
});

// ============================================================================
// dimension/rem Transform
// ============================================================================

describe('dimensionRem', () => {
  describe('filter', () => {
    const filter = dimensionRem.filter;

    beforeEach(() => {
      assertFilter(filter);
    });

    it('should match dimension type', () => {
      assertFilter(filter);
      const token = createToken({ $type: 'dimension', path: ['spacing', 'md'] });
      expect(filter(token)).toBe(true);
    });

    it('should match spacing type', () => {
      assertFilter(filter);
      const token = createToken({ $type: 'spacing', path: ['spacing', 'lg'] });
      expect(filter(token)).toBe(true);
    });

    it('should match sizing type', () => {
      assertFilter(filter);
      const token = createToken({ $type: 'sizing', path: ['size', 'md'] });
      expect(filter(token)).toBe(true);
    });

    it('should exclude fontWeight type', () => {
      assertFilter(filter);
      const token = createToken({ $type: 'fontWeight', path: ['fontWeight', 'bold'] });
      expect(filter(token)).toBe(false);
    });

    it('should exclude lineHeight type', () => {
      assertFilter(filter);
      const token = createToken({ $type: 'lineHeight', path: ['lineHeight', 'normal'] });
      expect(filter(token)).toBe(false);
    });

    it('should exclude tokens with fontWeight in path', () => {
      assertFilter(filter);
      const token = createToken({
        $type: 'number',
        path: ['typography', 'fontWeight', 'bold'],
      });
      expect(filter(token)).toBe(false);
    });

    it('should exclude tokens with grid columns in path', () => {
      assertFilter(filter);
      const token = createToken({
        $type: 'dimension',
        path: ['grid', 'columns'],
      });
      expect(filter(token)).toBe(false);
    });
  });

  describe('transform', () => {
    it('should convert number to rem', () => {
      const token = createToken({ $value: 16, $type: 'dimension' });
      const result = dimensionRem.transform(token);
      expect(result).toBe('1rem');
    });

    it('should convert px string to rem', () => {
      const token = createToken({ $value: '24px', $type: 'dimension' });
      const result = dimensionRem.transform(token);
      expect(result).toBe('1.5rem');
    });

    it('should handle zero values', () => {
      const token = createToken({ $value: 0, $type: 'dimension' });
      const result = dimensionRem.transform(token);
      expect(result).toBe('0');
    });

    it('should handle zero px string', () => {
      const token = createToken({ $value: '0px', $type: 'dimension' });
      const result = dimensionRem.transform(token);
      expect(result).toBe('0');
    });

    it('should use custom base font size', () => {
      const token = createToken({ $value: 20, $type: 'dimension' });
      const result = dimensionRem.transform(token, { basePxFontSize: 20 });
      expect(result).toBe('1rem');
    });

    it('should passthrough non-convertible values', () => {
      const token = createToken({ $value: 'auto', $type: 'dimension' });
      const result = dimensionRem.transform(token);
      expect(result).toBe('auto');
    });

    it('should fallback to value if $value missing', () => {
      const token = createToken({
        $value: undefined,
        value: 32,
        $type: 'dimension',
      });
      const result = dimensionRem.transform(token);
      expect(result).toBe('2rem');
    });
  });
});

// ============================================================================
// fontWeight/unitless Transform
// ============================================================================

describe('fontWeightUnitless', () => {
  describe('filter', () => {
    const filter = fontWeightUnitless.filter;

    it('should match fontWeight type', () => {
      assertFilter(filter);
      const token = createToken({ $type: 'fontWeight', path: ['fontWeight', 'bold'] });
      expect(filter(token)).toBe(true);
    });

    it('should match number type', () => {
      assertFilter(filter);
      const token = createToken({ $type: 'number', path: ['fontWeight', 'medium'] });
      expect(filter(token)).toBe(true);
    });

    it('should match path containing fontWeight', () => {
      assertFilter(filter);
      const token = createToken({
        $type: 'color',
        path: ['typography', 'fontWeight', 'bold'],
      });
      expect(filter(token)).toBe(true);
    });
  });

  describe('transform', () => {
    it('should keep numeric value as number', () => {
      const token = createToken({ $value: 700, $type: 'fontWeight' });
      const result = fontWeightUnitless.transform(token);
      expect(result).toBe(700);
    });

    it('should convert numeric string to number', () => {
      const token = createToken({ $value: '400', $type: 'fontWeight' });
      const result = fontWeightUnitless.transform(token);
      expect(result).toBe(400);
    });

    it('should convert named weight to number', () => {
      const token = createToken({ $value: 'bold', $type: 'fontWeight' });
      const result = fontWeightUnitless.transform(token);
      expect(result).toBe(700);
    });

    it('should handle light weight', () => {
      const token = createToken({ $value: 'light', $type: 'fontWeight' });
      const result = fontWeightUnitless.transform(token);
      expect(result).toBe(300);
    });

    it('should handle normal weight', () => {
      const token = createToken({ $value: 'normal', $type: 'fontWeight' });
      const result = fontWeightUnitless.transform(token);
      expect(result).toBe(400);
    });

    it('should handle semibold weight', () => {
      const token = createToken({ $value: 'semibold', $type: 'fontWeight' });
      const result = fontWeightUnitless.transform(token);
      expect(result).toBe(600);
    });
  });
});

// ============================================================================
// lineHeight/unitless Transform
// ============================================================================

describe('lineHeightUnitless', () => {
  describe('filter', () => {
    const filter = lineHeightUnitless.filter;

    it('should match lineHeight type', () => {
      assertFilter(filter);
      const token = createToken({ $type: 'lineHeight', path: ['lineHeight', 'normal'] });
      expect(filter(token)).toBe(true);
    });

    it('should match number type with lineHeight in path', () => {
      assertFilter(filter);
      const token = createToken({
        $type: 'number',
        path: ['typography', 'lineHeight', 'tight'],
      });
      expect(filter(token)).toBe(true);
    });

    it('should match tokens with LINE_HEIGHT scope', () => {
      assertFilter(filter);
      const token = createToken({
        $type: 'number',
        $scopes: ['LINE_HEIGHT'],
        path: ['test'],
      });
      expect(filter(token)).toBe(true);
    });
  });

  describe('transform', () => {
    it('should keep numeric value as number', () => {
      const token = createToken({ $value: 1.5, $type: 'lineHeight' });
      const result = lineHeightUnitless.transform(token);
      expect(result).toBe(1.5);
    });

    it('should convert numeric string to number', () => {
      const token = createToken({ $value: '1.25', $type: 'lineHeight' });
      const result = lineHeightUnitless.transform(token);
      expect(result).toBe(1.25);
    });

    it('should handle integer values', () => {
      const token = createToken({ $value: 2, $type: 'lineHeight' });
      const result = lineHeightUnitless.transform(token);
      expect(result).toBe(2);
    });

    it('should passthrough non-numeric strings', () => {
      const token = createToken({ $value: 'normal', $type: 'lineHeight' });
      const result = lineHeightUnitless.transform(token);
      expect(result).toBe('normal');
    });
  });
});

// ============================================================================
// name/kebab Transform
// ============================================================================

describe('nameKebab', () => {
  it('should have correct name', () => {
    expect(nameKebab.name).toBe('name/kebab');
  });

  it('should be type name', () => {
    expect(nameKebab.type).toBe('name');
  });

  describe('transform', () => {
    it('should join path segments with hyphens and lowercase', () => {
      const token = createToken({ path: ['color', 'primaryBlue'] });
      const result = nameKebab.transform(token);
      // Implementation joins and lowercases, doesn't split camelCase
      expect(result).toBe('color-primaryblue');
    });

    it('should handle multi-segment paths', () => {
      const token = createToken({ path: ['spacing', 'component', 'buttonPadding'] });
      const result = nameKebab.transform(token);
      // Implementation joins with hyphen and lowercases
      expect(result).toBe('spacing-component-buttonpadding');
    });

    it('should handle already kebab-case paths', () => {
      const token = createToken({ path: ['color', 'blue', '500'] });
      const result = nameKebab.transform(token);
      expect(result).toBe('color-blue-500');
    });

    it('should handle single segment path', () => {
      const token = createToken({ path: ['primaryColor'] });
      const result = nameKebab.transform(token);
      // Implementation just lowercases, doesn't split camelCase
      expect(result).toBe('primarycolor');
    });

    it('should replace underscores with hyphens', () => {
      const token = createToken({ path: ['color', 'primary_blue'] });
      const result = nameKebab.transform(token);
      expect(result).toBe('color-primary-blue');
    });
  });
});

// ============================================================================
// name/js-identifier Transform
// ============================================================================

describe('nameJsIdentifier', () => {
  it('should have correct name and type', () => {
    expect(nameJsIdentifier.name).toBe('name/js-identifier');
    expect(nameJsIdentifier.type).toBe('name');
  });

  it('should convert to PascalCase for alphabetic segments', () => {
    const token = createToken({ path: ['colors', 'brand', 'primaryBase'] });
    const result = nameJsIdentifier.transform(token);
    expect(result).toBe('ColorsBrandPrimarybase');
  });

  it('should prefix numeric-only segments with underscore', () => {
    const token = createToken({ path: ['colors', 'neutral', 'gray', '100'] });
    const result = nameJsIdentifier.transform(token);
    expect(result).toBe('ColorsNeutralGray_100');
  });

  it('should prefix segments that start with numbers and keep casing', () => {
    const token = createToken({ path: ['grid', '12-col', 'span'] });
    const result = nameJsIdentifier.transform(token);
    expect(result).toBe('Grid_12ColSpan');
  });

  it('should handle numeric first segments', () => {
    const token = createToken({ path: ['100', 'level', 'token'] });
    const result = nameJsIdentifier.transform(token);
    expect(result).toBe('_100LevelToken');
  });
});

// ============================================================================
// Register Transforms
// ============================================================================

describe('registerTransforms', () => {
  it('should register all built-in transforms', () => {
    const registered: string[] = [];
    const mockSD: StyleDictionaryInstance = {
      registerTransform: jest.fn((config) => {
        registered.push(config.name);
      }),
      registerTransformGroup: jest.fn(),
      registerFormat: jest.fn(),
      registerPreprocessor: jest.fn(),
    };

    registerTransforms(mockSD);

    expect(mockSD.registerTransform).toHaveBeenCalledTimes(5);
    expect(registered).toContain('dimension/rem');
    expect(registered).toContain('fontWeight/unitless');
    expect(registered).toContain('lineHeight/unitless');
    expect(registered).toContain('name/kebab');
    expect(registered).toContain('name/js-identifier');
  });

  it('should register custom transforms', () => {
    const customTransform = {
      name: 'custom/transform',
      type: 'value' as const,
      filter: () => true,
      transform: () => 'custom',
    };

    const mockSD: StyleDictionaryInstance = {
      registerTransform: jest.fn(),
      registerTransformGroup: jest.fn(),
      registerFormat: jest.fn(),
      registerPreprocessor: jest.fn(),
    };

    registerTransforms(mockSD, [customTransform]);

    expect(mockSD.registerTransform).toHaveBeenCalledTimes(6);
    expect(mockSD.registerTransform).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'custom/transform' })
    );
  });
});
