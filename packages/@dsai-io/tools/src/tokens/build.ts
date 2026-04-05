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
import { existsSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';

import { CacheService } from './cache.js';
import {
  analyzeChanges,
  generateIncrementalReport,
  updateCacheAfterBuild,
  type IncrementalOptions,
} from './incremental.js';
import { preprocessTokenFiles, type FilePreprocessingResult } from './mode-preprocessor.js';
import { postprocessCssFiles } from './postprocess.js';
import { SnapshotService } from './snapshot.js';
import { syncTokensCLI } from './sync.js';
import { buildAllThemes } from './theme-builder.js';
import { discoverThemeFiles } from './theme-discovery.js';
import { transformTokens } from './transform.js';
import { validateTokens } from './validate.js';

import type { BuildOptions, BuildResult, BuildStep } from './types';
import type {
  BuildPipelinePaths,
  BuildPipelineStep,
  OutputFormat,
  ResolvedThemeDefinition,
  TokensBuildPipeline,
} from '../config/types.js';

// ============================================================================
// Constants
// ============================================================================

/** Global cleanup function for preprocessed files */
let preprocessCleanup: (() => void) | null = null;

/** Common SASS flags shared between full and minimal configurations */
const SASS_FLAG_QUIET_DEPS = '--quiet-deps';
const SASS_FLAG_SILENCE_IMPORT = '--silence-deprecation=import';

/** Default SASS deprecation silencing flags */
const SASS_FLAGS = [
  SASS_FLAG_QUIET_DEPS,
  SASS_FLAG_SILENCE_IMPORT,
  '--silence-deprecation=global-builtin',
  '--silence-deprecation=color-functions',
].join(' ');

/** Minimal SASS flags (no color functions deprecation) */
const SASS_FLAGS_MINIMAL = [SASS_FLAG_QUIET_DEPS, SASS_FLAG_SILENCE_IMPORT].join(' ');

/** Fallback message for non-Error exceptions */
const UNKNOWN_ERROR_MSG = 'Unknown error';

/** Default build pipeline steps (full @dsai-io/tokens build) */
const DEFAULT_PIPELINE_STEPS: BuildPipelineStep[] = [
  'validate',
  'snapshot', // Create backup before transform
  'preprocess', // Extract modes from nested Figma structure
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
 * Execute a step's function, returning success/failure
 */
async function executeStepFunction(step: BuildStep, verbose: boolean): Promise<boolean> {
  try {
    const result = await step.fn!();
    if (result === false) {
      console.error(`    ❌ Failed: Step returned false`);
      return false;
    }
    if (verbose) {
      console.info('    ✅ Done');
    }
    return true;
  } catch (error) {
    console.error(`    ❌ Failed: ${error instanceof Error ? error.message : String(error)}`);
    return false;
  }
}

/**
 * Execute a step's shell command, returning success/failure
 */
function executeStepCommand(step: BuildStep, verbose: boolean): boolean {
  if (verbose) {
    console.info(`    $ ${step.command!.split(' ').slice(0, 4).join(' ')}...`);
  }
  try {
    execSync(step.command!, {
      cwd: step.cwd ?? process.cwd(),
      stdio: verbose ? 'inherit' : 'pipe',
      env: { ...process.env, FORCE_COLOR: '1' },
    });
    if (verbose) {
      console.info('    ✅ Done');
    }
    return true;
  } catch (error) {
    console.error(`    ❌ Failed: ${error instanceof Error ? error.message : UNKNOWN_ERROR_MSG}`);
    return false;
  }
}

/**
 * Run a single build step
 */
async function runStep(
  step: BuildStep,
  index: number,
  total: number,
  verbose: boolean
): Promise<boolean> {
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

  if (step.fn) {
    return executeStepFunction(step, verbose);
  }

  if (step.command) {
    return executeStepCommand(step, verbose);
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
  ['preprocess', 'Preprocess Mode Files'],
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

/** Default output file name pairs [defaultTheme, nonDefaultTheme] by format */
const FORMAT_OUTPUT_DEFAULTS: Record<string, [string, string]> = {
  css: ['tokens.css', 'tokens-{name}.css'],
  scss: ['_variables.scss', '_variables-{name}.scss'],
  js: ['tokens.js', 'tokens-{name}.js'],
  ts: ['tokens.d.ts', 'tokens-{name}.d.ts'],
  json: ['tokens.json', 'tokens-{name}.json'],
  android: ['tokens.xml', 'tokens-{name}.xml'],
  ios: ['tokens.h', 'tokens-{name}.h'],
};

/**
 * Resolve default output file for a format based on theme name
 */
function resolveThemeOutputFile(
  outputFiles: Partial<Record<string, string>> | undefined,
  name: string,
  format: string,
  isDefault: boolean
): string {
  const existing = outputFiles?.[format];
  if (existing) {return existing;}
  const pair = FORMAT_OUTPUT_DEFAULTS[format];
  if (!pair) {return `tokens-${name}.${format}`;}
  const template = isDefault ? pair[0] : pair[1];
  return template.replace('{name}', name);
}

/**
 * Build a resolved definition entry for theme discovery
 */
function resolveThemeDefForDiscovery(
  name: string,
  def: { isDefault?: boolean; suffix?: string | null; selector: string; mediaQuery?: string; dataAttribute?: string; outputFiles?: Partial<Record<string, string>> }
): Record<string, unknown> {
  const isDefault = def.isDefault ?? name === 'light';
  const allFormats = ['css', 'scss', 'js', 'ts', 'json', 'android', 'ios'];
  const outputFiles: Record<string, string> = {};
  for (const fmt of allFormats) {
    outputFiles[fmt] = resolveThemeOutputFile(def.outputFiles, name, fmt, isDefault);
  }
  return {
    isDefault,
    suffix: def.suffix ?? (isDefault ? null : `-${name}`),
    selector: def.selector,
    mediaQuery: def.mediaQuery,
    dataAttribute: def.dataAttribute ?? `data-dsai-theme="${name}"`,
    outputFiles,
  };
}

/**
 * Convert theme definitions to the format expected by buildAllThemes
 */
function convertThemeDefinitions(
  definitions: Map<string, { isDefault?: boolean; suffix?: string | null; selector: string; mediaQuery?: string; dataAttribute?: string; outputFiles?: Partial<Record<string, string>> }>
): Record<string, { isDefault: boolean; suffix: string | null; selector: string; mediaQuery?: string; dataAttribute: string; outputFiles?: Partial<Record<string, string>> }> {
  return Object.fromEntries(
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
}

/**
 * Execute the multi-theme build step
 */
async function executeMultiThemeBuild(
  themesConfig: NonNullable<BuildOptions['themesConfig']>,
  tokensDir: string,
  tokensPackageDir: string,
  outputDir: string | undefined,
  formats: OutputFormat[],
  prefix: string | undefined
): Promise<boolean> {
  const definitions = new Map(Object.entries(themesConfig.definitions!));

  // Discover theme files - build resolved definitions for discovery
  const discoveryDefs: Record<string, ResolvedThemeDefinition> = {};
  for (const [name, def] of definitions.entries()) {
    const resolved = resolveThemeDefForDiscovery(name, def);
    Object.defineProperty(discoveryDefs, name, { value: resolved, writable: true, enumerable: true, configurable: true });
  }

  const discoveryResult = discoverThemeFiles(
    {
      enabled: true,
      default: 'light',
      autoDetect: true,
      ignoreModes: [],
      selectorPattern: { default: ':root', others: '[data-dsai-theme="{mode}"]' },
      definitions: discoveryDefs,
    },
    { sourceDir: join(tokensDir, 'collections'), verbose: true }
  );

  if (discoveryResult.emptyThemes.length > 0) {
    console.warn(`    ⚠️  Empty themes (no files): ${discoveryResult.emptyThemes.join(', ')}`);
  }
  console.info(
    `    📂 Found ${discoveryResult.totalFiles} files across ${discoveryResult.themes.size} themes`
  );

  const themeDefinitions = convertThemeDefinitions(definitions);

  const result = await buildAllThemes({
    config: { formats, prefix, themes: { definitions: themeDefinitions } },
    themeFiles: discoveryResult.themes,
    outputDir: outputDir ?? `${tokensPackageDir}/dist`,
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
}

/**
 * Execute the preprocess step
 */
function executePreprocessStep(figmaExportsDir: string): boolean {
  const ppOutputDir = join(figmaExportsDir, '.preprocessed');
  console.info(`    📂 Source: ${figmaExportsDir}`);
  console.info(`    📂 Output: ${ppOutputDir}`);

  const jsonFiles = readdirSync(figmaExportsDir).filter((f) => f.endsWith('.json'));
  if (jsonFiles.length === 0) {
    console.warn(`    ⚠️  No JSON files found in ${figmaExportsDir}`);
    return true;
  }

  const result = preprocessTokenFiles({
    sourceDir: figmaExportsDir,
    outputDir: ppOutputDir,
    files: jsonFiles,
    modesPath: ['Foundation', 'modes'],
    verbose: true,
  });

  const failedFiles = result.files.filter((f) => !f.success && f.error !== 'No modes detected');
  if (failedFiles.length > 0) {
    console.error(`    ❌ Preprocessing failed for ${failedFiles.length} file(s)`);
    for (const failed of failedFiles) {
      console.error(`       - ${failed.sourceFile}: ${failed.error ?? UNKNOWN_ERROR_MSG}`);
    }
    return false;
  }

  const successFiles = result.files.filter((f) => f.success);
  const skippedFiles = result.files.filter((f) => f.error === 'No modes detected');
  console.info(`    ✅ Preprocessed ${successFiles.length} file(s)`);
  if (skippedFiles.length > 0) {
    console.info(`    ⏭️  Skipped ${skippedFiles.length} file(s) (no modes)`);
  }

  const totalModes = result.files.reduce(
    (sum: number, file: FilePreprocessingResult) => sum + file.modes.length,
    0
  );
  console.info(`    📊 Total modes extracted: ${totalModes}`);
  preprocessCleanup = result.cleanup;
  return true;
}

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
  themesConfig?: BuildOptions['themesConfig'],
  outputDir?: string,
  formats: OutputFormat[] = ['css', 'scss', 'json'],
  cssOutputDir?: string,
  postprocessConfig?: BuildOptions['postprocessConfig'],
  prefix?: string
): BuildStep {
  const displayName = STEP_DISPLAY_NAMES.get(stepName) ?? `Unknown: ${stepName}`;

  switch (stepName) {
    case 'validate':
      return {
        name: displayName,
        fn: async () => {
          const config = {
            tokens: { collectionsDir: tokensDir, sourceDir: figmaExportsDir },
          } as Parameters<typeof validateTokens>[0];
          const result = await validateTokens(config, { verbose: true, strict });
          if (!result.valid) {
            for (const error of result.errors) {
              console.error(`❌ ${error.message}`);
            }
          }
          return result.valid;
        },
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
            const collectionsPath = join(tokensDir, 'collections');
            console.info(`    📂 Snapshot path: ${collectionsPath}`);
            const result = snapshotService.createSnapshot(
              collectionsPath,
              `Pre-transform backup - ${new Date().toISOString()}`
            );
            if (!result.success || !result.snapshot) {
              console.error(`    ❌ Snapshot failed: ${result.error || UNKNOWN_ERROR_MSG}`);
              return false;
            }
            console.info(`    📸 Snapshot created: ${result.snapshot.id}`);
            console.info(`       Files: ${result.snapshot.files.length}`);
            return true;
          } catch (error) {
            console.error(
              `    ❌ Snapshot failed: ${error instanceof Error ? error.message : UNKNOWN_ERROR_MSG}`
            );
            return false;
          }
        },
      };

    case 'preprocess':
      return {
        name: displayName,
        fn: async () => {
          try {
            return executePreprocessStep(figmaExportsDir);
          } catch (error) {
            console.error(
              `    ❌ Preprocessing failed: ${error instanceof Error ? error.message : UNKNOWN_ERROR_MSG}`
            );
            return false;
          }
        },
      };

    case 'transform':
      return {
        name: displayName,
        fn: () => {
          const preprocessedDir = join(figmaExportsDir, '.preprocessed');
          const sourceDir = existsSync(preprocessedDir) ? preprocessedDir : figmaExportsDir;
          if (sourceDir === preprocessedDir) {
            console.info(`    📂 Using preprocessed directory: ${preprocessedDir}`);
          }
          const result = transformTokens({ sourceDir, collectionsDir: tokensDir, verbose: true, strict });
          if (!result.success) {
            for (const error of result.errors) {
              console.error(`❌ ${error}`);
            }
          }
          return result.success;
        },
      };

    case 'style-dictionary':
      return { name: displayName, command: `style-dictionary build --config ${sdConfigFile}`, cwd: tokensPackageDir };

    case 'multi-theme':
      return {
        name: displayName,
        fn: async () => {
          if (!themesConfig?.enabled || !themesConfig?.definitions) {
            console.warn('    ⚠️  Multi-theme build requires themes config with enabled: true');
            console.warn('    ℹ️  Falling back to single-theme build via style-dictionary');
            return true;
          }
          try {
            return await executeMultiThemeBuild(
              themesConfig, tokensDir, tokensPackageDir, outputDir, formats, prefix
            );
          } catch (error) {
            console.error(
              `    ❌ Multi-theme build error: ${error instanceof Error ? error.message : UNKNOWN_ERROR_MSG}`
            );
            return false;
          }
        },
      };

    case 'sync':
      return {
        name: displayName,
        fn: () => syncTokensCLI(tokensPackageDir, { syncSource: paths.syncSource, syncTarget: paths.syncTarget }),
      };

    case 'sass-theme':
      return { name: displayName, command: `sass ${SASS_FLAGS} ${paths.sassThemeInput} ${paths.sassThemeOutput}`, cwd: tokensPackageDir };

    case 'sass-theme-minified':
      return { name: displayName, command: `sass ${SASS_FLAGS} ${paths.sassThemeInput} ${paths.sassThemeMinifiedOutput} --style=compressed`, cwd: tokensPackageDir };

    case 'postprocess':
      return {
        name: displayName,
        fn: () => {
          const cssDir = cssOutputDir ?? postprocessConfig?.cssDir ?? join(tokensPackageDir, 'dist/css');
          const result = postprocessCssFiles({
            cssDir, files: postprocessConfig?.files, replacements: postprocessConfig?.replacements, verbose: true,
          });
          return result.success;
        },
      };

    case 'sass-utilities':
      return { name: displayName, command: `sass ${SASS_FLAGS_MINIMAL} ${paths.sassUtilitiesInput} ${paths.sassUtilitiesOutput}`, cwd: tokensPackageDir };

    case 'sass-utilities-minified':
      return { name: displayName, command: `sass ${SASS_FLAGS_MINIMAL} ${paths.sassUtilitiesInput} ${paths.sassUtilitiesMinifiedOutput} --style=compressed`, cwd: tokensPackageDir };

    case 'bundle':
      return { name: displayName, command: 'tsup', cwd: tokensPackageDir };

    default:
      return {
        name: `Unknown step: ${stepName}`,
        fn: () => { console.warn(`⚠️ Unknown pipeline step: ${stepName}`); return true; },
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
  const tokensPackageDir = dirname(tokensDir);

  // Path to figma-exports source directory
  // Use sourceDir from options if provided, otherwise use sibling directory
  const figmaExportsDir = options.sourceDir ?? `${tokensPackageDir}/figma-exports`;

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

  // Get formats from options (default: css, scss, json - no js/ts by default to avoid numeric identifier issues)
  const formats = (options.formats ?? ['css', 'scss', 'json']) as OutputFormat[];

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
      options.themesConfig,
      options.outputDir,
      formats,
      options.cssOutputDir,
      options.postprocessConfig,
      options.prefix
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
// Build Helpers
// ============================================================================

/**
 * Verify that required build directories exist.
 * Returns an error message if a directory is missing, or null if all exist.
 */
function verifyBuildDirectories(tokensDir: string, toolsDir: string): string | null {
  try {
    if (!existsSync(tokensDir)) {
      return `Tokens directory not found: ${tokensDir}`;
    }
  } catch {
    return `Failed to check tokens directory: ${tokensDir}`;
  }

  try {
    if (!existsSync(toolsDir)) {
      return `Tools directory not found: ${toolsDir}`;
    }
  } catch {
    return `Failed to check tools directory: ${toolsDir}`;
  }

  return null;
}

/**
 * Print the build header banner
 */
function printBuildHeader(flags: {
  skipValidate?: boolean;
  onlyTheme?: boolean;
  incremental?: boolean;
  force?: boolean;
}): void {
  console.info('╔════════════════════════════════════════════════════════════╗');
  console.info('║           DSAi Tokens - Complete Build                     ║');
  console.info('╚════════════════════════════════════════════════════════════╝');

  if (flags.skipValidate) {
    console.info('⚠️  Skipping validation (--skip-validate)');
  }
  if (flags.onlyTheme) {
    console.info('⚠️  Building only theme CSS (--only-theme)');
  }
  if (flags.incremental) {
    console.info('🔄 Incremental build enabled');
    if (flags.force) {
      console.info('⚡ Force rebuild - ignoring cache');
    }
  }
}

/**
 * Safely run the preprocessed files cleanup
 */
function cleanupPreprocessedFiles(verbose: boolean): void {
  if (!preprocessCleanup) {return;}
  try {
    preprocessCleanup();
    if (verbose) {
      console.info('🧹 Cleaned up preprocessed files');
    }
  } catch (error) {
    if (verbose) {
      console.warn(
        `⚠️  Failed to cleanup preprocessed files: ${error instanceof Error ? error.message : UNKNOWN_ERROR_MSG}`
      );
    }
  } finally {
    preprocessCleanup = null;
  }
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

  // Use config values from options (already passed from CLI)
  // No need to reload config here - CLI already loaded it
  const cssOutputDir = options.cssOutputDir;
  const postprocessConfig = options.postprocessConfig;

  // Pass config to options so createBuildSteps can access it
  const optionsWithConfig: BuildOptions = {
    ...options,
    cssOutputDir,
    postprocessConfig,
  };

  const startTime = Date.now();
  const stepsCompleted: string[] = [];
  const stepsFailed: string[] = [];
  const errors: string[] = [];
  const warnings: string[] = [];

  // Verify directories exist
  const dirError = verifyBuildDirectories(tokensDir, toolsDir);
  if (dirError) {
    return {
      success: false,
      stepsCompleted,
      stepsFailed: ['Directory Check'],
      duration: Date.now() - startTime,
      errors: [dirError],
      warnings,
    };
  }

  // Print header
  if (verbose && !quiet) {
    printBuildHeader({ skipValidate, onlyTheme, incremental, force });
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
  const steps = createBuildSteps(
    tokensDir,
    toolsDir,
    optionsWithConfig,
    optionsWithConfig.pipeline
  );

  for (const step of steps) {
    const stepIndex = steps.indexOf(step);
    const success = await runStep(step, stepIndex, steps.length, verbose && !quiet);

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

  // Cleanup preprocessed files if they exist
  cleanupPreprocessedFiles(verbose && !quiet);

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
