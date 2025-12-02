# Tools Scripts

This directory contains utility scripts for the DSAi design system, organized by functionality.

## Directory Structure

```plaintext
tools/scripts/
├── analysis/       # Code analysis and validation tools
├── github/         # GitHub/CI automation scripts
├── storybook/      # Storybook utilities
└── tokens/         # Design token transformation and validation
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

### 🎨 Tokens (`tokens/`)

| Script                           | Description                              | Usage                                              |
| -------------------------------- | ---------------------------------------- | -------------------------------------------------- |
| `transform-figma-tokens.js`      | Transforms Figma exports to DTCG format  | `pnpm tokens:transform`                            |
| `validate-tokens.js`             | Validates token structure and values     | `pnpm tokens:validate`                             |
| `validate-figma-tokens.js`       | Validates Figma export files             | `pnpm --filter @dsai/tokens tokens:validate:figma` |
| `sync-tokens-flat.js`            | Syncs flattened token structure          | Internal build step                                |
| `generate-token-index.js`        | Generates token index exports            | Internal build step                                |
| `merge-tokens.js`                | Merges multiple token files              | Utility                                            |
| `merge-collections.js`           | Merges token collections                 | Utility                                            |
| `add-color-descriptions.js`      | Adds descriptions to color tokens        | Utility                                            |
| `enhance-color-tokens.js`        | Enhances color token metadata            | Utility                                            |
| `apply-export-format.js`         | Applies export format to tokens          | Utility                                            |
| `copy-light-to-dark.js`          | Copies light mode values to dark mode    | Utility                                            |
| `fix-dark-mode-colors.js`        | Fixes dark mode color values             | Utility                                            |
| `update-descriptions-from-md.js` | Updates token descriptions from markdown | Utility                                            |

## NPM Scripts (Root)

```bash
# Token operations
pnpm tokens:transform    # Transform Figma tokens
pnpm tokens:validate     # Validate token structure
pnpm tokens:build        # Transform + validate

# Analysis
pnpm analyze:buttons     # Analyze Button component usage
```

## NPM Scripts (@dsai/tokens)

```bash
pnpm --filter @dsai/tokens tokens:validate:figma      # Validate Figma exports
pnpm --filter @dsai/tokens tokens:transform           # Transform to DTCG
pnpm --filter @dsai/tokens tokens:build               # Full token build
```

## NPM Scripts (@dsai/storybook)

```bash
pnpm --filter @dsai/storybook kill     # Kill Storybook processes
pnpm --filter @dsai/storybook verify   # Verify Storybook build
```
