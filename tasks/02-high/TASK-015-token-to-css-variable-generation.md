# TASK-015: Token-to-CSS Variable Generation

**Task ID:** TASK-015
**Title:** Token-to-CSS Variable Generation
**Priority:** High
**Status:** Not Started
**Assigned To:** Developer
**Estimated Time:** 6 hours
**Phase:** Phase 1 - Token System (Weeks 3-6)

---

## Description

Configure and optimize the Style Dictionary pipeline to generate CSS custom properties (CSS variables) from design tokens. Ensure the generated CSS variables follow naming conventions, are properly scoped, support theming, and are consumable by components. This is the primary token delivery mechanism for the component library.

---

## Acceptance Criteria

### CSS Variable Generation
- [ ] All design tokens generate corresponding CSS variables
- [ ] Variable naming follows convention: `--category-subcategory-property-modifier`
- [ ] Examples: `--color-primary-500`, `--spacing-4`, `--typography-font-size-h1`
- [ ] Variables are organized by category in separate CSS files (optional)
- [ ] Master CSS file imports all categories

### Variable Scoping
- [ ] Global variables defined in `:root` selector
- [ ] Theme-specific variables scoped appropriately
- [ ] Light mode variables in `:root` (default)
- [ ] Dark mode variables in `[data-theme="dark"]` (Phase 4)

### CSS Output Structure
```css
:root {
  /* Colors - Primitives */
  --color-teal-50: #f3feff;
  --color-teal-500: #00a6b0;
  
  /* Colors - Semantic */
  --color-primary-500: var(--color-teal-500);
  --color-button-primary-bg: var(--color-primary-500);
  
  /* Typography */
  --typography-font-family-heading: 'Poppins', sans-serif;
  --typography-font-size-h1: 2.5rem;
  --typography-font-weight-bold: 700;
  
  /* Spacing */
  --spacing-0: 0;
  --spacing-4: 1rem;
  
  /* Shadows */
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  
  /* Borders */
  --border-radius-md: 0.5rem;
  --border-width-thin: 1px;
}
```

### Size Value Transformations
- [ ] px values converted to rem (16px = 1rem)
- [ ] Configurable base font size (default: 16px)
- [ ] Line heights as unitless values
- [ ] Spacing values in rem

### Token Reference Resolution
- [ ] Semantic tokens reference primitives correctly
- [ ] Token aliases resolve properly (`--color-primary-500: var(--color-teal-500)`)
- [ ] No circular references
- [ ] All references are valid

### Browser Support
- [ ] Generated CSS works in all target browsers (Chrome, Firefox, Safari 14+)
- [ ] Fallback values for older browsers (optional)
- [ ] CSS custom property polyfill documented (if needed)

### Documentation
- [ ] CSS variables documented in Storybook
- [ ] Usage examples showing how to consume variables
- [ ] Token-to-variable mapping table
- [ ] Migration guide for updating tokens

---

## Dependencies

### Requires:
- **TASK-011**: Design JSON Token Structure
- **TASK-012**: Setup Style Dictionary Pipeline

### Blocks:
- **TASK-014**: Base Component Template (components use CSS variables)
- **TASK-020**: Design Storybook Theme (Storybook uses variables)
- All component tasks

---

## Implementation Steps

### Step 1: Configure CSS Platform in Style Dictionary (1.5 hours)
1. Update `style-dictionary.config.js`:
```javascript
module.exports = {
  source: ['tokens/**/*.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'dist/css/',
      files: [
        {
          destination: 'variables.css',
          format: 'css/variables',
          options: {
            selector: ':root',
            outputReferences: true // Keep token references
          }
        }
      ]
    }
  }
};
```
2. Configure separate files for each category (optional)
3. Test CSS generation: `pnpm build:tokens`

### Step 2: Create Custom px-to-rem Transform (1 hour)
```javascript
StyleDictionary.registerTransform({
  name: 'size/pxToRem',
  type: 'value',
  matcher: (token) => {
    return token.type === 'dimension' && token.value.includes('px');
  },
  transformer: (token) => {
    const val = parseFloat(token.value);
    return `${val / 16}rem`;
  }
});

// Register custom transform group
StyleDictionary.registerTransformGroup({
  name: 'custom/css',
  transforms: [
    'attribute/cti',
    'name/cti/kebab',
    'size/pxToRem',
    'color/css'
  ]
});
```

### Step 3: Configure Variable Naming (1 hour)
1. Create custom name transform for kebab-case:
```javascript
StyleDictionary.registerTransform({
  name: 'name/cti/kebab-with-prefix',
  type: 'name',
  transformer: (token, options) => {
    return '--' + token.path.join('-');
  }
});
```
2. Ensure consistent naming across all tokens
3. Test naming output

### Step 4: Handle Token References (1 hour)
1. Enable `outputReferences: true` in config
2. Verify semantic tokens reference primitives:
```css
/* Should output: */
--color-primary-500: var(--color-teal-500);
/* Not: */
--color-primary-500: #00a6b0;
```
3. Create validation script to check reference resolution
4. Test all token references resolve correctly

### Step 5: Organize CSS Output (1 hour)
1. Create separate category files (optional):
   - `colors.css` - all color variables
   - `typography.css` - all typography variables
   - `spacing.css` - all spacing variables
   - `shadows.css` - shadow variables
   - `borders.css` - border variables
2. Create master `index.css` that imports all:
```css
@import './colors.css';
@import './typography.css';
@import './spacing.css';
@import './shadows.css';
@import './borders.css';
```
3. Configure both options (single file + modular)

### Step 6: Test CSS Variables in Components (1 hour)
1. Import CSS variables in test component:
```tsx
import '@yourorg/tokens/dist/css/variables.css';

function TestButton() {
  return (
    <button style={{
      backgroundColor: 'var(--color-button-primary-bg)',
      color: 'var(--color-button-primary-text)',
      padding: 'var(--spacing-2) var(--spacing-4)',
      borderRadius: 'var(--border-radius-md)'
    }}>
      Test Button
    </button>
  );
}
```
2. Verify variables apply correctly
3. Test in browser DevTools
4. Test with different themes (if applicable)

### Step 7: Document CSS Variables (0.5 hours)
1. Create documentation in Storybook:
   - Show all available CSS variables
   - Provide usage examples
   - Document naming convention
2. Add to README:
   - How to import variables
   - How to use in CSS/SCSS
   - How to use in styled-components/Emotion
3. Create token-to-variable mapping reference

---

## Definition of Done

- [ ] Style Dictionary generates valid CSS variables
- [ ] All tokens have corresponding CSS variables
- [ ] Variable naming follows convention (`--category-subcategory-property`)
- [ ] px values converted to rem
- [ ] Token references resolve correctly (semantic → primitive)
- [ ] CSS variables scoped to `:root`
- [ ] Generated CSS is valid (no syntax errors)
- [ ] CSS variables work in test component
- [ ] Browser compatibility verified
- [ ] Documentation complete (usage examples, naming guide)
- [ ] CSS generation reviewed and approved by team

---

## Notes

### CSS Custom Properties Benefits:
- Native browser support (no build step needed)
- Dynamic theming (change at runtime)
- Scoped to specific elements
- Good browser support (IE11 requires polyfill)

### rem vs px:
- rem: Relative to root font size, respects user preferences
- px: Absolute, ignores browser zoom
- Use rem for accessibility (WCAG 1.4.4)

### Token Reference Strategy:
- Keep references in output (`outputReferences: true`)
- Makes theming easier (change one primitive, updates all semantic)
- Example: Change `--color-teal-500` updates all primary colors

---

## Related Tasks

- **TASK-011**: Design JSON Token Structure
- **TASK-012**: Setup Style Dictionary Pipeline
- **TASK-014**: Base Component Template
- **TASK-016**: TypeScript Types for Tokens
- **TASK-020**: Design Storybook Theme

---

**Estimated Effort:** 6 hours
