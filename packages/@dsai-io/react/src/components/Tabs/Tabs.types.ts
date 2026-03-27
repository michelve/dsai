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
 * Keyboard activation mode
 * - 'automatic': tab activates on focus (arrow key moves focus and selects)
 * - 'manual': arrow keys move focus only, Enter/Space activates
 */
export type TabsActivationMode = 'automatic' | 'manual';

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

  /**
   * Whether this tab can be closed/removed
   * @default false
   */
  closable?: boolean;
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

  /**
   * Keyboard activation mode
   * - 'automatic': tab activates on arrow key focus (default, current behavior)
   * - 'manual': arrow keys move focus only, Enter/Space to activate
   * @default 'automatic'
   */
  activationMode?: TabsActivationMode;

  /**
   * Lazy mount tab panels — only render when first activated
   * @default false
   */
  lazyMount?: boolean;

  /**
   * Unmount tab panels when they become inactive
   * @default false
   */
  unmountOnExit?: boolean;

  /**
   * Called when a closable tab's close button is clicked
   */
  onTabClose?: (tabId: string) => void;

  /**
   * Called when the add button is clicked (enables add button in tab list)
   */
  onTabAdd?: () => void;
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

  /**
   * Extra content rendered alongside the tab list
   * Can be a ReactNode or { left?: ReactNode; right?: ReactNode }
   */
  extra?: ReactNode | { left?: ReactNode; right?: ReactNode };

  /**
   * Enable horizontal scrolling when tabs overflow
   * @default false
   */
  scrollable?: boolean;
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
   * Whether this tab can be closed
   * @default false
   */
  closable?: boolean;

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
  activationMode: TabsActivationMode;
  focusedTab: string | null;
  setFocusedTab: (id: string | null) => void;
  lazyMount: boolean;
  unmountOnExit: boolean;
  mountedTabs: Set<string>;
  onTabClose?: (tabId: string) => void;
  onTabAdd?: () => void;
}
