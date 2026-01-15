# Developer Experience (DX) Utilities

Developer experience utilities for component development, debugging, and React patterns.

## Overview

This module provides utilities for:

- Component display names
- Development warnings and assertions
- Type-safe context creation
- Component factories
- Polymorphic components

## Installation

```tsx
import {
  getDisplayName,
  warn,
  invariant,
  createContext,
  createComponent,
  createPolymorphic,
} from '@dsai-io/react';
```

---

## Debugging

### `getDisplayName`

Extract display name from React component.

**Signature:**

```tsx
function getDisplayName(Component: React.ComponentType<unknown>): string;
```

**Examples:**

```tsx
const name = getDisplayName(MyComponent); // 'MyComponent'
const name = getDisplayName(memo(Button)); // 'Button'
```

---

### `warn`

Development-only console warnings.

**Signature:**

```tsx
function warn(message: string, ...args: unknown[]): void;
```

**Examples:**

```tsx
if (invalidProp) {
  warn('Invalid prop value:', propValue);
}
```

---

### `warnOnce`

Warn only once per unique message.

**Signature:**

```tsx
function warnOnce(message: string): void;
function clearWarnings(): void;
```

**Examples:**

```tsx
// Only logs once
warnOnce('Deprecated: Use newProp instead');
warnOnce('Deprecated: Use newProp instead'); // Silent

// Clear cache
clearWarnings();
```

---

### `invariant`

Runtime assertions for critical conditions.

**Signature:**

```tsx
function invariant(condition: boolean, message: string): asserts condition;
```

**Examples:**

```tsx
invariant(user !== null, 'User must be authenticated');
invariant(items.length > 0, 'Items array cannot be empty');

// TypeScript narrows type after assertion
const value: string | null = getValue();
invariant(value !== null, 'Value required');
// value is string here
```

---

### `isDev`

Check if running in development mode.

**Signature:**

```tsx
function isDev(): boolean;
```

**Examples:**

```tsx
if (isDev()) {
  console.log('Debug info:', data);
}
```

---

## Context Patterns

### `createContext`

Type-safe context creation with automatic error handling.

**Signature:**

```tsx
function createContext<T>(options: CreateContextOptions<T>): ContextReturn<T>;

interface ContextReturn<T> {
  Provider: React.Provider<T>;
  useContext: () => T;
}
```

**Examples:**

```tsx
// Basic context
const { Provider, useContext: useTheme } = createContext<Theme>({
  name: 'ThemeContext',
  defaultValue: defaultTheme,
});

function App() {
  return (
    <Provider value={theme}>
      <Component />
    </Provider>
  );
}

function Component() {
  const theme = useTheme(); // Type-safe, throws if outside Provider
  return <div style={{ color: theme.primaryColor }} />;
}

// With error message
const { Provider, useContext } = createContext<AuthContext>({
  name: 'AuthContext',
  errorMessage: 'useAuth must be used within AuthProvider',
});
```

---

## Component Factories

### `createComponent`

Factory for creating components with common patterns.

**Signature:**

```tsx
function createComponent<P>(options: CreateComponentOptions<P>): React.FC<P>;
```

**Examples:**

```tsx
const Button = createComponent({
  displayName: 'Button',
  defaultProps: {
    variant: 'primary',
    size: 'md',
  },
  render: ({ variant, size, children, ...props }) => (
    <button className={`btn-${variant} btn-${size}`} {...props}>
      {children}
    </button>
  ),
});
```

---

### `createPolymorphic`

Create polymorphic components that can render as any element.

**Signature:**

```tsx
function createPolymorphic<P>(options: CreatePolymorphicOptions<P>): PolymorphicComponent<P>;

interface PolymorphicProps<E extends React.ElementType, P> {
  as?: E;
  // ... component props
}
```

**Examples:**

```tsx
// Define polymorphic component
const Text = createPolymorphic({
  defaultElement: 'span',
  displayName: 'Text',
  render: ({ as: Element = 'span', ...props }) => (
    <Element {...props} />
  )
});

// Usage
<Text>Default span</Text>
<Text as="p">Paragraph</Text>
<Text as="h1">Heading</Text>
<Text as={Link} href="/">Link</Text>

// Fully typed
<Text as="a" href="/">  {/* href required */}
<Text as="button" onClick={() => {}}>  {/* onClick available */}
```

---

## Common Patterns

### Type-Safe Context

```tsx
interface UserContextValue {
  user: User | null;
  login: (credentials: Credentials) => Promise<void>;
  logout: () => void;
}

const { Provider: UserProvider, useContext: useUser } = createContext<UserContextValue>({
  name: 'UserContext',
  errorMessage: 'useUser must be used within UserProvider',
});

export { UserProvider, useUser };
```

### Development Assertions

```tsx
function DataTable({ data, columns }: Props) {
  invariant(columns.length > 0, 'DataTable: columns array cannot be empty');

  if (isDev() && data.length === 0) {
    warn('DataTable: data array is empty');
  }

  // ...
}
```

---

## Best Practices

1. **Use invariant for critical conditions:**

```tsx
invariant(config !== null, 'Config not initialized');
```

1. **Prefer warnOnce for deprecation warnings:**

```tsx
warnOnce(`${propName} is deprecated. Use ${newPropName} instead`);
```

1. **Always name contexts:**

```tsx
const { Provider, useContext } = createContext({
  name: 'MyFeatureContext',
});
```

1. **Set displayName for debugging:**

```tsx
MyComponent.displayName = 'MyComponent';
```

---

## Related Documentation

- [Main Utils README](../README.md)
- [React Component Library](../../README.md)
- [Types Utilities](../types/README.md)

---

## License

Copyright © 2024 DSAi. All rights reserved.
