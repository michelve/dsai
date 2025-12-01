import type { ButtonFSMState } from './Button.fsm';
import { buttonFSMReducer, createInitialButtonFSMState } from './Button.fsm';

describe('Button FSM', () => {
  describe('createInitialButtonFSMState', () => {
    it('creates idle state by default', () => {
      const state = createInitialButtonFSMState();
      expect(state.visualState).toBe('idle');
      expect(state.isDisabled).toBe(false);
      expect(state.isLoading).toBe(false);
      expect(state.isError).toBe(false);
      expect(state.isPressed).toBe(false);
      expect(state.isHovered).toBe(false);
      expect(state.isFocused).toBe(false);
    });

    it('creates disabled state when disabled=true', () => {
      const state = createInitialButtonFSMState(true);
      expect(state.visualState).toBe('disabled');
      expect(state.isDisabled).toBe(true);
    });

    it('creates loading state when loading=true', () => {
      const state = createInitialButtonFSMState(false, true);
      expect(state.visualState).toBe('loading');
      expect(state.isLoading).toBe(true);
    });

    it('creates error state when error=true', () => {
      const state = createInitialButtonFSMState(false, false, true);
      expect(state.visualState).toBe('error');
      expect(state.isError).toBe(true);
    });

    it('prioritizes disabled over loading and error', () => {
      const state = createInitialButtonFSMState(true, true, true);
      expect(state.visualState).toBe('disabled');
      expect(state.isDisabled).toBe(true);
    });

    it('prioritizes loading over error when disabled=false', () => {
      const state = createInitialButtonFSMState(false, true, true);
      expect(state.visualState).toBe('loading');
      expect(state.isLoading).toBe(true);
    });
  });

  describe('buttonFSMReducer - Interactive States', () => {
    let initialState: ButtonFSMState;

    beforeEach(() => {
      initialState = createInitialButtonFSMState();
    });

    describe('HOVER event', () => {
      it('transitions idle to hovered', () => {
        const state = buttonFSMReducer(initialState, { type: 'HOVER' });
        expect(state.visualState).toBe('hovered');
        expect(state.isHovered).toBe(true);
      });

      it('does not transition when disabled', () => {
        const disabled = createInitialButtonFSMState(true);
        const state = buttonFSMReducer(disabled, { type: 'HOVER' });
        expect(state.visualState).toBe('disabled');
        expect(state.isHovered).toBe(false);
      });

      it('does not transition when loading', () => {
        const loading = createInitialButtonFSMState(false, true);
        const state = buttonFSMReducer(loading, { type: 'HOVER' });
        expect(state.visualState).toBe('loading');
        expect(state.isHovered).toBe(false);
      });

      it('does not transition when error', () => {
        const error = createInitialButtonFSMState(false, false, true);
        const state = buttonFSMReducer(error, { type: 'HOVER' });
        expect(state.visualState).toBe('error');
        expect(state.isHovered).toBe(false);
      });
    });

    describe('FOCUS event', () => {
      it('transitions idle to focused', () => {
        const state = buttonFSMReducer(initialState, { type: 'FOCUS' });
        expect(state.visualState).toBe('focused');
        expect(state.isFocused).toBe(true);
      });

      it('transitions hovered to focused', () => {
        let state = buttonFSMReducer(initialState, { type: 'HOVER' });
        state = buttonFSMReducer(state, { type: 'FOCUS' });
        expect(state.visualState).toBe('focused');
        expect(state.isHovered).toBe(true);
        expect(state.isFocused).toBe(true);
      });
    });

    describe('PRESS event', () => {
      it('transitions idle to pressed', () => {
        const state = buttonFSMReducer(initialState, { type: 'PRESS' });
        expect(state.visualState).toBe('pressed');
        expect(state.isPressed).toBe(true);
      });

      it('overrides hovered state', () => {
        let state = buttonFSMReducer(initialState, { type: 'HOVER' });
        state = buttonFSMReducer(state, { type: 'PRESS' });
        expect(state.visualState).toBe('pressed');
        expect(state.isPressed).toBe(true);
      });

      it('overrides focused state', () => {
        let state = buttonFSMReducer(initialState, { type: 'FOCUS' });
        state = buttonFSMReducer(state, { type: 'PRESS' });
        expect(state.visualState).toBe('pressed');
        expect(state.isPressed).toBe(true);
      });
    });

    describe('RELEASE event', () => {
      it('transitions pressed to hovered (PRESS implies hover)', () => {
        let state = buttonFSMReducer(initialState, { type: 'PRESS' });
        state = buttonFSMReducer(state, { type: 'RELEASE' });
        expect(state.visualState).toBe('hovered'); // PRESS sets isHovered=true
        expect(state.isPressed).toBe(false);
        expect(state.isHovered).toBe(true);
      });

      it('transitions pressed to hovered if hovering', () => {
        let state = buttonFSMReducer(initialState, { type: 'HOVER' });
        state = buttonFSMReducer(state, { type: 'PRESS' });
        state = buttonFSMReducer(state, { type: 'RELEASE' });
        expect(state.visualState).toBe('hovered');
        expect(state.isPressed).toBe(false);
        expect(state.isHovered).toBe(true);
      });

      it('transitions pressed to focused if focused', () => {
        let state = buttonFSMReducer(initialState, { type: 'FOCUS' });
        state = buttonFSMReducer(state, { type: 'PRESS' });
        state = buttonFSMReducer(state, { type: 'RELEASE' });
        expect(state.visualState).toBe('focused');
        expect(state.isPressed).toBe(false);
        expect(state.isFocused).toBe(true);
      });
    });

    describe('BLUR event', () => {
      it('transitions hovered to idle', () => {
        let state = buttonFSMReducer(initialState, { type: 'HOVER' });
        state = buttonFSMReducer(state, { type: 'BLUR' });
        expect(state.visualState).toBe('idle');
        expect(state.isHovered).toBe(false);
      });

      it('clears all interactive flags including focus', () => {
        let state = buttonFSMReducer(initialState, { type: 'FOCUS' });
        state = buttonFSMReducer(state, { type: 'HOVER' });
        state = buttonFSMReducer(state, { type: 'PRESS' });
        state = buttonFSMReducer(state, { type: 'BLUR' });
        expect(state.visualState).toBe('idle'); // BLUR returns to idle
        expect(state.isHovered).toBe(false);
        expect(state.isPressed).toBe(false);
        expect(state.isFocused).toBe(false); // BLUR clears focus too
      });
    });
  });

  describe('buttonFSMReducer - Override States', () => {
    let initialState: ButtonFSMState;

    beforeEach(() => {
      initialState = createInitialButtonFSMState();
    });

    describe('DISABLE event', () => {
      it('transitions idle to disabled', () => {
        const state = buttonFSMReducer(initialState, { type: 'DISABLE' });
        expect(state.visualState).toBe('disabled');
        expect(state.isDisabled).toBe(true);
      });

      it('clears all interactive flags', () => {
        let state = buttonFSMReducer(initialState, { type: 'HOVER' });
        state = buttonFSMReducer(state, { type: 'FOCUS' });
        state = buttonFSMReducer(state, { type: 'PRESS' });
        state = buttonFSMReducer(state, { type: 'DISABLE' });
        expect(state.visualState).toBe('disabled');
        expect(state.isPressed).toBe(false);
        expect(state.isHovered).toBe(false);
        expect(state.isFocused).toBe(false);
      });

      it('preserves loading and error flags', () => {
        let state = createInitialButtonFSMState(false, true, true);
        state = buttonFSMReducer(state, { type: 'DISABLE' });
        expect(state.visualState).toBe('disabled');
        expect(state.isLoading).toBe(true);
        expect(state.isError).toBe(true);
      });
    });

    describe('ENABLE event', () => {
      it('transitions disabled to idle', () => {
        let state = createInitialButtonFSMState(true);
        state = buttonFSMReducer(state, { type: 'ENABLE' });
        expect(state.visualState).toBe('idle');
        expect(state.isDisabled).toBe(false);
      });

      it('transitions to loading if loading flag is set', () => {
        let state = createInitialButtonFSMState(true, true);
        state = buttonFSMReducer(state, { type: 'ENABLE' });
        expect(state.visualState).toBe('loading');
        expect(state.isDisabled).toBe(false);
      });

      it('transitions to error if error flag is set', () => {
        let state = createInitialButtonFSMState(true, false, true);
        state = buttonFSMReducer(state, { type: 'ENABLE' });
        expect(state.visualState).toBe('error');
        expect(state.isDisabled).toBe(false);
      });
    });

    describe('LOADING event', () => {
      it('transitions idle to loading with payload=true', () => {
        const state = buttonFSMReducer(initialState, { type: 'LOADING', payload: true });
        expect(state.visualState).toBe('loading');
        expect(state.isLoading).toBe(true);
      });

      it('preserves interactive flags when entering loading for state restoration', () => {
        let state = buttonFSMReducer(initialState, { type: 'HOVER' });
        state = buttonFSMReducer(state, { type: 'FOCUS' });
        state = buttonFSMReducer(state, { type: 'LOADING', payload: true });
        expect(state.visualState).toBe('loading');
        // Interactive flags preserved for restoration when loading ends
        expect(state.isHovered).toBe(true);
        expect(state.isFocused).toBe(true);
      });

      it('transitions to idle with payload=false', () => {
        let state = createInitialButtonFSMState(false, true);
        state = buttonFSMReducer(state, { type: 'LOADING', payload: false });
        expect(state.visualState).toBe('idle');
        expect(state.isLoading).toBe(false);
      });
    });

    describe('ERROR event', () => {
      it('transitions idle to error with payload=true', () => {
        const state = buttonFSMReducer(initialState, { type: 'ERROR', payload: true });
        expect(state.visualState).toBe('error');
        expect(state.isError).toBe(true);
      });

      it('preserves interactive flags when entering error for state restoration', () => {
        let state = buttonFSMReducer(initialState, { type: 'HOVER' });
        state = buttonFSMReducer(state, { type: 'PRESS' });
        state = buttonFSMReducer(state, { type: 'ERROR', payload: true });
        expect(state.visualState).toBe('error');
        // Interactive flags preserved for restoration when error clears
        expect(state.isPressed).toBe(true);
        expect(state.isHovered).toBe(true);
      });

      it('transitions to idle with payload=false', () => {
        let state = createInitialButtonFSMState(false, false, true);
        state = buttonFSMReducer(state, { type: 'ERROR', payload: false });
        expect(state.visualState).toBe('idle');
        expect(state.isError).toBe(false);
      });
    });
  });

  describe('State Priority', () => {
    it('disabled takes precedence over all states', () => {
      let state = createInitialButtonFSMState();
      state = buttonFSMReducer(state, { type: 'HOVER' });
      state = buttonFSMReducer(state, { type: 'FOCUS' });
      state = buttonFSMReducer(state, { type: 'PRESS' });
      expect(state.visualState).toBe('pressed');

      state = buttonFSMReducer(state, { type: 'DISABLE' });
      expect(state.visualState).toBe('disabled');

      // Any interaction should be ignored
      state = buttonFSMReducer(state, { type: 'HOVER' });
      expect(state.visualState).toBe('disabled');
    });

    it('loading takes precedence over interactive and error states', () => {
      let state = createInitialButtonFSMState(false, false, true);
      expect(state.visualState).toBe('error');

      state = buttonFSMReducer(state, { type: 'LOADING', payload: true });
      expect(state.visualState).toBe('loading');

      // Error flag should be cleared when transitioning to idle
      state = buttonFSMReducer(state, { type: 'LOADING', payload: false });
      expect(state.visualState).toBe('idle');
    });
  });

  describe('Complex Interaction Sequences', () => {
    it('handles hover + focus + press + release sequence', () => {
      let state = createInitialButtonFSMState();

      state = buttonFSMReducer(state, { type: 'HOVER' });
      expect(state.visualState).toBe('hovered');

      state = buttonFSMReducer(state, { type: 'FOCUS' });
      expect(state.visualState).toBe('focused');

      state = buttonFSMReducer(state, { type: 'PRESS' });
      expect(state.visualState).toBe('pressed');

      state = buttonFSMReducer(state, { type: 'RELEASE' });
      expect(state.visualState).toBe('focused');

      state = buttonFSMReducer(state, { type: 'BLUR' });
      expect(state.visualState).toBe('idle');
    });

    it('handles rapid state changes', () => {
      let state = createInitialButtonFSMState();

      state = buttonFSMReducer(state, { type: 'HOVER' });
      state = buttonFSMReducer(state, { type: 'BLUR' });
      state = buttonFSMReducer(state, { type: 'HOVER' });
      state = buttonFSMReducer(state, { type: 'FOCUS' });
      state = buttonFSMReducer(state, { type: 'BLUR' });

      expect(state.visualState).toBe('idle');
      expect(state.isHovered).toBe(false);
      expect(state.isFocused).toBe(false);
      expect(state.isPressed).toBe(false);
    });
  });
});
