---
name: design-tokens
description: Manages DTCG-compliant design tokens for DSAi. Use when adding colors, typography, spacing tokens, syncing from Figma, building CSS variables, or validating token structure. Includes Style Dictionary v5 build system.
license: Complete terms in LICENSE.txt
metadata:
  author: dsai
  version: '1.0'
---

# Design Tokens

Manage DTCG-compliant design tokens that serve as the foundation of the DSAi design system.

## When to Use

- Adding new color, typography, or spacing tokens
- Syncing tokens from Figma
- Building CSS variables from token sources
- Validating token structure and naming
- Understanding the token architecture

## Architecture

DSAi uses a **two-package** token workflow:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                         FIGMA DESIGN SYSTEM                                  │
│                    (Variables & Collections)                                 │
└──────────────────────────────┬──────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  @dsai-io/figma-tokens                                                          │
│  ─────────────────                                                           │
│  • Fetches variables from Figma API                                          │
│  • Creates figma-exports/ directory                                          │
│  • CLI: figma-tokens fetch                                                   │
└──────────────────────────────┬──────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  @dsai-io/tools                                                                 │
│  ───────────                                                                 │
│  • Transforms figma-exports → collections (DTCG format)                      │
│  • Builds collections → CSS/JS/TS/SCSS outputs                               │
│  • Validates token structure                                                 │
│  • CLI: dsai tokens transform|build|validate                                 │
└──────────────────────────────┬──────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  YOUR APP (e.g., playground, storybook)                                      │
│  ─────────────────────────────────────                                       │
│  src/figma-exports/    ← Raw Figma exports                                   │
│  src/collections/      ← Transformed DTCG tokens                             │
│  src/generated/        ← Built CSS/JS/TS/SCSS outputs                        │
└─────────────────────────────────────────────────────────────────────────────┘
```

## App Directory Structure

Each app that uses tokens has this structure:

```text
apps/playground/
├── figma.config.mjs          # Figma fetch configuration
├── dsai.config.mjs           # @dsai-io/tools configuration
├── sd.config.mjs             # Style Dictionary config
└── src/
    ├── figma-exports/        # Raw Figma exports (from figma-tokens fetch)
    │   ├── colors.json
    │   ├── typography.json
    │   └── spacing.json
    ├── collections/          # Transformed DTCG tokens (from dsai transform)
    │   ├── color/
    │   │   ├── primitive.json
    │   │   └── semantic.json
    │   ├── typography/
    │   └── spacing/
    └── generated/            # Built outputs (from dsai build)
        ├── tokens.css
        ├── tokens-dark.css
        ├── tokens.js
        ├── tokens.ts
        ├── _variables.scss
        └── dsai-theme-bs.css
```

## DTCG Token Format

All tokens follow the W3C Design Tokens Community Group specification:

```json
{
  "color": {
    "blue": {
      "500": {
        "$value": "#0a58ca",
        "$type": "color",
        "$description": "Primary brand color. Use for primary actions and links.",
        "$scopes": ["ALL_FILLS", "STROKE_COLOR"],
        "$codeSyntax": {
          "WEB": "--dsai-color-blue-500",
          "ANDROID": "color.blue.500",
          "iOS": "Color.Blue.500"
        },
        "$extensions": {
          "docs": {
            "reference": "https://getbootstrap.com/docs/5.3/customize/color/"
          },
          "platform": {
            "scssVariableName": "$color-blue-500"
          }
        }
      }
    }
  }
}
```

### Required Fields

| Field          | Description                                                        |
| -------------- | ------------------------------------------------------------------ |
| `$value`       | The token value (hex, px, reference, etc.)                         |
| `$type`        | Token type: `color`, `dimension`, `fontFamily`, `fontWeight`, etc. |
| `$description` | Human-readable description with usage guidance                     |

### DSAi Extensions

| Field         | Description                                          |
| ------------- | ---------------------------------------------------- |
| `$scopes`     | Figma scopes: `ALL_FILLS`, `STROKE_COLOR`, `GAP`     |
| `$codeSyntax` | Platform-specific variable names (WEB, ANDROID, iOS) |
| `$extensions` | Docs references and platform metadata                |
| `comment`     | SCSS variable name (legacy)                          |

## Token Categories

### Colors

**Primitive** (11 hues × 11 steps in `primitive.json`):

- `color.blue.50` through `color.blue.950`
- `color.gray.50` through `color.gray.950`
- Also: cyan, green, indigo, orange, pink, purple, red, teal, yellow

**Semantic** (in `semantic.json` using references):

```json
{
  "theme": {
    "primary": {
      "$value": "{colors.brand.blue.500}",
      "$type": "color",
      "$description": "Primary theme color for CTAs and links"
    },
    "secondary": { "$value": "{colors.brand.gray.500}" },
    "success": { "$value": "{colors.brand.green.500}" },
    "danger": { "$value": "{colors.brand.red.500}" },
    "warning": { "$value": "{colors.brand.yellow.500}" },
    "info": { "$value": "{colors.brand.cyan.500}" }
  }
}
```

### Typography

```json
{
  "typography": {
    "fontFamily": {
      "base": {
        "$value": "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
        "$type": "fontFamily"
      },
      "monospace": {
        "$value": "Roboto Mono, SFMono-Regular, Menlo, Monaco, monospace",
        "$type": "fontFamily"
      }
    },
    "fontSize": {
      "base": { "$value": "16px", "$type": "dimension" },
      "sm": { "$value": "14px", "$type": "dimension" },
      "lg": { "$value": "20px", "$type": "dimension" }
    }
  }
}
```

### Spacing

Scale 0-10 (Bootstrap-compatible):

| Token       | Value  | Description                  |
| ----------- | ------ | ---------------------------- |
| `spacing.0` | `0px`  | No spacing                   |
| `spacing.1` | `4px`  | Extra small ($spacer × 0.25) |
| `spacing.2` | `8px`  | Small ($spacer × 0.5)        |
| `spacing.3` | `16px` | Default ($spacer)            |
| `spacing.4` | `24px` | Large ($spacer × 1.5)        |
| `spacing.5` | `48px` | Extra large ($spacer × 3)    |

## CSS Variable Output

Tokens build to CSS variables with the `--dsai-` prefix:

```css
:root {
  --dsai-color-blue-500: #0a58ca;
  --dsai-color-gray-900: #212529;
  --dsai-typography-font-family-base: Inter, system-ui, sans-serif;
  --dsai-spacing-4: 16px;
}
```

## Building Tokens

Apps use a **two-step** process powered by `@dsai-io/figma-tokens` and `@dsai-io/tools`:

### Step 1: Fetch from Figma (via @DSAi/figma-tokens)

```bash
# Fetch variables from Figma API → figma-exports/
dsai-figma fetch                # Full fetch
dsai-figma fetch --dry-run      # Preview without writing
dsai-figma sync                 # Bi-directional sync
dsai-figma validate             # Validate exports
```

Configuration in `figma.config.mjs`:

```js
export default {
  figma: {
    fileId: 'YOUR_FIGMA_FILE_ID',
    // Variable collections to fetch
    collections: ['Primitives', 'Semantic', 'Component'],
  },
  // Output directory for raw exports
  outputDir: './src/figma-exports',
};
```

### Step 2: Transform & Build (via @DSAi/tools)

```bash
# Transform Figma exports → DTCG collections
dsai tokens transform

# Build CSS/JS/TS/SCSS outputs
dsai tokens build

# Validate token structure
dsai tokens validate
dsai tokens validate --figma   # Validate against Figma exports
```

Configuration in `dsai.config.mjs`:

```js
export default {
  source: ['./src/collections/**/*.json'],
  prefix: '--dsai-',
  outputDir: './src/generated',
  figmaExports: './src/figma-exports',
  // ...
};
```

### Playground Example Scripts

```bash
cd apps/playground

# Figma fetch commands (via @dsai-io/figma-tokens)
pnpm figma:fetch          # Fetch from Figma → figma-exports/
pnpm figma:sync           # Bi-directional sync
pnpm figma:validate       # Validate exports

# Token build commands (via @dsai-io/tools)
pnpm tokens:transform     # figma-exports → collections
pnpm tokens:build         # collections → generated outputs
pnpm tokens:all           # Transform + build

# Full workflow
pnpm tokens:full          # Fetch + transform + build
```

### Output Formats

| Output          | Path                          | Description           |
| --------------- | ----------------------------- | --------------------- |
| CSS Variables   | `generated/tokens.css`        | Light mode variables  |
| CSS Dark Mode   | `generated/tokens-dark.css`   | Dark mode overrides   |
| JavaScript      | `generated/tokens.js`         | ESM module            |
| TypeScript      | `generated/tokens.ts`         | With type definitions |
| SCSS            | `generated/_variables.scss`   | SCSS variables        |
| Bootstrap Theme | `generated/dsai-theme-bs.css` | Bootstrap CSS theme   |

## Adding New Tokens

1. Add to appropriate JSON file in `collections/`
2. Follow DTCG format with `$value`, `$type`, `$description`
3. Use references for semantic tokens: `"$value": "{color.blue.500}"`
4. Run build to generate outputs
5. Validate with `pnpm dsai tokens validate`

## Token References (Aliases)

```json
{
  "color": {
    "primary": {
      "$value": "{color.blue.500}",
      "$type": "color",
      "$description": "Primary brand color alias"
    }
  }
}
```

## Figma Sync

The `@dsai-io/figma-tokens` package handles all Figma communication:

```bash
# Set your Figma access token
export FIGMA_TOKEN=figd_xxxxx

# Fetch variables from Figma
dsai-figma fetch

# Bi-directional sync (pull changes, push local updates)
dsai-figma sync

# Validate exports match Figma state
dsai-figma validate
```

Configuration via `figma.config.mjs`:

```js
export default {
  figma: {
    fileId: 'YOUR_FIGMA_FILE_ID',
    collections: ['Primitives', 'Semantic', 'Component'],
  },
  outputDir: './src/figma-exports',
};
```

Figma exports are stored in `figma-exports/` and transformed to DTCG format via `dsai tokens transform`.

## Validation Rules

- Token names: lowercase, dot-separated paths
- Values: Valid CSS values or references
- Types: Must match DTCG specification
- No duplicate token paths
