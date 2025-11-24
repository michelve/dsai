import { useState } from 'react';

import { Alert, Button } from '@dsai/react';

import type { Meta, StoryObj } from '@storybook/react-vite';

/**
 * Alert component for displaying important messages to users.
 * Built with Bootstrap 5 design tokens and full WCAG 2.2 AA compliance.
 *
 * @see https://getbootstrap.com/docs/5.3/components/alerts/
 */
const meta: Meta<typeof Alert> = {
  title: 'Components/Alert',
  component: Alert,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A Bootstrap 5 alert component for displaying important messages. ' +
          'Supports 8 color variants, dismissible functionality, compound components (Alert.Link, Alert.Heading), ' +
          'and proper ARIA attributes for accessibility.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'],
      description: 'Alert color variant',
      table: {
        type: { summary: 'AlertVariant' },
        defaultValue: { summary: 'primary' },
      },
    },
    title: {
      control: 'text',
      description: 'Optional alert title',
      table: {
        type: { summary: 'string' },
      },
    },
    dismissible: {
      control: 'boolean',
      description: 'Whether the alert can be dismissed',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    show: {
      control: 'boolean',
      description: 'Control alert visibility',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    children: {
      control: 'text',
      description: 'Alert content',
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
 * Primary alert - default variant
 */
export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'A simple primary alert—check it out!',
  },
};

/**
 * Secondary alert
 */
export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'A simple secondary alert—check it out!',
  },
};

/**
 * Success alert - use for positive feedback
 */
export const Success: Story = {
  args: {
    variant: 'success',
    children: 'A simple success alert—check it out!',
  },
};

/**
 * Danger alert - use for errors or critical messages
 */
export const Danger: Story = {
  args: {
    variant: 'danger',
    children: 'A simple danger alert—check it out!',
  },
};

/**
 * Warning alert - use for warnings or caution
 */
export const Warning: Story = {
  args: {
    variant: 'warning',
    children: 'A simple warning alert—check it out!',
  },
};

/**
 * Info alert - use for informational content
 */
export const Info: Story = {
  args: {
    variant: 'info',
    children: 'A simple info alert—check it out!',
  },
};

/**
 * Light alert
 */
export const Light: Story = {
  args: {
    variant: 'light',
    children: 'A simple light alert—check it out!',
  },
};

/**
 * Dark alert
 */
export const Dark: Story = {
  args: {
    variant: 'dark',
    children: 'A simple dark alert—check it out!',
  },
};

// =============================================================================
// With Title
// =============================================================================

/**
 * Alert with title prop
 */
export const WithTitle: Story = {
  args: {
    variant: 'success',
    title: 'Well done!',
    children: 'You successfully completed the task.',
  },
};

// =============================================================================
// Compound Components
// =============================================================================

/**
 * Alert with Alert.Heading compound component
 */
export const WithHeading: Story = {
  render: () => (
    <Alert variant="success">
      <Alert.Heading>Well done!</Alert.Heading>
      <p>
        Aww yeah, you successfully read this important alert message. This example text is going to
        run a bit longer so that you can see how spacing within an alert works with this kind of
        content.
      </p>
      <hr />
      <p className="mb-0">
        Whenever you need to, be sure to use margin utilities to keep things nice and tidy.
      </p>
    </Alert>
  ),
};

/**
 * Alert with Alert.Link
 */
export const WithLink: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Alert variant="primary">
        A simple primary alert with <Alert.Link href="#">an example link</Alert.Link>. Give it a
        click if you like.
      </Alert>
      <Alert variant="secondary">
        A simple secondary alert with <Alert.Link href="#">an example link</Alert.Link>. Give it a
        click if you like.
      </Alert>
      <Alert variant="success">
        A simple success alert with <Alert.Link href="#">an example link</Alert.Link>. Give it a
        click if you like.
      </Alert>
      <Alert variant="danger">
        A simple danger alert with <Alert.Link href="#">an example link</Alert.Link>. Give it a
        click if you like.
      </Alert>
    </div>
  ),
};

// =============================================================================
// Dismissible
// =============================================================================

/**
 * Dismissible alert with close button
 */
export const Dismissible: Story = {
  render: function DismissibleAlert() {
    const [show, setShow] = useState(true);

    if (!show) {
      return (
        <Button variant="primary" onClick={() => setShow(true)}>
          Show Alert
        </Button>
      );
    }

    return (
      <Alert variant="warning" dismissible onClose={() => setShow(false)}>
        <strong>Holy guacamole!</strong> You should check in on some of those fields below.
      </Alert>
    );
  },
};

/**
 * Multiple dismissible alerts
 */
export const MultipleDismissible: Story = {
  render: function MultipleDismissibleAlerts() {
    const [alerts, setAlerts] = useState([
      { id: 1, variant: 'success' as const, message: 'Success! Your changes have been saved.' },
      { id: 2, variant: 'info' as const, message: 'Info: New features are available.' },
      { id: 3, variant: 'warning' as const, message: 'Warning: Your session will expire soon.' },
    ]);

    const dismissAlert = (id: number) => {
      setAlerts(alerts.filter((alert) => alert.id !== id));
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {alerts.map((alert) => (
          <Alert
            key={alert.id}
            variant={alert.variant}
            dismissible
            onClose={() => dismissAlert(alert.id)}
          >
            {alert.message}
          </Alert>
        ))}
        {alerts.length === 0 && (
          <p className="text-muted">All alerts dismissed. Refresh to see them again.</p>
        )}
      </div>
    );
  },
};

// =============================================================================
// With Icon
// =============================================================================

/**
 * Alert with custom icon
 */
export const WithIcon: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Alert variant="success" icon={<span style={{ fontSize: '1.25rem' }}>✓</span>}>
        Your changes have been saved successfully.
      </Alert>
      <Alert variant="danger" icon={<span style={{ fontSize: '1.25rem' }}>✕</span>}>
        An error occurred. Please try again.
      </Alert>
      <Alert variant="warning" icon={<span style={{ fontSize: '1.25rem' }}>⚠</span>}>
        Please review your input before submitting.
      </Alert>
      <Alert variant="info" icon={<span style={{ fontSize: '1.25rem' }}>ℹ</span>}>
        New features are available in this version.
      </Alert>
    </div>
  ),
};

// =============================================================================
// Use Cases
// =============================================================================

/**
 * Form validation alerts
 */
export const FormValidation: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Alert variant="danger">
        <Alert.Heading as="h5">Please fix the following errors:</Alert.Heading>
        <ul className="mb-0">
          <li>Email address is required</li>
          <li>Password must be at least 8 characters</li>
          <li>Please accept the terms and conditions</li>
        </ul>
      </Alert>
      <Alert variant="success">
        <strong>Form submitted successfully!</strong> We&apos;ll be in touch soon.
      </Alert>
    </div>
  ),
};

/**
 * System notifications
 */
export const SystemNotifications: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Alert variant="info">
        <strong>Scheduled maintenance:</strong> The system will be unavailable on Sunday from 2-4 AM
        EST.
      </Alert>
      <Alert variant="warning">
        <strong>Session expiring:</strong> Your session will expire in 5 minutes.{' '}
        <Alert.Link href="#">Extend session</Alert.Link>
      </Alert>
      <Alert variant="danger">
        <strong>Connection lost:</strong> Unable to connect to the server.{' '}
        <Alert.Link href="#">Retry</Alert.Link>
      </Alert>
    </div>
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <Alert variant="primary">A simple primary alert—check it out!</Alert>
      <Alert variant="secondary">A simple secondary alert—check it out!</Alert>
      <Alert variant="success">A simple success alert—check it out!</Alert>
      <Alert variant="danger">A simple danger alert—check it out!</Alert>
      <Alert variant="warning">A simple warning alert—check it out!</Alert>
      <Alert variant="info">A simple info alert—check it out!</Alert>
      <Alert variant="light">A simple light alert—check it out!</Alert>
      <Alert variant="dark">A simple dark alert—check it out!</Alert>
    </div>
  ),
};

/**
 * Complete alert showcase
 */
export const CompleteShowcase: Story = {
  render: function CompleteShowcaseRender() {
    const [showDismissible, setShowDismissible] = useState(true);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Basic Variants */}
        <div>
          <h4 style={{ marginBottom: '0.5rem' }}>Basic Variants</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Alert variant="primary">Primary alert</Alert>
            <Alert variant="success">Success alert</Alert>
            <Alert variant="danger">Danger alert</Alert>
            <Alert variant="warning">Warning alert</Alert>
            <Alert variant="info">Info alert</Alert>
          </div>
        </div>

        {/* With Heading */}
        <div>
          <h4 style={{ marginBottom: '0.5rem' }}>With Heading</h4>
          <Alert variant="success">
            <Alert.Heading>Success!</Alert.Heading>
            <p className="mb-0">Your operation completed successfully.</p>
          </Alert>
        </div>

        {/* With Link */}
        <div>
          <h4 style={{ marginBottom: '0.5rem' }}>With Link</h4>
          <Alert variant="info">
            Learn more in our <Alert.Link href="#">documentation</Alert.Link>.
          </Alert>
        </div>

        {/* Dismissible */}
        <div>
          <h4 style={{ marginBottom: '0.5rem' }}>Dismissible</h4>
          {showDismissible ? (
            <Alert variant="warning" dismissible onClose={() => setShowDismissible(false)}>
              This alert can be dismissed.
            </Alert>
          ) : (
            <Button size="sm" onClick={() => setShowDismissible(true)}>
              Show Alert
            </Button>
          )}
        </div>

        {/* With Icon */}
        <div>
          <h4 style={{ marginBottom: '0.5rem' }}>With Icon</h4>
          <Alert variant="success" icon={<span>✓</span>}>
            Operation completed successfully.
          </Alert>
        </div>
      </div>
    );
  },
};
