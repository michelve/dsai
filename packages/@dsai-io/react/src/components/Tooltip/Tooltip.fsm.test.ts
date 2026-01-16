import {
  createInitialTooltipFSMState,
  getTooltipVisualState,
  tooltipFSMReducer,
} from './Tooltip.fsm';

import type { TooltipFSMState } from './Tooltip.types';

describe('Tooltip FSM', () => {
  // ============================================================================
  // Initial State Tests
  // ============================================================================
  describe('createInitialTooltipFSMState', () => {
    it('creates closed state when initialOpen is false', () => {
      const state = createInitialTooltipFSMState(false);

      expect(state).toEqual({
        visibility: 'closed',
        shouldRender: false,
      });
    });

    it('creates open state when initialOpen is true', () => {
      const state = createInitialTooltipFSMState(true);

      expect(state).toEqual({
        visibility: 'open',
        shouldRender: true,
      });
    });
  });

  // ============================================================================
  // State Transitions - Closed State
  // ============================================================================
  describe('Transitions from closed state', () => {
    const closedState: TooltipFSMState = {
      visibility: 'closed',
      shouldRender: false,
    };

    it('transitions to opening on OPEN event', () => {
      const newState = tooltipFSMReducer(closedState, { type: 'OPEN' });

      expect(newState).toEqual({
        visibility: 'opening',
        shouldRender: true,
      });
    });

    it('ignores CLOSE event', () => {
      const newState = tooltipFSMReducer(closedState, { type: 'CLOSE' });

      expect(newState).toBe(closedState);
    });

    it('ignores ANIMATION_END event', () => {
      const newState = tooltipFSMReducer(closedState, { type: 'ANIMATION_END' });

      expect(newState).toBe(closedState);
    });
  });

  // ============================================================================
  // State Transitions - Opening State
  // ============================================================================
  describe('Transitions from opening state', () => {
    const openingState: TooltipFSMState = {
      visibility: 'opening',
      shouldRender: true,
    };

    it('transitions to open on ANIMATION_END event', () => {
      const newState = tooltipFSMReducer(openingState, { type: 'ANIMATION_END' });

      expect(newState).toEqual({
        visibility: 'open',
        shouldRender: true,
      });
    });

    it('transitions to closing on CLOSE event (interrupt)', () => {
      const newState = tooltipFSMReducer(openingState, { type: 'CLOSE' });

      expect(newState).toEqual({
        visibility: 'closing',
        shouldRender: true,
      });
    });

    it('ignores OPEN event', () => {
      const newState = tooltipFSMReducer(openingState, { type: 'OPEN' });

      expect(newState).toBe(openingState);
    });
  });

  // ============================================================================
  // State Transitions - Open State
  // ============================================================================
  describe('Transitions from open state', () => {
    const openState: TooltipFSMState = {
      visibility: 'open',
      shouldRender: true,
    };

    it('transitions to closing on CLOSE event', () => {
      const newState = tooltipFSMReducer(openState, { type: 'CLOSE' });

      expect(newState).toEqual({
        visibility: 'closing',
        shouldRender: true,
      });
    });

    it('ignores OPEN event', () => {
      const newState = tooltipFSMReducer(openState, { type: 'OPEN' });

      expect(newState).toBe(openState);
    });

    it('ignores ANIMATION_END event', () => {
      const newState = tooltipFSMReducer(openState, { type: 'ANIMATION_END' });

      expect(newState).toBe(openState);
    });
  });

  // ============================================================================
  // State Transitions - Closing State
  // ============================================================================
  describe('Transitions from closing state', () => {
    const closingState: TooltipFSMState = {
      visibility: 'closing',
      shouldRender: true,
    };

    it('transitions to closed on ANIMATION_END event', () => {
      const newState = tooltipFSMReducer(closingState, { type: 'ANIMATION_END' });

      expect(newState).toEqual({
        visibility: 'closed',
        shouldRender: false,
      });
    });

    it('transitions to opening on OPEN event (interrupt)', () => {
      const newState = tooltipFSMReducer(closingState, { type: 'OPEN' });

      expect(newState).toEqual({
        visibility: 'opening',
        shouldRender: true,
      });
    });

    it('ignores CLOSE event', () => {
      const newState = tooltipFSMReducer(closingState, { type: 'CLOSE' });

      expect(newState).toBe(closingState);
    });
  });

  // ============================================================================
  // Complete State Cycle
  // ============================================================================
  describe('Complete state cycle', () => {
    it('completes full open/close cycle', () => {
      let state = createInitialTooltipFSMState(false);
      expect(state.visibility).toBe('closed');

      // Open
      state = tooltipFSMReducer(state, { type: 'OPEN' });
      expect(state.visibility).toBe('opening');
      expect(state.shouldRender).toBe(true);

      // Animation ends
      state = tooltipFSMReducer(state, { type: 'ANIMATION_END' });
      expect(state.visibility).toBe('open');
      expect(state.shouldRender).toBe(true);

      // Close
      state = tooltipFSMReducer(state, { type: 'CLOSE' });
      expect(state.visibility).toBe('closing');
      expect(state.shouldRender).toBe(true);

      // Animation ends
      state = tooltipFSMReducer(state, { type: 'ANIMATION_END' });
      expect(state.visibility).toBe('closed');
      expect(state.shouldRender).toBe(false);
    });

    it('handles rapid open/close (interrupt during opening)', () => {
      let state = createInitialTooltipFSMState(false);

      // Start opening
      state = tooltipFSMReducer(state, { type: 'OPEN' });
      expect(state.visibility).toBe('opening');

      // Interrupt with close before animation ends
      state = tooltipFSMReducer(state, { type: 'CLOSE' });
      expect(state.visibility).toBe('closing');

      // Animation ends
      state = tooltipFSMReducer(state, { type: 'ANIMATION_END' });
      expect(state.visibility).toBe('closed');
    });

    it('handles rapid close/open (interrupt during closing)', () => {
      let state = createInitialTooltipFSMState(true);
      expect(state.visibility).toBe('open');

      // Start closing
      state = tooltipFSMReducer(state, { type: 'CLOSE' });
      expect(state.visibility).toBe('closing');

      // Interrupt with open before animation ends
      state = tooltipFSMReducer(state, { type: 'OPEN' });
      expect(state.visibility).toBe('opening');

      // Animation ends
      state = tooltipFSMReducer(state, { type: 'ANIMATION_END' });
      expect(state.visibility).toBe('open');
    });
  });

  // ============================================================================
  // Visual State Mapping
  // ============================================================================
  describe('getTooltipVisualState', () => {
    it('returns "hidden" for closed state', () => {
      const state: TooltipFSMState = { visibility: 'closed', shouldRender: false };
      expect(getTooltipVisualState(state)).toBe('hidden');
    });

    it('returns "showing" for opening state', () => {
      const state: TooltipFSMState = { visibility: 'opening', shouldRender: true };
      expect(getTooltipVisualState(state)).toBe('showing');
    });

    it('returns "visible" for open state', () => {
      const state: TooltipFSMState = { visibility: 'open', shouldRender: true };
      expect(getTooltipVisualState(state)).toBe('visible');
    });

    it('returns "hiding" for closing state', () => {
      const state: TooltipFSMState = { visibility: 'closing', shouldRender: true };
      expect(getTooltipVisualState(state)).toBe('hiding');
    });

    it('returns "hidden" for unknown state (safety)', () => {
      const state = { visibility: 'unknown', shouldRender: false } as unknown as TooltipFSMState;
      expect(getTooltipVisualState(state)).toBe('hidden');
    });
  });

  // ============================================================================
  // Immutability
  // ============================================================================
  describe('Immutability', () => {
    it('returns same state object when no transition occurs', () => {
      const state: TooltipFSMState = { visibility: 'closed', shouldRender: false };
      const newState = tooltipFSMReducer(state, { type: 'CLOSE' });

      expect(newState).toBe(state);
    });

    it('returns new state object when transition occurs', () => {
      const state: TooltipFSMState = { visibility: 'closed', shouldRender: false };
      const newState = tooltipFSMReducer(state, { type: 'OPEN' });

      expect(newState).not.toBe(state);
      expect(newState).toEqual({ visibility: 'opening', shouldRender: true });
    });
  });

  // ============================================================================
  // Edge Cases
  // ============================================================================
  describe('Edge cases', () => {
    it('handles multiple OPEN events in sequence', () => {
      let state = createInitialTooltipFSMState(false);

      state = tooltipFSMReducer(state, { type: 'OPEN' });
      const stateAfterFirstOpen = state;

      state = tooltipFSMReducer(state, { type: 'OPEN' });
      expect(state).toBe(stateAfterFirstOpen);

      state = tooltipFSMReducer(state, { type: 'ANIMATION_END' });
      state = tooltipFSMReducer(state, { type: 'OPEN' });
      const stateAfterOpenWhenOpen = state;
      expect(stateAfterOpenWhenOpen.visibility).toBe('open');
    });

    it('handles multiple CLOSE events in sequence', () => {
      let state = createInitialTooltipFSMState(true);

      state = tooltipFSMReducer(state, { type: 'CLOSE' });
      const stateAfterFirstClose = state;

      state = tooltipFSMReducer(state, { type: 'CLOSE' });
      expect(state).toBe(stateAfterFirstClose);
    });

    it('handles multiple ANIMATION_END events in sequence', () => {
      let state = createInitialTooltipFSMState(false);
      state = tooltipFSMReducer(state, { type: 'OPEN' });
      state = tooltipFSMReducer(state, { type: 'ANIMATION_END' });
      const stateAfterFirstEnd = state;

      state = tooltipFSMReducer(state, { type: 'ANIMATION_END' });
      expect(state).toBe(stateAfterFirstEnd);
    });
  });
});
