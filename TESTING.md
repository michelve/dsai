# Testing Guide

This document outlines the testing philosophy, practices, and guidelines for the DSAi design system.

## Table of Contents

- [Philosophy](#philosophy)
- [Testing Stack](#testing-stack)
- [Getting Started](#getting-started)
- [Writing Tests](#writing-tests)
- [Accessibility Testing](#accessibility-testing)
- [Coverage Requirements](#coverage-requirements)
- [Running Tests](#running-tests)
- [Debugging Tests](#debugging-tests)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

## Philosophy

Our testing approach follows these core principles:

### 1. Test Behavior, Not Implementation

- **DO**: Test what users see and experience
- **DON'T**: Test internal component state or implementation details

```typescript
// ❌ BAD - Testing implementation
expect(component.state.isOpen).toBe(true);

// ✅ GOOD - Testing behavior
expect(screen.getByRole('dialog')).toBeVisible();
```

### 2. Accessibility is Mandatory

Every component must:

- Pass automated accessibility checks (jest-axe)
- Support keyboard navigation
- Provide proper ARIA labels and roles
- Meet WCAG 2.1 AA standards

### 3. Write Tests That Build Confidence

- Focus on critical user paths
- Test error states and edge cases
- Ensure components work with real-world data

## Testing Stack

| Tool                            | Purpose                           | Version |
| ------------------------------- | --------------------------------- | ------- |
| **Jest**                        | Test runner and assertion library | 30.x    |
| **React Testing Library**       | React component testing utilities | 16.x    |
| **jest-axe**                    | Accessibility testing             | 10.x    |
| **@testing-library/user-event** | Simulate user interactions        | 14.x    |
| **ts-jest**                     | TypeScript support for Jest       | 29.x    |

## Getting Started

### Running Your First Test

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Run tests in CI mode
pnpm test:ci
```

### Test File Location

Place test files next to the components they test:

```
packages/@dsai-io/react/src/
├── Button/
│   ├── Button.tsx
│   ├── Button.test.tsx          # Unit tests
│   └── Button.a11y.test.tsx     # Accessibility tests
```

Or use the `__tests__` directory:

```
packages/@dsai-io/react/src/
├── __tests__/
│   ├── Button.test.tsx
│   └── Button.a11y.test.tsx
└── Button/
    └── Button.tsx
```

## Writing Tests

### Basic Component Test

```typescript
import { render, screen, userEvent } from '@/test/utils/test-utils';
import { Button } from './Button';

describe('Button', () => {
  it('should render with text', () => {
    render(<Button>Click me</Button>);

    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should call onClick when clicked', async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    await userEvent.click(screen.getByText('Click me'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Testing with Props

```typescript
describe('Button variants', () => {
  it.each([
    ['primary', 'btn-primary'],
    ['secondary', 'btn-secondary'],
    ['danger', 'btn-danger'],
  ])('should apply %s variant class', (variant, expectedClass) => {
    render(<Button variant={variant}>Click me</Button>);

    const button = screen.getByRole('button');
    expect(button).toHaveClass(expectedClass);
  });
});
```

### Testing User Interactions

```typescript
import { render, screen, userEvent } from '@/test/utils/test-utils';

it('should toggle dropdown on click', async () => {
  render(<Dropdown />);

  const button = screen.getByRole('button', { name: /menu/i });

  // Dropdown closed initially
  expect(screen.queryByRole('menu')).not.toBeInTheDocument();

  // Click to open
  await userEvent.click(button);
  expect(screen.getByRole('menu')).toBeInTheDocument();

  // Click to close
  await userEvent.click(button);
  expect(screen.queryByRole('menu')).not.toBeInTheDocument();
});
```

### Testing Keyboard Navigation

```typescript
it('should navigate with keyboard', async () => {
  render(<Menu items={['Home', 'About', 'Contact']} />);

  // Tab to first item
  await userEvent.tab();
  expect(screen.getByText('Home')).toHaveFocus();

  // Arrow down to next item
  await userEvent.keyboard('{ArrowDown}');
  expect(screen.getByText('About')).toHaveFocus();

  // Enter to select
  await userEvent.keyboard('{Enter}');
  // Assert expected behavior
});
```

### Testing Async Behavior

```typescript
it('should load data asynchronously', async () => {
  render(<DataComponent />);

  // Loading state
  expect(screen.getByText(/loading/i)).toBeInTheDocument();

  // Wait for data to load
  expect(await screen.findByText('Data loaded')).toBeInTheDocument();

  // Loading indicator should be gone
  expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
});
```

## Accessibility Testing

### Basic Accessibility Test

Every component **MUST** pass this test:

```typescript
import { render, testA11y } from '@/test/utils/test-utils';

describe('Component - Accessibility', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(<Component />);

    expect(await testA11y(container)).toHaveNoViolations();
  });
});
```

### Testing with Different States

```typescript
describe('Button - Accessibility', () => {
  it('should have no violations in default state', async () => {
    const { container } = render(<Button>Click me</Button>);
    expect(await testA11y(container)).toHaveNoViolations();
  });

  it('should have no violations when disabled', async () => {
    const { container } = render(<Button disabled>Click me</Button>);
    expect(await testA11y(container)).toHaveNoViolations();
  });

  it('should have no violations in loading state', async () => {
    const { container } = render(<Button loading>Click me</Button>);
    expect(await testA11y(container)).toHaveNoViolations();
  });
});
```

### Configuring Axe Rules

```typescript
import { testA11y, defaultAxeOptions } from '@/test/utils/test-utils';

it('should pass custom accessibility rules', async () => {
  const { container } = render(<Component />);

  expect(
    await testA11y(container, {
      rules: {
        ...defaultAxeOptions.rules,
        // Disable specific rule if needed (with justification)
        'color-contrast': { enabled: false }, // Using custom brand colors
      },
    })
  ).toHaveNoViolations();
});
```

### WCAG 2.1 AA Checklist

Every component must meet these criteria:

- [ ] **Perceivable**: Text alternatives, captions, adaptable, distinguishable
- [ ] **Operable**: Keyboard accessible, enough time, seizures, navigable
- [ ] **Understandable**: Readable, predictable, input assistance
- [ ] **Robust**: Compatible with assistive technologies

### Keyboard Accessibility Requirements

Test these keyboard interactions:

- `Tab` / `Shift+Tab`: Focus navigation
- `Enter` / `Space`: Activation
- `Arrow Keys`: Navigation within components
- `Escape`: Close dialogs/dropdowns
- `Home` / `End`: Jump to first/last item

## Coverage Requirements

### Minimum Thresholds (Enforced)

| Metric     | Minimum | Target |
| ---------- | ------- | ------ |
| Statements | 80%     | 90%    |
| Branches   | 80%     | 90%    |
| Functions  | 80%     | 90%    |
| Lines      | 80%     | 90%    |

### Coverage Configuration

Coverage is collected from:

- ✅ `packages/**/src/**/*.{ts,tsx}`

Coverage excludes:

- ❌ Type definitions (`*.d.ts`)
- ❌ Storybook stories (`*.stories.tsx`)
- ❌ Test files (`**/__tests__/**`)
- ❌ Barrel exports (`index.ts`)

### Viewing Coverage Reports

```bash
# Generate coverage report
pnpm test:coverage

# Open HTML coverage report
open coverage/lcov-report/index.html  # macOS
start coverage/lcov-report/index.html # Windows
```

Coverage reports are generated in multiple formats:

- **Text**: Terminal output
- **LCOV**: For CI integration
- **HTML**: Interactive browser report
- **JSON**: Machine-readable summary

## Running Tests

### Local Development

```bash
# Run all tests
pnpm test

# Watch mode (recommended for development)
pnpm test:watch

# Run specific test file
pnpm test Button.test.tsx

# Run tests matching pattern
pnpm test --testNamePattern="should render"

# Update snapshots (if using)
pnpm test -u
```

### CI Environment

```bash
# CI mode (non-interactive, coverage required)
pnpm test:ci
```

CI mode automatically:

- Runs in non-interactive mode
- Generates coverage reports
- Uses 2 workers for optimal performance
- Fails if coverage thresholds not met

## Debugging Tests

### VS Code Debugging

1. Set breakpoints in your test file
2. Press `F5` or use the Debug panel
3. Select "Jest: Run Current Test File"

### Debug Output

```typescript
import { screen, debug } from '@testing-library/react';

it('should debug component', () => {
  render(<Component />);

  // Print entire DOM
  screen.debug();

  // Print specific element
  screen.debug(screen.getByRole('button'));

  // Print with custom options
  screen.debug(undefined, 300000); // Increase max length
});
```

### Debugging Tips

1. **Use `screen.logTestingPlaygroundURL()`** to get a query playground
2. **Check `getBy*` vs `queryBy*` vs `findBy*` behavior**
   - `getBy*`: Throws if not found (use for elements that should exist)
   - `queryBy*`: Returns null if not found (use for elements that shouldn't exist)
   - `findBy*`: Async, waits for element (use for async elements)

3. **Use `await screen.findBy*()` for async elements**
4. **Check accessibility tree** with `screen.getByRole()`

### Common Issues

#### "Unable to find element"

```typescript
// ❌ Element not rendered yet
render(<AsyncComponent />);
expect(screen.getByText('Loaded')).toBeInTheDocument();

// ✅ Wait for async element
render(<AsyncComponent />);
expect(await screen.findByText('Loaded')).toBeInTheDocument();
```

#### "Element is not visible"

```typescript
// ❌ Element hidden by CSS
expect(screen.getByText('Hidden')).toBeVisible();

// ✅ Check if element exists but is hidden
expect(screen.getByText('Hidden')).toBeInTheDocument();
expect(screen.getByText('Hidden')).not.toBeVisible();
```

## Best Practices

### ✅ DO

1. **Use accessible queries**

   ```typescript
   screen.getByRole('button', { name: /submit/i });
   screen.getByLabelText('Email address');
   screen.getByPlaceholderText('Enter your name');
   ```

2. **Test from the user's perspective**

   ```typescript
   // User sees and clicks a button
   await userEvent.click(screen.getByRole('button', { name: /submit/i }));
   ```

3. **Use data-testid sparingly**

   ```typescript
   // Only when no other query works
   screen.getByTestId('complex-component');
   ```

4. **Wait for async updates**

   ```typescript
   await waitFor(() => {
     expect(screen.getByText('Success')).toBeInTheDocument();
   });
   ```

5. **Test error states**

   ```typescript
   it('should show error message on failure', async () => {
     render(<Form />);
     await userEvent.click(screen.getByRole('button', { name: /submit/i }));
     expect(await screen.findByRole('alert')).toHaveTextContent('Error');
   });
   ```

### ❌ DON'T

1. **Don't test implementation details**

   ```typescript
   // ❌ Testing internal state
   expect(wrapper.state('isOpen')).toBe(true);

   // ✅ Testing visible behavior
   expect(screen.getByRole('dialog')).toBeVisible();
   ```

2. **Don't use brittle queries**

   ```typescript
   // ❌ Fragile class name query
   container.querySelector('.btn-primary-lg-active');

   // ✅ Semantic query
   screen.getByRole('button', { name: /submit/i });
   ```

3. **Don't forget to await async actions**

   ```typescript
   // ❌ Missing await
   userEvent.click(button);

   // ✅ Properly awaited
   await userEvent.click(button);
   ```

4. **Don't skip accessibility tests**

   ```typescript
   // ❌ No accessibility testing
   it('should render', () => {
     render(<Component />);
   });

   // ✅ Includes accessibility testing
   it('should render without violations', async () => {
     const { container } = render(<Component />);
     expect(await testA11y(container)).toHaveNoViolations();
   });
   ```

## Troubleshooting

### Tests Failing in CI but Passing Locally

**Possible causes:**

1. Timezone differences
2. Missing environment variables
3. Asynchronous timing issues
4. File path case sensitivity (Linux vs Windows)

**Solutions:**

- Use `jest --runInBand` to run tests serially
- Set explicit timeouts for async operations
- Mock date/time functions
- Use consistent file naming (lowercase)

### Coverage Threshold Not Met

**Solution:**

1. Identify uncovered lines: `pnpm test:coverage`
2. Open HTML report: `coverage/lcov-report/index.html`
3. Add tests for uncovered code paths
4. Consider if code can be simplified

### Flaky Tests

**Common causes:**

1. Race conditions in async code
2. Shared state between tests
3. Network requests
4. Timers and animations

**Solutions:**

```typescript
// Use fake timers
jest.useFakeTimers();

// Mock API calls
jest.mock('./api');

// Increase timeout for slow tests
jest.setTimeout(10000);

// Clear mocks between tests
afterEach(() => {
  jest.clearAllMocks();
});
```

### Module Resolution Issues

**Problem:** `Cannot find module '@/test/utils/test-utils'`

**Solution:** Check `jest.preset.js` has correct module name mapping:

```javascript
moduleNameMapper: {
  '^@/test/(.*)$': '<rootDir>/test/$1',
}
```

## Examples

See comprehensive examples in:

- `packages/@dsai-io/react/src/__tests__/example.test.tsx`
- `packages/@dsai-io/react/src/__tests__/accessibility.test.tsx`

## Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [jest-axe](https://github.com/nickcolley/jest-axe)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Common Testing Library Mistakes](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## Quick Reference

### Query Priority

1. `getByRole` - Most accessible
2. `getByLabelText` - Form elements
3. `getByPlaceholderText` - Input fallback
4. `getByText` - Non-interactive elements
5. `getByDisplayValue` - Current input values
6. `getByAltText` - Images
7. `getByTitle` - SVG titles
8. `getByTestId` - Last resort

### User Event vs FireEvent

```typescript
// ✅ Preferred - Simulates real user behavior
await userEvent.click(button);
await userEvent.type(input, 'Hello');

// ❌ Avoid - Low-level DOM events
fireEvent.click(button);
fireEvent.change(input, { target: { value: 'Hello' } });
```

### Test Structure

```typescript
describe('Component Name', () => {
  describe('Rendering', () => {
    // Rendering tests
  });

  describe('User Interactions', () => {
    // Interaction tests
  });

  describe('Keyboard Navigation', () => {
    // Keyboard tests
  });

  describe('States', () => {
    // State tests (loading, error, etc.)
  });

  describe('Accessibility', () => {
    // Accessibility tests
  });
});
```

---

**Remember:** Good tests give you confidence to ship. Write tests that make you feel safe to refactor and add new features.
