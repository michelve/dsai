# Task: Audit Utility – `announceToScreenReader`

**Task ID:** TASK-77  
**Title:** Audit and harden utility `announceToScreenReader` in `packages/@dsai/react/src/utils/a11y/announceToScreenReader.ts`  
**Priority:** High  
**Status:** 🟢 Evaluated (review complete, fixes pending)  
**Assigned To:** [TBD]  
**Estimated Time:** 2–4 hours  
**Created:** Auto  
**Updated:** 2025-12-11

---

## 1. Utility Metadata

- **Name:** `announceToScreenReader`
- **File:** `packages/@dsai/react/src/utils/a11y/announceToScreenReader.ts`
- **Category:** a11y
- **TypeScript:** Yes (strict)
- **Used By (key components/hooks):**
  - No component/hook consumers found; exported from `packages/@dsai/react/src/index.ts`
  - Storybook docs: `packages/@dsai/storybook/docs/utilities/A11y.stories.tsx`

---

## 2. Checklist Evaluation

> Use the checkboxes below after reviewing the actual code.  
> Mark each item as ✅ Pass, ⚠️ Needs Improvement, or ❌ Fail.  
> Add short notes where useful.

### 2.1 API Design & Responsibilities

- [✅] **Single Responsibility:** Creates/reuses offscreen live region and announces a message.
- [⚠️] **Clear Input/Output:** Options allow politeness/id/timeout; if a live region already exists with different politeness, it is reused without updating, so later assertive calls may stay polite.
- [✅] **No Hidden Side Effects:** DOM write is expected; returns cleanup to clear text/timer.
- [✅] **Naming:** Clear and aligned with behavior.
- [⚠️] **Reusability:** Generic, but default `id` reuse without updating politeness can surprise consumers needing per-call assertive behavior.

**Notes (API & SRP):**

- Stateless API except for the shared live region element keyed by `id`. Reusing the element keeps prior `aria-live` value, which can mute assertive announcements after a polite call unless the caller changes `id`.

### 2.2 TypeScript & Typing Quality

- [✅] **No `any` / unsafe types** in the exported API.
- [✅] **Generics used correctly** where needed (`<T>` with constraints).
- [✅] **Explicit return type** for the exported utility.
- [⚠️] **Public types** (if exported) are clear and stable. (`AnnounceOptions` is readable, but callers might expect an `assertive` boolean alias; tests reference it.)
- [✅] **Internal helper types** are not exported unnecessarily.

**Notes (Typing):**

- `AnnounceOptions` is readonly-friendly and exported. Consider adding a narrow union/alias for `politeness` or a deprecated `assertive?: boolean` bridge to match expectations seen in tests.

### 2.3 Safety, Robustness & SSR

- [⚠️] **Null/Undefined Handling:** SSR guard for `document`, but assumes `document.body` exists; calling before DOM ready would throw when appending.
- [⚠️] **Error Handling:** No explicit errors, but no fallback if container creation fails or timeoutMs is invalid.
- [✅] **SSR Safe:** Early-return when `document` is undefined; no top-level DOM touch.
- [✅] **Browser API Use:** Uses `window.setTimeout/clearTimeout` only after DOM guard.
- [✅] **Security-Sensitive Logic:**
  - Text is set via `textContent`, so no injection risk.

**Notes (Safety & SSR):**

- Consider guarding `document.body` (e.g., queue until ready or create a detached element) to avoid runtime errors in pre-body contexts.

### 2.4 Accessibility (If Applicable)

> Required for utilities that deal with focus, keyboard, ARIA, screen readers, or DOM accessibility.

- [✅] **Keyboard Semantics:** N/A (no keyboard handling).
- [✅] **Focus Management:** N/A.
- [✅] **Focusable Selectors:** N/A.
- [⚠️] **Screen Reader Support:** Creates hidden `aria-live` region with `aria-atomic`; does not set a `role` (`status`/`alert`) and does not update `aria-live` when reusing a pre-existing region.
- [⚠️] **WCAG Alignment:** Generally aligned, but missing `role` and politeness update may reduce reliability for assertive announcements.

**Notes (Accessibility):**

- Add `role="status"` (or `alert` when assertive) and reapply `aria-live`/`aria-atomic` on reuse to keep the region accurate for successive calls.

### 2.5 Performance & Complexity

- [✅] **Complexity Reasonable:** O(1).
- [✅] **No Unnecessary Allocations:** Only creates the live region once per `id`.
- [✅] **No Layout Thrashing:** Style writes happen once; no reads.
- [✅] **Tree-Shakeable:** No top-level side effects.
- [✅] **Used in Hot Paths:** Not typically per-render; acceptable overhead.

**Notes (Performance):**

- Cleanup cancels timeout and clears text; no lingering listeners or observers.

### 2.6 Testing & Coverage

- [✅] **Unit Tests Exist** for `announceToScreenReader`.
- [⚠️] **Edge Cases Covered:** SSR (`document` missing) and cleanup are covered; missing coverage for reuse with different `politeness` and for absent `document.body`.
- [⚠️] **Branch Coverage High:** Reasonable, but lacks tests for reused container/update paths and invalid options.
- [⚠️] **Regression Tests:** No explicit regression history noted.
- [⚠️] **No Overly Fragile Tests:** jest-axe suite expects `role="status"` and uses `{ assertive: true }`, which does not match the typed API; could become brittle.

**Notes (Tests):**

- Tests in `packages/@dsai/react/src/utils/__tests__/a11y-jest-axe.test.ts` and `utils-enterprise-compliance.test.ts` validate creation, SSR guard, cleanup, and politeness, but one test assumes a `role` attribute that is not currently set.

### 2.7 Documentation & DX

- [✅] **JSDoc/TSDoc Present:** Brief summary and options described inline.
- [✅] **Usage Examples:** Storybook docs under `docs/utilities/A11y.stories.tsx` show usage.
- [✅] **Error Messages Useful:** N/A (no errors thrown).
- [✅] **Consistent with DSAi Patterns:** Naming and options follow existing patterns.

**Notes (Docs & DX):**

- Consider documenting the shared-region behavior and how to request assertive announcements reliably (e.g., custom `id` or updated `aria-live` on reuse).

---

## 3. Scoring (0–100)

> Score after going through the checklist. Use judgment, but be consistent.

- **API & SRP:** 12/15
- **Typing & TS Quality:** 14/15
- **Safety & Robustness (incl. SSR & security):** 16/20
- **Accessibility (if applicable):** 12/15
- **Performance:** 14/15
- **Testing & Coverage:** 8/10
- **Documentation & DX:** 8/10

**Total Score:** **84/100**  
**Grade:** Solid, production-ready

**Short Score Summary (1–3 sentences):**

- SSR-safe live-region helper with cleanup and clear API, already documented and tested. Gaps: reused containers do not update `aria-live`, missing `role` attribute, and no guard for `document.body` availability.

---

## 4. Vendor Comparison (Carbon, Ant, MUI, Shadcn, etc.)

> Compare `<utilityName>` conceptually to equivalent utilities or patterns in other major systems.

- **Closest Equivalents:**
  - Carbon: No dedicated helper; similar behavior comes from `aria-live` messaging patterns in `Notification` components.
  - Ant Design: No utility; relies on `message/notification` components with `role="alert"`.
  - MUI: No standalone helper; `Snackbar/Alert` components expose `role="status"/"alert"` for announcements.
  - Shadcn / Radix / others: Radix lacks a live-announcer; React Aria provides `useLiveAnnouncer`/`announce`.

- **Parity:** On Par (feature set similar to ad-hoc patterns, but role/politeness handling lags best-practice helpers like React Aria).
- **Strengths (DSAi vs others):**
  - SSR guard and cleanup function provided.
  - Single shared live region keeps DOM footprint minimal.
- **Gaps / Weaknesses vs others:**
  - Missing `role` assignment and politeness updates on reuse.
  - No fallback when `document.body` is unavailable; options aliasing unclear vs expectations (`assertive` boolean).
- **Action Items to Surpass:**
  - Set/update `role` and `aria-live` on every call; guard body-null scenarios.
  - Consider aliasing `assertive?: boolean` to improve DX parity with React Aria.
  - Add tests for reused container behavior and document body absence.

---

## 5. Issues, Risks & Recommended Actions

### 5.1 Issues & Risks

List concrete issues found. Each issue must have a severity:

- [Severity: Medium] Reused live region keeps prior `aria-live` value; assertive announcements after a polite call may remain polite unless a new `id` is used.
- [Severity: Medium] Live region lacks an explicit `role` (`status`/`alert`), which some SR/AT combinations expect and which tests assume.
- [Severity: Low] Assumes `document.body` exists; calling before body is available would throw when appending the container.
- [Severity: Low] API typing exposes `politeness`, but tests reference an `assertive` boolean, suggesting possible DX mismatch.

### 5.2 Recommended Actions

Pick one or more:

- [ ] Keep as is (no changes needed).
- [✅] Refactor (backwards compatible):
  - Always set/update `role`, `aria-live`, and `aria-atomic` on the container, even when reused; consider `role="alert"` when politeness is `assertive`.
  - Guard `document.body` existence (e.g., create on `document.documentElement` or return noop until ready).
  - Optionally accept `assertive?: boolean` as a convenience alias and normalize to `politeness`.
  - Add tests for reused container politeness, body-null safety, and role assignment.
- [ ] Breaking change recommended (with migration plan):
  - N/A
- [ ] Deprecate and replace:
  - N/A

**Implementation Notes / Plan:**

- Step 1: Normalize options (`politeness`, `id`, `timeoutMs`, optional `assertive`) and resolve politeness each call.
- Step 2: Ensure/create the live region safely (`document.body` fallback), set `role`/`aria-live`/`aria-atomic` every call, and announce message.
- Step 3: Expand tests to cover role, politeness updates on reuse, and body-null scenario; update docs to describe shared-region behavior.

---

## 6. Definition of Done (DoD) for `<utilityName>`

This task is **Done** when:

- [✅] All checklist items are reviewed and marked with notes.
- [ ] Necessary fixes and refactors are implemented.
- [ ] Tests updated/added and passing.
- [ ] Coverage targets for this utility are met.
- [ ] Documentation/JSDoc is updated and accurate.
- [ ] Any breaking changes have a clear migration note.
- [ ] Vendor comparison section is filled in with honest evaluation.

---
