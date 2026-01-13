# Checkbox Component

A Bootstrap 5 checkbox component for form inputs with full accessibility support.

## Features

- **Controlled & Uncontrolled**: Both modes supported
- **Indeterminate State**: For parent checkboxes with partial selection
- **Switch Style**: Toggle switch appearance
- **Error States**: Validation feedback
- **Helper Text**: Additional context or error messages
- **Inline Layout**: Multiple checkboxes in a row
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
import { Checkbox } from '@dsai/react';
// Import the generated theme CSS from your local project
import './generated/dsai-theme-bs.css';

function App() {
  return <Checkbox label="Accept terms and conditions" />;
}
```

### Controlled Checkbox

```tsx
const [checked, setChecked] = useState(false);

<Checkbox
  checked={checked}
  onChange={(e) => setChecked(e.target.checked)}
  label="Subscribe to newsletter"
/>;
```

### Uncontrolled Checkbox

```tsx
<Checkbox defaultChecked label="Remember me" />
```

### Indeterminate State

Used for parent checkboxes when some children are checked:

```tsx
<Checkbox indeterminate label="Select all" />
```

### Switch Style

Toggle switch appearance:

```tsx
<Checkbox switch label="Enable notifications" />
<Checkbox switch defaultChecked label="Dark mode" />
```

### Error State

```tsx
<Checkbox error helperText="You must accept the terms" label="I agree to the terms" />
```

### Helper Text

```tsx
<Checkbox helperText="We'll never share your email" label="Subscribe to updates" />
```

### Inline Checkboxes

```tsx
<Checkbox inline label="Option 1" />
<Checkbox inline label="Option 2" />
<Checkbox inline label="Option 3" />
```

### Reverse Layout

Label on the left, checkbox on the right:

```tsx
<Checkbox reverse label="Reverse layout" />
```

### Required Field

```tsx
<Checkbox required label="I accept the terms" />
```

### Disabled State

```tsx
<Checkbox disabled label="Disabled checkbox" />
<Checkbox disabled checked onChange={() => {}} label="Disabled checked" />
```

### Without Visible Label

```tsx
<Checkbox aria-label="Select row" />
```

## Props

| Prop             | Type              | Default | Description                          |
| ---------------- | ----------------- | ------- | ------------------------------------ |
| `label`          | `ReactNode`       | -       | Checkbox label                       |
| `checked`        | `boolean`         | -       | Controlled checked state             |
| `defaultChecked` | `boolean`         | -       | Initial checked state (uncontrolled) |
| `indeterminate`  | `boolean`         | `false` | Indeterminate (partial) state        |
| `onChange`       | `(event) => void` | -       | Change handler                       |
| `disabled`       | `boolean`         | `false` | Disabled state                       |
| `error`          | `boolean`         | `false` | Error state                          |
| `helperText`     | `string`          | -       | Helper or error message              |
| `name`           | `string`          | -       | Form field name                      |
| `value`          | `string`          | -       | Form field value                     |
| `inline`         | `boolean`         | `false` | Inline display                       |
| `reverse`        | `boolean`         | `false` | Reverse label/checkbox order         |
| `switch`         | `boolean`         | `false` | Switch toggle style                  |
| `required`       | `boolean`         | `false` | Required field                       |
| `className`      | `string`          | -       | Additional CSS classes               |
| `style`          | `CSSProperties`   | -       | Inline styles                        |
| `id`             | `string`          | auto    | Input ID (auto-generated if omitted) |
| `aria-label`     | `string`          | -       | Accessible label (no visible label)  |

## Accessibility

The Checkbox component is built with accessibility in mind:

- **Native Input**: Uses `<input type="checkbox">` for full keyboard support
- **Label Association**: `<label>` properly associated via `htmlFor`
- **Error State**: `aria-invalid="true"` when error
- **Helper Text**: `aria-describedby` links to helper text
- **Keyboard**: Space key toggles checkbox
- **Touch Target**: Minimum 44×44px via Bootstrap styling

### Best Practices

Always provide a label or aria-label:

```tsx
// ✅ Good - visible label
<Checkbox label="Accept terms" />

// ✅ Good - hidden label for icon-only
<Checkbox aria-label="Select row" />

// ❌ Bad - no accessible name
<Checkbox />
```

Group related checkboxes:

```tsx
// ✅ Good - grouped with fieldset
<fieldset>
  <legend>Select your interests</legend>
  <Checkbox label="Technology" name="interests" value="tech" />
  <Checkbox label="Sports" name="interests" value="sports" />
  <Checkbox label="Music" name="interests" value="music" />
</fieldset>
```

## Security

The Checkbox component filters every forwarded prop through a strict allowlist before it reaches the
native `<input>` element. Only standard HTML and ARIA attributes make it through, which means:

- 🔐 Arbitrary event handlers (`onLoad`, `onError`, etc.) are stripped to eliminate XSS vectors when
  spreading unknown props (for example, form builder metadata).
- 🧼 Prototype pollution/object injection attempts that rely on `__proto__` style keys are ignored
  because only known-safe attribute names are evaluated.
- 🛡️ The component never calls `dangerouslySetInnerHTML`; label, helper text, and status content are
  always rendered as React nodes you control.

These hardening steps let you safely pass user-generated configuration into the checkbox without
introducing DOM clobbering or script injection risk.

## Bootstrap Classes

The Checkbox component uses native Bootstrap 5 classes:

- `form-check` - Wrapper class
- `form-check-input` - Input element
- `form-check-label` - Label element
- `form-switch` - Switch style
- `form-check-inline` - Inline layout
- `form-check-reverse` - Reverse layout
- `is-invalid` - Error state
- `invalid-feedback` - Error message
- `form-text` - Helper text

## Related Components

- [Radio](../Radio/README.md) - For single selection from options
- [Switch](../Switch/README.md) - Dedicated toggle switch component
