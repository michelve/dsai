# Task: Audit Utility – DX Suite (`createComponent`, `createContext`, `createPolymorphic`, `getDisplayName`, `invariant`, `isDev`, `warn`, `warnOnce`)

**Task ID:** TASK-77  
**Title:** Audit and harden developer-experience utilities in `packages/@dsai/react/src/utils/dx`  
**Priority:** High  
**Status:** 🟢 Evaluated (review complete, fixes pending)  
**Assigned To:** [TBD]  
**Estimated Time:** 2–3 hours  
**Created:** Auto  
**Updated:** 2025-12-12

---

## 1. Utility Metadata

- **Names / Files:**  
  - `createComponent` — `packages/@dsai/react/src/utils/dx/createComponent.ts`  
  - `createContext` — `packages/@dsai/react/src/utils/dx/createContext.ts`  
  - `createPolymorphic` — `packages/@dsai/react/src/utils/dx/createPolymorphic.ts`  
  - `getDisplayName` — `packages/@dsai/react/src/utils/dx/getDisplayName.ts`  
  - `invariant` — `packages/@dsai/react/src/utils/dx/invariant.ts`  
  - `isDev` — `packages/@dsai/react/src/utils/dx/isDev.ts`  
  - `warn`, `warnOnce`, `clearWarnings` — `packages/@dsai/react/src/utils/dx/warn.ts`, `warnOnce.ts`
- **Category:** DX / developer tooling
- **TypeScript:** Yes (strict)
- **Used By (key components/hooks):**
  - Tests: `packages/@dsai/react/src/utils/__tests__/dx-m2.test.tsx` (covers most utilities)
  - Exposed via `packages/@dsai/react/src/utils/dx/index.ts` → `packages/@dsai/react/src/utils/index.ts`

---

## 2. Checklist Evaluation

> Use the checkboxes below after reviewing the actual code.  
> Mark each item as ✅ Pass, ⚠️ Needs Improvement, or ❌ Fail.  
> Add short notes where useful.

### 2.1 API Design & Responsibilities

- [✅] **Single Responsibility:** Each helper targets a DX concern (component defaults, context creation, polymorphic types, display names, assertions, environment detection, warnings).
- [⚠️] **Clear Input/Output:** `createComponent` shallow-merges `defaultProps` each render (no memoization); `createContext` defaultValue + `strict=false` uses invariant but still returns non-nullable type; `warnOnce` key deduplication is global and unscoped.
- [✅] **No Hidden Side Effects:** Warnings gated by env; invariant throws; caches only warning keys.
- [✅] **Naming:** Clear and conventional.
- [⚠️] **Reusability:** `createPolymorphic` omits ref forwarding, so users must add refs manually; `warnOnce` cache cannot be reset per component (only via `clearWarnings`).

**Notes (API & SRP):**

- `createComponent` regenerates the wrapper per call and merges props inline; no memoization of merged props but acceptable for simplicity.

### 2.2 TypeScript & Typing Quality

- [✅] **No `any` / unsafe types** in exported APIs.
- [✅] **Generics used correctly** where needed.
- [✅] **Explicit return type** for public utilities.
- [⚠️] **Public types** are clear but `createContext` returns `useContext: () => T` even when `strict=false` and `defaultValue` optional—type promises non-undefined without guaranteeing default provided.
- [✅] **Internal helper types** are scoped appropriately.

**Notes (Typing):**

- `createPolymorphic` supports `as` typing but lacks ref generics common in polymorphic helpers (e.g., forwardRef with inferred element props).

### 2.3 Safety, Robustness & SSR

- [✅] **Null/Undefined Handling:** `invariant` enforces conditions; `createContext` guards missing defaultValue when `strict=false`.
- [⚠️] **Error Handling:** Warnings rely on `process` presence; `isDev` accesses `process.env.NODE_ENV` without `typeof process` guard (could throw in process-less runtimes); `warnOnce` Set is process-wide with no size cap.
- [✅] **SSR Safe:** No DOM access; env checks guarded but need process guard.
- [✅] **Browser API Use:** None.
- [✅] **Security-Sensitive Logic:** N/A.

**Notes (Safety & SSR):**

- `isDev` checks `process` but assumes `process` exists if `typeof process !== 'undefined'`; safe but an extra guard before accessing `.env` would harden non-Node runtimes.

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

- [✅] **Complexity Reasonable:** All helpers are O(1); warnOnce set operations trivial.
- [✅] **No Unnecessary Allocations:** Minimal per-call allocations; createComponent merges props each render (expected).
- [✅] **No Layout Thrashing:** No DOM.
- [✅] **Tree-Shakeable:** Dev-only code guarded by env checks.
- [✅] **Used in Hot Paths:** Lightweight; warnOnce Set unbounded but low risk.

**Notes (Performance):**

- None.

### 2.6 Testing & Coverage

- [✅] **Unit Tests Exist** (`dx-m2.test.tsx`).
- [⚠️] **Edge Cases Covered:** Missing coverage for `strict=false` defaultValue error path; `warnOnce` key casing/empty key; `createPolymorphic` lacks ref behavior tests; `isDev` without `process` guard.
- [⚠️] **Branch Coverage High:** Warning cache clear path, createComponent displayName fallback, and error branches partially covered.
- [✅] **Regression Tests:** None noted; suite stable.
- [✅] **No Overly Fragile Tests:** Behavior-based assertions.

**Notes (Tests):**

- Add tests for `strict=false` without defaultValue (should throw), `clearWarnings` reset, `warnOnce` with empty key already covered, and polymorphic type/ref expectations if extended.

### 2.7 Documentation & DX

- [✅] **JSDoc/TSDoc Present:** Examples in code.
- [⚠️] **Usage Examples:** No Storybook/docs page; discovery via barrel.
- [✅] **Error Messages Useful:** invariant/warn outputs are clear.
- [✅] **Consistent with DSAi Patterns:** Naming/exports align.

**Notes (Docs & DX):**

- Document `strict` behavior and defaultValue requirements; mention lack of ref forwarding in `createPolymorphic` so consumers know to wrap with forwardRef if needed.

---

## 3. Scoring (0–100)

> Score after going through the checklist. Use judgment, but be consistent.

- **API & SRP:** 13/15
- **Typing & TS Quality:** 14/15
- **Safety & Robustness (incl. SSR & security):** 16/20
- **Accessibility (if applicable):** 15/15 (N/A)
- **Performance:** 15/15
- **Testing & Coverage:** 8/10
- **Documentation & DX:** 8/10

**Total Score:** **89/100**  
**Grade:** Strong with minor robustness/test gaps

**Short Score Summary (1–3 sentences):**

- Handy DX helpers for defaults, context, polymorphism, and dev warnings/assertions with solid typing and coverage. Gaps: `isDev`/warn path could guard `process` harder, `createPolymorphic` doesn’t forward refs, strict=false context typing relies on caller-provided default, and tests miss some edge/error branches.

---

## 4. Vendor Comparison (Carbon, Ant, MUI, Shadcn, Redux)

> Compare the DX utilities conceptually to equivalents in other major systems.

- **Closest Equivalents:**
  - `createContext` pattern similar to Radix/Chakra helpers; `warnOnce` like React warning patterns; `createPolymorphic` akin to Radix’s `Slot`/asChild pattern without refs.
  - UI kits typically inline warnings and polymorphic types; no dedicated exports.
- **Parity:** Above (centralized, typed DX helpers); below best-in-class polymorphic factories that forward refs and support `asChild`.
- **Strengths (DSAi vs others):**
  - Unified, reusable DX toolkit with dev-only warnings and invariant assertions.
  - Context helper enforces provider usage; polymorphic helper simplifies “as” typing.
  - Tests cover core behavior.
- **Gaps / Weaknesses vs others:**
  - No ref forwarding in polymorphic factory; warnOnce cache unscoped/global.
  - `isDev` assumes process presence; context typing could be safer for non-strict mode.
- **Action Items to Surpass:**
  - Add ref-forwarding polymorphic factory or option; guard process in `isDev`/warns.
  - Enhance tests for strict=false path, clearWarnings, and polymorphic/ref behavior.
  - Document usage and limitations (strict defaultValue, global warnOnce cache).

---

## 5. Issues, Risks & Recommended Actions

### 5.1 Issues & Risks

List concrete issues found. Each issue must have a severity:

- [Severity: Medium] `createPolymorphic` does not forward refs; consumers must wrap manually, risking inconsistent ref support across components.
- [Severity: Medium] `isDev`/warn* rely on `process.env.NODE_ENV` without guarding `process` existence in non-Node runtimes; could throw if process is undefined.
- [Severity: Low] `createContext` with `strict=false` and missing `defaultValue` throws at runtime but returns `() => T` signature, promising a value; typing could guide safer usage.
- [Severity: Low] `warnOnce` global Set has no scoping or size guard; keys could collide across modules.

### 5.2 Recommended Actions

Pick one or more:

- [ ] Keep as is (no changes needed).
- [✅] Refactor (backwards compatible):
  - Guard `process` access in `isDev`/warn*; consider caching env result once.
  - Provide a ref-forwarding variant or option in `createPolymorphic`, or document ref expectations.
  - Tighten `createContext` typing for `strict=false` so `defaultValue` is required, and test the error path.
  - Scope `warnOnce` keys via optional namespace/prefix and add tests for `clearWarnings` reset and duplicate keys.
- [ ] Breaking change recommended (with migration plan):
  - N/A
- [ ] Deprecate and replace:
  - N/A

**Implementation Notes / Plan:**

- Step 1: Add process guard to `isDev` and adjust warn/warnOnce to early return safely; add tests.
- Step 2: Add ref-forwarding helper or document requirement; add tests if implemented.
- Step 3: Refine `createContext` typing for non-strict mode; expand tests for strict=false without default and `clearWarnings`.

---

## 6. Definition of Done (DoD) for DX Utilities

This task is **Done** when:

- [✅] All checklist items are reviewed and marked with notes.
- [ ] Necessary fixes and refactors are implemented.
- [ ] Tests updated/added and passing.
- [ ] Coverage targets for these utilities are met.
- [ ] Documentation/JSDoc is updated and accurate.
- [ ] Any breaking changes have a clear migration note.
- [✅] Vendor comparison section is filled in with honest evaluation.

---
