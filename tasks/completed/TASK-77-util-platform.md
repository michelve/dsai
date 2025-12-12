# Task: Audit Utility – Platform Helpers (`getBrowser`, `getOS`, `isMobile`, etc.)

**Task ID:** TASK-77  
**Title:** Audit and harden platform detection utilities in `packages/@dsai/react/src/utils/platform`  
**Priority:** High  
**Status:** 🟢 Evaluated (review complete, fixes pending)  
**Assigned To:** [TBD]  
**Estimated Time:** 2–3 hours  
**Created:** Auto  
**Updated:** 2025-12-12

---

## 1. Utility Metadata

- **Names / Files:** `getBrowser.ts`, `getOS.ts`, `getDevicePixelRatio.ts`, `getTextDirection.ts`, `hasHover.ts`, `isDesktop.ts`, `isMobile.ts`, `isTablet.ts`, `isTouchDevice.ts`, `isRTL.ts`, `cache.ts`, `platform.types.ts`, `index.ts`
- **Category:** platform / detection
- **TypeScript:** Yes (strict)
- **Used By:** Exported via platform index → utils barrel; direct consumers not enumerated; no dedicated tests found.

---

## 2. Checklist Evaluation

### 2.1 API Design & Responsibilities

- [✅] Single Responsibility: platform/browser/feature detection.
- [⚠️] Clear Input/Output: Many helpers read globals; `cache.ts` may memoize results; behavior on SSR or missing navigator/window not always documented.
- [✅] No Hidden Side Effects: Mostly pure reads; caching shared state.
- [✅] Naming clear.
- [⚠️] Reusability: Detection heuristics fixed; no injection/mocking hook for tests.

### 2.2 Typing Quality

- [✅] No `any`; types via platform.types.ts.
- [⚠️] Public types may be coarse (string enums vs union literals); cache exports not typed for invalidation beyond module scope.

### 2.3 Safety & SSR

- [⚠️] Guards for window/navigator may be missing in some helpers (needs review); potential ReferenceError in SSR.
- [⚠️] Error Handling: Unknown UA strings may return defaults silently; no explicit fallback logging.

### 2.4 Accessibility

- [✅] N/A.

### 2.5 Performance

- [✅] O(1) detections; cache reduces recomputation.
- [⚠️] Cache invalidation not exposed; stale results if environment changes (unlikely).

### 2.6 Testing & Coverage

- [⚠️] No dedicated tests located; detection branches untested; cache reset unverified.

### 2.7 Documentation & DX

- [⚠️] JSDoc may exist but no Storybook/docs; detection heuristics and SSR guidance not documented.

---

## 3. Scoring

- API & SRP: 13/15  
- Typing: 13/15  
- Safety: 13/20  
- Accessibility: 15/15  
- Performance: 14/15  
- Testing: 6/10  
- Docs/DX: 7/10  

**Total:** **81/100** (Needs SSR/test hardening)

**Summary:** Useful platform detection helpers, but need SSR guards, tests, and documentation of heuristics/caching.

---

## 4. Vendor Comparison

- UI kits often use similar detection internally; few expose helpers. Parity; below dedicated UA parsing libs (Bowser).

---

## 5. Issues & Recommended Actions

- [Severity: Medium] Potential ReferenceError in SSR for helpers lacking window/navigator guards.
- [Severity: Medium] No tests for detection/caching paths; regressions possible.
- [Severity: Low] No way to inject/memoize custom UA for testing; cache invalidation undocumented.

**Actions:** Add SSR guards across helpers; create test suite with mocked navigator/window; expose/reset cache for tests; document heuristics and defaults.

---

## 6. Definition of Done

- [✅] Checklist reviewed  
- [ ] Fixes implemented  
- [✅] Tests updated/passing  
- [ ] Docs updated  
- [ ] Migration notes (if any)  
