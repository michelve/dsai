# Keyboard Utilities

Enterprise-grade utilities for handling keyboard events with IME composition safety and cross-browser support.

## Overview

This module provides utilities for:

- Detecting Enter key presses
- Detecting Escape key presses
- IME composition handling
- Cross-browser keyboard event normalization

## Installation

```tsx
import { isEnterKey, isEscapeKey } from '@dsai-io/react';
```

---

## Functions

### `isEnterKey`

Detect Enter key presses with IME composition safety. Prevents false positives during Asian language input (Chinese, Japanese, Korean).

**Signature:**

```tsx
function isEnterKey(event: React.KeyboardEvent | KeyboardEvent): boolean;
```

**Examples:**

```tsx
// Basic usage
function handleKeyDown(event: React.KeyboardEvent) {
  if (isEnterKey(event)) {
    event.preventDefault();
    submitForm();
  }
}

// In input handlers
<input
  onKeyDown={(e) => {
    if (isEnterKey(e)) {
      handleSearch();
    }
  }}
/>;

// With modifier keys
function handleKeyDown(event: React.KeyboardEvent) {
  if (isEnterKey(event) && event.ctrlKey) {
    // Ctrl+Enter detected
    submitWithNewLine();
  } else if (isEnterKey(event)) {
    // Plain Enter
    submit();
  }
}

// In custom hooks
function useEnterKey(callback: () => void) {
  return (event: React.KeyboardEvent) => {
    if (isEnterKey(event)) {
      callback();
    }
  };
}
```

**Behavior:**

- Returns `false` if `event.isComposing` is `true` (IME active)
- Checks in order: `event.code`, `event.key`, `event.keyCode`
- Valid values:
  - `code === 'Enter'`
  - `key === 'Enter'`
  - `keyCode === 13` (legacy browsers)
- SSR-safe: works with both React.KeyboardEvent and DOM KeyboardEvent

**Why IME Safety Matters:**

When users type Chinese, Japanese, or Korean text, they use an IME (Input Method Editor). The IME composition process triggers keyboard events that look like Enter presses but should be ignored:

```tsx
// Without IME check (WRONG):
function handleKeyDown(event: React.KeyboardEvent) {
  if (event.key === 'Enter') {
    // 🚨 Fires during IME composition!
    submit();
  }
}

// With IME check (CORRECT):
function handleKeyDown(event: React.KeyboardEvent) {
  if (isEnterKey(event)) {
    // ✅ Only fires for real Enter presses
    submit();
  }
}
```

**Best Practices:**

- Always use instead of direct `event.key === 'Enter'` checks
- Essential for international applications
- Test with Asian language input methods
- Combine with `event.preventDefault()` to prevent default behavior

---

### `isEscapeKey`

Detect Escape key presses with IME composition safety. Used for closing modals, canceling operations, and keyboard navigation.

**Signature:**

```tsx
function isEscapeKey(event: React.KeyboardEvent | KeyboardEvent): boolean;
```

**Examples:**

```tsx
// Basic usage
function handleKeyDown(event: React.KeyboardEvent) {
  if (isEscapeKey(event)) {
    event.preventDefault();
    closeModal();
  }
}

// In modal component
function Modal({ onClose }: ModalProps) {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (isEscapeKey(event)) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return <div role="dialog">...</div>;
}

// In dropdown
<div
  onKeyDown={(e) => {
    if (isEscapeKey(e)) {
      setIsOpen(false);
      returnFocusToTrigger();
    }
  }}
>
  {/* Dropdown content */}
</div>;

// Global escape handler
function useGlobalEscape(callback: () => void) {
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (isEscapeKey(event)) {
        callback();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [callback]);
}
```

**Behavior:**

- Returns `false` if `event.isComposing` is `true` (IME active)
- Checks in order: `event.code`, `event.key`, `event.keyCode`
- Valid values:
  - `code === 'Escape'`
  - `key === 'Escape'`
  - `key === 'Esc'` (older browsers)
  - `keyCode === 27` (legacy browsers)
- SSR-safe: works with both React.KeyboardEvent and DOM KeyboardEvent

**Common Use Cases:**

**1. Close Modals/Dialogs:**

```tsx
function Dialog({ isOpen, onClose }: DialogProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (isEscapeKey(e)) {
        e.preventDefault();
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  return isOpen ? <div role="dialog">...</div> : null;
}
```

**2. Cancel Edit Mode:**

```tsx
function EditableField() {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState('');
  const originalValue = useRef('');

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isEscapeKey(e)) {
      // Cancel and restore original value
      setValue(originalValue.current);
      setIsEditing(false);
    } else if (isEnterKey(e)) {
      // Save changes
      setIsEditing(false);
    }
  };

  return isEditing ? (
    <input value={value} onKeyDown={handleKeyDown} />
  ) : (
    <span onClick={() => setIsEditing(true)}>{value}</span>
  );
}
```

**3. Dismiss Notifications:**

```tsx
function Toast({ message, onDismiss }: ToastProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (isEscapeKey(e)) {
        onDismiss();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onDismiss]);

  return <div role="alert">{message}</div>;
}
```

**Best Practices:**

- Always use instead of direct `event.key === 'Escape'` checks
- Pair with `event.preventDefault()` to stop propagation
- Essential for WCAG 2.2 AA compliance (keyboard accessibility)
- Test with keyboard-only navigation
- Use for "cancel" or "close" operations

---

## IME Composition Explained

**What is IME?**

Input Method Editor (IME) is used for typing complex scripts like Chinese, Japanese, and Korean. During composition:

1. User types phonetic input (e.g., "nihao")
2. IME shows composition candidates (e.g., "你好")
3. User selects correct characters
4. Composition completes

**The Problem:**

During steps 1-3, keyboard events fire that look like real key presses but aren't:

```tsx
// User types "nihao" in Chinese IME:
// 1. n → keydown event (key: 'n', isComposing: true)
// 2. i → keydown event (key: 'i', isComposing: true)
// 3. Enter → Select candidate (key: 'Enter', isComposing: true)
// 4. Enter → Confirm (key: 'Enter', isComposing: false) ← ONLY THIS SHOULD TRIGGER
```

**The Solution:**

Check `event.isComposing`:

```tsx
function isEnterKey(event: React.KeyboardEvent | KeyboardEvent): boolean {
  // Ignore events during IME composition
  if (event.isComposing) return false;

  // Now safe to check for Enter
  return event.code === 'Enter' || event.key === 'Enter' || event.keyCode === 13;
}
```

**Testing IME Composition:**

1. Enable Chinese, Japanese, or Korean input method on your system
2. Focus an input field
3. Type phonetic text (e.g., "nihao" in Pinyin)
4. Press Enter to select IME candidate
5. Verify your handler doesn't fire during composition
6. Press Enter again to confirm
7. Verify handler fires only on final Enter

---

## Browser Compatibility

These utilities support:

- Modern browsers (`event.code`, `event.key`, `isComposing`)
- Legacy browsers (`event.keyCode` fallback)
- React synthetic events
- Native DOM events
- SSR environments

**Detection Priority:**

1. `event.code` (most reliable, layout-independent)
2. `event.key` (good, but layout-dependent)
3. `event.keyCode` (deprecated, but widest support)

---

## Common Patterns

### Combined Enter/Escape Handler

```tsx
function handleKeyDown(event: React.KeyboardEvent) {
  if (isEnterKey(event)) {
    event.preventDefault();
    handleSubmit();
  } else if (isEscapeKey(event)) {
    event.preventDefault();
    handleCancel();
  }
}

<form onKeyDown={handleKeyDown}>{/* form fields */}</form>;
```

### Modal Keyboard Trap

```tsx
function Modal({ isOpen, onClose, children }: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isEscapeKey(e)) {
        e.preventDefault();
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return isOpen ? (
    <div role="dialog" aria-modal="true">
      {children}
    </div>
  ) : null;
}
```

### Search Field

```tsx
function SearchField() {
  const [query, setQuery] = useState('');

  return (
    <input
      type="search"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      onKeyDown={(e) => {
        if (isEnterKey(e)) {
          e.preventDefault();
          performSearch(query);
        } else if (isEscapeKey(e)) {
          e.preventDefault();
          setQuery('');
        }
      }}
    />
  );
}
```

### Editable List Item

```tsx
function EditableListItem() {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState('Item');
  const originalValue = useRef('Item');

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isEnterKey(e)) {
      e.preventDefault();
      setIsEditing(false);
      // Save value
    } else if (isEscapeKey(e)) {
      e.preventDefault();
      setValue(originalValue.current);
      setIsEditing(false);
    }
  };

  return isEditing ? (
    <input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={handleKeyDown}
      onBlur={() => setIsEditing(false)}
    />
  ) : (
    <span
      onDoubleClick={() => {
        originalValue.current = value;
        setIsEditing(true);
      }}
    >
      {value}
    </span>
  );
}
```

---

## Related Documentation

- [Main Utils README](../README.md)
- [Accessibility Utilities](../a11y/README.md)
- [React Component Library](../../README.md)

---

## License

Copyright © 2026 DSAi. All rights reserved.
