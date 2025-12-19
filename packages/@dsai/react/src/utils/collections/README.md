# Collections Utilities

Enterprise-grade collection manipulation utilities for arrays, sorting, memoization, and state selection.

## Overview

This module provides utilities for:

- Stable sorting with comparators
- Unique filtering
- Array chunking and pagination
- Function memoization
- Memoized selectors (reselect-like)

## Installation

```tsx
import { stableSort, uniqueBy, chunk, paginate, memoize, createSelector } from '@dsai/react';
```

---

## Sorting & Ordering

### `stableSort`

Sort arrays with guaranteed stability (preserves order of equal elements).

**Signature:**

```tsx
function stableSort<T>(array: T[], options?: StableSortOptions<T>): T[];

interface StableSortOptions<T> {
  comparator?: Comparator<T>;
  descending?: boolean;
}
```

**Examples:**

```tsx
// Basic sort
const sorted = stableSort([3, 1, 2]); // [1, 2, 3]

// Custom comparator
const users = stableSort(userList, {
  comparator: (a, b) => a.name.localeCompare(b.name),
});

// Descending
const desc = stableSort(numbers, { descending: true });

// Compose comparators
const sorted = stableSort(data, {
  comparator: composeComparators(
    (a, b) => a.priority - b.priority,
    (a, b) => a.name.localeCompare(b.name)
  ),
});
```

---

### `uniqueBy`

Filter array to unique items based on key extractor.

**Signature:**

```tsx
function uniqueBy<T>(array: T[], keyExtractor: KeyExtractor<T>, options?: UniqueByOptions): T[];
```

**Examples:**

```tsx
// Unique by ID
const unique = uniqueBy(users, (user) => user.id);

// Unique by email (case-insensitive)
const unique = uniqueBy(contacts, (contact) => contact.email.toLowerCase());

// Keep last occurrence
const unique = uniqueBy(items, (item) => item.key, {
  keepLast: true,
});
```

---

## Array Manipulation

### `chunk`

Split array into chunks of specified size.

**Signature:**

```tsx
function chunk<T>(array: T[], size: number, options?: ChunkOptions): T[][];
```

**Examples:**

```tsx
// Basic chunking
const chunks = chunk([1, 2, 3, 4, 5], 2);
// [[1, 2], [3, 4], [5]]

// Fill incomplete chunks
const chunks = chunk([1, 2, 3], 2, {
  fillValue: 0,
});
// [[1, 2], [3, 0]]

// Equal distribution
const chunks = chunkInto([1, 2, 3, 4, 5], 3);
// [[1, 2], [3, 4], [5]]
```

---

### `paginate`

Paginate array with comprehensive metadata.

**Signature:**

```tsx
function paginate<T>(items: T[], options: PaginateOptions): PaginatedResult<T>;

interface PaginatedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}
```

**Examples:**

```tsx
// Basic pagination
const result = paginate(allItems, {
  page: 1,
  pageSize: 10,
});

// With offset
const result = paginate(items, {
  page: 2,
  pageSize: 20,
  startIndex: 5,
});

// Pagination helper
const paginator = createPaginator(allItems, { pageSize: 10 });
const page1 = paginator.getPage(1);
const page2 = paginator.next();
```

---

## Memoization

### `memoize`

Cache function results with LRU eviction and TTL.

**Signature:**

```tsx
function memoize<T extends (...args: unknown[]) => unknown>(
  fn: T,
  options?: MemoizeOptions<Parameters<T>>
): MemoizedFunction<T>;

interface MemoizedFunction<T> extends Function {
  clear(): void;
  delete(...args: Parameters<T>): boolean;
  has(...args: Parameters<T>): boolean;
  size(): number;
}
```

**Examples:**

```tsx
// Basic memoization
const expensiveCalc = memoize((n: number) => {
  return /* complex calculation */;
});

// With cache limit
const cached = memoize(fetchUser, {
  maxSize: 100,
});

// With TTL
const cached = memoize(apiCall, {
  ttl: 5000, // 5 seconds
});

// Custom cache key
const cached = memoize((user, settings) => format(user, settings), {
  cacheKeyFn: (user, settings) => `${user.id}-${settings.locale}`,
});

// Cache control
cached.clear();
cached.delete(userId);
const isCached = cached.has(userId);
```

---

### `createSelector`

Create memoized derived state selector (reselect pattern).

**Signature:**

```tsx
function createSelector<S, R1, R>(
  selector1: Selector<S, R1>,
  resultFn: (r1: R1) => R,
  options?: CreateSelectorOptions<R>
): MemoizedSelector<S, R>;
```

**Examples:**

```tsx
// Single input selector
const selectTotal = createSelector(
  (state) => state.items,
  (items) => items.reduce((sum, item) => sum + item.price, 0)
);

// Multiple inputs
const selectVisibleTodos = createSelector(
  [(state) => state.todos, (state) => state.filter],
  (todos, filter) =>
    todos.filter((todo) => {
      if (filter === 'active') return !todo.completed;
      if (filter === 'completed') return todo.completed;
      return true;
    })
);

// With custom equality
const selector = createSelector(
  (state) => state.data,
  (data) => processData(data),
  { equalityFn: deepEqual }
);

// Composition
const selectUsernames = createSelector(selectActiveUsers, (users) => users.map((u) => u.name));
```

---

## Best Practices

1. **Use stableSort for consistent ordering:**

```tsx
const sorted = stableSort(items, {
  comparator: (a, b) => a.priority - b.priority,
});
```

1. **Memoize expensive computations:**

```tsx
const memoized = memoize(expensiveFunction, {
  maxSize: 100,
  ttl: 60000,
});
```

1. **Use createSelector for derived state:**

```tsx
const selectDerived = createSelector(selectInput, (input) => deriveOutput(input));
```

1. **Validate chunk size:**

```tsx
const size = Math.max(1, Math.floor(chunkSize));
const chunks = chunk(array, size);
```

---

## Performance Notes

- **stableSort**: O(n log n), preserves stability
- **memoize**: O(1) lookup, LRU eviction
- **createSelector**: Memoizes based on input equality
- All utilities are immutable (do not modify originals)

---

## Related Documentation

- [Main Utils README](../README.md)
- [Object Utilities](../object/README.md)
- [Array Utilities](../types/README.md)

---

## License

Copyright © 2024 DSAi. All rights reserved.
