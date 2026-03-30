# Breadcrumb

An accessible breadcrumb navigation component built with Bootstrap 5 styling. Supports custom separators, collapsible items for long paths, and router integration.

## Features

- Hierarchical navigation display
- Collapsible items for long paths (FSM-based)
- Router integration support (`linkAs` prop)
- Custom separators (string or ReactNode)
- Icon support per item
- Dismissible label truncation (`maxLabelWidth`)
- Schema.org JSON-LD structured data for SEO
- Collapsed items render prop for custom dropdowns
- Configurable expand button label (`expandText`)
- HREF security validation (blocks dangerous protocols)
- WCAG 2.2 AA compliant

## Installation

Add the Breadcrumb component to your project using the DSAi CLI:

```bash
dsai add breadcrumb
```

This copies the component source files into your project and automatically resolves all dependencies.

> **First time?** Install the CLI and generate your design tokens first:
>
> ```bash
> pnpm add @dsai-io/tools
> npx dsai tokens build
> ```

## Usage

### Basic Breadcrumb (Items Mode)

```tsx
import { Breadcrumb } from '@dsai-io/react';

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
import { Breadcrumb, BreadcrumbItem } from '@dsai-io/react';

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

### Custom Separator (String)

```tsx
<Breadcrumb separator=">" items={items} />
<Breadcrumb separator="→" items={items} />
```

### Custom Separator (ReactNode)

```tsx
<Breadcrumb separator={<ChevronRightIcon size={14} />} items={items} />
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

### Schema.org Structured Data

```tsx
<Breadcrumb items={items} structuredData />
```

Generates a `<script type="application/ld+json">` tag with Schema.org `BreadcrumbList` data for SEO rich results.

### Label Truncation

```tsx
<Breadcrumb items={items} maxLabelWidth="120px" />

// Per-item override
<BreadcrumbItem href="/" maxLabelWidth="80px">Very Long Label</BreadcrumbItem>
```

### Custom Collapsed Items

```tsx
<Breadcrumb
  items={items}
  maxItems={4}
  renderCollapsedItems={(hiddenItems) => (
    <Dropdown items={hiddenItems.map(i => ({ label: i.label, href: i.href }))} />
  )}
/>
```

### Custom Expand Text

```tsx
<Breadcrumb items={items} maxItems={4} expandText="Show full path" />
```

## Props

### Breadcrumb

| Prop                    | Type                                             | Default                       | Description                            |
| ----------------------- | ------------------------------------------------ | ----------------------------- | -------------------------------------- |
| `items`                 | `BreadcrumbItemData[]`                           | -                             | Breadcrumb items                       |
| `children`              | `ReactNode`                                      | -                             | Compound components                    |
| `separator`             | `ReactNode`                                      | `'/'`                         | Custom separator (string or ReactNode) |
| `maxItems`              | `number`                                         | -                             | Max items before collapse              |
| `itemsBeforeCollapse`   | `number`                                         | `1`                           | Items before ellipsis                  |
| `itemsAfterCollapse`    | `number`                                         | `1`                           | Items after ellipsis                   |
| `expanded`              | `boolean`                                        | `false`                       | Controlled expand state                |
| `onExpand`              | `() => void`                                     | -                             | Expand callback                        |
| `expandText`            | `string`                                         | `'Show hidden breadcrumbs'`   | Expand button accessible label         |
| `linkAs`                | `ElementType`                                    | `'a'`                         | Custom link component                  |
| `maxLabelWidth`         | `string`                                         | -                             | Truncate labels at this width          |
| `renderCollapsedItems`  | `(items: BreadcrumbItemData[]) => ReactNode`     | -                             | Custom render for collapsed items      |
| `structuredData`        | `boolean`                                        | `false`                       | Generate Schema.org JSON-LD            |
| `aria-label`            | `string`                                         | `'Breadcrumb'`                | Accessible label                       |
| `aria-labelledby`       | `string`                                         | -                             | ID of element labeling the nav         |
| `className`             | `string`                                         | -                             | Additional classes                     |
| `style`                 | `CSSProperties`                                  | -                             | Inline styles                          |
| `id`                    | `string`                                         | -                             | Element ID                             |
| `data-testid`           | `string`                                         | -                             | Test ID attribute                      |

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

| Prop            | Type            | Description                   |
| --------------- | --------------- | ----------------------------- |
| `children`      | `ReactNode`     | Item content                  |
| `href`          | `string`        | Link URL                      |
| `icon`          | `ReactNode`     | Optional icon                 |
| `active`        | `boolean`       | Current page indicator        |
| `onClick`       | `() => void`    | Click handler                 |
| `linkAs`        | `ElementType`   | Custom link component         |
| `maxLabelWidth` | `string`        | Truncate label at this width  |
| `className`     | `string`        | Additional classes            |
| `style`         | `CSSProperties` | Inline styles                 |
| `data-testid`   | `string`        | Test ID attribute             |
| `data-test`     | `string`        | Test attribute                |

## Accessibility

The Breadcrumb component follows WCAG 2.2 AA guidelines:

- `<nav aria-label="...">` wrapper with optional `aria-labelledby`
- `<ol>` ordered list structure
- `aria-current="page"` on active item
- Semantic `<a>` elements for links
- Keyboard navigable
- Ellipsis button has accessible label and `aria-expanded`
- `data-visual-state` attribute reflects `collapsed` or `expanded` state

When rendering multiple breadcrumbs on the same page, provide unique `aria-label` or
`aria-labelledby` values (or unique `id` values to use the default `Breadcrumb <id>` label) so
navigation landmarks remain distinguishable.

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
} from '@dsai-io/react';

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
