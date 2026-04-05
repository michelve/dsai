import {
  Badge,
  Button,
  CheckCircleFillIcon,
  CheckIcon,
  ExclamationTriangleFillIcon,
  Heading,
  InfoCircleFillIcon,
  StarFillIcon,
  XLgIcon,
} from '@dsai-io/react';
import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';
import type { JSX } from 'react';

/**
 * Badge component for displaying labels, status indicators, and counts.
 * Built with Bootstrap 5 design tokens and full WCAG 2.2 AA compliance.
 *
 * Features:
 * - 8 color variants with Bootstrap 5 theming
 * - 3 sizes (sm, md, lg)
 * - 3 appearances (solid, outline, subtle)
 * - Pill shape for fully rounded badges
 * - Dot indicators for status (with automatic aria-hidden for accessibility)
 * - Icon support with start/end positioning
 * - Dismissible badges with onDismiss callback
 * - Max count truncation (e.g., 99+)
 * - Visibility control (invisible, showZero)
 * - Badge.Wrapper for overlay positioning on other elements
 * - Animation support (mount + content change pulse)
 * - Performance: React.memo wrapper + memoized internals
 * - Accessibility: aria-label required for dot-only badges (shows dev warning if missing)
 *
 * @see https://getbootstrap.com/docs/5.3/components/badge/
 */

// Helper: Icon badge example
/** Color token for secondary/muted text */
const BS_SECONDARY = 'var(--bs-secondary)';

const IconBadgeExample = (): JSX.Element => (
  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
    <Badge variant="primary" icon={<StarFillIcon size={12} />}>
      Featured
    </Badge>
    <Badge variant="success" icon={<CheckCircleFillIcon size={12} />}>
      Verified
    </Badge>
    <Badge variant="danger" icon={<ExclamationTriangleFillIcon size={12} />}>
      Alert
    </Badge>
    <Badge variant="info" icon={<InfoCircleFillIcon size={12} />}>
      Info
    </Badge>
  </div>
);

// Helper: Accessibility - Dot indicators
const DotAccessibilityExample = (): JSX.Element => (
  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
    <div>
      <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
        <CheckIcon size={14} className="text-success me-1" />
        Dot-only (requires aria-label):
      </p>
      <Badge variant="success" dot aria-label="Online status" />
    </div>
    <div>
      <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
        <CheckIcon size={14} className="text-success me-1" />
        Dot + content:
      </p>
      <Badge variant="success" dot>
        Online
      </Badge>
    </div>
    <div>
      <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>Status variants:</p>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Badge variant="success" dot aria-label="Available" />
        <Badge variant="warning" dot aria-label="Away" />
        <Badge variant="danger" dot aria-label="Busy" />
      </div>
    </div>
  </div>
);

// Helper: Accessibility - All features combined
const AccessibilityShowcaseExample = (): JSX.Element => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
    <div>
      <Heading level={4} style={{ marginBottom: '0.5rem' }}>
        Icon Accessibility
      </Heading>
      <p style={{ fontSize: '0.875rem', color: BS_SECONDARY, marginBottom: '0.5rem' }}>
        Icons are hidden from screen readers (aria-hidden=&quot;true&quot;), preventing redundant
        announcements:
      </p>
      <IconBadgeExample />
    </div>

    <div>
      <Heading level={4} style={{ marginBottom: '0.5rem' }}>
        Dot Indicator Accessibility
      </Heading>
      <p style={{ fontSize: '0.875rem', color: BS_SECONDARY, marginBottom: '0.5rem' }}>
        Dots are hidden when badge has content, but visible to screen readers when dot-only:
      </p>
      <DotAccessibilityExample />
    </div>

    <div>
      <Heading level={4} style={{ marginBottom: '0.5rem' }}>
        Dev Warning Example
      </Heading>
      <p style={{ fontSize: '0.875rem', color: BS_SECONDARY, marginBottom: '0.5rem' }}>
        Check browser console - dot-only without aria-label shows a helpful warning in development:
      </p>
      <Badge variant="danger" dot>
        This works because it has content
      </Badge>
    </div>
  </div>
);

// Helper: Performance story
const PerformanceShowcaseExample = (): JSX.Element => {
  const [count, setCount] = useState(0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <p style={{ fontSize: '0.875rem', color: BS_SECONDARY }}>
        Badges are wrapped with React.memo and internally memoized for maximum performance.
      </p>
      <div>
        <p style={{ marginBottom: '0.5rem' }}>
          Click to trigger parent re-render (badge stays optimized):
        </p>
        <Button variant="outline-primary" onClick={() => setCount(count + 1)}>
          Render Parent ({count} times)
        </Button>
        <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
          <Badge variant="primary">Optimized</Badge>
          <Badge variant="success" pill>
            Count: {count}
          </Badge>
          <Badge variant="info" dot aria-label="Active">
            Active
          </Badge>
        </div>
      </div>
    </div>
  );
};

const meta: Meta<typeof Badge> = {
  title: 'Components/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A Bootstrap 5 badge component for displaying labels, status indicators, and counts. ' +
          'Supports 8 color variants, 3 sizes, 3 appearances, pill shape, dot indicators, icons, ' +
          'dismissible badges, max count, visibility control, and Badge.Wrapper overlay. ' +
          'Fully accessible with WCAG 2.2 AA compliance and performance optimizations.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'],
      description: 'Badge color variant',
      table: {
        type: { summary: 'BadgeVariant' },
        defaultValue: { summary: 'primary' },
      },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Badge size',
      table: {
        type: { summary: 'BadgeSize' },
        defaultValue: { summary: 'md' },
      },
    },
    appearance: {
      control: 'select',
      options: ['solid', 'outline', 'subtle'],
      description: 'Visual style treatment',
      table: {
        type: { summary: 'BadgeAppearance' },
        defaultValue: { summary: 'solid' },
      },
    },
    pill: {
      control: 'boolean',
      description: 'Pill shape (fully rounded)',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    dot: {
      control: 'boolean',
      description: 'Show dot indicator (requires aria-label when dot-only)',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    iconPosition: {
      control: 'select',
      options: ['start', 'end'],
      description: 'Icon position relative to text',
      table: {
        type: { summary: "'start' | 'end'" },
        defaultValue: { summary: 'start' },
      },
    },
    max: {
      control: 'number',
      description: 'Maximum numeric value (shows "N+" when exceeded)',
      table: {
        type: { summary: 'number' },
      },
    },
    invisible: {
      control: 'boolean',
      description: 'Hide badge visually while preserving layout',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    showZero: {
      control: 'boolean',
      description: 'Whether to display when children is 0',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    animated: {
      control: 'boolean',
      description: 'Enable mount and content-change animations',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    children: {
      control: 'text',
      description: 'Badge content',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    'aria-label': {
      control: 'text',
      description: 'ARIA label (required for dot-only badges)',
      table: {
        type: { summary: 'string' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// =============================================================================
// Basic Variants
// =============================================================================

export const Primary: Story = {
  args: { variant: 'primary', children: 'Primary' },
};

export const Secondary: Story = {
  args: { variant: 'secondary', children: 'Secondary' },
};

export const Success: Story = {
  args: { variant: 'success', children: 'Success' },
};

export const Danger: Story = {
  args: { variant: 'danger', children: 'Danger' },
};

export const Warning: Story = {
  args: { variant: 'warning', children: 'Warning' },
};

export const Info: Story = {
  args: { variant: 'info', children: 'Info' },
};

export const Light: Story = {
  args: { variant: 'light', children: 'Light' },
  globals: { backgrounds: { value: 'dark' } },
};

export const Dark: Story = {
  args: { variant: 'dark', children: 'Dark' },
};

// =============================================================================
// Sizes
// =============================================================================

/** All three badge sizes */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
      <Badge size="sm">Small</Badge>
      <Badge size="md">Medium</Badge>
      <Badge size="lg">Large</Badge>
    </div>
  ),
};

// =============================================================================
// Appearances
// =============================================================================

/** Solid (default), outline, and subtle style treatments */
export const Appearances: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <Badge variant="primary" appearance="solid">Solid</Badge>
        <Badge variant="success" appearance="solid">Solid</Badge>
        <Badge variant="danger" appearance="solid">Solid</Badge>
      </div>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <Badge variant="primary" appearance="outline">Outline</Badge>
        <Badge variant="success" appearance="outline">Outline</Badge>
        <Badge variant="danger" appearance="outline">Outline</Badge>
      </div>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <Badge variant="primary" appearance="subtle">Subtle</Badge>
        <Badge variant="success" appearance="subtle">Subtle</Badge>
        <Badge variant="danger" appearance="subtle">Subtle</Badge>
      </div>
    </div>
  ),
};

// =============================================================================
// Pill Shape
// =============================================================================

export const Pill: Story = {
  args: { variant: 'primary', pill: true, children: 'Pill Badge' },
};

export const AllPillVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      <Badge variant="primary" pill>Primary</Badge>
      <Badge variant="secondary" pill>Secondary</Badge>
      <Badge variant="success" pill>Success</Badge>
      <Badge variant="danger" pill>Danger</Badge>
      <Badge variant="warning" pill>Warning</Badge>
      <Badge variant="info" pill>Info</Badge>
    </div>
  ),
};

// =============================================================================
// Dot Indicator
// =============================================================================

export const WithDot: Story = {
  args: { variant: 'success', dot: true, children: 'Online' },
};

export const DotOnly: Story = {
  args: { variant: 'success', dot: true, 'aria-label': 'Online status' },
};

export const StatusIndicators: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <Badge variant="success" dot>Online</Badge>
      <Badge variant="warning" dot>Away</Badge>
      <Badge variant="danger" dot>Busy</Badge>
      <Badge variant="secondary" dot>Offline</Badge>
    </div>
  ),
};

// =============================================================================
// Icon Support
// =============================================================================

export const WithIcon: Story = {
  args: {
    variant: 'primary',
    icon: <StarFillIcon size={12} />,
    children: 'Featured',
  },
};

export const IconExamples: Story = {
  render: () => <IconBadgeExample />,
};

/** Icon positioned at the end of the badge */
export const IconEnd: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      <Badge variant="primary" icon={<StarFillIcon size={12} />} iconPosition="start">
        Start
      </Badge>
      <Badge variant="success" icon={<CheckCircleFillIcon size={12} />} iconPosition="end">
        End
      </Badge>
    </div>
  ),
};

// =============================================================================
// Dismissible
// =============================================================================

/** Badges with dismiss buttons — great for tag/chip patterns */
export const Dismissible: Story = {
  render: function Render() {
    const DismissDemo = (): JSX.Element => {
      const [tags, setTags] = useState(['React', 'TypeScript', 'Bootstrap']);
      return (
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {tags.map((tag) => (
            <Badge
              key={tag}
              variant="primary"
              pill
              onDismiss={() => setTags((t) => t.filter((x) => x !== tag))}
            >
              {tag}
            </Badge>
          ))}
          {tags.length === 0 && (
            <Button variant="outline-secondary" size="sm" onClick={() => setTags(['React', 'TypeScript', 'Bootstrap'])}>
              Reset tags
            </Button>
          )}
        </div>
      );
    };
    return <DismissDemo />;
  },
};

// =============================================================================
// Max Count
// =============================================================================

/** Auto-truncated count when exceeding max */
export const MaxCount: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <Badge variant="danger" max={99}>{150}</Badge>
      <Badge variant="primary" max={99}>{50}</Badge>
      <Badge variant="info" max={9}>{10}</Badge>
    </div>
  ),
};

// =============================================================================
// Visibility
// =============================================================================

/** Invisible badge and showZero behavior */
export const Visibility: Story = {
  render: function Render() {
    const VisibilityDemo = (): JSX.Element => {
      const [count, setCount] = useState(0);
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Button variant="outline-primary" onClick={() => setCount((c) => c + 1)}>
              Add ({count})
            </Button>
            <Button variant="outline-secondary" onClick={() => setCount(0)}>
              Reset
            </Button>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span>showZero=true:</span>
            <Badge variant="danger">{count}</Badge>
            <span>showZero=false:</span>
            <Badge variant="danger" showZero={false}>{count}</Badge>
            <span>invisible when 0:</span>
            <Badge variant="danger" invisible={count === 0}>{count}</Badge>
          </div>
        </div>
      );
    };
    return <VisibilityDemo />;
  },
  parameters: { layout: 'padded' },
};

// =============================================================================
// Badge.Wrapper (Overlay)
// =============================================================================

/** Badge positioned as overlay on another element */
export const Wrapper: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
      <Badge.Wrapper>
        <Button variant="outline-primary">
          Inbox
        </Button>
        <Badge variant="danger" pill>4</Badge>
      </Badge.Wrapper>
      <Badge.Wrapper placement="bottom-end">
        <Button variant="outline-secondary">
          Tasks
        </Button>
        <Badge variant="warning" pill>!</Badge>
      </Badge.Wrapper>
      <Badge.Wrapper overlap="circular">
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            backgroundColor: 'var(--bs-gray-300)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          M
        </div>
        <Badge variant="success" dot aria-label="Online" />
      </Badge.Wrapper>
    </div>
  ),
  parameters: { layout: 'padded' },
};

// =============================================================================
// Animation
// =============================================================================

/** Animated badge with content change pulse */
export const Animated: Story = {
  render: function Render() {
    const AnimatedDemo = (): JSX.Element => {
      const [count, setCount] = useState(1);
      return (
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Button variant="outline-primary" onClick={() => setCount((c) => c + 1)}>
            Increment
          </Button>
          <Badge variant="danger" pill animated>
            {count}
          </Badge>
        </div>
      );
    };
    return <AnimatedDemo />;
  },
};

// =============================================================================
// Accessibility Features
// =============================================================================

export const AccessibilityShowcase: Story = {
  render: () => <AccessibilityShowcaseExample />,
  parameters: { layout: 'padded' },
};

export const ProperDotOnlyUsage: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem', fontWeight: 'var(--dsai-typography-font-weight-semi-bold)' }}>
          <CheckIcon size={14} className="text-success me-1" />
          Correct: Dot-only with aria-label
        </p>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Badge variant="success" dot aria-label="Online" />
          <code style={{ fontSize: '0.75rem', background: 'var(--bs-gray-100)', padding: '0.25rem 0.5rem', borderRadius: 'var(--dsai-border-radius-sm)' }}>
            &lt;Badge dot aria-label=&quot;Online&quot; /&gt;
          </code>
        </div>
      </div>
      <div>
        <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem', fontWeight: 'var(--dsai-typography-font-weight-semi-bold)' }}>
          <XLgIcon size={14} className="text-danger me-1" />
          Incorrect: Dot-only without aria-label
        </p>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Badge variant="danger" dot />
          <code style={{ fontSize: '0.75rem', background: 'var(--bs-warning-bg-subtle)', padding: '0.25rem 0.5rem', borderRadius: 'var(--dsai-border-radius-sm)', border: '1px solid var(--bs-warning)' }}>
            &lt;Badge dot /&gt;
          </code>
        </div>
        <p style={{ fontSize: '0.75rem', color: BS_SECONDARY, marginTop: '0.25rem' }}>
          <strong>Dev Warning:</strong> Check browser console for accessibility warning
        </p>
      </div>
    </div>
  ),
  parameters: { layout: 'padded' },
};

// =============================================================================
// Performance Features
// =============================================================================

export const PerformanceDemo: Story = {
  render: () => <PerformanceShowcaseExample />,
  parameters: { layout: 'padded' },
};

// =============================================================================
// Use Cases
// =============================================================================

export const InHeading: Story = {
  render: () => (
    <div>
      <Heading level={1}>
        Example heading <Badge variant="secondary">New</Badge>
      </Heading>
      <Heading level={2}>
        Example heading <Badge variant="secondary">New</Badge>
      </Heading>
      <Heading level={3}>
        Example heading <Badge variant="secondary">New</Badge>
      </Heading>
    </div>
  ),
  parameters: { layout: 'padded' },
};

export const NotificationBadge: Story = {
  render: () => (
    <Badge.Wrapper>
      <Button variant="primary">Inbox</Button>
      <Badge variant="danger" pill>99+</Badge>
    </Badge.Wrapper>
  ),
};

export const AsCounter: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <Button variant="outline-primary">
        Messages
        <Badge variant="primary" pill className="ms-2">4</Badge>
      </Button>
      <Button variant="outline-secondary">
        Notifications
        <Badge variant="danger" pill className="ms-2">12</Badge>
      </Button>
    </div>
  ),
};

export const EmptyIndicator: Story = {
  render: () => (
    <Badge.Wrapper>
      <Button variant="primary">Inbox</Button>
      <Badge
        variant="danger"
        pill
        className="p-2 border border-light"
        aria-label="New notifications"
      />
    </Badge.Wrapper>
  ),
};

// =============================================================================
// Showcases
// =============================================================================

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      <Badge variant="primary">Primary</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="danger">Danger</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="info">Info</Badge>
      <Badge variant="light">Light</Badge>
      <Badge variant="dark">Dark</Badge>
    </div>
  ),
};

export const CompleteShowcase: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <Heading level={4} style={{ marginBottom: '0.5rem' }}>Variants</Heading>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <Badge variant="primary">Primary</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="danger">Danger</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="info">Info</Badge>
        </div>
      </div>

      <div>
        <Heading level={4} style={{ marginBottom: '0.5rem' }}>Sizes</Heading>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <Badge size="sm">Small</Badge>
          <Badge size="md">Medium</Badge>
          <Badge size="lg">Large</Badge>
        </div>
      </div>

      <div>
        <Heading level={4} style={{ marginBottom: '0.5rem' }}>Appearances</Heading>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <Badge variant="primary" appearance="solid">Solid</Badge>
          <Badge variant="primary" appearance="outline">Outline</Badge>
          <Badge variant="primary" appearance="subtle">Subtle</Badge>
        </div>
      </div>

      <div>
        <Heading level={4} style={{ marginBottom: '0.5rem' }}>Pill Shape</Heading>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <Badge variant="primary" pill>Primary</Badge>
          <Badge variant="secondary" pill>Secondary</Badge>
          <Badge variant="success" pill>Success</Badge>
          <Badge variant="danger" pill>Danger</Badge>
        </div>
      </div>

      <div>
        <Heading level={4} style={{ marginBottom: '0.5rem' }}>Status Indicators</Heading>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Badge variant="success" dot>Online</Badge>
          <Badge variant="warning" dot>Away</Badge>
          <Badge variant="danger" dot>Busy</Badge>
          <Badge variant="secondary" dot>Offline</Badge>
        </div>
      </div>

      <div>
        <Heading level={4} style={{ marginBottom: '0.5rem' }}>With Icons</Heading>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <Badge variant="primary" icon={<StarFillIcon size={12} />}>Featured</Badge>
          <Badge variant="success" icon={<CheckCircleFillIcon size={12} />}>Verified</Badge>
          <Badge variant="danger" icon={<ExclamationTriangleFillIcon size={12} />}>Alert</Badge>
        </div>
      </div>

      <div>
        <Heading level={4} style={{ marginBottom: '0.5rem' }}>Overlay (Badge.Wrapper)</Heading>
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          <Badge.Wrapper>
            <Button variant="outline-primary">Inbox</Button>
            <Badge variant="danger" pill>4</Badge>
          </Badge.Wrapper>
          <Badge.Wrapper placement="bottom-end">
            <Button variant="outline-secondary">Tasks</Button>
            <Badge variant="warning" pill>!</Badge>
          </Badge.Wrapper>
        </div>
      </div>

      <div>
        <Heading level={4} style={{ marginBottom: '0.5rem' }}>
          Accessibility &amp; Performance
        </Heading>
        <p>
          Icons are hidden from screen readers. Dots are smart: hidden when content exists, but
          visible for dot-only indicators. Component uses React.memo + memoized internals
          for optimal performance in lists and high-frequency re-renders.
        </p>
      </div>
    </div>
  ),
  parameters: { layout: 'padded' },
};
