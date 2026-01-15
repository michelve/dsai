# Modal

A fully accessible modal dialog component using Bootstrap 5 native classes with portal rendering, focus management, scroll locking, and animations.

## Features

- **Portal Rendering**: Renders in `document.body` for proper z-index isolation
- **Focus Management**: Focus trap with Tab key cycling, initial focus, and focus restoration
- **Scroll Lock**: Prevents body scrolling when modal is open
- **Keyboard Navigation**: ESC key to close, full keyboard accessibility
- **Animations**: Fade in/out with configurable timing
- **Compound Components**: Modal.Header, Modal.Body, Modal.Footer, Modal.Title
- **Sizes**: sm, md (default), lg, xl, fullscreen
- **FSM State Management**: Predictable state transitions for animations

## Installation

The Modal component is part of the `@dsai-io/react` package:

```tsx
import { Modal, Button } from '@dsai-io/react';
```

## Usage

### Basic Modal

```tsx
import { useState } from 'react';
import { Modal, Button } from '@dsai-io/react';

function Example() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <Modal.Header>Modal Title</Modal.Header>
        <Modal.Body>
          <p>Modal content goes here.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
```

### Different Sizes

```tsx
// Small modal
<Modal isOpen={isOpen} onClose={handleClose} size="sm">
  <Modal.Header>Small Modal</Modal.Header>
  <Modal.Body>Content</Modal.Body>
</Modal>

// Large modal
<Modal isOpen={isOpen} onClose={handleClose} size="lg">
  <Modal.Header>Large Modal</Modal.Header>
  <Modal.Body>Content</Modal.Body>
</Modal>

// Extra large modal
<Modal isOpen={isOpen} onClose={handleClose} size="xl">
  <Modal.Header>Extra Large Modal</Modal.Header>
  <Modal.Body>Content</Modal.Body>
</Modal>

// Fullscreen modal
<Modal isOpen={isOpen} onClose={handleClose} size="fullscreen">
  <Modal.Header>Fullscreen Modal</Modal.Header>
  <Modal.Body>Content</Modal.Body>
</Modal>

// Fullscreen below breakpoint
<Modal isOpen={isOpen} onClose={handleClose} size="fullscreen" fullscreenBreakpoint="md-down">
  <Modal.Header>Fullscreen on Mobile</Modal.Header>
  <Modal.Body>Content</Modal.Body>
</Modal>
```

### Centered Modal

```tsx
<Modal isOpen={isOpen} onClose={handleClose} centered>
  <Modal.Header>Centered Modal</Modal.Header>
  <Modal.Body>This modal is vertically centered.</Modal.Body>
</Modal>
```

### Scrollable Modal

```tsx
<Modal isOpen={isOpen} onClose={handleClose} scrollable>
  <Modal.Header>Scrollable Modal</Modal.Header>
  <Modal.Body>
    <p>Long content that scrolls...</p>
    {/* More content */}
  </Modal.Body>
</Modal>
```

### Static Backdrop

```tsx
// Clicking backdrop won't close but will highlight the modal
<Modal isOpen={isOpen} onClose={handleClose} staticBackdrop>
  <Modal.Header>Static Backdrop</Modal.Header>
  <Modal.Body>Click backdrop to see the highlight effect.</Modal.Body>
</Modal>
```

### Without Animation

```tsx
<Modal isOpen={isOpen} onClose={handleClose} animated={false}>
  <Modal.Header>No Animation</Modal.Header>
  <Modal.Body>Instant open/close.</Modal.Body>
</Modal>
```

### Custom Initial Focus

```tsx
function CustomFocusModal() {
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} initialFocusRef={inputRef}>
      <Modal.Header>Form Modal</Modal.Header>
      <Modal.Body>
        <input ref={inputRef} type="text" placeholder="I get focused first" />
      </Modal.Body>
    </Modal>
  );
}
```

### Return Focus to Trigger

```tsx
function ReturnFocusModal() {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <Button ref={buttonRef} onClick={() => setIsOpen(true)}>
        Open Modal
      </Button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} returnFocusRef={buttonRef}>
        <Modal.Header>Modal</Modal.Header>
        <Modal.Body>Focus returns to the button when closed.</Modal.Body>
      </Modal>
    </>
  );
}
```

## Props

### Modal

| Prop                   | Type                                                                         | Default         | Description                                       |
| ---------------------- | ---------------------------------------------------------------------------- | --------------- | ------------------------------------------------- |
| `isOpen`               | `boolean`                                                                    | **Required**    | Whether the modal is open                         |
| `onClose`              | `() => void`                                                                 | **Required**    | Callback when modal should close                  |
| `size`                 | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'fullscreen'`                               | `'md'`          | Modal size                                        |
| `fullscreenBreakpoint` | `'always' \| 'sm-down' \| 'md-down' \| 'lg-down' \| 'xl-down' \| 'xxl-down'` | `'always'`      | Fullscreen breakpoint (when size is 'fullscreen') |
| `centered`             | `boolean`                                                                    | `false`         | Vertically center the modal                       |
| `scrollable`           | `boolean`                                                                    | `false`         | Enable scrollable body                            |
| `closeOnBackdropClick` | `boolean`                                                                    | `true`          | Close when clicking backdrop                      |
| `closeOnEscape`        | `boolean`                                                                    | `true`          | Close when pressing ESC                           |
| `backdrop`             | `boolean`                                                                    | `true`          | Show backdrop                                     |
| `staticBackdrop`       | `boolean`                                                                    | `false`         | Highlight on backdrop click instead of closing    |
| `titleId`              | `string`                                                                     | Auto-generated  | ID for aria-labelledby                            |
| `bodyId`               | `string`                                                                     | Auto-generated  | ID for aria-describedby                           |
| `container`            | `HTMLElement \| null`                                                        | `document.body` | Portal container                                  |
| `onOpened`             | `() => void`                                                                 | -               | Callback when fully opened                        |
| `onClosed`             | `() => void`                                                                 | -               | Callback when fully closed                        |
| `initialFocusRef`      | `RefObject<HTMLElement>`                                                     | -               | Element to focus on open                          |
| `returnFocusRef`       | `RefObject<HTMLElement>`                                                     | -               | Element to focus on close                         |
| `zIndex`               | `number`                                                                     | `1055`          | Modal z-index                                     |
| `animated`             | `boolean`                                                                    | `true`          | Enable animations                                 |
| `className`            | `string`                                                                     | -               | Additional CSS classes                            |
| `style`                | `CSSProperties`                                                              | -               | Inline styles                                     |
| `id`                   | `string`                                                                     | -               | HTML id attribute                                 |
| `data-testid`          | `string`                                                                     | -               | Test identifier                                   |
| `data-test`            | `string`                                                                     | -               | Test identifier                                   |

### Modal.Header

| Prop          | Type            | Default      | Description                       |
| ------------- | --------------- | ------------ | --------------------------------- |
| `children`    | `ReactNode`     | **Required** | Header content                    |
| `closeButton` | `boolean`       | `true`       | Show close button                 |
| `onClose`     | `() => void`    | From context | Close handler (overrides context) |
| `className`   | `string`        | -            | Additional CSS classes            |
| `style`       | `CSSProperties` | -            | Inline styles                     |
| `data-testid` | `string`        | -            | Test identifier                   |
| `data-test`   | `string`        | -            | Test identifier                   |

### Modal.Title

| Prop        | Type                                           | Default      | Description            |
| ----------- | ---------------------------------------------- | ------------ | ---------------------- |
| `children`  | `ReactNode`                                    | **Required** | Title content          |
| `as`        | `'h1' \| 'h2' \| 'h3' \| 'h4' \| 'h5' \| 'h6'` | `'h5'`       | Heading level          |
| `className` | `string`                                       | -            | Additional CSS classes |
| `id`        | `string`                                       | From context | ID for aria-labelledby |

### Modal.Body

| Prop          | Type            | Default      | Description            |
| ------------- | --------------- | ------------ | ---------------------- |
| `children`    | `ReactNode`     | **Required** | Body content           |
| `className`   | `string`        | -            | Additional CSS classes |
| `style`       | `CSSProperties` | -            | Inline styles          |
| `data-testid` | `string`        | -            | Test identifier        |
| `data-test`   | `string`        | -            | Test identifier        |

### Modal.Footer

| Prop          | Type            | Default      | Description                        |
| ------------- | --------------- | ------------ | ---------------------------------- |
| `children`    | `ReactNode`     | **Required** | Footer content (typically buttons) |
| `className`   | `string`        | -            | Additional CSS classes             |
| `style`       | `CSSProperties` | -            | Inline styles                      |
| `data-testid` | `string`        | -            | Test identifier                    |
| `data-test`   | `string`        | -            | Test identifier                    |

## Accessibility (WCAG 2.2 AA)

The Modal component is fully accessible:

### ARIA Attributes

- `role="dialog"` - Identifies the element as a dialog
- `aria-modal="true"` - Indicates that the dialog is modal
- `aria-labelledby` - Points to the modal title for screen readers
- `aria-describedby` - Points to the modal body for screen readers

### Focus Management

- **Focus Trap**: Tab key cycles within the modal
- **Initial Focus**: First focusable element receives focus (or custom via `initialFocusRef`)
- **Focus Restoration**: Focus returns to trigger element on close (or custom via `returnFocusRef`)

### Keyboard Support

| Key               | Action                                                         |
| ----------------- | -------------------------------------------------------------- |
| `Tab`             | Move focus to next focusable element (cycles within modal)     |
| `Shift + Tab`     | Move focus to previous focusable element (cycles within modal) |
| `Escape`          | Close the modal (when `closeOnEscape={true}`)                  |
| `Enter` / `Space` | Activate focused button                                        |

### Screen Reader Support

- Modal title is announced when opened
- Close button has `aria-label="Close"`
- Backdrop has `aria-hidden="true"` to hide from screen readers

### Scroll Lock

Body scroll is locked when modal is open to prevent background scrolling. Scrollbar width is preserved to prevent layout shift.

## Security

### Prop Whitelisting

The Modal component uses explicit prop whitelisting to prevent injection attacks:

- Only allowed HTML attributes are passed to DOM elements
- No unrestricted prop spreading (`{...props}`)
- All event handlers are explicitly defined

### Allowed Attributes

- `className`, `style`, `id`
- `data-testid`, `data-test`
- Explicit event handlers: `onClose`, `onOpened`, `onClosed`

### Portal Security

Modal renders in a portal (`document.body`) with proper z-index to prevent z-index manipulation attacks.

## Performance

### Memoization

- Subcomponents (Header, Body, Footer, Title) are memoized with `React.memo`
- Class name construction is memoized with `useMemo`
- Event handlers are memoized with `useCallback`

### FSM State Management

- Uses Finite State Machine for predictable state transitions
- Prevents invalid states during animations
- Exposes `data-visual-state` for styling/testing

### Bundle Size

Target: ≤3KB (minified + gzipped)

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Related Components

- [Button](../Button/README.md) - For modal actions
- [Alert](../Alert/README.md) - For inline messages within modals
- [Input](../Input/README.md) - For form inputs in modals

## Examples

See [Storybook](../../storybook/docs/components/Modal.stories.tsx) for interactive examples.
