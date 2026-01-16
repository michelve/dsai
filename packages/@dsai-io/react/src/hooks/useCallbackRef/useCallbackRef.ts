import { useCallback, useEffect, useRef } from 'react';

/**
 * Creates a stable callback ref that always calls the latest version of the callback.
 *
 * This hook solves the problem of stale closures in callbacks while maintaining
 * a stable reference that won't cause unnecessary re-renders when passed as a
 * dependency or prop.
 *
 * **Key Features**:
 * - Stable callback reference (same across renders)
 * - Always calls latest callback version
 * - Prevents unnecessary re-renders
 * - Type-safe with full inference
 * - SSR-safe
 *
 * **Use Cases**:
 * - Event handlers in useEffect
 * - Callbacks passed to memoized children
 * - setInterval/setTimeout callbacks
 * - Avoiding exhaustive-deps warnings
 *
 * @template T - The callback function type
 * @param callback - The callback function to stabilize
 * @returns Stable callback reference
 *
 * @example
 * ```tsx
 * function Counter() {
 *   const [count, setCount] = useState(0);
 *   const [multiplier, setMultiplier] = useState(2);
 *
 *   // This callback always uses latest multiplier value
 *   const increment = useCallbackRef(() => {
 *     setCount(c => c + multiplier);
 *   });
 *
 *   useEffect(() => {
 *     // increment is stable, won't recreate interval on multiplier change
 *     const id = setInterval(increment, 1000);
 *     return () => clearInterval(id);
 *   }, [increment]); // Safe to include, won't cause re-subscription
 *
 *   return (
 *     <div>
 *       <p>Count: {count}</p>
 *       <input
 *         type="number"
 *         value={multiplier}
 *         onChange={e => setMultiplier(Number(e.target.value))}
 *       />
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Preventing unnecessary memo invalidation
 * function ParentComponent() {
 *   const [value, setValue] = useState('');
 *   const [other, setOther] = useState(0);
 *
 *   // Stable reference even when 'other' changes
 *   const handleChange = useCallbackRef((newValue: string) => {
 *     console.log('Other value:', other);
 *     setValue(newValue);
 *   });
 *
 *   return (
 *     <div>
 *       <MemoizedChild onChange={handleChange} />
 *       <button onClick={() => setOther(o => o + 1)}>
 *         Change other: {other}
 *       </button>
 *     </div>
 *   );
 * }
 *
 * const MemoizedChild = memo(({ onChange }: { onChange: (v: string) => void }) => {
 *   console.log('Child render'); // Won't log when 'other' changes
 *   return <input onChange={e => onChange(e.target.value)} />;
 * });
 * ```
 */
export function useCallbackRef<T extends (...args: never[]) => unknown>(callback: T): T {
  const callbackRef = useRef(callback);

  // Update ref in effect to avoid ref updates during render
  useEffect(() => {
    callbackRef.current = callback;
  });

  // Return stable callback that invokes the current ref
  const stableCallback = useCallback((...args: Parameters<T>) => {
    return callbackRef.current(...args);
  }, []);

  return stableCallback as T;
}
