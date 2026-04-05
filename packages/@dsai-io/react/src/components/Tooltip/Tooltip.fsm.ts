import type { TooltipFSMEvent, TooltipFSMState, TooltipVisualState } from './Tooltip.types';

/**
 * Create initial FSM state for the Tooltip
 *
 * @param initialOpen - Initial open state
 * @returns Initial FSM state
 */
export function createInitialTooltipFSMState(initialOpen: boolean): TooltipFSMState {
  if (initialOpen) {
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
 * Tooltip FSM Reducer
 *
 * State machine for managing tooltip visibility with animation support.
 *
 * States:
 * - closed: Tooltip is hidden and not rendered
 * - opening: Tooltip is being shown (animation in progress)
 * - open: Tooltip is fully visible
 * - closing: Tooltip is being hidden (animation in progress)
 *
 * Transitions:
 * - closed + OPEN -> opening (start show animation)
 * - opening + ANIMATION_END -> open (show animation complete)
 * - open + CLOSE -> closing (start hide animation)
 * - closing + ANIMATION_END -> closed (hide animation complete)
 *
 * @param state - Current FSM state
 * @param event - Event to process
 * @returns New FSM state
 */
/**
 * Handle events when tooltip is in 'closed' state
 */
function handleTooltipClosedEvent(state: TooltipFSMState, event: TooltipFSMEvent): TooltipFSMState {
  if (event.type === 'OPEN') {
    return { visibility: 'opening', shouldRender: true };
  }
  return state;
}

/**
 * Handle events when tooltip is in 'opening' state
 */
function handleTooltipOpeningEvent(
  state: TooltipFSMState,
  event: TooltipFSMEvent
): TooltipFSMState {
  if (event.type === 'ANIMATION_END') {
    return { visibility: 'open', shouldRender: true };
  }
  if (event.type === 'CLOSE') {
    return { visibility: 'closing', shouldRender: true };
  }
  return state;
}

/**
 * Handle events when tooltip is in 'open' state
 */
function handleTooltipOpenEvent(state: TooltipFSMState, event: TooltipFSMEvent): TooltipFSMState {
  if (event.type === 'CLOSE') {
    return { visibility: 'closing', shouldRender: true };
  }
  return state;
}

/**
 * Handle events when tooltip is in 'closing' state
 */
function handleTooltipClosingEvent(
  state: TooltipFSMState,
  event: TooltipFSMEvent
): TooltipFSMState {
  if (event.type === 'ANIMATION_END') {
    return { visibility: 'closed', shouldRender: false };
  }
  if (event.type === 'OPEN') {
    return { visibility: 'opening', shouldRender: true };
  }
  return state;
}

export function tooltipFSMReducer(state: TooltipFSMState, event: TooltipFSMEvent): TooltipFSMState {
  switch (state.visibility) {
    case 'closed':
      return handleTooltipClosedEvent(state, event);
    case 'opening':
      return handleTooltipOpeningEvent(state, event);
    case 'open':
      return handleTooltipOpenEvent(state, event);
    case 'closing':
      return handleTooltipClosingEvent(state, event);
    default:
      return state;
  }
}

/**
 * Get visual state string for data-visual-state attribute
 *
 * Maps FSM visibility to user-friendly visual state names:
 * - closed -> 'hidden'
 * - opening -> 'showing'
 * - open -> 'visible'
 * - closing -> 'hiding'
 *
 * @param state - Current FSM state
 * @returns Visual state string for CSS/testing
 */
export function getTooltipVisualState(state: TooltipFSMState): TooltipVisualState {
  switch (state.visibility) {
    case 'closed':
      return 'hidden';
    case 'opening':
      return 'showing';
    case 'open':
      return 'visible';
    case 'closing':
      return 'hiding';
    default:
      return 'hidden';
  }
}
