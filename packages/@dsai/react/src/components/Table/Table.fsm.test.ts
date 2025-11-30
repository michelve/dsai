/**
 * Table FSM Unit Tests
 *
 * Tests for the pure reducer and state management logic
 * without React dependencies.
 */

import {
  clearAllEvent,
  createInitialTableFSMState,
  deriveVisualState,
  getSelectedCount,
  isAllSelected,
  isNoneSelected,
  isOneSelected,
  isRowSelected,
  isSelectAllChecked,
  isSelectAllIndeterminate,
  isSomeSelected,
  resetFromPropsEvent,
  selectAllEvent,
  selectRowEvent,
  tableFSMReducer,
  toggleAllEvent,
  toggleRowEvent,
} from './Table.fsm';
import type { TableFSMState } from './Table.types';

// =============================================================================
// State Derivation Tests
// =============================================================================

describe('deriveVisualState', () => {
  it('returns "none" when no items selected', () => {
    expect(deriveVisualState([], 5)).toBe('none');
  });

  it('returns "one" when exactly one item selected', () => {
    expect(deriveVisualState([1], 5)).toBe('one');
  });

  it('returns "some" when more than one but not all items selected', () => {
    expect(deriveVisualState([1, 2], 5)).toBe('some');
    expect(deriveVisualState([1, 2, 3], 5)).toBe('some');
    expect(deriveVisualState([1, 2, 3, 4], 5)).toBe('some');
  });

  it('returns "all" when all items selected', () => {
    expect(deriveVisualState([1, 2, 3, 4, 5], 5)).toBe('all');
  });

  it('returns "all" when selected count equals total (edge case)', () => {
    expect(deriveVisualState(['a', 'b'], 2)).toBe('all');
  });

  it('returns "one" when totalEnabled is 1 and 1 selected', () => {
    expect(deriveVisualState([1], 1)).toBe('one');
  });

  it('handles empty total correctly', () => {
    // With 0 total enabled, selecting anything is still considered relative to 0
    expect(deriveVisualState([], 0)).toBe('none');
    expect(deriveVisualState([1], 0)).toBe('one');
  });
});

// =============================================================================
// Initial State Factory Tests
// =============================================================================

describe('createInitialTableFSMState', () => {
  describe('none mode', () => {
    it('always returns empty selection', () => {
      const state = createInitialTableFSMState([1, 2, 3], 'none', 5);

      expect(state.selectedRows).toEqual([]);
      expect(state.visualState).toBe('none');
    });
  });

  describe('single mode', () => {
    it('keeps only first value', () => {
      const state = createInitialTableFSMState([1, 2, 3], 'single', 5);

      expect(state.selectedRows).toEqual([1]);
      expect(state.visualState).toBe('one');
    });

    it('returns empty when no values', () => {
      const state = createInitialTableFSMState([], 'single', 5);

      expect(state.selectedRows).toEqual([]);
      expect(state.visualState).toBe('none');
    });

    it('handles string IDs', () => {
      const state = createInitialTableFSMState(['user-1', 'user-2'], 'single', 5);

      expect(state.selectedRows).toEqual(['user-1']);
    });
  });

  describe('multiple mode', () => {
    it('keeps all values', () => {
      const state = createInitialTableFSMState([1, 2, 3], 'multiple', 5);

      expect(state.selectedRows).toEqual([1, 2, 3]);
      expect(state.visualState).toBe('some');
    });

    it('deduplicates values', () => {
      const state = createInitialTableFSMState([1, 2, 2, 3, 1], 'multiple', 5);

      expect(state.selectedRows).toEqual([1, 2, 3]);
    });

    it('returns empty when no values', () => {
      const state = createInitialTableFSMState([], 'multiple', 5);

      expect(state.selectedRows).toEqual([]);
      expect(state.visualState).toBe('none');
    });

    it('sets visualState to "all" when all selected', () => {
      const state = createInitialTableFSMState([1, 2, 3], 'multiple', 3);

      expect(state.visualState).toBe('all');
    });
  });
});

// =============================================================================
// FSM Reducer Tests
// =============================================================================

describe('tableFSMReducer', () => {
  // ===========================================================================
  // RESET_FROM_PROPS
  // ===========================================================================

  describe('RESET_FROM_PROPS', () => {
    it('resets state in none mode', () => {
      const initialState: TableFSMState = {
        selectedRows: [1, 2],
        visualState: 'some',
      };

      const nextState = tableFSMReducer(initialState, resetFromPropsEvent([3, 4], 'none', 5));

      expect(nextState.selectedRows).toEqual([]);
      expect(nextState.visualState).toBe('none');
    });

    it('resets state in single mode (keeps first)', () => {
      const initialState: TableFSMState = {
        selectedRows: [1],
        visualState: 'one',
      };

      const nextState = tableFSMReducer(initialState, resetFromPropsEvent([3, 4], 'single', 5));

      expect(nextState.selectedRows).toEqual([3]);
      expect(nextState.visualState).toBe('one');
    });

    it('resets state in multiple mode', () => {
      const initialState: TableFSMState = {
        selectedRows: [1, 2],
        visualState: 'some',
      };

      const nextState = tableFSMReducer(
        initialState,
        resetFromPropsEvent([3, 4, 5], 'multiple', 5)
      );

      expect(nextState.selectedRows).toEqual([3, 4, 5]);
      expect(nextState.visualState).toBe('some');
    });

    it('deduplicates in multiple mode', () => {
      const initialState: TableFSMState = {
        selectedRows: [],
        visualState: 'none',
      };

      const nextState = tableFSMReducer(
        initialState,
        resetFromPropsEvent([1, 1, 2, 2], 'multiple', 5)
      );

      expect(nextState.selectedRows).toEqual([1, 2]);
    });

    it('handles empty values in single mode', () => {
      const initialState: TableFSMState = {
        selectedRows: [1],
        visualState: 'one',
      };

      const nextState = tableFSMReducer(initialState, resetFromPropsEvent([], 'single', 5));

      expect(nextState.selectedRows).toEqual([]);
      expect(nextState.visualState).toBe('none');
    });
  });

  // ===========================================================================
  // SELECT_ROW (single mode)
  // ===========================================================================

  describe('SELECT_ROW', () => {
    it('selects a new row', () => {
      const initialState: TableFSMState = {
        selectedRows: [],
        visualState: 'none',
      };

      const nextState = tableFSMReducer(initialState, selectRowEvent(1, 5));

      expect(nextState.selectedRows).toEqual([1]);
      expect(nextState.visualState).toBe('one');
    });

    it('replaces current selection', () => {
      const initialState: TableFSMState = {
        selectedRows: [1],
        visualState: 'one',
      };

      const nextState = tableFSMReducer(initialState, selectRowEvent(2, 5));

      expect(nextState.selectedRows).toEqual([2]);
      expect(nextState.visualState).toBe('one');
    });

    it('does not change state when same row selected', () => {
      const initialState: TableFSMState = {
        selectedRows: [1],
        visualState: 'one',
      };

      const nextState = tableFSMReducer(initialState, selectRowEvent(1, 5));

      expect(nextState).toBe(initialState); // Same reference
    });

    it('works with string IDs', () => {
      const initialState: TableFSMState = {
        selectedRows: [],
        visualState: 'none',
      };

      const nextState = tableFSMReducer(initialState, selectRowEvent('user-1', 5));

      expect(nextState.selectedRows).toEqual(['user-1']);
    });
  });

  // ===========================================================================
  // TOGGLE_ROW (multiple mode)
  // ===========================================================================

  describe('TOGGLE_ROW', () => {
    it('adds row to selection', () => {
      const initialState: TableFSMState = {
        selectedRows: [1],
        visualState: 'one',
      };

      const nextState = tableFSMReducer(initialState, toggleRowEvent(2, 5));

      expect(nextState.selectedRows).toContain(1);
      expect(nextState.selectedRows).toContain(2);
      expect(nextState.visualState).toBe('some');
    });

    it('removes row from selection', () => {
      const initialState: TableFSMState = {
        selectedRows: [1, 2],
        visualState: 'some',
      };

      const nextState = tableFSMReducer(initialState, toggleRowEvent(1, 5));

      expect(nextState.selectedRows).toEqual([2]);
      expect(nextState.visualState).toBe('one');
    });

    it('transitions to "none" when last item removed', () => {
      const initialState: TableFSMState = {
        selectedRows: [1],
        visualState: 'one',
      };

      const nextState = tableFSMReducer(initialState, toggleRowEvent(1, 5));

      expect(nextState.selectedRows).toEqual([]);
      expect(nextState.visualState).toBe('none');
    });

    it('transitions to "all" when all items selected', () => {
      const initialState: TableFSMState = {
        selectedRows: [1, 2],
        visualState: 'some',
      };

      const nextState = tableFSMReducer(initialState, toggleRowEvent(3, 3));

      expect(nextState.selectedRows).toContain(1);
      expect(nextState.selectedRows).toContain(2);
      expect(nextState.selectedRows).toContain(3);
      expect(nextState.visualState).toBe('all');
    });
  });

  // ===========================================================================
  // CLEAR_ALL
  // ===========================================================================

  describe('CLEAR_ALL', () => {
    it('clears all selections', () => {
      const initialState: TableFSMState = {
        selectedRows: [1, 2, 3],
        visualState: 'some',
      };

      const nextState = tableFSMReducer(initialState, clearAllEvent());

      expect(nextState.selectedRows).toEqual([]);
      expect(nextState.visualState).toBe('none');
    });

    it('handles already empty state', () => {
      const initialState: TableFSMState = {
        selectedRows: [],
        visualState: 'none',
      };

      const nextState = tableFSMReducer(initialState, clearAllEvent());

      expect(nextState.selectedRows).toEqual([]);
      expect(nextState.visualState).toBe('none');
    });
  });

  // ===========================================================================
  // SELECT_ALL
  // ===========================================================================

  describe('SELECT_ALL', () => {
    it('selects all enabled rows', () => {
      const initialState: TableFSMState = {
        selectedRows: [],
        visualState: 'none',
      };

      const nextState = tableFSMReducer(initialState, selectAllEvent([1, 2, 3, 4, 5], 5));

      expect(nextState.selectedRows).toEqual([1, 2, 3, 4, 5]);
      expect(nextState.visualState).toBe('all');
    });

    it('replaces partial selection with all', () => {
      const initialState: TableFSMState = {
        selectedRows: [1, 2],
        visualState: 'some',
      };

      const nextState = tableFSMReducer(initialState, selectAllEvent([1, 2, 3], 3));

      expect(nextState.selectedRows).toEqual([1, 2, 3]);
      expect(nextState.visualState).toBe('all');
    });
  });

  // ===========================================================================
  // TOGGLE_ALL
  // ===========================================================================

  describe('TOGGLE_ALL', () => {
    it('selects all when none selected', () => {
      const initialState: TableFSMState = {
        selectedRows: [],
        visualState: 'none',
      };

      const nextState = tableFSMReducer(initialState, toggleAllEvent([1, 2, 3], 3));

      expect(nextState.selectedRows).toEqual([1, 2, 3]);
      expect(nextState.visualState).toBe('all');
    });

    it('selects all when some selected', () => {
      const initialState: TableFSMState = {
        selectedRows: [1],
        visualState: 'one',
      };

      const nextState = tableFSMReducer(initialState, toggleAllEvent([1, 2, 3], 3));

      expect(nextState.selectedRows).toEqual([1, 2, 3]);
      expect(nextState.visualState).toBe('all');
    });

    it('deselects all when all selected', () => {
      const initialState: TableFSMState = {
        selectedRows: [1, 2, 3],
        visualState: 'all',
      };

      const nextState = tableFSMReducer(initialState, toggleAllEvent([1, 2, 3], 3));

      expect(nextState.selectedRows).toEqual([]);
      expect(nextState.visualState).toBe('none');
    });
  });
});

// =============================================================================
// Predicate Tests
// =============================================================================

describe('Predicates', () => {
  const noneState: TableFSMState = { selectedRows: [], visualState: 'none' };
  const oneState: TableFSMState = { selectedRows: [1], visualState: 'one' };
  const someState: TableFSMState = { selectedRows: [1, 2], visualState: 'some' };
  const allState: TableFSMState = { selectedRows: [1, 2, 3], visualState: 'all' };

  describe('isNoneSelected', () => {
    it('returns true when visualState is "none"', () => {
      expect(isNoneSelected(noneState)).toBe(true);
    });

    it('returns false otherwise', () => {
      expect(isNoneSelected(oneState)).toBe(false);
      expect(isNoneSelected(someState)).toBe(false);
      expect(isNoneSelected(allState)).toBe(false);
    });
  });

  describe('isOneSelected', () => {
    it('returns true when visualState is "one"', () => {
      expect(isOneSelected(oneState)).toBe(true);
    });

    it('returns false otherwise', () => {
      expect(isOneSelected(noneState)).toBe(false);
      expect(isOneSelected(someState)).toBe(false);
      expect(isOneSelected(allState)).toBe(false);
    });
  });

  describe('isSomeSelected', () => {
    it('returns true when visualState is "some"', () => {
      expect(isSomeSelected(someState)).toBe(true);
    });

    it('returns false otherwise', () => {
      expect(isSomeSelected(noneState)).toBe(false);
      expect(isSomeSelected(oneState)).toBe(false);
      expect(isSomeSelected(allState)).toBe(false);
    });
  });

  describe('isAllSelected', () => {
    it('returns true when visualState is "all"', () => {
      expect(isAllSelected(allState)).toBe(true);
    });

    it('returns false otherwise', () => {
      expect(isAllSelected(noneState)).toBe(false);
      expect(isAllSelected(oneState)).toBe(false);
      expect(isAllSelected(someState)).toBe(false);
    });
  });

  describe('isRowSelected', () => {
    it('returns true when row is in selectedRows', () => {
      expect(isRowSelected(someState, 1)).toBe(true);
      expect(isRowSelected(someState, 2)).toBe(true);
    });

    it('returns false when row is not in selectedRows', () => {
      expect(isRowSelected(someState, 3)).toBe(false);
    });

    it('works with string IDs', () => {
      const state: TableFSMState = {
        selectedRows: ['user-1', 'user-2'],
        visualState: 'some',
      };
      expect(isRowSelected(state, 'user-1')).toBe(true);
      expect(isRowSelected(state, 'user-3')).toBe(false);
    });
  });

  describe('getSelectedCount', () => {
    it('returns count of selected rows', () => {
      expect(getSelectedCount(noneState)).toBe(0);
      expect(getSelectedCount(oneState)).toBe(1);
      expect(getSelectedCount(someState)).toBe(2);
      expect(getSelectedCount(allState)).toBe(3);
    });
  });

  describe('isSelectAllIndeterminate', () => {
    it('returns true when visualState is "some"', () => {
      expect(isSelectAllIndeterminate(someState)).toBe(true);
    });

    it('returns false otherwise', () => {
      expect(isSelectAllIndeterminate(noneState)).toBe(false);
      expect(isSelectAllIndeterminate(oneState)).toBe(false);
      expect(isSelectAllIndeterminate(allState)).toBe(false);
    });
  });

  describe('isSelectAllChecked', () => {
    it('returns true when visualState is "all"', () => {
      expect(isSelectAllChecked(allState)).toBe(true);
    });

    it('returns false otherwise', () => {
      expect(isSelectAllChecked(noneState)).toBe(false);
      expect(isSelectAllChecked(oneState)).toBe(false);
      expect(isSelectAllChecked(someState)).toBe(false);
    });
  });
});

// =============================================================================
// Event Creator Tests
// =============================================================================

describe('Event Creators', () => {
  it('creates RESET_FROM_PROPS event', () => {
    const event = resetFromPropsEvent([1, 2], 'multiple', 5);

    expect(event).toEqual({
      type: 'RESET_FROM_PROPS',
      rowIds: [1, 2],
      mode: 'multiple',
      totalEnabled: 5,
    });
  });

  it('creates SELECT_ROW event', () => {
    const event = selectRowEvent(1, 5);

    expect(event).toEqual({
      type: 'SELECT_ROW',
      rowId: 1,
      totalEnabled: 5,
    });
  });

  it('creates TOGGLE_ROW event', () => {
    const event = toggleRowEvent(1, 5);

    expect(event).toEqual({
      type: 'TOGGLE_ROW',
      rowId: 1,
      totalEnabled: 5,
    });
  });

  it('creates CLEAR_ALL event', () => {
    const event = clearAllEvent();

    expect(event).toEqual({ type: 'CLEAR_ALL' });
  });

  it('creates SELECT_ALL event', () => {
    const event = selectAllEvent([1, 2, 3], 3);

    expect(event).toEqual({
      type: 'SELECT_ALL',
      enabledRowIds: [1, 2, 3],
      totalEnabled: 3,
    });
  });

  it('creates TOGGLE_ALL event', () => {
    const event = toggleAllEvent([1, 2, 3], 3);

    expect(event).toEqual({
      type: 'TOGGLE_ALL',
      enabledRowIds: [1, 2, 3],
      totalEnabled: 3,
    });
  });
});
