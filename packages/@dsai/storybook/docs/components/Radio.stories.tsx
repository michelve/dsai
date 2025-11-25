import { useState } from 'react';

import { Radio, RadioGroup } from '@dsai/react';

import type { Meta, StoryObj } from '@storybook/react-vite';

/**
 * Radio button components for single-selection inputs.
 * Built with Bootstrap 5 design tokens and WCAG 2.2 AA compliance.
 *
 * @see https://getbootstrap.com/docs/5.3/forms/checks-radios/#radios
 */
const meta: Meta<typeof RadioGroup> = {
  title: 'Components/Radio',
  component: RadioGroup,
  subcomponents: { Radio } as Record<string, React.ComponentType<unknown>>,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Bootstrap 5 radio button components for single-selection inputs. ' +
          'Use RadioGroup to manage state and accessibility for a group of Radio buttons.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'text',
      description: 'Shared form field name',
      table: {
        type: { summary: 'string' },
      },
    },
    label: {
      control: 'text',
      description: 'Group label',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    value: {
      control: 'text',
      description: 'Controlled value',
      table: {
        type: { summary: 'string' },
      },
    },
    defaultValue: {
      control: 'text',
      description: 'Initial value (uncontrolled)',
      table: {
        type: { summary: 'string' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Disable all radios',
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
    helperText: {
      control: 'text',
      description: 'Helper or error message',
      table: {
        type: { summary: 'string' },
      },
    },
    inline: {
      control: 'boolean',
      description: 'Inline layout',
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
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// =============================================================================
// Basic Examples
// =============================================================================

/**
 * Default radio group with stacked layout
 */
export const Default: Story = {
  args: {
    name: 'default',
    label: 'Select an option',
    defaultValue: 'option1',
    children: undefined,
  },
  render: (args) => (
    <RadioGroup {...args}>
      <Radio value="option1" label="Option 1" />
      <Radio value="option2" label="Option 2" />
      <Radio value="option3" label="Option 3" />
    </RadioGroup>
  ),
};

/**
 * Radio group without default selection
 */
export const NoDefaultSelection: Story = {
  render: () => (
    <RadioGroup name="no-default" label="Choose your preference">
      <Radio value="a" label="Choice A" />
      <Radio value="b" label="Choice B" />
      <Radio value="c" label="Choice C" />
    </RadioGroup>
  ),
};

// =============================================================================
// Controlled Mode
// =============================================================================

/**
 * Controlled radio group with state
 */
export const Controlled: Story = {
  render: function ControlledRadioGroup() {
    const [value, setValue] = useState('medium');
    return (
      <div>
        <RadioGroup
          name="controlled"
          label="Select size"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        >
          <Radio value="small" label="Small" />
          <Radio value="medium" label="Medium" />
          <Radio value="large" label="Large" />
        </RadioGroup>
        <p className="mt-3 small text-muted">Selected: {value}</p>
      </div>
    );
  },
};

// =============================================================================
// Layout Options
// =============================================================================

/**
 * Inline radio layout
 */
export const Inline: Story = {
  render: () => (
    <RadioGroup name="inline" label="Alignment" inline defaultValue="center">
      <Radio value="left" label="Left" />
      <Radio value="center" label="Center" />
      <Radio value="right" label="Right" />
    </RadioGroup>
  ),
};

/**
 * Stacked layout (default)
 */
export const Stacked: Story = {
  render: () => (
    <RadioGroup name="stacked" label="Notification preferences" defaultValue="email">
      <Radio value="email" label="Email notifications" />
      <Radio value="sms" label="SMS notifications" />
      <Radio value="push" label="Push notifications" />
      <Radio value="none" label="No notifications" />
    </RadioGroup>
  ),
};

// =============================================================================
// States
// =============================================================================

/**
 * Disabled radio group
 */
export const Disabled: Story = {
  render: () => (
    <RadioGroup name="disabled" label="Disabled group" disabled defaultValue="1">
      <Radio value="1" label="Option 1" />
      <Radio value="2" label="Option 2" />
      <Radio value="3" label="Option 3" />
    </RadioGroup>
  ),
};

/**
 * Individual disabled option
 */
export const PartiallyDisabled: Story = {
  render: () => (
    <RadioGroup name="partial" label="Availability" defaultValue="available">
      <Radio value="available" label="Available" />
      <Radio value="limited" label="Limited availability" />
      <Radio value="unavailable" label="Unavailable" disabled />
    </RadioGroup>
  ),
};

/**
 * Error state
 */
export const Error: Story = {
  render: () => (
    <RadioGroup
      name="error"
      label="Terms and conditions"
      error
      helperText="Please select an option to continue"
    >
      <Radio value="accept" label="I accept the terms" />
      <Radio value="decline" label="I decline the terms" />
    </RadioGroup>
  ),
};

/**
 * Required field
 */
export const Required: Story = {
  render: () => (
    <RadioGroup name="required" label="Payment method" required>
      <Radio value="card" label="Credit card" />
      <Radio value="paypal" label="PayPal" />
      <Radio value="bank" label="Bank transfer" />
    </RadioGroup>
  ),
};

// =============================================================================
// Helper Text
// =============================================================================

/**
 * With helper text
 */
export const WithHelperText: Story = {
  render: () => (
    <RadioGroup
      name="helper"
      label="Subscription plan"
      helperText="You can change your plan at any time"
      defaultValue="monthly"
    >
      <Radio value="monthly" label="Monthly ($9.99/month)" />
      <Radio value="yearly" label="Yearly ($99/year - Save 17%)" />
    </RadioGroup>
  ),
};

// =============================================================================
// Form Integration
// =============================================================================

/**
 * Form with radio groups
 */
export const FormExample: Story = {
  render: function FormRadios() {
    const [formData, setFormData] = useState({
      size: 'medium',
      color: 'blue',
      shipping: 'standard',
    });

    const handleSubmit = (e: React.FormEvent): void => {
      e.preventDefault();
      alert(JSON.stringify(formData, null, 2));
    };

    return (
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <RadioGroup
            name="size"
            label="Size"
            value={formData.size}
            onChange={(e) => setFormData({ ...formData, size: e.target.value })}
          >
            <Radio value="small" label="Small" />
            <Radio value="medium" label="Medium" />
            <Radio value="large" label="Large" />
          </RadioGroup>

          <RadioGroup
            name="color"
            label="Color"
            inline
            value={formData.color}
            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
          >
            <Radio value="red" label="Red" />
            <Radio value="blue" label="Blue" />
            <Radio value="green" label="Green" />
          </RadioGroup>

          <RadioGroup
            name="shipping"
            label="Shipping"
            value={formData.shipping}
            onChange={(e) => setFormData({ ...formData, shipping: e.target.value })}
            helperText="Estimated delivery times may vary"
          >
            <Radio value="standard" label="Standard (5-7 days)" />
            <Radio value="express" label="Express (2-3 days)" />
            <Radio value="overnight" label="Overnight" />
          </RadioGroup>
        </div>

        <button type="submit" className="btn btn-primary mt-4">
          Submit Order
        </button>
      </form>
    );
  },
};

// =============================================================================
// Real-World Examples
// =============================================================================

/**
 * Survey question pattern
 */
export const SurveyQuestion: Story = {
  render: function Survey() {
    const [answer, setAnswer] = useState<string | undefined>();

    return (
      <div className="card p-4" style={{ maxWidth: '500px' }}>
        <RadioGroup
          name="satisfaction"
          label="How satisfied are you with our service?"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          required
        >
          <Radio value="5" label="Very satisfied" />
          <Radio value="4" label="Satisfied" />
          <Radio value="3" label="Neutral" />
          <Radio value="2" label="Dissatisfied" />
          <Radio value="1" label="Very dissatisfied" />
        </RadioGroup>
        <button
          className="btn btn-primary mt-3"
          disabled={!answer}
          onClick={() => alert(`You selected: ${answer}`)}
        >
          Submit
        </button>
      </div>
    );
  },
};

/**
 * Settings panel pattern
 */
export const SettingsPanel: Story = {
  render: function Settings() {
    const [theme, setTheme] = useState('system');
    const [language, setLanguage] = useState('en');

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '400px' }}>
        <RadioGroup
          name="theme"
          label="Theme"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
        >
          <Radio value="light" label="Light" />
          <Radio value="dark" label="Dark" />
          <Radio value="system" label="System default" />
        </RadioGroup>

        <RadioGroup
          name="language"
          label="Language"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <Radio value="en" label="English" />
          <Radio value="es" label="Español" />
          <Radio value="fr" label="Français" />
          <Radio value="de" label="Deutsch" />
        </RadioGroup>
      </div>
    );
  },
};

// =============================================================================
// Complete Showcase
// =============================================================================

/**
 * Complete radio showcase
 */
export const CompleteShowcase: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Basic */}
      <div>
        <h4 style={{ marginBottom: '0.5rem' }}>Basic Radio Group</h4>
        <RadioGroup name="basic" label="Select option" defaultValue="1">
          <Radio value="1" label="Option 1" />
          <Radio value="2" label="Option 2" />
          <Radio value="3" label="Option 3" />
        </RadioGroup>
      </div>

      {/* Inline */}
      <div>
        <h4 style={{ marginBottom: '0.5rem' }}>Inline Layout</h4>
        <RadioGroup name="inline-showcase" inline defaultValue="b">
          <Radio value="a" label="A" />
          <Radio value="b" label="B" />
          <Radio value="c" label="C" />
        </RadioGroup>
      </div>

      {/* States */}
      <div>
        <h4 style={{ marginBottom: '0.5rem' }}>States</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <RadioGroup name="disabled-showcase" label="Disabled" disabled defaultValue="1">
            <Radio value="1" label="Option 1" />
            <Radio value="2" label="Option 2" />
          </RadioGroup>

          <RadioGroup
            name="error-showcase"
            label="With Error"
            error
            helperText="Please make a selection"
          >
            <Radio value="1" label="Option 1" />
            <Radio value="2" label="Option 2" />
          </RadioGroup>

          <RadioGroup name="required-showcase" label="Required" required>
            <Radio value="1" label="Option 1" />
            <Radio value="2" label="Option 2" />
          </RadioGroup>
        </div>
      </div>

      {/* With Helper */}
      <div>
        <h4 style={{ marginBottom: '0.5rem' }}>With Helper Text</h4>
        <RadioGroup
          name="helper-showcase"
          label="Delivery speed"
          helperText="Additional fees may apply for express shipping"
          defaultValue="standard"
        >
          <Radio value="standard" label="Standard (Free)" />
          <Radio value="express" label="Express ($9.99)" />
        </RadioGroup>
      </div>
    </div>
  ),
};
