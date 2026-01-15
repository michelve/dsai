/**
 * CheckboxGroup FSM - Finite State Machine for group selection behavior
 *
 * Manages tri-state selection logic for checkbox groups:
 * - none: No items selected
 * - some: Some items selected (indeterminate)
 * - all: All enabled items selected
 *
 * This FSM is pure and testable - no React dependencies.
 * The component uses useReducer with this reducer.
 *
 * @module CheckboxGroup/FSM
 */

// =============================================================================
// State Types
// =============================================================================

/**
 * Group selection state - determines the visual state of the "select all" checkbox
 */
export type GroupSelectionState = 'none' | 'some' | 'all';

/**
 * FSM state for CheckboxGroup
 */
export interface CheckboxGroupFSMState {
  /** Currently selected values */
  selectedValues: string[];
  /** Derived selection state based on selected count vs total enabled */
  selectionState: GroupSelectionState;
}

// =============================================================================
// Event Types
// =============================================================================

/**
 * Reset state from controlled props - used when value prop changes
 */
export interface ResetFromPropsEvent {
  type: 'RESET_FROM_PROPS';
  /** New selected values from props */
  values: string[];
  /** Total count of enabled (non-disabled) options */
  totalEnabled: number;
}

/**
 * Toggle a single item's selection state
 */
export interface ToggleItemEvent {
  type: 'TOGGLE_ITEM';
  /** Value of the item being toggled */
  value: string;
  /** Total count of enabled options */
  totalEnabled: number;
}

/**
 * Toggle all items via the "select all" checkbox
 */
export interface ToggleAllEvent {
  type: 'TOGGLE_ALL';
  /** Total count of enabled options */
  totalEnabled: number;
  /** Array of all enabled option values */
  enabledValues: string[];
}

/**
 * Union of all FSM events
 */
export type CheckboxGroupFSMEvent = ResetFromPropsEvent | ToggleItemEvent | ToggleAllEvent;

// =============================================================================
// State Derivation
// =============================================================================

/**
 * Derives the selection state from selected values and total enabled count
 *
 * @param selectedValues - Currently selected values
 * @param totalEnabled - Total number of enabled options
 * @returns The derived selection state
 */
export function deriveSelectionState(
  selectedValues: string[],
  totalEnabled: number
): GroupSelectionState {
  const count = selectedValues.length;

  // No items selected
  if (count === 0) {
    return 'none';
  }

  // All enabled items selected
  if (count >= totalEnabled && totalEnabled > 0) {
    return 'all';
  }

  // Some items selected
  return 'some';
}

// =============================================================================
// Initial State Factory
// =============================================================================

/**
 * Creates the initial FSM state
 *
 * @param values - Initial selected values
 * @param totalEnabled - Total number of enabled options
 * @returns Initial FSM state
 */
export function createInitialCheckboxGroupFSMState(
  values: string[],
  totalEnabled: number
): CheckboxGroupFSMState {
  // Deduplicate values
  const selectedValues = [...new Set(values)];

  return {
    selectedValues,
    selectionState: deriveSelectionState(selectedValues, totalEnabled),
  };
}

// =============================================================================
// FSM Reducer
// =============================================================================

/**
 * Pure reducer for CheckboxGroup FSM
 *
 * Handles all state transitions:
 * - RESET_FROM_PROPS: Sync state with controlled props
 * - TOGGLE_ITEM: Toggle a single item's selection
 * - TOGGLE_ALL: Select all or clear all based on current state
 *
 * @param state - Current FSM state
 * @param event - Event to process
 * @returns New FSM state
 */
export function checkboxGroupFSMReducer(
  state: CheckboxGroupFSMState,
  event: CheckboxGroupFSMEvent
): CheckboxGroupFSMState {
  switch (event.type) {
    case 'RESET_FROM_PROPS': {
      // Sync state with new controlled values
      const selectedValues = [...new Set(event.values)];
      return {
        selectedValues,
        selectionState: deriveSelectionState(selectedValues, event.totalEnabled),
      };
    }

    case 'TOGGLE_ITEM': {
      const { value, totalEnabled } = event;
      const selected = new Set(state.selectedValues);

      // Toggle the item
      if (selected.has(value)) {
        selected.delete(value);
      } else {
        selected.add(value);
      }

      const selectedValues = Array.from(selected);
      return {
        selectedValues,
        selectionState: deriveSelectionState(selectedValues, totalEnabled),
      };
    }

    case 'TOGGLE_ALL': {
      const { enabledValues, totalEnabled } = event;

      let selectedValues: string[];

      if (state.selectionState === 'all') {
        // All selected → clear all
        selectedValues = [];
      } else {
        // None or some selected → select all enabled
        selectedValues = [...enabledValues];
      }

      return {
        selectedValues,
        selectionState: deriveSelectionState(selectedValues, totalEnabled),
      };
    }

    default: {
      // TypeScript exhaustiveness check
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
export function resetFromPropsEvent(values: string[], totalEnabled: number): ResetFromPropsEvent {
  return { type: 'RESET_FROM_PROPS', values, totalEnabled };
}

/**
 * Creates a TOGGLE_ITEM event
 */
export function toggleItemEvent(value: string, totalEnabled: number): ToggleItemEvent {
  return { type: 'TOGGLE_ITEM', value, totalEnabled };
}

/**
 * Creates a TOGGLE_ALL event
 */
export function toggleAllEvent(enabledValues: string[], totalEnabled: number): ToggleAllEvent {
  return { type: 'TOGGLE_ALL', enabledValues, totalEnabled };
}

// =============================================================================
// Predicates
// =============================================================================

/**
 * Check if selection state is 'none'
 */
export function isNoneSelected(state: CheckboxGroupFSMState): boolean {
  return state.selectionState === 'none';
}

/**
 * Check if selection state is 'some' (indeterminate)
 */
export function isSomeSelected(state: CheckboxGroupFSMState): boolean {
  return state.selectionState === 'some';
}

/**
 * Check if selection state is 'all'
 */
export function isAllSelected(state: CheckboxGroupFSMState): boolean {
  return state.selectionState === 'all';
}

/**
 * Check if a specific value is selected
 */
export function isValueSelected(state: CheckboxGroupFSMState, value: string): boolean {
  return state.selectedValues.includes(value);
}
