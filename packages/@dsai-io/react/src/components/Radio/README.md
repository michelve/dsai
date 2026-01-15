# Radio Component

Bootstrap 5 radio button components for single-selection inputs.

## Components

- **Radio**: Individual radio button
- **RadioGroup**: Container for managing radio button groups

## Features

- **Controlled & Uncontrolled**: Both modes supported
- **Error States**: Validation feedback with helper text
- **Inline Layout**: Horizontal radio arrangement
- **Keyboard Navigation**: Arrow keys to navigate options
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

### Basic RadioGroup (Recommended)

```tsx
import { Radio, RadioGroup } from '@dsai/react';
// Import the generated theme CSS from your local project
import './generated/dsai-theme-bs.css';

function App() {
  const [size, setSize] = useState('md');

  return (
    <RadioGroup
      name="size"
      label="Select size"
      value={size}
      onChange={(e) => setSize(e.target.value)}
    >
      <Radio value="sm" label="Small" />
      <Radio value="md" label="Medium" />
      <Radio value="lg" label="Large" />
    </RadioGroup>
  );
}
```

### Uncontrolled RadioGroup

```tsx
<RadioGroup name="color" defaultValue="blue" label="Favorite color">
  <Radio value="red" label="Red" />
  <Radio value="blue" label="Blue" />
  <Radio value="green" label="Green" />
</RadioGroup>
```

### Inline Layout

```tsx
<RadioGroup name="align" inline label="Alignment">
  <Radio value="left" label="Left" />
  <Radio value="center" label="Center" />
  <Radio value="right" label="Right" />
</RadioGroup>
```

### With Error State

```tsx
<RadioGroup name="terms" error helperText="Please select an option" label="Do you agree?">
  <Radio value="yes" label="Yes, I agree" />
  <Radio value="no" label="No, I disagree" />
</RadioGroup>
```

### Disabled State

```tsx
// Disable entire group
<RadioGroup name="disabled" disabled label="Disabled group">
  <Radio value="1" label="Option 1" />
  <Radio value="2" label="Option 2" />
</RadioGroup>

// Disable individual option
<RadioGroup name="partial" label="Partial disable">
  <Radio value="1" label="Available" />
  <Radio value="2" label="Unavailable" disabled />
</RadioGroup>
```

### Standalone Radio (Advanced)

```tsx
// Only use standalone radios when you need custom behavior
<Radio
  value="standalone"
  name="standalone"
  label="Standalone radio"
  checked={checked}
  onChange={(e) => setChecked(e.target.checked)}
/>
```

## Props

### Radio

| Prop         | Type              | Default | Description                         |
| ------------ | ----------------- | ------- | ----------------------------------- |
| `value`      | `string`          | **req** | Radio value                         |
| `label`      | `ReactNode`       | -       | Radio label                         |
| `checked`    | `boolean`         | -       | Checked state                       |
| `onChange`   | `(event) => void` | -       | Change handler                      |
| `disabled`   | `boolean`         | `false` | Disabled state                      |
| `error`      | `boolean`         | `false` | Error state                         |
| `name`       | `string`          | -       | Form field name                     |
| `inline`     | `boolean`         | `false` | Inline display                      |
| `reverse`    | `boolean`         | `false` | Reverse label/radio order           |
| `required`   | `boolean`         | `false` | Required field                      |
| `className`  | `string`          | -       | Additional CSS classes              |
| `style`      | `CSSProperties`   | -       | Inline styles                       |
| `id`         | `string`          | auto    | Input ID                            |
| `aria-label` | `string`          | -       | Accessible label (no visible label) |

### RadioGroup

| Prop           | Type              | Default | Description                  |
| -------------- | ----------------- | ------- | ---------------------------- |
| `children`     | `ReactNode`       | **req** | Radio components             |
| `name`         | `string`          | **req** | Shared form field name       |
| `value`        | `string`          | -       | Controlled value             |
| `defaultValue` | `string`          | -       | Initial value (uncontrolled) |
| `onChange`     | `(event) => void` | -       | Change handler               |
| `label`        | `ReactNode`       | -       | Group label                  |
| `disabled`     | `boolean`         | `false` | Disable all radios           |
| `error`        | `boolean`         | `false` | Error state                  |
| `helperText`   | `string`          | -       | Helper or error message      |
| `inline`       | `boolean`         | `false` | Inline layout                |
| `required`     | `boolean`         | `false` | Required field               |
| `className`    | `string`          | -       | Additional CSS classes       |
| `style`        | `CSSProperties`   | -       | Inline styles                |
| `id`           | `string`          | auto    | Group ID                     |

## Accessibility

The Radio components are built with accessibility in mind:

### Radio

- **Native Input**: Uses `<input type="radio">` for full keyboard support
- **Label Association**: `<label>` properly associated via `htmlFor`
- **Touch Target**: Minimum 44×44px via Bootstrap styling

### RadioGroup

- **ARIA Role**: `role="radiogroup"` for screen readers
- **Group Label**: `aria-labelledby` links to legend
- **Helper Text**: `aria-describedby` links to helper text
- **Error State**: `aria-invalid` when error
- **Required**: `aria-required` when required
- **Keyboard**: Arrow keys navigate between options

### Best Practices

Always use RadioGroup for related radios:

```tsx
// ✅ Good - RadioGroup manages state and accessibility
<RadioGroup name="options" label="Select option">
  <Radio value="1" label="Option 1" />
  <Radio value="2" label="Option 2" />
</RadioGroup>

// ❌ Bad - standalone radios without group
<Radio name="options" value="1" label="Option 1" />
<Radio name="options" value="2" label="Option 2" />
```

## Bootstrap Classes

The components use native Bootstrap 5 classes:

- `form-check` - Wrapper class
- `form-check-input` - Input element
- `form-check-label` - Label element
- `form-check-inline` - Inline layout
- `form-check-reverse` - Reverse layout
- `is-invalid` - Error state
- `invalid-feedback` - Error message
- `form-text` - Helper text
- `form-label` - Group label (legend)

## Related Components

- [Checkbox](../Checkbox/README.md) - For multiple selections
- [Switch](../Switch/README.md) - For on/off toggles
