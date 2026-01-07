/**
 * Sheet FSM - Finite State Machine for Sheet visibility and animation
 *
 * This FSM models the visibility lifecycle of a Sheet component,
 * including animation states for smooth open/close transitions.
 *
 * States:
 * - closed: Sheet is not rendered, not visible
 * - opening: Sheet is rendering, playing enter animation (slide-in)
 * - open: Sheet is fully visible and interactive
 * - closing: Sheet is playing exit animation (slide-out)
 *
 * Events:
 * - OPEN: Request to open the sheet
 * - CLOSE: Request to close the sheet (user action: ESC, backdrop click, close button)
 * - ANIMATION_END: Animation has completed
 *
 * This FSM enables:
 * - Smooth slide animations between states
 * - Proper focus management during transitions
 * - Preventing close during opening animation (and vice versa)
 * - Deterministic, testable state transitions
 *
 * @packageDocumentation
 */

/**
 * Visibility states for the Sheet FSM
 */
export type SheetVisibilityState = 'closed' | 'opening' | 'open' | 'closing';

/**
 * The Sheet FSM state object
 */
export interface SheetFSMState {
  /**
   * Current visibility/animation state
   */
  readonly visibility: SheetVisibilityState;

  /**
   * Whether the sheet should be rendered in DOM
   * True for: opening, open, closing
   * False for: closed
   */
  readonly shouldRender: boolean;

  /**
   * Whether the sheet should have the 'show' class for CSS animations
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
 * Events that trigger state transitions in the Sheet FSM
 */
export type SheetFSMEvent =
  | { readonly type: 'OPEN' }
  | { readonly type: 'CLOSE' }
  | { readonly type: 'ANIMATION_END' };

/**
 * Creates the initial FSM state based on the isOpen prop
 *
 * @param isOpen - Whether the sheet should initially be open
 * @returns The initial FSM state
 */
export function createInitialSheetFSMState(isOpen: boolean): SheetFSMState {
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
 * Pure reducer function for the Sheet FSM
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
export function sheetFSMReducer(state: SheetFSMState, event: SheetFSMEvent): SheetFSMState {
  switch (state.visibility) {
    case 'closed':
      switch (event.type) {
        case 'OPEN':
          return {
            visibility: 'opening',
            shouldRender: true,
            shouldShow: false,
            focusTrapActive: false,
            scrollLockActive: true,
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
          // User requested close during opening, go to closing
          return {
            visibility: 'closing',
            shouldRender: true,
            shouldShow: false,
            focusTrapActive: false,
            scrollLockActive: true,
          };
        case 'ANIMATION_END':
          // Opening animation finished, now fully open
          return {
            visibility: 'open',
            shouldRender: true,
            shouldShow: true,
            focusTrapActive: true,
            scrollLockActive: true,
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
          // User requested close
          return {
            visibility: 'closing',
            shouldRender: true,
            shouldShow: false,
            focusTrapActive: false,
            scrollLockActive: true,
          };
        default:
          return state;
      }

    case 'closing':
      switch (event.type) {
        case 'OPEN':
          // User requested open during closing, go back to opening
          return {
            visibility: 'opening',
            shouldRender: true,
            shouldShow: false,
            focusTrapActive: false,
            scrollLockActive: true,
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
            focusTrapActive: false,
            scrollLockActive: false,
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
export function getSheetVisualState(state: SheetFSMState): string {
  return state.visibility;
}
