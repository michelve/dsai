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
 * Resolve interactive visual state from current flags.
 * Precedence: pressed > focused > hovered > idle.
 */
function resolveInteractiveState(state: ButtonFSMState): ButtonVisualState {
  if (state.isPressed) { return 'pressed'; }
  if (state.isFocused) { return 'focused'; }
  if (state.isHovered) { return 'hovered'; }
  return 'idle';
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
/**
 * Handle DISABLE event
 */
function handleDisableEvent(state: ButtonFSMState): ButtonFSMState {
  return {
    visualState: 'disabled',
    isPressed: false,
    isHovered: false,
    isFocused: false,
    isDisabled: true,
    isLoading: state.isLoading,
    isError: state.isError,
  };
}

/**
 * Handle ENABLE event
 */
function handleEnableEvent(state: ButtonFSMState): ButtonFSMState {
  let enabledVisualState: ButtonVisualState = 'idle';
  if (state.isLoading) {
    enabledVisualState = 'loading';
  } else if (state.isError) {
    enabledVisualState = 'error';
  }
  return {
    visualState: enabledVisualState,
    isPressed: false,
    isHovered: false,
    isFocused: false,
    isDisabled: false,
    isLoading: state.isLoading,
    isError: state.isError,
  };
}

/**
 * Handle LOADING event
 */
function handleLoadingEvent(state: ButtonFSMState, payload: boolean): ButtonFSMState {
  if (state.isDisabled) {
    return { ...state, isLoading: payload };
  }
  if (payload && !state.isLoading) {
    return { ...state, visualState: 'loading', isLoading: true };
  }
  if (!payload && state.isLoading) {
    return { ...state, visualState: resolveInteractiveState(state), isLoading: false };
  }
  return state;
}

/**
 * Handle ERROR event
 */
function handleErrorEvent(state: ButtonFSMState, payload: boolean): ButtonFSMState {
  if (state.isDisabled) {
    return { ...state, isError: payload };
  }
  if (payload && !state.isError) {
    return { ...state, visualState: 'error', isError: true };
  }
  if (!payload && state.isError) {
    return { ...state, visualState: resolveInteractiveState(state), isError: false };
  }
  return state;
}

/**
 * Handle BLUR event
 */
function handleBlurEvent(state: ButtonFSMState): ButtonFSMState {
  if (state.isDisabled || state.isLoading) {
    return state;
  }
  if (state.isError) {
    if (state.isFocused) {
      return { ...state, isHovered: false, isPressed: false, isFocused: false, visualState: 'idle' };
    }
    return { ...state, isHovered: false, isPressed: false };
  }
  return { ...state, isHovered: false, isPressed: false, isFocused: false, visualState: 'idle' };
}

export function buttonFSMReducer(state: ButtonFSMState, event: ButtonFSMEvent): ButtonFSMState {
  switch (event.type) {
    case 'DISABLE':
      return handleDisableEvent(state);

    case 'ENABLE':
      return handleEnableEvent(state);

    case 'LOADING':
      return handleLoadingEvent(state, event.payload);

    case 'ERROR':
      return handleErrorEvent(state, event.payload);

    case 'HOVER':
      if (state.isDisabled || state.isLoading || state.isError) {
        return state;
      }
      return {
        ...state,
        isHovered: true,
        visualState: resolveInteractiveState({ ...state, isHovered: true }),
      };

    case 'BLUR':
      return handleBlurEvent(state);

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
        isHovered: true,
        visualState: 'pressed',
      };

    case 'RELEASE':
      if (state.isDisabled || state.isLoading || state.isError) {
        return state;
      }
      return {
        ...state,
        isPressed: false,
        visualState: resolveInteractiveState({ ...state, isPressed: false }),
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
