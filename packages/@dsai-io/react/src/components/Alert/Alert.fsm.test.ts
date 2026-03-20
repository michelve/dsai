import { alertFSMReducer, createInitialAlertFSMState } from './Alert.fsm';

import type { AlertFSMEvent, AlertFSMState } from './Alert.fsm';

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

      it('transitions to dismissing on DISMISS_CLICK event', () => {
        const event: AlertFSMEvent = { type: 'DISMISS_CLICK' };
        const newState = alertFSMReducer(visibleState, event);
        expect(newState).toEqual({ visibility: 'dismissing' });
      });

      it('transitions to dismissing on DISMISS_ESCAPE event', () => {
        const event: AlertFSMEvent = { type: 'DISMISS_ESCAPE' };
        const newState = alertFSMReducer(visibleState, event);
        expect(newState).toEqual({ visibility: 'dismissing' });
      });

      it('stays visible on ANIMATION_END event (no-op)', () => {
        const event: AlertFSMEvent = { type: 'ANIMATION_END' };
        const newState = alertFSMReducer(visibleState, event);
        expect(newState).toBe(visibleState);
      });

      it('transitions to dismissing on AUTO_DISMISS_TIMEOUT event', () => {
        const event: AlertFSMEvent = { type: 'AUTO_DISMISS_TIMEOUT' };
        const newState = alertFSMReducer(visibleState, event);
        expect(newState).toEqual({ visibility: 'dismissing' });
      });
    });

    describe('from dismissing state', () => {
      const dismissingState: AlertFSMState = { visibility: 'dismissing' };

      it('transitions to hidden on ANIMATION_END event', () => {
        const event: AlertFSMEvent = { type: 'ANIMATION_END' };
        const newState = alertFSMReducer(dismissingState, event);
        expect(newState).toEqual({ visibility: 'hidden' });
      });

      it('transitions to visible on SHOW event (cancel animation)', () => {
        const event: AlertFSMEvent = { type: 'SHOW' };
        const newState = alertFSMReducer(dismissingState, event);
        expect(newState).toEqual({ visibility: 'visible' });
      });

      it('transitions to hidden on HIDE event (force hide)', () => {
        const event: AlertFSMEvent = { type: 'HIDE' };
        const newState = alertFSMReducer(dismissingState, event);
        expect(newState).toEqual({ visibility: 'hidden' });
      });

      it('stays dismissing on DISMISS_CLICK event', () => {
        const event: AlertFSMEvent = { type: 'DISMISS_CLICK' };
        const newState = alertFSMReducer(dismissingState, event);
        expect(newState).toBe(dismissingState);
      });

      it('stays dismissing on DISMISS_ESCAPE event', () => {
        const event: AlertFSMEvent = { type: 'DISMISS_ESCAPE' };
        const newState = alertFSMReducer(dismissingState, event);
        expect(newState).toBe(dismissingState);
      });

      it('stays dismissing on AUTO_DISMISS_TIMEOUT event', () => {
        const event: AlertFSMEvent = { type: 'AUTO_DISMISS_TIMEOUT' };
        const newState = alertFSMReducer(dismissingState, event);
        expect(newState).toBe(dismissingState);
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

      it('stays hidden on AUTO_DISMISS_TIMEOUT event (no-op)', () => {
        const event: AlertFSMEvent = { type: 'AUTO_DISMISS_TIMEOUT' };
        const newState = alertFSMReducer(hiddenState, event);
        expect(newState).toBe(hiddenState);
      });

      it('stays hidden on ANIMATION_END event (no-op)', () => {
        const event: AlertFSMEvent = { type: 'ANIMATION_END' };
        const newState = alertFSMReducer(hiddenState, event);
        expect(newState).toBe(hiddenState);
      });
    });

    describe('transition sequences', () => {
      it('handles show → dismiss → animation end → show cycle', () => {
        let state = createInitialAlertFSMState(true);
        expect(state.visibility).toBe('visible');

        // Dismiss via click → goes to dismissing
        state = alertFSMReducer(state, { type: 'DISMISS_CLICK' });
        expect(state.visibility).toBe('dismissing');

        // Animation ends → goes to hidden
        state = alertFSMReducer(state, { type: 'ANIMATION_END' });
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
        const state = createInitialAlertFSMState(true);

        // First show (already visible)
        const stateAfterFirstShow = alertFSMReducer(state, { type: 'SHOW' });
        expect(stateAfterFirstShow).toBe(state);

        // Second show
        const stateAfterSecondShow = alertFSMReducer(stateAfterFirstShow, { type: 'SHOW' });
        expect(stateAfterSecondShow).toBe(stateAfterFirstShow);
      });
    });

    describe('default branches (defensive)', () => {
      it('returns same state for unknown event in visible state', () => {
        const state: AlertFSMState = { visibility: 'visible' };
        const result = alertFSMReducer(state, { type: 'UNKNOWN' } as unknown as AlertFSMEvent);
        expect(result).toBe(state);
      });

      it('returns same state for unknown event in hidden state', () => {
        const state: AlertFSMState = { visibility: 'hidden' };
        const result = alertFSMReducer(state, { type: 'UNKNOWN' } as unknown as AlertFSMEvent);
        expect(result).toBe(state);
      });

      it('returns same state for unknown event in dismissing state', () => {
        const state: AlertFSMState = { visibility: 'dismissing' };
        const result = alertFSMReducer(state, { type: 'UNKNOWN' } as unknown as AlertFSMEvent);
        expect(result).toBe(state);
      });

      it('returns same state for unknown visibility value', () => {
        const state = { visibility: 'transitioning' } as unknown as AlertFSMState;
        const result = alertFSMReducer(state, { type: 'SHOW' });
        expect(result).toBe(state);
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
