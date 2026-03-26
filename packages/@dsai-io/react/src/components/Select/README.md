# Select

A flexible dropdown select component built with Bootstrap 5 classes. Supports single/multiple selection, search, custom rendering, and full keyboard navigation.

## Features

- 🔽 Single and multiple selection modes
- 🔍 Searchable/filterable options
- 📁 Option groups
- 🎨 Custom option rendering
- ⌨️ Full keyboard navigation
- ♿ WCAG 2.2 AA compliant
- 📱 Native select fallback for forms

## Installation

```bash
npm install @dsai-io/react
```

## Usage

### Basic Select

```tsx
import { Select } from '@dsai-io/react';

const options = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
];

function Example() {
  return <Select label="Fruit" options={options} onChange={(value) => console.log(value)} />;
}
```

### Controlled Select

```tsx
function ControlledSelect() {
  const [value, setValue] = useState<string>();

  return <Select label="Country" options={countries} value={value} onChange={setValue} />;
}
```

### Multiple Selection

```tsx
function MultiSelect() {
  const [selected, setSelected] = useState<string[]>([]);

  return (
    <Select label="Skills" multiple options={skills} value={selected} onChange={setSelected} />
  );
}
```

### Searchable Select

```tsx
<Select label="Search countries" searchable options={countries} placeholder="Type to search..." />
```

### Grouped Options

```tsx
const groupedOptions = [
  {
    label: 'Fruits',
    options: [
      { value: 'apple', label: 'Apple' },
      { value: 'banana', label: 'Banana' },
    ],
  },
  {
    label: 'Vegetables',
    options: [
      { value: 'carrot', label: 'Carrot' },
      { value: 'broccoli', label: 'Broccoli' },
    ],
  },
];

<Select label="Food" options={groupedOptions} />;
```

### Disabled Options

```tsx
const options = [
  { value: 'available', label: 'Available' },
  { value: 'unavailable', label: 'Unavailable', disabled: true },
];

<Select label="Status" options={options} />;
```

### Validation States

```tsx
// Error state
<Select
  label="Required Field"
  options={options}
  error
  helperText="Please select an option"
/>

// Success state
<Select
  label="Validated"
  options={options}
  success
  value="valid"
/>
```

### Clearable

```tsx
<Select label="Optional Field" options={options} clearable onClear={() => console.log('Cleared')} />
```

### Large Option Lists

```tsx
// Limit rendered options for performance (default: 100)
<Select
  label="Search items"
  options={largeOptionArray}
  searchable
  limit={50}
  limitMessage="Keep typing to narrow results"
/>
```

### Custom Rendering

```tsx
// Custom option rendering
<Select
  label="Users"
  options={users}
  renderOption={(option, isSelected) => (
    <div className="d-flex align-items-center gap-2">
      <img src={option.data?.avatar} alt="" width={24} height={24} />
      <span>{option.label}</span>
      {isSelected && <CheckIcon />}
    </div>
  )}
/>

// Custom value display
<Select
  label="Color"
  options={colors}
  renderValue={(selected) => (
    <div className="d-flex align-items-center gap-2">
      <span
        style={{
          width: 16,
          height: 16,
          backgroundColor: selected.value,
          borderRadius: '50%',
        }}
      />
      {selected.label}
    </div>
  )}
/>
```

### Sizes

```tsx
<Select size="sm" label="Small" options={options} />
<Select size="md" label="Medium" options={options} />
<Select size="lg" label="Large" options={options} />
```

## Props

| Prop                | Type                                     | Default        | Description                  |
| ------------------- | ---------------------------------------- | -------------- | ---------------------------- |
| `options`           | `SelectOption[] \| SelectOptionGroup[]`  | Required       | Options to display           |
| `value`             | `T \| T[]`                               | -              | Controlled value             |
| `defaultValue`      | `T \| T[]`                               | -              | Initial value (uncontrolled) |
| `onChange`          | `(value: T \| T[] \| undefined) => void` | -              | Change handler               |
| `multiple`          | `boolean`                                | `false`        | Enable multiple selection    |
| `searchable`        | `boolean`                                | `false`        | Enable search/filter         |
| `filterOption`      | `(option, searchValue) => boolean`       | -              | Custom filter function       |
| `size`              | `'sm' \| 'md' \| 'lg'`                   | `'md'`         | Select size                  |
| `label`             | `ReactNode`                              | -              | Label text                   |
| `placeholder`       | `string`                                 | `'Select...'`  | Placeholder text             |
| `helperText`        | `string`                                 | -              | Helper or error message      |
| `error`             | `boolean`                                | `false`        | Error state                  |
| `success`           | `boolean`                                | `false`        | Success state                |
| `disabled`          | `boolean`                                | `false`        | Disabled state               |
| `required`          | `boolean`                                | `false`        | Required field               |
| `loading`           | `boolean`                                | `false`        | Loading state                |
| `clearable`         | `boolean`                                | `false`        | Show clear button            |
| `onClear`           | `() => void`                             | -              | Clear callback               |
| `renderOption`      | `(option, isSelected) => ReactNode`      | -              | Custom option renderer       |
| `renderValue`       | `(selected) => ReactNode`                | -              | Custom value renderer        |
| `name`              | `string`                                 | -              | Form field name              |
| `maxDropdownHeight` | `number`                                 | `300`          | Max dropdown height (px)     |
| `noOptionsMessage`  | `string`                                 | `'No options'` | Empty state text             |
| `loadingMessage`    | `string`                                 | `'Loading...'` | Loading state text           |
| `limit`             | `number`                                 | `100`          | Max rendered options         |
| `limitMessage`      | `string`                                 | `'Type to search for more options'` | Truncation message |

### SelectOption Type

```typescript
interface SelectOption<T = string> {
  value: T;
  label: string;
  disabled?: boolean;
  group?: string;
  data?: Record<string, unknown>;
}
```

### SelectOptionGroup Type

```typescript
interface SelectOptionGroup<T = string> {
  label: string;
  options: SelectOption<T>[];
}
```

## Keyboard Navigation

| Key               | Action                                |
| ----------------- | ------------------------------------- |
| `Enter` / `Space` | Open dropdown / Select focused option |
| `ArrowDown`       | Open dropdown / Move focus down       |
| `ArrowUp`         | Move focus up                         |
| `Home`            | Move focus to first option            |
| `End`             | Move focus to last option             |
| `Escape`          | Close dropdown                        |
| `Tab`             | Close dropdown and move focus         |
| Character key     | Jump to first matching option (non-searchable mode) |

## Accessibility

The Select component follows WCAG 2.2 AA guidelines with dual ARIA patterns:

### Non-searchable mode (default)
- Trigger is a `<button>` with `aria-haspopup="listbox"` and `aria-expanded`
- `aria-activedescendant` on the listbox tracks keyboard-focused option
- Type-ahead character navigation jumps to matching options

### Searchable mode
- Search input gets `role="combobox"` with `aria-autocomplete="list"`
- `aria-controls` links search input to listbox
- `aria-activedescendant` on search input tracks focused option

### Common ARIA attributes
- `role="listbox"` on dropdown, `role="option"` on options with unique IDs
- `aria-selected` on selected options
- `aria-disabled` on disabled options
- `aria-required` when required
- `aria-invalid` when error
- `aria-busy` when loading
- `aria-describedby` links to helper text
- `aria-labelledby` or `aria-label` for accessible name
- Option groups use `role="group"` with `aria-labelledby`
- Focus management: focus returns to trigger on dropdown close
- Floating UI positioning prevents viewport clipping

## Bootstrap Classes Used

- `form-select` - Base select styling
- `form-select-sm`, `form-select-lg` - Size variants
- `form-label` - Label styling
- `form-text` - Helper text
- `dropdown-menu` - Dropdown container
- `dropdown-item` - Option styling
- `dropdown-header` - Group header
- `is-invalid`, `is-valid` - Validation states
- `invalid-feedback` - Error message

## Related Components

- [Input](../Input/README.md) - For text entry
- [Checkbox](../Checkbox/README.md) - For boolean inputs
- [Radio](../Radio/README.md) - For single selection from visible options
