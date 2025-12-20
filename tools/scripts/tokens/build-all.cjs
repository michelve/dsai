#!/usr/bin/env node
/**
 * DSAi Tokens - Complete Build Script
 *
 * Runs all token build steps in sequence with clear logging.
 *
 * Usage:
 *   node build-all.cjs           # Full build
 *   node build-all.cjs --skip-validate  # Skip validation
 *   node build-all.cjs --only-theme     # Only build theme CSS
 *
 * Steps:
 *   1. Validate tokens
 *   2. Build Style Dictionary outputs (CSS, JS, TS, SCSS, JSON)
 *   3. Sync tokens-flat.ts
 *   4. Compile Bootstrap theme SCSS → CSS
 *   5. Post-process theme CSS (data-bs-theme → data-dsai-theme)
 *   6. Compile DSAi utilities SCSS → CSS
 *   7. Bundle with tsup (ESM + CJS)
 */

const { execSync } = require('child_process');
const path = require('path');

// Configuration
const TOKENS_DIR = path.resolve(__dirname, '../../../packages/@dsai/tokens');
const TOOLS_DIR = path.resolve(__dirname);

// Parse CLI arguments
const args = process.argv.slice(2);
const skipValidate = args.includes('--skip-validate');
const onlyTheme = args.includes('--only-theme');

// Build steps configuration
const STEPS = [
  {
    name: 'Validate Tokens',
    command: `node ${path.join(TOOLS_DIR, 'validate-tokens.cjs')}`,
    skip: skipValidate,
  },
  {
    name: 'Build Style Dictionary',
    command: 'style-dictionary build --config sd.config.mjs',
    cwd: TOKENS_DIR,
    skip: onlyTheme,
  },
  {
    name: 'Sync tokens-flat.ts',
    command: `node ${path.join(TOOLS_DIR, 'sync-tokens-flat.js')}`,
    skip: onlyTheme,
  },
  {
    name: 'Compile Bootstrap Theme (unminified)',
    command: 'sass --quiet-deps --silence-deprecation=import --silence-deprecation=global-builtin --silence-deprecation=color-functions src/scss/dsai-theme-bs.scss dist/css/dsai-theme-bs.css',
    cwd: TOKENS_DIR,
  },
  {
    name: 'Compile Bootstrap Theme (minified)',
    command: 'sass --quiet-deps --silence-deprecation=import --silence-deprecation=global-builtin --silence-deprecation=color-functions src/scss/dsai-theme-bs.scss dist/css/dsai-theme-bs.min.css --style=compressed',
    cwd: TOKENS_DIR,
  },
  {
    name: 'Post-process Theme CSS',
    command: `node ${path.join(TOOLS_DIR, 'postprocess-theme-css.cjs')}`,
  },
  {
    name: 'Compile DSAi Utilities (unminified)',
    command: 'sass --quiet-deps --silence-deprecation=import src/scss/dsai-utilities.scss dist/css/dsai.css',
    cwd: TOKENS_DIR,
    skip: onlyTheme,
  },
  {
    name: 'Compile DSAi Utilities (minified)',
    command: 'sass --quiet-deps --silence-deprecation=import src/scss/dsai-utilities.scss dist/css/dsai.min.css --style=compressed',
    cwd: TOKENS_DIR,
    skip: onlyTheme,
  },
  {
    name: 'Bundle with tsup',
    command: 'tsup',
    cwd: TOKENS_DIR,
    skip: onlyTheme,
  },
];

/**
 * Run a single build step
 */
function runStep(step, index, total) {
  const stepNum = `[${index + 1}/${total}]`;

  if (step.skip) {
    console.log(`${stepNum} ⏭️  ${step.name} (skipped)`);
    return true;
  }

  console.log(`\n${stepNum} 🔧 ${step.name}`);
  console.log(`    $ ${step.command.split(' ').slice(0, 3).join(' ')}...`);

  try {
    execSync(step.command, {
      cwd: step.cwd || process.cwd(),
      stdio: 'inherit',
      env: { ...process.env, FORCE_COLOR: '1' },
    });
    console.log(`    ✅ Done`);
    return true;
  } catch (error) {
    console.error(`    ❌ Failed: ${error.message}`);
    return false;
  }
}

/**
 * Main build function
 */
function build() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║           DSAi Tokens - Complete Build                     ║');
  console.log('╚════════════════════════════════════════════════════════════╝');

  if (skipValidate) {
    console.log('⚠️  Skipping validation (--skip-validate)');
  }
  if (onlyTheme) {
    console.log('⚠️  Building only theme CSS (--only-theme)');
  }

  const startTime = Date.now();
  let passed = 0;

  for (let i = 0; i < STEPS.length; i++) {
    if (runStep(STEPS[i], i, STEPS.length)) {
      if (!STEPS[i].skip) {
        passed++;
      }
    } else {
      console.error(`\n💥 Build failed at step: ${STEPS[i].name}`);
      process.exit(1);
    }
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);

  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log(`║  ✅ Build Complete                                         ║`);
  console.log(`║  📊 ${passed} steps passed in ${duration}s                              ║`);
  console.log('╚════════════════════════════════════════════════════════════╝');
}

// Run
build();
