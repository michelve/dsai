# Task: Audit Types Module – `<typeFileName>`

Note: Duplicate this file per types module.  
Filename pattern: `TASK-XXXX-types-<typeFileName>.md`  
Save to: `02-high/`

**Task ID:** TASK-XXX  
**Title:** Audit and harden types module `<typeFileName>` in `packages/@dsai/react/src/types/<typeFileName>.ts`  
**Priority:** High  
**Status:** ⚪ Not Started

---

## 0. Agent Operating Rules (must follow)

- Do **not** invent usage or findings. Prove claims by scanning the repo.
- Prefer **backwards-compatible** improvements. If breaking changes are truly needed, provide a migration plan.
- Accessibility-first, strict TypeScript, enterprise stability, and safe public API design.
- Optimize for: **correctness**, **DX**, **type inference quality**, **minimal d.ts bloat**, **no circular deps**.

---

## 1. Types Module Metadata

- **Name:** `<typeFileName>`
- **File:** `packages/@dsai/react/src/types/<typeFileName>.ts`
- **Category:** `types`
- **TypeScript:** Yes (strict)
- **Runtime code present:** ☐ No (types only) / ☐ Yes (constants/helpers)
- **Exported via barrel:** `packages/@dsai/react/src/types/index.ts` → ☐ Yes / ☐ No
- **Used By (key components/hooks):**
  - Populate via search: `rg "<exportName>" packages/@dsai/react/src`
- **Risk Level:** ☐ Low / ☐ Medium / ☐ High
  - Rationale: public surface area, polymorphic typings, FSM typing complexity, etc.

---

## 2. Checklist Evaluation

> Mark each item as ✅ Pass, ⚠️ Needs Improvement, or ❌ Fail. Add short notes.

### 2.1 Public API Surface & Responsibilities

- [ ] **Clear purpose:** The file has a tight scope (no “grab bag” exports).
- [ ] **Stable exports:** Public types are intentionally named and versionable.
- [ ] **No accidental exports:** Internal helpers are not exported unless needed.
- [ ] **No unnecessary re-exports:** Avoid duplicate aliases that confuse users.
- [ ] **Naming quality:** Consistent with DSAi conventions; no vague names like `Thing`, `Options2`.
- [ ] **Extensibility:** Types are open where needed (`...` patterns, generics, override points) without becoming unsafe.

**Notes (API Surface):**

- …

### 2.2 Type Safety & Type Quality (TS 5.9+)

- [ ] **No `any` in public types** (or justified, isolated, and documented).
- [ ] **Avoid banned types:** no `Function`, minimal `object`, avoid `Record<string, unknown>` as default.
- [ ] **Good inference:** consumers don’t need to manually provide generics in common cases.
- [ ] **Sound constraints:** generics have meaningful bounds; no overly broad `T extends any`.
- [ ] **Discriminated unions where appropriate** (events/states/variants).
- [ ] **Optionality is intentional:** no “everything optional” option bags.
- [ ] **No type-level performance traps:** avoid deeply recursive conditional types unless necessary.

**Notes (Type Quality):**

- …

### 2.3 React & JSX Compatibility (only if relevant)

- [ ] **Correct ref typing** for `forwardRef` patterns.
- [ ] **Correct prop merging** (no silent overrides, no `as` prop conflicts).
- [ ] **ElementType support** is safe and predictable.
- [ ] **Polymorphic pattern matches ecosystem expectations** (MUI/Radix-class DX).
- [ ] **JSX.LibraryManagedAttributes** considered where needed.

**Notes (React Types):**

- …

### 2.4 Safety, Runtime, and Build Outputs

- [ ] **Types-only where possible:** uses `export type` and `import type`.
- [ ] **No runtime side effects** (top-level DOM, timers, global state).
- [ ] **Tree-shake friendly:** if runtime exports exist, they are pure and minimal.
- [ ] **No circular deps** introduced by `index.ts` barrel exports.
- [ ] **d.ts size is reasonable** (no massive inferred types exposed publicly).

**Notes (Build Safety):**

- …

### 2.5 Accessibility Semantics (only if relevant)

- [ ] **ARIA-related types align with real usage** (not over-restrictive).
- [ ] **Supports AA needs** (labels, descriptions, control relationships).
- [ ] **Does not block valid patterns** (e.g., allows `aria-*`, `data-*` as appropriate).

**Notes (A11y Types):**

- …

### 2.6 Testing & Validation (type-level)

- [ ] **Type tests exist** (preferred: `tsd`, or `vitest` `expectTypeOf`, or compile-only fixtures).
- [ ] **Has negative tests** using `@ts-expect-error` for unsafe usage.
- [ ] **Covers key inference scenarios** (default generics, unions, polymorphic cases, FSM transitions).
- [ ] **Prevents regressions** (public types pinned via tests).

**Notes (Type Tests):**

- …

### 2.7 Documentation & DX

- [ ] **TSDoc on public exports** (especially complex generics).
- [ ] **Examples exist** (docs or Storybook) for tricky types.
- [ ] **Common pitfalls documented** (e.g., polymorphic ref typing rules).

**Notes (Docs & DX):**

- …

---

## 3. Scoring (0–100)

- **API Surface & SRP:** \_\_/15
- **Type Safety & TS Quality:** \_\_/20
- **React Compatibility (if relevant):** \_\_/15
- **Safety & Build Robustness:** \_\_/15
- **Accessibility Semantics (if relevant):** \_\_/15
- **Testing & Coverage:** \_\_/10
- **Documentation & DX:** \_\_/10

**Total Score:** **\_\_/100**  
**Grade:** \_\_

**Short Score Summary (1–3 sentences):**

- …

---

## 4. Vendor Comparison (MUI, Radix, Carbon, Ant, Shadcn, etc.)

> Compare conceptually to equivalent typing patterns.

- **Closest equivalents:**
  - **MUI:** OverridableComponent / component prop override patterns
  - **Radix UI:** Polymorphic + “asChild” patterns and strong inference
  - **Carbon / Ant:** more component-driven; types usually mirror component APIs
  - **React Aria:** strong a11y-oriented types + hooks-first constraints
- **Parity:** \_\_
- **Strengths (DSAi vs others):** \_\_
- **Gaps / Weaknesses vs others:** \_\_
- **Action items to surpass:** \_\_

---

## 5. Issues, Risks & Recommended Actions

### 5.1 Issues & Risks (with severity)

- [Severity: __] …
- [Severity: __] …

### 5.2 Recommended Actions

Pick one:

- [ ] Keep as is (no changes needed).
- [ ] Refactor (backwards compatible):
  - …
- [ ] Breaking change recommended (with migration plan):
  - …
- [ ] Deprecate and replace:
  - …

**Implementation Notes / Plan:**

- Step 1: …
- Step 2: …
- Step 3: …

---

## 6. Definition of Done (DoD)

This task is **Done** when:

- [ ] All checklist items are reviewed and marked with notes.
- [ ] Any required refactors are implemented (or explicitly rejected with rationale).
- [ ] Type-level tests exist and pass.
- [ ] No circular deps added; build output remains clean.
- [ ] Public types are documented where complexity is non-trivial.
- [ ] Vendor comparison is filled with an honest assessment.

---

# Module-Specific Addendum (choose one per file)

## A) `accessibility.ts` addendum

- Ensure types support AA patterns: label/description relationships, `aria-live`, `aria-controls`, `aria-expanded`, etc.
- Avoid “fake safety”: don’t over-restrict ARIA values beyond real platform behavior.
- Add type tests for: common component props intersections (Button, Input, Dialog triggers).

## B) `fsm.ts` addendum

- Require discriminated unions for **State** and **Event**.
- Transitions should enforce exhaustiveness (no missing state/event pairs unless explicitly allowed).
- Prefer compile-time guarantees: impossible transitions should be type errors.
- Add type tests for: transition map completeness, reducer inference, selectors/getters typing.

## C) `polymorphic.ts` addendum

- Verify the polymorphic pattern supports:
  - correct `ref` type based on `as`
  - prop conflict resolution (`as`, `className`, event handlers)
  - default element type inference
- Add tests for: `as="button"`, `as="a" href`, `as={Link}`, and invalid prop combos.

## D) `primitives.ts` addendum

- Validate base building blocks are minimal and reusable (e.g., `PropsOf`, `WithAsProp`, `SlotProps` patterns).
- Avoid leaking extremely complex inferred types into public exports.
- Add tests for: composition with `polymorphic.ts` and component prop utilities.

## E) `responsive.ts` addendum

- Ensure responsive typing supports tokens + breakpoint keys without `any`.
- Prefer safe unions for breakpoints, and predictable value resolution types.
- Add tests for: single value, object map by breakpoint, invalid keys.

## F) `index.ts` addendum

- Confirm barrel exports do not create cycles.
- Ensure exports are intentional and stable (no “export \*” surprises unless justified).
- Add a “public surface snapshot” check (manual list + type test importing all exports).

---
