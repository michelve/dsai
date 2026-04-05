import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  memo,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useReducer,
  useRef,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from 'react';

import { useControllableState } from '../../hooks/useControllableState';
import { useRovingFocus } from '../../hooks/useRovingFocus';
import { cn } from '../../utils';
import { mergeRefs } from '../../utils/dom/mergeRefs';
import { isEnterKey } from '../../utils/keyboard';
import { isExternalUrl } from '../../utils/types';
import { isSafeHref } from '../../utils/validation';

import { ListGroupContext, useListGroupContext } from './ListGroup.context';
import { createInitialListGroupFSMState, listGroupFSMReducer } from './ListGroup.fsm';
import { ListGroupDivider } from './ListGroupDivider';
import { ListGroupHeader } from './ListGroupHeader';

import type {
  ListGroupEntry,
  ListGroupItemData,
  ListGroupItemProps,
  ListGroupProps,
} from './ListGroup.types';

// Optional peer dependency — @tanstack/react-virtual
// Uses require() because static imports can't be try/caught.
// tsup compiles this to ESM (with createRequire shim) and CJS (native require).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let useVirtualizerFn: ((...args: any[]) => any) | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const virtual = require('@tanstack/react-virtual');
  useVirtualizerFn = virtual.useVirtualizer;
} catch {
  // @tanstack/react-virtual not installed — virtualization unavailable
}

// =============================================================================
// Helpers
// =============================================================================

/**
 * Normalize an activeKey value to an array of strings
 */
function normalizeActiveKey(value: string | string[] | undefined): string[] {
  if (value === undefined) {
    return [];
  }
  if (Array.isArray(value)) {
    return value;
  }
  return [value];
}

/**
 * Type guard: true when the entry is a ListGroupItemData (no 'type' discriminant)
 */
function isListGroupItemData(entry: ListGroupEntry): entry is ListGroupItemData {
  return !('type' in entry);
}

/**
 * Separate children into main content and nested ListGroup components
 */
function separateChildren(children: ReactNode): {
  mainContent: ReactNode[];
  nestedContent: ReactNode[];
} {
  const mainContent: ReactNode[] = [];
  const nestedContent: ReactNode[] = [];

  Children.forEach(children, (child) => {
    if (
      isValidElement(child) &&
      typeof child.type !== 'string' &&
      'displayName' in child.type &&
      (child.type as { displayName?: string }).displayName === 'ListGroup'
    ) {
      nestedContent.push(child);
    } else {
      mainContent.push(child);
    }
  });

  return { mainContent, nestedContent };
}

// =============================================================================
// ListGroupItem Component
// =============================================================================

/**
 * ListGroupItem component - individual list item
 *
 * @see https://getbootstrap.com/docs/5.3/components/list-group/
 */
const ListGroupItemInner = forwardRef<HTMLElement, ListGroupItemProps>(function ListGroupItem(
  {
    children,
    description,
    variant,
    active: activeProp,
    disabled = false,
    badge,
    icon,
    href,
    onClick,
    as,
    className = '',
    style,
    tabIndex,
    eventKey,
    collapsible,
    defaultExpanded,
    expanded,
    onExpandedChange,
    ...rest
  },
  ref
) {
  // Consume context for managed selection
  const context = useListGroupContext();

  // Determine active state:
  // - Explicit active prop (when not undefined) always wins
  // - Otherwise derive from context if eventKey exists
  // - Otherwise fall back to false
  let active: boolean;
  if (activeProp !== undefined) {
    active = activeProp;
  } else if (eventKey !== undefined && context !== null) {
    active = context.activeKeys.has(eventKey);
  } else {
    active = false;
  }

  // Whether this item participates in listbox semantics
  const isListboxItem = context?.onSelect !== undefined && eventKey !== undefined;

  // Determine element type
  const isInteractive = Boolean(href || onClick || isListboxItem);
  let Element: React.ElementType = as ?? 'li';

  if (!as) {
    if (href) {
      Element = 'a';
    } else if (onClick || isListboxItem) {
      Element = 'button';
    }
  }

  // Build item classes
  const itemClasses = cn(
    'list-group-item',
    isInteractive && 'list-group-item-action',
    active && 'active',
    disabled && 'disabled',
    variant && `list-group-item-${variant}`,
    !!badge && 'd-flex justify-content-between align-items-center',
    className
  );

  // Handle click — also fire context onSelect when applicable
  const handleClick = (e: MouseEvent<HTMLElement>): void => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
    if (context?.onSelect && eventKey !== undefined) {
      context.onSelect(eventKey, e);
    }
  };

  // Handle keyboard
  const handleKeyDown = (e: KeyboardEvent<HTMLElement>): void => {
    if (disabled) {
      return;
    }
    if (isEnterKey(e) || e.key === ' ') {
      e.preventDefault();
      if (isListboxItem && context?.onSelect && eventKey !== undefined) {
        context.onSelect(eventKey, e);
      }
      onClick?.(e as unknown as MouseEvent<HTMLElement>);
    }
  };

  // Collapsible state management
  const [isExpanded, setIsExpanded] = useControllableState({
    value: expanded,
    defaultValue: defaultExpanded ?? false,
    onChange: onExpandedChange,
  });

  const { nestedContent, mainContent } = separateChildren(children);
  const hasNestedContent = collapsible && nestedContent.length > 0;
  const handleToggle = (): void => setIsExpanded(!isExpanded);
  const collapsibleTextId = useId();

  // Collapsible render — always renders as <li> with toggle and collapsible region
  if (hasNestedContent) {
    const collapsibleItemClasses = cn(
      'list-group-item',
      active && 'active',
      disabled && 'disabled',
      variant && `list-group-item-${variant}`,
      className
    );

    // Clone nested ListGroup children to add aria-labelledby and ps-3 indent
    const labelledNestedContent = nestedContent.map((child) => {
      if (isValidElement(child)) {
        return cloneElement(child as React.ReactElement<{ 'aria-labelledby'?: string; className?: string }>, {
          'aria-labelledby': collapsibleTextId,
          className: cn((child.props as { className?: string }).className, 'ps-3'),
        });
      }
      return child;
    });

    return (
      <li
        ref={ref as React.Ref<HTMLLIElement>}
        className={collapsibleItemClasses}
        style={{ ...style, padding: 0 }}
        {...rest}
      >
        <div
          className="d-flex align-items-center"
          style={{ padding: '0.5rem 1rem' }}
          aria-disabled={disabled || undefined}
        >
          {icon && <span className="me-2">{icon}</span>}
          <span id={collapsibleTextId} className="flex-grow-1">
            {mainContent}
            {description && (
              <small className="text-body-secondary d-block">{description}</small>
            )}
          </span>
          {badge && <span className="me-2">{badge}</span>}
          <button
            type="button"
            className="btn btn-sm border-0 p-0 ms-auto"
            onClick={(e) => {
              e.stopPropagation();
              handleToggle();
            }}
            aria-expanded={isExpanded}
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
          >
            <span
              className="d-inline-block"
              style={{
                transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease',
              }}
            >
              &#9656;
            </span>
          </button>
        </div>
        <div
          style={{
            overflow: 'hidden',
            maxHeight: isExpanded ? '1000px' : '0',
            transition: 'max-height 0.3s ease',
            ...(!isExpanded && { visibility: 'hidden' as const, height: 0 }),
          }}
        >
          {labelledNestedContent}
        </div>
      </li>
    );
  }

  // Render content
  const content = (
    <>
      {icon && <span className="me-2">{icon}</span>}
      <span className={badge ? 'flex-grow-1' : undefined}>
        {children}
        {description && <small className="text-body-secondary d-block">{description}</small>}
      </span>
      {badge && <span>{badge}</span>}
    </>
  );

  // ARIA props depend on whether we're in listbox mode
  const ariaProps = isListboxItem
    ? { role: 'option' as const, 'aria-selected': active }
    : { 'aria-current': active ? ('true' as const) : undefined };

  // Common props
  const commonProps = {
    ...rest,
    ...ariaProps,
    className: itemClasses,
    style,
    'aria-disabled': disabled || undefined,
  };

  // Wrapper li props — when in listbox context, li must have role="presentation"
  // to satisfy axe (listitem must not be inside a listbox). Also propagate active
  // class so tests can use closest('li') to check active state.
  const wrapperLiProps = isListboxItem
    ? { className: cn('p-0 border-0 bg-transparent', active && 'active'), role: 'presentation' as const }
    : { className: 'p-0 border-0 bg-transparent' };

  // Render based on element type
  // Links are wrapped in li for proper list semantics
  if (Element === 'a') {
    const safeHref = isSafeHref(href) ? href : '#';
    const isExternal = isExternalUrl(safeHref);

    return (
      <li {...wrapperLiProps}>
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={disabled ? undefined : safeHref}
          onClick={handleClick}
          tabIndex={disabled ? -1 : tabIndex}
          rel={isExternal ? 'noopener noreferrer' : undefined}
          {...commonProps}
          className={cn(itemClasses, 'd-block')}
        >
          {content}
        </a>
      </li>
    );
  }

  // Buttons are wrapped in li for proper list semantics
  if (Element === 'button') {
    return (
      <li {...wrapperLiProps}>
        <button
          ref={ref as React.Ref<HTMLButtonElement>}
          type="button"
          disabled={disabled}
          onClick={handleClick}
          onKeyDown={isListboxItem ? handleKeyDown : undefined}
          tabIndex={tabIndex}
          {...commonProps}
          className={cn(itemClasses, 'w-100', 'text-start')}
        >
          {content}
        </button>
      </li>
    );
  }

  // For div with onClick, use button semantics
  if (isInteractive && as === 'div') {
    return (
      <li {...wrapperLiProps}>
        <button
          ref={ref as React.Ref<HTMLButtonElement>}
          type="button"
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          tabIndex={disabled ? -1 : (tabIndex ?? 0)}
          {...commonProps}
          className={cn(itemClasses, 'd-block', 'w-100', 'text-start', 'border-0')}
        >
          {content}
        </button>
      </li>
    );
  }

  // Default: non-interactive div
  if (Element === 'div') {
    return (
      <li {...wrapperLiProps}>
        <div ref={ref as React.Ref<HTMLDivElement>} {...commonProps} className={itemClasses}>
          {content}
        </div>
      </li>
    );
  }

  // Default: non-interactive li
  return (
    <li ref={ref as React.Ref<HTMLLIElement>} {...commonProps}>
      {content}
    </li>
  );
});

ListGroupItemInner.displayName = 'ListGroupItem';

export const ListGroupItem = memo(ListGroupItemInner);
ListGroupItem.displayName = 'ListGroupItem';

// =============================================================================
// Entry rendering helpers (extracted to reduce complexity)
// =============================================================================

/**
 * Render a non-item entry (divider or header).
 * Returns null for unknown entry types.
 */
function renderNonItemEntry(
  entry: Exclude<ListGroupEntry, ListGroupItemData>,
  dividerIndex: number,
): React.ReactNode {
  if (entry.type === 'divider') {
    return <ListGroupDivider key={`divider-${dividerIndex}`} />;
  }
  if (entry.type === 'header') {
    return (
      <ListGroupHeader key={`header-${String(entry.content)}`}>
        {entry.content}
      </ListGroupHeader>
    );
  }
  return null;
}

/**
 * Render a single ListGroupItemData entry, including nested children when collapsible.
 */
function renderItemEntry(
  entry: ListGroupItemData,
  index: number,
  variant: ListGroupProps['variant'],
  renderEntriesFn: (entries: ListGroupEntry[]) => React.ReactNode,
): React.ReactNode {
  const hasChildren = entry.collapsible && entry.children && entry.children.length > 0;

  return (
    <ListGroupItem
      key={entry.id ?? index}
      eventKey={entry.eventKey}
      variant={entry.variant}
      active={entry.active}
      disabled={entry.disabled}
      badge={entry.badge}
      icon={entry.icon}
      href={entry.href}
      onClick={entry.onClick}
      description={entry.description}
      collapsible={entry.collapsible}
      defaultExpanded={entry.defaultExpanded}
      expanded={entry.expanded}
      onExpandedChange={entry.onExpandedChange}
    >
      {entry.content}
      {hasChildren && (
        <ListGroupInner variant={variant} className="ps-3">
          {renderEntriesFn(entry.children!)}
        </ListGroupInner>
      )}
    </ListGroupItem>
  );
}

/**
 * Resolve the horizontal layout CSS class.
 */
function resolveHorizontalClass(horizontal: ListGroupProps['horizontal']): string {
  if (!horizontal) {
    return '';
  }
  if (horizontal === true) {
    return 'list-group-horizontal';
  }
  return `list-group-horizontal-${horizontal}`;
}

/**
 * Build ARIA props for listbox mode.
 */
function buildListboxProps(
  onSelect: ListGroupProps['onSelect'],
  selectionMode: ListGroupProps['selectionMode'],
): Record<string, unknown> {
  if (onSelect === undefined) {
    return {};
  }
  return {
    role: 'listbox' as const,
    'aria-multiselectable': selectionMode === 'multiple' ? (true as const) : undefined,
  };
}

// =============================================================================
// ListGroup Component
// =============================================================================

/**
 * ListGroup component - displays lists of content
 *
 * A Bootstrap 5 list group component for displaying lists of content.
 * Supports variants, interactive items, badges/icons, and managed selection.
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
 *
 * // With managed selection
 * <ListGroup onSelect={(key) => console.log(key)} defaultActiveKey="1">
 *   <ListGroupItem eventKey="1">Item 1</ListGroupItem>
 *   <ListGroupItem eventKey="2">Item 2</ListGroupItem>
 * </ListGroup>
 * ```
 */
const ListGroupInner = forwardRef<HTMLUListElement | HTMLOListElement, ListGroupProps>(
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
      activeKey,
      defaultActiveKey,
      onSelect,
      selectionMode = 'single',
      loading = false,
      emptyContent,
      virtualized = false,
      itemHeight: _itemHeight,
      overscan: _overscan = 5,
      ...rest
    },
    ref
  ) {
    // Determine if controlled
    const isControlled = activeKey !== undefined;

    // Initialize FSM state
    const initialActiveKeys = normalizeActiveKey(isControlled ? activeKey : defaultActiveKey);
    const [fsmState, dispatch] = useReducer(
      listGroupFSMReducer,
      { activeKeys: initialActiveKeys, selectionMode },
      ({ activeKeys: keys, selectionMode: mode }) => createInitialListGroupFSMState(keys, mode)
    );

    // Sync controlled props via RESET_FROM_PROPS
    useEffect(() => {
      if (isControlled) {
        dispatch({
          type: 'RESET_FROM_PROPS',
          activeKeys: normalizeActiveKey(activeKey),
        });
      }
    }, [isControlled, activeKey]);

    // Handle item selection
    const handleSelect = useCallback(
      (eventKey: string, event: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>): void => {
        if (!isControlled) {
          dispatch({ type: 'TOGGLE', eventKey });
        }
        onSelect?.(eventKey, event);
      },
      [isControlled, onSelect]
    );

    // Build context value
    const contextValue = useMemo(
      () => ({
        activeKeys: fsmState.activeKeys,
        onSelect: onSelect === undefined ? undefined : handleSelect,
        selectionMode,
      }),
      [fsmState.activeKeys, onSelect, handleSelect, selectionMode]
    );

    // Determine element type
    const Element = ordered || variant === 'numbered' ? 'ol' : 'ul';

    // Build list classes
    const listClasses = cn(
      'list-group',
      variant === 'flush' && 'list-group-flush',
      variant === 'numbered' && 'list-group-numbered',
      resolveHorizontalClass(horizontal),
      className
    );

    // Additional ARIA props when acting as listbox
    const listboxProps = buildListboxProps(onSelect, selectionMode);

    // Roving focus for arrow-key navigation in listbox mode
    const listRef = useRef<HTMLElement>(null);
    const hasSelection = onSelect !== undefined;

    const { containerProps: rovingProps } = useRovingFocus({
      containerRef: listRef,
      orientation: horizontal ? 'horizontal' : 'vertical',
      wrap: true,
      homeEnd: true,
      itemSelector: '[role="option"]',
      disabledSelector: '.disabled, [aria-disabled="true"]',
      enabled: hasSelection,
    });

    // Merge the forwarded ref with the local listRef
    const mergedRef = mergeRefs(
      ref as React.Ref<HTMLElement>,
      listRef as React.Ref<HTMLElement>,
    );

    // Render nested entries recursively for collapsible items
    let dividerCounter = 0;
    const renderEntries = (entries: ListGroupEntry[]): React.ReactNode => {
      return entries.map((entry, index) => {
        if (!isListGroupItemData(entry)) {
          dividerCounter += entry.type === 'divider' ? 1 : 0;
          return renderNonItemEntry(entry, dividerCounter);
        }
        return renderItemEntry(entry, index, variant, renderEntries);
      });
    };

    // Render using items prop
    const renderWithItems = (): React.ReactNode => {
      if (!items || items.length === 0) {return null;}
      return renderEntries(items);
    };

    // Compute final aria-label: user value wins; fallback used only for listbox
    const resolvedAriaLabel =
      ariaLabel ?? (onSelect !== undefined && !ariaLabelledBy ? 'List group' : undefined);

    // Virtualization fallback/warning
    const shouldVirtualize = virtualized && items && items.length > 0;
    if (shouldVirtualize && !useVirtualizerFn) {
      if (process.env['NODE_ENV'] !== 'production') {
        console.warn(
          'ListGroup: virtualized prop requires @tanstack/react-virtual. ' +
            'Install it with: npm install @tanstack/react-virtual'
        );
      }
      // Falls through to render all items normally
    }

    // Loading spinner rendered as a list item
    const loadingSpinner = loading ? (
      <li className="list-group-item text-center border-0" role="status">
        <span className="spinner-border spinner-border-sm" aria-hidden="true" />
        <span className="visually-hidden">Loading...</span>
      </li>
    ) : null;

    // Empty state rendered when items array is empty and emptyContent is provided
    const emptyState =
      emptyContent && items?.length === 0 ? (
        <li className="list-group-item text-center text-body-secondary border-0">{emptyContent}</li>
      ) : null;

    return (
      <ListGroupContext.Provider value={contextValue}>
        <Element
          ref={mergedRef}
          className={listClasses}
          style={loading ? { ...style, position: 'relative' as const } : style}
          id={id}
          aria-label={resolvedAriaLabel}
          aria-labelledby={ariaLabelledBy}
          {...listboxProps}
          {...rovingProps}
          {...rest}
        >
          {emptyState || (items ? renderWithItems() : children)}
          {loadingSpinner}
        </Element>
      </ListGroupContext.Provider>
    );
  }
);

ListGroupInner.displayName = 'ListGroup';

export const ListGroup = memo(ListGroupInner);
ListGroup.displayName = 'ListGroup';

// =============================================================================
// Exports
// =============================================================================

export type {
  ListGroupEntry,
  ListGroupDividerEntry,
  ListGroupHeaderEntry,
  ListGroupItemData,
  ListGroupItemProps,
  ListGroupProps,
} from './ListGroup.types';
