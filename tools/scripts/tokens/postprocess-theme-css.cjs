#!/usr/bin/env node
/**
 * Post-process Bootstrap theme CSS
 *
 * This script runs after Sass compilation to apply DSAi-specific transformations:
 * - Replaces `data-bs-theme` with `data-dsai-theme` for custom theme attribute
 *
 * Usage: node postprocess-theme-css.cjs
 *
 * @see README.md for documentation on theme attribute customization
 */

const fs = require('fs');
const path = require('path');

// Configuration
const TOKENS_DIST = path.resolve(__dirname, '../../../packages/@dsai/tokens/dist/css');
const FILES_TO_PROCESS = ['dsai-theme-bs.css', 'dsai-theme-bs.min.css'];

// Transformations to apply (add more as needed)
const TRANSFORMATIONS = [
  {
    name: 'Theme attribute',
    find: /data-bs-theme/g,
    replace: 'data-dsai-theme',
  },
];

/**
 * Apply all transformations to a CSS file
 */
function processFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️  File not found: ${filePath}`);
    return false;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  for (const transform of TRANSFORMATIONS) {
    const matches = content.match(transform.find);
    if (matches && matches.length > 0) {
      content = content.replace(transform.find, transform.replace);
      console.log(`   ✓ ${transform.name}: ${matches.length} replacement(s)`);
      modified = true;
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
  }

  return modified;
}

/**
 * Main entry point
 */
function main() {
  console.log('🔧 Post-processing Bootstrap theme CSS...\n');

  let totalModified = 0;

  for (const fileName of FILES_TO_PROCESS) {
    const filePath = path.join(TOKENS_DIST, fileName);
    console.log(`📄 ${fileName}`);

    if (processFile(filePath)) {
      totalModified++;
    } else {
      console.log('   (no changes needed)');
    }
  }

  console.log(`\n✅ Post-processing complete. ${totalModified} file(s) modified.`);
}

main();
