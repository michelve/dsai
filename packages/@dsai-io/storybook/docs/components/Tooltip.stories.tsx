import { Button, Tooltip } from '@dsai-io/react';
import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';

/**
 * Tooltip component for providing contextual information on hover/focus.
 * Uses Floating UI for intelligent positioning and supports various triggers.
 *
 * Features:
 * - Multiple trigger types: hover, focus, click
 * - Smart positioning with auto-flip on viewport edges
 * - Optional arrow pointer
 * - Configurable show/hide delays
 * - Controlled and uncontrolled modes
 * - Full keyboard accessibility
 *
 * @see https://getbootstrap.com/docs/5.3/components/tooltips/
 */

const meta: Meta<typeof Tooltip> = {
  title: 'Components/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A fully accessible tooltip component for displaying contextual information. ' +
          'Supports hover, focus, and click triggers with smart positioning.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    placement: {
      control: 'select',
      options: [
        'top',
        'top-start',
        'top-end',
        'bottom',
        'bottom-start',
        'bottom-end',
        'left',
        'left-start',
        'left-end',
        'right',
        'right-start',
        'right-end',
      ],
      description: 'Placement of the tooltip relative to the trigger',
      table: {
        type: { summary: 'TooltipPlacement' },
        defaultValue: { summary: 'top' },
      },
    },
    trigger: {
      control: 'select',
      options: ['hover', 'focus', 'click'],
      description: 'How to trigger the tooltip',
      table: {
        type: { summary: 'TooltipTrigger | TooltipTrigger[]' },
        defaultValue: { summary: "['hover', 'focus']" },
      },
    },
    arrow: {
      control: 'boolean',
      description: 'Whether to show the arrow pointer',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the tooltip is disabled',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    showDelay: {
      control: { type: 'number', min: 0, max: 2000, step: 100 },
      description: 'Delay in ms before showing the tooltip',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '0' },
      },
    },
    hideDelay: {
      control: { type: 'number', min: 0, max: 2000, step: 100 },
      description: 'Delay in ms before hiding the tooltip',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '0' },
      },
    },
    offset: {
      control: { type: 'number', min: 0, max: 50, step: 2 },
      description: 'Offset from the trigger element in pixels',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '8' },
      },
    },
    maxWidth: {
      control: { type: 'number', min: 100, max: 500, step: 50 },
      description: 'Maximum width of the tooltip',
      table: {
        type: { summary: 'number | string' },
        defaultValue: { summary: 'undefined' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// =============================================================================
// Basic Tooltip
// =============================================================================

/**
 * Basic tooltip that appears on hover.
 */
export const Basic: Story = {
  render: function BasicTooltip() {
    return (
      <Tooltip content="This is a helpful tooltip">
        <Button variant="primary">Hover me</Button>
      </Tooltip>
    );
  },
};

// =============================================================================
// Placement Variations
// =============================================================================

/**
 * Tooltips can be positioned on any side of the trigger element.
 */
export const Placements: Story = {
  render: function PlacementsTooltip() {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3rem',
          padding: '3rem',
        }}
      >
        <Tooltip content="Top tooltip" placement="top">
          <Button variant="secondary">Top</Button>
        </Tooltip>

        <div style={{ display: 'flex', gap: '3rem' }}>
          <Tooltip content="Left tooltip" placement="left">
            <Button variant="secondary">Left</Button>
          </Tooltip>

          <Tooltip content="Right tooltip" placement="right">
            <Button variant="secondary">Right</Button>
          </Tooltip>
        </div>

        <Tooltip content="Bottom tooltip" placement="bottom">
          <Button variant="secondary">Bottom</Button>
        </Tooltip>
      </div>
    );
  },
};

// =============================================================================
// Start/End Placements
// =============================================================================

/**
 * Fine-grained placement control with start and end variants.
 */
export const StartEndPlacements: Story = {
  render: function StartEndTooltip() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Tooltip content="Top start" placement="top-start">
            <Button variant="outline-primary">Top Start</Button>
          </Tooltip>
          <Tooltip content="Top center" placement="top">
            <Button variant="outline-primary">Top</Button>
          </Tooltip>
          <Tooltip content="Top end" placement="top-end">
            <Button variant="outline-primary">Top End</Button>
          </Tooltip>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <Tooltip content="Bottom start" placement="bottom-start">
            <Button variant="outline-primary">Bottom Start</Button>
          </Tooltip>
          <Tooltip content="Bottom center" placement="bottom">
            <Button variant="outline-primary">Bottom</Button>
          </Tooltip>
          <Tooltip content="Bottom end" placement="bottom-end">
            <Button variant="outline-primary">Bottom End</Button>
          </Tooltip>
        </div>
      </div>
    );
  },
};

// =============================================================================
// Trigger Types
// =============================================================================

/**
 * Tooltips can be triggered by hover, focus, or click.
 */
export const TriggerTypes: Story = {
  render: function TriggerTypesTooltip() {
    return (
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <Tooltip content="Hover tooltip" trigger="hover">
          <Button variant="primary">Hover</Button>
        </Tooltip>

        <Tooltip content="Focus tooltip (Tab to me)" trigger="focus">
          <Button variant="info">Focus</Button>
        </Tooltip>

        <Tooltip content="Click tooltip" trigger="click">
          <Button variant="warning">Click</Button>
        </Tooltip>

        <Tooltip content="Hover or focus tooltip" trigger={['hover', 'focus']}>
          <Button variant="success">Hover/Focus</Button>
        </Tooltip>
      </div>
    );
  },
};

// =============================================================================
// With Delay
// =============================================================================

/**
 * Tooltips can have configurable show and hide delays.
 */
export const WithDelay: Story = {
  render: function DelayTooltip() {
    return (
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <Tooltip content="Appears after 500ms" showDelay={500}>
          <Button variant="primary">500ms Show Delay</Button>
        </Tooltip>

        <Tooltip content="Stays for 500ms after hover ends" hideDelay={500}>
          <Button variant="secondary">500ms Hide Delay</Button>
        </Tooltip>

        <Tooltip content="Slow tooltip" showDelay={1000} hideDelay={500}>
          <Button variant="info">1s Show, 500ms Hide</Button>
        </Tooltip>
      </div>
    );
  },
};

// =============================================================================
// Without Arrow
// =============================================================================

/**
 * Tooltip without the arrow pointer.
 */
export const WithoutArrow: Story = {
  render: function NoArrowTooltip() {
    return (
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Tooltip content="Tooltip with arrow" arrow>
          <Button variant="primary">With Arrow</Button>
        </Tooltip>

        <Tooltip content="Tooltip without arrow" arrow={false}>
          <Button variant="secondary">Without Arrow</Button>
        </Tooltip>
      </div>
    );
  },
};

// =============================================================================
// Long Content
// =============================================================================

/**
 * Tooltips with longer content can use maxWidth to wrap text.
 */
export const LongContent: Story = {
  render: function LongContentTooltip() {
    return (
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <Tooltip
          content="This is a tooltip with a lot of content that will wrap to multiple lines when it exceeds the maximum width setting."
          maxWidth={200}
        >
          <Button variant="primary">200px Max Width</Button>
        </Tooltip>

        <Tooltip
          content="This is a tooltip with a lot of content that will wrap to multiple lines when it exceeds the maximum width setting."
          maxWidth={300}
        >
          <Button variant="secondary">300px Max Width</Button>
        </Tooltip>

        <Tooltip content="This is a tooltip with a lot of content that has no max width constraint so it may get very long on a single line.">
          <Button variant="info">No Max Width</Button>
        </Tooltip>
      </div>
    );
  },
};

// =============================================================================
// Rich Content
// =============================================================================

/**
 * Tooltips can contain rich React content.
 */
export const RichContent: Story = {
  render: function RichContentTooltip() {
    return (
      <Tooltip
        content={
          <div>
            <strong>Rich Tooltip</strong>
            <hr style={{ margin: '0.25rem 0', borderColor: 'rgba(255,255,255,0.2)' }} />
            <span>With formatted content</span>
          </div>
        }
        maxWidth={200}
      >
        <Button variant="primary">Rich Content</Button>
      </Tooltip>
    );
  },
};

// =============================================================================
// Controlled Tooltip
// =============================================================================

/**
 * Controlled tooltip with external state management.
 */
export const Controlled: Story = {
  render: function ControlledTooltip() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button size="sm" variant="outline-primary" onClick={() => setIsOpen(true)}>
            Show
          </Button>
          <Button size="sm" variant="outline-secondary" onClick={() => setIsOpen(false)}>
            Hide
          </Button>
          <Button size="sm" variant="outline-info" onClick={() => setIsOpen((prev) => !prev)}>
            Toggle
          </Button>
        </div>

        <Tooltip content="Controlled tooltip" isOpen={isOpen} onOpenChange={setIsOpen}>
          <Button variant="primary">Controlled Target</Button>
        </Tooltip>

        <span className="text-muted">State: {isOpen ? 'Open' : 'Closed'}</span>
      </div>
    );
  },
};

// =============================================================================
// Disabled Tooltip
// =============================================================================

/**
 * Disabled tooltip does not show.
 */
export const Disabled: Story = {
  render: function DisabledTooltip() {
    const [disabled, setDisabled] = useState(true);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input
            type="checkbox"
            checked={disabled}
            onChange={(e) => setDisabled(e.target.checked)}
          />
          Tooltip disabled
        </label>

        <Tooltip content="This tooltip can be disabled" disabled={disabled}>
          <Button variant="primary">{disabled ? 'Tooltip Disabled' : 'Tooltip Enabled'}</Button>
        </Tooltip>
      </div>
    );
  },
};

// =============================================================================
// On Different Elements
// =============================================================================

/**
 * Tooltips work with various element types.
 */
export const OnDifferentElements: Story = {
  render: function DifferentElementsTooltip() {
    return (
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <Tooltip content="Button tooltip">
          <Button variant="primary">Button</Button>
        </Tooltip>

        <Tooltip content="Link tooltip">
          <a href="#link" className="link-primary">
            Link
          </a>
        </Tooltip>

        <Tooltip content="Span tooltip">
          <span style={{ cursor: 'pointer', textDecoration: 'underline' }}>Span</span>
        </Tooltip>

        <Tooltip content="Badge tooltip">
          <span className="badge bg-success">Badge</span>
        </Tooltip>

        <Tooltip content="Icon tooltip">
          <span style={{ cursor: 'pointer', fontSize: '1.5rem' }} role="img" aria-label="info icon">
            ℹ️
          </span>
        </Tooltip>
      </div>
    );
  },
};

// =============================================================================
// Click to Dismiss
// =============================================================================

/**
 * Click-triggered tooltips can be dismissed with ESC key.
 */
export const ClickToDismiss: Story = {
  render: function ClickToDismissTooltip() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
        <Tooltip content="Click again or press ESC to dismiss" trigger="click">
          <Button variant="primary">Click to Toggle</Button>
        </Tooltip>
        <span className="text-muted">Press ESC to dismiss when open</span>
      </div>
    );
  },
};

// =============================================================================
// Auto Positioning
// =============================================================================

/**
 * Tooltips automatically flip when near viewport edges.
 */
export const AutoPositioning: Story = {
  render: function AutoPositioningTooltip() {
    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1rem',
          width: '100%',
          maxWidth: '400px',
        }}
      >
        <Tooltip content="Auto-flips if too close to edge" placement="top">
          <Button size="sm" variant="outline-secondary" className="w-100">
            Top Left
          </Button>
        </Tooltip>
        <Tooltip content="Centered tooltip" placement="top">
          <Button size="sm" variant="outline-secondary" className="w-100">
            Top Center
          </Button>
        </Tooltip>
        <Tooltip content="Auto-flips if too close to edge" placement="top">
          <Button size="sm" variant="outline-secondary" className="w-100">
            Top Right
          </Button>
        </Tooltip>
        <Tooltip content="Left tooltip" placement="left">
          <Button size="sm" variant="outline-secondary" className="w-100">
            Left
          </Button>
        </Tooltip>
        <div />
        <Tooltip content="Right tooltip" placement="right">
          <Button size="sm" variant="outline-secondary" className="w-100">
            Right
          </Button>
        </Tooltip>
        <Tooltip content="Auto-flips if too close to edge" placement="bottom">
          <Button size="sm" variant="outline-secondary" className="w-100">
            Bottom Left
          </Button>
        </Tooltip>
        <Tooltip content="Centered tooltip" placement="bottom">
          <Button size="sm" variant="outline-secondary" className="w-100">
            Bottom Center
          </Button>
        </Tooltip>
        <Tooltip content="Auto-flips if too close to edge" placement="bottom">
          <Button size="sm" variant="outline-secondary" className="w-100">
            Bottom Right
          </Button>
        </Tooltip>
      </div>
    );
  },
};

// =============================================================================
// Accessibility Demo
// =============================================================================

/**
 * Demonstrates accessibility features of the Tooltip component.
 */
export const AccessibilityDemo: Story = {
  render: function AccessibilityDemoTooltip() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div className="alert alert-info" role="alert">
          <strong>Accessibility Features:</strong>
          <ul className="mb-0">
            <li>
              <code>role=&quot;tooltip&quot;</code> on the tooltip element
            </li>
            <li>
              <code>aria-describedby</code> links trigger to tooltip content
            </li>
            <li>Tooltip is visible on keyboard focus</li>
            <li>ESC key dismisses click-triggered tooltips</li>
            <li>Supports Tab key navigation</li>
          </ul>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Tooltip content="Use Tab key to focus this button and see the tooltip" trigger="focus">
            <Button variant="primary">Tab to me</Button>
          </Tooltip>

          <Tooltip content="This tooltip also appears on hover" trigger={['hover', 'focus']}>
            <Button variant="secondary">Hover or Focus</Button>
          </Tooltip>
        </div>
      </div>
    );
  },
};

// =============================================================================
// With Form Fields
// =============================================================================

/**
 * Tooltips on form fields provide helpful hints.
 */
export const WithFormFields: Story = {
  render: function FormFieldsTooltip() {
    return (
      <form style={{ maxWidth: '400px' }}>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            Username
          </label>
          <Tooltip content="Choose a unique username (3-20 characters)" trigger="focus">
            <input
              type="text"
              className="form-control"
              id="username"
              placeholder="Enter username"
            />
          </Tooltip>
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <Tooltip content="We'll never share your email with anyone" trigger="focus">
            <input type="email" className="form-control" id="email" placeholder="Enter email" />
          </Tooltip>
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <Tooltip
            content="Password must be at least 8 characters with 1 number and 1 special character"
            trigger="focus"
            maxWidth={250}
          >
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Enter password"
            />
          </Tooltip>
        </div>

        <Button type="submit" variant="primary">
          Submit
        </Button>
      </form>
    );
  },
};

// =============================================================================
// Custom Offset
// =============================================================================

/**
 * Tooltips can have custom offset from the trigger element.
 */
export const CustomOffset: Story = {
  render: function CustomOffsetTooltip() {
    return (
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <Tooltip content="Default offset (8px)" offset={8}>
          <Button variant="primary">8px Offset</Button>
        </Tooltip>

        <Tooltip content="Close offset (4px)" offset={4}>
          <Button variant="secondary">4px Offset</Button>
        </Tooltip>

        <Tooltip content="Far offset (20px)" offset={20}>
          <Button variant="info">20px Offset</Button>
        </Tooltip>
      </div>
    );
  },
};

// =============================================================================
// With Button Component
// =============================================================================

/**
 * Tooltip works with the Button component that uses forwardRef.
 */
export const WithButtonComponent: Story = {
  render: function WithButtonComponentTooltip() {
    return (
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <Tooltip content="Primary button tooltip">
          <Button variant="primary">Primary Button</Button>
        </Tooltip>

        <Tooltip content="Secondary button tooltip" placement="right">
          <Button variant="secondary">Secondary Button</Button>
        </Tooltip>

        <Tooltip content="Outline button tooltip" placement="bottom">
          <Button variant="outline-primary">Outline Button</Button>
        </Tooltip>

        <Tooltip content="Small button tooltip" placement="left">
          <Button variant="info" size="sm">
            Small Button
          </Button>
        </Tooltip>

        <Tooltip content="Large button tooltip">
          <Button variant="success" size="lg">
            Large Button
          </Button>
        </Tooltip>
      </div>
    );
  },
};

// =============================================================================
// With Loading Button
// =============================================================================

/**
 * Tooltip works with Button in loading state.
 */
export const WithLoadingButton: Story = {
  render: function WithLoadingButtonTooltip() {
    return (
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <Tooltip content="Button is loading...">
          <Button variant="primary" loading loadingText="Loading...">
            Submit
          </Button>
        </Tooltip>

        <Tooltip content="Normal button tooltip">
          <Button variant="secondary">Normal Button</Button>
        </Tooltip>
      </div>
    );
  },
};

// =============================================================================
// Custom Theming & Visual States
// =============================================================================

/**
 * Demonstrates theming the tooltip surface and arrow along with
 * using the `data-visual-state` attribute to hook into transitions.
 */
export const ThemedWithVisualStates: Story = {
  render: function ThemedWithVisualStatesTooltip() {
    return (
      <>
        <style>
          {`
            .custom-tooltip-surface.tooltip {
              --tooltip-bg: #1b1d3a;
            }

            .custom-tooltip-surface .tooltip-inner {
              background-color: var(--tooltip-bg);
              color: #f8f9ff;
              font-weight: 500;
              letter-spacing: 0.01em;
            }

            .custom-tooltip-surface .dsai-tooltip-arrow {
              fill: var(--tooltip-bg);
            }

            .custom-tooltip-surface[data-visual-state='showing'],
            .custom-tooltip-surface[data-visual-state='visible'] {
              box-shadow: 0 10px 25px rgba(9, 12, 61, 0.35);
            }

            .custom-tooltip-surface[data-visual-state='showing'] {
              animation: tooltip-pop-in 150ms ease-out;
            }

            .custom-tooltip-surface[data-visual-state='hiding'] {
              animation: tooltip-pop-out 150ms ease-in;
            }

            @keyframes tooltip-pop-in {
              from {
                opacity: 0;
                transform: translateY(4px) scale(0.96);
              }
              to {
                opacity: 1;
                transform: translateY(0) scale(1);
              }
            }

            @keyframes tooltip-pop-out {
              from {
                opacity: 1;
                transform: translateY(0) scale(1);
              }
              to {
                opacity: 0;
                transform: translateY(4px) scale(0.96);
              }
            }
          `}
        </style>

        <Tooltip
          content="Custom themed tooltip with synced arrow"
          className="custom-tooltip-surface"
          placement="bottom"
          showDelay={150}
        >
          <Button variant="dark">Hover to see theme</Button>
        </Tooltip>
      </>
    );
  },
};
