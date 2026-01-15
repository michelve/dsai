# Breadcrumb Component Guidelines

The Breadcrumb component shows navigation hierarchy and current location.

## Import

```tsx
import { Breadcrumb } from '@dsai-io/react';
```

## When to Use

Use Breadcrumb when:

- Showing hierarchical navigation
- User needs to understand current location
- Quick navigation to parent pages
- Multi-level page structures

Do not use Breadcrumb when:

- Flat site structure
- Only one level deep
- Mobile-first primary navigation

## Basic Usage

```tsx
<Breadcrumb>
  <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
  <Breadcrumb.Item href="/products">Products</Breadcrumb.Item>
  <Breadcrumb.Item active>Widget Pro</Breadcrumb.Item>
</Breadcrumb>
```

## With Separator

```tsx
<Breadcrumb separator="/">
  <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
  <Breadcrumb.Item href="/docs">Docs</Breadcrumb.Item>
  <Breadcrumb.Item active>Components</Breadcrumb.Item>
</Breadcrumb>

<Breadcrumb separator={<Icon name="chevron-right" size="sm" />}>
  <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
  <Breadcrumb.Item active>Page</Breadcrumb.Item>
</Breadcrumb>
```

## With Icons

```tsx
<Breadcrumb>
  <Breadcrumb.Item href="/">
    <Icon name="home" size="sm" />
  </Breadcrumb.Item>
  <Breadcrumb.Item href="/settings">Settings</Breadcrumb.Item>
  <Breadcrumb.Item active>Profile</Breadcrumb.Item>
</Breadcrumb>
```

## Truncated Path

```tsx
<Breadcrumb maxItems={3} itemsBeforeCollapse={1} itemsAfterCollapse={2}>
  <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
  <Breadcrumb.Item href="/products">Products</Breadcrumb.Item>
  <Breadcrumb.Item href="/products/electronics">Electronics</Breadcrumb.Item>
  <Breadcrumb.Item href="/products/electronics/phones">Phones</Breadcrumb.Item>
  <Breadcrumb.Item active>iPhone 15</Breadcrumb.Item>
</Breadcrumb>;
{
  /* Renders: Home / ... / Phones / iPhone 15 */
}
```

## Accessibility

```tsx
<Breadcrumb aria-label="Navigation breadcrumb">
  <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
  <Breadcrumb.Item active aria-current="page">
    Current
  </Breadcrumb.Item>
</Breadcrumb>
```

## Do's and Don'ts

### Do

- Always include Home as first item
- Mark current page as active
- Keep item labels short

### Don't

- Don't use for primary navigation
- Don't make current page a link
- Don't use for flat structures
