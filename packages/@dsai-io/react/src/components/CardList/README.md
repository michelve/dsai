# CardList

A container component that manages groups of SelectableCards with FSM-based selection logic. Uses an `items` array prop to render cards with automatic selection state management.

## Features

- Three selection modes: none, single, multiple
- FSM-based state management with visual state tracking (none/one/some/all)
- Controlled and uncontrolled patterns
- Discriminated union types for type-safe props per mode
- Responsive grid layout with Bootstrap breakpoints
- Custom card rendering via `renderItem` prop
- Error validation with helper text
- WCAG 2.2 AA compliant (fieldset/legend + native inputs)

## Installation

Add the CardList component to your project using the DSAi CLI:

```bash
dsai add card-list
```

This copies the component source files into your project and automatically resolves all dependencies.

> **First time?** Install the CLI and generate your design tokens first:
>
> ```bash
> pnpm add @dsai-io/tools
> npx dsai tokens build
> ```

## Usage

### Display Only (No Selection)

```tsx
import { CardList } from '@dsai-io/react';

<CardList
  label="Available plans"
  items={[
    { value: 'basic', title: 'Basic', description: '$9/month' },
    { value: 'pro', title: 'Pro', description: '$29/month' },
    { value: 'enterprise', title: 'Enterprise', description: 'Custom pricing' },
  ]}
/>
```

### Single Selection (Radio Behavior)

```tsx
import { CardList } from '@dsai-io/react';
import { useState } from 'react';

function PlanSelector() {
  const [selected, setSelected] = useState<string | undefined>();

  return (
    <CardList
      label="Select a plan"
      selectionMode="single"
      items={plans}
      value={selected}
      onChange={setSelected}
    />
  );
}
```

### Multiple Selection (Checkbox Behavior)

```tsx
function FeatureSelector() {
  const [features, setFeatures] = useState<string[]>([]);

  return (
    <CardList
      label="Select features"
      selectionMode="multiple"
      items={featureItems}
      value={features}
      onChange={setFeatures}
    />
  );
}
```

### Uncontrolled Mode

```tsx
<CardList
  label="Options"
  selectionMode="multiple"
  items={options}
  defaultValue={['option-1']}
  onChange={(values) => console.log('Selected:', values)}
/>
```

### Visual State Tracking

```tsx
function StatusTracker() {
  const [visualState, setVisualState] = useState('none');

  return (
    <div>
      <p>Status: {visualState}</p>
      <CardList
        label="Features"
        selectionMode="multiple"
        items={features}
        onVisualStateChange={setVisualState}
      />
    </div>
  );
}
```

### Custom Card Content

```tsx
<CardList
  label="Plans"
  selectionMode="single"
  items={plans}
  renderItem={(item, { checked }) => (
    <div className="d-flex gap-2">
      <strong>{item.title}</strong>
      {checked && <span className="badge bg-primary">Selected</span>}
    </div>
  )}
/>
```

### Size Variants

```tsx
<CardList label="Plans" items={plans} size="sm" />
<CardList label="Plans" items={plans} size="lg" />
```

### Responsive Grid Layout

```tsx
<CardList
  label="Options"
  items={options}
  columns={{ sm: 1, md: 2, lg: 3 }}
/>
```

### Error State

```tsx
<CardList
  label="Select a plan"
  selectionMode="single"
  items={plans}
  error
  errorMessage="Please select a plan"
  required
/>
```

## Props

### CardList

Props vary by `selectionMode` (discriminated union):

#### Common Props (all modes)

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `CardListItem[]` | - | Array of card items |
| `selectionMode` | `'none' \| 'single' \| 'multiple'` | `'none'` | Selection behavior |
| `label` | `string` | - | Visible legend text |
| `helperText` | `string` | - | Helper text below label |
| `error` | `boolean` | `false` | Error state |
| `errorMessage` | `string` | - | Error message |
| `required` | `boolean` | `false` | Required indicator |
| `disabled` | `boolean` | `false` | Disable all cards |
| `variant` | `CardVariant` | `'outlined'` | Card styling variant |
| `selectedColor` | `CardColor` | - | Card color when selected |
| `size` | `'sm' \| 'md' \| 'lg'` | - | Card size variant |
| `horizontal` | `boolean` | `false` | Horizontal card layout |
| `orientation` | `'horizontal' \| 'vertical'` | `'vertical'` | Layout direction |
| `gap` | `string` | `'0.5rem'` | Space between cards |
| `columns` | `number \| { sm?, md?, lg?, xl? }` | - | Grid columns |
| `onVisualStateChange` | `(state: CardListVisualState) => void` | - | Visual state callback |
| `renderItem` | `(item, state) => ReactNode` | - | Custom card content |
| `name` | `string` | - | Form field name |

> All standard HTML fieldset attributes (`aria-*`, `data-*`, `role`, etc.) are supported via rest props spreading.

#### Single Mode Props

| Prop | Type | Description |
| --- | --- | --- |
| `value` | `string` | Currently selected value |
| `defaultValue` | `string` | Initial value (uncontrolled) |
| `onChange` | `(value: string \| undefined) => void` | Selection change handler |

#### Multiple Mode Props

| Prop | Type | Description |
| --- | --- | --- |
| `value` | `string[]` | Currently selected values |
| `defaultValue` | `string[]` | Initial values (uncontrolled) |
| `onChange` | `(values: string[]) => void` | Selection change handler |

### CardListItem

| Prop | Type | Description |
| --- | --- | --- |
| `value` | `string` | Unique identifier (required) |
| `title` | `string` | Card title |
| `subtitle` | `string` | Card subtitle |
| `description` | `string` | Card description |
| `media` | `ReactNode` | Media element (image, icon) |
| `footer` | `ReactNode` | Footer content |
| `children` | `ReactNode` | Custom body content |
| `disabled` | `boolean` | Whether item is disabled |

## Visual States

The FSM tracks four visual states via `onVisualStateChange` and `data-visual-state` attribute:

| State | Description |
| --- | --- |
| `'none'` | No items selected |
| `'one'` | Exactly one item selected |
| `'some'` | More than one but not all selected |
| `'all'` | All enabled items selected |

## Accessibility

- Uses `<fieldset>` + `<legend>` for semantic form grouping
- Native `<input type="radio">` / `<input type="checkbox">` for screen readers
- `aria-invalid` for error state
- `aria-describedby` links helper text and error messages (merges with consumer-provided values)
- Required indicator (`*`) in legend
- Keyboard navigation: Tab, Space, Enter
- Dev warning when no accessible label provided

## Related Components

- [SelectableCard](../SelectableCard/README.md) - Individual selectable card
- [Card](../Card/README.md) - Base card component
- [Checkbox](../Checkbox/README.md) - Standalone checkbox
- [Radio](../Radio/README.md) - Standalone radio
