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
