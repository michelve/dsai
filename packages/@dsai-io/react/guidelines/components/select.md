# Select Component Guidelines

The Select component provides a dropdown for choosing from predefined options.

## Import

```tsx
import { Select } from '@dsai-io/react';
```

## When to Use

Use Select when:

- Choosing from 5-15 predefined options
- Space is limited for displaying all options
- Options are well-known or easily scannable

Do not use Select when:

- Less than 4 options (use Radio)
- More than 20 options (use Autocomplete/Combobox)
- User needs to type custom values (use Input)
- Multi-select is needed (use CheckboxGroup or multi-select variant)

## Basic Usage

```tsx
<Select label="Country">
  <Select.Option value="us">United States</Select.Option>
  <Select.Option value="ca">Canada</Select.Option>
  <Select.Option value="uk">United Kingdom</Select.Option>
</Select>
```

## Controlled vs Uncontrolled

### Controlled (Recommended)

```tsx
const [country, setCountry] = useState('');

<Select label="Country" value={country} onChange={(e) => setCountry(e.target.value)}>
  <Select.Option value="">Select a country</Select.Option>
  <Select.Option value="us">United States</Select.Option>
  <Select.Option value="ca">Canada</Select.Option>
</Select>;
```

### Uncontrolled

```tsx
<Select label="Country" defaultValue="us">
  <Select.Option value="us">United States</Select.Option>
  <Select.Option value="ca">Canada</Select.Option>
</Select>
```

## With Placeholder

```tsx
<Select label="Category" placeholder="Select a category">
  <Select.Option value="electronics">Electronics</Select.Option>
  <Select.Option value="clothing">Clothing</Select.Option>
  <Select.Option value="books">Books</Select.Option>
</Select>
```

## Sizes

```tsx
<Select size="sm" label="Small">...</Select>
<Select size="md" label="Medium (default)">...</Select>
<Select size="lg" label="Large">...</Select>
```

## States

### Disabled

```tsx
<Select label="Country" disabled value="us">
  <Select.Option value="us">United States</Select.Option>
</Select>
```

### Disabled Option

```tsx
<Select label="Plan">
  <Select.Option value="free">Free</Select.Option>
  <Select.Option value="pro">Pro</Select.Option>
  <Select.Option value="enterprise" disabled>
    Enterprise (Contact us)
  </Select.Option>
</Select>
```

### Error State

```tsx
<Select label="Category" error="Please select a category" value="">
  <Select.Option value="">Select...</Select.Option>
  <Select.Option value="tech">Technology</Select.Option>
</Select>
```

## Option Groups

```tsx
<Select label="Location">
  <Select.Group label="North America">
    <Select.Option value="us">United States</Select.Option>
    <Select.Option value="ca">Canada</Select.Option>
    <Select.Option value="mx">Mexico</Select.Option>
  </Select.Group>
  <Select.Group label="Europe">
    <Select.Option value="uk">United Kingdom</Select.Option>
    <Select.Option value="de">Germany</Select.Option>
    <Select.Option value="fr">France</Select.Option>
  </Select.Group>
</Select>
```

## With Helper Text

```tsx
<Select label="Timezone" helperText="Select your local timezone for accurate scheduling">
  <Select.Option value="pst">Pacific Time (PT)</Select.Option>
  <Select.Option value="est">Eastern Time (ET)</Select.Option>
  <Select.Option value="utc">UTC</Select.Option>
</Select>
```

## Native Select

For simple use cases, use the native variant:

```tsx
<Select label="Month" native>
  {months.map((month) => (
    <option key={month.value} value={month.value}>
      {month.label}
    </option>
  ))}
</Select>
```

## Form Integration

```tsx
<form onSubmit={handleSubmit}>
  <Select name="department" label="Department" required>
    <Select.Option value="">Select department</Select.Option>
    <Select.Option value="eng">Engineering</Select.Option>
    <Select.Option value="design">Design</Select.Option>
    <Select.Option value="product">Product</Select.Option>
  </Select>

  <Button type="submit">Submit</Button>
</form>
```

## Accessibility

- Label is automatically associated with select
- Arrow keys navigate options
- Type-ahead search for options
- Proper focus management

```tsx
// Accessible by default
<Select label="Role">
  <Select.Option value="admin">Administrator</Select.Option>
  <Select.Option value="user">User</Select.Option>
</Select>
```

## Select vs Radio vs Combobox

| Select             | Radio            | Combobox        |
| ------------------ | ---------------- | --------------- |
| 5-15 options       | 2-4 options      | Many options    |
| Hidden until click | All visible      | Searchable      |
| Single selection   | Single selection | Single or multi |
| Compact            | Takes space      | Flexible        |

## Common Patterns

### Filter by Status

```tsx
<Select label="Status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
  <Select.Option value="">All statuses</Select.Option>
  <Select.Option value="active">Active</Select.Option>
  <Select.Option value="pending">Pending</Select.Option>
  <Select.Option value="closed">Closed</Select.Option>
</Select>
```

### Dependent Selects

```tsx
const [country, setCountry] = useState('');
const [state, setState] = useState('');

<Select
  label="Country"
  value={country}
  onChange={(e) => {
    setCountry(e.target.value);
    setState(''); // Reset state when country changes
  }}
>
  <Select.Option value="us">United States</Select.Option>
  <Select.Option value="ca">Canada</Select.Option>
</Select>

<Select
  label="State/Province"
  value={state}
  onChange={(e) => setState(e.target.value)}
  disabled={!country}
>
  {country && states[country].map(s => (
    <Select.Option key={s.value} value={s.value}>
      {s.label}
    </Select.Option>
  ))}
</Select>
```

## Do's and Don'ts

### Do

- Provide a clear label
- Use a placeholder for optional selects
- Group related options
- Order options logically (alphabetical, by frequency)

### Don't

- Don't use for less than 4 options
- Don't use for free-form input
- Don't hide the label
- Don't use for long lists without search
