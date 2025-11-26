# Button FSM - Quick Reference Guide

## Files at a Glance

```text
packages/@dsai/react/src/components/Button/
├── Button.tsx                          # Smart component with FSM
├── BaseButton.tsx                      # Presentational component
├── Button.fsm.ts                       # FSM reducer & types
├── Button.types.ts                     # Props interface (updated)
├── Button.test.tsx                     # Existing tests + original coverage
├── Button.fsm.test.ts                  # FSM unit tests (36 tests)
├── Button.integration.test.tsx         # FSM integration tests (30 tests)
├── Button.stories.tsx                  # 5 new FSM showcase stories
└── index.ts                            # Updated exports
```

## Quick Start

### Use the Button

```tsx
// Basic
<Button>Click me</Button>

// With variants
<Button variant="primary" size="lg">Submit</Button>

// With loading
<Button loading>Processing...</Button>

// With error state (NEW)
<Button error onClick={handleRetry}>Retry</Button>

// Complex async
<Button loading={isLoading} error={hasError} onClick={handleSubmit}>
  {isLoading ? 'Saving...' : hasError ? 'Failed - Retry?' : 'Save'}
</Button>
```

### Component Architecture

```tsx
Button (useReducer FSM orchestration)
  ↓ passes fsmState
BaseButton (presentational, renders UI)
  ↓ exposes data-visual-state="idle|hovered|focused|pressed|disabled|loading|error"
```

## FSM States & Transitions

| State      | From            | Via     | Condition          |
| ---------- | --------------- | ------- | ------------------ |
| `idle`     | Any interactive | BLUR    | No hover/focus     |
| `hovered`  | idle/focused    | HOVER   | mouseenter         |
| `focused`  | Any             | FOCUS   | focus event        |
| `pressed`  | Any interactive | PRESS   | left mousedown     |
| `disabled` | Any             | DISABLE | disabled prop true |
| `loading`  | Any             | LOADING | loading prop true  |
| `error`    | Any             | ERROR   | error prop true    |

**Priority**: `disabled` > `loading` > `error` > interactive states

## Testing

### FSM Unit Tests

```bash
# Test FSM reducer logic
npm test -- Button.fsm.test.ts
# 36 tests covering all state transitions
```

### Integration Tests

```bash
# Test Button component with FSM
npm test -- Button.integration.test.tsx
# 30 tests covering real-world scenarios
```

### Query FSM State in Tests

```typescript
import { render, fireEvent } from '@testing-library/react';

const { container } = render(<Button>Test</Button>);
const button = container.querySelector('button');

// Check FSM state
expect(button).toHaveAttribute('data-visual-state', 'idle');

// Trigger state change
fireEvent.mouseEnter(button);
expect(button).toHaveAttribute('data-visual-state', 'hovered');

// Find by state
const pressedButton = container.querySelector('[data-visual-state="pressed"]');
```

## Storybook Stories

**Location**: `packages/@dsai/storybook/docs/components/Button.stories.tsx`

**New FSM Stories**:

1. `ErrorState` - New error prop demonstration
2. `ErrorWithRecovery` - Error recovery flow
3. `FSMStatePriority` - State precedence rules
4. `FSMInteractiveStates` - Hover/focus/press transitions
5. `FSMAsyncOperations` - Realistic async flows

**Run Storybook**:

```bash
npm run storybook
# Navigate to Button > FSMAsync Operations (etc)
```

## Type Exports

```typescript
import {
  Button, // Main component
  BaseButton, // Presentational (for advanced use)
  ButtonProps, // Component props
  ButtonVisualState, // 'idle' | 'hovered' | 'focused' | ...
  ButtonFSMEvent, // 'HOVER' | 'BLUR' | 'FOCUS' | ...
  buttonFSMReducer, // Pure reducer function
  getInitialFSMState, // State factory
} from '@dsai/react';
```

## Quality Status

| Check                  | Status   |
| ---------------------- | -------- |
| ESLint                 | ✅ Pass  |
| Semgrep                | ✅ Pass  |
| TypeScript             | ✅ Pass  |
| FSM Tests              | ✅ 36/36 |
| Integration Tests      | ✅ 30/30 |
| Backward Compatibility | ✅ 100%  |

## Advanced Usage

### Manual FSM Control

```typescript
import { Button, BaseButton, buttonFSMReducer, getInitialFSMState } from '@dsai/react';

// For advanced scenarios where you manage FSM manually
const MyAdvancedButton = () => {
  const [fsmState, dispatch] = useReducer(
    buttonFSMReducer,
    getInitialFSMState()
  );

  const handleCustomEvent = () => {
    dispatch('LOADING');  // Manually control FSM
  };

  return <BaseButton fsmState={fsmState} onClick={handleCustomEvent} />;
};
```

### CSS Targeting by State

```css
/* Normal state */
button[data-visual-state='idle'] {
  /* styles */
}

/* Hover state */
button[data-visual-state='hovered'] {
  /* styles */
}

/* Loading state */
button[data-visual-state='loading'] {
  /* styles with spinner animation */
}

/* Error state */
button[data-visual-state='error'] {
  border-color: var(--danger-color);
  background-color: var(--danger-light-color);
}
```

## Troubleshooting

### Button not showing error state

```typescript
// ❌ Wrong - error prop missing
<Button onClick={handleRetry}>Retry</Button>

// ✅ Correct - error prop present
<Button error onClick={handleRetry}>Retry</Button>
```

### State not changing on interaction

```typescript
// Make sure you're reading the updated attribute
const button = container.querySelector('button');
fireEvent.mouseEnter(button);

// ✅ Correct - check after event
expect(button).toHaveAttribute('data-visual-state', 'hovered');

// ❌ Wrong - checking before event
const button2 = container.querySelector('button');
expect(button2).toHaveAttribute('data-visual-state', 'idle');
fireEvent.mouseEnter(button2); // Too late!
```

### Right-click not triggering pressed state

```typescript
// ✅ Correct - only left button (0) triggers PRESS event
fireEvent.mouseDown(button, { button: 0 }); // Pressed state
fireEvent.mouseDown(button, { button: 2 }); // No state change (right click)
```

## Performance Notes

- ✅ Button uses `useReducer` (minimal re-renders)
- ✅ BaseButton can be wrapped with `React.memo`
- ✅ Event handlers are stable (no inline functions)
- ✅ No unnecessary effects or computations
- ✅ Data-visual-state attribute leverages CSS inheritance

## Migration Path

**From Old Button to FSM Button**: NONE REQUIRED! ✅

- All existing code continues to work
- New props are optional
- Backward compatible 100%
- No breaking changes

## Documentation

- 📄 Full implementation: `Button-FSM-Implementation-Complete.md`
- 🧪 FSM tests: `Button.fsm.test.ts` (36 tests)
- 🔗 Integration tests: `Button.integration.test.tsx` (30 tests)
- 📖 Storybook: Visual examples in component stories
- 💻 Code: Well-commented inline documentation

## Support

For issues or questions:

1. Check the Storybook stories for examples
2. Review FSM tests for expected behavior
3. Check `data-visual-state` in browser dev tools
4. Refer to full implementation doc above
