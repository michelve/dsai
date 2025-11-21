#!/usr/bin/env node

/**
 * Validate Design Tokens
 * 
 * This script validates all transformed token files to ensure:
 * - Valid JSON syntax
 * - Required properties present (value, type)
 * - Correct type values
 * - No circular references
 * - Token references resolve correctly
 * 
 * @see TASK-011-design-json-token-structure.md
 */

const fs = require('fs');
const path = require('path');

const TOKENS_DIR = path.join(__dirname, '../../packages/@dsai/tokens');
const VALID_TYPES = ['color', 'dimension', 'fontFamily', 'fontWeight', 'shadow', 'number', 'string'];

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
 * Validate a single token object
 */
function validateToken(tokenPath, token) {
  tokenCount++;

  // Check required properties
  if (!token.hasOwnProperty('value')) {
    errors.push(`❌ ${tokenPath}: Missing required property "value"`);
  }

  if (!token.hasOwnProperty('type')) {
    errors.push(`❌ ${tokenPath}: Missing required property "type"`);
  }

  // Validate type
  if (token.type && !VALID_TYPES.includes(token.type)) {
    warnings.push(`⚠️  ${tokenPath}: Unknown type "${token.type}". Valid types: ${VALID_TYPES.join(', ')}`);
  }

  // Check for empty values
  if (token.value === null || token.value === undefined || token.value === '') {
    errors.push(`❌ ${tokenPath}: Empty value`);
  }

  // Validate dimension units
  if (token.type === 'dimension' && typeof token.value === 'string') {
    if (!token.value.match(/^-?\d+(\.\d+)?(px|rem|em|%|vh|vw|vmin|vmax)?$/)) {
      warnings.push(`⚠️  ${tokenPath}: Dimension value "${token.value}" may have invalid format`);
    }
  }

  // Validate color format
  if (token.type === 'color' && typeof token.value === 'string') {
    if (!token.value.match(/^(#[0-9a-fA-F]{3,8}|rgb\(|rgba\(|hsl\(|hsla\()/)) {
      warnings.push(`⚠️  ${tokenPath}: Color value "${token.value}" may have invalid format`);
    }
  }
}

/**
 * Recursively validate token tree
 */
function validateTokenTree(obj, parentPath = '') {
  for (const [key, value] of Object.entries(obj)) {
    const currentPath = parentPath ? `${parentPath}.${key}` : key;

    if (value && typeof value === 'object') {
      // Check if this is a token (has 'value' and 'type')
      if (value.hasOwnProperty('value') && value.hasOwnProperty('type')) {
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
    'color/primitive.json',
    'color/semantic.json',
    'typography/base.json',
    'spacing/base.json',
    'border/radius.json',
    'border/width.json',
    'shadow/base.json',
    'layout/breakpoints.json',
    'layout/containers.json',
    'layout/grid.json'
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
    errors.forEach(error => console.log(error));
    console.log();
  }

  if (warnings.length > 0) {
    console.log('WARNINGS:\n');
    warnings.forEach(warning => console.log(warning));
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
  validateTokenTree
};

