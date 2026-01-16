# Tasks: [COMPONENT_NAME]

**Branch**: `component/[component-name]`
**Input**: [plan.md](plan.md), [spec.md](spec.md)
**Prerequisites**: Spec approved, plan reviewed

---

## Format: `[ID] [P?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

---

## Phase 1: Setup

**Purpose**: Create component file structure

- [ ] T001 Create `packages/@dsai-io/react/src/components/[ComponentName]/` directory
- [ ] T002 [P] Create `[ComponentName].types.ts` with props interface
- [ ] T003 [P] Create `index.ts` barrel export
- [ ] T004 Update `packages/@dsai-io/react/src/components/index.ts` to export component

**Checkpoint**: Component structure exists, can be imported

---

## Phase 2: Core Implementation

**Purpose**: Build the component with all variants

- [ ] T005 Create `[ComponentName].tsx` with base implementation
- [ ] T006 Implement all visual variants (primary, secondary, etc.)
- [ ] T007 Implement all size variants (sm, md, lg)
- [ ] T008 Implement disabled state
- [ ] T009 [P] Create `[ComponentName].module.scss` with styles (if needed)
- [ ] T010 Add design token CSS variables

**Checkpoint**: Component renders all variants correctly

---

## Phase 3: Accessibility

**Purpose**: Meet WCAG 2.2 AA requirements

- [ ] T011 Add keyboard navigation (Tab, Enter, Space, Escape as needed)
- [ ] T012 Add ARIA attributes (aria-label, aria-disabled, role)
- [ ] T013 Add focus management (focus visible, focus trap if modal)
- [ ] T014 Add aria-hidden to decorative elements

**Checkpoint**: Component is fully keyboard accessible

---

## Phase 4: Testing (95%+ Coverage)

**Purpose**: Comprehensive test coverage

### Unit Tests

- [ ] T015 Create `[ComponentName].test.tsx`
- [ ] T016 [P] Test default render
- [ ] T017 [P] Test all variants render correctly
- [ ] T018 [P] Test all sizes render correctly
- [ ] T019 [P] Test disabled state

### Interaction Tests

- [ ] T020 Test click handlers
- [ ] T021 Test keyboard navigation
- [ ] T022 Test focus management

### Accessibility Tests

- [ ] T023 Add jest-axe test for default state
- [ ] T024 [P] Add jest-axe test for disabled state
- [ ] T025 [P] Add jest-axe test for all variants

**Checkpoint**: `nx test @dsai-io/react --testFile=[ComponentName]` passes with 95%+ coverage

---

## Phase 5: Documentation

**Purpose**: Storybook stories and Figma integration

### Storybook

- [ ] T026 Create story file in `packages/@dsai-io/storybook/docs/components/[ComponentName]/`
- [ ] T027 [P] Add Default story
- [ ] T028 [P] Add Variants story
- [ ] T029 [P] Add Sizes story
- [ ] T030 [P] Add Disabled story
- [ ] T031 Add AllVariants story (complete matrix)
- [ ] T032 Add props documentation in story

### Figma Code Connect

- [ ] T033 Create `[ComponentName].figma.tsx`
- [ ] T034 Map Figma properties to React props
- [ ] T035 Run `figma connect publish` to sync

**Checkpoint**: Storybook stories render, Figma connected

---

## Phase 6: Final Validation

**Purpose**: Quality gates before completion

- [ ] T036 Run `nx lint @dsai-io/react` - must pass
- [ ] T037 Run `nx test @dsai-io/react --testFile=[ComponentName]` - must pass
- [ ] T038 Verify bundle size under 3 KB
- [ ] T039 Manual test in Storybook
- [ ] T040 Update component task status to completed

---

## Dependencies & Execution Order

```text
Phase 1 (Setup)
    ↓
Phase 2 (Core)
    ↓
Phase 3 (A11y) ←→ Phase 4 (Tests) [can run in parallel]
    ↓
Phase 5 (Docs)
    ↓
Phase 6 (Validation)
```

### Parallel Opportunities

```bash
# Phase 1: T002 and T003 can run in parallel
# Phase 4: All variant/size tests can run in parallel
# Phase 5: All story creation can run in parallel
```

---

## Notes

- Always run jest-axe tests - zero violations required
- Use Bootstrap 5 markup patterns
- No unrestricted prop spreading
- All event handlers must be explicitly defined
