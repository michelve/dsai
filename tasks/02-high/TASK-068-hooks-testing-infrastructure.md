# Hooks Testing Infrastructure

**Task ID:** TASK-068
**Title:** Hooks Testing Infrastructure
**Priority:** High
**Status:** ⚪ Not Started
**Assigned To:** Unassigned
**Estimated Time:** 4 Hours
**Created:** 2024-12-05
**Updated:** 2024-12-05

---

## 📋 Task Description

### Goal

Establish comprehensive testing infrastructure for the DSAi hooks library, including test utilities, mock helpers, and documentation for testing patterns.

### Problem/Issue

As we build out the hooks infrastructure (TASK-062 through TASK-067), we need:

1. **Consistent testing patterns** across all hooks
2. **Mock utilities** for browser APIs (window, document, matchMedia)
3. **SSR testing** to verify hooks don't break during server render
4. **React Testing Library integration** with `@testing-library/react-hooks` or React 18+ `renderHook`
5. **Coverage requirements** documented and enforced

### Expected Outcome

A robust testing infrastructure that:

- Provides reusable mock utilities for browser APIs
- Documents testing patterns and best practices
- Ensures all hooks are testable in isolation
- Supports SSR testing scenarios
- Integrates with existing Jest setup

---

## 🎯 Acceptance Criteria

- [ ] Test utilities created in `hooks/__tests__/` or `test/hooks/`
- [ ] matchMedia mock utility created
- [ ] ResizeObserver mock utility created
- [ ] IntersectionObserver mock utility created (future use)
- [ ] SSR environment mock (no window/document)
- [ ] renderHook helper configured (RTL or custom)
- [ ] Testing patterns documented in README
- [ ] Example test demonstrating all patterns
- [ ] CI integration verified

---

## 📂 Files to Create/Modify

### Create

- `packages/@dsai/react/src/hooks/__tests__/setup.ts` - Hook test setup
- `packages/@dsai/react/src/hooks/__tests__/mocks/matchMedia.ts` - matchMedia mock
- `packages/@dsai/react/src/hooks/__tests__/mocks/resizeObserver.ts` - ResizeObserver mock
- `packages/@dsai/react/src/hooks/__tests__/mocks/ssr.ts` - SSR environment mock
- `packages/@dsai/react/src/hooks/__tests__/utils/renderHook.ts` - renderHook wrapper
- `packages/@dsai/react/src/hooks/README.md` - Hooks documentation with testing section

### Modify

- `packages/@dsai/react/jest.config.js` - Add hooks test setup
- `packages/@dsai/react/package.json` - Add testing dependencies if needed

---

## 🔗 Dependencies

### Prerequisites

- [ ] TASK-062: Hooks infrastructure inventory (approved plan)

### Blocks

- All hook implementation tasks (TASK-063 through TASK-067)
- Future hook development

---

## 🧪 Testing Requirements

- [ ] Test utilities themselves are tested
- [ ] Mock utilities correctly simulate browser APIs
- [ ] SSR mock properly removes window/document
- [ ] renderHook utility works with React 19
- [ ] Integration with existing test infrastructure verified

---

## 📖 Documentation Requirements

- [ ] README.md with testing patterns
- [ ] JSDoc for all test utilities
- [ ] Example tests for common scenarios
- [ ] Coverage requirements documented

---

## 🔄 Implementation Steps

1. [ ] Create hooks test directory structure:

```
packages/@dsai/react/src/hooks/
├── __tests__/
│   ├── setup.ts
│   ├── mocks/
│   │   ├── index.ts
│   │   ├── matchMedia.ts
│   │   ├── resizeObserver.ts
│   │   └── ssr.ts
│   └── utils/
│       ├── index.ts
│       └── renderHook.ts
└── README.md
```

2. [ ] Create matchMedia mock in `mocks/matchMedia.ts`:

```typescript
interface MockMediaQueryList {
  matches: boolean;
  media: string;
  onchange: ((event: MediaQueryListEvent) => void) | null;
  addListener: (callback: (event: MediaQueryListEvent) => void) => void;
  removeListener: (callback: (event: MediaQueryListEvent) => void) => void;
  addEventListener: (type: string, callback: (event: MediaQueryListEvent) => void) => void;
  removeEventListener: (type: string, callback: (event: MediaQueryListEvent) => void) => void;
  dispatchEvent: (event: Event) => boolean;
}

type MediaQueryMatcher = (query: string) => boolean;

let currentMatcher: MediaQueryMatcher = () => false;
const listeners = new Map<string, Set<(event: MediaQueryListEvent) => void>>();

/**
 * Creates a mock matchMedia implementation.
 */
export function createMatchMediaMock() {
  const mockMatchMedia = jest.fn((query: string): MockMediaQueryList => {
    const matches = currentMatcher(query);

    if (!listeners.has(query)) {
      listeners.set(query, new Set());
    }

    return {
      matches,
      media: query,
      onchange: null,
      addListener: (callback) => listeners.get(query)!.add(callback),
      removeListener: (callback) => listeners.get(query)!.delete(callback),
      addEventListener: (type, callback) => {
        if (type === 'change') {
          listeners.get(query)!.add(callback);
        }
      },
      removeEventListener: (type, callback) => {
        if (type === 'change') {
          listeners.get(query)!.delete(callback);
        }
      },
      dispatchEvent: () => true,
    };
  });

  return mockMatchMedia;
}

/**
 * Sets which media queries should match.
 */
export function setMediaQueryMatcher(matcher: MediaQueryMatcher): void {
  currentMatcher = matcher;
}

/**
 * Simulates a media query change.
 */
export function triggerMediaQueryChange(query: string, matches: boolean): void {
  const queryListeners = listeners.get(query);
  if (queryListeners) {
    const event = { matches, media: query } as MediaQueryListEvent;
    queryListeners.forEach((callback) => callback(event));
  }
}

/**
 * Clears all listeners and resets matcher.
 */
export function resetMatchMediaMock(): void {
  currentMatcher = () => false;
  listeners.clear();
}

/**
 * Installs the matchMedia mock on the global window object.
 */
export function installMatchMediaMock(): void {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: createMatchMediaMock(),
  });
}
```

3. [ ] Create SSR mock in `mocks/ssr.ts`:

```typescript
/**
 * Utilities for testing SSR scenarios where window/document are undefined.
 */

const originalWindow = global.window;
const originalDocument = global.document;

/**
 * Simulates SSR environment by removing window and document.
 */
export function enterSSRMode(): void {
  // @ts-expect-error - Intentionally removing window for SSR simulation
  delete global.window;
  // @ts-expect-error - Intentionally removing document for SSR simulation
  delete global.document;
}

/**
 * Restores browser environment after SSR simulation.
 */
export function exitSSRMode(): void {
  global.window = originalWindow;
  global.document = originalDocument;
}

/**
 * Runs a test function in SSR mode.
 */
export function withSSR<T>(fn: () => T): T {
  enterSSRMode();
  try {
    return fn();
  } finally {
    exitSSRMode();
  }
}

/**
 * Jest helper to run a describe block in SSR mode.
 */
export function describeSSR(name: string, fn: () => void): void {
  describe(name, () => {
    beforeEach(enterSSRMode);
    afterEach(exitSSRMode);
    fn();
  });
}
```

4. [ ] Create renderHook utility in `utils/renderHook.ts`:

````typescript
import {
  renderHook as rtlRenderHook,
  RenderHookOptions,
  RenderHookResult,
} from '@testing-library/react';
import type { ReactNode } from 'react';

/**
 * Extended render hook options with DSAi-specific configurations.
 */
export interface DSAiRenderHookOptions<TProps> extends RenderHookOptions<TProps> {
  /** Whether to simulate SSR mode */
  ssr?: boolean;
}

/**
 * Wrapper around @testing-library/react's renderHook with DSAi defaults.
 *
 * @example
 * ```ts
 * const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
 * expect(result.current).toBe(false);
 * ```
 */
export function renderHook<TResult, TProps>(
  render: (props: TProps) => TResult,
  options?: DSAiRenderHookOptions<TProps>
): RenderHookResult<TResult, TProps> {
  const { ssr = false, ...rtlOptions } = options ?? {};

  if (ssr) {
    // Temporarily enter SSR mode
    const originalWindow = global.window;
    const originalDocument = global.document;

    // @ts-expect-error - SSR simulation
    delete global.window;
    // @ts-expect-error - SSR simulation
    delete global.document;

    try {
      return rtlRenderHook(render, rtlOptions);
    } finally {
      global.window = originalWindow;
      global.document = originalDocument;
    }
  }

  return rtlRenderHook(render, rtlOptions);
}

/**
 * Re-export act for convenience.
 */
export { act, waitFor } from '@testing-library/react';
````

5. [ ] Create test setup in `setup.ts`:

```typescript
import { installMatchMediaMock, resetMatchMediaMock } from './mocks/matchMedia';

// Install global mocks
beforeAll(() => {
  installMatchMediaMock();
});

// Reset mocks between tests
beforeEach(() => {
  resetMatchMediaMock();
});

// Cleanup after all tests
afterAll(() => {
  jest.restoreAllMocks();
});
```

6. [ ] Create hooks README.md with testing section:

````markdown
# DSAi Hooks

Reusable React hooks for the DSAi design system.

## Available Hooks

| Hook               | Description                    | Status  |
| ------------------ | ------------------------------ | ------- |
| `useFocusTrap`     | Traps focus within a container | Planned |
| `useScrollLock`    | Prevents body scroll           | Planned |
| `useReducedMotion` | Detects motion preference      | Planned |
| `useClickOutside`  | Detects clicks outside element | Planned |
| `useMediaQuery`    | Tracks media query matches     | Planned |

## Testing Hooks

### Setup

Hook tests use custom utilities in `__tests__/`:

```ts
import { renderHook, act } from '../__tests__/utils';
import { setMediaQueryMatcher, triggerMediaQueryChange } from '../__tests__/mocks';
```
````

### Testing Patterns

#### Basic Hook Test

```ts
import { renderHook } from '../__tests__/utils';
import { useMediaQuery } from '../useMediaQuery';

describe('useMediaQuery', () => {
  it('returns false when query does not match', () => {
    const { result } = renderHook(() => useMediaQuery('(min-width: 1200px)'));
    expect(result.current).toBe(false);
  });
});
```

#### Testing State Changes

```ts
import { renderHook, act } from '../__tests__/utils';
import { triggerMediaQueryChange } from '../__tests__/mocks';
import { useMediaQuery } from '../useMediaQuery';

it('updates when media query changes', () => {
  const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));

  expect(result.current).toBe(false);

  act(() => {
    triggerMediaQueryChange('(min-width: 768px)', true);
  });

  expect(result.current).toBe(true);
});
```

#### Testing SSR

```ts
import { renderHook } from '../__tests__/utils';
import { describeSSR } from '../__tests__/mocks';
import { useMediaQuery } from '../useMediaQuery';

describeSSR('useMediaQuery SSR', () => {
  it('returns default value during SSR', () => {
    const { result } = renderHook(() =>
      useMediaQuery('(min-width: 768px)', { defaultValue: true })
    );
    expect(result.current).toBe(true);
  });
});
```

### Coverage Requirements

All hooks must have:

- ✅ 100% line coverage
- ✅ 100% branch coverage
- ✅ SSR test suite
- ✅ Cleanup/unmount tests

````

7. [ ] Update jest.config.js for hooks:

```javascript
module.exports = {
  // ... existing config
  setupFilesAfterEnv: [
    '<rootDir>/test/setup.ts',
    '<rootDir>/src/hooks/__tests__/setup.ts', // Add hooks setup
  ],
  coverageThreshold: {
    'src/hooks/**/*.ts': {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
};
````

8. [ ] Verify integration with CI

9. [ ] Run Codacy analysis

---

## 📝 Notes

### Testing Library Version

React 18+ includes `renderHook` in `@testing-library/react`. No need for separate `@testing-library/react-hooks` package.

```json
{
  "devDependencies": {
    "@testing-library/react": "^14.0.0"
  }
}
```

### Mock Best Practices

1. **Reset between tests:** Always reset mocks in `beforeEach` to prevent test pollution
2. **Minimal mocking:** Only mock what's necessary; prefer real browser APIs in integration tests
3. **Type safety:** Ensure mocks match real API signatures

### SSR Testing Strategy

1. **Unit tests:** Use `describeSSR` helper to run hook tests without window/document
2. **Integration tests:** Consider using `jest-environment-jsdom` with SSR simulation
3. **E2E tests:** Test actual SSR with Next.js or similar

### Quality Benchmarks

Reference testing setups:

- [Mantine hooks tests](https://github.com/mantinedev/mantine/tree/master/packages/%40mantine/hooks/src)
- [React Aria tests](https://github.com/adobe/react-spectrum/tree/main/packages/%40react-aria)
- [Chakra UI hooks tests](https://github.com/chakra-ui/chakra-ui/tree/main/packages/hooks)

---

## ✅ Definition of Done

- [ ] All mock utilities created and working
- [ ] renderHook utility configured for React 19
- [ ] SSR testing helpers created
- [ ] README with testing documentation
- [ ] Jest config updated with hooks setup
- [ ] Example tests demonstrating all patterns
- [ ] CI verified with hook tests
- [ ] Codacy analysis passing
- [ ] Code reviewed and approved
