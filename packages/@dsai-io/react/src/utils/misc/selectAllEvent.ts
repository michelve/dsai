/**
 * selectAllEvent - Creates FSM event for selecting all enabled items
 *
 * Supports both value-based (CardList/CheckboxGroup) and row-based (Table) selections
 * by including both enabledValues and enabledRowIds on the event payload.
 *
 * @module utils/misc/selectAllEvent
 *
 * Consolidated from:
 * - packages/@dsai-io/react/src/components/CardList/CardList.fsm.ts
 * - packages/@dsai-io/react/src/components/Table/Table.fsm.ts
 */

/** Row identifier type used by table selection */
export type RowId = string | number;

/** Event type for selecting all enabled items */
export interface SelectAllEvent {
  readonly type: 'SELECT_ALL';
  /** All enabled option values (for value-based selections) */
  readonly enabledValues?: string[];
  /** All enabled row identifiers (for row-based selections) */
  readonly enabledRowIds?: RowId[];
  /** Total count of enabled items */
  readonly totalEnabled: number;
}

/**
 * Creates a SELECT_ALL event for FSM-based selection management.
 *
 * The payload includes both enabledValues and enabledRowIds so reducers that
 * expect either shape remain compatible.
 *
 * @param enabled - Array of enabled values or row IDs
 * @param totalEnabled - Total number of enabled items
 * @returns The SELECT_ALL event object
 */
export function selectAllEvent(
  enabled: Array<string | number>,
  totalEnabled: number
): SelectAllEvent {
  const enabledValues = enabled.map(String);
  const enabledRowIds = enabled.map((v) => v as RowId);
  return { type: 'SELECT_ALL', enabledValues, enabledRowIds, totalEnabled };
}

export default selectAllEvent;
