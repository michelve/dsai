# Popover

A fully accessible popover component for displaying rich interactive content. Uses Floating UI for intelligent positioning and supports various triggers.

## Features

- **Multiple trigger types**: Click, hover, focus, or combinations
- **Smart positioning**: Auto-flips when near viewport edges
- **Rich content**: Supports headers, custom content, and interactive elements
- **Focus trap**: Optional focus trapping for modal-like behavior
- **Controlled and uncontrolled modes**: Flexible state management
- **FSM-based state management**: Predictable visibility transitions
- **WCAG 2.2 AA compliant**: Full keyboard and screen reader support

## Installation

```tsx
import { Popover } from '@dsai-io/react';
```

## Basic Usage

```tsx
<Popover header="Popover Title" content="And here is some amazing content.">
  <Button>Click to toggle</Button>
</Popover>
```

## Props

### PopoverProps

| Prop                  | Type                                 | Default     | Description                       |
| --------------------- | ------------------------------------ | ----------- | --------------------------------- |
| `children`            | `ReactElement`                       | Required    | Trigger element                   |
| `content`             | `ReactNode`                          | Required    | Popover body content              |
| `header`              | `ReactNode`                          | `undefined` | Optional header content           |
| `placement`           | `PopoverPlacement`                   | `'top'`     | Preferred placement position      |
| `trigger`             | `PopoverTrigger \| PopoverTrigger[]` | `'click'`   | How to trigger the popover        |
| `arrow`               | `boolean`                            | `true`      | Show arrow pointer                |
| `offset`              | `number`                             | `8`         | Distance from trigger in pixels   |
| `showDelay`           | `number`                             | `0`         | Delay before showing (ms)         |
| `hideDelay`           | `number`                             | `0`         | Delay before hiding (ms)          |
| `disabled`            | `boolean`                            | `false`     | Disable the popover               |
| `trapFocus`           | `boolean`                            | `false`     | Trap focus within popover         |
| `showCloseButton`     | `boolean`                            | `false`     | Show close button in header       |
| `closeOnOutsideClick` | `boolean`                            | `true`      | Close when clicking outside       |
| `closeOnEscape`       | `boolean`                            | `true`      | Close on Escape key               |
| `isOpen`              | `boolean`                            | `undefined` | Controlled open state             |
| `defaultOpen`         | `boolean`                            | `false`     | Initial open state (uncontrolled) |
| `onOpenChange`        | `(open: boolean) => void`            | `undefined` | Callback when open state changes  |
| `maxWidth`            | `number \| string`                   | `276`       | Maximum popover width             |
| `className`           | `string`                             | `undefined` | Additional CSS classes            |
| `id`                  | `string`                             | Auto        | Popover element ID                |
| `aria-label`          | `string`                             | `undefined` | Accessible label                  |
| `aria-labelledby`     | `string`                             | `undefined` | ID of labelling element           |

### PopoverPlacement

```ts
type PopoverPlacement =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'left-start'
  | 'left-end'
  | 'right'
  | 'right-start'
  | 'right-end';
```

### PopoverTrigger

```ts
type PopoverTrigger = 'click' | 'hover' | 'focus';
```

## Examples

### With Header and Close Button

```tsx
<Popover header="Dismissible Popover" content="Click the X to close." showCloseButton>
  <Button>Open Popover</Button>
</Popover>
```

### Hover Trigger with Delays

```tsx
<Popover
  header="Hover Popover"
  content="Appears on hover with delays."
  trigger="hover"
  showDelay={200}
  hideDelay={100}
>
  <Button>Hover Me</Button>
</Popover>
```

### Multiple Triggers

```tsx
<Popover
  header="Multi-Trigger"
  content="Opens on hover, focus, or click."
  trigger={['hover', 'focus', 'click']}
>
  <Button>Hover, Focus, or Click</Button>
</Popover>
```

### Rich Interactive Content

```tsx
<Popover
  header="Quick Settings"
  content={
    <div>
      <select>
        <option>Option 1</option>
        <option>Option 2</option>
      </select>
      <Button variant="primary" size="sm">
        Save
      </Button>
    </div>
  }
  trapFocus
  showCloseButton
>
  <Button>Open Settings</Button>
</Popover>
```

### Controlled Mode

```tsx
function ControlledPopover() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open</Button>
      <Button onClick={() => setIsOpen(false)}>Close</Button>

      <Popover
        header="Controlled"
        content="Controlled by external state."
        isOpen={isOpen}
        onOpenChange={setIsOpen}
      >
        <Button>Target</Button>
      </Popover>
    </>
  );
}
```

### All Placements

```tsx
const placements = [
  'top',
  'top-start',
  'top-end',
  'bottom',
  'bottom-start',
  'bottom-end',
  'left',
  'left-start',
  'left-end',
  'right',
  'right-start',
  'right-end',
];

{
  placements.map((placement) => (
    <Popover
      key={placement}
      header={placement}
      content={`Placed at ${placement}`}
      placement={placement}
    >
      <Button>{placement}</Button>
    </Popover>
  ));
}
```

### Focus Trigger (Accessibility)

```tsx
<Popover header="Focus Triggered" content="Shows when you Tab to the button." trigger="focus">
  <Button>Focus Me</Button>
</Popover>
```

### Focus Trap for Forms

```tsx
<Popover
  header="Enter Email"
  content={
    <form>
      <input type="email" placeholder="Email" />
      <Button type="submit">Subscribe</Button>
    </form>
  }
  trapFocus
  showCloseButton
>
  <Button>Subscribe</Button>
</Popover>
```

## Accessibility

### Keyboard Navigation

| Key        | Action                                    |
| ---------- | ----------------------------------------- |
| `Enter`    | Activate trigger (click)                  |
| `Space`    | Activate trigger (click)                  |
| `Tab`      | Focus trigger / navigate popover          |
| `Escape`   | Close popover                             |
| Arrow keys | Navigate within popover (with focus trap) |

### Screen Reader Support

- Uses `role="dialog"` for the popover container
- `aria-haspopup="dialog"` on trigger element
- `aria-expanded` reflects open state
- `aria-describedby` links trigger to popover content
- Focus is managed appropriately on open/close
- Optional `aria-label` or `aria-labelledby` for popover identification

### WCAG 2.2 AA Compliance

- **1.3.1 Info and Relationships**: Proper semantic structure
- **1.4.3 Contrast**: Inherits Bootstrap's accessible color contrast
- **2.1.1 Keyboard**: Fully keyboard accessible
- **2.1.2 No Keyboard Trap**: Focus trap is optional and escapable
- **2.4.3 Focus Order**: Logical focus management
- **4.1.2 Name, Role, Value**: Proper ARIA attributes

## FSM State Management

The Popover uses a finite state machine for predictable visibility transitions:

### States

| State     | Description                       |
| --------- | --------------------------------- |
| `closed`  | Popover is hidden                 |
| `opening` | Transition to visible (animation) |
| `open`    | Popover is visible                |
| `closing` | Transition to hidden (animation)  |

### Events

| Event    | Description                     |
| -------- | ------------------------------- |
| `OPEN`   | Request to show the popover     |
| `CLOSE`  | Request to hide the popover     |
| `OPENED` | Animation complete, now visible |
| `CLOSED` | Animation complete, now hidden  |

### State Diagram

```text
closed → opening → open → closing → closed
           ↑                   ↓
           └───────────────────┘
```

## Comparison with Tooltip

| Feature         | Popover           | Tooltip     |
| --------------- | ----------------- | ----------- |
| Content         | Rich, interactive | Simple text |
| Header          | Yes               | No          |
| Focus trap      | Yes (optional)    | No          |
| Default trigger | Click             | Hover/Focus |
| Close button    | Yes (optional)    | No          |
| Role            | `dialog`          | `tooltip`   |
| Interactive     | Yes               | No          |

## Browser Support

- Chrome 88+
- Firefox 78+
- Safari 14+
- Edge 88+

## Dependencies

- `@floating-ui/react` for positioning logic
- Bootstrap 5 CSS for styling
