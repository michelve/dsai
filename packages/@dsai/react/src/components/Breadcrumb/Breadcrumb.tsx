import { forwardRef, useState, type MouseEvent } from 'react';

import type { BreadcrumbItemData, BreadcrumbItemProps, BreadcrumbProps } from './Breadcrumb.types';

// =============================================================================
// BreadcrumbItem Component
// =============================================================================

/**
 * BreadcrumbItem component - individual breadcrumb link or text
 *
 * @see https://getbootstrap.com/docs/5.3/components/breadcrumb/
 */
export const BreadcrumbItem = forwardRef<HTMLLIElement, BreadcrumbItemProps>(
  function BreadcrumbItem(
    { children, href, icon, active = false, onClick, className = '', style, linkAs: LinkComponent },
    ref
  ) {
    // Build item classes
    const itemClasses = ['breadcrumb-item', active && 'active', className]
      .filter(Boolean)
      .join(' ');

    // Handle click
    const handleClick = (e: MouseEvent<HTMLAnchorElement>): void => {
      if (onClick) {
        e.preventDefault();
        onClick();
      }
    };

    // Render content with optional icon
    const content = (
      <>
        {icon && <span className="me-1">{icon}</span>}
        {children}
      </>
    );

    // Render as link or text based on active state and href
    const renderContent = (): React.ReactNode => {
      if (active) {
        return content;
      }

      if (href || onClick) {
        if (LinkComponent) {
          return (
            <LinkComponent href={href} onClick={onClick ? handleClick : undefined}>
              {content}
            </LinkComponent>
          );
        }

        return (
          <a href={href ?? '#'} onClick={onClick ? handleClick : undefined}>
            {content}
          </a>
        );
      }

      return content;
    };

    return (
      <li
        ref={ref}
        className={itemClasses}
        style={style}
        aria-current={active ? 'page' : undefined}
      >
        {renderContent()}
      </li>
    );
  }
);

BreadcrumbItem.displayName = 'BreadcrumbItem';

// =============================================================================
// Breadcrumb Component
// =============================================================================

/**
 * Breadcrumb navigation component
 *
 * A Bootstrap 5 breadcrumb component for hierarchical navigation.
 * Supports custom separators, collapsible items, and router integration.
 *
 * @see https://getbootstrap.com/docs/5.3/components/breadcrumb/
 *
 * @example
 * ```tsx
 * // Using items prop
 * <Breadcrumb
 *   items={[
 *     { label: 'Home', href: '/' },
 *     { label: 'Products', href: '/products' },
 *     { label: 'Category', active: true },
 *   ]}
 * />
 *
 * // Using compound components
 * <Breadcrumb>
 *   <BreadcrumbItem href="/">Home</BreadcrumbItem>
 *   <BreadcrumbItem href="/products">Products</BreadcrumbItem>
 *   <BreadcrumbItem active>Category</BreadcrumbItem>
 * </Breadcrumb>
 * ```
 */
export const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(function Breadcrumb(
  {
    items,
    children,
    separator = '/',
    maxItems,
    itemsAfterCollapse = 1,
    itemsBeforeCollapse = 1,
    onExpand,
    expanded: controlledExpanded,
    linkAs,
    'aria-label': ariaLabel = 'Breadcrumb',
    className = '',
    style,
    id,
  },
  ref
) {
  // Internal expanded state for uncontrolled mode
  const [internalExpanded, setInternalExpanded] = useState(false);
  const isExpanded = controlledExpanded ?? internalExpanded;

  // Handle ellipsis click
  const handleEllipsisClick = (): void => {
    if (controlledExpanded === undefined) {
      setInternalExpanded(true);
    }
    onExpand?.();
  };

  // Build nav classes
  const navClasses = ['', className].filter(Boolean).join(' ');

  // Custom separator style
  const separatorStyle =
    separator !== '/'
      ? ({ '--bs-breadcrumb-divider': `'${separator}'` } as React.CSSProperties)
      : undefined;

  // Render using items prop
  const renderWithItems = (): React.ReactNode => {
    if (!items || items.length === 0) {
      return null;
    }

    // Determine if we need to collapse
    const shouldCollapse = maxItems && items.length > maxItems && !isExpanded;

    let displayItems: (BreadcrumbItemData | 'ellipsis')[] = items;

    if (shouldCollapse) {
      const beforeItems = items.slice(0, itemsBeforeCollapse);
      const afterItems = items.slice(items.length - itemsAfterCollapse);
      displayItems = [...beforeItems, 'ellipsis', ...afterItems];
    }

    return (
      <ol className="breadcrumb mb-0" style={separatorStyle}>
        {displayItems.map((item, index) => {
          if (item === 'ellipsis') {
            return (
              <li key="ellipsis" className="breadcrumb-item">
                <button
                  type="button"
                  className="btn btn-link p-0 border-0 text-decoration-none"
                  onClick={handleEllipsisClick}
                  aria-label="Show hidden breadcrumbs"
                >
                  …
                </button>
              </li>
            );
          }

          const isLast = index === displayItems.length - 1;
          const isActive = item.active ?? isLast;

          return (
            <BreadcrumbItem
              key={item.id ?? index}
              href={item.href}
              icon={item.icon}
              active={isActive}
              onClick={item.onClick}
              linkAs={linkAs}
            >
              {item.label}
            </BreadcrumbItem>
          );
        })}
      </ol>
    );
  };

  // Render using children
  const renderWithChildren = (): React.ReactNode => {
    return (
      <ol className="breadcrumb mb-0" style={separatorStyle}>
        {children}
      </ol>
    );
  };

  return (
    <nav ref={ref} aria-label={ariaLabel} className={navClasses || undefined} style={style} id={id}>
      {items ? renderWithItems() : renderWithChildren()}
    </nav>
  );
});

Breadcrumb.displayName = 'Breadcrumb';

// =============================================================================
// Exports
// =============================================================================

export type { BreadcrumbItemData, BreadcrumbItemProps, BreadcrumbProps };
