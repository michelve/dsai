import { createInitialSheetFSMState, getSheetVisualState, sheetFSMReducer } from './Sheet.fsm';

import type { SheetFSMState } from './Sheet.fsm';

describe('Sheet FSM', () => {
  describe('createInitialSheetFSMState', () => {
    it('creates closed state when isOpen is false', () => {
      const state = createInitialSheetFSMState(false);

      expect(state).toEqual({
        visibility: 'closed',
        shouldRender: false,
        shouldShow: false,
        focusTrapActive: false,
        scrollLockActive: false,
      });
    });

    it('creates open state when isOpen is true', () => {
      const state = createInitialSheetFSMState(true);

      expect(state).toEqual({
        visibility: 'open',
        shouldRender: true,
        shouldShow: true,
        focusTrapActive: true,
        scrollLockActive: true,
      });
    });
  });

  describe('sheetFSMReducer', () => {
    describe('from closed state', () => {
      const closedState: SheetFSMState = {
        visibility: 'closed',
        shouldRender: false,
        shouldShow: false,
        focusTrapActive: false,
        scrollLockActive: false,
      };

      it('transitions to opening on OPEN event', () => {
        const nextState = sheetFSMReducer(closedState, { type: 'OPEN' });

        expect(nextState).toEqual({
          visibility: 'opening',
          shouldRender: true,
          shouldShow: false,
          focusTrapActive: false,
          scrollLockActive: true,
        });
      });

      it('stays closed on CLOSE event (idempotent)', () => {
        const nextState = sheetFSMReducer(closedState, { type: 'CLOSE' });

        expect(nextState).toBe(closedState);
      });

      it('stays closed on ANIMATION_END event', () => {
        const nextState = sheetFSMReducer(closedState, {
          type: 'ANIMATION_END',
        });

        expect(nextState).toBe(closedState);
      });
    });

    describe('from opening state', () => {
      const openingState: SheetFSMState = {
        visibility: 'opening',
        shouldRender: true,
        shouldShow: false,
        focusTrapActive: false,
        scrollLockActive: true,
      };

      it('stays opening on OPEN event (idempotent)', () => {
        const nextState = sheetFSMReducer(openingState, { type: 'OPEN' });

        expect(nextState).toBe(openingState);
      });

      it('transitions to closing on CLOSE event', () => {
        const nextState = sheetFSMReducer(openingState, { type: 'CLOSE' });

        expect(nextState).toEqual({
          visibility: 'closing',
          shouldRender: true,
          shouldShow: false,
          focusTrapActive: false,
          scrollLockActive: true,
        });
      });

      it('transitions to open on ANIMATION_END event', () => {
        const nextState = sheetFSMReducer(openingState, {
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
      const openState: SheetFSMState = {
        visibility: 'open',
        shouldRender: true,
        shouldShow: true,
        focusTrapActive: true,
        scrollLockActive: true,
      };

      it('stays open on OPEN event (idempotent)', () => {
        const nextState = sheetFSMReducer(openState, { type: 'OPEN' });

        expect(nextState).toBe(openState);
      });

      it('transitions to closing on CLOSE event', () => {
        const nextState = sheetFSMReducer(openState, { type: 'CLOSE' });

        expect(nextState).toEqual({
          visibility: 'closing',
          shouldRender: true,
          shouldShow: false,
          focusTrapActive: false,
          scrollLockActive: true,
        });
      });

      it('stays open on ANIMATION_END event', () => {
        const nextState = sheetFSMReducer(openState, { type: 'ANIMATION_END' });

        expect(nextState).toBe(openState);
      });
    });

    describe('from closing state', () => {
      const closingState: SheetFSMState = {
        visibility: 'closing',
        shouldRender: true,
        shouldShow: false,
        focusTrapActive: false,
        scrollLockActive: true,
      };

      it('transitions to opening on OPEN event (interrupt close)', () => {
        const nextState = sheetFSMReducer(closingState, { type: 'OPEN' });

        expect(nextState).toEqual({
          visibility: 'opening',
          shouldRender: true,
          shouldShow: false,
          focusTrapActive: false,
          scrollLockActive: true,
        });
      });

      it('stays closing on CLOSE event (idempotent)', () => {
        const nextState = sheetFSMReducer(closingState, { type: 'CLOSE' });

        expect(nextState).toBe(closingState);
      });

      it('transitions to closed on ANIMATION_END event', () => {
        const nextState = sheetFSMReducer(closingState, {
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

  describe('getSheetVisualState', () => {
    it('returns "closed" for closed state', () => {
      const state: SheetFSMState = {
        visibility: 'closed',
        shouldRender: false,
        shouldShow: false,
        focusTrapActive: false,
        scrollLockActive: false,
      };

      expect(getSheetVisualState(state)).toBe('closed');
    });

    it('returns "opening" for opening state', () => {
      const state: SheetFSMState = {
        visibility: 'opening',
        shouldRender: true,
        shouldShow: false,
        focusTrapActive: false,
        scrollLockActive: true,
      };

      expect(getSheetVisualState(state)).toBe('opening');
    });

    it('returns "open" for open state', () => {
      const state: SheetFSMState = {
        visibility: 'open',
        shouldRender: true,
        shouldShow: true,
        focusTrapActive: true,
        scrollLockActive: true,
      };

      expect(getSheetVisualState(state)).toBe('open');
    });

    it('returns "closing" for closing state', () => {
      const state: SheetFSMState = {
        visibility: 'closing',
        shouldRender: true,
        shouldShow: false,
        focusTrapActive: false,
        scrollLockActive: true,
      };

      expect(getSheetVisualState(state)).toBe('closing');
    });
  });

  describe('State Consistency', () => {
    it('shouldRender is true when visibility is not closed', () => {
      const states: SheetFSMState[] = [
        sheetFSMReducer(
          {
            visibility: 'closed',
            shouldRender: false,
            shouldShow: false,
            focusTrapActive: false,
            scrollLockActive: false,
          },
          { type: 'OPEN' }
        ),
        {
          visibility: 'open',
          shouldRender: true,
          shouldShow: true,
          focusTrapActive: true,
          scrollLockActive: true,
        },
        sheetFSMReducer(
          {
            visibility: 'open',
            shouldRender: true,
            shouldShow: true,
            focusTrapActive: true,
            scrollLockActive: true,
          },
          { type: 'CLOSE' }
        ),
      ];

      for (const state of states) {
        if (state.visibility !== 'closed') {
          expect(state.shouldRender).toBe(true);
        }
      }
    });

    it('focusTrapActive is only true when visibility is open', () => {
      const closedState: SheetFSMState = {
        visibility: 'closed',
        shouldRender: false,
        shouldShow: false,
        focusTrapActive: false,
        scrollLockActive: false,
      };

      // closed -> opening
      const openingState = sheetFSMReducer(closedState, { type: 'OPEN' });
      expect(openingState.focusTrapActive).toBe(false);

      // opening -> open
      const openState = sheetFSMReducer(openingState, { type: 'ANIMATION_END' });
      expect(openState.focusTrapActive).toBe(true);

      // open -> closing
      const closingState = sheetFSMReducer(openState, { type: 'CLOSE' });
      expect(closingState.focusTrapActive).toBe(false);
    });

    it('scrollLockActive is true during opening, open, and closing, false when closed', () => {
      const closedState: SheetFSMState = {
        visibility: 'closed',
        shouldRender: false,
        shouldShow: false,
        focusTrapActive: false,
        scrollLockActive: false,
      };

      expect(closedState.scrollLockActive).toBe(false);

      const openingState = sheetFSMReducer(closedState, { type: 'OPEN' });
      expect(openingState.scrollLockActive).toBe(true);

      const openState = sheetFSMReducer(openingState, { type: 'ANIMATION_END' });
      expect(openState.scrollLockActive).toBe(true);

      const closingState = sheetFSMReducer(openState, { type: 'CLOSE' });
      expect(closingState.scrollLockActive).toBe(true);

      const finalClosedState = sheetFSMReducer(closingState, { type: 'ANIMATION_END' });
      expect(finalClosedState.scrollLockActive).toBe(false);
    });
  });

  describe('Complete Lifecycle', () => {
    it('handles full open/close cycle', () => {
      let state = createInitialSheetFSMState(false);
      expect(state.visibility).toBe('closed');

      // Open
      state = sheetFSMReducer(state, { type: 'OPEN' });
      expect(state.visibility).toBe('opening');
      expect(state.shouldRender).toBe(true);

      // Animation completes
      state = sheetFSMReducer(state, { type: 'ANIMATION_END' });
      expect(state.visibility).toBe('open');
      expect(state.focusTrapActive).toBe(true);
      expect(state.scrollLockActive).toBe(true);

      // Close
      state = sheetFSMReducer(state, { type: 'CLOSE' });
      expect(state.visibility).toBe('closing');
      expect(state.focusTrapActive).toBe(false);
      expect(state.scrollLockActive).toBe(true);

      // Animation completes
      state = sheetFSMReducer(state, { type: 'ANIMATION_END' });
      expect(state.visibility).toBe('closed');
      expect(state.shouldRender).toBe(false);
      expect(state.scrollLockActive).toBe(false);
    });

    it('handles interrupted close (reopen while closing)', () => {
      let state = createInitialSheetFSMState(true);
      expect(state.visibility).toBe('open');

      // Start closing
      state = sheetFSMReducer(state, { type: 'CLOSE' });
      expect(state.visibility).toBe('closing');

      // Interrupt with open before animation ends
      state = sheetFSMReducer(state, { type: 'OPEN' });
      expect(state.visibility).toBe('opening');
      expect(state.shouldRender).toBe(true);

      // Animation completes
      state = sheetFSMReducer(state, { type: 'ANIMATION_END' });
      expect(state.visibility).toBe('open');
    });

    it('handles rapid open/close/open', () => {
      let state = createInitialSheetFSMState(false);

      // Quick open
      state = sheetFSMReducer(state, { type: 'OPEN' });
      expect(state.visibility).toBe('opening');

      // Quick close before animation ends
      state = sheetFSMReducer(state, { type: 'CLOSE' });
      expect(state.visibility).toBe('closing');

      // Quick reopen
      state = sheetFSMReducer(state, { type: 'OPEN' });
      expect(state.visibility).toBe('opening');
    });
  });
});
