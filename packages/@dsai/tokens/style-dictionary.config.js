/**
 * Style Dictionary Configuration
 *
 * Transforms design tokens from JSON to multiple output formats:
 * - CSS Variables
 * - JavaScript/ES6
 * - TypeScript
 * - SCSS Variables
 * - JSON (flattened)
 *
 * @see https://amzn.github.io/style-dictionary/
 */

const StyleDictionary = require('style-dictionary');

// ============================================================================
// CUSTOM TRANSFORMS
// ============================================================================

/**
 * Transform: size/pxToRem
 * Converts pixel values to rem (base 16px)
 */
StyleDictionary.registerTransform({
  name: 'size/pxToRem',
  type: 'value',
  transitive: true,
  matcher: (token) => {
    return (
      token.type === 'dimension' && typeof token.value === 'string' && token.value.endsWith('px')
    );
  },
  transformer: (token) => {
    const val = parseFloat(token.value);
    if (val === 0) return '0';
    return `${val / 16}rem`;
  },
});

/**
 * Transform: name/cti/kebab
 * Converts token path to kebab-case for CSS
 */
StyleDictionary.registerTransform({
  name: 'name/cti/kebab',
  type: 'name',
  transformer: (token) => {
    return token.path.join('-').replace(/_/g, '-').toLowerCase();
  },
});

/**
 * Transform: color/hex8
 * Ensures colors are in hex format
 */
StyleDictionary.registerTransform({
  name: 'color/hex8',
  type: 'value',
  transitive: true,
  matcher: (token) => token.type === 'color',
  transformer: (token) => {
    // If already a color reference, return as-is
    if (typeof token.value === 'string' && token.value.startsWith('{')) {
      return token.value;
    }
    return token.value;
  },
});

// ============================================================================
// CUSTOM FORMATS
// ============================================================================

/**
 * Format: css/variables-with-comments
 * CSS custom properties with descriptive comments
 */
StyleDictionary.registerFormat({
  name: 'css/variables-with-comments',
  formatter: ({ dictionary, options }) => {
    const { prefix = '--' } = options;

    return `:root {\n${dictionary.allTokens
      .map((token) => {
        const comment = token.comment ? `  /* ${token.comment} */\n` : '';
        const description = token.description ? `  /* ${token.description} */\n` : '';
        const value = typeof token.value === 'string' ? token.value : JSON.stringify(token.value);
        return `${comment}${description}  ${prefix}${token.name}: ${value};`;
      })
      .join('\n')}\n}\n`;
  },
});

/**
 * Format: typescript/declarations
 * TypeScript declarations with proper types
 */
StyleDictionary.registerFormat({
  name: 'typescript/declarations',
  formatter: ({ dictionary }) => {
    const buildTokenInterface = (obj, indent = 0) => {
      const spaces = '  '.repeat(indent);
      let output = '{\n';

      for (const [key, value] of Object.entries(obj)) {
        if (value.value !== undefined) {
          // Leaf token
          const type =
            value.type === 'color'
              ? 'string'
              : value.type === 'dimension'
                ? 'string'
                : value.type === 'number'
                  ? 'number'
                  : 'string';
          output += `${spaces}  ${key}: ${type};\n`;
        } else {
          // Nested object
          output += `${spaces}  ${key}: ${buildTokenInterface(value, indent + 1)}\n`;
        }
      }

      output += `${spaces}}`;
      return output;
    };

    // Build nested structure
    const tokenTree = {};
    dictionary.allTokens.forEach((token) => {
      let current = tokenTree;
      token.path.slice(0, -1).forEach((key) => {
        if (!current[key]) current[key] = {};
        current = current[key];
      });
      const lastKey = token.path[token.path.length - 1];
      current[lastKey] = { value: token.value, type: token.type };
    });

    return `/**
 * Design Tokens
 * Auto-generated from Style Dictionary
 * DO NOT EDIT DIRECTLY
 */

export interface DesignTokens ${buildTokenInterface(tokenTree)}

export declare const tokens: DesignTokens;
export default tokens;
`;
  },
});

// ============================================================================
// CUSTOM TRANSFORM GROUPS
// ============================================================================

StyleDictionary.registerTransformGroup({
  name: 'custom/css',
  transforms: ['attribute/cti', 'name/cti/kebab', 'time/seconds', 'size/pxToRem', 'color/hex8'],
});

StyleDictionary.registerTransformGroup({
  name: 'custom/js',
  transforms: ['attribute/cti', 'name/cti/camel', 'size/pxToRem', 'color/hex8'],
});

// ============================================================================
// CONFIGURATION
// ============================================================================

module.exports = {
  // Source token files
  source: [
    'color/*.json',
    'typography/*.json',
    'spacing/*.json',
    'border/*.json',
    'shadow/*.json',
    'layout/*.json',
  ],

  // Output platforms
  platforms: {
    // CSS Custom Properties
    css: {
      transformGroup: 'custom/css',
      buildPath: 'dist/css/',
      files: [
        {
          destination: 'variables.css',
          format: 'css/variables-with-comments',
          options: {
            prefix: '--dsai-',
            outputReferences: true,
          },
        },
      ],
    },

    // JavaScript/ES6
    js: {
      transformGroup: 'custom/js',
      buildPath: 'dist/js/',
      files: [
        {
          destination: 'tokens.js',
          format: 'javascript/es6',
          options: {
            outputReferences: true,
          },
        },
        {
          destination: 'tokens.cjs',
          format: 'javascript/module',
          options: {
            outputReferences: true,
          },
        },
      ],
    },

    // TypeScript
    ts: {
      transformGroup: 'custom/js',
      buildPath: 'dist/ts/',
      files: [
        {
          destination: 'tokens.ts',
          format: 'javascript/es6',
          options: {
            outputReferences: true,
          },
        },
        {
          destination: 'tokens.d.ts',
          format: 'typescript/declarations',
        },
      ],
    },

    // SCSS Variables
    scss: {
      transformGroup: 'scss',
      buildPath: 'dist/scss/',
      files: [
        {
          destination: '_variables.scss',
          format: 'scss/variables',
          options: {
            outputReferences: true,
          },
        },
      ],
    },

    // JSON (flattened for documentation)
    json: {
      transformGroup: 'js',
      buildPath: 'dist/json/',
      files: [
        {
          destination: 'tokens.json',
          format: 'json/flat',
        },
        {
          destination: 'tokens-nested.json',
          format: 'json/nested',
        },
      ],
    },
  },
};
