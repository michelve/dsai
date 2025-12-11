#!/usr/bin/env node

/**
 * Bootstrap Icons Metadata Fetcher
 *
 * Fetches icon metadata (tags, categories) from the Bootstrap Icons GitHub repository.
 * Outputs a JSON file that can be used by the icon generator to enrich JSDoc comments.
 *
 * Usage:
 *   node tools/scripts/icons/fetch-icon-metadata.cjs
 *
 * Output:
 *   tools/scripts/icons/icon-metadata.json
 *
 * @packageDocumentation
 */

const fs = require('node:fs');
const path = require('node:path');
const https = require('node:https');

// Configuration
const _GITHUB_API_BASE = 'https://api.github.com';
const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com/twbs/icons/main';
const ICONS_CONTENT_PATH = '/docs/content/icons';
const OUTPUT_FILE = path.join(__dirname, 'icon-metadata.json');

// Rate limiting configuration
const BATCH_SIZE = 50; // Process icons in batches
const BATCH_DELAY_MS = 1000; // Delay between batches to avoid rate limits
const REQUEST_TIMEOUT_MS = 10000;

/**
 * Make an HTTPS GET request with timeout
 * @param {string} url - URL to fetch
 * @param {object} headers - Request headers
 * @returns {Promise<{statusCode: number, data: string}>}
 */
function httpsGet(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: 'GET',
      headers: {
        'User-Agent': 'DSAi-Icon-Metadata-Fetcher/1.0',
        Accept: 'application/json',
        ...headers,
      },
      timeout: REQUEST_TIMEOUT_MS,
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve({ statusCode: res.statusCode, data }));
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error(`Request timeout: ${url}`));
    });
    req.end();
  });
}

/**
 * Parse YAML frontmatter from markdown content
 * @param {string} content - Markdown file content
 * @returns {{title?: string, categories?: string[], tags?: string[]}}
 */
function parseFrontmatter(content) {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) {
    return {};
  }

  const yaml = frontmatterMatch[1];
  const result = {};

  // Parse title
  const titleMatch = yaml.match(/^title:\s*(.+)$/m);
  if (titleMatch) {
    result.title = titleMatch[1].trim();
  }

  // Parse categories - look for categories: followed by list items until next field or end
  const categoriesMatch = yaml.match(/^categories:\s*\n((?:\s+-\s+.+\n?)+)/m);
  if (categoriesMatch) {
    result.categories = categoriesMatch[1]
      .split('\n')
      .map((line) => line.replace(/^\s+-\s+/, '').trim())
      .filter(Boolean);
  }

  // Parse tags - look for tags: followed by list items until next field or end
  const tagsMatch = yaml.match(/^tags:\s*\n((?:\s+-\s+.+\n?)+)/m);
  if (tagsMatch) {
    result.tags = tagsMatch[1]
      .split('\n')
      .map((line) => line.replace(/^\s+-\s+/, '').trim())
      .filter(Boolean);
  }

  return result;
}

/**
 * Fetch icon metadata from a single markdown file
 * @param {string} iconName - Icon name (kebab-case)
 * @returns {Promise<{name: string, title?: string, categories?: string[], tags?: string[], url: string} | null>}
 */
async function fetchIconMetadata(iconName) {
  const url = `${GITHUB_RAW_BASE}${ICONS_CONTENT_PATH}/${iconName}.md`;
  const iconUrl = `https://icons.getbootstrap.com/icons/${iconName}/`;

  try {
    const { statusCode, data } = await httpsGet(url);

    if (statusCode === 404) {
      // Icon file doesn't exist in docs (rare but possible)
      return {
        name: iconName,
        url: iconUrl,
        categories: [],
        tags: [],
      };
    }

    if (statusCode !== 200) {
      console.warn(`  ⚠️  HTTP ${statusCode} for ${iconName}`);
      return null;
    }

    const frontmatter = parseFrontmatter(data);

    return {
      name: iconName,
      title: frontmatter.title || iconName,
      categories: frontmatter.categories || [],
      tags: frontmatter.tags || [],
      url: iconUrl,
    };
  } catch (error) {
    console.warn(`  ⚠️  Error fetching ${iconName}: ${error.message}`);
    return null;
  }
}

/**
 * Get list of all Bootstrap icons from the JSON file
 * @returns {Promise<string[]>}
 */
async function getIconList() {
  const url = `${GITHUB_RAW_BASE}/font/bootstrap-icons.json`;

  try {
    const { statusCode, data } = await httpsGet(url);

    if (statusCode !== 200) {
      throw new Error(`HTTP ${statusCode}`);
    }

    const iconMap = JSON.parse(data);
    return Object.keys(iconMap).sort();
  } catch (error) {
    throw new Error(`Failed to fetch icon list: ${error.message}`);
  }
}

/**
 * Sleep for a given number of milliseconds
 * @param {number} ms - Milliseconds to sleep
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Process icons in batches with progress reporting
 * @param {string[]} iconNames - List of icon names
 * @returns {Promise<object[]>}
 */
async function processIconsInBatches(iconNames) {
  const results = [];
  const totalBatches = Math.ceil(iconNames.length / BATCH_SIZE);

  console.log(`\n📊 Processing ${iconNames.length} icons in ${totalBatches} batches...\n`);

  for (let i = 0; i < iconNames.length; i += BATCH_SIZE) {
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const batch = iconNames.slice(i, i + BATCH_SIZE);

    process.stdout.write(`  Batch ${batchNum}/${totalBatches}: Fetching ${batch.length} icons... `);

    const batchPromises = batch.map((name) => fetchIconMetadata(name));
    const batchResults = await Promise.all(batchPromises);

    const successCount = batchResults.filter((r) => r !== null).length;
    console.log(`✓ (${successCount}/${batch.length} successful)`);

    results.push(...batchResults.filter((r) => r !== null));

    // Rate limit: delay between batches (except for last batch)
    if (i + BATCH_SIZE < iconNames.length) {
      await sleep(BATCH_DELAY_MS);
    }
  }

  return results;
}

/**
 * Main function
 */
async function main() {
  console.log('🎨 Bootstrap Icons Metadata Fetcher\n');
  console.log('━'.repeat(50));

  try {
    // Step 1: Get list of all icons
    console.log('\n📋 Fetching icon list from Bootstrap Icons repository...');
    const iconNames = await getIconList();
    console.log(`   Found ${iconNames.length} icons`);

    // Step 2: Fetch metadata for each icon
    const metadata = await processIconsInBatches(iconNames);

    // Step 3: Build output structure
    const output = {
      version: '1.0.0',
      source: 'https://github.com/twbs/icons',
      generatedAt: new Date().toISOString(),
      totalIcons: metadata.length,
      icons: {},
    };

    // Index by icon name for easy lookup
    for (const icon of metadata) {
      output.icons[icon.name] = {
        title: icon.title,
        categories: icon.categories,
        tags: icon.tags,
        url: icon.url,
      };
    }

    // Step 4: Generate category and tag indexes for reference
    const categoryIndex = {};
    const tagIndex = {};

    for (const icon of metadata) {
      for (const category of icon.categories || []) {
        if (!categoryIndex[category]) {
          categoryIndex[category] = [];
        }
        categoryIndex[category].push(icon.name);
      }

      for (const tag of icon.tags || []) {
        if (!tagIndex[tag]) {
          tagIndex[tag] = [];
        }
        tagIndex[tag].push(icon.name);
      }
    }

    output.categoryIndex = categoryIndex;
    output.tagIndex = tagIndex;

    // Step 5: Write output file
    console.log(`\n💾 Writing metadata to ${OUTPUT_FILE}...`);
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));

    // Step 6: Summary
    console.log('\n━'.repeat(50));
    console.log('✅ Metadata fetch complete!\n');
    console.log(`   📦 Icons processed: ${metadata.length}`);
    console.log(`   📁 Categories found: ${Object.keys(categoryIndex).length}`);
    console.log(`   🏷️  Unique tags found: ${Object.keys(tagIndex).length}`);
    console.log(`   📄 Output file: ${OUTPUT_FILE}`);
    console.log(`   📏 File size: ${(fs.statSync(OUTPUT_FILE).size / 1024).toFixed(2)} KB`);

    // Show category distribution
    console.log('\n📊 Category distribution:');
    const sortedCategories = Object.entries(categoryIndex)
      .sort((a, b) => b[1].length - a[1].length)
      .slice(0, 10);
    for (const [category, icons] of sortedCategories) {
      console.log(`   ${category}: ${icons.length} icons`);
    }

    console.log('\n');
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

main();
