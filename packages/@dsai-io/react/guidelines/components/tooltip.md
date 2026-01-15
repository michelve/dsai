# Tooltip Component Guidelines

The Tooltip component displays informational text on hover or focus.

## Import

```tsx
import { Tooltip } from '@dsai-io/react';
```

## When to Use

Use Tooltip when:

- Explaining icon-only buttons
- Providing additional context for UI elements
- Showing full text for truncated content
- Displaying keyboard shortcuts

Do not use Tooltip when:

- Content is essential for task completion (use inline text)
- Rich content or interactions are needed (use Popover)
- Mobile is primary use case (tooltips don't work well on touch)

## Basic Usage

```tsx
<Tooltip content="Save your changes">
  <Button>Save</Button>
</Tooltip>
```

## On Icon Buttons

```tsx
<Tooltip content="Edit item">
  <Button aria-label="Edit item">
    <Icon name="edit" />
  </Button>
</Tooltip>

<Tooltip content="Delete item">
  <Button aria-label="Delete item" variant="danger">
    <Icon name="trash" />
  </Button>
</Tooltip>
```

## Placement

```tsx
<Tooltip content="Above" placement="top">
  <Button>Top</Button>
</Tooltip>

<Tooltip content="Below" placement="bottom">
  <Button>Bottom</Button>
</Tooltip>

<Tooltip content="Left side" placement="left">
  <Button>Left</Button>
</Tooltip>

<Tooltip content="Right side" placement="right">
  <Button>Right</Button>
</Tooltip>
```

Auto-placement adjusts when space is limited:

```tsx
<Tooltip content="Adjusts position automatically" placement="top">
  <Button>Auto-adjust</Button>
</Tooltip>
```

## Delay

```tsx
// Default delay (300ms)
<Tooltip content="Appears after delay">
  <Button>Hover me</Button>
</Tooltip>

// Instant (0ms)
<Tooltip content="Appears immediately" delay={0}>
  <Button>Hover me</Button>
</Tooltip>

// Longer delay
<Tooltip content="Slower appearance" delay={500}>
  <Button>Hover me</Button>
</Tooltip>
```

## Multi-line Content

```tsx
<Tooltip
  content={
    <>
      <strong>Keyboard shortcut</strong>
      <br />
      Press Ctrl+S to save
    </>
  }
>
  <Button>Save</Button>
</Tooltip>
```

## Disabled Elements

Wrap disabled elements in a span for tooltip to work:

```tsx
<Tooltip content="You don't have permission to edit">
  <span>
    <Button disabled>Edit</Button>
  </span>
</Tooltip>
```

## Controlled Tooltip

```tsx
const [open, setOpen] = useState(false);

<Tooltip content="Controlled tooltip" open={open} onOpenChange={setOpen}>
  <Button>Controlled</Button>
</Tooltip>;
```

## Accessibility

- Tooltips are associated via `aria-describedby`
- Content is accessible to screen readers
- Appears on focus for keyboard users

```tsx
// Accessible by default
<Tooltip content="Additional information">
  <Button>Action</Button>
</Tooltip>

// Icon button - tooltip matches aria-label
<Tooltip content="Close dialog">
  <Button aria-label="Close dialog">
    <Icon name="close" />
  </Button>
</Tooltip>
```

## Tooltip vs Popover

| Tooltip             | Popover              |
| ------------------- | -------------------- |
| Text only           | Rich content         |
| No interaction      | Can contain buttons  |
| Hover/focus trigger | Click trigger        |
| Brief hints         | Detailed information |

```tsx
// Tooltip - simple text
<Tooltip content="Click to copy">
  <Button>Copy</Button>
</Tooltip>

// Popover - interactive content
<Popover>
  <Popover.Trigger>
    <Button>Share</Button>
  </Popover.Trigger>
  <Popover.Content>
    <Button>Copy link</Button>
    <Button>Email</Button>
    <Button>Twitter</Button>
  </Popover.Content>
</Popover>
```

## Common Patterns

### Icon Button Bar

```tsx
<div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
  <Tooltip content="Bold (Ctrl+B)">
    <Button variant="ghost" aria-label="Bold">
      <Icon name="bold" />
    </Button>
  </Tooltip>
  <Tooltip content="Italic (Ctrl+I)">
    <Button variant="ghost" aria-label="Italic">
      <Icon name="italic" />
    </Button>
  </Tooltip>
  <Tooltip content="Underline (Ctrl+U)">
    <Button variant="ghost" aria-label="Underline">
      <Icon name="underline" />
    </Button>
  </Tooltip>
</div>
```

### Truncated Text

```tsx
<Tooltip content={fullText}>
  <span
    style={{
      maxWidth: 200,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    }}
  >
    {fullText}
  </span>
</Tooltip>
```

### Status Indicator

```tsx
<Tooltip content="Server is online and healthy">
  <Badge variant="success">
    <Icon name="circle" size="xs" />
    Online
  </Badge>
</Tooltip>
```

## Do's and Don'ts

### Do

- Keep content brief (1-2 sentences max)
- Use for supplementary information
- Provide tooltips for icon-only buttons
- Match aria-label content for icon buttons

### Don't

- Don't put essential info only in tooltips
- Don't use for mobile-first interfaces
- Don't include interactive elements
- Don't use tooltips on text links (redundant)
