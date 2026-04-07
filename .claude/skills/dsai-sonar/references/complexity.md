# Complexity — Code Examples

## S1541 — Cyclomatic complexity max 10

Extract branches into helpers or lookup maps. Use early returns.

```typescript
// BAD — complexity 12+
function getVariant(state: State, props: Props) {
  if (props.disabled) return 'disabled';
  if (props.loading) return 'loading';
  switch (state) {
    case 'idle': return props.outline ? 'outline' : 'filled';
    case 'hover': return props.outline ? 'outline-hover' : 'hover';
    case 'pressed': return props.outline ? 'outline-pressed' : 'pressed';
    // ... many more cases
  }
}

// GOOD — split complexity across functions
const VARIANT_MAP: Record<State, (outline: boolean) => string> = {
  idle: (outline) => outline ? 'outline' : 'filled',
  hover: (outline) => outline ? 'outline-hover' : 'hover',
  pressed: (outline) => outline ? 'outline-pressed' : 'pressed',
};

function getVariant(state: State, props: Props) {
  if (props.disabled) return 'disabled';
  if (props.loading) return 'loading';
  return VARIANT_MAP[state]?.(props.outline) ?? 'filled';
}
```

## S3776 — Cognitive complexity max 15

Nesting multiplies cognitive cost. Flatten with guard clauses and extracted functions.

```typescript
// BAD — cognitive complexity 18+
function processItems(items: Item[]) {
  for (const item of items) {
    if (item.active) {
      if (item.type === 'group') {
        for (const child of item.children) {
          if (child.visible) {
            // deep logic here
          }
        }
      }
    }
  }
}

// GOOD — flatten with helpers
function processVisibleChild(child: Item) { /* ... */ }

function processGroup(item: Item) {
  for (const child of item.children) {
    if (!child.visible) continue;
    processVisibleChild(child);
  }
}

function processItems(items: Item[]) {
  for (const item of items) {
    if (!item.active) continue;
    if (item.type === 'group') processGroup(item);
  }
}
```

## S134 — Max nesting depth 3

Use guard clauses (early return/continue) to avoid deep nesting.

```typescript
// BAD — 4 levels deep
function handleUpdate(ref: RefObject<HTMLElement>, isOpen: boolean, items: Item[]) {
  if (ref.current) {
    if (isOpen) {
      if (items.length > 0) {
        for (const item of items) { /* ... */ }
      }
    }
  }
}

// GOOD — guard clauses
function handleUpdate(ref: RefObject<HTMLElement>, isOpen: boolean, items: Item[]) {
  if (!ref.current || !isOpen || items.length === 0) return;
  for (const item of items) { /* ... */ }
}
```

## S107 — Max 7 function parameters

Group into an options object.

```typescript
// BAD — 8 parameters
function buildTheme(
  name: string, variant: string, size: string, disabled: boolean,
  loading: boolean, icon: ReactNode, tooltip: string, className: string,
) {}

// GOOD — options object
interface BuildThemeOptions {
  name: string;
  variant: string;
  size: string;
  disabled?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  tooltip?: string;
  className?: string;
}

function buildTheme(options: BuildThemeOptions) {}
```

## S1192 — Duplicated string literals (3+ times)

```typescript
// BAD
if (variant === 'primary') { /* ... */ }
className = variant === 'primary' ? 'btn-primary' : '';
const isPrimary = variant === 'primary';

// GOOD
const PRIMARY_VARIANT = 'primary';
if (variant === PRIMARY_VARIANT) { /* ... */ }
className = variant === PRIMARY_VARIANT ? 'btn-primary' : '';
const isPrimary = variant === PRIMARY_VARIANT;
```

## S109 — Magic numbers

```typescript
// BAD
if (columns > 3) {}
await delay(150);
const maxRetries = 5;

// GOOD
const MAX_COLUMNS = 3;
const DEBOUNCE_MS = 150;
const MAX_RETRIES = 5;
if (columns > MAX_COLUMNS) {}
await delay(DEBOUNCE_MS);
```

## S3358 — Nested ternaries

```typescript
// BAD
const label = isLoading ? 'Loading...' : isError ? 'Error' : 'Submit';

// GOOD — if/else or helper
function getLabel(isLoading: boolean, isError: boolean) {
  if (isLoading) return 'Loading...';
  if (isError) return 'Error';
  return 'Submit';
}
```

## S4624 — Nested template literals

```typescript
// BAD
const msg = `Error: ${`${name} failed at ${line}`}`;

// GOOD
const detail = `${name} failed at ${line}`;
const msg = `Error: ${detail}`;
```

## S881 / S1121 — Side effects inside expressions

```typescript
// BAD
const id = counter++;
const result = (cache = buildCache());

// GOOD
const id = counter;
counter += 1;
cache = buildCache();
const result = cache;
```
