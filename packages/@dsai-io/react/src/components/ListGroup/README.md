# ListGroup

An accessible list group component for displaying lists of content. Built with Bootstrap 5 styling and supporting variants, interactive items, managed selection, and badges/icons.

## Features

- Multiple variants: default, flush, numbered
- Color variants for items
- Interactive items (clickable/links)
- Badge and icon support
- Horizontal layout option
- Managed selection (single and multiple)
- Description slot for secondary text
- Dividers and headers for grouping
- Loading and empty states
- Collapsible/expandable items
- Arrow key navigation (roving tabindex)
- Virtualization for large lists
- WCAG 2.2 AA compliant

## Installation

Add the ListGroup component to your project using the DSAi CLI:

```bash
dsai add list-group
```

This copies the component source files into your project and automatically resolves all dependencies.

> **First time?** Install the CLI and generate your design tokens first:
>
> ```bash
> pnpm add @dsai-io/tools
> npx dsai tokens build
> ```

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

### Managed Selection (Controlled)

Use `activeKey`, `onSelect`, and `eventKey` for controlled selection:

```tsx
import { ListGroup, ListGroupItem } from '@dsai-io/react';
import { useState } from 'react';

function SingleSelectExample() {
  const [selected, setSelected] = useState<string | null>('inbox');

  return (
    <ListGroup
      onSelect={(key) => setSelected(key)}
      activeKey={selected ?? undefined}
    >
      <ListGroupItem eventKey="inbox">Inbox</ListGroupItem>
      <ListGroupItem eventKey="sent">Sent</ListGroupItem>
      <ListGroupItem eventKey="drafts">Drafts</ListGroupItem>
    </ListGroup>
  );
}
```

### Managed Selection (Uncontrolled)

Use `defaultActiveKey` for uncontrolled selection:

```tsx
<ListGroup defaultActiveKey="inbox" onSelect={(key) => console.log(key)}>
  <ListGroupItem eventKey="inbox">Inbox</ListGroupItem>
  <ListGroupItem eventKey="sent">Sent</ListGroupItem>
  <ListGroupItem eventKey="drafts">Drafts</ListGroupItem>
</ListGroup>
```

### Multiple Selection

Set `selectionMode="multiple"` and pass an array to `activeKey`:

```tsx
function MultiSelectExample() {
  const [selected, setSelected] = useState<string[]>(['tag1']);

  return (
    <ListGroup
      selectionMode="multiple"
      activeKey={selected}
      onSelect={(key) => {
        setSelected((prev) =>
          prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
        );
      }}
    >
      <ListGroupItem eventKey="tag1">JavaScript</ListGroupItem>
      <ListGroupItem eventKey="tag2">TypeScript</ListGroupItem>
      <ListGroupItem eventKey="tag3">React</ListGroupItem>
    </ListGroup>
  );
}
```

### Description Slot

Add secondary text below item content with the `description` prop:

```tsx
<ListGroup>
  <ListGroupItem description="12 unread messages">Inbox</ListGroupItem>
  <ListGroupItem description="Last sent 2 hours ago">Sent</ListGroupItem>
  <ListGroupItem description="3 drafts">Drafts</ListGroupItem>
</ListGroup>
```

### Dividers and Headers

Use `ListGroupDivider` and `ListGroupHeader` to visually group items:

```tsx
import { ListGroup, ListGroupItem, ListGroupDivider, ListGroupHeader } from '@dsai-io/react';

<ListGroup>
  <ListGroupHeader>Mail</ListGroupHeader>
  <ListGroupItem>Inbox</ListGroupItem>
  <ListGroupItem>Sent</ListGroupItem>
  <ListGroupDivider />
  <ListGroupHeader>Settings</ListGroupHeader>
  <ListGroupItem>Account</ListGroupItem>
  <ListGroupItem>Preferences</ListGroupItem>
</ListGroup>
```

Dividers and headers can also be used in items mode:

```tsx
<ListGroup
  items={[
    { type: 'header', content: 'Mail' },
    { content: 'Inbox' },
    { content: 'Sent' },
    { type: 'divider' },
    { type: 'header', content: 'Settings' },
    { content: 'Account' },
  ]}
/>
```

### Loading State

Show a loading spinner overlay while data is being fetched:

```tsx
<ListGroup loading items={items} />
```

### Empty State

Display custom content when the items array is empty:

```tsx
<ListGroup items={[]} emptyContent="No items to display" />
```

### Collapsible Items

Items with nested content can be expanded and collapsed:

```tsx
<ListGroup>
  <ListGroupItem collapsible defaultExpanded>
    Mail
    <ListGroup>
      <ListGroupItem>Inbox</ListGroupItem>
      <ListGroupItem>Sent</ListGroupItem>
    </ListGroup>
  </ListGroupItem>
  <ListGroupItem collapsible defaultExpanded={false}>
    Settings
    <ListGroup>
      <ListGroupItem>Account</ListGroupItem>
      <ListGroupItem>Preferences</ListGroupItem>
    </ListGroup>
  </ListGroupItem>
</ListGroup>
```

Controlled collapsible:

```tsx
const [expanded, setExpanded] = useState(true);

<ListGroupItem
  collapsible
  expanded={expanded}
  onExpandedChange={setExpanded}
>
  Collapsible section
  <ListGroup>
    <ListGroupItem>Nested item</ListGroupItem>
  </ListGroup>
</ListGroupItem>
```

### Arrow Key Navigation

When `onSelect` is provided, the ListGroup uses roving tabindex for keyboard navigation. Only the focused item is in the tab order; arrow keys move focus between items.

```tsx
<ListGroup onSelect={(key) => console.log(key)} activeKey="item1">
  <ListGroupItem eventKey="item1">Item 1</ListGroupItem>
  <ListGroupItem eventKey="item2">Item 2</ListGroupItem>
  <ListGroupItem eventKey="item3" disabled>Item 3 (skipped)</ListGroupItem>
  <ListGroupItem eventKey="item4">Item 4</ListGroupItem>
</ListGroup>
```

### Virtualization

For large lists, enable virtual scrolling to render only visible items. Requires `@tanstack/react-virtual` as a peer dependency.

```tsx
<ListGroup
  virtualized
  itemHeight={48}
  overscan={5}
  items={largeItemsArray}
  style={{ height: 400 }}
/>
```

## Props

### ListGroup

| Prop              | Type                                               | Default     | Description                                    |
| ----------------- | -------------------------------------------------- | ----------- | ---------------------------------------------- |
| `items`           | `ListGroupEntry[]`                                 | -           | List entries (items, dividers, headers)         |
| `children`        | `ReactNode`                                        | -           | Compound components                            |
| `variant`         | `'default' \| 'flush' \| 'numbered'`               | `'default'` | List variant                                   |
| `horizontal`      | `boolean \| 'sm' \| 'md' \| 'lg' \| 'xl' \| 'xxl'` | `false`     | Horizontal layout                              |
| `ordered`         | `boolean`                                          | `false`     | Render as `<ol>`                               |
| `activeKey`       | `string \| string[]`                               | -           | Controlled active key(s)                       |
| `defaultActiveKey`| `string \| string[]`                               | -           | Default active key(s) (uncontrolled)           |
| `onSelect`        | `(eventKey: string, event: Event) => void`         | -           | Selection callback                             |
| `selectionMode`   | `'single' \| 'multiple'`                           | `'single'`  | Selection mode                                 |
| `loading`         | `boolean`                                          | `false`     | Show loading spinner                           |
| `emptyContent`    | `ReactNode`                                        | -           | Content for empty state                        |
| `virtualized`     | `boolean`                                          | `false`     | Enable virtual scrolling                       |
| `itemHeight`      | `number`                                           | -           | Fixed item height for virtualization (px)      |
| `overscan`        | `number`                                           | `5`         | Items rendered outside visible area            |
| `className`       | `string`                                           | -           | Additional classes                             |
| `style`           | `CSSProperties`                                    | -           | Inline styles                                  |
| `id`              | `string`                                           | -           | Element ID                                     |
| `aria-label`      | `string`                                           | -           | Accessible label                               |
| `aria-labelledby` | `string`                                           | -           | ID of labelling element                        |

### ListGroupItem

| Prop               | Type                               | Default | Description                          |
| ------------------ | ---------------------------------- | ------- | ------------------------------------ |
| `children`         | `ReactNode`                        | -       | Item content                         |
| `description`      | `ReactNode`                        | -       | Secondary description text           |
| `variant`          | `ListGroupItemVariant`             | -       | Color variant                        |
| `active`           | `boolean`                          | `false` | Active state                         |
| `disabled`         | `boolean`                          | `false` | Disabled state                       |
| `badge`            | `ReactNode`                        | -       | Badge content                        |
| `icon`             | `ReactNode`                        | -       | Icon content                         |
| `href`             | `string`                           | -       | Link URL                             |
| `onClick`          | `(event) => void`                  | -       | Click handler                        |
| `as`               | `'li' \| 'a' \| 'button' \| 'div'` | auto    | Element type                         |
| `eventKey`         | `string`                           | -       | Selection key for managed selection  |
| `collapsible`      | `boolean`                          | `false` | Enable collapse/expand behavior      |
| `defaultExpanded`  | `boolean`                          | -       | Default expanded state (uncontrolled)|
| `expanded`         | `boolean`                          | -       | Controlled expanded state            |
| `onExpandedChange` | `(expanded: boolean) => void`      | -       | Expand/collapse change callback      |
| `className`        | `string`                           | -       | Additional classes                   |
| `style`            | `CSSProperties`                    | -       | Inline styles                        |
| `tabIndex`         | `number`                           | -       | Tab index                            |

### ListGroupItemData

| Property           | Type                           | Description                          |
| ------------------ | ------------------------------ | ------------------------------------ |
| `id`               | `string`                       | Unique identifier                    |
| `content`          | `ReactNode`                    | Item content                         |
| `description`      | `ReactNode`                    | Secondary description text           |
| `variant`          | `ListGroupItemVariant`         | Color variant                        |
| `active`           | `boolean`                      | Active/selected state                |
| `disabled`         | `boolean`                      | Disabled state                       |
| `badge`            | `ReactNode`                    | Badge content                        |
| `icon`             | `ReactNode`                    | Icon content                         |
| `href`             | `string`                       | Link URL                             |
| `onClick`          | `(event) => void`              | Click handler                        |
| `eventKey`         | `string`                       | Selection key for managed selection  |
| `collapsible`      | `boolean`                      | Enable collapse/expand behavior      |
| `defaultExpanded`  | `boolean`                      | Default expanded state               |
| `expanded`         | `boolean`                      | Controlled expanded state            |
| `onExpandedChange` | `(expanded: boolean) => void`  | Expand/collapse change callback      |
| `children`         | `ListGroupEntry[]`             | Nested entries for collapsible items |

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

| Key          | Action                                              |
| ------------ | --------------------------------------------------- |
| `Tab`        | Move focus into/out of the list                     |
| `Arrow Down` | Move focus to next item (when `onSelect` provided)  |
| `Arrow Up`   | Move focus to previous item                         |
| `Home`       | Move focus to first item                            |
| `End`        | Move focus to last item                             |
| `Enter`      | Activate/select focused item                        |
| `Space`      | Activate/select focused item                        |

When `onSelect` is provided, the component uses roving tabindex: only the focused item has `tabIndex={0}`, and all other items have `tabIndex={-1}`. Disabled items are skipped during arrow key navigation.

## Accessibility

The ListGroup component follows WCAG 2.2 AA guidelines:

- Semantic `<ul>` or `<ol>` list structure
- `<li>` elements for items (or appropriate `<a>`/`<button>`)
- `aria-current="true"` on active item
- `aria-disabled` on disabled items
- `role="button"` for clickable non-button items
- `role="listbox"` when managed selection is enabled
- `role="option"` and `aria-selected` on selectable items
- Roving tabindex for arrow key navigation
- `role="separator"` on dividers
- `role="presentation"` on headers
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
- `.list-group-divider` - Divider separator
- `.list-group-header` - Section header
- `.active` - Active state
- `.disabled` - Disabled state

## Related Components

- [Badge](../Badge/README.md) - For item badges
- [Button](../Button/README.md) - For actions
