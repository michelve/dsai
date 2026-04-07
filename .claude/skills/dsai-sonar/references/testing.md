# Testing — Code Examples

## S2699 — Tests must include assertions

```typescript
// BAD — no assertion
it('renders correctly', () => {
  render(<Button />);
});

// GOOD
it('renders correctly', () => {
  render(<Button label="Click" />);
  expect(screen.getByRole('button')).toBeInTheDocument();
});
```

## S2757 — Assertions should be complete

```typescript
// BAD — incomplete assertion (missing .toBe, .toEqual, etc.)
expect(result);
expect(value).not;

// GOOD
expect(result).toBe(true);
expect(value).not.toBeNull();
```

## S6544 — No .only tests committed

```typescript
// BAD — blocks other tests in CI
describe.only('Button', () => { /* ... */ });
it.only('renders', () => { /* ... */ });

// GOOD
describe('Button', () => { /* ... */ });
it('renders', () => { /* ... */ });
```

## S6643 — Don't skip tests without reason

```typescript
// BAD
it.skip('handles edge case', () => { /* ... */ });
xit('handles edge case', () => { /* ... */ });

// GOOD — explain why
it.skip('handles edge case — blocked by #123', () => { /* ... */ });
// Or better: fix the issue and unskip
```

## S5958 — Check which exception is thrown

```typescript
// BAD — too broad
expect(() => parse(invalid)).toThrow();

// GOOD — specific error
expect(() => parse(invalid)).toThrow(SyntaxError);
expect(() => parse(invalid)).toThrow('Invalid token');
```

## S5863 — Don't pass same argument twice

```typescript
// BAD
expect(value).toBe(value); // always passes
expect(arr).toEqual(arr);   // always passes

// GOOD
expect(value).toBe(expected);
expect(arr).toEqual(expectedArr);
```

## S5869 — Assertion arguments in correct order

```typescript
// BAD — expected/actual swapped
expect(42).toBe(result);

// GOOD — actual first (Jest convention)
expect(result).toBe(42);
```

## S6572 — Tests should be stable

```typescript
// BAD — relies on timing
it('debounces', async () => {
  trigger();
  await new Promise((r) => setTimeout(r, 100));
  expect(callback).toHaveBeenCalled();
});

// GOOD — use fake timers
it('debounces', () => {
  jest.useFakeTimers();
  trigger();
  jest.advanceTimersByTime(100);
  expect(callback).toHaveBeenCalled();
  jest.useRealTimers();
});
```

## S6647 — No code after done()

```typescript
// BAD
it('fetches data', (done) => {
  fetchData((data) => {
    expect(data).toBeDefined();
    done();
    cleanup(); // runs after done — unreliable
  });
});

// GOOD
it('fetches data', (done) => {
  fetchData((data) => {
    expect(data).toBeDefined();
    cleanup();
    done(); // done is always last
  });
});

// Better: use async/await
it('fetches data', async () => {
  const data = await fetchData();
  expect(data).toBeDefined();
  cleanup();
});
```

## S1135 — Track TODO/FIXME tags

TODO and FIXME comments are tracked as INFO-level issues. They're acceptable but should reference a ticket:

```typescript
// BAD
// TODO: fix this later

// GOOD
// TODO(#456): migrate to new auth API after v2 release
```

## General testing best practices for this project

From CLAUDE.md:
- Use jest-axe for accessibility tests
- Prefer accessible queries: `getByRole`, `getByLabelText`
- Test behavior, not implementation
- Test structure: Rendering, User Interactions, Keyboard Navigation, Accessibility
- Coverage target: 90%+
