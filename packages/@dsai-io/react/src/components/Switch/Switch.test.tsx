import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { createRef } from 'react';

import { Switch } from './Switch';

expect.extend(toHaveNoViolations);

describe('Switch', () => {
  // ===========================================================================
  // Rendering
  // ===========================================================================
  describe('Rendering', () => {
    it('renders without crashing', () => {
      render(<Switch aria-label="Test switch" />);
      expect(screen.getByRole('switch')).toBeInTheDocument();
    });

    it('renders with label', () => {
      render(<Switch label="Enable notifications" />);
      expect(screen.getByText('Enable notifications')).toBeInTheDocument();
    });

    it('renders without label when aria-label is provided', () => {
      render(<Switch aria-label="Toggle feature" />);
      expect(screen.getByRole('switch')).toHaveAttribute('aria-label', 'Toggle feature');
    });

    it('renders helper text', () => {
      render(<Switch label="Feature" helperText="Enable this feature" />);
      expect(screen.getByText('Enable this feature')).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Sizes
  // ===========================================================================
  describe('Sizes', () => {
    it('renders small size', () => {
      render(<Switch size="sm" aria-label="Small" />);
      const switchEl = screen.getByRole('switch');
      // Track is the first child span inside button
      const track = switchEl.querySelector('span[aria-hidden="true"]');
      expect(track).toHaveStyle({ width: '32px', height: '18px' });
    });

    it('renders medium size by default', () => {
      render(<Switch aria-label="Medium" />);
      const switchEl = screen.getByRole('switch');
      const track = switchEl.querySelector('span[aria-hidden="true"]');
      expect(track).toHaveStyle({ width: '44px', height: '24px' });
    });

    it('renders large size', () => {
      render(<Switch size="lg" aria-label="Large" />);
      const switchEl = screen.getByRole('switch');
      const track = switchEl.querySelector('span[aria-hidden="true"]');
      expect(track).toHaveStyle({ width: '56px', height: '30px' });
    });
  });

  // ===========================================================================
  // Controlled Mode
  // ===========================================================================
  describe('Controlled Mode', () => {
    it('reflects controlled checked state', () => {
      render(<Switch aria-label="Test" checked />);
      expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
    });

    it('reflects controlled unchecked state', () => {
      render(<Switch aria-label="Test" checked={false} />);
      expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false');
    });

    it('calls onChange when clicked', async () => {
      const handleChange = jest.fn();
      render(<Switch aria-label="Test" checked={false} onChange={handleChange} />);

      await userEvent.click(screen.getByRole('switch'));

      expect(handleChange).toHaveBeenCalledWith(true);
    });

    it('does not change state internally when controlled', async () => {
      const handleChange = jest.fn();
      render(<Switch aria-label="Test" checked={false} onChange={handleChange} />);

      await userEvent.click(screen.getByRole('switch'));

      // Still false because it's controlled
      expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false');
    });
  });

  // ===========================================================================
  // Uncontrolled Mode
  // ===========================================================================
  describe('Uncontrolled Mode', () => {
    it('uses defaultChecked for initial state', () => {
      render(<Switch aria-label="Test" defaultChecked />);
      expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
    });

    it('toggles state when clicked in uncontrolled mode', async () => {
      render(<Switch aria-label="Test" />);
      const switchEl = screen.getByRole('switch');

      expect(switchEl).toHaveAttribute('aria-checked', 'false');

      await userEvent.click(switchEl);

      expect(switchEl).toHaveAttribute('aria-checked', 'true');
    });

    it('calls onChange in uncontrolled mode', async () => {
      const handleChange = jest.fn();
      render(<Switch aria-label="Test" onChange={handleChange} />);

      await userEvent.click(screen.getByRole('switch'));

      expect(handleChange).toHaveBeenCalledWith(true);
    });
  });

  // ===========================================================================
  // Disabled State
  // ===========================================================================
  describe('Disabled State', () => {
    it('renders disabled switch', () => {
      render(<Switch aria-label="Test" disabled />);
      expect(screen.getByRole('switch')).toBeDisabled();
    });

    it('does not toggle when disabled', async () => {
      const handleChange = jest.fn();
      render(<Switch aria-label="Test" disabled onChange={handleChange} />);

      await userEvent.click(screen.getByRole('switch'));

      expect(handleChange).not.toHaveBeenCalled();
    });

    it('has reduced opacity when disabled', () => {
      render(<Switch aria-label="Test" disabled />);
      const track = screen.getByRole('switch').querySelector('span[aria-hidden="true"]');
      expect(track).toHaveClass('opacity-50');
    });
  });

  // ===========================================================================
  // Loading State
  // ===========================================================================
  describe('Loading State', () => {
    it('renders loading state', () => {
      const { container } = render(<Switch aria-label="Test" loading />);
      // Spinner is purely visual; aria-busy on button signals loading state to AT
      expect(container.querySelector('.spinner-border')).toBeInTheDocument();
    });

    it('is disabled when loading', () => {
      render(<Switch aria-label="Test" loading />);
      expect(screen.getByRole('switch')).toBeDisabled();
    });

    it('does not toggle when loading', async () => {
      const handleChange = jest.fn();
      render(<Switch aria-label="Test" loading onChange={handleChange} />);

      await userEvent.click(screen.getByRole('switch'));

      expect(handleChange).not.toHaveBeenCalled();
    });

    it('sets aria-busy when loading', () => {
      render(<Switch aria-label="Test" loading />);
      expect(screen.getByRole('switch')).toHaveAttribute('aria-busy', 'true');
    });
  });

  // ===========================================================================
  // Error State
  // ===========================================================================
  describe('Error State', () => {
    it('renders error state', () => {
      render(<Switch aria-label="Test" error />);
      const track = screen.getByRole('switch').querySelector('span[aria-hidden="true"]');
      expect(track).toHaveClass('border-danger');
    });

    it('shows error helper text', () => {
      render(<Switch aria-label="Test" error helperText="This field is required" />);
      const helper = screen.getByText('This field is required');
      expect(helper).toHaveClass('invalid-feedback');
    });
  });

  // ===========================================================================
  // Label Position
  // ===========================================================================
  describe('Label Position', () => {
    it('renders label at end by default', () => {
      render(<Switch label="Test" />);
      expect(screen.getByRole('switch')).not.toHaveClass('flex-row-reverse');
    });

    it('renders label at start', () => {
      render(<Switch label="Test" labelPosition="start" />);
      expect(screen.getByRole('switch')).toHaveClass('flex-row-reverse');
    });
  });

  // ===========================================================================
  // On/Off Text
  // ===========================================================================
  describe('On/Off Text', () => {
    it('shows on text when checked', () => {
      render(<Switch aria-label="Test" checked onText="ON" offText="OFF" />);
      expect(screen.getByText('ON')).toBeInTheDocument();
    });

    it('shows off text when unchecked', () => {
      render(<Switch aria-label="Test" checked={false} onText="ON" offText="OFF" />);
      expect(screen.getByText('OFF')).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Icons
  // ===========================================================================
  describe('Icons', () => {
    it('renders on icon when checked', () => {
      render(
        <Switch
          aria-label="Test"
          checked
          onIcon={<span data-testid="on-icon">✓</span>}
          offIcon={<span data-testid="off-icon">✗</span>}
        />
      );
      expect(screen.getByTestId('on-icon')).toBeInTheDocument();
    });

    it('renders off icon when unchecked', () => {
      render(
        <Switch
          aria-label="Test"
          checked={false}
          onIcon={<span data-testid="on-icon">✓</span>}
          offIcon={<span data-testid="off-icon">✗</span>}
        />
      );
      expect(screen.getByTestId('off-icon')).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Required Field
  // ===========================================================================
  describe('Required Field', () => {
    it('shows required indicator in label', () => {
      render(<Switch label="Required Field" required />);
      expect(screen.getByText('*')).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Keyboard Navigation
  // ===========================================================================
  describe('Keyboard Navigation', () => {
    it('toggles on Space key', async () => {
      render(<Switch aria-label="Test" />);
      const switchEl = screen.getByRole('switch');

      switchEl.focus();
      fireEvent.keyDown(switchEl, { key: ' ' });

      expect(switchEl).toHaveAttribute('aria-checked', 'true');
    });

    it('toggles on Enter key', async () => {
      render(<Switch aria-label="Test" />);
      const switchEl = screen.getByRole('switch');

      switchEl.focus();
      fireEvent.keyDown(switchEl, { key: 'Enter' });

      expect(switchEl).toHaveAttribute('aria-checked', 'true');
    });

    it('is focusable with Tab', async () => {
      render(
        <>
          <button type="button">Before</button>
          <Switch aria-label="Test" />
          <button type="button">After</button>
        </>
      );

      await userEvent.tab();
      expect(screen.getByRole('button', { name: 'Before' })).toHaveFocus();

      await userEvent.tab();
      expect(screen.getByRole('switch')).toHaveFocus();

      await userEvent.tab();
      expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
    });

    it('is not focusable when disabled', async () => {
      render(
        <>
          <button type="button">Before</button>
          <Switch aria-label="Test" disabled />
          <button type="button">After</button>
        </>
      );

      await userEvent.tab();
      expect(screen.getByRole('button', { name: 'Before' })).toHaveFocus();

      await userEvent.tab();
      // Should skip the disabled switch
      expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
    });
  });

  // ===========================================================================
  // Label Click
  // ===========================================================================
  describe('Label Click', () => {
    it('toggles switch when label is clicked', async () => {
      render(<Switch label="Toggle me" />);

      await userEvent.click(screen.getByText('Toggle me'));

      expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
    });

    it('does not toggle when label clicked and disabled', async () => {
      const handleChange = jest.fn();
      render(<Switch label="Toggle me" disabled onChange={handleChange} />);

      await userEvent.click(screen.getByText('Toggle me'));

      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  // ===========================================================================
  // Form Integration
  // ===========================================================================
  describe('Form Integration', () => {
    it('includes hidden input for form submission', () => {
      const { container } = render(<Switch aria-label="Test" name="feature" checked />);
      const hiddenInput = container.querySelector('input[type="hidden"]');
      expect(hiddenInput).toBeInTheDocument();
      expect(hiddenInput).toHaveAttribute('name', 'feature');
    });

    it('hidden input has value when checked', () => {
      const { container } = render(<Switch aria-label="Test" name="feature" checked />);
      const hiddenInput = container.querySelector('input[type="hidden"]');
      expect(hiddenInput).toHaveValue('on');
    });

    it('hidden input is empty when unchecked', () => {
      const { container } = render(<Switch aria-label="Test" name="feature" checked={false} />);
      const hiddenInput = container.querySelector('input[type="hidden"]');
      expect(hiddenInput).toHaveValue('');
    });

    it('uses custom value when provided', () => {
      const { container } = render(
        <Switch aria-label="Test" name="feature" value="enabled" checked />
      );
      const hiddenInput = container.querySelector('input[type="hidden"]');
      expect(hiddenInput).toHaveValue('enabled');
    });
  });

  // ===========================================================================
  // Ref Forwarding
  // ===========================================================================
  describe('Ref Forwarding', () => {
    it('forwards ref to button element', () => {
      const ref = createRef<HTMLButtonElement>();
      render(<Switch aria-label="Test" ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });

    it('ref can be used to focus', () => {
      const ref = createRef<HTMLButtonElement>();
      render(<Switch aria-label="Test" ref={ref} />);

      ref.current?.focus();
      expect(document.activeElement).toBe(ref.current);
    });
  });

  // ===========================================================================
  // Custom Styling
  // ===========================================================================
  describe('Custom Styling', () => {
    it('accepts custom className', () => {
      const { container } = render(<Switch aria-label="Test" className="custom-class" />);
      expect(container.querySelector('.custom-class')).toBeInTheDocument();
    });

    it('accepts inline styles', () => {
      const { container } = render(<Switch aria-label="Test" style={{ marginTop: '10px' }} />);
      expect(container.firstChild).toHaveStyle({ marginTop: '10px' });
    });

    it('accepts custom id', () => {
      render(<Switch aria-label="Test" id="custom-id" />);
      expect(screen.getByRole('switch')).toHaveAttribute('id', 'custom-id');
    });
  });

  // ===========================================================================
  // Accessibility (WCAG 2.2 AA)
  // ===========================================================================
  describe('Accessibility (WCAG 2.2 AA)', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(<Switch label="Feature" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no violations when checked', async () => {
      const { container } = render(<Switch label="Feature" checked />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no violations when disabled', async () => {
      const { container } = render(<Switch label="Feature" disabled />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no violations with error state', async () => {
      const { container } = render(<Switch label="Feature" error helperText="Error message" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has role="switch"', () => {
      render(<Switch aria-label="Test" />);
      expect(screen.getByRole('switch')).toBeInTheDocument();
    });

    it('has aria-checked attribute', () => {
      render(<Switch aria-label="Test" />);
      expect(screen.getByRole('switch')).toHaveAttribute('aria-checked');
    });

    it('has accessible name from label content', () => {
      render(<Switch label="Test Label" />);
      const switchEl = screen.getByRole('switch');
      // Label is now inside the button, so it gets its accessible name from content
      expect(screen.getByRole('switch', { name: /Test Label/ })).toBeInTheDocument();
      // The label span still has an id for potential external reference
      const labelSpan = switchEl.querySelector(`#${switchEl.id}-label`);
      expect(labelSpan).toHaveTextContent('Test Label');
    });

    it('has aria-describedby for helper text', () => {
      render(<Switch label="Test" helperText="Help text" />);
      const switchEl = screen.getByRole('switch');
      const helper = screen.getByText('Help text');
      expect(switchEl).toHaveAttribute('aria-describedby', helper.id);
    });
  });

  // ===========================================================================
  // Display Name
  // ===========================================================================
  describe('Display Name', () => {
    it('has correct displayName', () => {
      expect(Switch.displayName).toBe('Switch');
    });
  });
});
