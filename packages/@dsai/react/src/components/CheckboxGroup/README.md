# CheckboxGroup Component

A high-level component managing multiple checkboxes with tri-state selection, optional select-all functionality, and full accessibility via fieldset/legend.

## Features

- **FSM-Powered**: Finite State Machine for predictable state management
- **Tri-State Selection**: Derives `none`, `some`, or `all` from selections
- **Select All**: Optional master checkbox with indeterminate support
- **Controlled & Uncontrolled**: Both modes supported
- **Disabled Options**: Per-option or group-level disabling
- **Error States**: Validation feedback with messages
- **Accessible**: WCAG 2.2 AA compliant with fieldset/legend

## Installation

```bash
pnpm add @dsai/react @dsai/tokens
```

## Usage

### Basic Usage

```tsx
import { CheckboxGroup } from '@dsai/react';
import '@dsai/tokens/css/bootstrap.css';

const options = [
  { value: 'email', label: 'Email notifications' },
  { value: 'sms', label: 'SMS notifications' },
  { value: 'push', label: 'Push notifications' },
];

function App() {
  return <CheckboxGroup label="Notification Preferences" options={options} />;
}
```

### With Default Values (Uncontrolled)

```tsx
<CheckboxGroup
  label="Notification Preferences"
  options={options}
  defaultValue={['email', 'push']}
/>
```

### Controlled Mode

```tsx
const [selected, setSelected] = useState<string[]>(['email']);

<CheckboxGroup
  label="Notification Preferences"
  options={options}
  value={selected}
  onChange={setSelected}
/>;
```

### With Select All

```tsx
<CheckboxGroup
  label="Your Interests"
  options={interests}
  showSelectAll
  selectAllLabel="Check all interests"
/>
```

### With Disabled Options

```tsx
const options = [
  { value: 'read', label: 'Read' },
  { value: 'write', label: 'Write' },
  { value: 'delete', label: 'Delete', disabled: true },
];

<CheckboxGroup
  label="Permissions"
  options={options}
  showSelectAll // Select all will skip disabled items
/>;
```

### Error State

```tsx
<CheckboxGroup
  label="Required Selection"
  options={options}
  error
  errorMessage="Please select at least one option"
/>
```

### With Helper Text

```tsx
<CheckboxGroup
  label="Notification Preferences"
  options={options}
  helperText="Choose how you want to receive updates"
/>
```

### Horizontal Layout

```tsx
<CheckboxGroup label="Quick Filters" options={filterOptions} orientation="horizontal" />
```

## FSM State Machine

The CheckboxGroup uses a Finite State Machine (FSM) to manage selection state:

```
┌─────────┐     TOGGLE_ITEM      ┌─────────┐     TOGGLE_ITEM      ┌─────────┐
│  none   │ ─────────────────→   │  some   │ ─────────────────→   │   all   │
│         │     (select 1)       │         │     (select all)     │         │
└─────────┘                      └─────────┘                      └─────────┘
     ↑                                ↑                                │
     │         TOGGLE_ALL             │          TOGGLE_ALL            │
     │         (clear all)            │          (select all)          │
     │                                │                                │
     └────────────────────────────────┴────────────────────────────────┘
                                      │
                                      │ RESET_FROM_PROPS
                                      ↓
                              (sync with controlled value)
```

### States

| State  | Description                    | Select All Checkbox |
| ------ | ------------------------------ | ------------------- |
| `none` | No items selected              | Unchecked           |
| `some` | Some items selected (1 to n-1) | Indeterminate       |
| `all`  | All enabled items selected     | Checked             |

### Events

| Event              | Description                             |
| ------------------ | --------------------------------------- |
| `TOGGLE_ITEM`      | Toggle a single item's selection        |
| `TOGGLE_ALL`       | Toggle all enabled items                |
| `RESET_FROM_PROPS` | Sync state with controlled `value` prop |

## Props

| Prop               | Type                         | Default        | Description                              |
| ------------------ | ---------------------------- | -------------- | ---------------------------------------- |
| `label`            | `ReactNode`                  | -              | Group label (rendered as legend)         |
| `options`          | `CheckboxGroupOption[]`      | **required**   | Array of checkbox options                |
| `value`            | `string[]`                   | -              | Controlled selected values               |
| `defaultValue`     | `string[]`                   | `[]`           | Initial values (uncontrolled)            |
| `onChange`         | `(values: string[]) => void` | -              | Called when selection changes            |
| `name`             | `string`                     | -              | Shared name for all checkboxes           |
| `showSelectAll`    | `boolean`                    | `false`        | Show select all checkbox                 |
| `selectAllLabel`   | `ReactNode`                  | `"Select all"` | Label for select all checkbox            |
| `required`         | `boolean`                    | `false`        | Required field                           |
| `disabled`         | `boolean`                    | `false`        | Disable all checkboxes                   |
| `error`            | `boolean`                    | `false`        | Error state                              |
| `errorMessage`     | `ReactNode`                  | -              | Error message                            |
| `helperText`       | `ReactNode`                  | -              | Helper text                              |
| `orientation`      | `'vertical' \| 'horizontal'` | `'vertical'`   | Layout direction                         |
| `className`        | `string`                     | -              | Additional CSS classes                   |
| `style`            | `CSSProperties`              | -              | Inline styles                            |
| `id`               | `string`                     | auto           | ID for the fieldset/group                |
| `aria-label`       | `string`                     | -              | Accessible label (when no visible label) |
| `aria-labelledby`  | `string`                     | -              | ID of labeling element                   |
| `aria-describedby` | `string`                     | -              | ID of describing element                 |

### CheckboxGroupOption

```typescript
interface CheckboxGroupOption {
  value: string; // Unique value for the option
  label: ReactNode; // Label displayed next to checkbox
  disabled?: boolean; // Whether this option is disabled
  helperText?: ReactNode; // Helper text for this option
}
```

## Accessibility

The CheckboxGroup component is built with accessibility in mind:

### Semantic Structure

```html
<fieldset aria-describedby="helper-id" aria-required="true">
  <legend>Notification Preferences</legend>
  <div id="helper-id">Choose your preferences</div>
  <div data-visual-state="some">
    <input type="checkbox" /> Select all <input type="checkbox" /> Email
    <input type="checkbox" /> SMS <input type="checkbox" /> Push
  </div>
</fieldset>
```

### Features

- **Fieldset/Legend**: Semantic grouping for screen readers
- **aria-describedby**: Links to helper/error text
- **aria-required**: Indicates required groups
- **aria-invalid**: Indicates error state
- **aria-checked="mixed"**: On select all when indeterminate
- **data-visual-state**: FSM state exposed for testing/styling

### Best Practices

Always provide a group label:

```tsx
// ✅ Good - visible label
<CheckboxGroup label="Preferences" options={options} />

// ✅ Good - aria-label for hidden label
<CheckboxGroup aria-label="Preferences" options={options} />

// ❌ Bad - no accessible name (dev warning)
<CheckboxGroup options={options} />
```

## Development Warnings

In development mode, the component warns when:

- No `label` or `aria-label` is provided
- Warning appears once per component instance
- Warnings are stripped in production builds

```
[DSAi CheckboxGroup] Missing accessible label. Provide either a "label" prop
or an "aria-label" attribute for screen reader users.
```

## Bootstrap Classes

The component uses Bootstrap 5 classes:

- `form-check` - Wrapper for each checkbox
- `form-check-input` - Checkbox input
- `form-check-label` - Checkbox label
- `is-invalid` - Error state
- `invalid-feedback` - Error message
- `form-text` - Helper text
- `d-flex` / `flex-column` / `gap-*` - Layout utilities

## Related Components

- [Checkbox](../Checkbox/README.md) - Individual checkbox component
- [RadioGroup](../Radio/README.md) - For single selection from options
- [Select](../Select/README.md) - Dropdown selection

## Type Exports

```tsx
import {
  CheckboxGroup,
  type CheckboxGroupProps,
  type CheckboxGroupOption,
  type GroupSelectionState, // 'none' | 'some' | 'all'
  type CheckboxGroupFSMState, // Full FSM state type
} from '@dsai/react';
```
