/**
 * @file Collections utilities barrel export
 * @module @dsai/react/utils/collections
 *
 * Enterprise-grade collection utilities for arrays, objects, and data structures.
 * All utilities are type-safe, immutable, and SSR-compatible.
 */

// Stable sort with comparator support
export { composeComparators, sortBy, stableSort } from './stableSort';
export type { Comparator, StableSortOptions } from './stableSort';

// Unique items by key extractor
export { uniqueBy, uniqueByKey } from './uniqueBy';
export type { KeyExtractor, UniqueByOptions } from './uniqueBy';

// Array chunking utilities
export { chunk, chunkInto } from './chunk';
export type { ChunkOptions } from './chunk';

// Pagination utilities
export { createPaginator, getPageForIndex, paginate } from './paginate';
export type {
  ExtendedPaginatedResult,
  PaginateOptions,
  PaginatedResult,
  PaginationOptions,
} from './paginate';

// Memoization utilities
export { memoize, memoizeMethod } from './memoize';
export type { MemoizeOptions, MemoizedFunction } from './memoize';

// Selector pattern (reselect-like)
export {
  createSelector,
  createSelector1,
  createSelector2,
  createSelector3,
  createSelector4,
  createSelector5,
  createSelectorFromArray,
  deepEqual,
  shallowEqual,
  strictEqual,
} from './createSelector';
export type {
  CreateSelectorOptions,
  EqualityFn,
  MemoizedSelector,
  Selector,
} from './createSelector';
