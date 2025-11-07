# TASK-043: Popover Component

**Task ID:** TASK-043
**Title:** Popover Component
**Priority:** High
**Status:** Not Started
**Assigned To:** Developer
**Estimated Time:** 12 hours
**Phase:** Phase 2C - Complex Components (Weeks 11-13)

---

## Description

Create accessible Popover component for richer interactive content (vs Tooltip). Support click trigger, close button, header/body structure, and Floating UI positioning.

---

## Acceptance Criteria

### Component Implementation
- [ ] Popover component wrapping trigger
- [ ] PopoverHeader subcomponent
- [ ] PopoverBody subcomponent
- [ ] Trigger: click, hover (optional)
- [ ] Portal rendering
- [ ] Close button (optional)
- [ ] Click outside to close
- [ ] ESC key to close

### Positioning
- [ ] Floating UI for positioning
- [ ] Placement: top, right, bottom, left
- [ ] Auto-flip on viewport edge
- [ ] Arrow pointer (optional)

### Styling
- [ ] Border and shadow
- [ ] Header border-bottom
- [ ] Padding using spacing tokens
- [ ] Max width for readability

### Accessibility
- [ ] `role="dialog"` on popover
- [ ] `aria-labelledby` pointing to header
- [ ] Trigger has `aria-haspopup="dialog"`
- [ ] `aria-expanded` on trigger
- [ ] Focus management (optional focus trap)

### Testing
- [ ] Unit tests 90%+
- [ ] Positioning tests
- [ ] Click outside tests
- [ ] jest-axe tests

---

## Dependencies

### Requires:
- **TASK-014**: Base Component Template
- **TASK-021**: Button Component

---

**Estimated Effort:** 12 hours
