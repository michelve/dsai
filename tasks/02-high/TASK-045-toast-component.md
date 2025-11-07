# TASK-045: Toast Component

**Task ID:** TASK-045
**Title:** Toast Component
**Priority:** High
**Status:** Not Started
**Assigned To:** Developer
**Estimated Time:** 12 hours
**Phase:** Phase 2C - Complex Components (Weeks 11-13)

---

## Description

Create accessible Toast notification component with queue management, auto-dismiss, positioning options, and animations. Provide ToastProvider and useToast hook for imperative API.

---

## Acceptance Criteria

### Component Implementation
- [ ] Toast component (individual notification)
- [ ] ToastContainer (manages multiple toasts)
- [ ] ToastProvider context component
- [ ] useToast hook for imperative API
- [ ] Variants: success, error, warning, info
- [ ] Auto-dismiss with configurable duration
- [ ] Manual close button
- [ ] Queue management (max toasts, stacking)

### Positioning
- [ ] Position options: top-right, top-left, bottom-right, bottom-left, top-center, bottom-center
- [ ] Portal rendering
- [ ] Stacking with proper spacing

### Styling
- [ ] Slide/fade animations (enter/exit)
- [ ] Icon per variant
- [ ] Close button styling
- [ ] Progress bar for auto-dismiss (optional)

### Accessibility
- [ ] `role="alert"` for error/warning
- [ ] `role="status"` for success/info
- [ ] `aria-live="assertive"` for errors
- [ ] `aria-live="polite"` for others
- [ ] Close button: `aria-label="Close"`

### Testing
- [ ] Unit tests 90%+
- [ ] Queue management tests
- [ ] Auto-dismiss timer tests
- [ ] jest-axe tests

---

## Dependencies

### Requires:
- **TASK-014**: Base Component Template
- **TASK-021**: Button Component

---

**Estimated Effort:** 12 hours
