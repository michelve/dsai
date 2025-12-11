# TASK-075: Component Hook Refactoring - Subtask Index

**Parent Task:** TASK-075 (Refactor Components to Use Centralized Hooks)  
**Created:** 2025-12-10  
**Status:** 🟡 Ready for Implementation

---

## 📊 Overview

This document provides an index and tracking system for all TASK-075 subtasks. The parent task has been broken down into 5 independent, manageable subtasks that can be worked on sequentially or in parallel.

---

## 🎯 Subtasks Summary

| ID                        | Component     | Hook(s)                                     | Time Est. | Priority    | Status   | Assignee |
| ------------------------- | ------------- | ------------------------------------------- | --------- | ----------- | -------- | -------- |
| [TASK-075-1](#task-075-1) | Select        | useClickOutside                             | 3-4h      | High        | 🟡 Ready | -        |
| [TASK-075-2](#task-075-2) | Input         | useField, useControllableState, useDebounce | 4-5h      | High        | 🟡 Ready | -        |
| [TASK-075-3](#task-075-3) | Navbar        | useClickOutside                             | 3-4h      | High        | 🟡 Ready | -        |
| [TASK-075-4](#task-075-4) | CardList      | useControllableState                        | 2-3h      | Medium-High | 🟡 Ready | -        |
| [TASK-075-5](#task-075-5) | CheckboxGroup | useControllableState                        | 2-3h      | Medium-High | 🟡 Ready | -        |

**Total Estimated Time:** 14-19 hours  
**Total Components:** 5  
**Total Code Reduction:** 150-200 lines

---

## 📁 Subtask Files

### TASK-075-1: Select Component

**File:** `tasks/02-high/TASK-075-1-refactor-select-component.md`

**Summary:**

- Replace manual click outside detection with `useClickOutside` hook
- Remove ~30-40 lines of event listener code
- Better iframe/portal handling
- All 80+ tests must pass

**Key Changes:**

```tsx
// Remove manual implementation (~40 lines)
// Add: useClickOutside(selectRef, handleClose, { enabled: isOpen });
```

**Dependencies:** None  
**Can Start:** Immediately

---

### TASK-075-2: Input Component

**File:** `tasks/02-high/TASK-075-2-refactor-input-component.md`

**Summary:**

- Add optional form integration with `useField` hook
- Replace state management with `useControllableState`
- Add optional debouncing with `useDebounce`
- All new props are optional (100% backward compatible)
- All 100+ tests must pass

**Key Changes:**

```tsx
// Add form integration (optional)
const fieldState = name && validate ? useField(name, { validate }) : null;

// Replace state management
const [value, setValue] = useControllableState({...});

// Add debouncing (optional)
const debouncedValue = debounceMs > 0 ? useDebounce(value, debounceMs) : value;
```

**Dependencies:** None  
**Can Start:** Immediately (parallel with TASK-075-1)

---

### TASK-075-3: Navbar Component

**File:** `tasks/02-high/TASK-075-3-refactor-navbar-component.md`

**Summary:**

- Replace manual click outside detection with `useClickOutside` hook
- Remove ~40 lines of complex event management code
- Simplify mobile menu logic
- All 60+ tests must pass

**Key Changes:**

```tsx
// Remove handleClickOutside callback and useEffect (~40 lines)
// Add: useClickOutside(navbarRef, handleClose, { enabled: expanded });
```

**Dependencies:** None  
**Can Start:** Immediately (parallel with TASK-075-1 and TASK-075-2)

---

### TASK-075-4: CardList Component

**File:** `tasks/02-high/TASK-075-4-refactor-cardlist-component.md`

**Summary:**

- Replace manual controlled/uncontrolled state with `useControllableState`
- Remove ~8-10 lines of manual state logic
- Simplify handleSelect function
- All 40+ tests must pass

**Key Changes:**

```tsx
// Remove manual state management (~10 lines)
// Add: const [selectedIds, setSelectedIds] = useControllableState({...});
```

**Dependencies:** None  
**Can Start:** Immediately (independent of other subtasks)

---

### TASK-075-5: CheckboxGroup Component

**File:** `tasks/02-high/TASK-075-5-refactor-checkboxgroup-component.md`

**Summary:**

- Replace manual controlled/uncontrolled state with `useControllableState`
- Remove ~8-10 lines of manual state logic
- Standardize pattern with other form components
- All 50+ tests must pass

**Key Changes:**

```tsx
// Remove manual state management (~10 lines)
// Add: const [selectedValues, setSelectedValues] = useControllableState({...});
```

**Dependencies:** None  
**Can Start:** Immediately (last subtask, can be done anytime)

---

## 🗓️ Suggested Implementation Schedule

### Option 1: Sequential (Single Developer)

**Day 1: High Value Components**

- Morning: TASK-075-1 (Select) - 3-4h
- Afternoon: TASK-075-2 (Input) - 4-5h

**Day 2: Remaining Components**

- Morning: TASK-075-3 (Navbar) - 3-4h
- Afternoon: TASK-075-4 (CardList) + TASK-075-5 (CheckboxGroup) - 4-6h

**Total:** 2 days (14-19 hours)

---

### Option 2: Parallel (Multiple Developers)

**All subtasks can be worked on simultaneously:**

**Developer A:** TASK-075-1 (Select) + TASK-075-3 (Navbar)

- Both use `useClickOutside`
- Shared learning
- 6-8 hours total

**Developer B:** TASK-075-2 (Input)

- Most complex subtask
- Multiple hooks
- 4-5 hours total

**Developer C:** TASK-075-4 (CardList) + TASK-075-5 (CheckboxGroup)

- Both use `useControllableState`
- Similar pattern
- 4-6 hours total

**Total:** 1 day (parallel execution)

---

### Option 3: Priority-Based

**Phase 1 (High Priority):**

1. TASK-075-1 (Select) - Click detection critical
2. TASK-075-3 (Navbar) - Mobile menu critical

**Phase 2 (New Features):** 3. TASK-075-2 (Input) - Adds form integration

**Phase 3 (Consistency):** 4. TASK-075-4 (CardList) 5. TASK-075-5 (CheckboxGroup)

---

## ✅ Completion Checklist

### Per Subtask

- [ ] Feature branch created
- [ ] Implementation complete
- [ ] All existing tests pass
- [ ] New tests added (if applicable)
- [ ] TypeScript check passes
- [ ] Linter passes
- [ ] Codacy analysis passes (0 issues)
- [ ] Manual testing complete
- [ ] Storybook verified
- [ ] Accessibility tested
- [ ] Code committed with proper message
- [ ] Feature branch pushed
- [ ] PR created (if separate)
- [ ] Subtask marked complete

### Overall TASK-075

- [ ] All 5 subtasks completed
- [ ] All 330+ tests passing
- [ ] Code reduction: 150-200 lines
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] No accessibility regressions
- [ ] Documentation updated
- [ ] CHANGELOG updated
- [ ] Parent task marked complete

---

## 📊 Progress Tracking

**Update this section as subtasks are completed:**

### TASK-075-1: Select

- Status: 🟡 Ready
- Started: _Not yet_
- Completed: _Not yet_
- Time Spent: _TBD_
- Issues: _None_

### TASK-075-2: Input

- Status: 🟡 Ready
- Started: _Not yet_
- Completed: _Not yet_
- Time Spent: _TBD_
- Issues: _None_

### TASK-075-3: Navbar

- Status: 🟡 Ready
- Started: _Not yet_
- Completed: _Not yet_
- Time Spent: _TBD_
- Issues: _None_

### TASK-075-4: CardList

- Status: 🟡 Ready
- Started: _Not yet_
- Completed: _Not yet_
- Time Spent: _TBD_
- Issues: _None_

### TASK-075-5: CheckboxGroup

- Status: 🟡 Ready
- Started: _Not yet_
- Completed: _Not yet_
- Time Spent: _TBD_
- Issues: _None_

---

## 🔗 Quick Links

### Documentation

- [Parent Task (TASK-075)](./TASK-075-refactor-components-to-use-centralized-hooks.md)
- [Component Analysis](../01-critical/COMPREHENSIVE-COMPONENT-ANALYSIS.md)
- [useClickOutside Hook](../../packages/@dsai/react/src/hooks/useClickOutside/)
- [useControllableState Hook](../../packages/@dsai/react/src/hooks/useControllableState/)
- [useField Hook](../../packages/@dsai/react/src/hooks/useField/)
- [useDebounce Hook](../../packages/@dsai/react/src/hooks/useDebounce/)

### Testing

```bash
# Run all component tests
pnpm nx test @dsai/react

# Run specific component tests
pnpm nx test @dsai/react --testPathPattern=Select
pnpm nx test @dsai/react --testPathPattern=Input
pnpm nx test @dsai/react --testPathPattern=Navbar
pnpm nx test @dsai/react --testPathPattern=CardList
pnpm nx test @dsai/react --testPathPattern=CheckboxGroup

# Run Storybook
pnpm nx storybook @dsai/storybook
```

### Code Quality

```bash
# TypeScript check
pnpm nx type-check @dsai/react

# Linter
pnpm nx lint @dsai/react --fix

# Codacy analysis
codacy-cli analyze --file <file-path>
```

---

## 🎯 Success Metrics

### Code Quality

- ✅ 150-200 lines removed
- ✅ 0 TypeScript errors
- ✅ 0 ESLint warnings
- ✅ 0 Codacy issues
- ✅ 100% backward compatibility

### Testing

- ✅ All 330+ existing tests pass
- ✅ 20-30 new tests added
- ✅ 90%+ code coverage maintained
- ✅ 0 accessibility regressions

### Performance

- ✅ Bundle size unchanged or smaller
- ✅ No performance regressions
- ✅ Better edge case handling

### Maintainability

- ✅ Standard patterns across all components
- ✅ Single source of truth (centralized hooks)
- ✅ Easier to update in future
- ✅ Clear documentation

---

## 🚀 Getting Started

To begin working on subtasks:

1. **Read the parent task** for context:

   ```bash
   cat tasks/02-high/TASK-075-refactor-components-to-use-centralized-hooks.md
   ```

2. **Read the component analysis** for background:

   ```bash
   cat tasks/01-critical/COMPREHENSIVE-COMPONENT-ANALYSIS.md
   ```

3. **Choose a subtask** based on priority or availability

4. **Read the subtask file** completely before starting

5. **Create feature branch** and begin implementation

6. **Update progress** in this index file as you go

---

## 📞 Support

**Questions or Issues?**

- Check parent task documentation
- Review component analysis document
- Inspect hook implementation and tests
- Look at Modal component as best practice example

**Blockers?**

- Document in this file
- Update subtask status
- Communicate with team

---

## 🎉 Completion

When all 5 subtasks are complete:

1. [ ] Verify all tests pass
2. [ ] Run full type check
3. [ ] Run full lint
4. [ ] Test all components in Storybook
5. [ ] Update parent task (TASK-075) as complete
6. [ ] Update CHANGELOG
7. [ ] Create comprehensive PR (or merge individual PRs)
8. [ ] Celebrate! 🎊

---

**Let's build better components with centralized hooks! 🚀**
