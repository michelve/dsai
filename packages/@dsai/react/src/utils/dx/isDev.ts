/**
 * Detects if the code is running in development mode.
 *
 * Checks NODE_ENV and common development indicators.
 * This is useful for conditional warnings, debugging, and feature flags.
 *
 * **Key Features**:
 * - Checks NODE_ENV
 * - Detects __DEV__ global
 * - SSR-safe
 * - Cached result
 *
 * @returns True if in development mode
 *
 * @example
 * ```tsx
 * function Component({ value }: Props) {
 *   if (isDev() && !value) {
 *     console.warn('Component: value prop is undefined');
 *   }
 *
 *   return <div>{value}</div>;
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Conditional debug logging
 * function processData(data: unknown) {
 *   if (isDev()) {
 *     console.log('Processing data:', data);
 *   }
 *
 *   // ... processing logic
 * }
 * ```
 */
interface GlobalWithDev {
  __DEV__?: boolean;
}

export function isDev(): boolean {
  try {
    // Check NODE_ENV
    if (typeof process !== 'undefined' && process?.env?.NODE_ENV) {
      return process.env.NODE_ENV === 'development';
    }
  } catch {
    // Guard against ReferenceError in runtimes without process
    return false;
  }

  // Check __DEV__ global (used by React Native and some bundlers)
  if (typeof globalThis !== 'undefined' && '__DEV__' in globalThis) {
    return (globalThis as GlobalWithDev).__DEV__ === true;
  }

  // Default to false (production-safe)
  return false;
}
