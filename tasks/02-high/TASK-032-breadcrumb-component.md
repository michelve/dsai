# TASK-032: Breadcrumb Component

**Task ID:** TASK-032
**Title:** Breadcrumb Component
**Priority:** High
**Status:** Not Started
**Assigned To:** Developer
**Estimated Time:** 8 hours
**Phase:** Phase 2B - Medium Components (Weeks 9-10)

---

## Description

Create accessible Breadcrumb navigation component with custom separators, collapsible items for long paths, and router integration support.

---

## Acceptance Criteria

### Component Implementation
- [ ] Breadcrumb container component
- [ ] BreadcrumbItem component
- [ ] Custom separator (default: `/`)
- [ ] Max items with collapse (show first, last, ellipsis)
- [ ] Current page indicator
- [ ] Icons support

### Styling
- [ ] Link styling with hover
- [ ] Separator styling
- [ ] Current page (non-link) styling
- [ ] Responsive: collapse on mobile

### Accessibility
- [ ] `<nav aria-label="breadcrumb">`
- [ ] `<ol>` list structure
- [ ] `aria-current="page"` on current item
- [ ] Links are semantic `<a>` elements

### Testing
- [ ] Unit tests 90%+
- [ ] Collapse functionality tests
- [ ] jest-axe tests

---

## Dependencies

### Requires:
- **TASK-014**: Base Component Template

---

**Estimated Effort:** 8 hours
