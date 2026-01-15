import {
  createInitialPopoverFSMState,
  getPopoverVisualState,
  popoverFSMReducer,
} from './Popover.fsm';

import type { PopoverFSMState } from './Popover.types';

describe('Popover FSM', () => {
  describe('createInitialPopoverFSMState', () => {
    it('creates closed state by default', () => {
      const state = createInitialPopoverFSMState();
      expect(state).toEqual({
        visibility: 'closed',
        shouldRender: false,
      });
    });

    it('creates closed state when defaultOpen is false', () => {
      const state = createInitialPopoverFSMState(false);
      expect(state).toEqual({
        visibility: 'closed',
        shouldRender: false,
      });
    });

    it('creates open state when defaultOpen is true', () => {
      const state = createInitialPopoverFSMState(true);
      expect(state).toEqual({
        visibility: 'open',
        shouldRender: true,
      });
    });
  });

  describe('popoverFSMReducer', () => {
    describe('OPEN event', () => {
      it('transitions from closed to opening', () => {
        const state: PopoverFSMState = { visibility: 'closed', shouldRender: false };
        const nextState = popoverFSMReducer(state, { type: 'OPEN' });
        expect(nextState).toEqual({
          visibility: 'opening',
          shouldRender: true,
        });
      });

      it('transitions from closing to opening', () => {
        const state: PopoverFSMState = { visibility: 'closing', shouldRender: true };
        const nextState = popoverFSMReducer(state, { type: 'OPEN' });
        expect(nextState).toEqual({
          visibility: 'opening',
          shouldRender: true,
        });
      });

      it('does not transition from opening (already opening)', () => {
        const state: PopoverFSMState = { visibility: 'opening', shouldRender: true };
        const nextState = popoverFSMReducer(state, { type: 'OPEN' });
        expect(nextState).toBe(state);
      });

      it('does not transition from open (already open)', () => {
        const state: PopoverFSMState = { visibility: 'open', shouldRender: true };
        const nextState = popoverFSMReducer(state, { type: 'OPEN' });
        expect(nextState).toBe(state);
      });
    });

    describe('CLOSE event', () => {
      it('transitions from open to closing', () => {
        const state: PopoverFSMState = { visibility: 'open', shouldRender: true };
        const nextState = popoverFSMReducer(state, { type: 'CLOSE' });
        expect(nextState).toEqual({
          visibility: 'closing',
          shouldRender: true,
        });
      });

      it('transitions from opening to closing', () => {
        const state: PopoverFSMState = { visibility: 'opening', shouldRender: true };
        const nextState = popoverFSMReducer(state, { type: 'CLOSE' });
        expect(nextState).toEqual({
          visibility: 'closing',
          shouldRender: true,
        });
      });

      it('does not transition from closing (already closing)', () => {
        const state: PopoverFSMState = { visibility: 'closing', shouldRender: true };
        const nextState = popoverFSMReducer(state, { type: 'CLOSE' });
        expect(nextState).toBe(state);
      });

      it('does not transition from closed (already closed)', () => {
        const state: PopoverFSMState = { visibility: 'closed', shouldRender: false };
        const nextState = popoverFSMReducer(state, { type: 'CLOSE' });
        expect(nextState).toBe(state);
      });
    });

    describe('ANIMATION_END event', () => {
      it('transitions from opening to open', () => {
        const state: PopoverFSMState = { visibility: 'opening', shouldRender: true };
        const nextState = popoverFSMReducer(state, { type: 'ANIMATION_END' });
        expect(nextState).toEqual({
          visibility: 'open',
          shouldRender: true,
        });
      });

      it('transitions from closing to closed', () => {
        const state: PopoverFSMState = { visibility: 'closing', shouldRender: true };
        const nextState = popoverFSMReducer(state, { type: 'ANIMATION_END' });
        expect(nextState).toEqual({
          visibility: 'closed',
          shouldRender: false,
        });
      });

      it('does not transition from open', () => {
        const state: PopoverFSMState = { visibility: 'open', shouldRender: true };
        const nextState = popoverFSMReducer(state, { type: 'ANIMATION_END' });
        expect(nextState).toBe(state);
      });

      it('does not transition from closed', () => {
        const state: PopoverFSMState = { visibility: 'closed', shouldRender: false };
        const nextState = popoverFSMReducer(state, { type: 'ANIMATION_END' });
        expect(nextState).toBe(state);
      });
    });

    describe('unknown event', () => {
      it('returns same state for unknown event type', () => {
        const state: PopoverFSMState = { visibility: 'open', shouldRender: true };
        // @ts-expect-error Testing unknown event
        const nextState = popoverFSMReducer(state, { type: 'UNKNOWN' });
        expect(nextState).toBe(state);
      });
    });

    describe('complete state transitions', () => {
      it('handles full open cycle: closed → opening → open', () => {
        let state = createInitialPopoverFSMState(false);
        expect(state.visibility).toBe('closed');

        state = popoverFSMReducer(state, { type: 'OPEN' });
        expect(state.visibility).toBe('opening');
        expect(state.shouldRender).toBe(true);

        state = popoverFSMReducer(state, { type: 'ANIMATION_END' });
        expect(state.visibility).toBe('open');
        expect(state.shouldRender).toBe(true);
      });

      it('handles full close cycle: open → closing → closed', () => {
        let state = createInitialPopoverFSMState(true);
        expect(state.visibility).toBe('open');

        state = popoverFSMReducer(state, { type: 'CLOSE' });
        expect(state.visibility).toBe('closing');
        expect(state.shouldRender).toBe(true);

        state = popoverFSMReducer(state, { type: 'ANIMATION_END' });
        expect(state.visibility).toBe('closed');
        expect(state.shouldRender).toBe(false);
      });

      it('handles interrupt: opening → closing', () => {
        let state = createInitialPopoverFSMState(false);

        state = popoverFSMReducer(state, { type: 'OPEN' });
        expect(state.visibility).toBe('opening');

        state = popoverFSMReducer(state, { type: 'CLOSE' });
        expect(state.visibility).toBe('closing');
        expect(state.shouldRender).toBe(true);
      });

      it('handles interrupt: closing → opening', () => {
        let state = createInitialPopoverFSMState(true);

        state = popoverFSMReducer(state, { type: 'CLOSE' });
        expect(state.visibility).toBe('closing');

        state = popoverFSMReducer(state, { type: 'OPEN' });
        expect(state.visibility).toBe('opening');
        expect(state.shouldRender).toBe(true);
      });
    });
  });

  describe('getPopoverVisualState', () => {
    it('returns "hidden" for closed visibility', () => {
      const state: PopoverFSMState = { visibility: 'closed', shouldRender: false };
      expect(getPopoverVisualState(state)).toBe('hidden');
    });

    it('returns "showing" for opening visibility', () => {
      const state: PopoverFSMState = { visibility: 'opening', shouldRender: true };
      expect(getPopoverVisualState(state)).toBe('showing');
    });

    it('returns "visible" for open visibility', () => {
      const state: PopoverFSMState = { visibility: 'open', shouldRender: true };
      expect(getPopoverVisualState(state)).toBe('visible');
    });

    it('returns "hiding" for closing visibility', () => {
      const state: PopoverFSMState = { visibility: 'closing', shouldRender: true };
      expect(getPopoverVisualState(state)).toBe('hiding');
    });
  });

  describe('state machine integrity', () => {
    it('shouldRender is true when visible or animating', () => {
      const states: PopoverFSMState[] = [
        { visibility: 'opening', shouldRender: true },
        { visibility: 'open', shouldRender: true },
        { visibility: 'closing', shouldRender: true },
      ];

      for (const state of states) {
        expect(state.shouldRender).toBe(true);
      }
    });

    it('shouldRender is false only when fully closed', () => {
      const state: PopoverFSMState = { visibility: 'closed', shouldRender: false };
      expect(state.shouldRender).toBe(false);
    });

    it('reducer is pure - does not mutate input state', () => {
      const originalState: PopoverFSMState = { visibility: 'closed', shouldRender: false };
      const frozenState = Object.freeze({ ...originalState });

      // Should not throw when state is frozen
      expect(() => popoverFSMReducer(frozenState, { type: 'OPEN' })).not.toThrow();

      // Original state should remain unchanged
      expect(frozenState.visibility).toBe('closed');
      expect(frozenState.shouldRender).toBe(false);
    });

    it('returns same reference when no transition occurs', () => {
      const state: PopoverFSMState = { visibility: 'open', shouldRender: true };
      const nextState = popoverFSMReducer(state, { type: 'OPEN' });
      expect(nextState).toBe(state);
    });
  });
});
