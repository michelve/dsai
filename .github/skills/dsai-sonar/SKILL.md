---
name: dsai-sonar
description: "Use when writing, editing, reviewing, or fixing TypeScript or React code in the DSAi monorepo. Provides SonarQube-compliant coding guidelines to prevent quality gate failures. Also use when the user mentions SonarQube, code quality, or lint issues."
---

# DSAi SonarQube Coding Guidelines

This project uses SonarQube (project key: `dsai`, server: `192.168.5.242:9000`) to gate code quality. All code must pass quality gates before merge.

Code examples for each category are in `references/` — read them when fixing or writing code in that category.

Issue tracker and batch files: `sonar-issues/TRACKER.md` and `sonar-issues/batches/`.

---

## Category Index

| Category | Reference File | Key Focus |
|----------|---------------|-----------|
| Complexity | `references/complexity.md` | Function complexity, nesting depth, too many params |
| Types & Expressions | `references/types-expressions.md` | Union types, assertions, ternaries, magic numbers |
| Code Style | `references/code-style.md` | globalThis, negated conditions, null vs undefined, forEach |
| React | `references/react.md` | Hooks, state, props, context, lifecycle |
| Accessibility | `references/accessibility.md` | Semantic HTML, ARIA, keyboard navigation |
| Security | `references/security.md` | Dynamic access, prototype pollution, crypto, injection |
| Testing | `references/testing.md` | Assertions, exclusive tests, stability |
| Regex | `references/regex.md` | ReDoS, character classes, quantifiers |

---

## 1. Complexity & Structure (CRITICAL)

These cause the most quality gate failures in this project.

| Rule | Severity | Description |
|------|----------|-------------|
| S1541 | High | Cyclomatic complexity of functions max **10** |
| S3776 | High | Cognitive complexity of functions max **15** |
| S134 | High | Control flow nesting max **3** levels deep |
| S107 | Medium | Functions max **7** parameters — use options object |
| S1192 | High | String literals duplicated 3+ times — extract constant |
| S109 | Medium | No magic numbers — extract named constants |
| S138 | High | Functions should not be nested too deeply |
| S3358 | Medium | No nested ternary operators |
| S4624 | Medium | No nested template literals |
| S1121 | Medium | No assignments inside sub-expressions |
| S881 | Medium | No increment/decrement inside expressions |
| S3972 | High | Conditionals should start on new lines |

See `references/complexity.md` for fix patterns.

---

## 2. Types & Expressions

| Rule | Severity | Description |
|------|----------|-------------|
| S4622 | Medium | Union types max **3** inline elements — extract type alias |
| S4325 | Low | No unnecessary type assertions (`as Type`) |
| S4798 | Medium | Optional boolean params should have default values |
| S4157 | Low | Default type parameters should be omitted |
| S4323 | Low | Inline unions should use type aliases |
| S6564 | Medium | No redundant type aliases for `boolean` |
| S6606 | Low | Use `??=` nullish coalescing assignment |
| S6582 | Medium | Use optional chaining `a?.b?.c` |
| S2138 | Low | Use `null` not explicit `undefined` for absence |
| S7741 | Low | Compare with `undefined` directly, not `typeof` |
| S7764 | Low | Use `globalThis` not `window` |
| S1874 | Low | Don't use deprecated APIs (MutableRefObject, etc.) |
| S4328 | Medium | Dependencies should be explicit in package.json |
| S7784 | Low | Use `structuredClone()` not `JSON.parse(JSON.stringify())` |
| S7748 | Low | No zero fractions (`1` not `1.0`) |
| S7749 | Low | Use digit separators: `1_000_000` not `1000000` |

See `references/types-expressions.md` for fix patterns.

---

## 3. Code Style & Conventions

| Rule | Severity | Description |
|------|----------|-------------|
| S7735 | Low | Flip negated conditions with else blocks |
| S7728 | Low | Use `for...of` not `.forEach()` |
| S125 | Medium | Delete commented-out code |
| S7763 | Low | Use `export { X } from './foo'` re-export syntax |
| S6759 | Low | Mark React props as `Readonly<Props>` |
| S7778 | Low | Combine multiple `.push()` into one call |
| S7770 | Low | Use `Boolean` directly, not `(x) => Boolean(x)` |
| S3512 | Low | Use template literals not string concatenation |
| S6594 | Low | Use `RegExp.exec()` not `String.match()` |
| S6571 | Low | Remove string literals redundant in unions containing `string` |
| S6551 | Low | Use explicit `.toString()` for objects in templates |
| S7776 | Medium | Use `Set.has()` not `Array.includes()` for lookups |
| S7785 | Medium | Use top-level `await` not `.then()` chains |
| S7769 | Low | Use `Math.hypot()` not manual calculation |
| S6754 | Low | Destructure `useState` return: `[val, setVal]` |
| S1301 | Low | Use `if` instead of `switch` with single case |
| S4138 | Low | Use `for...of` instead of C-style `for` loops |
| S3626 | Low | Remove redundant `return`/`continue`/`break` |
| S6660 | Medium | Convert if-only else blocks to `else if` |
| S7781 | Low | Use `.replaceAll()` not regex for simple replacements |
| S7780 | Low | Use `String.raw` for escaped backslash strings |
| S1874 | Low | Replace deprecated APIs with modern equivalents |
| S1820 | Low | Use `trimStart()`/`trimEnd()` not `trimLeft()`/`trimRight()` |

See `references/code-style.md` for fix patterns.

---

## 4. React Rules

| Rule | Severity | Description |
|------|----------|-------------|
| S6481 | Medium | Context provider values must be stable (useMemo) |
| S6819 | Medium | Prefer semantic HTML tags over ARIA role divs |
| S6478 | Medium | Don't nest component definitions |
| S6749 | Low | Remove redundant JSX fragments |
| S6774 | Medium | useState should not be called in render body |
| S6756 | Medium | setState callback when referencing previous state |
| S6477 | Medium | JSX list items must have unique `key` props |
| S6479 | Medium | Don't use array indexes as `key` |
| S6486 | Medium | JSX list keys should match between renders |
| S6785 | Medium | Don't render non-boolean condition values |
| S6766 | Medium | React hooks must be called properly |
| S6761 | Medium | Don't pass `children` as explicit prop |
| S6763 | Low | Don't use string refs |
| S6767 | Medium | Don't use `findDOMNode` |
| S6768 | Medium | Don't use `isMounted` |
| S6757 | Medium | Don't use children with dangerouslySetInnerHTML |
| S6765 | Low | Don't use deprecated React lifecycle methods |
| S6759 | Low | Props should be read-only |
| S6762 | Low | Remove unused React component methods |
| S6770 | Low | Remove unused typed props |
| S6754 | Low | Destructure useState return values symmetrically |
| S6769 | Medium | Don't set state with its own value |

See `references/react.md` for fix patterns.

---

## 5. Accessibility (WCAG 2.1 AA — Mandatory)

| Rule | Severity | Description |
|------|----------|-------------|
| S6819 | Medium | Use semantic HTML elements, not `<div role="...">` |
| S6840 | Medium | ARIA properties must have valid values |
| S6841 | Medium | ARIA roles must be valid and non-abstract |
| S6842 | Medium | Elements with ARIA roles must have required properties |
| S6843 | Medium | DOM elements with ARIA roles: only supported properties |
| S6846 | Medium | No redundant ARIA roles |
| S6847 | Medium | No ARIA role/property on unsupported DOM elements |
| S6827 | Medium | Anchors should contain accessible content |
| S6829 | Medium | Headings should have accessible content |
| S6825 | Medium | Images must have alt text |
| S6848 | Low | No non-interactive ARIA roles on interactive elements |
| S6849 | Medium | No interactive ARIA roles on non-interactive elements |
| S6851 | Medium | No interactive handlers on non-interactive elements |
| S6850 | Medium | No tabIndex on non-interactive elements |
| S6855 | Medium | Focusable elements should not have aria-hidden |
| S6859 | Medium | Label elements must have text and associated control |
| S6860 | Low | Mouse events must have keyboard equivalents |
| S6845 | Medium | aria-activedescendant elements must be tabbable |
| S6853 | Medium | Non-interactive elements shouldn't have event handlers |
| S6861 | Low | Media elements should have captions |
| S6844 | Medium | tabIndex should be 0 or -1 only |
| S6824 | Medium | Anchor tags should not be used as buttons |
| S6863 | Low | iFrames must have a title |
| S6826 | Medium | Images should not have redundant alt text |
| S6835 | Low | Spacing between inline elements should be explicit |
| S6833 | Medium | Tables should have headers |
| S6834 | High | Table cells should reference their headers |
| S1827 | Medium | DOM `accesskey` property should not be used |
| S6832 | Medium | HTML lang attribute must be valid |

See `references/accessibility.md` for fix patterns.

---

## 6. Security (NON-NEGOTIABLE)

| Rule | Severity | Description |
|------|----------|-------------|
| **Project rule** | Blocker | Use `Reflect.get()` for dynamic property access — never bracket notation |
| **Project rule** | Blocker | Block `__proto__`, `constructor`, `prototype` keys |
| **Project rule** | Blocker | No nested regex quantifiers (ReDoS) |
| **Project rule** | Blocker | Input validation with allowlists, not blocklists |
| S2068 | Blocker | No hard-coded credentials |
| S2076 | Medium | No dynamically executed code (`eval`) |
| S5131 | Medium | No dynamic template construction (XSS) |
| S4784 | Sensitive | Slow regex is security-sensitive |
| S5542 | High | Cipher algorithms must be robust |
| S5547 | High | Cryptographic keys must be robust |
| S5659 | High | JWT must use strong ciphers |
| S4423 | High | No weak SSL/TLS protocols |
| S5527 | High | Server certificates must be verified |
| S5667 | High | Server hostnames must be verified |
| S5148 | Sensitive | Opened windows should not access originating window |
| S5122 | Sensitive | CORS policy must be restrictive |
| S2245 | Sensitive | PRNG usage is security-sensitive |
| S5332 | Sensitive | No clear-text protocols |
| S5689 | Sensitive | Don't disclose technology fingerprints |
| S5604 | Sensitive | Don't log confidential information |

See `references/security.md` for fix patterns.

---

## 7. Testing

| Rule | Severity | Description |
|------|----------|-------------|
| S2699 | Blocker | Tests must include assertions |
| S2757 | Blocker | Assertions should be complete |
| S6544 | Medium | Exclusive tests (`.only`) must not be committed |
| S1135 | Info | Track `TODO`/`FIXME` tags |
| S6643 | Medium | Don't skip tests without a reason |
| S6647 | High | Tests should not execute code after `done()` |
| S5958 | Medium | Tests should check which exception is thrown |
| S6572 | Medium | Tests should be stable (no flaky patterns) |
| S5863 | Medium | Don't pass same argument twice to assertions |
| S5869 | Medium | Assertion arguments in correct order |

See `references/testing.md` for fix patterns.

---

## 8. Variables & Scoping

| Rule | Severity | Description |
|------|----------|-------------|
| S3353 | High | Use `let` or `const`, not `var` |
| S1481 | Medium | Remove unused function parameters |
| S1854 | Medium | Remove unused assignments |
| S3699 | Medium | Return values from void functions should not be used |
| S2234 | Medium | Parameters should be passed in correct order |
| S1526 | Low | Constructors should not return values |
| S2814 | Medium | No duplicate member names in classes/objects |
| S4030 | Medium | Collection contents should be used |
| S2870 | Medium | Don't use `delete` on arrays |
| S4043 | Medium | Use `arr.includes()` not `arr.indexOf()` checks |

---

## 9. Loops & Control Flow

| Rule | Severity | Description |
|------|----------|-------------|
| S1264 | Low | Use `while` instead of empty `for` loop |
| S1994 | High | `for` loop increment should modify counter |
| S2310 | Medium | Loop counters should not be assigned in body |
| S4030 | Medium | Collection elements should not be replaced unconditionally |
| S1751 | Medium | Loops with at most one iteration should be refactored |
| S1219 | Blocker | `switch` should not contain non-case labels |
| S1821 | High | `switch` should not be nested |
| S1871 | Medium | No identical branch implementations |
| S1862 | Medium | No duplicate conditions in if/else chains |
| S3981 | Medium | Collection size comparisons should make sense |
| S4036 | Sensitive | OS command search paths are security-sensitive |

---

## 10. Classes & Objects

| Rule | Severity | Description |
|------|----------|-------------|
| S2376 | Medium | Getters and setters should come in pairs |
| S4275 | High | Getters/setters should access expected fields |
| S3500 | Medium | Fields assigned only in constructor should be `readonly` |
| S2933 | Low | `public static` fields should be `readonly` |
| S2094 | Low | Classes should not be empty |
| S3854 | High | `super()` must be invoked appropriately |
| S6598 | Low | Prefer function types over call-signature interfaces |

---

## Pre-commit Checklist

Before committing TypeScript/React code:

- [ ] Functions: <10 cyclomatic, <15 cognitive complexity, <3 nesting depth
- [ ] Max 7 function parameters
- [ ] No `window.` — use `globalThis` (unless DOM-specific in components)
- [ ] Semantic HTML elements, not ARIA-role divs
- [ ] `Reflect.get()` for all dynamic property access
- [ ] No magic numbers or duplicated string literals — use named constants
- [ ] `for...of` not `.forEach()`; `RegExp.exec()` not `String.match()`
- [ ] No commented-out code
- [ ] `null` for absence, not explicit `undefined`
- [ ] Union types with 4+ elements extracted to named type alias
- [ ] No unnecessary `as Type` assertions
- [ ] Context provider values wrapped in `useMemo`
- [ ] No hard-coded credentials, secrets, or wallet phrases
- [ ] All tests include assertions; no `.only` tests committed
