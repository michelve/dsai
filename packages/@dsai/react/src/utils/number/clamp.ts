/**
 * clamp - Constrains a number to a min/max range.
 *
 * @example
 * clamp(10, 0, 5) // 5
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export default clamp;
