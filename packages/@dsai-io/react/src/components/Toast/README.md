# Toast

Accessible toast/notification component with queue management, auto-dismiss, and positioning support.

## Overview

The Toast component provides a way to display brief, non-blocking notifications to users. It supports multiple variants (success, error, warning, info), auto-dismiss functionality, and can be managed via a context provider and hook.

## Features

- ✅ WCAG 2.2 AA compliant with proper ARIA attributes
- ✅ Multiple variants with semantic coloring and icons
- ✅ Auto-dismiss with configurable duration
- ✅ Progress bar visualization
- ✅ Queue management with ToastProvider
- ✅ Flexible positioning (6 positions)
- ✅ Portal rendering for proper stacking
- ✅ FSM-based visibility state management
- ✅ Smooth enter/exit animations
- ✅ XSS-safe content rendering
- ✅ Pause on hover — timer resumes with remaining time on mouse leave
- ✅ Pause on focus loss — timer pauses when browser tab is hidden
- ✅ Promise toasts — auto-transitions loading → success/error on resolution
- ✅ Keyboard hotkey (F8) to focus the notification region
- ✅ `prefers-reduced-motion` support — disables animations automatically
- ✅ CSS custom properties for theming

## Installation

Add the Toast component to your project using the DSAi CLI:

```bash
dsai add toast
```

This copies the component source files into your project and automatically resolves all dependencies.

> **First time?** Install the CLI and generate your design tokens first:
>
> ```bash
> pnpm add @dsai-io/tools
> npx dsai tokens build
> ```

## Basic Usage

### Standalone Toast

```tsx
import { Toast } from '@dsai-io/react';

function Example() {
  const [show, setShow] = useState(true);

  return (
    <Toast
      show={show}
      message="Your file has been saved."
      variant="success"
      onClose={() => setShow(false)}
    />
  );
}
```

### With ToastProvider (Recommended)

```tsx
import { ToastProvider, useToast } from '@dsai-io/react';

// Wrap your app
function App() {
  return (
    <ToastProvider position="top-end">
      <MyComponent />
    </ToastProvider>
  );
}

// Use the hook anywhere in the tree
function MyComponent() {
  const toast = useToast();

  const handleSave = async () => {
    try {
      await saveData();
      toast.success('Data saved successfully!');
    } catch (error) {
      toast.error('Failed to save data.');
    }
  };

  return <button onClick={handleSave}>Save</button>;
}
```

## Components

### Toast

The main toast component.

#### Props

| Prop                | Type                                                       | Default                | Description                                  |
| ------------------- | ---------------------------------------------------------- | ---------------------- | -------------------------------------------- |
| `message`           | `React.ReactNode`                                          | —                      | The toast message content (required)         |
| `title`             | `string`                                                   | —                      | Optional title above the message             |
| `variant`           | `'default' \| 'success' \| 'error' \| 'warning' \| 'info'` | `'default'`            | Visual variant with appropriate styling      |
| `show`              | `boolean`                                                  | `true`                 | Whether the toast is visible                 |
| `duration`          | `number \| false`                                          | `5000`                 | Auto-dismiss after ms, or `false` to disable |
| `dismissible`       | `boolean`                                                  | `true`                 | Whether to show close button                 |
| `showProgress`      | `boolean`                                                  | `false`                | Show countdown progress bar                  |
| `icon`              | `React.ReactNode`                                          | —                      | Custom icon (variant icons shown by default) |
| `closeButtonLabel`  | `string`                                                   | `'Close notification'` | Accessible label for close button            |
| `animationDuration` | `number`                                                   | `150`                  | Animation duration in ms                     |
| `pauseOnHover`      | `boolean`                                                  | `false`                | Pause auto-dismiss timer on mouse enter; resumes with remaining time on leave |
| `pauseOnFocusLoss`  | `boolean`                                                  | `false`                | Pause auto-dismiss timer when browser tab is hidden; resumes when tab is visible again |
| `onOpen`            | `() => void`                                               | —                      | Called when toast becomes visible            |
| `onClose`           | `() => void`                                               | —                      | Called when toast is dismissed               |

### ToastContainer

Positioned container for grouping toasts.

#### Props

| Prop       | Type              | Default     | Description              |
| ---------- | ----------------- | ----------- | ------------------------ |
| `position` | `ToastPosition`   | `'top-end'` | Container position       |
| `gap`      | `number`          | `12`        | Gap between toasts in px |
| `children` | `React.ReactNode` | —           | Toast components         |

#### Positions

- `'top-start'` - Top left
- `'top-center'` - Top center
- `'top-end'` - Top right
- `'middle-start'` - Middle left
- `'middle-center'` - Middle center
- `'middle-end'` - Middle right
- `'bottom-start'` - Bottom left
- `'bottom-center'` - Bottom center
- `'bottom-end'` - Bottom right

### ToastProvider

Context provider for managing toasts via the `useToast` hook.

#### Props

| Prop              | Type              | Default     | Description                   |
| ----------------- | ----------------- | ----------- | ----------------------------- |
| `position`        | `ToastPosition`   | `'top-end'` | Default position for toasts   |
| `maxToasts`       | `number`          | `5`         | Maximum simultaneous toasts   |
| `defaultDuration` | `number`          | `5000`      | Default auto-dismiss duration |
| `pauseOnHover`    | `boolean`         | `true`      | Pause auto-dismiss timer on mouse enter for all toasts |
| `pauseOnFocusLoss`| `boolean`         | `true`      | Pause auto-dismiss timer when browser tab is hidden for all toasts |
| `hotkey`          | `string`          | `'F8'`      | Keyboard key that focuses the toast notification region when toasts are visible |
| `children`        | `React.ReactNode` | —           | Application tree              |

### useToast Hook

Access toast functionality from any component within the provider.

```tsx
const toast = useToast();

// Available methods
toast.success('Success message');
toast.error('Error message');
toast.warning('Warning message');
toast.info('Info message');
toast.toast('Default message'); // Uses default variant

// With options
toast.success('File saved', {
  title: 'Success',
  duration: 3000,
  dismissible: false,
});

// Update an existing toast
const id = toast.success('Uploading...');
toast.update(id, { message: 'Upload complete!' });

// Dismiss toasts
toast.dismiss(id);
toast.dismissAll();

// Access current toasts
console.log(toast.toasts);

// Promise toast — shows loading immediately, auto-transitions on resolution
toast.promise(saveData(), {
  loading: 'Saving...',
  success: 'Saved successfully!',
  error: 'Failed to save.',
});

// success/error can also be functions receiving the resolved/rejected value
toast.promise(fetchUser(id), {
  loading: 'Loading user...',
  success: (user) => `Welcome, ${user.name}!`,
  error: (err) => `Error: ${err.message}`,
});
```

## Examples

### With Title

```tsx
<Toast title="Success" message="Your changes have been saved successfully." variant="success" />
```

### Error Notification

```tsx
<Toast variant="error" message="Unable to connect to the server. Please try again." />
```

### Persistent Toast (No Auto-dismiss)

```tsx
<Toast message="This notification won't disappear automatically." duration={false} variant="info" />
```

### With Progress Bar

```tsx
<Toast message="Processing your request..." duration={5000} showProgress variant="info" />
```

### Custom Icon

```tsx
<Toast message="New message received" icon={<MailIcon />} />
```

### Positioned Toast Container

```tsx
<ToastContainer position="bottom-center">
  <Toast message="First notification" variant="success" />
  <Toast message="Second notification" variant="info" />
</ToastContainer>
```

### Complete Integration Example

```tsx
import { ToastProvider, useToast, Button } from '@dsai-io/react';

function App() {
  return (
    <ToastProvider position="top-end" maxToasts={3}>
      <Dashboard />
    </ToastProvider>
  );
}

function Dashboard() {
  const toast = useToast();

  const handleFormSubmit = async (data) => {
    const loadingId = toast.info('Saving...', { duration: false });

    try {
      await api.submit(data);
      toast.dismiss(loadingId);
      toast.success('Form submitted successfully!');
    } catch (error) {
      toast.dismiss(loadingId);
      toast.error(error.message);
    }
  };

  return (
    <div>
      <Button onClick={() => toast.success('Action completed')}>Show Success</Button>
      <Button onClick={() => toast.warning('Please review your input')}>Show Warning</Button>
    </div>
  );
}
```

### Promise Toast

```tsx
import { ToastProvider, useToast } from '@dsai-io/react';
import type { PromiseToastMessages } from '@dsai-io/react';

function UploadButton() {
  const toast = useToast();

  const handleUpload = () => {
    const upload = fetch('/api/upload', { method: 'POST', body: formData });

    toast.promise(upload, {
      loading: 'Uploading file...',
      success: 'File uploaded successfully!',
      error: (err) => `Upload failed: ${err.message}`,
    });
  };

  return <button onClick={handleUpload}>Upload</button>;
}
```

### Pause on Hover

```tsx
// Per-toast control
<Toast
  message="This toast pauses when you hover over it."
  duration={5000}
  pauseOnHover
  showProgress
/>

// Provider-level default (applies to all toasts; default is true)
<ToastProvider pauseOnHover={false}>
  <App />
</ToastProvider>
```

### Keyboard Hotkey

```tsx
// Default hotkey is F8 — press it to focus the notification region
<ToastProvider hotkey="F8">
  <App />
</ToastProvider>

// Use a custom hotkey
<ToastProvider hotkey="F6">
  <App />
</ToastProvider>
```

## Accessibility

### ARIA Attributes

- **role**: `alert` for error/warning variants, `status` for success/info/default
- **aria-live**: `assertive` for urgent notifications (error/warning), `polite` for others
- **aria-atomic**: `true` to ensure complete content is announced
- **aria-labelledby**: References title element when present
- **aria-label**: Custom label for toasts without visible title

### Keyboard Navigation

- Close button is focusable and activates with Enter or Space
- Toast does not trap focus
- Press the configured `hotkey` (default: `F8`) to move keyboard focus directly to the toast notification region when toasts are visible

### Screen Readers

- Error and warning toasts are announced immediately (assertive)
- Success and info toasts wait for opportune moment (polite)
- Complete toast content is announced as a unit (atomic)
- Icons are decorative and hidden from screen readers
- The toast container receives `tabIndex={-1}` and `aria-label="Notifications"` when toasts are present, making it programmatically focusable via the keyboard hotkey

### Reduced Motion

The component automatically detects `prefers-reduced-motion: reduce` via the `(prefers-reduced-motion: reduce)` media query. When active:

- Fade-in/fade-out animations are disabled (instant show/hide)
- Progress bar uses `transition: none`

No configuration is required; this behavior is applied automatically.

### Tab Visibility

When `pauseOnFocusLoss` is enabled (default on `ToastProvider`), the auto-dismiss timer pauses whenever the browser tab becomes hidden (`document.visibilitychange`). The timer resumes with its remaining time when the tab becomes visible again, preventing toasts from expiring while the user is away.

### Color Contrast

All variants use Bootstrap's `text-bg-*` utility classes which ensure WCAG AA compliant color contrast ratios.

## State Machine

The Toast uses a Finite State Machine to manage visibility states:

```text
┌──────────┐    ANIMATION_START    ┌─────────┐    ANIMATION_END    ┌─────────┐
│ entering │ ───────────────────► │ visible │ ◄───────────────── │         │
└──────────┘                       └─────────┘                     │ exiting │
     ▲                                  │                          └─────────┘
     │ SHOW                             │ HIDE/DISMISS                  │
     │                                  ▼                               │
┌──────────┐                       ┌─────────┐    ANIMATION_END    ┌─────────┐
│          │ ◄──────────────────── │ exiting │ ───────────────── ► │ exited  │
└──────────┘                       └─────────┘                     └─────────┘
```

### Visual States

| FSM State  | Visual State | Opacity | Should Render |
| ---------- | ------------ | ------- | ------------- |
| `entering` | `'showing'`  | 0 → 1   | Yes           |
| `visible`  | `'visible'`  | 1       | Yes           |
| `exiting`  | `'hiding'`   | 1 → 0   | Yes           |
| `exited`   | `'hidden'`   | 0       | No            |

## Design Tokens

The Toast component uses Bootstrap 5 utility classes and custom CSS properties:

```scss
// Variant colors (Bootstrap utilities)
.text-bg-success  // Success variant
.text-bg-danger   // Error variant
.text-bg-warning  // Warning variant
.text-bg-info     // Info variant
```

All layout and animation values are overridable via CSS custom properties:

| Property                          | Default  | Description                                  |
| --------------------------------- | -------- | -------------------------------------------- |
| `--dsai-toast-animation-duration` | `150ms`  | Enter/exit animation speed                   |
| `--dsai-toast-gap`                | `12px`   | Gap between stacked toasts                   |
| `--dsai-toast-z-index`            | `1055`   | Container z-index                            |
| `--dsai-toast-progress-height`    | `3px`    | Progress bar height                          |

Example override:

```css
:root {
  --dsai-toast-animation-duration: 200ms;
  --dsai-toast-gap: 8px;
  --dsai-toast-z-index: 9999;
  --dsai-toast-progress-height: 4px;
}
```

## Related Components

- [Alert](../Alert/README.md) - For inline alert messages
- [Tooltip](../Tooltip/README.md) - For hover information
- [Dialog](../Dialog/README.md) - For modal confirmations

## Browser Support

- Chrome 90+
- Firefox 89+
- Safari 15+
- Edge 90+
