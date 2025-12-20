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
const TOKENS_DIR = path.join(__dirname, '../../../packages/@dsai/tokens');
const FIGMA_EXPORTS = path.join(TOKENS_DIR, 'figma-exports');
const OUTPUT_DIR = TOKENS_DIR;
const CONFIG_PATH = path.join(TOKENS_DIR, 'tokens.config.json');

/**
 * Load tokens configuration
 * @returns {Object} The tokens configuration
 */
function loadConfig() {
  if (!fs.existsSync(CONFIG_PATH)) {
    console.warn('⚠️  tokens.config.json not found, using default configuration');
    return {
      build: { source: 'theme' },
      themes: { autoDetect: true, default: 'Light', ignoreModes: [] },
      transform: { preserveCodeSyntax: true },
    };
  }
  return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
}

// Load configuration
const CONFIG = loadConfig();

/**
 * Auto-detect available modes from a Figma export file
 * @param {Object} data - The parsed Figma export data
 * @param {string} collectionPath - The collection path (e.g., 'Foundation')
 * @returns {string[]} Array of detected mode names
 */
function detectModes(data, collectionPath) {
  const collection = data[collectionPath];
  if (!collection || !collection.modes) {
    return ['Base'];
  }
  return Object.keys(collection.modes);
}

// Transformation configuration
// modeAware: true means the extractor accepts a mode parameter and should generate per-mode outputs
const COLLECTIONS = {
  foundation: {
    input: 'foundation.json',
    modeAware: true, // Has Light/Dark modes
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
    modeAware: false, // Only has Base mode
    outputs: [{ file: 'collections/typography/base.json', extractor: extractTypography }],
  },
  spacing: {
    input: 'spacing.json',
    modeAware: false, // Only has Base mode
    outputs: [{ file: 'collections/spacing/base.json', extractor: extractSpacing }],
  },
  radius: {
    input: 'radius.json',
    modeAware: false, // Only has Base mode
    outputs: [{ file: 'collections/border/radius.json', extractor: extractRadius }],
  },
  layout: {
    input: 'layout.json',
    modeAware: false, // Only has Base mode
    outputs: [
      { file: 'collections/layout/breakpoints.json', extractor: extractBreakpoints },
      { file: 'collections/layout/containers.json', extractor: extractContainers },
      { file: 'collections/layout/grid.json', extractor: extractGrid },
    ],
  },
  shadows: {
    input: 'shadows.json',
    modeAware: false, // Only has Base mode
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
 * @param {Object} data - The Figma export data
 * @param {string} mode - The mode to extract (e.g., 'Light', 'Dark')
 */
function extractBrandColors(data, mode = 'Light') {
  const modeData = data.Foundation?.modes?.[mode]?.colors?.brand;

  if (!modeData) {
    console.warn(`No brand colors found in ${mode} mode`);
    return {};
  }

  return {
    color: transformTokenTree(modeData),
  };
}

/**
 * Extract theme colors from foundation collection
 * @param {Object} data - The Figma export data
 * @param {string} mode - The mode to extract (e.g., 'Light', 'Dark')
 */
function extractThemeColors(data, mode = 'Light') {
  const modeData = data.Foundation?.modes?.[mode]?.colors?.theme;

  if (!modeData) {
    console.warn(`No theme colors found in ${mode} mode`);
    return {};
  }

  return {
    theme: transformTokenTree(modeData),
  };
}

/**
 * Extract semantic/component colors from foundation collection
 * These are the extended tokens like primary-bg-subtle, warning-text-emphasis, etc.
 * @param {Object} data - The Figma export data
 * @param {string} mode - The mode to extract (e.g., 'Light', 'Dark')
 */
function extractSemanticColors(data, mode = 'Light') {
  const semantic = data.Foundation?.modes?.[mode]?.semantic;

  if (!semantic) {
    console.warn(`No semantic colors found in ${mode} mode`);
    return {};
  }

  return {
    semantic: transformTokenTree(semantic),
  };
}

/**
 * Extract neutral colors (black, white, grays)
 * @param {Object} data - The Figma export data
 * @param {string} mode - The mode to extract (e.g., 'Light', 'Dark')
 */
function extractNeutralColors(data, mode = 'Light') {
  const neutral = data.Foundation?.modes?.[mode]?.colors?.neutral;

  if (!neutral) {
    console.warn(`No neutral colors found in ${mode} mode`);
    return {};
  }

  return {
    neutral: transformTokenTree(neutral),
  };
}

/**
 * Extract background colors
 * @param {Object} data - The Figma export data
 * @param {string} mode - The mode to extract (e.g., 'Light', 'Dark')
 */
function extractBackgroundColors(data, mode = 'Light') {
  const background = data.Foundation?.modes?.[mode]?.colors?.background;

  if (!background) {
    console.warn(`No background colors found in ${mode} mode`);
    return {};
  }

  return {
    background: transformTokenTree(background),
  };
}

/**
 * Extract opacity scale
 * @param {Object} data - The Figma export data
 * @param {string} mode - The mode to extract (e.g., 'Light', 'Dark')
 */
function extractOpacityColors(data, mode = 'Light') {
  const opacity = data.Foundation?.modes?.[mode]?.colors?.opacity;

  if (!opacity) {
    console.warn(`No opacity tokens found in ${mode} mode`);
    return {};
  }

  return {
    opacity: transformTokenTree(opacity),
  };
}

/**
 * Extract border colors
 * @param {Object} data - The Figma export data
 * @param {string} mode - The mode to extract (e.g., 'Light', 'Dark')
 */
function extractBorderColors(data, mode = 'Light') {
  const borderColor = data.Foundation?.modes?.[mode]?.borders?.color;

  if (!borderColor) {
    console.warn(`No border color tokens found in ${mode} mode`);
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
 * @param {Object} data - The Figma export data
 * @param {string} mode - The mode to extract (e.g., 'Light', 'Dark')
 */
function extractBorderWidths(data, mode = 'Light') {
  const borderWidth = data.Foundation?.modes?.[mode]?.borders?.width;

  if (!borderWidth) {
    console.warn(`No border width tokens found in ${mode} mode`);
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
 * Get the input source based on configuration with automatic fallback
 * Priority:
 * 1. Use configured source (theme or collections)
 * 2. If theme.json not found, fallback to individual collection files
 * 3. If collection file not found, try theme.json as fallback
 *
 * @param {string} collectionName - The collection name
 * @param {Object} collectionConfig - The collection configuration
 * @returns {string} The input file path
 */
function getInputSource(collectionName, collectionConfig) {
  const buildSource = CONFIG.build?.source || 'theme';
  const themeFile = path.join(FIGMA_EXPORTS, 'theme.json');
  const collectionFile = path.join(FIGMA_EXPORTS, collectionConfig.input);

  if (buildSource === 'theme') {
    // Prefer theme.json, fallback to collection file
    if (fs.existsSync(themeFile)) {
      return themeFile;
    }
    if (fs.existsSync(collectionFile)) {
      console.warn(`   ⚠️  theme.json not found, using ${collectionConfig.input}`);
      return collectionFile;
    }
    return themeFile; // Return theme path to trigger "not found" error
  }

  // Prefer collection file, fallback to theme.json
  if (fs.existsSync(collectionFile)) {
    return collectionFile;
  }
  if (fs.existsSync(themeFile)) {
    console.warn(`   ⚠️  ${collectionConfig.input} not found, using theme.json`);
    return themeFile;
  }
  return collectionFile; // Return collection path to trigger "not found" error
}

/**
 * Log configuration info
 */
function logConfigInfo(detectedModes = {}) {
  const buildSource = CONFIG.build?.source || 'theme';
  const autoDetect = CONFIG.themes?.autoDetect !== false;
  const ignoreModes = CONFIG.themes?.ignoreModes || [];

  console.log('📋 Configuration:');
  console.log(`   Build source: ${buildSource}`);
  console.log(`   Auto-detect modes: ${autoDetect}`);
  if (ignoreModes.length > 0) {
    console.log(`   Ignored modes: ${ignoreModes.join(', ')}`);
  }

  if (Object.keys(detectedModes).length > 0) {
    console.log('');
    console.log('🎨 Detected modes:');
    for (const [collection, modes] of Object.entries(detectedModes)) {
      const activeModes = modes.filter(m => !ignoreModes.includes(m));
      const ignoredModes = modes.filter(m => ignoreModes.includes(m));
      let modeDisplay = activeModes.join(', ');
      if (ignoredModes.length > 0) {
        modeDisplay += ` (ignored: ${ignoredModes.join(', ')})`;
      }
      console.log(`   ${collection}: ${modeDisplay}`);
    }
  }
  console.log('');
}

/**
 * Main transformation function
 */
function transformTokens() {
  console.log('🎨 Transforming Figma tokens to Style Dictionary format...\n');

  // Detect modes from theme.json if using theme source
  const detectedModes = {};
  const buildSource = CONFIG.build?.source || 'theme';

  if (buildSource === 'theme') {
    const themeFile = path.join(FIGMA_EXPORTS, 'theme.json');
    if (fs.existsSync(themeFile)) {
      const themeData = JSON.parse(fs.readFileSync(themeFile, 'utf8'));

      // Detect modes for each collection
      for (const collectionConfig of Object.values(CONFIG.transform?.collections || {})) {
        if (collectionConfig.hasModes && collectionConfig.path) {
          const modes = detectModes(themeData, collectionConfig.path);
          if (modes.length > 0) {
            detectedModes[collectionConfig.path] = modes;
          }
        }
      }
    }
  }

  // Log configuration with detected modes
  logConfigInfo(detectedModes);

  const ignoreModes = CONFIG.themes?.ignoreModes || [];
  const defaultMode = CONFIG.themes?.default || 'Light';

  // Process each collection
  for (const [collectionName, config] of Object.entries(COLLECTIONS)) {
    console.log(`Processing ${collectionName} collection...`);

    // Get input path based on configuration
    const inputPath = getInputSource(collectionName, config);

    // Check if input file exists
    if (!fs.existsSync(inputPath)) {
      console.warn(`⚠️  Input file not found: ${inputPath}`);
      continue;
    }

    // Read input file
    const data = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

    // Determine which modes to process for this collection
    // Default: build ALL detected modes (filtered by ignoreModes)
    let modesToProcess = [defaultMode];
    if (config.modeAware) {
      // Get the collection path from config (e.g., 'Foundation')
      const collectionPath = CONFIG.transform?.collections?.[collectionName]?.path;
      if (collectionPath && detectedModes[collectionPath]) {
        // Filter out ignored modes
        modesToProcess = detectedModes[collectionPath].filter(m => !ignoreModes.includes(m));
      } else {
        // Fall back to detecting from data directly
        const modes = detectModes(data, 'Foundation');
        if (modes.length > 1 || !modes.includes('Base')) {
          modesToProcess = modes.filter(m => !ignoreModes.includes(m));
        }
      }
    }

    // Process each output
    for (const output of config.outputs) {
      // For mode-aware collections, generate output for each mode
      for (const mode of modesToProcess) {
        // Generate the output file path
        let outputFile = output.file;
        if (config.modeAware && modesToProcess.length > 1) {
          // Insert mode into filename: color/semantic.json -> color/semantic-dark.json
          const ext = path.extname(output.file);
          const basename = path.basename(output.file, ext);
          const dirname = path.dirname(output.file);

          if (mode === defaultMode) {
            // Default mode keeps original filename
            outputFile = output.file;
          } else {
            // Other modes get mode suffix (lowercase)
            outputFile = path.join(dirname, `${basename}-${mode.toLowerCase()}${ext}`);
          }
        }

        const outputPath = path.join(OUTPUT_DIR, outputFile);

        try {
          // Extract and transform tokens (pass mode for mode-aware extractors)
          const tokens = config.modeAware ? output.extractor(data, mode) : output.extractor(data);

          if (Object.keys(tokens).length === 0) {
            console.warn(`  ⚠️  No tokens extracted for ${outputFile} (${mode} mode)`);
            continue;
          }

          // Ensure output directory exists
          ensureDir(outputPath);

          // Write output file
          fs.writeFileSync(outputPath, `${JSON.stringify(tokens, null, 2)}\n`, 'utf8');

          console.log(`  ✅ Created ${outputFile}${modesToProcess.length > 1 ? ` (${mode})` : ''}`);
        } catch (error) {
          console.error(`  ❌ Error processing ${outputFile}:`, error.message);
        }
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
