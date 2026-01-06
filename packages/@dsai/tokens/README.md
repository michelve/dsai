# @dsai/tokens

Design tokens for the DSAi Design System - JavaScript/TypeScript exports only.

> **✨ DTCG Compliant**: Fully compliant with the [W3C Design Tokens Community Group (DTCG) specification](https://www.designtokens.org/) using Style Dictionary v5.1.1.

## Overview

This package contains all design tokens exported from Figma and transformed into **DTCG-compliant** Style Dictionary format. These tokens are the **source of truth** for colors, typography, spacing, borders, shadows, and layout values used throughout the DSAi component library.

**Philosophy**: "Token system as foundation - Build design system from tokens up, not components down."

> **Note**: This package exports **JavaScript/TypeScript tokens only**. CSS/SCSS stylesheets and Bootstrap theme compilation have moved to the `apps/playground` app, which consumes tokens from Figma exports and builds its own styles.

### Standards & Tools

- **Format**: [DTCG W3C Standard](https://www.designtokens.org/) (`$value`, `$type`, `$description`, `$extensions`)
- **Build System**: [Style Dictionary v5.1.1](https://styledictionary.com/)
- **Source**: Figma Tokens Studio plugin
- **Validation**: 100% transformation match rate verified

## Token Categories

### Colors (121 primitive + 88 semantic)

- **Primitive**: 11 hues × 11 steps (50, 100-900, 950)
  - blue, cyan, gray, green, indigo, orange, pink, purple, red, teal, yellow
- **Semantic**: Theme colors (primary, secondary, success, danger, warning, info, light, dark)

### Typography

- Font families (base, monospace)
- Font sizes (base, sm, lg, h1-h6, display1-6)
- Font weights (lighter, light, normal, medium, semibold, bold, bolder)
- Line heights (xs, sm, tight, base, relaxed, lg, display-sm/md/lg)
- Letter spacing (tighter to widest)

### Spacing

- Scale 0-10: 0px, 4px, 8px, 16px, 24px, 48px, 64px, 80px, 96px, 128px, 160px
- Bootstrap-compatible with extensions

### Border

- **Radius**: none, sm, md, lg, xl, full, circle, pill
- **Width**: none, thin (1px), medium (2px), thick (4px)

### Shadows

- Elevation levels: sm, default, lg, inset
- Composite CSS box-shadow values

### Layout

- **Breakpoints**: xs (0), sm (576px), md (768px), lg (992px), xl (1200px), xxl (1400px)
- **Containers**: Responsive max-widths
- **Grid**: 12 columns, 24px gutter, configurable

## Directory Structure

```plaintext
packages/@dsai/tokens/
├── collections/              # ← Organized token collections
│   ├── color/
│   │   ├── primitive.json    # 121 brand colors
│   │   ├── neutral.json      # Neutral colors (white, black, grays)
│   │   ├── background.json   # Background utilities
│   │   ├── opacity.json      # Opacity scale
│   │   ├── semantic.json     # Theme colors
│   │   └── component.json    # Component semantic tokens
│   ├── typography/
│   │   └── base.json         # Font system
│   ├── spacing/
│   │   └── base.json         # Spacing scale
│   ├── border/
│   │   ├── color.json        # Border colors
│   │   ├── radius.json       # Border radius values
│   │   └── width.json        # Border width values
│   ├── shadow/
│   │   └── base.json         # Shadow/elevation
│   └── layout/
│       ├── breakpoints.json  # Responsive breakpoints
│       ├── containers.json   # Container max-widths
│       └── grid.json         # Grid system
├── figma-exports/            # ← Source of truth (Figma exports)
│   ├── foundation.json       # Colors, borders
│   ├── typography.json
│   ├── spacing.json
│   ├── radius.json
│   ├── layout.json
│   ├── shadows.json
│   └── theme.json            # Master combined file
├── src/                      # TypeScript source
├── dist/                     # Built outputs (JS, TS, JSON)
├── index.json                # Master index
└── README.md                 # This file
```

## Token Format

All tokens follow Style Dictionary format:

```json
{
  "tokenName": {
    "value": "#0a58ca",
    "type": "color",
    "description": "Base color of primary brand",
    "comment": "$blue"
  }
}
```

---

## Building Tokens

### Build Commands

```bash
# Full build (validate + style-dictionary + tsup)
pnpm build

# Build Style Dictionary outputs only
pnpm build:tokens

# Validate token structure
pnpm validate

# Sync tokens to TypeScript flat file
pnpm sync

# Watch mode (rebuild on change)
pnpm dev

# Clean generated files
pnpm clean
```

### Using with Nx

```bash
# Build with Nx
nx build @dsai/tokens

# Validate tokens
nx validate @dsai/tokens

# Sync tokens
nx sync @dsai/tokens

# Watch mode
nx watch @dsai/tokens
```

### Configuration

The tokens package uses two configuration files:

#### 1. DSAi Config (`dsai.config.mjs`)

Configuration for the @dsai/tools build pipeline:

```javascript
import { defineConfig } from '@dsai/tools';

export default defineConfig({
  global: {
    debug: false,
    verbose: false,
  },
  tokens: {
    sourceDir: './collections',
    outputDir: './dist',
    prefix: '--dsai-',
    baseFontSize: 16,
    outputReferences: true,
    formats: ['js', 'ts', 'json'],
  },
});
```

#### 2. Style Dictionary Config (`sd.config.mjs`)

Configuration for Style Dictionary build:

```javascript
import StyleDictionary from 'style-dictionary';
import { registerAll } from '@dsai/tools/tokens';

// Register custom transforms, formats, preprocessors
registerAll(StyleDictionary);

export default {
  preprocessors: ['fix-references'],
  source: ['collections/**/*.json'],
  platforms: {
    js: {
      /* ... */
    },
    ts: {
      /* ... */
    },
    json: {
      /* ... */
    },
  },
};
```

### Build Output

The build process generates 3 output formats in `dist/`:

```plaintext
dist/
├── js/
│   ├── tokens.js             # ES6 module
│   └── tokens.cjs            # CommonJS module
├── ts/
│   ├── tokens.ts             # TypeScript module
│   └── tokens.d.ts           # TypeScript declarations
└── json/
    ├── tokens.json           # Flat token structure
    └── tokens-nested.json    # Nested token structure
```

> **Note**: CSS and SCSS outputs have moved to the playground app. See `apps/playground/README.md` for style compilation.

---

## Using Tokens

### In React/TypeScript

```tsx
import { tokens } from '@dsai/tokens/dist/ts/tokens';

// Using typed tokens
const Button = () => (
  <button
    style={{
      backgroundColor: tokens.theme.primary,
      color: tokens.neutral.white,
      padding: `${tokens.spacing['2']} ${tokens.spacing['4']}`,
      borderRadius: tokens.border.radius.md,
      fontSize: tokens.typography.fontSize.base,
    }}
  >
    Click Me
  </button>
);
```

### In JavaScript/ES6

```javascript
import tokens from '@dsai/tokens/dist/js/tokens.js';

// Use camelCase exports
console.log(tokens.colorBlue500); // "#0a58ca"
console.log(tokens.themePrimary); // "#0a58ca"
console.log(tokens.spacing2); // "8px"
console.log(tokens.borderRadiusMd); // "8px"
```

### In Styled Components

```tsx
import styled from 'styled-components';
import { tokens } from '@dsai/tokens/dist/ts/tokens';

const Button = styled.button`
  background-color: ${tokens.theme.primary};
  color: ${tokens.neutral.white};
  padding: ${tokens.spacing['2']} ${tokens.spacing['4']};
  border-radius: ${tokens.border.radius.md};
  font-size: ${tokens.typography.fontSize.base};
  box-shadow: ${tokens.shadow.default};

  &:hover {
    background-color: ${tokens.color.blue['600']};
  }
`;
```

### Token References

Many semantic tokens reference primitive tokens using Style Dictionary's reference syntax:

```json
{
  "theme": {
    "primary": {
      "value": "{color.blue.500}",
      "type": "color"
    }
  }
}
```

**These are automatically resolved** during the build process:

- JS: `tokens.themePrimary` resolves to `"#0a58ca"`

---

## Transforms & Processing

### Custom Transforms

The Style Dictionary build includes several custom transforms:

#### 1. **size/pxToRem**

Converts pixel values to rem units (base: 16px):

- Input: `"16px"` → Output: `"1rem"`
- Input: `"24px"` → Output: `"1.5rem"`
- Only applies to tokens with `type: "dimension"`

#### 2. **name/kebab**

Converts token paths to kebab-case:

- `color.blue.500` → `color-blue-500`
- `typography.fontSize.base` → `typography-font-size-base`

#### 3. **Reference Resolution**

Automatically resolves token references:

- `{color.blue.500}` → `#0a58ca`
- `{theme.primary}` → (resolved to its final value)

### Preprocessors

#### fix-references

Handles path mismatches between Figma exports and our structure:

- `{colors.brand.blue.500}` → `{color.blue.500}`
- `{colors.neutral.white}` → `{neutral.white}`
- `{borders.width.thin}` → `{border.width.thin}`

This allows Figma references to work seamlessly with our token structure.

---

## Token Naming Conventions

### Path Structure

- Use dot notation: `color.blue.500`
- Categories: color, typography, spacing, border, shadow, layout
- Semantic tokens: `theme.primary`, `semantic.body-color`

### JavaScript Names

- CamelCase: `colorBlue500`
- Semantic: `themePrimary`

---

## Architecture

### Token Hierarchy

```plaintext
Figma Design → Token Studio Plugin → figma-exports/*.json
                                            ↓
                           transform-figma-tokens.js
                                            ↓
                                   collections/color/*.json
                                   collections/typography/*.json
                                   collections/spacing/*.json
                                   collections/border/*.json
                                   collections/shadow/*.json
                                   collections/layout/*.json
                                            ↓
                            Style Dictionary
                                            ↓
                                    dist/js/*.js
                                    dist/ts/*.ts
                                    dist/json/*.json
                                            ↓
                        Consumed by Components & Applications
```

### Build Process

1. **Transform** (`pnpm tokens:transform`)
   - Reads from `figma-exports/*.json`
   - Converts Figma format to Style Dictionary format
   - Outputs to `collections/color/`, `collections/typography/`, etc.

2. **Validate** (`pnpm tokens:validate`)
   - Checks token structure
   - Validates required properties
   - Reports errors and warnings

3. **Build** (`pnpm build:tokens`)
   - Runs Style Dictionary
   - Applies transforms and preprocessors
   - Generates all output formats

### Integration Points

- **Components**: Import JS/TS tokens
- **Playground App**: Builds CSS/SCSS from its own Figma exports (see `apps/playground`)
- **Documentation**: Use JSON exports for token browser
- **CI/CD**: Build tokens on every commit
- **npm**: Publish as `@dsai/tokens` package

---

## Workflow

### 1. Export from Figma

Tokens are created in Figma using the **Tokens Studio plugin** and exported to `packages/@dsai/tokens/figma-exports/`:

```plaintext
packages/@dsai/tokens/figma-exports/
├── foundation.json    # Colors
├── typography.json    # Typography system
├── spacing.json       # Spacing scale
├── radius.json        # Border radius
├── layout.json        # Breakpoints & grid
├── shadows.json       # Shadow primitives
└── theme.json         # (Optional) All collections combined
```

**Export Options:**

- **Option 1** (Recommended): Export collections separately → Better git diffs, easier to debug
- **Option 2**: Export as single `theme.json` file → Simpler file management

### 2. Transform to Style Dictionary Format

Run the transformation script to convert Figma exports:

```bash
pnpm tokens:transform
```

This converts from Figma plugin format (`$value`, `$type`, `$extensions`) to Style Dictionary format (`value`, `type`, `description`, `comment`).

### 3. Validate Tokens

Ensure all tokens are valid:

```bash
pnpm tokens:validate
```

Checks for:

- ✅ Valid JSON syntax
- ✅ Required properties (value, type)
- ✅ Correct type values
- ✅ Valid dimension units (px, rem, em, %)
- ✅ Valid color formats (#hex, rgb, rgba, hsl, hsla)
- ✅ File references in index.json

### 4. Build

Run the full build:

```bash
pnpm build
```

---

## Adding New Tokens

### Option 1: From Figma (Recommended)

1. Update tokens in Figma using Tokens Studio plugin
2. Export collections to `figma-exports/`
3. Run `pnpm tokens:transform && pnpm build`
4. Commit changes

### Option 2: Manual Addition

1. Edit the appropriate JSON file in `collections/`
2. Follow the token format (value, type, description, comment)
3. Run `pnpm tokens:validate` to check
4. Commit changes

---

## Token Naming Patterns

### Primitive Tokens

```plaintext
{category}.{hue}.{step}
color.blue.500
spacing.4
typography.fontSize.h1
```

### Semantic Tokens

```plaintext
{category}.{element}.{property}.{state}
theme.primary
button.primary.background.hover
input.border.color.focus
```

### Component Tokens

```plaintext
{component}.{variant}.{property}.{state}
button.primary.background.default
button.primary.background.hover
card.padding.vertical
```

---

## Bootstrap Compatibility

All tokens map to Bootstrap 5.3 variables:

| Token                      | Bootstrap Variable      |
| -------------------------- | ----------------------- |
| `color.blue.500`           | `$blue`                 |
| `spacing.3`                | `$spacer` (1rem = 16px) |
| `border.radius.md`         | `$border-radius`        |
| `typography.fontSize.base` | `$font-size-base`       |
| `layout.breakpoints.md`    | `$grid-breakpoints.md`  |

Bootstrap SCSS variable names are preserved in the `comment` field for reference.

> **For Bootstrap theme compilation**, see `apps/playground` which handles SCSS/CSS generation.

---

## Token Statistics

- **Total tokens**: 223+
- **Color tokens**: 209 (121 primitive + 88 semantic)
- **Typography tokens**: ~50
- **Spacing tokens**: 11
- **Border tokens**: 12 (8 radius + 4 width)
- **Shadow tokens**: 4
- **Layout tokens**: 21

---

## Figma Integration

### Light & Dark Modes

Colors support Light and Dark modes in Figma. Both modes are automatically detected:

- **Light mode**: Default color values
- **Dark mode**: Inverted/adjusted values

> **Note**: Theme switching is handled by the playground app using `data-dsai-theme` attribute.

---

## Related Packages

- **@dsai/react**: React components that consume these tokens
- **@dsai/tools**: Build tooling for token transformation
- **apps/playground**: CSS/SCSS compilation and Bootstrap theme

---

## Development

### Scripts

```bash
# Transform Figma exports to Style Dictionary format
pnpm tokens:transform

# Validate all token files
pnpm tokens:validate

# Full build
pnpm build
```

### File Locations

- **Figma exports**: `packages/@dsai/tokens/figma-exports/*.json` ← **Export here from Figma**
- **Transformed tokens**: `packages/@dsai/tokens/collections/**/*.json`
- **Built outputs**: `packages/@dsai/tokens/dist/`

---

**Version**: 2.0.0  
**Status**: ✅ Production Ready  
**Last Updated**: January 2026
