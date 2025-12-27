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
import type { MutableRefObject, Ref, RefCallback } from 'react';

export function mergeRefs<T>(
  ...refs: (Ref<T> | undefined)[] | [Array<Ref<T> | undefined>]
): RefCallback<T> {
  // Support both array and variadic signatures
  const refList = Array.isArray(refs[0]) && refs.length === 1 ? refs[0] : refs;

  return (value: T) => {
    refList.forEach((ref) => {
      if (!ref) {
        return;
      }

      if (typeof ref === 'function') {
        ref(value);
      } else {
        try {
          (ref as MutableRefObject<T | null>).current = value;
        } catch (error) {
          // Warn in development when ref assignment fails
          if (process.env['NODE_ENV'] !== 'production') {
            console.warn('[mergeRefs] Failed to assign ref:', error);
          }
        }
      }
    });
  };
}

export default mergeRefs;
