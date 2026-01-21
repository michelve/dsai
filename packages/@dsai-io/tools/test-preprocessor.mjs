#!/usr/bin/env node

/**
 * Test Mode Preprocessor
 *
 * Simple test to verify mode extraction from foundation.json
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { detectModes, extractMode, preprocessTokenFiles } from './dist/tokens/index.js';

const PLAYGROUND_ROOT = join(process.cwd(), '../../../apps/playground');
const SOURCE_DIR = join(PLAYGROUND_ROOT, 'src/figma-exports');
const FOUNDATION_FILE = join(SOURCE_DIR, 'foundation.json');

console.log('\n🔍 Testing Mode Preprocessor\n');
console.log('='.repeat(60));

// Test 1: Detect modes in foundation.json
console.log('\n1. Detecting modes in foundation.json...');
try {
  const content = readFileSync(FOUNDATION_FILE, 'utf-8');
  const tokens = JSON.parse(content);

  const modes = detectModes(tokens);
  console.log(`   ✅ Found ${modes.length} modes:`, modes);
} catch (error) {
  console.error('   ❌ Failed to detect modes:', error.message);
}

// Test 2: Extract Light mode
console.log('\n2. Extracting Light mode...');
try {
  const content = readFileSync(FOUNDATION_FILE, 'utf-8');
  const tokens = JSON.parse(content);

  const result = extractMode(tokens, {
    modeName: 'Light',
    modesPath: ['Foundation', 'modes'],
  });

  console.log(`   ✅ Light mode extracted: ${result.hasTokens ? 'YES' : 'NO'}`);
  if (result.hasTokens) {
    const tokenCount = JSON.stringify(result.tokens).length;
    console.log(`   📊 Token data size: ${(tokenCount / 1024).toFixed(2)}KB`);
  }
} catch (error) {
  console.error('   ❌ Failed to extract Light mode:', error.message);
}

// Test 3: Extract Dark mode
console.log('\n3. Extracting Dark mode...');
try {
  const content = readFileSync(FOUNDATION_FILE, 'utf-8');
  const tokens = JSON.parse(content);

  const result = extractMode(tokens, {
    modeName: 'Dark',
    modesPath: ['Foundation', 'modes'],
  });

  console.log(`   ✅ Dark mode extracted: ${result.hasTokens ? 'YES' : 'NO'}`);
  if (result.hasTokens) {
    const tokenCount = JSON.stringify(result.tokens).length;
    console.log(`   📊 Token data size: ${(tokenCount / 1024).toFixed(2)}KB`);
  }
} catch (error) {
  console.error('   ❌ Failed to extract Dark mode:', error.message);
}

// Test 4: Full preprocessing
console.log('\n4. Testing full preprocessing workflow...');
try {
  const result = preprocessTokenFiles({
    sourceDir: SOURCE_DIR,
    outputDir: join(PLAYGROUND_ROOT, 'src/.preprocessed'),
    files: ['foundation.json'],
    modes: ['Light', 'Dark'],
    clean: true,
    verbose: true,
  });

  console.log(`\n   📊 Preprocessing Results:`);
  console.log(`      Total files: ${result.totalFiles}`);
  console.log(`      Success: ${result.successCount}`);
  console.log(`      Failed: ${result.failureCount}`);

  // Show extracted files
  for (const fileResult of result.files) {
    if (fileResult.success) {
      console.log(`\n   📄 ${fileResult.sourceFile.split('/').pop()}:`);
      for (const [mode, path] of fileResult.outputFiles.entries()) {
        console.log(`      → ${mode}: ${path.split('/').slice(-2).join('/')}`);
      }
    }
  }

  // Cleanup
  console.log(`\n   🧹 Cleaning up temporary files...`);
  result.cleanup();
  console.log(`   ✅ Cleanup complete`);
} catch (error) {
  console.error('   ❌ Preprocessing failed:', error.message);
  console.error(error.stack);
}

console.log('\n' + '='.repeat(60));
console.log('✅ Test complete!\n');
