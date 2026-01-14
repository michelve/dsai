# Alert Component Guidelines

The Alert component displays contextual feedback messages for user actions and system status.

## Import

```tsx
import { Alert } from '@dsai/react';
```

## When to Use

Use Alert when:

- Showing success/error feedback after an action
- Displaying important system messages
- Warning users about potential issues
- Providing informational context

Do not use Alert when:

- Showing temporary notifications (use Toast)
- Validating form fields (use Input error prop)
- Displaying inline hints (use helper text)

## Basic Usage

```tsx
<Alert variant="success">Your changes have been saved successfully.</Alert>
```

## Variants

| Variant | Purpose             | Icon             | Usage                                |
| ------- | ------------------- | ---------------- | ------------------------------------ |
| success | Positive feedback   | Checkmark        | Action completed, validation passed  |
| danger  | Error states        | X/Error          | Action failed, critical issues       |
| warning | Caution             | Warning triangle | Potential issues, requires attention |
| info    | Neutral information | Info circle      | General notices, tips                |

```tsx
<Alert variant="success">Profile updated successfully!</Alert>
<Alert variant="danger">Failed to save changes. Please try again.</Alert>
<Alert variant="warning">Your session will expire in 5 minutes.</Alert>
<Alert variant="info">New features are available. Check the changelog.</Alert>
```

## With Title

```tsx
<Alert variant="success" title="Payment Successful">
  Your order has been placed. You will receive a confirmation email shortly.
</Alert>

<Alert variant="danger" title="Connection Error">
  Unable to connect to the server. Please check your internet connection.
</Alert>
```

## Dismissible Alerts

```tsx
const [visible, setVisible] = useState(true);

{
  visible && (
    <Alert variant="info" dismissible onDismiss={() => setVisible(false)}>
      This alert can be dismissed by the user.
    </Alert>
  );
}
```

## With Actions

```tsx
<Alert
  variant="warning"
  title="Unsaved Changes"
  actions={
    <>
      <Button size="sm" variant="secondary">
        Discard
      </Button>
      <Button size="sm" variant="primary">
        Save
      </Button>
    </>
  }
>
  You have unsaved changes that will be lost if you leave this page.
</Alert>
```

## With Custom Icon

```tsx
<Alert variant="info" icon={<Icon name="lightbulb" />}>
  Pro tip: You can use keyboard shortcuts for faster navigation.
</Alert>
```

## Alert Placement

### Page-level Alerts

Place at the top of the content area:

```tsx
<main>
  <Alert variant="warning">Scheduled maintenance on Saturday 10PM-2AM EST.</Alert>
  {/* Page content */}
</main>
```

### Section-level Alerts

Place within the relevant section:

```tsx
<Card>
  <Card.Header>Account Settings</Card.Header>
  <Card.Body>
    <Alert variant="info">Email verification pending. Check your inbox.</Alert>
    {/* Settings form */}
  </Card.Body>
</Card>
```

### Form Feedback

Place after form submission:

```tsx
<form onSubmit={handleSubmit}>
  {submitError && <Alert variant="danger">{submitError}</Alert>}
  {submitSuccess && <Alert variant="success">Form submitted successfully!</Alert>}
  {/* Form fields */}
</form>
```

## Accessibility

- Alerts are announced to screen readers via `role="alert"`
- Color is never the only indicator (icons provide additional context)
- Dismissible alerts have accessible close buttons

```tsx
// Automatically accessible
<Alert variant="danger">This content is announced to screen readers.</Alert>
```

## Alert vs Toast

| Alert                      | Toast                           |
| -------------------------- | ------------------------------- |
| Persistent until dismissed | Auto-dismisses after timeout    |
| Inline in content          | Overlay positioned (corner/top) |
| For important messages     | For quick confirmations         |
| Requires user attention    | Briefly notifies and disappears |

```tsx
// Alert - stays visible
<Alert variant="success">Your profile has been updated.</Alert>;

// Toast - disappears automatically
toast.success('Profile updated');
```

## Common Patterns

### Error with Retry

```tsx
<Alert
  variant="danger"
  title="Failed to Load Data"
  actions={
    <Button size="sm" onClick={retry}>
      Try Again
    </Button>
  }
>
  Unable to fetch data from the server.
</Alert>
```

### Multi-line Alert

```tsx
<Alert variant="warning" title="Account Verification Required">
  <p>To continue using all features, please verify your account:</p>
  <ul>
    <li>Check your email for the verification link</li>
    <li>Click the link to verify your account</li>
    <li>Return here to access all features</li>
  </ul>
</Alert>
```

## Do's and Don'ts

### Do

- Use appropriate variant for the message type
- Keep alert messages concise
- Provide actionable information in error alerts
- Place alerts where users will see them

### Don't

- Don't use Alert for every message (reserve for important feedback)
- Don't show multiple alerts for the same issue
- Don't use danger variant for non-critical information
- Don't auto-dismiss error alerts (use Toast for auto-dismiss)
