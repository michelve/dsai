# Task: Enterprise Documentation

**Task ID:** TASK-108
**Title:** Comprehensive Enterprise Usage Documentation
**Priority:** High
**Status:** ✅ Completed
**Assigned To:** Copilot
**Blocked by Task:** TASK-101, TASK-102, TASK-103, TASK-104, TASK-105, TASK-106, TASK-107
**Created:** 2024-12-23
**Updated:** 2025-01-18
**Completed:** 2025-01-18

---

## 📋 Task Description

### Goal

Create comprehensive documentation for enterprise teams to adopt, customize, and extend `@dsai/tools` and `@dsai/tokens` packages. Documentation should cover all customization points, configuration options, and provide real-world examples.

### Problem/Issue

Current documentation issues:

1. **No Adoption Guide**: No documentation for external teams
2. **No Configuration Reference**: No complete config options list
3. **No Extension Guide**: No guide for adding custom transforms
4. **No Troubleshooting**: No common issues and solutions
5. **No Migration Guide**: No guide for moving from other systems
6. **No API Reference**: No programmatic API documentation

### Expected Outcome

Complete documentation that:

1. Enables quick adoption by enterprise teams
2. Documents all configuration options
3. Provides extension patterns
4. Includes troubleshooting guides
5. Offers migration paths
6. Contains API references

---

## 🎯 Acceptance Criteria

### Documentation Files

- [x] README.md for @dsai/tools
- [x] README.md for @dsai/tokens
- [x] Getting Started guide
- [x] Configuration Reference
- [x] CLI Reference
- [x] API Reference
- [x] Extension Guide
- [x] Migration Guide
- [x] Troubleshooting Guide
- [x] Examples directory

### Quality Standards

- [ ] All code examples tested
- [ ] All config options documented
- [ ] All CLI commands documented
- [ ] Clear navigation structure
- [ ] Searchable content

---

## 📂 Files to Create/Modify

### New Files

```
packages/@dsai/tools/
├── README.md                           # Package overview
├── docs/
│   ├── README.md                       # Docs index
│   ├── getting-started.md              # Quick start guide
│   ├── configuration.md                # Full config reference
│   ├── cli.md                          # CLI reference
│   ├── api/
│   │   ├── README.md                   # API overview
│   │   ├── config.md                   # Config API
│   │   ├── tokens.md                   # Tokens API
│   │   ├── icons.md                    # Icons API
│   │   └── style-dictionary.md         # SD integration API
│   ├── guides/
│   │   ├── README.md                   # Guides overview
│   │   ├── custom-transforms.md        # Adding custom transforms
│   │   ├── custom-formats.md           # Adding custom formats
│   │   ├── custom-templates.md         # Custom icon templates
│   │   ├── multi-brand.md              # Multi-brand setup
│   │   └── ci-cd.md                    # CI/CD integration
│   ├── migration/
│   │   ├── README.md                   # Migration overview
│   │   ├── from-style-dictionary.md    # From vanilla SD
│   │   ├── from-theo.md                # From Salesforce Theo
│   │   └── from-custom.md              # From custom systems
│   └── troubleshooting.md              # Common issues
└── examples/
    ├── basic/                          # Basic usage example
    ├── enterprise/                     # Enterprise setup example
    ├── multi-brand/                    # Multi-brand example
    └── custom-transforms/              # Custom transform example
```

---

## 🔗 Dependencies

### Prerequisites

- [ ] TASK-101 through TASK-107 completed
- [ ] All features implemented and working

### Blocks

- Package release (needs documentation)

---

## 🔄 Implementation Steps

### Step 1: Package README

**packages/@dsai/tools/README.md:**

````markdown
# @dsai/tools

Build, validate, and manage design tokens and icons for the DSAI Design System.

[![npm version](https://img.shields.io/npm/v/@dsai/tools.svg)](https://www.npmjs.com/package/@dsai/tools)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🎨 **Token Management** - Build, validate, and sync design tokens
- 🖼️ **Icon Generation** - Generate React, Vue, and SVG sprite icons
- ⚙️ **Configuration System** - Flexible, layered configuration
- 🔧 **Style Dictionary Integration** - Built-in transforms and formats
- 📦 **Standalone CLI** - Use from command line or as library
- 🏢 **Enterprise Ready** - Full customization for enterprise needs

## Quick Start

### Installation

```bash
npm install @dsai/tools
# or
pnpm add @dsai/tools
```
````

### Initialize Configuration

```bash
npx dsai init
```

### Build Tokens

```bash
npx dsai tokens build
```

## Documentation

- [Getting Started](./docs/getting-started.md)
- [Configuration Reference](./docs/configuration.md)
- [CLI Reference](./docs/cli.md)
- [API Reference](./docs/api/README.md)
- [Guides](./docs/guides/README.md)
- [Migration](./docs/migration/README.md)
- [Troubleshooting](./docs/troubleshooting.md)

## Configuration

Create a `dsai.config.mjs` file in your project root:

```javascript
import { defineConfig } from '@dsai/tools';

export default defineConfig({
  tokens: {
    sourceDir: './tokens',
    outputDir: './dist/tokens',
    prefix: '--mycompany-',
    baseFontSize: 16,
  },
  icons: {
    sourceDir: './icons',
    outputDir: './dist/icons',
    format: 'react',
  },
});
```

## CLI Commands

| Command                | Description                 |
| ---------------------- | --------------------------- |
| `dsai init`            | Initialize configuration    |
| `dsai tokens build`    | Build design tokens         |
| `dsai tokens validate` | Validate token files        |
| `dsai tokens sync`     | Sync tokens flat file       |
| `dsai icons build`     | Generate icon components    |
| `dsai config`          | Show resolved configuration |

## Programmatic API

```typescript
import { loadConfig, buildTokens, buildIcons } from '@dsai/tools';

// Load configuration
const { config } = await loadConfig();

// Build tokens
const tokenResult = await buildTokens(config);
console.log(`Built ${tokenResult.filesWritten} token files`);

// Build icons
const iconResult = await buildIcons(config, { formats: ['react', 'vue'] });
console.log(`Generated ${iconResult.totalIcons} icons`);
```

## Enterprise Usage

For enterprise customization options, see the [Enterprise Guide](./docs/guides/enterprise.md).

### Custom Transforms

```javascript
import { defineConfig } from '@dsai/tools';

export default defineConfig({
  tokens: {
    customTransforms: [
      {
        name: 'custom/uppercase',
        type: 'name',
        transform: (token) => token.path.join('_').toUpperCase(),
      },
    ],
  },
});
```

### Build Hooks

```javascript
import { defineConfig } from '@dsai/tools';

export default defineConfig({
  hooks: {
    onBuildStart: async ({ config }) => {
      console.log('Build starting...');
    },
    onBuildEnd: async ({ config, result }) => {
      // Post-build processing
      await uploadToS3(result.files);
    },
  },
});
```

## Requirements

- Node.js 18+
- Style Dictionary 5+ (peer dependency for token builds)

## License

MIT © DSAI

````

### Step 2: Getting Started Guide

**packages/@dsai/tools/docs/getting-started.md:**

```markdown
# Getting Started

This guide will help you set up @dsai/tools in your project.

## Prerequisites

- Node.js 18 or higher
- npm, yarn, or pnpm

## Installation

```bash
# Using npm
npm install @dsai/tools

# Using pnpm
pnpm add @dsai/tools

# Using yarn
yarn add @dsai/tools
````

## Quick Setup

### 1. Initialize Configuration

Run the init command to create a configuration file:

```bash
npx dsai init
```

This will:

- Create a `dsai.config.mjs` file
- Ask you about your preferences
- Set up default paths

### 2. Add Your Tokens

Create a `collections/` directory with your token files:

```
collections/
├── color/
│   ├── brand.json
│   └── semantic.json
├── typography/
│   └── fonts.json
└── spacing/
    └── scale.json
```

Token files should follow the [DTCG format](https://design-tokens.github.io/community-group/format/):

```json
{
  "color": {
    "blue": {
      "500": {
        "$value": "#3b82f6",
        "$type": "color"
      }
    }
  }
}
```

### 3. Build Tokens

```bash
npx dsai tokens build
```

This generates:

- `dist/css/variables.css` - CSS custom properties
- `dist/js/tokens.js` - JavaScript ES modules
- `dist/scss/_variables.scss` - SCSS variables
- `dist/json/tokens.json` - JSON format

### 4. Use in Your Project

#### CSS

```css
@import '@yourpackage/tokens/css';

.button {
  background: var(--dsai-color-blue-500);
}
```

#### JavaScript

```javascript
import { tokens } from '@yourpackage/tokens';

const primaryColor = tokens.color.blue[500];
```

#### SCSS

```scss
@use '@yourpackage/tokens/scss' as tokens;

.button {
  background: tokens.$color-blue-500;
}
```

## Next Steps

- [Configuration Reference](./configuration.md) - Learn all config options
- [CLI Reference](./cli.md) - Explore CLI commands
- [Custom Transforms](./guides/custom-transforms.md) - Add custom transforms
- [Multi-brand Setup](./guides/multi-brand.md) - Support multiple brands

````

### Step 3: Configuration Reference

**packages/@dsai/tools/docs/configuration.md:**

```markdown
# Configuration Reference

Complete reference for all configuration options.

## Configuration File

@dsai/tools looks for configuration in the following order:

1. `dsai.config.mjs` (recommended)
2. `dsai.config.js`
3. `dsai.config.cjs`
4. `dsai.config.json`
5. `.dsairc.json`
6. `.dsairc`
7. `package.json` (`dsai` field)

## Configuration Schema

```typescript
interface DsaiConfig {
  // Extends another config
  extends?: string;

  // Global settings
  global?: GlobalConfig;

  // Token configuration
  tokens?: TokensConfig;

  // Icon configuration
  icons?: IconsConfig;

  // Build hooks
  hooks?: HooksConfig;
}
````

## Global Configuration

```typescript
interface GlobalConfig {
  // Enable debug output
  debug?: boolean; // default: false

  // Enable verbose output
  verbose?: boolean; // default: false

  // Dry run mode (no file writes)
  dryRun?: boolean; // default: false
}
```

## Tokens Configuration

```typescript
interface TokensConfig {
  // ===== SOURCE CONFIGURATION =====

  // Token source type: 'theme', 'collections', or custom path
  source?: 'theme' | 'collections' | string; // default: 'theme'

  // Directory containing Figma export files
  sourceDir?: string; // default: 'figma-exports'

  // Directory containing token collection files
  collectionsDir?: string; // default: 'collections'

  // Glob patterns for finding Figma exports
  sourcePatterns?: string[]; // default: ['theme.json', 'tokens.json', '*.tokens.json']

  // Map collection names to specific file paths
  collectionMapping?: Record<string, string>;

  // ===== OUTPUT CONFIGURATION =====

  // Output directory (applies to all formats by default)
  outputDir?: string; // default: 'dist'

  // Per-format output directories (overrides outputDir)
  outputDirs?: {
    css?: string;
    scss?: string;
    js?: string;
    ts?: string;
    json?: string;
  };

  // Per-format file names with placeholder support
  outputFileNames?: {
    css?: string; // default: 'tokens.css'
    scss?: string; // default: '_tokens.scss'
    js?: string; // default: 'tokens.js'
    ts?: string; // default: 'tokens.ts'
    json?: string; // default: 'tokens.json'
  };

  // CSS variable prefix
  prefix?: string; // default: '--dsai-'

  // Output formats to generate
  formats?: ('css' | 'scss' | 'js' | 'ts' | 'json')[]; // default: all

  // ===== STYLE MERGE CONFIGURATION =====

  // Additional SCSS directories to merge with token output
  additionalScssDirectories?: string[]; // default: []

  // Additional CSS directories to merge with token output
  additionalCssDirectories?: string[]; // default: []

  // Order of merging: 'before' or 'after' tokens
  mergeOrder?: 'before' | 'after'; // default: 'after'

  // Create combined bundle files
  createBundle?: boolean; // default: false

  // SCSS file to import at top of generated files
  scssImportHeader?: string | string[];

  // ===== THEME CONFIGURATION =====

  themes?: {
    // Auto-detect available modes from Figma export
    autoDetect?: boolean; // default: true

    // Default theme mode (uses :root selector)
    default?: string; // default: 'Light'

    // Modes to ignore during build
    ignoreModes?: string[]; // default: []

    // CSS selector patterns
    selectorPattern?: {
      default?: string; // default: ':root'
      others?: string; // default: '[data-dsai-theme="{mode}"]'
    };
  };

  // ===== BUILD OPTIONS =====

  // Base font size for rem calculations
  baseFontSize?: number; // default: 16

  // Output token references in CSS
  outputReferences?: boolean; // default: true

  // Generate separate files per theme
  separateThemeFiles?: boolean; // default: false

  // Watch mode for continuous building
  watch?: boolean; // default: false

  // Additional directories to watch
  watchDirectories?: string[]; // default: []

  // ===== EXTENSIBILITY =====

  // Custom Style Dictionary transforms
  transforms?: CustomTransform[];

  // Custom Style Dictionary formats
  customFormats?: CustomFormat[];

  // Custom preprocessors
  preprocessors?: CustomPreprocessor[];

  // Custom filters
  filters?: CustomFilter[];

  // ===== BUILD HOOKS =====

  // Called before token build starts
  onBuildStart?: (config: ResolvedConfig) => Promise<void>;

  // Called after each format is generated
  onFormatComplete?: (
    format: string,
    outputPath: string,
    content: string
  ) => Promise<void | string>;

  // Called after all formats are generated
  onAllFormatsComplete?: (outputs: Map<string, string[]>) => Promise<void>;

  // Called after build completes with summary
  onBuildComplete?: (summary: BuildSummary) => Promise<void>;
}
```

## Icons Configuration

```typescript
interface IconsConfig {
  // Source directory for SVG files
  sourceDir?: string; // default: './icons'

  // Output directory for generated components
  outputDir?: string; // default: './dist/icons'

  // Output format
  format?: 'react' | 'vue' | 'svg' | 'svg-sprite'; // default: 'react'

  // Optimize SVGs with SVGO
  optimize?: boolean; // default: true

  // SVGO plugins configuration
  svgoPlugins?: SVGOPlugin[];

  // Custom component template
  template?: (icon: OptimizedSVG) => string;

  // Custom index template
  indexTemplate?: (icons: OptimizedSVG[]) => string;
}
```

## Hooks Configuration

```typescript
interface HooksConfig {
  // Called before build starts
  onBuildStart?: (context: HookContext) => Promise<void> | void;

  // Called after build completes
  onBuildEnd?: (context: HookContext & { result: BuildResult }) => Promise<void> | void;

  // Called on build error
  onBuildError?: (context: HookContext & { error: Error }) => Promise<void> | void;

  // Called after each file is written
  onFileWrite?: (context: HookContext & { file: FileInfo }) => Promise<void> | void;
}

interface HookContext {
  config: ResolvedConfig;
  cwd: string;
}
```

## Example Configurations

### Minimal Configuration

```javascript
import { defineConfig } from '@dsai/tools';

export default defineConfig({
  tokens: {
    prefix: '--myapp-',
  },
});
```

### Full Configuration

```javascript
import { defineConfig } from '@dsai/tools';

export default defineConfig({
  global: {
    debug: process.env.NODE_ENV === 'development',
  },

  tokens: {
    sourceDir: './design-tokens',
    outputDir: './dist/tokens',
    prefix: '--acme-',
    baseFontSize: 16,
    outputReferences: true,
    platforms: ['css', 'js', 'scss'],

    customTransforms: [
      {
        name: 'custom/uppercase-name',
        type: 'name',
        transform: (token) => token.path.join('_').toUpperCase(),
      },
    ],
  },

  icons: {
    sourceDir: './assets/icons',
    outputDir: './dist/icons',
    format: 'react',
    optimize: true,
  },

  hooks: {
    onBuildEnd: async ({ result }) => {
      console.log(`Generated ${result.filesWritten} files`);
    },
  },
});
```

### Enterprise Configuration

```javascript
import { defineConfig } from '@dsai/tools';
import { myCustomTransform } from './transforms/custom.js';
import { myCustomFormat } from './formats/custom.js';

export default defineConfig({
  extends: '@acme/design-tokens-config',

  tokens: {
    prefix: '--acme-',

    customTransforms: [myCustomTransform],
    customFormats: [myCustomFormat],

    styleDictionary: {
      log: {
        verbosity: 'verbose',
      },
    },
  },

  hooks: {
    onBuildEnd: async ({ result }) => {
      // Upload to CDN
      await uploadToCDN(result.files);

      // Notify Slack
      await notifySlack(`Tokens built: ${result.filesWritten} files`);
    },
  },
});
```

### Enterprise Configuration with Custom Source Locations

```javascript
// dsai.config.mjs - Custom Figma export locations
import { defineConfig } from '@dsai/tools';

export default defineConfig({
  tokens: {
    // Custom location for Figma exports
    sourceDir: 'design/figma-exports',

    // Custom patterns for finding token files
    sourcePatterns: [
      '**/*-tokens.json', // Any file ending in -tokens.json
      '**/theme-*.json', // Theme files
      'variables-export.json', // Specific export file
    ],

    // Map Figma collections to specific files (explicit mapping)
    collectionMapping: {
      primitives: 'design/figma-exports/brand-colors.json',
      semantic: 'design/figma-exports/semantic-tokens.json',
      components: 'design/figma-exports/component-tokens.json',
    },

    prefix: '--acme-',
  },
});
```

### Enterprise Configuration with Per-Format Output Directories

```javascript
// dsai.config.mjs - Different output locations per format
import { defineConfig } from '@dsai/tools';

export default defineConfig({
  tokens: {
    // Default output directory
    outputDir: 'dist',

    // Override per format
    outputDirs: {
      css: 'public/styles', // CSS goes to public folder
      scss: 'packages/styles/src/tokens', // SCSS goes to source folder
      js: 'packages/tokens/dist', // JS goes to dist folder
      ts: 'packages/tokens/src', // TS goes to source folder
      json: 'packages/tokens/data', // JSON goes to data folder
    },

    // Custom file naming with theme placeholder
    outputFileNames: {
      css: 'design-tokens-{theme}.css',
      scss: '_design-tokens-{theme}.scss',
      ts: 'tokens.{theme}.ts',
    },
  },
});
```

### Enterprise Configuration with Style Merging

```javascript
// dsai.config.mjs - Merge with existing stylesheets
import { defineConfig } from '@dsai/tools';

export default defineConfig({
  tokens: {
    // Additional SCSS directories to merge with token output
    additionalScssDirectories: [
      'src/styles/overrides', // Token overrides
      'src/styles/custom-mixins', // Custom SCSS mixins
      'src/styles/utilities', // Utility classes
    ],

    // Additional CSS directories to merge
    additionalCssDirectories: [
      'src/styles/base', // Base/reset styles
      'src/styles/vendor', // Vendor CSS
    ],

    // User styles come AFTER generated tokens
    mergeOrder: 'after',

    // Create combined bundle files
    createBundle: true, // Creates tokens-bundle.css and _tokens-bundle.scss

    // Custom SCSS import at top of generated files
    scssImportHeader: [
      '@import "../../variables";',
      '@import "../../mixins";',
      '@import "../../functions";',
    ],
  },
});
```

### Full Enterprise Setup Example

```javascript
// dsai.config.mjs - Complete enterprise configuration
import { defineConfig } from '@dsai/tools';

export default defineConfig({
  global: {
    debug: process.env.NODE_ENV === 'development',
    logLevel: 'info',
  },

  tokens: {
    // ===== SOURCE CONFIGURATION =====
    sourceDir: 'design-system/tokens',
    sourcePatterns: ['**/*.tokens.json'],
    collectionMapping: {
      core: './core-tokens.json',
      brand: './brand-tokens.json',
      'dark-mode': './dark-mode-tokens.json',
    },

    // ===== OUTPUT CONFIGURATION =====
    outputDir: 'dist',
    outputDirs: {
      css: 'dist/css',
      scss: 'packages/styles/src/tokens',
      ts: 'packages/tokens/src',
    },
    outputFileNames: {
      css: 'tokens-{theme}.css',
      scss: '_tokens-{theme}.scss',
    },
    prefix: '--acme-',
    formats: ['css', 'scss', 'ts', 'json'],

    // ===== STYLE MERGE CONFIGURATION =====
    additionalScssDirectories: ['packages/styles/src/custom'],
    additionalCssDirectories: ['packages/styles/src/base'],
    mergeOrder: 'after',
    createBundle: true,
    scssImportHeader: '@import "../../variables";',

    // ===== THEME CONFIGURATION =====
    themes: {
      autoDetect: true,
      default: 'Light',
      ignoreModes: ['Internal-Test'],
      selectorPattern: {
        default: ':root',
        others: '[data-theme="{mode}"]',
      },
    },

    // ===== BUILD OPTIONS =====
    baseFontSize: 16,
    outputReferences: true,
    separateThemeFiles: true,
    watch: false,
    watchDirectories: ['packages/styles/src/custom'],

    // ===== BUILD HOOKS =====
    onBuildStart: async (config) => {
      console.log('Starting token build...');
    },

    onBuildComplete: async (summary) => {
      console.log(`Built ${summary.stats.totalTokens} tokens in ${summary.duration}ms`);
      console.log('Themes:', summary.stats.themes.join(', '));

      // Upload to CDN in production
      if (process.env.NODE_ENV === 'production') {
        await uploadToCDN(summary.outputs);
      }
    },
  },

  icons: {
    sourceDir: './assets/icons',
    outputDir: './dist/icons',
    framework: 'react',
    typescript: true,
    optimize: true,
    prefix: 'AcmeIcon',
  },
});
```

## Environment Variables

| Variable                    | Maps To                          | Description               |
| --------------------------- | -------------------------------- | ------------------------- |
| `DSAI_CONFIG`               | --config                         | Path to config file       |
| `DSAI_DEBUG`                | global.debug                     | Enable debug mode         |
| `DSAI_PREFIX`               | tokens.prefix                    | CSS variable prefix       |
| `DSAI_OUTPUT_DIR`           | tokens.outputDir                 | Output directory          |
| `DSAI_SOURCE_DIR`           | tokens.sourceDir                 | Source directory          |
| `DSAI_THEME_DEFAULT`        | tokens.themes.default            | Default theme name        |
| `DSAI_ADDITIONAL_SCSS_DIRS` | tokens.additionalScssDirectories | Comma-separated SCSS dirs |
| `DSAI_ADDITIONAL_CSS_DIRS`  | tokens.additionalCssDirectories  | Comma-separated CSS dirs  |
| `DSAI_CREATE_BUNDLE`        | tokens.createBundle              | Create bundle files       |
| `NO_COLOR`                  | --                               | Disable colored output    |
| `FORCE_COLOR`               | --                               | Force colored output      |

## Config Resolution

Configuration is resolved in layers:

1. **Defaults** - Built-in defaults
2. **Extends** - Extended configuration files
3. **File** - Your `dsai.config.mjs`
4. **Environment** - Environment variables
5. **CLI** - Command line flags

Later layers override earlier ones.

````

### Step 4: CLI Reference

**packages/@dsai/tools/docs/cli.md:**

```markdown
# CLI Reference

Complete reference for @dsai/tools CLI commands.

## Global Options

These options work with all commands:

| Option | Alias | Description |
|--------|-------|-------------|
| `--config <path>` | `-c` | Path to config file |
| `--cwd <dir>` | | Working directory |
| `--debug` | | Enable debug output |
| `--quiet` | `-q` | Minimal output |
| `--dry-run` | | Don't write files |
| `--help` | `-h` | Show help |
| `--version` | `-v` | Show version |

## Commands

### `dsai init`

Initialize configuration in the current directory.

```bash
dsai init [options]
````

**Options:**

| Option              | Description                                 |
| ------------------- | ------------------------------------------- |
| `--yes`, `-y`       | Skip prompts, use defaults                  |
| `--template <name>` | Config template (minimal, full, enterprise) |

**Examples:**

```bash
# Interactive setup
dsai init

# Quick setup with defaults
dsai init --yes

# Enterprise template
dsai init --template enterprise
```

---

### `dsai tokens build`

Build design tokens from source files.

```bash
dsai tokens build [options]
```

**Options:**

| Option               | Description                             |
| -------------------- | --------------------------------------- |
| `--platforms <list>` | Comma-separated platforms (css,js,scss) |
| `--watch`, `-w`      | Watch mode                              |
| `--clean`            | Clean output before build               |

**Examples:**

```bash
# Build all platforms
dsai tokens build

# Build specific platforms
dsai tokens build --platforms css,js

# Watch mode
dsai tokens build --watch

# Clean build
dsai tokens build --clean
```

---

### `dsai tokens validate`

Validate token files for errors and warnings.

```bash
dsai tokens validate [options]
```

**Options:**

| Option     | Description            |
| ---------- | ---------------------- |
| `--fix`    | Attempt to fix issues  |
| `--strict` | Strict validation mode |

**Examples:**

```bash
# Validate
dsai tokens validate

# Validate and fix
dsai tokens validate --fix

# Strict mode
dsai tokens validate --strict
```

---

### `dsai tokens sync`

Sync tokens flat file for IDE autocomplete.

```bash
dsai tokens sync [options]
```

**Options:**

| Option              | Description                  |
| ------------------- | ---------------------------- |
| `--format <format>` | Output format (flat, nested) |

**Examples:**

```bash
# Sync with default format
dsai tokens sync

# Sync as nested
dsai tokens sync --format nested
```

---

### `dsai icons build`

Generate icon components from SVG files.

```bash
dsai icons build [options]
```

**Options:**

| Option              | Description                            |
| ------------------- | -------------------------------------- |
| `--format <format>` | Output format (react, vue, svg-sprite) |
| `--watch`, `-w`     | Watch mode                             |
| `--no-optimize`     | Skip SVGO optimization                 |

**Examples:**

```bash
# Build React icons
dsai icons build --format react

# Build Vue icons
dsai icons build --format vue

# Build SVG sprite
dsai icons build --format svg-sprite

# Watch mode
dsai icons build --watch
```

---

### `dsai config`

Display resolved configuration.

```bash
dsai config [options]
```

**Options:**

| Option   | Description    |
| -------- | -------------- |
| `--json` | Output as JSON |

**Examples:**

```bash
# Show config
dsai config

# Output as JSON
dsai config --json
```

## Exit Codes

| Code | Meaning             |
| ---- | ------------------- |
| 0    | Success             |
| 1    | General error       |
| 2    | Configuration error |
| 3    | Validation error    |
| 4    | Build error         |
| 5    | I/O error           |

## Scripting Examples

### CI/CD Pipeline

```bash
#!/bin/bash
set -e

# Validate first
dsai tokens validate --strict || exit 1

# Build tokens
dsai tokens build --quiet

# Build icons
dsai icons build --format react --quiet

echo "Build complete!"
```

### Package.json Scripts

```json
{
  "scripts": {
    "tokens:build": "dsai tokens build",
    "tokens:validate": "dsai tokens validate",
    "tokens:watch": "dsai tokens build --watch",
    "icons:build": "dsai icons build --format react",
    "build": "npm run tokens:build && npm run icons:build",
    "prebuild": "dsai tokens validate"
  }
}
```

### Makefile

```makefile
.PHONY: tokens icons build

tokens:
	npx dsai tokens build

icons:
	npx dsai icons build --format react

build: tokens icons

watch:
	npx dsai tokens build --watch
```

````

### Step 5: Troubleshooting Guide

**packages/@dsai/tools/docs/troubleshooting.md:**

```markdown
# Troubleshooting

Common issues and solutions when using @dsai/tools.

## Configuration Issues

### Config file not found

**Error:**
````

Error: No configuration file found

```

**Solution:**
Run `dsai init` to create a configuration file, or create `dsai.config.mjs` manually.

### Invalid configuration

**Error:**
```

Error: Invalid configuration at tokens.prefix
Expected string, received number

```

**Solution:**
Check your configuration against the [Configuration Reference](./configuration.md). The error message indicates which field is invalid.

---

## Token Build Issues

### No token files found

**Error:**
```

Warning: No token files found in ./collections

```

**Solution:**
1. Check that your `sourceDir` path is correct
2. Ensure token files have `.json` extension
3. Verify file structure matches expected format

### Invalid token format

**Error:**
```

Error: Invalid token at color.blue.500
Missing $value property

````

**Solution:**
Tokens must follow the DTCG format with `$value`:

```json
{
  "color": {
    "blue": {
      "500": {
        "$value": "#3b82f6",
        "$type": "color"
      }
    }
  }
}
````

### Unresolved references

**Error:**

```
Error: Unresolved reference {color.primary}
```

**Solution:**

1. Check that the referenced token exists
2. Verify the reference path is correct
3. Ensure referenced token is in the source files

---

## Style Dictionary Issues

### Transform not registered

**Error:**

```
Error: Transform 'custom/my-transform' is not registered
```

**Solution:**
Register custom transforms before building:

```javascript
export default defineConfig({
  tokens: {
    customTransforms: [
      {
        name: 'custom/my-transform',
        type: 'value',
        transform: (token) => token.value,
      },
    ],
  },
});
```

### Format not found

**Error:**

```
Error: Unknown format 'custom/my-format'
```

**Solution:**
Register custom formats in configuration:

```javascript
export default defineConfig({
  tokens: {
    customFormats: [
      {
        name: 'custom/my-format',
        format: ({ dictionary }) => {
          return dictionary.allTokens.map((t) => t.name).join('\n');
        },
      },
    ],
  },
});
```

---

## Icon Build Issues

### SVG parse error

**Error:**

```
Error: Failed to parse icon.svg: Invalid SVG format
```

**Solution:**

1. Validate SVG file is well-formed XML
2. Check for unclosed tags
3. Remove unsupported elements (scripts, foreign objects)

### SVGO optimization failed

**Error:**

```
Error: SVGO optimization failed for icon.svg
```

**Solution:**

1. Check SVG for invalid content
2. Try disabling specific SVGO plugins
3. Set `optimize: false` temporarily to debug

---

## CLI Issues

### Command not found

**Error:**

```
bash: dsai: command not found
```

**Solution:**

1. For global install: `npm install -g @dsai/tools`
2. For local use: `npx dsai` or add to package.json scripts

### Permission denied

**Error:**

```
Error: EACCES: permission denied, open './dist/tokens.css'
```

**Solution:**

1. Check write permissions on output directory
2. Run with appropriate user permissions
3. Avoid running as root

---

## Performance Issues

### Slow builds

**Symptoms:**

- Build takes more than 30 seconds
- High memory usage

**Solutions:**

1. Reduce number of token files
2. Disable unused platforms
3. Use `--quiet` flag in CI
4. Consider splitting into multiple packages

### Watch mode not detecting changes

**Symptoms:**

- File changes not triggering rebuild

**Solutions:**

1. Check file system events (especially in Docker)
2. Verify source directory path is correct
3. Try restarting the watch process

---

## Getting Help

### Debug Mode

Enable debug output for more information:

```bash
dsai tokens build --debug
```

Or set environment variable:

```bash
DSAI_DEBUG=true dsai tokens build
```

### Verbose Output

For even more detail:

```bash
dsai tokens build --debug 2>&1 | tee debug.log
```

### File an Issue

If you can't resolve the issue:

1. Gather debug output
2. Note your Node.js version: `node --version`
3. Note @dsai/tools version: `dsai --version`
4. Create a minimal reproduction
5. [File an issue](https://github.com/michelve/dsai/issues/new)

```

---

## 📝 Notes

### Documentation Standards

- Use clear, concise language
- Include code examples for every concept
- Test all code examples before publishing
- Keep examples realistic and practical
- Update docs with each feature change

### Maintenance

- Review docs quarterly
- Check for broken links monthly
- Update examples when APIs change
- Collect user feedback on docs

---

## ✅ Definition of Done

- [ ] README.md complete for both packages
- [ ] Getting Started guide tested end-to-end
- [ ] All config options documented
- [ ] All CLI commands documented
- [ ] API reference complete
- [ ] All guides written and reviewed
- [ ] Migration guides complete
- [ ] Troubleshooting guide covers common issues
- [ ] Examples directory with working code
- [ ] Documentation reviewed by another developer
- [ ] Search functionality works (if applicable)
```
