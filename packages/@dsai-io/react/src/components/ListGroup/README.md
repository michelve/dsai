# ListGroup

An accessible list group component for displaying lists of content. Built with Bootstrap 5 styling and supporting variants, interactive items, and badges/icons.

## Features

- 📋 Multiple variants: default, flush, numbered
- 🎨 Color variants for items
- 🖱️ Interactive items (clickable/links)
- 🏷️ Badge and icon support
- ↔️ Horizontal layout option
- ♿ WCAG 2.2 AA compliant

## Installation

```bash
npm install @dsai-io/react
```

## Usage

### Basic ListGroup (Items Mode)

```tsx
import { ListGroup } from '@dsai-io/react';

function Example() {
  return (
    <ListGroup items={[{ content: 'Item 1' }, { content: 'Item 2' }, { content: 'Item 3' }]} />
  );
}
```

### Compound Components

```tsx
import { ListGroup, ListGroupItem } from '@dsai-io/react';

function Example() {
  return (
    <ListGroup>
      <ListGroupItem>Item 1</ListGroupItem>
      <ListGroupItem>Item 2</ListGroupItem>
      <ListGroupItem>Item 3</ListGroupItem>
    </ListGroup>
  );
}
```

### Active and Disabled States

```tsx
<ListGroup>
  <ListGroupItem active>Active item</ListGroupItem>
  <ListGroupItem>Normal item</ListGroupItem>
  <ListGroupItem disabled>Disabled item</ListGroupItem>
</ListGroup>
```

### Color Variants

```tsx
<ListGroup>
  <ListGroupItem variant="primary">Primary</ListGroupItem>
  <ListGroupItem variant="secondary">Secondary</ListGroupItem>
  <ListGroupItem variant="success">Success</ListGroupItem>
  <ListGroupItem variant="danger">Danger</ListGroupItem>
  <ListGroupItem variant="warning">Warning</ListGroupItem>
  <ListGroupItem variant="info">Info</ListGroupItem>
  <ListGroupItem variant="light">Light</ListGroupItem>
  <ListGroupItem variant="dark">Dark</ListGroupItem>
</ListGroup>
```

### Flush Variant

```tsx
<ListGroup variant="flush">
  <ListGroupItem>Flush item 1</ListGroupItem>
  <ListGroupItem>Flush item 2</ListGroupItem>
  <ListGroupItem>Flush item 3</ListGroupItem>
</ListGroup>
```

### Numbered List

```tsx
<ListGroup variant="numbered">
  <ListGroupItem>First item</ListGroupItem>
  <ListGroupItem>Second item</ListGroupItem>
  <ListGroupItem>Third item</ListGroupItem>
</ListGroup>
```

### Interactive Items

```tsx
// Clickable items
<ListGroup>
  <ListGroupItem onClick={() => console.log('clicked')}>
    Clickable item
  </ListGroupItem>
</ListGroup>

// Link items
<ListGroup>
  <ListGroupItem href="/page1">Link to Page 1</ListGroupItem>
  <ListGroupItem href="/page2">Link to Page 2</ListGroupItem>
</ListGroup>
```

### With Badges

```tsx
import { Badge } from '@dsai-io/react';

<ListGroup>
  <ListGroupItem badge={<Badge variant="primary">14</Badge>}>Inbox</ListGroupItem>
  <ListGroupItem badge={<Badge variant="primary">3</Badge>}>Drafts</ListGroupItem>
  <ListGroupItem badge={<Badge variant="primary">99+</Badge>}>Spam</ListGroupItem>
</ListGroup>;
```

### With Icons

```tsx
<ListGroup>
  <ListGroupItem icon={<InboxIcon />}>Inbox</ListGroupItem>
  <ListGroupItem icon={<StarIcon />}>Starred</ListGroupItem>
  <ListGroupItem icon={<TrashIcon />}>Trash</ListGroupItem>
</ListGroup>
```

### Horizontal Layout

```tsx
// Always horizontal
<ListGroup horizontal>
  <ListGroupItem>Item 1</ListGroupItem>
  <ListGroupItem>Item 2</ListGroupItem>
  <ListGroupItem>Item 3</ListGroupItem>
</ListGroup>

// Responsive horizontal
<ListGroup horizontal="md">
  <ListGroupItem>Item 1</ListGroupItem>
  <ListGroupItem>Item 2</ListGroupItem>
  <ListGroupItem>Item 3</ListGroupItem>
</ListGroup>
```

## Props

### ListGroup

| Prop              | Type                                               | Default     | Description             |
| ----------------- | -------------------------------------------------- | ----------- | ----------------------- |
| `items`           | `ListGroupItemData[]`                              | -           | List items              |
| `children`        | `ReactNode`                                        | -           | Compound components     |
| `variant`         | `'default' \| 'flush' \| 'numbered'`               | `'default'` | List variant            |
| `horizontal`      | `boolean \| 'sm' \| 'md' \| 'lg' \| 'xl' \| 'xxl'` | `false`     | Horizontal layout       |
| `ordered`         | `boolean`                                          | `false`     | Render as `<ol>`        |
| `className`       | `string`                                           | -           | Additional classes      |
| `style`           | `CSSProperties`                                    | -           | Inline styles           |
| `id`              | `string`                                           | -           | Element ID              |
| `aria-label`      | `string`                                           | -           | Accessible label        |
| `aria-labelledby` | `string`                                           | -           | ID of labelling element |

### ListGroupItemData

| Property   | Type                   | Description           |
| ---------- | ---------------------- | --------------------- |
| `id`       | `string`               | Unique identifier     |
| `content`  | `ReactNode`            | Item content          |
| `variant`  | `ListGroupItemVariant` | Color variant         |
| `active`   | `boolean`              | Active/selected state |
| `disabled` | `boolean`              | Disabled state        |
| `badge`    | `ReactNode`            | Badge content         |
| `icon`     | `ReactNode`            | Icon content          |
| `href`     | `string`               | Link URL              |
| `onClick`  | `() => void`           | Click handler         |

### ListGroupItem

| Prop        | Type                               | Default | Description        |
| ----------- | ---------------------------------- | ------- | ------------------ |
| `children`  | `ReactNode`                        | -       | Item content       |
| `variant`   | `ListGroupItemVariant`             | -       | Color variant      |
| `active`    | `boolean`                          | `false` | Active state       |
| `disabled`  | `boolean`                          | `false` | Disabled state     |
| `badge`     | `ReactNode`                        | -       | Badge content      |
| `icon`      | `ReactNode`                        | -       | Icon content       |
| `href`      | `string`                           | -       | Link URL           |
| `onClick`   | `() => void`                       | -       | Click handler      |
| `as`        | `'li' \| 'a' \| 'button' \| 'div'` | auto    | Element type       |
| `className` | `string`                           | -       | Additional classes |
| `style`     | `CSSProperties`                    | -       | Inline styles      |
| `tabIndex`  | `number`                           | -       | Tab index          |

### ListGroupItemVariant

```typescript
type ListGroupItemVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'light'
  | 'dark';
```

## Keyboard Navigation

| Key     | Action                   |
| ------- | ------------------------ |
| `Tab`   | Move focus between items |
| `Enter` | Activate focused item    |
| `Space` | Activate focused item    |

## Accessibility

The ListGroup component follows WCAG 2.2 AA guidelines:

- Semantic `<ul>` or `<ol>` list structure
- `<li>` elements for items (or appropriate `<a>`/`<button>`)
- `aria-current="true"` on active item
- `aria-disabled` on disabled items
- `role="button"` for clickable non-button items
- Full keyboard navigation support

## Security

The ListGroup component implements security hardening for link items:

- **Href Sanitization**: Blocks dangerous URL protocols (`javascript:`, `data:`, `vbscript:`, `file:`)
- **External Link Protection**: Automatically adds `rel="noopener noreferrer"` to external links (`http://` and `https://`)
- **XSS Prevention**: Dangerous hrefs are replaced with `#` to prevent script injection

```tsx
// Dangerous URLs are automatically blocked
<ListGroupItem href="javascript:alert('XSS')">
  This will render with href="#"
</ListGroupItem>

// External links get rel="noopener noreferrer" automatically
<ListGroupItem href="https://external.com">
  External Link (automatically secured)
</ListGroupItem>
```

## Styling

The component uses Bootstrap 5 list group classes:

- `.list-group` - Container
- `.list-group-item` - Items
- `.list-group-item-action` - Interactive items
- `.list-group-flush` - Flush variant
- `.list-group-numbered` - Numbered variant
- `.list-group-horizontal` - Horizontal layout
- `.list-group-item-{variant}` - Color variants
- `.active` - Active state
- `.disabled` - Disabled state

## Related Components

- [Badge](../Badge/README.md) - For item badges
- [Button](../Button/README.md) - For actions
