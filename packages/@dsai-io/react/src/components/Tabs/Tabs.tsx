import {
  forwardRef,
  type KeyboardEvent,
  memo,
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useState,
} from 'react';

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

const getItemAtIndex = <T,>(collection: readonly T[], targetIndex: number): T | undefined => {
  if (targetIndex < 0) {
    return undefined;
  }
  let currentIndex = 0;
  for (const item of collection) {
    if (currentIndex === targetIndex) {
      return item;
    }
    currentIndex += 1;
  }
  return undefined;
};

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
    { children, className = '', style, 'aria-label': ariaLabel },
    ref
  ) {
    const { orientation, variant, activeTab, setActiveTab, tabs, baseId } = useTabsContext();

    // Handle keyboard navigation
    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>): void => {
      const currentIndex = tabs.indexOf(activeTab);
      if (currentIndex === -1) {
        return;
      }

      let newIndex = currentIndex;

      const isHorizontal = orientation === 'horizontal';
      const prevKey = isHorizontal ? 'ArrowLeft' : 'ArrowUp';
      const nextKey = isHorizontal ? 'ArrowRight' : 'ArrowDown';

      switch (e.key) {
        case prevKey:
          e.preventDefault();
          newIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
          break;
        case nextKey:
          e.preventDefault();
          newIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
          break;
        case 'Home':
          e.preventDefault();
          newIndex = 0;
          break;
        case 'End':
          e.preventDefault();
          newIndex = tabs.length - 1;
          break;
        default:
          return;
      }

      const newTabId = getItemAtIndex(tabs, newIndex);
      if (newTabId) {
        setActiveTab(newTabId);
        // Focus the new tab button
        const tabButton = document.getElementById(`${baseId}-tab-${newTabId}`);
        tabButton?.focus();
      }
    };

    // Build nav classes based on variant
    const navClasses = cn(
      'nav',
      variant === 'tabs' && 'nav-tabs',
      variant === 'pills' && 'nav-pills',
      variant === 'underline' && 'nav-underline',
      orientation === 'vertical' && 'flex-column',
      className
    );

    return (
      // eslint-disable-next-line jsx-a11y/interactive-supports-focus
      <div
        ref={ref}
        role="tablist"
        aria-label={ariaLabel}
        aria-orientation={orientation}
        className={navClasses}
        style={style}
        onKeyDown={handleKeyDown}
      >
        {children}
      </div>
    );
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
    { id, children, icon, disabled = false, className = '', style },
    ref
  ) {
    const { activeTab, setActiveTab, baseId, registerTab, unregisterTab } = useTabsContext();

    useEffect(() => {
      if (!disabled) {
        registerTab(id);
      }
      return () => {
        unregisterTab(id);
      };
    }, [id, disabled, registerTab, unregisterTab]);

    const isActive = activeTab === id;
    const tabId = `${baseId}-tab-${id}`;
    const panelId = `${baseId}-panel-${id}`;

    const handleClick = (): void => {
      if (!disabled) {
        setActiveTab(id);
      }
    };

    // Build button classes
    const buttonClasses = cn('nav-link', isActive && 'active', disabled && 'disabled', className);

    return (
      <button
        ref={ref}
        type="button"
        role="tab"
        id={tabId}
        aria-selected={isActive}
        aria-controls={panelId}
        aria-disabled={disabled || undefined}
        tabIndex={isActive ? 0 : -1}
        disabled={disabled}
        className={buttonClasses}
        style={style}
        onClick={handleClick}
      >
        {icon && <span className="me-2">{icon}</span>}
        {children}
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
    const { activeTab, baseId } = useTabsContext();

    const isActive = activeTab === id;
    const tabId = `${baseId}-tab-${id}`;
    const panelId = `${baseId}-panel-${id}`;

    // Don't render if not active and not keepMounted
    if (!isActive && !keepMounted) {
      return null;
    }

    // Build panel classes
    const panelClasses = cn('tab-pane', 'fade', isActive && 'show active', className);

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
 * A Bootstrap 5 tabs component supporting multiple variants,
 * orientations, and compound component patterns.
 *
 * @see https://getbootstrap.com/docs/5.3/components/navs-tabs/
 *
 * @example
 * ```tsx
 * // Using items prop
 * <Tabs
 *   items={[
 *     { id: 'home', label: 'Home', content: <p>Home content</p> },
 *     { id: 'profile', label: 'Profile', content: <p>Profile content</p> },
 *   ]}
 * />
 *
 * // Using compound components
 * <Tabs>
 *   <TabList>
 *     <Tab id="home">Home</Tab>
 *     <Tab id="profile">Profile</Tab>
 *   </TabList>
 *   <TabPanel id="home">Home content</TabPanel>
 *   <TabPanel id="profile">Profile content</TabPanel>
 * </Tabs>
 * ```
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
    },
    ref
  ) {
    // Generate unique ID
    const generatedId = useId();
    const baseId = providedId ?? generatedId;

    // Determine initial tab
    const getInitialTab = (): string => {
      if (controlledActiveTab) {
        return controlledActiveTab;
      }
      if (defaultActiveTab) {
        return defaultActiveTab;
      }
      if (items && items.length > 0 && items[0]) {
        return items[0].id;
      }
      return '';
    };

    // Internal state for uncontrolled mode
    const [internalActiveTab, setInternalActiveTab] = useState<string>(getInitialTab);

    // Tab registration for keyboard navigation
    const [registeredTabs, setRegisteredTabs] = useState<string[]>([]);

    const registerTab = useCallback((tabId: string) => {
      setRegisteredTabs((prev) => (prev.includes(tabId) ? prev : [...prev, tabId]));
    }, []);

    const unregisterTab = useCallback((tabId: string) => {
      setRegisteredTabs((prev) => prev.filter((t) => t !== tabId));
    }, []);

    // Determine if controlled
    const isControlled = controlledActiveTab !== undefined;
    const activeTab = isControlled ? controlledActiveTab : internalActiveTab;

    // Handle tab change
    const setActiveTab = useCallback(
      (tabId: string) => {
        if (!isControlled) {
          setInternalActiveTab(tabId);
        }
        onTabChange?.(tabId);
      },
      [isControlled, onTabChange]
    );

    // Build tabs list from items
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
      }),
      [activeTab, setActiveTab, orientation, variant, baseId, registerTab, unregisterTab, tabs]
    );

    // Build wrapper classes
    const wrapperClasses = cn(orientation === 'vertical' && 'd-flex', className);

    // Build nav classes for items mode
    const navClasses = cn(
      'nav',
      variant === 'tabs' && 'nav-tabs',
      variant === 'pills' && 'nav-pills',
      variant === 'underline' && 'nav-underline',
      fill && 'nav-fill',
      justified && 'nav-justified',
      orientation === 'vertical' && 'flex-column me-3'
    );

    // Render using items prop
    const renderWithItems = (): ReactNode => {
      if (!items || items.length === 0) {
        return null;
      }

      return (
        <>
          <div role="tablist" aria-orientation={orientation} className={navClasses}>
            {items.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                id={`${baseId}-tab-${item.id}`}
                aria-selected={activeTab === item.id}
                aria-controls={`${baseId}-panel-${item.id}`}
                aria-disabled={item.disabled || undefined}
                tabIndex={activeTab === item.id ? 0 : -1}
                disabled={item.disabled}
                className={`nav-link ${activeTab === item.id ? 'active' : ''} ${item.disabled ? 'disabled' : ''}`}
                onClick={() => !item.disabled && setActiveTab(item.id)}
                onKeyDown={(e) => {
                  const enabledItems = items.filter((i) => !i.disabled);
                  const currentIndex = enabledItems.findIndex((i) => i.id === activeTab);
                  if (currentIndex === -1) {
                    return;
                  }

                  let newIndex = currentIndex;
                  const isHorizontal = orientation === 'horizontal';
                  const prevKey = isHorizontal ? 'ArrowLeft' : 'ArrowUp';
                  const nextKey = isHorizontal ? 'ArrowRight' : 'ArrowDown';

                  switch (e.key) {
                    case prevKey:
                      e.preventDefault();
                      newIndex = currentIndex > 0 ? currentIndex - 1 : enabledItems.length - 1;
                      break;
                    case nextKey:
                      e.preventDefault();
                      newIndex = currentIndex < enabledItems.length - 1 ? currentIndex + 1 : 0;
                      break;
                    case 'Home':
                      e.preventDefault();
                      newIndex = 0;
                      break;
                    case 'End':
                      e.preventDefault();
                      newIndex = enabledItems.length - 1;
                      break;
                    default:
                      return;
                  }

                  const newItem = getItemAtIndex(enabledItems, newIndex);
                  if (newItem) {
                    setActiveTab(newItem.id);
                    const tabButton = document.getElementById(`${baseId}-tab-${newItem.id}`);
                    tabButton?.focus();
                  }
                }}
              >
                {item.icon && <span className="me-2">{item.icon}</span>}
                {item.label}
              </button>
            ))}
          </div>
          <div className="tab-content">
            {items.map((item) => (
              <div
                key={item.id}
                role="tabpanel"
                id={`${baseId}-panel-${item.id}`}
                aria-labelledby={`${baseId}-tab-${item.id}`}
                tabIndex={0}
                className={`tab-pane fade ${activeTab === item.id ? 'show active' : ''}`}
                hidden={activeTab !== item.id}
              >
                {item.content}
              </div>
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
// Compound Component Exports
// =============================================================================

export type { TabItem, TabListProps, TabPanelProps, TabProps, TabsProps };
