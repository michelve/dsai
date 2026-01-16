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
 * - Pill shape for fully rounded badges
 * - Dot indicators for status (with automatic aria-hidden for accessibility)
 * - Icon support (icons automatically hidden from screen readers)
 * - Performance: React.memo wrapper + memoized component, class construction, and content detection
 * - Accessibility: aria-label required for dot-only badges (shows dev warning if missing)
 * - forwardRef support for direct DOM access when needed
 *
 * Performance Optimizations:
 * - React.memo prevents unnecessary re-renders
 * - Memoized class name construction with useMemo
 * - Memoized content detection (hasVisibleContent)
 * - Ideal for: large lists (100+ badges), frequent parent re-renders
 *
 * @see https://getbootstrap.com/docs/5.3/components/badge/
 */

// Helper: Icon badge example
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
      <p style={{ fontSize: '0.875rem', color: 'var(--bs-secondary)', marginBottom: '0.5rem' }}>
        Icons are hidden from screen readers (aria-hidden=&quot;true&quot;), preventing redundant
        announcements:
      </p>
      <IconBadgeExample />
    </div>

    <div>
      <Heading level={4} style={{ marginBottom: '0.5rem' }}>
        Dot Indicator Accessibility
      </Heading>
      <p style={{ fontSize: '0.875rem', color: 'var(--bs-secondary)', marginBottom: '0.5rem' }}>
        Dots are hidden when badge has content, but visible to screen readers when dot-only:
      </p>
      <DotAccessibilityExample />
    </div>

    <div>
      <Heading level={4} style={{ marginBottom: '0.5rem' }}>
        Dev Warning Example
      </Heading>
      <p style={{ fontSize: '0.875rem', color: 'var(--bs-secondary)', marginBottom: '0.5rem' }}>
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
      <p style={{ fontSize: '0.875rem', color: 'var(--bs-secondary)' }}>
        Badges are wrapped with React.memo and internally memoized for maximum performance. Memoized
        class construction and component prevent unnecessary re-renders even in large lists.
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
          'Supports 8 color variants, pill shape, dot indicators, and icons. ' +
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

/**
 * Primary badge - default variant
 */
export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary',
  },
};

/**
 * Secondary badge
 */
export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary',
  },
};

/**
 * Success badge - use for positive status
 */
export const Success: Story = {
  args: {
    variant: 'success',
    children: 'Success',
  },
};

/**
 * Danger badge - use for errors or critical status
 */
export const Danger: Story = {
  args: {
    variant: 'danger',
    children: 'Danger',
  },
};

/**
 * Warning badge - use for warnings or caution
 */
export const Warning: Story = {
  args: {
    variant: 'warning',
    children: 'Warning',
  },
};

/**
 * Info badge - use for informational content
 */
export const Info: Story = {
  args: {
    variant: 'info',
    children: 'Info',
  },
};

/**
 * Light badge - use on dark backgrounds
 */
export const Light: Story = {
  args: {
    variant: 'light',
    children: 'Light',
  },
  globals: {
    backgrounds: {
      value: 'dark',
    },
  },
};

/**
 * Dark badge - use on light backgrounds
 */
export const Dark: Story = {
  args: {
    variant: 'dark',
    children: 'Dark',
  },
};

// =============================================================================
// Pill Shape
// =============================================================================

/**
 * Pill badge - fully rounded
 */
export const Pill: Story = {
  args: {
    variant: 'primary',
    pill: true,
    children: 'Pill Badge',
  },
};

/**
 * All pill variants
 */
export const AllPillVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      <Badge variant="primary" pill>
        Primary
      </Badge>
      <Badge variant="secondary" pill>
        Secondary
      </Badge>
      <Badge variant="success" pill>
        Success
      </Badge>
      <Badge variant="danger" pill>
        Danger
      </Badge>
      <Badge variant="warning" pill>
        Warning
      </Badge>
      <Badge variant="info" pill>
        Info
      </Badge>
    </div>
  ),
};

// =============================================================================
// Dot Indicator
// =============================================================================

/**
 * Badge with dot indicator
 */
export const WithDot: Story = {
  args: {
    variant: 'success',
    dot: true,
    children: 'Online',
  },
};

/**
 * Dot-only badge (status indicator)
 */
export const DotOnly: Story = {
  args: {
    variant: 'success',
    dot: true,
    'aria-label': 'Online status',
  },
};

/**
 * Status indicators with dots
 */
export const StatusIndicators: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <Badge variant="success" dot>
        Online
      </Badge>
      <Badge variant="warning" dot>
        Away
      </Badge>
      <Badge variant="danger" dot>
        Busy
      </Badge>
      <Badge variant="secondary" dot>
        Offline
      </Badge>
    </div>
  ),
};

// =============================================================================
// With Icon
// =============================================================================

/**
 * Badge with icon
 */
export const WithIcon: Story = {
  args: {
    variant: 'primary',
    icon: <StarFillIcon size={12} />,
    children: 'Featured',
  },
};

/**
 * Various icon badges - icons automatically hidden from screen readers
 */
export const IconExamples: Story = {
  render: () => <IconBadgeExample />,
};

// =============================================================================
// Accessibility Features
// =============================================================================

/**
 * Accessibility showcase - demonstrates all accessibility features
 */
export const AccessibilityShowcase: Story = {
  render: () => <AccessibilityShowcaseExample />,
  parameters: {
    layout: 'padded',
  },
};

/**
 * Proper dot-only usage with aria-label vs incorrect usage (shows dev warning in console)
 */
export const ProperDotOnlyUsage: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem', fontWeight: 'var(--sb-typography-font-weight-semi-bold)' }}>
          <CheckIcon size={14} className="text-success me-1" />
          Correct: Dot-only with aria-label
        </p>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Badge variant="success" dot aria-label="Online" />
          <code
            style={{
              fontSize: '0.75rem',
              background: 'var(--bs-gray-100)',
              padding: '0.25rem 0.5rem',
              borderRadius: 'var(--sb-border-radius-sm)',
            }}
          >
            &lt;Badge dot aria-label=&quot;Online&quot; /&gt;
          </code>
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--bs-secondary)', marginTop: '0.25rem' }}>
          Screen readers announce: &quot;Online&quot;
        </p>
      </div>
      <div>
        <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem', fontWeight: 'var(--sb-typography-font-weight-semi-bold)' }}>
          <XLgIcon size={14} className="text-danger me-1" />
          Incorrect: Dot-only without aria-label
        </p>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Badge variant="danger" dot />
          <code
            style={{
              fontSize: '0.75rem',
              background: 'var(--bs-warning-bg-subtle)',
              padding: '0.25rem 0.5rem',
              borderRadius: 'var(--sb-border-radius-sm)',
              border: '1px solid var(--bs-warning)',
            }}
          >
            &lt;Badge dot /&gt;
          </code>
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--bs-secondary)', marginTop: '0.25rem' }}>
          <strong>Dev Warning:</strong> Check browser console for accessibility warning
        </p>
      </div>
      <div
        style={{
          background: 'var(--bs-gray-100)',
          padding: '1rem',
          borderRadius: 'var(--sb-border-radius-lg)',
          borderLeft: '4px solid var(--bs-primary)',
        }}
      >
        <p style={{ fontSize: '0.875rem', margin: 0, fontWeight: 'var(--sb-typography-font-weight-semi-bold)', marginBottom: '0.5rem' }}>
          Accessibility Tip
        </p>
        <p style={{ fontSize: '0.875rem', margin: 0, color: 'var(--bs-secondary)' }}>
          Dot-only badges must have an <code>aria-label</code> so screen reader users understand
          what the status indicator means. The component shows a helpful dev warning to catch this
          during development.
        </p>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

// =============================================================================
// Performance Features
// =============================================================================

/**
 * Performance - memoized component and class construction
 */
export const PerformanceDemo: Story = {
  render: () => <PerformanceShowcaseExample />,
  parameters: {
    layout: 'padded',
  },
};

// =============================================================================
// Use Cases
// =============================================================================

/**
 * Badge in heading
 */
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
  parameters: {
    layout: 'padded',
  },
};

/**
 * Notification badge on button
 */
export const NotificationBadge: Story = {
  render: () => (
    <Button variant="primary" className="position-relative">
      Inbox
      <Badge variant="danger" pill className="position-absolute top-0 start-100 translate-middle">
        99+
      </Badge>
    </Button>
  ),
};

/**
 * Badge as counter
 */
export const AsCounter: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <Button variant="outline-primary" className="position-relative">
        Messages
        <Badge variant="primary" pill className="ms-2">
          4
        </Badge>
      </Button>
      <Button variant="outline-secondary" className="position-relative">
        Notifications
        <Badge variant="danger" pill className="ms-2">
          12
        </Badge>
      </Button>
    </div>
  ),
};

/**
 * Empty state indicator
 */
export const EmptyIndicator: Story = {
  render: () => (
    <Button variant="primary" className="position-relative">
      Inbox
      <Badge
        variant="danger"
        pill
        className="position-absolute top-0 start-100 translate-middle p-2 border border-light"
        aria-label="New notifications"
      />
    </Button>
  ),
};

// =============================================================================
// Showcases
// =============================================================================

/**
 * All variants showcase
 */
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

/**
 * Complete badge showcase
 */
export const CompleteShowcase: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Variants */}
      <div>
        <Heading level={4} style={{ marginBottom: '0.5rem' }}>
          Variants
        </Heading>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <Badge variant="primary">Primary</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="danger">Danger</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="info">Info</Badge>
        </div>
      </div>

      {/* Pill */}
      <div>
        <Heading level={4} style={{ marginBottom: '0.5rem' }}>
          Pill Shape
        </Heading>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <Badge variant="primary" pill>
            Primary
          </Badge>
          <Badge variant="secondary" pill>
            Secondary
          </Badge>
          <Badge variant="success" pill>
            Success
          </Badge>
          <Badge variant="danger" pill>
            Danger
          </Badge>
        </div>
      </div>

      {/* Dot */}
      <div>
        <Heading level={4} style={{ marginBottom: '0.5rem' }}>
          Status Indicators
        </Heading>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Badge variant="success" dot>
            Online
          </Badge>
          <Badge variant="warning" dot>
            Away
          </Badge>
          <Badge variant="danger" dot>
            Busy
          </Badge>
          <Badge variant="secondary" dot>
            Offline
          </Badge>
        </div>
      </div>

      {/* With Icons */}
      <div>
        <Heading level={4} style={{ marginBottom: '0.5rem' }}>
          With Icons
        </Heading>
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
        </div>
      </div>

      {/* On Buttons */}
      <div>
        <Heading level={4} style={{ marginBottom: '0.5rem' }}>
          On Buttons
        </Heading>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Button variant="primary" className="position-relative">
            Inbox
            <Badge variant="light" pill className="ms-2">
              4
            </Badge>
          </Button>
          <Button variant="outline-primary" className="position-relative">
            Notifications
            <Badge
              variant="danger"
              pill
              className="position-absolute top-0 start-100 translate-middle"
            >
              99+
            </Badge>
          </Button>
        </div>
      </div>

      {/* Accessibility */}
      <div>
        <Heading level={4} style={{ marginBottom: '0.5rem' }}>
          Accessibility & Performance
        </Heading>
        <p>
          Icons are hidden from screen readers. Dots are smart: hidden when content exists, but
          visible for dot-only indicators. Component uses React.memo + memoized class construction
          for optimal performance in lists and high-frequency re-renders.
        </p>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};
