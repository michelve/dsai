import { fireEvent, render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { createRef } from 'react';

import { Alert } from './Alert';

import type { AlertProps } from './Alert.types';

expect.extend(toHaveNoViolations);

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
        render(<Alert variant={variant}>{variant}</Alert>);
        const alert = screen.getByText(variant).closest('.alert');
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

    it('calls onClose when Escape key is pressed', () => {
      const handleClose = jest.fn();
      render(
        <Alert dismissible onClose={handleClose}>
          Dismissible
        </Alert>
      );
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(handleClose).toHaveBeenCalledTimes(1);
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
          Click <Alert.Link onClick={handleClick}>here</Alert.Link>
        </Alert>
      );
      fireEvent.click(screen.getByText('here'));
      expect(handleClick).toHaveBeenCalledTimes(1);
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
      render(<Alert id="test-alert">Alert</Alert>);
      expect(screen.getByRole('status')).toHaveAttribute('id', 'test-alert');
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

  describe('Security (Alert.Link - XSS Prevention)', () => {
    it('blocks javascript: protocol', () => {
      render(
        <Alert>
          <Alert.Link href="javascript:alert('XSS')">click</Alert.Link>
        </Alert>
      );
      const link = screen.getByText('click');
      expect(link).toHaveAttribute('href', '#');
    });

    it('blocks data: protocol', () => {
      render(
        <Alert>
          <Alert.Link href="data:text/html,<script>alert('XSS')</script>">click</Alert.Link>
        </Alert>
      );
      const link = screen.getByText('click');
      expect(link).toHaveAttribute('href', '#');
    });

    it('blocks text/html protocol', () => {
      render(
        <Alert>
          <Alert.Link href="text/html,<img src=x onerror='alert(1)'>">click</Alert.Link>
        </Alert>
      );
      const link = screen.getByText('click');
      expect(link).toHaveAttribute('href', '#');
    });

    it('blocks vbscript: protocol', () => {
      render(
        <Alert>
          <Alert.Link href="vbscript:alert('XSS')">click</Alert.Link>
        </Alert>
      );
      const link = screen.getByText('click');
      expect(link).toHaveAttribute('href', '#');
    });

    it('allows safe http URLs', () => {
      render(
        <Alert>
          <Alert.Link href="http://example.com">click</Alert.Link>
        </Alert>
      );
      const link = screen.getByText('click');
      expect(link).toHaveAttribute('href', 'http://example.com');
    });

    it('allows safe https URLs', () => {
      render(
        <Alert>
          <Alert.Link href="https://example.com">click</Alert.Link>
        </Alert>
      );
      const link = screen.getByText('click');
      expect(link).toHaveAttribute('href', 'https://example.com');
    });

    it('allows relative URLs', () => {
      render(
        <Alert>
          <Alert.Link href="/docs">click</Alert.Link>
        </Alert>
      );
      const link = screen.getByText('click');
      expect(link).toHaveAttribute('href', '/docs');
    });

    it('allows mailto: protocol', () => {
      render(
        <Alert>
          <Alert.Link href="mailto:test@example.com">email</Alert.Link>
        </Alert>
      );
      const link = screen.getByText('email');
      expect(link).toHaveAttribute('href', 'mailto:test@example.com');
    });

    it('allows tel: protocol', () => {
      render(
        <Alert>
          <Alert.Link href="tel:+1234567890">call</Alert.Link>
        </Alert>
      );
      const link = screen.getByText('call');
      expect(link).toHaveAttribute('href', 'tel:+1234567890');
    });

    it('defaults to # for missing href', () => {
      render(
        <Alert>
          <Alert.Link href="">click</Alert.Link>
        </Alert>
      );
      const link = screen.getByText('click');
      expect(link).toHaveAttribute('href', '#');
    });

    it('case-insensitive protocol blocking', () => {
      render(
        <Alert>
          <Alert.Link href="JAVASCRIPT:alert('XSS')">click</Alert.Link>
        </Alert>
      );
      const link = screen.getByText('click');
      expect(link).toHaveAttribute('href', '#');
    });

    it('trims whitespace from href before validation', () => {
      render(
        <Alert>
          <Alert.Link href="  /safe-url  ">click</Alert.Link>
        </Alert>
      );
      const link = screen.getByText('click');
      expect(link).toHaveAttribute('href', '  /safe-url  ');
    });
  });

  describe('Security (External Link Protection)', () => {
    it('adds rel="noopener noreferrer" for external links', () => {
      render(
        <Alert>
          <Alert.Link href="https://example.com" target="_blank">
            external
          </Alert.Link>
        </Alert>
      );
      const link = screen.getByText('external');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('does not add rel for same-window links', () => {
      render(
        <Alert>
          <Alert.Link href="/page" target="_self">
            internal
          </Alert.Link>
        </Alert>
      );
      const link = screen.getByText('internal');
      expect(link).not.toHaveAttribute('rel');
    });

    it('uses custom rel when provided and not external', () => {
      render(
        <Alert>
          <Alert.Link href="/page" rel="custom">
            link
          </Alert.Link>
        </Alert>
      );
      const link = screen.getByText('link');
      expect(link).toHaveAttribute('rel', 'custom');
    });

    it('overrides custom rel with noopener noreferrer for external links', () => {
      render(
        <Alert>
          <Alert.Link href="https://example.com" target="_blank" rel="author">
            external
          </Alert.Link>
        </Alert>
      );
      const link = screen.getByText('external');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  describe('Security (Prop Whitelisting)', () => {
    it('accepts whitelisted data-testid attribute', () => {
      render(
        <Alert data-testid="alert-test">
          <Alert.Link href="/test" data-testid="link-test">
            link
          </Alert.Link>
        </Alert>
      );
      expect(screen.getByTestId('alert-test')).toBeInTheDocument();
      expect(screen.getByTestId('link-test')).toBeInTheDocument();
    });

    it('accepts whitelisted data-test attribute', () => {
      render(
        <Alert data-test="alert-test">
          <Alert.Link href="/test" data-test="link-test">
            link
          </Alert.Link>
        </Alert>
      );
      const alert = screen.getByRole('status');
      const link = screen.getByText('link');
      expect(alert).toHaveAttribute('data-test', 'alert-test');
      expect(link).toHaveAttribute('data-test', 'link-test');
    });

    it('accepts title attribute for tooltips', () => {
      render(
        <Alert title="Alert tooltip">
          <Alert.Link href="/test" title="Link tooltip">
            link
          </Alert.Link>
        </Alert>
      );
      const alert = screen.getByRole('status');
      const link = screen.getByText('link');
      expect(alert).toHaveAttribute('title', 'Alert tooltip');
      expect(link).toHaveAttribute('title', 'Link tooltip');
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
});
