# TASK-030: Switch Component

**Task ID:** TASK-030
**Title:** Switch Component
**Priority:** High
**Status:** Not Started
**Assigned To:** Developer
**Estimated Time:** 8 hours
**Phase:** Phase 2B - Medium Components (Weeks 9-10)

---

## Description

Create accessible Switch (toggle) component for binary on/off states. Support sizes, labels, loading state, and smooth animations.

---

## Acceptance Criteria

### Component Implementation
- [ ] Component: `packages/components/src/Switch/Switch.tsx`
- [ ] Controlled/uncontrolled modes
- [ ] Sizes: sm, md, lg
- [ ] Label support (inline or separate)
- [ ] Loading state with spinner
- [ ] Disabled state
- [ ] Optional icons (on/off indicators)

### Styling
- [ ] Smooth slide animation
- [ ] Track and thumb styling
- [ ] Focus ring
- [ ] Transition with design token timing

### Accessibility
- [ ] `role="switch"`
- [ ] `aria-checked` attribute
- [ ] `aria-labelledby` or `aria-label`
- [ ] Keyboard accessible (Space to toggle)
- [ ] Minimum 44×44px touch target

### Testing
- [ ] Unit tests 90%+
- [ ] Animation tests
- [ ] jest-axe tests

---

## Dependencies

### Requires:
- **TASK-014**: Base Component Template

---

**Estimated Effort:** 8 hours
