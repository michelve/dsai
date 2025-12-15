import { useCallback, useEffect, useRef, useState } from 'react';

import type {
  UseControllableStateOptions,
  UseControllableStateReturn,
} from './useControllableState.types';

/**
 * Manages state that can be either controlled or uncontrolled.
 *
 * This hook enables components to work in both controlled and uncontrolled modes,
 * following the React controlled component pattern. It's the foundation for
 * form components and other stateful UI elements.
 *
 * **Key Features**:
 * - Automatic controlled/uncontrolled detection
 * - Development warnings for mode switches
 * - Stable callback references
 * - Full TypeScript type inference
 * - SSR-safe
 *
 * @template T - The type of the state value
 * @param options - Configuration options
 * @returns A tuple of [value, setValue] similar to useState
 *
 * @example
 * ```tsx
 * // Uncontrolled mode (internal state)
 * function Counter() {
 *   const [count, setCount] = useControllableState({
 *     defaultValue: 0,
 *     onChange: (value) => console.log('Count changed:', value)
 *   });
 *
 *   return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Controlled mode (parent manages state)
 * function ControlledCounter({ value, onChange }: { value: number; onChange: (v: number) => void }) {
 *   const [count, setCount] = useControllableState({
 *     value,
 *     onChange
 *   });
 *
 *   return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Flexible component supporting both modes
 * interface Props {
 *   value?: number;
 *   defaultValue?: number;
 *   onChange?: (value: number) => void;
 * }
 *
 * function FlexibleCounter({ value, defaultValue = 0, onChange }: Props) {
 *   const [count, setCount] = useControllableState({
 *     value,
 *     defaultValue,
 *     onChange
 *   });
 *
 *   return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
 * }
 * ```
 */
export function useControllableState<T>({
  value: valueProp,
  defaultValue,
  onChange,
}: UseControllableStateOptions<T>): UseControllableStateReturn<T> {
  const [internalValue, setInternalValue] = useState<T>(defaultValue as T);

  // Determine if component is controlled
  const isControlled = valueProp !== undefined;
  const wasControlledRef = useRef<boolean>(isControlled);

  // Warn if component switches between controlled and uncontrolled (in effect, not during render)
  useEffect(() => {
    if (process.env['NODE_ENV'] !== 'production') {
      if (wasControlledRef.current !== isControlled) {
        console.warn(
          `useControllableState: A component changed from ${
            wasControlledRef.current ? 'controlled' : 'uncontrolled'
          } to ${
            isControlled ? 'controlled' : 'uncontrolled'
          }. This is likely caused by the value changing from a defined to undefined value or vice versa. ` +
            `Decide between using a controlled or uncontrolled component for the lifetime of the component.`
        );
      }

      wasControlledRef.current = isControlled;
    }
  }, [isControlled]);

  // Use controlled value if provided, otherwise use internal state
  const value = isControlled ? (valueProp as T) : internalValue;

  // Stable setValue function
  const setValue = useCallback(
    (nextValue: T | ((prev: T) => T), event?: unknown) => {
      const resolvedValue =
        typeof nextValue === 'function' ? (nextValue as (prev: T) => T)(value) : nextValue;

      // Update internal state if uncontrolled
      if (!isControlled) {
        setInternalValue(resolvedValue);
      }

      // Always call onChange if provided
      if (event === undefined) {
        onChange?.(resolvedValue);
      } else {
        onChange?.(resolvedValue, event);
      }
    },
    [value, onChange, isControlled]
  );

  return [value, setValue];
}
