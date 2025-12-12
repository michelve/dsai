/**
 * @file paginate - Paginate arrays with rich metadata
 * @module @dsai/react/utils/collections
 *
 * Enterprise-grade pagination utility with comprehensive metadata.
 * Returns paginated results with navigation helpers.
 *
 * Features:
 * - Rich pagination metadata
 * - Type-safe with preserved item types
 * - Does not mutate original array
 * - SSR-safe (no DOM dependencies)
 * - Handles edge cases gracefully
 */

import type { PaginatedResult, PaginationOptions } from '../types/shared';

/**
 * Extended pagination options
 */
export interface PaginateOptions extends PaginationOptions {
  /**
   * Zero-based page indexing (default is 1-based)
   * @default false
   */
  zeroBased?: boolean;

  /**
   * Allow totalPages to be 0 when there are no items.
   * Defaults to false to preserve prior behavior.
   * @default false
   */
  allowZeroTotalPages?: boolean;
}

/**
 * Extended paginated result with additional helpers
 */
export interface ExtendedPaginatedResult<T> extends PaginatedResult<T> {
  /**
   * Start index of current page (0-based)
   */
  readonly startIndex: number;

  /**
   * End index of current page (exclusive, 0-based)
   */
  readonly endIndex: number;

  /**
   * Whether the current page is the first page
   */
  readonly isFirstPage: boolean;

  /**
   * Whether the current page is the last page
   */
  readonly isLastPage: boolean;

  /**
   * Array of all page numbers for rendering pagination controls
   */
  readonly pageNumbers: readonly number[];
}

/**
 * Paginates an array with comprehensive metadata for building pagination UIs.
 *
 * @param array - The array to paginate (not mutated)
 * @param options - Pagination configuration
 * @returns Paginated result with items and metadata
 *
 * @example
 * ```tsx
 * const users = [
 *   { id: 1, name: 'Alice' },
 *   { id: 2, name: 'Bob' },
 *   { id: 3, name: 'Charlie' },
 *   { id: 4, name: 'Diana' },
 *   { id: 5, name: 'Eve' }
 * ];
 *
 * // Basic pagination
 * const result = paginate(users, { pageSize: 2, page: 1 });
 * // {
 * //   items: [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }],
 * //   totalItems: 5,
 * //   totalPages: 3,
 * //   currentPage: 1,
 * //   pageSize: 2,
 * //   hasNextPage: true,
 * //   hasPreviousPage: false,
 * //   startIndex: 0,
 * //   endIndex: 2,
 * //   isFirstPage: true,
 * //   isLastPage: false,
 * //   pageNumbers: [1, 2, 3]
 * // }
 *
 * // Get next page
 * const page2 = paginate(users, { pageSize: 2, page: 2 });
 * // items: [{ id: 3, name: 'Charlie' }, { id: 4, name: 'Diana' }]
 *
 * // Zero-based pagination
 * const zeroBasedResult = paginate(users, { pageSize: 2, page: 0, zeroBased: true });
 * // currentPage: 0, pages are 0, 1, 2
 *
 * // React component usage
 * function UserList({ users, pageSize }) {
 *   const [page, setPage] = useState(1);
 *   const { items, hasNextPage, hasPreviousPage, totalPages } = paginate(users, { pageSize, page });
 *
 *   return (
 *     <>
 *       {items.map(user => <UserCard key={user.id} user={user} />)}
 *       <Pagination
 *         onPrev={() => setPage(p => p - 1)}
 *         onNext={() => setPage(p => p + 1)}
 *         hasPrev={hasPreviousPage}
 *         hasNext={hasNextPage}
 *         current={page}
 *         total={totalPages}
 *       />
 *     </>
 *   );
 * }
 * ```
 *
 * @throws {TypeError} If array is not an array
 * @throws {RangeError} If pageSize is not a positive integer
 */
export function paginate<T>(
  array: readonly T[],
  options: PaginateOptions
): ExtendedPaginatedResult<T> {
  // Validate input
  if (!Array.isArray(array)) {
    throw new TypeError('paginate: Expected an array');
  }

  const { pageSize, page = 1, zeroBased = false, allowZeroTotalPages = false } = options;

  if (!Number.isInteger(pageSize) || pageSize <= 0) {
    throw new RangeError('paginate: pageSize must be a positive integer');
  }

  const totalItems = array.length;
  const totalPages = allowZeroTotalPages ? Math.ceil(totalItems / pageSize) : Math.max(1, Math.ceil(totalItems / pageSize));

  if (allowZeroTotalPages && totalPages === 0) {
    return {
      items: [],
      totalItems,
      totalPages,
      currentPage: zeroBased ? 0 : 1,
      pageSize,
      hasNextPage: false,
      hasPreviousPage: false,
      startIndex: 0,
      endIndex: 0,
      isFirstPage: true,
      isLastPage: true,
      pageNumbers: [],
    };
  }

  // Normalize page number
  const minPage = zeroBased ? 0 : 1;
  const maxPage = zeroBased ? totalPages - 1 : totalPages;

  // Clamp page to valid range
  const normalizedPage = Math.max(minPage, Math.min(page, maxPage));

  // Calculate indices
  const pageOffset = zeroBased ? normalizedPage : normalizedPage - 1;
  const startIndex = pageOffset * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);

  // Extract items for current page
  const items = array.slice(startIndex, endIndex);

  // Generate page numbers array
  const pageNumbers: number[] = [];
  for (let i = minPage; i <= maxPage; i++) {
    pageNumbers.push(i);
  }

  // Calculate navigation flags
  const isFirstPage = normalizedPage === minPage;
  const isLastPage = normalizedPage === maxPage;
  const hasNextPage = !isLastPage && totalItems > 0;
  const hasPreviousPage = !isFirstPage;

  return {
    items,
    totalItems,
    totalPages,
    currentPage: normalizedPage,
    pageSize,
    hasNextPage,
    hasPreviousPage,
    startIndex,
    endIndex,
    isFirstPage,
    isLastPage,
    pageNumbers,
  };
}

/**
 * Creates a paginator function bound to a specific array.
 * Useful when paginating the same array multiple times.
 *
 * @param array - The array to paginate
 * @returns A function that accepts page options and returns paginated results
 *
 * @example
 * ```tsx
 * const users = getUsers();
 * const paginateUsers = createPaginator(users);
 *
 * // Get different pages efficiently
 * const page1 = paginateUsers({ pageSize: 10, page: 1 });
 * const page2 = paginateUsers({ pageSize: 10, page: 2 });
 * const page3 = paginateUsers({ pageSize: 10, page: 3 });
 * ```
 */
export function createPaginator<T>(
  array: readonly T[]
): (options: PaginateOptions) => ExtendedPaginatedResult<T> {
  return (options: PaginateOptions) => paginate(array, options);
}

/**
 * Gets the page number for a specific item index.
 *
 * @param index - The 0-based index of the item
 * @param pageSize - The number of items per page
 * @param zeroBased - Whether to use 0-based page numbers
 * @returns The page number containing the item
 *
 * @example
 * ```tsx
 * // Find which page contains item at index 25
 * const page = getPageForIndex(25, 10); // 3 (1-based)
 * const page = getPageForIndex(25, 10, true); // 2 (0-based)
 * ```
 */
export function getPageForIndex(index: number, pageSize: number, zeroBased = false): number {
  if (!Number.isInteger(pageSize) || pageSize <= 0) {
    throw new RangeError('getPageForIndex: pageSize must be a positive integer');
  }

  if (index < 0) {
    return zeroBased ? 0 : 1;
  }

  const page = Math.floor(index / pageSize);
  return zeroBased ? page : page + 1;
}

export type { PaginatedResult, PaginationOptions };
