# Alert Component

A Bootstrap 5 alert component for displaying important messages to users.

## Features

- **8 variants**: primary, secondary, success, danger, warning, info, light, dark
- **Dismissible**: Close button with Escape key support
- **Compound components**: `Alert.Link` and `Alert.Heading`
- **Icon support**: Custom icons
- **Accessible**: WCAG 2.2 AA compliant with proper ARIA attributes

## Installation

```bash
pnpm add @dsai/react @dsai/tokens
```

## Usage

### Basic Usage

```tsx
import { Alert } from '@dsai/react';
import '@dsai/tokens/css/bootstrap.css';

function App() {
  return <Alert variant="info">This is an informational message.</Alert>;
}
```

### Variants

```tsx
<Alert variant="primary">A simple primary alert.</Alert>
<Alert variant="secondary">A simple secondary alert.</Alert>
<Alert variant="success">A simple success alert.</Alert>
<Alert variant="danger">A simple danger alert.</Alert>
<Alert variant="warning">A simple warning alert.</Alert>
<Alert variant="info">A simple info alert.</Alert>
<Alert variant="light">A simple light alert.</Alert>
<Alert variant="dark">A simple dark alert.</Alert>
```

### With Title

```tsx
<Alert variant="success" title="Well done!">
  You successfully completed the task.
</Alert>
```

### Using Alert.Heading (Compound Component)

```tsx
<Alert variant="success">
  <Alert.Heading>Well done!</Alert.Heading>
  <p>You successfully completed the task.</p>
  <hr />
  <p className="mb-0">Additional information can go here.</p>
</Alert>
```

### Dismissible Alert

```tsx
function DismissibleAlert() {
  const [show, setShow] = useState(true);

  if (!show) return null;

  return (
    <Alert variant="warning" dismissible onClose={() => setShow(false)}>
      This alert can be dismissed by clicking the X or pressing Escape.
    </Alert>
  );
}
```

### With Link

```tsx
<Alert variant="primary">
  A simple alert with <Alert.Link href="/example">an example link</Alert.Link>.
</Alert>
```

### With Icon

```tsx
<Alert variant="danger" icon={<ErrorIcon />}>
  Something went wrong. Please try again.
</Alert>
```

### Controlled Visibility

```tsx
<Alert variant="info" show={isVisible}>
  This alert's visibility is controlled.
</Alert>
```

## Props

### Alert

| Prop          | Type                 | Default     | Description                                                               |
| ------------- | -------------------- | ----------- | ------------------------------------------------------------------------- |
| `children`    | `ReactNode`          | -           | Alert content                                                             |
| `variant`     | `AlertVariant`       | `'primary'` | Color variant                                                             |
| `title`       | `string`             | -           | Optional alert heading; also populates the root `title` tooltip attribute |
| `dismissible` | `boolean`            | `false`     | Show close button and enable Escape-to-dismiss                            |
| `onClose`     | `() => void`         | -           | Close callback, required when `dismissible` is `true`                     |
| `icon`        | `ReactNode`          | -           | Custom icon (wrapped in an `aria-hidden` container)                       |
| `show`        | `boolean`            | `true`      | Control visibility (FSM syncs with prop changes)                          |
| `className`   | `string`             | -           | Additional CSS classes                                                    |
| `style`       | `CSSProperties`      | -           | Inline styles                                                             |
| `id`          | `string`             | -           | ID attribute                                                              |
| `as`          | `'div' \| 'section'` | `'div'`     | Element to render as                                                      |
| `aria-atomic` | `boolean`            | `true`      | Announces the entire alert when content changes                           |
| `data-testid` | `string`             | -           | Testing hook (sanitized)                                                  |
| `data-test`   | `string`             | -           | Alternate testing hook (sanitized)                                        |

> ℹ️ The tooltip-style `title` attribute currently mirrors the heading text. If you need different tooltip copy, compose your own heading with `Alert.Heading` and pass the desired `title` attribute to the root element.

### Alert.Link

| Prop          | Type                                         | Default   | Description                                                                                 |
| ------------- | -------------------------------------------- | --------- | ------------------------------------------------------------------------------------------- |
| `children`    | `ReactNode`                                  | -         | Link content                                                                                |
| `href`        | `string`                                     | -         | Link URL (validated against `javascript:`, `data:`, etc. and falls back to `#` when unsafe) |
| `onClick`     | `(event: React.MouseEvent)`                  | -         | Click handler                                                                               |
| `className`   | `string`                                     | -         | Additional CSS classes                                                                      |
| `target`      | `'_blank' \| '_self' \| '_parent' \| '_top'` | `'_self'` | Browser target; `_blank` automatically adds `rel="noopener noreferrer"` for security        |
| `rel`         | `string`                                     | -         | Relationship attribute; ignored when `target="_blank"` to enforce `noopener noreferrer`     |
| `title`       | `string`                                     | -         | Tooltip text                                                                                |
| `data-testid` | `string`                                     | -         | Testing hook (sanitized)                                                                    |
| `data-test`   | `string`                                     | -         | Alternate testing hook (sanitized)                                                          |

### Alert.Heading

| Prop        | Type                                 | Default | Description            |
| ----------- | ------------------------------------ | ------- | ---------------------- |
| `children`  | `ReactNode`                          | -       | Heading content        |
| `as`        | `'h1'\|'h2'\|'h3'\|'h4'\|'h5'\|'h6'` | `'h4'`  | Heading level          |
| `className` | `string`                             | -       | Additional CSS classes |

## Accessibility

The Alert component is built with accessibility in mind:

- **ARIA Roles**:
  - `role="alert"` for danger/warning variants (assertive announcement)
  - `role="status"` for info/success/primary/secondary variants (polite announcement)
- **ARIA Live Regions**:
  - `aria-live="assertive"` for danger alerts
  - `aria-live="polite"` for other variants
- **Keyboard Support**: Escape key dismisses the alert when dismissible
- **Close Button**: Has `aria-label="Close"` for screen readers
- **Color Contrast**: Meets WCAG 2.2 AA contrast requirements via Bootstrap theme

## Bootstrap Classes

The Alert component uses native Bootstrap 5 classes:

- `alert` - Base alert class
- `alert-{variant}` - Color variant classes
- `alert-dismissible` - Dismissible styling
- `alert-link` - Styled links within alerts
- `alert-heading` - Styled headings within alerts
- `btn-close` - Close button styling
- `fade show` - Animation classes

## Internal FSM

The Alert component uses a finite state machine (FSM) to manage visibility and dismissal behavior:

### States

- `visible` - Alert is rendered and displayed
- `hidden` - Alert is not rendered (returns null)

### Events

- `SHOW` - External request to show (when `show` prop becomes `true`)
- `HIDE` - External request to hide (when `show` prop becomes `false`)
- `DISMISS_CLICK` - User clicked the close button
- `DISMISS_ESCAPE` - User pressed Escape key (when dismissible)

### FSM Exports

For advanced use cases, the FSM utilities are exported:

```tsx
import {
  alertFSMReducer,
  createInitialAlertFSMState,
  type AlertFSMState,
  type AlertFSMEvent,
  type AlertVisibilityState,
} from '@dsai/react';
```

### Visual State Debugging

The Alert component exposes its FSM state via the `data-visual-state` attribute for debugging and testing purposes.

## Security

The Alert.Link component includes security features:

- **XSS Prevention**: Validates `href` to block dangerous protocols (`javascript:`, `data:`, `vbscript:`, etc.)
- **External Link Protection**: Automatically adds `rel="noopener noreferrer"` for `target="_blank"` links
- **Prop Whitelisting**: Only safe HTML attributes are passed through

## Related Components

- [Badge](../Badge/README.md) - For inline status indicators
