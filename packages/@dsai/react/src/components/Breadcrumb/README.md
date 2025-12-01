# Breadcrumb

An accessible breadcrumb navigation component built with Bootstrap 5 styling. Supports custom separators, collapsible items for long paths, and router integration.

## Features

- 🧭 Hierarchical navigation display
- ✂️ Collapsible items for long paths
- 🔗 Router integration support
- 🎨 Custom separators
- 🖼️ Icon support
- ♿ WCAG 2.2 AA compliant

## Installation

```bash
npm install @dsai/react
```

## Usage

### Basic Breadcrumb (Items Mode)

```tsx
import { Breadcrumb } from '@dsai/react';

function Example() {
  return (
    <Breadcrumb
      items={[
        { label: 'Home', href: '/' },
        { label: 'Products', href: '/products' },
        { label: 'Category', href: '/category' },
        { label: 'Current Item', active: true },
      ]}
    />
  );
}
```

### Compound Components

```tsx
import { Breadcrumb, BreadcrumbItem } from '@dsai/react';

function Example() {
  return (
    <Breadcrumb>
      <BreadcrumbItem href="/">Home</BreadcrumbItem>
      <BreadcrumbItem href="/products">Products</BreadcrumbItem>
      <BreadcrumbItem active>Current</BreadcrumbItem>
    </Breadcrumb>
  );
}
```

### Custom Separator

```tsx
<Breadcrumb separator=">" items={items} />
<Breadcrumb separator="→" items={items} />
<Breadcrumb separator="•" items={items} />
```

### Collapsible Breadcrumbs

```tsx
// Collapse when more than 4 items
<Breadcrumb items={longPathItems} maxItems={4} itemsBeforeCollapse={1} itemsAfterCollapse={2} />
```

### With Icons

```tsx
<Breadcrumb
  items={[
    { label: 'Home', href: '/', icon: <HomeIcon /> },
    { label: 'Settings', href: '/settings', icon: <SettingsIcon /> },
    { label: 'Profile', active: true },
  ]}
/>
```

### Router Integration

```tsx
import { Link } from 'react-router-dom';

// Using items prop
<Breadcrumb
  linkAs={Link}
  items={[
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
  ]}
/>

// Using compound components
<Breadcrumb>
  <BreadcrumbItem linkAs={Link} href="/">Home</BreadcrumbItem>
  <BreadcrumbItem linkAs={Link} href="/products">Products</BreadcrumbItem>
  <BreadcrumbItem active>Current</BreadcrumbItem>
</Breadcrumb>
```

### Click Handler (SPA Navigation)

```tsx
import { useNavigate } from 'react-router-dom';

function Example() {
  const navigate = useNavigate();

  return (
    <Breadcrumb
      items={[
        { label: 'Home', onClick: () => navigate('/') },
        { label: 'Products', onClick: () => navigate('/products') },
        { label: 'Current', active: true },
      ]}
    />
  );
}
```

### Controlled Collapse

```tsx
function ControlledBreadcrumb() {
  const [expanded, setExpanded] = useState(false);

  return (
    <Breadcrumb
      items={longPathItems}
      maxItems={4}
      expanded={expanded}
      onExpand={() => setExpanded(true)}
    />
  );
}
```

## Props

### Breadcrumb

| Prop                  | Type                   | Default        | Description               |
| --------------------- | ---------------------- | -------------- | ------------------------- |
| `items`               | `BreadcrumbItemData[]` | -              | Breadcrumb items          |
| `children`            | `ReactNode`            | -              | Compound components       |
| `separator`           | `ReactNode`            | `'/'`          | Custom separator          |
| `maxItems`            | `number`               | -              | Max items before collapse |
| `itemsBeforeCollapse` | `number`               | `1`            | Items before ellipsis     |
| `itemsAfterCollapse`  | `number`               | `1`            | Items after ellipsis      |
| `expanded`            | `boolean`              | `false`        | Controlled expand state   |
| `onExpand`            | `() => void`           | -              | Expand callback           |
| `linkAs`              | `ElementType`          | `'a'`          | Custom link component     |
| `aria-label`          | `string`               | `'Breadcrumb'` | Accessible label          |
| `className`           | `string`               | -              | Additional classes        |
| `style`               | `CSSProperties`        | -              | Inline styles             |
| `id`                  | `string`               | -              | Element ID                |

### BreadcrumbItemData

| Property  | Type         | Description            |
| --------- | ------------ | ---------------------- |
| `id`      | `string`     | Unique identifier      |
| `label`   | `ReactNode`  | Display label          |
| `href`    | `string`     | Link URL               |
| `icon`    | `ReactNode`  | Optional icon          |
| `active`  | `boolean`    | Current page indicator |
| `onClick` | `() => void` | Click handler          |

### BreadcrumbItem

| Prop        | Type            | Description            |
| ----------- | --------------- | ---------------------- |
| `children`  | `ReactNode`     | Item content           |
| `href`      | `string`        | Link URL               |
| `icon`      | `ReactNode`     | Optional icon          |
| `active`    | `boolean`       | Current page indicator |
| `onClick`   | `() => void`    | Click handler          |
| `linkAs`    | `ElementType`   | Custom link component  |
| `className` | `string`        | Additional classes     |
| `style`     | `CSSProperties` | Inline styles          |

## Accessibility

The Breadcrumb component follows WCAG 2.2 AA guidelines:

- `<nav aria-label="breadcrumb">` wrapper
- `<ol>` ordered list structure
- `aria-current="page"` on active item
- Semantic `<a>` elements for links
- Keyboard navigable
- Ellipsis button has accessible label and `aria-expanded`
- `data-visual-state` attribute reflects `collapsed` or `expanded` state

## State Machine (FSM)

The Breadcrumb uses a finite state machine for expand/collapse behavior. This ensures predictable state transitions and clear debugging.

### States

| State       | Description                          |
| ----------- | ------------------------------------ |
| `collapsed` | Ellipsis is shown, some items hidden |
| `expanded`  | All items visible                    |

### Events

| Event              | Trigger                 | Effect                                             |
| ------------------ | ----------------------- | -------------------------------------------------- |
| `EXPAND`           | Ellipsis click          | Transitions to `expanded` (uncontrolled mode only) |
| `RESET_FROM_PROPS` | `expanded` prop changes | Syncs FSM state with controlled prop               |

### State Diagram

```text
┌───────────┐    EXPAND (click)    ┌───────────┐
│ collapsed │ ───────────────────▶ │  expanded │
└───────────┘                      └───────────┘
      ▲                                   │
      │     RESET_FROM_PROPS              │
      └───────────────────────────────────┘
```

### Testing FSM States

The `data-visual-state` attribute is added to the `<nav>` element for testing:

```tsx
// Test collapsed state
expect(screen.getByRole('navigation')).toHaveAttribute('data-visual-state', 'collapsed');

// Click ellipsis to expand
fireEvent.click(screen.getByLabelText('Show hidden breadcrumbs'));

// Test expanded state
expect(screen.getByRole('navigation')).toHaveAttribute('data-visual-state', 'expanded');
```

### Advanced: Using FSM Directly

For advanced use cases, you can import and use the FSM utilities:

```tsx
import {
  breadcrumbFSMReducer,
  createInitialBreadcrumbFSMState,
  expandEvent,
  isExpanded,
  resetFromPropsEvent,
} from '@dsai/react';

// Create initial state
const state = createInitialBreadcrumbFSMState(false);
// { expandState: 'collapsed', isControlled: true }

// Process events
const newState = breadcrumbFSMReducer(state, expandEvent());
// In controlled mode: returns same state (no change)

// Check state
if (isExpanded(newState)) {
  console.log('Breadcrumb is expanded');
}
```

## Styling

The component uses Bootstrap 5 breadcrumb classes:

- `.breadcrumb` - List container
- `.breadcrumb-item` - Individual items
- `.active` - Current page styling

### Using Custom Separators

Use the `separator` prop to change the divider:

```tsx
<Breadcrumb separator=">" items={items} />
```

This sets the `--bs-breadcrumb-divider` CSS variable.

## Related Components

- [Tabs](../Tabs/README.md) - For tabbed navigation
- [Button](../Button/README.md) - For actions
