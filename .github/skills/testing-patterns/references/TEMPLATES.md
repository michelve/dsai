# Test Templates

Reusable templates for testing DSAi React components.

## Basic Test Setup

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';

import { ComponentName } from './ComponentName';

expect.extend(toHaveNoViolations);

describe('ComponentName', () => {
  // Tests go here
});
```

## Render Tests

```tsx
describe('Rendering', () => {
  it('renders with default props', () => {
    render(<ComponentName>Content</ComponentName>);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('renders with all variants', () => {
    const { rerender } = render(<ComponentName variant="primary">Test</ComponentName>);
    expect(screen.getByText('Test')).toHaveClass('component--primary');

    rerender(<ComponentName variant="secondary">Test</ComponentName>);
    expect(screen.getByText('Test')).toHaveClass('component--secondary');
  });

  it('applies custom className', () => {
    render(<ComponentName className="custom-class">Content</ComponentName>);
    expect(screen.getByText('Content')).toHaveClass('custom-class');
  });

  it('forwards ref to DOM element', () => {
    const ref = { current: null };
    render(<ComponentName ref={ref}>Content</ComponentName>);
    expect(ref.current).toBeInstanceOf(HTMLElement);
  });

  it('spreads additional props', () => {
    render(<ComponentName data-testid="test-component">Content</ComponentName>);
    expect(screen.getByTestId('test-component')).toBeInTheDocument();
  });
});
```

## User Interaction Tests

```tsx
describe('User Interactions', () => {
  it('handles click events', async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();

    render(<Button onClick={handleClick}>Click me</Button>);
    await user.click(screen.getByRole('button'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('handles keyboard events', async () => {
    const handleKeyDown = jest.fn();
    const user = userEvent.setup();

    render(<Input onKeyDown={handleKeyDown} />);
    await user.type(screen.getByRole('textbox'), 'hello{enter}');

    expect(handleKeyDown).toHaveBeenCalled();
  });

  it('handles focus events', async () => {
    const handleFocus = jest.fn();
    const handleBlur = jest.fn();
    const user = userEvent.setup();

    render(<Input onFocus={handleFocus} onBlur={handleBlur} />);

    await user.click(screen.getByRole('textbox'));
    expect(handleFocus).toHaveBeenCalled();

    await user.tab();
    expect(handleBlur).toHaveBeenCalled();
  });

  it('prevents interaction when disabled', async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();

    render(
      <Button disabled onClick={handleClick}>
        Click me
      </Button>
    );
    await user.click(screen.getByRole('button'));

    expect(handleClick).not.toHaveBeenCalled();
  });
});
```

## Accessibility Tests

```tsx
describe('Accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<ComponentName>Content</ComponentName>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has correct ARIA attributes', () => {
    render(<Button aria-label="Close dialog">×</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Close dialog');
  });

  it('supports keyboard navigation', async () => {
    const user = userEvent.setup();
    render(
      <>
        <Button>First</Button>
        <Button>Second</Button>
      </>
    );

    await user.tab();
    expect(screen.getByText('First')).toHaveFocus();

    await user.tab();
    expect(screen.getByText('Second')).toHaveFocus();
  });

  it('has visible focus indicator', async () => {
    const user = userEvent.setup();
    render(<Button>Focus me</Button>);

    await user.tab();
    const button = screen.getByRole('button');

    expect(button).toHaveFocus();
    // Check for focus styles (implementation-specific)
  });

  it('announces state changes to screen readers', async () => {
    const user = userEvent.setup();
    render(<Toggle aria-label="Enable notifications" />);

    const toggle = screen.getByRole('switch');
    expect(toggle).toHaveAttribute('aria-checked', 'false');

    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-checked', 'true');
  });
});
```

## Controlled vs Uncontrolled Tests

```tsx
describe('Controlled Mode', () => {
  it('uses controlled value', () => {
    render(<Input value="controlled" onChange={() => {}} />);
    expect(screen.getByRole('textbox')).toHaveValue('controlled');
  });

  it('calls onChange with new value', async () => {
    const handleChange = jest.fn();
    const user = userEvent.setup();

    render(<Input value="" onChange={handleChange} />);
    await user.type(screen.getByRole('textbox'), 'a');

    expect(handleChange).toHaveBeenCalledWith(expect.any(Object));
  });
});

describe('Uncontrolled Mode', () => {
  it('uses defaultValue initially', () => {
    render(<Input defaultValue="default" />);
    expect(screen.getByRole('textbox')).toHaveValue('default');
  });

  it('allows internal state changes', async () => {
    const user = userEvent.setup();

    render(<Input defaultValue="initial" />);
    const input = screen.getByRole('textbox');

    await user.clear(input);
    await user.type(input, 'new value');

    expect(input).toHaveValue('new value');
  });
});
```

## Async Tests

```tsx
describe('Async Behavior', () => {
  it('shows loading state', async () => {
    render(<AsyncComponent />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });
  });

  it('handles async data', async () => {
    render(<DataComponent />);

    expect(await screen.findByText('Data loaded')).toBeInTheDocument();
  });

  it('handles errors', async () => {
    server.use(
      rest.get('/api/data', (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    render(<DataComponent />);

    expect(await screen.findByRole('alert')).toHaveTextContent('Error loading data');
  });
});
```

## Snapshot Tests

```tsx
describe('Snapshots', () => {
  it('matches default snapshot', () => {
    const { container } = render(<ComponentName>Content</ComponentName>);
    expect(container.firstChild).toMatchSnapshot();
  });

  it.each(['primary', 'secondary', 'tertiary'] as const)(
    'matches %s variant snapshot',
    (variant) => {
      const { container } = render(<ComponentName variant={variant}>Content</ComponentName>);
      expect(container.firstChild).toMatchSnapshot();
    }
  );
});
```

## Mock Patterns

### Mocking Hooks

```tsx
jest.mock('../../hooks/useMediaQuery', () => ({
  useMediaQuery: jest.fn(() => false),
}));

import { useMediaQuery } from '../../hooks/useMediaQuery';

beforeEach(() => {
  (useMediaQuery as jest.Mock).mockReturnValue(false);
});

it('responds to media query changes', () => {
  (useMediaQuery as jest.Mock).mockReturnValue(true);
  render(<ResponsiveComponent />);
  expect(screen.getByText('Mobile view')).toBeInTheDocument();
});
```

### Mocking Context

```tsx
const mockContextValue = {
  theme: 'light',
  setTheme: jest.fn(),
};

const renderWithContext = (component: React.ReactNode) => {
  return render(
    <ThemeContext.Provider value={mockContextValue}>{component}</ThemeContext.Provider>
  );
};

it('uses theme from context', () => {
  renderWithContext(<ThemedComponent />);
  expect(screen.getByTestId('themed')).toHaveClass('theme-light');
});
```

### Mocking Portals

```tsx
beforeEach(() => {
  const portalRoot = document.createElement('div');
  portalRoot.setAttribute('id', 'portal-root');
  document.body.appendChild(portalRoot);
});

afterEach(() => {
  document.body.innerHTML = '';
});

it('renders in portal', () => {
  render(<Modal isOpen>Modal content</Modal>);
  expect(screen.getByRole('dialog')).toBeInTheDocument();
});
```

## Coverage Goals

```tsx
// Aim for these coverage thresholds:
// - Statements: 90%
// - Branches: 85%
// - Functions: 90%
// - Lines: 90%

// Ensure tests cover:
// ✅ Default rendering
// ✅ All props and variants
// ✅ User interactions
// ✅ Keyboard navigation
// ✅ Error states
// ✅ Edge cases
// ✅ Accessibility
```
