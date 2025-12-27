# Task: Tokens Package Update

**Task ID:** TASK-107
**Title:** Update @dsai/tokens to Use @dsai/tools
**Priority:** High
**Status:** ✅ Completed
**Assigned To:** AI Assistant
**Blocked by Task:** TASK-101, TASK-102, TASK-103, TASK-104, TASK-105
**Created:** 2024-12-23
**Updated:** 2024-12-23
**Completed:** 2024-12-23

---

## 📋 Task Description

### Goal

Update the `@dsai/tokens` package to depend on `@dsai/tools` for all build, validation, and transformation operations. Replace hardcoded relative paths with proper package imports and update the build pipeline to use the new modular tools.

### Problem/Issue

Current @dsai/tokens issues:

1. **Relative Path Scripts**: All scripts use `../../../tools/scripts/tokens/`
2. **Duplicated SD Config**: `sd.config.mjs` duplicates what should be in @dsai/tools
3. **Not Standalone**: Can't be used outside monorepo
4. **No Override Capability**: External teams can't customize builds
5. **Complex Build Process**: Multiple steps with no orchestration

### Expected Outcome

An updated @dsai/tokens package that:

1. Uses @dsai/tools as a dependency
2. Has simplified build scripts
3. Works as standalone npm package
4. Supports enterprise customization
5. Has cleaner, smaller package.json

---

## 🎯 Acceptance Criteria

### Dependency Update

- [ ] @dsai/tools added as dependency
- [ ] Relative path scripts removed
- [ ] All scripts use @dsai/tools CLI or API

### Build Pipeline

- [ ] `npm run build` uses @dsai/tools
- [ ] Validation uses @dsai/tools
- [ ] Transform uses @dsai/tools
- [ ] Sync uses @dsai/tools

### Configuration

- [ ] Uses dsai.config.mjs for customization
- [ ] SD config imports from @dsai/tools
- [ ] All paths configurable

### Backwards Compatibility

- [ ] Same outputs as before
- [ ] Same export structure
- [ ] No breaking changes to consumers

---

## 📂 Files to Create/Modify

### Files to Modify

```
packages/@dsai/tokens/
├── package.json                    # Update dependencies, scripts
├── dsai.config.mjs                 # NEW: Configuration file
├── sd.config.mjs                   # Simplify to use @dsai/tools
├── project.json                    # Update Nx targets
└── src/
    └── index.ts                    # May need updates
```

### Files to Remove

```
packages/@dsai/tokens/
├── tokens.config.json              # Replaced by dsai.config.mjs
└── build-tokens.cjs               # Replaced by @dsai/tools
```

---

## 🔗 Dependencies

### Prerequisites

- [ ] TASK-101: Package Scaffolding
- [ ] TASK-102: Configuration System
- [ ] TASK-103: Token Scripts
- [ ] TASK-104: Style Dictionary Integration
- [ ] TASK-105: CLI Implementation

### Blocks

- TASK-108: Documentation (documents final setup)
- TASK-109: Testing (tests full integration)

---

## 🧪 Testing Requirements

### Verification Tests

- [ ] Build produces same outputs as before
- [ ] All token files generated correctly
- [ ] CSS variables match expected
- [ ] TypeScript exports work
- [ ] SCSS variables work

### Integration Tests

- [ ] Full build from scratch
- [ ] Incremental builds work
- [ ] Watch mode works
- [ ] Validation catches errors

---

## 📖 Documentation Requirements

- [ ] Updated README.md
- [ ] Migration guide from old structure
- [ ] Configuration examples
- [ ] Enterprise customization guide

---

## 🔄 Implementation Steps

### Step 1: Update Package.json

**packages/@dsai/tokens/package.json (updated):**

```json
{
  "name": "@dsai/tokens",
  "version": "0.0.1",
  "description": "Design System AI - Design Tokens",
  "main": "dist/index.js",
  "module": "dist/index.mjs",
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.js",
      "types": "./dist/index.d.ts"
    },
    "./css": {
      "import": "./dist/css/variables.css",
      "require": "./dist/css/variables.css"
    },
    "./scss": {
      "import": "./dist/scss/_variables.scss",
      "require": "./dist/scss/_variables.scss"
    },
    "./json": {
      "import": "./dist/json/tokens.json",
      "require": "./dist/json/tokens.json"
    }
  },
  "sideEffects": ["*.css", "*.scss"],
  "files": ["dist", "README.md"],
  "scripts": {
    "build": "dsai tokens build && tsup",
    "build:tokens": "dsai tokens build",
    "validate": "dsai tokens validate",
    "validate:fix": "dsai tokens validate --fix",
    "sync": "dsai tokens sync",
    "clean": "rimraf dist",
    "prebuild": "npm run clean && npm run validate",
    "watch": "dsai tokens build --watch",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@dsai/tools": "workspace:*"
  },
  "devDependencies": {
    "rimraf": "^5.0.5",
    "style-dictionary": "^5.1.1",
    "tsup": "^8.3.5",
    "typescript": "~5.6.3"
  },
  "peerDependencies": {
    "style-dictionary": "^5.0.0"
  },
  "peerDependenciesMeta": {
    "style-dictionary": {
      "optional": true
    }
  },
  "publishConfig": {
    "access": "public"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/michelve/dsai.git",
    "directory": "packages/@dsai/tokens"
  },
  "keywords": ["design-tokens", "design-system", "css-variables", "style-dictionary"],
  "license": "MIT"
}
```

### Step 2: Create DSAi Configuration

**packages/@dsai/tokens/dsai.config.mjs:**

```javascript
/**
 * DSAI Configuration for @dsai/tokens
 *
 * This file configures the @dsai/tools build pipeline.
 * Enterprise teams can copy and customize this file.
 */

import { defineConfig } from '@dsai/tools';

export default defineConfig({
  // Global settings
  global: {
    debug: process.env.DEBUG === 'true',
    verbose: process.env.VERBOSE === 'true',
  },

  // Token configuration
  tokens: {
    // Source directory for token files
    sourceDir: './collections',

    // Output directory for generated files
    outputDir: './dist',

    // CSS variable prefix (e.g., --dsai-color-blue-500)
    prefix: '--dsai-',

    // Base font size for rem calculations
    baseFontSize: 16,

    // Output references in generated files
    outputReferences: true,

    // Platforms to build
    platforms: ['css', 'js', 'ts', 'scss', 'scss-dist', 'json'],

    // Style Dictionary configuration overrides
    styleDictionary: {
      // Log level
      log: {
        verbosity: 'default',
        warnings: 'warn',
      },

      // Preprocessors to run
      preprocessors: ['fix-references'],
    },
  },

  // Build hooks (optional)
  hooks: {
    // Before build starts
    onBuildStart: async ({ config }) => {
      console.log('Starting token build...');
    },

    // After build completes
    onBuildEnd: async ({ config, result }) => {
      console.log(`Built ${result.filesWritten} files`);
    },

    // On build error
    onBuildError: async ({ config, error }) => {
      console.error('Build failed:', error.message);
    },
  },
});
```

### Step 3: Simplify SD Config

**packages/@dsai/tokens/sd.config.mjs (simplified):**

```javascript
/**
 * Style Dictionary Configuration
 *
 * This file is a thin wrapper around @dsai/tools SD integration.
 * It's kept for backwards compatibility but delegates to @dsai/tools.
 */

import StyleDictionary from 'style-dictionary';
import { createStyleDictionaryConfig, registerAll } from '@dsai/tools/tokens/style-dictionary';
import { loadConfigSync } from '@dsai/tools/config';

// Load DSAi configuration
const { config } = loadConfigSync({ cwd: import.meta.dirname });

// Register all custom transforms, formats, preprocessors
registerAll(StyleDictionary);

// Create and export Style Dictionary configuration
const sdConfig = createStyleDictionaryConfig(config);

export default sdConfig;
```

### Step 4: Update Project.json

**packages/@dsai/tokens/project.json (updated):**

```json
{
  "name": "@dsai/tokens",
  "$schema": "../../../node_modules/nx/schemas/project-schema.json",
  "projectType": "library",
  "sourceRoot": "packages/@dsai/tokens/src",
  "tags": ["scope:tokens", "type:lib"],
  "targets": {
    "build": {
      "executor": "nx:run-commands",
      "outputs": ["{projectRoot}/dist"],
      "options": {
        "commands": ["dsai tokens build", "tsup --config {projectRoot}/tsup.config.ts"],
        "cwd": "{projectRoot}",
        "parallel": false
      },
      "dependsOn": ["validate", "^build"]
    },
    "build:tokens": {
      "executor": "nx:run-commands",
      "outputs": ["{projectRoot}/dist"],
      "options": {
        "command": "dsai tokens build",
        "cwd": "{projectRoot}"
      }
    },
    "validate": {
      "executor": "nx:run-commands",
      "options": {
        "command": "dsai tokens validate",
        "cwd": "{projectRoot}"
      }
    },
    "sync": {
      "executor": "nx:run-commands",
      "options": {
        "command": "dsai tokens sync",
        "cwd": "{projectRoot}"
      }
    },
    "watch": {
      "executor": "nx:run-commands",
      "options": {
        "command": "dsai tokens build --watch",
        "cwd": "{projectRoot}"
      }
    },
    "lint": {
      "executor": "@nx/eslint:lint",
      "options": {
        "lintFilePatterns": ["packages/@dsai/tokens/**/*.ts"]
      }
    },
    "test": {
      "executor": "@nx/jest:jest",
      "outputs": ["{workspaceRoot}/coverage/packages/@dsai/tokens"],
      "options": {
        "jestConfig": "packages/@dsai/tokens/jest.config.ts"
      }
    }
  }
}
```

### Step 5: Create Migration Script

**packages/@dsai/tokens/scripts/migrate.mjs:**

```javascript
#!/usr/bin/env node

/**
 * Migration script for @dsai/tokens
 *
 * This script helps migrate from the old structure to @dsai/tools.
 * Run with: node scripts/migrate.mjs
 */

import { existsSync, readFileSync, writeFileSync, unlinkSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');

console.log('Migrating @dsai/tokens to use @dsai/tools...\n');

// Step 1: Check for old files to remove
const filesToRemove = [
  'tokens.config.json',
  'build-tokens.cjs',
  'validate-tokens.cjs',
  'transform-tokens.cjs',
];

for (const file of filesToRemove) {
  const filePath = join(projectRoot, file);
  if (existsSync(filePath)) {
    console.log(`Removing deprecated file: ${file}`);
    unlinkSync(filePath);
  }
}

// Step 2: Check for old script references in package.json
const packageJsonPath = join(projectRoot, 'package.json');
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));

// Check for old script patterns
const oldPatterns = [
  '../../../tools/scripts/tokens',
  'node scripts/',
  'tokens:validate',
  'tokens:transform',
  'tokens:sync',
];

let hasOldPatterns = false;
for (const [name, script] of Object.entries(packageJson.scripts || {})) {
  for (const pattern of oldPatterns) {
    if (script.includes(pattern)) {
      console.log(`Found old pattern in script "${name}": ${pattern}`);
      hasOldPatterns = true;
    }
  }
}

if (hasOldPatterns) {
  console.log('\nPlease update package.json scripts to use "dsai" CLI commands.');
}

// Step 3: Check for dsai.config.mjs
const configPath = join(projectRoot, 'dsai.config.mjs');
if (!existsSync(configPath)) {
  console.log('\nCreating dsai.config.mjs...');

  const configContent = `import { defineConfig } from '@dsai/tools';

export default defineConfig({
  tokens: {
    sourceDir: './collections',
    outputDir: './dist',
    prefix: '--dsai-',
    baseFontSize: 16,
  },
});
`;

  writeFileSync(configPath, configContent, 'utf-8');
  console.log('Created dsai.config.mjs');
}

// Step 4: Check for @dsai/tools dependency
if (!packageJson.dependencies?.['@dsai/tools']) {
  console.log('\nNote: Add @dsai/tools as a dependency:');
  console.log('  pnpm add @dsai/tools');
}

console.log('\n✔ Migration check complete!');
console.log('\nNext steps:');
console.log('1. Run: pnpm install');
console.log('2. Run: dsai tokens build');
console.log('3. Verify output in dist/ directory');
```

### Step 6: Update README

**packages/@dsai/tokens/README.md (updated):**

````markdown
# @dsai/tokens

Design tokens for the DSAI Design System.

## Installation

```bash
npm install @dsai/tokens
# or
pnpm add @dsai/tokens
```
````

## Usage

### CSS Variables

```css
@import '@dsai/tokens/css';

.my-component {
  color: var(--dsai-color-blue-500);
  padding: var(--dsai-spacing-4);
}
```

### JavaScript/TypeScript

```typescript
import { tokens } from '@dsai/tokens';

console.log(tokens.color.blue[500]); // '#3b82f6'
```

### SCSS

```scss
@use '@dsai/tokens/scss' as tokens;

.my-component {
  color: tokens.$color-blue-500;
  padding: tokens.$spacing-4;
}
```

## Configuration

This package uses `@dsai/tools` for build configuration. Create a `dsai.config.mjs` file to customize:

```javascript
import { defineConfig } from '@dsai/tools';

export default defineConfig({
  tokens: {
    // Source directory for token collections
    sourceDir: './collections',

    // Output directory
    outputDir: './dist',

    // CSS variable prefix
    prefix: '--mycompany-',

    // Base font size for rem calculations
    baseFontSize: 16,
  },
});
```

## Building Tokens

```bash
# Build all tokens
pnpm run build

# Validate tokens
pnpm run validate

# Validate and fix issues
pnpm run validate:fix

# Watch mode
pnpm run watch
```

## CLI Usage

This package includes the `dsai` CLI from `@dsai/tools`:

```bash
# Build tokens
npx dsai tokens build

# Validate tokens
npx dsai tokens validate

# Show configuration
npx dsai config
```

## Enterprise Customization

See the [@dsai/tools documentation](../tools/README.md) for advanced customization options including:

- Custom transforms
- Custom formats
- Build hooks
- Template overrides

## Exports

| Export              | Description             |
| ------------------- | ----------------------- |
| `@dsai/tokens`      | JavaScript token values |
| `@dsai/tokens/css`  | CSS custom properties   |
| `@dsai/tokens/scss` | SCSS variables          |
| `@dsai/tokens/json` | JSON token data         |

## Token Categories

- **Color**: Brand, semantic, and neutral colors
- **Typography**: Font families, sizes, weights, line heights
- **Spacing**: Consistent spacing scale
- **Border**: Border widths and radii
- **Shadow**: Elevation and shadow tokens
- **Layout**: Breakpoints, containers, grid

## License

MIT

````

### Step 7: Verification Checklist

Create a verification script to ensure the migration is complete:

**packages/@dsai/tokens/scripts/verify.mjs:**

```javascript
#!/usr/bin/env node

/**
 * Verification script for @dsai/tokens migration
 *
 * Ensures the package is correctly set up with @dsai/tools.
 */

import { existsSync, readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');
const distDir = join(projectRoot, 'dist');

console.log('Verifying @dsai/tokens setup...\n');

const checks = [];

// Check 1: dsai.config.mjs exists
checks.push({
  name: 'dsai.config.mjs exists',
  pass: existsSync(join(projectRoot, 'dsai.config.mjs')),
});

// Check 2: @dsai/tools is a dependency
const packageJson = JSON.parse(
  readFileSync(join(projectRoot, 'package.json'), 'utf-8')
);
checks.push({
  name: '@dsai/tools is a dependency',
  pass: !!packageJson.dependencies?.['@dsai/tools'],
});

// Check 3: Scripts use dsai CLI
const scripts = packageJson.scripts || {};
checks.push({
  name: 'build script uses dsai CLI',
  pass: scripts.build?.includes('dsai') || scripts['build:tokens']?.includes('dsai'),
});

// Check 4: No old relative paths
const hasOldPaths = Object.values(scripts).some(s =>
  s.includes('../../../tools/scripts')
);
checks.push({
  name: 'No old relative path scripts',
  pass: !hasOldPaths,
});

// Check 5: dist directory exists (after build)
if (existsSync(distDir)) {
  // Check 5a: CSS output
  checks.push({
    name: 'dist/css/variables.css exists',
    pass: existsSync(join(distDir, 'css', 'variables.css')),
  });

  // Check 5b: JS output
  checks.push({
    name: 'dist/js/tokens.js exists',
    pass: existsSync(join(distDir, 'js', 'tokens.js')),
  });

  // Check 5c: SCSS output
  checks.push({
    name: 'dist/scss/_variables.scss exists',
    pass: existsSync(join(distDir, 'scss', '_variables.scss')),
  });
} else {
  checks.push({
    name: 'dist directory exists (run build first)',
    pass: false,
  });
}

// Print results
console.log('Check Results:');
console.log('─'.repeat(50));

let allPassed = true;
for (const check of checks) {
  const icon = check.pass ? '✔' : '✖';
  const color = check.pass ? '\x1b[32m' : '\x1b[31m';
  console.log(`${color}${icon}\x1b[0m ${check.name}`);
  if (!check.pass) allPassed = false;
}

console.log('─'.repeat(50));

if (allPassed) {
  console.log('\n\x1b[32m✔ All checks passed!\x1b[0m\n');
  process.exit(0);
} else {
  console.log('\n\x1b[31m✖ Some checks failed. Please fix the issues above.\x1b[0m\n');
  process.exit(1);
}
````

---

## 📝 Notes

### Breaking Changes

This update is designed to be **non-breaking** for consumers:

- Same exports (`@dsai/tokens`, `@dsai/tokens/css`, etc.)
- Same CSS variable names
- Same JavaScript token structure

### Internal Changes

For package maintainers:

- Build scripts now use `dsai` CLI
- Configuration moved to `dsai.config.mjs`
- SD config simplified to use @dsai/tools

### Migration for External Teams

If external teams were copying from the monorepo:

1. Install `@dsai/tools`: `npm install @dsai/tools`
2. Create `dsai.config.mjs` with their customizations
3. Update build scripts to use `dsai tokens build`
4. Remove old script files

---

## ✅ Definition of Done

- [ ] package.json updated with @dsai/tools dependency
- [ ] Old relative path scripts removed
- [ ] dsai.config.mjs created
- [ ] sd.config.mjs simplified
- [ ] project.json targets updated
- [ ] Build produces identical outputs
- [ ] All tests pass
- [ ] README updated
- [ ] Migration script works
- [ ] Verification script passes
