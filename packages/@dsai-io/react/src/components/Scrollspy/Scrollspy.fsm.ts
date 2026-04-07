/**
 * Scrollspy Finite State Machine
 *
 * Manages scroll position tracking and active section state.
 * Uses IntersectionObserver for efficient scroll tracking.
 *
 * @module Scrollspy
 */

import type { ScrollspyFSMEvent, ScrollspyFSMState, ScrollspyVisualState } from './Scrollspy.types';

/**
 * Create initial FSM state for the Scrollspy
 *
 * @param defaultActiveId - Optional default active section ID
 * @returns Initial FSM state
 */
export function createInitialScrollspyFSMState(
  defaultActiveId: string | null = null
): ScrollspyFSMState {
  return {
    activeId: defaultActiveId,
    visibleIds: defaultActiveId ? [defaultActiveId] : [],
    isObserving: false,
  };
}

/**
 * Scrollspy FSM Reducer
 *
 * State machine for managing scroll position and active section.
 *
 * States:
 * - Not observing: IntersectionObserver not active
 * - Observing: Tracking visible sections
 *
 * Transitions:
 * - SECTION_ENTER: Add section to visible list, potentially update active
 * - SECTION_LEAVE: Remove section from visible list, update active if needed
 * - SET_ACTIVE: Explicitly set active section (for controlled mode)
 * - START_OBSERVING: Begin intersection observation
 * - STOP_OBSERVING: Stop intersection observation
 * - RESET: Reset to initial state
 *
 * @param state - Current FSM state
 * @param event - Event to process
 * @returns New FSM state
 */
/**
 * Handle SECTION_ENTER event
 */
function handleScrollspySectionEnter(
  state: ScrollspyFSMState,
  sectionId: string
): ScrollspyFSMState {
  if (state.visibleIds.includes(sectionId)) {
    return state;
  }

  const newVisibleIds = [...state.visibleIds, sectionId];
  return {
    ...state,
    visibleIds: newVisibleIds,
    activeId: state.activeId ?? sectionId,
  };
}

/**
 * Handle SECTION_LEAVE event
 */
function handleScrollspySectionLeave(
  state: ScrollspyFSMState,
  sectionId: string
): ScrollspyFSMState {
  const newVisibleIds = state.visibleIds.filter((id) => id !== sectionId);
  const newActiveId =
    state.activeId === sectionId ? (newVisibleIds[0] ?? null) : state.activeId;

  return {
    ...state,
    visibleIds: newVisibleIds,
    activeId: newActiveId,
  };
}

/**
 * Handle SET_ACTIVE event
 */
function handleScrollspySetActive(
  state: ScrollspyFSMState,
  sectionId: string | null
): ScrollspyFSMState {
  if (state.activeId === sectionId) {
    return state;
  }
  return { ...state, activeId: sectionId };
}

/**
 * Handle observation lifecycle events
 */
function handleScrollspyObservation(
  state: ScrollspyFSMState,
  event: Extract<ScrollspyFSMEvent, { type: 'START_OBSERVING' | 'STOP_OBSERVING' | 'RESET' }>
): ScrollspyFSMState {
  switch (event.type) {
    case 'START_OBSERVING':
      return state.isObserving ? state : { ...state, isObserving: true };
    case 'STOP_OBSERVING':
      return state.isObserving ? { ...state, isObserving: false, visibleIds: [] } : state;
    case 'RESET':
      return createInitialScrollspyFSMState();
  }
}

export function scrollspyFSMReducer(
  state: ScrollspyFSMState,
  event: ScrollspyFSMEvent
): ScrollspyFSMState {
  switch (event.type) {
    case 'SECTION_ENTER':
      return handleScrollspySectionEnter(state, event.sectionId);
    case 'SECTION_LEAVE':
      return handleScrollspySectionLeave(state, event.sectionId);
    case 'SET_ACTIVE':
      return handleScrollspySetActive(state, event.sectionId);
    case 'START_OBSERVING':
    case 'STOP_OBSERVING':
    case 'RESET':
      return handleScrollspyObservation(state, event);
    default: {
      const _exhaustive: never = event;
      return _exhaustive;
    }
  }
}

/**
 * Get visual state from FSM state
 *
 * @param state - Current FSM state
 * @returns Visual state for data-visual-state attribute
 */
export function getScrollspyVisualState(state: ScrollspyFSMState): ScrollspyVisualState {
  if (!state.isObserving) {
    return 'idle';
  }

  if (state.visibleIds.length > 0) {
    return 'tracking';
  }

  return 'scrolling';
}

/**
 * Check if a section is currently active
 *
 * @param state - Current FSM state
 * @param sectionId - Section ID to check
 * @returns Whether the section is active
 */
export function isScrollspySectionActive(state: ScrollspyFSMState, sectionId: string): boolean {
  return state.activeId === sectionId;
}

/**
 * Check if a section is currently visible
 *
 * @param state - Current FSM state
 * @param sectionId - Section ID to check
 * @returns Whether the section is visible
 */
export function isScrollspySectionVisible(state: ScrollspyFSMState, sectionId: string): boolean {
  return state.visibleIds.includes(sectionId);
}

/**
 * Check if scrollspy is currently observing
 *
 * @param state - Current FSM state
 * @returns Whether scrollspy is observing
 */
export function isScrollspyObserving(state: ScrollspyFSMState): boolean {
  return state.isObserving;
}
