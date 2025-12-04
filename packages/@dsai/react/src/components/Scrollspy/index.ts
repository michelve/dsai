/**
 * Scrollspy Component Exports
 *
 * @module Scrollspy
 */

export { Scrollspy, ScrollspyProvider, useScrollspy } from './Scrollspy';

export type {
  SafeScrollspyHTMLAttributes,
  ScrollspyContextValue,
  ScrollspyFSMEvent,
  ScrollspyFSMState,
  ScrollspyItem,
  ScrollspyLinkProps,
  ScrollspyOrientation,
  ScrollspyPosition,
  ScrollspyProps,
  ScrollspyProviderProps,
  ScrollspyVariant,
  ScrollspyVisualState,
} from './Scrollspy.types';

export {
  createInitialScrollspyFSMState,
  getScrollspyVisualState,
  isScrollspyObserving,
  isScrollspySectionActive,
  isScrollspySectionVisible,
  scrollspyFSMReducer,
} from './Scrollspy.fsm';
