import type { CSSProperties, ReactNode } from 'react';

/**
 * Breadcrumb item configuration (data-driven mode)
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
 * BreadcrumbItem component props (compound component mode)
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

  /**
   * Truncate long labels with ellipsis at this max width (CSS value)
   * @example '120px', '10em'
   */
  maxLabelWidth?: string;

  /** Test ID attribute */
  'data-testid'?: string;

  /** Test attribute */
  'data-test'?: string;
}

/**
 * Breadcrumb container props
 */
export interface BreadcrumbProps {
  /**
   * Breadcrumb items to render (data-driven mode)
   */
  items?: BreadcrumbItemData[];

  /**
   * Children (compound component mode — alternative to items prop)
   */
  children?: ReactNode;

  /**
   * Custom separator between items.
   * - String values use Bootstrap's `--bs-breadcrumb-divider` CSS variable
   * - ReactNode values render inline between items (replaces CSS separator)
   * @default '/'
   */
  separator?: ReactNode;

  /**
   * Maximum number of items to show before collapsing.
   * When exceeded, shows first items, ellipsis, and last items.
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
   * Whether the breadcrumb is currently expanded (controlled mode)
   * @default false
   */
  expanded?: boolean;

  /**
   * Accessible label for the expand/ellipsis button
   * @default 'Show hidden breadcrumbs'
   */
  expandText?: string;

  /**
   * Custom link component for all items (router integration)
   */
  linkAs?: React.ElementType;

  /**
   * Truncate long item labels with ellipsis at this max width (CSS value).
   * Applies to all items. Override per-item via BreadcrumbItem's maxLabelWidth.
   * @example '150px', '12em'
   */
  maxLabelWidth?: string;

  /**
   * Render prop for collapsed items — receives the hidden items array.
   * Use to render a dropdown or popover showing collapsed breadcrumbs.
   *
   * @example
   * ```tsx
   * <Breadcrumb
   *   items={items}
   *   maxItems={4}
   *   renderCollapsedItems={(hiddenItems) => (
   *     <Dropdown items={hiddenItems.map(i => ({ label: i.label, href: i.href }))} />
   *   )}
   * />
   * ```
   */
  renderCollapsedItems?: (hiddenItems: BreadcrumbItemData[]) => ReactNode;

  /**
   * Generate Schema.org BreadcrumbList JSON-LD structured data.
   * When true, renders a `<script type="application/ld+json">` tag.
   * Only works with the `items` prop (data-driven mode).
   * @default false
   */
  structuredData?: boolean;

  /**
   * Accessible label for the navigation
   * @default 'Breadcrumb'
   */
  'aria-label'?: string;

  /**
   * ID reference to an element that labels the navigation
   */
  'aria-labelledby'?: string;

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

  /** Test ID attribute */
  'data-testid'?: string;

  /** Test attribute */
  'data-test'?: string;
}
