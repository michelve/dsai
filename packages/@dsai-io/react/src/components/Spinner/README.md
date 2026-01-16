# Spinner Component

A Bootstrap 5 spinner component for indicating loading states.

## Features

- **2 animation types**: border (rotating) and grow (pulsing)
- **5 sizes**: xs, sm, md, lg, xl
- **8 color variants**: All Bootstrap theme colors
- **Centered option**: Easy centering in containers
- **Polymorphic**: Render as `div` or `span`
- **Accessible**: WCAG 2.2 AA compliant

## Installation

```bash
pnpm add @dsai-io/react @dsai-io/tools
```

Then generate your design tokens:

```bash
npx dsai tokens build
```

## Usage

### Basic Usage

```tsx
import { Spinner } from '@dsai-io/react';
// Import the generated theme CSS from your local project
import './generated/dsai-theme-bs.css';

function App() {
  return <Spinner />;
}
```

### Animation Types

```tsx
// Border spinner (default) - rotating circle
<Spinner animation="border" />

// Grow spinner - pulsing dot
<Spinner animation="grow" />
```

### Sizes

```tsx
<Spinner size="xs" />  // 0.75rem (12px)
<Spinner size="sm" />  // 1rem (16px)
<Spinner size="md" />  // 2rem (32px) - default
<Spinner size="lg" />  // 3rem (48px)
<Spinner size="xl" />  // 4rem (64px)
```

### Color Variants

```tsx
<Spinner variant="primary" />
<Spinner variant="secondary" />
<Spinner variant="success" />
<Spinner variant="danger" />
<Spinner variant="warning" />
<Spinner variant="info" />
<Spinner variant="light" />
<Spinner variant="dark" />
```

### Centered Spinner

```tsx
// Centers the spinner in its container
<div style={{ height: '200px' }}>
  <Spinner centered variant="primary" />
</div>
```

### In Buttons

```tsx
import { Button, Spinner } from '@dsai-io/react';

// Loading button
<Button disabled>
  <Spinner size="sm" as="span" className="me-2" />
  Loading...
</Button>;
```

### Custom Label

```tsx
// Custom accessible label
<Spinner label="Processing your request..." />
```

## Props

| Prop        | Type               | Default        | Description                   |
| ----------- | ------------------ | -------------- | ----------------------------- |
| `animation` | `SpinnerAnimation` | `'border'`     | Animation type (border, grow) |
| `size`      | `SpinnerSize`      | `'md'`         | Spinner size                  |
| `variant`   | `SpinnerVariant`   | -              | Color variant                 |
| `label`     | `string`           | `'Loading...'` | Screen reader label           |
| `centered`  | `boolean`          | `false`        | Center in container           |
| `as`        | `'div' \| 'span'`  | `'div'`        | HTML element to render        |
| `className` | `string`           | -              | Additional CSS classes        |
| `style`     | `CSSProperties`    | -              | Inline styles                 |

### Types

```typescript
type SpinnerAnimation = 'border' | 'grow';
type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type SpinnerVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'light'
  | 'dark';
```

## Accessibility

The Spinner component is built with accessibility in mind:

- **ARIA Role**: `role="status"` announces loading state
- **Accessible Label**: `aria-label` provides context
- **Visually Hidden Text**: Screen reader text included
- **Reduced Motion**: Respects `prefers-reduced-motion` via Bootstrap CSS

### Best Practices

Always provide meaningful labels for context:

```tsx
// ✅ Good - descriptive label
<Spinner label="Loading search results..." />

// ✅ Good - default label works for generic loading
<Spinner />

// ❌ Bad - empty label
<Spinner label="" />
```

## Bootstrap Classes

The Spinner component uses native Bootstrap 5 classes:

- `spinner-border` - Border animation
- `spinner-grow` - Grow animation
- `spinner-border-sm` / `spinner-grow-sm` - Small size
- `text-{variant}` - Color variants
- `visually-hidden` - Screen reader text

## Related Components

- [Button](../Button/README.md) - Uses Spinner for loading state
- [Progress](../Progress/README.md) - For progress indication
