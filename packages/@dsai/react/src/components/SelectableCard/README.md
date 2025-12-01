# SelectableCard

A card component that behaves like a checkbox or radio option. Click anywhere on the card to toggle/select, not just the small control. Built on top of the Card, Checkbox, and Radio primitives.

## Features

- 🎯 Three selection modes: none, checkbox, radio
- 🖱️ Full card clickable (entire card acts as label)
- 🔄 Controlled and uncontrolled patterns
- ✅ Visual feedback for selected state (border highlight)
- 🎨 Customizable selected color
- 🚫 Disabled and error states
- ♿ WCAG 2.2 AA compliant with native inputs

## Installation

```bash
npm install @dsai/react
```

## Usage

### Basic Checkbox Card

```tsx
import { SelectableCard } from '@dsai/react';

function Example() {
  return (
    <SelectableCard
      selectionMode="checkbox"
      value="premium"
      title="Premium Plan"
      description="$29/month billed annually"
      onChange={(checked) => console.log('Selected:', checked)}
    />
  );
}
```

### Radio Cards (Single Selection)

```tsx
import { SelectableCard } from '@dsai/react';
import { useState } from 'react';

function PlanSelector() {
  const [selected, setSelected] = useState('basic');

  return (
    <div style={{ display: 'flex', gap: '1rem' }}>
      <SelectableCard
        selectionMode="radio"
        name="plan"
        value="basic"
        checked={selected === 'basic'}
        onChange={(checked) => checked && setSelected('basic')}
        title="Basic"
        subtitle="$9/month"
      />
      <SelectableCard
        selectionMode="radio"
        name="plan"
        value="premium"
        checked={selected === 'premium'}
        onChange={(checked) => checked && setSelected('premium')}
        title="Premium"
        subtitle="$29/month"
      />
    </div>
  );
}
```

### Uncontrolled Mode

```tsx
// Uses internal state, good for simple forms
<SelectableCard
  selectionMode="checkbox"
  value="terms"
  defaultChecked={false}
  title="Accept Terms"
  description="I agree to the terms and conditions"
/>
```

### With Custom Content

```tsx
<SelectableCard selectionMode="checkbox" value="feature" selectedColor="success">
  <div className="text-center">
    <span style={{ fontSize: '2rem' }}>🚀</span>
    <h6>Fast Delivery</h6>
    <p className="small text-muted">Get it in 24 hours</p>
  </div>
</SelectableCard>
```

### Display-Only Card (No Selection)

```tsx
<SelectableCard
  selectionMode="none"
  title="Info Card"
  description="This card has no selection control"
/>
```

## Props

| Prop             | Type                                  | Default      | Description                                 |
| ---------------- | ------------------------------------- | ------------ | ------------------------------------------- |
| `selectionMode`  | `'none' \| 'checkbox' \| 'radio'`     | `'none'`     | Selection behavior                          |
| `value`          | `string`                              | -            | Unique value (required for CardList)        |
| `checked`        | `boolean`                             | -            | Controlled checked state                    |
| `defaultChecked` | `boolean`                             | `false`      | Initial checked state (uncontrolled)        |
| `onChange`       | `(checked: boolean) => void`          | -            | Called when selection changes               |
| `name`           | `string`                              | -            | Form field name (required for radio groups) |
| `disabled`       | `boolean`                             | `false`      | Disables interaction                        |
| `error`          | `boolean`                             | `false`      | Shows error styling                         |
| `required`       | `boolean`                             | `false`      | Marks as required field                     |
| `variant`        | `'elevated' \| 'outlined' \| 'ghost'` | `'outlined'` | Card visual style                           |
| `selectedColor`  | `CardColor`                           | -            | Background color when selected              |
| `title`          | `ReactNode`                           | -            | Card title                                  |
| `subtitle`       | `ReactNode`                           | -            | Secondary text below title                  |
| `description`    | `ReactNode`                           | -            | Card description text                       |
| `media`          | `ReactNode`                           | -            | Image/icon at top of card                   |
| `footer`         | `ReactNode`                           | -            | Footer content                              |
| `children`       | `ReactNode`                           | -            | Custom content (replaces title/description) |
| `horizontal`     | `boolean`                             | `false`      | Horizontal layout with media on side        |
| `aria-label`     | `string`                              | -            | Accessible label for screen readers         |

## Selection Modes

### `none` (Default)

- Renders a standard display card
- No checkbox or radio control
- Not interactive for selection

### `checkbox`

- Multi-selection (can select multiple cards)
- Click toggles the checkbox on/off
- Works independently of other cards

### `radio`

- Single-selection (one card in a group)
- Requires `name` prop for grouping
- Selecting one deselects others in the same group

## Accessibility

- Uses native `<input type="checkbox">` or `<input type="radio">`
- Card wrapped in `<label>` for full-card clickability
- Keyboard accessible (Tab to focus, Space/Enter to select)
- Arrow keys work for radio groups
- Supports `aria-label`, `aria-labelledby`, `aria-describedby`
- Shows development warnings for missing accessible names

## Important Notes

⚠️ **Nested Interactive Elements**: When `selectionMode` is "checkbox" or "radio", the entire card is wrapped in a `<label>` element. Avoid placing buttons, links, or other interactive elements inside the card content, as this creates invalid HTML and may cause accessibility issues.

```tsx
// ❌ Don't do this
<SelectableCard selectionMode="checkbox">
  <button>Click me</button> {/* Invalid - button inside label */}
</SelectableCard>

// ✅ Do this instead
<SelectableCard selectionMode="none">
  <button>Click me</button> {/* OK - no label wrapper */}
</SelectableCard>
```

## Related Components

- **[Card](../Card/README.md)** - Base card component
- **[CardList](../CardList/README.md)** - Manages groups of SelectableCards with FSM-based selection
- **[Checkbox](../Checkbox/README.md)** - Standalone checkbox component
- **[Radio](../Radio/README.md)** - Standalone radio component

## See Also

- [Bootstrap Cards](https://getbootstrap.com/docs/5.3/components/card/)
- [Storybook Examples](http://localhost:6006/?path=/docs/components-selectablecard)
