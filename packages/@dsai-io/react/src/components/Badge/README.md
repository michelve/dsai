# Badge Component

A Bootstrap 5 badge component for displaying labels, status indicators, and counts.

## Features

- **8 color variants**: primary, secondary, success, danger, warning, info, light, dark
- **3 sizes**: sm, md, lg
- **3 appearances**: solid (filled), outline (bordered), subtle (tinted)
- **Pill shape**: Fully rounded badges with `pill` prop
- **Dot indicator**: Status dot with `dot` prop
- **Icon support**: Add icons before or after badge text (`iconPosition`)
- **Dismissible**: Close button with `onDismiss` callback
- **Max count**: Auto-truncate numeric values (`max={99}` → "99+")
- **Visibility control**: `invisible` and `showZero` props
- **Badge.Wrapper**: Overlay a badge on another element with placement control
- **Animation**: Mount and content-change animations
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
import './generated/dsai-theme-bs.css';

function App() {
  return <Badge variant="primary">New</Badge>;
}
```

### Sizes

```tsx
<Badge size="sm">Small</Badge>
<Badge size="md">Medium</Badge>
<Badge size="lg">Large</Badge>
```

### Appearances

```tsx
<Badge variant="success" appearance="solid">Solid</Badge>
<Badge variant="success" appearance="outline">Outline</Badge>
<Badge variant="success" appearance="subtle">Subtle</Badge>
```

### Pill Badges

```tsx
<Badge variant="primary" pill>Pill Badge</Badge>
```

### Dot Indicator

```tsx
// Dot with text
<Badge variant="success" dot>Online</Badge>

// Dot only (status indicator — requires aria-label)
<Badge variant="success" dot aria-label="Online status" />
```

### With Icon

```tsx
<Badge variant="primary" icon={<StarIcon />}>Featured</Badge>
<Badge variant="success" icon={<CheckIcon />} iconPosition="end">Done</Badge>
```

### Dismissible (Tags / Chips)

```tsx
<Badge variant="primary" pill onDismiss={() => removeTag(id)}>
  React
</Badge>

<Badge variant="info" onDismiss={handleRemove} dismissLabel="Delete tag">
  TypeScript
</Badge>
```

### Max Count

```tsx
<Badge variant="danger" max={99}>{150}</Badge>   {/* renders "99+" */}
<Badge variant="danger" max={99}>{50}</Badge>    {/* renders "50" */}
```

### Visibility Control

```tsx
<Badge invisible={count === 0}>{count}</Badge>
<Badge showZero={false}>{0}</Badge>  {/* renders nothing */}
```

### Badge.Wrapper (Overlay)

```tsx
import { Badge, Button } from '@dsai-io/react';

<Badge.Wrapper>
  <Button variant="primary">Inbox</Button>
  <Badge variant="danger" pill>4</Badge>
</Badge.Wrapper>

<Badge.Wrapper placement="bottom-start" overlap="circular">
  <Avatar name="John" />
  <Badge variant="success" dot aria-label="Online" />
</Badge.Wrapper>
```

### Animation

```tsx
<Badge variant="danger" pill animated>{count}</Badge>
```

## Props

### Badge

| Prop           | Type                            | Default     | Description                          |
| -------------- | ------------------------------- | ----------- | ------------------------------------ |
| `children`     | `ReactNode`                     | -           | Badge content                        |
| `variant`      | `BadgeVariant`                  | `'primary'` | Color variant                        |
| `size`         | `'sm' \| 'md' \| 'lg'`         | `'md'`      | Badge size                           |
| `appearance`   | `'solid' \| 'outline' \| 'subtle'` | `'solid'` | Visual style treatment             |
| `pill`         | `boolean`                       | `false`     | Pill shape (fully rounded)           |
| `dot`          | `boolean`                       | `false`     | Show dot indicator                   |
| `icon`         | `ReactNode`                     | -           | Icon element                         |
| `iconPosition` | `'start' \| 'end'`             | `'start'`   | Icon position relative to text       |
| `onDismiss`    | `() => void`                    | -           | Callback for dismiss button          |
| `dismissLabel` | `string`                        | `'Remove'`  | Accessible label for dismiss button  |
| `max`          | `number`                        | -           | Maximum numeric value ("N+")         |
| `invisible`    | `boolean`                       | `false`     | Hide visually, keep in DOM           |
| `showZero`     | `boolean`                       | `true`      | Whether to display when children is 0 |
| `animated`     | `boolean`                       | `false`     | Enable animations                    |
| `as`           | `'span' \| 'div'`              | `'span'`    | Element to render as                 |
| `className`    | `string`                        | -           | Additional CSS classes               |
| `style`        | `CSSProperties`                 | -           | Inline styles                        |
| `aria-label`   | `string`                        | -           | Accessible label                     |
| `id`           | `string`                        | -           | ID attribute                         |

### Badge.Wrapper

| Prop        | Type                                                          | Default          | Description                    |
| ----------- | ------------------------------------------------------------- | ---------------- | ------------------------------ |
| `children`  | `ReactNode`                                                   | -                | Anchor element + badge         |
| `placement` | `'top-end' \| 'top-start' \| 'bottom-end' \| 'bottom-start'` | `'top-end'`      | Badge position                 |
| `overlap`   | `'rectangular' \| 'circular'`                                 | `'rectangular'`  | Anchor shape for offset calc   |
| `className` | `string`                                                      | -                | Additional CSS classes         |
| `style`     | `CSSProperties`                                               | -                | Inline styles                  |

## Accessibility

The Badge component is built with accessibility in mind:

- **Semantic HTML**: Uses `<span>` by default
- **ARIA support**: Accepts `aria-label` for screen readers
- **Status role**: Dot-only badges have `role="status"` for screen reader announcement
- **Color contrast**: Meets WCAG 2.2 AA contrast requirements via Bootstrap theme
- **Dismiss button**: Fully keyboard accessible with custom label support

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

// ❌ Bad - shows dev warning
<Badge variant="success" dot />
```

## Performance

The Badge component is optimized for performance:

- **React.memo**: Entire component is memoized to prevent unnecessary re-renders
- **useMemo for class names**: Class name construction is memoized
- **useMemo for content detection**: `hasVisibleContent` is computed once per render
- **Ideal for**: Large lists (100+ badges), frequent parent re-renders, real-time status indicators

## Bootstrap Classes

The Badge component uses native Bootstrap 5 classes:

- `badge` - Base badge class
- `text-bg-{variant}` - Solid background color
- `border border-{variant} text-{variant} bg-transparent` - Outline appearance
- `bg-{variant}-subtle text-{variant}-emphasis` - Subtle appearance
- `rounded-pill` - Pill shape

## Design Tokens

The Badge component uses DSAi design tokens through the Bootstrap theme:

- Colors: `--bs-primary`, `--bs-secondary`, etc.
- Typography: `--bs-badge-font-size`, `--bs-badge-font-weight`
- Spacing: `--bs-badge-padding-x`, `--bs-badge-padding-y`
- Border: `--bs-badge-border-radius`

## Related Components

- [Button](../Button/README.md) - Often used with badges for notifications
- [Avatar](../Avatar/README.md) - Badge.Wrapper can overlay badges on avatars
