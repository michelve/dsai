/**
 * @fileoverview FSM tests for Scrollspy component
 * Tests the state machine logic for scroll tracking and active section management
 */

import {
  createInitialScrollspyFSMState,
  getScrollspyVisualState,
  isScrollspySectionActive,
  isScrollspySectionVisible,
  scrollspyFSMReducer,
} from './Scrollspy.fsm';

describe('Scrollspy FSM', () => {
  // ===========================================================================
  // Initial State
  // ===========================================================================
  describe('createInitialScrollspyFSMState', () => {
    it('creates initial state with null activeId by default', () => {
      const state = createInitialScrollspyFSMState();

      expect(state).toEqual({
        activeId: null,
        visibleIds: [],
        isObserving: false,
      });
    });

    it('creates initial state with provided default activeId', () => {
      const state = createInitialScrollspyFSMState('section-1');

      expect(state).toEqual({
        activeId: 'section-1',
        visibleIds: ['section-1'],
        isObserving: false,
      });
    });

    it('creates state with null when null is explicitly passed', () => {
      const state = createInitialScrollspyFSMState(null);

      expect(state.activeId).toBeNull();
      expect(state.visibleIds).toHaveLength(0);
    });
  });

  // ===========================================================================
  // SECTION_ENTER Event
  // ===========================================================================
  describe('SECTION_ENTER event', () => {
    it('adds section to visible IDs', () => {
      const state = createInitialScrollspyFSMState();
      const nextState = scrollspyFSMReducer(state, {
        type: 'SECTION_ENTER',
        sectionId: 'section-1',
      });

      expect(nextState.visibleIds).toContain('section-1');
    });

    it('sets active ID to first entering section when none active', () => {
      const state = createInitialScrollspyFSMState();
      const nextState = scrollspyFSMReducer(state, {
        type: 'SECTION_ENTER',
        sectionId: 'section-1',
      });

      expect(nextState.activeId).toBe('section-1');
    });

    it('keeps existing active ID when section enters', () => {
      let state = createInitialScrollspyFSMState();
      state = scrollspyFSMReducer(state, { type: 'SECTION_ENTER', sectionId: 'section-1' });
      state = scrollspyFSMReducer(state, { type: 'SECTION_ENTER', sectionId: 'section-2' });

      expect(state.activeId).toBe('section-1');
      expect(state.visibleIds).toContain('section-1');
      expect(state.visibleIds).toContain('section-2');
    });

    it('does not duplicate section in visible IDs', () => {
      let state = createInitialScrollspyFSMState();
      state = scrollspyFSMReducer(state, { type: 'SECTION_ENTER', sectionId: 'section-1' });
      state = scrollspyFSMReducer(state, { type: 'SECTION_ENTER', sectionId: 'section-1' });

      expect(state.visibleIds.filter((id) => id === 'section-1')).toHaveLength(1);
    });

    it('returns same state reference if section already visible', () => {
      let state = createInitialScrollspyFSMState();
      state = scrollspyFSMReducer(state, { type: 'SECTION_ENTER', sectionId: 'section-1' });
      const nextState = scrollspyFSMReducer(state, {
        type: 'SECTION_ENTER',
        sectionId: 'section-1',
      });

      expect(nextState).toBe(state);
    });
  });

  // ===========================================================================
  // SECTION_LEAVE Event
  // ===========================================================================
  describe('SECTION_LEAVE event', () => {
    it('removes section from visible IDs', () => {
      let state = createInitialScrollspyFSMState();
      state = scrollspyFSMReducer(state, { type: 'SECTION_ENTER', sectionId: 'section-1' });
      state = scrollspyFSMReducer(state, { type: 'SECTION_LEAVE', sectionId: 'section-1' });

      expect(state.visibleIds).not.toContain('section-1');
    });

    it('updates active ID when active section leaves', () => {
      let state = createInitialScrollspyFSMState();
      state = scrollspyFSMReducer(state, { type: 'SECTION_ENTER', sectionId: 'section-1' });
      state = scrollspyFSMReducer(state, { type: 'SECTION_ENTER', sectionId: 'section-2' });
      state = scrollspyFSMReducer(state, { type: 'SECTION_LEAVE', sectionId: 'section-1' });

      expect(state.activeId).toBe('section-2');
    });

    it('sets active ID to null when last section leaves', () => {
      let state = createInitialScrollspyFSMState();
      state = scrollspyFSMReducer(state, { type: 'SECTION_ENTER', sectionId: 'section-1' });
      state = scrollspyFSMReducer(state, { type: 'SECTION_LEAVE', sectionId: 'section-1' });

      expect(state.activeId).toBeNull();
    });

    it('keeps active ID when non-active section leaves', () => {
      let state = createInitialScrollspyFSMState();
      state = scrollspyFSMReducer(state, { type: 'SECTION_ENTER', sectionId: 'section-1' });
      state = scrollspyFSMReducer(state, { type: 'SECTION_ENTER', sectionId: 'section-2' });
      state = scrollspyFSMReducer(state, { type: 'SECTION_LEAVE', sectionId: 'section-2' });

      expect(state.activeId).toBe('section-1');
    });

    it('handles leaving section that was never visible', () => {
      const state = createInitialScrollspyFSMState();
      const nextState = scrollspyFSMReducer(state, {
        type: 'SECTION_LEAVE',
        sectionId: 'non-existent',
      });

      expect(nextState.visibleIds).toHaveLength(0);
      expect(nextState.activeId).toBeNull();
    });
  });

  // ===========================================================================
  // SET_ACTIVE Event
  // ===========================================================================
  describe('SET_ACTIVE event', () => {
    it('sets active ID to specified section', () => {
      const state = createInitialScrollspyFSMState();
      const nextState = scrollspyFSMReducer(state, {
        type: 'SET_ACTIVE',
        sectionId: 'section-2',
      });

      expect(nextState.activeId).toBe('section-2');
    });

    it('can set active ID to null', () => {
      let state = createInitialScrollspyFSMState();
      state = scrollspyFSMReducer(state, { type: 'SECTION_ENTER', sectionId: 'section-1' });
      state = scrollspyFSMReducer(state, { type: 'SET_ACTIVE', sectionId: null });

      expect(state.activeId).toBeNull();
    });

    it('returns same state reference if active ID unchanged', () => {
      let state = createInitialScrollspyFSMState();
      state = scrollspyFSMReducer(state, { type: 'SET_ACTIVE', sectionId: 'section-1' });
      const nextState = scrollspyFSMReducer(state, { type: 'SET_ACTIVE', sectionId: 'section-1' });

      expect(nextState).toBe(state);
    });
  });

  // ===========================================================================
  // START_OBSERVING Event
  // ===========================================================================
  describe('START_OBSERVING event', () => {
    it('sets isObserving to true', () => {
      const state = createInitialScrollspyFSMState();
      const nextState = scrollspyFSMReducer(state, { type: 'START_OBSERVING' });

      expect(nextState.isObserving).toBe(true);
    });

    it('returns same state reference if already observing', () => {
      let state = createInitialScrollspyFSMState();
      state = scrollspyFSMReducer(state, { type: 'START_OBSERVING' });
      const nextState = scrollspyFSMReducer(state, { type: 'START_OBSERVING' });

      expect(nextState).toBe(state);
    });
  });

  // ===========================================================================
  // STOP_OBSERVING Event
  // ===========================================================================
  describe('STOP_OBSERVING event', () => {
    it('sets isObserving to false', () => {
      let state = createInitialScrollspyFSMState();
      state = scrollspyFSMReducer(state, { type: 'START_OBSERVING' });
      state = scrollspyFSMReducer(state, { type: 'STOP_OBSERVING' });

      expect(state.isObserving).toBe(false);
    });

    it('clears visible IDs when stopping', () => {
      let state = createInitialScrollspyFSMState();
      state = scrollspyFSMReducer(state, { type: 'START_OBSERVING' });
      state = scrollspyFSMReducer(state, { type: 'SECTION_ENTER', sectionId: 'section-1' });
      state = scrollspyFSMReducer(state, { type: 'STOP_OBSERVING' });

      expect(state.visibleIds).toHaveLength(0);
    });

    it('returns same state reference if not observing', () => {
      const state = createInitialScrollspyFSMState();
      const nextState = scrollspyFSMReducer(state, { type: 'STOP_OBSERVING' });

      expect(nextState).toBe(state);
    });
  });

  // ===========================================================================
  // RESET Event
  // ===========================================================================
  describe('RESET event', () => {
    it('resets state to initial values', () => {
      let state = createInitialScrollspyFSMState('initial');
      state = scrollspyFSMReducer(state, { type: 'START_OBSERVING' });
      state = scrollspyFSMReducer(state, { type: 'SECTION_ENTER', sectionId: 'section-1' });
      state = scrollspyFSMReducer(state, { type: 'RESET' });

      expect(state).toEqual({
        activeId: null,
        visibleIds: [],
        isObserving: false,
      });
    });
  });

  // ===========================================================================
  // Visual State
  // ===========================================================================
  describe('getScrollspyVisualState', () => {
    it('returns "idle" when not observing', () => {
      const state = createInitialScrollspyFSMState();
      expect(getScrollspyVisualState(state)).toBe('idle');
    });

    it('returns "tracking" when observing with visible sections', () => {
      let state = createInitialScrollspyFSMState();
      state = scrollspyFSMReducer(state, { type: 'START_OBSERVING' });
      state = scrollspyFSMReducer(state, { type: 'SECTION_ENTER', sectionId: 'section-1' });

      expect(getScrollspyVisualState(state)).toBe('tracking');
    });

    it('returns "scrolling" when observing but no visible sections', () => {
      let state = createInitialScrollspyFSMState();
      state = scrollspyFSMReducer(state, { type: 'START_OBSERVING' });

      expect(getScrollspyVisualState(state)).toBe('scrolling');
    });
  });

  // ===========================================================================
  // Helper Functions
  // ===========================================================================
  describe('isScrollspySectionActive', () => {
    it('returns true for active section', () => {
      let state = createInitialScrollspyFSMState();
      state = scrollspyFSMReducer(state, { type: 'SET_ACTIVE', sectionId: 'section-1' });

      expect(isScrollspySectionActive(state, 'section-1')).toBe(true);
    });

    it('returns false for non-active section', () => {
      let state = createInitialScrollspyFSMState();
      state = scrollspyFSMReducer(state, { type: 'SET_ACTIVE', sectionId: 'section-1' });

      expect(isScrollspySectionActive(state, 'section-2')).toBe(false);
    });

    it('returns false when no active section', () => {
      const state = createInitialScrollspyFSMState();
      expect(isScrollspySectionActive(state, 'section-1')).toBe(false);
    });
  });

  describe('isScrollspySectionVisible', () => {
    it('returns true for visible section', () => {
      let state = createInitialScrollspyFSMState();
      state = scrollspyFSMReducer(state, { type: 'SECTION_ENTER', sectionId: 'section-1' });

      expect(isScrollspySectionVisible(state, 'section-1')).toBe(true);
    });

    it('returns false for non-visible section', () => {
      const state = createInitialScrollspyFSMState();
      expect(isScrollspySectionVisible(state, 'section-1')).toBe(false);
    });

    it('returns true for multiple visible sections', () => {
      let state = createInitialScrollspyFSMState();
      state = scrollspyFSMReducer(state, { type: 'SECTION_ENTER', sectionId: 'section-1' });
      state = scrollspyFSMReducer(state, { type: 'SECTION_ENTER', sectionId: 'section-2' });

      expect(isScrollspySectionVisible(state, 'section-1')).toBe(true);
      expect(isScrollspySectionVisible(state, 'section-2')).toBe(true);
    });
  });

  // ===========================================================================
  // Complex Scenarios
  // ===========================================================================
  describe('Complex Scenarios', () => {
    it('handles rapid section transitions', () => {
      let state = createInitialScrollspyFSMState();
      state = scrollspyFSMReducer(state, { type: 'START_OBSERVING' });

      // Simulate scrolling through multiple sections
      state = scrollspyFSMReducer(state, { type: 'SECTION_ENTER', sectionId: 'section-1' });
      state = scrollspyFSMReducer(state, { type: 'SECTION_ENTER', sectionId: 'section-2' });
      state = scrollspyFSMReducer(state, { type: 'SECTION_LEAVE', sectionId: 'section-1' });
      state = scrollspyFSMReducer(state, { type: 'SECTION_ENTER', sectionId: 'section-3' });
      state = scrollspyFSMReducer(state, { type: 'SECTION_LEAVE', sectionId: 'section-2' });

      expect(state.visibleIds).toEqual(['section-3']);
      expect(state.activeId).toBe('section-3');
    });

    it('maintains state consistency across many operations', () => {
      let state = createInitialScrollspyFSMState();

      // Start, add sections, stop, start again
      state = scrollspyFSMReducer(state, { type: 'START_OBSERVING' });
      state = scrollspyFSMReducer(state, { type: 'SECTION_ENTER', sectionId: 'a' });
      state = scrollspyFSMReducer(state, { type: 'SECTION_ENTER', sectionId: 'b' });
      state = scrollspyFSMReducer(state, { type: 'STOP_OBSERVING' });

      expect(state.visibleIds).toHaveLength(0);
      expect(state.isObserving).toBe(false);
      // activeId is preserved even when stopping
      expect(state.activeId).toBe('a');

      state = scrollspyFSMReducer(state, { type: 'START_OBSERVING' });
      state = scrollspyFSMReducer(state, { type: 'SECTION_ENTER', sectionId: 'c' });

      expect(state.visibleIds).toContain('c');
      // activeId remains 'a' since it was already set (not nullish)
      expect(state.activeId).toBe('a');
    });

    it('handles controlled mode with SET_ACTIVE', () => {
      let state = createInitialScrollspyFSMState();
      state = scrollspyFSMReducer(state, { type: 'START_OBSERVING' });
      state = scrollspyFSMReducer(state, { type: 'SECTION_ENTER', sectionId: 'section-1' });
      state = scrollspyFSMReducer(state, { type: 'SECTION_ENTER', sectionId: 'section-2' });

      // External control sets active to section-2 even though section-1 was first
      state = scrollspyFSMReducer(state, { type: 'SET_ACTIVE', sectionId: 'section-2' });

      expect(state.activeId).toBe('section-2');
      expect(state.visibleIds).toContain('section-1');
      expect(state.visibleIds).toContain('section-2');
    });
  });

  // ===========================================================================
  // Edge Cases
  // ===========================================================================
  describe('Edge Cases', () => {
    it('handles empty section IDs', () => {
      let state = createInitialScrollspyFSMState();
      state = scrollspyFSMReducer(state, { type: 'SECTION_ENTER', sectionId: '' });

      expect(state.visibleIds).toContain('');
      expect(state.activeId).toBe('');
    });

    it('handles section IDs with special characters', () => {
      let state = createInitialScrollspyFSMState();
      state = scrollspyFSMReducer(state, {
        type: 'SECTION_ENTER',
        sectionId: 'section-with-dashes_and_underscores',
      });

      expect(state.visibleIds).toContain('section-with-dashes_and_underscores');
    });

    it('maintains immutability of state', () => {
      const initialState = createInitialScrollspyFSMState();
      const nextState = scrollspyFSMReducer(initialState, {
        type: 'SECTION_ENTER',
        sectionId: 'section-1',
      });

      expect(initialState.visibleIds).toHaveLength(0);
      expect(nextState.visibleIds).toHaveLength(1);
      expect(initialState).not.toBe(nextState);
    });
  });
});
