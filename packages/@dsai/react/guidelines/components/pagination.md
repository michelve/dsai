# Pagination Component Guidelines

The Pagination component provides navigation between pages of content.

## Import

```tsx
import { Pagination } from '@dsai/react';
```

## When to Use

Use Pagination when:

- Displaying large datasets in pages
- Table or list with many items
- Search results spanning multiple pages
- User needs to navigate between pages

Do not use Pagination when:

- Infinite scroll is preferred
- Few items fit on one page
- Sequential content (use Prev/Next)

## Basic Usage

```tsx
<Pagination total={100} pageSize={10} currentPage={1} onChange={setCurrentPage} />
```

## Controlled

```tsx
const [page, setPage] = useState(1);

<Pagination
  total={items.length}
  pageSize={10}
  currentPage={page}
  onChange={(newPage) => setPage(newPage)}
/>;
```

## With Page Size Selector

```tsx
<Pagination
  total={100}
  pageSize={pageSize}
  currentPage={page}
  onChange={setPage}
  showSizeChanger
  pageSizeOptions={[10, 20, 50, 100]}
  onPageSizeChange={setPageSize}
/>
```

## Compact Version

```tsx
<Pagination total={100} pageSize={10} currentPage={page} onChange={setPage} compact />;
{
  /* Shows: < 1/10 > */
}
```

## With Jump to Page

```tsx
<Pagination total={1000} pageSize={10} currentPage={page} onChange={setPage} showQuickJumper />
```

## Sizes

```tsx
<Pagination size="sm" {...props} />
<Pagination size="md" {...props} />
<Pagination size="lg" {...props} />
```

## Accessibility

```tsx
<Pagination
  aria-label="Results pagination"
  total={100}
  pageSize={10}
  currentPage={page}
  onChange={setPage}
/>
```

## Common Patterns

### Table Pagination

```tsx
<Table>...</Table>
<div style={{
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: 'var(--spacing-4)'
}}>
  <span>Showing {start}-{end} of {total}</span>
  <Pagination
    total={total}
    pageSize={pageSize}
    currentPage={page}
    onChange={setPage}
  />
</div>
```

### Search Results

```tsx
<div>
  <p>{total} results found</p>
  <ul>
    {results.map((r) => (
      <li key={r.id}>{r.title}</li>
    ))}
  </ul>
  <Pagination
    total={total}
    pageSize={20}
    currentPage={page}
    onChange={(p) => {
      setPage(p);
      window.scrollTo(0, 0);
    }}
  />
</div>
```

## Do's and Don'ts

### Do

- Show current page and total pages
- Scroll to top on page change
- Preserve page in URL when possible

### Don't

- Don't show pagination for < 10 items
- Don't use tiny page sizes
- Don't hide total count
