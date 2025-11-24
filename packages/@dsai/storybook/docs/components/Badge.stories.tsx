import { Badge, Button } from '@dsai/react';

import type { Meta, StoryObj } from '@storybook/react-vite';

/**
 * Badge component for displaying labels, status indicators, and counts.
 * Built with Bootstrap 5 design tokens and full WCAG 2.2 AA compliance.
 *
 * @see https://getbootstrap.com/docs/5.3/components/badge/
 */
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
          'Fully accessible with WCAG 2.2 AA compliance.',
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
      description: 'Show dot indicator',
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
  parameters: {
    backgrounds: { default: 'dark' },
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
    icon: <span>★</span>,
    children: 'Featured',
  },
};

/**
 * Various icon badges
 */
export const IconExamples: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      <Badge variant="primary" icon={<span>★</span>}>
        Featured
      </Badge>
      <Badge variant="success" icon={<span>✓</span>}>
        Verified
      </Badge>
      <Badge variant="danger" icon={<span>!</span>}>
        Alert
      </Badge>
      <Badge variant="info" icon={<span>ℹ</span>}>
        Info
      </Badge>
    </div>
  ),
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
      <h1>
        Example heading <Badge variant="secondary">New</Badge>
      </h1>
      <h2>
        Example heading <Badge variant="secondary">New</Badge>
      </h2>
      <h3>
        Example heading <Badge variant="secondary">New</Badge>
      </h3>
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
        <h4 style={{ marginBottom: '0.5rem' }}>Variants</h4>
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
        <h4 style={{ marginBottom: '0.5rem' }}>Pill Shape</h4>
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
        <h4 style={{ marginBottom: '0.5rem' }}>Status Indicators</h4>
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
        <h4 style={{ marginBottom: '0.5rem' }}>With Icons</h4>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <Badge variant="primary" icon={<span>★</span>}>
            Featured
          </Badge>
          <Badge variant="success" icon={<span>✓</span>}>
            Verified
          </Badge>
          <Badge variant="danger" icon={<span>!</span>}>
            Alert
          </Badge>
        </div>
      </div>

      {/* On Buttons */}
      <div>
        <h4 style={{ marginBottom: '0.5rem' }}>On Buttons</h4>
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
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};
