# Task Template

**Task ID:** TASK-070
**Title:** Establish shared type system for `@dsai/react`
**Priority:** High
**Status:** 🟡 Ready
**Assigned To:** Unassigned
**Estimated Time:** 5-7 days
**Created:** 2024-04-27
**Updated:** 2024-04-27

---

## 📋 Task Description

### Goal

Design and implement a centralized `packages/@dsai/react/src/types` module that unifies cross-cutting type contracts (variants, sizes, accessibility, async/guard, polymorphic `as` support, navigation, theming) and re-exports them through the package index to create an enterprise-grade, discoverable API surface.

### Problem/Issue

- `@dsai/react` currently re-exports dozens of component-scoped types directly from `src/index.ts`, with no shared `types` directory, leading to duplication of common contracts such as variants/sizes and accessibility helpers (e.g., `SafeHTMLAttributes` in Button).【46b06a†L1-L2】【F:packages/@dsai/react/src/index.ts†L37-L200】【F:packages/@dsai/react/src/components/Button/Button.types.ts†L7-L199】
- Without centralized primitives, the design vocabulary can drift across components, and consumers have to discover types by scanning multiple component files instead of a curated type surface.
- Competitors like MUI, Ant Design, Carbon, and Redux Toolkit centralize polymorphic props, theme token keys, and utility types (e.g., `OverridableComponent` in MUI, `ComponentPropsWithRef` wrappers in Ant, Carbon’s `CarbonIconProps`, Redux Toolkit’s shared `ThunkAction`/`EntityState`), giving consistent ergonomics and discoverability—areas where `@dsai/react` can improve.

### Expected Outcome

A documented, centralized type layer that reduces duplication, aligns component APIs to common primitives, and provides a single import path for shared contracts (e.g., `import { Variant, Size, SafeHTMLAttributes } from '@dsai/react/types'`).

---

## 🎯 Acceptance Criteria

- [ ] A `packages/@dsai/react/src/types` directory exists with modules for primitives (variants/sizes/tone), accessibility, polymorphic/as-prop support, async/guard, navigation/link safety, layout/responsive helpers, form/control status, and theme token references.
- [ ] `src/index.ts` re-exports the curated public types from the new directory while preserving existing export names for compatibility.
- [ ] Component-local duplicates (e.g., Button/Tabs variants, `SafeHTMLAttributes`) are refactored to import from the shared modules without changing runtime behavior or public signatures.
- [ ] Documentation in `guidelines/` (or package README) explains the new type surface and migration guidance for contributors.
- [ ] Unit tests or type-level tests cover polymorphic/as-prop helpers and representative components consuming the shared types.

---

## 📂 Files to Modify

- `packages/@dsai/react/src/index.ts` – Re-export shared type modules and adjust existing exports to point at centralized definitions.
- `packages/@dsai/react/src/types/**` – New modules for primitives, accessibility, polymorphism, async/guard, navigation, layout/responsive helpers, form control status, and theme token references.
- `packages/@dsai/react/src/components/*/*.types.ts` – Refactor duplicated unions/interfaces (variants, sizes, `SafeHTMLAttributes`, guard/loader shapes) to import from the new shared modules.
- `packages/@dsai/react/guidelines/*.md` – Add contributor guidance on using the shared type system.
- `packages/@dsai/react/__tests__` (and/or component tests) – Add/adjust tests covering polymorphic props and shared type imports.

---

## 🔗 Dependencies

### Prerequisites

- [ ] Confirm design token keys and naming conventions with the `@dsai/tokens` package to ensure variant/tone/type unions match the token catalog.
- [ ] Align with documentation owners for `guidelines/` updates.

### Blocks

- TASK-056 (Final design review) – Ensure type vocabularies reflect any pending design-token renames.

---

## 🧪 Testing Requirements

- [ ] Unit tests updated/created for components adopting shared types.
- [ ] Type-level tests (e.g., `tsd` or `vitest` type tests) validate polymorphic/as-prop helpers and shared unions.
- [ ] Integration tests pass via `nx test` for `@dsai/react`.
- [ ] Manual spot-check of components using refactored types (Button, Tabs, Table) in Storybook or a sandbox.

---

## 📖 Documentation Requirements

- [ ] Update package-level docs (`guidelines/Guidelines.md` or README) with the new `types` import surface and migration examples.
- [ ] Inline code comments added where shared types replace component-local definitions.
- [ ] Changelog entry noting the addition of the centralized type layer and any migration notes.

---

## 🔄 Implementation Steps

1. [ ] Create `src/types` with modules for primitives (variants/sizes), accessibility (`SafeHTMLAttributes`, ARIA helpers), polymorphic/as-prop helpers, async/guard, navigation/link safety, layout/responsive helpers, form-control status, and theme token references.
2. [ ] Re-export new modules from `src/index.ts`, maintaining backward-compatible export names.
3. [ ] Refactor high-duplication components (Button, Tabs/TabsPro, Table, Form controls) to import shared primitives and accessibility helpers.
4. [ ] Propagate shared async/guard/navigation types to compositions/patterns that currently define local equivalents.
5. [ ] Add/update tests to assert typing for polymorphic/as-prop usage and shared unions; run `nx test @dsai/react`.
6. [ ] Document the shared type surface and migration guidance in `guidelines/`.

---

## 📝 Notes

- Favor type-only imports/exports to avoid affecting bundle size.
- Keep polymorphic helpers aligned with common patterns (MUI’s `OverridableComponent`, Radix’s `asChild`) to ease contributor familiarity.
- Consider generating token unions from `@dsai/tokens` during build to prevent drift.

---

## ✅ Definition of Done

- [ ] All acceptance criteria met.
- [ ] Code reviewed and approved.
- [ ] Tests passing in CI for `@dsai/react`.
- [ ] Documentation updated and published.
- [ ] Deployed to staging or preview build (if applicable).
- [ ] QA verification complete.
