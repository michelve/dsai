/**
 * CheckboxGroup Component
 *
 * High-level component for managing checkbox groups with tri-state selection.
 *
 * @module CheckboxGroup
 */

export { CheckboxGroup } from './CheckboxGroup';
export type { CheckboxGroupFSMState, GroupSelectionState } from './CheckboxGroup.fsm';
// Export FSM utilities for advanced usage
export {
  checkboxGroupFSMReducer,
  createInitialCheckboxGroupFSMState,
  deriveSelectionState,
  isAllSelected,
  isNoneSelected,
  isSomeSelected,
  isValueSelected,
  resetFromPropsEvent,
  toggleAllEvent,
  toggleItemEvent,
} from './CheckboxGroup.fsm';
export type { CheckboxGroupOption, CheckboxGroupProps } from './CheckboxGroup.types';
