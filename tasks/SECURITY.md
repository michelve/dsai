# Security Checklist for DSAi Utilities

> **Purpose**: Gate-keeping checklist for all new utility functions to ensure enterprise-grade security, resilience, and safety.

---

## 1. Input Validation & Sanitization

### Required for: All utilities that accept user input, URLs, HTML, or dynamic data

- [ ] **Validate input types** with TypeScript strict mode (no `any`)
- [ ] **Sanitize strings** for XSS vectors (script tags, event handlers, dangerous protocols)
- [ ] **Use allow-lists** over block-lists for protocols, attributes, and values
- [ ] **Block dangerous protocols**: `javascript:`, `data:`, `vbscript:`, `file:`
- [ ] **Validate numeric bounds** to prevent overflow, underflow, NaN, Infinity
- [ ] **Check for null/undefined** explicitly; provide safe defaults
- [ ] **Prevent prototype pollution** in object merge/pick/omit operations
- [ ] **Escape special characters** in regex, SQL-like patterns, or template strings

### Examples

```typescript
// ✅ Good: allow-list approach
const SAFE_PROTOCOLS = ['http://', 'https://'];
if (!SAFE_PROTOCOLS.some((p) => href.startsWith(p))) return false;

// ❌ Bad: block-list approach (incomplete)
if (href.includes('javascript:')) return false; // misses vbscript:, data:, etc.
```

---

## 2. SSR & Edge Environment Safety

### Required for: All utilities that access browser APIs (DOM, window, navigator, localStorage, etc.)

- [ ] **Guard with `isBrowser()` check** before accessing `window`, `document`, `localStorage`
- [ ] **Provide no-op fallbacks** for SSR environments
- [ ] **Use `globalThis`** instead of `window` where appropriate
- [ ] **Feature-detect APIs** (e.g., `Intl`, `ResizeObserver`, `matchMedia`)
- [ ] **Handle missing Intl** gracefully with fallback formatters
- [ ] **Test in Node.js** to ensure no runtime crashes during SSR

### Examples

```typescript
// ✅ Good: SSR-safe with fallback
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
}

// ❌ Bad: crashes in SSR
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
```

---

## 3. XSS & Content Injection Prevention

**Required for: String manipulation, HTML/URL handling, clipboard, storage helpers**

- [ ] **Never use `dangerouslySetInnerHTML`** unless explicitly required and documented
- [ ] **Sanitize `href` attributes** to block `javascript:`, `data:`, etc.
- [ ] **Filter unsafe event handlers** (e.g., `onload`, `onerror`, `onabort`)
- [ ] **Escape user-provided text** in DOM-sensitive contexts (attributes, innerHTML)
- [ ] **Validate clipboard data** before writing to avoid code injection
- [ ] **Use `textContent`** instead of `innerHTML` where possible

**Examples**:

```typescript
// ✅ Good: safe href sanitization
export function isSafeHref(href: string): boolean {
  const SAFE_PROTOCOLS = ['http://', 'https://', 'mailto:', 'tel:'];
  return SAFE_PROTOCOLS.some((p) => href.trim().toLowerCase().startsWith(p));
}

// ❌ Bad: allows javascript: protocol
export function isSafeHref(href: string): boolean {
  return href.startsWith('http') || href.startsWith('mailto');
}
```

---

## 4. Side-Effect Isolation & Cleanup

**Required for: Timing utilities (debounce, throttle), event listeners, observers, animations**

- [ ] **Return cleanup functions** for all side effects (timers, listeners, observers)
- [ ] **Use AbortController** for cancellable async operations where appropriate
- [ ] **Clear timers** (`clearTimeout`, `clearInterval`) in cleanup
- [ ] **Remove event listeners** in cleanup to prevent memory leaks
- [ ] **Disconnect observers** (ResizeObserver, MutationObserver, IntersectionObserver)
- [ ] **Cancel in-flight promises** when component unmounts or operation is aborted
- [ ] **Provide `cancel()` method** for debounce/throttle utilities

**Examples**:

```typescript
// ✅ Good: returns cleanup function
export function announceToScreenReader(message: string, options?: AnnounceOptions): () => void {
  // ... create live region, set timeout
  return () => {
    clearTimeout(timeoutId);
    if (liveRegion.parentNode) {
      liveRegion.parentNode.removeChild(liveRegion);
    }
  };
}

// ❌ Bad: no cleanup, leaks timers and DOM nodes
export function announceToScreenReader(message: string): void {
  // ... create live region, set timeout
  // no cleanup mechanism
}
```

---

## 5. Performance & DoS Prevention

**Required for: Deep object operations, recursive functions, large data processing**

- [ ] **Set recursion depth limits** to prevent stack overflow
- [ ] **Detect circular references** in object merge/clone operations
- [ ] **Limit input size** for computationally expensive operations (e.g., max array length)
- [ ] **Use memoization** for expensive pure functions (formatters, validators)
- [ ] **Avoid unbounded loops** in string/array processing
- [ ] **Provide early exits** for edge cases (empty arrays, null inputs)
- [ ] **Document time complexity** for non-trivial algorithms

**Examples**:

```typescript
// ✅ Good: circular reference detection
export function deepMerge<T>(target: T, source: Partial<T>, maxDepth = 10): T {
  const seen = new WeakSet();

  function merge(tgt: any, src: any, depth: number): any {
    if (depth > maxDepth) throw new Error('Max depth exceeded');
    if (seen.has(src)) throw new Error('Circular reference detected');
    seen.add(src);
    // ... merge logic
  }

  return merge(target, source, 0);
}

// ❌ Bad: unbounded recursion, no cycle detection
export function deepMerge<T>(target: T, source: Partial<T>): T {
  // ... recursive merge without depth limit or cycle detection
}
```

---

## 6. Error Handling & Fail-Fast

**Required for: All utilities**

- [ ] **Throw descriptive errors** for programmer misuse (invalid arguments, missing required params)
- [ ] **Return Result-style objects** for recoverable errors (e.g., `{ success: true, data }` vs `{ success: false, error }`)
- [ ] **Document error conditions** in JSDoc (`@throws` tag)
- [ ] **Validate preconditions** early and fail fast
- [ ] **Avoid silent failures** that hide bugs
- [ ] **Use TypeScript's strict types** to catch errors at compile time
- [ ] **Never throw on user input** without validation

**Examples**:

```typescript
// ✅ Good: fail-fast with descriptive error
export function clamp(value: number, min: number, max: number): number {
  if (typeof value !== 'number' || isNaN(value)) {
    throw new TypeError('clamp: value must be a valid number');
  }
  if (min > max) {
    throw new RangeError('clamp: min must be less than or equal to max');
  }
  return Math.max(min, Math.min(max, value));
}

// ❌ Bad: silent failure, returns NaN
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value)); // returns NaN if value is NaN
}
```

---

## 7. Type Safety & Strictness

**Required for: All utilities**

- [ ] **Use TypeScript strict mode** (no `any`, no implicit type coercion)
- [ ] **Export all public types** (options interfaces, return types, branded types)
- [ ] **Use `readonly` for input types** that should not be mutated
- [ ] **Provide branded types** for sensitive values (e.g., `SanitizedHtml`, `SafeUrl`)
- [ ] **Use literal types** for enums and known values (e.g., `'http://' | 'https://'`)
- [ ] **Infer types from implementation** where possible (avoid manual type annotations)
- [ ] **Document generic constraints** in JSDoc

**Examples**:

```typescript
// ✅ Good: strict types with readonly inputs
export interface TrapFocusOptions {
  readonly focusableSelectors?: string[];
  readonly onWrap?: () => void;
  readonly onEscape?: () => void;
  readonly initialFocus?: boolean;
}

export function trapFocus(container: HTMLElement, options?: TrapFocusOptions): () => void {
  // ...
}

// ❌ Bad: mutable inputs, no type exports
interface TrapFocusOptions {
  focusableSelectors?: string[];
  onWrap?: () => void;
}

function trapFocus(container: any, options?: any): any {
  // ...
}
```

---

## 8. Accessibility & WCAG Compliance

**Required for: A11y utilities, focus management, screen reader helpers, color utilities**

- [ ] **Follow WCAG 2.2 AA** guidelines for color contrast, focus indicators, screen reader support
- [ ] **Use semantic HTML** and ARIA attributes correctly
- [ ] **Provide `aria-label` or `aria-labelledby`** for non-text content
- [ ] **Announce changes to screen readers** using `aria-live` regions
- [ ] **Support keyboard navigation** (Tab, Enter, Escape, Arrow keys)
- [ ] **Respect `prefers-reduced-motion`** for animations
- [ ] **Test with `jest-axe`** for automated a11y checks
- [ ] **Document a11y features** in JSDoc and README

**Examples**:

```typescript
// ✅ Good: respects reduced motion preference
export function animateElement(el: HTMLElement, duration: number): void {
  if (prefersReducedMotion()) {
    duration = 0; // instant transition
  }
  // ... animation logic
}

// ❌ Bad: ignores user preference
export function animateElement(el: HTMLElement, duration: number): void {
  // ... always animates, even if user prefers reduced motion
}
```

---

## 9. Internationalization & Locale Handling

**Required for: Date/time formatters, number/currency formatters, string utilities**

- [ ] **Support `Intl` APIs** with polyfill-friendly fallbacks
- [ ] **Accept `locale` parameter** with default to `navigator.language` or `'en-US'`
- [ ] **Cache formatters by locale** to avoid re-creating on every call
- [ ] **Handle missing `Intl` gracefully** (e.g., fallback to basic formatting)
- [ ] **Support time zones** for date/time utilities
- [ ] **Document locale behavior** in JSDoc
- [ ] **Test with multiple locales** (en-US, es-ES, ja-JP, ar-SA)

**Examples**:

```typescript
// ✅ Good: locale-aware with fallback
const formattersCache = new Map<string, Intl.NumberFormat>();

export function formatCurrency(
  value: number,
  currency = 'USD',
  locale = navigator?.language || 'en-US'
): string {
  const cacheKey = `${locale}-${currency}`;
  let formatter = formattersCache.get(cacheKey);

  if (!formatter) {
    try {
      formatter = new Intl.NumberFormat(locale, { style: 'currency', currency });
      formattersCache.set(cacheKey, formatter);
    } catch {
      // Fallback for browsers without Intl or invalid locale
      return `${currency} ${value.toFixed(2)}`;
    }
  }

  return formatter.format(value);
}

// ❌ Bad: hardcoded locale, no fallback
export function formatCurrency(value: number, currency: string): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(value);
}
```

---

## 10. Dependency Discipline & Bundle Size

**Required for: All utilities**

- [ ] **Avoid third-party dependencies** unless justified and approved
- [ ] **Use native APIs** where possible (Intl, matchMedia, etc.)
- [ ] **Ensure tree-shakeability** (no side effects in module scope)
- [ ] **Mark side-effect-free modules** in `package.json` (`"sideEffects": false`)
- [ ] **Keep bundle size < 2 KB** per utility (minified + gzipped)
- [ ] **Document bundle impact** in README or ADR
- [ ] **Audit security** for any added dependencies

**Examples**:

```typescript
// ✅ Good: zero dependencies, tree-shakeable
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

// ❌ Bad: uses lodash (heavy dependency)
import { clamp } from 'lodash';
export { clamp };
```

---

## 11. Testing & Coverage

**Required for: All utilities**

- [ ] **Write unit tests** with 100% statement/branch coverage
- [ ] **Add property-based tests** for pure functions (using `fast-check` or similar)
- [ ] **Test SSR behavior** in Node.js environment
- [ ] **Test edge cases** (null, undefined, empty arrays, NaN, Infinity, circular refs)
- [ ] **Add security tests** (XSS, unsafe hrefs, prototype pollution)
- [ ] **Test cleanup functions** (timers, event listeners, observers)
- [ ] **Run `jest-axe`** for a11y utilities
- [ ] **Document test coverage** in README

**Examples**:

```typescript
// ✅ Good: comprehensive tests
describe('clamp', () => {
  it('clamps value between min and max', () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-5, 0, 10)).toBe(0);
    expect(clamp(15, 0, 10)).toBe(10);
  });

  it('throws on invalid inputs', () => {
    expect(() => clamp(NaN, 0, 10)).toThrow(TypeError);
    expect(() => clamp(5, 10, 0)).toThrow(RangeError);
  });

  it('handles edge cases', () => {
    expect(clamp(Infinity, 0, 10)).toBe(10);
    expect(clamp(-Infinity, 0, 10)).toBe(0);
  });
});
```

---

## 12. Documentation & Examples

**Required for: All utilities**

- [ ] **Write comprehensive JSDoc** with description, params, returns, examples, throws
- [ ] **Provide usage examples** in JSDoc
- [ ] **Document security considerations** (e.g., "sanitizes user input to prevent XSS")
- [ ] **Document stability level** (`@stable`, `@experimental`, `@internal`)
- [ ] **Document browser support** (e.g., "requires Intl API or polyfill")
- [ ] **Add README** for complex utilities or utility groups
- [ ] **Create Storybook examples** for utilities that affect component behavior

**Examples**:

````typescript
/**
 * Clamps a numeric value between a minimum and maximum bound.
 *
 * @param value - The value to clamp
 * @param min - The minimum allowed value (inclusive)
 * @param max - The maximum allowed value (inclusive)
 * @returns The clamped value
 * @throws {TypeError} If value is not a valid number
 * @throws {RangeError} If min is greater than max
 *
 * @example
 * ```tsx
 * clamp(5, 0, 10);   // => 5
 * clamp(-5, 0, 10);  // => 0
 * clamp(15, 0, 10);  // => 10
 * ```
 *
 * @stable
 * @since 1.0.0
 */
export function clamp(value: number, min: number, max: number): number {
  // ...
}
````

---

## Release Checklist

Before uncommenting a utility in `src/utils/index.ts`:

- [ ] **Security review completed** (all items above checked)
- [ ] **100% test coverage** achieved
- [ ] **JSDoc complete** with examples and stability level
- [ ] **SSR tested** in Node.js environment
- [ ] **Bundle size verified** (< 2 KB per utility)
- [ ] **Codacy analysis** passes with zero issues
- [ ] **A11y tested** with `jest-axe` (if applicable)
- [ ] **Backward compatibility** ensured (no breaking changes to existing APIs)
- [ ] **ADR created** for complex utilities (if needed)
- [ ] **Code review approved** by design system owners

---

## Threat Model Template

For each utility category, complete this threat model:

**Utility**: `[name]`  
**Category**: `[date/number/string/timing/object/a11y/etc.]`  
**Attack Surface**: `[what user inputs does it accept?]`  
**Trust Boundaries**: `[where does data come from? where does it go?]`  
**Known Vulnerabilities**: `[XSS, DoS, prototype pollution, etc.]`  
**Mitigations**: `[allow-lists, sanitization, validation, etc.]`  
**Test Coverage**: `[percentage, edge cases covered]`  
**Compliance**: `[OWASP ASVS L2, SOC 2, WCAG 2.2 AA, etc.]`

---

## References

- **OWASP Top 10**: https://owasp.org/www-project-top-ten/
- **OWASP ASVS L2**: https://owasp.org/www-project-application-security-verification-standard/
- **WCAG 2.2 AA**: https://www.w3.org/WAI/WCAG22/quickref/
- **Mozilla Web Security**: https://infosec.mozilla.org/guidelines/web_security
- **TypeScript Strict Mode**: https://www.typescriptlang.org/tsconfig#strict
- **TASK-072 Enterprise Criteria**: See test file `utils-enterprise-compliance.test.ts`

---

**Last Updated**: 2025-12-07  
**Maintained By**: DSAi Core Team
