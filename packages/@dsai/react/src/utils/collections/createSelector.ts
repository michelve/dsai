/**
 * @file createSelector - Memoized selector pattern (reselect-like)
 * @module @dsai/react/utils/collections
 *
 * Enterprise-grade memoized selector for derived state computation.
 * Inspired by reselect, optimized for React/Redux patterns.
 *
 * Features:
 * - Memoized derived state
 * - Multiple input selectors
 * - Shallow equality checking
 * - Custom equality functions
 * - SSR-safe (no DOM dependencies)
 * - TypeScript-friendly with full type inference
 */

/**
 * A function that extracts a value from state
 */
export type Selector<S, R> = (state: S) => R;

/**
 * Equality function for comparing values
 */
export type EqualityFn<T> = (a: T, b: T) => boolean;

/**
 * Options for createSelector
 */
export interface CreateSelectorOptions<R> {
  /**
   * Custom equality function for result comparison.
   * @default shallowEqual
   */
  equalityFn?: EqualityFn<R>;
}

/**
 * Safe array element access using Reflect.get
 */
function getArrayElement<T>(arr: readonly T[], index: number): T | undefined {
  return Reflect.get(arr, index) as T | undefined;
}

/**
 * Shallow equality check for objects and arrays
 */
export function shallowEqual<T>(a: T, b: T): boolean {
  if (a === b) {
    return true;
  }
  if (a === null || a === undefined || b === null || b === undefined) {
    return false;
  }
  if (typeof a !== 'object' || typeof b !== 'object') {
    return false;
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) {
      return false;
    }
    // Safe iteration with Reflect.get
    let isEqual = true;
    a.forEach((val, idx) => {
      if (val !== getArrayElement(b, idx)) {
        isEqual = false;
      }
    });
    return isEqual;
  }

  if (Array.isArray(a) || Array.isArray(b)) {
    return false;
  }

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) {
    return false;
  }

  const hasOwn = Object.prototype.hasOwnProperty;
  for (const key of keysA) {
    const aVal = Reflect.get(a as object, key);
    const bVal = Reflect.get(b as object, key);
    if (!hasOwn.call(b, key) || aVal !== bVal) {
      return false;
    }
  }

  return true;
}

/**
 * Strict reference equality
 */
export function strictEqual<T>(a: T, b: T): boolean {
  return a === b;
}

/**
 * Deep equality check (recursive)
 */
export function deepEqual<T>(a: T, b: T): boolean {
  if (a === b) {
    return true;
  }
  if (a === null || a === undefined || b === null || b === undefined) {
    return false;
  }
  if (typeof a !== 'object' || typeof b !== 'object') {
    return false;
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) {
      return false;
    }
    // Safe iteration with Reflect.get
    let isEqual = true;
    a.forEach((val, idx) => {
      if (!deepEqual(val, getArrayElement(b, idx))) {
        isEqual = false;
      }
    });
    return isEqual;
  }

  if (Array.isArray(a) || Array.isArray(b)) {
    return false;
  }

  // Handle Date
  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  }

  // Handle RegExp
  if (a instanceof RegExp && b instanceof RegExp) {
    return a.toString() === b.toString();
  }

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) {
    return false;
  }

  const hasOwn = Object.prototype.hasOwnProperty;
  for (const key of keysA) {
    const aVal = Reflect.get(a as object, key);
    const bVal = Reflect.get(b as object, key);
    if (!hasOwn.call(b, key) || !deepEqual(aVal, bVal)) {
      return false;
    }
  }

  return true;
}

/**
 * Memoized selector with cache control
 */
export interface MemoizedSelector<S, R> extends Selector<S, R> {
  /**
   * Clear the memoized result
   */
  clearCache(): void;

  /**
   * Get the number of times the combiner was recomputed
   */
  recomputations(): number;

  /**
   * Reset recomputation count
   */
  resetRecomputations(): void;

  /**
   * Get the last inputs for debugging
   */
  lastInputs(): unknown[] | undefined;
}

/**
 * Internal implementation for creating memoized selectors
 */
function createSelectorInternal<S, Result>(
  selectors: ReadonlyArray<Selector<S, unknown>>,
  combiner: (...inputs: unknown[]) => Result,
  options?: CreateSelectorOptions<Result>
): MemoizedSelector<S, Result> {
  if (selectors.length === 0) {
    throw new Error('createSelector requires at least one input selector');
  }

  const equalityFn = options?.equalityFn;

  // Cache state
  let lastInputs: unknown[] | undefined;
  let lastResult: Result | undefined;
  let recomputationCount = 0;
  let hasCache = false;

  const selector = ((state: S): Result => {
    // Compute current input values
    const currentInputs = selectors.map((s) => s(state));

    // Check if inputs changed
    if (hasCache && lastInputs !== undefined) {
      let inputsChanged = false;

      if (currentInputs.length !== lastInputs.length) {
        inputsChanged = true;
      } else {
        // Compare arrays element by element - safe Reflect.get access
        const cachedInputs = lastInputs;
        currentInputs.forEach((val, idx) => {
          if (val !== getArrayElement(cachedInputs, idx)) {
            inputsChanged = true;
          }
        });
      }

      if (!inputsChanged && lastResult !== undefined) {
        return lastResult;
      }
    }

    // Recompute
    recomputationCount++;
    const result = combiner(...currentInputs);

    if (hasCache && lastResult !== undefined && equalityFn && equalityFn(lastResult, result)) {
      // Inputs changed but result is considered equal; keep prior result reference
      lastInputs = currentInputs;
      return lastResult;
    }

    // Update cache
    lastInputs = currentInputs;
    lastResult = result;
    hasCache = true;

    return result;
  }) as MemoizedSelector<S, Result>;

  // Add control methods
  selector.clearCache = () => {
    lastInputs = undefined;
    lastResult = undefined;
    hasCache = false;
  };

  selector.recomputations = () => recomputationCount;

  selector.resetRecomputations = () => {
    recomputationCount = 0;
  };

  selector.lastInputs = () => lastInputs;

  return selector;
}

/**
 * Creates a memoized selector with 1 input selector
 */
export function createSelector1<S, R1, Result>(
  selector1: Selector<S, R1>,
  combiner: (r1: R1) => Result,
  options?: CreateSelectorOptions<Result>
): MemoizedSelector<S, Result> {
  return createSelectorInternal<S, Result>(
    [selector1],
    combiner as (...inputs: unknown[]) => Result,
    options
  );
}

/**
 * Creates a memoized selector with 2 input selectors
 */
export function createSelector2<S, R1, R2, Result>(
  selector1: Selector<S, R1>,
  selector2: Selector<S, R2>,
  combiner: (r1: R1, r2: R2) => Result,
  options?: CreateSelectorOptions<Result>
): MemoizedSelector<S, Result> {
  return createSelectorInternal<S, Result>(
    [selector1, selector2],
    combiner as (...inputs: unknown[]) => Result,
    options
  );
}

/**
 * Creates a memoized selector with 3 input selectors
 */
export function createSelector3<S, R1, R2, R3, Result>(
  selector1: Selector<S, R1>,
  selector2: Selector<S, R2>,
  selector3: Selector<S, R3>,
  combiner: (r1: R1, r2: R2, r3: R3) => Result,
  options?: CreateSelectorOptions<Result>
): MemoizedSelector<S, Result> {
  return createSelectorInternal<S, Result>(
    [selector1, selector2, selector3],
    combiner as (...inputs: unknown[]) => Result,
    options
  );
}

/**
 * Creates a memoized selector with 4 input selectors
 */
export function createSelector4<S, R1, R2, R3, R4, Result>(
  selector1: Selector<S, R1>,
  selector2: Selector<S, R2>,
  selector3: Selector<S, R3>,
  selector4: Selector<S, R4>,
  combiner: (r1: R1, r2: R2, r3: R3, r4: R4) => Result,
  options?: CreateSelectorOptions<Result>
): MemoizedSelector<S, Result> {
  return createSelectorInternal<S, Result>(
    [selector1, selector2, selector3, selector4],
    combiner as (...inputs: unknown[]) => Result,
    options
  );
}

/**
 * Creates a memoized selector with 5 input selectors
 */
export function createSelector5<S, R1, R2, R3, R4, R5, Result>(
  selector1: Selector<S, R1>,
  selector2: Selector<S, R2>,
  selector3: Selector<S, R3>,
  selector4: Selector<S, R4>,
  selector5: Selector<S, R5>,
  combiner: (r1: R1, r2: R2, r3: R3, r4: R4, r5: R5) => Result,
  options?: CreateSelectorOptions<Result>
): MemoizedSelector<S, Result> {
  return createSelectorInternal<S, Result>(
    [selector1, selector2, selector3, selector4, selector5],
    combiner as (...inputs: unknown[]) => Result,
    options
  );
}

/**
 * Type helper for selector result extraction
 */
type SelectorResult<S, Sel> = Sel extends Selector<S, infer R> ? R : never;

/**
 * Type helper for extracting results from a tuple of selectors
 */
type SelectorResults<S, Sels extends ReadonlyArray<Selector<S, unknown>>> = {
  [K in keyof Sels]: SelectorResult<S, Sels[K]>;
};

/**
 * Creates a memoized selector that only recomputes when input values change.
 * Implements the selector pattern popularized by reselect.
 *
 * This is a convenience function that accepts a variable number of selectors
 * followed by a combiner function.
 *
 * @param selectorsAndCombiner - Input selector functions followed by combiner function
 * @returns Memoized selector function
 *
 * @example
 * ```tsx
 * // Simple selector
 * interface State {
 *   users: User[];
 *   filter: string;
 * }
 *
 * const getUsers = (state: State) => state.users;
 * const getFilter = (state: State) => state.filter;
 *
 * const getFilteredUsers = createSelector(
 *   getUsers,
 *   getFilter,
 *   (users, filter) => users.filter(u => u.name.includes(filter))
 * );
 *
 * // Usage in React component
 * function UserList() {
 *   const filteredUsers = useSelector(getFilteredUsers);
 *   return filteredUsers.map(user => <UserCard key={user.id} user={user} />);
 * }
 *
 * // With custom equality
 * const getExpensiveData = createSelector(
 *   getData,
 *   (data) => expensiveTransform(data),
 *   { equalityFn: deepEqual }
 * );
 *
 * // Debugging
 * console.log(getFilteredUsers.recomputations()); // Number of recalculations
 * getFilteredUsers.resetRecomputations();
 * getFilteredUsers.clearCache();
 * ```
 */
export function createSelector<S, Selectors extends ReadonlyArray<Selector<S, unknown>>, Result>(
  ...selectorsAndCombiner: readonly [
    ...Selectors,
    (...args: SelectorResults<S, Selectors>) => Result,
  ]
): MemoizedSelector<S, Result> {
  // Parse arguments - all but last are selectors, last is combiner
  const funcs = selectorsAndCombiner.filter(
    (arg): arg is Selector<S, unknown> => typeof arg === 'function'
  );

  if (funcs.length < 2) {
    throw new Error('createSelector requires at least one input selector and a combiner');
  }

  const selectors = funcs.slice(0, -1);
  const lastFunc = funcs[funcs.length - 1];
  const combiner = lastFunc as (...inputs: unknown[]) => Result;

  return createSelectorInternal<S, Result>(selectors, combiner);
}

/**
 * Creates a selector with array of input selectors.
 * Useful when the number of selectors is dynamic.
 *
 * @param selectors - Array of input selectors
 * @param combiner - Function to combine selector results
 * @param options - Selector options
 * @returns Memoized selector
 *
 * @example
 * ```tsx
 * const selectors = [getUsers, getFilter, getSortOrder];
 *
 * const getProcessedUsers = createSelectorFromArray(
 *   selectors,
 *   ([users, filter, sortOrder]) => {
 *     return users
 *       .filter(u => u.name.includes(filter))
 *       .sort((a, b) => sortOrder === 'asc' ? a.id - b.id : b.id - a.id);
 *   }
 * );
 * ```
 */
export function createSelectorFromArray<S, Results extends unknown[], Result>(
  selectors: { [K in keyof Results]: Selector<S, Results[K]> },
  combiner: (results: Results) => Result,
  options?: CreateSelectorOptions<Result>
): MemoizedSelector<S, Result> {
  if (!Array.isArray(selectors) || selectors.length === 0) {
    throw new Error('createSelectorFromArray requires a non-empty array of selectors');
  }

  const equalityFn = options?.equalityFn;

  let lastInputs: Results | undefined;
  let lastResult: Result | undefined;
  let recomputationCount = 0;
  let hasCache = false;

  const selector = ((state: S): Result => {
    const currentInputs = selectors.map((s) => s(state)) as Results;

    if (hasCache && lastInputs !== undefined) {
      const cachedInputs = lastInputs;
      let inputsChanged = false;
      currentInputs.forEach((val, idx) => {
        if (val !== getArrayElement(cachedInputs as readonly unknown[], idx)) {
          inputsChanged = true;
        }
      });

      if (!inputsChanged && lastResult !== undefined) {
        return lastResult;
      }
    }

    recomputationCount++;
    const result = combiner(currentInputs);

    if (hasCache && lastResult !== undefined && equalityFn && equalityFn(lastResult, result)) {
      lastInputs = currentInputs;
      return lastResult;
    }

    lastInputs = currentInputs;
    lastResult = result;
    hasCache = true;

    return result;
  }) as MemoizedSelector<S, Result>;

  selector.clearCache = () => {
    lastInputs = undefined;
    lastResult = undefined;
    hasCache = false;
  };

  selector.recomputations = () => recomputationCount;
  selector.resetRecomputations = () => {
    recomputationCount = 0;
  };
  selector.lastInputs = () => lastInputs as unknown[] | undefined;

  return selector;
}
