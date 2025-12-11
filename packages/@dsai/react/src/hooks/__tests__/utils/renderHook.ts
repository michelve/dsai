/**
 * RenderHook Utility
 *
 * Wrapper around @testing-library/react's renderHook with DSAi-specific configurations.
 * Provides enhanced testing capabilities for hooks, including SSR simulation.
 *
 * @example
 * ```ts
 * import { renderHook, act, waitFor } from '../__tests__/utils';
 *
 * it('updates state correctly', () => {
 *   const { result } = renderHook(() => useCounter());
 *
 *   act(() => {
 *     result.current.increment();
 *   });
 *
 *   expect(result.current.count).toBe(1);
 * });
 * ```
 */

import {
  renderHook as rtlRenderHook,
  type RenderHookOptions,
  type RenderHookResult,
} from '@testing-library/react';

/**
 * Extended render hook options with DSAi-specific configurations.
 */
export interface DSAiRenderHookOptions<TProps> extends RenderHookOptions<TProps> {
  /**
   * Whether to simulate SSR mode (no window/document).
   * When true, window and document will be temporarily undefined during rendering.
   *
   * @default false
   */
  ssr?: boolean;
}

/**
 * Wrapper around @testing-library/react's renderHook with DSAi defaults.
 *
 * Supports all standard renderHook options plus SSR simulation via the `ssr` option.
 *
 * @param render - The hook to test
 * @param options - Configuration options
 * @returns RenderHookResult with hook result and utilities
 *
 * @example
 * Basic usage:
 * ```ts
 * const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
 * expect(result.current).toBe(false);
 * ```
 *
 * @example
 * With props:
 * ```ts
 * const { result, rerender } = renderHook(
 *   ({ query }) => useMediaQuery(query),
 *   { initialProps: { query: '(min-width: 768px)' } }
 * );
 *
 * rerender({ query: '(min-width: 992px)' });
 * ```
 *
 * @example
 * SSR mode:
 * ```ts
 * const { result } = renderHook(
 *   () => useMediaQuery('(min-width: 768px)', { defaultValue: true }),
 *   { ssr: true }
 * );
 * expect(result.current).toBe(true);
 * ```
 */
export function renderHook<TResult, TProps = Record<string, never>>(
  render: (props: TProps) => TResult,
  options?: DSAiRenderHookOptions<TProps>
): RenderHookResult<TResult, TProps> {
  const { ssr = false, ...rtlOptions } = options ?? {};

  if (ssr) {
    // Temporarily enter SSR mode
    const originalWindow = global.window;
    const originalDocument = global.document;

    // @ts-expect-error - SSR simulation
    delete global.window;
    // @ts-expect-error - SSR simulation
    delete global.document;

    try {
      return rtlRenderHook(render, rtlOptions);
    } finally {
      global.window = originalWindow;
      global.document = originalDocument;
    }
  }

  return rtlRenderHook(render, rtlOptions);
}

/**
 * Re-export act for convenience.
 *
 * Use `act` to wrap state updates and ensure they're flushed before assertions.
 *
 * @example
 * ```ts
 * import { renderHook, act } from '../__tests__/utils';
 *
 * const { result } = renderHook(() => useCounter());
 *
 * act(() => {
 *   result.current.increment();
 * });
 *
 * expect(result.current.count).toBe(1);
 * ```
 */
export { act } from '@testing-library/react';

/**
 * Re-export waitFor for convenience.
 *
 * Use `waitFor` to wait for async state updates or side effects.
 *
 * @example
 * ```ts
 * import { renderHook, waitFor } from '../__tests__/utils';
 *
 * const { result } = renderHook(() => useAsyncData());
 *
 * await waitFor(() => {
 *   expect(result.current.loading).toBe(false);
 *   expect(result.current.data).toBeDefined();
 * });
 * ```
 */
export { waitFor } from '@testing-library/react';
