import type { ComponentType } from 'react';

/**
 * Gets the display name of a React component.
 *
 * Useful for debugging, error messages, and developer tools.
 * Checks displayName, name, and falls back to 'Component'.
 *
 * **Key Features**:
 * - Checks displayName property
 * - Falls back to function name
 * - Default for anonymous components
 * - Type-safe
 *
 * @param Component - React component
 * @returns Display name string
 *
 * @example
 * ```tsx
 * function withLogging<P extends object>(Component: ComponentType<P>) {
 *   const displayName = getDisplayName(Component);
 *
 *   return function WithLogging(props: P) {
 *     console.log(`Rendering ${displayName}`);
 *     return <Component {...props} />;
 *   };
 * }
 * ```
 *
 * @example
 * ```tsx
 * // In error messages
 * function validateProps<P>(Component: ComponentType<P>, props: P) {
 *   if (!props) {
 *     throw new Error(
 *       `${getDisplayName(Component)}: props cannot be undefined`
 *     );
 *   }
 * }
 * ```
 */
export function getDisplayName<P = Record<string, unknown>>(
  Component: ComponentType<P> | null | undefined
): string {
  if (!Component) {
    return 'Component';
  }

  // Check displayName property (manually set)
  if (Component.displayName) {
    return Component.displayName;
  }

  // Check function name
  if (Component.name) {
    return Component.name;
  }

  // Fallback for anonymous components
  return 'Component';
}
