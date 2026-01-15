# Progress Component

A Bootstrap 5 progress bar component for showing progress or loading states.

## Features

- **7 variants**: primary, secondary, success, danger, warning, info, dark
- **3 sizes**: sm, md, lg
- **Determinate mode**: Shows specific progress value (0-100)
- **Indeterminate mode**: Animated loading state
- **Striped & animated**: Visual patterns
- **Stacked bars**: Multiple progress bars in one container
- **Accessible**: WCAG 2.2 AA compliant

## Installation

```bash
pnpm add @dsai/react @dsai/tools
```

Then generate your design tokens:

```bash
npx dsai tokens build
```

## Usage

### Basic Usage

```tsx
import { Progress } from '@dsai/react';
// Import the generated theme CSS from your local project
import './generated/dsai-theme-bs.css';

function App() {
  return <Progress value={75} aria-label="Task progress" />;
}
```

### With Label and Value Display

```tsx
<Progress value={50} label="Uploading files..." showValue aria-label="Upload progress" />
```

### Variants

```tsx
<Progress value={25} variant="primary" aria-label="Primary" />
<Progress value={50} variant="success" aria-label="Success" />
<Progress value={75} variant="warning" aria-label="Warning" />
<Progress value={100} variant="danger" aria-label="Danger" />
```

### Sizes

```tsx
<Progress value={50} size="sm" aria-label="Small" />
<Progress value={50} size="md" aria-label="Medium" />
<Progress value={50} size="lg" aria-label="Large" />
```

### Indeterminate (Loading)

```tsx
<Progress indeterminate aria-label="Loading..." />
```

### Striped and Animated

```tsx
<Progress value={60} striped aria-label="Striped" />
<Progress value={60} striped animated aria-label="Animated" />
```

### Custom Value Text

```tsx
<Progress value={75} showValue valueText="3 of 4 complete" aria-label="Task progress" />
```

### Stacked Progress Bars

```tsx
<Progress aria-label="Multi-part progress">
  <Progress.Bar value={15} variant="success" aria-label="Completed tasks" />
  <Progress.Bar value={30} variant="warning" aria-label="In progress tasks" />
  <Progress.Bar value={20} variant="danger" aria-label="Blocked tasks" />
</Progress>
```

### Decorative Stacked Bars

For purely decorative stacked bars where the parent provides the accessible label:

```tsx
<Progress aria-label="Project status: 65% complete">
  <Progress.Bar value={15} variant="success" aria-hidden />
  <Progress.Bar value={30} variant="warning" aria-hidden />
  <Progress.Bar value={20} variant="danger" aria-hidden />
</Progress>
```

## Props

### Progress

| Prop              | Type              | Default     | Description                     |
| ----------------- | ----------------- | ----------- | ------------------------------- |
| `value`           | `number`          | `0`         | Progress value (0-100)          |
| `variant`         | `ProgressVariant` | `'primary'` | Color variant                   |
| `size`            | `ProgressSize`    | `'md'`      | Bar height                      |
| `label`           | `string`          | -           | Label above progress bar        |
| `showValue`       | `boolean`         | `false`     | Show percentage value           |
| `valueText`       | `string`          | -           | Custom value text               |
| `indeterminate`   | `boolean`         | `false`     | Indeterminate loading mode      |
| `striped`         | `boolean`         | `false`     | Striped pattern                 |
| `animated`        | `boolean`         | `false`     | Animated stripes                |
| `min`             | `number`          | `0`         | Minimum value (aria-valuemin)¹  |
| `max`             | `number`          | `100`       | Maximum value (aria-valuemax)¹  |
| `children`        | `ReactNode`       | -           | Progress.Bar children (stacked) |
| `className`       | `string`          | -           | Additional CSS classes          |
| `style`           | `CSSProperties`   | -           | Inline styles                   |
| `id`              | `string`          | -           | ID attribute                    |
| `aria-label`      | `string`          | -           | Accessible label                |
| `aria-labelledby` | `string`          | -           | ID of labelling element         |

¹ **Note**: `min` and `max` control ARIA semantics only, not the visual range. The visual width is always calculated as a percentage (0-100). For example, `min=10, max=20, value=15` results in a 15% visual width, but `aria-valuenow=15, aria-valuemin=10, aria-valuemax=20`.

### Progress.Bar

| Prop          | Type              | Default      | Description                       |
| ------------- | ----------------- | ------------ | --------------------------------- |
| `value`       | `number`          | **required** | Progress value (0-100)            |
| `variant`     | `ProgressVariant` | `'primary'`  | Color variant                     |
| `showValue`   | `boolean`         | `false`      | Show percentage                   |
| `valueText`   | `string`          | -            | Custom value text                 |
| `striped`     | `boolean`         | `false`      | Striped pattern                   |
| `animated`    | `boolean`         | `false`      | Animated stripes                  |
| `className`   | `string`          | -            | Additional CSS classes            |
| `aria-label`  | `string`          | auto²        | Accessible label                  |
| `aria-hidden` | `boolean`         | `false`      | Mark as decorative (hide from AT) |

² If `aria-label` is not provided and `aria-hidden` is false, defaults to `"{variant} progress: {percentage}%"`.

## Accessibility

The Progress component is built with accessibility in mind:

- **ARIA Role**: `role="progressbar"` for screen readers
- **ARIA Values**:
  - `aria-valuenow`: Current progress value
  - `aria-valuemin`: Minimum value (default: 0)
  - `aria-valuemax`: Maximum value (default: 100)
  - `aria-valuetext`: Human-readable progress description
- **Indeterminate State**: `aria-busy="true"` indicates loading
- **Accessible Naming**: Supports `aria-label` and `aria-labelledby`

### Best Practices

Always provide an accessible label:

```tsx
// ✅ Good - has aria-label
<Progress value={50} aria-label="File upload progress" />

// ✅ Good - has aria-labelledby
<span id="progress-label">Upload Progress</span>
<Progress value={50} aria-labelledby="progress-label" />

// ❌ Bad - no accessible label
<Progress value={50} />
```

## Bootstrap Classes

The Progress component uses native Bootstrap 5 classes:

- `progress` - Container class
- `progress-bar` - Bar element
- `bg-{variant}` - Color variants
- `progress-bar-striped` - Striped pattern
- `progress-bar-animated` - Animated stripes

## Related Components

- [Spinner](../Spinner/README.md) - For loading indicators
