/**
 * Token Transformation module
 *
 * Transforms Figma token exports to Style Dictionary format with DTCG compliance.
 *
 * @packageDocumentation
 */

/* eslint-disable no-console, security/detect-non-literal-fs-filename, security/detect-object-injection */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, dirname, extname, join } from 'node:path';

import { validateFigmaExport } from './schemas/index.js';

import type {
  DTCGToken,
  FigmaExport,
  TokenType,
  TransformOptions,
  TransformResult,
} from './types.js';

// ============================================================================
// Types
// ============================================================================

/**
 * Extractor function type
 */
type ExtractorFn = (data: FigmaExport, mode?: string) => Record<string, unknown>;

/**
 * Collection output configuration
 */
interface CollectionOutput {
  /** Output file path relative to output directory */
  file: string;
  /** Extractor function for this output */
  extractor: ExtractorFn;
}

/**
 * Collection configuration
 */
interface CollectionConfig {
  /** Input filename */
  input: string;
  /** Whether collection has mode variants (Light/Dark) */
  modeAware: boolean;
  /** Output configurations */
  outputs: CollectionOutput[];
}

/**
 * Collections configuration map
 */
interface CollectionsConfig {
  [key: string]: CollectionConfig;
}

/**
 * Transform options specific to token values
 */
interface TokenTransformOptions {
  /** Font stack to prepend font name to */
  fontStack?: string;
  /** Token path for context-aware transformations */
  tokenPath?: string;
  /** Token scopes from Figma */
  scopes?: string[];
  /** Whether value represents a circle (50%) */
  isCircle?: boolean;
  /** Whether value represents a pill (9999px) */
  isPill?: boolean;
}

// ============================================================================
// Helpers
// ============================================================================

/** Keys that could cause prototype pollution */
const UNSAFE_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

/** Check if a key is safe from prototype pollution */
function isSafeKey(key: string): boolean {
  return !UNSAFE_KEYS.has(key);
}

/**
 * Safe nested property access for objects with index signatures
 */
function getNestedValue(obj: unknown, ...keys: string[]): unknown {
  const hasOwn = Object.prototype.hasOwnProperty;
  let current: unknown = obj;
  for (const key of keys) {
    if (current === null || current === undefined || typeof current !== 'object') {
      return undefined;
    }
    if (!isSafeKey(key)) {
      return undefined;
    }
    // Only access own properties to prevent prototype pollution
    if (!hasOwn.call(current, key)) {
      return undefined;
    }
    current = (current as Record<string, unknown>)[key];
  }
  return current;
}

// ============================================================================
// Value Transformation
// ============================================================================

/**
 * Check if a token should remain unitless
 */
function shouldKeepUnitless(_type: string, scopes: string[] = [], tokenPath = ''): boolean {
  // Font weights must be unitless (300, 400, 700, etc.)
  if (scopes.includes('FONT_WEIGHT')) {
    return true;
  }

  // Line heights should be unitless for proper inheritance (1, 1.5, 2, etc.)
  if (scopes.includes('LINE_HEIGHT')) {
    return true;
  }

  // Opacity values must be unitless decimals (0, 0.5, 1, etc.)
  if (scopes.includes('OPACITY')) {
    return true;
  }

  // Grid configuration values should be unitless (12 columns, 6 row-columns, etc.)
  const pathLower = tokenPath.toLowerCase();
  if (pathLower.includes('columns') || pathLower.includes('row-columns')) {
    return true;
  }

  return false;
}

/**
 * Check if px units should be added to a number value
 */
function shouldAddUnit(type: string, scopes: string[] = [], tokenPath = ''): boolean {
  // Don't add units to font-weights, line-heights, or grid configuration
  if (shouldKeepUnitless(type, scopes, tokenPath)) {
    return false;
  }

  return type === 'number';
}

/**
 * Transform value based on type
 */
export function transformValue(
  value: unknown,
  type: string | undefined,
  options: TokenTransformOptions = {}
): unknown {
  // Handle font family special case - prepend font name to font stack
  if (type === 'string' && options.fontStack && typeof value === 'string') {
    const fontName = value;
    const stack = options.fontStack;

    // Check if font name is already in the stack (avoid duplicates)
    if (stack.toLowerCase().includes(fontName.toLowerCase())) {
      return stack;
    }

    // Prepend font name to stack
    return `${fontName}, ${stack}`;
  }

  // Handle opacity: convert percentage (0-100) to decimal (0-1)
  if (typeof value === 'number' && options.scopes?.includes('OPACITY')) {
    // If value is > 1, it's a percentage that needs conversion
    if (value > 1) {
      return value / 100;
    }
    // Value is already a decimal (0-1)
    return value;
  }

  // Handle line-height and font-weight: keep as unitless number (CSS best practice)
  if (
    typeof value === 'number' &&
    shouldKeepUnitless(type ?? '', options.scopes, options.tokenPath)
  ) {
    return value;
  }

  // Handle numbers that should be dimensions
  if (typeof value === 'number' && shouldAddUnit(type ?? '', options.scopes, options.tokenPath)) {
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
 * @param figmaType - The original Figma type
 * @param scopes - Token scopes to determine type-specific handling
 */
export function transformType(
  figmaType: string | undefined,
  scopes: string[] = []
): TokenType | undefined {
  if (!figmaType) {
    return undefined;
  }

  // Keep 'number' type for unitless values (opacity, font-weight, line-height)
  if (figmaType === 'number') {
    const unitlessScopes = ['OPACITY', 'FONT_WEIGHT', 'LINE_HEIGHT'];
    if (scopes.some((scope) => unitlessScopes.includes(scope))) {
      return 'number' as TokenType;
    }
    // Default: convert number to dimension
    return 'dimension';
  }

  const typeMap = new Map<string, TokenType>([
    ['string', 'fontFamily'],
    ['color', 'color'],
  ]);

  return typeMap.get(figmaType) ?? (figmaType as TokenType);
}

/**
 * Transform a single token from Figma format to DTCG-compliant format
 */
export function transformToken(
  figmaToken: unknown,
  options: TokenTransformOptions = {}
): DTCGToken | null {
  if (!figmaToken || typeof figmaToken !== 'object') {
    return null;
  }

  const tokenObj = figmaToken as Record<string, unknown>;
  const hasOwn = Object.prototype.hasOwnProperty;

  // Skip if this is not a leaf token (no $value property)
  if (!hasOwn.call(tokenObj, '$value')) {
    return null;
  }

  // Extract scopes for type-specific handling
  const scopes = (tokenObj['$scopes'] as string[] | undefined) ?? [];

  // Pass scopes to transformValue for type-specific handling
  const transformOptions: TokenTransformOptions = {
    ...options,
    scopes,
  };

  const rawType = tokenObj['$type'] as string | undefined;
  const transformedType = transformType(rawType, scopes);

  // DTCG Format: Keep $ prefix for all properties
  const token: DTCGToken = {
    $value: transformValue(tokenObj['$value'], rawType, transformOptions),
    $type: transformedType ?? 'string',
  };

  // Add description if present (DTCG property)
  if (tokenObj['$description'] && typeof tokenObj['$description'] === 'string') {
    token.$description = tokenObj['$description'];
  }

  // Preserve extensions (DTCG property) - keeps all metadata
  if (tokenObj['$extensions'] && typeof tokenObj['$extensions'] === 'object') {
    token.$extensions = tokenObj['$extensions'] as Record<string, unknown>;
  }

  return token;
}

/**
 * Recursively transform nested token objects
 */
export function transformTokenTree(
  obj: unknown,
  parentKey = '',
  options: Record<string, TokenTransformOptions> = {}
): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  const optionsMap = new Map(Object.entries(options));

  if (obj === null || typeof obj !== 'object' || Array.isArray(obj)) {
    return result;
  }

  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    // Build the full path for this token
    const currentPath = parentKey ? `${parentKey}.${key}` : key;

    // Try to transform as a token
    const keyOptions = optionsMap.get(key);
    const tokenOptions: TokenTransformOptions = {
      ...(keyOptions ?? {}),
      tokenPath: currentPath,
    };
    const transformed = transformToken(value, tokenOptions);

    if (transformed) {
      Object.defineProperty(result, key, {
        value: transformed,
        writable: true,
        enumerable: true,
        configurable: true,
      });
    } else if (typeof value === 'object' && value !== null) {
      // Recursively process nested objects
      const nested = transformTokenTree(
        value,
        currentPath,
        (keyOptions as Record<string, TokenTransformOptions>) ?? {}
      );
      if (Object.keys(nested).length > 0) {
        Object.defineProperty(result, key, {
          value: nested,
          writable: true,
          enumerable: true,
          configurable: true,
        });
      }
    }
  }

  return result;
}

// ============================================================================
// Extractors
// ============================================================================

/**
 * Extract brand colors from foundation collection
 */
function extractBrandColors(data: FigmaExport, mode = 'Light'): Record<string, unknown> {
  const brandData = getNestedValue(data, 'Foundation', 'modes', mode, 'colors', 'brand');

  if (!brandData) {
    console.warn(`No brand colors found in ${mode} mode`);
    return {};
  }

  return {
    color: transformTokenTree(brandData),
  };
}

/**
 * Extract semantic/component colors from foundation collection
 */
function extractSemanticColors(data: FigmaExport, mode = 'Light'): Record<string, unknown> {
  const semantic = getNestedValue(data, 'Foundation', 'modes', mode, 'semantic');

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
 */
function extractNeutralColors(data: FigmaExport, mode = 'Light'): Record<string, unknown> {
  const neutral = getNestedValue(data, 'Foundation', 'modes', mode, 'colors', 'neutral');

  if (!neutral) {
    console.warn(`No neutral colors found in ${mode} mode`);
    return {};
  }

  return {
    neutral: transformTokenTree(neutral),
  };
}

/**
 * Extract opacity scale
 */
function extractOpacityColors(data: FigmaExport, mode = 'Light'): Record<string, unknown> {
  const opacity = getNestedValue(data, 'Foundation', 'modes', mode, 'colors', 'opacity');

  if (!opacity) {
    console.warn(`No opacity tokens found in ${mode} mode`);
    return {};
  }

  return {
    opacity: transformTokenTree(opacity),
  };
}

/**
 * Extract typography tokens
 */
function extractTypography(data: FigmaExport): Record<string, unknown> {
  const base = getNestedValue(data, 'Typography', 'modes', 'Base') as
    | Record<string, unknown>
    | undefined;

  if (!base) {
    console.warn('No typography tokens found');
    return {};
  }

  // Special handling for font families - use font stacks from extensions
  const optionsMap = new Map<string, TokenTransformOptions>();
  const fontFamily = Reflect.get(base, 'fontFamily') as
    | Record<string, Record<string, unknown>>
    | undefined;
  if (fontFamily) {
    for (const key of Object.keys(fontFamily)) {
      const fontToken = Reflect.get(fontFamily, key) as Record<string, unknown> | undefined;
      const extensions = fontToken?.['$extensions'] as
        | Record<string, Record<string, string>>
        | undefined;
      const fontStack = extensions?.['platform']?.['fontStack'];
      if (fontStack) {
        optionsMap.set(key, { fontStack });
      }
    }
  }

  return {
    typography: transformTokenTree(base, '', {
      fontFamily: Object.fromEntries(optionsMap),
    } as Record<string, TokenTransformOptions>),
  };
}

/**
 * Extract spacing tokens
 */
function extractSpacing(data: FigmaExport): Record<string, unknown> {
  const base = getNestedValue(data, 'Spacing', 'modes', 'Base', 'spacing');

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
function extractRadius(data: FigmaExport): Record<string, unknown> {
  // Support both 'border-radius' (Bootstrap naming) and 'radius' (legacy Figma naming)
  const base =
    getNestedValue(data, 'Radius', 'modes', 'Base', 'border-radius') ||
    getNestedValue(data, 'Radius', 'modes', 'Base', 'radius');

  if (!base) {
    console.warn('No radius tokens found');
    return {};
  }

  // Special handling for circle and pill
  const options: Record<string, TokenTransformOptions> = {
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
 * Extract border widths from border.json file
 * Structure: Border.modes.Base.[0-5] → border.width.[0-5]
 */
function extractBorderWidthsFromBorder(data: FigmaExport): Record<string, unknown> {
  const base = getNestedValue(data, 'Border', 'modes', 'Base');

  if (!base) {
    console.warn('No border width tokens found in border.json');
    return {};
  }

  // Transform numeric keys to proper width tokens
  // The tokens are numbers (0-5) representing pixel values
  const transformedWidths = new Map<string, DTCGToken>();
  for (const [key, value] of Object.entries(base as Record<string, unknown>)) {
    if (typeof value === 'object' && value !== null) {
      const token = value as Record<string, unknown>;
      const numValue = token['$value'];

      // Convert to dimension type with px unit for border widths
      transformedWidths.set(key, {
        $value: typeof numValue === 'number' ? `${numValue}px` : String(numValue),
        $type: 'dimension',
        $description: `Border width ${key} (${numValue}px). Bootstrap's $border-width-${key} variable.`,
        $extensions: {
          platform: {
            scssVariableName: `$border-width-${key}`,
          },
        },
      });
    }
  }

  return {
    border: {
      width: Object.fromEntries(transformedWidths),
    },
  };
}

/**
 * Extract breakpoint tokens
 */
function extractBreakpoints(data: FigmaExport): Record<string, unknown> {
  const breakpoints = getNestedValue(data, 'Layout', 'modes', 'Base', 'breakpoints');

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
function extractContainers(data: FigmaExport): Record<string, unknown> {
  const container = getNestedValue(data, 'Layout', 'modes', 'Base', 'container');

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
function extractGrid(data: FigmaExport): Record<string, unknown> {
  const base = getNestedValue(data, 'Layout', 'modes', 'Base') as
    | Record<string, unknown>
    | undefined;
  const grid = base?.['grid'];
  const gutters = base?.['gutters'];

  if (!grid) {
    console.warn('No grid tokens found');
    return {};
  }

  const result: { layout: { grid: Record<string, unknown>; gutters?: Record<string, unknown> } } = {
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
function extractShadows(data: FigmaExport): Record<string, unknown> {
  const base = getNestedValue(data, 'Shadows', 'modes', 'Base', 'shadows') as
    | Record<string, Record<string, unknown>>
    | undefined;

  if (!base) {
    console.warn('No shadow tokens found');
    return {};
  }

  const shadowMap = new Map<string, DTCGToken>();

  for (const [key, value] of Object.entries(base)) {
    const composite = value?.['composite'] as Record<string, unknown> | undefined;
    if (composite) {
      const token: DTCGToken = {
        $value: composite['$value'],
        $type: 'shadow',
      };

      if (composite['$description'] && typeof composite['$description'] === 'string') {
        token.$description = composite['$description'];
      }

      if (composite['$extensions'] && typeof composite['$extensions'] === 'object') {
        token.$extensions = composite['$extensions'] as Record<string, unknown>;
      }

      shadowMap.set(key, token);
    }
  }

  return { shadow: Object.fromEntries(shadowMap) };
}

// ============================================================================
// Default Collections Configuration
// ============================================================================

/**
 * Default collections configuration matching the original script
 */
const DEFAULT_COLLECTIONS: CollectionsConfig = {
  foundation: {
    input: 'foundation.json',
    modeAware: true,
    outputs: [
      { file: 'collections/color/primitive.json', extractor: extractBrandColors },
      { file: 'collections/color/neutral.json', extractor: extractNeutralColors },
      { file: 'collections/color/opacity.json', extractor: extractOpacityColors },
      { file: 'collections/color/component.json', extractor: extractSemanticColors },
      // Note: These paths don't exist in current Figma exports:
      // - colors.theme (extractThemeColors) - use semantic tokens instead
      // - colors.background (extractBackgroundColors) - backgrounds are in semantic
      // - borders.color (extractBorderColors) - border colors are in semantic.border-color
    ],
  },
  typography: {
    input: 'typography.json',
    modeAware: false,
    outputs: [{ file: 'collections/typography/base.json', extractor: extractTypography }],
  },
  spacing: {
    input: 'spacing.json',
    modeAware: false,
    outputs: [{ file: 'collections/spacing/base.json', extractor: extractSpacing }],
  },
  radius: {
    input: 'radius.json',
    modeAware: false,
    outputs: [{ file: 'collections/border/radius.json', extractor: extractRadius }],
  },
  border: {
    input: 'border.json',
    modeAware: false,
    outputs: [{ file: 'collections/border/width.json', extractor: extractBorderWidthsFromBorder }],
  },
  layout: {
    input: 'layout.json',
    modeAware: false,
    outputs: [
      { file: 'collections/layout/breakpoints.json', extractor: extractBreakpoints },
      { file: 'collections/layout/containers.json', extractor: extractContainers },
      { file: 'collections/layout/grid.json', extractor: extractGrid },
    ],
  },
  shadows: {
    input: 'shadows.json',
    modeAware: false,
    outputs: [{ file: 'collections/shadow/base.json', extractor: extractShadows }],
  },
};

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Ensure directory exists
 */
function ensureDir(filePath: string): void {
  const dir = dirname(filePath);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

/**
 * Detect modes from Figma export data
 */
export function detectModes(data: FigmaExport, collectionPath?: string): string[] {
  if (!data || typeof data !== 'object') {
    return ['Base'];
  }

  // If collection path is specified, look for that collection
  if (collectionPath) {
    const collection = getNestedValue(data, collectionPath) as Record<string, unknown> | undefined;
    const modes = collection?.['modes'] as Record<string, unknown> | undefined;
    if (modes) {
      return Object.keys(modes);
    }
    return ['Base'];
  }

  // Otherwise, look for modes in any collection
  for (const value of Object.values(data)) {
    if (typeof value === 'object' && value !== null) {
      const collection = value as Record<string, unknown>;
      const modes = collection['modes'] as Record<string, unknown> | undefined;
      if (modes) {
        return Object.keys(modes);
      }
    }
  }

  return ['Base'];
}

/**
 * Get input source based on configuration with automatic fallback
 */
function getInputSource(
  collectionConfig: CollectionConfig,
  exportsDir: string,
  buildSource: string
): string {
  const themeFile = join(exportsDir, 'theme.json');
  const collectionFile = join(exportsDir, collectionConfig.input);

  if (buildSource === 'theme') {
    // Prefer theme.json, fallback to collection file
    if (existsSync(themeFile)) {
      return themeFile;
    }
    if (existsSync(collectionFile)) {
      console.warn(`   ⚠️  theme.json not found, using ${collectionConfig.input}`);
      return collectionFile;
    }
    return themeFile;
  }

  // Prefer collection file, fallback to theme.json
  if (existsSync(collectionFile)) {
    return collectionFile;
  }
  if (existsSync(themeFile)) {
    console.warn(`   ⚠️  ${collectionConfig.input} not found, using theme.json`);
    return themeFile;
  }
  return collectionFile;
}

// ============================================================================
// Main Transformation
// ============================================================================

/**
 * Transform Figma tokens to Style Dictionary format
 */
export function transformTokens(options: TransformOptions): TransformResult {
  const {
    sourceDir,
    collectionsDir,
    ignoreModes = [],
    defaultMode = 'Light',
    dryRun = false,
    verbose = false,
  } = options;

  const startTime = Date.now();
  const errors: string[] = [];
  const warnings: string[] = [];
  const filesWritten: string[] = [];
  const allModesDetected: Set<string> = new Set();
  let tokensProcessed = 0;

  if (verbose) {
    console.info('🎨 Transforming Figma tokens to Style Dictionary format...\n');
    console.info('📋 Configuration:');
    console.info(`   Source directory: ${sourceDir}`);
    console.info(`   Output directory: ${collectionsDir}`);
    console.info(`   Default mode: ${defaultMode}`);
    if (ignoreModes.length > 0) {
      console.info(`   Ignored modes: ${ignoreModes.join(', ')}`);
    }
    if (dryRun) {
      console.info('   DRY RUN - no files will be written');
    }
    console.info('');
  }

  // Detect modes from theme.json
  const detectedModesMap = new Map<string, string[]>();
  const themeFile = join(sourceDir, 'theme.json');
  if (existsSync(themeFile)) {
    try {
      const content = readFileSync(themeFile, 'utf-8');
      const themeData = JSON.parse(content) as FigmaExport;

      // Detect modes for each collection
      for (const [name, collectionConfig] of Object.entries(DEFAULT_COLLECTIONS)) {
        const typedConfig = collectionConfig as CollectionConfig;
        if (typedConfig.modeAware) {
          const collectionPath = name.charAt(0).toUpperCase() + name.slice(1);
          const modes = detectModes(themeData, collectionPath);
          if (modes.length > 0) {
            detectedModesMap.set(collectionPath, modes);
            for (const mode of modes) {
              allModesDetected.add(mode);
            }
          }
        }
      }
    } catch (error) {
      warnings.push(
        `Failed to read theme.json for mode detection: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  // Process each collection
  for (const [collectionName, collectionConfig] of Object.entries(DEFAULT_COLLECTIONS)) {
    const typedConfig = collectionConfig as CollectionConfig;
    if (verbose) {
      console.info(`Processing ${collectionName} collection...`);
    }

    // Get input path based on configuration
    const inputPath = getInputSource(typedConfig, sourceDir, 'theme');

    // Check if input file exists
    if (!existsSync(inputPath)) {
      warnings.push(`Input file not found: ${inputPath}`);
      continue;
    }

    // Read input file
    let data: FigmaExport;
    try {
      const content = readFileSync(inputPath, 'utf-8');
      data = JSON.parse(content) as FigmaExport;

      // Validate schema if strict mode is enabled
      if (options.strict) {
        const validation = validateFigmaExport(data);
        if (!validation.valid) {
          const errorMessages = validation.errors?.map((e) => `${e.path}: ${e.message}`) || [];
          errors.push(`Schema validation failed for ${inputPath}:\n${errorMessages.join('\n')}`);
          continue;
        }
        if (verbose) {
          console.info(`   ✓ Schema validation passed`);
        }
      }
    } catch (error) {
      errors.push(
        `Failed to read ${inputPath}: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
      continue;
    }

    // Determine which modes to process for this collection
    let modesToProcess = [defaultMode];
    if (typedConfig.modeAware) {
      const collectionPath = collectionName.charAt(0).toUpperCase() + collectionName.slice(1);
      const detectedForCollection = detectedModesMap.get(collectionPath);
      if (detectedForCollection) {
        modesToProcess = detectedForCollection.filter((m) => !ignoreModes.includes(m));
      } else {
        const modes = detectModes(data, collectionPath);
        if (modes.length > 1 || !modes.includes('Base')) {
          modesToProcess = modes.filter((m) => !ignoreModes.includes(m));
        }
      }
    }

    // Process each output
    for (const output of typedConfig.outputs) {
      for (const mode of modesToProcess) {
        // Generate the output file path
        let outputFile = output.file;
        if (typedConfig.modeAware && modesToProcess.length > 1) {
          const ext = extname(output.file);
          const base = basename(output.file, ext);
          const dir = dirname(output.file);

          if (mode !== defaultMode) {
            outputFile = join(dir, `${base}-${mode.toLowerCase()}${ext}`);
          }
        }

        const outputPath = join(collectionsDir, outputFile);

        try {
          // Extract and transform tokens
          const tokens = typedConfig.modeAware
            ? output.extractor(data, mode)
            : output.extractor(data);

          const tokenCount = Object.keys(tokens).length;
          if (tokenCount === 0) {
            warnings.push(`No tokens extracted for ${outputFile} (${mode} mode)`);
            continue;
          }

          tokensProcessed += tokenCount;

          if (!dryRun) {
            // Ensure output directory exists
            ensureDir(outputPath);

            // Write output file
            writeFileSync(outputPath, `${JSON.stringify(tokens, null, 2)}\n`, 'utf-8');
          }

          filesWritten.push(outputFile);

          if (verbose) {
            const dryRunLabel = dryRun ? ' (dry run)' : '';
            console.info(
              `  ✅ Created ${outputFile}${modesToProcess.length > 1 ? ` (${mode})` : ''}${dryRunLabel}`
            );
          }
        } catch (error) {
          errors.push(
            `Error processing ${outputFile}: ${error instanceof Error ? error.message : 'Unknown error'}`
          );
        }
      }
    }
  }

  const duration = Date.now() - startTime;

  if (verbose) {
    console.info('\n✨ Transformation complete!');
    console.info(`\n📁 Output directory: ${collectionsDir}`);
    console.info(`⏱️  Duration: ${duration}ms`);
  }

  return {
    success: errors.length === 0,
    filesWritten,
    tokensProcessed,
    modesDetected: Array.from(allModesDetected),
    errors,
    warnings,
    duration,
  };
}

/**
 * CLI entry point for token transformation
 */
export function transformTokensCLI(
  sourceDir: string,
  collectionsDir: string,
  options: Partial<Omit<TransformOptions, 'sourceDir' | 'collectionsDir'>> = {}
): boolean {
  const result = transformTokens({
    sourceDir,
    collectionsDir,
    verbose: true,
    ...options,
  });

  // Report errors
  for (const error of result.errors) {
    console.error(`❌ ${error}`);
  }

  // Report warnings
  for (const warning of result.warnings) {
    console.warn(`⚠️  ${warning}`);
  }

  return result.success;
}
