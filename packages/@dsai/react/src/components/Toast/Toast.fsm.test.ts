import { createInitialToastFSMState, getToastVisualState, toastFSMReducer } from './Toast.fsm';

import type { ToastFSMEvent, ToastFSMState } from './Toast.types';

describe('Toast FSM', () => {
  describe('createInitialToastFSMState', () => {
    it('creates entering state when initialShow is true', () => {
      const state = createInitialToastFSMState(true);

      expect(state.visibility).toBe('entering');
      expect(state.shouldRender).toBe(true);
    });

    it('creates hidden state when initialShow is false', () => {
      const state = createInitialToastFSMState(false);

      expect(state.visibility).toBe('hidden');
      expect(state.shouldRender).toBe(false);
    });
  });

  describe('toastFSMReducer', () => {
    describe('from hidden state', () => {
      const hiddenState: ToastFSMState = {
        visibility: 'hidden',
        shouldRender: false,
      };

      it('transitions to entering on SHOW event', () => {
        const event: ToastFSMEvent = { type: 'SHOW' };
        const nextState = toastFSMReducer(hiddenState, event);

        expect(nextState.visibility).toBe('entering');
        expect(nextState.shouldRender).toBe(true);
      });

      it('stays hidden on HIDE event', () => {
        const event: ToastFSMEvent = { type: 'HIDE' };
        const nextState = toastFSMReducer(hiddenState, event);

        expect(nextState).toBe(hiddenState);
      });

      it('stays hidden on DISMISS event', () => {
        const event: ToastFSMEvent = { type: 'DISMISS' };
        const nextState = toastFSMReducer(hiddenState, event);

        expect(nextState).toBe(hiddenState);
      });

      it('stays hidden on ANIMATION_END event', () => {
        const event: ToastFSMEvent = { type: 'ANIMATION_END' };
        const nextState = toastFSMReducer(hiddenState, event);

        expect(nextState).toBe(hiddenState);
      });
    });

    describe('from entering state', () => {
      const enteringState: ToastFSMState = {
        visibility: 'entering',
        shouldRender: true,
      };

      it('transitions to visible on ANIMATION_END event', () => {
        const event: ToastFSMEvent = { type: 'ANIMATION_END' };
        const nextState = toastFSMReducer(enteringState, event);

        expect(nextState.visibility).toBe('visible');
        expect(nextState.shouldRender).toBe(true);
      });

      it('transitions to exiting on HIDE event', () => {
        const event: ToastFSMEvent = { type: 'HIDE' };
        const nextState = toastFSMReducer(enteringState, event);

        expect(nextState.visibility).toBe('exiting');
        expect(nextState.shouldRender).toBe(true);
      });

      it('transitions to exiting on DISMISS event', () => {
        const event: ToastFSMEvent = { type: 'DISMISS' };
        const nextState = toastFSMReducer(enteringState, event);

        expect(nextState.visibility).toBe('exiting');
        expect(nextState.shouldRender).toBe(true);
      });

      it('stays entering on SHOW event (idempotent)', () => {
        const event: ToastFSMEvent = { type: 'SHOW' };
        const nextState = toastFSMReducer(enteringState, event);

        expect(nextState).toBe(enteringState);
      });
    });

    describe('from visible state', () => {
      const visibleState: ToastFSMState = {
        visibility: 'visible',
        shouldRender: true,
      };

      it('transitions to exiting on HIDE event', () => {
        const event: ToastFSMEvent = { type: 'HIDE' };
        const nextState = toastFSMReducer(visibleState, event);

        expect(nextState.visibility).toBe('exiting');
        expect(nextState.shouldRender).toBe(true);
      });

      it('transitions to exiting on DISMISS event', () => {
        const event: ToastFSMEvent = { type: 'DISMISS' };
        const nextState = toastFSMReducer(visibleState, event);

        expect(nextState.visibility).toBe('exiting');
        expect(nextState.shouldRender).toBe(true);
      });

      it('stays visible on SHOW event (idempotent)', () => {
        const event: ToastFSMEvent = { type: 'SHOW' };
        const nextState = toastFSMReducer(visibleState, event);

        expect(nextState).toBe(visibleState);
      });

      it('stays visible on ANIMATION_END event', () => {
        const event: ToastFSMEvent = { type: 'ANIMATION_END' };
        const nextState = toastFSMReducer(visibleState, event);

        expect(nextState).toBe(visibleState);
      });
    });

    describe('from exiting state', () => {
      const exitingState: ToastFSMState = {
        visibility: 'exiting',
        shouldRender: true,
      };

      it('transitions to hidden on ANIMATION_END event', () => {
        const event: ToastFSMEvent = { type: 'ANIMATION_END' };
        const nextState = toastFSMReducer(exitingState, event);

        expect(nextState.visibility).toBe('hidden');
        expect(nextState.shouldRender).toBe(false);
      });

      it('transitions to entering on SHOW event (re-show while exiting)', () => {
        const event: ToastFSMEvent = { type: 'SHOW' };
        const nextState = toastFSMReducer(exitingState, event);

        expect(nextState.visibility).toBe('entering');
        expect(nextState.shouldRender).toBe(true);
      });

      it('stays exiting on HIDE event', () => {
        const event: ToastFSMEvent = { type: 'HIDE' };
        const nextState = toastFSMReducer(exitingState, event);

        expect(nextState).toBe(exitingState);
      });

      it('stays exiting on DISMISS event', () => {
        const event: ToastFSMEvent = { type: 'DISMISS' };
        const nextState = toastFSMReducer(exitingState, event);

        expect(nextState).toBe(exitingState);
      });
    });

    describe('unknown state handling', () => {
      it('returns same state for unknown visibility', () => {
        const unknownState = {
          visibility: 'unknown' as ToastFSMState['visibility'],
          shouldRender: false,
        };
        const event: ToastFSMEvent = { type: 'SHOW' };
        const nextState = toastFSMReducer(unknownState, event);

        expect(nextState).toBe(unknownState);
      });
    });
  });

  describe('getToastVisualState', () => {
    it('returns "hidden" for hidden visibility', () => {
      const state: ToastFSMState = { visibility: 'hidden', shouldRender: false };
      expect(getToastVisualState(state)).toBe('hidden');
    });

    it('returns "showing" for entering visibility', () => {
      const state: ToastFSMState = { visibility: 'entering', shouldRender: true };
      expect(getToastVisualState(state)).toBe('showing');
    });

    it('returns "visible" for visible visibility', () => {
      const state: ToastFSMState = { visibility: 'visible', shouldRender: true };
      expect(getToastVisualState(state)).toBe('visible');
    });

    it('returns "hiding" for exiting visibility', () => {
      const state: ToastFSMState = { visibility: 'exiting', shouldRender: true };
      expect(getToastVisualState(state)).toBe('hiding');
    });

    it('returns "hidden" for unknown visibility', () => {
      const state = {
        visibility: 'unknown' as ToastFSMState['visibility'],
        shouldRender: false,
      };
      expect(getToastVisualState(state)).toBe('hidden');
    });
  });

  describe('full lifecycle', () => {
    it('handles show -> visible -> hide -> hidden lifecycle', () => {
      // Start hidden
      let state = createInitialToastFSMState(false);
      expect(state.visibility).toBe('hidden');

      // Show toast
      state = toastFSMReducer(state, { type: 'SHOW' });
      expect(state.visibility).toBe('entering');
      expect(state.shouldRender).toBe(true);

      // Animation ends -> visible
      state = toastFSMReducer(state, { type: 'ANIMATION_END' });
      expect(state.visibility).toBe('visible');
      expect(state.shouldRender).toBe(true);

      // Hide toast
      state = toastFSMReducer(state, { type: 'HIDE' });
      expect(state.visibility).toBe('exiting');
      expect(state.shouldRender).toBe(true);

      // Animation ends -> hidden
      state = toastFSMReducer(state, { type: 'ANIMATION_END' });
      expect(state.visibility).toBe('hidden');
      expect(state.shouldRender).toBe(false);
    });

    it('handles dismiss during entering phase', () => {
      let state = createInitialToastFSMState(true);
      expect(state.visibility).toBe('entering');

      // Dismiss while entering
      state = toastFSMReducer(state, { type: 'DISMISS' });
      expect(state.visibility).toBe('exiting');

      // Animation ends
      state = toastFSMReducer(state, { type: 'ANIMATION_END' });
      expect(state.visibility).toBe('hidden');
      expect(state.shouldRender).toBe(false);
    });

    it('handles re-show during exiting phase', () => {
      // Start visible
      let state: ToastFSMState = { visibility: 'visible', shouldRender: true };

      // Start exiting
      state = toastFSMReducer(state, { type: 'HIDE' });
      expect(state.visibility).toBe('exiting');

      // Re-show while exiting
      state = toastFSMReducer(state, { type: 'SHOW' });
      expect(state.visibility).toBe('entering');
      expect(state.shouldRender).toBe(true);

      // Animation ends -> visible
      state = toastFSMReducer(state, { type: 'ANIMATION_END' });
      expect(state.visibility).toBe('visible');
    });
  });

  describe('state immutability', () => {
    it('returns same state object when no transition occurs', () => {
      const hiddenState: ToastFSMState = {
        visibility: 'hidden',
        shouldRender: false,
      };

      const resultHide = toastFSMReducer(hiddenState, { type: 'HIDE' });
      const resultDismiss = toastFSMReducer(hiddenState, { type: 'DISMISS' });
      const resultAnimEnd = toastFSMReducer(hiddenState, { type: 'ANIMATION_END' });

      expect(resultHide).toBe(hiddenState);
      expect(resultDismiss).toBe(hiddenState);
      expect(resultAnimEnd).toBe(hiddenState);
    });

    it('returns new state object when transition occurs', () => {
      const hiddenState: ToastFSMState = {
        visibility: 'hidden',
        shouldRender: false,
      };

      const nextState = toastFSMReducer(hiddenState, { type: 'SHOW' });

      expect(nextState).not.toBe(hiddenState);
      expect(nextState.visibility).toBe('entering');
    });
  });
});
