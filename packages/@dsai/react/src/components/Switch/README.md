# Switch

A toggle switch component for binary on/off states. Built with Bootstrap 5 styling and full accessibility support.

## Features

- 🔄 Smooth slide animation
- 📏 Three sizes (sm, md, lg)
- ⏳ Loading state with spinner
- 🏷️ Label support with position options
- 🎨 On/off icons and text
- ♿ WCAG 2.2 AA compliant

## Installation

```bash
npm install @dsai/react
```

## Usage

### Basic Switch

```tsx
import { Switch } from '@dsai/react';

function Example() {
  return <Switch label="Enable notifications" />;
}
```

### Controlled Switch

```tsx
function ControlledSwitch() {
  const [enabled, setEnabled] = useState(false);

  return <Switch label="Dark mode" checked={enabled} onChange={setEnabled} />;
}
```

### Sizes

```tsx
<Switch size="sm" label="Small" />
<Switch size="md" label="Medium (default)" />
<Switch size="lg" label="Large" />
```

### Loading State

```tsx
function SavingSwitch() {
  const [saving, setSaving] = useState(false);

  const handleChange = async (checked: boolean) => {
    setSaving(true);
    await savePreference(checked);
    setSaving(false);
  };

  return <Switch label="Auto-save" loading={saving} onChange={handleChange} />;
}
```

### Label Position

```tsx
// Label at end (default)
<Switch label="Feature" labelPosition="end" />

// Label at start
<Switch label="Feature" labelPosition="start" />
```

### On/Off Text

```tsx
<Switch label="Status" onText="ON" offText="OFF" />
```

### On/Off Icons

```tsx
<Switch label="Sound" onIcon={<VolumeUpIcon />} offIcon={<VolumeOffIcon />} />
```

### Error State

```tsx
<Switch label="Required setting" error helperText="This setting is required" />
```

### Disabled State

```tsx
<Switch label="Unavailable feature" disabled />
```

### Form Integration

```tsx
<form onSubmit={handleSubmit}>
  <Switch name="notifications" value="enabled" label="Email notifications" />
  <button type="submit">Save</button>
</form>
```

## Props

| Prop             | Type                         | Default | Description                          |
| ---------------- | ---------------------------- | ------- | ------------------------------------ |
| `checked`        | `boolean`                    | -       | Controlled checked state             |
| `defaultChecked` | `boolean`                    | `false` | Initial checked state (uncontrolled) |
| `onChange`       | `(checked: boolean) => void` | -       | Change handler                       |
| `size`           | `'sm' \| 'md' \| 'lg'`       | `'md'`  | Switch size                          |
| `label`          | `ReactNode`                  | -       | Label text                           |
| `labelPosition`  | `'start' \| 'end'`           | `'end'` | Label position                       |
| `helperText`     | `string`                     | -       | Helper or error message              |
| `disabled`       | `boolean`                    | `false` | Disabled state                       |
| `loading`        | `boolean`                    | `false` | Loading state                        |
| `error`          | `boolean`                    | `false` | Error state                          |
| `required`       | `boolean`                    | `false` | Required indicator                   |
| `onIcon`         | `ReactNode`                  | -       | Icon when on                         |
| `offIcon`        | `ReactNode`                  | -       | Icon when off                        |
| `onText`         | `string`                     | -       | Text when on                         |
| `offText`        | `string`                     | -       | Text when off                        |
| `name`           | `string`                     | -       | Form field name                      |
| `value`          | `string`                     | `'on'`  | Form field value                     |
| `id`             | `string`                     | auto    | Element ID                           |
| `className`      | `string`                     | -       | Additional classes                   |
| `style`          | `CSSProperties`              | -       | Inline styles                        |

## Keyboard Navigation

| Key     | Action        |
| ------- | ------------- |
| `Space` | Toggle switch |
| `Enter` | Toggle switch |
| `Tab`   | Move focus    |

## Accessibility

The Switch component follows WCAG 2.2 AA guidelines:

- Uses `role="switch"` for proper semantics
- `aria-checked` reflects current state
- `aria-labelledby` links to label
- `aria-describedby` links to helper text
- `aria-busy` during loading
- Keyboard accessible (Space/Enter to toggle)
- Minimum 44×44px touch target
- Focus ring visible

## Styling

The Switch uses custom styling with Bootstrap utility classes:

- Track: `bg-primary` when on, `bg-secondary` when off
- Thumb: White circle with shadow
- Smooth 150ms transition
- Focus ring via browser defaults

### CSS Variables

The component respects Bootstrap's CSS variables:

- `--bs-primary` - Track color when on
- `--bs-secondary` - Track color when off
- `--bs-danger` - Border color for error state

## Related Components

- [Checkbox](../Checkbox/README.md) - For multiple selections
- [Radio](../Radio/README.md) - For single selection from options
