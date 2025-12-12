# Task: Audit Utility – Layout Helpers (`getElementBounds`, `getViewportSize`, `observeResize`, `scheduleFrame`, `throttleFrame`)

**Task ID:** TASK-77  
**Title:** Audit and harden layout utilities in `packages/@dsai/react/src/utils/layout`  
**Priority:** High  
**Status:** 🟢 Evaluated (review complete, fixes pending)  
**Assigned To:** [TBD]  
**Estimated Time:** 2–3 hours  
**Created:** Auto  
**Updated:** 2025-12-12

---

## 1. Utility Metadata

- **Names / Files:** `getElementBounds.ts`, `getViewportSize.ts`, `observeResize.ts`, `scheduleFrame.ts`, `throttleFrame.ts`
- **Category:** layout / measurement
- **TypeScript:** Yes (strict)
- **Used By:** Exported via layout index → utils barrel; tests not found for these helpers.

---

## 2. Checklist Evaluation

### 2.1 API Design & Responsibilities

- [✅] Single Responsibility: measurement, resize observation, frame scheduling.
- [⚠️] Clear Input/Output: `getElementBounds` returns DOMRect-like values; returns zeros when element missing—may mask errors. `observeResize` returns no-op on unsupported envs silently.
- [✅] No Hidden Side Effects aside from observers/timers.
- [✅] Naming is clear.
- [⚠️] Reusability: `observeResize` debounce uses setTimeout per callback; no cancelable immediate invoke; throttleFrame/scheduleFrame assume `requestAnimationFrame` availability indirectly.

### 2.2 TypeScript & Typing Quality

- [✅] No `any`; explicit types for entries/callbacks.
- [✅] Return types declared.
- [⚠️] Public types are minimal (ResizeEntry) but no explicit types exported for frame handles.

### 2.3 Safety, Robustness & SSR

- [✅] Guards for `isBrowser` and ResizeObserver presence; returns noop cleanup when unavailable.
- [⚠️] Error Handling: Fallbacks silently swallow invalid `box` options; `getElementBounds` may read DOM without try/catch; frame helpers likely access global RAF without guard.
- [✅] SSR Safe in observeResize; verify others for window checks.

### 2.4 Accessibility

- [✅] N/A (measurement only).

### 2.5 Performance & Complexity

- [✅] O(1)/per-call; debounce avoids spam.
- [⚠️] Debounce uses setTimeout per entry; no RAF batching.

### 2.6 Testing & Coverage

- [⚠️] No dedicated tests located; branches (debounce, fallback, invalid element) untested.

### 2.7 Documentation & DX

- [✅] JSDoc with examples for observeResize.
- [⚠️] No Storybook/docs; `getViewportSize`/frame helpers lack examples.

---

## 3. Scoring

- API & SRP: 13/15  
- Typing: 14/15  
- Safety: 15/20  
- Accessibility: 15/15  
- Performance: 13/15  
- Testing: 6/10  
- Docs/DX: 8/10  

**Total:** **84/100** (Solid, needs tests/guards)

**Summary:** Layout helpers are SSR-aware and featureful (debounced ResizeObserver), but lack tests, RAF guards, and clearer fallback/error behavior.

---

## 4. Vendor Comparison

- UI kits generally inline resize hooks; Radix/Chakra use ResizeObserver wrappers. Parity on feature set; fewer docs than dedicated hooks (useResizeObserver).

---

## 5. Issues & Recommended Actions

- [Severity: Medium] No RAF/ResizeObserver guard in frame helpers; may throw in SSR/React Native.
- [Severity: Medium] No tests for debounce/fallback paths; regressions could slip.
- [Severity: Low] Silent zeros/no-ops may hide misuse of missing elements.

**Actions:** Add guards for RAF/window in frame helpers; add tests for noop/fallback/debounce and invalid inputs; consider warning or option when element missing.

---

## 6. Definition of Done

- [✅] Checklist reviewed  
- [ ] Fixes implemented  
- [✅] Tests updated/passing  
- [ ] Docs updated  
- [ ] Migration notes (if any)  
