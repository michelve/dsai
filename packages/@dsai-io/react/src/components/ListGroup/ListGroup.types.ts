import type { SafeHTMLAttributes, SemanticColorVariant } from '../../types';
import type { KeyboardEvent, MouseEvent, ReactNode } from 'react';

/**
 * ListGroup selection mode
 */
export type ListGroupSelectionMode = 'single' | 'multiple';

/**
 * ListGroup variant styling
 */
export type ListGroupVariant = 'default' | 'flush' | 'numbered';

/**
 * ListGroupItem color variant
 * @see SemanticColorVariant
 */
export type ListGroupItemVariant = SemanticColorVariant;

/**
 * Allowed element types for ListGroupItem `as` prop
 */
export type ListGroupItemElement = 'li' | 'a' | 'button' | 'div';

/**
 * Horizontal layout breakpoints for ListGroup
 */
export type ListGroupHorizontal = boolean | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

/**
 * ListGroupItem data for items prop
 */
export interface ListGroupItemData {
  /**
   * Unique identifier
   */
  id?: string;

  /**
   * Item content
   */
  content: ReactNode;

  /**
   * Secondary description displayed below content
   */
  description?: ReactNode;

  /**
   * Color variant
   */
  variant?: ListGroupItemVariant;

  /**
   * Whether the item is active/selected
   * @default false
   */
  active?: boolean;

  /**
   * Whether the item is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Badge content to display on the right
   */
  badge?: ReactNode;

  /**
   * Icon to display on the left
   */
  icon?: ReactNode;

  /**
   * URL for link items
   */
  href?: string;

  /**
   * Click handler
   */
  onClick?: (event: MouseEvent<HTMLElement>) => void;

  /**
   * Selection key used for managed selection (context-driven active state)
   */
  eventKey?: string;

  /**
   * Enable collapse/expand behavior for nested content
   */
  collapsible?: boolean;

  /**
   * Whether the collapsible item is expanded by default
   */
  defaultExpanded?: boolean;

  /**
   * Controlled expanded state
   */
  expanded?: boolean;

  /**
   * Called when expand/collapse state changes
   */
  onExpandedChange?: (expanded: boolean) => void;

  /**
   * Nested entries (rendered as a sub-list when collapsible)
   */
  children?: ListGroupEntry[];
}

/**
 * Divider entry for items array
 */
export interface ListGroupDividerEntry {
  type: 'divider';
}

/**
 * Header entry for items array
 */
export interface ListGroupHeaderEntry {
  type: 'header';
  content: ReactNode;
}

/**
 * Union of all entry types for the items prop
 */
export type ListGroupEntry = ListGroupItemData | ListGroupDividerEntry | ListGroupHeaderEntry;

/**
 * ListGroupItem component props
 */
export interface ListGroupItemProps extends SafeHTMLAttributes {
  /**
   * Item content
   */
  children: ReactNode;

  /**
   * Secondary description displayed below content
   */
  description?: ReactNode;

  /**
   * Color variant
   */
  variant?: ListGroupItemVariant;

  /**
   * Whether the item is active/selected
   * @default false
   */
  active?: boolean;

  /**
   * Whether the item is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Badge content to display on the right
   */
  badge?: ReactNode;

  /**
   * Icon to display on the left
   */
  icon?: ReactNode;

  /**
   * URL for link items
   */
  href?: string;

  /**
   * Click handler (makes item interactive)
   */
  onClick?: (event: MouseEvent<HTMLElement>) => void;

  /**
   * Render as a specific element.
   * For non-interactive items: renders the specified element.
   * For interactive items (with onClick): always renders a native <button>
   * for accessibility, regardless of this prop's value.
   * @default 'li' (or 'a' if href, 'button' if onClick)
   */
  as?: ListGroupItemElement;

  /**
   * Selection key used for managed selection (context-driven active state)
   */
  eventKey?: string;

  /**
   * Enable collapse/expand behavior for nested content
   */
  collapsible?: boolean;

  /**
   * Whether the collapsible item is expanded by default
   */
  defaultExpanded?: boolean;

  /**
   * Controlled expanded state
   */
  expanded?: boolean;

  /**
   * Called when expand/collapse state changes
   */
  onExpandedChange?: (expanded: boolean) => void;
}

/**
 * ListGroup container props
 */
export interface ListGroupProps extends SafeHTMLAttributes {
  /**
   * List items to render (supports items, dividers, and headers)
   */
  items?: ListGroupEntry[];

  /**
   * Children (alternative to items prop)
   */
  children?: ReactNode;

  /**
   * List variant
   * @default 'default'
   */
  variant?: ListGroupVariant;

  /**
   * Horizontal layout
   * @default false
   */
  horizontal?: ListGroupHorizontal;

  /**
   * Render as ordered list (ol) instead of unordered (ul)
   * @default false
   */
  ordered?: boolean;

  /**
   * Controlled active key(s) for managed selection
   */
  activeKey?: string | string[];

  /**
   * Default active key(s) for uncontrolled managed selection
   */
  defaultActiveKey?: string | string[];

  /**
   * Callback fired when an item is selected
   */
  onSelect?: (
    eventKey: string,
    event: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>
  ) => void;

  /**
   * Selection mode for managed selection
   * @default 'single'
   */
  selectionMode?: ListGroupSelectionMode;

  /**
   * Show a loading spinner (items remain visible but faded)
   * @default false
   */
  loading?: boolean;

  /**
   * Content to display when items array is empty
   */
  emptyContent?: ReactNode;

  /**
   * Enable virtual scrolling for large lists (requires @tanstack/react-virtual)
   */
  virtualized?: boolean;

  /**
   * Fixed item height in pixels (required for virtualization)
   */
  itemHeight?: number;

  /**
   * Number of items to render outside the visible area
   * @default 5
   */
  overscan?: number;
}
