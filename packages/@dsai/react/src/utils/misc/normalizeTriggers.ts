/**
 * normalizeTriggers - Normalizes trigger prop to array format
 *
 * Converts a single trigger or array of triggers into a consistent array format
 * for use in floating UI components like Tooltip and Popover.
 *
 * @module utils/misc/normalizeTriggers
 *
 * Consolidated from:
 * - packages/@dsai/react/src/components/Popover/Popover.tsx
 * - packages/@dsai/react/src/components/Tooltip/Tooltip.tsx
 */

/** Valid trigger types for floating components */
export type FloatingTrigger = 'hover' | 'focus' | 'click';

/**
 * Normalizes a trigger or array of triggers into a consistent array format.
 *
 * @param trigger - Single trigger or array of triggers
 * @returns Array of triggers
 *
 * @example
 * normalizeTriggers('hover');           // ['hover']
 * normalizeTriggers(['hover', 'focus']); // ['hover', 'focus']
 * normalizeTriggers('click');           // ['click']
 */
export function normalizeTriggers(trigger: FloatingTrigger | FloatingTrigger[]): FloatingTrigger[] {
  if (Array.isArray(trigger)) {
    return trigger;
  }
  return [trigger];
}

export default normalizeTriggers;
