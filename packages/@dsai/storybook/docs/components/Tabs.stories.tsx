import { Button, Tab, TabList, TabPanel, Tabs } from '@dsai/react';
import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';

/**
 * Tabs component for organizing content into selectable panels.
 * Built with Bootstrap 5 design tokens and WCAG 2.2 AA compliance.
 */
const meta: Meta<typeof Tabs> = {
  title: 'Components/Tabs',
  component: Tabs,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'An accessible tabbed interface supporting multiple variants, ' +
          'orientations, and compound component patterns.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['tabs', 'pills', 'underline'],
      description: 'Visual variant',
      table: {
        type: { summary: 'TabsVariant' },
        defaultValue: { summary: 'tabs' },
      },
    },
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Tab orientation',
      table: {
        type: { summary: 'TabsOrientation' },
        defaultValue: { summary: 'horizontal' },
      },
    },
    fill: {
      control: 'boolean',
      description: 'Fill available width',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    justified: {
      control: 'boolean',
      description: 'Evenly justify tabs',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Sample items for stories
const sampleItems = [
  {
    id: 'home',
    label: 'Home',
    content: (
      <div className="p-3">
        <h5>Home</h5>
        <p>Welcome to the home tab. This is where you can find an overview of your dashboard.</p>
      </div>
    ),
  },
  {
    id: 'profile',
    label: 'Profile',
    content: (
      <div className="p-3">
        <h5>Profile</h5>
        <p>Manage your profile settings and personal information here.</p>
      </div>
    ),
  },
  {
    id: 'settings',
    label: 'Settings',
    content: (
      <div className="p-3">
        <h5>Settings</h5>
        <p>Configure your application preferences and account settings.</p>
      </div>
    ),
  },
];

// =============================================================================
// Basic Examples
// =============================================================================

/**
 * Default tabs using items prop
 */
export const Default: Story = {
  args: {
    items: sampleItems,
  },
};

/**
 * Tabs using compound components
 */
export const CompoundComponents: Story = {
  render: () => (
    <Tabs defaultActiveTab="home">
      <TabList aria-label="Main navigation">
        <Tab id="home">Home</Tab>
        <Tab id="profile">Profile</Tab>
        <Tab id="settings">Settings</Tab>
      </TabList>
      <div className="tab-content mt-3">
        <TabPanel id="home">
          <div className="p-3 border rounded">
            <h5>Home Content</h5>
            <p>This is the home panel content using compound components.</p>
          </div>
        </TabPanel>
        <TabPanel id="profile">
          <div className="p-3 border rounded">
            <h5>Profile Content</h5>
            <p>This is the profile panel content.</p>
          </div>
        </TabPanel>
        <TabPanel id="settings">
          <div className="p-3 border rounded">
            <h5>Settings Content</h5>
            <p>This is the settings panel content.</p>
          </div>
        </TabPanel>
      </div>
    </Tabs>
  ),
};

// =============================================================================
// Variants
// =============================================================================

/**
 * Tab variants
 */
export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h6 className="mb-2">Tabs (default)</h6>
        <Tabs variant="tabs" items={sampleItems} />
      </div>
      <div>
        <h6 className="mb-2">Pills</h6>
        <Tabs variant="pills" items={sampleItems} />
      </div>
      <div>
        <h6 className="mb-2">Underline</h6>
        <Tabs variant="underline" items={sampleItems} />
      </div>
    </div>
  ),
};

/**
 * Pills variant
 */
export const Pills: Story = {
  args: {
    items: sampleItems,
    variant: 'pills',
  },
};

/**
 * Underline variant
 */
export const Underline: Story = {
  args: {
    items: sampleItems,
    variant: 'underline',
  },
};

// =============================================================================
// Orientation
// =============================================================================

/**
 * Vertical orientation
 */
export const Vertical: Story = {
  args: {
    items: sampleItems,
    orientation: 'vertical',
  },
};

/**
 * Vertical pills
 */
export const VerticalPills: Story = {
  args: {
    items: sampleItems,
    orientation: 'vertical',
    variant: 'pills',
  },
};

// =============================================================================
// Fill and Justified
// =============================================================================

/**
 * Fill tabs
 */
export const Fill: Story = {
  args: {
    items: sampleItems,
    fill: true,
  },
};

/**
 * Justified tabs
 */
export const Justified: Story = {
  args: {
    items: sampleItems,
    justified: true,
  },
};

// =============================================================================
// Controlled Mode
// =============================================================================

/**
 * Controlled tabs
 */
export const Controlled: Story = {
  render: function ControlledTabs() {
    const [activeTab, setActiveTab] = useState('home');

    return (
      <div>
        <Tabs activeTab={activeTab} onTabChange={setActiveTab} items={sampleItems} />
        <p className="mt-3 text-muted small">Active tab: {activeTab}</p>
        <div className="btn-group mt-2">
          <Button size="sm" variant="outline-primary" onClick={() => setActiveTab('home')}>
            Go to Home
          </Button>
          <Button size="sm" variant="outline-primary" onClick={() => setActiveTab('profile')}>
            Go to Profile
          </Button>
          <Button size="sm" variant="outline-primary" onClick={() => setActiveTab('settings')}>
            Go to Settings
          </Button>
        </div>
      </div>
    );
  },
};

// =============================================================================
// Disabled Tabs
// =============================================================================

/**
 * Disabled tabs
 */
export const DisabledTabs: Story = {
  args: {
    items: [
      { id: 'home', label: 'Home', content: <div className="p-3">Home content</div> },
      {
        id: 'disabled',
        label: 'Disabled',
        content: <div className="p-3">Disabled content</div>,
        disabled: true,
      },
      { id: 'settings', label: 'Settings', content: <div className="p-3">Settings content</div> },
    ],
  },
};

// =============================================================================
// With Icons
// =============================================================================

/**
 * Tabs with icons
 */
export const WithIcons: Story = {
  args: {
    items: [
      {
        id: 'home',
        label: 'Home',
        icon: (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5ZM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5 5 5Z" />
          </svg>
        ),
        content: <div className="p-3">Home content with icon</div>,
      },
      {
        id: 'profile',
        label: 'Profile',
        icon: (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z" />
          </svg>
        ),
        content: <div className="p-3">Profile content with icon</div>,
      },
      {
        id: 'settings',
        label: 'Settings',
        icon: (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z" />
            <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z" />
          </svg>
        ),
        content: <div className="p-3">Settings content with icon</div>,
      },
    ],
  },
};

// =============================================================================
// Card with Tabs
// =============================================================================

/**
 * Card with tabs
 */
export const CardWithTabs: Story = {
  render: () => (
    <div className="card">
      <div className="card-header">
        <Tabs
          variant="tabs"
          defaultActiveTab="overview"
          items={[
            {
              id: 'overview',
              label: 'Overview',
              content: (
                <div className="card-body">
                  <h5 className="card-title">Overview</h5>
                  <p className="card-text">
                    This is the overview content displayed in a card body.
                  </p>
                </div>
              ),
            },
            {
              id: 'details',
              label: 'Details',
              content: (
                <div className="card-body">
                  <h5 className="card-title">Details</h5>
                  <p className="card-text">Detailed information about the item.</p>
                </div>
              ),
            },
            {
              id: 'history',
              label: 'History',
              content: (
                <div className="card-body">
                  <h5 className="card-title">History</h5>
                  <p className="card-text">Historical data and changes.</p>
                </div>
              ),
            },
          ]}
        />
      </div>
    </div>
  ),
};

// =============================================================================
// Many Tabs
// =============================================================================

/**
 * Many tabs (scrollable)
 */
export const ManyTabs: Story = {
  args: {
    items: Array.from({ length: 10 }, (_, i) => ({
      id: `tab-${i + 1}`,
      label: `Tab ${i + 1}`,
      content: <div className="p-3">Content for Tab {i + 1}</div>,
    })),
  },
};

// =============================================================================
// Complete Showcase
// =============================================================================

/**
 * Complete tabs showcase
 */
export const CompleteShowcase: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      {/* Variants */}
      <section>
        <h4 className="mb-3">Variants</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <small className="text-muted d-block mb-1">Tabs</small>
            <Tabs variant="tabs" items={sampleItems.slice(0, 3)} />
          </div>
          <div>
            <small className="text-muted d-block mb-1">Pills</small>
            <Tabs variant="pills" items={sampleItems.slice(0, 3)} />
          </div>
          <div>
            <small className="text-muted d-block mb-1">Underline</small>
            <Tabs variant="underline" items={sampleItems.slice(0, 3)} />
          </div>
        </div>
      </section>

      {/* Vertical */}
      <section>
        <h4 className="mb-3">Vertical Orientation</h4>
        <Tabs orientation="vertical" variant="pills" items={sampleItems.slice(0, 3)} />
      </section>

      {/* Fill and Justified */}
      <section>
        <h4 className="mb-3">Fill & Justified</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <small className="text-muted d-block mb-1">Fill</small>
            <Tabs fill items={sampleItems.slice(0, 3)} />
          </div>
          <div>
            <small className="text-muted d-block mb-1">Justified</small>
            <Tabs justified items={sampleItems.slice(0, 3)} />
          </div>
        </div>
      </section>

      {/* States */}
      <section>
        <h4 className="mb-3">States</h4>
        <Tabs
          items={[
            { id: 'active', label: 'Active', content: <div className="p-3">Active tab</div> },
            { id: 'normal', label: 'Normal', content: <div className="p-3">Normal tab</div> },
            {
              id: 'disabled',
              label: 'Disabled',
              content: <div className="p-3">Disabled</div>,
              disabled: true,
            },
          ]}
        />
      </section>
    </div>
  ),
};
