# CardList Component Guidelines

The CardList component displays a grid or list of selectable cards.

## Import

```tsx
import { CardList } from '@dsai/react';
```

## When to Use

Use CardList when:

- Displaying multiple selectable options as cards
- Grid of product, plan, or feature selections
- Visual selection where each option needs space
- Radio-like selection with rich content

Do not use CardList when:

- Simple text options (use RadioGroup)
- Non-selectable cards (use Card in grid)
- Many options (use Select or list)

## Basic Usage

```tsx
<CardList value={selected} onChange={setSelected}>
  <CardList.Item value="basic">
    <h4>Basic Plan</h4>
    <p>$9/month</p>
  </CardList.Item>
  <CardList.Item value="pro">
    <h4>Pro Plan</h4>
    <p>$29/month</p>
  </CardList.Item>
  <CardList.Item value="enterprise">
    <h4>Enterprise</h4>
    <p>Contact us</p>
  </CardList.Item>
</CardList>
```

## Grid Layout

```tsx
<CardList columns={3} value={selected} onChange={setSelected}>
  <CardList.Item value="a">Option A</CardList.Item>
  <CardList.Item value="b">Option B</CardList.Item>
  <CardList.Item value="c">Option C</CardList.Item>
</CardList>
```

## Disabled Items

```tsx
<CardList value={selected} onChange={setSelected}>
  <CardList.Item value="available">Available</CardList.Item>
  <CardList.Item value="unavailable" disabled>
    Unavailable
  </CardList.Item>
</CardList>
```

## Accessibility

- Cards are keyboard navigable
- Selection state is announced
- Focus indicators are visible

```tsx
<CardList aria-label="Select a plan" value={plan} onChange={setPlan}>
  <CardList.Item value="basic">Basic</CardList.Item>
  <CardList.Item value="pro">Pro</CardList.Item>
</CardList>
```

## Do's and Don'ts

### Do

- Use for rich visual selections
- Keep card content focused
- Show selected state clearly

### Don't

- Don't use for many options
- Don't mix with regular cards
- Don't use for non-exclusive selection
