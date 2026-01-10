---
name: testing-patterns
description: Testing patterns for DSAi components using Jest and Testing Library. Use when writing unit tests, accessibility tests, integration tests, or achieving 90%+ coverage. Includes render tests, user interaction, and a11y testing.
license: Complete terms in LICENSE.txt
metadata:
  author: dsai
  version: '1.0'
---

# Testing Patterns

Write comprehensive tests for DSAi components with Jest and React Testing Library.

## When to Use

- Writing tests for new components
- Achieving 90%+ code coverage
- Testing accessibility compliance
- Testing user interactions and keyboard navigation
- Debugging test failures

## Test File Structure

```text
ComponentName/
├── ComponentName.tsx
├── ComponentName.test.tsx    # Co-located tests
└── index.ts
```

## Basic Test Template

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentName } from './ComponentName';

describe('ComponentName', () => {
  // Rendering
  describe('rendering', () => {
    it('renders without crashing', () => {
      render(<ComponentName />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('renders children', () => {
      render(<ComponentName>Click me</ComponentName>);
      expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(<ComponentName className="custom" />);
      expect(screen.getByRole('button')).toHaveClass('custom');
    });
  });

  // Props
  describe('props', () => {
    it('applies variant class', () => {
      render(<ComponentName variant="primary" />);
      expect(screen.getByRole('button')).toHaveClass('dsai-btn--primary');
    });

    it('handles disabled state', () => {
      render(<ComponentName disabled />);
      expect(screen.getByRole('button')).toBeDisabled();
    });
  });

  // Interactions
  describe('interactions', () => {
    it('calls onClick when clicked', async () => {
      const user = userEvent.setup();
      const onClick = jest.fn();
      render(<ComponentName onClick={onClick} />);

      await user.click(screen.getByRole('button'));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick when disabled', async () => {
      const user = userEvent.setup();
      const onClick = jest.fn();
      render(<ComponentName onClick={onClick} disabled />);

      await user.click(screen.getByRole('button'));
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  // Ref forwarding
  describe('ref', () => {
    it('forwards ref to DOM element', () => {
      const ref = { current: null };
      render(<ComponentName ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });
  });
});
```

## User Interaction Testing

```tsx
import userEvent from '@testing-library/user-event';

describe('keyboard interactions', () => {
  it('activates on Enter key', async () => {
    const user = userEvent.setup();
    const onActivate = jest.fn();
    render(<ComponentName onActivate={onActivate} />);

    screen.getByRole('button').focus();
    await user.keyboard('{Enter}');

    expect(onActivate).toHaveBeenCalled();
  });

  it('activates on Space key', async () => {
    const user = userEvent.setup();
    const onActivate = jest.fn();
    render(<ComponentName onActivate={onActivate} />);

    screen.getByRole('button').focus();
    await user.keyboard(' ');

    expect(onActivate).toHaveBeenCalled();
  });

  it('closes on Escape key', async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    render(<Modal open onClose={onClose} />);

    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalled();
  });
});
```

## Accessibility Testing

```tsx
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('accessibility', () => {
  it('has no axe violations', async () => {
    const { container } = render(<ComponentName />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has correct ARIA attributes', () => {
    render(<ComponentName expanded />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true');
  });

  it('associates label with input', () => {
    render(<Input label="Email" />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('announces error to screen readers', () => {
    render(<Input error="Required field" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Required field');
  });
});
```

## Async Testing

```tsx
import { waitFor, waitForElementToBeRemoved } from '@testing-library/react';

describe('async behavior', () => {
  it('shows loading then content', async () => {
    render(<AsyncComponent />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Loaded content')).toBeInTheDocument();
    });
  });

  it('removes loading indicator', async () => {
    render(<AsyncComponent />);

    await waitForElementToBeRemoved(() => screen.queryByRole('progressbar'));
    expect(screen.getByText('Content')).toBeInTheDocument();
  });
});
```

## Mock Patterns

```tsx
// Mock hooks
jest.mock('../../hooks/useMediaQuery', () => ({
  useMediaQuery: () => true,
}));

// Mock timers
beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

it('debounces input', async () => {
  const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
  const onChange = jest.fn();
  render(<DebouncedInput onChange={onChange} />);

  await user.type(screen.getByRole('textbox'), 'hello');
  expect(onChange).not.toHaveBeenCalled();

  jest.advanceTimersByTime(500);
  expect(onChange).toHaveBeenCalledWith('hello');
});
```

## Coverage Requirements

- **Statements**: 90%+
- **Branches**: 85%+
- **Functions**: 90%+
- **Lines**: 90%+

Run coverage:

```bash
pnpm nx test @dsai/react --coverage
```

## Common Queries

| Query            | Use Case                        |
| ---------------- | ------------------------------- |
| `getByRole`      | Preferred - tests accessibility |
| `getByLabelText` | Form inputs                     |
| `getByText`      | Static text content             |
| `getByTestId`    | Last resort only                |

## Edge Cases to Test

- Empty/null children
- Missing optional props
- Maximum/minimum values
- Error states
- Loading states
- Disabled states
- RTL text direction
