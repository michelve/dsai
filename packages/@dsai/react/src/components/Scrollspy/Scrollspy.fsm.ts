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
export function scrollspyFSMReducer(
  state: ScrollspyFSMState,
  event: ScrollspyFSMEvent
): ScrollspyFSMState {
  switch (event.type) {
    case 'SECTION_ENTER': {
      const { sectionId } = event;

      // Add to visible IDs if not already present
      if (state.visibleIds.includes(sectionId)) {
        return state;
      }

      const newVisibleIds = [...state.visibleIds, sectionId];

      // The first visible section becomes active (topmost in DOM order)
      // We let the component handle DOM order since FSM doesn't have access to it
      return {
        ...state,
        visibleIds: newVisibleIds,
        activeId: state.activeId ?? sectionId,
      };
    }

    case 'SECTION_LEAVE': {
      const { sectionId } = event;

      // Remove from visible IDs
      const newVisibleIds = state.visibleIds.filter((id) => id !== sectionId);

      // If the leaving section was active, switch to the first remaining visible section
      const newActiveId =
        state.activeId === sectionId ? (newVisibleIds[0] ?? null) : state.activeId;

      return {
        ...state,
        visibleIds: newVisibleIds,
        activeId: newActiveId,
      };
    }

    case 'SET_ACTIVE': {
      const { sectionId } = event;

      if (state.activeId === sectionId) {
        return state;
      }

      return {
        ...state,
        activeId: sectionId,
      };
    }

    case 'START_OBSERVING': {
      if (state.isObserving) {
        return state;
      }

      return {
        ...state,
        isObserving: true,
      };
    }

    case 'STOP_OBSERVING': {
      if (!state.isObserving) {
        return state;
      }

      return {
        ...state,
        isObserving: false,
        visibleIds: [],
      };
    }

    case 'RESET': {
      return createInitialScrollspyFSMState();
    }

    default: {
      // Exhaustive check
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
