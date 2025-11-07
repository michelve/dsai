# TASK-029: Select Component

**Task ID:** TASK-029
**Title:** Select Component
**Priority:** High
**Status:** Not Started
**Assigned To:** Developer
**Estimated Time:** 8 hours
**Phase:** Phase 2B - Medium Components (Weeks 9-10)

---

## Description

Create accessible Select (dropdown) component with single/multiple selection, search/filter, custom rendering, and keyboard navigation. Support native select fallback for mobile.

---

## Acceptance Criteria

### Component Implementation
- [ ] Component: `packages/components/src/Select/Select.tsx`
- [ ] Single and multiple selection modes
- [ ] Searchable/filterable options
- [ ] Custom option rendering
- [ ] Option groups
- [ ] Disabled options
- [ ] Loading state
- [ ] Clear button
- [ ] Placeholder text

### Styling
- [ ] Dropdown positioning (Popper.js or similar)
- [ ] Scrollable options list
- [ ] Selected option highlighting
- [ ] Keyboard focus styling

### Accessibility
- [ ] `role="combobox"` for button
- [ ] `role="listbox"` for options
- [ ] `aria-expanded`, `aria-haspopup`
- [ ] Keyboard navigation (Arrow keys, Enter, Escape)
- [ ] Screen reader announcements

### Testing
- [ ] Unit tests 90%+
- [ ] Keyboard navigation tests
- [ ] jest-axe tests

---

## Dependencies

### Requires:
- **TASK-014**: Base Component Template
- **TASK-019**: Semantic Token Definitions

---

**Estimated Effort:** 8 hours
