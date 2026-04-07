# React — Code Examples

## S6481 — Context provider values must be stable

```typescript
// BAD — new object created every render
function ThemeProvider({ children }: Props) {
  const [theme, setTheme] = useState('light');
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// GOOD — memoized value
function ThemeProvider({ children }: Props) {
  const [theme, setTheme] = useState('light');
  const ctxValue = useMemo(() => ({ theme, setTheme }), [theme]);
  return (
    <ThemeContext.Provider value={ctxValue}>
      {children}
    </ThemeContext.Provider>
  );
}
```

## S6819 — Semantic HTML over ARIA roles

```typescript
// BAD
<div role="navigation" className="nav-container">...</div>
<div role="separator" className="divider" />
<span role="button" onClick={handleClick}>Click</span>

// GOOD
<nav className="nav-container">...</nav>
<hr className="divider" />
<button onClick={handleClick}>Click</button>
```

Full mapping:

| Instead of | Use |
|------------|-----|
| `<div role="navigation">` | `<nav>` |
| `<div role="banner">` | `<header>` |
| `<div role="contentinfo">` | `<footer>` |
| `<div role="complementary">` | `<aside>` |
| `<div role="main">` | `<main>` |
| `<div role="separator">` | `<hr>` |
| `<div role="img">` | `<img alt="...">` |
| `<span role="button">` | `<button>` |
| `<div role="dialog">` | `<dialog>` |
| `<div role="group">` | `<fieldset>` |
| `<div role="article">` | `<article>` |
| `<div role="region">` | `<section>` |

Preserve all existing className, style, and other props when converting.

## S6478 — Don't nest component definitions

```typescript
// BAD — Inner component recreated every render
function ParentComponent() {
  function ChildComponent() {
    return <div>child</div>;
  }
  return <ChildComponent />;
}

// GOOD — define outside
function ChildComponent() {
  return <div>child</div>;
}

function ParentComponent() {
  return <ChildComponent />;
}
```

## S6756 — setState callback for previous state

```typescript
// BAD — stale state reference
function Counter() {
  const [count, setCount] = useState(0);
  const increment = () => setCount(count + 1);
}

// GOOD — callback form
function Counter() {
  const [count, setCount] = useState(0);
  const increment = () => setCount((prev) => prev + 1);
}
```

## S6477 — Unique key props in lists

```typescript
// BAD — index as key
{items.map((item, index) => (
  <ListItem key={index} item={item} />
))}

// BAD — no key
{items.map((item) => (
  <ListItem item={item} />
))}

// GOOD — stable unique key
{items.map((item) => (
  <ListItem key={item.id} item={item} />
))}
```

## S6785 — Non-boolean condition values

```typescript
// BAD — renders "0" when count is 0
{count && <Badge count={count} />}

// GOOD — explicit boolean
{count > 0 && <Badge count={count} />}
// or
{Boolean(count) && <Badge count={count} />}
```

## S6766 — Hooks must be called properly

```typescript
// BAD — conditional hook
function Component({ enabled }: Props) {
  if (enabled) {
    const [state, setState] = useState(false); // breaks Rules of Hooks
  }
}

// GOOD — always call hooks at top level
function Component({ enabled }: Props) {
  const [state, setState] = useState(false);
  // use `enabled` conditionally in the render, not around the hook
}
```

## S6749 — No redundant fragments

```typescript
// BAD
return <>{children}</>;
return <><Component /></>;

// GOOD
return children;
return <Component />;
```

Fragments ARE needed when returning multiple siblings: `<><A /><B /></>`

## S6757 — No children with dangerouslySetInnerHTML

```typescript
// BAD
<div dangerouslySetInnerHTML={{ __html: html }}>
  <span>child</span>
</div>

// GOOD — one or the other
<div dangerouslySetInnerHTML={{ __html: html }} />
// or
<div><span>child</span></div>
```

## S6759 — Props should be read-only

```typescript
// BAD
interface ButtonProps {
  label: string;
  onClick: () => void;
}

// GOOD — use Readonly wrapper
function Button(props: Readonly<ButtonProps>) {}

// Or mark individual fields
interface ButtonProps {
  readonly label: string;
  readonly onClick: () => void;
}
```

## S6769 — Don't set state with its own value

```typescript
// BAD
const [count, setCount] = useState(0);
setCount(count); // no-op that triggers re-render

// GOOD — only set when value changes
if (newCount !== count) {
  setCount(newCount);
}
```

## S6844 — tabIndex should be 0 or -1

```typescript
// BAD — positive tabIndex disrupts natural tab order
<div tabIndex={5}>...</div>

// GOOD
<div tabIndex={0}>...</div>   // focusable in natural order
<div tabIndex={-1}>...</div>  // programmatically focusable only
```

## S6824 — Anchors should not be buttons

```typescript
// BAD
<a href="#" onClick={handleClick}>Delete</a>
<a href="javascript:void(0)" onClick={handleClick}>Save</a>

// GOOD
<button onClick={handleClick}>Delete</button>
<button onClick={handleClick}>Save</button>
```
