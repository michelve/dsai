import { Badge, Button, Dropdown, Navbar, PlusSquareIcon, Text } from '@dsai-io/react';
import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';

/**
 * Navbar component for responsive navigation headers.
 * Built with Bootstrap 5 design tokens and FSM-driven collapse animations.
 *
 * Features:
 * - Responsive design with configurable breakpoints
 * - Smooth collapse/expand animations via CSS transitions
 * - Full keyboard navigation (Tab, Enter, Space, Escape, Arrow/Home/End within nav)
 * - FSM state management for visual states
 * - Controlled and uncontrolled modes
 * - Light and dark color schemes
 * - Multiple positioning options (static, fixed, sticky)
 *
 * @see https://getbootstrap.com/docs/5.3/components/navbar/
 */

const meta: Meta<typeof Navbar> = {
  title: 'Components/Navbar',
  component: Navbar,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A fully accessible responsive navigation header with collapsible mobile menu, ' +
          'keyboard navigation, and smooth animations. Supports branding, nav links, and forms.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    expand: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', 'xxl', true, false],
      description: 'Breakpoint at which navbar expands to horizontal layout',
      table: {
        type: { summary: "'sm' | 'md' | 'lg' | 'xl' | 'xxl' | boolean" },
        defaultValue: { summary: 'lg' },
      },
    },
    variant: {
      control: 'radio',
      options: ['light', 'dark'],
      description: 'Color scheme variant',
      table: {
        type: { summary: "'light' | 'dark'" },
        defaultValue: { summary: 'light' },
      },
    },
    bg: {
      control: 'select',
      options: [
        'body-tertiary',
        'primary',
        'secondary',
        'success',
        'danger',
        'warning',
        'info',
        'light',
        'dark',
        'white',
        'transparent',
      ],
      description: 'Background color',
      table: {
        type: { summary: 'NavbarBackground' },
        defaultValue: { summary: 'body-tertiary' },
      },
    },
    placement: {
      control: 'select',
      options: ['static', 'fixed-top', 'fixed-bottom', 'sticky-top', 'sticky-bottom'],
      description: 'Navbar positioning',
      table: {
        type: { summary: 'NavbarPlacement' },
        defaultValue: { summary: 'static' },
      },
    },
    orientation: {
      control: 'radio',
      options: ['horizontal', 'vertical'],
      description: 'Orientation hint for keyboard navigation (affects arrow key directions)',
      table: {
        type: { summary: "'horizontal' | 'vertical'" },
        defaultValue: { summary: 'horizontal' },
      },
    },
    fluid: {
      control: 'boolean',
      description: 'Use container-fluid (full-width)',
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
// Basic Navbar
// =============================================================================

/**
 * Basic navbar with brand and navigation links.
 * Collapses to hamburger menu below the 'lg' breakpoint by default.
 */
export const Basic: Story = {
  render: function BasicNavbar() {
    return (
      <Navbar aria-label="Basic navigation example">
        <Navbar.Brand href="#">Navbar</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Navbar.Nav>
            <Navbar.Link href="#" active>
              Home
            </Navbar.Link>
            <Navbar.Link href="#">Features</Navbar.Link>
            <Navbar.Link href="#">Pricing</Navbar.Link>
            <Navbar.Link href="#" disabled>
              Disabled
            </Navbar.Link>
          </Navbar.Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  },
};

// =============================================================================
// With Logo
// =============================================================================

/**
 * Navbar with brand logo and text
 */
export const WithLogo: Story = {
  render: function LogoNavbar() {
    return (
      <Navbar aria-label="Logo navigation example">
        <Navbar.Brand href="#">
          <PlusSquareIcon
            size={24}
            style={{ marginRight: '0.5rem', verticalAlign: 'text-bottom' }}
          />
          DSAi
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Navbar.Nav>
            <Navbar.Link href="#" active>
              Components
            </Navbar.Link>
            <Navbar.Link href="#">Documentation</Navbar.Link>
            <Navbar.Link href="#">Examples</Navbar.Link>
          </Navbar.Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  },
};

// =============================================================================
// Dark Variant
// =============================================================================

/**
 * Dark navbar with dark background
 */
export const DarkVariant: Story = {
  render: function DarkNavbar() {
    return (
      <Navbar variant="dark" bg="dark" aria-label="Dark theme navigation example">
        <Navbar.Brand href="#">Dark Navbar</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Navbar.Nav>
            <Navbar.Link href="#" active>
              Home
            </Navbar.Link>
            <Navbar.Link href="#">Features</Navbar.Link>
            <Navbar.Link href="#">Pricing</Navbar.Link>
            <Navbar.Link href="#" disabled>
              Disabled
            </Navbar.Link>
          </Navbar.Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  },
};

// =============================================================================
// Color Variants
// =============================================================================

/**
 * Navbars with different background colors
 */
export const ColorVariants: Story = {
  render: function ColorVariantsNavbar() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Navbar bg="primary" variant="dark" aria-label="Primary color navigation">
          <Navbar.Brand href="#">Primary</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse>
            <Navbar.Nav>
              <Navbar.Link href="#" active>
                Home
              </Navbar.Link>
              <Navbar.Link href="#">Link</Navbar.Link>
            </Navbar.Nav>
          </Navbar.Collapse>
        </Navbar>

        <Navbar bg="success" variant="dark" aria-label="Success color navigation">
          <Navbar.Brand href="#">Success</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse>
            <Navbar.Nav>
              <Navbar.Link href="#" active>
                Home
              </Navbar.Link>
              <Navbar.Link href="#">Link</Navbar.Link>
            </Navbar.Nav>
          </Navbar.Collapse>
        </Navbar>

        <Navbar bg="warning" variant="light" aria-label="Warning color navigation">
          <Navbar.Brand href="#">Warning</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse>
            <Navbar.Nav>
              <Navbar.Link href="#" active>
                Home
              </Navbar.Link>
              <Navbar.Link href="#">Link</Navbar.Link>
            </Navbar.Nav>
          </Navbar.Collapse>
        </Navbar>

        <Navbar bg="info" variant="dark" aria-label="Info color navigation">
          <Navbar.Brand href="#">Info</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse>
            <Navbar.Nav>
              <Navbar.Link href="#" active>
                Home
              </Navbar.Link>
              <Navbar.Link href="#">Link</Navbar.Link>
            </Navbar.Nav>
          </Navbar.Collapse>
        </Navbar>

        <Navbar bg="danger" variant="dark" aria-label="Danger color navigation">
          <Navbar.Brand href="#">Danger</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse>
            <Navbar.Nav>
              <Navbar.Link href="#" active>
                Home
              </Navbar.Link>
              <Navbar.Link href="#">Link</Navbar.Link>
            </Navbar.Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>
    );
  },
};

// =============================================================================
// Responsive Breakpoints
// =============================================================================

/**
 * Navbars with different expand breakpoints
 */
export const ResponsiveBreakpoints: Story = {
  render: function BreakpointsNavbar() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Navbar expand="sm" aria-label="Small breakpoint navigation">
          <Navbar.Brand href="#">expand=&quot;sm&quot;</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse>
            <Navbar.Nav>
              <Navbar.Link href="#" active>
                Home
              </Navbar.Link>
              <Navbar.Link href="#">Link</Navbar.Link>
            </Navbar.Nav>
            <Navbar.Text>Expands ≥576px</Navbar.Text>
          </Navbar.Collapse>
        </Navbar>

        <Navbar expand="md" aria-label="Medium breakpoint navigation">
          <Navbar.Brand href="#">expand=&quot;md&quot;</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse>
            <Navbar.Nav>
              <Navbar.Link href="#" active>
                Home
              </Navbar.Link>
              <Navbar.Link href="#">Link</Navbar.Link>
            </Navbar.Nav>
            <Navbar.Text>Expands ≥768px</Navbar.Text>
          </Navbar.Collapse>
        </Navbar>

        <Navbar expand="lg" aria-label="Large breakpoint navigation">
          <Navbar.Brand href="#">expand=&quot;lg&quot; (default)</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse>
            <Navbar.Nav>
              <Navbar.Link href="#" active>
                Home
              </Navbar.Link>
              <Navbar.Link href="#">Link</Navbar.Link>
            </Navbar.Nav>
            <Navbar.Text>Expands ≥992px</Navbar.Text>
          </Navbar.Collapse>
        </Navbar>

        <Navbar expand={false} aria-label="Always collapsed navigation">
          <Navbar.Brand href="#">expand=false (always collapsed)</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse>
            <Navbar.Nav>
              <Navbar.Link href="#" active>
                Home
              </Navbar.Link>
              <Navbar.Link href="#">Link</Navbar.Link>
            </Navbar.Nav>
            <Navbar.Text>Always uses hamburger menu</Navbar.Text>
          </Navbar.Collapse>
        </Navbar>
      </div>
    );
  },
};

// =============================================================================
// Controlled Navbar
// =============================================================================

/**
 * Controlled navbar with external state management
 */
export const Controlled: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story:
          'Controlled navbar with external state management. ' +
          'Resize viewport to mobile to see the collapse behavior, or use the viewport control.',
      },
    },
  },
  render: function ControlledNavbar() {
    const [expanded, setExpanded] = useState(false);

    return (
      <div>
        <div style={{ padding: '1rem', background: 'var(--bs-gray-100)', marginBottom: '0' }}>
          <strong>External Controls:</strong>
          <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <Button size="sm" variant="outline-primary" onClick={() => setExpanded(true)}>
              Open Menu
            </Button>
            <Button size="sm" variant="outline-secondary" onClick={() => setExpanded(false)}>
              Close Menu
            </Button>
            <Button size="sm" variant="outline-info" onClick={() => setExpanded((prev) => !prev)}>
              Toggle
            </Button>
          </div>
          <div style={{ marginTop: '0.5rem' }}>
            <strong>State:</strong> {expanded ? 'Expanded' : 'Collapsed'}
          </div>
          <Text size="sm" color="muted">
            Use the viewport control in the toolbar to switch to mobile view and see the collapse
            behavior.
          </Text>
        </div>
        <Navbar
          expand="lg"
          expanded={expanded}
          onExpandedChange={setExpanded}
          aria-label="Controlled navigation example"
        >
          <Navbar.Brand href="#">Controlled</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse>
            <Navbar.Nav>
              <Navbar.Link href="#" active>
                Home
              </Navbar.Link>
              <Navbar.Link href="#">Features</Navbar.Link>
              <Navbar.Link href="#">Pricing</Navbar.Link>
            </Navbar.Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>
    );
  },
};

// =============================================================================
// Default Expanded
// =============================================================================

/**
 * Navbar with menu expanded by default (uncontrolled)
 */
export const DefaultExpanded: Story = {
  render: function DefaultExpandedNavbar() {
    return (
      <Navbar expand="lg" defaultExpanded aria-label="Default expanded navigation example">
        <Navbar.Brand href="#">Default Expanded</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Navbar.Nav>
            <Navbar.Link href="#" active>
              Home
            </Navbar.Link>
            <Navbar.Link href="#">Features</Navbar.Link>
            <Navbar.Link href="#">Pricing</Navbar.Link>
          </Navbar.Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  },
};

// =============================================================================
// With Search Form
// =============================================================================

/**
 * Navbar with search form
 */
export const WithSearchForm: Story = {
  render: function SearchNavbar() {
    return (
      <Navbar aria-label="Navigation with search form">
        <Navbar.Brand href="#">Navbar</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Navbar.Nav>
            <Navbar.Link href="#" active>
              Home
            </Navbar.Link>
            <Navbar.Link href="#">Link</Navbar.Link>
          </Navbar.Nav>
          <form className="d-flex ms-auto" aria-label="Search">
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
            />
            <Button type="submit" variant="outline-success">
              Search
            </Button>
          </form>
        </Navbar.Collapse>
      </Navbar>
    );
  },
};

// =============================================================================
// With Navbar.Text
// =============================================================================

/**
 * Navbar with inline text
 */
export const WithText: Story = {
  render: function TextNavbar() {
    return (
      <Navbar aria-label="Navigation with user info">
        <Navbar.Brand href="#">Navbar</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Navbar.Nav>
            <Navbar.Link href="#" active>
              Home
            </Navbar.Link>
            <Navbar.Link href="#">Features</Navbar.Link>
          </Navbar.Nav>
          <Navbar.Text className="ms-auto">
            Signed in as: <a href="/profile">Mark Otto</a>
          </Navbar.Text>
        </Navbar.Collapse>
      </Navbar>
    );
  },
};

// =============================================================================
// With Badges
// =============================================================================

/**
 * Navbar with notification badges on links
 */
export const WithBadges: Story = {
  render: function BadgeNavbar() {
    return (
      <Navbar aria-label="Navigation with notification badges">
        <Navbar.Brand href="#">DSAi</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Navbar.Nav>
            <Navbar.Link href="#" active>
              Dashboard
            </Navbar.Link>
            <Navbar.Link href="#">
              Notifications <Badge variant="danger">5</Badge>
            </Navbar.Link>
            <Navbar.Link href="#">
              Messages <Badge variant="primary">New</Badge>
            </Navbar.Link>
            <Navbar.Link href="#">Settings</Navbar.Link>
          </Navbar.Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  },
};

// =============================================================================
// With Dropdown (using Dropdown component)
// =============================================================================

/**
 * Navbar with dropdown menu
 */
export const WithDropdown: Story = {
  render: function DropdownNavbar() {
    return (
      <Navbar aria-label="Navigation with dropdown menu">
        <Navbar.Brand href="#">Navbar</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Navbar.Nav>
            <Navbar.Link href="#" active>
              Home
            </Navbar.Link>
            <Navbar.Link href="#">Link</Navbar.Link>
            <Navbar.Item dropdown>
              <Dropdown>
                <Dropdown.Toggle variant="link" className="nav-link">
                  Dropdown
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item href="#">Action</Dropdown.Item>
                  <Dropdown.Item href="#">Another action</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item href="#">Something else</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Navbar.Item>
          </Navbar.Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  },
};

// =============================================================================
// Container Options
// =============================================================================

/**
 * Navbar with different container options
 */
export const ContainerOptions: Story = {
  render: function ContainerNavbar() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <p className="mb-2 px-3">
            <strong>fluid=true</strong> (default - full width)
          </p>
          <Navbar fluid aria-label="Fluid container navigation">
            <Navbar.Brand href="#">Fluid Container</Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse>
              <Navbar.Nav>
                <Navbar.Link href="#" active>
                  Home
                </Navbar.Link>
                <Navbar.Link href="#">Link</Navbar.Link>
              </Navbar.Nav>
            </Navbar.Collapse>
          </Navbar>
        </div>

        <div>
          <p className="mb-2 px-3">
            <strong>fluid=false</strong> (uses .container)
          </p>
          <Navbar fluid={false} aria-label="Fixed container navigation">
            <Navbar.Brand href="#">Fixed Container</Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse>
              <Navbar.Nav>
                <Navbar.Link href="#" active>
                  Home
                </Navbar.Link>
                <Navbar.Link href="#">Link</Navbar.Link>
              </Navbar.Nav>
            </Navbar.Collapse>
          </Navbar>
        </div>

        <div>
          <p className="mb-2 px-3">
            <strong>container=&quot;md&quot;</strong> (uses .container-md)
          </p>
          <Navbar fluid={false} container="md" aria-label="Medium container navigation">
            <Navbar.Brand href="#">MD Container</Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse>
              <Navbar.Nav>
                <Navbar.Link href="#" active>
                  Home
                </Navbar.Link>
                <Navbar.Link href="#">Link</Navbar.Link>
              </Navbar.Nav>
            </Navbar.Collapse>
          </Navbar>
        </div>
      </div>
    );
  },
};

// =============================================================================
// External Links
// =============================================================================

/**
 * Navbar with external links (opens in new tab with security attributes)
 */
export const ExternalLinks: Story = {
  render: function ExternalLinksNavbar() {
    return (
      <Navbar aria-label="Navigation with external links">
        <Navbar.Brand href="#">DSAi</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Navbar.Nav>
            <Navbar.Link href="#" active>
              Home
            </Navbar.Link>
            <Navbar.Link href="https://github.com" target="_blank">
              GitHub ↗
            </Navbar.Link>
            <Navbar.Link href="https://getbootstrap.com" target="_blank">
              Bootstrap ↗
            </Navbar.Link>
          </Navbar.Nav>
          <Navbar.Text className="ms-auto">
            External links automatically get <code>rel=&quot;noopener noreferrer&quot;</code>
          </Navbar.Text>
        </Navbar.Collapse>
      </Navbar>
    );
  },
};

// =============================================================================
// Keyboard Navigation Demo
// =============================================================================

/**
 * Demonstrates keyboard navigation capabilities
 */
export const KeyboardNavigation: Story = {
  render: function KeyboardNavigationNavbar() {
    return (
      <div>
        <div className="alert alert-info m-3" role="alert">
          <strong>Keyboard Navigation:</strong>
          <ul className="mb-0">
            <li>
              <kbd>Tab</kbd> / <kbd>Shift+Tab</kbd> - Navigate between interactive elements
            </li>
            <li>
              <kbd>Enter</kbd> or <kbd>Space</kbd> - Activate links or toggle menu
            </li>
            <li>
              <kbd>Escape</kbd> - Close expanded menu when focus is inside the navbar
            </li>
            <li>
              <kbd>Arrow</kbd>, <kbd>Home</kbd>, <kbd>End</kbd> - Move focus between links inside
              the nav list (wraps)
            </li>
          </ul>
        </div>
        <Navbar aria-label="Keyboard navigation demo">
          <Navbar.Brand href="#">Keyboard Demo</Navbar.Brand>
          <Navbar.Toggle aria-label="Toggle navigation menu" />
          <Navbar.Collapse>
            <Navbar.Nav>
              <Navbar.Link href="#" active>
                First Link (Tab here)
              </Navbar.Link>
              <Navbar.Link href="#">Second Link</Navbar.Link>
              <Navbar.Link href="#">Third Link</Navbar.Link>
              <Navbar.Link href="#" disabled>
                Disabled (skipped in tab order)
              </Navbar.Link>
            </Navbar.Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>
    );
  },
};

// =============================================================================
// Visual States
// =============================================================================

/**
 * Shows the data-visual-state attribute for styling and testing
 */
export const VisualStates: Story = {
  render: function VisualStatesNavbar() {
    return (
      <div>
        <div className="alert alert-secondary m-3" role="alert">
          <strong>Visual States:</strong> The Navbar.Collapse component has a{' '}
          <code>data-visual-state</code> attribute for custom styling or testing. States:{' '}
          <code>collapsed</code>, <code>expanding</code>, <code>expanded</code>,{' '}
          <code>collapsing</code>
        </div>
        <Navbar expand="lg" aria-label="Visual states demo navigation">
          <Navbar.Brand href="#">Visual States Demo</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse>
            <Navbar.Nav>
              <Navbar.Link href="#" active>
                Home
              </Navbar.Link>
              <Navbar.Link href="#">Features</Navbar.Link>
              <Navbar.Link href="#">Pricing</Navbar.Link>
            </Navbar.Nav>
            <Navbar.Text className="ms-auto">
              Inspect the collapse element to see <code>data-visual-state</code>
            </Navbar.Text>
          </Navbar.Collapse>
        </Navbar>
      </div>
    );
  },
};

// =============================================================================
// Active Link States
// =============================================================================

/**
 * Demonstrates active and disabled link states
 */
export const LinkStates: Story = {
  render: function LinkStatesNavbar() {
    return (
      <Navbar aria-label="Link states demo navigation">
        <Navbar.Brand href="#">Link States</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Navbar.Nav>
            <Navbar.Link href="#" active>
              Active (aria-current=&quot;page&quot;)
            </Navbar.Link>
            <Navbar.Link href="#">Normal</Navbar.Link>
            <Navbar.Link href="#">Normal</Navbar.Link>
            <Navbar.Link href="#" disabled>
              Disabled
            </Navbar.Link>
          </Navbar.Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  },
};

// =============================================================================
// Complex Layout
// =============================================================================

/**
 * Complex navbar with brand, links, dropdown, form, and text
 */
export const ComplexLayout: Story = {
  render: function ComplexNavbar() {
    return (
      <Navbar variant="dark" bg="dark" aria-label="Complex layout navigation">
        <Navbar.Brand href="#">
          <PlusSquareIcon size={24} style={{ marginRight: '0.5rem' }} />
          Company
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Navbar.Nav>
            <Navbar.Link href="#" active>
              Dashboard
            </Navbar.Link>
            <Navbar.Link href="#">Products</Navbar.Link>
            <Navbar.Link href="#">Analytics</Navbar.Link>
            <Navbar.Item dropdown>
              <Dropdown>
                <Dropdown.Toggle variant="link" className="nav-link text-white">
                  More ▼
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item href="#">Settings</Dropdown.Item>
                  <Dropdown.Item href="#">Team</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item href="#">Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Navbar.Item>
          </Navbar.Nav>
          <form className="d-flex ms-auto me-3" aria-label="Search">
            <input
              className="form-control form-control-sm me-2"
              type="search"
              placeholder="Search..."
              aria-label="Search"
            />
            <Button type="submit" size="sm" variant="outline-light">
              Go
            </Button>
          </form>
          <Navbar.Text>
            <Badge variant="success">Online</Badge>
          </Navbar.Text>
        </Navbar.Collapse>
      </Navbar>
    );
  },
};

// =============================================================================
// Scrolling Nav
// =============================================================================

/**
 * Navbar.Nav with scroll enabled for long menus
 */
export const ScrollingNav: Story = {
  render: function ScrollingNavbar() {
    return (
      <Navbar aria-label="Scrolling navigation example">
        <Navbar.Brand href="#">Scrolling Nav</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Navbar.Nav scroll scrollHeight="200px">
            <Navbar.Link href="#" active>
              Home
            </Navbar.Link>
            <Navbar.Link href="#">Link 1</Navbar.Link>
            <Navbar.Link href="#">Link 2</Navbar.Link>
            <Navbar.Link href="#">Link 3</Navbar.Link>
            <Navbar.Link href="#">Link 4</Navbar.Link>
            <Navbar.Link href="#">Link 5</Navbar.Link>
            <Navbar.Link href="#">Link 6</Navbar.Link>
            <Navbar.Link href="#">Link 7</Navbar.Link>
            <Navbar.Link href="#">Link 8</Navbar.Link>
            <Navbar.Link href="#">Link 9</Navbar.Link>
            <Navbar.Link href="#">Link 10</Navbar.Link>
          </Navbar.Nav>
          <Navbar.Text className="ms-auto">
            Nav scrolls when content exceeds <code>scrollHeight</code>
          </Navbar.Text>
        </Navbar.Collapse>
      </Navbar>
    );
  },
};

// =============================================================================
// Custom Brand Click
// =============================================================================

/**
 * Navbar.Brand with custom onClick handler (no href)
 */
export const CustomBrandClick: Story = {
  render: function CustomBrandNavbar() {
    const [clicks, setClicks] = useState(0);

    return (
      <div>
        <Navbar aria-label="Custom brand click navigation">
          <Navbar.Brand onClick={() => setClicks((c) => c + 1)} style={{ cursor: 'pointer' }}>
            Click Me Brand
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse>
            <Navbar.Nav>
              <Navbar.Link href="#" active>
                Home
              </Navbar.Link>
              <Navbar.Link href="#">Features</Navbar.Link>
            </Navbar.Nav>
            <Navbar.Text className="ms-auto">Brand clicks: {clicks}</Navbar.Text>
          </Navbar.Collapse>
        </Navbar>
        <div className="p-3">
          <p>
            When <code>Navbar.Brand</code> has no <code>href</code> but has an <code>onClick</code>,
            it renders as a button for proper accessibility.
          </p>
        </div>
      </div>
    );
  },
};

// =============================================================================
// With Callback
// =============================================================================

/**
 * Navbar with onExpandedChange callback for tracking state changes
 */
export const WithCallback: Story = {
  render: function CallbackNavbar() {
    const [events, setEvents] = useState<string[]>([]);

    const addEvent = (event: string): void => {
      setEvents((prev) => [...prev.slice(-4), event]);
    };

    return (
      <div>
        <Navbar
          expand="lg"
          onExpandedChange={(expanded: boolean) =>
            addEvent(`Menu: ${expanded ? 'opened' : 'closed'}`)
          }
          aria-label="Callback demo navigation"
        >
          <Navbar.Brand href="#">Callback Demo</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse>
            <Navbar.Nav>
              <Navbar.Link href="#" active>
                Home
              </Navbar.Link>
              <Navbar.Link href="#">Features</Navbar.Link>
              <Navbar.Link href="#">Pricing</Navbar.Link>
            </Navbar.Nav>
          </Navbar.Collapse>
        </Navbar>
        <div
          style={{
            margin: '1rem',
            padding: '0.5rem',
            background: 'var(--bs-gray-100)',
            borderRadius: 'var(--sb-border-radius-sm)',
            fontFamily: 'monospace',
            fontSize: '0.875rem',
          }}
        >
          <strong>Events:</strong>
          <ul style={{ margin: 0, padding: '0.5rem 0 0 1.5rem' }}>
            {events.length === 0 ? (
              <li style={{ color: 'var(--bs-secondary)' }}>Toggle the menu to see events...</li>
            ) : (
              events.map((event, i) => <li key={`event-${i}-${event}`}>{event}</li>)
            )}
          </ul>
        </div>
      </div>
    );
  },
};

// =============================================================================
// Accessibility Demo
// =============================================================================

/**
 * Demonstrates accessibility features of the Navbar
 */
export const AccessibilityDemo: Story = {
  render: function AccessibilityNavbar() {
    return (
      <div>
        <div className="alert alert-success m-3" role="alert">
          <strong>Accessibility Features:</strong>
          <ul className="mb-0">
            <li>
              <code>aria-label</code> on the nav element for screen readers
            </li>
            <li>
              <code>aria-expanded</code> on toggle button shows collapse state
            </li>
            <li>
              <code>aria-controls</code> links toggle to collapse content
            </li>
            <li>
              <code>aria-current=&quot;page&quot;</code> on active links
            </li>
            <li>Disabled links are not in tab order</li>
            <li>Semantic HTML structure (nav, ul/li/a) instead of menubar roles</li>
          </ul>
        </div>
        <Navbar aria-label="Main site navigation">
          <Navbar.Brand href="#">Accessible Navbar</Navbar.Brand>
          <Navbar.Toggle aria-label="Toggle main navigation menu" />
          <Navbar.Collapse>
            <Navbar.Nav>
              <Navbar.Link href="#" active>
                Home (aria-current=&quot;page&quot;)
              </Navbar.Link>
              <Navbar.Link href="#">About</Navbar.Link>
              <Navbar.Link href="#">Contact</Navbar.Link>
              <Navbar.Link href="#" disabled>
                Disabled (tabindex=-1)
              </Navbar.Link>
            </Navbar.Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>
    );
  },
};
