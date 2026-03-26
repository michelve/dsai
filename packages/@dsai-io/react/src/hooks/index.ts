/**
 * DSAi Hooks
 *
 * Reusable React hooks for common functionality.
 * These provide stateful logic that can be shared across components.
 *
 * @example
 * ```tsx
 * import { useFocusTrap, useMediaQuery, useDebounce, useLocalStorage } from '@dsai-io/react';
 * ```
 */

// Accessibility Hooks
export { useFocusTrap } from './useFocusTrap';
export type { UseFocusTrapOptions, UseFocusTrapReturn } from './useFocusTrap';

export { useRovingFocus } from './useRovingFocus';
export type { UseRovingFocusOptions, UseRovingFocusReturn } from './useRovingFocus';

export { useReducedMotion } from './useReducedMotion';
export type { UseReducedMotionOptions } from './useReducedMotion';

// UI Hooks
export { useScrollLock } from './useScrollLock';
export type {
  UseScrollLockOptions,
  UseScrollLockReturn,
} from './useScrollLock';

export {
  BREAKPOINTS,
  breakpointBetween,
  breakpointDown,
  breakpointUp,
  getBreakpointValue,
  useIsDesktop,
  useIsLargeDesktop,
  useIsMobile,
  useIsTablet,
  useMediaQuery,
} from './useMediaQuery';
export type { Breakpoint, UseMediaQueryOptions } from './useMediaQuery';

// State Hooks
export { useControllableState } from './useControllableState';
export type {
  UseControllableStateOptions,
  UseControllableStateReturn,
} from './useControllableState';

export { usePrevious } from './usePrevious';
export type { UsePreviousReturn } from './usePrevious';

export { useLocalStorage } from './useLocalStorage';
export type { UseStorageOptions, UseStorageReturn } from './useLocalStorage';

export { useSessionStorage } from './useSessionStorage';

export { useDebounce } from './useDebounce';
export type { UseDebounceOptions, UseDebouncedValue } from './useDebounce';

export { useThrottle } from './useThrottle';
export type { UseThrottleOptions, UseThrottledValue } from './useThrottle';

// Form Hooks
export { useField } from './useField';
export type { UseFieldActions, UseFieldOptions, UseFieldReturn, UseFieldState } from './useField';
export { useForm } from './useForm';
export type {
  FieldHandlers,
  FieldState,
  FormActions,
  FormState,
  FormValidationSchema,
  UseFormOptions,
  UseFormReturn,
} from './useForm';

// Event Hooks
export { useClickOutside } from './useClickOutside';
export type {
  UseClickOutsideCallback,
  UseClickOutsideOptions,
  UseClickOutsideRefs,
} from './useClickOutside';

export { useKeyPress } from './useKeyPress';
export type { UseKeyPressOptions, UseKeyPressReturn } from './useKeyPress';

export { useHover } from './useHover';
export type { UseHoverOptions, UseHoverReturn } from './useHover';

export { useIntersectionObserver } from './useIntersectionObserver';
export type {
  UseIntersectionObserverOptions,
  UseIntersectionObserverReturn,
} from './useIntersectionObserver';

export { useResizeObserver } from './useResizeObserver';
export type { UseResizeObserverOptions, UseResizeObserverReturn } from './useResizeObserver';

// Utility Hooks
export { useMounted } from './useMounted';

export { useCallbackRef } from './useCallbackRef';

export { useAsync } from './useAsync';
export type { AsyncState, AsyncStatus, UseAsyncReturn } from './useAsync';

export { useId } from './useId';

// UI Hooks (Theme)
export { useDarkMode } from './useDarkMode';
export type { UseDarkModeOptions, UseDarkModeReturn } from './useDarkMode';
