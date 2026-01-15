# Checkbox Component Guidelines

The Checkbox component provides a boolean input for single on/off selections.

## Import

```tsx
import { Checkbox } from '@dsai-io/react';
```

## When to Use

Use Checkbox when:

- User can select zero, one, or multiple options
- Toggling a single boolean setting
- Accepting terms or confirming understanding
- Selecting items from a list

Do not use Checkbox when:

- Only one option can be selected (use Radio)
- Toggle should be immediate (use Switch)
- Options are mutually exclusive (use Radio)

## Basic Usage

```tsx
<Checkbox label="I agree to the terms" />
```

## Controlled vs Uncontrolled

### Controlled (Recommended)

```tsx
const [checked, setChecked] = useState(false);

<Checkbox
  label="Receive notifications"
  checked={checked}
  onChange={(e) => setChecked(e.target.checked)}
/>;
```

### Uncontrolled

```tsx
<Checkbox label="Remember me" defaultChecked />
```

## States

### Checked

```tsx
<Checkbox label="Selected option" checked />
```

### Indeterminate

Use for parent checkboxes when only some children are selected:

```tsx
<Checkbox label="Select all" checked={someChecked} indeterminate={someChecked && !allChecked} />
```

### Disabled

```tsx
<Checkbox label="Unavailable option" disabled />
<Checkbox label="Checked but disabled" checked disabled />
```

### Error State

```tsx
<Checkbox label="I accept the terms" error="You must accept the terms to continue" />
```

## With Description

```tsx
<Checkbox label="Marketing emails" description="Receive updates about new products and features" />
```

## Checkbox Group

Use CheckboxGroup for related checkboxes:

```tsx
import { CheckboxGroup } from '@dsai-io/react';

<CheckboxGroup label="Notification preferences" value={selected} onChange={setSelected}>
  <Checkbox value="email" label="Email notifications" />
  <Checkbox value="sms" label="SMS notifications" />
  <Checkbox value="push" label="Push notifications" />
</CheckboxGroup>;
```

## Sizes

```tsx
<Checkbox size="sm" label="Small" />
<Checkbox size="md" label="Medium (default)" />
<Checkbox size="lg" label="Large" />
```

## Form Integration

```tsx
<form onSubmit={handleSubmit}>
  <Input label="Email" type="email" />
  <Input label="Password" type="password" />

  <Checkbox name="remember" label="Remember me for 30 days" />

  <Checkbox name="terms" label="I agree to the terms and conditions" required />

  <Button type="submit">Sign Up</Button>
</form>
```

## Select All Pattern

```tsx
const [items, setItems] = useState(['a', 'b', 'c']);
const [selected, setSelected] = useState<string[]>([]);

const allSelected = selected.length === items.length;
const someSelected = selected.length > 0 && !allSelected;

<Checkbox
  label="Select all"
  checked={allSelected}
  indeterminate={someSelected}
  onChange={(e) => setSelected(e.target.checked ? items : [])}
/>;

{
  items.map((item) => (
    <Checkbox
      key={item}
      label={`Item ${item}`}
      checked={selected.includes(item)}
      onChange={(e) => {
        if (e.target.checked) {
          setSelected([...selected, item]);
        } else {
          setSelected(selected.filter((i) => i !== item));
        }
      }}
    />
  ));
}
```

## Accessibility

- Labels are automatically associated with checkboxes
- Supports keyboard navigation (Space to toggle)
- Proper focus indicators

```tsx
// Label is clickable
<Checkbox label="Click anywhere on this text" />

// Custom label with link
<Checkbox>
  I agree to the <a href="/terms">terms and conditions</a>
</Checkbox>
```

## Checkbox vs Radio vs Switch

| Checkbox           | Radio                | Switch           |
| ------------------ | -------------------- | ---------------- |
| Multiple selection | Single selection     | Immediate toggle |
| Can be unchecked   | One must be selected | Binary on/off    |
| Square shape       | Circle shape         | Toggle shape     |
| Forms, lists       | Mutually exclusive   | Settings         |

## Common Patterns

### Terms Agreement

```tsx
<Checkbox
  label={
    <>
      I agree to the <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>
    </>
  }
  required
/>
```

### Filter List

```tsx
<div>
  <h4>Filter by status</h4>
  {statuses.map((status) => (
    <Checkbox
      key={status}
      label={status}
      checked={filters.includes(status)}
      onChange={() => toggleFilter(status)}
    />
  ))}
</div>
```

### Task List

```tsx
{
  tasks.map((task) => (
    <Checkbox
      key={task.id}
      label={task.title}
      checked={task.completed}
      onChange={() => toggleTask(task.id)}
    />
  ));
}
```

## Do's and Don'ts

### Do

- Always provide a label
- Use CheckboxGroup for related options
- Use indeterminate for "select all" parents
- Put the most common option first

### Don't

- Don't use checkbox for mutually exclusive options
- Don't use for immediate actions (use Switch)
- Don't put too many checkboxes in a single group
- Don't hide labels (use description for extra context)
