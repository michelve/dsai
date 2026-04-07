const fs = require('node:fs');
const path = require('node:path');

/**
 * Parse markdown file to extract token descriptions
 * Format:
 * path.to.token.$description
 *     description=Text here
 */
function parseMarkdownDescriptions(mdContent) {
  const descriptions = {};
  const lines = mdContent.split('\n');

  let currentPath = null;

  for (const rawLine of lines) {
    const line = rawLine.trim();

    // Match path line (e.g., "light.colors.brand.blue.100.$description")
    if (line.endsWith('.$description') && !line.startsWith('description=')) {
      currentPath = line.replaceAll(/\.\$description$/g, '');
      continue;
    }

    // Match description line (e.g., "    description=Some text")
    if (currentPath && line.startsWith('description=')) {
      const description = line.replaceAll(/^description=/g, '').trim();
      descriptions[currentPath] = description;
      currentPath = null;
    }
  }

  return descriptions;
}

/**
 * Navigate nested object by dot-notation path
 */
function getByPath(obj, path) {
  const parts = path.split('.');
  let current = obj;

  for (const part of parts) {
    if (current[part] === undefined) {
      return undefined;
    }
    current = current[part];
  }

  return current;
}

/**
 * Set value in nested object by dot-notation path
 */
function _setByPath(obj, path, value) {
  const parts = path.split('.');
  let current = obj;

  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    if (current[part] === undefined) {
      current[part] = {};
    }
    current = current[part];
  }

  const lastPart = parts[parts.length - 1];
  current[lastPart] = value;
}

/**
 * Update JSON token file with descriptions from markdown
 */
function updateDescriptionsFromMarkdown(jsonPath, mdPath) {
  // Read files
  const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  const mdContent = fs.readFileSync(mdPath, 'utf8');

  // Parse markdown descriptions
  const descriptions = parseMarkdownDescriptions(mdContent);

  console.log(`Found ${Object.keys(descriptions).length} descriptions in ${path.basename(mdPath)}`);

  // Update JSON with descriptions
  let updatedCount = 0;
  let notFoundCount = 0;
  const notFoundPaths = [];

  for (const [mdPath, description] of Object.entries(descriptions)) {
    // Convert markdown path to JSON path
    // e.g., "light.colors.brand.blue.100" -> "Colors.modes.Light.colors.brand.blue.100"
    // or "dark.colors.theme.primary" -> "Colors.modes.Dark.colors.theme.primary"

    let jsonPath = mdPath;

    // Handle mode prefix (light/dark -> Light/Dark)
    if (mdPath.startsWith('light.')) {
      jsonPath = `Colors.modes.Light.${mdPath.substring(6)}`;
    } else if (mdPath.startsWith('dark.')) {
      jsonPath = `Colors.modes.Dark.${mdPath.substring(5)}`;
    }

    // Handle array-wrapped JSON (like colors.json)
    const data = Array.isArray(jsonData) ? jsonData[0] : jsonData;

    // Navigate to the token
    const token = getByPath(data, jsonPath);

    if (token && typeof token === 'object') {
      // Update the $description field
      token.$description = description;
      updatedCount++;
    } else {
      notFoundCount++;
      notFoundPaths.push(mdPath);
    }
  }

  // Write updated JSON back
  fs.writeFileSync(jsonPath, JSON.stringify(jsonData, null, 2), 'utf8');

  // Report results
  console.log(`✓ Updated ${updatedCount} token descriptions`);

  if (notFoundCount > 0) {
    console.log(`⚠ Warning: ${notFoundCount} paths not found in JSON:`);
    notFoundPaths.slice(0, 5).forEach((p) => {
      console.log(`  - ${p}`);
    });
    if (notFoundPaths.length > 5) {
      console.log(`  ... and ${notFoundPaths.length - 5} more`);
    }
  }

  console.log(`✓ Saved to ${jsonPath}`);

  return { updatedCount, notFoundCount };
}

/**
 * Process a collection by name
 */
function processCollection(collectionName) {
  const collectionsDir = path.join(__dirname, '../collections');
  const jsonPath = path.join(collectionsDir, `${collectionName}.json`);
  const mdPath = path.join(collectionsDir, `${collectionName}.md`);

  // Check if both files exist
  if (!fs.existsSync(jsonPath)) {
    console.error(`✗ JSON file not found: ${jsonPath}`);
    return false;
  }

  if (!fs.existsSync(mdPath)) {
    console.error(`✗ Markdown file not found: ${mdPath}`);
    return false;
  }

  console.log(`\nProcessing collection: ${collectionName}`);
  console.log('='.repeat(50));

  updateDescriptionsFromMarkdown(jsonPath, mdPath);

  return true;
}

/**
 * Process all collections in the directory
 */
function processAllCollections() {
  const collectionsDir = path.join(__dirname, '../collections');
  const files = fs.readdirSync(collectionsDir);

  // Find all .md files
  const mdFiles = files.filter((f) => f.endsWith('.md'));

  if (mdFiles.length === 0) {
    console.log('No markdown files found in collections directory');
    return;
  }

  console.log(`Found ${mdFiles.length} markdown file(s)\n`);

  let successCount = 0;

  for (const mdFile of mdFiles) {
    const collectionName = mdFile.replaceAll(/\.md$/g, '');
    if (processCollection(collectionName)) {
      successCount++;
    }
  }

  console.log(`\n${'='.repeat(50)}`);
  console.log(`Processed ${successCount}/${mdFiles.length} collections successfully`);
}

// Main execution
const args = process.argv.slice(2);

if (args.length === 0) {
  // No arguments - process all collections
  processAllCollections();
} else {
  // Process specific collection
  const collectionName = args[0];
  processCollection(collectionName);
}
