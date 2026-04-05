#!/usr/bin/env node
/**
 * Phase 1: Figma Export Audit
 * Validates the structure and modes in Figma export files
 */

const fs = require('node:fs');
const path = require('node:path');

const EXPORTS_DIR = path.join(__dirname, '../apps/playground/src/figma-exports');

// Helper function to count tokens recursively
function countTokens(obj) {
  if (!obj || typeof obj !== 'object') {
    return 0;
  }
  let count = 0;
  for (const value of Object.values(obj)) {
    if (value && typeof value === 'object') {
      if (value.$value === undefined) {
        count += countTokens(value);
      } else {
        count++;
      }
    }
  }
  return count;
}

console.log('='.repeat(80));
console.log('PHASE 1: FIGMA EXPORT AUDIT');
console.log('='.repeat(80));
console.log('');

// List all export files
console.log('📁 Figma Export Files:');
const files = fs.readdirSync(EXPORTS_DIR).filter((f) => f.endsWith('.json'));
files.forEach((file) => {
  const stats = fs.statSync(path.join(EXPORTS_DIR, file));
  const sizeKB = (stats.size / 1024).toFixed(2);
  console.log(`   ${file.padEnd(25)} ${sizeKB.padStart(10)} KB`);
});
console.log('');

// Check modes in each collection
console.log('🎨 Mode Detection:');
const collections = [
  'foundation',
  'typography',
  'spacing',
  'shadows',
  'radius',
  'layout',
  'border',
  'icon',
];

for (const collection of collections) {
  const filePath = path.join(EXPORTS_DIR, `${collection}.json`);
  if (!fs.existsSync(filePath)) {
    console.log(`   ${collection.padEnd(20)} ❌ File not found`);
    continue;
  }

  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(content);

    // Find the first key (collection name)
    const collectionName = Object.keys(data)[0];
    const collectionData = data[collectionName];

    if (collectionData?.modes) {
      const modes = Object.keys(collectionData.modes);
      console.log(`   ${collection.padEnd(20)} ✅ Modes: ${modes.join(', ')}`);
    } else {
      console.log(`   ${collection.padEnd(20)} ⚠️  No modes structure`);
    }
  } catch {
    console.log(`   ${collection.padEnd(20)} ❌ Parse error`);
  }
}
console.log('');

// Check foundation.json in detail
console.log('🔍 Foundation.json Deep Dive:');
try {
  const foundationPath = path.join(EXPORTS_DIR, 'foundation.json');
  const foundation = JSON.parse(fs.readFileSync(foundationPath, 'utf8'));
  const modes = foundation.Foundation.modes;

  for (const [modeName, modeData] of Object.entries(modes)) {
    console.log(`\n   Mode: ${modeName}`);

    // Count tokens in colors
    if (modeData.colors) {
      const tokenCount = countTokens(modeData.colors);
      console.log(`      Color tokens: ${tokenCount}`);
    }

    // Check for numeric keys
    const jsonStr = JSON.stringify(modeData.colors || {});
    const numericKeys = jsonStr.match(/"(\d+)":/g) || [];
    const uniqueNumeric = [...new Set(numericKeys)].slice(0, 10);
    if (uniqueNumeric.length > 0) {
      console.log(
        `      Numeric keys found: ${uniqueNumeric.join(', ')}${uniqueNumeric.length > 10 ? '...' : ''}`
      );
    }
  }
} catch (error) {
  console.log(`   ❌ Error analyzing foundation.json: ${error.message}`);
}

console.log('');
console.log('='.repeat(80));
console.log('✅ Phase 1 Audit Complete');
console.log('='.repeat(80));
