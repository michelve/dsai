/**
 * Scrollspy Component Exports
 *
 * @module Scrollspy
 */

export { Scrollspy, ScrollspyProvider, useScrollspy } from './Scrollspy';
export {
  createInitialScrollspyFSMState,
  getScrollspyVisualState,
  isScrollspyObserving,
  isScrollspySectionActive,
  isScrollspySectionVisible,
  scrollspyFSMReducer,
} from './Scrollspy.fsm';
export type {
  SafeScrollspyHTMLAttributes,
  ScrollspyContextValue,
  ScrollspyFSMEvent,
  ScrollspyFSMState,
  ScrollspyItem,
  ScrollspyLinkProps,
  ScrollspyProps,
  ScrollspyProviderProps,
  ScrollspyVisualState,
} from './Scrollspy.types';
