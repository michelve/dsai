import {
  Button,
  EnvelopeIcon,
  GearIcon,
  Heading,
  HouseIcon,
  InfoCircleIcon,
  Input,
  ListIcon,
  Sheet,
  Text,
  ToolsIcon,
} from '@dsai-io/react';
import { useRef, useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';

/**
 * Sheet component for slide-out panels from any edge of the viewport.
 * Built on Bootstrap 5's Offcanvas with enhanced FSM state management and
 * full accessibility support.
 *
 * Features:
 * - Portal rendering for proper z-index isolation
 * - Focus trap with Tab key cycling
 * - ESC key to close
 * - Scroll lock when open (modal mode)
 * - Compound components (Sheet.Header, Sheet.Body, Sheet.Footer, Sheet.Title)
 * - Four placement options (left, right, top, bottom)
 * - Multiple sizes (sm, md, lg, xl, full, auto)
 * - Surface variants (default, elevated, inverse, transparent)
 * - Modal and non-modal modes
 * - FSM state management for animations
 * - Respects prefers-reduced-motion
 *
 * @see https://getbootstrap.com/docs/5.3/components/offcanvas/
 */

const meta: Meta<typeof Sheet> = {
  title: 'Components/Sheet',
  component: Sheet,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A fully accessible slide-out panel component with portal rendering, focus management, ' +
          'scroll locking, and animations. Supports various placements, sizes, and surface variants.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: 'Whether the sheet is open',
      table: {
        type: { summary: 'boolean' },
      },
    },
    placement: {
      control: 'select',
      options: ['left', 'right', 'top', 'bottom'],
      description: 'Which edge the sheet slides in from',
      table: {
        type: { summary: 'SheetPlacement' },
        defaultValue: { summary: 'right' },
      },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', 'full', 'auto'],
      description: 'Sheet size',
      table: {
        type: { summary: 'SheetSize' },
        defaultValue: { summary: 'md' },
      },
    },
    surface: {
      control: 'select',
      options: ['default', 'elevated', 'inverse', 'transparent'],
      description: 'Visual surface variant',
      table: {
        type: { summary: 'SheetSurface' },
        defaultValue: { summary: 'default' },
      },
    },
    mode: {
      control: 'select',
      options: ['modal', 'non-modal'],
      description: 'Sheet mode (with or without backdrop)',
      table: {
        type: { summary: 'SheetMode' },
        defaultValue: { summary: 'modal' },
      },
    },
    closeOnBackdropClick: {
      control: 'boolean',
      description: 'Close when clicking backdrop',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    closeOnEscape: {
      control: 'boolean',
      description: 'Close when pressing ESC',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    backdrop: {
      control: 'boolean',
      description: 'Show backdrop (modal mode only)',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    staticBackdrop: {
      control: 'boolean',
      description: 'Highlight on backdrop click instead of closing',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    animated: {
      control: 'boolean',
      description: 'Enable animations (respects prefers-reduced-motion)',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// =============================================================================
// Basic Sheet
// =============================================================================

/**
 * Basic sheet with header, body, and footer
 */
export const Basic: Story = {
  render: function BasicSheet() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Sheet</Button>
        <Sheet isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <Sheet.Header>Sheet Title</Sheet.Header>
          <Sheet.Body>
            <Text>This is the sheet body content. You can put any content here.</Text>
          </Sheet.Body>
          <Sheet.Footer>
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setIsOpen(false)}>
              Save Changes
            </Button>
          </Sheet.Footer>
        </Sheet>
      </>
    );
  },
};

// =============================================================================
// Placements
// =============================================================================

/**
 * Sheet sliding from the left (navigation drawer style)
 */
export const PlacementLeft: Story = {
  render: function LeftSheet() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Left Sheet</Button>
        <Sheet isOpen={isOpen} onClose={() => setIsOpen(false)} placement="left">
          <Sheet.Header>Navigation</Sheet.Header>
          <Sheet.Body>
            <Text>This sheet slides in from the left edge.</Text>
            <Text>Commonly used for navigation drawers.</Text>
          </Sheet.Body>
          <Sheet.Footer>
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </Sheet.Footer>
        </Sheet>
      </>
    );
  },
};

/**
 * Sheet sliding from the right (default, settings drawer style)
 */
export const PlacementRight: Story = {
  render: function RightSheet() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Right Sheet</Button>
        <Sheet isOpen={isOpen} onClose={() => setIsOpen(false)} placement="right">
          <Sheet.Header>Settings</Sheet.Header>
          <Sheet.Body>
            <Text>This sheet slides in from the right edge (default).</Text>
            <Text>Commonly used for settings or detail panels.</Text>
          </Sheet.Body>
          <Sheet.Footer>
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </Sheet.Footer>
        </Sheet>
      </>
    );
  },
};

/**
 * Sheet sliding from the top
 */
export const PlacementTop: Story = {
  render: function TopSheet() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Top Sheet</Button>
        <Sheet isOpen={isOpen} onClose={() => setIsOpen(false)} placement="top">
          <Sheet.Header>Notifications</Sheet.Header>
          <Sheet.Body>
            <Text>This sheet slides in from the top edge.</Text>
            <Text>Useful for notification panels or alerts.</Text>
          </Sheet.Body>
          <Sheet.Footer>
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </Sheet.Footer>
        </Sheet>
      </>
    );
  },
};

/**
 * Sheet sliding from the bottom (mobile action sheet style)
 */
export const PlacementBottom: Story = {
  render: function BottomSheet() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Bottom Sheet</Button>
        <Sheet isOpen={isOpen} onClose={() => setIsOpen(false)} placement="bottom">
          <Sheet.Header>Actions</Sheet.Header>
          <Sheet.Body>
            <Text>This sheet slides in from the bottom edge.</Text>
            <Text>Commonly used for mobile action sheets.</Text>
          </Sheet.Body>
          <Sheet.Footer>
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </Sheet.Footer>
        </Sheet>
      </>
    );
  },
};

// =============================================================================
// Sizes
// =============================================================================

/**
 * Small sheet (320px)
 */
export const Small: Story = {
  render: function SmallSheet() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Small Sheet</Button>
        <Sheet isOpen={isOpen} onClose={() => setIsOpen(false)} size="sm">
          <Sheet.Header>Small Sheet</Sheet.Header>
          <Sheet.Body>
            <Text>This is a small sheet (320px width).</Text>
          </Sheet.Body>
          <Sheet.Footer>
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </Sheet.Footer>
        </Sheet>
      </>
    );
  },
};

/**
 * Large sheet (540px)
 */
export const Large: Story = {
  render: function LargeSheet() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Large Sheet</Button>
        <Sheet isOpen={isOpen} onClose={() => setIsOpen(false)} size="lg">
          <Sheet.Header>Large Sheet</Sheet.Header>
          <Sheet.Body>
            <Text>This is a large sheet (540px width).</Text>
            <Text>Great for forms or detailed content.</Text>
          </Sheet.Body>
          <Sheet.Footer>
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </Sheet.Footer>
        </Sheet>
      </>
    );
  },
};

/**
 * Extra large sheet (720px)
 */
export const ExtraLarge: Story = {
  render: function ExtraLargeSheet() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Extra Large Sheet</Button>
        <Sheet isOpen={isOpen} onClose={() => setIsOpen(false)} size="xl">
          <Sheet.Header>Extra Large Sheet</Sheet.Header>
          <Sheet.Body>
            <Text>This is an extra large sheet (720px width).</Text>
            <Text>Ideal for complex forms or dashboards.</Text>
          </Sheet.Body>
          <Sheet.Footer>
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </Sheet.Footer>
        </Sheet>
      </>
    );
  },
};

/**
 * Full viewport sheet
 */
export const FullSize: Story = {
  render: function FullSheet() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Full Sheet</Button>
        <Sheet isOpen={isOpen} onClose={() => setIsOpen(false)} size="full">
          <Sheet.Header>Full Width Sheet</Sheet.Header>
          <Sheet.Body>
            <Text>This sheet takes up the full viewport width.</Text>
            <Text>Perfect for immersive experiences.</Text>
          </Sheet.Body>
          <Sheet.Footer>
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </Sheet.Footer>
        </Sheet>
      </>
    );
  },
};

/**
 * Custom size using width prop
 */
export const CustomWidth: Story = {
  render: function CustomWidthSheet() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Custom Width (500px)</Button>
        <Sheet isOpen={isOpen} onClose={() => setIsOpen(false)} width="500px">
          <Sheet.Header>Custom Width</Sheet.Header>
          <Sheet.Body>
            <Text>This sheet has a custom width of 500px.</Text>
          </Sheet.Body>
          <Sheet.Footer>
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </Sheet.Footer>
        </Sheet>
      </>
    );
  },
};

/**
 * Custom height for bottom sheet
 */
export const CustomHeight: Story = {
  render: function CustomHeightSheet() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Custom Height Bottom Sheet</Button>
        <Sheet isOpen={isOpen} onClose={() => setIsOpen(false)} placement="bottom" height="50vh">
          <Sheet.Header>Custom Height</Sheet.Header>
          <Sheet.Body>
            <Text>This bottom sheet has a custom height of 50vh.</Text>
          </Sheet.Body>
          <Sheet.Footer>
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </Sheet.Footer>
        </Sheet>
      </>
    );
  },
};

// =============================================================================
// Surface Variants
// =============================================================================

/**
 * Elevated surface with shadow emphasis
 */
export const SurfaceElevated: Story = {
  render: function ElevatedSheet() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Elevated Surface</Button>
        <Sheet isOpen={isOpen} onClose={() => setIsOpen(false)} surface="elevated">
          <Sheet.Header>Elevated Sheet</Sheet.Header>
          <Sheet.Body>
            <Text>This sheet has an elevated surface with shadow emphasis.</Text>
          </Sheet.Body>
          <Sheet.Footer>
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </Sheet.Footer>
        </Sheet>
      </>
    );
  },
};

/**
 * Inverse surface (dark theme)
 */
export const SurfaceInverse: Story = {
  render: function InverseSheet() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Inverse Surface</Button>
        <Sheet isOpen={isOpen} onClose={() => setIsOpen(false)} surface="inverse">
          <Sheet.Header>Inverse Sheet</Sheet.Header>
          <Sheet.Body>
            <Text>This sheet has an inverse (dark) surface.</Text>
          </Sheet.Body>
          <Sheet.Footer>
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </Sheet.Footer>
        </Sheet>
      </>
    );
  },
};

// =============================================================================
// Modal vs Non-Modal Mode
// =============================================================================

/**
 * Non-modal sheet (no backdrop, can interact with background)
 */
export const NonModal: Story = {
  render: function NonModalSheet() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div style={{ position: 'relative' }}>
        <Button onClick={() => setIsOpen(true)}>Non-Modal Sheet</Button>
        <Text style={{ marginTop: '1rem' }}>
          You can still interact with this text when the sheet is open.
        </Text>
        <Sheet isOpen={isOpen} onClose={() => setIsOpen(false)} mode="non-modal">
          <Sheet.Header>Non-Modal</Sheet.Header>
          <Sheet.Body>
            <Text>This sheet has no backdrop.</Text>
            <Text>You can interact with content behind it.</Text>
          </Sheet.Body>
          <Sheet.Footer>
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </Sheet.Footer>
        </Sheet>
      </div>
    );
  },
};

// =============================================================================
// Static Backdrop
// =============================================================================

/**
 * Static backdrop (highlights on click instead of closing)
 */
export const StaticBackdrop: Story = {
  render: function StaticBackdropSheet() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Static Backdrop</Button>
        <Sheet isOpen={isOpen} onClose={() => setIsOpen(false)} staticBackdrop>
          <Sheet.Header>Static Backdrop</Sheet.Header>
          <Sheet.Body>
            <Text>Clicking the backdrop will not close this sheet.</Text>
            <Text>Instead, the sheet will briefly highlight to indicate the action.</Text>
            <Text>Use the close button or ESC key to close.</Text>
          </Sheet.Body>
          <Sheet.Footer>
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </Sheet.Footer>
        </Sheet>
      </>
    );
  },
};

// =============================================================================
// Without Close Button
// =============================================================================

/**
 * Sheet without close button in header
 */
export const NoCloseButton: Story = {
  render: function NoCloseButtonSheet() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>No Close Button</Button>
        <Sheet isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <Sheet.Header closeButton={false}>No Header Close Button</Sheet.Header>
          <Sheet.Body>
            <Text>This sheet has no close button in the header.</Text>
            <Text>Users must use the footer buttons or ESC key to close.</Text>
          </Sheet.Body>
          <Sheet.Footer>
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </Sheet.Footer>
        </Sheet>
      </>
    );
  },
};

// =============================================================================
// No ESC Key
// =============================================================================

/**
 * Sheet that cannot be closed with ESC key
 */
export const NoEscapeClose: Story = {
  render: function NoEscapeCloseSheet() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>No ESC Close</Button>
        <Sheet isOpen={isOpen} onClose={() => setIsOpen(false)} closeOnEscape={false}>
          <Sheet.Header>ESC Disabled</Sheet.Header>
          <Sheet.Body>
            <Text>Pressing ESC will not close this sheet.</Text>
            <Text>Use the close button instead.</Text>
          </Sheet.Body>
          <Sheet.Footer>
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </Sheet.Footer>
        </Sheet>
      </>
    );
  },
};

// =============================================================================
// Custom Focus
// =============================================================================

/**
 * Sheet with custom initial focus
 */
export const CustomInitialFocus: Story = {
  render: function CustomInitialFocusSheet() {
    const [isOpen, setIsOpen] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Custom Focus</Button>
        <Sheet
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          initialFocusRef={inputRef as React.RefObject<HTMLElement>}
        >
          <Sheet.Header>Custom Initial Focus</Sheet.Header>
          <Sheet.Body>
            <Text>The input below receives focus when the sheet opens:</Text>
            <Input ref={inputRef} placeholder="I get focused first!" />
          </Sheet.Body>
          <Sheet.Footer>
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setIsOpen(false)}>
              Submit
            </Button>
          </Sheet.Footer>
        </Sheet>
      </>
    );
  },
};

// =============================================================================
// Return Focus
// =============================================================================

/**
 * Sheet with focus returning to trigger
 */
export const ReturnFocus: Story = {
  render: function ReturnFocusSheet() {
    const [isOpen, setIsOpen] = useState(false);
    const triggerRef = useRef<HTMLButtonElement>(null);

    return (
      <>
        <Button ref={triggerRef} onClick={() => setIsOpen(true)}>
          Return Focus Sheet
        </Button>
        <Sheet
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          returnFocusRef={triggerRef as React.RefObject<HTMLElement>}
        >
          <Sheet.Header>Return Focus</Sheet.Header>
          <Sheet.Body>
            <Text>When this sheet closes, focus will return to the trigger button.</Text>
          </Sheet.Body>
          <Sheet.Footer>
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </Sheet.Footer>
        </Sheet>
      </>
    );
  },
};

// =============================================================================
// Form Sheet
// =============================================================================

/**
 * Sheet with a form
 */
export const FormSheet: Story = {
  render: function FormSheetExample() {
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '' });

    const handleSubmit = (e: React.FormEvent): void => {
      e.preventDefault();
      // Form submission logic would go here
      setIsOpen(false);
    };

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Form</Button>
        <Sheet isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <form onSubmit={handleSubmit}>
            <Sheet.Header>Contact Form</Sheet.Header>
            <Sheet.Body>
              <Input
                id="name"
                label="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="mb-3"
              />
              <Input
                id="email"
                type="email"
                label="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </Sheet.Body>
            <Sheet.Footer>
              <Button variant="secondary" type="button" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Sheet.Footer>
          </form>
        </Sheet>
      </>
    );
  },
};

// =============================================================================
// Navigation Drawer
// =============================================================================

/**
 * Navigation drawer use case
 */
export const NavigationDrawer: Story = {
  render: function NavigationDrawerSheet() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>
          <ListIcon className="me-2" />
          Open Menu
        </Button>
        <Sheet isOpen={isOpen} onClose={() => setIsOpen(false)} placement="left" size="sm">
          <Sheet.Header>Navigation</Sheet.Header>
          <Sheet.Body>
            <nav>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ padding: '0.75rem 0', borderBottom: '1px solid #eee' }}>
                  <a
                    href="#home"
                    style={{
                      textDecoration: 'none',
                      color: 'inherit',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    <HouseIcon /> Home
                  </a>
                </li>
                <li style={{ padding: '0.75rem 0', borderBottom: '1px solid #eee' }}>
                  <a
                    href="#about"
                    style={{
                      textDecoration: 'none',
                      color: 'inherit',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    <InfoCircleIcon /> About
                  </a>
                </li>
                <li style={{ padding: '0.75rem 0', borderBottom: '1px solid #eee' }}>
                  <a
                    href="#services"
                    style={{
                      textDecoration: 'none',
                      color: 'inherit',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    <ToolsIcon /> Services
                  </a>
                </li>
                <li style={{ padding: '0.75rem 0', borderBottom: '1px solid #eee' }}>
                  <a
                    href="#contact"
                    style={{
                      textDecoration: 'none',
                      color: 'inherit',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    <EnvelopeIcon /> Contact
                  </a>
                </li>
              </ul>
            </nav>
          </Sheet.Body>
        </Sheet>
      </>
    );
  },
};

// =============================================================================
// Settings Panel
// =============================================================================

/**
 * Settings panel use case
 */
export const SettingsPanel: Story = {
  render: function SettingsPanelSheet() {
    const [isOpen, setIsOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [notifications, setNotifications] = useState(true);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>
          <GearIcon className="me-2" />
          Settings
        </Button>
        <Sheet isOpen={isOpen} onClose={() => setIsOpen(false)} placement="right" size="md">
          <Sheet.Header>Settings</Sheet.Header>
          <Sheet.Body>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="checkbox"
                  checked={darkMode}
                  onChange={(e) => setDarkMode(e.target.checked)}
                />
                Dark Mode
              </label>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="checkbox"
                  checked={notifications}
                  onChange={(e) => setNotifications(e.target.checked)}
                />
                Enable Notifications
              </label>
            </div>
          </Sheet.Body>
          <Sheet.Footer>
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setIsOpen(false)}>
              Save Settings
            </Button>
          </Sheet.Footer>
        </Sheet>
      </>
    );
  },
};

// =============================================================================
// Nested Sheets
// =============================================================================

/**
 * Nested sheets with different z-indexes
 */
export const NestedSheets: Story = {
  render: function NestedSheetsExample() {
    const [isOpen1, setIsOpen1] = useState(false);
    const [isOpen2, setIsOpen2] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen1(true)}>Open First Sheet</Button>

        <Sheet isOpen={isOpen1} onClose={() => setIsOpen1(false)} zIndex={1055}>
          <Sheet.Header>First Sheet</Sheet.Header>
          <Sheet.Body>
            <Text>This is the first sheet. You can open another sheet on top of it.</Text>
            <Button variant="primary" onClick={() => setIsOpen2(true)}>
              Open Second Sheet
            </Button>
          </Sheet.Body>
          <Sheet.Footer>
            <Button variant="secondary" onClick={() => setIsOpen1(false)}>
              Close
            </Button>
          </Sheet.Footer>
        </Sheet>

        <Sheet
          isOpen={isOpen2}
          onClose={() => setIsOpen2(false)}
          zIndex={1065}
          placement="left"
          size="sm"
        >
          <Sheet.Header>Second Sheet</Sheet.Header>
          <Sheet.Body>
            <Text>This is the second sheet, displayed on top of the first.</Text>
          </Sheet.Body>
          <Sheet.Footer>
            <Button variant="secondary" onClick={() => setIsOpen2(false)}>
              Close
            </Button>
          </Sheet.Footer>
        </Sheet>
      </>
    );
  },
};

// =============================================================================
// All Placements Showcase
// =============================================================================

/**
 * All sheet placements in one view
 */
export const AllPlacements: Story = {
  render: function AllPlacementsShowcase() {
    const [openPlacement, setOpenPlacement] = useState<string | null>(null);

    const placements = [
      { key: 'left', label: 'Left' },
      { key: 'right', label: 'Right' },
      { key: 'top', label: 'Top' },
      { key: 'bottom', label: 'Bottom' },
    ] as const;

    return (
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {placements.map(({ key, label }) => (
          <div key={key}>
            <Button onClick={() => setOpenPlacement(key)}>{label}</Button>
            <Sheet
              isOpen={openPlacement === key}
              onClose={() => setOpenPlacement(null)}
              placement={key}
            >
              <Sheet.Header>{label} Sheet</Sheet.Header>
              <Sheet.Body>
                <Text>This sheet slides in from the {label.toLowerCase()}.</Text>
              </Sheet.Body>
              <Sheet.Footer>
                <Button variant="secondary" onClick={() => setOpenPlacement(null)}>
                  Close
                </Button>
              </Sheet.Footer>
            </Sheet>
          </div>
        ))}
      </div>
    );
  },
};

// =============================================================================
// All Sizes Showcase
// =============================================================================

/**
 * All sheet sizes in one view
 */
export const AllSizes: Story = {
  render: function AllSizesShowcase() {
    const [openSize, setOpenSize] = useState<string | null>(null);

    const sizes = [
      { key: 'sm', label: 'Small (320px)' },
      { key: 'md', label: 'Medium (400px)' },
      { key: 'lg', label: 'Large (540px)' },
      { key: 'xl', label: 'Extra Large (720px)' },
      { key: 'full', label: 'Full Width' },
    ] as const;

    return (
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {sizes.map(({ key, label }) => (
          <div key={key}>
            <Button onClick={() => setOpenSize(key)}>{label}</Button>
            <Sheet
              isOpen={openSize === key}
              onClose={() => setOpenSize(null)}
              size={key as 'sm' | 'md' | 'lg' | 'xl' | 'full'}
            >
              <Sheet.Header>{label} Sheet</Sheet.Header>
              <Sheet.Body>
                <Text>This is a {label.toLowerCase()} sheet.</Text>
              </Sheet.Body>
              <Sheet.Footer>
                <Button variant="secondary" onClick={() => setOpenSize(null)}>
                  Close
                </Button>
              </Sheet.Footer>
            </Sheet>
          </div>
        ))}
      </div>
    );
  },
};

// =============================================================================
// Scrollable Content
// =============================================================================

/**
 * Sheet with scrollable content
 */
export const ScrollableContent: Story = {
  render: function ScrollableSheet() {
    const [isOpen, setIsOpen] = useState(false);
    const paragraphs = Array.from({ length: 20 }, (_, index) => index + 1);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Scrollable Sheet</Button>
        <Sheet isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <Sheet.Header>Scrollable Content</Sheet.Header>
          <Sheet.Body>
            {paragraphs.map((paragraphNumber) => (
              <Text key={`paragraph-${paragraphNumber}`}>
                Paragraph {paragraphNumber}: Lorem ipsum dolor sit amet, consectetur adipiscing
                elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </Text>
            ))}
          </Sheet.Body>
          <Sheet.Footer>
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </Sheet.Footer>
        </Sheet>
      </>
    );
  },
};

// =============================================================================
// Lifecycle Callbacks
// =============================================================================

/**
 * Sheet with lifecycle callbacks
 */
export const LifecycleCallbacks: Story = {
  render: function LifecycleSheet() {
    const [isOpen, setIsOpen] = useState(false);
    const [log, setLog] = useState<string[]>([]);

    const addLog = (message: string): void => {
      setLog((prev) => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
    };

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open with Callbacks</Button>
        <div style={{ marginTop: '1rem', fontFamily: 'monospace', fontSize: '12px' }}>
          <strong>Event Log:</strong>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0.5rem 0' }}>
            {log.map((entry) => (
              <li key={entry}>{entry}</li>
            ))}
          </ul>
          <Button variant="outline-secondary" size="sm" onClick={() => setLog([])}>
            Clear Log
          </Button>
        </div>
        <Sheet
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onOpened={() => addLog('Sheet fully opened')}
          onClosed={() => addLog('Sheet fully closed')}
        >
          <Sheet.Header>Lifecycle Callbacks</Sheet.Header>
          <Sheet.Body>
            <Text>This sheet logs lifecycle events.</Text>
            <Text>Check the event log below the button.</Text>
          </Sheet.Body>
          <Sheet.Footer>
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </Sheet.Footer>
        </Sheet>
      </>
    );
  },
};

// =============================================================================
// Accessibility Demo
// =============================================================================

/**
 * Demonstrates accessibility features
 */
export const AccessibilityDemo: Story = {
  render: function AccessibilityDemoSheet() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Accessibility Demo</Button>
        <Sheet isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <Sheet.Header>
            <Sheet.Title>Accessibility Features</Sheet.Title>
          </Sheet.Header>
          <Sheet.Body>
            <Heading level={6}>ARIA Attributes</Heading>
            <ul>
              <li>
                <code>role=&quot;dialog&quot;</code> - Identifies as dialog
              </li>
              <li>
                <code>aria-modal=&quot;true&quot;</code> - Indicates modal context
              </li>
              <li>
                <code>aria-labelledby</code> - Points to title
              </li>
              <li>
                <code>aria-describedby</code> - Points to body
              </li>
            </ul>

            <Heading level={6}>Keyboard Navigation</Heading>
            <ul>
              <li>
                <kbd>Tab</kbd> - Move to next focusable element
              </li>
              <li>
                <kbd>Shift + Tab</kbd> - Move to previous element
              </li>
              <li>
                <kbd>Escape</kbd> - Close sheet
              </li>
            </ul>

            <Heading level={6}>Focus Management</Heading>
            <ul>
              <li>Focus trap keeps Tab cycling within sheet</li>
              <li>First focusable element receives initial focus</li>
              <li>Focus returns to trigger when closed</li>
            </ul>

            <Heading level={6}>Motion Preferences</Heading>
            <ul>
              <li>
                Respects <code>prefers-reduced-motion</code>
              </li>
              <li>Animations disabled when user prefers reduced motion</li>
            </ul>
          </Sheet.Body>
          <Sheet.Footer>
            <Button variant="primary" onClick={() => setIsOpen(false)}>
              Got It
            </Button>
          </Sheet.Footer>
        </Sheet>
      </>
    );
  },
};
