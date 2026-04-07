/**
 * toggleAllEvent - Creates FSM event for toggling all enabled items
 *
 * Supports both value-based (CheckboxGroup) and row-based (Table) selections
 * by including both enabledValues and enabledRowIds on the event payload.
 *
 * @module utils/misc/toggleAllEvent
 *
 * Consolidated from:
 * - packages/@dsai-io/react/src/components/CheckboxGroup/CheckboxGroup.fsm.ts
 * - packages/@dsai-io/react/src/components/Table/Table.fsm.ts
 */

/** Row identifier type used by table selection */
export type RowId = string | number;

/** Event type for toggling all enabled items */
export interface ToggleAllEvent {
  readonly type: 'TOGGLE_ALL';
  /** Total count of enabled items */
  readonly totalEnabled: number;
  /** All enabled option values (for value-based selections) */
  readonly enabledValues?: string[];
  /** All enabled row identifiers (for row-based selections) */
  readonly enabledRowIds?: RowId[];
}

/**
 * Creates a TOGGLE_ALL event for FSM-based selection management.
 *
 * The payload includes both enabledValues and enabledRowIds so reducers that
 * expect either shape remain compatible.
 *
 * @param enabled - Array of enabled values or row IDs
 * @param totalEnabled - Total number of enabled items
 * @returns The TOGGLE_ALL event object
 */
export function toggleAllEvent(
  enabled: Array<string | number>,
  totalEnabled: number
): ToggleAllEvent {
  const enabledValues = enabled.map(String);
  const enabledRowIds = enabled.map((v) => v as RowId);
  return { type: 'TOGGLE_ALL', enabledValues, enabledRowIds, totalEnabled };
}

export default toggleAllEvent;
