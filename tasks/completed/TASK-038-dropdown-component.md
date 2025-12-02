# TASK-038: Dropdown Component

**Task ID:** TASK-038
**Title:** Dropdown Component
**Priority:** High
**Status:** Not Started
**Assigned To:** Developer
**Estimated Time:** 12 hours
**Phase:** Phase 2C - Complex Components (Weeks 11-13)

---

## Description

Create accessible Dropdown menu component with trigger button, positioning (Floating UI), keyboard navigation, and various menu item types (links, buttons, dividers).

---

## Acceptance Criteria

### Component Implementation

- [ ] Dropdown container component
- [ ] DropdownTrigger (button)
- [ ] DropdownMenu (portal-rendered)
- [ ] DropdownItem (clickable item)
- [ ] DropdownDivider (separator)
- [ ] DropdownHeader (section label)
- [ ] Controlled/uncontrolled open state
- [ ] Auto-close on item click (optional)
- [ ] Click outside to close

### Positioning

- [ ] Floating UI for positioning
- [ ] Placement: top, bottom, left, right
- [ ] Auto-flip on viewport edge
- [ ] Arrow pointer (optional)

### Styling

- [ ] Menu shadow and border
- [ ] Item hover states
- [ ] Active item highlighting
- [ ] Icon support in items

### Accessibility

- [ ] `role="menu"` on menu
- [ ] `role="menuitem"` on items
- [ ] `aria-haspopup="true"` on trigger
- [ ] `aria-expanded` state
- [ ] Keyboard navigation (Arrow keys, Enter, ESC)

### Testing

- [ ] Unit tests 90%+
- [ ] Positioning tests
- [ ] Keyboard navigation tests
- [ ] jest-axe tests

---

## Dependencies

### Requires:

- **TASK-014**: Base Component Template
- **TASK-021**: Button Component

---

**Estimated Effort:** 12 hours
