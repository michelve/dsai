# Scrollspy Component Guidelines

The Scrollspy component highlights navigation based on scroll position.

## Import

```tsx
import { Scrollspy } from '@dsai-io/react';
```

## When to Use

Use Scrollspy when:

- Long page with section navigation
- Table of contents that tracks reading position
- Sticky sidebar navigation
- Documentation pages with many sections

Do not use Scrollspy when:

- Short pages without sections
- Paginated content
- Dynamic content that changes frequently

## Basic Usage

```tsx
<div style={{ display: 'flex' }}>
  <Scrollspy>
    <Scrollspy.Nav>
      <Scrollspy.Link href="#section1">Section 1</Scrollspy.Link>
      <Scrollspy.Link href="#section2">Section 2</Scrollspy.Link>
      <Scrollspy.Link href="#section3">Section 3</Scrollspy.Link>
    </Scrollspy.Nav>
  </Scrollspy>

  <main>
    <section id="section1">...</section>
    <section id="section2">...</section>
    <section id="section3">...</section>
  </main>
</div>
```

## With Offset

```tsx
<Scrollspy offset={80}>
  {' '}
  {/* Account for fixed header */}
  <Scrollspy.Nav>
    <Scrollspy.Link href="#intro">Introduction</Scrollspy.Link>
    <Scrollspy.Link href="#usage">Usage</Scrollspy.Link>
  </Scrollspy.Nav>
</Scrollspy>
```

## Nested Sections

```tsx
<Scrollspy>
  <Scrollspy.Nav>
    <Scrollspy.Link href="#overview">Overview</Scrollspy.Link>
    <Scrollspy.Link href="#components">Components</Scrollspy.Link>
    <Scrollspy.Nav nested>
      <Scrollspy.Link href="#button">Button</Scrollspy.Link>
      <Scrollspy.Link href="#input">Input</Scrollspy.Link>
    </Scrollspy.Nav>
  </Scrollspy.Nav>
</Scrollspy>
```

## Accessibility

```tsx
<Scrollspy>
  <Scrollspy.Nav aria-label="Page sections">
    <Scrollspy.Link href="#section1" aria-current={isActive ? 'location' : undefined}>
      Section 1
    </Scrollspy.Link>
  </Scrollspy.Nav>
</Scrollspy>
```

## Do's and Don'ts

### Do

- Use for long, scrollable content
- Account for fixed headers with offset
- Highlight current section clearly

### Don't

- Don't use for short pages
- Don't have too many nav items
- Don't forget smooth scroll behavior
