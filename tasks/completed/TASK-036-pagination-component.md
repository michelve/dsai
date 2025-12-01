# TASK-036: Pagination Component

**Task ID:** TASK-036
**Title:** Pagination Component
**Priority:** High
**Status:** Not Started
**Assigned To:** Developer
**Estimated Time:** 8 hours
**Phase:** Phase 2B - Medium Components (Weeks 9-10)

---

## Description

Create accessible Pagination component for navigating through pages of content. Support different sizes, boundary/sibling ranges, and responsive behavior.

---

## Acceptance Criteria

### Component Implementation

- [ ] Pagination component
- [ ] Controlled: `page` + `onChange` props
- [ ] Total pages: `count` prop
- [ ] Items per page selector (optional)
- [ ] Boundary range: first/last pages shown
- [ ] Sibling range: pages around current
- [ ] Previous/Next buttons
- [ ] First/Last page buttons (optional)
- [ ] Disabled state

### Styling

- [ ] Button styling for pages
- [ ] Active page highlighting
- [ ] Sizes: sm, md, lg
- [ ] Ellipsis for skipped pages
- [ ] Responsive: fewer pages on mobile

### Accessibility

- [ ] `<nav aria-label="pagination">`
- [ ] `aria-current="page"` on active
- [ ] `aria-label` for prev/next buttons
- [ ] Disabled buttons have `aria-disabled`
- [ ] Keyboard navigation (Tab, Enter)

### Testing

- [ ] Unit tests 90%+
- [ ] Page change tests
- [ ] Boundary/sibling logic tests
- [ ] jest-axe tests

---

## Dependencies

### Requires:

- **TASK-014**: Base Component Template
- **TASK-021**: Button Component

---

**Estimated Effort:** 8 hours
