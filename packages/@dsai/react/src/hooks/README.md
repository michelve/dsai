# DSAi Hooks

Reusable React hooks for the DSAi design system.

## Available Hooks

| Hook               | Description                                                  | Status         |
| ------------------ | ------------------------------------------------------------ | -------------- |
| `useFocusTrap`     | Traps focus within a container for accessible modals/dialogs | ✅ Implemented |
| `useScrollLock`    | Prevents body scroll when modals/overlays are open           | ✅ Implemented |
| `useReducedMotion` | Detects user's reduced motion preference                     | ✅ Implemented |
| `useClickOutside`  | Detects clicks outside element(s)                            | ✅ Implemented |
| `useMediaQuery`    | Tracks media query matches reactively                        | ✅ Implemented |

## Quick Start

```tsx
import { useMediaQuery, useClickOutside, useFocusTrap } from '@dsai/react';

function ResponsiveModal({ isOpen, onClose }: ModalProps) {
  const isMobile = useMediaQuery('(max-width: 767.98px)');
  const modalRef = useRef<HTMLDivElement>(null);

  useFocusTrap(modalRef, isOpen);
  useClickOutside(modalRef, onClose);

  return (
    <div ref={modalRef} className={isMobile ? 'modal--mobile' : 'modal--desktop'}>
      {/* Modal content */}
    </div>
  );
}
```

## Hook Documentation

- [useFocusTrap](./useFocusTrap/README.md) - Accessibility focus management
- [useScrollLock](./useScrollLock/README.md) - Body scroll prevention
- [useReducedMotion](./useReducedMotion/README.md) - Motion preference detection
- [useClickOutside](./useClickOutside/README.md) - Outside click detection
- [useMediaQuery](./useMediaQuery/README.md) - Media query tracking

---

## Testing Hooks

The DSAi hooks library includes comprehensive testing utilities to make writing tests for hooks easier and more consistent.

### Test Utilities Location

All test utilities are located in `hooks/__tests__/`:

```
hooks/
├── __tests__/
│   ├── setup.ts              # Auto-loaded test setup
│   ├── mocks/
│   │   ├── index.ts          # Barrel export
│   │   ├── matchMedia.ts     # matchMedia mock
│   │   ├── resizeObserver.ts # ResizeObserver mock
│   │   └── ssr.ts            # SSR simulation helpers
│   └── utils/
│       ├── index.ts          # Barrel export
│       └── renderHook.ts     # Enhanced renderHook
```

### Setup

The test setup is automatically loaded for all hook tests. It installs global mocks for:

- `window.matchMedia()` - Media query API
- `ResizeObserver` - Element size observation
- Standard DOM APIs (via global test/setup.ts)

### Importing Test Utilities

```ts
// Import mocks
import {
  setMediaQueryMatcher,
  triggerMediaQueryChange,
  triggerResize,
  describeSSR,
  withSSR,
} from '../__tests__/mocks';

// Import rendering utilities
import { renderHook, act, waitFor } from '../__tests__/utils';
```

---

## Testing Patterns

### 1. Basic Hook Test

Test that a hook returns the expected initial value:

```ts
import { renderHook } from '../__tests__/utils';
import { useMediaQuery } from './useMediaQuery';

describe('useMediaQuery', () => {
  it('returns false when query does not match', () => {
    const { result } = renderHook(() => useMediaQuery('(min-width: 1200px)'));
    expect(result.current).toBe(false);
  });
});
```

### 2. Testing State Changes

Test that a hook updates correctly when conditions change:

```ts
import { renderHook, act } from '../__tests__/utils';
import { triggerMediaQueryChange } from '../__tests__/mocks';
import { useMediaQuery } from './useMediaQuery';

it('updates when media query changes', () => {
  const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));

  expect(result.current).toBe(false);

  act(() => {
    triggerMediaQueryChange('(min-width: 768px)', true);
  });

  expect(result.current).toBe(true);
});
```

### 3. Testing with Props

Test hooks that accept dynamic props:

```ts
import { renderHook } from '../__tests__/utils';
import { useMediaQuery } from './useMediaQuery';

it('updates when query prop changes', () => {
  const { result, rerender } = renderHook(({ query }) => useMediaQuery(query), {
    initialProps: { query: '(min-width: 768px)' },
  });

  expect(result.current).toBe(false);

  rerender({ query: '(min-width: 992px)' });

  expect(result.current).toBe(false); // Still false for different query
});
```

### 4. Testing SSR (Server-Side Rendering)

Test that hooks work correctly when window/document are undefined:

```ts
import { renderHook } from '../__tests__/utils';
import { describeSSR } from '../__tests__/mocks';
import { useMediaQuery } from './useMediaQuery';

describeSSR('useMediaQuery in SSR', () => {
  it('returns default value during SSR', () => {
    const { result } = renderHook(() =>
      useMediaQuery('(min-width: 768px)', { defaultValue: true })
    );
    expect(result.current).toBe(true);
  });

  it('does not crash without window', () => {
    expect(() => {
      renderHook(() => useMediaQuery('(min-width: 768px)'));
    }).not.toThrow();
  });
});
```

Alternative SSR testing with `withSSR`:

```ts
import { withSSR } from '../__tests__/mocks';

it('handles SSR gracefully', () => {
  const result = withSSR(() => {
    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    return result.current;
  });

  expect(result).toBe(false);
});
```

### 5. Testing Cleanup

Test that hooks clean up listeners and side effects:

```ts
import { renderHook } from '../__tests__/utils';
import { useMediaQuery } from './useMediaQuery';

it('removes listeners on unmount', () => {
  const { unmount } = renderHook(() => useMediaQuery('(min-width: 768px)'));

  const addEventListenerSpy = jest.spyOn(MediaQueryList.prototype, 'addEventListener');
  const removeEventListenerSpy = jest.spyOn(MediaQueryList.prototype, 'removeEventListener');

  unmount();

  expect(removeEventListenerSpy).toHaveBeenCalled();
});
```

### 6. Testing Multiple Hook Instances

Test that multiple instances of the same hook work independently:

```ts
import { renderHook } from '../__tests__/utils';
import { useMediaQuery } from './useMediaQuery';

it('supports multiple instances with different queries', () => {
  const { result: result1 } = renderHook(() => useMediaQuery('(min-width: 768px)'));
  const { result: result2 } = renderHook(() => useMediaQuery('(min-width: 992px)'));

  expect(result1.current).toBe(false);
  expect(result2.current).toBe(false);
});
```

### 7. Testing Async Operations

Test hooks with async behavior:

```ts
import { renderHook, waitFor } from '../__tests__/utils';
import { useAsyncData } from './useAsyncData';

it('loads data asynchronously', async () => {
  const { result } = renderHook(() => useAsyncData('/api/data'));

  expect(result.current.loading).toBe(true);
  expect(result.current.data).toBeNull();

  await waitFor(() => {
    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBeDefined();
  });
});
```

---

## Mock Utilities

### matchMedia Mock

Control media query matching and simulate viewport changes:

```ts
import {
  setMediaQueryMatcher,
  triggerMediaQueryChange,
  resetMatchMediaMock,
} from '../__tests__/mocks';

describe('responsive behavior', () => {
  beforeEach(() => {
    resetMatchMediaMock(); // Reset before each test
  });

  it('matches mobile viewport', () => {
    setMediaQueryMatcher((query) => query.includes('max-width: 767'));

    const { result } = renderHook(() => useMediaQuery('(max-width: 767.98px)'));

    expect(result.current).toBe(true);
  });

  it('responds to viewport resize', () => {
    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));

    act(() => {
      triggerMediaQueryChange('(min-width: 768px)', true);
    });

    expect(result.current).toBe(true);
  });
});
```

### ResizeObserver Mock

Simulate element size changes:

```ts
import { triggerResize } from '../__tests__/mocks';

it('responds to element resize', () => {
  const element = document.createElement('div');
  const { result } = renderHook(() => useElementSize(element));

  act(() => {
    triggerResize(element, { width: 500, height: 300 });
  });

  expect(result.current.width).toBe(500);
  expect(result.current.height).toBe(300);
});
```

### SSR Helpers

Test server-side rendering scenarios:

```ts
import { describeSSR, withSSR, enterSSRMode, exitSSRMode, isBrowser } from '../__tests__/mocks';

// Option 1: Entire test suite in SSR mode
describeSSR('Hook SSR behavior', () => {
  it('handles missing window', () => {
    expect(isBrowser()).toBe(false);
    // Test hook behavior without window
  });
});

// Option 2: Single test in SSR mode
it('works in SSR', () => {
  const value = withSSR(() => {
    // Code here runs without window/document
    return someFunction();
  });

  expect(value).toBe(expectedValue);
});

// Option 3: Manual SSR mode control
it('toggles SSR mode', () => {
  expect(isBrowser()).toBe(true);

  enterSSRMode();
  expect(isBrowser()).toBe(false);

  exitSSRMode();
  expect(isBrowser()).toBe(true);
});
```

---

## Coverage Requirements

All hooks must meet these coverage requirements:

- ✅ **100% line coverage** - Every line of code must be executed
- ✅ **100% branch coverage** - Every conditional path must be tested
- ✅ **SSR test suite** - Must not crash when window/document are undefined
- ✅ **Cleanup tests** - Must remove all listeners/effects on unmount

### Checking Coverage

Run tests with coverage:

```bash
pnpm test -- --coverage
```

View coverage report:

```bash
open coverage/index.html
```

---

## Best Practices

### 1. Reset Mocks Between Tests

Always reset mocks in `beforeEach` to prevent test pollution:

```ts
beforeEach(() => {
  resetMatchMediaMock();
  resetResizeObserverMock();
  jest.clearAllMocks();
});
```

### 2. Use `act()` for State Updates

Wrap state updates in `act()` to ensure React flushes updates:

```ts
import { act } from '../__tests__/utils';

act(() => {
  triggerMediaQueryChange('(min-width: 768px)', true);
});
```

### 3. Test All Code Paths

Ensure every branch is tested:

```ts
// Test both true and false conditions
it('returns true when enabled', () => { ... });
it('returns false when disabled', () => { ... });

// Test error handling
it('handles invalid input', () => { ... });
it('handles missing refs', () => { ... });
```

### 4. Test Edge Cases

Cover unusual but valid scenarios:

```ts
it('handles null ref gracefully', () => { ... });
it('handles empty arrays', () => { ... });
it('handles rapid updates', () => { ... });
it('handles unmount during async operation', () => { ... });
```

### 5. Document Test Intent

Use clear, descriptive test names:

```ts
// ✅ Good - Clear intent
it('should call callback when clicking outside element', () => { ... });

// ❌ Bad - Unclear
it('should work correctly', () => { ... });
```

### 6. Group Related Tests

Use `describe` blocks to organize tests:

```ts
describe('useMediaQuery', () => {
  describe('Basic Functionality', () => { ... });
  describe('Reactive Updates', () => { ... });
  describe('SSR Safety', () => { ... });
  describe('Cleanup', () => { ... });
});
```

---

## Example Test File

Complete example demonstrating all patterns:

```ts
/**
 * useMediaQuery Tests
 */
import { renderHook, act, waitFor } from '../__tests__/utils';
import {
  setMediaQueryMatcher,
  triggerMediaQueryChange,
  resetMatchMediaMock,
  describeSSR,
} from '../__tests__/mocks';
import { useMediaQuery } from './useMediaQuery';

describe('useMediaQuery', () => {
  beforeEach(() => {
    resetMatchMediaMock();
  });

  describe('Basic Functionality', () => {
    it('returns true when media query matches', () => {
      setMediaQueryMatcher(() => true);

      const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));

      expect(result.current).toBe(true);
    });

    it('returns false when media query does not match', () => {
      setMediaQueryMatcher(() => false);

      const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));

      expect(result.current).toBe(false);
    });
  });

  describe('Reactive Updates', () => {
    it('updates when media query match status changes', () => {
      const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));

      expect(result.current).toBe(false);

      act(() => {
        triggerMediaQueryChange('(min-width: 768px)', true);
      });

      expect(result.current).toBe(true);
    });
  });

  describeSSR('SSR Safety', () => {
    it('returns default value during SSR', () => {
      const { result } = renderHook(() =>
        useMediaQuery('(min-width: 768px)', { defaultValue: true })
      );

      expect(result.current).toBe(true);
    });

    it('does not crash without window', () => {
      expect(() => {
        renderHook(() => useMediaQuery('(min-width: 768px)'));
      }).not.toThrow();
    });
  });

  describe('Cleanup', () => {
    it('removes listeners on unmount', () => {
      const removeEventListenerSpy = jest.spyOn(MediaQueryList.prototype, 'removeEventListener');

      const { unmount } = renderHook(() => useMediaQuery('(min-width: 768px)'));

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalled();
    });
  });
});
```

---

## Troubleshooting

### Tests Timing Out

If tests hang, check for:

- Missing `act()` wrappers around state updates
- Unresolved promises in async tests
- Missing cleanup in `afterEach`

### Flaky Tests

If tests pass/fail randomly:

- Ensure mocks are reset in `beforeEach`
- Use `waitFor` for async operations
- Check for shared state between tests

### SSR Tests Failing

If SSR tests crash:

- Use `describeSSR` or `withSSR` helpers
- Check hooks use `isBrowser()` guards
- Don't access window/document in SSR tests

### Coverage Not 100%

If coverage is incomplete:

- Run `pnpm test -- --coverage` to see uncovered lines
- Add tests for error cases
- Test all conditional branches
- Test cleanup/unmount scenarios

---

## Additional Resources

- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing Hooks](https://react-hooks-testing-library.com/)
- [DSAi Testing Guide](../../../TESTING.md)

---

## Contributing

When adding a new hook:

1. ✅ Create hook implementation with TypeScript types
2. ✅ Write comprehensive tests (100% coverage)
3. ✅ Add SSR tests with `describeSSR`
4. ✅ Test cleanup behavior
5. ✅ Create README with examples
6. ✅ Update this hooks README with link
7. ✅ Export from `hooks/index.ts` and `src/index.ts`
