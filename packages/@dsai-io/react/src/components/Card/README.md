# Card

A flexible content container component with multiple subcomponents for building various card layouts. Built with Bootstrap 5 styling and supporting variants, interactive states, and responsive layouts.

## Features

- 📦 Multiple subcomponents (Header, Body, Footer, Image)
- 🎨 Three variants: elevated, outlined, ghost
- 🌈 Color variants for backgrounds
- 🖱️ Interactive (clickable/linkable) cards
- ↔️ Horizontal/vertical layouts
- 🖼️ Image overlays
- ♿ WCAG 2.2 AA compliant

## Installation

```bash
npm install @dsai-io/react
```

## Usage

### Basic Card

```tsx
import { Card, CardBody, CardTitle, CardText } from '@dsai-io/react';

function Example() {
  return (
    <Card>
      <CardBody>
        <CardTitle>Card Title</CardTitle>
        <CardText>Some quick example text to build on the card title.</CardText>
      </CardBody>
    </Card>
  );
}
```

### Card with Image

```tsx
<Card>
  <CardImage src="image.jpg" alt="Card image" />
  <CardBody>
    <CardTitle>Card Title</CardTitle>
    <CardText>Card content goes here.</CardText>
  </CardBody>
</Card>
```

### Full Card with Header and Footer

```tsx
<Card>
  <CardHeader>Featured</CardHeader>
  <CardBody>
    <CardTitle>Special Title</CardTitle>
    <CardText>With supporting text below.</CardText>
    <Button variant="primary">Go somewhere</Button>
  </CardBody>
  <CardFooter>2 days ago</CardFooter>
</Card>
```

### Card Variants

```tsx
// Elevated (default) - with shadow
<Card variant="elevated">
  <CardBody>Elevated card</CardBody>
</Card>

// Outlined - with border
<Card variant="outlined">
  <CardBody>Outlined card</CardBody>
</Card>

// Ghost - transparent background
<Card variant="ghost">
  <CardBody>Ghost card</CardBody>
</Card>
```

### Color Variants

```tsx
<Card color="primary">
  <CardBody>Primary card</CardBody>
</Card>

<Card color="success">
  <CardBody>Success card</CardBody>
</Card>
```

### Interactive Cards

```tsx
// Link card
<Card href="/details">
  <CardBody>
    <CardTitle>Click to view details</CardTitle>
  </CardBody>
</Card>

// Clickable card
<Card onClick={() => console.log('clicked')}>
  <CardBody>
    <CardTitle>Click me</CardTitle>
  </CardBody>
</Card>
```

### Horizontal Layout

```tsx
<Card horizontal>
  <CardImage src="image.jpg" alt="Side image" />
  <CardBody>
    <CardTitle>Horizontal Card</CardTitle>
    <CardText>Content beside the image.</CardText>
  </CardBody>
</Card>
```

### Image Overlay

```tsx
<Card>
  <CardImage src="image.jpg" alt="Background" position="overlay" />
  <CardImgOverlay>
    <CardTitle>Overlay Title</CardTitle>
    <CardText>Overlay content on the image.</CardText>
  </CardImgOverlay>
</Card>
```

### Card with Links

```tsx
<Card>
  <CardBody>
    <CardTitle>Card with Links</CardTitle>
    <CardText>Some text content.</CardText>
    <CardLink href="/link1">Card link</CardLink>
    <CardLink href="/link2">Another link</CardLink>
  </CardBody>
</Card>
```

## Props

### Card

| Prop              | Type                                  | Default      | Description             |
| ----------------- | ------------------------------------- | ------------ | ----------------------- |
| `children`        | `ReactNode`                           | -            | Card content            |
| `variant`         | `'elevated' \| 'outlined' \| 'ghost'` | `'elevated'` | Card variant            |
| `color`           | `CardColor`                           | -            | Background color        |
| `horizontal`      | `boolean`                             | `false`      | Horizontal layout       |
| `interactive`     | `boolean`                             | `false`      | Make card clickable     |
| `href`            | `string`                              | -            | Link URL                |
| `onClick`         | `() => void`                          | -            | Click handler           |
| `linkAs`          | `ElementType`                         | -            | Custom link component   |
| `className`       | `string`                              | -            | Additional classes      |
| `style`           | `CSSProperties`                       | -            | Inline styles           |
| `id`              | `string`                              | -            | Element ID              |
| `aria-label`      | `string`                              | -            | Accessible label        |
| `aria-labelledby` | `string`                              | -            | ID of labelling element |

### CardHeader, CardBody, CardFooter

| Prop        | Type            | Description        |
| ----------- | --------------- | ------------------ |
| `children`  | `ReactNode`     | Content            |
| `className` | `string`        | Additional classes |
| `style`     | `CSSProperties` | Inline styles      |

### CardImage

| Prop        | Type                             | Default  | Description         |
| ----------- | -------------------------------- | -------- | ------------------- |
| `src`       | `string`                         | -        | Image source URL    |
| `alt`       | `string`                         | -        | Alt text (required) |
| `position`  | `'top' \| 'bottom' \| 'overlay'` | `'top'`  | Image position      |
| `height`    | `string \| number`               | -        | Image height        |
| `loading`   | `'lazy' \| 'eager'`              | `'lazy'` | Loading strategy    |
| `className` | `string`                         | -        | Additional classes  |
| `style`     | `CSSProperties`                  | -        | Inline styles       |

### CardTitle

| Prop        | Type            | Default | Description        |
| ----------- | --------------- | ------- | ------------------ |
| `children`  | `ReactNode`     | -       | Title content      |
| `as`        | `'h1' - 'h6'`   | `'h5'`  | Heading level      |
| `className` | `string`        | -       | Additional classes |
| `style`     | `CSSProperties` | -       | Inline styles      |

### CardText

| Prop        | Type            | Default | Description        |
| ----------- | --------------- | ------- | ------------------ |
| `children`  | `ReactNode`     | -       | Text content       |
| `muted`     | `boolean`       | `false` | Muted text style   |
| `className` | `string`        | -       | Additional classes |
| `style`     | `CSSProperties` | -       | Inline styles      |

### CardLink

| Prop        | Type            | Description        |
| ----------- | --------------- | ------------------ |
| `children`  | `ReactNode`     | Link content       |
| `href`      | `string`        | Link URL           |
| `className` | `string`        | Additional classes |
| `style`     | `CSSProperties` | Inline styles      |

### CardImgOverlay

| Prop        | Type            | Description        |
| ----------- | --------------- | ------------------ |
| `children`  | `ReactNode`     | Overlay content    |
| `className` | `string`        | Additional classes |
| `style`     | `CSSProperties` | Inline styles      |

## Accessibility

The Card component follows WCAG 2.2 AA guidelines:

- Uses semantic `<article>` element by default
- Interactive cards use `<a>` (links) or `role="button"` (clickable)
- CardTitle uses proper heading hierarchy
- CardImage requires alt text
- Keyboard accessible (Tab, Enter, Space for interactive cards)
- Supports `aria-label` and `aria-labelledby`

## Styling

The component uses Bootstrap 5 card classes:

- `.card` - Container
- `.card-header` - Header section
- `.card-body` - Body section
- `.card-footer` - Footer section
- `.card-img-top`, `.card-img-bottom`, `.card-img` - Image positions
- `.card-img-overlay` - Overlay content
- `.card-title` - Title
- `.card-text` - Text
- `.card-link` - Links
- `.text-bg-{color}` - Color variants
- `.shadow-sm` - Elevated variant
- `.border` - Outlined variant

## Related Components

- [Button](../Button/README.md) - For card actions
- [Badge](../Badge/README.md) - For card badges
- [ListGroup](../ListGroup/README.md) - For card lists
