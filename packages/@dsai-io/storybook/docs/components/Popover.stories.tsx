import { Button, Popover } from '@dsai-io/react';
import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';

const SPACING_2 = 'var(--dsai-spacing-2)';
const FONT_WEIGHT_BOLD = 'var(--dsai-typography-font-weight-bold)';

/**
 * Popover component for displaying richer interactive content.
 * Uses Floating UI for intelligent positioning and supports various triggers.
 *
 * Features:
 * - Multiple trigger types: click, hover, focus
 * - Smart positioning with auto-flip on viewport edges
 * - Optional header and close button
 * - Configurable show/hide delays
 * - Controlled and uncontrolled modes
 * - Optional focus trap for complex content
 * - Full keyboard accessibility
 *
 * @see https://getbootstrap.com/docs/5.3/components/popovers/
 */
const meta: Meta<typeof Popover> = {
  title: 'Components/Popover',
  component: Popover,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A fully accessible popover component for displaying rich interactive content. ' +
          'Supports click, hover, and focus triggers with smart positioning.',
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
      description: 'Placement of the popover relative to the trigger',
      table: {
        type: { summary: 'PopoverPlacement' },
        defaultValue: { summary: 'top' },
      },
    },
    trigger: {
      control: 'select',
      options: ['click', 'hover', 'focus'],
      description: 'How to trigger the popover',
      table: {
        type: { summary: 'PopoverTrigger | PopoverTrigger[]' },
        defaultValue: { summary: 'click' },
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
    showCloseButton: {
      control: 'boolean',
      description: 'Whether to show the close button',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the popover is disabled',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    trapFocus: {
      control: 'boolean',
      description: 'Whether to trap focus within the popover',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    showDelay: {
      control: { type: 'number', min: 0, max: 2000, step: 100 },
      description: 'Delay in ms before showing the popover',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '0' },
      },
    },
    hideDelay: {
      control: { type: 'number', min: 0, max: 2000, step: 100 },
      description: 'Delay in ms before hiding the popover',
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
      control: { type: 'number', min: 100, max: 600, step: 10 },
      description: 'Maximum width of the popover',
      table: {
        type: { summary: 'number | string' },
        defaultValue: { summary: '276' },
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: 'var(--dsai-spacing-6)', minHeight: '300px' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Popover>;

// =============================================================================
// Basic Examples
// =============================================================================

/**
 * Basic popover with header and content.
 * Click the button to toggle the popover.
 */
export const Default: Story = {
  args: {
    header: 'Popover Title',
    content: 'And here is some amazing content. It can be much longer than a tooltip.',
    placement: 'top',
  },
  render: (args) => (
    <Popover {...args}>
      <Button variant="primary">Click to toggle popover</Button>
    </Popover>
  ),
};

/**
 * Popover without a header, just content.
 */
export const WithoutHeader: Story = {
  args: {
    content: 'This is a popover without a header. It contains only body content.',
    placement: 'right',
  },
  render: (args) => (
    <Popover {...args}>
      <Button variant="secondary">Simple Popover</Button>
    </Popover>
  ),
};

/**
 * Popover with a close button in the header.
 */
export const WithCloseButton: Story = {
  args: {
    header: 'Dismissible Popover',
    content: 'Click the X button or outside to close this popover.',
    showCloseButton: true,
    placement: 'bottom',
  },
  render: (args) => (
    <Popover {...args}>
      <Button variant="info">With Close Button</Button>
    </Popover>
  ),
};

// =============================================================================
// Placement Variations
// =============================================================================

/**
 * All available popover placements.
 * The popover automatically flips when there's not enough space.
 */
export const Placements: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 'var(--dsai-spacing-3)',
        padding: 'var(--dsai-spacing-4)',
      }}
    >
      {(
        [
          'top-start',
          'top',
          'top-end',
          'left-start',
          'left',
          'left-end',
          'right-start',
          'right',
          'right-end',
          'bottom-start',
          'bottom',
          'bottom-end',
        ] as const
      ).map((placement) => (
        <Popover
          key={placement}
          header={placement}
          content={`Placed at ${placement}`}
          placement={placement}
        >
          <Button variant="outline-secondary" style={{ width: '100%' }}>
            {placement}
          </Button>
        </Popover>
      ))}
    </div>
  ),
};

// =============================================================================
// Trigger Types
// =============================================================================

/**
 * Click trigger (default) - popover shows/hides on click.
 */
export const ClickTrigger: Story = {
  args: {
    header: 'Click Triggered',
    content: 'This popover appears when you click the button.',
    trigger: 'click',
  },
  render: (args) => (
    <Popover {...args}>
      <Button variant="primary">Click Me</Button>
    </Popover>
  ),
};

/**
 * Hover trigger - popover shows on mouse hover.
 */
export const HoverTrigger: Story = {
  args: {
    header: 'Hover Triggered',
    content: 'This popover appears when you hover over the button.',
    trigger: 'hover',
    showDelay: 200,
    hideDelay: 100,
  },
  render: (args) => (
    <Popover {...args}>
      <Button variant="secondary">Hover Over Me</Button>
    </Popover>
  ),
};

/**
 * Focus trigger - popover shows on keyboard focus.
 */
export const FocusTrigger: Story = {
  args: {
    header: 'Focus Triggered',
    content: 'This popover appears when you focus the button (Tab key).',
    trigger: 'focus',
  },
  render: (args) => (
    <Popover {...args}>
      <Button variant="info">Focus Me (Tab)</Button>
    </Popover>
  ),
};

/**
 * Multiple triggers - popover responds to multiple interaction types.
 */
export const MultipleTriggers: Story = {
  args: {
    header: 'Multi-Trigger',
    content: 'This popover appears on hover, focus, or click.',
    trigger: ['hover', 'focus', 'click'],
  },
  render: (args) => (
    <Popover {...args}>
      <Button variant="success">Hover, Focus, or Click</Button>
    </Popover>
  ),
};

// =============================================================================
// Rich Content
// =============================================================================

/**
 * Popover with rich HTML content including links and formatting.
 */
export const RichContent: Story = {
  args: {
    header: 'Rich Content',
    content: (
      <div>
        <p style={{ margin: '0 0 8px 0' }}>
          This popover contains <strong>formatted text</strong>, <em>emphasis</em>, and even{' '}
          <a href="#links" onClick={(e) => e.preventDefault()}>
            links
          </a>{' '}.
        </p>
        <ul style={{ margin: 0, paddingLeft: '20px' }}>
          <li>Item one</li>
          <li>Item two</li>
          <li>Item three</li>
        </ul>
      </div>
    ),
    placement: 'right',
    maxWidth: 350,
  },
  render: (args) => (
    <Popover {...args}>
      <Button variant="primary">Rich Content</Button>
    </Popover>
  ),
};

/**
 * Popover with interactive form content and focus trap.
 */
export const InteractiveContent: Story = {
  args: {
    header: 'Quick Settings',
    content: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING_2 }}>
        <div>
          <label
            htmlFor="popover-email"
            style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}
          >
            Email notifications
          </label>
          <select
            id="popover-email"
            style={{ width: '100%', padding: 'var(--dsai-spacing-1)', borderRadius: 'var(--dsai-border-radius-sm)', border: '1px solid var(--bs-border-color)' }}
          >
            <option>All emails</option>
            <option>Important only</option>
            <option>None</option>
          </select>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: SPACING_2 }}>
          <input type="checkbox" id="popover-dark" />
          <label htmlFor="popover-dark" style={{ fontSize: '14px' }}>
            Dark mode
          </label>
        </div>
        <Button variant="primary" size="sm">
          Save Settings
        </Button>
      </div>
    ),
    trapFocus: true,
    showCloseButton: true,
    placement: 'bottom',
    maxWidth: 300,
  },
  render: (args) => (
    <Popover {...args}>
      <Button variant="secondary">Open Settings</Button>
    </Popover>
  ),
};

// =============================================================================
// Controlled Mode
// =============================================================================

/**
 * Controlled popover with external state management.
 */
export const Controlled: Story = {
  render: function ControlledPopover() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--dsai-spacing-3)' }}>
        <div style={{ display: 'flex', gap: SPACING_2 }}>
          <Button variant="success" onClick={() => setIsOpen(true)}>
            Open
          </Button>
          <Button variant="danger" onClick={() => setIsOpen(false)}>
            Close
          </Button>
          <Button variant="secondary" onClick={() => setIsOpen(!isOpen)}>
            Toggle
          </Button>
        </div>
        <p style={{ margin: 0 }}>Popover is: {isOpen ? 'Open' : 'Closed'}</p>
        <Popover
          header="Controlled Popover"
          content="This popover is controlled by external state."
          isOpen={isOpen}
          onOpenChange={setIsOpen}
        >
          <Button variant="primary">Target Button</Button>
        </Popover>
      </div>
    );
  },
};

// =============================================================================
// States
// =============================================================================

/**
 * Disabled popover - will not show when trigger is activated.
 */
export const Disabled: Story = {
  args: {
    header: 'Disabled Popover',
    content: 'You should not see this content.',
    disabled: true,
  },
  render: (args) => (
    <Popover {...args}>
      <Button variant="secondary">Disabled Popover</Button>
    </Popover>
  ),
};

/**
 * Popover that starts open by default (uncontrolled).
 */
export const DefaultOpen: Story = {
  args: {
    header: 'Default Open',
    content: 'This popover is open by default.',
    defaultOpen: true,
    placement: 'right',
  },
  render: (args) => (
    <Popover {...args}>
      <Button variant="info">Default Open</Button>
    </Popover>
  ),
};

// =============================================================================
// Customization
// =============================================================================

/**
 * Popover without arrow.
 */
export const NoArrow: Story = {
  args: {
    header: 'No Arrow',
    content: 'This popover does not have an arrow pointer.',
    arrow: false,
    placement: 'bottom',
  },
  render: (args) => (
    <Popover {...args}>
      <Button variant="dark">No Arrow</Button>
    </Popover>
  ),
};

/**
 * Popover with custom max width.
 */
export const CustomWidth: Story = {
  args: {
    header: 'Wide Popover',
    content:
      'This popover has a custom maximum width of 400px, allowing for more content to be displayed on a single line.',
    maxWidth: 400,
  },
  render: (args) => (
    <Popover {...args}>
      <Button variant="primary">Wide Popover</Button>
    </Popover>
  ),
};

/**
 * Popover with delays for hover trigger.
 */
export const WithDelays: Story = {
  args: {
    header: 'Delayed Popover',
    content: 'This popover has a 500ms show delay and 200ms hide delay.',
    trigger: 'hover',
    showDelay: 500,
    hideDelay: 200,
  },
  render: (args) => (
    <Popover {...args}>
      <Button variant="warning">Hover (with delay)</Button>
    </Popover>
  ),
};

/**
 * Popover with custom offset.
 */
export const CustomOffset: Story = {
  args: {
    header: 'Custom Offset',
    content: 'This popover has a 20px offset from the trigger.',
    offset: 20,
  },
  render: (args) => (
    <Popover {...args}>
      <Button variant="secondary">Large Offset</Button>
    </Popover>
  ),
};

// =============================================================================
// Accessibility
// =============================================================================

/**
 * Popover with focus trap for modal-like behavior.
 * Focus is trapped within the popover when open.
 */
export const FocusTrap: Story = {
  args: {
    header: 'Focus Trapped',
    content: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING_2 }}>
        <p style={{ margin: 0 }}>Tab to cycle through focusable elements.</p>
        <input type="text" placeholder="First input" style={{ padding: 'var(--dsai-spacing-1)' }} />
        <input type="text" placeholder="Second input" style={{ padding: 'var(--dsai-spacing-1)' }} />
        <Button variant="primary" size="sm">
          Submit
        </Button>
      </div>
    ),
    trapFocus: true,
    showCloseButton: true,
    placement: 'bottom',
  },
  render: (args) => (
    <Popover {...args}>
      <Button variant="primary">Open Focus Trap</Button>
    </Popover>
  ),
};

/**
 * Popover with aria-label for screen readers.
 */
export const WithAriaLabel: Story = {
  args: {
    content: 'This popover has an aria-label for accessibility.',
    'aria-label': 'Help information',
  },
  render: (args) => (
    <Popover {...args}>
      <Button variant="info" aria-label="Get help">
        ?
      </Button>
    </Popover>
  ),
};

// =============================================================================
// Real-World Examples
// =============================================================================

/**
 * Help tooltip pattern for form fields.
 */
export const FormFieldHelp: Story = {
  render: () => (
    <div style={{ maxWidth: '400px' }}>
      <div style={{ marginBottom: '16px' }}>
        <label
          htmlFor="password"
          style={{ display: 'flex', alignItems: 'center', gap: SPACING_2, marginBottom: '4px' }}
        >
          Password
          <Popover
            header="Password Requirements"
            content={
              <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px' }}>
                <li>At least 8 characters</li>
                <li>One uppercase letter</li>
                <li>One lowercase letter</li>
                <li>One number</li>
                <li>One special character</li>
              </ul>
            }
            trigger={['hover', 'focus']}
            placement="right"
          >
            <Button variant="secondary" size="sm" aria-label="Password requirements help">
              ?
            </Button>
          </Popover>
        </label>
        <input
          type="password"
          id="password"
          style={{ width: '100%', padding: SPACING_2, borderRadius: 'var(--dsai-border-radius-sm)', border: '1px solid var(--bs-border-color)' }}
        />
      </div>
    </div>
  ),
};

/**
 * User profile card popover pattern.
 */
export const UserProfileCard: Story = {
  render: () => (
    <Popover
      header={null}
      content={
        <div style={{ display: 'flex', gap: SPACING_2, alignItems: 'flex-start' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: 'var(--bs-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: FONT_WEIGHT_BOLD,
            }}
          >
            JD
          </div>
          <div>
            <div style={{ fontWeight: FONT_WEIGHT_BOLD, marginBottom: '4px' }}>John Doe</div>
            <div style={{ fontSize: '14px', color: 'var(--bs-secondary)', marginBottom: '8px' }}>
              Software Engineer
            </div>
            <div style={{ display: 'flex', gap: SPACING_2 }}>
              <Button variant="primary" size="sm">
                Message
              </Button>
              <Button variant="outline-secondary" size="sm">
                View Profile
              </Button>
            </div>
          </div>
        </div>
      }
      trigger="hover"
      showDelay={300}
      hideDelay={200}
      placement="bottom-start"
      maxWidth={320}
    >
      <Button
        variant="outline-secondary"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: SPACING_2,
          padding: '8px 12px',
        }}
      >
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: 'var(--bs-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '12px',
            fontWeight: FONT_WEIGHT_BOLD,
          }}
        >
          JD
        </div>
        <span>John Doe</span>
      </Button>
    </Popover>
  ),
};

/**
 * Confirmation popover pattern.
 */
export const ConfirmationPopover: Story = {
  render: function ConfirmationPopoverRender() {
    const [isOpen, setIsOpen] = useState(false);

    const handleConfirm = (): void => {
      alert('Deleted!');
      setIsOpen(false);
    };

    return (
      <Popover
        header="Confirm Delete"
        content={
          <div>
            <p style={{ margin: '0 0 12px 0' }}>
              Are you sure you want to delete this item? This cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: SPACING_2, justifyContent: 'flex-end' }}>
              <Button variant="secondary" size="sm" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button variant="danger" size="sm" onClick={handleConfirm}>
                Delete
              </Button>
            </div>
          </div>
        }
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        placement="top"
        trapFocus
      >
        <Button variant="danger">Delete Item</Button>
      </Popover>
    );
  },
};

/**
 * Notification center popover pattern.
 */
export const NotificationCenter: Story = {
  render: () => (
    <Popover
      header="Notifications"
      content={
        <div style={{ maxHeight: '300px', overflow: 'auto' }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              style={{
                padding: SPACING_2,
                borderBottom: i < 5 ? '1px solid var(--bs-border-color)' : 'none',
                cursor: 'pointer',
              }}
            >
              <div style={{ fontWeight: FONT_WEIGHT_BOLD, fontSize: '14px' }}>New message from User {i}</div>
              <div style={{ fontSize: '12px', color: 'var(--bs-secondary)' }}>
                {i} hour{i > 1 ? 's' : ''} ago
              </div>
            </div>
          ))}
        </div>
      }
      showCloseButton
      placement="bottom-end"
      maxWidth={350}
      trapFocus
    >
      <Button variant="outline-secondary" style={{ position: 'relative' }}>
        🔔 Notifications{' '}
        <span
          style={{
            position: 'absolute',
            top: '-4px',
            right: '-4px',
            backgroundColor: 'var(--bs-danger)',
            color: 'white',
            borderRadius: '50%',
            width: '18px',
            height: '18px',
            fontSize: '11px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          5
        </span>
      </Button>
    </Popover>
  ),
};
