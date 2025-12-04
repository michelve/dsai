import { forwardRef, type KeyboardEvent, type MouseEvent } from 'react';

import { isExternalUrl } from '../../utils/types';
import { isSafeHref } from '../../utils/validation';

import type { ListGroupItemData, ListGroupItemProps, ListGroupProps } from './ListGroup.types';

// =============================================================================
// Security: HREF Validation
// =============================================================================

/**
 * Validates if an href is safe to use
 * Blocks dangerous protocols like javascript:, data:, vbscript:
 * @param href - The href to validate
 * @returns true if the href is safe, false otherwise
 */

/**
 * Detects if a URL is external
 * @param href - The href to check
 * @returns true if the href is external, false otherwise
 */

// =============================================================================
// ListGroupItem Component
// =============================================================================

/**
 * ListGroupItem component - individual list item
 *
 * @see https://getbootstrap.com/docs/5.3/components/list-group/
 */
export const ListGroupItem = forwardRef<HTMLElement, ListGroupItemProps>(function ListGroupItem(
  {
    children,
    variant,
    active = false,
    disabled = false,
    badge,
    icon,
    href,
    onClick,
    as,
    className = '',
    style,
    tabIndex,
  },
  ref
) {
  // Determine element type
  const isInteractive = Boolean(href || onClick);
  let Element: React.ElementType = as ?? 'li';

  if (!as) {
    if (href) {
      Element = 'a';
    } else if (onClick) {
      Element = 'button';
    }
  }

  // Build item classes
  const itemClasses = [
    'list-group-item',
    isInteractive && 'list-group-item-action',
    active && 'active',
    disabled && 'disabled',
    variant && `list-group-item-${variant}`,
    badge && 'd-flex justify-content-between align-items-center',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // Handle click
  const handleClick = (e: MouseEvent<HTMLElement>): void => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    onClick?.();
  };

  // Handle keyboard
  const handleKeyDown = (e: KeyboardEvent<HTMLElement>): void => {
    if (disabled) {
      return;
    }
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.();
    }
  };

  // Render content
  const content = (
    <>
      {icon && <span className="me-2">{icon}</span>}
      <span className={badge ? 'flex-grow-1' : undefined}>{children}</span>
      {badge && <span>{badge}</span>}
    </>
  );

  // Common props
  const commonProps = {
    className: itemClasses,
    style,
    'aria-current': active ? ('true' as const) : undefined,
    'aria-disabled': disabled || undefined,
  };

  // Render based on element type
  // Links are wrapped in li for proper list semantics
  if (Element === 'a') {
    // Sanitize href to prevent XSS
    const safeHref = isSafeHref(href) ? href : '#';
    const isExternal = isExternalUrl(safeHref);

    return (
      <li className="p-0 border-0 bg-transparent">
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={disabled ? undefined : safeHref}
          onClick={onClick ? handleClick : undefined}
          tabIndex={disabled ? -1 : tabIndex}
          rel={isExternal ? 'noopener noreferrer' : undefined}
          {...commonProps}
          className={`${itemClasses} d-block`}
        >
          {content}
        </a>
      </li>
    );
  }

  // Buttons are wrapped in li for proper list semantics
  if (Element === 'button') {
    return (
      <li className="p-0 border-0 bg-transparent">
        <button
          ref={ref as React.Ref<HTMLButtonElement>}
          type="button"
          disabled={disabled}
          onClick={handleClick}
          tabIndex={tabIndex}
          {...commonProps}
          className={`${itemClasses} w-100 text-start`}
        >
          {content}
        </button>
      </li>
    );
  }

  // For div with onClick, use button semantics
  // Wrap in li for proper list semantics when used within ListGroup
  if (isInteractive && as === 'div') {
    return (
      <li className="p-0 border-0 bg-transparent">
        <button
          ref={ref as React.Ref<HTMLButtonElement>}
          type="button"
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          tabIndex={disabled ? -1 : (tabIndex ?? 0)}
          {...commonProps}
          className={`${itemClasses} d-block w-100 text-start border-0`}
        >
          {content}
        </button>
      </li>
    );
  }

  // Default: non-interactive li or div
  if (Element === 'div') {
    return (
      <li className="p-0 border-0 bg-transparent">
        <div ref={ref as React.Ref<HTMLDivElement>} {...commonProps} className={`${itemClasses}`}>
          {content}
        </div>
      </li>
    );
  }

  return (
    <li ref={ref as React.Ref<HTMLLIElement>} {...commonProps}>
      {content}
    </li>
  );
});

ListGroupItem.displayName = 'ListGroupItem';

// =============================================================================
// ListGroup Component
// =============================================================================

/**
 * ListGroup component - displays lists of content
 *
 * A Bootstrap 5 list group component for displaying lists of content.
 * Supports variants, interactive items, and badges/icons.
 *
 * @see https://getbootstrap.com/docs/5.3/components/list-group/
 *
 * @example
 * ```tsx
 * // Using items prop
 * <ListGroup
 *   items={[
 *     { content: 'Item 1' },
 *     { content: 'Item 2', active: true },
 *     { content: 'Item 3', disabled: true },
 *   ]}
 * />
 *
 * // Using compound components
 * <ListGroup>
 *   <ListGroupItem>Item 1</ListGroupItem>
 *   <ListGroupItem active>Item 2</ListGroupItem>
 *   <ListGroupItem disabled>Item 3</ListGroupItem>
 * </ListGroup>
 * ```
 */
export const ListGroup = forwardRef<HTMLUListElement | HTMLOListElement, ListGroupProps>(
  function ListGroup(
    {
      items,
      children,
      variant = 'default',
      horizontal = false,
      ordered = false,
      className = '',
      style,
      id,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
    },
    ref
  ) {
    // Determine element type
    const Element = ordered || variant === 'numbered' ? 'ol' : 'ul';

    // Build horizontal class
    const getHorizontalClass = (): string => {
      if (!horizontal) {
        return '';
      }
      if (horizontal === true) {
        return 'list-group-horizontal';
      }
      return `list-group-horizontal-${horizontal}`;
    };

    // Build list classes
    const listClasses = [
      'list-group',
      variant === 'flush' && 'list-group-flush',
      variant === 'numbered' && 'list-group-numbered',
      getHorizontalClass(),
      className,
    ]
      .filter(Boolean)
      .join(' ');

    // Render using items prop
    const renderWithItems = (): React.ReactNode => {
      if (!items || items.length === 0) {
        return null;
      }

      return items.map((item, index) => (
        <ListGroupItem
          key={item.id ?? index}
          variant={item.variant}
          active={item.active}
          disabled={item.disabled}
          badge={item.badge}
          icon={item.icon}
          href={item.href}
          onClick={item.onClick}
        >
          {item.content}
        </ListGroupItem>
      ));
    };

    return (
      <Element
        ref={ref as React.Ref<HTMLUListElement & HTMLOListElement>}
        className={listClasses}
        style={style}
        id={id}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
      >
        {items ? renderWithItems() : children}
      </Element>
    );
  }
);

ListGroup.displayName = 'ListGroup';

// =============================================================================
// Exports
// =============================================================================

export type { ListGroupItemData, ListGroupItemProps, ListGroupProps };
