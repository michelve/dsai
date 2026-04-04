/**
 * Figma Integration Configuration for Playground App
 *
 * This configuration shows how to use @dsai-io/figma-tokens to:
 * - Export tokens directly from Figma API
 * - Sync tokens between Figma and local files
 * - Use the Figma client programmatically
 *
 * PREREQUISITES:
 * 1. Create a Figma Personal Access Token at:
 *    https://www.figma.com/developers/api#access-tokens
 * 2. Set your token as an environment variable:
 *    export FIGMA_TOKEN="your-figma-token-here"
 *
 * USAGE:
 *   node figma.config.mjs export    # Export tokens from Figma
 *   node figma.config.mjs sync      # Sync tokens with Figma
 *   node figma.config.mjs info      # Show Figma file info
 *
 * @see https://github.com/michelve/dsai/tree/main/packages/@dsai-io/figma-tokens
 */

import {
  // Figma API client
  createFigmaClient,
  createFigmaClientFromEnv,
  // Token utilities (re-exported from @dsai-io/tools)
  transformTokens,
  validateFigmaExports,
  buildTokens,
} from '@dsai-io/figma-tokens';

// =============================================================================
// Configuration
// =============================================================================

/**
 * Figma file configuration
 *
 * To find your file key, open your Figma file and look at the URL:
 * https://www.figma.com/file/ABC123xyz/My-Design-System
 *                            ^^^^^^^^^^^
 *                            This is your file key
 */
const FIGMA_CONFIG = {
  // Your Figma file key (from the URL)
  fileKey: process.env['FIGMA_FILE_KEY'] ?? 'YOUR_FIGMA_FILE_KEY_HERE',

  // Output directory for exported tokens
  outputDir: './src/figma-exports',

  // Tokens package directory (for sync operations)
  tokensDir: './src/collections',

  // Export options
  exportOptions: {
    // Output format: 'dtcg' (W3C standard), 'tokens-studio', or 'style-dictionary'
    format: 'dtcg',

    // Include token descriptions from Figma
    includeDescriptions: true,

    // Resolve aliases to actual values (false keeps references like {colors.primary})
    resolveAliases: false,

    // Group output files by collection
    groupByCollection: true,

    // Include effect styles (shadows, blurs)
    includeEffects: false,

    // Include paint styles (colors, gradients)
    includePaints: false,

    // Include text styles (typography)
    includeTextStyles: false,

    // Output structure:
    // - 'separate': One file per mode (e.g., color.light.json, color.dark.json)
    // - 'combined': Single file with Collection > modes > ModeName structure
    outputStructure: 'combined',

    // Filter specific collections (empty = all local collections)
    // Remote/library collections are automatically excluded
    collections: [],

    // Filter specific modes (empty = all)
    modes: [],
  },

  // Sync options
  syncOptions: {
    // Sync direction: 'pull' (Figma → local), 'push' (local → Figma), or 'both'
    direction: 'pull',

    // Conflict resolution: 'local', 'remote', or 'manual'
    conflictResolution: 'remote',

    // Preview changes without applying
    dryRun: false,

    // Create backup before sync
    backup: true,
  },
};

// =============================================================================
// Figma Client Setup
// =============================================================================

/**
 * Create a Figma client from environment variables
 * Looks for FIGMA_TOKEN or FIGMA_ACCESS_TOKEN
 */
function getClient() {
  const client = createFigmaClientFromEnv();

  if (!client.isReady()) {
    console.error('\n❌ Figma client not configured!');
    console.error('   Set FIGMA_TOKEN environment variable:');
    console.error('   export FIGMA_TOKEN="your-token-here"\n');
    process.exit(1);
  }

  return client;
}

// =============================================================================
// Commands
// =============================================================================

/**
 * Export tokens from Figma
 *
 * Fetches variables from the Figma file and exports them as JSON files
 * in the specified format (DTCG, Tokens Studio, or Style Dictionary).
 */
async function exportTokens() {
  console.log('\n📦 Exporting tokens from Figma...\n');

  const client = getClient();

  const result = await client.exportTokens({
    fileKey: FIGMA_CONFIG.fileKey,
    outputDir: FIGMA_CONFIG.outputDir,
    ...FIGMA_CONFIG.exportOptions,
  });

  if (result.success) {
    console.log('✅ Export successful!\n');
    console.log(`   Collections: ${result.collectionCount}`);
    console.log(`   Tokens: ${result.tokenCount}`);
    console.log(`   Files: ${result.files.length}\n`);

    for (const file of result.files) {
      console.log(`   📄 ${file.path}`);
      console.log(`      Collection: ${file.collection}${file.mode ? ` (${file.mode})` : ''}`);
      console.log(`      Tokens: ${file.tokenCount}\n`);
    }

    if (result.warnings.length > 0) {
      console.log('⚠️  Warnings:');
      for (const warning of result.warnings) {
        console.log(`   - ${warning}`);
      }
    }
  } else {
    console.error('❌ Export failed!\n');
    for (const error of result.errors) {
      console.error(`   - ${error}`);
    }
    process.exit(1);
  }
}

/**
 * Sync tokens with Figma
 *
 * Compares local tokens with Figma and syncs based on direction setting.
 */
async function syncWithFigma() {
  console.log('\n🔄 Syncing tokens with Figma...\n');

  const client = getClient();

  const result = await client.syncTokens({
    fileKey: FIGMA_CONFIG.fileKey,
    tokensDir: FIGMA_CONFIG.tokensDir,
    ...FIGMA_CONFIG.syncOptions,
  });

  if (result.success) {
    console.log('✅ Sync successful!\n');
    console.log(`   Direction: ${result.direction}`);
    console.log(`   Added: ${result.added.length}`);
    console.log(`   Updated: ${result.updated.length}`);
    console.log(`   Removed: ${result.removed.length}`);

    if (result.added.length > 0) {
      console.log('\n   New tokens:');
      for (const token of result.added.slice(0, 10)) {
        console.log(`   + ${token}`);
      }
      if (result.added.length > 10) {
        console.log(`   ... and ${result.added.length - 10} more`);
      }
    }

    if (result.updated.length > 0) {
      console.log('\n   Updated tokens:');
      for (const token of result.updated.slice(0, 10)) {
        console.log(`   ~ ${token}`);
      }
      if (result.updated.length > 10) {
        console.log(`   ... and ${result.updated.length - 10} more`);
      }
    }

    if (result.conflicts.length > 0) {
      console.log('\n   ⚠️  Conflicts:');
      for (const conflict of result.conflicts) {
        console.log(`   ! ${conflict.path}`);
        console.log(`     Local:  ${JSON.stringify(conflict.localValue)}`);
        console.log(`     Remote: ${JSON.stringify(conflict.remoteValue)}`);
      }
    }
  } else {
    console.error('❌ Sync failed!\n');
    for (const error of result.errors) {
      console.error(`   - ${error}`);
    }
    process.exit(1);
  }
}

/**
 * Show Figma file information
 *
 * Fetches and displays metadata about the Figma file.
 */
async function showFileInfo() {
  console.log('\n📋 Fetching Figma file info...\n');

  const client = getClient();

  try {
    const file = await client.getFile(FIGMA_CONFIG.fileKey, { depth: 1 });

    console.log('✅ File info:\n');
    console.log(`   Name: ${file.name}`);
    console.log(`   Last Modified: ${file.lastModified}`);
    console.log(`   Version: ${file.version}`);
    console.log(`   Components: ${Object.keys(file.components || {}).length}`);
    console.log(`   Styles: ${Object.keys(file.styles || {}).length}`);

    // Get variables (requires Enterprise plan)
    try {
      const variablesResponse = await client.getVariables(FIGMA_CONFIG.fileKey);
      const variables = variablesResponse?.variables || {};
      const variableCollections = variablesResponse?.variableCollections || {};

      console.log(`\n   Variable Collections: ${Object.keys(variableCollections).length}`);
      console.log(`   Variables: ${Object.keys(variables).length}`);

      if (Object.keys(variableCollections).length > 0) {
        console.log('\n   Collections:');
        for (const [, collection] of Object.entries(variableCollections)) {
          const collectionVars = Object.values(variables).filter(
            (v) => v.variableCollectionId === collection.id
          );
          console.log(`   - ${collection.name}`);
          console.log(`     Modes: ${collection.modes.map((m) => m.name).join(', ')}`);
          console.log(`     Variables: ${collectionVars.length}`);
        }
      }
    } catch (varError) {
      console.log('\n   ⚠️  Could not fetch variables');
      if (varError.status === 403) {
        console.log('   Variables API requires Figma Enterprise plan.');
        console.log('   See: https://developers.figma.com/docs/rest-api/variables');
      } else {
        console.log(`   ${varError.message || varError}`);
      }
    }
  } catch (error) {
    console.error('❌ Failed to fetch file info!\n');
    console.error(`   ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}

/**
 * Full workflow: Export → Validate → Transform → Build
 *
 * Runs the complete token pipeline from Figma to generated output files.
 */
async function fullWorkflow() {
  console.log('\n🚀 Running full Figma → Output workflow...\n');

  // Step 1: Export from Figma
  console.log('Step 1/4: Export tokens from Figma');
  await exportTokens();

  // Step 2: Validate exports
  console.log('\nStep 2/4: Validate Figma exports');
  const validation = await validateFigmaExports({
    exportsDir: FIGMA_CONFIG.outputDir,
    strict: false,
  });

  if (!validation.valid) {
    console.error('❌ Validation failed!');
    for (const error of validation.errors) {
      console.error(`   - ${error.path}: ${error.message}`);
    }
    process.exit(1);
  }
  console.log('✅ Validation passed');

  // Step 3: Transform to Style Dictionary format
  console.log('\nStep 3/4: Transform tokens');
  await transformTokens({
    sourceDir: FIGMA_CONFIG.outputDir,
    outputDir: FIGMA_CONFIG.tokensDir,
  });
  console.log('✅ Tokens transformed');

  // Step 4: Build output files
  console.log('\nStep 4/4: Build output files');
  await buildTokens({
    tokensDir: FIGMA_CONFIG.tokensDir,
  });
  console.log('✅ Build complete');

  console.log('\n🎉 Full workflow completed successfully!\n');
}

/**
 * Alternative: Manual client usage example
 *
 * Shows how to use the client directly for custom integrations.
 */
async function manualExample() {
  console.log('\n📝 Manual client usage example...\n');

  // Create client with explicit config
  const client = createFigmaClient({
    accessToken: process.env['FIGMA_TOKEN'] ?? '',
    timeout: 60000, // 60 second timeout
    retries: 3,
  });

  if (!client.isReady()) {
    console.error('Client not configured');
    return;
  }

  // Get variables directly
  const { variables, variableCollections } = await client.getVariables(FIGMA_CONFIG.fileKey);

  // Process variables manually
  console.log('Processing variables...\n');

  for (const [, collection] of Object.entries(variableCollections)) {
    console.log(`Collection: ${collection.name}`);

    const collectionVars = Object.values(variables).filter(
      (v) => v.variableCollectionId === collection.id
    );

    for (const variable of collectionVars.slice(0, 5)) {
      console.log(`  - ${variable.name} (${variable.resolvedType})`);
    }

    if (collectionVars.length > 5) {
      console.log(`  ... and ${collectionVars.length - 5} more\n`);
    }
  }
}

// =============================================================================
// CLI Entry Point
// =============================================================================

const command = process.argv[2];

switch (command) {
  case 'export':
    await exportTokens();
    break;

  case 'sync':
    await syncWithFigma();
    break;

  case 'info':
    await showFileInfo();
    break;

  case 'workflow':
    await fullWorkflow();
    break;

  case 'example':
    await manualExample();
    break;

  default:
    console.log(`
Figma Integration for Playground App

Usage: node figma.config.mjs <command>

Commands:
  export    Export tokens from Figma to local files
  sync      Sync tokens between Figma and local files
  info      Show Figma file information
  workflow  Run full export → validate → transform → build pipeline
  example   Show manual client usage example

Environment Variables:
  FIGMA_TOKEN      Your Figma personal access token (required)
  FIGMA_FILE_KEY   Figma file key (or set in config)

Examples:
  # Set your token
  export FIGMA_TOKEN="figd_xxx..."
  export FIGMA_FILE_KEY="ABC123xyz"

  # Export tokens
  node figma.config.mjs export

  # Run full workflow
  node figma.config.mjs workflow
`);
}
