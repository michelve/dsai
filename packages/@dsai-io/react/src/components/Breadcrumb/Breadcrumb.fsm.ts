/**
 * @file Breadcrumb FSM (Finite State Machine)
 * @description State machine for managing Breadcrumb expand/collapse behavior
 *
 * ## State Diagram
 *
 * ```
 *     ┌─────────────────────────────────────────┐
 *     │                                         │
 *     │  RESET_FROM_PROPS (controlledExpanded)  │
 *     │                                         │
 *     ▼                                         │
 * ┌───────────┐    EXPAND (click)         ┌─────┴─────┐
 * │ collapsed │ ─────────────────────────▶│  expanded │
 * └───────────┘                           └───────────┘
 *     ▲                                         │
 *     │                                         │
 *     └─── RESET_FROM_PROPS (!controlledExpanded) ───┘
 * ```
 *
 * ## States
 * - `collapsed`: Breadcrumb is showing ellipsis (default)
 * - `expanded`: Breadcrumb is showing all items
 *
 * ## Events
 * - `EXPAND`: User clicks ellipsis to show all items
 * - `RESET_FROM_PROPS`: Sync state with controlled prop
 */

// ============================================================================
// State Types
// ============================================================================

/**
 * Possible visual states for the Breadcrumb expand behavior
 */
export type BreadcrumbExpandState = 'collapsed' | 'expanded';

/**
 * Complete FSM state for Breadcrumb
 */
export interface BreadcrumbFSMState {
  /** Current expand/collapse state */
  expandState: BreadcrumbExpandState;
  /** Whether the expanded state is controlled externally */
  isControlled: boolean;
}

// ============================================================================
// Event Types
// ============================================================================

/**
 * User clicks the ellipsis button to expand
 */
export interface ExpandEvent {
  type: 'EXPAND';
}

/**
 * Sync state from controlled prop changes
 */
export interface ResetFromPropsEvent {
  type: 'RESET_FROM_PROPS';
  payload: {
    controlledExpanded: boolean | undefined;
  };
}

/**
 * Union of all possible FSM events
 */
export type BreadcrumbFSMEvent = ExpandEvent | ResetFromPropsEvent;

// ============================================================================
// Initial State Factory
// ============================================================================

/**
 * Creates the initial FSM state based on props
 *
 * @param controlledExpanded - External controlled expanded state
 * @returns Initial FSM state
 *
 * @example
 * ```tsx
 * // Uncontrolled - starts collapsed
 * const state = createInitialBreadcrumbFSMState(undefined);
 * // { expandState: 'collapsed', isControlled: false }
 *
 * // Controlled - starts expanded
 * const state = createInitialBreadcrumbFSMState(true);
 * // { expandState: 'expanded', isControlled: true }
 * ```
 */
export function createInitialBreadcrumbFSMState(
  controlledExpanded: boolean | undefined
): BreadcrumbFSMState {
  const isControlled = controlledExpanded !== undefined;

  return {
    expandState: controlledExpanded ? 'expanded' : 'collapsed',
    isControlled,
  };
}

// ============================================================================
// State Transition Logic
// ============================================================================

/**
 * Pure reducer function for Breadcrumb FSM state transitions
 *
 * ## Transition Rules
 *
 * | Current State | Event           | Next State | Condition               |
 * |---------------|-----------------|------------|-------------------------|
 * | collapsed     | EXPAND          | expanded   | !isControlled           |
 * | collapsed     | EXPAND          | collapsed  | isControlled (no-op)    |
 * | collapsed     | RESET_FROM_PROPS| expanded   | controlledExpanded=true |
 * | expanded      | RESET_FROM_PROPS| collapsed  | controlledExpanded=false|
 * | any           | RESET_FROM_PROPS| synced     | Updates isControlled    |
 *
 * @param state - Current FSM state
 * @param event - Event to process
 * @returns New FSM state (immutable)
 */
export function breadcrumbFSMReducer(
  state: BreadcrumbFSMState,
  event: BreadcrumbFSMEvent
): BreadcrumbFSMState {
  switch (event.type) {
    case 'EXPAND': {
      // In controlled mode, parent manages state via RESET_FROM_PROPS
      // We still transition to expanded in uncontrolled mode
      if (state.isControlled) {
        return state;
      }

      // Already expanded - no change needed
      if (state.expandState === 'expanded') {
        return state;
      }

      return {
        ...state,
        expandState: 'expanded',
      };
    }

    case 'RESET_FROM_PROPS': {
      const { controlledExpanded } = event.payload;
      const isControlled = controlledExpanded !== undefined;
      const newExpandState: BreadcrumbExpandState = controlledExpanded ? 'expanded' : 'collapsed';

      // Only return new state if something changed
      if (state.isControlled === isControlled && state.expandState === newExpandState) {
        return state;
      }

      return {
        expandState: newExpandState,
        isControlled,
      };
    }

    default: {
      // Exhaustive check - TypeScript will error if a case is missing
      const _exhaustiveCheck: never = event;
      return _exhaustiveCheck;
    }
  }
}

// ============================================================================
// State Predicates
// ============================================================================

/**
 * Check if breadcrumb is in collapsed state
 */
export function isCollapsed(state: BreadcrumbFSMState): boolean {
  return state.expandState === 'collapsed';
}

/**
 * Check if breadcrumb is in expanded state
 */
export function isExpanded(state: BreadcrumbFSMState): boolean {
  return state.expandState === 'expanded';
}

// ============================================================================
// Event Creators
// ============================================================================

/**
 * Create an EXPAND event
 */
export function expandEvent(): ExpandEvent {
  return { type: 'EXPAND' };
}

/**
 * Create a RESET_FROM_PROPS event
 */
export function resetFromPropsEvent(controlledExpanded: boolean | undefined): ResetFromPropsEvent {
  return {
    type: 'RESET_FROM_PROPS',
    payload: { controlledExpanded },
  };
}
