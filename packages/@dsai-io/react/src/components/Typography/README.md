# Typography

A comprehensive typography system providing semantic headings, display headings, and text components with Bootstrap 5 styling.

## Overview

The Typography system includes three main components:

- **Heading** - Semantic headings (h1-h6) with optional visual size override
- **Display** - Large, prominent headings for hero sections (display-1 to display-6)
- **Text** - Body copy, lead paragraphs, and inline text variants

## Installation

Typography is part of the `@dsai/react` package:

```tsx
import { Heading, Display, Text, Typography } from '@dsai/react';
```

## Components

### Heading

Semantic headings that map directly to HTML h1-h6 elements.

```tsx
// Basic headings
<Heading level={1}>Page Title (h1)</Heading>
<Heading level={2}>Section Title (h2)</Heading>
<Heading level={3}>Subsection (h3)</Heading>

// Visual size override - h2 semantic, h4 visual
<Heading level={2} visualSize="h4">
  Small Section Title
</Heading>

// Styled heading
<Heading level={3} color="primary" align="center" weight="light">
  Centered Primary Heading
</Heading>
```

#### Heading Props

| Prop         | Type                           | Default | Description                    |
| ------------ | ------------------------------ | ------- | ------------------------------ |
| `level`      | `1 \| 2 \| 3 \| 4 \| 5 \| 6`   | `1`     | Semantic heading level (h1-h6) |
| `visualSize` | `'h1' \| 'h2' \| ... \| 'h6'`  | -       | Override visual size           |
| `color`      | `TextColor`                    | -       | Text color                     |
| `align`      | `'start' \| 'center' \| 'end'` | -       | Text alignment                 |
| `weight`     | `FontWeight`                   | -       | Font weight                    |
| `transform`  | `TextTransform`                | -       | Text transform                 |
| `noMargin`   | `boolean`                      | `false` | Remove default margin          |
| `truncate`   | `boolean`                      | `false` | Truncate with ellipsis         |

### Display

Large display headings for hero sections and prominent titles.

```tsx
// Display sizes (1 is largest)
<Display size={1}>Hero Title</Display>
<Display size={2}>Large Section</Display>
<Display size={3}>Featured Content</Display>
<Display size={4}>Subsection</Display>
<Display size={5}>Small Display</Display>
<Display size={6}>Smallest Display</Display>

// With custom semantic level
<Display size={1} level={2}>
  Visually display-1, semantically h2
</Display>

// Styled display
<Display size={2} color="primary" align="center">
  Centered Primary Display
</Display>
```

#### Display Props

| Prop        | Type                           | Default | Description                 |
| ----------- | ------------------------------ | ------- | --------------------------- |
| `size`      | `1 \| 2 \| 3 \| 4 \| 5 \| 6`   | `1`     | Display size (1 is largest) |
| `level`     | `1 \| 2 \| 3 \| 4 \| 5 \| 6`   | Auto    | Semantic heading level      |
| `color`     | `TextColor`                    | -       | Text color                  |
| `align`     | `'start' \| 'center' \| 'end'` | -       | Text alignment              |
| `weight`    | `FontWeight`                   | -       | Font weight                 |
| `transform` | `TextTransform`                | -       | Text transform              |
| `noMargin`  | `boolean`                      | `false` | Remove default margin       |

### Text

Body copy, lead paragraphs, and inline text variants.

```tsx
// Body paragraph
<Text>Standard body text for regular content.</Text>

// Lead paragraph
<Text variant="lead">
  This is a lead paragraph that stands out from regular text.
</Text>

// Styled text
<Text color="muted" size="sm" align="center">
  Small centered muted text
</Text>

// Inline variants
<Text as="span" variant="strong">Bold text</Text>
<Text as="span" variant="em">Italic text</Text>
<Text as="span" variant="mark">Highlighted text</Text>
<Text as="span" variant="code">code snippet</Text>

// Blockquote with citation
<Text
  variant="blockquote"
  citeAuthor="Albert Einstein"
  cite="https://example.com"
>
  Imagination is more important than knowledge.
</Text>
```

#### Text Props

| Prop         | Type                           | Default  | Description            |
| ------------ | ------------------------------ | -------- | ---------------------- |
| `variant`    | `TextVariant`                  | `'body'` | Text variant           |
| `size`       | `'sm' \| 'base' \| 'lg'`       | `'base'` | Text size              |
| `as`         | `ElementType`                  | Auto     | Override HTML element  |
| `color`      | `TextColor`                    | -        | Text color             |
| `align`      | `'start' \| 'center' \| 'end'` | -        | Text alignment         |
| `weight`     | `FontWeight`                   | -        | Font weight            |
| `transform`  | `TextTransform`                | -        | Text transform         |
| `noMargin`   | `boolean`                      | `false`  | Remove default margin  |
| `truncate`   | `boolean`                      | `false`  | Single-line truncation |
| `lines`      | `number`                       | -        | Multi-line truncation  |
| `citeAuthor` | `string`                       | -        | Blockquote author      |
| `cite`       | `string`                       | -        | Blockquote source URL  |

#### Text Variants

| Variant      | Element        | Description                       |
| ------------ | -------------- | --------------------------------- |
| `body`       | `<p>`          | Default body paragraph            |
| `lead`       | `<p>`          | Lead paragraph (larger, lighter)  |
| `small`      | `<small>`      | Small/fine print text             |
| `strong`     | `<strong>`     | Bold/important text               |
| `em`         | `<em>`         | Emphasized/italic text            |
| `mark`       | `<mark>`       | Highlighted text                  |
| `del`        | `<del>`        | Deleted/strikethrough text        |
| `ins`        | `<ins>`        | Inserted/underlined text          |
| `abbr`       | `<abbr>`       | Abbreviation (with title tooltip) |
| `blockquote` | `<blockquote>` | Block quotation                   |
| `code`       | `<code>`       | Inline code                       |
| `kbd`        | `<kbd>`        | Keyboard input                    |
| `pre`        | `<pre>`        | Preformatted text                 |

## Typography Namespace

All components are available through the `Typography` namespace:

```tsx
import { Typography } from '@dsai/react';

<Typography.Heading level={1}>Title</Typography.Heading>
<Typography.Display size={2}>Hero</Typography.Display>
<Typography.Text variant="lead">Lead text</Typography.Text>
```

## Colors

Available text colors (via `color` prop):

- **Semantic**: `primary`, `secondary`, `success`, `danger`, `warning`, `info`
- **Neutral**: `light`, `dark`, `white`, `black`
- **Body**: `body`, `body-secondary`, `body-tertiary`, `muted`

## Font Weights

Available weights (via `weight` prop):

- `light` - 300
- `lighter` - Lighter than parent
- `normal` - 400
- `semibold` - 600
- `bold` - 700
- `bolder` - Bolder than parent

## Text Transforms

Available transforms (via `transform` prop):

- `lowercase` - all lowercase
- `uppercase` - ALL UPPERCASE
- `capitalize` - Capitalize Each Word
- `none` - No transformation

## Accessibility

The Typography system is designed with accessibility in mind:

- ✅ Semantic HTML elements (h1-h6, p, blockquote, etc.)
- ✅ Proper heading hierarchy support
- ✅ Visual size separate from semantic level
- ✅ Sufficient color contrast (WCAG 2.2 AA)
- ✅ Abbreviations include title attribute
- ✅ Blockquotes properly structured with cite

### Heading Hierarchy Best Practices

```tsx
// ✅ Correct - proper heading order
<Heading level={1}>Page Title</Heading>
<Heading level={2}>Section</Heading>
<Heading level={3}>Subsection</Heading>

// ✅ Correct - visual override maintains semantics
<Heading level={2} visualSize="h4">Section</Heading>

// ❌ Avoid - skipping heading levels
<Heading level={1}>Title</Heading>
<Heading level={4}>Subsection</Heading> {/* Skips h2, h3 */}
```

## Linting & Guidelines

Follow these rules to maintain accessibility and consistency across your application.

### Heading Rules

| Rule                | Guidance                                                                    |
| ------------------- | --------------------------------------------------------------------------- |
| **Single h1**       | Only one `<Heading level={1}>` per page. This is the document's main title. |
| **No skipping**     | Don't skip levels (h1 → h4). Always proceed h1 → h2 → h3 → h4.              |
| **Modal headings**  | Start at `level={2}` or lower inside modals; keep the page h1 unique.       |
| **Visual override** | Use `visualSize` to change appearance while preserving document outline.    |

### Anti-Patterns

```tsx
// ❌ Anti-pattern: Multiple h1 elements
<Heading level={1}>Main Title</Heading>
<section>
  <Heading level={1}>Section Title</Heading> {/* Should be level={2} */}
</section>

// ❌ Anti-pattern: Skipping heading levels
<Heading level={1}>Page Title</Heading>
<Heading level={4}>Subsection</Heading> {/* Missing h2, h3 */}

// ❌ Anti-pattern: h1 inside modals
<Modal>
  <Heading level={1}>Modal Title</Heading> {/* Should be level={2} or higher */}
</Modal>

// ✅ Correct: Visual override without breaking semantics
<Heading level={2} visualSize="h4">
  Looks like h4, but preserves h2 in document outline
</Heading>
```

### Color Contrast

When using text colors, ensure sufficient contrast against backgrounds:

| Color             | Min Background         | Notes                            |
| ----------------- | ---------------------- | -------------------------------- |
| `muted`           | Light backgrounds only | 4.5:1 contrast for body text     |
| `body-secondary`  | Light backgrounds      | Lower contrast, use sparingly    |
| `body-tertiary`   | Light backgrounds      | Lowest contrast, decorative only |
| `white` / `light` | Dark backgrounds only  | Inverse text                     |

### Truncation Guidelines

- Use single-line `truncate` for headings and short text
- Use `truncate` + `lines={n}` for multi-line text (card descriptions, previews)
- Always provide full text via `title` attribute when truncating important content

## Examples

### Hero Section

```tsx
<section>
  <Display size={1} align="center">
    Welcome to Our Platform
  </Display>
  <Text variant="lead" align="center" color="muted">
    Build amazing applications with our comprehensive toolkit.
  </Text>
</section>
```

### Article Content

```tsx
<article>
  <Heading level={1}>Article Title</Heading>
  <Text variant="lead">This is the introduction that gives readers a quick overview.</Text>

  <Heading level={2}>Main Section</Heading>
  <Text>
    Regular body content with{' '}
    <Text as="span" variant="strong">
      important
    </Text>
    information highlighted.
  </Text>

  <Text variant="blockquote" citeAuthor="Expert Name">
    A relevant quote from an expert in the field.
  </Text>

  <Heading level={3}>Code Example</Heading>
  <Text variant="pre">{`const greeting = "Hello, World!";
console.log(greeting);`}</Text>
</article>
```

### Card with Truncation

```tsx
<div className="card">
  <div className="card-body">
    <Heading level={4} truncate>
      Very Long Card Title That Gets Truncated
    </Heading>
    <Text truncate lines={2} color="muted">
      This is a description that spans multiple lines but gets truncated after two lines to maintain
      consistent card height.
    </Text>
  </div>
</div>
```

## Related

- [Storybook](http://localhost:4400/?path=/docs/foundation-typography) - Interactive examples
- [Bootstrap Typography](https://getbootstrap.com/docs/5.3/content/typography/) - Design reference
