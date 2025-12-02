/**
 * Navbar FSM (Finite State Machine)
 *
 * Manages the collapse/expand state transitions for the Navbar component.
 * Provides predictable state management for animations and accessibility.
 *
 * @module Navbar/FSM
 */

import type { NavbarFSMEvent, NavbarFSMState, NavbarVisualState } from './Navbar.types';

/**
 * Create the initial FSM state for the navbar collapse
 *
 * @param expanded - Initial expanded state
 * @returns Initial FSM state
 */
export function createInitialNavbarFSMState(expanded: boolean): NavbarFSMState {
  return {
    visibility: expanded ? 'expanded' : 'collapsed',
    shouldRender: true, // Always render for accessibility
  };
}

/**
 * Navbar FSM reducer
 *
 * State transitions:
 * - collapsed → TOGGLE/OPEN → expanding → ANIMATION_END → expanded
 * - expanded → TOGGLE/CLOSE → collapsing → ANIMATION_END → collapsed
 *
 * @param state - Current FSM state
 * @param event - Event to process
 * @returns New FSM state
 */
export function navbarFSMReducer(state: NavbarFSMState, event: NavbarFSMEvent): NavbarFSMState {
  switch (event.type) {
    case 'TOGGLE': {
      if (state.visibility === 'collapsed') {
        return { visibility: 'expanding', shouldRender: true };
      }
      if (state.visibility === 'expanded') {
        return { visibility: 'collapsing', shouldRender: true };
      }
      // Ignore toggle during animations
      return state;
    }

    case 'OPEN': {
      if (state.visibility === 'collapsed' || state.visibility === 'collapsing') {
        return { visibility: 'expanding', shouldRender: true };
      }
      return state;
    }

    case 'CLOSE': {
      if (state.visibility === 'expanded' || state.visibility === 'expanding') {
        return { visibility: 'collapsing', shouldRender: true };
      }
      return state;
    }

    case 'ANIMATION_END': {
      if (state.visibility === 'expanding') {
        return { visibility: 'expanded', shouldRender: true };
      }
      if (state.visibility === 'collapsing') {
        return { visibility: 'collapsed', shouldRender: true };
      }
      return state;
    }

    case 'RESET_FROM_PROPS': {
      const targetVisibility = event.expanded ? 'expanded' : 'collapsed';
      if (state.visibility === targetVisibility) {
        return state;
      }
      // Skip animation when controlled externally
      return { visibility: targetVisibility, shouldRender: true };
    }

    default:
      return state;
  }
}

/**
 * Get the visual state for data-visual-state attribute
 *
 * @param state - Current FSM state
 * @returns Visual state string
 */
export function getNavbarVisualState(state: NavbarFSMState): NavbarVisualState {
  return state.visibility;
}

/**
 * Check if the navbar collapse is currently expanded (or expanding)
 *
 * @param state - Current FSM state
 * @returns true if expanded or expanding
 */
export function isNavbarExpanded(state: NavbarFSMState): boolean {
  return state.visibility === 'expanded' || state.visibility === 'expanding';
}

/**
 * Check if the navbar is currently animating
 *
 * @param state - Current FSM state
 * @returns true if expanding or collapsing
 */
export function isNavbarAnimating(state: NavbarFSMState): boolean {
  return state.visibility === 'expanding' || state.visibility === 'collapsing';
}
