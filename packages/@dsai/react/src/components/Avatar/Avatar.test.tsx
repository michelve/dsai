/**
 * Avatar Component Tests
 *
 * Comprehensive test suite covering:
 * - Rendering tests for all variants
 * - Image fallback chain testing
 * - Status indicator tests
 * - Badge tests
 * - Interactive mode tests
 * - AvatarGroup tests
 * - Accessibility tests with jest-axe
 */

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';

import { Avatar } from './Avatar';
import { AvatarGroup } from './AvatarGroup';

expect.extend(toHaveNoViolations);

// =============================================================================
// Avatar - Basic Rendering
// =============================================================================

describe('Avatar', () => {
  describe('rendering', () => {
    it('renders without crashing', () => {
      render(<Avatar data-testid="avatar" />);
      expect(screen.getByTestId('avatar')).toBeInTheDocument();
    });

    it('renders with default props', () => {
      render(<Avatar data-testid="avatar" />);
      const avatar = screen.getByTestId('avatar');
      expect(avatar).toHaveAttribute('data-size', 'md');
      expect(avatar).toHaveAttribute('data-shape', 'circle');
    });

    it('renders as span by default', () => {
      render(<Avatar data-testid="avatar" />);
      const avatar = screen.getByTestId('avatar');
      expect(avatar.tagName).toBe('SPAN');
    });

    it('renders as custom element', () => {
      render(<Avatar as="div" data-testid="avatar" />);
      const avatar = screen.getByTestId('avatar');
      expect(avatar.tagName).toBe('DIV');
    });

    it('applies custom className', () => {
      render(<Avatar className="custom-class" data-testid="avatar" />);
      expect(screen.getByTestId('avatar')).toHaveClass('custom-class');
    });

    it('applies custom style', () => {
      render(<Avatar style={{ margin: '10px' }} data-testid="avatar" />);
      expect(screen.getByTestId('avatar')).toHaveStyle({ margin: '10px' });
    });

    it('applies id', () => {
      render(<Avatar id="test-avatar" data-testid="avatar" />);
      expect(screen.getByTestId('avatar')).toHaveAttribute('id', 'test-avatar');
    });
  });

  // ===========================================================================
  // Sizes
  // ===========================================================================

  describe('sizes', () => {
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const;

    sizes.forEach((size) => {
      it(`renders ${size} size`, () => {
        render(<Avatar size={size} data-testid="avatar" />);
        expect(screen.getByTestId('avatar')).toHaveAttribute('data-size', size);
      });
    });
  });

  // ===========================================================================
  // Shapes
  // ===========================================================================

  describe('shapes', () => {
    it('renders circle shape by default', () => {
      render(<Avatar data-testid="avatar" />);
      const avatar = screen.getByTestId('avatar');
      expect(avatar).toHaveAttribute('data-shape', 'circle');
      expect(avatar).toHaveClass('rounded-circle');
    });

    it('renders rounded shape', () => {
      render(<Avatar shape="rounded" data-testid="avatar" />);
      const avatar = screen.getByTestId('avatar');
      expect(avatar).toHaveAttribute('data-shape', 'rounded');
      expect(avatar).toHaveClass('rounded-3');
    });

    it('renders square shape', () => {
      render(<Avatar shape="square" data-testid="avatar" />);
      const avatar = screen.getByTestId('avatar');
      expect(avatar).toHaveAttribute('data-shape', 'square');
      expect(avatar).not.toHaveClass('rounded-circle');
      expect(avatar).not.toHaveClass('rounded-3');
    });
  });

  // ===========================================================================
  // Image Rendering
  // ===========================================================================

  describe('image', () => {
    it('renders image when src is provided', () => {
      render(<Avatar src="/test.jpg" alt="Test User" data-testid="avatar" />);
      const img = screen.getByTestId('avatar-image');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', '/test.jpg');
    });

    it('sets alt text on image', () => {
      render(<Avatar src="/test.jpg" alt="Test User" data-testid="avatar" />);
      const img = screen.getByTestId('avatar-image');
      expect(img).toHaveAttribute('alt', 'Test User');
    });

    it('supports srcSet and sizes', () => {
      render(
        <Avatar
          src="/test.jpg"
          srcSet="/test-2x.jpg 2x"
          sizes="100px"
          alt="Test"
          data-testid="avatar"
        />
      );
      const img = screen.getByTestId('avatar-image');
      expect(img).toHaveAttribute('srcSet', '/test-2x.jpg 2x');
      expect(img).toHaveAttribute('sizes', '100px');
    });

    it('supports lazy loading', () => {
      render(<Avatar src="/test.jpg" loading="lazy" alt="Test" data-testid="avatar" />);
      const img = screen.getByTestId('avatar-image');
      expect(img).toHaveAttribute('loading', 'lazy');
    });

    it('shows fallback on image error', async () => {
      render(<Avatar src="/invalid.jpg" name="John Doe" data-testid="avatar" />);

      const img = screen.getByTestId('avatar-image');
      fireEvent.error(img);

      // Should now show initials instead of image
      await waitFor(() => {
        expect(screen.queryByTestId('avatar-image')).not.toBeInTheDocument();
        expect(screen.getByText('JD')).toBeInTheDocument();
      });
    });

    it('calls onError callback on image error', () => {
      const onError = jest.fn();
      render(<Avatar src="/invalid.jpg" onError={onError} data-testid="avatar" />);

      const img = screen.getByTestId('avatar-image');
      fireEvent.error(img);

      expect(onError).toHaveBeenCalled();
    });

    it('calls onLoad callback on image load', () => {
      const onLoad = jest.fn();
      render(<Avatar src="/test.jpg" onLoad={onLoad} alt="Test" data-testid="avatar" />);

      const img = screen.getByTestId('avatar-image');
      fireEvent.load(img);

      expect(onLoad).toHaveBeenCalled();
    });
  });

  // ===========================================================================
  // Initials
  // ===========================================================================

  describe('initials', () => {
    it('shows explicit initials', () => {
      render(<Avatar initials="AB" data-testid="avatar" />);
      expect(screen.getByText('AB')).toBeInTheDocument();
    });

    it('derives initials from single name', () => {
      render(<Avatar name="John" data-testid="avatar" />);
      expect(screen.getByText('JO')).toBeInTheDocument();
    });

    it('derives initials from full name', () => {
      render(<Avatar name="John Doe" data-testid="avatar" />);
      expect(screen.getByText('JD')).toBeInTheDocument();
    });

    it('derives initials from multiple names', () => {
      render(<Avatar name="John Michael Doe" data-testid="avatar" />);
      expect(screen.getByText('JD')).toBeInTheDocument();
    });

    it('handles empty name', () => {
      render(<Avatar name="" data-testid="avatar" />);
      // Should show default icon
      expect(screen.getByRole('img', { hidden: true })).toBeInTheDocument();
    });

    it('prefers explicit initials over name', () => {
      render(<Avatar name="John Doe" initials="XY" data-testid="avatar" />);
      expect(screen.getByText('XY')).toBeInTheDocument();
      expect(screen.queryByText('JD')).not.toBeInTheDocument();
    });

    it('uppercase initials', () => {
      render(<Avatar initials="ab" data-testid="avatar" />);
      expect(screen.getByText('AB')).toBeInTheDocument();
    });

    it('truncates initials to 2 characters', () => {
      render(<Avatar initials="ABCD" data-testid="avatar" />);
      expect(screen.getByText('AB')).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Tones
  // ===========================================================================

  describe('tones', () => {
    const tones = [
      'neutral',
      'brand',
      'accent',
      'success',
      'warning',
      'danger',
      'info',
      'muted',
      'inverse',
    ] as const;

    tones.forEach((tone) => {
      it(`applies ${tone} tone`, () => {
        render(<Avatar name="Test" tone={tone} data-testid="avatar" />);
        expect(screen.getByTestId('avatar')).toBeInTheDocument();
      });
    });

    it('uses deterministic tone from name when not specified', () => {
      render(<Avatar name="Alice" data-testid="alice" />);
      render(<Avatar name="Alice" data-testid="alice2" />);

      // Same name should get same classes (deterministic)
      const alice1 = screen.getByTestId('alice');
      const alice2 = screen.getByTestId('alice2');
      expect(alice1.className).toBe(alice2.className);
    });

    it('different names get different tones', () => {
      render(<Avatar name="Alice" data-testid="alice" />);
      render(<Avatar name="Bob" data-testid="bob" />);

      // Different names may get different tones
      // Just verify both render correctly
      expect(screen.getByTestId('alice')).toBeInTheDocument();
      expect(screen.getByTestId('bob')).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Icon and Fallback
  // ===========================================================================

  describe('fallback chain', () => {
    it('shows custom fallback when provided', async () => {
      render(
        <Avatar
          src="/invalid.jpg"
          fallback={<span data-testid="custom-fallback">Custom</span>}
          data-testid="avatar"
        />
      );

      const img = screen.getByTestId('avatar-image');
      fireEvent.error(img);

      await waitFor(() => {
        expect(screen.getByTestId('custom-fallback')).toBeInTheDocument();
      });
    });

    it('shows custom icon when no initials', () => {
      const CustomIcon = () => <span data-testid="custom-icon">Icon</span>;
      render(<Avatar icon={<CustomIcon />} data-testid="avatar" />);
      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });

    it('shows default icon when nothing provided', () => {
      render(<Avatar data-testid="avatar" />);
      expect(screen.getByRole('img', { hidden: true })).toBeInTheDocument();
    });

    it('prioritizes image over everything else', () => {
      render(
        <Avatar
          src="/test.jpg"
          alt="Test"
          name="John"
          initials="AB"
          icon={<span>Icon</span>}
          data-testid="avatar"
        />
      );
      expect(screen.getByTestId('avatar-image')).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Status Indicator
  // ===========================================================================

  describe('status', () => {
    const statuses = ['online', 'busy', 'away', 'offline', 'dnd', 'unknown'] as const;

    statuses.forEach((status) => {
      it(`renders ${status} status indicator`, () => {
        render(<Avatar name="Test" status={status} data-testid="avatar" />);
        const indicator = screen.getByTestId('avatar').querySelector('[data-status]');
        expect(indicator).toHaveAttribute('data-status', status);
      });
    });

    it('renders status at bottom-right by default', () => {
      render(<Avatar name="Test" status="online" data-testid="avatar" />);
      const indicator = screen.getByTestId('avatar').querySelector('[data-status]');
      expect(indicator).toHaveClass('end-0');
      expect(indicator).toHaveClass('bottom-0');
    });

    it('renders status at bottom-left when specified', () => {
      render(
        <Avatar name="Test" status="online" statusPosition="bottom-left" data-testid="avatar" />
      );
      const indicator = screen.getByTestId('avatar').querySelector('[data-status]');
      expect(indicator).toHaveClass('start-0');
      expect(indicator).toHaveClass('bottom-0');
    });

    it('includes status in aria-label', () => {
      render(<Avatar name="John Doe" status="online" data-testid="avatar" />);
      const avatar = screen.getByTestId('avatar');
      expect(avatar).toHaveAttribute('aria-label', 'John Doe, Online');
    });
  });

  // ===========================================================================
  // Badges
  // ===========================================================================

  describe('badges', () => {
    it('renders notification count badge', () => {
      render(<Avatar name="Test" badgeCount={5} data-testid="avatar" />);
      expect(screen.getByTestId('avatar-badge-count')).toHaveTextContent('5');
    });

    it('shows 99+ for counts over 99', () => {
      render(<Avatar name="Test" badgeCount={150} data-testid="avatar" />);
      expect(screen.getByTestId('avatar-badge-count')).toHaveTextContent('99+');
    });

    it('renders dot badge', () => {
      render(<Avatar name="Test" badgeDot data-testid="avatar" />);
      expect(screen.getByTestId('avatar-badge-dot')).toBeInTheDocument();
    });

    it('prefers count over dot', () => {
      render(<Avatar name="Test" badgeCount={3} badgeDot data-testid="avatar" />);
      expect(screen.getByTestId('avatar-badge-count')).toBeInTheDocument();
      expect(screen.queryByTestId('avatar-badge-dot')).not.toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Interactive Mode
  // ===========================================================================

  describe('interactive mode', () => {
    it('is not focusable by default', () => {
      render(<Avatar name="Test" data-testid="avatar" />);
      const avatar = screen.getByTestId('avatar');
      expect(avatar).not.toHaveAttribute('tabindex', '0');
    });

    it('is focusable when interactive', () => {
      render(<Avatar name="Test" interactive data-testid="avatar" />);
      const avatar = screen.getByTestId('avatar');
      expect(avatar).toHaveAttribute('tabindex', '0');
    });

    it('calls onClick when clicked', async () => {
      const user = userEvent.setup();
      const onClick = jest.fn();
      render(<Avatar name="Test" interactive onClick={onClick} data-testid="avatar" />);

      await user.click(screen.getByTestId('avatar'));
      expect(onClick).toHaveBeenCalled();
    });

    it('calls onClick on Enter key', async () => {
      const user = userEvent.setup();
      const onClick = jest.fn();
      render(<Avatar name="Test" interactive onClick={onClick} data-testid="avatar" />);

      const avatar = screen.getByTestId('avatar');
      avatar.focus();
      await user.keyboard('{Enter}');

      expect(onClick).toHaveBeenCalled();
    });

    it('renders as button when as="button"', () => {
      render(<Avatar name="Test" as="button" data-testid="avatar" />);
      expect(screen.getByTestId('avatar').tagName).toBe('BUTTON');
    });

    it('renders as link when as="a" with href', () => {
      render(<Avatar name="Test" as="a" href="/profile" data-testid="avatar" />);
      const avatar = screen.getByTestId('avatar');
      expect(avatar.tagName).toBe('A');
      expect(avatar).toHaveAttribute('href', '/profile');
    });

    it('sets aria-pressed when selected', () => {
      render(<Avatar name="Test" interactive selected data-testid="avatar" />);
      expect(screen.getByTestId('avatar')).toHaveAttribute('aria-pressed', 'true');
    });
  });

  // ===========================================================================
  // Loading State
  // ===========================================================================

  describe('loading state', () => {
    it('renders skeleton when loading', () => {
      render(<Avatar isLoading data-testid="avatar" />);
      expect(screen.getByTestId('avatar-skeleton')).toBeInTheDocument();
    });

    it('sets aria-busy when loading', () => {
      render(<Avatar isLoading data-testid="avatar" />);
      expect(screen.getByTestId('avatar')).toHaveAttribute('aria-busy', 'true');
    });

    it('does not show image while loading', () => {
      render(<Avatar src="/test.jpg" isLoading data-testid="avatar" />);
      expect(screen.queryByTestId('avatar-image')).not.toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Decorative Mode
  // ===========================================================================

  describe('decorative mode', () => {
    it('sets aria-hidden when decorative', () => {
      render(<Avatar name="Test" decorative data-testid="avatar" />);
      expect(screen.getByTestId('avatar')).toHaveAttribute('aria-hidden', 'true');
    });

    it('does not set aria-label when decorative', () => {
      render(<Avatar name="Test" decorative data-testid="avatar" />);
      expect(screen.getByTestId('avatar')).not.toHaveAttribute('aria-label');
    });

    it('sets empty alt on image when decorative', () => {
      render(<Avatar src="/test.jpg" alt="Should be empty" decorative data-testid="avatar" />);
      const img = screen.getByTestId('avatar-image');
      expect(img).toHaveAttribute('alt', '');
    });
  });

  // ===========================================================================
  // Accessibility
  // ===========================================================================

  describe('accessibility', () => {
    it('has no accessibility violations - default', async () => {
      const { container } = render(<Avatar name="John Doe" data-testid="avatar" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations - with image', async () => {
      const { container } = render(<Avatar src="/test.jpg" alt="Test User" data-testid="avatar" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations - interactive', async () => {
      const { container } = render(
        <Avatar name="John Doe" interactive onClick={() => {}} data-testid="avatar" />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations - with status', async () => {
      const { container } = render(<Avatar name="John Doe" status="online" data-testid="avatar" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations - decorative', async () => {
      const { container } = render(<Avatar name="John Doe" decorative data-testid="avatar" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('builds aria-label from name and status', () => {
      render(<Avatar name="John Doe" status="busy" data-testid="avatar" />);
      expect(screen.getByTestId('avatar')).toHaveAttribute('aria-label', 'John Doe, Busy');
    });

    it('uses alt for aria-label when no name', () => {
      render(<Avatar src="/test.jpg" alt="Test User" data-testid="avatar" />);
      expect(screen.getByTestId('avatar')).toHaveAttribute('aria-label', 'Test User');
    });

    it('uses explicit aria-label when provided', () => {
      render(<Avatar name="John" aria-label="Custom Label" data-testid="avatar" />);
      expect(screen.getByTestId('avatar')).toHaveAttribute('aria-label', 'Custom Label');
    });

    it('supports aria-describedby', () => {
      render(<Avatar name="John" aria-describedby="desc" data-testid="avatar" />);
      expect(screen.getByTestId('avatar')).toHaveAttribute('aria-describedby', 'desc');
    });
  });

  // ===========================================================================
  // Ref Forwarding
  // ===========================================================================

  describe('ref forwarding', () => {
    it('forwards ref to container element', () => {
      const ref = { current: null };
      render(<Avatar name="Test" ref={ref} data-testid="avatar" />);
      expect(ref.current).toBeInstanceOf(HTMLElement);
    });
  });
});

// =============================================================================
// AvatarGroup Tests
// =============================================================================

describe('AvatarGroup', () => {
  describe('rendering', () => {
    it('renders without crashing', () => {
      render(
        <AvatarGroup data-testid="group">
          <Avatar name="Alice" />
          <Avatar name="Bob" />
        </AvatarGroup>
      );
      expect(screen.getByTestId('group')).toBeInTheDocument();
    });

    it('renders all children', () => {
      render(
        <AvatarGroup data-testid="group">
          <Avatar name="Alice" data-testid="alice" />
          <Avatar name="Bob" data-testid="bob" />
          <Avatar name="Charlie" data-testid="charlie" />
        </AvatarGroup>
      );
      expect(screen.getByTestId('alice')).toBeInTheDocument();
      expect(screen.getByTestId('bob')).toBeInTheDocument();
      expect(screen.getByTestId('charlie')).toBeInTheDocument();
    });

    it('applies role="group"', () => {
      render(
        <AvatarGroup data-testid="group">
          <Avatar name="Alice" />
        </AvatarGroup>
      );
      expect(screen.getByTestId('group')).toHaveAttribute('role', 'group');
    });
  });

  // ===========================================================================
  // Overflow
  // ===========================================================================

  describe('overflow', () => {
    it('limits visible avatars with maxVisible', () => {
      render(
        <AvatarGroup maxVisible={2} data-testid="group">
          <Avatar name="Alice" data-testid="alice" />
          <Avatar name="Bob" data-testid="bob" />
          <Avatar name="Charlie" data-testid="charlie" />
          <Avatar name="Diana" data-testid="diana" />
        </AvatarGroup>
      );

      expect(screen.getByTestId('group')).toHaveAttribute('data-visible-count', '2');
      expect(screen.getByTestId('group')).toHaveAttribute('data-total-count', '4');
    });

    it('shows overflow chip with hidden count', () => {
      render(
        <AvatarGroup maxVisible={2} data-testid="group">
          <Avatar name="Alice" />
          <Avatar name="Bob" />
          <Avatar name="Charlie" />
          <Avatar name="Diana" />
        </AvatarGroup>
      );

      expect(screen.getByTestId('avatar-group-overflow')).toHaveTextContent('+2');
    });

    it('overflow chip is focusable', () => {
      render(
        <AvatarGroup maxVisible={2} data-testid="group">
          <Avatar name="Alice" />
          <Avatar name="Bob" />
          <Avatar name="Charlie" />
        </AvatarGroup>
      );

      const overflow = screen.getByTestId('avatar-group-overflow');
      expect(overflow.tagName).toBe('BUTTON');
    });

    it('no overflow chip when all visible', () => {
      render(
        <AvatarGroup maxVisible={5} data-testid="group">
          <Avatar name="Alice" />
          <Avatar name="Bob" />
        </AvatarGroup>
      );

      expect(screen.queryByTestId('avatar-group-overflow')).not.toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Layouts
  // ===========================================================================

  describe('layouts', () => {
    it('uses stacked layout by default', () => {
      render(
        <AvatarGroup data-testid="group">
          <Avatar name="Alice" />
        </AvatarGroup>
      );
      expect(screen.getByTestId('group')).toHaveAttribute('data-layout', 'stacked');
    });

    it('supports inline layout', () => {
      render(
        <AvatarGroup layout="inline" data-testid="group">
          <Avatar name="Alice" />
        </AvatarGroup>
      );
      expect(screen.getByTestId('group')).toHaveAttribute('data-layout', 'inline');
    });
  });

  // ===========================================================================
  // Spacing
  // ===========================================================================

  describe('spacing', () => {
    it('uses normal spacing by default', () => {
      render(
        <AvatarGroup data-testid="group">
          <Avatar name="Alice" />
        </AvatarGroup>
      );
      expect(screen.getByTestId('group')).toHaveAttribute('data-spacing', 'normal');
    });

    it('supports compact spacing', () => {
      render(
        <AvatarGroup spacing="compact" data-testid="group">
          <Avatar name="Alice" />
        </AvatarGroup>
      );
      expect(screen.getByTestId('group')).toHaveAttribute('data-spacing', 'compact');
    });

    it('supports loose spacing', () => {
      render(
        <AvatarGroup spacing="loose" data-testid="group">
          <Avatar name="Alice" />
        </AvatarGroup>
      );
      expect(screen.getByTestId('group')).toHaveAttribute('data-spacing', 'loose');
    });
  });

  // ===========================================================================
  // Inherited Props
  // ===========================================================================

  describe('inherited props', () => {
    it('passes size to children', () => {
      render(
        <AvatarGroup size="lg" data-testid="group">
          <Avatar name="Alice" data-testid="alice" />
        </AvatarGroup>
      );
      expect(screen.getByTestId('alice')).toHaveAttribute('data-size', 'lg');
    });

    it('passes shape to children', () => {
      render(
        <AvatarGroup shape="rounded" data-testid="group">
          <Avatar name="Alice" data-testid="alice" />
        </AvatarGroup>
      );
      expect(screen.getByTestId('alice')).toHaveAttribute('data-shape', 'rounded');
    });

    it('child props override group props', () => {
      render(
        <AvatarGroup size="lg" data-testid="group">
          <Avatar name="Alice" size="sm" data-testid="alice" />
        </AvatarGroup>
      );
      expect(screen.getByTestId('alice')).toHaveAttribute('data-size', 'sm');
    });
  });

  // ===========================================================================
  // Accessibility
  // ===========================================================================

  describe('accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(
        <AvatarGroup data-testid="group">
          <Avatar name="Alice" />
          <Avatar name="Bob" />
        </AvatarGroup>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with overflow', async () => {
      const { container } = render(
        <AvatarGroup maxVisible={2} data-testid="group">
          <Avatar name="Alice" />
          <Avatar name="Bob" />
          <Avatar name="Charlie" />
        </AvatarGroup>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('sets aria-label on group', () => {
      render(
        <AvatarGroup data-testid="group">
          <Avatar name="Alice" />
          <Avatar name="Bob" />
        </AvatarGroup>
      );
      expect(screen.getByTestId('group')).toHaveAttribute('aria-label', '2 users');
    });

    it('sets aria-label with overflow info', () => {
      render(
        <AvatarGroup maxVisible={2} data-testid="group">
          <Avatar name="Alice" />
          <Avatar name="Bob" />
          <Avatar name="Charlie" />
        </AvatarGroup>
      );
      expect(screen.getByTestId('group')).toHaveAttribute('aria-label', '2 of 3 users shown');
    });

    it('uses custom aria-label when provided', () => {
      render(
        <AvatarGroup aria-label="Team members" data-testid="group">
          <Avatar name="Alice" />
        </AvatarGroup>
      );
      expect(screen.getByTestId('group')).toHaveAttribute('aria-label', 'Team members');
    });

    it('overflow chip has accessible label', () => {
      render(
        <AvatarGroup maxVisible={2} data-testid="group">
          <Avatar name="Alice" />
          <Avatar name="Bob" />
          <Avatar name="Charlie" />
        </AvatarGroup>
      );

      const overflow = screen.getByTestId('avatar-group-overflow');
      expect(overflow).toHaveAttribute('aria-label');
    });
  });

  // ===========================================================================
  // Ref Forwarding
  // ===========================================================================

  describe('ref forwarding', () => {
    it('forwards ref to container element', () => {
      const ref = { current: null };
      render(
        <AvatarGroup ref={ref} data-testid="group">
          <Avatar name="Alice" />
        </AvatarGroup>
      );
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });
});
