import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

import { Badge } from './Badge';

import type { BadgeProps } from './Badge.types';

expect.extend(toHaveNoViolations);

describe('Badge', () => {
  describe('Rendering', () => {
    it('renders without crashing', () => {
      render(<Badge>New</Badge>);
      expect(screen.getByText('New')).toBeInTheDocument();
    });

    it('renders children correctly', () => {
      render(<Badge>Test Badge</Badge>);
      expect(screen.getByText('Test Badge')).toBeInTheDocument();
    });

    it('renders as span by default', () => {
      const { container } = render(<Badge>Badge</Badge>);
      expect(container.querySelector('span.badge')).toBeInTheDocument();
    });

    it('renders as div when specified', () => {
      const { container } = render(<Badge as="div">Badge</Badge>);
      expect(container.querySelector('div.badge')).toBeInTheDocument();
    });

    it('has base Bootstrap badge class', () => {
      render(<Badge>Badge</Badge>);
      expect(screen.getByText('Badge')).toHaveClass('badge');
    });
  });

  describe('Variants', () => {
    const variants: BadgeProps['variant'][] = [
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
      it(`renders ${variant} variant with Bootstrap text-bg class`, () => {
        render(<Badge variant={variant}>{variant}</Badge>);
        const badge = screen.getByText(variant);
        expect(badge).toHaveClass('badge');
        expect(badge).toHaveClass(`text-bg-${variant}`);
      });
    });

    it('defaults to primary variant', () => {
      render(<Badge>Default</Badge>);
      expect(screen.getByText('Default')).toHaveClass('text-bg-primary');
    });
  });

  describe('Pill Shape', () => {
    it('applies rounded-pill class when pill prop is true', () => {
      render(<Badge pill>Pill Badge</Badge>);
      expect(screen.getByText('Pill Badge')).toHaveClass('rounded-pill');
    });

    it('does not apply rounded-pill class by default', () => {
      render(<Badge>Regular Badge</Badge>);
      expect(screen.getByText('Regular Badge')).not.toHaveClass('rounded-pill');
    });
  });

  describe('Dot Indicator', () => {
    it('renders dot indicator when dot prop is true', () => {
      const { container } = render(<Badge dot>With Dot</Badge>);
      const dot = container.querySelector('.rounded-circle');
      expect(dot).toBeInTheDocument();
    });

    it('does not render dot indicator by default', () => {
      const { container } = render(<Badge>No Dot</Badge>);
      const dot = container.querySelector('.rounded-circle');
      expect(dot).not.toBeInTheDocument();
    });

    it('renders dot before content', () => {
      const { container } = render(<Badge dot>Content</Badge>);
      const badge = container.querySelector('.badge');
      const dot = container.querySelector('.rounded-circle');
      const children = Array.from(badge?.childNodes || []);
      const dotIndex = children.findIndex((child) => child === dot);
      expect(dotIndex).toBe(0);
    });

    it('has role="status" for dot-only badges', () => {
      const { container } = render(<Badge dot aria-label="Online" />);
      expect(container.querySelector('.badge')).toHaveAttribute('role', 'status');
    });

    it('does not have role="status" when badge has content', () => {
      const { container } = render(<Badge dot>Content</Badge>);
      expect(container.querySelector('.badge')).not.toHaveAttribute('role', 'status');
    });
  });

  describe('Icon Support', () => {
    it('renders icon when provided', () => {
      render(<Badge icon={<span data-testid="icon">★</span>}>With Icon</Badge>);
      expect(screen.getByTestId('icon')).toBeInTheDocument();
    });

    it('renders icon before text', () => {
      const { container } = render(<Badge icon={<span data-testid="icon">★</span>}>Text</Badge>);
      const badge = container.querySelector('.badge');
      const children = Array.from(badge?.childNodes || []);
      const iconWrapper = children.find(
        (child) => child instanceof HTMLElement && child.querySelector('[data-testid="icon"]')
      );
      const textNode = children.find(
        (child) => child.textContent === 'Text' && child.nodeType === Node.TEXT_NODE
      );
      const iconIndex = children.indexOf(iconWrapper as ChildNode);
      const textIndex = children.indexOf(textNode as ChildNode);
      expect(iconIndex).toBeLessThan(textIndex);
    });
  });

  describe('Custom Styling', () => {
    it('accepts custom className', () => {
      render(<Badge className="custom-class">Custom</Badge>);
      const badge = screen.getByText('Custom');
      expect(badge).toHaveClass('custom-class');
      expect(badge).toHaveClass('badge'); // Still has base class
    });

    it('accepts inline styles', () => {
      render(<Badge style={{ marginLeft: '10px' }}>Styled</Badge>);
      expect(screen.getByText('Styled')).toHaveStyle({ marginLeft: '10px' });
    });
  });

  describe('HTML Attributes', () => {
    it('accepts id attribute', () => {
      render(<Badge id="test-badge">Badge</Badge>);
      expect(screen.getByText('Badge')).toHaveAttribute('id', 'test-badge');
    });

    it('accepts aria-label', () => {
      render(<Badge aria-label="New notifications">3</Badge>);
      expect(screen.getByText('3')).toHaveAttribute('aria-label', 'New notifications');
    });
  });

  describe('Accessibility (WCAG 2.2 AA)', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(<Badge>Accessible</Badge>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no violations with all variants', async () => {
      const { container } = render(
        <>
          <Badge variant="primary">Primary</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="danger">Danger</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="info">Info</Badge>
        </>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no violations with pill badges', async () => {
      const { container } = render(<Badge pill>Pill</Badge>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no violations with dot indicator', async () => {
      const { container } = render(
        <Badge dot aria-label="Status indicator">
          Online
        </Badge>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no violations with icon', async () => {
      const { container } = render(<Badge icon={<span>★</span>}>Featured</Badge>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Display Name', () => {
    it('has correct displayName', () => {
      expect(Badge.displayName).toBe('Badge');
    });
  });
});
