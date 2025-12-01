#!/usr/bin/env node

/**
 * Sync tokens-flat.ts from Style Dictionary output
 *
 * This script copies the generated tokens from dist/js/tokens.js
 * to src/tokens-flat.ts so that tsup can bundle them correctly.
 *
 * This ensures that when font families or other tokens change in Figma,
 * the changes automatically propagate to the TypeScript source.
 */

import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const tokensDir = join(__dirname, '../../../packages/@dsai/tokens');

const sourceFile = join(tokensDir, 'dist/js/tokens.js');
const targetFile = join(tokensDir, 'src/tokens-flat.ts');

console.log('🔄 Syncing tokens-flat.ts from Style Dictionary output...');

try {
  // Read the Style Dictionary generated file
  const sourceContent = readFileSync(sourceFile, 'utf-8');

  // The file is already valid ES6 exports, just need to add TS header
  const tsContent = `/**
 * Do not edit directly, this file was auto-generated.
 * Generated from Style Dictionary output (dist/js/tokens.js)
 *
 * To update: run \`pnpm tokens:build\` which will:
 * 1. Transform Figma tokens
 * 2. Build with Style Dictionary
 * 3. Sync this file automatically
 */

${sourceContent}`;

  // Write to TypeScript source
  writeFileSync(targetFile, tsContent);

  console.log('✅ Successfully synced tokens-flat.ts');
  console.log(`   Source: ${sourceFile}`);
  console.log(`   Target: ${targetFile}`);

  // Verify font families are correct
  if (sourceContent.includes("'Inter,")) {
    console.log('✅ Font family includes Inter');
  } else {
    console.warn('⚠️  Font family may be missing Inter!');
  }

  if (sourceContent.includes("'Roboto Mono,")) {
    console.log('✅ Font family includes Roboto Mono');
  } else {
    console.warn('⚠️  Font family may be missing Roboto Mono!');
  }
} catch (error) {
  console.error('❌ Failed to sync tokens-flat.ts:', error.message);
  process.exit(1);
}
