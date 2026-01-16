---
name: design-tokens
description: Manages DTCG-compliant design tokens for DSAi. Use when adding colors, typography, spacing tokens, syncing from Figma, building CSS variables, or validating token structure. Includes Style Dictionary v5 build system.
license: Complete terms in LICENSE.txt
metadata:
  author: dsai
  version: '1.1'
---

# Design Tokens

Manage DTCG-compliant design tokens that serve as the foundation of the DSAi design system.

## When to Use

- Adding new color, typography, spacing, or shadow tokens
- Syncing tokens from Figma exports
- Building CSS variables from token sources
- Validating token structure and naming
- Understanding the token architecture
- Configuring the build pipeline

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
│  @dsai-io/figma-tokens                                                       │
│  ─────────────────────                                                       │
│  • Fetches variables from Figma API                                          │
│  • Creates figma-exports/ directory                                          │
│  • CLI: dsai-figma fetch|sync|validate                                       │
└──────────────────────────────┬──────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  @dsai-io/tools                                                              │
│  ──────────────                                                              │
│  • Transforms figma-exports → collections (DTCG format)                      │
│  • Builds collections → CSS/JS/TS/SCSS outputs                               │
│  • Validates token structure                                                 │
│  • Post-processes CSS (theme attribute replacement)                          │
│  • CLI: dsai tokens transform|build|validate|sync|postprocess                │
└──────────────────────────────┬──────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  YOUR APP (e.g., playground, storybook)                                      │
│  ─────────────────────────────────────                                       │
│  src/figma-exports/    ← Raw Figma exports (theme.json, foundation.json)     │
│  src/collections/      ← Transformed DTCG tokens                             │
│  src/generated/        ← Built CSS/JS/TS/SCSS outputs                        │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Package Location

```text
packages/@dsai-io/tools/
├── bin/dsai-tools.mjs     # CLI entry point
├── src/
│   ├── cli/commands/tokens.ts  # Token CLI commands
│   ├── config/                  # Configuration system
│   │   ├── schema.ts           # Zod validation schemas
│   │   └── loader.ts           # Config loading
│   └── tokens/                  # Token processing
│       ├── build.ts            # Build pipeline
│       ├── transform.ts        # Figma → DTCG transform
│       ├── validate.ts         # Token validation
│       ├── validate-figma.ts   # Figma export validation
│       ├── sync.ts             # Token sync
│       ├── postprocess.ts      # CSS post-processing
│       ├── clean.ts            # Output cleanup
│       ├── types.ts            # TypeScript types
│       └── style-dictionary/   # SD v5 integration
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
    │   ├── theme.json        # Theme tokens (colors, typography)
    │   └── foundation.json   # Foundation tokens
    ├── collections/          # Transformed DTCG tokens (from dsai transform)
    │   ├── border/
    │   ├── color/
    │   │   └── primitive.json
    │   ├── layout/
    │   ├── shadow/
    │   ├── spacing/
    │   └── typography/
    └── generated/            # Built outputs (from dsai build)
        ├── tokens.css
        ├── tokens-dark.css
        ├── tokens.js
        ├── tokens.ts
        ├── tokens.json
        ├── tokens.d.ts
        ├── _variables.scss
        ├── _variables-dark.scss
        └── dsai-theme-bs.css
```

## Configuration

Create a `dsai.config.mjs` in your project root:

```javascript
import { defineConfig } from '@dsai-io/tools';

export default defineConfig({
  // Global settings
  global: {
    debug: process.env['DEBUG'] === 'true',
    logLevel: process.env['LOG_LEVEL'] ?? 'info',
  },

  // Token configuration
  tokens: {
    // Source type - 'theme' uses theme.json, 'collections' uses individual files
    source: 'theme',

    // Directory for raw Figma exports (theme.json or foundation.json, etc.)
    sourceDir: './src/figma-exports',

    // Base directory for processed collections
    collectionsDir: './src',

    // Output directory for generated files (CSS, SCSS, JS, TS)
    outputDir: './src/generated',

    // CSS variable prefix (e.g., --dsai-color-blue-500)
    prefix: '--dsai-',

    // Base font size for rem calculations
    baseFontSize: 16,

    // Output references in generated files (uses CSS var() functions)
    outputReferences: true,

    // Output formats to generate
    formats: ['css', 'js', 'ts', 'scss', 'json'],
  },
});
```

## CLI Commands

### Transform (Figma → DTCG)

```bash
# Transform Figma exports to Style Dictionary format
dsai tokens transform

# Preview without writing files
dsai tokens transform --dry-run

# Specify default mode for mode-aware collections
dsai tokens transform --default-mode Light

# Ignore specific modes
dsai tokens transform --ignore-modes "Dark,High Contrast"
```

### Build (Collections → Outputs)

```bash
# Build all token outputs
dsai tokens build

# Clean output before build
dsai tokens build --clean

# Build specific platforms
dsai tokens build --platforms css,js

# Watch mode
dsai tokens build --watch
```

### Validate

```bash
# Validate token structure
dsai tokens validate

# Strict mode
dsai tokens validate --strict

# Attempt to fix issues
dsai tokens validate --fix
```

### Sync

```bash
# Sync tokens to flat file
dsai tokens sync

# Specify output format
dsai tokens sync --format flat
```

### Post-process

```bash
# Post-process CSS files (replace data-bs-theme with data-dsai-theme)
dsai tokens postprocess
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
        "$extensions": {
          "docs": {
            "reference": "https://getbootstrap.com/docs/5.3/customize/color/",
            "section": "Customization",
            "subsection": "Colors - Brand - Blue"
          },
          "platform": {
            "scssVariableName": "$color-blue-500",
            "bootstrapVersion": "5.3"
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

| Field                  | Description                                       |
| ---------------------- | ------------------------------------------------- |
| `$extensions.docs`     | Documentation references and section info         |
| `$extensions.platform` | Platform-specific metadata (SCSS var names, etc.) |

### Valid Token Types

- `color` - Color values (hex, rgb, hsl)
- `dimension` - Size values (px, rem, em)
- `fontFamily` - Font stack definitions
- `fontWeight` - Font weight values
- `duration` - Animation/transition durations
- `cubicBezier` - Easing functions
- `number` - Numeric values
- `shadow` - Box shadow definitions
- `border` - Border definitions

## Token Categories

### Colors (collections/color/)

**Primitive** (11 hues × 11 steps in `primitive.json`):

- `color.blue.50` through `color.blue.950`
- `color.gray.50` through `color.gray.950`
- Also: cyan, green, indigo, orange, pink, purple, red, teal, yellow

**Semantic** (in `semantic.json` using references to primitives)

See [references/EXAMPLES.md](references/EXAMPLES.md) for complete token examples.

### Typography (collections/typography/)

Font families, sizes, weights, and line heights.

### Spacing (collections/spacing/)

Scale 0-10 (Bootstrap-compatible):

| Token       | Value  | Description                  |
| ----------- | ------ | ---------------------------- |
| `spacing.0` | `0px`  | No spacing                   |
| `spacing.1` | `4px`  | Extra small ($spacer × 0.25) |
| `spacing.2` | `8px`  | Small ($spacer × 0.5)        |
| `spacing.3` | `16px` | Default ($spacer)            |
| `spacing.4` | `24px` | Large ($spacer × 1.5)        |
| `spacing.5` | `48px` | Extra large ($spacer × 3)    |

### Additional Categories

- **Border** (`collections/border/`) - Border radius, width, style tokens
- **Shadow** (`collections/shadow/`) - Box shadow definitions
- **Layout** (`collections/layout/`) - Container, breakpoint tokens

## CSS Variable Output

Tokens build to CSS variables with the configured prefix:

```css
:root {
  --dsai-color-blue-500: #0a58ca;
  --dsai-color-gray-900: #212529;
  --dsai-typography-font-family-base: Inter, system-ui, sans-serif;
  --dsai-spacing-4: 16px;
}
```

## Output Formats

| Output                 | Path                             | Description              |
| ---------------------- | -------------------------------- | ------------------------ |
| CSS Variables (Light)  | `generated/tokens.css`           | Light mode CSS variables |
| CSS Variables (Dark)   | `generated/tokens-dark.css`      | Dark mode CSS overrides  |
| JavaScript (ESM)       | `generated/tokens.js`            | ESM module export        |
| TypeScript             | `generated/tokens.ts`            | TypeScript with types    |
| TypeScript Definitions | `generated/tokens.d.ts`          | Type definitions         |
| JSON                   | `generated/tokens.json`          | Raw token values         |
| SCSS Variables (Light) | `generated/_variables.scss`      | SCSS variables           |
| SCSS Variables (Dark)  | `generated/_variables-dark.scss` | Dark mode SCSS           |
| Bootstrap Theme        | `generated/dsai-theme-bs.css`    | Bootstrap CSS theme      |

## Build Pipeline

The build uses a configurable pipeline with these steps:

```typescript
// Available pipeline steps
type BuildPipelineStep =
  | 'validate' // Validate token structure
  | 'transform' // Transform Figma → DTCG
  | 'style-dictionary' // Run Style Dictionary
  | 'sync' // Sync to flat file
  | 'sass-theme' // Build Sass theme
  | 'sass-theme-minified' // Minified Sass theme
  | 'postprocess' // Post-process CSS
  | 'sass-utilities' // Build Sass utilities
  | 'sass-utilities-minified' // Minified utilities
  | 'bundle'; // Bundle outputs
```

Configure in `dsai.config.mjs`:

```javascript
export default defineConfig({
  tokens: {
    pipeline: {
      steps: ['validate', 'transform', 'style-dictionary', 'postprocess'],
    },
  },
});
```

## Adding New Tokens

1. Add to appropriate JSON file in `collections/`
2. Follow DTCG format with `$value`, `$type`, `$description`
3. Use references for semantic tokens: `"$value": "{color.blue.500}"`
4. Run validation: `dsai tokens validate`
5. Build outputs: `dsai tokens build`

Example adding a new color:

```json
{
  "color": {
    "brand": {
      "accent": {
        "$value": "#ff6b35",
        "$type": "color",
        "$description": "Accent color for highlights and call-to-action elements"
      }
    }
  }
}
```

## Token References (Aliases)

Create semantic tokens that reference primitives:

```json
{
  "color": {
    "primary": {
      "$value": "{color.blue.500}",
      "$type": "color",
      "$description": "Primary brand color alias"
    },
    "text": {
      "default": {
        "$value": "{color.gray.900}",
        "$type": "color",
        "$description": "Default text color"
      }
    }
  }
}
```

## Validation Rules

The `dsai tokens validate` command checks:

- **Structure**: Valid JSON, required `$value` and `$type` fields
- **Types**: `$type` matches DTCG specification
- **Values**: Valid CSS values or references
- **References**: Referenced tokens exist
- **Naming**: Lowercase, dot-separated paths (no underscores)
- **Duplicates**: No duplicate token paths

## Integration with Figma

See the [figma-integration](../figma-integration/SKILL.md) skill for Figma API workflows.

```bash
# Export from Figma
dsai-figma fetch

# Validate exports match Figma
dsai-figma validate

# Transform to DTCG
dsai tokens transform

# Build outputs
dsai tokens build
```

## Playground Scripts

```bash
cd apps/playground

# Token build commands (via @dsai-io/tools)
pnpm tokens:transform     # figma-exports → collections
pnpm tokens:build         # collections → generated outputs
pnpm tokens:all           # Transform + build
pnpm tokens:validate      # Validate structure

# Full workflow
pnpm tokens:full          # Fetch + transform + build
```

## Troubleshooting

See [references/TROUBLESHOOTING.md](references/TROUBLESHOOTING.md) for detailed solutions to common issues:

- Transform produces empty output
- Validation fails on references
- CSS variables not updating
- Dark mode not working
- Figma sync issues
- Build performance
