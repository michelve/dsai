/**
 * Tooltip Component
 *
 * A fully accessible tooltip component for providing contextual information.
 *
 * @example
 * ```tsx
 * import { Tooltip, TooltipProvider, TooltipGroup } from '@dsai-io/react';
 *
 * <TooltipProvider>
 *   <TooltipGroup>
 *     <Tooltip content="Bold"><button>B</button></Tooltip>
 *     <Tooltip content="Italic"><button>I</button></Tooltip>
 *   </TooltipGroup>
 * </TooltipProvider>
 * ```
 */
export { Tooltip } from './Tooltip';
export { TooltipProvider } from './TooltipProvider';
export { TooltipGroup } from './TooltipGroup';
export {
  createInitialTooltipFSMState,
  getTooltipVisualState,
  tooltipFSMReducer,
} from './Tooltip.fsm';
export type {
  TooltipContextValue,
  TooltipFSMEvent,
  TooltipFSMState,
  TooltipGroupProps,
  TooltipPlacement,
  TooltipProps,
  TooltipProviderProps,
  TooltipTrigger,
  TooltipVisualState,
} from './Tooltip.types';
