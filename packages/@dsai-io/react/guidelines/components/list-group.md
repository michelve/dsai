# ListGroup Component Guidelines

The ListGroup component displays a flexible list of content.

## Import

```tsx
import { ListGroup } from '@dsai/react';
```

## When to Use

Use ListGroup when:

- Displaying a series of related items
- Navigation menus or sidebars
- Lists with actions or links
- Grouped content without table structure

## Basic Usage

```tsx
<ListGroup>
  <ListGroup.Item>First item</ListGroup.Item>
  <ListGroup.Item>Second item</ListGroup.Item>
  <ListGroup.Item>Third item</ListGroup.Item>
</ListGroup>
```

## As Links

```tsx
<ListGroup>
  <ListGroup.Item as="a" href="/dashboard">
    Dashboard
  </ListGroup.Item>
  <ListGroup.Item as="a" href="/settings">
    Settings
  </ListGroup.Item>
  <ListGroup.Item as="a" href="/profile">
    Profile
  </ListGroup.Item>
</ListGroup>
```

## Active and Disabled

```tsx
<ListGroup>
  <ListGroup.Item active>Active item</ListGroup.Item>
  <ListGroup.Item>Normal item</ListGroup.Item>
  <ListGroup.Item disabled>Disabled item</ListGroup.Item>
</ListGroup>
```

## With Actions

```tsx
<ListGroup>
  <ListGroup.Item>
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <span>Item name</span>
      <Button size="sm" variant="ghost">
        Edit
      </Button>
    </div>
  </ListGroup.Item>
</ListGroup>
```

## Flush (No Borders)

```tsx
<Card>
  <Card.Header>Team Members</Card.Header>
  <ListGroup flush>
    <ListGroup.Item>Alice</ListGroup.Item>
    <ListGroup.Item>Bob</ListGroup.Item>
    <ListGroup.Item>Carol</ListGroup.Item>
  </ListGroup>
</Card>
```

## With Badges

```tsx
<ListGroup>
  <ListGroup.Item>
    <span>Messages</span>
    <Badge variant="danger" pill>
      12
    </Badge>
  </ListGroup.Item>
  <ListGroup.Item>
    <span>Notifications</span>
    <Badge pill>5</Badge>
  </ListGroup.Item>
</ListGroup>
```

## Accessibility

```tsx
<ListGroup as="nav" aria-label="Main navigation">
  <ListGroup.Item as="a" href="/" aria-current="page">
    Home
  </ListGroup.Item>
  <ListGroup.Item as="a" href="/about">
    About
  </ListGroup.Item>
</ListGroup>
```

## Do's and Don'ts

### Do

- Use for related items
- Make interactive items clearly clickable
- Use flush variant inside cards

### Don't

- Don't use for complex data (use Table)
- Don't nest ListGroups deeply
- Don't mix very different content types
