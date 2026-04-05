/**
 * Table FSM - Finite State Machine for table row selection behavior
 *
 * Manages selection logic for tables with three modes:
 * - none: No selection allowed (display only)
 * - single: Only one row can be selected at a time (radio-like)
 * - multiple: Multiple rows can be selected (checkbox-like)
 *
 * This FSM is pure and testable - no React dependencies.
 * The component uses useReducer with this reducer.
 *
 * @module Table/FSM
 */

import type { RowId, TableFSMState, TableSelectionMode, TableVisualState } from './Table.types';

// =============================================================================
// Event Types
// =============================================================================

/**
 * Reset state from controlled props - used when selectedRows prop changes
 */
export interface ResetFromPropsEvent {
  type: 'RESET_FROM_PROPS';
  /** New selected row IDs from props */
  rowIds: RowId[];
  /** Selection mode */
  mode: TableSelectionMode;
  /** Total count of enabled (non-disabled) rows */
  totalEnabled: number;
}

/**
 * Select a single row (single selection mode only)
 * Replaces the current selection with the new value.
 */
export interface SelectRowEvent {
  type: 'SELECT_ROW';
  /** ID of the row being selected */
  rowId: RowId;
  /** Total count of enabled rows */
  totalEnabled: number;
}

/**
 * Toggle a single row's selection state (multiple selection mode only)
 */
export interface ToggleRowEvent {
  type: 'TOGGLE_ROW';
  /** ID of the row being toggled */
  rowId: RowId;
  /** Total count of enabled rows */
  totalEnabled: number;
}

/**
 * Clear all selections
 */
export interface ClearAllEvent {
  type: 'CLEAR_ALL';
}

/**
 * Select all enabled rows (multiple selection mode only)
 */
export interface SelectAllEvent {
  type: 'SELECT_ALL';
  /** Array of all enabled row IDs */
  enabledRowIds: RowId[];
  /** Total count of enabled rows */
  totalEnabled: number;
}

/**
 * Toggle all rows - if all are selected, deselect all; otherwise select all
 */
export interface ToggleAllEvent {
  type: 'TOGGLE_ALL';
  /** Array of all enabled row IDs */
  enabledRowIds: RowId[];
  /** Total count of enabled rows */
  totalEnabled: number;
}

/**
 * Select a range of rows (Shift+Click in multiple mode)
 */
export interface SelectRangeEvent {
  type: 'SELECT_RANGE';
  /** Row IDs to add to the selection */
  rowIds: RowId[];
  /** Total count of enabled rows */
  totalEnabled: number;
}

/**
 * Union of all FSM events
 */
export type TableFSMEvent =
  | ResetFromPropsEvent
  | SelectRowEvent
  | ToggleRowEvent
  | ClearAllEvent
  | SelectAllEvent
  | ToggleAllEvent
  | SelectRangeEvent;

// =============================================================================
// State Derivation
// =============================================================================

/**
 * Derives the visual state from selected rows and total enabled count
 *
 * @param selectedRows - Currently selected row IDs
 * @param totalEnabled - Total number of enabled rows
 * @returns The derived visual state
 */
export function deriveVisualState(selectedRows: RowId[], totalEnabled: number): TableVisualState {
  const count = selectedRows.length;

  // No rows selected
  if (count === 0) {
    return 'none';
  }

  // Exactly one row selected
  if (count === 1) {
    return 'one';
  }

  // All enabled rows selected
  if (count >= totalEnabled && totalEnabled > 0) {
    return 'all';
  }

  // Some rows selected (more than one, but not all)
  return 'some';
}

// =============================================================================
// Initial State Factory
// =============================================================================

/**
 * Creates the initial FSM state
 *
 * @param rowIds - Initial selected row IDs
 * @param mode - Selection mode
 * @param totalEnabled - Total number of enabled rows
 * @returns Initial FSM state
 */
export function createInitialTableFSMState(
  rowIds: RowId[],
  mode: TableSelectionMode,
  totalEnabled: number
): TableFSMState {
  // For 'none' mode, always start with empty selection
  if (mode === 'none') {
    return {
      selectedRows: [],
      visualState: 'none',
    };
  }

  // For 'single' mode, only allow at most one value
  if (mode === 'single') {
    const firstValue = rowIds[0];
    const selectedRows = firstValue !== undefined ? [firstValue] : [];
    return {
      selectedRows,
      visualState: deriveVisualState(selectedRows, totalEnabled),
    };
  }

  // For 'multiple' mode, deduplicate values
  const selectedRows = [...new Set(rowIds)];
  return {
    selectedRows,
    visualState: deriveVisualState(selectedRows, totalEnabled),
  };
}

// =============================================================================
// FSM Reducer
// =============================================================================

/**
 * Pure reducer for Table FSM
 *
 * Handles all state transitions:
 * - RESET_FROM_PROPS: Sync state with controlled props
 * - SELECT_ROW: Select a single row (single mode)
 * - TOGGLE_ROW: Toggle a row's selection (multiple mode)
 * - CLEAR_ALL: Deselect all rows
 * - SELECT_ALL: Select all enabled rows (multiple mode)
 * - TOGGLE_ALL: Toggle all rows (select all if not all selected, else clear)
 *
 * @param state - Current FSM state
 * @param event - Event to process
 * @returns New FSM state
 */
/**
 * Build state from selected rows and total enabled count
 */
function buildState(selectedRows: RowId[], totalEnabled: number): TableFSMState {
  return {
    selectedRows,
    visualState: deriveVisualState(selectedRows, totalEnabled),
  };
}

/** Handle RESET_FROM_PROPS — re-derive state from controlled props */
function handleResetFromProps(event: ResetFromPropsEvent): TableFSMState {
  return createInitialTableFSMState(event.rowIds, event.mode, event.totalEnabled);
}

/** Handle SELECT_ROW — radio-button behavior for single mode */
function handleSelectRow(state: TableFSMState, event: SelectRowEvent): TableFSMState {
  if (state.selectedRows.includes(event.rowId)) {
    return state;
  }
  return buildState([event.rowId], event.totalEnabled);
}

/** Handle TOGGLE_ROW — checkbox behavior for multiple mode */
function handleToggleRow(state: TableFSMState, event: ToggleRowEvent): TableFSMState {
  const selected = new Set(state.selectedRows);
  if (selected.has(event.rowId)) {
    selected.delete(event.rowId);
  } else {
    selected.add(event.rowId);
  }
  return buildState(Array.from(selected), event.totalEnabled);
}

/** Handle TOGGLE_ALL — select all if not all selected, else clear */
function handleToggleAll(state: TableFSMState, event: ToggleAllEvent): TableFSMState {
  if (state.visualState === 'all') {
    return { selectedRows: [], visualState: 'none' };
  }
  return buildState([...event.enabledRowIds], event.totalEnabled);
}

/** Handle SELECT_RANGE — add a range of rows to the existing selection */
function handleSelectRange(state: TableFSMState, event: SelectRangeEvent): TableFSMState {
  const selected = new Set(state.selectedRows);
  for (const id of event.rowIds) {
    selected.add(id);
  }
  return buildState(Array.from(selected), event.totalEnabled);
}

export function tableFSMReducer(state: TableFSMState, event: TableFSMEvent): TableFSMState {
  switch (event.type) {
    case 'RESET_FROM_PROPS':
      return handleResetFromProps(event);

    case 'SELECT_ROW':
      return handleSelectRow(state, event);

    case 'TOGGLE_ROW':
      return handleToggleRow(state, event);

    case 'CLEAR_ALL':
      return { selectedRows: [], visualState: 'none' };

    case 'SELECT_ALL':
      return buildState([...event.enabledRowIds], event.totalEnabled);

    case 'TOGGLE_ALL':
      return handleToggleAll(state, event);

    case 'SELECT_RANGE':
      return handleSelectRange(state, event);

    default: {
      const _exhaustive: never = event;
      return _exhaustive;
    }
  }
}

// =============================================================================
// Event Creators
// =============================================================================

/**
 * Creates a RESET_FROM_PROPS event
 */
export function resetFromPropsEvent(
  rowIds: RowId[],
  mode: TableSelectionMode,
  totalEnabled: number
): ResetFromPropsEvent {
  return { type: 'RESET_FROM_PROPS', rowIds, mode, totalEnabled };
}

/**
 * Creates a SELECT_ROW event (single mode)
 */
export function selectRowEvent(rowId: RowId, totalEnabled: number): SelectRowEvent {
  return { type: 'SELECT_ROW', rowId, totalEnabled };
}

/**
 * Creates a TOGGLE_ROW event (multiple mode)
 */
export function toggleRowEvent(rowId: RowId, totalEnabled: number): ToggleRowEvent {
  return { type: 'TOGGLE_ROW', rowId, totalEnabled };
}

/**
 * Creates a CLEAR_ALL event
 */
export function clearAllEvent(): ClearAllEvent {
  return { type: 'CLEAR_ALL' };
}

/**
 * Creates a SELECT_ALL event (multiple mode)
 */
export function selectAllEvent(enabledRowIds: RowId[], totalEnabled: number): SelectAllEvent {
  return { type: 'SELECT_ALL', enabledRowIds, totalEnabled };
}

/**
 * Creates a TOGGLE_ALL event (multiple mode)
 */
export function toggleAllEvent(enabledRowIds: RowId[], totalEnabled: number): ToggleAllEvent {
  return { type: 'TOGGLE_ALL', enabledRowIds, totalEnabled };
}

/**
 * Creates a SELECT_RANGE event (Shift+Click in multiple mode)
 */
export function selectRangeEvent(rowIds: RowId[], totalEnabled: number): SelectRangeEvent {
  return { type: 'SELECT_RANGE', rowIds, totalEnabled };
}

// =============================================================================
// Predicates
// =============================================================================

/**
 * Check if no rows are selected
 */
export function isNoneSelected(state: TableFSMState): boolean {
  return state.visualState === 'none';
}

/**
 * Check if exactly one row is selected
 */
export function isOneSelected(state: TableFSMState): boolean {
  return state.visualState === 'one';
}

/**
 * Check if some rows are selected (but not all)
 */
export function isSomeSelected(state: TableFSMState): boolean {
  return state.visualState === 'some';
}

/**
 * Check if all rows are selected
 */
export function isAllSelected(state: TableFSMState): boolean {
  return state.visualState === 'all';
}

/**
 * Check if a specific row is selected
 */
export function isRowSelected(state: TableFSMState, rowId: RowId): boolean {
  return state.selectedRows.includes(rowId);
}

/**
 * Get the count of selected rows
 */
export function getSelectedCount(state: TableFSMState): number {
  return state.selectedRows.length;
}

/**
 * Get the indeterminate state for "select all" checkbox
 * Returns true when some (but not all) rows are selected
 */
export function isSelectAllIndeterminate(state: TableFSMState): boolean {
  return state.visualState === 'some';
}

/**
 * Get the checked state for "select all" checkbox
 * Returns true when all rows are selected
 */
export function isSelectAllChecked(state: TableFSMState): boolean {
  return state.visualState === 'all';
}
