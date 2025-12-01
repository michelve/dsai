/**
 * Alert FSM - Finite State Machine for Alert visibility/dismissal
 *
 * This FSM models the visibility lifecycle of an Alert component,
 * respecting the existing show, dismissible, and onClose semantics.
 *
 * States:
 * - visible: Alert is rendered and visible to the user
 * - hidden: Alert is not rendered (returns null)
 *
 * Events:
 * - SHOW: External request to show (show prop becomes true)
 * - HIDE: External request to hide (show prop becomes false)
 * - DISMISS_CLICK: Close button clicked
 * - DISMISS_ESCAPE: Escape key pressed when dismissible
 */

/**
 * Visibility states for the Alert FSM
 */
export type AlertVisibilityState = 'visible' | 'hidden';

/**
 * The Alert FSM state object
 */
export interface AlertFSMState {
  readonly visibility: AlertVisibilityState;
}

/**
 * Events that trigger state transitions in the Alert FSM
 */
export type AlertFSMEvent =
  | { readonly type: 'SHOW' }
  | { readonly type: 'HIDE' }
  | { readonly type: 'DISMISS_CLICK' }
  | { readonly type: 'DISMISS_ESCAPE' };

/**
 * Creates the initial FSM state based on the show prop
 *
 * @param show - Whether the alert should initially be visible
 * @returns The initial FSM state
 */
export function createInitialAlertFSMState(show: boolean): AlertFSMState {
  return {
    visibility: show ? 'visible' : 'hidden',
  };
}

/**
 * Pure reducer function for the Alert FSM
 *
 * Transitions:
 * - From "visible":
 *   - HIDE → "hidden"
 *   - DISMISS_CLICK → "hidden"
 *   - DISMISS_ESCAPE → "hidden"
 *   - SHOW → stays "visible" (idempotent)
 *
 * - From "hidden":
 *   - SHOW → "visible"
 *   - HIDE → stays "hidden" (idempotent)
 *   - DISMISS_* → stays "hidden" (no-op)
 *
 * @param state - Current FSM state
 * @param event - Event triggering the transition
 * @returns New FSM state
 */
export function alertFSMReducer(state: AlertFSMState, event: AlertFSMEvent): AlertFSMState {
  switch (state.visibility) {
    case 'visible':
      switch (event.type) {
        case 'HIDE':
        case 'DISMISS_CLICK':
        case 'DISMISS_ESCAPE':
          return { visibility: 'hidden' };
        case 'SHOW':
          // Already visible, stay visible (idempotent)
          return state;
        default:
          return state;
      }

    case 'hidden':
      switch (event.type) {
        case 'SHOW':
          return { visibility: 'visible' };
        case 'HIDE':
        case 'DISMISS_CLICK':
        case 'DISMISS_ESCAPE':
          // Already hidden, stay hidden (no-op)
          return state;
        default:
          return state;
      }

    default:
      return state;
  }
}
