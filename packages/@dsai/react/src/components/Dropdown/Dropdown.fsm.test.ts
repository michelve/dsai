import {
  createInitialDropdownFSMState,
  dropdownFSMReducer,
  getDropdownVisualState,
} from './Dropdown.fsm';

import type { DropdownFSMState } from './Dropdown.fsm';

describe('Dropdown FSM', () => {
  describe('createInitialDropdownFSMState', () => {
    it('creates closed state when isOpen is false', () => {
      const state = createInitialDropdownFSMState(false);

      expect(state).toEqual({
        visibility: 'closed',
        shouldRender: false,
        shouldShow: false,
        keyboardNavActive: false,
        clickOutsideActive: false,
      });
    });

    it('creates open state when isOpen is true', () => {
      const state = createInitialDropdownFSMState(true);

      expect(state).toEqual({
        visibility: 'open',
        shouldRender: true,
        shouldShow: true,
        keyboardNavActive: true,
        clickOutsideActive: true,
      });
    });
  });

  describe('dropdownFSMReducer', () => {
    describe('from closed state', () => {
      const closedState: DropdownFSMState = {
        visibility: 'closed',
        shouldRender: false,
        shouldShow: false,
        keyboardNavActive: false,
        clickOutsideActive: false,
      };

      it('transitions to opening on OPEN event', () => {
        const nextState = dropdownFSMReducer(closedState, { type: 'OPEN' });

        expect(nextState).toEqual({
          visibility: 'opening',
          shouldRender: true,
          shouldShow: false,
          keyboardNavActive: false,
          clickOutsideActive: false,
        });
      });

      it('transitions to opening on TOGGLE event', () => {
        const nextState = dropdownFSMReducer(closedState, { type: 'TOGGLE' });

        expect(nextState).toEqual({
          visibility: 'opening',
          shouldRender: true,
          shouldShow: false,
          keyboardNavActive: false,
          clickOutsideActive: false,
        });
      });

      it('stays closed on CLOSE event (idempotent)', () => {
        const nextState = dropdownFSMReducer(closedState, { type: 'CLOSE' });

        expect(nextState).toBe(closedState);
      });

      it('stays closed on ANIMATION_END event', () => {
        const nextState = dropdownFSMReducer(closedState, {
          type: 'ANIMATION_END',
        });

        expect(nextState).toBe(closedState);
      });
    });

    describe('from opening state', () => {
      const openingState: DropdownFSMState = {
        visibility: 'opening',
        shouldRender: true,
        shouldShow: false,
        keyboardNavActive: false,
        clickOutsideActive: false,
      };

      it('stays opening on OPEN event (idempotent)', () => {
        const nextState = dropdownFSMReducer(openingState, { type: 'OPEN' });

        expect(nextState).toBe(openingState);
      });

      it('transitions to closing on CLOSE event', () => {
        const nextState = dropdownFSMReducer(openingState, { type: 'CLOSE' });

        expect(nextState).toEqual({
          visibility: 'closing',
          shouldRender: true,
          shouldShow: false,
          keyboardNavActive: false,
          clickOutsideActive: false,
        });
      });

      it('transitions to closing on TOGGLE event', () => {
        const nextState = dropdownFSMReducer(openingState, { type: 'TOGGLE' });

        expect(nextState).toEqual({
          visibility: 'closing',
          shouldRender: true,
          shouldShow: false,
          keyboardNavActive: false,
          clickOutsideActive: false,
        });
      });

      it('transitions to open on ANIMATION_END event', () => {
        const nextState = dropdownFSMReducer(openingState, {
          type: 'ANIMATION_END',
        });

        expect(nextState).toEqual({
          visibility: 'open',
          shouldRender: true,
          shouldShow: true,
          keyboardNavActive: true,
          clickOutsideActive: true,
        });
      });
    });

    describe('from open state', () => {
      const openState: DropdownFSMState = {
        visibility: 'open',
        shouldRender: true,
        shouldShow: true,
        keyboardNavActive: true,
        clickOutsideActive: true,
      };

      it('stays open on OPEN event (idempotent)', () => {
        const nextState = dropdownFSMReducer(openState, { type: 'OPEN' });

        expect(nextState).toBe(openState);
      });

      it('stays open on ANIMATION_END event', () => {
        const nextState = dropdownFSMReducer(openState, {
          type: 'ANIMATION_END',
        });

        expect(nextState).toBe(openState);
      });

      it('transitions to closing on CLOSE event', () => {
        const nextState = dropdownFSMReducer(openState, { type: 'CLOSE' });

        expect(nextState).toEqual({
          visibility: 'closing',
          shouldRender: true,
          shouldShow: false,
          keyboardNavActive: false,
          clickOutsideActive: false,
        });
      });

      it('transitions to closing on TOGGLE event', () => {
        const nextState = dropdownFSMReducer(openState, { type: 'TOGGLE' });

        expect(nextState).toEqual({
          visibility: 'closing',
          shouldRender: true,
          shouldShow: false,
          keyboardNavActive: false,
          clickOutsideActive: false,
        });
      });
    });

    describe('from closing state', () => {
      const closingState: DropdownFSMState = {
        visibility: 'closing',
        shouldRender: true,
        shouldShow: false,
        keyboardNavActive: false,
        clickOutsideActive: false,
      };

      it('transitions to opening on OPEN event', () => {
        const nextState = dropdownFSMReducer(closingState, { type: 'OPEN' });

        expect(nextState).toEqual({
          visibility: 'opening',
          shouldRender: true,
          shouldShow: false,
          keyboardNavActive: false,
          clickOutsideActive: false,
        });
      });

      it('transitions to opening on TOGGLE event', () => {
        const nextState = dropdownFSMReducer(closingState, { type: 'TOGGLE' });

        expect(nextState).toEqual({
          visibility: 'opening',
          shouldRender: true,
          shouldShow: false,
          keyboardNavActive: false,
          clickOutsideActive: false,
        });
      });

      it('stays closing on CLOSE event (idempotent)', () => {
        const nextState = dropdownFSMReducer(closingState, { type: 'CLOSE' });

        expect(nextState).toBe(closingState);
      });

      it('transitions to closed on ANIMATION_END event', () => {
        const nextState = dropdownFSMReducer(closingState, {
          type: 'ANIMATION_END',
        });

        expect(nextState).toEqual({
          visibility: 'closed',
          shouldRender: false,
          shouldShow: false,
          keyboardNavActive: false,
          clickOutsideActive: false,
        });
      });
    });
  });

  describe('getDropdownVisualState', () => {
    it('returns visibility state value', () => {
      const closedState = createInitialDropdownFSMState(false);
      const openState = createInitialDropdownFSMState(true);

      expect(getDropdownVisualState(closedState)).toBe('closed');
      expect(getDropdownVisualState(openState)).toBe('open');
    });

    it('returns opening for opening state', () => {
      const state = dropdownFSMReducer(createInitialDropdownFSMState(false), {
        type: 'OPEN',
      });

      expect(getDropdownVisualState(state)).toBe('opening');
    });

    it('returns closing for closing state', () => {
      const openState = createInitialDropdownFSMState(true);
      const closingState = dropdownFSMReducer(openState, { type: 'CLOSE' });

      expect(getDropdownVisualState(closingState)).toBe('closing');
    });
  });

  describe('full lifecycle transitions', () => {
    it('handles complete open → close lifecycle', () => {
      let state = createInitialDropdownFSMState(false);
      expect(state.visibility).toBe('closed');

      // Open the dropdown
      state = dropdownFSMReducer(state, { type: 'OPEN' });
      expect(state.visibility).toBe('opening');
      expect(state.shouldRender).toBe(true);
      expect(state.shouldShow).toBe(false);

      // Animation completes
      state = dropdownFSMReducer(state, { type: 'ANIMATION_END' });
      expect(state.visibility).toBe('open');
      expect(state.shouldShow).toBe(true);
      expect(state.keyboardNavActive).toBe(true);
      expect(state.clickOutsideActive).toBe(true);

      // Close the dropdown
      state = dropdownFSMReducer(state, { type: 'CLOSE' });
      expect(state.visibility).toBe('closing');
      expect(state.shouldShow).toBe(false);
      expect(state.keyboardNavActive).toBe(false);

      // Animation completes
      state = dropdownFSMReducer(state, { type: 'ANIMATION_END' });
      expect(state.visibility).toBe('closed');
      expect(state.shouldRender).toBe(false);
    });

    it('handles rapid open/close/open sequence', () => {
      let state = createInitialDropdownFSMState(false);

      // Start opening
      state = dropdownFSMReducer(state, { type: 'OPEN' });
      expect(state.visibility).toBe('opening');

      // User clicks again while opening, start closing
      state = dropdownFSMReducer(state, { type: 'TOGGLE' });
      expect(state.visibility).toBe('closing');

      // User clicks again while closing, start opening again
      state = dropdownFSMReducer(state, { type: 'TOGGLE' });
      expect(state.visibility).toBe('opening');

      // Animation finally completes
      state = dropdownFSMReducer(state, { type: 'ANIMATION_END' });
      expect(state.visibility).toBe('open');
    });

    it('handles close during opening', () => {
      let state = createInitialDropdownFSMState(false);

      state = dropdownFSMReducer(state, { type: 'OPEN' });
      expect(state.visibility).toBe('opening');

      state = dropdownFSMReducer(state, { type: 'CLOSE' });
      expect(state.visibility).toBe('closing');

      state = dropdownFSMReducer(state, { type: 'ANIMATION_END' });
      expect(state.visibility).toBe('closed');
    });

    it('handles open during closing', () => {
      let state = createInitialDropdownFSMState(true);
      expect(state.visibility).toBe('open');

      state = dropdownFSMReducer(state, { type: 'CLOSE' });
      expect(state.visibility).toBe('closing');

      state = dropdownFSMReducer(state, { type: 'OPEN' });
      expect(state.visibility).toBe('opening');

      state = dropdownFSMReducer(state, { type: 'ANIMATION_END' });
      expect(state.visibility).toBe('open');
    });

    it('handles toggle from open state', () => {
      let state = createInitialDropdownFSMState(true);
      expect(state.visibility).toBe('open');

      state = dropdownFSMReducer(state, { type: 'TOGGLE' });
      expect(state.visibility).toBe('closing');

      state = dropdownFSMReducer(state, { type: 'ANIMATION_END' });
      expect(state.visibility).toBe('closed');
    });
  });

  describe('edge cases', () => {
    it('ignores unknown events', () => {
      const state = createInitialDropdownFSMState(false);
      // @ts-expect-error Testing unknown event type
      const nextState = dropdownFSMReducer(state, { type: 'UNKNOWN' });

      expect(nextState).toBe(state);
    });

    it('maintains immutability on no-op transitions', () => {
      const closedState = createInitialDropdownFSMState(false);
      const result = dropdownFSMReducer(closedState, { type: 'CLOSE' });

      // Should return the exact same object reference (idempotent)
      expect(result).toBe(closedState);
    });
  });
});
