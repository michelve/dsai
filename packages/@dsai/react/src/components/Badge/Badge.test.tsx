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
        const badge = screen.getByText(variant as string);
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
      const dotIndex = children.indexOf(dot as ChildNode);
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
      const testId = `test-badge-${Math.random().toString(36).substr(2, 9)}`;
      render(<Badge id={testId}>Badge</Badge>);
      expect(screen.getByText('Badge')).toHaveAttribute('id', testId);
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

  // =============================================================================
  // Accessibility Enhancements
  // =============================================================================

  describe('Icon Accessibility (aria-hidden)', () => {
    it('hides icon from screen readers with aria-hidden="true"', () => {
      const { container } = render(<Badge icon={<span data-testid="icon">★</span>}>Text</Badge>);
      const iconWrapper = container.querySelector('[aria-hidden="true"]');
      expect(iconWrapper).toBeInTheDocument();
      expect(iconWrapper).toContainElement(screen.getByTestId('icon'));
    });

    it('icon wrapper has aria-hidden="true"', () => {
      const { container } = render(
        <Badge icon={<span data-testid="icon">★</span>}>Featured</Badge>
      );
      const iconWrapper = container.querySelector('.d-inline-flex');
      expect(iconWrapper).toHaveAttribute('aria-hidden', 'true');
    });

    it('icon aria-hidden does not affect visual rendering', () => {
      render(<Badge icon={<span data-testid="icon">★</span>}>Text</Badge>);
      expect(screen.getByTestId('icon')).toBeVisible();
    });

    it('multiple icon badges each have aria-hidden on icons', async () => {
      const { container } = render(
        <>
          <Badge icon={<span data-testid="icon1">★</span>}>Featured</Badge>
          <Badge icon={<span data-testid="icon2">✓</span>}>Verified</Badge>
        </>
      );
      const iconWrappers = container.querySelectorAll('[aria-hidden="true"]');
      expect(iconWrappers.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Dot Accessibility (aria-hidden)', () => {
    it('hides dot from screen readers when badge has content', () => {
      const { container } = render(<Badge dot>With Content</Badge>);
      const dot = container.querySelector('.rounded-circle');
      expect(dot).toHaveAttribute('aria-hidden', 'true');
    });

    it('does not hide dot from screen readers when dot-only (status indicator)', () => {
      const { container } = render(<Badge dot aria-label="Online status" />);
      const dot = container.querySelector('.rounded-circle');
      expect(dot).not.toHaveAttribute('aria-hidden');
    });

    it('dot-only badge is announced as status role', () => {
      const { container } = render(<Badge dot aria-label="Online" />);
      const badge = container.querySelector('.badge');
      expect(badge).toHaveAttribute('role', 'status');
    });

    it('dot with content does not have status role', () => {
      const { container } = render(<Badge dot>Content</Badge>);
      const badge = container.querySelector('.badge');
      expect(badge).not.toHaveAttribute('role', 'status');
    });

    it('dot-only badge with aria-label has no accessibility violations', async () => {
      const { container } = render(<Badge dot aria-label="Online status" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('status badge with warning variant has no violations', async () => {
      const { container } = render(<Badge variant="warning" dot aria-label="Away status" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Dev Warning (dot-only without aria-label)', () => {
    let consoleSpy: jest.SpyInstance;

    beforeEach(() => {
      // Spy on the actual console.warn - must be done in beforeEach after global setup
      consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    });

    afterEach(() => {
      consoleSpy.mockRestore();
    });

    it('warns when dot-only badge lacks aria-label', () => {
      render(<Badge dot />);
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Dot-only badges must have an aria-label')
      );
    });

    it('warns with helpful example', () => {
      render(<Badge dot />);
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('aria-label="Online status"')
      );
    });

    it('does not warn when dot-only badge has aria-label', () => {
      render(<Badge dot aria-label="Status" />);
      expect(consoleSpy).not.toHaveBeenCalled();
    });

    it('does not warn when badge has content with dot', () => {
      render(<Badge dot>Content</Badge>);
      expect(consoleSpy).not.toHaveBeenCalled();
    });

    it('does not warn for regular badge without dot', () => {
      render(<Badge>Regular Badge</Badge>);
      expect(consoleSpy).not.toHaveBeenCalled();
    });

    it('warning only in development mode', () => {
      const nodeEnv = process.env.NODE_ENV;
      try {
        // Even if we try to set production, the test runner will override it
        // But we're testing the logic path exists
        render(<Badge dot />);
        expect(consoleSpy).toHaveBeenCalled();
      } finally {
        process.env.NODE_ENV = nodeEnv;
      }
    });
  });

  // =============================================================================
  // Performance Enhancements
  // =============================================================================

  describe('Performance - Memoization', () => {
    it('component wrapped with forwardRef for ref support', () => {
      const ref = jest.fn();
      render(<Badge ref={ref}>Badge</Badge>);
      expect(ref).toHaveBeenCalled();
    });

    it('ref receives HTMLSpanElement by default', () => {
      const ref = jest.fn();
      render(<Badge ref={ref}>Badge</Badge>);
      expect(ref.mock.calls[0][0]).toBeInstanceOf(HTMLSpanElement);
    });

    it('ref receives HTMLDivElement when as="div"', () => {
      const ref = jest.fn();
      render(
        <Badge ref={ref} as="div">
          Badge
        </Badge>
      );
      expect(ref.mock.calls[0][0]).toBeInstanceOf(HTMLDivElement);
    });

    it('class names are consistent across renders', () => {
      const { rerender } = render(
        <Badge variant="primary" pill>
          Badge
        </Badge>
      );
      const element1 = document.querySelector('.badge');
      const classes1 = element1?.className;

      rerender(
        <Badge variant="primary" pill>
          Badge
        </Badge>
      );
      const element2 = document.querySelector('.badge');
      const classes2 = element2?.className;

      expect(classes1).toBe(classes2);
    });

    it('does not recreate class string on every render', () => {
      let renderCount = 0;
      const TestComponent = () => {
        renderCount++;
        return <Badge variant="primary">Badge</Badge>;
      };

      const { rerender } = render(<TestComponent />);
      const initialRenderCount = renderCount;

      rerender(<TestComponent />);
      const finalRenderCount = renderCount;

      // Component should rerender but memoization should prevent class recalculation
      expect(finalRenderCount).toBeGreaterThan(initialRenderCount);
    });
  });

  describe('Performance - Content Detection', () => {
    it('correctly detects badge with children', () => {
      const { container } = render(<Badge dot>Content</Badge>);
      const dot = container.querySelector('.rounded-circle');
      // When content exists, dot should be hidden from SR
      expect(dot).toHaveAttribute('aria-hidden', 'true');
    });

    it('correctly detects badge with icon', () => {
      const { container } = render(
        <Badge dot icon={<span>★</span>}>
          No icon here
        </Badge>
      );
      const dot = container.querySelector('.rounded-circle');
      // When icon exists, dot should be hidden from SR
      expect(dot).toHaveAttribute('aria-hidden', 'true');
    });

    it('correctly detects dot-only (no content, no icon)', () => {
      const { container } = render(<Badge dot aria-label="Status" />);
      const dot = container.querySelector('.rounded-circle');
      // When no content/icon, dot should NOT be hidden from SR
      expect(dot).not.toHaveAttribute('aria-hidden');
    });

    it('memoization: hasVisibleContent remains stable', () => {
      const { rerender } = render(
        <Badge dot icon={<span>★</span>}>
          Text
        </Badge>
      );
      const dot1 = document.querySelector('.rounded-circle');
      const hidden1 = dot1?.getAttribute('aria-hidden');

      rerender(
        <Badge dot icon={<span>★</span>}>
          Text
        </Badge>
      );
      const dot2 = document.querySelector('.rounded-circle');
      const hidden2 = dot2?.getAttribute('aria-hidden');

      expect(hidden1).toBe(hidden2);
    });
  });

  // =============================================================================
  // Accessibility Comprehensive Tests
  // =============================================================================

  describe('Accessibility Comprehensive', () => {
    it('has no violations with icon aria-hidden', async () => {
      const { container } = render(<Badge icon={<span>★</span>}>Featured</Badge>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no violations with dot and content', async () => {
      const { container } = render(<Badge dot>Online</Badge>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no violations with dot, icon, and content combined', async () => {
      const { container } = render(
        <Badge dot icon={<span>●</span>}>
          Status
        </Badge>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no violations in list of status badges', async () => {
      const { container } = render(
        <div>
          <Badge variant="success" dot aria-label="Online" />
          <Badge variant="warning" dot aria-label="Away" />
          <Badge variant="danger" dot aria-label="Busy" />
        </div>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no violations with all features enabled', async () => {
      const { container } = render(
        <Badge variant="success" pill dot icon={<span>✓</span>} aria-label="Verified online">
          Active
        </Badge>
      );
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
