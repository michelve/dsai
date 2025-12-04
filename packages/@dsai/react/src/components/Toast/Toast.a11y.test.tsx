/**
 * @fileoverview Accessibility tests for Toast component
 * Verifies WCAG 2.2 AA compliance using jest-axe and manual checks
 */

import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { act } from 'react';

import { Toast } from './Toast';
import { ToastContainer } from './ToastContainer';
import { ToastProvider } from './ToastProvider';

expect.extend(toHaveNoViolations);

describe('Toast Accessibility Tests', () => {
  describe('WCAG 2.2 AA Compliance - jest-axe', () => {
    it('has no accessibility violations with default props', async () => {
      const { container } = render(<Toast message="Test notification" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with title', async () => {
      const { container } = render(<Toast title="Notification Title" message="Message content" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with success variant', async () => {
      const { container } = render(
        <Toast variant="success" message="Operation completed successfully" />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with error variant', async () => {
      const { container } = render(<Toast variant="error" message="An error occurred" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with warning variant', async () => {
      const { container } = render(<Toast variant="warning" message="Please review your input" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with info variant', async () => {
      const { container } = render(<Toast variant="info" message="Here is some information" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations without close button', async () => {
      const { container } = render(
        <Toast message="Non-dismissible notification" dismissible={false} />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with aria-label', async () => {
      const { container } = render(<Toast message="Test" aria-label="Custom notification label" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with aria-describedby', async () => {
      const { container } = render(
        <>
          <span id="desc">Additional description</span>
          <Toast message="Test" aria-describedby="desc" />
        </>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with progress bar', async () => {
      const { container } = render(<Toast message="Loading..." showProgress duration={5000} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('ARIA Roles', () => {
    it('uses role="alert" for error notifications', () => {
      render(<Toast variant="error" message="Error message" data-testid="toast" />);
      expect(screen.getByTestId('toast')).toHaveAttribute('role', 'alert');
    });

    it('uses role="alert" for warning notifications', () => {
      render(<Toast variant="warning" message="Warning message" data-testid="toast" />);
      expect(screen.getByTestId('toast')).toHaveAttribute('role', 'alert');
    });

    it('uses role="status" for success notifications', () => {
      render(<Toast variant="success" message="Success message" data-testid="toast" />);
      expect(screen.getByTestId('toast')).toHaveAttribute('role', 'status');
    });

    it('uses role="status" for info notifications', () => {
      render(<Toast variant="info" message="Info message" data-testid="toast" />);
      expect(screen.getByTestId('toast')).toHaveAttribute('role', 'status');
    });

    it('uses role="status" for default variant', () => {
      render(<Toast variant="default" message="Default message" data-testid="toast" />);
      expect(screen.getByTestId('toast')).toHaveAttribute('role', 'status');
    });
  });

  describe('ARIA Live Regions', () => {
    it('uses aria-live="assertive" for error notifications', () => {
      render(<Toast variant="error" message="Error" data-testid="toast" />);
      expect(screen.getByTestId('toast')).toHaveAttribute('aria-live', 'assertive');
    });

    it('uses aria-live="assertive" for warning notifications', () => {
      render(<Toast variant="warning" message="Warning" data-testid="toast" />);
      expect(screen.getByTestId('toast')).toHaveAttribute('aria-live', 'assertive');
    });

    it('uses aria-live="polite" for success notifications', () => {
      render(<Toast variant="success" message="Success" data-testid="toast" />);
      expect(screen.getByTestId('toast')).toHaveAttribute('aria-live', 'polite');
    });

    it('uses aria-live="polite" for info notifications', () => {
      render(<Toast variant="info" message="Info" data-testid="toast" />);
      expect(screen.getByTestId('toast')).toHaveAttribute('aria-live', 'polite');
    });

    it('has aria-atomic="true" for complete content announcement', () => {
      render(<Toast message="Test" data-testid="toast" />);
      expect(screen.getByTestId('toast')).toHaveAttribute('aria-atomic', 'true');
    });
  });

  describe('Labeling', () => {
    it('associates title with aria-labelledby when present', () => {
      render(<Toast title="My Title" message="Message" id="toast-1" data-testid="toast" />);
      expect(screen.getByTestId('toast')).toHaveAttribute('aria-labelledby', 'toast-1-title');
    });

    it('uses aria-label when provided and no title', () => {
      render(<Toast message="Message" aria-label="Custom label" data-testid="toast" />);
      expect(screen.getByTestId('toast')).toHaveAttribute('aria-label', 'Custom label');
    });

    it('prefers aria-labelledby over aria-label when title is present', () => {
      render(
        <Toast
          title="Title"
          message="Message"
          aria-label="Custom label"
          id="toast-1"
          data-testid="toast"
        />
      );
      // When title is present, aria-labelledby should be used
      const toast = screen.getByTestId('toast');
      expect(toast).toHaveAttribute('aria-labelledby', 'toast-1-title');
    });
  });

  describe('Close Button Accessibility', () => {
    it('has accessible name for close button', () => {
      render(<Toast message="Test" data-testid="toast" />);
      const closeButton = screen.getByRole('button', { name: /close notification/i });
      expect(closeButton).toBeInTheDocument();
    });

    it('supports custom close button label', () => {
      render(<Toast message="Test" closeButtonLabel="Dismiss alert" data-testid="toast" />);
      const closeButton = screen.getByRole('button', { name: 'Dismiss alert' });
      expect(closeButton).toBeInTheDocument();
    });

    it('close button has type="button"', () => {
      render(<Toast message="Test" data-testid="toast" />);
      const closeButton = screen.getByRole('button', { name: /close notification/i });
      expect(closeButton).toHaveAttribute('type', 'button');
    });

    it('close button is focusable', () => {
      render(<Toast message="Test" data-testid="toast" />);
      const closeButton = screen.getByRole('button', { name: /close notification/i });
      closeButton.focus();
      expect(document.activeElement).toBe(closeButton);
    });
  });

  describe('Progress Bar Accessibility', () => {
    it('progress bar has role="progressbar"', () => {
      jest.useFakeTimers();
      render(<Toast message="Test" showProgress duration={5000} data-testid="toast" />);

      // Wait for entering animation - must be wrapped in act() to handle state updates
      act(() => {
        jest.advanceTimersByTime(200);
      });

      expect(screen.getByRole('progressbar')).toBeInTheDocument();
      jest.useRealTimers();
    });

    it('progress bar has aria-valuemin and aria-valuemax', () => {
      jest.useFakeTimers();
      render(<Toast message="Test" showProgress duration={5000} data-testid="toast" />);

      act(() => {
        jest.advanceTimersByTime(200);
      });

      const progressbar = screen.getByRole('progressbar');
      expect(progressbar).toHaveAttribute('aria-valuemin', '0');
      expect(progressbar).toHaveAttribute('aria-valuemax', '100');
      jest.useRealTimers();
    });

    it('progress bar has aria-valuenow', () => {
      jest.useFakeTimers();
      render(<Toast message="Test" showProgress duration={5000} data-testid="toast" />);

      act(() => {
        jest.advanceTimersByTime(200);
      });

      const progressbar = screen.getByRole('progressbar');
      expect(progressbar).toHaveAttribute('aria-valuenow');
      jest.useRealTimers();
    });
  });

  describe('Visual Indicators', () => {
    it('includes icon for success variant', () => {
      render(<Toast variant="success" message="Success" data-testid="toast" />);
      const toast = screen.getByTestId('toast');
      const icon = toast.querySelector('svg');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });

    it('includes icon for error variant', () => {
      render(<Toast variant="error" message="Error" data-testid="toast" />);
      const toast = screen.getByTestId('toast');
      const icon = toast.querySelector('svg');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });

    it('includes icon for warning variant', () => {
      render(<Toast variant="warning" message="Warning" data-testid="toast" />);
      const toast = screen.getByTestId('toast');
      const icon = toast.querySelector('svg');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });

    it('includes icon for info variant', () => {
      render(<Toast variant="info" message="Info" data-testid="toast" />);
      const toast = screen.getByTestId('toast');
      const icon = toast.querySelector('svg');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });

    it('custom icon is decorative with aria-hidden', () => {
      render(
        <Toast message="Test" icon={<span data-testid="custom-icon">★</span>} data-testid="toast" />
      );
      // The icon wrapper should have aria-hidden
      const toast = screen.getByTestId('toast');
      const iconWrapper = toast.querySelector('[aria-hidden="true"]');
      expect(iconWrapper).toBeInTheDocument();
    });
  });

  describe('Focus Management', () => {
    it('toast does not trap focus', () => {
      render(
        <div>
          <button type="button" data-testid="before">
            Before
          </button>
          <Toast message="Test" data-testid="toast" />
          <button type="button" data-testid="after">
            After
          </button>
        </div>
      );

      const beforeButton = screen.getByTestId('before');
      const afterButton = screen.getByTestId('after');

      beforeButton.focus();
      expect(document.activeElement).toBe(beforeButton);

      afterButton.focus();
      expect(document.activeElement).toBe(afterButton);
    });

    it('close button can receive focus', () => {
      render(<Toast message="Test" data-testid="toast" />);

      const closeButton = screen.getByRole('button', { name: /close notification/i });
      closeButton.focus();
      expect(document.activeElement).toBe(closeButton);
    });
  });

  describe('Color Contrast', () => {
    // Note: jest-axe should catch color contrast issues
    // These tests verify that color classes are applied correctly

    it('applies correct color classes for success variant', () => {
      render(<Toast variant="success" message="Success" data-testid="toast" />);
      expect(screen.getByTestId('toast')).toHaveClass('text-bg-success');
    });

    it('applies correct color classes for error variant', () => {
      render(<Toast variant="error" message="Error" data-testid="toast" />);
      expect(screen.getByTestId('toast')).toHaveClass('text-bg-danger');
    });

    it('applies correct color classes for warning variant', () => {
      render(<Toast variant="warning" message="Warning" data-testid="toast" />);
      expect(screen.getByTestId('toast')).toHaveClass('text-bg-warning');
    });

    it('applies correct color classes for info variant', () => {
      render(<Toast variant="info" message="Info" data-testid="toast" />);
      expect(screen.getByTestId('toast')).toHaveClass('text-bg-info');
    });
  });
});

describe('ToastContainer Accessibility Tests', () => {
  describe('WCAG 2.2 AA Compliance - jest-axe', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(
        <ToastContainer>
          <Toast message="Test notification" />
        </ToastContainer>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with multiple toasts', async () => {
      const { container } = render(
        <ToastContainer>
          <Toast message="First notification" />
          <Toast message="Second notification" />
        </ToastContainer>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Live Region', () => {
    it('has aria-live="polite" on container', () => {
      render(
        <ToastContainer data-testid="container">
          <Toast message="Test" />
        </ToastContainer>
      );
      expect(screen.getByTestId('container')).toHaveAttribute('aria-live', 'polite');
    });

    it('has aria-atomic="true" on container', () => {
      render(
        <ToastContainer data-testid="container">
          <Toast message="Test" />
        </ToastContainer>
      );
      expect(screen.getByTestId('container')).toHaveAttribute('aria-atomic', 'true');
    });
  });

  describe('Semantic Structure', () => {
    it('uses appropriate landmark or generic element', () => {
      render(
        <ToastContainer data-testid="container">
          <Toast message="Test" />
        </ToastContainer>
      );
      // Container is a div which is appropriate for a toast container
      const container = screen.getByTestId('container');
      expect(container.tagName.toLowerCase()).toBe('div');
    });
  });
});

describe('ToastProvider Accessibility Tests', () => {
  describe('WCAG 2.2 AA Compliance - jest-axe', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(
        <ToastProvider>
          <div>App content</div>
        </ToastProvider>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});

describe('Screen Reader Announcements', () => {
  it('error messages are announced immediately', () => {
    render(<Toast variant="error" message="Critical error occurred" data-testid="toast" />);

    const toast = screen.getByTestId('toast');
    // aria-live="assertive" ensures immediate announcement
    expect(toast).toHaveAttribute('aria-live', 'assertive');
    // role="alert" also ensures announcement
    expect(toast).toHaveAttribute('role', 'alert');
  });

  it('success messages are announced politely', () => {
    render(<Toast variant="success" message="Operation completed" data-testid="toast" />);

    const toast = screen.getByTestId('toast');
    // aria-live="polite" waits for opportune moment
    expect(toast).toHaveAttribute('aria-live', 'polite');
    expect(toast).toHaveAttribute('role', 'status');
  });

  it('atomic announcement ensures complete message', () => {
    render(<Toast title="Important" message="Please read this carefully" data-testid="toast" />);

    const toast = screen.getByTestId('toast');
    // aria-atomic="true" ensures the entire region is announced
    expect(toast).toHaveAttribute('aria-atomic', 'true');
  });
});
