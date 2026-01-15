# CardList

A container component that manages groups of SelectableCards with FSM-based selection logic. Handles single-selection (radio behavior) and multi-selection (checkbox behavior) automatically.

## Features

- Three selection modes: none, single, multiple
- FSM-based state management (predictable selection logic)
- Visual state tracking (none, one, some, all selected)
- Controlled and uncontrolled patterns
- Automatic name generation for radio groups
- Consistent styling and layout options
- WCAG 2.2 AA compliant with native inputs

## Installation

```bash
npm install @dsai/react
```

## Usage

### Single Selection (Radio Behavior)

```tsx
import { CardList, SelectableCard } from '@dsai/react';

function PlanSelector() {
  const handleChange = (values: string[]) => {
    console.log('Selected plan:', values[0]);
  };

  return (
    <CardList selectionMode="single" onChange={handleChange}>
      <SelectableCard value="basic" title="Basic" subtitle="$9/month" />
      <SelectableCard value="pro" title="Pro" subtitle="$19/month" />
      <SelectableCard value="enterprise" title="Enterprise" subtitle="$49/month" />
    </CardList>
  );
}
```

### Multiple Selection (Checkbox Behavior)

```tsx
import { CardList, SelectableCard } from '@dsai/react';
import { useState } from 'react';

function FeatureSelector() {
  const [features, setFeatures] = useState<string[]>(['notifications']);

  return (
    <CardList selectionMode="multiple" value={features} onChange={setFeatures}>
      <SelectableCard
        value="notifications"
        title="📧 Notifications"
        description="Email and push notifications"
      />
      <SelectableCard
        value="analytics"
        title="📊 Analytics"
        description="Usage and performance metrics"
      />
      <SelectableCard value="export" title="📤 Export" description="Export data to CSV/Excel" />
    </CardList>
  );
}
```

### Uncontrolled Mode

```tsx
// Uses internal state - good for simple forms
<CardList
  selectionMode="multiple"
  defaultValue={['option-1']}
  onChange={(values) => console.log('Selected:', values)}
>
  <SelectableCard value="option-1" title="Option 1" />
  <SelectableCard value="option-2" title="Option 2" />
  <SelectableCard value="option-3" title="Option 3" />
</CardList>
```

### Display-Only List (No Selection)

```tsx
<CardList selectionMode="none">
  <SelectableCard title="Feature 1" description="Description for feature 1" />
  <SelectableCard title="Feature 2" description="Description for feature 2" />
</CardList>
```

### Using Visual State

```tsx
import { CardList, SelectableCard, type CardListVisualState } from '@dsai/react';

function FeatureList() {
  const [visualState, setVisualState] = useState<CardListVisualState>('none');

  return (
    <div>
      <p>
        Status:{' '}
        {visualState === 'none'
          ? 'Select some options'
          : visualState === 'all'
            ? 'All selected!'
            : visualState === 'one'
              ? '1 selected'
              : 'Some selected'}
      </p>
      <CardList selectionMode="multiple" onVisualStateChange={setVisualState}>
        <SelectableCard value="a" title="Option A" />
        <SelectableCard value="b" title="Option B" />
        <SelectableCard value="c" title="Option C" />
      </CardList>
    </div>
  );
}
```

### Custom Layout

```tsx
<CardList selectionMode="single" className="row row-cols-1 row-cols-md-3 g-4">
  <div className="col">
    <SelectableCard value="1" title="Card 1" />
  </div>
  <div className="col">
    <SelectableCard value="2" title="Card 2" />
  </div>
  <div className="col">
    <SelectableCard value="3" title="Card 3" />
  </div>
</CardList>
```

## Props

| Prop                  | Type                                   | Default  | Description                                      |
| --------------------- | -------------------------------------- | -------- | ------------------------------------------------ |
| `selectionMode`       | `'none' \| 'single' \| 'multiple'`     | `'none'` | Selection behavior                               |
| `value`               | `string[]`                             | -        | Controlled selected values                       |
| `defaultValue`        | `string[]`                             | `[]`     | Initial values (uncontrolled)                    |
| `onChange`            | `(values: string[]) => void`           | -        | Called when selection changes                    |
| `onVisualStateChange` | `(state: CardListVisualState) => void` | -        | Called when visual state changes                 |
| `name`                | `string`                               | -        | Form field name (auto-generated for single mode) |
| `disabled`            | `boolean`                              | `false`  | Disables all cards                               |
| `children`            | `ReactNode`                            | -        | SelectableCard children                          |
| `className`           | `string`                               | -        | CSS class for container                          |

## Selection Modes

### `none` (Default)

- No selection functionality
- Cards are display-only
- `onChange` is not called

### `single`

- Only one card can be selected at a time
- Selecting a card deselects the previous one
- Uses radio input behavior internally
- `value` array will have 0 or 1 item

### `multiple`

- Any number of cards can be selected
- Clicking toggles individual cards
- Uses checkbox input behavior internally
- `value` array can have 0 to N items

## Visual States

The `onVisualStateChange` callback receives one of four states:

| State    | Description                        |
| -------- | ---------------------------------- |
| `'none'` | No items selected                  |
| `'one'`  | Exactly one item selected          |
| `'some'` | More than one but not all selected |
| `'all'`  | All items selected                 |

This is useful for "Select All" checkboxes or status indicators.

## FSM-Based State Management

CardList uses a Finite State Machine internally for predictable selection logic:

```text
States: { selected: string[] }

Actions:
- SELECT(value)    → Adds/sets value to selection
- DESELECT(value)  → Removes value from selection
- TOGGLE(value)    → Adds if missing, removes if present
- RESET            → Clears all selections

The FSM handles edge cases like:
- Deselecting the only selected item
- Selecting in single mode (auto-deselects previous)
- Toggle behavior for checkboxes
```

## Important Notes

⚠️ **Value Props Required**: Each `SelectableCard` inside a `CardList` must have a unique `value` prop.

```tsx
// ❌ Don't do this
<CardList selectionMode="single">
  <SelectableCard title="Option 1" /> {/* Missing value! */}
</CardList>

// ✅ Do this
<CardList selectionMode="single">
  <SelectableCard value="option-1" title="Option 1" />
</CardList>
```

⚠️ **Avoid Duplicate Values**: Each value should be unique within the CardList.

## Accessibility

- Uses `role="group"` with `aria-label` for screen readers
- Individual cards use native checkbox/radio inputs
- Keyboard navigation works (Tab, Space, Arrow keys)
- Visual states can be announced to screen readers

## Related Components

- **[SelectableCard](../SelectableCard/README.md)** - Individual selectable card
- **[Card](../Card/README.md)** - Base card component
- **[Checkbox](../Checkbox/README.md)** - Standalone checkbox
- **[Radio](../Radio/README.md)** - Standalone radio

## See Also

- [Storybook Examples](http://localhost:6006/?path=/docs/components-cardlist)
- [ARIA Practices - Checkbox Group](https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/)
- [ARIA Practices - Radio Group](https://www.w3.org/WAI/ARIA/apg/patterns/radio/)
