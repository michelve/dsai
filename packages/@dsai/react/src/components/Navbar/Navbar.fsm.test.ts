/**
 * Navbar FSM Unit Tests
 *
 * Tests for the finite state machine that manages navbar collapse state.
 * Covers all state transitions, edge cases, and utility functions.
 */

import {
  createInitialNavbarFSMState,
  getNavbarVisualState,
  isNavbarAnimating,
  isNavbarExpanded,
  navbarFSMReducer,
} from './Navbar.fsm';

import type { NavbarFSMState } from './Navbar.types';

// =============================================================================
// Initial State Tests
// =============================================================================

describe('Navbar FSM', () => {
  describe('createInitialNavbarFSMState', () => {
    it('creates collapsed state when expanded is false', () => {
      const state = createInitialNavbarFSMState(false);
      expect(state).toEqual({
        visibility: 'collapsed',
        shouldRender: true,
      });
    });

    it('creates expanded state when expanded is true', () => {
      const state = createInitialNavbarFSMState(true);
      expect(state).toEqual({
        visibility: 'expanded',
        shouldRender: true,
      });
    });

    it('always sets shouldRender to true for accessibility', () => {
      const collapsedState = createInitialNavbarFSMState(false);
      const expandedState = createInitialNavbarFSMState(true);

      expect(collapsedState.shouldRender).toBe(true);
      expect(expandedState.shouldRender).toBe(true);
    });
  });

  // ===========================================================================
  // TOGGLE Event Tests
  // ===========================================================================

  describe('TOGGLE event', () => {
    it('transitions from collapsed to expanding', () => {
      const state: NavbarFSMState = { visibility: 'collapsed', shouldRender: true };
      const nextState = navbarFSMReducer(state, { type: 'TOGGLE' });

      expect(nextState).toEqual({
        visibility: 'expanding',
        shouldRender: true,
      });
    });

    it('transitions from expanded to collapsing', () => {
      const state: NavbarFSMState = { visibility: 'expanded', shouldRender: true };
      const nextState = navbarFSMReducer(state, { type: 'TOGGLE' });

      expect(nextState).toEqual({
        visibility: 'collapsing',
        shouldRender: true,
      });
    });

    it('ignores toggle during expanding animation', () => {
      const state: NavbarFSMState = { visibility: 'expanding', shouldRender: true };
      const nextState = navbarFSMReducer(state, { type: 'TOGGLE' });

      expect(nextState).toBe(state);
    });

    it('ignores toggle during collapsing animation', () => {
      const state: NavbarFSMState = { visibility: 'collapsing', shouldRender: true };
      const nextState = navbarFSMReducer(state, { type: 'TOGGLE' });

      expect(nextState).toBe(state);
    });
  });

  // ===========================================================================
  // OPEN Event Tests
  // ===========================================================================

  describe('OPEN event', () => {
    it('transitions from collapsed to expanding', () => {
      const state: NavbarFSMState = { visibility: 'collapsed', shouldRender: true };
      const nextState = navbarFSMReducer(state, { type: 'OPEN' });

      expect(nextState).toEqual({
        visibility: 'expanding',
        shouldRender: true,
      });
    });

    it('transitions from collapsing to expanding', () => {
      const state: NavbarFSMState = { visibility: 'collapsing', shouldRender: true };
      const nextState = navbarFSMReducer(state, { type: 'OPEN' });

      expect(nextState).toEqual({
        visibility: 'expanding',
        shouldRender: true,
      });
    });

    it('is no-op when already expanded', () => {
      const state: NavbarFSMState = { visibility: 'expanded', shouldRender: true };
      const nextState = navbarFSMReducer(state, { type: 'OPEN' });

      expect(nextState).toBe(state);
    });

    it('is no-op when already expanding', () => {
      const state: NavbarFSMState = { visibility: 'expanding', shouldRender: true };
      const nextState = navbarFSMReducer(state, { type: 'OPEN' });

      expect(nextState).toBe(state);
    });
  });

  // ===========================================================================
  // CLOSE Event Tests
  // ===========================================================================

  describe('CLOSE event', () => {
    it('transitions from expanded to collapsing', () => {
      const state: NavbarFSMState = { visibility: 'expanded', shouldRender: true };
      const nextState = navbarFSMReducer(state, { type: 'CLOSE' });

      expect(nextState).toEqual({
        visibility: 'collapsing',
        shouldRender: true,
      });
    });

    it('transitions from expanding to collapsing', () => {
      const state: NavbarFSMState = { visibility: 'expanding', shouldRender: true };
      const nextState = navbarFSMReducer(state, { type: 'CLOSE' });

      expect(nextState).toEqual({
        visibility: 'collapsing',
        shouldRender: true,
      });
    });

    it('is no-op when already collapsed', () => {
      const state: NavbarFSMState = { visibility: 'collapsed', shouldRender: true };
      const nextState = navbarFSMReducer(state, { type: 'CLOSE' });

      expect(nextState).toBe(state);
    });

    it('is no-op when already collapsing', () => {
      const state: NavbarFSMState = { visibility: 'collapsing', shouldRender: true };
      const nextState = navbarFSMReducer(state, { type: 'CLOSE' });

      expect(nextState).toBe(state);
    });
  });

  // ===========================================================================
  // ANIMATION_END Event Tests
  // ===========================================================================

  describe('ANIMATION_END event', () => {
    it('transitions from expanding to expanded', () => {
      const state: NavbarFSMState = { visibility: 'expanding', shouldRender: true };
      const nextState = navbarFSMReducer(state, { type: 'ANIMATION_END' });

      expect(nextState).toEqual({
        visibility: 'expanded',
        shouldRender: true,
      });
    });

    it('transitions from collapsing to collapsed', () => {
      const state: NavbarFSMState = { visibility: 'collapsing', shouldRender: true };
      const nextState = navbarFSMReducer(state, { type: 'ANIMATION_END' });

      expect(nextState).toEqual({
        visibility: 'collapsed',
        shouldRender: true,
      });
    });

    it('is no-op when already expanded', () => {
      const state: NavbarFSMState = { visibility: 'expanded', shouldRender: true };
      const nextState = navbarFSMReducer(state, { type: 'ANIMATION_END' });

      expect(nextState).toBe(state);
    });

    it('is no-op when already collapsed', () => {
      const state: NavbarFSMState = { visibility: 'collapsed', shouldRender: true };
      const nextState = navbarFSMReducer(state, { type: 'ANIMATION_END' });

      expect(nextState).toBe(state);
    });
  });

  // ===========================================================================
  // RESET_FROM_PROPS Event Tests
  // ===========================================================================

  describe('RESET_FROM_PROPS event', () => {
    it('sets to expanded when expanded=true', () => {
      const state: NavbarFSMState = { visibility: 'collapsed', shouldRender: true };
      const nextState = navbarFSMReducer(state, { type: 'RESET_FROM_PROPS', expanded: true });

      expect(nextState).toEqual({
        visibility: 'expanded',
        shouldRender: true,
      });
    });

    it('sets to collapsed when expanded=false', () => {
      const state: NavbarFSMState = { visibility: 'expanded', shouldRender: true };
      const nextState = navbarFSMReducer(state, { type: 'RESET_FROM_PROPS', expanded: false });

      expect(nextState).toEqual({
        visibility: 'collapsed',
        shouldRender: true,
      });
    });

    it('is no-op when already in target state (expanded)', () => {
      const state: NavbarFSMState = { visibility: 'expanded', shouldRender: true };
      const nextState = navbarFSMReducer(state, { type: 'RESET_FROM_PROPS', expanded: true });

      expect(nextState).toBe(state);
    });

    it('is no-op when already in target state (collapsed)', () => {
      const state: NavbarFSMState = { visibility: 'collapsed', shouldRender: true };
      const nextState = navbarFSMReducer(state, { type: 'RESET_FROM_PROPS', expanded: false });

      expect(nextState).toBe(state);
    });

    it('skips animation when resetting from expanding to collapsed', () => {
      const state: NavbarFSMState = { visibility: 'expanding', shouldRender: true };
      const nextState = navbarFSMReducer(state, { type: 'RESET_FROM_PROPS', expanded: false });

      // Should jump directly to collapsed, not collapsing
      expect(nextState).toEqual({
        visibility: 'collapsed',
        shouldRender: true,
      });
    });

    it('skips animation when resetting from collapsing to expanded', () => {
      const state: NavbarFSMState = { visibility: 'collapsing', shouldRender: true };
      const nextState = navbarFSMReducer(state, { type: 'RESET_FROM_PROPS', expanded: true });

      // Should jump directly to expanded, not expanding
      expect(nextState).toEqual({
        visibility: 'expanded',
        shouldRender: true,
      });
    });
  });

  // ===========================================================================
  // Unknown Event Tests
  // ===========================================================================

  describe('Unknown events', () => {
    it('returns current state for unknown event type', () => {
      const state: NavbarFSMState = { visibility: 'expanded', shouldRender: true };
      // @ts-expect-error - Testing unknown event type
      const nextState = navbarFSMReducer(state, { type: 'UNKNOWN_EVENT' });

      expect(nextState).toBe(state);
    });
  });

  // ===========================================================================
  // Utility Function Tests
  // ===========================================================================

  describe('getNavbarVisualState', () => {
    it('returns collapsed for collapsed state', () => {
      const state: NavbarFSMState = { visibility: 'collapsed', shouldRender: true };
      expect(getNavbarVisualState(state)).toBe('collapsed');
    });

    it('returns expanding for expanding state', () => {
      const state: NavbarFSMState = { visibility: 'expanding', shouldRender: true };
      expect(getNavbarVisualState(state)).toBe('expanding');
    });

    it('returns expanded for expanded state', () => {
      const state: NavbarFSMState = { visibility: 'expanded', shouldRender: true };
      expect(getNavbarVisualState(state)).toBe('expanded');
    });

    it('returns collapsing for collapsing state', () => {
      const state: NavbarFSMState = { visibility: 'collapsing', shouldRender: true };
      expect(getNavbarVisualState(state)).toBe('collapsing');
    });
  });

  describe('isNavbarExpanded', () => {
    it('returns true for expanded state', () => {
      const state: NavbarFSMState = { visibility: 'expanded', shouldRender: true };
      expect(isNavbarExpanded(state)).toBe(true);
    });

    it('returns true for expanding state', () => {
      const state: NavbarFSMState = { visibility: 'expanding', shouldRender: true };
      expect(isNavbarExpanded(state)).toBe(true);
    });

    it('returns false for collapsed state', () => {
      const state: NavbarFSMState = { visibility: 'collapsed', shouldRender: true };
      expect(isNavbarExpanded(state)).toBe(false);
    });

    it('returns false for collapsing state', () => {
      const state: NavbarFSMState = { visibility: 'collapsing', shouldRender: true };
      expect(isNavbarExpanded(state)).toBe(false);
    });
  });

  describe('isNavbarAnimating', () => {
    it('returns true for expanding state', () => {
      const state: NavbarFSMState = { visibility: 'expanding', shouldRender: true };
      expect(isNavbarAnimating(state)).toBe(true);
    });

    it('returns true for collapsing state', () => {
      const state: NavbarFSMState = { visibility: 'collapsing', shouldRender: true };
      expect(isNavbarAnimating(state)).toBe(true);
    });

    it('returns false for expanded state', () => {
      const state: NavbarFSMState = { visibility: 'expanded', shouldRender: true };
      expect(isNavbarAnimating(state)).toBe(false);
    });

    it('returns false for collapsed state', () => {
      const state: NavbarFSMState = { visibility: 'collapsed', shouldRender: true };
      expect(isNavbarAnimating(state)).toBe(false);
    });
  });

  // ===========================================================================
  // Full State Machine Flow Tests
  // ===========================================================================

  describe('Full state machine flows', () => {
    it('completes full expand cycle: collapsed → expanding → expanded', () => {
      let state = createInitialNavbarFSMState(false);
      expect(state.visibility).toBe('collapsed');

      state = navbarFSMReducer(state, { type: 'TOGGLE' });
      expect(state.visibility).toBe('expanding');

      state = navbarFSMReducer(state, { type: 'ANIMATION_END' });
      expect(state.visibility).toBe('expanded');
    });

    it('completes full collapse cycle: expanded → collapsing → collapsed', () => {
      let state = createInitialNavbarFSMState(true);
      expect(state.visibility).toBe('expanded');

      state = navbarFSMReducer(state, { type: 'TOGGLE' });
      expect(state.visibility).toBe('collapsing');

      state = navbarFSMReducer(state, { type: 'ANIMATION_END' });
      expect(state.visibility).toBe('collapsed');
    });

    it('handles open during collapsing animation', () => {
      let state: NavbarFSMState = { visibility: 'collapsing', shouldRender: true };

      state = navbarFSMReducer(state, { type: 'OPEN' });
      expect(state.visibility).toBe('expanding');

      state = navbarFSMReducer(state, { type: 'ANIMATION_END' });
      expect(state.visibility).toBe('expanded');
    });

    it('handles close during expanding animation', () => {
      let state: NavbarFSMState = { visibility: 'expanding', shouldRender: true };

      state = navbarFSMReducer(state, { type: 'CLOSE' });
      expect(state.visibility).toBe('collapsing');

      state = navbarFSMReducer(state, { type: 'ANIMATION_END' });
      expect(state.visibility).toBe('collapsed');
    });

    it('handles controlled mode reset during animation', () => {
      let state: NavbarFSMState = { visibility: 'expanding', shouldRender: true };

      // External control overrides animation
      state = navbarFSMReducer(state, { type: 'RESET_FROM_PROPS', expanded: false });
      expect(state.visibility).toBe('collapsed');

      // And back
      state = navbarFSMReducer(state, { type: 'RESET_FROM_PROPS', expanded: true });
      expect(state.visibility).toBe('expanded');
    });
  });

  // ===========================================================================
  // Reducer Purity Tests
  // ===========================================================================

  describe('Reducer purity', () => {
    it('does not mutate input state', () => {
      const state: NavbarFSMState = { visibility: 'collapsed', shouldRender: true };
      const originalState = { ...state };

      navbarFSMReducer(state, { type: 'TOGGLE' });

      expect(state).toEqual(originalState);
    });

    it('returns same reference when state does not change', () => {
      const state: NavbarFSMState = { visibility: 'expanded', shouldRender: true };
      const nextState = navbarFSMReducer(state, { type: 'OPEN' });

      expect(nextState).toBe(state);
    });

    it('returns new reference when state changes', () => {
      const state: NavbarFSMState = { visibility: 'collapsed', shouldRender: true };
      const nextState = navbarFSMReducer(state, { type: 'TOGGLE' });

      expect(nextState).not.toBe(state);
    });
  });
});
