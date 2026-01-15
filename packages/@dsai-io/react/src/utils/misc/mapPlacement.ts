/**
 * mapPlacement - Maps component placement to Floating UI placement
 *
 * Converts DSAi component placement values to Floating UI compatible placements.
 * Currently a pass-through as our placements are already Floating UI compatible.
 *
 * @module utils/misc/mapPlacement
 *
 * Consolidated from:
 * - packages/@dsai-io/react/src/components/Dropdown/Dropdown.tsx
 * - packages/@dsai-io/react/src/components/Popover/Popover.tsx
 * - packages/@dsai-io/react/src/components/Tooltip/Tooltip.tsx
 */

import type { Placement } from '@floating-ui/react';

/** Valid placement values for floating UI components */
export type ComponentPlacement =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'left-start'
  | 'left-end'
  | 'right'
  | 'right-start'
  | 'right-end';

/**
 * Maps component placement to Floating UI placement.
 *
 * @param placement - The component placement value
 * @returns The Floating UI compatible placement
 *
 * @example
 * mapPlacement('bottom-start');  // 'bottom-start'
 * mapPlacement('top');           // 'top'
 * mapPlacement('right-end');     // 'right-end'
 */
export function mapPlacement(placement: ComponentPlacement): Placement {
  return placement;
}

export default mapPlacement;
