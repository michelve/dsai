/**
 * Alert FSM - Finite State Machine for Alert visibility/dismissal
 *
 * This FSM models the visibility lifecycle of an Alert component,
 * respecting the existing show, dismissible, and onClose semantics.
 *
 * States:
 * - visible: Alert is rendered and visible to the user
 * - dismissing: Alert is playing the fade-out exit animation
 * - hidden: Alert is not rendered (returns null)
 *
 * Events:
 * - SHOW: External request to show (show prop becomes true)
 * - HIDE: External request to hide (show prop becomes false)
 * - DISMISS_CLICK: Close button clicked
 * - DISMISS_ESCAPE: Escape key pressed when dismissible
 * - AUTO_DISMISS_TIMEOUT: Auto-dismiss timer expired
 * - ANIMATION_END: Dismiss animation completed
 */

/**
 * Visibility states for the Alert FSM
 */
export type AlertVisibilityState = 'visible' | 'dismissing' | 'hidden';

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
  | { readonly type: 'DISMISS_ESCAPE' }
  | { readonly type: 'AUTO_DISMISS_TIMEOUT' }
  | { readonly type: 'ANIMATION_END' };

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
 *   - HIDE → "hidden" (immediate, external control)
 *   - DISMISS_CLICK → "dismissing"
 *   - DISMISS_ESCAPE → "dismissing"
 *   - AUTO_DISMISS_TIMEOUT → "dismissing"
 *   - SHOW → stays "visible" (idempotent)
 *   - ANIMATION_END → stays "visible" (no-op)
 *
 * - From "dismissing":
 *   - ANIMATION_END → "hidden"
 *   - SHOW → "visible" (cancel animation, re-show)
 *   - HIDE → "hidden" (force hide)
 *   - DISMISS_* / AUTO_DISMISS_TIMEOUT → stays "dismissing"
 *
 * - From "hidden":
 *   - SHOW → "visible"
 *   - HIDE → stays "hidden" (idempotent)
 *   - DISMISS_* / AUTO_DISMISS_TIMEOUT → stays "hidden" (no-op)
 *   - ANIMATION_END → stays "hidden" (no-op)
 *
 * @param state - Current FSM state
 * @param event - Event triggering the transition
 * @returns New FSM state
 */
/**
 * Transition map: [currentVisibility][eventType] → next visibility (or undefined = stay)
 */
const TRANSITIONS: Record<AlertVisibilityState, Partial<Record<AlertFSMEvent['type'], AlertVisibilityState>>> = {
  visible: {
    HIDE: 'hidden',
    DISMISS_CLICK: 'dismissing',
    DISMISS_ESCAPE: 'dismissing',
    AUTO_DISMISS_TIMEOUT: 'dismissing',
  },
  dismissing: {
    ANIMATION_END: 'hidden',
    SHOW: 'visible',
    HIDE: 'hidden',
  },
  hidden: {
    SHOW: 'visible',
  },
};

export function alertFSMReducer(state: AlertFSMState, event: AlertFSMEvent): AlertFSMState {
  const nextVisibility = TRANSITIONS[state.visibility]?.[event.type];
  return nextVisibility ? { visibility: nextVisibility } : state;
}
