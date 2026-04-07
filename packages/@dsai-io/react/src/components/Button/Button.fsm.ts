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
  if (state.isPressed) {
    return 'pressed';
  }
  if (state.isFocused) {
    return 'focused';
  }
  if (state.isHovered) {
    return 'hovered';
  }
  return 'idle';
}

/**
 * Guard: returns true when the button is in a non-interactive override state.
 */
function isOverridden(state: ButtonFSMState): boolean {
  return state.isDisabled || state.isLoading || state.isError;
}

function handleDisable(state: ButtonFSMState): ButtonFSMState {
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

function handleEnable(state: ButtonFSMState): ButtonFSMState {
  let visualState: ButtonVisualState;
  if (state.isLoading) {
    visualState = 'loading';
  } else if (state.isError) {
    visualState = 'error';
  } else {
    visualState = 'idle';
  }

  return {
    visualState,
    isPressed: false,
    isHovered: false,
    isFocused: false,
    isDisabled: false,
    isLoading: state.isLoading,
    isError: state.isError,
  };
}

/**
 * Shared handler for LOADING and ERROR toggle events.
 * Both follow the same pattern: disabled keeps override; toggling on/off
 * switches visual state accordingly.
 */
function handleToggleOverride(
  state: ButtonFSMState,
  payload: boolean,
  flagKey: 'isLoading' | 'isError',
  activeVisual: ButtonVisualState
): ButtonFSMState {
  const currentFlag = Reflect.get(state, flagKey) as boolean;

  // If disabled, just update the flag without changing visual state
  if (state.isDisabled) {
    return { ...state, [flagKey]: payload };
  }
  // Transitioning ON
  if (payload && !currentFlag) {
    return { ...state, visualState: activeVisual, [flagKey]: true };
  }
  // Transitioning OFF — restore interactive state
  if (!payload && currentFlag) {
    return { ...state, visualState: resolveInteractiveState(state), [flagKey]: false };
  }
  // No change
  return state;
}

function handleBlur(state: ButtonFSMState): ButtonFSMState {
  if (state.isDisabled || state.isLoading) {
    return state;
  }
  // During error: focused blur clears to idle; otherwise just clear interaction flags
  if (state.isError) {
    return state.isFocused
      ? { ...state, isHovered: false, isPressed: false, isFocused: false, visualState: 'idle' }
      : { ...state, isHovered: false, isPressed: false };
  }
  return { ...state, isHovered: false, isPressed: false, isFocused: false, visualState: 'idle' };
}

function handleHover(state: ButtonFSMState): ButtonFSMState {
  if (isOverridden(state)) {
    return state;
  }
  return {
    ...state,
    isHovered: true,
    visualState: resolveInteractiveState({ ...state, isHovered: true }),
  };
}

function handleFocus(state: ButtonFSMState): ButtonFSMState {
  if (isOverridden(state)) {
    return state;
  }
  return { ...state, isFocused: true, visualState: state.isPressed ? 'pressed' : 'focused' };
}

function handlePress(state: ButtonFSMState): ButtonFSMState {
  if (isOverridden(state)) {
    return state;
  }
  return { ...state, isPressed: true, isHovered: true, visualState: 'pressed' };
}

function handleRelease(state: ButtonFSMState): ButtonFSMState {
  if (isOverridden(state)) {
    return state;
  }
  return {
    ...state,
    isPressed: false,
    visualState: resolveInteractiveState({ ...state, isPressed: false }),
  };
}

/**
 * Pure reducer function for Button FSM
 *
 * @param state current FSM state
 * @param event event to process
 * @returns new FSM state
 */
export function buttonFSMReducer(state: ButtonFSMState, event: ButtonFSMEvent): ButtonFSMState {
  switch (event.type) {
    case 'DISABLE':
      return handleDisable(state);

    case 'ENABLE':
      return handleEnable(state);

    case 'LOADING':
      return handleToggleOverride(state, event.payload, 'isLoading', 'loading');

    case 'ERROR':
      return handleToggleOverride(state, event.payload, 'isError', 'error');

    case 'HOVER':
      return handleHover(state);

    case 'BLUR':
      return handleBlur(state);

    case 'FOCUS':
      return handleFocus(state);

    case 'PRESS':
      return handlePress(state);

    case 'RELEASE':
      return handleRelease(state);

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
