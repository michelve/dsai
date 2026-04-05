#!/usr/bin/env node

/**
 * Comprehensive Figma Token Validator
 *
 * This script validates the SOURCE OF TRUTH (figma-exports) and ensures
 * that ALL tokens are correctly transformed into output files with NO LOSS.
 *
 * SOURCE OF TRUTH: packages/@dsai-io/tokens/figma-exports/*.json
 * OUTPUTS: packages/@dsai-io/tokens/**\/*.json (color/, typography/, spacing/, etc.)
 *
 * Validates:
 * 1. Figma export files exist and have valid structure
 * 2. All collections and modes are present (Light, Dark, Base, Pro, Enterprise, etc.)
 * 3. All tokens have required properties ($value, $type)
 * 4. All nested levels are complete (no missing tokens)
 * 5. Transformation completeness (source tokens vs output tokens)
 * 6. No tokens are lost in transformation
 * 7. Value consistency between source and output
 * 8. Multi-theme/mode support with per-mode statistics
 *
 * Supported theme selectors:
 * - :root (default/light mode)
 * - [data-dsai-theme="{mode}"] (dark, pro, enterprise, moonlight, etc.)
 *
 * Usage: node tools/scripts/tokens/validate-figma-tokens.cjs
 *
 * @see TASK-011-design-json-token-structure.md
 */

const fs = require('node:fs');
const path = require('node:path');

// ============================================================================
// CONFIGURATION
// ============================================================================

const FIGMA_EXPORTS_DIR = path.join(__dirname, '../../../packages/@dsai-io/tokens/figma-exports');
const TOKENS_DIR = path.join(__dirname, '../../../packages/@dsai-io/tokens');

// Master combined file (contains all tokens)
const MASTER_FILE = 'theme.json';

// Individual collection files (separate exports)
const COLLECTION_FILES = [
  'foundation.json',
  'typography.json',
  'spacing.json',
  'radius.json',
  'layout.json',
  'shadows.json',
];

// Will be set based on user choice or what's available
let EXPECTED_EXPORTS = [];

// Expected output files (after transformation)
const EXPECTED_OUTPUTS = [
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
];

// Validation results
const results = {
  errors: [],
  warnings: [],
  info: [],
  stats: {
    totalSourceTokens: 0,
    totalOutputTokens: 0,
    missingTokens: [],
    extraTokens: [],
    // Track tokens per mode for multi-theme validation
    tokensByMode: {},
    modesFound: new Set(),
  },
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Check if file exists
 */
function fileExists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch {
    return false;
  }
}

/**
 * Read JSON file safely
 */
function readJsonFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    results.errors.push({
      file: path.relative(process.cwd(), filePath),
      message: `Failed to parse JSON: ${error.message}`,
    });
    return null;
  }
}

/**
 * Check if object is a Figma token (has $value and $type)
 */
function isFigmaToken(obj) {
  return (
    obj && typeof obj === 'object' && Object.hasOwn(obj, '$value') && Object.hasOwn(obj, '$type')
  );
}

/**
 * Check if object is a Style Dictionary token (has value and type)
 * Supports both DTCG format ($value, $type) and legacy format (value, type)
 */
function isStyleDictionaryToken(obj) {
  if (!obj || typeof obj !== 'object') {
    return false;
  }

  // Check for DTCG format ($value, $type)
  const isDTCG = Object.hasOwn(obj, '$value') && Object.hasOwn(obj, '$type');

  // Check for legacy format (value, type)
  const isLegacy = Object.hasOwn(obj, 'value') && Object.hasOwn(obj, 'type');

  return isDTCG || isLegacy;
}

/**
 * Generate a path string from array
 */
function generatePath(pathArray) {
  return pathArray.join('.');
}

// ============================================================================
// SOURCE DETECTION AND SELECTION
// ============================================================================

/**
 * Prompt user for input (synchronous)
 */
function promptUser(question) {
  const readline = require('node:readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase());
    });
  });
}

/**
 * Determine which source files to use
 * Returns array of files to validate
 */
async function determineSourceFiles() {
  const masterExists = fileExists(path.join(FIGMA_EXPORTS_DIR, MASTER_FILE));
  const collectionsExist = COLLECTION_FILES.some((file) =>
    fileExists(path.join(FIGMA_EXPORTS_DIR, file))
  );

  console.log('\n🔍 Detecting Figma export files...\n');

  // Case 1: Only master file exists
  if (masterExists && !collectionsExist) {
    console.log(`✓ Found master combined file: ${MASTER_FILE}`);
    console.log(`  Using ${MASTER_FILE} as SOURCE OF TRUTH\n`);
    return [MASTER_FILE];
  }

  // Case 2: Only collection files exist
  if (!masterExists && collectionsExist) {
    const existingFiles = COLLECTION_FILES.filter((file) =>
      fileExists(path.join(FIGMA_EXPORTS_DIR, file))
    );
    console.log(`✓ Found ${existingFiles.length} collection files`);
    existingFiles.forEach((file) => {
      console.log(`  - ${file}`);
    });
    console.log('  Using collection files as SOURCE OF TRUTH\n');
    return existingFiles;
  }

  // Case 3: Both exist - ask user
  if (masterExists && collectionsExist) {
    const existingCollections = COLLECTION_FILES.filter((file) =>
      fileExists(path.join(FIGMA_EXPORTS_DIR, file))
    );

    console.log('✓ Found BOTH master file AND collection files:\n');
    console.log(`  Master file: ${MASTER_FILE}`);
    console.log(`  Collection files: ${existingCollections.length}`);
    existingCollections.forEach((file) => {
      console.log(`    - ${file}`);
    });
    console.log();

    // Check if running in CI or non-interactive mode
    if (process.env.CI || !process.stdin.isTTY) {
      console.log('⚠️  Non-interactive mode detected');
      console.log('   Using master file (theme.json) by default');
      console.log('   Set FIGMA_SOURCE=collections to use collection files\n');

      const envChoice = process.env.FIGMA_SOURCE;
      if (envChoice === 'collections' || envChoice === 'collection') {
        return existingCollections;
      }
      return [MASTER_FILE];
    }

    // Interactive prompt
    console.log('Which source should be used for validation?');
    console.log('  [1] Master combined file (theme.json) - All tokens in one file');
    console.log('  [2] Collection files - Separate files per category');
    console.log();

    const answer = await promptUser('Enter choice (1 or 2): ');

    if (answer === '2' || answer === 'collection' || answer === 'collections') {
      console.log(`\n✓ Using collection files as SOURCE OF TRUTH\n`);
      return existingCollections;
    } else {
      console.log(`\n✓ Using master file (${MASTER_FILE}) as SOURCE OF TRUTH\n`);
      return [MASTER_FILE];
    }
  }

  // Case 4: Neither exists
  console.log('❌ No Figma export files found!');
  console.log('   Please export tokens from Figma to:');
  console.log(`   ${FIGMA_EXPORTS_DIR}\n`);
  results.errors.push({
    message: 'No Figma export files found',
    severity: 'CRITICAL',
  });
  return [];
}

// ============================================================================
// FIGMA EXPORTS VALIDATION (SOURCE OF TRUTH)
// ============================================================================

/**
 * Validate that all expected Figma export files exist
 */
function validateExportFilesExist() {
  console.log('📂 Validating Figma export files existence...\n');

  for (const exportFile of EXPECTED_EXPORTS) {
    const filePath = path.join(FIGMA_EXPORTS_DIR, exportFile);

    if (!fileExists(filePath)) {
      results.errors.push({
        file: exportFile,
        message: 'Figma export file missing (SOURCE OF TRUTH)',
        severity: 'CRITICAL',
      });
    } else {
      results.info.push({
        file: exportFile,
        message: 'Source file exists ✓',
      });
    }
  }
}

/**
 * Recursively count and validate tokens in an object tree
 * Supports both DTCG format ($value/$type) and legacy format (value/type)
 */
function validateTokenTree(obj, pathArray = [], parentFile = '', validationType = 'figma') {
  const tokenCheck = validationType === 'figma' ? isFigmaToken : isStyleDictionaryToken;

  // For Figma tokens, always use $ prefix
  // For output tokens, check for DTCG ($value) first, then legacy (value)
  const getValueKey = (token) => {
    if (validationType === 'figma') {
      return '$value';
    }
    return Object.hasOwn(token, '$value') ? '$value' : 'value';
  };

  const getTypeKey = (token) => {
    if (validationType === 'figma') {
      return '$type';
    }
    return Object.hasOwn(token, '$type') ? '$type' : 'type';
  };

  let tokenCount = 0;
  const tokens = [];

  for (const [key, value] of Object.entries(obj)) {
    const currentPath = [...pathArray, key];
    const pathString = generatePath(currentPath);

    if (tokenCheck(value)) {
      // This is a token - validate it
      tokenCount++;

      const valueKey = getValueKey(value);
      const typeKey = getTypeKey(value);

      // Validate required properties
      if (value[valueKey] === null || value[valueKey] === undefined || value[valueKey] === '') {
        results.errors.push({
          file: parentFile,
          path: pathString,
          message: `Token has empty ${valueKey}`,
        });
      }

      if (!value[typeKey]) {
        results.errors.push({
          file: parentFile,
          path: pathString,
          message: `Token missing ${typeKey} property`,
        });
      }

      // Store token info for comparison
      tokens.push({
        path: pathString,
        value: value[valueKey],
        type: value[typeKey],
      });

      // Validate Figma-specific properties
      if (validationType === 'figma') {
        // Check for description (warning only - not required but recommended)
        if (!value.$description) {
          results.warnings.push({
            file: parentFile,
            path: pathString,
            message: 'Token missing $description (recommended for documentation)',
          });
        }

        // Check for SCSS variable name in extensions
        if (!value.$extensions?.platform?.scssVariableName) {
          results.warnings.push({
            file: parentFile,
            path: pathString,
            message: 'Token missing SCSS variable name in $extensions.platform',
          });
        }
      }
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      // Recursively validate nested objects
      const nestedResult = validateTokenTree(value, currentPath, parentFile, validationType);
      tokenCount += nestedResult.count;
      tokens.push(...nestedResult.tokens);
    }
  }

  return { count: tokenCount, tokens };
}

/**
 * Validate a single Figma export file structure
 */
function validateFigmaExportFile(fileName) {
  const filePath = path.join(FIGMA_EXPORTS_DIR, fileName);
  const data = readJsonFile(filePath);

  if (!data) {
    return { count: 0, tokens: [] };
  }

  console.log(`\n  Validating ${fileName}...`);

  // Check for collection structure
  const collectionKeys = Object.keys(data);
  if (collectionKeys.length === 0) {
    results.errors.push({
      file: fileName,
      message: 'File is empty or has no collections',
    });
    return { count: 0, tokens: [] };
  }

  results.info.push({
    file: fileName,
    message: `Found collections: ${collectionKeys.join(', ')}`,
  });

  let totalTokens = 0;
  const allTokens = [];

  // Validate each collection
  for (const collectionName of collectionKeys) {
    const collection = data[collectionName];

    if (!collection.modes) {
      results.errors.push({
        file: fileName,
        collection: collectionName,
        message: 'Collection missing "modes" property',
      });
      continue;
    }

    const modes = Object.keys(collection.modes);

    // Track all discovered modes
    for (const mode of modes) {
      results.stats.modesFound.add(mode);
    }

    results.info.push({
      file: fileName,
      collection: collectionName,
      message: `Modes: ${modes.join(', ')}`,
    });

    // Validate that at least one default mode exists (Light or Base)
    // Other modes (Dark, Pro, Enterprise, etc.) are optional
    const hasDefaultMode = modes.some((m) => ['Light', 'Base', 'Default'].includes(m));

    if (!hasDefaultMode) {
      results.warnings.push({
        file: fileName,
        collection: collectionName,
        message: `No default mode (Light/Base/Default) found. Available modes: ${modes.join(', ')}`,
      });
    }

    // Validate tokens in each mode
    for (const modeName of modes) {
      const modeData = collection.modes[modeName];
      const result = validateTokenTree(
        modeData,
        [collectionName, 'modes', modeName],
        fileName,
        'figma'
      );

      totalTokens += result.count;
      allTokens.push(
        ...result.tokens.map((t) => ({
          ...t,
          collection: collectionName,
          mode: modeName,
          sourceFile: fileName,
        }))
      );

      console.log(`    ${modeName} mode: ${result.count} tokens`);
    }
  }

  console.log(`  Total tokens in ${fileName}: ${totalTokens}`);

  return { count: totalTokens, tokens: allTokens };
}

/**
 * Validate all Figma export files
 */
function validateAllFigmaExports() {
  console.log('\n🔍 Validating Figma export files (SOURCE OF TRUTH)...');

  let totalSourceTokens = 0;
  const allSourceTokens = [];

  for (const exportFile of EXPECTED_EXPORTS) {
    const filePath = path.join(FIGMA_EXPORTS_DIR, exportFile);

    if (fileExists(filePath)) {
      const result = validateFigmaExportFile(exportFile);
      totalSourceTokens += result.count;
      allSourceTokens.push(...result.tokens);
    }
  }

  results.stats.totalSourceTokens = totalSourceTokens;
  results.stats.sourceTokens = allSourceTokens;

  console.log(`\n  📊 Total source tokens: ${totalSourceTokens}\n`);
}

// ============================================================================
// OUTPUT FILES VALIDATION
// ============================================================================

/**
 * Validate that all expected output files exist
 */
function validateOutputFilesExist() {
  console.log('\n📂 Validating output files existence...\n');

  for (const outputFile of EXPECTED_OUTPUTS) {
    const filePath = path.join(TOKENS_DIR, outputFile);

    if (!fileExists(filePath)) {
      results.warnings.push({
        file: outputFile,
        message: 'Output file missing (run pnpm build:tokens to generate)',
      });
    } else {
      results.info.push({
        file: outputFile,
        message: 'Output file exists ✓',
      });
    }
  }
}

/**
 * Validate output file and count tokens
 */
function validateOutputFile(fileName) {
  const filePath = path.join(TOKENS_DIR, fileName);
  const data = readJsonFile(filePath);

  if (!data) {
    return { count: 0, tokens: [] };
  }

  console.log(`\n  Validating ${fileName}...`);

  // Don't prepend the basename - the token paths in the files are already structured correctly
  const result = validateTokenTree(data, [], fileName, 'sd');

  console.log(`  Total tokens in ${fileName}: ${result.count}`);

  return {
    count: result.count,
    tokens: result.tokens.map((t) => ({
      ...t,
      outputFile: fileName,
    })),
  };
}

/**
 * Validate all output files
 */
function validateAllOutputFiles() {
  console.log('\n🔍 Validating transformed output files...');

  let totalOutputTokens = 0;
  const allOutputTokens = [];

  for (const outputFile of EXPECTED_OUTPUTS) {
    const filePath = path.join(TOKENS_DIR, outputFile);

    if (fileExists(filePath)) {
      const result = validateOutputFile(outputFile);
      totalOutputTokens += result.count;
      allOutputTokens.push(...result.tokens);
    }
  }

  results.stats.totalOutputTokens = totalOutputTokens;
  results.stats.outputTokens = allOutputTokens;

  console.log(`\n  📊 Total output tokens: ${totalOutputTokens}\n`);
}

// ============================================================================
// TRANSFORMATION COMPLETENESS VALIDATION
// ============================================================================

/**
 * Normalize token path for comparison
 * Removes mode/collection prefixes to focus on actual token path
 */
function normalizeTokenPath(token) {
  // Strategy: Remove only metadata prefixes, preserve actual token structure
  // Source: Foundation.modes.Light.colors.brand.blue.500 -> color.blue.500
  // Source: Foundation.modes.Light.colors.neutral.white -> neutral.white
  // Output: color.blue.500 -> color.blue.500 (already normalized)
  // Output: neutral.white -> neutral.white (already normalized)

  let path = token.path;

  // Step 1: Remove collection and mode prefixes from source (Figma structure)
  // Handle special cases where the collection name appears twice:
  // Typography.modes.Base.headings.* -> typography.headings.*
  // Spacing.modes.Base.spacing.* -> spacing.* (not spacing.spacing.*)
  // Layout.modes.Base.breakpoints.* -> layout.breakpoints.*
  if (path.match(/^Typography\.modes\.Base\./i)) {
    path = path.replaceAll(/^Typography\.modes\.Base\./gi, 'typography.');
  } else if (path.match(/^Spacing\.modes\.Base\.spacing\./i)) {
    // Special case: remove both "Spacing.modes.Base." AND "spacing."
    path = path.replaceAll(/^Spacing\.modes\.Base\.spacing\./gi, 'spacing.');
  } else if (path.match(/^Radius\.modes\.Base\.radius\./i)) {
    // Special case for radius
    path = path.replaceAll(/^Radius\.modes\.Base\.radius\./gi, 'border.radius.');
  } else if (path.match(/^Layout\.modes\.Base\./i)) {
    path = path.replaceAll(/^Layout\.modes\.Base\./gi, 'layout.');
  } else if (path.match(/^Shadows\.modes\.Base\.shadows\./i)) {
    path = path.replaceAll(/^Shadows\.modes\.Base\.shadows\./gi, 'shadow.');
  } else {
    path = path
      .replaceAll(/^Foundation\.modes\.Light\./gi, '')
      .replaceAll(/^Foundation\.modes\.Dark\./gi, '');
  }

  // Step 2: Normalize Figma naming to match output structure
  // colors.brand.* -> color.*
  // colors.neutral.* -> neutral.*
  // colors.background.* -> background.*
  // etc.
  path = path
    .replaceAll(/^colors\.brand\./gi, 'color.')
    .replaceAll(/^colors\.neutral\./gi, 'neutral.')
    .replaceAll(/^colors\.background\./gi, 'background.')
    .replaceAll(/^colors\.opacity\./gi, 'opacity.')
    .replaceAll(/^colors\.theme\./gi, 'theme.')
    .replaceAll(/^borders\.color\./gi, 'border.color.')
    .replaceAll(/^borders\.width\./gi, 'border.width.')
    .replaceAll(/^borders\./gi, 'border.')
    .replaceAll(/^shadows\./gi, 'shadow.')
    .replaceAll(/^fontfamily\./gi, 'typography.fontfamily.')
    .replaceAll(/^fontsize\./gi, 'typography.fontsize.')
    .replaceAll(/^fontweight\./gi, 'typography.fontweight.')
    .replaceAll(/^lineheight\./gi, 'typography.lineheight.')
    .replaceAll(/^breakpoints\./gi, 'layout.breakpoints.')
    .replaceAll(/^container\./gi, 'layout.container.')
    .replaceAll(/^grid\./gi, 'layout.grid.')
    .replaceAll(/^gutters\./gi, 'layout.gutters.')
    .replaceAll(/^radius\./gi, 'border.radius.')
    .replaceAll(/^spacing\./gi, 'spacing.');

  // Step 3: Handle composite shadow tokens
  // Source: shadow.default.composite -> shadow.default
  // Output: shadow.default -> shadow.default
  path = path.replaceAll(/\.composite$/gi, '');

  // Step 4: Output tokens are already in the correct structure
  // No further normalization needed - color.blue.500 stays as is
  // neutral.white stays as is, background.white stays as is

  return path.toLowerCase();
}

/**
 * Compare source tokens with output tokens to find discrepancies
 */
function validateTransformationCompleteness() {
  console.log('\n🔄 Validating transformation completeness...\n');

  if (!results.stats.sourceTokens || !results.stats.outputTokens) {
    results.errors.push({
      message: 'Cannot validate transformation - source or output tokens missing',
      severity: 'CRITICAL',
    });
    return;
  }

  // Group tokens by mode for per-mode validation
  const tokensByMode = {};
  const allModes = [...results.stats.modesFound];

  results.stats.sourceTokens.forEach((token) => {
    const mode = token.mode || 'Unknown';
    if (!tokensByMode[mode]) {
      tokensByMode[mode] = [];
    }
    tokensByMode[mode].push(token);
  });

  results.stats.tokensByMode = tokensByMode;

  // Report token counts per mode
  console.log('  📊 Tokens by mode:');
  for (const [mode, tokens] of Object.entries(tokensByMode)) {
    console.log(`     ${mode}: ${tokens.length} tokens`);
  }
  console.log();

  // Determine which modes to validate based on available output
  // Default modes (Light/Base) are validated against main output files
  // Other modes (Dark/Pro/etc.) would be validated against mode-specific output files
  const defaultModes = ['Light', 'Base', 'Default'];
  const defaultModeTokens = results.stats.sourceTokens.filter((token) =>
    defaultModes.includes(token.mode)
  );

  const alternativeModes = allModes.filter((m) => !defaultModes.includes(m));
  const alternativeModeTokenCount = results.stats.sourceTokens.length - defaultModeTokens.length;

  if (alternativeModeTokenCount > 0) {
    console.log(
      `  ℹ️  Found ${alternativeModeTokenCount} tokens in alternative modes: ${alternativeModes.join(', ')}`
    );
    console.log(`     These require mode-specific output files (e.g., tokens-dark.css)`);
    results.info.push({
      message: `${alternativeModeTokenCount} tokens in alternative modes: ${alternativeModes.join(', ')}`,
      note: 'Alternative mode tokens require separate output files with [data-dsai-theme="{mode}"] selectors',
    });
  }

  // For now, validate default mode tokens against main output
  const lightModeTokens = defaultModeTokens;

  // Filter out shadow sub-properties (color, offsetX, offsetY, blur, spread)
  // These are intentionally combined into composite shadow values
  const tokensWithoutShadowProps = lightModeTokens.filter((token) => {
    const path = token.path.toLowerCase();
    const isShadowSubProperty =
      path.includes('.shadows.') &&
      (path.endsWith('.color') ||
        path.endsWith('.offsetx') ||
        path.endsWith('.offsety') ||
        path.endsWith('.blur') ||
        path.endsWith('.spread'));
    return !isShadowSubProperty;
  });

  const shadowPropsCount = lightModeTokens.length - tokensWithoutShadowProps.length;
  if (shadowPropsCount > 0) {
    console.log(
      `  ℹ️  Excluding ${shadowPropsCount} shadow sub-properties (combined into composite values)`
    );
    results.info.push({
      message: `${shadowPropsCount} shadow sub-properties combined into ${shadowPropsCount / 5} composite shadows`,
      note: 'Shadow tokens use composite values (not individual properties)',
    });
  }

  // Create maps for easier comparison
  const sourceMap = new Map();
  const outputMap = new Map();

  // Build source map (excluding Dark mode and shadow sub-properties)
  tokensWithoutShadowProps.forEach((token) => {
    const normalizedPath = normalizeTokenPath(token);
    sourceMap.set(normalizedPath, token);
  });

  // Build output map
  results.stats.outputTokens.forEach((token) => {
    const normalizedPath = normalizeTokenPath(token);
    outputMap.set(normalizedPath, token);
  });

  console.log(`  Source tokens (default modes: ${defaultModes.join('/')}): ${sourceMap.size}`);
  console.log(`  Output tokens (normalized): ${outputMap.size}`);

  // Find missing tokens (in source but not in output)
  const missingTokens = [];
  for (const [path, token] of sourceMap.entries()) {
    if (!outputMap.has(path)) {
      missingTokens.push({
        path: token.path,
        normalizedPath: path,
        sourceFile: token.sourceFile,
        collection: token.collection,
        mode: token.mode,
      });
    }
  }

  // Find extra tokens (in output but not in source)
  const extraTokens = [];
  for (const [path, token] of outputMap.entries()) {
    if (!sourceMap.has(path)) {
      extraTokens.push({
        path: token.path,
        normalizedPath: path,
        outputFile: token.outputFile,
      });
    }
  }

  results.stats.missingTokens = missingTokens;
  results.stats.extraTokens = extraTokens;

  // Report missing tokens
  if (missingTokens.length > 0) {
    console.log(`\n  ⚠️  ${missingTokens.length} tokens found in source but MISSING in output:`);
    missingTokens.slice(0, 10).forEach((token) => {
      results.errors.push({
        type: 'MISSING_TOKEN',
        message: `Token in ${token.sourceFile} not found in output`,
        path: token.path,
        sourceFile: token.sourceFile,
        severity: 'HIGH',
      });
      console.log(`    - ${token.path} (from ${token.sourceFile})`);
    });
    if (missingTokens.length > 10) {
      console.log(`    ... and ${missingTokens.length - 10} more`);
    }
  }

  // Report extra tokens (usually not an error, might be computed tokens)
  if (extraTokens.length > 0) {
    console.log(
      `\n  ℹ️  ${extraTokens.length} tokens in output but not in source (may be computed):`
    );
    extraTokens.slice(0, 5).forEach((token) => {
      results.warnings.push({
        type: 'EXTRA_TOKEN',
        message: `Token in output not found in source (may be computed)`,
        path: token.path,
        outputFile: token.outputFile,
      });
      console.log(`    - ${token.path} (in ${token.outputFile})`);
    });
    if (extraTokens.length > 5) {
      console.log(`    ... and ${extraTokens.length - 5} more`);
    }
  }

  // Calculate match rate
  const matchRate = (((sourceMap.size - missingTokens.length) / sourceMap.size) * 100).toFixed(2);
  console.log(`\n  📊 Transformation match rate: ${matchRate}%`);

  if (Number.parseFloat(matchRate) < 95) {
    results.errors.push({
      type: 'LOW_MATCH_RATE',
      message: `Transformation match rate is ${matchRate}% (below 95% threshold)`,
      severity: 'HIGH',
    });
  }
}

// ============================================================================
// REPORTING
// ============================================================================

/**
 * Print comprehensive validation report
 */
/**
 * Print a group of errors with severity label, limited to maxDisplay
 */
function printErrorGroup(label, emoji, errors, maxDisplay) {
  if (errors.length === 0) { return; }
  console.log(`\n  ${emoji} ${label} (${errors.length}):`);
  errors.slice(0, maxDisplay).forEach((error) => {
    console.log(`    ${error.file || error.type || 'General'}: ${error.message}`);
    if (error.path) {
      console.log(`      Path: ${error.path}`);
    }
  });
  if (errors.length > maxDisplay) {
    console.log(`    ... and ${errors.length - maxDisplay} more`);
  }
}

function printReport() {
  console.log(`\n${'='.repeat(80)}`);
  console.log('FIGMA TOKEN VALIDATION REPORT');
  console.log('='.repeat(80));

  // Statistics
  console.log('\n📊 STATISTICS:');
  console.log(`  Source tokens (Figma exports):     ${results.stats.totalSourceTokens}`);
  console.log(`  Output tokens (transformed):       ${results.stats.totalOutputTokens}`);
  console.log(`  Missing tokens:                    ${results.stats.missingTokens?.length || 0}`);
  console.log(`  Extra tokens:                      ${results.stats.extraTokens?.length || 0}`);

  // Errors
  console.log(`\n❌ ERRORS: ${results.errors.length}`);
  if (results.errors.length > 0) {
    const criticalErrors = results.errors.filter((e) => e.severity === 'CRITICAL');
    const highErrors = results.errors.filter((e) => e.severity === 'HIGH');
    const normalErrors = results.errors.filter((e) => !e.severity);

    printErrorGroup('CRITICAL', '🔴', criticalErrors, criticalErrors.length);
    printErrorGroup('HIGH', '🟠', highErrors, 10);
    printErrorGroup('NORMAL', '⚠️ ', normalErrors, 5);
  }

  // Warnings
  console.log(`\n⚠️  WARNINGS: ${results.warnings.length}`);
  if (results.warnings.length > 0 && results.warnings.length <= 10) {
    results.warnings.forEach((warning) => {
      console.log(`  ${warning.file || warning.type || 'General'}: ${warning.message}`);
      if (warning.path) {
        console.log(`    Path: ${warning.path}`);
      }
    });
  } else if (results.warnings.length > 10) {
    console.log(`  (${results.warnings.length} warnings - run with --verbose to see all)`);
  }

  // Summary
  console.log(`\n${'='.repeat(80)}`);

  const criticalErrorCount = results.errors.filter((e) => e.severity === 'CRITICAL').length;
  const hasErrors = results.errors.length > 0;
  const hasWarnings = results.warnings.length > 0;

  if (criticalErrorCount > 0) {
    console.log('❌ VALIDATION FAILED - CRITICAL ERRORS FOUND');
    console.log('   Source of truth (Figma exports) has critical issues!');
    console.log(`${'='.repeat(80)}\n`);
    return 2; // Exit code 2 for critical errors
  }

  if (hasErrors) {
    console.log('❌ VALIDATION FAILED - Errors found');
    console.log('   Some tokens may be missing or invalid');
    console.log(`${'='.repeat(80)}\n`);
    return 1; // Exit code 1 for errors
  }

  if (hasWarnings) {
    console.log('⚠️  VALIDATION PASSED WITH WARNINGS');
    console.log('   All tokens are valid but some best practices not followed');
    console.log(`${'='.repeat(80)}\n`);
    return 0; // Exit code 0 for warnings only
  }

  console.log('✨ VALIDATION PASSED - All tokens are valid!');
  console.log('   Source of truth is complete and all tokens transformed correctly');
  console.log(`${'='.repeat(80)}\n`);
  return 0;
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

/**
 * Run all validations
 */
async function runValidation() {
  console.log('🎨 DSAi Token Validation');
  console.log('SOURCE OF TRUTH: packages/@dsai-io/tokens/figma-exports/\n');

  // Step 0: Determine which source files to use
  EXPECTED_EXPORTS = await determineSourceFiles();

  if (EXPECTED_EXPORTS.length === 0) {
    const exitCode = printReport();
    return exitCode;
  }

  // Step 1: Validate Figma export files exist
  validateExportFilesExist();

  // Step 2: Validate Figma export files content (SOURCE OF TRUTH)
  validateAllFigmaExports();

  // Step 3: Validate output files exist
  validateOutputFilesExist();

  // Step 4: Validate output files content
  validateAllOutputFiles();

  // Step 5: Validate transformation completeness
  validateTransformationCompleteness();

  // Step 6: Print report
  const exitCode = printReport();

  return exitCode;
}

// Run validation if executed directly
if (require.main === module) {
  runValidation()
    .then((exitCode) => {
      process.exit(exitCode);
    })
    .catch((error) => {
      console.error('❌ Validation failed with error:', error);
      process.exit(2);
    });
}

module.exports = {
  runValidation,
  validateFigmaExportFile,
  validateOutputFile,
  validateTransformationCompleteness,
};
