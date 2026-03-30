# Button Component

A versatile, accessible button component using Bootstrap 5 native classes with DSAi design tokens, powered by a deterministic Finite State Machine (FSM) for robust visual state management.

## Features

- FSM Architecture: Deterministic visual state management with clear state transitions
- 26+ variants: solid, outline-\*, subtle-\*, ghost, link
- 4 sizes: sm, md (default), lg, icon (square)
- Visual States: idle, hovered, focused, pressed, disabled, loading, error
- Icons: Support for start and end icons
- Loading: Built-in spinner with configurable position (start/center/end) and custom indicator
- Error State: `error` prop for error feedback
- Ghost variant: Transparent background with FSM-driven hover feedback
- Subtle variants: Lighter backgrounds using Bootstrap subtle utilities
- Full width: Option to span full container width
- WCAG 2.2 AA compliant
- Fully backward compatible

## Installation

Add the Button component to your project using the DSAi CLI:

```bash
dsai add button
```

This copies the component source files into your project and automatically resolves all dependencies.

> **First time?** Install the CLI and generate your design tokens first:
>
> ```bash
> pnpm add @dsai-io/tools
> npx dsai tokens build
> ```

## FSM Architecture

The Button component uses a **Finite State Machine (FSM)** for deterministic visual state management:

### Visual States

- **Interactive States**: `idle`, `hovered`, `focused`, `pressed`
- **Override States**: `disabled`, `loading`, `error`
- **State Priority**: `disabled` > `loading` > `error` > interactive states

### State Transitions

The FSM responds to user interactions and prop changes:

| Event     | Trigger                       | Result                                                  |
| --------- | ----------------------------- | ------------------------------------------------------- |
| `HOVER`   | Mouse enters button           | Transitions to `hovered` state                          |
| `BLUR`    | Mouse leaves / loses focus    | Transitions to `idle` (or error/disabled if applicable) |
| `FOCUS`   | Focus received                | Transitions to `focused` state                          |
| `PRESS`   | Left mouse button down        | Transitions to `pressed` state                          |
| `RELEASE` | Mouse button released         | Transitions based on hover/focus                        |
| `DISABLE` | `disabled` prop becomes true  | Forces `disabled` state                                 |
| `ENABLE`  | `disabled` prop becomes false | Clears `disabled` override                              |
| `LOADING` | `loading` prop becomes true   | Forces `loading` state                                  |
| `ERROR`   | `error` prop becomes true     | Forces `error` state                                    |

### Data Attribute

The FSM state is exposed via `data-visual-state` attribute for CSS targeting and testing:

```tsx
// In tests
expect(button).toHaveAttribute('data-visual-state', 'pressed');

// In CSS
button[data-visual-state="pressed"] {
  transform: scale(0.98);
}
```

## Usage

### Basic Usage

```tsx
import { Button } from '@dsai-io/react';
// Import the generated theme CSS from your local project
import './generated/dsai-theme-bs.css';

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

// Ghost variant (transparent, subtle hover)
<Button variant="ghost">Ghost Button</Button>

// Subtle variants (lighter backgrounds)
<Button variant="subtle-primary">Subtle Primary</Button>
<Button variant="subtle-danger">Subtle Danger</Button>

// Link variant
<Button variant="link">Link Button</Button>
```

### Sizes

```tsx
<Button size="sm">Small</Button>
<Button size="md">Medium (Default)</Button>
<Button size="lg">Large</Button>

// Icon size (square, for icon-only buttons)
<Button size="icon" aria-label="Settings" startIcon={<GearIcon />}>{''}</Button>
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

### Loading Position

```tsx
// Start (default)
<Button loading loadingPosition="start">Saving...</Button>

// End
<Button loading loadingPosition="end">Saving...</Button>

// Center (hides text, overlays spinner)
<Button loading loadingPosition="center">Save</Button>
```

### Custom Loading Indicator

```tsx
<Button loading loadingIndicator={<DotsIcon className="animate-pulse" />}>
  Processing
</Button>
```

### Error State

```tsx
// Basic error
<Button error onClick={handleRetry}>Failed - Retry?</Button>

// Error with custom variant
<Button variant="danger" error onClick={handleRetry}>
  Error occurred
</Button>

// Practical example with error recovery
function SubmitButton() {
  const [state, setState] = useState('idle'); // 'idle' | 'loading' | 'error'

  const handleSubmit = async () => {
    setState('loading');
    try {
      await submitForm();
      setState('idle');
    } catch (error) {
      setState('error');
    }
  };

  return (
    <Button
      loading={state === 'loading'}
      error={state === 'error'}
      onClick={handleSubmit}
    >
      {state === 'loading' && 'Submitting...'}
      {state === 'error' && 'Failed - Try again'}
      {state === 'idle' && 'Submit'}
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

| Prop               | Type                                | Default     | Description                                                       |
| ------------------ | ----------------------------------- | ----------- | ----------------------------------------------------------------- |
| `children`         | `ReactNode`                         | -           | Button content                                                    |
| `variant`          | `ButtonVariant`                     | `'primary'` | Visual style variant (solid, outline-\*, subtle-\*, ghost, link)  |
| `size`             | `'sm' \| 'md' \| 'lg' \| 'icon'`   | `'md'`      | Button size (`icon` = square 2.5rem)                              |
| `disabled`         | `boolean`                           | `false`     | Disabled state                                                    |
| `loading`          | `boolean`                           | `false`     | Loading state with spinner                                        |
| `error`            | `boolean`                           | `false`     | Error state - visual feedback for failed operations               |
| `loadingText`      | `string`                            | -           | Text to show while loading                                        |
| `loadingPosition`  | `'start' \| 'center' \| 'end'`     | `'start'`   | Position of the loading spinner                                   |
| `loadingIndicator` | `ReactNode`                         | -           | Custom loading indicator (replaces default Spinner)               |
| `startIcon`        | `ReactNode`                         | -           | Icon before text                                                  |
| `endIcon`          | `ReactNode`                         | -           | Icon after text                                                   |
| `fullWidth`        | `boolean`                           | `false`     | Full width button                                                 |
| `type`             | `'button' \| 'submit' \| 'reset'`   | `'button'`  | HTML button type                                                  |
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

## Testing FSM States

The Button component exposes FSM states via `data-visual-state` attribute for testing:

```tsx
import { render, fireEvent } from '@testing-library/react';

describe('Button FSM States', () => {
  it('transitions through FSM states on user interaction', () => {
    const { container } = render(<Button>Click me</Button>);
    const button = container.querySelector('button');

    // Initial state
    expect(button).toHaveAttribute('data-visual-state', 'idle');

    // Mouse hover
    fireEvent.mouseEnter(button);
    expect(button).toHaveAttribute('data-visual-state', 'hovered');

    // Mouse leave
    fireEvent.mouseLeave(button);
    expect(button).toHaveAttribute('data-visual-state', 'idle');

    // Focus
    fireEvent.focus(button);
    expect(button).toHaveAttribute('data-visual-state', 'focused');

    // Mouse press
    fireEvent.mouseDown(button, { button: 0 });
    expect(button).toHaveAttribute('data-visual-state', 'pressed');

    // Mouse release
    fireEvent.mouseUp(button);
    expect(button).toHaveAttribute('data-visual-state', 'hovered');
  });

  it('respects error state priority', () => {
    const { container } = render(<Button error>Error</Button>);
    const button = container.querySelector('button');

    // Error state is maintained even with hover/focus
    fireEvent.mouseEnter(button);
    fireEvent.focus(button);
    expect(button).toHaveAttribute('data-visual-state', 'error');
  });

  it('respects disabled state priority', () => {
    const { container } = render(<Button disabled>Disabled</Button>);
    const button = container.querySelector('button');

    // Disabled state overrides all other states
    fireEvent.mouseEnter(button);
    fireEvent.focus(button);
    expect(button).toHaveAttribute('data-visual-state', 'disabled');
    expect(button).toBeDisabled();
  });
});
```

For comprehensive test coverage, see:

- `Button.test.tsx` - Core unit tests (103 tests): rendering, props, variants, sizes, states, interactions, ghost, subtle, icon size, loading position, custom indicator
- `Button.a11y.test.tsx` - Accessibility tests (24 tests): ARIA attributes, WCAG compliance, keyboard navigation, icon-only guards
- `Button.fsm.test.ts` - FSM reducer unit tests (36 tests): state transitions, event handling, priority rules
- `Button.integration.test.tsx` - Integration tests (6 tests): FSM + component interaction, state visualization
- `Button.stories.tsx` - Storybook interactive documentation

> **Total: 169 tests across 4 test files**

## Test Coverage

The Button component has comprehensive test coverage organized into specialized test files:

### Test File Structure

| File                          | Purpose                                             | Test Count |
| ----------------------------- | --------------------------------------------------- | ---------- |
| `Button.test.tsx`             | Core functionality, props, variants, new features   | 103        |
| `Button.a11y.test.tsx`        | WCAG 2.2 AA compliance, ARIA, keyboard a11y         | 24         |
| `Button.fsm.test.ts`          | FSM reducer unit tests, state transitions           | 36         |
| `Button.integration.test.tsx` | FSM + component integration, visual states          | 6          |
| **Total**                     |                                                     | **169**    |

### Accessibility Test Categories

The `Button.a11y.test.tsx` file covers:

1. **ARIA Attributes** - aria-label, aria-describedby, aria-controls, aria-expanded, aria-pressed
2. **WCAG Compliance** - axe-core automated testing for all variants and states
3. **Keyboard Interactions** - Enter/Space key handling, tab navigation, disabled focus prevention
4. **Icon-only Accessibility Guards** - Tests that verify icon-only buttons require accessible names

### Running Tests

```bash
# Run all Button tests
pnpm test -- --testPathPattern="Button"

# Run only accessibility tests
pnpm test -- --testPathPattern="Button.a11y"

# Run only FSM unit tests
pnpm test -- --testPathPattern="Button.fsm"

# Run with coverage
pnpm test -- --testPathPattern="Button" --coverage
```

## Related Components

- [Spinner](../Spinner/README.md) - Used for loading state
- [ButtonGroup](../ButtonGroup/README.md) - Group multiple buttons (coming soon)
