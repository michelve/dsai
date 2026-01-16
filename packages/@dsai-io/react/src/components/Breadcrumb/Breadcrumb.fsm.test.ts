/**
 * @file Breadcrumb FSM Tests
 * @description Unit tests for Breadcrumb expand/collapse state machine
 */

import {
  type BreadcrumbFSMEvent,
  type BreadcrumbFSMState,
  breadcrumbFSMReducer,
  createInitialBreadcrumbFSMState,
  expandEvent,
  isCollapsed,
  isExpanded,
  resetFromPropsEvent,
} from './Breadcrumb.fsm';

describe('Breadcrumb FSM', () => {
  // ==========================================================================
  // Initial State Factory
  // ==========================================================================

  describe('createInitialBreadcrumbFSMState', () => {
    it('should create collapsed state when controlledExpanded is undefined', () => {
      const state = createInitialBreadcrumbFSMState(undefined);

      expect(state).toEqual({
        expandState: 'collapsed',
        isControlled: false,
      });
    });

    it('should create collapsed state when controlledExpanded is false', () => {
      const state = createInitialBreadcrumbFSMState(false);

      expect(state).toEqual({
        expandState: 'collapsed',
        isControlled: true,
      });
    });

    it('should create expanded state when controlledExpanded is true', () => {
      const state = createInitialBreadcrumbFSMState(true);

      expect(state).toEqual({
        expandState: 'expanded',
        isControlled: true,
      });
    });
  });

  // ==========================================================================
  // State Predicates
  // ==========================================================================

  describe('state predicates', () => {
    describe('isCollapsed', () => {
      it('should return true when expandState is collapsed', () => {
        const state: BreadcrumbFSMState = {
          expandState: 'collapsed',
          isControlled: false,
        };
        expect(isCollapsed(state)).toBe(true);
      });

      it('should return false when expandState is expanded', () => {
        const state: BreadcrumbFSMState = {
          expandState: 'expanded',
          isControlled: false,
        };
        expect(isCollapsed(state)).toBe(false);
      });
    });

    describe('isExpanded', () => {
      it('should return true when expandState is expanded', () => {
        const state: BreadcrumbFSMState = {
          expandState: 'expanded',
          isControlled: false,
        };
        expect(isExpanded(state)).toBe(true);
      });

      it('should return false when expandState is collapsed', () => {
        const state: BreadcrumbFSMState = {
          expandState: 'collapsed',
          isControlled: false,
        };
        expect(isExpanded(state)).toBe(false);
      });
    });
  });

  // ==========================================================================
  // Event Creators
  // ==========================================================================

  describe('event creators', () => {
    it('expandEvent should create an EXPAND event', () => {
      expect(expandEvent()).toEqual({ type: 'EXPAND' });
    });

    it('resetFromPropsEvent should create a RESET_FROM_PROPS event with undefined', () => {
      expect(resetFromPropsEvent(undefined)).toEqual({
        type: 'RESET_FROM_PROPS',
        payload: { controlledExpanded: undefined },
      });
    });

    it('resetFromPropsEvent should create a RESET_FROM_PROPS event with true', () => {
      expect(resetFromPropsEvent(true)).toEqual({
        type: 'RESET_FROM_PROPS',
        payload: { controlledExpanded: true },
      });
    });

    it('resetFromPropsEvent should create a RESET_FROM_PROPS event with false', () => {
      expect(resetFromPropsEvent(false)).toEqual({
        type: 'RESET_FROM_PROPS',
        payload: { controlledExpanded: false },
      });
    });
  });

  // ==========================================================================
  // EXPAND Event Transitions
  // ==========================================================================

  describe('EXPAND event', () => {
    describe('uncontrolled mode', () => {
      it('should transition from collapsed to expanded', () => {
        const state: BreadcrumbFSMState = {
          expandState: 'collapsed',
          isControlled: false,
        };
        const event: BreadcrumbFSMEvent = { type: 'EXPAND' };

        const newState = breadcrumbFSMReducer(state, event);

        expect(newState).toEqual({
          expandState: 'expanded',
          isControlled: false,
        });
      });

      it('should stay expanded if already expanded (no state change)', () => {
        const state: BreadcrumbFSMState = {
          expandState: 'expanded',
          isControlled: false,
        };
        const event: BreadcrumbFSMEvent = { type: 'EXPAND' };

        const newState = breadcrumbFSMReducer(state, event);

        // Same reference - no change
        expect(newState).toBe(state);
      });
    });

    describe('controlled mode', () => {
      it('should NOT transition when in controlled mode (collapsed)', () => {
        const state: BreadcrumbFSMState = {
          expandState: 'collapsed',
          isControlled: true,
        };
        const event: BreadcrumbFSMEvent = { type: 'EXPAND' };

        const newState = breadcrumbFSMReducer(state, event);

        // Same reference - no change (parent controls state)
        expect(newState).toBe(state);
      });

      it('should NOT transition when in controlled mode (expanded)', () => {
        const state: BreadcrumbFSMState = {
          expandState: 'expanded',
          isControlled: true,
        };
        const event: BreadcrumbFSMEvent = { type: 'EXPAND' };

        const newState = breadcrumbFSMReducer(state, event);

        // Same reference - no change
        expect(newState).toBe(state);
      });
    });
  });

  // ==========================================================================
  // RESET_FROM_PROPS Event Transitions
  // ==========================================================================

  describe('RESET_FROM_PROPS event', () => {
    describe('switching to controlled mode', () => {
      it('should transition from uncontrolled collapsed to controlled expanded', () => {
        const state: BreadcrumbFSMState = {
          expandState: 'collapsed',
          isControlled: false,
        };
        const event = resetFromPropsEvent(true);

        const newState = breadcrumbFSMReducer(state, event);

        expect(newState).toEqual({
          expandState: 'expanded',
          isControlled: true,
        });
      });

      it('should transition from uncontrolled expanded to controlled collapsed', () => {
        const state: BreadcrumbFSMState = {
          expandState: 'expanded',
          isControlled: false,
        };
        const event = resetFromPropsEvent(false);

        const newState = breadcrumbFSMReducer(state, event);

        expect(newState).toEqual({
          expandState: 'collapsed',
          isControlled: true,
        });
      });

      it('should transition from uncontrolled to controlled collapsed', () => {
        const state: BreadcrumbFSMState = {
          expandState: 'collapsed',
          isControlled: false,
        };
        const event = resetFromPropsEvent(false);

        const newState = breadcrumbFSMReducer(state, event);

        expect(newState).toEqual({
          expandState: 'collapsed',
          isControlled: true,
        });
      });
    });

    describe('switching to uncontrolled mode', () => {
      it('should transition from controlled expanded to uncontrolled collapsed', () => {
        const state: BreadcrumbFSMState = {
          expandState: 'expanded',
          isControlled: true,
        };
        const event = resetFromPropsEvent(undefined);

        const newState = breadcrumbFSMReducer(state, event);

        expect(newState).toEqual({
          expandState: 'collapsed',
          isControlled: false,
        });
      });

      it('should transition from controlled collapsed to uncontrolled collapsed', () => {
        const state: BreadcrumbFSMState = {
          expandState: 'collapsed',
          isControlled: true,
        };
        const event = resetFromPropsEvent(undefined);

        const newState = breadcrumbFSMReducer(state, event);

        expect(newState).toEqual({
          expandState: 'collapsed',
          isControlled: false,
        });
      });
    });

    describe('controlled mode state changes', () => {
      it('should transition from controlled collapsed to controlled expanded', () => {
        const state: BreadcrumbFSMState = {
          expandState: 'collapsed',
          isControlled: true,
        };
        const event = resetFromPropsEvent(true);

        const newState = breadcrumbFSMReducer(state, event);

        expect(newState).toEqual({
          expandState: 'expanded',
          isControlled: true,
        });
      });

      it('should transition from controlled expanded to controlled collapsed', () => {
        const state: BreadcrumbFSMState = {
          expandState: 'expanded',
          isControlled: true,
        };
        const event = resetFromPropsEvent(false);

        const newState = breadcrumbFSMReducer(state, event);

        expect(newState).toEqual({
          expandState: 'collapsed',
          isControlled: true,
        });
      });
    });

    describe('no-op transitions (same reference)', () => {
      it('should return same reference when controlled expanded to controlled expanded', () => {
        const state: BreadcrumbFSMState = {
          expandState: 'expanded',
          isControlled: true,
        };
        const event = resetFromPropsEvent(true);

        const newState = breadcrumbFSMReducer(state, event);

        expect(newState).toBe(state);
      });

      it('should return same reference when controlled collapsed to controlled collapsed', () => {
        const state: BreadcrumbFSMState = {
          expandState: 'collapsed',
          isControlled: true,
        };
        const event = resetFromPropsEvent(false);

        const newState = breadcrumbFSMReducer(state, event);

        expect(newState).toBe(state);
      });

      it('should return same reference when uncontrolled collapsed to uncontrolled collapsed', () => {
        const state: BreadcrumbFSMState = {
          expandState: 'collapsed',
          isControlled: false,
        };
        const event = resetFromPropsEvent(undefined);

        const newState = breadcrumbFSMReducer(state, event);

        expect(newState).toBe(state);
      });
    });
  });

  // ==========================================================================
  // Complete Scenarios
  // ==========================================================================

  describe('complete scenarios', () => {
    it('scenario: user clicks ellipsis in uncontrolled mode', () => {
      // Start collapsed
      let state = createInitialBreadcrumbFSMState(undefined);
      expect(state.expandState).toBe('collapsed');
      expect(state.isControlled).toBe(false);

      // User clicks ellipsis
      state = breadcrumbFSMReducer(state, expandEvent());
      expect(state.expandState).toBe('expanded');

      // Clicking again does nothing (already expanded)
      const sameState = breadcrumbFSMReducer(state, expandEvent());
      expect(sameState).toBe(state);
    });

    it('scenario: parent controls expansion state', () => {
      // Start controlled collapsed
      let state = createInitialBreadcrumbFSMState(false);
      expect(state.expandState).toBe('collapsed');
      expect(state.isControlled).toBe(true);

      // User clicks ellipsis - no state change (controlled)
      const newState = breadcrumbFSMReducer(state, expandEvent());
      expect(newState).toBe(state); // Same reference

      // Parent expands via prop
      state = breadcrumbFSMReducer(state, resetFromPropsEvent(true));
      expect(state.expandState).toBe('expanded');

      // Parent collapses via prop
      state = breadcrumbFSMReducer(state, resetFromPropsEvent(false));
      expect(state.expandState).toBe('collapsed');
    });

    it('scenario: switch from uncontrolled to controlled', () => {
      // Start uncontrolled
      let state = createInitialBreadcrumbFSMState(undefined);
      expect(state.isControlled).toBe(false);

      // User expands
      state = breadcrumbFSMReducer(state, expandEvent());
      expect(state.expandState).toBe('expanded');

      // Parent takes control and collapses
      state = breadcrumbFSMReducer(state, resetFromPropsEvent(false));
      expect(state.expandState).toBe('collapsed');
      expect(state.isControlled).toBe(true);

      // User clicks - no effect (now controlled)
      const sameState = breadcrumbFSMReducer(state, expandEvent());
      expect(sameState).toBe(state);
    });

    it('scenario: switch from controlled to uncontrolled', () => {
      // Start controlled expanded
      let state = createInitialBreadcrumbFSMState(true);
      expect(state.expandState).toBe('expanded');
      expect(state.isControlled).toBe(true);

      // Parent removes control
      state = breadcrumbFSMReducer(state, resetFromPropsEvent(undefined));
      expect(state.expandState).toBe('collapsed'); // Reset to default
      expect(state.isControlled).toBe(false);

      // User can now expand
      state = breadcrumbFSMReducer(state, expandEvent());
      expect(state.expandState).toBe('expanded');
    });
  });

  // ==========================================================================
  // Immutability Tests
  // ==========================================================================

  describe('immutability', () => {
    it('should not mutate original state on EXPAND', () => {
      const originalState: BreadcrumbFSMState = {
        expandState: 'collapsed',
        isControlled: false,
      };
      const frozenState = Object.freeze(originalState);

      const newState = breadcrumbFSMReducer(frozenState, expandEvent());

      expect(newState).not.toBe(originalState);
      expect(originalState.expandState).toBe('collapsed');
    });

    it('should not mutate original state on RESET_FROM_PROPS', () => {
      const originalState: BreadcrumbFSMState = {
        expandState: 'collapsed',
        isControlled: false,
      };
      const frozenState = Object.freeze(originalState);

      const newState = breadcrumbFSMReducer(frozenState, resetFromPropsEvent(true));

      expect(newState).not.toBe(originalState);
      expect(originalState.expandState).toBe('collapsed');
    });
  });

  // ==========================================================================
  // Type Safety Tests
  // ==========================================================================

  describe('type safety', () => {
    it('should handle all event types', () => {
      const state: BreadcrumbFSMState = {
        expandState: 'collapsed',
        isControlled: false,
      };

      // These should compile without errors
      const events: BreadcrumbFSMEvent[] = [
        { type: 'EXPAND' },
        { type: 'RESET_FROM_PROPS', payload: { controlledExpanded: true } },
        { type: 'RESET_FROM_PROPS', payload: { controlledExpanded: false } },
        { type: 'RESET_FROM_PROPS', payload: { controlledExpanded: undefined } },
      ];

      events.forEach((event) => {
        expect(() => breadcrumbFSMReducer(state, event)).not.toThrow();
      });
    });
  });
});
