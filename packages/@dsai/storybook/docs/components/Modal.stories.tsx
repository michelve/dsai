import { Button, Modal } from '@dsai/react';
import { useRef, useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';

/**
 * Modal component for displaying dialog content with backdrop, focus management,
 * and full accessibility support. Built with Bootstrap 5 design tokens.
 *
 * Features:
 * - Portal rendering for proper z-index isolation
 * - Focus trap with Tab key cycling
 * - ESC key to close
 * - Scroll lock when open
 * - Compound components (Modal.Header, Modal.Body, Modal.Footer, Modal.Title)
 * - Multiple sizes (sm, md, lg, xl, fullscreen)
 * - FSM state management for animations
 *
 * @see https://getbootstrap.com/docs/5.3/components/modal/
 */

const meta: Meta<typeof Modal> = {
  title: 'Components/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A fully accessible modal dialog component with portal rendering, focus management, ' +
          'scroll locking, and animations. Supports various sizes and fullscreen options.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: 'Whether the modal is open',
      table: {
        type: { summary: 'boolean' },
      },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', 'fullscreen'],
      description: 'Modal size',
      table: {
        type: { summary: 'ModalSize' },
        defaultValue: { summary: 'md' },
      },
    },
    centered: {
      control: 'boolean',
      description: 'Vertically center the modal',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    scrollable: {
      control: 'boolean',
      description: 'Enable scrollable body',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
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
      description: 'Show backdrop',
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
      description: 'Enable animations',
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
// Basic Modal
// =============================================================================

/**
 * Basic modal with header, body, and footer
 */
export const Basic: Story = {
  render: function BasicModal() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <Modal.Header>Modal Title</Modal.Header>
          <Modal.Body>
            <p>This is the modal body content. You can put any content here.</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setIsOpen(false)}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  },
};

// =============================================================================
// Sizes
// =============================================================================

/**
 * Small modal
 */
export const Small: Story = {
  render: function SmallModal() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Small Modal</Button>
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} size="sm">
          <Modal.Header>Small Modal</Modal.Header>
          <Modal.Body>
            <p>This is a small modal with reduced width.</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  },
};

/**
 * Large modal
 */
export const Large: Story = {
  render: function LargeModal() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Large Modal</Button>
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} size="lg">
          <Modal.Header>Large Modal</Modal.Header>
          <Modal.Body>
            <p>This is a large modal with increased width for more content.</p>
            <p>
              You might use this for forms, detailed information, or any content that needs more
              horizontal space.
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  },
};

/**
 * Extra large modal
 */
export const ExtraLarge: Story = {
  render: function ExtraLargeModal() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Extra Large Modal</Button>
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} size="xl">
          <Modal.Header>Extra Large Modal</Modal.Header>
          <Modal.Body>
            <p>This is an extra large modal for maximum content width.</p>
            <p>Ideal for dashboards, data tables, or complex forms.</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  },
};

/**
 * Fullscreen modal
 */
export const Fullscreen: Story = {
  render: function FullscreenModal() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Fullscreen Modal</Button>
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} size="fullscreen">
          <Modal.Header>Fullscreen Modal</Modal.Header>
          <Modal.Body>
            <p>This modal takes up the entire screen.</p>
            <p>Perfect for immersive experiences or complex workflows.</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  },
};

/**
 * Responsive fullscreen modal (fullscreen below breakpoint)
 */
export const ResponsiveFullscreen: Story = {
  render: function ResponsiveFullscreenModal() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Fullscreen Below MD</Button>
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          size="fullscreen"
          fullscreenBreakpoint="md-down"
        >
          <Modal.Header>Responsive Fullscreen</Modal.Header>
          <Modal.Body>
            <p>This modal is fullscreen on medium and smaller screens.</p>
            <p>Resize your browser to see the effect.</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  },
};

// =============================================================================
// Centered Modal
// =============================================================================

/**
 * Vertically centered modal
 */
export const Centered: Story = {
  render: function CenteredModal() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Centered Modal</Button>
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} centered>
          <Modal.Header>Centered Modal</Modal.Header>
          <Modal.Body>
            <p>This modal is vertically centered in the viewport.</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  },
};

// =============================================================================
// Scrollable Modal
// =============================================================================

/**
 * Scrollable modal with long content
 */
export const Scrollable: Story = {
  render: function ScrollableModal() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Scrollable Modal</Button>
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} scrollable>
          <Modal.Header>Scrollable Modal</Modal.Header>
          <Modal.Body>
            {Array.from({ length: 20 }, (_, i) => (
              <p key={i}>
                Paragraph {i + 1}: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            ))}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </>
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
  render: function StaticBackdropModal() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Static Backdrop</Button>
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} staticBackdrop>
          <Modal.Header>Static Backdrop</Modal.Header>
          <Modal.Body>
            <p>Clicking the backdrop will not close this modal.</p>
            <p>Instead, the modal will briefly highlight to indicate the action.</p>
            <p>Use the close button or ESC key to close.</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  },
};

// =============================================================================
// Without Close Button
// =============================================================================

/**
 * Modal without close button in header
 */
export const NoCloseButton: Story = {
  render: function NoCloseButtonModal() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>No Close Button</Button>
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <Modal.Header closeButton={false}>No Header Close Button</Modal.Header>
          <Modal.Body>
            <p>This modal has no close button in the header.</p>
            <p>Users must use the footer buttons or ESC key to close.</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  },
};

// =============================================================================
// No ESC Key
// =============================================================================

/**
 * Modal that cannot be closed with ESC key
 */
export const NoEscapeClose: Story = {
  render: function NoEscapeCloseModal() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>No ESC Close</Button>
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} closeOnEscape={false}>
          <Modal.Header>ESC Disabled</Modal.Header>
          <Modal.Body>
            <p>Pressing ESC will not close this modal.</p>
            <p>Use the close button instead.</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  },
};

// =============================================================================
// Custom Focus
// =============================================================================

/**
 * Modal with custom initial focus
 */
export const CustomInitialFocus: Story = {
  render: function CustomInitialFocusModal() {
    const [isOpen, setIsOpen] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Custom Focus</Button>
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} initialFocusRef={inputRef}>
          <Modal.Header>Custom Initial Focus</Modal.Header>
          <Modal.Body>
            <p>The input below receives focus when the modal opens:</p>
            <input
              ref={inputRef}
              type="text"
              className="form-control"
              placeholder="I get focused first!"
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setIsOpen(false)}>
              Submit
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  },
};

// =============================================================================
// Return Focus
// =============================================================================

/**
 * Modal with focus returning to trigger
 */
export const ReturnFocus: Story = {
  render: function ReturnFocusModal() {
    const [isOpen, setIsOpen] = useState(false);
    const triggerRef = useRef<HTMLButtonElement>(null);

    return (
      <>
        <Button ref={triggerRef} onClick={() => setIsOpen(true)}>
          Return Focus Modal
        </Button>
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} returnFocusRef={triggerRef}>
          <Modal.Header>Return Focus</Modal.Header>
          <Modal.Body>
            <p>When this modal closes, focus will return to the trigger button.</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  },
};

// =============================================================================
// Form Modal
// =============================================================================

/**
 * Modal with a form
 */
export const FormModal: Story = {
  render: function FormModalExample() {
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
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <form onSubmit={handleSubmit}>
            <Modal.Header>Contact Form</Modal.Header>
            <Modal.Body>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" type="button" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Modal.Footer>
          </form>
        </Modal>
      </>
    );
  },
};

// =============================================================================
// Confirmation Modal
// =============================================================================

/**
 * Confirmation dialog modal
 */
export const Confirmation: Story = {
  render: function ConfirmationModal() {
    const [isOpen, setIsOpen] = useState(false);

    const handleConfirm = (): void => {
      // Confirmation logic would go here
      setIsOpen(false);
    };

    return (
      <>
        <Button variant="danger" onClick={() => setIsOpen(true)}>
          Delete Item
        </Button>
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} centered size="sm">
          <Modal.Header>Confirm Delete</Modal.Header>
          <Modal.Body>
            <p>Are you sure you want to delete this item? This action cannot be undone.</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleConfirm}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  },
};

// =============================================================================
// Nested Modals
// =============================================================================

/**
 * Nested modals with different z-indexes
 */
export const NestedModals: Story = {
  render: function NestedModalsExample() {
    const [isOpen1, setIsOpen1] = useState(false);
    const [isOpen2, setIsOpen2] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen1(true)}>Open First Modal</Button>

        <Modal isOpen={isOpen1} onClose={() => setIsOpen1(false)} zIndex={1055}>
          <Modal.Header>First Modal</Modal.Header>
          <Modal.Body>
            <p>This is the first modal. You can open another modal on top of it.</p>
            <Button variant="primary" onClick={() => setIsOpen2(true)}>
              Open Second Modal
            </Button>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setIsOpen1(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal isOpen={isOpen2} onClose={() => setIsOpen2(false)} zIndex={1065} centered>
          <Modal.Header>Second Modal</Modal.Header>
          <Modal.Body>
            <p>This is the second modal, displayed on top of the first.</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setIsOpen2(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  },
};

// =============================================================================
// All Sizes Showcase
// =============================================================================

/**
 * All modal sizes in one view
 */
export const AllSizes: Story = {
  render: function AllSizesShowcase() {
    const [openSize, setOpenSize] = useState<string | null>(null);

    const sizes = [
      { key: 'sm', label: 'Small' },
      { key: 'md', label: 'Medium (Default)' },
      { key: 'lg', label: 'Large' },
      { key: 'xl', label: 'Extra Large' },
      { key: 'fullscreen', label: 'Fullscreen' },
    ] as const;

    return (
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {sizes.map(({ key, label }) => (
          <div key={key}>
            <Button onClick={() => setOpenSize(key)}>{label}</Button>
            <Modal
              isOpen={openSize === key}
              onClose={() => setOpenSize(null)}
              size={key as 'sm' | 'md' | 'lg' | 'xl' | 'fullscreen'}
            >
              <Modal.Header>{label} Modal</Modal.Header>
              <Modal.Body>
                <p>This is a {label.toLowerCase()} modal.</p>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setOpenSize(null)}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
        ))}
      </div>
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
  render: function AccessibilityDemoModal() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Accessibility Demo</Button>
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <Modal.Header>
            <Modal.Title>Accessibility Features</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h6>ARIA Attributes</h6>
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

            <h6>Keyboard Navigation</h6>
            <ul>
              <li>
                <kbd>Tab</kbd> - Move to next focusable element
              </li>
              <li>
                <kbd>Shift + Tab</kbd> - Move to previous element
              </li>
              <li>
                <kbd>Escape</kbd> - Close modal
              </li>
            </ul>

            <h6>Focus Management</h6>
            <ul>
              <li>Focus trap keeps Tab cycling within modal</li>
              <li>First focusable element receives initial focus</li>
              <li>Focus returns to trigger when closed</li>
            </ul>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={() => setIsOpen(false)}>
              Got It
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  },
};
