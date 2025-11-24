import { Button } from '../Button';

import { Spinner } from './Spinner';

import type { Meta, StoryObj } from '@storybook/react-vite';

/**
 * Spinner component indicates loading state using Bootstrap 5 spinners.
 * Supports border and grow animations, multiple sizes, and color variants.
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
      options: ['sm', 'md'],
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

/**
 * Small spinner - useful for buttons and inline loading
 */
export const Small: Story = {
  args: {
    size: 'sm',
  },
};

/**
 * Small growing spinner
 */
export const SmallGrow: Story = {
  args: {
    animation: 'grow',
    size: 'sm',
  },
};

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
 * Custom sized spinner using inline styles
 */
export const CustomSize: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <Spinner style={{ width: '1rem', height: '1rem' }} />
      <Spinner style={{ width: '2rem', height: '2rem' }} />
      <Spinner style={{ width: '3rem', height: '3rem' }} />
      <Spinner style={{ width: '4rem', height: '4rem' }} />
    </div>
  ),
};

/**
 * Centered loading state pattern
 */
export const CenteredLoading: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
        padding: '2rem',
      }}
    >
      <Spinner variant="primary" />
      <span>Loading content...</span>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

/**
 * Flex utilities for alignment
 */
export const FlexAlignment: Story = {
  render: () => (
    <div className="d-flex justify-content-center" style={{ width: '200px' }}>
      <Spinner variant="primary" />
    </div>
  ),
};
