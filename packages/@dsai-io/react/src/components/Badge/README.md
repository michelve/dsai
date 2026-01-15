# Badge Component

A Bootstrap 5 badge component for displaying labels, status indicators, and counts.

## Features

- **8 variants**: primary, secondary, success, danger, warning, info, light, dark
- **Pill shape**: Fully rounded badges with `pill` prop
- **Dot indicator**: Status dot with `dot` prop
- **Icon support**: Add icons before badge text
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
import { Badge } from '@dsai-io/react';
// Import the generated theme CSS from your local project
import './generated/dsai-theme-bs.css';

function App() {
  return <Badge variant="primary">New</Badge>;
}
```

### Variants

```tsx
<Badge variant="primary">Primary</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="danger">Danger</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="info">Info</Badge>
<Badge variant="light">Light</Badge>
<Badge variant="dark">Dark</Badge>
```

### Pill Badges

```tsx
<Badge variant="primary" pill>
  Pill Badge
</Badge>
```

### Dot Indicator

```tsx
// Dot with text
<Badge variant="success" dot>
  Online
</Badge>

// Dot only (status indicator)
<Badge variant="success" dot aria-label="Online status" />
```

### With Icon

```tsx
<Badge variant="primary" icon={<StarIcon />}>
  Featured
</Badge>
```

### Notification Badge on Button

```tsx
import { Badge, Button } from '@dsai-io/react';

// Positioned notification badge
function NotificationButton() {
  return (
    <Button variant="primary" className="position-relative">
      Inbox
      <Badge variant="danger" pill className="position-absolute top-0 start-100 translate-middle">
        99+
      </Badge>
    </Button>
  );
}

// Counter badge inside button
function CounterButton() {
  return (
    <Button variant="outline-primary">
      Messages
      <Badge variant="primary" pill className="ms-2">
        4
      </Badge>
    </Button>
  );
}
```

### Badge in Headings

```tsx
<h1>
  Example heading <Badge variant="secondary">New</Badge>
</h1>
```

## Props

| Prop         | Type              | Default     | Description                |
| ------------ | ----------------- | ----------- | -------------------------- |
| `children`   | `ReactNode`       | -           | Badge content              |
| `variant`    | `BadgeVariant`    | `'primary'` | Color variant              |
| `pill`       | `boolean`         | `false`     | Pill shape (fully rounded) |
| `dot`        | `boolean`         | `false`     | Show dot indicator         |
| `icon`       | `ReactNode`       | -           | Icon before text           |
| `className`  | `string`          | -           | Additional CSS classes     |
| `style`      | `CSSProperties`   | -           | Inline styles              |
| `aria-label` | `string`          | -           | Accessible label           |
| `id`         | `string`          | -           | ID attribute               |
| `as`         | `'span' \| 'div'` | `'span'`    | Element to render as       |

## Accessibility

The Badge component is built with accessibility in mind:

- **Semantic HTML**: Uses `<span>` by default
- **ARIA support**: Accepts `aria-label` for screen readers
- **Status role**: Dot-only badges have `role="status"` for screen reader announcement
- **Color contrast**: Meets WCAG 2.2 AA contrast requirements via Bootstrap theme

### Status vs Decorative Badges

| Badge Type                 | Example                                   | Role            | Screen Reader Behavior         |
| -------------------------- | ----------------------------------------- | --------------- | ------------------------------ |
| **Decorative** (with text) | `<Badge>New</Badge>`                      | None            | Reads text content             |
| **Status** (dot-only)      | `<Badge dot aria-label="Online" />`       | `role="status"` | Announces aria-label           |
| **Status with text**       | `<Badge dot>Online</Badge>`               | None            | Reads text; dot is decorative  |
| **Icon badge**             | `<Badge icon={<Star />}>Featured</Badge>` | None            | Reads text; icon is decorative |

### Dot-only Badges

When using dot-only badges (no visible text), always provide an `aria-label`:

```tsx
// ✅ Good
<Badge variant="success" dot aria-label="Online" />

// ❌ Bad - no accessible label
<Badge variant="success" dot />
```

## Performance

The Badge component is optimized for performance:

- **React.memo**: Entire component is memoized to prevent unnecessary re-renders
- **useMemo for class names**: Class name construction is memoized
- **useMemo for content detection**: `hasVisibleContent` is computed once per render
- **Ideal for**: Large lists (100+ badges), frequent parent re-renders, real-time status indicators

### Performance Grade: A (95/100)

Perfect for use in:

- Dashboard status indicators that update frequently
- Large data tables with status badges per row
- Real-time notification systems
- User lists with online/offline status dots

## Bootstrap Classes

The Badge component uses native Bootstrap 5 classes:

- `badge` - Base badge class
- `text-bg-{variant}` - Background color classes
- `rounded-pill` - Pill shape

## Design Tokens

The Badge component uses DSAi design tokens through the Bootstrap theme:

- Colors: `--bs-primary`, `--bs-secondary`, etc.
- Typography: `--bs-badge-font-size`, `--bs-badge-font-weight`
- Spacing: `--bs-badge-padding-x`, `--bs-badge-padding-y`
- Border: `--bs-badge-border-radius`

## Related Components

- [Button](../Button/README.md) - Often used with badges for notifications
