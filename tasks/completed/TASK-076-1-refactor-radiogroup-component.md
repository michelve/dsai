# TASK-076-1: Refactor RadioGroup Component

**Parent Task**: TASK-076 - Phase 3 Hook Adoption  
**Status**: 🟡 Pending  
**Priority**: Medium  
**Estimated Effort**: 1-2 hours

## Context

RadioGroup currently uses manual controlled/uncontrolled state management. Following the successful pattern from TASK-075 (CardList, CheckboxGroup, Input), we should refactor it to use `useControllableState`.

**Related Components**:

- CheckboxGroup ✅ (refactored in TASK-075-5)
- CardList ✅ (refactored in TASK-075-4)
- Input ✅ (refactored in TASK-075-2)

## Current Implementation

**File**: `packages/@dsai/react/src/components/Radio/RadioGroup.tsx`

**Current Pattern** (Lines ~84-87):

```tsx
// Internal state for uncontrolled mode
const [internalValue, setInternalValue] = useState(defaultValue);

// Determine if controlled
const isControlled = value !== undefined;
const currentValue = isControlled ? value : internalValue;
```

**Handler Pattern** (~12 lines):

- Manual `isControlled` checks
- Separate paths for controlled/uncontrolled logic
- State update + onChange callback coordination

## Proposed Refactoring

### 1. Add Hook Import

```tsx
import { useControllableState } from '../../hooks';
```

### 2. Replace State Management

```tsx
const [currentValue, setCurrentValue] = useControllableState({
  value,
  defaultValue,
  onChange,
});
```

### 3. Simplify Handler

Current (~12 lines):

```tsx
const handleChange = (selectedValue: string) => {
  if (!isControlled) {
    setInternalValue(selectedValue);
  }
  onChange?.(selectedValue);
};
```

Refactored (~6 lines):

```tsx
const handleChange = (selectedValue: string) => {
  setCurrentValue(selectedValue);
};
```

## Expected Benefits

- **Code Reduction**: ~6-8 lines removed
- **Consistency**: Matches CardList/CheckboxGroup pattern
- **Maintainability**: Centralized controlled/uncontrolled logic
- **Reliability**: Better edge case handling from hook

## Acceptance Criteria

- [ ] `useControllableState` imported and implemented
- [ ] Handler simplified to use `setCurrentValue`
- [ ] Manual `isControlled` checks removed
- [ ] Internal state useState removed
- [ ] All TypeScript errors resolved
- [ ] Codacy analysis clean
- [ ] Controlled mode still works (value + onChange)
- [ ] Uncontrolled mode still works (defaultValue)
- [ ] onChange callback fires correctly
- [ ] No regressions in functionality

## Testing Checklist

- [ ] Controlled mode with value prop
- [ ] Uncontrolled mode with defaultValue
- [ ] onChange callback receives correct value
- [ ] Radio selection updates correctly
- [ ] Keyboard navigation still works
- [ ] Accessibility attributes maintained

## Success Metrics

- TypeScript errors: 0
- Codacy issues: 0
- Code reduction: ~6-8 lines
- Handler complexity: 50% reduction
- Backward compatibility: 100%

## Notes

- Follow exact pattern from TASK-075-4 (CardList) and TASK-075-5 (CheckboxGroup)
- RadioGroup uses string values (like Select) vs array values (like CheckboxGroup)
- Ensure aria-checked attributes still reflect correct state
- Test with name prop for form submission
