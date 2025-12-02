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
export function dropdownFSMReducer(
  state: DropdownFSMState,
  event: DropdownFSMEvent
): DropdownFSMState {
  switch (state.visibility) {
    case 'closed':
      switch (event.type) {
        case 'OPEN':
        case 'TOGGLE':
          return {
            visibility: 'opening',
            shouldRender: true,
            shouldShow: false,
            keyboardNavActive: false,
            clickOutsideActive: false,
          };
        case 'CLOSE':
        case 'ANIMATION_END':
          // Already closed, stay closed (idempotent)
          return state;
        default:
          return state;
      }

    case 'opening':
      switch (event.type) {
        case 'OPEN':
          // Already opening, stay opening (idempotent)
          return state;
        case 'CLOSE':
        case 'TOGGLE':
          // User requested close during opening, go to closing
          return {
            visibility: 'closing',
            shouldRender: true,
            shouldShow: false,
            keyboardNavActive: false,
            clickOutsideActive: false,
          };
        case 'ANIMATION_END':
          // Opening animation finished, now fully open
          return {
            visibility: 'open',
            shouldRender: true,
            shouldShow: true,
            keyboardNavActive: true,
            clickOutsideActive: true,
          };
        default:
          return state;
      }

    case 'open':
      switch (event.type) {
        case 'OPEN':
        case 'ANIMATION_END':
          // Already open, stay open (idempotent)
          return state;
        case 'CLOSE':
        case 'TOGGLE':
          // User requested close
          return {
            visibility: 'closing',
            shouldRender: true,
            shouldShow: false,
            keyboardNavActive: false,
            clickOutsideActive: false,
          };
        default:
          return state;
      }

    case 'closing':
      switch (event.type) {
        case 'OPEN':
        case 'TOGGLE':
          // User requested open during closing, go back to opening
          return {
            visibility: 'opening',
            shouldRender: true,
            shouldShow: false,
            keyboardNavActive: false,
            clickOutsideActive: false,
          };
        case 'CLOSE':
          // Already closing, stay closing (idempotent)
          return state;
        case 'ANIMATION_END':
          // Closing animation finished, now fully closed
          return {
            visibility: 'closed',
            shouldRender: false,
            shouldShow: false,
            keyboardNavActive: false,
            clickOutsideActive: false,
          };
        default:
          return state;
      }

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
