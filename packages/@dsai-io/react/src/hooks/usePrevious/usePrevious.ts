import { useRef } from 'react';

import type { UsePreviousReturn } from './usePrevious.types';

/**
 * Returns the previous value from the last render.
 *
 * This hook stores the value from the previous render cycle, which is useful
 * for comparing current and previous values, implementing animations based on
 * value changes, or detecting when a value has changed.
 *
 * **Key Features**:
 * - Returns `undefined` on first render
 * - Updates automatically on every render
 * - Memory efficient (single ref)
 * - Full TypeScript type preservation
 * - SSR-safe
 *
 * @template T - The type of the value to track
 * @param value - The current value to track
 * @returns The previous value, or undefined on first render
 *
 * @example
 * ```tsx
 * function Counter() {
 *   const [count, setCount] = useState(0);
 *   const prevCount = usePrevious(count);
 *
 *   return (
 *     <div>
 *       <p>Current: {count}</p>
 *       <p>Previous: {prevCount ?? 'none'}</p>
 *       <button onClick={() => setCount(c => c + 1)}>Increment</button>
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Detect value changes
 * function UserProfile({ userId }: { userId: string }) {
 *   const prevUserId = usePrevious(userId);
 *
 *   useEffect(() => {
 *     if (prevUserId && prevUserId !== userId) {
 *       console.log(`User changed from ${prevUserId} to ${userId}`);
 *       // Fetch new user data
 *     }
 *   }, [userId, prevUserId]);
 *
 *   return <div>User ID: {userId}</div>;
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Animation based on direction
 * function AnimatedNumber({ value }: { value: number }) {
 *   const prevValue = usePrevious(value);
 *   const isIncreasing = prevValue !== undefined && value > prevValue;
 *
 *   return (
 *     <span className={isIncreasing ? 'animate-up' : 'animate-down'}>
 *       {value}
 *     </span>
 *   );
 * }
 * ```
 */
export function usePrevious<T>(value: T): UsePreviousReturn<T> {
  const ref = useRef<UsePreviousReturn<T>>(undefined);
  // Intentional render-time access to capture the previous render's value for immediate use
  // eslint-disable-next-line react-hooks/refs
  const previous = ref.current;

  // eslint-disable-next-line react-hooks/refs
  ref.current = value;

  return previous;
}
