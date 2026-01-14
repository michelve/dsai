# Button Component Guidelines

The Button component is the primary interactive element for triggering actions.

## Import

```tsx
import { Button } from '@dsai/react';
```

## When to Use

Use Button when:

- User needs to trigger an action (submit, save, delete)
- Navigating to a new page or section
- Opening a modal or dialog
- Performing a state change

Do not use Button when:

- Just displaying information (use Badge or text)
- Linking to external content (use anchor with appropriate styling)

## Basic Usage

```tsx
// Primary action
<Button variant="primary">Save Changes</Button>

// Secondary action
<Button variant="secondary">Cancel</Button>

// Destructive action
<Button variant="danger">Delete Account</Button>
```

## Variants

| Variant   | Purpose            | Usage                                     |
| --------- | ------------------ | ----------------------------------------- |
| primary   | Main action        | One per section, most important action    |
| secondary | Supporting action  | Cancel, back, alternative actions         |
| danger    | Destructive action | Delete, remove, irreversible actions      |
| ghost     | Tertiary action    | Less prominent actions, toolbars          |
| link      | Navigation         | In-context navigation, less visual weight |

```tsx
<Button variant="primary">Submit</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="danger">Delete</Button>
<Button variant="ghost">More options</Button>
<Button variant="link">Learn more</Button>
```

## Sizes

```tsx
<Button size="sm">Small</Button>
<Button size="md">Medium (default)</Button>
<Button size="lg">Large</Button>
```

Use sizes consistently:

- `sm`: Compact UIs, tables, inline actions
- `md`: Forms, dialogs, standard layouts
- `lg`: Hero sections, prominent CTAs

## With Icons

```tsx
// Icon before text
<Button>
  <Icon name="plus" />
  Add Item
</Button>

// Icon after text
<Button>
  Next
  <Icon name="arrow-right" />
</Button>

// Icon only (requires aria-label)
<Button aria-label="Close">
  <Icon name="close" />
</Button>
```

## Loading State

```tsx
<Button loading>Saving...</Button>
<Button loading loadingText="Please wait">Submit</Button>
```

The button automatically:

- Shows a spinner
- Disables interaction
- Maintains button width

## Disabled State

```tsx
<Button disabled>Cannot Submit</Button>
```

Disabled buttons:

- Have reduced opacity
- Don't respond to clicks
- Are excluded from tab order

## As Link

```tsx
// Render as anchor tag
<Button as="a" href="/dashboard">Go to Dashboard</Button>

// With external link
<Button as="a" href="https://example.com" target="_blank">
  External Link
  <Icon name="external-link" />
</Button>
```

## Button Groups

```tsx
// Horizontal group
<div style={{ display: 'flex', gap: 'var(--spacing-3)' }}>
  <Button variant="secondary">Cancel</Button>
  <Button variant="primary">Save</Button>
</div>

// Stacked on mobile
<div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
  <Button variant="primary" fullWidth>Primary Action</Button>
  <Button variant="secondary" fullWidth>Secondary Action</Button>
</div>
```

## Accessibility

- Always provide text content or `aria-label` for icon-only buttons
- Disabled buttons should explain why (via tooltip or adjacent text)
- Use proper button type for forms: `type="submit"` or `type="button"`

```tsx
// Form submission
<form onSubmit={handleSubmit}>
  <Button type="submit">Submit Form</Button>
</form>

// Regular button (not in form)
<Button type="button" onClick={handleClick}>Click Me</Button>
```

## Common Patterns

### Confirmation Dialog Buttons

```tsx
<Modal.Footer>
  <Button variant="secondary" onClick={onClose}>
    Cancel
  </Button>
  <Button variant="danger" onClick={onConfirm}>
    Delete
  </Button>
</Modal.Footer>
```

### Form Actions

```tsx
<form>
  {/* Form fields */}
  <div style={{ display: 'flex', gap: 'var(--spacing-3)', justifyContent: 'flex-end' }}>
    <Button type="button" variant="secondary" onClick={onReset}>
      Reset
    </Button>
    <Button type="submit" variant="primary">
      Submit
    </Button>
  </div>
</form>
```

## Do's and Don'ts

### Do

- Use one primary button per section
- Put the primary action on the right in button groups
- Keep button text concise (1-3 words)
- Use loading state for async actions

### Don't

- Don't use multiple primary buttons together
- Don't use button for pure navigation (use links)
- Don't disable without explanation
- Don't make icon-only buttons without aria-label
