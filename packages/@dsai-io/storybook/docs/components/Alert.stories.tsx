import {
  Alert,
  Button,
  CheckCircleFillIcon,
  ExclamationTriangleFillIcon,
  Heading,
  InfoCircleFillIcon,
  XCircleFillIcon,
} from '@dsai-io/react';
import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';
import type { JSX } from 'react';

const FONT_SIZE_SM = '0.875rem';
const COLOR_SECONDARY = 'var(--bs-secondary)';

/**
 * Alert component for displaying important messages to users.
 * Built with Bootstrap 5 design tokens and full WCAG 2.2 AA compliance.
 *
 * Features:
 * - 8 color variants with Bootstrap 5 theming
 * - Dismissible functionality with Escape key support
 * - Compound components (Alert.Link, Alert.Heading)
 * - Security hardening: href validation, external link protection
 * - Accessibility: aria-live, aria-atomic, proper ARIA roles
 * - Performance: memoized subcomponents and class construction
 *
 * @see https://getbootstrap.com/docs/5.3/components/alerts/
 */

// Helper component for secure external link example
const SecureExternalLinkExample = (): JSX.Element => (
  <Alert variant="info">
    Visit our{' '}
    <Alert.Link href="https://example.com" target="_blank">
      secure external link
    </Alert.Link>{' '}
    (automatically adds rel=&quot;noopener noreferrer&quot; for security).
  </Alert>
);

// Helper component for XSS prevention example
const XSSPreventionExample = (): JSX.Element => (
  <Alert variant="warning">
    <strong>Security Protected:</strong> Dangerous URLs like{' '}
    <code>javascript:alert(&apos;XSS&apos;)</code> are automatically blocked and converted to safe
    fallback.
    <Alert.Link href="javascript:alert('XSS')">Click here (safe, blocked dangerous URL)</Alert.Link>
  </Alert>
);

// ── Story constants (S109) ──
const ASYNC_OPERATION_MS = 1500;
const AUTO_DISMISS_DELAY_MS = 3000;

// Helper component for aria-atomic example
const AriaAtomicExample = (): JSX.Element => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSave = async (): Promise<void> => {
    setStatus('loading');
    await new Promise((resolve) => setTimeout(resolve, ASYNC_OPERATION_MS));
    setStatus('success');
    setTimeout(() => setStatus('idle'), AUTO_DISMISS_DELAY_MS);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Alert
        variant={status === 'success' ? 'success' : 'info'}
        aria-atomic
        role="status"
        aria-live="polite"
        icon={status === 'success' ? <CheckCircleFillIcon /> : undefined}
      >
        {status === 'idle' && 'Ready to save. Click button to start.'}
        {status === 'loading' && 'Saving your changes...'}
        {status === 'success' && 'Changes saved successfully!'}
      </Alert>
      <Button
        variant="primary"
        onClick={handleSave}
        disabled={status === 'loading'}
        loading={status === 'loading'}
      >
        Save Changes
      </Button>
      <p style={{ fontSize: FONT_SIZE_SM, color: COLOR_SECONDARY }}>
        With aria-atomic=&quot;true&quot;, screen readers announce the complete alert content on
        updates.
      </p>
    </div>
  );
};

const meta: Meta<typeof Alert> = {
  title: 'Components/Alert',
  component: Alert,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A Bootstrap 5 alert component for displaying important messages with security hardening. ' +
          'Supports 8 color variants, dismissible functionality, compound components (Alert.Link, Alert.Heading), ' +
          'aria-live/aria-atomic for accessibility, and XSS-protected href validation.',
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
    'aria-atomic': {
      control: 'boolean',
      description: 'Announces complete alert content on updates (for aria-live)',
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
 * Dismissible alert with close button and Escape key support.
 * Press Escape key to dismiss the alert when it's visible.
 */
export const Dismissible: Story = {
  render: function DismissibleAlert() {
    const [show, setShow] = useState(true);

    if (!show) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Button variant="primary" onClick={() => setShow(true)}>
            Show Alert
          </Button>
          <p style={{ fontSize: FONT_SIZE_SM, color: COLOR_SECONDARY }}>
            Alert dismissed. Click button to show it again.
          </p>
        </div>
      );
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <Alert variant="warning" dismissible onClose={() => setShow(false)}>
          <strong>Holy guacamole!</strong> You should check in on some of those fields below.
        </Alert>
        <p style={{ fontSize: FONT_SIZE_SM, color: COLOR_SECONDARY }}>
          <strong>Keyboard support:</strong> Press <kbd>Escape</kbd> to dismiss, or click the X
          button.
        </p>
      </div>
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

    const dismissAlert = (id: number): void => {
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
      <Alert variant="success" icon={<CheckCircleFillIcon />} iconLabel="Success">
        Your changes have been saved successfully.
      </Alert>
      <Alert variant="danger" icon={<XCircleFillIcon />} iconLabel="Error">
        An error occurred. Please try again.
      </Alert>
      <Alert variant="warning" icon={<ExclamationTriangleFillIcon />} iconLabel="Warning">
        Please review your input before submitting.
      </Alert>
      <Alert variant="info" icon={<InfoCircleFillIcon />} iconLabel="Information">
        New features are available in this version.
      </Alert>
    </div>
  ),
};

// =============================================================================
// Controlled Visibility
// =============================================================================

/**
 * Controlled visibility via the `show` prop.
 * Toggle the alert on and off with an external button.
 */
export const ControlledVisibility: Story = {
  render: function ControlledVisibilityAlert() {
    const [isVisible, setIsVisible] = useState(true);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsVisible(true)}
            disabled={isVisible}
          >
            Show
          </Button>
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={() => setIsVisible(false)}
            disabled={!isVisible}
          >
            Hide
          </Button>
        </div>
        <Alert variant="info" show={isVisible}>
          This alert&apos;s visibility is controlled by the <code>show</code> prop. The FSM
          transitions between <em>visible</em> and <em>hidden</em> states.
        </Alert>
      </div>
    );
  },
};

// =============================================================================
// Security Features
// =============================================================================

/**
 * Secure external links with automatic rel="noopener noreferrer"
 */
export const SecureExternalLinks: Story = {
  render: () => <SecureExternalLinkExample />,
};

/**
 * XSS Protection - dangerous URLs are automatically blocked
 */
export const XSSPrevention: Story = {
  render: () => <XSSPreventionExample />,
};

/**
 * Multiple security-hardened links
 */
export const SecurityShowcase: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Alert variant="success" icon={<CheckCircleFillIcon />}>
        <strong>Safe:</strong> <Alert.Link href="https://example.com">HTTPS link</Alert.Link>
      </Alert>
      <Alert variant="success" icon={<CheckCircleFillIcon />}>
        <strong>Safe:</strong> <Alert.Link href="/docs">Relative link</Alert.Link>
      </Alert>
      <Alert variant="success" icon={<CheckCircleFillIcon />}>
        <strong>Safe:</strong> <Alert.Link href="mailto:test@example.com">Email link</Alert.Link>
      </Alert>
      <Alert variant="danger" icon={<XCircleFillIcon />}>
        <strong>Blocked:</strong>{' '}
        <Alert.Link href="javascript:alert('XSS')">javascript: protocol</Alert.Link>
      </Alert>
      <Alert variant="danger" icon={<XCircleFillIcon />}>
        <strong>Blocked:</strong>{' '}
        <Alert.Link href="data:text/html,<script>">data: protocol</Alert.Link>
      </Alert>
    </div>
  ),
};

// =============================================================================
// Accessibility Features
// =============================================================================

/**
 * aria-atomic for complete announcements
 */
export const AriaAtomic: Story = {
  render: () => <AriaAtomicExample />,
};

/**
 * Alert with appropriate aria-live for severity
 */
export const AccessibilityRoles: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Alert variant="danger" aria-atomic>
        <strong>Critical:</strong> Uses role=&quot;alert&quot; and aria-live=&quot;assertive&quot;
        for immediate announcement.
      </Alert>
      <Alert variant="warning" aria-atomic>
        <strong>Warning:</strong> Uses role=&quot;alert&quot; and aria-live=&quot;assertive&quot;.
      </Alert>
      <Alert variant="success" aria-atomic>
        <strong>Success:</strong> Uses role=&quot;status&quot; and aria-live=&quot;polite&quot; for
        non-urgent updates.
      </Alert>
      <Alert variant="info" aria-atomic>
        <strong>Info:</strong> Uses role=&quot;status&quot; and aria-live=&quot;polite&quot;.
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
          <Heading level={4} style={{ marginBottom: '0.5rem' }}>
            Basic Variants
          </Heading>
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
          <Heading level={4} style={{ marginBottom: '0.5rem' }}>
            With Heading
          </Heading>
          <Alert variant="success">
            <Alert.Heading>Success!</Alert.Heading>
            <p className="mb-0">Your operation completed successfully.</p>
          </Alert>
        </div>

        {/* With Link */}
        <div>
          <Heading level={4} style={{ marginBottom: '0.5rem' }}>
            With Link
          </Heading>
          <Alert variant="info">
            Learn more in our <Alert.Link href="#">documentation</Alert.Link>.
          </Alert>
        </div>

        {/* Dismissible */}
        <div>
          <Heading level={4} style={{ marginBottom: '0.5rem' }}>
            Dismissible
          </Heading>
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
          <Heading level={4} style={{ marginBottom: '0.5rem' }}>
            With Icon
          </Heading>
          <Alert variant="success" icon={<CheckCircleFillIcon />}>
            Operation completed successfully.
          </Alert>
        </div>

        {/* Security */}
        <div>
          <Heading level={4} style={{ marginBottom: '0.5rem' }}>
            Security Features
          </Heading>
          <Alert variant="info">
            Safe links:{' '}
            <Alert.Link href="https://example.com" target="_blank">
              external
            </Alert.Link>{' '}
            and <Alert.Link href="/docs">internal</Alert.Link>
          </Alert>
        </div>

        {/* Accessibility */}
        <div>
          <Heading level={4} style={{ marginBottom: '0.5rem' }}>
            Accessibility
          </Heading>
          <Alert variant="success" aria-atomic>
            Complete alert content announced to screen readers with aria-atomic=true
          </Alert>
        </div>
      </div>
    );
  },
};

/**
 * Alert with auto-dismiss functionality.
 * The alert disappears after the specified duration.
 * Timer resets when the alert is re-shown.
 */
export const AutoDismiss: Story = {
  render: function AutoDismissStory() {
    const [show, setShow] = useState(true);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {show ? (
          <Alert
            variant="info"
            icon={<InfoCircleFillIcon />}
            autoDismiss={5000}
            dismissible
            onClose={() => setShow(false)}
          >
            This alert will auto-dismiss in 5 seconds. You can also close it manually.
          </Alert>
        ) : (
          <Button size="sm" onClick={() => setShow(true)}>
            Show Auto-Dismiss Alert
          </Button>
        )}
        <p style={{ fontSize: FONT_SIZE_SM, color: COLOR_SECONDARY }}>
          The <code>autoDismiss</code> prop accepts a duration in milliseconds. The{' '}
          <code>onClose</code> callback receives a <code>reason</code> parameter:{' '}
          <code>&quot;click&quot;</code>, <code>&quot;escape&quot;</code>, or{' '}
          <code>&quot;timeout&quot;</code>.
        </p>
      </div>
    );
  },
};

/**
 * Alert with fade-out animation on dismiss.
 * Uses Bootstrap's fade/show CSS classes for smooth opacity transitions.
 * Respects the user's prefers-reduced-motion setting.
 */
export const FadeTransition: Story = {
  render: function FadeTransitionStory() {
    const [showAnimated, setShowAnimated] = useState(true);
    const [showInstant, setShowInstant] = useState(true);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Heading level={4} style={{ marginBottom: '0.5rem' }}>
          With Transition (default)
        </Heading>
        {showAnimated ? (
          <Alert variant="success" dismissible onClose={() => setShowAnimated(false)}>
            This alert fades out when dismissed.
          </Alert>
        ) : (
          <Button size="sm" onClick={() => setShowAnimated(true)}>
            Show Animated Alert
          </Button>
        )}

        <Heading level={4} style={{ marginBottom: '0.5rem' }}>
          Without Transition
        </Heading>
        {showInstant ? (
          <Alert
            variant="warning"
            dismissible
            onClose={() => setShowInstant(false)}
            transition={false}
          >
            This alert disappears instantly when dismissed.
          </Alert>
        ) : (
          <Button size="sm" onClick={() => setShowInstant(true)}>
            Show Instant Alert
          </Button>
        )}
      </div>
    );
  },
};

/**
 * Alert rendered as a `<section>` element for semantic grouping.
 * Useful when the alert represents a distinct section of content.
 */
export const AsSection: Story = {
  args: {
    as: 'section',
    variant: 'info',
    children: (
      <>
        <Alert.Heading>Section Alert</Alert.Heading>
        <p className="mb-0">
          This alert renders as a <code>&lt;section&gt;</code> element instead of a{' '}
          <code>&lt;div&gt;</code>, providing stronger semantic grouping.
        </p>
      </>
    ),
  },
};

/**
 * Alert.Heading with custom heading levels.
 * By default it renders an `<h4>`, but you can change it to any heading level (h1–h6).
 */
export const HeadingLevels: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Alert variant="primary">
        <Alert.Heading as="h2">Heading Level 2</Alert.Heading>
        <p className="mb-0">This uses an h2 element for the heading.</p>
      </Alert>
      <Alert variant="success">
        <Alert.Heading as="h3">Heading Level 3</Alert.Heading>
        <p className="mb-0">This uses an h3 element for the heading.</p>
      </Alert>
      <Alert variant="info">
        <Alert.Heading>Default Heading (h4)</Alert.Heading>
        <p className="mb-0">This uses the default h4 element for the heading.</p>
      </Alert>
      <Alert variant="warning">
        <Alert.Heading as="h5">Heading Level 5</Alert.Heading>
        <p className="mb-0">This uses an h5 element for the heading.</p>
      </Alert>
    </div>
  ),
};
