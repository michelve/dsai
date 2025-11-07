# TASK-035: Table Component

**Task ID:** TASK-035
**Title:** Table Component
**Priority:** High
**Status:** Not Started
**Assigned To:** Developer
**Estimated Time:** 8 hours
**Phase:** Phase 2B - Medium Components (Weeks 9-10)

---

## Description

Create accessible Table component with sorting, row selection, responsive behavior, and custom cell rendering. Support sticky headers and footer.

---

## Acceptance Criteria

### Component Implementation
- [ ] Table container component
- [ ] Column definitions with types
- [ ] Sortable columns (optional)
- [ ] Row selection (checkboxes)
- [ ] Striped rows option
- [ ] Hover row highlighting
- [ ] Custom cell rendering
- [ ] Loading state with skeleton

### Styling
- [ ] Responsive: horizontal scroll on mobile
- [ ] Sticky header (optional)
- [ ] Cell padding using tokens
- [ ] Border styling options
- [ ] Zebra striping option

### Accessibility
- [ ] Semantic `<table>`, `<thead>`, `<tbody>`, `<tfoot>`
- [ ] `<th scope="col">` for headers
- [ ] `aria-sort` for sortable columns
- [ ] `role="checkbox"` for selection
- [ ] Caption for table description

### Testing
- [ ] Unit tests 90%+
- [ ] Sorting tests
- [ ] Selection tests
- [ ] jest-axe tests

---

## Dependencies

### Requires:
- **TASK-014**: Base Component Template
- **TASK-026**: Checkbox Component

---

**Estimated Effort:** 8 hours
