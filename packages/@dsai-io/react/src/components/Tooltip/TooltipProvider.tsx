import type { TooltipProviderProps } from './Tooltip.types';
import {
  TooltipProviderContext,
  useTooltipContext,
} from './TooltipContext';

/**
 * TooltipProvider — sets global defaults for all descendant Tooltips.
 *
 * Resolution order: instance prop > TooltipProvider context > built-in defaults.
 *
 * @example
 * ```tsx
 * <TooltipProvider showDelay={400} touchEnabled={false}>
 *   <App />
 * </TooltipProvider>
 * ```
 */
export function TooltipProvider({
  children,
  showDelay,
  hideDelay,
  skipDelay,
  arrow,
  touchEnabled,
  describeChild,
}: TooltipProviderProps): React.JSX.Element {
  const parent = useTooltipContext();

  const value = {
    showDelay: showDelay ?? parent.showDelay,
    hideDelay: hideDelay ?? parent.hideDelay,
    skipDelay: skipDelay ?? parent.skipDelay,
    arrow: arrow ?? parent.arrow,
    touchEnabled: touchEnabled ?? parent.touchEnabled,
    describeChild: describeChild ?? parent.describeChild,
  };

  return (
    <TooltipProviderContext.Provider value={value}>
      {children}
    </TooltipProviderContext.Provider>
  );
}

TooltipProvider.displayName = 'TooltipProvider';
