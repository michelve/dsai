/**
 * Accordion FSM - Finite State Machine for Accordion state management
 *
 * This FSM manages which accordion items are currently expanded, supporting
 * both single-selection (one item at a time) and multiple-selection modes.
 *
 * Unlike Modal/Dropdown FSMs which track visibility states with animations,
 * the Accordion FSM focuses on managing the set of active (expanded) item keys.
 * Individual item animations are handled by CSS transitions.
 *
 * Events:
 * - TOGGLE: Toggle an item's expanded state
 * - EXPAND: Force expand an item
 * - COLLAPSE: Force collapse an item
 * - COLLAPSE_ALL: Collapse all items
 * - RESET_FROM_PROPS: Sync with controlled props
 *
 * Selection Modes:
 * - 'single': Only one item can be expanded at a time
 * - 'multiple': Multiple items can be expanded simultaneously
 */

import type { AccordionSelectionMode } from './Accordion.types';

/**
 * The Accordion FSM state object
 */
export interface AccordionFSMState {
  /**
   * Set of currently active (expanded) eventKeys
   * Using a Set for O(1) lookup and to prevent duplicates
   */
  readonly activeKeys: ReadonlySet<string>;

  /**
   * Selection mode for the accordion
   */
  readonly selectionMode: AccordionSelectionMode;
}

/**
 * Events that trigger state transitions in the Accordion FSM
 */
export type AccordionFSMEvent =
  | { readonly type: 'TOGGLE'; readonly eventKey: string }
  | { readonly type: 'EXPAND'; readonly eventKey: string }
  | { readonly type: 'COLLAPSE'; readonly eventKey: string }
  | { readonly type: 'COLLAPSE_ALL' }
  | { readonly type: 'RESET_FROM_PROPS'; readonly activeKeys: readonly string[] };

/**
 * Add an eventKey to the active set, respecting selection mode
 */
function addKey(state: AccordionFSMState, eventKey: string): AccordionFSMState {
  if (state.selectionMode === 'single') {
    return { ...state, activeKeys: new Set([eventKey]) };
  }
  const newKeys = new Set(state.activeKeys);
  newKeys.add(eventKey);
  return { ...state, activeKeys: newKeys };
}

/**
 * Remove an eventKey from the active set
 */
function removeKey(state: AccordionFSMState, eventKey: string): AccordionFSMState {
  const newKeys = new Set(state.activeKeys);
  newKeys.delete(eventKey);
  return { ...state, activeKeys: newKeys };
}

/**
 * Enforce single-selection mode on a list of keys
 */
function enforceSelectionMode(
  selectionMode: AccordionSelectionMode,
  keys: readonly string[]
): string[] {
  const firstKey = keys[0];
  return selectionMode === 'single' && keys.length > 1 && firstKey !== undefined
    ? [firstKey]
    : [...keys];
}

/**
 * Check if two sets of strings are equal
 */
function areSetsEqual(a: ReadonlySet<string>, b: ReadonlySet<string>): boolean {
  return a.size === b.size && [...b].every((key) => a.has(key));
}

/**
 * Handle RESET_FROM_PROPS: replace activeKeys with provided values
 */
function handleResetFromProps(
  state: AccordionFSMState,
  activeKeys: readonly string[]
): AccordionFSMState {
  const validKeys = enforceSelectionMode(state.selectionMode, activeKeys);
  const newKeysSet = new Set<string>(validKeys);

  if (areSetsEqual(state.activeKeys, newKeysSet)) {
    return state;
  }

  return { ...state, activeKeys: newKeysSet };
}

/**
 * Creates the initial FSM state
 *
 * @param activeKeys - Initially active eventKeys
 * @param selectionMode - Selection mode ('single' or 'multiple')
 * @returns The initial FSM state
 */
export function createInitialAccordionFSMState(
  activeKeys: readonly string[] = [],
  selectionMode: AccordionSelectionMode = 'single'
): AccordionFSMState {
  return {
    activeKeys: new Set(enforceSelectionMode(selectionMode, activeKeys)),
    selectionMode,
  };
}

/**
 * Pure reducer function for the Accordion FSM
 *
 * Transition Rules:
 *
 * TOGGLE (single mode):
 * - If item is expanded: collapse it (activeKeys becomes empty)
 * - If item is collapsed: expand it and collapse all others
 *
 * TOGGLE (multiple mode):
 * - If item is expanded: collapse it
 * - If item is collapsed: expand it (others stay as-is)
 *
 * EXPAND:
 * - In single mode: collapse all others, expand this one
 * - In multiple mode: add to activeKeys (if not already present)
 *
 * COLLAPSE:
 * - Remove eventKey from activeKeys
 *
 * COLLAPSE_ALL:
 * - Clear all activeKeys
 *
 * RESET_FROM_PROPS:
 * - Replace activeKeys with provided values (respecting selection mode)
 *
 * @param state - Current FSM state
 * @param event - Event triggering the transition
 * @returns New FSM state
 */
export function accordionFSMReducer(
  state: AccordionFSMState,
  event: AccordionFSMEvent
): AccordionFSMState {
  switch (event.type) {
    case 'TOGGLE':
      return state.activeKeys.has(event.eventKey)
        ? removeKey(state, event.eventKey)
        : addKey(state, event.eventKey);

    case 'EXPAND':
      return state.activeKeys.has(event.eventKey) ? state : addKey(state, event.eventKey);

    case 'COLLAPSE':
      return state.activeKeys.has(event.eventKey) ? removeKey(state, event.eventKey) : state;

    case 'COLLAPSE_ALL':
      return state.activeKeys.size === 0 ? state : { ...state, activeKeys: new Set() };

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
export function getActiveKeysArray(state: AccordionFSMState): string[] {
  return [...state.activeKeys];
}

/**
 * Check if a specific item is expanded
 *
 * @param state - Current FSM state
 * @param eventKey - The eventKey to check
 * @returns Whether the item is expanded
 */
export function isItemExpanded(state: AccordionFSMState, eventKey: string): boolean {
  return state.activeKeys.has(eventKey);
}

/**
 * Get the visual state for an accordion item (for data-visual-state attribute)
 * Note: Animation states (expanding/collapsing) are managed by CSS transitions,
 * so we only report the logical state here.
 *
 * @param state - Current FSM state
 * @param eventKey - The eventKey to check
 * @returns 'expanded' or 'collapsed'
 */
export function getAccordionItemVisualState(
  state: AccordionFSMState,
  eventKey: string
): 'expanded' | 'collapsed' {
  return state.activeKeys.has(eventKey) ? 'expanded' : 'collapsed';
}
