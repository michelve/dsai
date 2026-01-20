/**
 * Style Dictionary Build Script for Playground
 *
 * Config-driven multi-theme token build.
 * Theme definitions are now in dsai.config.mjs under tokens.themes.definitions.
 *
 * This simplified script uses the @dsai-io/tools package to handle
 * theme discovery, building, and output generation based on configuration.
 *
 * USAGE:
 * 1. Configure themes in dsai.config.mjs under tokens.themes
 * 2. Run: pnpm tokens:build
 *
 * The build process will:
 * - Discover theme files based on suffix patterns
 * - Generate outputs for each configured theme
 * - Use appropriate CSS selectors for each theme
 *
 * @see https://github.com/michelve/dsai/tree/main/packages/@dsai-io/tools
 * @see TASK-126: Config-Driven Multi-Theme Builds
 */

import { loadConfig } from '@dsai-io/tools/config';
import { buildAllThemes, discoverThemeFiles } from '@dsai-io/tools/tokens';

async function build() {
  console.log('🎨 Building design tokens with config-driven multi-theme support...\n');

  // Load configuration
  const { config, configPath } = await loadConfig();
  console.log(`   📄 Config: ${configPath ?? 'defaults'}`);

  // Check if themes are enabled
  if (!config.tokens.themes?.enabled) {
    console.log('   ⚠️  Themes not enabled in config. Set tokens.themes.enabled = true');
    process.exit(1);
  }

  const themesConfig = config.tokens.themes;
  const themeNames = Object.keys(themesConfig.definitions ?? {});
  console.log(`   🎨 Themes: ${themeNames.join(', ')}`);

  // Discover theme files
  const discoveryResult = discoverThemeFiles(themesConfig, {
    sourceDir: config.tokens.collectionsDir,
    verbose: true,
  });

  console.log(`   📂 Found ${discoveryResult.totalFiles} token files`);
  console.log(`   🏷️  Themes with files: ${Array.from(discoveryResult.themes.keys()).join(', ')}`);

  if (discoveryResult.emptyThemes.length > 0) {
    console.log(`   ⚠️  Empty themes (no files): ${discoveryResult.emptyThemes.join(', ')}`);
  }

  // Build all themes
  const result = await buildAllThemes({
    config,
    themeFiles: discoveryResult.themes,
    outputDir: config.tokens.outputDir,
    verbose: true,
  });

  // Report results
  console.log('\n📊 Build Summary');
  console.log(`   ✅ Success: ${result.successCount}`);
  console.log(`   ❌ Failed: ${result.failCount}`);
  console.log(`   ⏱️  Duration: ${result.duration}ms`);

  if (result.failCount > 0) {
    console.log('\n❌ Failed themes:');
    for (const themeResult of result.results.filter((r) => !r.success)) {
      console.log(`   - ${themeResult.themeName}: ${themeResult.error}`);
    }
    process.exit(1);
  }

  console.log('\n✨ Token build complete!\n');
}

build().catch((error) => {
  console.error('Build failed:', error.message);
  process.exit(1);
});
