import { useEffect, useRef, useState } from 'react';

import type { UseThrottledValue, UseThrottleOptions } from './useThrottle.types';

/**
 * Throttles a value, limiting how frequently it can update.
 *
 * This hook ensures a value only updates at most once per specified interval,
 * regardless of how frequently the input value changes. Unlike debounce which
 * delays execution, throttle guarantees execution at regular intervals.
 *
 * **Key Features**:
 * - Configurable interval in milliseconds
 * - Leading and trailing edge invocation options
 * - Guaranteed execution frequency
 * - Automatic cleanup on unmount
 * - Type-safe with generic inference
 * - SSR-safe (no browser API dependencies)
 *
 * **Debounce vs Throttle**:
 * - **Debounce**: Delays execution until after changes stop (e.g., search input)
 * - **Throttle**: Executes at regular intervals during changes (e.g., scroll handler)
 *
 * @template T - The type of value being throttled
 * @param value - The value to throttle
 * @param interval - The throttle interval in milliseconds
 * @param options - Configuration options
 * @returns The throttled value
 *
 * @example
 * ```tsx
 * function ScrollProgress() {
 *   const [scrollY, setScrollY] = useState(0);
 *   const throttledScrollY = useThrottle(scrollY, 100);
 *
 *   useEffect(() => {
 *     const handleScroll = () => setScrollY(window.scrollY);
 *     window.addEventListener('scroll', handleScroll);
 *     return () => window.removeEventListener('scroll', handleScroll);
 *   }, []);
 *
 *   // Updates at most once per 100ms during scroll
 *   return <div>Scroll: {throttledScrollY}px</div>;
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Leading edge only (immediate response, then cooldown)
 * function MousePosition() {
 *   const [position, setPosition] = useState({ x: 0, y: 0 });
 *   const throttledPosition = useThrottle(position, 200, {
 *     leading: true,
 *     trailing: false,
 *   });
 *
 *   useEffect(() => {
 *     const handleMove = (e: MouseEvent) => {
 *       setPosition({ x: e.clientX, y: e.clientY });
 *     };
 *     window.addEventListener('mousemove', handleMove);
 *     return () => window.removeEventListener('mousemove', handleMove);
 *   }, []);
 *
 *   return <div>Mouse: {throttledPosition.x}, {throttledPosition.y}</div>;
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Trailing edge only (delayed, but guaranteed final update)
 * function WindowResize() {
 *   const [size, setSize] = useState({ width: 0, height: 0 });
 *   const throttledSize = useThrottle(size, 500, {
 *     leading: false,
 *     trailing: true,
 *   });
 *
 *   useEffect(() => {
 *     const handleResize = () => {
 *       setSize({ width: window.innerWidth, height: window.innerHeight });
 *     };
 *     window.addEventListener('resize', handleResize);
 *     handleResize();
 *     return () => window.removeEventListener('resize', handleResize);
 *   }, []);
 *
 *   return <div>{throttledSize.width} x {throttledSize.height}</div>;
 * }
 * ```
 */
export function useThrottle<T>(
  value: T,
  interval: number,
  options: UseThrottleOptions = {}
): UseThrottledValue<T> {
  const { leading = true, trailing = true } = options;

  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastInvokeTimeRef = useRef<number>(0);
  const leadingInvokedRef = useRef<boolean>(false);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    const currentTime = Date.now();
    const timeSinceLastInvoke = currentTime - lastInvokeTimeRef.current;

    // Check if we can invoke on leading edge
    const canInvokeLeading = leading && timeSinceLastInvoke >= interval;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Calculate when to invoke
    if (canInvokeLeading && !leadingInvokedRef.current) {
      // Invoke immediately on leading edge via timeout
      timeoutRef.current = setTimeout(() => {
        setThrottledValue(value);
        lastInvokeTimeRef.current = Date.now();
        leadingInvokedRef.current = true;
      }, 0);
    } else if (trailing) {
      // Schedule trailing edge invocation
      const remainingTime = interval - timeSinceLastInvoke;
      timeoutRef.current = setTimeout(
        () => {
          setThrottledValue(value);
          lastInvokeTimeRef.current = Date.now();
          leadingInvokedRef.current = false;
        },
        Math.max(0, remainingTime)
      );
    }

    // Cleanup on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, interval, leading, trailing]);

  return throttledValue;
}
