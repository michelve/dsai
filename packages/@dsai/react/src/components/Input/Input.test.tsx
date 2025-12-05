import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { createRef } from 'react';

import { Input } from './Input';

expect.extend(toHaveNoViolations);

describe('Input', () => {
  // ===========================================================================
  // Rendering
  // ===========================================================================
  describe('Rendering', () => {
    it('renders without crashing', () => {
      render(<Input aria-label="Test input" />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('renders with label', () => {
      render(<Input label="Username" />);
      expect(screen.getByLabelText('Username')).toBeInTheDocument();
    });

    it('renders without label when aria-label is provided', () => {
      render(<Input aria-label="Search" placeholder="Search..." />);
      expect(screen.getByRole('textbox')).toHaveAttribute('aria-label', 'Search');
    });

    it('has Bootstrap form-control class', () => {
      render(<Input aria-label="Test" />);
      expect(screen.getByRole('textbox')).toHaveClass('form-control');
    });

    it('renders placeholder text', () => {
      render(<Input aria-label="Test" placeholder="Enter text" />);
      expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
    });

    it('renders helper text', () => {
      render(<Input label="Email" helperText="We'll never share your email" />);
      expect(screen.getByText("We'll never share your email")).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Input Types
  // ===========================================================================
  describe('Input Types', () => {
    it('renders text input by default', () => {
      render(<Input aria-label="Test" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('type', 'text');
    });

    it('renders email input', () => {
      render(<Input type="email" aria-label="Email" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');
    });

    it('renders password input', () => {
      render(<Input type="password" aria-label="Password" />);
      // Password inputs don't have textbox role
      expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'password');
    });

    it('renders number input', () => {
      render(<Input type="number" aria-label="Amount" />);
      expect(screen.getByRole('spinbutton')).toHaveAttribute('type', 'number');
    });

    it('renders tel input', () => {
      render(<Input type="tel" aria-label="Phone" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('type', 'tel');
    });

    it('renders url input', () => {
      render(<Input type="url" aria-label="Website" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('type', 'url');
    });

    it('renders search input', () => {
      render(<Input type="search" aria-label="Search" />);
      expect(screen.getByRole('searchbox')).toHaveAttribute('type', 'search');
    });
  });

  // ===========================================================================
  // Sizes
  // ===========================================================================
  describe('Sizes', () => {
    it('renders medium size by default (no extra class)', () => {
      render(<Input aria-label="Test" />);
      const input = screen.getByRole('textbox');
      expect(input).not.toHaveClass('form-control-sm');
      expect(input).not.toHaveClass('form-control-lg');
    });

    it('renders small size', () => {
      render(<Input size="sm" aria-label="Test" />);
      expect(screen.getByRole('textbox')).toHaveClass('form-control-sm');
    });

    it('renders large size', () => {
      render(<Input size="lg" aria-label="Test" />);
      expect(screen.getByRole('textbox')).toHaveClass('form-control-lg');
    });
  });

  // ===========================================================================
  // States
  // ===========================================================================
  describe('States', () => {
    it('renders disabled state', () => {
      render(<Input label="Test" disabled />);
      expect(screen.getByRole('textbox')).toBeDisabled();
    });

    it('renders readonly state', () => {
      render(<Input label="Test" readOnly />);
      expect(screen.getByRole('textbox')).toHaveAttribute('readonly');
    });

    it('renders error state', () => {
      render(<Input label="Test" error />);
      expect(screen.getByRole('textbox')).toHaveClass('is-invalid');
    });

    it('renders success state', () => {
      render(<Input label="Test" success />);
      expect(screen.getByRole('textbox')).toHaveClass('is-valid');
    });

    it('error takes precedence over success', () => {
      render(<Input label="Test" error success />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('is-invalid');
      expect(input).not.toHaveClass('is-valid');
    });
  });

  // ===========================================================================
  // Controlled Mode
  // ===========================================================================
  describe('Controlled Mode', () => {
    it('reflects controlled value', () => {
      render(<Input label="Test" value="Hello" onChange={() => {}} />);
      expect(screen.getByRole('textbox')).toHaveValue('Hello');
    });

    it('calls onChange when value changes', async () => {
      const handleChange = jest.fn();
      render(<Input label="Test" value="" onChange={handleChange} />);

      const input = screen.getByRole('textbox');
      await userEvent.type(input, 'a');

      expect(handleChange).toHaveBeenCalled();
    });
  });

  // ===========================================================================
  // Uncontrolled Mode
  // ===========================================================================
  describe('Uncontrolled Mode', () => {
    it('uses defaultValue for initial value', () => {
      render(<Input label="Test" defaultValue="Initial" />);
      expect(screen.getByRole('textbox')).toHaveValue('Initial');
    });

    it('updates value when typing in uncontrolled mode', async () => {
      render(<Input label="Test" />);
      const input = screen.getByRole('textbox');

      await userEvent.type(input, 'Hello');
      expect(input).toHaveValue('Hello');
    });
  });

  // ===========================================================================
  // Prefix and Suffix
  // ===========================================================================
  describe('Prefix and Suffix', () => {
    it('renders prefix text', () => {
      render(<Input label="Price" prefix="$" />);
      expect(screen.getByText('$')).toBeInTheDocument();
      expect(screen.getByText('$')).toHaveClass('input-group-text');
    });

    it('renders suffix text', () => {
      render(<Input label="Website" suffix=".com" />);
      expect(screen.getByText('.com')).toBeInTheDocument();
      expect(screen.getByText('.com')).toHaveClass('input-group-text');
    });

    it('renders both prefix and suffix', () => {
      render(<Input label="Amount" prefix="$" suffix=".00" />);
      expect(screen.getByText('$')).toBeInTheDocument();
      expect(screen.getByText('.00')).toBeInTheDocument();
    });

    it('renders prefix icon', () => {
      const icon = <span data-testid="prefix-icon">🔍</span>;
      render(<Input label="Search" prefix={icon} />);
      expect(screen.getByTestId('prefix-icon')).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Clear Button
  // ===========================================================================
  describe('Clear Button', () => {
    it('does not show clear button when clearable is false', () => {
      render(<Input label="Test" defaultValue="Hello" />);
      expect(screen.queryByRole('button', { name: /clear/i })).not.toBeInTheDocument();
    });

    it('does not show clear button when input is empty', () => {
      render(<Input label="Test" clearable />);
      expect(screen.queryByRole('button', { name: /clear/i })).not.toBeInTheDocument();
    });

    it('shows clear button when clearable and has value', () => {
      render(<Input label="Test" clearable defaultValue="Hello" />);
      expect(screen.getByRole('button', { name: /clear/i })).toBeInTheDocument();
    });

    it('clears value when clear button is clicked', async () => {
      const handleClear = jest.fn();
      render(<Input label="Test" clearable defaultValue="Hello" onClear={handleClear} />);
      const clearButton = screen.getByRole('button', { name: /clear/i });

      await userEvent.click(clearButton);

      // In uncontrolled mode, internal state is cleared so clear button disappears
      expect(handleClear).toHaveBeenCalled();
      // Clear button should no longer be visible since value is empty
      expect(screen.queryByRole('button', { name: /clear/i })).not.toBeInTheDocument();
    });

    it('calls onClear when clear button is clicked', async () => {
      const handleClear = jest.fn();
      render(<Input label="Test" clearable defaultValue="Hello" onClear={handleClear} />);

      const clearButton = screen.getByRole('button', { name: /clear/i });
      await userEvent.click(clearButton);

      expect(handleClear).toHaveBeenCalled();
    });

    it('does not show clear button when disabled', () => {
      render(<Input label="Test" clearable defaultValue="Hello" disabled />);
      expect(screen.queryByRole('button', { name: /clear/i })).not.toBeInTheDocument();
    });

    it('does not show clear button when readonly', () => {
      render(<Input label="Test" clearable defaultValue="Hello" readOnly />);
      expect(screen.queryByRole('button', { name: /clear/i })).not.toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Character Counter
  // ===========================================================================
  describe('Character Counter', () => {
    it('does not show counter when showCount is false', () => {
      render(<Input label="Test" maxLength={100} />);
      expect(screen.queryByText(/\/100/)).not.toBeInTheDocument();
    });

    it('shows counter when showCount is true and maxLength is set', () => {
      render(<Input label="Test" maxLength={100} showCount />);
      expect(screen.getByText('0/100')).toBeInTheDocument();
    });

    it('updates counter as user types', async () => {
      render(<Input label="Test" maxLength={100} showCount />);
      const input = screen.getByRole('textbox');

      await userEvent.type(input, 'Hello');
      expect(screen.getByText('5/100')).toBeInTheDocument();
    });

    it('shows counter with initial value', () => {
      render(<Input label="Test" maxLength={100} showCount defaultValue="Hello World" />);
      expect(screen.getByText('11/100')).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Floating Label
  // ===========================================================================
  describe('Floating Label', () => {
    it('renders floating label layout', () => {
      const { container } = render(<Input label="Email" floating />);
      expect(container.querySelector('.form-floating')).toBeInTheDocument();
    });

    it('input comes before label in floating layout', () => {
      const { container } = render(<Input label="Email" floating />);
      const floating = container.querySelector('.form-floating');
      const children = floating?.children;

      // First child should be input, second should be label
      expect(children?.[0]?.tagName).toBe('INPUT');
      expect(children?.[1]?.tagName).toBe('LABEL');
    });
  });

  // ===========================================================================
  // Plaintext
  // ===========================================================================
  describe('Plaintext', () => {
    it('renders plaintext style', () => {
      render(<Input label="Email" plaintext readOnly defaultValue="user@example.com" />);
      expect(screen.getByRole('textbox')).toHaveClass('form-control-plaintext');
    });
  });

  // ===========================================================================
  // Required Field
  // ===========================================================================
  describe('Required Field', () => {
    it('sets required attribute on input', () => {
      render(<Input label="Required Field" required />);
      expect(screen.getByRole('textbox')).toHaveAttribute('required');
    });

    it('shows required indicator in label', () => {
      render(<Input label="Required Field" required />);
      expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('sets aria-required attribute', () => {
      render(<Input label="Required Field" required />);
      expect(screen.getByRole('textbox')).toHaveAttribute('aria-required', 'true');
    });
  });

  // ===========================================================================
  // Helper Text
  // ===========================================================================
  describe('Helper Text', () => {
    it('renders helper text with form-text class', () => {
      render(<Input label="Test" helperText="This is helpful" />);
      const helper = screen.getByText('This is helpful');
      expect(helper).toHaveClass('form-text');
    });

    it('renders error message with invalid-feedback class', () => {
      render(<Input label="Test" error helperText="This is an error" />);
      const helper = screen.getByText('This is an error');
      expect(helper).toHaveClass('invalid-feedback');
    });

    it('links helper text with aria-describedby', () => {
      render(<Input label="Test" helperText="Help text" />);
      const input = screen.getByRole('textbox');
      const helper = screen.getByText('Help text');

      expect(input).toHaveAttribute('aria-describedby', helper.id);
    });

    it('links error message with aria-describedby in addons layout', () => {
      render(<Input label="Price" prefix="$" error helperText="Required field" />);
      const input = screen.getByRole('textbox');
      const helper = screen.getByText('Required field');

      expect(helper).toHaveAttribute('id');
      expect(input).toHaveAttribute('aria-describedby', helper.id);
    });

    it('has no a11y violations with prefix + error + helperText', async () => {
      const { container } = render(
        <Input label="Price" prefix="$" error helperText="Price is required" />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  // ===========================================================================
  // Custom Styling
  // ===========================================================================
  describe('Custom Styling', () => {
    it('accepts custom className for wrapper', () => {
      const { container } = render(<Input label="Test" className="custom-wrapper" />);
      expect(container.firstChild).toHaveClass('custom-wrapper');
    });

    it('accepts custom inputClassName for input', () => {
      render(<Input label="Test" inputClassName="custom-input" />);
      expect(screen.getByRole('textbox')).toHaveClass('custom-input');
    });

    it('accepts inline styles', () => {
      const { container } = render(<Input label="Test" style={{ maxWidth: '300px' }} />);
      expect(container.firstChild).toHaveStyle({ maxWidth: '300px' });
    });

    it('accepts custom id', () => {
      render(<Input label="Test" id="custom-id" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('id', 'custom-id');
    });
  });

  // ===========================================================================
  // Ref Forwarding
  // ===========================================================================
  describe('Ref Forwarding', () => {
    it('forwards ref to input element', () => {
      const ref = createRef<HTMLInputElement>();
      render(<Input label="Test" ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });

    it('ref can be used to focus input', () => {
      const ref = createRef<HTMLInputElement>();
      render(<Input label="Test" ref={ref} />);

      ref.current?.focus();
      expect(document.activeElement).toBe(ref.current);
    });
  });

  // ===========================================================================
  // Focus Events
  // ===========================================================================
  describe('Focus Events', () => {
    it('calls onFocus when input is focused', async () => {
      const handleFocus = jest.fn();
      render(<Input label="Test" onFocus={handleFocus} />);

      const input = screen.getByRole('textbox');
      fireEvent.focus(input);

      expect(handleFocus).toHaveBeenCalled();
    });

    it('calls onBlur when input loses focus', async () => {
      const handleBlur = jest.fn();
      render(<Input label="Test" onBlur={handleBlur} />);

      const input = screen.getByRole('textbox');
      fireEvent.focus(input);
      fireEvent.blur(input);

      expect(handleBlur).toHaveBeenCalled();
    });

    it('sets data-focused attribute when focused', () => {
      render(<Input label="Test" />);
      const input = screen.getByRole('textbox');

      expect(input).not.toHaveAttribute('data-focused');

      fireEvent.focus(input);
      expect(input).toHaveAttribute('data-focused', 'true');

      fireEvent.blur(input);
      expect(input).not.toHaveAttribute('data-focused');
    });
  });

  // ===========================================================================
  // Keyboard Navigation
  // ===========================================================================
  describe('Keyboard Navigation', () => {
    it('is focusable with Tab', async () => {
      render(
        <>
          <button type="button">Before</button>
          <Input label="Test" />
          <button type="button">After</button>
        </>
      );

      const input = screen.getByRole('textbox');

      await userEvent.tab();
      expect(screen.getByRole('button', { name: 'Before' })).toHaveFocus();

      await userEvent.tab();
      expect(input).toHaveFocus();

      await userEvent.tab();
      expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
    });

    it('can type with keyboard', async () => {
      render(<Input label="Test" />);
      const input = screen.getByRole('textbox');

      await userEvent.tab();
      await userEvent.keyboard('Hello World');

      expect(input).toHaveValue('Hello World');
    });
  });

  // ===========================================================================
  // Accessibility (WCAG 2.2 AA)
  // ===========================================================================
  describe('Accessibility (WCAG 2.2 AA)', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(<Input label="Email" type="email" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no violations with error state', async () => {
      const { container } = render(
        <Input label="Email" type="email" error helperText="Invalid email" />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no violations when disabled', async () => {
      const { container } = render(<Input label="Email" disabled />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no violations with prefix and suffix', async () => {
      const { container } = render(<Input label="Price" prefix="$" suffix=".00" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no violations with floating label', async () => {
      const { container } = render(<Input label="Email" floating placeholder="Enter email" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no violations when required', async () => {
      const { container } = render(<Input label="Email" required />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('sets aria-invalid when error', () => {
      render(<Input label="Test" error />);
      expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
    });

    it('label is associated with input', () => {
      render(<Input label="Email" />);
      const input = screen.getByRole('textbox');
      const label = screen.getByText('Email');

      expect(label).toHaveAttribute('for', input.id);
    });
  });

  // ===========================================================================
  // Form Integration
  // ===========================================================================
  describe('Form Integration', () => {
    it('submits value with form', async () => {
      const handleSubmit = jest.fn((e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        return Object.fromEntries(formData);
      });

      render(
        <form onSubmit={handleSubmit}>
          <Input label="Email" name="email" defaultValue="test@example.com" />
          <button type="submit">Submit</button>
        </form>
      );

      await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

      expect(handleSubmit).toHaveBeenCalled();
    });

    it('respects maxLength attribute', async () => {
      render(<Input label="Code" maxLength={5} />);
      const input = screen.getByRole('textbox');

      await userEvent.type(input, '123456789');

      expect(input).toHaveValue('12345');
    });
  });

  // ===========================================================================
  // Display Name
  // ===========================================================================
  describe('Display Name', () => {
    it('has correct displayName', () => {
      expect(Input.displayName).toBe('Input');
    });
  });
});
