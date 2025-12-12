# Task: Audit Utility – Keyboard Helpers (`isEnterKey`, `isEscapeKey`)

**Task ID:** TASK-77  
**Title:** Audit and harden keyboard utilities in `packages/@dsai/react/src/utils/keyboard`  
**Priority:** High  
**Status:** 🟢 Evaluated (review complete, fixes pending)  
**Assigned To:** [TBD]  
**Estimated Time:** 1 hour  
**Created:** Auto  
**Updated:** 2025-12-12

---

## 1. Utility Metadata

- **Names / Files:** `isEnterKey.ts`, `isEscapeKey.ts`
- **Category:** keyboard / a11y
- **TypeScript:** Yes (strict)
- **Used By (key components/hooks):**
  - Exported via `packages/@dsai/react/src/utils/keyboard/index.ts` → `packages/@dsai/react/src/utils/index.ts`
  - Tested in `packages/@dsai/react/src/utils/__tests__/utils-basic-functionality.test.ts`

---

## 2. Checklist Evaluation

> Mark each item as ✅ Pass, ⚠️ Needs Improvement, or ❌ Fail.

### 2.1 API Design & Responsibilities

- [✅] Single Responsibility: Predicate helpers for Enter/Escape keys.
- [✅] Clear Input/Output: Accept KeyboardEvent-like objects; return boolean.
- [✅] No Hidden Side Effects.
- [✅] Naming: Clear.
- [⚠️] Reusability: Only checks `code`/`key`/`keyCode`; no support for `which`.

### 2.2 TypeScript & Typing Quality

- [✅] No `any`.
- [✅] Explicit return type.
- [⚠️] Public types: accepts loose event-like shape; misuse possible.

### 2.3 Safety, Robustness & SSR

- [✅] Null/Undefined tolerant (optional fields).
- [✅] SSR Safe (no DOM access).
- [✅] Error Handling N/A.

### 2.4 Accessibility

- [✅] Aligns with Enter/Escape detection and IME composition guard.

### 2.5 Performance & Complexity

- [✅] O(1), trivial.

### 2.6 Testing & Coverage

- [✅] Unit Tests Exist (basic functionality).
- [⚠️] Edge Cases: No tests for `isComposing`, `code` vs `key`, or mixed event shapes.

### 2.7 Documentation & DX

- [⚠️] JSDoc Present but minimal examples; no Storybook/docs.

---

## 3. Scoring (0–100)

- API & SRP: 14/15  
- Typing: 13/15  
- Safety: 18/20  
- Accessibility: 15/15  
- Performance: 15/15  
- Testing: 8/10  
- Docs/DX: 7/10  

**Total:** **90/100** (Strong, minor gaps)

**Summary:** Simple, SSR-safe key predicates with tests; add coverage for IME and code/key fallbacks and document usage.

---

## 4. Vendor Comparison

- Most UI kits inline similar checks; centralizing helpers is at parity/above.

---

## 5. Issues & Recommended Actions

- [Severity: Low] Only supports `code`/`key`/`keyCode`; no `which`.
- [Severity: Low] Loose typing allows non-event inputs; IME guard untested.

**Actions:** Add tests for `isComposing`, `code` vs `key` fallback, and mixed event shapes; optionally tighten typing or document expected shape.

---

## 6. Definition of Done

- [✅] Checklist reviewed  
- [ ] Fixes implemented  
- [✅] Tests updated/passing  
- [ ] Docs updated  
- [ ] Migration notes (if any)  
