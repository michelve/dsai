# Popover Component Guidelines

The Popover component displays interactive content in a popup triggered by click.

## Import

```tsx
import { Popover } from '@dsai-io/react';
```

## When to Use

Use Popover when:

- Displaying interactive content in a popup
- Showing forms or complex content
- Providing quick actions without navigation
- Content needs to be clicked to dismiss

Do not use Popover when:

- Just showing text info (use Tooltip)
- Critical action confirmation (use Modal)
- Simple menu options (use Dropdown)

## Basic Usage

```tsx
<Popover>
  <Popover.Trigger>
    <Button>Open Popover</Button>
  </Popover.Trigger>
  <Popover.Content>
    <p>Popover content goes here.</p>
  </Popover.Content>
</Popover>
```

## With Title

```tsx
<Popover>
  <Popover.Trigger>
    <Button>Settings</Button>
  </Popover.Trigger>
  <Popover.Content>
    <Popover.Header>Settings</Popover.Header>
    <Popover.Body>
      <Switch label="Notifications" />
      <Switch label="Dark mode" />
    </Popover.Body>
  </Popover.Content>
</Popover>
```

## Placement

```tsx
<Popover placement="top">...</Popover>
<Popover placement="bottom">...</Popover>
<Popover placement="left">...</Popover>
<Popover placement="right">...</Popover>
```

## Controlled

```tsx
const [open, setOpen] = useState(false);

<Popover open={open} onOpenChange={setOpen}>
  <Popover.Trigger>
    <Button>Controlled</Button>
  </Popover.Trigger>
  <Popover.Content>
    <Button onClick={() => setOpen(false)}>Close</Button>
  </Popover.Content>
</Popover>;
```

## With Form

```tsx
<Popover>
  <Popover.Trigger>
    <Button>Add Note</Button>
  </Popover.Trigger>
  <Popover.Content>
    <form onSubmit={handleSubmit}>
      <Input label="Note" />
      <Button type="submit" size="sm">
        Save
      </Button>
    </form>
  </Popover.Content>
</Popover>
```

## Accessibility

- Focus is managed within popover
- Escape key closes popover
- Focus returns to trigger on close

```tsx
<Popover>
  <Popover.Trigger>
    <Button aria-haspopup="dialog">Edit</Button>
  </Popover.Trigger>
  <Popover.Content role="dialog" aria-label="Edit options">
    Content
  </Popover.Content>
</Popover>
```

## Popover vs Tooltip vs Dropdown

| Popover       | Tooltip         | Dropdown       |
| ------------- | --------------- | -------------- |
| Click trigger | Hover trigger   | Click trigger  |
| Rich content  | Text only       | Menu items     |
| Interactive   | Non-interactive | Action-focused |

## Do's and Don'ts

### Do

- Use for supplementary interactive content
- Keep content focused
- Close after action completion

### Don't

- Don't use for critical confirmations
- Don't nest popovers
- Don't put too much content
