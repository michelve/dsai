/**
 * Breadcrumb component exports
 *
 * @module Breadcrumb
 */

export { Breadcrumb, BreadcrumbItem } from './Breadcrumb';
export type {
  BreadcrumbExpandState,
  BreadcrumbFSMEvent,
  BreadcrumbFSMState,
  ExpandEvent,
  ResetFromPropsEvent,
} from './Breadcrumb.fsm';

// FSM exports for advanced usage
export {
  breadcrumbFSMReducer,
  createInitialBreadcrumbFSMState,
  expandEvent,
  isCollapsed,
  isExpanded,
  resetFromPropsEvent,
} from './Breadcrumb.fsm';
export type { BreadcrumbItemData, BreadcrumbItemProps, BreadcrumbProps } from './Breadcrumb.types';
