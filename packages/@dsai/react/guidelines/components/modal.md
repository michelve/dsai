# Modal Component Guidelines

The Modal component displays content in a dialog overlay, focusing user attention on a specific task.

## Import

```tsx
import { Modal } from '@dsai/react';
```

## When to Use

Use Modal when:

- Confirming destructive actions
- Collecting user input for a focused task
- Showing important information that requires acknowledgment
- Displaying content that shouldn't navigate away from the current page

Do not use Modal when:

- Showing quick notifications (use Toast)
- Displaying supplementary content (use Sheet)
- Content should be accessible via direct URL
- Multiple modals would need to stack

## Basic Usage

```tsx
const [open, setOpen] = useState(false);

<Button onClick={() => setOpen(true)}>Open Modal</Button>

<Modal open={open} onClose={() => setOpen(false)}>
  <Modal.Header>Modal Title</Modal.Header>
  <Modal.Body>
    Modal content goes here.
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
    <Button variant="primary">Confirm</Button>
  </Modal.Footer>
</Modal>
```

## Structure

```tsx
<Modal>
  <Modal.Header>Title (optional close button)</Modal.Header>
  <Modal.Body>Main content area</Modal.Body>
  <Modal.Footer>Action buttons</Modal.Footer>
</Modal>
```

All parts are optional but recommended for consistency.

## Sizes

```tsx
<Modal size="sm">Small modal (400px)</Modal>
<Modal size="md">Medium modal (500px, default)</Modal>
<Modal size="lg">Large modal (700px)</Modal>
<Modal size="xl">Extra large modal (900px)</Modal>
<Modal size="full">Full screen modal</Modal>
```

## Close Behavior

### Close Button

```tsx
<Modal open={open} onClose={handleClose}>
  <Modal.Header showCloseButton>Edit Profile</Modal.Header>
  {/* ... */}
</Modal>
```

### Close on Overlay Click

```tsx
// Default - closes on overlay click
<Modal open={open} onClose={handleClose}>

// Prevent close on overlay click
<Modal open={open} onClose={handleClose} closeOnOverlayClick={false}>
```

### Close on Escape Key

```tsx
// Default - closes on Escape
<Modal open={open} onClose={handleClose}>

// Prevent close on Escape (use for important forms)
<Modal open={open} onClose={handleClose} closeOnEscape={false}>
```

## Confirmation Modal

```tsx
<Modal open={open} onClose={handleClose} size="sm">
  <Modal.Header>Delete Item?</Modal.Header>
  <Modal.Body>Are you sure you want to delete this item? This action cannot be undone.</Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={handleClose}>
      Cancel
    </Button>
    <Button variant="danger" onClick={handleDelete}>
      Delete
    </Button>
  </Modal.Footer>
</Modal>
```

## Form Modal

```tsx
<Modal open={open} onClose={handleClose}>
  <form onSubmit={handleSubmit}>
    <Modal.Header>Create New Project</Modal.Header>
    <Modal.Body>
      <Input label="Project Name" required />
      <Input label="Description" />
    </Modal.Body>
    <Modal.Footer>
      <Button type="button" variant="secondary" onClick={handleClose}>
        Cancel
      </Button>
      <Button type="submit" variant="primary">
        Create Project
      </Button>
    </Modal.Footer>
  </form>
</Modal>
```

## Scrolling Content

```tsx
<Modal open={open} onClose={handleClose}>
  <Modal.Header>Terms of Service</Modal.Header>
  <Modal.Body scrollable>
    {/* Long content scrolls within body */}
    <p>Lorem ipsum...</p>
    <p>More content...</p>
  </Modal.Body>
  <Modal.Footer>
    <Button onClick={handleClose}>Close</Button>
  </Modal.Footer>
</Modal>
```

## Focus Management

Modal automatically manages focus:

- Focus moves to modal when opened
- Focus is trapped within modal
- Focus returns to trigger when closed

```tsx
// Focus automatically managed
<Modal open={open} onClose={handleClose}>
  <Modal.Header>Edit Settings</Modal.Header>
  <Modal.Body>
    <Input label="Name" autoFocus /> {/* Receives focus on open */}
  </Modal.Body>
</Modal>
```

## Loading State

```tsx
<Modal open={open} onClose={handleClose}>
  <Modal.Header>Saving...</Modal.Header>
  <Modal.Body>
    {loading ? (
      <div style={{ textAlign: 'center', padding: 'var(--spacing-8)' }}>
        <Spinner />
        <p>Please wait while we save your changes.</p>
      </div>
    ) : (
      <p>Content goes here</p>
    )}
  </Modal.Body>
  <Modal.Footer>
    <Button variant="primary" loading={loading} onClick={handleSave}>
      Save
    </Button>
  </Modal.Footer>
</Modal>
```

## Accessibility

- Modal uses `role="dialog"` and `aria-modal="true"`
- Focus is trapped inside the modal
- Escape key closes the modal (unless disabled)
- Background content is inert and not focusable

```tsx
// Title provides accessible name
<Modal open={open} onClose={handleClose} aria-labelledby="modal-title">
  <Modal.Header id="modal-title">Accessible Modal</Modal.Header>
  {/* ... */}
</Modal>
```

## Modal vs Sheet

| Modal               | Sheet                        |
| ------------------- | ---------------------------- |
| Centers on screen   | Slides from screen edge      |
| Blocks background   | Can show background context  |
| For focused tasks   | For supplementary content    |
| Confirmation, forms | Filters, details, navigation |

```tsx
// Modal - focused confirmation
<Modal>
  <Modal.Body>Confirm this action?</Modal.Body>
</Modal>

// Sheet - supplementary content
<Sheet side="right">
  <Sheet.Body>Filter options...</Sheet.Body>
</Sheet>
```

## Common Patterns

### Delete Confirmation

```tsx
<Modal open={showDelete} onClose={() => setShowDelete(false)} size="sm">
  <Modal.Header>Delete "{itemName}"?</Modal.Header>
  <Modal.Body>
    <Alert variant="warning">
      This action cannot be undone. All associated data will be permanently removed.
    </Alert>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowDelete(false)}>
      Cancel
    </Button>
    <Button variant="danger" onClick={handleDelete}>
      Delete
    </Button>
  </Modal.Footer>
</Modal>
```

## Do's and Don'ts

### Do

- Use clear, action-oriented titles
- Put the primary action on the right in footer
- Allow closing via Escape and overlay click for non-critical modals
- Trap focus inside the modal

### Don't

- Don't nest modals inside modals
- Don't use modals for simple notifications
- Don't make modals too large (use dedicated pages instead)
- Don't prevent all close methods without good reason
