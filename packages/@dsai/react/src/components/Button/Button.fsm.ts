/**
 * Button Finite State Machine (FSM)
 *
 * Manages visual state transitions for the Button component using a
 * deterministic, pure reducer pattern. This ensures predictable visual
 * state behavior across hover, focus, press, and disabled states.
 *
 * State Diagram:
 * ```
 *            ENABLE
 *             ↓
 *    ┌────────────────┐
 *    │      idle      │ ← default state
 *    └────────────────┘
 *         ↑ ↓ ↓ ↑
 *    BLUR HOVER FOCUS BLUR/RELEASE
 *         ↓ ↑ ↑ ↓
 *    ┌────────────────┐
 *    │ hovered/focused│
 *    │   /pressed     │
 *    └────────────────┘
 *
 *    From any state:
 *    DISABLE → disabled
 *    LOADING → loading
 *    ERROR → error
 *    ENABLE → back to idle (if not loading/error)
 * ```
 *
 * Visual States:
 * - idle: default, no interaction
 * - hovered: mouse over the button
 * - focused: keyboard focus or focus-visible
 * - pressed: mouse down
 * - disabled: disabled prop is true
 * - loading: loading prop is true
 * - error: error prop is true
 *
 * Events:
 * - HOVER: mouse entered
 * - BLUR: mouse left or focus lost
 * - FOCUS: keyboard focus gained
 * - PRESS: mouse down (left button)
 * - RELEASE: mouse up
 * - DISABLE: disabled prop changed to true
 * - ENABLE: disabled prop changed to false
 * - LOADING: loading prop changed to true
 * - ERROR: error prop changed to true
 * - CLEAR_ERROR: error prop changed to false
 *
 * Rules:
 * 1. disabled/loading/error states override interactive states
 * 2. Once disabled, only ENABLE returns to idle
 * 3. Hover/focus/press have no effect when disabled, loading, or error
 * 4. Multiple interactions (e.g. hovered + focused) → pressed takes precedence
 * 5. Pure function: same input → same output, no side effects
 */

export type ButtonVisualState =
  | 'idle'
  | 'hovered'
  | 'focused'
  | 'pressed'
  | 'disabled'
  | 'loading'
  | 'error';

export type ButtonFSMEvent =
  | { type: 'HOVER' }
  | { type: 'BLUR' }
  | { type: 'FOCUS' }
  | { type: 'PRESS' }
  | { type: 'RELEASE' }
  | { type: 'DISABLE' }
  | { type: 'ENABLE' }
  | { type: 'LOADING'; payload: boolean }
  | { type: 'ERROR'; payload: boolean };

export interface ButtonFSMState {
  visualState: ButtonVisualState;
  isPressed: boolean;
  isHovered: boolean;
  isFocused: boolean;
  isDisabled: boolean;
  isLoading: boolean;
  isError: boolean;
}

/**
 * Pure reducer function for Button FSM
 *
 * @param state current FSM state
 * @param event event to process
 * @returns new FSM state
 *
 * @example
 * ```tsx
 * const [fsmState, dispatch] = useReducer(buttonFSMReducer, initialState);
 *
 * const handleMouseEnter = () => dispatch({ type: 'HOVER' });
 * const handleMouseLeave = () => dispatch({ type: 'BLUR' });
 * const handleFocus = () => dispatch({ type: 'FOCUS' });
 * const handleMouseDown = () => dispatch({ type: 'PRESS' });
 * const handleMouseUp = () => dispatch({ type: 'RELEASE' });
 * ```
 */
export function buttonFSMReducer(state: ButtonFSMState, event: ButtonFSMEvent): ButtonFSMState {
  switch (event.type) {
    // Override states: these take precedence over all others
    case 'DISABLE':
      return {
        visualState: 'disabled',
        isPressed: false,
        isHovered: false,
        isFocused: false,
        isDisabled: true,
        isLoading: state.isLoading,
        isError: state.isError,
      };

    case 'ENABLE':
      // If we're coming out of disabled, reset to idle (or previous state if loading/error)
      return {
        visualState: state.isLoading ? 'loading' : state.isError ? 'error' : 'idle',
        isPressed: false,
        isHovered: false,
        isFocused: false,
        isDisabled: false,
        isLoading: state.isLoading,
        isError: state.isError,
      };

    case 'LOADING':
      // If disabled, stay disabled even if loading state changes
      if (state.isDisabled) {
        return {
          ...state,
          isLoading: event.payload,
        };
      }
      // If transitioning TO loading, show loading but preserve interaction flags
      if (event.payload && !state.isLoading) {
        return {
          ...state,
          visualState: 'loading',
          isLoading: true,
        };
      }
      // If transitioning FROM loading, restore the previous interactive state
      if (!event.payload && state.isLoading) {
        return {
          ...state,
          visualState: state.isPressed
            ? 'pressed'
            : state.isFocused
              ? 'focused'
              : state.isHovered
                ? 'hovered'
                : 'idle',
          isLoading: false,
        };
      }
      // Loading state didn't change, return as-is
      return state;

    case 'ERROR':
      // If disabled, stay disabled even if error state changes
      if (state.isDisabled) {
        return {
          ...state,
          isError: event.payload,
        };
      }
      // If transitioning TO error, show error but preserve interaction flags
      if (event.payload && !state.isError) {
        return {
          ...state,
          visualState: 'error',
          isError: true,
        };
      }
      // If transitioning FROM error, restore the previous interactive state
      if (!event.payload && state.isError) {
        return {
          ...state,
          visualState: state.isPressed
            ? 'pressed'
            : state.isFocused
              ? 'focused'
              : state.isHovered
                ? 'hovered'
                : 'idle',
          isError: false,
        };
      }
      // Error state didn't change, return as-is
      return state;

    // Interactive states: only apply if not disabled, loading, or error
    case 'HOVER':
      if (state.isDisabled || state.isLoading || state.isError) {
        return state;
      }
      return {
        ...state,
        isHovered: true,
        visualState: state.isPressed ? 'pressed' : state.isFocused ? 'focused' : 'hovered',
      };

    case 'BLUR':
      // Disabled/loading states don't change on blur
      if (state.isDisabled || state.isLoading) {
        return state;
      }
      // During error state: if was focused, blur clears to idle; otherwise stay error
      if (state.isError) {
        if (state.isFocused) {
          return {
            ...state,
            isHovered: false,
            isPressed: false,
            isFocused: false,
            visualState: 'idle',
          };
        }
        // Not focused, just clear hover/press but stay in error
        return {
          ...state,
          isHovered: false,
          isPressed: false,
        };
      }
      return {
        ...state,
        isHovered: false,
        isPressed: false,
        isFocused: false,
        visualState: 'idle',
      };

    case 'FOCUS':
      if (state.isDisabled || state.isLoading || state.isError) {
        return state;
      }
      return {
        ...state,
        isFocused: true,
        visualState: state.isPressed ? 'pressed' : 'focused',
      };

    case 'PRESS':
      if (state.isDisabled || state.isLoading || state.isError) {
        return state;
      }
      return {
        ...state,
        isPressed: true,
        isHovered: true, // PRESS implies mouse is hovering
        visualState: 'pressed',
      };

    case 'RELEASE':
      if (state.isDisabled || state.isLoading || state.isError) {
        return state;
      }
      return {
        ...state,
        isPressed: false,
        visualState: state.isFocused ? 'focused' : state.isHovered ? 'hovered' : 'idle',
      };

    default:
      return state;
  }
}

/**
 * Create initial FSM state
 * @param disabled optional initial disabled state
 * @param loading optional initial loading state
 * @param error optional initial error state
 */
export function createInitialButtonFSMState(
  disabled = false,
  loading = false,
  error = false
): ButtonFSMState {
  const isDisabled = disabled;
  const isLoading = loading;
  const isError = error;

  let visualState: ButtonVisualState = 'idle';
  if (isDisabled) {
    visualState = 'disabled';
  } else if (isLoading) {
    visualState = 'loading';
  } else if (isError) {
    visualState = 'error';
  }

  return {
    visualState,
    isPressed: false,
    isHovered: false,
    isFocused: false,
    isDisabled,
    isLoading,
    isError,
  };
}
