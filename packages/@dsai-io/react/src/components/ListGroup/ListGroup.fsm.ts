/**
 * ListGroup FSM - Finite State Machine for ListGroup selection state management
 *
 * This FSM manages which list items are currently active/selected, supporting
 * both single-selection (one item at a time) and multiple-selection modes.
 *
 * Events:
 * - TOGGLE: Toggle an item's selected state
 * - SELECT: Force select an item
 * - DESELECT: Force deselect an item
 * - RESET_FROM_PROPS: Sync with controlled props
 *
 * Selection Modes:
 * - 'single': Only one item can be selected at a time; toggling the active item is a no-op
 * - 'multiple': Multiple items can be selected simultaneously
 */

import type { ListGroupSelectionMode } from './ListGroup.types';

/**
 * The ListGroup FSM state object
 */
export interface ListGroupFSMState {
  /**
   * Set of currently active (selected) eventKeys
   * Using a Set for O(1) lookup and to prevent duplicates
   */
  readonly activeKeys: ReadonlySet<string>;

  /**
   * Selection mode for the list group
   */
  readonly selectionMode: ListGroupSelectionMode;
}

/**
 * Events that trigger state transitions in the ListGroup FSM
 */
export type ListGroupFSMEvent =
  | { readonly type: 'TOGGLE'; readonly eventKey: string }
  | { readonly type: 'SELECT'; readonly eventKey: string }
  | { readonly type: 'DESELECT'; readonly eventKey: string }
  | { readonly type: 'RESET_FROM_PROPS'; readonly activeKeys: readonly string[] };

/**
 * Creates the initial FSM state
 *
 * @param activeKeys - Initially active eventKeys
 * @param selectionMode - Selection mode ('single' or 'multiple')
 * @returns The initial FSM state
 */
export function createInitialListGroupFSMState(
  activeKeys: readonly string[] = [],
  selectionMode: ListGroupSelectionMode = 'single',
): ListGroupFSMState {
  const validKeys = clampToSelectionMode(activeKeys, selectionMode);
  return { activeKeys: new Set(validKeys), selectionMode };
}

// =============================================================================
// Per-state handlers (extracted to reduce cognitive complexity)
// =============================================================================

function handleToggle(state: ListGroupFSMState, eventKey: string): ListGroupFSMState {
  if (state.selectionMode === 'single') {
    return state.activeKeys.has(eventKey)
      ? state
      : { ...state, activeKeys: new Set([eventKey]) };
  }
  const newKeys = new Set(state.activeKeys);
  if (newKeys.has(eventKey)) {
    newKeys.delete(eventKey);
  } else {
    newKeys.add(eventKey);
  }
  return { ...state, activeKeys: newKeys };
}

function handleSelect(state: ListGroupFSMState, eventKey: string): ListGroupFSMState {
  if (state.activeKeys.has(eventKey)) {
    return state;
  }
  if (state.selectionMode === 'single') {
    return { ...state, activeKeys: new Set([eventKey]) };
  }
  const newKeys = new Set(state.activeKeys);
  newKeys.add(eventKey);
  return { ...state, activeKeys: newKeys };
}

function handleDeselect(state: ListGroupFSMState, eventKey: string): ListGroupFSMState {
  if (!state.activeKeys.has(eventKey)) {
    return state;
  }
  const newKeys = new Set(state.activeKeys);
  newKeys.delete(eventKey);
  return { ...state, activeKeys: newKeys };
}

function handleResetFromProps(
  state: ListGroupFSMState,
  activeKeys: readonly string[],
): ListGroupFSMState {
  const validKeys = clampToSelectionMode(activeKeys, state.selectionMode);
  const newKeysSet = new Set<string>(validKeys);
  const isUnchanged =
    newKeysSet.size === state.activeKeys.size &&
    [...newKeysSet].every((key) => state.activeKeys.has(key));
  return isUnchanged ? state : { ...state, activeKeys: newKeysSet };
}

/**
 * Clamp an array of keys to respect the current selection mode.
 * In single mode with multiple keys, only the first is kept.
 */
function clampToSelectionMode(
  keys: readonly string[],
  mode: ListGroupSelectionMode,
): string[] {
  const firstKey = keys[0];
  if (mode === 'single' && keys.length > 1 && firstKey !== undefined) {
    return [firstKey];
  }
  return [...keys];
}

// =============================================================================
// Reducer
// =============================================================================

/**
 * Pure reducer function for the ListGroup FSM
 *
 * Transition Rules:
 *
 * TOGGLE (single mode):
 * - If item is already active: no-op (WAI-ARIA listbox keeps selection)
 * - If item is inactive: select it, deselect all others
 *
 * TOGGLE (multiple mode):
 * - If item is active: deselect it
 * - If item is inactive: add to selection
 *
 * SELECT:
 * - In single mode: replace selection with this item
 * - In multiple mode: add to activeKeys (if not already present)
 *
 * DESELECT:
 * - Remove eventKey from activeKeys; no-op if not present
 *
 * RESET_FROM_PROPS:
 * - Replace activeKeys with provided values (respecting selection mode)
 *
 * @param state - Current FSM state
 * @param event - Event triggering the transition
 * @returns New FSM state
 */
export function listGroupFSMReducer(
  state: ListGroupFSMState,
  event: ListGroupFSMEvent,
): ListGroupFSMState {
  switch (event.type) {
    case 'TOGGLE':
      return handleToggle(state, event.eventKey);
    case 'SELECT':
      return handleSelect(state, event.eventKey);
    case 'DESELECT':
      return handleDeselect(state, event.eventKey);
    case 'RESET_FROM_PROPS':
      return handleResetFromProps(state, event.activeKeys);
    default:
      return state;
  }
}

/**
 * Get the list of active keys as an array (for callbacks and controlled mode)
 *
 * @param state - Current FSM state
 * @returns Array of active eventKeys
 */
export function getActiveKeysArray(state: ListGroupFSMState): string[] {
  return [...state.activeKeys];
}

/**
 * Check if a specific item is active/selected
 *
 * @param state - Current FSM state
 * @param eventKey - The eventKey to check
 * @returns Whether the item is active
 */
export function isItemActive(state: ListGroupFSMState, eventKey: string): boolean {
  return state.activeKeys.has(eventKey);
}
