/**
 * clamp - Constrains a number to a min/max range.
 *
 * @param value - The number to clamp
 * @param min - Minimum allowed value
 * @param max - Maximum allowed value
 * @returns The clamped value
 *
 * @example
 * clamp(10, 0, 5)  // => 5
 * clamp(-5, 0, 10) // => 0
 * clamp(7, 0, 10)  // => 7
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export default clamp;
