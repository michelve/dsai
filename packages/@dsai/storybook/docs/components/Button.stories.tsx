import {
  ArrowLeftIcon,
  ArrowRightIcon,
  Button,
  CheckIcon,
  ChevronDownIcon,
  ExclamationTriangleIcon,
  GearIcon,
  PlusIcon,
  SaveIcon,
  Trash3Icon,
  XLgIcon,
} from '@dsai/react';
import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react';
import type { JSX } from 'react';

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
 * - FSM-driven visual state management
 *
 * Test Coverage: 151 tests across 4 test files
 * - Button.test.tsx: Core unit tests (85 tests)
 * - Button.a11y.test.tsx: Accessibility tests (24 tests)
 * - Button.fsm.test.ts: FSM reducer tests (36 tests)
 * - Button.integration.test.tsx: Integration tests (6 tests)
 */

type AnnouncementStatus = 'idle' | 'loading' | 'success' | 'error';

const getAnnouncementMessage = (state: AnnouncementStatus): string => {
  switch (state) {
    case 'loading':
      return 'Operation in progress...';
    case 'success':
      return 'Operation completed successfully';
    case 'error':
      return 'Operation failed. Please try again.';
    case 'idle':
    default:
      return '';
  }
};

// Helper component for loading variants showcase
const LoadingVariantsShowcase = (): JSX.Element => (
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
const IconsShowcase = (): JSX.Element => (
  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
    <Button variant="primary" startIcon={<ArrowLeftIcon />}>
      Previous
    </Button>
    <Button variant="primary" endIcon={<ArrowRightIcon />}>
      Next
    </Button>
    <Button variant="primary" startIcon={<CheckIcon />} endIcon={<ArrowRightIcon />}>
      Confirm & Continue
    </Button>
    <Button variant="outline-secondary" aria-label="Close dialog">
      <XLgIcon />
    </Button>
  </div>
);

// Helper component for single announcement demo
const AnnouncementDemo = (): JSX.Element => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = (): void => {
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
        announce
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
const MultiStateAnnouncementDemo = (): JSX.Element => {
  const [status, setStatus] = useState<AnnouncementStatus>('idle');

  const handleSave = async (): Promise<void> => {
    setStatus('loading');
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setStatus('success');
    setTimeout(() => setStatus('idle'), 3000);
  };

  const handleDelete = async (): Promise<void> => {
    setStatus('loading');
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setStatus('error');
    setTimeout(() => setStatus('idle'), 3000);
  };

  const announceMessage = getAnnouncementMessage(status);

  return (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <Button
        variant="success"
        loading={status === 'loading'}
        announceText={announceMessage}
        announce
        onClick={handleSave}
        disabled={status === 'loading'}
      >
        {status === 'loading' ? (
          'Saving...'
        ) : status === 'success' ? (
          <>
            <CheckIcon size={14} /> Saved
          </>
        ) : (
          'Save'
        )}
      </Button>
      <Button
        variant="danger"
        loading={status === 'loading'}
        announceText={announceMessage}
        announce
        onClick={handleDelete}
        disabled={status === 'loading'}
      >
        {status === 'loading' ? (
          'Deleting...'
        ) : status === 'error' ? (
          <>
            <XLgIcon size={14} /> Failed
          </>
        ) : (
          'Delete'
        )}
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
          'and proper color contrast ratios. Uses design tokens for consistent theming. ' +
          '**Test Coverage:** 151 tests across 4 test files ensuring reliability and accessibility.',
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
  globals: {
    backgrounds: {
      value: 'dark',
    },
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
 * Buttons with icons
 */
export const WithIconLeft: Story = {
  args: {
    variant: 'primary',
    startIcon: <CheckIcon />,
    children: 'Save Changes',
  },
};

export const WithIconRight: Story = {
  args: {
    variant: 'primary',
    endIcon: <ArrowRightIcon />,
    children: 'Next',
  },
};

export const IconOnly: Story = {
  args: {
    variant: 'primary',
    startIcon: <XLgIcon />,
    children: '',
    'aria-label': 'Close',
  },
};

/**
 * Accessibility examples
 */
export const WithAriaLabel: Story = {
  args: {
    variant: 'primary',
    startIcon: <XLgIcon />,
    children: '',
    'aria-label': 'Close dialog',
  },
};

export const WithAriaExpanded: Story = {
  args: {
    variant: 'secondary',
    endIcon: <ChevronDownIcon />,
    children: 'Toggle Menu',
    'aria-expanded': 'false',
    'aria-controls': 'menu',
  },
};

export const WithAriaPressed: Story = {
  args: {
    variant: 'outline-primary',
    children: 'Toggle Option',
    'aria-pressed': 'false',
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
    startIcon: <ArrowLeftIcon />,
    children: 'Previous',
  },
};

export const WithEndIcon: Story = {
  args: {
    variant: 'primary',
    endIcon: <ArrowRightIcon />,
    children: 'Next',
  },
};

export const WithBothIcons: Story = {
  args: {
    variant: 'primary',
    startIcon: <CheckIcon />,
    endIcon: <ArrowRightIcon />,
    children: 'Confirm & Continue',
  },
};

export const IconOnlyButton: Story = {
  args: {
    variant: 'outline-secondary',
    startIcon: <XLgIcon />,
    children: '',
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

const ErrorWithRecoveryExample = (): JSX.Element => {
  const [hasError, setHasError] = useState(false);

  const handleClick = async (): Promise<void> => {
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
};

export const ErrorWithRecovery: Story = {
  render: () => <ErrorWithRecoveryExample />,
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
const FSMAsyncOperationsExample = (): JSX.Element => {
  const [states, setStates] = useState<Record<string, { isLoading: boolean; isError: boolean }>>({
    success: { isLoading: false, isError: false },
    failure: { isLoading: false, isError: false },
    mixed: { isLoading: false, isError: false },
  });

  const handleAsyncOperation = async (key: string, shouldFail: boolean): Promise<void> => {
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
};

export const FSMAsyncOperations: Story = {
  render: () => <FSMAsyncOperationsExample />,
};

/**
 * Accessibility Features Showcase
 *
 * The Button component is fully WCAG 2.2 AA compliant with comprehensive
 * accessibility features tested by 24 dedicated accessibility tests.
 *
 * Features demonstrated:
 * - Proper ARIA attributes (aria-label, aria-describedby, aria-controls, etc.)
 * - Keyboard navigation (Tab, Enter, Space)
 * - Screen reader support
 * - Icon-only button accessibility guards
 * - Focus visibility
 */

/**
 * Icon-only buttons MUST have aria-label for accessibility
 */
export const AccessibleIconOnlyButton: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h3 style={{ fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
          ✅ Accessible Icon-only Buttons
        </h3>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button variant="outline-secondary" aria-label="Close dialog" startIcon={<XLgIcon />}>
            {''}
          </Button>
          <Button variant="outline-primary" aria-label="Settings" startIcon={<GearIcon />}>
            {''}
          </Button>
          <Button variant="outline-danger" aria-label="Delete item" startIcon={<Trash3Icon />}>
            {''}
          </Button>
          <Button variant="outline-success" aria-label="Add item" startIcon={<PlusIcon />}>
            {''}
          </Button>
        </div>
        <p style={{ fontSize: '0.75rem', color: '#666', marginTop: '0.5rem' }}>
          Each icon-only button has an <code>aria-label</code> for screen readers.
        </p>
      </div>

      <div>
        <h3 style={{ fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
          ✅ Icon + Text (no aria-label needed)
        </h3>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button variant="primary" startIcon={<SaveIcon />}>
            Save
          </Button>
          <Button variant="success" startIcon={<CheckIcon />}>
            Confirm
          </Button>
          <Button variant="secondary" endIcon={<ArrowRightIcon />}>
            Next
          </Button>
        </div>
        <p style={{ fontSize: '0.75rem', color: '#666', marginTop: '0.5rem' }}>
          Buttons with visible text content automatically have accessible names.
        </p>
      </div>

      <div
        style={{
          backgroundColor: '#fff3cd',
          padding: '1rem',
          borderRadius: '4px',
          border: '1px solid #ffc107',
        }}
      >
        <p style={{ fontSize: '0.75rem', color: '#856404', margin: 0 }}>
          <strong>
            <ExclamationTriangleIcon size={14} style={{ marginRight: '4px' }} />
            Accessibility Note:
          </strong>{' '}
          Icon-only buttons without <code>aria-label</code> will fail WCAG 2.2 AA compliance. Our
          test suite includes guards that verify this requirement.
        </p>
      </div>
    </div>
  ),
};

/**
 * Keyboard Navigation Demo
 * Tests verify Enter, Space, Tab navigation work correctly
 */
export const KeyboardNavigationDemo: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h3 style={{ fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          Keyboard Navigation Test
        </h3>
        <p style={{ fontSize: '0.75rem', color: '#666', marginBottom: '1rem' }}>
          Use Tab to navigate between buttons. Press Enter or Space to activate.
        </p>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <Button variant="primary">First Button</Button>
          <Button variant="secondary">Second Button</Button>
          <Button variant="success" disabled>
            Disabled (Skip)
          </Button>
          <Button variant="info">Third Button</Button>
        </div>
      </div>

      <div
        style={{
          backgroundColor: '#d1ecf1',
          padding: '1rem',
          borderRadius: '4px',
          border: '1px solid #bee5eb',
        }}
      >
        <p style={{ fontSize: '0.75rem', color: '#0c5460', margin: 0 }}>
          <strong>Test Coverage:</strong> The Button.a11y.test.tsx file includes 6 keyboard
          interaction tests verifying:
        </p>
        <ul
          style={{
            fontSize: '0.75rem',
            color: '#0c5460',
            marginTop: '0.5rem',
            paddingLeft: '1rem',
          }}
        >
          <li>Enter key triggers onClick</li>
          <li>Space key triggers onClick</li>
          <li>Disabled buttons block keyboard interaction</li>
          <li>Loading buttons block keyboard interaction</li>
          <li>Tab navigation works between buttons</li>
          <li>Disabled buttons are not focusable via Tab</li>
        </ul>
      </div>
    </div>
  ),
};

/**
 * ARIA Attributes Demo
 * Shows all supported ARIA attributes for accessibility
 */
export const ARIAAttributesDemo: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h3 style={{ fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
          aria-expanded (Expandable)
        </h3>
        <Button
          variant="outline-secondary"
          aria-expanded="false"
          aria-controls="dropdown-menu"
          endIcon={<ChevronDownIcon />}
        >
          Dropdown Menu
        </Button>
      </div>

      <div>
        <h3 style={{ fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
          aria-pressed (Toggle)
        </h3>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button variant="outline-primary" aria-pressed="false">
            Off
          </Button>
          <Button variant="primary" aria-pressed="true">
            On
          </Button>
        </div>
      </div>

      <div>
        <h3 style={{ fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
          aria-describedby (Additional description)
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Button variant="danger" aria-label="Delete Account - This action cannot be undone">
            Delete Account
          </Button>
          <span style={{ fontSize: '0.75rem', color: '#dc3545' }}>
            This action cannot be undone.
          </span>
        </div>
      </div>

      <div
        style={{
          backgroundColor: '#e7f3e7',
          padding: '1rem',
          borderRadius: '4px',
          border: '1px solid #28a745',
        }}
      >
        <p style={{ fontSize: '0.75rem', color: '#155724', margin: 0 }}>
          <strong>✅ All ARIA attributes tested:</strong> aria-label, aria-describedby,
          aria-controls, aria-expanded, aria-pressed, aria-busy
        </p>
      </div>
    </div>
  ),
};
