# DSAi Shadow Tokens

Design tokens for shadows and elevation in the DSAi design system. Use these tokens for consistent depth and elevation across components.

> **Token Prefix**: CSS variables use the `--dsai-shadow-*` prefix.

## Shadow Scale

| Token | CSS Variable | Value | SCSS Variable | Usage |
| ----- | ------------ | ----- | ------------- | ----- |
| sm | `--dsai-shadow-sm` | 0 0.125rem 0.25rem rgba(0,0,0,0.075) | `$box-shadow-sm` | Subtle elevation |
| default | `--dsai-shadow-default` | 0 0.5rem 1rem rgba(0,0,0,0.15) | `$box-shadow` | Standard elevation |
| lg | `--dsai-shadow-lg` | 0 1rem 3rem rgba(0,0,0,0.175) | `$box-shadow-lg` | High elevation |
| inset | `--dsai-shadow-inset` | inset 0 1px 2px rgba(0,0,0,0.075) | `$box-shadow-inset` | Inset/pressed state |

## Shadow Properties

For advanced customization, individual shadow properties are available:

### Default Shadow

| Property | CSS Variable | Value |
| -------- | ------------ | ----- |
| Offset X | `--dsai-shadow-default-offset-x` | 0 |
| Offset Y | `--dsai-shadow-default-offset-y` | 8px (0.5rem) |
| Blur | `--dsai-shadow-default-blur` | 16px (1rem) |
| Spread | `--dsai-shadow-default-spread` | 0 |
| Color | Uses semantic emphasis color | rgba(0,0,0,0.15) |

### Small Shadow

| Property | CSS Variable | Value |
| -------- | ------------ | ----- |
| Offset X | `--dsai-shadow-sm-offset-x` | 0 |
| Offset Y | `--dsai-shadow-sm-offset-y` | 2px (0.125rem) |
| Blur | `--dsai-shadow-sm-blur` | 4px (0.25rem) |
| Spread | `--dsai-shadow-sm-spread` | 0 |

### Large Shadow

| Property | CSS Variable | Value |
| -------- | ------------ | ----- |
| Offset X | `--dsai-shadow-lg-offset-x` | 0 |
| Offset Y | `--dsai-shadow-lg-offset-y` | 16px (1rem) |
| Blur | `--dsai-shadow-lg-blur` | 48px (3rem) |
| Spread | `--dsai-shadow-lg-spread` | 0 |

## Usage Examples

### Component Elevation

```tsx
// Card with default shadow
<Card className="shadow">
  Elevated card content
</Card>

// Custom elevation using tokens
<div
  style={{
    boxShadow: 'var(--dsai-shadow-default)',
  }}
>
  Elevated container
</div>
```

### Elevation Hierarchy

```tsx
// Low elevation - subtle
<div style={{ boxShadow: 'var(--dsai-shadow-sm)' }}>
  Surface level content
</div>

// Medium elevation - default
<div style={{ boxShadow: 'var(--dsai-shadow-default)' }}>
  Floating content (cards, dropdowns)
</div>

// High elevation - prominent
<div style={{ boxShadow: 'var(--dsai-shadow-lg)' }}>
  Modal, dialog, tooltip
</div>
```

### Inset Shadow

```tsx
// Pressed button state
<button
  style={{
    boxShadow: 'var(--dsai-shadow-inset)',
  }}
>
  Pressed state
</button>
```

### SCSS Usage

```scss
@use '@dsai-io/tokens' as *;

.card {
  box-shadow: $box-shadow;

  &:hover {
    box-shadow: $box-shadow-lg;
  }
}

.input:focus {
  box-shadow: $box-shadow-sm, 0 0 0 0.25rem rgba($primary, 0.25);
}
```

## Component Default Shadows

| Component | Default Shadow | Token | When Applied |
| --------- | -------------- | ----- | ------------ |
| Card | None (optional) | `--dsai-shadow-default` | `.shadow` class |
| Dropdown | Default | `--dsai-shadow-default` | When open |
| Modal | Large | `--dsai-shadow-lg` | Always |
| Tooltip | Small | `--dsai-shadow-sm` | When visible |
| Popover | Default | `--dsai-shadow-default` | When open |
| Toast | Default | `--dsai-shadow-default` | When visible |

## Elevation Guidelines

### Elevation Levels

| Level | Shadow | Z-Index Range | Use Case |
| ----- | ------ | ------------- | -------- |
| 0 | None | 0 | Page surface |
| 1 | sm | 1-99 | Cards, list items |
| 2 | default | 100-999 | Dropdowns, popovers |
| 3 | lg | 1000+ | Modals, dialogs, toasts |

### Hover Elevation

Increase shadow on hover for interactive cards:

```tsx
<Card
  className="shadow-sm"
  style={{
    transition: 'box-shadow 0.15s ease-in-out',
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.boxShadow = 'var(--dsai-shadow-default)';
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.boxShadow = 'var(--dsai-shadow-sm)';
  }}
>
  Hover to elevate
</Card>
```

## Platform Syntax

| Platform | Syntax Example |
| -------- | -------------- |
| Web (CSS) | `--dsai-shadow-default` |
| SCSS | `$box-shadow` |
| Android | `shadow.default` |
| iOS | `Shadow.Default` |

## Dark Mode Considerations

In dark mode, shadows are less visible. Consider:

- Using stronger shadow values
- Adding subtle border for definition
- Adjusting opacity for better visibility

## Do's and Don'ts

### Do

- Use shadow tokens for consistent elevation
- Increase shadow on hover for interactive elements
- Combine shadows with transition for smooth effects
- Use higher elevation for overlay elements

### Don't

- Don't use arbitrary shadow values
- Don't apply shadows to every element (creates visual noise)
- Don't use large shadows on small elements
- Don't forget to consider dark mode visibility
