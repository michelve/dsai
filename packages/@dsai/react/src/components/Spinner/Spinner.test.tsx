import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

import { Spinner } from './Spinner';

import type { SpinnerProps } from './Spinner.types';

expect.extend(toHaveNoViolations);

describe('Spinner', () => {
  describe('Rendering', () => {
    it('renders without crashing', () => {
      render(<Spinner />);
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('renders as div by default', () => {
      const { container } = render(<Spinner />);
      expect(container.querySelector('div.spinner-border')).toBeInTheDocument();
    });

    it('renders as span when specified', () => {
      const { container } = render(<Spinner as="span" />);
      expect(container.querySelector('span.spinner-border')).toBeInTheDocument();
    });

    it('has visually hidden label for screen readers', () => {
      render(<Spinner label="Loading content" />);
      expect(screen.getByText('Loading content')).toHaveClass('visually-hidden');
    });

    it('uses default label when not specified', () => {
      render(<Spinner />);
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });

  describe('Animation Types', () => {
    it('renders border animation by default', () => {
      render(<Spinner />);
      expect(screen.getByRole('status')).toHaveClass('spinner-border');
    });

    it('renders border animation when specified', () => {
      render(<Spinner animation="border" />);
      expect(screen.getByRole('status')).toHaveClass('spinner-border');
    });

    it('renders grow animation when specified', () => {
      render(<Spinner animation="grow" />);
      expect(screen.getByRole('status')).toHaveClass('spinner-grow');
    });
  });

  describe('Sizes', () => {
    it('renders default size without size class', () => {
      render(<Spinner />);
      const spinner = screen.getByRole('status');
      expect(spinner).not.toHaveClass('spinner-border-sm');
    });

    it('renders small border spinner', () => {
      render(<Spinner size="sm" />);
      expect(screen.getByRole('status')).toHaveClass('spinner-border-sm');
    });

    it('renders small grow spinner', () => {
      render(<Spinner animation="grow" size="sm" />);
      expect(screen.getByRole('status')).toHaveClass('spinner-grow-sm');
    });

    it('renders medium size without size class', () => {
      render(<Spinner size="md" />);
      const spinner = screen.getByRole('status');
      expect(spinner).not.toHaveClass('spinner-border-sm');
      expect(spinner).not.toHaveClass('spinner-border-md');
    });
  });

  describe('Variants (Colors)', () => {
    const variants: SpinnerProps['variant'][] = [
      'primary',
      'secondary',
      'success',
      'danger',
      'warning',
      'info',
      'light',
      'dark',
    ];

    variants.forEach((variant) => {
      it(`renders ${variant} variant with Bootstrap text class`, () => {
        render(<Spinner variant={variant} />);
        expect(screen.getByRole('status')).toHaveClass(`text-${variant}`);
      });
    });

    it('renders without color class when variant not specified', () => {
      render(<Spinner />);
      const spinner = screen.getByRole('status');
      expect(spinner.className).not.toMatch(/text-/);
    });
  });

  describe('Custom Styling', () => {
    it('accepts custom className', () => {
      render(<Spinner className="custom-class" />);
      const spinner = screen.getByRole('status');
      expect(spinner).toHaveClass('custom-class');
      expect(spinner).toHaveClass('spinner-border'); // Still has base class
    });

    it('accepts inline styles', () => {
      render(<Spinner style={{ width: '3rem', height: '3rem' }} />);
      expect(screen.getByRole('status')).toHaveStyle({
        width: '3rem',
        height: '3rem',
      });
    });
  });

  describe('Accessibility (WCAG 2.2 AA)', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(<Spinner />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no violations with all variants', async () => {
      const { container } = render(
        <>
          <Spinner variant="primary" />
          <Spinner variant="secondary" />
          <Spinner animation="grow" variant="success" />
        </>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has role="status" for screen readers', () => {
      render(<Spinner />);
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('has aria-label attribute', () => {
      render(<Spinner label="Processing" />);
      expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Processing');
    });
  });

  describe('Display Name', () => {
    it('has correct displayName', () => {
      expect(Spinner.displayName).toBe('Spinner');
    });
  });
});
