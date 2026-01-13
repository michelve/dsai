# Tools Scripts

This directory contains utility scripts for the DSAi design system, organized by functionality.

> **Note:** Core token operations have been migrated to `@dsai/tools`. Use the `dsai` CLI for:
>
> - Token validation: `dsai tokens validate`
> - Token building: `dsai tokens build`
> - Token sync: `dsai tokens sync`

## Directory Structure

```plaintext
tools/scripts/
├── analysis/       # Code analysis and validation tools
├── github/         # GitHub/CI automation scripts
├── icons/          # Icon generation utilities
├── storybook/      # Storybook shell scripts
└── tokens/         # One-off token utilities
```

## Scripts by Category

### 📊 Analysis (`analysis/`)

| Script                     | Description                                                           | Usage                         |
| -------------------------- | --------------------------------------------------------------------- | ----------------------------- |
| `analyze-button-usage.cjs` | Scans for Button component usage and validates accessibility patterns | `pnpm analyze:buttons [path]` |

### 🐙 GitHub (`github/`)

| Script                           | Description                                       | Usage                                               |
| -------------------------------- | ------------------------------------------------- | --------------------------------------------------- |
| `export-tasks-to-github-csv.cjs` | Exports task files to CSV for bulk issue creation | Used by GitHub Actions                              |
| `update-issue-labels.cjs`        | Updates GitHub issue labels from CSV              | `node tools/scripts/github/update-issue-labels.cjs` |

### 📖 Storybook (`storybook/`)

| Script                | Description                           | Usage                                  |
| --------------------- | ------------------------------------- | -------------------------------------- |
| `kill-storybook.sh`   | Kills any running Storybook processes | `pnpm --filter @dsai/storybook kill`   |
| `verify-storybook.sh` | Verifies Storybook build              | `pnpm --filter @dsai/storybook verify` |

### 🎨 Icons (`icons/`)

| Script                            | Description                          | Usage          |
| --------------------------------- | ------------------------------------ | -------------- |
| `generate-icons.cjs`              | Generate icon components             | Manual utility |
| `generate-figma-code-connect.cjs` | Generate Figma Code Connect mappings | Manual utility |
| `update-icon-jsdoc.cjs`           | Update JSDoc comments on icons       | Manual utility |
| `fetch-icon-metadata.cjs`         | Fetch icon metadata from sources     | Manual utility |

### 🎨 Tokens (`tokens/`) - One-Off Utilities

These are utility scripts for specific token operations. For main token operations, use the `dsai` CLI.

| Script                            | Description                              | Usage           |
| --------------------------------- | ---------------------------------------- | --------------- |
| `validate-figma-tokens.cjs`       | Validates raw Figma export files         | Manual utility  |
| `add-color-descriptions.cjs`      | Adds descriptions to color tokens        | One-off utility |
| `enhance-color-tokens.cjs`        | Enhances color token metadata            | One-off utility |
| `apply-export-format.cjs`         | Applies export format to tokens          | One-off utility |
| `copy-light-to-dark.cjs`          | Copies light mode values to dark mode    | One-off utility |
| `fix-dark-mode-colors.cjs`        | Fixes dark mode color values             | One-off utility |
| `fix-dark-description.cjs`        | Fixes dark mode descriptions             | One-off utility |
| `generate-token-index.cjs`        | Generates token index file               | One-off utility |
| `update-descriptions-from-md.cjs` | Updates token descriptions from markdown | One-off utility |

## npm Scripts

### Root Package

```bash
# Analysis
pnpm analyze:buttons     # Analyze Button component usage
```

### @DSAi/tools

```bash
# Use dsai CLI for token operations
pnpm dsai tokens validate     # Validate token structure
pnpm dsai tokens sync         # Sync tokens-flat.ts
pnpm dsai tokens build        # Full token build pipeline
```

### @DSAi/storybook

```bash
pnpm --filter @dsai/storybook kill     # Kill Storybook processes
pnpm --filter @dsai/storybook verify   # Verify Storybook build
```
