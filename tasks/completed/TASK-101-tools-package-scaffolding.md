# Task: @DSAi/tools Package Scaffolding

**Task ID:** TASK-101
**Title:** @DSAi/tools Package Scaffolding and Initial Setup
**Priority:** High
**Status:** ⚪ Not Started
**Assigned To:** Unassigned
**Blocked by Task:** None
**Created:** 2024-12-23
**Updated:** 2024-12-23

---

## 📋 Task Description

### Goal

Create the foundational package structure for `@dsai/tools` with proper TypeScript configuration, build setup, dependencies, and exports. This establishes the base upon which all subsequent tooling will be built.

### Problem/Issue

Currently, build scripts exist in `tools/scripts/` directory which:

- Cannot be consumed as an npm dependency
- Has no proper package structure
- Uses CommonJS (`.cjs`) instead of modern ESM
- Has no TypeScript types
- Cannot be versioned independently

### Expected Outcome

A fully scaffolded `@dsai/tools` package that:

1. Builds successfully with tsup
2. Exports both ESM and CJS formats
3. Includes TypeScript declarations
4. Has proper bin entry for CLI
5. Integrates with Nx workspace
6. Has placeholder exports for all planned modules

---

## 🎯 Acceptance Criteria

### Package Structure

- [ ] `packages/@dsai/tools/` directory created
- [ ] `package.json` with correct metadata, exports, bin, scripts
- [ ] `tsconfig.json` extending base config
- [ ] `tsup.config.ts` for bundling
- [ ] `project.json` for Nx integration
- [ ] `README.md` with package overview
- [ ] `.gitignore` for build artifacts

### Source Structure

- [ ] `src/index.ts` - Main entry with all exports
- [ ] `src/config/index.ts` - Config module placeholder
- [ ] `src/tokens/index.ts` - Tokens module placeholder
- [ ] `src/icons/index.ts` - Icons module placeholder
- [ ] `src/cli/index.ts` - CLI module placeholder
- [ ] `src/utils/index.ts` - Utilities module placeholder

### Build Output

- [ ] `dist/index.js` (ESM)
- [ ] `dist/index.cjs` (CommonJS)
- [ ] `dist/index.d.ts` (TypeScript declarations)
- [ ] `bin/dsai-tools.mjs` executable

### Integration

- [ ] Package builds with `pnpm build`
- [ ] Package lints with `pnpm lint`
- [ ] Package tests with `pnpm test`
- [ ] Nx graph shows package correctly
- [ ] Can be consumed by `@dsai/tokens` as dependency

---

## 📂 Files to Create

### Core Package Files

```
packages/@dsai/tools/
├── package.json
├── tsconfig.json
├── tsconfig.build.json
├── tsup.config.ts
├── project.json
├── README.md
├── .gitignore
├── jest.config.ts
└── bin/
    └── dsai-tools.mjs
```

### Source Files

```
packages/@dsai/tools/src/
├── index.ts
├── version.ts
├── config/
│   └── index.ts
├── tokens/
│   └── index.ts
├── icons/
│   └── index.ts
├── cli/
│   └── index.ts
└── utils/
    └── index.ts
```

---

## 🔗 Dependencies

### Prerequisites

- [ ] None - this is the foundation task

### Blocks

- TASK-102: Configuration System (requires package structure)
- TASK-103: Token Scripts Migration (requires package structure)
- TASK-104: Style Dictionary Integration (requires package structure)
- TASK-105: CLI Implementation (requires package structure)
- TASK-106: Icons Migration (requires package structure)

---

## 🧪 Testing Requirements

- [ ] Package builds without errors
- [ ] Package can be imported in Node.js
- [ ] TypeScript types resolve correctly
- [ ] CLI executable has correct permissions
- [ ] Nx commands work (`nx build @dsai/tools`)

---

## 📖 Documentation Requirements

- [ ] README.md with package overview
- [ ] JSDoc comments on all exports
- [ ] Package.json description accurate

---

## 🔄 Implementation Steps

### Step 1: Create Directory Structure

```bash
mkdir -p packages/@dsai/tools/{src/{config,tokens,icons,cli,utils},bin,tests}
```

### Step 2: Create package.json

```json
{
  "name": "@dsai/tools",
  "version": "0.0.1",
  "description": "Build tooling and CLI for DSAi Design System",
  "type": "module",
  "main": "dist/index.cjs",
  "module": "dist/index.js",
  "types": "dist/index.d.ts",
  "bin": {
    "dsai-tools": "./bin/dsai-tools.mjs"
  },
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    },
    "./config": {
      "types": "./dist/config/index.d.ts",
      "import": "./dist/config/index.js",
      "require": "./dist/config/index.cjs"
    },
    "./tokens": {
      "types": "./dist/tokens/index.d.ts",
      "import": "./dist/tokens/index.js",
      "require": "./dist/tokens/index.cjs"
    },
    "./icons": {
      "types": "./dist/icons/index.d.ts",
      "import": "./dist/icons/index.js",
      "require": "./dist/icons/index.cjs"
    },
    "./cli": {
      "types": "./dist/cli/index.d.ts",
      "import": "./dist/cli/index.js",
      "require": "./dist/cli/index.cjs"
    }
  },
  "files": ["dist", "bin", "templates"],
  "scripts": {
    "build": "tsup",
    "build:watch": "tsup --watch",
    "dev": "tsup --watch",
    "test": "jest",
    "lint": "eslint src --ext .ts",
    "typecheck": "tsc --noEmit"
  },
  "keywords": ["design-tokens", "design-system", "cli", "style-dictionary", "build-tools"],
  "license": "UNLICENSED",
  "engines": {
    "node": ">=22.0.0"
  },
  "dependencies": {
    "commander": "^12.0.0",
    "cosmiconfig": "^9.0.0",
    "zod": "^3.23.0",
    "picocolors": "^1.0.0",
    "ora": "^8.0.0"
  },
  "devDependencies": {
    "style-dictionary": "^5.1.1",
    "typescript": "^5.4.0"
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
  }
}
```

### Step 3: Create tsconfig.json

```json
{
  "extends": "../../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "declaration": true,
    "declarationMap": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "target": "ES2022",
    "lib": ["ES2022"],
    "types": ["node"]
  },
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
```

### Step 4: Create tsup.config.ts

```typescript
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'config/index': 'src/config/index.ts',
    'tokens/index': 'src/tokens/index.ts',
    'icons/index': 'src/icons/index.ts',
    'cli/index': 'src/cli/index.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  sourcemap: true,
  splitting: false,
  treeshake: true,
  external: ['style-dictionary'],
  banner: {
    js: '/* @dsai/tools - DSAi Design System Build Tools */',
  },
});
```

### Step 5: Create project.json (Nx)

```json
{
  "name": "@dsai/tools",
  "$schema": "../../../node_modules/nx/schemas/project-schema.json",
  "sourceRoot": "packages/@dsai/tools/src",
  "projectType": "library",
  "tags": ["scope:tools", "type:util"],
  "targets": {
    "build": {
      "executor": "nx:run-commands",
      "options": {
        "command": "tsup",
        "cwd": "packages/@dsai/tools"
      },
      "outputs": ["{projectRoot}/dist"]
    },
    "test": {
      "executor": "@nx/jest:jest",
      "outputs": ["{workspaceRoot}/coverage/{projectRoot}"],
      "options": {
        "jestConfig": "packages/@dsai/tools/jest.config.ts"
      }
    },
    "lint": {
      "executor": "@nx/eslint:lint",
      "options": {
        "lintFilePatterns": ["packages/@dsai/tools/**/*.ts"]
      }
    }
  }
}
```

### Step 6: Create CLI Entry Point

```javascript
#!/usr/bin/env node
// bin/dsai-tools.mjs

import { run } from '../dist/cli/index.js';

run(process.argv.slice(2)).catch((error) => {
  console.error(error);
  process.exit(1);
});
```

### Step 7: Create Source Entry Points

**src/index.ts:**

```typescript
/**
 * @dsai/tools - DSAi Design System Build Tools
 *
 * Enterprise-grade tooling for design token management,
 * icon generation, and build orchestration.
 *
 * @packageDocumentation
 */

// Version
export { version } from './version.js';

// Configuration
export * from './config/index.js';

// Token tooling
export * from './tokens/index.js';

// Icon tooling
export * from './icons/index.js';

// Utilities
export * from './utils/index.js';

// Re-export defineConfig for convenience
export { defineConfig } from './config/index.js';
```

**src/version.ts:**

```typescript
export const version = '0.0.1';
```

**src/config/index.ts:**

```typescript
/**
 * Configuration module for @dsai/tools
 *
 * Provides configuration loading, validation, and resolution.
 *
 * @packageDocumentation
 */

export interface DsaiConfig {
  tokens?: TokensConfig;
  icons?: IconsConfig;
}

export interface TokensConfig {
  source?: 'theme' | 'collections' | string;
  sourceDir?: string;
  collectionsDir?: string;
  outputDir?: string;
  prefix?: string;
  themes?: ThemesConfig;
  transforms?: unknown[];
  formats?: unknown[];
  preprocessors?: unknown[];
}

export interface ThemesConfig {
  autoDetect?: boolean;
  default?: string;
  ignoreModes?: string[];
  selectorPattern?: {
    default?: string;
    others?: string;
  };
}

export interface IconsConfig {
  sourceDir?: string;
  outputDir?: string;
  framework?: 'react' | 'vue' | 'svelte';
}

/**
 * Define DSAi configuration with type safety
 */
export function defineConfig(config: DsaiConfig): DsaiConfig {
  return config;
}

// Placeholder exports - to be implemented in TASK-102
export async function loadConfig(_cwd?: string): Promise<DsaiConfig> {
  return {};
}

export function resolveConfig(_config: Partial<DsaiConfig>): DsaiConfig {
  return {};
}
```

**src/tokens/index.ts:**

```typescript
/**
 * Token tooling module for @dsai/tools
 *
 * Provides token validation, transformation, and building.
 *
 * @packageDocumentation
 */

// Placeholder exports - to be implemented in TASK-103
export async function validateTokens(_options?: unknown): Promise<boolean> {
  console.log('Token validation not yet implemented');
  return true;
}

export async function transformTokens(_options?: unknown): Promise<void> {
  console.log('Token transformation not yet implemented');
}

export async function buildTokens(_options?: unknown): Promise<void> {
  console.log('Token build not yet implemented');
}

export async function syncTokens(_options?: unknown): Promise<void> {
  console.log('Token sync not yet implemented');
}
```

**src/icons/index.ts:**

```typescript
/**
 * Icon tooling module for @dsai/tools
 *
 * Provides icon generation and optimization.
 *
 * @packageDocumentation
 */

// Placeholder exports - to be implemented in TASK-106
export async function generateIcons(_options?: unknown): Promise<void> {
  console.log('Icon generation not yet implemented');
}
```

**src/cli/index.ts:**

```typescript
/**
 * CLI module for @dsai/tools
 *
 * Command-line interface for DSAi tooling.
 *
 * @packageDocumentation
 */

import { version } from '../version.js';

// Placeholder - to be implemented in TASK-105
export async function run(args: string[]): Promise<void> {
  if (args.includes('--version') || args.includes('-v')) {
    console.log(`@dsai/tools v${version}`);
    return;
  }

  if (args.includes('--help') || args.includes('-h') || args.length === 0) {
    console.log(`
@dsai/tools v${version}

Usage: dsai-tools <command> [options]

Commands:
  tokens build      Build design tokens
  tokens validate   Validate token structure
  tokens transform  Transform Figma tokens
  icons generate    Generate icon components
  init              Initialize configuration file

Options:
  -v, --version     Show version
  -h, --help        Show help
  --config <path>   Path to config file
  --cwd <path>      Working directory

Documentation: https://dsai.design/tools
    `);
    return;
  }

  console.log('Command not yet implemented:', args.join(' '));
}
```

**src/utils/index.ts:**

```typescript
/**
 * Utility functions for @dsai/tools
 *
 * @packageDocumentation
 */

import { resolve, dirname } from 'node:path';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

/**
 * Get the package root directory
 */
export function getPackageRoot(): string {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  return resolve(__dirname, '..');
}

/**
 * Resolve a path relative to cwd or absolute
 */
export function resolvePath(path: string, cwd: string = process.cwd()): string {
  if (path.startsWith('/')) {
    return path;
  }
  return resolve(cwd, path);
}

/**
 * Check if a file exists
 */
export function fileExists(path: string): boolean {
  return existsSync(path);
}

/**
 * Logger with colored output
 */
export const logger = {
  info: (msg: string) => console.log(`ℹ️  ${msg}`),
  success: (msg: string) => console.log(`✅ ${msg}`),
  warn: (msg: string) => console.warn(`⚠️  ${msg}`),
  error: (msg: string) => console.error(`❌ ${msg}`),
  debug: (msg: string) => {
    if (process.env.DEBUG) {
      console.log(`🔍 ${msg}`);
    }
  },
};
```

### Step 8: Create README.md

```markdown
# @dsai/tools

Build tooling and CLI for DSAi Design System.

## Installation

\`\`\`bash
pnpm add -D @dsai/tools
\`\`\`

## Usage

### CLI

\`\`\`bash

# Build design tokens

dsai-tools tokens build

# Validate tokens

dsai-tools tokens validate

# Generate icons

dsai-tools icons generate

# Initialize config

dsai-tools init
\`\`\`

### Programmatic

\`\`\`typescript
import { buildTokens, validateTokens, loadConfig } from '@dsai/tools';

// Load config
const config = await loadConfig();

// Build tokens
await buildTokens(config);

// Validate tokens
const valid = await validateTokens(config);
\`\`\`

### Configuration

Create a \`dsai.config.mjs\` in your project root:

\`\`\`javascript
import { defineConfig } from '@dsai/tools';

export default defineConfig({
tokens: {
prefix: '--mycompany-',
outputDir: './design-tokens/dist',
themes: {
default: 'Light',
selectorPattern: {
others: '[data-theme="{mode}"]'
}
}
}
});
\`\`\`

## Documentation

See [DSAi Tools Documentation](https://dsai.design/tools) for full documentation.
```

### Step 9: Create .gitignore

```
dist/
node_modules/
*.tsbuildinfo
.turbo/
coverage/
```

### Step 10: Create jest.config.ts

```typescript
export default {
  displayName: '@dsai/tools',
  preset: '../../../jest.preset.cjs',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { useESM: true }],
  },
  moduleFileExtensions: ['ts', 'js'],
  extensionsToTreatAsEsm: ['.ts'],
  coverageDirectory: '../../../coverage/packages/@dsai/tools',
};
```

### Step 11: Verify Build

```bash
cd packages/@dsai/tools
pnpm install
pnpm build
```

### Step 12: Test CLI Executable

```bash
chmod +x bin/dsai-tools.mjs
./bin/dsai-tools.mjs --version
./bin/dsai-tools.mjs --help
```

---

## 📝 Notes

### Design Decisions

1. **ESM First**: Package uses ESM as primary format with CJS fallback
2. **Peer Dependencies**: style-dictionary is optional peer dep (only needed for token builds)
3. **No Bundled CLI Deps**: CLI deps (commander, ora) are runtime deps
4. **Separate Entries**: Each module has its own entry point for tree-shaking

### Testing Strategy

- Basic import/export tests in this task
- Full functionality tests added in respective implementation tasks

### Known Limitations

- Placeholder implementations only
- CLI commands not functional yet
- Config loading not implemented

---

## ✅ Definition of Done

- [ ] All directories and files created
- [ ] Package builds without errors
- [ ] `pnpm nx build @dsai/tools` succeeds
- [ ] CLI shows version and help
- [ ] TypeScript types export correctly
- [ ] README.md documents usage
- [ ] Package can be imported by @dsai/tokens
