# Object Utilities

Immutable object manipulation utilities for deep merging, picking, and omitting properties.

## Overview

This module provides utilities for:

- Deep object merging
- Property picking
- Property omitting

## Installation

```tsx
import { deepMerge, pick, omit } from '@dsai-io/react';
```

---

## Functions

### `deepMerge`

Deep merge multiple objects immutably.

**Signature:**

```tsx
function deepMerge<T>(...objects: Partial<T>[]): T;
```

**Examples:**

```tsx
// Basic merge
const result = deepMerge({ a: 1, b: { c: 2 } }, { b: { d: 3 } });
// { a: 1, b: { c: 2, d: 3 } }

// Configuration merge
const config = deepMerge(defaultConfig, userConfig, envConfig);

// Theme merge
const theme = deepMerge(baseTheme, customTheme);
```

---

### `pick`

Create new object with only specified properties.

**Signature:**

```tsx
function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K>;
```

**Examples:**

```tsx
// Pick specific properties
const user = {
  id: 1,
  name: 'John',
  email: 'john@example.com',
  password: 'secret',
};

const publicUser = pick(user, ['id', 'name']);
// { id: 1, name: 'John' }

// Extract subset for API
const payload = pick(formData, ['firstName', 'lastName', 'email']);
```

---

### `omit`

Create new object excluding specified properties.

**Signature:**

```tsx
function omit<T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K>;
```

**Examples:**

```tsx
// Remove sensitive data
const safeUser = omit(user, ['password', 'ssn']);

// Remove metadata
const data = omit(response, ['__typename', 'metadata']);

// Forward props
const forwardProps = omit(props, ['children', 'className', 'style']);
```

---

## Common Patterns

### Merge Component Props

```tsx
function Component(props: Props) {
  const defaultProps = {
    variant: 'primary',
    size: 'md',
    disabled: false,
  };

  const mergedProps = deepMerge(defaultProps, props);
  return <button {...mergedProps} />;
}
```

### Extract API Payload

```tsx
function updateUser(formData: FormData) {
  // Only send allowed fields
  const payload = pick(formData, ['firstName', 'lastName', 'email', 'phone']);

  return api.put('/user', payload);
}
```

### Filter Props

```tsx
function InputWrapper({ helperText, error, ...props }: Props) {
  // Remove custom props before passing to input
  const inputProps = omit(props, ['label', 'required']);

  return (
    <div>
      <input {...inputProps} />
      {helperText && <span>{helperText}</span>}
    </div>
  );
}
```

---

## Best Practices

1. **Use pick for allowlists:**

```tsx
const allowed = pick(data, allowedFields);
```

1. **Use omit for blocklists:**

```tsx
const safe = omit(data, sensitiveFields);
```

1. **Prefer shallow operations when possible:**

```tsx
const { password, ...safe } = user;
```

1. **Deep merge for nested config:**

```tsx
const config = deepMerge(defaults, userOverrides);
```

---

## Performance Notes

- deepMerge creates new objects (immutable)
- pick/omit are O(n) where n = number of keys
- Use spread operator for shallow operations

---

## Related Documentation

- [Main Utils README](../README.md)
- [Collections Utilities](../collections/README.md)
- [Types Utilities](../types/README.md)

---

## License

Copyright © 2024 DSAi. All rights reserved.
