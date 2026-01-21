/**
 * Unit tests for Style Dictionary formats
 *
 * Tests cover:
 * - css/variables-with-comments format
 * - typescript/declarations format
 * - Format registration
 */

import {
  builtInFormats,
  registerFormats,
  cssVariablesWithComments,
  typescriptDeclarations,
} from '../../../src/tokens/style-dictionary/formats/index.js';

import type {
  SDDictionary,
  SDToken,
  SDFormatArgs,
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

function createDictionary(tokens: SDToken[] = []): SDDictionary {
  return {
    allTokens: tokens,
    tokens: {},
    unfilteredTokens: {},
  };
}

function createFormatArgs(
  dictionary: SDDictionary,
  options: Record<string, unknown> = {}
): SDFormatArgs {
  return {
    dictionary,
    options,
    platform: {
      buildPath: 'dist/',
    },
    file: {
      destination: 'tokens.css',
      format: 'css/variables',
    },
  };
}

// ============================================================================
// Built-in Formats
// ============================================================================

describe('builtInFormats', () => {
  it('should include all standard formats', () => {
    expect(builtInFormats).toHaveLength(7);

    const names = builtInFormats.map((f) => f.name);
    expect(names).toContain('css/variables-dark-mode');
    expect(names).toContain('css/variables-with-comments');
    expect(names).toContain('typescript/declarations');
    expect(names).toContain('scss/framework-variables');
    expect(names).toContain('scss/bootstrap-variables');
    expect(names).toContain('scss/shadcn-variables');
  });
});

// ============================================================================
// css/variables-with-comments Format
// ============================================================================

describe('cssVariablesWithComments', () => {
  it('should have correct name', () => {
    expect(cssVariablesWithComments.name).toBe('css/variables-with-comments');
  });

  describe('format', () => {
    it('should generate :root with CSS variables', () => {
      const dictionary = createDictionary([
        createToken({ name: 'color-primary', value: '#007bff', $value: '#007bff' }),
      ]);

      const result = cssVariablesWithComments.format(createFormatArgs(dictionary));

      expect(result).toContain(':root {');
      expect(result).toContain('--color-primary: #007bff;');
      expect(result).toContain('}');
    });

    it('should use custom prefix', () => {
      const dictionary = createDictionary([
        createToken({ name: 'spacing-md', value: '1rem', $value: '1rem' }),
      ]);

      const result = cssVariablesWithComments.format(
        createFormatArgs(dictionary, { prefix: '--dsai-' })
      );

      expect(result).toContain('--dsai-spacing-md: 1rem;');
    });

    it('should include comments', () => {
      const dictionary = createDictionary([
        createToken({
          name: 'color-primary',
          value: '#007bff',
          comment: 'Primary brand color',
        }),
      ]);

      const result = cssVariablesWithComments.format(createFormatArgs(dictionary));

      expect(result).toContain('/* Primary brand color */');
    });

    it('should include descriptions', () => {
      const dictionary = createDictionary([
        createToken({
          name: 'color-secondary',
          value: '#6c757d',
          $description: 'Secondary brand color',
        }),
      ]);

      const result = cssVariablesWithComments.format(createFormatArgs(dictionary));

      expect(result).toContain('/* Secondary brand color */');
    });

    it('should handle multiple tokens', () => {
      const dictionary = createDictionary([
        createToken({ name: 'color-primary', value: '#007bff', $value: '#007bff' }),
        createToken({ name: 'color-secondary', value: '#6c757d', $value: '#6c757d' }),
        createToken({ name: 'spacing-md', value: '1rem', $value: '1rem' }),
      ]);

      const result = cssVariablesWithComments.format(createFormatArgs(dictionary));

      expect(result).toContain('--color-primary: #007bff;');
      expect(result).toContain('--color-secondary: #6c757d;');
      expect(result).toContain('--spacing-md: 1rem;');
    });

    it('should handle empty dictionary', () => {
      const dictionary = createDictionary([]);

      const result = cssVariablesWithComments.format(createFormatArgs(dictionary));

      expect(result).toBe(':root {\n\n}\n');
    });

    it('should handle numeric values', () => {
      const dictionary = createDictionary([
        createToken({ name: 'z-index-modal', value: 1000, $value: 1000 }),
      ]);

      const result = cssVariablesWithComments.format(createFormatArgs(dictionary));

      expect(result).toContain('--z-index-modal: 1000;');
    });

    it('should stringify object values', () => {
      const dictionary = createDictionary([
        createToken({
          name: 'shadow-md',
          value: { x: 0, y: 4, blur: 6, spread: -1 },
          $value: { x: 0, y: 4, blur: 6, spread: -1 },
        }),
      ]);

      const result = cssVariablesWithComments.format(createFormatArgs(dictionary));

      expect(result).toContain('--shadow-md:');
      expect(result).toContain('x');
      expect(result).toContain('blur');
    });
  });
});

// ============================================================================
// typescript/declarations Format
// ============================================================================

describe('typescriptDeclarations', () => {
  it('should have correct name', () => {
    expect(typescriptDeclarations.name).toBe('typescript/declarations');
  });

  describe('format', () => {
    it('should generate TypeScript interface', () => {
      const dictionary = createDictionary([
        createToken({
          name: 'color-primary',
          value: '#007bff',
          path: ['color', 'primary'],
        }),
      ]);

      const result = typescriptDeclarations.format(createFormatArgs(dictionary));

      expect(result).toContain('export interface DesignTokens');
    });

    it('should generate token name type unions', () => {
      const dictionary = createDictionary([
        createToken({
          name: 'color-primary',
          value: '#007bff',
          path: ['color', 'primary'],
        }),
        createToken({
          name: 'color-secondary',
          value: '#6c757d',
          path: ['color', 'secondary'],
        }),
      ]);

      const result = typescriptDeclarations.format(createFormatArgs(dictionary));

      expect(result).toContain('ColorTokenName');
    });

    it('should handle nested token paths', () => {
      const dictionary = createDictionary([
        createToken({
          name: 'typography-heading-font-size',
          value: '2rem',
          path: ['typography', 'heading', 'fontSize'],
        }),
      ]);

      const result = typescriptDeclarations.format(createFormatArgs(dictionary));

      expect(result).toContain('typography');
    });

    it('should handle empty dictionary', () => {
      const dictionary = createDictionary([]);

      const result = typescriptDeclarations.format(createFormatArgs(dictionary));

      expect(result).toContain('DesignTokens');
    });

    it('should determine correct types for values', () => {
      const dictionary = createDictionary([
        createToken({
          name: 'z-index',
          value: 100,
          path: ['zIndex', 'modal'],
        }),
        createToken({
          name: 'is-dark',
          value: true,
          path: ['theme', 'isDark'],
        }),
        createToken({
          name: 'color',
          value: '#000',
          path: ['color', 'black'],
        }),
      ]);

      const result = typescriptDeclarations.format(createFormatArgs(dictionary));

      expect(result).toContain('number');
      expect(result).toContain('boolean');
      expect(result).toContain('string');
    });
  });
});

// ============================================================================
// Register Formats
// ============================================================================

describe('registerFormats', () => {
  it('should register all built-in formats', () => {
    const registered: string[] = [];
    const mockSD: StyleDictionaryInstance = {
      registerTransform: jest.fn(),
      registerTransformGroup: jest.fn(),
      registerFormat: jest.fn((config) => {
        registered.push(config.name);
      }),
      registerPreprocessor: jest.fn(),
    };

    registerFormats(mockSD);

    expect(mockSD.registerFormat).toHaveBeenCalledTimes(7);
    expect(registered).toContain('css/variables-dark-mode');
    expect(registered).toContain('css/variables-with-comments');
    expect(registered).toContain('typescript/declarations');
    expect(registered).toContain('scss/framework-variables');
    expect(registered).toContain('scss/bootstrap-variables');
    expect(registered).toContain('scss/shadcn-variables');
  });

  it('should register custom formats', () => {
    const customFormat = {
      name: 'custom/format',
      format: () => 'custom output',
    };

    const mockSD: StyleDictionaryInstance = {
      registerTransform: jest.fn(),
      registerTransformGroup: jest.fn(),
      registerFormat: jest.fn(),
      registerPreprocessor: jest.fn(),
    };

    registerFormats(mockSD, [customFormat]);

    expect(mockSD.registerFormat).toHaveBeenCalledTimes(8);
    expect(mockSD.registerFormat).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'custom/format' })
    );
  });
});
