# TASK-018: Populate Figma Variables

**Task ID:** TASK-018
**Title:** Populate Figma Variables
**Priority:** High
**Status:** Not Started
**Assigned To:** Designer
**Estimated Time:** 8 hours
**Phase:** Phase 1 - Token System (Weeks 3-6)

---

## Description

Populate the Figma Variables Collections created in TASK-010 with actual token values from the design system. This includes all 66 color tokens, typography tokens, spacing scale, shadow tokens, and border tokens. Ensure proper naming, modes (Light/Dark), and component bindings.

---

## Acceptance Criteria

### Color Variables Populated

- [ ] All 66 color tokens entered in Figma Variables
- [ ] 6 hue families: Teal, Blue, Green, Yellow, Orange, Red
- [ ] 11 steps per hue: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950
- [ ] Neutral grays: Gray 50-950 (11 steps)
- [ ] Variable naming: `color/teal/50`, `color/teal/100`, etc.

### Typography Variables Populated

- [ ] Font family variables: `typography/font-family/heading` (Poppins), `typography/font-family/body` (Inter)
- [ ] Font size variables: 9 levels (Display 48px to Caption 12px)
- [ ] Font weight variables: Bold 700, Semi-Bold 600, Medium 500, Regular 400
- [ ] Line height variables: Tight 1.2, Normal 1.5, Relaxed 1.75
- [ ] Variable naming: `typography/font-size/display`, `typography/line-height/normal`

### Spacing Variables Populated

- [ ] 11 spacing tokens: 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10
- [ ] Values: 0px, 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px, 96px, 128px
- [ ] Variable naming: `spacing/0`, `spacing/1`, `spacing/2`, etc.

### Shadow Variables Populated

- [ ] 6 shadow levels: xs, sm, md, lg, xl, 2xl
- [ ] Shadow values match design (box-shadow CSS)
- [ ] Variable naming: `shadow/xs`, `shadow/sm`, `shadow/md`, etc.

### Border Variables Populated

- [ ] Border width tokens: 1px, 2px, 4px
- [ ] Border radius tokens: 0px, 2px, 4px, 8px, 16px, 24px, 9999px (full)
- [ ] Variable naming: `border/width/1`, `border/radius/sm`

### Modes Configured

- [ ] Light mode (default) configured for all color variables
- [ ] Dark mode configured for all color variables
- [ ] Semantic colors reference primitive colors
- [ ] Mode switching tested in Figma components

### Variable Scoping

- [ ] Color variables scoped to: Fill, Stroke, Effect
- [ ] Typography variables scoped to: Text Content
- [ ] Spacing variables scoped to: Gap, Padding, Minimum Width/Height
- [ ] Shadow variables scoped to: Effect
- [ ] Border variables scoped to: Stroke, Corner Radius

### Component Bindings

- [ ] Update Button component from TASK-010 to use all variables
- [ ] Test 3+ components use variables correctly
- [ ] No hard-coded values remain in test components

---

## Dependencies

### Requires:

- **TASK-007**: Define Color Palette (66 colors)
- **TASK-009**: Define Typography Scale (font sizes, weights, line heights)
- **TASK-010**: Create Figma Variables Collection (collections structure)

### Blocks:

- **TASK-011**: Design JSON Token Structure (Figma is source of truth)
- **TASK-017**: GitHub Actions Token Sync (syncs these variables to code)
- **TASK-019**: Create Semantic Token Definitions (semantic tokens reference these)

---

## Implementation Steps

### Step 1: Populate Color Variables (2 hours)

1. Open Figma file → Variables panel
2. Select "Colors" collection
3. Add Teal colors:
   - `color/teal/50` = #f3feff
   - `color/teal/100` = #d4f7fa
   - `color/teal/200` = #aaf0f5
   - `color/teal/300` = #7de5eb
   - `color/teal/400` = #53d5dd
   - `color/teal/500` = #2bbbca
   - `color/teal/600` = #1e9aab
   - `color/teal/700` = #17798a
   - `color/teal/800` = #12606d
   - `color/teal/900` = #0f4f5a
   - `color/teal/950` = #002a2d
4. Repeat for Blue, Green, Yellow, Orange, Red (6 hues × 11 steps = 66 tokens)
5. Add Gray scale: `color/gray/50` to `color/gray/950`

### Step 2: Populate Typography Variables (1.5 hours)

1. Font Family:
   - `typography/font-family/heading` = "Poppins"
   - `typography/font-family/body` = "Inter"
2. Font Size:
   - `typography/font-size/display` = 48px
   - `typography/font-size/h1` = 40px
   - `typography/font-size/h2` = 32px
   - `typography/font-size/h3` = 24px
   - `typography/font-size/h4` = 20px
   - `typography/font-size/body` = 16px
   - `typography/font-size/small` = 14px
   - `typography/font-size/caption` = 12px
3. Font Weight:
   - `typography/font-weight/bold` = 700
   - `typography/font-weight/semi-bold` = 600
   - `typography/font-weight/medium` = 500
   - `typography/font-weight/regular` = 400
4. Line Height:
   - `typography/line-height/tight` = 1.2
   - `typography/line-height/normal` = 1.5
   - `typography/line-height/relaxed` = 1.75

### Step 3: Populate Spacing Variables (1 hour)

1. Create spacing variables:
   - `spacing/0` = 0px
   - `spacing/1` = 4px
   - `spacing/2` = 8px
   - `spacing/3` = 12px
   - `spacing/4` = 16px
   - `spacing/5` = 24px
   - `spacing/6` = 32px
   - `spacing/7` = 48px
   - `spacing/8` = 64px
   - `spacing/9` = 96px
   - `spacing/10` = 128px
2. Set scoping: Gap, Padding, Minimum Width/Height

### Step 4: Populate Shadow Variables (1 hour)

1. Create shadow variables with box-shadow values:
   - `shadow/xs` = "0px 1px 2px rgba(0, 0, 0, 0.05)"
   - `shadow/sm` = "0px 1px 3px rgba(0, 0, 0, 0.1)"
   - `shadow/md` = "0px 4px 6px rgba(0, 0, 0, 0.1)"
   - `shadow/lg` = "0px 10px 15px rgba(0, 0, 0, 0.1)"
   - `shadow/xl` = "0px 20px 25px rgba(0, 0, 0, 0.1)"
   - `shadow/2xl` = "0px 25px 50px rgba(0, 0, 0, 0.25)"
2. Set scoping: Effect (Drop Shadow)

### Step 5: Populate Border Variables (1 hour)

1. Border Width:
   - `border/width/1` = 1px
   - `border/width/2` = 2px
   - `border/width/4` = 4px
2. Border Radius:
   - `border/radius/none` = 0px
   - `border/radius/sm` = 2px
   - `border/radius/md` = 4px
   - `border/radius/lg` = 8px
   - `border/radius/xl` = 16px
   - `border/radius/2xl` = 24px
   - `border/radius/full` = 9999px

### Step 6: Configure Dark Mode (1 hour)

1. Add "Dark" mode to Colors collection
2. Update color values for dark mode:
   - Invert lightness (50 ↔ 950, 100 ↔ 900, etc.)
   - Adjust contrast for readability
3. Test dark mode in components

### Step 7: Apply Variables to Components (0.5 hours)

1. Update Button component:
   - Background: `{color/teal/500}` (light), `{color/teal/600}` (dark)
   - Text: `{color/white}`
   - Border radius: `{border/radius/md}`
   - Padding: `{spacing/3} {spacing/5}`
2. Verify variables work in component instances

### Step 8: Documentation (0.5 hours)

1. Create "Variables Guide" page in Figma
2. Document:
   - How to use variables
   - Naming conventions
   - When to use primitives vs semantic tokens
   - How to switch modes (Light/Dark)

---

## Definition of Done

- [ ] All 66 color variables populated
- [ ] All typography variables populated (families, sizes, weights, line heights)
- [ ] All 11 spacing variables populated
- [ ] All 6 shadow variables populated
- [ ] All border variables populated (width and radius)
- [ ] Light and Dark modes configured
- [ ] Variable scoping set correctly
- [ ] Button component uses variables (no hard-coded values)
- [ ] 3+ test components use variables
- [ ] Documentation page created in Figma
- [ ] Design team reviewed and approved

---

## Testing Requirements

### Variable Validation:

- [ ] All variables have correct values
- [ ] Naming follows convention: `category/subcategory/property`
- [ ] Scoping allows use in intended contexts
- [ ] Dark mode colors have sufficient contrast

### Component Testing:

- [ ] Button component works with all variable bindings
- [ ] Mode switching works (Light ↔ Dark)
- [ ] Instances inherit variable values correctly
- [ ] Overrides work as expected

---

## Notes

### Variable Organization:

- Use nested structure: `category/subcategory/property`
- Avoid overly deep nesting (max 3 levels)
- Use consistent naming: kebab-case

### Mode Strategy:

- Light mode is default (most common use case)
- Dark mode values should maintain WCAG contrast ratios
- Test both modes in real components

### Common Pitfalls:

- Forgetting to set scoping (variables won't appear in properties)
- Inconsistent naming (breaks automation)
- Not testing dark mode thoroughly

---

## Related Tasks

- **TASK-007**: Define Color Palette
- **TASK-009**: Define Typography Scale
- **TASK-010**: Create Figma Variables Collection
- **TASK-011**: Design JSON Token Structure
- **TASK-017**: GitHub Actions Token Sync
- **TASK-019**: Create Semantic Token Definitions

---

## Effort Breakdown

- Color variables population: 2 hours
- Typography variables: 1.5 hours
- Spacing variables: 1 hour
- Shadow variables: 1 hour
- Border variables: 1 hour
- Dark mode configuration: 1 hour
- Component application: 0.5 hours
- Documentation: 0.5 hours

**Total:** 8 hours
