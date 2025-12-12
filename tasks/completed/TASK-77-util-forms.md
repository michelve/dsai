# Task: Audit Utility – Forms Suite (validation, parsing, serialization)

**Task ID:** TASK-77  
**Title:** Audit and harden form utilities in `packages/@dsai/react/src/utils/forms`  
**Priority:** High  
**Status:** 🟢 Evaluated (review complete, fixes pending)  
**Assigned To:** [TBD]  
**Estimated Time:** 3–5 hours  
**Created:** Auto  
**Updated:** 2025-12-12

---

## 1. Utility Metadata

- **Names / Files:**  
  - Validation: `createValidator.ts`, `validateField.ts`, `validateForm.ts`, `types.ts`  
  - State helpers: `isFormDirty.ts`, `isFormValid.ts`, `getFieldError.ts`  
  - Form data handling: `parseFormData.ts`, `serializeForm.ts`, `resetForm.ts`, `submitForm.ts`  
  - Misc: `index.ts`
- **Category:** forms / validation
- **TypeScript:** Yes (strict)
- **Used By (key components/hooks):**
  - Exported via `packages/@dsai/react/src/utils/forms/index.ts` → `packages/@dsai/react/src/utils/index.ts`
  - Tests: `utils/__tests__/forms-m2.test.ts` (covers validation/dirty/serialization paths)

---

## 2. Checklist Evaluation

> Use the checkboxes below after reviewing the actual code.  
> Mark each item as ✅ Pass, ⚠️ Needs Improvement, or ❌ Fail.  
> Add short notes where useful.

### 2.1 API Design & Responsibilities

- [✅] **Single Responsibility:** Each helper targets a discrete form concern (validation, dirty check, parsing, serialization, submit/reset).
- [⚠️] **Clear Input/Output:** `validateForm` collects errors but ignores schema keys not in data; `parseFormData` infers arrays/objects via naming conventions without validation; `submitForm` (not shown) likely wraps fetch but isn’t audited here.
- [✅] **No Hidden Side Effects:** Pure functions aside from console warnings and network (submit).
- [✅] **Naming:** Clear and conventional.
- [⚠️] **Reusability:** Validation rules assume boolean return; no support for async rule metadata (e.g., debounce/cancel). `parseFormData` silently overwrites duplicate dot/bracket conflicts.

**Notes (API & SRP):**

- `createValidator` is a thin wrapper over `validateField`; schema typing is loose (`Record<string, unknown>`), so nested validation relies on caller discipline.

### 2.2 TypeScript & Typing Quality

- [✅] **No `any` / unsafe types** in the exported API.
- [✅] **Generics used correctly** for validators and schemas.
- [✅] **Explicit return type** for public utilities.
- [⚠️] **Public types** are minimal; `FormData` type omits nested structures beyond `Record<string, FormFieldValue | FormFieldValue[] | FormData>` but `parseFormData` returns `Record<string, unknown>`, losing type fidelity.
- [✅] **Internal helper types** are scoped.

**Notes (Typing):**

- Schema typing does not enforce alignment with data shape (no mapped type enforcing required keys), so mis-specified schemas compile.

### 2.3 Safety, Robustness & SSR

- [✅] **Null/Undefined Handling:** Validators operate on provided values; parse/serialize handle FormData gracefully.
- [⚠️] **Error Handling:** `parseFormData` overwrites on conflicts and does not guard prototype pollution keys; `validateForm` shallowly indexes `data[field]` without existence checks; `resetForm`/`submitForm` not reviewed here may mutate DOM.
- [✅] **SSR Safe:** Utilities avoid DOM except where FormData is used (browser-only expectation).
- [✅] **Browser API Use:** FormData usage guarded by caller; no direct DOM access in shown files.
- [✅] **Security-Sensitive Logic:** No direct sinks, but parse could be hardened against dangerous keys.

**Notes (Safety & SSR):**

- Prototype pollution risk via `parseFormData` if a key like `__proto__` is appended; currently no guard.

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

- [✅] **Complexity Reasonable:** O(n) over rules/fields; parse walks entries once.
- [✅] **No Unnecessary Allocations:** Minimal objects; promise/all for validation.
- [✅] **No Layout Thrashing:** Pure data ops.
- [✅] **Tree-Shakeable:** Side-effect free modules.
- [✅] **Used in Hot Paths:** Suitable for form flows; parse handles arrays efficiently.

**Notes (Performance):**

- None.

### 2.6 Testing & Coverage

- [✅] **Unit Tests Exist** (forms-m2 test suite).
- [⚠️] **Edge Cases Covered:** Missing coverage for prototype pollution keys, conflicting array/dot notation, async validation rejection handling, and schema fields absent in data.
- [⚠️] **Branch Coverage High:** Overwrite/conflict paths in parse/serialize and error collection are untested.
- [✅] **Regression Tests:** None noted; current suite stable.
- [✅] **No Overly Fragile Tests:** Behavior-based assertions.

**Notes (Tests):**

- Add tests for `__proto__`/`constructor` keys in FormData, conflicting keys, async rule throwing, and schema fields not present in data.

### 2.7 Documentation & DX

- [✅] **JSDoc/TSDoc Present:** Inline docs with examples.
- [⚠️] **Usage Examples:** No Storybook/docs page; examples inline only.
- [✅] **Error Messages Useful:** Validation errors are caller-provided; parsing silent on conflicts.
- [✅] **Consistent with DSAi Patterns:** Naming and exports align.

**Notes (Docs & DX):**

- Document naming conventions for parse/serialize and caution about prototype-polluting keys.

---

## 3. Scoring (0–100)

> Score after going through the checklist. Use judgment, but be consistent.

- **API & SRP:** 13/15
- **Typing & TS Quality:** 14/15
- **Safety & Robustness (incl. SSR & security):** 14/20
- **Accessibility (if applicable):** 15/15 (N/A)
- **Performance:** 15/15
- **Testing & Coverage:** 8/10
- **Documentation & DX:** 8/10

**Total Score:** **87/100**  
**Grade:** Solid with some safety/edge-case gaps

**Short Score Summary (1–3 sentences):**

- Form utilities are type-safe, SSR-safe, and cover validation, parsing, and state helpers. Gaps: parse/serialize allow prototype-polluting keys and silent overwrites, schema typing doesn’t enforce data shape, and edge-case tests (async errors, conflicting keys) are missing.

---

## 4. Vendor Comparison (Carbon, Ant, MUI, Shadcn, Redux)

> Compare the form utilities conceptually to equivalent utilities or patterns in other major systems.

- **Closest Equivalents:** UI kits often rely on form libs (React Hook Form/Formik/Zod) rather than shipping validators; our utilities resemble lightweight validation/parsing helpers.
- **Parity:** Above UI kits (we provide built-ins); below dedicated libs for schema validation (Zod/Yup) and form state (RHF/Formik).
- **Strengths (DSAi vs others):**
  - Lightweight, dependency-free validation and parsing helpers.
  - Async rule support and schema-based form validation.
  - Helpers for dirty check and serialization keep form logic centralized.
- **Gaps / Weaknesses vs others:**
  - No schema-level type inference like Zod/Yup; schema typing is loose.
  - No guard against prototype pollution in parsing; no conflict resolution strategy.
  - No built-in debouncing/cancellation or field-level metadata for async rules.
- **Action Items to Surpass:**
  - Harden parsing against dangerous keys and conflicting notations; add tests.
  - Consider integrating schema typing/inference or documenting pairing with Zod/Yup.
  - Add options for async validation control (debounce/cancel) and clearer error aggregation.

---

## 5. Issues, Risks & Recommended Actions

### 5.1 Issues & Risks

List concrete issues found. Each issue must have a severity:

- [Severity: Medium] `parseFormData` allows keys like `__proto__`/`constructor` and will assign into `result` without guarding, risking prototype pollution if untrusted FormData is parsed.
- [Severity: Medium] Conflicting keys (dot vs bracket for same path) are silently overwritten; caller may lose data without warning.
- [Severity: Low] Schema typing does not enforce presence/shape of data fields; runtime will index `data[field]` even if absent.
- [Severity: Low] Async validation rules that throw (not return false) are unhandled; errors propagate rather than returning a validation result.

### 5.2 Recommended Actions

Pick one or more:

- [ ] Keep as is (no changes needed).
- [✅] Refactor (backwards compatible):
  - Add guard in `parseFormData` to skip dangerous keys (`__proto__`, `constructor`, `prototype`) and optionally warn on conflicts.
  - Consider warning/option when encountering conflicting keys (array vs dot) or duplicate keys.
  - Tighten schema typing to align with data shape or document pairing with schema validators; add try/catch in async validation with clear error result.
  - Add tests for pollution keys, conflicts, async rule rejection, and missing data fields.
- [ ] Breaking change recommended (with migration plan):
  - N/A
- [ ] Deprecate and replace:
  - N/A

**Implementation Notes / Plan:**

- Step 1: Harden `parseFormData` against dangerous keys and add conflict handling/warnings.
- Step 2: Add tests for the new guards and async rule error handling in `forms-m2.test.ts`.
- Step 3: Document naming conventions, conflict behavior, and recommended pairing with schema validators.

---

## 6. Definition of Done (DoD) for Form Utilities

This task is **Done** when:

- [✅] All checklist items are reviewed and marked with notes.
- [ ] Necessary fixes and refactors are implemented.
- [ ] Tests updated/added and passing.
- [ ] Coverage targets for these utilities are met.
- [ ] Documentation/JSDoc is updated and accurate.
- [ ] Any breaking changes have a clear migration note.
- [✅] Vendor comparison section is filled in with honest evaluation.

---
