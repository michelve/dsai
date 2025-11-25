import type { CSSProperties, ReactNode } from 'react';

/**
 * Breadcrumb item configuration
 */
export interface BreadcrumbItemData {
  /**
   * Unique identifier for the item
   */
  id?: string;

  /**
   * Display label
   */
  label: ReactNode;

  /**
   * URL for the breadcrumb link
   * If not provided, renders as text (current page)
   */
  href?: string;

  /**
   * Icon to display before the label
   */
  icon?: ReactNode;

  /**
   * Whether this is the current/active page
   * @default false
   */
  active?: boolean;

  /**
   * Click handler (alternative to href for SPA routing)
   */
  onClick?: () => void;
}

/**
 * BreadcrumbItem component props
 */
export interface BreadcrumbItemProps {
  /**
   * Item content
   */
  children: ReactNode;

  /**
   * URL for the breadcrumb link
   */
  href?: string;

  /**
   * Icon to display before the label
   */
  icon?: ReactNode;

  /**
   * Whether this is the current/active page
   * @default false
   */
  active?: boolean;

  /**
   * Click handler
   */
  onClick?: () => void;

  /**
   * Additional CSS class names
   */
  className?: string;

  /**
   * Inline styles
   */
  style?: CSSProperties;

  /**
   * Custom link component (for router integration)
   * @example
   * ```tsx
   * import { Link } from 'react-router-dom';
   * <BreadcrumbItem linkAs={Link} href="/home">Home</BreadcrumbItem>
   * ```
   */
  linkAs?: React.ElementType;
}

/**
 * Breadcrumb container props
 */
export interface BreadcrumbProps {
  /**
   * Breadcrumb items to render
   */
  items?: BreadcrumbItemData[];

  /**
   * Children (alternative to items prop for compound component usage)
   */
  children?: ReactNode;

  /**
   * Custom separator between items
   * @default '/'
   */
  separator?: ReactNode;

  /**
   * Maximum number of items to show before collapsing
   * When exceeded, shows first item, ellipsis, and last items
   */
  maxItems?: number;

  /**
   * Number of items to show after ellipsis when collapsed
   * @default 1
   */
  itemsAfterCollapse?: number;

  /**
   * Number of items to show before ellipsis when collapsed
   * @default 1
   */
  itemsBeforeCollapse?: number;

  /**
   * Callback when ellipsis is clicked to expand
   */
  onExpand?: () => void;

  /**
   * Whether the breadcrumb is currently expanded
   * @default false
   */
  expanded?: boolean;

  /**
   * Custom link component for all items (for router integration)
   */
  linkAs?: React.ElementType;

  /**
   * Accessible label for the navigation
   * @default 'Breadcrumb'
   */
  'aria-label'?: string;

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
