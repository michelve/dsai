# Card Component Guidelines

The Card component provides a flexible container for grouping related content.

## Import

```tsx
import { Card } from '@dsai/react';
```

## When to Use

Use Card when:

- Grouping related content visually
- Creating clickable content areas
- Displaying items in a grid or list
- Showing preview information for an item

Do not use Card when:

- Just adding background color (use semantic containers)
- Content doesn't form a logical group
- Creating complex layouts (use CSS Grid/Flexbox directly)

## Basic Usage

```tsx
<Card>
  <Card.Body>Simple card content without header or footer.</Card.Body>
</Card>
```

## Full Structure

```tsx
<Card>
  <Card.Header>Card Title</Card.Header>
  <Card.Body>Main content area with text, images, or other components.</Card.Body>
  <Card.Footer>
    <Button variant="primary">Action</Button>
  </Card.Footer>
</Card>
```

## With Image

```tsx
<Card>
  <Card.Image src="/product.jpg" alt="Product preview" />
  <Card.Body>
    <h3>Product Name</h3>
    <p>Product description goes here.</p>
  </Card.Body>
</Card>
```

## Header Variants

### Simple Header

```tsx
<Card>
  <Card.Header>Settings</Card.Header>
  <Card.Body>Content</Card.Body>
</Card>
```

### Header with Action

```tsx
<Card>
  <Card.Header
    action={
      <Button variant="ghost" size="sm">
        Edit
      </Button>
    }
  >
    User Profile
  </Card.Header>
  <Card.Body>Profile content</Card.Body>
</Card>
```

### Header with Subtitle

```tsx
<Card>
  <Card.Header subtitle="Last updated 2 hours ago">Project Status</Card.Header>
  <Card.Body>Status details</Card.Body>
</Card>
```

## Interactive Card

```tsx
// Clickable card
<Card as="button" onClick={handleClick} interactive>
  <Card.Body>
    Click anywhere on this card
  </Card.Body>
</Card>

// Card as link
<Card as="a" href="/details" interactive>
  <Card.Body>
    This entire card is a link
  </Card.Body>
</Card>
```

## Card Variants

```tsx
// Default - with subtle shadow
<Card variant="default">Content</Card>

// Outlined - border only
<Card variant="outlined">Content</Card>

// Flat - no shadow or border
<Card variant="flat">Content</Card>
```

## Card Grid

```tsx
<div
  style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: 'var(--spacing-6)',
  }}
>
  <Card>
    <Card.Body>Card 1</Card.Body>
  </Card>
  <Card>
    <Card.Body>Card 2</Card.Body>
  </Card>
  <Card>
    <Card.Body>Card 3</Card.Body>
  </Card>
</div>
```

## Horizontal Card

```tsx
<Card>
  <div style={{ display: 'flex' }}>
    <Card.Image src="/thumbnail.jpg" alt="Thumbnail" style={{ width: 150 }} />
    <Card.Body>
      <h3>Horizontal Layout</h3>
      <p>Image and content side by side.</p>
    </Card.Body>
  </div>
</Card>
```

## Card with List

```tsx
<Card>
  <Card.Header>Team Members</Card.Header>
  <ListGroup flush>
    <ListGroup.Item>Alice Johnson</ListGroup.Item>
    <ListGroup.Item>Bob Smith</ListGroup.Item>
    <ListGroup.Item>Carol Williams</ListGroup.Item>
  </ListGroup>
</Card>
```

## Loading State

```tsx
<Card>
  <Card.Body>
    {loading ? (
      <div style={{ textAlign: 'center', padding: 'var(--spacing-8)' }}>
        <Spinner />
      </div>
    ) : (
      <p>Loaded content here</p>
    )}
  </Card.Body>
</Card>
```

## Accessibility

For interactive cards, ensure proper keyboard handling:

```tsx
// Card as button
<Card as="button" onClick={handleClick}>
  <Card.Body>
    Accessible via keyboard
  </Card.Body>
</Card>

// Card as link
<Card as="a" href="/page">
  <Card.Body>
    Tab-focusable link
  </Card.Body>
</Card>
```

## Common Patterns

### Product Card

```tsx
<Card>
  <Card.Image src="/product.jpg" alt="Product name" />
  <Card.Body>
    <Badge variant="success">In Stock</Badge>
    <h3>Product Name</h3>
    <p>$29.99</p>
  </Card.Body>
  <Card.Footer>
    <Button variant="primary" fullWidth>
      Add to Cart
    </Button>
  </Card.Footer>
</Card>
```

### Dashboard Widget

```tsx
<Card>
  <Card.Header
    action={
      <Button variant="ghost" size="sm">
        View All
      </Button>
    }
  >
    Recent Activity
  </Card.Header>
  <Card.Body>
    <ListGroup flush>
      {activities.map((activity) => (
        <ListGroup.Item key={activity.id}>{activity.description}</ListGroup.Item>
      ))}
    </ListGroup>
  </Card.Body>
</Card>
```

### Profile Card

```tsx
<Card>
  <Card.Body style={{ textAlign: 'center' }}>
    <Avatar src="/avatar.jpg" size="lg" />
    <h3>John Doe</h3>
    <p>Software Engineer</p>
    <Button variant="secondary" size="sm">
      View Profile
    </Button>
  </Card.Body>
</Card>
```

## Do's and Don'ts

### Do

- Use Card.Body for consistent padding
- Keep card content focused and related
- Use appropriate variants for context
- Make entire card clickable when appropriate

### Don't

- Don't nest cards within cards
- Don't use cards for layout containers
- Don't put too many actions in a single card
- Don't make cards too large or complex
