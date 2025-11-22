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
          if (obj[key].value !== undefined) {
            // This is a token
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
  }
});

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
  filter: (token) => {
    return token.type === 'dimension' && 
           typeof token.value === 'string' &&
           token.value.endsWith('px');
  },
  transform: (token) => {
    const val = parseFloat(token.value);
    if (val === 0) return '0';
    return `${val / 16}rem`;
  }
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
  }
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
      .map(token => {
        const comment = token.comment ? `  /* ${token.comment} */\n` : '';
        const description = token.description ? `  /* ${token.description} */\n` : '';
        const value = typeof token.value === 'string' ? token.value : JSON.stringify(token.value);
        return `${comment}${description}  ${prefix}${token.name}: ${value};`;
      })
      .join('\n')}\n}\n`;
  }
});

/**
 * Format: typescript/declarations
 * TypeScript declarations with proper types
 */
StyleDictionary.registerFormat({
  name: 'typescript/declarations',
  format: ({ dictionary }) => {
    const buildTokenInterface = (obj, indent = 0) => {
      const spaces = '  '.repeat(indent);
      let output = '{\n';
      
      for (const [key, value] of Object.entries(obj)) {
        // Quote keys that need it (contain hyphens or numbers)
        const quotedKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `"${key}"`;
        
        if (value.value !== undefined) {
          // Leaf token
          const type = value.type === 'color' ? 'string' : 
                      value.type === 'dimension' ? 'string' :
                      value.type === 'number' ? 'number' : 'string';
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
    dictionary.allTokens.forEach(token => {
      let current = tokenTree;
      token.path.slice(0, -1).forEach(key => {
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
  }
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
    'size/pxToRem',
    'color/css'
  ]
});

StyleDictionary.registerTransformGroup({
  name: 'custom/js',
  transforms: [
    'attribute/cti',
    'name/camel',
    'size/pxToRem',
    'color/css'
  ]
});

// ============================================================================
// CONFIGURATION
// ============================================================================

export default {
  // Logging
  log: {
    verbosity: 'default',
    warnings: 'warn',
    errors: 'error'
  },
  
  // Preprocessing to fix reference paths
  preprocessors: ['fix-references'],
  
  // Source token files - include all token categories
  source: [
    'color/primitive.json',
    'color/neutral.json',
    'color/background.json',
    'color/opacity.json',
    'color/semantic.json',
    'color/component.json',
    'typography/base.json',
    'spacing/base.json',
    'border/color.json',
    'border/radius.json',
    'border/width.json',
    'shadow/base.json',
    'layout/breakpoints.json',
    'layout/containers.json',
    'layout/grid.json'
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
            outputReferences: true
          }
        }
      ]
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
            outputReferences: true
          }
        },
        {
          destination: 'tokens.cjs',
          format: 'javascript/module',
          options: {
            outputReferences: true
          }
        }
      ]
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
            outputReferences: true
          }
        },
        {
          destination: 'tokens.d.ts',
          format: 'typescript/declarations'
        }
      ]
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
            outputReferences: true
          }
        }
      ]
    },
    
    // JSON (flattened for documentation)
    json: {
      transformGroup: 'js',
      buildPath: 'dist/json/',
      files: [
        {
          destination: 'tokens.json',
          format: 'json/flat'
        },
        {
          destination: 'tokens-nested.json',
          format: 'json/nested'
        }
      ]
    }
  }
};
