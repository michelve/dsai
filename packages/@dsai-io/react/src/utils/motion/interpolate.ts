/**
 * Options for the interpolate function
 */
export interface InterpolateOptions {
  /**
   * When true, clamps output to the output range bounds (prevents extrapolation).
   * When false or undefined, allows extrapolation beyond bounds.
   * @default false
   */
  clamp?: boolean;
}

/**
 * Interpolate a value from one range to another
 *
 * Maps a value from the input range to the output range using linear interpolation.
 * Supports extrapolation (values outside input range) unless `clamp` option is true.
 *
 * @param value - Value to interpolate
 * @param inputRange - Input range [min, max]
 * @param outputRange - Output range [min, max]
 * @param options - Optional configuration (e.g., { clamp: true } to prevent extrapolation)
 * @returns Interpolated value
 * @throws Error if input/output ranges have different lengths or less than 2 values
 * @throws Error if value is NaN or Infinity
 *
 * @example
 * ```typescript
 * // Map 0-100 to 0-1
 * interpolate(50, [0, 100], [0, 1]); // Returns 0.5
 *
 * // Map with extrapolation
 * interpolate(150, [0, 100], [0, 1]); // Returns 1.5
 *
 * // Map with clamping (prevents extrapolation)
 * interpolate(150, [0, 100], [0, 1], { clamp: true }); // Returns 1
 *
 * // Multi-segment interpolation
 * interpolate(50, [0, 50, 100], [0, 0.8, 1]); // Returns 0.8
 * ```
 */
/* eslint-disable security/detect-object-injection -- Array access via loop index and calculated segment index is safe */

/**
 * Find the segment index containing the given value within the input range.
 */
function findSegmentIndex(value: number, inputRange: number[]): number {
  let segmentIndex = 0;
  for (let i = 1; i < inputRange.length; i++) {
    const prevValue = inputRange[i - 1];
    const currValue = inputRange[i];

    if (prevValue !== undefined && currValue !== undefined) {
      if (value >= prevValue && value <= currValue) {
        segmentIndex = i - 1;
        break;
      }
      if (value > currValue) {
        segmentIndex = i - 1;
      }
    }
  }
  return segmentIndex;
}

/**
 * Clamp a result to the bounds of the output range.
 */
function clampToRange(result: number, outputRange: number[]): number {
  const minOutput = Math.min(outputRange[0] ?? 0, outputRange.at(-1) ?? 0);
  const maxOutput = Math.max(outputRange[0] ?? 0, outputRange.at(-1) ?? 0);
  return Math.max(minOutput, Math.min(maxOutput, result));
}

export function interpolate(
  value: number,
  inputRange: number[],
  outputRange: number[],
  options?: InterpolateOptions
): number {
  // Validate value is a finite number
  if (!Number.isFinite(value)) {
    throw new TypeError('Value must be a finite number');
  }
  // Validate ranges
  if (inputRange.length !== outputRange.length) {
    throw new TypeError('Input and output ranges must have the same length');
  }
  if (inputRange.length < 2) {
    throw new TypeError('Ranges must have at least 2 values');
  }

  // Find the segment containing the value
  const segmentIndex = findSegmentIndex(value, inputRange);

  const inputMin = inputRange[segmentIndex];
  const inputMax = inputRange[segmentIndex + 1];
  const outputMin = outputRange[segmentIndex];
  const outputMax = outputRange[segmentIndex + 1];

  // Type guards for undefined
  if (
    inputMin === undefined ||
    inputMax === undefined ||
    outputMin === undefined ||
    outputMax === undefined
  ) {
    throw new TypeError('Invalid segment index');
  }

  // Handle edge case where input range has no width
  if (inputMax === inputMin) {
    return outputMin;
  }

  // Linear interpolation (with extrapolation support unless clamped)
  const ratio = (value - inputMin) / (inputMax - inputMin);
  const result = outputMin + ratio * (outputMax - outputMin);

  // Apply clamping if requested
  if (options?.clamp) {
    return clampToRange(result, outputRange);
  }

  return result;
}
/* eslint-enable security/detect-object-injection */
