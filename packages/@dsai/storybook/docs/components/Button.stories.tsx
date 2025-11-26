import { Button } from '@dsai/react';
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

/**
 * Button component provides a versatile, accessible button with multiple variants and sizes.
 * Built with Bootstrap 5 design tokens and full WCAG 2.2 AA compliance with security hardening.
 *
 * Features:
 * - 17 button variants with Bootstrap 5 theming
 * - Loading states with spinner integration
 * - Icon support (start and end icons)
 * - Dynamic state announcements via aria-live
 * - Whitelist-based prop spreading for security
 * - Full WCAG 2.2 AA accessibility compliance
 */

// Helper component for loading variants showcase
const LoadingVariantsShowcase = () => (
  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
    <Button variant="primary" loading>
      Saving
    </Button>
    <Button variant="success" loading>
      Processing
    </Button>
    <Button variant="danger" loading>
      Deleting
    </Button>
    <Button variant="warning" loading>
      Loading
    </Button>
  </div>
);

// Helper component for icons showcase
const IconsShowcase = () => (
  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
    <Button variant="primary" startIcon="⬅">
      Previous
    </Button>
    <Button variant="primary" endIcon="➡">
      Next
    </Button>
    <Button variant="primary" startIcon="✓" endIcon="→">
      Confirm & Continue
    </Button>
    <Button variant="outline-secondary" aria-label="Close dialog">
      ×
    </Button>
  </div>
);

// Helper component for single announcement demo
const AnnouncementDemo = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Button
        variant="primary"
        loading={isLoading}
        loadingText="Saving..."
        announceText={isLoading ? 'Saving your changes' : 'Changes saved successfully'}
        announce={true}
        onClick={handleClick}
        disabled={isLoading}
      >
        {isLoading ? 'Saving...' : 'Save Changes'}
      </Button>
      <p style={{ fontSize: '0.875rem', color: '#666' }}>
        Click the button and watch the screen reader announcement region
      </p>
    </div>
  );
};

// Helper component for multi-state announcement demo
const MultiStateAnnouncementDemo = () => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSave = async () => {
    setStatus('loading');
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setStatus('success');
    setTimeout(() => setStatus('idle'), 3000);
  };

  const handleDelete = async () => {
    setStatus('loading');
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setStatus('error');
    setTimeout(() => setStatus('idle'), 3000);
  };

  const announceText = {
    idle: '',
    loading: 'Operation in progress...',
    success: '✓ Operation completed successfully',
    error: '⚠ Operation failed. Please try again.',
  };

  return (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <Button
        variant="success"
        loading={status === 'loading'}
        announceText={announceText[status]}
        announce={true}
        onClick={handleSave}
        disabled={status === 'loading'}
      >
        {status === 'loading' ? 'Saving...' : status === 'success' ? '✓ Saved' : 'Save'}
      </Button>
      <Button
        variant="danger"
        loading={status === 'loading'}
        announceText={announceText[status]}
        announce={true}
        onClick={handleDelete}
        disabled={status === 'loading'}
      >
        {status === 'loading' ? 'Deleting...' : status === 'error' ? '✗ Failed' : 'Delete'}
      </Button>
    </div>
  );
};

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A versatile button component with multiple variants, sizes, and states. ' +
          'Fully accessible (WCAG 2.2 AA compliant) with keyboard navigation, focus management, ' +
          'and proper color contrast ratios. Uses design tokens for consistent theming.',
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#1a1a1a' },
        { name: 'gray', value: '#f5f5f5' },
      ],
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'primary',
        'secondary',
        'success',
        'danger',
        'warning',
        'info',
        'light',
        'dark',
        'outline-primary',
        'outline-secondary',
        'outline-success',
        'outline-danger',
        'outline-warning',
        'outline-info',
        'outline-light',
        'outline-dark',
        'link',
      ],
      description: 'Button visual style variant',
      table: {
        type: { summary: 'ButtonVariant' },
        defaultValue: { summary: 'primary' },
      },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Button size',
      table: {
        type: { summary: 'ButtonSize' },
        defaultValue: { summary: 'md' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state - prevents user interaction',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    fullWidth: {
      control: 'boolean',
      description: 'Makes button 100% width',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    type: {
      control: 'select',
      options: ['button', 'submit', 'reset'],
      description: 'Button HTML type attribute',
      table: {
        type: { summary: 'ButtonType' },
        defaultValue: { summary: 'button' },
      },
    },
    onClick: {
      action: 'clicked',
      description: 'Click event handler',
      table: {
        type: { summary: '(event: MouseEvent) => void' },
      },
    },
    children: {
      control: 'text',
      description: 'Button content',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    loading: {
      control: 'boolean',
      description: 'Loading state - shows spinner and disables button',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    loadingText: {
      control: 'text',
      description: 'Text to show while loading (replaces children)',
      table: {
        type: { summary: 'string' },
      },
    },
    startIcon: {
      control: false,
      description: 'Icon to display before button text (decorative, aria-hidden)',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    endIcon: {
      control: false,
      description: 'Icon to display after button text (decorative, aria-hidden)',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    announceText: {
      control: 'text',
      description: 'Announcement text for screen readers (aria-live="polite")',
      table: {
        type: { summary: 'string' },
      },
    },
    announce: {
      control: 'boolean',
      description: 'Enable/disable announcements',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true (when announceText provided)' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Primary button - use for main actions and call-to-action buttons
 */
export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Button',
  },
};

/**
 * Secondary button - use for secondary actions
 */
export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Button',
  },
};

/**
 * Success button - use for positive actions (e.g., "Save", "Confirm")
 */
export const Success: Story = {
  args: {
    variant: 'success',
    children: 'Success Button',
  },
};

/**
 * Danger button - use for destructive actions (e.g., "Delete", "Remove")
 */
export const Danger: Story = {
  args: {
    variant: 'danger',
    children: 'Danger Button',
  },
};

/**
 * Warning button - use for actions that require caution
 */
export const Warning: Story = {
  args: {
    variant: 'warning',
    children: 'Warning Button',
  },
};

/**
 * Info button - use for informational actions
 */
export const Info: Story = {
  args: {
    variant: 'info',
    children: 'Info Button',
  },
};

/**
 * Light button - use on dark backgrounds
 */
export const Light: Story = {
  args: {
    variant: 'light',
    children: 'Light Button',
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

/**
 * Dark button - use on light backgrounds
 */
export const Dark: Story = {
  args: {
    variant: 'dark',
    children: 'Dark Button',
  },
};

/**
 * Outline buttons - lighter weight variants
 */
export const OutlinePrimary: Story = {
  args: {
    variant: 'outline-primary',
    children: 'Outline Primary',
  },
};

export const OutlineSecondary: Story = {
  args: {
    variant: 'outline-secondary',
    children: 'Outline Secondary',
  },
};

export const OutlineSuccess: Story = {
  args: {
    variant: 'outline-success',
    children: 'Outline Success',
  },
};

export const OutlineDanger: Story = {
  args: {
    variant: 'outline-danger',
    children: 'Outline Danger',
  },
};

/**
 * Link button - styled as a link but behaves as a button
 */
export const Link: Story = {
  args: {
    variant: 'link',
    children: 'Link Button',
  },
};

/**
 * Button sizes
 */
export const SmallSize: Story = {
  args: {
    size: 'sm',
    children: 'Small Button',
  },
};

export const MediumSize: Story = {
  args: {
    size: 'md',
    children: 'Medium Button (Default)',
  },
};

export const LargeSize: Story = {
  args: {
    size: 'lg',
    children: 'Large Button',
  },
};

/**
 * Disabled state - prevents user interaction
 */
export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled Button',
    // Won't fire
  },
};

export const DisabledPrimary: Story = {
  args: {
    variant: 'primary',
    disabled: true,
    children: 'Disabled Primary',
  },
};

export const DisabledOutline: Story = {
  args: {
    variant: 'outline-primary',
    disabled: true,
    children: 'Disabled Outline',
  },
};

/**
 * Full width button
 */
export const FullWidth: Story = {
  args: {
    variant: 'primary',
    fullWidth: true,
    children: 'Full Width Button',
  },
  parameters: {
    layout: 'padded',
  },
};

/**
 * Button types for forms
 */
export const SubmitButton: Story = {
  args: {
    type: 'submit',
    variant: 'success',
    children: 'Submit Form',
  },
};

export const ResetButton: Story = {
  args: {
    type: 'reset',
    variant: 'secondary',
    children: 'Reset Form',
  },
};

/**
 * Buttons with icons (example using emoji)
 */
export const WithIconLeft: Story = {
  args: {
    variant: 'primary',
    children: <>✓ Save Changes</>,
  },
};

export const WithIconRight: Story = {
  args: {
    variant: 'primary',
    children: <>Next →</>,
  },
};

export const IconOnly: Story = {
  args: {
    variant: 'primary',
    children: '×',
    'aria-label': 'Close',
  },
};

/**
 * Accessibility examples
 */
export const WithAriaLabel: Story = {
  args: {
    variant: 'primary',
    children: '×',
    'aria-label': 'Close dialog',
  },
};

export const WithAriaExpanded: Story = {
  args: {
    variant: 'secondary',
    children: 'Toggle Menu ▼',
    'aria-expanded': false,
    'aria-controls': 'menu',
  },
};

export const WithAriaPressed: Story = {
  args: {
    variant: 'outline-primary',
    children: 'Toggle Option',
    'aria-pressed': false,
  },
};

/**
 * All variants showcase
 */
export const AllVariants: Story = {
  render: () => (
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start' }}
    >
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="success">Success</Button>
        <Button variant="danger">Danger</Button>
        <Button variant="warning">Warning</Button>
        <Button variant="info">Info</Button>
        <Button variant="light">Light</Button>
        <Button variant="dark">Dark</Button>
      </div>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <Button variant="outline-primary">Outline Primary</Button>
        <Button variant="outline-secondary">Outline Secondary</Button>
        <Button variant="outline-success">Outline Success</Button>
        <Button variant="outline-danger">Outline Danger</Button>
      </div>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <Button variant="link">Link</Button>
        <Button variant="primary" disabled>
          Disabled
        </Button>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

/**
 * Loading states showcase
 */
export const Loading: Story = {
  args: {
    variant: 'primary',
    children: 'Saving...',
    loading: true,
  },
};

export const LoadingWithText: Story = {
  args: {
    variant: 'primary',
    children: 'Save Changes',
    loading: true,
    loadingText: 'Saving your changes...',
  },
};

export const LoadingDifferentVariants: Story = {
  render: () => <LoadingVariantsShowcase />,
};

/**
 * Icon support with new props
 */
export const WithStartIcon: Story = {
  args: {
    variant: 'primary',
    startIcon: '⬅',
    children: 'Previous',
  },
};

export const WithEndIcon: Story = {
  args: {
    variant: 'primary',
    endIcon: '➡',
    children: 'Next',
  },
};

export const WithBothIcons: Story = {
  args: {
    variant: 'primary',
    startIcon: '✓',
    endIcon: '→',
    children: 'Confirm & Continue',
  },
};

export const IconOnlyButton: Story = {
  args: {
    variant: 'outline-secondary',
    children: '×',
    'aria-label': 'Close dialog',
  },
};

export const AllIconsShowcase: Story = {
  render: () => <IconsShowcase />,
};

/**
 * Aria-live announcements for dynamic state changes
 */
export const WithAnnouncement: Story = {
  render: () => <AnnouncementDemo />,
};

export const AnnounceDifferentStates: Story = {
  render: () => <MultiStateAnnouncementDemo />,
};

/**
 * All sizes showcase
 */
export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <Button variant="primary" size="sm">
        Small
      </Button>
      <Button variant="primary" size="md">
        Medium
      </Button>
      <Button variant="primary" size="lg">
        Large
      </Button>
    </div>
  ),
};

/**
 * FSM Visual States Showcase
 *
 * The Button component uses a Finite State Machine (FSM) to manage visual states.
 * These stories demonstrate the FSM behavior and state transitions.
 *
 * FSM States:
 * - idle: default state, no interaction
 * - hovered: mouse over the button (auto via CSS :hover)
 * - focused: keyboard focus (auto via CSS :focus-visible)
 * - pressed: mouse down state
 * - disabled: disabled prop = true (prop-driven)
 * - loading: loading prop = true (prop-driven)
 * - error: error prop = true (prop-driven)
 */

/**
 * Error State - New FSM capability
 * Demonstrates the error visual state (red tint, alert styling)
 */
export const ErrorState: Story = {
  args: {
    variant: 'danger',
    children: 'Error State',
    error: true,
  },
};

export const ErrorWithRecovery: Story = {
  render: () => {
    const [hasError, setHasError] = useState(false);

    const handleClick = async () => {
      setHasError(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setHasError(false);
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Button variant="primary" error={hasError} onClick={handleClick} disabled={hasError}>
          {hasError ? 'Error - Retry' : 'Click Me'}
        </Button>
        <p style={{ fontSize: '0.875rem', color: '#666' }}>
          Click the button to trigger error state. After 2 seconds, error clears automatically.
        </p>
      </div>
    );
  },
};

/**
 * FSM State Priority Demonstration
 *
 * Shows how FSM handles state precedence:
 * disabled > loading > error > interactive states
 */
export const FSMStatePriority: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h3 style={{ fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
          Idle State (default)
        </h3>
        <Button variant="primary">Idle State</Button>
      </div>

      <div>
        <h3 style={{ fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
          Loading State (prop-driven)
        </h3>
        <Button variant="primary" loading>
          Loading...
        </Button>
        <p style={{ fontSize: '0.75rem', color: '#666', marginTop: '0.5rem' }}>
          Loading overrides interactive states. FSM ignores hover/press/focus events.
        </p>
      </div>

      <div>
        <h3 style={{ fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
          Error State (prop-driven)
        </h3>
        <Button variant="danger" error>
          Error Occurred
        </Button>
        <p style={{ fontSize: '0.75rem', color: '#666', marginTop: '0.5rem' }}>
          Error state visually indicates a problem. FSM prevents interaction.
        </p>
      </div>

      <div>
        <h3 style={{ fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
          Disabled State (highest priority)
        </h3>
        <Button variant="primary" disabled>
          Disabled State
        </Button>
        <p style={{ fontSize: '0.75rem', color: '#666', marginTop: '0.5rem' }}>
          Disabled takes precedence over all other states. No interaction possible.
        </p>
      </div>

      <div>
        <h3 style={{ fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
          Disabled Loading (disabled wins)
        </h3>
        <Button variant="primary" disabled loading>
          Disabled & Loading
        </Button>
        <p style={{ fontSize: '0.75rem', color: '#666', marginTop: '0.5rem' }}>
          When both disabled and loading, disabled takes precedence (FSM priority rule).
        </p>
      </div>
    </div>
  ),
};

/**
 * FSM Interactive States with Focus/Hover
 *
 * Demonstrates FSM state transitions during user interaction.
 * Try hovering, focusing, or pressing the button to see state changes
 * reflected in the data-visual-state attribute.
 */
export const FSMInteractiveStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h3 style={{ fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
          Interactive States Demo
        </h3>
        <p style={{ fontSize: '0.75rem', color: '#666', marginBottom: '1rem' }}>
          Try these interactions and observe the button behavior:
        </p>
        <ul
          style={{
            fontSize: '0.75rem',
            color: '#666',
            marginBottom: '1rem',
            paddingLeft: '1.5rem',
          }}
        >
          <li>Hover over the button → hovered state</li>
          <li>Focus with keyboard (Tab) → focused state</li>
          <li>Press mouse down → pressed state</li>
          <li>Release → returns to previous state (idle, hovered, or focused)</li>
          <li>Blur (click away) → idle state</li>
        </ul>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        <Button variant="primary">Primary Button</Button>
        <Button variant="success">Success Button</Button>
        <Button variant="outline-secondary">Outline Button</Button>
      </div>

      <div>
        <p style={{ fontSize: '0.75rem', color: '#666', marginTop: '1rem' }}>
          <strong>FSM State Tracking:</strong> The button element includes a{' '}
          <code>data-visual-state</code> attribute that changes as you interact with it. Open
          browser DevTools Inspector to see the attribute updates in real-time.
        </p>
      </div>
    </div>
  ),
};

/**
 * FSM State Transitions Under Async Operations
 *
 * Shows realistic use case: button transitions between idle → loading → error/success
 */
export const FSMAsyncOperations: Story = {
  render: () => {
    const [states, setStates] = useState<Record<string, { isLoading: boolean; isError: boolean }>>({
      success: { isLoading: false, isError: false },
      failure: { isLoading: false, isError: false },
      mixed: { isLoading: false, isError: false },
    });

    const handleAsyncOperation = async (key: string, shouldFail: boolean) => {
      setStates((prev) => ({
        ...prev,
        [key]: { isLoading: true, isError: false },
      }));

      await new Promise((resolve) => setTimeout(resolve, 2000));

      setStates((prev) => ({
        ...prev,
        [key]: { isLoading: false, isError: shouldFail },
      }));

      setTimeout(() => {
        setStates((prev) => ({
          ...prev,
          [key]: { isLoading: false, isError: false },
        }));
      }, 2000);
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            Successful Operation
          </h3>
          <Button
            variant="success"
            loading={states.success.isLoading}
            onClick={() => handleAsyncOperation('success', false)}
          >
            {states.success.isLoading ? 'Processing...' : 'Save Successfully'}
          </Button>
        </div>

        <div>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            Failed Operation
          </h3>
          <Button
            variant="danger"
            error={states.failure.isError}
            loading={states.failure.isLoading}
            onClick={() => handleAsyncOperation('failure', true)}
          >
            {states.failure.isLoading
              ? 'Processing...'
              : states.failure.isError
                ? 'Failed - Retry'
                : 'Delete Item'}
          </Button>
        </div>

        <div>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            Confirm Action Flow
          </h3>
          <Button
            variant="warning"
            loading={states.mixed.isLoading}
            error={states.mixed.isError}
            onClick={() => handleAsyncOperation('mixed', false)}
          >
            {states.mixed.isLoading ? 'Processing...' : 'Confirm Action'}
          </Button>
        </div>

        <div style={{ backgroundColor: '#f5f5f5', padding: '1rem', borderRadius: '4px' }}>
          <p style={{ fontSize: '0.75rem', color: '#666', margin: 0 }}>
            <strong>FSM Transition Flow:</strong>
          </p>
          <p style={{ fontSize: '0.75rem', color: '#666', margin: '0.5rem 0 0 0' }}>
            idle → loading → (success: idle) or (error: error state)
          </p>
          <p style={{ fontSize: '0.75rem', color: '#666', margin: '0.5rem 0 0 0' }}>
            Each button manages its own FSM state independently.
          </p>
        </div>
      </div>
    );
  },
};
