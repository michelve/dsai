import { Button, CheckIcon, Progress } from '@dsai/react';
import { useEffect, useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';

/**
 * Progress bar component for showing progress or loading states.
 * Built with Bootstrap 5 design tokens and full WCAG 2.2 AA compliance.
 *
 * @see https://getbootstrap.com/docs/5.3/components/progress/
 */
const meta: Meta<typeof Progress> = {
  title: 'Components/Progress',
  component: Progress,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A Bootstrap 5 progress bar component for showing progress or loading states. ' +
          'Supports determinate (with value) and indeterminate (loading) modes, ' +
          'multiple variants, sizes, striped/animated patterns, and stacked bars.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'Progress value (0-100)',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '0' },
      },
    },
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'dark'],
      description: 'Progress bar color variant',
      table: {
        type: { summary: 'ProgressVariant' },
        defaultValue: { summary: 'primary' },
      },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Progress bar height',
      table: {
        type: { summary: 'ProgressSize' },
        defaultValue: { summary: 'md' },
      },
    },
    label: {
      control: 'text',
      description: 'Label displayed above the progress bar',
      table: {
        type: { summary: 'string' },
      },
    },
    showValue: {
      control: 'boolean',
      description: 'Show percentage value',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    indeterminate: {
      control: 'boolean',
      description: 'Indeterminate loading mode',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    striped: {
      control: 'boolean',
      description: 'Striped pattern',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    animated: {
      control: 'boolean',
      description: 'Animated stripes',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
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
 * Basic progress bar with 25% value
 */
export const Default: Story = {
  args: {
    value: 25,
    'aria-label': 'Default progress',
  },
};

/**
 * Progress bar at 0%
 */
export const Empty: Story = {
  args: {
    value: 0,
    'aria-label': 'Empty progress',
  },
};

/**
 * Progress bar at 100%
 */
export const Complete: Story = {
  args: {
    value: 100,
    'aria-label': 'Complete progress',
  },
};

// =============================================================================
// Variants
// =============================================================================

/**
 * All color variants
 */
export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Progress value={20} variant="primary" aria-label="Primary" />
      <Progress value={35} variant="secondary" aria-label="Secondary" />
      <Progress value={50} variant="success" aria-label="Success" />
      <Progress value={65} variant="danger" aria-label="Danger" />
      <Progress value={80} variant="warning" aria-label="Warning" />
      <Progress value={90} variant="info" aria-label="Info" />
      <Progress value={100} variant="dark" aria-label="Dark" />
    </div>
  ),
};

// =============================================================================
// Sizes
// =============================================================================

/**
 * Different progress bar sizes
 */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div>
        <p className="small text-muted mb-1">Small (8px)</p>
        <Progress value={50} size="sm" aria-label="Small progress" />
      </div>
      <div>
        <p className="small text-muted mb-1">Medium (16px) - Default</p>
        <Progress value={50} size="md" aria-label="Medium progress" />
      </div>
      <div>
        <p className="small text-muted mb-1">Large (24px)</p>
        <Progress value={50} size="lg" aria-label="Large progress" />
      </div>
    </div>
  ),
};

// =============================================================================
// Labels and Values
// =============================================================================

/**
 * Progress bar with label
 */
export const WithLabel: Story = {
  args: {
    value: 65,
    label: 'Uploading files...',
    'aria-label': 'File upload progress',
  },
};

/**
 * Progress bar showing percentage value
 */
export const WithValue: Story = {
  args: {
    value: 75,
    showValue: true,
    'aria-label': 'Progress with value',
  },
};

/**
 * Progress bar with label and value
 */
export const WithLabelAndValue: Story = {
  args: {
    value: 45,
    label: 'Processing...',
    showValue: true,
    'aria-label': 'Processing progress',
  },
};

/**
 * Progress bar with custom value text
 */
export const CustomValueText: Story = {
  args: {
    value: 75,
    showValue: true,
    valueText: '3 of 4 complete',
    'aria-label': 'Task progress',
  },
};

/**
 * Custom min/max for ARIA semantics.
 *
 * **Note:** `min` and `max` control ARIA semantics only, not the visual range.
 * The visual width is always calculated as a percentage (0-100).
 *
 * For example, with `min=10, max=20, value=15`:
 * - Visual width = 15% (value is used directly as percentage)
 * - `aria-valuenow=15`, `aria-valuemin=10`, `aria-valuemax=20`
 */
export const CustomMinMax: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <p className="text-muted small">
        <code>min</code> and <code>max</code> control ARIA semantics only. The visual width is
        always 0-100%.
      </p>
      <div>
        <p className="small mb-1">Temperature: 15°C (min: 10°C, max: 20°C) - Visual: 15% width</p>
        <Progress value={15} min={10} max={20} variant="info" aria-label="Temperature reading" />
      </div>
      <div>
        <p className="small mb-1">Steps: 3 of 5 complete - Visual: 60% width</p>
        <Progress
          value={60}
          min={0}
          max={5}
          showValue
          valueText="Step 3 of 5"
          variant="primary"
          aria-label="Wizard progress"
        />
      </div>
    </div>
  ),
};

// =============================================================================
// Indeterminate (Loading)
// =============================================================================

/**
 * Indeterminate loading state
 */
export const Indeterminate: Story = {
  args: {
    indeterminate: true,
    'aria-label': 'Loading',
  },
};

/**
 * Indeterminate with label
 */
export const IndeterminateWithLabel: Story = {
  args: {
    indeterminate: true,
    label: 'Loading data...',
    variant: 'info',
    'aria-label': 'Loading data',
  },
};

// =============================================================================
// Striped and Animated
// =============================================================================

/**
 * Striped progress bar
 */
export const Striped: Story = {
  args: {
    value: 60,
    striped: true,
    'aria-label': 'Striped progress',
  },
};

/**
 * Animated striped progress bar
 */
export const Animated: Story = {
  args: {
    value: 60,
    striped: true,
    animated: true,
    'aria-label': 'Animated progress',
  },
};

/**
 * All striped variants
 */
export const StripedVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Progress value={20} variant="primary" striped animated aria-label="Primary" />
      <Progress value={40} variant="success" striped animated aria-label="Success" />
      <Progress value={60} variant="warning" striped animated aria-label="Warning" />
      <Progress value={80} variant="danger" striped animated aria-label="Danger" />
      <Progress value={100} variant="info" striped animated aria-label="Info" />
    </div>
  ),
};

// =============================================================================
// Stacked Progress Bars
// =============================================================================

/**
 * Multiple stacked progress bars
 */
export const Stacked: Story = {
  render: () => (
    <Progress aria-label="Multi-part progress">
      <Progress.Bar value={15} variant="success" aria-label="Completed tasks" />
      <Progress.Bar value={30} variant="warning" aria-label="In progress tasks" />
      <Progress.Bar value={20} variant="danger" aria-label="Blocked tasks" />
    </Progress>
  ),
};

/**
 * Stacked with values shown
 */
export const StackedWithValues: Story = {
  render: () => (
    <Progress aria-label="Multi-part progress with values">
      <Progress.Bar value={15} variant="success" showValue aria-label="Success portion" />
      <Progress.Bar value={30} variant="warning" showValue aria-label="Warning portion" />
      <Progress.Bar value={20} variant="danger" showValue aria-label="Danger portion" />
    </Progress>
  ),
};

/**
 * Decorative stacked bars using aria-hidden.
 * When the parent Progress provides the full accessible description,
 * individual bars can be marked as decorative to avoid repetitive announcements.
 */
export const DecorativeStackedBars: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <p className="text-muted small">
        Use <code>aria-hidden</code> on Progress.Bar for purely decorative stacked bars where the
        parent provides the accessible label.
      </p>
      <Progress aria-label="Project status: 65% complete (15% done, 30% in progress, 20% blocked)">
        <Progress.Bar value={15} variant="success" aria-hidden />
        <Progress.Bar value={30} variant="warning" aria-hidden />
        <Progress.Bar value={20} variant="danger" aria-hidden />
      </Progress>
    </div>
  ),
};

// =============================================================================
// Interactive Examples
// =============================================================================

/**
 * Animated progress simulation
 */
export const AnimatedProgress: Story = {
  render: function AnimatedProgressRender() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            return 0;
          }
          return prev + 5;
        });
      }, 500);

      return () => clearInterval(interval);
    }, []);

    return (
      <Progress
        value={progress}
        label="Auto-incrementing progress"
        showValue
        variant="success"
        aria-label="Auto progress"
      />
    );
  },
};

/**
 * File upload simulation
 */
export const FileUploadSimulation: Story = {
  render: function FileUploadRender() {
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState<'idle' | 'uploading' | 'complete'>('idle');

    useEffect(() => {
      if (status === 'uploading' && progress < 100) {
        const timeout = setTimeout(() => {
          setProgress((prev) => Math.min(prev + Math.random() * 15, 100));
        }, 300);
        return () => clearTimeout(timeout);
      } else if (progress >= 100) {
        setStatus('complete');
      }
    }, [status, progress]);

    const startUpload = (): void => {
      setProgress(0);
      setStatus('uploading');
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {status === 'idle' && (
          <Button variant="primary" onClick={startUpload}>
            Start Upload
          </Button>
        )}

        {status === 'uploading' && (
          <Progress
            value={Math.round(progress)}
            label="Uploading document.pdf..."
            showValue
            variant="primary"
            striped
            animated
            aria-label="File upload progress"
          />
        )}

        {status === 'complete' && (
          <div className="d-flex flex-column gap-2">
            <Progress value={100} variant="success" aria-label="Upload complete" />
            <div className="d-flex align-items-center gap-2">
              <CheckIcon className="text-success" size={16} />
              <span>Upload complete!</span>
              <Button size="sm" variant="outline-primary" className="ms-auto" onClick={startUpload}>
                Upload Another
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  },
};

// =============================================================================
// Complete Showcase
// =============================================================================

/**
 * Complete progress bar showcase
 */
export const CompleteShowcase: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Basic */}
      <div>
        <h4 style={{ marginBottom: '0.5rem' }}>Basic Progress</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Progress value={25} aria-label="25%" />
          <Progress value={50} aria-label="50%" />
          <Progress value={75} aria-label="75%" />
          <Progress value={100} aria-label="100%" />
        </div>
      </div>

      {/* Variants */}
      <div>
        <h4 style={{ marginBottom: '0.5rem' }}>Color Variants</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Progress value={50} variant="primary" aria-label="Primary" />
          <Progress value={50} variant="success" aria-label="Success" />
          <Progress value={50} variant="warning" aria-label="Warning" />
          <Progress value={50} variant="danger" aria-label="Danger" />
          <Progress value={50} variant="info" aria-label="Info" />
        </div>
      </div>

      {/* With Labels */}
      <div>
        <h4 style={{ marginBottom: '0.5rem' }}>With Labels</h4>
        <Progress
          value={65}
          label="Downloading update..."
          showValue
          variant="info"
          aria-label="Download progress"
        />
      </div>

      {/* Striped & Animated */}
      <div>
        <h4 style={{ marginBottom: '0.5rem' }}>Striped & Animated</h4>
        <Progress value={75} striped animated variant="success" aria-label="Animated progress" />
      </div>

      {/* Stacked */}
      <div>
        <h4 style={{ marginBottom: '0.5rem' }}>Stacked Bars</h4>
        <Progress aria-label="Multi-part progress">
          <Progress.Bar value={20} variant="success" />
          <Progress.Bar value={15} variant="warning" />
          <Progress.Bar value={10} variant="danger" />
        </Progress>
      </div>

      {/* Indeterminate */}
      <div>
        <h4 style={{ marginBottom: '0.5rem' }}>Indeterminate (Loading)</h4>
        <Progress indeterminate variant="primary" aria-label="Loading" />
      </div>
    </div>
  ),
};
