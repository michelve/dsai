# Dropdown Component Guidelines

The Dropdown component provides a toggle-triggered menu with options.

## Import

```tsx
import { Dropdown } from '@dsai/react';
```

## When to Use

Use Dropdown when:

- Showing a menu of actions
- Providing contextual options
- Creating navigation submenus
- Offering multiple actions in limited space

Do not use Dropdown when:

- Selecting form values (use Select)
- Showing tooltips (use Tooltip)
- Displaying rich content (use Popover)

## Basic Usage

```tsx
<Dropdown>
  <Dropdown.Trigger>
    <Button>Options</Button>
  </Dropdown.Trigger>
  <Dropdown.Content>
    <Dropdown.Item>Edit</Dropdown.Item>
    <Dropdown.Item>Duplicate</Dropdown.Item>
    <Dropdown.Item>Delete</Dropdown.Item>
  </Dropdown.Content>
</Dropdown>
```

## With Icons

```tsx
<Dropdown>
  <Dropdown.Trigger>
    <Button>Actions</Button>
  </Dropdown.Trigger>
  <Dropdown.Content>
    <Dropdown.Item>
      <Icon name="edit" /> Edit
    </Dropdown.Item>
    <Dropdown.Item>
      <Icon name="copy" /> Duplicate
    </Dropdown.Item>
    <Dropdown.Separator />
    <Dropdown.Item variant="danger">
      <Icon name="trash" /> Delete
    </Dropdown.Item>
  </Dropdown.Content>
</Dropdown>
```

## Sections and Labels

```tsx
<Dropdown>
  <Dropdown.Trigger>
    <Button>Menu</Button>
  </Dropdown.Trigger>
  <Dropdown.Content>
    <Dropdown.Label>Actions</Dropdown.Label>
    <Dropdown.Item>Edit</Dropdown.Item>
    <Dropdown.Item>Share</Dropdown.Item>

    <Dropdown.Separator />

    <Dropdown.Label>Danger Zone</Dropdown.Label>
    <Dropdown.Item variant="danger">Delete</Dropdown.Item>
  </Dropdown.Content>
</Dropdown>
```

## Disabled Items

```tsx
<Dropdown>
  <Dropdown.Trigger>
    <Button>Actions</Button>
  </Dropdown.Trigger>
  <Dropdown.Content>
    <Dropdown.Item>Edit</Dropdown.Item>
    <Dropdown.Item disabled>Archive (no permission)</Dropdown.Item>
    <Dropdown.Item>Delete</Dropdown.Item>
  </Dropdown.Content>
</Dropdown>
```

## With Keyboard Shortcuts

```tsx
<Dropdown>
  <Dropdown.Trigger>
    <Button>Edit</Button>
  </Dropdown.Trigger>
  <Dropdown.Content>
    <Dropdown.Item shortcut="⌘X">Cut</Dropdown.Item>
    <Dropdown.Item shortcut="⌘C">Copy</Dropdown.Item>
    <Dropdown.Item shortcut="⌘V">Paste</Dropdown.Item>
  </Dropdown.Content>
</Dropdown>
```

## Icon-Only Trigger

```tsx
<Dropdown>
  <Dropdown.Trigger>
    <Button variant="ghost" aria-label="More options">
      <Icon name="more-vertical" />
    </Button>
  </Dropdown.Trigger>
  <Dropdown.Content align="end">
    <Dropdown.Item>Edit</Dropdown.Item>
    <Dropdown.Item>Delete</Dropdown.Item>
  </Dropdown.Content>
</Dropdown>
```

## Alignment

```tsx
// Align to start (default)
<Dropdown.Content align="start">...</Dropdown.Content>

// Align to end
<Dropdown.Content align="end">...</Dropdown.Content>

// Center align
<Dropdown.Content align="center">...</Dropdown.Content>
```

## Accessibility

- Keyboard navigation with Arrow keys
- Enter/Space to select
- Escape to close
- Focus is trapped within menu

```tsx
// Accessible by default
<Dropdown>
  <Dropdown.Trigger>
    <Button aria-haspopup="menu">Options</Button>
  </Dropdown.Trigger>
  <Dropdown.Content>
    <Dropdown.Item onSelect={handleEdit}>Edit</Dropdown.Item>
  </Dropdown.Content>
</Dropdown>
```

## Common Patterns

### Table Row Actions

```tsx
<Table.Row>
  <Table.Cell>{item.name}</Table.Cell>
  <Table.Cell>
    <Dropdown>
      <Dropdown.Trigger>
        <Button variant="ghost" size="sm" aria-label="Row actions">
          <Icon name="more-horizontal" />
        </Button>
      </Dropdown.Trigger>
      <Dropdown.Content align="end">
        <Dropdown.Item onSelect={() => edit(item)}>Edit</Dropdown.Item>
        <Dropdown.Item onSelect={() => duplicate(item)}>Duplicate</Dropdown.Item>
        <Dropdown.Separator />
        <Dropdown.Item variant="danger" onSelect={() => remove(item)}>
          Delete
        </Dropdown.Item>
      </Dropdown.Content>
    </Dropdown>
  </Table.Cell>
</Table.Row>
```

### User Menu

```tsx
<Dropdown>
  <Dropdown.Trigger>
    <Avatar src={user.avatar} name={user.name} />
  </Dropdown.Trigger>
  <Dropdown.Content align="end">
    <Dropdown.Label>{user.name}</Dropdown.Label>
    <Dropdown.Item onSelect={() => navigate('/profile')}>Profile</Dropdown.Item>
    <Dropdown.Item onSelect={() => navigate('/settings')}>Settings</Dropdown.Item>
    <Dropdown.Separator />
    <Dropdown.Item onSelect={logout}>Sign out</Dropdown.Item>
  </Dropdown.Content>
</Dropdown>
```

## Do's and Don'ts

### Do

- Keep menu items concise
- Group related items with separators
- Use icons consistently
- Align dropdown near trigger

### Don't

- Don't use for form selection (use Select)
- Don't nest dropdowns deeply
- Don't put too many items (consider submenu)
- Don't disable trigger without explanation
