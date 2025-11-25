# Button Component

A versatile, accessible button component using Bootstrap 5 native classes with DSAi design tokens.

## Features

- **17 variants**: primary, secondary, success, danger, warning, info, light, dark, outline-\*, link
- **3 sizes**: sm (small), md (medium), lg (large)
- **States**: default, hover, active, focus, disabled, loading
- **Icons**: Support for start and end icons
- **Loading**: Built-in spinner with customizable loading text
- **Full width**: Option to span full container width
- **Accessible**: WCAG 2.2 AA compliant

## Installation

```bash
pnpm add @dsai/react @dsai/tokens
```

## Usage

### Basic Usage

```tsx
import { Button } from '@dsai/react';
import '@dsai/tokens/css/bootstrap.css';

function App() {
  return (
    <Button variant="primary" onClick={() => console.log('clicked')}>
      Click me
    </Button>
  );
}
```

### Variants

```tsx
// Solid variants
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="success">Success</Button>
<Button variant="danger">Danger</Button>
<Button variant="warning">Warning</Button>
<Button variant="info">Info</Button>
<Button variant="light">Light</Button>
<Button variant="dark">Dark</Button>

// Outline variants
<Button variant="outline-primary">Outline Primary</Button>
<Button variant="outline-secondary">Outline Secondary</Button>
<Button variant="outline-success">Outline Success</Button>
<Button variant="outline-danger">Outline Danger</Button>

// Link variant
<Button variant="link">Link Button</Button>
```

### Sizes

```tsx
<Button size="sm">Small</Button>
<Button size="md">Medium (Default)</Button>
<Button size="lg">Large</Button>
```

### Loading State

```tsx
// Basic loading
<Button loading>Loading...</Button>

// Loading with custom text
<Button loading loadingText="Saving...">Save</Button>

// Practical example
function SaveButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    await saveData();
    setIsLoading(false);
  };

  return (
    <Button
      variant="success"
      loading={isLoading}
      loadingText="Saving..."
      onClick={handleSave}
    >
      Save Changes
    </Button>
  );
}
```

### Icons

```tsx
// Start icon
<Button startIcon={<SaveIcon />}>Save</Button>

// End icon
<Button endIcon={<ArrowRightIcon />}>Next</Button>

// Both icons
<Button startIcon={<CheckIcon />} endIcon={<ArrowRightIcon />}>
  Continue
</Button>

// Icon-only button (requires aria-label)
<Button aria-label="Close">×</Button>
```

### Full Width

```tsx
<Button fullWidth>Full Width Button</Button>
```

### Disabled State

```tsx
<Button disabled>Disabled Button</Button>
```

### Button Types (for forms)

```tsx
<form onSubmit={handleSubmit}>
  <Button type="submit" variant="success">
    Submit
  </Button>
  <Button type="reset" variant="secondary">
    Reset
  </Button>
</form>
```

### With Ref

```tsx
function FocusButton() {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const focusButton = () => {
    buttonRef.current?.focus();
  };

  return (
    <>
      <Button ref={buttonRef}>Focusable Button</Button>
      <button onClick={focusButton}>Focus the button</button>
    </>
  );
}
```

## Props

| Prop               | Type                              | Default     | Description                                                       |
| ------------------ | --------------------------------- | ----------- | ----------------------------------------------------------------- |
| `children`         | `ReactNode`                       | -           | Button content                                                    |
| `variant`          | `ButtonVariant`                   | `'primary'` | Visual style variant                                              |
| `size`             | `'sm' \| 'md' \| 'lg'`            | `'md'`      | Button size                                                       |
| `disabled`         | `boolean`                         | `false`     | Disabled state                                                    |
| `loading`          | `boolean`                         | `false`     | Loading state with spinner                                        |
| `loadingText`      | `string`                          | -           | Text to show while loading                                        |
| `startIcon`        | `ReactNode`                       | -           | Icon before text                                                  |
| `endIcon`          | `ReactNode`                       | -           | Icon after text                                                   |
| `fullWidth`        | `boolean`                         | `false`     | Full width button                                                 |
| `type`             | `'button' \| 'submit' \| 'reset'` | `'button'`  | HTML button type                                                  |
| `onClick`          | `(event) => void`                 | -           | Click handler                                                     |
| `className`        | `string`                          | -           | Additional CSS classes                                            |
| `style`            | `CSSProperties`                   | -           | Inline styles                                                     |
| `aria-label`       | `string`                          | -           | Accessible label                                                  |
| `aria-describedby` | `string`                          | -           | ID of describing element                                          |
| `aria-controls`    | `string`                          | -           | ID of controlled element                                          |
| `aria-expanded`    | `boolean`                         | -           | Expanded state                                                    |
| `aria-pressed`     | `boolean \| 'mixed'`              | -           | Pressed state for toggles                                         |
| `announceText`     | `string`                          | -           | Announcement text for screen readers (aria-live)                  |
| `announce`         | `boolean`                         | `true`\*    | Enable/disable announcements (\*default if announceText provided) |

## Accessibility

The Button component is built with accessibility in mind:

- **Semantic HTML**: Uses native `<button>` element
- **Keyboard navigation**: Supports Enter and Space keys
- **Focus management**: Visible focus ring for keyboard users
- **ARIA attributes**: Supports all relevant ARIA attributes
- **Color contrast**: Meets WCAG 2.2 AA contrast requirements (4.5:1)
- **Touch target**: Minimum 44×44px touch target size (WCAG 2.2 2.5.8)
- **Loading state**: Uses `aria-busy` and `aria-disabled` when loading
- **Reduced motion**: Respects `prefers-reduced-motion` preference
- **Decorative icons**: Icons are marked with `aria-hidden="true"` to prevent redundant screen reader announcements

### Decorative vs Semantic Icons

Icons rendered through `startIcon` and `endIcon` props are treated as **decorative** and automatically marked with `aria-hidden="true"`. This prevents screen readers from announcing them separately.

**Example:**

```tsx
// ✅ Good - Icon is marked aria-hidden automatically
<Button startIcon={<ArrowIcon />}>Continue</Button>
// Screen reader announces: "button Continue"

// ✅ Good - Icon with descriptive text
<Button startIcon={<SaveIcon />} aria-label="Save document">
  Save
</Button>
// Screen reader announces: "button Save document"
```

### Icon-only Buttons

When using icon-only buttons, always provide an `aria-label`:

```tsx
// ✅ Good
<Button aria-label="Close dialog">×</Button>

// ❌ Bad - no accessible label
<Button>×</Button>
```

### Toggle Buttons

For toggle buttons, use `aria-pressed`:

```tsx
<Button aria-pressed={isActive} onClick={() => setIsActive(!isActive)}>
  {isActive ? 'Active' : 'Inactive'}
</Button>
```

### Expandable Content

For buttons that control expandable content:

```tsx
<Button
  aria-expanded={isOpen}
  aria-controls="dropdown-menu"
  onClick={() => setIsOpen(!isOpen)}
>
  Menu ▼
</Button>
<div id="dropdown-menu" hidden={!isOpen}>
  {/* Menu content */}
</div>
```

### Dynamic State Announcements

For asynchronous operations (loading, saving, etc.), use the `announceText` prop to announce state changes to screen readers using `aria-live="polite"`:

```tsx
function SaveButton() {
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    setStatus('Saving changes...');

    try {
      await saveData();
      setStatus('Changes saved successfully');
      setIsLoading(false);
    } catch (error) {
      setStatus('Error: Failed to save changes');
      setIsLoading(false);
    }
  };

  return (
    <Button loading={isLoading} loadingText="Saving..." announceText={status} onClick={handleSave}>
      Save
    </Button>
  );
}
```

**Features:**

- `announceText` - Text to announce via `aria-live="polite"` (screen readers only, visually hidden)
- `announce` - Control whether announcements are enabled (defaults to true when `announceText` is provided)
- Hidden off-screen using sr-only technique (screen reader only)
- Does not interfere with visual UI

**Examples:**

```tsx
// Announce loading started
<Button announceText="Processing request..." loading>Submit</Button>

// Announce success
<Button announceText="Changes saved successfully">Save</Button>

// Announce error
<Button announceText="Error: Please try again">Retry</Button>

// Disable announcements if preferred
<Button announceText="Saving..." announce={false}>Save</Button>
```

## Bootstrap Classes

The Button component uses native Bootstrap 5 classes:

- `btn` - Base button class
- `btn-{variant}` - Variant classes (e.g., `btn-primary`, `btn-outline-secondary`)
- `btn-sm`, `btn-lg` - Size classes
- `w-100` - Full width utility

## Security

The Button component implements security best practices:

### Prop Spreading Restrictions

The component uses a **whitelist-based approach** for prop spreading. Only safe, non-interactive HTML attributes are allowed:

**Allowed attributes:**

- `data-testid`, `data-test` - Testing attributes
- `title` - Tooltip text
- `form`, `formAction`, `formMethod`, `formNoValidate`, `formTarget` - Form-related attributes

**Blocked attributes:**

- Event handlers (e.g., `onMouseOver`, `onClick`, etc.) - Must use explicit `onClick` prop
- Dangerous attributes - Any attribute not in the whitelist

**Example:**

```tsx
// ✅ Good - Event handler through explicit prop
<Button onClick={handleClick}>Click me</Button>

// ✅ Good - Safe HTML attributes
<Button data-testid="submit-btn" title="Submit form">
  Submit
</Button>

// ❌ Bad - Event handler not allowed through spread
// @ts-expect-error
<Button onMouseOver={maliciousHandler}>Unsafe</Button>
```

### Performance

The component uses `useMemo` to memoize class name construction, preventing unnecessary recalculations when props haven't changed. This improves performance in lists with many Button instances.

The Button component uses DSAi design tokens through the Bootstrap theme:

- Colors: `--bs-primary`, `--bs-secondary`, etc.
- Typography: `--bs-btn-font-family`, `--bs-btn-font-size`, `--bs-btn-font-weight`
- Spacing: `--bs-btn-padding-x`, `--bs-btn-padding-y`
- Border: `--bs-btn-border-radius`, `--bs-btn-border-width`
- Focus: `--bs-btn-focus-box-shadow`

## Related Components

- [Spinner](../Spinner/README.md) - Used for loading state
- [ButtonGroup](../ButtonGroup/README.md) - Group multiple buttons (coming soon)
