# CheckboxGroup Component Guidelines

The CheckboxGroup component manages a group of related checkboxes.

## Import

```tsx
import { CheckboxGroup, Checkbox } from '@dsai/react';
```

## When to Use

Use CheckboxGroup when:

- Multiple related options can be selected
- Managing checkbox state together
- Form field with multiple selections
- Filter or preference lists

## Basic Usage

```tsx
<CheckboxGroup label="Interests" value={selected} onChange={setSelected}>
  <Checkbox value="sports" label="Sports" />
  <Checkbox value="music" label="Music" />
  <Checkbox value="tech" label="Technology" />
</CheckboxGroup>
```

## With Description

```tsx
<CheckboxGroup
  label="Notification preferences"
  description="Select how you want to receive updates"
>
  <Checkbox value="email" label="Email" />
  <Checkbox value="sms" label="SMS" />
  <Checkbox value="push" label="Push notifications" />
</CheckboxGroup>
```

## Orientation

```tsx
// Vertical (default)
<CheckboxGroup orientation="vertical">...</CheckboxGroup>

// Horizontal
<CheckboxGroup orientation="horizontal">...</CheckboxGroup>
```

## Error State

```tsx
<CheckboxGroup label="Terms" error="Please select at least one option" required>
  <Checkbox value="terms" label="I agree to terms" />
  <Checkbox value="privacy" label="I agree to privacy policy" />
</CheckboxGroup>
```

## Select All Pattern

```tsx
const allValues = ['a', 'b', 'c'];
const [selected, setSelected] = useState<string[]>([]);

const allSelected = selected.length === allValues.length;
const someSelected = selected.length > 0 && !allSelected;

<Checkbox
  label="Select all"
  checked={allSelected}
  indeterminate={someSelected}
  onChange={(e) => setSelected(e.target.checked ? allValues : [])}
/>
<CheckboxGroup value={selected} onChange={setSelected}>
  <Checkbox value="a" label="Option A" />
  <Checkbox value="b" label="Option B" />
  <Checkbox value="c" label="Option C" />
</CheckboxGroup>
```

## Accessibility

- Group is announced to screen readers
- Label associates with the group
- Keyboard navigation works naturally

```tsx
<CheckboxGroup
  label="Dietary restrictions"
  aria-describedby="diet-help"
>
  <Checkbox value="vegetarian" label="Vegetarian" />
  <Checkbox value="vegan" label="Vegan" />
</CheckboxGroup>
<span id="diet-help">Select all that apply</span>
```

## Do's and Don'ts

### Do

- Always provide a group label
- Use for related options
- Allow zero selections when appropriate

### Don't

- Don't use for mutually exclusive options (use Radio)
- Don't forget the group label
- Don't mix unrelated options
