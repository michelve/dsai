/**
 * Dropdown FSM - Finite State Machine for Dropdown visibility and animation
 *
 * This FSM models the visibility lifecycle of a Dropdown component,
 * including animation states for smooth open/close transitions.
 *
 * States:
 * - closed: Dropdown menu is not rendered, not visible
 * - opening: Dropdown menu is rendering, playing enter animation
 * - open: Dropdown menu is fully visible and interactive
 * - closing: Dropdown menu is playing exit animation
 *
 * Events:
 * - OPEN: Request to open the dropdown
 * - CLOSE: Request to close the dropdown (ESC, click outside, item click)
 * - TOGGLE: Toggle the dropdown state
 * - ANIMATION_END: Animation has completed
 *
 * This FSM enables:
 * - Smooth fade animations between states
 * - Proper keyboard navigation during transitions
 * - Preventing close during opening animation (and vice versa)
 * - Consistent visual state for styling via data-visual-state
 */

/**
 * Visibility states for the Dropdown FSM
 */
export type DropdownVisibilityState = 'closed' | 'opening' | 'open' | 'closing';

/**
 * The Dropdown FSM state object
 */
export interface DropdownFSMState {
  /**
   * Current visibility/animation state
   */
  readonly visibility: DropdownVisibilityState;

  /**
   * Whether the dropdown menu should be rendered in DOM
   * True for: opening, open, closing
   * False for: closed
   */
  readonly shouldRender: boolean;

  /**
   * Whether the dropdown should have the 'show' class for CSS animations
   * True for: open
   * False for: opening, closing, closed
   */
  readonly shouldShow: boolean;

  /**
   * Whether keyboard navigation should be active
   * True for: open
   * False for: opening, closing, closed
   */
  readonly keyboardNavActive: boolean;

  /**
   * Whether click outside should close the dropdown
   * True for: open
   * False for: opening, closing, closed
   */
  readonly clickOutsideActive: boolean;
}

/**
 * Events that trigger state transitions in the Dropdown FSM
 */
export type DropdownFSMEvent =
  | { readonly type: 'OPEN' }
  | { readonly type: 'CLOSE' }
  | { readonly type: 'TOGGLE' }
  | { readonly type: 'ANIMATION_END' };

/**
 * Creates the initial FSM state based on the isOpen prop
 *
 * @param isOpen - Whether the dropdown should initially be open
 * @returns The initial FSM state
 */
export function createInitialDropdownFSMState(isOpen: boolean): DropdownFSMState {
  if (isOpen) {
    // If initially open, skip opening animation and go straight to open
    return {
      visibility: 'open',
      shouldRender: true,
      shouldShow: true,
      keyboardNavActive: true,
      clickOutsideActive: true,
    };
  }

  return {
    visibility: 'closed',
    shouldRender: false,
    shouldShow: false,
    keyboardNavActive: false,
    clickOutsideActive: false,
  };
}

/**
 * Pure reducer function for the Dropdown FSM
 *
 * State Transition Table:
 *
 * | Current State | Event          | Next State | shouldRender | shouldShow | keyboardNav | clickOutside |
 * |---------------|----------------|------------|--------------|------------|-------------|--------------|
 * | closed        | OPEN           | opening    | true         | false      | false       | false        |
 * | closed        | CLOSE          | closed     | false        | false      | false       | false        |
 * | closed        | TOGGLE         | opening    | true         | false      | false       | false        |
 * | closed        | ANIMATION_END  | closed     | false        | false      | false       | false        |
 * | opening       | OPEN           | opening    | true         | false      | false       | false        |
 * | opening       | CLOSE          | closing    | true         | false      | false       | false        |
 * | opening       | TOGGLE         | closing    | true         | false      | false       | false        |
 * | opening       | ANIMATION_END  | open       | true         | true       | true        | true         |
 * | open          | OPEN           | open       | true         | true       | true        | true         |
 * | open          | CLOSE          | closing    | true         | false      | false       | false        |
 * | open          | TOGGLE         | closing    | true         | false      | false       | false        |
 * | open          | ANIMATION_END  | open       | true         | true       | true        | true         |
 * | closing       | OPEN           | opening    | true         | false      | false       | false        |
 * | closing       | CLOSE          | closing    | true         | false      | false       | false        |
 * | closing       | TOGGLE         | opening    | true         | false      | false       | false        |
 * | closing       | ANIMATION_END  | closed     | false        | false      | false       | false        |
 *
 * @param state - Current FSM state
 * @param event - Event triggering the transition
 * @returns New FSM state
 */
/** Shared state constants to reduce object allocation */
const DROPDOWN_OPENING: DropdownFSMState = {
  visibility: 'opening',
  shouldRender: true,
  shouldShow: false,
  keyboardNavActive: false,
  clickOutsideActive: false,
};

const DROPDOWN_CLOSING: DropdownFSMState = {
  visibility: 'closing',
  shouldRender: true,
  shouldShow: false,
  keyboardNavActive: false,
  clickOutsideActive: false,
};

const DROPDOWN_OPEN: DropdownFSMState = {
  visibility: 'open',
  shouldRender: true,
  shouldShow: true,
  keyboardNavActive: true,
  clickOutsideActive: true,
};

const DROPDOWN_CLOSED: DropdownFSMState = {
  visibility: 'closed',
  shouldRender: false,
  shouldShow: false,
  keyboardNavActive: false,
  clickOutsideActive: false,
};

/**
 * Handle events when dropdown is in 'closed' state
 */
function handleClosedEvent(state: DropdownFSMState, event: DropdownFSMEvent): DropdownFSMState {
  switch (event.type) {
    case 'OPEN':
    case 'TOGGLE':
      return DROPDOWN_OPENING;
    case 'CLOSE':
    case 'ANIMATION_END':
      return state;
    default:
      return state;
  }
}

/**
 * Handle events when dropdown is in 'opening' state
 */
function handleOpeningEvent(state: DropdownFSMState, event: DropdownFSMEvent): DropdownFSMState {
  switch (event.type) {
    case 'OPEN':
      return state;
    case 'CLOSE':
    case 'TOGGLE':
      return DROPDOWN_CLOSING;
    case 'ANIMATION_END':
      return DROPDOWN_OPEN;
    default:
      return state;
  }
}

/**
 * Handle events when dropdown is in 'open' state
 */
function handleOpenEvent(state: DropdownFSMState, event: DropdownFSMEvent): DropdownFSMState {
  switch (event.type) {
    case 'OPEN':
    case 'ANIMATION_END':
      return state;
    case 'CLOSE':
    case 'TOGGLE':
      return DROPDOWN_CLOSING;
    default:
      return state;
  }
}

/**
 * Handle events when dropdown is in 'closing' state
 */
function handleClosingEvent(state: DropdownFSMState, event: DropdownFSMEvent): DropdownFSMState {
  switch (event.type) {
    case 'OPEN':
    case 'TOGGLE':
      return DROPDOWN_OPENING;
    case 'CLOSE':
      return state;
    case 'ANIMATION_END':
      return DROPDOWN_CLOSED;
    default:
      return state;
  }
}

export function dropdownFSMReducer(
  state: DropdownFSMState,
  event: DropdownFSMEvent
): DropdownFSMState {
  switch (state.visibility) {
    case 'closed':
      return handleClosedEvent(state, event);
    case 'opening':
      return handleOpeningEvent(state, event);
    case 'open':
      return handleOpenEvent(state, event);
    case 'closing':
      return handleClosingEvent(state, event);
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
export function getDropdownVisualState(state: DropdownFSMState): string {
  return state.visibility;
}
