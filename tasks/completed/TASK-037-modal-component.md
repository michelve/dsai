# TASK-037: Modal Component

**Task ID:** TASK-037
**Title:** Modal Component
**Priority:** High
**Status:** Not Started
**Assigned To:** Developer
**Estimated Time:** 12 hours
**Phase:** Phase 2C - Complex Components (Weeks 11-13)

---

## Description

Create accessible Modal (dialog) component with backdrop, animations, focus management, scroll locking, and portal rendering. Support various sizes and fullscreen option.

---

## Acceptance Criteria

### Component Implementation

- [ ] Modal component with portal (ReactDOM.createPortal)
- [ ] ModalHeader, ModalBody, ModalFooter subcomponents
- [ ] Sizes: sm, md, lg, xl, fullscreen
- [ ] Controlled: `isOpen` + `onClose` props
- [ ] Close button in header
- [ ] Backdrop click to close (optional)
- [ ] ESC key to close
- [ ] Animations: fade in/out, slide in/out

### Focus Management

- [ ] Focus trap using `focus-trap-react` or similar
- [ ] Focus first focusable element on open
- [ ] Restore focus to trigger on close
- [ ] Tab cycles within modal

### Styling

- [ ] Backdrop with opacity
- [ ] Centered modal positioning
- [ ] Scrollable body if content overflows
- [ ] Responsive sizing
- [ ] Z-index management

### Accessibility

- [ ] `role="dialog"`
- [ ] `aria-modal="true"`
- [ ] `aria-labelledby` pointing to header
- [ ] `aria-describedby` pointing to body
- [ ] Body scroll lock when open
- [ ] ESC key handler

### Testing

- [ ] Unit tests 90%+
- [ ] Focus management tests
- [ ] Keyboard interaction tests
- [ ] jest-axe tests

---

## Dependencies

### Requires:

- **TASK-014**: Base Component Template
- **TASK-021**: Button Component (close button)

---

**Estimated Effort:** 12 hours
