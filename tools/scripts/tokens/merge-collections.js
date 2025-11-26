#!/usr/bin/env node

/**
 * Merge two Figma Tokens Studio collection files into one unified collection
 * Usage: node merge-collections.js <source1.json> <source2.json> <output.json>
 *
 * Features:
 * - Intelligently merges nested token structures
 * - Preserves all metadata ($codeSyntax, $scopes, $type, etc.)
 * - Maintains token references and aliases
 * - Handles mode-based tokens (Light Mode, Dark Mode)
 * - Deep merges sections without overwriting
 * - Normalizes reference format to lowercase {colors.path}
 * - Adds $libraryName and $collectionName to aliased tokens
 * - Sorts properties alphabetically for consistency
 * - Removes duplicate sections (like "hue" that duplicates "brand")
 */

const fs = require('fs');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);
if (args.length !== 3) {
  console.error('Usage: node merge-collections.js <source1.json> <source2.json> <output.json>');
  console.error(
    'Example: node merge-collections.js colors-scales.json colors.json merged-colors.json'
  );
  process.exit(1);
}

const [source1Path, source2Path, outputPath] = args;

/**
 * Check if an object is a token (has $type or $value)
 */
function isToken(obj) {
  return obj && typeof obj === 'object' && ('$type' in obj || '$value' in obj);
}

/**
 * Check if an object is a token group (has child tokens)
 */
function hasChildTokens(obj) {
  if (!obj || typeof obj !== 'object') return false;
  for (const key in obj) {
    if (!key.startsWith('$') && typeof obj[key] === 'object') {
      return true;
    }
  }
  return false;
}

/**
 * Deep merge two objects, preserving all properties
 * Arrays are concatenated, objects are recursively merged
 * Special handling: If target has child tokens and source is a token,
 * or vice versa, prioritize the structure with children
 */
function deepMerge(target, source) {
  const result = { ...target };

  // Check for conflict: one is a token, the other has child tokens
  const targetIsToken = isToken(target);
  const sourceIsToken = isToken(source);
  const targetHasChildren = hasChildTokens(target);
  const sourceHasChildren = hasChildTokens(source);

  if (targetHasChildren && sourceIsToken) {
    // Target has children (e.g., blue.100-900), source is a single token (e.g., blue.500)
    // Keep the children structure, skip the single token
    console.log(`  ⚠️  Skipping single token in favor of children structure`);
    return result;
  }

  if (sourceHasChildren && targetIsToken) {
    // Source has children, target is a single token
    // Keep the children structure from source
    console.log(`  ⚠️  Replacing single token with children structure`);
    return { ...source };
  }

  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      // Recursively merge nested objects
      result[key] = deepMerge(result[key] || {}, source[key]);
    } else if (Array.isArray(source[key])) {
      // Concatenate arrays (typically won't happen in token files)
      result[key] = [...(result[key] || []), ...source[key]];
    } else {
      // Overwrite primitive values (source takes precedence)
      result[key] = source[key];
    }
  }

  return result;
}

/**
 * Load and parse JSON file
 */
function loadJSON(filePath) {
  try {
    const fullPath = path.resolve(filePath);
    console.log(`📖 Reading: ${fullPath}`);
    const content = fs.readFileSync(fullPath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`❌ Error reading ${filePath}:`, error.message);
    process.exit(1);
  }
}

/**
 * Save JSON to file with pretty formatting
 */
function saveJSON(filePath, data) {
  try {
    const fullPath = path.resolve(filePath);
    const content = JSON.stringify(data, null, 2);
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`✅ Saved: ${fullPath}`);
    return true;
  } catch (error) {
    console.error(`❌ Error writing ${filePath}:`, error.message);
    process.exit(1);
  }
}

/**
 * Count tokens recursively in a nested structure
 */
function countTokens(obj, depth = 0) {
  let count = 0;

  for (const key in obj) {
    const value = obj[key];

    // Check if this is a token (has $type or $value)
    if (value && typeof value === 'object' && ('$type' in value || '$value' in value)) {
      count++;
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      // Recursively count nested tokens
      count += countTokens(value, depth + 1);
    }
  }

  return count;
}

/**
 * Update token references to match new collection name
 * Recursively updates all {oldName.path} references to {newName.path}
 * Handles case-insensitive matching for collection names
 * Normalizes to lowercase format: {colors.path} instead of {Colors.path}
 * Adds $libraryName and $collectionName metadata to aliased tokens
 */
function updateReferences(obj, oldName, newName, collectionName) {
  // Create regex patterns for matching various case formats
  const patterns = [
    `{${oldName}.`, // Exact match
    `{${oldName.toLowerCase()}.`, // lowercase
    `{${oldName.replace(/\s+/g, '')}.`, // No spaces
    `{${oldName.replace(/\s+/g, '').toLowerCase()}.`, // No spaces, lowercase
  ];

  for (const key in obj) {
    const value = obj[key];

    if (typeof value === 'string' && value.startsWith('{') && value.endsWith('}')) {
      // This is a token reference - normalize to lowercase
      const normalizedRef = `{${newName.toLowerCase().replace(/\s+/g, '')}.`;

      for (const pattern of patterns) {
        if (value.startsWith(pattern)) {
          obj[key] = value.replace(pattern, normalizedRef);
          break;
        }
      }

      // Add metadata for aliased tokens (references to other tokens)
      if (obj[key].startsWith('{')) {
        if (!obj.$libraryName) obj.$libraryName = '';
        if (!obj.$collectionName) obj.$collectionName = collectionName;
      }
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      // Recursively update nested objects
      updateReferences(value, oldName, newName, collectionName);
    }
  }
}

/**
 * Sort object properties alphabetically, with $ properties first
 */
function sortProperties(obj) {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
    return obj;
  }

  const sorted = {};
  const keys = Object.keys(obj).sort((a, b) => {
    // $ properties first, then alphabetically
    const aIsMeta = a.startsWith('$');
    const bIsMeta = b.startsWith('$');
    if (aIsMeta && !bIsMeta) return -1;
    if (!aIsMeta && bIsMeta) return 1;
    return a.localeCompare(b);
  });

  for (const key of keys) {
    sorted[key] = sortProperties(obj[key]);
  }

  return sorted;
}

/**
 * Validate and fix token references
 * Ensures references point to actual tokens, adds .500 if referencing color groups
 */
function validateReferences(obj, collectionData, path = []) {
  for (const key in obj) {
    if (key.startsWith('$')) continue;

    const value = obj[key];

    if (typeof value === 'string' && value.startsWith('{') && value.endsWith('}')) {
      // This is a reference - validate it exists
      const refPath = value.slice(1, -1).split('.');

      // Navigate through collection to check if reference exists
      let target = collectionData;
      let foundToken = true;

      for (let i = 1; i < refPath.length; i++) {
        // Skip first part (collection name)
        if (target && target[refPath[i]]) {
          target = target[refPath[i]];
        } else {
          foundToken = false;
          break;
        }
      }

      // If reference points to a group (not a token), try adding .500
      if (target && typeof target === 'object' && !('$value' in target) && target['500']) {
        console.log(`  🔧 Fixing reference: ${value} → ${value.slice(0, -1)}.500}`);
        obj[key] = `${value.slice(0, -1)}.500}`;
      }
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      validateReferences(value, collectionData, [...path, key]);
    }
  }
}

/**
 * Check if a section is a duplicate/alias section
 * (e.g., "hue" that just references "brand")
 */
function isDuplicateSection(obj) {
  if (!obj || typeof obj !== 'object') return false;

  let hasOnlyReferences = true;
  let referenceCount = 0;

  function checkReferences(item) {
    for (const key in item) {
      if (key.startsWith('$')) continue;

      const value = item[key];
      if (value && typeof value === 'object') {
        if ('$value' in value) {
          referenceCount++;
          if (typeof value.$value === 'string' && value.$value.startsWith('{')) {
            // This is a reference
            continue;
          } else {
            // This has a direct value
            hasOnlyReferences = false;
            return;
          }
        }
        checkReferences(value);
      }
    }
  }

  checkReferences(obj);
  return hasOnlyReferences && referenceCount > 10; // Only remove if significant section
}

/**
 * Get collection name from file structure
 */
function getCollectionName(data) {
  if (Array.isArray(data) && data[0]) {
    const keys = Object.keys(data[0]);
    return keys[0];
  }
  return null;
}

/**
 * Main merge logic
 */
function mergeCollections() {
  console.log('🔄 Starting merge process...\n');

  // Load both source files
  const data1 = loadJSON(source1Path);
  const data2 = loadJSON(source2Path);

  // Validate structure (should be arrays with collection objects)
  if (!Array.isArray(data1) || !Array.isArray(data2)) {
    console.error('❌ Error: Both files must be arrays containing collection objects');
    process.exit(1);
  }

  const collection1 = data1[0];
  const collection2 = data2[0];

  if (!collection1 || !collection2) {
    console.error('❌ Error: Invalid collection structure');
    process.exit(1);
  }

  const name1 = getCollectionName(data1);
  const name2 = getCollectionName(data2);

  console.log(`📦 Collection 1: "${name1}" (${countTokens(collection1)} tokens)`);
  console.log(`📦 Collection 2: "${name2}" (${countTokens(collection2)} tokens)`);
  console.log();

  // Decide on unified collection name (prefer shorter or "Colors" if available)
  const unifiedName = name2 === 'Colors' ? name2 : name1.length < name2.length ? name1 : name2;
  console.log(`🎯 Unified collection name: "${unifiedName}"`);
  console.log();

  // Deep merge the collections
  console.log('🔀 Merging structures...');
  const mergedCollection = deepMerge(collection1[name1], collection2[name2]);

  // Remove duplicate sections (like "hue" that just references "brand")
  console.log('🗑️  Checking for duplicate sections...');
  const modes = mergedCollection.modes || {};
  for (const modeName in modes) {
    const mode = modes[modeName];
    const colors = mode.colors || {};

    for (const sectionName in colors) {
      if (isDuplicateSection(colors[sectionName])) {
        console.log(`  ⚠️  Removing duplicate section: ${sectionName} (contains only references)`);
        delete colors[sectionName];
      }
    }
  }

  // Update references to match unified collection name (lowercase)
  console.log(
    `🔗 Normalizing references to lowercase "{${unifiedName.toLowerCase().replace(/\s+/g, '')}.}" format...`
  );
  updateReferences(mergedCollection, name1, unifiedName, unifiedName);
  updateReferences(mergedCollection, name2, unifiedName, unifiedName);

  // Validate and fix references (add .500 to color group references)
  console.log('✅ Validating token references...');
  const lightMode = mergedCollection.modes?.['Light Mode'];
  if (lightMode) {
    validateReferences(lightMode, lightMode);
  }

  // Sort properties alphabetically for consistency
  console.log('📋 Sorting properties alphabetically...');
  const sortedCollection = sortProperties(mergedCollection);

  // Count tokens in merged result
  const mergedCount = countTokens(sortedCollection);
  console.log(`✨ Merged collection: ${mergedCount} tokens`);
  console.log();

  // Create output structure
  const output = [
    {
      [unifiedName]: sortedCollection,
    },
  ];

  // Save merged file
  saveJSON(outputPath, output);

  console.log('\n✅ Merge complete!');
  console.log(`📊 Summary:`);
  console.log(`   Source 1: ${countTokens(collection1)} tokens`);
  console.log(`   Source 2: ${countTokens(collection2)} tokens`);
  console.log(`   Merged:   ${mergedCount} tokens`);
}

// Execute
try {
  mergeCollections();
} catch (error) {
  console.error('❌ Unexpected error:', error.message);
  console.error(error.stack);
  process.exit(1);
}
