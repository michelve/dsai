import { useEffect, useRef, useState } from 'react';

import type { UseDebouncedValue, UseDebounceOptions } from './useDebounce.types';

/**
 * Debounces a value, delaying its update until after a specified delay.
 *
 * This hook is essential for optimizing performance in scenarios where rapid
 * value changes occur, such as search inputs, resize handlers, or scroll events.
 * It ensures expensive operations only execute after the value has stabilized.
 *
 * **Key Features**:
 * - Configurable delay in milliseconds
 * - Leading and trailing edge invocation options
 * - Maximum wait time to guarantee execution
 * - Automatic cleanup on unmount
 * - Type-safe with generic inference
 * - SSR-safe (no browser API dependencies)
 *
 * @template T - The type of value being debounced
 * @param value - The value to debounce
 * @param delay - The delay in milliseconds
 * @param options - Configuration options
 * @returns The debounced value
 *
 * @example
 * ```tsx
 * function SearchInput() {
 *   const [search, setSearch] = useState('');
 *   const debouncedSearch = useDebounce(search, 500);
 *
 *   useEffect(() => {
 *     if (debouncedSearch) {
 *       // API call only happens 500ms after user stops typing
 *       fetchResults(debouncedSearch);
 *     }
 *   }, [debouncedSearch]);
 *
 *   return (
 *     <input
 *       value={search}
 *       onChange={(e) => setSearch(e.target.value)}
 *       placeholder="Search..."
 *     />
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Leading edge execution for immediate feedback
 * function WindowSize() {
 *   const [size, setSize] = useState({ width: 0, height: 0 });
 *   const debouncedSize = useDebounce(size, 200, { leading: true });
 *
 *   useEffect(() => {
 *     const handleResize = () => {
 *       setSize({ width: window.innerWidth, height: window.innerHeight });
 *     };
 *     window.addEventListener('resize', handleResize);
 *     handleResize(); // Initial call
 *     return () => window.removeEventListener('resize', handleResize);
 *   }, []);
 *
 *   return <div>{debouncedSize.width} x {debouncedSize.height}</div>;
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Maximum wait to ensure periodic updates
 * function ScrollTracker() {
 *   const [scrollY, setScrollY] = useState(0);
 *   const debouncedScrollY = useDebounce(scrollY, 500, {
 *     maxWait: 1000, // Guarantee update at least every 1s
 *   });
 *
 *   useEffect(() => {
 *     const handleScroll = () => setScrollY(window.scrollY);
 *     window.addEventListener('scroll', handleScroll);
 *     return () => window.removeEventListener('scroll', handleScroll);
 *   }, []);
 *
 *   return <div>Scroll position: {debouncedScrollY}px</div>;
 * }
 * ```
 */
export function useDebounce<T>(
  value: T,
  delay: number,
  options: UseDebounceOptions = {}
): UseDebouncedValue<T> {
  const { leading = false, trailing = true, maxWait } = options;

  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const lastInvokeTimeRef = useRef<number>(0);

  useEffect(() => {
    const currentTime = Date.now();
    const timeSinceLastInvoke = currentTime - lastInvokeTimeRef.current;

    // Determine if we should invoke on leading edge
    const shouldInvokeLeading = leading && timeSinceLastInvoke >= delay;

    if (shouldInvokeLeading) {
      lastInvokeTimeRef.current = currentTime;
    }

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Calculate wait time
    let waitTime = delay;
    if (maxWait !== undefined && timeSinceLastInvoke < maxWait) {
      waitTime = Math.min(delay, maxWait - timeSinceLastInvoke);
    }

    // Set new timeout for trailing edge
    timeoutRef.current = setTimeout(() => {
      const invokeTime = Date.now();
      const timeSinceInvoke = invokeTime - lastInvokeTimeRef.current;

      // Only invoke if enough time has passed or maxWait is exceeded
      if (trailing && (timeSinceInvoke >= delay || (maxWait && timeSinceInvoke >= maxWait))) {
        setDebouncedValue(value);
        lastInvokeTimeRef.current = invokeTime;
      }
    }, waitTime);

    // Cleanup on unmount or value change
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, delay, leading, trailing, maxWait]);

  return debouncedValue;
}
