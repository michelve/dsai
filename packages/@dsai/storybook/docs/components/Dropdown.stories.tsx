import {
  BoxArrowRightIcon,
  Button,
  CheckCircleFillIcon,
  Dropdown,
  FileEarmarkIcon,
  FileEarmarkPdfIcon,
  FileImageIcon,
  FilesIcon,
  FolderIcon,
  GearFillIcon,
  PencilIcon,
  ThreeDotsVerticalIcon,
  TrashIcon,
} from '@dsai/react';
import { useCallback, useRef, useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';

/**
 * Dropdown component for displaying a toggleable menu of actions or navigation links.
 * Built with Bootstrap 5 design tokens and Floating UI for positioning.
 *
 * Features:
 * - Floating UI for smart positioning (auto-flipping, shifting)
 * - Full keyboard navigation (Arrow keys, Tab, Enter, Escape)
 * - Type-ahead search
 * - Focus management
 * - Portal rendering for proper z-index isolation
 * - FSM state management for animations
 * - Multiple placement options
 * - Auto-close behavior control
 *
 * @see https://getbootstrap.com/docs/5.3/components/dropdowns/
 */

const meta: Meta<typeof Dropdown> = {
  title: 'Components/Dropdown',
  component: Dropdown,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A fully accessible dropdown menu component with keyboard navigation, ' +
          'type-ahead search, and smart positioning powered by Floating UI.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: 'Controlled open state',
      table: {
        type: { summary: 'boolean' },
      },
    },
    defaultOpen: {
      control: 'boolean',
      description: 'Default open state (uncontrolled)',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
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
      description: 'Menu placement relative to toggle',
      table: {
        type: { summary: 'DropdownPlacement' },
        defaultValue: { summary: 'bottom-start' },
      },
    },
    autoClose: {
      control: 'select',
      options: [true, false, 'inside', 'outside'],
      description: 'Auto-close behavior',
      table: {
        type: { summary: 'boolean | "inside" | "outside"' },
        defaultValue: { summary: 'true' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the dropdown',
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
// Basic Dropdown
// =============================================================================

/**
 * Basic dropdown with action items
 */
export const Basic: Story = {
  render: function BasicDropdown() {
    return (
      <Dropdown>
        <Dropdown.Toggle>Dropdown</Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item onClick={() => console.warn('Action 1')}>Action</Dropdown.Item>
          <Dropdown.Item onClick={() => console.warn('Action 2')}>Another action</Dropdown.Item>
          <Dropdown.Item onClick={() => console.warn('Action 3')}>
            Something else here
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  },
};

// =============================================================================
// Button Variants
// =============================================================================

/**
 * Dropdown with different button variants
 */
export const ButtonVariants: Story = {
  render: function VariantsDropdown() {
    const variants = ['primary', 'secondary', 'success', 'danger', 'warning', 'info'] as const;

    return (
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {variants.map((variant) => (
          <Dropdown key={variant}>
            <Dropdown.Toggle variant={variant}>{variant}</Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item>Action 1</Dropdown.Item>
              <Dropdown.Item>Action 2</Dropdown.Item>
              <Dropdown.Item>Action 3</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        ))}
      </div>
    );
  },
};

// =============================================================================
// Sizes
// =============================================================================

/**
 * Dropdown with different sizes
 */
export const Sizes: Story = {
  render: function SizesDropdown() {
    return (
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
        <Dropdown>
          <Dropdown.Toggle size="sm">Small</Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item>Action 1</Dropdown.Item>
            <Dropdown.Item>Action 2</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown>
          <Dropdown.Toggle size="md">Medium (default)</Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item>Action 1</Dropdown.Item>
            <Dropdown.Item>Action 2</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown>
          <Dropdown.Toggle size="lg">Large</Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item>Action 1</Dropdown.Item>
            <Dropdown.Item>Action 2</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    );
  },
};

// =============================================================================
// Split Button
// =============================================================================

/**
 * Split button dropdown with separate action and toggle
 */
export const SplitButton: Story = {
  render: function SplitButtonDropdown() {
    return (
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <Dropdown>
          <Button variant="primary">Primary Action</Button>
          <Dropdown.Toggle split variant="primary" aria-label="Toggle dropdown" />
          <Dropdown.Menu>
            <Dropdown.Item>Option 1</Dropdown.Item>
            <Dropdown.Item>Option 2</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item>Separated link</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        <Dropdown>
          <Button variant="success">Success</Button>
          <Dropdown.Toggle split variant="success" aria-label="Toggle dropdown" />
          <Dropdown.Menu>
            <Dropdown.Item>Option 1</Dropdown.Item>
            <Dropdown.Item>Option 2</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    );
  },
};

// =============================================================================
// Placement/Direction
// =============================================================================

/**
 * Different dropdown placements (directions)
 */
export const Placement: Story = {
  render: function PlacementDropdown() {
    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1rem',
          padding: '2rem',
          justifyItems: 'center',
        }}
      >
        <Dropdown placement="top-start">
          <Dropdown.Toggle variant="secondary">Top Start</Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item>Action 1</Dropdown.Item>
            <Dropdown.Item>Action 2</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        <Dropdown placement="top">
          <Dropdown.Toggle variant="secondary">Top</Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item>Action 1</Dropdown.Item>
            <Dropdown.Item>Action 2</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        <Dropdown placement="top-end">
          <Dropdown.Toggle variant="secondary">Top End</Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item>Action 1</Dropdown.Item>
            <Dropdown.Item>Action 2</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        <Dropdown placement="left">
          <Dropdown.Toggle variant="secondary">Left</Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item>Action 1</Dropdown.Item>
            <Dropdown.Item>Action 2</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        <div />

        <Dropdown placement="right">
          <Dropdown.Toggle variant="secondary">Right</Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item>Action 1</Dropdown.Item>
            <Dropdown.Item>Action 2</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        <Dropdown placement="bottom-start">
          <Dropdown.Toggle variant="secondary">Bottom Start</Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item>Action 1</Dropdown.Item>
            <Dropdown.Item>Action 2</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        <Dropdown placement="bottom">
          <Dropdown.Toggle variant="secondary">Bottom</Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item>Action 1</Dropdown.Item>
            <Dropdown.Item>Action 2</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        <Dropdown placement="bottom-end">
          <Dropdown.Toggle variant="secondary">Bottom End</Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item>Action 1</Dropdown.Item>
            <Dropdown.Item>Action 2</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    );
  },
};

// =============================================================================
// Menu Alignment
// =============================================================================

/**
 * Menu alignment options
 */
export const MenuAlignment: Story = {
  render: function MenuAlignmentDropdown() {
    return (
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Dropdown>
          <Dropdown.Toggle>Start Aligned (default)</Dropdown.Toggle>
          <Dropdown.Menu align="start">
            <Dropdown.Item>Short</Dropdown.Item>
            <Dropdown.Item>Medium length</Dropdown.Item>
            <Dropdown.Item>A longer item text here</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        <Dropdown>
          <Dropdown.Toggle>End Aligned</Dropdown.Toggle>
          <Dropdown.Menu align="end">
            <Dropdown.Item>Short</Dropdown.Item>
            <Dropdown.Item>Medium length</Dropdown.Item>
            <Dropdown.Item>A longer item text here</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    );
  },
};

// =============================================================================
// Headers and Dividers
// =============================================================================

/**
 * Dropdown with headers and dividers for grouping
 */
export const HeadersAndDividers: Story = {
  render: function HeadersDividersDropdown() {
    return (
      <Dropdown>
        <Dropdown.Toggle>Options</Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Header>Section 1</Dropdown.Header>
          <Dropdown.Item>Action 1</Dropdown.Item>
          <Dropdown.Item>Action 2</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Header>Section 2</Dropdown.Header>
          <Dropdown.Item>Action 3</Dropdown.Item>
          <Dropdown.Item>Action 4</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item>Final action</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  },
};

// =============================================================================
// With Icons
// =============================================================================

/**
 * Dropdown items with icons
 */
export const WithIcons: Story = {
  render: function IconsDropdown() {
    return (
      <Dropdown>
        <Dropdown.Toggle>Actions</Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item startIcon={<PencilIcon />}>Edit</Dropdown.Item>
          <Dropdown.Item startIcon={<FilesIcon />}>Duplicate</Dropdown.Item>
          <Dropdown.Item startIcon={<FolderIcon />}>Move to folder</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item startIcon={<TrashIcon />}>Delete</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  },
};

// =============================================================================
// Link Items
// =============================================================================

/**
 * Dropdown with link items for navigation
 */
export const LinkItems: Story = {
  render: function LinksDropdown() {
    return (
      <Dropdown>
        <Dropdown.Toggle>Navigation</Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item href="/dashboard">Dashboard</Dropdown.Item>
          <Dropdown.Item href="/settings">Settings</Dropdown.Item>
          <Dropdown.Item href="/profile">Profile</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item href="https://github.com" target="_blank">
            GitHub <BoxArrowRightIcon />
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  },
};

// =============================================================================
// Active and Disabled Items
// =============================================================================

/**
 * Items with active and disabled states
 */
export const ActiveAndDisabled: Story = {
  render: function StatesDropdown() {
    return (
      <Dropdown>
        <Dropdown.Toggle>Options</Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item>Regular item</Dropdown.Item>
          <Dropdown.Item active>Active item</Dropdown.Item>
          <Dropdown.Item disabled>Disabled item</Dropdown.Item>
          <Dropdown.Item>Another regular</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  },
};

// =============================================================================
// Item Text
// =============================================================================

/**
 * Non-interactive text within dropdown
 */
export const ItemText: Story = {
  render: function ItemTextDropdown() {
    return (
      <Dropdown>
        <Dropdown.Toggle>User Menu</Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.ItemText>
            <strong>Signed in as</strong>
            <br />
            user@example.com
          </Dropdown.ItemText>
          <Dropdown.Divider />
          <Dropdown.Item>Profile</Dropdown.Item>
          <Dropdown.Item>Settings</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item>Sign out</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  },
};

// =============================================================================
// Auto Close Behaviors
// =============================================================================

/**
 * Different auto-close behaviors
 */
export const AutoClose: Story = {
  render: function AutoCloseDropdown() {
    return (
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <Dropdown autoClose>
          <Dropdown.Toggle variant="primary">Default (true)</Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.ItemText>Closes on any click</Dropdown.ItemText>
            <Dropdown.Item>Click me</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        <Dropdown autoClose="inside">
          <Dropdown.Toggle variant="secondary">Inside only</Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.ItemText>Only closes on item click</Dropdown.ItemText>
            <Dropdown.Item>Click me</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        <Dropdown autoClose="outside">
          <Dropdown.Toggle variant="success">Outside only</Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.ItemText>Only closes on outside click</Dropdown.ItemText>
            <Dropdown.Item>Click me</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        <Dropdown autoClose={false}>
          <Dropdown.Toggle variant="danger">Manual (false)</Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.ItemText>Toggle button to close</Dropdown.ItemText>
            <Dropdown.Item>Click me</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    );
  },
};

// =============================================================================
// Controlled
// =============================================================================

/**
 * Controlled dropdown with external state
 */
export const Controlled: Story = {
  render: function ControlledDropdown() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <Button variant="outline-primary" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? 'Close' : 'Open'} Dropdown
        </Button>
        <Dropdown isOpen={isOpen} onOpenChange={setIsOpen}>
          <Dropdown.Toggle>Controlled</Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item>Action 1</Dropdown.Item>
            <Dropdown.Item>Action 2</Dropdown.Item>
            <Dropdown.Item>Action 3</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <span>State: {isOpen ? 'Open' : 'Closed'}</span>
      </div>
    );
  },
};

// =============================================================================
// Disabled
// =============================================================================

/**
 * Disabled dropdown
 */
export const Disabled: Story = {
  render: function DisabledDropdown() {
    return (
      <Dropdown disabled>
        <Dropdown.Toggle>Disabled Dropdown</Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item>Action 1</Dropdown.Item>
          <Dropdown.Item>Action 2</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  },
};

// =============================================================================
// Without Caret
// =============================================================================

/**
 * Dropdown toggle without caret arrow
 */
export const WithoutCaret: Story = {
  render: function NoCaretDropdown() {
    return (
      <Dropdown>
        <Dropdown.Toggle caret={false}>
          <ThreeDotsVerticalIcon />
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item>Edit</Dropdown.Item>
          <Dropdown.Item>Duplicate</Dropdown.Item>
          <Dropdown.Item>Delete</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  },
};

// =============================================================================
// Complex Example
// =============================================================================

/**
 * Complex dropdown with multiple features
 */
export const ComplexExample: Story = {
  render: function ComplexDropdown() {
    const [selected, setSelected] = useState<string | null>(null);

    return (
      <Dropdown>
        <Dropdown.Toggle variant="primary">
          {selected ? `Selected: ${selected}` : 'Choose an option'}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Header>File Operations</Dropdown.Header>
          <Dropdown.Item
            startIcon={<FileEarmarkIcon />}
            active={selected === 'new'}
            onClick={() => setSelected('new')}
          >
            New File
          </Dropdown.Item>
          <Dropdown.Item
            startIcon={<FolderIcon />}
            active={selected === 'open'}
            onClick={() => setSelected('open')}
          >
            Open...
          </Dropdown.Item>
          <Dropdown.Item
            startIcon={<CheckCircleFillIcon />}
            active={selected === 'save'}
            onClick={() => setSelected('save')}
          >
            Save
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Header>Export</Dropdown.Header>
          <Dropdown.Item
            startIcon={<FileEarmarkPdfIcon />}
            active={selected === 'pdf'}
            onClick={() => setSelected('pdf')}
          >
            Export as PDF
          </Dropdown.Item>
          <Dropdown.Item
            startIcon={<FileImageIcon />}
            active={selected === 'image'}
            onClick={() => setSelected('image')}
          >
            Export as Image
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item startIcon={<GearFillIcon />} disabled>
            Settings (disabled)
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  },
};

// =============================================================================
// Keyboard Navigation Demo
// =============================================================================

/**
 * Demonstrates keyboard navigation features
 */
export const KeyboardNavigation: Story = {
  render: function KeyboardDemo() {
    return (
      <div>
        <div className="mb-3">
          <strong>Keyboard shortcuts:</strong>
          <ul className="mt-2 ms-3">
            <li>
              <code>Enter</code> or <code>Space</code>: Open/close dropdown
            </li>
            <li>
              <code>Arrow Up</code> / <code>Arrow Down</code>: Navigate items
            </li>
            <li>
              <code>Home</code> / <code>End</code>: Jump to first/last item
            </li>
            <li>
              <code>Escape</code>: Close dropdown
            </li>
            <li>Type characters to search (type-ahead)</li>
          </ul>
        </div>
        <Dropdown>
          <Dropdown.Toggle>Try keyboard navigation</Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item>Apple</Dropdown.Item>
            <Dropdown.Item>Banana</Dropdown.Item>
            <Dropdown.Item>Cherry</Dropdown.Item>
            <Dropdown.Item>Date</Dropdown.Item>
            <Dropdown.Item>Elderberry</Dropdown.Item>
            <Dropdown.Item>Fig</Dropdown.Item>
            <Dropdown.Item>Grape</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    );
  },
};

// =============================================================================
// Callbacks
// =============================================================================

/**
 * Dropdown with callback handlers
 */
export const Callbacks: Story = {
  render: function CallbacksDropdown() {
    const [events, setEvents] = useState<string[]>([]);
    const lastEventRef = useRef<string | null>(null);

    const addEvent = useCallback((event: string): void => {
      if (lastEventRef.current === event) {
        return;
      }
      lastEventRef.current = event;
      setEvents((prev) => [...prev.slice(-4), event]);
    }, []);

    return (
      <div>
        <Dropdown
          onOpenChange={(open) => addEvent(`onOpenChange: ${open}`)}
          onOpened={() => addEvent('onOpened')}
          onClosed={() => addEvent('onClosed')}
        >
          <Dropdown.Toggle>Watch Events</Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => addEvent('Item 1 clicked')}>Action 1</Dropdown.Item>
            <Dropdown.Item onClick={() => addEvent('Item 2 clicked')}>Action 2</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <div style={{ marginTop: '1rem', fontFamily: 'monospace', fontSize: '0.875rem' }}>
          <strong>Events:</strong>
          <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
            {events.map((event, i) => (
              <li key={i}>{event}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  },
};
