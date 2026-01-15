import {
  Button,
  CheckCircleFillIcon,
  ExclamationTriangleFillIcon,
  Heading,
  InfoCircleFillIcon,
  Toast,
  ToastContainer,
  ToastProvider,
  useToast,
  XCircleFillIcon,
} from '@dsai-io/react';
import { useState } from 'react';

import type { ToastPosition } from '@dsai-io/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { JSX } from 'react';

/**
 * Toast component for displaying non-blocking notifications.
 * Built with Bootstrap 5 design tokens and full WCAG 2.2 AA compliance.
 *
 * Features:
 * - 4 semantic variants (success, error, warning, info)
 * - Auto-dismiss with configurable duration
 * - Progress bar visualization
 * - Queue management via ToastProvider
 * - 6 position options
 * - FSM-based visibility state management
 * - Security hardening: XSS-safe content rendering
 * - Accessibility: aria-live, aria-atomic, proper ARIA roles
 */

// Helper component for useToast hook example
function ToastHookDemo(): JSX.Element {
  const toast = useToast();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <Button variant="success" onClick={() => toast.success('Operation completed!')}>
          Success Toast
        </Button>
        <Button variant="danger" onClick={() => toast.error('Something went wrong!')}>
          Error Toast
        </Button>
        <Button variant="warning" onClick={() => toast.warning('Please review your input')}>
          Warning Toast
        </Button>
        <Button variant="info" onClick={() => toast.info('Here is some information')}>
          Info Toast
        </Button>
      </div>
      <p style={{ fontSize: '0.875rem', color: '#666' }}>Active toasts: {toast.toasts.length}</p>
    </div>
  );
}

// Helper component for toast with title
function ToastWithTitleDemo(): JSX.Element {
  const toast = useToast();

  const handleClick = (): void => {
    toast.success('Your changes have been saved successfully.', {
      title: 'Success',
    });
  };

  return <Button onClick={handleClick}>Show Toast with Title</Button>;
}

// Helper component for persistent toast
function PersistentToastDemo(): JSX.Element {
  const toast = useToast();

  const handleClick = (): void => {
    toast.info('This notification will not disappear automatically. Click the X to dismiss.', {
      duration: false,
    });
  };

  return <Button onClick={handleClick}>Show Persistent Toast</Button>;
}

// Helper component for progress bar
function ProgressToastDemo(): JSX.Element {
  const toast = useToast();

  const handleClick = (): void => {
    toast.info('Processing your request...', {
      showProgress: true,
      duration: 5000,
    });
  };

  return <Button onClick={handleClick}>Show Toast with Progress</Button>;
}

// Helper component for updating toasts
function UpdatingToastDemo(): JSX.Element {
  const toast = useToast();

  const handleClick = async (): Promise<void> => {
    const id = toast.info('Uploading file...', { duration: false });

    await new Promise((resolve) => setTimeout(resolve, 2000));
    toast.update(id, { message: 'Upload complete!', variant: 'success' });

    setTimeout(() => toast.dismiss(id), 3000);
  };

  return <Button onClick={handleClick}>Upload File</Button>;
}

// Helper component for all positions
function AllPositionsDemo(): JSX.Element {
  const [position, setPosition] = useState<ToastPosition>('top-end');

  const positions: ToastPosition[] = [
    'top-start',
    'top-center',
    'top-end',
    'middle-start',
    'middle-center',
    'middle-end',
    'bottom-start',
    'bottom-center',
    'bottom-end',
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {positions.map((pos) => (
          <Button
            key={pos}
            variant={position === pos ? 'primary' : 'outline-primary'}
            size="sm"
            onClick={() => setPosition(pos)}
          >
            {pos}
          </Button>
        ))}
      </div>
      <ToastProvider position={position}>
        <PositionToastContent position={position} />
      </ToastProvider>
    </div>
  );
}

function PositionToastContent({ position }: { position: ToastPosition }): JSX.Element {
  const toast = useToast();

  return <Button onClick={() => toast.success(`Toast at ${position}`)}>Show Toast</Button>;
}

// Helper component for queue management
function QueueManagementDemo(): JSX.Element {
  const toast = useToast();

  const addMultiple = (): void => {
    toast.success('First notification');
    toast.info('Second notification');
    toast.warning('Third notification');
    toast.error('Fourth notification');
  };

  return (
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      <Button onClick={addMultiple}>Add 4 Toasts</Button>
      <Button variant="outline-secondary" onClick={() => toast.dismissAll()}>
        Dismiss All
      </Button>
    </div>
  );
}

// Helper component for accessibility demo
function AccessibilityDemo(): JSX.Element {
  const toast = useToast();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <Button
          variant="danger"
          onClick={() => toast.error('Critical error occurred!', { title: 'Error' })}
        >
          Error (assertive)
        </Button>
        <Button
          variant="success"
          onClick={() => toast.success('Operation completed!', { title: 'Success' })}
        >
          Success (polite)
        </Button>
      </div>
      <p style={{ fontSize: '0.875rem', color: '#666' }}>
        Error toasts use <code>aria-live=&quot;assertive&quot;</code> for immediate announcement.
        Success toasts use <code>aria-live=&quot;polite&quot;</code> to wait for opportune moment.
      </p>
    </div>
  );
}

const meta: Meta<typeof Toast> = {
  title: 'Components/Toast',
  component: Toast,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Toast notification component for displaying brief, non-blocking messages. ' +
          'Supports multiple variants, auto-dismiss, queue management via ToastProvider, ' +
          'and full accessibility with ARIA live regions.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'success', 'error', 'warning', 'info'],
      description: 'Toast color variant',
      table: {
        type: { summary: 'ToastVariant' },
        defaultValue: { summary: 'default' },
      },
    },
    message: {
      control: 'text',
      description: 'Toast message content',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    title: {
      control: 'text',
      description: 'Optional toast title',
      table: {
        type: { summary: 'string' },
      },
    },
    show: {
      control: 'boolean',
      description: 'Control toast visibility',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    dismissible: {
      control: 'boolean',
      description: 'Whether the toast can be dismissed',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    duration: {
      control: 'number',
      description: 'Auto-dismiss after milliseconds (false to disable)',
      table: {
        type: { summary: 'number | false' },
        defaultValue: { summary: '5000' },
      },
    },
    showProgress: {
      control: 'boolean',
      description: 'Show countdown progress bar',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default toast
 */
export const Default: Story = {
  args: {
    message: 'This is a default toast notification.',
  },
};

/**
 * Success toast
 */
export const Success: Story = {
  args: {
    variant: 'success',
    message: 'Your changes have been saved successfully!',
  },
};

/**
 * Error toast
 */
export const ErrorToast: Story = {
  args: {
    variant: 'error',
    message: 'An error occurred. Please try again.',
  },
};

/**
 * Warning toast
 */
export const Warning: Story = {
  args: {
    variant: 'warning',
    message: 'Please review your input before continuing.',
  },
};

/**
 * Info toast
 */
export const Info: Story = {
  args: {
    variant: 'info',
    message: 'Here is some helpful information for you.',
  },
};

// =============================================================================
// With Title
// =============================================================================

/**
 * Toast with title
 */
export const WithTitle: Story = {
  args: {
    variant: 'success',
    title: 'Success',
    message: 'Your file has been uploaded successfully.',
  },
};

// =============================================================================
// Custom Icon
// =============================================================================

/**
 * Toast with custom icon
 */
export const WithCustomIcon: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Toast variant="success" message="Custom success icon" icon={<CheckCircleFillIcon />} />
      <Toast variant="error" message="Custom error icon" icon={<XCircleFillIcon />} />
      <Toast
        variant="warning"
        message="Custom warning icon"
        icon={<ExclamationTriangleFillIcon />}
      />
      <Toast variant="info" message="Custom info icon" icon={<InfoCircleFillIcon />} />
    </div>
  ),
};

// =============================================================================
// Non-dismissible
// =============================================================================

/**
 * Toast without close button
 */
export const NonDismissible: Story = {
  args: {
    variant: 'info',
    message: 'This toast cannot be dismissed manually.',
    dismissible: false,
    duration: false,
  },
};

// =============================================================================
// Progress Bar
// =============================================================================

/**
 * Toast with progress bar
 */
export const WithProgress: Story = {
  args: {
    variant: 'info',
    message: 'Processing your request...',
    showProgress: true,
    duration: 5000,
  },
};

// =============================================================================
// ToastProvider and Hook
// =============================================================================

/**
 * Using ToastProvider and useToast hook
 */
export const WithProvider: Story = {
  render: () => (
    <ToastProvider position="top-end">
      <ToastHookDemo />
    </ToastProvider>
  ),
};

/**
 * Toast with title via hook
 */
export const HookWithTitle: Story = {
  render: () => (
    <ToastProvider position="top-end">
      <ToastWithTitleDemo />
    </ToastProvider>
  ),
};

/**
 * Persistent toast (no auto-dismiss)
 */
export const PersistentToast: Story = {
  render: () => (
    <ToastProvider position="top-end">
      <PersistentToastDemo />
    </ToastProvider>
  ),
};

/**
 * Toast with progress bar via hook
 */
export const ProgressViaHook: Story = {
  render: () => (
    <ToastProvider position="top-end">
      <ProgressToastDemo />
    </ToastProvider>
  ),
};

/**
 * Updating toast content
 */
export const UpdatingToast: Story = {
  render: () => (
    <ToastProvider position="top-end">
      <UpdatingToastDemo />
    </ToastProvider>
  ),
};

// =============================================================================
// Positioning
// =============================================================================

/**
 * All toast positions
 */
export const AllPositions: Story = {
  render: () => <AllPositionsDemo />,
};

/**
 * Toast container with multiple toasts
 */
export const MultipleToasts: Story = {
  render: () => (
    <ToastContainer position="bottom-end" data-testid="toast-container">
      <Toast variant="success" message="First notification" />
      <Toast variant="info" message="Second notification" />
      <Toast variant="warning" message="Third notification" />
    </ToastContainer>
  ),
};

// =============================================================================
// Queue Management
// =============================================================================

/**
 * Queue management with maxToasts
 */
export const QueueManagement: Story = {
  render: () => (
    <ToastProvider position="top-end" maxToasts={3}>
      <QueueManagementDemo />
      <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#666' }}>
        Maximum 3 toasts shown at once. Oldest will be removed when exceeding limit.
      </p>
    </ToastProvider>
  ),
};

// =============================================================================
// Accessibility
// =============================================================================

/**
 * Accessibility features
 */
export const AccessibilityFeatures: Story = {
  render: () => (
    <ToastProvider position="top-end">
      <AccessibilityDemo />
    </ToastProvider>
  ),
};

/**
 * ARIA roles and live regions
 */
export const AriaRoles: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Toast variant="error" message="Error: role='alert', aria-live='assertive'" />
      <Toast variant="warning" message="Warning: role='alert', aria-live='assertive'" />
      <Toast variant="success" message="Success: role='status', aria-live='polite'" />
      <Toast variant="info" message="Info: role='status', aria-live='polite'" />
    </div>
  ),
};

// =============================================================================
// Use Cases
// =============================================================================

/**
 * Form submission feedback
 */
export const FormSubmission: Story = {
  render: function FormSubmissionRender() {
    const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
    const [submitCount, setSubmitCount] = useState(0);

    const handleSubmit = async (): Promise<void> => {
      setStatus('saving');
      setSubmitCount((c) => c + 1);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      // Demo: alternate between success and error to show both states
      setStatus(submitCount % 3 === 2 ? 'error' : 'saved');
      setTimeout(() => setStatus('idle'), 3000);
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Button onClick={handleSubmit} disabled={status === 'saving'}>
          {status === 'saving' ? 'Saving...' : 'Submit Form'}
        </Button>

        {status === 'saved' && <Toast variant="success" message="Form submitted successfully!" />}
        {status === 'error' && (
          <Toast variant="error" message="Failed to submit form. Please try again." />
        )}
      </div>
    );
  },
};

/**
 * File upload progress
 */
export const FileUpload: Story = {
  render: function FileUploadRender() {
    const [uploading, setUploading] = useState(false);
    const [complete, setComplete] = useState(false);

    const handleUpload = async (): Promise<void> => {
      setUploading(true);
      setComplete(false);
      await new Promise((resolve) => setTimeout(resolve, 3000));
      setUploading(false);
      setComplete(true);
      setTimeout(() => setComplete(false), 4000);
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Button onClick={handleUpload} disabled={uploading}>
          {uploading ? 'Uploading...' : 'Upload File'}
        </Button>

        {uploading && (
          <Toast
            variant="info"
            message="Uploading file..."
            showProgress
            duration={3000}
            dismissible={false}
          />
        )}
        {complete && (
          <Toast
            variant="success"
            title="Upload Complete"
            message="Your file has been uploaded successfully."
          />
        )}
      </div>
    );
  },
};

// =============================================================================
// Showcase
// =============================================================================

/**
 * All variants showcase
 */
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <Toast variant="default" message="Default toast notification" />
      <Toast variant="success" message="Success toast notification" />
      <Toast variant="error" message="Error toast notification" />
      <Toast variant="warning" message="Warning toast notification" />
      <Toast variant="info" message="Info toast notification" />
    </div>
  ),
};

/**
 * Complete toast showcase
 */
export const CompleteShowcase: Story = {
  render: function CompleteShowcaseRender() {
    return (
      <ToastProvider position="top-end">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Basic Variants */}
          <section>
            <Heading level={4} style={{ marginBottom: '0.5rem' }}>
              Basic Variants
            </Heading>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Toast variant="success" message="Success notification" />
              <Toast variant="error" message="Error notification" />
              <Toast variant="warning" message="Warning notification" />
              <Toast variant="info" message="Info notification" />
            </div>
          </section>

          {/* With Title */}
          <section>
            <Heading level={4} style={{ marginBottom: '0.5rem' }}>
              With Title
            </Heading>
            <Toast variant="success" title="Success" message="Your changes have been saved." />
          </section>

          {/* With Progress */}
          <section>
            <Heading level={4} style={{ marginBottom: '0.5rem' }}>
              With Progress Bar
            </Heading>
            <Toast variant="info" message="Processing..." showProgress duration={5000} />
          </section>

          {/* Interactive Demo */}
          <section>
            <Heading level={4} style={{ marginBottom: '0.5rem' }}>
              Interactive Demo
            </Heading>
            <ToastHookDemo />
          </section>
        </div>
      </ToastProvider>
    );
  },
};
