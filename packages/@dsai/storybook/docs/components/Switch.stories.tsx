import { useState } from 'react';

import { Switch } from '@dsai/react';

import type { Meta, StoryObj } from '@storybook/react-vite';

/**
 * Switch component for binary on/off states.
 * Built with Bootstrap 5 design tokens and WCAG 2.2 AA compliance.
 */
const meta: Meta<typeof Switch> = {
  title: 'Components/Switch',
  component: Switch,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A toggle switch component for binary on/off states. ' +
          'Supports sizes, labels, loading state, and smooth animations.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Switch size',
      table: {
        type: { summary: 'SwitchSize' },
        defaultValue: { summary: 'md' },
      },
    },
    checked: {
      control: 'boolean',
      description: 'Controlled checked state',
      table: {
        type: { summary: 'boolean' },
      },
    },
    defaultChecked: {
      control: 'boolean',
      description: 'Initial checked state (uncontrolled)',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    loading: {
      control: 'boolean',
      description: 'Loading state',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    error: {
      control: 'boolean',
      description: 'Error state',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    required: {
      control: 'boolean',
      description: 'Required field',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    labelPosition: {
      control: 'select',
      options: ['start', 'end'],
      description: 'Label position',
      table: {
        type: { summary: "'start' | 'end'" },
        defaultValue: { summary: 'end' },
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
 * Default switch with label
 */
export const Default: Story = {
  args: {
    label: 'Enable notifications',
  },
};

/**
 * Switch without label (uses aria-label)
 */
export const WithoutLabel: Story = {
  args: {
    'aria-label': 'Toggle feature',
  },
};

// =============================================================================
// Sizes
// =============================================================================

/**
 * Switch sizes
 */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Switch size="sm" label="Small" />
      <Switch size="md" label="Medium (default)" />
      <Switch size="lg" label="Large" />
    </div>
  ),
};

// =============================================================================
// States
// =============================================================================

/**
 * Switch states
 */
export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Switch label="Default (off)" />
      <Switch label="Default (on)" defaultChecked />
      <Switch label="Disabled (off)" disabled />
      <Switch label="Disabled (on)" disabled defaultChecked />
      <Switch label="Loading" loading />
      <Switch label="Error" error helperText="This setting is required" />
    </div>
  ),
};

/**
 * Disabled state
 */
export const Disabled: Story = {
  args: {
    label: 'Unavailable feature',
    disabled: true,
  },
};

/**
 * Loading state
 */
export const Loading: Story = {
  args: {
    label: 'Saving...',
    loading: true,
  },
};

/**
 * Error state
 */
export const Error: Story = {
  args: {
    label: 'Required setting',
    error: true,
    helperText: 'This setting must be enabled',
  },
};

// =============================================================================
// Controlled Mode
// =============================================================================

/**
 * Controlled switch
 */
export const Controlled: Story = {
  render: function ControlledSwitch() {
    const [checked, setChecked] = useState(false);

    return (
      <div>
        <Switch label="Dark mode" checked={checked} onChange={setChecked} />
        <p className="mt-2 text-muted small">Status: {checked ? 'ON' : 'OFF'}</p>
      </div>
    );
  },
};

// =============================================================================
// Label Position
// =============================================================================

/**
 * Label positions
 */
export const LabelPositions: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Switch label="Label at end (default)" labelPosition="end" />
      <Switch label="Label at start" labelPosition="start" />
    </div>
  ),
};

// =============================================================================
// On/Off Text
// =============================================================================

/**
 * Switch with on/off text
 */
export const WithOnOffText: Story = {
  render: function OnOffTextSwitch() {
    const [checked, setChecked] = useState(false);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Switch label="Status" onText="ON" offText="OFF" checked={checked} onChange={setChecked} />
        <Switch
          label="Active"
          size="lg"
          onText="YES"
          offText="NO"
          checked={checked}
          onChange={setChecked}
        />
      </div>
    );
  },
};

// =============================================================================
// With Icons
// =============================================================================

/**
 * Switch with icons
 */
export const WithIcons: Story = {
  render: function IconSwitch() {
    const [checked, setChecked] = useState(false);

    const CheckIcon = (): React.JSX.Element => (
      <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
        <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
      </svg>
    );

    const XIcon = (): React.JSX.Element => (
      <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
        <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
      </svg>
    );

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Switch
          label="With icons"
          onIcon={<CheckIcon />}
          offIcon={<XIcon />}
          checked={checked}
          onChange={setChecked}
        />
        <Switch
          label="Large with icons"
          size="lg"
          onIcon={<CheckIcon />}
          offIcon={<XIcon />}
          checked={checked}
          onChange={setChecked}
        />
      </div>
    );
  },
};

// =============================================================================
// Helper Text
// =============================================================================

/**
 * Switch with helper text
 */
export const WithHelperText: Story = {
  args: {
    label: 'Email notifications',
    helperText: 'Receive updates about your account',
  },
};

// =============================================================================
// Required Field
// =============================================================================

/**
 * Required switch
 */
export const Required: Story = {
  args: {
    label: 'Accept terms and conditions',
    required: true,
  },
};

// =============================================================================
// Async Toggle
// =============================================================================

/**
 * Async toggle with loading state
 */
export const AsyncToggle: Story = {
  render: function AsyncSwitch() {
    const [checked, setChecked] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = async (newChecked: boolean): Promise<void> => {
      setLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setChecked(newChecked);
      setLoading(false);
    };

    return (
      <div>
        <Switch label="Auto-save" checked={checked} loading={loading} onChange={handleChange} />
        <p className="mt-2 text-muted small">
          {loading ? 'Saving...' : `Auto-save is ${checked ? 'enabled' : 'disabled'}`}
        </p>
      </div>
    );
  },
};

// =============================================================================
// Settings Panel
// =============================================================================

/**
 * Settings panel example
 */
export const SettingsPanel: Story = {
  render: function SettingsPanelExample() {
    const [settings, setSettings] = useState({
      notifications: true,
      darkMode: false,
      autoSave: true,
      analytics: false,
    });

    const updateSetting = (key: keyof typeof settings) => (value: boolean) => {
      setSettings((prev) => ({ ...prev, [key]: value }));
    };

    return (
      <div
        className="card p-4"
        style={{ maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '1rem' }}
      >
        <h5 className="mb-3">Settings</h5>
        <Switch
          label="Push notifications"
          checked={settings.notifications}
          onChange={updateSetting('notifications')}
          helperText="Receive push notifications"
        />
        <Switch
          label="Dark mode"
          checked={settings.darkMode}
          onChange={updateSetting('darkMode')}
          helperText="Use dark theme"
        />
        <Switch
          label="Auto-save"
          checked={settings.autoSave}
          onChange={updateSetting('autoSave')}
          helperText="Automatically save changes"
        />
        <Switch
          label="Analytics"
          checked={settings.analytics}
          onChange={updateSetting('analytics')}
          helperText="Help us improve with usage data"
        />
      </div>
    );
  },
};

// =============================================================================
// Form Example
// =============================================================================

/**
 * Form with switches
 */
export const FormExample: Story = {
  render: function FormSwitches() {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const data = Object.fromEntries(formData);
      alert(JSON.stringify(data, null, 2));
    };

    return (
      <form onSubmit={handleSubmit} style={{ maxWidth: '400px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Switch name="marketing" label="Marketing emails" defaultChecked />
          <Switch name="updates" label="Product updates" />
          <Switch name="newsletter" label="Weekly newsletter" defaultChecked />
          <button type="submit" className="btn btn-primary mt-2">
            Save Preferences
          </button>
        </div>
      </form>
    );
  },
};

// =============================================================================
// Complete Showcase
// =============================================================================

/**
 * Complete switch showcase
 */
export const CompleteShowcase: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '500px' }}>
      {/* Basic */}
      <div>
        <h4 style={{ marginBottom: '0.5rem' }}>Basic Switch</h4>
        <Switch label="Enable feature" />
      </div>

      {/* Sizes */}
      <div>
        <h4 style={{ marginBottom: '0.5rem' }}>Sizes</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Switch size="sm" label="Small" />
          <Switch size="md" label="Medium" />
          <Switch size="lg" label="Large" />
        </div>
      </div>

      {/* States */}
      <div>
        <h4 style={{ marginBottom: '0.5rem' }}>States</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Switch label="Disabled" disabled />
          <Switch label="Loading" loading />
          <Switch label="Error" error helperText="Required" />
          <Switch label="Required" required />
        </div>
      </div>

      {/* Features */}
      <div>
        <h4 style={{ marginBottom: '0.5rem' }}>Features</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Switch label="With on/off text" onText="ON" offText="OFF" />
          <Switch label="Label at start" labelPosition="start" />
          <Switch label="With helper" helperText="Additional information" />
        </div>
      </div>
    </div>
  ),
};
