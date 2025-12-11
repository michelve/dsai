/**
 * Resets form data to initial values.
 *
 * Creates a deep clone of initial values to avoid mutation issues.
 * Useful for "Reset" buttons or canceling edits.
 *
 * **Key Features**:
 * - Deep clone (no mutations)
 * - Nested object support
 * - Array support
 * - Type-safe
 *
 * @param initial - Initial form values
 * @returns New object with initial values (deep cloned)
 *
 * @example
 * ```tsx
 * const initialData = { name: 'John', email: 'john@example.com' };
 * const currentData = { name: 'Jane', email: 'jane@example.com' };
 *
 * const reset = resetForm(initialData);
 * // { name: 'John', email: 'john@example.com' }
 * // (new object, not same reference as initialData)
 * ```
 *
 * @example
 * ```tsx
 * // In a React component
 * function EditProfileForm({ user }: Props) {
 *   const [data, setData] = useState(user);
 *
 *   const handleReset = () => {
 *     setData(resetForm(user));
 *   };
 *
 *   return (
 *     <form>
 *       <input
 *         value={data.name}
 *         onChange={(e) => setData({ ...data, name: e.target.value })}
 *       />
 *       <button type="button" onClick={handleReset}>
 *         Reset
 *       </button>
 *     </form>
 *   );
 * }
 * ```
 */
export function resetForm<T extends Record<string, unknown>>(initial: T): T {
  // Deep clone to avoid mutations
  return JSON.parse(JSON.stringify(initial)) as T;
}
