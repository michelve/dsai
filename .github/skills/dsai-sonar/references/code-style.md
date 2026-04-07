# Code Style — Code Examples

## S7735 — Flip negated conditions with else

```typescript
// BAD
if (!isValid) {
  handleError();
} else {
  proceed();
}

// GOOD
if (isValid) {
  proceed();
} else {
  handleError();
}
```

If there's no else block, negated conditions are fine: `if (!ready) return;`

## S7728 — for...of not .forEach()

```typescript
// BAD
items.forEach((item) => {
  process(item);
});

// GOOD
for (const item of items) {
  process(item);
}

// If you need the index
for (const [i, item] of items.entries()) {
  processWithIndex(item, i);
}
```

## S125 — Delete commented-out code

```typescript
// BAD
// function oldHandler() {
//   doSomething();
// }

// GOOD — just delete it. Git history preserves it.
```

## S7763 — Re-export syntax

```typescript
// BAD
import { Button } from './Button';
export { Button };

// GOOD
export { Button } from './Button';
```

## S6759 — Props should be readonly

```typescript
// BAD
interface CardProps {
  title: string;
  onClick: () => void;
}

// GOOD
interface CardProps {
  readonly title: string;
  readonly onClick: () => void;
}

// Or wrap the whole type
function Card(props: Readonly<CardProps>) {}
```

## S7778 — Combine multiple .push() calls

```typescript
// BAD
items.push(a);
items.push(b);
items.push(c);

// GOOD
items.push(a, b, c);
```

## S7770 — Boolean directly, not arrow wrapper

```typescript
// BAD
const filtered = items.filter((x) => Boolean(x));
const filtered = items.filter((x) => !!x);

// GOOD
const filtered = items.filter(Boolean);
```

## S3512 — Template literals not concatenation

```typescript
// BAD
const greeting = 'Hello, ' + name + '!';

// GOOD
const greeting = `Hello, ${name}!`;
```

## S6594 — RegExp.exec() not String.match()

```typescript
// BAD
const result = str.match(pattern);

// GOOD
const result = pattern.exec(str);
```

## S7781 — replaceAll not regex for simple strings

```typescript
// BAD
str.replace(/</g, '&lt;');
str.replace(/<\/svg>/g, '</svg>');

// GOOD
str.replaceAll('<', '&lt;');
str.replaceAll('</svg>', '</svg>');
```

## S7780 — String.raw for backslash-heavy strings

```typescript
// BAD
const path = 'C:\\Users\\name\\docs';

// GOOD
const path = String.raw`C:\Users\name\docs`;
```

## S7776 — Set.has() for lookups

```typescript
// BAD
const VALID_STATUSES = ['active', 'pending', 'resolved'];
if (VALID_STATUSES.includes(status)) {}

// GOOD
const VALID_STATUSES = new Set(['active', 'pending', 'resolved']);
if (VALID_STATUSES.has(status)) {}
```

## S7785 — Top-level await

```typescript
// BAD
async function main() {
  const data = await fetchData();
  process(data);
}
main().catch(console.error);

// GOOD (in ESM modules)
try {
  const data = await fetchData();
  process(data);
} catch (error) {
  console.error(error);
}
```

## S7769 — Math.hypot

```typescript
// BAD
const distance = Math.sqrt(dx * dx + dy * dy);

// GOOD
const distance = Math.hypot(dx, dy);
```

## S6754 — Destructure useState

```typescript
// BAD
const state = useState(false);
const isOpen = state[0];
const setIsOpen = state[1];

// GOOD
const [isOpen, setIsOpen] = useState(false);
```

## S6660 — If-only else to else-if

```typescript
// BAD
if (a) {
  handleA();
} else {
  if (b) {
    handleB();
  }
}

// GOOD
if (a) {
  handleA();
} else if (b) {
  handleB();
}
```

## S1874 — Deprecated APIs

```typescript
// BAD — React 19
import { MutableRefObject } from 'react';
const ref: MutableRefObject<HTMLElement> = useRef(null);

// GOOD
import { RefObject } from 'react';
const ref: RefObject<HTMLElement> = useRef(null);

// BAD — deprecated DOM API
document.execCommand('copy');

// GOOD — Clipboard API
await navigator.clipboard.writeText(text);
```

## S1820 — trimStart/trimEnd

```typescript
// BAD
str.trimLeft();
str.trimRight();

// GOOD
str.trimStart();
str.trimEnd();
```

## S4138 — for...of instead of C-style for

```typescript
// BAD
for (let i = 0; i < items.length; i++) {
  process(items[i]);
}

// GOOD
for (const item of items) {
  process(item);
}
```

## S3626 — Redundant jumps

```typescript
// BAD
function process(items: Item[]) {
  for (const item of items) {
    doWork(item);
    continue; // redundant — already at end of loop
  }
  return; // redundant — already at end of function
}

// GOOD
function process(items: Item[]) {
  for (const item of items) {
    doWork(item);
  }
}
```

## S6551 — Object stringification

```typescript
// BAD — renders as "[object Object]"
const key = `item-${entry.content}`;

// GOOD
const key = `item-${String(entry.content)}`;
// or
const key = `item-${entry.content.id}`;
```
