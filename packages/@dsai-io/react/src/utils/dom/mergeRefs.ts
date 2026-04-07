/**
 * mergeRefs - Safely composes multiple React refs into a single callback.
 *
 * Supports both function refs and mutable object refs. Handles null/undefined
 * refs gracefully. In development mode, warns when ref assignment fails.
 *
 * Supports both array and variadic signatures for maximum flexibility:
 * - mergeRefs(ref1, ref2, ref3) - variadic
 * - mergeRefs([ref1, ref2, ref3]) - array
 *
 * @param refs - Variable number of refs to merge, or a single array of refs
 * @returns A callback ref that updates all provided refs
 *
 * @example
 * ```tsx
 * // Variadic signature
 * const Component = forwardRef((props, ref) => {
 *   const localRef = useRef();
 *   return <div ref={mergeRefs(ref, localRef)} />;
 * });
 *
 * // Array signature
 * const merged = mergeRefs([ref1, ref2, ref3]);
 * ```
 */
import type { Ref, RefCallback } from 'react';

/**
 * Assign a value to a single ref (function or object ref).
 */
function assignRef<T>(ref: Ref<T>, value: T): void {
  if (typeof ref === 'function') {
    ref(value);
  } else {
    try {
      ref.current = value;
    } catch (error) {
      if (process.env['NODE_ENV'] !== 'production') {
        console.warn('[mergeRefs] Failed to assign ref:', error);
      }
    }
  }
}

export function mergeRefs<T>(
  ...refs: (Ref<T> | undefined)[] | [Array<Ref<T> | undefined>]
): RefCallback<T> {
  // Support both array and variadic signatures
  const refList = Array.isArray(refs[0]) && refs.length === 1 ? refs[0] : refs;

  return (value: T) => {
    for (const ref of refList) {
      if (ref) {
        assignRef(ref, value);
      }
    }
  };
}

export default mergeRefs;
