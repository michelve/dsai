# Progress Component

A Bootstrap 5 progress bar component for showing progress or loading states.

## Features

- **7 variants**: primary, secondary, success, danger, warning, info, dark
- **3 sizes**: sm, md, lg
- **Determinate mode**: Shows specific progress value (0-100)
- **Indeterminate mode**: Animated loading state
- **Striped & animated**: Visual patterns
- **Stacked bars**: Multiple progress bars in one container
- **Circular progress**: SVG-based ring indicator (`Progress.Circle`)
- **Buffer mode**: Secondary lighter bar for buffering/two-stage progress
- **Steps/segments**: Discrete segment display (Ant Design-style)
- **Gradient fills**: Linear gradient support for bars and circles
- **Custom value formatter**: Function prop for flexible value display
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
import { Progress } from '@dsai-io/react';
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

### Custom Value Formatter

Use `formatValue` for flexible value display (similar to Ant Design's `format` prop):

```tsx
// Show items count
<Progress value={3} max={10} formatValue={(v, max) => `${v}/${max} items`} showValue aria-label="Items" />

// Show custom JSX content
<Progress value={75} formatValue={(v) => `${v}% done`} showValue aria-label="Progress" />
```

### Buffer Mode

Show a secondary lighter bar behind the main bar (similar to MUI's buffer variant):

```tsx
<Progress value={30} bufferValue={60} aria-label="Video buffering" />
```

### Steps / Segments

Render discrete segments instead of a continuous bar (similar to Ant Design's `steps` prop):

```tsx
<Progress value={60} steps={5} aria-label="Onboarding" />
<Progress value={80} steps={10} variant="success" aria-label="Steps progress" />
```

### Gradient Fill

Apply a linear gradient to the progress bar:

```tsx
<Progress value={75} gradient={{ from: 'var(--bs-primary)', to: 'var(--bs-success)' }} aria-label="Gradient progress" />
```

### Circular Progress

SVG-based ring progress indicator (similar to MUI's CircularProgress and Ant Design's `type="circle"`):

```tsx
<Progress.Circle value={75} aria-label="Circular progress" />
<Progress.Circle value={75} size={120} showValue aria-label="Large circle" />
<Progress.Circle indeterminate variant="info" aria-label="Loading" />
<Progress.Circle value={80} gradient={{ from: 'var(--bs-primary)', to: 'var(--bs-success)' }} showValue aria-label="Gradient circle" />
```

## Props

### Progress

| Prop              | Type                                    | Default     | Description                        |
| ----------------- | --------------------------------------- | ----------- | ---------------------------------- |
| `value`           | `number`                                | `0`         | Progress value (0-100)             |
| `variant`         | `ProgressVariant`                       | `'primary'` | Color variant                      |
| `size`            | `ProgressSize`                          | `'md'`      | Bar height                         |
| `label`           | `string`                                | -           | Label above progress bar           |
| `showValue`       | `boolean`                               | `false`     | Show percentage value              |
| `valueText`       | `string`                                | -           | Custom value text                  |
| `formatValue`     | `(value: number, max: number) => ReactNode` | -       | Custom value formatter function    |
| `bufferValue`     | `number`                                | -           | Buffer bar value (0-100)           |
| `steps`           | `number`                                | -           | Number of discrete segments        |
| `gradient`        | `ProgressGradient`                      | -           | Gradient fill `{ from, to }`       |
| `indeterminate`   | `boolean`                               | `false`     | Indeterminate loading mode         |
| `striped`         | `boolean`                               | `false`     | Striped pattern                    |
| `animated`        | `boolean`                               | `false`     | Animated stripes                   |
| `min`             | `number`                                | `0`         | Minimum value (aria-valuemin)¹     |
| `max`             | `number`                                | `100`       | Maximum value (aria-valuemax)¹     |
| `children`        | `ReactNode`                             | -           | Progress.Bar children (stacked)    |
| `className`       | `string`                                | -           | Additional CSS classes             |
| `style`           | `CSSProperties`                         | -           | Inline styles                      |
| `id`              | `string`                                | -           | ID attribute                       |
| `aria-label`      | `string`                                | -           | Accessible label                   |
| `aria-labelledby` | `string`                                | -           | ID of labelling element            |

¹ **Note**: `min` and `max` control ARIA semantics only, not the visual range. The visual width is always calculated as a percentage (0-100). For example, `min=10, max=20, value=15` results in a 15% visual width, but `aria-valuenow=15, aria-valuemin=10, aria-valuemax=20`.

### Progress.Bar

| Prop          | Type                                    | Default      | Description                       |
| ------------- | --------------------------------------- | ------------ | --------------------------------- |
| `value`       | `number`                                | **required** | Progress value (0-100)            |
| `variant`     | `ProgressVariant`                       | `'primary'`  | Color variant                     |
| `showValue`   | `boolean`                               | `false`      | Show percentage                   |
| `valueText`   | `string`                                | -            | Custom value text                 |
| `formatValue` | `(value: number, max: number) => ReactNode` | -        | Custom value formatter            |
| `gradient`    | `ProgressGradient`                      | -            | Gradient fill `{ from, to }`      |
| `striped`     | `boolean`                               | `false`      | Striped pattern                   |
| `animated`    | `boolean`                               | `false`      | Animated stripes                  |
| `className`   | `string`                                | -            | Additional CSS classes            |
| `aria-label`  | `string`                                | auto²        | Accessible label                  |
| `aria-hidden` | `boolean`                               | `false`      | Mark as decorative (hide from AT) |

² If `aria-label` is not provided and `aria-hidden` is false, defaults to `"{variant} progress: {percentage}%"`.

### Progress.Circle

| Prop            | Type                                    | Default     | Description                    |
| --------------- | --------------------------------------- | ----------- | ------------------------------ |
| `value`         | `number`                                | `0`         | Progress value (0-100)         |
| `variant`       | `ProgressVariant`                       | `'primary'` | Color variant                  |
| `size`          | `number`                                | `80`        | Circle diameter in pixels      |
| `strokeWidth`   | `number`                                | `6`         | Stroke width in pixels         |
| `showValue`     | `boolean`                               | `false`     | Show value in center           |
| `valueText`     | `string`                                | -           | Custom value text              |
| `formatValue`   | `(value: number, max: number) => ReactNode` | -       | Custom value formatter         |
| `gradient`      | `ProgressGradient`                      | -           | Gradient stroke `{ from, to }` |
| `indeterminate` | `boolean`                               | `false`     | Spinning loading mode          |
| `min`           | `number`                                | `0`         | Minimum value (aria-valuemin)  |
| `max`           | `number`                                | `100`       | Maximum value (aria-valuemax)  |
| `className`     | `string`                                | -           | Additional CSS classes         |
| `style`         | `CSSProperties`                         | -           | Inline styles                  |
| `id`            | `string`                                | -           | ID attribute                   |
| `aria-label`    | `string`                                | -           | Accessible label               |

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
