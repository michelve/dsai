# Button FSM Design Phase 2 Summary

## Overview

This document outlines the Phase 2 design for the Button component Finite State Machine (FSM) implementation, based on the existing design system patterns discovered in Phase 1.

## Design System Baseline (Phase 1 Findings)

### Current Button Implementation

- **Location**: `packages/@dsai/react/src/components/Button/Button.tsx`
- **Variants**: primary, secondary, success, danger, warning, info, light, dark, outline-\*, link (17 total)
- **Sizes**: sm, md, lg
- **States**: disabled, loading (with spinner), error capability
- **Props**: startIcon, endIcon, fullWidth, loadingText, announceText
- **Framework**: React 19 + TypeScript + Bootstrap 5
- **Test Coverage**: 68+ comprehensive tests
- **Accessibility**: Full WCAG 2.2 AA compliance

### Tokens Architecture

- **Tokens Package**: `packages/@dsai/tokens/`
- **Bootstrap Bridge**: `dsai-theme-bs.scss` maps design tokens to Bootstrap 5 CSS variables
- **Token Utilities**: `token-utils.ts` provides type-safe access (getToken, cssVar, getColorToken, etc.)
- **Color Palette**: 11 color families × 11 shades (50-950) + neutral grays
- **Integration Pattern**: CSS variables via Bootstrap classes + direct cssVar() utility access

### Reference Components (Patterns to Follow)

- **Checkbox**: Uses forwardRef + memo + useMemo for performance
- **Input**: Security via SafeHTMLAttributes whitelist, token-driven styling

## Phase 2: Button API and FSM Design

### Visual States

```typescript
type ButtonVisualState =
  | 'idle' // default, no interaction
  | 'hovered' // mouse over
  | 'focused' // keyboard focus
  | 'pressed' // mouse down
  | 'disabled' // disabled prop = true
  | 'loading' // loading prop = true
  | 'error'; // error prop = true
```

**State Hierarchy**:

- Override states (take precedence): `disabled` > `loading` > `error`
- Interactive states (mutual exclusive or combinable): `hovered`, `focused`, `pressed`
- Default state: `idle`

### FSM Events

```typescript
type ButtonFSMEvent =
  | { type: 'HOVER' } // onMouseEnter
  | { type: 'BLUR' } // onMouseLeave or onBlur
  | { type: 'FOCUS' } // onFocus
  | { type: 'PRESS' } // onMouseDown (left button)
  | { type: 'RELEASE' } // onMouseUp
  | { type: 'DISABLE' } // disabled prop changed to true
  | { type: 'ENABLE' } // disabled prop changed to false
  | { type: 'LOADING'; payload: boolean }
  | { type: 'ERROR'; payload: boolean };
```

### FSM Reducer Rules

**Core Rules**:

1. **Override Precedence**: `disabled` / `loading` / `error` → always active, ignore interactive events
2. **Interactive Precedence**: `pressed` > `focused` > `hovered` > `idle`
3. **Disabled Isolation**: When disabled, interactive events have no effect
4. **Deterministic**: Same input → always same output (pure function)
5. **Reset on Exit**: Exiting disabled/loading/error resets pressed/hovered/focused flags

**Transition Examples**:

```text
idle + HOVER → hovered
hovered + PRESS → pressed
pressed + RELEASE → hovered (if still hovering) or idle
hovered + FOCUS → focused (both active)
focused + DISABLE → disabled (override)
disabled + ENABLE → idle (resets all flags)

loading → any event → loading (ignored)
error → any event → error (ignored)
```

### Button Props (Existing + FSM-Aware)

**Inherited from Current API**:

```typescript
interface ButtonProps {
  // Layout & Content
  children: React.ReactNode
  type?: 'button' | 'submit' | 'reset'

  // Styling
  variant?: string // 'primary' | 'secondary' | ... (all 17 current variants)
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean

  // State (now FSM-coordinated)
  disabled?: boolean
  loading?: boolean
  error?: boolean // NEW: added for FSM

  // Icons & Loading
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
  loadingText?: string

  // Events
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void

  // Accessibility
  aria-label?: string
  aria-describedby?: string
  aria-controls?: string
  aria-expanded?: boolean
  aria-pressed?: boolean
  announceText?: string
  announce?: boolean

  // Native HTML
  className?: string
  style?: React.CSSProperties
  form?: string
  formAction?: string
  formMethod?: string
  formNoValidate?: boolean
  formTarget?: string

  // Other
  ref?: React.Ref<HTMLButtonElement>
  title?: string
  tabIndex?: number
  name?: string
  value?: string
  id?: string
  data-testid?: string
  data-test?: string
}

interface BaseButtonProps extends Omit<ButtonProps, 'disabled' | 'loading' | 'error'> {
  // FSM passes visual state explicitly
  visualState: ButtonVisualState
  isPressed: boolean
  isHovered: boolean
  isFocused: boolean
}
```

**New in FSM Version**:

- `error` prop (boolean) → triggers error visual state
- `visualState` data attribute on button element for CSS targeting

### Component Structure

```text
Button.tsx
├── uses useReducer(buttonFSMReducer)
├── syncs FSM with props (disabled, loading, error)
├── hooks DOM events → dispatch FSM events
├── renders BaseButton with visualState
└── preserves existing public API

BaseButton.tsx
├── receives visualState from Button
├── applies CSS classes based on visualState
├── uses Bootstrap classes + data-visual-state
├── no FSM logic (presentational only)
└── optional: use tokens for dynamic styling

Button.types.ts
├── ButtonVisualState union type
├── ButtonFSMEvent discriminated union
├── ButtonFSMState interface
└── ButtonProps (updated with error prop)

Button.fsm.ts
├── buttonFSMReducer pure function
├── createInitialButtonFSMState
└── FSM logic tests
```

### Styling Strategy

**Bootstrap as Primary**:

- Keep existing bootstrap classes (btn, btn-primary, btn-sm, etc.)
- Add `data-visual-state` attribute for CSS targeting

**CSS Selectors** (in Button.scss or similar):

```scss
button[data-visual-state='pressed'] {
  // pressed styling: darker shade, subtle scale
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
  transform: scale(0.98);
}

button[data-visual-state='hovered'] {
  // hover styling: usually handled by Bootstrap :hover
}

button[data-visual-state='focused'] {
  // focus styling: usually handled by Bootstrap :focus-visible
}

button[data-visual-state='loading'],
button[data-visual-state='disabled'] {
  // handled by Bootstrap classes already
}

button[data-visual-state='error'] {
  // error styling: red tint, alert indicator
  background-color: color-mix(in srgb, var(--color-red-500) 20%, currentColor);
}
```

**Optional Token Integration**:

- Use `cssVar()` utility from tokens package for custom colors if needed
- Example: `background-color: var(--color-blue-600)` (set by dsai-theme-bs.css)
- Keep it minimal: Bootstrap handles most styling via themes

### Compatibility Notes

**Breaking Changes**: None. Error state is new prop, but optional.

**Migration**: No migration needed for existing code. Existing Button API fully preserved.

**Adding Error State**: Optional enhancement. Existing code continues to work without it.

## Phase 2 Implementation Artifacts

**Files Created**:

1. `Button.fsm.ts` - FSM reducer, types, state factory
2. `design-phase-2.md` - This document

**Next Phase Dependencies**:

- Phase 3 needs button-fsm.ts to be complete
- Phase 4 needs BaseButton to be implemented
- Phase 5 needs tests for FSM transitions

## Validation Checklist

- [x] Visual states defined with clear semantics
- [x] FSM events cover all interaction patterns
- [x] Reducer rules are deterministic and testable
- [x] Existing API fully preserved
- [x] Bootstrap integration maintained
- [x] Token architecture supports styling
- [x] Accessibility maintained (no new a11y issues)
- [x] Component structure clear and modular

---

**Next**: Proceed to Phase 3 (BaseButton implementation)
