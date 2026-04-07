/**
 * TabsPro Types
 *
 * Type definitions for the TabsPro component - an advanced tab system
 * with FSM-based async loading, permission gating, and analytics.
 *
 * @module TabsPro/types
 */

import type { TabsOrientation, TabsVariant } from '../Tabs/Tabs.types';
import type { CSSProperties, ReactNode } from 'react';

// =============================================================================
// Guard Types
// =============================================================================

/**
 * Result of a guard/permission check
 */
export interface GuardResult {
  /** Whether access is allowed */
  allowed: boolean;
  /** Reason for denial (for analytics/display) */
  reason?: string;
  /** Optional action label for CTA button (e.g., "Upgrade", "Contact Admin") */
  actionLabel?: string;
  /** Optional action callback when CTA is clicked */
  onAction?: () => void;
}

/**
 * Guard function type - can be sync or async
 */
export type GuardFn = () => GuardResult | Promise<GuardResult>;

// =============================================================================
// Loader Types
// =============================================================================

/**
 * Async content loader function
 */
export type AsyncLoader<T = ReactNode> = () => Promise<T>;

// =============================================================================
// Tab Item Types
// =============================================================================

/**
 * Configuration for a single tab in TabsPro
 */
export interface TabsProItem {
  /**
   * Unique identifier for the tab
   */
  id: string;

  /**
   * Tab label displayed in the tab header
   */
  label: ReactNode;

  /**
   * Icon to display before the label
   */
  icon?: ReactNode;

  /**
   * Whether the tab is disabled
   * @default false
   */
  disabled?: boolean;

  // =========================================================================
  // Permission / Gating
  // =========================================================================

  /**
   * Guard function to check permissions before showing content.
   * Return { allowed: true } to proceed, or { allowed: false, reason: '...' } to block.
   * If not provided, tab is always allowed.
   */
  guard?: GuardFn;

  /**
   * Fallback content shown when guard fails (blocked state).
   * If not provided, a default blocked message is shown.
   */
  blockedFallback?: ReactNode;

  /**
   * Callback fired when guard check fails
   */
  onGuardFail?: (info: { id: string; reason?: string }) => void;

  // =========================================================================
  // Lazy Loading
  // =========================================================================

  /**
   * Async function to load tab content.
   * Content is loaded when tab is first activated.
   * If not provided, uses static `content` prop.
   */
  loadContent?: AsyncLoader;

  /**
   * Whether to preload content on hover intent.
   * @default false
   */
  preloadOnHover?: boolean;

  /**
   * Loading indicator shown while content is loading.
   * If not provided, a default spinner is shown.
   */
  loadingFallback?: ReactNode;

  /**
   * Error fallback shown when loading fails.
   * If not provided, a default error UI with retry button is shown.
   * Receives error and retry callback.
   */
  errorFallback?: (error: unknown, retry: () => void) => ReactNode;

  // =========================================================================
  // Analytics / Hooks
  // =========================================================================

  /**
   * Callback fired when tab is successfully viewed (after guard and load)
   */
  onViewed?: () => void;

  /**
   * Callback fired when loading fails
   */
  onError?: (error: unknown) => void;

  /**
   * Callback fired when tab activation starts
   */
  onActivate?: () => void;

  // =========================================================================
  // Static Content
  // =========================================================================

  /**
   * Static content for non-async tabs.
   * Used when `loadContent` is not provided.
   */
  content?: ReactNode;
}

// =============================================================================
// Component Props
// =============================================================================

/**
 * Props for the TabsPro component
 */
export interface TabsProProps {
  /**
   * Tab items configuration
   */
  items: TabsProItem[];

  /**
   * Currently active tab ID (controlled mode)
   */
  activeId?: string;

  /**
   * Default active tab ID (uncontrolled mode)
   */
  defaultActiveId?: string;

  /**
   * Callback when active tab changes
   */
  onActiveChange?: (id: string | null) => void;

  /**
   * Whether to keep panel content mounted when inactive.
   * Useful for preserving state in tab panels.
   * @default false
   */
  keepMounted?: boolean;

  /**
   * Tab visual variant
   * @default 'tabs'
   */
  variant?: TabsVariant;

  /**
   * Tab orientation
   * @default 'horizontal'
   */
  orientation?: TabsOrientation;

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

  // =========================================================================
  // Dirty/Unsaved Changes
  // =========================================================================

  /**
   * Function to check if current tab has unsaved changes.
   * If returns true, a confirmation prompt is shown before switching.
   */
  isDirty?: (tabId: string) => boolean;

  /**
   * Custom confirmation message for unsaved changes
   * @default "You have unsaved changes. Leave without saving?"
   */
  dirtyConfirmMessage?: string;

  /**
   * Callback when user confirms leaving a dirty tab
   */
  onDirtyLeave?: (fromTabId: string, toTabId: string) => void;

  /**
   * Callback when user cancels leaving a dirty tab
   */
  onDirtyStay?: (tabId: string) => void;

  // =========================================================================
  // Styling
  // =========================================================================

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

  // =========================================================================
  // Default Fallbacks
  // =========================================================================

  /**
   * Default loading indicator for all tabs.
   * Can be overridden per-tab with `loadingFallback`.
   */
  defaultLoadingFallback?: ReactNode;

  /**
   * Default blocked message for all tabs.
   * Can be overridden per-tab with `blockedFallback`.
   */
  defaultBlockedFallback?: ReactNode;

  /**
   * Default error fallback for all tabs.
   * Can be overridden per-tab with `errorFallback`.
   */
  defaultErrorFallback?: (error: unknown, retry: () => void) => ReactNode;
}

// =============================================================================
// Internal Types
// =============================================================================

/**
 * Internal tab item with resolved content based on FSM state
 */
export interface ResolvedTabItem {
  id: string;
  label: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
  content: ReactNode;
}

/**
 * Props for the default loading component
 */
export interface DefaultLoadingProps {
  /** Loading message */
  message?: string;
}

/**
 * Props for the default blocked component
 */
export interface DefaultBlockedProps {
  /** Title message */
  title?: string;
  /** Description message */
  description?: string;
  /** Action button label */
  actionLabel?: string;
  /** Action button callback */
  onAction?: () => void;
}

/**
 * Props for the default error component
 */
export interface DefaultErrorProps {
  /** Error message */
  message?: string;
  /** Retry callback */
  onRetry: () => void;
}
