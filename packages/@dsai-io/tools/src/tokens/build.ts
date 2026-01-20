/**
 * @file Token Build Module
 * @description Orchestrates the complete token build pipeline
 *
 * Runs all token build steps in sequence with clear logging:
 * 1. Validate tokens
 * 2. Transform Figma tokens
 * 3. Build Style Dictionary outputs (CSS, JS, TS, SCSS, JSON)
 * 4. Sync tokens-flat.ts
 * 5. Compile Bootstrap theme SCSS → CSS
 * 6. Post-process theme CSS (data-bs-theme → data-dsai-theme)
 * 7. Compile DSAi utilities SCSS → CSS
 * 8. Bundle with tsup (ESM + CJS)
 *
 * The pipeline is configurable via dsai.config.mjs tokens.pipeline section.
 * Packages can specify which steps to run and customize paths.
 *
 * @module @dsai-io/tools/tokens/build
 */

/* eslint-disable no-console */
/* eslint-disable security/detect-non-literal-fs-filename */

import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname } from 'node:path';

import { CacheService } from './cache.js';
import {
  analyzeChanges,
  generateIncrementalReport,
  updateCacheAfterBuild,
  type IncrementalOptions,
} from './incremental.js';
import { postprocessCLI } from './postprocess.js';
import { SnapshotService } from './snapshot.js';
import { syncTokensCLI } from './sync.js';
import { buildAllThemes } from './theme-builder.js';
import { discoverThemeFiles } from './theme-discovery.js';
import { transformTokens } from './transform.js';

import type { BuildOptions, BuildResult, BuildStep } from './types';
import type {
  BuildPipelinePaths,
  BuildPipelineStep,
  OutputFormat,
  TokensBuildPipeline,
} from '../config/types.js';

// ============================================================================
// Constants
// ============================================================================

/** Default SASS deprecation silencing flags */
const SASS_FLAGS = [
  '--quiet-deps',
  '--silence-deprecation=import',
  '--silence-deprecation=global-builtin',
  '--silence-deprecation=color-functions',
].join(' ');

/** Minimal SASS flags (no color functions deprecation) */
const SASS_FLAGS_MINIMAL = ['--quiet-deps', '--silence-deprecation=import'].join(' ');

/** Default build pipeline steps (full @dsai-io/tokens build) */
const DEFAULT_PIPELINE_STEPS: BuildPipelineStep[] = [
  'validate',
  'snapshot', // Create backup before transform
  'transform',
  'style-dictionary',
  'sync',
  'sass-theme',
  'sass-theme-minified',
  'postprocess',
  'sass-utilities',
  'sass-utilities-minified',
  'bundle',
];

/** Default pipeline paths */
const DEFAULT_PIPELINE_PATHS: Required<BuildPipelinePaths> = {
  syncSource: 'dist/js/tokens.js',
  syncTarget: 'src/tokens-flat.ts',
  sassThemeInput: 'src/scss/dsai-theme-bs.scss',
  sassThemeOutput: 'dist/css/dsai-theme-bs.css',
  sassThemeMinifiedOutput: 'dist/css/dsai-theme-bs.min.css',
  sassUtilitiesInput: 'src/scss/dsai-utilities.scss',
  sassUtilitiesOutput: 'dist/css/dsai.css',
  sassUtilitiesMinifiedOutput: 'dist/css/dsai.min.css',
};

// ============================================================================
// Build Step Runner
// ============================================================================

/**
 * Run a single build step
 */
function runStep(step: BuildStep, index: number, total: number, verbose: boolean): boolean {
  const stepNum = `[${index + 1}/${total}]`;

  if (step.skip) {
    if (verbose) {
      console.info(`${stepNum} ⏭️  ${step.name} (skipped)`);
    }
    return true;
  }

  if (verbose) {
    console.info(`\n${stepNum} 🔧 ${step.name}`);
  }

  // If step has a function, run it
  if (step.fn) {
    try {
      // Run function and check return value
      const result = step.fn();
      if (result instanceof Promise) {
        // We need to handle this synchronously in the build context
        console.warn(`    ⚠️  Async step ${step.name} - running synchronously`);
      }
      // Check if function returned false (failure)
      if (result === false) {
        console.error(`    ❌ Failed: Step returned false`);
        return false;
      }
      if (verbose) {
        console.info('    ✅ Done');
      }
      return true;
    } catch (error) {
      console.error(`    ❌ Failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return false;
    }
  }

  // Otherwise run command
  if (step.command) {
    if (verbose) {
      const shortCmd = step.command.split(' ').slice(0, 4).join(' ');
      console.info(`    $ ${shortCmd}...`);
    }

    try {
      execSync(step.command, {
        cwd: step.cwd ?? process.cwd(),
        stdio: verbose ? 'inherit' : 'pipe',
        env: { ...process.env, FORCE_COLOR: '1' },
      });
      if (verbose) {
        console.info('    ✅ Done');
      }
      return true;
    } catch (error) {
      console.error(`    ❌ Failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return false;
    }
  }

  console.warn(`    ⚠️  Step ${step.name} has no command or function`);
  return true;
}

// ============================================================================
// Build Steps Configuration
// ============================================================================

/**
 * Get merged pipeline paths with defaults
 */
function getPipelinePaths(customPaths?: BuildPipelinePaths): Required<BuildPipelinePaths> {
  return {
    ...DEFAULT_PIPELINE_PATHS,
    ...customPaths,
  };
}

/**
 * Map of step names to human-readable names
 * Using Map for safe access (avoids Object Injection Sink)
 */
const STEP_DISPLAY_NAMES = new Map<BuildPipelineStep, string>([
  ['validate', 'Validate Tokens'],
  ['snapshot', 'Create Snapshot Backup'],
  ['transform', 'Transform Figma Tokens'],
  ['style-dictionary', 'Build Style Dictionary'],
  ['multi-theme', 'Build Multi-Theme Tokens'],
  ['sync', 'Sync tokens-flat.ts'],
  ['sass-theme', 'Compile Bootstrap Theme (unminified)'],
  ['sass-theme-minified', 'Compile Bootstrap Theme (minified)'],
  ['postprocess', 'Post-process Theme CSS'],
  ['sass-utilities', 'Compile DSAi Utilities (unminified)'],
  ['sass-utilities-minified', 'Compile DSAi Utilities (minified)'],
  ['bundle', 'Bundle with tsup'],
]);

/**
 * Create a single build step from step name
 */
function createStepFromName(
  stepName: BuildPipelineStep,
  tokensPackageDir: string,
  figmaExportsDir: string,
  tokensDir: string,
  paths: Required<BuildPipelinePaths>,
  sdConfigFile: string,
  strict: boolean,
  snapshotService?: SnapshotService,
  themesConfig?: BuildOptions['themesConfig']
): BuildStep {
  const displayName = STEP_DISPLAY_NAMES.get(stepName) ?? `Unknown: ${stepName}`;

  switch (stepName) {
    case 'validate':
      // Use dsai CLI for validation - this uses the native TypeScript implementation
      return {
        name: displayName,
        command: 'dsai tokens validate',
        cwd: tokensPackageDir,
      };

    case 'snapshot':
      return {
        name: displayName,
        fn: () => {
          if (!snapshotService) {
            console.warn('    ⚠️  Snapshot service not available, skipping');
            return true;
          }
          try {
            const result = snapshotService.createSnapshot(
              `${tokensPackageDir}/collections`,
              `Pre-transform backup - ${new Date().toISOString()}`
            );

            if (!result.success || !result.snapshot) {
              console.error(`    ❌ Snapshot failed: ${result.error || 'Unknown error'}`);
              return false;
            }

            console.info(`    📸 Snapshot created: ${result.snapshot.id}`);
            console.info(`       Files: ${result.snapshot.files.length}`);
            return true;
          } catch (error) {
            console.error(
              `    ❌ Snapshot failed: ${error instanceof Error ? error.message : 'Unknown error'}`
            );
            return false;
          }
        },
      };

    case 'transform':
      return {
        name: displayName,
        fn: () => {
          const result = transformTokens({
            sourceDir: figmaExportsDir,
            collectionsDir: tokensDir,
            verbose: true,
            strict,
          });
          if (!result.success) {
            for (const error of result.errors) {
              console.error(`❌ ${error}`);
            }
          }
          return result.success;
        },
      };

    case 'style-dictionary':
      return {
        name: displayName,
        command: `style-dictionary build --config ${sdConfigFile}`,
        cwd: tokensPackageDir,
      };

    case 'multi-theme':
      return {
        name: displayName,
        fn: async () => {
          // Check if themes config is provided and enabled
          if (!themesConfig?.enabled || !themesConfig?.definitions) {
            console.warn('    ⚠️  Multi-theme build requires themes config with enabled: true');
            console.warn('    ℹ️  Falling back to single-theme build via style-dictionary');
            return true; // Skip but don't fail
          }

          try {
            // Build minimal resolved config for theme builder
            const definitions = new Map(Object.entries(themesConfig.definitions));

            // Discover theme files
            const discoveryResult = discoverThemeFiles(
              {
                enabled: true,
                default: 'light',
                autoDetect: true,
                ignoreModes: [],
                selectorPattern: {
                  default: ':root',
                  others: '[data-dsai-theme="{mode}"]',
                },
                definitions: Object.fromEntries(
                  Array.from(definitions.entries()).map(([name, def]) => [
                    name,
                    {
                      isDefault: def.isDefault ?? name === 'light',
                      suffix: def.suffix ?? (def.isDefault ? null : `-${name}`),
                      selector: def.selector,
                      mediaQuery: def.mediaQuery,
                      dataAttribute: def.dataAttribute ?? `data-dsai-theme="${name}"`,
                      outputFiles: {
                        css:
                          def.outputFiles?.['css'] ??
                          (def.isDefault ? 'tokens.css' : `tokens-${name}.css`),
                        scss:
                          def.outputFiles?.['scss'] ??
                          (def.isDefault ? '_variables.scss' : `_variables-${name}.scss`),
                        js:
                          def.outputFiles?.['js'] ??
                          (def.isDefault ? 'tokens.js' : `tokens-${name}.js`),
                        ts:
                          def.outputFiles?.['ts'] ??
                          (def.isDefault ? 'tokens.d.ts' : `tokens-${name}.d.ts`),
                        json:
                          def.outputFiles?.['json'] ??
                          (def.isDefault ? 'tokens.json' : `tokens-${name}.json`),
                        android:
                          def.outputFiles?.['android'] ??
                          (def.isDefault ? 'tokens.xml' : `tokens-${name}.xml`),
                        ios:
                          def.outputFiles?.['ios'] ??
                          (def.isDefault ? 'tokens.h' : `tokens-${name}.h`),
                      },
                    },
                  ])
                ),
              },
              { sourceDir: tokensDir, verbose: true }
            );

            if (discoveryResult.emptyThemes.length > 0) {
              console.warn(
                `    ⚠️  Empty themes (no files): ${discoveryResult.emptyThemes.join(', ')}`
              );
            }

            console.info(
              `    📂 Found ${discoveryResult.totalFiles} files across ${discoveryResult.themes.size} themes`
            );

            // Build all themes
            const themeFiles = discoveryResult.themes;

            // Convert definitions to the format buildAllThemes expects
            const themeDefinitions = Object.fromEntries(
              Array.from(definitions.entries()).map(([name, def]) => [
                name,
                {
                  isDefault: def.isDefault ?? name === 'light',
                  suffix: def.suffix ?? (def.isDefault ? null : `-${name}`),
                  selector: def.selector,
                  mediaQuery: def.mediaQuery,
                  dataAttribute: def.dataAttribute ?? `data-dsai-theme="${name}"`,
                  outputFiles: def.outputFiles,
                },
              ])
            );

            const result = await buildAllThemes({
              config: {
                formats: ['css', 'scss', 'js', 'json'] as OutputFormat[],
                themes: {
                  definitions: themeDefinitions,
                },
              },
              themeFiles,
              outputDir: `${tokensPackageDir}/dist`,
              verbose: true,
            });

            if (!result.success) {
              console.error(`    ❌ Multi-theme build failed: ${result.failCount} theme(s) failed`);
              for (const themeResult of result.results.filter((r) => !r.success)) {
                console.error(`       - ${themeResult.themeName}: ${themeResult.error}`);
              }
              return false;
            }

            console.info(`    ✅ Built ${result.successCount} themes in ${result.duration}ms`);
            return true;
          } catch (error) {
            console.error(
              `    ❌ Multi-theme build error: ${error instanceof Error ? error.message : 'Unknown error'}`
            );
            return false;
          }
        },
      };

    case 'sync':
      return {
        name: displayName,
        fn: () =>
          syncTokensCLI(tokensPackageDir, {
            syncSource: paths.syncSource,
            syncTarget: paths.syncTarget,
          }),
      };

    case 'sass-theme':
      return {
        name: displayName,
        command: `sass ${SASS_FLAGS} ${paths.sassThemeInput} ${paths.sassThemeOutput}`,
        cwd: tokensPackageDir,
      };

    case 'sass-theme-minified':
      return {
        name: displayName,
        command: `sass ${SASS_FLAGS} ${paths.sassThemeInput} ${paths.sassThemeMinifiedOutput} --style=compressed`,
        cwd: tokensPackageDir,
      };

    case 'postprocess':
      return {
        name: displayName,
        fn: () => postprocessCLI(tokensPackageDir),
      };

    case 'sass-utilities':
      return {
        name: displayName,
        command: `sass ${SASS_FLAGS_MINIMAL} ${paths.sassUtilitiesInput} ${paths.sassUtilitiesOutput}`,
        cwd: tokensPackageDir,
      };

    case 'sass-utilities-minified':
      return {
        name: displayName,
        command: `sass ${SASS_FLAGS_MINIMAL} ${paths.sassUtilitiesInput} ${paths.sassUtilitiesMinifiedOutput} --style=compressed`,
        cwd: tokensPackageDir,
      };

    case 'bundle':
      return {
        name: displayName,
        command: 'tsup',
        cwd: tokensPackageDir,
      };

    default:
      return {
        name: `Unknown step: ${stepName}`,
        fn: () => {
          console.warn(`⚠️ Unknown pipeline step: ${stepName}`);
          return true;
        },
      };
  }
}

/**
 * Create build steps based on options and pipeline configuration
 */
function createBuildSteps(
  tokensDir: string,
  _toolsDir: string,
  options: BuildOptions,
  pipeline?: TokensBuildPipeline
): BuildStep[] {
  const { skipValidate, skipTransform, onlyTheme, strict = false } = options;

  // Get the tokens package root directory
  // tokensDir is typically the collections dir (e.g., packages/@dsai-io/tokens/collections)
  // We need the package root for running commands
  const tokensPackageDir = tokensDir.endsWith('/collections')
    ? dirname(tokensDir)
    : dirname(tokensDir);

  // Path to figma-exports source directory (sibling to collections)
  const figmaExportsDir = `${tokensPackageDir}/figma-exports`;

  // Initialize snapshot service for backup/rollback
  const snapshotService = new SnapshotService({
    snapshotDir: `${tokensPackageDir}/.snapshots`,
    maxSnapshots: 10,
    include: ['**/*.json'],
  });

  // Get pipeline configuration
  const pipelineSteps = pipeline?.steps ?? DEFAULT_PIPELINE_STEPS;
  const paths = getPipelinePaths(pipeline?.paths);
  const sdConfigFile = pipeline?.styleDictionaryConfig ?? 'sd.config.mjs';

  // Build steps based on pipeline configuration
  const steps: BuildStep[] = [];

  for (const stepName of pipelineSteps) {
    const step = createStepFromName(
      stepName,
      tokensPackageDir,
      figmaExportsDir,
      tokensDir,
      paths,
      sdConfigFile,
      strict,
      snapshotService,
      options.themesConfig
    );

    // Apply skip flags based on legacy options
    if (stepName === 'validate' && skipValidate) {
      step.skip = true;
    }
    if (stepName === 'transform' && (skipTransform || onlyTheme)) {
      step.skip = true;
    }
    if (onlyTheme && !['sass-theme', 'sass-theme-minified', 'postprocess'].includes(stepName)) {
      // Only run theme-related steps when onlyTheme is true
      if (!['validate'].includes(stepName)) {
        step.skip = true;
      }
    }

    steps.push(step);
  }

  return steps;
}

// ============================================================================
// Main Build Function
// ============================================================================

/**
 * Run the complete token build pipeline
 *
 * @example
 * ```typescript
 * // Full build
 * const result = buildTokens({
 *   tokensDir: './packages/@dsai-io/tokens',
 *   toolsDir: './tools/scripts/tokens',
 * });
 *
 * // Skip validation
 * const result = buildTokens({
 *   tokensDir: './packages/@dsai-io/tokens',
 *   toolsDir: './tools/scripts/tokens',
 *   skipValidate: true,
 * });
 *
 * // Only build theme CSS
 * const result = buildTokens({
 *   tokensDir: './packages/@dsai-io/tokens',
 *   toolsDir: './tools/scripts/tokens',
 *   onlyTheme: true,
 * });
 * ```
 */
export async function buildTokens(
  tokensDir: string,
  toolsDir: string,
  options: BuildOptions = {}
): Promise<BuildResult> {
  const {
    skipValidate,
    onlyTheme,
    verbose = true,
    quiet = false,
    incremental = false,
    force = false,
    cacheDir,
  } = options;

  const startTime = Date.now();
  const stepsCompleted: string[] = [];
  const stepsFailed: string[] = [];
  const errors: string[] = [];
  const warnings: string[] = [];

  // Verify directories exist
  try {
    if (!existsSync(tokensDir)) {
      return {
        success: false,
        stepsCompleted,
        stepsFailed: ['Directory Check'],
        duration: Date.now() - startTime,
        errors: [`Tokens directory not found: ${tokensDir}`],
        warnings,
      };
    }
  } catch {
    return {
      success: false,
      stepsCompleted,
      stepsFailed: ['Directory Check'],
      duration: Date.now() - startTime,
      errors: [`Failed to check tokens directory: ${tokensDir}`],
      warnings,
    };
  }

  try {
    if (!existsSync(toolsDir)) {
      return {
        success: false,
        stepsCompleted,
        stepsFailed: ['Directory Check'],
        duration: Date.now() - startTime,
        errors: [`Tools directory not found: ${toolsDir}`],
        warnings,
      };
    }
  } catch {
    return {
      success: false,
      stepsCompleted,
      stepsFailed: ['Directory Check'],
      duration: Date.now() - startTime,
      errors: [`Failed to check tools directory: ${toolsDir}`],
      warnings,
    };
  }

  // Print header
  if (verbose && !quiet) {
    console.info('╔════════════════════════════════════════════════════════════╗');
    console.info('║           DSAi Tokens - Complete Build                     ║');
    console.info('╚════════════════════════════════════════════════════════════╝');

    if (skipValidate) {
      console.info('⚠️  Skipping validation (--skip-validate)');
    }
    if (onlyTheme) {
      console.info('⚠️  Building only theme CSS (--only-theme)');
    }
    if (incremental) {
      console.info('🔄 Incremental build enabled');
      if (force) {
        console.info('⚡ Force rebuild - ignoring cache');
      }
    }
  }

  // Initialize cache service for incremental builds
  let cacheService: CacheService | undefined;
  let incrementalAnalysis: Awaited<ReturnType<typeof analyzeChanges>> | undefined;

  if (incremental) {
    cacheService = new CacheService({
      cacheDir: cacheDir || `${tokensDir}/.dsai-cache`,
      enabled: true,
    });

    // Analyze what needs to be rebuilt
    const figmaExportsDir = `${tokensDir}/figma-exports`;
    const incrementalOptions: IncrementalOptions = {
      enabled: true,
      force,
      cacheService,
      verbose: verbose && !quiet,
    };

    incrementalAnalysis = await analyzeChanges(figmaExportsDir, incrementalOptions);

    // If no changes detected, skip build
    if (!incrementalAnalysis.needsFullBuild && incrementalAnalysis.changedFiles.length === 0) {
      const duration = Date.now() - startTime;

      if (verbose && !quiet) {
        console.info(generateIncrementalReport(incrementalAnalysis, startTime, 0, 0));
      }

      return {
        success: true,
        stepsCompleted: ['Cache Check'],
        stepsFailed: [],
        duration,
        errors: [],
        warnings: ['No changes detected - build skipped'],
      };
    }
  }

  // Create and run build steps
  const steps = createBuildSteps(tokensDir, toolsDir, options, options.pipeline);

  for (const step of steps) {
    const stepIndex = steps.indexOf(step);
    const success = runStep(step, stepIndex, steps.length, verbose && !quiet);

    if (success) {
      if (!step.skip) {
        stepsCompleted.push(step.name);
      }
    } else {
      stepsFailed.push(step.name);
      errors.push(`Build failed at step: ${step.name}`);

      // Stop on first failure
      const failDuration = Date.now() - startTime;

      if (verbose && !quiet) {
        console.error(`\n💥 Build failed at step: ${step.name}`);
      }

      return {
        success: false,
        stepsCompleted,
        stepsFailed,
        duration: failDuration,
        errors,
        warnings,
      };
    }
  }

  const duration = Date.now() - startTime;
  const durationSec = (duration / 1000).toFixed(2);

  // Update cache after successful build
  if (incremental && cacheService && incrementalAnalysis) {
    const figmaExportsDir = `${tokensDir}/figma-exports`;
    const collectionsDir = `${tokensDir}/collections`;

    await updateCacheAfterBuild(
      cacheService,
      incrementalAnalysis.changedFiles,
      [], // Output files - would need to track from transform step
      figmaExportsDir,
      collectionsDir,
      verbose && !quiet
    );

    // Show incremental build report
    if (verbose && !quiet) {
      console.info(
        generateIncrementalReport(
          incrementalAnalysis,
          startTime,
          stepsCompleted.length,
          steps.length
        )
      );
    }
  }

  // Print footer
  if (verbose && !quiet) {
    console.info('\n╔════════════════════════════════════════════════════════════╗');
    console.info('║  ✅ Build Complete                                         ║');
    console.info(
      `║  📊 ${stepsCompleted.length} steps passed in ${durationSec}s                              ║`
    );
    console.info('╚════════════════════════════════════════════════════════════╝');
  }

  return {
    success: true,
    stepsCompleted,
    stepsFailed,
    duration,
    errors,
    warnings,
  };
}

/**
 * CLI entry point for token build
 */
export async function buildTokensCLI(
  tokensDir: string,
  toolsDir: string,
  args: string[] = []
): Promise<boolean> {
  const skipValidate = args.includes('--skip-validate');
  const skipTransform = args.includes('--skip-transform');
  const onlyTheme = args.includes('--only-theme');
  const quiet = args.includes('--quiet') || args.includes('-q');
  const strict = args.includes('--strict');
  const incremental = args.includes('--incremental') || args.includes('--cache');
  const force = args.includes('--force');

  // Extract --cache-dir argument
  const cacheDirIndex = args.findIndex((arg) => arg.startsWith('--cache-dir='));
  const cacheDirArg = cacheDirIndex >= 0 ? args.at(cacheDirIndex) : undefined;
  const cacheDir = cacheDirArg?.split('=')[1];

  const result = await buildTokens(tokensDir, toolsDir, {
    skipValidate,
    skipTransform,
    onlyTheme,
    verbose: !quiet,
    quiet,
    strict,
    incremental,
    force,
    cacheDir,
  });

  return result.success;
}

/**
 * Parse CLI arguments and run build
 * Used as the main entry point when called directly
 */
export async function runBuildCLI(tokensDir: string, toolsDir: string): Promise<void> {
  const args = process.argv.slice(2);
  const success = await buildTokensCLI(tokensDir, toolsDir, args);
  process.exit(success ? 0 : 1);
}
