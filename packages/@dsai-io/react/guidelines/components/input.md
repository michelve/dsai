# Input Component Guidelines

The Input component provides single-line text input fields with labels, validation, and helper text.

## Import

```tsx
import { Input } from '@dsai-io/react';
```

## When to Use

Use Input when:

- Collecting single-line text (names, emails, URLs)
- Collecting numbers with text formatting
- User needs to enter freeform content

Do not use Input when:

- Collecting multi-line text (use Textarea)
- Selecting from predefined options (use Select or Radio)
- Toggling a boolean value (use Checkbox or Switch)

## Basic Usage

```tsx
<Input label="Email address" type="email" placeholder="you@example.com" />
```

## With Labels

Always provide a visible label:

```tsx
// Correct - visible label
<Input label="Full name" />

// Correct - label with required indicator
<Input label="Email" required />

// Incorrect - placeholder only
<Input placeholder="Enter name" />
```

## Input Types

```tsx
<Input type="text" label="Username" />
<Input type="email" label="Email" />
<Input type="password" label="Password" />
<Input type="number" label="Age" />
<Input type="tel" label="Phone" />
<Input type="url" label="Website" />
<Input type="search" label="Search" />
```

## Sizes

```tsx
<Input size="sm" label="Small" />
<Input size="md" label="Medium (default)" />
<Input size="lg" label="Large" />
```

## States

### Disabled

```tsx
<Input label="Email" disabled value="user@example.com" />
```

### Read Only

```tsx
<Input label="Account ID" readOnly value="ACC-12345" />
```

### Error State

```tsx
<Input label="Email" error="Please enter a valid email address" value="invalid-email" />
```

### Success State

```tsx
<Input label="Username" success="Username is available" value="cooluser123" />
```

## Helper Text

```tsx
<Input
  label="Password"
  type="password"
  helperText="Must be at least 8 characters with one number"
/>
```

## With Icons

```tsx
// Leading icon
<Input
  label="Search"
  leadingIcon={<Icon name="search" />}
/>

// Trailing icon
<Input
  label="Email"
  trailingIcon={<Icon name="check" />}
/>

// Trailing action button
<Input
  label="Password"
  type="password"
  trailingAction={
    <Button variant="ghost" size="sm" aria-label="Show password">
      <Icon name="eye" />
    </Button>
  }
/>
```

## Controlled vs Uncontrolled

### Controlled (Recommended for forms)

```tsx
const [email, setEmail] = useState('');

<Input label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />;
```

### Uncontrolled

```tsx
<Input label="Name" defaultValue="John Doe" ref={inputRef} />
```

## Form Integration

```tsx
<form onSubmit={handleSubmit}>
  <Input label="Email" name="email" type="email" required />
  <Input label="Password" name="password" type="password" required minLength={8} />
  <Button type="submit">Sign In</Button>
</form>
```

## Validation Patterns

### Required Field

```tsx
<Input label="Name" required error={!name ? 'Name is required' : undefined} />
```

### Pattern Validation

```tsx
<Input
  label="Phone"
  type="tel"
  pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
  placeholder="123-456-7890"
  helperText="Format: 123-456-7890"
/>
```

### Character Limit

```tsx
<Input label="Username" maxLength={20} helperText={`${username.length}/20 characters`} />
```

## Accessibility

- Label is required and automatically associated with input
- Error messages are announced to screen readers
- Focus styles are visible and meet contrast requirements

```tsx
// Correct
<Input label="Email" id="email-input" />

// Also correct - id is auto-generated
<Input label="Email" />
```

## Common Patterns

### Search Input

```tsx
<Input
  type="search"
  label="Search"
  placeholder="Search..."
  leadingIcon={<Icon name="search" />}
  aria-label="Search products"
/>
```

### Password Input with Toggle

```tsx
const [showPassword, setShowPassword] = useState(false);

<Input
  label="Password"
  type={showPassword ? 'text' : 'password'}
  trailingAction={
    <Button
      variant="ghost"
      size="sm"
      aria-label={showPassword ? 'Hide password' : 'Show password'}
      onClick={() => setShowPassword(!showPassword)}
    >
      <Icon name={showPassword ? 'eye-off' : 'eye'} />
    </Button>
  }
/>;
```

## Do's and Don'ts

### Do

- Always provide a visible label
- Use appropriate input type for content
- Provide helpful error messages
- Use placeholder for format hints only

### Don't

- Don't use placeholder as the only label
- Don't disable without explanation
- Don't use for multi-line content
- Don't hide the label (use aria-label only for icon buttons)
