/**
 * Asserts that a condition is true, throwing an error if it's false.
 *
 * This is useful for runtime assertions that should always be true.
 * The function throws in both development and production, unlike warn/warnOnce.
 *
 * **Key Features**:
 * - Type narrowing via assertion
 * - Descriptive error messages
 * - Stack trace preservation
 * - Production-safe (throws real errors)
 *
 * @param condition - Condition that must be true
 * @param message - Error message if condition is false
 * @throws {Error} If condition is false
 *
 * @example
 * ```tsx
 * function getUser(id: string | null): User {
 *   invariant(id !== null, 'User ID cannot be null');
 *
 *   // TypeScript knows id is string here
 *   return fetchUser(id);
 * }
 * ```
 *
 * @example
 * ```tsx
 * // With type narrowing
 * function processValue(value: string | number) {
 *   invariant(typeof value === 'string', 'Expected string value');
 *
 *   // TypeScript knows value is string here
 *   return value.toUpperCase();
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Array bounds checking
 * function getFirst<T>(items: T[]): T {
 *   invariant(items.length > 0, 'Array must not be empty');
 *
 *   return items[0];
 * }
 * ```
 */
export function invariant(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(`Invariant violation: ${message}`);
  }
}
