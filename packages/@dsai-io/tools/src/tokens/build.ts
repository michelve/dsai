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

import { execFileSync } from 'node:child_process';
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

/** Fallback message for non-Error exceptions */
const UNKNOWN_ERROR_MSG = 'Unknown error';

/** Common SASS flags shared between full and minimal configurations */
const SASS_FLAG_QUIET_DEPS = '--quiet-deps';
const SASS_FLAG_SILENCE_IMPORT = '--silence-deprecation=import';

/** Default SASS deprecation silencing flags */
const SASS_FLAGS = [
  SASS_FLAG_QUIET_DEPS,
  SASS_FLAG_SILENCE_IMPORT,
  '--silence-deprecation=global-builtin',
  '--silence-deprecation=color-functions',
];

/** Minimal SASS flags (no color functions deprecation) */
const SASS_FLAGS_MINIMAL = [SASS_FLAG_QUIET_DEPS, SASS_FLAG_SILENCE_IMPORT];

/** Pipeline step name constants to avoid string duplication (S1192) */
const STEP_VALIDATE: BuildPipelineStep = 'validate';
const STEP_SNAPSHOT: BuildPipelineStep = 'snapshot';
const STEP_PREPROCESS: BuildPipelineStep = 'preprocess';
const STEP_TRANSFORM: BuildPipelineStep = 'transform';
const STEP_STYLE_DICTIONARY: BuildPipelineStep = 'style-dictionary';
const STEP_MULTI_THEME: BuildPipelineStep = 'multi-theme';
const STEP_SYNC: BuildPipelineStep = 'sync';
const STEP_SASS_THEME: BuildPipelineStep = 'sass-theme';
const STEP_SASS_THEME_MINIFIED: BuildPipelineStep = 'sass-theme-minified';
const STEP_POSTPROCESS: BuildPipelineStep = 'postprocess';
const STEP_SASS_UTILITIES: BuildPipelineStep = 'sass-utilities';
const STEP_SASS_UTILITIES_MINIFIED: BuildPipelineStep = 'sass-utilities-minified';
const STEP_BUNDLE: BuildPipelineStep = 'bundle';

/** Default build pipeline steps (full @dsai-io/tokens build) */
const DEFAULT_PIPELINE_STEPS: BuildPipelineStep[] = [
  STEP_VALIDATE,
  STEP_SNAPSHOT, // Create backup before transform
  STEP_PREPROCESS, // Extract modes from nested Figma structure
  STEP_TRANSFORM,
  STEP_STYLE_DICTIONARY,
  STEP_SYNC,
  STEP_SASS_THEME,
  STEP_SASS_THEME_MINIFIED,
  STEP_POSTPROCESS,
  STEP_SASS_UTILITIES,
  STEP_SASS_UTILITIES_MINIFIED,
  STEP_BUNDLE,
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
 * Execute a step's function, returning success/failure.
 */
async function runStepFn(fn: NonNullable<BuildStep['fn']>, verbose: boolean): Promise<boolean> {
  try {
    const result = await fn();
    if (result === false) {
      console.error(`    ❌ Failed: Step returned false`);
      return false;
    }
    if (verbose) {
      console.info('    ✅ Done');
    }
    return true;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error(`    ❌ Failed: ${errorMsg}`);
    return false;
  }
}

/**
 * Execute a step's shell command via execFileSync, returning success/failure.
 */
function runStepCommand(command: string, step: BuildStep, verbose: boolean): boolean {
  const args = step.args ?? [];
  if (verbose) {
    const shortCmd = [command, ...args].slice(0, 4).join(' ');
    console.info(`    $ ${shortCmd}...`);
  }

  try {
    execFileSync(command, args, {
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
    return runStepFn(step.fn, verbose);
  }

  if (step.command) {
    return runStepCommand(step.command, step, verbose);
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
  [STEP_VALIDATE, 'Validate Tokens'],
  [STEP_SNAPSHOT, 'Create Snapshot Backup'],
  [STEP_PREPROCESS, 'Preprocess Mode Files'],
  [STEP_TRANSFORM, 'Transform Figma Tokens'],
  [STEP_STYLE_DICTIONARY, 'Build Style Dictionary'],
  [STEP_MULTI_THEME, 'Build Multi-Theme Tokens'],
  [STEP_SYNC, 'Sync tokens-flat.ts'],
  [STEP_SASS_THEME, 'Compile Bootstrap Theme (unminified)'],
  [STEP_SASS_THEME_MINIFIED, 'Compile Bootstrap Theme (minified)'],
  [STEP_POSTPROCESS, 'Post-process Theme CSS'],
  [STEP_SASS_UTILITIES, 'Compile DSAi Utilities (unminified)'],
  [STEP_SASS_UTILITIES_MINIFIED, 'Compile DSAi Utilities (minified)'],
  [STEP_BUNDLE, 'Bundle with tsup'],
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
 * Options for creating a build step from a step name
 */
interface CreateStepOptions {
  stepName: BuildPipelineStep;
  tokensPackageDir: string;
  figmaExportsDir: string;
  tokensDir: string;
  paths: Required<BuildPipelinePaths>;
  sdConfigFile: string;
  strict: boolean;
  snapshotService?: SnapshotService;
  themesConfig?: BuildOptions['themesConfig'];
  outputDir?: string;
  formats?: OutputFormat[];
  cssOutputDir?: string;
  postprocessConfig?: BuildOptions['postprocessConfig'];
  prefix?: string;
}

/**
 * Configuration for creating build steps from step names.
 */
interface StepCreationContext {
  tokensPackageDir: string;
  figmaExportsDir: string;
  tokensDir: string;
  paths: Required<BuildPipelinePaths>;
  sdConfigFile: string;
  strict: boolean;
  snapshotService?: SnapshotService;
  themesConfig?: BuildOptions['themesConfig'];
  outputDir?: string;
  formats: OutputFormat[];
  cssOutputDir?: string;
  postprocessConfig?: BuildOptions['postprocessConfig'];
  prefix?: string;
}

/**
 * Create a single build step from step name
 */
function createStepFromName(stepName: BuildPipelineStep, ctx: StepCreationContext): BuildStep {
  const displayName = STEP_DISPLAY_NAMES.get(stepName) ?? `Unknown: ${stepName}`;
  const {
    tokensPackageDir,
    figmaExportsDir,
    tokensDir,
    paths,
    sdConfigFile,
    strict,
    snapshotService,
    themesConfig,
    outputDir,
    formats,
    cssOutputDir,
    postprocessConfig,
    prefix,
  } = ctx;

  switch (stepName) {
    case STEP_VALIDATE:
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

    case STEP_SNAPSHOT:
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

    case STEP_PREPROCESS:
      return {
        name: displayName,
        fn: async () => {
          try {
            const outputDir = join(figmaExportsDir, '.preprocessed');
            console.info(`    📂 Source: ${figmaExportsDir}`);
            console.info(`    📂 Output: ${outputDir}`);

            // Get all JSON files from the source directory
            const jsonFiles = readdirSync(figmaExportsDir).filter((f) => f.endsWith('.json'));

            if (jsonFiles.length === 0) {
              console.warn(`    ⚠️  No JSON files found in ${figmaExportsDir}`);
              return true; // Not a failure, just skip
            }

            const result = preprocessTokenFiles({
              sourceDir: figmaExportsDir,
              outputDir,
              files: jsonFiles,
              modesPath: ['Foundation', 'modes'],
              verbose: true,
            });

            // Only fail if actual processing errors occurred (not "no modes detected")
            const failedFiles = result.files.filter(
              (f) => !f.success && f.error !== 'No modes detected'
            );
            if (failedFiles.length > 0) {
              console.error(`    ❌ Preprocessing failed for ${failedFiles.length} file(s)`);
              for (const failed of failedFiles) {
                console.error(
                  `       - ${failed.sourceFile}: ${failed.error ?? UNKNOWN_ERROR_MSG}`
                );
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

            // Store cleanup function for later
            preprocessCleanup = result.cleanup;

            return true;
          } catch (error) {
            console.error(
              `    ❌ Preprocessing failed: ${error instanceof Error ? error.message : UNKNOWN_ERROR_MSG}`
            );
            return false;
          }
        },
      };

    case STEP_TRANSFORM:
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

    case STEP_STYLE_DICTIONARY:
      return {
        name: displayName,
        command: 'style-dictionary',
        args: ['build', '--config', sdConfigFile],
        cwd: tokensPackageDir,
      };

    case STEP_MULTI_THEME:
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

    case STEP_SYNC:
      return {
        name: displayName,
        fn: () => syncTokensCLI(tokensPackageDir, { syncSource: paths.syncSource, syncTarget: paths.syncTarget }),
      };

    case STEP_SASS_THEME:
      return {
        name: displayName,
        command: 'sass',
        args: [...SASS_FLAGS, paths.sassThemeInput, paths.sassThemeOutput],
        cwd: tokensPackageDir,
      };

    case STEP_SASS_THEME_MINIFIED:
      return {
        name: displayName,
        command: 'sass',
        args: [
          ...SASS_FLAGS,
          paths.sassThemeInput,
          paths.sassThemeMinifiedOutput,
          '--style=compressed',
        ],
        cwd: tokensPackageDir,
      };

    case STEP_POSTPROCESS:
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

    case STEP_SASS_UTILITIES:
      return {
        name: displayName,
        command: 'sass',
        args: [...SASS_FLAGS_MINIMAL, paths.sassUtilitiesInput, paths.sassUtilitiesOutput],
        cwd: tokensPackageDir,
      };

    case STEP_SASS_UTILITIES_MINIFIED:
      return {
        name: displayName,
        command: 'sass',
        args: [
          ...SASS_FLAGS_MINIMAL,
          paths.sassUtilitiesInput,
          paths.sassUtilitiesMinifiedOutput,
          '--style=compressed',
        ],
        cwd: tokensPackageDir,
      };

    case STEP_BUNDLE:
      return {
        name: displayName,
        command: 'tsup',
        args: [],
        cwd: tokensPackageDir,
      };

    default:
      return {
        name: `Unknown step: ${stepName}`,
        fn: () => { console.warn(`⚠️ Unknown pipeline step: ${stepName}`); return true; },
      };
  }
}

/** Steps that run even when onlyTheme is true */
const THEME_ONLY_ALLOWED_STEPS = new Set<BuildPipelineStep>([
  'validate', 'sass-theme', 'sass-theme-minified', 'postprocess',
]);

/**
 * Determine whether a pipeline step should be skipped based on CLI flags
 */
function shouldSkipStep(
  stepName: BuildPipelineStep,
  flags: { skipValidate?: boolean; skipTransform?: boolean; onlyTheme?: boolean }
): boolean {
  if (stepName === 'validate' && flags.skipValidate) {return true;}
  if (stepName === 'transform' && (flags.skipTransform || flags.onlyTheme)) {return true;}
  if (flags.onlyTheme && !THEME_ONLY_ALLOWED_STEPS.has(stepName)) {return true;}
  return false;
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

  const stepContext: StepCreationContext = {
    tokensPackageDir,
    figmaExportsDir,
    tokensDir,
    paths,
    sdConfigFile,
    strict,
    snapshotService,
    themesConfig: options.themesConfig,
    outputDir: options.outputDir,
    formats,
    cssOutputDir: options.cssOutputDir,
    postprocessConfig: options.postprocessConfig,
    prefix: options.prefix,
  };

  for (const stepName of pipelineSteps) {
    const step = createStepFromName(stepName, stepContext);

    // Apply skip flags based on legacy options
    if (stepName === STEP_VALIDATE && skipValidate) {
      step.skip = true;
    }
    if (stepName === STEP_TRANSFORM && (skipTransform || onlyTheme)) {
      step.skip = true;
    }
    if (
      onlyTheme &&
      ![STEP_SASS_THEME, STEP_SASS_THEME_MINIFIED, STEP_POSTPROCESS].includes(stepName)
    ) {
      // Only run theme-related steps when onlyTheme is true
      if (stepName !== STEP_VALIDATE) {
        step.skip = true;
      }
    }

    step.skip = shouldSkipStep(stepName, { skipValidate, skipTransform, onlyTheme });
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
/**
 * Create a failed BuildResult for directory check errors.
 */
function directoryCheckFailure(startTime: number, errorMsg: string): BuildResult {
  return {
    success: false,
    stepsCompleted: [],
    stepsFailed: ['Directory Check'],
    duration: Date.now() - startTime,
    errors: [errorMsg],
    warnings: [],
  };
}

/**
 * Verify that required build directories exist.
 * Returns a BuildResult on failure, or undefined on success.
 */
function verifyBuildDirectories(
  tokensDir: string,
  toolsDir: string,
  startTime: number
): BuildResult | undefined {
  try {
    if (!existsSync(tokensDir)) {
      return directoryCheckFailure(startTime, `Tokens directory not found: ${tokensDir}`);
    }
  } catch {
    return directoryCheckFailure(startTime, `Failed to check tokens directory: ${tokensDir}`);
  }

  try {
    if (!existsSync(toolsDir)) {
      return directoryCheckFailure(startTime, `Tools directory not found: ${toolsDir}`);
    }
  } catch {
    return directoryCheckFailure(startTime, `Failed to check tools directory: ${toolsDir}`);
  }

  return undefined;
}

/**
 * Log the build header banner and option flags.
 */
function logBuildHeader(options: BuildOptions): void {
  console.info('╔════════════════════════════════════════════════════════════╗');
  console.info('║           DSAi Tokens - Complete Build                     ║');
  console.info('╚════════════════════════════════════════════════════════════╝');

  if (options.skipValidate) {
    console.info('⚠️  Skipping validation (--skip-validate)');
  }
  if (options.onlyTheme) {
    console.info('⚠️  Building only theme CSS (--only-theme)');
  }
  if (options.incremental) {
    console.info('🔄 Incremental build enabled');
    if (options.force) {
      console.info('⚡ Force rebuild - ignoring cache');
    }
  }
}

/**
 * Perform incremental change analysis. Returns a skip result if no changes detected.
 */
async function performIncrementalAnalysis(
  tokensDir: string,
  options: { force: boolean; cacheDir?: string; verbose: boolean },
  startTime: number
): Promise<{
  cacheService: CacheService;
  analysis: Awaited<ReturnType<typeof analyzeChanges>>;
  skipResult?: BuildResult;
}> {
  const cacheService = new CacheService({
    cacheDir: options.cacheDir || `${tokensDir}/.dsai-cache`,
    enabled: true,
  });

  const figmaExportsDir = `${tokensDir}/figma-exports`;
  const incrementalOptions: IncrementalOptions = {
    enabled: true,
    force: options.force,
    cacheService,
    verbose: options.verbose,
  };

  const analysis = await analyzeChanges(figmaExportsDir, incrementalOptions);

  if (!analysis.needsFullBuild && analysis.changedFiles.length === 0) {
    const duration = Date.now() - startTime;

    if (options.verbose) {
      console.info(generateIncrementalReport(analysis, startTime, 0, 0));
    }

    return {
      cacheService,
      analysis,
      skipResult: {
        success: true,
        stepsCompleted: ['Cache Check'],
        stepsFailed: [],
        duration,
        errors: [],
        warnings: ['No changes detected - build skipped'],
      },
    };
  }

  return { cacheService, analysis };
}

/**
 * Execute all build steps in sequence. Returns on first failure.
 */
async function executeBuildSteps(
  steps: BuildStep[],
  verbose: boolean,
  startTime: number
): Promise<BuildResult | { stepsCompleted: string[] }> {
  const stepsCompleted: string[] = [];

  for (const [i, step] of steps.entries()) {
    const success = await runStep(step, i, steps.length, verbose);

    if (success) {
      if (!step.skip) {
        stepsCompleted.push(step.name);
      }
      continue;
    }

    if (verbose) {
      console.error(`\n💥 Build failed at step: ${step.name}`);
    }

    return {
      success: false,
      stepsCompleted,
      stepsFailed: [step.name],
      duration: Date.now() - startTime,
      errors: [`Build failed at step: ${step.name}`],
      warnings: [],
    };
  }

  return { stepsCompleted };
}

/**
 * Update incremental cache and log report after a successful build.
 */
async function finalizeIncrementalBuild(
  tokensDir: string,
  cacheService: CacheService,
  analysis: Awaited<ReturnType<typeof analyzeChanges>>,
  stepsCompleted: number,
  totalSteps: number,
  startTime: number,
  verbose: boolean
): Promise<void> {
  const figmaExportsDir = `${tokensDir}/figma-exports`;
  const collectionsDir = `${tokensDir}/collections`;

  await updateCacheAfterBuild(
    cacheService,
    analysis.changedFiles,
    [],
    figmaExportsDir,
    collectionsDir,
    verbose
  );

  if (verbose) {
    console.info(generateIncrementalReport(analysis, startTime, stepsCompleted, totalSteps));
  }
}

/**
 * Clean up any preprocessed temp files created during the build.
 */
function cleanupPreprocessedFiles(verbose: boolean): void {
  if (!preprocessCleanup) {
    return;
  }

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

/**
 * Log the build completion footer.
 */
function logBuildFooter(stepsCompleted: number, durationSec: string): void {
  console.info('\n╔════════════════════════════════════════════════════════════╗');
  console.info('║  ✅ Build Complete                                         ║');
  console.info(
    `║  📊 ${stepsCompleted} steps passed in ${durationSec}s                              ║`
  );
  console.info('╚════════════════════════════════════════════════════════════╝');
}

export async function buildTokens(
  tokensDir: string,
  toolsDir: string,
  options: BuildOptions = {}
): Promise<BuildResult> {
  const { verbose = true, quiet = false, incremental = false, force = false, cacheDir } = options;
  const shouldLog = verbose && !quiet;

  const optionsWithConfig: BuildOptions = {
    ...options,
    cssOutputDir: options.cssOutputDir,
    postprocessConfig: options.postprocessConfig,
  };

  const startTime = Date.now();

  // Verify directories exist
  const dirError = verifyBuildDirectories(tokensDir, toolsDir, startTime);
  if (dirError) {
    return dirError;
  }

  // Print header
  if (shouldLog) {
    logBuildHeader(options);
  }

  // Incremental build analysis
  let cacheService: CacheService | undefined;
  let incrementalAnalysis: Awaited<ReturnType<typeof analyzeChanges>> | undefined;

  if (incremental) {
    const result = await performIncrementalAnalysis(
      tokensDir,
      { force, cacheDir, verbose: shouldLog },
      startTime
    );
    cacheService = result.cacheService;
    incrementalAnalysis = result.analysis;
    if (result.skipResult) {
      return result.skipResult;
    }
  }

  // Create and run build steps
  const steps = createBuildSteps(
    tokensDir,
    toolsDir,
    optionsWithConfig,
    optionsWithConfig.pipeline
  );
  const stepResult = await executeBuildSteps(steps, shouldLog, startTime);

  // If executeBuildSteps returned a full BuildResult, it failed
  if ('success' in stepResult) {
    return stepResult;
  }

  const { stepsCompleted } = stepResult;
  const duration = Date.now() - startTime;

  // Update cache after successful incremental build
  if (incremental && cacheService && incrementalAnalysis) {
    await finalizeIncrementalBuild(
      tokensDir,
      cacheService,
      incrementalAnalysis,
      stepsCompleted.length,
      steps.length,
      startTime,
      shouldLog
    );
  }

  // Cleanup preprocessed files
  cleanupPreprocessedFiles(shouldLog);

  // Print footer
  if (shouldLog) {
    logBuildFooter(stepsCompleted.length, durationSec);
  }

  return {
    success: true,
    stepsCompleted,
    stepsFailed: [],
    duration,
    errors: [],
    warnings: [],
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
