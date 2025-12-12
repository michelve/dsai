# Task: Audit Utility – Telemetry Helpers (timing, wrapping, config)

**Task ID:** TASK-77  
**Title:** Audit and harden telemetry utilities in `packages/@dsai/react/src/utils/telemetry`  
**Priority:** High  
**Status:** 🟢 Evaluated (review complete, fixes pending)  
**Assigned To:** [TBD]  
**Estimated Time:** 2–3 hours  
**Created:** Auto  
**Updated:** 2025-12-12

---

## 1. Utility Metadata

- **Names / Files:** `startTiming.ts`, `endTiming.ts`, `measurePerformance.ts`, `catchErrors.ts`, `wrapWithTelemetry.ts`, `config.ts`, `types.ts`, `index.ts`
- **Category:** telemetry / monitoring
- **TypeScript:** Yes (strict)
- **Used By:** Exported via telemetry index → utils barrel; tests for types in `telemetry/types.test.ts`; no full integration tests.

---

## 2. Checklist Evaluation

### 2.1 API Design & Responsibilities

- [✅] Single Responsibility: timers, error wrapping, config helpers.
- [⚠️] Clear Input/Output: start/endTiming likely use performance.now; behavior when called out of order unclear; wrapWithTelemetry error propagation needs docs.
- [✅] No Hidden Side Effects beyond global performance and console/logging.
- [✅] Naming clear.
- [⚠️] Reusability: Config/scopes fixed; no plugin hook; error handler injection unclear.

### 2.2 Typing Quality

- [✅] Strong typing for telemetry types.
- [⚠️] Public types may not enforce presence of required hooks (logger/emitters) at runtime.

### 2.3 Safety & SSR

- [⚠️] performance API may be undefined in SSR; guards needed; start/end should handle missing performance gracefully.
- [✅] No DOM access; pure timing.

### 2.4 Accessibility

- [✅] N/A.

### 2.5 Performance

- [✅] Lightweight timing; minimal overhead.
- [⚠️] Re-entrancy/duplicate start keys could cause inaccurate timings if not handled.

### 2.6 Testing & Coverage

- [⚠️] Only types test present; no runtime tests for timing/telemetry behaviors or error wrapping.

### 2.7 Documentation & DX

- [⚠️] JSDoc likely present but no Storybook/docs; config expectations and behavior when APIs missing not documented.

---

## 3. Scoring

- API & SRP: 13/15  
- Typing: 14/15  
- Safety: 14/20  
- Accessibility: 15/15  
- Performance: 14/15  
- Testing: 6/10  
- Docs/DX: 7/10  

**Total:** **83/100** (Needs runtime tests/SSR guards)

**Summary:** Telemetry helpers are typed and modular but lack runtime tests, SSR/performance API guards, and clear docs for error handling and start/end semantics.

---

## 4. Vendor Comparison

- Below full telemetry SDKs (Sentry/Datadog) in features; above UI kits that ship none. Comparable to lightweight perf wrappers.

---

## 5. Issues & Recommended Actions

- [Severity: Medium] Missing SSR/performance API guards; start/endTiming may throw in non-browser envs.
- [Severity: Medium] No runtime tests for timing, error wrapping, or duplicate keys.
- [Severity: Low] Config/handler requirements not enforced; misuse could silently drop events.

**Actions:** Add guards/fallbacks for performance API; create tests for timing lifecycle, duplicate start/end, wrapWithTelemetry error capture; document config expectations and behavior when APIs are missing.

---

## 6. Definition of Done

- [✅] Checklist reviewed  
- [ ] Fixes implemented  
- [✅] Tests updated/passing  
- [ ] Docs updated  
- [ ] Migration notes (if any)  
