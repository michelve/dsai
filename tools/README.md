# Tools Directory

This directory contains utility scripts and development tools that are **not** part of the `@dsai/tools` package. These scripts remain here because they are:

- **Shell scripts** that can't be easily converted to TypeScript
- **One-off utilities** used infrequently for specific tasks
- **External integrations** (Storybook, GitHub automation)
- **Metadata generators** and development resources

## 🔄 Migrated to @DSAi/tools

The following functionality has been migrated to the `@dsai/tools` package and should be accessed via the `dsai` CLI:

| Old Script                         | New CLI Command           | Description                           |
| ---------------------------------- | ------------------------- | ------------------------------------- |
| `scripts/tokens/validate-tokens.*` | `dsai tokens validate`    | Validate token structure and values   |
| `scripts/tokens/transform-*.cjs`   | `dsai tokens build`       | Transform Figma tokens to DTCG format |
| `scripts/tokens/sync-tokens-*.js`  | `dsai tokens sync`        | Sync tokens-flat.ts file              |
| `scripts/tokens/postprocess-*.cjs` | `dsai tokens postprocess` | Post-process theme CSS files          |
| `scripts/tokens/merge-*.cjs`       | `dsai tokens merge`       | Merge token collections               |
| `scripts/tokens/build-all.cjs`     | `dsai tokens build`       | Complete token build pipeline         |
| Icon generation scripts            | `dsai icons build`        | Build React icon components           |

See [`packages/@dsai/tools/README.md`](../packages/@dsai/tools/README.md) for full CLI documentation.

## 📁 Directory Structure

```plaintext
tools/
├── component-metadata/    # React component metadata extraction
├── dev-resources/         # Development guidelines and resources
├── icons/                 # Icon assets, templates, and Figma plugin
└── scripts/               # Utility scripts by category
    ├── analysis/          # Code analysis tools
    ├── github/            # GitHub/CI automation
    ├── icons/             # Icon metadata utilities
    ├── storybook/         # Storybook shell scripts
    └── tokens/            # One-off token utilities
```

## 📂 Remaining Tools

### `component-metadata/`

Extracts metadata from React components for documentation and tooling.

| Script                   | Description                               |
| ------------------------ | ----------------------------------------- |
| `importComponentJSON.js` | Imports component metadata from JSON      |
| `exportComponentJSON.js` | Exports component metadata to JSON format |

### `dev-resources/`

Development guidelines, resources, and documentation templates.

### `icons/`

Icon assets, templates, and the Figma plugin for icon generation.

| Directory/File            | Description                                       |
| ------------------------- | ------------------------------------------------- |
| `figma-plugin-icons-tsx/` | Figma plugin for generating React icon components |
| `README.md`               | Detailed documentation for icon generation        |

### `scripts/`

Utility scripts organized by category. See [`scripts/README.md`](./scripts/README.md) for detailed documentation.

#### `scripts/analysis/`

| Script                     | Description                            | Usage                         |
| -------------------------- | -------------------------------------- | ----------------------------- |
| `analyze-button-usage.cjs` | Analyze Button component accessibility | `pnpm analyze:buttons [path]` |

#### `scripts/github/`

| Script                           | Description                         | Usage            |
| -------------------------------- | ----------------------------------- | ---------------- |
| `export-tasks-to-github-csv.cjs` | Export tasks to CSV for GitHub      | CI/CD automation |
| `update-issue-labels.cjs`        | Update GitHub issue labels from CSV | Manual utility   |

#### `scripts/storybook/`

| Script                | Description                      | Usage                                  |
| --------------------- | -------------------------------- | -------------------------------------- |
| `kill-storybook.sh`   | Kill running Storybook processes | `pnpm --filter @dsai/storybook kill`   |
| `verify-storybook.sh` | Verify Storybook build           | `pnpm --filter @dsai/storybook verify` |

#### `scripts/icons/`

| Script                            | Description                          | Usage          |
| --------------------------------- | ------------------------------------ | -------------- |
| `generate-icons.cjs`              | Generate icon components             | Manual utility |
| `generate-figma-code-connect.cjs` | Generate Figma Code Connect mappings | Manual utility |
| `update-icon-jsdoc.cjs`           | Update JSDoc comments on icons       | Manual utility |
| `fetch-icon-metadata.cjs`         | Fetch icon metadata from sources     | Manual utility |

#### `scripts/tokens/`

One-off token utilities for specific tasks. For main token operations, use the `dsai` CLI.

| Script                            | Description                             | Usage           |
| --------------------------------- | --------------------------------------- | --------------- |
| `validate-figma-tokens.cjs`       | Validate raw Figma export files         | Manual utility  |
| `add-color-descriptions.cjs`      | Add descriptions to color tokens        | One-off utility |
| `enhance-color-tokens.cjs`        | Enhance color token metadata            | One-off utility |
| `apply-export-format.cjs`         | Apply export format to tokens           | One-off utility |
| `copy-light-to-dark.cjs`          | Copy light mode tokens to dark mode     | One-off utility |
| `fix-dark-mode-colors.cjs`        | Fix dark mode color issues              | One-off utility |
| `fix-dark-description.cjs`        | Fix dark mode descriptions              | One-off utility |
| `generate-token-index.cjs`        | Generate token index file               | One-off utility |
| `update-descriptions-from-md.cjs` | Update token descriptions from markdown | One-off utility |

## 🚀 Quick Start

### Token Operations (use @DSAi/tools CLI)

```bash
# Validate tokens
pnpm dsai tokens validate

# Build all tokens
pnpm dsai tokens build

# Sync tokens-flat.ts
pnpm dsai tokens sync
```

### One-off Token Utilities

```bash
# Validate raw Figma exports
node tools/scripts/tokens/validate-figma-tokens.cjs

# Enhance color tokens with metadata
node tools/scripts/tokens/enhance-color-tokens.cjs
```

### Storybook

```bash
# Kill running Storybook
pnpm --filter @dsai/storybook kill

# Verify Storybook build
pnpm --filter @dsai/storybook verify
```

## ⚠️ Deprecation Notice

Scripts in this directory are utility tools, not maintained packages. They may be:

- **Removed** if functionality is fully migrated to `@dsai/tools`
- **Outdated** if not frequently used
- **Unsupported** for edge cases

For production workflows, prefer using the `dsai` CLI from `@dsai/tools`.
