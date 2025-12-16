# Accessibility Utilities

Enterprise-grade accessibility utilities for building WCAG 2.2 AA compliant interfaces.

## Overview

This module provides utilities for:

- Screen reader announcements
- ARIA attribute management
- Focus management and trapping
- ID generation
- Animation duration calculations
- Keyboard navigation

## Installation

```tsx
import {
  announceToScreenReader,
  buildAriaLabel,
  combineAriaDescriptions,
  generateId,
  trapFocus,
  focusableSelectors,
} from '@dsai/react';
```

---

## Functions

### `announceToScreenReader`

Send messages to screen readers via ARIA live regions. Creates an offscreen element with `aria-live` that announces messages to assistive technology.

**Signature:**

```tsx
function announceToScreenReader(message: string, options?: AnnounceOptions): () => void;
```

**Options:**

```tsx
interface AnnounceOptions {
  politeness?: 'polite' | 'assertive'; // Default: 'polite'
  assertive?: boolean; // Alias for politeness: 'assertive'
  id?: string; // Default: 'dsai-live-region'
  timeoutMs?: number; // Default: 2000
}
```

**Examples:**

```tsx
// Polite announcement (default) - waits for pause in speech
const cleanup = announceToScreenReader('Item saved successfully');

// Assertive announcement - interrupts current speech
const cleanup = announceToScreenReader('Critical error occurred', {
  assertive: true,
});

// Custom timeout
const cleanup = announceToScreenReader('Processing...', {
  timeoutMs: 5000,
});

// Multiple live regions
announceToScreenReader('Status update', { id: 'status-region' });
announceToScreenReader('Error message', { id: 'error-region' });

// Manual cleanup
const cleanup = announceToScreenReader('Message');
cleanup(); // Clear immediately
```

**Behavior:**

- Creates a visually hidden `div` element in document.body
- Updates `aria-live`, `role`, and `aria-atomic` attributes
- Clears message after timeout
- Reuses existing live region with same ID
- SSR-safe (returns no-op function if document undefined)

**Best Practices:**

- Use `polite` for status updates and success messages
- Use `assertive` for critical errors and urgent alerts
- Keep messages concise and clear
- Avoid rapid-fire announcements (they may be skipped)

---

### `buildAriaLabel`

Build comprehensive ARIA label attributes from multiple sources. Combines label text, labelledby references, and describedby references into proper ARIA attributes.

**Signature:**

```tsx
function buildAriaLabel(options: BuildAriaLabelOptions): {
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
};
```

**Options:**

```tsx
interface BuildAriaLabelOptions {
  label?: string; // Plain text label
  labelledBy?: string | string[]; // ID reference(s)
  describedBy?: string | string[]; // Description ID reference(s)
  description?: string; // Description text (for reference only)
}
```

**Examples:**

```tsx
// Basic label
buildAriaLabel({ label: 'Submit form' });
// => { 'aria-label': 'Submit form' }

// Label by reference (preferred when visible label exists)
buildAriaLabel({ labelledBy: 'form-title' });
// => { 'aria-labelledby': 'form-title' }

// Multiple labelledby IDs
buildAriaLabel({ labelledBy: ['title', 'subtitle'] });
// => { 'aria-labelledby': 'title subtitle' }

// With description reference
buildAriaLabel({
  labelledBy: 'dialog-title',
  describedBy: ['dialog-desc', 'dialog-help'],
});
// => {
//   'aria-labelledby': 'dialog-title',
//   'aria-describedby': 'dialog-desc dialog-help'
// }

// Priority: labelledBy takes precedence over label
buildAriaLabel({
  label: 'Fallback',
  labelledBy: 'visible-label',
});
// => { 'aria-labelledby': 'visible-label' }

// Spread into element
<div {...buildAriaLabel({ label: 'Content' })} />;
```

**Best Practices:**

- Prefer `labelledBy` when a visible label exists
- Use `label` for icon-only buttons or hidden labels
- Always provide either `label` or `labelledBy`
- Use `describedBy` for additional context, not primary labels
- IDs are automatically sanitized (trimmed, filtered)

---

### `combineAriaDescriptions`

Merge multiple `aria-describedby` ID references into a single space-separated string. Handles deduplication and sanitization.

**Signature:**

```tsx
function combineAriaDescriptions(
  ...ids: Array<string | readonly string[] | null | undefined>
): string;
```

**Examples:**

```tsx
// Single ID
combineAriaDescriptions('help-text');
// => 'help-text'

// Multiple IDs
combineAriaDescriptions('help-text', 'error-message');
// => 'help-text error-message'

// Array input
combineAriaDescriptions(['help-text', 'error-message'], 'warning');
// => 'help-text error-message warning'

// Remove duplicates
combineAriaDescriptions('help-text', 'help-text', 'error');
// => 'help-text error'

// Filter nullish and empty values
combineAriaDescriptions('id1', '', null, undefined, 'id2');
// => 'id1 id2'

// Use in components
const describedBy = combineAriaDescriptions(helperTextId, error && errorId, additionalDescriptions);
<input aria-describedby={describedBy} />;
```

**Best Practices:**

- Use to combine helper text, error messages, and hints
- Preserves order of IDs
- Safe to pass conditional values (null/undefined filtered)
- Returns empty string if no valid IDs

---

### `generateId`

SSR-safe, deterministic ID generator with prefix support. Uses incrementing counter for consistent IDs across server and client renders.

**Signature:**

```tsx
function generateId(prefix?: string): string;
```

**Examples:**

```tsx
// Basic usage
const inputId = generateId('input'); // => 'input-1'
const buttonId = generateId('button'); // => 'button-2'
const labelId = generateId(); // => 'id-3'

// In components
function FormField() {
  const fieldId = generateId('field');
  const helperId = generateId('helper');

  return (
    <>
      <label htmlFor={fieldId}>Name</label>
      <input id={fieldId} aria-describedby={helperId} />
      <span id={helperId}>Enter your full name</span>
    </>
  );
}
```

**Behavior:**

- Increments global counter for each call
- Format: `${prefix}-${counter}`
- Default prefix: `'id'`
- Deterministic: same sequence on server and client
- SSR-safe: no random IDs or timestamps

**Best Practices:**

- Use descriptive prefixes (`'input'`, `'button'`, `'modal'`)
- Generate IDs at component initialization, not in render
- For React 18+, prefer `useId()` hook in components
- Use this for non-React contexts or utility functions

---

### `focusableSelectors`

CSS selectors for identifying focusable elements. Used for focus management and keyboard navigation.

**Signature:**

```tsx
const focusableSelectors: string[];
const focusableSelectorString: string;
```

**Examples:**

```tsx
import { focusableSelectors, focusableSelectorString } from '@dsai/react';

// Array of selectors
console.log(focusableSelectors);
// => ['a[href]', 'button:not([disabled])', 'input:not([disabled])', ...]

// Query all focusable elements
const allFocusable = container.querySelectorAll(focusableSelectorString);

// Find first focusable element
const firstFocusable = container.querySelector(focusableSelectorString);

// Check if element is focusable
const isFocusable = element.matches(focusableSelectorString);

// Custom focus management
function focusFirstElement(container: HTMLElement) {
  const firstFocusable = container.querySelector<HTMLElement>(focusableSelectorString);
  firstFocusable?.focus();
}
```

**Included Selectors:**

- `a[href]`
- `button:not([disabled])`
- `input:not([disabled])`
- `select:not([disabled])`
- `textarea:not([disabled])`
- `[tabindex]:not([tabindex="-1"])`
- `audio[controls]`
- `video[controls]`
- `[contenteditable]`
- `details > summary`

**Best Practices:**

- Use for focus trapping in modals/dialogs
- Use for keyboard navigation implementations
- Excludes `tabindex="-1"` (programmatically focusable only)
- Respects `disabled` attribute

---

### `trapFocus`

Trap focus within a container element. Prevents Tab/Shift+Tab from escaping and cycles focus within bounds.

**Signature:**

```tsx
function trapFocus(container: HTMLElement, options?: TrapFocusOptions): () => void;
```

**Options:**

```tsx
interface TrapFocusOptions {
  initialFocus?: HTMLElement | null; // Element to focus initially
  returnFocus?: HTMLElement | null; // Element to restore focus to
  fallbackFocus?: HTMLElement | null; // Fallback if no focusable elements
}
```

**Examples:**

```tsx
// Basic focus trap
const cleanup = trapFocus(modalElement);

// With initial focus
const cleanup = trapFocus(modalElement, {
  initialFocus: modalElement.querySelector('input'),
});

// With return focus (restore focus on cleanup)
const triggerButton = document.activeElement as HTMLElement;
const cleanup = trapFocus(modalElement, {
  initialFocus: modalElement.querySelector('[role="dialog"]'),
  returnFocus: triggerButton,
});

// Complete modal example
function showModal() {
  const modal = document.getElementById('modal');
  const trigger = document.activeElement as HTMLElement;

  modal.style.display = 'block';

  const cleanup = trapFocus(modal, {
    initialFocus: modal.querySelector('.modal-close-button'),
    returnFocus: trigger,
  });

  return () => {
    cleanup();
    modal.style.display = 'none';
  };
}
```

**Behavior:**

- Finds all focusable elements using `focusableSelectorString`
- Cycles Tab key: last → first element
- Cycles Shift+Tab: first → last element
- Sets initial focus if specified
- Restores focus on cleanup if specified
- Adds keyboard event listeners to container

**Best Practices:**

- Always call cleanup function when closing modal/dialog
- Set `returnFocus` to preserve user's position
- Set `initialFocus` for optimal UX (usually close button or first input)
- Use with modal/dialog/drawer/popover components
- Pair with `inert` attribute on background content

---

### `getAnimationDuration`

Get animation duration based on user preferences and settings. Respects `prefers-reduced-motion` and provides standard duration scales.

**Signature:**

```tsx
function getAnimationDuration(duration?: 'fast' | 'normal' | 'slow' | number): number;

// Duration helpers
function getFastDuration(): number; // 150ms
function getNormalDuration(): number; // 300ms
function getSlowDuration(): number; // 500ms
function getStandardDuration(): number; // 300ms (alias)
```

**Constants:**

```tsx
const ANIMATION_DURATION = {
  fast: 150,
  normal: 300,
  slow: 500,
} as const;
```

**Examples:**

```tsx
// Basic usage
const duration = getAnimationDuration('normal'); // 300ms

// Respects reduced motion preference
const duration = getAnimationDuration('slow');
// => 0ms if user prefers reduced motion
// => 500ms otherwise

// Custom duration
const duration = getAnimationDuration(450); // 450ms

// Duration helpers
const fast = getFastDuration(); // 150ms
const normal = getNormalDuration(); // 300ms
const slow = getSlowDuration(); // 500ms

// In animations
<motion.div
  animate={{ opacity: 1 }}
  transition={{ duration: getAnimationDuration('fast') / 1000 }}
/>;

// In CSS
element.style.transitionDuration = `${getAnimationDuration('normal')}ms`;
```

**Best Practices:**

- Always respect `prefers-reduced-motion`
- Use semantic names (`'fast'`, `'normal'`, `'slow'`)
- Default to `'normal'` (300ms) for most animations
- Use `'fast'` (150ms) for micro-interactions
- Use `'slow'` (500ms) for large element transitions

---

### `shouldAnimate`

Check if animations should be enabled based on user preferences.

**Signature:**

```tsx
function shouldAnimate(): boolean;

function onAnimationPreferenceChange(callback: (shouldAnimate: boolean) => void): () => void;
```

**Examples:**

```tsx
// Check if animations enabled
if (shouldAnimate()) {
  element.classList.add('animate');
}

// Listen for preference changes
const cleanup = onAnimationPreferenceChange((enabled) => {
  console.log('Animations enabled:', enabled);
  updateAnimationSettings(enabled);
});

// Conditional rendering
function Component() {
  const [animate, setAnimate] = useState(shouldAnimate);

  useEffect(() => {
    return onAnimationPreferenceChange(setAnimate);
  }, []);

  return animate ? <AnimatedView /> : <StaticView />;
}
```

**Best Practices:**

- Check before running animations
- Listen for runtime preference changes
- Provide static alternatives when disabled
- Test with reduced motion enabled

---

## Related Documentation

- [Main Utils README](../README.md)
- [React Component Library](../../README.md)
- [WCAG 2.2 Guidelines](https://www.w3.org/WAI/WCAG22/quickref/)

---

## License

Copyright © 2026 DSAi. All rights reserved.
