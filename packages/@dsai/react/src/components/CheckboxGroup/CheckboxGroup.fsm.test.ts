/**
 * @jest-environment jsdom
 */

import type { CheckboxGroupFSMState } from './CheckboxGroup.fsm';
import {
  checkboxGroupFSMReducer,
  createInitialCheckboxGroupFSMState,
  deriveSelectionState,
  isAllSelected,
  isNoneSelected,
  isSomeSelected,
  isValueSelected,
  resetFromPropsEvent,
  toggleAllEvent,
  toggleItemEvent,
} from './CheckboxGroup.fsm';

describe('CheckboxGroup FSM', () => {
  // =============================================================================
  // deriveSelectionState
  // =============================================================================

  describe('deriveSelectionState', () => {
    it('returns "none" when no items are selected', () => {
      expect(deriveSelectionState([], 3)).toBe('none');
    });

    it('returns "none" when selectedValues is empty and totalEnabled is 0', () => {
      expect(deriveSelectionState([], 0)).toBe('none');
    });

    it('returns "all" when all enabled items are selected', () => {
      expect(deriveSelectionState(['a', 'b', 'c'], 3)).toBe('all');
    });

    it('returns "all" when more items are selected than enabled (edge case)', () => {
      // This can happen if some items become disabled after selection
      expect(deriveSelectionState(['a', 'b', 'c', 'd'], 3)).toBe('all');
    });

    it('returns "some" when some but not all items are selected', () => {
      expect(deriveSelectionState(['a'], 3)).toBe('some');
      expect(deriveSelectionState(['a', 'b'], 3)).toBe('some');
    });

    it('returns "some" with 1 of 2 selected', () => {
      expect(deriveSelectionState(['a'], 2)).toBe('some');
    });
  });

  // =============================================================================
  // createInitialCheckboxGroupFSMState
  // =============================================================================

  describe('createInitialCheckboxGroupFSMState', () => {
    it('creates initial state with empty selection', () => {
      const state = createInitialCheckboxGroupFSMState([], 3);
      expect(state.selectedValues).toEqual([]);
      expect(state.selectionState).toBe('none');
    });

    it('creates initial state with some selections', () => {
      const state = createInitialCheckboxGroupFSMState(['a', 'b'], 5);
      expect(state.selectedValues).toEqual(['a', 'b']);
      expect(state.selectionState).toBe('some');
    });

    it('creates initial state with all selections', () => {
      const state = createInitialCheckboxGroupFSMState(['a', 'b', 'c'], 3);
      expect(state.selectedValues).toEqual(['a', 'b', 'c']);
      expect(state.selectionState).toBe('all');
    });

    it('deduplicates initial values', () => {
      const state = createInitialCheckboxGroupFSMState(['a', 'a', 'b', 'b'], 3);
      expect(state.selectedValues).toEqual(['a', 'b']);
      expect(state.selectionState).toBe('some');
    });
  });

  // =============================================================================
  // RESET_FROM_PROPS Event
  // =============================================================================

  describe('RESET_FROM_PROPS event', () => {
    it('resets state to match new controlled values', () => {
      const initialState: CheckboxGroupFSMState = {
        selectedValues: ['a'],
        selectionState: 'some',
      };

      const nextState = checkboxGroupFSMReducer(initialState, resetFromPropsEvent(['b', 'c'], 3));

      expect(nextState.selectedValues).toEqual(['b', 'c']);
      expect(nextState.selectionState).toBe('some');
    });

    it('transitions from some to none', () => {
      const initialState: CheckboxGroupFSMState = {
        selectedValues: ['a', 'b'],
        selectionState: 'some',
      };

      const nextState = checkboxGroupFSMReducer(initialState, resetFromPropsEvent([], 3));

      expect(nextState.selectedValues).toEqual([]);
      expect(nextState.selectionState).toBe('none');
    });

    it('transitions from none to all', () => {
      const initialState: CheckboxGroupFSMState = {
        selectedValues: [],
        selectionState: 'none',
      };

      const nextState = checkboxGroupFSMReducer(
        initialState,
        resetFromPropsEvent(['a', 'b', 'c'], 3)
      );

      expect(nextState.selectedValues).toEqual(['a', 'b', 'c']);
      expect(nextState.selectionState).toBe('all');
    });

    it('deduplicates incoming values', () => {
      const initialState: CheckboxGroupFSMState = {
        selectedValues: [],
        selectionState: 'none',
      };

      const nextState = checkboxGroupFSMReducer(
        initialState,
        resetFromPropsEvent(['a', 'a', 'b'], 3)
      );

      expect(nextState.selectedValues).toEqual(['a', 'b']);
    });

    it('handles empty totalEnabled', () => {
      const initialState: CheckboxGroupFSMState = {
        selectedValues: ['a'],
        selectionState: 'some',
      };

      const nextState = checkboxGroupFSMReducer(initialState, resetFromPropsEvent([], 0));

      expect(nextState.selectedValues).toEqual([]);
      expect(nextState.selectionState).toBe('none');
    });
  });

  // =============================================================================
  // TOGGLE_ITEM Event
  // =============================================================================

  describe('TOGGLE_ITEM event', () => {
    it('adds item to selection (none → some)', () => {
      const initialState: CheckboxGroupFSMState = {
        selectedValues: [],
        selectionState: 'none',
      };

      const nextState = checkboxGroupFSMReducer(initialState, toggleItemEvent('a', 3));

      expect(nextState.selectedValues).toContain('a');
      expect(nextState.selectionState).toBe('some');
    });

    it('removes item from selection (some → none)', () => {
      const initialState: CheckboxGroupFSMState = {
        selectedValues: ['a'],
        selectionState: 'some',
      };

      const nextState = checkboxGroupFSMReducer(initialState, toggleItemEvent('a', 3));

      expect(nextState.selectedValues).not.toContain('a');
      expect(nextState.selectionState).toBe('none');
    });

    it('adds last item to complete selection (some → all)', () => {
      const initialState: CheckboxGroupFSMState = {
        selectedValues: ['a', 'b'],
        selectionState: 'some',
      };

      const nextState = checkboxGroupFSMReducer(initialState, toggleItemEvent('c', 3));

      expect(nextState.selectedValues).toContain('c');
      expect(nextState.selectionState).toBe('all');
    });

    it('removes item from full selection (all → some)', () => {
      const initialState: CheckboxGroupFSMState = {
        selectedValues: ['a', 'b', 'c'],
        selectionState: 'all',
      };

      const nextState = checkboxGroupFSMReducer(initialState, toggleItemEvent('b', 3));

      expect(nextState.selectedValues).not.toContain('b');
      expect(nextState.selectedValues).toEqual(['a', 'c']);
      expect(nextState.selectionState).toBe('some');
    });

    it('preserves order when adding items', () => {
      const initialState: CheckboxGroupFSMState = {
        selectedValues: ['a', 'c'],
        selectionState: 'some',
      };

      const nextState = checkboxGroupFSMReducer(initialState, toggleItemEvent('b', 4));

      expect(nextState.selectedValues).toEqual(['a', 'c', 'b']);
    });

    it('handles single item group', () => {
      const initialState: CheckboxGroupFSMState = {
        selectedValues: [],
        selectionState: 'none',
      };

      const nextState = checkboxGroupFSMReducer(initialState, toggleItemEvent('only', 1));

      expect(nextState.selectedValues).toEqual(['only']);
      expect(nextState.selectionState).toBe('all');
    });
  });

  // =============================================================================
  // TOGGLE_ALL Event
  // =============================================================================

  describe('TOGGLE_ALL event', () => {
    const enabledValues = ['a', 'b', 'c'];
    const totalEnabled = 3;

    it('selects all when none are selected (none → all)', () => {
      const initialState: CheckboxGroupFSMState = {
        selectedValues: [],
        selectionState: 'none',
      };

      const nextState = checkboxGroupFSMReducer(
        initialState,
        toggleAllEvent(enabledValues, totalEnabled)
      );

      expect(nextState.selectedValues).toEqual(['a', 'b', 'c']);
      expect(nextState.selectionState).toBe('all');
    });

    it('selects all when some are selected (some → all)', () => {
      const initialState: CheckboxGroupFSMState = {
        selectedValues: ['a'],
        selectionState: 'some',
      };

      const nextState = checkboxGroupFSMReducer(
        initialState,
        toggleAllEvent(enabledValues, totalEnabled)
      );

      expect(nextState.selectedValues).toEqual(['a', 'b', 'c']);
      expect(nextState.selectionState).toBe('all');
    });

    it('clears all when all are selected (all → none)', () => {
      const initialState: CheckboxGroupFSMState = {
        selectedValues: ['a', 'b', 'c'],
        selectionState: 'all',
      };

      const nextState = checkboxGroupFSMReducer(
        initialState,
        toggleAllEvent(enabledValues, totalEnabled)
      );

      expect(nextState.selectedValues).toEqual([]);
      expect(nextState.selectionState).toBe('none');
    });

    it('handles empty group', () => {
      const initialState: CheckboxGroupFSMState = {
        selectedValues: [],
        selectionState: 'none',
      };

      const nextState = checkboxGroupFSMReducer(initialState, toggleAllEvent([], 0));

      expect(nextState.selectedValues).toEqual([]);
      expect(nextState.selectionState).toBe('none');
    });

    it('only selects enabled values (respects disabled items)', () => {
      const initialState: CheckboxGroupFSMState = {
        selectedValues: [],
        selectionState: 'none',
      };

      // Only 'a' and 'b' are enabled, 'c' is disabled
      const nextState = checkboxGroupFSMReducer(initialState, toggleAllEvent(['a', 'b'], 2));

      expect(nextState.selectedValues).toEqual(['a', 'b']);
      expect(nextState.selectionState).toBe('all');
    });
  });

  // =============================================================================
  // Event Creators
  // =============================================================================

  describe('Event Creators', () => {
    it('resetFromPropsEvent creates correct event', () => {
      const event = resetFromPropsEvent(['a', 'b'], 3);
      expect(event).toEqual({
        type: 'RESET_FROM_PROPS',
        values: ['a', 'b'],
        totalEnabled: 3,
      });
    });

    it('toggleItemEvent creates correct event', () => {
      const event = toggleItemEvent('test', 5);
      expect(event).toEqual({
        type: 'TOGGLE_ITEM',
        value: 'test',
        totalEnabled: 5,
      });
    });

    it('toggleAllEvent creates correct event', () => {
      const event = toggleAllEvent(['a', 'b'], 2);
      expect(event).toEqual({
        type: 'TOGGLE_ALL',
        enabledValues: ['a', 'b'],
        totalEnabled: 2,
      });
    });
  });

  // =============================================================================
  // Predicates
  // =============================================================================

  describe('Predicates', () => {
    describe('isNoneSelected', () => {
      it('returns true when selectionState is none', () => {
        const state: CheckboxGroupFSMState = {
          selectedValues: [],
          selectionState: 'none',
        };
        expect(isNoneSelected(state)).toBe(true);
      });

      it('returns false when selectionState is some', () => {
        const state: CheckboxGroupFSMState = {
          selectedValues: ['a'],
          selectionState: 'some',
        };
        expect(isNoneSelected(state)).toBe(false);
      });

      it('returns false when selectionState is all', () => {
        const state: CheckboxGroupFSMState = {
          selectedValues: ['a', 'b'],
          selectionState: 'all',
        };
        expect(isNoneSelected(state)).toBe(false);
      });
    });

    describe('isSomeSelected', () => {
      it('returns true when selectionState is some', () => {
        const state: CheckboxGroupFSMState = {
          selectedValues: ['a'],
          selectionState: 'some',
        };
        expect(isSomeSelected(state)).toBe(true);
      });

      it('returns false when selectionState is none', () => {
        const state: CheckboxGroupFSMState = {
          selectedValues: [],
          selectionState: 'none',
        };
        expect(isSomeSelected(state)).toBe(false);
      });

      it('returns false when selectionState is all', () => {
        const state: CheckboxGroupFSMState = {
          selectedValues: ['a', 'b'],
          selectionState: 'all',
        };
        expect(isSomeSelected(state)).toBe(false);
      });
    });

    describe('isAllSelected', () => {
      it('returns true when selectionState is all', () => {
        const state: CheckboxGroupFSMState = {
          selectedValues: ['a', 'b'],
          selectionState: 'all',
        };
        expect(isAllSelected(state)).toBe(true);
      });

      it('returns false when selectionState is none', () => {
        const state: CheckboxGroupFSMState = {
          selectedValues: [],
          selectionState: 'none',
        };
        expect(isAllSelected(state)).toBe(false);
      });

      it('returns false when selectionState is some', () => {
        const state: CheckboxGroupFSMState = {
          selectedValues: ['a'],
          selectionState: 'some',
        };
        expect(isAllSelected(state)).toBe(false);
      });
    });

    describe('isValueSelected', () => {
      const state: CheckboxGroupFSMState = {
        selectedValues: ['a', 'b'],
        selectionState: 'some',
      };

      it('returns true for selected values', () => {
        expect(isValueSelected(state, 'a')).toBe(true);
        expect(isValueSelected(state, 'b')).toBe(true);
      });

      it('returns false for unselected values', () => {
        expect(isValueSelected(state, 'c')).toBe(false);
        expect(isValueSelected(state, 'nonexistent')).toBe(false);
      });
    });
  });

  // =============================================================================
  // Complex Scenarios
  // =============================================================================

  describe('Complex Scenarios', () => {
    it('full workflow: none → some → all → none', () => {
      let state = createInitialCheckboxGroupFSMState([], 3);
      expect(state.selectionState).toBe('none');

      // Toggle first item: none → some
      state = checkboxGroupFSMReducer(state, toggleItemEvent('a', 3));
      expect(state.selectionState).toBe('some');
      expect(state.selectedValues).toEqual(['a']);

      // Toggle second item: some → some
      state = checkboxGroupFSMReducer(state, toggleItemEvent('b', 3));
      expect(state.selectionState).toBe('some');
      expect(state.selectedValues).toEqual(['a', 'b']);

      // Toggle third item: some → all
      state = checkboxGroupFSMReducer(state, toggleItemEvent('c', 3));
      expect(state.selectionState).toBe('all');
      expect(state.selectedValues).toEqual(['a', 'b', 'c']);

      // Toggle all: all → none
      state = checkboxGroupFSMReducer(state, toggleAllEvent(['a', 'b', 'c'], 3));
      expect(state.selectionState).toBe('none');
      expect(state.selectedValues).toEqual([]);
    });

    it('controlled mode sync with RESET_FROM_PROPS', () => {
      let state = createInitialCheckboxGroupFSMState(['a'], 3);
      expect(state.selectionState).toBe('some');

      // External change: parent sets new value
      state = checkboxGroupFSMReducer(state, resetFromPropsEvent(['a', 'b', 'c'], 3));
      expect(state.selectionState).toBe('all');

      // External change: parent clears selection
      state = checkboxGroupFSMReducer(state, resetFromPropsEvent([], 3));
      expect(state.selectionState).toBe('none');
    });

    it('handles disabled items correctly in toggle all', () => {
      // 4 total items, but only 3 are enabled
      const enabledValues = ['a', 'b', 'c'];
      const totalEnabled = 3;

      let state = createInitialCheckboxGroupFSMState([], totalEnabled);

      // Toggle all should only select enabled items
      state = checkboxGroupFSMReducer(state, toggleAllEvent(enabledValues, totalEnabled));
      expect(state.selectedValues).toEqual(['a', 'b', 'c']);
      expect(state.selectionState).toBe('all');

      // If we had a disabled item 'd' selected before, it wouldn't be in enabledValues
      // So toggle all → none would still clear only enabled items
    });

    it('maintains state immutability', () => {
      const initialState: CheckboxGroupFSMState = {
        selectedValues: ['a'],
        selectionState: 'some',
      };

      const nextState = checkboxGroupFSMReducer(initialState, toggleItemEvent('b', 3));

      // Original state should be unchanged
      expect(initialState.selectedValues).toEqual(['a']);
      expect(initialState.selectionState).toBe('some');

      // New state should be different object
      expect(nextState).not.toBe(initialState);
      expect(nextState.selectedValues).not.toBe(initialState.selectedValues);
    });
  });
});
