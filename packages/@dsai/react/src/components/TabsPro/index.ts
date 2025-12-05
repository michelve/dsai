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
  type ActivateTabEvent,
  activateTabEvent,
  // Initial state factory
  createInitialTabState,
  createInitialTabsProFSMState,
  type GuardFailEvent,
  type GuardOkEvent,
  getActiveTabState,
  getTabContent,
  getTabError,
  getTabGuardResult,
  getTabState,
  guardFailEvent,
  guardOkEvent,
  type InitializeTabsEvent,
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
  type LeaveCancelledEvent,
  type LeaveConfirmedEvent,
  type LeaveRequestEvent,
  type LoadErrorEvent,
  type LoadStartEvent,
  type LoadSuccessEvent,
  leaveCancelledEvent,
  leaveConfirmedEvent,
  leaveRequestEvent,
  loadErrorEvent,
  loadStartEvent,
  loadSuccessEvent,
  type PreloadTabEvent,
  preloadTabEvent,
  type ResetTabEvent,
  type RetryEvent,
  resetTabEvent,
  retryEvent,
  type TabProFSMState,
  // State types
  type TabProStatus,
  // Event types
  type TabsProFSMEvent,
  type TabsProFSMState,
  type TabsProFSMStateMap,
  // Reducer
  tabsProFSMReducer,
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
