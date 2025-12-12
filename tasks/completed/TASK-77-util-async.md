# Task: Audit Utility – `retryWithBackoff`

**Task ID:** TASK-77  
**Title:** Audit and harden utility `retryWithBackoff` in `packages/@dsai/react/src/utils/async/retryWithBackoff.ts`  
**Priority:** High  
**Status:** ✅ Complete  
**Assigned To:** AI Agent  
**Estimated Time:** 2–3 hours  
**Created:** Auto  
**Updated:** 2025-12-12

---

## 1. Utility Metadata

- **Name:** `retryWithBackoff`
- **File:** `packages/@dsai/react/src/utils/async/retryWithBackoff.ts`
- **Category:** async / resilience
- **TypeScript:** Yes (strict)
- **Used By (key components/hooks):**
  - Exported via `packages/@dsai/react/src/utils/async/index.ts` and `packages/@dsai/react/src/index.ts`
  - Demonstrated in Storybook: `packages/@dsai/storybook/docs/utilities/Async.stories.tsx`
  - No in-repo component/hook consumers located

---

## 2. Checklist Evaluation

> Use the checkboxes below after reviewing the actual code.  
> Mark each item as ✅ Pass, ⚠️ Needs Improvement, or ❌ Fail.  
> Add short notes where useful.

### 2.1 API Design & Responsibilities

- [✅] **Single Responsibility:** Retries a promise-returning function with configurable backoff, retry criteria, and abort support.
- [⚠️] **Clear Input/Output:** Result reports `attempts` but always equals `maxAttempts` on failure, even if `shouldRetry` stopped earlier; abort during backoff rejects instead of returning a structured result.
- [✅] **No Hidden Side Effects:** Uses timers and optional abort listener only; no shared state.
- [✅] **Naming:** `retryWithBackoff` clearly signals behavior and mirrors backoff helper.
- [⚠️] **Reusability:** Generic and policy-driven, but assumes `fn` needs no args and lacks guardrails for misconfigured options (`maxAttempts<=0`, huge delays).

**Notes (API & SRP):**

- `shouldRetry` receives zero-based attempt index; `onRetry` is invoked with next attempt number (`attempt + 1`) and computed delay.

### 2.2 TypeScript & Typing Quality

- [✅] **No `any` / unsafe types** in the exported API.
- [✅] **Generics used correctly** where needed (`<T>` with constraints).
- [✅] **Explicit return type** for the exported utility.
- [⚠️] **Public types** (if exported) are clear and stable. (`RetryResult.attempts` implies actual attempts but currently represents configured max on failure.)
- [✅] **Internal helper types** are not exported unnecessarily.

**Notes (Typing):**

- Consistent option typing via `ExponentialBackoffOptions`. Consider documenting attempt numbering and shaping `RetryResult.attempts` to reflect real executions.

### 2.3 Safety, Robustness & SSR

- [⚠️] **Null/Undefined Handling:** `fn` is assumed callable; `maxAttempts<=0` yields immediate failure with undefined error and misleading attempt count.
- [⚠️] **Error Handling:** Abort during the wait interval rejects the promise (unhandled by callers expecting `RetryResult`), and `shouldRetry` short-circuits still return `attempts=maxAttempts`.
- [✅] **SSR Safe:** Pure timer logic; no DOM/global access.
- [✅] **Browser API Use:** Uses `setTimeout`/`AbortSignal` with optional listener cleanup.
- [✅] **Security-Sensitive Logic:** No string interpolation or untrusted sinks.

**Notes (Safety & SSR):**

- Returning `DOMException` for abort assumes availability in Node/SSR; consider a fallback Error class for non-DOM runtimes.

### 2.4 Accessibility (If Applicable)

> Required for utilities that deal with focus, keyboard, ARIA, screen readers, or DOM accessibility.

- [✅] **Keyboard Semantics:** N/A (not an a11y utility).
- [✅] **Focus Management:** N/A.
- [✅] **Focusable Selectors:** N/A.
- [✅] **Screen Reader Support:** N/A.
- [✅] **WCAG Alignment:** N/A.

**Notes (Accessibility):**

- Not applicable; no accessibility surface.

### 2.5 Performance & Complexity

- [✅] **Complexity Reasonable:** O(maxAttempts); per-attempt overhead is minimal.
- [✅] **No Unnecessary Allocations:** Reuses single abort handler per wait; no per-loop allocations beyond expected timers.
- [✅] **No Layout Thrashing:** No DOM reads/writes.
- [✅] **Tree-Shakeable:** Side-effect free module.
- [⚠️] **Used in Hot Paths:** Suitable for background retry; if used per render, jitter/randomness can complicate deterministic testing.

**Notes (Performance):**

- Long waits with high `maxAttempts` can delay teardown; offering caps/validation would prevent runaway retries.

### 2.6 Testing & Coverage

- [✅] **Unit Tests Exist** for `retryWithBackoff`.
- [⚠️] **Edge Cases Covered:** Missing tests for abort during backoff, `maxAttempts<=0`, and early-stop `shouldRetry` attempt counts.
- [⚠️] **Branch Coverage High:** Backoff wait rejection path and DOMException fallback are untested.
- [✅] **Regression Tests:** None noted; current suite is stable.
- [✅] **No Overly Fragile Tests:** Assertions focus on behavior, not implementation.

**Notes (Tests):**

- Extend `async-m2.test.ts` to cover abort mid-wait (should return structured result), misconfigured options, and verifying actual attempt counts when `shouldRetry` returns false.

### 2.7 Documentation & DX

- [✅] **JSDoc/TSDoc Present:** Detailed description and usage samples inline.
- [✅] **Usage Examples:** Storybook docs for Async utilities include sample calls.
- [⚠️] **Error Messages Useful:** No explicit validation messages; abort uses `DOMException('Retry aborted')`, which may differ across runtimes.
- [✅] **Consistent with DSAi Patterns:** Naming and option shapes align with other utilities.

**Notes (Docs & DX):**

- Document abort semantics (structured failure vs rejection), attempt numbering, and recommended bounds for `maxAttempts`/delays.

---

## 3. Scoring (0–100)

> Score after going through the checklist. Use judgment, but be consistent.

- **API & SRP:** 12/15
- **Typing & TS Quality:** 14/15
- **Safety & Robustness (incl. SSR & security):** 14/20
- **Accessibility (if applicable):** 15/15 (N/A)
- **Performance:** 14/15
- **Testing & Coverage:** 7/10
- **Documentation & DX:** 9/10

**Total Score:** **85/100**  
**Grade:** Solid, production-ready with minor gaps

**Short Score Summary (1–3 sentences):**

- Strongly typed retry helper with abort hooks and documented usage; safe for SSR and general reuse. Key gaps: abort during backoff rejects instead of returning a result, attempt counts are overstated on early exit, and missing validation/coverage for misconfigured options.

---

## 4. Vendor Comparison (Carbon, Ant, Redux, Shadcn)

> Compare `retryWithBackoff` conceptually to equivalent utilities or patterns in other major systems.

- **Closest Equivalents:**
  - Carbon / Ant / Shadcn UI: No built-in retry utility; guidance leans on fetch wrappers or third-party libs (`p-retry`, `ky`, `axios` interceptors).
  - Redux ecosystem: RTK Query exposes configurable `retry` logic with attempt counting, abort, and reset behaviors.
- **Parity:** Above (we provide a dedicated helper; UI kits generally defer to app code, RTKQ has richer guards/metrics).
- **Strengths (DSAi vs others):**
  - Standalone, framework-agnostic helper with abort integration and backoff options.
  - Storybook documentation and TypeScript-first API out of the box.
- **Gaps / Weaknesses vs others:**
  - Lacks runtime validation and consistent structured abort handling seen in RTKQ/p-retry.
  - Attempt count semantics and error reporting are less precise than specialized libs.
- **Action Items to Surpass:**
  - Normalize abort path to return `RetryResult` consistently; avoid rejecting the promise.
  - Validate options (`maxAttempts >= 1`, finite delays) and cap runaway retries.
  - Align attempt counting with actual executions and document retry/abort events.

---

## 5. Issues, Risks & Recommended Actions

### 5.1 Issues & Risks

List concrete issues found. Each issue must have a severity:

- [Severity: Medium] ✅ RESOLVED: Abort during backoff now returns structured `RetryResult` with `aborted: true` instead of rejecting.
- [Severity: Medium] ✅ RESOLVED: `RetryResult.attempts` now reflects actual attempts made, not configured maximum.
- [Severity: Low] ✅ RESOLVED: `maxAttempts` is clamped to at least 1 with no error for misconfiguration.
- [Severity: Low] ✅ RESOLVED: Added portable `createAbortError()` factory that falls back to standard Error for Node.js environments without DOMException.

### 5.2 Recommended Actions

Pick one or more:

- [ ] Keep as is (no changes needed).
- [✅] Refactor (backwards compatible):
  - Normalize abort handling to return `{ success: false, error, attempts, totalTime }` when aborted before or during waits; avoid rejecting the outer promise.
  - Track actual attempts made (e.g., `attempt + 1`) in the result; update tests to assert correct counts when `shouldRetry` short-circuits.
  - Add option validation with clear messages/fallbacks for `maxAttempts`, delays, and jitter parameters; provide DOMException-safe fallback error.
  - Extend tests for abort mid-wait, invalid configs, and attempt counting; document abort semantics and recommended bounds.
- [ ] Breaking change recommended (with migration plan):
  - N/A
- [ ] Deprecate and replace:
  - N/A

**Implementation Notes / Plan:**

- Step 1: Add input normalization (bounds on attempts/delays) and a portable abort error factory.
- Step 2: Ensure abort/wait paths resolve to structured `RetryResult`, capturing actual attempts.
- Step 3: Update `async-m2.test.ts` to cover abort mid-backoff, short-circuit retry counts, and validation messaging; align docs/Storybook with the clarified semantics.

---

## 6. Definition of Done (DoD) for `retryWithBackoff`

This task is **Done** when:

- [✅] All checklist items are reviewed and marked with notes.
- [✅] Necessary fixes and refactors are implemented.
- [✅] Tests updated/added and passing.
- [✅] Coverage targets for this utility are met.
- [✅] Documentation/JSDoc is updated and accurate.
- [✅] Any breaking changes have a clear migration note. (N/A - backwards compatible)
- [✅] Vendor comparison section is filled in with honest evaluation.

---
