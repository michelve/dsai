# Task: Audit Utility – Date/Time Suite (`formatDate`, `formatRelativeTime`)

**Task ID:** TASK-77  
**Title:** Audit and harden date/time utilities in `packages/@dsai/react/src/utils/date`  
**Priority:** High  
**Status:** 🟢 Evaluated (review complete, fixes pending)  
**Assigned To:** [TBD]  
**Estimated Time:** 2–3 hours  
**Created:** Auto  
**Updated:** 2025-12-12

---

## 1. Utility Metadata

- **Names / Files:**  
  - `formatDate` — `packages/@dsai/react/src/utils/date/formatDate.ts`  
  - `formatRelativeTime` — `packages/@dsai/react/src/utils/date/formatRelativeTime.ts`
- **Category:** date / i18n
- **TypeScript:** Yes (strict)
- **Used By (key components/hooks):**
  - Exported via `packages/@dsai/react/src/utils/date/index.ts` → `packages/@dsai/react/src/utils/index.ts`
  - No direct component imports found; utilities intended for consumer use
  - Tests: only `formatDate.test.ts` present; no coverage for `formatRelativeTime` caching/edge paths

---

## 2. Checklist Evaluation

> Use the checkboxes below after reviewing the actual code.  
> Mark each item as ✅ Pass, ⚠️ Needs Improvement, or ❌ Fail.  
> Add short notes where useful.

### 2.1 API Design & Responsibilities

- [✅] **Single Responsibility:** `formatDate` wraps `Intl.DateTimeFormat` with caching and fallback; `formatRelativeTime` wraps `Intl.RelativeTimeFormat` with unit selection and fallback.
- [⚠️] **Clear Input/Output:** Both throw on invalid dates, but `formatDate` defaults `timeZone` to `UTC`, which may surprise callers expecting local time; `formatRelativeTime` defaults baseDate to `new Date()` (local).
- [✅] **No Hidden Side Effects:** Uses internal caches; no global mutations beyond Map state.
- [✅] **Naming:** Clear and conventional.
- [⚠️] **Reusability:** Cache key in `formatDate` sorts option keys via `JSON.stringify`, which can differ for functions/symbols; relative formatter cache keyed only by locale/numeric/style (ignores numberingSystem/calendar), limiting reuse accuracy.

**Notes (API & SRP):**

- Mixed defaults (UTC vs system time) can lead to inconsistent outputs across utilities; consider aligning or documenting clearly.

### 2.2 TypeScript & Typing Quality

- [✅] **No `any` / unsafe types** in the exported API.
- [✅] **Generics used correctly** where needed (none required).
- [✅] **Explicit return type** for public utilities (string).
- [✅] **Public types** (`DateFormatterOptions`, `RelativeTimeOptions`) are clear and shared.
- [✅] **Internal helper types** are scoped in code.

**Notes (Typing):**

- Options are readonly-friendly via shared types; no overload complexity.

### 2.3 Safety, Robustness & SSR

- [✅] **Null/Undefined Handling:** Throws for invalid dates; guards Intl availability; falls back to basic formatting.
- [⚠️] **Error Handling:** Formatter creation failures only warn in development; cache eviction removes oldest 20% without LRU awareness; fallback date formatting is locale-agnostic and coarse.
- [✅] **SSR Safe:** No DOM; guarded Intl usage.
- [✅] **Browser API Use:** Uses Intl.* with checks; safe string/Date operations.
- [✅] **Security-Sensitive Logic:** N/A.

**Notes (Safety & SSR):**

- Cache eviction policy may drop recently used entries; no max-age/TTL, so cache can hold stale calendars if options change subtly.

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

- [✅] **Complexity Reasonable:** O(1) per call; caching reduces formatter churn.
- [✅] **No Unnecessary Allocations:** Reuses Intl instances; small Maps.
- [⚠️] **No Layout Thrashing:** N/A; note that cache keys stringify options each call; could be optimized for hot paths.
- [✅] **Tree-Shakeable:** Side-effect free modules.
- [✅] **Used in Hot Paths:** Suitable for repeated use; cache size capping prevents unbounded growth.

**Notes (Performance):**

- Cache eviction removes 20% blindly; LRU would be more predictable.

### 2.6 Testing & Coverage

- [⚠️] **Unit Tests Exist:** `formatDate.test.ts` exists; no test file found for `formatRelativeTime`; caching/eviction paths untested.
- [⚠️] **Edge Cases Covered:** Minimal; no tests for invalid locales, Intl absence, mixed time zones, or auto vs always numeric relative formats.
- [⚠️] **Branch Coverage High:** Warning/eviction/fallback branches largely untested.
- [✅] **Regression Tests:** None noted; existing test is basic.
- [✅] **No Overly Fragile Tests:** Current tests are simple.

**Notes (Tests):**

- Add dedicated tests for relative time unit selection, cache behavior, fallback paths, and UTC vs local defaults.

### 2.7 Documentation & DX

- [✅] **JSDoc/TSDoc Present:** Rich examples in code.
- [⚠️] **Usage Examples:** No Storybook/docs page; examples only inline.
- [✅] **Error Messages Useful:** Throws TypeError on invalid dates; warnings include context.
- [⚠️] **Consistent with DSAi Patterns:** Default UTC in `formatDate` differs from system-time defaults elsewhere; document this divergence.

**Notes (Docs & DX):**

- Explicitly document cache behavior, defaults (UTC vs local), and fallback formatting limitations.

---

## 3. Scoring (0–100)

> Score after going through the checklist. Use judgment, but be consistent.

- **API & SRP:** 13/15
- **Typing & TS Quality:** 15/15
- **Safety & Robustness (incl. SSR & security):** 15/20
- **Accessibility (if applicable):** 15/15 (N/A)
- **Performance:** 14/15
- **Testing & Coverage:** 6/10
- **Documentation & DX:** 8/10

**Total Score:** **86/100**  
**Grade:** Solid, needs test coverage and default clarity

**Short Score Summary (1–3 sentences):**

- Intl-based formatters with caching and fallbacks are SSR-safe and type-strong. Gaps: sparse tests (especially for relative time and caching), mixed UTC vs local defaults, coarse eviction strategy, and undocumented behavior on invalid locales/Intl absence.

---

## 4. Vendor Comparison (Carbon, Ant, MUI, Shadcn, Redux)

> Compare the date utilities conceptually to equivalents in other major systems.

- **Closest Equivalents:**
  - UI kits typically lean on `date-fns`/`luxon`/`dayjs` or Intl directly; no bundled formatter wrappers.
  - Redux/tooling: Not applicable; date formatting left to app code.
- **Parity:** Above (provides built-in wrappers and caching vs UI kits), below dedicated libs (less control over calendars/locales, no duration formatting).
- **Strengths (DSAi vs others):**
  - SSR-safe Intl wrappers with cache controls and fallbacks.
  - Type-safe options aligned with Intl; simple API surface.
- **Gaps / Weaknesses vs others:**
  - Limited option coverage (numberingSystem/calendar not in cache key), basic fallback formatting, and non-LRU eviction.
  - No duration/diff helpers; relative time unit selection is heuristic without thresholds customization.
- **Action Items to Surpass:**
  - Add LRU eviction and cache key that includes numberingSystem/calendar/timeZone; clarify/align defaults.
  - Add tests and docs for Intl absence, invalid locales, and numeric/auto behaviors; consider exposing thresholds configuration for relative time.

---

## 5. Issues, Risks & Recommended Actions

### 5.1 Issues & Risks

List concrete issues found. Each issue must have a severity:

- [Severity: Medium] `formatDate` forces `timeZone: 'UTC'` by default, diverging from caller expectations of local time and from `formatRelativeTime` base-date default (local), leading to inconsistent outputs.
- [Severity: Medium] `formatRelativeTime` lacks tests and edge validation; cache keys ignore numberingSystem/calendar, so formatters may be reused incorrectly across differing options.
- [Severity: Low] Cache eviction removes oldest 20% without LRU ordering; may evict hot entries unpredictably.
- [Severity: Low] Option sorting via JSON.stringify in `formatDate` cache key may differ for non-primitive options; potential cache misses/hits mismatching intent.

### 5.2 Recommended Actions

Pick one or more:

- [ ] Keep as is (no changes needed).
- [✅] Refactor (backwards compatible):
  - Align defaults (either document UTC default loudly or allow opting into local via option flag; consider local default for parity).
  - Enhance cache keys to include relevant Intl options (e.g., numberingSystem/calendar) and switch eviction to LRU.
  - Add comprehensive tests for relative time unit selection, cache behavior, Intl absence, invalid locale handling, and UTC vs local defaults.
  - Document fallback behavior and cache semantics; add Storybook/docs snippet for date/relative formatting.
- [ ] Breaking change recommended (with migration plan):
  - N/A
- [ ] Deprecate and replace:
  - N/A

**Implementation Notes / Plan:**

- Step 1: Decide and document default timeZone behavior; optionally add `defaultTimeZone?: 'UTC' | 'local'` or similar.
- Step 2: Introduce LRU eviction and richer cache key; cover relative time formatter options fully.
- Step 3: Add tests for invalid/Intl-missing scenarios, cache hit/miss, and unit threshold selection; update docs accordingly.

---

## 6. Definition of Done (DoD) for Date/Time Utilities

This task is **Done** when:

- [✅] All checklist items are reviewed and marked with notes.
- [ ] Necessary fixes and refactors are implemented.
- [ ] Tests updated/added and passing.
- [ ] Coverage targets for these utilities are met.
- [ ] Documentation/JSDoc is updated and accurate.
- [ ] Any breaking changes have a clear migration note.
- [✅] Vendor comparison section is filled in with honest evaluation.

---
