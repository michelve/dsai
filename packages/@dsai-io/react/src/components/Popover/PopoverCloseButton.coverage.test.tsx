/**
 * PopoverCloseButton Coverage Tests
 *
 * Tests branch paths: custom className, custom style, custom aria-label,
 * ref forwarding, data attributes.
 */

import { createRef } from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { PopoverCloseButton } from './PopoverCloseButton';

describe('PopoverCloseButton', () => {
  it('renders with default aria-label "Close"', () => {
    render(<PopoverCloseButton />);
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
  });

  it('renders with custom aria-label', () => {
    render(<PopoverCloseButton aria-label="Dismiss" />);
    expect(screen.getByRole('button', { name: 'Dismiss' })).toBeInTheDocument();
  });

  it('applies btn-close class by default', () => {
    render(<PopoverCloseButton data-testid="btn" />);
    expect(screen.getByTestId('btn')).toHaveClass('btn-close');
  });

  it('merges custom className', () => {
    render(<PopoverCloseButton className="custom-class" data-testid="btn" />);
    const btn = screen.getByTestId('btn');
    expect(btn).toHaveClass('btn-close', 'custom-class');
  });

  it('applies default positioning styles', () => {
    render(<PopoverCloseButton data-testid="btn" />);
    const btn = screen.getByTestId('btn');
    expect(btn.style.position).toBe('absolute');
    expect(btn.style.top).toBe('0.5rem');
    expect(btn.style.right).toBe('0.5rem');
  });

  it('merges custom style with default positioning', () => {
    render(<PopoverCloseButton style={{ color: 'red' }} data-testid="btn" />);
    const btn = screen.getByTestId('btn');
    expect(btn.style.color).toBe('red');
    expect(btn.style.position).toBe('absolute');
  });

  it('forwards ref', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<PopoverCloseButton ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    render(<PopoverCloseButton onClick={onClick} />);
    await user.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('passes data-testid and data-test', () => {
    render(<PopoverCloseButton data-testid="close-btn" data-test="popover-close" />);
    const btn = screen.getByTestId('close-btn');
    expect(btn).toHaveAttribute('data-test', 'popover-close');
  });

  it('renders without className (undefined)', () => {
    render(<PopoverCloseButton data-testid="btn" />);
    const btn = screen.getByTestId('btn');
    expect(btn).toHaveClass('btn-close');
  });
});
