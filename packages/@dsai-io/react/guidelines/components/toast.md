# Toast Component Guidelines

The Toast component displays temporary notification messages that auto-dismiss.

## Import

```tsx
import { toast, ToastProvider } from '@dsai-io/react';
```

## When to Use

Use Toast when:

- Confirming a background action completed
- Showing brief, non-critical feedback
- Notification doesn't require user action
- Message can be missed without consequence

Do not use Toast when:

- Error requires user attention (use Alert)
- Action confirmation is needed (use Modal)
- Message must be acknowledged (use Alert)
- Showing form validation errors (use inline errors)

## Setup

Wrap your app with ToastProvider:

```tsx
import { ToastProvider } from '@dsai-io/react';

function App() {
  return (
    <ToastProvider>
      <YourApp />
    </ToastProvider>
  );
}
```

## Basic Usage

```tsx
import { toast } from '@dsai-io/react';

// Success toast
toast.success('Changes saved successfully');

// Error toast
toast.error('Failed to save changes');

// Warning toast
toast.warning('Your session will expire soon');

// Info toast
toast.info('New update available');

// Default toast
toast('Hello world');
```

## Variants

```tsx
// Success - completed actions
toast.success('Profile updated');

// Error - failed actions
toast.error('Could not connect to server');

// Warning - caution notices
toast.warning('Low storage space');

// Info - neutral information
toast.info('New message received');
```

## With Title

```tsx
toast.success({
  title: 'Order Placed',
  message: 'You will receive a confirmation email shortly.',
});

toast.error({
  title: 'Upload Failed',
  message: 'The file exceeds the maximum size of 10MB.',
});
```

## Duration

```tsx
// Default: 5000ms (5 seconds)
toast.success('Saved');

// Custom duration
toast.success('Saved', { duration: 3000 }); // 3 seconds

// Persistent (no auto-dismiss)
toast.error('Connection lost', { duration: Infinity });
```

## Position

Configure position in ToastProvider:

```tsx
<ToastProvider position="top-right">
  <App />
</ToastProvider>
```

Available positions:

- `top-right` (default)
- `top-left`
- `top-center`
- `bottom-right`
- `bottom-left`
- `bottom-center`

## With Action

```tsx
toast.info({
  message: 'Item deleted',
  action: {
    label: 'Undo',
    onClick: () => restoreItem(),
  },
});

toast.error({
  title: 'Connection Error',
  message: 'Unable to reach the server.',
  action: {
    label: 'Retry',
    onClick: () => retryConnection(),
  },
});
```

## Dismissible

```tsx
// Dismissible (default)
toast.success('Saved', { dismissible: true });

// Non-dismissible (use sparingly)
toast.info('Loading...', { dismissible: false });
```

## Programmatic Control

```tsx
// Get toast ID
const toastId = toast.loading('Uploading...');

// Update existing toast
toast.success('Upload complete!', { id: toastId });

// Dismiss specific toast
toast.dismiss(toastId);

// Dismiss all toasts
toast.dismiss();
```

## Loading Toast Pattern

```tsx
async function saveData() {
  const toastId = toast.loading('Saving...');

  try {
    await api.save(data);
    toast.success('Saved successfully!', { id: toastId });
  } catch (error) {
    toast.error('Failed to save', { id: toastId });
  }
}
```

## Promise Toast

```tsx
toast.promise(saveData(), {
  loading: 'Saving...',
  success: 'Saved successfully!',
  error: 'Failed to save',
});

// With custom messages
toast.promise(uploadFile(file), {
  loading: 'Uploading file...',
  success: (data) => `Uploaded ${data.filename}`,
  error: (err) => `Upload failed: ${err.message}`,
});
```

## Accessibility

- Toasts use `role="status"` for non-critical messages
- Screen readers announce toast content
- Focus is not moved to toast (non-intrusive)
- Keyboard dismissible with Escape

```tsx
// Toast with sufficient time for screen readers
toast.success('Saved', { duration: 5000 });
```

## Toast vs Alert

| Toast               | Alert              |
| ------------------- | ------------------ |
| Auto-dismisses      | Persistent         |
| Overlays content    | Inline in layout   |
| Brief confirmations | Important messages |
| Can be missed       | Should be read     |
| Non-blocking        | May block workflow |

```tsx
// Toast - quick confirmation
toast.success('Email sent');

// Alert - important, persistent
<Alert variant="danger">Your account will be suspended in 3 days.</Alert>;
```

## Common Patterns

### Form Submission

```tsx
async function onSubmit(data) {
  try {
    await api.submit(data);
    toast.success('Form submitted successfully');
    router.push('/dashboard');
  } catch (error) {
    toast.error('Failed to submit form. Please try again.');
  }
}
```

### Clipboard Copy

```tsx
function copyToClipboard(text) {
  navigator.clipboard.writeText(text);
  toast.success('Copied to clipboard');
}
```

### Undo Action

```tsx
function deleteItem(id) {
  const item = items.find((i) => i.id === id);
  removeItem(id);

  toast.success({
    message: `${item.name} deleted`,
    action: {
      label: 'Undo',
      onClick: () => restoreItem(item),
    },
    duration: 8000, // Longer duration for undo
  });
}
```

## Do's and Don'ts

### Do

- Keep messages brief and actionable
- Use appropriate variant for context
- Provide undo actions when possible
- Use loading → success/error pattern for async

### Don't

- Don't show multiple toasts at once
- Don't use for critical errors requiring action
- Don't show sensitive information in toasts
- Don't make toasts too long to read in time
