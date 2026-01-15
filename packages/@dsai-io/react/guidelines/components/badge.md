# Badge Component Guidelines

The Badge component displays small status labels, counters, or tags.

## Import

```tsx
import { Badge } from '@dsai/react';
```

## When to Use

Use Badge when:

- Showing status indicators (active, pending, closed)
- Displaying counts or quantities
- Labeling or categorizing items
- Highlighting new or unread items

Do not use Badge when:

- Displaying long text (use Alert or text)
- Creating clickable tags (use Button with small size)
- Showing progress (use Progress)

## Basic Usage

```tsx
<Badge>Default</Badge>
<Badge variant="success">Active</Badge>
<Badge variant="danger">Error</Badge>
```

## Variants

| Variant | Purpose       | Usage                       |
| ------- | ------------- | --------------------------- |
| default | Neutral       | General labels, categories  |
| success | Positive      | Active, complete, approved  |
| danger  | Negative      | Error, rejected, offline    |
| warning | Caution       | Pending, requires attention |
| info    | Informational | New, updated, beta          |

```tsx
<Badge variant="default">Draft</Badge>
<Badge variant="success">Published</Badge>
<Badge variant="danger">Rejected</Badge>
<Badge variant="warning">Review</Badge>
<Badge variant="info">New</Badge>
```

## Sizes

```tsx
<Badge size="sm">Small</Badge>
<Badge size="md">Medium (default)</Badge>
<Badge size="lg">Large</Badge>
```

## Pill Shape

```tsx
<Badge pill>Rounded badge</Badge>
<Badge pill variant="success">99+</Badge>
```

## With Icon

```tsx
<Badge variant="success">
  <Icon name="check" size="sm" />
  Verified
</Badge>

<Badge variant="warning">
  <Icon name="clock" size="sm" />
  Pending
</Badge>
```

## Counter Badge

```tsx
// Simple counter
<Badge variant="danger">5</Badge>

// Overflow counter
<Badge variant="danger" pill>99+</Badge>

// On icon or avatar
<div style={{ position: 'relative', display: 'inline-block' }}>
  <Icon name="bell" />
  <Badge
    variant="danger"
    pill
    style={{ position: 'absolute', top: -4, right: -4 }}
  >
    3
  </Badge>
</div>
```

## Status Indicators

```tsx
// User status
<Avatar src="/user.jpg" />
<Badge variant="success" size="sm">Online</Badge>

// Order status
<Badge variant="warning">Processing</Badge>
<Badge variant="info">Shipped</Badge>
<Badge variant="success">Delivered</Badge>
```

## In Lists and Tables

```tsx
<Table>
  <Table.Head>
    <Table.Row>
      <Table.Header>Name</Table.Header>
      <Table.Header>Status</Table.Header>
    </Table.Row>
  </Table.Head>
  <Table.Body>
    <Table.Row>
      <Table.Cell>Project Alpha</Table.Cell>
      <Table.Cell>
        <Badge variant="success">Active</Badge>
      </Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>Project Beta</Table.Cell>
      <Table.Cell>
        <Badge variant="warning">Review</Badge>
      </Table.Cell>
    </Table.Row>
  </Table.Body>
</Table>
```

## Tag List

```tsx
<div style={{ display: 'flex', gap: 'var(--spacing-2)', flexWrap: 'wrap' }}>
  <Badge>React</Badge>
  <Badge>TypeScript</Badge>
  <Badge>Design System</Badge>
</div>
```

## Dismissible Badge

```tsx
<Badge dismissible onDismiss={() => handleRemove(tag)}>
  Tag name
  <button aria-label="Remove tag">×</button>
</Badge>
```

## Accessibility

- Badges are decorative when used with visible text
- Use `aria-label` when badge meaning isn't clear from context
- Don't rely on color alone to convey meaning

```tsx
// Good - text describes status
<Badge variant="success">Active</Badge>

// Good - context from adjacent content
<span>Notifications</span>
<Badge variant="danger">5</Badge>

// If needed - aria-label for icon-only
<Badge variant="danger" aria-label="5 unread notifications">5</Badge>
```

## Common Patterns

### Card with Badge

```tsx
<Card>
  <Card.Header>
    Project Name
    <Badge variant="success" size="sm">
      Active
    </Badge>
  </Card.Header>
  <Card.Body>Project details...</Card.Body>
</Card>
```

### Tab with Counter

```tsx
<Tabs>
  <Tabs.Tab>
    Inbox
    <Badge variant="danger" pill size="sm">
      12
    </Badge>
  </Tabs.Tab>
  <Tabs.Tab>Sent</Tabs.Tab>
  <Tabs.Tab>
    Drafts
    <Badge size="sm">3</Badge>
  </Tabs.Tab>
</Tabs>
```

### Feature Tags

```tsx
<div>
  <h3>Pricing Plan</h3>
  <Badge variant="info">Most Popular</Badge>
  <Badge variant="success">Best Value</Badge>
</div>
```

## Do's and Don'ts

### Do

- Keep badge text short (1-2 words)
- Use consistent variants for similar statuses
- Provide context through adjacent content
- Use pill shape for counters

### Don't

- Don't use too many badges in one area
- Don't use badges for long descriptions
- Don't rely solely on color for meaning
- Don't use badges as buttons (use Button)
