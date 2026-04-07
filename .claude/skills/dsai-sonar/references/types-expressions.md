# Types & Expressions — Code Examples

## S4622 — Union types max 3 inline elements

Extract large unions into named type aliases in the same file or `.types.ts`.

```typescript
// BAD — inline union with 5+ elements
function setSize(size: 'xs' | 'sm' | 'md' | 'lg' | 'xl') {}

// GOOD — named type alias
type ComponentSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
function setSize(size: ComponentSize) {}
```

Note: The rule applies to inline unions in parameters/returns, not to type alias declarations themselves.

## S4325 — No unnecessary type assertions

Remove `as Type` when TypeScript already infers the type.

```typescript
// BAD
const value = getValue() as string; // getValue already returns string
const el = ref.current as HTMLDivElement as HTMLDivElement; // double assertion

// GOOD
const value = getValue();
const el = ref.current;
```

## S4798 — Optional params need defaults

```typescript
// BAD
function renderList(items: Item[], sortable?: boolean) {
  if (sortable) { /* ... */ }
}

// GOOD
function renderList(items: Item[], sortable = false) {
  if (sortable) { /* ... */ }
}

// Also applies to destructured props
// BAD
function Select({ searchable }: SelectProps) {}
// GOOD
function Select({ searchable = false }: SelectProps) {}
```

## S4157 — Omit default type parameters

```typescript
// BAD
const map = new Map<string, unknown>();  // if unknown is the default
type Result = Promise<void>;              // if void is the default

// GOOD — omit when it matches the default
const map = new Map<string>();
type Result = Promise();
```

## S6606 — Use ??= operator

```typescript
// BAD
if (cache === null) cache = buildCache();
config = config ?? defaultConfig;

// GOOD
cache ??= buildCache();
config ??= defaultConfig;
```

## S6582 — Use optional chaining

```typescript
// BAD
const name = user && user.profile && user.profile.name;
if (obj !== null && obj !== undefined && obj.value) {}

// GOOD
const name = user?.profile?.name;
if (obj?.value) {}
```

## S2138 — Use null not undefined

```typescript
// BAD
let ref: HTMLElement | undefined = undefined;
let timer: number | undefined = undefined;

// GOOD
let ref: HTMLElement | null = null;
let timer: number | null = null;
```

Exception: Do NOT change optional parameter defaults or optional property types (`prop?: string` stays as-is).

## S7741 — Direct undefined check, not typeof

```typescript
// BAD
if (typeof value !== 'undefined') {}
if (typeof callback === 'undefined') {}

// GOOD
if (value !== undefined) {}
if (callback === undefined) {}
```

## S7764 — globalThis not window

```typescript
// BAD
window.setTimeout(() => {}, 100);
window.matchMedia('(prefers-reduced-motion)');
window.requestAnimationFrame(callback);

// GOOD
globalThis.setTimeout(() => {}, 100);
globalThis.matchMedia('(prefers-reduced-motion)');
globalThis.requestAnimationFrame(callback);
```

Exception: DOM-specific APIs in React components where `window` is semantically correct (e.g., `window.addEventListener('resize', ...)`).

## S7784 — Use structuredClone

```typescript
// BAD
const copy = JSON.parse(JSON.stringify(obj));

// GOOD
const copy = structuredClone(obj);
```

## S7748 — No zero fractions

```typescript
// BAD
const opacity = 1.0;
const scale = 0.0;

// GOOD
const opacity = 1;
const scale = 0;
```

## S7749 — Digit separators for readability

```typescript
// BAD
const timeout = 60000;
const maxSize = 1048576;

// GOOD
const timeout = 60_000;
const maxSize = 1_048_576;
```

## S4328 — Explicit dependencies

If you import a package, it must be listed in `package.json` dependencies or devDependencies.

## S6564 — No redundant boolean aliases

```typescript
// BAD
type IsActive = boolean;
function check(flag: IsActive) {}

// GOOD
function check(flag: boolean) {}
```

## S4323 — Repeated inline unions to type alias

```typescript
// BAD — same union used in multiple places
function getColor(variant: 'primary' | 'secondary' | 'danger') {}
function getIcon(variant: 'primary' | 'secondary' | 'danger') {}

// GOOD
type Variant = 'primary' | 'secondary' | 'danger';
function getColor(variant: Variant) {}
function getIcon(variant: Variant) {}
```

## S6571 — Redundant string in union

```typescript
// BAD — 'custom' is already covered by `string`
type Size = 'sm' | 'md' | 'lg' | 'custom' | string;

// GOOD
type Size = 'sm' | 'md' | 'lg' | string;
```
