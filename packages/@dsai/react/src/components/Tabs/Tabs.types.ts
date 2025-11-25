import type { CSSProperties, ReactNode } from 'react';

/**
 * Tab orientation
 */
export type TabsOrientation = 'horizontal' | 'vertical';

/**
 * Tab variant styling
 */
export type TabsVariant = 'underline' | 'pills' | 'tabs';

/**
 * Tab item configuration
 */
export interface TabItem {
  /**
   * Unique identifier for the tab
   */
  id: string;

  /**
   * Tab label
   */
  label: ReactNode;

  /**
   * Tab panel content
   */
  content: ReactNode;

  /**
   * Icon to display before the label
   */
  icon?: ReactNode;

  /**
   * Whether the tab is disabled
   * @default false
   */
  disabled?: boolean;
}

/**
 * Tabs container props
 */
export interface TabsProps {
  /**
   * Tab items to render
   */
  items?: TabItem[];

  /**
   * Children (alternative to items prop for compound component usage)
   */
  children?: ReactNode;

  /**
   * Currently active tab ID (controlled)
   */
  activeTab?: string;

  /**
   * Default active tab ID (uncontrolled)
   */
  defaultActiveTab?: string;

  /**
   * Callback when active tab changes
   */
  onTabChange?: (tabId: string) => void;

  /**
   * Tab orientation
   * @default 'horizontal'
   */
  orientation?: TabsOrientation;

  /**
   * Tab variant styling
   * @default 'tabs'
   */
  variant?: TabsVariant;

  /**
   * Fill available width
   * @default false
   */
  fill?: boolean;

  /**
   * Justify tabs evenly
   * @default false
   */
  justified?: boolean;

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

/**
 * TabList props
 */
export interface TabListProps {
  /**
   * Tab buttons as children
   */
  children: ReactNode;

  /**
   * Additional CSS class names
   */
  className?: string;

  /**
   * Inline styles
   */
  style?: CSSProperties;

  /**
   * Accessible label for the tab list
   */
  'aria-label'?: string;
}

/**
 * Tab (button) props
 */
export interface TabProps {
  /**
   * Unique identifier for the tab
   */
  id: string;

  /**
   * Tab label content
   */
  children: ReactNode;

  /**
   * Icon to display before the label
   */
  icon?: ReactNode;

  /**
   * Whether the tab is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Additional CSS class names
   */
  className?: string;

  /**
   * Inline styles
   */
  style?: CSSProperties;
}

/**
 * TabPanel props
 */
export interface TabPanelProps {
  /**
   * ID matching the corresponding Tab
   */
  id: string;

  /**
   * Panel content
   */
  children: ReactNode;

  /**
   * Additional CSS class names
   */
  className?: string;

  /**
   * Inline styles
   */
  style?: CSSProperties;

  /**
   * Keep panel mounted when inactive (for preserving state)
   * @default false
   */
  keepMounted?: boolean;
}

/**
 * Internal context for Tabs
 */
export interface TabsContextValue {
  activeTab: string;
  setActiveTab: (id: string) => void;
  orientation: TabsOrientation;
  variant: TabsVariant;
  baseId: string;
  registerTab: (id: string) => void;
  unregisterTab: (id: string) => void;
  tabs: string[];
}
