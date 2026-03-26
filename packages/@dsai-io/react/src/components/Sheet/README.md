# Sheet Component

An accessible slide-out panel component for navigation, forms, and secondary content. Built on Bootstrap 5's Offcanvas foundation with enhanced accessibility features and a Finite State Machine (FSM) for predictable state management.

## Features

- **4 Placement Options**: `left`, `right`, `top`, `bottom`
- **Multiple Sizes**: `sm`, `md`, `lg`, `xl`, `full`, `auto`
- **Surface Variants**: `default`, `elevated`, `inverse`, `transparent`
- **Modal & Non-Modal Modes**: With or without backdrop
- **FSM-Driven State**: Predictable open/close lifecycle
- **Reduced Motion Support**: Respects `prefers-reduced-motion`
- **Full Accessibility**: WCAG 2.2 AA compliant

## Installation

```tsx
import { Sheet } from '@dsai-io/react';
```

## Basic Usage

```tsx
import { useState } from 'react';
import { Sheet, Button } from '@dsai-io/react';

function Example() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Sheet</Button>

      <Sheet isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <Sheet.Header>Settings</Sheet.Header>
        <Sheet.Body>
          <p>Sheet content goes here.</p>
        </Sheet.Body>
        <Sheet.Footer>
          <Button variant="secondary" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button variant="primary">Save</Button>
        </Sheet.Footer>
      </Sheet>
    </>
  );
}
```

## Placement Options

```tsx
// Right side (default) - typical drawer/sidebar
<Sheet isOpen={isOpen} onClose={onClose} placement="right">
  ...
</Sheet>

// Left side - navigation drawer
<Sheet isOpen={isOpen} onClose={onClose} placement="left">
  ...
</Sheet>

// Bottom - mobile action sheet
<Sheet isOpen={isOpen} onClose={onClose} placement="bottom">
  ...
</Sheet>

// Top - notification panel
<Sheet isOpen={isOpen} onClose={onClose} placement="top">
  ...
</Sheet>
```

## Size Variants

```tsx
// Small (320px)
<Sheet size="sm" ...>

// Medium (400px) - default
<Sheet size="md" ...>

// Large (540px)
<Sheet size="lg" ...>

// Extra Large (720px)
<Sheet size="xl" ...>

// Full viewport width/height
<Sheet size="full" ...>

// Auto-size to content
<Sheet size="auto" ...>

// Custom dimension
<Sheet width="500px" ...>  // For left/right placement
<Sheet height="50vh" ...>  // For top/bottom placement
```

## Surface Variants

```tsx
// Default surface
<Sheet surface="default" ...>

// Elevated (shadow emphasis)
<Sheet surface="elevated" ...>

// Inverse (dark theme)
<Sheet surface="inverse" ...>

// Transparent (glass effect)
<Sheet surface="transparent" ...>
```

## Modal vs Non-Modal Mode

```tsx
// Modal mode (default) - with backdrop, blocks interaction
<Sheet mode="modal" isOpen={isOpen} onClose={onClose}>
  ...
</Sheet>

// Non-modal mode - no backdrop, can interact with background
<Sheet mode="non-modal" isOpen={isOpen} onClose={onClose}>
  ...
</Sheet>
```

## Backdrop Options

```tsx
// No backdrop
<Sheet backdrop={false} ...>

// Static backdrop (doesn't close on click, shows visual feedback)
<Sheet staticBackdrop ...>

// Disable close on backdrop click
<Sheet closeOnBackdropClick={false} ...>
```

## Keyboard Behavior

```tsx
// Disable ESC key to close
<Sheet closeOnEscape={false} ...>
```

## Focus Management

```tsx
import { useRef } from 'react';

function Example() {
  const nameInputRef = useRef(null);
  const triggerRef = useRef(null);

  return (
    <>
      <Button ref={triggerRef} onClick={() => setIsOpen(true)}>
        Open Form
      </Button>

      <Sheet
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        initialFocusRef={nameInputRef} // Focus this on open
        returnFocusRef={triggerRef} // Return focus here on close
      >
        <Sheet.Header>Edit Profile</Sheet.Header>
        <Sheet.Body>
          <input ref={nameInputRef} type="text" placeholder="Name" />
        </Sheet.Body>
      </Sheet>
    </>
  );
}
```

## Lifecycle Callbacks

```tsx
<Sheet
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  onOpened={() => console.log('Sheet fully opened')}
  onClosed={() => console.log('Sheet fully closed')}
>
  ...
</Sheet>
```

## Animation Control

```tsx
// Disable animations
<Sheet animated={false} ...>

// Note: Animations are automatically disabled when user has
// prefers-reduced-motion enabled in their OS settings
```

## Z-Index Control

```tsx
// Custom z-index (default: 1055)
<Sheet zIndex={2000} ...>
```

## Compound Components

### Sheet.Header

```tsx
<Sheet.Header
  closeButton={true} // Show close button (default: true)
  onClose={handleClose} // Custom close handler (inherits from Sheet)
>
  Title
</Sheet.Header>
```

### Sheet.Title

```tsx
<Sheet.Header>
  <Sheet.Title as="h4">Custom Heading Level</Sheet.Title>
</Sheet.Header>
```

### Sheet.Body

Scrollable content area:

```tsx
<Sheet.Body className="p-4">
  <LongContent />
</Sheet.Body>
```

### Sheet.Footer

Action buttons area:

```tsx
<Sheet.Footer>
  <Button variant="secondary">Cancel</Button>
  <Button variant="primary">Save</Button>
</Sheet.Footer>
```

## Accessibility

The Sheet component is fully accessible (WCAG 2.2 AA compliant):

| Feature             | Implementation                               |
| ------------------- | -------------------------------------------- |
| `role="dialog"`     | Applied to sheet container                   |
| `aria-modal="true"` | Applied in modal mode                        |
| `aria-labelledby`   | Points to `Sheet.Header` title               |
| `aria-describedby`  | Points to `Sheet.Body` content               |
| Focus Trap          | Tab cycles within sheet only                 |
| Focus on Open       | First focusable element or `initialFocusRef` |
| Focus on Close      | Returns to trigger or `returnFocusRef`       |
| ESC Key             | Closes sheet (when `closeOnEscape` is true)  |
| Scroll Lock         | Background scroll disabled in modal mode     |
| Reduced Motion      | Respects `prefers-reduced-motion`            |

## State Machine (FSM)

The Sheet uses an FSM for predictable state management:

```text
closed → opening → open → closing → closed
```

### States

| State     | Description     | DOM          | Focus       | Scroll Lock |
| --------- | --------------- | ------------ | ----------- | ----------- |
| `closed`  | Not visible     | Not rendered | None        | No          |
| `opening` | Enter animation | Rendered     | Not trapped | Yes         |
| `open`    | Fully visible   | Rendered     | Trapped     | Yes         |
| `closing` | Exit animation  | Rendered     | Released    | Yes         |

### Data Attributes

```tsx
// Current visual state available via data attribute
<div data-visual-state="opening | open | closing | closed" />
```

## Props Reference

| Prop                   | Type                                                    | Default         | Description                      |
| ---------------------- | ------------------------------------------------------- | --------------- | -------------------------------- |
| `isOpen`               | `boolean`                                               | required        | Controls sheet visibility        |
| `onClose`              | `() => void`                                            | required        | Called when sheet should close   |
| `placement`            | `'left' \| 'right' \| 'top' \| 'bottom'`                | `'right'`       | Slide-in direction               |
| `size`                 | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'full' \| 'auto'`      | `'md'`          | Sheet size                       |
| `surface`              | `'default' \| 'elevated' \| 'inverse' \| 'transparent'` | `'default'`     | Visual variant                   |
| `mode`                 | `'modal' \| 'non-modal'`                                | `'modal'`       | Overlay behavior                 |
| `backdrop`             | `boolean`                                               | `true`          | Show backdrop (modal only)       |
| `staticBackdrop`       | `boolean`                                               | `false`         | Backdrop doesn't close on click  |
| `closeOnBackdropClick` | `boolean`                                               | `true`          | Close on backdrop click          |
| `closeOnEscape`        | `boolean`                                               | `true`          | Close on ESC key                 |
| `animated`             | `boolean`                                               | `true`          | Enable animations                |
| `zIndex`               | `number`                                                | `1055`          | Z-index value                    |
| `width`                | `string \| number`                                      | —               | Custom width (left/right)        |
| `height`               | `string \| number`                                      | —               | Custom height (top/bottom)       |
| `container`            | `HTMLElement \| null`                                   | `document.body` | Portal container                 |
| `initialFocusRef`      | `RefObject<HTMLElement>`                                | —               | Element to focus on open         |
| `returnFocusRef`       | `RefObject<HTMLElement>`                                | —               | Element to focus on close        |
| `titleId`              | `string`                                                | auto            | ID for aria-labelledby           |
| `bodyId`               | `string`                                                | auto            | ID for aria-describedby          |
| `onOpened`             | `() => void`                                            | —               | Called when open animation ends  |
| `onClosed`             | `() => void`                                            | —               | Called when close animation ends |
| `scrollable`           | `boolean`                                               | `true`          | Accepted for API compat (body scrolls natively) |

### Sheet.Header Props

| Prop          | Type         | Default     | Description                        |
| ------------- | ------------ | ----------- | ---------------------------------- |
| `children`    | `ReactNode`  | required    | Header content (string auto-wraps in heading) |
| `closeButton` | `boolean`    | `true`      | Show close button                  |
| `onClose`     | `() => void` | from Sheet  | Custom close handler               |
| `className`   | `string`     | `''`        | Additional CSS classes             |

### Sheet.Title Props

| Prop        | Type                                     | Default | Description              |
| ----------- | ---------------------------------------- | ------- | ------------------------ |
| `children`  | `ReactNode`                              | required | Title content           |
| `as`        | `'h1' \| 'h2' \| 'h3' \| 'h4' \| 'h5' \| 'h6'` | `'h5'` | Heading level  |
| `className` | `string`                                 | `''`    | Additional CSS classes   |
| `id`        | `string`                                 | auto    | ID for aria-labelledby   |

### Sheet.Body Props

| Prop        | Type        | Default  | Description            |
| ----------- | ----------- | -------- | ---------------------- |
| `children`  | `ReactNode` | required | Body content           |
| `className` | `string`    | `''`     | Additional CSS classes |

### Sheet.Footer Props

| Prop        | Type        | Default  | Description            |
| ----------- | ----------- | -------- | ---------------------- |
| `children`  | `ReactNode` | required | Footer content         |
| `className` | `string`    | `''`     | Additional CSS classes |

> **Note:** Sheet.Footer does not consume SheetContext. This is intentional — the footer is a purely presentational container and can be rendered independently if needed.

## When to Use

| Use Case               | Component                           |
| ---------------------- | ----------------------------------- |
| Navigation drawer      | Sheet (left placement)              |
| Settings/filters panel | Sheet (right placement)             |
| Mobile action sheet    | Sheet (bottom placement)            |
| Confirmation/alert     | Modal                               |
| Form in overlay        | Either (depends on complexity)      |
| Persistent sidebar     | Non-modal Sheet or layout component |

## CSS Classes

The Sheet uses Bootstrap 5's Offcanvas classes:

- `.offcanvas` - Main container
- `.offcanvas-start` - Left placement
- `.offcanvas-end` - Right placement
- `.offcanvas-top` - Top placement
- `.offcanvas-bottom` - Bottom placement
- `.offcanvas-header` - Header section
- `.offcanvas-title` - Title element
- `.offcanvas-body` - Body section (scrollable)
- `.offcanvas-footer` - Footer section (custom extension)
- `.offcanvas-backdrop` - Backdrop overlay
- `.show`, `.showing`, `.hiding` - Animation states

### Customizing with CSS Variables

```scss
// Override Bootstrap's Offcanvas CSS variables
.offcanvas {
  --bs-offcanvas-width: 400px;
  --bs-offcanvas-height: 30vh;
  --bs-offcanvas-bg: var(--bs-body-bg);
  --bs-offcanvas-border-color: var(--bs-border-color-translucent);
}
```

## Browser Support

- Chrome/Edge 88+
- Firefox 78+
- Safari 14+
- Respects `prefers-reduced-motion` media query
