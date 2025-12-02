/**
 * Tooltip Component
 *
 * A fully accessible tooltip component for providing contextual information.
 *
 * @example
 * ```tsx
 * import { Tooltip } from '@dsai/react';
 *
 * <Tooltip content="Helpful information">
 *   <button>Hover me</button>
 * </Tooltip>
 * ```
 */
export { Tooltip } from './Tooltip';
export {
  createInitialTooltipFSMState,
  getTooltipVisualState,
  tooltipFSMReducer,
} from './Tooltip.fsm';
export type {
  TooltipContextValue,
  TooltipFSMEvent,
  TooltipFSMState,
  TooltipPlacement,
  TooltipProps,
  TooltipTrigger,
  TooltipVisualState,
} from './Tooltip.types';
