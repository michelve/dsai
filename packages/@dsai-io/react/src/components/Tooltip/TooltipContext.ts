import { createContext, useContext } from 'react';

export interface TooltipProviderContextValue {
  showDelay: number;
  hideDelay: number;
  skipDelay: number;
  arrow: boolean;
  touchEnabled: boolean;
  describeChild: boolean;
}

export const TOOLTIP_DEFAULTS: TooltipProviderContextValue = {
  showDelay: 300,
  hideDelay: 150,
  skipDelay: 300,
  arrow: true,
  touchEnabled: false,
  describeChild: true,
};

export const TooltipProviderContext =
  createContext<TooltipProviderContextValue>(TOOLTIP_DEFAULTS);

/**
 * Read current tooltip defaults from the nearest TooltipProvider.
 * Falls back to TOOLTIP_DEFAULTS when no provider is present.
 */
export function useTooltipContext(): TooltipProviderContextValue {
  return useContext(TooltipProviderContext);
}
