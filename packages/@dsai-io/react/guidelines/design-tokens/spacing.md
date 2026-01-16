# DSAi Spacing Tokens

Design tokens for spacing in the DSAi design system. Use consistent spacing to create visual rhythm and hierarchy.

> **Token Prefix**: CSS variables use the `--dsai-spacing-*` prefix (Figma exports) or `--pg-spacing-*` (playground).

## Spacing Scale

DSAi uses Bootstrap's spacing scale aligned with a 4px grid:

### Core Spacing (Bootstrap Scale)

| Token | CSS Variable       | Value         | SCSS Variable | Usage               |
| ----- | ------------------ | ------------- | ------------- | ------------------- |
| 0     | `--dsai-spacing-0` | 0             | `$spacing-0`  | No spacing          |
| 1     | `--dsai-spacing-1` | 0.25rem (4px) | `$spacing-1`  | Extra small spacing |
| 2     | `--dsai-spacing-2` | 0.5rem (8px)  | `$spacing-2`  | Small spacing       |
| 3     | `--dsai-spacing-3` | 1rem (16px)   | `$spacing-3`  | Base spacing        |
| 4     | `--dsai-spacing-4` | 1.5rem (24px) | `$spacing-4`  | Medium spacing      |
| 5     | `--dsai-spacing-5` | 3rem (48px)   | `$spacing-5`  | Large spacing       |

### Extended Spacing Scale

| Token | CSS Variable        | Value         | SCSS Variable | Usage               |
| ----- | ------------------- | ------------- | ------------- | ------------------- |
| 6     | `--dsai-spacing-6`  | 4rem (64px)   | `$spacing-6`  | Extra large spacing |
| 7     | `--dsai-spacing-7`  | 5rem (80px)   | `$spacing-7`  | 2X extra large      |
| 8     | `--dsai-spacing-8`  | 6rem (96px)   | `$spacing-8`  | 3X extra large      |
| 9     | `--dsai-spacing-9`  | 8rem (128px)  | `$spacing-9`  | 4X extra large      |
| 10    | `--dsai-spacing-10` | 10rem (160px) | `$spacing-10` | 5X extra large      |

### Intermediate Values (4px Grid)

| Token | CSS Variable        | Value          | SCSS Variable | Usage                 |
| ----- | ------------------- | -------------- | ------------- | --------------------- |
| 12    | `--dsai-spacing-12` | 0.75rem (12px) | `$spacing-12` | Button/input padding  |
| 20    | `--dsai-spacing-20` | 1.25rem (20px) | `$spacing-20` | Between 16px and 24px |
| 28    | `--dsai-spacing-28` | 1.75rem (28px) | `$spacing-28` | Between 24px and 32px |
| 32    | `--dsai-spacing-32` | 2rem (32px)    | `$spacing-32` | Card padding          |
| 36    | `--dsai-spacing-36` | 2.25rem (36px) | `$spacing-36` | Section gaps          |
| 40    | `--dsai-spacing-40` | 2.5rem (40px)  | `$spacing-40` | Large gaps            |
| 44    | `--dsai-spacing-44` | 2.75rem (44px) | `$spacing-44` | Component spacing     |
| 56    | `--dsai-spacing-56` | 3.5rem (56px)  | `$spacing-56` | Between 48px and 64px |

## Component Spacing

Components have built-in spacing. Use `gap` prop where available:

```tsx
// Button group with gap
<div style={{ display: 'flex', gap: 'var(--dsai-spacing-3)' }}>
  <Button>Cancel</Button>
  <Button variant="primary">Save</Button>
</div>

// Card with default padding
<Card>
  <Card.Body>Content has built-in padding</Card.Body>
</Card>
```

## Layout Patterns

### Stack (Vertical Spacing)

```tsx
// Use flexbox with gap for vertical stacking
<div
  style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--dsai-spacing-4)',
  }}
>
  <Input label="Name" />
  <Input label="Email" />
  <Button>Submit</Button>
</div>
```

### Inline (Horizontal Spacing)

```tsx
// Horizontal layout with gap
<div
  style={{
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--dsai-spacing-2)',
  }}
>
  <Icon name="user" />
  <Typography.Body>Username</Typography.Body>
</div>
```

### Grid Spacing

```tsx
// Grid with consistent gaps (uses gutter tokens)
<div
  style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 'var(--dsai-layout-gutters-4)', // 24px default gutter
  }}
>
  <Card>Item 1</Card>
  <Card>Item 2</Card>
  <Card>Item 3</Card>
</div>
```

## Padding vs Margin

- **Padding**: Space inside an element (use for containers, cards, buttons)
- **Margin**: Space outside an element (use for layout positioning)

Prefer `gap` over margin for spacing between siblings:

```tsx
// Preferred - gap for sibling spacing
<div style={{ display: 'flex', gap: 'var(--dsai-spacing-4)' }}>
  <div>Item 1</div>
  <div>Item 2</div>
</div>

// Avoid - margin for sibling spacing
<div>
  <div style={{ marginRight: '1.5rem' }}>Item 1</div>
  <div>Item 2</div>
</div>
```

## Layout Grid Tokens

Bootstrap-compatible grid system values:

| Token        | CSS Variable                      | Value         | Usage                 |
| ------------ | --------------------------------- | ------------- | --------------------- |
| columns      | `--dsai-layout-grid-columns`      | 12            | Grid column count     |
| gutter-width | `--dsai-layout-grid-gutter-width` | 1.5rem (24px) | Default column gutter |
| row-columns  | `--dsai-layout-grid-row-columns`  | 6             | Max row columns       |

### Gutter Scale

| Token | CSS Variable              | Value         | Usage            |
| ----- | ------------------------- | ------------- | ---------------- |
| 0     | `--dsai-layout-gutters-0` | 0             | No gutter (.g-0) |
| 1     | `--dsai-layout-gutters-1` | 0.25rem (4px) | Extra small      |
| 2     | `--dsai-layout-gutters-2` | 0.5rem (8px)  | Small            |
| 3     | `--dsai-layout-gutters-3` | 1rem (16px)   | Medium           |
| 4     | `--dsai-layout-gutters-4` | 1.5rem (24px) | Default          |
| 5     | `--dsai-layout-gutters-5` | 3rem (48px)   | Large            |

### Container Max Widths

| Breakpoint | CSS Variable                            | Max Width         |
| ---------- | --------------------------------------- | ----------------- |
| sm         | `--dsai-layout-container-max-width-sm`  | 33.75rem (540px)  |
| md         | `--dsai-layout-container-max-width-md`  | 45rem (720px)     |
| lg         | `--dsai-layout-container-max-width-lg`  | 60rem (960px)     |
| xl         | `--dsai-layout-container-max-width-xl`  | 71.25rem (1140px) |
| xxl        | `--dsai-layout-container-max-width-xxl` | 82.5rem (1320px)  |

## Responsive Spacing

Components handle responsive spacing internally. For custom layouts:

```tsx
// Use CSS custom properties with media queries
<style>
  .section {
    padding: var(--dsai-spacing-4);
  }

  @media (min-width: 768px) {
    .section {
      padding: var(--dsai-spacing-8);
    }
  }
</style>
```

## Common Spacing Patterns

### Form Layout

- Label to input: `--dsai-spacing-1` (4px)
- Between form fields: `--dsai-spacing-3` (16px)
- Form sections: `--dsai-spacing-5` (48px)

### Card Layout

- Card padding: `--dsai-spacing-32` (32px) or `--dsai-spacing-4` (24px)
- Content gap: `--dsai-spacing-3` (16px)
- Card list gap: `--dsai-spacing-4` (24px)

### Page Layout

- Section padding: `--dsai-spacing-5` to `--dsai-spacing-8`
- Content max-width: Use container tokens
- Side margins: `--dsai-spacing-3` mobile, `--dsai-spacing-5` desktop

## Platform Syntax

Tokens are available for multiple platforms:

| Platform  | Syntax Example     |
| --------- | ------------------ |
| Web (CSS) | `--dsai-spacing-4` |
| SCSS      | `$spacing-4`       |
| Android   | `spacing.4`        |
| iOS       | `Spacing.4`        |

## Do's and Don'ts

### Do

- Use spacing tokens consistently
- Use `gap` for spacing between siblings
- Increase spacing for visual separation
- Keep related elements closer together
- Use the `--dsai-spacing-*` CSS variables

### Don't

- Don't use arbitrary pixel values
- Don't mix spacing systems (rem and px)
- Don't use negative margins for layout
- Don't forget mobile-first responsive spacing
- Don't hardcode spacing—always reference tokens
