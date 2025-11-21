# @dsai/tokens

Design tokens for the DSAi Design System - The foundation for all UI components.

## Overview

This package contains all design tokens exported from Figma and transformed into Style Dictionary-compatible format. These tokens are the **source of truth** for colors, typography, spacing, borders, shadows, and layout values used throughout the DSAi component library.

**Philosophy**: "Token system as foundation - Build design system from tokens up, not components down."

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

```
packages/@dsai/tokens/
├── color/
│   ├── primitive.json       # 121 brand colors
│   └── semantic.json         # 88 theme colors
├── typography/
│   └── base.json             # Font system
├── spacing/
│   └── base.json             # Spacing scale
├── border/
│   ├── radius.json           # Border radius values
│   └── width.json            # Border width values
├── shadow/
│   └── base.json             # Shadow/elevation
├── layout/
│   ├── breakpoints.json      # Responsive breakpoints
│   ├── containers.json       # Container max-widths
│   └── grid.json             # Grid system
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

### Properties

- **value** (required): The actual token value (hex color, px dimension, font name, etc.)
- **type** (required): Token type (`color`, `dimension`, `fontFamily`, `fontWeight`, `shadow`, etc.)
- **description** (optional): Human-readable description of token usage
- **comment** (optional): Bootstrap SCSS variable name for reference

## Workflow

### 1. Export from Figma

Tokens are created in Figma using the **Tokens Studio plugin** and exported to `packages/@dsai/tokens/figma-exports/`:

```
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

### 4. Build (Transform + Validate)

Run both steps:

```bash
pnpm tokens:build
```

## Usage in Components

### CSS Variables (Recommended)

Once transformed by Style Dictionary, tokens become CSS variables:

```css
.button {
  background-color: var(--color-button-primary-background-default);
  color: var(--color-button-primary-text-color);
  padding: var(--spacing-button-vertical) var(--spacing-button-horizontal);
  border-radius: var(--border-radius-md);
  font-size: var(--typography-fontSize-base);
}
```

### JavaScript/TypeScript

Import tokens as JavaScript objects:

```typescript
import { tokens } from '@dsai/tokens';

const primaryColor = tokens.color.blue[500].value; // "#0a58ca"
const spacing = tokens.spacing[4].value; // "24px"
```

## Adding New Tokens

### Option 1: From Figma (Recommended)

1. Update tokens in Figma using Tokens Studio plugin
2. Export collections to `.idea/tokens/collections/`
3. Run `pnpm tokens:build`
4. Commit changes

### Option 2: Manual Addition

1. Edit the appropriate JSON file in `packages/@dsai/tokens/`
2. Follow the token format (value, type, description, comment)
3. Run `pnpm tokens:validate` to check
4. Commit changes

## Token Naming Conventions

### Primitive Tokens
```
{category}.{hue}.{step}
color.blue.500
spacing.4
typography.fontSize.h1
```

### Semantic Tokens
```
{category}.{element}.{property}.{state}
theme.primary
button.primary.background.hover
input.border.color.focus
```

### Component Tokens
```
{component}.{variant}.{property}.{state}
button.primary.background.default
button.primary.background.hover
card.padding.vertical
```

## Bootstrap Compatibility

All tokens map to Bootstrap 5.3 variables:

| Token | Bootstrap Variable |
|-------|-------------------|
| `color.blue.500` | `$blue` |
| `spacing.3` | `$spacer` (1rem = 16px) |
| `border.radius.md` | `$border-radius` |
| `typography.fontSize.base` | `$font-size-base` |
| `layout.breakpoints.md` | `$grid-breakpoints.md` |

Bootstrap SCSS variable names are preserved in the `comment` field for reference.

## Token Statistics

- **Total tokens**: 223+
- **Color tokens**: 209 (121 primitive + 88 semantic)
- **Typography tokens**: ~50
- **Spacing tokens**: 11
- **Border tokens**: 12 (8 radius + 4 width)
- **Shadow tokens**: 4
- **Layout tokens**: 21

## Figma Integration

### Light & Dark Modes

Colors support Light and Dark modes in Figma:
- **Light mode**: Default color values
- **Dark mode**: Inverted/adjusted values (future implementation)

Currently, only Light mode is exported and transformed.

### Figma Limitations

- **Shadows**: Figma doesn't support shadow collections natively, so shadows are exported with individual properties (color, offsetX/Y, blur, spread) plus composite CSS values
- **Font Families**: Figma stores single font names, but extensions contain full font stacks for production use

## Related Packages

- **@dsai/react**: React components that consume these tokens
- **@dsai/storybook**: Documentation and examples
- **@dsai/figma-tokens**: Figma integration utilities

## Development

### Scripts

```bash
# Transform Figma exports to Style Dictionary format
pnpm tokens:transform

# Validate all token files
pnpm tokens:validate

# Transform + Validate
pnpm tokens:build
```

### File Locations

- **Figma exports**: `packages/@dsai/tokens/figma-exports/*.json` ← **Export here from Figma**
- **Transformed tokens**: `packages/@dsai/tokens/**/*.json`
- **Transform script**: `tools/scripts/transform-figma-tokens.js`
- **Validation script**: `tools/scripts/validate-tokens.js`

### Directory Structure

```
packages/@dsai/tokens/
├── figma-exports/          # ← Figma plugin exports (source files)
│   ├── foundation.json
│   ├── typography.json
│   ├── spacing.json
│   ├── radius.json
│   ├── layout.json
│   ├── shadows.json
│   └── theme.json (optional)
│
├── color/                  # ← Transformed tokens
│   ├── primitive.json
│   └── semantic.json
├── typography/
│   └── base.json
├── spacing/
│   └── base.json
├── border/
│   ├── radius.json
│   └── width.json
├── shadow/
│   └── base.json
├── layout/
│   ├── breakpoints.json
│   ├── containers.json
│   └── grid.json
│
├── index.json              # Master token index
└── README.md               # This file
```

## Next Steps

After completing this token package:

1. **TASK-012**: Setup Style Dictionary Pipeline
2. **TASK-015**: Token-to-CSS Variable Generation
3. **TASK-016**: TypeScript Types for Tokens
4. **TASK-019**: Semantic Token Definitions
5. Build components using these tokens

## Support

For questions or issues:
- See `ROADMAP/README.md` for project context
- See `tasks/02-high/TASK-011-design-json-token-structure.md` for implementation details
- Review `BUILD.md` for build system information

---

**Version**: 1.0.0  
**Status**: ✅ Production Ready  
**Last Updated**: November 21, 2024

