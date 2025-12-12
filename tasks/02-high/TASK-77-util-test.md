# Task: Audit Utility – `<utilityName>`

**Task ID:** (leave blank or use auto-generated in pipeline)  
**Title:** Audit and harden utility `<utilityName>` in `packages/@dsai/react/src/utils/...`  
**Priority:** [Critical/High/Medium/Low]  
**Status:** ⚪ Not Started  
**Assigned To:** [TBD]  
**Estimated Time:** [e.g., 2–4 hours]  
**Created:** [Auto / Today]  
**Updated:** [Auto]

---

## 1. Utility Metadata

- **Name:** `<utilityName>`
- **File:** `packages/@dsai/react/src/utils/...`
- **Category:** [core | a11y | keyboard | validation | string | misc | types | other]
- **TypeScript:** [Yes/No, strict/loose]
- **Used By (key components/hooks):**
  - `packages/@dsai/react/src/components/...`
  - `packages/@dsai/react/src/hooks/...`
  - (List only real consumers, if known)

---

## 2. Checklist Evaluation

> Use the checkboxes below after reviewing the actual code.  
> Mark each item as ✅ Pass, ⚠️ Needs Improvement, or ❌ Fail.  
> Add short notes where useful.

### 2.1 API Design & Responsibilities

- [ ] **Single Responsibility:** Does `<utilityName>` do one clear job?
- [ ] **Clear Input/Output:** Inputs and returns are well-defined and predictable.
- [ ] **No Hidden Side Effects:** No unexpected DOM, network, or state changes.
- [ ] **Naming:** Name accurately reflects behavior and follows DSAi conventions.
- [ ] **Reusability:** Logic is generic enough and not tied to a specific component by mistake.

**Notes (API & SRP):**

- …

### 2.2 TypeScript & Typing Quality

- [ ] **No `any` / unsafe types** in the exported API.
- [ ] **Generics used correctly** where needed (`<T>` with constraints).
- [ ] **Explicit return type** for the exported utility.
- [ ] **Public types** (if exported) are clear and stable.
- [ ] **Internal helper types** are not exported unnecessarily.

**Notes (Typing):**

- …

### 2.3 Safety, Robustness & SSR

- [ ] **Null/Undefined Handling:** Defends against invalid or missing inputs.
- [ ] **Error Handling:** Failure modes are clear and documented.
- [ ] **SSR Safe:** No unguarded `window` / `document` / `navigator` at module top level.
- [ ] **Browser API Use:** Checks for availability before using browser APIs (`performance`, etc.).
- [ ] **Security-Sensitive Logic:**
  - For URL/href utils: rejects `javascript:`/`data:` and other dangerous schemes.
  - No unsafe HTML injection or unsanitized string concatenation.

**Notes (Safety & SSR):**

- …

### 2.4 Accessibility (If Applicable)

> Required for utilities that deal with focus, keyboard, ARIA, screen readers, or DOM accessibility.

- [ ] **Keyboard Semantics:** Key handlers follow expected patterns (`Enter`, `Space`, `Escape`).
- [ ] **Focus Management:** For focus utilities (e.g. `trapFocus`), focus is trapped and restored correctly.
- [ ] **Focusable Selectors:** Respect disabled/hidden elements and match modern a11y practices.
- [ ] **Screen Reader Support:** `announceToScreenReader` or similar uses ARIA live regions correctly.
- [ ] **WCAG Alignment:** Behavior supports WCAG 2.x and ARIA Authoring Practices when used as intended.

**Notes (Accessibility):**

- …

### 2.5 Performance & Complexity

- [ ] **Complexity Reasonable:** No obvious O(n²)/heavy loops in hot paths.
- [ ] **No Unnecessary Allocations:** Avoids creating objects/arrays in tight loops without need.
- [ ] **No Layout Thrashing:** Avoids repeated sync layout reads/writes.
- [ ] **Tree-Shakeable:** Exported as ESM with no top-level side effects that block tree-shaking.
- [ ] **Used in Hot Paths:** If used often (per render), implementation is optimized.

**Notes (Performance):**

- …

### 2.6 Testing & Coverage

- [ ] **Unit Tests Exist** for `<utilityName>`.
- [ ] **Edge Cases Covered:** Null/empty inputs, unusual values, etc.
- [ ] **Branch Coverage High:** Target ≥ 90% for this utility, especially if critical.
- [ ] **Regression Tests:** Known past bugs are covered.
- [ ] **No Overly Fragile Tests:** Tests verify behavior, not internal implementation details.

**Notes (Tests):**

- …

### 2.7 Documentation & DX

- [ ] **JSDoc/TSDoc Present:** Summary, parameters, return type explained.
- [ ] **Usage Examples:** At least one example in docs/Storybook or code comments for complex utilities.
- [ ] **Error Messages Useful:** Any thrown/logged errors are clear and actionable.
- [ ] **Consistent with DSAi Patterns:** Naming and API style matches other utilities and hooks.

**Notes (Docs & DX):**

- …

---

## 3. Scoring (0–100)

> Score after going through the checklist. Use judgment, but be consistent.

- **API & SRP:** /15
- **Typing & TS Quality:** /15
- **Safety & Robustness (incl. SSR & security):** /20
- **Accessibility (if applicable):** /15
- **Performance:** /15
- **Testing & Coverage:** /10
- **Documentation & DX:** /10

**Total Score:** **\_\_/100**  
**Grade:**

- 90–100 → Enterprise-grade / Best-in-class
- 75–89 → Solid, production-ready
- 60–74 → Acceptable, needs improvements
- <60 → Not acceptable, needs refactor/redesign

**Short Score Summary (1–3 sentences):**

- …

---

## 4. Vendor Comparison (Carbon, Ant, MUI, Shadcn, etc.)

> Compare `<utilityName>` conceptually to equivalent utilities or patterns in other major systems.

- **Closest Equivalents:**
  - Carbon: …
  - Ant Design: …
  - MUI: …
  - Shadcn / Radix / others: …

- **Parity:** [Below / On Par / Above]
- **Strengths (DSAi vs others):**
  - …
- **Gaps / Weaknesses vs others:**
  - …
- **Action Items to Surpass:**
  - …

---

## 5. Issues, Risks & Recommended Actions

### 5.1 Issues & Risks

List concrete issues found. Each issue must have a severity:

- [Severity: Critical/High/Medium/Low] Description
- …

### 5.2 Recommended Actions

Pick one or more:

- [ ] Keep as is (no changes needed).
- [ ] Refactor (backwards compatible):
  - …
- [ ] Breaking change recommended (with migration plan):
  - …
- [ ] Deprecate and replace:
  - …

**Implementation Notes / Plan:**

- Step 1: …
- Step 2: …
- Step 3: …

---

## 6. Definition of Done (DoD) for `<utilityName>`

This task is **Done** when:

- [ ] All checklist items are reviewed and marked with notes.
- [ ] Necessary fixes and refactors are implemented.
- [ ] Tests updated/added and passing.
- [ ] Coverage targets for this utility are met.
- [ ] Documentation/JSDoc is updated and accurate.
- [ ] Any breaking changes have a clear migration note.
- [ ] Vendor comparison section is filled in with honest evaluation.

---
