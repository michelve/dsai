# Task: Audit Utility – Number Helpers (`clamp`, `formatNumber`, `formatCurrency`)

**Task ID:** TASK-77  
**Title:** Audit and harden number utilities in `packages/@dsai/react/src/utils/number`  
**Priority:** High  
**Status:** 🟢 Evaluated (review complete, fixes pending)  
**Assigned To:** [TBD]  
**Estimated Time:** 1–2 hours  
**Created:** Auto  
**Updated:** 2025-12-12

---

## 1. Utility Metadata

- **Names / Files:** `clamp.ts`, `formatNumber.ts`, `formatCurrency.ts`, `index.ts`
- **Category:** number / formatting
- **TypeScript:** Yes (strict)
- **Used By:** Exported via number index → utils barrel; tests in `packages/@dsai/react/src/utils/number/formatNumber.test.ts`.

---

## 2. Checklist Evaluation

### 2.1 API Design & Responsibilities

- [✅] Single Responsibility: clamping, number/currency formatting via Intl.
- [⚠️] Clear Input/Output: `formatNumber` defaults `locale` and `options`; error handling for invalid locale falls back silently; `formatCurrency` likely wraps formatNumber but review needed for defaults.
- [✅] No Hidden Side Effects beyond Intl caching (if any).
- [✅] Naming clear.
- [⚠️] Reusability: Locale/timeZone (numberingSystem) options not exposed fully; currency options fixed.

### 2.2 Typing Quality

- [✅] No `any`; explicit return types.
- [✅] Options typed via shared formatter options.
- [⚠️] Public types minimal (no branded currency codes); rely on string currency.

### 2.3 Safety & SSR

- [✅] SSR-safe; Intl guarded in tests? (formatNumber test uses Intl).
- [⚠️] Error Handling: Invalid locale/currency may throw; no try/catch in formatter.

### 2.4 Accessibility

- [✅] N/A (formatting).

### 2.5 Performance

- [⚠️] No formatter cache; new Intl objects per call may be heavier in hot paths.

### 2.6 Testing & Coverage

- [✅] Unit tests for formatNumber/clamp.
- [⚠️] Edge cases: invalid locale/currency, large numbers, rounding vs grouping not fully covered.

### 2.7 Documentation & DX

- [⚠️] JSDoc present; no Storybook/docs; defaults not prominently documented.

---

## 3. Scoring

- API & SRP: 13/15  
- Typing: 14/15  
- Safety: 15/20  
- Accessibility: 15/15  
- Performance: 13/15  
- Testing: 8/10  
- Docs/DX: 8/10  

**Total:** **86/100** (Solid, needs edge handling/perf notes)

**Summary:** Clean numeric helpers with tests; add error handling for Intl failures, consider formatter caching, and cover edge cases in tests/docs.

---

## 4. Vendor Comparison

- UI kits rely on Intl or number libs; parity. Below specialized libs (numeral.js) for features, above kits that provide nothing.

---

## 5. Issues & Recommended Actions

- [Severity: Medium] No cache; repeated format calls create Intl instances—perf risk in hot paths.
- [Severity: Medium] Invalid locales/currencies can throw; no fallback.
- [Severity: Low] Edge cases untested (Infinity/NaN, huge numbers).

**Actions:** Add try/catch fallback with clear errors, optional formatter cache, and tests for invalid inputs/extreme values; document defaults and recommended usage.

---

## 6. Definition of Done

- [✅] Checklist reviewed  
- [ ] Fixes implemented  
- [✅] Tests updated/passing  
- [ ] Docs updated  
- [ ] Migration notes (if any)  
