/**
 * @jest-environment jsdom
 */

import type { GuardResult, TabsProFSMState } from './TabsPro.fsm';
import {
  activateTabEvent,
  createInitialTabState,
  createInitialTabsProFSMState,
  getActiveTabState,
  getTabContent,
  getTabError,
  getTabGuardResult,
  getTabState,
  guardFailEvent,
  guardOkEvent,
  initializeTabsEvent,
  isLeaveConfirmationPending,
  isTabActive,
  isTabBlocked,
  isTabCheckingGuard,
  isTabError,
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
  tabsProFSMReducer,
} from './TabsPro.fsm';

describe('TabsPro FSM', () => {
  // ===========================================================================
  // Initial State
  // ===========================================================================

  describe('createInitialTabState', () => {
    it('creates initial state with idle status', () => {
      const state = createInitialTabState();

      expect(state.status).toBe('idle');
      expect(state.loadedContent).toBeNull();
      expect(state.error).toBeNull();
      expect(state.guardResult).toBeNull();
      expect(state.loadAttempts).toBe(0);
      expect(state.hasBeenActivated).toBe(false);
      expect(state.lastActivatedAt).toBeNull();
    });
  });

  describe('createInitialTabsProFSMState', () => {
    it('creates state for multiple tabs', () => {
      const state = createInitialTabsProFSMState(['tab1', 'tab2', 'tab3']);

      expect(Object.keys(state.tabs)).toHaveLength(3);
      expect(state.tabs.tab1).toBeDefined();
      expect(state.tabs.tab2).toBeDefined();
      expect(state.tabs.tab3).toBeDefined();
      expect(state.activeTabId).toBe('tab1');
      expect(state.previousTabId).toBeNull();
      expect(state.pendingLeaveConfirmation).toBe(false);
      expect(state.pendingActivationId).toBeNull();
    });

    it('uses default active ID when provided', () => {
      const state = createInitialTabsProFSMState(['tab1', 'tab2'], 'tab2');

      expect(state.activeTabId).toBe('tab2');
    });

    it('handles empty tab array', () => {
      const state = createInitialTabsProFSMState([]);

      expect(Object.keys(state.tabs)).toHaveLength(0);
      expect(state.activeTabId).toBeNull();
    });
  });

  // ===========================================================================
  // INITIALIZE_TABS Event
  // ===========================================================================

  describe('INITIALIZE_TABS event', () => {
    it('initializes tabs from empty state', () => {
      const state = createInitialTabsProFSMState([]);
      const event = initializeTabsEvent(['tab1', 'tab2']);

      const newState = tabsProFSMReducer(state, event);

      expect(Object.keys(newState.tabs)).toHaveLength(2);
      expect(newState.activeTabId).toBe('tab1');
    });

    it('preserves existing tab states', () => {
      const state = createInitialTabsProFSMState(['tab1', 'tab2']);

      // Modify tab1 state
      const modifiedState: TabsProFSMState = {
        ...state,
        tabs: {
          ...state.tabs,
          tab1: {
            ...state.tabs.tab1,
            status: 'ready',
            loadedContent: 'Test content',
          },
        },
      };

      const event = initializeTabsEvent(['tab1', 'tab2', 'tab3']);
      const newState = tabsProFSMReducer(modifiedState, event);

      expect(newState.tabs.tab1.status).toBe('ready');
      expect(newState.tabs.tab1.loadedContent).toBe('Test content');
      expect(newState.tabs.tab3.status).toBe('idle');
    });

    it('sets default active ID', () => {
      const state = createInitialTabsProFSMState(['tab1']);
      const event = initializeTabsEvent(['tab1', 'tab2'], 'tab2');

      const newState = tabsProFSMReducer(state, event);

      expect(newState.activeTabId).toBe('tab2');
    });
  });

  // ===========================================================================
  // ACTIVATE_TAB Event
  // ===========================================================================

  describe('ACTIVATE_TAB event', () => {
    it('activates a tab and sets checkingGuard status', () => {
      const state = createInitialTabsProFSMState(['tab1', 'tab2']);
      const event = activateTabEvent('tab2');

      const newState = tabsProFSMReducer(state, event);

      expect(newState.activeTabId).toBe('tab2');
      expect(newState.tabs.tab2.status).toBe('checkingGuard');
      expect(newState.tabs.tab2.hasBeenActivated).toBe(true);
      expect(newState.tabs.tab2.lastActivatedAt).toBeGreaterThan(0);
      expect(newState.previousTabId).toBe('tab1');
    });

    it('skips guard check when skipGuard is true', () => {
      const state = createInitialTabsProFSMState(['tab1', 'tab2']);
      const event = activateTabEvent('tab2', true);

      const newState = tabsProFSMReducer(state, event);

      expect(newState.tabs.tab2.status).toBe('loading');
    });

    it('does not activate non-existent tab', () => {
      const state = createInitialTabsProFSMState(['tab1', 'tab2']);
      const event = activateTabEvent('tab99');

      const newState = tabsProFSMReducer(state, event);

      expect(newState).toBe(state); // No change
    });

    it('stores pending activation during leave confirmation', () => {
      const state: TabsProFSMState = {
        ...createInitialTabsProFSMState(['tab1', 'tab2']),
        pendingLeaveConfirmation: true,
      };
      const event = activateTabEvent('tab2');

      const newState = tabsProFSMReducer(state, event);

      expect(newState.pendingActivationId).toBe('tab2');
      expect(newState.activeTabId).toBe('tab1'); // Still on tab1
    });
  });

  // ===========================================================================
  // Guard Events
  // ===========================================================================

  describe('GUARD_OK event', () => {
    it('transitions from checkingGuard to loading', () => {
      const state = createInitialTabsProFSMState(['tab1']);
      const activatedState = tabsProFSMReducer(state, activateTabEvent('tab1'));

      expect(activatedState.tabs.tab1.status).toBe('checkingGuard');

      const newState = tabsProFSMReducer(activatedState, guardOkEvent('tab1'));

      expect(newState.tabs.tab1.status).toBe('loading');
      expect(newState.tabs.tab1.guardResult).toBeNull();
    });

    it('transitions from idle state to loading (initial load path)', () => {
      const state = createInitialTabsProFSMState(['tab1']);
      const event = guardOkEvent('tab1');

      const newState = tabsProFSMReducer(state, event);

      // FSM allows GUARD_OK from idle state for initial load before ACTIVATE_TAB
      expect(newState.tabs.tab1.status).toBe('loading');
    });

    it('does nothing if in blocked state', () => {
      const state = createInitialTabsProFSMState(['tab1']);
      const activatedState = tabsProFSMReducer(state, activateTabEvent('tab1'));
      const blockedState = tabsProFSMReducer(
        activatedState,
        guardFailEvent('tab1', { allowed: false, reason: 'test' })
      );
      const event = guardOkEvent('tab1');

      const newState = tabsProFSMReducer(blockedState, event);

      expect(newState).toBe(blockedState); // blocked state, no change
    });
  });

  describe('GUARD_FAIL event', () => {
    it('transitions from checkingGuard to blocked', () => {
      const state = createInitialTabsProFSMState(['tab1']);
      const activatedState = tabsProFSMReducer(state, activateTabEvent('tab1'));

      const guardResult: GuardResult = {
        allowed: false,
        reason: 'not-admin',
        actionLabel: 'Contact Admin',
      };
      const newState = tabsProFSMReducer(activatedState, guardFailEvent('tab1', guardResult));

      expect(newState.tabs.tab1.status).toBe('blocked');
      expect(newState.tabs.tab1.guardResult).toEqual(guardResult);
    });

    it('stores guard result with action callback', () => {
      const state = createInitialTabsProFSMState(['tab1']);
      const activatedState = tabsProFSMReducer(state, activateTabEvent('tab1'));

      const onAction = jest.fn();
      const guardResult: GuardResult = {
        allowed: false,
        reason: 'upgrade-required',
        actionLabel: 'Upgrade',
        onAction,
      };

      const newState = tabsProFSMReducer(activatedState, guardFailEvent('tab1', guardResult));

      expect(newState.tabs.tab1.guardResult?.onAction).toBe(onAction);
    });
  });

  // ===========================================================================
  // Load Events
  // ===========================================================================

  describe('LOAD_START event', () => {
    it('increments load attempts', () => {
      const state = createInitialTabsProFSMState(['tab1']);

      const newState1 = tabsProFSMReducer(state, loadStartEvent('tab1'));
      expect(newState1.tabs.tab1.loadAttempts).toBe(1);

      const newState2 = tabsProFSMReducer(newState1, loadStartEvent('tab1'));
      expect(newState2.tabs.tab1.loadAttempts).toBe(2);
    });

    it('sets status to loading', () => {
      const state = createInitialTabsProFSMState(['tab1']);

      const newState = tabsProFSMReducer(state, loadStartEvent('tab1'));

      expect(newState.tabs.tab1.status).toBe('loading');
    });
  });

  describe('LOAD_SUCCESS event', () => {
    it('transitions to ready state with content', () => {
      const state = createInitialTabsProFSMState(['tab1']);
      const activatedState = tabsProFSMReducer(state, activateTabEvent('tab1', true)); // Skip guard

      const content = 'Loaded content';
      const newState = tabsProFSMReducer(activatedState, loadSuccessEvent('tab1', content));

      expect(newState.tabs.tab1.status).toBe('ready');
      expect(newState.tabs.tab1.loadedContent).toBe(content);
      expect(newState.tabs.tab1.error).toBeNull();
    });

    it('transitions from idle state to ready (no loader path)', () => {
      const state = createInitialTabsProFSMState(['tab1']);
      const event = loadSuccessEvent('tab1', 'content');

      const newState = tabsProFSMReducer(state, event);

      // FSM allows LOAD_SUCCESS from idle state for tabs with static content
      expect(newState.tabs.tab1.status).toBe('ready');
      expect(newState.tabs.tab1.loadedContent).toBe('content');
    });

    it('does nothing if in blocked state', () => {
      const state = createInitialTabsProFSMState(['tab1']);
      const activatedState = tabsProFSMReducer(state, activateTabEvent('tab1'));
      const blockedState = tabsProFSMReducer(
        activatedState,
        guardFailEvent('tab1', { allowed: false, reason: 'test' })
      );
      const event = loadSuccessEvent('tab1', 'content');

      const newState = tabsProFSMReducer(blockedState, event);

      expect(newState).toBe(blockedState); // blocked state, no change
    });
  });

  describe('LOAD_ERROR event', () => {
    it('transitions to error state', () => {
      const state = createInitialTabsProFSMState(['tab1']);
      const loadingState = tabsProFSMReducer(state, activateTabEvent('tab1', true));

      const error = new Error('Network error');
      const newState = tabsProFSMReducer(loadingState, loadErrorEvent('tab1', error));

      expect(newState.tabs.tab1.status).toBe('error');
      expect(newState.tabs.tab1.error).toBe(error);
    });
  });

  // ===========================================================================
  // RETRY Event
  // ===========================================================================

  describe('RETRY event', () => {
    it('transitions from error to loading', () => {
      const state = createInitialTabsProFSMState(['tab1']);
      let currentState = tabsProFSMReducer(state, activateTabEvent('tab1', true));
      currentState = tabsProFSMReducer(currentState, loadErrorEvent('tab1', new Error('Failed')));

      expect(currentState.tabs.tab1.status).toBe('error');

      const newState = tabsProFSMReducer(currentState, retryEvent('tab1'));

      expect(newState.tabs.tab1.status).toBe('loading');
      expect(newState.tabs.tab1.error).toBeNull();
    });

    it('does nothing if not in error state', () => {
      const state = createInitialTabsProFSMState(['tab1']);
      const event = retryEvent('tab1');

      const newState = tabsProFSMReducer(state, event);

      expect(newState).toBe(state);
    });
  });

  // ===========================================================================
  // Leave Confirmation Events
  // ===========================================================================

  describe('LEAVE_REQUEST event', () => {
    it('sets pending leave confirmation', () => {
      const state = createInitialTabsProFSMState(['tab1', 'tab2']);
      const event = leaveRequestEvent('tab1', 'tab2');

      const newState = tabsProFSMReducer(state, event);

      expect(newState.pendingLeaveConfirmation).toBe(true);
      expect(newState.pendingActivationId).toBe('tab2');
      expect(newState.previousTabId).toBe('tab1');
    });
  });

  describe('LEAVE_CONFIRMED event', () => {
    it('activates pending tab', () => {
      const state: TabsProFSMState = {
        ...createInitialTabsProFSMState(['tab1', 'tab2']),
        pendingLeaveConfirmation: true,
        pendingActivationId: 'tab2',
        previousTabId: 'tab1',
      };

      const newState = tabsProFSMReducer(state, leaveConfirmedEvent());

      expect(newState.pendingLeaveConfirmation).toBe(false);
      expect(newState.pendingActivationId).toBeNull();
      expect(newState.activeTabId).toBe('tab2');
      expect(newState.tabs.tab2.status).toBe('checkingGuard');
    });

    it('clears state without pending activation', () => {
      const state: TabsProFSMState = {
        ...createInitialTabsProFSMState(['tab1']),
        pendingLeaveConfirmation: true,
        pendingActivationId: null,
      };

      const newState = tabsProFSMReducer(state, leaveConfirmedEvent());

      expect(newState.pendingLeaveConfirmation).toBe(false);
      expect(newState.activeTabId).toBe('tab1'); // Unchanged
    });
  });

  describe('LEAVE_CANCELLED event', () => {
    it('clears pending leave state', () => {
      const state: TabsProFSMState = {
        ...createInitialTabsProFSMState(['tab1', 'tab2']),
        pendingLeaveConfirmation: true,
        pendingActivationId: 'tab2',
      };

      const newState = tabsProFSMReducer(state, leaveCancelledEvent());

      expect(newState.pendingLeaveConfirmation).toBe(false);
      expect(newState.pendingActivationId).toBeNull();
      expect(newState.activeTabId).toBe('tab1'); // Unchanged
    });
  });

  // ===========================================================================
  // RESET_TAB Event
  // ===========================================================================

  describe('RESET_TAB event', () => {
    it('resets tab to initial state', () => {
      const state = createInitialTabsProFSMState(['tab1']);
      let currentState = tabsProFSMReducer(state, activateTabEvent('tab1', true));
      currentState = tabsProFSMReducer(currentState, loadSuccessEvent('tab1', 'Content'));

      expect(currentState.tabs.tab1.status).toBe('ready');

      const newState = tabsProFSMReducer(currentState, resetTabEvent('tab1'));

      expect(newState.tabs.tab1.status).toBe('idle');
      expect(newState.tabs.tab1.loadedContent).toBeNull();
      expect(newState.tabs.tab1.loadAttempts).toBe(0);
    });
  });

  // ===========================================================================
  // PRELOAD_TAB Event
  // ===========================================================================

  describe('PRELOAD_TAB event', () => {
    it('starts guard check for idle tab', () => {
      const state = createInitialTabsProFSMState(['tab1', 'tab2']);

      expect(state.tabs.tab2.status).toBe('idle');

      const newState = tabsProFSMReducer(state, preloadTabEvent('tab2'));

      expect(newState.tabs.tab2.status).toBe('checkingGuard');
    });

    it('does nothing for non-idle tab', () => {
      const state = createInitialTabsProFSMState(['tab1']);
      const loadingState = tabsProFSMReducer(state, activateTabEvent('tab1', true));

      const newState = tabsProFSMReducer(loadingState, preloadTabEvent('tab1'));

      expect(newState.tabs.tab1.status).toBe('loading'); // Unchanged
    });
  });

  // ===========================================================================
  // Predicates
  // ===========================================================================

  describe('Predicates', () => {
    it('isTabIdle returns true for idle tabs', () => {
      const state = createInitialTabsProFSMState(['tab1']);
      expect(isTabIdle(state, 'tab1')).toBe(true);
    });

    it('isTabCheckingGuard returns true during guard check', () => {
      const state = createInitialTabsProFSMState(['tab1']);
      const newState = tabsProFSMReducer(state, activateTabEvent('tab1'));
      expect(isTabCheckingGuard(newState, 'tab1')).toBe(true);
    });

    it('isTabBlocked returns true for blocked tabs', () => {
      const state = createInitialTabsProFSMState(['tab1']);
      let currentState = tabsProFSMReducer(state, activateTabEvent('tab1'));
      currentState = tabsProFSMReducer(currentState, guardFailEvent('tab1', { allowed: false }));
      expect(isTabBlocked(currentState, 'tab1')).toBe(true);
    });

    it('isTabLoading returns true for loading tabs', () => {
      const state = createInitialTabsProFSMState(['tab1']);
      const newState = tabsProFSMReducer(state, activateTabEvent('tab1', true));
      expect(isTabLoading(newState, 'tab1')).toBe(true);
    });

    it('isTabReady returns true for ready tabs', () => {
      const state = createInitialTabsProFSMState(['tab1']);
      let currentState = tabsProFSMReducer(state, activateTabEvent('tab1', true));
      currentState = tabsProFSMReducer(currentState, loadSuccessEvent('tab1', 'Content'));
      expect(isTabReady(currentState, 'tab1')).toBe(true);
    });

    it('isTabError returns true for error tabs', () => {
      const state = createInitialTabsProFSMState(['tab1']);
      let currentState = tabsProFSMReducer(state, activateTabEvent('tab1', true));
      currentState = tabsProFSMReducer(currentState, loadErrorEvent('tab1', new Error()));
      expect(isTabError(currentState, 'tab1')).toBe(true);
    });

    it('isTabActive returns true for active tab', () => {
      const state = createInitialTabsProFSMState(['tab1', 'tab2']);
      expect(isTabActive(state, 'tab1')).toBe(true);
      expect(isTabActive(state, 'tab2')).toBe(false);
    });

    it('isLeaveConfirmationPending returns correct value', () => {
      const state = createInitialTabsProFSMState(['tab1']);
      expect(isLeaveConfirmationPending(state)).toBe(false);

      const newState = tabsProFSMReducer(state, leaveRequestEvent('tab1', 'tab2'));
      expect(isLeaveConfirmationPending(newState)).toBe(true);
    });

    it('getTabState returns tab state', () => {
      const state = createInitialTabsProFSMState(['tab1']);
      const tabState = getTabState(state, 'tab1');
      expect(tabState).toBeDefined();
      expect(tabState?.status).toBe('idle');
    });

    it('getActiveTabState returns active tab state', () => {
      const state = createInitialTabsProFSMState(['tab1', 'tab2']);
      const activeState = getActiveTabState(state);
      expect(activeState).toBeDefined();
      expect(activeState?.status).toBe('idle');
    });

    it('getTabContent returns loaded content', () => {
      const state = createInitialTabsProFSMState(['tab1']);
      let currentState = tabsProFSMReducer(state, activateTabEvent('tab1', true));
      currentState = tabsProFSMReducer(currentState, loadSuccessEvent('tab1', 'Test Content'));
      expect(getTabContent(currentState, 'tab1')).toBe('Test Content');
    });

    it('getTabError returns error', () => {
      const error = new Error('Test error');
      const state = createInitialTabsProFSMState(['tab1']);
      let currentState = tabsProFSMReducer(state, activateTabEvent('tab1', true));
      currentState = tabsProFSMReducer(currentState, loadErrorEvent('tab1', error));
      expect(getTabError(currentState, 'tab1')).toBe(error);
    });

    it('getTabGuardResult returns guard result', () => {
      const guardResult: GuardResult = { allowed: false, reason: 'denied' };
      const state = createInitialTabsProFSMState(['tab1']);
      let currentState = tabsProFSMReducer(state, activateTabEvent('tab1'));
      currentState = tabsProFSMReducer(currentState, guardFailEvent('tab1', guardResult));
      expect(getTabGuardResult(currentState, 'tab1')).toEqual(guardResult);
    });
  });

  // ===========================================================================
  // Full Flow Tests
  // ===========================================================================

  describe('Full Flow Tests', () => {
    it('happy path: idle -> checkingGuard -> loading -> ready', () => {
      let state = createInitialTabsProFSMState(['tab1']);

      // Initial state
      expect(state.tabs.tab1.status).toBe('idle');

      // Activate tab
      state = tabsProFSMReducer(state, activateTabEvent('tab1'));
      expect(state.tabs.tab1.status).toBe('checkingGuard');

      // Guard passes
      state = tabsProFSMReducer(state, guardOkEvent('tab1'));
      expect(state.tabs.tab1.status).toBe('loading');

      // Content loads
      state = tabsProFSMReducer(state, loadSuccessEvent('tab1', 'Content'));
      expect(state.tabs.tab1.status).toBe('ready');
      expect(state.tabs.tab1.loadedContent).toBe('Content');
    });

    it('blocked path: idle -> checkingGuard -> blocked', () => {
      let state = createInitialTabsProFSMState(['tab1']);

      state = tabsProFSMReducer(state, activateTabEvent('tab1'));
      expect(state.tabs.tab1.status).toBe('checkingGuard');

      state = tabsProFSMReducer(
        state,
        guardFailEvent('tab1', { allowed: false, reason: 'no-permission' })
      );
      expect(state.tabs.tab1.status).toBe('blocked');
      expect(state.tabs.tab1.guardResult?.reason).toBe('no-permission');
    });

    it('error + retry path: loading -> error -> loading -> ready', () => {
      let state = createInitialTabsProFSMState(['tab1']);

      // Skip to loading
      state = tabsProFSMReducer(state, activateTabEvent('tab1', true));
      expect(state.tabs.tab1.status).toBe('loading');

      // Error occurs
      state = tabsProFSMReducer(state, loadErrorEvent('tab1', new Error('Network failed')));
      expect(state.tabs.tab1.status).toBe('error');

      // User retries
      state = tabsProFSMReducer(state, retryEvent('tab1'));
      expect(state.tabs.tab1.status).toBe('loading');

      // Success on retry
      state = tabsProFSMReducer(state, loadSuccessEvent('tab1', 'Loaded!'));
      expect(state.tabs.tab1.status).toBe('ready');
    });

    it('dirty leave flow: request -> cancel', () => {
      let state = createInitialTabsProFSMState(['tab1', 'tab2']);

      // Request leave
      state = tabsProFSMReducer(state, leaveRequestEvent('tab1', 'tab2'));
      expect(state.pendingLeaveConfirmation).toBe(true);
      expect(state.pendingActivationId).toBe('tab2');

      // User cancels
      state = tabsProFSMReducer(state, leaveCancelledEvent());
      expect(state.pendingLeaveConfirmation).toBe(false);
      expect(state.activeTabId).toBe('tab1'); // Still on tab1
    });

    it('dirty leave flow: request -> confirm', () => {
      let state = createInitialTabsProFSMState(['tab1', 'tab2']);

      // Request leave
      state = tabsProFSMReducer(state, leaveRequestEvent('tab1', 'tab2'));

      // User confirms
      state = tabsProFSMReducer(state, leaveConfirmedEvent());
      expect(state.pendingLeaveConfirmation).toBe(false);
      expect(state.activeTabId).toBe('tab2');
      expect(state.tabs.tab2.status).toBe('checkingGuard');
    });
  });
});
