# TASK-019: Create Semantic Token Definitions

**Task ID:** TASK-019
**Title:** Create Semantic Token Definitions
**Priority:** High
**Status:** Not Started
**Assigned To:** Designer + Developer
**Estimated Time:** 8 hours
**Phase:** Phase 1 - Token System (Weeks 3-6)

---

## Description

Define semantic tokens that reference primitive tokens and provide component-specific, purpose-driven token names. Semantic tokens abstract away primitive values and create a meaningful API for component developers (e.g., `button-primary-bg` instead of `color-teal-500`). This improves maintainability and allows design changes without touching component code.

---

## Acceptance Criteria

### Semantic Color Tokens

- [ ] Background tokens: `bg-primary`, `bg-secondary`, `bg-tertiary`, `bg-surface`, `bg-overlay`
- [ ] Text tokens: `text-primary`, `text-secondary`, `text-tertiary`, `text-disabled`, `text-inverse`
- [ ] Border tokens: `border-default`, `border-strong`, `border-subtle`, `border-disabled`
- [ ] Interactive tokens: `interactive-primary`, `interactive-secondary`, `interactive-danger`, `interactive-success`
- [ ] State tokens: `hover`, `active`, `focus`, `disabled` for each interactive token

### Component-Specific Tokens

- [ ] Button tokens: `button-primary-bg`, `button-primary-text`, `button-primary-border`, `button-primary-hover-bg`
- [ ] Alert tokens: `alert-info-bg`, `alert-success-bg`, `alert-warning-bg`, `alert-error-bg`
- [ ] Badge tokens: `badge-primary-bg`, `badge-secondary-bg`, `badge-success-bg`
- [ ] Card tokens: `card-bg`, `card-border`, `card-shadow`
- [ ] Input tokens: `input-bg`, `input-border`, `input-focus-border`, `input-disabled-bg`

### Semantic Typography Tokens

- [ ] Heading tokens: `heading-display`, `heading-h1`, `heading-h2`, `heading-h3`
- [ ] Body tokens: `body-large`, `body-base`, `body-small`, `body-caption`
- [ ] UI tokens: `ui-button`, `ui-label`, `ui-helper`

### Semantic Spacing Tokens

- [ ] Layout tokens: `layout-gutter`, `layout-container-padding`, `layout-section-gap`
- [ ] Component tokens: `component-padding-xs`, `component-padding-sm`, `component-padding-md`, `component-padding-lg`
- [ ] Element tokens: `element-gap-tight`, `element-gap-normal`, `element-gap-loose`

### Token Aliases

- [ ] All semantic tokens use token references (not hard-coded values)
- [ ] References format: `{primitive.token.path}`
- [ ] Example: `button-primary-bg: {color.teal.500}`

### Documentation

- [ ] Semantic token usage guide
- [ ] When to use primitive vs semantic tokens
- [ ] How to add new semantic tokens
- [ ] Token decision tree

---

## Dependencies

### Requires:

- **TASK-011**: Design JSON Token Structure (primitive tokens)
- **TASK-018**: Populate Figma Variables (primitive values)

### Blocks:

- **TASK-020**: Design Storybook Theme (uses semantic tokens)
- **TASK-021-045**: All component tasks (components use semantic tokens)

---

## Implementation Steps

### Step 1: Define Semantic Color Tokens (2 hours)

Create `tokens/color/semantic.json`:

```json
{
  "color": {
    "bg": {
      "primary": {
        "value": "{color.white.value}",
        "type": "color",
        "description": "Primary background for surfaces"
      },
      "secondary": {
        "value": "{color.gray.50.value}",
        "type": "color",
        "description": "Secondary background for subtle surfaces"
      },
      "tertiary": {
        "value": "{color.gray.100.value}",
        "type": "color",
        "description": "Tertiary background for nested surfaces"
      }
    },
    "text": {
      "primary": {
        "value": "{color.teal.950.value}",
        "type": "color",
        "description": "Primary text color"
      },
      "secondary": {
        "value": "{color.gray.700.value}",
        "type": "color",
        "description": "Secondary text color for less emphasis"
      }
    },
    "button": {
      "primary": {
        "bg": {
          "value": "{color.teal.500.value}",
          "type": "color"
        },
        "text": {
          "value": "{color.white.value}",
          "type": "color"
        },
        "border": {
          "value": "{color.teal.500.value}",
          "type": "color"
        },
        "hover": {
          "bg": {
            "value": "{color.teal.600.value}",
            "type": "color"
          }
        }
      }
    }
  }
}
```

### Step 2: Define Component-Specific Tokens (2 hours)

Add component tokens to `semantic.json`:

```json
{
  "color": {
    "alert": {
      "info": {
        "bg": { "value": "{color.blue.50.value}", "type": "color" },
        "border": { "value": "{color.blue.300.value}", "type": "color" },
        "text": { "value": "{color.blue.900.value}", "type": "color" }
      },
      "success": {
        "bg": { "value": "{color.green.50.value}", "type": "color" },
        "border": { "value": "{color.green.300.value}", "type": "color" },
        "text": { "value": "{color.green.900.value}", "type": "color" }
      },
      "warning": {
        "bg": { "value": "{color.yellow.50.value}", "type": "color" },
        "border": { "value": "{color.yellow.300.value}", "type": "color" },
        "text": { "value": "{color.yellow.900.value}", "type": "color" }
      },
      "error": {
        "bg": { "value": "{color.red.50.value}", "type": "color" },
        "border": { "value": "{color.red.300.value}", "type": "color" },
        "text": { "value": "{color.red.900.value}", "type": "color" }
      }
    },
    "badge": {
      "primary": {
        "bg": { "value": "{color.teal.500.value}", "type": "color" },
        "text": { "value": "{color.white.value}", "type": "color" }
      },
      "secondary": {
        "bg": { "value": "{color.gray.200.value}", "type": "color" },
        "text": { "value": "{color.gray.800.value}", "type": "color" }
      }
    }
  }
}
```

### Step 3: Define Semantic Typography Tokens (1.5 hours)

Create `tokens/typography/semantic.json`:

```json
{
  "typography": {
    "heading": {
      "display": {
        "font-family": { "value": "{typography.font-family.heading.value}" },
        "font-size": { "value": "{typography.font-size.display.value}" },
        "font-weight": { "value": "{typography.font-weight.bold.value}" },
        "line-height": { "value": "{typography.line-height.tight.value}" }
      },
      "h1": {
        "font-family": { "value": "{typography.font-family.heading.value}" },
        "font-size": { "value": "{typography.font-size.h1.value}" },
        "font-weight": { "value": "{typography.font-weight.bold.value}" },
        "line-height": { "value": "{typography.line-height.tight.value}" }
      }
    },
    "body": {
      "large": {
        "font-family": { "value": "{typography.font-family.body.value}" },
        "font-size": { "value": "18px" },
        "line-height": { "value": "{typography.line-height.normal.value}" }
      },
      "base": {
        "font-family": { "value": "{typography.font-family.body.value}" },
        "font-size": { "value": "{typography.font-size.body.value}" },
        "line-height": { "value": "{typography.line-height.normal.value}" }
      }
    }
  }
}
```

### Step 4: Define Semantic Spacing Tokens (1 hour)

Create `tokens/spacing/semantic.json`:

```json
{
  "spacing": {
    "layout": {
      "gutter": { "value": "{spacing.5.value}", "type": "spacing" },
      "container-padding": { "value": "{spacing.6.value}", "type": "spacing" },
      "section-gap": { "value": "{spacing.8.value}", "type": "spacing" }
    },
    "component": {
      "padding": {
        "xs": { "value": "{spacing.1.value}", "type": "spacing" },
        "sm": { "value": "{spacing.2.value}", "type": "spacing" },
        "md": { "value": "{spacing.3.value}", "type": "spacing" },
        "lg": { "value": "{spacing.4.value}", "type": "spacing" }
      }
    }
  }
}
```

### Step 5: Update Style Dictionary Config (1 hour)

Update `style-dictionary.config.js` to include semantic tokens:

```javascript
module.exports = {
  source: [
    'tokens/color/primitive.json',
    'tokens/color/semantic.json', // Add semantic
    'tokens/typography/primitive.json',
    'tokens/typography/semantic.json', // Add semantic
    'tokens/spacing/primitive.json',
    'tokens/spacing/semantic.json', // Add semantic
    'tokens/shadow.json',
    'tokens/border.json',
  ],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'dist/css/',
      files: [
        {
          destination: 'variables.css',
          format: 'css/variables',
          options: {
            outputReferences: true, // Important for semantic tokens
          },
        },
      ],
    },
  },
};
```

### Step 6: Create Figma Semantic Variables (1 hour)

1. In Figma, create new collection: "Semantic Tokens"
2. Add semantic color variables:
   - `semantic/bg/primary` → reference `{color/white}`
   - `semantic/text/primary` → reference `{color/teal/950}`
   - `semantic/button/primary/bg` → reference `{color/teal/500}`
3. Use variable aliases (not hard-coded values)

### Step 7: Documentation (0.5 hours)

Create `docs/tokens/semantic-tokens.md`:

```markdown
# Semantic Tokens

## What are Semantic Tokens?

Semantic tokens provide meaningful names for design decisions.
Use semantic tokens in components, not primitive tokens.

## Examples

✅ DO: `color: var(--button-primary-bg)`
❌ DON'T: `color: var(--color-teal-500)`

## When to Use Semantic Tokens

- In component styles
- For theme-specific values
- For context-specific colors

## When to Use Primitive Tokens

- Never in components (use semantic tokens)
- Only when defining new semantic tokens
```

### Step 8: Test Semantic Tokens (0.5 hours)

1. Build tokens: `pnpm --filter @yourorg/tokens build`
2. Verify CSS output includes semantic tokens:

```css
:root {
  --button-primary-bg: var(--color-teal-500);
  --button-primary-text: var(--color-white);
}
```

3. Test in sample component

---

## Definition of Done

- [ ] Semantic color tokens defined for backgrounds, text, borders, interactive states
- [ ] Component-specific tokens defined (button, alert, badge, card, input)
- [ ] Semantic typography tokens defined (headings, body, UI)
- [ ] Semantic spacing tokens defined (layout, component, element)
- [ ] All semantic tokens use references to primitive tokens
- [ ] Style Dictionary config updated to include semantic token files
- [ ] Figma semantic variables collection created
- [ ] CSS output includes semantic tokens with proper references
- [ ] Documentation created (usage guide, decision tree)
- [ ] Design and dev teams reviewed and approved

---

## Testing Requirements

### Token Validation:

- [ ] All semantic tokens reference primitive tokens (no hard-coded values)
- [ ] CSS output uses `var()` references correctly
- [ ] Token naming is consistent and meaningful
- [ ] No circular references

### Component Testing:

- [ ] Sample component uses semantic tokens
- [ ] Changing primitive token updates semantic token
- [ ] Token changes reflect in components

---

## Notes

### Semantic Token Benefits:

- **Maintainability**: Change color once, updates everywhere
- **Clarity**: `button-primary-bg` is clearer than `teal-500`
- **Theming**: Easy to create dark mode or brand variants
- **Consistency**: Enforces design system usage

### Naming Convention:

- Format: `{context}-{element}-{property}-{state}`
- Examples:
  - `button-primary-bg` (context-element-property)
  - `button-primary-hover-bg` (context-element-state-property)
  - `alert-error-border` (context-variant-property)

### Common Pitfalls:

- Creating too many semantic tokens (start small, add as needed)
- Using primitive tokens directly in components
- Forgetting to use outputReferences in Style Dictionary

---

## Related Tasks

- **TASK-011**: Design JSON Token Structure
- **TASK-012**: Setup Style Dictionary Pipeline
- **TASK-018**: Populate Figma Variables
- **TASK-020**: Design Storybook Theme
- **TASK-021-045**: Component tasks (consumers of semantic tokens)

---

## Effort Breakdown

- Semantic color tokens: 2 hours
- Component-specific tokens: 2 hours
- Semantic typography tokens: 1.5 hours
- Semantic spacing tokens: 1 hour
- Style Dictionary config update: 1 hour
- Figma semantic variables: 1 hour
- Documentation: 0.5 hours
- Testing: 0.5 hours

**Total:** 8 hours
