# TASK-076-2: Refactor Switch Component

**Parent Task**: TASK-076 - Phase 3 Hook Adoption  
**Status**: 🟡 Pending  
**Priority**: Medium  
**Estimated Effort**: 1-2 hours

## Context

Switch currently uses manual controlled/uncontrolled state management for its checked state. Following the successful pattern from TASK-075 (Input, CardList, CheckboxGroup), we should refactor it to use `useControllableState`.

**Related Components**:

- Input ✅ (refactored in TASK-075-2 - similar boolean state)
- Checkbox ✅ (already uses good patterns)

## Current Implementation

**File**: `packages/@dsai/react/src/components/Switch/Switch.tsx`

**Current Pattern** (Lines ~84-87):

```tsx
// Internal state for uncontrolled mode
const [internalChecked, setInternalChecked] = useState(defaultChecked);

// Determine if controlled
const isControlled = checked !== undefined;
const isChecked = isControlled ? checked : internalChecked;
```

**Handler Pattern** (~12 lines):

```tsx
const handleToggle = (): void => {
  if (disabled || loading) {
    return;
  }

  const newValue = !isChecked;

  if (!isControlled) {
    setInternalChecked(newValue);
  }

  onChange?.(newValue);
};
```

## Proposed Refactoring

### 1. Add Hook Import

```tsx
import { useControllableState } from '../../hooks';
```

### 2. Replace State Management

```tsx
const [isChecked, setIsChecked] = useControllableState({
  value: checked,
  defaultValue: defaultChecked ?? false,
  onChange,
});
```

### 3. Simplify Handler

Refactored (~6 lines):

```tsx
const handleToggle = (): void => {
  if (disabled || loading) {
    return;
  }

  setIsChecked(!isChecked);
};
```

## Expected Benefits

- **Code Reduction**: ~6-8 lines removed
- **Consistency**: Matches Input pattern (boolean state)
- **Maintainability**: Centralized controlled/uncontrolled logic
- **Reliability**: Better edge case handling from hook

## Acceptance Criteria

- [ ] `useControllableState` imported and implemented
- [ ] Handler simplified to use `setIsChecked`
- [ ] Manual `isControlled` checks removed
- [ ] Internal state useState removed
- [ ] All TypeScript errors resolved
- [ ] Codacy analysis clean
- [ ] Controlled mode still works (checked + onChange)
- [ ] Uncontrolled mode still works (defaultChecked)
- [ ] onChange callback fires correctly
- [ ] Loading and disabled states still work
- [ ] No regressions in functionality

## Testing Checklist

- [ ] Controlled mode with checked prop
- [ ] Uncontrolled mode with defaultChecked
- [ ] onChange callback receives correct boolean
- [ ] Toggle animation works correctly
- [ ] Loading state prevents toggling
- [ ] Disabled state prevents toggling
- [ ] Keyboard interaction (Space/Enter)
- [ ] Accessibility attributes maintained
- [ ] Icons render correctly based on state

## Success Metrics

- TypeScript errors: 0
- Codacy issues: 0
- Code reduction: ~6-8 lines
- Handler complexity: 50% reduction
- Backward compatibility: 100%

## Notes

- Follow exact pattern from TASK-075-2 (Input) - both use boolean state
- Switch has loading state (unique) - ensure it still prevents toggle
- Ensure thumb animation still reflects correct state
- Test with onIcon/offIcon props
- Test with onText/offText props
- Verify aria-checked attribute updates correctly
