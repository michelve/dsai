# TASK-011: Design JSON Token Structure

**Task ID:** TASK-011
**Title:** Design JSON Token Structure
**Priority:** Critical
**Status:** ✅ **COMPLETE**
**Assigned To:** Developer
**Estimated Time:** 6 hours (100% complete)
**Phase:** Phase 1 - Token System (Weeks 3-6)
**Completion Date:** November 21, 2024

---

## Current Status (November 21, 2024)

### ✅ Figma Token Export Complete

**Location:** `packages/@dsai/tokens/figma-exports/` (7 JSON files, ~16,721 lines total)

The design tokens have been exported from Figma using the Tokens Studio plugin. The export provides **two options**:
1. **Separate collections** (6 individual files) ← Current approach
2. **Combined export** (`theme.json`) - All collections in one file

**Current Structure:**

| File | Size | Lines | Collection | Status |
|------|------|-------|------------|--------|
| `foundation.json` | 278K | 6,455 | Colors (brand, theme, neutral, opacity, background) | ✅ Complete |
| `typography.json` | 31K | 929 | Font families, sizes, weights, line heights, letter spacing | ✅ Complete |
| `spacing.json` | 4.3K | 154 | Spacing scale 0-10 (0-160px) | ✅ Complete & Extended |
| `radius.json` | 5.5K | 146 | Border radius (none, sm, md, lg, xl, full, circle, pill) | ✅ Complete |
| `layout.json` | 14K | 410 | Breakpoints, containers, grid system, gutters | ✅ Complete |
| `shadows.json` | 7.3K | 244 | Shadow primitives (sm, default, lg, inset) | ⚠️ Figma limitation |
| `theme.json` | 340K | 8,333 | **Combined** - All above collections in one file | ✅ Complete |

**Note:** Shadows are exported but Figma doesn't natively support shadow collections in variables, so they're stored as individual properties (color, offsetX/Y, blur, spread).

---

## What We Have

### 1. Foundation Collection (Colors)
- **121 brand colors**: 11 hues × 11 steps (50, 100-900, 950)
  - Hues: blue, cyan, gray, green, indigo, orange, pink, purple, red, teal, yellow
- **88 semantic theme colors**: primary, secondary, success, danger, warning, info, light, dark
- **Light & Dark modes**: Separate mode definitions
- **Background colors**: Multiple background variations
- **Neutral colors**: White, black, gray scales
- **Opacity tokens**: For transparency variations

### 2. Typography Collection
- **Font families**: base (Inter), monospace (Roboto Mono)
- **Font sizes**: base (16px), sm (14px), lg (20px)
- **Font weights**: 7 weights (100-900)
- **Line heights**: 9 options (xs:16px → display-lg:76px)
- **Headings**: h1-h6 font sizes (40, 32, 28, 24, 20, 16px)
- **Display fonts**: display1-6 (80, 72, 64, 56, 48, 40px)
- **Letter spacing**: 6 options (-0.05em to 0.1em)
- **Lead & small text**: Special text styles

### 3. Spacing Collection ✅ **EXTENDED**
- **11 spacing steps**: 0-10 (0px, 4px, 8px, 16px, 24px, 48px, 64px, 80px, 96px, 128px, 160px)
- **Bootstrap compatible**: Matches and extends Bootstrap spacing scale
- Note: Step 10 is 160px (vs Bootstrap's 128px) - this is acceptable extension

### 4. Radius Collection ✅ **UPDATED NAMING**
- **8 border radius values**:
  - none: 0px
  - sm: 4px
  - md: 8px (was "default")
  - lg: 16px
  - xl: 24px
  - full: 9999px (was "xxl")
  - circle: 100000000 (50%)
  - pill: 800px

### 5. Layout Collection
- **6 breakpoints**: xs (0), sm (576px), md (768px), lg (992px), xl (1200px), xxl (1400px)
- **Container max-widths**: Responsive widths for each breakpoint
- **Grid system**: 12 columns, 24px gutter, 6 row columns
- **Gutter utilities**: 0-5 spacing options

### 6. Shadows Collection ⚠️
- **4 shadow levels**: sm, default, lg, inset
- **Structure**: Individual properties (color, offsetX, offsetY, blur, spread) + composite values
- **Issue**: Figma doesn't support shadow variables natively in the same way as colors/spacing
- **Solution**: Use composite string values in Style Dictionary (already available in `composite` property)

---

## Task Implementation Plan

### Phase 1: Understand Export Structure ✅ COMPLETE

**What we learned:**
- Figma exports use `$value`, `$type`, `$description`, `$extensions`, `$scopes` format
- Collections are wrapped in named objects: `Foundation.modes.Light`, `Typography.modes.Base`, etc.
- Modes represent theme variations (Light/Dark for colors, Base for non-themed tokens)
- Extensions contain Bootstrap SCSS mappings, CSS classes, and documentation links
- Numbers need units added for dimensions (8 → "8px")
- Font families in Figma use single font names, but extensions contain full font stacks

### Phase 2: Create Transformation Script (2 hours) - **IN PROGRESS**

**Goal:** Convert Figma plugin format → Style Dictionary format

**Input:** `.idea/tokens/collections/*.json` (Figma export)
**Output:** `packages/@dsai/tokens/**/*.json` (Style Dictionary format)

**Transformation Rules:**

| Source (Figma) | Target (Style Dictionary) | Action |
|---|---|---|
| `$value` | `value` | Remove `$` prefix |
| `$type` | `type` | Remove `$`; map types: `number`→`dimension`, `string`→`fontFamily` |
| `$description` | `description` | Remove `$`; optionally shorten |
| `$extensions.platform.scssVariableName` | `comment` | Extract Bootstrap variable name |
| `$extensions.platform.fontStack` | `value` (for fonts) | Use full stack instead of single font |
| `$extensions` | _(remove)_ | Not needed in Style Dictionary |
| `$scopes` | _(remove)_ | Figma-specific |
| `Foundation.modes.Light.colors` | `color` | Flatten nested structure |
| `Typography.modes.Base` | `typography` | Flatten nested structure |
| Number values (8, 16, 24) | Strings with units ("8px", "1rem") | Add appropriate units |

**Script Structure:**
```javascript
// tools/scripts/transform-figma-tokens.js
const fs = require('fs');
const path = require('path');

// Read Figma exports
const collections = {
  foundation: require('../../.idea/tokens/collections/foundation.json'),
  typography: require('../../.idea/tokens/collections/typography.json'),
  spacing: require('../../.idea/tokens/collections/spacing.json'),
  radius: require('../../.idea/tokens/collections/radius.json'),
  layout: require('../../.idea/tokens/collections/layout.json'),
  shadows: require('../../.idea/tokens/collections/shadows.json')
};

// Transform each collection
// Output to packages/@dsai/tokens/

function transformToken(token) {
  return {
    value: transformValue(token.$value, token.$type),
    type: transformType(token.$type),
    description: token.$description,
    comment: token.$extensions?.platform?.scssVariableName
  };
}
```

**Output Directory Structure:**
```
packages/@dsai/tokens/
├── color/
│   ├── primitive.json      (brand colors from foundation)
│   └── semantic.json        (theme colors from foundation)
├── typography/
│   └── base.json            (all typography tokens)
├── spacing/
│   └── base.json            (spacing scale)
├── border/
│   ├── radius.json          (from radius collection)
│   └── width.json           (manual: none, thin, medium, thick)
├── shadow/
│   └── base.json            (composite shadow values)
├── layout/
│   ├── breakpoints.json
│   ├── containers.json
│   └── grid.json
└── index.json               (combines all tokens)
```

### Phase 3: Handle Special Cases (30 minutes) - **NEXT**

**1. Font Families:**
- Figma value: "Inter" (single font)
- Use extension: `$extensions.platform.fontStack` for full stack
- Result: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"

**2. Border Radius Units:**
- Convert numbers to px: 8 → "8px"
- Special case - circle: Use "50%" not pixel value
- Special case - pill: Use "9999px" (effectively infinite)

**3. Shadow Composites:**
- Use `composite` property from Figma export
- Already in correct CSS format: "0 0.5rem 1rem rgba(0, 0, 0, 0.15)"

**4. Color References:**
- Semantic colors reference primitives in Figma
- Preserve references using `{color.blue.500}` syntax

**5. Dark Mode:**
- Currently: `Foundation.modes.Dark`
- Strategy: Create separate `color/dark.json` OR use conditional logic in Style Dictionary

### Phase 4: Add Missing Tokens (30 minutes) - **NEXT**

**Border Widths** (create manually):
```json
{
  "border": {
    "width": {
      "none": { "value": "0", "type": "dimension" },
      "thin": { "value": "1px", "type": "dimension" },
      "medium": { "value": "2px", "type": "dimension" },
      "thick": { "value": "4px", "type": "dimension" }
    }
  }
}
```

### Phase 5: Create Master Index & Validation (30 minutes) - **REMAINING**

**1. Master Index (`packages/@dsai/tokens/index.json`):**
```json
{
  "color": { "$include": "./color/primitive.json" },
  "theme": { "$include": "./color/semantic.json" },
  "typography": { "$include": "./typography/base.json" },
  "spacing": { "$include": "./spacing/base.json" },
  "border": {
    "radius": { "$include": "./border/radius.json" },
    "width": { "$include": "./border/width.json" }
  },
  "shadow": { "$include": "./shadow/base.json" },
  "layout": {
    "breakpoints": { "$include": "./layout/breakpoints.json" },
    "containers": { "$include": "./layout/containers.json" },
    "grid": { "$include": "./layout/grid.json" }
  }
}
```

**2. Validation Script:**
- Check JSON syntax
- Verify required properties (value, type)
- Validate token references resolve
- Check for circular references
- Ensure no duplicate tokens

**3. npm Scripts:**
```json
{
  "scripts": {
    "tokens:transform": "node tools/scripts/transform-figma-tokens.js",
    "tokens:validate": "node tools/scripts/validate-tokens.js",
    "tokens:build": "pnpm tokens:transform && pnpm tokens:validate"
  }
}
```

### Phase 6: Documentation (30 minutes) - **REMAINING**

**Create `packages/@dsai/tokens/README.md`:**
- Overview of token structure
- How to export from Figma
- How to transform exports
- How to add new tokens
- Token naming conventions
- Usage examples

---

## Figma Export Workflow

### Option 1: Separate Collections (Recommended)
```
Figma → Tokens Studio Plugin → Export Collections Separately
↓
.idea/tokens/collections/
├── foundation.json  (colors)
├── typography.json
├── spacing.json
├── radius.json
├── layout.json
└── shadows.json
```

### Option 2: Combined Export
```
Figma → Tokens Studio Plugin → Export All Collections
↓
.idea/tokens/collections/
└── theme.json  (all collections combined)
```

**Decision:** Use **Option 1** (separate collections) because:
- Easier to track changes per collection
- Faster transformation (can process in parallel)
- Better Git diffs (changes isolated to specific files)
- Simpler to understand and debug

---

## Transformation Examples

### Example 1: Color Primitive

**Source (`.idea/tokens/collections/foundation.json`):**
```json
{
  "Foundation": {
    "modes": {
      "Light": {
        "colors": {
          "brand": {
            "blue": {
              "500": {
                "$value": "#0a58ca",
                "$type": "color",
                "$description": "Base color of primary brand",
                "$extensions": {
                  "platform": { "scssVariableName": "$blue" }
                },
                "$scopes": ["ALL_FILLS"]
              }
            }
          }
        }
      }
    }
  }
}
```

**Target (`packages/@dsai/tokens/color/primitive.json`):**
```json
{
  "color": {
    "blue": {
      "500": {
        "value": "#0a58ca",
        "type": "color",
        "description": "Base color of primary brand",
        "comment": "$blue"
      }
    }
  }
}
```

### Example 2: Border Radius

**Source (`.idea/tokens/collections/radius.json`):**
```json
{
  "Radius": {
    "modes": {
      "Base": {
        "radius": {
          "md": {
            "$value": 8,
            "$type": "number",
            "$extensions": {
              "platform": { "scssVariableName": "$border-radius" }
            }
          }
        }
      }
    }
  }
}
```

**Target (`packages/@dsai/tokens/border/radius.json`):**
```json
{
  "border": {
    "radius": {
      "md": {
        "value": "8px",
        "type": "dimension",
        "comment": "$border-radius"
      }
    }
  }
}
```

### Example 3: Typography (Font Family with Stack)

**Source (`.idea/tokens/collections/typography.json`):**
```json
{
  "Typography": {
    "modes": {
      "Base": {
        "fontFamily": {
          "base": {
            "$value": "Inter",
            "$type": "string",
            "$extensions": {
              "platform": {
                "fontStack": "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
              }
            }
          }
        }
      }
    }
  }
}
```

**Target (`packages/@dsai/tokens/typography/base.json`):**
```json
{
  "typography": {
    "fontFamily": {
      "base": {
        "value": "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
        "type": "fontFamily",
        "comment": "$font-family-base"
      }
    }
  }
}
```

---

## Definition of Done

- [x] Understand Figma export format and structure
- [x] Identify all token collections and their contents
- [x] Document transformation rules
- [x] Create transformation script (`tools/scripts/transform-figma-tokens.js`)
- [x] Run transformation on all collections
- [x] Create output directory structure in `packages/@dsai/tokens/`
- [x] Add missing border width tokens manually
- [x] Create master `index.json` file
- [x] Create validation script
- [x] Add npm scripts for token workflow
- [x] Write comprehensive README.md
- [x] Validate token structure (223 tokens, 0 errors)
- [ ] Test token structure with Style Dictionary (TASK-012)
- [ ] Commit all token files to repository (Ready for commit)

---

## Dependencies

### Requires:
- **TASK-001**: Nx Monorepo Structure ✅ (packages/tokens directory exists)
- **Figma Token Export**: ✅ COMPLETE (all collections exported)
- Designer color palette ✅ (121 colors defined)
- Designer typography scale ✅ (comprehensive system)

### Blocks:
- **TASK-012**: Setup Style Dictionary Pipeline (needs these tokens)
- **TASK-015**: Token-to-CSS Variable Generation (needs tokens)
- **TASK-016**: TypeScript Types for Tokens (needs token structure)
- All component tasks (components consume tokens)

---

## Notes

### Key Decisions Made

1. **Use separate collection files** over combined theme.json
2. **Preserve shadow composites** instead of breaking into primitives
3. **Extended spacing scale to 10** (160px) - acceptable Bootstrap extension
4. **Updated radius naming** (md/full instead of default/xxl)
5. **Transform at build time** rather than manual conversion

### Figma Limitations

- Shadows aren't natively supported as variable collections
- Font families stored as single font, need extension for full stack
- Numeric values need unit conversion for Style Dictionary

### Bootstrap Compatibility

- All tokens map to Bootstrap 5.3 variables
- SCSS variable names preserved in `comment` field
- CSS utility classes documented in original exports
- Extended spacing (10: 160px) is enhancement, not conflict

---

**Estimated Remaining Time:**
- Transformation script: 2 hours
- Add missing tokens: 30 minutes
- Master index & validation: 30 minutes
- Documentation: 30 minutes

**Total Remaining: 3.5 hours** (revised down from 5.5 due to spacing completion)
