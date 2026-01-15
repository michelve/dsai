# useClickOutside

A React hook that detects clicks or touches outside of specified element(s) and triggers a callback. Perfect for dismissing dropdowns, popovers, modals, tooltips, and other overlay components when the user clicks away.

## Features

- ✅ **Single or Multiple Refs** - Track clicks outside one element or multiple elements
- ✅ **Mouse & Touch Events** - Handles both mouse and touch interactions
- ✅ **Capture Phase** - Runs before stopPropagation can prevent it (configurable)
- ✅ **Conditional Enabling** - Enable/disable listener based on component state
- ✅ **Custom Events** - Configure which events to listen for
- ✅ **SSR-Safe** - No document access during server render
- ✅ **TypeScript** - Full type safety with comprehensive type definitions
- ✅ **Zero Dependencies** - Only depends on React

## Installation

This hook is part of the `@dsai/react` package:

```bash
npm install @dsai/react
```

## API

```tsx
useClickOutside(
  refs: RefObject<HTMLElement> | RefObject<HTMLElement>[],
  callback: (event: MouseEvent | TouchEvent) => void,
  options?: UseClickOutsideOptions
): void
```

### Parameters

| Parameter  | Type                                        | Description                                    |
| ---------- | ------------------------------------------- | ---------------------------------------------- |
| `refs`     | `RefObject<HTMLElement>` or `RefObject[]`   | Element ref(s) to exclude from click detection |
| `callback` | `(event: MouseEvent \| TouchEvent) => void` | Function called when click outside is detected |
| `options`  | `UseClickOutsideOptions`                    | Configuration options (optional)               |

### Options

```typescript
interface UseClickOutsideOptions {
  /** Whether the listener is enabled. Default: true */
  enabled?: boolean;

  /** Use capture phase. Default: true */
  capture?: boolean;

  /** Event types to listen for. Default: ['mousedown', 'touchstart'] */
  events?: Array<'mousedown' | 'touchstart' | 'pointerdown'>;
}
```

| Option    | Type                                                  | Default                       | Description                               |
| --------- | ----------------------------------------------------- | ----------------------------- | ----------------------------------------- |
| `enabled` | `boolean`                                             | `true`                        | Enable/disable the click-outside listener |
| `capture` | `boolean`                                             | `true`                        | Use capture phase vs bubble phase         |
| `events`  | `Array<'mousedown' \| 'touchstart' \| 'pointerdown'>` | `['mousedown', 'touchstart']` | Event types to listen for                 |

## Examples

### Basic Usage (Single Ref)

```tsx
import { useRef, useState } from 'react';
import { useClickOutside } from '@dsai/react';

function Tooltip() {
  const [isOpen, setIsOpen] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useClickOutside(tooltipRef, () => setIsOpen(false), {
    enabled: isOpen,
  });

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Show Tooltip</button>
      {isOpen && (
        <div ref={tooltipRef} className="tooltip">
          Tooltip content
        </div>
      )}
    </>
  );
}
```

### Multiple Refs (Trigger + Content Pattern)

When your trigger and content are siblings (not parent-child), use multiple refs to exclude both from click-outside detection:

```tsx
import { useRef, useState } from 'react';
import { useClickOutside } from '@dsai/react';

function Dropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Both trigger and content are excluded from "outside"
  useClickOutside([triggerRef, contentRef], () => setIsOpen(false), { enabled: isOpen });

  return (
    <>
      <button ref={triggerRef} onClick={() => setIsOpen(!isOpen)}>
        Toggle Dropdown
      </button>
      {isOpen && (
        <div ref={contentRef} className="dropdown-menu">
          <button>Action 1</button>
          <button>Action 2</button>
        </div>
      )}
    </>
  );
}
```

### Custom Event Types

Use pointer events instead of mouse/touch:

```tsx
import { useRef } from 'react';
import { useClickOutside } from '@dsai/react';

function Dialog({ onClose }: { onClose: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useClickOutside(dialogRef, onClose, {
    events: ['pointerdown'], // Use pointer events
    capture: false, // Use bubble phase
  });

  return (
    <div ref={dialogRef} className="dialog">
      Dialog content
    </div>
  );
}
```

### Conditional Enabling

Only enable click-outside detection when dropdown is open:

```tsx
import { useRef, useState } from 'react';
import { useClickOutside } from '@dsai/react';

function Menu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Only active when menu is open
  useClickOutside(
    menuRef,
    () => setIsOpen(false),
    { enabled: isOpen } // Conditional
  );

  return (
    <div ref={menuRef}>
      <button onClick={() => setIsOpen(!isOpen)}>Menu</button>
      {isOpen && (
        <ul>
          <li>Item 1</li>
          <li>Item 2</li>
        </ul>
      )}
    </div>
  );
}
```

### With Portal (React Portal)

Works seamlessly with React portals:

```tsx
import { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useClickOutside } from '@dsai/react';

function Modal({ onClose }: { onClose: () => void }) {
  const modalRef = useRef<HTMLDivElement>(null);

  useClickOutside(modalRef, onClose);

  return createPortal(
    <div className="modal-backdrop">
      <div ref={modalRef} className="modal-content">
        Modal content
        <button onClick={onClose}>Close</button>
      </div>
    </div>,
    document.body
  );
}
```

## Common Patterns

### Dropdown with Keyboard Support

Combine with keyboard event handling for full accessibility:

```tsx
import { useRef, useState, useEffect } from 'react';
import { useClickOutside } from '@dsai/react';

function AccessibleDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useClickOutside([triggerRef, contentRef], () => setIsOpen(false), { enabled: isOpen });

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  return (
    <>
      <button
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        Options
      </button>
      {isOpen && (
        <div ref={contentRef} role="menu">
          <button role="menuitem">Option 1</button>
          <button role="menuitem">Option 2</button>
        </div>
      )}
    </>
  );
}
```

### Nested Overlays

Handle multiple layers of overlays (e.g., dropdown inside modal):

```tsx
function NestedExample() {
  const [modalOpen, setModalOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Modal closes on click outside
  useClickOutside(modalRef, () => setModalOpen(false), { enabled: modalOpen });

  // Dropdown closes on click outside (but not on modal background)
  useClickOutside(dropdownRef, () => setDropdownOpen(false), {
    enabled: dropdownOpen && modalOpen,
  });

  return (
    <>
      <button onClick={() => setModalOpen(true)}>Open Modal</button>
      {modalOpen && (
        <div className="modal-backdrop">
          <div ref={modalRef} className="modal">
            <h2>Modal Content</h2>
            <button onClick={() => setDropdownOpen(!dropdownOpen)}>Toggle Dropdown</button>
            {dropdownOpen && (
              <div ref={dropdownRef} className="dropdown">
                Dropdown content
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
```

## How It Works

1. **Event Listening**: Attaches event listeners to `document` for specified events (default: `mousedown` and `touchstart`)
2. **Capture Phase**: By default, uses capture phase (`capture: true`) so it runs before any `stopPropagation()` in child elements
3. **Outside Detection**: On each event, checks if the click target is contained within any of the provided refs
4. **Callback**: If click is outside all refs, calls the callback with the event object
5. **Cleanup**: Removes all event listeners when component unmounts or when `enabled` becomes `false`

## Why Capture Phase

By default, this hook uses the capture phase (`capture: true`). This ensures the click-outside handler runs **before** any `event.stopPropagation()` calls in child components can prevent it.

```tsx
// With capture: true (default)
useClickOutside(ref, handleClose); // ✅ Runs even if child calls stopPropagation

// With capture: false
useClickOutside(ref, handleClose, { capture: false }); // ⚠️ May not run if child calls stopPropagation
```

## Why mousedown Instead of click

The hook uses `mousedown` instead of `click` by default to fire **before** potential `blur` events on input elements. This prevents race conditions where an input loses focus before the click-outside handler can run.

## Browser Support

Works in all modern browsers that support:

- `addEventListener` / `removeEventListener`
- `Node.contains()`
- Event capture phase

Basically: **All modern browsers** (Chrome, Firefox, Safari, Edge)

## SSR (Server-Side Rendering)

This hook is SSR-safe. It detects when `window` is undefined and skips event listener attachment during server rendering.

```tsx
// Works fine in Next.js, Remix, etc.
function ServerRenderedComponent() {
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, handleClose); // ✅ No errors during SSR

  return <div ref={ref}>Content</div>;
}
```

## Comparison with Alternatives

### vs. Floating UI's useDismiss

| Feature            | useClickOutside           | Floating UI useDismiss     |
| ------------------ | ------------------------- | -------------------------- |
| Click outside      | ✅                        | ✅                         |
| Multiple refs      | ✅                        | ✅ (via tree/outsidePress) |
| Escape key         | ❌ (separate hook needed) | ✅                         |
| Focus outside      | ❌                        | ✅                         |
| Ancestor scroll    | ❌                        | ✅                         |
| Standalone use     | ✅                        | ❌ (requires Floating UI)  |
| Custom event types | ✅                        | Limited                    |

**When to use `useClickOutside`:**

- Non-floating components (modals, drawers, sheets)
- Custom implementations
- Components that don't use Floating UI

**When to use Floating UI's `useDismiss`:**

- Floating elements (tooltips, popovers, dropdowns)
- Need comprehensive dismiss behavior (Escape, focus, scroll)
- Already using Floating UI

### vs. React-onclickoutside

| Feature              | useClickOutside | React-onclickoutside |
| -------------------- | --------------- | -------------------- |
| Hook-based API       | ✅              | ❌ (HOC)             |
| Multiple refs        | ✅              | ❌                   |
| TypeScript           | ✅              | Partial              |
| React 18+ compatible | ✅              | ✅                   |
| Bundle size          | Tiny            | Larger               |

## Best Practices

### 1. Conditional Enabling

Always use the `enabled` option to avoid unnecessary event listeners:

```tsx
// ✅ Good: Only active when open
useClickOutside(ref, handleClose, { enabled: isOpen });

// ❌ Bad: Always listening
useClickOutside(ref, () => {
  if (isOpen) {
    handleClose();
  }
});
```

### 2. Stable Callback

Wrap your callback in `useCallback` if it has dependencies:

```tsx
const handleClose = useCallback(() => {
  setIsOpen(false);
  onClose?.(); // External callback
}, [onClose]);

useClickOutside(ref, handleClose, { enabled: isOpen });
```

### 3. Ref Initialization

Ensure refs are attached before enabling the hook:

```tsx
// ✅ Good: Only enable when content is rendered
{
  isOpen && <div ref={contentRef}>Content</div>;
}
useClickOutside(contentRef, handleClose, { enabled: isOpen });

// ⚠️ Caution: Ref might be null when first enabled
useClickOutside(contentRef, handleClose, { enabled: true });
{
  isOpen && <div ref={contentRef}>Content</div>;
}
```

### 4. Multiple Refs Order

The order of refs in the array doesn't matter:

```tsx
// Both are equivalent
useClickOutside([triggerRef, contentRef], handleClose);
useClickOutside([contentRef, triggerRef], handleClose);
```

## Troubleshooting

### Callback fires when clicking inside

**Cause**: Ref not properly attached or null

```tsx
// ❌ Problem: Ref is null when hook runs
const ref = useRef<HTMLDivElement>(null);
useClickOutside(ref, handleClose);
// ...later...
return <div ref={ref}>Content</div>;

// ✅ Solution: Ensure ref is attached
return <div ref={ref}>Content</div>;
```

### Callback doesn't fire

**Cause**: `enabled: false` or event is being stopped

```tsx
// Check if enabled
useClickOutside(ref, handleClose, { enabled: isOpen }); // Is isOpen true?

// Check for stopPropagation
<div onClick={(e) => e.stopPropagation()}> // ⚠️ Might prevent click-outside
```

### Multiple callbacks firing

**Cause**: Multiple hook instances listening

```tsx
// ✅ Use single hook with multiple refs
useClickOutside([ref1, ref2], handleClose);

// ❌ Avoid multiple hooks for same purpose
useClickOutside(ref1, handleClose);
useClickOutside(ref2, handleClose); // Both will fire
```

## TypeScript

Full TypeScript support with comprehensive type definitions:

```tsx
import type {
  UseClickOutsideOptions,
  UseClickOutsideRefs,
  UseClickOutsideCallback,
} from '@dsai/react';

const options: UseClickOutsideOptions = {
  enabled: true,
  capture: true,
  events: ['mousedown', 'touchstart'],
};

const refs: UseClickOutsideRefs = [triggerRef, contentRef];

const callback: UseClickOutsideCallback = (event) => {
  console.log('Clicked outside', event);
};

useClickOutside(refs, callback, options);
```

## Related Hooks

- `useFocusTrap` - Trap focus within an element
- `useScrollLock` - Prevent body scroll
- `useEscapeKey` - Detect Escape key press (future)

## License

MIT © DSAi Design System
