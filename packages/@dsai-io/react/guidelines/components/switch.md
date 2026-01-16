# Switch Component Guidelines

The Switch component provides a toggle for binary on/off settings.

## Import

```tsx
import { Switch } from '@dsai-io/react';
```

## When to Use

Use Switch when:

- Toggling a setting on or off
- Change takes effect immediately
- Binary choice with clear on/off states
- User needs visual feedback of current state

Do not use Switch when:

- Selection is part of a form submission (use Checkbox)
- Multiple options exist (use Checkbox or Radio)
- Action needs confirmation (use Checkbox + Button)

## Basic Usage

```tsx
<Switch label="Enable notifications" />
```

## Controlled

```tsx
const [enabled, setEnabled] = useState(false);

<Switch label="Dark mode" checked={enabled} onChange={(checked) => setEnabled(checked)} />;
```

## Sizes

```tsx
<Switch size="sm" label="Small" />
<Switch size="md" label="Medium (default)" />
<Switch size="lg" label="Large" />
```

## With Description

```tsx
<Switch label="Email notifications" description="Receive email updates about account activity" />
```

## Label Position

```tsx
// Label on right (default)
<Switch label="Setting" />

// Label on left
<Switch label="Setting" labelPosition="left" />
```

## Disabled State

```tsx
<Switch label="Feature unavailable" disabled />
<Switch label="Feature enabled (locked)" checked disabled />
```

## Immediate Effect

Switch changes should take effect immediately:

```tsx
function handleDarkModeChange(enabled: boolean) {
  setDarkMode(enabled);
  document.body.classList.toggle('dark', enabled);
}

<Switch label="Dark mode" checked={darkMode} onChange={handleDarkModeChange} />;
```

## With Loading State

```tsx
const [isUpdating, setIsUpdating] = useState(false);

async function handleChange(checked: boolean) {
  setIsUpdating(true);
  try {
    await updateSetting(checked);
    setEnabled(checked);
  } finally {
    setIsUpdating(false);
  }
}

<Switch
  label="Two-factor authentication"
  checked={enabled}
  onChange={handleChange}
  disabled={isUpdating}
/>;
{
  isUpdating && <Spinner size="sm" />;
}
```

## Settings Panel

```tsx
<div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
  <Switch label="Push notifications" description="Receive push notifications on your device" />
  <Switch label="Email digest" description="Weekly summary of account activity" />
  <Switch label="Marketing emails" description="Updates about new features and promotions" />
</div>
```

## Accessibility

- Switch is keyboard accessible (Space to toggle)
- Label is automatically associated
- State is announced to screen readers

```tsx
// Accessible by default
<Switch label="Enable feature" />

// With additional context
<Switch
  label="Airplane mode"
  aria-describedby="airplane-help"
/>
<span id="airplane-help">Disables all wireless connections</span>
```

## Switch vs Checkbox

| Switch               | Checkbox               |
| -------------------- | ---------------------- |
| Immediate effect     | Deferred (form submit) |
| Settings/preferences | Form inputs            |
| Always binary        | Can be indeterminate   |
| Toggle appearance    | Square checkbox        |

```tsx
// Switch - immediate setting change
<Switch
  label="Enable feature"
  onChange={(checked) => saveSetting(checked)}
/>

// Checkbox - form submission
<form onSubmit={handleSubmit}>
  <Checkbox label="I agree to terms" name="terms" />
  <Button type="submit">Submit</Button>
</form>
```

## Common Patterns

### Notification Settings

```tsx
<Card>
  <Card.Header>Notification Preferences</Card.Header>
  <Card.Body>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
      <Switch
        label="Email notifications"
        checked={settings.email}
        onChange={(v) => updateSetting('email', v)}
      />
      <Switch
        label="Push notifications"
        checked={settings.push}
        onChange={(v) => updateSetting('push', v)}
      />
      <Switch label="SMS alerts" checked={settings.sms} onChange={(v) => updateSetting('sms', v)} />
    </div>
  </Card.Body>
</Card>
```

### Feature Toggle

```tsx
<Switch
  label="Beta features"
  description="Try new features before they're released"
  checked={betaEnabled}
  onChange={setBetaEnabled}
/>;

{
  betaEnabled && (
    <Alert variant="info">Beta features may be unstable. Report issues in feedback.</Alert>
  );
}
```

### Privacy Setting

```tsx
<Switch
  label="Public profile"
  description="Allow others to find and view your profile"
  checked={isPublic}
  onChange={async (checked) => {
    await updatePrivacy(checked);
    setIsPublic(checked);
    toast.success(checked ? 'Profile is now public' : 'Profile is now private');
  }}
/>
```

## Do's and Don'ts

### Do

- Use for settings that take immediate effect
- Provide clear labels describing the on state
- Show loading state for async operations
- Use description for additional context

### Don't

- Don't use in forms that require submission
- Don't use for non-binary choices
- Don't use without a label
- Don't delay the visual toggle (update immediately, save async)
