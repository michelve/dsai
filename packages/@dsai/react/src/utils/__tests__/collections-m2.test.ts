/**
 * @file M2.5 Collections utilities test suite
 *
 * Tests for:
 * - stableSort, sortBy, composeComparators
 * - uniqueBy, uniqueByKey
 * - chunk, chunkInto
 * - paginate, createPaginator, getPageForIndex
 * - memoize, memoizeMethod
 * - createSelector, createSelectorFromArray
 * - shallowEqual, strictEqual, deepEqual
 */

import {
  chunk,
  chunkInto,
  composeComparators,
  createPaginator,
  createSelector,
  createSelectorFromArray,
  deepEqual,
  getPageForIndex,
  memoize,
  paginate,
  shallowEqual,
  sortBy,
  stableSort,
  strictEqual,
  uniqueBy,
  uniqueByKey,
} from '../collections';

// =============================================================================
// stableSort tests
// =============================================================================

describe('stableSort', () => {
  describe('basic functionality', () => {
    it('should sort numbers in ascending order by default', () => {
      const result = stableSort([3, 1, 4, 1, 5, 9, 2, 6]);
      expect(result).toEqual([1, 1, 2, 3, 4, 5, 6, 9]);
    });

    it('should sort strings alphabetically by default', () => {
      const result = stableSort(['banana', 'apple', 'cherry']);
      expect(result).toEqual(['apple', 'banana', 'cherry']);
    });

    it('should not mutate the original array', () => {
      const original = [3, 1, 2];
      const result = stableSort(original);
      expect(original).toEqual([3, 1, 2]);
      expect(result).not.toBe(original);
    });

    it('should handle empty arrays', () => {
      expect(stableSort([])).toEqual([]);
    });

    it('should handle single-element arrays', () => {
      expect(stableSort([42])).toEqual([42]);
    });
  });

  describe('stability', () => {
    it('should preserve order of equal elements', () => {
      const items = [
        { name: 'Alice', group: 'A' },
        { name: 'Bob', group: 'B' },
        { name: 'Charlie', group: 'A' },
        { name: 'Diana', group: 'B' },
      ];

      const result = stableSort(items, {
        comparator: (a, b) => a.group.localeCompare(b.group),
      });

      // Within group A, Alice should come before Charlie (original order)
      expect(result[0].name).toBe('Alice');
      expect(result[1].name).toBe('Charlie');
      // Within group B, Bob should come before Diana (original order)
      expect(result[2].name).toBe('Bob');
      expect(result[3].name).toBe('Diana');
    });
  });

  describe('custom comparator', () => {
    it('should sort with custom comparator', () => {
      const result = stableSort([1, 2, 3, 4, 5], {
        comparator: (a, b) => b - a, // Descending
      });
      expect(result).toEqual([5, 4, 3, 2, 1]);
    });

    it('should sort objects by property', () => {
      const users = [
        { name: 'Alice', age: 30 },
        { name: 'Bob', age: 25 },
        { name: 'Charlie', age: 35 },
      ];

      const result = stableSort(users, {
        comparator: (a, b) => a.age - b.age,
      });

      expect(result.map((u) => u.name)).toEqual(['Bob', 'Alice', 'Charlie']);
    });
  });

  describe('descending option', () => {
    it('should sort in descending order', () => {
      const result = stableSort([1, 3, 2], { descending: true });
      expect(result).toEqual([3, 2, 1]);
    });
  });

  describe('edge cases', () => {
    it('should handle null values', () => {
      const result = stableSort([3, null, 1, null, 2]);
      expect(result).toEqual([null, null, 1, 2, 3]);
    });

    it('should handle undefined values', () => {
      const result = stableSort([3, undefined, 1]);
      expect(result).toEqual([undefined, 1, 3]);
    });

    it('should handle NaN values', () => {
      const result = stableSort([3, NaN, 1, NaN]);
      expect(result[0]).toBe(1);
      expect(result[1]).toBe(3);
      expect(Number.isNaN(result[2])).toBe(true);
      expect(Number.isNaN(result[3])).toBe(true);
    });

    it('should handle dates', () => {
      const d1 = new Date('2023-01-01');
      const d2 = new Date('2022-01-01');
      const d3 = new Date('2024-01-01');
      const result = stableSort([d1, d2, d3]);
      expect(result).toEqual([d2, d1, d3]);
    });

    it('should handle booleans', () => {
      const result = stableSort([true, false, true, false]);
      expect(result).toEqual([false, false, true, true]);
    });

    it('should throw for non-array input', () => {
      expect(() => stableSort('not an array' as unknown as unknown[])).toThrow(
        'stableSort: Expected an array'
      );
    });
  });
});

describe('sortBy', () => {
  it('should create a comparator from key extractor', () => {
    const users = [
      { name: 'Alice', age: 30 },
      { name: 'Bob', age: 25 },
    ];

    const result = stableSort(users, {
      comparator: sortBy((u) => u.age),
    });

    expect(result[0].name).toBe('Bob');
    expect(result[1].name).toBe('Alice');
  });
});

describe('composeComparators', () => {
  it('should combine multiple comparators with priority', () => {
    const items = [
      { group: 'A', order: 2 },
      { group: 'B', order: 1 },
      { group: 'A', order: 1 },
      { group: 'B', order: 2 },
    ];

    const result = stableSort(items, {
      comparator: composeComparators([sortBy((i) => i.group), sortBy((i) => i.order)]),
    });

    expect(result).toEqual([
      { group: 'A', order: 1 },
      { group: 'A', order: 2 },
      { group: 'B', order: 1 },
      { group: 'B', order: 2 },
    ]);
  });
});

// =============================================================================
// uniqueBy tests
// =============================================================================

describe('uniqueBy', () => {
  describe('basic functionality', () => {
    it('should return unique items by key', () => {
      const users = [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
        { id: 1, name: 'Alice Clone' },
      ];

      const result = uniqueBy(users, (u) => u.id);
      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('Alice');
      expect(result[1].name).toBe('Bob');
    });

    it('should work with primitive arrays', () => {
      const numbers = [1, 2, 2, 3, 3, 3];
      const result = uniqueBy(numbers, (n) => n);
      expect(result).toEqual([1, 2, 3]);
    });

    it('should not mutate the original array', () => {
      const original = [1, 1, 2];
      const result = uniqueBy(original, (n) => n);
      expect(original).toEqual([1, 1, 2]);
      expect(result).not.toBe(original);
    });

    it('should handle empty arrays', () => {
      expect(uniqueBy([], (x) => x)).toEqual([]);
    });
  });

  describe('keepStrategy option', () => {
    it('should keep first occurrence by default', () => {
      const items = [
        { id: 1, value: 'first' },
        { id: 1, value: 'second' },
      ];

      const result = uniqueBy(items, (i) => i.id);
      expect(result[0].value).toBe('first');
    });

    it('should keep last occurrence when specified', () => {
      const items = [
        { id: 1, value: 'first' },
        { id: 1, value: 'second' },
      ];

      const result = uniqueBy(items, (i) => i.id, { keepStrategy: 'last' });
      expect(result[0].value).toBe('second');
    });
  });

  describe('computed keys', () => {
    it('should work with computed keys', () => {
      const items = ['Apple', 'apple', 'BANANA', 'banana'];
      const result = uniqueBy(items, (s) => s.toLowerCase());
      expect(result).toEqual(['Apple', 'BANANA']);
    });
  });

  describe('advanced options', () => {
    it('should keep last occurrence with keepStrategy', () => {
      const items = [
        { id: 1, value: 'first' },
        { id: 2, value: 'middle' },
        { id: 1, value: 'second' },
      ];

      const result = uniqueBy(items, (i) => i.id, { keepStrategy: 'last' });
      expect(result).toEqual([
        { id: 2, value: 'middle' },
        { id: 1, value: 'second' },
      ]);
    });

    it('should use keySerializer for non-primitive keys', () => {
      const keyA = { id: 'a' };
      const keyB = { id: 'b' };
      const items = [
        { key: keyA, value: 1 },
        { key: keyB, value: 2 },
        { key: { id: 'a' }, value: 3 },
      ];

      const result = uniqueBy(
        items,
        (i) => i.key,
        { keySerializer: (k: any) => k?.id ?? String(k) }
      );

      expect(result).toEqual([
        { key: keyA, value: 1 },
        { key: keyB, value: 2 },
      ]);
    });
  });

  describe('error handling', () => {
    it('should throw for non-array input', () => {
      expect(() => uniqueBy('not an array' as unknown as unknown[], (x) => x)).toThrow(
        'uniqueBy: Expected an array'
      );
    });

    it('should throw for non-function keyFn', () => {
      expect(() =>
        uniqueBy([1, 2, 3], 'not a function' as unknown as (x: number) => number)
      ).toThrow('uniqueBy: Expected keyFn to be a function');
    });
  });
});

describe('uniqueByKey', () => {
  it('should extract unique items by property key', () => {
    const users = [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
      { id: 1, name: 'Alice Clone' },
    ];

    const result = uniqueByKey(users, 'id');
    expect(result).toHaveLength(2);
    expect(result[0].name).toBe('Alice');
  });
});

// =============================================================================
// chunk tests
// =============================================================================

describe('chunk', () => {
  describe('basic functionality', () => {
    it('should split array into chunks of specified size', () => {
      const result = chunk([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 3);
      expect(result).toEqual([[1, 2, 3], [4, 5, 6], [7, 8, 9], [10]]);
    });

    it('should handle exact division', () => {
      const result = chunk([1, 2, 3, 4], 2);
      expect(result).toEqual([
        [1, 2],
        [3, 4],
      ]);
    });

    it('should not mutate the original array', () => {
      const original = [1, 2, 3];
      const result = chunk(original, 2);
      expect(original).toEqual([1, 2, 3]);
      expect(result[0]).not.toBe(original);
    });

    it('should handle empty arrays', () => {
      expect(chunk([], 5)).toEqual([]);
    });

    it('should handle chunk size larger than array', () => {
      expect(chunk([1, 2], 5)).toEqual([[1, 2]]);
    });
  });

  describe('padding option', () => {
    it('should pad last chunk when specified', () => {
      const result = chunk([1, 2, 3, 4, 5], 3, { padLastChunk: true });
      expect(result).toEqual([
        [1, 2, 3],
        [4, 5, undefined],
      ]);
    });

    it('should use custom pad value', () => {
      const result = chunk([1, 2, 3, 4, 5], 3, {
        padLastChunk: true,
        padValue: 0,
      });
      expect(result).toEqual([
        [1, 2, 3],
        [4, 5, 0],
      ]);
    });
  });

  describe('error handling', () => {
    it('should throw for non-array input', () => {
      expect(() => chunk('not an array' as unknown as unknown[], 2)).toThrow(
        'chunk: Expected an array'
      );
    });

    it('should throw for non-positive size', () => {
      expect(() => chunk([1, 2, 3], 0)).toThrow('chunk: Size must be a positive integer');
      expect(() => chunk([1, 2, 3], -1)).toThrow('chunk: Size must be a positive integer');
    });

    it('should throw for non-integer size', () => {
      expect(() => chunk([1, 2, 3], 2.5)).toThrow('chunk: Size must be a positive integer');
    });
  });
});

describe('chunkInto', () => {
  it('should split array into specified number of chunks', () => {
    const result = chunkInto([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 3);
    expect(result).toHaveLength(3);
    expect(result[0]).toHaveLength(4); // First chunk gets extra
    expect(result[1]).toHaveLength(3);
    expect(result[2]).toHaveLength(3);
  });

  it('should handle even division', () => {
    const result = chunkInto([1, 2, 3, 4, 5, 6], 3);
    expect(result).toEqual([
      [1, 2],
      [3, 4],
      [5, 6],
    ]);
  });

  it('should handle count >= array length', () => {
    const result = chunkInto([1, 2, 3], 5);
    expect(result).toEqual([[1], [2], [3]]);
  });

  it('should handle empty arrays', () => {
    expect(chunkInto([], 3)).toEqual([]);
  });

  it('should throw for non-positive count', () => {
    expect(() => chunkInto([1, 2, 3], 0)).toThrow('chunkInto: Count must be a positive integer');
  });
});

// =============================================================================
// paginate tests
// =============================================================================

describe('paginate', () => {
  const testData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  describe('basic functionality', () => {
    it('should return paginated result with correct items', () => {
      const result = paginate(testData, { pageSize: 3, page: 1 });
      expect(result.items).toEqual([1, 2, 3]);
      expect(result.totalItems).toBe(10);
      expect(result.totalPages).toBe(4);
      expect(result.currentPage).toBe(1);
    });

    it('should return correct page', () => {
      const result = paginate(testData, { pageSize: 3, page: 2 });
      expect(result.items).toEqual([4, 5, 6]);
      expect(result.currentPage).toBe(2);
    });

    it('should handle last page with fewer items', () => {
      const result = paginate(testData, { pageSize: 3, page: 4 });
      expect(result.items).toEqual([10]);
      expect(result.isLastPage).toBe(true);
    });
  });

  describe('navigation flags', () => {
    it('should set hasNextPage correctly', () => {
      expect(paginate(testData, { pageSize: 3, page: 1 }).hasNextPage).toBe(true);
      expect(paginate(testData, { pageSize: 3, page: 4 }).hasNextPage).toBe(false);
    });

    it('should set hasPreviousPage correctly', () => {
      expect(paginate(testData, { pageSize: 3, page: 1 }).hasPreviousPage).toBe(false);
      expect(paginate(testData, { pageSize: 3, page: 2 }).hasPreviousPage).toBe(true);
    });

    it('should set isFirstPage and isLastPage correctly', () => {
      const first = paginate(testData, { pageSize: 3, page: 1 });
      expect(first.isFirstPage).toBe(true);
      expect(first.isLastPage).toBe(false);

      const last = paginate(testData, { pageSize: 3, page: 4 });
      expect(last.isFirstPage).toBe(false);
      expect(last.isLastPage).toBe(true);
    });
  });

  describe('zero-based pagination', () => {
    it('should use 0-based indexing when specified', () => {
      const result = paginate(testData, { pageSize: 3, page: 0, zeroBased: true });
      expect(result.items).toEqual([1, 2, 3]);
      expect(result.currentPage).toBe(0);
      expect(result.pageNumbers).toEqual([0, 1, 2, 3]);
    });
  });

  describe('page clamping', () => {
    it('should clamp page to valid range', () => {
      const tooHigh = paginate(testData, { pageSize: 3, page: 100 });
      expect(tooHigh.currentPage).toBe(4);

      const tooLow = paginate(testData, { pageSize: 3, page: -5 });
      expect(tooLow.currentPage).toBe(1);
    });
  });

  describe('indices', () => {
    it('should return correct start and end indices', () => {
      const result = paginate(testData, { pageSize: 3, page: 2 });
      expect(result.startIndex).toBe(3);
      expect(result.endIndex).toBe(6);
    });
  });

  describe('error handling', () => {
    it('should throw for non-array input', () => {
      expect(() => paginate('not an array' as unknown as unknown[], { pageSize: 10 })).toThrow(
        'paginate: Expected an array'
      );
    });

    it('should throw for invalid pageSize', () => {
      expect(() => paginate(testData, { pageSize: 0 })).toThrow(
        'paginate: pageSize must be a positive integer'
      );
    });
  });

  describe('empty array', () => {
    it('should handle empty arrays gracefully', () => {
      const result = paginate([], { pageSize: 10, page: 1 });
      expect(result.items).toEqual([]);
      expect(result.totalPages).toBe(1);
      expect(result.hasNextPage).toBe(false);
    });

    it('should allow totalPages to be 0 when configured', () => {
      const result = paginate([], { pageSize: 10, page: 1, allowZeroTotalPages: true });
      expect(result.totalPages).toBe(0);
      expect(result.items).toEqual([]);
      expect(result.pageNumbers).toEqual([]);
      expect(result.hasNextPage).toBe(false);
      expect(result.hasPreviousPage).toBe(false);
    });
  });
});

describe('createPaginator', () => {
  it('should create a bound paginator function', () => {
    const data = [1, 2, 3, 4, 5];
    const paginateData = createPaginator(data);

    const page1 = paginateData({ pageSize: 2, page: 1 });
    expect(page1.items).toEqual([1, 2]);

    const page2 = paginateData({ pageSize: 2, page: 2 });
    expect(page2.items).toEqual([3, 4]);
  });
});

describe('getPageForIndex', () => {
  it('should return correct page for index (1-based)', () => {
    expect(getPageForIndex(0, 10)).toBe(1);
    expect(getPageForIndex(9, 10)).toBe(1);
    expect(getPageForIndex(10, 10)).toBe(2);
    expect(getPageForIndex(25, 10)).toBe(3);
  });

  it('should return correct page for index (0-based)', () => {
    expect(getPageForIndex(0, 10, true)).toBe(0);
    expect(getPageForIndex(10, 10, true)).toBe(1);
    expect(getPageForIndex(25, 10, true)).toBe(2);
  });

  it('should handle negative indices', () => {
    expect(getPageForIndex(-5, 10)).toBe(1);
    expect(getPageForIndex(-5, 10, true)).toBe(0);
  });

  it('should throw for invalid pageSize', () => {
    expect(() => getPageForIndex(5, 0)).toThrow(
      'getPageForIndex: pageSize must be a positive integer'
    );
  });
});

// =============================================================================
// memoize tests
// =============================================================================

describe('memoize', () => {
  describe('basic functionality', () => {
    it('should cache function results', () => {
      let callCount = 0;
      const fn = (n: number) => {
        callCount++;
        return n * 2;
      };

      const memoized = memoize(fn);

      expect(memoized(5)).toBe(10);
      expect(callCount).toBe(1);

      expect(memoized(5)).toBe(10);
      expect(callCount).toBe(1); // Still 1, cached

      expect(memoized(3)).toBe(6);
      expect(callCount).toBe(2); // Different arg
    });

    it('should handle multiple arguments', () => {
      let callCount = 0;
      const fn = (a: number, b: number) => {
        callCount++;
        return a + b;
      };

      const memoized = memoize(fn);

      expect(memoized(1, 2)).toBe(3);
      expect(memoized(1, 2)).toBe(3);
      expect(callCount).toBe(1);

      expect(memoized(2, 1)).toBe(3);
      expect(callCount).toBe(2); // Different args
    });
  });

  describe('cache control', () => {
    it('should clear cache', () => {
      let callCount = 0;
      const fn = memoize((n: number) => {
        callCount++;
        return n;
      });

      fn(1);
      fn(1);
      expect(callCount).toBe(1);

      fn.clear();

      fn(1);
      expect(callCount).toBe(2);
    });

    it('should delete specific entries', () => {
      let callCount = 0;
      const fn = memoize((n: number) => {
        callCount++;
        return n;
      });

      fn(1);
      fn(2);
      expect(callCount).toBe(2);

      fn.delete(1);

      fn(1);
      fn(2);
      expect(callCount).toBe(3); // 1 was deleted
    });

    it('should check if cached', () => {
      const fn = memoize((n: number) => n);

      expect(fn.has(1)).toBe(false);
      fn(1);
      expect(fn.has(1)).toBe(true);
    });

    it('should track size', () => {
      const fn = memoize((n: number) => n);

      expect(fn.size).toBe(0);
      fn(1);
      expect(fn.size).toBe(1);
      fn(2);
      expect(fn.size).toBe(2);
      fn(1); // Cached
      expect(fn.size).toBe(2);
    });

    it('should track statistics', () => {
      const fn = memoize((n: number) => n);

      fn(1);
      expect(fn.stats.misses).toBe(1);
      expect(fn.stats.hits).toBe(0);

      fn(1);
      expect(fn.stats.misses).toBe(1);
      expect(fn.stats.hits).toBe(1);
      expect(fn.stats.hitRate).toBe(0.5);
    });
  });

  describe('maxSize option', () => {
    it('should evict oldest entries when max size reached', () => {
      const fn = memoize((n: number) => n, { maxSize: 2 });

      fn(1);
      fn(2);
      expect(fn.size).toBe(2);

      fn(3); // Should evict 1
      expect(fn.size).toBe(2);
      expect(fn.has(1)).toBe(false);
      expect(fn.has(2)).toBe(true);
      expect(fn.has(3)).toBe(true);
    });
  });

  describe('TTL option', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should expire entries after TTL', () => {
      let callCount = 0;
      const fn = memoize(
        (n: number) => {
          callCount++;
          return n;
        },
        { ttl: 1000 }
      );

      fn(1);
      expect(callCount).toBe(1);

      fn(1);
      expect(callCount).toBe(1); // Still cached

      jest.advanceTimersByTime(1500);

      fn(1);
      expect(callCount).toBe(2); // Expired, recomputed
    });
  });

  describe('weakMap option', () => {
    it('should cache by object reference when weakMap is enabled', () => {
      let callCount = 0;
      const fn = memoize(
        (obj: { id: number }) => {
          callCount++;
          return obj.id;
        },
        { weakMap: true }
      );

      const ref = { id: 1 };
      expect(fn(ref)).toBe(1);
      expect(fn(ref)).toBe(1);
      expect(callCount).toBe(1);

      const other = { id: 1 };
      expect(fn(other)).toBe(1);
      expect(callCount).toBe(2); // Different object reference
    });
  });

  describe('custom cache key', () => {
    it('should use custom cache key function', () => {
      let callCount = 0;
      const fn = memoize(
        (id: string, _options?: { refresh?: boolean }) => {
          callCount++;
          return `data-${id}`;
        },
        { cacheKeyFn: (id) => id } // Only cache by ID
      );

      fn('user1', { refresh: false });
      fn('user1', { refresh: true }); // Same ID, should be cached
      expect(callCount).toBe(1);
    });
  });

  describe('error handling', () => {
    it('should throw for non-function input', () => {
      expect(() => memoize('not a function' as unknown as () => void)).toThrow(
        'memoize: Expected a function'
      );
    });
  });
});

// =============================================================================
// createSelector tests
// =============================================================================

describe('createSelector', () => {
  interface State {
    users: Array<{ id: number; name: string }>;
    filter: string;
  }

  const getUsers = (state: State) => state.users;
  const getFilter = (state: State) => state.filter;

  describe('basic functionality', () => {
    it('should compute derived state', () => {
      const getFilteredUsers = createSelector(getUsers, getFilter, (users, filter) =>
        users.filter((u) => u.name.includes(filter))
      );

      const state: State = {
        users: [
          { id: 1, name: 'Alice' },
          { id: 2, name: 'Bob' },
        ],
        filter: 'Ali',
      };

      const result = getFilteredUsers(state);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Alice');
    });

    it('should memoize results', () => {
      let computeCount = 0;

      const getFilteredUsers = createSelector(getUsers, getFilter, (users, filter) => {
        computeCount++;
        return users.filter((u) => u.name.includes(filter));
      });

      const state: State = {
        users: [{ id: 1, name: 'Alice' }],
        filter: 'A',
      };

      getFilteredUsers(state);
      getFilteredUsers(state);
      getFilteredUsers(state);

      expect(computeCount).toBe(1);
    });

    it('should recompute when inputs change', () => {
      let computeCount = 0;

      const getFilteredUsers = createSelector(getUsers, getFilter, (users, filter) => {
        computeCount++;
        return users.filter((u) => u.name.includes(filter));
      });

      const state1: State = {
        users: [{ id: 1, name: 'Alice' }],
        filter: 'A',
      };

      const state2: State = {
        ...state1,
        filter: 'B', // Changed filter
      };

      getFilteredUsers(state1);
      getFilteredUsers(state2);

      expect(computeCount).toBe(2);
    });

    it('should honor equalityFn to preserve result reference', () => {
      const selector = createSelector(
        getUsers,
        (users) => {
          return users.map((u) => ({ ...u }));
        },
        { equalityFn: shallowEqual }
      );

      const state: State = {
        users: [
          { id: 1, name: 'Alice' },
          { id: 2, name: 'Bob' },
        ],
        filter: '',
      };

      const first = selector(state);
      const second = selector({ ...state });

      // equalityFn should keep the previous result reference
      expect(second).toBe(first);
    });
  });

  describe('control methods', () => {
    it('should track recomputations', () => {
      const selector = createSelector(getUsers, (users) => users.length);

      const state: State = { users: [{ id: 1, name: 'Alice' }], filter: '' };

      selector(state);
      expect(selector.recomputations()).toBe(1);

      selector(state);
      expect(selector.recomputations()).toBe(1);

      selector({ ...state, users: [{ id: 2, name: 'Bob' }] });
      expect(selector.recomputations()).toBe(2);
    });

    it('should reset recomputations', () => {
      const selector = createSelector(getUsers, (users) => users.length);

      selector({ users: [{ id: 1, name: 'Alice' }], filter: '' });
      expect(selector.recomputations()).toBe(1);

      selector.resetRecomputations();
      expect(selector.recomputations()).toBe(0);
    });

    it('should clear cache', () => {
      let computeCount = 0;
      const selector = createSelector(getUsers, (users) => {
        computeCount++;
        return users.length;
      });

      const state: State = { users: [{ id: 1, name: 'Alice' }], filter: '' };

      selector(state);
      selector(state);
      expect(computeCount).toBe(1);

      selector.clearCache();

      selector(state);
      expect(computeCount).toBe(2);
    });
  });

  describe('error handling', () => {
    it('should throw for insufficient arguments', () => {
      expect(() =>
        // @ts-expect-error - Testing runtime error
        createSelector((s: State) => s.users)
      ).toThrow('createSelector requires at least one input selector and a combiner');
    });
  });
});

describe('createSelectorFromArray', () => {
  interface State {
    a: number;
    b: number;
    c: number;
  }

  it('should work with array of selectors', () => {
    const getA = (s: State) => s.a;
    const getB = (s: State) => s.b;
    const getC = (s: State) => s.c;

    const getSum = createSelectorFromArray([getA, getB, getC], ([a, b, c]) => a + b + c);

    expect(getSum({ a: 1, b: 2, c: 3 })).toBe(6);
  });

  it('should throw for empty selectors array', () => {
    expect(() => createSelectorFromArray([], () => 0)).toThrow(
      'createSelectorFromArray requires a non-empty array of selectors'
    );
  });
});

// =============================================================================
// Equality function tests
// =============================================================================

describe('shallowEqual', () => {
  it('should return true for identical references', () => {
    const obj = { a: 1 };
    expect(shallowEqual(obj, obj)).toBe(true);
  });

  it('should return true for equal primitives', () => {
    expect(shallowEqual(1, 1)).toBe(true);
    expect(shallowEqual('hello', 'hello')).toBe(true);
    expect(shallowEqual(true, true)).toBe(true);
  });

  it('should return false for null/undefined comparisons', () => {
    expect(shallowEqual(null, {})).toBe(false);
    expect(shallowEqual(undefined, {})).toBe(false);
    expect(shallowEqual(null, undefined)).toBe(false);
  });

  it('should compare arrays shallowly', () => {
    expect(shallowEqual([1, 2, 3], [1, 2, 3])).toBe(true);
    expect(shallowEqual([1, 2], [1, 2, 3])).toBe(false);

    const nested = { x: 1 };
    expect(shallowEqual([nested], [nested])).toBe(true);
    expect(shallowEqual([{ x: 1 }], [{ x: 1 }])).toBe(false); // Different refs
  });

  it('should compare objects shallowly', () => {
    expect(shallowEqual({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true);
    expect(shallowEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false);
    expect(shallowEqual({ a: { x: 1 } }, { a: { x: 1 } })).toBe(false); // Nested
  });
});

describe('strictEqual', () => {
  it('should use reference equality', () => {
    const obj = { a: 1 };
    expect(strictEqual(obj, obj)).toBe(true);
    expect(strictEqual({ a: 1 }, { a: 1 })).toBe(false);
    expect(strictEqual(1, 1)).toBe(true);
  });
});

describe('deepEqual', () => {
  it('should compare nested objects', () => {
    expect(deepEqual({ a: { b: { c: 1 } } }, { a: { b: { c: 1 } } })).toBe(true);
    expect(deepEqual({ a: { b: { c: 1 } } }, { a: { b: { c: 2 } } })).toBe(false);
  });

  it('should compare nested arrays', () => {
    expect(deepEqual([1, [2, [3]]], [1, [2, [3]]])).toBe(true);
    expect(deepEqual([1, [2, [3]]], [1, [2, [4]]])).toBe(false);
  });

  it('should handle dates', () => {
    const d1 = new Date('2023-01-01');
    const d2 = new Date('2023-01-01');
    const d3 = new Date('2023-01-02');

    expect(deepEqual(d1, d2)).toBe(true);
    expect(deepEqual(d1, d3)).toBe(false);
  });

  it('should handle regex', () => {
    expect(deepEqual(/abc/gi, /abc/gi)).toBe(true);
    expect(deepEqual(/abc/g, /abc/i)).toBe(false);
  });

  it('should handle mixed nesting', () => {
    const obj1 = {
      users: [
        { name: 'Alice', scores: [1, 2, 3] },
        { name: 'Bob', scores: [4, 5, 6] },
      ],
    };

    const obj2 = {
      users: [
        { name: 'Alice', scores: [1, 2, 3] },
        { name: 'Bob', scores: [4, 5, 6] },
      ],
    };

    expect(deepEqual(obj1, obj2)).toBe(true);
  });
});
