import { isDev } from './isDev';

/**
 * Logs a warning message in development mode only.
 *
 * This function is tree-shakeable in production builds when used
 * with proper bundler configuration.
 *
 * **Key Features**:
 * - Development-only warnings
 * - Tree-shakeable in production
 * - Preserves stack traces
 * - Component-friendly formatting
 *
 * @param message - Warning message to display
 * @param component - Optional component name for context
 *
 * @example
 * ```tsx
 * function Button({ onClick, disabled }: ButtonProps) {
 *   if (!onClick && !disabled) {
 *     warn('Button has no onClick handler and is not disabled', 'Button');
 *   }
 *
 *   return <button onClick={onClick} disabled={disabled}>Click</button>;
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Deprecation warning
 * function OldAPI(value: string) {
 *   warn('OldAPI is deprecated. Use NewAPI instead.');
 *   return value.toUpperCase();
 * }
 * ```
 */
export function warn(message: string, component?: string): void {
  if (!isDev()) {
    return;
  }

  const prefix = component ? `[${component}]` : '[Warning]';

  // Use console.warn to preserve stack trace
  console.warn(`${prefix} ${message}`);
}
