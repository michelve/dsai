/**
 * TabsPro FSM - Finite State Machine for advanced tab behavior
 *
 * Manages per-tab state for:
 * - Async lazy loading (loadContent)
 * - Permission/guard gating
 * - Error states with retry
 * - Analytics hooks
 *
 * Each tab runs its own independent FSM instance.
 * This FSM is pure and testable - no React dependencies.
 *
 * @module TabsPro/FSM
 */

import type { ReactNode } from 'react';

// =============================================================================
// Types
// =============================================================================

/**
 * Per-tab FSM status values
 *
 * - idle: Tab is not active and has never loaded
 * - checkingGuard: Checking permissions/guard function
 * - blocked: Guard failed, user not allowed
 * - loading: Allowed, loading async content
 * - ready: Content loaded successfully
 * - error: Loading failed
 */
export type TabProStatus = 'idle' | 'checkingGuard' | 'blocked' | 'loading' | 'ready' | 'error';

/**
 * Guard check result
 */
export interface GuardResult {
  allowed: boolean;
  /** Reason for denial (for analytics/display) */
  reason?: string;
  /** Optional action label for CTA button */
  actionLabel?: string;
  /** Optional action callback */
  onAction?: () => void;
}

/**
 * Per-tab FSM state
 */
export interface TabProFSMState {
  /** Current status of this tab */
  status: TabProStatus;
  /** Loaded content (when status is 'ready') */
  loadedContent: ReactNode | null;
  /** Error information (when status is 'error') */
  error: unknown | null;
  /** Guard result (when status is 'blocked') */
  guardResult: GuardResult | null;
  /** Number of load attempts (for retry logic) */
  loadAttempts: number;
  /** Whether this tab has ever been activated */
  hasBeenActivated: boolean;
  /** Timestamp of last activation */
  lastActivatedAt: number | null;
}

/**
 * Map of tab states keyed by tab ID
 */
export type TabsProFSMStateMap = Record<string, TabProFSMState>;

/**
 * Combined FSM state for all tabs
 */
export interface TabsProFSMState {
  /** Map of per-tab states */
  tabs: TabsProFSMStateMap;
  /** Currently active tab ID */
  activeTabId: string | null;
  /** Previous active tab ID (for leave confirmation) */
  previousTabId: string | null;
  /** Whether we're waiting for leave confirmation */
  pendingLeaveConfirmation: boolean;
  /** Tab ID waiting to be activated after leave confirmation */
  pendingActivationId: string | null;
}

// =============================================================================
// Event Types
// =============================================================================

/**
 * Initialize tabs from config
 */
export interface InitializeTabsEvent {
  type: 'INITIALIZE_TABS';
  tabIds: string[];
  defaultActiveId?: string;
}

/**
 * User attempts to activate a tab
 */
export interface ActivateTabEvent {
  type: 'ACTIVATE_TAB';
  tabId: string;
  /** Whether to skip guard check (e.g., for retry) */
  skipGuard?: boolean;
}

/**
 * Guard check passed
 */
export interface GuardOkEvent {
  type: 'GUARD_OK';
  tabId: string;
}

/**
 * Guard check failed
 */
export interface GuardFailEvent {
  type: 'GUARD_FAIL';
  tabId: string;
  result: GuardResult;
}

/**
 * Start loading async content
 */
export interface LoadStartEvent {
  type: 'LOAD_START';
  tabId: string;
}

/**
 * Content loaded successfully
 */
export interface LoadSuccessEvent {
  type: 'LOAD_SUCCESS';
  tabId: string;
  content: ReactNode;
}

/**
 * Content loading failed
 */
export interface LoadErrorEvent {
  type: 'LOAD_ERROR';
  tabId: string;
  error: unknown;
}

/**
 * User requests retry after error
 */
export interface RetryEvent {
  type: 'RETRY';
  tabId: string;
}

/**
 * Request to leave current tab (for unsaved changes prompt)
 */
export interface LeaveRequestEvent {
  type: 'LEAVE_REQUEST';
  fromTabId: string;
  toTabId: string;
}

/**
 * User confirmed leaving (from unsaved changes prompt)
 */
export interface LeaveConfirmedEvent {
  type: 'LEAVE_CONFIRMED';
}

/**
 * User cancelled leaving (from unsaved changes prompt)
 */
export interface LeaveCancelledEvent {
  type: 'LEAVE_CANCELLED';
}

/**
 * Reset a tab to idle state
 */
export interface ResetTabEvent {
  type: 'RESET_TAB';
  tabId: string;
}

/**
 * Preload a tab (hover intent)
 */
export interface PreloadTabEvent {
  type: 'PRELOAD_TAB';
  tabId: string;
}

/**
 * Union of all FSM events
 */
export type TabsProFSMEvent =
  | InitializeTabsEvent
  | ActivateTabEvent
  | GuardOkEvent
  | GuardFailEvent
  | LoadStartEvent
  | LoadSuccessEvent
  | LoadErrorEvent
  | RetryEvent
  | LeaveRequestEvent
  | LeaveConfirmedEvent
  | LeaveCancelledEvent
  | ResetTabEvent
  | PreloadTabEvent;

// =============================================================================
// Initial State Factory
// =============================================================================

/**
 * Creates initial state for a single tab
 */
export function createInitialTabState(): TabProFSMState {
  return {
    status: 'idle',
    loadedContent: null,
    error: null,
    guardResult: null,
    loadAttempts: 0,
    hasBeenActivated: false,
    lastActivatedAt: null,
  };
}

/**
 * Creates initial FSM state for all tabs
 */
export function createInitialTabsProFSMState(
  tabIds: string[],
  defaultActiveId?: string
): TabsProFSMState {
  const tabs: TabsProFSMStateMap = {};

  for (const id of tabIds) {
    tabs[id] = createInitialTabState();
  }

  return {
    tabs,
    activeTabId: defaultActiveId ?? tabIds[0] ?? null,
    previousTabId: null,
    pendingLeaveConfirmation: false,
    pendingActivationId: null,
  };
}

// =============================================================================
// FSM Reducer
// =============================================================================

/**
 * Pure reducer for TabsPro FSM
 *
 * @param state - Current FSM state
 * @param event - Event to process
 * @returns New FSM state
 */
export function tabsProFSMReducer(state: TabsProFSMState, event: TabsProFSMEvent): TabsProFSMState {
  switch (event.type) {
    case 'INITIALIZE_TABS': {
      const { tabIds, defaultActiveId } = event;
      const tabs: TabsProFSMStateMap = {};

      for (const id of tabIds) {
        // Preserve existing tab state if it exists
        tabs[id] = state.tabs[id] ?? createInitialTabState();
      }

      return {
        ...state,
        tabs,
        activeTabId: defaultActiveId ?? tabIds[0] ?? state.activeTabId,
      };
    }

    case 'ACTIVATE_TAB': {
      const { tabId, skipGuard } = event;
      const tabState = state.tabs[tabId];

      // Tab doesn't exist
      if (!tabState) {
        return state;
      }

      // If pending leave confirmation, store the target tab
      if (state.pendingLeaveConfirmation) {
        return {
          ...state,
          pendingActivationId: tabId,
        };
      }

      // Update active tab
      const newTabs = { ...state.tabs };
      const now = Date.now();

      // Move to checkingGuard (or loading if skipGuard)
      newTabs[tabId] = {
        ...tabState,
        status: skipGuard ? 'loading' : 'checkingGuard',
        hasBeenActivated: true,
        lastActivatedAt: now,
      };

      return {
        ...state,
        tabs: newTabs,
        activeTabId: tabId,
        previousTabId: state.activeTabId,
      };
    }

    case 'GUARD_OK': {
      const { tabId } = event;
      const tabState = state.tabs[tabId];

      // Accept from idle or checkingGuard (idle happens when executeGuardAndLoad runs before ACTIVATE_TAB)
      if (!tabState || (tabState.status !== 'checkingGuard' && tabState.status !== 'idle')) {
        return state;
      }

      const newTabs = { ...state.tabs };
      newTabs[tabId] = {
        ...tabState,
        status: 'loading',
        guardResult: null,
      };

      return { ...state, tabs: newTabs };
    }

    case 'GUARD_FAIL': {
      const { tabId, result } = event;
      const tabState = state.tabs[tabId];

      // Accept from idle or checkingGuard (idle happens when executeGuardAndLoad runs before ACTIVATE_TAB)
      if (!tabState || (tabState.status !== 'checkingGuard' && tabState.status !== 'idle')) {
        return state;
      }

      const newTabs = { ...state.tabs };
      newTabs[tabId] = {
        ...tabState,
        status: 'blocked',
        guardResult: result,
      };

      return { ...state, tabs: newTabs };
    }

    case 'LOAD_START': {
      const { tabId } = event;
      const tabState = state.tabs[tabId];

      if (!tabState) {
        return state;
      }

      const newTabs = { ...state.tabs };
      newTabs[tabId] = {
        ...tabState,
        status: 'loading',
        loadAttempts: tabState.loadAttempts + 1,
      };

      return { ...state, tabs: newTabs };
    }

    case 'LOAD_SUCCESS': {
      const { tabId, content } = event;
      const tabState = state.tabs[tabId];

      // Accept from loading state; also allow from idle/checkingGuard for sync content paths
      if (!tabState) {
        return state;
      }

      // Only process if in a valid loading-related state
      const validStates: TabProStatus[] = ['idle', 'checkingGuard', 'loading'];
      if (!validStates.includes(tabState.status)) {
        return state;
      }

      const newTabs = { ...state.tabs };
      newTabs[tabId] = {
        ...tabState,
        status: 'ready',
        loadedContent: content,
        error: null,
      };

      return { ...state, tabs: newTabs };
    }

    case 'LOAD_ERROR': {
      const { tabId, error } = event;
      const tabState = state.tabs[tabId];

      // Accept from loading state; also allow from idle/checkingGuard for edge cases
      if (!tabState) {
        return state;
      }

      // Only process if in a valid loading-related state
      const validStates: TabProStatus[] = ['idle', 'checkingGuard', 'loading'];
      if (!validStates.includes(tabState.status)) {
        return state;
      }

      const newTabs = { ...state.tabs };
      newTabs[tabId] = {
        ...tabState,
        status: 'error',
        error,
      };

      return { ...state, tabs: newTabs };
    }

    case 'RETRY': {
      const { tabId } = event;
      const tabState = state.tabs[tabId];

      if (!tabState || tabState.status !== 'error') {
        return state;
      }

      const newTabs = { ...state.tabs };
      newTabs[tabId] = {
        ...tabState,
        status: 'loading',
        error: null,
      };

      return { ...state, tabs: newTabs };
    }

    case 'LEAVE_REQUEST': {
      const { fromTabId, toTabId } = event;

      return {
        ...state,
        pendingLeaveConfirmation: true,
        pendingActivationId: toTabId,
        previousTabId: fromTabId,
      };
    }

    case 'LEAVE_CONFIRMED': {
      const pendingId = state.pendingActivationId;

      if (!pendingId) {
        return {
          ...state,
          pendingLeaveConfirmation: false,
          pendingActivationId: null,
        };
      }

      // Activate the pending tab
      const tabState = state.tabs[pendingId];
      if (!tabState) {
        return {
          ...state,
          pendingLeaveConfirmation: false,
          pendingActivationId: null,
        };
      }

      const newTabs = { ...state.tabs };
      const now = Date.now();

      newTabs[pendingId] = {
        ...tabState,
        status: 'checkingGuard',
        hasBeenActivated: true,
        lastActivatedAt: now,
      };

      return {
        ...state,
        tabs: newTabs,
        activeTabId: pendingId,
        pendingLeaveConfirmation: false,
        pendingActivationId: null,
      };
    }

    case 'LEAVE_CANCELLED': {
      return {
        ...state,
        pendingLeaveConfirmation: false,
        pendingActivationId: null,
      };
    }

    case 'RESET_TAB': {
      const { tabId } = event;
      const tabState = state.tabs[tabId];

      if (!tabState) {
        return state;
      }

      const newTabs = { ...state.tabs };
      newTabs[tabId] = createInitialTabState();

      return { ...state, tabs: newTabs };
    }

    case 'PRELOAD_TAB': {
      const { tabId } = event;
      const tabState = state.tabs[tabId];

      // Only preload if tab is idle
      if (!tabState || tabState.status !== 'idle') {
        return state;
      }

      const newTabs = { ...state.tabs };
      newTabs[tabId] = {
        ...tabState,
        status: 'checkingGuard',
      };

      return { ...state, tabs: newTabs };
    }

    default: {
      // TypeScript exhaustiveness check
      const _exhaustive: never = event;
      return _exhaustive;
    }
  }
}

// =============================================================================
// Event Creators
// =============================================================================

/**
 * Creates an INITIALIZE_TABS event
 */
export function initializeTabsEvent(
  tabIds: string[],
  defaultActiveId?: string
): InitializeTabsEvent {
  return { type: 'INITIALIZE_TABS', tabIds, defaultActiveId };
}

/**
 * Creates an ACTIVATE_TAB event
 */
export function activateTabEvent(tabId: string, skipGuard = false): ActivateTabEvent {
  return { type: 'ACTIVATE_TAB', tabId, skipGuard };
}

/**
 * Creates a GUARD_OK event
 */
export function guardOkEvent(tabId: string): GuardOkEvent {
  return { type: 'GUARD_OK', tabId };
}

/**
 * Creates a GUARD_FAIL event
 */
export function guardFailEvent(tabId: string, result: GuardResult): GuardFailEvent {
  return { type: 'GUARD_FAIL', tabId, result };
}

/**
 * Creates a LOAD_START event
 */
export function loadStartEvent(tabId: string): LoadStartEvent {
  return { type: 'LOAD_START', tabId };
}

/**
 * Creates a LOAD_SUCCESS event
 */
export function loadSuccessEvent(tabId: string, content: ReactNode): LoadSuccessEvent {
  return { type: 'LOAD_SUCCESS', tabId, content };
}

/**
 * Creates a LOAD_ERROR event
 */
export function loadErrorEvent(tabId: string, error: unknown): LoadErrorEvent {
  return { type: 'LOAD_ERROR', tabId, error };
}

/**
 * Creates a RETRY event
 */
export function retryEvent(tabId: string): RetryEvent {
  return { type: 'RETRY', tabId };
}

/**
 * Creates a LEAVE_REQUEST event
 */
export function leaveRequestEvent(fromTabId: string, toTabId: string): LeaveRequestEvent {
  return { type: 'LEAVE_REQUEST', fromTabId, toTabId };
}

/**
 * Creates a LEAVE_CONFIRMED event
 */
export function leaveConfirmedEvent(): LeaveConfirmedEvent {
  return { type: 'LEAVE_CONFIRMED' };
}

/**
 * Creates a LEAVE_CANCELLED event
 */
export function leaveCancelledEvent(): LeaveCancelledEvent {
  return { type: 'LEAVE_CANCELLED' };
}

/**
 * Creates a RESET_TAB event
 */
export function resetTabEvent(tabId: string): ResetTabEvent {
  return { type: 'RESET_TAB', tabId };
}

/**
 * Creates a PRELOAD_TAB event
 */
export function preloadTabEvent(tabId: string): PreloadTabEvent {
  return { type: 'PRELOAD_TAB', tabId };
}

// =============================================================================
// Predicates
// =============================================================================

/**
 * Check if a tab is in idle state
 */
export function isTabIdle(state: TabsProFSMState, tabId: string): boolean {
  return state.tabs[tabId]?.status === 'idle';
}

/**
 * Check if a tab is checking guard
 */
export function isTabCheckingGuard(state: TabsProFSMState, tabId: string): boolean {
  return state.tabs[tabId]?.status === 'checkingGuard';
}

/**
 * Check if a tab is blocked
 */
export function isTabBlocked(state: TabsProFSMState, tabId: string): boolean {
  return state.tabs[tabId]?.status === 'blocked';
}

/**
 * Check if a tab is loading
 */
export function isTabLoading(state: TabsProFSMState, tabId: string): boolean {
  return state.tabs[tabId]?.status === 'loading';
}

/**
 * Check if a tab is ready
 */
export function isTabReady(state: TabsProFSMState, tabId: string): boolean {
  return state.tabs[tabId]?.status === 'ready';
}

/**
 * Check if a tab has error
 */
export function isTabError(state: TabsProFSMState, tabId: string): boolean {
  return state.tabs[tabId]?.status === 'error';
}

/**
 * Check if a tab is the active tab
 */
export function isTabActive(state: TabsProFSMState, tabId: string): boolean {
  return state.activeTabId === tabId;
}

/**
 * Check if leave confirmation is pending
 */
export function isLeaveConfirmationPending(state: TabsProFSMState): boolean {
  return state.pendingLeaveConfirmation;
}

/**
 * Get the tab state for a specific tab
 */
export function getTabState(state: TabsProFSMState, tabId: string): TabProFSMState | undefined {
  return state.tabs[tabId];
}

/**
 * Get the active tab state
 */
export function getActiveTabState(state: TabsProFSMState): TabProFSMState | undefined {
  if (!state.activeTabId) {
    return undefined;
  }
  return state.tabs[state.activeTabId];
}

/**
 * Get the loaded content for a tab
 */
export function getTabContent(state: TabsProFSMState, tabId: string): ReactNode | null {
  return state.tabs[tabId]?.loadedContent ?? null;
}

/**
 * Get the error for a tab
 */
export function getTabError(state: TabsProFSMState, tabId: string): unknown | null {
  return state.tabs[tabId]?.error ?? null;
}

/**
 * Get the guard result for a tab
 */
export function getTabGuardResult(state: TabsProFSMState, tabId: string): GuardResult | null {
  return state.tabs[tabId]?.guardResult ?? null;
}
