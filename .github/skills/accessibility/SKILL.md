---
name: accessibility
description: Implements WCAG 2.1 AA accessibility for DSAi components. Use when ensuring keyboard navigation, screen reader support, focus management, ARIA attributes, or color contrast compliance in React components.
license: Complete terms in LICENSE.txt
metadata:
  author: dsai
  version: '1.0'
---

# Accessibility

Implement WCAG 2.1 AA compliant accessibility in DSAi components.

## When to Use

- Building interactive components
- Implementing keyboard navigation
- Adding ARIA attributes
- Managing focus states
- Ensuring color contrast compliance
- Supporting screen readers

## DSAi Accessibility Utilities

Located in `packages/@dsai-io/react/src/utils/a11y/`:

| Utility                  | Description                               |
| ------------------------ | ----------------------------------------- |
| `useFocusTrap`           | Hook for trapping focus in modals/dialogs |
| `useKeyPress`            | Hook for detecting keyboard shortcuts     |
| `useReducedMotion`       | Hook for respecting motion preferences    |
| `trapFocus`              | Low-level focus trap function             |
| `announceToScreenReader` | Live region announcements                 |
| `createRovingTabindex`   | Roving tabindex manager                   |
| `focusableSelectors`     | Standard focusable element selectors      |
| `getArrowKeyHandler`     | Arrow key navigation helper               |

## Keyboard Navigation

### Required Keys by Component Type

| Component     | Keys                                                              |
| ------------- | ----------------------------------------------------------------- |
| Button        | `Enter`, `Space` to activate                                      |
| Link          | `Enter` to navigate                                               |
| Menu/Dropdown | `Arrow Up/Down` to navigate, `Enter` to select, `Escape` to close |
| Tabs          | `Arrow Left/Right` to switch, `Home/End` for first/last           |
| Modal         | `Tab` to cycle focus, `Escape` to close                           |
| Checkbox      | `Space` to toggle                                                 |
| Radio         | `Arrow Up/Down` to change selection                               |

### Using useKeyPress Hook

```tsx
import { useKeyPress } from '@dsai-io/react';

function SearchModal() {
  const [isOpen, setIsOpen] = useState(false);

  // Cmd+K or Ctrl+K to open search
  useKeyPress(['k'], (e) => {
    if (e.metaKey || e.ctrlKey) {
      e.preventDefault();
      setIsOpen(true);
    }
  });

  // Escape to close
  useKeyPress(['Escape'], () => setIsOpen(false));

  return isOpen ? <SearchDialog onClose={() => setIsOpen(false)} /> : null;
}
```

### Using Keyboard Utilities

```tsx
import { isEscapeKey, isEnterKey } from '@dsai-io/react';

const handleKeyDown = (e: React.KeyboardEvent) => {
  if (isEscapeKey(e)) {
    onClose?.();
  } else if (isEnterKey(e)) {
    onActivate?.();
  }
};
```

### Using getArrowKeyHandler

```tsx
import { getArrowKeyHandler } from '@dsai-io/react';

// Vertical navigation (menus, lists)
const handleKeyDown = getArrowKeyHandler({
  ArrowUp: (e) => {
    e.preventDefault();
    focusPreviousItem();
  },
  ArrowDown: (e) => {
    e.preventDefault();
    focusNextItem();
  },
});

// Horizontal navigation (tabs, toolbars)
const handleHorizontal = getArrowKeyHandler({
  ArrowLeft: () => selectPrevious(),
  ArrowRight: () => selectNext(),
});

// Grid navigation
const handleGrid = getArrowKeyHandler({
  ArrowUp: () => navigateUp(),
  ArrowDown: () => navigateDown(),
  ArrowLeft: () => navigateLeft(),
  ArrowRight: () => navigateRight(),
});
```

## ARIA Attributes

### Interactive Elements

```tsx
// Button with state
<button
  aria-expanded={isOpen}
  aria-controls="menu-id"
  aria-haspopup="menu"
>
  Menu
</button>

// Menu
<ul
  id="menu-id"
  role="menu"
  aria-labelledby="button-id"
>
  <li role="menuitem" tabIndex={-1}>Option 1</li>
  <li role="menuitem" tabIndex={-1}>Option 2</li>
</ul>
```

### Form Elements

```tsx
// Input with error
<div>
  <label id="email-label" htmlFor="email">
    Email
  </label>
  <input
    id="email"
    type="email"
    aria-labelledby="email-label"
    aria-describedby="email-error"
    aria-invalid={hasError}
  />
  {hasError && (
    <span id="email-error" role="alert">
      Please enter a valid email
    </span>
  )}
</div>
```

### Live Regions

```tsx
// Announce dynamic content
<div aria-live="polite" aria-atomic="true">
  {statusMessage}
</div>

// Urgent announcements
<div role="alert" aria-live="assertive">
  {errorMessage}
</div>
```

## Focus Management

### useFocusTrap Hook

The primary way to trap focus in modals and dialogs:

```tsx
import { useFocusTrap } from '@dsai-io/react';

function Modal({ isOpen, onClose, children }) {
  const { containerRef, isActive } = useFocusTrap({
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

**Features:**

- Tab and Shift+Tab cycle within container
- Auto-focus first focusable element on mount
- Restore focus to previously focused element on unmount
- Escape key callback support
- SSR-safe

### Low-Level trapFocus Utility

For non-React contexts or custom implementations:

```tsx
import { trapFocus } from '@dsai-io/react';

const cleanup = trapFocus(containerElement, {
  initialFocus: true,
  onEscape: () => closeModal(),
  onWrap: () => console.log('Focus wrapped'),
});

// Later: cleanup();
```

### createRovingTabindex

For tab lists, menus, and toolbars:

```tsx
import { createRovingTabindex } from '@dsai-io/react';

useEffect(() => {
  if (!containerRef.current) return;

  const manager = createRovingTabindex(containerRef.current, {
    itemSelector: '[role="tab"]',
    orientation: 'horizontal', // or 'vertical', 'both'
    loop: true,
  });

  return () => manager.destroy();
}, []);
```

### Return Focus Pattern

```tsx
function Modal({ open, onClose }) {
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (open) {
      triggerRef.current = document.activeElement as HTMLElement;
    } else {
      triggerRef.current?.focus();
    }
  }, [open]);
}
```

## Screen Reader Announcements

### announceToScreenReader Utility

```tsx
import { announceToScreenReader } from '@dsai-io/react';

// Polite announcement (default)
const cleanup = announceToScreenReader('Item saved successfully');

// Assertive announcement (interrupts)
announceToScreenReader('Critical error occurred', { assertive: true });

// With custom timeout
announceToScreenReader('Loading complete', { timeoutMs: 3000 });
```

### Live Regions in JSX

```tsx
// Polite announcements
<div aria-live="polite" aria-atomic="true">
  {statusMessage}
</div>

// Urgent announcements
<div role="alert" aria-live="assertive">
  {errorMessage}
</div>
```

## Reduced Motion

### useReducedMotion Hook

Respect user's motion preferences:

```tsx
import { useReducedMotion } from '@dsai-io/react';

function AnimatedComponent() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      style={{
        transition: prefersReducedMotion ? 'none' : 'transform 0.3s ease',
      }}
    >
      Content
    </div>
  );
}
```

### CSS Alternative

```css
@media (prefers-reduced-motion: reduce) {
  .dsai-animated {
    animation: none;
    transition: none;
  }
}
```

## Color Contrast

### Minimum Ratios (WCAG AA)

| Content            | Ratio |
| ------------------ | ----- |
| Normal text        | 4.5:1 |
| Large text (18pt+) | 3:1   |
| UI components      | 3:1   |

### DSAi Compliant Combinations

```css
/* Text on light backgrounds */
color: var(--dsai-color-gray-900); /* #212529 on #fafbfc = 16:1 ✓ */
background: var(--dsai-color-gray-50);

/* Text on primary */
color: white;
background: var(--dsai-color-blue-500); /* #0a58ca = 4.5:1 ✓ */

/* Avoid - insufficient contrast */
color: var(--dsai-color-gray-400); /* Too light on white */
```

## Visible Focus

```css
.dsai-component:focus-visible {
  outline: 2px solid var(--dsai-color-blue-500);
  outline-offset: 2px;
}

/* Remove default, add custom */
.dsai-component:focus {
  outline: none;
}

.dsai-component:focus-visible {
  box-shadow: 0 0 0 3px rgba(10, 88, 202, 0.4);
}
```

## Screen Reader Only Text

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

```tsx
<button>
  <Icon name="close" />
  <span className="sr-only">Close modal</span>
</button>
```

## Testing Accessibility

```tsx
import { axe } from 'jest-axe';

it('has no accessibility violations', async () => {
  const { container } = render(<Component />);
  expect(await axe(container)).toHaveNoViolations();
});
```

## Checklist

- [ ] All interactive elements keyboard accessible
- [ ] Focus visible on all focusable elements
- [ ] ARIA roles and attributes correct
- [ ] Color contrast meets 4.5:1 for text
- [ ] Form inputs have associated labels
- [ ] Error messages announced to screen readers
- [ ] Modal traps focus and returns on close
- [ ] No content relies on color alone
