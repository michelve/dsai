# Input

A flexible text input component built with Bootstrap 5 classes. Supports multiple types, sizes, validation states, and addons.

## Features

- 📝 Multiple input types (text, email, password, number, tel, url, search)
- 📏 Three sizes (sm, md, lg)
- ✅ Validation states (error, success)
- 🔤 Prefix and suffix addons
- ❌ Optional clear button
- 🔢 Character counter
- 🏷️ Floating labels
- ♿ WCAG 2.2 AA compliant

## Installation

```bash
npm install @dsai/react
```

## Usage

### Basic Input

```tsx
import { Input } from '@dsai/react';

function Example() {
  return <Input label="Name" placeholder="Enter your name" />;
}
```

### Input Types

```tsx
// Text (default)
<Input label="Name" type="text" />

// Email
<Input label="Email" type="email" />

// Password
<Input label="Password" type="password" />

// Number
<Input label="Quantity" type="number" min={0} max={100} />

// Phone
<Input label="Phone" type="tel" />

// URL
<Input label="Website" type="url" />

// Search
<Input label="Search" type="search" />
```

### Sizes

```tsx
<Input label="Small" size="sm" />
<Input label="Medium" size="md" />
<Input label="Large" size="lg" />
```

### Validation States

```tsx
// Error state
<Input
  label="Email"
  type="email"
  error
  helperText="Please enter a valid email address"
/>

// Success state
<Input
  label="Username"
  success
  helperText="Username is available"
/>
```

### Prefix and Suffix

```tsx
// Text prefix
<Input label="Price" prefix="$" type="number" />

// Text suffix
<Input label="Email" suffix="@company.com" />

// Both
<Input label="Amount" prefix="$" suffix=".00" />

// Icon prefix
<Input
  label="Search"
  prefix={<SearchIcon />}
  type="search"
/>
```

### Clear Button

```tsx
function SearchInput() {
  const [value, setValue] = useState('');

  return (
    <Input
      label="Search"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      clearable
      onClear={() => setValue('')}
    />
  );
}
```

### Character Counter

```tsx
<Input label="Bio" maxLength={150} showCount helperText="Brief description about yourself" />
```

### Floating Label

```tsx
<Input label="Email address" floating placeholder="name@example.com" />
```

### Controlled vs Uncontrolled

```tsx
// Controlled
function ControlledInput() {
  const [value, setValue] = useState('');

  return <Input label="Controlled" value={value} onChange={(e) => setValue(e.target.value)} />;
}

// Uncontrolled
<Input label="Uncontrolled" defaultValue="Initial value" />;
```

### Form Integration

```tsx
// With React Hook Form
import { useForm } from 'react-hook-form';

function Form() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        label="Email"
        type="email"
        error={!!errors.email}
        helperText={errors.email?.message}
        {...register('email', { required: 'Email is required' })}
      />
      <button type="submit">Submit</button>
    </form>
  );
}
```

## Props

| Prop             | Type                                                                        | Default  | Description              |
| ---------------- | --------------------------------------------------------------------------- | -------- | ------------------------ |
| `type`           | `'text' \| 'email' \| 'password' \| 'number' \| 'tel' \| 'url' \| 'search'` | `'text'` | Input type               |
| `size`           | `'sm' \| 'md' \| 'lg'`                                                      | `'md'`   | Input size               |
| `label`          | `ReactNode`                                                                 | -        | Input label              |
| `helperText`     | `string`                                                                    | -        | Helper or error message  |
| `error`          | `boolean`                                                                   | `false`  | Error state              |
| `success`        | `boolean`                                                                   | `false`  | Success state            |
| `prefix`         | `ReactNode`                                                                 | -        | Content before input     |
| `suffix`         | `ReactNode`                                                                 | -        | Content after input      |
| `clearable`      | `boolean`                                                                   | `false`  | Show clear button        |
| `onClear`        | `() => void`                                                                | -        | Clear button callback    |
| `showCount`      | `boolean`                                                                   | `false`  | Show character counter   |
| `floating`       | `boolean`                                                                   | `false`  | Floating label style     |
| `plaintext`      | `boolean`                                                                   | `false`  | Plaintext readonly style |
| `className`      | `string`                                                                    | -        | Wrapper class            |
| `inputClassName` | `string`                                                                    | -        | Input element class      |
| `required`       | `boolean`                                                                   | `false`  | Required field           |

Plus all native `<input>` attributes.

## Accessibility

The Input component follows WCAG 2.2 AA guidelines:

- Uses semantic `<input>` element
- Label associated via `htmlFor`/`id`
- `aria-invalid` set when error
- `aria-describedby` links to helper text
- `aria-required` set when required
- Clear button has `aria-label`
- Keyboard navigable (Tab, Enter)
- Focus ring visible
- Color contrast compliant

## Bootstrap Classes Used

- `form-control` - Base input styling
- `form-control-sm` - Small size
- `form-control-lg` - Large size
- `form-label` - Label styling
- `form-text` - Helper text
- `form-floating` - Floating label container
- `form-control-plaintext` - Plaintext style
- `input-group` - Addon container
- `input-group-text` - Addon styling
- `is-invalid` - Error state
- `is-valid` - Success state
- `invalid-feedback` - Error message
- `has-validation` - Validation container

## Related Components

- [Checkbox](../Checkbox/README.md) - For boolean inputs
- [Radio](../Radio/README.md) - For single selection
- [Select](../Select/README.md) - For dropdown selection
- [Textarea](../Textarea/README.md) - For multi-line text
