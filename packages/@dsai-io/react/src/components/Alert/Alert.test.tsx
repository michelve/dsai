import { randomUUID } from 'node:crypto';

import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { createRef } from 'react';

import { Alert } from './Alert';

import type { AlertProps } from './Alert.types';

expect.extend(toHaveNoViolations);

// Named constants for magic numbers (SonarQube S109)
const AUTO_DISMISS_DEFAULT_MS = 3000;
const AUTO_DISMISS_LONG_MS = 5000;
const AUTO_DISMISS_PARTIAL_MS = 2000;
const AUTO_DISMISS_ALMOST_MS = 2999;
const TRANSITION_SAFETY_TIMEOUT_MS = 300;

describe('Alert', () => {
  describe('Rendering', () => {
    it('renders without crashing', () => {
      render(<Alert>Test message</Alert>);
      expect(screen.getByText('Test message')).toBeInTheDocument();
    });

    it('renders children correctly', () => {
      render(<Alert>Alert content here</Alert>);
      expect(screen.getByText('Alert content here')).toBeInTheDocument();
    });

    it('renders as div by default', () => {
      const { container } = render(<Alert>Alert</Alert>);
      expect(container.querySelector('div.alert')).toBeInTheDocument();
    });

    it('renders as section when specified', () => {
      const { container } = render(<Alert as="section">Alert</Alert>);
      expect(container.querySelector('section.alert')).toBeInTheDocument();
    });

    it('has base Bootstrap alert class', () => {
      render(<Alert>Alert</Alert>);
      expect(screen.getByRole('status')).toHaveClass('alert');
    });

    it('does not render when show is false', () => {
      render(<Alert show={false}>Hidden alert</Alert>);
      expect(screen.queryByText('Hidden alert')).not.toBeInTheDocument();
    });

    it('renders when show is true', () => {
      render(<Alert show>Visible alert</Alert>);
      expect(screen.getByText('Visible alert')).toBeInTheDocument();
    });
  });

  describe('Variants', () => {
    const variants: AlertProps['variant'][] = [
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
      it(`renders ${variant} variant with Bootstrap alert class`, () => {
        render(<Alert variant={variant}>{String(variant)}</Alert>);
        const element = screen.getByText(String(variant));
        const alert = element.closest('.alert');
        expect(alert).toBeInTheDocument();
        expect(alert).toHaveClass('alert');
        expect(alert).toHaveClass(`alert-${variant}`);
      });
    });

    it('defaults to primary variant', () => {
      render(<Alert>Default</Alert>);
      expect(screen.getByRole('status')).toHaveClass('alert-primary');
    });
  });

  describe('Title', () => {
    it('renders title when provided', () => {
      render(<Alert title="Alert Title">Content</Alert>);
      expect(screen.getByText('Alert Title')).toBeInTheDocument();
    });

    it('renders title with alert-heading class', () => {
      render(<Alert title="Alert Title">Content</Alert>);
      expect(screen.getByText('Alert Title')).toHaveClass('alert-heading');
    });

    it('does not render title when not provided', () => {
      const { container } = render(<Alert>Content only</Alert>);
      expect(container.querySelector('.alert-heading')).not.toBeInTheDocument();
    });

    it('does not set HTML title attribute on root element', () => {
      render(<Alert title="Alert Title">Content</Alert>);
      expect(screen.getByRole('status')).not.toHaveAttribute('title');
    });
  });

  describe('Dismissible', () => {
    it('renders close button when dismissible', () => {
      const handleClose = jest.fn();
      render(
        <Alert dismissible onClose={handleClose}>
          Dismissible
        </Alert>
      );
      expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
    });

    it('does not render close button when not dismissible', () => {
      render(<Alert>Not dismissible</Alert>);
      expect(screen.queryByRole('button', { name: /close/i })).not.toBeInTheDocument();
    });

    it('calls onClose when close button is clicked', () => {
      const handleClose = jest.fn();
      render(
        <Alert dismissible onClose={handleClose}>
          Dismissible
        </Alert>
      );
      fireEvent.click(screen.getByRole('button', { name: /close/i }));
      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it('applies alert-dismissible class when dismissible', () => {
      const handleClose = jest.fn();
      render(
        <Alert dismissible onClose={handleClose}>
          Dismissible
        </Alert>
      );
      expect(screen.getByRole('status')).toHaveClass('alert-dismissible');
    });

    it('applies fade show classes when dismissible', () => {
      const handleClose = jest.fn();
      render(
        <Alert dismissible onClose={handleClose}>
          Dismissible
        </Alert>
      );
      expect(screen.getByRole('status')).toHaveClass('fade', 'show');
    });

    it('calls onClose when Escape key is pressed with focus inside alert', () => {
      const handleClose = jest.fn();
      render(
        <Alert dismissible onClose={handleClose}>
          Dismissible
        </Alert>
      );
      // Focus the close button inside the alert
      screen.getByRole('button', { name: /close/i }).focus();
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it('does not call onClose on Escape when focus is outside the alert', () => {
      const handleClose = jest.fn();
      render(
        <>
          <button type="button">Outside</button>
          <Alert dismissible onClose={handleClose}>
            Dismissible
          </Alert>
        </>
      );
      screen.getByRole('button', { name: 'Outside' }).focus();
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(handleClose).not.toHaveBeenCalled();
    });

    it('does not call onClose on Escape when not dismissible', () => {
      const handleClose = jest.fn();
      render(<Alert onClose={handleClose}>Not dismissible</Alert>);
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(handleClose).not.toHaveBeenCalled();
    });
  });

  describe('Icon', () => {
    it('renders icon when provided', () => {
      render(<Alert icon={<span data-testid="icon">★</span>}>With icon</Alert>);
      expect(screen.getByTestId('icon')).toBeInTheDocument();
    });

    it('does not render icon wrapper when icon not provided', () => {
      const { container } = render(<Alert>No icon</Alert>);
      // No icon wrapper with aria-hidden should be present
      const iconWrapper = container.querySelector('[aria-hidden="true"]');
      expect(iconWrapper).not.toBeInTheDocument();
    });

    it('icon has aria-hidden for accessibility', () => {
      const { container } = render(
        <Alert icon={<span data-testid="icon">★</span>}>With icon</Alert>
      );
      const iconWrapper = container.querySelector('[aria-hidden="true"]');
      expect(iconWrapper).toBeInTheDocument();
    });
  });

  describe('Alert.Link', () => {
    it('renders Alert.Link correctly', () => {
      render(
        <Alert>
          Click <Alert.Link href="/test">here</Alert.Link>
        </Alert>
      );
      expect(screen.getByText('here')).toBeInTheDocument();
    });

    it('has alert-link class', () => {
      render(
        <Alert>
          Click <Alert.Link href="/test">here</Alert.Link>
        </Alert>
      );
      expect(screen.getByText('here')).toHaveClass('alert-link');
    });

    it('accepts href attribute', () => {
      render(
        <Alert>
          Click <Alert.Link href="/test">here</Alert.Link>
        </Alert>
      );
      expect(screen.getByText('here')).toHaveAttribute('href', '/test');
    });

    it('accepts onClick handler', () => {
      const handleClick = jest.fn();
      render(
        <Alert>
          Click{' '}
          <Alert.Link href="#" onClick={handleClick}>
            here
          </Alert.Link>
        </Alert>
      );
      fireEvent.click(screen.getByText('here'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('adds noopener noreferrer for target="_blank"', () => {
      render(
        <Alert>
          <Alert.Link href="https://example.com" target="_blank">
            external
          </Alert.Link>
        </Alert>
      );
      expect(screen.getByText('external')).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('merges user-provided rel with noopener noreferrer for target="_blank"', () => {
      render(
        <Alert>
          <Alert.Link href="https://example.com" target="_blank" rel="author">
            external
          </Alert.Link>
        </Alert>
      );
      const link = screen.getByText('external');
      expect(link).toHaveAttribute('rel');
      const relValue = link.getAttribute('rel') ?? '';
      expect(relValue).toContain('author');
      expect(relValue).toContain('noopener');
      expect(relValue).toContain('noreferrer');
    });

    it('preserves user rel when target is not _blank', () => {
      render(
        <Alert>
          <Alert.Link href="/test" rel="author">
            link
          </Alert.Link>
        </Alert>
      );
      expect(screen.getByText('link')).toHaveAttribute('rel', 'author');
    });
  });

  describe('Alert.Heading', () => {
    it('renders Alert.Heading correctly', () => {
      render(
        <Alert>
          <Alert.Heading>Title</Alert.Heading>
          Content
        </Alert>
      );
      expect(screen.getByText('Title')).toBeInTheDocument();
    });

    it('has alert-heading class', () => {
      render(
        <Alert>
          <Alert.Heading>Title</Alert.Heading>
          Content
        </Alert>
      );
      expect(screen.getByText('Title')).toHaveClass('alert-heading');
    });

    it('renders as h4 by default', () => {
      render(
        <Alert>
          <Alert.Heading>Title</Alert.Heading>
          Content
        </Alert>
      );
      expect(screen.getByText('Title').tagName).toBe('H4');
    });

    it('renders as specified heading level', () => {
      render(
        <Alert>
          <Alert.Heading as="h2">Title</Alert.Heading>
          Content
        </Alert>
      );
      expect(screen.getByText('Title').tagName).toBe('H2');
    });
  });

  describe('Custom Styling', () => {
    it('accepts custom className', () => {
      render(<Alert className="custom-class">Custom</Alert>);
      expect(screen.getByRole('status')).toHaveClass('custom-class');
      expect(screen.getByRole('status')).toHaveClass('alert'); // Still has base class
    });

    it('accepts inline styles', () => {
      render(<Alert style={{ marginTop: '20px' }}>Styled</Alert>);
      expect(screen.getByRole('status')).toHaveStyle({ marginTop: '20px' });
    });
  });

  describe('HTML Attributes', () => {
    it('accepts id attribute', () => {
      const testId = `test-alert-${randomUUID()}`;
      render(<Alert id={testId}>Alert</Alert>);
      expect(screen.getByRole('status')).toHaveAttribute('id', testId);
    });
  });

  describe('Accessibility (WCAG 2.2 AA)', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(<Alert>Accessible alert</Alert>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no violations with all variants', async () => {
      const { container } = render(
        <>
          <Alert variant="primary">Primary</Alert>
          <Alert variant="secondary">Secondary</Alert>
          <Alert variant="success">Success</Alert>
          <Alert variant="danger">Danger</Alert>
          <Alert variant="warning">Warning</Alert>
          <Alert variant="info">Info</Alert>
        </>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no violations when dismissible', async () => {
      const { container } = render(
        <Alert dismissible onClose={() => {}}>
          Dismissible
        </Alert>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no violations with title and icon', async () => {
      const { container } = render(
        <Alert title="Title" icon={<span>★</span>}>
          Content
        </Alert>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has role="alert" for danger variant', () => {
      render(<Alert variant="danger">Danger alert</Alert>);
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('has role="alert" for warning variant', () => {
      render(<Alert variant="warning">Warning alert</Alert>);
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('has role="status" for info variant', () => {
      render(<Alert variant="info">Info alert</Alert>);
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('has role="status" for success variant', () => {
      render(<Alert variant="success">Success alert</Alert>);
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('has aria-live="assertive" for danger variant', () => {
      render(<Alert variant="danger">Danger</Alert>);
      expect(screen.getByRole('alert')).toHaveAttribute('aria-live', 'assertive');
    });

    it('has aria-live="polite" for other variants', () => {
      render(<Alert variant="info">Info</Alert>);
      expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');
    });

    it('close button has aria-label', () => {
      render(
        <Alert dismissible onClose={() => {}}>
          Dismissible
        </Alert>
      );
      expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Close');
    });
  });

  describe('Ref Forwarding', () => {
    it('forwards ref to the alert element', () => {
      const ref = createRef<HTMLDivElement>();
      render(<Alert ref={ref}>With ref</Alert>);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current).toBe(screen.getByRole('status'));
    });

    it('forwards ref to Alert.Link element', () => {
      const ref = createRef<HTMLAnchorElement>();
      render(
        <Alert>
          <Alert.Link ref={ref} href="/test">
            link
          </Alert.Link>
        </Alert>
      );
      expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
      expect(ref.current).toBe(screen.getByText('link'));
    });

    it('forwards ref to Alert.Heading element', () => {
      const ref = createRef<HTMLHeadingElement>();
      render(
        <Alert>
          <Alert.Heading ref={ref}>Heading Text</Alert.Heading>
        </Alert>
      );
      expect(ref.current).toBeInstanceOf(HTMLHeadingElement);
      expect(ref.current).toBe(screen.getByText('Heading Text'));
    });
  });

  describe('Display Name', () => {
    it('has correct displayName for Alert', () => {
      expect(Alert.displayName).toBe('Alert');
    });

    it('has correct displayName for Alert.Link', () => {
      expect(Alert.Link.displayName).toBe('Alert.Link');
    });

    it('has correct displayName for Alert.Heading', () => {
      expect(Alert.Heading.displayName).toBe('Alert.Heading');
    });
  });

  describe('Performance (Memoization)', () => {
    it('AlertLink is memoized', () => {
      const { rerender } = render(
        <Alert>
          <Alert.Link href="/test">link</Alert.Link>
        </Alert>
      );
      const linkBefore = screen.getByText('link');

      rerender(
        <Alert>
          <Alert.Link href="/test">link</Alert.Link>
        </Alert>
      );
      const linkAfter = screen.getByText('link');

      // With memoization, className construction shouldn't cause unnecessary re-renders
      expect(linkBefore).toBe(linkAfter);
    });

    it('AlertHeading is memoized', () => {
      const { rerender } = render(
        <Alert>
          <Alert.Heading>Title</Alert.Heading>
        </Alert>
      );
      const headingBefore = screen.getByText('Title');

      rerender(
        <Alert>
          <Alert.Heading>Title</Alert.Heading>
        </Alert>
      );
      const headingAfter = screen.getByText('Title');

      expect(headingBefore).toBe(headingAfter);
    });
  });

  describe('Accessibility (aria-atomic)', () => {
    it('has aria-atomic="true" by default', () => {
      render(<Alert>Alert</Alert>);
      expect(screen.getByRole('status')).toHaveAttribute('aria-atomic', 'true');
    });

    it('respects aria-atomic={false} when provided', () => {
      render(<Alert aria-atomic={false}>Alert</Alert>);
      expect(screen.getByRole('status')).toHaveAttribute('aria-atomic', 'false');
    });

    it('aria-atomic works with dismissible alerts', () => {
      render(
        <Alert dismissible onClose={() => {}}>
          Dismissible
        </Alert>
      );
      expect(screen.getByRole('status')).toHaveAttribute('aria-atomic', 'true');
    });
  });

  describe('FSM Integration', () => {
    it('exposes data-visual-state="visible" when shown', () => {
      render(<Alert>Visible</Alert>);
      expect(screen.getByRole('status')).toHaveAttribute('data-visual-state', 'visible');
    });

    it('removes element from DOM when dismissed via click (no transition)', () => {
      const handleClose = jest.fn();
      render(
        <Alert dismissible onClose={handleClose} transition={false}>
          Dismissible
        </Alert>
      );
      fireEvent.click(screen.getByRole('button', { name: /close/i }));
      expect(screen.queryByText('Dismissible')).not.toBeInTheDocument();
      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it('removes element from DOM when dismissed via Escape (no transition)', () => {
      const handleClose = jest.fn();
      render(
        <Alert dismissible onClose={handleClose} transition={false}>
          Dismissible
        </Alert>
      );
      screen.getByRole('button', { name: /close/i }).focus();
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(screen.queryByText('Dismissible')).not.toBeInTheDocument();
      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it('enters dismissing state before hiding when transition is enabled', () => {
      const handleClose = jest.fn();
      render(
        <Alert dismissible onClose={handleClose}>
          Dismissible
        </Alert>
      );
      fireEvent.click(screen.getByRole('button', { name: /close/i }));
      // With transition=true (default), element enters dismissing state
      expect(screen.getByText('Dismissible')).toBeInTheDocument();
      expect(screen.getByText('Dismissible').closest('.alert')).toHaveAttribute(
        'data-visual-state',
        'dismissing'
      );
      expect(screen.getByText('Dismissible').closest('.alert')).not.toHaveClass('show');
    });

    it('shows alert when show prop changes from false to true', () => {
      const { rerender } = render(<Alert show={false}>Toggle Alert</Alert>);
      expect(screen.queryByText('Toggle Alert')).not.toBeInTheDocument();

      rerender(<Alert show={true}>Toggle Alert</Alert>);
      expect(screen.getByText('Toggle Alert')).toBeInTheDocument();
      expect(screen.getByRole('status')).toHaveAttribute('data-visual-state', 'visible');
    });

    it('hides alert when show prop changes from true to false', () => {
      const { rerender } = render(<Alert show={true}>Toggle Alert</Alert>);
      expect(screen.getByText('Toggle Alert')).toBeInTheDocument();

      rerender(<Alert show={false}>Toggle Alert</Alert>);
      expect(screen.queryByText('Toggle Alert')).not.toBeInTheDocument();
    });
  });

  describe('Icon (cloneElement path)', () => {
    it('merges className onto a valid React element icon', () => {
      render(
        <Alert icon={<svg data-testid="svg-icon" className="custom-icon" />}>With SVG icon</Alert>
      );
      const icon = screen.getByTestId('svg-icon');
      expect(icon).toHaveClass('d-inline-flex', 'align-items-center', 'flex-shrink-0', 'me-2');
      expect(icon).toHaveClass('custom-icon');
    });

    it('sets aria-hidden="true" on element icon when no iconLabel', () => {
      render(<Alert icon={<svg data-testid="svg-icon" />}>With icon</Alert>);
      expect(screen.getByTestId('svg-icon')).toHaveAttribute('aria-hidden', 'true');
    });

    it('preserves existing aria-hidden on element icon when no iconLabel', () => {
      render(<Alert icon={<svg data-testid="svg-icon" aria-hidden={false} />}>With icon</Alert>);
      // aria-hidden from icon element is used since no iconLabel
      expect(screen.getByTestId('svg-icon')).toHaveAttribute('aria-hidden', 'false');
    });

    it('sets role="img" and aria-label when iconLabel is provided', () => {
      render(
        <Alert icon={<svg data-testid="svg-icon" />} iconLabel="Error indicator">
          With labeled icon
        </Alert>
      );
      const icon = screen.getByTestId('svg-icon');
      expect(icon).toHaveAttribute('aria-label', 'Error indicator');
      expect(icon).toHaveAttribute('role', 'img');
      expect(icon).not.toHaveAttribute('aria-hidden');
    });

    it('uses iconLabel over existing aria-label on element', () => {
      render(
        <Alert icon={<svg data-testid="svg-icon" aria-label="old label" />} iconLabel="new label">
          With icon
        </Alert>
      );
      expect(screen.getByTestId('svg-icon')).toHaveAttribute('aria-label', 'new label');
    });

    it('uses existing aria-label from icon element when no iconLabel', () => {
      render(
        <Alert icon={<svg data-testid="svg-icon" aria-label="existing label" />}>With icon</Alert>
      );
      expect(screen.getByTestId('svg-icon')).toHaveAttribute('aria-label', 'existing label');
    });

    it('preserves existing role on element icon when no ariaLabel', () => {
      render(<Alert icon={<svg data-testid="svg-icon" role="presentation" />}>With icon</Alert>);
      expect(screen.getByTestId('svg-icon')).toHaveAttribute('role', 'presentation');
    });
  });

  describe('Icon (span wrapper fallback)', () => {
    it('wraps non-element icon in a span with aria-hidden', () => {
      render(<Alert icon="★">With string icon</Alert>);
      const status = screen.getByRole('status');
      const iconWrapper = status.querySelector('span[aria-hidden="true"]');
      expect(iconWrapper).toBeInTheDocument();
      expect(iconWrapper).toHaveTextContent('★');
    });

    it('applies layout classes to span wrapper', () => {
      render(<Alert icon="!">With string icon</Alert>);
      const status = screen.getByRole('status');
      const iconWrapper = status.querySelector('span[aria-hidden="true"]');
      expect(iconWrapper).toHaveClass(
        'd-inline-flex',
        'align-items-center',
        'flex-shrink-0',
        'me-2'
      );
    });
  });

  describe('Title rendering', () => {
    it('renders title as heading without setting HTML title attribute on root', () => {
      render(<Alert title="Important">Content</Alert>);
      // Heading rendered inside alert
      expect(screen.getByText('Important')).toHaveClass('alert-heading');
      // No HTML title tooltip on root element
      expect(screen.getByRole('status')).not.toHaveAttribute('title');
    });
  });

  describe('Edge cases', () => {
    it('does not render dismiss button when dismissible but onClose is undefined', () => {
      render(<Alert dismissible>No handler</Alert>);
      expect(screen.queryByRole('button', { name: /close/i })).not.toBeInTheDocument();
    });

    it('does not fire Escape handler when dismissible but onClose is undefined', () => {
      render(<Alert dismissible>No handler</Alert>);
      // Should not throw
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(screen.getByText('No handler')).toBeInTheDocument();
    });

    it('handles non-Escape key presses without dismissing', () => {
      const handleClose = jest.fn();
      render(
        <Alert dismissible onClose={handleClose}>
          Dismissible
        </Alert>
      );
      fireEvent.keyDown(document, { key: 'Enter' });
      expect(handleClose).not.toHaveBeenCalled();
    });

    it('cleans up keyboard listener on unmount', () => {
      const handleClose = jest.fn();
      const { unmount } = render(
        <Alert dismissible onClose={handleClose}>
          Dismissible
        </Alert>
      );
      unmount();
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(handleClose).not.toHaveBeenCalled();
    });
  });

  describe('User interactions (userEvent)', () => {
    it('dismisses via close button click', async () => {
      const user = userEvent.setup();
      const handleClose = jest.fn();
      render(
        <Alert dismissible onClose={handleClose} transition={false}>
          Dismissible
        </Alert>
      );
      await user.click(screen.getByRole('button', { name: /close/i }));
      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it('dismisses via Escape key', async () => {
      const user = userEvent.setup();
      const handleClose = jest.fn();
      render(
        <Alert dismissible onClose={handleClose} transition={false}>
          Dismissible
        </Alert>
      );
      // Focus the close button so Escape is scoped to the alert
      screen.getByRole('button', { name: /close/i }).focus();
      await user.keyboard('{Escape}');
      expect(handleClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('onClose reason', () => {
    it('passes "click" reason when close button is clicked', () => {
      const handleClose = jest.fn();
      render(
        <Alert dismissible onClose={handleClose} transition={false}>
          Alert
        </Alert>
      );
      fireEvent.click(screen.getByRole('button', { name: /close/i }));
      expect(handleClose).toHaveBeenCalledWith('click');
    });

    it('passes "escape" reason when Escape key is pressed', () => {
      const handleClose = jest.fn();
      render(
        <Alert dismissible onClose={handleClose} transition={false}>
          Alert
        </Alert>
      );
      screen.getByRole('button', { name: /close/i }).focus();
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(handleClose).toHaveBeenCalledWith('escape');
    });

    it('passes "timeout" reason when auto-dismiss fires', () => {
      jest.useFakeTimers();
      const handleClose = jest.fn();
      render(
        <Alert autoDismiss={AUTO_DISMISS_DEFAULT_MS} onClose={handleClose} transition={false}>
          Auto-dismiss
        </Alert>
      );
      jest.advanceTimersByTime(AUTO_DISMISS_DEFAULT_MS);
      expect(handleClose).toHaveBeenCalledWith('timeout');
      jest.useRealTimers();
    });
  });

  describe('Auto-dismiss', () => {
    it('auto-dismisses after specified duration', () => {
      jest.useFakeTimers();
      const handleClose = jest.fn();
      render(
        <Alert autoDismiss={AUTO_DISMISS_LONG_MS} onClose={handleClose} transition={false}>
          Auto alert
        </Alert>
      );
      expect(screen.getByText('Auto alert')).toBeInTheDocument();

      act(() => {
        jest.advanceTimersByTime(AUTO_DISMISS_LONG_MS);
      });
      expect(handleClose).toHaveBeenCalledTimes(1);
      expect(screen.queryByText('Auto alert')).not.toBeInTheDocument();
      jest.useRealTimers();
    });

    it('does not auto-dismiss when autoDismiss is 0', () => {
      jest.useFakeTimers();
      const handleClose = jest.fn();
      render(
        <Alert autoDismiss={0} onClose={handleClose}>
          No dismiss
        </Alert>
      );
      jest.advanceTimersByTime(10000);
      expect(handleClose).not.toHaveBeenCalled();
      expect(screen.getByText('No dismiss')).toBeInTheDocument();
      jest.useRealTimers();
    });

    it('does not auto-dismiss when autoDismiss is not set', () => {
      jest.useFakeTimers();
      const handleClose = jest.fn();
      render(<Alert onClose={handleClose}>Normal alert</Alert>);
      jest.advanceTimersByTime(10000);
      expect(handleClose).not.toHaveBeenCalled();
      jest.useRealTimers();
    });

    it('clears timer when alert is hidden before timeout', () => {
      jest.useFakeTimers();
      const handleClose = jest.fn();
      const { rerender } = render(
        <Alert autoDismiss={AUTO_DISMISS_LONG_MS} onClose={handleClose} show={true} transition={false}>
          Auto alert
        </Alert>
      );
      jest.advanceTimersByTime(AUTO_DISMISS_PARTIAL_MS);
      rerender(
        <Alert autoDismiss={AUTO_DISMISS_LONG_MS} onClose={handleClose} show={false} transition={false}>
          Auto alert
        </Alert>
      );
      jest.advanceTimersByTime(AUTO_DISMISS_LONG_MS);
      expect(handleClose).not.toHaveBeenCalled();
      jest.useRealTimers();
    });

    it('restarts timer when alert is re-shown', () => {
      jest.useFakeTimers();
      const handleClose = jest.fn();
      const { rerender } = render(
        <Alert autoDismiss={AUTO_DISMISS_DEFAULT_MS} onClose={handleClose} show={true} transition={false}>
          Auto alert
        </Alert>
      );
      jest.advanceTimersByTime(AUTO_DISMISS_PARTIAL_MS);

      // Hide
      rerender(
        <Alert autoDismiss={AUTO_DISMISS_DEFAULT_MS} onClose={handleClose} show={false} transition={false}>
          Auto alert
        </Alert>
      );

      // Re-show
      rerender(
        <Alert autoDismiss={AUTO_DISMISS_DEFAULT_MS} onClose={handleClose} show={true} transition={false}>
          Auto alert
        </Alert>
      );
      jest.advanceTimersByTime(AUTO_DISMISS_ALMOST_MS);
      expect(handleClose).not.toHaveBeenCalled();

      jest.advanceTimersByTime(1);
      expect(handleClose).toHaveBeenCalledWith('timeout');
      jest.useRealTimers();
    });
  });

  describe('Transition', () => {
    it('has fade class by default', () => {
      render(<Alert>Alert</Alert>);
      expect(screen.getByRole('status')).toHaveClass('fade');
    });

    it('has show class when visible', () => {
      render(<Alert>Alert</Alert>);
      expect(screen.getByRole('status')).toHaveClass('show');
    });

    it('removes show class during dismissing state', () => {
      const handleClose = jest.fn();
      render(
        <Alert dismissible onClose={handleClose}>
          Alert
        </Alert>
      );
      fireEvent.click(screen.getByRole('button', { name: /close/i }));
      const alert = screen.getByText('Alert').closest('.alert');
      expect(alert).toHaveClass('fade');
      expect(alert).not.toHaveClass('show');
    });

    it('removes element from DOM after safety timeout when transitioning', () => {
      jest.useFakeTimers();
      const handleClose = jest.fn();
      render(
        <Alert dismissible onClose={handleClose}>
          Alert
        </Alert>
      );
      fireEvent.click(screen.getByRole('button', { name: /close/i }));
      expect(screen.getByText('Alert')).toBeInTheDocument();

      // Safety timeout fires at TRANSITION_SAFETY_TIMEOUT_MS — wrap in act() for state update
      act(() => {
        jest.advanceTimersByTime(TRANSITION_SAFETY_TIMEOUT_MS);
      });
      expect(screen.queryByText('Alert')).not.toBeInTheDocument();
      jest.useRealTimers();
    });

    it('immediately removes when transition={false}', () => {
      const handleClose = jest.fn();
      render(
        <Alert dismissible onClose={handleClose} transition={false}>
          Alert
        </Alert>
      );
      fireEvent.click(screen.getByRole('button', { name: /close/i }));
      expect(screen.queryByText('Alert')).not.toBeInTheDocument();
    });
  });
});
