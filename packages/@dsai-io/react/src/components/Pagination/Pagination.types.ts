/**
 * Pagination Component Types
 *
 * Type definitions for the Pagination component.
 * Follows Bootstrap 5 pagination patterns with full accessibility support.
 *
 * @packageDocumentation
 */

import type { ComponentSize } from '../../types';
import type { CSSProperties, ReactNode } from 'react';

/**
 * Pagination size variants
 * Maps to Bootstrap's pagination sizing classes
 * @see ComponentSize
 */
export type PaginationSize = ComponentSize;

/**
 * Pagination alignment options
 * Maps to Bootstrap's flexbox utility classes
 */
export type PaginationAlignment = 'start' | 'center' | 'end';

/**
 * Individual pagination item type for rendering
 * @internal
 */
export type PaginationItemType = 'first' | 'previous' | 'page' | 'ellipsis' | 'next' | 'last';

/**
 * Pagination item data for rendering
 * @internal
 */
export interface PaginationItemData {
  /** Type of the pagination item */
  type: PaginationItemType;
  /** Page number (only for 'page' type) */
  page?: number;
  /** Whether this item is currently active */
  active?: boolean;
  /** Whether this item is disabled */
  disabled?: boolean;
  /** Unique key for React rendering */
  key: string;
}

/**
 * PaginationItem component props
 *
 * @internal Reserved for future `renderItem` customization API.
 *
 * @accessibility
 * - Uses semantic `<li>` with `<button>` for proper screen reader support
 * - Active page has `aria-current="page"` and remains focusable
 * - Disabled items have `aria-disabled="true"` and `tabIndex="-1"`
 */
export interface PaginationItemProps {
  /**
   * Page number for this item
   */
  page: number;

  /**
   * Whether this page is currently active
   * @default false
   */
  active?: boolean;

  /**
   * Whether this item is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Click handler when page is selected
   */
  onClick?: (page: number) => void;

  /**
   * Content to display (defaults to page number)
   */
  children?: ReactNode;

  /**
   * Additional CSS class names
   */
  className?: string;

  /**
   * Inline styles
   */
  style?: CSSProperties;
}

/**
 * Pagination component props
 *
 * @example Basic usage
 * ```tsx
 * <Pagination
 *   page={1}
 *   count={10}
 *   onChange={(page) => console.log('Page:', page)}
 * />
 * ```
 *
 * @example With boundary and sibling ranges
 * ```tsx
 * <Pagination
 *   page={5}
 *   count={20}
 *   boundaryCount={1}
 *   siblingCount={2}
 *   onChange={handlePageChange}
 * />
 * ```
 *
 * @example With first/last buttons
 * ```tsx
 * <Pagination
 *   page={1}
 *   count={10}
 *   showFirstButton
 *   showLastButton
 *   onChange={handlePageChange}
 * />
 * ```
 *
 * @accessibility
 * - Wrapped in `<nav aria-label>` for navigation landmark
 * - Uses proper list semantics (`<ul>` with `<li>` children)
 * - Active page has `aria-current="page"`
 * - Disabled items are properly marked for assistive technology
 * - Previous/Next buttons have descriptive `aria-label`
 */
export interface PaginationProps {
  /**
   * The current page number (1-indexed)
   * @default 1
   */
  page?: number;

  /**
   * Default page for uncontrolled usage
   * @default 1
   */
  defaultPage?: number;

  /**
   * Total number of pages
   * @default 1
   */
  count?: number;

  /**
   * Callback fired when page changes
   * @param page - The new page number
   */
  onChange?: (page: number) => void;

  /**
   * Number of pages to show at the start and end
   * @default 1
   */
  boundaryCount?: number;

  /**
   * Number of pages to show on each side of the current page
   * @default 1
   */
  siblingCount?: number;

  /**
   * Whether to show the "First page" button
   * @default false
   */
  showFirstButton?: boolean;

  /**
   * Whether to show the "Last page" button
   * @default false
   */
  showLastButton?: boolean;

  /**
   * Whether to hide the "Previous" button
   * @default false
   */
  hidePrevButton?: boolean;

  /**
   * Whether to hide the "Next" button
   * @default false
   */
  hideNextButton?: boolean;

  /**
   * Whether the entire pagination is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Size variant
   * @default 'md'
   */
  size?: PaginationSize;

  /**
   * Horizontal alignment
   * @default 'start'
   */
  alignment?: PaginationAlignment;

  /**
   * Accessible label for the navigation
   * @default 'Pagination'
   */
  'aria-label'?: string;

  /**
   * Label for the "Previous" button
   * @default 'Go to previous page'
   */
  previousLabel?: string;

  /**
   * Label for the "Next" button
   * @default 'Go to next page'
   */
  nextLabel?: string;

  /**
   * Label for the "First" button
   * @default 'Go to first page'
   */
  firstLabel?: string;

  /**
   * Label for the "Last" button
   * @default 'Go to last page'
   */
  lastLabel?: string;

  /**
   * Function to generate aria-label for page buttons
   * @param page - The page number
   * @returns The aria-label string
   * @default (page) => `Go to page ${page}`
   */
  getPageAriaLabel?: (page: number) => string;

  /**
   * Custom content for previous button
   * @default <ChevronLeftIcon />
   */
  previousContent?: ReactNode;

  /**
   * Custom content for next button
   * @default <ChevronRightIcon />
   */
  nextContent?: ReactNode;

  /**
   * Custom content for first button
   * @default <ChevronDoubleLeftIcon />
   */
  firstContent?: ReactNode;

  /**
   * Custom content for last button
   * @default <ChevronDoubleRightIcon />
   */
  lastContent?: ReactNode;

  /**
   * Additional CSS class names
   */
  className?: string;

  /**
   * Inline styles
   */
  style?: CSSProperties;

  /**
   * ID attribute
   */
  id?: string;
}
