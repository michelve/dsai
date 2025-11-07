# TASK-011: Design JSON Token Structure

**Task ID:** TASK-011
**Title:** Design JSON Token Structure
**Priority:** Critical
**Status:** Not Started
**Assigned To:** Developer
**Estimated Time:** 8 hours
**Phase:** Phase 1 - Token System (Weeks 3-6)

---

## Description

Design and document the JSON structure for all design tokens that will serve as the source of truth for the token transformation pipeline. This structure must be compatible with Style Dictionary and support all token types (colors, typography, spacing, shadows, borders) across primitive and semantic levels.

The JSON structure will be the bridge between Figma Variables and generated code (CSS, JavaScript, TypeScript).

---

## Acceptance Criteria

### JSON File Structure
- [ ] Token files organized by category:
  - [ ] `tokens/color/primitive.json` (66 color primitives)
  - [ ] `tokens/color/semantic.json` (component-specific colors)
  - [ ] `tokens/typography/base.json` (font families, sizes, weights, line heights)
  - [ ] `tokens/spacing/base.json` (spacing scale)
  - [ ] `tokens/shadow/base.json` (elevation levels)
  - [ ] `tokens/border/base.json` (widths and radii)
- [ ] Each JSON file is valid and parseable
- [ ] Structure follows Style Dictionary format

### Token Naming Convention
- [ ] Naming follows pattern: `category.subcategory.property.modifier`
- [ ] Examples:
  - Primitive: `color.teal.500`, `typography.fontSize.h1`
  - Semantic: `color.button.primary.background`, `spacing.button.paddingX`
- [ ] All names use camelCase for properties
- [ ] No spaces or special characters (except dots and hyphens)

### Token Object Structure
- [ ] Each token has required properties:
  - [ ] `value`: The actual value (hex, px, rem, etc.)
  - [ ] `type`: Token type (color, dimension, fontFamily, etc.)
  - [ ] `description`: Human-readable description
- [ ] Optional properties included where needed:
  - [ ] `comment`: Additional context or usage notes
  - [ ] `attributes`: Metadata for transformation
  - [ ] `$extensions`: Figma-specific metadata

### Color Tokens
- [ ] All 66 primitive colors defined (6 hues × 11 steps)
- [ ] Neutral colors (white, black, gray scale)
- [ ] Semantic color tokens reference primitives:
  - Primary, secondary, success, danger, warning, info
  - Button colors (bg, text, border, hover, active, disabled)
  - Input colors (bg, text, border, focus, error, disabled)
  - Component-specific colors

### Typography Tokens
- [ ] Font family tokens (heading, body, mono)
- [ ] Font size tokens (display, h1-h6, body variants, caption)
- [ ] Font weight tokens (regular, medium, semibold, bold)
- [ ] Line height tokens (tight, normal, relaxed)
- [ ] Composite text style tokens (combining font, size, weight, line-height)

### Spacing Tokens
- [ ] Base spacing scale (0-10 steps, 4px-128px)
- [ ] Semantic spacing tokens (button padding, input padding, card padding, etc.)

### Shadow Tokens
- [ ] Elevation levels (xs, sm, md, lg, xl, 2xl)
- [ ] Shadow values with color references

### Border Tokens
- [ ] Border width tokens (none, thin, medium, thick)
- [ ] Border radius tokens (none, sm, md, lg, xl, full, circle)

### Validation and Documentation
- [ ] JSON schema created for token validation
- [ ] Example tokens provided for each category
- [ ] Documentation explains token structure and usage
- [ ] Token naming convention guide created
- [ ] Token reference aliases documented (how semantic tokens reference primitives)

---

## Dependencies

### Requires:
- **TASK-001**: Nx Monorepo Structure (packages/tokens directory)
- **TASK-007**: Designer Color Palette (color values)
- **TASK-009**: Designer Typography Scale (typography values)
- **TASK-010**: Figma Variables Collection (variable structure for alignment)

### Blocks:
- **TASK-012**: Setup Style Dictionary Pipeline (needs token structure)
- **TASK-015**: Token-to-CSS Variable Generation (needs tokens to transform)
- **TASK-016**: TypeScript Types for Tokens (needs token structure)
- **TASK-019**: Semantic Token Definitions (needs primitive tokens)
- All component tasks (components consume tokens)

---

## Testing Requirements

### JSON Validation:
- [ ] All JSON files are valid (no syntax errors)
- [ ] Token structure matches JSON schema
- [ ] All token references resolve correctly (semantic → primitive)
- [ ] No circular references between tokens

### Style Dictionary Compatibility:
- [ ] Tokens parse correctly with Style Dictionary
- [ ] Token transformations work (JSON → CSS variables)
- [ ] Token references are resolved properly

### Completeness Check:
- [ ] All 66 primitive colors from TASK-007 are present
- [ ] All typography tokens from TASK-009 are present
- [ ] Spacing scale is complete (10 steps)
- [ ] All semantic tokens have valid references

### Documentation Review:
- [ ] Token naming is consistent across all files
- [ ] Descriptions are clear and helpful
- [ ] Examples demonstrate proper usage
- [ ] No conflicting or duplicate tokens

---

## Implementation Steps

### Step 1: Research and Setup (1 hour)
1. Review Style Dictionary documentation and token format
2. Study Design Tokens Community Group (DTCG) specification
3. Review existing design systems (Material, Tailwind) for structure ideas
4. Set up `packages/tokens` directory structure:
   ```
   packages/tokens/
   ├── color/
   │   ├── primitive.json
   │   └── semantic.json
   ├── typography/
   │   └── base.json
   ├── spacing/
   │   └── base.json
   ├── shadow/
   │   └── base.json
   ├── border/
   │   └── base.json
   └── index.json (combines all tokens)
   ```

### Step 2: Create Color Primitive Tokens (1.5 hours)
1. Create `tokens/color/primitive.json`
2. Add all 66 color tokens from TASK-007:
   ```json
   {
     "color": {
       "teal": {
         "50": { "value": "#f3feff", "type": "color", "description": "Teal 50 - Lightest teal" },
         "100": { "value": "#...", "type": "color", "description": "..." },
         ...
         "950": { "value": "#002a2d", "type": "color", "description": "Teal 950 - Darkest teal" }
       },
       "red": { /* ... */ },
       "orange": { /* ... */ },
       "yellow": { /* ... */ },
       "green": { /* ... */ },
       "blue": { /* ... */ },
       "gray": { /* ... */ },
       "white": { "value": "#ffffff", "type": "color", "description": "Pure white" },
       "black": { "value": "#000000", "type": "color", "description": "Pure black" }
     }
   }
   ```
3. Validate JSON syntax
4. Add comments for each hue group

### Step 3: Create Color Semantic Tokens (1.5 hours)
1. Create `tokens/color/semantic.json`
2. Define theme colors (reference primitives):
   ```json
   {
     "color": {
       "primary": {
         "50": { "value": "{color.teal.50}", "type": "color" },
         "500": { "value": "{color.teal.500}", "type": "color" },
         ...
       },
       "button": {
         "primary": {
           "background": { "value": "{color.primary.500}", "type": "color" },
           "backgroundHover": { "value": "{color.primary.600}", "type": "color" },
           "text": { "value": "{color.white}", "type": "color" },
           "border": { "value": "{color.primary.500}", "type": "color" }
         }
       }
     }
   }
   ```
3. Define semantic tokens for all component states
4. Ensure all references use `{token.path}` syntax

### Step 4: Create Typography Tokens (1.5 hours)
1. Create `tokens/typography/base.json`
2. Add font family tokens:
   ```json
   {
     "typography": {
       "fontFamily": {
         "heading": { "value": "Poppins, sans-serif", "type": "fontFamily" },
         "body": { "value": "Inter, sans-serif", "type": "fontFamily" },
         "mono": { "value": "Fira Code, monospace", "type": "fontFamily" }
       }
     }
   }
   ```
3. Add font size tokens (all values from TASK-009)
4. Add font weight tokens (400, 500, 600, 700)
5. Add line height tokens (1.2, 1.5, 1.75)
6. Create composite text style tokens (optional):
   ```json
   {
     "typography": {
       "heading": {
         "h1": {
           "fontFamily": { "value": "{typography.fontFamily.heading}" },
           "fontSize": { "value": "{typography.fontSize.h1}" },
           "fontWeight": { "value": "{typography.fontWeight.bold}" },
           "lineHeight": { "value": "{typography.lineHeight.tight}" }
         }
       }
     }
   }
   ```

### Step 5: Create Spacing Tokens (1 hour)
1. Create `tokens/spacing/base.json`
2. Add base spacing scale:
   ```json
   {
     "spacing": {
       "0": { "value": "0", "type": "dimension" },
       "1": { "value": "4px", "type": "dimension" },
       "2": { "value": "8px", "type": "dimension" },
       "3": { "value": "12px", "type": "dimension" },
       "4": { "value": "16px", "type": "dimension" },
       "5": { "value": "24px", "type": "dimension" },
       "6": { "value": "32px", "type": "dimension" },
       "7": { "value": "48px", "type": "dimension" },
       "8": { "value": "64px", "type": "dimension" },
       "9": { "value": "96px", "type": "dimension" },
       "10": { "value": "128px", "type": "dimension" }
     }
   }
   ```
3. Add semantic spacing tokens:
   ```json
   {
     "spacing": {
       "button": {
         "paddingX": { "value": "{spacing.4}", "type": "dimension" },
         "paddingY": { "value": "{spacing.2}", "type": "dimension" }
       }
     }
   }
   ```

### Step 6: Create Shadow and Border Tokens (1 hour)
1. Create `tokens/shadow/base.json`:
   ```json
   {
     "shadow": {
       "xs": { "value": "0 1px 2px 0 rgba(0, 0, 0, 0.05)", "type": "shadow" },
       "sm": { "value": "0 1px 3px 0 rgba(0, 0, 0, 0.1)", "type": "shadow" },
       ...
     }
   }
   ```
2. Create `tokens/border/base.json`:
   ```json
   {
     "border": {
       "width": {
         "none": { "value": "0", "type": "dimension" },
         "thin": { "value": "1px", "type": "dimension" },
         "medium": { "value": "2px", "type": "dimension" },
         "thick": { "value": "4px", "type": "dimension" }
       },
       "radius": {
         "none": { "value": "0", "type": "dimension" },
         "sm": { "value": "4px", "type": "dimension" },
         "md": { "value": "8px", "type": "dimension" },
         "lg": { "value": "16px", "type": "dimension" },
         "xl": { "value": "24px", "type": "dimension" },
         "full": { "value": "9999px", "type": "dimension" },
         "circle": { "value": "50%", "type": "dimension" }
       }
     }
   }
   ```

### Step 7: Create Master Index and Validation (1 hour)
1. Create `tokens/index.json` that imports all token files
2. Create JSON schema for token validation
3. Write validation script to check:
   - JSON syntax
   - Required properties (value, type)
   - Token reference resolution
   - No circular references
4. Add npm script: `pnpm validate:tokens`

### Step 8: Documentation (0.5 hours)
1. Create `tokens/README.md` with:
   - Token structure overview
   - Naming conventions
   - How to add new tokens
   - Token reference syntax
   - Examples for each token type
2. Document primitive vs. semantic token usage
3. Add links to Style Dictionary and DTCG specs

---

## Definition of Done

- [ ] All 6 token JSON files created (color primitive/semantic, typography, spacing, shadow, border)
- [ ] 66+ color tokens defined in primitive.json
- [ ] Semantic color tokens reference primitives correctly
- [ ] Typography tokens match TASK-009 scale
- [ ] Spacing scale follows 8px system
- [ ] Shadow and border tokens are complete
- [ ] All JSON files are valid (no syntax errors)
- [ ] Token references resolve correctly (no broken references)
- [ ] JSON schema created for validation
- [ ] Validation script works and passes
- [ ] Token documentation (README.md) is comprehensive
- [ ] Token structure reviewed by design team
- [ ] Token structure reviewed and approved by development team
- [ ] Token files committed to git repository

---

## Notes

### Style Dictionary Format:
- Tokens use nested JSON objects
- Values can be primitives or references: `{other.token.path}`
- Type property helps Style Dictionary transform correctly
- Attributes can add metadata for transformations

### Token Reference Syntax:
- Reference other tokens with curly braces: `{color.teal.500}`
- References are resolved by Style Dictionary during build
- Semantic tokens should reference primitives (not hard-coded values)
- This enables theming and easy value updates

### Token Types (DTCG Standard):
- `color`: Hex, rgb, hsl values
- `dimension`: px, rem, em values
- `fontFamily`: Font stack strings
- `fontWeight`: Numeric weights (400, 500, etc.)
- `shadow`: Shadow values (box-shadow syntax)
- `duration`: Animation durations
- `cubicBezier`: Easing functions

### Primitive vs. Semantic Tokens:
- **Primitive**: Raw values (color.teal.500 = #00a6b0)
- **Semantic**: Context-specific (color.button.primary.bg = {color.teal.500})
- Components should use semantic tokens when possible
- Primitives are for building semantic tokens

---

## Related Tasks

- **TASK-001**: Nx Monorepo Structure
- **TASK-007**: Designer Color Palette
- **TASK-009**: Designer Typography Scale
- **TASK-010**: Figma Variables Collection
- **TASK-012**: Setup Style Dictionary Pipeline
- **TASK-015**: Token-to-CSS Variable Generation
- **TASK-016**: TypeScript Types for Tokens
- **TASK-019**: Semantic Token Definitions

---

## Risks and Mitigations

**Risk:** Token structure doesn't align with Figma Variables
- **Mitigation:** Review Figma Variables (TASK-010) before finalizing structure

**Risk:** Style Dictionary can't parse token format
- **Mitigation:** Test with Style Dictionary early, validate against examples

**Risk:** Token naming is inconsistent or unclear
- **Mitigation:** Establish clear naming conventions, get team agreement

**Risk:** Circular references between tokens break build
- **Mitigation:** Implement validation script to detect circular references

---

**Estimated Effort Breakdown:**
- Research and setup: 1 hour
- Color primitive tokens: 1.5 hours
- Color semantic tokens: 1.5 hours
- Typography tokens: 1.5 hours
- Spacing tokens: 1 hour
- Shadow and border tokens: 1 hour
- Master index and validation: 1 hour
- Documentation: 0.5 hours

**Total: 8 hours**
