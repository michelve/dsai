/**
 * TabsPro Component
 *
 * Advanced tabs with FSM-based async loading, permission gating, and analytics.
 *
 * @module TabsPro
 */

export { TabsPro } from './TabsPro';
// FSM exports for advanced usage
export {
  activateTabEvent,
  // Initial state factory
  createInitialTabState,
  createInitialTabsProFSMState,
  getActiveTabState,
  getTabContent,
  getTabError,
  getTabGuardResult,
  getTabState,
  guardFailEvent,
  guardOkEvent,
  // Event creators
  initializeTabsEvent,
  isLeaveConfirmationPending,
  isTabActive,
  isTabBlocked,
  isTabCheckingGuard,
  isTabError,
  // Predicates
  isTabIdle,
  isTabLoading,
  isTabReady,
  leaveCancelledEvent,
  leaveConfirmedEvent,
  leaveRequestEvent,
  loadErrorEvent,
  loadStartEvent,
  loadSuccessEvent,
  preloadTabEvent,
  resetTabEvent,
  retryEvent,
  // Reducer
  tabsProFSMReducer,
  type ActivateTabEvent,
  type GuardFailEvent,
  type GuardOkEvent,
  type InitializeTabsEvent,
  type LeaveCancelledEvent,
  type LeaveConfirmedEvent,
  type LeaveRequestEvent,
  type LoadErrorEvent,
  type LoadStartEvent,
  type LoadSuccessEvent,
  type PreloadTabEvent,
  type ResetTabEvent,
  type RetryEvent,
  type TabProFSMState,
  // State types
  type TabProStatus,
  // Event types
  type TabsProFSMEvent,
  type TabsProFSMState,
  type TabsProFSMStateMap,
} from './TabsPro.fsm';
export type {
  AsyncLoader,
  DefaultBlockedProps,
  DefaultErrorProps,
  DefaultLoadingProps,
  GuardFn,
  GuardResult,
  ResolvedTabItem,
  TabsProItem,
  TabsProProps,
} from './TabsPro.types';
