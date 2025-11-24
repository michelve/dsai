import { Button } from './Button';

import type { Meta, StoryObj } from '@storybook/react-vite';

/**
 * Button component provides a versatile, accessible button with multiple variants and sizes.
 * Built with Bootstrap 5 design tokens and full WCAG 2.2 AA compliance.
 *
 * Features:
 * - 17 variants (solid, outline, link)
 * - 3 sizes (sm, md, lg)
 * - Loading state with spinner
 * - Icon support (start and end)
 * - Full width option
 * - Keyboard accessible
 * - ARIA attributes for accessibility
 */
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
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// =============================================================================
// Basic Variants
// =============================================================================

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

// =============================================================================
// Outline Variants
// =============================================================================

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

// =============================================================================
// Sizes
// =============================================================================

/**
 * Small button
 */
export const SmallSize: Story = {
  args: {
    size: 'sm',
    children: 'Small Button',
  },
};

/**
 * Medium button (default)
 */
export const MediumSize: Story = {
  args: {
    size: 'md',
    children: 'Medium Button (Default)',
  },
};

/**
 * Large button
 */
export const LargeSize: Story = {
  args: {
    size: 'lg',
    children: 'Large Button',
  },
};

// =============================================================================
// States
// =============================================================================

/**
 * Disabled state - prevents user interaction
 */
export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled Button',
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

// =============================================================================
// Loading State
// =============================================================================

/**
 * Loading state - shows spinner and disables button
 */
export const Loading: Story = {
  args: {
    loading: true,
    children: 'Loading...',
  },
};

/**
 * Loading with custom text
 */
export const LoadingWithText: Story = {
  args: {
    loading: true,
    loadingText: 'Saving...',
    children: 'Save',
  },
};

/**
 * Loading in different variants
 */
export const LoadingVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <Button variant="primary" loading>
        Primary
      </Button>
      <Button variant="secondary" loading>
        Secondary
      </Button>
      <Button variant="success" loading loadingText="Saving...">
        Save
      </Button>
      <Button variant="danger" loading loadingText="Deleting...">
        Delete
      </Button>
      <Button variant="outline-primary" loading>
        Outline
      </Button>
    </div>
  ),
};

/**
 * Loading in different sizes
 */
export const LoadingSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <Button size="sm" loading>
        Small
      </Button>
      <Button size="md" loading>
        Medium
      </Button>
      <Button size="lg" loading>
        Large
      </Button>
    </div>
  ),
};

// =============================================================================
// Icons
// =============================================================================

/**
 * Button with start icon
 */
export const WithStartIcon: Story = {
  args: {
    variant: 'primary',
    startIcon: <span>✓</span>,
    children: 'Save Changes',
  },
};

/**
 * Button with end icon
 */
export const WithEndIcon: Story = {
  args: {
    variant: 'primary',
    endIcon: <span>→</span>,
    children: 'Next',
  },
};

/**
 * Button with both icons
 */
export const WithBothIcons: Story = {
  args: {
    variant: 'success',
    startIcon: <span>✓</span>,
    endIcon: <span>→</span>,
    children: 'Continue',
  },
};

/**
 * Icon-only button (requires aria-label)
 */
export const IconOnly: Story = {
  args: {
    variant: 'primary',
    children: '×',
    'aria-label': 'Close',
  },
};

/**
 * Various icon examples
 */
export const IconExamples: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <Button variant="primary" startIcon={<span>📁</span>}>
        Open File
      </Button>
      <Button variant="success" startIcon={<span>💾</span>}>
        Save
      </Button>
      <Button variant="danger" startIcon={<span>🗑️</span>}>
        Delete
      </Button>
      <Button variant="secondary" endIcon={<span>↓</span>}>
        Download
      </Button>
      <Button variant="info" startIcon={<span>ℹ️</span>}>
        Info
      </Button>
    </div>
  ),
};

// =============================================================================
// Full Width
// =============================================================================

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
 * Full width with loading
 */
export const FullWidthLoading: Story = {
  args: {
    variant: 'primary',
    fullWidth: true,
    loading: true,
    loadingText: 'Processing...',
    children: 'Submit',
  },
  parameters: {
    layout: 'padded',
  },
};

// =============================================================================
// Button Types
// =============================================================================

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

// =============================================================================
// Accessibility
// =============================================================================

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

// =============================================================================
// Showcases
// =============================================================================

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
 * Complete button showcase
 */
export const CompleteShowcase: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Variants */}
      <div>
        <h4 style={{ marginBottom: '0.5rem' }}>Variants</h4>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="success">Success</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="warning">Warning</Button>
          <Button variant="info">Info</Button>
        </div>
      </div>

      {/* Outline */}
      <div>
        <h4 style={{ marginBottom: '0.5rem' }}>Outline Variants</h4>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <Button variant="outline-primary">Primary</Button>
          <Button variant="outline-secondary">Secondary</Button>
          <Button variant="outline-success">Success</Button>
          <Button variant="outline-danger">Danger</Button>
        </div>
      </div>

      {/* Sizes */}
      <div>
        <h4 style={{ marginBottom: '0.5rem' }}>Sizes</h4>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </div>
      </div>

      {/* States */}
      <div>
        <h4 style={{ marginBottom: '0.5rem' }}>States</h4>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <Button>Default</Button>
          <Button disabled>Disabled</Button>
          <Button loading>Loading</Button>
          <Button loading loadingText="Saving...">
            Save
          </Button>
        </div>
      </div>

      {/* Icons */}
      <div>
        <h4 style={{ marginBottom: '0.5rem' }}>With Icons</h4>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <Button startIcon={<span>✓</span>}>Save</Button>
          <Button endIcon={<span>→</span>}>Next</Button>
          <Button startIcon={<span>✓</span>} endIcon={<span>→</span>}>
            Continue
          </Button>
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};
