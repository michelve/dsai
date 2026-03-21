import { randomUUID } from 'node:crypto';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';

import { Badge } from './index';

import type { BadgeProps } from './Badge.types';

expect.extend(toHaveNoViolations);

describe('Badge', () => {
  // ===========================================================================
  // Rendering
  // ===========================================================================

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

  // ===========================================================================
  // Variants
  // ===========================================================================

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

  // ===========================================================================
  // Size
  // ===========================================================================

  describe('Size', () => {
    it('renders default (md) size with no size class', () => {
      const { container } = render(<Badge>Md</Badge>);
      const badge = container.querySelector('.badge');
      expect(badge).not.toHaveClass('dsai-badge-sm');
      expect(badge).not.toHaveClass('dsai-badge-lg');
    });

    it('renders sm size with dsai-badge-sm class and smaller font', () => {
      const { container } = render(<Badge size="sm">Small</Badge>);
      const badge = container.querySelector('.badge');
      expect(badge).toHaveClass('dsai-badge-sm');
      expect(badge).toHaveStyle({ fontSize: '0.65em' });
    });

    it('renders lg size with dsai-badge-lg class and larger font', () => {
      const { container } = render(<Badge size="lg">Large</Badge>);
      const badge = container.querySelector('.badge');
      expect(badge).toHaveClass('dsai-badge-lg');
      expect(badge).toHaveStyle({ fontSize: '0.85em' });
    });
  });

  // ===========================================================================
  // Appearance
  // ===========================================================================

  describe('Appearance', () => {
    it('defaults to solid appearance with text-bg-* class', () => {
      render(<Badge variant="primary">Solid</Badge>);
      expect(screen.getByText('Solid')).toHaveClass('text-bg-primary');
    });

    it('renders outline appearance with border and text color', () => {
      render(
        <Badge variant="success" appearance="outline">
          Outline
        </Badge>
      );
      const badge = screen.getByText('Outline');
      expect(badge).toHaveClass('border');
      expect(badge).toHaveClass('border-success');
      expect(badge).toHaveClass('text-success');
      expect(badge).toHaveClass('bg-transparent');
      expect(badge).not.toHaveClass('text-bg-success');
    });

    it('renders subtle appearance with subtle bg and emphasis text', () => {
      render(
        <Badge variant="danger" appearance="subtle">
          Subtle
        </Badge>
      );
      const badge = screen.getByText('Subtle');
      expect(badge).toHaveClass('bg-danger-subtle');
      expect(badge).toHaveClass('text-danger-emphasis');
      expect(badge).not.toHaveClass('text-bg-danger');
    });
  });

  // ===========================================================================
  // Pill Shape
  // ===========================================================================

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

  // ===========================================================================
  // Dot Indicator
  // ===========================================================================

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

  // ===========================================================================
  // Icon Support
  // ===========================================================================

  describe('Icon Support', () => {
    it('renders icon when provided', () => {
      render(<Badge icon={<span data-testid="icon">★</span>}>With Icon</Badge>);
      expect(screen.getByTestId('icon')).toBeInTheDocument();
    });

    it('renders icon before text by default (iconPosition=start)', () => {
      const { container } = render(
        <Badge icon={<span data-testid="icon">★</span>}>Text</Badge>
      );
      const badge = container.querySelector('.badge');
      const children = Array.from(badge?.childNodes || []);
      const iconWrapper = children.find(
        (child) => child instanceof HTMLElement && child.querySelector('[data-testid="icon"]')
      );
      const textNode = children.find(
        (child) => child instanceof HTMLElement && child.textContent === 'Text'
      );
      const iconIndex = children.indexOf(iconWrapper as ChildNode);
      const textIndex = children.indexOf(textNode as ChildNode);
      expect(iconIndex).toBeLessThan(textIndex);
    });

    it('renders icon after text when iconPosition=end', () => {
      const { container } = render(
        <Badge icon={<span data-testid="icon">★</span>} iconPosition="end">
          Text
        </Badge>
      );
      const badge = container.querySelector('.badge');
      const children = Array.from(badge?.childNodes || []);
      const textNode = children.find(
        (child) => child instanceof HTMLElement && child.textContent === 'Text'
      );
      const iconWrapper = children.find(
        (child) => child instanceof HTMLElement && child.querySelector('[data-testid="icon"]')
      );
      const textIndex = children.indexOf(textNode as ChildNode);
      const iconIndex = children.indexOf(iconWrapper as ChildNode);
      expect(textIndex).toBeLessThan(iconIndex);
    });
  });

  // ===========================================================================
  // Dismissible
  // ===========================================================================

  describe('Dismissible', () => {
    it('renders dismiss button when onDismiss is provided', () => {
      render(<Badge onDismiss={jest.fn()}>Tag</Badge>);
      expect(screen.getByRole('button', { name: 'Remove' })).toBeInTheDocument();
    });

    it('calls onDismiss when dismiss button is clicked', async () => {
      const user = userEvent.setup();
      const onDismiss = jest.fn();
      render(<Badge onDismiss={onDismiss}>Tag</Badge>);
      await user.click(screen.getByRole('button', { name: 'Remove' }));
      expect(onDismiss).toHaveBeenCalledTimes(1);
    });

    it('uses custom dismissLabel', () => {
      render(
        <Badge onDismiss={jest.fn()} dismissLabel="Delete tag">
          Tag
        </Badge>
      );
      expect(screen.getByRole('button', { name: 'Delete tag' })).toBeInTheDocument();
    });

    it('dismiss button is keyboard accessible', async () => {
      const user = userEvent.setup();
      const onDismiss = jest.fn();
      render(<Badge onDismiss={onDismiss}>Tag</Badge>);
      const btn = screen.getByRole('button', { name: 'Remove' });
      btn.focus();
      await user.keyboard('{Enter}');
      expect(onDismiss).toHaveBeenCalledTimes(1);
    });

    it('does not render dismiss button without onDismiss', () => {
      render(<Badge>Tag</Badge>);
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Max Count
  // ===========================================================================

  describe('Max Count', () => {
    it('truncates numeric children exceeding max', () => {
      render(<Badge max={99}>{150}</Badge>);
      expect(screen.getByText('99+')).toBeInTheDocument();
    });

    it('does not truncate when children is at or below max', () => {
      render(<Badge max={99}>{50}</Badge>);
      expect(screen.getByText('50')).toBeInTheDocument();
    });

    it('displays exact value when equal to max', () => {
      render(<Badge max={99}>{99}</Badge>);
      expect(screen.getByText('99')).toBeInTheDocument();
    });

    it('does not affect string children', () => {
      render(<Badge max={99}>New</Badge>);
      expect(screen.getByText('New')).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Visibility (invisible / showZero)
  // ===========================================================================

  describe('Visibility', () => {
    it('applies invisible styles when invisible=true', () => {
      const { container } = render(<Badge invisible>Hidden</Badge>);
      const badge = container.querySelector('.badge');
      expect(badge).toHaveClass('dsai-badge-invisible');
      expect(badge).toHaveStyle({ opacity: 0, pointerEvents: 'none' });
    });

    it('is visible by default', () => {
      const { container } = render(<Badge>Visible</Badge>);
      const badge = container.querySelector('.badge');
      expect(badge).not.toHaveClass('dsai-badge-invisible');
    });

    it('renders nothing when showZero=false and children is 0', () => {
      const { container } = render(<Badge showZero={false}>{0}</Badge>);
      expect(container.querySelector('.badge')).not.toBeInTheDocument();
    });

    it('renders nothing when showZero=false and children is string "0"', () => {
      const { container } = render(<Badge showZero={false}>0</Badge>);
      expect(container.querySelector('.badge')).not.toBeInTheDocument();
    });

    it('renders zero when showZero=true (default)', () => {
      render(<Badge>{0}</Badge>);
      expect(screen.getByText('0')).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Animation
  // ===========================================================================

  describe('Animation', () => {
    it('adds dsai-badge-animated class when animated=true', () => {
      const { container } = render(<Badge animated>Anim</Badge>);
      expect(container.querySelector('.badge')).toHaveClass('dsai-badge-animated');
    });

    it('does not add animation class by default', () => {
      const { container } = render(<Badge>Static</Badge>);
      expect(container.querySelector('.badge')).not.toHaveClass('dsai-badge-animated');
    });
  });

  // ===========================================================================
  // Custom Styling
  // ===========================================================================

  describe('Custom Styling', () => {
    it('accepts custom className', () => {
      render(<Badge className="custom-class">Custom</Badge>);
      const badge = screen.getByText('Custom');
      expect(badge).toHaveClass('custom-class');
      expect(badge).toHaveClass('badge');
    });

    it('accepts inline styles', () => {
      render(<Badge style={{ marginLeft: '10px' }}>Styled</Badge>);
      expect(screen.getByText('Styled')).toHaveStyle({ marginLeft: '10px' });
    });

    it('merges size styles with custom styles', () => {
      render(<Badge size="lg" style={{ color: 'red' }}>Merged</Badge>);
      const badge = screen.getByText('Merged');
      expect(badge).toHaveStyle({ fontSize: '0.85em' });
      expect(badge).toHaveStyle({ color: 'rgb(255, 0, 0)' });
    });
  });

  // ===========================================================================
  // HTML Attributes
  // ===========================================================================

  describe('HTML Attributes', () => {
    it('accepts id attribute', () => {
      const testId = `test-badge-${randomUUID()}`;
      render(<Badge id={testId}>Badge</Badge>);
      expect(screen.getByText('Badge')).toHaveAttribute('id', testId);
    });

    it('accepts aria-label', () => {
      render(<Badge aria-label="New notifications">3</Badge>);
      expect(screen.getByText('3')).toHaveAttribute('aria-label', 'New notifications');
    });
  });

  // ===========================================================================
  // Accessibility (WCAG 2.2 AA)
  // ===========================================================================

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

    it('has no violations with dismissible badge', async () => {
      const { container } = render(<Badge onDismiss={jest.fn()}>Tag</Badge>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no violations with outline appearance', async () => {
      const { container } = render(
        <Badge variant="primary" appearance="outline">
          Outline
        </Badge>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no violations with subtle appearance', async () => {
      const { container } = render(
        <Badge variant="success" appearance="subtle">
          Subtle
        </Badge>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  // ===========================================================================
  // Icon Accessibility (aria-hidden)
  // ===========================================================================

  describe('Icon Accessibility (aria-hidden)', () => {
    it('hides icon from screen readers with aria-hidden="true"', () => {
      const { container } = render(
        <Badge icon={<span data-testid="icon">★</span>}>Text</Badge>
      );
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

  // ===========================================================================
  // Dot Accessibility (aria-hidden)
  // ===========================================================================

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
      const { container } = render(
        <Badge variant="warning" dot aria-label="Away status" />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  // ===========================================================================
  // Dev Warning (dot-only without aria-label)
  // ===========================================================================

  describe('Dev Warning (dot-only without aria-label)', () => {
    let consoleSpy: jest.SpyInstance;

    beforeEach(() => {
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
  });

  // ===========================================================================
  // Performance - Memoization
  // ===========================================================================

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
  });

  // ===========================================================================
  // Performance - Content Detection
  // ===========================================================================

  describe('Performance - Content Detection', () => {
    it('correctly detects badge with children', () => {
      const { container } = render(<Badge dot>Content</Badge>);
      const dot = container.querySelector('.rounded-circle');
      expect(dot).toHaveAttribute('aria-hidden', 'true');
    });

    it('correctly detects badge with icon', () => {
      const { container } = render(
        <Badge dot icon={<span>★</span>}>
          Text
        </Badge>
      );
      const dot = container.querySelector('.rounded-circle');
      expect(dot).toHaveAttribute('aria-hidden', 'true');
    });

    it('correctly detects dot-only (no content, no icon)', () => {
      const { container } = render(<Badge dot aria-label="Status" />);
      const dot = container.querySelector('.rounded-circle');
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

  // ===========================================================================
  // Accessibility Comprehensive
  // ===========================================================================

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

    it('has no violations with all features combined', async () => {
      const { container } = render(
        <Badge
          variant="success"
          pill
          dot
          icon={<span>✓</span>}
          aria-label="Verified online"
          size="lg"
          appearance="outline"
        >
          Active
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
  });

  // ===========================================================================
  // Display Name
  // ===========================================================================

  describe('Display Name', () => {
    it('has correct displayName', () => {
      expect(Badge.displayName).toBe('Badge');
    });
  });

  // ===========================================================================
  // Badge.Wrapper
  // ===========================================================================

  describe('Badge.Wrapper', () => {
    it('renders wrapper with position-relative', () => {
      const { container } = render(
        <Badge.Wrapper>
          <span>Icon</span>
          <Badge>4</Badge>
        </Badge.Wrapper>
      );
      expect(container.querySelector('.dsai-badge-wrapper')).toHaveClass('position-relative');
    });

    it('renders anchor and badge children', () => {
      render(
        <Badge.Wrapper>
          <span data-testid="anchor">Mail</span>
          <Badge data-testid="overlay">3</Badge>
        </Badge.Wrapper>
      );
      expect(screen.getByTestId('anchor')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('positions badge absolutely over anchor', () => {
      const { container } = render(
        <Badge.Wrapper>
          <span>Anchor</span>
          <Badge>5</Badge>
        </Badge.Wrapper>
      );
      const wrapperBadge = container.querySelector('.dsai-badge-wrapper-badge');
      expect(wrapperBadge).toHaveStyle({ position: 'absolute' });
    });

    it('defaults to top-end placement', () => {
      const { container } = render(
        <Badge.Wrapper>
          <span>Anchor</span>
          <Badge>5</Badge>
        </Badge.Wrapper>
      );
      const wrapper = container.querySelector('.dsai-badge-wrapper');
      expect(wrapper).toHaveAttribute('data-placement', 'top-end');
    });

    it('accepts placement prop', () => {
      const { container } = render(
        <Badge.Wrapper placement="bottom-start">
          <span>Anchor</span>
          <Badge>5</Badge>
        </Badge.Wrapper>
      );
      const wrapper = container.querySelector('.dsai-badge-wrapper');
      expect(wrapper).toHaveAttribute('data-placement', 'bottom-start');
    });

    it('accepts overlap prop', () => {
      const { container } = render(
        <Badge.Wrapper overlap="circular">
          <span>Anchor</span>
          <Badge>5</Badge>
        </Badge.Wrapper>
      );
      const wrapper = container.querySelector('.dsai-badge-wrapper');
      expect(wrapper).toHaveAttribute('data-overlap', 'circular');
    });

    it('forwards ref', () => {
      const ref = jest.fn();
      render(
        <Badge.Wrapper ref={ref}>
          <span>Anchor</span>
          <Badge>5</Badge>
        </Badge.Wrapper>
      );
      expect(ref).toHaveBeenCalled();
      expect(ref.mock.calls[0][0]).toBeInstanceOf(HTMLDivElement);
    });

    it('accepts custom className', () => {
      const { container } = render(
        <Badge.Wrapper className="custom-wrapper">
          <span>Anchor</span>
          <Badge>5</Badge>
        </Badge.Wrapper>
      );
      expect(container.querySelector('.dsai-badge-wrapper')).toHaveClass('custom-wrapper');
    });

    it('has no accessibility violations', async () => {
      const { container } = render(
        <Badge.Wrapper>
          <span>Mail</span>
          <Badge variant="danger" pill aria-label="3 unread messages">
            3
          </Badge>
        </Badge.Wrapper>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has correct displayName', () => {
      expect(Badge.Wrapper.displayName).toBe('BadgeWrapper');
    });
  });
});
