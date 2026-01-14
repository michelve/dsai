# DSAi Border Tokens

Design tokens for borders in the DSAi design system. Use these tokens for consistent border styling across components.

> **Token Prefix**: CSS variables use the `--dsai-border-*` prefix.

## Border Width

| Token | CSS Variable | Value | SCSS Variable | Usage |
| ----- | ------------ | ----- | ------------- | ----- |
| 0 | `--dsai-border-width-0` | 0 | `$border-width-0` | No border |
| 1 | `--dsai-border-width-1` | 1px | `$border-width` | Default border |
| 2 | `--dsai-border-width-2` | 2px | `$border-width-2` | Emphasized border |
| 3 | `--dsai-border-width-3` | 3px | `$border-width-3` | Strong border |
| 4 | `--dsai-border-width-4` | 4px | `$border-width-4` | Heavy border |
| 5 | `--dsai-border-width-5` | 5px | `$border-width-5` | Maximum border |

## Border Radius

| Token | CSS Variable | Value | SCSS Variable | Usage |
| ----- | ------------ | ----- | ------------- | ----- |
| 0 | `--dsai-border-radius-0` | 0 | `$border-radius-0` | Square corners |
| sm | `--dsai-border-radius-sm` | 0.25rem (4px) | `$border-radius-sm` | Subtle rounding |
| default | `--dsai-border-radius` | 0.375rem (6px) | `$border-radius` | Standard rounding |
| lg | `--dsai-border-radius-lg` | 0.5rem (8px) | `$border-radius-lg` | Large rounding |
| xl | `--dsai-border-radius-xl` | 1rem (16px) | `$border-radius-xl` | Extra large rounding |
| xxl | `--dsai-border-radius-xxl` | 2rem (32px) | `$border-radius-xxl` | Maximum rounding |
| pill | `--dsai-border-radius-pill` | 50rem | `$border-radius-pill` | Fully rounded (pills) |
| circle | `--dsai-border-radius-circle` | 50% | - | Perfect circles |

## Usage Examples

### Basic Borders

```tsx
// Card with default border radius
<Card>Content</Card>

// Custom border using tokens
<div
  style={{
    border: `1px solid var(--dsai-color-gray-300)`,
    borderRadius: 'var(--dsai-border-radius)',
  }}
>
  Custom container
</div>
```

### Pill Buttons

```tsx
// Pill-shaped button
<Button
  style={{ borderRadius: 'var(--dsai-border-radius-pill)' }}
>
  Pill Button
</Button>
```

### SCSS Usage

```scss
@use '@dsai/tokens' as *;

.custom-card {
  border: $border-width solid $border-color;
  border-radius: $border-radius-lg;
}

.avatar {
  border-radius: $border-radius-circle;
}
```

## Component Default Radii

| Component | Default Radius | Token |
| --------- | -------------- | ----- |
| Button | 6px | `--dsai-border-radius` |
| Card | 8px | `--dsai-border-radius-lg` |
| Input | 6px | `--dsai-border-radius` |
| Badge | 6px | `--dsai-border-radius` |
| Modal | 8px | `--dsai-border-radius-lg` |
| Tooltip | 4px | `--dsai-border-radius-sm` |
| Alert | 6px | `--dsai-border-radius` |

## Platform Syntax

| Platform | Syntax Example |
| -------- | -------------- |
| Web (CSS) | `--dsai-border-radius-lg` |
| SCSS | `$border-radius-lg` |
| Android | `border.radius.lg` |
| iOS | `Border.Radius.Lg` |

## Do's and Don'ts

### Do

- Use border radius tokens for consistent rounding
- Apply `border-radius-pill` for tag/chip components
- Use `border-radius-circle` for avatars and circular buttons
- Combine with color tokens for border colors

### Don't

- Don't use arbitrary pixel values for border radius
- Don't mix border-radius systems
- Don't use border-radius greater than half the element height (use pill instead)
- Don't hardcode border styles—use tokens
