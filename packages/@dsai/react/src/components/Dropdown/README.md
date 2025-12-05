# Dropdown

A fully accessible dropdown menu component using Bootstrap 5 native classes with Floating UI positioning, keyboard navigation, and FSM-driven state management.

## Features

- **Floating UI Positioning**: Smart positioning with auto-flip and shift
- **Keyboard Navigation**: Arrow keys, Tab, Enter, Escape support
- **Type-ahead Search**: Jump to items by typing
- **Focus Management**: Proper focus handling within menu
- **Portal Rendering**: Renders in `document.body` for z-index isolation
- **Compound Components**: Dropdown.Toggle, Dropdown.Menu, Dropdown.Item, etc.
- **FSM State Management**: Predictable state transitions for animations
- **Security**: Safe href validation, no XSS vulnerabilities

## Installation

The Dropdown component is part of the `@dsai/react` package:

```tsx
import { Dropdown } from '@dsai/react';
```

## Usage

### Basic Dropdown

```tsx
import { Dropdown } from '@dsai/react';

function Example() {
  return (
    <Dropdown>
      <Dropdown.Toggle>Options</Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item onClick={() => console.log('Action 1')}>Action</Dropdown.Item>
        <Dropdown.Item onClick={() => console.log('Action 2')}>Another action</Dropdown.Item>
        <Dropdown.Item onClick={() => console.log('Action 3')}>Something else</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}
```

### Button Variants

```tsx
<Dropdown>
  <Dropdown.Toggle variant="primary">Primary</Dropdown.Toggle>
  <Dropdown.Menu>
    <Dropdown.Item>Action 1</Dropdown.Item>
    <Dropdown.Item>Action 2</Dropdown.Item>
  </Dropdown.Menu>
</Dropdown>

<Dropdown>
  <Dropdown.Toggle variant="success">Success</Dropdown.Toggle>
  <Dropdown.Menu>
    <Dropdown.Item>Action 1</Dropdown.Item>
    <Dropdown.Item>Action 2</Dropdown.Item>
  </Dropdown.Menu>
</Dropdown>
```

### Button Sizes

```tsx
<Dropdown>
  <Dropdown.Toggle size="sm">Small</Dropdown.Toggle>
  <Dropdown.Menu>
    <Dropdown.Item>Action</Dropdown.Item>
  </Dropdown.Menu>
</Dropdown>

<Dropdown>
  <Dropdown.Toggle size="lg">Large</Dropdown.Toggle>
  <Dropdown.Menu>
    <Dropdown.Item>Action</Dropdown.Item>
  </Dropdown.Menu>
</Dropdown>
```

### Split Button

```tsx
import { Button, Dropdown } from '@dsai/react';

<Dropdown>
  <Button variant="primary" onClick={() => console.log('Primary action')}>
    Primary Action
  </Button>
  <Dropdown.Toggle split variant="primary" aria-label="Toggle dropdown" />
  <Dropdown.Menu>
    <Dropdown.Item>Option 1</Dropdown.Item>
    <Dropdown.Item>Option 2</Dropdown.Item>
    <Dropdown.Divider />
    <Dropdown.Item>Separated link</Dropdown.Item>
  </Dropdown.Menu>
</Dropdown>;
```

### Placement / Direction

```tsx
// Dropup
<Dropdown placement="top">
  <Dropdown.Toggle>Dropup</Dropdown.Toggle>
  <Dropdown.Menu>
    <Dropdown.Item>Action</Dropdown.Item>
  </Dropdown.Menu>
</Dropdown>

// Dropstart (left)
<Dropdown placement="left">
  <Dropdown.Toggle>Dropstart</Dropdown.Toggle>
  <Dropdown.Menu>
    <Dropdown.Item>Action</Dropdown.Item>
  </Dropdown.Menu>
</Dropdown>

// Dropend (right)
<Dropdown placement="right">
  <Dropdown.Toggle>Dropend</Dropdown.Toggle>
  <Dropdown.Menu>
    <Dropdown.Item>Action</Dropdown.Item>
  </Dropdown.Menu>
</Dropdown>
```

### Menu Alignment

```tsx
// End-aligned menu
<Dropdown>
  <Dropdown.Toggle>End Aligned</Dropdown.Toggle>
  <Dropdown.Menu align="end">
    <Dropdown.Item>Action 1</Dropdown.Item>
    <Dropdown.Item>Action 2</Dropdown.Item>
  </Dropdown.Menu>
</Dropdown>
```

### Headers and Dividers

```tsx
<Dropdown>
  <Dropdown.Toggle>Grouped Menu</Dropdown.Toggle>
  <Dropdown.Menu>
    <Dropdown.Header>Section 1</Dropdown.Header>
    <Dropdown.Item>Action 1</Dropdown.Item>
    <Dropdown.Item>Action 2</Dropdown.Item>
    <Dropdown.Divider />
    <Dropdown.Header>Section 2</Dropdown.Header>
    <Dropdown.Item>Action 3</Dropdown.Item>
    <Dropdown.Item>Action 4</Dropdown.Item>
  </Dropdown.Menu>
</Dropdown>
```

### With Icons

```tsx
<Dropdown>
  <Dropdown.Toggle>Actions</Dropdown.Toggle>
  <Dropdown.Menu>
    <Dropdown.Item startIcon={<EditIcon />}>Edit</Dropdown.Item>
    <Dropdown.Item startIcon={<CopyIcon />}>Duplicate</Dropdown.Item>
    <Dropdown.Divider />
    <Dropdown.Item startIcon={<TrashIcon />}>Delete</Dropdown.Item>
  </Dropdown.Menu>
</Dropdown>
```

### Link Items

```tsx
<Dropdown>
  <Dropdown.Toggle>Navigation</Dropdown.Toggle>
  <Dropdown.Menu>
    <Dropdown.Item href="/dashboard">Dashboard</Dropdown.Item>
    <Dropdown.Item href="/settings">Settings</Dropdown.Item>
    <Dropdown.Item href="/profile">Profile</Dropdown.Item>
    <Dropdown.Divider />
    <Dropdown.Item href="https://github.com" target="_blank">
      GitHub ↗
    </Dropdown.Item>
  </Dropdown.Menu>
</Dropdown>
```

### Active and Disabled Items

```tsx
<Dropdown>
  <Dropdown.Toggle>States</Dropdown.Toggle>
  <Dropdown.Menu>
    <Dropdown.Item>Regular item</Dropdown.Item>
    <Dropdown.Item active>Active item</Dropdown.Item>
    <Dropdown.Item disabled>Disabled item</Dropdown.Item>
  </Dropdown.Menu>
</Dropdown>
```

### Non-Interactive Text

```tsx
<Dropdown>
  <Dropdown.Toggle>User Menu</Dropdown.Toggle>
  <Dropdown.Menu>
    <Dropdown.ItemText>
      <strong>Signed in as</strong>
      <br />
      user@example.com
    </Dropdown.ItemText>
    <Dropdown.Divider />
    <Dropdown.Item>Profile</Dropdown.Item>
    <Dropdown.Item>Sign out</Dropdown.Item>
  </Dropdown.Menu>
</Dropdown>
```

### Auto Close Behavior

```tsx
// Default: closes on any click
<Dropdown autoClose={true}>
  <Dropdown.Toggle>Default</Dropdown.Toggle>
  <Dropdown.Menu>
    <Dropdown.Item>Closes on click</Dropdown.Item>
  </Dropdown.Menu>
</Dropdown>

// Only closes on item click (inside)
<Dropdown autoClose="inside">
  <Dropdown.Toggle>Inside Only</Dropdown.Toggle>
  <Dropdown.Menu>
    <Dropdown.Item>Closes on item click</Dropdown.Item>
  </Dropdown.Menu>
</Dropdown>

// Only closes on outside click
<Dropdown autoClose="outside">
  <Dropdown.Toggle>Outside Only</Dropdown.Toggle>
  <Dropdown.Menu>
    <Dropdown.Item>Item click doesn't close</Dropdown.Item>
  </Dropdown.Menu>
</Dropdown>

// Never auto-closes
<Dropdown autoClose={false}>
  <Dropdown.Toggle>Manual</Dropdown.Toggle>
  <Dropdown.Menu>
    <Dropdown.Item>Toggle to close</Dropdown.Item>
  </Dropdown.Menu>
</Dropdown>
```

### Controlled Mode

```tsx
function ControlledDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(!isOpen)}>{isOpen ? 'Close' : 'Open'} externally</button>
      <Dropdown isOpen={isOpen} onOpenChange={setIsOpen}>
        <Dropdown.Toggle>Controlled</Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item>Action</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
}
```

### Disabled Dropdown

```tsx
<Dropdown disabled>
  <Dropdown.Toggle>Disabled</Dropdown.Toggle>
  <Dropdown.Menu>
    <Dropdown.Item>Action</Dropdown.Item>
  </Dropdown.Menu>
</Dropdown>
```

### Without Caret

For icon-only toggles, always provide an `aria-label` so the control has a readable name.

```tsx
<Dropdown>
  <Dropdown.Toggle caret={false} aria-label="More options">
    ⋮
  </Dropdown.Toggle>
  <Dropdown.Menu>
    <Dropdown.Item>Edit</Dropdown.Item>
    <Dropdown.Item>Delete</Dropdown.Item>
  </Dropdown.Menu>
</Dropdown>
```

## API Reference

### Dropdown Props

| Prop           | Type                               | Default          | Description                       |
| -------------- | ---------------------------------- | ---------------- | --------------------------------- |
| `isOpen`       | `boolean`                          | -                | Controlled open state             |
| `defaultOpen`  | `boolean`                          | `false`          | Default open state (uncontrolled) |
| `onOpenChange` | `(open: boolean) => void`          | -                | Callback when open state changes  |
| `placement`    | `DropdownPlacement`                | `'bottom-start'` | Menu placement                    |
| `autoClose`    | `boolean \| 'inside' \| 'outside'` | `true`           | Auto-close behavior               |
| `offset`       | `[number, number]`                 | `[0, 2]`         | Menu offset [crossAxis, mainAxis] |
| `disabled`     | `boolean`                          | `false`          | Disable the dropdown              |
| `onOpened`     | `() => void`                       | -                | Callback when dropdown opens      |
| `onClosed`     | `() => void`                       | -                | Callback when dropdown closes     |
| `className`    | `string`                           | -                | Container class name              |
| `style`        | `CSSProperties`                    | -                | Container inline styles           |
| `id`           | `string`                           | -                | Container ID (also used for ARIA) |

### Dropdown.Toggle Props

| Prop         | Type                   | Default       | Description                                                |
| ------------ | ---------------------- | ------------- | ---------------------------------------------------------- |
| `variant`    | `ButtonVariant`        | `'secondary'` | Button variant                                             |
| `size`       | `'sm' \| 'md' \| 'lg'` | `'md'`        | Button size                                                |
| `split`      | `boolean`              | `false`       | Split button mode                                          |
| `caret`      | `boolean`              | `true`        | Show caret arrow                                           |
| `disabled`   | `boolean`              | `false`       | Disable toggle                                             |
| `className`  | `string`               | -             | Additional class name                                      |
| `aria-label` | `string`               | -             | Accessible label (required for split or icon-only toggles) |

### Dropdown.Menu Props

| Prop        | Type                  | Default         | Description           |
| ----------- | --------------------- | --------------- | --------------------- |
| `align`     | `'start' \| 'end'`    | `'start'`       | Menu alignment        |
| `portal`    | `boolean`             | `true`          | Render in portal      |
| `container` | `HTMLElement \| null` | `document.body` | Portal container      |
| `className` | `string`              | -               | Additional class name |

### Dropdown.Item Props

| Prop        | Type                | Default | Description                   |
| ----------- | ------------------- | ------- | ----------------------------- |
| `onClick`   | `MouseEventHandler` | -       | Click handler                 |
| `href`      | `string`            | -       | Link href (renders as anchor) |
| `target`    | `string`            | -       | Link target                   |
| `rel`       | `string`            | -       | Link rel attribute            |
| `active`    | `boolean`           | `false` | Active state                  |
| `disabled`  | `boolean`           | `false` | Disabled state                |
| `startIcon` | `ReactNode`         | -       | Icon before text              |
| `endIcon`   | `ReactNode`         | -       | Icon after text               |
| `as`        | `'button' \| 'a'`   | -       | Force element type            |
| `className` | `string`            | -       | Additional class name         |

### Dropdown.Header Props

| Prop        | Type        | Default | Description           |
| ----------- | ----------- | ------- | --------------------- |
| `children`  | `ReactNode` | -       | Header content        |
| `className` | `string`    | -       | Additional class name |

> **Note:** Header renders as a `<span>` element (with `dropdown-header` class) for ARIA compliance within `role="menu"`. Use CSS to style it appropriately.

### Dropdown.Divider Props

| Prop        | Type     | Default | Description           |
| ----------- | -------- | ------- | --------------------- |
| `className` | `string` | -       | Additional class name |

### Dropdown.ItemText Props

| Prop        | Type        | Default | Description           |
| ----------- | ----------- | ------- | --------------------- |
| `children`  | `ReactNode` | -       | Text content          |
| `className` | `string`    | -       | Additional class name |

## Accessibility

The Dropdown component follows WAI-ARIA Menu Button pattern:

- Toggle has `role="button"`, `aria-haspopup="menu"`, and `aria-expanded`
- Menu has `role="menu"` and `aria-labelledby` pointing to toggle
- Items have `role="menuitem"`
- Disabled items have `aria-disabled="true"`
- Active items have `aria-current="true"`
- Full keyboard navigation support

### Keyboard Shortcuts

| Key               | Action                             |
| ----------------- | ---------------------------------- |
| `Enter` / `Space` | Open/close dropdown, activate item |
| `↑` / `↓`         | Navigate items                     |
| `Home` / `End`    | Jump to first/last item            |
| `Escape`          | Close dropdown                     |
| `Tab`             | Move focus through items           |
| Type characters   | Jump to matching item (type-ahead) |

## Security

The Dropdown component includes security features:

- **Safe href validation**: Blocks `javascript:`, `data:`, `vbscript:`, `file:` protocols
- **Automatic rel attribute**: Adds `rel="noopener noreferrer"` to `target="_blank"` links
- **No prop spreading**: Only whitelisted props are passed to DOM
- **No dangerouslySetInnerHTML**: Content is safely rendered

## FSM States

The Dropdown uses a finite state machine for predictable state management:

| State     | Description                      |
| --------- | -------------------------------- |
| `closed`  | Menu is hidden                   |
| `opening` | Menu is appearing (animation)    |
| `open`    | Menu is fully visible            |
| `closing` | Menu is disappearing (animation) |

## Related Components

- [Button](../Button/README.md) - For split button dropdowns
- [Modal](../Modal/README.md) - For larger dialog content
