# Tooltip

A fully accessible tooltip component for displaying contextual information on hover, focus, or click. Uses Floating UI for intelligent positioning with auto-flip behavior at viewport edges.

## Features

- **Multiple trigger types**: Hover, focus, click, or any combination
- **Smart positioning**: Auto-flips when near viewport edges
- **Arrow pointer**: Optional arrow pointing to trigger element
- **Configurable delays**: Show and hide delays for better UX
- **Controlled and uncontrolled modes**: Full state control when needed
- **Portal rendering**: Renders outside parent DOM for proper stacking
- **Keyboard accessible**: Visible on focus, ESC to dismiss
- **Polished visuals**: Built-in fade/scale transitions and themable arrow surface

## Installation

```tsx
import { Tooltip } from '@dsai/react';
```

## Basic Usage

```tsx
<Tooltip content="Helpful information">
  <button>Hover me</button>
</Tooltip>
```

## Props

| Prop           | Type                                 | Default              | Description                                                   |
| -------------- | ------------------------------------ | -------------------- | ------------------------------------------------------------- |
| `children`     | `ReactElement`                       | Required             | The trigger element                                           |
| `content`      | `ReactNode`                          | Required             | Tooltip content to display                                    |
| `placement`    | `TooltipPlacement`                   | `'top'`              | Position relative to trigger                                  |
| `trigger`      | `TooltipTrigger \| TooltipTrigger[]` | `['hover', 'focus']` | How to trigger visibility                                     |
| `showDelay`    | `number`                             | `0`                  | Delay before showing (ms)                                     |
| `hideDelay`    | `number`                             | `0`                  | Delay before hiding (ms)                                      |
| `arrow`        | `boolean`                            | `true`               | Show arrow pointer                                            |
| `offset`       | `number`                             | `8`                  | Distance from trigger (px)                                    |
| `maxWidth`     | `number \| string`                   | `undefined`          | Max width for text wrapping                                   |
| `isOpen`       | `boolean`                            | `undefined`          | Controlled open state                                         |
| `onOpenChange` | `(isOpen: boolean) => void`          | `undefined`          | Open state change callback                                    |
| `defaultOpen`  | `boolean`                            | `false`              | Initial open state                                            |
| `disabled`     | `boolean`                            | `false`              | Disable tooltip                                               |
| `portal`       | `boolean`                            | `true`               | Render in portal                                              |
| `container`    | `HTMLElement`                        | `document.body`      | Portal container                                              |
| `aria-label`   | `string`                             | `undefined`          | Accessible label for screen readers when `content` is complex |

### Placement Values

- `'top'`, `'top-start'`, `'top-end'`
- `'bottom'`, `'bottom-start'`, `'bottom-end'`
- `'left'`, `'left-start'`, `'left-end'`
- `'right'`, `'right-start'`, `'right-end'`

### Trigger Values

- `'hover'` - Show on mouse hover
- `'focus'` - Show on keyboard focus
- `'click'` - Toggle on click

## Examples

### Different Placements

```tsx
<Tooltip content="Top tooltip" placement="top">
  <button>Top</button>
</Tooltip>

<Tooltip content="Right tooltip" placement="right">
  <button>Right</button>
</Tooltip>

<Tooltip content="Bottom tooltip" placement="bottom">
  <button>Bottom</button>
</Tooltip>

<Tooltip content="Left tooltip" placement="left">
  <button>Left</button>
</Tooltip>
```

### Multiple Triggers

```tsx
<Tooltip content="Hover or focus" trigger={['hover', 'focus']}>
  <button>Interact</button>
</Tooltip>
```

### Click Trigger

```tsx
<Tooltip content="Click to toggle" trigger="click">
  <button>Click me</button>
</Tooltip>
```

### With Delay

```tsx
<Tooltip content="Delayed tooltip" showDelay={500} hideDelay={200}>
  <button>Hover me</button>
</Tooltip>
```

### Without Arrow

```tsx
<Tooltip content="No arrow" arrow={false}>
  <button>Hover me</button>
</Tooltip>
```

### Long Content

```tsx
<Tooltip content="This is a longer tooltip with wrapped text" maxWidth={200}>
  <button>Hover me</button>
</Tooltip>
```

### Rich Content

```tsx
<Tooltip
  content={
    <div>
      <strong>Title</strong>
      <p>Detailed description</p>
    </div>
  }
>
  <button>Hover me</button>
</Tooltip>
```

### Controlled Mode

```tsx
function ControlledTooltip() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(!isOpen)}>Toggle</button>
      <Tooltip content="Controlled tooltip" isOpen={isOpen} onOpenChange={setIsOpen}>
        <button>Target</button>
      </Tooltip>
    </>
  );
}
```

### On Form Fields

```tsx
<label htmlFor="email">Email</label>
<Tooltip content="We'll never share your email" trigger="focus">
  <input type="email" id="email" />
</Tooltip>
```

## Accessibility

### WCAG 2.2 AA Compliance

The Tooltip component is fully accessible:

- **role="tooltip"**: Tooltip content has proper role
- **aria-describedby**: Links trigger to tooltip for screen readers
- **Keyboard focus**: Tooltip visible when trigger receives focus
- **ESC dismissal**: Click-triggered tooltips can be closed with ESC
- **Focus management**: Proper focus handling during interactions

### Screen Reader Behavior

When the tooltip is visible:

1. The trigger element receives `aria-describedby` pointing to the tooltip
2. Screen readers announce the tooltip content as a description
3. The tooltip content is accessible via `role="tooltip"`

### Keyboard Navigation

| Key    | Action                                                            |
| ------ | ----------------------------------------------------------------- |
| Tab    | Focus trigger element (shows tooltip if trigger includes 'focus') |
| Escape | Dismiss click-triggered tooltip                                   |

### Example with aria-label

For complex tooltip content, use `aria-label`:

```tsx
<Tooltip content={<ComplexContent />} aria-label="Simple text description for screen readers">
  <button>Trigger</button>
</Tooltip>
```

## State Management

The Tooltip uses a finite state machine (FSM) for visibility management:

### States

- `closed` - Tooltip hidden, not in DOM
- `opening` - Tooltip mounting, animation starting
- `open` - Tooltip fully visible
- `closing` - Tooltip unmounting, animation ending

### Visual States

The `data-visual-state` attribute reflects the current state:

- `hidden` - Tooltip is closed
- `showing` - Tooltip is opening
- `visible` - Tooltip is open
- `hiding` - Tooltip is closing

```css
/* Custom animation example */
[data-visual-state='showing'] {
  animation: tooltip-enter 0.15s ease-out;
}

[data-visual-state='hiding'] {
  animation: tooltip-exit 0.15s ease-in;
}
```

## Security

### Prop Whitelisting

Only safe HTML attributes are accepted:

- `className`, `style`, `id`
- `data-testid`, `data-test`
- `aria-label`

### No XSS Vulnerabilities

- Content is rendered safely via React
- No `dangerouslySetInnerHTML` usage
- Event handlers are explicitly defined

## Performance

### Optimizations

- Memoized class name and style computations
- Portal rendering prevents layout thrashing
- Animation transitions use CSS transforms for GPU acceleration
- Component renders only when visible (via FSM `shouldRender`)
- RequestAnimationFrame-based measurements prevent the tooltip from flashing at `(0, 0)` before positioning completes

### Bundle Size

- Tooltip component: ~3 KB (minified + gzipped)
- Includes Floating UI for positioning

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Related Components

- [Popover](./Popover.md) - For interactive content with more complex layouts
- [Dropdown](./Dropdown.md) - For menus and selectable options

## Styling the Arrow and Visual States

The tooltip arrow now renders with the dedicated `.dsai-tooltip-arrow` class so you can synchronize its color with custom surfaces:

```css
.custom-tooltip.tooltip .tooltip-inner {
  background: #1b1d3a;
  color: #f8f9ff;
}

.custom-tooltip .dsai-tooltip-arrow {
  fill: #1b1d3a;
}
```

You can also hook into the `data-visual-state` attribute to align bespoke animations with the Tooltip FSM transitions (150ms by default):

```css
.custom-tooltip[data-visual-state='showing'] {
  animation: tooltip-pop-in 150ms ease-out;
}

.custom-tooltip[data-visual-state='hiding'] {
  animation: tooltip-pop-out 150ms ease-in;
}
```
