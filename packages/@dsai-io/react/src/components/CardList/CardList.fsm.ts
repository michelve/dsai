/**
 * CardList FSM - Finite State Machine for card list selection behavior
 *
 * Manages selection logic for card lists with three modes:
 * - none: No selection allowed (display only)
 * - single: Only one card can be selected at a time (radio-like)
 * - multiple: Multiple cards can be selected (checkbox-like)
 *
 * This FSM is pure and testable - no React dependencies.
 * The component uses useReducer with this reducer.
 *
 * @module CardList/FSM
 */

// =============================================================================
// Types
// =============================================================================

/**
 * Selection mode for CardList
 */
export type CardListSelectionMode = 'none' | 'single' | 'multiple';

/**
 * Visual state for the CardList - used for CSS styling and accessibility
 */
export type CardListVisualState = 'none' | 'one' | 'some' | 'all';

/**
 * FSM state for CardList
 */
export interface CardListFSMState {
  /** Currently selected values (empty for 'none' mode) */
  selectedValues: string[];
  /** Derived visual state based on selection count */
  visualState: CardListVisualState;
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
  /** Selection mode */
  mode: CardListSelectionMode;
  /** Total count of enabled (non-disabled) cards */
  totalEnabled: number;
}

/**
 * Select a single item (single selection mode only)
 * Replaces the current selection with the new value.
 */
export interface SelectItemEvent {
  type: 'SELECT_ITEM';
  /** Value of the card being selected */
  value: string;
  /** Total count of enabled cards */
  totalEnabled: number;
}

/**
 * Toggle a single item's selection state (multiple selection mode only)
 */
export interface ToggleItemEvent {
  type: 'TOGGLE_ITEM';
  /** Value of the card being toggled */
  value: string;
  /** Total count of enabled cards */
  totalEnabled: number;
}

/**
 * Clear all selections
 */
export interface ClearAllEvent {
  type: 'CLEAR_ALL';
}

/**
 * Select all enabled items (multiple selection mode only)
 */
export interface SelectAllEvent {
  type: 'SELECT_ALL';
  /** Array of all enabled card values */
  enabledValues: string[];
  /** Total count of enabled cards */
  totalEnabled: number;
}

/**
 * Union of all FSM events
 */
export type CardListFSMEvent =
  | ResetFromPropsEvent
  | SelectItemEvent
  | ToggleItemEvent
  | ClearAllEvent
  | SelectAllEvent;

// =============================================================================
// State Derivation
// =============================================================================

/**
 * Derives the visual state from selected values and total enabled count
 *
 * @param selectedValues - Currently selected values
 * @param totalEnabled - Total number of enabled cards
 * @returns The derived visual state
 */
export function deriveVisualState(
  selectedValues: string[],
  totalEnabled: number
): CardListVisualState {
  const count = selectedValues.length;

  // No items selected
  if (count === 0) {
    return 'none';
  }

  // Exactly one item selected
  if (count === 1) {
    return 'one';
  }

  // All enabled items selected
  if (count >= totalEnabled && totalEnabled > 0) {
    return 'all';
  }

  // Some items selected (more than one, but not all)
  return 'some';
}

// =============================================================================
// Initial State Factory
// =============================================================================

/**
 * Creates the initial FSM state
 *
 * @param values - Initial selected values
 * @param mode - Selection mode
 * @param totalEnabled - Total number of enabled cards
 * @returns Initial FSM state
 */
export function createInitialCardListFSMState(
  values: string[],
  mode: CardListSelectionMode,
  totalEnabled: number
): CardListFSMState {
  // For 'none' mode, always start with empty selection
  if (mode === 'none') {
    return {
      selectedValues: [],
      visualState: 'none',
    };
  }

  // For 'single' mode, only allow at most one value
  if (mode === 'single') {
    const firstValue = values[0];
    const selectedValues = firstValue !== undefined ? [firstValue] : [];
    return {
      selectedValues,
      visualState: deriveVisualState(selectedValues, totalEnabled),
    };
  }

  // For 'multiple' mode, deduplicate values
  const selectedValues = [...new Set(values)];
  return {
    selectedValues,
    visualState: deriveVisualState(selectedValues, totalEnabled),
  };
}

// =============================================================================
// FSM Reducer
// =============================================================================

/**
 * Pure reducer for CardList FSM
 *
 * Handles all state transitions:
 * - RESET_FROM_PROPS: Sync state with controlled props
 * - SELECT_ITEM: Select a single card (single mode)
 * - TOGGLE_ITEM: Toggle a card's selection (multiple mode)
 * - CLEAR_ALL: Deselect all cards
 * - SELECT_ALL: Select all enabled cards (multiple mode)
 *
 * @param state - Current FSM state
 * @param event - Event to process
 * @returns New FSM state
 */
export function cardListFSMReducer(
  state: CardListFSMState,
  event: CardListFSMEvent
): CardListFSMState {
  switch (event.type) {
    case 'RESET_FROM_PROPS':
      return createInitialCardListFSMState(event.values, event.mode, event.totalEnabled);

    case 'SELECT_ITEM': {
      const { value, totalEnabled } = event;

      // Single selection - replace current selection
      // Note: Do not deselect if clicking the already selected item
      // (radio button behavior - can't unselect by clicking)
      if (state.selectedValues.includes(value)) {
        // Already selected, no change
        return state;
      }

      const selectedValues = [value];
      return {
        selectedValues,
        visualState: deriveVisualState(selectedValues, totalEnabled),
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
        visualState: deriveVisualState(selectedValues, totalEnabled),
      };
    }

    case 'CLEAR_ALL': {
      return {
        selectedValues: [],
        visualState: 'none',
      };
    }

    case 'SELECT_ALL': {
      const selectedValues = [...event.enabledValues];
      return { selectedValues, visualState: deriveVisualState(selectedValues, event.totalEnabled) };
    }
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
  values: string[],
  mode: CardListSelectionMode,
  totalEnabled: number
): ResetFromPropsEvent {
  return { type: 'RESET_FROM_PROPS', values, mode, totalEnabled };
}

/**
 * Creates a SELECT_ITEM event (single mode)
 */
export function selectItemEvent(value: string, totalEnabled: number): SelectItemEvent {
  return { type: 'SELECT_ITEM', value, totalEnabled };
}

/**
 * Creates a TOGGLE_ITEM event (multiple mode)
 */
export function toggleItemEvent(value: string, totalEnabled: number): ToggleItemEvent {
  return { type: 'TOGGLE_ITEM', value, totalEnabled };
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
export function selectAllEvent(enabledValues: string[], totalEnabled: number): SelectAllEvent {
  return { type: 'SELECT_ALL', enabledValues, totalEnabled };
}

// =============================================================================
// Predicates
// =============================================================================

/**
 * Check if no items are selected
 */
export function isNoneSelected(state: CardListFSMState): boolean {
  return state.visualState === 'none';
}

/**
 * Check if exactly one item is selected
 */
export function isOneSelected(state: CardListFSMState): boolean {
  return state.visualState === 'one';
}

/**
 * Check if some items are selected (but not all)
 */
export function isSomeSelected(state: CardListFSMState): boolean {
  return state.visualState === 'some';
}

/**
 * Check if all items are selected
 */
export function isAllSelected(state: CardListFSMState): boolean {
  return state.visualState === 'all';
}

/**
 * Check if a specific value is selected
 */
export function isValueSelected(state: CardListFSMState, value: string): boolean {
  return state.selectedValues.includes(value);
}

/**
 * Get the count of selected items
 */
export function getSelectedCount(state: CardListFSMState): number {
  return state.selectedValues.length;
}
