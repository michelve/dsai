# TASK-042: Tooltip Component

**Task ID:** TASK-042
**Title:** Tooltip Component
**Priority:** High
**Status:** Not Started
**Assigned To:** Developer
**Estimated Time:** 12 hours
**Phase:** Phase 2C - Complex Components (Weeks 11-13)

---

## Description

Create accessible Tooltip component for providing contextual information on hover/focus. Use Floating UI for positioning, support various placements and arrow pointer.

---

## Acceptance Criteria

### Component Implementation
- [ ] Tooltip component wrapping trigger
- [ ] Trigger: hover, focus, click
- [ ] Portal rendering (ReactDOM.createPortal)
- [ ] Show/hide delay (configurable)
- [ ] Arrow pointer (optional)
- [ ] Max width for long text

### Positioning
- [ ] Floating UI for positioning
- [ ] Placement: top, right, bottom, left
- [ ] Auto-flip on viewport edge
- [ ] Offset from trigger

### Styling
- [ ] Tooltip background and text color
- [ ] Arrow styling matching tooltip
- [ ] Fade in/out animation
- [ ] Z-index above other content

### Accessibility
- [ ] `role="tooltip"` on tooltip element
- [ ] Trigger has `aria-describedby` pointing to tooltip
- [ ] Tooltip visible on focus (keyboard accessible)
- [ ] ESC key to dismiss (for click trigger)

### Testing
- [ ] Unit tests 90%+
- [ ] Positioning tests
- [ ] Trigger interaction tests
- [ ] jest-axe tests

---

## Dependencies

### Requires:
- **TASK-014**: Base Component Template

---

**Estimated Effort:** 12 hours
