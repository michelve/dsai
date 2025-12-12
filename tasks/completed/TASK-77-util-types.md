# Task: Audit Utility – Types Helpers (`isExternalUrl`, shared types)

**Task ID:** TASK-77  
**Title:** Audit and harden types utilities in `packages/@dsai/react/src/utils/types`  
**Priority:** High  
**Status:** 🟢 Evaluated (review complete, fixes pending)  
**Assigned To:** [TBD]  
**Estimated Time:** 1 hour  
**Created:** Auto  
**Updated:** 2025-12-12

---

## 1. Utility Metadata

- **Names / Files:** `isExternalUrl.ts`, `shared.ts`, `index.ts`
- **Category:** types / validation
- **TypeScript:** Yes (strict)
- **Used By:** Shared formatter/timing types; `isExternalUrl` used in validation tests (`utils-enterprise-compliance.test.ts`).

---

## 2. Checklist Evaluation

### 2.1 API Design & Responsibilities

- [✅] Single Responsibility: `isExternalUrl` checks protocol; `shared` defines formatter/timing option types.
- [⚠️] Clear Input/Output: `isExternalUrl` returns false for malformed inputs; scheme allowlist is fixed; relative URL handling documented via tests.
- [✅] No Hidden Side Effects.
- [✅] Naming clear.
- [⚠️] Reusability: Allowlist not configurable; `shared` types could diverge from actual implementations if not maintained.

### 2.2 Typing Quality

- [✅] No `any`; readonly option types.
- [⚠️] `isExternalUrl` accepts `unknown` but only string, returning false; could accept URL objects.

### 2.3 Safety & SSR

- [✅] Pure logic; SSR-safe.
- [✅] Error Handling: try/catch around URL parsing (in implementation) prevents throw.

### 2.4 Accessibility

- [✅] N/A.

### 2.5 Performance

- [✅] O(1); lightweight.

### 2.6 Testing & Coverage

- [✅] Covered in enterprise compliance tests.
- [⚠️] Edge cases: uppercase schemes, unusual protocols beyond allowlist, URL objects not tested.

### 2.7 Documentation & DX

- [⚠️] JSDoc minimal; no Storybook/docs; allowlist not configurable is not documented.

---

## 3. Scoring

- API & SRP: 13/15  
- Typing: 14/15  
- Safety: 18/20  
- Accessibility: 15/15  
- Performance: 15/15  
- Testing: 8/10  
- Docs/DX: 8/10  

**Total:** **91/100** (Strong with minor DX configurability gap)

**Summary:** Lightweight, safe helpers and shared types; consider configurability/documentation for external URL detection and ensure shared types stay aligned with implementations.

---

## 4. Vendor Comparison

- UI kits rarely ship these helpers; parity/above. Below specialized validators.

---

## 5. Issues & Recommended Actions

- [Severity: Low] isExternalUrl allowlist not configurable; edge protocols need documentation/tests.
- [Severity: Low] Shared types can drift from implementation defaults if not synchronized.

**Actions:** Document allowlist behavior; add tests for uppercase/mixed protocols and URL objects; ensure shared option types match formatter implementations.

---

## 6. Definition of Done

- [✅] Checklist reviewed  
- [ ] Fixes implemented  
- [✅] Tests updated/passing  
- [ ] Docs updated  
- [ ] Migration notes (if any)  
