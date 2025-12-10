# useFocusTrap Hook

A React hook for trapping keyboard focus within a container element. Essential for accessible modal dialogs, sheets, drawers, and other overlay components.

## Features

- **Tab Key Cycling**: Tab and Shift+Tab cycle focus within the container
- **Auto-Focus**: Automatically focus the first focusable element on activation
- **Focus Restoration**: Restore focus to the previously focused element on deactivation
- **Custom Focus Targets**: Support for initial and final focus refs
- **Escape Key Handler**: Optional callback for Escape key press
- **Manual Control**: Activate/deactivate the trap programmatically
- **External Ref Support**: Use an existing ref from your component
- **SSR-Safe**: Works safely in server-side rendering environments
- **Configurable Delay**: Optional delay before initial focus

## Installation

The useFocusTrap hook is part of the `@dsai/react` package:

```tsx
import { useFocusTrap } from '@dsai/react';
```

## Usage

### Basic Usage

```tsx
import { useFocusTrap } from '@dsai/react';

function Dialog({ isOpen, onClose, children }) {
  const { containerRef } = useFocusTrap({
    enabled: isOpen,
    onEscape: onClose,
  });

  if (!isOpen) return null;

  return (
    <div ref={containerRef} role="dialog" aria-modal="true">
      {children}
    </div>
  );
}
```

### With Custom Initial Focus

```tsx
import { useRef } from 'react';
import { useFocusTrap } from '@dsai/react';

function ConfirmDialog({ isOpen, onConfirm, onCancel }) {
  const confirmButtonRef = useRef<HTMLButtonElement>(null);
  const { containerRef } = useFocusTrap({
    enabled: isOpen,
    initialFocusRef: confirmButtonRef,
  });

  if (!isOpen) return null;

  return (
    <div ref={containerRef} role="dialog">
      <h2>Confirm Action</h2>
      <p>Are you sure?</p>
      <button onClick={onCancel}>Cancel</button>
      <button ref={confirmButtonRef} onClick={onConfirm}>
        Confirm
      </button>
    </div>
  );
}
```

### Manual Control

```tsx
import { useFocusTrap } from '@dsai/react';

function CustomOverlay() {
  const { containerRef, activate, deactivate, isActive } = useFocusTrap({
    enabled: false, // Start disabled
  });

  return (
    <>
      <button onClick={activate}>Open Overlay</button>
      <div ref={containerRef}>
        <p>Focus is {isActive ? 'trapped' : 'not trapped'}</p>
        <button onClick={deactivate}>Close</button>
      </div>
    </>
  );
}
```

### Using External Ref

```tsx
import { useRef } from 'react';
import { useFocusTrap } from '@dsai/react';

function Modal({ isOpen, children }) {
  const modalRef = useRef<HTMLDivElement>(null);

  useFocusTrap({
    enabled: isOpen,
    containerRef: modalRef,
  });

  // Use modalRef for other purposes (animations, measurements, etc.)

  return (
    <div ref={modalRef} role="dialog">
      {children}
    </div>
  );
}
```

### With Final Focus Target

```tsx
import { useRef } from 'react';
import { useFocusTrap } from '@dsai/react';

function Sheet({ isOpen, onClose }) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const { containerRef } = useFocusTrap({
    enabled: isOpen,
    finalFocusRef: triggerRef, // Return focus here on close
  });

  return (
    <>
      <button ref={triggerRef} onClick={() => setIsOpen(true)}>
        Open Sheet
      </button>
      {isOpen && (
        <div ref={containerRef} role="dialog">
          <button onClick={onClose}>Close</button>
        </div>
      )}
    </>
  );
}
```

## API Reference

### Options

```typescript
interface UseFocusTrapOptions<T extends HTMLElement = HTMLElement> {
  /** Enable/disable the focus trap */
  enabled?: boolean;

  /** Auto-focus the first focusable element when trap activates */
  autoFocus?: boolean;

  /** Restore focus to previously focused element when trap deactivates */
  restoreFocus?: boolean;

  /** Ref to element that should receive initial focus */
  initialFocusRef?: React.RefObject<HTMLElement>;

  /** Ref to element that should receive focus when trap deactivates */
  finalFocusRef?: React.RefObject<HTMLElement>;

  /** Callback when Escape key is pressed */
  onEscape?: () => void;

  /** Delay (ms) before initial focus is applied */
  initialFocusDelay?: number;

  /** External container ref to use instead of internal ref */
  containerRef?: React.RefObject<T>;
}
```

### Return Value

```typescript
interface UseFocusTrapReturn<T extends HTMLElement = HTMLElement> {
  /** Ref to attach to the container element */
  containerRef: React.RefObject<T>;

  /** Manually activate the focus trap */
  activate: () => void;

  /** Manually deactivate the focus trap */
  deactivate: () => void;

  /** Current state of the focus trap */
  isActive: boolean;
}
```

## Default Values

- `enabled`: `true`
- `autoFocus`: `true`
- `restoreFocus`: `true`
- `initialFocusDelay`: `0`

## Behavior

### Focus Order

1. When the trap activates:
   - If `initialFocusRef` is provided → focus that element
   - Else if `autoFocus` is `true` → focus the first focusable element
   - Else if no focusable elements exist → focus the container

2. Tab key behavior:
   - **Tab**: Move to next focusable element, wrap to first when at last
   - **Shift+Tab**: Move to previous focusable element, wrap to last when at first
   - Single focusable element: Tab/Shift+Tab keep focus on that element

3. When the trap deactivates:
   - If `finalFocusRef` is provided → focus that element
   - Else if `restoreFocus` is `true` → focus the element that was focused before activation
   - Else → no automatic focus change

### Focusable Elements

The hook considers these elements focusable:

- `a[href]`
- `area[href]`
- `button:not([disabled])`
- `input:not([disabled])`
- `select:not([disabled])`
- `textarea:not([disabled])`
- `summary`
- `iframe`
- `[tabindex]:not([tabindex="-1"])`
- `[contenteditable="true"]`

Elements must also be:

- Visible (`visibility !== 'hidden'` and `display !== 'none'`)
- Connected to the DOM

## Accessibility

This hook implements WCAG 2.2 Level AA focus management patterns:

- **2.1.2 No Keyboard Trap**: Provides clear escape mechanism via Escape key
- **2.4.3 Focus Order**: Maintains logical focus order with Tab/Shift+Tab
- **3.2.1 On Focus**: Focus changes are predictable and user-initiated

### Best Practices

1. **Always provide an escape route**: Use `onEscape` callback or provide a close button
2. **Use with `aria-modal="true"`**: For modal dialogs
3. **Set appropriate ARIA roles**: `role="dialog"` for dialogs, etc.
4. **Label the container**: Use `aria-labelledby` or `aria-label`
5. **Announce to screen readers**: Consider using live regions for state changes

## TypeScript

The hook is fully typed with generics for the container element type:

```typescript
// Inferred as HTMLDivElement
const { containerRef } = useFocusTrap<HTMLDivElement>({
  enabled: true,
});

// Inferred as HTMLDialogElement
const { containerRef } = useFocusTrap<HTMLDialogElement>({
  enabled: true,
});
```

## Examples from Components

The useFocusTrap hook is used in these DSAi components:

- **Modal**: For dialog focus management
- **Sheet**: For side panel focus management (planned)
- **Drawer**: For drawer focus management (planned)
- **Dialog**: For alert/confirm dialogs (planned)

## Testing

The hook includes comprehensive tests covering:

- Basic activation/deactivation
- Tab and Shift+Tab cycling
- Auto-focus behavior
- Focus restoration
- Custom focus targets (initial and final)
- Escape key handling
- Manual control methods
- SSR safety
- Edge cases (single element, no focusable elements, etc.)

## Browser Support

Works in all modern browsers that support:

- ES2015+ JavaScript
- React 18+
- DOM APIs: `querySelector`, `addEventListener`, `focus()`

## Related

- [Modal Component](../components/Modal/README.md)
- [trapFocus Utility](../../utils/a11y/trapFocus.ts)
- [focusableSelectors Utility](../../utils/a11y/focusableSelectors.ts)

## References

- [ARIA Authoring Practices Guide - Dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
- [WCAG 2.2 - Guideline 2.1 Keyboard Accessible](https://www.w3.org/WAI/WCAG22/Understanding/keyboard-accessible)
- [Focus Management in React](https://react.dev/reference/react-dom/components/input#controlling-a-text-input-with-a-state-variable)
