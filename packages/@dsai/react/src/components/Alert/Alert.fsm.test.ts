import type { AlertFSMEvent, AlertFSMState } from './Alert.fsm';
import { alertFSMReducer, createInitialAlertFSMState } from './Alert.fsm';

describe('Alert FSM', () => {
  describe('createInitialAlertFSMState', () => {
    it('returns visible state when show is true', () => {
      const state = createInitialAlertFSMState(true);
      expect(state).toEqual({ visibility: 'visible' });
    });

    it('returns hidden state when show is false', () => {
      const state = createInitialAlertFSMState(false);
      expect(state).toEqual({ visibility: 'hidden' });
    });
  });

  describe('alertFSMReducer', () => {
    describe('from visible state', () => {
      const visibleState: AlertFSMState = { visibility: 'visible' };

      it('transitions to hidden on HIDE event', () => {
        const event: AlertFSMEvent = { type: 'HIDE' };
        const newState = alertFSMReducer(visibleState, event);
        expect(newState).toEqual({ visibility: 'hidden' });
      });

      it('transitions to hidden on DISMISS_CLICK event', () => {
        const event: AlertFSMEvent = { type: 'DISMISS_CLICK' };
        const newState = alertFSMReducer(visibleState, event);
        expect(newState).toEqual({ visibility: 'hidden' });
      });

      it('transitions to hidden on DISMISS_ESCAPE event', () => {
        const event: AlertFSMEvent = { type: 'DISMISS_ESCAPE' };
        const newState = alertFSMReducer(visibleState, event);
        expect(newState).toEqual({ visibility: 'hidden' });
      });

      it('stays visible on SHOW event (idempotent)', () => {
        const event: AlertFSMEvent = { type: 'SHOW' };
        const newState = alertFSMReducer(visibleState, event);
        expect(newState).toBe(visibleState); // Same reference
        expect(newState).toEqual({ visibility: 'visible' });
      });
    });

    describe('from hidden state', () => {
      const hiddenState: AlertFSMState = { visibility: 'hidden' };

      it('transitions to visible on SHOW event', () => {
        const event: AlertFSMEvent = { type: 'SHOW' };
        const newState = alertFSMReducer(hiddenState, event);
        expect(newState).toEqual({ visibility: 'visible' });
      });

      it('stays hidden on HIDE event (idempotent)', () => {
        const event: AlertFSMEvent = { type: 'HIDE' };
        const newState = alertFSMReducer(hiddenState, event);
        expect(newState).toBe(hiddenState); // Same reference
        expect(newState).toEqual({ visibility: 'hidden' });
      });

      it('stays hidden on DISMISS_CLICK event (no-op)', () => {
        const event: AlertFSMEvent = { type: 'DISMISS_CLICK' };
        const newState = alertFSMReducer(hiddenState, event);
        expect(newState).toBe(hiddenState); // Same reference
        expect(newState).toEqual({ visibility: 'hidden' });
      });

      it('stays hidden on DISMISS_ESCAPE event (no-op)', () => {
        const event: AlertFSMEvent = { type: 'DISMISS_ESCAPE' };
        const newState = alertFSMReducer(hiddenState, event);
        expect(newState).toBe(hiddenState); // Same reference
        expect(newState).toEqual({ visibility: 'hidden' });
      });
    });

    describe('transition sequences', () => {
      it('handles show → dismiss → show cycle', () => {
        let state = createInitialAlertFSMState(true);
        expect(state.visibility).toBe('visible');

        // Dismiss via click
        state = alertFSMReducer(state, { type: 'DISMISS_CLICK' });
        expect(state.visibility).toBe('hidden');

        // Show again
        state = alertFSMReducer(state, { type: 'SHOW' });
        expect(state.visibility).toBe('visible');
      });

      it('handles multiple hide events gracefully', () => {
        let state = createInitialAlertFSMState(true);

        // First hide
        state = alertFSMReducer(state, { type: 'HIDE' });
        expect(state.visibility).toBe('hidden');

        // Second hide (should be idempotent)
        const stateAfterSecondHide = alertFSMReducer(state, { type: 'HIDE' });
        expect(stateAfterSecondHide).toBe(state);
      });

      it('handles multiple show events gracefully', () => {
        let state = createInitialAlertFSMState(true);

        // First show (already visible)
        const stateAfterFirstShow = alertFSMReducer(state, { type: 'SHOW' });
        expect(stateAfterFirstShow).toBe(state);

        // Second show
        const stateAfterSecondShow = alertFSMReducer(stateAfterFirstShow, { type: 'SHOW' });
        expect(stateAfterSecondShow).toBe(stateAfterFirstShow);
      });
    });

    describe('pure function guarantees', () => {
      it('does not mutate the original state', () => {
        const originalState: AlertFSMState = { visibility: 'visible' };
        const originalCopy = { ...originalState };

        alertFSMReducer(originalState, { type: 'HIDE' });

        expect(originalState).toEqual(originalCopy);
      });

      it('returns new object when state changes', () => {
        const state: AlertFSMState = { visibility: 'visible' };
        const newState = alertFSMReducer(state, { type: 'HIDE' });

        expect(newState).not.toBe(state);
      });

      it('returns same reference when state does not change', () => {
        const state: AlertFSMState = { visibility: 'visible' };
        const newState = alertFSMReducer(state, { type: 'SHOW' });

        expect(newState).toBe(state);
      });
    });
  });
});
