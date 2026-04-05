import type { ToastFSMEvent, ToastFSMState, ToastVisualState } from './Toast.types';

/**
 * Create initial FSM state for the Toast
 *
 * @param initialShow - Whether the toast should initially be visible
 * @returns Initial FSM state
 */
export function createInitialToastFSMState(initialShow: boolean): ToastFSMState {
  if (initialShow) {
    return {
      visibility: 'entering',
      shouldRender: true,
    };
  }
  return {
    visibility: 'hidden',
    shouldRender: false,
  };
}

/**
 * Toast FSM Reducer
 *
 * State machine for managing toast visibility with animation support.
 *
 * States:
 * - hidden: Toast is not rendered
 * - entering: Toast is animating in (fade-in/slide-in)
 * - visible: Toast is fully visible
 * - exiting: Toast is animating out (fade-out/slide-out)
 *
 * Transitions:
 * - hidden + SHOW -> entering (start show animation)
 * - entering + ANIMATION_END -> visible (show animation complete)
 * - entering + DISMISS -> exiting (interrupted, start hide)
 * - visible + HIDE -> exiting (start hide animation)
 * - visible + DISMISS -> exiting (user dismissed)
 * - exiting + ANIMATION_END -> hidden (hide animation complete)
 * - exiting + SHOW -> entering (re-show while exiting)
 *
 * @param state - Current FSM state
 * @param event - Event to process
 * @returns New FSM state
 */
/**
 * Handle events when toast is in 'hidden' state
 */
function handleToastHiddenEvent(state: ToastFSMState, event: ToastFSMEvent): ToastFSMState {
  if (event.type === 'SHOW') {
    return { visibility: 'entering', shouldRender: true };
  }
  return state;
}

/**
 * Handle events when toast is in 'entering' state
 */
function handleToastEnteringEvent(state: ToastFSMState, event: ToastFSMEvent): ToastFSMState {
  if (event.type === 'ANIMATION_END') {
    return { visibility: 'visible', shouldRender: true };
  }
  if (event.type === 'HIDE' || event.type === 'DISMISS') {
    return { visibility: 'exiting', shouldRender: true };
  }
  return state;
}

/**
 * Handle events when toast is in 'visible' state
 */
function handleToastVisibleEvent(state: ToastFSMState, event: ToastFSMEvent): ToastFSMState {
  if (event.type === 'HIDE' || event.type === 'DISMISS') {
    return { visibility: 'exiting', shouldRender: true };
  }
  return state;
}

/**
 * Handle events when toast is in 'exiting' state
 */
function handleToastExitingEvent(state: ToastFSMState, event: ToastFSMEvent): ToastFSMState {
  if (event.type === 'ANIMATION_END') {
    return { visibility: 'hidden', shouldRender: false };
  }
  if (event.type === 'SHOW') {
    return { visibility: 'entering', shouldRender: true };
  }
  return state;
}

export function toastFSMReducer(state: ToastFSMState, event: ToastFSMEvent): ToastFSMState {
  switch (state.visibility) {
    case 'hidden':
      return handleToastHiddenEvent(state, event);
    case 'entering':
      return handleToastEnteringEvent(state, event);
    case 'visible':
      return handleToastVisibleEvent(state, event);
    case 'exiting':
      return handleToastExitingEvent(state, event);
    default:
      return state;
  }
}

/**
 * Get visual state string for data-visual-state attribute
 *
 * Maps FSM visibility to user-friendly visual state names:
 * - hidden -> 'hidden'
 * - entering -> 'showing'
 * - visible -> 'visible'
 * - exiting -> 'hiding'
 *
 * @param state - Current FSM state
 * @returns Visual state string for CSS/testing
 */
export function getToastVisualState(state: ToastFSMState): ToastVisualState {
  switch (state.visibility) {
    case 'hidden':
      return 'hidden';
    case 'entering':
      return 'showing';
    case 'visible':
      return 'visible';
    case 'exiting':
      return 'hiding';
    default:
      return 'hidden';
  }
}
