# Miscellaneous Utilities

Collection of general-purpose utilities for input sanitization, event helpers, and UI components.

## Overview

This module provides:

- Input attribute sanitization for security
- Clear/close icon component
- FSM event factories for selection management
- Placement mapping utilities
- Trigger normalization helpers

## Installation

```tsx
import {
  getSafeInputProps,
  ClearIcon,
  toggleItemEvent,
  selectAllEvent,
  clearAllEvent,
  toggleAllEvent,
  mapPlacement,
  normalizeTriggers,
} from '@dsai/react';
```

---

## Security Utilities

### `getSafeInputProps`

Filter input props to only include safe HTML attributes, blocking dangerous event handlers for XSS prevention.

**Signature:**

```tsx
function getSafeInputProps(props: Record<string, unknown>): Record<string, unknown>;

const SAFE_INPUT_ATTRIBUTES: Record<string, boolean>;
```

**Safe Attributes (Whitelist):**

**Standard HTML:**

- `id`, `name`, `type`, `value`, `defaultValue`, `defaultChecked`
- `placeholder`, `pattern`, `title`, `alt`
- `disabled`, `readOnly`, `required`, `hidden`
- `autoComplete`, `autoFocus`, `spellCheck`
- `min`, `max`, `step`, `minLength`, `maxLength`
- `width`, `height`, `tabIndex`
- `className`, `style`, `dir`, `lang`, `translate`
- `role`, `data`, `prefix`, `property`, `resource`, `vocab`

**ARIA Attributes (Full Set):**

- `aria-label`, `aria-labelledby`, `aria-describedby`
- `aria-invalid`, `aria-required`, `aria-disabled`, `aria-hidden`
- `aria-checked`, `aria-expanded`, `aria-haspopup`, `aria-controls`
- And 30+ other ARIA attributes

**Form Attributes:**

- `form`, `formAction`, `formMethod`, `formEncType`, `formTarget`, `formNoValidate`
- `accept`, `acceptCharset`, `capture`, `multiple`, `list`

**Blocked (Dangerous) Attributes:**

- All event handlers: `onClick`, `onChange`, `onLoad`, `onError`, `onAbort`, etc.
- All `on*` attributes (150+ event types)
- Dangerous handlers like `onLoad`, `onError` (can leak data)
- Custom event handlers from user input

**Examples:**

**Basic Usage:**

```tsx
function SecureInput(props: InputProps) {
  const safeProps = getSafeInputProps(props);

  return <input {...safeProps} />;
}
```

**Filtering User Input:**

```tsx
// User provides potentially dangerous props
const userProps = {
  placeholder: 'Enter text',
  onClick: () => alert('XSS'), // ❌ Blocked
  onLoad: () => fetch('/steal-data'), // ❌ Blocked
  'aria-label': 'Username', // ✅ Allowed
  className: 'form-control', // ✅ Allowed
};

const safeProps = getSafeInputProps(userProps);
// Result: { placeholder, aria-label, className }
// onClick and onLoad are removed
```

**Component with Controlled Events:**

```tsx
function Input({ onChange, ...restProps }: InputProps) {
  // Filter rest props for security
  const safeProps = getSafeInputProps(restProps);

  // Apply your own controlled onChange
  return (
    <input
      {...safeProps}
      onChange={onChange} // Your controlled handler
    />
  );
}
```

**Form Components:**

```tsx
function FormField({ label, error, helperText, ...inputProps }: FormFieldProps) {
  const safeProps = getSafeInputProps(inputProps);

  return (
    <div>
      <label>{label}</label>
      <input {...safeProps} aria-invalid={!!error} />
      {error && <span>{error}</span>}
      {helperText && <span>{helperText}</span>}
    </div>
  );
}
```

**User-Generated Form Builder:**

```tsx
function DynamicField({ config }: { config: UserFieldConfig }) {
  // User provides field configuration
  // Filter to only safe attributes
  const safeProps = getSafeInputProps(config.inputProps);

  return (
    <input
      type={config.type}
      {...safeProps}
      // Add your own validated handlers
      onChange={(e) => handleChange(config.id, e.target.value)}
    />
  );
}
```

**Best Practices:**

```tsx
// ✅ Good: Filter user-provided props
function Component(userProps: Record<string, unknown>) {
  const safe = getSafeInputProps(userProps);
  return <input {...safe} />;
}

// ✅ Good: Controlled event handlers
function Component({ userProps, onChange }: Props) {
  const safe = getSafeInputProps(userProps);
  return <input {...safe} onChange={onChange} />;
}

// ❌ Bad: Spreading unfiltered user props
function Component(userProps: Record<string, unknown>) {
  return <input {...userProps} />; // XSS risk!
}

// ❌ Bad: Allowing event handlers from user input
function Component(props: any) {
  return <input {...props} />; // Can inject onClick, onError, etc.
}
```

**Security Features:**

1. **XSS Prevention:**
   - Blocks `onClick`, `onChange`, and other event handlers
   - Prevents event handler injection from user input
   - Whitelist approach (explicit allow list)

2. **Data Leak Prevention:**
   - Blocks `onLoad`, `onError`, `onAbort` (can leak timing data)
   - Prevents network request triggers from malicious props

3. **Comprehensive ARIA Support:**
   - All ARIA attributes allowed for accessibility
   - No security risk from ARIA attributes

---

## UI Components

### `ClearIcon`

SVG icon component for clear/close actions using Bootstrap Icons design language.

**Signature:**

```tsx
function ClearIcon(): React.JSX.Element;
```

**Examples:**

**Clear Button:**

```tsx
function ClearableInput({ value, onChange, onClear }: Props) {
  return (
    <div className="input-wrapper">
      <input value={value} onChange={onChange} />
      {value && (
        <button type="button" onClick={onClear} aria-label="Clear input">
          <ClearIcon />
        </button>
      )}
    </div>
  );
}
```

**With Visible Text:**

```tsx
<button>
  <ClearIcon />
  <span>Clear</span>
</button>
```

**Modal Close Button:**

```tsx
function Modal({ onClose }: ModalProps) {
  return (
    <div role="dialog">
      <button className="close-button" onClick={onClose} aria-label="Close modal">
        <ClearIcon />
      </button>
    </div>
  );
}
```

**Removable Tag:**

```tsx
function Tag({ label, onRemove }: TagProps) {
  return (
    <span className="tag">
      {label}
      <button onClick={onRemove} aria-label={`Remove ${label}`}>
        <ClearIcon />
      </button>
    </span>
  );
}
```

**Features:**

- Automatically includes `aria-hidden="true"`
- 16x16px size by default
- Bootstrap Icons X design
- Accessible when used with proper labeling

**Accessibility:**

```tsx
// ✅ Good: Icon with aria-label on button
<button aria-label="Clear">
  <ClearIcon />
</button>

// ✅ Good: Icon with visible text
<button>
  <ClearIcon />
  <span>Clear</span>
</button>

// ❌ Bad: Icon alone without label
<button>
  <ClearIcon />
</button>
```

---

## FSM Event Factories

Utilities for creating finite state machine events for selection management in components like CardList and CheckboxGroup.

### `toggleItemEvent`

Create event for toggling single item selection state.

**Signature:**

```tsx
interface ToggleItemEvent {
  type: 'TOGGLE_ITEM';
  value: string;
  totalEnabled: number;
}

function toggleItemEvent(value: string, totalEnabled: number): ToggleItemEvent;
```

**Example:**

```tsx
const event = toggleItemEvent('item-1', 5);
// { type: 'TOGGLE_ITEM', value: 'item-1', totalEnabled: 5 }

dispatch(toggleItemEvent(cardId, enabledCards.length));
```

---

### `selectAllEvent`

Create event for selecting all items.

**Signature:**

```tsx
interface SelectAllEvent {
  type: 'SELECT_ALL';
}

function selectAllEvent(): SelectAllEvent;
```

**Example:**

```tsx
const handleSelectAll = () => {
  dispatch(selectAllEvent());
};

<button onClick={handleSelectAll}>Select All</button>;
```

---

### `clearAllEvent`

Create event for clearing all selections.

**Signature:**

```tsx
interface ClearAllEvent {
  type: 'CLEAR_ALL';
}

function clearAllEvent(): ClearAllEvent;
```

**Example:**

```tsx
const handleClearAll = () => {
  dispatch(clearAllEvent());
};

<button onClick={handleClearAll}>Clear All</button>;
```

---

### `toggleAllEvent`

Create event for toggling all items (select all if none/some selected, clear all if all selected).

**Signature:**

```tsx
interface ToggleAllEvent {
  type: 'TOGGLE_ALL';
  totalEnabled: number;
}

function toggleAllEvent(totalEnabled: number): ToggleAllEvent;
```

**Example:**

```tsx
const handleToggleAll = () => {
  dispatch(toggleAllEvent(enabledItems.length));
};

<Checkbox checked={allSelected} indeterminate={someSelected} onChange={handleToggleAll} />;
```

---

## Helper Utilities

### `mapPlacement`

Map placement strings to positioning coordinates or class names.

**Usage:**

```tsx
const position = mapPlacement('top-start');
// Returns positioning data for tooltip/popover
```

---

### `normalizeTriggers`

Normalize trigger strings to standard event names.

**Usage:**

```tsx
const triggers = normalizeTriggers('hover focus');
// Returns ['mouseenter', 'focus']
```

---

## Common Patterns

### Secure Form Builder

```tsx
function SecureFormBuilder({ fields }: Props) {
  return (
    <form>
      {fields.map((field) => {
        const safeProps = getSafeInputProps(field.props);

        return (
          <div key={field.id}>
            <label>{field.label}</label>
            <input
              type={field.type}
              {...safeProps}
              onChange={(e) => handleFieldChange(field.id, e)}
            />
          </div>
        );
      })}
    </form>
  );
}
```

### Selection Management with FSM

```tsx
function SelectableList({ items }: Props) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleToggleItem = (id: string) => {
    dispatch(toggleItemEvent(id, items.length));
  };

  const handleToggleAll = () => {
    dispatch(toggleAllEvent(items.length));
  };

  return (
    <>
      <Checkbox
        checked={state.selectionState === 'all'}
        indeterminate={state.selectionState === 'some'}
        onChange={handleToggleAll}
      >
        Select All
      </Checkbox>

      {items.map((item) => (
        <Checkbox
          key={item.id}
          checked={state.selected.includes(item.id)}
          onChange={() => handleToggleItem(item.id)}
        >
          {item.label}
        </Checkbox>
      ))}
    </>
  );
}
```

### Clearable Input Component

```tsx
function ClearableInput({ value, onChange, ...restProps }: ClearableInputProps) {
  const safeProps = getSafeInputProps(restProps);

  const handleClear = () => {
    onChange('');
  };

  return (
    <div className="clearable-input">
      <input {...safeProps} value={value} onChange={(e) => onChange(e.target.value)} />
      {value && (
        <button
          type="button"
          className="clear-button"
          onClick={handleClear}
          aria-label="Clear input"
        >
          <ClearIcon />
        </button>
      )}
    </div>
  );
}
```

---

## Security Notes

**SAFE_INPUT_ATTRIBUTES Whitelist:**

The whitelist approach ensures only known-safe attributes are allowed. This prevents:

1. **Event Handler Injection:**

   ```tsx
   // User tries to inject onClick
   const malicious = { onClick: () => stealData() };
   const safe = getSafeInputProps(malicious);
   // Result: {} (onClick removed)
   ```

2. **Resource Loading Attacks:**

   ```tsx
   // User tries to inject onLoad
   const malicious = { onLoad: () => fetch('/track') };
   const safe = getSafeInputProps(malicious);
   // Result: {} (onLoad removed)
   ```

3. **Error Handler Exploitation:**

   ```tsx
   // User tries to inject onError
   const malicious = { onError: () => logTimingData() };
   const safe = getSafeInputProps(malicious);
   // Result: {} (onError removed)
   ```

**Always use with user-provided props or dynamic form configurations.**

---

## Related Documentation

- [Main Utils README](../README.md)
- [Validation Utilities](../validation/README.md)
- [Accessibility Utilities](../a11y/README.md)
- [React Component Library](../../README.md)

---

## License

Copyright © 2026 DSAi. All rights reserved.
