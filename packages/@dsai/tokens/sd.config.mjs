/**
 * Style Dictionary Configuration (DTCG-Compliant)
 *
 * Transforms design tokens from DTCG format to multiple output formats:
 * - CSS Variables
 * - JavaScript/ES6
 * - TypeScript
 * - SCSS Variables
 * - JSON (flattened)
 *
 * DTCG Format: Uses $ prefix for special properties ($value, $type, $description, $extensions)
 * This aligns with W3C Design Tokens Community Group specification
 *
 * @see https://styledictionary.com/
 * @see https://www.designtokens.org/
 */

import StyleDictionary from 'style-dictionary';

// ============================================================================
// CUSTOM PREPROCESSORS
// ============================================================================

/**
 * Preprocessor: Fix token references
 * Our tokens use "color.blue.500" but references say "{colors.brand.blue.500}"
 * This preprocessor fixes the mismatch
 */
StyleDictionary.registerPreprocessor({
  name: 'fix-references',
  preprocessor: (dictionary) => {
    // Create aliases for references to work
    // Map colors.brand.* -> color.*
    // Map colors.neutral.* -> neutral.*
    // Map borders.width.* -> border.width.*

    const fixValue = (value) => {
      if (typeof value === 'string' && value.startsWith('{')) {
        // Fix reference paths
        return value
          .replace(/\{colors\.brand\./g, '{color.')
          .replace(/\{colors\.neutral\./g, '{neutral.')
          .replace(/\{borders\.width\./g, '{border.width.');
      }
      return value;
    };

    const processTokens = (obj) => {
      for (const key in obj) {
        if (obj[key] && typeof obj[key] === 'object') {
          // Check for DTCG format ($value) or Style Dictionary format (value)
          if (obj[key].$value !== undefined) {
            // DTCG format - fix $value
            obj[key].$value = fixValue(obj[key].$value);
          } else if (obj[key].value !== undefined) {
            // Legacy format - fix value
            obj[key].value = fixValue(obj[key].value);
          } else {
            // Recurse
            processTokens(obj[key]);
          }
        }
      }
    };

    processTokens(dictionary);
    return dictionary;
  },
});

// ============================================================================
// CUSTOM TRANSFORMS
// ============================================================================

/**
 * Custom Transform: fontWeight/unitless
 * Keeps font-weight as unitless numbers (300, 400, 700, etc.)
 * DTCG-compatible: checks both $type and type
 *
 * Style Dictionary v5 Best Practice:
 * Source tokens store raw numbers, transforms add units
 */
StyleDictionary.registerTransform({
  name: 'fontWeight/unitless',
  type: 'value',
  filter: (token) => {
    const tokenType = token.$type || token.type;
    // Match fontWeight type or check path for font-weight
    const isFontWeight = tokenType === 'fontWeight' || tokenType === 'number';
    const pathHasFontWeight =
      token.path &&
      token.path.some((part) => {
        const lower = String(part).toLowerCase();
        return (
          lower === 'fontweight' || lower.includes('font-weight') || lower.includes('fontweight')
        );
      });
    return isFontWeight || pathHasFontWeight;
  },
  transform: (token) => {
    const value = token.$value || token.value;
    // Return unitless number (CSS font-weight must be unitless)
    return typeof value === 'number' ? value : parseInt(String(value), 10);
  },
});

/**
 * Custom Transform: dimension/rem
 * Converts number dimensions to rem (divide by basePxFontSize, default 16)
 * Handles raw numbers from source tokens
 * DTCG-compatible: checks both $value and value
 *
 * Style Dictionary v5 Best Practice:
 * Source tokens: {"value": 16, "type": "dimension"}
 * Output: 1rem
 */
StyleDictionary.registerTransform({
  name: 'dimension/rem',
  type: 'value',
  filter: (token) => {
    const tokenType = token.$type || token.type;
    // Exclude font-weights
    const isFontWeight = tokenType === 'fontWeight' || tokenType === 'number';
    if (isFontWeight) return false;

    const pathHasFontWeight =
      token.path &&
      token.path.some((part) => {
        const lower = String(part).toLowerCase();
        return (
          lower === 'fontweight' || lower.includes('font-weight') || lower.includes('fontweight')
        );
      });
    if (pathHasFontWeight) return false;

    // Include dimensions, spacing, sizing
    return tokenType === 'dimension' || tokenType === 'spacing' || tokenType === 'sizing';
  },
  transform: (token, options) => {
    const value = token.$value || token.value;
    const baseFontSize = options?.basePxFontSize || 16;

    // Handle raw numbers (preferred approach)
    if (typeof value === 'number') {
      if (value === 0) return '0';
      return `${value / baseFontSize}rem`;
    }

    // Handle string values like "16px" (legacy)
    if (typeof value === 'string' && value.endsWith('px')) {
      const numValue = parseFloat(value);
      if (numValue === 0) return '0';
      return `${numValue / baseFontSize}rem`;
    }

    // Return as-is if not a number or px value
    return value;
  },
});

/**
 * Transform: name/kebab
 * Converts token path to kebab-case for CSS
 */
StyleDictionary.registerTransform({
  name: 'name/kebab',
  type: 'name',
  transform: (token) => {
    return token.path.join('-').replace(/_/g, '-').toLowerCase();
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
  format: ({ dictionary, options }) => {
    const { prefix = '--' } = options;

    return `:root {\n${dictionary.allTokens
      .map((token) => {
        const comment = token.comment ? `  /* ${token.comment} */\n` : '';
        const description = token.description ? `  /* ${token.description} */\n` : '';
        // Style Dictionary v5 DTCG mode: Use $value if present, fallback to value
        const tokenValue = token.$value !== undefined ? token.$value : token.value;
        const value = typeof tokenValue === 'string' ? tokenValue : JSON.stringify(tokenValue);
        return `${comment}${description}  ${prefix}${token.name}: ${value};`;
      })
      .join('\n')}\n}\n`;
  },
});

/**
 * Format: typescript/declarations (DTCG-compatible)
 * TypeScript declarations with proper types
 * Supports both DTCG ($value/$type) and legacy (value/type) formats
 */
StyleDictionary.registerFormat({
  name: 'typescript/declarations',
  format: ({ dictionary }) => {
    const buildTokenInterface = (obj, indent = 0) => {
      const spaces = '  '.repeat(indent);
      let output = '{\n';

      for (const [key, value] of Object.entries(obj)) {
        if (!value) continue; // Skip undefined values

        // Quote keys that need it (contain hyphens or numbers)
        const quotedKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `"${key}"`;

        // Check for DTCG format ($value) or legacy format (value)
        const tokenValue = value.$value !== undefined ? value.$value : value.value;
        const tokenType = value.$type !== undefined ? value.$type : value.type;

        if (tokenValue !== undefined && tokenType !== undefined) {
          // Leaf token
          const type =
            tokenType === 'color'
              ? 'string'
              : tokenType === 'dimension'
                ? 'string'
                : tokenType === 'number'
                  ? 'number'
                  : 'string';
          output += `${spaces}  ${quotedKey}: ${type};\n`;
        } else {
          // Nested object
          output += `${spaces}  ${quotedKey}: ${buildTokenInterface(value, indent + 1)}\n`;
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
      // Style Dictionary v5+ normalizes DTCG format internally to value/type
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
  transforms: [
    'attribute/cti',
    'name/kebab',
    'time/seconds',
    'dimension/rem',
    'fontWeight/unitless',
    'color/css',
  ],
});

StyleDictionary.registerTransformGroup({
  name: 'custom/js',
  transforms: ['attribute/cti', 'name/camel', 'dimension/rem', 'fontWeight/unitless', 'color/css'],
});

/**
 * Custom SCSS Transform Group
 * Uses our custom dimension/rem and fontWeight/unitless transforms
 * This follows Style Dictionary v5 best practices:
 * - Source tokens are raw numbers
 * - Transforms add appropriate units
 */
StyleDictionary.registerTransformGroup({
  name: 'custom/scss',
  transforms: [
    'attribute/cti', // Add CTI attributes
    'name/kebab', // kebab-case names
    'time/seconds', // Convert time to seconds
    'fontWeight/unitless', // Font weights stay unitless (MUST run before dimension/rem)
    'dimension/rem', // Convert dimensions to rem
    'color/css', // Convert colors to CSS format
  ],
});

// ============================================================================
// CONFIGURATION
// ============================================================================

export default {
  // Logging
  log: {
    verbosity: 'default',
    warnings: 'warn',
    errors: 'error',
  },

  // Preprocessing to fix reference paths
  preprocessors: ['fix-references'],

  // Source token files - include all token categories
  source: [
    'collections/color/primitive.json',
    'collections/color/neutral.json',
    'collections/color/background.json',
    'collections/color/opacity.json',
    'collections/color/semantic.json',
    'collections/color/component.json',
    'collections/typography/base.json',
    'collections/spacing/base.json',
    'collections/border/color.json',
    'collections/border/radius.json',
    'collections/border/width.json',
    'collections/shadow/base.json',
    'collections/layout/breakpoints.json',
    'collections/layout/containers.json',
    'collections/layout/grid.json',
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

    // SCSS Variables with custom transforms
    // Uses custom/scss transform group with dimension/rem and fontWeight/unitless
    scss: {
      transformGroup: 'custom/scss',
      buildPath: 'dist/scss/',
      files: [
        {
          destination: '_variables.scss',
          format: 'scss/variables',
          options: {
            outputReferences: true,
            basePxFontSize: 16, // Base for rem conversion
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
