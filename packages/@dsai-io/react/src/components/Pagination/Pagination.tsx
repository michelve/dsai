/**
 * Pagination Component
 *
 * Accessible pagination navigation for navigating through pages of content.
 * Built with Bootstrap 5 classes and WCAG 2.2 AA compliance.
 *
 * @see https://getbootstrap.com/docs/5.3/components/pagination/
 * @packageDocumentation
 */

import { forwardRef, memo, useCallback, useId, useMemo, useRef } from 'react';

import { useControllableState } from '../../hooks/useControllableState';
import { cn } from '../../utils';
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '../Icon';

import type {
  PaginationAlignment,
  PaginationItemData,
  PaginationProps,
  PaginationSize,
} from './Pagination.types';

// =============================================================================
// Constants
// =============================================================================

/**
 * Size class mapping for Bootstrap pagination
 */
const SIZE_CLASSES: Readonly<Record<PaginationSize, string>> = {
  sm: 'pagination-sm',
  md: '',
  lg: 'pagination-lg',
};

/**
 * Alignment class mapping for Bootstrap flexbox utilities
 */
const ALIGNMENT_CLASSES: Readonly<Record<PaginationAlignment, string>> = {
  start: 'justify-content-start',
  center: 'justify-content-center',
  end: 'justify-content-end',
};

/** Keys that must be blocked to prevent prototype pollution */
const BLOCKED_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

/** Safe lookup with prototype pollution guard */
function safeLookup<T>(map: Readonly<Record<string, T>>, key: string, fallback: T): T {
  if (BLOCKED_KEYS.has(key)) {return fallback;}
  const value = Reflect.get(map, key) as T | undefined;
  return value !== undefined ? value : fallback;
}

// Default icon content hoisted to avoid recreating JSX on each render
const DEFAULT_PREV_ICON = <ChevronLeftIcon aria-hidden />;
const DEFAULT_NEXT_ICON = <ChevronRightIcon aria-hidden />;
const DEFAULT_FIRST_ICON = <ChevronDoubleLeftIcon aria-hidden />;
const DEFAULT_LAST_ICON = <ChevronDoubleRightIcon aria-hidden />;

// =============================================================================
// Utility Functions
// =============================================================================

/**
 * Creates a range of numbers from start to end (inclusive)
 * @param start - Start of range
 * @param end - End of range
 * @returns Array of numbers from start to end
 */
function range(start: number, end: number): number[] {
  const length = end - start + 1;
  return Array.from({ length }, (_, i) => start + i);
}

/**
 * Calculates which page items to display based on current page and configuration
 *
 * Algorithm:
 * 1. Always show boundary pages (first N and last N pages)
 * 2. Show sibling pages around the current page
 * 3. Insert ellipsis where there are gaps
 *
 * @param page - Current page (1-indexed)
 * @param count - Total number of pages
 * @param boundaryCount - Number of pages to show at boundaries
 * @param siblingCount - Number of sibling pages around current
 * @param showFirstButton - Whether first button is shown
 * @param showLastButton - Whether last button is shown
 * @param hidePrevButton - Whether prev button is hidden
 * @param hideNextButton - Whether next button is hidden
 * @returns Array of pagination item data for rendering
 */
function calculatePaginationItems(
  page: number,
  count: number,
  boundaryCount: number,
  siblingCount: number,
  showFirstButton: boolean,
  showLastButton: boolean,
  hidePrevButton: boolean,
  hideNextButton: boolean
): PaginationItemData[] {
  const items: PaginationItemData[] = [];

  // Add "First" button
  if (showFirstButton) {
    items.push({
      type: 'first',
      page: 1,
      disabled: page <= 1,
      key: 'first',
    });
  }

  // Add "Previous" button
  if (!hidePrevButton) {
    items.push({
      type: 'previous',
      page: page - 1,
      disabled: page <= 1,
      key: 'previous',
    });
  }

  // Calculate page numbers to show
  // Start boundary pages: [1, 2, ..., boundaryCount]
  const startBoundary = range(1, Math.min(boundaryCount, count));

  // End boundary pages: [count - boundaryCount + 1, ..., count]
  const endBoundary = range(Math.max(count - boundaryCount + 1, boundaryCount + 1), count);
  const firstEndPage = endBoundary[0];

  // Sibling pages around current: [page - siblingCount, ..., page, ..., page + siblingCount]
  const siblingStart = Math.max(
    Math.min(page - siblingCount, count - boundaryCount - siblingCount * 2 - 1),
    boundaryCount + 2
  );
  const siblingEnd = Math.min(
    Math.max(page + siblingCount, boundaryCount + siblingCount * 2 + 2),
    firstEndPage !== undefined ? firstEndPage - 2 : count - 1
  );

  // Build the final page list with ellipsis (use Set for O(1) dedup)
  const pageNumbers: (number | 'ellipsis')[] = [];
  const seen = new Set<number>();

  // Add start boundary
  for (const p of startBoundary) {
    pageNumbers.push(p);
    seen.add(p);
  }

  // Add start ellipsis if needed
  if (siblingStart > boundaryCount + 2) {
    pageNumbers.push('ellipsis');
  } else if (boundaryCount + 1 < siblingStart) {
    // Add the page between boundary and siblings
    for (let i = boundaryCount + 1; i < siblingStart; i++) {
      pageNumbers.push(i);
      seen.add(i);
    }
  }

  // Add sibling pages (including current)
  for (let i = siblingStart; i <= siblingEnd; i++) {
    if (!seen.has(i) && i > boundaryCount && i <= count - boundaryCount) {
      pageNumbers.push(i);
      seen.add(i);
    }
  }

  // Add end ellipsis if needed
  const lastPageBeforeEndBoundary = firstEndPage !== undefined ? firstEndPage - 1 : count;
  const endBoundaryLimit = (firstEndPage ?? count) + 1;
  if (siblingEnd < lastPageBeforeEndBoundary - 1) {
    pageNumbers.push('ellipsis');
  } else if (siblingEnd < lastPageBeforeEndBoundary) {
    // Add the page between siblings and end boundary
    for (let i = siblingEnd + 1; i < endBoundaryLimit; i++) {
      if (!seen.has(i)) {
        pageNumbers.push(i);
        seen.add(i);
      }
    }
  }

  // Add end boundary
  for (const endPage of endBoundary) {
    if (!seen.has(endPage)) {
      pageNumbers.push(endPage);
      seen.add(endPage);
    }
  }

  // Convert to pagination items
  let ellipsisCount = 0;
  for (const pageNum of pageNumbers) {
    if (pageNum === 'ellipsis') {
      items.push({
        type: 'ellipsis',
        key: `ellipsis-${ellipsisCount++}`,
        disabled: true,
      });
    } else {
      items.push({
        type: 'page',
        page: pageNum,
        active: pageNum === page,
        key: `page-${pageNum}`,
      });
    }
  }

  // Add "Next" button
  if (!hideNextButton) {
    items.push({
      type: 'next',
      page: page + 1,
      disabled: page >= count,
      key: 'next',
    });
  }

  // Add "Last" button
  if (showLastButton) {
    items.push({
      type: 'last',
      page: count,
      disabled: page >= count,
      key: 'last',
    });
  }

  return items;
}

// =============================================================================
// PaginationItem Component
// =============================================================================

/**
 * Individual pagination item (internal component)
 */
interface InternalPaginationItemProps {
  item: PaginationItemData;
  onClick: (page: number) => void;
  disabled: boolean;
  previousLabel: string;
  nextLabel: string;
  firstLabel: string;
  lastLabel: string;
  getPageAriaLabel: (page: number) => string;
  previousContent: React.ReactNode;
  nextContent: React.ReactNode;
  firstContent: React.ReactNode;
  lastContent: React.ReactNode;
}

const PaginationItemComponent = memo(function PaginationItem({
  item,
  onClick,
  disabled: globalDisabled,
  previousLabel,
  nextLabel,
  firstLabel,
  lastLabel,
  getPageAriaLabel,
  previousContent,
  nextContent,
  firstContent,
  lastContent,
}: InternalPaginationItemProps): React.ReactElement {
  const isDisabled = globalDisabled || item.disabled;

  // Memoize content and aria-label to avoid closures per render (F5)
  const content = useMemo((): React.ReactNode => {
    switch (item.type) {
      case 'first':
        return firstContent;
      case 'previous':
        return previousContent;
      case 'next':
        return nextContent;
      case 'last':
        return lastContent;
      case 'ellipsis':
        return '…';
      default:
        return item.page;
    }
  }, [item.type, item.page, firstContent, previousContent, nextContent, lastContent]);

  const ariaLabel = useMemo((): string => {
    switch (item.type) {
      case 'first':
        return firstLabel;
      case 'previous':
        return previousLabel;
      case 'next':
        return nextLabel;
      case 'last':
        return lastLabel;
      case 'page':
        return getPageAriaLabel(item.page ?? 0);
      default:
        return '';
    }
  }, [item.type, item.page, firstLabel, previousLabel, nextLabel, lastLabel, getPageAriaLabel]);

  // Build class names
  const itemClasses = useMemo(() => {
    return cn('page-item', item.active && 'active', isDisabled && 'disabled');
  }, [item.active, isDisabled]);

  // Handle click
  const handleClick = useCallback((): void => {
    if (!isDisabled && item.page !== undefined) {
      onClick(item.page);
    }
  }, [isDisabled, item.page, onClick]);

  const isNavButton =
    item.type === 'first' ||
    item.type === 'previous' ||
    item.type === 'next' ||
    item.type === 'last';

  // Render ellipsis as non-interactive span with screen reader hint (F9)
  if (item.type === 'ellipsis') {
    return (
      <li className={itemClasses}>
        <span className="page-link">
          <span aria-hidden="true">…</span>
          <span className="visually-hidden">Pages skipped</span>
        </span>
      </li>
    );
  }

  // Render active page as focusable button with aria-current (F4)
  if (item.active) {
    return (
      <li className={itemClasses}>
        <button
          type="button"
          className="page-link"
          aria-current="page"
          aria-label={ariaLabel || undefined}
        >
          {content}
        </button>
      </li>
    );
  }

  // Render disabled items as disabled button
  if (isDisabled) {
    return (
      <li className={itemClasses}>
        <button
          type="button"
          className="page-link"
          disabled
          aria-disabled="true"
          tabIndex={-1}
          aria-label={ariaLabel || undefined}
        >
          {isNavButton ? <span aria-hidden="true">{content}</span> : content}
        </button>
      </li>
    );
  }

  // Render interactive items as button
  return (
    <li className={itemClasses}>
      <button type="button" className="page-link" onClick={handleClick} aria-label={ariaLabel}>
        {isNavButton ? <span aria-hidden="true">{content}</span> : content}
      </button>
    </li>
  );
});

PaginationItemComponent.displayName = 'PaginationItem';

// =============================================================================
// Pagination Component
// =============================================================================

/**
 * Pagination component for navigating through pages of content.
 *
 * Built with Bootstrap 5 classes and full WCAG 2.2 AA accessibility support.
 *
 * @see https://getbootstrap.com/docs/5.3/components/pagination/
 *
 * @example Basic usage
 * ```tsx
 * const [page, setPage] = useState(1);
 * <Pagination page={page} count={10} onChange={setPage} />
 * ```
 *
 * @example Uncontrolled with default page
 * ```tsx
 * <Pagination defaultPage={3} count={10} onChange={(p) => console.log(p)} />
 * ```
 *
 * @example With first/last buttons and custom ranges
 * ```tsx
 * <Pagination
 *   page={5}
 *   count={20}
 *   boundaryCount={2}
 *   siblingCount={1}
 *   showFirstButton
 *   showLastButton
 *   onChange={handlePageChange}
 * />
 * ```
 */
export const Pagination = memo(
  forwardRef<HTMLElement, PaginationProps>(function Pagination(
    {
      page: controlledPage,
      defaultPage = 1,
      count = 1,
      onChange,
      boundaryCount = 1,
      siblingCount = 1,
      showFirstButton = false,
      showLastButton = false,
      hidePrevButton = false,
      hideNextButton = false,
      disabled = false,
      size = 'md',
      alignment = 'start',
      'aria-label': ariaLabel,
      previousLabel = 'Go to previous page',
      nextLabel = 'Go to next page',
      firstLabel = 'Go to first page',
      lastLabel = 'Go to last page',
      getPageAriaLabel = (p: number): string => `Go to page ${p}`,
      previousContent = DEFAULT_PREV_ICON,
      nextContent = DEFAULT_NEXT_ICON,
      firstContent = DEFAULT_FIRST_ICON,
      lastContent = DEFAULT_LAST_ICON,
      className,
      style,
      id,
    },
    ref
  ) {
    const generatedLabelId = useId();
    const listRef = useRef<HTMLUListElement>(null);
    const resolvedAriaLabel = useMemo(() => {
      const trimmed = ariaLabel?.trim();
      if (trimmed) {
        return trimmed;
      }
      return `Pagination navigation ${generatedLabelId}`;
    }, [ariaLabel, generatedLabelId]);

    // Use shared controlled/uncontrolled hook (F2)
    const [currentPage, setCurrentPage] = useControllableState<number>({
      value: controlledPage,
      defaultValue: defaultPage,
      onChange,
    });

    // Clamp current page to valid range
    const clampedPage = Math.max(1, Math.min(currentPage, count));

    // Handle page change with clamping
    const handlePageChange = useCallback(
      (newPage: number): void => {
        const validPage = Math.max(1, Math.min(newPage, count));
        setCurrentPage(validPage);
      },
      [count, setCurrentPage]
    );

    // Calculate pagination items with memoization
    const paginationItems = useMemo(
      () =>
        calculatePaginationItems(
          clampedPage,
          count,
          boundaryCount,
          siblingCount,
          showFirstButton,
          showLastButton,
          hidePrevButton,
          hideNextButton
        ),
      [
        clampedPage,
        count,
        boundaryCount,
        siblingCount,
        showFirstButton,
        showLastButton,
        hidePrevButton,
        hideNextButton,
      ]
    );

    // Build ul class names with safe lookup (F1)
    const ulClasses = useMemo(() => {
      const sizeClass = safeLookup(SIZE_CLASSES, size, '');
      const alignClass = safeLookup(ALIGNMENT_CLASSES, alignment, '');
      return cn('pagination', 'mb-0', sizeClass, alignClass);
    }, [size, alignment]);

    // Arrow key navigation between pagination buttons (F3)
    const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLUListElement>): void => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {return;}

      const list = listRef.current;
      if (!list) {return;}

      const buttons = Array.from(
        list.querySelectorAll<HTMLButtonElement>('button.page-link:not([disabled])')
      );
      if (buttons.length === 0) {return;}

      const currentIndex = buttons.indexOf(event.target as HTMLButtonElement);
      if (currentIndex === -1) {return;}

      event.preventDefault();
      const nextIndex =
        event.key === 'ArrowRight'
          ? (currentIndex + 1) % buttons.length
          : (currentIndex - 1 + buttons.length) % buttons.length;
      buttons[nextIndex]?.focus();
    }, []);

    return (
      <nav
        ref={ref}
        aria-label={resolvedAriaLabel}
        className={className || undefined}
        style={style}
        id={id}
      >
        <ul ref={listRef} className={ulClasses} onKeyDown={handleKeyDown}>
          {paginationItems.map((item) => (
            <PaginationItemComponent
              key={item.key}
              item={item}
              onClick={handlePageChange}
              disabled={disabled}
              previousLabel={previousLabel}
              nextLabel={nextLabel}
              firstLabel={firstLabel}
              lastLabel={lastLabel}
              getPageAriaLabel={getPageAriaLabel}
              previousContent={previousContent}
              nextContent={nextContent}
              firstContent={firstContent}
              lastContent={lastContent}
            />
          ))}
        </ul>
      </nav>
    );
  })
);

Pagination.displayName = 'Pagination';

// =============================================================================
// Exports
// =============================================================================

export type {
  PaginationAlignment,
  PaginationItemData,
  PaginationItemProps,
  PaginationProps,
  PaginationSize,
} from './Pagination.types';
