# Task: Style Dictionary Integration

**Task ID:** TASK-104
**Title:** Style Dictionary Transforms, Formats, and Preprocessors as Reusable Modules
**Priority:** High
**Status:** ✅ Complete
**Assigned To:** Unassigned
**Blocked by Task:** TASK-101, TASK-102, TASK-103
**Created:** 2024-12-23
**Updated:** 2025-01-20

---

## 📋 Task Description

### Goal

Extract all custom Style Dictionary transforms, formats, and preprocessors from the monolithic `sd.config.mjs` file into reusable, configurable modules. These modules should be easily extensible by enterprise teams and support the configuration system from TASK-102.

### Problem/Issue

Current Style Dictionary configuration issues:

1. **Monolithic Config**: All transforms, formats in single 600+ line file
2. **Hardcoded Values**: Prefix `--dsai-`, paths, selectors hardcoded
3. **Not Reusable**: Can't import individual transforms
4. **Not Extensible**: Can't add custom transforms via config
5. **No Tests**: Transforms not unit tested
6. **No Types**: No TypeScript types for SD integration

### Expected Outcome

A modular Style Dictionary integration that:

1. Exports all transforms, formats, preprocessors individually
2. Generates SD config dynamically from DSAi config
3. Supports custom transforms via config hooks
4. Is fully typed with TypeScript
5. Has comprehensive unit tests
6. Works standalone or with full @dsai/tools

---

## 🎯 Acceptance Criteria

### Module Structure

- [x] All transforms in separate files
- [x] All formats in separate files
- [x] All preprocessors in separate files
- [x] Transform groups exported
- [x] Config generator function

### Custom Transforms

- [x] `fontWeight/unitless` - Keep font weights unitless
- [x] `lineHeight/unitless` - Keep line heights unitless
- [x] `dimension/rem` - Convert px to rem
- [x] `name/kebab` - Kebab-case token names
- [x] All transforms properly typed

### Custom Formats

- [x] `css/variables-with-comments` - CSS vars with descriptions
- [x] `typescript/declarations` - TS type declarations
- [x] All formats properly typed

### Custom Preprocessors

- [x] `fix-references` - Fix token reference paths
- [x] Preprocessor properly typed

### Config Generation

- [x] `createStyleDictionaryConfig(dsaiConfig)` function
- [x] All paths from config
- [x] Prefix from config
- [x] Custom transforms merged
- [x] Custom formats merged
- [x] Custom preprocessors merged

### Extensibility

- [x] Enterprise can add custom transforms
- [x] Enterprise can add custom formats
- [x] Enterprise can override built-in transforms
- [x] Enterprise can disable built-in transforms

---

## 📂 Files to Create/Modify

### New Files

```
packages/@dsai/tools/src/tokens/style-dictionary/
├── index.ts                    # Main exports
├── types.ts                    # SD-specific types
├── config.ts                   # Config generator
├── transforms/
│   ├── index.ts               # Transform exports
│   ├── font-weight.ts         # fontWeight/unitless
│   ├── line-height.ts         # lineHeight/unitless
│   ├── dimension.ts           # dimension/rem
│   └── name.ts                # name/kebab
├── formats/
│   ├── index.ts               # Format exports
│   ├── css-variables.ts       # css/variables-with-comments
│   └── typescript.ts          # typescript/declarations
├── preprocessors/
│   ├── index.ts               # Preprocessor exports
│   └── fix-references.ts      # fix-references
└── groups/
    ├── index.ts               # Transform group exports
    ├── css.ts                 # custom/css group
    ├── js.ts                  # custom/js group
    └── scss.ts                # custom/scss group
```

---

## 🔗 Dependencies

### Prerequisites

- [ ] TASK-101: Package Scaffolding
- [ ] TASK-102: Configuration System (for config types)
- [ ] TASK-103: Token Scripts (for token types)

### Blocks

- TASK-105: CLI (uses SD config generation)
- TASK-107: Tokens Package Update (uses SD modules)

### Peer Dependencies

```json
{
  "peerDependencies": {
    "style-dictionary": "^5.0.0"
  }
}
```

---

## 🧪 Testing Requirements

### Unit Tests

- [ ] Each transform tested with various inputs
- [ ] Edge cases handled (null, undefined, empty)
- [ ] Type coercion tested
- [ ] DTCG and legacy format tested

### Integration Tests

- [ ] Config generation produces valid SD config
- [ ] Generated config builds successfully
- [ ] Output matches expected format
- [ ] Custom extensions work correctly

---

## 📖 Documentation Requirements

- [ ] JSDoc on all exports
- [ ] Usage examples for each transform
- [ ] Extension guide for custom transforms
- [ ] Migration guide from sd.config.mjs

---

## 🔄 Implementation Steps

### Step 1: Define Style Dictionary Types

**src/tokens/style-dictionary/types.ts:**

```typescript
/**
 * Style Dictionary type definitions
 *
 * @packageDocumentation
 */

import type StyleDictionary from 'style-dictionary';

// ============================================================================
// Token Types
// ============================================================================

/**
 * Style Dictionary token (runtime)
 */
export interface SDToken {
  /** Token name */
  name: string;

  /** Resolved value */
  value: unknown;

  /** Original value (may contain references) */
  original: {
    value: unknown;
    $value?: unknown;
  };

  /** Token path */
  path: string[];

  /** DTCG $value */
  $value?: unknown;

  /** Token type */
  type?: string;

  /** DTCG $type */
  $type?: string;

  /** Token description */
  description?: string;

  /** DTCG $description */
  $description?: string;

  /** Comment */
  comment?: string;

  /** DTCG extensions */
  $extensions?: Record<string, unknown>;

  /** DTCG scopes (from Figma) */
  $scopes?: string[];

  /** CTI attributes */
  attributes?: {
    category?: string;
    type?: string;
    item?: string;
    subitem?: string;
    state?: string;
  };
}

/**
 * Style Dictionary dictionary
 */
export interface SDDictionary {
  allTokens: SDToken[];
  tokens: Record<string, unknown>;
  unfilteredTokens: Record<string, unknown>;
}

/**
 * Style Dictionary platform config
 */
export interface SDPlatform {
  transformGroup?: string;
  transforms?: string[];
  buildPath?: string;
  files?: SDFile[];
  options?: Record<string, unknown>;
}

/**
 * Style Dictionary file config
 */
export interface SDFile {
  destination: string;
  format: string;
  filter?: string | ((token: SDToken) => boolean);
  options?: Record<string, unknown>;
}

// ============================================================================
// Transform Types
// ============================================================================

/**
 * Transform type
 */
export type TransformType = 'name' | 'value' | 'attribute';

/**
 * Transform options passed to transform function
 */
export interface TransformOptions {
  basePxFontSize?: number;
  prefix?: string;
  [key: string]: unknown;
}

/**
 * Transform definition
 */
export interface TransformDefinition {
  /** Unique transform name */
  name: string;

  /** Transform type */
  type: TransformType;

  /**
   * Filter function - return true to apply transform
   * If omitted, transform applies to all tokens
   */
  filter?: (token: SDToken) => boolean;

  /**
   * Transform function
   * Returns transformed value (for value transforms) or modified token
   */
  transform: (token: SDToken, options?: TransformOptions) => unknown;
}

/**
 * Transform group definition
 */
export interface TransformGroupDefinition {
  /** Unique group name */
  name: string;

  /** Ordered list of transform names */
  transforms: string[];
}

// ============================================================================
// Format Types
// ============================================================================

/**
 * Format function arguments
 */
export interface FormatArgs {
  dictionary: SDDictionary;
  options: Record<string, unknown>;
  platform: SDPlatform;
  file: SDFile;
}

/**
 * Format definition
 */
export interface FormatDefinition {
  /** Unique format name */
  name: string;

  /** Format function - returns file content as string */
  format: (args: FormatArgs) => string;
}

// ============================================================================
// Preprocessor Types
// ============================================================================

/**
 * Preprocessor definition
 */
export interface PreprocessorDefinition {
  /** Unique preprocessor name */
  name: string;

  /**
   * Preprocessor function
   * Modifies dictionary before processing
   */
  preprocessor: (dictionary: Record<string, unknown>) => Record<string, unknown>;
}

// ============================================================================
// Config Types
// ============================================================================

/**
 * Full Style Dictionary configuration
 */
export interface SDConfig {
  log?: {
    verbosity?: 'default' | 'silent' | 'verbose';
    warnings?: 'warn' | 'error' | 'disabled';
    errors?: 'error' | 'throw';
  };

  preprocessors?: string[];

  source?: string[];

  include?: string[];

  platforms?: Record<string, SDPlatform>;
}

/**
 * Options for creating SD config
 */
export interface CreateSDConfigOptions {
  /** Token source files (glob patterns) */
  source?: string[];

  /** CSS variable prefix */
  prefix?: string;

  /** Output directory base path */
  buildPath?: string;

  /** Base font size for rem conversion */
  baseFontSize?: number;

  /** Output references in generated files */
  outputReferences?: boolean;

  /** Additional transforms to register */
  customTransforms?: TransformDefinition[];

  /** Additional formats to register */
  customFormats?: FormatDefinition[];

  /** Additional preprocessors to register */
  customPreprocessors?: PreprocessorDefinition[];

  /** Platforms to include (default: all) */
  platforms?: ('css' | 'js' | 'ts' | 'scss' | 'scss-dist' | 'json')[];
}
```

### Step 2: Implement Transforms

**src/tokens/style-dictionary/transforms/font-weight.ts:**

```typescript
/**
 * Font weight transform
 *
 * Keeps font-weight values as unitless numbers (300, 400, 700, etc.)
 * CSS font-weight must be unitless.
 *
 * @packageDocumentation
 */

import type { TransformDefinition, SDToken } from '../types.js';

/**
 * Check if token is a font weight
 */
function isFontWeight(token: SDToken): boolean {
  const tokenType = token.$type || token.type;

  // Direct type match
  if (tokenType === 'fontWeight' || tokenType === 'number') {
    return true;
  }

  // Path-based detection
  const pathHasFontWeight = token.path?.some((part) => {
    const lower = String(part).toLowerCase();
    return lower === 'fontweight' || lower.includes('font-weight') || lower.includes('fontweight');
  });

  return pathHasFontWeight ?? false;
}

/**
 * fontWeight/unitless transform
 *
 * Ensures font-weight values are unitless numbers.
 *
 * @example
 * Input: { $value: "700", $type: "fontWeight" }
 * Output: 700
 */
export const fontWeightUnitless: TransformDefinition = {
  name: 'fontWeight/unitless',
  type: 'value',
  filter: isFontWeight,
  transform: (token) => {
    const value = token.$value ?? token.value;

    if (typeof value === 'number') {
      return value;
    }

    if (typeof value === 'string') {
      const parsed = parseInt(value, 10);
      if (!isNaN(parsed)) {
        return parsed;
      }

      // Handle named weights
      const namedWeights: Record<string, number> = {
        thin: 100,
        hairline: 100,
        extralight: 200,
        ultralight: 200,
        light: 300,
        normal: 400,
        regular: 400,
        medium: 500,
        semibold: 600,
        demibold: 600,
        bold: 700,
        extrabold: 800,
        ultrabold: 800,
        black: 900,
        heavy: 900,
      };

      const normalized = value.toLowerCase().replace(/[^a-z]/g, '');
      if (normalized in namedWeights) {
        return namedWeights[normalized];
      }
    }

    // Fallback
    return value;
  },
};
```

**src/tokens/style-dictionary/transforms/line-height.ts:**

```typescript
/**
 * Line height transform
 *
 * Keeps line-height values as unitless ratios (1, 1.5, 2, etc.)
 * CSS line-height should be unitless for proper inheritance.
 *
 * @packageDocumentation
 */

import type { TransformDefinition, SDToken } from '../types.js';

/**
 * Check if token is a line height
 */
function isLineHeight(token: SDToken): boolean {
  const tokenType = token.$type || token.type;

  // Direct type match
  if (tokenType === 'lineHeight') {
    return true;
  }

  // Path-based detection
  const pathHasLineHeight = token.path?.some((part) => {
    const lower = String(part).toLowerCase();
    return lower === 'lineheight' || lower.includes('line-height') || lower.includes('lineheight');
  });

  // Scope-based detection (from Figma)
  const scopeHasLineHeight = token.$scopes?.includes('LINE_HEIGHT');

  return pathHasLineHeight ?? scopeHasLineHeight ?? false;
}

/**
 * lineHeight/unitless transform
 *
 * Converts line-height values to unitless ratios.
 *
 * @example
 * Input: { $value: "150%", $type: "lineHeight" }
 * Output: 1.5
 *
 * @example
 * Input: { $value: 24, $type: "lineHeight" }
 * Output: 1.5 (assuming 16px base, 24/16 = 1.5)
 */
export const lineHeightUnitless: TransformDefinition = {
  name: 'lineHeight/unitless',
  type: 'value',
  filter: isLineHeight,
  transform: (token) => {
    const value = token.$value ?? token.value;

    // Already a clean number
    if (typeof value === 'number') {
      // If <= 3, already a multiplier (1, 1.5, 2)
      if (value <= 3) {
        return value;
      }
      // If > 3, likely px from Figma - convert to unitless
      return value / 16;
    }

    // Handle percentage strings
    if (typeof value === 'string' && value.endsWith('%')) {
      return parseFloat(value) / 100;
    }

    // Handle strings with units
    if (typeof value === 'string') {
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        if (numValue <= 3) {
          return numValue;
        }
        return numValue / 16;
      }
    }

    return value;
  },
};
```

**src/tokens/style-dictionary/transforms/dimension.ts:**

```typescript
/**
 * Dimension transform
 *
 * Converts dimension values to rem units.
 *
 * @packageDocumentation
 */

import type { TransformDefinition, SDToken, TransformOptions } from '../types.js';

/**
 * Check if token is a dimension (but not font-weight or line-height)
 */
function isDimension(token: SDToken): boolean {
  const tokenType = token.$type || token.type;

  // Exclude font-weights
  if (tokenType === 'fontWeight') return false;
  const pathHasFontWeight = token.path?.some((part) => {
    const lower = String(part).toLowerCase();
    return lower.includes('fontweight') || lower.includes('font-weight');
  });
  if (pathHasFontWeight) return false;

  // Exclude line-heights
  if (tokenType === 'lineHeight') return false;
  const pathHasLineHeight = token.path?.some((part) => {
    const lower = String(part).toLowerCase();
    return lower.includes('lineheight') || lower.includes('line-height');
  });
  if (pathHasLineHeight) return false;
  const scopeHasLineHeight = token.$scopes?.includes('LINE_HEIGHT');
  if (scopeHasLineHeight) return false;

  // Exclude grid config (unitless counts)
  const pathHasGridConfig = token.path?.some((part) => {
    const lower = String(part).toLowerCase();
    return lower === 'columns' || lower === 'row-columns';
  });
  if (pathHasGridConfig) return false;

  // Include dimension, spacing, sizing
  return tokenType === 'dimension' || tokenType === 'spacing' || tokenType === 'sizing';
}

/**
 * dimension/rem transform
 *
 * Converts dimension values to rem.
 *
 * @example
 * Input: { $value: 16, $type: "dimension" }
 * Output: "1rem"
 *
 * @example
 * Input: { $value: "24px", $type: "dimension" }
 * Output: "1.5rem"
 */
export const dimensionRem: TransformDefinition = {
  name: 'dimension/rem',
  type: 'value',
  filter: isDimension,
  transform: (token, options?: TransformOptions) => {
    const value = token.$value ?? token.value;
    const baseFontSize = options?.basePxFontSize ?? 16;

    // Handle raw numbers
    if (typeof value === 'number') {
      if (value === 0) return '0';
      return `${value / baseFontSize}rem`;
    }

    // Handle px strings
    if (typeof value === 'string' && value.endsWith('px')) {
      const numValue = parseFloat(value);
      if (numValue === 0) return '0';
      return `${numValue / baseFontSize}rem`;
    }

    // Return as-is if not convertible
    return value;
  },
};
```

**src/tokens/style-dictionary/transforms/name.ts:**

```typescript
/**
 * Name transform
 *
 * Converts token paths to kebab-case names.
 *
 * @packageDocumentation
 */

import type { TransformDefinition } from '../types.js';

/**
 * name/kebab transform
 *
 * Converts token path to kebab-case CSS variable name.
 *
 * @example
 * Input: path = ['color', 'blue', '500']
 * Output: "color-blue-500"
 */
export const nameKebab: TransformDefinition = {
  name: 'name/kebab',
  type: 'name',
  transform: (token) => {
    return token.path.join('-').replace(/_/g, '-').toLowerCase();
  },
};
```

**src/tokens/style-dictionary/transforms/index.ts:**

```typescript
/**
 * Style Dictionary transforms
 *
 * @packageDocumentation
 */

import type StyleDictionary from 'style-dictionary';
import type { TransformDefinition } from '../types.js';
import { fontWeightUnitless } from './font-weight.js';
import { lineHeightUnitless } from './line-height.js';
import { dimensionRem } from './dimension.js';
import { nameKebab } from './name.js';

/**
 * All built-in transforms
 */
export const builtInTransforms: TransformDefinition[] = [
  fontWeightUnitless,
  lineHeightUnitless,
  dimensionRem,
  nameKebab,
];

/**
 * Register all transforms with Style Dictionary
 */
export function registerTransforms(
  sd: typeof StyleDictionary,
  customTransforms: TransformDefinition[] = []
): void {
  const allTransforms = [...builtInTransforms, ...customTransforms];

  for (const transform of allTransforms) {
    sd.registerTransform({
      name: transform.name,
      type: transform.type,
      filter: transform.filter,
      transform: transform.transform as any,
    });
  }
}

// Re-export individual transforms
export { fontWeightUnitless } from './font-weight.js';
export { lineHeightUnitless } from './line-height.js';
export { dimensionRem } from './dimension.js';
export { nameKebab } from './name.js';
```

### Step 3: Implement Formats

**src/tokens/style-dictionary/formats/css-variables.ts:**

```typescript
/**
 * CSS Variables format
 *
 * @packageDocumentation
 */

import type { FormatDefinition, FormatArgs } from '../types.js';

/**
 * css/variables-with-comments format
 *
 * Generates CSS custom properties with descriptive comments.
 */
export const cssVariablesWithComments: FormatDefinition = {
  name: 'css/variables-with-comments',
  format: ({ dictionary, options }: FormatArgs): string => {
    const prefix = (options.prefix as string) ?? '--';

    const variables = dictionary.allTokens.map((token) => {
      const lines: string[] = [];

      // Add comment if present
      if (token.comment) {
        lines.push(`  /* ${token.comment} */`);
      }

      // Add description if present
      if (token.description || token.$description) {
        lines.push(`  /* ${token.description ?? token.$description} */`);
      }

      // Get value
      const tokenValue = token.$value !== undefined ? token.$value : token.value;
      const value = typeof tokenValue === 'string' ? tokenValue : JSON.stringify(tokenValue);

      // Add variable
      lines.push(`  ${prefix}${token.name}: ${value};`);

      return lines.join('\n');
    });

    return `:root {\n${variables.join('\n')}\n}\n`;
  },
};
```

**src/tokens/style-dictionary/formats/typescript.ts:**

```typescript
/**
 * TypeScript declarations format
 *
 * @packageDocumentation
 */

import type { FormatDefinition, FormatArgs, SDToken } from '../types.js';

/**
 * Get TypeScript type from token value
 */
function getTypeScriptType(token: SDToken): string {
  const value = token.value;
  if (typeof value === 'number') return 'number';
  if (typeof value === 'boolean') return 'boolean';
  return 'string';
}

/**
 * Build nested interface structure
 */
function buildTokenInterface(obj: Record<string, unknown>, indent = 0): string {
  const spaces = '  '.repeat(indent);
  let output = '{\n';

  for (const [key, value] of Object.entries(obj)) {
    if (!value) continue;

    // Quote keys that need it
    const quotedKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `"${key}"`;

    const typedValue = value as Record<string, unknown>;

    if (typedValue._isToken) {
      output += `${spaces}  ${quotedKey}: ${typedValue._type};\n`;
    } else {
      output += `${spaces}  ${quotedKey}: ${buildTokenInterface(typedValue, indent + 1)}\n`;
    }
  }

  output += `${spaces}}`;
  return output;
}

/**
 * typescript/declarations format
 *
 * Generates TypeScript declarations with interfaces and types.
 */
export const typescriptDeclarations: FormatDefinition = {
  name: 'typescript/declarations',
  format: ({ dictionary }: FormatArgs): string => {
    // Build nested structure with type markers
    const tokenTree: Record<string, unknown> = {};

    for (const token of dictionary.allTokens) {
      let current = tokenTree;
      for (let i = 0; i < token.path.length - 1; i++) {
        const key = token.path[i];
        if (!current[key]) current[key] = {};
        current = current[key] as Record<string, unknown>;
      }

      const lastKey = token.path[token.path.length - 1];
      current[lastKey] = {
        _isToken: true,
        _type: getTypeScriptType(token),
      };
    }

    // Group by category for literal types
    const categories: Record<string, string[]> = {};
    for (const token of dictionary.allTokens) {
      const category = token.path[0];
      if (!categories[category]) categories[category] = [];
      categories[category].push(token.path.join('.'));
    }

    // Generate category types
    const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
    let literalTypes = '';

    for (const category of Object.keys(categories).sort()) {
      const typeName = `${capitalize(category)}TokenName`;
      literalTypes += `export type ${typeName} =\n`;
      literalTypes += categories[category].map((t) => `  | '${t}'`).join('\n');
      literalTypes += ';\n\n';
    }

    // Generate all token names type
    const allTokenNames = dictionary.allTokens.map((t) => t.path.join('.'));
    literalTypes += `export type TokenName =\n`;
    literalTypes += allTokenNames.map((t) => `  | '${t}'`).join('\n');
    literalTypes += ';\n\n';

    // Generate flat exports
    let flatExports = '';
    for (const token of dictionary.allTokens) {
      const type = getTypeScriptType(token);
      flatExports += `export declare const ${token.name}: ${type};\n`;
    }

    return `/**
 * Design Tokens - TypeScript Declarations
 * Auto-generated by @dsai/tools
 * DO NOT EDIT DIRECTLY
 */

${literalTypes}

export interface DesignTokens ${buildTokenInterface(tokenTree)}

${flatExports}

export declare const tokens: DesignTokens;
export default tokens;
`;
  },
};
```

### Step 4: Implement Preprocessors

**src/tokens/style-dictionary/preprocessors/fix-references.ts:**

```typescript
/**
 * Fix references preprocessor
 *
 * @packageDocumentation
 */

import type { PreprocessorDefinition } from '../types.js';

/**
 * Fix token reference paths
 *
 * Figma exports may have mismatched reference paths that need correction.
 * This preprocessor fixes common reference path issues.
 */
export const fixReferences: PreprocessorDefinition = {
  name: 'fix-references',
  preprocessor: (dictionary) => {
    const fixValue = (value: unknown): unknown => {
      if (typeof value === 'string' && value.startsWith('{')) {
        return value
          .replace(/\{colors\.brand\./g, '{color.')
          .replace(/\{colors\.neutral\./g, '{neutral.')
          .replace(/\{borders\.width\./g, '{border.width.');
      }
      return value;
    };

    const processTokens = (obj: Record<string, unknown>): void => {
      for (const key in obj) {
        const value = obj[key];
        if (value && typeof value === 'object') {
          const typedValue = value as Record<string, unknown>;

          // DTCG format
          if ('$value' in typedValue) {
            typedValue.$value = fixValue(typedValue.$value);
          }
          // Legacy format
          else if ('value' in typedValue) {
            typedValue.value = fixValue(typedValue.value);
          }
          // Recurse
          else {
            processTokens(typedValue);
          }
        }
      }
    };

    processTokens(dictionary);
    return dictionary;
  },
};
```

### Step 5: Implement Config Generator

**src/tokens/style-dictionary/config.ts:**

````typescript
/**
 * Style Dictionary configuration generator
 *
 * @packageDocumentation
 */

import type StyleDictionary from 'style-dictionary';
import type { ResolvedConfig } from '../../config/types.js';
import type { SDConfig, CreateSDConfigOptions } from './types.js';
import { registerTransforms, builtInTransforms } from './transforms/index.js';
import { registerFormats } from './formats/index.js';
import { registerPreprocessors } from './preprocessors/index.js';
import { registerTransformGroups } from './groups/index.js';

/**
 * Create Style Dictionary configuration from DSAi config
 *
 * @param dsaiConfig - Resolved DSAi configuration
 * @param options - Additional options
 * @returns Style Dictionary configuration
 *
 * @example
 * ```typescript
 * import StyleDictionary from 'style-dictionary';
 * import { loadConfig } from '@dsai/tools/config';
 * import { createStyleDictionaryConfig, registerAll } from '@dsai/tools/tokens/style-dictionary';
 *
 * const { config } = await loadConfig();
 * const sdConfig = createStyleDictionaryConfig(config);
 *
 * registerAll(StyleDictionary);
 *
 * const sd = new StyleDictionary(sdConfig);
 * await sd.buildAllPlatforms();
 * ```
 */
export function createStyleDictionaryConfig(
  dsaiConfig: ResolvedConfig,
  options: Partial<CreateSDConfigOptions> = {}
): SDConfig {
  const {
    source = [
      'collections/color/*.json',
      'collections/typography/*.json',
      'collections/spacing/*.json',
      'collections/border/*.json',
      'collections/shadow/*.json',
      'collections/layout/*.json',
    ],
    prefix = dsaiConfig.tokens.prefix,
    buildPath = dsaiConfig.tokens.outputDir,
    baseFontSize = dsaiConfig.tokens.baseFontSize,
    outputReferences = dsaiConfig.tokens.outputReferences,
    platforms = ['css', 'js', 'ts', 'scss', 'scss-dist', 'json'],
  } = options;

  const config: SDConfig = {
    log: {
      verbosity: dsaiConfig.global.debug ? 'verbose' : 'default',
      warnings: 'warn',
      errors: 'error',
    },
    preprocessors: ['fix-references'],
    source,
    platforms: {},
  };

  // CSS Platform
  if (platforms.includes('css')) {
    config.platforms!.css = {
      transformGroup: 'custom/css',
      buildPath: `${buildPath}/css/`,
      files: [
        {
          destination: 'variables.css',
          format: 'css/variables-with-comments',
          options: {
            prefix,
            outputReferences,
          },
        },
      ],
    };
  }

  // JavaScript Platform
  if (platforms.includes('js')) {
    config.platforms!.js = {
      transformGroup: 'custom/js',
      buildPath: `${buildPath}/js/`,
      files: [
        {
          destination: 'tokens.js',
          format: 'javascript/es6',
          options: { outputReferences },
        },
        {
          destination: 'tokens.cjs',
          format: 'javascript/module',
          options: { outputReferences },
        },
      ],
    };
  }

  // TypeScript Platform
  if (platforms.includes('ts')) {
    config.platforms!.ts = {
      transformGroup: 'custom/js',
      buildPath: `${buildPath}/ts/`,
      files: [
        {
          destination: 'tokens.ts',
          format: 'javascript/es6',
          options: { outputReferences },
        },
        {
          destination: 'tokens.d.ts',
          format: 'typescript/declarations',
        },
      ],
    };
  }

  // SCSS Platform (source)
  if (platforms.includes('scss')) {
    config.platforms!.scss = {
      transformGroup: 'custom/scss',
      buildPath: 'src/scss/',
      files: [
        {
          destination: '_variables.scss',
          format: 'scss/variables',
          options: {
            outputReferences,
            basePxFontSize: baseFontSize,
          },
        },
      ],
    };
  }

  // SCSS Platform (dist)
  if (platforms.includes('scss-dist')) {
    config.platforms!['scss-dist'] = {
      transformGroup: 'custom/scss',
      buildPath: `${buildPath}/scss/`,
      files: [
        {
          destination: '_variables.scss',
          format: 'scss/variables',
          options: {
            outputReferences,
            basePxFontSize: baseFontSize,
          },
        },
      ],
    };
  }

  // JSON Platform
  if (platforms.includes('json')) {
    config.platforms!.json = {
      transformGroup: 'js',
      buildPath: `${buildPath}/json/`,
      files: [
        { destination: 'tokens.json', format: 'json/flat' },
        { destination: 'tokens-nested.json', format: 'json/nested' },
      ],
    };
  }

  return config;
}

/**
 * Register all custom transforms, formats, and preprocessors
 */
export function registerAll(
  sd: typeof StyleDictionary,
  options: Partial<CreateSDConfigOptions> = {}
): void {
  const { customTransforms = [], customFormats = [], customPreprocessors = [] } = options;

  registerTransforms(sd, customTransforms);
  registerFormats(sd, customFormats);
  registerPreprocessors(sd, customPreprocessors);
  registerTransformGroups(sd);
}
````

### Step 6: Update Main Exports

**src/tokens/style-dictionary/index.ts:**

```typescript
/**
 * Style Dictionary integration module
 *
 * @packageDocumentation
 */

// Types
export type {
  SDToken,
  SDDictionary,
  SDPlatform,
  SDFile,
  SDConfig,
  TransformType,
  TransformOptions,
  TransformDefinition,
  TransformGroupDefinition,
  FormatDefinition,
  FormatArgs,
  PreprocessorDefinition,
  CreateSDConfigOptions,
} from './types.js';

// Config generation
export { createStyleDictionaryConfig, registerAll } from './config.js';

// Transforms
export {
  builtInTransforms,
  registerTransforms,
  fontWeightUnitless,
  lineHeightUnitless,
  dimensionRem,
  nameKebab,
} from './transforms/index.js';

// Formats
export {
  builtInFormats,
  registerFormats,
  cssVariablesWithComments,
  typescriptDeclarations,
} from './formats/index.js';

// Preprocessors
export {
  builtInPreprocessors,
  registerPreprocessors,
  fixReferences,
} from './preprocessors/index.js';

// Transform groups
export { transformGroups, registerTransformGroups } from './groups/index.js';
```

---

## 📝 Notes

### Enterprise Extension Pattern

```typescript
// Enterprise dsai.config.mjs
import { defineConfig } from '@dsai/tools';

export default defineConfig({
  tokens: {
    prefix: '--acme-',
    transforms: [
      {
        name: 'custom/uppercase-name',
        type: 'name',
        transform: (token) => token.path.join('_').toUpperCase(),
      },
    ],
    customFormats: [
      {
        name: 'custom/swift',
        format: ({ dictionary }) => {
          return dictionary.allTokens.map((t) => `let ${t.name} = "${t.value}"`).join('\n');
        },
      },
    ],
  },
});
```

### Compatibility Notes

- Style Dictionary v5 uses ESM
- All transforms must be registered before building
- Order of transforms matters (fontWeight before dimension)

---

## ✅ Definition of Done

- [ ] All transforms extracted and working
- [ ] All formats extracted and working
- [ ] All preprocessors extracted and working
- [ ] Config generator produces valid SD config
- [ ] Custom extensions work
- [ ] All tests pass
- [ ] Documentation complete
