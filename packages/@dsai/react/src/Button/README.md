# Button

A versatile, accessible button component with multiple variants, sizes, and states. Built with Bootstrap 5 design tokens and full WCAG 2.2 AA compliance.

## Features

✅ **Multiple Variants**: Primary, Secondary, Success, Danger, Warning, Info, Light, Dark, Outline variants, and Link  
✅ **Three Sizes**: Small (sm), Medium (md), Large (lg)  
✅ **Fully Accessible**: WCAG 2.2 AA compliant with keyboard navigation and ARIA support  
✅ **Design Tokens**: Uses `@dsai/tokens` for consistent theming  
✅ **TypeScript**: Fully typed with comprehensive JSDoc comments  
✅ **Ref Forwarding**: Supports React.forwardRef for direct DOM access  
✅ **CSS Modules**: Scoped styles with no global conflicts  
✅ **Test Coverage**: ≥90% coverage with unit and accessibility tests

## Installation

```bash
pnpm add @dsai/react
```

## Usage

### Basic Example

```tsx
import { Button } from '@dsai/react';

function App() {
  return <Button variant="primary">Click me</Button>;
}
```

### With Click Handler

```tsx
import { Button } from '@dsai/react';

function App() {
  const handleClick = () => {
    console.log('Button clicked!');
  };

  return (
    <Button variant="primary" onClick={handleClick}>
      Save Changes
    </Button>
  );
}
```

### Different Variants

```tsx
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="success">Success</Button>
<Button variant="danger">Danger</Button>
<Button variant="warning">Warning</Button>
<Button variant="info">Info</Button>
<Button variant="light">Light</Button>
<Button variant="dark">Dark</Button>
```

### Outline Variants

```tsx
<Button variant="outline-primary">Outline Primary</Button>
<Button variant="outline-secondary">Outline Secondary</Button>
<Button variant="outline-success">Outline Success</Button>
<Button variant="outline-danger">Outline Danger</Button>
```

### Link Variant

```tsx
<Button variant="link">Link Button</Button>
```

### Different Sizes

```tsx
<Button size="sm">Small</Button>
<Button size="md">Medium (Default)</Button>
<Button size="lg">Large</Button>
```

### Disabled State

```tsx
<Button disabled>Disabled Button</Button>
<Button variant="primary" disabled>Disabled Primary</Button>
```

### Full Width

```tsx
<Button fullWidth>Full Width Button</Button>
```

### With Icons

```tsx
<Button variant="primary">
  ✓ Save Changes
</Button>

<Button variant="secondary">
  Next →
</Button>

<Button variant="primary" aria-label="Close">
  ×
</Button>
```

### Form Buttons

```tsx
<form onSubmit={handleSubmit}>
  <Button type="submit" variant="success">
    Submit
  </Button>
  <Button type="reset" variant="secondary">
    Reset
  </Button>
  <Button type="button" variant="danger">
    Cancel
  </Button>
</form>
```

### With Ref

```tsx
import { useRef } from 'react';
import { Button } from '@dsai/react';

function App() {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const focusButton = () => {
    buttonRef.current?.focus();
  };

  return (
    <>
      <Button ref={buttonRef} variant="primary">
        Click me
      </Button>
      <Button onClick={focusButton}>Focus Button</Button>
    </>
  );
}
```

## Props

| Prop               | Type                              | Default      | Description            |
| ------------------ | --------------------------------- | ------------ | ---------------------- |
| `children`         | `ReactNode`                       | **required** | Button content         |
| `variant`          | `ButtonVariant`                   | `'primary'`  | Visual style variant   |
| `size`             | `'sm' \| 'md' \| 'lg'`            | `'md'`       | Button size            |
| `disabled`         | `boolean`                         | `false`      | Disabled state         |
| `onClick`          | `(event: MouseEvent) => void`     | -            | Click handler          |
| `type`             | `'button' \| 'submit' \| 'reset'` | `'button'`   | Button type            |
| `fullWidth`        | `boolean`                         | `false`      | Full width (100%)      |
| `className`        | `string`                          | -            | Additional CSS classes |
| `style`            | `CSSProperties`                   | -            | Inline styles          |
| `id`               | `string`                          | -            | Element ID             |
| `name`             | `string`                          | -            | Form field name        |
| `value`            | `string`                          | -            | Form field value       |
| `tabIndex`         | `number`                          | -            | Tab order              |
| `autoFocus`        | `boolean`                         | `false`      | Auto focus on mount    |
| `aria-label`       | `string`                          | -            | Accessible label       |
| `aria-describedby` | `string`                          | -            | Description reference  |
| `aria-controls`    | `string`                          | -            | Controlled element ID  |
| `aria-expanded`    | `boolean`                         | -            | Expanded state         |
| `aria-pressed`     | `boolean \| 'mixed'`              | -            | Pressed state          |

### Button Variants

- `primary` - Main call-to-action buttons
- `secondary` - Secondary actions
- `success` - Positive actions (e.g., Save, Confirm)
- `danger` - Destructive actions (e.g., Delete, Remove)
- `warning` - Actions requiring caution
- `info` - Informational actions
- `light` - Light background (use on dark backgrounds)
- `dark` - Dark background
- `outline-*` - Outline versions of above variants
- `link` - Styled as a link

## Accessibility

This component follows **WCAG 2.2 AA** guidelines:

### Keyboard Navigation

- ✅ **Enter** or **Space** activates the button
- ✅ **Tab** moves focus to/from the button
- ✅ Visible focus indicator (2px outline with offset)

### Screen Readers

- ✅ Uses semantic `<button>` element
- ✅ Supports `aria-label` for non-descriptive content
- ✅ Supports `aria-describedby` for additional context
- ✅ Supports `aria-controls`, `aria-expanded`, `aria-pressed` for interactive widgets
- ✅ `aria-disabled` attribute when disabled

### Visual Accessibility

- ✅ **Color Contrast**: All variants meet 4.5:1 contrast ratio for normal text
- ✅ **Large Text**: Exceeds 3:1 contrast ratio for large text
- ✅ **Focus Visible** (WCAG 2.2 2.4.7): Clear focus indicators
- ✅ **Focus Not Obscured** (WCAG 2.2 2.4.11, 2.4.12): Focus ring with offset prevents obscuring
- ✅ **Touch Target Size** (WCAG 2.2 2.5.8): Minimum 44×44px target area
- ✅ **Consistent Help** (WCAG 2.2 3.2.6): Disabled state clearly indicated

### Testing

```tsx
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { Button } from '@dsai/react';

test('button is accessible', async () => {
  const { container } = render(<Button>Accessible</Button>);
  const results = await axe(container);

  expect(results).toHaveNoViolations();
});
```

## Design Tokens

The Button component uses design tokens from `@dsai/tokens`:

### Colors

- `--dsai-theme-primary` - Primary variant background
- `--dsai-theme-secondary` - Secondary variant background
- `--dsai-theme-success` - Success variant background
- `--dsai-theme-danger` - Danger variant background
- `--dsai-theme-warning` - Warning variant background
- `--dsai-theme-info` - Info variant background
- `--dsai-theme-light` - Light variant background
- `--dsai-theme-dark` - Dark variant background
- `--dsai-neutral-white` - Text color on dark backgrounds
- `--dsai-neutral-black` - Text color on light backgrounds

### Typography

- `--dsai-typography-font-family-base` - Font family
- `--dsai-typography-font-size-base` - Base font size (16px)
- `--dsai-typography-font-size-sm` - Small font size (14px)
- `--dsai-typography-font-size-lg` - Large font size (20px)

### Spacing

- `--dsai-spacing-1` - 0.25rem (4px)
- `--dsai-spacing-2` - 0.5rem (8px)
- `--dsai-spacing-3` - 1rem (16px)
- `--dsai-spacing-4` - 1.5rem (24px)

### Borders

- `--dsai-border-radius-md` - Medium border radius (0.5rem)
- `--dsai-border-color-default` - Default border color

## Styling

### Custom Styles

```tsx
<Button variant="primary" className="my-custom-class" style={{ marginTop: '1rem' }}>
  Custom Styled Button
</Button>
```

### CSS Modules

The component uses CSS Modules for styling. All styles are scoped to avoid conflicts.

```css
/* Your component styles */
.container {
  /* Button will inherit these styles if placed inside */
}
```

## Examples

### Call-to-Action

```tsx
<Button variant="primary" size="lg">
  Get Started
</Button>
```

### Form Actions

```tsx
<div style={{ display: 'flex', gap: '0.5rem' }}>
  <Button type="submit" variant="success">
    Save
  </Button>
  <Button type="button" variant="secondary">
    Cancel
  </Button>
</div>
```

### Destructive Action

```tsx
<Button variant="danger" onClick={handleDelete}>
  Delete Account
</Button>
```

### Toggle Button

```tsx
const [pressed, setPressed] = useState(false);

<Button variant="outline-primary" aria-pressed={pressed} onClick={() => setPressed(!pressed)}>
  {pressed ? 'On' : 'Off'}
</Button>;
```

### Dropdown Trigger

```tsx
const [expanded, setExpanded] = useState(false);

<Button
  variant="secondary"
  aria-expanded={expanded}
  aria-controls="dropdown-menu"
  onClick={() => setExpanded(!expanded)}
>
  Menu {expanded ? '▲' : '▼'}
</Button>;
```

## Testing

The Button component includes comprehensive tests:

```bash
# Run tests
pnpm test Button

# Run tests with coverage
pnpm test:coverage Button

# Run accessibility tests
pnpm test:a11y Button
```

## Related Components

- **IconButton** - Button with icon support (coming soon)
- **ButtonGroup** - Group multiple buttons together (coming soon)
- **Link** - Text link component (coming soon)

## Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## License

UNLICENSED - Private and copyrighted software

## Contributing

This is a private package. For internal contributions, please follow the project's contributing guidelines.
