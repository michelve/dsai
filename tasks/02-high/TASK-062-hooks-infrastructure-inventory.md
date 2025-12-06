# Hooks Infrastructure Inventory

**Task ID:** TASK-062
**Title:** Hooks Infrastructure Inventory & Planning
**Priority:** High
**Status:** ⚪ Not Started
**Assigned To:** Unassigned
**Estimated Time:** 2 Hours
**Created:** 2024-12-05
**Updated:** 2024-12-05

---

## 📋 Task Description

### Goal

Create a comprehensive inventory of all hooks across the DSAi codebase and establish a plan for consolidating reusable hooks into the centralized `packages/@dsai/react/src/hooks/` directory.

### Problem/Issue

Currently, multiple inline hooks exist across various components:

- `useFocusTrap` is defined inline in Modal.tsx (62 LOC) - **not reusable**
- `useScrollLock` is defined inline in Modal.tsx (26 LOC) - **not reusable**
- Context hooks are duplicated patterns across components
- Sheet, Drawer, and Dialog components (planned) all need focus trap and scroll lock
- No centralized hooks infrastructure for testing or documentation

### Expected Outcome

- Complete inventory of all hooks in the codebase
- Clear extraction priority based on reuse potential
- Defined hooks/ directory structure
- Established patterns for hook exports and documentation
- Test infrastructure for hooks

---

## 🎯 Acceptance Criteria

- [ ] Complete inventory document created with all hooks identified
- [ ] Each hook categorized by extraction priority (HIGH/MEDIUM/LOW/NONE)
- [ ] Dependencies mapped for each extractable hook
- [ ] hooks/ directory structure defined
- [ ] Export strategy documented (public API vs internal)
- [ ] Testing strategy documented
- [ ] Child tasks created for each extraction

---

## 📂 Current Hooks Inventory

### HIGH Priority - Extract Immediately

| Hook            | Location          | LOC | Dependencies                             | Blocks                |
| --------------- | ----------------- | --- | ---------------------------------------- | --------------------- |
| `useFocusTrap`  | Modal.tsx:66-130  | 65  | trapFocus, focusableSelectors, isBrowser | Sheet, Drawer, Dialog |
| `useScrollLock` | Modal.tsx:135-158 | 24  | isBrowser                                | Sheet, Drawer, Dialog |

### PUBLIC API - Already Exported

| Hook           | Location          | LOC | Status                    |
| -------------- | ----------------- | --- | ------------------------- |
| `useToast`     | ToastProvider.tsx | 11  | ✅ Exported from index.ts |
| `useScrollspy` | Scrollspy.tsx     | 9   | ✅ Exported from index.ts |

### LOW Priority - Keep Component-Internal

| Hook                      | Location      | LOC | Reason                                     |
| ------------------------- | ------------- | --- | ------------------------------------------ |
| `useModalContext`         | Modal.tsx     | 8   | Tightly coupled to Modal compound pattern  |
| `useAccordionContext`     | Accordion.tsx | 9   | Tightly coupled to Accordion               |
| `useAccordionItemContext` | Accordion.tsx | 9   | Tightly coupled to Accordion.Item          |
| `useDropdownContext`      | Dropdown.tsx  | 9   | Tightly coupled to Dropdown                |
| `useTabsContext`          | Tabs.tsx      | 8   | Tightly coupled to Tabs                    |
| `useNavbarContext`        | Navbar.tsx    | 8   | Tightly coupled to Navbar compound pattern |

### NEW Hooks to Create

| Hook               | Priority | Description                                   | Blocks                     |
| ------------------ | -------- | --------------------------------------------- | -------------------------- |
| `useReducedMotion` | MEDIUM   | Respect prefers-reduced-motion                | Animation components       |
| `useClickOutside`  | MEDIUM   | Click outside detection                       | Dropdown, Popover, Tooltip |
| `useMediaQuery`    | MEDIUM   | Responsive breakpoint detection               | Layout components          |
| `useId`            | LOW      | Stable ID generation (React 18+ has built-in) | Accessibility              |

---

## 📂 Proposed Directory Structure

```
packages/@dsai/react/src/hooks/
├── index.ts                    # Public API exports
├── internal.ts                 # Internal-only exports for components
├── useFocusTrap/
│   ├── useFocusTrap.ts
│   ├── useFocusTrap.test.ts
│   └── index.ts
├── useScrollLock/
│   ├── useScrollLock.ts
│   ├── useScrollLock.test.ts
│   └── index.ts
├── useReducedMotion/
│   ├── useReducedMotion.ts
│   ├── useReducedMotion.test.ts
│   └── index.ts
├── useClickOutside/
│   ├── useClickOutside.ts
│   ├── useClickOutside.test.ts
│   └── index.ts
└── useMediaQuery/
    ├── useMediaQuery.ts
    ├── useMediaQuery.test.ts
    └── index.ts
```

---

## 🔗 Dependencies

### Prerequisites

- [ ] None - this is a planning task

### Blocks

- TASK-063: Extract useFocusTrap hook
- TASK-064: Extract useScrollLock hook
- TASK-065: Create useReducedMotion hook
- TASK-066: Create useClickOutside hook
- TASK-067: Create useMediaQuery hook
- TASK-068: Hooks testing infrastructure
- TASK-060: Sheet component (needs useFocusTrap, useScrollLock)

---

## 🧪 Testing Requirements

- [ ] Not applicable - this is a planning task

---

## 📖 Documentation Requirements

- [ ] This inventory document serves as documentation
- [ ] hooks/README.md to be created with TASK-063

---

## 🔄 Implementation Steps

1. [x] Scan all components for inline hooks
2. [x] Categorize hooks by reuse potential
3. [x] Map dependencies for extractable hooks
4. [x] Define directory structure
5. [ ] Create child tasks for each extraction
6. [ ] Review and approve plan

---

## 📝 Notes

### Extraction Priority Rationale

**HIGH Priority (useFocusTrap, useScrollLock):**

- Required by 4+ components: Modal, Sheet, Drawer, Dialog
- Complex enough to warrant single source of truth
- Currently 88 LOC that would otherwise be duplicated

**MEDIUM Priority (New Hooks):**

- `useReducedMotion` - Important for a11y, animation components
- `useClickOutside` - Currently handled by Floating UI, may want native solution
- `useMediaQuery` - Useful for responsive components, SSR considerations

**LOW/NONE Priority (Context Hooks):**

- Component-specific context hooks are tightly coupled
- No benefit to extracting, adds indirection
- Each component's context has unique shape

### Quality Standards

All extracted hooks must:

1. Have complete TypeScript types with JSDoc
2. Have 100% test coverage
3. Handle SSR (isBrowser checks)
4. Follow React 19 best practices
5. Be documented in Storybook (if public API)

### Enterprise Quality Benchmarks

Reference implementations:

- [React Aria Hooks](https://react-spectrum.adobe.com/react-aria/hooks.html)
- [Radix UI Primitives](https://www.radix-ui.com/primitives)
- [Mantine Hooks](https://mantine.dev/hooks/use-focus-trap/)

---

## ✅ Definition of Done

- [ ] All hooks identified and categorized
- [ ] Directory structure approved
- [ ] Child tasks created (TASK-063 through TASK-068)
- [ ] Dependencies mapped
- [ ] Plan reviewed by team
