/**
 * toggleItemEvent - Creates FSM event for toggling single item selection
 *
 * Factory function that creates a TOGGLE_ITEM event for finite state machines
 * managing selection state in components like CardList and CheckboxGroup.
 *
 * @module utils/misc/toggleItemEvent
 *
 * Consolidated from:
 * - packages/@dsai/react/src/components/CardList/CardList.fsm.ts
 * - packages/@dsai/react/src/components/CheckboxGroup/CheckboxGroup.fsm.ts
 */

/** Event type for toggling a single item's selection state */
export interface ToggleItemEvent {
  readonly type: 'TOGGLE_ITEM';
  readonly value: string;
  readonly totalEnabled: number;
}

/**
 * Creates a TOGGLE_ITEM event for FSM-based selection management.
 *
 * @param value - The identifier of the item to toggle
 * @param totalEnabled - Total number of enabled/selectable items
 * @returns The TOGGLE_ITEM event object
 *
 * @example
 * const event = toggleItemEvent('item-1', 5);
 * // { type: 'TOGGLE_ITEM', value: 'item-1', totalEnabled: 5 }
 *
 * dispatch(toggleItemEvent(cardId, enabledCards.length));
 */
export function toggleItemEvent(value: string, totalEnabled: number): ToggleItemEvent {
  return { type: 'TOGGLE_ITEM', value, totalEnabled };
}

export default toggleItemEvent;
