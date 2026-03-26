import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

import { Progress } from './Progress';

import type { ProgressProps } from './Progress.types';

expect.extend(toHaveNoViolations);

describe('Progress', () => {
  describe('Rendering', () => {
    it('renders without crashing', () => {
      render(<Progress value={50} aria-label="Progress" />);
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('renders with value', () => {
      render(<Progress value={75} aria-label="Progress" />);
      const progressbar = screen.getByRole('progressbar');
      expect(progressbar).toHaveAttribute('aria-valuenow', '75');
    });

    it('renders with 0 value by default', () => {
      render(<Progress aria-label="Progress" />);
      const progressbar = screen.getByRole('progressbar');
      expect(progressbar).toHaveAttribute('aria-valuenow', '0');
    });

    it('clamps value to 0-100 range', () => {
      const { rerender } = render(<Progress value={150} aria-label="Progress" />);
      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');

      rerender(<Progress value={-50} aria-label="Progress" />);
      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
    });

    it('has base Bootstrap progress class', () => {
      const { container } = render(<Progress value={50} aria-label="Progress" />);
      expect(container.querySelector('.progress')).toBeInTheDocument();
    });

    it('has progress-bar class on the bar element', () => {
      const { container } = render(<Progress value={50} aria-label="Progress" />);
      expect(container.querySelector('.progress-bar')).toBeInTheDocument();
    });
  });

  describe('Variants', () => {
    const variants: ProgressProps['variant'][] = [
      'primary',
      'secondary',
      'success',
      'danger',
      'warning',
      'info',
      'dark',
    ];

    variants.forEach((variant) => {
      it(`renders ${variant} variant with Bootstrap bg class`, () => {
        const { container } = render(
          <Progress value={50} variant={variant} aria-label="Progress" />
        );
        const bar = container.querySelector('.progress-bar');
        expect(bar).toHaveClass(`bg-${variant}`);
      });
    });

    it('defaults to primary variant', () => {
      const { container } = render(<Progress value={50} aria-label="Progress" />);
      expect(container.querySelector('.progress-bar')).toHaveClass('bg-primary');
    });
  });

  describe('Sizes', () => {
    it('renders small size', () => {
      const { container } = render(<Progress value={50} size="sm" aria-label="Progress" />);
      const progress = container.querySelector('.progress');
      expect(progress).toHaveStyle({ height: '0.5rem' });
    });

    it('renders medium size (default)', () => {
      const { container } = render(<Progress value={50} size="md" aria-label="Progress" />);
      const progress = container.querySelector('.progress');
      expect(progress).toHaveStyle({ height: '1rem' });
    });

    it('renders large size', () => {
      const { container } = render(<Progress value={50} size="lg" aria-label="Progress" />);
      const progress = container.querySelector('.progress');
      expect(progress).toHaveStyle({ height: '1.5rem' });
    });
  });

  describe('Label', () => {
    it('renders label when provided', () => {
      render(<Progress value={50} label="Uploading..." aria-label="Progress" />);
      expect(screen.getByText('Uploading...')).toBeInTheDocument();
    });

    it('does not render label when not provided', () => {
      render(<Progress value={50} aria-label="Progress" />);
      expect(screen.queryByText('Uploading...')).not.toBeInTheDocument();
    });
  });

  describe('Show Value', () => {
    it('shows percentage when showValue is true', () => {
      render(<Progress value={75} showValue aria-label="Progress" />);
      expect(screen.getByText('75%')).toBeInTheDocument();
    });

    it('does not show percentage when showValue is false', () => {
      render(<Progress value={75} aria-label="Progress" />);
      expect(screen.queryByText('75%')).not.toBeInTheDocument();
    });

    it('shows custom valueText when provided', () => {
      render(<Progress value={75} showValue valueText="3 of 4" aria-label="Progress" />);
      expect(screen.getByText('3 of 4')).toBeInTheDocument();
    });

    it('shows value next to label when both are provided', () => {
      render(<Progress value={50} label="Progress" showValue aria-label="Progress" />);
      expect(screen.getByText('Progress')).toBeInTheDocument();
      expect(screen.getByText('50%')).toBeInTheDocument();
    });
  });

  describe('Indeterminate Mode', () => {
    it('renders in indeterminate mode', () => {
      render(<Progress indeterminate aria-label="Loading" />);
      const progressbar = screen.getByRole('progressbar');
      expect(progressbar).toHaveAttribute('aria-busy', 'true');
    });

    it('does not have aria-valuenow in indeterminate mode', () => {
      render(<Progress indeterminate aria-label="Loading" />);
      const progressbar = screen.getByRole('progressbar');
      expect(progressbar).not.toHaveAttribute('aria-valuenow');
    });

    it('has aria-valuetext of "Loading" in indeterminate mode', () => {
      render(<Progress indeterminate aria-label="Loading" />);
      const progressbar = screen.getByRole('progressbar');
      expect(progressbar).toHaveAttribute('aria-valuetext', 'Loading');
    });

    it('does not show value in indeterminate mode even with showValue', () => {
      render(<Progress indeterminate showValue aria-label="Loading" />);
      expect(screen.queryByText(/%/)).not.toBeInTheDocument();
    });

    it('applies striped animation classes in indeterminate mode', () => {
      const { container } = render(<Progress indeterminate aria-label="Loading" />);
      const bar = container.querySelector('.progress-bar');
      expect(bar).toHaveClass('progress-bar-striped');
      expect(bar).toHaveClass('progress-bar-animated');
    });
  });

  describe('Striped and Animated', () => {
    it('applies striped class when striped is true', () => {
      const { container } = render(<Progress value={50} striped aria-label="Progress" />);
      expect(container.querySelector('.progress-bar')).toHaveClass('progress-bar-striped');
    });

    it('applies animated class when animated is true', () => {
      const { container } = render(<Progress value={50} animated aria-label="Progress" />);
      expect(container.querySelector('.progress-bar')).toHaveClass('progress-bar-animated');
    });

    it('applies both striped and animated classes', () => {
      const { container } = render(<Progress value={50} striped animated aria-label="Progress" />);
      const bar = container.querySelector('.progress-bar');
      expect(bar).toHaveClass('progress-bar-striped');
      expect(bar).toHaveClass('progress-bar-animated');
    });
  });

  describe('Stacked Progress Bars', () => {
    it('renders stacked progress bars', () => {
      const { container } = render(
        <Progress aria-label="Multi-part progress">
          <Progress.Bar value={15} variant="success" />
          <Progress.Bar value={30} variant="warning" />
          <Progress.Bar value={20} variant="danger" />
        </Progress>
      );
      const bars = container.querySelectorAll('.progress-bar');
      expect(bars).toHaveLength(3);
    });

    it('each stacked bar has correct variant', () => {
      const { container } = render(
        <Progress aria-label="Multi-part progress">
          <Progress.Bar value={15} variant="success" />
          <Progress.Bar value={30} variant="warning" />
        </Progress>
      );
      const bars = container.querySelectorAll('.progress-bar');
      expect(bars[0]).toHaveClass('bg-success');
      expect(bars[1]).toHaveClass('bg-warning');
    });

    it('each stacked bar has correct width', () => {
      const { container } = render(
        <Progress aria-label="Multi-part progress">
          <Progress.Bar value={25} variant="success" />
          <Progress.Bar value={50} variant="warning" />
        </Progress>
      );
      const bars = container.querySelectorAll('.progress-bar');
      expect(bars[0]).toHaveStyle({ width: '25%' });
      expect(bars[1]).toHaveStyle({ width: '50%' });
    });

    it('stacked bars have individual progressbar roles', () => {
      render(
        <Progress aria-label="Multi-part progress">
          <Progress.Bar value={15} variant="success" />
          <Progress.Bar value={30} variant="warning" />
        </Progress>
      );
      const progressbars = screen.getAllByRole('progressbar');
      expect(progressbars).toHaveLength(2);
    });

    it('container has role="group" when stacked', () => {
      const { container } = render(
        <Progress aria-label="Multi-part progress">
          <Progress.Bar value={15} variant="success" />
        </Progress>
      );
      expect(container.querySelector('[role="group"]')).toBeInTheDocument();
    });
  });

  describe('Progress.Bar', () => {
    it('renders with correct value', () => {
      render(
        <Progress aria-label="Progress">
          <Progress.Bar value={40} />
        </Progress>
      );
      const bar = screen.getByRole('progressbar');
      expect(bar).toHaveAttribute('aria-valuenow', '40');
    });

    it('shows value when showValue is true', () => {
      render(
        <Progress aria-label="Progress">
          <Progress.Bar value={40} showValue />
        </Progress>
      );
      expect(screen.getByText('40%')).toBeInTheDocument();
    });

    it('shows custom valueText', () => {
      render(
        <Progress aria-label="Progress">
          <Progress.Bar value={40} showValue valueText="Custom" />
        </Progress>
      );
      expect(screen.getByText('Custom')).toBeInTheDocument();
    });

    it('applies striped class', () => {
      const { container } = render(
        <Progress aria-label="Progress">
          <Progress.Bar value={40} striped />
        </Progress>
      );
      expect(container.querySelector('.progress-bar')).toHaveClass('progress-bar-striped');
    });

    it('applies animated class', () => {
      const { container } = render(
        <Progress aria-label="Progress">
          <Progress.Bar value={40} animated />
        </Progress>
      );
      expect(container.querySelector('.progress-bar')).toHaveClass('progress-bar-animated');
    });
  });

  describe('Custom Styling', () => {
    it('accepts custom className', () => {
      const { container } = render(
        <Progress value={50} className="custom-class" aria-label="Progress" />
      );
      expect(container.querySelector('.progress')).toHaveClass('custom-class');
    });

    it('accepts inline styles', () => {
      const { container } = render(
        <Progress value={50} style={{ marginTop: '20px' }} aria-label="Progress" />
      );
      expect(container.querySelector('.progress')).toHaveStyle({ marginTop: '20px' });
    });
  });

  describe('HTML Attributes', () => {
    it('accepts id attribute', () => {
      const { container } = render(
        <Progress value={50} id="test-progress" aria-label="Progress" />
      );
      expect(container.querySelector('#test-progress')).toBeInTheDocument();
    });

    it('accepts aria-label', () => {
      render(<Progress value={50} aria-label="File upload progress" />);
      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-label', 'File upload progress');
    });

    it('accepts aria-labelledby', () => {
      render(
        <>
          <span id="progress-label">Upload</span>
          <Progress value={50} aria-labelledby="progress-label" />
        </>
      );
      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-labelledby', 'progress-label');
    });
  });

  describe('Accessibility (WCAG 2.2 AA)', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(<Progress value={50} aria-label="Progress" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no violations with all variants', async () => {
      const { container } = render(
        <>
          <Progress value={50} variant="primary" aria-label="Primary" />
          <Progress value={50} variant="success" aria-label="Success" />
          <Progress value={50} variant="danger" aria-label="Danger" />
          <Progress value={50} variant="warning" aria-label="Warning" />
        </>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no violations when indeterminate', async () => {
      const { container } = render(<Progress indeterminate aria-label="Loading" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no violations with label', async () => {
      const { container } = render(
        <Progress value={50} label="Uploading..." aria-label="Progress" />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no violations with stacked bars', async () => {
      const { container } = render(
        <Progress aria-label="Multi-part progress">
          <Progress.Bar value={15} variant="success" />
          <Progress.Bar value={30} variant="warning" />
        </Progress>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has role="progressbar"', () => {
      render(<Progress value={50} aria-label="Progress" />);
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('has aria-valuemin and aria-valuemax', () => {
      render(<Progress value={50} aria-label="Progress" />);
      const progressbar = screen.getByRole('progressbar');
      expect(progressbar).toHaveAttribute('aria-valuemin', '0');
      expect(progressbar).toHaveAttribute('aria-valuemax', '100');
    });

    it('has aria-valuenow with current value', () => {
      render(<Progress value={75} aria-label="Progress" />);
      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '75');
    });

    it('has aria-valuetext with percentage', () => {
      render(<Progress value={75} aria-label="Progress" />);
      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuetext', '75%');
    });

    it('has custom aria-valuetext when provided', () => {
      render(<Progress value={75} valueText="3 of 4 complete" aria-label="Progress" />);
      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuetext', '3 of 4 complete');
    });
  });

  describe('Display Name', () => {
    it('has correct displayName for Progress', () => {
      expect(Progress.displayName).toBe('Progress');
    });

    it('has correct displayName for Progress.Bar', () => {
      expect(Progress.Bar.displayName).toBe('Progress.Bar');
    });
  });

  describe('Warning Variant Contrast', () => {
    it('applies text-dark class on single bar with warning variant', () => {
      const { container } = render(
        <Progress value={50} variant="warning" showValue aria-label="Progress" />
      );
      expect(container.querySelector('.progress-bar')).toHaveClass('text-dark');
    });

    it('applies text-dark class on Progress.Bar with warning variant', () => {
      const { container } = render(
        <Progress aria-label="Progress">
          <Progress.Bar value={50} variant="warning" showValue />
        </Progress>
      );
      expect(container.querySelector('.progress-bar')).toHaveClass('text-dark');
    });

    it('does not apply text-dark class for non-warning variants', () => {
      const { container } = render(
        <Progress value={50} variant="primary" showValue aria-label="Progress" />
      );
      expect(container.querySelector('.progress-bar')).not.toHaveClass('text-dark');
    });
  });

  describe('Data Attributes', () => {
    it('passes data-testid to the progress container', () => {
      const { container } = render(
        <Progress value={50} data-testid="my-progress" aria-label="Progress" />
      );
      expect(container.querySelector('[data-testid="my-progress"]')).toBeInTheDocument();
    });

    it('passes data-test to the progress container', () => {
      const { container } = render(
        <Progress value={50} data-test="progress-test" aria-label="Progress" />
      );
      expect(container.querySelector('[data-test="progress-test"]')).toBeInTheDocument();
    });

    it('passes data-testid to Progress.Bar', () => {
      const { container } = render(
        <Progress aria-label="Progress">
          <Progress.Bar value={40} data-testid="bar-1" />
        </Progress>
      );
      expect(container.querySelector('[data-testid="bar-1"]')).toBeInTheDocument();
    });

    it('passes data-test to Progress.Bar', () => {
      const { container } = render(
        <Progress aria-label="Progress">
          <Progress.Bar value={40} data-test="bar-test" />
        </Progress>
      );
      expect(container.querySelector('[data-test="bar-test"]')).toBeInTheDocument();
    });
  });
});
