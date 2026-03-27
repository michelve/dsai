import {
  forwardRef,
  memo,
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';

import { useControllableState } from '../../hooks/useControllableState/useControllableState';
import { cn } from '../../utils';

import { TabsContext, useTabsContext } from './Tabs.context';
import type {
  TabItem,
  TabListProps,
  TabPanelProps,
  TabProps,
  TabsContextValue,
  TabsProps,
} from './Tabs.types';
import { useTabsKeyboard } from './useTabsKeyboard';
import { useTabsScroll } from './useTabsScroll';

import './Tabs.scroll.css';

// =============================================================================
// TabList Component
// =============================================================================

/**
 * TabList component - container for Tab buttons
 *
 * @see https://getbootstrap.com/docs/5.3/components/navs-tabs/
 */
export const TabList = memo(
  forwardRef<HTMLDivElement, TabListProps>(function TabList(
    {
      children,
      className = '',
      style,
      'aria-label': ariaLabel,
      extra,
      scrollable = false,
    },
    ref
  ) {
    const {
      orientation,
      variant,
      activeTab,
      tabs,
      baseId,
      activationMode,
      focusedTab,
      setActiveTab,
      setFocusedTab,
      onTabAdd,
    } = useTabsContext();

    const handleKeyDown = useTabsKeyboard({
      tabs,
      activeTab,
      orientation,
      activationMode,
      setActiveTab,
      setFocusedTab,
      baseId,
      focusedTab,
    });

    const {
      containerRef: scrollRef,
      canScrollStart,
      canScrollEnd,
      scrollToStart,
      scrollToEnd,
    } = useTabsScroll({ enabled: scrollable, orientation });

    const navClasses = cn(
      'nav',
      variant === 'tabs' && 'nav-tabs',
      variant === 'pills' && 'nav-pills',
      variant === 'underline' && 'nav-underline',
      orientation === 'vertical' && 'flex-column',
      className
    );

    const hasLeftRight =
      extra != null &&
      typeof extra === 'object' &&
      !Array.isArray(extra) &&
      ('left' in (extra as Record<string, unknown>) ||
        'right' in (extra as Record<string, unknown>));
    const leftExtra = hasLeftRight
      ? (extra as { left?: ReactNode }).left
      : undefined;
    const rightExtra = hasLeftRight
      ? (extra as { right?: ReactNode }).right
      : undefined;
    const simpleExtra = !hasLeftRight ? (extra as ReactNode) : undefined;

    const tabListContent = (
      // eslint-disable-next-line jsx-a11y/interactive-supports-focus
      <div
        ref={scrollable ? scrollRef : ref}
        role="tablist"
        aria-label={ariaLabel}
        aria-orientation={orientation}
        className={cn(navClasses, scrollable && 'dsai-tabs-scroll-inner')}
        style={style}
        onKeyDown={handleKeyDown}
      >
        {children}
        {onTabAdd && (
          <button
            type="button"
            className={cn('nav-link', 'dsai-tabs-add-btn')}
            onClick={onTabAdd}
            aria-label="Add tab"
            tabIndex={-1}
          >
            +
          </button>
        )}
      </div>
    );

    if (scrollable) {
      return (
        <div
          ref={ref}
          className="dsai-tabs-scroll-container d-flex align-items-center"
        >
          {leftExtra && (
            <div className="dsai-tabs-extra-left">{leftExtra}</div>
          )}
          <button
            type="button"
            className="dsai-tabs-scroll-btn dsai-tabs-scroll-btn-start"
            onClick={scrollToStart}
            disabled={!canScrollStart}
            aria-label="Scroll tabs back"
            tabIndex={-1}
          />
          {tabListContent}
          <button
            type="button"
            className="dsai-tabs-scroll-btn dsai-tabs-scroll-btn-end"
            onClick={scrollToEnd}
            disabled={!canScrollEnd}
            aria-label="Scroll tabs forward"
            tabIndex={-1}
          />
          {(rightExtra || simpleExtra) && (
            <div className="dsai-tabs-extra-right">
              {rightExtra ?? simpleExtra}
            </div>
          )}
        </div>
      );
    }

    if (extra) {
      return (
        <div ref={ref} className="d-flex align-items-center">
          {leftExtra && (
            <div className="dsai-tabs-extra-left">{leftExtra}</div>
          )}
          {tabListContent}
          {(rightExtra || simpleExtra) && (
            <div className="dsai-tabs-extra-right ms-auto">
              {rightExtra ?? simpleExtra}
            </div>
          )}
        </div>
      );
    }

    return tabListContent;
  })
);

TabList.displayName = 'TabList';

// =============================================================================
// Tab Component
// =============================================================================

/**
 * Tab component - individual tab button
 *
 * @see https://getbootstrap.com/docs/5.3/components/navs-tabs/
 */
export const Tab = memo(
  forwardRef<HTMLButtonElement, TabProps>(function Tab(
    {
      id,
      children,
      icon,
      disabled = false,
      className = '',
      style,
      closable = false,
    },
    ref
  ) {
    const {
      activeTab,
      setActiveTab,
      baseId,
      registerTab,
      unregisterTab,
      focusedTab,
      activationMode,
      onTabClose,
    } = useTabsContext();

    useEffect(() => {
      if (!disabled) {
        registerTab(id);
      }
      return () => {
        unregisterTab(id);
      };
    }, [id, disabled, registerTab, unregisterTab]);

    const isActive = activeTab === id;
    const isFocused = focusedTab === id;
    const tabId = `${baseId}-tab-${id}`;
    const panelId = `${baseId}-panel-${id}`;

    const handleClick = (): void => {
      if (!disabled) {
        setActiveTab(id);
      }
    };

    const handleClose = (e: React.MouseEvent): void => {
      e.stopPropagation();
      onTabClose?.(id);
    };

    const buttonClasses = cn(
      'nav-link',
      isActive && 'active',
      disabled && 'disabled',
      closable && 'dsai-tabs-closable',
      className
    );

    return (
      <button
        ref={ref}
        type="button"
        role="tab"
        id={tabId}
        aria-selected={isActive}
        aria-controls={panelId}
        aria-disabled={disabled || undefined}
        tabIndex={
          isActive || (activationMode === 'manual' && isFocused) ? 0 : -1
        }
        disabled={disabled}
        className={buttonClasses}
        style={style}
        data-state={isActive ? 'active' : 'inactive'}
        onClick={handleClick}
      >
        {icon && <span className="me-2">{icon}</span>}
        {children}
        {closable && onTabClose && (
          <span
            role="button"
            className="btn-close btn-close-sm ms-2"
            aria-label={`Close ${typeof children === 'string' ? children : 'tab'}`}
            onClick={handleClose}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                e.stopPropagation();
                onTabClose(id);
              }
            }}
            tabIndex={-1}
          />
        )}
      </button>
    );
  })
);

Tab.displayName = 'Tab';

// =============================================================================
// TabPanel Component
// =============================================================================

/**
 * TabPanel component - content panel for a tab
 *
 * @see https://getbootstrap.com/docs/5.3/components/navs-tabs/
 */
export const TabPanel = memo(
  forwardRef<HTMLDivElement, TabPanelProps>(function TabPanel(
    { id, children, className = '', style, keepMounted = false },
    ref
  ) {
    const { activeTab, baseId, lazyMount, unmountOnExit, mountedTabs } =
      useTabsContext();

    const isActive = activeTab === id;
    const hasBeenMounted = mountedTabs.has(id);
    const tabId = `${baseId}-tab-${id}`;
    const panelId = `${baseId}-panel-${id}`;

    // Determine whether to render
    const shouldRender = (() => {
      if (isActive) {
        return true;
      }
      if (keepMounted) {
        return true;
      }
      if (unmountOnExit) {
        return false;
      }
      if (lazyMount && !hasBeenMounted) {
        return false;
      }
      return true;
    })();

    if (!shouldRender) {
      return null;
    }

    const panelClasses = cn(
      'tab-pane',
      'fade',
      isActive && 'show active',
      className
    );

    return (
      <div
        ref={ref}
        role="tabpanel"
        id={panelId}
        aria-labelledby={tabId}
        tabIndex={0}
        className={panelClasses}
        style={style}
        hidden={!isActive}
        data-state={isActive ? 'active' : 'inactive'}
      >
        {children}
      </div>
    );
  })
);

TabPanel.displayName = 'TabPanel';

// =============================================================================
// Tabs Container Component
// =============================================================================

/**
 * Tabs component - accessible tabbed interface
 *
 * @see https://getbootstrap.com/docs/5.3/components/navs-tabs/
 */
export const Tabs = memo(
  forwardRef<HTMLDivElement, TabsProps>(function Tabs(
    {
      items,
      children,
      activeTab: controlledActiveTab,
      defaultActiveTab,
      onTabChange,
      orientation = 'horizontal',
      variant = 'tabs',
      fill = false,
      justified = false,
      className = '',
      style,
      id: providedId,
      activationMode = 'automatic',
      lazyMount = false,
      unmountOnExit = false,
      onTabClose,
      onTabAdd,
    },
    ref
  ) {
    const generatedId = useId();
    const baseId = providedId ?? generatedId;

    // Determine default tab
    const defaultTab =
      defaultActiveTab ??
      (items && items.length > 0 && items[0] ? items[0].id : '');

    const [activeTab, setActiveTab] = useControllableState<string>({
      value: controlledActiveTab,
      defaultValue: defaultTab,
      onChange: onTabChange,
    });

    // Tab registration for keyboard navigation
    const [registeredTabs, setRegisteredTabs] = useState<string[]>([]);

    // Track which tabs have been mounted (for lazyMount)
    const [mountedTabs, setMountedTabs] = useState<Set<string>>(
      () => new Set(activeTab ? [activeTab] : [])
    );

    // Track focused tab (for manual activation mode)
    const [focusedTab, setFocusedTab] = useState<string | null>(null);

    // Update mountedTabs when activeTab changes
    const prevActiveTabRef = useRef(activeTab);
    useEffect(() => {
      if (activeTab !== prevActiveTabRef.current) {
        prevActiveTabRef.current = activeTab;
        if (activeTab && !mountedTabs.has(activeTab)) {
          setMountedTabs((prev) => new Set([...prev, activeTab]));
        }
      }
    }, [activeTab, mountedTabs]);

    const registerTab = useCallback((tabId: string) => {
      setRegisteredTabs((prev) =>
        prev.includes(tabId) ? prev : [...prev, tabId]
      );
    }, []);

    const unregisterTab = useCallback((tabId: string) => {
      setRegisteredTabs((prev) => prev.filter((t) => t !== tabId));
    }, []);

    // Build tabs list from items or registered
    const tabs = useMemo(() => {
      if (items) {
        return items.filter((item) => !item.disabled).map((item) => item.id);
      }
      return registeredTabs;
    }, [items, registeredTabs]);

    // Context value
    const contextValue = useMemo<TabsContextValue>(
      () => ({
        activeTab,
        setActiveTab,
        orientation,
        variant,
        baseId,
        registerTab,
        unregisterTab,
        tabs,
        activationMode,
        focusedTab,
        setFocusedTab,
        lazyMount,
        unmountOnExit,
        mountedTabs,
        onTabClose,
        onTabAdd,
      }),
      [
        activeTab,
        setActiveTab,
        orientation,
        variant,
        baseId,
        registerTab,
        unregisterTab,
        tabs,
        activationMode,
        focusedTab,
        setFocusedTab,
        lazyMount,
        unmountOnExit,
        mountedTabs,
        onTabClose,
        onTabAdd,
      ]
    );

    const wrapperClasses = cn(
      orientation === 'vertical' && 'd-flex',
      className
    );

    // Items mode: render using compound components internally
    const renderWithItems = (): ReactNode => {
      if (!items || items.length === 0) {
        return null;
      }

      return (
        <>
          <TabList
            aria-label="Tabs"
            className={cn(
              fill && 'nav-fill',
              justified && 'nav-justified',
              orientation === 'vertical' && 'me-3'
            )}
          >
            {items.map((item) => (
              <Tab
                key={item.id}
                id={item.id}
                icon={item.icon}
                disabled={item.disabled}
                closable={item.closable}
              >
                {item.label}
              </Tab>
            ))}
          </TabList>
          <div className="tab-content">
            {items.map((item) => (
              <TabPanel key={item.id} id={item.id}>
                {item.content}
              </TabPanel>
            ))}
          </div>
        </>
      );
    };

    return (
      <TabsContext.Provider value={contextValue}>
        <div ref={ref} className={wrapperClasses} style={style} id={providedId}>
          {items ? renderWithItems() : children}
        </div>
      </TabsContext.Provider>
    );
  })
);

Tabs.displayName = 'Tabs';

// =============================================================================
// Exports
// =============================================================================

export type { TabItem, TabListProps, TabPanelProps, TabProps, TabsProps };
