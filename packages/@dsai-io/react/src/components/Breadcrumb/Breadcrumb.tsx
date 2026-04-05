import {
  forwardRef,
  type MouseEvent,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
} from 'react';

import { cn } from '../../utils';
import { isExternalUrl } from '../../utils/types';
import { isSafeHref } from '../../utils/validation';

import {
  breadcrumbFSMReducer,
  createInitialBreadcrumbFSMState,
  expandEvent,
  isExpanded as isFSMExpanded,
  resetFromPropsEvent,
} from './Breadcrumb.fsm';

import type { BreadcrumbItemData, BreadcrumbItemProps, BreadcrumbProps } from './Breadcrumb.types';

// =============================================================================
// BreadcrumbItem Component
// =============================================================================

/**
 * BreadcrumbItem component — individual breadcrumb link or text.
 * Validates href for dangerous protocols and adds rel attributes for external links.
 *
 * @see https://getbootstrap.com/docs/5.3/components/breadcrumb/
 */
const BreadcrumbItemComponent = forwardRef<HTMLLIElement, BreadcrumbItemProps>(
  function BreadcrumbItem(
    {
      children,
      href,
      icon,
      active = false,
      onClick,
      className = '',
      style,
      linkAs: LinkComponent,
      maxLabelWidth,
      'data-testid': dataTestId,
      'data-test': dataTest,
    },
    ref
  ) {
    const itemClasses = useMemo(
      () => cn('breadcrumb-item', active && 'active', className),
      [active, className]
    );

    // Validate href:
    // - undefined/null → no link (text-only item)
    // - unsafe protocol → fallback to '#' (blocks XSS, still renders <a>)
    // - safe href → pass through
    const hasHref = href != null;
    const validatedHref = hasHref && isSafeHref(href) ? href : '#';
    const safeHref = hasHref ? validatedHref : undefined;
    const isExternal = safeHref && safeHref !== '#' ? isExternalUrl(safeHref) : false;
    const relAttribute = isExternal ? 'noopener noreferrer' : undefined;

    const handleClick = (e: MouseEvent<HTMLAnchorElement>): void => {
      if (onClick) {
        e.preventDefault();
        onClick();
      }
    };

    // Truncation styles for long labels
    const truncateStyle = maxLabelWidth
      ? ({
          display: 'inline-block',
          maxWidth: maxLabelWidth,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          verticalAlign: 'bottom',
        } as React.CSSProperties)
      : undefined;

    const labelContent = truncateStyle ? (
      <span style={truncateStyle} title={typeof children === 'string' ? children : undefined}>
        {children}
      </span>
    ) : (
      children
    );

    const content = (
      <>
        {icon && (
          <span className="me-1" aria-hidden="true">
            {icon}
          </span>
        )}
        {labelContent}
      </>
    );

    const renderContent = (): React.ReactNode => {
      if (active) {
        return content;
      }

      if (!safeHref && !onClick) {
        return content;
      }

      const linkHref = safeHref ?? '#';
      const linkOnClick = onClick ? handleClick : undefined;
      const LinkEl = LinkComponent ?? 'a';

      return (
        <LinkEl href={linkHref} onClick={linkOnClick} rel={relAttribute}>
          {content}
        </LinkEl>
      );
    };

    return (
      <li
        ref={ref}
        className={itemClasses}
        style={style}
        aria-current={active ? 'page' : undefined}
        data-testid={dataTestId}
        data-test={dataTest}
      >
        {renderContent()}
      </li>
    );
  }
);

BreadcrumbItemComponent.displayName = 'BreadcrumbItem';

export const BreadcrumbItem = memo(BreadcrumbItemComponent);
BreadcrumbItem.displayName = 'BreadcrumbItem';

// =============================================================================
// Schema.org JSON-LD
// =============================================================================

/**
 * Generates Schema.org BreadcrumbList structured data for SEO.
 * @see https://schema.org/BreadcrumbList
 * @see https://developers.google.com/search/docs/appearance/structured-data/breadcrumb
 */
function generateStructuredData(items: BreadcrumbItemData[]): string {
  const itemListElement = items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: typeof item.label === 'string' ? item.label : `Item ${index + 1}`,
    ...(item.href ? { item: item.href } : {}),
  }));

  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement,
  });
}

// =============================================================================
// Helper: is separator a plain string?
// =============================================================================

function isStringSeparator(separator: React.ReactNode): separator is string {
  return typeof separator === 'string';
}

// =============================================================================
// Extracted helpers (reduce cognitive complexity of Breadcrumb)
// =============================================================================

/** Build the collapsed display items with ellipsis placeholder */
function collapseItems(
  items: BreadcrumbItemData[],
  itemsBeforeCollapse: number,
  itemsAfterCollapse: number
): {
  displayItems: (BreadcrumbItemData | 'ellipsis')[];
  hiddenItems: BreadcrumbItemData[];
} {
  const beforeItems = items.slice(0, itemsBeforeCollapse);
  const afterItems = items.slice(items.length - itemsAfterCollapse);
  const hiddenItems = items.slice(itemsBeforeCollapse, items.length - itemsAfterCollapse);
  return {
    displayItems: [...beforeItems, 'ellipsis', ...afterItems],
    hiddenItems,
  };
}

/** Render an inline separator element */
function renderInlineSeparator(
  item: BreadcrumbItemData | 'ellipsis',
  index: number,
  separator: React.ReactNode
): React.ReactNode {
  const key =
    typeof item === 'string' ? item : (item.href ?? item.label ?? index);
  return (
    <li
      key={`sep-${key}`}
      className="breadcrumb-separator"
      aria-hidden="true"
      role="presentation"
    >
      {separator}
    </li>
  );
}

/** Render the ellipsis item (collapsed breadcrumbs) */
function renderEllipsisItem(
  hiddenItems: BreadcrumbItemData[],
  renderCollapsedItems: ((items: BreadcrumbItemData[]) => React.ReactNode) | undefined,
  handleEllipsisClick: () => void,
  expandText: string,
  isExpanded: boolean
): React.ReactNode {
  const ellipsisContent = renderCollapsedItems ? (
    renderCollapsedItems(hiddenItems)
  ) : (
    <button
      type="button"
      className="btn btn-link p-0 border-0 text-decoration-none"
      onClick={handleEllipsisClick}
      aria-label={expandText}
      aria-expanded={isExpanded}
    >
      …
    </button>
  );

  return (
    <li key="ellipsis" className="breadcrumb-item">
      {ellipsisContent}
    </li>
  );
}

/** Render a single breadcrumb page item */
function renderPageItem(
  item: BreadcrumbItemData,
  index: number,
  isLast: boolean,
  linkAs: BreadcrumbProps['linkAs'],
  maxLabelWidth: BreadcrumbProps['maxLabelWidth']
): React.ReactNode {
  const isActive = item.active ?? isLast;
  const validatedItemHref = item.href != null && isSafeHref(item.href) ? item.href : '#';
  const safeItemHref = item.href != null ? validatedItemHref : undefined;

  return (
    <BreadcrumbItem
      key={item.id ?? index}
      href={safeItemHref}
      icon={item.icon}
      active={isActive}
      onClick={item.onClick}
      linkAs={linkAs}
      maxLabelWidth={maxLabelWidth}
    >
      {item.label}
    </BreadcrumbItem>
  );
}

// =============================================================================
// Breadcrumb Component
// =============================================================================

export const Breadcrumb = memo(
  forwardRef<HTMLElement, BreadcrumbProps>(function Breadcrumb(
    {
      items,
      children,
      separator = '/',
      maxItems,
      itemsAfterCollapse = 1,
      itemsBeforeCollapse = 1,
      onExpand,
      expanded: controlledExpanded,
      expandText = 'Show hidden breadcrumbs',
      linkAs,
      maxLabelWidth,
      renderCollapsedItems,
      structuredData = false,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      className = '',
      style,
      id,
      'data-testid': dataTestId,
      'data-test': dataTest,
    },
    ref
  ) {
    // FSM-based state management for expand/collapse
    const [fsmState, dispatch] = useReducer(
      breadcrumbFSMReducer,
      controlledExpanded,
      createInitialBreadcrumbFSMState
    );

    // Sync FSM state when controlled prop changes
    useEffect(() => {
      dispatch(resetFromPropsEvent(controlledExpanded));
    }, [controlledExpanded]);

    const isExpanded = isFSMExpanded(fsmState);

    const handleEllipsisClick = useCallback((): void => {
      dispatch(expandEvent());
      onExpand?.();
    }, [onExpand]);

    // Accessible label with fallback chain
    const navAriaLabel = useMemo(() => {
      if (ariaLabelledBy) {return undefined;}
      if (ariaLabel) {return ariaLabel;}
      if (id) {return `Breadcrumb ${id}`;}
      return 'Breadcrumb';
    }, [ariaLabel, ariaLabelledBy, id]);

    // Separator handling: string → CSS variable; ReactNode → inline rendering
    const useInlineSeparator = !isStringSeparator(separator);

    const separatorStyle = useMemo<React.CSSProperties | undefined>(() => {
      if (useInlineSeparator) {
        // Hide the CSS-generated separator when using inline ReactNode separators
        return { '--bs-breadcrumb-divider': "''" } as React.CSSProperties;
      }
      return separator !== '/'
        ? ({ '--bs-breadcrumb-divider': `'${separator}'` } as React.CSSProperties)
        : undefined;
    }, [separator, useInlineSeparator]);

    // Render items (data-driven mode)
    const renderedItems = useMemo(() => {
      if (!items || items.length === 0) {return null;}

      const shouldCollapse = maxItems != null && items.length > maxItems && !isExpanded;

      let displayItems: (BreadcrumbItemData | 'ellipsis')[] = items;
      let hiddenItems: BreadcrumbItemData[] = [];

      if (shouldCollapse) {
        ({ displayItems, hiddenItems } = collapseItems(items, itemsBeforeCollapse, itemsAfterCollapse));
      }

      const elements: React.ReactNode[] = [];

      for (const [index, item] of displayItems.entries()) {
        if (useInlineSeparator && index > 0) {
          elements.push(renderInlineSeparator(item, index, separator));
        }

        if (item === 'ellipsis') {
          elements.push(
            renderEllipsisItem(hiddenItems, renderCollapsedItems, handleEllipsisClick, expandText, isExpanded)
          );
          continue;
        }

        const isLast = index === displayItems.length - 1;
        elements.push(renderPageItem(item, index, isLast, linkAs, maxLabelWidth));
      }

      return (
        <ol className="breadcrumb mb-0" style={separatorStyle}>
          {elements}
        </ol>
      );
    }, [
      items,
      maxItems,
      itemsAfterCollapse,
      itemsBeforeCollapse,
      isExpanded,
      separatorStyle,
      linkAs,
      handleEllipsisClick,
      expandText,
      renderCollapsedItems,
      maxLabelWidth,
      useInlineSeparator,
      separator,
    ]);

    // Render children (compound component mode)
    const renderedChildren = useMemo(() => {
      if (!children) {return null;}

      // For inline separators in compound mode, we can't auto-insert between children
      // because we don't control the children structure — use CSS variable approach
      return (
        <ol className="breadcrumb mb-0" style={separatorStyle}>
          {children}
        </ol>
      );
    }, [children, separatorStyle]);

    // Schema.org JSON-LD
    const jsonLd = structuredData && items && items.length > 0
      ? generateStructuredData(items)
      : null;

    return (
      <>
        {jsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: jsonLd }}
          />
        )}
        <nav
          ref={ref}
          aria-label={navAriaLabel}
          aria-labelledby={ariaLabelledBy}
          className={className || undefined}
          style={style}
          id={id}
          data-visual-state={fsmState.expandState}
          data-testid={dataTestId}
          data-test={dataTest}
        >
          {items ? renderedItems : renderedChildren}
        </nav>
      </>
    );
  })
);

Breadcrumb.displayName = 'Breadcrumb';

// =============================================================================
// Exports
// =============================================================================

export type { BreadcrumbItemData, BreadcrumbItemProps, BreadcrumbProps };
