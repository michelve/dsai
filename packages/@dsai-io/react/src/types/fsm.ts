/**
 * Finite State Machine (FSM) Base Types
 *
 * Type definitions for implementing finite state machines in components.
 * These types provide a consistent pattern for state management across components.
 *
 * @module @dsai-io/react/types/fsm
 */

/**
 * Base interface for Finite State Machine states
 *
 * PERFORMANCE: Keep minimal - FSM updates happen frequently
 * SCALABILITY: Use discriminated unions for state variants
 *
 * Used by: Toast, Popover, Accordion, CardList, Carousel, TabsPro, Table,
 * Tooltip, Navbar, CheckboxGroup, Scrollspy
 *
 * @example
 * ```typescript
 * interface ToastFSMState extends FSMStateBase {
 *   visibility: 'hidden' | 'entering' | 'visible' | 'exiting';
 *   shouldRender: boolean;
 * }
 * ```
 */
export interface FSMStateBase {
  /**
   * Current state identifier
   * Use discriminated union for type safety
   */
  status?: string;
}

/**
 * Base interface for FSM events
 *
 * ⚠️ PERFORMANCE: Events should be lightweight POJOs
 * ⚠️ BEST PRACTICE: Use discriminated unions with 'type' field
 *
 * @example
 * ```typescript
 * type ToastFSMEvent =
 *   | { type: 'SHOW' }
 *   | { type: 'HIDE' }
 *   | { type: 'DISMISS' }
 *   | { type: 'ANIMATION_END' };
 * ```
 */
export interface FSMEventBase {
  /**
   * Event type identifier (discriminant)
   */
  type: string;
}

/**
 * FSM Reducer function signature
 *
 * Pure function that takes current state and event, returns new state.
 * Must be pure (no side effects, same input always produces same output).
 *
 * @template State - FSM state type
 * @template Event - FSM event type
 *
 * @example
 * ```typescript
 * const reducer: FSMReducer<ToastFSMState, ToastFSMEvent> = (state, event) => {
 *   switch (event.type) {
 *     case 'SHOW':
 *       return { ...state, visibility: 'entering', shouldRender: true };
 *     case 'HIDE':
 *       return { ...state, visibility: 'exiting' };
 *     default:
 *       return state;
 *   }
 * };
 * ```
 */
export type FSMReducer<State extends FSMStateBase, Event extends FSMEventBase> = (
  state: State,
  event: Event
) => State;

/**
 * FSM Configuration
 *
 * Configuration object for setting up a finite state machine.
 * Includes initial state and reducer function.
 *
 * @template State - FSM state type
 * @template Event - FSM event type
 *
 * @example
 * ```typescript
 * const toastFSMConfig: FSMConfig<ToastFSMState, ToastFSMEvent> = {
 *   initialState: { visibility: 'hidden', shouldRender: false },
 *   reducer: toastReducer,
 * };
 * ```
 */
export interface FSMConfig<State extends FSMStateBase, Event extends FSMEventBase> {
  /**
   * Initial state of the state machine
   */
  initialState: State;

  /**
   * Reducer function to handle state transitions
   */
  reducer: FSMReducer<State, Event>;
}

/**
 * Visual state derived from FSM state
 *
 * Used for CSS classes and rendering decisions.
 * Keeps FSM state minimal while providing rich rendering info.
 *
 * ⚠️ PERFORMANCE: Derive this on-demand, don't store in FSM state
 *
 * @example
 * ```typescript
 * function getVisualState(fsmState: ToastFSMState): VisualStateBase {
 *   return {
 *     state: fsmState.visibility,
 *     shouldRender: fsmState.shouldRender,
 *     modifiers: fsmState.visibility === 'visible' ? ['active'] : undefined,
 *   };
 * }
 * ```
 */
export interface VisualStateBase {
  /**
   * Primary visual state (maps to CSS classes)
   */
  state: string;

  /**
   * Whether component should be in DOM
   */
  shouldRender: boolean;

  /**
   * Optional CSS class modifiers
   */
  modifiers?: string[];
}
