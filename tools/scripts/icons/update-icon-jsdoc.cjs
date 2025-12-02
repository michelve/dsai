#!/usr/bin/env node

/**
 * Update Icon Component JSDoc Comments with Metadata
 *
 * Updates existing icon component files with enriched JSDoc comments
 * including categories, tags, and direct links from Bootstrap Icons.
 *
 * Usage:
 *   node tools/scripts/icons/update-icon-jsdoc.cjs
 *
 * Prerequisites:
 *   Run `node tools/scripts/icons/fetch-icon-metadata.cjs` first to fetch metadata.
 *
 * @packageDocumentation
 */

const fs = require('fs');
const path = require('path');

// Paths
const ICONS_DIR = path.join(
  __dirname,
  '../../../packages/@dsai/react/src/components/Icon/components'
);
const METADATA_FILE = path.join(__dirname, 'icon-metadata.json');

/**
 * Load icon metadata from JSON file
 * @returns {{icons: Record<string, {title: string, categories: string[], tags: string[], url: string}>} | null}
 */
function loadMetadata() {
  try {
    if (fs.existsSync(METADATA_FILE)) {
      const data = fs.readFileSync(METADATA_FILE, 'utf-8');
      return JSON.parse(data);
    }
    console.error('❌ No metadata file found. Run fetch-icon-metadata.js first.');
    return null;
  } catch (error) {
    console.error(`❌ Error loading metadata: ${error.message}`);
    return null;
  }
}

/**
 * Convert PascalCase component name to kebab-case icon name
 * @param {string} componentName - e.g., "ActivityIcon" or "Icon123Icon"
 * @returns {string} - e.g., "activity" or "123"
 */
function componentNameToIconName(componentName) {
  // Remove 'Icon' suffix
  let name = componentName.replace(/Icon$/, '');

  // Handle numeric prefixes (Icon123 -> 123)
  if (name.startsWith('Icon') && /^\d/.test(name.slice(4))) {
    name = name.slice(4);
  }

  // Convert PascalCase to kebab-case
  return name
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();
}

/**
 * Generate new JSDoc comment with metadata
 * @param {string} componentName - React component name
 * @param {{title: string, categories: string[], tags: string[], url: string} | null} iconMeta - Icon metadata
 * @returns {string}
 */
function generateJSDoc(componentName, iconMeta) {
  const title = iconMeta?.title || componentName.replace(/Icon$/, '');
  const url = iconMeta?.url || 'https://icons.getbootstrap.com/';
  const categories = iconMeta?.categories || [];
  const tags = iconMeta?.tags || [];

  // Build description with metadata
  let description = `${componentName}\n *\n * Bootstrap Icons - ${title}`;

  if (categories.length > 0) {
    description += `\n * @category ${categories.join(', ')}`;
  }

  if (tags.length > 0) {
    description += `\n * @tags ${tags.join(', ')}`;
  }

  return `/**
 * ${description}
 * @see ${url}
 *
 * @accessibility
 * - Decorative (default): No aria-label or title → aria-hidden="true"
 * - Semantic: Pass aria-label for screen reader announcement
 * - With title: Renders <title> element inside SVG
 *
 * @example Decorative (inside Button)
 * \`\`\`tsx
 * <Button startIcon={<${componentName} />}>Click me</Button>
 * \`\`\`
 *
 * @example Semantic (standalone)
 * \`\`\`tsx
 * <${componentName} aria-label="${title}" />
 * \`\`\`
 */`;
}

/**
 * Update JSDoc in an existing component file
 * @param {string} filePath - Path to component file
 * @param {{title: string, categories: string[], tags: string[], url: string} | null} iconMeta - Icon metadata
 * @returns {boolean} - Whether the file was updated
 */
function updateComponentJSDoc(filePath, iconMeta) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const componentName = path.basename(filePath, '.tsx');

    // Match existing JSDoc comment at start of file
    const jsDocPattern = /^\/\*\*[\s\S]*?\*\//;
    const match = content.match(jsDocPattern);

    if (!match) {
      console.warn(`  ⚠️  No JSDoc found in ${componentName}`);
      return false;
    }

    const newJSDoc = generateJSDoc(componentName, iconMeta);
    const newContent = content.replace(jsDocPattern, newJSDoc);

    // Only write if content changed
    if (newContent !== content) {
      fs.writeFileSync(filePath, newContent);
      return true;
    }

    return false;
  } catch (error) {
    console.error(`  ❌ Error updating ${path.basename(filePath)}: ${error.message}`);
    return false;
  }
}

/**
 * Main function
 */
async function main() {
  console.log('🎨 Updating Icon Component JSDoc Comments\n');
  console.log('━'.repeat(50));

  // Load metadata
  console.log('\n📚 Loading metadata...');
  const metadata = loadMetadata();
  if (!metadata) {
    process.exit(1);
  }
  console.log(`   Found metadata for ${metadata.totalIcons} icons`);

  // Get all component files
  const files = fs.readdirSync(ICONS_DIR).filter((f) => f.endsWith('.tsx'));
  console.log(`\n📁 Found ${files.length} icon components`);

  let updatedCount = 0;
  let skippedCount = 0;
  let withMetadataCount = 0;
  let noMetadataCount = 0;

  console.log('\n📝 Updating JSDoc comments...\n');

  for (const file of files) {
    const filePath = path.join(ICONS_DIR, file);
    const componentName = file.replace('.tsx', '');
    const iconName = componentNameToIconName(componentName);

    // Get metadata for this icon
    const iconMeta = metadata.icons[iconName] || null;

    if (iconMeta) {
      withMetadataCount++;
    } else {
      noMetadataCount++;
      // Try alternative name formats
      const altNames = [
        iconName.replace(/-fill$/, ''),
        iconName.replace(/-fill$/, '') + '-fill',
        iconName.replace(/^icon-?/, ''),
      ];

      for (const altName of altNames) {
        if (metadata.icons[altName]) {
          // Use the found metadata
          const updated = updateComponentJSDoc(filePath, metadata.icons[altName]);
          if (updated) {
            updatedCount++;
            process.stdout.write('.');
          } else {
            skippedCount++;
          }
          continue;
        }
      }
    }

    const updated = updateComponentJSDoc(filePath, iconMeta);
    if (updated) {
      updatedCount++;
      process.stdout.write('.');
    } else {
      skippedCount++;
    }

    // Progress indicator every 100 files
    if ((updatedCount + skippedCount) % 100 === 0) {
      process.stdout.write(` ${updatedCount + skippedCount}/${files.length}\n`);
    }
  }

  // Summary
  console.log('\n\n━'.repeat(50));
  console.log('✅ Update complete!\n');
  console.log(`   📦 Total components: ${files.length}`);
  console.log(`   ✏️  Updated: ${updatedCount}`);
  console.log(`   ⏭️  Unchanged: ${skippedCount}`);
  console.log(`   📚 With metadata: ${withMetadataCount}`);
  console.log(`   ⚠️  No metadata: ${noMetadataCount}`);
  console.log('\n');
}

main().catch(console.error);
