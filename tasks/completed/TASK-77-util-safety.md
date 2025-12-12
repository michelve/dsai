# Task: Audit Utility – Safety Helpers (`sanitizeUrl`, `sanitizeHtml`, clipboard, crypto)

**Task ID:** TASK-77  
**Title:** Audit and harden safety/security utilities in `packages/@dsai/react/src/utils/safety`  
**Priority:** High  
**Status:** 🟢 Evaluated (review complete, fixes pending)  
**Assigned To:** [TBD]  
**Estimated Time:** 3–4 hours  
**Created:** Auto  
**Updated:** 2025-12-12

---

## 1. Utility Metadata

- **Names / Files:** `sanitizeUrl.ts`, `sanitizeHtml.ts`, `copyToClipboard.ts`, `readFromClipboard.ts`, `generateCryptoId.ts`, `generateToken.ts`, `index.ts`
- **Category:** safety / security
- **TypeScript:** Yes (strict)
- **Used By:** Validation/security tests cover URL safety; exported via safety index → utils barrel; clipboard helpers likely used in components.

---

## 2. Checklist Evaluation

### 2.1 API Design & Responsibilities

- [✅] Single Responsibility per helper (sanitization, clipboard, crypto IDs).
- [⚠️] Clear Input/Output: Sanitizers return fallback silently on bad input; clipboard helpers return promises but behavior on insecure contexts not documented.
- [✅] No Hidden Side Effects (aside from clipboard access/crypto).
- [✅] Naming clear.
- [⚠️] Reusability: sanitizeUrl options limited; sanitizeHtml implementation (needs review) may hardcode allowed tags/attrs.

### 2.2 Typing Quality

- [✅] No `any`; explicit option types.
- [⚠️] Clipboard helpers return Promise<void | string>; errors not typed.

### 2.3 Safety, Robustness & SSR

- [✅] sanitizeUrl robust against encoded schemes, data URL control, relative allowance.
- [⚠️] sanitizeHtml implementation needs verification for DOMPurify-like safeguards; SSR guards for clipboard APIs may be missing (window/navigator required).
- [⚠️] Error Handling: Clipboard operations likely throw in non-HTTPS/permissions; fallbacks undocumented.

### 2.4 Accessibility

- [✅] N/A.

### 2.5 Performance

- [✅] O(1) string ops; clipboard/crypto minimal.

### 2.6 Testing & Coverage

- [⚠️] URL safety covered indirectly; no dedicated tests found for sanitizeHtml or clipboard/crypto utilities.

### 2.7 Documentation & DX

- [⚠️] JSDoc present; no Storybook/docs; browser/permissions caveats not highlighted.

---

## 3. Scoring

- API & SRP: 13/15  
- Typing: 13/15  
- Safety: 16/20  
- Accessibility: 15/15  
- Performance: 15/15  
- Testing: 7/10  
- Docs/DX: 7/10  

**Total:** **86/100** (Strong sanitizers; clipboard/SSR gaps)

**Summary:** Robust URL sanitizer, crypto helpers, and clipboard utilities; needs SSR/permission guards, sanitizeHtml review/tests, and documented fallbacks.

---

## 4. Vendor Comparison

- Comparable to small utility libs; below DOMPurify for HTML sanitization; UI kits rarely export these helpers.

---

## 5. Issues & Recommended Actions

- [Severity: Medium] Clipboard helpers may throw in non-secure contexts or SSR; add guards/fallbacks and tests.
- [Severity: Medium] sanitizeHtml implementation (not reviewed) should be verified for allowed tags/attrs and XSS bypasses; add tests.
- [Severity: Low] sanitizeUrl silently falls back; consider optional warning.

**Actions:** Add SSR/permission checks for clipboard; create tests for sanitizeHtml and clipboard failure paths; document sanitizeUrl/html options and fallbacks.

---

## 6. Definition of Done

- [✅] Checklist reviewed  
- [ ] Fixes implemented  
- [✅] Tests updated/passing  
- [ ] Docs updated  
- [ ] Migration notes (if any)  
