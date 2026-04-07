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
/**
 * Compare two objects for deep equality (non-null, non-File, non-Array objects).
 */
function areObjectsDirty(currentValue: object, initialValue: object): boolean {
  return isFormDirty(
    currentValue as Record<string, unknown>,
    initialValue as Record<string, unknown>
  );
}

/**
 * Check if both values are plain objects suitable for deep comparison.
 */
function areBothPlainObjects(a: unknown, b: unknown): boolean {
  return (
    a !== null &&
    b !== null &&
    typeof a === 'object' &&
    typeof b === 'object' &&
    !(a instanceof File) &&
    !(b instanceof File) &&
    !Array.isArray(a) &&
    !Array.isArray(b)
  );
}

/**
 * Compare two arrays element-by-element for shallow equality.
 */
function areArraysDirty(currentArr: unknown[], initialArr: unknown[]): boolean {
  if (currentArr.length !== initialArr.length) {
    return true;
  }

  const initialIterator = initialArr[Symbol.iterator]();
  for (const currentItem of currentArr) {
    const { value: initialItem, done } = initialIterator.next();
    if (done || currentItem !== initialItem) {
      return true;
    }
  }

  return false;
}

/**
 * Compare a single field value against its initial value.
 * Returns true if the values differ.
 */
function isFieldDirty(currentValue: unknown, initialValue: unknown): boolean {
  // Check if both are plain objects
  if (currentValue && initialValue && areBothPlainObjects(currentValue, initialValue)) {
    return areObjectsDirty(currentValue as object, initialValue as object);
  }

  // Check arrays
  if (Array.isArray(currentValue) && Array.isArray(initialValue)) {
    return areArraysDirty(currentValue, initialValue);
  }

  // Primitive comparison
  return currentValue !== initialValue;
}

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
  const initialEntries = new Map<string, unknown>(Object.entries(initial));

  if (currentKeys.length !== initialKeys.length) {
    return true;
  }

  // Deep comparison
  for (const [key, currentValue] of Object.entries(current)) {
    if (!initialEntries.has(key)) {
      return true;
    }
    const initialValue = initialEntries.get(key);

    if (isFieldDirty(currentValue, initialValue)) {
      return true;
    }
  }

  return false;
}
