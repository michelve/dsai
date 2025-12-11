import { isDev } from './isDev';

/**
 * Cache for warnings that have been shown.
 */
const warnedMessages = new Set<string>();

/**
 * Logs a warning message once per unique key in development mode.
 *
 * Useful for warnings that might be triggered many times but should
 * only be shown once to avoid console spam.
 *
 * **Key Features**:
 * - Development-only warnings
 * - Deduplication by key
 * - Tree-shakeable in production
 * - Preserves stack traces
 *
 * @param key - Unique key for this warning
 * @param message - Warning message to display
 * @param component - Optional component name for context
 *
 * @example
 * ```tsx
 * function DataTable({ data }: Props) {
 *   data.forEach((item) => {
 *     if (!item.id) {
 *       warnOnce('missing-id', 'DataTable items should have an id property', 'DataTable');
 *     }
 *   });
 *
 *   return <table>...</table>;
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Deprecation warning shown once
 * function useOldHook() {
 *   warnOnce(
 *     'use-old-hook-deprecated',
 *     'useOldHook is deprecated. Use useNewHook instead.'
 *   );
 *
 *   return {};
 * }
 * ```
 */
export function warnOnce(key: string, message: string, component?: string): void {
  if (!isDev()) {
    return;
  }

  if (warnedMessages.has(key)) {
    return;
  }

  warnedMessages.add(key);

  const prefix = component ? `[${component}]` : '[Warning]';

  // Use console.warn to preserve stack trace
  console.warn(`${prefix} ${message}`);
}

/**
 * Clears the warning cache.
 *
 * Useful for testing or resetting warning state.
 *
 * @example
 * ```tsx
 * // In tests
 * afterEach(() => {
 *   clearWarnings();
 * });
 * ```
 */
export function clearWarnings(): void {
  warnedMessages.clear();
}
