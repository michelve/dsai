# Typography Component Guidelines

The Typography component provides consistent text styling.

## Import

```tsx
import { Typography } from '@dsai/react';
```

## When to Use

Use Typography when:

- Displaying headings at any level
- Rendering body text and paragraphs
- Showing captions, labels, or helper text
- Maintaining consistent text styling

## Headings

```tsx
<Typography.H1>Page Title</Typography.H1>
<Typography.H2>Section Title</Typography.H2>
<Typography.H3>Subsection Title</Typography.H3>
<Typography.H4>Card Title</Typography.H4>
<Typography.H5>Small Heading</Typography.H5>
<Typography.H6>Smallest Heading</Typography.H6>
```

## Body Text

```tsx
<Typography.Body>Regular paragraph text.</Typography.Body>
<Typography.Body size="sm">Smaller body text.</Typography.Body>
<Typography.Body size="lg">Larger body text.</Typography.Body>
```

## Other Variants

```tsx
<Typography.Lead>Lead paragraph for introductions.</Typography.Lead>
<Typography.Caption>Caption for images or tables.</Typography.Caption>
<Typography.Label>Form label text.</Typography.Label>
<Typography.Code>inline code</Typography.Code>
<Typography.Muted>Secondary, muted text.</Typography.Muted>
```

## Semantic vs Visual

Maintain heading hierarchy while adjusting visual size:

```tsx
// Correct - semantic H2, styled smaller
<Typography.H2 size="lg">Section Title</Typography.H2>

// Incorrect - skipping heading levels
<Typography.H1>Page</Typography.H1>
<Typography.H4>Section</Typography.H4>  // Should be H2
```

## Text Alignment

```tsx
<Typography.Body align="left">Left aligned</Typography.Body>
<Typography.Body align="center">Center aligned</Typography.Body>
<Typography.Body align="right">Right aligned</Typography.Body>
```

## Truncation

```tsx
<Typography.Body truncate>
  This long text will be truncated with ellipsis...
</Typography.Body>

<Typography.Body truncate lines={2}>
  This text will be truncated after two lines...
</Typography.Body>
```

## Accessibility

- Use proper heading hierarchy
- Don't skip heading levels
- Use semantic elements

```tsx
<article>
  <Typography.H1>Article Title</Typography.H1>
  <Typography.Lead>Introduction paragraph.</Typography.Lead>
  <Typography.H2>First Section</Typography.H2>
  <Typography.Body>Content...</Typography.Body>
</article>
```

## Do's and Don'ts

### Do

- Use heading hierarchy (H1 → H2 → H3)
- Use Typography for all text content
- Match visual importance to semantic level

### Don't

- Don't skip heading levels
- Don't use headings just for styling
- Don't use raw HTML text elements
