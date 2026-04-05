/**
 * Modal FSM - Finite State Machine for Modal visibility and animation
 *
 * This FSM models the visibility lifecycle of a Modal component,
 * including animation states for smooth open/close transitions.
 *
 * States:
 * - closed: Modal is not rendered, not visible
 * - opening: Modal is rendering, playing enter animation
 * - open: Modal is fully visible and interactive
 * - closing: Modal is playing exit animation
 *
 * Events:
 * - OPEN: Request to open the modal
 * - CLOSE: Request to close the modal (user action: ESC, backdrop click, close button)
 * - ANIMATION_END: Animation has completed
 *
 * This FSM enables:
 * - Smooth fade/slide animations between states
 * - Proper focus management during transitions
 * - Preventing close during opening animation (and vice versa)
 */

/**
 * Visibility states for the Modal FSM
 */
export type ModalVisibilityState = 'closed' | 'opening' | 'open' | 'closing';

/**
 * The Modal FSM state object
 */
export interface ModalFSMState {
  /**
   * Current visibility/animation state
   */
  readonly visibility: ModalVisibilityState;

  /**
   * Whether the modal should be rendered in DOM
   * True for: opening, open, closing
   * False for: closed
   */
  readonly shouldRender: boolean;

  /**
   * Whether the modal should have the 'show' class for CSS animations
   * True for: open
   * False for: opening, closing, closed
   */
  readonly shouldShow: boolean;

  /**
   * Whether focus trap should be active
   * True for: open
   * False for: opening, closing, closed
   */
  readonly focusTrapActive: boolean;

  /**
   * Whether scroll lock should be active
   * True for: opening, open, closing
   * False for: closed
   */
  readonly scrollLockActive: boolean;
}

/**
 * Events that trigger state transitions in the Modal FSM
 */
export type ModalFSMEvent =
  | { readonly type: 'OPEN' }
  | { readonly type: 'CLOSE' }
  | { readonly type: 'ANIMATION_END' };

/**
 * Creates the initial FSM state based on the isOpen prop
 *
 * @param isOpen - Whether the modal should initially be open
 * @returns The initial FSM state
 */
export function createInitialModalFSMState(isOpen: boolean): ModalFSMState {
  if (isOpen) {
    // If initially open, skip opening animation and go straight to open
    return {
      visibility: 'open',
      shouldRender: true,
      shouldShow: true,
      focusTrapActive: true,
      scrollLockActive: true,
    };
  }

  return {
    visibility: 'closed',
    shouldRender: false,
    shouldShow: false,
    focusTrapActive: false,
    scrollLockActive: false,
  };
}

/**
 * Pure reducer function for the Modal FSM
 *
 * State Transition Table:
 *
 * | Current State | Event          | Next State | shouldRender | shouldShow | focusTrap | scrollLock |
 * |---------------|----------------|------------|--------------|------------|-----------|------------|
 * | closed        | OPEN           | opening    | true         | false      | false     | true       |
 * | closed        | CLOSE          | closed     | false        | false      | false     | false      |
 * | closed        | ANIMATION_END  | closed     | false        | false      | false     | false      |
 * | opening       | OPEN           | opening    | true         | false      | false     | true       |
 * | opening       | CLOSE          | closing    | true         | false      | false     | true       |
 * | opening       | ANIMATION_END  | open       | true         | true       | true      | true       |
 * | open          | OPEN           | open       | true         | true       | true      | true       |
 * | open          | CLOSE          | closing    | true         | false      | false     | true       |
 * | open          | ANIMATION_END  | open       | true         | true       | true      | true       |
 * | closing       | OPEN           | opening    | true         | false      | false     | true       |
 * | closing       | CLOSE          | closing    | true         | false      | false     | true       |
 * | closing       | ANIMATION_END  | closed     | false        | false      | false     | false      |
 *
 * @param state - Current FSM state
 * @param event - Event triggering the transition
 * @returns New FSM state
 */
/** Shared state constants */
const MODAL_OPENING: ModalFSMState = {
  visibility: 'opening',
  shouldRender: true,
  shouldShow: false,
  focusTrapActive: false,
  scrollLockActive: true,
};

const MODAL_CLOSING: ModalFSMState = {
  visibility: 'closing',
  shouldRender: true,
  shouldShow: false,
  focusTrapActive: false,
  scrollLockActive: true,
};

const MODAL_OPEN: ModalFSMState = {
  visibility: 'open',
  shouldRender: true,
  shouldShow: true,
  focusTrapActive: true,
  scrollLockActive: true,
};

const MODAL_CLOSED: ModalFSMState = {
  visibility: 'closed',
  shouldRender: false,
  shouldShow: false,
  focusTrapActive: false,
  scrollLockActive: false,
};

/**
 * Handle events when modal is in 'closed' state
 */
function handleModalClosedEvent(state: ModalFSMState, event: ModalFSMEvent): ModalFSMState {
  switch (event.type) {
    case 'OPEN':
      return MODAL_OPENING;
    case 'CLOSE':
    case 'ANIMATION_END':
      return state;
    default:
      return state;
  }
}

/**
 * Handle events when modal is in 'opening' state
 */
function handleModalOpeningEvent(state: ModalFSMState, event: ModalFSMEvent): ModalFSMState {
  switch (event.type) {
    case 'OPEN':
      return state;
    case 'CLOSE':
      return MODAL_CLOSING;
    case 'ANIMATION_END':
      return MODAL_OPEN;
    default:
      return state;
  }
}

/**
 * Handle events when modal is in 'open' state
 */
function handleModalOpenEvent(state: ModalFSMState, event: ModalFSMEvent): ModalFSMState {
  switch (event.type) {
    case 'OPEN':
    case 'ANIMATION_END':
      return state;
    case 'CLOSE':
      return MODAL_CLOSING;
    default:
      return state;
  }
}

/**
 * Handle events when modal is in 'closing' state
 */
function handleModalClosingEvent(state: ModalFSMState, event: ModalFSMEvent): ModalFSMState {
  switch (event.type) {
    case 'OPEN':
      return MODAL_OPENING;
    case 'CLOSE':
      return state;
    case 'ANIMATION_END':
      return MODAL_CLOSED;
    default:
      return state;
  }
}

export function modalFSMReducer(state: ModalFSMState, event: ModalFSMEvent): ModalFSMState {
  switch (state.visibility) {
    case 'closed':
      return handleModalClosedEvent(state, event);
    case 'opening':
      return handleModalOpeningEvent(state, event);
    case 'open':
      return handleModalOpenEvent(state, event);
    case 'closing':
      return handleModalClosingEvent(state, event);
    default:
      return state;
  }
}

/**
 * Compute the data-visual-state attribute value from FSM state
 *
 * @param state - Current FSM state
 * @returns String for data-visual-state attribute
 */
export function getModalVisualState(state: ModalFSMState): string {
  return state.visibility;
}
