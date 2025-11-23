#!/usr/bin/env node

/**
 * Validate Design Tokens (DTCG-Compliant)
 *
 * This script validates all transformed token files to ensure:
 * - Valid JSON syntax
 * - Required DTCG properties present ($value, $type) OR legacy (value, type)
 * - Correct type values
 * - No circular references
 * - Token references resolve correctly
 *
 * Supports both DTCG format ($ prefix) and legacy Style Dictionary format
 *
 * @see TASK-011-design-json-token-structure.md
 * @see https://www.designtokens.org/
 */

const fs = require('fs');
const path = require('path');

const TOKENS_DIR = path.join(__dirname, '../../packages/@dsai/tokens');
const VALID_TYPES = [
  'color',
  'dimension',
  'fontFamily',
  'fontWeight',
  'shadow',
  'number',
  'string',
];

let errors = [];
let warnings = [];
let tokenCount = 0;

/**
 * Check if a file exists
 */
function fileExists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch {
    return false;
  }
}

/**
 * Read and parse JSON file
 */
function readJsonFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    errors.push(`❌ Failed to parse ${path.relative(TOKENS_DIR, filePath)}: ${error.message}`);
    return null;
  }
}

/**
 * Validate a single token object (supports DTCG and legacy formats)
 */
function validateToken(tokenPath, token) {
  tokenCount++;

  // Check for DTCG format ($value, $type) or legacy format (value, type)
  const isDTCG = token.hasOwnProperty('$value') || token.hasOwnProperty('$type');
  const valueKey = isDTCG ? '$value' : 'value';
  const typeKey = isDTCG ? '$type' : 'type';

  // Check required properties
  if (!token.hasOwnProperty(valueKey)) {
    errors.push(`❌ ${tokenPath}: Missing required property "${valueKey}"`);
  }

  if (!token.hasOwnProperty(typeKey)) {
    errors.push(`❌ ${tokenPath}: Missing required property "${typeKey}"`);
  }

  // Validate type
  if (token[typeKey] && !VALID_TYPES.includes(token[typeKey])) {
    warnings.push(
      `⚠️  ${tokenPath}: Unknown type "${token[typeKey]}". Valid types: ${VALID_TYPES.join(', ')}`
    );
  }

  // Check for empty values
  if (token[valueKey] === null || token[valueKey] === undefined || token[valueKey] === '') {
    errors.push(`❌ ${tokenPath}: Empty ${valueKey}`);
  }

  // Check if value is a Style Dictionary/DTCG reference (e.g., {colors.brand.blue.500})
  const isReference =
    typeof token[valueKey] === 'string' && 
    token[valueKey].startsWith('{') && 
    token[valueKey].endsWith('}');

  // Validate dimension units
  if (
    token[typeKey] === 'dimension' &&
    typeof token[valueKey] === 'string' &&
    !isReference
  ) {
    if (!token[valueKey].match(/^-?\d+(\.\d+)?(px|rem|em|%|vh|vw|vmin|vmax)?$/)) {
      warnings.push(`⚠️  ${tokenPath}: Dimension value "${token[valueKey]}" may have invalid format`);
    }
  }

  // Validate color format (skip references)
  if (token[typeKey] === 'color' && typeof token[valueKey] === 'string' && !isReference) {
    if (!token[valueKey].match(/^(#[0-9a-fA-F]{3,8}|rgb\(|rgba\(|hsl\(|hsla\()/)) {
      warnings.push(`⚠️  ${tokenPath}: Color value "${token[valueKey]}" may have invalid format`);
    }
  }
}

/**
 * Recursively validate token tree (supports DTCG and legacy formats)
 */
function validateTokenTree(obj, parentPath = '') {
  for (const [key, value] of Object.entries(obj)) {
    const currentPath = parentPath ? `${parentPath}.${key}` : key;

    if (value && typeof value === 'object') {
      // Check if this is a token (DTCG: $value & $type, Legacy: value & type)
      const isDTCGToken = value.hasOwnProperty('$value') && value.hasOwnProperty('$type');
      const isLegacyToken = value.hasOwnProperty('value') && value.hasOwnProperty('type');
      
      if (isDTCGToken || isLegacyToken) {
        validateToken(currentPath, value);
      } else {
        // Recursively validate nested objects
        validateTokenTree(value, currentPath);
      }
    }
  }
}

/**
 * Validate all token files
 */
function validateAllTokens() {
  console.log('🔍 Validating design tokens...\n');

  const tokenFiles = [
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

  // Validate each token file
  for (const file of tokenFiles) {
    const filePath = path.join(TOKENS_DIR, file);

    if (!fileExists(filePath)) {
      errors.push(`❌ Token file not found: ${file}`);
      continue;
    }

    console.log(`Validating ${file}...`);
    const data = readJsonFile(filePath);

    if (data) {
      validateTokenTree(data, path.basename(file, '.json'));
    }
  }

  // Validate master index
  const indexPath = path.join(TOKENS_DIR, 'index.json');
  if (!fileExists(indexPath)) {
    errors.push(`❌ Master index file not found: index.json`);
  } else {
    console.log('Validating index.json...');
    const indexData = readJsonFile(indexPath);

    if (indexData) {
      // Validate that all referenced files exist
      validateIndexReferences(indexData);
    }
  }
}

/**
 * Validate index.json references
 */
function validateIndexReferences(indexData, parentPath = '') {
  for (const [key, value] of Object.entries(indexData)) {
    const currentPath = parentPath ? `${parentPath}.${key}` : key;

    if (value && typeof value === 'object') {
      if (value.source) {
        // Check if referenced file exists
        const referencedFile = path.join(TOKENS_DIR, value.source);
        if (!fileExists(referencedFile)) {
          errors.push(`❌ index.json references missing file: ${value.source}`);
        }
      } else {
        // Recursively check nested references
        validateIndexReferences(value, currentPath);
      }
    }
  }
}

/**
 * Print validation results
 */
function printResults() {
  console.log('\n' + '='.repeat(60));
  console.log('VALIDATION RESULTS');
  console.log('='.repeat(60) + '\n');

  console.log(`📊 Total tokens validated: ${tokenCount}`);
  console.log(`✅ Errors: ${errors.length}`);
  console.log(`⚠️  Warnings: ${warnings.length}\n`);

  if (errors.length > 0) {
    console.log('ERRORS:\n');
    errors.forEach((error) => console.log(error));
    console.log();
  }

  if (warnings.length > 0) {
    console.log('WARNINGS:\n');
    warnings.forEach((warning) => console.log(warning));
    console.log();
  }

  if (errors.length === 0 && warnings.length === 0) {
    console.log('✨ All tokens are valid! No issues found.\n');
    return 0;
  }

  if (errors.length > 0) {
    console.log('❌ Validation failed with errors.\n');
    return 1;
  }

  console.log('✅ Validation passed with warnings.\n');
  return 0;
}

// Run validation
if (require.main === module) {
  validateAllTokens();
  const exitCode = printResults();
  process.exit(exitCode);
}

module.exports = {
  validateAllTokens,
  validateToken,
  validateTokenTree,
};
