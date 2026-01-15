# Icon Component Guidelines

The Icon component renders SVG icons with consistent sizing.

## Import

```tsx
import { Icon } from '@dsai-io/react';
```

## When to Use

Use Icon when:

- Adding visual indicators to UI
- Supplementing text labels
- Creating icon-only buttons (with aria-label)
- Showing status or action indicators

## Basic Usage

```tsx
<Icon name="search" />
<Icon name="settings" />
<Icon name="user" />
```

## Sizes

```tsx
<Icon name="star" size="xs" />  {/* 12px */}
<Icon name="star" size="sm" />  {/* 16px */}
<Icon name="star" size="md" />  {/* 20px */}
<Icon name="star" size="lg" />  {/* 24px */}
<Icon name="star" size="xl" />  {/* 32px */}
```

## With Text

```tsx
<Button>
  <Icon name="plus" />
  Add Item
</Button>

<span style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
  <Icon name="check" />
  Completed
</span>
```

## Decorative vs Informative

```tsx
// Decorative - has text label, hide from AT
<Button>
  <Icon name="save" aria-hidden="true" />
  Save
</Button>

// Informative - icon only, needs label
<Button aria-label="Save document">
  <Icon name="save" />
</Button>
```

## Accessibility

```tsx
// Icon with text - icon is decorative
<Button>
  <Icon name="trash" aria-hidden="true" />
  Delete
</Button>

// Icon-only button - provide accessible name
<Button aria-label="Delete item">
  <Icon name="trash" />
</Button>
```

## Do's and Don'ts

### Do

- Use consistent icon set
- Pair with text when meaning unclear
- Provide aria-label for icon-only buttons
- Use appropriate sizes

### Don't

- Don't use icons without accessible names
- Don't mix icon styles
- Don't use icons as primary content
