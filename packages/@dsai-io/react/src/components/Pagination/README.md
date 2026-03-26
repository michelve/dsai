# Pagination

An accessible pagination component built with Bootstrap 5 styling. Supports controlled and uncontrolled modes, customizable boundary/sibling counts, and comprehensive navigation buttons.

## Features

- 📄 Page-based navigation
- 🔢 Smart ellipsis rendering (boundary/sibling algorithm)
- ⬅️➡️ First/Last/Previous/Next buttons
- 📏 Multiple sizes (sm, md, lg)
- ↔️ Alignment options (start, center, end)
- 🎛️ Controlled & uncontrolled modes
- ♿ WCAG 2.2 AA compliant
- 🛡️ XSS protection

## Installation

```bash
npm install @dsai-io/react
```

## Usage

### Basic Pagination

```tsx
import { Pagination } from '@dsai-io/react';

function Example() {
  return <Pagination count={10} />;
}
```

### Controlled Pagination

```tsx
import { useState } from 'react';
import { Pagination } from '@dsai-io/react';

function Example() {
  const [page, setPage] = useState(1);

  return <Pagination count={10} page={page} onChange={(newPage) => setPage(newPage)} />;
}
```

### Uncontrolled with Default Page

```tsx
<Pagination count={10} defaultPage={5} onChange={(page) => console.log('Page:', page)} />
```

### With First/Last Buttons

```tsx
<Pagination count={10} showFirstButton showLastButton />
```

### Without Previous/Next Buttons

```tsx
<Pagination count={10} hidePrevButton hideNextButton />
```

### Size Variants

```tsx
// Small
<Pagination count={10} size="sm" />

// Default (medium)
<Pagination count={10} size="md" />

// Large
<Pagination count={10} size="lg" />
```

### Alignment

```tsx
// Start (default)
<Pagination count={10} alignment="start" />

// Center
<Pagination count={10} alignment="center" />

// End
<Pagination count={10} alignment="end" />
```

### Boundary and Sibling Counts

Control how many page buttons appear at the boundaries and around the current page:

```tsx
// Default: 1 boundary, 1 sibling
// Shows: [1] ... [4] [5] [6] ... [10] when on page 5
<Pagination count={10} page={5} />

// More boundary pages
// Shows: [1] [2] ... [4] [5] [6] ... [9] [10] when on page 5
<Pagination count={10} page={5} boundaryCount={2} />

// More siblings around current page
// Shows: [1] ... [3] [4] [5] [6] [7] ... [10] when on page 5
<Pagination count={10} page={5} siblingCount={2} />
```

### Disabled State

```tsx
<Pagination count={10} disabled />
```

### Custom Labels

```tsx
<Pagination
  count={10}
  previousLabel="Go back"
  nextLabel="Go forward"
  firstLabel="Jump to start"
  lastLabel="Jump to end"
  getPageAriaLabel={(page) => `Navigate to page ${page} of 10`}
/>
```

### Custom Button Content

```tsx
<Pagination
  count={10}
  previousContent={<span>←</span>}
  nextContent={<span>→</span>}
  firstContent={<span>⏮</span>}
  lastContent={<span>⏭</span>}
/>
```

### Custom ARIA Label

```tsx
<Pagination count={10} aria-label="Search results pagination" />
```

If you render multiple paginations on the same view, provide a descriptive `aria-label` for each (e.g., "Orders pagination" vs. "Invoices pagination"). When omitted, a unique label is auto-generated to keep landmarks distinct.

## Props

| Prop               | Type                           | Default                     | Description                          |
| ------------------ | ------------------------------ | --------------------------- | ------------------------------------ |
| `count`            | `number`                       | **required**                | Total number of pages                |
| `page`             | `number`                       | -                           | Current page (controlled mode)       |
| `defaultPage`      | `number`                       | `1`                         | Initial page (uncontrolled mode)     |
| `onChange`         | `(page: number) => void`       | -                           | Called when page changes             |
| `disabled`         | `boolean`                      | `false`                     | Disable all pagination items         |
| `size`             | `'sm' \| 'md' \| 'lg'`         | `'md'`                      | Size variant                         |
| `alignment`        | `'start' \| 'center' \| 'end'` | `'start'`                   | Horizontal alignment                 |
| `boundaryCount`    | `number`                       | `1`                         | Pages shown at start and end         |
| `siblingCount`     | `number`                       | `1`                         | Pages shown around current page      |
| `showFirstButton`  | `boolean`                      | `false`                     | Show first page button               |
| `showLastButton`   | `boolean`                      | `false`                     | Show last page button                |
| `hidePrevButton`   | `boolean`                      | `false`                     | Hide previous button                 |
| `hideNextButton`   | `boolean`                      | `false`                     | Hide next button                     |
| `previousLabel`    | `string`                       | `'Go to previous page'`     | ARIA label for previous button       |
| `nextLabel`        | `string`                       | `'Go to next page'`         | ARIA label for next button           |
| `firstLabel`       | `string`                       | `'Go to first page'`        | ARIA label for first button          |
| `lastLabel`        | `string`                       | `'Go to last page'`         | ARIA label for last button           |
| `getPageAriaLabel` | `(page: number) => string`     | -                           | Custom function for page ARIA labels |
| `previousContent`  | `ReactNode`                    | `'‹'`                       | Content for previous button          |
| `nextContent`      | `ReactNode`                    | `'›'`                       | Content for next button              |
| `firstContent`     | `ReactNode`                    | `'«'`                       | Content for first button             |
| `lastContent`      | `ReactNode`                    | `'»'`                       | Content for last button              |
| `className`        | `string`                       | -                           | Additional CSS classes               |
| `style`            | `CSSProperties`                | -                           | Inline styles                        |
| `id`               | `string`                       | -                           | HTML id attribute                    |
| `aria-label`       | `string`                       | Auto-generated unique label | ARIA label for navigation landmark   |

## Accessibility

### Keyboard Navigation

- **Tab**: Navigate between pagination buttons
- **Enter/Space**: Activate focused button
- **ArrowLeft/ArrowRight**: Move focus between pagination buttons (wraps around)
- Disabled buttons are excluded from tab order and arrow key navigation

### Screen Reader Support

- Navigation landmark with descriptive `aria-label`
- Each page button has `aria-label` describing its action
- Current page uses `aria-current="page"` on a focusable `<button>`
- Disabled buttons use `aria-disabled="true"`
- Ellipsis items show "Pages skipped" text for screen readers

### WCAG 2.2 AA Compliance

- ✅ Proper use of semantic HTML (`<nav>`, `<ul>`, `<li>`, `<button>`)
- ✅ Visible focus indicators
- ✅ Sufficient color contrast
- ✅ Descriptive accessible names for all interactive elements
- ✅ Clear state indication (active, disabled)

## Bootstrap Classes

The component uses these Bootstrap 5 classes:

- `.pagination` - Main pagination list
- `.pagination-sm`, `.pagination-lg` - Size variants
- `.page-item` - List item wrapper
- `.page-link` - Clickable/interactive element
- `.active` - Current page indicator
- `.disabled` - Disabled state
- `.justify-content-*` - Alignment utilities

## Examples

### With Data Table

```tsx
function DataTable() {
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const totalItems = 150;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div>
      <table>{/* Table content */}</table>
      <Pagination
        count={totalPages}
        page={page}
        onChange={setPage}
        alignment="center"
        showFirstButton
        showLastButton
      />
    </div>
  );
}
```

### Search Results

```tsx
function SearchResults({ totalResults, resultsPerPage }) {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(totalResults / resultsPerPage);

  return (
    <div>
      <p>
        Showing {(page - 1) * resultsPerPage + 1}-{Math.min(page * resultsPerPage, totalResults)} of{' '}
        {totalResults} results
      </p>
      <Pagination
        count={totalPages}
        page={page}
        onChange={setPage}
        aria-label="Search results pagination"
        size="sm"
      />
    </div>
  );
}
```

### URL-Synced Pagination

```tsx
import { useSearchParams } from 'react-router-dom';

function URLPagination({ totalPages }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1', 10);

  const handleChange = (newPage) => {
    setSearchParams({ page: newPage.toString() });
  };

  return <Pagination count={totalPages} page={page} onChange={handleChange} alignment="center" />;
}
```

## Security

- All custom content (labels, content props) is escaped by React
- No use of `dangerouslySetInnerHTML`
- Safe handling of numeric props (clamping, NaN/Infinity handling)
- Prototype pollution protection via `safeLookup()` with `Reflect.get()` for dynamic map access

## Performance

- Uses `React.memo` for pagination items
- Memoized class name computation
- Efficient pagination algorithm
- Minimal re-renders with stable callbacks
