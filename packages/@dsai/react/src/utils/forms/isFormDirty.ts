/**
 * Checks if form data has changed from initial values.
 *
 * Performs deep equality comparison to detect changes.
 * Useful for "unsaved changes" warnings.
 *
 * **Key Features**:
 * - Deep equality comparison
 * - Nested object support
 * - Array support
 * - Type-safe
 *
 * @param current - Current form data
 * @param initial - Initial form data
 * @returns True if data has changed
 *
 * @example
 * ```tsx
 * const initial = { name: 'John', email: 'john@example.com' };
 * const current = { name: 'Jane', email: 'john@example.com' };
 *
 * const isDirty = isFormDirty(current, initial);
 * // true
 * ```
 *
 * @example
 * ```tsx
 * // With nested objects
 * const initial = {
 *   user: { name: 'John', age: 30 },
 *   tags: ['react']
 * };
 * const current = {
 *   user: { name: 'John', age: 31 },
 *   tags: ['react']
 * };
 *
 * const isDirty = isFormDirty(current, initial);
 * // true (age changed)
 * ```
 *
 * @example
 * ```tsx
 * // In a component with unsaved changes warning
 * function EditForm({ initialData }: Props) {
 *   const [data, setData] = useState(initialData);
 *   const isDirty = isFormDirty(data, initialData);
 *
 *   useEffect(() => {
 *     const handleBeforeUnload = (e: BeforeUnloadEvent) => {
 *       if (isDirty) {
 *         e.preventDefault();
 *         e.returnValue = '';
 *       }
 *     };
 *
 *     window.addEventListener('beforeunload', handleBeforeUnload);
 *     return () => window.removeEventListener('beforeunload', handleBeforeUnload);
 *   }, [isDirty]);
 *
 *   return <form>...</form>;
 * }
 * ```
 */
export function isFormDirty(
  current: Record<string, unknown>,
  initial: Record<string, unknown>
): boolean {
  // Quick reference check
  if (current === initial) {
    return false;
  }

  // Check if keys are different
  const currentKeys = Object.keys(current);
  const initialKeys = Object.keys(initial);

  if (currentKeys.length !== initialKeys.length) {
    return true;
  }

  // Deep comparison
  for (const key of currentKeys) {
    // eslint-disable-next-line security/detect-object-injection
    const currentValue = current[key];
    // eslint-disable-next-line security/detect-object-injection
    const initialValue = initial[key];

    // Check if both are objects (but not null, File, or Array)
    if (
      currentValue &&
      initialValue &&
      typeof currentValue === 'object' &&
      typeof initialValue === 'object' &&
      !(currentValue instanceof File) &&
      !(initialValue instanceof File) &&
      !Array.isArray(currentValue) &&
      !Array.isArray(initialValue)
    ) {
      if (
        isFormDirty(
          currentValue as Record<string, unknown>,
          initialValue as Record<string, unknown>
        )
      ) {
        return true;
      }
      continue;
    }

    // Check arrays
    if (Array.isArray(currentValue) && Array.isArray(initialValue)) {
      if (currentValue.length !== initialValue.length) {
        return true;
      }

      for (let i = 0; i < currentValue.length; i++) {
        // eslint-disable-next-line security/detect-object-injection
        if (currentValue[i] !== initialValue[i]) {
          return true;
        }
      }
      continue;
    }

    // Primitive comparison
    if (currentValue !== initialValue) {
      return true;
    }
  }

  return false;
}
