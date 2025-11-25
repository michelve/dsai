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
<Breadcrumb
  items={longPathItems}
  maxItems={4}
  itemsBeforeCollapse={1}
  itemsAfterCollapse={2}
/>
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

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `BreadcrumbItemData[]` | - | Breadcrumb items |
| `children` | `ReactNode` | - | Compound components |
| `separator` | `ReactNode` | `'/'` | Custom separator |
| `maxItems` | `number` | - | Max items before collapse |
| `itemsBeforeCollapse` | `number` | `1` | Items before ellipsis |
| `itemsAfterCollapse` | `number` | `1` | Items after ellipsis |
| `expanded` | `boolean` | `false` | Controlled expand state |
| `onExpand` | `() => void` | - | Expand callback |
| `linkAs` | `ElementType` | `'a'` | Custom link component |
| `aria-label` | `string` | `'Breadcrumb'` | Accessible label |
| `className` | `string` | - | Additional classes |
| `style` | `CSSProperties` | - | Inline styles |
| `id` | `string` | - | Element ID |

### BreadcrumbItemData

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Unique identifier |
| `label` | `ReactNode` | Display label |
| `href` | `string` | Link URL |
| `icon` | `ReactNode` | Optional icon |
| `active` | `boolean` | Current page indicator |
| `onClick` | `() => void` | Click handler |

### BreadcrumbItem

| Prop | Type | Description |
|------|------|-------------|
| `children` | `ReactNode` | Item content |
| `href` | `string` | Link URL |
| `icon` | `ReactNode` | Optional icon |
| `active` | `boolean` | Current page indicator |
| `onClick` | `() => void` | Click handler |
| `linkAs` | `ElementType` | Custom link component |
| `className` | `string` | Additional classes |
| `style` | `CSSProperties` | Inline styles |

## Accessibility

The Breadcrumb component follows WCAG 2.2 AA guidelines:

- `<nav aria-label="breadcrumb">` wrapper
- `<ol>` ordered list structure
- `aria-current="page"` on active item
- Semantic `<a>` elements for links
- Keyboard navigable
- Ellipsis button has accessible label

## Styling

The component uses Bootstrap 5 breadcrumb classes:

- `.breadcrumb` - List container
- `.breadcrumb-item` - Individual items
- `.active` - Current page styling

### Custom Separator

Use the `separator` prop to change the divider:

```tsx
<Breadcrumb separator=">" items={items} />
```

This sets the `--bs-breadcrumb-divider` CSS variable.

## Related Components

- [Tabs](../Tabs/README.md) - For tabbed navigation
- [Button](../Button/README.md) - For actions

