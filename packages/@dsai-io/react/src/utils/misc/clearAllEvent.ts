/**
 * clearAllEvent - Creates FSM event for clearing all selections
 *
 * Factory function that creates a CLEAR_ALL event for finite state machines
 * managing selection state. Used to deselect all currently selected items.
 *
 * @module utils/misc/clearAllEvent
 *
 * Consolidated from:
 * - packages/@dsai-io/react/src/components/CardList/CardList.fsm.ts
 * - packages/@dsai-io/react/src/components/Table/Table.fsm.ts
 */

/** Event type for clearing all selections */
export interface ClearAllEvent {
  readonly type: 'CLEAR_ALL';
}

/**
 * Creates a CLEAR_ALL event for FSM-based selection management.
 *
 * @returns The CLEAR_ALL event object
 *
 * @example
 * const event = clearAllEvent();
 * // { type: 'CLEAR_ALL' }
 *
 * dispatch(clearAllEvent());
 */
export function clearAllEvent(): ClearAllEvent {
  return { type: 'CLEAR_ALL' };
}

export default clearAllEvent;
