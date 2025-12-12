# Task: Audit Utility – Misc Helpers (`getSafeInputProps`, events, placements)

**Task ID:** TASK-77  
**Title:** Audit and harden misc utilities in `packages/@dsai/react/src/utils/misc`  
**Priority:** High  
**Status:** 🟢 Evaluated (review complete, fixes pending)  
**Assigned To:** [TBD]  
**Estimated Time:** 2 hours  
**Created:** Auto  
**Updated:** 2025-12-12

---

## 1. Utility Metadata

- **Names / Files:** `getSafeInputProps.ts`, `clearAllEvent.ts`, `selectAllEvent.ts`, `toggleAllEvent.ts`, `toggleItemEvent.ts`, `mapPlacement.ts`, `normalizeTriggers.ts`, `ClearIcon.tsx`, `index.ts`
- **Category:** misc / events / safety
- **TypeScript:** Yes (strict)
- **Used By:** Security tests (`utils-security-validation.test.ts` covers getSafeInputProps and selection events); exported via misc index → utils barrel.

---

## 2. Checklist Evaluation

### 2.1 API Design & Responsibilities

- [✅] Single Responsibility per helper (whitelisted props, selection event payloads, placement mapping).
- [⚠️] Clear Input/Output: getSafeInputProps silently drops non-whitelisted props; selection events stringify values; mapPlacement/normalizeTriggers accept limited inputs, default silently.
- [✅] No Hidden Side Effects (pure data transforms).
- [✅] Naming clear.
- [⚠️] Reusability: SAFE_INPUT_ATTRIBUTES static; no extension hook; event helpers assume certain shapes.

### 2.2 Typing Quality

- [✅] No `any`; explicit return types.
- [⚠️] Public types: SAFE_INPUT_ATTRIBUTES is Record<string, true>; extending list requires code change; selection events coerce values to string arrays.

### 2.3 Safety & SSR

- [✅] No DOM access; SSR-safe.
- [⚠️] Error Handling: Silent drops/mutations may hide misconfig; no warning on unknown placements/triggers.

### 2.4 Accessibility

- [✅] getSafeInputProps supports ARIA whitelist; event helpers not a11y-related.

### 2.5 Performance

- [✅] O(n) over props; small.

### 2.6 Testing & Coverage

- [✅] Tests exist for getSafeInputProps and selection events (security suite).
- [⚠️] Edge cases: mapPlacement/normalizeTriggers and ClearIcon lack tests; no warning path coverage.

### 2.7 Documentation & DX

- [⚠️] JSDoc present but minimal; no Storybook/docs; SAFE_INPUT whitelist not documented externally.

---

## 3. Scoring

- API & SRP: 13/15  
- Typing: 13/15  
- Safety: 16/20  
- Accessibility: 14/15  
- Performance: 15/15  
- Testing: 8/10  
- Docs/DX: 7/10  

**Total:** **86/100** (Solid, minor DX gaps)

**Summary:** Safe prop and event helpers are concise and tested, but whitelist is rigid, some helpers lack tests/docs, and silent drops could hide misuse.

---

## 4. Vendor Comparison

- UI kits often embed similar helpers internally; having exported versions is slightly above parity; lacks configurability compared to form libs.

---

## 5. Issues & Recommended Actions

- [Severity: Medium] mapPlacement/normalizeTriggers untested; unknown inputs silently mapped.
- [Severity: Low] SAFE_INPUT_ATTRIBUTES not extensible; consumers must fork to add props.
- [Severity: Low] getSafeInputProps silently drops props without diagnostics.

**Actions:** Add tests for placement/trigger helpers; consider optional warning/extension hook for whitelist; document expected prop set and event payloads.

---

## 6. Definition of Done

- [✅] Checklist reviewed  
- [ ] Fixes implemented  
- [✅] Tests updated/passing  
- [ ] Docs updated  
- [ ] Migration notes (if any)  
