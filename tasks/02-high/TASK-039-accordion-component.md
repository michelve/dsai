# TASK-039: Accordion Component

**Task ID:** TASK-039
**Title:** Accordion Component
**Priority:** High
**Status:** Not Started
**Assigned To:** Developer
**Estimated Time:** 12 hours
**Phase:** Phase 2C - Complex Components (Weeks 11-13)

---

## Description

Create accessible Accordion component with expand/collapse animation, single or multiple open panels, controlled/uncontrolled modes, and keyboard navigation.

---

## Acceptance Criteria

### Component Implementation
- [ ] Accordion container component
- [ ] AccordionItem subcomponent
- [ ] AccordionButton (header/trigger)
- [ ] AccordionPanel (collapsible content)
- [ ] Single mode: one panel open at a time
- [ ] Multiple mode: multiple panels can be open
- [ ] Controlled/uncontrolled modes
- [ ] Default expanded items prop

### Styling
- [ ] Smooth expand/collapse animation
- [ ] Icon rotation animation (chevron)
- [ ] Border between items
- [ ] Hover states

### Accessibility
- [ ] AccordionButton: `<button>` element
- [ ] `aria-expanded` on button
- [ ] `aria-controls` pointing to panel
- [ ] Panel has `role="region"`
- [ ] `aria-labelledby` on panel
- [ ] Keyboard navigation (Tab, Enter, Space)

### Testing
- [ ] Unit tests 90%+
- [ ] Animation tests
- [ ] Single/multiple mode tests
- [ ] jest-axe tests

---

## Dependencies

### Requires:
- **TASK-014**: Base Component Template

---

**Estimated Effort:** 12 hours
