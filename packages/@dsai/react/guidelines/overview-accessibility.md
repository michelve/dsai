# DSAi Accessibility Guidelines

All DSAi components are built to meet WCAG 2.1 AA accessibility standards. You must maintain accessibility when using these components.

## Core Requirements

DSAi components implement these accessibility features by default:

- **Keyboard Navigation**: All interactive components are keyboard accessible
- **Focus Management**: Visible focus indicators on all interactive elements
- **Screen Reader Support**: Proper ARIA labels and live regions
- **Color Contrast**: Minimum 4.5:1 for text, 3:1 for UI components

## Keyboard Navigation

### Focus Order

Components follow logical tab order. Do not use `tabIndex` values greater than 0.

```tsx
// Correct - natural focus order
<Input label="Email" />
<Input label="Password" />
<Button>Submit</Button>

// Incorrect - never do this
<Button tabIndex={2}>Submit</Button>
<Input tabIndex={1} label="Email" />
```

### Component-Specific Keyboard Patterns

| Component | Key          | Action                                     |
| --------- | ------------ | ------------------------------------------ |
| Button    | Enter, Space | Activate button                            |
| Checkbox  | Space        | Toggle checked state                       |
| Dropdown  | Enter, Space | Open menu                                  |
| Dropdown  | Escape       | Close menu                                 |
| Dropdown  | Arrow keys   | Navigate options                           |
| Modal     | Escape       | Close modal                                |
| Modal     | Tab          | Cycle through focusable elements (trapped) |
| Tabs      | Arrow keys   | Navigate between tabs                      |
| Select    | Enter, Space | Open options                               |
| Select    | Arrow keys   | Navigate options                           |

## Labels and Descriptions

### Always Provide Labels

Every form control must have a visible label or accessible name.

```tsx
// Correct - visible label
<Input label="Email address" />

// Correct - aria-label for icon-only buttons
<Button aria-label="Close dialog" variant="ghost">
  <Icon name="close" />
</Button>

// Incorrect - no accessible name
<Input placeholder="Enter email" />
```

### Error Messages

Connect error messages to inputs using `aria-describedby` or built-in error props.

```tsx
// Correct - use error prop
<Input
  label="Email"
  error="Please enter a valid email address"
/>

// Correct - error state with description
<Input
  label="Password"
  isInvalid
  aria-describedby="password-error"
/>
<span id="password-error">Password must be at least 8 characters</span>
```

## Focus Management

### Modal and Dialog Focus

Modals automatically trap focus and return it when closed. Do not override this behavior.

```tsx
// Modal automatically manages focus
<Modal open={isOpen} onClose={() => setIsOpen(false)}>
  <Modal.Header>Edit Profile</Modal.Header>
  <Modal.Body>
    <Input label="Name" />
    <Input label="Bio" />
  </Modal.Body>
  <Modal.Footer>
    <Button onClick={() => setIsOpen(false)}>Save</Button>
  </Modal.Footer>
</Modal>
```

### Focus After Actions

After destructive actions or significant changes, move focus appropriately.

```tsx
// After deleting an item, focus the next item or a logical target
const handleDelete = async (id: string) => {
  await deleteItem(id);
  // Focus the list or next item
  listRef.current?.focus();
};
```

## Screen Readers

### Live Regions

Use Alert and Toast components for dynamic content announcements.

```tsx
// Alert is automatically announced
<Alert variant="success">Your changes have been saved.</Alert>;

// Toast announces with proper urgency
toast.success('Profile updated');
```

### Decorative vs Informative Elements

Mark purely decorative elements as hidden from assistive technology.

```tsx
// Decorative icon with text label - hide icon
<Button>
  <Icon name="save" aria-hidden="true" />
  Save Document
</Button>

// Informative icon-only button - provide label
<Button aria-label="Save document">
  <Icon name="save" />
</Button>
```

## Color and Contrast

### Never Rely on Color Alone

Always provide additional indicators beyond color.

```tsx
// Correct - icon and color indicate status
<Alert variant="danger">
  <Icon name="error" />
  Form submission failed
</Alert>

// Correct - text describes the status
<Badge variant="success">Approved</Badge>

// Incorrect - only color indicates state
<span style={{ color: 'red' }}>Required</span>
```

### Custom Colors

If you must use custom colors, ensure minimum contrast ratios:

- Normal text: 4.5:1 against background
- Large text (18px+): 3:1 against background
- UI components and graphics: 3:1 against adjacent colors

## Testing Accessibility

Before finalizing any UI:

1. Tab through all interactive elements
2. Activate all controls with keyboard only
3. Test with a screen reader (VoiceOver on macOS)
4. Check color contrast with browser dev tools
5. Verify focus indicators are visible

## Do's and Don'ts

### Do

- Use semantic HTML elements through components
- Provide labels for all form controls
- Maintain logical focus order
- Test with keyboard navigation
- Include skip links for complex pages

### Don't

- Remove focus outlines without replacement
- Use color as the only means of conveying information
- Create keyboard traps (except in modals)
- Use placeholder as the only label
- Disable zoom or scaling in the viewport
