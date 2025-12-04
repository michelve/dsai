import type { PopoverFSMEvent, PopoverFSMState, PopoverVisualState } from './Popover.types';

/**
 * Creates the initial Popover FSM state
 *
 * @param defaultOpen - Whether the popover should start open
 * @returns Initial FSM state
 *
 * @example
 * ```ts
 * const initialState = createInitialPopoverFSMState(false);
 * ```
 */
export function createInitialPopoverFSMState(defaultOpen = false): PopoverFSMState {
  if (defaultOpen) {
    return {
      visibility: 'open',
      shouldRender: true,
    };
  }
  return {
    visibility: 'closed',
    shouldRender: false,
  };
}

/**
 * Popover FSM reducer
 *
 * Handles all popover visibility state transitions:
 * - OPEN: Transition to opening/open state
 * - CLOSE: Transition to closing/closed state
 * - ANIMATION_END: Complete transition after animation
 *
 * State machine:
 * ```
 * closed -> (OPEN) -> opening -> (ANIMATION_END) -> open
 * open -> (CLOSE) -> closing -> (ANIMATION_END) -> closed
 * ```
 *
 * @param state - Current FSM state
 * @param event - FSM event to process
 * @returns Updated FSM state
 *
 * @example
 * ```ts
 * const [state, dispatch] = useReducer(popoverFSMReducer, createInitialPopoverFSMState());
 * dispatch({ type: 'OPEN' });
 * ```
 */
export function popoverFSMReducer(state: PopoverFSMState, event: PopoverFSMEvent): PopoverFSMState {
  switch (event.type) {
    case 'OPEN': {
      if (state.visibility === 'closed' || state.visibility === 'closing') {
        return {
          visibility: 'opening',
          shouldRender: true,
        };
      }
      return state;
    }

    case 'CLOSE': {
      if (state.visibility === 'open' || state.visibility === 'opening') {
        return {
          visibility: 'closing',
          shouldRender: true,
        };
      }
      return state;
    }

    case 'ANIMATION_END': {
      if (state.visibility === 'opening') {
        return {
          visibility: 'open',
          shouldRender: true,
        };
      }
      if (state.visibility === 'closing') {
        return {
          visibility: 'closed',
          shouldRender: false,
        };
      }
      return state;
    }

    default:
      return state;
  }
}

/**
 * Get the visual state attribute value for the popover
 *
 * @param state - Current FSM state
 * @returns Visual state string for data-visual-state attribute
 *
 * @example
 * ```ts
 * const visualState = getPopoverVisualState(fsmState);
 * <div data-visual-state={visualState} />
 * ```
 */
export function getPopoverVisualState(state: PopoverFSMState): PopoverVisualState {
  switch (state.visibility) {
    case 'closed':
      return 'hidden';
    case 'opening':
      return 'showing';
    case 'open':
      return 'visible';
    case 'closing':
      return 'hiding';
  }
}
