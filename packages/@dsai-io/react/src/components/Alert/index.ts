export { Alert } from './Alert';
export type { AlertFSMEvent, AlertFSMState, AlertVisibilityState } from './Alert.fsm';

// FSM utilities for advanced use cases
export { alertFSMReducer, createInitialAlertFSMState } from './Alert.fsm';
export type {
  AlertDismissReason,
  AlertHeadingLevel,
  AlertHeadingProps,
  AlertLinkProps,
  AlertLinkTarget,
  AlertProps,
  AlertVariant,
} from './Alert.types';
