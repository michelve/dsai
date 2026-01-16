# SelectableCard Component Guidelines

The SelectableCard component provides a card variant that can be selected/toggled.

## Import

```tsx
import { SelectableCard } from '@dsai-io/react';
```

## When to Use

Use SelectableCard when:

- Single or multiple selection from visual options
- Rich content selection (not just text)
- Plan or feature selection
- Visual quiz or survey options

Do not use SelectableCard when:

- Simple text options (use Radio/Checkbox)
- Many options (use Select)
- Non-interactive display (use Card)

## Basic Usage

```tsx
<SelectableCard selected={selected === 'option1'} onSelect={() => setSelected('option1')}>
  <h4>Option 1</h4>
  <p>Description of option 1</p>
</SelectableCard>
```

## Single Selection (Radio-like)

```tsx
const [selected, setSelected] = useState('basic');

<div style={{ display: 'flex', gap: 'var(--spacing-4)' }}>
  <SelectableCard selected={selected === 'basic'} onSelect={() => setSelected('basic')}>
    <h4>Basic Plan</h4>
    <p>$9/month</p>
  </SelectableCard>
  <SelectableCard selected={selected === 'pro'} onSelect={() => setSelected('pro')}>
    <h4>Pro Plan</h4>
    <p>$29/month</p>
  </SelectableCard>
</div>;
```

## Multiple Selection (Checkbox-like)

```tsx
const [selected, setSelected] = useState<string[]>([]);

const toggleSelection = (value: string) => {
  setSelected((prev) =>
    prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
  );
};

<div style={{ display: 'flex', gap: 'var(--spacing-4)' }}>
  <SelectableCard
    selected={selected.includes('feature1')}
    onSelect={() => toggleSelection('feature1')}
  >
    Feature 1
  </SelectableCard>
  <SelectableCard
    selected={selected.includes('feature2')}
    onSelect={() => toggleSelection('feature2')}
  >
    Feature 2
  </SelectableCard>
</div>;
```

## Disabled State

```tsx
<SelectableCard disabled>
  <h4>Unavailable Option</h4>
  <p>Coming soon</p>
</SelectableCard>
```

## With Indicator

```tsx
<SelectableCard selected={selected} showIndicator>
  <h4>Selected Option</h4>
  {/* Shows checkmark when selected */}
</SelectableCard>
```

## Accessibility

- Cards are keyboard focusable
- Enter/Space toggles selection
- Selection state is announced

```tsx
<SelectableCard selected={isSelected} onSelect={toggleSelect} aria-label="Basic plan, $9 per month">
  <h4>Basic</h4>
  <p>$9/month</p>
</SelectableCard>
```

## Do's and Don'ts

### Do

- Show clear selected state
- Keep card content focused
- Use for visual rich options

### Don't

- Don't use for many options
- Don't use for simple text choices
- Don't forget keyboard accessibility
