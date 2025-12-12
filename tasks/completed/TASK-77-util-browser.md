# Task: Audit Utility – `isBrowser` / `prefersReducedMotion`

**Task ID:** TASK-77  
**Title:** Audit and harden browser-detection utilities in `packages/@dsai/react/src/utils/browser`  
**Priority:** High  
**Status:** ✅ Complete  
**Assigned To:** AI Agent  
**Estimated Time:** 2–3 hours  
**Created:** Auto  
**Updated:** 2025-12-12

---

## 1. Utility Metadata

- **Name:** `isBrowser`, `prefersReducedMotion`
- **Files:**
  - `packages/@dsai/react/src/utils/browser/isBrowser.ts`
  - `packages/@dsai/react/src/utils/browser/prefersReducedMotion.ts`
- **Category:** browser / platform detection
- **TypeScript:** Yes (strict)
- **Used By (key components/hooks):**
  - Hooks: `useReducedMotion`, `useLocalStorage`, `useSessionStorage`
  - Component: `Scrollspy` (smooth scroll behavior)
  - Exported via `packages/@dsai/react/src/utils/browser/index.ts` → `packages/@dsai/react/src/utils/index.ts` → `packages/@dsai/react/src/index.ts`
  - Tests: `utils-basic-functionality.test.ts`, `utils-enterprise-compliance.test.ts`

---

## 2. Checklist Evaluation

> Use the checkboxes below after reviewing the actual code.  
> Mark each item as ✅ Pass, ⚠️ Needs Improvement, or ❌ Fail.  
> Add short notes where useful.

### 2.1 API Design & Responsibilities

- [✅] **Single Responsibility:** `isBrowser` checks DOM availability; `prefersReducedMotion` reports the media query preference.
- [⚠️] **Clear Input/Output:** Return types are simple booleans, but `prefersReducedMotion` always returns `false` if `matchMedia` is missing/throws—no way to opt into a default `true` (unlike the hook).
- [✅] **No Hidden Side Effects:** Only reads globals and may log a warning in dev.
- [✅] **Naming:** Clear and conventional.
- [⚠️] **Reusability:** No configuration for media query string or default value; cannot inject a custom `matchMedia` for tests.

**Notes (API & SRP):**

- `prefersReducedMotion` duplicates the `isBrowser` check inline instead of reusing it; tests rely on global mutation of `matchMedia`.

### 2.2 TypeScript & Typing Quality

- [✅] **No `any` / unsafe types** in the exported API.
- [✅] **Generics used correctly** where needed (`<T>` with constraints).
- [✅] **Explicit return type** for the exported utility.
- [✅] **Public types** (if exported) are clear and stable.
- [✅] **Internal helper types** are not exported unnecessarily.

**Notes (Typing):**

- Both functions are fully typed booleans; no extra types exposed.

### 2.3 Safety, Robustness & SSR

- [✅] **Null/Undefined Handling:** Guards for `window`/`matchMedia`; safe property access.
- [✅] **Error Handling:** Catches `matchMedia` throws and logs a dev-only warning; returns false otherwise.
- [✅] **SSR Safe:** No module-scope DOM access; guards before touching browser APIs.
- [✅] **Browser API Use:** Uses `matchMedia` defensively; no timers or side effects.
- [⚠️] **Security-Sensitive Logic:** N/A, but warning path uses `process.env.NODE_ENV`, which assumes bundler-provided `process`.

**Notes (Safety & SSR):**

- In non-Node runtimes without `process`, the warning check could throw unless transpiled. Consider a safer `typeof process !== 'undefined'` guard.

### 2.4 Accessibility (If Applicable)

> Required for utilities that deal with focus, keyboard, ARIA, screen readers, or DOM accessibility.

- [✅] **Keyboard Semantics:** N/A.
- [✅] **Focus Management:** N/A.
- [✅] **Focusable Selectors:** N/A.
- [✅] **Screen Reader Support:** Indirectly supports motion reduction; API is minimal.
- [⚠️] **WCAG Alignment:** Returns `false` on unsupported platforms, which may disable motion reductions even when a conservative default is desired.

**Notes (Accessibility):**

- Consider allowing a caller-provided default (e.g., default to `true` for critical flows) to better respect WCAG intent when detection is unavailable.

### 2.5 Performance & Complexity

- [✅] **Complexity Reasonable:** O(1) checks; no heavy work.
- [✅] **No Unnecessary Allocations:** Minimal allocations; one `matchMedia` call.
- [✅] **No Layout Thrashing:** No DOM reads/writes.
- [✅] **Tree-Shakeable:** Side-effect free modules.
- [✅] **Used in Hot Paths:** Lightweight enough for repeated calls.

**Notes (Performance):**

- Repeated calls invoke `matchMedia` each time; acceptable, but could optionally reuse a cached query if needed.

### 2.6 Testing & Coverage

- [✅] **Unit Tests Exist** for both utilities.
- [⚠️] **Edge Cases Covered:** Lacks positive-case test when `matchMedia` returns `true`; no coverage for thrown-error warning path or `process` absence.
- [⚠️] **Branch Coverage High:** The catch/console.warn branch is partially covered; process guard is untested.
- [✅] **Regression Tests:** None noted, but existing tests are stable.
- [✅] **No Overly Fragile Tests:** Global mutation of `matchMedia` is contained.

**Notes (Tests):**

- Add tests for `matchMedia` resolving to `true`, for the warning path, and for environments where `process` is undefined to ensure safety.

### 2.7 Documentation & DX

- [⚠️] **JSDoc/TSDoc Present:** `prefersReducedMotion` has a brief JSDoc; `isBrowser` has doc comments. No usage examples in docs/Storybook.
- [⚠️] **Usage Examples:** Not surfaced in docs; consumers infer usage from hooks.
- [✅] **Error Messages Useful:** Warning includes context string.
- [✅] **Consistent with DSAi Patterns:** Naming aligns with other platform utils.

**Notes (Docs & DX):**

- Add a short doc snippet showing how to gate animation code paths and how to pair with `useReducedMotion`.

---

## 3. Scoring (0–100)

> Score after going through the checklist. Use judgment, but be consistent.

- **API & SRP:** 13/15
- **Typing & TS Quality:** 15/15
- **Safety & Robustness (incl. SSR & security):** 16/20
- **Accessibility (if applicable):** 12/15
- **Performance:** 15/15
- **Testing & Coverage:** 8/10
- **Documentation & DX:** 7/10

**Total Score:** **86/100**  
**Grade:** Solid, production-ready with minor DX/edge gaps

**Short Score Summary (1–3 sentences):**

- Lightweight, SSR-safe platform checks with sensible defaults and defensive `matchMedia` handling. Gaps: no configurable default for reduced motion, unguarded `process` access in warnings, and missing positive/warning-path test coverage and docs examples.

---

## 4. Vendor Comparison (Carbon, Ant, MUI, Shadcn, Redux)

> Compare the browser utilities conceptually to equivalent utilities or patterns in other major systems.

- **Closest Equivalents:**
  - Carbon/Ant/MUI/Shadcn: No exported `isBrowser`; reduced-motion handling lives in animation hooks/components (e.g., Framer Motion `useReducedMotion`, MUI `NoSsr` wrapper).
  - Redux ecosystem: RTK/RTKQ code samples rely on `typeof window !== 'undefined'` checks; no dedicated helper.
- **Parity:** On Par (functions exist where others rely on inline checks; reduced-motion parity matches Framer Motion detection but lacks customization).
- **Strengths (DSAi vs others):**
  - Centralized helpers with SSR guards and dev-only warning on `matchMedia` failure.
  - Used by hooks/components to keep callsites consistent.
- **Gaps / Weaknesses vs others:**
  - Cannot override defaults or inject custom `matchMedia` for testing and edge environments.
  - Missing docs/examples; warning path could break in process-less runtimes.
- **Action Items to Surpass:**
  - Add configurable defaults and injectable `matchMedia`/query to mirror Framer Motion’s flexibility.
  - Guard `process` access and document usage patterns for animations and SSR.

---

## 5. Issues, Risks & Recommended Actions

### 5.1 Issues & Risks

List concrete issues found. Each issue must have a severity:

- [Severity: Medium] ✅ RESOLVED: Added `defaultValue` option so callers can specify behavior when detection is unavailable.
- [Severity: Medium] ✅ RESOLVED: Guarded `process.env.NODE_ENV` access with `typeof process !== 'undefined'` check.
- [Severity: Low] ✅ RESOLVED: Added tests for positive match, warning path, custom matchMedia, and custom query.
- [Severity: Low] ✅ RESOLVED: Added comprehensive JSDoc with usage examples for animations and SSR.

### 5.2 Recommended Actions

Pick one or more:

- [ ] Keep as is (no changes needed).
- [✅] Refactor (backwards compatible):
  - Add an optional options object to `prefersReducedMotion` (e.g., `{ defaultValue?: boolean; matchMedia?: (query: string) => MediaQueryList | null; query?: string }`) to allow safe defaults and injectables.
  - Guard the dev warning with `typeof process !== 'undefined' && process?.env?.NODE_ENV !== 'production'`.
  - Add tests for `matchMedia` returning `true`, for the warning path when `matchMedia` throws, and for environments without `process`.
  - Add brief docs/Storybook snippet showing how to gate animations with these helpers and `useReducedMotion`.
- [ ] Breaking change recommended (with migration plan):
  - N/A
- [ ] Deprecate and replace:
  - N/A

**Implementation Notes / Plan:**

- Step 1: Extend `prefersReducedMotion` signature with optional config and add `process` guard.
- Step 2: Add tests covering positive match, thrown `matchMedia`, and process-less environments; ensure coverage of options defaults.
- Step 3: Document usage in utilities docs/Storybook and mention pairing with `useReducedMotion`.

---

## 6. Definition of Done (DoD) for `isBrowser` / `prefersReducedMotion`

This task is **Done** when:

- [✅] All checklist items are reviewed and marked with notes.
- [✅] Necessary fixes and refactors are implemented.
- [✅] Tests updated/added and passing.
- [✅] Coverage targets for these utilities are met.
- [✅] Documentation/JSDoc is updated and accurate.
- [✅] Any breaking changes have a clear migration note. (N/A - backwards compatible)
- [✅] Vendor comparison section is filled in with honest evaluation.

---
