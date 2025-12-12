# Task: Audit Utility – Collections Suite (`chunk`, `paginate`, `stableSort`, `uniqueBy`, `memoize`, `createSelector`)

**Task ID:** TASK-77  
**Title:** Audit and harden collection utilities in `packages/@dsai/react/src/utils/collections`  
**Priority:** High  
**Status:** 🟢 Evaluated (review complete, fixes pending)  
**Assigned To:** [TBD]  
**Estimated Time:** 3–5 hours  
**Created:** Auto  
**Updated:** 2025-12-12

---

## 1. Utility Metadata

- **Names / Files:**  
  - `chunk`, `chunkInto` — `packages/@dsai/react/src/utils/collections/chunk.ts`  
  - `stableSort`, `sortBy`, `composeComparators` — `packages/@dsai/react/src/utils/collections/stableSort.ts`  
  - `uniqueBy`, `uniqueByKey` — `packages/@dsai/react/src/utils/collections/uniqueBy.ts`  
  - `paginate`, `createPaginator`, `getPageForIndex` — `packages/@dsai/react/src/utils/collections/paginate.ts`  
  - `memoize`, `memoizeMethod` — `packages/@dsai/react/src/utils/collections/memoize.ts`  
  - `createSelector`, `createSelector[1-5]`, `createSelectorFromArray`, `shallowEqual`, `deepEqual`, `strictEqual` — `packages/@dsai/react/src/utils/collections/createSelector.ts`
- **Category:** collections / data structures
- **TypeScript:** Yes (strict)
- **Used By (key components/hooks):**
  - Internally via `packages/@dsai/react/src/utils/collections/index.ts` → surfaced in `packages/@dsai/react/src/index.ts`
  - Memoization/selector patterns aligned with Redux-like usage (no direct component imports found)
  - Tests: `packages/@dsai/react/src/utils/__tests__/collections-m2.test.ts`

---

## 2. Checklist Evaluation

> Use the checkboxes below after reviewing the actual code.  
> Mark each item as ✅ Pass, ⚠️ Needs Improvement, or ❌ Fail.  
> Add short notes where useful.

### 2.1 API Design & Responsibilities

- [✅] **Single Responsibility:** Each helper has a focused purpose (chunking, pagination, sorting, uniqueness, memoization, selectors).
- [⚠️] **Clear Input/Output:** `paginate` forces `totalPages >= 1` even when `totalItems = 0`; `createSelector` accepts `options` but ignores `equalityFn`; `memoize` exposes `weakMap` option that is unused.
- [✅] **No Hidden Side Effects:** Pure functions except memoization caches; no global mutations.
- [✅] **Naming:** Clear and conventional; selector variants mirror reselect naming; `memoizeMethod` is explicit.
- [⚠️] **Reusability:** `uniqueBy` coerces keys to `string | number`, so symbol/boolean/object keys may collide; `paginate` cannot request `totalPages = 0` when empty.

**Notes (API & SRP):**

- `createSelector` filters arguments by `typeof === 'function'`, dropping any non-function mistakenly passed (could hide misuses). `options` parameter is currently inert.

### 2.2 TypeScript & Typing Quality

- [✅] **No `any` / unsafe types** in exported APIs.
- [✅] **Generics used correctly** where needed.
- [✅] **Explicit return type** for public utilities.
- [⚠️] **Public types** are clear but some options are misleading (`weakMap` not implemented, `equalityFn` ignored).
- [✅] **Internal helper types** are scoped appropriately.

**Notes (Typing):**

- Key extractor types in `uniqueBy` are constrained to `KeyExtractor` but runtime uses `string | number`, creating mismatch for other key types.

### 2.3 Safety, Robustness & SSR

- [✅] **Null/Undefined Handling:** Input validation with TypeError/RangeError guards for chunk/paginate; selector/memoize throw on bad inputs.
- [⚠️] **Error Handling:** `deepEqual` is recursive without cycle detection (risk of stack overflow on circular structures); `memoize` TTL expiration only enforced on access.
- [✅] **SSR Safe:** No DOM access; timer-free except memoize stats.
- [✅] **Browser API Use:** None (pure JS/TS).
- [✅] **Security-Sensitive Logic:** N/A (no external input sinks).

**Notes (Safety & SSR):**

- `paginate` clamping can mask invalid page inputs; totalPages forced to 1 may mislead consumers about emptiness.

### 2.4 Accessibility (If Applicable)

> Required for utilities that deal with focus, keyboard, ARIA, screen readers, or DOM accessibility.

- [✅] **Keyboard Semantics:** N/A.
- [✅] **Focus Management:** N/A.
- [✅] **Focusable Selectors:** N/A.
- [✅] **Screen Reader Support:** N/A.
- [✅] **WCAG Alignment:** N/A.

**Notes (Accessibility):**

- Not applicable.

### 2.5 Performance & Complexity

- [✅] **Complexity Reasonable:** Mostly O(n) (chunk, unique, paginate) or O(n log n) (sort) with expected costs.
- [✅] **No Unnecessary Allocations:** Uses slices/maps/sets appropriately; stableSort uses indexed pairs.
- [⚠️] **No Layout Thrashing:** N/A; note `deepEqual` recursion may be expensive on large graphs.
- [✅] **Tree-Shakeable:** Modules are side-effect free.
- [✅] **Used in Hot Paths:** Memoize/selector designed for hot paths; equalityFn missing may increase recomputations.

**Notes (Performance):**

- `defaultCacheKey` uses JSON.stringify; for large args this could be heavy—document or allow pluggable keys (already supported).

### 2.6 Testing & Coverage

- [✅] **Unit Tests Exist** in `collections-m2.test.ts`.
- [⚠️] **Edge Cases Covered:** Missing coverage for `memoize` maxSize/ttl, unused `weakMap`; `createSelector` options/equality; `paginate` empty array `totalPages`; `uniqueBy` keepStrategy='last' with duplicate keys; circular data for `deepEqual`.
- [⚠️] **Branch Coverage High:** Some branches (error paths, TTL, descending with comparator ties) are untested.
- [✅] **Regression Tests:** None noted; current suite stable.
- [✅] **No Overly Fragile Tests:** Behavior-based assertions.

**Notes (Tests):**

- Add tests to assert `equalityFn` is honored, cache eviction/TTL behavior, `uniqueBy` last strategy, and `paginate` on empty data with zero-based vs one-based.

### 2.7 Documentation & DX

- [✅] **JSDoc/TSDoc Present:** Examples and descriptions in files.
- [⚠️] **Usage Examples:** Good inline examples; no Storybook/docs page for collections utilities.
- [⚠️] **Error Messages Useful:** Validation errors generic; memoize missing warnings for un-serializable args and unimplemented `weakMap`.
- [✅] **Consistent with DSAi Patterns:** Naming and structure match other utils.

**Notes (Docs & DX):**

- Document unsupported/ignored options (`equalityFn`, `weakMap`) or implement them; clarify `paginate` empty-case semantics.

---

## 3. Scoring (0–100)

> Score after going through the checklist. Use judgment, but be consistent.

- **API & SRP:** 13/15
- **Typing & TS Quality:** 14/15
- **Safety & Robustness (incl. SSR & security):** 15/20
- **Accessibility (if applicable):** 15/15 (N/A)
- **Performance:** 14/15
- **Testing & Coverage:** 8/10
- **Documentation & DX:** 8/10

**Total Score:** **87/100**  
**Grade:** Solid with notable correctness/DX gaps

**Short Score Summary (1–3 sentences):**

- Comprehensive collections toolkit with strong typing and input validation, covering sorting, pagination, uniqueness, memoization, and selector patterns. Gaps: `createSelector` ignores `equalityFn`, `memoize` advertises but doesn’t honor `weakMap`, `paginate` reports `totalPages=1` when empty, and `uniqueBy` key handling can collide non-string/number keys; tests and docs miss these edges.

---

## 4. Vendor Comparison (Carbon, Ant, MUI, Shadcn, Redux)

> Compare the collections utilities to equivalents in major systems.

- **Closest Equivalents:**
  - Lodash/Remeda/Ramda provide chunk, uniqBy, sortBy, memoize; Redux Toolkit/reselect provide selectors and memoization; UI kits (Carbon/Ant/MUI/Shadcn) do not ship these helpers directly.
  - Redux reselect honors custom equality and configurable memoization caches.
- **Parity:** Above (broader standard library than UI kits; selector/memoize parity lags reselect/Lodash on features like custom equality and WeakMap caches).
- **Strengths (DSAi vs others):**
  - TypeScript-first APIs, explicit input validation with meaningful errors, stable sort guarantee, rich pagination metadata.
  - Memoize exposes stats and LRU controls; selector utilities expose recomputation metrics.
  - Includes decorators (`memoizeMethod`) uncommon in mainstream utility sets.
- **Gaps / Weaknesses vs others:**
  - `equalityFn`/`weakMap` options are no-ops; default JSON stringify cache keys can be brittle compared to Lodash’s resolver or reselect’s memoizeOptions.
  - Pagination always reports at least one page, unlike some libs that return `0` pages for empty data.
  - `deepEqual` lacks cycle handling; `uniqueBy` key coercion is narrower than Lodash’s `iteratee` flexibility.
- **Action Items to Surpass:**
  - Implement and honor `equalityFn` and `weakMap` options; optionally accept custom memoizer injection (reselect-style).
  - Improve `paginate` empty-state reporting and allow optional `totalPages = 0`.
  - Harden `uniqueBy` key handling and `deepEqual` cycle detection; document memoize key strategies.

---

## 5. Issues, Risks & Recommended Actions

### 5.1 Issues & Risks

List concrete issues found. Each issue must have a severity:

- [Severity: High] `createSelector` accepts `equalityFn` but ignores it; recomputation relies solely on referential equality of inputs, diverging from API intent.
- [Severity: Medium] `memoize` exposes `weakMap` option that is unused; object keys still go through string cacheKey, leading to potential leaks or incorrect cache keys.
- [Severity: Medium] `paginate` forces `totalPages` to at least 1 even when `array.length === 0`, which can mislead pagination UI/state (empty result yet `totalPages=1`).
- [Severity: Medium] `uniqueBy`/`uniqueByKey` coerce keys to `string | number`, so boolean/symbol/object keys may collide or stringify unexpectedly; `keepStrategy` last-path reverses array copy (extra allocation) and lacks tests.
- [Severity: Low] `deepEqual` lacks cycle detection and can stack overflow on circular data; memoize TTL only enforced on access (stale entries linger).
- [Severity: Low] Default cache key uses JSON.stringify and may mishandle BigInt or non-serializable args; no warning when serialization falls back.

### 5.2 Recommended Actions

Pick one or more:

- [ ] Keep as is (no changes needed).
- [✅] Refactor (backwards compatible):
  - Honor `equalityFn` in selector cache checks; allow custom memoizer injection or at least swap shallow/reference check with provided equality.
  - Implement `weakMap` support (per-first-arg object) or remove option; document fallback; add TTL eviction on read/write.
  - Allow `paginate` to return `totalPages = 0` when empty (or add flag to control) and document clamping; add tests for empty arrays zero/one-based.
  - Broaden `uniqueBy` key handling (preserve key type or allow custom key serializer) and test `keepStrategy: 'last'`.
  - Add cycle protection to `deepEqual` or document limitation; improve default cache-key warning/BigInt handling in memoize.
- [ ] Breaking change recommended (with migration plan):
  - N/A
- [ ] Deprecate and replace:
  - N/A

**Implementation Notes / Plan:**

- Step 1: Wire `equalityFn` into `createSelector`/`createSelectorFromArray` and add tests for custom equality preventing recomputation.
- Step 2: Implement `weakMap` path or remove the option; add TTL eviction on set/get; extend memoize tests for maxSize/ttl.
- Step 3: Adjust `paginate` empty-state behavior and add tests for empty arrays and zero-based vs one-based; add `uniqueBy` tests for keepStrategy last and non-string/number keys; consider serializer option.
- Step 4: Add cycle guard to `deepEqual` or document/throw on circular structures; document memoize key strategy and limitations.

---

## 6. Definition of Done (DoD) for Collections Utilities

This task is **Done** when:

- [✅] All checklist items are reviewed and marked with notes.
- [ ] Necessary fixes and refactors are implemented.
- [ ] Tests updated/added and passing.
- [ ] Coverage targets for these utilities are met.
- [ ] Documentation/JSDoc is updated and accurate.
- [ ] Any breaking changes have a clear migration note.
- [✅] Vendor comparison section is filled in with honest evaluation.

---
