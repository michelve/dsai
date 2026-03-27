import { FloatingDelayGroup } from '@floating-ui/react';

import { useTooltipContext } from './TooltipContext';

import type { TooltipGroupProps } from './Tooltip.types';

/**
 * TooltipGroup — coordinates delay timing across sibling tooltips.
 *
 * When one tooltip is open and the user moves to another within the skip window,
 * the second tooltip opens instantly (no show delay).
 *
 * @example
 * ```tsx
 * <TooltipGroup>
 *   <Tooltip content="Bold"><Button>B</Button></Tooltip>
 *   <Tooltip content="Italic"><Button>I</Button></Tooltip>
 *   <Tooltip content="Underline"><Button>U</Button></Tooltip>
 * </TooltipGroup>
 * ```
 */
export function TooltipGroup({
  children,
  skipDelay,
}: TooltipGroupProps): React.JSX.Element {
  const ctx = useTooltipContext();
  const resolvedSkipDelay = skipDelay ?? ctx.skipDelay;

  return (
    <FloatingDelayGroup
      delay={{ open: ctx.showDelay, close: ctx.hideDelay }}
      timeoutMs={resolvedSkipDelay}
    >
      {children}
    </FloatingDelayGroup>
  );
}

TooltipGroup.displayName = 'TooltipGroup';
