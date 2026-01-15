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
 * @module @dsai/tools/tokens/build
 */

/* eslint-disable no-console */
/* eslint-disable security/detect-non-literal-fs-filename */

import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname } from 'node:path';

import { postprocessCLI } from './postprocess.js';
import { syncTokensCLI } from './sync.js';
import { transformTokens } from './transform.js';

import type { BuildOptions, BuildResult, BuildStep } from './types';

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
 * Create build steps based on options
 */
function createBuildSteps(
  tokensDir: string,
  _toolsDir: string,
  options: BuildOptions
): BuildStep[] {
  const { skipValidate, skipTransform, onlyTheme } = options;

  // Get the tokens package root directory
  // tokensDir is typically the collections dir (e.g., packages/@dsai/tokens/collections)
  // We need the package root for running commands
  const tokensPackageDir = tokensDir.endsWith('/collections')
    ? dirname(tokensDir)
    : dirname(tokensDir);

  // Path to figma-exports source directory (sibling to collections)
  const figmaExportsDir = `${tokensPackageDir}/figma-exports`;

  return [
    {
      name: 'Validate Tokens',
      // Use dsai CLI for validation - this uses the native TypeScript implementation
      command: 'dsai tokens validate',
      cwd: tokensPackageDir,
      skip: skipValidate,
    },
    {
      name: 'Transform Figma Tokens',
      // Use native transform function directly
      fn: () => {
        const result = transformTokens({
          sourceDir: figmaExportsDir,
          collectionsDir: tokensDir,
          verbose: true,
        });
        if (!result.success) {
          for (const error of result.errors) {
            console.error(`❌ ${error}`);
          }
        }
        return result.success;
      },
      skip: skipTransform || onlyTheme,
    },
    {
      name: 'Build Style Dictionary',
      command: 'style-dictionary build --config sd.config.mjs',
      cwd: tokensPackageDir,
      skip: onlyTheme,
    },
    {
      name: 'Sync tokens-flat.ts',
      fn: () => syncTokensCLI(tokensPackageDir),
      skip: onlyTheme,
    },
    {
      name: 'Compile Bootstrap Theme (unminified)',
      command: `sass ${SASS_FLAGS} src/scss/dsai-theme-bs.scss dist/css/dsai-theme-bs.css`,
      cwd: tokensPackageDir,
    },
    {
      name: 'Compile Bootstrap Theme (minified)',
      command: `sass ${SASS_FLAGS} src/scss/dsai-theme-bs.scss dist/css/dsai-theme-bs.min.css --style=compressed`,
      cwd: tokensPackageDir,
    },
    {
      name: 'Post-process Theme CSS',
      fn: () => postprocessCLI(tokensPackageDir),
    },
    {
      name: 'Compile DSAi Utilities (unminified)',
      command: `sass ${SASS_FLAGS_MINIMAL} src/scss/dsai-utilities.scss dist/css/dsai.css`,
      cwd: tokensPackageDir,
      skip: onlyTheme,
    },
    {
      name: 'Compile DSAi Utilities (minified)',
      command: `sass ${SASS_FLAGS_MINIMAL} src/scss/dsai-utilities.scss dist/css/dsai.min.css --style=compressed`,
      cwd: tokensPackageDir,
      skip: onlyTheme,
    },
    {
      name: 'Bundle with tsup',
      command: 'tsup',
      cwd: tokensPackageDir,
      skip: onlyTheme,
    },
  ];
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
 *   tokensDir: './packages/@dsai/tokens',
 *   toolsDir: './tools/scripts/tokens',
 * });
 *
 * // Skip validation
 * const result = buildTokens({
 *   tokensDir: './packages/@dsai/tokens',
 *   toolsDir: './tools/scripts/tokens',
 *   skipValidate: true,
 * });
 *
 * // Only build theme CSS
 * const result = buildTokens({
 *   tokensDir: './packages/@dsai/tokens',
 *   toolsDir: './tools/scripts/tokens',
 *   onlyTheme: true,
 * });
 * ```
 */
export function buildTokens(
  tokensDir: string,
  toolsDir: string,
  options: BuildOptions = {}
): BuildResult {
  const { skipValidate, onlyTheme, verbose = true, quiet = false } = options;

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
  }

  // Create and run build steps
  const steps = createBuildSteps(tokensDir, toolsDir, options);

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
export function buildTokensCLI(tokensDir: string, toolsDir: string, args: string[] = []): boolean {
  const skipValidate = args.includes('--skip-validate');
  const skipTransform = args.includes('--skip-transform');
  const onlyTheme = args.includes('--only-theme');
  const quiet = args.includes('--quiet') || args.includes('-q');

  const result = buildTokens(tokensDir, toolsDir, {
    skipValidate,
    skipTransform,
    onlyTheme,
    verbose: !quiet,
    quiet,
  });

  return result.success;
}

/**
 * Parse CLI arguments and run build
 * Used as the main entry point when called directly
 */
export function runBuildCLI(tokensDir: string, toolsDir: string): void {
  const args = process.argv.slice(2);
  const success = buildTokensCLI(tokensDir, toolsDir, args);
  process.exit(success ? 0 : 1);
}
