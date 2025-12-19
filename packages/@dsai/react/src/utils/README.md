# DSAi Utils

Enterprise-grade utility functions for React component development. All utilities are pure functions with comprehensive TypeScript types, thorough documentation, and full test coverage.

## Overview

The utils package provides specialized implementations organized by domain:

- **Accessibility (a11y)** - ARIA attributes, focus management, screen reader support
- **Async** - Asynchronous operations, debounce, throttle
- **Browser** - Browser detection, feature detection, SSR safety
- **Color** - Color manipulation, conversion, contrast calculations
- **Date** - Date formatting, parsing, manipulation
- **DOM** - DOM manipulation, ref merging, element queries
- **DX (Developer Experience)** - Development warnings, debugging utilities
- **Forms** - Form validation, input handling
- **Keyboard** - Keyboard event detection, key matching
- **Layout** - Layout calculations, positioning
- **Misc** - Miscellaneous utilities, event helpers
- **Motion** - Animation utilities, timing functions
- **Number** - Number formatting, clamping, calculations
- **Object** - Object manipulation, deep merging
- **Platform** - Platform detection (iOS, Android, macOS, Windows)
- **Responsive** - Responsive design utilities, breakpoint matching
- **Safety** - Input sanitization, XSS prevention
- **String** - String manipulation, capitalization, truncation
- **Telemetry** - Analytics tracking, event logging
- **Timing** - Timing utilities, delays, intervals
- **Types** - Type guards, type utilities, shared types
- **Validation** - URL validation, email validation, safe href checking

## Installation

```bash
npm install @dsai/react
```

## Usage

```tsx
import { cn, generateId, isBrowser } from '@dsai/react';
```

---

## Accessibility (a11y)

Utilities for building WCAG 2.2 AA compliant interfaces.

### `announceToScreenReader`

Send messages to screen readers via ARIA live regions.

```tsx
import { announceToScreenReader } from '@dsai/react';

// Polite announcement (default)
const cleanup = announceToScreenReader('Item saved successfully');

// Assertive announcement
const cleanup = announceToScreenReader('Critical error occurred', {
  assertive: true,
});
```

**Options:**

- `politeness`: `'polite' | 'assertive'` - Announcement politeness level
- `assertive`: `boolean` - Convenience alias for politeness: 'assertive'
- `id`: `string` - Unique ID for live region element
- `timeoutMs`: `number` - Duration before clearing announcement (default: 2000ms)

### `buildAriaLabel`

Build comprehensive ARIA label attributes from multiple sources.

```tsx
import { buildAriaLabel } from '@dsai/react';

// Basic label
buildAriaLabel({ label: 'Submit form' });
// => { 'aria-label': 'Submit form' }

// Label by reference
buildAriaLabel({ labelledBy: 'form-title' });
// => { 'aria-labelledby': 'form-title' }

// Multiple IDs
buildAriaLabel({
  labelledBy: 'dialog-title',
  describedBy: ['dialog-desc', 'dialog-help'],
});
// => {
//   'aria-labelledby': 'dialog-title',
//   'aria-describedby': 'dialog-desc dialog-help'
// }
```

### `combineAriaDescriptions`

Merge multiple `aria-describedby` ID references.

```tsx
import { combineAriaDescriptions } from '@dsai/react';

combineAriaDescriptions('help-text', 'error-message');
// => 'help-text error-message'

combineAriaDescriptions(['id1', 'id2', undefined, 'id3', 'id1']);
// => 'id1 id2 id3' (deduplicated)
```

### `generateId`

SSR-safe, deterministic ID generator.

```tsx
import { generateId } from '@dsai/react';

const inputId = generateId('input'); // => 'input-1'
const buttonId = generateId('button'); // => 'button-2'
```

### `focusableSelectors`

CSS selectors for focusable elements.

```tsx
import { focusableSelectors, focusableSelectorString } from '@dsai/react';

// Array of selectors
const selectors = focusableSelectors;

// Combined string for querySelectorAll
const allFocusable = document.querySelectorAll(focusableSelectorString);
```

### `trapFocus`

Trap focus within a container element.

```tsx
import { trapFocus } from '@dsai/react';

const cleanup = trapFocus(modalElement, {
  initialFocus: firstInput,
  returnFocus: triggerButton,
});
```

---

## Keyboard

Utilities for keyboard event handling.

### `isEnterKey`

Detect Enter key press with IME composition safety.

```tsx
import { isEnterKey } from '@dsai/react';

<input
  onKeyDown={(e) => {
    if (isEnterKey(e)) {
      handleSubmit();
    }
  }}
/>;
```

### `isEscapeKey`

Detect Escape key press with IME composition safety.

```tsx
import { isEscapeKey } from '@dsai/react';

<div
  onKeyDown={(e) => {
    if (isEscapeKey(e)) {
      closeModal();
    }
  }}
/>;
```

---

## Validation

Utilities for URL and input validation with XSS protection.

### `isSafeHref`

Validate that a URL href is safe to use.

```tsx
import { isSafeHref } from '@dsai/react';

// Safe URLs
isSafeHref('https://example.com'); // true
isSafeHref('/about'); // true
isSafeHref('mailto:test@example.com'); // true

// Blocked protocols
isSafeHref('javascript:alert(1)'); // false
isSafeHref('data:text/html,...'); // false
isSafeHref('vbscript:msgbox(1)'); // false

// Strict mode
isSafeHref(undefined, { undefinedBehavior: 'unsafe' }); // false
```

**Blocked Protocols:**

- `javascript:`
- `data:`
- `vbscript:`
- `file:`
- `about:blank`
- `text/html`

### `isValidEmail`

Validate email address format.

```tsx
import { isValidEmail } from '@dsai/react';

isValidEmail('user@example.com'); // true
isValidEmail('invalid.email'); // false
```

### `isValidUrl`

Validate URL format and structure.

```tsx
import { isValidUrl } from '@dsai/react';

isValidUrl('https://example.com'); // true
isValidUrl('not-a-url'); // false
```

---

## String

Utilities for string manipulation and formatting.

### `capitalize`

Text capitalization with locale support.

```tsx
import { capitalize } from '@dsai/react';

// First character only (default)
capitalize('hello world');
// => "Hello world"

// Title case (all words)
capitalize('hello world', { mode: 'words' });
// => "Hello World"

// Sentences
capitalize('hello. world. foo.', { mode: 'sentences' });
// => "Hello. World. Foo."

// Locale-aware (Turkish)
capitalize('istanbul', { locale: 'tr' });
// => "İstanbul" (dotted capital I)
```

**Modes:**

- `'first'` - Capitalize only first character (default)
- `'words'` - Capitalize first character of each word (title case)
- `'sentences'` - Capitalize first character of each sentence

### `truncate`

Text truncation with word boundary awareness.

```tsx
import { truncate } from '@dsai/react';

// Basic truncation
truncate('Hello, World!', { maxLength: 8 });
// => "Hello..."

// Custom ellipsis
truncate('Hello, World!', {
  maxLength: 8,
  ellipsis: '…',
});
// => "Hello, …"

// Word boundary respect
truncate('Hello, World!', {
  maxLength: 8,
  wordBoundary: true,
});
// => "Hello..."

// Emoji support
truncate('Hello 👋 World 🌍', { maxLength: 10 });
// => "Hello 👋..."
```

**Options:**

- `maxLength`: Maximum string length (default: 80)
- `ellipsis`: Ellipsis string (default: '...')
- `wordBoundary`: Respect word boundaries (default: false)

### `slugify`

Convert strings to URL-safe slugs.

```tsx
import { slugify } from '@dsai/react';

slugify('Hello World!');
// => "hello-world"

slugify('Enterprise React Components');
// => "enterprise-react-components"
```

### `getVariantClass`

Generate Bootstrap variant class names.

```tsx
import { getVariantClass } from '@dsai/react';

getVariantClass('primary', 'btn');
// => "btn-primary"

getVariantClass('success', 'alert');
// => "alert-success"
```

---

## Number

Utilities for number formatting and manipulation.

### `clamp`

Constrain a number to a min/max range.

```tsx
import { clamp } from '@dsai/react';

clamp(10, 0, 5); // => 5
clamp(-5, 0, 10); // => 0
clamp(7, 0, 10); // => 7
```

### `formatNumber`

Locale-aware number formatting with Intl.NumberFormat.

```tsx
import { formatNumber } from '@dsai/react';

// Basic formatting
formatNumber(1234567.89);
// => "1,234,567.89" (en-US)

// Compact notation
formatNumber(1234567, { notation: 'compact' });
// => "1.2M"

// Currency
formatNumber(99.99, {
  style: 'currency',
  currency: 'USD',
});
// => "$99.99"

// Percentage
formatNumber(0.759, { style: 'percent' });
// => "76%"

// Custom locale
formatNumber(1234567.89, { locale: 'de-DE' });
// => "1.234.567,89"
```

**Features:**

- Intl.NumberFormat with SSR-safe fallbacks
- Formatter caching for performance
- Compact notation (1K, 1.2M, 1.5B)
- Scientific and engineering notation
- Locale-specific grouping and decimal separators

### `formatCurrency`

Format currency values with locale support.

```tsx
import { formatCurrency } from '@dsai/react';

formatCurrency(1234.56, 'USD');
// => "$1,234.56"

formatCurrency(1234.56, 'EUR', 'de-DE');
// => "1.234,56 €"
```

---

## Types

Type guards and type utilities.

### `isExternalUrl`

Check if a URL is an external link.

```tsx
import { isExternalUrl } from '@dsai/react';

isExternalUrl('https://google.com'); // true
isExternalUrl('mailto:test@example.com'); // true
isExternalUrl('/about'); // false
isExternalUrl('#section'); // false
```

**External Protocols:**

- `http://`
- `https://`
- `ftp://`
- `ftps://`
- `mailto:`
- `tel:`

---

## DOM

Utilities for DOM manipulation and React refs.

### `mergeRefs`

Safely compose multiple React refs into a single callback.

```tsx
import { mergeRefs } from '@dsai/react';
import { forwardRef, useRef } from 'react';

const Component = forwardRef((props, ref) => {
  const localRef = useRef();
  return <div ref={mergeRefs(ref, localRef)} />;
});

// Array signature
const merged = mergeRefs([ref1, ref2, ref3]);
```

**Features:**

- Supports both function refs and mutable object refs
- Handles null/undefined refs gracefully
- Development mode warnings for failed assignments
- Both variadic and array signatures

---

## Misc

Miscellaneous utilities and event helpers.

### `getSafeInputProps`

Filter input props to safe attributes only (XSS prevention).

```tsx
import { getSafeInputProps } from '@dsai/react';

const safeProps = getSafeInputProps(props);
// Blocks: onLoad, onError, onAbort, etc.
// Allows: onChange, onClick, onFocus, aria-*, data-*, etc.
```

**Security:**

- Blocks dangerous event handlers (onLoad, onError, etc.)
- Allows standard HTML attributes
- Allows ARIA attributes
- Allows data attributes
- Prevents XSS through prop spreading

### `ClearIcon`

SVG icon component for clear/close buttons.

```tsx
import { ClearIcon } from '@dsai/react';

<button>
  <ClearIcon />
</button>;
```

---

## Browser

Browser detection and feature detection utilities.

### `isBrowser`

Check if code is running in a browser environment.

```tsx
import { isBrowser } from '@dsai/react';

if (isBrowser) {
  // Safe to use window, document, etc.
  window.localStorage.setItem('key', 'value');
}
```

**Use Cases:**

- SSR safety checks
- Conditional browser-only code
- Feature detection fallbacks

---

## General Utilities

### `cn` (className merger)

Combine class names conditionally.

```tsx
import { cn } from '@dsai/react';

cn('btn', isActive && 'btn-active', size === 'lg' && 'btn-lg');
// => 'btn btn-active btn-lg' or 'btn' depending on conditions

cn('base', false && 'never', undefined, null, 'always');
// => 'base always'
```

**Features:**

- Filters falsy values
- Supports conditional classes
- TypeScript-safe
- Similar to clsx/classnames

---

## Design Principles

All utilities follow these enterprise-grade principles:

### 1. Type Safety

- Full TypeScript types with strict mode
- Generic types where applicable
- Comprehensive type guards

### 2. Performance

- Memoization for expensive operations
- Caching for repeated computations
- Minimal runtime overhead

### 3. Security

- XSS prevention (href validation, prop whitelisting)
- Input sanitization
- No dangerouslySetInnerHTML

### 4. Accessibility

- WCAG 2.2 AA compliance
- ARIA attribute support
- Screen reader compatibility

### 5. SSR Safety

- Browser detection guards
- SSR-safe ID generation
- Graceful degradation

### 6. Testing

- Full unit test coverage
- Integration tests where applicable
- Edge case handling

### 7. Documentation

- JSDoc comments with examples
- TypeScript types as documentation
- README with usage patterns

---

## Related Packages

- [@DSAi/tokens](../../../tokens/README.md) - Design tokens (colors, spacing, typography)
- [@DSAi/React](../../README.md) - React component library

---

## Contributing

When adding new utilities:

1. Place in appropriate category directory
2. Add comprehensive JSDoc comments with examples
3. Export from category index.ts
4. Export from main utils index.ts
5. Add unit tests
6. Update this README with usage examples

---

## License

Copyright © 2026 DSAi. All rights reserved.
