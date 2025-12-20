#!/usr/bin/env node

/**
 * Transform Figma Token Exports to Style Dictionary Format
 *
 * This script converts tokens exported from Figma (via Tokens Studio plugin)
 * into Style Dictionary compatible format.
 *
 * Input: packages/@dsai/tokens/figma-exports/*.json (Figma format)
 * Output: packages/@dsai/tokens/**\/*.json (Style Dictionary format)
 *
 * Usage: pnpm tokens:transform
 *
 * @see TASK-011-design-json-token-structure.md for transformation rules
 * @see packages/@dsai/tokens/README.md for workflow instructions
 */

const fs = require('node:fs');
const path = require('node:path');

// Paths
const FIGMA_EXPORTS = path.join(__dirname, '../../../packages/@dsai/tokens/figma-exports');
const OUTPUT_DIR = path.join(__dirname, '../../../packages/@dsai/tokens');

// Transformation configuration
const COLLECTIONS = {
  foundation: {
    input: 'foundation.json',
    outputs: [
      { file: 'collections/color/primitive.json', extractor: extractBrandColors },
      { file: 'collections/color/neutral.json', extractor: extractNeutralColors },
      { file: 'collections/color/background.json', extractor: extractBackgroundColors },
      { file: 'collections/color/opacity.json', extractor: extractOpacityColors },
      { file: 'collections/color/semantic.json', extractor: extractThemeColors },
      { file: 'collections/color/component.json', extractor: extractSemanticColors },
      { file: 'collections/border/color.json', extractor: extractBorderColors },
      { file: 'collections/border/width.json', extractor: extractBorderWidths },
    ],
  },
  typography: {
    input: 'typography.json',
    outputs: [{ file: 'collections/typography/base.json', extractor: extractTypography }],
  },
  spacing: {
    input: 'spacing.json',
    outputs: [{ file: 'collections/spacing/base.json', extractor: extractSpacing }],
  },
  radius: {
    input: 'radius.json',
    outputs: [{ file: 'collections/border/radius.json', extractor: extractRadius }],
  },
  layout: {
    input: 'layout.json',
    outputs: [
      { file: 'collections/layout/breakpoints.json', extractor: extractBreakpoints },
      { file: 'collections/layout/containers.json', extractor: extractContainers },
      { file: 'collections/layout/grid.json', extractor: extractGrid },
    ],
  },
  shadows: {
    input: 'shadows.json',
    outputs: [{ file: 'collections/shadow/base.json', extractor: extractShadows }],
  },
};

/**
 * Transform a single token from Figma format to DTCG-compliant format
 *
 * DTCG (Design Tokens Community Group) W3C Standard Format:
 * - Uses $ prefix for all special properties ($value, $type, $description, $extensions)
 * - Preserves all metadata from Figma exports
 * - Maintains interoperability with DTCG-compliant tools
 *
 * @see https://www.designtokens.org/
 */
function transformToken(figmaToken, options = {}) {
  if (!figmaToken || typeof figmaToken !== 'object') {
    return null;
  }

  // Skip if this is not a leaf token (no $value property)
  if (!Object.hasOwn(figmaToken, '$value')) {
    return null;
  }

  // Pass scopes to transformValue for type-specific handling
  const transformOptions = {
    ...options,
    scopes: figmaToken.$scopes || [],
  };

  // DTCG Format: Keep $ prefix for all properties
  const token = {
    $value: transformValue(figmaToken.$value, figmaToken.$type, transformOptions),
    $type: transformType(figmaToken.$type),
  };

  // Add description if present (DTCG property)
  if (figmaToken.$description) {
    token.$description = figmaToken.$description;
  }

  // Preserve extensions (DTCG property) - keeps all metadata
  if (figmaToken.$extensions) {
    token.$extensions = figmaToken.$extensions;
  }

  // Preserve $scopes (used by Style Dictionary transforms)
  if (figmaToken.$scopes) {
    token.$scopes = figmaToken.$scopes;
  }

  // Preserve $codeSyntax for platform-specific code references
  if (figmaToken.$codeSyntax) {
    token.$codeSyntax = figmaToken.$codeSyntax;
  }

  // Also add comment for backward compatibility with Style Dictionary v3
  if (figmaToken.$extensions?.platform?.scssVariableName) {
    token.comment = figmaToken.$extensions.platform.scssVariableName;
  }

  return token;
}

/**
 * Transform value based on type
 */
function transformValue(value, type, options = {}) {
  // Handle font family special case - prepend font name to font stack
  if (type === 'string' && options.fontStack) {
    // Prepend the actual font name (from Figma) to the fallback stack
    // e.g., "Inter" + system font stack = "Inter, system-ui, -apple-system, ..."
    const fontName = value; // Original font name from Figma
    const stack = options.fontStack;

    // Check if font name is already in the stack (avoid duplicates)
    if (stack.toLowerCase().includes(fontName.toLowerCase())) {
      return stack;
    }

    // Prepend font name to stack
    return `${fontName}, ${stack}`;
  }

  // Handle line-height: keep as unitless number (CSS best practice)
  // Line-heights should remain unitless for proper inheritance
  // @see https://developer.mozilla.org/en-US/docs/Web/CSS/line-height
  if (typeof value === 'number' && shouldKeepUnitless(type, options.scopes, options.tokenPath)) {
    // If it's a percentage string like "150%", convert to decimal
    if (typeof value === 'string' && value.endsWith('%')) {
      return parseFloat(value) / 100;
    }
    // Return the number as-is (unitless)
    return value;
  }

  // Handle numbers that should be dimensions
  if (typeof value === 'number' && shouldAddUnit(type, options.scopes, options.tokenPath)) {
    // Special case for circle radius (percentage)
    if (options.isCircle) {
      return '50%';
    }
    // Special case for pill radius
    if (options.isPill) {
      return '9999px';
    }
    return `${value}px`;
  }

  // Return value as-is for colors, strings, etc.
  return value;
}

/**
 * Transform type from Figma to DTCG standard
 *
 * DTCG types: color, dimension, fontFamily, fontWeight, duration, cubicBezier, number, string
 * @see https://www.designtokens.org/format/types/
 */
function transformType(figmaType) {
  const typeMap = {
    number: 'dimension',
    string: 'fontFamily', // May need context-specific mapping
    color: 'color',
  };

  return typeMap[figmaType] || figmaType;
}

/**
 * Check if a type should have units added
 */
/**
 * Check if a token should remain unitless
 * Font-weights, line-heights, and grid configuration values should be unitless numbers in CSS
 */
function shouldKeepUnitless(_type, scopes = [], tokenPath = '') {
  // Font weights must be unitless (300, 400, 700, etc.)
  if (scopes.includes('FONT_WEIGHT')) {
    return true;
  }

  // Line heights should be unitless for proper inheritance (1, 1.5, 2, etc.)
  if (scopes.includes('LINE_HEIGHT')) {
    return true;
  }

  // Grid configuration values should be unitless (12 columns, 6 row-columns, etc.)
  // These are COUNT values, not dimensions
  const pathLower = tokenPath.toLowerCase();
  if (pathLower.includes('columns') || pathLower.includes('row-columns')) {
    return true;
  }

  return false;
}

/**
 * Check if px units should be added to a number value
 * Excludes font-weights, line-heights, and grid configuration which should remain unitless
 */
function shouldAddUnit(type, scopes = [], tokenPath = '') {
  // Don't add units to font-weights, line-heights, or grid configuration
  if (shouldKeepUnitless(type, scopes, tokenPath)) {
    return false;
  }

  return type === 'number';
}

/**
 * Recursively transform nested token objects
 */
function transformTokenTree(obj, parentKey = '', options = {}) {
  const result = {};

  for (const [key, value] of Object.entries(obj)) {
    // Build the full path for this token (e.g., "grid.columns")
    const currentPath = parentKey ? `${parentKey}.${key}` : key;

    // Try to transform as a token
    const tokenOptions = {
      ...(options[key] || {}),
      tokenPath: currentPath,
    };
    const transformed = transformToken(value, tokenOptions);

    if (transformed) {
      result[key] = transformed;
    } else if (typeof value === 'object' && value !== null) {
      // Recursively process nested objects
      const nested = transformTokenTree(value, currentPath, options[key] || {});
      if (Object.keys(nested).length > 0) {
        result[key] = nested;
      }
    }
  }

  return result;
}

/**
 * Extract brand colors from foundation collection
 */
function extractBrandColors(data) {
  const lightMode = data.Foundation?.modes?.Light?.colors?.brand;

  if (!lightMode) {
    console.warn('No brand colors found in Light mode');
    return {};
  }

  return {
    color: transformTokenTree(lightMode),
  };
}

/**
 * Extract theme colors from foundation collection
 */
function extractThemeColors(data) {
  const lightMode = data.Foundation?.modes?.Light?.colors?.theme;

  if (!lightMode) {
    console.warn('No theme colors found in Light mode');
    return {};
  }

  return {
    theme: transformTokenTree(lightMode),
  };
}

/**
 * Extract semantic/component colors from foundation collection
 * These are the extended tokens like primary-bg-subtle, warning-text-emphasis, etc.
 */
function extractSemanticColors(data) {
  const semantic = data.Foundation?.modes?.Light?.semantic;

  if (!semantic) {
    console.warn('No semantic colors found in Light mode');
    return {};
  }

  return {
    semantic: transformTokenTree(semantic),
  };
}

/**
 * Extract neutral colors (black, white, grays)
 */
function extractNeutralColors(data) {
  const neutral = data.Foundation?.modes?.Light?.colors?.neutral;

  if (!neutral) {
    console.warn('No neutral colors found in Light mode');
    return {};
  }

  return {
    neutral: transformTokenTree(neutral),
  };
}

/**
 * Extract background colors
 */
function extractBackgroundColors(data) {
  const background = data.Foundation?.modes?.Light?.colors?.background;

  if (!background) {
    console.warn('No background colors found in Light mode');
    return {};
  }

  return {
    background: transformTokenTree(background),
  };
}

/**
 * Extract opacity scale
 */
function extractOpacityColors(data) {
  const opacity = data.Foundation?.modes?.Light?.colors?.opacity;

  if (!opacity) {
    console.warn('No opacity tokens found in Light mode');
    return {};
  }

  return {
    opacity: transformTokenTree(opacity),
  };
}

/**
 * Extract border colors
 */
function extractBorderColors(data) {
  const borderColor = data.Foundation?.modes?.Light?.borders?.color;

  if (!borderColor) {
    console.warn('No border color tokens found in Light mode');
    return {};
  }

  return {
    border: {
      color: transformTokenTree(borderColor),
    },
  };
}

/**
 * Extract border widths from Figma
 */
function extractBorderWidths(data) {
  const borderWidth = data.Foundation?.modes?.Light?.borders?.width;

  if (!borderWidth) {
    console.warn('No border width tokens found in Light mode');
    return {};
  }

  return {
    border: {
      width: transformTokenTree(borderWidth),
    },
  };
}

/**
 * Extract typography tokens
 */
function extractTypography(data) {
  const base = data.Typography?.modes?.Base;

  if (!base) {
    console.warn('No typography tokens found');
    return {};
  }

  // Special handling for font families - use font stacks from extensions
  const options = {};
  if (base.fontFamily) {
    Object.keys(base.fontFamily).forEach((key) => {
      const fontToken = base.fontFamily[key];
      if (fontToken.$extensions?.platform?.fontStack) {
        options[key] = { fontStack: fontToken.$extensions.platform.fontStack };
      }
    });
  }

  return {
    typography: transformTokenTree(base, '', { fontFamily: options }),
  };
}

/**
 * Extract spacing tokens
 */
function extractSpacing(data) {
  const base = data.Spacing?.modes?.Base?.spacing;

  if (!base) {
    console.warn('No spacing tokens found');
    return {};
  }

  return {
    spacing: transformTokenTree(base),
  };
}

/**
 * Extract border radius tokens
 */
function extractRadius(data) {
  const base = data.Radius?.modes?.Base?.radius;

  if (!base) {
    console.warn('No radius tokens found');
    return {};
  }

  // Special handling for circle and pill
  const options = {
    circle: { isCircle: true },
    pill: { isPill: true },
  };

  return {
    border: {
      radius: transformTokenTree(base, '', options),
    },
  };
}

/**
 * Extract breakpoint tokens
 */
function extractBreakpoints(data) {
  const breakpoints = data.Layout?.modes?.Base?.breakpoints;

  if (!breakpoints) {
    console.warn('No breakpoint tokens found');
    return {};
  }

  return {
    layout: {
      breakpoints: transformTokenTree(breakpoints),
    },
  };
}

/**
 * Extract container tokens
 */
function extractContainers(data) {
  const container = data.Layout?.modes?.Base?.container;

  if (!container) {
    console.warn('No container tokens found');
    return {};
  }

  return {
    layout: {
      container: transformTokenTree(container),
    },
  };
}

/**
 * Extract grid tokens
 */
function extractGrid(data) {
  const grid = data.Layout?.modes?.Base?.grid;
  const gutters = data.Layout?.modes?.Base?.gutters;

  if (!grid) {
    console.warn('No grid tokens found');
    return {};
  }

  const result = {
    layout: {
      grid: transformTokenTree(grid),
    },
  };

  if (gutters) {
    result.layout.gutters = transformTokenTree(gutters);
  }

  return result;
}

/**
 * Extract shadow tokens (use composite values)
 */
function extractShadows(data) {
  const shadows = data.Shadows?.modes?.Base?.shadows;

  if (!shadows) {
    console.warn('No shadow tokens found');
    return {};
  }

  // Extract composite values for shadows
  const result = { shadow: {} };

  for (const [key, value] of Object.entries(shadows)) {
    if (value.composite) {
      const token = {
        $value: value.composite.$value,
        $type: 'shadow',
      };

      // Add description if present
      if (value.composite.$description) {
        token.$description = value.composite.$description;
      }

      // Preserve $extensions
      if (value.composite.$extensions) {
        token.$extensions = value.composite.$extensions;
      }

      // Preserve $codeSyntax for platform-specific code references
      if (value.composite.$codeSyntax) {
        token.$codeSyntax = value.composite.$codeSyntax;
      }

      // Add comment for backward compatibility
      if (value.composite.$extensions?.platform?.scssVariableName) {
        token.comment = value.composite.$extensions.platform.scssVariableName;
      }

      result.shadow[key] = token;
    }
  }

  return result;
}

/**
 * Ensure directory exists
 */
function ensureDir(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/**
 * Main transformation function
 */
function transformTokens() {
  console.log('🎨 Transforming Figma tokens to Style Dictionary format...\n');

  // Process each collection
  for (const [collectionName, config] of Object.entries(COLLECTIONS)) {
    console.log(`Processing ${collectionName} collection...`);

    const inputPath = path.join(FIGMA_EXPORTS, config.input);

    // Check if input file exists
    if (!fs.existsSync(inputPath)) {
      console.warn(`⚠️  Input file not found: ${config.input}`);
      continue;
    }

    // Read input file
    const data = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

    // Process each output
    for (const output of config.outputs) {
      const outputPath = path.join(OUTPUT_DIR, output.file);

      try {
        // Extract and transform tokens
        const tokens = output.extractor(data);

        if (Object.keys(tokens).length === 0) {
          console.warn(`  ⚠️  No tokens extracted for ${output.file}`);
          continue;
        }

        // Ensure output directory exists
        ensureDir(outputPath);

        // Write output file
        fs.writeFileSync(outputPath, `${JSON.stringify(tokens, null, 2)}\n`, 'utf8');

        console.log(`  ✅ Created ${output.file}`);
      } catch (error) {
        console.error(`  ❌ Error processing ${output.file}:`, error.message);
      }
    }
  }

  console.log('\n✨ Transformation complete!');
  console.log(`\n📁 Output directory: ${OUTPUT_DIR}`);
}

// Run transformation
if (require.main === module) {
  transformTokens();
}

module.exports = {
  transformTokens,
  transformToken,
  transformValue,
  transformType,
};
