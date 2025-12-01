import { createInitialModalFSMState, getModalVisualState, modalFSMReducer } from './Modal.fsm';

import type { ModalFSMState } from './Modal.fsm';

describe('Modal FSM', () => {
  describe('createInitialModalFSMState', () => {
    it('creates closed state when isOpen is false', () => {
      const state = createInitialModalFSMState(false);

      expect(state).toEqual({
        visibility: 'closed',
        shouldRender: false,
        shouldShow: false,
        focusTrapActive: false,
        scrollLockActive: false,
      });
    });

    it('creates open state when isOpen is true', () => {
      const state = createInitialModalFSMState(true);

      expect(state).toEqual({
        visibility: 'open',
        shouldRender: true,
        shouldShow: true,
        focusTrapActive: true,
        scrollLockActive: true,
      });
    });
  });

  describe('modalFSMReducer', () => {
    describe('from closed state', () => {
      const closedState: ModalFSMState = {
        visibility: 'closed',
        shouldRender: false,
        shouldShow: false,
        focusTrapActive: false,
        scrollLockActive: false,
      };

      it('transitions to opening on OPEN event', () => {
        const nextState = modalFSMReducer(closedState, { type: 'OPEN' });

        expect(nextState).toEqual({
          visibility: 'opening',
          shouldRender: true,
          shouldShow: false,
          focusTrapActive: false,
          scrollLockActive: true,
        });
      });

      it('stays closed on CLOSE event (idempotent)', () => {
        const nextState = modalFSMReducer(closedState, { type: 'CLOSE' });

        expect(nextState).toBe(closedState);
      });

      it('stays closed on ANIMATION_END event', () => {
        const nextState = modalFSMReducer(closedState, {
          type: 'ANIMATION_END',
        });

        expect(nextState).toBe(closedState);
      });
    });

    describe('from opening state', () => {
      const openingState: ModalFSMState = {
        visibility: 'opening',
        shouldRender: true,
        shouldShow: false,
        focusTrapActive: false,
        scrollLockActive: true,
      };

      it('stays opening on OPEN event (idempotent)', () => {
        const nextState = modalFSMReducer(openingState, { type: 'OPEN' });

        expect(nextState).toBe(openingState);
      });

      it('transitions to closing on CLOSE event', () => {
        const nextState = modalFSMReducer(openingState, { type: 'CLOSE' });

        expect(nextState).toEqual({
          visibility: 'closing',
          shouldRender: true,
          shouldShow: false,
          focusTrapActive: false,
          scrollLockActive: true,
        });
      });

      it('transitions to open on ANIMATION_END event', () => {
        const nextState = modalFSMReducer(openingState, {
          type: 'ANIMATION_END',
        });

        expect(nextState).toEqual({
          visibility: 'open',
          shouldRender: true,
          shouldShow: true,
          focusTrapActive: true,
          scrollLockActive: true,
        });
      });
    });

    describe('from open state', () => {
      const openState: ModalFSMState = {
        visibility: 'open',
        shouldRender: true,
        shouldShow: true,
        focusTrapActive: true,
        scrollLockActive: true,
      };

      it('stays open on OPEN event (idempotent)', () => {
        const nextState = modalFSMReducer(openState, { type: 'OPEN' });

        expect(nextState).toBe(openState);
      });

      it('transitions to closing on CLOSE event', () => {
        const nextState = modalFSMReducer(openState, { type: 'CLOSE' });

        expect(nextState).toEqual({
          visibility: 'closing',
          shouldRender: true,
          shouldShow: false,
          focusTrapActive: false,
          scrollLockActive: true,
        });
      });

      it('stays open on ANIMATION_END event', () => {
        const nextState = modalFSMReducer(openState, { type: 'ANIMATION_END' });

        expect(nextState).toBe(openState);
      });
    });

    describe('from closing state', () => {
      const closingState: ModalFSMState = {
        visibility: 'closing',
        shouldRender: true,
        shouldShow: false,
        focusTrapActive: false,
        scrollLockActive: true,
      };

      it('transitions to opening on OPEN event', () => {
        const nextState = modalFSMReducer(closingState, { type: 'OPEN' });

        expect(nextState).toEqual({
          visibility: 'opening',
          shouldRender: true,
          shouldShow: false,
          focusTrapActive: false,
          scrollLockActive: true,
        });
      });

      it('stays closing on CLOSE event (idempotent)', () => {
        const nextState = modalFSMReducer(closingState, { type: 'CLOSE' });

        expect(nextState).toBe(closingState);
      });

      it('transitions to closed on ANIMATION_END event', () => {
        const nextState = modalFSMReducer(closingState, {
          type: 'ANIMATION_END',
        });

        expect(nextState).toEqual({
          visibility: 'closed',
          shouldRender: false,
          shouldShow: false,
          focusTrapActive: false,
          scrollLockActive: false,
        });
      });
    });
  });

  describe('getModalVisualState', () => {
    it('returns "closed" for closed state', () => {
      const state = createInitialModalFSMState(false);
      expect(getModalVisualState(state)).toBe('closed');
    });

    it('returns "open" for open state', () => {
      const state = createInitialModalFSMState(true);
      expect(getModalVisualState(state)).toBe('open');
    });

    it('returns "opening" for opening state', () => {
      const closedState = createInitialModalFSMState(false);
      const openingState = modalFSMReducer(closedState, { type: 'OPEN' });
      expect(getModalVisualState(openingState)).toBe('opening');
    });

    it('returns "closing" for closing state', () => {
      const openState = createInitialModalFSMState(true);
      const closingState = modalFSMReducer(openState, { type: 'CLOSE' });
      expect(getModalVisualState(closingState)).toBe('closing');
    });
  });

  describe('Full Lifecycle', () => {
    it('completes full open/close cycle correctly', () => {
      // Start closed
      let state = createInitialModalFSMState(false);
      expect(state.visibility).toBe('closed');
      expect(state.shouldRender).toBe(false);

      // Open request
      state = modalFSMReducer(state, { type: 'OPEN' });
      expect(state.visibility).toBe('opening');
      expect(state.shouldRender).toBe(true);
      expect(state.shouldShow).toBe(false);
      expect(state.scrollLockActive).toBe(true);

      // Animation completes
      state = modalFSMReducer(state, { type: 'ANIMATION_END' });
      expect(state.visibility).toBe('open');
      expect(state.shouldShow).toBe(true);
      expect(state.focusTrapActive).toBe(true);

      // Close request
      state = modalFSMReducer(state, { type: 'CLOSE' });
      expect(state.visibility).toBe('closing');
      expect(state.shouldRender).toBe(true);
      expect(state.shouldShow).toBe(false);
      expect(state.focusTrapActive).toBe(false);

      // Animation completes
      state = modalFSMReducer(state, { type: 'ANIMATION_END' });
      expect(state.visibility).toBe('closed');
      expect(state.shouldRender).toBe(false);
      expect(state.scrollLockActive).toBe(false);
    });

    it('handles rapid open/close/open correctly', () => {
      // Start closed
      let state = createInitialModalFSMState(false);

      // Open request
      state = modalFSMReducer(state, { type: 'OPEN' });
      expect(state.visibility).toBe('opening');

      // Close before animation ends
      state = modalFSMReducer(state, { type: 'CLOSE' });
      expect(state.visibility).toBe('closing');

      // Open again before close animation ends
      state = modalFSMReducer(state, { type: 'OPEN' });
      expect(state.visibility).toBe('opening');

      // Animation ends
      state = modalFSMReducer(state, { type: 'ANIMATION_END' });
      expect(state.visibility).toBe('open');
      expect(state.shouldShow).toBe(true);
    });
  });

  describe('State Immutability', () => {
    it('returns same reference for idempotent transitions', () => {
      const openState = createInitialModalFSMState(true);

      // OPEN on already open should return same object
      const sameState = modalFSMReducer(openState, { type: 'OPEN' });
      expect(sameState).toBe(openState);

      // ANIMATION_END on open should return same object
      const sameState2 = modalFSMReducer(openState, { type: 'ANIMATION_END' });
      expect(sameState2).toBe(openState);
    });

    it('returns new object for actual transitions', () => {
      const openState = createInitialModalFSMState(true);

      // CLOSE should return new object
      const closingState = modalFSMReducer(openState, { type: 'CLOSE' });
      expect(closingState).not.toBe(openState);
    });
  });
});
