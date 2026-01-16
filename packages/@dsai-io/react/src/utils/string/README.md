# String Utilities

Enterprise-grade string manipulation utilities with Unicode support, locale awareness, and XSS-safe operations.

## Overview

This module provides utilities for:

- Text capitalization with locale support
- String truncation with word boundary awareness
- URL-safe slug generation
- Component variant class generation

## Installation

```tsx
import { capitalize, truncate, slugify, getVariantClass } from '@dsai-io/react';
```

---

## Functions

### `capitalize`

Capitalize text with multiple modes and full locale support. Handles ASCII, Unicode, emoji, and CJK characters correctly.

**Signature:**

```tsx
function capitalize(text: string, options?: CapitalizeOptions): string;

interface CapitalizeOptions {
  mode?: 'first' | 'words' | 'sentences'; // Default: 'first'
  locale?: string | string[]; // Default: 'en-US'
  preserveAcronyms?: boolean; // Default: false
}

type CapitalizeMode = 'first' | 'words' | 'sentences';
```

**Examples:**

**Mode: `'first'` (default) - Capitalize first character only:**

```tsx
capitalize('hello world'); // "Hello world"
capitalize('HELLO WORLD'); // "HELLO WORLD" (rest unchanged)
capitalize('hello WORLD'); // "Hello WORLD"
capitalize('café münchen'); // "Café münchen"
capitalize('🎉 party time'); // "🎉 party time" (emoji preserved)
capitalize(''); // ""
```

**Mode: `'words'` - Title Case:**

```tsx
capitalize('hello world', { mode: 'words' });
// "Hello World"

capitalize('the quick brown fox', { mode: 'words' });
// "The Quick Brown Fox"

capitalize('NEW YORK CITY', { mode: 'words' });
// "New York City"

capitalize('café münchen', { mode: 'words' });
// "Café Münchën"

capitalize('hello-world test_case', { mode: 'words' });
// "Hello-World Test_Case" (preserves separators)
```

**Mode: `'sentences'` - Sentence Case:**

```tsx
capitalize('hello world. how are you?', { mode: 'sentences' });
// "Hello world. How are you?"

capitalize('first sentence! second sentence? third.', { mode: 'sentences' });
// "First sentence! Second sentence? Third."

capitalize('hello... world', { mode: 'sentences' });
// "Hello... World"
```

**Locale-Aware Capitalization:**

```tsx
// Turkish (i ↔ İ/ı)
capitalize('istanbul', { locale: 'tr' });
// "İstanbul" (Turkish uppercase I)

capitalize('istanbul', { locale: 'en' });
// "Istanbul" (English uppercase I)

// German (ß handling)
capitalize('straße', { locale: 'de' });
// "Straße" (ß preserved in German)

capitalize('straße', { locale: 'de-DE' });
// "Straße"

// Multiple locales
capitalize('café', { locale: ['fr', 'en'] });
// "Café"
```

**Preserve Acronyms:**

```tsx
capitalize('hello NASA world', {
  mode: 'words',
  preserveAcronyms: true,
});
// "Hello NASA World" (NASA unchanged)

capitalize('the FBI and CIA', {
  mode: 'words',
  preserveAcronyms: true,
});
// "The FBI And CIA"

capitalize('hello nasa world', {
  mode: 'words',
  preserveAcronyms: false,
});
// "Hello Nasa World" (default behavior)
```

**Edge Cases:**

```tsx
// Empty string
capitalize(''); // ""

// Whitespace only
capitalize('   '); // "   "

// Numbers
capitalize('123 hello'); // "123 hello"

// Special characters
capitalize('!hello'); // "!hello" (no letter to capitalize)

// Unicode
capitalize('𝒽𝑒𝓁𝓁𝑜'); // Works with Unicode

// Emoji
capitalize('👋 hello'); // "👋 hello" (emoji safe)
```

**Best Practices:**

```tsx
// User names (first character)
const displayName = capitalize(user.name);

// Headings (title case)
const heading = capitalize(article.title, { mode: 'words' });

// Paragraphs (sentence case)
const text = capitalize(paragraph, { mode: 'sentences' });

// International text (locale-aware)
const localizedText = capitalize(text, { locale: userLocale });

// Preserve brand names
const title = capitalize('using NASA technology', {
  mode: 'words',
  preserveAcronyms: true,
});
```

---

### `truncate`

Truncate text to maximum length with word boundary awareness, emoji support, and CJK character handling.

**Signature:**

```tsx
function truncate(text: string, options?: TruncateOptions): string;

interface TruncateOptions {
  maxLength?: number; // Default: 100
  ellipsis?: string; // Default: '...'
  wordBoundary?: boolean; // Default: true
  preserveWords?: boolean; // Alias for wordBoundary
  stripHtml?: boolean; // Default: false
}
```

**Examples:**

**Basic Truncation:**

```tsx
truncate('Hello world', { maxLength: 8 });
// "Hello..."

truncate('Hello world', { maxLength: 20 });
// "Hello world" (no truncation needed)

truncate('Hello world', { maxLength: 5 });
// "He..."
```

**Custom Ellipsis:**

```tsx
truncate('Hello world', {
  maxLength: 8,
  ellipsis: '…',
});
// "Hello…"

truncate('Hello world', {
  maxLength: 8,
  ellipsis: ' [more]',
});
// "Hello [more]"

truncate('Hello world', {
  maxLength: 8,
  ellipsis: '',
});
// "Hello wo" (no ellipsis)
```

**Word Boundary Awareness:**

```tsx
// With word boundary (default)
truncate('Hello beautiful world', {
  maxLength: 15,
  wordBoundary: true,
});
// "Hello..." (stops at word boundary)

// Without word boundary
truncate('Hello beautiful world', {
  maxLength: 15,
  wordBoundary: false,
});
// "Hello beauti..." (cuts mid-word)

// Preserves complete words
truncate('The quick brown fox jumps', {
  maxLength: 20,
  wordBoundary: true,
});
// "The quick brown..." (doesn't break "fox")
```

**Emoji and Unicode Support:**

```tsx
// Emoji (counts as single character)
truncate('Hello 👋 World 🌍', { maxLength: 10 });
// "Hello 👋..." (emoji preserved)

// Multiple emoji
truncate('🎉🎊🎈 Party Time! 🎁🎂', { maxLength: 12 });
// "🎉🎊🎈 Party..." (emoji counted correctly)

// CJK characters (Chinese, Japanese, Korean)
truncate('你好世界欢迎光临', { maxLength: 8 });
// "你好世界..." (CJK handled correctly)

// Mixed scripts
truncate('Hello 世界 World', { maxLength: 10 });
// "Hello 世界..."
```

**HTML Stripping:**

```tsx
// Strip HTML tags before truncating
truncate('<p>Hello <strong>world</strong></p>', {
  maxLength: 8,
  stripHtml: true,
});
// "Hello..."

// Without stripping (counts tags in length)
truncate('<p>Hello world</p>', {
  maxLength: 8,
  stripHtml: false,
});
// "<p>He..." (HTML in result)
```

**Edge Cases:**

```tsx
// Empty string
truncate(''); // ""

// Short text (no truncation)
truncate('Hi', { maxLength: 10 }); // "Hi"

// Exact length
truncate('Hello', { maxLength: 5 }); // "Hello"

// maxLength shorter than ellipsis
truncate('Hello world', { maxLength: 2 }); // "..." (just ellipsis)

// Single long word
truncate('Supercalifragilisticexpialidocious', {
  maxLength: 10,
  wordBoundary: true,
});
// "..." (no boundary found, ellipsis only)

// Whitespace
truncate('   Hello   World   ', { maxLength: 10 });
// "Hello..." (trimmed)
```

**Best Practices:**

```tsx
// Article previews
const preview = truncate(article.content, {
  maxLength: 200,
  stripHtml: true,
});

// User bios
const bio = truncate(user.bio, {
  maxLength: 150,
  wordBoundary: true,
});

// Tooltips
const tooltip = truncate(longDescription, {
  maxLength: 50,
  ellipsis: '…',
});

// Notification messages
const message = truncate(notification.text, {
  maxLength: 80,
  wordBoundary: true,
  ellipsis: ' [read more]',
});

// Card titles
function CardTitle({ title }: { title: string }) {
  return <h3 title={title}>{truncate(title, { maxLength: 40 })}</h3>;
}
```

---

### `slugify`

Convert text to URL-safe slugs with Unicode normalization, diacritic removal, and XSS protection.

**Signature:**

```tsx
function slugify(text: string, options?: SlugifyOptions): string;

interface SlugifyOptions {
  separator?: string; // Default: '-'
  lowercase?: boolean; // Default: true
  strict?: boolean; // Default: false
}
```

**Examples:**

**Basic Slugification:**

```tsx
slugify('Hello World'); // "hello-world"
slugify('Hello   World'); // "hello-world" (multiple spaces)
slugify('  Hello World  '); // "hello-world" (trimmed)
slugify('Hello-World'); // "hello-world"
```

**Custom Separator:**

```tsx
slugify('Hello World', { separator: '_' }); // "hello_world"
slugify('Hello World', { separator: '.' }); // "hello.world"
slugify('Hello World', { separator: '' }); // "helloworld"
```

**Diacritic Removal:**

```tsx
// Accented characters
slugify('Café Münchën'); // "cafe-munchen"
slugify('Crème brûlée'); // "creme-brulee"
slugify('São Paulo'); // "sao-paulo"
slugify('Beyoncé'); // "beyonce"

// Multiple diacritics
slugify('Antonín Dvořák'); // "antonin-dvorak"
slugify('François Hollande'); // "francois-hollande"
```

**Special Character Handling:**

```tsx
// Ampersand
slugify('Dolce & Gabbana'); // "dolce-and-gabbana"
slugify('Rock & Roll'); // "rock-and-roll"

// At sign
slugify('user@example.com'); // "user-at-example-com"

// Punctuation
slugify('Hello, World!'); // "hello-world"
slugify('Yes/No'); // "yes-no"
slugify('One + Two'); // "one-plus-two"
```

**Numbers and Case:**

```tsx
// Numbers preserved
slugify('ECMAScript 2024'); // "ecmascript-2024"
slugify('IPv4 vs IPv6'); // "ipv4-vs-ipv6"

// Case preservation (lowercase: false)
slugify('Hello World', { lowercase: false }); // "Hello-World"
slugify('CamelCase', { lowercase: false }); // "CamelCase"
```

**Strict Mode:**

```tsx
// Strict mode removes all non-alphanumeric except separator
slugify('Hello (World) [2024]', { strict: true });
// "hello-world-2024"

slugify('Price: $99.99', { strict: true });
// "price-99-99"

slugify('user@example.com', { strict: true });
// "user-example-com" (@ and . removed)

// Non-strict (default) keeps more characters
slugify('Hello (World)'); // "hello-world" (parentheses removed)
```

**Unicode and Emoji:**

```tsx
// Unicode characters
slugify('𝒽𝑒𝓁𝓁𝑜 𝓌𝑜𝓇𝓁𝒹'); // "hello-world"

// Emoji removed
slugify('Hello 👋 World'); // "hello-world"
slugify('🎉 Party Time 🎊'); // "party-time"

// CJK characters transliterated
slugify('你好世界'); // (depends on implementation)
```

**Edge Cases:**

```tsx
// Empty string
slugify(''); // ""

// Only special characters
slugify('!!!'); // ""

// Leading/trailing separators removed
slugify('---hello---'); // "hello"

// Multiple consecutive separators
slugify('hello-----world'); // "hello-world"

// Numbers only
slugify('123456'); // "123456"
```

**Best Practices:**

```tsx
// Blog post URLs
const url = `/blog/${slugify(post.title)}`;
// "Getting Started with React" → "/blog/getting-started-with-react"

// File names
const fileName = `${slugify(document.title)}.pdf`;
// "Annual Report 2024" → "annual-report-2024.pdf"

// CSS class names
const className = `user-${slugify(user.name)}`;
// "John Doe" → "user-john-doe"

// Database keys
const key = slugify(category.name, { separator: '_' });
// "Kitchen & Dining" → "kitchen_and_dining"

// Anchor links
function Heading({ text }: { text: string }) {
  const id = slugify(text);
  return <h2 id={id}>{text}</h2>;
}
// <Heading text="Table of Contents" /> → <h2 id="table-of-contents">

// Breadcrumb URLs
const breadcrumbUrl = segments.map(slugify).join('/');
// ["Products", "Kitchen & Dining", "Coffee Makers"]
// → "products/kitchen-and-dining/coffee-makers"
```

---

### `getVariantClass`

Generate Bootstrap-style CSS classes for component variants with automatic prefixing and validation.

**Signature:**

```tsx
function getVariantClass(
  variant: BootstrapVariant | string | undefined,
  options?: VariantClassOptions
): string;

interface VariantClassOptions {
  prefix?: string; // Default: 'text-bg'
  fallback?: string; // Default: ''
  strict?: boolean; // Default: false
}

type BootstrapVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'light'
  | 'dark'
  | 'error'
  | 'default'
  | 'outlined'
  | 'elevated';
```

**Examples:**

**Basic Usage (default prefix: `'text-bg'`):**

```tsx
getVariantClass('primary'); // "text-bg-primary"
getVariantClass('danger'); // "text-bg-danger"
getVariantClass('success'); // "text-bg-success"
getVariantClass(undefined); // ""
```

**Custom Prefix:**

```tsx
// Button variants
getVariantClass('primary', { prefix: 'btn' });
// "btn-primary"

// Card variants
getVariantClass('success', { prefix: 'card' });
// "card-success"

// Alert variants
getVariantClass('danger', { prefix: 'alert' });
// "alert-danger"

// Badge variants
getVariantClass('warning', { prefix: 'badge' });
// "badge-warning"

// No prefix
getVariantClass('info', { prefix: '' });
// "info"
```

**Fallback Values:**

```tsx
// Default behavior (no class if undefined)
getVariantClass(undefined); // ""

// With fallback
getVariantClass(undefined, { fallback: 'default' });
// "text-bg-default"

getVariantClass(undefined, {
  prefix: 'btn',
  fallback: 'secondary',
});
// "btn-secondary"
```

**Known Variants:**

```tsx
// Standard Bootstrap
getVariantClass('primary'); // ✅ "text-bg-primary"
getVariantClass('secondary'); // ✅ "text-bg-secondary"
getVariantClass('success'); // ✅ "text-bg-success"
getVariantClass('danger'); // ✅ "text-bg-danger"
getVariantClass('warning'); // ✅ "text-bg-warning"
getVariantClass('info'); // ✅ "text-bg-info"
getVariantClass('light'); // ✅ "text-bg-light"
getVariantClass('dark'); // ✅ "text-bg-dark"

// Aliases
getVariantClass('error'); // ✅ "text-bg-error"
getVariantClass('default'); // ✅ "text-bg-default"

// Material Design
getVariantClass('outlined'); // ✅ "text-bg-outlined"
getVariantClass('elevated'); // ✅ "text-bg-elevated"
```

**Strict Mode:**

```tsx
// Non-strict (default) - accepts any string
getVariantClass('custom-variant'); // "text-bg-custom-variant"
getVariantClass('my-theme'); // "text-bg-my-theme"

// Strict mode - only known variants
getVariantClass('primary', { strict: true }); // "text-bg-primary"
getVariantClass('custom', { strict: true }); // "" (unknown variant)
getVariantClass('custom', {
  strict: true,
  fallback: 'primary',
});
// "text-bg-primary" (fallback used)
```

**Component Examples:**

**Button Component:**

```tsx
function Button({ variant = 'primary', children }: ButtonProps) {
  const variantClass = getVariantClass(variant, { prefix: 'btn' });

  return (
    <button className={`btn ${variantClass}`}>
      {children}
    </button>
  );
}

<Button variant="primary">Save</Button>
// <button class="btn btn-primary">Save</button>

<Button variant="danger">Delete</Button>
// <button class="btn btn-danger">Delete</button>
```

**Card Component:**

```tsx
function Card({ variant, children }: CardProps) {
  const variantClass = getVariantClass(variant, {
    prefix: 'text-bg',
    fallback: 'light'
  });

  return (
    <div className={`card ${variantClass}`}>
      {children}
    </div>
  );
}

<Card variant="primary">Content</Card>
// <div class="card text-bg-primary">Content</div>

<Card>Content</Card>
// <div class="card text-bg-light">Content</div> (fallback)
```

**Alert Component:**

```tsx
function Alert({ variant = 'info', children }: AlertProps) {
  const variantClass = getVariantClass(variant, { prefix: 'alert' });

  return (
    <div className={`alert ${variantClass}`} role="alert">
      {children}
    </div>
  );
}

<Alert variant="success">Saved!</Alert>;
// <div class="alert alert-success" role="alert">Saved!</div>
```

**Best Practices:**

```tsx
// Use TypeScript for variant safety
type ButtonProps = {
  variant?: BootstrapVariant;
  children: ReactNode;
};

// Provide sensible fallbacks
function Component({ variant }: Props) {
  const className = getVariantClass(variant, {
    prefix: 'component',
    fallback: 'default',
  });
  // Ensures a class is always applied
}

// Use strict mode for known variants only
const variantClass = getVariantClass(userProvidedVariant, {
  prefix: 'theme',
  strict: true,
  fallback: 'primary',
});
// Prevents arbitrary class injection

// Combine with other classes
function Badge({ variant, className, children }: BadgeProps) {
  const variantClass = getVariantClass(variant, { prefix: 'badge' });
  const classes = cn('badge', variantClass, className);

  return <span className={classes}>{children}</span>;
}
```

---

## Common Patterns

### SEO-Friendly URLs

```tsx
function createPostUrl(post: Post): string {
  const slug = slugify(post.title);
  const date = post.publishedAt.toISOString().split('T')[0];
  return `/blog/${date}/${slug}`;
}

// "My First Post!" published on 2024-01-15
// → "/blog/2024-01-15/my-first-post"
```

### Text Preview Cards

```tsx
function PreviewCard({ title, content }: CardProps) {
  return (
    <div className="card">
      <h3>{capitalize(title, { mode: 'words' })}</h3>
      <p>{truncate(content, { maxLength: 150, stripHtml: true })}</p>
    </div>
  );
}
```

### Dynamic Theming

```tsx
function ThemedButton({ variant, children }: Props) {
  const themeClass = getVariantClass(variant, {
    prefix: 'theme',
    fallback: 'default',
  });

  return <button className={`btn ${themeClass}`}>{children}</button>;
}
```

### Filename Generation

```tsx
function generateFilename(title: string, extension: string): string {
  const slug = slugify(title, { separator: '_' });
  const timestamp = Date.now();
  return `${slug}_${timestamp}.${extension}`;
}

generateFilename('Annual Report 2024', 'pdf');
// "annual_report_2024_1704067200000.pdf"
```

---

## Related Documentation

- [Main Utils README](../README.md)
- [Validation Utilities](../validation/README.md)
- [React Component Library](../../README.md)

---

## License

Copyright © 2026 DSAi. All rights reserved.
