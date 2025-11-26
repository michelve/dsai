import {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  type MouseEvent,
} from 'react';

import {
  breadcrumbFSMReducer,
  createInitialBreadcrumbFSMState,
  expandEvent,
  isExpanded as isFSMExpanded,
  resetFromPropsEvent,
} from './Breadcrumb.fsm';
import type { BreadcrumbItemData, BreadcrumbItemProps, BreadcrumbProps } from './Breadcrumb.types';

// =============================================================================
// Security: HREF Validation
// =============================================================================

/**
 * Validates if an href is safe to use
 * Blocks dangerous protocols like javascript:, data:, vbscript:
 * @param href - The href to validate
 * @returns true if the href is safe, false otherwise
 */
function isSafeHref(href?: string): boolean {
  if (!href || typeof href !== 'string') {
    return true; // undefined/null is safe (will default to #)
  }

  // Trim whitespace for validation
  const trimmed = href.trim().toLowerCase();

  // Block dangerous protocols
  const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:'];
  for (const protocol of dangerousProtocols) {
    if (trimmed.startsWith(protocol)) {
      return false;
    }
  }

  return true;
}

/**
 * Detects if a URL is external
 * @param href - The href to check
 * @returns true if the href is external, false otherwise
 */
function isExternalUrl(href?: string): boolean {
  if (!href || typeof href !== 'string') {
    return false;
  }

  return href.startsWith('http://') || href.startsWith('https://');
}

// =============================================================================
// BreadcrumbItem Component
// =============================================================================

/**
 * BreadcrumbItem component - individual breadcrumb link or text
 *
 * @see https://getbootstrap.com/docs/5.3/components/breadcrumb/
 */
const BreadcrumbItemComponent = forwardRef<HTMLLIElement, BreadcrumbItemProps>(
  function BreadcrumbItem(
    { children, href, icon, active = false, onClick, className = '', style, linkAs: LinkComponent },
    ref
  ) {
    // Build item classes with memoization
    const itemClasses = useMemo(() => {
      return ['breadcrumb-item', active && 'active', className].filter(Boolean).join(' ');
    }, [active, className]);

    // Validate and sanitize href
    const safeHref = isSafeHref(href) ? href : '#';
    const isExternal = isExternalUrl(safeHref);
    const relAttribute = isExternal ? 'noopener noreferrer' : undefined;

    // Handle click
    const handleClick = (e: MouseEvent<HTMLAnchorElement>): void => {
      if (onClick) {
        e.preventDefault();
        onClick();
      }
    };

    // Render content with optional icon
    const content = useMemo(
      () => (
        <>
          {icon && (
            <span className="me-1" aria-hidden="true">
              {icon}
            </span>
          )}
          {children}
        </>
      ),
      [icon, children]
    );

    // Render as link or text based on active state and href
    const renderContent = (): React.ReactNode => {
      if (active) {
        return content;
      }

      if (safeHref || onClick) {
        if (LinkComponent) {
          return (
            <LinkComponent
              href={safeHref ?? '#'}
              onClick={onClick ? handleClick : undefined}
              rel={relAttribute}
            >
              {content}
            </LinkComponent>
          );
        }

        return (
          <a href={safeHref ?? '#'} onClick={onClick ? handleClick : undefined} rel={relAttribute}>
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

BreadcrumbItemComponent.displayName = 'BreadcrumbItem';

// Memoize BreadcrumbItem for performance
export const BreadcrumbItem = memo(BreadcrumbItemComponent);

// Set displayName on the memoized component for DevTools
BreadcrumbItem.displayName = 'BreadcrumbItem';

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
      linkAs,
      'aria-label': ariaLabel = 'Breadcrumb',
      className = '',
      style,
      id,
    },
    ref
  ) {
    // FSM-based state management for expand/collapse behavior
    const [fsmState, dispatch] = useReducer(
      breadcrumbFSMReducer,
      controlledExpanded,
      createInitialBreadcrumbFSMState
    );

    // Sync FSM state when controlled prop changes
    useEffect(() => {
      dispatch(resetFromPropsEvent(controlledExpanded));
    }, [controlledExpanded]);

    // Derive isExpanded from FSM state
    const isExpanded = isFSMExpanded(fsmState);

    // Handle ellipsis click - dispatch EXPAND event to FSM
    const handleEllipsisClick = useCallback((): void => {
      dispatch(expandEvent());
      onExpand?.();
    }, [onExpand]);

    // Build nav classes with memoization
    const navClasses = useMemo(() => {
      return [className].filter(Boolean).join(' ');
    }, [className]);

    // Custom separator style with memoization
    const separatorStyle = useMemo<React.CSSProperties | undefined>(() => {
      return separator !== '/'
        ? ({ '--bs-breadcrumb-divider': `'${separator}'` } as React.CSSProperties)
        : undefined;
    }, [separator]);

    // Render using items prop with memoization
    const renderWithItems = useMemo(() => {
      return (): React.ReactNode => {
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
                      aria-expanded={isExpanded}
                    >
                      …
                    </button>
                  </li>
                );
              }

              const isLast = index === displayItems.length - 1;
              const isActive = item.active ?? isLast;
              // Validate item href
              const safeItemHref = isSafeHref(item.href) ? item.href : '#';

              return (
                <BreadcrumbItem
                  key={item.id ?? index}
                  href={safeItemHref}
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
    }, [
      items,
      maxItems,
      itemsAfterCollapse,
      itemsBeforeCollapse,
      isExpanded,
      separatorStyle,
      linkAs,
      handleEllipsisClick,
    ]);

    // Render using children with memoization
    const renderWithChildren = useMemo(() => {
      return (): React.ReactNode => {
        return (
          <ol className="breadcrumb mb-0" style={separatorStyle}>
            {children}
          </ol>
        );
      };
    }, [children, separatorStyle]);

    return (
      <nav
        ref={ref}
        aria-label={ariaLabel}
        className={navClasses || undefined}
        style={style}
        id={id}
        data-visual-state={fsmState.expandState}
      >
        {items ? renderWithItems() : renderWithChildren()}
      </nav>
    );
  })
);

Breadcrumb.displayName = 'Breadcrumb';

// =============================================================================
// Exports
// =============================================================================

export type { BreadcrumbItemData, BreadcrumbItemProps, BreadcrumbProps };
