/**
 * Popover Component
 *
 * A fully accessible popover component for richer interactive content.
 * Uses Floating UI for intelligent positioning.
 *
 * @example
 * ```tsx
 * import { Popover, PopoverHeader, PopoverBody } from '@dsai/react';
 *
 * <Popover header="Settings" content="Configure your preferences.">
 *   <button>Open Settings</button>
 * </Popover>
 * ```
 */

// Main component
export { Popover } from './Popover';

// Subcomponents
export { PopoverBody } from './PopoverBody';
export { PopoverCloseButton } from './PopoverCloseButton';
export { PopoverHeader } from './PopoverHeader';

// FSM exports
export {
  createInitialPopoverFSMState,
  getPopoverVisualState,
  popoverFSMReducer,
} from './Popover.fsm';

// Types
export type {
  PopoverBodyProps,
  PopoverCloseButtonProps,
  PopoverContextValue,
  PopoverFSMEvent,
  PopoverFSMState,
  PopoverHeaderProps,
  PopoverPlacement,
  PopoverProps,
  PopoverTrigger,
  PopoverVisualState,
  SafePopoverHTMLAttributes,
} from './Popover.types';
