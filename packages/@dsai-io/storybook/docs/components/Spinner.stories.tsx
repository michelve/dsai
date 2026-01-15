import { Button, Heading, Spinner } from '@dsai-io/react';

import type { Meta, StoryObj } from '@storybook/react-vite';

/**
 * Spinner component indicates loading state using Bootstrap 5 spinners.
 * Supports border and grow animations, multiple sizes, and color variants.
 *
 * @see https://getbootstrap.com/docs/5.3/components/spinners/
 */
const meta: Meta<typeof Spinner> = {
  title: 'Components/Spinner',
  component: Spinner,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A Bootstrap 5 spinner component for indicating loading states. ' +
          'Fully accessible with proper ARIA attributes and respects reduced motion preferences.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    animation: {
      control: 'select',
      options: ['border', 'grow'],
      description: 'Spinner animation type',
      table: {
        type: { summary: 'SpinnerAnimation' },
        defaultValue: { summary: 'border' },
      },
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Spinner size',
      table: {
        type: { summary: 'SpinnerSize' },
        defaultValue: { summary: 'md' },
      },
    },
    variant: {
      control: 'select',
      options: [
        undefined,
        'primary',
        'secondary',
        'success',
        'danger',
        'warning',
        'info',
        'light',
        'dark',
      ],
      description: 'Spinner color variant',
      table: {
        type: { summary: 'SpinnerVariant' },
        defaultValue: { summary: 'undefined' },
      },
    },
    label: {
      control: 'text',
      description: 'Accessible label for screen readers',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'Loading...' },
      },
    },
    centered: {
      control: 'boolean',
      description: 'Center the spinner in its container',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    as: {
      control: 'select',
      options: ['div', 'span'],
      description: 'Element to render as',
      table: {
        type: { summary: 'div | span' },
        defaultValue: { summary: 'div' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// =============================================================================
// Basic Examples
// =============================================================================

/**
 * Default border spinner
 */
export const Default: Story = {
  args: {},
};

/**
 * Border spinner - rotating border animation
 */
export const Border: Story = {
  args: {
    animation: 'border',
  },
};

/**
 * Growing spinner - pulsing animation
 */
export const Grow: Story = {
  args: {
    animation: 'grow',
  },
};

// =============================================================================
// Sizes
// =============================================================================

/**
 * All available sizes
 */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <Spinner size="xs" variant="primary" />
        <div className="small text-muted mt-1">xs (12px)</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Spinner size="sm" variant="primary" />
        <div className="small text-muted mt-1">sm (16px)</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Spinner size="md" variant="primary" />
        <div className="small text-muted mt-1">md (32px)</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Spinner size="lg" variant="primary" />
        <div className="small text-muted mt-1">lg (48px)</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Spinner size="xl" variant="primary" />
        <div className="small text-muted mt-1">xl (64px)</div>
      </div>
    </div>
  ),
};

/**
 * Extra small spinner
 */
export const ExtraSmall: Story = {
  args: {
    size: 'xs',
    variant: 'primary',
  },
};

/**
 * Small spinner - useful for buttons and inline loading
 */
export const Small: Story = {
  args: {
    size: 'sm',
  },
};

/**
 * Large spinner
 */
export const Large: Story = {
  args: {
    size: 'lg',
    variant: 'primary',
  },
};

/**
 * Extra large spinner
 */
export const ExtraLarge: Story = {
  args: {
    size: 'xl',
    variant: 'primary',
  },
};

/**
 * Grow animation sizes
 */
export const GrowSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
      <Spinner animation="grow" size="xs" variant="primary" />
      <Spinner animation="grow" size="sm" variant="primary" />
      <Spinner animation="grow" size="md" variant="primary" />
      <Spinner animation="grow" size="lg" variant="primary" />
      <Spinner animation="grow" size="xl" variant="primary" />
    </div>
  ),
};

// =============================================================================
// Color Variants
// =============================================================================

/**
 * Primary colored spinner
 */
export const Primary: Story = {
  args: {
    variant: 'primary',
  },
};

/**
 * Secondary colored spinner
 */
export const Secondary: Story = {
  args: {
    variant: 'secondary',
  },
};

/**
 * Success colored spinner
 */
export const Success: Story = {
  args: {
    variant: 'success',
  },
};

/**
 * Danger colored spinner
 */
export const Danger: Story = {
  args: {
    variant: 'danger',
  },
};

/**
 * All color variants
 */
export const AllColors: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <Spinner variant="primary" />
      <Spinner variant="secondary" />
      <Spinner variant="success" />
      <Spinner variant="danger" />
      <Spinner variant="warning" />
      <Spinner variant="info" />
      <Spinner variant="light" />
      <Spinner variant="dark" />
    </div>
  ),
};

/**
 * All grow color variants
 */
export const AllGrowColors: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <Spinner animation="grow" variant="primary" />
      <Spinner animation="grow" variant="secondary" />
      <Spinner animation="grow" variant="success" />
      <Spinner animation="grow" variant="danger" />
      <Spinner animation="grow" variant="warning" />
      <Spinner animation="grow" variant="info" />
      <Spinner animation="grow" variant="light" />
      <Spinner animation="grow" variant="dark" />
    </div>
  ),
};

// =============================================================================
// Centered
// =============================================================================

/**
 * Centered spinner in container
 */
export const Centered: Story = {
  args: {
    centered: true,
    variant: 'primary',
    size: 'lg',
  },
  decorators: [
    (Story) => (
      <div
        style={{
          height: '200px',
          width: '300px',
          border: '1px dashed #ccc',
          borderRadius: '8px',
        }}
      >
        <Story />
      </div>
    ),
  ],
};

/**
 * Centered loading pattern with text
 */
export const CenteredWithText: Story = {
  render: () => (
    <div
      style={{
        height: '200px',
        width: '300px',
        border: '1px dashed #ccc',
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '1rem',
      }}
    >
      <Spinner variant="primary" size="lg" />
      <span className="text-muted">Loading content...</span>
    </div>
  ),
};

// =============================================================================
// In Buttons
// =============================================================================

/**
 * Spinner inside a button - loading state
 */
export const InButton: Story = {
  render: () => (
    <Button variant="primary" disabled>
      <Spinner as="span" size="sm" className="me-2" label="Loading" />
      Loading...
    </Button>
  ),
};

/**
 * Spinner inside different button variants
 */
export const InButtonVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <Button variant="primary" disabled>
        <Spinner as="span" size="sm" className="me-2" />
        Primary
      </Button>
      <Button variant="secondary" disabled>
        <Spinner as="span" size="sm" className="me-2" />
        Secondary
      </Button>
      <Button variant="success" disabled>
        <Spinner as="span" size="sm" className="me-2" />
        Success
      </Button>
      <Button variant="danger" disabled>
        <Spinner as="span" size="sm" className="me-2" />
        Danger
      </Button>
    </div>
  ),
};

/**
 * Spinner only button (no text)
 */
export const SpinnerOnlyButton: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem' }}>
      <Button variant="primary" disabled aria-label="Loading">
        <Spinner as="span" size="sm" label="Loading" />
      </Button>
      <Button variant="outline-primary" disabled aria-label="Loading">
        <Spinner as="span" size="sm" label="Loading" />
      </Button>
    </div>
  ),
};

/**
 * Extra small spinner in compact button
 */
export const ExtraSmallInButton: Story = {
  render: () => (
    <Button variant="primary" size="sm" disabled>
      <Spinner as="span" size="xs" className="me-1" />
      Loading
    </Button>
  ),
};

// =============================================================================
// Showcase
// =============================================================================

/**
 * Complete spinner showcase
 */
export const CompleteShowcase: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Sizes */}
      <div>
        <Heading level={4} style={{ marginBottom: '0.5rem' }}>
          Sizes
        </Heading>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Spinner size="xs" variant="primary" />
          <Spinner size="sm" variant="primary" />
          <Spinner size="md" variant="primary" />
          <Spinner size="lg" variant="primary" />
          <Spinner size="xl" variant="primary" />
        </div>
      </div>

      {/* Animation Types */}
      <div>
        <Heading level={4} style={{ marginBottom: '0.5rem' }}>
          Animation Types
        </Heading>
        <div style={{ display: 'flex', gap: '2rem' }}>
          <div style={{ textAlign: 'center' }}>
            <Spinner animation="border" variant="primary" />
            <div className="small text-muted mt-1">Border</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Spinner animation="grow" variant="primary" />
            <div className="small text-muted mt-1">Grow</div>
          </div>
        </div>
      </div>

      {/* Colors */}
      <div>
        <Heading level={4} style={{ marginBottom: '0.5rem' }}>
          Color Variants
        </Heading>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Spinner variant="primary" />
          <Spinner variant="secondary" />
          <Spinner variant="success" />
          <Spinner variant="danger" />
          <Spinner variant="warning" />
          <Spinner variant="info" />
          <Spinner variant="dark" />
        </div>
      </div>

      {/* In Buttons */}
      <div>
        <Heading level={4} style={{ marginBottom: '0.5rem' }}>
          In Buttons
        </Heading>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Button variant="primary" disabled>
            <Spinner as="span" size="sm" className="me-2" />
            Loading...
          </Button>
          <Button variant="outline-secondary" disabled>
            <Spinner as="span" size="sm" className="me-2" />
            Processing
          </Button>
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};
