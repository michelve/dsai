# TASK-039: Accordion Component

**Task ID:** TASK-039
**Title:** Accordion Component
**Priority:** High
**Status:** Completed
**Assigned To:** Developer
**Estimated Time:** 12 hours
**Actual Time:** ~10 hours
**Phase:** Phase 2C - Complex Components (Weeks 11-13)
**Completed Date:** December 2, 2025

---

## Description

Create accessible Accordion component with expand/collapse animation, single or multiple open panels, controlled/uncontrolled modes, and keyboard navigation.

---

## Acceptance Criteria

### Component Implementation

- [x] Accordion container component
- [x] AccordionItem subcomponent
- [x] AccordionButton (header/trigger)
- [x] AccordionPanel (collapsible content)
- [x] Single mode: one panel open at a time
- [x] Multiple mode: multiple panels can be open
- [x] Controlled/uncontrolled modes
- [x] Default expanded items prop

### Styling

- [x] Smooth expand/collapse animation
- [x] Icon rotation animation (chevron) - via Bootstrap CSS
- [x] Border between items
- [x] Hover states

### Accessibility

- [x] AccordionButton: `<button>` element
- [x] `aria-expanded` on button
- [x] `aria-controls` pointing to panel
- [x] Panel has `role="region"`
- [x] `aria-labelledby` on panel
- [x] Keyboard navigation (Tab, Enter, Space)

### Testing

- [x] Unit tests 90%+
- [x] Animation tests (CSS-based, tested via class assertions)
- [x] Single/multiple mode tests
- [x] jest-axe tests

### Additional Deliverables (per chat-prompt.md standards)

- [x] FSM state management (Accordion.fsm.ts)
- [x] FSM tests (Accordion.fsm.test.ts)
- [x] Accessibility tests (Accordion.a11y.test.tsx)
- [x] Security tests (Accordion.security.test.tsx)
- [x] Storybook stories (Accordion.stories.tsx)
- [x] README.md documentation
- [x] Figma Code Connect (Accordion.figma.tsx)
- [x] TypeScript types (Accordion.types.ts)
- [x] Component export in index.ts

---

## Files Created/Modified

### New Files

- `packages/@dsai/react/src/components/Accordion/Accordion.tsx`
- `packages/@dsai/react/src/components/Accordion/Accordion.types.ts`
- `packages/@dsai/react/src/components/Accordion/Accordion.fsm.ts`
- `packages/@dsai/react/src/components/Accordion/Accordion.fsm.test.ts`
- `packages/@dsai/react/src/components/Accordion/Accordion.test.tsx`
- `packages/@dsai/react/src/components/Accordion/Accordion.a11y.test.tsx`
- `packages/@dsai/react/src/components/Accordion/Accordion.security.test.tsx`
- `packages/@dsai/react/src/components/Accordion/Accordion.figma.tsx`
- `packages/@dsai/react/src/components/Accordion/README.md`
- `packages/@dsai/react/src/components/Accordion/index.ts`
- `packages/@dsai/storybook/docs/components/Accordion.stories.tsx`

### Modified Files

- `packages/@dsai/react/src/components/index.ts` (added Accordion export)

---

## Dependencies

### Requires

- **TASK-014**: Base Component Template ✅

---

## Quality Gates Passed

- [x] ESLint --max-warnings=0
- [x] Codacy CLI analysis
- [x] TypeScript compilation (no Accordion-specific errors)
- [x] Bootstrap 5 native markup
- [x] WCAG 2.2 AA compliance (jest-axe)
- [x] Security prop whitelisting
- [x] No unrestricted prop spreading

---

**Estimated Effort:** 12 hours
**Actual Effort:** ~10 hours
