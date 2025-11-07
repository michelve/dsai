# TASK-010: Create Figma Variables Collection

**Task ID:** TASK-010
**Title:** Create Figma Variables Collection
**Priority:** Critical
**Status:** Not Started
**Assigned To:** Designer
**Estimated Time:** 8 hours
**Phase:** Phase 0 - Foundation (Weeks 1-2)

---

## Description

Create Figma Variables Collections to store all design tokens (colors, typography, spacing, shadows, borders) in a structured, reusable way. This establishes the foundation for the design token pipeline and enables consistent token usage across all components.

Figma Variables will serve as the single source of truth in design, which will be synced to code via Style Dictionary.

---

## Acceptance Criteria

### Variable Collections Structure
- [ ] **Color Collection** created with:
  - [ ] 66 color tokens (6 hues × 11 steps from TASK-007)
  - [ ] Semantic color tokens (primary, secondary, success, danger, warning, info)
  - [ ] Component-specific tokens (button-bg, input-border, etc.)
- [ ] **Typography Collection** created with:
  - [ ] Font family tokens (heading-font, body-font, mono-font)
  - [ ] Font size tokens (display, h1-h6, body-lg, body, body-sm, caption)
  - [ ] Font weight tokens (regular, medium, semibold, bold)
  - [ ] Line height tokens (tight, normal, relaxed)
- [ ] **Spacing Collection** created with:
  - [ ] Base spacing scale (4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px, 96px, 128px)
  - [ ] Component spacing tokens (button-padding, input-padding, etc.)
- [ ] **Shadow Collection** created with:
  - [ ] Elevation levels (xs, sm, md, lg, xl, 2xl)
  - [ ] Color-aware shadows (using color tokens)
- [ ] **Border Collection** created with:
  - [ ] Border width tokens (1px, 2px, 4px)
  - [ ] Border radius tokens (none, sm, md, lg, full, circle)

### Variable Naming Convention
- [ ] Naming follows kebab-case: `color-primary-500`
- [ ] Hierarchical structure: `category-subcategory-property-value`
- [ ] Semantic tokens use descriptive names: `color-button-primary-bg`
- [ ] Primitive tokens use numeric scales: `color-teal-500`

### Variable Modes (Themes)
- [ ] Light mode created and set as default
- [ ] Dark mode created (optional for Phase 0, required for Phase 4)
- [ ] High contrast mode created (optional, for accessibility)
- [ ] Variables support mode switching

### Variable Scoping
- [ ] Color variables scoped to: Fill, Stroke, Text
- [ ] Typography variables scoped appropriately
- [ ] Variables are organized in collections for easy management
- [ ] Documentation added to each variable (description field)

### Integration Readiness
- [ ] Variable naming matches planned token JSON structure
- [ ] Variables are exportable via Figma API or plugins
- [ ] Variable references are used in components (not hard-coded values)
- [ ] Test component created using only variables (Button as proof of concept)

### Documentation
- [ ] Variable usage guide created in Figma Documentation page
- [ ] Examples showing how to apply variables to components
- [ ] Guidelines for when to create new variables
- [ ] Process for requesting new variables documented

---

## Dependencies

### Requires:
- **TASK-007**: Designer Define Color Palette (color tokens)
- **TASK-008**: Create Figma File Structure (file to add variables)
- **TASK-009**: Define Typography Scale (typography tokens)

### Blocks:
- **TASK-011**: Design JSON Token Structure (variables inform token structure)
- **TASK-018**: Populate Figma Variables (this task creates empty structure, TASK-018 populates)
- **TASK-019**: Create Semantic Token Definitions (semantic tokens reference primitives)
- All component tasks (components use variables)

---

## Testing Requirements

### Design Review Checklist:
- [ ] All variable collections are properly organized
- [ ] Variable naming is consistent and follows convention
- [ ] Variables are correctly scoped (color, typography, spacing)
- [ ] Test component successfully uses only variables (no hard-coded values)
- [ ] Variables are accessible to all team members

### Validation Checks:
- [ ] All 66 colors from TASK-007 are present
- [ ] All typography tokens from TASK-009 are present
- [ ] Spacing scale follows 8px grid system
- [ ] Shadow tokens use color variables (not hard-coded colors)
- [ ] Border radius values are consistent with design language

### Export Testing:
- [ ] Variables can be exported via Figma API
- [ ] Variable structure matches planned JSON token format
- [ ] Variable references are maintained when components are copied

---

## Implementation Steps

### Step 1: Understand Figma Variables (1 hour)
1. Review Figma Variables documentation
2. Understand variable collections, modes, and scoping
3. Research best practices for design token management in Figma
4. Plan collection structure (separate or combined)
5. Review Style Dictionary output format for alignment

### Step 2: Create Color Variables Collection (2 hours)
1. Create new collection: "Colors"
2. Add primitive color tokens (66 colors):
   - Create 6 hue groups (teal, red, orange, yellow, green, blue)
   - Add 11 steps per hue (50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950)
   - Name: `color-teal-50`, `color-teal-100`, etc.
   - Add descriptions (hex value, usage notes)
3. Add neutral color tokens:
   - White: `color-white` (#ffffff)
   - Black: `color-black` (#000000)
   - Gray scale: `color-gray-50` to `color-gray-950`
4. Set up Light mode as default
5. Add Dark mode (placeholder values for now)
6. Scope color variables: Fill, Stroke, Text

### Step 3: Create Typography Variables Collection (1.5 hours)
1. Create new collection: "Typography"
2. Add font family tokens:
   - `typography-font-family-heading`: Poppins
   - `typography-font-family-body`: Inter
   - `typography-font-family-mono`: Fira Code
3. Add font size tokens (from TASK-009):
   - `typography-font-size-display`: 48
   - `typography-font-size-h1`: 40
   - `typography-font-size-h2`: 32
   - (etc. for all 9 levels)
4. Add font weight tokens:
   - `typography-font-weight-regular`: 400
   - `typography-font-weight-medium`: 500
   - `typography-font-weight-semibold`: 600
   - `typography-font-weight-bold`: 700
5. Add line height tokens:
   - `typography-line-height-tight`: 1.2
   - `typography-line-height-normal`: 1.5
   - `typography-line-height-relaxed`: 1.75
6. Add descriptions to each token

### Step 4: Create Spacing Variables Collection (1 hour)
1. Create new collection: "Spacing"
2. Add base spacing scale (8px system):
   - `spacing-0`: 0
   - `spacing-1`: 4
   - `spacing-2`: 8
   - `spacing-3`: 12
   - `spacing-4`: 16
   - `spacing-5`: 24
   - `spacing-6`: 32
   - `spacing-7`: 48
   - `spacing-8`: 64
   - `spacing-9`: 96
   - `spacing-10`: 128
3. Add component-specific spacing (optional, can be semantic):
   - `spacing-button-padding-x`: reference to spacing-4
   - `spacing-button-padding-y`: reference to spacing-2
4. Add descriptions with pixel values

### Step 5: Create Shadow Variables Collection (1 hour)
1. Create new collection: "Shadows"
2. Add elevation levels with color-aware shadows:
   - `shadow-xs`: 0 1px 2px 0 rgba(color-gray-950, 0.05)
   - `shadow-sm`: 0 1px 3px 0 rgba(color-gray-950, 0.10)
   - `shadow-md`: 0 4px 6px -1px rgba(color-gray-950, 0.10)
   - `shadow-lg`: 0 10px 15px -3px rgba(color-gray-950, 0.10)
   - `shadow-xl`: 0 20px 25px -5px rgba(color-gray-950, 0.10)
   - `shadow-2xl`: 0 25px 50px -12px rgba(color-gray-950, 0.25)
3. Reference color variables in shadow definitions
4. Add descriptions with usage examples (cards, modals, dropdowns)

### Step 6: Create Border Variables Collection (1 hour)
1. Create new collection: "Borders"
2. Add border width tokens:
   - `border-width-none`: 0
   - `border-width-thin`: 1
   - `border-width-medium`: 2
   - `border-width-thick`: 4
3. Add border radius tokens:
   - `border-radius-none`: 0
   - `border-radius-sm`: 4
   - `border-radius-md`: 8
   - `border-radius-lg`: 16
   - `border-radius-xl`: 24
   - `border-radius-full`: 9999 (for pills)
   - `border-radius-circle`: 50% (for circular elements)
4. Add descriptions with component examples

### Step 7: Create Test Component (1 hour)
1. Create a Button component using ONLY variables:
   - Background: `color-primary-500`
   - Text color: `color-white`
   - Padding X: `spacing-4`
   - Padding Y: `spacing-2`
   - Border radius: `border-radius-md`
   - Shadow: `shadow-sm`
   - Font family: `typography-font-family-body`
   - Font size: `typography-font-size-body`
   - Font weight: `typography-font-weight-medium`
2. Create hover state using different variable values
3. Verify variable references work correctly
4. Document any issues or limitations

### Step 8: Document Variables System (0.5 hours)
1. Create Variables documentation page in Figma
2. Add overview of variable collections
3. Show examples of how to apply variables
4. Document naming conventions
5. Add process for requesting new variables
6. Link to GitHub repository and Style Dictionary

---

## Definition of Done

- [ ] All 5 variable collections created (Colors, Typography, Spacing, Shadows, Borders)
- [ ] 66+ color tokens populated
- [ ] Typography tokens from TASK-009 added
- [ ] Spacing scale follows 8px system
- [ ] Shadow tokens use color variable references
- [ ] Border tokens defined for all components
- [ ] Variable naming follows consistent convention
- [ ] Light mode set as default, Dark mode created
- [ ] Variables properly scoped (color, typography, spacing)
- [ ] Test Button component created using only variables
- [ ] Variables documentation page completed
- [ ] All variables have descriptions
- [ ] Variables reviewed and approved by lead designer
- [ ] Variables structure reviewed by development team

---

## Notes

### Figma Variables Best Practices:
- Keep collections focused (separate concerns)
- Use modes for theming (light/dark)
- Reference variables within variables (semantic → primitive)
- Add descriptions to all variables
- Use consistent naming convention

### Variable vs. Styles:
- Variables are for values (colors, numbers, strings)
- Styles are for combinations (text style = font + size + weight + line height)
- Components should use both variables and styles

### Token Transformation Pipeline:
1. Figma Variables (design source of truth)
2. Export to JSON (via Figma API or plugin)
3. Style Dictionary transformation (JSON → CSS/JS/etc.)
4. Published tokens (npm package)
5. Consumed by components

### Dark Mode Considerations:
- Light mode: use for Phase 0-3
- Dark mode: add values in Phase 4
- Ensure semantic tokens reference primitives (easier mode switching)

### Semantic vs. Primitive Tokens:
- **Primitive**: `color-teal-500` (specific value)
- **Semantic**: `color-button-primary-bg` (references primitive)
- Use semantic tokens in components for easier theming

---

## Related Tasks

- **TASK-007**: Designer Define Color Palette
- **TASK-008**: Create Figma File Structure
- **TASK-009**: Define Typography Scale
- **TASK-011**: Design JSON Token Structure
- **TASK-018**: Populate Figma Variables
- **TASK-019**: Create Semantic Token Definitions

---

## Risks and Mitigations

**Risk:** Figma Variables don't export cleanly to JSON
- **Mitigation:** Test export early, use plugins like "Figma Tokens" if needed

**Risk:** Variable naming doesn't align with code conventions
- **Mitigation:** Review naming with development team before finalizing

**Risk:** Too many variables make system hard to manage
- **Mitigation:** Start with essential tokens, add more as needed

**Risk:** Variables don't support all needed use cases (gradients, complex shadows)
- **Mitigation:** Document limitations, use styles or manual values where needed

---

**Estimated Effort Breakdown:**
- Understand Figma Variables: 1 hour
- Color variables collection: 2 hours
- Typography variables collection: 1.5 hours
- Spacing variables collection: 1 hour
- Shadow variables collection: 1 hour
- Border variables collection: 1 hour
- Test component: 1 hour
- Documentation: 0.5 hours

**Total: 8 hours**
