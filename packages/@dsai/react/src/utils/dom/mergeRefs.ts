/**
 * mergeRefs - Safely composes multiple React refs into a single callback.
 *
 * Supports function refs and mutable object refs. No-ops for null/undefined refs.
 *
 * @example
 * const mergedRef = mergeRefs([forwardedRef, localRef]);
 * <input ref={mergedRef} />
 */
import type { MutableRefObject, Ref, RefCallback } from 'react';

export function mergeRefs<T>(refs: Array<Ref<T> | undefined | null>): RefCallback<T> {
  return (value: T) => {
    for (const ref of refs) {
      if (!ref) {
        continue;
      }
      if (typeof ref === 'function') {
        ref(value);
      } else {
        try {
          (ref as MutableRefObject<T | null>).current = value;
        } catch {
          // Ignore assignment errors
        }
      }
    }
  };
}

export default mergeRefs;
