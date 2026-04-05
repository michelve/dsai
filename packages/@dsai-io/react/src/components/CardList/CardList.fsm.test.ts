/**
 * @jest-environment jsdom
 */

import {
  cardListFSMReducer,
  clearAllEvent,
  createInitialCardListFSMState,
  deriveVisualState,
  getSelectedCount,
  isAllSelected,
  isNoneSelected,
  isOneSelected,
  isSomeSelected,
  isValueSelected,
  resetFromPropsEvent,
  selectAllEvent,
  selectItemEvent,
  toggleItemEvent,
} from './CardList.fsm';

import type { CardListFSMState } from './CardList.fsm';

// Named constants for magic numbers (SonarQube S109)
const TOTAL_ENABLED_DEFAULT = 3;
const TOTAL_ENABLED_LARGE = 5;
const TOTAL_ENABLED_FOUR = 4;

describe('CardList FSM', () => {
  // =============================================================================
  // deriveVisualState
  // =============================================================================

  describe('deriveVisualState', () => {
    it('returns "none" when no items are selected', () => {
      expect(deriveVisualState([], TOTAL_ENABLED_DEFAULT)).toBe('none');
    });

    it('returns "none" when selectedValues is empty and totalEnabled is 0', () => {
      expect(deriveVisualState([], 0)).toBe('none');
    });

    it('returns "one" when exactly one item is selected', () => {
      expect(deriveVisualState(['a'], TOTAL_ENABLED_DEFAULT)).toBe('one');
    });

    it('returns "some" when more than one but not all items are selected', () => {
      expect(deriveVisualState(['a', 'b'], TOTAL_ENABLED_DEFAULT)).toBe('some');
    });

    it('returns "all" when all enabled items are selected', () => {
      expect(deriveVisualState(['a', 'b', 'c'], TOTAL_ENABLED_DEFAULT)).toBe('all');
    });

    it('returns "all" when more items are selected than enabled (edge case)', () => {
      // This can happen if some items become disabled after selection
      expect(deriveVisualState(['a', 'b', 'c', 'd'], TOTAL_ENABLED_DEFAULT)).toBe('all');
    });

    it('returns "one" when one of one is selected', () => {
      expect(deriveVisualState(['a'], 1)).toBe('one'); // 1 of 1 but we use count for visual state
    });
  });

  // =============================================================================
  // createInitialCardListFSMState
  // =============================================================================

  describe('createInitialCardListFSMState', () => {
    it('creates initial state with empty selection', () => {
      const state = createInitialCardListFSMState([], 'multiple', TOTAL_ENABLED_DEFAULT);
      expect(state.selectedValues).toEqual([]);
      expect(state.visualState).toBe('none');
    });

    it('creates initial state with single selection', () => {
      const state = createInitialCardListFSMState(['a'], 'single', TOTAL_ENABLED_DEFAULT);
      expect(state.selectedValues).toEqual(['a']);
      expect(state.visualState).toBe('one');
    });

    it('creates initial state with multiple selections', () => {
      const state = createInitialCardListFSMState(['a', 'b'], 'multiple', TOTAL_ENABLED_LARGE);
      expect(state.selectedValues).toEqual(['a', 'b']);
      expect(state.visualState).toBe('some');
    });

    it('creates initial state with all selections', () => {
      const state = createInitialCardListFSMState(['a', 'b', 'c'], 'multiple', TOTAL_ENABLED_DEFAULT);
      expect(state.selectedValues).toEqual(['a', 'b', 'c']);
      expect(state.visualState).toBe('all');
    });

    it('deduplicates initial values', () => {
      const state = createInitialCardListFSMState(['a', 'a', 'b', 'b'], 'multiple', TOTAL_ENABLED_DEFAULT);
      expect(state.selectedValues).toEqual(['a', 'b']);
      expect(state.visualState).toBe('some');
    });

    it('limits to one value in single mode', () => {
      const state = createInitialCardListFSMState(['a', 'b', 'c'], 'single', TOTAL_ENABLED_DEFAULT);
      expect(state.selectedValues).toEqual(['a']);
      expect(state.visualState).toBe('one');
    });

    it('creates state for none mode (display only)', () => {
      const state = createInitialCardListFSMState(['a'], 'none', TOTAL_ENABLED_DEFAULT);
      expect(state.selectedValues).toEqual([]);
      expect(state.visualState).toBe('none');
    });
  });

  // =============================================================================
  // RESET_FROM_PROPS Event
  // =============================================================================

  describe('RESET_FROM_PROPS event', () => {
    it('resets state to match new controlled values', () => {
      const initialState: CardListFSMState = {
        selectedValues: ['a'],
        visualState: 'one',
      };

      const nextState = cardListFSMReducer(
        initialState,
        resetFromPropsEvent(['b', 'c'], 'multiple', TOTAL_ENABLED_DEFAULT)
      );

      expect(nextState.selectedValues).toEqual(['b', 'c']);
      expect(nextState.visualState).toBe('some');
    });

    it('transitions from some to none', () => {
      const initialState: CardListFSMState = {
        selectedValues: ['a', 'b'],
        visualState: 'some',
      };

      const nextState = cardListFSMReducer(initialState, resetFromPropsEvent([], 'multiple', TOTAL_ENABLED_DEFAULT));

      expect(nextState.selectedValues).toEqual([]);
      expect(nextState.visualState).toBe('none');
    });

    it('transitions from none to all', () => {
      const initialState: CardListFSMState = {
        selectedValues: [],
        visualState: 'none',
      };

      const nextState = cardListFSMReducer(
        initialState,
        resetFromPropsEvent(['a', 'b', 'c'], 'multiple', TOTAL_ENABLED_DEFAULT)
      );

      expect(nextState.selectedValues).toEqual(['a', 'b', 'c']);
      expect(nextState.visualState).toBe('all');
    });

    it('deduplicates incoming values', () => {
      const initialState: CardListFSMState = {
        selectedValues: [],
        visualState: 'none',
      };

      const nextState = cardListFSMReducer(
        initialState,
        resetFromPropsEvent(['a', 'a', 'b'], 'multiple', TOTAL_ENABLED_DEFAULT)
      );

      expect(nextState.selectedValues).toEqual(['a', 'b']);
    });

    it('limits to one value in single mode', () => {
      const initialState: CardListFSMState = {
        selectedValues: [],
        visualState: 'none',
      };

      const nextState = cardListFSMReducer(
        initialState,
        resetFromPropsEvent(['a', 'b'], 'single', TOTAL_ENABLED_DEFAULT)
      );

      expect(nextState.selectedValues).toEqual(['a']);
    });

    it('clears values in none mode', () => {
      const initialState: CardListFSMState = {
        selectedValues: ['a'],
        visualState: 'one',
      };

      const nextState = cardListFSMReducer(
        initialState,
        resetFromPropsEvent(['a', 'b'], 'none', TOTAL_ENABLED_DEFAULT)
      );

      expect(nextState.selectedValues).toEqual([]);
      expect(nextState.visualState).toBe('none');
    });
  });

  // =============================================================================
  // SELECT_ITEM Event (for single mode)
  // =============================================================================

  describe('SELECT_ITEM event', () => {
    it('selects item (none → one)', () => {
      const initialState: CardListFSMState = {
        selectedValues: [],
        visualState: 'none',
      };

      const nextState = cardListFSMReducer(initialState, selectItemEvent('a', TOTAL_ENABLED_DEFAULT));

      expect(nextState.selectedValues).toEqual(['a']);
      expect(nextState.visualState).toBe('one');
    });

    it('replaces selection when different item is selected', () => {
      const initialState: CardListFSMState = {
        selectedValues: ['a'],
        visualState: 'one',
      };

      const nextState = cardListFSMReducer(initialState, selectItemEvent('b', TOTAL_ENABLED_DEFAULT));

      expect(nextState.selectedValues).toEqual(['b']);
      expect(nextState.visualState).toBe('one');
    });

    it('does not change state when selecting already selected item', () => {
      const initialState: CardListFSMState = {
        selectedValues: ['a'],
        visualState: 'one',
      };

      const nextState = cardListFSMReducer(initialState, selectItemEvent('a', TOTAL_ENABLED_DEFAULT));

      expect(nextState).toBe(initialState);
    });
  });

  // =============================================================================
  // TOGGLE_ITEM Event (for multiple mode)
  // =============================================================================

  describe('TOGGLE_ITEM event', () => {
    it('adds item to selection (none → one)', () => {
      const initialState: CardListFSMState = {
        selectedValues: [],
        visualState: 'none',
      };

      const nextState = cardListFSMReducer(initialState, toggleItemEvent('a', TOTAL_ENABLED_DEFAULT));

      expect(nextState.selectedValues).toContain('a');
      expect(nextState.visualState).toBe('one');
    });

    it('removes item from selection (one → none)', () => {
      const initialState: CardListFSMState = {
        selectedValues: ['a'],
        visualState: 'one',
      };

      const nextState = cardListFSMReducer(initialState, toggleItemEvent('a', TOTAL_ENABLED_DEFAULT));

      expect(nextState.selectedValues).not.toContain('a');
      expect(nextState.visualState).toBe('none');
    });

    it('adds last item to complete selection (some → all)', () => {
      const initialState: CardListFSMState = {
        selectedValues: ['a', 'b'],
        visualState: 'some',
      };

      const nextState = cardListFSMReducer(initialState, toggleItemEvent('c', TOTAL_ENABLED_DEFAULT));

      expect(nextState.selectedValues).toContain('c');
      expect(nextState.visualState).toBe('all');
    });

    it('removes item from full selection (all → some)', () => {
      const initialState: CardListFSMState = {
        selectedValues: ['a', 'b', 'c'],
        visualState: 'all',
      };

      const nextState = cardListFSMReducer(initialState, toggleItemEvent('b', TOTAL_ENABLED_DEFAULT));

      expect(nextState.selectedValues).not.toContain('b');
      expect(nextState.selectedValues).toEqual(['a', 'c']);
      expect(nextState.visualState).toBe('some');
    });

    it('preserves order when adding items', () => {
      const initialState: CardListFSMState = {
        selectedValues: ['a', 'c'],
        visualState: 'some',
      };

      const nextState = cardListFSMReducer(initialState, toggleItemEvent('b', TOTAL_ENABLED_FOUR));

      expect(nextState.selectedValues).toEqual(['a', 'c', 'b']);
    });

    it('one → some transition', () => {
      const initialState: CardListFSMState = {
        selectedValues: ['a'],
        visualState: 'one',
      };

      const nextState = cardListFSMReducer(initialState, toggleItemEvent('b', TOTAL_ENABLED_DEFAULT));

      expect(nextState.selectedValues).toEqual(['a', 'b']);
      expect(nextState.visualState).toBe('some');
    });
  });

  // =============================================================================
  // CLEAR_ALL Event
  // =============================================================================

  describe('CLEAR_ALL event', () => {
    it('clears all selections (all → none)', () => {
      const initialState: CardListFSMState = {
        selectedValues: ['a', 'b', 'c'],
        visualState: 'all',
      };

      const nextState = cardListFSMReducer(initialState, clearAllEvent());

      expect(nextState.selectedValues).toEqual([]);
      expect(nextState.visualState).toBe('none');
    });

    it('clears some selections (some → none)', () => {
      const initialState: CardListFSMState = {
        selectedValues: ['a', 'b'],
        visualState: 'some',
      };

      const nextState = cardListFSMReducer(initialState, clearAllEvent());

      expect(nextState.selectedValues).toEqual([]);
      expect(nextState.visualState).toBe('none');
    });

    it('clears one selection (one → none)', () => {
      const initialState: CardListFSMState = {
        selectedValues: ['a'],
        visualState: 'one',
      };

      const nextState = cardListFSMReducer(initialState, clearAllEvent());

      expect(nextState.selectedValues).toEqual([]);
      expect(nextState.visualState).toBe('none');
    });

    it('no-op when already none', () => {
      const initialState: CardListFSMState = {
        selectedValues: [],
        visualState: 'none',
      };

      const nextState = cardListFSMReducer(initialState, clearAllEvent());

      expect(nextState.selectedValues).toEqual([]);
      expect(nextState.visualState).toBe('none');
    });
  });

  // =============================================================================
  // SELECT_ALL Event
  // =============================================================================

  describe('SELECT_ALL event', () => {
    const enabledValues = ['a', 'b', 'c'];
    const totalEnabled = TOTAL_ENABLED_DEFAULT;

    it('selects all when none are selected (none → all)', () => {
      const initialState: CardListFSMState = {
        selectedValues: [],
        visualState: 'none',
      };

      const nextState = cardListFSMReducer(
        initialState,
        selectAllEvent(enabledValues, totalEnabled)
      );

      expect(nextState.selectedValues).toEqual(['a', 'b', 'c']);
      expect(nextState.visualState).toBe('all');
    });

    it('selects all when some are selected (some → all)', () => {
      const initialState: CardListFSMState = {
        selectedValues: ['a'],
        visualState: 'one',
      };

      const nextState = cardListFSMReducer(
        initialState,
        selectAllEvent(enabledValues, totalEnabled)
      );

      expect(nextState.selectedValues).toEqual(['a', 'b', 'c']);
      expect(nextState.visualState).toBe('all');
    });

    it('replaces with enabled values when all are already selected', () => {
      const initialState: CardListFSMState = {
        selectedValues: ['a', 'b', 'c'],
        visualState: 'all',
      };

      const nextState = cardListFSMReducer(
        initialState,
        selectAllEvent(enabledValues, totalEnabled)
      );

      expect(nextState.selectedValues).toEqual(['a', 'b', 'c']);
      expect(nextState.visualState).toBe('all');
    });
  });

  // =============================================================================
  // Event Creators
  // =============================================================================

  describe('Event Creators', () => {
    it('resetFromPropsEvent creates correct event', () => {
      const event = resetFromPropsEvent(['a', 'b'], 'multiple', TOTAL_ENABLED_DEFAULT);
      expect(event).toEqual({
        type: 'RESET_FROM_PROPS',
        values: ['a', 'b'],
        mode: 'multiple',
        totalEnabled: TOTAL_ENABLED_DEFAULT,
      });
    });

    it('selectItemEvent creates correct event', () => {
      const event = selectItemEvent('test', TOTAL_ENABLED_LARGE);
      expect(event).toEqual({
        type: 'SELECT_ITEM',
        value: 'test',
        totalEnabled: TOTAL_ENABLED_LARGE,
      });
    });

    it('toggleItemEvent creates correct event', () => {
      const event = toggleItemEvent('test', TOTAL_ENABLED_LARGE);
      expect(event).toEqual({
        type: 'TOGGLE_ITEM',
        value: 'test',
        totalEnabled: TOTAL_ENABLED_LARGE,
      });
    });

    it('clearAllEvent creates correct event', () => {
      const event = clearAllEvent();
      expect(event).toEqual({
        type: 'CLEAR_ALL',
      });
    });

    it('selectAllEvent creates correct event', () => {
      const event = selectAllEvent(['a', 'b'], 2);
      expect(event).toEqual({
        type: 'SELECT_ALL',
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
      it('returns true when visualState is none', () => {
        const state: CardListFSMState = {
          selectedValues: [],
          visualState: 'none',
        };
        expect(isNoneSelected(state)).toBe(true);
      });

      it('returns false when visualState is not none', () => {
        const state: CardListFSMState = {
          selectedValues: ['a'],
          visualState: 'one',
        };
        expect(isNoneSelected(state)).toBe(false);
      });
    });

    describe('isOneSelected', () => {
      it('returns true when visualState is one', () => {
        const state: CardListFSMState = {
          selectedValues: ['a'],
          visualState: 'one',
        };
        expect(isOneSelected(state)).toBe(true);
      });

      it('returns false when visualState is not one', () => {
        const state: CardListFSMState = {
          selectedValues: ['a', 'b'],
          visualState: 'some',
        };
        expect(isOneSelected(state)).toBe(false);
      });
    });

    describe('isSomeSelected', () => {
      it('returns true when visualState is some', () => {
        const state: CardListFSMState = {
          selectedValues: ['a', 'b'],
          visualState: 'some',
        };
        expect(isSomeSelected(state)).toBe(true);
      });

      it('returns false when visualState is not some', () => {
        const state: CardListFSMState = {
          selectedValues: ['a'],
          visualState: 'one',
        };
        expect(isSomeSelected(state)).toBe(false);
      });
    });

    describe('isAllSelected', () => {
      it('returns true when visualState is all', () => {
        const state: CardListFSMState = {
          selectedValues: ['a', 'b', 'c'],
          visualState: 'all',
        };
        expect(isAllSelected(state)).toBe(true);
      });

      it('returns false when visualState is not all', () => {
        const state: CardListFSMState = {
          selectedValues: ['a', 'b'],
          visualState: 'some',
        };
        expect(isAllSelected(state)).toBe(false);
      });
    });

    describe('isValueSelected', () => {
      const state: CardListFSMState = {
        selectedValues: ['a', 'b'],
        visualState: 'some',
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

    describe('getSelectedCount', () => {
      it('returns the count of selected items', () => {
        const state: CardListFSMState = {
          selectedValues: ['a', 'b', 'c'],
          visualState: 'all',
        };
        expect(getSelectedCount(state)).toBe(TOTAL_ENABLED_DEFAULT);
      });

      it('returns 0 for empty selection', () => {
        const state: CardListFSMState = {
          selectedValues: [],
          visualState: 'none',
        };
        expect(getSelectedCount(state)).toBe(0);
      });
    });
  });

  // =============================================================================
  // Complex Scenarios
  // =============================================================================

  describe('Complex Scenarios', () => {
    it('full workflow in multiple mode: none → one → some → all → none', () => {
      let state = createInitialCardListFSMState([], 'multiple', TOTAL_ENABLED_DEFAULT);
      expect(state.visualState).toBe('none');

      // Toggle first item: none → one
      state = cardListFSMReducer(state, toggleItemEvent('a', TOTAL_ENABLED_DEFAULT));
      expect(state.visualState).toBe('one');
      expect(state.selectedValues).toEqual(['a']);

      // Toggle second item: one → some
      state = cardListFSMReducer(state, toggleItemEvent('b', TOTAL_ENABLED_DEFAULT));
      expect(state.visualState).toBe('some');
      expect(state.selectedValues).toEqual(['a', 'b']);

      // Toggle third item: some → all
      state = cardListFSMReducer(state, toggleItemEvent('c', TOTAL_ENABLED_DEFAULT));
      expect(state.visualState).toBe('all');
      expect(state.selectedValues).toEqual(['a', 'b', 'c']);

      // Clear all: all → none
      state = cardListFSMReducer(state, clearAllEvent());
      expect(state.visualState).toBe('none');
      expect(state.selectedValues).toEqual([]);
    });

    it('single mode workflow: none → one (switching)', () => {
      let state = createInitialCardListFSMState([], 'single', TOTAL_ENABLED_DEFAULT);
      expect(state.visualState).toBe('none');

      // Select first item
      state = cardListFSMReducer(state, selectItemEvent('a', TOTAL_ENABLED_DEFAULT));
      expect(state.visualState).toBe('one');
      expect(state.selectedValues).toEqual(['a']);

      // Select different item (replaces)
      state = cardListFSMReducer(state, selectItemEvent('b', TOTAL_ENABLED_DEFAULT));
      expect(state.visualState).toBe('one');
      expect(state.selectedValues).toEqual(['b']);

      // Select same item again (no change)
      state = cardListFSMReducer(state, selectItemEvent('b', TOTAL_ENABLED_DEFAULT));
      expect(state.visualState).toBe('one');
      expect(state.selectedValues).toEqual(['b']);
    });

    it('controlled mode sync with RESET_FROM_PROPS', () => {
      let state = createInitialCardListFSMState(['a'], 'multiple', TOTAL_ENABLED_DEFAULT);
      expect(state.visualState).toBe('one');

      // External change: parent sets new value
      state = cardListFSMReducer(state, resetFromPropsEvent(['a', 'b', 'c'], 'multiple', TOTAL_ENABLED_DEFAULT));
      expect(state.visualState).toBe('all');

      // External change: parent clears selection
      state = cardListFSMReducer(state, resetFromPropsEvent([], 'multiple', TOTAL_ENABLED_DEFAULT));
      expect(state.visualState).toBe('none');
    });

    it('maintains state immutability', () => {
      const initialState: CardListFSMState = {
        selectedValues: ['a'],
        visualState: 'one',
      };

      const nextState = cardListFSMReducer(initialState, toggleItemEvent('b', TOTAL_ENABLED_DEFAULT));

      // Original state should be unchanged
      expect(initialState.selectedValues).toEqual(['a']);
      expect(initialState.visualState).toBe('one');

      // New state should be different object
      expect(nextState).not.toBe(initialState);
      expect(nextState.selectedValues).not.toBe(initialState.selectedValues);
    });
  });
});
